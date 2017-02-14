/**
 * @fileoverview Support for 36-bit integers
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

/**
 * @class Int36
 * @property {number} value
 * @property {number|null} extended
 * @property {number} remainder
 * @property {number} error
 *
 * The 'value' property stores the 36-bit value as a two's complement integer.
 *
 * The 'extended' property stores an additional 36 bits of data from a multiplication;
 * it must also be set prior to a division.
 *
 * The 'remainder' property stores the remainder from a division.
 *
 * The 'error' property records any error(s) from the last operation.
 */

class Int36 {
    /**
     * Int36(obj, extended)
     *
     * The constructor, which simply calls set(), creates an Int36 from either:
     *
     *      1) another Int36
     *      2) a single (signed) 36-bit value, with an optional 36-bit extended value
     *      3) nothing (initial value will be zero)
     *
     * We guarantee that an Int36 value will be (and will always remain) a signed value within this range:
     *
     *      -Math.pow(2, 35) <= i <= Math.pow(2, 35) - 1
     *
     * Those lower and upper bounds are defined as Int36.MINVAL and Int36.MAXVAL.  The sign of an Int36
     * value is determined by (and should always match) its highest bit (bit 35).
     *
     * NOTE: We use modern bit numbering, where bit 0 is the right-most (least-significant) bit and
     * bit 35 is the left-most bit.  This is opposite of the PDP-10 convention, which defined bit 0 as the
     * left-most bit and bit 35 as the right-most bit.
     *
     * Although the integer precision of JavaScript floating-point (IEEE 754 double-precision) numbers is:
     *
     *      -Math.pow(2, 53) <= i <= Math.pow(2, 53)
     *
     * it seems unwise to ever permit the internal value to creep outside the signed 36-bit range, because
     * floating-point operations will drop least-significant bits in favor of most-significant bits when a
     * result becomes too large, which is the opposite of what integer operations traditionally do.  There
     * might be some optimization benefits to performing our internal 36-bit truncation "lazily", but at
     * least initially, I prefer to truncate the results of all operations immediately.
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
     * @param {number} [extended]
     */
    constructor(obj, extended)
    {
        this.set(obj, extended);
        this.bitsDiv = [0, 0];
        this.bitsRem = [0, 0];
    }

    /**
     * set(obj, extended)
     *
     * @this {Int36}
     * @param {Int36|number} [obj] (if omitted, the default is zero)
     * @param {number} [extended]
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
            if (extended != null && !isNaN(extended)) {
                this.extended = Int36.validate(extended);
            }
            this.remainder = 0;
        }
        this.error = Int36.ERROR.NONE;
    }

    /**
     * toDecimal()
     *
     * @this {Int36}
     * @return {string}
     */
    toDecimal()
    {
        var s = "", fNeg = false;
        var i36Div = new Int36(10000000000);
        var i36Tmp = new Int36(this.value, this.extended);
        if (i36Tmp.extended < 0 || i36Tmp.extended == null && i36Tmp.value < 0) {
            i36Tmp.negExtended();
            fNeg = true;
        }
        var quotient = i36Tmp.div(i36Div);
        i36Tmp.value = i36Tmp.remainder;
        if (quotient) {
            var nDigits = 10;
            do {
                i36Tmp.divNum(10);
                s = String.fromCharCode(0x30 + i36Tmp.remainder) + s;
            } while (--nDigits);
            i36Tmp.value = quotient;
        }
        do {
            i36Tmp.divNum(10);
            s = String.fromCharCode(0x30 + i36Tmp.remainder) + s;
        } while (i36Tmp.value);
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
            if (DEBUG && this.error) s += " error 0x" + this.error.toString(16);
            return s;
        }

        if (radix != 10) {
            fUnsigned = true;
        } else {
            return this.toDecimal();
        }

