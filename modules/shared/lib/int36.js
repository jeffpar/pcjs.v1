/**
 * @fileoverview Support for 36-bit integers (using unsigned JavaScript numbers)
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
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

var DEBUG = true;

/*
    From the "PDP-10 System Reference Manual", May 1968, p. 1-4:

    1.1 NUMBER SYSTEM

    The program can interpret a data word as a 36-digit, unsigned binary number, or the left and right
    halves of a word can be taken as separate 18-bit numbers.  The PDP-10 repertoire includes instructions
    that effectively add or subtract one from both halves of a word, so the right half can be used for
    address modification when the word is addressed as an index register, while the left half is used to
    keep a control count.

    The standard arithmetic instructions in the PDP-10 use twos complement, fixed point conventions to do
    binary arithmetic.  In a word used as a number, bit 0 (the leftmost bit) represents the sign, 0 for positive,
    1 for negative.  In a positive number the remaining 35 bits are the magnitude in ordinary binary notation.
    The negative of a number is obtained by taking its twos complement. If x is an n-digit binary number, its
    twos complement is 2^n - x, and its ones complement is (2^n - 1) - x, or equivalently (2^n - x) - 1.

    Subtracting a number from 2^n - 1 (ie, from all 1s) is equivalent to performing the logical complement,
    ie changing all 0s to 1s and all 1s to 0s.  Therefore, to form the twos complement one takes the logical
    complement (usually referred to merely as the complement) of the entire word including the sign, and adds
    1 to the result.  In a negative number the sign bit is 1, and the remaining bits are the twos complement
    of the magnitude.

    Zero is represented by a word containing all 0s.  Complementing this number produces all 1s, and adding
    1 to that produces all 0s again.  Hence there is only one zero representation and its sign is positive.
    Since the numbers are symmetrical in magnitude about a single zero representation, all even numbers both
    positive and negative end in 0, all odd numbers in 1 (a number all 1s represents -1).  But since there are
    the same number of positive and negative numbers and zero is positive, there is one more negative number
    than there are nonzero positive numbers.  This is the most negative number and it cannot be produced by
    negating any positive number (its octal representation is 400000 000000 and its magnitude is one greater
    than the largest positive number).


    If ones complements were used for negatives one could read a negative number by attaching significance
    to the as instead of the 1s.  In twos complement notation each negative number is one greater than the
    complement of the positive number of the same magnitude, so one can read a negative number by attaching
    significance to the rightmost 1 and attaching significance to the 0s at the left of it (the negative number
    of largest magnitude has a 1 in only the sign position).  In a negative integer, 1s may be discarded at the
    left, just as leading 0s may be dropped in a positive integer.  In a negative fraction, 0s may be discarded
    at the right.  So long as only 0s are discarded, the number remains in twos complement form because it
    still has a 1 that possesses significance; but if a portion including the rightmost 1 is discarded, the
    remaining part of the fraction is now a ones complement.

    The computer does not keep track of a binary point - the programmer must adopt a point convention and shift
    the magnitude of the result to conform to the convention used.  Two common conventions are to regard a number
    as an integer (binary point at the right) or as a proper fraction (binary point at the left); in these two
    cases the range of numbers represented by a single word is -2^35 to 2^35 - 1, or -1 to 1 - 2^35.  Since
    multiplication and division make use of double length numbers, there are special instructions for performing
    these operations with integral operands.

    SIDEBAR: Multiplication produces a double length product, and the programmer must remember that discarding
    the low order part of a double length negative leaves the high order part in correct twos complement form
    only if the low order part is null.

    ...

    2.5 FIXED POINT ARITHMETIC

    For fixed point arithmetic the PDP-10 has instructions for arithmetic shifting (which is essentially
    multiplication by a power of 2) as well as for performing addition, subtraction, multiplication and division
    of numbers in fixed point format [§ 1.1].  In such numbers the position of the binary point is arbitrary
    (the programmer may adopt any point convention).  The add and subtract instructions involve only single length
    numbers, whereas multiply supplies a double length product, and divide uses a double length dividend.  The high
    and low order words respectively of a double length fixed point number are in accumulators A and A+1 (mod 20),
    where the magnitude is the 70-bit string in bits 1-35 of the two words and the signs of the two are identical.
    There are also integer multiply and divide instructions that involve only single length numbers and are
    especially suited for handling smaller integers, particularly those of eighteen bits or less such as addresses
    (of course they can be used for small fractions as well provided the programmer keeps track of the binary point).
    For convenience in the following, all operands are assumed to be integers (binary point at the right).

    The processor has four flags, Overflow, Carry 0, Carry 1 and No Divide, that indicate when the magnitude of a
    number is or would be larger than can be accommodated.  Carry 0 and Carry 1 actually detect carries out of bits
    0 and 1 in certain instructions that employ fixed point arithmetic operations: the add and subtract instructions
    treated here, the move instructions that produce the negative or magnitude of the word moved [§ 2.2], and the
    arithmetic test instructions that increment or decrement the test word [§ 2.7].  In these instructions an
    incorrect result is indicated - and the Overflow flag set - if the carries are different, ie if there is a carry
    into the sign but not out of it, or vice versa.  The Overflow flag is also set by No Divide being set, which
    means the processor has failed to perform a division because the magnitude of the dividend is greater than or
    equal to that of the divisor, or in integer divide, simply that the divisor is zero.  In other overflow cases
    only Overflow itself is set: these include too large a product in multiplication, and loss of significant bits
    in left arithmetic shifting.

    SIDEBAR: Overflow is determined directly from the carries, not from the carry flags, as their states may reflect
    events in previous instructions.
 */


