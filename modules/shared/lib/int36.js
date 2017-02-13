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

class Int36 {
    /**
     * Int36(hi, lo)
     *
     * The constructor creates an Int36 from either:
     *
     *      1) another Int36
     *      2) a single (signed) 36-bit value
     *      3) a pair of 18-bit values (the signs are irrelevant)
     *      4) nothing (initial value will be zero)
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
     * @param {Int36|number} [hi] (if omitted, the default is zero)
     * @param {number} [lo] (if present, both lo and hi must be 18-bit numbers)
     */
    constructor(hi = 0, lo)
    {
        if (hi instanceof Int36) {
            this.value = hi.value;
        }
        else if (isNaN(lo)) {
            /*
             * Checking isNaN(lo) includes checking for undefined.  And since there's no guarantee
             * that hi is within the 36-bit range, we call validate() to make sure.
             */
            this.value = Int36.validate(hi);
        } else {
            /*
             * We're masking both inputs to 18 bits, making them positive, so the result will
             * be positive and no more than 36 bits; however, the value could be greater than MAXVAL,
             * meaning the sign bit (bit 35) is set, in which case we must perform a two's complement
             * conversion, by subtracting 2^36.
             */
            this.value = (hi & Int36.MASKLO) * Int36.BIT18 + (lo & Int36.MASKLO);
            if (this.value > Int36.MAXVAL) {
                this.value -= Int36.BIT36;
            }
        }
        /*
         * The 'extended' property stores an additional 36 bits of data after a multiplication, and any
         * remainder after a division.  It's strictly an output-only property for those operations, and
         * its value does not affect the result of ANY operation.
         */
        this.extended = 0;
        this.error = Int36.ERROR.NONE;
    }

    /**
     * validate(num)
     *
     * @param {number} num
     * @return {number}
     */
    static validate(num)
    {
        var result = Math.trunc(num || 0) % Int36.BIT36;
        if (result > Int36.MAXVAL) {
            result -= Int36.BIT36;
        } else if (result < Int36.MINVAL) {
            result += Int36.BIT36;
        }
        if (DEBUG && num !== result) console.log("Int36.validate(" + num + " out of range, truncated to " + result + ")");
        return result;
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
     * toString(radix, fUnsigned)
     *
     * @param {number} [radix] (default is 10)
     * @param {boolean} [fUnsigned] (default is signed for radix 10, unsigned for any other radix)
     */
    toString(radix = 10, fUnsigned)
    {
        var s;
        var value = this.value;
        var extended = this.extended;
        if (radix == 8) {
            s = Int36.octal(value);
            if (extended) {
                s = Int36.octal(extended) + ',' + s;
            }
            if (DEBUG && this.error) s += " error 0x" + this.error.toString(16);
            return s;
        }
        if (radix != 10) fUnsigned = true;
        if (fUnsigned || extended) {
            if (value < 0) value += Int36.BIT36;
            if (extended) {
                if (fUnsigned) extended += Int36.BIT36;
                /*
                 * TODO: Come up with a solution that won't overflow JavaScript's more limited precision.
                 */
                value = extended * Int36.BIT36 + value;
            }
        }
        s = value.toString(radix);
        return s;
    }

    /**
     * truncate(result)
     *
     * NOTE: This function's job is to truncate the result of an operation to 36-bit accuracy,
     * not to remove any fractional portion that might also exist.  If an operation could have produced
     * a non-integer result (eg, div()), it's the caller's responsibility to deal with that first.
     *
     * @param {number} result
     * @return {number}
     */
    truncate(result)
    {
        if (DEBUG && result !== Math.trunc(result)) console.log("Int36.truncate(" + result + " is not an integer)");
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
     * @param {Int36} i36
     */
    add(i36) {
        this.value = this.truncate(this.value + i36.value);
    }

    /**
     * addNum(num)
     *
     * @param {number} num
     */
    addNum(num) {
        this.value = this.truncate(this.value + Int36.validate(num));
    }

    /**
     * sub(i36)
     *
     * @param {Int36} i36
     */
    sub(i36) {
        this.value = this.truncate(this.value - i36.value);
    }

    /**
     * subNum(num)
     *
     * @param {number} num
     */
    subNum(num) {
        this.value = this.truncate(this.value - Int36.validate(num));
    }

    /**
     * mul(i36)
     *
     * @param {Int36} i36
     */
    mul(i36) {
        this.mulExtended(i36.value);
    }

    /**
     * mulNum(num)
     *
     * @param {number} num
     */
    mulNum(num) {
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
     * @param {number} value
     */
    mulExtended(value) {
        var fNeg = false, extended;
        var n1 = this.value, n2 = value;

        if (n1 < 0) {
            n1 = -n1;
            fNeg = !fNeg;
        }

        if (n2 < 0) {
            n2 = -n2;
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

        if (fNeg) {
            value = -value;
            extended = -extended - (value? 1 : 0);
        }

        this.value = this.truncate(value);
        this.extended = this.truncate(extended);
    }

    /**
     * div(i36)
     *
     * TODO: Support division of dividends > 36 bits (ie, up to 72 bits) if an additional Int36
     * parameter is provided.
     *
     * WARNING: JavaScript division by zero returns Infinity (or -Infinity).  For now, we simply record an error.
     *
     * @param {Int36} i36
     */
    div(i36) {
        if (!i36.value) {
            this.error |= Int36.ERROR.DIVZERO;
        } else {
            this.value = this.truncate(Math.trunc(this.value / i36.value));
        }
    }

    /**
     * divNum(num)
     *
     * WARNING: JavaScript division by zero returns Infinity (or -Infinity).  For now, we simply record an error.
     *
     * @param {number} num
     */
    divNum(num) {
        var divisor = Int36.validate(num);
        if (!divisor) {
            this.error |= Int36.ERROR.DIVZERO;
        } else {
            this.value = this.truncate(Math.trunc(this.value / divisor));
        }
    }
}

Int36.ERROR = {
    NONE:       0x0,
    OVERFLOW:   0x1,
    UNDERFLOW:  0x2,
    DIVZERO:    0x4
};

Int36.MASKLO    = 0o777777;             //         262,143

Int36.BIT18     = Math.pow(2, 18);      //         262,144
Int36.BIT36     = Math.pow(2, 36);      //  68,719,476,736

Int36.MAXVAL    = Math.pow(2, 35) - 1;  //  34,359,738,367
Int36.MINVAL    = -Math.pow(2, 35);     // -34,359,738,368

if (NODE) module.exports = Int36;