        if (fUnsigned || extended) {
            if (value < 0) value += Int36.BIT36;
            if (extended) {
                if (fUnsigned) extended += Int36.BIT36;
                /*
                 * TODO: Need a radix-independent solution for these extended (up to 72-bit) values,
                 * because after 52 bits, JavaScript will start dropping least-significant bits.  Until
                 * then, you're better off sticking with octal (see above).
                 */
                value = extended * Int36.BIT36 + value;
            }
        }
        return value.toString(radix);
    }

    /**
     * truncate(result)
     *
     * NOTE: This function's job is to truncate the result of an operation to 36-bit accuracy,
     * not to remove any fractional portion that might also exist.  If an operation could have produced
     * a non-integer result (eg, div()), it's the caller's responsibility to deal with that first.
     *
     * @this {Int36}
     * @param {number} result
     * @return {number}
     */
    truncate(result)
    {
        if (DEBUG && result !== Math.trunc(result)) {
            console.log("Int36.truncate(" + result + " is not an integer)");
        }
        this.error = Int36.ERROR.NONE;
        if (result > Int36.MAXVAL) {
            result %= Int36.BIT36;
            if (result > Int36.MAXVAL) result -= Int36.BIT36;
            this.error |= Int36.ERROR.OVERFLOW;
        } else if (result < Int36.MINVAL) {
            result %= Int36.BIT36;
            if (result < Int36.MINVAL) result += Int36.BIT36;
            this.error |= Int36.ERROR.UNDERFLOW;
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
        this.value = this.truncate(this.value + i36.value);
    }

    /**
     * addNum(num)
     *
     * @this {Int36}
     * @param {number} num
     */
    addNum(num)
    {
        this.value = this.truncate(this.value + Int36.validate(num));
    }

    /**
     * sub(i36)
     *
     * @this {Int36}
     * @param {Int36} i36
     */
    sub(i36)
    {
        this.value = this.truncate(this.value - i36.value);
    }

    /**
     * subNum(num)
     *
     * @this {Int36}
     * @param {number} num
     */
    subNum(num)
    {
        this.value = this.truncate(this.value - Int36.validate(num));
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
     * treating each of the operands to be multiplied as two 2-digit numbers, where each digit is
     * an 18-bit number (base 2^18).  Each individual multiplication of these 18-bit "digits"
     * will produce a result within 2^36, well within JavaScript integer accuracy.
     *
     * @this {Int36}
     * @param {number} value
     */
    mulExtended(value)
    {
        var fNeg = false, extended;
        var n1 = this.value, n2 = value;

        if (n1 < 0) {
            if (n1) n1 = -n1;
            fNeg = !fNeg;
        }

        if (n2 < 0) {
            if (n2) n2 = -n2;
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

        if (fNeg) this.negExtended();
    }

    /**
     * div(i36)
     *
     * @this {Int36}
     * @param {Int36} i36
     * @return {number} (quotient)
     */
    div(i36)
    {
        return this.divExtended(i36.value);
    }

    /**
     * divNum(num)
     *
     * @this {Int36}
     * @param {number} num
     * @return {number} (quotient)
     */
    divNum(num)
    {
        return this.divExtended(Int36.validate(num));
    }

    /**
     * divExtended(divisor)
     *
     * @this {Int36}
     * @param {number} divisor
     * @return {number} (quotient)
     */
    divExtended(divisor)
    {
        /*
         *      dividend    divisor       quotient    remainder
         *      --------    -------       --------    ---------
         *         +           +     ->       +           +
         *         +           -     ->       -           +
         *         -           +     ->       -           -
         *         -           -     ->       +           -
         */
        var bNegLo = 0, bNegHi = 0;

        if (divisor < 0 && divisor > Int36.MINVAL) {
            divisor = -divisor;
            bNegLo = 1 - bNegLo;
        }

        if (this.extended < 0 || this.extended == null && this.value < 0) {
            this.negExtended();
            bNegHi = 1; bNegLo = 1 - bNegLo;
        }

        var value = this.value;
        var extended = this.extended || 0;

        if (value < 0) {
            value += Int36.BIT36;
        }

        if (!divisor) {
            this.error |= Int36.ERROR.DIVZERO;
        }
        else if (divisor <= extended) {
            this.error |= Int36.ERROR.OVERFLOW;
        }
        else {
            var result = 0, bit = 1;
            var bitsDiv = Int36.setBits(this.bitsDiv, divisor, 0);
            var bitsRem = Int36.setBits(this.bitsRem, value, extended);

            while (Int36.cmpBits(bitsRem, bitsDiv) > 0) {
                Int36.addBits(bitsDiv, bitsDiv);
                bit += bit;
            }

            do {
                if (Int36.cmpBits(bitsRem, bitsDiv) >= 0) {
                    Int36.subBits(bitsRem, bitsDiv);
                    result += bit;
                }
                Int36.shrBits(bitsDiv);
                bit /= 2;
            } while (bit >= 1);

            if (DEBUG && !(result < Int36.BIT36 && !bitsRem[1])) {
                console.log("divExtended() assertion failure");
            }

            this.value = result;
            this.extended = 0;
            this.remainder = bitsRem[0];

            if (bNegLo && this.value && this.value > Int36.MINVAL) {
                this.value = -this.value;
            }
            if (bNegHi && this.remainder && this.remainder > Int36.MINVAL) {
                this.remainder = -this.remainder;
            }
        }
        return this.value;
    }

    /**
     * negExtended()
     *
     * Converts the current value to its two's complement.  If we were dealing with 8-bit values:
     *
     *   Original  Two's   One's
     *   -------   -----   -----
     *      -128    -128     127
     *      -127     127     126
     *       ...     ...     ...
     *        -1       1       0
     *         0       0      -1
     *         1      -1      -2
     *       ...     ...     ...
     *       126    -126    -127
     *       127    -127    -128
     *
     * So the one wrinkle is that, when performing two's complement, MINVAL and ZERO are not modified.
     *
     * However, in our world, since JavaScript numbers CAN represent both positive and negative MINVAL
     * values, we don't need to exclude MINVAL from the process.
     */
    negExtended()
    {
        this.error = Int36.ERROR.NONE;
        /*
         * Perform two's complement on the value.
         */
        if (this.value /* && this.value > Int36.MINVAL */) {
            this.value = -this.value;
        }
        if (this.extended == null) {
            /*
             * Set extended to match the sign of the value.
             */
            this.extended = (this.value < 0? -1 : 0);
        }
        else if (this.value) {
            /*
             * Perform one's complement on the extended value.
             */
            this.extended = -this.extended - 1;
        }
        else {
            /*
             * Perform two's complement on the extended value.
             */
            if (this.extended /* && this.extended > Int36.MINVAL */) {
                this.extended = -this.extended;
            }
        }
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
     * setBits(bits, lo, hi)
     *
     * @param {Array.<number>} bits
     * @param {number} lo
     * @param {number} hi
     * @return {Array.<number>}
     */
    static setBits(bits, lo, hi)
    {
        bits[0] = lo;
        bits[1] = hi;
        return bits;
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
     * @param {number} num
     * @return {number}
     */
    static validate(num)
    {
        var value = Math.trunc(num) % Int36.BIT36;
        if (value > Int36.MAXVAL) {
            value -= Int36.BIT36;
        } else if (value < Int36.MINVAL) {
            value += Int36.BIT36;
        }
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
Int36.BIT36     =  Math.pow(2, 36);     //  68,719,476,736

Int36.MAXVAL    =  Math.pow(2, 35) - 1; //  34,359,738,367
Int36.MINVAL    = -Math.pow(2, 35);     // -34,359,738,368

if (NODE) module.exports = Int36;