/**
 * @class Int36
 * @property {number} value
 * @property {number|null} extended
 * @property {number|null} remainder
 * @property {number} error
 *
 * The 'value' property stores the 36-bit value as an unsigned integer.  When the value should be
 * interpreted as a signed quantity, subtract BIT36 whenever value > MAXPOS.
 *
 * The 'extended' property stores an additional 36 bits of data from a multiplication, and can also
 * provide an additional 36 bits of data to a division.  Internally, it should be null whenever the
 * value is not extended.
 *
 * The 'remainder' property stores the remainder from the last division.  You should assume it will
 * be set to null by any other operation.
 *
 * The 'error' property records any error(s) from the last operation.
 *
 * NOTE: What we call extended Int36 values DEC refers to as "double length numbers", and they refer
 * to the 'extended' portion as the "low order part" and the 'value' portion as the "high order part",
 * presumably because they number the left-most significant bit 0.
 */

class Int36 {
    /**
     * Int36(obj, extended)
     *
     * The constructor, which simply calls set(), creates an Int36 from either:
     *
     *      1) another Int36
     *      2) a single 36-bit value, with an optional 36-bit extension
     *      3) nothing (initial value will be zero)
     *
     * All internal Int36 values (ie, the value and any extension) are unsigned values in the range:
     *
     *      0 <= i <= Math.pow(2, 36) - 1
     *
     * The lower bound is ZERO and the upper bound is Int36.MAXVAL.  Whenever an Int36 value should be
     * interpreted as a signed value, values above Int36.MAXPOS (ie, values with bit 35 set) should be
     * converted to their signed counterpart by subtracting the value from Int36.BIT36 (aka MAXVAL + 1);
     * the easiest way to do that is call isNegative() to check the sign bit and then call negate() as
     * appropriate.
     *
     * NOTE: We use modern bit numbering, where bit 0 is the right-most (least-significant) bit and
     * bit 35 is the left-most bit.  This is opposite of the PDP-10 convention, which defined bit 0 as the
     * left-most bit and bit 35 as the right-most bit.
     *
     * Although the integer precision of JavaScript floating-point (IEEE 754 double-precision) numbers is:
     *
     *      -Math.pow(2, 53) <= i <= Math.pow(2, 53)
     *
     * it seems unwise to ever permit our internal values to creep outside the 36-bit range, because
     * floating-point operations will drop least-significant bits in favor of most-significant bits when a
     * result becomes too large, which is the opposite of what integer operations traditionally do.  There
     * might be some optimization benefits to performing our internal 36-bit truncation "lazily", but at
     * least initially, I prefer to truncate() the results of all 36-bit arithmetic operations immediately.
     *
     * Most of the Int36 operations come in two flavors: those that accept numbers, and those that accept
     * another Int36.  The latter are more efficient, because (as just explained) an Int36's internal value
     * should always be in range, whereas external numbers could be out of range OR have a fractional value
     * OR be something else entirely (NaN, Infinity, -Infinity, undefined, etc), so numeric inputs are
     * always passed through the static validate() function.
     *
     * We could eliminate the two flavors and check each parameter's type, like we do in the constructor,
     * but constructor calls are infrequent (if they're not, you're doing something wrong), whereas Int36-only
     * operations should be as fast and unchecked as possible.
     *
     * @this {Int36}
     * @param {Int36|number} [obj] (if omitted, the default is zero)
     * @param {number|null} [extended]
     */
    constructor(obj, extended)
    {
        this.set(obj, extended);
    }

