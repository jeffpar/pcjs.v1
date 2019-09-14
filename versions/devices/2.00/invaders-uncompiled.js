"use strict";

/**
 * @copyright https://www.pcjs.org/modules/devices/lib/defs.js (C) Jeff Parsons 2012-2019
 */

/**
 * @define {boolean}
 */
var COMPILED = false;

/**
 * @define {boolean}
 */
var DEBUG = true;

/**
 * @define {boolean}
 */
var MAXDEBUG = false;

/**
 * @define {string}
 */
var VERSION = "2.00";

/**
 * @class {Defs}
 * @unrestricted
 */
class Defs {
    /**
     * Defs()
     *
     * @this {Defs}
     */
    constructor()
    {
    }
}

/**
 * @copyright https://www.pcjs.org/modules/devices/lib/numio.js (C) Jeff Parsons 2012-2019
 */

/**
 * @class {NumIO}
 * @unrestricted
 */
class NumIO extends Defs {
    /**
     * NumIO()
     *
     * String to integer conversion:
     *
     *      isInt()
     *      parseInt()
     *
     * Integer to string conversion:
     *
     *      toBase()
     *
     * Bit operations (for values with more than 32 bits):
     *
     *      clearBits()
     *      setBits()
     *      testBits()
     *
     * Initially, this file was going to be called "stdlib.js", since the C runtime library file "stdlib.h"
     * defines numeric conversion functions like atoi().  But stdlib has too many other functions that have
     * nothing to do with data conversion, and we have many conversion functions that you won't find in stdlib.
     * So I settled on "numio.js" instead.
     *
     * @this {NumIO}
     */
    constructor()
    {
        super();
    }

    /**
     * isInt(s, base)
     *
     * The built-in parseInt() function has the annoying feature of returning a partial value (ie,
     * up to the point where it encounters an invalid character); eg, parseInt("foo", 16) returns 0xf.
     *
     * So it's best to use our own parseInt() function, which will in turn use this function to validate
     * the entire string.
     *
     * @this {NumIO}
     * @param {string} s is the string representation of some number
     * @param {number} [base] is the radix to use (default is 10); only 2, 8, 10 and 16 are supported
     * @return {boolean} true if valid, false if invalid (or the specified base isn't supported)
     */
    isInt(s, base)
    {
        if (!base || base == 10) return s.match(/^-?[0-9]+$/) !== null;
        if (base == 16) return s.match(/^-?[0-9a-f]+$/i) !== null;
        if (base == 8) return s.match(/^-?[0-7]+$/) !== null;
        if (base == 2) return s.match(/^-?[01]+$/) !== null;
        return false;
    }

    /**
     * parseInt(s, base)
     *
     * This is a wrapper around the built-in parseInt() function.  Our wrapper recognizes certain prefixes
     * ('$' or "0x" for hex, '#' or "0o" for octal) and suffixes ('.' for decimal, 'h' for hex, 'y' for
     * binary), and then calls isInt() to ensure we don't convert strings that contain partial values;
     * see isInt() for details.
     *
     * The use of multiple prefix/suffix combinations is undefined (although for the record, we process
     * prefixes first).  We do NOT support the "0b" prefix to indicate binary UNLESS one or more commas are
     * also present (because "0b" is also a valid hex sequence), and we do NOT support a single leading zero
     * to indicate octal (because such a number could also be decimal or hex).  Any number of commas are
     * allowed; we remove them all before calling the built-in parseInt().
     *
     * More recently, we've added support for "^D", "^O", and "^B" prefixes to accommodate the base overrides
     * that the PDP-10's MACRO-10 assembly language supports (decimal, octal, and binary, respectively).
     * If this support turns out to adversely affect other debuggers, then it will have to be "conditionalized".
     * Similarly, we've added support for "K", "M", and "G" MACRO-10-style suffixes that add 3, 6, or 9 zeros
     * to the value to be parsed, respectively.
     *
     * @this {NumIO}
     * @param {string} s is the string representation of some number
     * @param {number} [base] is the radix to use (default is 10); can be overridden by prefixes/suffixes
     * @return {number|undefined} corresponding value, or undefined if invalid
     */
    parseInt(s, base)
    {
        let value;

        if (s) {
            if (!base) base = 10;

            let ch, chPrefix, chSuffix;
            let fCommas = (s.indexOf(',') > 0);
            if (fCommas) s = s.replace(/,/g, '');

            ch = chPrefix = s.charAt(0);
            if (chPrefix == '#') {
                base = 8;
                chPrefix = '';
            }
            else if (chPrefix == '$') {
                base = 16;
                chPrefix = '';
            }
            if (ch != chPrefix) {
                s = s.substr(1);
            }
            else {
                ch = chPrefix = s.substr(0, 2);
                if (chPrefix == '0b' && fCommas || chPrefix == '^B') {
                    base = 2;
                    chPrefix = '';
                }
                else if (chPrefix == '0o' || chPrefix == '^O') {
                    base = 8;
                    chPrefix = '';
                }
                else if (chPrefix == '^D') {
                    base = 10;
                    chPrefix = '';
                }
                else if (chPrefix == '0x') {
                    base = 16;
                    chPrefix = '';
                }
                if (ch != chPrefix) s = s.substr(2);
            }
            ch = chSuffix = s.slice(-1);
            if (chSuffix == 'Y' || chSuffix == 'y') {
                base = 2;
                chSuffix = '';
            }
            else if (chSuffix == '.') {
                base = 10;
                chSuffix = '';
            }
            else if (chSuffix == 'H' || chSuffix == 'h') {
                base = 16;
                chSuffix = '';
            }
            else if (chSuffix == 'K') {
                chSuffix = '000';
            }
            else if (chSuffix == 'M') {
                chSuffix = '000000';
            }
            else if (chSuffix == 'G') {
                chSuffix = '000000000';
            }
            if (ch != chSuffix) s = s.slice(0, -1) + chSuffix;
            /*
             * This adds support for the MACRO-10 binary shifting (Bn) suffix, which must be stripped from the
             * number before parsing, and then applied to the value after parsing.  If n is omitted, 35 is assumed,
             * which is a net shift of zero.  If n < 35, then a left shift of (35 - n) is required; if n > 35, then
             * a right shift of -(35 - n) is required.
             */
            let v, shift = 0;
            if (base <= 10) {
                let match = s.match(/(-?[0-9]+)B([0-9]*)/);
                if (match) {
                    s = match[1];
                    shift = 35 - ((match[2] || 35) & 0xff);
                }
            }
            if (this.isInt(s, base) && !isNaN(v = parseInt(s, base))) {
                /*
                 * With the need to support larger (eg, 36-bit) integers, truncating to 32 bits is no longer helpful.
                 *
                 *      value = v|0;
                 */
                if (shift) {
                    /*
                     * Since binary shifting is a logical operation, and since shifting by division only works properly
                     * with positive numbers, we must convert a negative value to a positive value, by computing the two's
                     * complement.
                     */
                    if (v < 0) v += Math.pow(2, 36);
                    if (shift > 0) {
                        v *= Math.pow(2, shift);
                    } else {
                        v = Math.trunc(v / Math.pow(2, -shift));
                    }
                }
                value = v;
            }
        }
        return value;
    }

    /**
     * toBase(n, base, cch, prefix, nGrouping)
     *
     * Converts the given number (as an unsigned integer) to a string using the specified base (radix).
     *
     * sprintf() may be a better choice, depending on your needs (eg, signed integers, formatting options, etc.)
     * and support for the desired radix (eg, 8, 10, and 16).
     *
     * @this {NumIO}
     * @param {number|*} n
     * @param {number} [base] (ie, the radix)
     * @param {number} [cch] (the desired number of digits, -1 for variable)
     * @param {string} [prefix] (default is selected based on radix; use "" for none)
     * @param {number} [nGrouping]
     * @return {string}
     */
    toBase(n, base, cch = -1, prefix = undefined, nGrouping = 0)
    {
        /*
         * We can't rely entirely on isNaN(), because isNaN(null) returns false, and we can't rely
         * entirely on typeof either, because typeof NaN returns "number".  Sigh.
         *
         * Alternatively, we could mask and shift n regardless of whether it's null/undefined/NaN,
         * since JavaScript coerces such operands to zero, but I think there's "value" in seeing those
         * values displayed differently.
         */
        let s = "", suffix = "";
        if (!base) base = this.nDefaultBase || 10;
        if (prefix == undefined) {
            switch(base) {
            case 8:
                prefix = "0o";
                break;
            case 16:
                prefix = "0x";
                break;
            case 10:
                suffix = ".";
                /* falls through */
            default:
                prefix = "";
                break;
            }
        }
        if (isNaN(n) || typeof n != "number") {
            n = null;
            prefix = suffix = "";
        } else {
            /*
             * Callers that produced an input by dividing by a power of two rather than shifting (in order
             * to access more than 32 bits) may produce a fractional result, which ordinarily we would simply
             * ignore, but if the integer portion is zero and the sign is negative, we should probably treat
             * this value as a sign-extension.
             */
            if (n < 0 && n > -1) n = -1;
            /*
             * Negative values should be two's complemented according to the number of digits; for example,
             * 12 octal digits implies an upper limit 8^12.
             */
            if (n < 0) {
                n += Math.pow(base, cch);
            }
            if (n >= Math.pow(base, cch)) {
                cch = Math.ceil(Math.log(n) / Math.log(base));
            }
        }
        let g = nGrouping || -1;
        while (cch--) {
            if (!g) {
                s = ',' + s;
                g = nGrouping;
            }
            if (n == null) {
                s = '?' + s;
                if (cch < 0) break;
            } else {
                let d = n % base;
                d += (d >= 0 && d <= 9? 0x30 : 0x41 - 10);
                s = String.fromCharCode(d) + s;
                if (!n && cch < 0) break;
                n = Math.trunc(n / base);
            }
            g--;
        }
        return prefix + s + suffix;
    }

    /**
     * clearBits(num, bits)
     *
     * Function for clearing bits in numbers with more than 32 bits.
     *
     * @this {NumIO}
     * @param {number} num
     * @param {number} bits
     * @return {number} (num & ~bits)
     */
    clearBits(num, bits)
    {
        let shift = NumIO.TWO_POW32;
        let numHi = (num / shift)|0;
        let bitsHi = (bits / shift)|0;
        return (num & ~bits) + (numHi & ~bitsHi) * shift;
    }

    /**
     * setBits(num, bits)
     *
     * Function for setting bits in numbers with more than 32 bits.
     *
     * @this {NumIO}
     * @param {number} num
     * @param {number} bits
     * @return {number} (num | bits)
     */
    setBits(num, bits)
    {
        let shift = NumIO.TWO_POW32;
        let numHi = (num / shift)|0;
        let bitsHi = (bits / shift)|0;
        return (num | bits) + (numHi | bitsHi) * shift;
    }

    /**
     * testBits(num, bits)
     *
     * Function for testing bits in numbers with more than 32 bits.
     *
     * @this {NumIO}
     * @param {number} num
     * @param {number} bits
     * @return {boolean} (true IFF num & bits == bits)
     */
    testBits(num, bits)
    {
        let shift = NumIO.TWO_POW32;
        let numHi = (num / shift)|0;
        let bitsHi = (bits / shift)|0;
        return ((num & bits) == (bits|0) && (numHi & bitsHi) == bitsHi);
    }
}

/*
 * Assorted constants
 */
NumIO.TWO_POW32 = Math.pow(2, 32);

/**
 * @copyright https://www.pcjs.org/modules/devices/lib/stdio.js (C) Jeff Parsons 2012-2019
 */

/**
 * @class {StdIO}
 * @unrestricted
 */
class StdIO extends NumIO {
    /**
     * StdIO()
     *
     * Summary of functions:
     *
     *      flush()
     *      isDate()
     *      parseDate()
     *      print()
     *      printf()
     *      println()
     *      sprintf()
     *      toHex()
     *
     * This class is called "StdIO" rather than "stdio" because classes are global entities and I prefer global
     * entities to begin with a capital letter and use camelCase.  And its methods are primarily object functions
     * rather than class functions, because the parent objects are typically Device objects which may wish to have
     * unique "print" bindings.  Mingling every object's print output in the same container may not be desired.
     *
     * The filename "stdio.js" is inspired by the C runtime library file "stdio.h", since it includes printf()
     * and sprintf() functions that have many C-like features, but they also have many differences (both additions
     * and omissions).  And you will find other functions here that have no counterpart in "stdio.h", so don't take
     * the name too seriously.
     *
     * @this {StdIO}
     */
    constructor()
    {
        super();
    }

    /**
     * flush()
     *
     * @this {StdIO}
     */
    flush()
    {
        let buffer = StdIO.PrintBuffer;
        StdIO.PrintBuffer = "";
        this.print(buffer);
    }

    /**
     * isDate(date)
     *
     * @this {StdIO}
     * @param {Date} date
     * @return {boolean}
     */
    isDate(date)
    {
        return !isNaN(date.getTime());
    }

    /**
     * parseDate(date)
     * parseDate(date, time)
     * parseDate(year, month, day, hour, minute, second)
     *
     * Produces a UTC date when ONLY a date (no time) is provided; otherwise, it combines the date and
     * and time, producing a date that is either UTC or local, depending on the presence (or lack) of time
     * zone information.  Finally, if numeric inputs are provided, then Date.UTC() is called to generate
     * a UTC time.
     *
     * In general, you should use this instead of new Date(s), because the Date constructor implicitly calls
     * Date.parse(s), which behaves inconsistently.  For example, ISO date-only strings (e.g. "1970-01-01")
     * generate a UTC time, but non-ISO date-only strings (eg, "10/1/1945" or "October 1, 1945") generate a
     * local time.
     *
     * @this {StdIO}
     * @param {...} args
     * @return {Date} (UTC unless a time string with a non-GMT timezone is explicitly provided)
     */
    parseDate(...args)
    {
        let date;
        if (args[0] === undefined) {
            date = new Date(Date.now());
        }
        else if (typeof args[0] === "string") {
            date = new Date(args[0] + ' ' + (args[1] || "00:00:00 GMT"));
        }
        else if (args[1] === undefined) {
            date = new Date(args[0]);
        } else {
            date = new Date(Date.UTC(...args));
        }
        return date;
    }

    /**
     * print(s, fBuffer)
     *
     * @this {StdIO}
     * @param {string} s
     * @param {boolean} [fBuffer] (true to always buffer; otherwise, only buffer the last partial line)
     */
    print(s, fBuffer)
    {
        if (!fBuffer) {
            let i = s.lastIndexOf('\n');
            if (i >= 0) {
                console.log(StdIO.PrintBuffer + s.substr(0, i));
                StdIO.PrintBuffer = "";
                s = s.substr(i + 1);
            }
        }
        StdIO.PrintBuffer += s;
    }

    /**
     * println(s, fBuffer)
     *
     * @this {StdIO}
     * @param {string} s
     * @param {boolean} [fBuffer] (true to always buffer; otherwise, only buffer the last partial line)
     */
    println(s, fBuffer)
    {
        this.print(s + '\n', fBuffer);
    }

    /**
     * printf(format, ...args)
     *
     * @this {StdIO}
     * @param {string} format
     * @param {...} args
     */
    printf(format, ...args)
    {
        this.print(this.sprintf(format, ...args));
    }

    /**
     * sprintf(format, ...args)
     *
     * Copied from the CCjs project (https://github.com/jeffpar/ccjs/blob/master/lib/stdio.js) and extended.
     *
     * Far from complete, let alone sprintf-compatible, but it's adequate for the handful of sprintf-style format
     * specifiers that I use.
     *
     * @this {StdIO}
     * @param {string} format
     * @param {...} args
     * @returns {string}
     */
    sprintf(format, ...args)
    {
        let buffer = "";
        let aParts = format.split(/%([-+ 0#]*)([0-9]*|\*)(\.[0-9]+|)([hlL]?)([A-Za-z%])/);

        let iArg = 0, iPart;
        for (iPart = 0; iPart < aParts.length - 6; iPart += 6) {

            buffer += aParts[iPart];
            let arg, type = aParts[iPart+5];

            /*
             * Check for unrecognized types immediately, so we don't inadvertently pop any arguments;
             * the first 12 ("ACDFHIMNSTWY") are for our non-standard Date extensions (see below).
             *
             * For reference purposes, the standard ANSI C set of format types is: "dioxXucsfeEgGpn%".
             */
            let iType = "ACDFHIMNSTWYbdfjcsoXx%".indexOf(type);
            if (iType < 0) {
                buffer += '%' + aParts[iPart+1] + aParts[iPart+2] + aParts[iPart+3] + aParts[iPart+4] + type;
                continue;
            }

            if (iArg < args.length) {
                arg = args[iArg];
                if (type != '%') iArg++;
            } else {
                arg = args[args.length-1];
            }
            let flags = aParts[iPart+1];
            let width = aParts[iPart+2];
            if (width == '*') {
                width = arg;
                if (iArg < args.length) {
                    arg = args[iArg++];
                } else {
                    arg = args[args.length-1];
                }
            } else {
                width = +width || 0;
            }
            let precision = aParts[iPart+3];
            precision = precision? +precision.substr(1) : -1;
            // let length = aParts[iPart+4];       // eg, 'h', 'l' or 'L' (all currently ignored)
            let hash = flags.indexOf('#') >= 0;
            let zeroPad = flags.indexOf('0') >= 0;
            let ach = null, s, radix = 0, prefix = ""

            /*
             * The following non-standard sprintf() format codes provide handy alternatives to the
             * PHP date() format codes that we used to use with the old datelib.formatDate() function:
             *
             *      a:  lowercase ante meridiem and post meridiem (am or pm)                %A
             *      d:  day of the month, 2 digits with leading zeros (01, 02, ..., 31)     %02D
             *      D:  3-letter day of the week ("Sun", "Mon", ..., "Sat")                 %.3W
             *      F:  month ("January", "February", ..., "December")                      %F
             *      g:  hour in 12-hour format, without leading zeros (1, 2, ..., 12)       %I
             *      h:  hour in 24-hour format, without leading zeros (0, 1, ..., 23)       %H
             *      H:  hour in 24-hour format, with leading zeros (00, 01, ..., 23)        %02H
             *      i:  minutes, with leading zeros (00, 01, ..., 59)                       %02N
             *      j:  day of the month, without leading zeros (1, 2, ..., 31)             %D
             *      l:  day of the week ("Sunday", "Monday", ..., "Saturday")               %W
             *      m:  month, with leading zeros (01, 02, ..., 12)                         %02M
             *      M:  3-letter month ("Jan", "Feb", ..., "Dec")                           %.3F
             *      n:  month, without leading zeros (1, 2, ..., 12)                        %M
             *      s:  seconds, with leading zeros (00, 01, ..., 59)                       %02S
             *      y:  2-digit year (eg, 14)                                               %0.2Y
             *      Y:  4-digit year (eg, 2014)                                             %Y
             *
             * We also support a few custom format codes:
             *
             *      %C:  calendar output (equivalent to: %W, %F %D, %Y)
             *      %T:  timestamp output (equivalent to: %Y-%02M-%02D %02H:%02N:%02S)
             *
             * Use the optional '#' flag with any of the above '%' format codes to produce UTC results
             * (eg, '%#I' instead of '%I').
             *
             * The %A, %F, and %W types act as strings (which support the '-' left justification flag, as well as
             * the width and precision options), and the rest act as integers (which support the '0' padding flag
             * and the width option).  Also, while %Y does act as an integer, it also supports truncation using the
             * precision option (normally, integers do not); this enables a variable number of digits for the year.
             *
             * So old code like this:
             *
             *      printf("%s\n", formatDate("l, F j, Y", date));
             *
             * can now be written like this:
             *
             *      printf("%W, %F %D, %Y\n", date, date, date, date);
             *
             * or even more succinctly, as:
             *
             *      printf("%C\n", date);
             *
             * In fact, even the previous example can be written more succinctly as:
             *
             *      printf("%W, %F %D, %Y\n", date);
             *
             * because unlike the C runtime, we reuse the final parameter once the format string has exhausted all parameters.
             */
            let ch, date = /** @type {Date} */ (iType < 12 && typeof arg != "object"? this.parseDate(arg) : arg), dateUndefined;

            switch(type) {
            case 'C':
                ch = hash? '#' : '';
                buffer += (this.isDate(date)? this.sprintf(this.sprintf("%%%sW, %%%sF %%%sD, %%%sY", ch), date) : dateUndefined);
                continue;

            case 'D':
                arg = hash? date.getUTCDate() : date.getDate();
                type = 'd';
                break;

            case 'A':
            case 'H':
            case 'I':
                arg = hash? date.getUTCHours() : date.getHours();
                if (type == 'A') {
                    arg = (arg < 12 ? "am" : "pm");
                    type = 's';
                }
                else {
                    if (type == 'I') {
                        arg = (!arg? 12 : (arg > 12 ? arg - 12 : arg));
                    }
                    type = 'd';
                }
                break;

            case 'F':
            case 'M':
                arg = hash? date.getUTCMonth() : date.getMonth();
                if (type == 'F') {
                    arg = StdIO.NamesOfMonths[arg];
                    type = 's';
                } else {
                    arg++;
                    type = 'd';
                }
                break;

            case 'N':
                arg = hash? date.getUTCMinutes() : date.getMinutes();
                type = 'd';
                break;

            case 'S':
                arg = hash? date.getUTCSeconds() : date.getSeconds();
                type = 'd'
                break;

            case 'T':
                ch = hash? '#' : '';
                buffer += (this.isDate(date)? this.sprintf(this.sprintf("%%%sY-%%%s02M-%%%s02D %%%s02H:%%%s02N:%%%s02S", ch), date) : dateUndefined);
                continue;

            case 'W':
                arg = StdIO.NamesOfDays[hash? date.getUTCDay() : date.getDay()];
                type = 's';
                break;

            case 'Y':
                arg = hash? date.getUTCFullYear() : date.getFullYear();
                if (precision > 0) {
                    arg = arg % (Math.pow(10, precision));
                    precision = -1;
                }
                type = 'd';
                break;
            }

            switch(type) {
            case 'b':
                /*
                 * "%b" for boolean-like values is a non-standard format specifier that seems handy.
                 */
                buffer += (arg? "true" : "false");
                break;

            case 'd':
                /*
                 * We could use "arg |= 0", but there may be some value to supporting integers > 32 bits.
                 *
                 * Also, unlike the 'X' and 'x' hexadecimal cases, there's no need to explicitly check for string
                 * arguments, because Math.trunc() automatically coerces any string value to a (decimal) number.
                 */
                arg = Math.trunc(arg);
                /* falls through */

            case 'f':
                s = arg + "";
                if (precision >= 0) {
                    s = arg.toFixed(precision);
                }
                if (s.length < width) {
                    if (zeroPad) {
                        if (arg < 0) {
                            width--;
                            s = s.substr(1);
                        }
                        s = ("0000000000" + s).slice(-width);
                        if (arg < 0) s = '-' + s;
                    } else {
                        s = ("          " + s).slice(-width);
                    }
                }
                buffer += s;
                break;

            case 'j':
                /*
                 * 'j' is one of our non-standard extensions to the sprintf() interface; it signals that
                 * the caller is providing an Object that should be rendered as JSON.  If a width is included
                 * (eg, "%2j"), it's used as an indentation value; otherwise, no whitespace is added.
                 */
                buffer += JSON.stringify(arg, null, width || undefined);
                break;

            case 'c':
                arg = typeof arg == "string"? arg[0] : String.fromCharCode(arg);
                /* falls through */

            case 's':
                /*
                 * 's' includes some non-standard behavior, such as coercing non-strings to strings first.
                 */
                if (arg !== undefined) {
                    if (typeof arg != "string") {
                        arg = arg.toString();
                    }
                    if (precision >= 0) {
                        arg = arg.substr(0, precision);
                    }
                    while (arg.length < width) {
                        if (flags.indexOf('-') >= 0) {
                            arg += ' ';
                        } else {
                            arg = ' ' + arg;
                        }
                    }
                }
                buffer += arg;
                break;

            case 'o':
                radix = 8;
                if (hash) prefix = "0";
                /* falls through */

            case 'X':
                ach = StdIO.HexUpperCase;
                // if (hash) prefix = "0X";     // I don't like that %#X uppercases both the prefix and the value
                /* falls through */

            case 'x':
                s = "";
                if (!radix) radix = 16;
                if (!prefix && hash) prefix = "0x";
                if (!ach) ach = StdIO.HexLowerCase;
                if (typeof arg == "string") {
                    /*
                     * Since we're advised to ALWAYS pass a radix to parseInt(), we must detect explicitly
                     * hex values ourselves, because using a radix of 10 with any "0x..." value always returns 0.
                     *
                     * And if the value CAN be interpreted as decimal, then we MUST interpret it as decimal, because
                     * we have sprintf() calls in /modules/pcx86/lib/testmon.js that depend on this code to perform
                     * decimal to hex conversion.  We're going to make our own rules here, since passing numbers in
                     * string form isn't part of the sprintf "spec".
                     */
                    arg = Number.parseInt(arg, arg.match(/(^0x|[a-f])/i)? 16 : 10);
                }
                if (zeroPad && !width) {
                    /*
                     * When zero padding is specified without a width (eg, "%0x"), we select a width based on the value.
                     */
                    let v = Math.abs(arg);
                    if (v <= 0xffff) {
                        width = 4;
                    } else if (v <= 0xffffffff) {
                        width = 8;
                    } else {
                        width = 9;
                    }
                }
                width -= prefix.length;
                do {
                    let d = arg & (radix - 1);
                    arg >>>= (radix == 16? 4 : 3);
                    if (zeroPad || !s || d || arg) {
                        s = ach[d] + s;
                    } else {
                        if (prefix) {
                            s = prefix + s;
                            prefix = "";
                        }
                        if (width > 0) s = ' ' + s;
                    }
                } while (--width > 0 || arg);
                buffer += prefix + s;
                break;

            case '%':
                buffer += '%';
                break;

            default:
                buffer += "(unimplemented printf type %" + type + ")";
                break;
            }
        }

        buffer += aParts[iPart];
        return buffer;
    }

    /**
     * toHex(n)
     *
     * This is a helper function mainly intended for use in a debugging console, allowing you to display numbers
     * as hex by evaluating the expression "this.toHex(n)".
     *
     * In a C runtime, you might use "itoa(n, buffer, 16)", which would be in "stdlib" instead of "stdio", and
     * it would not display a "0x" prefix; however, since we're relying on sprintf() to perform all our number
     * to string conversions, and sprintf() is a "stdio" function, we're keeping all these related functions here.
     *
     * @this {StdIO}
     * @param {number} n
     */
    toHex(n)
    {
        return this.sprintf("%#x", n);
    }
}

/*
 * Global variables
 */
StdIO.PrintBuffer = "";

/*
 * Global constants
 */
StdIO.HexLowerCase = "0123456789abcdef";
StdIO.HexUpperCase = "0123456789ABCDEF";
StdIO.NamesOfDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
StdIO.NamesOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * @copyright https://www.pcjs.org/modules/devices/lib/webio.js (C) Jeff Parsons 2012-2019
 */

/*
 * List of standard message groups.  Note that parseCommand() assumes the first three entries
 * are special mask values and will not display them as "settable" message groups.
 *
 * NOTE: To support more than 32 message groups, be sure to use "+", not "|", when concatenating.
 */
var MESSAGES = {
    ALL:        0xffffffffffff,
    NONE:       0x000000000000,
    DEFAULT:    0x000000000000,
    BUFFER:     0x800000000000,
};

var Messages = MESSAGES.NONE;

/** @typedef {{ class: (string|undefined), bindings: (Object|undefined), version: (number|undefined), status: (string|undefined), overrides: (Array.<string>|undefined) }} */
var Config;

/**
 * @class {WebIO}
 * @unrestricted
 * @property {string} idMachine
 * @property {string} idDevice
 * @property {Config} config
 * @property {Object} bindings
 * @property {number} messages
 * @property {string} sCommandPrev
 */
class WebIO extends StdIO {
    /**
     * WebIO()
     *
     * Supported config properties:
     *
     *      "bindings": object containing name/value pairs, where name is the generic name
     *      of a element, and value is the ID of the DOM element that should be mapped to it
     *
     * The properties in the "bindings" object are copied to our own bindings object in addBindings(),
     * but only for DOM elements that actually exist, and it is the elements themselves (rather than
     * their IDs) that we store.
     *
     * Also, URL parameters can be used to override config properties.  For example, the URL:
     *
     *      http://localhost:4000/?cyclesPerSecond=100000
     *
     * will set the Time device's cyclesPerSecond config property to 100000.  In general, the values
     * will be treated as strings, unless they contain all digits (number), or equal "true" or "false"
     * (boolean).
     *
     * @this {WebIO}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     * @param {number} [version]
     */
    constructor(idMachine, idDevice, config, version)
    {
        super();
        this.idMachine = idMachine;
        this.idDevice = idDevice;
        this.messages = 0;
        this.bindings = {};
        this.sCommandPrev = "";
        this.checkConfig(config);
        this.checkVersion(version);
    }

    /**
     * addBinding(binding, element)
     *
     * @this {WebIO}
     * @param {string} binding
     * @param {Element} element
     */
    addBinding(binding, element)
    {
        let webIO = this, elementTextArea;

        switch (binding) {

        case WebIO.BINDING.CLEAR:
            element.onclick = function onClickClear() {
                webIO.clear();
            };
            break;

        case WebIO.BINDING.PRINT:
            elementTextArea = /** @type {HTMLTextAreaElement} */ (element);
            /*
             * This was added for Firefox (Safari will clear the <textarea> on a page reload, but Firefox does not).
             */
            elementTextArea.value = "";
            /*
             * An onKeyPress handler has been added to this element simply to stop event propagation, so that if the
             * element has been explicitly given focus, any key presses won't be picked up by the Input device (which,
             * as that device's constructor explains, is monitoring key presses for the entire document).
             */
            elementTextArea.addEventListener(
                'keypress',
                function onKeyPress(event) {
                    event = event || window.event;
                    let keyCode = event.which || event.keyCode;
                    if (keyCode) {
                        /*
                         * Move the caret to the end of any text in the textarea.
                         */
                        let sText = elementTextArea.value;
                        elementTextArea.setSelectionRange(sText.length, sText.length);

                        /*
                         * Don't let the Input device's document-based keypress handler see any key presses
                         * that came to this element first.
                         */
                        event.stopPropagation();

                        /*
                         * On the ENTER key, look for any COMMAND handlers and invoke them until one of them
                         * returns true.
                         */
                        if (keyCode == 13) {
                            /*
                             * At the time we call any command handlers, a linefeed will not yet have been
                             * appended to the text, so for consistency, we prevent the default behavior and
                             * add the linefeed ourselves.  Unfortunately, one side-effect is that we must
                             * go to some extra effort to ensure the cursor remains in view; hence the stupid
                             * blur() and focus() calls.
                             */
                            event.preventDefault();
                            sText = (elementTextArea.value += '\n');
                            elementTextArea.blur();
                            elementTextArea.focus();
                            webIO.parseCommand(sText);
                        }
                    }
                }
            );
            break;
        }
    }

    /**
     * addBindings(bindings)
     *
     * Builds the set of ACTUAL bindings (this.bindings) from the set of DESIRED bindings (this.config['bindings']),
     * using either a "bindings" object map OR an array of "direct bindings".
     *
     * @this {WebIO}
     * @param {Object} bindings
     */
    addBindings(bindings)
    {
        let fDirectBindings = Array.isArray(bindings);
        for (let binding in bindings) {
            let id = bindings[binding];
            if (fDirectBindings) {
                binding = id;
            } else {
                /*
                 * This new bit of code allows us to define a binding like this:
                 *
                 *      "label": "0"
                 *
                 * and we will automatically look for "label0", "label1", etc, and build an array for binding "label".
                 */
                if (id.match(/^[0-9]+$/)) {
                    let i = +id;
                    this.bindings[binding] = [];
                    do {
                        id = binding + i++;
                        let element = document.getElementById(id);
                        if (!element) break;
                        this.bindings[binding].push(element);
                    } while (true);
                    continue;
                }
            }
            let element = document.getElementById(id);
            if (element) {
                this.bindings[binding] = element;
                this.addBinding(binding, element);
                continue;
            }
            if (DEBUG && !fDirectBindings) this.println("unable to find device ID: " + id);
        }
    }

    /**
     * addBindingOptions(element, options, fReset, sDefault)
     *
     * @this {WebIO}
     * @param {Element|HTMLSelectElement} element
     * @param {Object} options (eg, key/value pairs for a series of "option" elements)
     * @param {boolean} [fReset]
     * @param {string} [sDefault]
     */
    addBindingOptions(element, options, fReset, sDefault)
    {
        if (fReset) {
            element.options.length = 0;
        }
        if (options) {
            for (let prop in options) {
                let option = document.createElement("option");
                option.text = prop;
                option.value = (typeof options[prop] == "string"? options[prop] : prop);
                element.appendChild(option);
                if (option.value == sDefault) element.selectedIndex = element.options.length - 1;
            }
        }
    }

    /**
     * addHandler(sType, fn)
     *
     * @this {WebIO}
     * @param {string} sType
     * @param {function(Array.<string>)} fn
     */
    addHandler(sType, fn)
    {
        if (!WebIO.Handlers[this.idMachine]) WebIO.Handlers[this.idMachine] = {};
        if (!WebIO.Handlers[this.idMachine][sType]) WebIO.Handlers[this.idMachine][sType] = [];
        WebIO.Handlers[this.idMachine][sType].push(fn);
    }

    /**
     * alert(s, type)
     *
     * @this {WebIO}
     * @param {string} s
     * @param {string} [type]
     */
    alert(s, type)
    {
        if (type && WebIO.Alerts.list.indexOf(type) < 0) {
            alert(s);
            WebIO.Alerts.list.push(type);
        }
        this.println(s);
    }

    /**
     * assert(f, s)
     *
     * Verifies conditions that must be true (for DEBUG builds only).
     *
     * The Closure Compiler should automatically remove all references to assert() in non-DEBUG builds.
     * TODO: Add a task to the build process that "asserts" there are no instances of "assertion failure" in RELEASE builds.
     *
     * @this {WebIO}
     * @param {*} f is the expression asserted to be true
     * @param {string} [s] is description of the assertion on failure
     */
    assert(f, s)
    {
        if (DEBUG) {
            if (!f) {
                throw new Error(s || "assertion failure");
            }
        }
    }

    /**
     * checkConfig(config)
     *
     * @this {WebIO}
     * @param {Config} [config]
     */
    checkConfig(config = {})
    {
        /*
         * If this device's config contains an "overrides" array, then any of the properties listed in
         * that array may be overridden with a URL parameter.  We don't impose any checks on the overriding
         * value, so it is the responsibility of the component with overridable properties to validate them.
         */
        if (config['overrides']) {
            let parms = this.getURLParms();
            for (let prop in parms) {
                if (config['overrides'].indexOf(prop) >= 0) {
                    let value;
                    let s = parms[prop];
                    /*
                     * You might think we could simply call parseInt() and check isNaN(), but parseInt() has
                     * some annoying quirks, like stopping at the first non-numeric character.  If the ENTIRE
                     * string isn't a number, then we don't want to treat ANY part of it as a number.
                     */
                    if (s.match(/^[+-]?[0-9.]+$/)) {
                        value = Number.parseInt(s, 10);
                    } else if (s == "true") {
                        value = true;
                    } else if (s == "false") {
                        value = false;
                    } else {
                        value = s;
                        s = '"' + s + '"';
                    }
                    config[prop] = value;
                    this.println("overriding " + this.idDevice + " property '" + prop + "' with " + s);
                }
            }
        }
        /*
         * Why don't we ALWAYS set this.config to config?  Because the Machine class loads its own configuration, which
         * consists of multiple "Device" configs, including its own (since the Machine is also a Device).  Because of this
         * complication, the Machine is constructed with *no* config, and when the machine's config is loaded, the machine
         * sets this.config itself, calls checkConfig() with its own config, and then creates all the other devices with
         * their own configs.
         */
        if (!this.config) this.config = config;
        this.addBindings(config['bindings']);
    }

    /**
     * checkVersion(version)
     *
     * @this {WebIO}
     * @param {number} [version]
     */
    checkVersion(version)
    {
        this.version = version || +VERSION;
    }

    /**
     * clear()
     *
     * @this {WebIO}
     */
    clear()
    {
        let element = this.findBinding(WebIO.BINDING.PRINT, true);
        if (element) element.value = "";
    }

    /**
     * findBinding(name, all)
     *
     * @this {WebIO}
     * @param {string} name
     * @param {boolean} [all]
     * @returns {Element|null|undefined}
     */
    findBinding(name, all)
    {
        let element = this.bindings[name];
        return element;
    }

    /**
     * findHandlers(sType)
     *
     * @this {WebIO}
     * @param {string} sType
     * @returns {Array.<function(Array.<string>)>|undefined}
     */
    findHandlers(sType)
    {
        return WebIO.Handlers[this.idMachine] && WebIO.Handlers[this.idMachine][sType];
    }

    /**
     * findProperty(obj, sProp, sSuffix)
     *
     * If both sProp and sSuffix are set, then any browser-specific prefixes are inserted between sProp and sSuffix,
     * and if a match is found, it is returned without sProp.
     *
     * For example, if findProperty(document, 'on', 'fullscreenchange') discovers that 'onwebkitfullscreenchange' exists,
     * it will return 'webkitfullscreenchange', in preparation for an addEventListener() call.
     *
     * More commonly, sSuffix is not used, so whatever property is found is returned as-is.
     *
     * @this {WebIO}
     * @param {Object|null|undefined} obj
     * @param {string} sProp
     * @param {string} [sSuffix]
     * @return {string|null}
     */
    findProperty(obj, sProp, sSuffix)
    {
        if (obj) {
            for (let i = 0; i < WebIO.BrowserPrefixes.length; i++) {
                let sName = WebIO.BrowserPrefixes[i];
                if (sSuffix) {
                    sName += sSuffix;
                    let sEvent = sProp + sName;
                    if (sEvent in obj) return sName;
                } else {
                    if (!sName) {
                        sName = sProp[0];
                    } else {
                        sName += sProp[0].toUpperCase();
                    }
                    sName += sProp.substr(1);
                    if (sName in obj) return sName;
                }
            }
        }
        return null;
    }

    /**
     * getBindingID(name)
     *
     * Since this.bindings contains the actual elements, not their original IDs, we must delve back into
     * the original this.config['bindings'] to determine the original ID.
     *
     * @this {WebIO}
     * @param {string} name
     * @returns {string|undefined}
     */
    getBindingID(name)
    {
        return this.config['bindings'] && this.config['bindings'][name];
    }

    /**
     * getBindingText(name)
     *
     * @this {WebIO}
     * @param {string} name
     * @return {string|undefined}
     */
    getBindingText(name)
    {
        let sText;
        let element = this.bindings[name];
        if (element) sText = element.textContent;
        return sText;
    }

    /**
     * getBounded(n, min, max)
     *
     * Restricts n to the bounds defined by min and max.  A side-effect is ensuring that the return
     * value is ALWAYS a number, even if n is not.
     *
     * @this {WebIO}
     * @param {number} n
     * @param {number} min
     * @param {number} max
     * @returns {number} (updated n)
     */
    getBounded(n, min, max)
    {

        n = +n || 0;
        if (n < min) n = min;
        if (n > max) n = max;
        return n;
    }

    /**
     * getDefault(idConfig, defaultValue)
     *
     * @this {WebIO}
     * @param {string} idConfig
     * @param {*} defaultValue
     * @returns {*}
     */
    getDefault(idConfig, defaultValue)
    {
        let value = this.config[idConfig];
        if (value === undefined) {
            value = defaultValue;
        } else {
            let type = typeof defaultValue;
            if (typeof value != type) {

                if (type == "boolean") {
                    value = !!value;
                } else if (typeof defaultValue == "number") {
                    value = +value;
                }
            }
        }
        return value;
    }

    /**
     * getDefaultBoolean(idConfig, defaultValue)
     *
     * @this {WebIO}
     * @param {string} idConfig
     * @param {boolean} defaultValue
     * @returns {boolean}
     */
    getDefaultBoolean(idConfig, defaultValue)
    {
        return /** @type {boolean} */ (this.getDefault(idConfig, defaultValue));
    }

    /**
     * getDefaultNumber(idConfig, defaultValue)
     *
     * @this {WebIO}
     * @param {string} idConfig
     * @param {number} defaultValue
     * @returns {number}
     */
    getDefaultNumber(idConfig, defaultValue)
    {
        return /** @type {number} */ (this.getDefault(idConfig, defaultValue));
    }

    /**
     * getDefaultString(idConfig, defaultValue)
     *
     * @this {WebIO}
     * @param {string} idConfig
     * @param {string} defaultValue
     * @returns {string}
     */
    getDefaultString(idConfig, defaultValue)
    {
        return /** @type {string} */ (this.getDefault(idConfig, defaultValue));
    }

    /**
     * getHost()
     *
     * This is like getHostName() but with the port number, if any.
     *
     * @this {WebIO}
     * @return {string}
     */
    getHost()
    {
        return (window? window.location.host : "localhost");
    }

    /**
     * getHostName()
     *
     * @this {WebIO}
     * @return {string}
     */
    getHostName()
    {
        return (window? window.location.hostname : this.getHost());
    }

    /**
     * getHostOrigin()
     *
     * @this {WebIO}
     * @return {string}
     */
    getHostOrigin()
    {
        return (window? window.location.origin : this.getHost());
    }

    /**
     * getHostPath()
     *
     * @this {WebIO}
     * @return {string|null}
     */
    getHostPath()
    {
        return (window? window.location.pathname : null);
    }

    /**
     * getHostProtocol()
     *
     * @this {WebIO}
     * @return {string}
     */
    getHostProtocol()
    {
        return (window? window.location.protocol : "file:");
    }

    /**
     * getHostURL()
     *
     * @this {WebIO}
     * @return {string|null}
     */
    getHostURL()
    {
        return (window? window.location.href : null);
    }

    /**
     * getResource(url, done)
     *
     * Request the specified resource, and once the request is complete, notify done().
     *
     * done() is passed four parameters:
     *
     *      done(url, sResource, readyState, nErrorCode)
     *
     * readyState comes from the request's 'readyState' property, and the operation should not be considered complete
     * until readyState is 4.
     *
     * If nErrorCode is zero, sResource should contain the requested data; otherwise, an error occurred.
     *
     * @this {WebIO}
     * @param {string} url
     * @param {function(string,string,number,number)} done
     */
    getResource(url, done)
    {
        let obj = this;
        let nErrorCode = 0, sResource = null;
        let xmlHTTP = (window.XMLHttpRequest? new window.XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP"));
        xmlHTTP.onreadystatechange = function()
        {
            if (xmlHTTP.readyState !== 4) {
                done(url, sResource, xmlHTTP.readyState, nErrorCode);
                return;
            }

            /*
             * The following line was recommended for WebKit, as a work-around to prevent the handler firing multiple
             * times when debugging.  Unfortunately, that's not the only XMLHttpRequest problem that occurs when
             * debugging, so I think the WebKit problem is deeper than that.  When we have multiple XMLHttpRequests
             * pending, any debugging activity means most of them simply get dropped on floor, so what may actually be
             * happening are mis-notifications rather than redundant notifications.
             *
             *      xmlHTTP.onreadystatechange = undefined;
             */
            sResource = xmlHTTP.responseText;

            /*
             * The normal "success" case is an HTTP status code of 200, but when testing with files loaded
             * from the local file system (ie, when using the "file:" protocol), we have to be a bit more "flexible".
             */
            if (xmlHTTP.status == 200 || !xmlHTTP.status && sResource.length && obj.getHostProtocol() == "file:") {
                // if (MAXDEBUG) Web.log("xmlHTTP.onreadystatechange(" + url + "): returned " + sResource.length + " bytes");
            }
            else {
                nErrorCode = xmlHTTP.status || -1;
            }
            done(url, sResource, xmlHTTP.readyState, nErrorCode);
        };

        xmlHTTP.open("GET", url, true);
        xmlHTTP.send();
    }

    /**
     * getURLParms(sParms)
     *
     * @this {WebIO}
     * @param {string} [sParms] containing the parameter portion of a URL (ie, after the '?')
     * @returns {Object} containing properties for each parameter found
     */
    getURLParms(sParms)
    {
        let parms = WebIO.URLParms;
        if (!parms) {
            parms = {};
            if (window) {
                if (!sParms) {
                    /*
                     * Note that window.location.href returns the entire URL, whereas window.location.search
                     * returns only the parameters, if any (starting with the '?', which we skip over with a substr() call).
                     */
                    sParms = window.location.search.substr(1);
                }
                let match;
                let pl = /\+/g; // RegExp for replacing addition symbol with a space
                let search = /([^&=]+)=?([^&]*)/g;
                let decode = function decodeParameter(s) {
                    return decodeURIComponent(s.replace(pl, " ")).trim();
                };

                while ((match = search.exec(sParms))) {
                    parms[decode(match[1])] = decode(match[2]);
                }
            }
            WebIO.URLParms = parms;
        }
        return parms;
    }

    /**
     * hasLocalStorage
     *
     * If localStorage support exists, is enabled, and works, return true.
     *
     * @this {WebIO}
     * @returns {boolean}
     */
    hasLocalStorage()
    {
        if (WebIO.LocalStorage.Available === undefined) {
            let f = false;
            if (window) {
                try {
                    window.localStorage.setItem(WebIO.LocalStorage.Test, WebIO.LocalStorage.Test);
                    f = (window.localStorage.getItem(WebIO.LocalStorage.Test) == WebIO.LocalStorage.Test);
                    window.localStorage.removeItem(WebIO.LocalStorage.Test);
                } catch(err) {
                    this.println(err.message);
                    f = false;
                }
            }
            WebIO.LocalStorage.Available = f;
        }
        return !!WebIO.LocalStorage.Available;
    }

    /**
     * isMessageOn(messages)
     *
     * If messages is MESSAGES.DEFAULT (0), then the device's default message group(s) are used,
     * and if it's MESSAGES.ALL (-1), then the message is always displayed, regardless what's enabled.
     *
     * @this {WebIO}
     * @param {number} [messages] is zero or more MESSAGE flags
     * @return {boolean} true if all specified message enabled, false if not
     */
    isMessageOn(messages = 0)
    {
        if (messages % 2) messages--;
        messages = messages || this.messages;
        if ((messages|1) == -1 || this.testBits(Messages, messages)) {
            return true;
        }
        return false;
    }

    /**
     * isUserAgent(s)
     *
     * Check the browser's user-agent string for the given substring; "iOS" and "MSIE" are special values you can
     * use that will match any iOS or MSIE browser, respectively (even IE11, in the case of "MSIE").
     *
     * 2013-11-06: In a questionable move, MSFT changed the user-agent reported by IE11 on Windows 8.1, eliminating
     * the "MSIE" string (which MSDN calls a "version token"; see http://msdn.microsoft.com/library/ms537503.aspx);
     * they say "public websites should rely on feature detection, rather than browser detection, in order to design
     * their sites for browsers that don't support the features used by the website." So, in IE11, we get a user-agent
     * that tries to fool apps into thinking the browser is more like WebKit or Gecko:
     *
     *      Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko
     *
     * @this {WebIO}
     * @param {string} s is a substring to search for in the user-agent; as noted above, "iOS" and "MSIE" are special values
     * @returns {boolean} is true if the string was found, false if not
     */
    isUserAgent(s)
    {
        if (window) {
            let userAgent = window.navigator.userAgent;
            return s == "iOS" && !!userAgent.match(/(iPod|iPhone|iPad)/) && !!userAgent.match(/AppleWebKit/) || s == "MSIE" && !!userAgent.match(/(MSIE|Trident)/) || (userAgent.indexOf(s) >= 0);
        }
        return false;
    }

    /**
     * loadLocalStorage()
     *
     * @this {WebIO}
     * @returns {Array|null}
     */
    loadLocalStorage()
    {
        let state = null;
        if (this.hasLocalStorage()) {
            let sValue;
            if (window) {
                try {
                    sValue = window.localStorage.getItem(this.idMachine);
                    if (sValue) state = /** @type {Array} */ (JSON.parse(sValue));
                } catch (err) {
                    this.println(err.message);
                }
            }
        }
        return state;
    }

    /**
     * onPageEvent(sName, fn)
     *
     * This function creates a chain of callbacks, allowing multiple JavaScript modules to define handlers
     * for the same event, which wouldn't be possible if everyone modified window['onload'], window['onunload'],
     * etc, themselves.
     *
     * NOTE: It's risky to refer to obscure event handlers with "dot" names, because the Closure Compiler may
     * erroneously replace them (eg, window.onpageshow is a good example).
     *
     * @this {WebIO}
     * @param {string} sFunc
     * @param {function()} fn
     */
    onPageEvent(sFunc, fn)
    {
        if (window) {
            let fnPrev = window[sFunc];
            if (typeof fnPrev !== 'function') {
                window[sFunc] = fn;
            } else {
                /*
                 * TODO: Determine whether there's any value in receiving/sending the Event object that the
                 * browser provides when it generates the original event.
                 */
                window[sFunc] = function onWindowEvent() {
                    if (fnPrev) fnPrev();
                    fn();
                };
            }
        }
    }

    /**
     * parseCommand(sText)
     *
     * NOTE: To ensure that this function's messages are displayed, use super.println with fBuffer set to false.
     *
     * @this {WebIO}
     * @param {string} sText
     */
    parseCommand(sText)
    {
        try {
            let i = sText.lastIndexOf('\n', sText.length - 2);
            let sCommand = sText.slice(i + 1, -1) || this.sCommandPrev, sResult;
            this.sCommandPrev = "";
            sCommand = sCommand.trim();
            let aTokens = sCommand.split(' ');
            let token, message, on, iToken;
            let afnHandlers = this.findHandlers(WebIO.HANDLER.COMMAND);

            switch(aTokens[0]) {
            case 'm':
                iToken = 1;
                token = aTokens[aTokens.length-1].toLowerCase();
                on = (token == "true" || token == "on"? true : (token == "false" || token == "off"? false : undefined));
                if (on != undefined) {
                    aTokens.pop();
                } else {
                    if (aTokens.length <= 1) {
                        aTokens = Object.keys(MESSAGES);
                        /*
                         * Here's where we assume that the first three entries are not "settable" message groups.
                         */
                        iToken = 3;
                    }
                }
                for (i = iToken; i < aTokens.length; i++) {
                    token = aTokens[i].toUpperCase();
                    message = MESSAGES[token];
                    if (!message) {
                        super.println("unrecognized message group: " + token, false);
                        break;
                    }
                    if (on != undefined) {
                        this.setMessages(message, on);
                    }
                    super.println(token + ": " + this.isMessageOn(message), false);
                }
                break;

            case '?':
                sResult = "";
                WebIO.COMMANDS.forEach((cmd) => {sResult += '\n' + cmd;});
                if (sResult) super.println("default commands:" + sResult, false);
                /* falls through */

            default:
                aTokens.unshift(sCommand);
                if (afnHandlers) {
                    for (i = 0; i < afnHandlers.length; i++) {
                        if (afnHandlers[i](aTokens)) break;
                    }
                }
                break;
            }
        }
        catch(err) {
            super.println("error: " + err.message);
        }
    }

    /**
     * print(s)
     *
     * This overrides StdIO.print(), in case the device has a PRINT binding that should be used instead,
     * or if all printing should be buffered.
     *
     * @this {WebIO}
     * @param {string} s
     * @param {boolean} [fBuffer] (true to always buffer; otherwise, only buffer the last partial line)
     */
    print(s, fBuffer)
    {
        if (fBuffer == undefined) {
            fBuffer = this.isMessageOn(MESSAGES.BUFFER);
        }
        if (!fBuffer) {
            let element = this.findBinding(WebIO.BINDING.PRINT, true);
            if (element) {
                element.value += s;
                /*
                 * Prevent the <textarea> from getting too large; otherwise, printing becomes slower and slower.
                 */
                if (!DEBUG && element.value.length > 8192) {
                    element.value = element.value.substr(element.value.length - 4096);
                }
                element.scrollTop = element.scrollHeight;
                return;
            }
        }
        super.print(s, fBuffer);
    }


    /**
     * printf(format, ...args)
     *
     * This overrides StdIO.printf(), to add support for MESSAGES; if format is a number, then it's treated
     * as one or more MESSAGES flags, and the real format string is the first arg.
     *
     * @this {WebIO}
     * @param {string|number} format
     * @param {...} args
     */
    printf(format, ...args)
    {
        let messages = 0;
        if (typeof format == "number") {
            messages = format;
            format = args.shift();
        }
        if (this.isMessageOn(messages)) {
            super.printf(format, ...args);
        }
    }

    /**
     * saveLocalStorage(state)
     *
     * @this {WebIO}
     * @param {Array} state
     * @returns {boolean} true if successful, false if error
     */
    saveLocalStorage(state)
    {
        if (this.hasLocalStorage()) {
            let sValue = JSON.stringify(state);
            try {
                window.localStorage.setItem(this.idMachine, sValue);
                return true;
            } catch(err) {
                this.println(err.message);
            }
        }
        return false;
    }

    /**
     * setBindingText(name, text)
     *
     * @this {WebIO}
     * @param {string} name
     * @param {string} text
     */
    setBindingText(name, text)
    {
        let element = this.bindings[name];
        if (element) element.textContent = text;
    }

    /**
     * setMessages(messages, on)
     *
     * Use this function to set/clear message groups.  Use isMessageOn() to decide whether to print
     * messages that are part of a group.
     *
     * MESSAGES.BUFFER is special, causing all print calls to be buffered; the print buffer will be dumped
     * as soon as setMessages() clears MESSAGES.BUFFER.
     *
     * @this {WebIO}
     * @param {number} messages
     * @param {boolean} on (true to set, false to clear)
     */
    setMessages(messages, on)
    {
        let flush = false;
        if (on) {
            Messages = this.setBits(Messages, messages);
        } else {
            flush = (this.testBits(Messages, MESSAGES.BUFFER) && this.testBits(messages, MESSAGES.BUFFER));
            Messages = this.clearBits(Messages, messages);
        }
        if (flush) this.flush();
    }
}

WebIO.BINDING = {
    CLEAR:      "clear",
    PRINT:      "print"
};

WebIO.COMMANDS = [
    "m\t\tenable messages"
];

WebIO.HANDLER = {
    COMMAND:    "command"
};

WebIO.Alerts = {
    list:       [],
    Version:    "version"
};

WebIO.LocalStorage = {
    Available:  undefined,
    Test:       "PCjs.localStorage"
};

WebIO.BrowserPrefixes = ['', 'moz', 'ms', 'webkit'];

/**
 * Handlers is a global object whose properties are machine IDs, each of which contains zero or more
 * handler IDs, each of which contains a set of functions that are indexed by one of the WebIO.HANDLER keys.
 *
 * @type {Object}
 */
WebIO.Handlers = {};

/**
 * @copyright https://www.pcjs.org/modules/devices/device.js (C) Jeff Parsons 2012-2019
 */

/**
 * @define {string}
 */
var FACTORY = "Machine";

/**
/*
 * List of additional  message groups.
 *
 * NOTE: To support more than 32 message groups, be sure to use "+", not "|", when concatenating.
 */
MESSAGES.ADDRESS = 0x000000000001;
MESSAGES.CPU     = 0x000000000002;
MESSAGES.VIDEO   = 0x000000000008;
MESSAGES.TIMER   = 0x000000000100;
MESSAGES.EVENT   = 0x000000000200;
MESSAGES.KEY     = 0x000000001000;
MESSAGES.WARN    = 0x000000002000;
MESSAGES.HALT    = 0x000000004000;

/**
 * @class {Device}
 * @unrestricted
 * @property {string} status
 */
class Device extends WebIO {
    /**
     * Device()
     *
     * @this {Device}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     * @param {number} [version]
     */
    constructor(idMachine, idDevice, config, version)
    {
        super(idMachine, idDevice, config, version);
        this.status = "OK";
        this.addDevice();
        this.registers = {};
    }

    /**
     * addDevice()
     *
     * Adds this Device to the global set of Devices, so that findDevice(), findBinding(), etc, will work.
     *
     * @this {Device}
     */
    addDevice()
    {
        if (!Device.Machines[this.idMachine]) Device.Machines[this.idMachine] = [];
        Device.Machines[this.idMachine].push(this);
    }

    /**
     * checkMachine(config)
     *
     * Verify that device's version matches the machine's version, and also that the config version stored in
     * the JSON (if any) matches the device's version.
     *
     * This is normally performed by the constructor, but the Machine device cannot be fully initialized in the
     * constructor, so it calls this separately.
     *
     * @this {Device}
     * @param {Config} config
     */
    checkMachine(config)
    {
        if (this.version) {
            let sVersion = "", version;
            let machine = this.findDevice(this.idMachine);
            if (machine.version != this.version) {
                sVersion = "Machine";
                version = machine.version;
            }
            else if (config.version && config.version > this.version) {
                sVersion = "Config";
                version = config.version;
            }
            if (sVersion) {
                let sError = this.sprintf("%s Device version (%3.2f) incompatible with %s version (%3.2f)", config.class, this.version, sVersion, version);
                this.alert("Error: " + sError + '\n\n' + "Clearing your browser's cache may resolve the issue.", Device.Alerts.Version);
            }
        }
    }

    /**
     * defineRegister(name, get, set)
     *
     * @this {Device}
     * @param {string} name
     * @param {function()} get
     * @param {function(number)} set
     */
    defineRegister(name, get, set)
    {
        this.registers[name] = {get: get.bind(this), set: set.bind(this)};
    }

    /**
     * findBinding(name, all)
     *
     * This will search the current device's bindings, and optionally all the device bindings within the
     * machine.  If the binding is found in another device, that binding is recorded in this device as well.
     *
     * @this {Device}
     * @param {string} name
     * @param {boolean} [all]
     * @returns {Element|null|undefined}
     */
    findBinding(name, all = false)
    {
        let element = super.findBinding(name, all);
        if (element === undefined && all) {
            let devices = Device.Machines[this.idMachine];
            for (let i in devices) {
                element = devices[i].bindings[name];
                if (element) break;
            }
            if (!element) element = null;
            this.bindings[name] = element;
        }
        return element;
    }

    /**
     * findDevice(idDevice)
     *
     * @this {Device}
     * @param {string} idDevice
     * @returns {Device|undefined}
     */
    findDevice(idDevice)
    {
        let device;
        let devices = Device.Machines[this.idMachine];
        if (devices) {
            for (let i in devices) {
                if (devices[i].idDevice == idDevice) {
                    device = devices[i];
                    break;
                }
            }
        }
        return device;
    }

    /**
     * findDeviceByClass(idClass)
     *
     * @this {Device}
     * @param {string} idClass
     * @returns {Device|undefined}
     */
    findDeviceByClass(idClass)
    {
        let device;
        let devices = Device.Machines[this.idMachine];
        if (devices) {
            for (let i in devices) {
                if (devices[i].config['class'] == idClass) {
                    device = devices[i];
                    break;
                }
            }
        }
        return device;
    }

    /**
     * getRegister(name)
     *
     * @this {Device}
     * @param {string} name
     * @return {number|undefined}
     */
    getRegister(name)
    {
        let reg = this.registers[name];
        return reg && reg.get();
    }

    /**
     * removeDevice(idDevice)
     *
     * @this {Device}
     * @param {string} idDevice
     * @returns {boolean} (true if successfully removed, false if not)
     */
    removeDevice(idDevice)
    {
        let device;
        let devices = Device.Machines[this.idMachine];
        if (devices) {
            for (let i in devices) {
                if (devices[i].idDevice == idDevice) {
                    devices.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * setRegister(name, value)
     *
     * @this {Device}
     * @param {string} name
     * @param {number} value
     */
    setRegister(name, value)
    {
        let reg = this.registers[name];
        if (reg) reg.set(value);
    }
}

/**
 * Machines is a global object whose properties are machine IDs and whose values are arrays of Devices.
 *
 * @type {Object}
 */
Device.Machines = {};

/**
 * @copyright https://www.pcjs.org/modules/devices/bus.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ addrWidth: number, dataWidth: number, blockSize: (number|undefined) }} */
var BusConfig;

/**
 * @class {Bus}
 * @unrestricted
 * @property {BusConfig} config
 * @property {number} addrWidth
 * @property {number} dataWidth
 * @property {number} addrTotal
 * @property {number} addrLimit
 * @property {number} blockSize
 * @property {number} blockTotal
 * @property {number} blockShift
 * @property {number} blockLimit
 * @property {Array.<Memory>} blocks
 */
class Bus extends Device {
    /**
     * Bus(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "bus": {
     *        "class": "Bus",
     *        "addrWidth": 16,
     *        "dataWidth": 8,
     *        "blockSize": 1024
     *      }
     *
     * @this {Bus}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ROMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        this.addrWidth = config['addrWidth'] || 16;
        this.dataWidth = config['dataWidth'] || 8;
        this.addrTotal = Math.pow(2, this.addrWidth);
        this.addrLimit = (this.addrTotal - 1)|0;
        this.blockSize = config['blockSize'] || 1024;
        this.blockTotal = (this.addrTotal / this.blockSize)|0;
        this.blockShift = Math.log2(this.blockSize)|0;
        this.blockLimit = (1 << this.blockShift) - 1;
        this.blocks = new Array(this.blockTotal);
        let memory = new Memory(idMachine, idDevice + ".null", {"addr": undefined, "size": this.blockSize});
        for (let addr = 0; addr < this.addrTotal; addr += this.blockSize) {
            this.addBlocks(addr, this.blockSize, Memory.TYPE.NONE, memory);
        }
    }

    /**
     * addBlocks(addr, size, type, block)
     *
     * Bus interface for other devices to add blocks at specific addresses.  It's an error to add blocks to
     * regions that already contain blocks (other than blocks with TYPE of NONE).  There is no attempt to clean
     * up that error (and there is no removeBlocks() function) because it's currently considered a configuration
     * error, but that will likely change as machines with fancier buses are added.
     *
     * @this {Bus}
     * @param {number} addr is the starting physical address of the request
     * @param {number} size of the request, in bytes
     * @param {number} type is one of the Memory.TYPE constants
     * @param {Memory} [block] (optional preallocated block that must implement the same Memory interfaces the Bus uses)
     * @return {boolean}
     */
    addBlocks(addr, size, type, block)
    {
        let addrNext = addr;
        let sizeLeft = size;
        let offset = 0, nBlocks = 0;
        let iBlock = addrNext >>> this.blockShift;
        while (sizeLeft > 0 && iBlock < this.blocks.length) {
            let blockNew;
            let addrBlock = iBlock * this.blockSize;
            let sizeBlock = this.blockSize - (addrNext - addrBlock);
            if (sizeBlock > sizeLeft) sizeBlock = sizeLeft;
            let blockExisting = this.blocks[iBlock];
            /*
             * Make sure that no block exists at the specified address, or if so, make sure its type is NONE.
             */
            if (blockExisting && blockExisting.type != Memory.TYPE.NONE) return false;
            /*
             * When no block is provided, we must allocate one that matches the specified type (and remaining size).
             */
            if (!block) {
                blockNew = new Memory(this.idMachine, this.idDevice + ".block" + nBlocks, {type, addr: addrNext, size: sizeBlock});
            } else {
                /*
                 * When a block is provided, make sure its size maches the default Bus block size, and use it if so.
                 */
                if (block['size'] == this.blockSize) {
                    blockNew = block;
                } else {
                    /*
                     * When a block of a different size is provided, make a new block, importing any values as needed.
                     */
                    blockNew = new Memory(this.idMachine, block.idDevice + ".block" + nBlocks, {type, addr: addrNext, size: sizeBlock, values: block['values'], offset});
                    offset += this.blockSize;
                }
            }
            this.blocks[iBlock++] = blockNew;
            addrNext = addrBlock + this.blockSize;
            sizeLeft -= sizeBlock;
            nBlocks++;
        }
        return true;
    }

    /**
     * cleanBlocks(addr, size)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {number} size
     * @return {boolean} true if all blocks were clean, false if dirty; all blocks are cleaned in the process
     */
    cleanBlocks(addr, size)
    {
        let clean = true;
        let iBlock = addr >>> this.blockShift;
        let sizeBlock = this.blockSize - (addr & this.blockLimit);
        while (size > 0 && iBlock < this.blocks.length) {
            if (this.blocks[iBlock].isDirty()) clean = false;
            size -= sizeBlock;
            sizeBlock = this.blockSize;
            iBlock++;
        }
        return clean;
    }

    /**
     * readData(addr, ref)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {number} [ref] (optional reference value, such as the CPU's program counter at the time of access)
     * @returns {number|undefined}
     */
    readData(addr, ref)
    {
        return this.blocks[(addr & this.addrLimit) >>> this.blockShift].readData(addr & this.blockLimit);
    }

    /**
     * writeData(addr, value, ref)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {number} value
     * @param {number} [ref] (optional reference value, such as the CPU's program counter at the time of access)
     */
    writeData(addr, value, ref)
    {
        this.blocks[(addr & this.addrLimit) >>> this.blockShift].writeData(addr & this.blockLimit, value);
    }

    /**
     * trapRead(addr, func)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function(number)} func (receives the address to read)
     * @return {boolean} true if trap successful, false if already trapped by another function
     */
    trapRead(addr, func)
    {
        let iBlock = addr >>> this.blockShift;
        let block = this.blocks[iBlock];
        let readTrap = function(offset) {
            block.readTrap(block.addr + offset);
            return block.readPrev(offset);
        };
        if (!block.nReadTraps) {
            block.nReadTraps = 1;
            block.readTrap = func;
            block.readPrev = block.readData;
            block.readData = readTrap;
        } else if (block.readTrap == func) {
            block.nReadTraps++;
        } else {
            return false;
        }
        return true;
    }

    /**
     * trapWrite(addr, func)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function(number, number)} func (receives the address and the value to write)
     * @return {boolean} true if trap successful, false if already trapped by another function
     */
    trapWrite(addr, func)
    {
        let iBlock = addr >>> this.blockShift;
        let block = this.blocks[iBlock];
        let writeTrap = function(offset, value) {
            block.writeTrap(block.addr + offset, value);
            block.writePrev(offset, value);
        };
        if (!block.nWriteTraps) {
            block.nWriteTraps = 1;
            block.writeTrap = func;
            block.writePrev = block.writeData;
            block.writeData = writeTrap;
        } else if (block.writeTrap == func) {
            block.nWriteTraps++;
        } else {
            return false;
        }
        return true;
    }

    /**
     * untrapRead(addr, func)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function(number)} func
     * @return {boolean} true if trap successful, false if no trap was in effect
     */
    untrapRead(addr, func)
    {
        let iBlock = addr >>> this.blockShift;
        let block = this.blocks[iBlock];
        if (block.nReadTraps && block.readTrap == func) {
            block.nReadTraps--;
            block.readData = block.readPrev;
            block.readPrev = block.readTrap = undefined;
            return true;
        }
        return false;
    }

    /**
     * untrapWrite(addr, func)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function(number, number)} func
     * @return {boolean} true if trap successful, false if no trap was in effect
     */
    untrapWrite(addr, func)
    {
        let iBlock = addr >>> this.blockShift;
        let block = this.blocks[iBlock];
        if (block.nWriteTraps && block.writeTrap == func) {
            block.nWriteTraps--;
            block.writeData = block.writePrev;
            block.writePrev = block.writeTrap = undefined;
            return true;
        }
        return false;
    }
}

/**
 * @copyright https://www.pcjs.org/modules/devices/dbgio.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ off: number, seg: number, type: number }} */
var Address;

/**
 * Basic debugger services
 *
 * @class {DbgIO}
 * @unrestricted
 */
class DbgIO extends Device {
    /**
     * DbgIO(idMachine, idDevice, config)
     *
     * @this {DbgIO}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        /*
         * Default base (radix), used to interpret all ambiguous numeric values.
         */
        this.nDefaultBase = 16;

        /*
         * Default number of bits of integer precision.
         */
        this.nDefaultBits = 32;

        /*
         * Default delimiters.
         */
        this.achGroup = ['(',')'];
        this.achAddress = ['[',']'];

        /*
         * aVariables is an object with properties that grow as setVariable() assigns more variables;
         * each property corresponds to one variable, where the property name is the variable name (ie,
         * a string beginning with a non-digit, followed by zero or more symbol characters and/or digits)
         * and the property value is the variable's numeric value.  See doVar() and setVariable() for
         * details.
         *
         * Note that parseValue() parses variables before numbers, so any variable that looks like a
         * unprefixed hex value (eg, "a5" as opposed to "0xa5") will trump the numeric value.  Unprefixed
         * hex values are a convenience of parseValue(), which always calls parseInt() with a default
         * base of 16; however, that default be overridden with a variety of explicit prefixes or suffixes
         * (eg, a leading "0o" to indicate octal, a trailing period to indicate decimal, etc.)
         *
         * See parseInt() for more details about supported numbers.
         */
        this.aVariables = {};

        /*
         * Since we want to be able to clear/disable/enable/list break addresses by index number, we will
         * merely set cleared entries to undefined, rather than splicing them out, and when setting new entries,
         * we will scan for the first available slot.  As for which ones are disabled, that will be handled by
         * adding TWO_POW32 to the address; machine performance will still be affected, because any block(s) with
         * break addresses will still be trapping accesses, so you should clear break addresses whenever possible.
         */
        this.aReadBusAddr = [];
        this.aWriteBusAddr = [];
        this.readBusCheck = this.checkBusRead.bind(this);
        this.writeBusCheck = this.checkBusWrite.bind(this);

        /*
         * Get access to the CPU, in part so we can connect to all its registers.
         */
        this.cpu = /** @type {CPU} */ (this.findDeviceByClass(Machine.CLASS.CPU));
        this.registers = this.cpu.registers;

        /*
         * Get access to the Bus devices, so we have access to the I/O and memory address spaces.
         *
         * To minimize configuration redundancy, we rely on the CPU's configuration to get the Bus device IDs.
         */
        this.busIO = /** @type {Bus} */ (this.findDevice(this.cpu.config['busIO']));
        this.busMemory = /** @type {Bus} */ (this.findDevice(this.cpu.config['busMemory']));

        /*
         * Get access to the Time device, so we can stop and start time as needed.
         */
        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));

        /*
         * Initialize all properties required for our onCommand() handler.
         */
        this.addrPrev = undefined;
        this.addHandler(Device.HANDLER.COMMAND, this.onCommand.bind(this));
    }

    /**
     * delVariable(sVar)
     *
     * @this {DbgIO}
     * @param {string} sVar
     */
    delVariable(sVar)
    {
        delete this.aVariables[sVar];
    }

    /**
     * getVariable(sVar)
     *
     * @this {DbgIO}
     * @param {string} sVar
     * @return {number|undefined}
     */
    getVariable(sVar)
    {
        if (this.aVariables[sVar]) {
            return this.aVariables[sVar].value;
        }
        sVar = sVar.substr(0, 6);
        return this.aVariables[sVar] && this.aVariables[sVar].value;
    }

    /**
     * getVariableFixup(sVar)
     *
     * @this {DbgIO}
     * @param {string} sVar
     * @return {string|undefined}
     */
    getVariableFixup(sVar)
    {
        return this.aVariables[sVar] && this.aVariables[sVar].sUndefined;
    }

    /**
     * isVariable(sVar)
     *
     * @this {DbgIO}
     * @param {string} sVar
     * @return {boolean}
     */
    isVariable(sVar)
    {
        return this.aVariables[sVar] !== undefined;
    }

    /**
     * resetVariables()
     *
     * @this {DbgIO}
     * @return {Object}
     */
    resetVariables()
    {
        let a = this.aVariables;
        this.aVariables = {};
        return a;
    }

    /**
     * restoreVariables(a)
     *
     * @this {DbgIO}
     * @param {Object} a (from previous resetVariables() call)
     */
    restoreVariables(a)
    {
        this.aVariables = a;
    }

    /**
     * setVariable(sVar, value, sUndefined)
     *
     * @this {DbgIO}
     * @param {string} sVar
     * @param {number} value
     * @param {string|undefined} [sUndefined]
     */
    setVariable(sVar, value, sUndefined)
    {
        this.aVariables[sVar] = {value, sUndefined};
    }

    /**
     * evalAND(dst, src)
     *
     * Adapted from /modules/pdp10/lib/cpuops.js:PDP10.AND().
     *
     * Performs the bitwise "and" (AND) of two operands > 32 bits.
     *
     * @this {DbgIO}
     * @param {number} dst
     * @param {number} src
     * @return {number} (dst & src)
     */
    evalAND(dst, src)
    {
        /*
         * We AND the low 32 bits separately from the higher bits, and then combine them with addition.
         * Since all bits above 32 will be zero, and since 0 AND 0 is 0, no special masking for the higher
         * bits is required.
         *
         * WARNING: When using JavaScript's 32-bit operators with values that could set bit 31 and produce a
         * negative value, it's critical to perform a final right-shift of 0, ensuring that the final result is
         * positive.
         */
        if (this.nDefaultBits <= 32) {
            return dst & src;
        }
        /*
         * Negative values don't yield correct results when dividing, so pass them through an unsigned truncate().
         */
        dst = this.truncate(dst, 0, true);
        src = this.truncate(src, 0, true);
        return ((((dst / NumIO.TWO_POW32)|0) & ((src / NumIO.TWO_POW32)|0)) * NumIO.TWO_POW32) + ((dst & src) >>> 0);
    }

    /**
     * evalMUL(dst, src)
     *
     * I could have adapted the code from /modules/pdp10/lib/cpuops.js:PDP10.doMUL(), but it was simpler to
     * write this base method and let the PDP-10 Debugger override it with a call to the *actual* doMUL() method.
     *
     * @this {DbgIO}
     * @param {number} dst
     * @param {number} src
     * @return {number} (dst * src)
     */
    evalMUL(dst, src)
    {
        return dst * src;
    }

    /**
     * evalIOR(dst, src)
     *
     * Adapted from /modules/pdp10/lib/cpuops.js:PDP10.IOR().
     *
     * Performs the logical "inclusive-or" (OR) of two operands > 32 bits.
     *
     * @this {DbgIO}
     * @param {number} dst
     * @param {number} src
     * @return {number} (dst | src)
     */
    evalIOR(dst, src)
    {
        /*
         * We OR the low 32 bits separately from the higher bits, and then combine them with addition.
         * Since all bits above 32 will be zero, and since 0 OR 0 is 0, no special masking for the higher
         * bits is required.
         *
         * WARNING: When using JavaScript's 32-bit operators with values that could set bit 31 and produce a
         * negative value, it's critical to perform a final right-shift of 0, ensuring that the final result is
         * positive.
         */
        if (this.nDefaultBits <= 32) {
            return dst | src;
        }
        /*
         * Negative values don't yield correct results when dividing, so pass them through an unsigned truncate().
         */
        dst = this.truncate(dst, 0, true);
        src = this.truncate(src, 0, true);
        return ((((dst / NumIO.TWO_POW32)|0) | ((src / NumIO.TWO_POW32)|0)) * NumIO.TWO_POW32) + ((dst | src) >>> 0);
    }

    /**
     * evalXOR(dst, src)
     *
     * Adapted from /modules/pdp10/lib/cpuops.js:PDP10.XOR().
     *
     * Performs the logical "exclusive-or" (XOR) of two operands > 32 bits.
     *
     * @this {DbgIO}
     * @param {number} dst
     * @param {number} src
     * @return {number} (dst ^ src)
     */
    evalXOR(dst, src)
    {
        /*
         * We XOR the low 32 bits separately from the higher bits, and then combine them with addition.
         * Since all bits above 32 will be zero, and since 0 XOR 0 is 0, no special masking for the higher
         * bits is required.
         *
         * WARNING: When using JavaScript's 32-bit operators with values that could set bit 31 and produce a
         * negative value, it's critical to perform a final right-shift of 0, ensuring that the final result is
         * positive.
         */
        if (this.nDefaultBits <= 32) {
            return dst ^ src;
        }
        /*
         * Negative values don't yield correct results when dividing, so pass them through an unsigned truncate().
         */
        dst = this.truncate(dst, 0, true);
        src = this.truncate(src, 0, true);
        return ((((dst / NumIO.TWO_POW32)|0) ^ ((src / NumIO.TWO_POW32)|0)) * NumIO.TWO_POW32) + ((dst ^ src) >>> 0);
    }

    /**
     * evalOps(aVals, aOps, cOps)
     *
     * Some of our clients want a specific number of bits of integer precision.  If that precision is
     * greater than 32, some of the operations below will fail; for example, JavaScript bitwise operators
     * always truncate the result to 32 bits, so beware when using shift operations.  Similarly, it would
     * be wrong to always "|0" the final result, which is why we rely on truncate() now.
     *
     * Note that JavaScript integer precision is limited to 52 bits.  For example, in Node, if you set a
     * variable to 0x80000001:
     *
     *      foo=0x80000001|0
     *
     * then calculate foo*foo and display the result in binary using "(foo*foo).toString(2)":
     *
     *      '11111111111111111111111111111100000000000000000000000000000000'
     *
     * which is slightly incorrect because it has overflowed JavaScript's floating-point precision.
     *
     * 0x80000001 in decimal is -2147483647, so the product is 4611686014132420609, which is 0x3FFFFFFF00000001.
     *
     * @this {DbgIO}
     * @param {Array.<number>} aVals
     * @param {Array.<string>} aOps
     * @param {number} [cOps] (default is -1 for all)
     * @return {boolean} true if successful, false if error
     */
    evalOps(aVals, aOps, cOps = -1)
    {
        while (cOps-- && aOps.length) {
            let chOp = aOps.pop();
            if (aVals.length < 2) return false;
            let valNew;
            let val2 = aVals.pop();
            let val1 = aVals.pop();
            switch(chOp) {
            case '*':
                valNew = this.evalMUL(val1, val2);
                break;
            case '/':
                if (!val2) return false;
                valNew = Math.trunc(val1 / val2);
                break;
            case '^/':
                if (!val2) return false;
                valNew = val1 % val2;
                break;
            case '+':
                valNew = val1 + val2;
                break;
            case '-':
                valNew = val1 - val2;
                break;
            case '<<':
                valNew = val1 << val2;
                break;
            case '>>':
                valNew = val1 >> val2;
                break;
            case '>>>':
                valNew = val1 >>> val2;
                break;
            case '<':
                valNew = (val1 < val2? 1 : 0);
                break;
            case '<=':
                valNew = (val1 <= val2? 1 : 0);
                break;
            case '>':
                valNew = (val1 > val2? 1 : 0);
                break;
            case '>=':
                valNew = (val1 >= val2? 1 : 0);
                break;
            case '==':
                valNew = (val1 == val2? 1 : 0);
                break;
            case '!=':
                valNew = (val1 != val2? 1 : 0);
                break;
            case '&':
                valNew = this.evalAND(val1, val2);
                break;
            case '!':           // alias for MACRO-10 to perform a bitwise inclusive-or (OR)
            case '|':
                valNew = this.evalIOR(val1, val2);
                break;
            case '^!':          // since MACRO-10 uses '^' for base overrides, '^!' is used for bitwise exclusive-or (XOR)
                valNew = this.evalXOR(val1, val2);
                break;
            case '&&':
                valNew = (val1 && val2? 1 : 0);
                break;
            case '||':
                valNew = (val1 || val2? 1 : 0);
                break;
            case ',,':
                valNew = this.truncate(val1, 18, true) * Math.pow(2, 18) + this.truncate(val2, 18, true);
                break;
            case '_':
            case '^_':
                valNew = val1;
                /*
                 * While we always try to avoid assuming any particular number of bits of precision, the 'B' shift
                 * operator (which we've converted to '^_') is unique to the MACRO-10 environment, which imposes the
                 * following restrictions on the shift count.
                 */
                if (chOp == '^_') val2 = 35 - (val2 & 0xff);
                if (val2) {
                    /*
                     * Since binary shifting is a logical (not arithmetic) operation, and since shifting by division only
                     * works properly with positive numbers, we call truncate() to produce an unsigned value.
                     */
                    valNew = this.truncate(valNew, 0, true);
                    if (val2 > 0) {
                        valNew *= Math.pow(2, val2);
                    } else {
                        valNew = Math.trunc(valNew / Math.pow(2, -val2));
                    }
                }
                break;
            default:
                return false;
            }
            aVals.push(this.truncate(valNew));
        }
        return true;
    }

    /**
     * parseAddress(sAddress)
     *
     * @this {DbgIO}
     * @param {string} sAddress
     * @return {Address|undefined}
     */
    parseAddress(sAddress)
    {
        let address;
        if (sAddress) {
            let iOff = 0;
            let ch = sAddress.charAt(iOff);
            address = {off: 0, seg: -1, type: 0};

            switch(ch) {
            case '&':
                iOff++;
                break;
            case '#':
                iOff++;
                address.type = DbgIO.ADDRESS.PROTECTED;
                break;
            case '%':
                iOff++;
                ch = sAddress.charAt(iOff);
                if (ch == '%') {
                    iOff++;
                } else {
                    address.type = DbgIO.ADDRESS.LINEAR;
                }
                break;
            }

            let iColon = sAddress.indexOf(':');
            if (iColon >= 0) {
                let seg = this.parseExpression(sAddress.substring(iOff, iColon));
                if (seg != undefined) address.seg = seg;
                iOff = iColon + 1;
            }
            address.off = this.parseExpression(sAddress.substring(iOff)) || 0;
        }
        return address;
    }

    /**
     * parseArray(asValues, iValue, iLimit, nBase, aUndefined)
     *
     * parseExpression() takes a complete expression and divides it into array elements, where even elements
     * are values (which may be empty if two or more operators appear consecutively) and odd elements are operators.
     *
     * For example, if the original expression was "2*{3+{4/2}}", parseExpression() would call parseArray() with:
     *
     *      0   1   2   3   4   5   6   7   8   9  10  11  12  13  14
     *      -   -   -   -   -   -   -   -   -   -  --  --  --  --  --
     *      2   *       {   3   +       {   4   /   2   }       }
     *
     * This function takes care of recursively processing grouped expressions, by processing subsets of the array,
     * as well as handling certain base overrides (eg, temporarily switching to base-10 for binary shift suffixes).
     *
     * @this {DbgIO}
     * @param {Array.<string>} asValues
     * @param {number} iValue
     * @param {number} iLimit
     * @param {number} nBase
     * @param {Array|undefined} [aUndefined]
     * @return {number|undefined}
     */
    parseArray(asValues, iValue, iLimit, nBase, aUndefined)
    {
        let value;
        let sValue, sOp;
        let fError = false;
        let nUnary = 0;
        let aVals = [], aOps = [];

        let nBasePrev = this.nDefaultBase;
        this.nDefaultBase = nBase;

        while (iValue < iLimit) {
            let v;
            sValue = asValues[iValue++].trim();
            sOp = (iValue < iLimit? asValues[iValue++] : "");

            if (sValue) {
                v = this.parseValue(sValue, undefined, aUndefined, nUnary);
            } else {
                if (sOp == '{') {
                    let cOpen = 1;
                    let iStart = iValue;
                    while (iValue < iLimit) {
                        sValue = asValues[iValue++].trim();
                        sOp = (iValue < asValues.length? asValues[iValue++] : "");
                        if (sOp == '{') {
                            cOpen++;
                        } else if (sOp == '}') {
                            if (!--cOpen) break;
                        }
                    }
                    v = this.parseArray(asValues, iStart, iValue-1, this.nDefaultBase, aUndefined);
                    if (v != null && nUnary) {
                        v = this.parseUnary(v, nUnary);
                    }
                    sValue = (iValue < iLimit? asValues[iValue++].trim() : "");
                    sOp = (iValue < iLimit? asValues[iValue++] : "");
                }
                else {
                    /*
                     * When parseExpression() calls us, it has collapsed all runs of whitespace into single spaces,
                     * and although it allows single spaces to divide the elements of the expression, a space is neither
                     * a unary nor binary operator.  It's essentially a no-op.  If we encounter it here, then it followed
                     * another operator and is easily ignored (although perhaps it should still trigger a reset of nBase
                     * and nUnary -- TBD).
                     */
                    if (sOp == ' ') {
                        continue;
                    }
                    if (sOp == '^B') {
                        this.nDefaultBase = 2;
                        continue;
                    }
                    if (sOp == '^O') {
                        this.nDefaultBase = 8;
                        continue;
                    }
                    if (sOp == '^D') {
                        this.nDefaultBase = 10;
                        continue;
                    }
                    if (!(nUnary & (0xC0000000|0))) {
                        if (sOp == '+') {
                            continue;
                        }
                        if (sOp == '-') {
                            nUnary = (nUnary << 2) | 1;
                            continue;
                        }
                        if (sOp == '~' || sOp == '^-') {
                            nUnary = (nUnary << 2) | 2;
                            continue;
                        }
                        if (sOp == '^L') {
                            nUnary = (nUnary << 2) | 3;
                            continue;
                        }
                    }
                    fError = true;
                    break;
                }
            }

            if (v === undefined) {
                if (aUndefined) {
                    aUndefined.push(sValue);
                    v = 0;
                } else {
                    fError = true;
                    aUndefined = [];
                    break;
                }
            }

            aVals.push(this.truncate(v));

            /*
             * When parseExpression() calls us, it has collapsed all runs of whitespace into single spaces,
             * and although it allows single spaces to divide the elements of the expression, a space is neither
             * a unary nor binary operator.  It's essentially a no-op.  If we encounter it here, then it followed
             * a value, and since we don't want to misinterpret the next operator as a unary operator, we look
             * ahead and grab the next operator if it's not preceded by a value.
             */
            if (sOp == ' ') {
                if (iValue < asValues.length - 1 && !asValues[iValue]) {
                    iValue++;
                    sOp = asValues[iValue++]
                } else {
                    fError = true;
                    break;
                }
            }

            if (!sOp) break;

            let aBinOp = (this.achGroup[0] == '<'? DbgIO.DECOP_PRECEDENCE : DbgIO.BINOP_PRECEDENCE);
            if (!aBinOp[sOp]) {
                fError = true;
                break;
            }
            if (aOps.length && aBinOp[sOp] <= aBinOp[aOps[aOps.length - 1]]) {
                this.evalOps(aVals, aOps, 1);
            }
            aOps.push(sOp);

            /*
             * The MACRO-10 binary shifting operator assumes a base-10 shift count, regardless of the current
             * base, so we must override the current base to ensure the count is parsed correctly.
             */
            this.nDefaultBase = (sOp == '^_')? 10 : nBase;
            nUnary = 0;
        }

        if (fError || !this.evalOps(aVals, aOps) || aVals.length != 1) {
            fError = true;
        }

        if (!fError) {
            value = aVals.pop();

        } else if (!aUndefined) {
            this.println("parse error (" + (sValue || sOp) + ")");
        }

        this.nDefaultBase = nBasePrev;
        return value;
    }

    /**
     * parseASCII(sExpr, chDelim, nBits, cchMax)
     *
     * @this {DbgIO}
     * @param {string} sExpr
     * @param {string} chDelim
     * @param {number} nBits
     * @param {number} cchMax
     * @return {string|undefined}
     */
    parseASCII(sExpr, chDelim, nBits, cchMax)
    {
        let i;
        while ((i = sExpr.indexOf(chDelim)) >= 0) {
            let v = 0;
            let j = i + 1;
            let cch = cchMax;
            while (j < sExpr.length) {
                let ch = sExpr[j++];
                if (ch == chDelim) {
                    cch = -1;
                    break;
                }
                if (!cch) break;
                cch--;
                let c = ch.charCodeAt(0);
                if (nBits == 7) {
                    c &= 0x7F;
                } else {
                    c = (c - 0x20) & 0x3F;
                }
                v = this.truncate(v * Math.pow(2, nBits) + c, nBits * cchMax, true);
            }
            if (cch >= 0) {
                this.println("parse error (" + chDelim + sExpr + chDelim + ")");
                return undefined;
            } else {
                sExpr = sExpr.substr(0, i) + this.toBase(v, this.nDefaultBase) + sExpr.substr(j);
            }
        }
        return sExpr;
    }

    /**
     * parseExpression(sExpr, aUndefined)
     *
     * A quick-and-dirty expression parser.  It takes an expression like:
     *
     *      EDX+EDX*4+12345678
     *
     * and builds a value stack in aVals and a "binop" (binary operator) stack in aOps:
     *
     *      aVals       aOps
     *      -----       ----
     *      EDX         +
     *      EDX         *
     *      4           +
     *      ...
     *
     * We pop 1 "binop" from aOps and 2 values from aVals whenever a "binop" of lower priority than its
     * predecessor is encountered, evaluate, and push the result back onto aVals.  Only selected unary
     * operators are supported (eg, negate and complement); no ternary operators like '?:' are supported.
     *
     * aUndefined can be used to pass an array that collects any undefined variables that parseExpression()
     * encounters; the value of an undefined variable is zero.  This mode was added for components that need
     * to support expressions containing "fixups" (ie, values that must be determined later).
     *
     * @this {DbgIO}
     * @param {string|undefined} sExpr
     * @param {Array} [aUndefined] (collects any undefined variables)
     * @return {number|undefined} numeric value, or undefined if sExpr contains any undefined or invalid values
     */
    parseExpression(sExpr, aUndefined)
    {
        let value = undefined;

        if (sExpr) {
            /*
             * The default delimiting characters for grouped expressions are braces; they can be changed by altering
             * achGroup, but when that happens, instead of changing our regular expressions and operator tables,
             * we simply replace all achGroup characters with braces in the given expression.
             *
             * Why not use parentheses for grouped expressions?  Because some debuggers use parseReference() to perform
             * parenthetical value replacements in message strings, and they don't want parentheses taking on a different
             * meaning.  And for some machines, like the PDP-10, the convention is to use parentheses for other things,
             * like indexed addressing, and to use angle brackets for grouped expressions.
             */
            if (this.achGroup[0] != '{') {
                sExpr = sExpr.split(this.achGroup[0]).join('{').split(this.achGroup[1]).join('}');
            }

            /*
             * Quoted ASCII characters can have a numeric value, too, which must be converted now, to avoid any
             * conflicts with the operators below.
             */
            sExpr = this.parseASCII(sExpr, '"', 7, 5);  // MACRO-10 packs up to 5 7-bit ASCII codes into a value
            if (!sExpr) return value;
            sExpr = this.parseASCII(sExpr, "'", 6, 6);  // MACRO-10 packs up to 6 6-bit ASCII (SIXBIT) codes into a value
            if (!sExpr) return value;

            /*
             * All browsers (including, I believe, IE9 and up) support the following idiosyncrasy of a RegExp split():
             * when the RegExp uses a capturing pattern, the resulting array will include entries for all the pattern
             * matches along with the non-matches.  This effectively means that, in the set of expressions that we
             * support, all even entries in asValues will contain "values" and all odd entries will contain "operators".
             *
             * Although I started listing the operators in the RegExp in "precedential" order, that's not important;
             * what IS important is listing operators that contain shorter operators first.  For example, bitwise
             * shift operators must be listed BEFORE the logical less-than or greater-than operators.  The aBinOp tables
             * (BINOP_PRECEDENCE and DECOP_PRECEDENCE) are what determine precedence, not the RegExp.
             *
             * Also, to better accommodate MACRO-10 syntax, I've replaced the single '^' for XOR with '^!', and I've
             * added '!' as an alias for '|' (bitwise inclusive-or), '^-' as an alias for '~' (one's complement operator),
             * and '_' as a shift operator (+/- values specify a left/right shift, and the count is not limited to 32).
             *
             * And to avoid conflicts with MACRO-10 syntax, I've replaced the original mod operator ('%') with '^/'.
             *
             * The MACRO-10 binary shifting suffix ('B') is a bit more problematic, since a capital B can also appear
             * inside symbols, or inside hex values.  So if the default base is NOT 16, then I pre-scan for that suffix
             * and replace all non-symbolic occurrences with an internal shift operator ('^_').
             *
             * Note that parseInt(), which parseValue() relies on, supports both the MACRO-10 base prefix overrides
             * and the binary shifting suffix ('B'), but since that suffix can also be a bracketed expression, we have to
             * support it here as well.
             *
             * MACRO-10 supports only a subset of all the PCjs operators; for example, MACRO-10 doesn't support any of
             * the boolean logical/compare operators.  But unless we run into conflicts, I prefer sticking with this
             * common set of operators.
             *
             * All whitespace in the expression is collapsed to single spaces, and space has been added to the list
             * of "operators", but its sole function is as a separator, not as an operator.  parseArray() will ignore
             * single spaces as long as they are preceded and/or followed by a "real" operator.  It would be dangerous
             * to remove spaces entirely, because if an operator-less expression like "A B" was passed in, we would want
             * that to generate an error; if we converted it to "AB", evaluation might inadvertently succeed.
             */
            let regExp = /({|}|\|\||&&|\||\^!|\^B|\^O|\^D|\^L|\^-|~|\^_|_|&|!=|!|==|>=|>>>|>>|>|<=|<<|<|-|\+|\^\/|\/|\*|,,| )/;
            if (this.nDefaultBase != 16) {
                sExpr = sExpr.replace(/(^|[^A-Z0-9$%.])([0-9]+)B/, "$1$2^_").replace(/\s+/g, ' ');
            }
            let asValues = sExpr.split(regExp);
            value = this.parseArray(asValues, 0, asValues.length, this.nDefaultBase, aUndefined);
        }
        return value;
    }

    /**
     * parseUnary(value, nUnary)
     *
     * nUnary is actually a small "stack" of unary operations encoded in successive pairs of bits.
     * As parseExpression() encounters each unary operator, nUnary is shifted left 2 bits, and the
     * new unary operator is encoded in bits 0 and 1 (0b00 is none, 0b01 is negate, 0b10 is complement,
     * and 0b11 is reserved).  Here, we process the bits in reverse order (hence the stack-like nature),
     * ensuring that we process the unary operators associated with this value right-to-left.
     *
     * Since bitwise operators see only 32 bits, more than 16 unary operators cannot be supported
     * using this method.  We'll let parseExpression() worry about that; if it ever happens in practice,
     * then we'll have to switch to a more "expensive" approach (eg, an actual array of unary operators).
     *
     * @this {DbgIO}
     * @param {number} value
     * @param {number} nUnary
     * @return {number}
     */
    parseUnary(value, nUnary)
    {
        while (nUnary) {
            let bit;
            switch(nUnary & 0o3) {
            case 1:
                value = -this.truncate(value);
                break;
            case 2:
                value = this.evalXOR(value, -1);        // this is easier than adding an evalNOT()...
                break;
            case 3:
                bit = 35;                               // simple left-to-right zero-bit-counting loop...
                while (bit >= 0 && !this.evalAND(value, Math.pow(2, bit))) bit--;
                value = 35 - bit;
                break;
            }
            nUnary >>>= 2;
        }
        return value;
    }

    /**
     * parseValue(sValue, sName, aUndefined, nUnary)
     *
     * @this {DbgIO}
     * @param {string} [sValue]
     * @param {string} [sName] is the name of the value, if any
     * @param {Array} [aUndefined]
     * @param {number} [nUnary] (0 for none, 1 for negate, 2 for complement, 3 for leading zeros)
     * @return {number|undefined} numeric value, or undefined if sValue is either undefined or invalid
     */
    parseValue(sValue, sName, aUndefined, nUnary = 0)
    {
        let value;
        if (sValue != undefined) {
            value = this.getRegister(sValue.toUpperCase());
            if (value == undefined) {
                value = this.getVariable(sValue);
                if (value != undefined) {
                    let sUndefined = this.getVariableFixup(sValue);
                    if (sUndefined) {
                        if (aUndefined) {
                            aUndefined.push(sUndefined);
                        } else {
                            let valueUndefined = this.parseExpression(sUndefined, aUndefined);
                            if (valueUndefined !== undefined) {
                                value += valueUndefined;
                            } else {
                                if (MAXDEBUG) this.println("undefined " + (sName || "value") + ": " + sValue + " (" + sUndefined + ")");
                                value = undefined;
                            }
                        }
                    }
                } else {
                    /*
                    * A feature of MACRO-10 is that any single-digit number is automatically interpreted as base-10.
                    */
                    value = this.parseInt(sValue, sValue.length > 1 || this.nDefaultBase > 10? this.nDefaultBase : 10);
                }
            }
            if (value != undefined) {
                value = this.truncate(this.parseUnary(value, nUnary));
            } else {
                if (MAXDEBUG) this.println("invalid " + (sName || "value") + ": " + sValue);
            }
        } else {
            if (MAXDEBUG) this.println("missing " + (sName || "value"));
        }
        return value;
    }

    /**
     * truncate(v, nBits, fUnsigned)
     *
     * @this {DbgIO}
     * @param {number} v
     * @param {number} [nBits]
     * @param {boolean} [fUnsigned]
     * @return {number}
     */
    truncate(v, nBits, fUnsigned)
    {
        let limit, vNew = v;
        nBits = nBits || this.nDefaultBits;

        if (fUnsigned) {
            if (nBits == 32) {
                vNew = v >>> 0;
            }
            else if (nBits < 32) {
                vNew = v & ((1 << nBits) - 1);
            }
            else {
                limit = Math.pow(2, nBits);
                if (v < 0 || v >= limit) {
                    vNew = v % limit;
                    if (vNew < 0) vNew += limit;
                }
            }
        }
        else {
            if (nBits <= 32) {
                vNew = (v << (32 - nBits)) >> (32 - nBits);
            }
            else {
                limit = Math.pow(2, nBits - 1);
                if (v >= limit) {
                    vNew = (v % limit);
                    if (((v / limit)|0) & 1) vNew -= limit;
                } else if (v < -limit) {
                    vNew = (v % limit);
                    if ((((-v - 1) / limit) | 0) & 1) {
                        if (vNew) vNew += limit;
                    }
                    else {
                        if (!vNew) vNew -= limit;
                    }
                }
            }
        }
        if (v != vNew) {
            if (MAXDEBUG) this.println("warning: value " + v + " truncated to " + vNew);
            v = vNew;
        }
        return v;
    }

    /**
     * addBreak(aBreakAddr, address)
     *
     * @param {Array} aBreakAddr
     * @param {Address} address
     * @return {number} (>= 0 if added, < 0 if not)
     */
    addBreak(aBreakAddr, address)
    {
        let i = aBreakAddr.indexOf(address.off);
        if (i < 0) i = aBreakAddr.indexOf((address.off >>> 0) + NumIO.TWO_POW32);
        if (i >= 0) {
            i = -(i + 1);
        } else {
            for (i = 0; i < aBreakAddr.length; i++) {
                if (aBreakAddr[i] == undefined) break;
            }
            aBreakAddr[i] = address.off;
        }
        return i;
    }

    /**
     * clearBreak(index)
     *
     * @this {DbgIO}
     * @param {number} index
     * @return {string}
     */
    clearBreak(index)
    {
        if (index < -1) {
            return this.enumBreak(this.clearBreak.bind(this));
        }
        let i = index, sResult = "";
        let aBreakAddr = this.aReadBusAddr;
        if (i >= aBreakAddr.length) {
            i -= aBreakAddr.length;
            aBreakAddr = this.aWriteBusAddr;
        }
        if (i >= 0) {
            let addr = aBreakAddr[i];
            let isEmpty = function(aBreakAddr) {
                for (let i = 0; i < aBreakAddr.length; i++) {
                    if (aBreakAddr[i] != undefined) return false;
                }
                return true;
            };
            if (addr != undefined) {
                if (aBreakAddr == this.aReadBusAddr) {
                    if (this.busMemory.untrapRead(addr, this.readBusCheck)) {
                        this.aReadBusAddr[i] = undefined;
                        sResult += this.sprintf("%2d: br %#0x cleared\n", index, addr);
                    }
                } else {
                    if (this.busMemory.untrapWrite(addr, this.writeBusCheck)) {
                        this.aWriteBusAddr[i] = undefined;
                        sResult += this.sprintf("%2d: bw %#0x cleared\n", index, addr);
                        if (isEmpty(this.aWriteBusAddr)) {
                            this.aWriteBusAddr = [];
                            if (isEmpty(this.aReadBusAddr)) {
                                this.aReadBusAddr = [];
                            }
                        }
                    }
                }
                if (!sResult) sResult = this.sprintf("invalid break address: %#0x\n", addr);
            }
            if (!sResult) sResult = this.sprintf("invalid break index: %d\n", index);
        }
        if (!sResult) sResult = "missing break index";
        return sResult;
    }

    /**
     * enableBreak(index, enable)
     *
     * @this {DbgIO}
     * @param {number} index
     * @param {boolean} [enable]
     * @return {string}
     */
    enableBreak(index, enable = false)
    {
        if (index < -1) {
            return this.enumBreak(this.enableBreak.bind(this), enable);
        }
        let sResult = "";
        if (index >= 0) {
            let i = index, cmd = "br";
            let aBreakAddr = this.aReadBusAddr;
            if (i >= aBreakAddr.length) {
                i -= aBreakAddr.length;
                cmd = "bw";
                aBreakAddr = this.aWriteBusAddr;
            }
            if (i >= 0) {
                let success = true;
                let addr = aBreakAddr[i], addrPrint;
                let action = enable? "enabled" : "disabled";
                if (addr < NumIO.TWO_POW32) {
                    addrPrint = addr;
                    if (enable) {
                        success = false;
                    } else {
                        addr = (addr >>> 0) + NumIO.TWO_POW32;
                    }
                } else {
                    addrPrint = (addr - NumIO.TWO_POW32)|0;
                    if (!enable) {
                        success = false;
                    } else {
                        addr = addrPrint;
                    }
                }
                if (!success) {
                    sResult += this.sprintf("%2d: %s %#0x already %s\n", index, cmd, addrPrint, action);
                } else {
                    aBreakAddr[i] = addr;
                    sResult += this.sprintf("%2d: %s %#0x %s\n", index, cmd, addrPrint, action);
                }
            }
        }
        if (!sResult) sResult = "missing break index";
        return sResult;
    }

    /**
     * enumBreak(func, option)
     *
     * @param {function(number,(boolean|undefined))} func
     * @param {boolean} [option]
     * @return {string}
     */
    enumBreak(func, option)
    {
        let sResult = "";
        let enumBreakAddr = function(aBreakAddrs, index = 0) {
            for (let i = 0; i < aBreakAddrs.length; i++) {
                let addr = aBreakAddrs[i];
                if (addr != undefined) sResult += func(index + i, option);
            }
        };
        enumBreakAddr(this.aReadBusAddr);
        enumBreakAddr(this.aWriteBusAddr, this.aReadBusAddr.length);
        return sResult;
    }

    /**
     * listBreak(index)
     *
     * @this {DbgIO}
     * @param {number} [index]
     * @return {string}
     */
    listBreak(index)
    {
        let dbg = this;
        let sResult = "";
        let listBreakAddr = function(aBreakAddrs, cmd, offset) {
            for (let i = 0; i < aBreakAddrs.length; i++) {
                let addr = aBreakAddrs[i];
                if (addr == undefined) continue;
                if (index < 0 || index == i + offset) {
                    let enabled = "enabled";
                    if (addr >= NumIO.TWO_POW32) {
                        enabled = "disabled";
                        addr = (addr - NumIO.TWO_POW32)|0;
                    }
                    sResult += dbg.sprintf("%2d: br %#0x %s\n", i + offset, addr, enabled);
                }
            }
        };
        listBreakAddr(this.aReadBusAddr, "br", 0);
        listBreakAddr(this.aWriteBusAddr, "bw", this.aReadBusAddr.length);
        if (!sResult) sResult = "no break addresses found";
        return sResult;
    }

    /**
     * setBreak(address, write)
     *
     * @this {DbgIO}
     * @param {Address} [address]
     * @param {boolean} [write]
     * @return {string}
     */
    setBreak(address, write)
    {
        let sResult = "";
        if (address) {
            let cmd = write? "bw" : "br";
            let aBusAddr = write? this.aWriteBusAddr : this.aReadBusAddr;
            let i = this.addBreak(aBusAddr, address);
            if (i >= 0) {
                if (!write) {
                    this.busMemory.trapRead(address.off, this.readBusCheck);
                } else {
                    this.busMemory.trapWrite(address.off, this.writeBusCheck);
                }
                if (write) i += this.aReadBusAddr.length;
                sResult += this.sprintf("%2d: %s %#0x set\n", i, cmd, address.off);
            } else {
                sResult += this.sprintf("%s %#0x already set\n", cmd, address.off);
            }
        } else {
            sResult = "missing break address";
        }
        return sResult;
    }

    /**
     * checkBusRead(addr)
     *
     * @this {DbgIO}
     * @param {number} addr
     */
    checkBusRead(addr)
    {
        if (this.aReadBusAddr.indexOf(addr) >= 0) {
            throw new Error(this.sprintf("read break() at %#0x", addr));
        }
    }

    /**
     * checkBusWrite(addr)
     *
     * @this {DbgIO}
     * @param {number} addr
     * @param {number} value
     */
    checkBusWrite(addr, value)
    {
        if (this.aWriteBusAddr.indexOf(addr) >= 0) {
            throw new Error(this.sprintf("write break(%#0x) at %#0x", value, addr));
        }
    }

    /**
     * disassemble(opCode, addr)
     *
     * Returns a string representation of the selected instruction.
     *
     * @this {DbgIO}
     * @param {number|undefined} opCode
     * @param {number} addr
     * @returns {string}
     */
    disassemble(opCode, addr)
    {
        let sOp = "???", sOperands = "";

        return this.sprintf("%#06x: %#06x  %-8s%s\n", addr, opCode, sOp, sOperands);
    }

    /**
     * onCommand(aTokens)
     *
     * Processes basic debugger commands.
     *
     * @this {DbgIO}
     * @param {Array.<string>} aTokens
     * @returns {string}
     */
    onCommand(aTokens)
    {
        let sResult = "", sExpr;
        let count = 0, values = [];
        let cmd = aTokens[1], index, address, nValues;
        if (aTokens[2] == '*') {
            index = -2;
        } else {
            index = this.parseInt(aTokens[2]);
            if (index == undefined) index = -1;
            address = this.parseAddress(aTokens[2]);
        }
        nValues = this.parseInt(aTokens[3], 10) || 8;
        for (let i = 3; i < aTokens.length; i++) {
            values.push(this.parseInt(aTokens[i], 16));
        }

        switch(cmd[0]) {
        case 'b':
            if (cmd[1] == 'c') {
                sResult = this.clearBreak(index);
            } else if (cmd[1] == 'd') {
                sResult = this.enableBreak(index);
            } else if (cmd[1] == 'e') {
                sResult = this.enableBreak(index, true);
            } else if (cmd[1] == 'l') {
                sResult = this.listBreak(index);
            } else if (cmd[1] == 'r') {
                sResult = this.setBreak(address);
            } else if (cmd[1] == 'w') {
                sResult = this.setBreak(address, true);
            } else {
                sResult = undefined;
            }
            break;

        case 'e':
            for (let i = 0; address != undefined && i < values.length; i++) {
                let prev = this.busMemory.readData(address.off);
                if (prev == undefined) break;
                this.busMemory.writeData(address.off, values[i]);
                sResult += this.sprintf("%#06x: %#06x changed to %#06x\n", address.off, prev, values[i]);
                address.off++;
                count++;
            }
            sResult += this.sprintf("%d locations updated\n", count);
            break;

        case 'g':
            if (this.time.start()) {
                if (address != undefined) this.setBreak(address);
            } else {
                sResult = "already started";
            }
            break;

        case 'h':
            if (!this.time.stop()) sResult = "already stopped";
            break;

        case 'p':
            aTokens.shift();
            aTokens.shift();
            sExpr = aTokens.join(' ');
            this.printf("%s = %s\n", sExpr, this.toBase(this.parseExpression(sExpr)));
            break;

        case 'r':
            if (address != undefined) this.cpu.setRegister(cmd.substr(1), address.off);
            sResult += this.cpu.toString(cmd[1]);
            this.sCommandPrev = aTokens[0];
            break;

        case 't':
            nValues = this.parseInt(aTokens[2], 10) || 1;
            this.time.onStep(nValues);
            this.sCommandPrev = aTokens[0];
            break;

        case 'u':
            if (address == undefined) {
                address = this.addrPrev;
            }
            if (address == undefined) {
                address = {off: this.getRegister(DbgIO.REGISTER.PC) || 0};
            }
            while (nValues--) {
                let opCode = this.busMemory.readData(address.off);
                if (opCode == undefined) break;
                sResult += this.disassemble(opCode, address.off++);
            }
            this.addrPrev = address;
            this.sCommandPrev = aTokens[0];
            break;

        case '?':
            sResult = "debugger commands:";
            DbgIO.COMMANDS.forEach((cmd) => {sResult += '\n' + cmd;});
            break;
        }

        if (sResult == undefined && aTokens[0]) {
            sResult = "unrecognized command '" + aTokens[0] + "' (try '?')";
        }

        if (sResult) this.println(sResult.replace(/\s+$/, ""));
        return sResult;
    }
}

DbgIO.COMMANDS = [
    "bc [n|*]\tclear break address",
    "bd [n|*]\tdisable break address",
    "be [n|*]\tenable break address",
    "bl [n]\t\tlist break addresses",
    "br [addr]\tbreak on read",
    "bw [addr]\tbreak on write",
    "e [addr] ...\tedit memory",
    "g [addr]\trun (to addr)",
    "h\t\thalt",
    "r[a]\t\tdump (all) registers",
    "t [n]\t\tstep (n instructions)",
    "u [addr] [n]\tdisassemble (at addr)"
];

DbgIO.ADDRESS = {
    LINEAR:     0x01,           // if seg is not set, this indicates whether the address is physical (clear) or linear (set)
    PROTECTED:  0x02            // if seg is set, this indicates whether the address is real (clear) or protected (set)
};

/*
 * Predefined "virtual registers" that we expect the CPU to support.
 */
DbgIO.REGISTER = {
    PC:         "PC"            // the CPU's program counter
};

/*
 * These are our operator precedence tables.  Operators toward the bottom (with higher values) have
 * higher precedence.  BINOP_PRECEDENCE was our original table; we had to add DECOP_PRECEDENCE because
 * the precedence of operators in DEC's MACRO-10 expressions differ.  Having separate tables also allows
 * us to remove operators that shouldn't be supported, but unless some operator creates a problem,
 * I prefer to keep as much commonality between the tables as possible.
 *
 * Missing from these tables are the (limited) set of unary operators we support (negate and complement),
 * since this is only a BINARY operator precedence, not a general-purpose precedence table.  Assume that
 * all unary operators take precedence over all binary operators.
 */
DbgIO.BINOP_PRECEDENCE = {
    '||':   5,      // logical OR
    '&&':   6,      // logical AND
    '!':    7,      // bitwise OR (conflicts with logical NOT, but we never supported that)
    '|':    7,      // bitwise OR
    '^!':   8,      // bitwise XOR (added by MACRO-10 sometime between the 1972 and 1978 versions)
    '&':    9,      // bitwise AND
    '!=':   10,     // inequality
    '==':   10,     // equality
    '>=':   11,     // greater than or equal to
    '>':    11,     // greater than
    '<=':   11,     // less than or equal to
    '<':    11,     // less than
    '>>>':  12,     // unsigned bitwise right shift
    '>>':   12,     // bitwise right shift
    '<<':   12,     // bitwise left shift
    '-':    13,     // subtraction
    '+':    13,     // addition
    '^/':   14,     // remainder
    '/':    14,     // division
    '*':    14,     // multiplication
    '_':    19,     // MACRO-10 shift operator
    '^_':   19,     // MACRO-10 internal shift operator (converted from 'B' suffix form that MACRO-10 uses)
    '{':    20,     // open grouped expression (converted from achGroup[0])
    '}':    20      // close grouped expression (converted from achGroup[1])
};

DbgIO.DECOP_PRECEDENCE = {
    ',,':   1,      // high-word,,low-word
    '||':   5,      // logical OR
    '&&':   6,      // logical AND
    '!=':   10,     // inequality
    '==':   10,     // equality
    '>=':   11,     // greater than or equal to
    '>':    11,     // greater than
    '<=':   11,     // less than or equal to
    '<':    11,     // less than
    '>>>':  12,     // unsigned bitwise right shift
    '>>':   12,     // bitwise right shift
    '<<':   12,     // bitwise left shift
    '-':    13,     // subtraction
    '+':    13,     // addition
    '^/':   14,     // remainder
    '/':    14,     // division
    '*':    14,     // multiplication
    '!':    15,     // bitwise OR (conflicts with logical NOT, but we never supported that)
    '|':    15,     // bitwise OR
    '^!':   15,     // bitwise XOR (added by MACRO-10 sometime between the 1972 and 1978 versions)
    '&':    15,     // bitwise AND
    '_':    19,     // MACRO-10 shift operator
    '^_':   19,     // MACRO-10 internal shift operator (converted from 'B' suffix form that MACRO-10 uses)
    '{':    20,     // open grouped expression (converted from achGroup[0])
    '}':    20      // close grouped expression (converted from achGroup[1])
};

/**
 * @copyright https://www.pcjs.org/modules/devices/dbg8080.js (C) Jeff Parsons 2012-2019
 */

/**
 * Debugger for the 8080 CPU
 *
 * @class {Debugger}
 * @unrestricted
 */
class Debugger extends DbgIO {
    /**
     * DbgIO(idMachine, idDevice, config)
     *
     * @this {Debugger}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
    }

    /**
     * disassemble(opCode, addr)
     *
     * Overrides DbgIO's default disassemble() function with one that understands 8080 instructions.
     *
     * @this {Debugger}
     * @param {number|undefined} opCode
     * @param {number} addr
     * @returns {string}
     */
    disassemble(opCode, addr)
    {
        return super.disassemble(opCode, addr);
    }
}

/**
 * @copyright https://www.pcjs.org/modules/devices/memory.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ addr: (number|undefined), size: number, type: (number|undefined), values: (Array.<number>|undefined), offset: (number|undefined) }} */
var MemoryConfig;

/**
 * @class {Memory}
 * @unrestricted
 * @property {number|undefined} addr
 * @property {number} size
 * @property {number} type
 * @property {Array.<number>} values
 * @property {number} offset
 * @property {boolean} dirty
 * @property {boolean} dirtyEver
 */
class Memory extends Device {
    /**
     * Memory(idMachine, idDevice, config)
     *
     * @this {Memory}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {MemoryConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        this.addr = config['addr'];
        this.size = config['size'];
        this.type = config['type'] || Memory.TYPE.NONE;
        this.values = config['values'] || new Array(this.size);
        this.offset = config['offset'] || 0;
        this.dirty = this.dirtyEver = false;

        switch(this.type) {
        case Memory.TYPE.NONE:
            this.readData = this.readNone;
            this.writeData = this.writeNone;
            break;
        case Memory.TYPE.ROM:
            this.readData = this.readValue;
            this.writeData = this.writeNone;
            break;
        case Memory.TYPE.RAM:
            this.readData = this.readValue;
            this.writeData = this.writeValue;
            break;
        }
    }

    /**
     * isDirty()
     *
     * @return {boolean}
     */
    isDirty()
    {
        if (this.dirty) {
            this.dirty = false;
            this.dirtyEver = true;
            return true;
        }
        return false;
    }

    /**
     * readNone(offset)
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number|undefined}
     */
    readNone(offset)
    {
        return undefined;
    }

    /**
     * readValue(offset)
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number|undefined}
     */
    readValue(offset)
    {
        return this.values[this.offset + offset];
    }

    /**
     * writeNone(offset, value)
     *
     * @this {Memory}
     * @param {number} offset
     * @param {number} value
     */
    writeNone(offset, value)
    {
    }

    /**
     * writeValue(offset, value)
     *
     * @this {Memory}
     * @param {number} offset
     * @param {number} value
     */
    writeValue(offset, value)
    {
        this.values[this.offset + offset] = value;
        this.dirty = true;
    }
}

Memory.TYPE = {
    NONE:       0,
    ROM:        1,
    RAM:        2
};

/**
 * @copyright https://www.pcjs.org/modules/devices/input.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ class: string, bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined), location: Array.<number>, map: (Array.<Array.<number>>|undefined), drag: (boolean|undefined), scroll: (boolean|undefined), hexagonal: (boolean|undefined), buttonDelay: (number|undefined) }} */
var InputConfig;

/**
 * @class {Input}
 * @unrestricted
 * @property {InputConfig} config
 * @property {Array.<number>} location
 * @property {Array.<Array.<number>>} map
 * @property {boolean} fDrag
 * @property {boolean} fScroll
 * @property {boolean} fHexagonal
 * @property {number} buttonDelay
 * @property {{
 *  surface: HTMLImageElement|undefined
 * }} bindings
 */
class Input extends Device {
    /**
     * Input(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "input": {
     *        "class": "Input",
     *        "location": [139, 325, 368, 478, 0.34, 0.5, 640, 853],
     *        "map": [
     *          ["2nd",  "inv",  "lnx",  "\\b",  "clr"],
     *          ["lrn",  "xchg", "sq",   "sqrt", "rcp"],
     *          ["sst",  "sto",  "rcl",  "sum",  "exp"],
     *          ["bst",  "ee",   "(",    ")",    "/"],
     *          ["gto",  "7",    "8",    "9",    "*"],
     *          ["sbr",  "4",    "5",    "6",    "-"],
     *          ["rst",  "1",    "2",    "3",    "+"],
     *          ["r/s",  "0",    ".",    "+/-",  "=|\\r"]
     *        ],
     *        "drag": false,
     *        "bindings": {
     *          "surface": "imageTI57",
     *          "power": "powerTI57",
     *          "reset": "resetTI57"
     *        }
     *      }
     *
     * A word about the "power" button: the page will likely use absolute positioning to overlay the HTML button
     * onto the image of the physical button, and the temptation might be to use the style "display:none" to hide
     * it, but "opacity:0" should be used instead, because otherwise our efforts to use it as focusable element
     * may fail.
     *
     * @this {Input}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {InputConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));

        this.onInput = null;
        this.onPower = null;
        this.onReset = null;
        this.onHover = null;

        /*
         * If 'drag' is true, then the onInput() handler will be called whenever the current col and/or row
         * changes, even if the mouse hasn't been released since the previous onInput() call.
         *
         * The default is false, because in general, allowing drag is a bad idea for calculator buttons.  But
         * I've made this an option for other input surfaces, like LED arrays, where you might want to turn a
         * series of LEDs on or off.
         */
        this.fDrag = this.getDefaultBoolean('drag', false);

        /*
         * If 'scroll' is true, then we do NOT call preventDefault() on touch events; this permits the input
         * surface to be scrolled like any other part of the page.  The default is false, because this has other
         * side-effects (eg, inadvertent zooms).
         */
        this.fScroll = this.getDefaultBoolean('scroll', false);

        /*
         * This is set on receipt of the first 'touch' event of any kind, and is used by the 'mouse' event
         * handlers to disregard mouse events if set.
         */
        this.fTouch = false;

        let element = this.bindings[Input.BINDING.SURFACE];
        if (element) {
            /*
             * The location array, eg:
             *
             *      "location": [139, 325, 368, 478, 0.34, 0.5, 640, 853, 180, 418, 75, 36],
             *
             * contains the top left corner (xInput, yInput) and dimensions (cxInput, cyInput)
             * of the input rectangle where the buttons described in the map are located, relative
             * to the surface image.  It also describes the average amount of horizontal and vertical
             * space between buttons, as fractions of the average button width and height (hGap, vGap).
             *
             * With all that, we can now calculate the center lines for each column and row.  This
             * obviously assumes that all the buttons are evenly laid out in a perfect grid.  For
             * devices that don't have such a nice layout, a different location array format will
             * have to be defined.
             *
             * NOTE: While element.naturalWidth and element.naturalHeight should, for all modern
             * browsers, contain the surface image's dimensions as well, those values still might not
             * be available if our constructor is called before the page's onload event has fired,
             * so we allow them to be stored in the next two elements of the location array, too.
             *
             * Finally, the position and size of the device's power button may be stored in the array
             * as well, in case some browsers refuse to generate onClickPower() events (eg, if they
             * think the button is inaccessible/not visible).
             */
            let location = this.config['location'];
            this.xInput = location[0];
            this.yInput = location[1];
            this.cxInput = location[2];
            this.cyInput = location[3];
            this.hGap = location[4] || 1.0;
            this.vGap = location[5] || 1.0;
            this.cxSurface = location[6] || element.naturalWidth || this.cxInput;
            this.cySurface = location[7] || element.naturalHeight || this.cyInput;
            this.xPower = location[8] || 0;
            this.yPower = location[9] || 0;
            this.cxPower = location[10] || 0;
            this.cyPower = location[11] || 0;
            this.map = this.config['map'];
            if (this.map) {
                this.nRows = this.map.length;
                this.nCols = this.map[0].length;
            } else {
                this.nCols = this.hGap;
                this.nRows = this.vGap;
                this.hGap = this.vGap = 0;
            }

            /*
             * If 'hexagonal' is true, then we treat the input grid as hexagonal, where even rows of the associated
             * display are offset.
             */
            this.fHexagonal = this.getDefaultBoolean('hexagonal', false);

            /*
             * The 'buttonDelay' setting is only necessary for devices (ie, old calculator chips) that are either slow
             * to respond and/or have debouncing logic that would otherwise be defeated.
             */
            this.buttonDelay = this.getDefaultNumber('buttonDelay', 0);

            /*
             * To calculate the average button width (cxButton), we know that the overall width
             * must equal the sum of all the button widths + the sum of all the button gaps:
             *
             *      cxInput = nCols * cxButton + nCols * (cxButton * hGap)
             *
             * The number of gaps would normally be (nCols - 1), but we require that cxInput include
             * only 1/2 the gap at the edges, too.  Solving for cxButton:
             *
             *      cxButton = cxInput / (nCols + nCols * hGap)
             */
            this.cxButton = (this.cxInput / (this.nCols + this.nCols * this.hGap))|0;
            this.cyButton = (this.cyInput / (this.nRows + this.nRows * this.vGap))|0;
            this.cxGap = (this.cxButton * this.hGap)|0;
            this.cyGap = (this.cyButton * this.vGap)|0;

            /*
             * xStart and yStart record the last 'touchstart' or 'mousedown' position on the surface
             * image; they will be reset to -1 when movement has ended (eg, 'touchend' or 'mouseup').
             */
            this.xStart = this.yStart = -1;

            this.captureMouse(element);
            this.captureTouch(element);

            if (this.time) {
                /*
                 * We use a timer for the touch/mouse release events, to ensure that the machine had
                 * enough time to notice the input before releasing it.
                 */
                let input = this;
                if (this.buttonDelay) {
                    this.timerInputRelease = this.time.addTimer("timerInputRelease", function onInputRelease() {
                        if (input.xStart < 0 && input.yStart < 0) { // auto-release ONLY if it's REALLY released
                            input.setPosition(-1, -1);
                        }
                    });
                }
                if (this.map) {
                    /*
                     * This auto-releases the last key reported after an appropriate delay, to ensure that
                     * the machine had enough time to notice the corresponding button was pressed.
                     */
                    if (this.buttonDelay) {
                        this.timerKeyRelease = this.time.addTimer("timerKeyRelease", function onKeyRelease() {
                            input.onKeyTimer();
                        });
                    }
                    /*
                     * I used to maintain a single-key buffer (this.keyPressed) and would immediately release
                     * that key as soon as another key was pressed, but it appears that the ROM wants a minimum
                     * delay between release and the next press -- probably for de-bouncing purposes.  So we
                     * maintain a key state: 0 means no key has gone down or up recently, 1 means a key just went
                     * down, and 2 means a key just went up.  keysPressed maintains a queue of keys (up to 16)
                     * received while key state is non-zero.
                     */
                    this.keyState = 0;
                    this.keysPressed = [];
                    /*
                     * I'm attaching my 'keypress' handlers to the document object, since image elements are
                     * not focusable.  I'm disinclined to do what I've done with other machines (ie, create an
                     * invisible <textarea> overlay), because in this case, I don't really want a soft keyboard
                     * popping up and obscuring part of the display.
                     *
                     * A side-effect, however, is that if the user attempts to explicitly give the image
                     * focus, we don't have anything for focus to attach to.  We address that in onMouseDown(),
                     * by redirecting focus to the "power" button, if any, not because we want that or any other
                     * button to have focus, but simply to remove focus from any other input element on the page.
                     */
                    this.captureKeys(document);
                }
            }

            /*
             * Finally, the active input state.  If there is no active input, col and row are -1.  After
             * this point, these variables will be updated by setPosition().
             */
            this.col = this.row = -1;
        }
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Input}
     * @param {string} binding
     * @param {Element} element
     */
    addBinding(binding, element)
    {
        let input = this;

        switch(binding) {

        case Input.BINDING.POWER:
            element.onclick = function onClickPower() {
                if (input.onPower) input.onPower();
            };
            break;

        case Input.BINDING.RESET:
            element.onclick = function onClickReset() {
                if (input.onReset) input.onReset();
            };
            break;
        }
        super.addBinding(binding, element);
    }

    /**
     * addClick(onPower, onReset)
     *
     * Called by the Chip device to set up power and reset notifications.
     *
     * @this {Input}
     * @param {function()} [onPower] (called when the "power" button, if any, is clicked)
     * @param {function()} [onReset] (called when the "reset" button, if any, is clicked)
     */
    addClick(onPower, onReset)
    {
        this.onPower = onPower;
        this.onReset = onReset;
    }

    /**
     * addHover(onHover)
     *
     * @this {Input}
     * @param {function(number, number)} onHover
     */
    addHover(onHover)
    {
        this.onHover = onHover;
    }

    /**
     * addInput(onInput)
     *
     * Called by the Chip device to set up input notifications.
     *
     * @this {Input}
     * @param {function(number,number)} onInput
     */
    addInput(onInput)
    {
        this.onInput = onInput;
    }

    /**
     * advanceKeyState()
     *
     * @this {Input}
     */
    advanceKeyState()
    {
        if (!this.buttonDelay) {
            this.onKeyTimer();
        } else {
            this.time.setTimer(this.timerKeyRelease, this.buttonDelay);
        }
    }

    /**
     * captureKeys(element)
     *
     * @this {Input}
     * @param {Document|Element} element
     */
    captureKeys(element)
    {
        let input = this;
        element.addEventListener(
            'keydown',
            function onKeyDown(event) {
                event = event || window.event;
                let activeElement = document.activeElement;
                if (activeElement == input.bindings[Input.BINDING.POWER]) {
                    let keyCode = event.which || event.keyCode;
                    let ch = Input.KEYCODE[keyCode], used = false;
                    if (ch) used = input.onKeyActive(ch);
                    input.printf(MESSAGES.KEY + MESSAGES.EVENT, "onKeyDown(keyCode=%#04x): %5.2f (%s)\n", keyCode, (Date.now() / 1000) % 60, ch? (used? "used" : "unused") : "ignored");
                    if (used) event.preventDefault();
                }
            }
        );
        element.addEventListener(
            'keypress',
            function onKeyPress(event) {
                event = event || window.event;
                let charCode = event.which || event.charCode;
                let ch = String.fromCharCode(charCode), used = false;
                if (ch) used = input.onKeyActive(ch);
                input.printf(MESSAGES.KEY + MESSAGES.EVENT, "onKeyPress(charCode=%#04x): %5.2f (%s)\n", charCode, (Date.now() / 1000) % 60, ch? (used? "used" : "unused") : "ignored");
                if (used) event.preventDefault();
            }
        );
        element.addEventListener(
            'keyup',
            function onKeyUp(event) {
                event = event || window.event;
                let activeElement = document.activeElement;
                if (activeElement == input.bindings[Input.BINDING.POWER]) {
                    let keyCode = event.which || event.keyCode;
                    input.printf(MESSAGES.KEY + MESSAGES.EVENT, "onKeyUp(keyCode=%#04x): %5.2f (ignored)\n", keyCode, (Date.now() / 1000) % 60);
                }
            }
        );
    }

    /**
     * captureMouse(element)
     *
     * @this {Input}
     * @param {HTMLImageElement} element
     */
    captureMouse(element)
    {
        let input = this;

        element.addEventListener(
            'mousedown',
            function onMouseDown(event) {
                if (input.fTouch) return;
                /*
                 * If there are any text input elements on the page that might currently have focus,
                 * this is a good time to divert focus to a focusable element of our own (eg, a "power"
                 * button).  Otherwise, key presses could be confusingly processed in two places.
                 *
                 * Unfortunately, setting focus on an element can cause the browser to scroll the element
                 * into view, so to avoid that, we use the following scrollTo() work-around.
                 */
                let button = input.bindings[Input.BINDING.POWER];
                if (button) {
                    let x = window.scrollX, y = window.scrollY;
                    button.focus();
                    window.scrollTo(x, y);
                }
                if (!event.button) {
                    input.processEvent(element, Input.ACTION.PRESS, event);
                }
            }
        );

        element.addEventListener(
            'mousemove',
            function onMouseMove(event) {
                if (input.fTouch) return;
                input.processEvent(element, Input.ACTION.MOVE, event);
            }
        );

        element.addEventListener(
            'mouseup',
            function onMouseUp(event) {
                if (input.fTouch) return;
                if (!event.button) {
                    input.processEvent(element, Input.ACTION.RELEASE, event);
                }
            }
        );

        element.addEventListener(
            'mouseout',
            function onMouseOut(event) {
                if (input.fTouch) return;
                if (input.xStart < 0) {
                    input.processEvent(element, Input.ACTION.MOVE, event);
                } else {
                    input.processEvent(element, Input.ACTION.RELEASE, event);
                }
            }
        );
    }

    /**
     * captureTouch(element)
     *
     * @this {Input}
     * @param {HTMLImageElement} element
     */
    captureTouch(element)
    {
        let input = this;

        /*
         * NOTE: The mouse event handlers below deal only with events where the left button is involved
         * (ie, left button is pressed, down, or released).
         */
        element.addEventListener(
            'touchstart',
            function onTouchStart(event) {
                /*
                 * Under normal circumstances (ie, when fScroll is false), when any touch events arrive,
                 * processEvent() calls preventDefault(), which prevents a variety of potentially annoying
                 * behaviors (ie, zooming, scrolling, fake mouse events, etc).  Under non-normal circumstances,
                 * (ie, when fScroll is true), we set fTouch on receipt of a 'touchstart' event, which will
                 * help our mouse event handlers avoid any redundant actions due to fake mouse events.
                 */
                if (input.fScroll) input.fTouch = true;
                input.processEvent(element, Input.ACTION.PRESS, event);
            }
        );

        element.addEventListener(
            'touchmove',
            function onTouchMove(event) {
                input.processEvent(element, Input.ACTION.MOVE, event);
            }
        );

        element.addEventListener(
            'touchend',
            function onTouchEnd(event) {
                input.processEvent(element, Input.ACTION.RELEASE, event);
            }
        );
    }

    /**
     * onKeyActive(ch)
     *
     * @this {Input}
     * @param {string} ch
     * @returns {boolean} (true if processed, false if not)
     */
    onKeyActive(ch)
    {
        for (let row = 0; row < this.map.length; row++) {
            let rowMap = this.map[row];
            for (let col = 0; col < rowMap.length; col++) {
                let aParts = rowMap[col].split('|');
                if (aParts.indexOf(ch) >= 0) {
                    if (this.keyState) {
                        if (this.keysPressed.length < 16) {
                            this.keysPressed.push(ch);
                        }
                    } else {
                        this.keyState = 1;
                        this.setPosition(col, row);
                        this.advanceKeyState();
                    }
                    return true;
                }
            }
        }
        this.printf("unrecognized key '%s' (0x%02x)\n", ch, ch.charCodeAt(0));
        return false;
    }

    /**
     * onKeyTimer()
     *
     * @this {Input}
     */
    onKeyTimer()
    {

        if (this.keyState == 1) {
            this.keyState++;
            this.setPosition(-1, -1);
            this.advanceKeyState();
        } else {
            this.keyState = 0;
            if (this.keysPressed.length) {
                this.onKeyActive(this.keysPressed.shift());
            }
        }
    }

    /**
     * processEvent(element, action, event)
     *
     * @this {Input}
     * @param {HTMLImageElement} element
     * @param {number} action
     * @param {Event|MouseEvent|TouchEvent} [event] (eg, the object from a 'touch' or 'mouse' event)
     */
    processEvent(element, action, event)
    {
        let col = -1, row = -1;
        let fMultiTouch = false;
        let x, y, xInput, yInput, fButton, fInput, fPower;

        if (action < Input.ACTION.RELEASE) {

            /**
             * @name Event
             * @property {Array} targetTouches
             */
            event = event || window.event;

            if (!event.targetTouches || !event.targetTouches.length) {
                x = event.pageX;
                y = event.pageY;
            } else {
                x = event.targetTouches[0].pageX;
                y = event.targetTouches[0].pageY;
                fMultiTouch = (event.targetTouches.length > 1);
            }

            /*
             * Touch coordinates (that is, the pageX and pageY properties) are relative to the page, so to make
             * them relative to the element, we must subtract the element's left and top positions.  This Apple web page:
             *
             *      https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/AddingMouseandTouchControlstoCanvas/AddingMouseandTouchControlstoCanvas.html
             *
             * makes it sound simple, but it turns out we have to walk the element's entire "parentage" of DOM elements
             * to get the exact offsets.
             */
            let xOffset = 0;
            let yOffset = 0;
            let elementNext = element;
            do {
                if (!isNaN(elementNext.offsetLeft)) {
                    xOffset += elementNext.offsetLeft;
                    yOffset += elementNext.offsetTop;
                }
            } while ((elementNext = elementNext.offsetParent));

            /*
             * Due to the responsive nature of our pages, the displayed size of the surface image may be smaller than
             * the original size, and the coordinates we receive from events are based on the currently displayed size.
             */
            x = ((x - xOffset) * (this.cxSurface / element.offsetWidth))|0;
            y = ((y - yOffset) * (this.cySurface / element.offsetHeight))|0;

            xInput = x - this.xInput;
            yInput = y - this.yInput;

            /*
             * fInput is set if the event occurred somewhere within the input region (ie, the calculator keypad),
             * either on a button or between buttons, whereas fButton is set if the event occurred squarely (rectangularly?)
             * on a button.  fPower deals separately with the power button; it is set if the event occurred on the
             * power button.
             */
            fInput = fButton = false;
            fPower = (x >= this.xPower && x < this.xPower + this.cxPower && y >= this.yPower && y < this.yPower + this.cyPower);

            /*
             * I use the top of the input region, less some gap, to calculate a dividing line, above which
             * default actions should be allowed, and below which they should not.  Ditto for any event inside
             * the power button.
             */
            if (xInput >= 0 && xInput < this.cxInput && yInput + this.cyGap >= 0 || fPower) {
                /*
                 * If we allow touch events to be processed, they will generate mouse events as well, causing
                 * confusion and delays.  We can sidestep that problem by preventing default actions on any event
                 * that occurs within the input region.  One downside is that you can no longer scroll or zoom the
                 * image using touch, but that may be just as well, because you probably don't want sloppy touches
                 * moving your display around (or worse, a rapid double-tap zooming the display).  I do try to
                 * make one small concession for two-finger zoom operations (see fMultiTouch), but that's a bit
                 * fiddly, because it depends on both fingers hitting the surface at the same instant.
                 */
                if (!fMultiTouch && !this.fScroll) event.preventDefault();

                if (xInput >= 0 && xInput < this.cxInput && yInput >= 0 && yInput < this.cyInput) {
                    fInput = true;
                    /*
                     * The width and height of each column and row could be determined by computing cxGap + cxButton
                     * and cyGap + cyButton, respectively, but those gap and button sizes are merely estimates, and should
                     * only be used to help with the final button coordinate checks farther down.
                     */
                    let cxCol = (this.cxInput / this.nCols) | 0;
                    let cyCol = (this.cyInput / this.nRows) | 0;
                    let colInput = (xInput / cxCol) | 0;
                    let rowInput = (yInput / cyCol) | 0;

                    /*
                     * If the grid is hexagonal (aka "Lite-Brite" mode), then the cells of even-numbered rows are
                     * offset horizontally by 1/2 cell.  In addition, the last cell in those rows is unused, so if
                     * after compensating by 1/2 cell, the target column is the last cell, we set xInput to -1,
                     * effectively ignoring input on that cell.
                     */
                    if (this.fHexagonal && !(rowInput & 0x1)) {
                        xInput -= (cxCol >> 1);
                        colInput = (xInput / cxCol) | 0;
                        if (colInput == this.nCols - 1) xInput = -1;
                    }

                    /*
                     * (xCol,yCol) will be the top left corner of the button closest to the point of input.  However, that's
                     * based on our gap estimate.  If things seem "too tight", shrink the gap estimates, which will automatically
                     * increase the button size estimates.
                     */
                    let xCol = colInput * cxCol + (this.cxGap >> 1);
                    let yCol = rowInput * cyCol + (this.cyGap >> 1);

                    xInput -= xCol;
                    yInput -= yCol;
                    if (xInput >= 0 && xInput < this.cxButton && yInput >= 0 && yInput < this.cyButton) {
                        col = colInput;
                        row = rowInput;
                        fButton = true;
                    }
                }
            }
        }

        if (fMultiTouch) return;

        if (action == Input.ACTION.PRESS) {
            /*
             * Record the position of the event, transitioning xStart and yStart to non-negative values.
             */
            this.xStart = x;
            this.yStart = y;
            if (fInput) {
                /*
                 * The event occurred in the input region, so we call setPosition() regardless of whether
                 * it hit or missed a button.
                 */
                this.setPosition(col, row);
                /*
                 * On the other hand, if it DID hit a button, then we arm the auto-release timer, to ensure
                 * a minimum amount of time (ie, BUTTON_DELAY).
                 */
                if (fButton && this.buttonDelay) {
                    this.time.setTimer(this.timerInputRelease, this.buttonDelay, true);
                }
            } else if (fPower && this.onPower) {
                this.onPower();
            }
        }
        else if (action == Input.ACTION.MOVE) {
            if (this.xStart >= 0 && this.yStart >= 0 && this.fDrag) {
                this.setPosition(col, row);
            }
            else if (this.onHover) {
                this.onHover(col, row);
            }
        }
        else if (action == Input.ACTION.RELEASE) {
            /*
             * Don't immediately signal the release if the release timer is active (let the timer take care of it).
             */
            if (!this.buttonDelay || !this.time.isTimerSet(this.timerInputRelease)) {
                this.setPosition(-1, -1);
            }
            this.xStart = this.yStart = -1;
        }
        else {
            this.println("unrecognized action: " + action);
        }
    }

    /**
     * setPosition(col, row)
     *
     * @this {Input}
     * @param {number} col
     * @param {number} row
     */
    setPosition(col, row)
    {
        if (col != this.col || row != this.row) {
            this.col = col;
            this.row = row;
            if (this.onInput) this.onInput(col, row);
        }
    }
}

Input.ACTION = {
    PRESS:      1,              // eg, an action triggered by a 'mousedown' or 'touchstart' event
    MOVE:       2,              // eg, an action triggered by a 'mousemove' or 'touchmove' event
    RELEASE:    3               // eg, an action triggered by a 'mouseup' (or 'mouseout') or 'touchend' event
};

Input.BINDING = {
    POWER:      "power",
    RESET:      "reset",
    SURFACE:    "surface"
};

Input.KEYCODE = {               // keyCode from keydown/keyup events
    0x08:       "\b"            // backspace
};

Input.BUTTON_DELAY = 50;        // minimum number of milliseconds to ensure between button presses and releases

/**
 * @copyright https://www.pcjs.org/modules/devices/led.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ class: string, bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined), type: number, width: (number|undefined), height: (number|undefined), cols: (number|undefined), colsExtra: (number|undefined), rows: (number|undefined), rowsExtra: (number|undefined), color: (string|undefined), backgroundColor: (string|undefined), fixed: (boolean|undefined), hexagonal: (boolean|undefined), highlight: (boolean|undefined), persistent: (boolean|undefined) }} */
var LEDConfig;

/**
 * The ultimate goal is to provide support for a variety of LED types, such as:
 *
 * 1) LED Light (single light)
 * 2) LED Digit (7-segment digit)
 *
 * The initial goal is to manage a 12-element array of 7-segment LED digits for the TI-57.
 *
 * We create a "view" canvas element inside the specified "container" element, along with a "grid" canvas
 * where all the real drawing occurs; drawView() then renders the "grid" canvas onto the "view" canvas.
 *
 * Internally, our LED digits have a width and height of 96 and 128.  Those are "grid" dimensions which
 * cannot be changed, because our table of drawing coordinates in LED.SEGMENTS are hard-coded for those
 * dimensions.  The cell width and height that are specified as part of the LEDConfig are "view" dimensions,
 * which usually match the grid dimensions, but you're welcome to scale them up or down; the browser's
 * drawImage() function takes care of that.
 *
 * There is a low-level function, drawGridSegment(), for drawing specific LED segments of specific digits;
 * generally, you start with clearGrid(), draw all the segments for a given update, and then call drawView()
 * to make them visible.
 *
 * However, our Chip devices operate at a higher level.  They use setLEDState() to modify the state,
 * character, etc, that each of the LED cells should display, which updates our internal LED buffer.  Then
 * at whatever display refresh rate is set (typically 60Hz), drawBuffer() is called to see if the buffer
 * contents have been modified since the last refresh, and if so, it converts the contents of the buffer to
 * a string and calls drawString().
 *
 * This buffering strategy, combined with the buffer "tickled" flag (see below), not only makes life
 * simple for the Chip device, but also simulates how the display goes blank for short periods of time while
 * the Chip is busy performing calculations.
 *
 * @class {LED}
 * @unrestricted
 * @property {LEDConfig} config
 * @property {number} type (one of the LED.TYPE values)
 * @property {number} width (default is 96 for LED.TYPE.DIGIT, 32 otherwise; see LED.SIZES)
 * @property {number} height (default is 128 for LED.TYPE.DIGIT, 32 otherwise; see LED.SIZES)
 * @property {number} cols (default is 1)
 * @property {number} rows (default is 1)
 * @property {number} colsView (default is cols)
 * @property {number} rowsView (default is rows)
 * @property {string} color (default is none; ie, transparent foreground)
 * @property {string} colorBackground (default is none; ie, transparent background)
 * @property {boolean} fFixed (default is false, meaning the view may fill the container to its maximum size)
 * @property {boolean} fHexagonal (default is false)
 * @property {boolean} fHighlight (default is true)
 * @property {boolean} fPersistent (default is false for LED.TYPE.DIGIT, meaning the view will be blanked if not refreshed)
 * @property {number} widthView (computed)
 * @property {number} heightView (computed)
 * @property {number} widthGrid (computed)
 * @property {number} heightGrid (computed)
 * @property {HTMLCanvasElement} canvasView
 * @property {CanvasRenderingContext2D} contextView
 * @property {HTMLCanvasElement} canvasGrid
 * @property {CanvasRenderingContext2D} contextGrid
 * @property {{ container: Element|undefined }} bindings
 * @property {Array.<string|number|null>} buffer
 * @property {Array.<string|number>|null} bufferClone
 * @property {boolean} fBufferModified
 * @property {boolean} fBufferTickled
 */
class LED extends Device {
    /**
     * LED(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "display": {
     *        "class": "LED",
     *        "type": 3,
     *        "cols": 12,
     *        "rows": 1,
     *        "color": "red",
     *        "bindings": {
     *          "container": "displayTI57"
     *        }
     *      }
     *
     * @this {LED}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {LEDConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        let container = this.bindings[LED.BINDING.CONTAINER];
        if (!container) {
            let sError = "LED binding for '" + LED.BINDING.CONTAINER + "' missing: '" + this.config.bindings[LED.BINDING.CONTAINER] + "'";
            throw new Error(sError);
        }

        let canvasView = /** @type {HTMLCanvasElement} */ (document.createElement("canvas"));
        if (!canvasView || !canvasView.getContext) {
            let sError = "LED device requires HTML5 canvas support";
            container.innerHTML = sError;
            throw new Error(sError);
        }

        this.container = container;
        this.canvasView = canvasView;

        this.type = this.getBounded(this.getDefaultNumber('type', LED.TYPE.ROUND), LED.TYPE.SMALL, LED.TYPE.DIGIT);
        this.widthCell = LED.SIZES[this.type][0];
        this.heightCell = LED.SIZES[this.type][1];
        this.width = this.getDefaultNumber('width', this.widthCell);
        this.height = this.getDefaultNumber('height', this.heightCell);
        this.colsView = this.getDefaultNumber('cols',  1);
        this.cols = this.colsView + this.getDefaultNumber('colsExtra', 0);
        this.rowsView = this.getDefaultNumber('rows',  1);
        this.rows = this.rowsView + this.getDefaultNumber('rowsExtra', 0);
        this.widthView = this.width * this.colsView;
        this.heightView = this.height * this.rowsView;

        this.colorTransparent = this.getRGBAColor("black", 0);
        this.colorOn = this.getRGBColor(this.config['color']) || this.colorTransparent;
        this.colorOff = this.getRGBAColor(this.colorOn, 1.0, 0.25);
        this.colorHighlight = this.getRGBAColor(this.colorOn, 1.0, 2.0);
        this.colorBackground = this.getRGBColor(this.config['backgroundColor']);

        /*
         * We generally want our view canvas to be "responsive", not "fixed" (ie, to automatically resize
         * with changes to the overall window size), so we apply the following style attributes (formerly
         * applied with the "pcjs-canvas" style in /modules/shared/templates/components.css):
         *
         *      width: 100%;
         *      height: auto;
         *
         * But, if you really don't want that feature, then set the LED config's "fixed" property to true.
         */
        this.fFixed = this.getDefaultBoolean('fixed', false);
        if (!this.fFixed) {
            canvasView.style.width = "100%";
            canvasView.style.height = "auto";
        }

        /*
         * Hexagonal (aka "Lite-Brite" mode) and highlighting options
         */
        this.fHexagonal = this.getDefaultBoolean('hexagonal', false);
        this.fHighlight = this.getDefaultBoolean('highlight', true);

        /*
         * Persistent LEDS are the default, except for LED.TYPE.DIGIT, which is used with calculator displays
         * whose underlying hardware must constantly "refresh" the LEDs to prevent them from going dark.
         */
        this.fPersistent = this.getDefaultBoolean('persistent', (this.type < LED.TYPE.DIGIT));

        canvasView.setAttribute("width", this.widthView.toString());
        canvasView.setAttribute("height", this.heightView.toString());
        canvasView.style.backgroundColor = this.colorTransparent;
        container.appendChild(canvasView);
        this.contextView = /** @type {CanvasRenderingContext2D} */ (canvasView.getContext("2d"));

        /*
         * canvasGrid is where all LED segments are composited; then they're drawn onto canvasView.
         */
        this.canvasGrid = /** @type {HTMLCanvasElement} */ (document.createElement("canvas"));
        if (this.canvasGrid) {
            this.canvasGrid.width = this.widthGrid = this.widthCell * this.colsView;
            this.canvasGrid.height = this.heightGrid = this.heightCell * this.rowsView;
            this.contextGrid = this.canvasGrid.getContext("2d");
        }

        /*
         * Time to allocate our internal LED buffer.  Other devices access the buffer through interfaces
         * like setLEDState() and getLEDState().  The LED buffer contains four per elements per LED cell:
         *
         *      [0]:    state (eg, ON or OFF or a digit)
         *      [1]:    color
         *      [2]:    count(s) (eg, 0 to 8  4-bit counts)
         *      [3]:    flags (eg, PERIOD, MODIFIED, etc)
         *
         * The LED buffer also contains an extra (scratch) row at the end.  This extra row, along with the
         * dynamically allocated "clone" buffer, is used by the LED Controller for direct buffer manipulation;
         * see the low-level getBuffer(), getBufferClone(), and swapBuffers() interfaces.
         */
        this.nBufferInc = 4;
        this.nBufferCells = ((this.rows + 1) * this.cols) * this.nBufferInc;
        this.buffer = new Array(this.nBufferCells);
        this.bufferClone = null;
        this.nBufferIncExtra = (this.colsView < this.cols? (this.cols - this.colsView) * 4 : 0);

        /*
         * fBufferModified is straightforward: set to true by any setLEDState() call that actually
         * changed something in the LED buffer, set to false after every drawBuffer() call, periodic
         * or otherwise.
         *
         * fBufferTickled is a flag which, under normal (idle) circumstances, will constantly be set
         * to true by periodic display operations that call setLEDState(); we clear it after every
         * periodic drawBuffer(), so if the machine fails to execute a setBuffer() in a timely manner,
         * we will see that fBufferTickled hasn't been "tickled", and automatically blank the display.
         *
         * fDisplayOn is a global "on/off" switch for the entire display.
         */
        this.fBufferModified = this.fBufferTickled = false;
        this.msLastDraw = 0;
        this.fDisplayOn = true;

        /*
         * nShiftedLeft is an optimization that tells drawGrid() when it can minimize the number of
         * individual cells to redraw, by shifting the entire grid image leftward and redrawing only
         * the rightmost cells.
         */
        this.nShiftedLeft = 0;

        /*
         * This records the location of the most recent LED buffer location updated via setLEDState(),
         * in case we want to highlight it.
         */
        this.iBufferRecent = -1;

        let led = this;
        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
        if (this.time) {
            this.time.addAnimator(function ledAnimate(t) {
                led.drawBuffer(false, t);
            });
        }
    }

    /**
     * clearBuffer(fDraw)
     *
     * @this {LED}
     * @param {boolean} [fDraw]
     */
    clearBuffer(fDraw)
    {
        this.initBuffer(this.buffer);
        this.fBufferModified = this.fBufferTickled = true;
        if (fDraw) this.drawBuffer(true);
    }

    /**
     * clearGrid()
     *
     * @this {LED}
     */
    clearGrid()
    {
        if (this.colorBackground) {
            this.contextGrid.fillStyle = this.colorBackground;
            this.contextGrid.fillRect(0, 0, this.widthGrid, this.heightGrid);
        } else {
            this.contextGrid.clearRect(0, 0, this.widthGrid, this.heightGrid);
        }
    }

    /**
     * clearGridCell(col, row, xOffset)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {number} xOffset
     */
    clearGridCell(col, row, xOffset)
    {
        let xDst = col * this.widthCell + xOffset;
        let yDst = row * this.heightCell;
        if (this.colorBackground) {
            this.contextGrid.fillStyle = this.colorBackground;
            this.contextGrid.fillRect(xDst, yDst, this.widthCell, this.heightCell);
        } else {
            this.contextGrid.clearRect(xDst, yDst, this.widthCell, this.heightCell);
        }
    }

    /**
     * drawBuffer(fForced, t)
     *
     * This is our periodic (60Hz) redraw function; however, it can also be called synchronously
     * (eg, see clearBuffer()).  The other important periodic side-effect of this function is clearing
     * fBufferTickled, so that if no other setLEDState() calls occur between now and the next drawBuffer(),
     * an automatic clearBuffer() will be triggered.  This simulates the normal blanking of the display
     * whenever the machine performs lengthy calculations, because for an LED display to remain lit,
     * the machine must perform a display operation ("refresh") at least 30-60 times per second.
     *
     * @this {LED}
     * @param {boolean} [fForced] (if not set, this is a normal refresh call)
     * @param {number} [t] (time value, if available, from the requestAnimationFrame() callback)
     */
    drawBuffer(fForced = false, t = 0)
    {
        if (this.fBufferModified || fForced) {
            if (this.type < LED.TYPE.DIGIT) {
                this.drawGrid(fForced);
            } else {
                let s = "";
                for (let i = 0; i < this.buffer.length; i += this.nBufferInc) {
                    s += this.buffer[i] || ' ';
                    if (this.buffer[i+3] & LED.FLAGS.PERIOD) s += '.';
                }
                this.drawString(s);
            }
            this.fBufferModified = false;
            this.iBufferRecent = -1;
        }
        else if (!this.fPersistent && !this.fBufferTickled) {
            if (!t || !this.msLastDraw || (t - this.msLastDraw) >= ((1000 / 60)|0)) {
                this.clearBuffer(true);
            }
        }
        this.fBufferTickled = false;
        if (t) this.msLastDraw = t;
    }

    /**
     * drawGrid(fForced)
     *
     * Used by drawBuffer() for LED.TYPE.ROUND, LED.TYPE.SQUARE, etc.
     *
     * If the buffer was recently shifted left (ie, nShiftedLeft is set), then we take advantage
     * of that knowledge to use drawImage() to shift the entire grid image left, and then redrawing
     * only the rightmost visible column.
     *
     * @this {LED}
     * @param {boolean} [fForced] (if not set, this is a normal refresh call)
     */
    drawGrid(fForced)
    {
        let colRedraw = 0;
        if (!this.fPersistent || fForced) {
            this.clearGrid();
        } else if (this.nShiftedLeft) {
            colRedraw = this.colsView - this.nShiftedLeft;
            let xStart = this.widthCell * this.nShiftedLeft;
            let cxVisible = this.widthCell * colRedraw;
            this.contextGrid.drawImage(this.canvasGrid, xStart, 0, cxVisible, this.heightGrid, 0, 0, cxVisible, this.heightGrid);
            /*
             * At this point, the only grid drawing we might need to do now is the column at colRedraw,
             * but we still loop over the entire buffer to ensure all the cell MODIFIED states are in sync.
             */
        }
        let i = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.colsView; col++) {
                let state = this.buffer[i];
                let color = this.buffer[i+1] || this.colorTransparent;
                let fLeaveModified = false;
                let fModified = !!(this.buffer[i+3] & LED.FLAGS.MODIFIED);
                let fHighlight = (this.fHighlight && i == this.iBufferRecent);
                if (!this.fDisplayOn && state) {
                    state = LED.STATE.OFF;
                    fModified = fLeaveModified = true;
                }
                if (fModified || fHighlight || fForced) {
                    if (col >= colRedraw) {
                        this.drawGridCell(state, color, col, row, fHighlight);
                    }
                    if (fHighlight || fLeaveModified) {
                        this.buffer[i+3] |= LED.FLAGS.MODIFIED;
                    } else {
                        this.buffer[i+3] &= ~LED.FLAGS.MODIFIED;
                    }
                }
                i += this.nBufferInc;
            }
            i += this.nBufferIncExtra;
        }
        this.nShiftedLeft = 0;
        this.drawView();
    }

    /**
     * drawGridCell(state, color, col, row, fHighlight)
     *
     * Used by drawGrid() for LED.TYPE.ROUND, LED.TYPE.SQUARE, etc.
     *
     * @this {LED}
     * @param {string} state (eg, LED.STATE.ON or LED.STATE.OFF)
     * @param {string} [color]
     * @param {number} [col] (default is zero)
     * @param {number} [row] (default is zero)
     * @param {boolean} [fHighlight] (true if the cell should be highlighted; default is false)
     */
    drawGridCell(state, color, col = 0, row = 0, fHighlight = false)
    {
        let xOffset = 0;
        if (this.fHexagonal) {
            if (!(row & 0x1)) {
                xOffset = (this.widthCell >> 1);
                if (col == this.colsView - 1) return;
            }
        }

        let colorOn, colorOff;
        if (!color || color == this.colorOn) {
            colorOn = fHighlight? this.colorHighlight : this.colorOn;
            colorOff = this.colorOff;
        } else {
            colorOn = fHighlight? this.getRGBAColor(color, 1.0, 2.0) : color;
            colorOff = this.getRGBAColor(color, 1.0, 0.25);
        }

        let fTransparent = false;
        let colorCell = (state? colorOn : colorOff);
        if (colorOn == this.colorTransparent) {
            colorCell = this.colorBackground;
            fTransparent = true;
        }

        let xDst = col * this.widthCell + xOffset;
        let yDst = row * this.heightCell;

        /*
         * If this is NOT a persistent LED display, then drawGrid() will have done a preliminary clearGrid(),
         * eliminating the need to clear individual cells.  Whereas if this IS a persistent LED display, then
         * we need to clear cells on an as-drawn basis.  If we don't, there could be residual "bleed over"
         * around the edges of the shape we drew here previously.
         */
        if (this.fPersistent) {
            this.clearGridCell(col, row, xOffset);
        }

        this.contextGrid.fillStyle = colorCell;

        let coords = LED.SHAPES[this.type];
        if (coords.length == 3) {
            this.contextGrid.beginPath();
            this.contextGrid.arc(xDst + coords[0], yDst + coords[1], coords[2], 0, Math.PI * 2);
            if (fTransparent) {
                /*
                 * The following code works as well:
                 *
                 *      this.contextGrid.save();
                 *      this.contextGrid.clip();
                 *      this.contextGrid.clearRect(xDst, yDst, this.widthCell, this.heightCell);
                 *      this.contextGrid.restore();
                 *
                 * but I assume it's not as efficient.
                 */
                this.contextGrid.globalCompositeOperation = "destination-out";
                this.contextGrid.fill();
                this.contextGrid.globalCompositeOperation = "source-over";
            } else {
                this.contextGrid.fill();
            }
        } else {
            this.contextGrid.fillRect(xDst + coords[0], yDst + coords[1], coords[2], coords[3]);
        }
    }

    /**
     * drawGridSegment(seg, col, row)
     *
     * Used by drawSymbol() for LED.TYPE.DIGIT.
     *
     * @this {LED}
     * @param {string} seg (eg, "A")
     * @param {number} [col] (default is zero)
     * @param {number} [row] (default is zero)
     */
    drawGridSegment(seg, col = 0, row = 0)
    {
        let coords = LED.SEGMENTS[seg];
        if (coords) {
            let xDst = col * this.widthCell;
            let yDst = row * this.heightCell;
            this.contextGrid.fillStyle = this.colorOn;
            this.contextGrid.beginPath();
            if (coords.length == 3) {
                this.contextGrid.arc(xDst + coords[0], yDst + coords[1], coords[2], 0, Math.PI * 2);
            } else {
                for (let i = 0; i < coords.length; i += 2) {
                    if (!i) {
                        this.contextGrid.moveTo(xDst + coords[i], yDst + coords[i+1]);
                    } else {
                        this.contextGrid.lineTo(xDst + coords[i], yDst + coords[i+1]);
                    }
                }
            }
            this.contextGrid.closePath();
            this.contextGrid.fill();
        }
    }

    /**
     * drawString(s)
     *
     * Used by drawBuffer() for LED.TYPE.DIGIT.
     *
     * @this {LED}
     * @param {string} s
     */
    drawString(s)
    {
        this.clearGrid();
        for (let i = 0, col = 0, row = 0; i < s.length; i++) {
            let ch = s[i];
            if (ch == '.') {
                if (col) col--;
            }
            this.drawSymbol(ch, col, row);
            if (++col == this.colsView) {
                col = 0;
                if (++row == this.rows) {
                    break;
                }
            }
        }
        this.drawView();
    }

    /**
     * drawSymbol(symbol, col, row)
     *
     * Used by drawString() for LED.TYPE.DIGIT.
     *
     * If the symbol does not exist in LED.SYMBOL_SEGMENTS, then nothing is drawn.
     *
     * @this {LED}
     * @param {string} symbol
     * @param {number} [col] (default is zero)
     * @param {number} [row] (default is zero)
     */
    drawSymbol(symbol, col = 0, row = 0)
    {
        let segments = LED.SYMBOL_SEGMENTS[symbol];
        if (segments) {
            for (let i = 0; i < segments.length; i++) {
                this.drawGridSegment(segments[i], col, row)
            }
        }
    }

    /**
     * drawView()
     *
     * @this {LED}
     */
    drawView()
    {
        /*
         * Setting the 'globalCompositeOperation' property of a 2D context is something you rarely need to do,
         * because the default draw behavior ("source-over") is fine for most cases.  One case where it is NOT
         * fine is when we're using a transparent background color, because it doesn't copy over any transparent
         * pixels, effectively making it impossible to "turn off" any previously drawn LED segments.  To force
         * that behavior, we must select the "copy" behavior.
         *
         * Refer to: https://www.w3.org/TR/2dcontext/#dom-context-2d-globalcompositeoperation
         */
        this.contextView.globalCompositeOperation = (this.colorBackground && this.colorOn != this.colorTransparent)? "source-over" : "copy";
        this.contextView.drawImage(this.canvasGrid, 0, 0, this.widthGrid, this.heightGrid, 0, 0, this.widthView, this.heightView);
    }

    /**
     * enableDisplay(on)
     *
     * @this {LED}
     * @param {boolean} [on]
     */
    enableDisplay(on = true)
    {
        if (this.fDisplayOn != on) {
            this.fDisplayOn = on;
            this.fBufferModified = true;
        }
    }

    /**
     * getBuffer()
     *
     * @this {LED}
     * @returns {Array}
     */
    getBuffer()
    {
        return this.buffer;
    }

    /**
     * getBufferClone()
     *
     * @this {LED}
     * @returns {Array}
     */
    getBufferClone()
    {
        if (!this.bufferClone) {
            this.bufferClone = new Array(this.nBufferCells);
            this.initBuffer(this.bufferClone);
        }
        return this.bufferClone;
    }

    /**
     * getLEDColor(col, row)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @returns {string}
     */
    getLEDColor(col, row)
    {
        let i = (row * this.cols + col) * this.nBufferInc;
        return this.buffer[i+1] || this.colorTransparent;
    }

    /**
     * getLEDColorValues(col, row, rgb)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {Array.<number>} rgb
     * @returns {boolean}
     */
    getLEDColorValues(col, row, rgb)
    {
        let i = (row * this.cols + col) * this.nBufferInc;
        return this.parseRGBValues(this.buffer[i+1] || this.colorTransparent, rgb);
    }

    /**
     * getLEDCounts(col, row, counts)
     *
     * This function returns success (true) ONLY for cells that are not transparent.
     *
     * For a typical "Lite-Brite" grid, transparent cells are considered "empty", so we want to
     * ignore them.
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {Array.<number>} counts
     * @returns {boolean}
     */
    getLEDCounts(col, row, counts)
    {
        let fSuccess = false;
        let i = (row * this.cols + col) * this.nBufferInc;
        if (i <= this.buffer.length - this.nBufferInc && this.buffer[i+1]) {
            fSuccess = true;
            let bits = this.buffer[i+2];
            for (let c = counts.length - 1; c >= 0; c--) {
                counts[c] = bits & 0xf;
                bits >>>= 4;
            }
        }
        return fSuccess;
    }

    /**
     * getLEDCountsPacked(col, row)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @returns {number}
     */
    getLEDCountsPacked(col, row)
    {
        let i = (row * this.cols + col) * this.nBufferInc;
        return (i <= this.buffer.length - this.nBufferInc)? this.buffer[i+2] : 0;
    }

    /**
     * getLEDState(col, row)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @returns {number|undefined}
     */
    getLEDState(col, row)
    {
        let state;
        let i = (row * this.cols + col) * this.nBufferInc;
        if (i <= this.buffer.length - this.nBufferInc) {
            state = this.buffer[i];
        }
        return state;
    }

    /**
     * getDefaultColor()
     *
     * @this {LED}
     * @returns {string}
     */
    getDefaultColor()
    {
        return this.colorOn;
    }

    /**
     * getRGBColor(color, colorDefault)
     *
     * Returns a color string in the "hex" format that fillStyle recognizes (eg, "#rrggbb").
     *
     * The default is optional, allowing an undefined color to remain undefined if we want to use
     * that to signal transparency (as in the case of colorBackground).
     *
     * @this {LED}
     * @param {string|undefined} color
     * @param {string} [colorDefault]
     * @returns {string|undefined}
     */
    getRGBColor(color, colorDefault)
    {
        color = color || colorDefault;
        return color && LED.COLORS[color] || color;
    }

    /**
     * getRGBColorString(rgb)
     *
     * Returns a color string fillStyle recognizes (ie, "#rrggbb", or "rgba(r,g,b,a)" if an alpha value
     * less than 1 is set).
     *
     * TODO: Cache frequently requested colors.
     *
     * @this {LED}
     * @param {Array.<number>} rgb
     * @returns {string}
     */
    getRGBColorString(rgb)
    {
        let s;
        if (rgb.length < 4 || rgb[3] == 1) {
            s = this.sprintf("#%02x%02x%02x", rgb[0], rgb[1], rgb[2]);
        } else {
            s = this.sprintf("rgba(%d,%d,%d,%d)", rgb[0], rgb[1], rgb[2], rgb[3]);
        }
        return s;
    }

    /**
     * getRGBAColor(color, alpha, brightness)
     *
     * Returns a color string in the "rgba" format that fillStyle recognizes (eg, "rgba(255, 255, 255, 0)").
     *
     * I used to use "alpha" to adjust the brightness, but it's safer to use the "brightness" parameter,
     * which simply scales all the RGB values.  That's because if any shapes are redrawn using a fillStyle
     * with alpha < 1.0, the target alpha values will be added instead of replaced, resulting in progressively
     * brighter shapes; probably not what you want.
     *
     * @this {LED}
     * @param {string} color
     * @param {number} [alpha]
     * @param {number} [brightness]
     * @returns {string}
     */
    getRGBAColor(color, alpha = 1.0, brightness = 1.0)
    {
        if (color) {
            let rgb = [];
            color = LED.COLORS[color] || color;
            if (this.parseRGBValues(color, rgb)) {
                color = "rgba(";
                let i;
                for (i = 0; i < 3; i++) {
                    let n = Math.round(rgb[i] * brightness);
                    n = (n < 0? 0 : (n > 255? 255 : n));
                    color += n + ",";
                }
                color += (i < rgb.length? rgb[i] : alpha) + ")";
            }
        }
        return color;
    }

    /**
     * initBuffer(buffer)
     *
     * @this {LED}
     * @param {Array.<number|string|null>} buffer
     */
    initBuffer(buffer)
    {
        for (let i = 0; i < buffer.length; i += this.nBufferInc) {
            this.initCell(buffer, i);
        }
    }

    /**
     * initCell(buffer, iCell)
     *
     * @this {LED}
     * @param {Array.<number|string|null>} buffer
     * @param {number} iCell
     */
    initCell(buffer, iCell)
    {
        if (this.type < LED.TYPE.DIGIT) {
            buffer[iCell] = LED.STATE.OFF;
        } else {
            buffer[iCell] = ' ';
        }
        buffer[iCell+1] = (this.colorOn == this.colorTransparent? null : this.colorOn);
        buffer[iCell+2] = 0;
        buffer[iCell+3] = LED.FLAGS.MODIFIED;
    }

    /**
     * loadState(state)
     *
     * If any saved values don't match (possibly overridden), abandon the given state and return false.
     *
     * @this {LED}
     * @param {Array} state
     * @returns {boolean}
     */
    loadState(state)
    {
        let colorOn = state.shift();
        let colorBackground = state.shift();
        let buffer = state.shift();
        if (colorOn == this.colorOn && colorBackground == this.colorBackground && buffer && buffer.length == this.buffer.length) {
            this.buffer = buffer;
            /*
             * Loop over all the buffer colors to fix a legacy problem (ie, before we started storing null for colorTransparent)
             */
            for (let i = 0; i <= this.buffer.length - this.nBufferInc; i += this.nBufferInc) {
                if (this.buffer[i+1] == this.colorTransparent) this.buffer[i+1] = null;
            }
            this.drawBuffer(true);
            return true;
        }
        return false;
    }

    /**
     * parseRGBValues(color, rgb)
     *
     * @this {LED}
     * @param {string} color
     * @param {Array.<number>} rgb
     * @returns {boolean}
     */
    parseRGBValues(color, rgb)
    {
        let base = 16;
        let match = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        if (!match) {
            base = 10;
            match = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*(\d+|)\)$/i);
        }
        if (match) {
            let i;
            for (i = 1; i < match.length; i++) {
                rgb[i-1] = Number.parseInt(match[i], base);
            }
            rgb.length = i-1;
            return true;
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * @this {LED}
     * @param {Array} state
     */
    saveState(state)
    {
        if (this.buffer) {
            state.push(this.colorOn);
            state.push(this.colorBackground);
            state.push(this.buffer);
        }
    }

    /**
     * setContainerStyle(sAttr, sValue)
     *
     * @this {LED}
     * @param {string} sAttr
     * @param {string} sValue
     */
    setContainerStyle(sAttr, sValue)
    {
        if (this.container) this.container.style[sAttr] = sValue;
    }

    /**
     * setLEDColor(col, row, color)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {string} [color]
     * @returns {boolean|null} (true if this call modified the LED color, false if not, null if error)
     */
    setLEDColor(col, row, color)
    {
        let fModified = null;
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            fModified = false;
            let colorNew = color || this.colorOn;
            if (colorNew == this.colorTransparent) colorNew = null;
            let i = (row * this.cols + col) * this.nBufferInc;
            if (this.buffer[i+1] !== colorNew) {
                this.buffer[i+1] = colorNew;
                if (!colorNew) this.buffer[i] = LED.STATE.OFF;  // transparent LEDs are automatically turned off
                this.buffer[i+3] |= LED.FLAGS.MODIFIED;
                this.fBufferModified = fModified = true;
            }
            this.iBufferRecent = i;
            this.fBufferTickled = true;
        }
        return fModified;
    }

    /**
     * setLEDCounts(col, row, counts)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {Array.<number>} counts
     * @returns {boolean|null} (true if this call modified the LED color, false if not, null if error)
     */
    setLEDCounts(col, row, counts)
    {
        let fModified = null;
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            fModified = false;
            let i = (row * this.cols + col) * this.nBufferInc;
            let bits = 0;
            if (this.buffer[i+1]) {                             // only non-transparent LEDs are allowed to set counters
                for (let c = 0; c < counts.length; c++) {
                    bits = (bits << 4) | (counts[c] & 0xf);
                }
            }
            if (this.buffer[i+2] !== bits) {
                this.buffer[i+2] = bits;
                this.buffer[i+3] |= LED.FLAGS.MODIFIED;
                this.fBufferModified = fModified = true;
            }
            this.iBufferRecent = i;
            this.fBufferTickled = true;
        }
        return fModified;
    }

    /**
     * setLEDCountsPacked(col, row, counts)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {number} counts
     * @returns {boolean|null} (true if this call modified the LED state, false if not, null if error)
     */
    setLEDCountsPacked(col, row, counts)
    {
        let i = (row * this.cols + col) * this.nBufferInc;
        if (i <= this.buffer.length - this.nBufferInc) {
            if (this.buffer[i+2] != counts) {
                this.buffer[i+2] = counts;
                return true;
            }
            return false;
        }
        return null;
    }

    /**
     * setLEDState(col, row, state, flags)
     *
     * For LED.TYPE.ROUND or LED.TYPE.SQUARE, the state parameter should be LED.STATE.OFF or LED.STATE.ON.
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {string|number} state (new state for the specified cell)
     * @param {number} [flags]
     * @returns {boolean} (true if this call modified the LED state, false if not)
     */
    setLEDState(col, row, state, flags = 0)
    {
        let fModified = false;
        let flagsSet = flags & LED.FLAGS.SET;
        let i = (row * this.cols + col) * this.nBufferInc;
        if (i <= this.buffer.length - this.nBufferInc) {
            if (this.buffer[i] !== state || (this.buffer[i+3] & LED.FLAGS.SET) !== flagsSet) {
                this.buffer[i] = state;
                this.buffer[i+3] = (this.buffer[i+3] & ~LED.FLAGS.SET) | flagsSet | LED.FLAGS.MODIFIED;
                this.fBufferModified = fModified = true;
            }
            this.iBufferRecent = i;
            this.fBufferTickled = true;
            this.nShiftedLeft = 0;
        }
        return fModified;
    }

    /**
     * swapBuffers()
     *
     * @this {LED}
     */
    swapBuffers()
    {
        let buffer = this.buffer;
        this.buffer = this.bufferClone;
        this.bufferClone = buffer;
        this.fBufferModified = true;
    }
}

LED.TYPE = {
    SMALL:      0,      // a smaller, more efficient (round) LED for large grids
    ROUND:      1,      // a single (round) LED
    SQUARE:     2,      // a single (square) LED
    DIGIT:      3       // a 7-segment (digit) LED, with optional period as an 8th segment
};

LED.BINDING = {
    CONTAINER:  "container"
};

LED.COLORS = {
    "aliceblue":            "#f0f8ff",
    "antiquewhite":         "#faebd7",
    "aqua":                 "#00ffff",
    "aquamarine":           "#7fffd4",
    "azure":                "#f0ffff",
    "beige":                "#f5f5dc",
    "bisque":               "#ffe4c4",
    "black":                "#000000",
    "blanchedalmond":       "#ffebcd",
    "blue":                 "#0000ff",
    "blueviolet":           "#8a2be2",
    "brown":                "#a52a2a",
    "burlywood":            "#deb887",
    "cadetblue":            "#5f9ea0",
    "chartreuse":           "#7fff00",
    "chocolate":            "#d2691e",
    "coral":                "#ff7f50",
    "cornflowerblue":       "#6495ed",
    "cornsilk":             "#fff8dc",
    "crimson":              "#dc143c",
    "cyan":                 "#00ffff",
    "darkblue":             "#00008b",
    "darkcyan":             "#008b8b",
    "darkgoldenrod":        "#b8860b",
    "darkgray":             "#a9a9a9",
    "darkgreen":            "#006400",
    "darkkhaki":            "#bdb76b",
    "darkmagenta":          "#8b008b",
    "darkolivegreen":       "#556b2f",
    "darkorange":           "#ff8c00",
    "darkorchid":           "#9932cc",
    "darkred":              "#8b0000",
    "darksalmon":           "#e9967a",
    "darkseagreen":         "#8fbc8f",
    "darkslateblue":        "#483d8b",
    "darkslategray":        "#2f4f4f",
    "darkturquoise":        "#00ced1",
    "darkviolet":           "#9400d3",
    "deeppink":             "#ff1493",
    "deepskyblue":          "#00bfff",
    "dimgray":              "#696969",
    "dodgerblue":           "#1e90ff",
    "firebrick":            "#b22222",
    "floralwhite":          "#fffaf0",
    "forestgreen":          "#228b22",
    "fuchsia":              "#ff00ff",
    "gainsboro":            "#dcdcdc",
    "ghostwhite":           "#f8f8ff",
    "gold":                 "#ffd700",
    "goldenrod":            "#daa520",
    "gray":                 "#808080",
    "green":                "#008000",
    "greenyellow":          "#adff2f",
    "honeydew":             "#f0fff0",
    "hotpink":              "#ff69b4",
    "indianred ":           "#cd5c5c",
    "indigo":               "#4b0082",
    "ivory":                "#fffff0",
    "khaki":                "#f0e68c",
    "lavender":             "#e6e6fa",
    "lavenderblush":        "#fff0f5",
    "lawngreen":            "#7cfc00",
    "lemonchiffon":         "#fffacd",
    "lightblue":            "#add8e6",
    "lightcoral":           "#f08080",
    "lightcyan":            "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgrey":            "#d3d3d3",
    "lightgreen":           "#90ee90",
    "lightpink":            "#ffb6c1",
    "lightsalmon":          "#ffa07a",
    "lightseagreen":        "#20b2aa",
    "lightskyblue":         "#87cefa",
    "lightslategray":       "#778899",
    "lightsteelblue":       "#b0c4de",
    "lightyellow":          "#ffffe0",
    "lime":                 "#00ff00",
    "limegreen":            "#32cd32",
    "linen":                "#faf0e6",
    "magenta":              "#ff00ff",
    "maroon":               "#800000",
    "mediumaquamarine":     "#66cdaa",
    "mediumblue":           "#0000cd",
    "mediumorchid":         "#ba55d3",
    "mediumpurple":         "#9370d8",
    "mediumseagreen":       "#3cb371",
    "mediumslateblue":      "#7b68ee",
    "mediumspringgreen":    "#00fa9a",
    "mediumturquoise":      "#48d1cc",
    "mediumvioletred":      "#c71585",
    "midnightblue":         "#191970",
    "mintcream":            "#f5fffa",
    "mistyrose":            "#ffe4e1",
    "moccasin":             "#ffe4b5",
    "navajowhite":          "#ffdead",
    "navy":                 "#000080",
    "oldlace":              "#fdf5e6",
    "olive":                "#808000",
    "olivedrab":            "#6b8e23",
    "orange":               "#ffa500",
    "orangered":            "#ff4500",
    "orchid":               "#da70d6",
    "palegoldenrod":        "#eee8aa",
    "palegreen":            "#98fb98",
    "paleturquoise":        "#afeeee",
    "palevioletred":        "#d87093",
    "papayawhip":           "#ffefd5",
    "peachpuff":            "#ffdab9",
    "peru":                 "#cd853f",
    "pink":                 "#ffc0cb",
    "plum":                 "#dda0dd",
    "powderblue":           "#b0e0e6",
    "purple":               "#800080",
    "rebeccapurple":        "#663399",
    "red":                  "#ff0000",
    "rosybrown":            "#bc8f8f",
    "royalblue":            "#4169e1",
    "saddlebrown":          "#8b4513",
    "salmon":               "#fa8072",
    "sandybrown":           "#f4a460",
    "seagreen":             "#2e8b57",
    "seashell":             "#fff5ee",
    "sienna":               "#a0522d",
    "silver":               "#c0c0c0",
    "skyblue":              "#87ceeb",
    "slateblue":            "#6a5acd",
    "slategray":            "#708090",
    "snow":                 "#fffafa",
    "springgreen":          "#00ff7f",
    "steelblue":            "#4682b4",
    "tan":                  "#d2b48c",
    "teal":                 "#008080",
    "thistle":              "#d8bfd8",
    "tomato":               "#ff6347",
    "turquoise":            "#40e0d0",
    "violet":               "#ee82ee",
    "wheat":                "#f5deb3",
    "white":                "#ffffff",
    "whitesmoke":           "#f5f5f5",
    "yellow":               "#ffff00",
    "yellowgreen":          "#9acd32"
};

LED.STATE = {
    OFF:        0,
    ON:         1
};

/*
 * NOTE: Although technically the MODIFIED flag is an internal flag, it may be set explicitly as well;
 * the ROM device uses the setLEDState() flags parameter to set it, in order to trigger highlighting of
 * the most recently active LED.
 */
LED.FLAGS = {
    NONE:       0x00,
    SET:        0x81,   // bits that may be set using the flags parameter of setLEDState()
    PERIOD:     0x01,   // used with DIGIT-type LED to indicate that the period "segment" should be on, too
    MODIFIED:   0x80,   // cell has been modified since the last time it was drawn
};

LED.SHAPES = {
    [LED.TYPE.SMALL]:   [4, 4, 4],
    [LED.TYPE.ROUND]:   [16, 16, 14],
    [LED.TYPE.SQUARE]:  [2, 2, 28, 28]
};

LED.SIZES = [
    [8,   8],           // LED.TYPE.SMALL
    [32,  32],          // LED.TYPE.ROUND
    [32,  32],          // LED.TYPE.SQUARE
    [96, 128]           // LED.TYPE.DIGIT
];

/*
 * The segments are arranged roughly as follows, in a 96x128 grid:
 *
 *      AAAA
 *     F    B
 *     F    B
 *      GGGG
 *     E    C
 *     E    C
 *      DDDD P
 *
 * The following arrays specify pairs of moveTo()/lineTo() coordinates, used by drawGridSegment().  They all
 * assume the hard-coded width and height in LED.SIZES[LED.TYPE.DIGIT] specified above.  If there is a triplet
 * instead of one or more pairs (eg, the 'P' or period segment), then the coordinates are treated as arc()
 * parameters.
 */
LED.SEGMENTS = {
    'A':        [30,   8,  79,   8,  67,  19,  37,  19],
    'B':        [83,  10,  77,  52,  67,  46,  70,  22],
    'C':        [77,  59,  71, 100,  61,  89,  64,  64],
    'D':        [28,  91,  58,  91,  69, 104,  15, 104],
    'E':        [18,  59,  28,  64,  25,  88,  12, 100],
    'F':        [24,  10,  34,  21,  31,  47,  18,  52],
    'G':        [24,  56,  34,  50,  60,  50,  71,  56,  61,  61,  33,  61],
    'P':        [80, 102,  8]
};

/*
 * Segmented symbols are formed with the following segments.
 */
LED.SYMBOL_SEGMENTS = {
    ' ':        [],
    '0':        ['A','B','C','D','E','F'],
    '1':        ['B','C'],
    '2':        ['A','B','D','E','G'],
    '3':        ['A','B','C','D','G'],
    '4':        ['B','C','F','G'],
    '5':        ['A','C','D','F','G'],
    '6':        ['A','C','D','E','F','G'],
    '7':        ['A','B','C'],
    '8':        ['A','B','C','D','E','F','G'],
    '9':        ['A','B','C','D','F','G'],
    'A':        ['A','B','C','E','F','G'],
    'B':        ['C','D','E','F','G'],      // NOTE: this shape is a lower-case 'b', to make 'B' must be distinguishable from '8'
    'C':        ['A','D','E','F'],
    'D':        ['B','C','D','E','G'],      // NOTE: this shape is a lower-case 'd', to make 'D' must be distinguishable from '0'
    'E':        ['A','D','E','F','G'],
    'F':        ['A','E','F','G'],
    '-':        ['G'],
    '.':        ['P']
};

/**
 * @copyright https://www.pcjs.org/modules/devices/ram.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ addr: number, size: number }} */
var RAMConfig;

/**
 * @class {RAM}
 * @unrestricted
 * @property {RAMConfig} config
 * @property {number} addr
 * @property {number} size
 */
class RAM extends Device {
    /**
     * RAM(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "ram": {
     *        "class": "RAM",
     *        "addr": 8192,
     *        "size": 1024
     *      }
     *
     * @this {RAM}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {RAMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        this.bus = /** @type {Bus} */ (this.findDeviceByClass(Machine.CLASS.BUS));
        this.bus.addBlocks(config['addr'], config['size'], Memory.TYPE.RAM);
    }

    /**
     * loadState(state)
     *
     * If any saved values don't match (presumably overridden), abandon the given state and return false.
     *
     * @this {RAM}
     * @param {Array} state
     * @returns {boolean}
     */
    loadState(state)
    {
        return false;
    }

    /**
     * reset()
     *
     * @this {RAM}
     */
    reset()
    {
    }

    /**
     * saveState(state)
     *
     * @this {RAM}
     * @param {Array} state
     */
    saveState(state)
    {
    }
}

/**
 * @copyright https://www.pcjs.org/modules/devices/rom.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ addr: number, size: number, values: Array.<number>, file: string, reference: string, chipID: string, revision: (number|undefined), colorROM: (string|undefined), backgroundColorROM: (string|undefined) }} */
var ROMConfig;

/**
 * @class {ROM}
 * @unrestricted
 * @property {ROMConfig} config
 */
class ROM extends Memory {
    /**
     * ROM(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "rom": {
     *        "class": "ROM",
     *        "addr": 0,
     *        "size": 2048,
     *        "littleEndian": true,
     *        "file": "ti57le.bin",
     *        "reference": "",
     *        "chipID": "TMC1501NC DI 7741",
     *        "revision": "0",
     *        "bindings": {
     *          "array": "romArrayTI57",
     *          "cellDesc": "romCellTI57"
     *        },
     *        "overrides": ["colorROM","backgroundColorROM"],
     *        "values": [
     *          ...
     *        ]
     *      }
     *
     * @this {ROM}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ROMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        config['type'] = Memory.TYPE.ROM;
        super(idMachine, idDevice, config);

        if (config['revision']) this.status = "revision " + config['revision'] + " " + this.status;

        this.bus = /** @type {Bus} */ (this.findDeviceByClass(Machine.CLASS.BUS));
        this.bus.addBlocks(config['addr'], config['size'], config['type'], this);

        /*
         * If an "array" binding has been supplied, then create an LED array sufficiently large to represent the
         * entire ROM.  If data.length is an odd power-of-two, then we will favor a slightly wider array over a taller
         * one, by virtue of using Math.ceil() instead of Math.floor() for the columns calculation.
         */
        if (Machine.CLASSES[Machine.CLASS.LED] && this.bindings[ROM.BINDING.ARRAY]) {
            let rom = this;
            let LED = Machine.CLASSES[Machine.CLASS.LED];
            let addrLines = Math.log2(this.values.length) / 2;
            this.cols = Math.pow(2, Math.ceil(addrLines));
            this.rows = (this.values.length / this.cols)|0;
            let configLEDs = {
                "class":            "LED",
                "bindings":         {"container": this.getBindingID(ROM.BINDING.ARRAY)},
                "type":             LED.TYPE.ROUND,
                "cols":             this.cols,
                "rows":             this.rows,
                "color":            this.getDefaultString('colorROM', "green"),
                "backgroundColor":  this.getDefaultString('backgroundColorROM', "black"),
                "persistent":       true
            };
            this.ledArray = new LED(idMachine, idDevice + "LEDs", configLEDs);
            this.clearArray();
            let configInput = {
                "class":        "Input",
                "location":     [0, 0, this.ledArray.widthView, this.ledArray.heightView, this.cols, this.rows],
                "bindings":     {"surface": this.getBindingID(ROM.BINDING.ARRAY)}
            };
            this.ledInput = new Input(idMachine, idDevice + "Input", configInput);
            this.sCellDesc = this.getBindingText(ROM.BINDING.CELLDESC);
            this.ledInput.addHover(function onROMHover(col, row) {
                if (rom.cpu) {
                    let sDesc = rom.sCellDesc;
                    if (col >= 0 && row >= 0) {
                        let offset = row * rom.cols + col;

                        let opCode = rom.values[offset];
                        sDesc = rom.cpu.disassemble(opCode, rom.addr + offset);
                    }
                    rom.setBindingText(ROM.BINDING.CELLDESC, sDesc);
                }
            });
        }
    }

    /**
     * clearArray()
     *
     * clearBuffer(true) performs a combination of clearBuffer() and drawBuffer().
     *
     * @this {ROM}
     */
    clearArray()
    {
        if (this.ledArray) this.ledArray.clearBuffer(true);
    }

    /**
     * drawArray()
     *
     * This performs a simple drawBuffer(); intended for synchronous updates (eg, step operations);
     * otherwise, you should allow the LED object's async animation handler take care of drawing updates.
     *
     * @this {ROM}
     */
    drawArray()
    {
        if (this.ledArray) this.ledArray.drawBuffer();
    }

    /**
     * loadState(state)
     *
     * If any saved values don't match (presumably overridden), abandon the given state and return false.
     *
     * @this {ROM}
     * @param {Array} state
     * @returns {boolean}
     */
    loadState(state)
    {
        let length, success = true;
        let buffer = state.shift();
        if (buffer && this.ledArray) {
            length = buffer.length;

            if (this.ledArray.buffer.length == length) {
                this.ledArray.buffer = buffer;
                this.ledArray.drawBuffer(true);
            } else {
                this.printf("inconsistent saved LED state (%d), unable to load\n", length);
                success = false;
            }
        }
        /*
         * Version 1.21 and up also saves the ROM contents, since our "mini-debugger" has been updated
         * with an edit command ("e") to enable ROM patching.  However, we prefer to detect improvements
         * in saved state based on the length of the array, not the version number.
         */
        if (state.length) {
            let data = state.shift();
            let length = data && data.length || -1;
            if (this.values.length == length) {
                this.values = data;
            } else {
                this.printf("inconsistent saved ROM state (%d), unable to load\n", length);
                success = false;
            }
        }
        return success;
    }

    /**
     * readDirect(offset)
     *
     * This provides an alternative to readValue() for those callers who don't want the LED array to see their access.
     *
     * Note that this "Direct" function requires the caller to perform their own address-to-offset calculation, since they
     * are bypassing the Bus device.
     *
     * @this {ROM}
     * @param {number} offset
     * @returns {number|undefined}
     */
    readDirect(offset)
    {
        return this.values[this.offset + offset];
    }

    /**
     * readValue(offset)
     *
     * This overrides the Memory readValue() function so that the LED array, if any, can track ROM accesses.
     *
     * @this {ROM}
     * @param {number} offset
     * @returns {number|undefined}
     */
    readValue(offset)
    {
        if (this.ledArray) {
            let LED = Machine.CLASSES[Machine.CLASS.LED];
            this.ledArray.setLEDState(offset % this.cols, (offset / this.cols)|0, LED.STATE.ON, LED.FLAGS.MODIFIED);
        }
        return this.values[this.offset + offset];
    }

    /**
     * reset()
     *
     * Called by the CPU (eg, TMS1500) onReset() handler.  Originally, there was no need for this
     * handler, until we added the mini-debugger's ability to edit ROM locations via setData().  So this
     * gives the user the ability to revert back to the original ROM if they want to undo any modifications.
     *
     * @this {ROM}
     */
    reset()
    {
        this.values = this.config['values'];
    }

    /**
     * saveState(state)
     *
     * @this {ROM}
     * @param {Array} state
     */
    saveState(state)
    {
        if (this.ledArray) {
            state.push(this.ledArray.buffer);
            state.push(this.values);
        }
    }

    /**
     * setCPU()
     *
     * @this {ROM}
     * @param {*} cpu
     */
    setCPU(cpu)
    {
        this.cpu = cpu;
    }

    /**
     * writeDirect(offset, value)
     *
     * This provides an alternative to writeValue() for callers who need to "patch" the ROM (normally unwritable).
     *
     * Note that this "Direct" function requires the caller to perform their own address-to-offset calculation, since they
     * are bypassing the Bus device.
     *
     * @this {ROM}
     * @param {number} offset
     * @param {number} value
     */
    writeDirect(offset, value)
    {
        this.values[this.offset + offset] = value;
    }
}

ROM.BINDING = {
    ARRAY:      "array",
    CELLDESC:   "cellDesc"
};

/**
 * @copyright https://www.pcjs.org/modules/devices/time.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ id: string, callBack: function(), msAuto: number, nCyclesLeft: number }} */
var Timer;

/** @typedef {{ class: string, bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined), cyclesMinimum: (number|undefined), cyclesMaximum: (number|undefined), cyclesPerSecond: (number|undefined), yieldsPerSecond: (number|undefined), yieldsPerUpdate: (number|undefined), requestAnimationFrame: (boolean|undefined), clockByFrame: (boolean|undefined) }} */
var TimeConfig;

/**
 * @class {Time}
 * @unrestricted
 * @property {TimeConfig} config
 * @property {number} nCyclesMinimum
 * @property {number} nCyclesMaximum
 * @property {number} nCyclesPerSecond
 * @property {number} nYieldsPerSecond
 * @property {number} nYieldsPerUpdate
 * @property {boolean} fClockByFrame
 */
class Time extends Device {
    /**
     * Time(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "clock": {
     *        "class": "Time",
     *        "cyclesPerSecond": 650000,
     *        "clockByFrame": true,
     *        "bindings": {
     *          "run": "runTI57",
     *          "speed": "speedTI57",
     *          "step": "stepTI57"
     *        },
     *        "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate"]
     *      }
     *
     * @this {Time}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {TimeConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        /*
         * NOTE: The default speed of 650,000Hz (0.65Mhz) was a crude approximation based on real world TI-57
         * device timings.  I had originally assumed the speed as 1,600,000Hz (1.6Mhz), based on timing information
         * in TI's patents, but in hindsight, that speed seems rather high for a mid-1970's device, and reality
         * suggests it was much lower.  The TMS-1500 does burn through a lot of cycles (minimum of 128) per instruction,
         * but either that cycle burn was much higher, or the underlying clock speed was much lower.  I assume the latter.
         */
        this.nCyclesMinimum = this.getDefaultNumber('cyclesMinimum', 100000);
        this.nCyclesMaximum = this.getDefaultNumber('cyclesMaximum', 3000000);
        this.nCyclesPerSecond = this.getBounded(this.getDefaultNumber('cyclesPerSecond', 650000), this.nCyclesMinimum, this.nCyclesMaximum);
        this.nYieldsPerSecond = this.getBounded(this.getDefaultNumber('yieldsPerSecond', Time.YIELDS_PER_SECOND), 30, 120);
        this.nYieldsPerUpdate = this.getBounded(this.getDefaultNumber('yieldsPerUpdate', Time.YIELDS_PER_UPDATE), 1, this.nYieldsPerSecond);
        this.fClockByFrame = this.getDefaultBoolean('clockByFrame', this.nCyclesPerSecond <= 120);
        this.fRequestAnimationFrame = this.fClockByFrame || this.getDefaultBoolean('requestAnimationFrame', true);

        this.nBaseMultiplier = this.nCurrentMultiplier = this.nTargetMultiplier = 1;
        this.mhzBase = (this.nCyclesPerSecond / 10000) / 100;
        this.mhzCurrent = this.mhzTarget = this.mhzBase * this.nTargetMultiplier;
        this.nYields = 0;
        this.msYield = Math.round(1000 / this.nYieldsPerSecond);
        this.aAnimators = [];
        this.aClockers = [];
        this.aTimers = [];
        this.aUpdaters = [];
        this.fRunning = this.fYield = this.fThrottling = false;
        this.nStepping = 0;
        this.idRunTimeout = this.idStepTimeout = 0;
        this.onRunTimeout = this.run.bind(this);
        this.onAnimationFrame = this.animate.bind(this);
        this.requestAnimationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.setTimeout).bind(window);

        if (this.fClockByFrame) {
            /*
            * When clocking exclusively by animation frames, setSpeed() calculates how many cycles
            * each animation frame should "deposit" in our cycle bank:
            *
            *      this.nCyclesDepositPerFrame = (nCyclesPerSecond / 60) + 0.00000001;
            *
            * After that amount is added to our "balance" (this.nCyclesDeposited), we make a "withdrawal"
            * whenever the balance is >= 1.0 and call all our clocking functions with the maximum number
            * of cycles we were able to withdraw.
            *
            * setSpeed() also adds a tiny amount of "interest" to each "deposit" (0.00000001); otherwise
            * you can end up in situations where the deposit amount is, say, 0.2499999 instead of 0.25,
            * and four such deposits would still fall short of the 1-cycle threshold.
            */
            this.nCyclesDeposited = this.nCyclesDepositPerFrame = 0;
        }
        else {
            /*
            * When fClockByFrame is true, we rely exclusively on requestAnimationFrame() instead of setTimeout()
            * to drive the clock, which means we automatically yield after every frame, so no yield timer is required.
            */
            let time = this;
            this.timerYield = this.addTimer("timerYield", function onYield() {
                time.onYield();
            }, this.msYield);
        }

        this.resetSpeed();
    }

    /**
     * addAnimator(callBack)
     *
     * Animators are functions that used to be called with YIELDS_PER_SECOND frequency, when animate()
     * was called on every onYield() call, but now we rely on requestAnimationFrame(), so the frequency
     * is browser-dependent (but presumably at least 60Hz).
     *
     * @this {Time}
     * @param {function(number)} callBack
     */
    addAnimator(callBack)
    {
        this.aAnimators.push(callBack);
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Time}
     * @param {string} binding
     * @param {Element} element
     */
    addBinding(binding, element)
    {
        let time = this, elementInput;

        switch(binding) {

        case Time.BINDING.RUN:
            element.onclick = function onClickRun() {
                time.onRun();
            };
            break;

        case Time.BINDING.STEP:
            element.onclick = function onClickStep() {
                time.onStep();
            };
            break;

        case Time.BINDING.THROTTLE:
            elementInput = /** @type {HTMLInputElement} */ (element);
            elementInput.addEventListener("mousedown", function onThrottleStart() {
                time.fThrottling = true;
            });
            elementInput.addEventListener("mouseup", function onThrottleStop() {
                time.setSpeedThrottle();
                time.fThrottling = false;
            });
            elementInput.addEventListener("mousemove", function onThrottleChange() {
                if (time.fThrottling) {
                    time.setSpeedThrottle();
                }
            });
            elementInput.addEventListener("change", function onThrottleChange() {
                time.fThrottling = true;
                time.setSpeedThrottle();
                time.fThrottling = false;
            });
            break;
        }
        super.addBinding(binding, element);
    }

    /**
     * addClocker(callBack)
     *
     * Adds a clocker function that's called from doBurst() to process a specified number of cycles.
     *
     * @this {Time}
     * @param {function(number)} callBack
     */
    addClocker(callBack)
    {
        this.aClockers.push(callBack);
    }

    /**
     * addTimer(id, callBack, msAuto)
     *
     * Devices that want to have timers that fire after some number of milliseconds call addTimer() to create
     * the timer, and then setTimer() when they want to arm it.  Alternatively, they can specify an automatic
     * timeout value (in milliseconds) to have the timer fire automatically at regular intervals.  There is
     * currently no removeTimer() because these are generally used for the entire lifetime of a device.
     *
     * A timer is initially dormant; dormant timers have a cycle count of -1 (although any negative number will
     * suffice) and active timers have a non-negative cycle count.
     *
     * @this {Time}
     * @param {string} id
     * @param {function()} callBack
     * @param {number} [msAuto] (if set, enables automatic setTimer calls)
     * @returns {number} timer index (1-based)
     */
    addTimer(id, callBack, msAuto = -1)
    {
        let nCyclesLeft = -1;
        let iTimer = this.aTimers.length + 1;
        this.aTimers.push({id, callBack, msAuto, nCyclesLeft});
        if (msAuto >= 0) this.setTimer(iTimer, msAuto);
        return iTimer;
    }

    /**
     * addUpdater(callBack)
     *
     * Adds a status update function that's called from updateStatus(), either as the result
     * of periodic status updates from onYield(), single-step updates from step(), or transitional
     * updates from start() and stop().
     *
     * @this {Time}
     * @param {function(boolean)} callBack
     */
    addUpdater(callBack)
    {
        this.aUpdaters.push(callBack);
    }

    /**
     * animate(t)
     *
     * This is the callback function we supply to requestAnimationFrame().  The callback has a single
     * (DOMHighResTimeStamp) argument, which indicates the current time (returned from performance.now())
     * for when requestAnimationFrame() starts to fire callbacks.
     *
     * See: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
     *
     * @this {Time}
     * @param {number} [t]
     */
    animate(t)
    {
        if (this.fClockByFrame) {
            /*
             * Mimic the logic in run()
             */
            if (!this.fRunning) return;
            this.snapStart();
            try {
                this.fYield = false;
                do {
                    /*
                     * Execute the burst and then update all timers.
                     */
                    this.updateTimers(this.endBurst(this.doBurst(this.getCyclesPerFrame())));
                } while (this.fRunning && !this.fYield);
            }
            catch (err) {
                this.println(err.message);
                this.stop();
                return;
            }
            this.snapStop();
        }
        for (let i = 0; i < this.aAnimators.length; i++) {
            this.aAnimators[i](t);
        }
        if (this.fRunning && this.fRequestAnimationFrame) this.requestAnimationFrame(this.onAnimationFrame);
    }

    /**
     * calcCycles()
     *
     * Calculate the maximum number of cycles we should attempt to process before the next yield.
     *
     * @this {Time}
     */
    calcCycles()
    {
        let nMultiplier = this.mhzCurrent / this.mhzBase;
        if (!nMultiplier || nMultiplier > this.nTargetMultiplier) {
            nMultiplier = this.nTargetMultiplier;
        }
        /*
         * nCyclesPerYield is now allowed to be a fractional number, so that for machines configured
         * to run at an extremely slow speed (eg, less than 60Hz), a fractional value here will signal
         * to snapStop() that it should increase msYield to a proportionally higher value.
         */
        this.nCyclesPerYield = (this.nCyclesPerSecond / this.nYieldsPerSecond * nMultiplier);
        this.nCurrentMultiplier = nMultiplier;
    }

    /**
     * calcSpeed(nCycles, msElapsed)
     *
     * @this {Time}
     * @param {number} nCycles
     * @param {number} msElapsed
     */
    calcSpeed(nCycles, msElapsed)
    {
        if (msElapsed) {
            this.mhzCurrent = (nCycles / (msElapsed * 10)) / 100;
        }
    }

    /**
     * doBurst(nCycles)
     *
     * @this {Time}
     * @param {number} nCycles
     * @returns {number} (number of cycles actually executed)
     */
    doBurst(nCycles)
    {
        this.nCyclesBurst = this.nCyclesRemain = nCycles;
        if (!this.aClockers.length) {
            this.nCyclesRemain = 0;
            return this.nCyclesBurst;
        }
        let iClocker = 0;
        while (this.nCyclesRemain > 0) {
            if (iClocker < this.aClockers.length) {
                nCycles = this.aClockers[iClocker++](nCycles) || 1;
            } else {
                iClocker = nCycles = 0;
            }
            this.nCyclesRemain -= nCycles;
        }
        return this.nCyclesBurst - this.nCyclesRemain;
    }

    /**
     * doOutside(fn)
     *
     * Use this function to perform any work outside of normal time (eg, DOM updates),
     * to prevent that work from disrupting our speed calculations.
     *
     * @this {Time}
     * @param {function()} fn (should return true only if the function actually performed any work)
     * @returns {boolean}
     */
    doOutside(fn)
    {
        let msStart = Date.now();
        if (fn()) {
            let msStop = Date.now();
            this.msOutsideThisRun += msStop - msStart;
            return true;
        }
        return false;
    }

    /**
     * endBurst(nCycles)
     *
     * @this {Time}
     * @param {number} [nCycles]
     * @returns {number} (number of cycles executed in burst)
     */
    endBurst(nCycles = this.nCyclesBurst - this.nCyclesRemain)
    {
        if (this.fClockByFrame) {
            this.nCyclesDeposited -= nCycles;
            if (this.nCyclesDeposited < 1) {
                this.onYield();
            }
        }
        this.nCyclesBurst = this.nCyclesRemain = 0;
        this.nCyclesThisRun += nCycles;
        this.nCyclesRun += nCycles;
        if (!this.fRunning) this.nCyclesRun = 0;
        return nCycles;
    }

    /**
     * getCycles(ms)
     *
     * If no time period is specified, this returns the current number of cycles per second.
     *
     * @this {Time}
     * @param {number} ms (default is 1000)
     * @returns {number} number of corresponding cycles
     */
    getCycles(ms = 1000)
    {
        return Math.ceil((this.nCyclesPerSecond * this.nCurrentMultiplier) / 1000 * ms);
    }

    /**
     * getCyclesPerBurst()
     *
     * This tells us how many cycles to execute as a burst.
     *
     * @this {Time}
     * @returns {number} (the maximum number of cycles we should execute in the next burst)
     */
    getCyclesPerBurst()
    {
        let nCycles = this.getCycles(this.msYield);
        for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
            let timer = this.aTimers[iTimer-1];

            if (timer.nCyclesLeft < 0) continue;
            if (nCycles > timer.nCyclesLeft) {
                nCycles = timer.nCyclesLeft;
            }
        }
        return nCycles;
    }

    /**
     * getCyclesPerFrame(nMinCycles)
     *
     * This tells us how many cycles to execute per frame (assuming fClockByFrame).
     *
     * @this {Time}
     * @param {number} [nMinCycles]
     * @returns {number} (the maximum number of cycles we should execute in the next burst)
     */
    getCyclesPerFrame(nMinCycles=0)
    {
        let nCycles;
        if (nMinCycles) {
            nCycles = nMinCycles;
            this.nCyclesDeposited += nMinCycles;
        } else {
            nCycles = this.nCyclesDeposited;
            if (nCycles < 1) {
                nCycles = (this.nCyclesDeposited += this.nCyclesDepositPerFrame);
            }
            nCycles |= 0;
            for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
                let timer = this.aTimers[iTimer-1];

                if (timer.nCyclesLeft < 0) continue;
                if (nCycles > timer.nCyclesLeft) {
                    nCycles = timer.nCyclesLeft;
                }
            }
        }
        return nCycles;
    }

    /**
     * getSpeed(mhz)
     *
     * @this {Time}
     * @param {number} mhz
     * @returns {string} the given speed, as a formatted string
     */
    getSpeed(mhz)
    {
        let s;
        if (mhz >= 1) {
            s = mhz.toFixed(2) + "Mhz";
        } else {
            let hz = Math.round(mhz * 1000000);
            if (hz <= 999) {
                s = hz + "Hz";
            } else {
                s = Math.ceil(hz / 1000) + "Khz";
            }
        }
        return s;
    }

    /**
     * getSpeedCurrent()
     *
     * @this {Time}
     * @returns {string} the current speed, as a formatted string
     */
    getSpeedCurrent()
    {
        return (this.fRunning && this.mhzCurrent)? this.getSpeed(this.mhzCurrent) : "Stopped";
    }

    /**
     * getSpeedTarget()
     *
     * @this {Time}
     * @returns {string} the target speed, as a formatted string
     */
    getSpeedTarget()
    {
        return this.getSpeed(this.mhzTarget);
    }

    /**
     * isRunning()
     *
     * @this {Time}
     * @returns {boolean}
     */
    isRunning()
    {
        return this.fRunning;
    }

    /**
     * isTimerSet(iTimer)
     *
     * NOTE: Even if the timer is armed, we return false if the clock is currently stopped;
     * in that sense, perhaps this function should be named isTimerArmedAndWillItFireOnTime().
     *
     * @this {Time}
     * @param {number} iTimer
     * @returns {boolean}
     */
    isTimerSet(iTimer)
    {
        if (this.fRunning) {
            if (iTimer > 0 && iTimer <= this.aTimers.length) {
                let timer = this.aTimers[iTimer - 1];
                return (timer.nCyclesLeft >= 0);
            }
        }
        return false;
    }

    /**
     * onRun()
     *
     * This handles the "run" button, if any, attached to the Time device.
     *
     * Note that this serves a different purpose than the "power" button that's managed by the Input device,
     * because toggling power also requires resetting the program counter prior to start() OR clearing the display
     * after stop().  See the Chip's onPower() function for details.
     *
     * @this {Time}
     */
    onRun()
    {
        if (this.fRunning) {
            this.stop();
        } else {
            this.start();
        }
    }

    /**
     * onStep(nRepeat)
     *
     * This handles the "step" button, if any, attached to the Time device.
     *
     * @this {Time}
     * @param {number} [nRepeat]
     */
    onStep(nRepeat)
    {
        if (!this.fRunning) {
            if (this.nStepping) {
                this.stop();
            } else {
                this.step(nRepeat);
            }
        } else {
            this.println("already running");
        }
    }

    /**
     * onYield()
     *
     * @this {Time}
     */
    onYield()
    {
        this.fYield = true;
        let nYields = this.nYields;
        let nCyclesPerSecond = this.getCycles();
        if (nCyclesPerSecond >= this.nYieldsPerSecond) {
            this.nYields++;
        } else {
            /*
             * Let's imagine that nCyclesPerSecond has dropped to 4, whereas the usual nYieldsPerSecond is 60;
             * that's means we're yielding at 1/15th the usual rate, so to compensate, we want to bump nYields
             * by 15 instead of 1.
             */
            this.nYields += Math.ceil(this.nYieldsPerSecond / nCyclesPerSecond);
        }
        if (this.nYields >= this.nYieldsPerUpdate && nYields < this.nYieldsPerUpdate) {
            this.updateStatus();
        }
        if (this.nYields >= this.nYieldsPerSecond) {
            this.nYields = 0;
        }
    }

    /**
     * resetSpeed()
     *
     * Resets speed and cycle information as part of any reset() or restore(); this typically occurs during powerUp().
     * It's important that this be called BEFORE the actual restore() call, because restore() may want to call setSpeed(),
     * which in turn assumes that all the cycle counts have been initialized to sensible values.
     *
     * @this {Time}
     */
    resetSpeed()
    {
        this.nCyclesRun = this.nCyclesBurst = this.nCyclesRemain = 0;
        if (!this.setSpeedThrottle()) this.setSpeed(this.nBaseMultiplier);
    }

    /**
     * resetTimers()
     *
     * When the target speed multiplier is altered, it's a good idea to run through all the timers that
     * have a fixed millisecond period and re-arm them, because the timers are using cycle counts that were based
     * on a previous multiplier.
     *
     * @this {Time}
     */
    resetTimers()
    {
        for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
            let timer = this.aTimers[iTimer-1];
            if (timer.msAuto >= 0) this.setTimer(iTimer, timer.msAuto, true);
        }
    }

    /**
     * run()
     *
     * @this {Time}
     */
    run()
    {
        this.idRunTimeout = 0;
        if (!this.fRunning) return;
        this.snapStart();
        try {
            this.fYield = false;
            do {
                /*
                 * Execute the burst and then update all timers.
                 */
                this.updateTimers(this.endBurst(this.doBurst(this.getCyclesPerBurst())));

            } while (this.fRunning && !this.fYield);
        }
        catch(err) {
            this.println(err.message);
            this.stop();
            return;
        }
        if (this.fRunning) {

            this.idRunTimeout = setTimeout(this.onRunTimeout, this.snapStop());
            if (!this.fRequestAnimationFrame) this.animate();
        }
    }

    /**
     * setSpeedThrottle()
     *
     * This handles speed adjustments requested by the throttling slider.
     *
     * @this {Time}
     * @returns {boolean} (true if a throttle exists, false if not)
     */
    setSpeedThrottle()
    {
        /*
         * We're not going to assume any direct relationship between the slider's min/max/value
         * and our own nCyclesMinimum/nCyclesMaximum/nCyclesPerSecond.  We're just going to calculate
         * a new target nCyclesPerSecond that is proportional, and then convert that to a speed multiplier.
         */
        let elementInput = this.bindings[Time.BINDING.THROTTLE];
        if (elementInput) {
            let ratio = (elementInput.value - elementInput.min) / (elementInput.max - elementInput.min);
            let nCycles = Math.floor((this.nCyclesMaximum - this.nCyclesMinimum) * ratio + this.nCyclesMinimum);
            let nMultiplier = nCycles / this.nCyclesPerSecond;

            this.setSpeed(nMultiplier);
            return true;
        }
        return false;
    }

    /**
     * setSpeed(nMultiplier)
     *
     * @desc Whenever the speed is changed, the running cycle count and corresponding start time must be reset,
     * so that the next effective speed calculation obtains sensible results.  In fact, when run() initially calls
     * setSpeed() with no parameters, that's all this function does (it doesn't change the current speed setting).
     *
     * @this {Time}
     * @param {number} [nMultiplier] is the new proposed multiplier (reverts to default if target was too high)
     * @returns {boolean} true if successful, false if not
     */
    setSpeed(nMultiplier)
    {
        let fSuccess = true;
        if (nMultiplier !== undefined) {
            /*
             * If we haven't reached 90% (0.9) of the current target speed, revert to the default multiplier.
             */
            if (!this.fThrottling && this.mhzCurrent > 0 && this.mhzCurrent < this.mhzTarget * 0.9) {
                nMultiplier = this.nBaseMultiplier;
                fSuccess = false;
            }
            this.nTargetMultiplier = nMultiplier;
            let mhzTarget = this.mhzBase * this.nTargetMultiplier;
            if (this.mhzTarget != mhzTarget) {
                this.mhzTarget = mhzTarget;
                this.setBindingText(Time.BINDING.SPEED, this.getSpeedTarget());
            }
            /*
             * After every yield, calcSpeed() will update mhzCurrent, but we also need to be optimistic
             * and set it to the mhzTarget now, so that the next calcCycles() call will make a reasonable
             * initial estimate.
             */
            this.mhzCurrent = this.mhzTarget;
        }
        if (this.fClockByFrame) {
            let nCyclesPerSecond = this.mhzCurrent * 1000000;
            this.nCyclesDepositPerFrame = (nCyclesPerSecond / 60) + 0.00000001;
            this.nCyclesDeposited = 0;
        }
        this.nCyclesRun = 0;
        this.msStartRun = this.msEndRun = 0;
        this.calcCycles();      // calculate a new value for the current cycle multiplier
        this.resetTimers();     // and then update all the fixed-period timers using the new cycle multiplier
        return fSuccess;
    }

    /**
     * setTimer(iTimer, ms, fReset)
     *
     * Using the timer index from a previous addTimer() call, this sets that timer to fire after the
     * specified number of milliseconds.
     *
     * @this {Time}
     * @param {number} iTimer
     * @param {number} ms (converted into a cycle countdown internally)
     * @param {boolean} [fReset] (true if the timer should be reset even if already armed)
     * @returns {number} (number of cycles used to arm timer, or -1 if error)
     */
    setTimer(iTimer, ms, fReset)
    {
        let nCycles = -1;
        if (iTimer > 0 && iTimer <= this.aTimers.length) {
            let timer = this.aTimers[iTimer-1];
            if (fReset || timer.nCyclesLeft < 0) {
                nCycles = this.getCycles(ms);
                /*
                 * If we're currently executing a burst of cycles, the number of cycles it has executed in
                 * that burst so far must NOT be charged against the cycle timeout we're about to set.  The simplest
                 * way to resolve that is to immediately call endBurst() and bias the cycle timeout by the number
                 * of cycles that the burst executed.
                 */
                if (this.fRunning) {
                    nCycles += this.endBurst();
                }
                timer.nCyclesLeft = nCycles;
            }
        }
        return nCycles;
    }

    /**
     * snapStart()
     *
     * @this {Time}
     */
    snapStart()
    {
        this.calcCycles();

        this.nCyclesThisRun = 0;
        this.msOutsideThisRun = 0;
        this.msStartThisRun = Date.now();
        if (!this.msStartRun) this.msStartRun = this.msStartThisRun;

        /*
         * Try to detect situations where the browser may have throttled us, such as when the user switches
         * to a different tab; in those situations, Chrome and Safari may restrict setTimeout() callbacks
         * to roughly one per second.
         *
         * Another scenario: the user resizes the browser window.  setTimeout() callbacks are not throttled,
         * but there can still be enough of a lag between the callbacks that speed will be noticeably
         * erratic if we don't compensate for it here.
         *
         * We can detect throttling/lagging by verifying that msEndRun (which was set at the end of the
         * previous run and includes any requested sleep time) is comparable to the current msStartThisRun;
         * if the delta is significant, we compensate by bumping msStartRun forward by that delta.
         *
         * This shouldn't be triggered when the Debugger stops time, because setSpeed() -- which is called
         * whenever the time starts again -- zeroes msEndRun.
         */
        let msDelta = 0;
        if (this.msEndRun) {
            msDelta = this.msStartThisRun - this.msEndRun;
            if (msDelta > this.msYield) {
                this.msStartRun += msDelta;
                /*
                 * Bumping msStartRun forward should NEVER cause it to exceed msStartThisRun; however, just
                 * in case, I make absolutely sure it cannot happen, since doing so could result in negative
                 * speed calculations.
                 */

                if (this.msStartRun > this.msStartThisRun) {
                    this.msStartRun = this.msStartThisRun;
                }
            }
        }
    }

    /**
     * snapStop()
     *
     * @this {Time}
     * @returns {number}
     */
    snapStop()
    {
        this.msEndRun = Date.now();

        if (this.msOutsideThisRun) {
            this.msStartRun += this.msOutsideThisRun;
            this.msStartThisRun += this.msOutsideThisRun;
        }

        let msYield = this.msYield;
        if (this.nCyclesThisRun) {
            /*
             * Normally, we assume we executed a full quota of work over msYield.  If nCyclesThisRun is correct,
             * then the ratio of nCyclesThisRun/nCyclesPerYield should represent the percentage of work we performed,
             * and so applying that percentage to msYield should give us a better estimate of work vs. time.
             */
            msYield = Math.round(msYield * this.nCyclesThisRun / this.nCyclesPerYield);
        }

        let msElapsedThisRun = this.msEndRun - this.msStartThisRun;
        let msRemainsThisRun = msYield - msElapsedThisRun;

        let nCycles = this.nCyclesRun;
        let msElapsed = this.msEndRun - this.msStartRun;

        if (DEBUG && msRemainsThisRun < 0 && this.nTargetMultiplier > 1) {
            this.println("warning: updates @" + msElapsedThisRun + "ms (prefer " + Math.round(msYield) + "ms)");
        }

        this.calcSpeed(nCycles, msElapsed);

        if (msRemainsThisRun < 0) {
            /*
             * Try "throwing out" the effects of large anomalies, by moving the overall run start time up;
             * ordinarily, this should only happen when the someone is using an external Debugger or some other
             * tool or feature that is interfering with our overall execution.
             */
            if (msRemainsThisRun < -1000) {
                this.msStartRun -= msRemainsThisRun;
            }
            /*
             * If the last burst took MORE time than we allotted (ie, it's taking more than 1 second to simulate
             * nCyclesPerSecond), all we can do is yield for as little time as possible (ie, 0ms) and hope that the
             * simulation is at least usable.
             */
            msRemainsThisRun = 0;
        }
        else if (this.mhzCurrent < this.mhzTarget) {
            msRemainsThisRun = 0;
        }

        this.msEndRun += msRemainsThisRun;

        this.printf(MESSAGES.TIMER, "after running %d cycles, resting for %dms\n", this.nCyclesThisRun, msRemainsThisRun);

        return msRemainsThisRun;
    }

    /**
     * start()
     *
     * @this {Time}
     * @returns {boolean}
     */
    start()
    {
        if (this.fRunning || this.nStepping) {
            return false;
        }

        if (this.idRunTimeout) {
            clearTimeout(this.idRunTimeout);
            this.idRunTimeout = 0;
        }

        this.fRunning = true;
        this.msStartRun = this.msEndRun = 0;
        this.updateStatus(true);

        /*
         * Kickstart both the clockers and requestAnimationFrame; it's a little premature to start
         * animation here, because the first run() should take place before the first animate(), but
         * since clock speed is now decoupled from animation speed, this isn't something we should
         * worry about.
         */
        if (!this.fClockByFrame) {

            this.idRunTimeout = setTimeout(this.onRunTimeout, 0);
        }
        if (this.fRequestAnimationFrame) this.requestAnimationFrame(this.onAnimationFrame);
        return true;
    }

    /**
     * step(nRepeat)
     *
     * @this {Time}
     * @param {number} [nRepeat]
     * @returns {boolean} true if successful, false if already running
     */
    step(nRepeat = 1)
    {
        if (!this.fRunning) {
            if (nRepeat && !this.nStepping) {
                this.nStepping = nRepeat;
            }
            if (this.nStepping) {
                /*
                 * Execute a minimum-cycle burst and then update all timers.
                 */
                this.nStepping--;
                this.updateTimers(this.endBurst(this.doBurst(this.getCyclesPerFrame(1))));
                this.updateStatus();
                if (this.nStepping) {
                    let time = this;
                    this.idStepTimeout = setTimeout(function onStepTimeout() {
                        time.step(0);
                    }, 0);
                    return true;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * stop()
     *
     * @this {Time}
     * @returns {boolean} true if successful, false if already stopped
     */
    stop()
    {
        if (this.nStepping) {
            this.nStepping = 0;
            this.updateStatus(true);
            return true;
        }
        if (this.fRunning) {
            this.fRunning = false;
            this.endBurst();
            this.updateStatus(true);
            return true;
        }
        return false;
    }

    /**
     * updateStatus(fTransition)
     *
     * Used for periodic status updates from onYield(), single-step updates from step(), and transitional
     * updates from start() and stop().
     *
     * @this {Time}
     * @param {boolean} [fTransition]
     */
    updateStatus(fTransition)
    {
        if (fTransition) {
            if (this.fRunning) {
                this.println("starting with " + this.getSpeedTarget() + " target" + (DEBUG? " using " + (this.fClockByFrame? "requestAnimationFrame()" : "setTimeout()") : ""));
                fTransition = false;
            } else {
                this.println("stopping");
            }
        }

        this.setBindingText(Time.BINDING.RUN, this.fRunning? "Halt" : "Run");
        this.setBindingText(Time.BINDING.STEP, this.nStepping? "Stop" : "Step");
        if (!this.fThrottling) {
            this.setBindingText(Time.BINDING.SPEED, this.getSpeedCurrent());
        }

        for (let i = 0; i < this.aUpdaters.length; i++) {
            this.aUpdaters[i](fTransition);
        }
    }

    /**
     * updateTimers(nCycles)
     *
     * Used by run() to reduce all active timer countdown values by the number of cycles just executed;
     * this is the function that actually "fires" any timer(s) whose countdown has reached (or dropped below)
     * zero, invoking their callback function.
     *
     * @this {Time}
     * @param {number} nCycles (number of cycles actually executed)
     */
    updateTimers(nCycles)
    {
        if (nCycles >= 1) {
            for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
                let timer = this.aTimers[iTimer-1];

                if (timer.nCyclesLeft < 0) continue;
                timer.nCyclesLeft -= nCycles;
                if (timer.nCyclesLeft <= 0) {
                    timer.nCyclesLeft = -1; // zero is technically an "active" value, so ensure the timer is dormant now
                    timer.callBack();       // safe to invoke the callback function now
                    if (timer.msAuto >= 0) {
                        this.setTimer(iTimer, timer.msAuto);
                    }
                }
            }
        }
    }
}

Time.BINDING = {
    RUN:        "run",
    SPEED:      "speed",
    STEP:       "step",
    THROTTLE:   "throttle"
};

/*
 * We yield more often now (120 times per second instead of 60), to help ensure that requestAnimationFrame()
 * callbacks can be called as timely as possible.  And we still only want to perform DOM-related status updates
 * no more than twice per second, so the required number of yields before each update has been increased as well.
 */
Time.YIELDS_PER_SECOND = 120;
Time.YIELDS_PER_UPDATE = 60;

/**
 * @copyright https://www.pcjs.org/modules/devices/video.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ screenWidth: number, screenHeight: number, bufferRotate: number, bufferFormat: string, bufferAddr: number, bufferCols: number, bufferRows: number, bufferBits: number, bufferLeft: number, interruptRate: number }} */
var VideoConfig;

/**
 * @class {Video}
 * @unrestricted
 * @property {VideoConfig} config
 */
class Video extends Device {
    /**
     * Video(idMachine, idDevice, config)
     *
     * The Video component can be configured with the following config properties:
     *
     *      screenWidth: width of the screen canvas, in pixels
     *      screenHeight: height of the screen canvas, in pixels
     *      screenColor: background color of the screen canvas (default is black)
     *      screenRotate: the amount of counter-clockwise screen rotation required (eg, -90 or 270)
     *      aspectRatio (eg, 1.33)
     *      bufferAddr: the starting address of the frame buffer (eg, 0x2400)
     *      bufferRAM: true to use existing RAM (default is false)
     *      bufferFormat: if defined, one of the recognized formats in Video.FORMATS (eg, "vt100")
     *      bufferCols: the width of a single frame buffer row, in pixels (eg, 256)
     *      bufferRows: the number of frame buffer rows (eg, 224)
     *      bufferBits: the number of bits per column (default is 1)
     *      bufferLeft: the bit position of the left-most pixel in a byte (default is 0; CGA uses 7)
     *      bufferRotate: the amount of counter-clockwise buffer rotation required (eg, -90 or 270)
     *      interruptRate: normally the same as (or some multiple of) refreshRate (eg, 120)
     *      refreshRate: how many times updateScreen() should be performed per second (eg, 60)
     *
     *  In addition, if a text-only display is being emulated, define the following properties:
     *
     *      fontROM: URL of font ROM
     *      fontColor: default is white
     *      cellWidth: number (eg, 10 for VT100)
     *      cellHeight: number (eg, 10 for VT100)
     *
     * We record all the above values now, but we defer creation of the frame buffer until initBuffers()
     * is called.  At that point, we will also compute the extent of the frame buffer, determine the
     * appropriate "cell" size (ie, the number of pixels that updateScreen() will fetch and process at once),
     * and then allocate our cell cache.
     *
     * Why interruptRate in addition to refreshRate?  A higher interrupt rate is required for Space Invaders,
     * because even though the CRT refreshes at 60Hz, the CRT controller interrupts the CPU *twice* per
     * refresh (once after the top half of the screen has been redrawn, and again after the bottom half has
     * been redrawn), so we need an interrupt rate of 120Hz.  We pass the higher rate on to the CPU, so that
     * it will call updateScreen() more frequently, but we still limit our screen updates to every *other* call.
     *
     * bufferRotate is an alternative to screenRotate; you may set one or the other (but not both) to -90 to
     * enable different approaches to counter-clockwise 90-degree image rotation.  screenRotate uses canvas
     * transformation methods (translate(), rotate(), and scale()), while bufferRotate inverts the dimensions
     * of the off-screen buffer and then relies on setPixel() to "rotate" the data into the proper location.
     *
     * @this {Video}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ROMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        let video = this, sProp, sEvent;
        this.fGecko = this.isUserAgent("Gecko/");

        this.cxScreen = config['screenWidth'];
        this.cyScreen = config['screenHeight'];

        this.addrBuffer = config['bufferAddr'];
        this.fUseRAM = config['bufferRAM'];

        let sFormat = config['bufferFormat'];
        this.nFormat = sFormat && Video.FORMATS[sFormat.toUpperCase()] || Video.FORMAT.UNKNOWN;

        this.nColsBuffer = config['bufferCols'];
        this.nRowsBuffer = config['bufferRows'];

        this.cxCellDefault = this.cxCell = config['cellWidth'] || 1;
        this.cyCellDefault = this.cyCell = config['cellHeight'] || 1;
        this.abFontData = null;
        this.fDotStretcher = false;

        this.nBitsPerPixel = config['bufferBits'] || 1;
        this.iBitFirstPixel = config['bufferLeft'] || 0;

        this.rotateBuffer = config['bufferRotate'];
        if (this.rotateBuffer) {
            this.rotateBuffer = this.rotateBuffer % 360;
            if (this.rotateBuffer > 0) this.rotateBuffer -= 360;
            if (this.rotateBuffer != -90) {
                this.printf("unsupported buffer rotation: %d\n", this.rotateBuffer);
                this.rotateBuffer = 0;
            }
        }

        this.rateInterrupt = config['interruptRate'];
        this.rateRefresh = config['refreshRate'] || 60;

        let canvas = document.createElement("canvas");
        canvas.setAttribute("class", "pcjs-screen");
        canvas.setAttribute("width", config['screenWidth']);
        canvas.setAttribute("height", config['screenHeight']);
        canvas.style.backgroundColor = config['screenColor'];

        let context = canvas.getContext("2d");

        let container = this.bindings[Video.BINDING.CONTAINER];
        if (container) {
            container.appendChild(canvas);
        } else {
            this.printf("unable to find display element: %s\n", Video.BINDING.CONTAINER);
        }

        /*
         * The "contenteditable" attribute on a canvas element NOTICEABLY slows down canvas drawing on
         * Safari as soon as you give the canvas focus (ie, click away from the canvas, and drawing speeds
         * up; click on the canvas, and drawing slows down).  So the "transparent textarea hack" that we
         * once employed as only a work-around for Android devices is now our default.
         *
         *      canvas.setAttribute("contenteditable", "true");
         *
         * HACK: A canvas style of "auto" provides for excellent responsive canvas scaling in EVERY browser
         * except IE9/IE10, so I recalculate the appropriate CSS height every time the parent DIV is resized;
         * IE11 works without this hack, so we take advantage of the fact that IE11 doesn't identify as "MSIE".
         *
         * The other reason it's good to keep this particular hack limited to IE9/IE10 is that most other
         * browsers don't actually support an 'onresize' handler on anything but the window object.
         */
        if (container && this.isUserAgent("MSIE")) {
            container.onresize = function(eParent, eChild, cx, cy) {
                return function onResizeVideo() {
                    eChild.style.height = (((eParent.clientWidth * cy) / cx) | 0) + "px";
                };
            }(container, canvas, config['screenWidth'], config['screenHeight']);
            container.onresize();
        }

        /*
         * The following is a related hack that allows the user to force the screen to use a particular aspect
         * ratio if an 'aspect' attribute or URL parameter is set.  Initially, it's just for testing purposes
         * until we figure out a better UI.  And note that we use our web.onPageEvent() helper function to make
         * sure we don't trample any other 'onresize' handler(s) attached to the window object.
         */
        let aspect = +(config['aspect'] || this.getURLParms()['aspect']);

        /*
         * No 'aspect' parameter yields NaN, which is falsey, and anything else must satisfy my arbitrary
         * constraints of 0.3 <= aspect <= 3.33, to prevent any useless (or worse, browser-blowing) results.
         */
        if (container && aspect && aspect >= 0.3 && aspect <= 3.33) {
            this.onPageEvent('onresize', function(eParent, eChild, aspectRatio) {
                return function onResizeWindow() {
                    /*
                     * Since aspectRatio is the target width/height, we have:
                     *
                     *      eParent.clientWidth / eChild.style.height = aspectRatio
                     *
                     * which means that:
                     *
                     *      eChild.style.height = eParent.clientWidth / aspectRatio
                     *
                     * so for example, if aspectRatio is 16:9, or 1.78, and clientWidth = 640,
                     * then the calculated height should approximately 360.
                     */
                    eChild.style.height = ((eParent.clientWidth / aspectRatio)|0) + "px";
                };
            }(container, canvas, aspect));
            window['onresize']();
        }

        /*
         * HACK: Android-based browsers, like the Silk (Amazon) browser and Chrome for Android, don't honor the
         * "contenteditable" attribute; that is, when the canvas receives focus, they don't activate the on-screen
         * keyboard.  So my fallback is to create a transparent textarea on top of the canvas.
         *
         * The parent DIV must have a style of "position:relative" (alternatively, a class of "pcjs-container"),
         * so that we can position the textarea using absolute coordinates.  Also, we don't want the textarea to be
         * visible, but we must use "opacity:0" instead of "visibility:hidden", because the latter seems to prevent
         * the element from receiving events.  These styling requirements are taken care of in components.css
         * (see references to the "pcjs-video-object" class).
         *
         * UPDATE: Unfortunately, Android keyboards like to compose whole words before transmitting any of the
         * intervening characters; our textarea's keyDown/keyUp event handlers DO receive intervening key events,
         * but their keyCode property is ZERO.  Virtually the only usable key event we receive is the Enter key.
         * Android users will have to use machines that include their own on-screen "soft keyboard", or use an
         * external keyboard.
         *
         * The following attempt to use a password-enabled input field didn't work any better on Android.  You could
         * clearly see the overlaid semi-transparent input field, but none of the input characters were passed along,
         * with the exception of the "Go" (Enter) key.
         *
         *      let input = document.createElement("input");
         *      input.setAttribute("type", "password");
         *      input.setAttribute("style", "position:absolute; left:0; top:0; width:100%; height:100%; opacity:0.5");
         *      container.appendChild(input);
         *
         * See this Chromium issue for more information: https://code.google.com/p/chromium/issues/detail?id=118639
         */
        let textarea;
        if (container) {
            textarea = document.createElement("textarea");
            textarea.setAttribute("class", "pcjs-overlay");
            /*
             * As noted in keyboard.js, the keyboard on an iOS device tends to pop up with the SHIFT key depressed,
             * which is not the initial keyboard state that the Keyboard component expects, so hopefully turning off
             * these "auto" attributes will help.
             */
            if (this.isUserAgent("iOS")) {
                textarea.setAttribute("autocorrect", "off");
                textarea.setAttribute("autocapitalize", "off");
                /*
                * One of the problems on iOS devices is that after a soft-key control is clicked, we need to give
                * focus back to the above textarea, usually by calling cmp.updateFocus(), but in doing so, iOS may
                * also "zoom" the page rather jarringly.  While it's a simple matter to completely disable zooming,
                * by fiddling with the page's viewport, that prevents the user from intentionally zooming.  A bit of
                * Googling reveals that another way to prevent those jarring unintentional zooms is to simply set the
                * font-size of the text control to 16px.  So that's what we do.
                */
                textarea.style.fontSize = "16px";
            }
            container.appendChild(textarea);
        }

        this.canvasScreen = canvas;
        this.contextScreen = context;
        this.textareaScreen = textarea;
        this.inputScreen = textarea || canvas || null;

        /*
         * These variables are here in case we want/need to add support for borders later...
         */
        this.xScreenOffset = this.yScreenOffset = 0;
        this.cxScreenOffset = this.cxScreen;
        this.cyScreenOffset = this.cyScreen;

        this.cxScreenCell = (this.cxScreen / this.nColsBuffer)|0;
        this.cyScreenCell = (this.cyScreen / this.nRowsBuffer)|0;

        /*
         * Now that we've finished using nRowsBuffer to help define the screen size, we add one more
         * row for text modes, to account for the VT100's scroll line buffer (used for smooth scrolling).
         */
        if (this.cyCell > 1) {
            this.nRowsBuffer++;
            this.bScrollOffset = 0;
            this.fSkipSingleCellUpdate = false;
        }

        /*
         * Support for disabling (or, less commonly, enabling) image smoothing, which all browsers
         * seem to support now (well, OK, I still have to test the latest MS Edge browser), despite
         * it still being labelled "experimental technology".  Let's hope the browsers standardize
         * on this.  I see other options emerging, like the CSS property "image-rendering: pixelated"
         * that's apparently been added to Chrome.  Sigh.
         */
        let fSmoothing = config['smoothing'];
        let sSmoothing = this.getURLParms()['smoothing'];
        if (sSmoothing) fSmoothing = (sSmoothing == "true");
        this.fSmoothing = fSmoothing;
        this.sSmoothing = this.findProperty(this.contextScreen, 'imageSmoothingEnabled');

        this.rotateScreen = config['screenRotate'];
        if (this.rotateScreen) {
            this.rotateScreen = this.rotateScreen % 360;
            if (this.rotateScreen > 0) this.rotateScreen -= 360;
            /*
             * TODO: Consider also disallowing any rotateScreen value if bufferRotate was already set; setting
             * both is most likely a mistake, but who knows, maybe someone wants to use both for 180-degree rotation?
             */
            if (this.rotateScreen != -90) {
                this.printf("unsupported screen rotation: %d\n", this.rotateScreen);
                this.rotateScreen = 0;
            } else {
                this.contextScreen.translate(0, this.cyScreen);
                this.contextScreen.rotate((this.rotateScreen * Math.PI)/180);
                this.contextScreen.scale(this.cyScreen/this.cxScreen, this.cxScreen/this.cyScreen);
            }
        }

        /*
         * Here's the gross code to handle full-screen support across all supported browsers.  The lack of standards
         * is exasperating; browsers can't agree on 'Fullscreen' (most common) or 'FullScreen' (least common), and while
         * some browsers honor other browser prefixes, most don't.  Event handlers tend to be more consistent (ie, all
         * lower-case).
         */
        this.container = container;
        if (this.container) {
            sProp = this.findProperty(container, 'requestFullscreen') || this.findProperty(container, 'requestFullScreen');
            if (sProp) {
                this.container.doFullScreen = container[sProp];
                sEvent = this.findProperty(document, 'on', 'fullscreenchange');
                if (sEvent) {
                    var sFullScreen = this.findProperty(document, 'fullscreenElement') || this.findProperty(document, 'fullScreenElement');
                    document.addEventListener(sEvent, function onFullScreenChange() {
                        video.notifyFullScreen(document[sFullScreen] != null);
                    }, false);
                }
                sEvent = this.findProperty(document, 'on', 'fullscreenerror');
                if (sEvent) {
                    document.addEventListener(sEvent, function onFullScreenError() {
                        video.notifyFullScreen();
                    }, false);
                }
            }
        }

        this.sFontROM = config['fontROM'];

        // if (this.sFontROM) {
        //     // TODO
        // }

        this.ledBindings = {};  // TODO

        this.busMemory = /** @type {Bus} */ (this.findDeviceByClass(Machine.CLASS.BUS));
        this.initBuffers();

        this.cpu = /** @type {CPU} */ (this.findDeviceByClass(Machine.CLASS.CPU));

        /*
         * If we have an associated keyboard, then ensure that the keyboard will be notified
         * whenever the canvas gets focus and receives input.
         */

        // this.kbd = /** @type {Keyboard8080} */ (cmp.getMachineComponent("Keyboard"));
        // if (this.kbd) {
        //     for (var s in this.ledBindings) {
        //         this.kbd.setBinding("led", s, this.ledBindings[s]);
        //     }
        //     if (this.canvasScreen) {
        //         this.kbd.setBinding(this.textareaScreen? "textarea" : "canvas", "screen", /** @type {HTMLElement} */ (this.inputScreen));
        //     }
        // }

        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
        this.timerUpdateNext = this.time.addTimer(this.idDevice, function() {
            video.updateScreen();
        });

        this.time.setTimer(this.timerUpdateNext, this.getRefreshTime());
        this.nUpdates = 0;
    }

    /**
     * initBuffers()
     *
     * @this {Video}
     * @return {boolean}
     */
    initBuffers()
    {
        /*
         * Allocate off-screen buffers now
         */
        this.cxBuffer = this.nColsBuffer * this.cxCell;
        this.cyBuffer = this.nRowsBuffer * this.cyCell;

        var cxBuffer = this.cxBuffer;
        var cyBuffer = this.cyBuffer;
        if (this.rotateBuffer) {
            cxBuffer = this.cyBuffer;
            cyBuffer = this.cxBuffer;
        }

        this.sizeBuffer = 0;
        if (!this.fUseRAM) {
            this.sizeBuffer = ((this.cxBuffer * this.nBitsPerPixel) >> 3) * this.cyBuffer;
            if (!this.busMemory.addBlocks(this.addrBuffer, this.sizeBuffer, Memory.TYPE.RAM)) {
                return false;
            }
        }

        /*
         * imageBuffer is only used for graphics modes.  For text modes, we create a canvas
         * for each font and draw characters by drawing from the font canvas to the target canvas.
         */
        if (this.sizeBuffer) {
            this.imageBuffer = this.contextScreen.createImageData(cxBuffer, cyBuffer);
            this.nPixelsPerCell = (16 / this.nBitsPerPixel)|0;
            this.initCellCache(this.sizeBuffer >> 1);
        } else {
            /*
             * We add an extra column per row to store the visible line length at the start of every row.
             */
            this.initCellCache((this.nColsBuffer + 1) * this.nRowsBuffer);
        }

        this.canvasBuffer = document.createElement("canvas");
        this.canvasBuffer.width = cxBuffer;
        this.canvasBuffer.height = cyBuffer;
        this.contextBuffer = this.canvasBuffer.getContext("2d");

        this.aFonts = {};
        this.initColors();

        if (this.nFormat == Video.FORMAT.VT100) {
            /*
             * Beyond fonts, VT100 support requires that we maintain a number of additional properties:
             *
             *      rateMonitor: must be either 50 or 60 (defaults to 60); we don't emulate the monitor refresh rate,
             *      but we do need to keep track of which rate has been selected, because that affects the number of
             *      "fill lines" present at the top of the VT100's frame buffer: 2 lines for 60Hz, 5 lines for 50Hz.
             *
             *      The VT100 July 1982 Technical Manual, p. 4-89, shows the following sample frame buffer layout:
             *
             *                  00  01  02  03  04  05  06  07  08  09  0A  0B  0C  0D  0E  0F
             *                  --------------------------------------------------------------
             *          0x2000: 7F  70  03  7F  F2  D0  7F  70  06  7F  70  0C  7F  70  0F  7F
             *          0x2010: 70  03  ..  ..  ..  ..  ..  ..  ..  ..  ..  ..  ..  ..  ..  ..
             *          ...
             *          0x22D0: 'D' 'A' 'T' 'A' ' ' 'F' 'O' 'R' ' ' 'F' 'I' 'R' 'S' 'T' ' ' 'L'
             *          0x22E0: 'I' 'N' 'E' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' '
             *          ...
             *          0x2320: 7F  F3  23  'D' 'A' 'T' 'A' ' ' 'F' 'O' 'R' ' ' 'S' 'E' 'C' 'O'
             *          0x2330: 'N' 'D' ' ' 'L' 'I' 'N' 'E' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' ' '
             *          ...
             *          0x2BE0: ' ' ' ' 'E' 'N' 'D' ' ' 'O' 'F' ' ' 'L' 'A' 'S' 'T' ' ' 'L' 'I'
             *          0x2BF0: 'N' 'E' 7F  70  06  ..  ..  ..  ..  ..  ..  ..  ..  ..  ..  ..
             *          0x2C00: [AVO SCREEN RAM, IF ANY, BEGINS HERE]
             *
             *      ERRATA: The manual claims that if you change the byte at 0x2002 from 03 to 09, the number of "fill
             *      lines" will change from 2 to 5 (for 50Hz operation), but it shows 06 instead of 0C at location 0x200B;
             *      if you follow the links, it's pretty clear that byte has to be 0C to yield 5 "fill lines".  Since the
             *      address following the terminator at 0x2006 points to itself, it never makes sense for that terminator
             *      to be used EXCEPT at the end of the frame buffer.
             *
             *      As an alternative to tracking the monitor refresh rate, we could hard-code some knowledge about how
             *      the VT100's 8080 code uses memory, and simply ignore lines below address 0x22D0.  But the VT100 Video
             *      Processor makes no such assumption, and it would also break our test code in createFonts(), which
             *      builds a contiguous screen of test data starting at the default frame buffer address (0x2000).
             */
            this.rateMonitor = 60;

            /*
             * The default character-selectable attribute (reverse video vs. underline) is controlled by fUnderline.
             */
            this.fUnderline = false;

            this.abLineBuffer = new Array(this.nColsBuffer);
        }

        /*
         * Our 'smoothing' parameter defaults to null (which we treat the same as undefined), which means that
         * image smoothing will be selectively enabled (ie, true for text modes, false for graphics modes); otherwise,
         * we'll set image smoothing to whatever value was provided for ALL modes -- assuming the browser supports it.
         */
        if (this.sSmoothing) {
            this.contextScreen[this.sSmoothing] = (this.fSmoothing == null? false /* (this.nFormat == Video.FORMAT.VT100? true : false) */ : this.fSmoothing);
        }

        return true;
    }

    /**
     * setBinding(sHTMLType, sBinding, control, sValue)
     *
     * @this {Video}
     * @param {string} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "refresh")
     * @param {HTMLElement} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sHTMLType, sBinding, control, sValue)
    {
        var video = this;

        /*
         * TODO: A more general-purpose binding mechanism would be nice someday....
         */
        if (sHTMLType == "led" || sHTMLType == "rled") {
            this.ledBindings[sBinding] = control;
            return true;
        }

        switch (sBinding) {
        case "fullScreen":
            this.bindings[sBinding] = control;
            if (this.container && this.container.doFullScreen) {
                control.onclick = function onClickFullScreen() {
                    if (DEBUG) video.printf("fullScreen()\n");
                    video.doFullScreen();
                };
            } else {
                if (DEBUG) this.printf("FullScreen API not available\n");
                control.parentNode.removeChild(/** @type {Node} */ (control));
            }
            return true;

        default:
            break;
        }
        return false;
    }

    /**
     * createFonts()
     *
     * @this {Video}
     * @return {boolean}
     */
    createFonts()
    {
        /*
         * We retain abFontData in case we have to rebuild the fonts (eg, when we switch from 80 to 132 columns)
         */
        if (this.abFontData) {
            this.fDotStretcher = (this.nFormat == Video.FORMAT.VT100);
            this.aFonts[Video.VT100.FONT.NORML] = [
                this.createFontVariation(this.cxCell, this.cyCell),
                this.createFontVariation(this.cxCell, this.cyCell, this.fUnderline)
            ];
            this.aFonts[Video.VT100.FONT.DWIDE] = [
                this.createFontVariation(this.cxCell*2, this.cyCell),
                this.createFontVariation(this.cxCell*2, this.cyCell, this.fUnderline)
            ];
            this.aFonts[Video.VT100.FONT.DHIGH] = this.aFonts[Video.VT100.FONT.DHIGH_BOT] = [
                this.createFontVariation(this.cxCell*2, this.cyCell*2),
                this.createFontVariation(this.cxCell*2, this.cyCell*2, this.fUnderline)
            ];
            return true;
        }
        return false;
    }

    /**
     * createFontVariation(cxCell, cyCell, fUnderline)
     *
     * This creates a 16x16 character grid for the requested font variation.  Variations include:
     *
     *      1) no variation (cell size is this.cxCell x this.cyCell)
     *      2) double-wide characters (cell size is this.cxCell*2 x this.cyCell)
     *      3) double-high double-wide characters (cell size is this.cxCell*2 x this.cyCell*2)
     *      4) any of the above with either reverse video or underline enabled (default is neither)
     *
     * @this {Video}
     * @param {number} cxCell is the target width of each character in the grid
     * @param {number} cyCell is the target height of each character in the grid
     * @param {boolean} [fUnderline] (null for unmodified font, false for reverse video, true for underline)
     * @return {Object}
     */
    createFontVariation(cxCell, cyCell, fUnderline)
    {
        /*
         * On a VT100, cxCell,cyCell is initially 10,10, but may change to 9,10 for 132-column mode.
         */



        /*
         * Create a font canvas that is both 16 times the target character width and the target character height,
         * ensuring that it will accommodate 16x16 characters (for a maximum of 256).  Note that the VT100 font ROM
         * defines only 128 characters, so that canvas will contain only 16x8 entries.
         */
        var nFontBytesPerChar = this.cxCellDefault <= 8? 8 : 16;
        var nFontByteOffset = nFontBytesPerChar > 8? 15 : 0;
        var nChars = this.abFontData.length / nFontBytesPerChar;

        /*
         * The absence of a boolean for fUnderline means that both fReverse and fUnderline are "falsey".  The presence
         * of a boolean means that fReverse will be true OR fUnderline will be true, but NOT both.
         */
        var fReverse = (fUnderline === false);

        var font = {cxCell: cxCell, cyCell: cyCell};
        font.canvas = document.createElement("canvas");
        font.canvas.width = cxCell * 16;
        font.canvas.height = cyCell * (nChars / 16);
        font.context = font.canvas.getContext("2d");

        var imageChar = font.context.createImageData(cxCell, cyCell);

        for (var iChar = 0; iChar < nChars; iChar++) {
            for (var y = 0, yDst = y; y < this.cyCell; y++) {
                var offFontData = iChar * nFontBytesPerChar + ((nFontByteOffset + y) & (nFontBytesPerChar - 1));
                var bits = (fUnderline && y == 8? 0xff : this.abFontData[offFontData]);
                for (var nRows = 0; nRows < (cyCell / this.cyCell); nRows++) {
                    var bitPrev = 0;
                    for (var x = 0, xDst = x; x < this.cxCell; x++) {
                        /*
                         * While x goes from 0 to cxCell-1, obviously we will run out of bits after x is 7;
                         * since the final bit must be replicated all the way to the right edge of the cell
                         * (so that line-drawing characters seamlessly connect), we ensure that the effective
                         * shift count remains stuck at 7 once it reaches 7.
                         */
                        var bitReal = bits & (0x80 >> (x > 7? 7 : x));
                        var bit = (this.fDotStretcher && !bitReal && bitPrev)? bitPrev : bitReal;
                        for (var nCols = 0; nCols < (cxCell / this.cxCell); nCols++) {
                            if (fReverse) bit = !bit;
                            this.setPixel(imageChar, xDst, yDst, bit? 1 : 0);
                            xDst++;
                        }
                        bitPrev = bitReal;
                    }
                    yDst++;
                }
            }
            /*
             * (iChar >> 4) performs the integer equivalent of Math.floor(iChar / 16), and (iChar & 0xf) is the equivalent of (iChar % 16).
             */
            font.context.putImageData(imageChar, (iChar & 0xf) * cxCell, (iChar >> 4) * cyCell);
        }
        return font;
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {Video}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        if (!fRepower) {
            if (data) {
                if (!this.restore(data)) return false;
            }
        }
        /*
         * Because the VT100 frame buffer can be located anywhere in RAM (above 0x2000), we must defer this
         * test code until the powerUp() notification handler is called, when all RAM has (hopefully) been allocated.
         *
         * NOTE: The following test screen was useful for early testing, but a *real* VT100 doesn't display a test screen,
         * so this code is no longer enabled by default.  Remove MAXDEBUG if you want to see it again.
         */
        if (MAXDEBUG && this.nFormat == Video.FORMAT.VT100) {
            /*
             * Build a test screen in the VT100 frame buffer; we'll mimic the "SET-UP A" screen, since it uses
             * all the font variations.  The process involves iterating over 0-based row numbers -2 (or -5 if 50Hz
             * operation is selected) through 24, checking aLineData for a matching row number, and converting the
             * corresponding string(s) to appropriate byte values.  Negative row numbers correspond to "fill lines"
             * and do not require a row entry.  If multiple strings are present for a given row, we invert the
             * default character attribute for subsequent strings.  An empty array ends the screen build process.
             */
            var aLineData = {
                 0: [Video.VT100.FONT.DHIGH, 'SET-UP A'],
                 2: [Video.VT100.FONT.DWIDE, 'TO EXIT PRESS "SET-UP"'],
                22: [Video.VT100.FONT.NORML, '        T       T       T       T       T       T       T       T       T'],
                23: [Video.VT100.FONT.NORML, '1234567890', '1234567890', '1234567890', '1234567890', '1234567890', '1234567890', '1234567890', '1234567890'],
                24: []
            };
            var addr = this.addrBuffer;
            var addrNext = -1, font = -1;
            var b, nFill = (this.rateMonitor == 60? 2 : 5);
            for (var iRow = -nFill; iRow < this.nRowsBuffer; iRow++) {
                var lineData = aLineData[iRow];
                if (addrNext >= 0) {
                    var fBreak = false;
                    addrNext = addr + 2;
                    if (!lineData) {
                        if (font == Video.VT100.FONT.DHIGH) {
                            lineData = aLineData[iRow-1];
                            font = Video.VT100.FONT.DHIGH_BOT;
                        }
                    }
                    else {
                        if (lineData.length) {
                            font = lineData[0];
                        } else {
                            addrNext = addr - 1;
                            fBreak = true;
                        }
                    }
                    b = (font & Video.VT100.LINEATTR.FONTMASK) | ((addrNext >> 8) & Video.VT100.LINEATTR.ADDRMASK) | Video.VT100.LINEATTR.ADDRBIAS;
                    this.busMemory.writeData(addr++, b);
                    this.busMemory.writeData(addr++, addrNext & 0xff);
                    if (fBreak) break;
                }
                if (lineData) {
                    var attr = 0;
                    for (var j = 1; j < lineData.length; j++) {
                        var s = lineData[j];
                        for (var k = 0; k < s.length; k++) {
                            this.busMemory.writeData(addr++, s.charCodeAt(k) | attr);
                        }
                        attr ^= 0x80;
                    }
                }
                this.busMemory.writeData(addr++, Video.VT100.LINETERM);
                addrNext = addr;
            }
            /*
             * NOTE: By calling updateVT100() directly, we are bypassing any checks that might block the update.
             */
            this.updateVT100();
        }
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {Video}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown(fSave, fShutdown)
    {
        return !fSave || this.save();
    }

    /**
     * save()
     *
     * This implements save support for the Video component.
     *
     * @this {Video}
     * @return {Object|null}
     */
    save()
    {
        // var state = new State(this);
        // state.set(0, []);
        // return state.data();
    }

    /**
     * restore(data)
     *
     * This implements restore support for the Video component.
     *
     * @this {Video}
     * @param {Object} data
     * @return {boolean} true if restore successful, false if not
     */
    restore(data)
    {
        return true;
    }

    /**
     * updateDimensions(nCols, nRows)
     *
     * Called from the ChipSet component whenever the screen dimensions have been dynamically altered.
     *
     * @this {Video}
     * @param {number} nCols (should be either 80 or 132; 80 is the default)
     * @param {number} nRows (should be either 24 or 14; 24 is the default)
     */
    updateDimensions(nCols, nRows)
    {
        this.printf("updateDimensions(%d,%d)\n", nCols, nRows);
        this.nColsBuffer = nCols;
        /*
         * Even when the number of effective rows is 14 (or 15 counting the scroll line buffer), we want
         * to leave the number of rows at 24 (or 25 counting the scroll line buffer), because the VT100 doesn't
         * actually change character height (only character width).
         *
         *      this.nRowsBuffer = nRows+1; // +1 for scroll line buffer
         */
        this.cxCell = this.cxCellDefault;
        if (nCols > 80) this.cxCell--;      // VT100 font cells are 9x10 instead of 10x10 in 132-column mode
        if (this.initBuffers()) {
            this.createFonts();
        }
    }

    /**
     * updateRate(nRate)
     *
     * Called from the ChipSet component whenever the monitor refresh rate has been dynamically altered.
     *
     * @this {Video}
     * @param {number} nRate (should be either 50 or 60; 60 is the default)
     */
    updateRate(nRate)
    {
        this.printf("updateRate(%d)\n", nRate);
        this.rateMonitor = nRate;
    }

    /**
     * updateScrollOffset(bScroll)
     *
     * Called from the ChipSet component whenever the screen scroll offset has been dynamically altered.
     *
     * @this {Video}
     * @param {number} bScroll
     */
    updateScrollOffset(bScroll)
    {
        this.printf("updateScrollOffset(%d)\n", bScroll);
        if (this.bScrollOffset !== bScroll) {
            this.bScrollOffset = bScroll;
            /*
             * WARNING: If we immediately redraw the screen on the first wrap of the scroll offset back to zero,
             * we end up "slamming" the screen's contents back down again, because it seems that the frame buffer
             * contents haven't actually been scrolled yet.  So we redraw now ONLY if bScroll is non-zero, lest
             * we ruin the smooth-scroll effect.
             *
             * And this change, while necessary, is not sufficient, because another intervening updateScreen()
             * call could still occur before the frame buffer contents are actually scrolled; and ordinarily, if the
             * buffer hasn't changed, updateScreen() would do nothing, but alas, if the cursor happens to get toggled
             * in the interim, updateScreen() will want to update exactly ONE cell.
             *
             * So we deal with that by setting the fSkipSingleCellUpdate flag.  Now of course, there's no guarantee
             * that the next update of only ONE cell will always be a cursor update, but even if it isn't, skipping
             * that update doesn't seem like a huge cause for concern.
             */
            if (bScroll) {
                this.updateScreen(true);
            } else {
                this.fSkipSingleCellUpdate = true;
            }
        }
    }

    /**
     * doFullScreen()
     *
     * @this {Video}
     * @return {boolean} true if request successful, false if not (eg, failed OR not supported)
     */
    doFullScreen()
    {
        var fSuccess = false;
        if (this.container) {
            if (this.container.doFullScreen) {
                /*
                 * Styling the container with a width of "100%" and a height of "auto" works great when the aspect ratio
                 * of our virtual screen is at least roughly equivalent to the physical screen's aspect ratio, but now that
                 * we support virtual VGA screens with an aspect ratio of 1.33, that's very much out of step with modern
                 * wide-screen monitors, which usually have an aspect ratio of 1.6 or greater.
                 *
                 * And unfortunately, none of the browsers I've tested appear to make any attempt to scale our container to
                 * the physical screen's dimensions, so the bottom of our screen gets clipped.  To prevent that, I reduce
                 * the width from 100% to whatever percentage will accommodate the entire height of the virtual screen.
                 *
                 * NOTE: Mozilla recommends both a width and a height of "100%", but all my tests suggest that using "auto"
                 * for height works equally well, so I'm sticking with it, because "auto" is also consistent with how I've
                 * implemented a responsive canvas when the browser window is being resized.
                 */
                var sWidth = "100%";
                var sHeight = "auto";
                if (screen && screen.width && screen.height) {
                    var aspectPhys = screen.width / screen.height;
                    var aspectVirt = this.cxScreen / this.cyScreen;
                    if (aspectPhys > aspectVirt) {
                        sWidth = Math.round(aspectVirt / aspectPhys * 100) + '%';
                    }
                    // TODO: We may need to someday consider the case of a physical screen with an aspect ratio < 1.0....
                }
                if (!this.fGecko) {
                    this.container.style.width = sWidth;
                    this.container.style.height = sHeight;
                } else {
                    /*
                     * Sadly, the above code doesn't work for Firefox, because as http://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
                     * explains:
                     *
                     *      'It's worth noting a key difference here between the Gecko and WebKit implementations at this time:
                     *      Gecko automatically adds CSS rules to the element to stretch it to fill the screen: "width: 100%; height: 100%".
                     *
                     * Which would be OK if Gecko did that BEFORE we're called, but apparently it does that AFTER, effectively
                     * overwriting our careful calculations.  So we style the inner element (canvasScreen) instead, which
                     * requires even more work to ensure that the canvas is properly centered.  FYI, this solution is consistent
                     * with Mozilla's recommendation for working around their automatic CSS rules:
                     *
                     *      '[I]f you're trying to emulate WebKit's behavior on Gecko, you need to place the element you want
                     *      to present inside another element, which you'll make fullscreen instead, and use CSS rules to adjust
                     *      the inner element to match the appearance you want.'
                     */
                    this.canvasScreen.style.width = sWidth;
                    this.canvasScreen.style.width = sWidth;
                    this.canvasScreen.style.display = "block";
                    this.canvasScreen.style.margin = "auto";
                }
                this.container.style.backgroundColor = "black";
                this.container.doFullScreen();
                fSuccess = true;
            }
            this.setFocus();
        }
        return fSuccess;
    }

    /**
     * notifyFullScreen(fFullScreen)
     *
     * @this {Video}
     * @param {boolean} [fFullScreen] (undefined if there was a full-screen error)
     */
    notifyFullScreen(fFullScreen)
    {
        if (!fFullScreen && this.container) {
            if (!this.fGecko) {
                this.container.style.width = this.container.style.height = "";
            } else {
                this.canvasScreen.style.width = this.canvasScreen.style.height = "";
            }
        }
        this.printf("notifyFullScreen(%b)\n", fFullScreen);
    }

    /**
     * setFocus()
     *
     * @this {Video}
     */
    setFocus()
    {
        if (this.inputScreen) this.inputScreen.focus();
    }

    /**
     * getRefreshTime()
     *
     * @this {Video}
     * @return {number} (number of milliseconds per refresh)
     */
    getRefreshTime()
    {
        return 1000 / Math.max(this.rateRefresh, this.rateInterrupt);
    }

    /**
     * initCellCache(nCells)
     *
     * Initializes the contents of our internal cell cache.
     *
     * @this {Video}
     * @param {number} nCells
     */
    initCellCache(nCells)
    {
        this.nCellCache = nCells;
        this.fCellCacheValid = false;
        if (this.aCellCache === undefined || this.aCellCache.length != this.nCellCache) {
            this.aCellCache = new Array(this.nCellCache);
        }
    }

    /**
     * initColors()
     *
     * This creates an array of nColors, with additional OVERLAY_TOTAL colors tacked on to the end of the array.
     *
     * @this {Video}
     */
    initColors()
    {
        var rgbBlack  = [0x00, 0x00, 0x00, 0xff];
        var rgbWhite  = [0xff, 0xff, 0xff, 0xff];
        this.nColors = (1 << this.nBitsPerPixel);
        this.aRGB = new Array(this.nColors + Video.COLORS.OVERLAY_TOTAL);
        this.aRGB[0] = rgbBlack;
        this.aRGB[1] = rgbWhite;
        if (this.nFormat == Video.FORMAT.SI1978) {
            var rgbGreen  = [0x00, 0xff, 0x00, 0xff];
            //noinspection UnnecessaryLocalVariableJS
            var rgbYellow = [0xff, 0xff, 0x00, 0xff];
            this.aRGB[this.nColors + Video.COLORS.OVERLAY_TOP] = rgbYellow;
            this.aRGB[this.nColors + Video.COLORS.OVERLAY_BOTTOM] = rgbGreen;
        }
    }

    /**
     * setPixel(image, x, y, bPixel)
     *
     * @this {Video}
     * @param {Object} image
     * @param {number} x
     * @param {number} y
     * @param {number} bPixel (ie, an index into aRGB)
     */
    setPixel(image, x, y, bPixel)
    {
        var index;
        if (!this.rotateBuffer) {
            index = (x + y * image.width);
        } else {
            index = (image.height - x - 1) * image.width + y;
        }
        if (bPixel && this.nFormat == Video.FORMAT.SI1978) {
            if (x >= 208 && x < 236) {
                bPixel = this.nColors + Video.COLORS.OVERLAY_TOP;
            }
            else if (x >= 28 && x < 72) {
                bPixel = this.nColors + Video.COLORS.OVERLAY_BOTTOM;
            }
        }
        var rgb = this.aRGB[bPixel];
        index *= rgb.length;
        image.data[index] = rgb[0];
        image.data[index+1] = rgb[1];
        image.data[index+2] = rgb[2];
        image.data[index+3] = rgb[3];
    }

    /**
     * updateChar(idFont, col, row, data, context)
     *
     * Updates a particular character cell (row,col) in the associated window.
     *
     * @this {Video}
     * @param {number} idFont
     * @param {number} col
     * @param {number} row
     * @param {number} data
     * @param {Object} [context]
     */
    updateChar(idFont, col, row, data, context)
    {
        var bChar = data & 0x7f;
        var font = this.aFonts[idFont][(data & 0x80)? 1 : 0];
        if (!font) return;

        var xSrc = (bChar & 0xf) * font.cxCell;
        var ySrc = (bChar >> 4) * font.cyCell;

        var xDst, yDst, cxDst, cyDst;

        var cxSrc = font.cxCell;
        var cySrc = font.cyCell;

        if (context) {
            xDst = col * this.cxCell;
            yDst = row * this.cyCell;
            cxDst = this.cxCell;
            cyDst = this.cyCell;
        } else {
            xDst = col * this.cxScreenCell;
            yDst = row * this.cyScreenCell;
            cxDst = this.cxScreenCell;
            cyDst = this.cyScreenCell;
        }

        /*
         * If font.cxCell > this.cxCell, then we assume the caller wants to draw a double-wide character,
         * so we will double xDst and cxDst.
         */
        if (font.cxCell > this.cxCell) {
            xDst *= 2;
            cxDst *= 2;

        }

        /*
         * If font.cyCell > this.cyCell, then we rely on idFont to indicate whether the top half or bottom half
         * of the character should be drawn.
         */
        if (font.cyCell > this.cyCell) {
            if (idFont == Video.VT100.FONT.DHIGH_BOT) ySrc += this.cyCell;
            cySrc = this.cyCell;

        }

        if (context) {
            context.drawImage(font.canvas, xSrc, ySrc, cxSrc, cySrc, xDst, yDst, cxDst, cyDst);
        } else {
            xDst += this.xScreenOffset;
            yDst += this.yScreenOffset;
            this.contextScreen.drawImage(font.canvas, xSrc, ySrc, cxSrc, cySrc, xDst, yDst, cxDst, cyDst);
        }
    }

    /**
     * updateVT100(fForced)
     *
     * @this {Video}
     * @param {boolean} [fForced]
     */
    updateVT100(fForced)
    {
        var addrNext = this.addrBuffer, fontNext = -1;

        var nRows = 0;
        var nFill = (this.rateMonitor == 60? 2 : 5);
        var iCell = 0, cUpdated = 0, iCellUpdated = -1;



        while (nRows < this.nRowsBuffer) {
            /*
             * Populate the line buffer
             */
            var nCols = 0;
            var addr = addrNext;
            var font = fontNext;
            var nColsVisible = this.nColsBuffer;
            if (font != Video.VT100.FONT.NORML) nColsVisible >>= 1;
            while (true) {
                var data = this.busMemory.readData(addr++);
                if ((data & Video.VT100.LINETERM) == Video.VT100.LINETERM) {
                    var b = this.busMemory.readData(addr++);
                    fontNext = b & Video.VT100.LINEATTR.FONTMASK;
                    addrNext = ((b & Video.VT100.LINEATTR.ADDRMASK) << 8) | this.busMemory.readData(addr);
                    addrNext += (b & Video.VT100.LINEATTR.ADDRBIAS)? Video.VT100.ADDRBIAS_LO : Video.VT100.ADDRBIAS_HI;
                    break;
                }
                if (nCols < nColsVisible) {
                    this.abLineBuffer[nCols++] = data;
                } else {
                    break;                          // ideally, we would wait for a LINETERM byte, but it's not safe to loop without limit
                }
            }

            /*
             * Skip the first few "fill lines"
             */
            if (nFill) {
                nFill--;
                continue;
            }

            /*
             * Pad the line buffer as needed
             */
            while (nCols < this.abLineBuffer.length) {
                this.abLineBuffer[nCols++] = 0;     // character code 0 is a empty font character
            }

            /*
             * Display the line buffer; ordinarily, the font number would be valid after processing the "fill lines",
             * but if the buffer isn't initialized yet, those lines might be missing, so the font number might not be set.
             */
            if (font >= 0) {
                /*
                 * Cell cache logic is complicated by the fact that a line may be single-width one frame and double-width
                 * the next.  So we store the visible line length at the start of each row in the cache, which must match if
                 * the cache can be considered valid for the current line.
                 */
                var fLineCacheValid = this.fCellCacheValid && (this.aCellCache[iCell] == nColsVisible);
                this.aCellCache[iCell++] = nColsVisible;
                for (var iCol = 0; iCol < nCols; iCol++) {
                    data = this.abLineBuffer[iCol];
                    if (!fLineCacheValid || data !== this.aCellCache[iCell]) {
                        this.aCellCache[iCellUpdated = iCell] = data;
                        this.updateChar(font, iCol, nRows, data, this.contextBuffer);
                        cUpdated++;
                    }
                    iCell++;
                }
            }
            nRows++;
        }

        this.fCellCacheValid = true;



        if (!fForced && this.fSkipSingleCellUpdate && cUpdated == 1) {
            /*
             * We're going to blow off this update, since it comes on the heels of a smooth-scroll that *may*
             * not be completely finished yet, and at the same time, we're going to zap the only updated cell
             * cache entry, to guarantee that it's redrawn on the next update.
             */

            /*
             * TODO: If I change the RECV rate to 19200 and enable smooth scrolling, I sometimes see a spurious
             * "H" on the bottom line after a long series of "HELLO WORLD!\r\n" tests.  Dumping video memory shows
             * "HELLO WORLD!" on 23 lines and an "H" on the 24th line, so it's really there.  But strangely, if
             * I then press SET-UP two times, the restored screen does NOT have the spurious "H".  So somehow the
             * firmware knows what should and shouldn't be on-screen.
             *
             * Possible VT100 firmware bug?  I'm not sure.  Anyway, this DEBUG-only code is here to help trap
             * that scenario, until I figure it out.
             */
            if (DEBUG && (this.aCellCache[iCellUpdated] & 0x7f) == 0x48) {
                this.printf("spurious 'H' character at offset %d\n", iCellUpdated);
            }
            this.aCellCache[iCellUpdated] = -1;
            cUpdated = 0;
        }
        this.fSkipSingleCellUpdate = false;

        if ((cUpdated || fForced) && this.contextBuffer) {
            /*
             * We must subtract cyCell from cyBuffer to avoid displaying the extra "scroll line" that we normally
             * buffer, in support of smooth scrolling.  Speaking of which, we must also add bScrollOffset to ySrc
             * (well, ySrc is always relative to zero, so no add is actually required).
             */
            this.contextScreen.drawImage(
                this.canvasBuffer,
                0,                                  // xSrc
                this.bScrollOffset,                 // ySrc
                this.cxBuffer,                      // cxSrc
                this.cyBuffer - this.cyCell,        // cySrc
                this.xScreenOffset,                 // xDst
                this.yScreenOffset,                 // yDst
                this.cxScreenOffset,                // cxDst
                this.cyScreenOffset                 // cyDst
            );
        }
    }

    /**
     * updateScreen(fForced)
     *
     * Propagates the video buffer to the cell cache and updates the screen with any changes.  Forced updates
     * are generally internal updates triggered by an I/O operation or other state change, while non-forced updates
     * are the periodic updates coming from the CPU.
     *
     * For every cell in the video buffer, compare it to the cell stored in the cell cache, render if it differs,
     * and then update the cell cache to match.  Since initCellCache() sets every cell in the cell cache to an
     * invalid value, we're assured that the next call to updateScreen() will redraw the entire (visible) video buffer.
     *
     * @this {Video}
     * @param {boolean} [fForced]
     */
    updateScreen(fForced)
    {
        var fUpdate = true;

        if (!fForced) {
            if (this.rateInterrupt) {
                /*
                 * TODO: Incorporate these hard-coded interrupt vector numbers into configuration blocks.
                 */
                if (this.rateInterrupt == 120) {
                    if (!(this.nUpdates & 1)) {
                        /*
                         * On even updates, call cpu.requestINTR(1), and also update our copy of the screen.
                         */
                        this.cpu.requestINTR(1);
                    } else {
                        /*
                         * On odd updates, call cpu.requestINTR(2), but do NOT update our copy of the screen, because
                         * the machine has presumably only updated the top half of the frame buffer at this point; it will
                         * update the bottom half of the frame buffer after acknowledging this interrupt.
                         */
                        this.cpu.requestINTR(2);
                        fUpdate = false;
                    }
                } else {
                    this.cpu.requestINTR(4);
                }
            }

            /*
             * Since this is not a forced update, if our cell cache is valid AND we allocated our own buffer AND the buffer
             * is clean, then there's nothing to do.
             */
            if (fUpdate && this.fCellCacheValid && this.sizeBuffer) {
                if (this.busMemory.cleanBlocks(this.addrBuffer, this.sizeBuffer)) {
                    fUpdate = false;
                }
            }
            this.time.setTimer(this.timerUpdateNext, this.getRefreshTime());
            this.nUpdates++;
        }

        if (!fUpdate) {
            return;
        }

        if (this.cxCell > 1) {
            this.updateScreenText(fForced);
        } else {
            this.updateScreenGraphics(fForced);
        }
    }

    /**
     * updateScreenText(fForced)
     *
     * @this {Video}
     * @param {boolean} [fForced]
     */
    updateScreenText(fForced)
    {
        switch(this.nFormat) {
        case Video.FORMAT.VT100:
            this.updateVT100(fForced);
            break;
        }
    }

    /**
     * updateScreenGraphics(fForced)
     *
     * @this {Video}
     * @param {boolean} [fForced]
     */
    updateScreenGraphics(fForced)
    {
        var addr = this.addrBuffer;
        var addrLimit = addr + this.sizeBuffer;

        var iCell = 0;
        var nPixelShift = 1;

        var xBuffer = 0, yBuffer = 0;
        var xDirty = this.cxBuffer, xMaxDirty = 0, yDirty = this.cyBuffer, yMaxDirty = 0;

        var nShiftInit = 0;
        var nShiftPixel = this.nBitsPerPixel;
        var nMask = (1 << nShiftPixel) - 1;
        if (this.iBitFirstPixel) {
            nShiftPixel = -nShiftPixel;
            nShiftInit = 16 + nShiftPixel;
        }

        while (addr < addrLimit) {
            var data = this.busMemory.readData(addr);

            if (this.fCellCacheValid && data === this.aCellCache[iCell]) {
                xBuffer += this.nPixelsPerCell;
            } else {
                this.aCellCache[iCell] = data;
                var nShift = nShiftInit;
                if (nShift) data = ((data >> 8) | ((data & 0xff) << 8));
                if (xBuffer < xDirty) xDirty = xBuffer;
                var cPixels = this.nPixelsPerCell;
                while (cPixels--) {
                    var bPixel = (data >> nShift) & nMask;
                    this.setPixel(this.imageBuffer, xBuffer++, yBuffer, bPixel);
                    nShift += nShiftPixel;
                }
                if (xBuffer > xMaxDirty) xMaxDirty = xBuffer;
                if (yBuffer < yDirty) yDirty = yBuffer;
                if (yBuffer >= yMaxDirty) yMaxDirty = yBuffer + 1;
            }
            addr += 2; iCell++;
            if (xBuffer >= this.cxBuffer) {
                xBuffer = 0; yBuffer++;
                if (yBuffer > this.cyBuffer) break;
            }
        }

        this.fCellCacheValid = true;

        /*
         * Instead of blasting the ENTIRE imageBuffer into contextBuffer, and then blasting the ENTIRE
         * canvasBuffer onto contextScreen, even for the smallest change, let's try to be a bit smarter about
         * the update (well, to the extent that the canvas APIs permit).
         */
        if (xDirty < this.cxBuffer) {
            var cxDirty = xMaxDirty - xDirty;
            var cyDirty = yMaxDirty - yDirty;
            if (this.rotateBuffer) {
                /*
                 * If rotateBuffer is set, then it must be -90, so we must "rotate" the dirty coordinates as well,
                 * because they are relative to the frame buffer, not the rotated image buffer.  Alternatively, you
                 * can use the following call to blast the ENTIRE imageBuffer into contextBuffer instead:
                 *
                 *      this.contextBuffer.putImageData(this.imageBuffer, 0, 0);
                 */
                var xDirtyOrig = xDirty, cxDirtyOrig = cxDirty;
                //noinspection JSSuspiciousNameCombination
                xDirty = yDirty;
                cxDirty = cyDirty;
                yDirty = this.cxBuffer - (xDirtyOrig + cxDirtyOrig);
                cyDirty = cxDirtyOrig;
            }
            this.contextBuffer.putImageData(this.imageBuffer, 0, 0, xDirty, yDirty, cxDirty, cyDirty);
            /*
             * As originally noted in /modules/pcx86/lib/video.js, I would prefer to draw only the dirty portion of
             * canvasBuffer, but there usually isn't a 1-1 pixel mapping between canvasBuffer and contextScreen, so
             * if we draw interior rectangles, we can end up with subpixel artifacts along the edges of those rectangles.
             */
            this.contextScreen.drawImage(this.canvasBuffer, 0, 0, this.canvasBuffer.width, this.canvasBuffer.height, 0, 0, this.cxScreen, this.cyScreen);
        }
    }
}

Video.BINDING = {
    CONTAINER:  "container"
};

Video.COLORS = {
    OVERLAY_TOP:    0,
    OVERLAY_BOTTOM: 1,
    OVERLAY_TOTAL:  2
};

Video.FORMAT = {
    UNKNOWN:        0,
    SI1978:         1,
    VT100:          2
};

Video.FORMATS = {
    "SI1978":       Video.FORMAT.SI1978,
    "VT100":        Video.FORMAT.VT100
};

Video.VT100 = {
    /*
     * The following font IDs are nothing more than all the possible LINEATTR values masked with FONTMASK;
     * also, note that double-high implies double-wide; the VT100 doesn't support a double-high single-wide font.
     */
    FONT: {
        NORML:      0x60,       // normal font (eg, 10x10)
        DWIDE:      0x40,       // double-wide, single-high font (eg, 20x10)
        DHIGH:      0x20,       // technically, this means display only the TOP half of the double-high font (eg, 20x20)
        DHIGH_BOT:  0x00        // technically, this means display only the BOTTOM half of the double-high font (eg, 20x20)
    },
    LINETERM:       0x7F,
    LINEATTR: {
        ADDRMASK:   0x0F,
        ADDRBIAS:   0x10,       // 0x10 == ADDRBIAS_LO, 0x00 = ADDRBIAS_HI
        FONTMASK:   0x60,
        SCROLL:     0x80
    },
    ADDRBIAS_LO:    0x2000,
    ADDRBIAS_HI:    0x4000
};

Video.BINDING = {
    CONTAINER:  "container"
};

/**
 * @copyright https://www.pcjs.org/modules/devices/cpu8080.js (C) Jeff Parsons 2012-2019
 */

/**
 * Emulation of the 8080 CPU
 *
 * @class {CPU}
 * @unrestricted
 * @property {Input} input
 * @property {Time} time
 * @property {number} nCyclesClocked
 */
class CPU extends Device {
    /**
     * CPU(idMachine, idDevice, config)
     *
     * @this {CPU}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        /*
         * Initialize the CPU.
         */
        this.init();

        /*
         * This internal cycle count is initialized on every clocker() invocation,
         * enabling opcode functions that need to consume a few extra cycles to bump this
         * count upward as needed.
         */
        this.nCyclesClocked = 0;

        /*
         * Get access to the Input device, so we can add our click functions.
         */
        this.input = /** @type {Input} */ (this.findDeviceByClass(Machine.CLASS.INPUT));
        this.input.addClick(this.onPower.bind(this), this.onReset.bind(this));

        /*
         * Get access to the Bus devices, so we have access to the I/O and memory address spaces.
         */
        this.busIO = /** @type {Bus} */ (this.findDevice(this.config['busIO']));
        this.busMemory = /** @type {Bus} */ (this.findDevice(this.config['busMemory']));

        /*
         * Get access to the Time device, so we can give it our clocker() function.
         */
        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
        if (this.time) {
            this.time.addClocker(this.clocker.bind(this));
            this.time.addUpdater(this.updateStatus.bind(this));
        }

        this.defineRegister(DbgIO.REGISTER.PC, this.getPC, this.setPC);
    }

    /**
     * clocker(nCyclesTarget)
     *
     * @this {CPU}
     * @param {number} nCyclesTarget (0 to single-step)
     * @returns {number} (number of cycles actually "clocked")
     */
    clocker(nCyclesTarget = 0)
    {
        let addr;
        this.nCyclesClocked = 0;
        try {
            while (this.nCyclesClocked <= nCyclesTarget) {
                addr = this.regPC;
                let opCode = this.busMemory.readData(addr);
                this.regPC = (addr + 1) & this.busMemory.addrLimit;
                this.aOps[opCode].call(this);
            }
        } catch(err) {
            this.regPC = addr;
            this.println(err.message);
            this.time.stop();
        }
        if (nCyclesTarget <= 0) {
            let cpu = this;
            this.time.doOutside(function clockerOutside() {
                cpu.println(cpu.toString());
            });
        }
        return this.nCyclesClocked;
    }

    /**
     * disassemble(opCode, addr)
     *
     * Returns a string representation of the selected instruction.
     *
     * @this {CPU}
     * @param {number|undefined} opCode
     * @param {number} addr
     * @returns {string}
     */
    disassemble(opCode, addr)
    {
        let sOp = "???", sOperands = "";

        return this.sprintf("%#06x: %#06x  %-8s%s\n", addr, opCode, sOp, sOperands);
    }

    /**
     * init()
     *
     * Initializes the CPU's state.
     */
    init()
    {
        this.resetRegs()

        /*
         * This 256-entry array of opcode functions is at the heart of the CPU engine.
         *
         * It might be worth trying a switch() statement instead, to see how the performance compares,
         * but I suspect that would vary quite a bit across JavaScript engines; for now, I'm putting my
         * money on array lookup.
         */
        this.aOps = [
            /* 0x00-0x03 */ this.opNOP,   this.opLXIB,  this.opSTAXB, this.opINXB,
            /* 0x04-0x07 */ this.opINRB,  this.opDCRB,  this.opMVIB,  this.opRLC,
            /* 0x08-0x0B */ this.opNOP,   this.opDADB,  this.opLDAXB, this.opDCXB,
            /* 0x0C-0x0F */ this.opINRC,  this.opDCRC,  this.opMVIC,  this.opRRC,
            /* 0x10-0x13 */ this.opNOP,   this.opLXID,  this.opSTAXD, this.opINXD,
            /* 0x14-0x17 */ this.opINRD,  this.opDCRD,  this.opMVID,  this.opRAL,
            /* 0x18-0x1B */ this.opNOP,   this.opDADD,  this.opLDAXD, this.opDCXD,
            /* 0x1C-0x1F */ this.opINRE,  this.opDCRE,  this.opMVIE,  this.opRAR,
            /* 0x20-0x23 */ this.opNOP,   this.opLXIH,  this.opSHLD,  this.opINXH,
            /* 0x24-0x27 */ this.opINRH,  this.opDCRH,  this.opMVIH,  this.opDAA,
            /* 0x28-0x2B */ this.opNOP,   this.opDADH,  this.opLHLD,  this.opDCXH,
            /* 0x2C-0x2F */ this.opINRL,  this.opDCRL,  this.opMVIL,  this.opCMA,
            /* 0x30-0x33 */ this.opNOP,   this.opLXISP, this.opSTA,   this.opINXSP,
            /* 0x34-0x37 */ this.opINRM,  this.opDCRM,  this.opMVIM,  this.opSTC,
            /* 0x38-0x3B */ this.opNOP,   this.opDADSP, this.opLDA,   this.opDCXSP,
            /* 0x3C-0x3F */ this.opINRA,  this.opDCRA,  this.opMVIA,  this.opCMC,
            /* 0x40-0x43 */ this.opMOVBB, this.opMOVBC, this.opMOVBD, this.opMOVBE,
            /* 0x44-0x47 */ this.opMOVBH, this.opMOVBL, this.opMOVBM, this.opMOVBA,
            /* 0x48-0x4B */ this.opMOVCB, this.opMOVCC, this.opMOVCD, this.opMOVCE,
            /* 0x4C-0x4F */ this.opMOVCH, this.opMOVCL, this.opMOVCM, this.opMOVCA,
            /* 0x50-0x53 */ this.opMOVDB, this.opMOVDC, this.opMOVDD, this.opMOVDE,
            /* 0x54-0x57 */ this.opMOVDH, this.opMOVDL, this.opMOVDM, this.opMOVDA,
            /* 0x58-0x5B */ this.opMOVEB, this.opMOVEC, this.opMOVED, this.opMOVEE,
            /* 0x5C-0x5F */ this.opMOVEH, this.opMOVEL, this.opMOVEM, this.opMOVEA,
            /* 0x60-0x63 */ this.opMOVHB, this.opMOVHC, this.opMOVHD, this.opMOVHE,
            /* 0x64-0x67 */ this.opMOVHH, this.opMOVHL, this.opMOVHM, this.opMOVHA,
            /* 0x68-0x6B */ this.opMOVLB, this.opMOVLC, this.opMOVLD, this.opMOVLE,
            /* 0x6C-0x6F */ this.opMOVLH, this.opMOVLL, this.opMOVLM, this.opMOVLA,
            /* 0x70-0x73 */ this.opMOVMB, this.opMOVMC, this.opMOVMD, this.opMOVME,
            /* 0x74-0x77 */ this.opMOVMH, this.opMOVML, this.opHLT,   this.opMOVMA,
            /* 0x78-0x7B */ this.opMOVAB, this.opMOVAC, this.opMOVAD, this.opMOVAE,
            /* 0x7C-0x7F */ this.opMOVAH, this.opMOVAL, this.opMOVAM, this.opMOVAA,
            /* 0x80-0x83 */ this.opADDB,  this.opADDC,  this.opADDD,  this.opADDE,
            /* 0x84-0x87 */ this.opADDH,  this.opADDL,  this.opADDM,  this.opADDA,
            /* 0x88-0x8B */ this.opADCB,  this.opADCC,  this.opADCD,  this.opADCE,
            /* 0x8C-0x8F */ this.opADCH,  this.opADCL,  this.opADCM,  this.opADCA,
            /* 0x90-0x93 */ this.opSUBB,  this.opSUBC,  this.opSUBD,  this.opSUBE,
            /* 0x94-0x97 */ this.opSUBH,  this.opSUBL,  this.opSUBM,  this.opSUBA,
            /* 0x98-0x9B */ this.opSBBB,  this.opSBBC,  this.opSBBD,  this.opSBBE,
            /* 0x9C-0x9F */ this.opSBBH,  this.opSBBL,  this.opSBBM,  this.opSBBA,
            /* 0xA0-0xA3 */ this.opANAB,  this.opANAC,  this.opANAD,  this.opANAE,
            /* 0xA4-0xA7 */ this.opANAH,  this.opANAL,  this.opANAM,  this.opANAA,
            /* 0xA8-0xAB */ this.opXRAB,  this.opXRAC,  this.opXRAD,  this.opXRAE,
            /* 0xAC-0xAF */ this.opXRAH,  this.opXRAL,  this.opXRAM,  this.opXRAA,
            /* 0xB0-0xB3 */ this.opORAB,  this.opORAC,  this.opORAD,  this.opORAE,
            /* 0xB4-0xB7 */ this.opORAH,  this.opORAL,  this.opORAM,  this.opORAA,
            /* 0xB8-0xBB */ this.opCMPB,  this.opCMPC,  this.opCMPD,  this.opCMPE,
            /* 0xBC-0xBF */ this.opCMPH,  this.opCMPL,  this.opCMPM,  this.opCMPA,
            /* 0xC0-0xC3 */ this.opRNZ,   this.opPOPB,  this.opJNZ,   this.opJMP,
            /* 0xC4-0xC7 */ this.opCNZ,   this.opPUSHB, this.opADI,   this.opRST0,
            /* 0xC8-0xCB */ this.opRZ,    this.opRET,   this.opJZ,    this.opJMP,
            /* 0xCC-0xCF */ this.opCZ,    this.opCALL,  this.opACI,   this.opRST1,
            /* 0xD0-0xD3 */ this.opRNC,   this.opPOPD,  this.opJNC,   this.opOUT,
            /* 0xD4-0xD7 */ this.opCNC,   this.opPUSHD, this.opSUI,   this.opRST2,
            /* 0xD8-0xDB */ this.opRC,    this.opRET,   this.opJC,    this.opIN,
            /* 0xDC-0xDF */ this.opCC,    this.opCALL,  this.opSBI,   this.opRST3,
            /* 0xE0-0xE3 */ this.opRPO,   this.opPOPH,  this.opJPO,   this.opXTHL,
            /* 0xE4-0xE7 */ this.opCPO,   this.opPUSHH, this.opANI,   this.opRST4,
            /* 0xE8-0xEB */ this.opRPE,   this.opPCHL,  this.opJPE,   this.opXCHG,
            /* 0xEC-0xEF */ this.opCPE,   this.opCALL,  this.opXRI,   this.opRST5,
            /* 0xF0-0xF3 */ this.opRP,    this.opPOPSW, this.opJP,    this.opDI,
            /* 0xF4-0xF7 */ this.opCP,    this.opPUPSW, this.opORI,   this.opRST6,
            /* 0xF8-0xFB */ this.opRM,    this.opSPHL,  this.opJM,    this.opEI,
            /* 0xFC-0xFF */ this.opCM,    this.opCALL,  this.opCPI,   this.opRST7
        ];
    }

    /**
     * loadState(state)
     *
     * If any saved values don't match (possibly overridden), abandon the given state and return false.
     *
     * @this {CPU}
     * @param {Object|Array|null} state
     * @returns {boolean}
     */
    loadState(state)
    {
        if (state) {
            let stateCPU = state['stateCPU'] || state[0];
            if (!stateCPU || !stateCPU.length) {
                this.println("invalid saved state");
                return false;
            }
            let version = stateCPU.shift();
            if ((version|0) !== (+VERSION|0)) {
                this.printf("saved state version mismatch: %3.2f\n", version);
                return false;
            }
            try {
                this.regPC = stateCPU.shift();
            } catch(err) {
                this.println("CPU state error: " + err.message);
                return false;
            }
        }
        return true;
    }

    /**
     * onLoad()
     *
     * Automatically called by the Machine device after all other devices have been powered up (eg, during
     * a page load event) AND the machine's 'autoRestore' property is true.  It is called BEFORE onPower().
     *
     * @this {CPU}
     */
    onLoad()
    {
        this.loadState(this.loadLocalStorage());
    }

    /**
     * onPower(fOn)
     *
     * Automatically called by the Machine device after all other devices have been powered up (eg, during
     * a page load event) AND the machine's 'autoStart' property is true, with fOn set to true.  It is also
     * called before all devices are powered down (eg, during a page unload event), with fOn set to false.
     *
     * May subsequently be called by the Input device to provide notification of a user-initiated power event
     * (eg, toggling a power button); in this case, fOn should NOT be set, so that no state is loaded or saved.
     *
     * @this {CPU}
     * @param {boolean} [fOn] (true to power on, false to power off; otherwise, toggle it)
     */
    onPower(fOn)
    {
        if (fOn == undefined) {
            fOn = !this.time.isRunning();
            if (fOn) this.regPC = 0;
        }
        if (fOn) {
            this.time.start();
        } else {
            this.time.stop();
        }
    }

    /**
     * onReset()
     *
     * Called by the Input device to provide notification of a reset event.
     *
     * @this {CPU}
     */
    onReset()
    {
        this.println("reset");
        this.regPC = 0;
        if (!this.time.isRunning()) {
            this.println(this.toString());
        }
    }

    /**
     * onSave()
     *
     * Automatically called by the Machine device before all other devices have been powered down (eg, during
     * a page unload event).
     *
     * @this {CPU}
     */
    onSave()
    {
        this.saveLocalStorage(this.saveState());
    }

    /**
     * op=0x00 (NOP)
     *
     * @this {CPU}
     */
    opNOP()
    {
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x01 (LXI B,d16)
     *
     * @this {CPU}
     */
    opLXIB()
    {
        this.setBC(this.getPCWord());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x02 (STAX B)
     *
     * @this {CPU}
     */
    opSTAXB()
    {
        this.setByte(this.getBC(), this.regA);
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x03 (INX B)
     *
     * @this {CPU}
     */
    opINXB()
    {
        this.setBC(this.getBC() + 1);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x04 (INR B)
     *
     * @this {CPU}
     */
    opINRB()
    {
        this.regB = this.incByte(this.regB);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x05 (DCR B)
     *
     * @this {CPU}
     */
    opDCRB()
    {
        this.regB = this.decByte(this.regB);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x06 (MVI B,d8)
     *
     * @this {CPU}
     */
    opMVIB()
    {
        this.regB = this.getPCByte();
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x07 (RLC)
     *
     * @this {CPU}
     */
    opRLC()
    {
        var carry = this.regA << 1;
        this.regA = (carry & 0xff) | (carry >> 8);
        this.updateCF(carry & 0x100);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x09 (DAD B)
     *
     * @this {CPU}
     */
    opDADB()
    {
        var w;
        this.setHL(w = this.getHL() + this.getBC());
        this.updateCF((w >> 8) & 0x100);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x0A (LDAX B)
     *
     * @this {CPU}
     */
    opLDAXB()
    {
        this.regA = this.getByte(this.getBC());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x0B (DCX B)
     *
     * @this {CPU}
     */
    opDCXB()
    {
        this.setBC(this.getBC() - 1);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x0C (INR C)
     *
     * @this {CPU}
     */
    opINRC()
    {
        this.regC = this.incByte(this.regC);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x0D (DCR C)
     *
     * @this {CPU}
     */
    opDCRC()
    {
        this.regC = this.decByte(this.regC);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x0E (MVI C,d8)
     *
     * @this {CPU}
     */
    opMVIC()
    {
        this.regC = this.getPCByte();
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x0F (RRC)
     *
     * @this {CPU}
     */
    opRRC()
    {
        var carry = (this.regA << 8) & 0x100;
        this.regA = (carry | this.regA) >> 1;
        this.updateCF(carry);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x11 (LXI D,d16)
     *
     * @this {CPU}
     */
    opLXID()
    {
        this.setDE(this.getPCWord());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x12 (STAX D)
     *
     * @this {CPU}
     */
    opSTAXD()
    {
        this.setByte(this.getDE(), this.regA);
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x13 (INX D)
     *
     * @this {CPU}
     */
    opINXD()
    {
        this.setDE(this.getDE() + 1);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x14 (INR D)
     *
     * @this {CPU}
     */
    opINRD()
    {
        this.regD = this.incByte(this.regD);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x15 (DCR D)
     *
     * @this {CPU}
     */
    opDCRD()
    {
        this.regD = this.decByte(this.regD);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x16 (MVI D,d8)
     *
     * @this {CPU}
     */
    opMVID()
    {
        this.regD = this.getPCByte();
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x17 (RAL)
     *
     * @this {CPU}
     */
    opRAL()
    {
        var carry = this.regA << 1;
        this.regA = (carry & 0xff) | this.getCF();
        this.updateCF(carry & 0x100);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x19 (DAD D)
     *
     * @this {CPU}
     */
    opDADD()
    {
        var w;
        this.setHL(w = this.getHL() + this.getDE());
        this.updateCF((w >> 8) & 0x100);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x1A (LDAX D)
     *
     * @this {CPU}
     */
    opLDAXD()
    {
        this.regA = this.getByte(this.getDE());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x1B (DCX D)
     *
     * @this {CPU}
     */
    opDCXD()
    {
        this.setDE(this.getDE() - 1);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x1C (INR E)
     *
     * @this {CPU}
     */
    opINRE()
    {
        this.regE = this.incByte(this.regE);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x1D (DCR E)
     *
     * @this {CPU}
     */
    opDCRE()
    {
        this.regE = this.decByte(this.regE);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x1E (MVI E,d8)
     *
     * @this {CPU}
     */
    opMVIE()
    {
        this.regE = this.getPCByte();
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x1F (RAR)
     *
     * @this {CPU}
     */
    opRAR()
    {
        var carry = (this.regA << 8);
        this.regA = ((this.getCF() << 8) | this.regA) >> 1;
        this.updateCF(carry & 0x100);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x21 (LXI H,d16)
     *
     * @this {CPU}
     */
    opLXIH()
    {
        this.setHL(this.getPCWord());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x22 (SHLD a16)
     *
     * @this {CPU}
     */
    opSHLD()
    {
        this.setWord(this.getPCWord(), this.getHL());
        this.nCyclesClocked += 16;
    }

    /**
     * op=0x23 (INX H)
     *
     * @this {CPU}
     */
    opINXH()
    {
        this.setHL(this.getHL() + 1);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x24 (INR H)
     *
     * @this {CPU}
     */
    opINRH()
    {
        this.regH = this.incByte(this.regH);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x25 (DCR H)
     *
     * @this {CPU}
     */
    opDCRH()
    {
        this.regH = this.decByte(this.regH);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x26 (MVI H,d8)
     *
     * @this {CPU}
     */
    opMVIH()
    {
        this.regH = this.getPCByte();
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x27 (DAA)
     *
     * @this {CPU}
     */
    opDAA()
    {
        var src = 0;
        var CF = this.getCF();
        var AF = this.getAF();
        if (AF || (this.regA & 0x0F) > 9) {
            src |= 0x06;
        }
        if (CF || this.regA >= 0x9A) {
            src |= 0x60;
            CF = CPU.PS.CF;
        }
        this.regA = this.addByte(src);
        this.updateCF(CF? 0x100 : 0);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x29 (DAD H)
     *
     * @this {CPU}
     */
    opDADH()
    {
        var w;
        this.setHL(w = this.getHL() + this.getHL());
        this.updateCF((w >> 8) & 0x100);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x2A (LHLD a16)
     *
     * @this {CPU}
     */
    opLHLD()
    {
        this.setHL(this.getWord(this.getPCWord()));
        this.nCyclesClocked += 16;
    }

    /**
     * op=0x2B (DCX H)
     *
     * @this {CPU}
     */
    opDCXH()
    {
        this.setHL(this.getHL() - 1);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x2C (INR L)
     *
     * @this {CPU}
     */
    opINRL()
    {
        this.regL = this.incByte(this.regL);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x2D (DCR L)
     *
     * @this {CPU}
     */
    opDCRL()
    {
        this.regL = this.decByte(this.regL);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x2E (MVI L,d8)
     *
     * @this {CPU}
     */
    opMVIL()
    {
        this.regL = this.getPCByte();
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x2F (CMA)
     *
     * @this {CPU}
     */
    opCMA()
    {
        this.regA = ~this.regA & 0xff;
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x31 (LXI SP,d16)
     *
     * @this {CPU}
     */
    opLXISP()
    {
        this.setSP(this.getPCWord());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x32 (STA a16)
     *
     * @this {CPU}
     */
    opSTA()
    {
        this.setByte(this.getPCWord(), this.regA);
        this.nCyclesClocked += 13;
    }

    /**
     * op=0x33 (INX SP)
     *
     * @this {CPU}
     */
    opINXSP()
    {
        this.setSP(this.getSP() + 1);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x34 (INR M)
     *
     * @this {CPU}
     */
    opINRM()
    {
        var addr = this.getHL();
        this.setByte(addr, this.incByte(this.getByte(addr)));
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x35 (DCR M)
     *
     * @this {CPU}
     */
    opDCRM()
    {
        var addr = this.getHL();
        this.setByte(addr, this.decByte(this.getByte(addr)));
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x36 (MVI M,d8)
     *
     * @this {CPU}
     */
    opMVIM()
    {
        this.setByte(this.getHL(), this.getPCByte());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x37 (STC)
     *
     * @this {CPU}
     */
    opSTC()
    {
        this.setCF();
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x39 (DAD SP)
     *
     * @this {CPU}
     */
    opDADSP()
    {
        var w;
        this.setHL(w = this.getHL() + this.getSP());
        this.updateCF((w >> 8) & 0x100);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0x3A (LDA a16)
     *
     * @this {CPU}
     */
    opLDA()
    {
        this.regA = this.getByte(this.getPCWord());
        this.nCyclesClocked += 13;
    }

    /**
     * op=0x3B (DCX SP)
     *
     * @this {CPU}
     */
    opDCXSP()
    {
        this.setSP(this.getSP() - 1);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x3C (INR A)
     *
     * @this {CPU}
     */
    opINRA()
    {
        this.regA = this.incByte(this.regA);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x3D (DCR A)
     *
     * @this {CPU}
     */
    opDCRA()
    {
        this.regA = this.decByte(this.regA);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x3E (MVI A,d8)
     *
     * @this {CPU}
     */
    opMVIA()
    {
        this.regA = this.getPCByte();
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x3F (CMC)
     *
     * @this {CPU}
     */
    opCMC()
    {
        this.updateCF(this.getCF()? 0 : 0x100);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x40 (MOV B,B)
     *
     * @this {CPU}
     */
    opMOVBB()
    {
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x41 (MOV B,C)
     *
     * @this {CPU}
     */
    opMOVBC()
    {
        this.regB = this.regC;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x42 (MOV B,D)
     *
     * @this {CPU}
     */
    opMOVBD()
    {
        this.regB = this.regD;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x43 (MOV B,E)
     *
     * @this {CPU}
     */
    opMOVBE()
    {
        this.regB = this.regE;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x44 (MOV B,H)
     *
     * @this {CPU}
     */
    opMOVBH()
    {
        this.regB = this.regH;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x45 (MOV B,L)
     *
     * @this {CPU}
     */
    opMOVBL()
    {
        this.regB = this.regL;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x46 (MOV B,M)
     *
     * @this {CPU}
     */
    opMOVBM()
    {
        this.regB = this.getByte(this.getHL());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x47 (MOV B,A)
     *
     * @this {CPU}
     */
    opMOVBA()
    {
        this.regB = this.regA;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x48 (MOV C,B)
     *
     * @this {CPU}
     */
    opMOVCB()
    {
        this.regC = this.regB;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x49 (MOV C,C)
     *
     * @this {CPU}
     */
    opMOVCC()
    {
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x4A (MOV C,D)
     *
     * @this {CPU}
     */
    opMOVCD()
    {
        this.regC = this.regD;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x4B (MOV C,E)
     *
     * @this {CPU}
     */
    opMOVCE()
    {
        this.regC = this.regE;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x4C (MOV C,H)
     *
     * @this {CPU}
     */
    opMOVCH()
    {
        this.regC = this.regH;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x4D (MOV C,L)
     *
     * @this {CPU}
     */
    opMOVCL()
    {
        this.regC = this.regL;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x4E (MOV C,M)
     *
     * @this {CPU}
     */
    opMOVCM()
    {
        this.regC = this.getByte(this.getHL());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x4F (MOV C,A)
     *
     * @this {CPU}
     */
    opMOVCA()
    {
        this.regC = this.regA;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x50 (MOV D,B)
     *
     * @this {CPU}
     */
    opMOVDB()
    {
        this.regD = this.regB;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x51 (MOV D,C)
     *
     * @this {CPU}
     */
    opMOVDC()
    {
        this.regD = this.regC;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x52 (MOV D,D)
     *
     * @this {CPU}
     */
    opMOVDD()
    {
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x53 (MOV D,E)
     *
     * @this {CPU}
     */
    opMOVDE()
    {
        this.regD = this.regE;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x54 (MOV D,H)
     *
     * @this {CPU}
     */
    opMOVDH()
    {
        this.regD = this.regH;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x55 (MOV D,L)
     *
     * @this {CPU}
     */
    opMOVDL()
    {
        this.regD = this.regL;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x56 (MOV D,M)
     *
     * @this {CPU}
     */
    opMOVDM()
    {
        this.regD = this.getByte(this.getHL());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x57 (MOV D,A)
     *
     * @this {CPU}
     */
    opMOVDA()
    {
        this.regD = this.regA;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x58 (MOV E,B)
     *
     * @this {CPU}
     */
    opMOVEB()
    {
        this.regE = this.regB;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x59 (MOV E,C)
     *
     * @this {CPU}
     */
    opMOVEC()
    {
        this.regE = this.regC;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x5A (MOV E,D)
     *
     * @this {CPU}
     */
    opMOVED()
    {
        this.regE = this.regD;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x5B (MOV E,E)
     *
     * @this {CPU}
     */
    opMOVEE()
    {
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x5C (MOV E,H)
     *
     * @this {CPU}
     */
    opMOVEH()
    {
        this.regE = this.regH;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x5D (MOV E,L)
     *
     * @this {CPU}
     */
    opMOVEL()
    {
        this.regE = this.regL;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x5E (MOV E,M)
     *
     * @this {CPU}
     */
    opMOVEM()
    {
        this.regE = this.getByte(this.getHL());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x5F (MOV E,A)
     *
     * @this {CPU}
     */
    opMOVEA()
    {
        this.regE = this.regA;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x60 (MOV H,B)
     *
     * @this {CPU}
     */
    opMOVHB()
    {
        this.regH = this.regB;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x61 (MOV H,C)
     *
     * @this {CPU}
     */
    opMOVHC()
    {
        this.regH = this.regC;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x62 (MOV H,D)
     *
     * @this {CPU}
     */
    opMOVHD()
    {
        this.regH = this.regD;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x63 (MOV H,E)
     *
     * @this {CPU}
     */
    opMOVHE()
    {
        this.regH = this.regE;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x64 (MOV H,H)
     *
     * @this {CPU}
     */
    opMOVHH()
    {
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x65 (MOV H,L)
     *
     * @this {CPU}
     */
    opMOVHL()
    {
        this.regH = this.regL;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x66 (MOV H,M)
     *
     * @this {CPU}
     */
    opMOVHM()
    {
        this.regH = this.getByte(this.getHL());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x67 (MOV H,A)
     *
     * @this {CPU}
     */
    opMOVHA()
    {
        this.regH = this.regA;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x68 (MOV L,B)
     *
     * @this {CPU}
     */
    opMOVLB()
    {
        this.regL = this.regB;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x69 (MOV L,C)
     *
     * @this {CPU}
     */
    opMOVLC()
    {
        this.regL = this.regC;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x6A (MOV L,D)
     *
     * @this {CPU}
     */
    opMOVLD()
    {
        this.regL = this.regD;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x6B (MOV L,E)
     *
     * @this {CPU}
     */
    opMOVLE()
    {
        this.regL = this.regE;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x6C (MOV L,H)
     *
     * @this {CPU}
     */
    opMOVLH()
    {
        this.regL = this.regH;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x6D (MOV L,L)
     *
     * @this {CPU}
     */
    opMOVLL()
    {
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x6E (MOV L,M)
     *
     * @this {CPU}
     */
    opMOVLM()
    {
        this.regL = this.getByte(this.getHL());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x6F (MOV L,A)
     *
     * @this {CPU}
     */
    opMOVLA()
    {
        this.regL = this.regA;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x70 (MOV M,B)
     *
     * @this {CPU}
     */
    opMOVMB()
    {
        this.setByte(this.getHL(), this.regB);
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x71 (MOV M,C)
     *
     * @this {CPU}
     */
    opMOVMC()
    {
        this.setByte(this.getHL(), this.regC);
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x72 (MOV M,D)
     *
     * @this {CPU}
     */
    opMOVMD()
    {
        this.setByte(this.getHL(), this.regD);
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x73 (MOV M,E)
     *
     * @this {CPU}
     */
    opMOVME()
    {
        this.setByte(this.getHL(), this.regE);
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x74 (MOV M,H)
     *
     * @this {CPU}
     */
    opMOVMH()
    {
        this.setByte(this.getHL(), this.regH);
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x75 (MOV M,L)
     *
     * @this {CPU}
     */
    opMOVML()
    {
        this.setByte(this.getHL(), this.regL);
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x76 (HLT)
     *
     * @this {CPU}
     */
    opHLT()
    {
        var addr = this.getPC() - 1;

        /*
         * If any HLT check functions are installed, call them, and if any of them return true, then
         * immediately stop HLT processing.
         */
        //
        // if (this.afnHalt.length) {
        //     for (var i = 0; i < this.afnHalt.length; i++) {
        //         if (this.afnHalt[i](addr)) return;
        //     }
        // }
        //

        this.nCyclesClocked += 7;

        /*
         * The CPU is never REALLY halted by a HLT instruction; instead, we call requestHALT(), which
         * signals to stepCPU() that it should end the current burst AND that it should not execute any
         * more instructions until checkINTR() indicates a hardware interrupt has been requested.
         */
        this.requestHALT();

        /*
         * If a Debugger is present and the HALT message category is enabled, then we REALLY halt the CPU,
         * on the theory that whoever's using the Debugger would like to see HLTs.
         */
        if (this.dbg && this.isMessageOn(MESSAGES.HALT)) {
            this.setPC(addr);               // this is purely for the Debugger's benefit, to show the HLT
            this.time.stop();
            return;
        }

        /*
         * We also REALLY halt the machine if interrupts have been disabled, since that means it's dead
         * in the water (we have no NMI generation mechanism at the moment).
         */
        if (!this.getIF()) {
            if (this.dbg) this.setPC(addr);
            this.time.stop();
        }
    }

    /**
     * op=0x77 (MOV M,A)
     *
     * @this {CPU}
     */
    opMOVMA()
    {
        this.setByte(this.getHL(), this.regA);
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x78 (MOV A,B)
     *
     * @this {CPU}
     */
    opMOVAB()
    {
        this.regA = this.regB;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x79 (MOV A,C)
     *
     * @this {CPU}
     */
    opMOVAC()
    {
        this.regA = this.regC;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x7A (MOV A,D)
     *
     * @this {CPU}
     */
    opMOVAD()
    {
        this.regA = this.regD;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x7B (MOV A,E)
     *
     * @this {CPU}
     */
    opMOVAE()
    {
        this.regA = this.regE;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x7C (MOV A,H)
     *
     * @this {CPU}
     */
    opMOVAH()
    {
        this.regA = this.regH;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x7D (MOV A,L)
     *
     * @this {CPU}
     */
    opMOVAL()
    {
        this.regA = this.regL;
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x7E (MOV A,M)
     *
     * @this {CPU}
     */
    opMOVAM()
    {
        this.regA = this.getByte(this.getHL());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x7F (MOV A,A)
     *
     * @this {CPU}
     */
    opMOVAA()
    {
        this.nCyclesClocked += 5;
    }

    /**
     * op=0x80 (ADD B)
     *
     * @this {CPU}
     */
    opADDB()
    {
        this.regA = this.addByte(this.regB);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x81 (ADD C)
     *
     * @this {CPU}
     */
    opADDC()
    {
        this.regA = this.addByte(this.regC);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x82 (ADD D)
     *
     * @this {CPU}
     */
    opADDD()
    {
        this.regA = this.addByte(this.regD);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x83 (ADD E)
     *
     * @this {CPU}
     */
    opADDE()
    {
        this.regA = this.addByte(this.regE);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x84 (ADD H)
     *
     * @this {CPU}
     */
    opADDH()
    {
        this.regA = this.addByte(this.regH);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x85 (ADD L)
     *
     * @this {CPU}
     */
    opADDL()
    {
        this.regA = this.addByte(this.regL);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x86 (ADD M)
     *
     * @this {CPU}
     */
    opADDM()
    {
        this.regA = this.addByte(this.getByte(this.getHL()));
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x87 (ADD A)
     *
     * @this {CPU}
     */
    opADDA()
    {
        this.regA = this.addByte(this.regA);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x88 (ADC B)
     *
     * @this {CPU}
     */
    opADCB()
    {
        this.regA = this.addByteCarry(this.regB);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x89 (ADC C)
     *
     * @this {CPU}
     */
    opADCC()
    {
        this.regA = this.addByteCarry(this.regC);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x8A (ADC D)
     *
     * @this {CPU}
     */
    opADCD()
    {
        this.regA = this.addByteCarry(this.regD);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x8B (ADC E)
     *
     * @this {CPU}
     */
    opADCE()
    {
        this.regA = this.addByteCarry(this.regE);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x8C (ADC H)
     *
     * @this {CPU}
     */
    opADCH()
    {
        this.regA = this.addByteCarry(this.regH);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x8D (ADC L)
     *
     * @this {CPU}
     */
    opADCL()
    {
        this.regA = this.addByteCarry(this.regL);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x8E (ADC M)
     *
     * @this {CPU}
     */
    opADCM()
    {
        this.regA = this.addByteCarry(this.getByte(this.getHL()));
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x8F (ADC A)
     *
     * @this {CPU}
     */
    opADCA()
    {
        this.regA = this.addByteCarry(this.regA);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x90 (SUB B)
     *
     * @this {CPU}
     */
    opSUBB()
    {
        this.regA = this.subByte(this.regB);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x91 (SUB C)
     *
     * @this {CPU}
     */
    opSUBC()
    {
        this.regA = this.subByte(this.regC);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x92 (SUB D)
     *
     * @this {CPU}
     */
    opSUBD()
    {
        this.regA = this.subByte(this.regD);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x93 (SUB E)
     *
     * @this {CPU}
     */
    opSUBE()
    {
        this.regA = this.subByte(this.regE);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x94 (SUB H)
     *
     * @this {CPU}
     */
    opSUBH()
    {
        this.regA = this.subByte(this.regH);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x95 (SUB L)
     *
     * @this {CPU}
     */
    opSUBL()
    {
        this.regA = this.subByte(this.regL);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x96 (SUB M)
     *
     * @this {CPU}
     */
    opSUBM()
    {
        this.regA = this.subByte(this.getByte(this.getHL()));
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x97 (SUB A)
     *
     * @this {CPU}
     */
    opSUBA()
    {
        this.regA = this.subByte(this.regA);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x98 (SBB B)
     *
     * @this {CPU}
     */
    opSBBB()
    {
        this.regA = this.subByteBorrow(this.regB);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x99 (SBB C)
     *
     * @this {CPU}
     */
    opSBBC()
    {
        this.regA = this.subByteBorrow(this.regC);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x9A (SBB D)
     *
     * @this {CPU}
     */
    opSBBD()
    {
        this.regA = this.subByteBorrow(this.regD);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x9B (SBB E)
     *
     * @this {CPU}
     */
    opSBBE()
    {
        this.regA = this.subByteBorrow(this.regE);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x9C (SBB H)
     *
     * @this {CPU}
     */
    opSBBH()
    {
        this.regA = this.subByteBorrow(this.regH);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x9D (SBB L)
     *
     * @this {CPU}
     */
    opSBBL()
    {
        this.regA = this.subByteBorrow(this.regL);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0x9E (SBB M)
     *
     * @this {CPU}
     */
    opSBBM()
    {
        this.regA = this.subByteBorrow(this.getByte(this.getHL()));
        this.nCyclesClocked += 7;
    }

    /**
     * op=0x9F (SBB A)
     *
     * @this {CPU}
     */
    opSBBA()
    {
        this.regA = this.subByteBorrow(this.regA);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xA0 (ANA B)
     *
     * @this {CPU}
     */
    opANAB()
    {
        this.regA = this.andByte(this.regB);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xA1 (ANA C)
     *
     * @this {CPU}
     */
    opANAC()
    {
        this.regA = this.andByte(this.regC);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xA2 (ANA D)
     *
     * @this {CPU}
     */
    opANAD()
    {
        this.regA = this.andByte(this.regD);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xA3 (ANA E)
     *
     * @this {CPU}
     */
    opANAE()
    {
        this.regA = this.andByte(this.regE);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xA4 (ANA H)
     *
     * @this {CPU}
     */
    opANAH()
    {
        this.regA = this.andByte(this.regH);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xA5 (ANA L)
     *
     * @this {CPU}
     */
    opANAL()
    {
        this.regA = this.andByte(this.regL);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xA6 (ANA M)
     *
     * @this {CPU}
     */
    opANAM()
    {
        this.regA = this.andByte(this.getByte(this.getHL()));
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xA7 (ANA A)
     *
     * @this {CPU}
     */
    opANAA()
    {
        this.regA = this.andByte(this.regA);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xA8 (XRA B)
     *
     * @this {CPU}
     */
    opXRAB()
    {
        this.regA = this.xorByte(this.regB);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xA9 (XRA C)
     *
     * @this {CPU}
     */
    opXRAC()
    {
        this.regA = this.xorByte(this.regC);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xAA (XRA D)
     *
     * @this {CPU}
     */
    opXRAD()
    {
        this.regA = this.xorByte(this.regD);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xAB (XRA E)
     *
     * @this {CPU}
     */
    opXRAE()
    {
        this.regA = this.xorByte(this.regE);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xAC (XRA H)
     *
     * @this {CPU}
     */
    opXRAH()
    {
        this.regA = this.xorByte(this.regH);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xAD (XRA L)
     *
     * @this {CPU}
     */
    opXRAL()
    {
        this.regA = this.xorByte(this.regL);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xAE (XRA M)
     *
     * @this {CPU}
     */
    opXRAM()
    {
        this.regA = this.xorByte(this.getByte(this.getHL()));
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xAF (XRA A)
     *
     * @this {CPU}
     */
    opXRAA()
    {
        this.regA = this.xorByte(this.regA);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xB0 (ORA B)
     *
     * @this {CPU}
     */
    opORAB()
    {
        this.regA = this.orByte(this.regB);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xB1 (ORA C)
     *
     * @this {CPU}
     */
    opORAC()
    {
        this.regA = this.orByte(this.regC);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xB2 (ORA D)
     *
     * @this {CPU}
     */
    opORAD()
    {
        this.regA = this.orByte(this.regD);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xB3 (ORA E)
     *
     * @this {CPU}
     */
    opORAE()
    {
        this.regA = this.orByte(this.regE);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xB4 (ORA H)
     *
     * @this {CPU}
     */
    opORAH()
    {
        this.regA = this.orByte(this.regH);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xB5 (ORA L)
     *
     * @this {CPU}
     */
    opORAL()
    {
        this.regA = this.orByte(this.regL);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xB6 (ORA M)
     *
     * @this {CPU}
     */
    opORAM()
    {
        this.regA = this.orByte(this.getByte(this.getHL()));
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xB7 (ORA A)
     *
     * @this {CPU}
     */
    opORAA()
    {
        this.regA = this.orByte(this.regA);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xB8 (CMP B)
     *
     * @this {CPU}
     */
    opCMPB()
    {
        this.subByte(this.regB);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xB9 (CMP C)
     *
     * @this {CPU}
     */
    opCMPC()
    {
        this.subByte(this.regC);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xBA (CMP D)
     *
     * @this {CPU}
     */
    opCMPD()
    {
        this.subByte(this.regD);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xBB (CMP E)
     *
     * @this {CPU}
     */
    opCMPE()
    {
        this.subByte(this.regE);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xBC (CMP H)
     *
     * @this {CPU}
     */
    opCMPH()
    {
        this.subByte(this.regH);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xBD (CMP L)
     *
     * @this {CPU}
     */
    opCMPL()
    {
        this.subByte(this.regL);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xBE (CMP M)
     *
     * @this {CPU}
     */
    opCMPM()
    {
        this.subByte(this.getByte(this.getHL()));
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xBF (CMP A)
     *
     * @this {CPU}
     */
    opCMPA()
    {
        this.subByte(this.regA);
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xC0 (RNZ)
     *
     * @this {CPU}
     */
    opRNZ()
    {
        if (!this.getZF()) {
            this.setPC(this.popWord());
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xC1 (POP B)
     *
     * @this {CPU}
     */
    opPOPB()
    {
        this.setBC(this.popWord());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xC2 (JNZ a16)
     *
     * @this {CPU}
     */
    opJNZ()
    {
        var w = this.getPCWord();
        if (!this.getZF()) this.setPC(w);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xC3 (JMP a16)
     *
     * @this {CPU}
     */
    opJMP()
    {
        this.setPC(this.getPCWord());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xC4 (CNZ a16)
     *
     * @this {CPU}
     */
    opCNZ()
    {
        var w = this.getPCWord();
        if (!this.getZF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xC5 (PUSH B)
     *
     * @this {CPU}
     */
    opPUSHB()
    {
        this.pushWord(this.getBC());
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xC6 (ADI d8)
     *
     * @this {CPU}
     */
    opADI()
    {
        this.regA = this.addByte(this.getPCByte());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xC7 (RST 0)
     *
     * @this {CPU}
     */
    opRST0()
    {
        this.pushWord(this.getPC());
        this.setPC(0);
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xC8 (RZ)
     *
     * @this {CPU}
     */
    opRZ()
    {
        if (this.getZF()) {
            this.setPC(this.popWord());
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xC9 (RET)
     *
     * @this {CPU}
     */
    opRET()
    {
        this.setPC(this.popWord());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xCA (JZ a16)
     *
     * @this {CPU}
     */
    opJZ()
    {
        var w = this.getPCWord();
        if (this.getZF()) this.setPC(w);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xCC (CZ a16)
     *
     * @this {CPU}
     */
    opCZ()
    {
        var w = this.getPCWord();
        if (this.getZF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xCD (CALL a16)
     *
     * @this {CPU}
     */
    opCALL()
    {
        var w = this.getPCWord();
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nCyclesClocked += 17;
    }

    /**
     * op=0xCE (ACI d8)
     *
     * @this {CPU}
     */
    opACI()
    {
        this.regA = this.addByteCarry(this.getPCByte());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xCF (RST 1)
     *
     * @this {CPU}
     */
    opRST1()
    {
        this.pushWord(this.getPC());
        this.setPC(0x08);
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xD0 (RNC)
     *
     * @this {CPU}
     */
    opRNC()
    {
        if (!this.getCF()) {
            this.setPC(this.popWord());
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xD1 (POP D)
     *
     * @this {CPU}
     */
    opPOPD()
    {
        this.setDE(this.popWord());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xD2 (JNC a16)
     *
     * @this {CPU}
     */
    opJNC()
    {
        var w = this.getPCWord();
        if (!this.getCF()) this.setPC(w);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xD3 (OUT d8)
     *
     * @this {CPU}
     */
    opOUT()
    {
        var port = this.getPCByte();
        this.busIO.writeData(port, this.regA, this.offPC(-2));
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xD4 (CNC a16)
     *
     * @this {CPU}
     */
    opCNC()
    {
        var w = this.getPCWord();
        if (!this.getCF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xD5 (PUSH D)
     *
     * @this {CPU}
     */
    opPUSHD()
    {
        this.pushWord(this.getDE());
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xD6 (SUI d8)
     *
     * @this {CPU}
     */
    opSUI()
    {
        this.regA = this.subByte(this.getPCByte());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xD7 (RST 2)
     *
     * @this {CPU}
     */
    opRST2()
    {
        this.pushWord(this.getPC());
        this.setPC(0x10);
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xD8 (RC)
     *
     * @this {CPU}
     */
    opRC()
    {
        if (this.getCF()) {
            this.setPC(this.popWord());
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xDA (JC a16)
     *
     * @this {CPU}
     */
    opJC()
    {
        var w = this.getPCWord();
        if (this.getCF()) this.setPC(w);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xDB (IN d8)
     *
     * @this {CPU}
     */
    opIN()
    {
        var port = this.getPCByte();
        this.regA = this.busIO.readData(port, this.offPC(-2)) & 0xff;
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xDC (CC a16)
     *
     * @this {CPU}
     */
    opCC()
    {
        var w = this.getPCWord();
        if (this.getCF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xDE (SBI d8)
     *
     * @this {CPU}
     */
    opSBI()
    {
        this.regA = this.subByteBorrow(this.getPCByte());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xDF (RST 3)
     *
     * @this {CPU}
     */
    opRST3()
    {
        this.pushWord(this.getPC());
        this.setPC(0x18);
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xE0 (RPO)
     *
     * @this {CPU}
     */
    opRPO()
    {
        if (!this.getPF()) {
            this.setPC(this.popWord());
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xE1 (POP H)
     *
     * @this {CPU}
     */
    opPOPH()
    {
        this.setHL(this.popWord());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xE2 (JPO a16)
     *
     * @this {CPU}
     */
    opJPO()
    {
        var w = this.getPCWord();
        if (!this.getPF()) this.setPC(w);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xE3 (XTHL)
     *
     * @this {CPU}
     */
    opXTHL()
    {
        var w = this.popWord();
        this.pushWord(this.getHL());
        this.setHL(w);
        this.nCyclesClocked += 18;
    }

    /**
     * op=0xE4 (CPO a16)
     *
     * @this {CPU}
     */
    opCPO()
    {
        var w = this.getPCWord();
        if (!this.getPF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xE5 (PUSH H)
     *
     * @this {CPU}
     */
    opPUSHH()
    {
        this.pushWord(this.getHL());
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xE6 (ANI d8)
     *
     * @this {CPU}
     */
    opANI()
    {
        this.regA = this.andByte(this.getPCByte());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xE7 (RST 4)
     *
     * @this {CPU}
     */
    opRST4()
    {
        this.pushWord(this.getPC());
        this.setPC(0x20);
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xE8 (RPE)
     *
     * @this {CPU}
     */
    opRPE()
    {
        if (this.getPF()) {
            this.setPC(this.popWord());
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xE9 (PCHL)
     *
     * @this {CPU}
     */
    opPCHL()
    {
        this.setPC(this.getHL());
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xEA (JPE a16)
     *
     * @this {CPU}
     */
    opJPE()
    {
        var w = this.getPCWord();
        if (this.getPF()) this.setPC(w);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xEB (XCHG)
     *
     * @this {CPU}
     */
    opXCHG()
    {
        var w = this.getHL();
        this.setHL(this.getDE());
        this.setDE(w);
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xEC (CPE a16)
     *
     * @this {CPU}
     */
    opCPE()
    {
        var w = this.getPCWord();
        if (this.getPF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xEE (XRI d8)
     *
     * @this {CPU}
     */
    opXRI()
    {
        this.regA = this.xorByte(this.getPCByte());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xEF (RST 5)
     *
     * @this {CPU}
     */
    opRST5()
    {
        this.pushWord(this.getPC());
        this.setPC(0x28);
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xF0 (RP)
     *
     * @this {CPU}
     */
    opRP()
    {
        if (!this.getSF()) {
            this.setPC(this.popWord());
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xF1 (POP PSW)
     *
     * @this {CPU}
     */
    opPOPSW()
    {
        this.setPSW(this.popWord());
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xF2 (JP a16)
     *
     * @this {CPU}
     */
    opJP()
    {
        var w = this.getPCWord();
        if (!this.getSF()) this.setPC(w);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xF3 (DI)
     *
     * @this {CPU}
     */
    opDI()
    {
        this.clearIF();
        this.nCyclesClocked += 4;
    }

    /**
     * op=0xF4 (CP a16)
     *
     * @this {CPU}
     */
    opCP()
    {
        var w = this.getPCWord();
        if (!this.getSF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xF5 (PUSH PSW)
     *
     * @this {CPU}
     */
    opPUPSW()
    {
        this.pushWord(this.getPSW());
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xF6 (ORI d8)
     *
     * @this {CPU}
     */
    opORI()
    {
        this.regA = this.orByte(this.getPCByte());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xF7 (RST 6)
     *
     * @this {CPU}
     */
    opRST6()
    {
        this.pushWord(this.getPC());
        this.setPC(0x30);
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xF8 (RM)
     *
     * @this {CPU}
     */
    opRM()
    {
        if (this.getSF()) {
            this.setPC(this.popWord());
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xF9 (SPHL)
     *
     * @this {CPU}
     */
    opSPHL()
    {
        this.setSP(this.getHL());
        this.nCyclesClocked += 5;
    }

    /**
     * op=0xFA (JM a16)
     *
     * @this {CPU}
     */
    opJM()
    {
        var w = this.getPCWord();
        if (this.getSF()) this.setPC(w);
        this.nCyclesClocked += 10;
    }

    /**
     * op=0xFB (EI)
     *
     * @this {CPU}
     */
    opEI()
    {
        this.setIF();
        this.nCyclesClocked += 4;
        this.checkINTR();
    }

    /**
     * op=0xFC (CM a16)
     *
     * @this {CPU}
     */
    opCM()
    {
        var w = this.getPCWord();
        if (this.getSF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesClocked += 6;
        }
        this.nCyclesClocked += 11;
    }

    /**
     * op=0xFE (CPI d8)
     *
     * @this {CPU}
     */
    opCPI()
    {
        this.subByte(this.getPCByte());
        this.nCyclesClocked += 7;
    }

    /**
     * op=0xFF (RST 7)
     *
     * @this {CPU}
     */
    opRST7()
    {
        this.pushWord(this.getPC());
        this.setPC(0x38);
        this.nCyclesClocked += 11;
    }

    /**
     * resetRegs()
     *
     * @this {CPU}
     */
    resetRegs()
    {
        this.regA = 0;
        this.regB = 0;
        this.regC = 0;
        this.regD = 0;
        this.regE = 0;
        this.regH = 0;
        this.regL = 0;
        this.setSP(0);
        this.setPC(this.addrReset);

        /*
         * This resets the Processor Status flags (regPS), along with all the internal "result registers".
         */
        this.setPS(0);

        /*
         * intFlags contains some internal states we use to indicate whether a hardware interrupt (INTFLAG.INTR) or
         * Trap software interrupt (INTR.TRAP) has been requested, as well as when we're in a "HLT" state (INTFLAG.HALT)
         * that requires us to wait for a hardware interrupt (INTFLAG.INTR) before continuing execution.
         */
        this.intFlags = CPU.INTFLAG.NONE;

        /*
         * Reset all our "virtual registers" now
         */
        this.addrStop = -1;
    }

    /**
     * saveState()
     *
     * @this {CPU}
     * @returns {Array}
     */
    saveState()
    {
        let state = [[],[], []];
        let stateCPU = state[0];
        stateCPU.push(+VERSION);
        stateCPU.push(this.regPC);
        return state;
    }

    /**
     * setRegister(name, value)
     *
     * @this {CPU}
     * @param {string} name
     * @param {number} value
     */
    setRegister(name, value)
    {
        if (!name || value < 0) return;

        switch(name) {
        case "pc":
            this.regPC = value;
            break;
        default:
            this.println("unrecognized register: " + name);
            break;
        }
    }

    /**
     * setReset(addr)
     *
     * @this {CPU}
     * @param {number} addr
     */
    setReset(addr)
    {
        this.addrReset = addr;
        this.setPC(addr);
    }

    /**
     * getBC()
     *
     * @this {CPU}
     * @return {number}
     */
    getBC()
    {
        return (this.regB << 8) | this.regC;
    }

    /**
     * setBC(w)
     *
     * @this {CPU}
     * @param {number} w
     */
    setBC(w)
    {
        this.regB = (w >> 8) & 0xff;
        this.regC = w & 0xff;
    }

    /**
     * getDE()
     *
     * @this {CPU}
     * @return {number}
     */
    getDE()
    {
        return (this.regD << 8) | this.regE;
    }

    /**
     * setDE(w)
     *
     * @this {CPU}
     * @param {number} w
     */
    setDE(w)
    {
        this.regD = (w >> 8) & 0xff;
        this.regE = w & 0xff;
    }

    /**
     * getHL()
     *
     * @this {CPU}
     * @return {number}
     */
    getHL()
    {
        return (this.regH << 8) | this.regL;
    }

    /**
     * setHL(w)
     *
     * @this {CPU}
     * @param {number} w
     */
    setHL(w)
    {
        this.regH = (w >> 8) & 0xff;
        this.regL = w & 0xff;
    }

    /**
     * getSP()
     *
     * @this {CPU}
     * @return {number}
     */
    getSP()
    {
        return this.regSP;
    }

    /**
     * setSP(off)
     *
     * @this {CPU}
     * @param {number} off
     */
    setSP(off)
    {
        this.regSP = off & 0xffff;
    }

    /**
     * getPC()
     *
     * @this {CPU}
     * @return {number}
     */
    getPC()
    {
        return this.regPC;
    }

    /**
     * offPC()
     *
     * @this {CPU}
     * @param {number} off
     * @return {number}
     */
    offPC(off)
    {
        return (this.regPC + off) & 0xffff;
    }

    /**
     * setPC(off)
     *
     * @this {CPU}
     * @param {number} off
     */
    setPC(off)
    {
        this.regPC = off & 0xffff;
    }

    /**
     * clearCF()
     *
     * @this {CPU}
     */
    clearCF()
    {
        this.resultZeroCarry &= 0xff;
    }

    /**
     * getCF()
     *
     * @this {CPU}
     * @return {number} 0 or 1 (CPU.PS.CF)
     */
    getCF()
    {
        return (this.resultZeroCarry & 0x100)? CPU.PS.CF : 0;
    }

    /**
     * setCF()
     *
     * @this {CPU}
     */
    setCF()
    {
        this.resultZeroCarry |= 0x100;
    }

    /**
     * updateCF(CF)
     *
     * @this {CPU}
     * @param {number} CF (0x000 or 0x100)
     */
    updateCF(CF)
    {
        this.resultZeroCarry = (this.resultZeroCarry & 0xff) | CF;
    }

    /**
     * clearPF()
     *
     * @this {CPU}
     */
    clearPF()
    {
        if (this.getPF()) this.resultParitySign ^= 0x1;
    }

    /**
     * getPF()
     *
     * @this {CPU}
     * @return {number} 0 or CPU.PS.PF
     */
    getPF()
    {
        return (CPU.PARITY[this.resultParitySign & 0xff])? CPU.PS.PF : 0;
    }

    /**
     * setPF()
     *
     * @this {CPU}
     */
    setPF()
    {
        if (!this.getPF()) this.resultParitySign ^= 0x1;
    }

    /**
     * clearAF()
     *
     * @this {CPU}
     */
    clearAF()
    {
        this.resultAuxOverflow = (this.resultParitySign & 0x10) | (this.resultAuxOverflow & ~0x10);
    }

    /**
     * getAF()
     *
     * @this {CPU}
     * @return {number} 0 or CPU.PS.AF
     */
    getAF()
    {
        return ((this.resultParitySign ^ this.resultAuxOverflow) & 0x10)? CPU.PS.AF : 0;
    }

    /**
     * setAF()
     *
     * @this {CPU}
     */
    setAF()
    {
        this.resultAuxOverflow = (~this.resultParitySign & 0x10) | (this.resultAuxOverflow & ~0x10);
    }

    /**
     * clearZF()
     *
     * @this {CPU}
     */
    clearZF()
    {
        this.resultZeroCarry |= 0xff;
    }

    /**
     * getZF()
     *
     * @this {CPU}
     * @return {number} 0 or CPU.PS.ZF
     */
    getZF()
    {
        return (this.resultZeroCarry & 0xff)? 0 : CPU.PS.ZF;
    }

    /**
     * setZF()
     *
     * @this {CPU}
     */
    setZF()
    {
        this.resultZeroCarry &= ~0xff;
    }

    /**
     * clearSF()
     *
     * @this {CPU}
     */
    clearSF()
    {
        if (this.getSF()) this.resultParitySign ^= 0xc0;
    }

    /**
     * getSF()
     *
     * @this {CPU}
     * @return {number} 0 or CPU.PS.SF
     */
    getSF()
    {
        return (this.resultParitySign & 0x80)? CPU.PS.SF : 0;
    }

    /**
     * setSF()
     *
     * @this {CPU}
     */
    setSF()
    {
        if (!this.getSF()) this.resultParitySign ^= 0xc0;
    }

    /**
     * clearIF()
     *
     * @this {CPU}
     */
    clearIF()
    {
        this.regPS &= ~CPU.PS.IF;
    }

    /**
     * getIF()
     *
     * @this {CPU}
     * @return {number} 0 or CPU.PS.IF
     */
    getIF()
    {
        return (this.regPS & CPU.PS.IF);
    }

    /**
     * setIF()
     *
     * @this {CPU}
     */
    setIF()
    {
        this.regPS |= CPU.PS.IF;
    }

    /**
     * getPS()
     *
     * @this {CPU}
     * @return {number}
     */
    getPS()
    {
        return (this.regPS & ~CPU.PS.RESULT) | (this.getSF() | this.getZF() | this.getAF() | this.getPF() | this.getCF());
    }

    /**
     * setPS(regPS)
     *
     * @this {CPU}
     * @param {number} regPS
     */
    setPS(regPS)
    {
        this.resultZeroCarry = this.resultParitySign = this.resultAuxOverflow = 0;
        if (regPS & CPU.PS.CF) this.resultZeroCarry |= 0x100;
        if (!(regPS & CPU.PS.PF)) this.resultParitySign |= 0x01;
        if (regPS & CPU.PS.AF) this.resultAuxOverflow |= 0x10;
        if (!(regPS & CPU.PS.ZF)) this.resultZeroCarry |= 0xff;
        if (regPS & CPU.PS.SF) this.resultParitySign ^= 0xc0;
        this.regPS = (this.regPS & ~(CPU.PS.RESULT | CPU.PS.INTERNAL)) | (regPS & CPU.PS.INTERNAL) | CPU.PS.SET;

    }

    /**
     * getPSW()
     *
     * @this {CPU}
     * @return {number}
     */
    getPSW()
    {
        return (this.getPS() & CPU.PS.MASK) | (this.regA << 8);
    }

    /**
     * setPSW(w)
     *
     * @this {CPU}
     * @param {number} w
     */
    setPSW(w)
    {
        this.setPS((w & CPU.PS.MASK) | (this.regPS & ~CPU.PS.MASK));
        this.regA = w >> 8;
    }

    /**
     * addByte(src)
     *
     * @this {CPU}
     * @param {number} src
     * @return {number} regA + src
     */
    addByte(src)
    {
        this.resultAuxOverflow = this.regA ^ src;
        return this.resultParitySign = (this.resultZeroCarry = this.regA + src) & 0xff;
    }

    /**
     * addByteCarry(src)
     *
     * @this {CPU}
     * @param {number} src
     * @return {number} regA + src + carry
     */
    addByteCarry(src)
    {
        this.resultAuxOverflow = this.regA ^ src;
        return this.resultParitySign = (this.resultZeroCarry = this.regA + src + ((this.resultZeroCarry & 0x100)? 1 : 0)) & 0xff;
    }

    /**
     * andByte(src)
     *
     * Ordinarily, one would expect the Auxiliary Carry flag (AF) to be clear after this operation,
     * but apparently the 8080 will set AF if bit 3 in either operand is set.
     *
     * @this {CPU}
     * @param {number} src
     * @return {number} regA & src
     */
    andByte(src)
    {
        this.resultZeroCarry = this.resultParitySign = this.resultAuxOverflow = this.regA & src;
        if ((this.regA | src) & 0x8) this.resultAuxOverflow ^= 0x10;        // set AF by inverting bit 4 in resultAuxOverflow
        return this.resultZeroCarry;
    }

    /**
     * decByte(b)
     *
     * We perform this operation using 8-bit two's complement arithmetic, by negating and then adding
     * the implied src of 1.  This appears to mimic how the 8080 manages the Auxiliary Carry flag (AF).
     *
     * @this {CPU}
     * @param {number} b
     * @return {number}
     */
    decByte(b)
    {
        this.resultAuxOverflow = b ^ 0xff;
        b = this.resultParitySign = (b + 0xff) & 0xff;
        this.resultZeroCarry = (this.resultZeroCarry & ~0xff) | b;
        return b;
    }

    /**
     * incByte(b)
     *
     * @this {CPU}
     * @param {number} b
     * @return {number}
     */
    incByte(b)
    {
        this.resultAuxOverflow = b;
        b = this.resultParitySign = (b + 1) & 0xff;
        this.resultZeroCarry = (this.resultZeroCarry & ~0xff) | b;
        return b;
    }

    /**
     * orByte(src)
     *
     * @this {CPU}
     * @param {number} src
     * @return {number} regA | src
     */
    orByte(src)
    {
        return this.resultParitySign = this.resultZeroCarry = this.resultAuxOverflow = this.regA | src;
    }

    /**
     * subByte(src)
     *
     * We perform this operation using 8-bit two's complement arithmetic, by inverting src, adding
     * src + 1, and then inverting the resulting carry (resultZeroCarry ^ 0x100).  This appears to mimic
     * how the 8080 manages the Auxiliary Carry flag (AF).
     *
     * This function is also used as a cmpByte() function; compare instructions simply ignore the
     * return value.
     *
     * Example: A=66, SUI $10
     *
     * If we created the two's complement of 0x10 by negating it, there would just be one addition:
     *
     *      0110 0110   (0x66)
     *    + 1111 0000   (0xF0)  (ie, -0x10)
     *      ---------
     *    1 0101 0110   (0x56)
     *
     * But in order to mimic the 8080's AF flag, we must perform the two's complement of src in two steps,
     * inverting it before the add, and then incrementing after the add; eg:
     *
     *      0110 0110   (0x66)
     *    + 1110 1111   (0xEF)  (ie, ~0x10)
     *      ---------
     *    1 0101 0101   (0x55)
     *    + 0000 0001   (0x01)
     *      ---------
     *    1 0101 0110   (0x56)
     *
     * @this {CPU}
     * @param {number} src
     * @return {number} regA - src
     */
    subByte(src)
    {
        src ^= 0xff;
        this.resultAuxOverflow = this.regA ^ src;
        return this.resultParitySign = (this.resultZeroCarry = (this.regA + src + 1) ^ 0x100) & 0xff;
    }

    /**
     * subByteBorrow(src)
     *
     * We perform this operation using 8-bit two's complement arithmetic, using logic similar to subByte(),
     * but changing the final increment to a conditional increment, because if the Carry flag (CF) is set, then
     * we don't need to perform the increment at all.
     *
     * This mimics the behavior of subByte() when the Carry flag (CF) is clear, and hopefully also mimics how the
     * 8080 manages the Auxiliary Carry flag (AF) when the Carry flag (CF) is set.
     *
     * @this {CPU}
     * @param {number} src
     * @return {number} regA - src - carry
     */
    subByteBorrow(src)
    {
        src ^= 0xff;
        this.resultAuxOverflow = this.regA ^ src;
        return this.resultParitySign = (this.resultZeroCarry = (this.regA + src + ((this.resultZeroCarry & 0x100)? 0 : 1)) ^ 0x100) & 0xff;
    }

    /**
     * xorByte(src)
     *
     * @this {CPU}
     * @param {number} src
     * @return {number} regA ^ src
     */
    xorByte(src)
    {
        return this.resultParitySign = this.resultZeroCarry = this.resultAuxOverflow = this.regA ^ src;
    }

    /**
     * getByte(addr)
     *
     * @this {CPU}
     * @param {number} addr is a linear address
     * @return {number} byte (8-bit) value at that address
     */
    getByte(addr)
    {
        return this.busMemory.readData(addr)|0;
    }

    /**
     * getWord(addr)
     *
     * @this {CPU}
     * @param {number} addr is a linear address
     * @return {number} word (16-bit) value at that address
     */
    getWord(addr)
    {
        return this.busMemory.readData(addr) | (this.busMemory.readData(addr + 1) << 8);
    }

    /**
     * setByte(addr, b)
     *
     * @this {CPU}
     * @param {number} addr is a linear address
     * @param {number} b is the byte (8-bit) value to write (which we truncate to 8 bits; required by opSTOSb)
     */
    setByte(addr, b)
    {
        this.busMemory.writeData(addr, b & 0xff);
    }

    /**
     * setWord(addr, w)
     *
     * @this {CPU}
     * @param {number} addr is a linear address
     * @param {number} w is the word (16-bit) value to write (which we truncate to 16 bits to be safe)
     */
    setWord(addr, w)
    {
        this.busMemory.writeData(addr, w & 0xff);
        this.busMemory.writeData(addr + 1, (w >> 8) & 0xff);
    }

    /**
     * getPCByte()
     *
     * @this {CPU}
     * @return {number} byte at the current PC; PC advanced by 1
     */
    getPCByte()
    {
        var b = this.getByte(this.regPC);
        this.setPC(this.regPC + 1);
        return b;
    }

    /**
     * getPCWord()
     *
     * @this {CPU}
     * @return {number} word at the current PC; PC advanced by 2
     */
    getPCWord()
    {
        var w = this.getWord(this.regPC);
        this.setPC(this.regPC + 2);
        return w;
    }

    /**
     * popWord()
     *
     * @this {CPU}
     * @return {number} word popped from the current SP; SP increased by 2
     */
    popWord()
    {
        var w = this.getWord(this.regSP);
        this.setSP(this.regSP + 2);
        return w;
    }

    /**
     * pushWord(w)
     *
     * @this {CPU}
     * @param {number} w is the word (16-bit) value to push at current SP; SP decreased by 2
     */
    pushWord(w)
    {
        this.setSP(this.regSP - 2);
        this.setWord(this.regSP, w);
    }

    /**
     * checkINTR()
     *
     * @this {CPU}
     * @return {boolean} true if execution may proceed, false if not
     */
    checkINTR()
    {
        /*
         * If the Debugger is single-stepping, this.nStepCycles will always be zero, which we take
         * advantage of here to avoid processing interrupts.  The Debugger will have to issue a "g"
         * command (or "p" command on a call instruction) if you want interrupts to be processed.
         */
        if (this.nStepCycles) {
            if ((this.intFlags & CPU.INTFLAG.INTR) && this.getIF()) {
                for (var nLevel = 0; nLevel < 8; nLevel++) {
                    if (this.intFlags & (1 << nLevel)) break;
                }
                this.clearINTR(nLevel);
                this.clearIF();
                this.intFlags &= ~CPU.INTFLAG.HALT;
                this.aOps[CPU.OPCODE.RST0 | (nLevel << 3)].call(this);
            }
        }
        if (this.intFlags & CPU.INTFLAG.HALT) {
            /*
             * As discussed in opHLT(), the CPU is never REALLY halted by a HLT instruction; instead, opHLT()
             * calls requestHALT(), which sets INTFLAG.HALT and signals to stepCPU() that it's free to end the
             * current burst AND that it should not execute any more instructions until
             * () indicates
             * that a hardware interrupt has been requested.
             */
            this.time.endBurst();
            return false;
        }
        return true;
    }

    /**
     * clearINTR(nLevel)
     *
     * Clear the corresponding interrupt level.
     *
     * nLevel can either be a valid interrupt level (0-7), or -1 to clear all pending interrupts
     * (eg, in the event of a system-wide reset).
     *
     * @this {CPU}
     * @param {number} nLevel (0-7, or -1 for all)
     */
    clearINTR(nLevel)
    {
        var bitsClear = nLevel < 0? 0xff : (1 << nLevel);
        this.intFlags &= ~bitsClear;
    }

    /**
     * requestHALT()
     *
     * @this {CPU}
     */
    requestHALT()
    {
        this.intFlags |= CPU.INTFLAG.HALT;
        this.time.endBurst();
    }

    /**
     * requestINTR(nLevel)
     *
     * Request the corresponding interrupt level.
     *
     * Each interrupt level (0-7) has its own intFlags bit (0-7).  If the Interrupt Flag (IF) is also
     * set, then we know that checkINTR() will want to issue the interrupt, so we end the current burst
     * by setting nStepCycles to zero.  But before we do, we subtract nStepCycles from nBurstCycles,
     * so that the calculation of how many cycles were actually executed on this burst is correct.
     *
     * @this {CPU}
     * @param {number} nLevel (0-7)
     */
    requestINTR(nLevel)
    {
        this.intFlags |= (1 << nLevel);
        if (this.getIF()) {
            this.time.endBurst();
        }
    }

    /**
     * toString(options)
     *
     * @this {CPU}
     * @param {string} [options]
     * @returns {string}
     */
    toString(options = "")
    {
        let s = this.sprintf("PC=%#0X\n", this.regPC);
        return s;
    }

    /**
     * updateStatus(fTransition)
     *
     * Enumerate all bindings and update their values.
     *
     * Called by Time's updateStatus() function whenever 1) its YIELDS_PER_UPDATE threshold is reached
     * (default is twice per second), 2) a step() operation has just finished (ie, the device is being
     * single-stepped), and 3) a start() or stop() transition has occurred.
     *
     * @this {CPU}
     * @param {boolean} [fTransition]
     */
    updateStatus(fTransition)
    {
    }
}

/*
 * CPU model numbers (supported); future supported models could include the Z80.
 */
 CPU.MODEL_8080 = 8080;

/*
 * This constant is used to mark points in the code where the physical address being returned
 * is invalid and should not be used.
 */
CPU.ADDR_INVALID = undefined;

/*
 * Processor Status flag definitions (stored in regPS)
 */
CPU.PS = {
    CF:     0x0001,     // bit 0: Carry Flag
    BIT1:   0x0002,     // bit 1: reserved, always set
    PF:     0x0004,     // bit 2: Parity Flag
    BIT3:   0x0008,     // bit 3: reserved, always clear
    AF:     0x0010,     // bit 4: Auxiliary Carry Flag
    BIT5:   0x0020,     // bit 5: reserved, always clear
    ZF:     0x0040,     // bit 6: Zero Flag
    SF:     0x0080,     // bit 7: Sign Flag
    ALL:    0x00D5,     // all "arithmetic" flags (CF, PF, AF, ZF, SF)
    MASK:   0x00FF,     //
    IF:     0x0200      // bit 9: Interrupt Flag (set if interrupts enabled; Intel calls this the INTE bit)
};

/*
 * These are the internal PS bits (outside of PS.MASK) that getPS() and setPS() can get and set,
 * but which cannot be seen with any of the documented instructions.
 */
CPU.PS.INTERNAL = CPU.PS.IF;

/*
 * PS "arithmetic" flags are NOT stored in regPS; they are maintained across separate result registers,
 * hence the RESULT designation.
 */
CPU.PS.RESULT   = CPU.PS.CF | CPU.PS.PF | CPU.PS.AF | CPU.PS.ZF | CPU.PS.SF;

/*
 * These are the "always set" PS bits for the 8080.
 */
CPU.PS.SET      = CPU.PS.BIT1;

CPU.PARITY = [          // 256-byte array with a 1 wherever the number of set bits of the array index is EVEN
    1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
    0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
    0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
    1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
    0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
    1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
    0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
    0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
    1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
    0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
    1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
    0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
    0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
    1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1
];

/*
 * Interrupt-related flags (stored in intFlags)
 */
CPU.INTFLAG = {
    NONE:   0x0000,
    INTR:   0x00ff,     // mask for 8 bits, representing interrupt levels 0-7
    HALT:   0x0100      // halt requested; see opHLT()
};

/*
 * Opcode definitions
 */
CPU.OPCODE = {
    HLT:    0x76,       // Halt
    ACI:    0xCE,       // Add with Carry Immediate (affects PS.ALL)
    CALL:   0xCD,       // Call
    RST0:   0xC7
    // to be continued....
};

CPU.COMMANDS = [
    "e [addr] ...\tedit memory",
    "g [addr]\trun (to addr)",
    "h\t\thalt",
    "r[a]\t\tdump (all) registers",
    "t [n]\t\tstep (n instructions)",
    "u [addr] [n]\tdisassemble (at addr)"
];

/**
 * @copyright https://www.pcjs.org/modules/devices/machine.js (C) Jeff Parsons 2012-2019
 */

/**
 * @class {Machine}
 * @unrestricted
 * @property {CPU} cpu
 * @property {string} sConfigFile
 * @property {boolean} fConfigLoaded
 * @property {boolean} fPageLoaded
 */
class Machine extends Device {
    /**
     * Machine(idMachine, sConfig)
     *
     * If sConfig contains a JSON object definition, then we parse it immediately and save the result in this.config;
     * otherwise, we assume it's the URL of an JSON object definition, so we request the resource, and once it's loaded,
     * we parse it.
     *
     * One important change in v2: the order of the device objects in the JSON file determines creation/initialization order.
     * In general, the Machine object should always be first (it's always created first anyway), and the Time object should
     * be listed next, so that its services are available to any other device when they're created/initialized.
     *
     * Sample config:
     *
     *    {
     *      "ti57": {
     *        "class": "Machine",
     *        "type": "TI57",
     *        "name": "TI-57 Programmable Calculator Simulation",
     *        "version": 1.10,
     *        "autoStart": true,
     *        "autoRestore": true,
     *        "bindings": {
     *          "clear": "clearTI57",
     *          "print": "printTI57"
     *        }
     *      },
     *      "clock": {
     *        "class": "Time",
     *        "cyclesPerSecond": 650000
     *        "bindings": {
     *          "run": "runTI57",
     *          "speed": "speedTI57",
     *          "step": "stepTI57"
     *        },
     *        "overrides": ["cyclesPerSecond"]
     *      },
     *      "display": {
     *        "class": "LED",
     *        "type": 3,
     *        "cols": 12,
     *        "rows": 1,
     *        "color": "red",
     *        "bindings": {
     *          "container": "displayTI57"
     *        },
     *        "overrides": ["color","backgroundColor"]
     *      },
     *      "buttons": {
     *        "class": "Input",
     *        "map": [
     *          ["2nd",  "inv",  "lnx",  "\\b",  "clr"],
     *          ["lrn",  "xchg", "sq",   "sqrt", "rcp"],
     *          ["sst",  "sto",  "rcl",  "sum",  "exp"],
     *          ["bst",  "ee",   "(",    ")",    "/"],
     *          ["gto",  "7",    "8",    "9",    "*"],
     *          ["sbr",  "4",    "5",    "6",    "-"],
     *          ["rst",  "1",    "2",    "3",    "+"],
     *          ["r/s",  "0",    ".",    "+/-",  "=|\\r"]
     *        ],
     *        "location": [139, 325, 368, 478, 0.34, 0.5, 640, 853, 418, 180, 75, 36],
     *        "bindings": {
     *          "surface": "imageTI57",
     *          "power": "powerTI57",
     *          "reset": "resetTI57"
     *        }
     *      },
     *      "rom": {
     *        "class": "ROM",
     *        "wordSize": 13,
     *        "valueSize": 16,
     *        "valueTotal": 2048,
     *        "littleEndian": true,
     *        "file": "ti57le.bin",
     *        "reference": "",
     *        "values": [
     *        ]
     *      },
     *      "cpu": {
     *        "class": "CPU",
     *        "type": "TMS-1500",
     *        "input": "buttons",
     *        "output": "display"
     *      }
     *    }
     *
     * @this {Machine}
     * @param {string} idMachine (of both the machine AND the <div> to contain it)
     * @param {string} sConfig (JSON configuration for entire machine, including any static resources)
     */
    constructor(idMachine, sConfig)
    {
        super(idMachine, idMachine);

        let machine = this;
        this.cpu = null;
        this.sConfigFile = "";
        this.fConfigLoaded = this.fPageLoaded = false;

        sConfig = sConfig.trim();

        if (sConfig[0] == '{') {
            this.loadConfig(sConfig);
        } else {
            this.sConfigFile = sConfig;
            this.getResource(this.sConfigFile, function onLoadConfig(sURL, sResource, readyState, nErrorCode) {
                if (readyState == 4) {
                    if (!nErrorCode && sResource) {
                        machine.loadConfig(sResource);
                        machine.initDevices();
                    }
                    else {
                        machine.printf("Error (%d) loading configuration: %s\n", nErrorCode, sURL);
                    }
                }
            });
        }

        /*
         * Device initialization is now deferred until after the page is fully loaded, for the benefit
         * of devices (eg, Input) that may be dependent on page resources.
         *
         * Strangely, for these page events, I must use the window object rather than the document object.
         */
        window.addEventListener('load', function onLoadPage(event) {
            machine.fPageLoaded = true;
            machine.initDevices();
        });
        let sEvent = this.isUserAgent("iOS")? 'pagehide' : (this.isUserAgent("Opera")? 'unload' : undefined);
        window.addEventListener(sEvent || 'beforeunload', function onUnloadPage(event) {
            machine.killDevices();
        });
    }

    /**
     * initDevices()
     *
     * Initializes devices in the proper order.  For example, any Time devices should be initialized first,
     * to ensure that their timer services are available to other devices.
     *
     * @this {Machine}
     */
    initDevices()
    {
        if (this.fConfigLoaded && this.fPageLoaded) {
            for (let idDevice in this.config) {
                let device, sClass;
                try {
                    let config = this.config[idDevice], sStatus = "";
                    sClass = config['class'];
                    if (!Machine.CLASSES[sClass]) {
                        this.printf("unrecognized '%s' device class: %s\n", idDevice, sClass);
                    }
                    else if (sClass == Machine.CLASS.MACHINE) {
                        this.printf("PCjs %s v%3.2f\n%s\n%s\n", config['name'], +VERSION, Machine.COPYRIGHT, Machine.LICENSE);
                        if (this.sConfigFile) this.printf("Configuration: %s\n", this.sConfigFile);
                    } else {
                        device = new Machine.CLASSES[sClass](this.idMachine, idDevice, config);
                        if (sClass == Machine.CLASS.CPU || sClass == Machine.CLASS.CHIP) {
                            if (!this.cpu) {
                                this.cpu = device;
                            } else {
                                this.printf("too many CPU devices: %s\n", idDevice);
                                continue;
                            }
                        }
                        this.printf("%s device: %s\n", sClass, device.status);
                    }
                }
                catch (err) {
                    this.printf("error initializing '%s' device class %s: %s\n", idDevice, sClass, err.message);
                    this.removeDevice(idDevice);
                }
            }
            let cpu = this.cpu;
            if (cpu) {
                if (cpu.onLoad && this.fAutoRestore) cpu.onLoad();
                if (cpu.onPower && this.fAutoStart) cpu.onPower(true);
            }
        }
    }

    /**
     * killDevices()
     *
     * @this {Machine}
     */
    killDevices()
    {
        let cpu;
        if ((cpu = this.cpu)) {
            if (cpu.onSave) cpu.onSave();
            if (cpu.onPower) cpu.onPower(false);
        }

    }

    /**
     * loadConfig(sConfig)
     *
     * @this {Machine}
     * @param {string} sConfig
     */
    loadConfig(sConfig)
    {
        try {
            this.config = JSON.parse(sConfig);
            let config = this.config[this.idMachine];
            this.checkConfig(config);
            this.checkMachine(config);
            this.fAutoStart = (config['autoStart'] !== false);
            this.fAutoRestore = (config['autoRestore'] !== false);
            this.fConfigLoaded = true;
        } catch(err) {
            let sError = err.message;
            let match = sError.match(/position ([0-9]+)/);
            if (match) {
                sError += " ('" + sConfig.substr(+match[1], 40).replace(/\s+/g, ' ') + "...')";
            }
            this.println("machine '" + this.idMachine + "' initialization error: " + sError);
        }
    }
}

Machine.CLASS = {
    BUS:        "Bus",
    CPU:        "CPU",
    CHIP:       "Chip",         // Chip is really just an alias for CPU, for use with simpler devices
    DEBUGGER:   "Debugger",
    INPUT:      "Input",
    LED:        "LED",
    MACHINE:    "Machine",
    MEMORY:     "Memory",
    RAM:        "RAM",
    ROM:        "ROM",
    TIME:       "Time",
    VIDEO:      "Video"
};

Machine.CLASSES = {};

if (typeof Bus != "undefined") Machine.CLASSES[Machine.CLASS.BUS] = Bus;
if (typeof CPU != "undefined") Machine.CLASSES[Machine.CLASS.CPU] = CPU;
if (typeof Chip != "undefined") Machine.CLASSES[Machine.CLASS.CHIP] = Chip;
if (typeof Debugger != "undefined") Machine.CLASSES[Machine.CLASS.DEBUGGER] = Debugger;
if (typeof Input != "undefined") Machine.CLASSES[Machine.CLASS.INPUT] = Input;
if (typeof LED != "undefined") Machine.CLASSES[Machine.CLASS.LED] = LED;
if (typeof Machine != "undefined") Machine.CLASSES[Machine.CLASS.MACHINE] = Machine;
if (typeof Memory != "undefined") Machine.CLASSES[Machine.CLASS.MEMORY] = Memory;
if (typeof RAM != "undefined") Machine.CLASSES[Machine.CLASS.RAM] = RAM;
if (typeof ROM != "undefined") Machine.CLASSES[Machine.CLASS.ROM] = ROM;
if (typeof Time != "undefined") Machine.CLASSES[Machine.CLASS.TIME] = Time;
if (typeof Video != "undefined") Machine.CLASSES[Machine.CLASS.VIDEO] = Video;

Machine.COPYRIGHT = "Copyright © 2012-2019 Jeff Parsons <Jeff@pcjs.org>";
Machine.LICENSE = "License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>";

/*
 * If we're running a compiled version, create the designated FACTORY function.
 *
 * If we're NOT running a compiled version (ie, FACTORY wasn't overriden), create hard-coded aliases for all known factories;
 * only DEBUG servers should be running uncompiled code.
 */
window[FACTORY] = function(idMachine, sConfig) {
    return new Machine(idMachine, sConfig);
};

if (FACTORY == "Machine") {
    window['Invaders'] = window[FACTORY];
    window['LEDs'] = window[FACTORY];
    window['TMS1500'] = window[FACTORY];
}