    /**
     * set(obj, extended)
     *
     * @this {Int36}
     * @param {Int36|number} [obj] (if omitted, the default is zero)
     * @param {number|null} [extended]
     */
    set(obj = 0, extended)
    {
        if (obj instanceof Int36) {
            this.value = obj.value;
            this.extended = obj.extended;
            this.remainder = obj.remainder;
        }
        else {
            this.value = Int36.validate(obj || 0);
            this.extended = null;
            /*
             * NOTE: Surprisingly, isNaN(null) is false, whereas isNaN(undefined) is true.  Go figure.
             */
            if (extended != null && !isNaN(extended)) {
                this.extended = Int36.validate(extended);
            }
            this.remainder = null;
        }
        this.error = Int36.ERROR.NONE;
    }

    /**
     * toDecimal(fUnsigned)
     *
     * @this {Int36}
     * @param {boolean} fUnsigned
     * @return {string}
     */
    toDecimal(fUnsigned)
    {
        var s = "", fNeg = false;
        var i36Div = new Int36(10000000000);
        var i36Rem = new Int36();
        var i36Tmp = new Int36(this.value, this.extended);

        if (!fUnsigned && i36Tmp.isNegative()) {
            i36Tmp.negate();
            fNeg = true;
        }
        /*
         * Conversion of any 72-bit value should take no more than 3 divisions by 10,000,000,000.
         */
        var nMaxDivs = 3;
        do {
            i36Tmp.div(i36Div);
            /*
             * In a perfect world, there would be no errors, because all calculations at this point
             * are within known bounds.  But let's make sure we don't produce garbage or spin our wheels.
             */
            if (i36Tmp.error || i36Tmp.remainder >= 10000000000 || !nMaxDivs--) {
                s = "error";
                break;
            }
            var quotient = i36Tmp.value || i36Tmp.extended;
            var nMinDigits = (quotient? 10 : 1);
            i36Rem.set(i36Tmp.remainder);
            do {
                i36Rem.divNum(10);
                if (i36Rem.remainder < 0 || i36Rem.remainder > 9) {
                    quotient = 0;
                    s = "error";
                    break;
                }
                s = String.fromCharCode(0x30 + i36Rem.remainder) + s;
            } while (--nMinDigits > 0 || i36Rem.value);
        } while (quotient);

        if (fNeg) s = '-' + s;
        return s;
    }

    /**
     * toString(radix, fUnsigned)
     *
     * @this {Int36}
     * @param {number} [radix] (default is 10)
     * @param {boolean} [fUnsigned] (default is signed for radix 10, unsigned for any other radix)
     * @return {string}
     */
    toString(radix = 10, fUnsigned)
    {
        if (radix == 10) {
            return this.toDecimal(fUnsigned);
        }

        var value = this.value;
        var extended = this.extended;

        if (radix == 8) {
            var s = Int36.octal(value);
            if (extended) {
                s = Int36.octal(extended) + ',' + s;
            }
            if (this.remainder) {
                s += ':' + Int36.octal(this.remainder);
            }
            if (DEBUG && this.error) {
                if (this.error & Int36.ERROR.OVERFLOW) {
                    s += " overflow";
                }
                if (this.error & Int36.ERROR.UNDERFLOW) {
                    s += " underflow";
                }
                if (this.error & Int36.ERROR.DIVZERO) {
                    s += " divide-by-zero";
                }
            }
            return s;
        }

        if (extended != null) {
            /*
             * TODO: Need a radix-independent solution for these extended (up to 72-bit) values,
             * because after 52 bits, JavaScript will start dropping least-significant bits.  Until
             * then, you're better off sticking with octal (see above).
             */
            value = extended * Int36.BIT36 + value;
        }
        return value.toString(radix);
    }

    /**
     * truncate(result, operand, fSub)
     *
     * The range of valid results (0 - MAXVAL) is divided into two equal sub-ranges: 0 to MAXPOS,
     * where the sign bit is zero (the bottom range), and MAXPOS+1 to MAXVAL (the top range), where
     * the sign bit is one.  During a single arithmetic operation, the result can "wrap around" from
     * the bottom range to the top, or from the top range to the bottom, but it's an overflow/underflow
     * error ONLY if the result "wraps across" the midpoint between the two ranges, producing an
     * unnaturally small delta (<= MAXPOS).
     *
     * This can be confirmed independently by examining the sign bits (BIT35) of the original value
     * (V), the operand (O), the result (R), as well as two intermediate calculations, VR = (V ^ R)
     * and OR = (O ^ R), and a final calculation, E = (VR & OR).  If E is set, then overflow (V == 0)
     * or underflow (V == 1) occurred.
     *
     * In the case of subtraction (when fSub is true), consult the second table, which replaces OR
     * with OV (O ^ V).
     *
     *      V   O   R   VR  OR  E
     *      -   -   -   --  --  -
     *      0   0   0   0   0   0
     *      0   0   1   1   1   1 (adding positive to positive yielded negative: overflow)
     *      0   1   0   0   1   0
     *      0   1   1   1   0   0
     *      1   0   0   1   0   0
     *      1   0   1   0   1   0
     *      1   1   0   1   1   1 (adding negative to negative yielded positive: underflow)
     *      1   1   1   0   0   0
     *
     *      V   O   R   VR  OV  E
     *      -   -   -   --  --  -
     *      0   0   0   0   0   0
     *      0   0   1   1   0   0
     *      0   1   0   0   1   0
     *      0   1   1   1   1   1 (subtracting negative from positive yielded negative: overflow)
     *      1   0   0   1   1   1 (subtracting positive from negative yielded positive: underflow)
     *      1   0   1   0   1   0
     *      1   1   0   1   0   0
     *      1   1   1   0   0   0
     *
     * NOTE: This function's job is to truncate the result of an operation to 36-bit accuracy,
     * not to remove any fractional portion that might also exist.  If an operation could have produced
     * a non-integer result (eg, div()), it's the caller's responsibility to deal with that first.
     *
     * @this {Int36}
     * @param {number} result
     * @param {number} [operand]
     * @param {boolean} [fSub] (true if operand was subtracted)
     * @return {number}
     */
    truncate(result, operand, fSub)
    {
        if (DEBUG && result !== Math.trunc(result)) {
            console.log("Int36.truncate(" + result + " is not an integer)");
        }

        this.extended = null;
        this.remainder = null;
        this.error = Int36.ERROR.NONE;

        if (result < 0) {
            result += Int36.BIT36;
        }

        result %= Int36.BIT36;

        /*
         * We don't actually need to know what the operand was to determine overflow or underflow
         * for addition or subtraction, just the original value (this.value) the new value (result).
         *
         * We do, however, need to know the operand if we want to confirm our error calculation using
         * the truth table above, which requires examining the sign bits of all the inputs and outputs.
         */
        if (operand !== undefined) {
            /*
             * Calculating V, R, O, and E as described above is somewhat tedious, because bits
             * above bit 31 cannot be accessed directly; we shift all the sign bits down to bit 0
             * using division first.  We don't need to truncate the results, because the subsequent
             * bit-wise operations perform truncation automatically.
             */
            var e = 0;
            if (DEBUG) {
                var v = this.value / Int36.BIT35, r = result / Int36.BIT35, o = operand / Int36.BIT35;
                e = ((v ^ r) & (o ^ (fSub? v : r))) & 1;
            }
            if ((result > Int36.MAXPOS) != (this.value > Int36.MAXPOS)) {
                var delta = result - this.value;
                if (Math.abs(delta) <= Int36.MAXPOS) {
                    this.error |= (delta > 0 ? Int36.ERROR.OVERFLOW : Int36.ERROR.UNDERFLOW);
                    if (DEBUG && (delta > 0) != !(e & v)) e = 0;
                }
            }
            if (DEBUG && (!this.error) != (!e)) console.log("overflow inconsistency");
        }
        return result;
    }

    /**
     * add(i36)
     *
     * @this {Int36}
     * @param {Int36} i36
     */
    add(i36)
    {
        this.value = this.truncate(this.value + i36.value, i36.value);
    }

    /**
     * addNum(num)
     *
     * @this {Int36}
     * @param {number} num
     */
    addNum(num)
    {
        num = Int36.validate(num);
        this.value = this.truncate(this.value + num, num);
    }

    /**
     * sub(i36)
     *
     * @this {Int36}
     * @param {Int36} i36
     */
    sub(i36)
    {
        this.value = this.truncate(this.value - i36.value, i36.value, true);
    }

    /**
     * subNum(num)
     *
     * @this {Int36}
     * @param {number} num
     */
    subNum(num)
    {
        num = Int36.validate(num);
        this.value = this.truncate(this.value - num, num, true);
    }

    /**
     * mul(i36)
     *
     * @this {Int36}
     * @param {Int36} i36
     */
    mul(i36)
    {
        this.mulExtended(i36.value);
    }

    /**
     * mulNum(num)
     *
     * @this {Int36}
     * @param {number} num
     */
    mulNum(num)
    {
        this.mulExtended(Int36.validate(num));
    }

    /**
     * mulExtended(value)
     *
     * To support 72-bit results, we perform the multiplication process as you would "by hand",
     * treating the operands to be multiplied as two 2-digit numbers, where each "digit" is an 18-bit
     * number (base 2^18).  Each individual multiplication of these 18-bit "digits" will produce
     * a result within 2^36, well within JavaScript integer accuracy.
     *
     * @this {Int36}
     * @param {number} value
     */
    mulExtended(value)
    {
        var fNeg = false, extended;
        var n1 = this.value, n2 = value;

        if (n1 > Int36.MAXPOS) {
            n1 = Int36.BIT36 - n1;
            fNeg = !fNeg;
        }

        if (n2 > Int36.MAXPOS) {
            n2 = Int36.BIT36 - n2;
            fNeg = !fNeg;
        }

        if (n1 < Int36.BIT18 && n2 < Int36.BIT18) {
            value = n1 * n2;
            extended = 0;
        }
        else {
            var n1d1 = (n1 % Int36.BIT18);
            var n1d2 = Math.trunc(n1 / Int36.BIT18);
            var n2d1 = (n2 % Int36.BIT18);
            var n2d2 = Math.trunc(n2 / Int36.BIT18);

            var m1d1 = n1d1 * n2d1;
            var m1d2 = (n1d2 * n2d1) + Math.trunc(m1d1 / Int36.BIT18);
            extended = Math.trunc(m1d2 / Int36.BIT18);
            m1d2 = (m1d2 % Int36.BIT18) + (n1d1 * n2d2);
            value = (m1d2 * Int36.BIT18) + (m1d1 % Int36.BIT18);
            extended += Math.trunc(m1d2 / Int36.BIT18) + (n1d2 * n2d2);
        }

        this.value = this.truncate(value);
        this.extended = this.truncate(extended);

        if (fNeg) this.negate();
    }

    /**
     * div(i36)
     *
     * @this {Int36}
     * @param {Int36} i36
     */
    div(i36)
    {
        this.divExtended(i36.value);
    }

    /**
     * divNum(num)
     *
     * @this {Int36}
     * @param {number} num
     */
    divNum(num)
    {
        this.divExtended(Int36.validate(num));
    }

    /**
     * divExtended(divisor)
     *
     * We disallow a divisor of zero; however, we no longer disallow a divisor smaller than the
     * extended portion of the dividend, even though such a divisor would produce a quotient larger
     * than 36 bits.  Instead, we support extended quotients, because some of our internal functions
     * (eg, toDecimal()) require it.
     *
     * For callers that can only handle 36-bit quotients, they can either perform their own preliminary
     * check of the divisor against any extended dividend, or they can simply allow all divisions to
     * proceed, check for an extended quotient afterward, and report the appropriate error.
     *
     * @this {Int36}
     * @param {number} divisor
     */
    divExtended(divisor)
    {
        if (!divisor) {
            this.error |= Int36.ERROR.DIVZERO;
            return;
        }

        var fNegQ = false, fNegR = false;

        if (divisor > Int36.MAXPOS) {
            divisor = Int36.BIT36 - divisor;
            fNegQ = !fNegQ;
        }

        if (this.isNegative()) {
            this.negate();
            fNegR = true; fNegQ = !fNegQ;
        }

        this.extend();

        /*
         * Initialize the four double-length 72-bit "bits" values we need for the division process.
         *
         * The process involves shifting the divisor left 1 bit (ie, doubling it) until it equals
         * or exceeds the dividend, and then repeatedly subtracting the divisor from the dividend and
         * shifting the divisor right 1 bit until the divisor is "exhausted" (no bits left), with an
         * "early out" if the dividend gets "exhausted" first.
         *
         * Note that each element of these "bits" arrays is a 36-bit value, so it's rarely a good idea
         * to use bit-wise operators on them, because those would operate on only the low 32 bits.
         * Stick with the "bits" worker functions I've created, and trust your JavaScript engine to
         * inline/optimize the code.
         *
         * TODO: Profile this code to determine if individual variables (eg, bitsResLo and bitsResHi)
         * instead of 2-element arrays is faster and/or less impactful on garbage collection.  I prefer
         * both the simplified syntax of arrays as well as their extensibility if we ever want/need
         * to go beyond 72 bits.
         */
        var bitsRes = [0, 0];
        var bitsPow = [1, 0];
        var bitsDiv = [divisor, 0];
        var bitsRem = [this.value, this.extended];

        while (Int36.cmpBits(bitsRem, bitsDiv) > 0) {
            Int36.addBits(bitsDiv, bitsDiv);
            Int36.addBits(bitsPow, bitsPow);
        }
        do {
            if (Int36.cmpBits(bitsRem, bitsDiv) >= 0) {
                Int36.subBits(bitsRem, bitsDiv);
                Int36.addBits(bitsRes, bitsPow);
                if (Int36.zeroBits(bitsRem)) break;
            }
            Int36.shrBits(bitsDiv);
            Int36.shrBits(bitsPow);
        } while (!Int36.zeroBits(bitsPow));

        /*
         * Since divisors are limited to 36-bit values, something's wrong if we have an extended remainder.
         */
        if (DEBUG && bitsRem[1]) {
            console.log("divExtended() assertion failure");
        }

        this.value = bitsRes[0];
        this.extended = bitsRes[1];
        this.remainder = bitsRem[0];

        if (fNegQ) this.negate();

        this.reduce();

        if (fNegR && this.remainder) {
            this.remainder = Int36.BIT36 - this.remainder;
        }
    }

    /**
     * extend()
     *
     * Sets extended to match the sign of value (if not already set).
     */
    extend()
    {
        if (this.extended == null) {
            this.extended = (this.value > Int36.MAXPOS? Int36.MAXVAL : 0);
        }
    }

    /**
     * reduce()
     *
     * Unsets extended if it's superfluous; opposite of extend().
     *
     * It's worth noting DEC's SIDEBAR comment (from above):
     *
     *      Multiplication produces a double length product, and the programmer must remember that discarding
     *      the low order part ['extended'] of a double length negative leaves the high order part ['value'] in
     *      correct twos complement form only if the low order part ['extended'] is null.
     *
     * is not entirely applicable to us.  For one thing, when value is MINNEG and extended is ZERO, we interpret
     * that extended value as 34,359,738,368; we cannot simply eliminate the extended portion, otherwise value
     * would be interpreted as -34,359,738,368.
     *
     * DEC can say that because each of the words in a PDP-10 double-length product contains its own sign bit,
     * resulting in only 70 bits of magnitude.  However, we don't store our extended (double-length) results that
     * way, so be aware of these mismatches in both terminology and format when converting an Int36 to/from PDP-10
     * registers/memory.
     */
    reduce()
    {
        if (this.extended == 0 && this.value <= Int36.MAXPOS || this.extended == Int36.MAXVAL && this.value > Int36.MAXPOS) {
            this.extended = null;
        }
    }

    /**
     * isNegative()
     *
     * @return {boolean}
     */
    isNegative()
    {
        return (this.extended > Int36.MAXPOS || this.extended == null && this.value > Int36.MAXPOS);
    }

    /**
     * negate()
     *
     * negate() MUST automatically extend the value, because the two's complement of the most negative
     * number (MINNEG) still has its sign bit set, so we must rely on the sign of the extended value to
     * compensate.
     *
     * This is handled below by setting extended first, based on the opposite of the value's current sign;
     * we could negate extended AFTER negating value, but then we'd need a special test for the MINNEG value.
     */
    negate()
    {
        if (this.extended == null) {
            /*
             * Set extended to the OPPOSITE of the current value.
             */
            this.extended = (this.value > Int36.MAXPOS? 0 : Int36.MAXVAL);
        }
        else if (this.value) {
            /*
             * Perform one's complement on the extended value.
             */
            this.extended = Int36.MAXVAL - this.extended;
        }
        else {
            /*
             * Perform two's complement on the extended value.
             */
            if (this.extended) this.extended = Int36.BIT36 - this.extended;
        }
        /*
         * Perform two's complement on the value.
         */
        if (this.value) {
            this.value = Int36.BIT36 - this.value;
        }
        this.error = Int36.ERROR.NONE;
    }

    /**
     * addBits(bitsDst, bitsSrc)
     *
     * Adds bitsSrc to bitsDst.
     *
     * @param {Array.<number>} bitsDst
     * @param {Array.<number>} bitsSrc
     */
    static addBits(bitsDst, bitsSrc)
    {
        bitsDst[0] += bitsSrc[0];
        bitsDst[1] += bitsSrc[1];
        if (bitsDst[0] >= Int36.BIT36) {
            bitsDst[0] %= Int36.BIT36;
            bitsDst[1]++;
        }
    }

    /**
     * cmpBits(bitsDst, bitsSrc)
     *
     * Compares bitsDst to bitsSrc, by computing bitsDst - bitsSrc.
     *
     * @param {Array.<number>} bitsDst
     * @param {Array.<number>} bitsSrc
     * @return {number} > 0 if bitsDst > bitsSrc, == 0 if bitsDst == bitsSrc, < 0 if bitsDst < bitsSrc
     */
    static cmpBits(bitsDst, bitsSrc)
    {
        var result = bitsDst[1] - bitsSrc[1];
        if (!result) result = bitsDst[0] - bitsSrc[0];
        return result;
    }

    /**
     * shrBits(bitsDst)
     *
     * Shifts bitsDst right one bit.
     *
     * @param {Array.<number>} bitsDst
     */
    static shrBits(bitsDst)
    {
        if (bitsDst[1] % 2) {
            bitsDst[0] += Int36.BIT36;
        }
        bitsDst[0] = Math.trunc(bitsDst[0] / 2);
        bitsDst[1] = Math.trunc(bitsDst[1] / 2);
    }

    /**
     * subBits(bitsDst, bitsSrc)
     *
     * Subtracts bitsSrc from bitsDst.
     *
     * @param {Array.<number>} bitsDst
     * @param {Array.<number>} bitsSrc
     */
    static subBits(bitsDst, bitsSrc)
    {
        bitsDst[0] -= bitsSrc[0];
        bitsDst[1] -= bitsSrc[1];
        if (bitsDst[0] < 0) {
            bitsDst[0] += Int36.BIT36;
            bitsDst[1]--;
        }
    }

    /**
     * zeroBits(bits)
     *
     * True if bits are all zero, false otherwise.
     *
     * @param {Array.<number>} bits
     */
    static zeroBits(bits)
    {
        return !bits[0] && !bits[1];
    }

    /**
     * octal(value)
     *
     * @param {number} value
     * @return {string}
     */
    static octal(value)
    {
        if (value < 0) value += Int36.BIT36;
        return ("00000000000" + value.toString(8)).slice(-12);
    }

    /**
     * validate(num)
     *
     * This ensures that any incoming (external) 36-bit values conform to our internal requirements.
     *
     * @param {number} num
     * @return {number}
     */
    static validate(num)
    {
        /*
         * Although it's expected that most callers will supply unsigned 36-bit values, we're nice about
         * converting any signed values to their unsigned (two's complement) counterpart, provided they are
         * within the acceptable range.  Any values outside that range will be dealt with afterward.
         */
        if (num < 0 && num >= Int36.MINNEG) {
            num += Int36.BIT36;
        }
        var value = Math.trunc(Math.abs(num)) % Int36.BIT36;
        if (DEBUG && num !== value) {
            console.log("Int36.validate(" + num + " out of range, truncated to " + value + ")");
        }
        return value;
    }
}

Int36.ERROR = {
    NONE:       0x0,
    OVERFLOW:   0x1,
    UNDERFLOW:  0x2,
    DIVZERO:    0x4
};

Int36.BIT18     =  Math.pow(2, 18);     //         262,144
Int36.BIT35     =  Math.pow(2, 35);     //  34,359,738,368 (aka the sign bit)
Int36.BIT36     =  Math.pow(2, 36);     //  68,719,476,736

Int36.MAXPOS    =  Math.pow(2, 35) - 1; //  34,359,738,367
Int36.MINNEG    = -Math.pow(2, 35);     // -34,359,738,368

Int36.MAXVAL    =  Math.pow(2, 36) - 1; //  68,719,476,735

if (NODE) module.exports = Int36;
