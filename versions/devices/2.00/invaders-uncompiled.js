"use strict";

/**
 * @copyright https://www.pcjs.org/modules/devices/lib/defs.js (C) Jeff Parsons 2012-2019
 */

/**
 * COMMAND is the default name of the global command handler we will define, to provide
 * the same convenient access to all the WebIO COMMAND handlers that the Debugger enjoys.
 *
 * @define {string}
 */
var COMMAND = "command";

/**
 * COMPILED is false by default; overridden with true in the Closure Compiler release.
 *
 * @define {boolean}
 */
var COMPILED = false;

/**
 * DEBUG is true by default, enabling assertions and other runtime checks; overridden with false
 * in the Closure Compiler release, which generally results in the removal of any DEBUG code.  Our
 * gulpfile, however, takes the extra precaution of physically removing all "assert" method calls
 * from the concatenated file that is generated for the Closure Compiler.
 *
 * @define {boolean}
 */
var DEBUG = true;

/**
 * FACTORY is "Machine" by default; overridden with the machine's "factory" string in machines.json
 * to ensure unique factories.
 *
 * @define {string}
 */
var FACTORY = "Machine";

/**
 * MAXDEBUG is false by default; overridden with false in the Closure Compiler release.  Set it to
 * true to manually to enable any hyper-aggressive DEBUG checks.
 *
 * @define {boolean}
 */
var MAXDEBUG = false;

/**
 * VERSION is the current PCjs Project release number, updated somewhat arbitrarily and usually only after
 * significant changes.  It will be overriden the machine's "version" string in machines.json.
 *
 * @define {string}
 */
var VERSION = "2.00";

/*
 * The following globals CANNOT be overridden.
 *
 * LITTLE_ENDIAN is true if the browser's ArrayBuffer storage is little-endian.  If LITTLE_ENDIAN matches
 * the endian-ness of a machine being emulated, then that machine can use ArrayBuffers for Memory buffers as-is.
 */
var LITTLE_ENDIAN = function() {
    let buffer = new ArrayBuffer(2);
    new DataView(buffer).setUint16(0, 256, true);
    return new Uint16Array(buffer)[0] === 256;
}();

/*
 * RS-232 DB-25 Pin Definitions, mapped to bits 1-25 in a 32-bit status value.
 *
 * Serial devices in PCjs machines are considered DTE (Data Terminal Equipment), which means they should be "virtually"
 * connected to each other via a null-modem cable, which assumes the following cross-wiring:
 *
 *     G       1  <->  1        G       (Ground)
 *     TD      2  <->  3        RD      (Received Data)
 *     RD      3  <->  2        TD      (Transmitted Data)
 *     RTS     4  <->  5        CTS     (Clear To Send)
 *     CTS     5  <->  4        RTS     (Request To Send)
 *     DSR   6+8  <->  20       DTR     (Data Terminal Ready)
 *     SG      7  <->  7        SG      (Signal Ground)
 *     DTR    20  <->  6+8      DSR     (Data Set Ready + Carrier Detect)
 *     RI     22  <->  22       RI      (Ring Indicator)
 *
 * TODO: Move these definitions to a more appropriate shared file at some point.
 */
var RS232 = {
    RTS: {
        PIN:  4,
        MASK: 0x00000010
    },
    CTS: {
        PIN:  5,
        MASK: 0x00000020
    },
    DSR: {
        PIN:  6,
        MASK: 0x00000040
    },
    CD: {
        PIN:  8,
        MASK: 0x00000100
    },
    DTR: {
        PIN:  20,
        MASK: 0x00100000
    },
    RI: {
        PIN:  22,
        MASK: 0x00400000
    }
};

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

Defs.CLASSES = {};
Defs.CLASSES["Defs"] = Defs;

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
     * parseDIPSwitches(sws, switchesDefault)
     *
     * @this {NumIO}
     * @param {string} sws (eg, "00000000", where sws[0] is DIP0, sws[1] is DIP1, etc.)
     * @param {number} [switchesDefault] (use -1 to parse sws as a mask: 0 for any non-digit character)
     * @return {number|undefined}
     */
    parseDIPSwitches(sws, switchesDefault)
    {
        let switches;
        if (!sws) {
            switches = switchesDefault;
        } else {
            /*
             * NOTE: It's not convenient to use parseInt() with a base of 2, in part because both bit order
             * and bit sense are reversed, but also because we use this function to parse switch masks, which
             * contain non-digits.  See the "switches" defined in invaders.json for examples.
             */
            switches = 0;
            let bit = 0x1;
            for (let i = 0; i < sws.length; i++) {
                let ch = sws.charAt(i);
                if (switchesDefault == -1) {
                    switches |= (ch != '0' && ch != '1'? 0 : bit);
                }
                else {
                    switches |= (ch == '0'? bit : 0);
                }
                bit <<= 1;
            }
        }
        return switches;
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
     * toBase(n, base, bits, prefix, nGrouping)
     *
     * Converts the given number (as an unsigned integer) to a string using the specified base (radix).
     *
     * sprintf() may be a better choice, depending on your needs (eg, signed integers, formatting options, etc.)
     * and support for the desired radix (eg, 8, 10, and 16).
     *
     * @this {NumIO}
     * @param {number|*} n
     * @param {number} [base] (ie, the radix; 0 or undefined for default)
     * @param {number} [bits] (the number of bits in the value, 0 for variable)
     * @param {string} [prefix] (prefix is based on radix; use "" for none)
     * @param {number} [nGrouping]
     * @return {string}
     */
    toBase(n, base, bits = 0, prefix = undefined, nGrouping = 0)
    {
        /*
         * We can't rely entirely on isNaN(), because isNaN(null) returns false, and we can't rely
         * entirely on typeof either, because typeof NaN returns "number".  Sigh.
         *
         * Alternatively, we could mask and shift n regardless of whether it's null/undefined/NaN,
         * since JavaScript coerces such operands to zero, but I think there's "value" in seeing those
         * values displayed differently.
         */
        let s = "", suffix = "", cch = -1;
        if (!base) base = this.nDefaultBase || 10;
        if (bits) cch = Math.ceil(bits / Math.log2(base));
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
            n = undefined;
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
             * Negative values should be twos-complemented to produce a positive value for conversion purposes,
             * but we can only do that if/when we're given the number of bits; Math.pow(base, cch) is equivalent
             * to Math.pow(2, bits), but less precise for bases that aren't a power of two (eg, base 10).
             */
            if (bits) {
                if (n < 0) {
                    n += Math.pow(2, bits);
                }
                if (n >= Math.pow(2, bits)) {
                    cch = Math.ceil(Math.log(n) / Math.log(base));
                }
            }
        }
        let g = nGrouping || -1;
        while (cch--) {
            if (!g) {
                s = ',' + s;
                g = nGrouping;
            }
            if (n == undefined) {
                s = '?' + s;
                if (cch < 0) break;
            } else {
                let d = n % base;
                n = Math.trunc(n / base);
                d += (d >= 0 && d <= 9? 0x30 : 0x41 - 10);
                s = String.fromCharCode(d) + s;
                if (!n && cch < 0) break;
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

    /**
     * compress(aSrc)
     *
     * Compresses an array of numbers.
     *
     * @this {NumIO}
     * @param {Array|Uint8Array} aSrc
     * @return {Array|Uint8Array} is either the original array (aSrc), or a smaller array of "count, value" pairs (aComp)
     */
    compress(aSrc)
    {
        let iSrc = 0;
        let iComp = 0;
        let aComp = [];
        while (iSrc < aSrc.length) {
            let n = aSrc[iSrc];

            let iCompare = iSrc + 1;
            while (iCompare < aSrc.length && aSrc[iCompare] === n) iCompare++;
            aComp[iComp++] = iCompare - iSrc;
            aComp[iComp++] = n;
            iSrc = iCompare;
        }
        if (aComp.length >= aSrc.length) return aSrc;
        return aComp;
    }

    /**
     * decompress(aComp, length)
     *
     * Decompresses an array of numbers.
     *
     * @this {NumIO}
     * @param {Array} aComp
     * @param {number} [length] (expected length of decompressed data)
     * @return {Array}
     */
    decompress(aComp, length = 0)
    {
        if (aComp.length == length) return aComp;
        let iDst = 0;
        let aDst = length? new Array(length) : [];
        let iComp = 0;
        while (iComp < aComp.length - 1) {
            let c = aComp[iComp++];
            let n = aComp[iComp++];
            while (c--) aDst[iDst++] = n;
        }

        return aDst;
    }
}

/*
 * Assorted constants
 */
NumIO.TWO_POW32 = Math.pow(2, 32);

Defs.CLASSES["NumIO"] = NumIO;

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
     * In general, you should use this instead of new Date(), because the Date constructor implicitly calls
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
     * @return {number}
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
        return s.length;
    }

    /**
     * println(s, fBuffer)
     *
     * @this {StdIO}
     * @param {string} s
     * @param {boolean} [fBuffer] (true to always buffer; otherwise, only buffer the last partial line)
     * @return {number}
     */
    println(s, fBuffer)
    {
        return this.print(s + '\n', fBuffer);
    }

    /**
     * printf(format, ...args)
     *
     * @this {StdIO}
     * @param {string} format
     * @param {...} [args]
     * @return {number}
     */
    printf(format, ...args)
    {
        return this.print(this.sprintf(format, ...args));
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
     * @param {...} [args]
     * @return {string}
     */
    sprintf(format, ...args)
    {
        let buffer = "";
        let aParts = format.split(/%([-+ 0#]*)([0-9]*|\*|~)(\.[0-9]+|)([hlL]?)([A-Za-z%])/);

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
            let hash = flags.indexOf('#') >= 0;
            let zeroPad = flags.indexOf('0') >= 0;
            let width = aParts[iPart+2];
            if (width == '*' || width == '~') {
                /*
                 * The '~' width character is my own innovation that interprets the width value as a number of bits,
                 * which must then be converted to a number of characters; currently that calculation is only correct
                 * for hexadecimal output.  TODO: Add base-independent bits-to-characters conversion logic.
                 */
                width = (width == '~'? ((arg >> 2) + (hash && (type == 'x' || type == 'X')? 2 : 0)) : arg);
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
                arg = +arg;
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
                    if (v <= 0xff) {
                        width = 2;
                    } else if (v <= 0xffff) {
                        width = 4;
                    } else if (v <= 0xffffffff) {
                        width = 8;
                    } else {
                        width = 9;
                    }
                    width += prefix.length;
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

Defs.CLASSES["StdIO"] = StdIO;

/**
 * @copyright https://www.pcjs.org/modules/devices/lib/webio.js (C) Jeff Parsons 2012-2019
 */

/*
 * List of standard message groups.  The messages properties defines the set of active message
 * groups, and their names are defined by MESSAGE_NAMES.  See the Device class for more message
 * group definitions.
 *
 * NOTE: To support more than 32 message groups, be sure to use "+", not "|", when concatenating.
 */
var MESSAGE = {
    ALL:        0xffffffffffff,
    NONE:       0x000000000000,
    DEFAULT:    0x000000000000,
    BUFFER:     0x800000000000,
};

/** @typedef {{ class: (string|undefined), bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined) }} */
var Config;

/**
 * @class {WebIO}
 * @unrestricted
 * @property {Object} bindings
 * @property {number} messages
 * @property {WebIO} machine
 */
class WebIO extends StdIO {
    /**
     * WebIO(isMachine)
     *
     * @this {WebIO}
     * @param {boolean} isMachine
     */
    constructor(isMachine)
    {
        super();
        this.bindings = {};
        this.messages = 0;
        /*
         * If this is the machine device, initialize a set of per-machine variables; if it's not,
         * the Device constructor will update this.machine with the actual machine device (see addDevice()).
         */
        this.machine = this;
        if (isMachine) {
            this.machine.messages = 0;
            this.machine.aCommands = [];
            this.machine.iCommand = 0;
            this.machine.handlers = {};
            this.machine.isFullScreen = false;
        }
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
        let webIO = this;

        switch (binding) {

        case WebIO.BINDING.CLEAR:
            element.onclick = function onClickClear() {
                webIO.clear();
            };
            break;

        case WebIO.BINDING.PRINT:
            /*
             * This was added for Firefox (Safari will clear the <textarea> on a page reload, but Firefox does not).
             */
            this.disableAuto(element);
            /*
             * An onKeyDown handler has been added to this element to intercept special (non-printable) keys, such as
             * the UP and DOWN arrow keys, which are used to implement a simple command history/recall feature.
             */
            element.addEventListener(
                'keydown',
                function onKeyDown(event) {
                    webIO.onCommandEvent(event, true);
                }
            );
            /*
             * One purpose of the onKeyPress handler for this element is to stop event propagation, so that if the
             * element has been explicitly given focus, any key presses won't be picked up by the Input device (which,
             * as that device's constructor explains, is monitoring key presses for the entire document).
             *
             * The other purpose is to support the entry of commands and pass them on to parseCommands().
             */
            element.addEventListener(
                'keypress',
                function onKeyPress(event) {
                    webIO.onCommandEvent(event);
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
     * @param {Object} [bindings]
     */
    addBindings(bindings = {})
    {
        let fDirectBindings = Array.isArray(bindings);
        /*
         * To relieve every device from having to explicitly declare its own container, we set up a default.
         */
        if (!bindings['container']) {
            bindings['container'] = this.idDevice;
        }
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
            if (MAXDEBUG && !fDirectBindings && id != this.idDevice) {
                this.printf("unable to find element '%s' for device '%s'\n", id, this.idDevice);
            }
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
     * addHandler(type, func)
     *
     * @this {WebIO}
     * @param {string} type
     * @param {function(Array.<string>)} func
     */
    addHandler(type, func)
    {
        if (!this.machine.handlers[type]) this.machine.handlers[type] = [];
        this.machine.handlers[type].push(func);
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
     * assert(f, format, args)
     *
     * Verifies conditions that must be true (for DEBUG builds only).
     *
     * The Closure Compiler should automatically remove all references to assert() in non-DEBUG builds.
     *
     * TODO: Add a task to the build process that "asserts" there are no instances of "assertion failure" in RELEASE builds.
     *
     * @this {WebIO}
     * @param {*} f is the expression asserted to be true
     * @param {string} [format] is an optional description of the assertion failure
     * @param {...} [args]
     */
    assert(f, format, ...args)
    {
        if (DEBUG) {
            if (!f) {
                throw new Error(format? this.sprintf(format, ...args) : "assertion failure");
            }
        }
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
     * disableAuto(element)
     *
     * @this {WebIO}
     * @param {Element} element
     */
    disableAuto(element)
    {
        element.value = "";
        element.setAttribute("autocapitalize", "off");
        element.setAttribute("autocomplete", "off");
        element.setAttribute("autocorrect", "off");
        element.setAttribute("spellcheck", "false");
    }

    /**
     * findBinding(name, all)
     *
     * @this {WebIO}
     * @param {string} [name]
     * @param {boolean} [all]
     * @return {Element|null|undefined}
     */
    findBinding(name, all)
    {
        return this.bindings[name];
    }

    /**
     * findHandlers(type)
     *
     * @this {WebIO}
     * @param {string} type
     * @return {Array.<function(Array.<string>)>|undefined}
     */
    findHandlers(type)
    {
        return this.machine.handlers[type];
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
            do {
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
                if (sProp.indexOf("screen") < 0) break;
                sProp = sProp.replace("screen", "Screen");
            } while (true);
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
     * @return {string|undefined}
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
        let text;
        let element = this.bindings[name];
        if (element) text = element.textContent;
        return text;
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
     * @return {number} (updated n)
     */
    getBounded(n, min, max)
    {

        n = +n || 0;
        if (n < min) n = min;
        if (n > max) n = max;
        return n;
    }

    /**
     * getDefault(idConfig, defaultValue, mappings)
     *
     * @this {WebIO}
     * @param {string} idConfig
     * @param {*} defaultValue
     * @param {Object} [mappings] (used to provide optional user-friendly mappings for values)
     * @return {*}
     */
    getDefault(idConfig, defaultValue, mappings)
    {
        let value = this.config[idConfig];
        if (value === undefined) {
            value = defaultValue;
        } else {
            if (mappings && mappings[value] !== undefined) {
                value = mappings[value];
            }
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
     * @return {boolean}
     */
    getDefaultBoolean(idConfig, defaultValue)
    {
        return /** @type {boolean} */ (this.getDefault(idConfig, defaultValue));
    }

    /**
     * getDefaultNumber(idConfig, defaultValue, mappings)
     *
     * @this {WebIO}
     * @param {string} idConfig
     * @param {number} defaultValue
     * @param {Object} [mappings]
     * @return {number}
     */
    getDefaultNumber(idConfig, defaultValue, mappings)
    {
        return /** @type {number} */ (this.getDefault(idConfig, defaultValue, mappings));
    }

    /**
     * getDefaultString(idConfig, defaultValue)
     *
     * @this {WebIO}
     * @param {string} idConfig
     * @param {string} defaultValue
     * @return {string}
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
     * readyState comes from the request's 'readyState' property, and the operation should not be
     * considered complete until readyState is 4.
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
     * @return {Object} containing properties for each parameter found
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
                     * returns only parameters, if any (starting with the '?', which we skip over with a substr() call).
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
     * @return {boolean}
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
     * If messages is MESSAGE.DEFAULT (0), then the device's default message group(s) are used,
     * and if it's MESSAGE.ALL (-1), then the message is always displayed, regardless what's enabled.
     *
     * @this {WebIO}
     * @param {number} [messages] is zero or more MESSAGE flags
     * @return {boolean} true if all specified message enabled, false if not
     */
    isMessageOn(messages = 0)
    {
        if (messages > 1 && (messages % 2)) messages--;
        messages = messages || this.messages;
        if ((messages|1) == -1 || this.testBits(this.machine.messages, messages)) {
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
     * 2019-10-26: Apple has pulled a similar stunt in iPadOS 13, trying to pretend that Safari on iPadOS is
     * indistinguishable from the desktop version.  Except that there are still situations where we need to know the
     * difference (eg, when there's only a soft keyboard as opposed to a dedicated keyboard).  See monitor.js for details.
     *
     * @this {WebIO}
     * @param {string} s is a substring to search for in the user-agent; as noted above, "iOS" and "MSIE" are special values
     * @return {boolean} is true if the string was found, false if not
     */
    isUserAgent(s)
    {
        if (window) {
            let userAgent = window.navigator.userAgent;
            return s == "iOS" && (!!userAgent.match(/(iPod|iPhone|iPad)/) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)) || s == "MSIE" && !!userAgent.match(/(MSIE|Trident)/) || (userAgent.indexOf(s) >= 0);
        }
        return false;
    }

    /**
     * loadLocalStorage()
     *
     * @this {WebIO}
     * @return {Array|null}
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
     * onCommandEvent(event, down)
     *
     * @this {WebIO}
     * @param {Event} event
     * @param {boolean} [down] (true if keydown, false if keyup, undefined if keypress)
     */
    onCommandEvent(event, down)
    {
        event = event || window.event;
        let keyCode = event.which || event.keyCode;
        if (keyCode) {
            let machine = this.machine;
            let element = /** @type {HTMLTextAreaElement} */ (event.target);
            if (down) {
                let consume = false, s;
                let text = element.value;
                let i = text.lastIndexOf('\n');
                /*
                * Checking for BACKSPACE is not as important as the UP and DOWN arrows, but it's helpful to ensure
                * that BACKSPACE only erases characters on the final line; consume it otherwise.
                */
                if (keyCode == WebIO.KEYCODE.BS) {
                    if (element.selectionStart <= i + 1) {
                        consume = true;
                    }
                }
                if (keyCode == WebIO.KEYCODE.UP) {
                    consume = true;
                    if (machine.iCommand > 0) {
                        s = machine.aCommands[--machine.iCommand];
                    }
                }
                else if (keyCode == WebIO.KEYCODE.DOWN) {
                    consume = true;
                    if (machine.iCommand < machine.aCommands.length) {
                        s = machine.aCommands[++machine.iCommand] || "";
                    }
                }
                if (consume) event.preventDefault();
                if (s != undefined) {
                    element.value = text.substr(0, i + 1) + s;
                }
            }
            else {
                let charCode = keyCode;
                let char = String.fromCharCode(charCode);
                /*
                 * Move the caret to the end of any text in the textarea, unless it's already
                 * past the final LF (because it's OK to insert characters on the last line).
                 */
                let text = element.value;
                let i = text.lastIndexOf('\n');
                if (element.selectionStart <= i) {
                    element.setSelectionRange(text.length, text.length);
                }
                /*
                 * Don't let the Input device's document-based keypress handler see any key presses
                 * that came to this element first.
                 */
                event.stopPropagation();
                /*
                 * If '@' is pressed as the first character on the line, then append the last command
                 * that parseCommands() processed, and transform '@' into ENTER.
                 */
                if (char == '@' && machine.iCommand > 0) {
                    if (i + 1 == text.length) {
                        element.value += machine.aCommands[--machine.iCommand];
                        char = '\r';
                    }
                }
                /*
                 * On the ENTER key, call parseCommands() to look for any COMMAND handlers and invoke
                 * them until one of them returns true.
                 *
                 * Note that even though new lines are entered with the ENTER (CR) key, which uses
                 * ASCII character '\r' (aka RETURN aka CR), new lines are stored in the text buffer
                 * as ASCII character '\n' (aka LINEFEED aka LF).
                 */
                if (char == '\r') {
                    /*
                     * At the time we call any command handlers, a LINEFEED will not yet have been
                     * appended to the text, so for consistency, we prevent the default behavior and
                     * add the LINEFEED ourselves.  Unfortunately, one side-effect is that we must
                     * go to some extra effort to ensure the cursor remains in view; hence the stupid
                     * blur() and focus() calls.
                     */
                    event.preventDefault();
                    text = (element.value += '\n');
                    element.blur();
                    element.focus();
                    let i = text.lastIndexOf('\n', text.length - 2);
                    let commands = text.slice(i + 1, -1) || "";
                    let result = this.parseCommands(commands);
                    if (result) this.println(result.replace(/\n$/, ""), false);
                }
            }
        }
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
     * parseBoolean(token)
     *
     * @this {WebIO}
     * @param {string} token (true if token is "on" or "true", false if "off" or "false", undefined otherwise)
     * @return {boolean|undefined}
     */
    parseBoolean(token)
    {
        return (token == "true" || token == "on"? true : (token == "false" || token == "off"? false : undefined));
    }

    /**
     * parseCommand(command)
     *
     * @this {WebIO}
     * @param {string} [command]
     * @return {string|undefined}
     */
    parseCommand(command)
    {
        let result;
        if (command != undefined) {
            let machine = this.machine;
            try {
                command = command.trim();
                if (command) {
                    if (machine.iCommand < machine.aCommands.length && command == machine.aCommands[machine.iCommand]) {
                        machine.iCommand++;
                    } else {
                        machine.aCommands.push(command);
                        machine.iCommand = machine.aCommands.length;
                    }
                }

                let aTokens = command.split(' ');
                let token = aTokens[0], message, on, list, iToken;
                let afnHandlers = this.findHandlers(WebIO.HANDLER.COMMAND);

                switch(token[0]) {
                case 'm':
                    if (token[1] == '?') {
                        result = "";
                        WebIO.MESSAGE_COMMANDS.forEach((command) => {result += command + '\n';});
                        if (result) result = "message commands:\n" + result;
                        break;
                    }
                    result = ""; iToken = 1; list = undefined;
                    token = aTokens[aTokens.length-1].toLowerCase();
                    on = this.parseBoolean(token);
                    if (on != undefined) {
                        aTokens.pop();
                    }
                    if (aTokens.length <= 1) {
                        if (on != undefined) {
                            list = on;
                            on = undefined;
                        }
                        aTokens[iToken] = "all";
                    }
                    if (aTokens[iToken] == "all") {
                        aTokens = Object.keys(WebIO.MESSAGE_NAMES);
                    }
                    for (let i = iToken; i < aTokens.length; i++) {
                        token = aTokens[i];
                        message = WebIO.MESSAGE_NAMES[token];
                        if (!message) {
                            result += "unrecognized message: " + token + '\n';
                            break;
                        }
                        if (on != undefined) {
                            this.setMessages(message, on);
                        }
                        if (list == undefined || list == this.isMessageOn(message)) {
                            result += this.sprintf("%8s: %b\n", token, this.isMessageOn(message));
                        }
                    }
                    if (this.isMessageOn(MESSAGE.BUFFER)) {
                        result += "all messages will be buffered until buffer is turned off\n";
                    }
                    if (!result) result = "no messages\n";
                    break;

                case '?':
                    result = "";
                    WebIO.COMMANDS.forEach((command) => {result += command + '\n';});
                    if (result) result = "default commands:\n" + result;
                    /* falls through */

                default:
                    aTokens.unshift(command);
                    if (afnHandlers) {
                        for (let i = 0; i < afnHandlers.length; i++) {
                            let s = afnHandlers[i](aTokens);
                            if (s != undefined) {
                                if (!result) {
                                    result = s;
                                } else {
                                    result += s;
                                }
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            catch(err) {
                result = "error: " + err.message + '\n';
            }
        }
        return result;
    }

    /**
     * parseCommands(commands)
     *
     * @this {WebIO}
     * @param {string} [commands]
     * @return {string|undefined}
     */
    parseCommands(commands = "?")
    {
        let result;
        if (commands) {
            result = "";
            let aCommands = commands.split(/(?:\n|;\s*)/);
            for (let i = 0; i < aCommands.length; i++) {
                result += this.parseCommand(aCommands[i]);
            }
        }
        return result;
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
     * @return {number}
     */
    print(s, fBuffer)
    {
        if (fBuffer == undefined) {
            fBuffer = this.isMessageOn(MESSAGE.BUFFER);
        }
        if (!fBuffer) {
            let element = this.findBinding(WebIO.BINDING.PRINT, true);
            if (element) {
                /*
                 * To help avoid situations where the element can get overwhelmed by the same repeated string,
                 * don't add the string if it already appears at the end.
                 */
                if (element.value.substr(-s.length) != s) {
                    element.value += s;
                    /*
                     * Prevent the <textarea> from getting too large; otherwise, printing becomes slower and slower.
                     */
                    if (!DEBUG && element.value.length > 8192) {
                        element.value = element.value.substr(element.value.length - 4096);
                    }
                    element.scrollTop = element.scrollHeight;
                    /*
                     * Safari requires this, to keep the caret at the end; Chrome and Firefox, not so much.  Go figure.
                     *
                     * However, if I do this in Safari on iPadOS WHILE the app is full-screen, Safari cancels full-screen
                     * mode.  Argh.  And if printf() is called during the full-screen mode change, setSelectionRange() may
                     * trigger the iPad's soft keyboard, even if the machine does not require it (eg, Space Invaders).
                     *
                     * So this Safari-specific hack is now performed ONLY on non-iOS devices.
                     */
                    if (!this.isUserAgent("iOS")) {
                        element.setSelectionRange(element.value.length, element.value.length);
                    }
                }
                return s.length;
            }
        }
        return super.print(s, fBuffer);
    }


    /**
     * printf(format, ...args)
     *
     * This overrides StdIO.printf(), to add support for Messages; if format is a number, then it's treated
     * as one or more MESSAGE flags, and the real format string is the first arg.
     *
     * @this {WebIO}
     * @param {string|number} format
     * @param {...} [args]
     * @return {number}
     */
    printf(format, ...args)
    {
        let messages = 0;
        if (typeof format == "number") {
            messages = format;
            format = args.shift();
        }
        if (this.isMessageOn(messages)) {
            return super.printf(format, ...args);
        }
        return 0;
    }

    /**
     * saveLocalStorage(state)
     *
     * @this {WebIO}
     * @param {Array} state
     * @return {boolean} true if successful, false if error
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
     * MESSAGE.BUFFER is special, causing all print calls to be buffered; the print buffer will be dumped
     * as soon as setMessages() clears MESSAGE.BUFFER.
     *
     * @this {WebIO}
     * @param {number} messages
     * @param {boolean} on (true to set, false to clear)
     */
    setMessages(messages, on)
    {
        let flush = false;
        if (on) {
            this.machine.messages = this.setBits(this.machine.messages, messages);
        } else {
            flush = (this.testBits(this.machine.messages, MESSAGE.BUFFER) && this.testBits(messages, MESSAGE.BUFFER));
            this.machine.messages = this.clearBits(this.machine.messages, messages);
        }
        if (flush) this.flush();
    }
}

WebIO.BINDING = {
    CLEAR:      "clear",
    PRINT:      "print"
};

WebIO.COMMANDS = [
    "\u2191 \u2193\t\trecall commands",
    "@\t\trepeat last command",
    "m?\t\tmessage commands"
];

WebIO.MESSAGE_COMMANDS = [
    "m\t\tdisplay all messages",
    "m on\t\tdisplay all active messages",
    "m off\t\tdisplay all inactive messages",
    "m all [on|off]\tturn all messages on or off",
    "m ... [on|off]\tturn selected messages on or off"
];

/*
 * NOTE: The first name is automatically omitted from global "on" and "off" operations.
 */
WebIO.MESSAGE_NAMES = {
    "all":      MESSAGE.ALL,
    "buffer":   MESSAGE.BUFFER
};

WebIO.HANDLER = {
    COMMAND:    "command"
};

/*
 * Codes provided by KeyboardEvent.keyCode on a "keypress" event.
 */
WebIO.CHARCODE = {
    /* 0x0D */ CR:         13
};

/*
 * Codes provided by KeyboardEvent.keyCode on "keydown" and "keyup" events.
 */
WebIO.KEYCODE = {
    /* 0x08 */ BS:          8,          // BACKSPACE        (ASCII.CTRL_H)
    /* 0x09 */ TAB:         9,          // TAB              (ASCII.CTRL_I)
    /* 0x0A */ LF:          10,         // LINEFEED         (ASCII.CTRL_J) (Some Windows-based browsers used to generate this via CTRL-ENTER)
    /* 0x0D */ CR:          13,         // CARRIAGE RETURN  (ASCII.CTRL_M)
    /* 0x10 */ SHIFT:       16,
    /* 0x11 */ CTRL:        17,
    /* 0x12 */ ALT:         18,
    /* 0x13 */ PAUSE:       19,         // PAUSE/BREAK
    /* 0x14 */ CAPS_LOCK:   20,
    /* 0x1B */ ESC:         27,
    /* 0x20 */ SPACE:       32,
    /* 0x21 */ PGUP:        33,
    /* 0x22 */ PGDN:        34,
    /* 0x23 */ END:         35,
    /* 0x24 */ HOME:        36,
    /* 0x25 */ LEFT:        37,
    /* 0x26 */ UP:          38,
    /* 0x27 */ RIGHT:       39,
    /* 0x27 */ FF_QUOTE:    39,
    /* 0x28 */ DOWN:        40,
    /* 0x2C */ FF_COMMA:    44,
    /* 0x2C */ PRTSC:       44,
    /* 0x2D */ INS:         45,
    /* 0x2E */ DEL:         46,
    /* 0x2E */ FF_PERIOD:   46,
    /* 0x2F */ FF_SLASH:    47,
    /* 0x30 */ ZERO:        48,
    /* 0x31 */ ONE:         49,
    /* 0x32 */ TWO:         50,
    /* 0x33 */ THREE:       51,
    /* 0x34 */ FOUR:        52,
    /* 0x35 */ FIVE:        53,
    /* 0x36 */ SIX:         54,
    /* 0x37 */ SEVEN:       55,
    /* 0x38 */ EIGHT:       56,
    /* 0x39 */ NINE:        57,
    /* 0x3B */ FF_SEMI:     59,
    /* 0x3D */ FF_EQUALS:   61,
    /* 0x41 */ A:           65,
    /* 0x42 */ B:           66,
    /* 0x43 */ C:           67,
    /* 0x44 */ D:           68,
    /* 0x45 */ E:           69,
    /* 0x46 */ F:           70,
    /* 0x47 */ G:           71,
    /* 0x48 */ H:           72,
    /* 0x49 */ I:           73,
    /* 0x4A */ J:           74,
    /* 0x4B */ K:           75,
    /* 0x4C */ L:           76,
    /* 0x4D */ M:           77,
    /* 0x4E */ N:           78,
    /* 0x4F */ O:           79,
    /* 0x50 */ P:           80,
    /* 0x51 */ Q:           81,
    /* 0x52 */ R:           82,
    /* 0x53 */ S:           83,
    /* 0x54 */ T:           84,
    /* 0x55 */ U:           85,
    /* 0x56 */ V:           86,
    /* 0x57 */ W:           87,
    /* 0x58 */ X:           88,
    /* 0x59 */ Y:           89,
    /* 0x5A */ Z:           90,
    /* 0x5B */ CMD:         91,         // aka WIN
    /* 0x5B */ FF_LBRACK:   91,
    /* 0x5C */ FF_BSLASH:   92,
    /* 0x5D */ RCMD:        93,         // aka MENU
    /* 0x5D */ FF_RBRACK:   93,
    /* 0x60 */ NUM_0:       96,
    /* 0x60 */ NUM_INS:     96,
    /* 0x60 */ FF_BQUOTE:   96,
    /* 0x61 */ NUM_1:       97,
    /* 0x61 */ NUM_END:     97,
    /* 0x62 */ NUM_2:       98,
    /* 0x62 */ NUM_DOWN:    98,
    /* 0x63 */ NUM_3:       99,
    /* 0x63 */ NUM_PGDN:    99,
    /* 0x64 */ NUM_4:       100,
    /* 0x64 */ NUM_LEFT:    100,
    /* 0x65 */ NUM_5:       101,
    /* 0x65 */ NUM_CENTER:  101,
    /* 0x66 */ NUM_6:       102,
    /* 0x66 */ NUM_RIGHT:   102,
    /* 0x67 */ NUM_7:       103,
    /* 0x67 */ NUM_HOME:    103,
    /* 0x68 */ NUM_8:       104,
    /* 0x68 */ NUM_UP:      104,
    /* 0x69 */ NUM_9:       105,
    /* 0x69 */ NUM_PGUP:    105,
    /* 0x6A */ NUM_MUL:     106,
    /* 0x6B */ NUM_ADD:     107,
    /* 0x6D */ NUM_SUB:     109,
    /* 0x6E */ NUM_DEL:     110,        // aka PERIOD
    /* 0x6F */ NUM_DIV:     111,
    /* 0x70 */ F1:          112,
    /* 0x71 */ F2:          113,
    /* 0x72 */ F3:          114,
    /* 0x73 */ F4:          115,
    /* 0x74 */ F5:          116,
    /* 0x75 */ F6:          117,
    /* 0x76 */ F7:          118,
    /* 0x77 */ F8:          119,
    /* 0x78 */ F9:          120,
    /* 0x79 */ F10:         121,
    /* 0x7A */ F11:         122,
    /* 0x7B */ F12:         123,
    /* 0x90 */ NUM_LOCK:    144,
    /* 0x91 */ SCROLL_LOCK: 145,
    /* 0xAD */ FF_DASH:     173,
    /* 0xBA */ SEMI:        186,        // Firefox:  59 (FF_SEMI)
    /* 0xBB */ EQUALS:      187,        // Firefox:  61 (FF_EQUALS)
    /* 0xBC */ COMMA:       188,
    /* 0xBD */ DASH:        189,        // Firefox: 173 (FF_DASH)
    /* 0xBE */ PERIOD:      190,
    /* 0xBF */ SLASH:       191,
    /* 0xC0 */ BQUOTE:      192,
    /* 0xDB */ LBRACK:      219,
    /* 0xDC */ BSLASH:      220,
    /* 0xDD */ RBRACK:      221,
    /* 0xDE */ QUOTE:       222,
    /* 0xE0 */ FF_CMD:      224,        // Firefox only (used for both CMD and RCMD)
               VIRTUAL:    1000         // bias used by other devices to define "virtual" keyCodes
};

/*
 * Maps Firefox-specific keyCodes to their more common keyCode counterparts.
 */
WebIO.FF_KEYCODE = {
    [WebIO.KEYCODE.FF_SEMI]:    WebIO.KEYCODE.SEMI,     //  59 -> 186
    [WebIO.KEYCODE.FF_EQUALS]:  WebIO.KEYCODE.EQUALS,   //  61 -> 187
    [WebIO.KEYCODE.FF_DASH]:    WebIO.KEYCODE.DASH,     // 173 -> 189
    [WebIO.KEYCODE.FF_CMD]:     WebIO.KEYCODE.CMD       // 224 -> 91
};

/*
 * This maps KEYCODE values to ASCII character (or a string representation for non-ASCII keys).
 */
WebIO.KEYNAME = {
    [WebIO.KEYCODE.BS]:     "\b",
    [WebIO.KEYCODE.TAB]:    "\t",
    [WebIO.KEYCODE.LF]:     "\n",
    [WebIO.KEYCODE.CR]:     "\r",
    [WebIO.KEYCODE.SPACE]:  " ",
    [WebIO.KEYCODE.ZERO]:   "0",
    [WebIO.KEYCODE.ONE]:    "1",
    [WebIO.KEYCODE.TWO]:    "2",
    [WebIO.KEYCODE.THREE]:  "3",
    [WebIO.KEYCODE.FOUR]:   "4",
    [WebIO.KEYCODE.FIVE]:   "5",
    [WebIO.KEYCODE.SIX]:    "6",
    [WebIO.KEYCODE.SEVEN]:  "7",
    [WebIO.KEYCODE.EIGHT]:  "8",
    [WebIO.KEYCODE.NINE]:   "9",
    [WebIO.KEYCODE.A]:      "A",
    [WebIO.KEYCODE.B]:      "B",
    [WebIO.KEYCODE.C]:      "C",
    [WebIO.KEYCODE.D]:      "D",
    [WebIO.KEYCODE.E]:      "E",
    [WebIO.KEYCODE.F]:      "F",
    [WebIO.KEYCODE.G]:      "G",
    [WebIO.KEYCODE.H]:      "H",
    [WebIO.KEYCODE.I]:      "I",
    [WebIO.KEYCODE.J]:      "J",
    [WebIO.KEYCODE.K]:      "K",
    [WebIO.KEYCODE.L]:      "L",
    [WebIO.KEYCODE.M]:      "M",
    [WebIO.KEYCODE.N]:      "N",
    [WebIO.KEYCODE.O]:      "O",
    [WebIO.KEYCODE.P]:      "P",
    [WebIO.KEYCODE.Q]:      "Q",
    [WebIO.KEYCODE.R]:      "R",
    [WebIO.KEYCODE.S]:      "S",
    [WebIO.KEYCODE.T]:      "T",
    [WebIO.KEYCODE.U]:      "U",
    [WebIO.KEYCODE.V]:      "V",
    [WebIO.KEYCODE.W]:      "W",
    [WebIO.KEYCODE.X]:      "X",
    [WebIO.KEYCODE.Y]:      "Y",
    [WebIO.KEYCODE.Z]:      "Z",
    [WebIO.KEYCODE.LEFT]:   "Left",
    [WebIO.KEYCODE.RIGHT]:  "Right",
};

WebIO.Alerts = {
    list:       [],
    Version:    "version"
};

WebIO.BrowserPrefixes = ['', 'moz', 'ms', 'webkit'];

WebIO.COLORS = {
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

WebIO.LocalStorage = {
    Available:  undefined,
    Test:       "PCjs.localStorage"
};

Defs.CLASSES["WebIO"] = WebIO;

/**
 * @copyright https://www.pcjs.org/modules/devices/main/device.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ get: function(), set: function(number) }} */
var Register;

/**
 * In addition to basic Device services, such as:
 *
 *      addDevice()
 *      enumDevices()
 *      findDevice()
 *      findDeviceByClass()
 *
 * this class also supports register "registration" services, to allow a Device to make any registers
 * it supports available by name to other devices (notably the Debugger):
 *
 *      defineRegister()
 *      getRegister()
 *      setRegister()
 *
 * Besides CPUs, other devices may have internal registers or ports that are useful to access by name, too.
 *
 * @class {Device}
 * @unrestricted
 * @property {string} idMachine
 * @property {string} idDevice
 * @property {Config} config
 * @property {string} id
 * @property {Object} registers
 * @property {Device|undefined|null} cpu
 * @property {Device|undefined|null} dbg
 */
class Device extends WebIO {
    /**
     * Device()
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
     * Also, URL parameters can be used to override config properties, as long as those properties
     * have been listed in the device's "overrides" array.  For example, the URL:
     *
     *      http://localhost:4000/?cyclesPerSecond=100000
     *
     * will set the Time device's cyclesPerSecond config property to 100000.  In general, the values
     * will be treated as strings, unless they contain all digits (number), or equal "true" or "false"
     * (boolean).
     *
     * @this {Device}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     * @param {Array} [overrides] (default overrides, if any, which in turn can be overridden by config['overrides'])
     */
    constructor(idMachine, idDevice, config, overrides)
    {
        super(idMachine == idDevice);
        this.addDevice(idMachine, idDevice);
        this.checkConfig(config, overrides);
        this.registers = {};
        this.cpu = this.dbg = undefined;
    }

    /**
     * addDevice(idMachine, idDevice)
     *
     * Adds this Device to the global set of Devices, so that findDevice(), findBinding(), etc, will work.
     *
     * @this {Device}
     * @param {string} idMachine
     * @param {string} idDevice
     */
    addDevice(idMachine, idDevice)
    {
        this.idMachine = idMachine;
        this.idDevice = idDevice;
        if (!Device.Machines[this.idMachine]) {
            Device.Machines[this.idMachine] = {};
        }
        if (Device.Machines[this.idMachine][this.idDevice]) {
            this.printf("warning: machine configuration contains multiple '%s' devices\n", this.idDevice);
        }
        Device.Machines[this.idMachine][this.idDevice] = this;
        /*
         * The new Device classes don't use the Components array or machine+device IDs, but we need to continue
         * updating both of those for backward compatibility with older PCjs machines.
         */
        this['id'] = this.idMachine + '.' + this.idDevice;
        Device.Components.push(this);
        /*
         * The WebIO constructor set this.machine tentatively, so that it could define any per-machine variables it needed;
         * now we set it definitively.
         */
        this.machine = this.findDevice(this.idMachine);
    }

    /**
     * checkConfig(config, overrides)
     *
     * @this {Device}
     * @param {Config} [config]
     * @param {Array} [overrides]
     */
    checkConfig(config = {}, overrides = [])
    {
        /*
         * If this device's config contains an "overrides" array, then any of the properties listed in
         * that array may be overridden with a URL parameter.  We don't impose any checks on the overriding
         * value, so it is the responsibility of the component with overridable properties to validate them.
         */
        overrides = config['overrides'] || overrides;
        if (overrides.length) {
            let parms = this.getURLParms();
            for (let prop in parms) {
                if (overrides.indexOf(prop) >= 0) {
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
        this.config = config;
        this.addBindings(config['bindings']);
        this.checkVersion(config);
    }

    /**
     * checkVersion(config)
     *
     * Verify that device's version matches the machine's version, and also that the config version stored in
     * the JSON (if any) matches the device's version.
     *
     * This is normally performed by the constructor, but the Machine device cannot be fully initialized in the
     * constructor, so it calls this separately.
     *
     * @this {Device}
     * @param {Config} [config]
     */
    checkVersion(config = {})
    {
        this.version = +VERSION;
        if (this.version) {
            let sVersion = "", version;
            if (this.idMachine != this.idDevice) {
                let machine = this.findDevice(this.idMachine);
                version = machine.version;
                if (version && version != this.version) {
                    sVersion = "Machine";
                }
            }
            if (!sVersion) {
                version = config['version'];
                if (version && version > this.version) {
                    sVersion = "Config";
                }
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
     * enumDevices(func)
     *
     * @this {Device}
     * @param {function(Device)} func
     * @return {boolean} (true if all devices successfully enumerated, false otherwise)
     */
    enumDevices(func)
    {
        let id;
        try {
            let devices = Device.Machines[this.idMachine];
            if (devices) {
                for (id in devices) {
                    let device = devices[id];
                    if (device.config['class'] != "Machine") {
                        if (!func(device)) return false;
                    }
                }
            }
            return true;
        } catch(err) {
            this.printf("error while enumerating device '%s': %s\n", id, err.message);
        }
        return false;
    }

    /**
     * findBinding(name, all)
     *
     * This will search the current device's bindings, and optionally all the device bindings within the
     * machine.  If the binding is found in another device, that binding is recorded in this device as well.
     *
     * @this {Device}
     * @param {string} [name]
     * @param {boolean} [all]
     * @return {Element|null|undefined}
     */
    findBinding(name, all = false)
    {
        let element;
        if (name) {
            element = super.findBinding(name, all);
            if (element === undefined && all) {
                let devices = Device.Machines[this.idMachine];
                for (let id in devices) {
                    element = devices[id].bindings[name];
                    if (element) break;
                }
                if (!element) element = null;
                this.bindings[name] = element;
            }
        }
        return element;
    }

    /**
     * findDevice(idDevice, fRequired)
     *
     * @this {Device}
     * @param {string} idDevice
     * @param {boolean} [fRequired] (default is true, so if the device is not found, an Error is thrown)
     * @return {Device|null}
     */
    findDevice(idDevice, fRequired=true)
    {
        let id = idDevice;
        let idMachine = this.idMachine;
        let i = idMachine.indexOf('.');
        if (i > 0) {
            idMachine = idMachine.substr(0, i);
            idDevice = idDevice.substr(i + 1);
        }
        let devices = Device.Machines[idMachine];
        let device = devices && devices[idDevice] || null;
        if (!device) {
            /*
             * Also check the old list of PCjs machine component IDs, to maintain backward compatibility.
             */
            for (i = 0; i < Device.Components.length; i++) {
                if (Device.Components[i]['id'] === id) {
                    device = Device.Components[i];
                    break;
                }
            }
            if (!device && fRequired) {
                throw new Error(this.sprintf("unable to find device with ID '%s'", id));
            }
        }
        return device;
    }

    /**
     * findDeviceByClass(idClass, fRequired)
     *
     * This is only appropriate for device classes where no more than one instance of the device is allowed;
     * for example, it is NOT appropriate for the Bus class, because machines can have multiple buses (eg, an
     * I/O bus and a memory bus).
     *
     * @this {Device}
     * @param {string} idClass
     * @param {boolean} [fRequired] (default is true, so if the device is not found, an Error is thrown)
     * @return {Device|null}
     */
    findDeviceByClass(idClass, fRequired=true)
    {
        let device = null;
        let devices = Device.Machines[this.idMachine];
        if (devices) {
            for (let id in devices) {
                if (devices[id].config['class'] == idClass) {
                    if (device) {
                        device = null;      // multiple devices with the same class, so return an error
                        break;
                    }
                    device = devices[id];
                }
            }
        }
        if (!device && fRequired) {
            throw new Error(this.sprintf("unable to find device with class '%s'", idClass));
        }
        return device;
    }

    /**
     * getMachineConfig(prop)
     *
     * @this {Device}
     * @param {string} prop
     * @return {*}
     */
    getMachineConfig(prop)
    {
        let machine = this.findDevice(this.idMachine);
        return machine && machine.config && machine.config[prop];
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
     * notifyMessage(messages)
     *
     * Overidden by other devices (eg, Debugger) to receive notifications of messages, along with the messages bits.
     *
     * @this {Device}
     * @param {number} messages
     */
    notifyMessage(messages)
    {
    }

    /**
     * printf(format, ...args)
     *
     * Just as WebIO.printf() overrides StdIO.printf() to add support for Messages, we override WebIO.printf()
     * to add support for MESSAGE.ADDR: if that message bit is set, we want to append the current execution address
     * (PC) to any message-driven printf() call.
     *
     * @this {Device}
     * @param {string|number} format
     * @param {...} args
     * @return {number}
     */
    printf(format, ...args)
    {
        if (typeof format == "number" && this.isMessageOn(format)) {
            /*
             * The following will execute at most once, because findDeviceByClass() returns either a Device or null,
             * neither of which is undefined.
             */
            if (this.dbg === undefined) {
                this.dbg = /** @type {Device} */ (this.findDeviceByClass("Debugger"));
            }
            if (this.dbg) {
                this.dbg.notifyMessage(format);
            }
            if (this.machine.messages & MESSAGE.ADDR) {
                /*
                 * Same rules as above apply here.  Hopefully no message-based printf() calls will arrive with MESSAGE.ADDR
                 * set *before* the CPU device has been initialized.
                 */
                if (this.cpu === undefined) {
                    this.cpu = /** @type {CPU} */ (this.findDeviceByClass("CPU"));
                }
                if (this.cpu) {
                    format = args.shift();      // TODO: Define a getPCLast() interface for all machines that replaces regPCLast
                    return super.printf("%#06x: %s.%s\n", this.cpu.regPCLast, this.idDevice, this.sprintf(format, ...args).trim());
                }
            }
        }
        return super.printf(format, ...args);
    }

    /**
     * removeDevice(idDevice)
     *
     * @this {Device}
     * @param {string} idDevice
     */
    removeDevice(idDevice)
    {
        let device;
        let devices = Device.Machines[this.idMachine];
        if (devices) delete devices[idDevice];
    }

    /**
     * setRegister(name, value)
     *
     * @this {Device}
     * @param {string} name
     * @param {number} value
     * @return {boolean} (true if register exists and successfully set, false otherwise)
     */
    setRegister(name, value)
    {
        let reg = this.registers[name];
        if (reg) {
            reg.set(value);
            return true;
        }
        return false;
    }
}

/**
 * Machines is a global object whose properties are machine IDs and whose values are arrays of Devices.
 *
 * @type {Object}
 */
Device.Machines = {};

/**
 * Components is maintained for backward-compatibility with older PCjs machines, to facilitate machine connections.
 *
 * @type {Array}
 */
Device.Components = [];

/*
 * List of additional message groups, extending the base set defined in lib/webio.js.
 *
 * NOTE: To support more than 32 message groups, be sure to use "+", not "|", when concatenating.
 */
MESSAGE.ADDR            = 0x000000000001;       // this is a special bit (bit 0) used to append address info to messages
MESSAGE.BUS             = 0x000000000002;
MESSAGE.MEMORY          = 0x000000000004;
MESSAGE.PORTS           = 0x000000000008;
MESSAGE.CHIPS           = 0x000000000010;
MESSAGE.KBD             = 0x000000000020;
MESSAGE.SERIAL          = 0x000000000040;
MESSAGE.MISC            = 0x000000000080;
MESSAGE.CPU             = 0x000000000100;
MESSAGE.VIDEO           = 0x000000000200;       // used with video hardware messages (see video.js)
MESSAGE.MONITOR         = 0x000000000400;       // used with video monitor messages (see monitor.js)
MESSAGE.SCREEN          = 0x000000000800;       // used with screen-related messages (also monitor.js)
MESSAGE.TIMER           = 0x000000001000;
MESSAGE.EVENT           = 0x000000002000;
MESSAGE.INPUT           = 0x000000004000;
MESSAGE.KEY             = 0x000000008000;
MESSAGE.MOUSE           = 0x000000010000;
MESSAGE.TOUCH           = 0x000000020000;
MESSAGE.WARN            = 0x000000040000;
MESSAGE.HALT            = 0x000000080000;

WebIO.MESSAGE_NAMES["addr"]     = MESSAGE.ADDR;
WebIO.MESSAGE_NAMES["bus"]      = MESSAGE.BUS;
WebIO.MESSAGE_NAMES["memory"]   = MESSAGE.MEMORY;
WebIO.MESSAGE_NAMES["ports"]    = MESSAGE.PORTS;
WebIO.MESSAGE_NAMES["chips"]    = MESSAGE.CHIPS;
WebIO.MESSAGE_NAMES["kbd"]      = MESSAGE.KBD;
WebIO.MESSAGE_NAMES["serial"]   = MESSAGE.SERIAL;
WebIO.MESSAGE_NAMES["misc"]     = MESSAGE.MISC;
WebIO.MESSAGE_NAMES["cpu"]      = MESSAGE.CPU;
WebIO.MESSAGE_NAMES["video"]    = MESSAGE.VIDEO;
WebIO.MESSAGE_NAMES["monitor"]  = MESSAGE.MONITOR;
WebIO.MESSAGE_NAMES["screen"]   = MESSAGE.SCREEN;
WebIO.MESSAGE_NAMES["timer"]    = MESSAGE.TIMER;
WebIO.MESSAGE_NAMES["event"]    = MESSAGE.EVENT;
WebIO.MESSAGE_NAMES["input"]    = MESSAGE.INPUT;
WebIO.MESSAGE_NAMES["key"]      = MESSAGE.KEY;
WebIO.MESSAGE_NAMES["mouse"]    = MESSAGE.MOUSE;
WebIO.MESSAGE_NAMES["touch"]    = MESSAGE.TOUCH;
WebIO.MESSAGE_NAMES["warn"]     = MESSAGE.WARN;
WebIO.MESSAGE_NAMES["halt"]     = MESSAGE.HALT;

if (window) {
    if (!window['PCjs']) window['PCjs'] = {};
    Device.Machines = window['PCjs']['Machines'] || (window['PCjs']['Machines'] = {});
    Device.Components = window['PCjs']['Components'] || (window['PCjs']['Components'] = []);
}

Defs.CLASSES["Device"] = Device;

/**
 * @copyright https://www.pcjs.org/modules/devices/bus/bus.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ type: string, addrWidth: number, dataWidth: number, blockSize: (number|undefined), littleEndian: (boolean|undefined) }} */
var BusConfig;

/**
 * @class {Bus}
 * @unrestricted
 * @property {BusConfig} config
 * @property {number} type (Bus.TYPE value, converted from config['type'])
 * @property {number} addrWidth
 * @property {number} addrTotal
 * @property {number} addrLimit
 * @property {number} blockSize
 * @property {number} blockTotal
 * @property {number} blockShift
 * @property {number} blockLimit
 * @property {number} dataWidth
 * @property {number} dataLimit
 * @property {boolean} littleEndian
 * @property {Array.<Memory>} blocks
 * @property {number} nTraps (number of blocks currently being trapped)
 */
class Bus extends Device {
    /**
     * Bus(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "bus": {
     *        "class": "Bus",
     *        "type": "static",
     *        "addrWidth": 16,
     *        "dataWidth": 8,
     *        "blockSize": 1024,
     *        "littleEndian": true
     *      }
     *
     * @this {Bus}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {BusConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        /*
         * Our default type is DYNAMIC for the sake of older device configs (eg, TI-57) which didn't specify a type
         * and need a dynamic bus to ensure that their LED ROM array (if any) gets updated on ROM accesses.  Obviously,
         * that can (and should) be controlled by a configuration file that is unique to the device's display requirements,
         * but at the moment, all TI-57 config files have LED ROM array support enabled, whether it's actually used or not.
         */
        this.type = config['type'] == "static"? Bus.TYPE.STATIC : Bus.TYPE.DYNAMIC;
        this.addrWidth = config['addrWidth'] || 16;
        this.addrTotal = Math.pow(2, this.addrWidth);
        this.addrLimit = (this.addrTotal - 1)|0;
        this.blockSize = config['blockSize'] || 1024;
        if (this.blockSize > this.addrTotal) this.blockSize = this.addrTotal;
        this.blockTotal = (this.addrTotal / this.blockSize)|0;
        this.blockShift = Math.log2(this.blockSize)|0;
        this.blockLimit = (1 << this.blockShift) - 1;
        this.dataWidth = config['dataWidth'] || 8;
        this.dataLimit = Math.pow(2, this.dataWidth) - 1;
        this.littleEndian = config['littleEndian'] !== false;
        this.blocks = new Array(this.blockTotal);
        this.nTraps = 0;
        let block = new Memory(idMachine, idDevice + "[NONE]", {"size": this.blockSize, "bus": this.idDevice});
        for (let addr = 0; addr < this.addrTotal; addr += this.blockSize) {
            this.addBlocks(addr, this.blockSize, Memory.TYPE.NONE, block);
        }
        this.selectInterface(this.type);
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
     * @return {boolean} (true if successful, false if error)
     */
    addBlocks(addr, size, type, block)
    {
        let addrNext = addr;
        let sizeLeft = size;
        let offset = 0;
        let iBlock = addrNext >>> this.blockShift;
        while (sizeLeft > 0 && iBlock < this.blocks.length) {
            let blockNew;
            let addrBlock = iBlock * this.blockSize;
            let sizeBlock = this.blockSize - (addrNext - addrBlock);
            if (sizeBlock > sizeLeft) sizeBlock = sizeLeft;
            let blockExisting = this.blocks[iBlock];
            /*
             * If addrNext does not equal addrBlock, or sizeBlock does not equal this.blockSize, then either
             * the current block doesn't start on a block boundary or the size is something other than a block;
             * while we might support such requests down the road, that is currently a configuration error.
             */
            if (addrNext != addrBlock || sizeBlock != this.blockSize) {

                return false;
            }
            /*
             * Make sure that no block exists at the specified address, or if so, make sure its type is NONE.
             */
            if (blockExisting && blockExisting.type != Memory.TYPE.NONE) {

                return false;
            }
            /*
             * When no block is provided, we must allocate one that matches the specified type (and remaining size).
             */
            let idBlock = this.idDevice + '[' + this.toBase(addrNext, 16, this.addrWidth) + ']';
            if (!block) {
                blockNew = new Memory(this.idMachine, idBlock, {type, addr: addrNext, size: sizeBlock, "bus": this.idDevice});
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
                    let values;
                    if (block['values']) {
                        values = block['values'].slice(offset, offset + sizeBlock);
                        if (values.length != sizeBlock) {

                            return false;
                        }
                    }
                    blockNew = new Memory(this.idMachine, idBlock, {type, addr: addrNext, size: sizeBlock, "bus": this.idDevice, values});
                }
            }
            this.blocks[iBlock] = blockNew;
            addrNext = addrBlock + this.blockSize;
            sizeLeft -= sizeBlock;
            offset += sizeBlock;
            iBlock++;
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
            if (this.blocks[iBlock].isDirty()) {
                clean = false;
            }
            size -= sizeBlock;
            sizeBlock = this.blockSize;
            iBlock++;
        }
        return clean;
    }

    /**
     * enumBlocks(types, func)
     *
     * This is used by the Debugger to enumerate all the blocks of certain types.
     *
     * @this {Bus}
     * @param {number} types
     * @param {function(Memory)} func
     * @return {number} (the number of blocks enumerated based on the requested types)
     */
    enumBlocks(types, func)
    {
        let cBlocks = 0;
        for (let iBlock = 0; iBlock < this.blocks.length; iBlock++) {
            let block = this.blocks[iBlock];
            if (!block || !(block.type & types)) continue;
            func(block);
            cBlocks++;
        }
        return cBlocks;
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {Bus}
     */
    onReset()
    {
        /*
         * The following logic isn't needed because Memory and Port objects are Devices as well,
         * so their onReset() handlers will be invoked automatically.
         *
         *      this.enumBlocks(Memory.TYPE.WRITABLE, function(block) {
         *          if (block.onReset) block.onReset();
         *      });
         */
    }

    /**
     * onLoad(state)
     *
     * Automatically called by the Machine device if the machine's 'autoSave' property is true.
     *
     * @this {Bus}
     * @param {Array} state
     * @return {boolean}
     */
    onLoad(state)
    {
        return state && this.loadState(state)? true : false;
    }

    /**
     * onSave(state)
     *
     * Automatically called by the Machine device before all other devices have been powered down (eg, during
     * a page unload event).
     *
     * @this {Bus}
     * @param {Array} state
     */
    onSave(state)
    {
        this.saveState(state);
    }

    /**
     * loadState(state)
     *
     * @this {Bus}
     * @param {Array} state
     * @return {boolean}
     */
    loadState(state)
    {
        for (let iBlock = 0; iBlock < this.blocks.length; iBlock++) {
            let block = this.blocks[iBlock];
            if (this.type == Bus.TYPE.DYNAMIC || (block.type & Memory.TYPE.READWRITE)) {
                if (block.loadState) {
                    let stateBlock = state.shift();
                    if (!block.loadState(stateBlock)) return false;
                }
            }
        }
        return true;
    }

    /**
     * saveState(state)
     *
     * @this {Bus}
     * @param {Array} state
     */
    saveState(state)
    {
        for (let iBlock = 0; iBlock < this.blocks.length; iBlock++) {
            let block = this.blocks[iBlock];
            if (this.type == Bus.TYPE.DYNAMIC || (block.type & Memory.TYPE.READWRITE)) {
                if (block.saveState) {
                    let stateBlock = [];
                    block.saveState(stateBlock);
                    state.push(stateBlock);
                }
            }
        }
    }

    /**
     * readBlockData(addr)
     *
     * @this {Bus}
     * @param {number} addr
     * @return {number}
     */
    readBlockData(addr)
    {

        return this.blocks[addr >>> this.blockShift].readData(addr & this.blockLimit);
    }

    /**
     * writeBlockData(addr, value)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {number} value
     */
    writeBlockData(addr, value)
    {

        this.blocks[addr >>> this.blockShift].writeData(addr & this.blockLimit, value);
    }

    /**
     * readBlockPairBE(addr)
     *
     * NOTE: Any addr we are passed is assumed to be properly masked; however, any address that we
     * we calculate ourselves (ie, addr + 1) must be masked ourselves.
     *
     * @this {Bus}
     * @param {number} addr
     * @return {number}
     */
    readBlockPairBE(addr)
    {

        if (addr & 0x1) {
            return this.readData((addr + 1) & this.addrLimit) | (this.readData(addr) << this.dataWidth);
        }
        return this.blocks[addr >>> this.blockShift].readPair(addr & this.blockLimit);
    }

    /**
     * readBlockPairLE(addr)
     *
     * NOTE: Any addr we are passed is assumed to be properly masked; however, any address that we
     * we calculate ourselves (ie, addr + 1) must be masked ourselves.
     *
     * @this {Bus}
     * @param {number} addr
     * @return {number}
     */
    readBlockPairLE(addr)
    {

        if (addr & 0x1) {
            return this.readData(addr) | (this.readData((addr + 1) & this.addrLimit) << this.dataWidth);
        }
        return this.blocks[addr >>> this.blockShift].readPair(addr & this.blockLimit);
    }

    /**
     * writeBlockPairBE(addr, value)
     *
     * NOTE: Any addr we are passed is assumed to be properly masked; however, any address that we
     * we calculate ourselves (ie, addr + 1) must be masked ourselves.
     *
     * @this {Bus}
     * @param {number} addr
     * @param {number} value
     */
    writeBlockPairBE(addr, value)
    {

        if (addr & 0x1) {
            this.writeData(addr, value >> this.dataWidth);
            this.writeData((addr + 1) & this.addrLimit, value & this.dataLimit);
            return;
        }
        this.blocks[addr >>> this.blockShift].writePair(addr & this.blockLimit, value);
    }

    /**
     * writeBlockPairLE(addr, value)
     *
     * NOTE: Any addr we are passed is assumed to be properly masked; however, any address that we
     * we calculate ourselves (ie, addr + 1) must be masked ourselves.
     *
     * @this {Bus}
     * @param {number} addr
     * @param {number} value
     */
    writeBlockPairLE(addr, value)
    {

        if (addr & 0x1) {
            this.writeData(addr, value & this.dataLimit);
            this.writeData((addr + 1) & this.addrLimit, value >> this.dataWidth);
            return;
        }
        this.blocks[addr >>> this.blockShift].writePair(addr & this.blockLimit, value);
    }

    /**
     * selectInterface(n)
     *
     * We prefer Bus readData() and writeData() functions that access the corresponding values directly,
     * but if the Bus is dynamic (or if any traps are enabled), then we must revert to calling functions instead.
     *
     * In reality, this function exists purely for future optimizations; for now, we always use the block functions.
     *
     * @this {Bus}
     * @param {number} nDelta (the change in trap requests; eg, +/-1)
     */
    selectInterface(nDelta)
    {
        let nTraps = this.nTraps;
        this.nTraps += nDelta;

        if (!nTraps || !this.nTraps) {
            this.readData = this.readBlockData;
            this.writeData = this.writeBlockData;
            if (!this.littleEndian) {
                this.readPair = this.readBlockPairBE;
                this.writePair = this.writeBlockPairBE;
            } else {
                this.readPair = this.readBlockPairLE;
                this.writePair = this.writeBlockPairLE;
            }
        }
    }

    /**
     * trapRead(addr, func)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function((number|undefined), number, number)} func (receives the base address, offset, and value read)
     * @return {boolean} true if trap successful, false if unsupported or already trapped by another function
     */
    trapRead(addr, func)
    {
        if (this.blocks[addr >>> this.blockShift].trapRead(func)) {
            this.selectInterface(1);
            return true;
        }
        return false;
    }

    /**
     * trapWrite(addr, func)
     *
     * Note that for blocks of type NONE, the base will be undefined, so function will not see the original address,
     * only the block offset.
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function((number|undefined), number, number)} func (receives the base address, offset, and value written)
     * @return {boolean} true if trap successful, false if unsupported already trapped by another function
     */
    trapWrite(addr, func)
    {
        if (this.blocks[addr >>> this.blockShift].trapWrite(func)) {
            this.selectInterface(1);
            return true;
        }
        return false;
    }

    /**
     * untrapRead(addr, func)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function((number|undefined), number, number)} func (receives the base address, offset, and value read)
     * @return {boolean} true if untrap successful, false if no (or another) trap was in effect
     */
    untrapRead(addr, func)
    {
        if (this.blocks[addr >>> this.blockShift].untrapRead(func)) {
            this.selectInterface(-1);
            return true;
        }
        return false;
    }

    /**
     * untrapWrite(addr, func)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function((number|undefined), number, number)} func (receives the base address, offset, and value written)
     * @return {boolean} true if untrap successful, false if no (or another) trap was in effect
     */
    untrapWrite(addr, func)
    {
        if (this.blocks[addr >>> this.blockShift].untrapWrite(func)) {
            this.selectInterface(-1);
            return true;
        }
        return false;
    }
}

/*
 * A "dynamic" bus (eg, an I/O bus) is one where block accesses must always be performed via function (no direct
 * value access) because there's "logic" on the other end, whereas a "static" bus can be accessed either way, via
 * function or value.
 *
 * Why don't we use ONLY functions on dynamic buses and ONLY direct value access on static buses?  Partly for
 * historical reasons, but also because when trapping is enabled on one or more blocks of a bus, all accesses must
 * be performed via function, to ensure that the appropriate trap handler always gets invoked.
 *
 * This is why it's important that TYPE.DYNAMIC be 1 (not 0), because we pass that value to selectInterface()
 * to effectively force all block accesses on a "dynamic" bus to use function calls.
 */
Bus.TYPE = {
    STATIC:     0,
    DYNAMIC:    1
};

Defs.CLASSES["Bus"] = Bus;

/**
 * @copyright https://www.pcjs.org/modules/devices/bus/memory.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ addr: (number|undefined), size: number, type: (number|undefined), littleEndian: (boolean|undefined), values: (Array.<number>|undefined) }} */
var MemoryConfig;

/**
 * @class {Memory}
 * @unrestricted
 * @property {number} [addr]
 * @property {number} size
 * @property {number} type
 * @property {Bus} bus
 * @property {number} dataWidth
 * @property {number} dataLimit
 * @property {number} pairLimit
 * @property {boolean} littleEndian
 * @property {ArrayBuffer|null} buffer
 * @property {DataView|null} dataView
 * @property {Array.<number>} values
 * @property {Array.<Uint16>|null} valuePairs
 * @property {Array.<Int32>|null} valueQuads
 * @property {boolean} fDirty
 * @property {number} nReadTraps
 * @property {number} nWriteTraps
 * @property {function((number|undefined),number,number)|null} readTrap
 * @property {function((number|undefined),number,number)|null} writeTrap
 * @property {function(number)|null} readDataOrig
 * @property {function(number,number)|null} writeDataOrig
 * @property {function(number)|null} readPairOrig
 * @property {function(number,number)|null} writePairOrig
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

        /*
         * If no Bus ID was provided, then we fallback to the default Bus.
         */
        let idBus = this.config['bus'];
        this.bus = /** @type {Bus} */ (idBus? this.findDevice(idBus) : this.findDeviceByClass(idBus = "Bus"));
        if (!this.bus) throw new Error(this.sprintf("unable to find bus '%s'", idBus));

        this.dataWidth = this.bus.dataWidth;
        this.dataLimit = Math.pow(2, this.dataWidth) - 1;
        this.pairLimit = Math.pow(2, this.dataWidth * 2) - 1;

        this.littleEndian = this.bus.littleEndian !== false;
        this.buffer = this.dataView = null
        this.values = this.valuePairs = this.valueQuads = null;

        let readValue = this.readValue;
        let writeValue = this.writeValue;
        let readPair = this.readValuePair;
        let writePair = this.writeValuePair;

        if (this.bus.type == Bus.TYPE.STATIC) {
            writeValue = this.writeValueDirty;
            readPair = this.littleEndian? this.readValuePairLE : this.readValuePairBE;
            writePair = this.writeValuePairDirty;
            if (this.dataWidth == 8 && this.getMachineConfig('ArrayBuffer') !== false) {
                this.buffer = new ArrayBuffer(this.size);
                this.dataView = new DataView(this.buffer, 0, this.size);
                /*
                * If littleEndian is true, we can use valuePairs[] and valueQuads[] directly; well, we can use
                * them whenever the offset is a multiple of 1, 2 or 4, respectively.  Otherwise, we must fallback
                * to dv.getUint8()/dv.setUint8(), dv.getUint16()/dv.setUint16() and dv.getInt32()/dv.setInt32().
                */
                this.values = new Uint8Array(this.buffer, 0, this.size);
                this.valuePairs = new Uint16Array(this.buffer, 0, this.size >> 1);
                this.valueQuads = new Int32Array(this.buffer, 0, this.size >> 2);
                readPair = this.littleEndian == LITTLE_ENDIAN? this.readValuePair16 : this.readValuePair16SE;
            }
        }

        this.fDirty = false;
        this.initValues(config['values']);

        switch(this.type) {
        case Memory.TYPE.NONE:
            this.readData = this.readNone;
            this.writeData = this.writeNone;
            this.readPair = this.readNonePair;
            this.writePair = this.writeNone;
            break;
        case Memory.TYPE.READONLY:
            this.readData = readValue;
            this.writeData = this.writeNone;
            this.readPair = readPair;
            this.writePair = this.writeNone;
            break;
        case Memory.TYPE.READWRITE:
            this.readData = readValue;
            this.writeData = writeValue;
            this.readPair = readPair;
            this.writePair = writePair;
            break;
        default:

            break;
        }

        /*
         * Additional block properties used for trapping reads/writes
         */
        this.nReadTraps = this.nWriteTraps = 0;
        this.readTrap = this.writeTrap = null;
        this.readDataOrig = this.writeDataOrig = null;
        this.readPairOrig = this.writePairOrig = null;
    }

    /**
     * initValues(values)
     *
     * @this {Memory}
     * @param {Array.<number>|undefined} values
     */
    initValues(values)
    {
        if (!this.values) {
            if (values) {

                this.values = values;
            } else {
                this.values = new Array(this.size).fill(this.dataLimit);
            }
        } else {
            if (values) {

                for (let i = 0; i < this.size; i++) {

                    this.values[i] = values[i];
                }
            }
        }
    }

    /**
     * onReset()
     *
     * Called by the Bus device to provide notification of a reset event.
     *
     * NOTE: Machines probably don't (and shouldn't) depend on the initial memory contents being zero, but this
     * can't hurt, and if we decide to save memory blocks in a compressed format (eg, RLE), this will help them compress.
     *
     * @this {Memory}
     */
    onReset()
    {
        if (this.type >= Memory.TYPE.READWRITE) this.values.fill(0);
    }

    /**
     * isDirty()
     *
     * @this {Memory}
     * @return {boolean}
     */
    isDirty()
    {
        if (this.fDirty) {
            this.fDirty = false;
            if (!this.nWriteTraps) {
                this.writeData = this.writeValueDirty;
                this.writePair = this.writeValuePairDirty;
            } else {
                this.writeDataOrig = this.writeValueDirty;
                this.writePairOrig = this.writeValuePairDirty;
            }
            return true;
        }
        return false;
    }

    /**
     * readNone(offset)
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number}
     */
    readNone(offset)
    {
        return this.dataLimit;
    }

    /**
     * readNonePair(offset)
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number}
     */
    readNonePair(offset)
    {
        if (this.littleEndian) {
            return this.readNone(offset) | (this.readNone(offset + 1) << this.dataWidth);
        } else {
            return this.readNone(offset + 1) | (this.readNone(offset) << this.dataWidth);
        }
    }

    /**
     * readValue(offset)
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number}
     */
    readValue(offset)
    {
        return this.values[offset];
    }

    /**
     * readValuePair(offset)
     *
     * This slow version is used with a dynamic (ie, I/O) bus only.
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset)
     * @return {number}
     */
    readValuePair(offset)
    {
        if (this.littleEndian) {
            return this.readValue(offset) | (this.readValue(offset + 1) << this.dataWidth);
        } else {
            return this.readValue(offset + 1) | (this.readValue(offset) << this.dataWidth);
        }
    }

    /**
     * readValuePairBE(offset)
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset)
     * @return {number}
     */
    readValuePairBE(offset)
    {
        return this.values[offset + 1] | (this.values[offset] << this.dataWidth);
    }

    /**
     * readValuePairLE(offset)
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset)
     * @return {number}
     */
    readValuePairLE(offset)
    {
        return this.values[offset] | (this.values[offset + 1] << this.dataWidth);
    }

    /**
     * readValuePair16(offset)
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset)
     * @return {number}
     */
    readValuePair16(offset)
    {
        return this.valuePairs[offset >>> 1];
    }

    /**
     * readValuePair16SE(offset)
     *
     * This function is neither big-endian (BE) or little-endian (LE), but rather "swap-endian" (SE), which
     * means there's a mismatch between our emulated machine and the host machine, so we call the appropriate
     * DataView function with the desired littleEndian setting.
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset)
     * @return {number}
     */
    readValuePair16SE(offset)
    {
        return this.dataView.getUint16(offset, this.littleEndian);
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

        this.values[offset] = value;
    }

    /**
     * writeValueDirty(offset, value)
     *
     * @this {Memory}
     * @param {number} offset
     * @param {number} value
     */
    writeValueDirty(offset, value)
    {

        this.values[offset] = value;
        this.fDirty = true;
        if (!this.nWriteTraps) {
            this.writeData = this.writeValue;
        } else {
            this.writeDataOrig = this.writeValue;
        }
    }

    /**
     * writeValuePair(offset, value)
     *
     * This slow version is used with a dynamic (ie, I/O) bus only.
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset)
     * @param {number} value
     */
    writeValuePair(offset, value)
    {
        if (this.littleEndian) {
            this.writeValue(offset, value & this.dataLimit);
            this.writeValue(offset + 1, value >> this.dataWidth);
        } else {
            this.writeValue(offset, value >> this.dataWidth);
            this.writeValue(offset + 1, value & this.dataLimit);
        }
    }

    /**
     * writeValuePairBE(offset, value)
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset)
     * @param {number} value
     */
    writeValuePairBE(offset, value)
    {

        this.values[offset] = value >> this.dataWidth;
        this.values[offset + 1] = value & this.dataLimit;
    }

    /**
     * writeValuePairLE(offset, value)
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset)
     * @param {number} value
     */
    writeValuePairLE(offset, value)
    {

        this.values[offset] = value & this.dataLimit;
        this.values[offset + 1] = value >> this.dataWidth;
    }

    /**
     * writeValuePair16(offset, value)
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset)
     * @param {number} value
     */
    writeValuePair16(offset, value)
    {
        let off = offset >>> 1;

        this.valuePairs[off] = value;
    }

    /**
     * writeValuePair16SE(offset, value)
     *
     * This function is neither big-endian (BE) or little-endian (LE), but rather "swap-endian" (SE), which
     * means there's a mismatch between our emulated machine and the host machine, so we call the appropriate
     * DataView function with the desired littleEndian setting.
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset)
     * @param {number} value
     */
    writeValuePair16SE(offset, value)
    {

        this.dataView.setUint16(offset, value, this.littleEndian);
    }

    /**
     * writeValuePairDirty(offset, value)
     *
     * @this {Memory}
     * @param {number} offset (must be an even block offset, because we will halve it to obtain a pair offset)
     * @param {number} value
     */
    writeValuePairDirty(offset, value)
    {
        if (!this.buffer) {
            if (this.littleEndian) {
                this.writeValuePairLE(offset, value);
                if (!this.nWriteTraps) {
                    this.writePair = this.writeValuePairLE;
                } else {
                    this.writePairOrig = this.writeValuePairLE;
                }
            } else {
                this.writeValuePairBE(offset, value);
                if (!this.nWriteTraps) {
                    this.writePair = this.writeValuePairBE;
                } else {
                    this.writePairOrig = this.writeValuePairBE;
                }
            }
        } else {
            if (this.littleEndian == LITTLE_ENDIAN) {
                this.writeValuePair16(offset, value);
                if (!this.nWriteTraps) {
                    this.writePair = this.writeValuePair16;
                } else {
                    this.writePairOrig = this.writeValuePair16;
                }
            } else {
                this.writeValuePair16SE(offset, value);
                if (!this.nWriteTraps) {
                    this.writePair = this.writeValuePair16SE;
                } else {
                    this.writePairOrig = this.writeValuePair16SE;
                }
            }
        }
    }

    /**
     * trapRead(func)
     *
     * I've decided to call the trap handler AFTER reading the value, so that we can pass the value
     * along with the address; for example, the Debugger might find that useful for its history buffer.
     *
     * Note that for blocks of type NONE, the base will be undefined, so function will not see the
     * original address, only the block offset.
     *
     * @this {Memory}
     * @param {function((number|undefined), number, number)} func (receives the base address, offset, and value written)
     * @return {boolean} true if trap successful, false if unsupported already trapped by another function
     */
    trapRead(func)
    {
        if (!this.nReadTraps) {
            let block = this;
            this.nReadTraps++;
            this.readTrap = func;
            this.readDataOrig = this.readData;
            this.readPairOrig = this.readPair;
            this.readData = function readDataTrap(offset) {
                let value = block.readDataOrig(offset);
                block.readTrap(block.addr, offset, value);
                return value;
            };
            this.readPair = function readPairTrap(offset) {
                let value = block.readPairOrig(offset);
                block.readTrap(block.addr, offset, value);
                block.readTrap(block.addr, offset + 1, value);
                return value;
            };
            return true;
        }
        if (this.readTrap == func) {
            this.nReadTraps++;
            return true;
        }
        return false;
    }

    /**
     * trapWrite(func)
     *
     * Note that for blocks of type NONE, the base will be undefined, so function will not see the original address,
     * only the block offset.
     *
     * @this {Memory}
     * @param {function((number|undefined), number, number)} func (receives the base address, offset, and value written)
     * @return {boolean} true if trap successful, false if unsupported already trapped by another function
     */
    trapWrite(func)
    {
        if (!this.nWriteTraps) {
            let block = this;
            this.nWriteTraps++;
            this.writeTrap = func;
            this.writeDataOrig = this.writeData;
            this.writePairOrig = this.writePair;
            this.writeData = function writeDataTrap(offset, value) {
                block.writeTrap(block.addr, offset, value);
                block.writeDataOrig(offset, value);
            };
            this.writePair = function writePairTrap(offset, value) {
                block.writeTrap(block.addr, offset, value);
                block.writeTrap(block.addr, offset + 1, value);
                block.writePairOrig(offset, value);
            };
            return true;
        }
        if (this.writeTrap == func) {
            this.nWriteTraps++;
            return true
        }
        return false;
    }

    /**
     * untrapRead(func)
     *
     * @this {Memory}
     * @param {function((number|undefined), number, number)} func (receives the base address, offset, and value read)
     * @return {boolean} true if untrap successful, false if no (or another) trap was in effect
     */
    untrapRead(func)
    {
        if (this.nReadTraps && this.readTrap == func) {
            if (!--this.nReadTraps) {
                this.readData = this.readDataOrig;
                this.readPair = this.readPairOrig;
                this.readDataOrig = this.readPairOrig = this.readTrap = null;
            }

            return true;
        }
        return false;
    }

    /**
     * untrapWrite(func)
     *
     * @this {Memory}
     * @param {function((number|undefined), number, number)} func (receives the base address, offset, and value written)
     * @return {boolean} true if untrap successful, false if no (or another) trap was in effect
     */
    untrapWrite(func)
    {
        if (this.nWriteTraps && this.writeTrap == func) {
            if (!--this.nWriteTraps) {
                this.writeData = this.writeDataOrig;
                this.writePair = this.writePairOrig;
                this.writeDataOrig = this.writePairOrig = this.writeTrap = null;
            }

            return true;
        }
        return false;
    }

    /**
     * loadState(state)
     *
     * Memory and Ports states are loaded by the Bus onLoad() handler, which calls our loadState() handler.
     *
     * @this {Memory}
     * @param {Array} state
     * @return {boolean}
     */
    loadState(state)
    {
        let idDevice = state.shift();
        if (this.idDevice == idDevice) {
            this.fDirty = state.shift();
            state.shift();      // formerly fDirtyEver, now unused
            this.initValues(this.decompress(state.shift(), this.size));
            return true;
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * Memory and Ports states are saved by the Bus onSave() handler, which calls our saveState() handler.
     *
     * @this {Memory}
     * @param {Array} state
     */
    saveState(state)
    {
        state.push(this.idDevice);
        state.push(this.fDirty);
        state.push(false);      // formerly fDirtyEver, now unused
        state.push(this.compress(this.values));
    }
}

/*
 * Memory block types use discrete bits so that enumBlocks() can be passed a set of combined types,
 * by OR'ing the desired types together.
 */
Memory.TYPE = {
    NONE:               0x01,
    READONLY:           0x02,
    READWRITE:          0x04,
    /*
     * The rest are not discrete memory types, but rather sets of types that are handy for enumBlocks().
     */
    READABLE:           0x0E,
    WRITABLE:           0x0C
};

Defs.CLASSES["Memory"] = Memory;

/**
 * @copyright https://www.pcjs.org/modules/devices/bus/ports.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ addr: number, size: number }} */
var PortsConfig;

/**
 * @class {Ports}
 * @unrestricted
 * @property {PortsConfig} config
 * @property {number} addr
 * @property {number} size
 * @property {number} type
 * @property {Object.<function(number)>} aInputs
 * @property {Object.<function(number,number)>} aOutputs
 */
class Ports extends Memory {
    /**
     * Ports(idMachine, idDevice, config)
     *
     * @this {Ports}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {PortsConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        this.bus.addBlocks(config['addr'], config['size'], config['type'], this);
        this.aInputs = {};
        this.aOutputs = {};
    }

    /**
     * addListener(port, input, output, device)
     *
     * @this {Ports}
     * @param {number} port
     * @param {function(number)|null} [input]
     * @param {function(number,number)|null} [output]
     * @param {Device} [device]
     */
    addListener(port, input, output, device)
    {
        if (input) {
            if (this.aInputs[port]) {
                throw new Error(this.sprintf("input listener for port %#0x already exists", port));
            }
            this.aInputs[port] = input.bind(device || this);
        }
        if (output) {
            if (this.aOutputs[port]) {
                throw new Error(this.sprintf("output listener for port %#0x already exists", port));
            }
            this.aOutputs[port] = output.bind(device || this);
        }
    }

    /**
     * readNone(offset)
     *
     * This overrides the default readNone() function, which is the default handler for all I/O ports.
     *
     * @this {Ports}
     * @param {number} offset
     * @return {number}
     */
    readNone(offset)
    {
        let port = this.addr + offset;
        let func = this.aInputs[port];
        if (func) {
            return func(port);
        }
        this.printf(MESSAGE.PORTS + MESSAGE.MISC, "readNone(%#04x): unknown port\n", port);
        return super.readNone(offset);
    }

    /**
     * writeNone(offset)
     *
     * This overrides the default writeNone() function, which is the default handler for all I/O ports.
     *
     * @this {Ports}
     * @param {number} offset
     * @param {number} value
     */
    writeNone(offset, value)
    {
        let port = this.addr + offset;
        let func = this.aOutputs[port];
        if (func) {
            func(port, value);
            return;
        }
        this.printf(MESSAGE.PORTS + MESSAGE.MISC, "writeNone(%#04x,%#04x): unknown port\n", port, value);
        super.writeNone(offset, value);
    }
}

Defs.CLASSES["Ports"] = Ports;

/**
 * @copyright https://www.pcjs.org/modules/devices/bus/ram.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ addr: number, size: number, type: (number|undefined) }} */
var RAMConfig;

/**
 * @class {RAM}
 * @unrestricted
 * @property {RAMConfig} config
 * @property {number} addr
 * @property {number} size
 * @property {number} type
 * @property {Array.<number>} values
 */
class RAM extends Memory {
    /**
     * RAM(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "ram": {
     *        "class": "RAM",
     *        "addr": 8192,
     *        "size": 1024,
     *        "bus": "busMemory"
     *      }
     *
     * @this {RAM}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {RAMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        config['type'] = Memory.TYPE.READWRITE;
        super(idMachine, idDevice, config);
        this.bus.addBlocks(config['addr'], config['size'], config['type'], this);
    }

    /**
     * reset()
     *
     * @this {RAM}
     */
    reset()
    {
    }
}

Defs.CLASSES["RAM"] = RAM;

/**
 * @copyright https://www.pcjs.org/modules/devices/bus/rom.js (C) Jeff Parsons 2012-2019
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
     *        "bus": "busIO"
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
        config['type'] = Memory.TYPE.READONLY;
        super(idMachine, idDevice, config);

        /*
         * The Memory constructor automatically finds the correct Bus for us.
         */
        this.bus.addBlocks(config['addr'], config['size'], config['type'], this);
        this.cpu = this.dbg = undefined;

        /*
         * If an "array" binding has been supplied, then create an LED array sufficiently large to represent the
         * entire ROM.  If data.length is an odd power-of-two, then we will favor a slightly wider array over a taller
         * one, by virtue of using Math.ceil() instead of Math.floor() for the columns calculation.
         */
        if (Defs.CLASSES["LED"] && this.bindings[ROM.BINDING.ARRAY]) {
            let rom = this;
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
            this.sCellDesc = this.getBindingText(ROM.BINDING.CELLDESC) || "";
            this.ledInput.addHover(function onROMHover(col, row) {
                if (rom.cpu) {
                    let sDesc = rom.sCellDesc;
                    if (col >= 0 && row >= 0) {
                        let offset = row * rom.cols + col;

                        let opcode = rom.values[offset];
                        sDesc = rom.cpu.toInstruction(rom.addr + offset, opcode);
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
     * @return {boolean}
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
     * onPower(on)
     *
     * Called by the Machine device to provide notification of a power event.
     *
     * @this {ROM}
     * @param {boolean} on (true to power on, false to power off)
     */
    onPower(on)
    {
        /*
         * We only care about the first power event, because it's a safe point to query the CPU.
         */
        if (this.cpu === undefined) {
            this.cpu = /* @type {CPU} */ (this.findDeviceByClass("CPU"));
        }
        /*
         * This is also a good time to get access to the Debugger, if any, and pass it symbol information, if any.
         */
        if (this.dbg === undefined) {
            this.dbg = /* @type {Debugger} */ (this.findDeviceByClass("Debugger", false));
            if (this.dbg && this.dbg.addSymbols) this.dbg.addSymbols(this.config['symbols']);
        }
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
     * @return {number}
     */
    readDirect(offset)
    {
        return this.values[offset];
    }

    /**
     * readValue(offset)
     *
     * This overrides the Memory readValue() function so that the LED array, if any, can track ROM accesses.
     *
     * @this {ROM}
     * @param {number} offset
     * @return {number}
     */
    readValue(offset)
    {
        if (this.ledArray) {
            this.ledArray.setLEDState(offset % this.cols, (offset / this.cols)|0, LED.STATE.ON, LED.FLAGS.MODIFIED);
        }
        return this.values[offset];
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
        this.values[offset] = value;
    }
}

ROM.BINDING = {
    ARRAY:      "array",
    CELLDESC:   "cellDesc"
};

Defs.CLASSES["ROM"] = ROM;

/**
 * @copyright https://www.pcjs.org/modules/devices/main/input.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ class: string, bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined), location: Array.<number>, map: (Array.<Array.<number>>|Object|undefined), drag: (boolean|undefined), scroll: (boolean|undefined), hexagonal: (boolean|undefined), releaseDelay: (number|undefined) }} */
var InputConfig;

 /** @typedef {{ keyNum: number, msDown: number, autoRelease: boolean }} */
var ActiveKey;

 /** @typedef {{ id: string, func: function(string,boolean) }} */
var KeyListener;

 /** @typedef {{ id: string, cxGrid: number, cyGrid: number, xGrid: number, yGrid: number, func: function(boolean) }} */
var SurfaceListener;

 /** @typedef {{ xInput: number, yInput: number, cxInput: number, cyInput: number, hGap: number, vGap: number, cxSurface: number, cySurface: number, xPower: number, yPower: number, cxPower: number, cyPower: number, nRows: number, nCols: number, cxButton: number, cyButton: number, cxGap: number, cyGap: number, xStart: number, yStart: number }} */
var SurfaceState;

/**
 * @class {Input}
 * @unrestricted
 * @property {InputConfig} config
 * @property {Array.<number>} location
 * @property {Array.<Array.<number>>|Object} map
 * @property {boolean} fDrag
 * @property {boolean} fScroll
 * @property {boolean} fHexagonal
 * @property {number} releaseDelay
 * @property {{
 *  surface: Element|undefined
 * }} bindings
 * @property {function(number,number)} onInput
 * @property {function(number,number)} onHover
 * @property {Array.<KeyListener>} aKeyListeners
 * @property {Array.<SurfaceListener>} aSurfaceListeners
 * @property {Array.<ActiveKey>} aActiveKeys
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

        this.messages = MESSAGE.INPUT;
        this.onInput = this.onHover = null;
        this.time = /** @type {Time} */ (this.findDeviceByClass("Time"));
        this.machine = /** @type {Machine} */ (this.findDeviceByClass("Machine"));

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
         * If 'hexagonal' is true, then we treat the input grid as hexagonal, where even rows of the associated
         * display are offset.
         */
        this.fHexagonal = this.getDefaultBoolean('hexagonal', false);

        /*
         * The 'releaseDelay' setting is necessary for devices (eg, old calculators) that are either too slow to
         * notice every input transition and/or have debouncing logic that would otherwise be defeated.
         */
        this.releaseDelay = this.getDefaultNumber('releaseDelay', 0);

        /*
         * This is set on receipt of the first 'touch' event of any kind, and is used by the 'mouse' event
         * handlers to disregard mouse events if set.
         */
        this.fTouch = false;

        /*
         * There are two supported configuration maps: a two-dimensional grid (gridMap) and a list of IDs (idMap).
         *
         * The two-dimensional button layouts do not (currently) support individual listeners; instead, any key event
         * that corresponds to a position within the button layout is transformed into an (x,y) position that is passed
         * on to a special function supplied to addInput().
         *
         * Any two-dimensional layout COULD be converted to a list of logical buttons, each with their own grid
         * coordinates, but for devices like calculators that have a natural grid design, the two-dimensional layout
         * is much simpler.
         *
         * Each ID in an idMap references an object with a "keys" array, a "grid" array, and a "state" value;
         * the code below ensures that every object has all three.  As "keys" go down and up (or mouse/touch events
         * occur within the "grid"), the corresponding "state" is updated (0 or 1).
         *
         * A third type of map (keyMap) is supported, but not as a configuration parameter; any keyMap must be supplied
         * by another device, via an addKeyMap() call.
         */
        let map = this.config['map'];
        this.gridMap = this.idMap = this.keyMap = null;

        if (map) {
            if (map.length) {
                this.gridMap = map;
            } else {
                this.idMap = {};
                let ids = Object.keys(map);
                for (let i = 0; i < ids.length; i++) {
                    let grid = [];
                    let id = ids[i];
                    let keys = map[id];
                    if (typeof keys == "string") {
                        keys = [keys];
                    } else if (keys.length == undefined) {
                        grid = keys['grid'];
                        keys = keys['keys'];
                        if (typeof keys == "string") keys = [keys];
                    }
                    let state = 0;
                    this.idMap[id] = {keys, grid, state};
                }
            }
        }

        this.aKeyListeners = [];
        this.aSurfaceListeners = [];

        this.altFocus = false;
        this.focusElement = this.altFocusElement = null;
        let element = this.bindings[Input.BINDING.SURFACE];
        if (element) this.addSurface(element, this.findBinding(config['focusBinding'], true), this.config['location']);

        this.onReset();
    }

    /**
     * addHover(onHover)
     *
     * @this {Input}
     * @param {function(number,number)} onHover
     */
    addHover(onHover)
    {
        this.onHover = onHover;
    }

    /**
     * addInput(onInput)
     *
     * Called by the CPU device to set up input notifications.
     *
     * @this {Input}
     * @param {function(number,number)} onInput
     */
    addInput(onInput)
    {
        this.onInput = onInput;
    }

    /**
     * addListener(type, id, func, init)
     *
     * @this {Input}
     * @param {string} type (see Input.TYPE)
     * @param {string} id
     * @param {function(string,boolean)|null} [func]
     * @param {number|boolean|string} [init] (initial state; treated as a boolean for the SWITCH type)
     * @return {boolean} (true if successful, false if not)
     */
    addListener(type, id, func, init)
    {
        if (type == Input.TYPE.IDMAP && this.idMap) {
            let map = this.idMap[id];
            if (map) {
                let keys = map.keys;
                if (keys && keys.length) {
                    this.aKeyListeners.push({id, func});
                }
                let grid = map.grid;
                if (grid && grid.length) {
                    this.aSurfaceListeners.push({id, cxGrid: grid[0], cyGrid: grid[1], xGrid: grid[2], yGrid: grid[3], func});
                }
                return true;
            }
            return false;
        }
        /*
         * The visual state of a SWITCH control (which could be a div or button or any other element) is controlled
         * by its class attribute -- specifically, the last class name in the attribute.  You must define two classes:
         * one that ends with "On" for the on (true) state and another that ends with "Off" for the off (false) state.
         *
         * The first addListener() call should include both your listener function and the initial state; the control's
         * class is automatically switched every time the control is clicked, and the newly switched state is passed to
         * your function.  If you need to change the state of the switch for other reasons, call addListener() with NO
         * function, just a new initial state.
         */
        if (type == Input.TYPE.SWITCH) {
            let element = this.findBinding(id, true);
            if (element) {
                let getClass = function() {
                    return element.getAttribute("class") || "";
                };
                let setClass = function(s) {
                    element.setAttribute("class", s);
                };
                let getState = function() {
                    return (getClass().slice(-2) == "On")? true : false;
                };
                let setState = function(state) {
                    setClass(getClass().replace(/(On|Off)$/, state? "On" : "Off"));
                    return state;
                };
                if (init != undefined) setState(init);
                if (func) {
                    element.addEventListener('click', function onSwitchClick() {
                        func(id, setState(!getState()));
                    });
                }
            }
            return false;
        }
        return false;
    }

    /**
     * addKeyMap(device, keyMap, clickMap)
     *
     * This records the caller's keyMap, changes onKeyCode() to record any physical keyCode
     * that exists in the keyMap as an active key, and allows the caller to use getActiveKey()
     * to get the mapped key of an active key.
     *
     * It also supports an optional clickMap, which lists a set of bindings that the caller
     * supports.  For every valid binding, we add an onclick handler that simulates a call to
     * onKeyCode() with the corresponding keyCode.
     *
     * @this {Input}
     * @param {Device} device
     * @param {Object} keyMap
     * @param {Object} [clickMap]
     * @return {boolean}
     */
    addKeyMap(device, keyMap, clickMap)
    {
        if (!this.keyMap) {
            let input = this;
            this.keyMap = keyMap;
            this.timerAutoRelease = this.time.addTimer("timerAutoRelease", function onAutoRelease() {
                input.checkAutoRelease();
            });
            if (clickMap) {
                for (let binding in clickMap) {
                    let element = device.bindings[binding];
                    if (element) {
                        element.addEventListener('click', function onKeyClick() {
                            input.onKeyCode(clickMap[binding], true, true);
                            input.setFocus();
                        });
                    }
                }
            }
            return true;
        }
        return false;
    }

    /**
     * checkKeyListeners(id, down)
     *
     * @this {Input}
     * @param {string} id
     * @param {boolean} down
     */
    checkKeyListeners(id, down)
    {
        for (let i = 0; i < this.aKeyListeners.length; i++) {
            let listener = this.aKeyListeners[i];
            if (listener.id == id) {
                listener.func(id, down);
            }
        }
    }

    /**
     * addSurface(inputElement, focusElement, location)
     *
     * @this {Input}
     * @param {Element} inputElement (surface element)
     * @param {Element|null} [focusElement] (should be provided if surface element is non-focusable)
     * @param {Array} [location]
     */
    addSurface(inputElement, focusElement, location = [])
    {
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
        if (location.length || this.gridMap || this.idMap) {
            let state = {};
            state.xInput = location[0] || 0;
            state.yInput = location[1] || 0;
            state.cxInput = location[2] || inputElement.clientWidth;
            state.cyInput = location[3] || inputElement.clientHeight;
            state.hGap = location[4] || 1.0;
            state.vGap = location[5] || 1.0;
            state.cxSurface = location[6] || inputElement.naturalWidth || state.cxInput;
            state.cySurface = location[7] || inputElement.naturalHeight || state.cyInput;
            state.xPower = location[8] || 0;
            state.yPower = location[9] || 0;
            state.cxPower = location[10] || 0;
            state.cyPower = location[11] || 0;
            if (this.gridMap) {
                state.nRows = this.gridMap.length;
                state.nCols = this.gridMap[0].length;
            } else {
                state.nCols = state.hGap;
                state.nRows = state.vGap;
                state.hGap = state.vGap = 0;
            }

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
            state.cxButton = (state.cxInput / (state.nCols + state.nCols * state.hGap))|0;
            state.cyButton = (state.cyInput / (state.nRows + state.nRows * state.vGap))|0;
            state.cxGap = (state.cxButton * state.hGap)|0;
            state.cyGap = (state.cyButton * state.vGap)|0;

            /*
             * xStart and yStart record the last 'touchstart' or 'mousedown' position on the surface
             * image; they will be reset to -1 when movement has ended (eg, 'touchend' or 'mouseup').
             */
            state.xStart = state.yStart = -1;

            this.captureMouse(inputElement, state);
            this.captureTouch(inputElement, state);

            /*
             * We use a timer for the touch/mouse release events, to ensure that the machine had
             * enough time to notice the input before releasing it.
             */
            if (this.time && this.releaseDelay) {
                let input = this;
                this.timerInputRelease = this.time.addTimer("timerInputRelease", function onInputRelease() {
                    if (state.xStart < 0 && state.yStart < 0) { // auto-release ONLY if it's REALLY released
                        input.setPosition(-1, -1);
                    }
                });
            }
        }

        if (this.gridMap || this.idMap || this.keyMap) {
            /*
             * This auto-releases the last key reported after an appropriate delay, to ensure that
             * the machine had enough time to notice the corresponding button was pressed.
             */
            if (this.time && this.releaseDelay) {
                let input = this;
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
            this.keyActive = "";
            this.keysPressed = [];

            /*
             * I'm attaching my key event handlers to the document object, since image elements are
             * not focusable.  I'm disinclined to do what I've done with other machines (ie, create an
             * invisible <textarea> overlay), because in this case, I don't really want a soft keyboard
             * popping up and obscuring part of the display.
             *
             * A side-effect, however, is that if the user attempts to explicitly give the image
             * focus, we don't have anything for focus to attach to.  We address that in onMouseDown(),
             * by redirecting focus to the "power" button, if any, not because we want that or any other
             * button to have focus, but simply to remove focus from any other input element on the page.
             */
            let element = inputElement;
            if (focusElement) {
                element = focusElement;
                if (!this.focusElement && focusElement.nodeName == "BUTTON") {
                    element = document;
                    this.focusElement = focusElement;
                    /*
                     * Although we've elected to attach key handlers to the document object in this case,
                     * we also attach to the inputElement as an alternative.
                     */
                    this.captureKeys(inputElement);
                    this.altFocusElement = inputElement;
                }
            }
            this.captureKeys(element);
            if (!this.focusElement) {
                this.focusElement = element;
            }
        }
    }

    /**
     * checkSurfaceListeners(action, x, y, cx, cy)
     *
     * @this {Input}
     * @param {number} action (eg, Input.ACTION.MOVE, Input.ACTION.PRESS, Input.ACTION.RELEASE)
     * @param {number} x (valid for MOVE and PRESS, not RELEASE)
     * @param {number} y (valid for MOVE and PRESS, not RELEASE)
     * @param {number} cx (width of the element that received the event)
     * @param {number} cy (height of the element that received the event)
     */
    checkSurfaceListeners(action, x, y, cx, cy)
    {
        if (action == Input.ACTION.PRESS || action == Input.ACTION.RELEASE) {
            for (let i = 0; i < this.aSurfaceListeners.length; i++) {
                let listener = this.aSurfaceListeners[i];
                if (action == Input.ACTION.RELEASE) {
                    listener.func(listener.id, false);
                    continue;
                }
                let cxSpan = (cx / listener.cxGrid)|0, xActive = (x / cxSpan)|0;
                let cySpan = (cy / listener.cyGrid)|0, yActive = (y / cySpan)|0;
                if (xActive == listener.xGrid && yActive == listener.yGrid) {
                    listener.func(listener.id, true);
                }
            }
        }
    }

    /**
     * advanceKeyState()
     *
     * @this {Input}
     */
    advanceKeyState()
    {
        if (!this.releaseDelay) {
            this.onKeyTimer();
        } else {
            this.time.setTimer(this.timerKeyRelease, this.releaseDelay);
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

        /**
         * isFocus(event)
         *
         * @param {Object} event
         * @return {Object|null}
         */
        let isFocus = function(event) {
            let activeElement = document.activeElement;
            if (!input.focusElement || activeElement == input.focusElement || activeElement == input.altFocusElement) {
                return event || window.event;
            }
            return null;
        };

        /**
         * printEvent(type, code, used)
         *
         * @param {string} type
         * @param {number} code
         * @param {boolean} [used]
         */
        let printEvent = function(type, code, used) {
            let activeElement = document.activeElement;
            input.printf(MESSAGE.KEY + MESSAGE.EVENT, "%s.onKey%s(%d): %5.2f (%s)\n", activeElement.id || activeElement.nodeName, type, code, (Date.now() / 1000) % 60, used != undefined? (used? "used" : "unused") : "ignored");
        };

        element.addEventListener(
            'keydown',
            function onKeyDown(event) {
                event = isFocus(event);
                if (event) {
                    let keyCode = event.which || event.keyCode;
                    let used = input.onKeyCode(keyCode, true);
                    printEvent("Down", keyCode, used);
                    if (used) event.preventDefault();
                }
            }
        );

        element.addEventListener(
            'keypress',
            function onKeyPress(event) {
                event = isFocus(event);
                if (event) {
                    let charCode = event.which || event.charCode;
                    let used = input.onKeyCode(charCode);
                    printEvent("Press", charCode, used);
                    if (used) event.preventDefault();
                }
            }
        );

        element.addEventListener(
            'keyup',
            function onKeyUp(event) {
                event = isFocus(event);
                if (event) {
                    let keyCode = event.which || event.keyCode;
                    input.onKeyCode(keyCode, false);
                    printEvent("Up", keyCode);
                    event.preventDefault();
                    if (element.nodeName == "TEXTAREA") element.value = "";
                }
            }
        );

        /*
         * The following onBlur() and onFocus() handlers are currently just for debugging purposes, but
         * PCx86 experience suggests that we may also eventually need them for future pointer-locking support.
         */
        if (DEBUG) {
            element.addEventListener(
                'blur',
                function onBlur(event) {
                    input.printf(MESSAGE.KEY + MESSAGE.EVENT, "onBlur(%s)\n", event.target.id || event.target.nodeName);
                }
            );
            element.addEventListener(
                'focus',
                function onFocus(event) {
                    input.printf(MESSAGE.KEY + MESSAGE.EVENT, "onFocus(%s)\n", event.target.id || event.target.nodeName);
                }
            );
        }
    }

    /**
     * captureMouse(element, state)
     *
     * @this {Input}
     * @param {Element} element
     * @param {SurfaceState} state
     */
    captureMouse(element, state)
    {
        let input = this;

        element.addEventListener(
            'mousedown',
            function onMouseDown(event) {
                if (input.fTouch) return;
                /*
                 * If there are any text input elements on the page that might currently have focus,
                 * this is a good time to divert focus to a focusable element of our own (eg, focusElement).
                 * Otherwise, key presses could be confusingly processed in two places.
                 *
                 * Unfortunately, setting focus on an element can cause the browser to scroll the element
                 * into view, so to avoid that, we use the following scrollTo() work-around.
                 */
                let focusElement = input.altFocus? input.altFocusElement : input.focusElement;
                if (focusElement) {
                    let x = window.scrollX, y = window.scrollY;
                    focusElement.focus();
                    window.scrollTo(x, y);
                }
                if (!event.button) {
                    input.onSurfaceEvent(element, Input.ACTION.PRESS, event, state);
                }
            }
        );

        element.addEventListener(
            'mousemove',
            function onMouseMove(event) {
                if (input.fTouch) return;
                input.onSurfaceEvent(element, Input.ACTION.MOVE, event, state);
            }
        );

        element.addEventListener(
            'mouseup',
            function onMouseUp(event) {
                if (input.fTouch) return;
                if (!event.button) {
                    input.onSurfaceEvent(element, Input.ACTION.RELEASE, event, state);
                }
            }
        );

        element.addEventListener(
            'mouseout',
            function onMouseOut(event) {
                if (input.fTouch) return;
                if (state.xStart < 0) {
                    input.onSurfaceEvent(element, Input.ACTION.MOVE, event, state);
                } else {
                    input.onSurfaceEvent(element, Input.ACTION.RELEASE, event, state);
                }
            }
        );
    }

    /**
     * captureTouch(element, state)
     *
     * @this {Input}
     * @param {Element} element
     * @param {SurfaceState} state
     */
    captureTouch(element, state)
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
                 * onSurfaceEvent() calls preventDefault(), which prevents a variety of potentially annoying
                 * behaviors (ie, zooming, scrolling, fake mouse events, etc).  Under non-normal circumstances,
                 * (ie, when fScroll is true), we set fTouch on receipt of a 'touchstart' event, which will
                 * help our mouse event handlers avoid any redundant actions due to fake mouse events.
                 */
                if (input.fScroll) input.fTouch = true;
                input.onSurfaceEvent(element, Input.ACTION.PRESS, event, state);
            }
        );

        element.addEventListener(
            'touchmove',
            function onTouchMove(event) {
                input.onSurfaceEvent(element, Input.ACTION.MOVE, event, state);
            }
        );

        element.addEventListener(
            'touchend',
            function onTouchEnd(event) {
                input.onSurfaceEvent(element, Input.ACTION.RELEASE, event, state);
            }
        );
    }

    /**
     * checkAutoRelease()
     *
     * Auto-release handler for active keys.
     *
     * @this {Input}
     */
    checkAutoRelease()
    {
        let i = 0;
        let msDelayMin = -1;
        while (i < this.aActiveKeys.length) {
            let activeKey = this.aActiveKeys[i];
            if (activeKey.autoRelease) {
                let keyNum = activeKey.keyNum;
                let msDown = activeKey.msDown;
                let msDuration = Date.now() - msDown;
                let msDelay = this.releaseDelay - msDuration;
                if (msDelay > 0) {
                    if (msDelayMin < 0 || msDelayMin > msDelay) {
                        msDelayMin = msDelay;
                    }
                } else {
                    /*
                     * Because the key is already in the auto-release state, this next call guarantees that the
                     * key will be removed from the array; a consequence of that removal, however, is that we must
                     * reset our array index to zero.
                     */
                    this.removeActiveKey(keyNum);
                    i = 0;
                    continue;
                }
            }
            i++;
        }
        if (msDelayMin >= 0) {
            this.time.setTimer(this.timerAutoRelease, msDelayMin);
        }
    }

    /**
     * getActiveKey(index)
     *
     * @this {Input}
     * @param {number} index
     * @return {number} (the requested active keyNum, -1 if none)
     */
    getActiveKey(index)
    {
        let keyNum = -1;
        if (index < this.aActiveKeys.length) {
            keyNum = this.aActiveKeys[index].keyNum;
        }
        return keyNum;
    }

    /**
     * getKeyState(id)
     *
     * @this {Input}
     * @param {string} id
     * @return {number|undefined} 1 if down, 0 if up, undefined otherwise
     */
    getKeyState(id)
    {
        let state;
        if (this.idMap) {
            let key = this.idMap[id];
            if (key) state = key.state;
        }
        return state;
    }

    /**
     * addActiveKey(keyNum, autoRelease)
     *
     * @this {Input}
     * @param {number|Array.<number>} keyNum
     * @param {boolean} [autoRelease]
     */
    addActiveKey(keyNum, autoRelease = false)
    {
        if (typeof keyNum != "number") {
            for (let i = 0; i < keyNum.length; i++) {
                this.addActiveKey(keyNum[i]);
            }
            return;
        }
        let i = this.isActiveKey(keyNum);
        let msDown = Date.now();
        if (i < 0) {
            this.aActiveKeys.push({
                keyNum, msDown, autoRelease
            });
            this.printf(MESSAGE.KEY + MESSAGE.INPUT, "addActiveKey(keyNum=%d)\n", keyNum);
        } else {
            this.aActiveKeys[i].msDown = msDown;
            this.aActiveKeys[i].autoRelease = autoRelease;
        }
        if (autoRelease) this.checkAutoRelease();
    }

    /**
     * isActiveKey(keyNum)
     *
     * @this {Input}
     * @param {number} keyNum
     * @return {number} index of keyNum in aActiveKeys, or -1 if not found
     */
    isActiveKey(keyNum)
    {
        for (let i = 0; i < this.aActiveKeys.length; i++) {
            if (this.aActiveKeys[i].keyNum == keyNum) return i;
        }
        return -1;
    }

    /**
     * removeActiveKey(keyNum)
     *
     * @this {Input}
     * @param {number|Array.<number>} keyNum
     */
    removeActiveKey(keyNum)
    {
        if (typeof keyNum != "number") {
            for (let i = 0; i < keyNum.length; i++) {
                this.removeActiveKey(keyNum[i]);
            }
            return;
        }
        let i = this.isActiveKey(keyNum);
        if (i >= 0) {
            let activeKey = this.aActiveKeys[i];
            let msNow = Date.now();
            let msDown = activeKey.msDown;

            let msDuration = msNow - msDown;
            if (msDuration < this.releaseDelay) {
                activeKey.autoRelease = true;
                this.checkAutoRelease();
                return;
            }
            this.printf(MESSAGE.KEY + MESSAGE.INPUT, "removeActiveKey(keyNum=%d,duration=%dms,autoRelease=%b)\n", keyNum, msDuration, activeKey.autoRelease);
            this.aActiveKeys.splice(i, 1);
        } else {
            this.printf(MESSAGE.KEY + MESSAGE.INPUT, "removeActiveKey(keyNum=%d): up without down?\n", keyNum);
        }
    }

    /**
     * onKeyCode(code, down, autoRelease)
     *
     * @this {Input}
     * @param {number} code (ie, keyCode if down is defined, charCode if undefined)
     * @param {boolean} [down] (true if keydown, false if keyup, undefined if keypress)
     * @param {boolean} [autoRelease]
     * @return {boolean} (true if processed, false if not)
     */
    onKeyCode(code, down, autoRelease=false)
    {
        let keyCode, keyName;
        if (down != undefined) {
            keyCode = WebIO.FF_KEYCODE[code] || code;       // fix any Firefox-specific keyCodes
            keyName = WebIO.KEYNAME[code];
        } else {
            keyCode = 0;
            keyName = String.fromCharCode(code).toUpperCase();
        }
        if (this.gridMap) {
            if (down === false) return true;
            for (let row = 0; row < this.gridMap.length; row++) {
                let rowMap = this.gridMap[row];
                for (let col = 0; col < rowMap.length; col++) {
                    let aParts = rowMap[col].split('|');
                    if (aParts.indexOf(keyName) >= 0) {
                        if (this.keyState) {
                            if (this.keysPressed.length < 16) {
                                this.keysPressed.push(code);
                            }
                        } else {
                            this.keyState = 1;
                            this.keyActive = keyName;
                            this.setPosition(col, row);
                            this.checkKeyListeners(keyName, true);
                            this.advanceKeyState();
                        }
                        return true;
                    }
                }
            }
        }
        if (this.idMap) {
            if (down != undefined) {
                let ids = Object.keys(this.idMap);
                for (let i = 0; i < ids.length; i++) {
                    let id = ids[i];
                    if (this.idMap[id].keys.indexOf(keyName) >= 0) {
                        this.checkKeyListeners(id, down);
                        this.idMap[id].state = down? 1 : 0;
                        return true;
                    }
                }
            }
        }
        if (this.keyMap) {
            if (!keyCode) {
                return true;            // if we received a charCode rather than a keyCode, just consume it
            }
            let keyNum = this.keyMap[keyCode];
            if (keyNum) {
                if (down) {
                    this.addActiveKey(keyNum, autoRelease);
                } else {
                    this.removeActiveKey(keyNum);
                }
                return true;            // success is automatic when the keyCode is in the keyMap; consume it
            }
        }
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
            this.checkKeyListeners(this.keyActive, false);
            this.keyActive = "";
            this.setPosition(-1, -1);
            this.advanceKeyState();
        } else {
            this.keyState = 0;
            if (this.keysPressed.length) {
                this.onKeyCode(this.keysPressed.shift());
            }
        }
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {Input}
     */
    onReset()
    {
        /*
         * As keyDown events are encountered, the event keyCode is checked against the active keyMap, if any.
         * If the keyCode exists in the keyMap, then each keyNum in the keyMap is added to the aActiveKeys array.
         * As each key is released (or auto-released), its entry is removed from the array.
         */
        this.aActiveKeys = [];

        /*
         * The current (assumed) physical (and simulated) states of the various shift/lock keys.
         *
         * TODO: Determine how (or whether) we can query the browser's initial shift/lock key states.
         */
        this.bitsState = 0;

        /*
         * Finally, the active input state.  If there is no active input, col and row are -1.  After
         * this point, these variables will be updated by setPosition().
         */
        this.col = this.row = -1;
    }

    /**
     * onSurfaceEvent(element, action, event, state)
     *
     * @this {Input}
     * @param {Element} element
     * @param {number} action
     * @param {Event} event (eg, the MouseEvent or TouchEvent from an 'mouse' or 'touch' event listener)
     * @param {SurfaceState} state
     */
    onSurfaceEvent(element, action, event, state)
    {
        let col = -1, row = -1;
        let fMultiTouch = false;
        let x = -1, y = -1, xInput, yInput, fButton, fInput, fPower;

        if (action < Input.ACTION.RELEASE) {

            /**
             * @name Event
             * @property {Array} targetTouches
             */
            event = event || window.event;
            if (!event.targetTouches || !event.targetTouches.length) {
                x = event.clientX;
                y = event.clientY;
            } else {
                x = event.targetTouches[0].clientX;
                y = event.targetTouches[0].clientY;
                fMultiTouch = (event.targetTouches.length > 1);
            }

            /*
             * The following code replaces the older code below it.  It requires that we use clientX and clientY
             * instead of pageX and pageY from the targetTouches array.  The older code seems to be completely broken
             * whenever the page is full-screen, hence this change.
             */
            let rect = event.target.getBoundingClientRect();
            x -= rect.left;
            y -= rect.top;

            /*
             * Touch coordinates (that is, the pageX and pageY properties) are relative to the page, so to make
             * them relative to the element, we must subtract the element's left and top positions.  This Apple document:
             *
             *      https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/AddingMouseandTouchControlstoCanvas/AddingMouseandTouchControlstoCanvas.html
             *
             * makes it sound simple, but it turns out we have to walk the element's entire "parentage" of DOM elements to
             * get the exact offsets.
             *
             *      let xOffset = 0;
             *      let yOffset = 0;
             *      let elementNext = element;
             *      do {
             *          if (!isNaN(elementNext.offsetLeft)) {
             *              xOffset += elementNext.offsetLeft;
             *              yOffset += elementNext.offsetTop;
             *          }
             *      } while ((elementNext = elementNext.offsetParent));
             *      x -= xOffset;
             *      y -= yOffset;
             */

            /*
             * Due to the responsive nature of our pages, the displayed size of the surface image may be smaller than
             * the original size, and the coordinates we receive from events are based on the currently displayed size.
             */
            x = (x * (state.cxSurface / element.offsetWidth))|0;
            y = (y * (state.cySurface / element.offsetHeight))|0;

            xInput = x - state.xInput;
            yInput = y - state.yInput;

            /*
             * fInput is set if the event occurred somewhere within the input region (ie, the calculator keypad),
             * either on a button or between buttons, whereas fButton is set if the event occurred squarely (rectangularly?)
             * on a button.  fPower deals separately with the power button; it is set if the event occurred on the
             * power button.
             */
            fInput = fButton = false;
            fPower = (x >= state.xPower && x < state.xPower + state.cxPower && y >= state.yPower && y < state.yPower + state.cyPower);

            /*
             * I use the top of the input region, less some gap, to calculate a dividing line, above which
             * default actions should be allowed, and below which they should not.  Ditto for any event inside
             * the power button.
             */
            if (xInput >= 0 && xInput < state.cxInput && yInput + state.cyGap >= 0 || fPower) {
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

                if (xInput >= 0 && xInput < state.cxInput && yInput >= 0 && yInput < state.cyInput) {
                    fInput = true;
                    /*
                     * The width and height of each column and row could be determined by computing cxGap + cxButton
                     * and cyGap + cyButton, respectively, but those gap and button sizes are merely estimates, and should
                     * only be used to help with the final button coordinate checks farther down.
                     */
                    let cxCol = (state.cxInput / state.nCols) | 0;
                    let cyCol = (state.cyInput / state.nRows) | 0;
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
                        if (colInput == state.nCols - 1) xInput = -1;
                    }

                    /*
                     * (xCol,yCol) will be the top left corner of the button closest to the point of input.  However, that's
                     * based on our gap estimate.  If things seem "too tight", shrink the gap estimates, which will automatically
                     * increase the button size estimates.
                     */
                    let xCol = colInput * cxCol + (state.cxGap >> 1);
                    let yCol = rowInput * cyCol + (state.cyGap >> 1);

                    xInput -= xCol;
                    yInput -= yCol;
                    if (xInput >= 0 && xInput < state.cxButton && yInput >= 0 && yInput < state.cyButton) {
                        col = colInput;
                        row = rowInput;
                        fButton = true;
                    }
                }
            }
        }

        this.checkSurfaceListeners(action, xInput || 0, yInput || 0, element.offsetWidth, element.offsetHeight);

        if (fMultiTouch) return;

        if (action == Input.ACTION.PRESS) {
            /*
             * Record the position of the event, transitioning xStart and yStart to non-negative values.
             */
            state.xStart = x;
            state.yStart = y;
            if (fInput) {
                /*
                 * The event occurred in the input region, so we call setPosition() regardless of whether
                 * it hit or missed a button.
                 */
                this.setPosition(col, row);
                /*
                 * On the other hand, if it DID hit a button, then we arm the auto-release timer, to ensure
                 * a minimum amount of time (ie, releaseDelay).
                 */
                if (fButton && this.releaseDelay) {
                    this.time.setTimer(this.timerInputRelease, this.releaseDelay, true);
                }
            } else if (fPower) {
                this.machine.onPower();
            }
        }
        else if (action == Input.ACTION.MOVE) {
            if (state.xStart >= 0 && state.yStart >= 0 && this.fDrag) {
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
            if (!this.releaseDelay || !this.time.isTimerSet(this.timerInputRelease)) {
                this.setPosition(-1, -1);
            }
            state.xStart = state.yStart = -1;
        }
        else {
            this.println("unrecognized action: " + action);
        }
    }

    /**
     * setFocus()
     *
     * If we have a focusable input element, give it focus.  This is used by the Debugger, for example, to switch focus
     * after starting the machine.
     *
     * @this {Input}
     */
    setFocus()
    {
        /*
         * In addition, we now check machine.ready, to avoid jerking the page's focus around when a machine is first
         * powered; it won't be marked ready until all the onPower() calls have completed, including the CPU's onPower()
         * call, which in turn calls setFocus().
         */
        let focusElement = this.altFocus? this.altFocusElement : this.focusElement;
        if (focusElement && this.machine.ready) {
            this.printf('setFocus("%s")\n', focusElement.id || focusElement.nodeName);
            focusElement.focus();
            focusElement.scrollIntoView();      // one would have thought focus() would do this, but apparently not....
        }
    }

    /**
     * setAltFocus(fAlt)
     *
     * When a device (eg, Monitor) needs us to use altFocusElement as the input focus (eg, when the machine is running
     * full-screen), it calls setAltFocus(true).
     *
     * @this {Input}
     * @param {boolean} fAlt
     */
    setAltFocus(fAlt)
    {
        this.altFocus = fAlt;
        this.setFocus();
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

Input.TYPE = {
    IDMAP:      "idMap",
    SWITCH:     "switch"
};

Defs.CLASSES["Input"] = Input;

/**
 * @copyright https://www.pcjs.org/modules/devices/main/led.js (C) Jeff Parsons 2012-2019
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
 * However, our devices operate at a higher level.  They use setLEDState() to modify the state,
 * character, etc, that each of the LED cells should display, which updates our internal LED buffer.  Then
 * at whatever display refresh rate is set (typically 60Hz), drawBuffer() is called to see if the buffer
 * contents have been modified since the last refresh, and if so, it converts the contents of the buffer to
 * a string and calls drawString().
 *
 * This buffering strategy, combined with the buffer "tickled" flag (see below), not only makes life
 * simple for this device, but also simulates how the display goes blank for short periods of time while
 * the CPU is busy performing calculations.
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
        super(idMachine, idDevice, config, ["color", "backgroundColor"]);

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

        this.type = this.getBounded(this.getDefaultNumber('type', LED.TYPE.ROUND, LED.TYPES), LED.TYPE.SMALL, LED.TYPE.DIGIT);
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
         * with changes to the overall window size), so we apply the following style attributes:
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
        this.time = /** @type {Time} */ (this.findDeviceByClass("Time"));
        this.time.addAnimation(function ledAnimate(t) {
            led.drawBuffer(false, t);
        });

        led.clearBuffer(true);
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
     * @return {Array}
     */
    getBuffer()
    {
        return this.buffer;
    }

    /**
     * getBufferClone()
     *
     * @this {LED}
     * @return {Array}
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
     * @return {string}
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
     * @return {boolean}
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
     * @return {boolean}
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
     * @return {number}
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
     * @return {number|undefined}
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
     * @return {string}
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
     * @return {string|undefined}
     */
    getRGBColor(color, colorDefault)
    {
        color = color || colorDefault;
        return color && WebIO.COLORS[color] || color;
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
     * @return {string}
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
     * @return {string}
     */
    getRGBAColor(color, alpha = 1.0, brightness = 1.0)
    {
        if (color) {
            let rgb = [];
            color = WebIO.COLORS[color] || color;
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
     * @return {boolean}
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
     * @return {boolean}
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
     * @return {boolean|null} (true if this call modified the LED color, false if not, null if error)
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
     * @return {boolean|null} (true if this call modified the LED color, false if not, null if error)
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
     * @return {boolean|null} (true if this call modified the LED state, false if not, null if error)
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
     * @return {boolean} (true if this call modified the LED state, false if not)
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

LED.TYPES = {
    "small":    LED.TYPE.SMALL,
    "round":    LED.TYPE.ROUND,
    "square":   LED.TYPE.SQUARE,
    "digit":    LED.TYPE.DIGIT
};

LED.BINDING = {
    CONTAINER:  "container"
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

Defs.CLASSES["LED"] = LED;

/**
 * @copyright https://www.pcjs.org/modules/devices/main/monitor.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ monitorWidth: number, monitorHeight: number }} */
var MonitorConfig;

/**
 * @class {Monitor}
 * @unrestricted
 * @property {MonitorConfig} config
 */
class Monitor extends Device {
    /**
     * Monitor(idMachine, idDevice, config)
     *
     * The Monitor component manages the container representing the machine's display device.  The most
     * important config properties include:
     *
     *      monitorWidth: width of the monitor canvas, in pixels
     *      monitorHeight: height of the monitor canvas, in pixels
     *      monitorColor: background color of the monitor canvas (default is black)
     *      monitorRotate: the amount of counter-clockwise monitor rotation required (eg, -90 or 270)
     *      aspectRatio (eg, 1.33)
     *
     * NOTE: I originally wanted to call this the Screen device, but alas, the browser world has co-opted that
     * name, so I had to settle for Monitor instead (I had also considered Display, but that seemed too generic).
     *
     * Monitor is probably a better choice anyway, because that allows us to clearly differentiate between the
     * "host display" (which involves the browser's page, document, window, or screen, depending on the context)
     * and the "guest display", which I now try to consistently refer to as the Monitor.
     *
     * There are still terms of art that can muddy the waters; for example, many video devices support the concept
     * of "off-screen memory", and sure, I could call that "off-monitor memory", but let's not get carried away.
     *
     * @this {Monitor}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ROMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        let sProp, sEvent;
        let monitor = this;

        this.touchType = config['touchType'];
        this.diagnostics = config['diagnostics'];

        this.cxMonitor = config['monitorWidth'] || 640;
        this.cyMonitor = config['monitorHeight'] || 480;

        this.monitor = this.bindings[Monitor.BINDING.MONITOR];
        if (this.monitor) {
            /*
             * Making sure the monitor had a "tabindex" attribute seemed like a nice way of ensuring we
             * had a single focusable surface that we could pass to our Input device, but that would be too
             * simple.  Safari once again bites us in the butt, just like it did when we tried to add the
             * "contenteditable" attribute to the canvas: painting slows to a crawl.
             *
             *      this.monitor.setAttribute("tabindex", "0");
             */
        } else {
            throw new Error("unable to find binding: " + Monitor.BINDING.MONITOR);
        }
        this.container = this.findBinding(Monitor.BINDING.CONTAINER) || this.monitor;

        /*
         * Create the Monitor canvas if we weren't given a predefined canvas; we'll assume that an existing
         * canvas is already contained within the monitor.
         */
        let canvas = this.bindings[Monitor.BINDING.SURFACE];
        if (!canvas) {
            canvas = document.createElement("canvas");
            let id = this.getBindingID(Monitor.BINDING.SURFACE);
            if (id) {
                this.bindings[id] = canvas;
                canvas.setAttribute("id", id);
            }
            canvas.setAttribute("class", "pcjsSurface");
            canvas.setAttribute("width", config['monitorWidth']);
            canvas.setAttribute("height", config['monitorHeight']);
            canvas.style.backgroundColor = config['monitorColor'] || "black";
            this.monitor.appendChild(canvas);
        }
        this.canvasMonitor = canvas;

        /*
         * The "contenteditable" attribute on a canvas is a simple way of creating a display surface that can
         * also receive focus and generate input events.  Unfortunately, in Safari, that attribute NOTICEABLY
         * slows down canvas operations whenever it has focus.  All you have to do is click away from the canvas,
         * and drawing speeds up, then click back on the canvas, and drawing slows down.  So we now rely on a
         * "transparent textarea" solution (see below).
         *
         *      canvas.setAttribute("contenteditable", "true");
         */

        let context = canvas.getContext("2d");
        this.contextMonitor = context;

        /*
         * HACK: A canvas style of "auto" provides for excellent responsive canvas scaling in EVERY browser
         * except IE9/IE10, so I recalculate the appropriate CSS height every time the parent div is resized;
         * IE11 works without this hack, so we take advantage of the fact that IE11 doesn't identify as "MSIE".
         *
         * The other reason it's good to keep this particular hack limited to IE9/IE10 is that most other
         * browsers don't actually support an 'onresize' handler on anything but the window object.
         */
        if (this.isUserAgent("MSIE")) {
            this.monitor.onresize = function(parentElement, childElement, cx, cy) {
                return function onResizeScreen() {
                    childElement.style.height = (((parentElement.clientWidth * cy) / cx) | 0) + "px";
                };
            }(this.monitor, canvas, config['monitorWidth'], config['monitorHeight']);
            this.monitor.onresize();
        }

        /*
         * The following is a related hack that allows the user to force the monitor to use a particular aspect
         * ratio if an 'aspect' attribute or URL parameter is set.  Initially, it's just for testing purposes
         * until we figure out a better UI.  And note that we use our onPageEvent() helper function to make sure
         * we don't trample any other 'onresize' handler(s) attached to the window object.
         */
        let aspect = +(config['aspect'] || this.getURLParms()['aspect']);

        /*
         * No 'aspect' parameter yields NaN, which is falsey, and anything else must satisfy my arbitrary
         * constraints of 0.3 <= aspect <= 3.33, to prevent any useless (or worse, browser-blowing) results.
         */
        if (aspect && aspect >= 0.3 && aspect <= 3.33) {
            this.onPageEvent('onresize', function(parentElement, childElement, aspectRatio) {
                return function onResizeWindow() {
                    /*
                     * Since aspectRatio is the target width/height, we have:
                     *
                     *      parentElement.clientWidth / childElement.style.height = aspectRatio
                     *
                     * which means that:
                     *
                     *      childElement.style.height = parentElement.clientWidth / aspectRatio
                     *
                     * so for example, if aspectRatio is 16:9, or 1.78, and clientWidth = 640,
                     * then the calculated height should approximately 360.
                     */
                    childElement.style.height = ((parentElement.clientWidth / aspectRatio)|0) + "px";
                };
            }(this.monitor, canvas, aspect));
            window['onresize']();
        }

        /*
         * Here's the gross code to handle full-screen support across all supported browsers.  Most of the crud is
         * now buried inside findProperty(), which checks for all the browser prefix variations (eg, "moz", "webkit")
         * and deals with certain property name variations, like 'Fullscreen' (new) vs 'FullScreen' (old).
         */
        this.machine.isFullScreen = false;
        this.fullScreen = this.fullScreenStyle = false;
        let button = this.bindings[Monitor.BINDING.FULLSCREEN];
        if (button) {
            sProp = this.findProperty(this.container, 'requestFullscreen');
            if (sProp) {
                this.container.doFullScreen = this.container[sProp];
                this.fullScreen = true;
                this.fullScreenStyle = document.fullscreenEnabled || this.isUserAgent("Edge/");
                sEvent = this.findProperty(document, 'on', 'fullscreenchange');
                if (sEvent) {
                    let sFullScreen = this.findProperty(document, 'fullscreenElement');
                    document.addEventListener(sEvent, function onFullScreenChange() {
                        monitor.onFullScreen(document[sFullScreen] != null);
                    }, false);
                }
                sEvent = this.findProperty(document, 'on', 'fullscreenerror');
                if (sEvent) {
                    document.addEventListener(sEvent, function onFullScreenError() {
                        monitor.onFullScreen();
                    }, false);
                }
            } else {
                this.printf("Full-screen API not available\n");
                button.parentNode.removeChild(/** @type {Node} */ (button));
            }
        }

        /*
         * The 'touchType' config property can be set to true for machines that require a full keyboard.  If set,
         * we create a transparent textarea "overlay" on top of the canvas and provide it to the Input device
         * via addSurface(), making it easy for the user to activate the on-screen keyboard for touch-type devices.
         *
         * The parent div must have a style of "position:relative", so that we can position the textarea using
         * "position:absolute" with "top" and "left" coordinates of zero.  And we don't want the textarea to be
         * visible, but we must use "opacity:0" instead of "visibility:hidden", because the latter seems to
         * prevent the element from receiving events.
         *
         * All these styling requirements are resolved by using CSS class "pcjsSurface" for the parent div and
         * CSS class "pcjsOverlay" for the textarea.
         *
         * Having the textarea can serve other useful purposes as well, such as providing a place for us to echo
         * diagnostic messages, and it solves the Safari performance problem I observed (see above).  Unfortunately,
         * it creates new challenges, too.  For example, textareas can cause certain key combinations, like "Alt-E",
         * to be withheld as part of the browser's support for multi-key character composition.  So I may have to
         * alter which element on the page gets focus depending on the platform or other factors.
         *
         * Why do we ALSO create an overlay if fullScreen support is requested ONLY on non-iOS devices?  Because
         * we generally always need a surface for capturing keyboard events on desktop devices, whereas you're
         * supposed to use 'touchType' if you really need keyboard events on iOS devices (ie, we don't want the
         * iPhone or iPad soft keyboard popping up unnecessarily).
         */
        let textarea;
        if (this.touchType || this.diagnostics || this.fullScreen && !this.isUserAgent("iOS")) {
            textarea = document.createElement("textarea");
            let id = this.getBindingID(Monitor.BINDING.OVERLAY);
            if (id) {
                this.bindings[id] = textarea;
                textarea.setAttribute("id", id);
            }
            textarea.setAttribute("class", "pcjsOverlay");
            /*
            * The soft keyboard on an iOS device tends to pop up with the SHIFT key depressed, which is not the
            * initial keyboard state we prefer, so hopefully turning off these "auto" attributes will help.
            */
            if (this.isUserAgent("iOS")) {
                this.disableAuto(textarea);
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
            this.monitor.appendChild(textarea);
        }

        /*
         * If there's an Input device, make sure it is associated with our default input surface.
         */
        this.input = /** @type {Input} */ (this.findDeviceByClass("Input", false));
        if (this.input) {
            this.input.addSurface(textarea || this.monitor, this.findBinding(config['focusBinding'], true));
        }

        /*
         * These variables are here in case we want/need to add support for borders later...
         */
        this.xMonitorOffset = this.yMonitorOffset = 0;
        this.cxMonitorOffset = this.cxMonitor;
        this.cyMonitorOffset = this.cyMonitor;

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
        this.sSmoothing = this.findProperty(context, 'imageSmoothingEnabled');

        this.rotateMonitor = config['monitorRotate'];
        if (this.rotateMonitor) {
            this.rotateMonitor = this.rotateMonitor % 360;
            if (this.rotateMonitor > 0) this.rotateMonitor -= 360;
            /*
             * TODO: Consider also disallowing any rotateMonitor value if bufferRotate was already set; setting
             * both is most likely a mistake, but who knows, maybe someone wants to use both for 180-degree rotation?
             */
            if (this.rotateMonitor != -90) {
                this.printf("unsupported monitor rotation: %d\n", this.rotateMonitor);
                this.rotateMonitor = 0;
            } else {
                context.translate(0, this.cyMonitor);
                context.rotate((this.rotateMonitor * Math.PI)/180);
                context.scale(this.cyMonitor/this.cxMonitor, this.cxMonitor/this.cyMonitor);
            }
        }
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Monitor}
     * @param {string} binding
     * @param {Element} element
     */
    addBinding(binding, element)
    {
        let monitor = this;

        switch(binding) {
        case Monitor.BINDING.FULLSCREEN:
            element.onclick = function onClickFullScreen() {
                /*
                 * I've encountered situations in Safari on iPadOS where full-screen mode was cancelled without
                 * notification via onFullScreen() (eg, diagnostic printf() calls that used to inadvertently change
                 * focus), so we'd mistakenly think we were still full-screen.
                 *
                 * print() attempts to avoid focus changes on "iOS" devices now, but the following sanity check
                 * still seems worthwhile.
                 */
                monitor.machine.isFullScreen = (window.outerHeight - window.innerHeight <= 1);
                if (!monitor.machine.isFullScreen) {
                    monitor.doFullScreen();
                } else {
                    if (DEBUG) monitor.printf(MESSAGE.MONITOR, "onClickFullScreen(): already full-screen?\n");
                }
            };
            break;
        }
        super.addBinding(binding, element);
    }

    /**
     * blankMonitor()
     *
     * @this {Monitor}
     */
    blankMonitor()
    {
        if (this.contextMonitor) {
            this.contextMonitor.fillStyle = "black";
            this.contextMonitor.fillRect(0, 0, this.canvasMonitor.width, this.canvasMonitor.height);
        }
    }

    /**
     * doFullScreen()
     *
     * @this {Monitor}
     * @return {boolean} true if request successful, false if not (eg, failed OR not supported)
     */
    doFullScreen()
    {
        let fSuccess = false;
        if (DEBUG) this.printf(MESSAGE.MONITOR, "doFullScreen()\n");
        if (this.container && this.container.doFullScreen) {
            /*
             * Styling the container with a width of "100%" and a height of "auto" works great when the aspect ratio
             * of our virtual monitor is at least roughly equivalent to the physical screen's aspect ratio, but now that
             * we support virtual VGA monitors with an aspect ratio of 1.33, that's very much out of step with modern
             * wide-screen monitors, which usually have an aspect ratio of 1.6 or greater.
             *
             * And unfortunately, none of the browsers I've tested appear to make any attempt to scale our container to
             * the physical screen's dimensions, so the bottom of our monitor gets clipped.  To prevent that, I reduce
             * the width from 100% to whatever percentage will accommodate the entire height of the virtual monitor.
             *
             * NOTE: Mozilla recommends both a width and a height of "100%", but all my tests suggest that using "auto"
             * for height works equally well, so I'm sticking with it, because "auto" is also consistent with how I've
             * implemented a responsive canvas when the browser window is being resized.
             */
            let sWidth = "100%";
            let sHeight = "auto";
            if (screen && screen.width && screen.height) {
                let aspectPhys = screen.width / screen.height;
                let aspectVirt = this.cxMonitor / this.cyMonitor;
                if (aspectPhys > aspectVirt) {
                    sWidth = Math.round(aspectVirt / aspectPhys * 100) + '%';
                }
                // TODO: We may need to someday consider the case of a physical screen with an aspect ratio < 1.0....
            }
            if (!this.fullScreenStyle) {
                this.container.style.width = sWidth;
                this.container.style.height = sHeight;
            } else {
                /*
                 * Sadly, the above code doesn't work for Firefox (nor for Chrome, as of Chrome 75 or so), because as
                 * http://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode explains:
                 *
                 *      'It's worth noting a key difference here between the Gecko and WebKit implementations at this time:
                 *      Gecko automatically adds CSS rules to the element to stretch it to fill the screen: "width: 100%; height: 100%".
                 *
                 * Which would be OK if Gecko did that BEFORE we're called, but apparently it does that AFTER, effectively
                 * overwriting our careful calculations.  So we style the inner element (canvasMonitor) instead, which
                 * requires even more work to ensure that the canvas is properly centered.  FYI, this solution is consistent
                 * with Mozilla's recommendation for working around their automatic CSS rules:
                 *
                 *      '[I]f you're trying to emulate WebKit's behavior on Gecko, you need to place the element you want
                 *      to present inside another element, which you'll make fullscreen instead, and use CSS rules to adjust
                 *      the inner element to match the appearance you want.'
                 */
                this.canvasMonitor.style.width = sWidth;
                this.canvasMonitor.style.height = sHeight;
                this.canvasMonitor.style.display = "block";
                this.canvasMonitor.style.margin = "auto";
            }
            this.prevBackgroundColor = this.container.style.backgroundColor;
            this.container.style.backgroundColor = "black";
            this.container.doFullScreen();
            if (this.input) this.input.setAltFocus(true);
            fSuccess = true;
        }
        return fSuccess;
    }

    /**
     * onFullScreen(fFullScreen)
     *
     * @this {Monitor}
     * @param {boolean} [fFullScreen] (undefined if there was a full-screen error)
     */
    onFullScreen(fFullScreen)
    {
        this.machine.isFullScreen = true;
        if (!fFullScreen) {
            if (this.container) {
                if (!this.fullScreenStyle) {
                    this.container.style.width = this.container.style.height = "";
                } else {
                    this.canvasMonitor.style.width = this.canvasMonitor.style.height = "";
                }
                if (this.prevBackgroundColor) this.container.style.backgroundColor = this.prevBackgroundColor;
            }
            this.machine.isFullScreen = false;
        }
        if (this.input && !fFullScreen) this.input.setAltFocus(false);
        if (DEBUG) this.printf(MESSAGE.MONITOR, "onFullScreen(%b)\n", fFullScreen);
    }

    /**
     * onPower(on)
     *
     * Called by the Machine device to provide notification of a power event.
     *
     * @this {Monitor}
     * @param {boolean} on (true to power on, false to power off)
     */
    onPower(on)
    {
        if (on) {
            this.initCache();
            this.updateScreen();
        } else {
            this.blankMonitor();
        }
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {Monitor}
     */
    onReset()
    {
        this.blankMonitor();
    }
}

Monitor.BINDING = {
    CONTAINER:  "container",
    SURFACE:    "surface",
    MONITOR:    "monitor",
    OVERLAY:    "overlay",
    FULLSCREEN: "fullScreen",
};

Defs.CLASSES["Monitor"] = Monitor;

/**
 * @copyright https://www.pcjs.org/modules/devices/main/time.js (C) Jeff Parsons 2012-2019
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
        this.aAnimations = [];
        this.aClocks = [];
        this.aTimers = [];
        this.aUpdates = [];
        this.fPowered = this.fRunning = this.fYield = this.fThrottling = false;
        this.nStepping = 0;
        this.idRunTimeout = this.idStepTimeout = 0;
        this.onRunTimeout = this.run.bind(this);
        this.onAnimationFrame = this.animate.bind(this);
        this.requestAnimationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.setTimeout).bind(window);

        /*
         * Assorted bookkeeping variables.  A running machine actually performs one long series of "runs",
         * each followed by a yield back to the browser.  And each "run" consists of one or more "bursts"; the
         * size and number of "bursts" depends on how often the machine's timers needed to fire during the "run".
         */
        this.nCyclesLife = 0;           // number of cycles executed for the lifetime of the machine
        this.nCyclesRun = 0;            // number of cycles executed since the machine was last stopped
        this.nCyclesThisRun = 0;        // number of cycles executed during the last run (before yielding)
        this.nCyclesBurst = 0;          // number of cycles requested for the next "burst"
        this.nCyclesRemain = 0;         // number of cycles remaining in the next "burst"

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
                time.yield();
            }, this.msYield);
        }

        this.resetSpeed();
    }

    /**
     * addAnimation(callBack)
     *
     * Animation functions used to be called with YIELDS_PER_SECOND frequency, when animate() was called
     * on every yield() call, but now we rely on requestAnimationFrame(), so the frequency is browser-dependent
     * (but presumably at least 60Hz).
     *
     * @this {Time}
     * @param {function(number)} callBack
     */
    addAnimation(callBack)
    {
        this.aAnimations.push(callBack);
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
     * addClock(clock)
     *
     * Adds a clocked device, which must support the following interfaces:
     *
     *      startClock(nCycles)
     *      stopClock()
     *      getClock()
     *
     * @this {Time}
     * @param {Device} clock
     */
    addClock(clock)
    {
        this.aClocks.push(clock);
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
     * @return {number} timer index (1-based)
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
     * addUpdate(device)
     *
     * Adds a device to the update list.  Each device's onUpdate() function is then called from update(),
     * either as the result of periodic updates from yield(), single-step updates from step(), or transitional
     * updates from start() and stop().
     *
     * @this {Time}
     * @param {Device} device
     */
    addUpdate(device)
    {
        this.aUpdates.push(device);
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
                    this.notifyTimers(this.endBurst(this.doBurst(this.getCyclesPerFrame())));
                } while (this.fRunning && !this.fYield);
            }
            catch (err) {
                this.println(err.message);
                this.stop();
                return;
            }
            this.snapStop();
        }
        for (let i = 0; i < this.aAnimations.length; i++) {
            this.aAnimations[i](t);
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
     * @return {number} (number of cycles actually executed)
     */
    doBurst(nCycles)
    {
        this.nCyclesBurst = this.nCyclesRemain = nCycles;
        if (!this.aClocks.length) {
            this.nCyclesRemain = 0;
            return this.nCyclesBurst;
        }
        let iClock = 0;
        while (this.nCyclesRemain > 0) {
            if (iClock < this.aClocks.length) {
                let clock = this.aClocks[iClock++];
                nCycles = clock.startClock.call(clock, nCycles) || 1;
            } else {
                iClock = nCycles = 0;
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
     * @return {boolean}
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
     * @return {number} (number of cycles executed in burst)
     */
    endBurst(nCycles = this.nCyclesBurst - this.nCyclesRemain)
    {
        if (this.fClockByFrame) {
            if (!this.fRunning) {
                if (this.nCyclesDeposited) {
                    for (let iClock = 0; iClock < this.aClocks.length; iClock++) {
                        let clock = this.aClocks[iClock];
                        clock.stopClock.call(clock);
                    }
                }
                this.nCyclesDeposited = nCycles;
            }
            this.nCyclesDeposited -= nCycles;
            if (this.nCyclesDeposited < 1) {
                this.yield();
            }
        }
        this.nCyclesBurst = this.nCyclesRemain = 0;
        this.nCyclesThisRun += nCycles;
        this.nCyclesRun += nCycles;
        this.nCyclesLife += nCycles;
        if (!this.fRunning) this.nCyclesRun = 0;
        return nCycles;
    }

    /**
     * getCycles()
     *
     * Returns the number of cycles executed so far.
     *
     * @this {Time}
     * @return {number}
     */
    getCycles()
    {
        let nCyclesClocked = 0;
        for (let iClock = 0; iClock < this.aClocks.length; iClock++) {
            let clock = this.aClocks[iClock];
            nCyclesClocked += clock.getClock.call(clock);
        }
        return this.nCyclesLife + (this.nCyclesBurst - this.nCyclesRemain) + nCyclesClocked;
    }

    /**
     * getCyclesPerBurst()
     *
     * Returns the number of cycles to execute as a burst.
     *
     * @this {Time}
     * @return {number} (the maximum number of cycles we should execute in the next burst)
     */
    getCyclesPerBurst()
    {
        let nCycles = this.getCyclesPerMS(this.msYield);
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
     * Returns the number of cycles to execute per frame (assuming fClockByFrame).
     *
     * @this {Time}
     * @param {number} [nMinCycles]
     * @return {number} (the maximum number of cycles we should execute in the next burst)
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
            if (nCycles < 0) {
                this.printf("warning: nCyclesDeposited dropped below zero: %f\n", this.nCyclesDeposited);
                nCycles = 0;
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
     * getCyclesPerMS(ms)
     *
     * If no time period is specified, returns the current number of cycles per second (ie, 1000ms).
     *
     * @this {Time}
     * @param {number} ms (default is 1000)
     * @return {number} number of corresponding cycles
     */
    getCyclesPerMS(ms = 1000)
    {
        return Math.ceil((this.nCyclesPerSecond * this.nCurrentMultiplier) / 1000 * ms);
    }

    /**
     * getSpeed(mhz)
     *
     * @this {Time}
     * @param {number} mhz
     * @return {string} the given speed, as a formatted string
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
     * @return {string} the current speed, as a formatted string
     */
    getSpeedCurrent()
    {
        return (this.fRunning && this.mhzCurrent)? this.getSpeed(this.mhzCurrent) : "Stopped";
    }

    /**
     * getSpeedTarget()
     *
     * @this {Time}
     * @return {string} the target speed, as a formatted string
     */
    getSpeedTarget()
    {
        return this.getSpeed(this.mhzTarget);
    }

    /**
     * isPowered()
     *
     * @this {Time}
     * @return {boolean} true if powered, false if not
     */
    isPowered()
    {
        if (!this.fPowered) {
            this.println("not powered");
            return false;
        }
        return true;
    }

    /**
     * isRunning()
     *
     * @this {Time}
     * @return {boolean}
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
     * @return {boolean}
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
     * notifyTimers(nCycles)
     *
     * Used by run() to reduce all active timer countdown values by the number of cycles just executed;
     * this is the function that actually "fires" any timer(s) whose countdown has reached (or dropped below)
     * zero, invoking their callback function.
     *
     * @this {Time}
     * @param {number} nCycles (number of cycles actually executed)
     */
    notifyTimers(nCycles)
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

    /**
     * onPower(on)
     *
     * Called by the Machine device to provide notification of a power event.
     *
     * @this {Time}
     * @param {boolean} on (true to power on, false to power off)
     */
    onPower(on)
    {
        this.fPowered = on;
    }

    /**
     * onRun()
     *
     * This handles the "run" button, if any, attached to the Time device.
     *
     * Note that this serves a different purpose than the "power" button that's managed by the Input device,
     * because toggling power also requires resetting the program counter prior to start() OR clearing the display
     * after stop().
     *
     * @this {Time}
     */
    onRun()
    {
        if (this.isPowered()) {
            if (this.fRunning) {
                this.stop();
            } else {
                this.start();
            }
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
        if (this.isPowered()) {
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
                this.notifyTimers(this.endBurst(this.doBurst(this.getCyclesPerBurst())));

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
     * @return {boolean} (true if a throttle exists, false if not)
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
     * @return {boolean} true if successful, false if not
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
     * @return {number} (number of cycles used to arm timer, or -1 if error)
     */
    setTimer(iTimer, ms, fReset)
    {
        let nCycles = -1;
        if (iTimer > 0 && iTimer <= this.aTimers.length) {
            let timer = this.aTimers[iTimer-1];
            if (fReset || timer.nCyclesLeft < 0) {
                nCycles = this.getCyclesPerMS(ms);
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
     * @return {number}
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

        this.printf(MESSAGE.TIMER, "after running %d cycles, resting for %dms\n", this.nCyclesThisRun, msRemainsThisRun);

        return msRemainsThisRun;
    }

    /**
     * start()
     *
     * @this {Time}
     * @return {boolean}
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
        this.update(true);

        /*
         * Kickstart both the clocks and requestAnimationFrame; it's a little premature to start
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
     * @return {boolean} true if successful, false if already running
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
                this.notifyTimers(this.endBurst(this.doBurst(this.getCyclesPerFrame(1))));
                this.update(false);
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
     * @return {boolean} true if successful, false if already stopped
     */
    stop()
    {
        if (this.nStepping) {
            this.nStepping = 0;
            this.update(true);
            return true;
        }
        if (this.fRunning) {
            this.fRunning = false;
            this.endBurst();
            this.update(true);
            return true;
        }
        return false;
    }

    /**
     * update(fTransition)
     *
     * Used for periodic updates from yield(), single-step updates from step(), and transitional updates
     * from start() and stop().
     *
     * fTransition is set to true by start() and stop() calls, because the machine is transitioning to or from
     * a running state; it is set to false by step() calls, because the machine state changed but it never entered
     * a running state; and it is undefined in all other situations,
     *
     * When we call the update handlers, we set fTransition to true for all of the start(), stop(), and step()
     * cases, because there has been a "transition" in the overall state, just not the running state.
     *
     * @this {Time}
     * @param {boolean} [fTransition]
     */
    update(fTransition)
    {
        if (fTransition) {
            if (this.fRunning) {
                this.println("started with " + this.getSpeedTarget() + " target" + (DEBUG? " using " + (this.fClockByFrame? "requestAnimationFrame()" : "setTimeout()") : ""));
            } else {
                this.println("stopped");
            }
        }

        this.setBindingText(Time.BINDING.RUN, this.fRunning? "Halt" : "Run");
        this.setBindingText(Time.BINDING.STEP, this.nStepping? "Stop" : "Step");
        if (!this.fThrottling) {
            this.setBindingText(Time.BINDING.SPEED, this.getSpeedCurrent());
        }

        for (let i = 0; i < this.aUpdates.length; i++) {
            let device = this.aUpdates[i];
            device.onUpdate.call(device, fTransition != undefined);
        }
    }

    /**
     * yield()
     *
     * @this {Time}
     */
    yield()
    {
        this.fYield = true;
        let nYields = this.nYields;
        let nCyclesPerSecond = this.getCyclesPerMS();
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
            this.update();
        }
        if (this.nYields >= this.nYieldsPerSecond) {
            this.nYields = 0;
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

Defs.CLASSES["Time"] = Time;

/**
 * @copyright https://www.pcjs.org/modules/devices/invaders/chips.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ addr: number, size: number, switches: Object }} */
var ChipsConfig;

/**
 * @class {Chips}
 * @unrestricted
 * @property {ChipsConfig} config
 */
class Chips extends Ports {
    /**
     * Chips(idMachine, idDevice, config)
     *
     * @this {Chips}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ChipsConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        for (let port in Chips.LISTENERS) {
            let listeners = Chips.LISTENERS[port];
            this.addListener(+port, listeners[0], listeners[1]);
        }
        this.input = /** @type {Input} */ (this.findDeviceByClass("Input"));
        let onButton = this.onButton.bind(this);
        let buttonIDs = Object.keys(Chips.STATUS1.KEYMAP);
        for (let i = 0; i < buttonIDs.length; i++) {
            this.input.addListener(Input.TYPE.IDMAP, buttonIDs[i], onButton);
        }
        this.switchConfig = config['switches'] || {};
        this.defaultSwitches = this.parseDIPSwitches(this.switchConfig['default'], 0xff);
        this.setSwitches(this.defaultSwitches);
        this.onReset();
    }

    /**
     * onButton(id, down)
     *
     * @this {Chips}
     * @param {string} id
     * @param {boolean} down
     */
    onButton(id, down)
    {
        let bit = Chips.STATUS1.KEYMAP[id];
        this.bStatus1 = (this.bStatus1 & ~bit) | (down? bit : 0);
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {Chips}
     */
    onReset()
    {
        this.bStatus0 = 0;
        this.bStatus1 = 0;
        this.bStatus2 = 0;
        this.wShiftData = 0;
        this.bShiftCount = 0;
    }

    /**
     * setSwitches(switches)
     *
     * @this {Chips}
     * @param {number|undefined} switches
     */
    setSwitches(switches)
    {
        /*
         * switches may be undefined when called from loadState() if a "pre-switches" state was loaded.
         */
        if (switches == undefined) return;
        /*
         * If this.switches is undefined, then this is the first setSwitches() call, so we should set func
         * to onSwitch(); otherwise, we omit func so that all addListener() will do is initialize the visual
         * state of the SWITCH controls.
         */
        let func = this.switches == undefined? this.onSwitch.bind(this) : null;
        /*
         * Now we can set the actual switches to the supplied setting, and initialize each of the (8) switches.
         */
        this.switches = switches;
        for (let i = 1; i <= 8; i++) {
            this.input.addListener(Input.TYPE.SWITCH, "sw"+i, func, !(switches & (1 << (i - 1))));
        }
    }

    /**
     * onSwitch(id, state)
     *
     * @this {Chips}
     * @param {string} id
     * @param {boolean} state
     */
    onSwitch(id, state)
    {
        let desc;
        let i = +id.slice(-1) - 1, bit = 1 << i;
        if (!state) {
            this.switches |= bit;
        } else {
            this.switches &= ~bit;
        }
        for (let sws in this.switchConfig) {
            if (sws == "default" || sws[i] != '0' && sws[i] != '1') continue;
            let mask = this.parseDIPSwitches(sws, -1);
            let switches = this.parseDIPSwitches(sws);
            if (switches == (this.switches & mask)) {
                desc = this.switchConfig[sws];
                break;
            }
        }
        this.printf("%s: %b (%s)\n", id, state, desc);
    }

    /**
     * inStatus0(port)
     *
     * @this {Chips}
     * @param {number} port (0x00)
     * @return {number} simulated port value
     */
    inStatus0(port)
    {
        let value = this.bStatus0;
        this.printf(MESSAGE.BUS, "inStatus0(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * inStatus1(port)
     *
     * @this {Chips}
     * @param {number} port (0x01)
     * @return {number} simulated port value
     */
    inStatus1(port)
    {
        let value = this.bStatus1;
        this.printf(MESSAGE.PORTS, "inStatus1(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * inStatus2(port)
     *
     * @this {Chips}
     * @param {number} port (0x02)
     * @return {number} simulated port value
     */
    inStatus2(port)
    {
        let value = this.bStatus2 | (this.switches & (Chips.STATUS2.DIP1_2 | Chips.STATUS2.DIP4 | Chips.STATUS2.DIP7));
        this.printf(MESSAGE.PORTS, "inStatus2(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * inShiftResult(port)
     *
     * @this {Chips}
     * @param {number} port (0x03)
     * @return {number} simulated port value
     */
    inShiftResult(port)
    {
        let value = (this.wShiftData >> (8 - this.bShiftCount)) & 0xff;
        this.printf(MESSAGE.PORTS, "inShiftResult(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * outShiftCount(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x02)
     * @param {number} value
     */
    outShiftCount(port, value)
    {
        this.printf(MESSAGE.PORTS, "outShiftCount(%#04x): %#04x\n", port, value);
        this.bShiftCount = value;
    }

    /**
     * outSound1(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x03)
     * @param {number} value
     */
    outSound1(port, value)
    {
        this.printf(MESSAGE.PORTS, "outSound1(%#04x): %#04x\n", port, value);
        this.bSound1 = value;
    }

    /**
     * outShiftData(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x04)
     * @param {number} value
     */
    outShiftData(port, value)
    {
        this.printf(MESSAGE.PORTS, "outShiftData(%#04x): %#04x\n", port, value);
        this.wShiftData = (value << 8) | (this.wShiftData >> 8);
    }

    /**
     * outSound2(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x05)
     * @param {number} value
     */
    outSound2(port, value)
    {
        this.printf(MESSAGE.PORTS, "outSound2(%#04x): %#04x\n", port, value);
        this.bSound2 = value;
    }

    /**
     * outWatchdog(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x06)
     * @param {number} value
     */
    outWatchdog(port, value)
    {
        this.printf(MESSAGE.PORTS, "outWatchDog(%#04x): %#04x\n", port, value);
    }

    /**
     * loadState(state)
     *
     * Memory and Ports states are managed by the Bus onLoad() handler, which calls our loadState() handler.
     *
     * @this {Chips}
     * @param {Array|undefined} state
     * @return {boolean}
     */
    loadState(state)
    {
        if (state) {
            let idDevice = state.shift();
            if (this.idDevice == idDevice) {
                this.bStatus0 = state.shift();
                this.bStatus1 = state.shift();
                this.bStatus2 = state.shift();
                this.wShiftData = state.shift();
                this.bShiftCount = state.shift();
                this.setSwitches(state.shift());
                return true;
            }
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * Memory and Ports states are managed by the Bus onSave() handler, which calls our saveState() handler.
     *
     * @this {Chips}
     * @param {Array} state
     */
    saveState(state)
    {
        state.push(this.idDevice);
        state.push(this.bStatus0);
        state.push(this.bStatus1);
        state.push(this.bStatus2);
        state.push(this.wShiftData);
        state.push(this.bShiftCount);
        state.push(this.switches);
    }

    /**
     * getKeyState(name, bit, value)
     *
     * This function was used to poll keys, before I added support for listener callbacks.
     *
     * The polling code in inStatus1() looked like this:
     *
     *      let ids = Object.keys(Chips.STATUS1.KEYMAP);
     *      for (let i = 0; i < ids.length; i++) {
     *          let id = ids[i];
     *          value = this.getKeyState(id, Chips.STATUS1.KEYMAP[id], value);
     *      }
     *
     * Since the hardware we're simulating is polling-based rather than interrupt-based, either approach
     * works just as well, but in general, listeners are more efficient.
     *
     * @this {Chips}
     * @param {string} name
     * @param {number} bit
     * @param {number} value
     * @return {number} (updated value)
     */
    getKeyState(name, bit, value)
    {
        if (this.input) {
            let state = this.input.getKeyState(name);
            if (state != undefined) {
                value = (value & ~bit) | (state? bit : 0);
            }
        }
        return value;
    }
}

Chips.STATUS0 = {                   // NOTE: STATUS0 not used by the SI1978 ROMs; refer to STATUS1 instead
    PORT:       0,
    DIP4:       0x01,               // self-test request at power up?
    FIRE:       0x10,               // 1 = fire
    LEFT:       0x20,               // 1 = left
    RIGHT:      0x40,               // 1 = right
    PORT7:      0x80,               // some connection to (undocumented) port 7
    ALWAYS_SET: 0x0E                // always set
};

Chips.STATUS1 = {
    PORT:       1,
    CREDIT:     0x01,               // credit (coin slot)
    P2:         0x02,               // 1 = 2P start
    P1:         0x04,               // 1 = 1P start
    P1_FIRE:    0x10,               // 1 = fire (P1 fire if cocktail machine?)
    P1_LEFT:    0x20,               // 1 = left (P1 left if cocktail machine?)
    P1_RIGHT:   0x40,               // 1 = right (P1 right if cocktail machine?)
    ALWAYS_SET: 0x08                // always set
};

Chips.STATUS2 = {
    PORT:       2,
    DIP1_2:     0x03,               // 00 = 3 ships, 01 = 4 ships, 10 = 5 ships, 11 = 6 ships
    TILT:       0x04,               // 1 = tilt detected
    DIP4:       0x08,               // 0 = extra ship at 1500, 1 = extra ship at 1000
    P2_FIRE:    0x10,               // 1 = P2 fire (cocktail machines only?)
    P2_LEFT:    0x20,               // 1 = P2 left (cocktail machines only?)
    P2_RIGHT:   0x40,               // 1 = P2 right (cocktail machines only?)
    DIP7:       0x80,               // 0 = display coin info on demo ("attract") screen
    ALWAYS_SET: 0x00
};

Chips.SHIFT_RESULT = {              // bits 0-7 of barrel shifter result
    PORT:       3
};

Chips.SHIFT_COUNT = {
    PORT:       2,
    MASK:       0x07
};

Chips.SOUND1 = {
    PORT:       3,
    UFO:        0x01,
    SHOT:       0x02,
    PDEATH:     0x04,
    IDEATH:     0x08,
    EXPLAY:     0x10,
    AMP_ENABLE: 0x20
};

Chips.SHIFT_DATA = {
    PORT:       4
};

Chips.SOUND2 = {
    PORT:       5,
    FLEET1:     0x01,
    FLEET2:     0x02,
    FLEET3:     0x04,
    FLEET4:     0x08,
    UFO_HIT:    0x10
};

Chips.STATUS1.KEYMAP = {
    "1p":       Chips.STATUS1.P1,
    "2p":       Chips.STATUS1.P2,
    "coin":     Chips.STATUS1.CREDIT,
    "left":     Chips.STATUS1.P1_LEFT,
    "right":    Chips.STATUS1.P1_RIGHT,
    "fire":     Chips.STATUS1.P1_FIRE
};

Chips.LISTENERS = {
    0: [Chips.prototype.inStatus0],
    1: [Chips.prototype.inStatus1],
    2: [Chips.prototype.inStatus2, Chips.prototype.outShiftCount],
    3: [Chips.prototype.inShiftResult, Chips.prototype.outSound1],
    4: [null, Chips.prototype.outShiftData],
    5: [null, Chips.prototype.outSound2],
    6: [null, Chips.prototype.outWatchdog]
};

Defs.CLASSES["Chips"] = Chips;

/**
 * @copyright https://www.pcjs.org/modules/devices/invaders/video.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ bufferWidth: number, bufferHeight: number, bufferRotate: number, bufferAddr: number, bufferBits: number, bufferLeft: number, interruptRate: number }} */
var VideoConfig;

/**
 * @class {Video}
 * @unrestricted
 * @property {VideoConfig} config
 */
class Video extends Monitor {
    /**
     * Video(idMachine, idDevice, config)
     *
     * The Video component can be configured with the following config properties:
     *
     *      bufferWidth: the width of a single frame buffer row, in pixels (eg, 256)
     *      bufferHeight: the number of frame buffer rows (eg, 224)
     *      bufferAddr: the starting address of the frame buffer (eg, 0x2400)
     *      bufferRAM: true to use existing RAM (default is false)
     *      bufferBits: the number of bits per column (default is 1)
     *      bufferLeft: the bit position of the left-most pixel in a byte (default is 0; CGA uses 7)
     *      bufferRotate: the amount of counter-clockwise buffer rotation required (eg, -90 or 270)
     *      interruptRate: normally the same as (or some multiple of) refreshRate (eg, 120)
     *      refreshRate: how many times updateMonitor() should be performed per second (eg, 60)
     *
     * We record all the above values now, but we defer creation of the frame buffer until initBuffers()
     * is called.  At that point, we will also compute the extent of the frame buffer, determine the
     * appropriate "cell" size (ie, the number of pixels that updateMonitor() will fetch and process at once),
     * and then allocate our cell cache.
     *
     * Why interruptRate in addition to refreshRate?  A higher interrupt rate is required for Space Invaders,
     * because even though the CRT refreshes at 60Hz, the CRT controller interrupts the CPU *twice* per
     * refresh (once after the top half of the image has been redrawn, and again after the bottom half has
     * been redrawn), so we need an interrupt rate of 120Hz.  We pass the higher rate on to the CPU, so that
     * it will call updateMonitor() more frequently, but we still limit our monitor updates to every *other* call.
     *
     * bufferRotate is an alternative to monitorRotate; you may set one or the other (but not both) to -90 to
     * enable different approaches to counter-clockwise 90-degree image rotation.  monitorRotate uses canvas
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

        let video = this
        this.addrBuffer = config['bufferAddr'];
        this.fUseRAM = config['bufferRAM'];

        this.nColsBuffer = config['bufferWidth'];
        this.nRowsBuffer = config['bufferHeight'];

        this.cxCell = config['cellWidth'] || 1;
        this.cyCell = config['cellHeight'] || 1;

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

        this.cxMonitorCell = (this.cxMonitor / this.nColsBuffer)|0;
        this.cyMonitorCell = (this.cyMonitor / this.nRowsBuffer)|0;

        this.busMemory = /** @type {Bus} */ (this.findDevice(config['bus']));
        this.initBuffers();

        this.cpu = /** @type {CPU} */ (this.findDeviceByClass("CPU"));
        this.time = /** @type {Time} */ (this.findDeviceByClass("Time"));
        this.timerUpdateNext = this.time.addTimer(this.idDevice, this.updateMonitor.bind(this));
        this.time.addUpdate(this);

        this.time.setTimer(this.timerUpdateNext, this.getRefreshTime());
        this.nUpdates = 0;
    }

    /**
     * onUpdate(fTransition)
     *
     * This is our obligatory update() function, which every device with visual components should have.
     *
     * For the Video device, our sole function is making sure the screen display is up-to-date.  However, calling
     * updateScreen() is a bad idea if the machine is running, because we already have a timer to take care of
     * that.  But we can also be called when the machine is NOT running (eg, the Debugger may be stepping through
     * some code, or editing the frame buffer directly, or something else).  Since we have no way of knowing, we
     * must force an update.
     *
     * @this {Video}
     * @param {boolean} [fTransition]
     */
    onUpdate(fTransition)
    {
        if (!this.time.isRunning()) this.updateScreen();
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

        let cxBuffer = this.cxBuffer;
        let cyBuffer = this.cyBuffer;
        if (this.rotateBuffer) {
            cxBuffer = this.cyBuffer;
            cyBuffer = this.cxBuffer;
        }

        this.sizeBuffer = ((this.cxBuffer * this.nBitsPerPixel) >> 3) * this.cyBuffer;
        if (!this.fUseRAM) {
            if (!this.busMemory.addBlocks(this.addrBuffer, this.sizeBuffer, Memory.TYPE.READWRITE)) {
                return false;
            }
        }

        /*
         * Since we will read video data from the bus at its default width, get that width now;
         * that width will also determine the size of a cell.
         */
        this.cellWidth = this.busMemory.dataWidth;
        this.imageBuffer = this.contextMonitor.createImageData(cxBuffer, cyBuffer);
        this.nPixelsPerCell = Math.trunc(this.cellWidth / this.nBitsPerPixel);

        /*
         * Since we calculated sizeBuffer as a number of bytes, convert that to the number of cells.
         */
        this.initCache(Math.ceil(this.sizeBuffer / (this.cellWidth >> 3)));

        this.canvasBuffer = document.createElement("canvas");
        this.canvasBuffer.width = cxBuffer;
        this.canvasBuffer.height = cyBuffer;
        this.contextBuffer = this.canvasBuffer.getContext("2d");

        this.initColors();

        /*
         * Our 'smoothing' parameter defaults to null (which we treat the same as undefined), which means that
         * image smoothing will be selectively enabled (ie, true for text modes, false for graphics modes); otherwise,
         * we'll set image smoothing to whatever value was provided for ALL modes -- assuming the browser supports it.
         */
        if (this.sSmoothing) {
            this.contextMonitor[this.sSmoothing] = (this.fSmoothing == null? false : this.fSmoothing);
        }
        return true;
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
     * initCache(nCells)
     *
     * Initializes the contents of our internal cell cache.
     *
     * @this {Video}
     * @param {number} [nCells]
     */
    initCache(nCells)
    {
        this.fCacheValid = false;
        if (nCells) {
            this.nCacheCells = nCells;
            if (this.aCacheCells === undefined || this.aCacheCells.length != this.nCacheCells) {
                this.aCacheCells = new Array(this.nCacheCells);
            }
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
        let rgbBlack  = [0x00, 0x00, 0x00, 0xff];
        let rgbWhite  = [0xff, 0xff, 0xff, 0xff];
        this.nColors = (1 << this.nBitsPerPixel);
        this.aRGB = new Array(this.nColors + Video.COLORS.OVERLAY_TOTAL);
        this.aRGB[0] = rgbBlack;
        this.aRGB[1] = rgbWhite;
        let rgbGreen  = [0x00, 0xff, 0x00, 0xff];
        let rgbYellow = [0xff, 0xff, 0x00, 0xff];
        this.aRGB[this.nColors + Video.COLORS.OVERLAY_TOP] = rgbYellow;
        this.aRGB[this.nColors + Video.COLORS.OVERLAY_BOTTOM] = rgbGreen;
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
        let index;
        if (!this.rotateBuffer) {
            index = (x + y * image.width);
        } else {
            index = (image.height - x - 1) * image.width + y;
        }
        if (bPixel) {
            if (x >= 208 && x < 236) {
                bPixel = this.nColors + Video.COLORS.OVERLAY_TOP;
            }
            else if (x >= 28 && x < 72) {
                bPixel = this.nColors + Video.COLORS.OVERLAY_BOTTOM;
            }
        }
        let rgb = this.aRGB[bPixel];
        index *= rgb.length;
        image.data[index] = rgb[0];
        image.data[index+1] = rgb[1];
        image.data[index+2] = rgb[2];
        image.data[index+3] = rgb[3];
    }

    /**
     * updateMonitor(fForced)
     *
     * Forced updates are generally internal updates triggered by an I/O operation or other state change,
     * while non-forced updates are periodic "refresh" updates.
     *
     * @this {Video}
     * @param {boolean} [fForced]
     */
    updateMonitor(fForced)
    {
        let fUpdate = true;
        if (!fForced) {
            if (this.rateInterrupt) {
                /*
                 * TODO: Incorporate these hard-coded interrupt vector numbers into configuration blocks.
                 */
                if (this.rateInterrupt == 120) {
                    /*
                     * According to http://www.computerarcheology.com/Arcade/SpaceInvaders/Hardware.html:
                     *
                     *      The CPU's INT line is asserted via a D flip-flop at E3.
                     *      The flip-flop is clocked by the expression (!(64V | !128V) | VBLANK).
                     *      According to this, the LO to HI transition happens when the vertical
                     *      sync chain is 0x80 and 0xda and VBLANK is 0 and 1, respectively.
                     *      These correspond to lines 96 and 224 as displayed.
                     *      The interrupt vector is provided by the expression:
                     *      0xc7 | (64V << 4) | (!64V << 3), giving 0xcf and 0xd7 for the vectors.
                     *      The flip-flop, thus the INT line, is later cleared by the CPU via
                     *      one of its memory access control signals.
                     *
                     * Translation:
                     *
                     * Two different RST instructions are generated: RST 1 and RST 2.  It's believed that
                     * RST 1 occurs when the beam is near the middle of the image (and therefore it's safe to
                     * draw the top half of the image) and RST 2 occurs when the beam is at the bottom (and
                     * it's safe to draw the rest of the image).
                     */
                    if (!(this.nUpdates & 1)) {
                        /*
                         * On even updates, call cpu.requestINTR(1), and also update our copy of the image.
                         */
                        this.cpu.requestINTR(1);
                    } else {
                        /*
                         * On odd updates, call cpu.requestINTR(2), but do NOT update our copy of the image, because
                         * the machine has presumably only updated the top half of the frame buffer at this point; it will
                         * update the bottom half of the frame buffer after acknowledging this interrupt.
                         */
                        this.cpu.requestINTR(2);
                        fUpdate = false;
                    }
                }
            }

            /*
             * Since this is not a forced update, if our cell cache is valid AND we allocated our own buffer AND the buffer
             * is clean, then there's nothing to do.
             */
            if (fUpdate && this.fCacheValid && this.sizeBuffer) {
                if (this.busMemory.cleanBlocks(this.addrBuffer, this.sizeBuffer)) {
                    fUpdate = false;
                }
            }
            this.time.setTimer(this.timerUpdateNext, this.getRefreshTime());
            this.nUpdates++;
            if (!fUpdate) return;
        }
        this.updateScreen();
    }

    /**
     * updateScreen()
     *
     * Propagates the video buffer to the cell cache and updates the screen with any changes on the monitor.
     *
     * For every cell in the video buffer, compare it to the cell stored in the cell cache, render if it differs,
     * and then update the cell cache to match.  Since initCache() sets every cell in the cell cache to an
     * invalid value, we're assured that the next call to updateScreen() will redraw the entire (visible) video buffer.
     *
     * @this {Video}
     */
    updateScreen()
    {
        let addr = this.addrBuffer;
        let addrLimit = addr + this.sizeBuffer;

        let iCell = 0, xBuffer = 0, yBuffer = 0;
        let xDirty = this.cxBuffer, xMaxDirty = 0, yDirty = this.cyBuffer, yMaxDirty = 0;

        let nShiftInit = 0;
        let nShiftPixel = this.nBitsPerPixel;
        let nMask = (1 << nShiftPixel) - 1;
        if (this.iBitFirstPixel) {
            nShiftPixel = -nShiftPixel;
            nShiftInit = this.cellWidth + nShiftPixel;
        }
        let addrInc = (this.cellWidth / this.busMemory.dataWidth)|0;

        while (addr < addrLimit) {
            let data = this.busMemory.readData(addr);

            if (this.fCacheValid && data === this.aCacheCells[iCell]) {
                xBuffer += this.nPixelsPerCell;
            } else {
                this.aCacheCells[iCell] = data;
                let nShift = nShiftInit;
                if (nShift) data = ((data >> 8) | ((data & 0xff) << 8));
                if (xBuffer < xDirty) xDirty = xBuffer;
                let cPixels = this.nPixelsPerCell;
                while (cPixels--) {
                    let bPixel = (data >> nShift) & nMask;
                    this.setPixel(this.imageBuffer, xBuffer++, yBuffer, bPixel);
                    nShift += nShiftPixel;
                }
                if (xBuffer > xMaxDirty) xMaxDirty = xBuffer;
                if (yBuffer < yDirty) yDirty = yBuffer;
                if (yBuffer >= yMaxDirty) yMaxDirty = yBuffer + 1;
            }
            addr += addrInc; iCell++;
            if (xBuffer >= this.cxBuffer) {
                xBuffer = 0; yBuffer++;
                if (yBuffer > this.cyBuffer) break;
            }
        }
        this.fCacheValid = true;

        /*
         * Instead of blasting the ENTIRE imageBuffer into contextBuffer, and then blasting the ENTIRE
         * canvasBuffer onto contextMonitor, even for the smallest change, let's try to be a bit smarter about
         * the update (well, to the extent that the canvas APIs permit).
         */
        if (xDirty < this.cxBuffer) {
            let cxDirty = xMaxDirty - xDirty;
            let cyDirty = yMaxDirty - yDirty;
            if (this.rotateBuffer) {
                /*
                 * If rotateBuffer is set, then it must be -90, so we must "rotate" the dirty coordinates as well,
                 * because they are relative to the frame buffer, not the rotated image buffer.  Alternatively, you
                 * can use the following call to blast the ENTIRE imageBuffer into contextBuffer instead:
                 *
                 *      this.contextBuffer.putImageData(this.imageBuffer, 0, 0);
                 */
                let xDirtyOrig = xDirty, cxDirtyOrig = cxDirty;
                xDirty = yDirty;
                cxDirty = cyDirty;
                yDirty = this.cxBuffer - (xDirtyOrig + cxDirtyOrig);
                cyDirty = cxDirtyOrig;
            }
            this.contextBuffer.putImageData(this.imageBuffer, 0, 0, xDirty, yDirty, cxDirty, cyDirty);
            /*
             * As originally noted in /modules/pcx86/lib/video.js, I would prefer to draw only the dirty portion of
             * canvasBuffer, but there usually isn't a 1-1 pixel mapping between canvasBuffer and contextMonitor, so
             * if we draw interior rectangles, we can end up with subpixel artifacts along the edges of those rectangles.
             */
            this.contextMonitor.drawImage(this.canvasBuffer, 0, 0, this.canvasBuffer.width, this.canvasBuffer.height, 0, 0, this.cxMonitor, this.cyMonitor);
        }
    }
}

Video.COLORS = {
    OVERLAY_TOP:    0,
    OVERLAY_BOTTOM: 1,
    OVERLAY_TOTAL:  2
};

Defs.CLASSES["Video"] = Video;

/**
 * @copyright https://www.pcjs.org/modules/devices/cpu/cpu8080.js (C) Jeff Parsons 2012-2019
 */

/**
 * Emulation of the 8080 CPU
 *
 * @class {CPU}
 * @unrestricted
 * @property {Input} input
 * @property {Time} time
 * @property {number} nCyclesStart
 * @property {number} nCyclesRemain
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
         * nCyclesStart and nCyclesRemain are initialized on every startClock() invocation.
         * The number of cycles executed during the current burst is nCyclesStart - nCyclesRemain,
         * and the burst is complete when nCyclesRemain has been exhausted (ie, is <= 0).
         */
        this.nCyclesStart = this.nCyclesRemain = 0;

        /*
         * Get access to the Input device, so we can call setFocus() as needed.
         */
        this.input = /** @type {Input} */ (this.findDeviceByClass("Input", false));

        /*
         * Get access to the Bus devices, so we have access to the I/O and memory address spaces.
         */
        this.busIO = /** @type {Bus} */ (this.findDevice(this.config['busIO']));
        this.busMemory = /** @type {Bus} */ (this.findDevice(this.config['busMemory']));

        /*
         * Get access to the Time device, so we can give it our clock and updateCPU() function.
         */
        this.time = /** @type {Time} */ (this.findDeviceByClass("Time"));
        this.time.addClock(this);
        this.time.addUpdate(this);

        /*
         * If a Debugger is loaded, it will call connectDebugger().  Having access to the Debugger
         * allows our toString() function to include the instruction, via toInstruction(), and conversely,
         * the Debugger will enjoy access to all our defined register names.
         */
        this.dbg = undefined;

        this.defineRegister("A", () => this.regA, (value) => this.regA = value & 0xff);
        this.defineRegister("B", () => this.regB, (value) => this.regB = value & 0xff);
        this.defineRegister("C", () => this.regC, (value) => this.regC = value & 0xff);
        this.defineRegister("D", () => this.regD, (value) => this.regD = value & 0xff);
        this.defineRegister("E", () => this.regE, (value) => this.regE = value & 0xff);
        this.defineRegister("H", () => this.regH, (value) => this.regH = value & 0xff);
        this.defineRegister("L", () => this.regL, (value) => this.regL = value & 0xff);
        this.defineRegister("CF", () => (this.getCF()? 1 : 0), (value) => {value? this.setCF() : this.clearCF()});
        this.defineRegister("PF", () => (this.getPF()? 1 : 0), (value) => {value? this.setPF() : this.clearPF()});
        this.defineRegister("AF", () => (this.getAF()? 1 : 0), (value) => {value? this.setAF() : this.clearAF()});
        this.defineRegister("ZF", () => (this.getZF()? 1 : 0), (value) => {value? this.setZF() : this.clearZF()});
        this.defineRegister("SF", () => (this.getSF()? 1 : 0), (value) => {value? this.setSF() : this.clearSF()});
        this.defineRegister("IF", () => (this.getIF()? 1 : 0), (value) => {value? this.setIF() : this.clearIF()});
        this.defineRegister("BC", this.getBC, this.setBC);
        this.defineRegister("DE", this.getDE, this.setDE);
        this.defineRegister("HL", this.getHL, this.setHL);
        this.defineRegister(DbgIO.REGISTER.PC, this.getPC, this.setPC);
    }

    /**
     * connectDebugger(dbg)
     *
     * @param {DbgIO} dbg
     * @return {Object}
     */
    connectDebugger(dbg)
    {
        this.dbg = dbg;
        return this.registers;
    }

    /**
     * startClock(nCycles)
     *
     * @this {CPU}
     * @param {number} [nCycles] (default is 0 to single-step)
     * @return {number} (number of cycles actually "clocked")
     */
    startClock(nCycles = 0)
    {
        this.nCyclesStart = this.nCyclesRemain = nCycles;
        try {
            this.execute(nCycles);
        } catch(err) {
            this.regPC = this.regPCLast;
            this.println(err.message);
            this.time.stop();
        }
        return this.getClock();
    }

    /**
     * stopClock()
     *
     * Stopping the clock is a simple matter of reducing nCyclesRemain to zero.  However, to compensate
     * for the fact that we didn't do any work for those remaining cycles, we must FIRST reduce nCyclesStart
     * by the number of cycles remaining.
     *
     * @this {CPU}
     */
    stopClock()
    {
        this.nCyclesStart -= this.nCyclesRemain;
        this.nCyclesRemain = 0;
    }

    /**
     * getClock()
     *
     * Returns the number of cycles executed so far during the current burst.
     *
     * @this {CPU}
     * @return {number}
     */
    getClock()
    {
        return this.nCyclesStart - this.nCyclesRemain;
    }

    /**
     * execute(nCycles)
     *
     * Executes the specified "burst" of instructions.  This code exists outside of the startClock() function
     * to ensure that its try/catch exception handler doesn't interfere with the optimization of this tight loop.
     *
     * @this {CPU}
     * @param {number} nCycles
     */
    execute(nCycles)
    {
        /*
         * If checkINTR() returns false, INTFLAG.HALT must be set, so no instructions should be executed.
         */
        if (!this.checkINTR()) return;
        while (this.nCyclesRemain > 0) {
            this.regPCLast = this.regPC;
            this.aOps[this.getPCByte()].call(this);
        }
    }

    /**
     * init()
     *
     * Initializes the CPU's state.
     *
     * @this {CPU}
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
     * loadState(stateCPU)
     *
     * If any saved values don't match (possibly overridden), abandon the given state and return false.
     *
     * @this {CPU}
     * @param {Array} stateCPU
     * @return {boolean}
     */
    loadState(stateCPU)
    {
        if (!stateCPU || !stateCPU.length) {
            this.println("invalid saved state");
            return false;
        }
        let idDevice = stateCPU.shift();
        let version = stateCPU.shift();
        if (idDevice != this.idDevice || (version|0) !== (+VERSION|0)) {
            this.printf("CPU state mismatch (%s %3.2f)\n", idDevice, version);
            return false;
        }
        try {
            this.regA = stateCPU.shift();
            this.regB = stateCPU.shift();
            this.regC = stateCPU.shift();
            this.regD = stateCPU.shift();
            this.regE = stateCPU.shift();
            this.regH = stateCPU.shift();
            this.regL = stateCPU.shift();
            this.setPC(stateCPU.shift());
            this.setSP(stateCPU.shift());
            this.setPS(stateCPU.shift());
            this.intFlags = stateCPU.shift();
        } catch(err) {
            this.println("CPU state error: " + err.message);
            return false;
        }
        return true;
    }

    /**
     * saveState(stateCPU)
     *
     * @this {CPU}
     * @param {Array} stateCPU
     */
    saveState(stateCPU)
    {
        stateCPU.push(this.idDevice);
        stateCPU.push(+VERSION);
        stateCPU.push(this.regA);
        stateCPU.push(this.regB);
        stateCPU.push(this.regC);
        stateCPU.push(this.regD);
        stateCPU.push(this.regE);
        stateCPU.push(this.regH);
        stateCPU.push(this.regL);
        stateCPU.push(this.getPC());
        stateCPU.push(this.getSP());
        stateCPU.push(this.getPS());
        stateCPU.push(this.intFlags);
    }

    /**
     * onLoad(state)
     *
     * Automatically called by the Machine device if the machine's 'autoSave' property is true.
     *
     * @this {CPU}
     * @param {Array} state
     * @return {boolean}
     */
    onLoad(state)
    {
        if (state) {
            let stateCPU = state[0];
            if (this.loadState(stateCPU)) {
                state.shift();
                return true;
            }
        }
        return false;
    }

    /**
     * onPower(on)
     *
     * Called by the Machine device to provide notification of a power event.
     *
     * @this {CPU}
     * @param {boolean} on (true to power on, false to power off)
     */
    onPower(on)
    {
        if (on) {
            this.time.start();
            if (this.input) this.input.setFocus();
        } else {
            this.time.stop();
        }
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {CPU}
     */
    onReset()
    {
        this.println("reset");
        this.resetRegs();
        if (!this.time.isRunning()) this.print(this.toString());
    }

    /**
     * onSave(state)
     *
     * Automatically called by the Machine device before all other devices have been powered down (eg, during
     * a page unload event).
     *
     * @this {CPU}
     * @param {Array} state
     */
    onSave(state)
    {
        let stateCPU = [];
        this.saveState(stateCPU);
        state.push(stateCPU);
    }

    /**
     * onUpdate(fTransition)
     *
     * Enumerate all bindings and update their values.
     *
     * Called by Time's update() function whenever 1) its YIELDS_PER_UPDATE threshold is reached
     * (default is twice per second), 2) a step() operation has just finished (ie, the device is being
     * single-stepped), and 3) a start() or stop() transition has occurred.
     *
     * @this {CPU}
     * @param {boolean} [fTransition]
     */
    onUpdate(fTransition)
    {
        // TODO: Decide what bindings we want to support, and update them as appropriate.
    }

    /**
     * op=0x00 (NOP)
     *
     * @this {CPU}
     */
    opNOP()
    {
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x01 (LXI B,d16)
     *
     * @this {CPU}
     */
    opLXIB()
    {
        this.setBC(this.getPCWord());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x02 (STAX B)
     *
     * @this {CPU}
     */
    opSTAXB()
    {
        this.setByte(this.getBC(), this.regA);
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x03 (INX B)
     *
     * @this {CPU}
     */
    opINXB()
    {
        this.setBC(this.getBC() + 1);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x04 (INR B)
     *
     * @this {CPU}
     */
    opINRB()
    {
        this.regB = this.incByte(this.regB);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x05 (DCR B)
     *
     * @this {CPU}
     */
    opDCRB()
    {
        this.regB = this.decByte(this.regB);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x06 (MVI B,d8)
     *
     * @this {CPU}
     */
    opMVIB()
    {
        this.regB = this.getPCByte();
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x07 (RLC)
     *
     * @this {CPU}
     */
    opRLC()
    {
        let carry = this.regA << 1;
        this.regA = (carry & 0xff) | (carry >> 8);
        this.updateCF(carry & 0x100);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x09 (DAD B)
     *
     * @this {CPU}
     */
    opDADB()
    {
        let w;
        this.setHL(w = this.getHL() + this.getBC());
        this.updateCF((w >> 8) & 0x100);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x0A (LDAX B)
     *
     * @this {CPU}
     */
    opLDAXB()
    {
        this.regA = this.getByte(this.getBC());
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x0B (DCX B)
     *
     * @this {CPU}
     */
    opDCXB()
    {
        this.setBC(this.getBC() - 1);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x0C (INR C)
     *
     * @this {CPU}
     */
    opINRC()
    {
        this.regC = this.incByte(this.regC);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x0D (DCR C)
     *
     * @this {CPU}
     */
    opDCRC()
    {
        this.regC = this.decByte(this.regC);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x0E (MVI C,d8)
     *
     * @this {CPU}
     */
    opMVIC()
    {
        this.regC = this.getPCByte();
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x0F (RRC)
     *
     * @this {CPU}
     */
    opRRC()
    {
        let carry = (this.regA << 8) & 0x100;
        this.regA = (carry | this.regA) >> 1;
        this.updateCF(carry);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x11 (LXI D,d16)
     *
     * @this {CPU}
     */
    opLXID()
    {
        this.setDE(this.getPCWord());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x12 (STAX D)
     *
     * @this {CPU}
     */
    opSTAXD()
    {
        this.setByte(this.getDE(), this.regA);
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x13 (INX D)
     *
     * @this {CPU}
     */
    opINXD()
    {
        this.setDE(this.getDE() + 1);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x14 (INR D)
     *
     * @this {CPU}
     */
    opINRD()
    {
        this.regD = this.incByte(this.regD);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x15 (DCR D)
     *
     * @this {CPU}
     */
    opDCRD()
    {
        this.regD = this.decByte(this.regD);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x16 (MVI D,d8)
     *
     * @this {CPU}
     */
    opMVID()
    {
        this.regD = this.getPCByte();
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x17 (RAL)
     *
     * @this {CPU}
     */
    opRAL()
    {
        let carry = this.regA << 1;
        this.regA = (carry & 0xff) | this.getCF();
        this.updateCF(carry & 0x100);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x19 (DAD D)
     *
     * @this {CPU}
     */
    opDADD()
    {
        let w;
        this.setHL(w = this.getHL() + this.getDE());
        this.updateCF((w >> 8) & 0x100);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x1A (LDAX D)
     *
     * @this {CPU}
     */
    opLDAXD()
    {
        this.regA = this.getByte(this.getDE());
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x1B (DCX D)
     *
     * @this {CPU}
     */
    opDCXD()
    {
        this.setDE(this.getDE() - 1);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x1C (INR E)
     *
     * @this {CPU}
     */
    opINRE()
    {
        this.regE = this.incByte(this.regE);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x1D (DCR E)
     *
     * @this {CPU}
     */
    opDCRE()
    {
        this.regE = this.decByte(this.regE);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x1E (MVI E,d8)
     *
     * @this {CPU}
     */
    opMVIE()
    {
        this.regE = this.getPCByte();
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x1F (RAR)
     *
     * @this {CPU}
     */
    opRAR()
    {
        let carry = (this.regA << 8);
        this.regA = ((this.getCF() << 8) | this.regA) >> 1;
        this.updateCF(carry & 0x100);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x21 (LXI H,d16)
     *
     * @this {CPU}
     */
    opLXIH()
    {
        this.setHL(this.getPCWord());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x22 (SHLD a16)
     *
     * @this {CPU}
     */
    opSHLD()
    {
        this.setWord(this.getPCWord(), this.getHL());
        this.nCyclesRemain -= 16;
    }

    /**
     * op=0x23 (INX H)
     *
     * @this {CPU}
     */
    opINXH()
    {
        this.setHL(this.getHL() + 1);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x24 (INR H)
     *
     * @this {CPU}
     */
    opINRH()
    {
        this.regH = this.incByte(this.regH);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x25 (DCR H)
     *
     * @this {CPU}
     */
    opDCRH()
    {
        this.regH = this.decByte(this.regH);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x26 (MVI H,d8)
     *
     * @this {CPU}
     */
    opMVIH()
    {
        this.regH = this.getPCByte();
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x27 (DAA)
     *
     * @this {CPU}
     */
    opDAA()
    {
        let src = 0;
        let CF = this.getCF();
        let AF = this.getAF();
        if (AF || (this.regA & 0x0F) > 9) {
            src |= 0x06;
        }
        if (CF || this.regA >= 0x9A) {
            src |= 0x60;
            CF = CPU.PS.CF;
        }
        this.regA = this.addByte(src);
        this.updateCF(CF? 0x100 : 0);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x29 (DAD H)
     *
     * @this {CPU}
     */
    opDADH()
    {
        let w;
        this.setHL(w = this.getHL() + this.getHL());
        this.updateCF((w >> 8) & 0x100);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x2A (LHLD a16)
     *
     * @this {CPU}
     */
    opLHLD()
    {
        this.setHL(this.getWord(this.getPCWord()));
        this.nCyclesRemain -= 16;
    }

    /**
     * op=0x2B (DCX H)
     *
     * @this {CPU}
     */
    opDCXH()
    {
        this.setHL(this.getHL() - 1);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x2C (INR L)
     *
     * @this {CPU}
     */
    opINRL()
    {
        this.regL = this.incByte(this.regL);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x2D (DCR L)
     *
     * @this {CPU}
     */
    opDCRL()
    {
        this.regL = this.decByte(this.regL);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x2E (MVI L,d8)
     *
     * @this {CPU}
     */
    opMVIL()
    {
        this.regL = this.getPCByte();
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x2F (CMA)
     *
     * @this {CPU}
     */
    opCMA()
    {
        this.regA = ~this.regA & 0xff;
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x31 (LXI SP,d16)
     *
     * @this {CPU}
     */
    opLXISP()
    {
        this.setSP(this.getPCWord());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x32 (STA a16)
     *
     * @this {CPU}
     */
    opSTA()
    {
        this.setByte(this.getPCWord(), this.regA);
        this.nCyclesRemain -= 13;
    }

    /**
     * op=0x33 (INX SP)
     *
     * @this {CPU}
     */
    opINXSP()
    {
        this.setSP(this.getSP() + 1);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x34 (INR M)
     *
     * @this {CPU}
     */
    opINRM()
    {
        let addr = this.getHL();
        this.setByte(addr, this.incByte(this.getByte(addr)));
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x35 (DCR M)
     *
     * @this {CPU}
     */
    opDCRM()
    {
        let addr = this.getHL();
        this.setByte(addr, this.decByte(this.getByte(addr)));
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x36 (MVI M,d8)
     *
     * @this {CPU}
     */
    opMVIM()
    {
        this.setByte(this.getHL(), this.getPCByte());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x37 (STC)
     *
     * @this {CPU}
     */
    opSTC()
    {
        this.setCF();
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x39 (DAD SP)
     *
     * @this {CPU}
     */
    opDADSP()
    {
        let w;
        this.setHL(w = this.getHL() + this.getSP());
        this.updateCF((w >> 8) & 0x100);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0x3A (LDA a16)
     *
     * @this {CPU}
     */
    opLDA()
    {
        this.regA = this.getByte(this.getPCWord());
        this.nCyclesRemain -= 13;
    }

    /**
     * op=0x3B (DCX SP)
     *
     * @this {CPU}
     */
    opDCXSP()
    {
        this.setSP(this.getSP() - 1);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x3C (INR A)
     *
     * @this {CPU}
     */
    opINRA()
    {
        this.regA = this.incByte(this.regA);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x3D (DCR A)
     *
     * @this {CPU}
     */
    opDCRA()
    {
        this.regA = this.decByte(this.regA);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x3E (MVI A,d8)
     *
     * @this {CPU}
     */
    opMVIA()
    {
        this.regA = this.getPCByte();
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x3F (CMC)
     *
     * @this {CPU}
     */
    opCMC()
    {
        this.updateCF(this.getCF()? 0 : 0x100);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x40 (MOV B,B)
     *
     * @this {CPU}
     */
    opMOVBB()
    {
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x41 (MOV B,C)
     *
     * @this {CPU}
     */
    opMOVBC()
    {
        this.regB = this.regC;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x42 (MOV B,D)
     *
     * @this {CPU}
     */
    opMOVBD()
    {
        this.regB = this.regD;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x43 (MOV B,E)
     *
     * @this {CPU}
     */
    opMOVBE()
    {
        this.regB = this.regE;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x44 (MOV B,H)
     *
     * @this {CPU}
     */
    opMOVBH()
    {
        this.regB = this.regH;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x45 (MOV B,L)
     *
     * @this {CPU}
     */
    opMOVBL()
    {
        this.regB = this.regL;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x46 (MOV B,M)
     *
     * @this {CPU}
     */
    opMOVBM()
    {
        this.regB = this.getByte(this.getHL());
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x47 (MOV B,A)
     *
     * @this {CPU}
     */
    opMOVBA()
    {
        this.regB = this.regA;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x48 (MOV C,B)
     *
     * @this {CPU}
     */
    opMOVCB()
    {
        this.regC = this.regB;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x49 (MOV C,C)
     *
     * @this {CPU}
     */
    opMOVCC()
    {
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x4A (MOV C,D)
     *
     * @this {CPU}
     */
    opMOVCD()
    {
        this.regC = this.regD;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x4B (MOV C,E)
     *
     * @this {CPU}
     */
    opMOVCE()
    {
        this.regC = this.regE;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x4C (MOV C,H)
     *
     * @this {CPU}
     */
    opMOVCH()
    {
        this.regC = this.regH;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x4D (MOV C,L)
     *
     * @this {CPU}
     */
    opMOVCL()
    {
        this.regC = this.regL;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x4E (MOV C,M)
     *
     * @this {CPU}
     */
    opMOVCM()
    {
        this.regC = this.getByte(this.getHL());
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x4F (MOV C,A)
     *
     * @this {CPU}
     */
    opMOVCA()
    {
        this.regC = this.regA;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x50 (MOV D,B)
     *
     * @this {CPU}
     */
    opMOVDB()
    {
        this.regD = this.regB;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x51 (MOV D,C)
     *
     * @this {CPU}
     */
    opMOVDC()
    {
        this.regD = this.regC;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x52 (MOV D,D)
     *
     * @this {CPU}
     */
    opMOVDD()
    {
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x53 (MOV D,E)
     *
     * @this {CPU}
     */
    opMOVDE()
    {
        this.regD = this.regE;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x54 (MOV D,H)
     *
     * @this {CPU}
     */
    opMOVDH()
    {
        this.regD = this.regH;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x55 (MOV D,L)
     *
     * @this {CPU}
     */
    opMOVDL()
    {
        this.regD = this.regL;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x56 (MOV D,M)
     *
     * @this {CPU}
     */
    opMOVDM()
    {
        this.regD = this.getByte(this.getHL());
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x57 (MOV D,A)
     *
     * @this {CPU}
     */
    opMOVDA()
    {
        this.regD = this.regA;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x58 (MOV E,B)
     *
     * @this {CPU}
     */
    opMOVEB()
    {
        this.regE = this.regB;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x59 (MOV E,C)
     *
     * @this {CPU}
     */
    opMOVEC()
    {
        this.regE = this.regC;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x5A (MOV E,D)
     *
     * @this {CPU}
     */
    opMOVED()
    {
        this.regE = this.regD;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x5B (MOV E,E)
     *
     * @this {CPU}
     */
    opMOVEE()
    {
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x5C (MOV E,H)
     *
     * @this {CPU}
     */
    opMOVEH()
    {
        this.regE = this.regH;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x5D (MOV E,L)
     *
     * @this {CPU}
     */
    opMOVEL()
    {
        this.regE = this.regL;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x5E (MOV E,M)
     *
     * @this {CPU}
     */
    opMOVEM()
    {
        this.regE = this.getByte(this.getHL());
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x5F (MOV E,A)
     *
     * @this {CPU}
     */
    opMOVEA()
    {
        this.regE = this.regA;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x60 (MOV H,B)
     *
     * @this {CPU}
     */
    opMOVHB()
    {
        this.regH = this.regB;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x61 (MOV H,C)
     *
     * @this {CPU}
     */
    opMOVHC()
    {
        this.regH = this.regC;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x62 (MOV H,D)
     *
     * @this {CPU}
     */
    opMOVHD()
    {
        this.regH = this.regD;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x63 (MOV H,E)
     *
     * @this {CPU}
     */
    opMOVHE()
    {
        this.regH = this.regE;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x64 (MOV H,H)
     *
     * @this {CPU}
     */
    opMOVHH()
    {
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x65 (MOV H,L)
     *
     * @this {CPU}
     */
    opMOVHL()
    {
        this.regH = this.regL;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x66 (MOV H,M)
     *
     * @this {CPU}
     */
    opMOVHM()
    {
        this.regH = this.getByte(this.getHL());
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x67 (MOV H,A)
     *
     * @this {CPU}
     */
    opMOVHA()
    {
        this.regH = this.regA;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x68 (MOV L,B)
     *
     * @this {CPU}
     */
    opMOVLB()
    {
        this.regL = this.regB;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x69 (MOV L,C)
     *
     * @this {CPU}
     */
    opMOVLC()
    {
        this.regL = this.regC;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x6A (MOV L,D)
     *
     * @this {CPU}
     */
    opMOVLD()
    {
        this.regL = this.regD;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x6B (MOV L,E)
     *
     * @this {CPU}
     */
    opMOVLE()
    {
        this.regL = this.regE;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x6C (MOV L,H)
     *
     * @this {CPU}
     */
    opMOVLH()
    {
        this.regL = this.regH;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x6D (MOV L,L)
     *
     * @this {CPU}
     */
    opMOVLL()
    {
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x6E (MOV L,M)
     *
     * @this {CPU}
     */
    opMOVLM()
    {
        this.regL = this.getByte(this.getHL());
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x6F (MOV L,A)
     *
     * @this {CPU}
     */
    opMOVLA()
    {
        this.regL = this.regA;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x70 (MOV M,B)
     *
     * @this {CPU}
     */
    opMOVMB()
    {
        this.setByte(this.getHL(), this.regB);
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x71 (MOV M,C)
     *
     * @this {CPU}
     */
    opMOVMC()
    {
        this.setByte(this.getHL(), this.regC);
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x72 (MOV M,D)
     *
     * @this {CPU}
     */
    opMOVMD()
    {
        this.setByte(this.getHL(), this.regD);
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x73 (MOV M,E)
     *
     * @this {CPU}
     */
    opMOVME()
    {
        this.setByte(this.getHL(), this.regE);
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x74 (MOV M,H)
     *
     * @this {CPU}
     */
    opMOVMH()
    {
        this.setByte(this.getHL(), this.regH);
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x75 (MOV M,L)
     *
     * @this {CPU}
     */
    opMOVML()
    {
        this.setByte(this.getHL(), this.regL);
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x76 (HLT)
     *
     * @this {CPU}
     */
    opHLT()
    {
        this.nCyclesRemain -= 7;
        /*
         * The CPU is never REALLY halted by a HLT instruction; instead, we call requestHALT(), which
         * which sets INTFLAG.HALT and then ends the current burst; the CPU should not execute any
         * more instructions until checkINTR() indicates that a hardware interrupt has been requested.
         */
        this.requestHALT();
        /*
         * If interrupts have been disabled, then the machine is dead in the water (there is no NMI
         * NMI generation mechanism for this CPU), so let's stop the CPU; similarly, if the HALT message
         * category is enabled, then the Debugger must want us to stop the CPU.
         */
        if (!this.getIF() || this.isMessageOn(MESSAGE.HALT)) {
            let addr = this.getPC() - 1;
            this.setPC(addr);           // this is purely for the Debugger's benefit, to show the HLT
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
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x78 (MOV A,B)
     *
     * @this {CPU}
     */
    opMOVAB()
    {
        this.regA = this.regB;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x79 (MOV A,C)
     *
     * @this {CPU}
     */
    opMOVAC()
    {
        this.regA = this.regC;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x7A (MOV A,D)
     *
     * @this {CPU}
     */
    opMOVAD()
    {
        this.regA = this.regD;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x7B (MOV A,E)
     *
     * @this {CPU}
     */
    opMOVAE()
    {
        this.regA = this.regE;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x7C (MOV A,H)
     *
     * @this {CPU}
     */
    opMOVAH()
    {
        this.regA = this.regH;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x7D (MOV A,L)
     *
     * @this {CPU}
     */
    opMOVAL()
    {
        this.regA = this.regL;
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x7E (MOV A,M)
     *
     * @this {CPU}
     */
    opMOVAM()
    {
        this.regA = this.getByte(this.getHL());
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x7F (MOV A,A)
     *
     * @this {CPU}
     */
    opMOVAA()
    {
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0x80 (ADD B)
     *
     * @this {CPU}
     */
    opADDB()
    {
        this.regA = this.addByte(this.regB);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x81 (ADD C)
     *
     * @this {CPU}
     */
    opADDC()
    {
        this.regA = this.addByte(this.regC);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x82 (ADD D)
     *
     * @this {CPU}
     */
    opADDD()
    {
        this.regA = this.addByte(this.regD);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x83 (ADD E)
     *
     * @this {CPU}
     */
    opADDE()
    {
        this.regA = this.addByte(this.regE);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x84 (ADD H)
     *
     * @this {CPU}
     */
    opADDH()
    {
        this.regA = this.addByte(this.regH);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x85 (ADD L)
     *
     * @this {CPU}
     */
    opADDL()
    {
        this.regA = this.addByte(this.regL);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x86 (ADD M)
     *
     * @this {CPU}
     */
    opADDM()
    {
        this.regA = this.addByte(this.getByte(this.getHL()));
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x87 (ADD A)
     *
     * @this {CPU}
     */
    opADDA()
    {
        this.regA = this.addByte(this.regA);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x88 (ADC B)
     *
     * @this {CPU}
     */
    opADCB()
    {
        this.regA = this.addByteCarry(this.regB);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x89 (ADC C)
     *
     * @this {CPU}
     */
    opADCC()
    {
        this.regA = this.addByteCarry(this.regC);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x8A (ADC D)
     *
     * @this {CPU}
     */
    opADCD()
    {
        this.regA = this.addByteCarry(this.regD);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x8B (ADC E)
     *
     * @this {CPU}
     */
    opADCE()
    {
        this.regA = this.addByteCarry(this.regE);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x8C (ADC H)
     *
     * @this {CPU}
     */
    opADCH()
    {
        this.regA = this.addByteCarry(this.regH);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x8D (ADC L)
     *
     * @this {CPU}
     */
    opADCL()
    {
        this.regA = this.addByteCarry(this.regL);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x8E (ADC M)
     *
     * @this {CPU}
     */
    opADCM()
    {
        this.regA = this.addByteCarry(this.getByte(this.getHL()));
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x8F (ADC A)
     *
     * @this {CPU}
     */
    opADCA()
    {
        this.regA = this.addByteCarry(this.regA);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x90 (SUB B)
     *
     * @this {CPU}
     */
    opSUBB()
    {
        this.regA = this.subByte(this.regB);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x91 (SUB C)
     *
     * @this {CPU}
     */
    opSUBC()
    {
        this.regA = this.subByte(this.regC);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x92 (SUB D)
     *
     * @this {CPU}
     */
    opSUBD()
    {
        this.regA = this.subByte(this.regD);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x93 (SUB E)
     *
     * @this {CPU}
     */
    opSUBE()
    {
        this.regA = this.subByte(this.regE);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x94 (SUB H)
     *
     * @this {CPU}
     */
    opSUBH()
    {
        this.regA = this.subByte(this.regH);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x95 (SUB L)
     *
     * @this {CPU}
     */
    opSUBL()
    {
        this.regA = this.subByte(this.regL);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x96 (SUB M)
     *
     * @this {CPU}
     */
    opSUBM()
    {
        this.regA = this.subByte(this.getByte(this.getHL()));
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x97 (SUB A)
     *
     * @this {CPU}
     */
    opSUBA()
    {
        this.regA = this.subByte(this.regA);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x98 (SBB B)
     *
     * @this {CPU}
     */
    opSBBB()
    {
        this.regA = this.subByteBorrow(this.regB);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x99 (SBB C)
     *
     * @this {CPU}
     */
    opSBBC()
    {
        this.regA = this.subByteBorrow(this.regC);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x9A (SBB D)
     *
     * @this {CPU}
     */
    opSBBD()
    {
        this.regA = this.subByteBorrow(this.regD);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x9B (SBB E)
     *
     * @this {CPU}
     */
    opSBBE()
    {
        this.regA = this.subByteBorrow(this.regE);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x9C (SBB H)
     *
     * @this {CPU}
     */
    opSBBH()
    {
        this.regA = this.subByteBorrow(this.regH);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x9D (SBB L)
     *
     * @this {CPU}
     */
    opSBBL()
    {
        this.regA = this.subByteBorrow(this.regL);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0x9E (SBB M)
     *
     * @this {CPU}
     */
    opSBBM()
    {
        this.regA = this.subByteBorrow(this.getByte(this.getHL()));
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0x9F (SBB A)
     *
     * @this {CPU}
     */
    opSBBA()
    {
        this.regA = this.subByteBorrow(this.regA);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xA0 (ANA B)
     *
     * @this {CPU}
     */
    opANAB()
    {
        this.regA = this.andByte(this.regB);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xA1 (ANA C)
     *
     * @this {CPU}
     */
    opANAC()
    {
        this.regA = this.andByte(this.regC);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xA2 (ANA D)
     *
     * @this {CPU}
     */
    opANAD()
    {
        this.regA = this.andByte(this.regD);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xA3 (ANA E)
     *
     * @this {CPU}
     */
    opANAE()
    {
        this.regA = this.andByte(this.regE);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xA4 (ANA H)
     *
     * @this {CPU}
     */
    opANAH()
    {
        this.regA = this.andByte(this.regH);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xA5 (ANA L)
     *
     * @this {CPU}
     */
    opANAL()
    {
        this.regA = this.andByte(this.regL);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xA6 (ANA M)
     *
     * @this {CPU}
     */
    opANAM()
    {
        this.regA = this.andByte(this.getByte(this.getHL()));
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0xA7 (ANA A)
     *
     * @this {CPU}
     */
    opANAA()
    {
        this.regA = this.andByte(this.regA);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xA8 (XRA B)
     *
     * @this {CPU}
     */
    opXRAB()
    {
        this.regA = this.xorByte(this.regB);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xA9 (XRA C)
     *
     * @this {CPU}
     */
    opXRAC()
    {
        this.regA = this.xorByte(this.regC);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xAA (XRA D)
     *
     * @this {CPU}
     */
    opXRAD()
    {
        this.regA = this.xorByte(this.regD);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xAB (XRA E)
     *
     * @this {CPU}
     */
    opXRAE()
    {
        this.regA = this.xorByte(this.regE);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xAC (XRA H)
     *
     * @this {CPU}
     */
    opXRAH()
    {
        this.regA = this.xorByte(this.regH);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xAD (XRA L)
     *
     * @this {CPU}
     */
    opXRAL()
    {
        this.regA = this.xorByte(this.regL);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xAE (XRA M)
     *
     * @this {CPU}
     */
    opXRAM()
    {
        this.regA = this.xorByte(this.getByte(this.getHL()));
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0xAF (XRA A)
     *
     * @this {CPU}
     */
    opXRAA()
    {
        this.regA = this.xorByte(this.regA);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xB0 (ORA B)
     *
     * @this {CPU}
     */
    opORAB()
    {
        this.regA = this.orByte(this.regB);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xB1 (ORA C)
     *
     * @this {CPU}
     */
    opORAC()
    {
        this.regA = this.orByte(this.regC);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xB2 (ORA D)
     *
     * @this {CPU}
     */
    opORAD()
    {
        this.regA = this.orByte(this.regD);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xB3 (ORA E)
     *
     * @this {CPU}
     */
    opORAE()
    {
        this.regA = this.orByte(this.regE);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xB4 (ORA H)
     *
     * @this {CPU}
     */
    opORAH()
    {
        this.regA = this.orByte(this.regH);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xB5 (ORA L)
     *
     * @this {CPU}
     */
    opORAL()
    {
        this.regA = this.orByte(this.regL);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xB6 (ORA M)
     *
     * @this {CPU}
     */
    opORAM()
    {
        this.regA = this.orByte(this.getByte(this.getHL()));
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0xB7 (ORA A)
     *
     * @this {CPU}
     */
    opORAA()
    {
        this.regA = this.orByte(this.regA);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xB8 (CMP B)
     *
     * @this {CPU}
     */
    opCMPB()
    {
        this.subByte(this.regB);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xB9 (CMP C)
     *
     * @this {CPU}
     */
    opCMPC()
    {
        this.subByte(this.regC);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xBA (CMP D)
     *
     * @this {CPU}
     */
    opCMPD()
    {
        this.subByte(this.regD);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xBB (CMP E)
     *
     * @this {CPU}
     */
    opCMPE()
    {
        this.subByte(this.regE);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xBC (CMP H)
     *
     * @this {CPU}
     */
    opCMPH()
    {
        this.subByte(this.regH);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xBD (CMP L)
     *
     * @this {CPU}
     */
    opCMPL()
    {
        this.subByte(this.regL);
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xBE (CMP M)
     *
     * @this {CPU}
     */
    opCMPM()
    {
        this.subByte(this.getByte(this.getHL()));
        this.nCyclesRemain -= 7;
    }

    /**
     * op=0xBF (CMP A)
     *
     * @this {CPU}
     */
    opCMPA()
    {
        this.subByte(this.regA);
        this.nCyclesRemain -= 4;
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
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xC1 (POP B)
     *
     * @this {CPU}
     */
    opPOPB()
    {
        this.setBC(this.popWord());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xC2 (JNZ a16)
     *
     * @this {CPU}
     */
    opJNZ()
    {
        let w = this.getPCWord();
        if (!this.getZF()) this.setPC(w);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xC3 (JMP a16)
     *
     * @this {CPU}
     */
    opJMP()
    {
        this.setPC(this.getPCWord());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xC4 (CNZ a16)
     *
     * @this {CPU}
     */
    opCNZ()
    {
        let w = this.getPCWord();
        if (!this.getZF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xC5 (PUSH B)
     *
     * @this {CPU}
     */
    opPUSHB()
    {
        this.pushWord(this.getBC());
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xC6 (ADI d8)
     *
     * @this {CPU}
     */
    opADI()
    {
        this.regA = this.addByte(this.getPCByte());
        this.nCyclesRemain -= 7;
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
        this.nCyclesRemain -= 11;
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
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xC9 (RET)
     *
     * @this {CPU}
     */
    opRET()
    {
        this.setPC(this.popWord());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xCA (JZ a16)
     *
     * @this {CPU}
     */
    opJZ()
    {
        let w = this.getPCWord();
        if (this.getZF()) this.setPC(w);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xCC (CZ a16)
     *
     * @this {CPU}
     */
    opCZ()
    {
        let w = this.getPCWord();
        if (this.getZF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xCD (CALL a16)
     *
     * @this {CPU}
     */
    opCALL()
    {
        let w = this.getPCWord();
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nCyclesRemain -= 17;
    }

    /**
     * op=0xCE (ACI d8)
     *
     * @this {CPU}
     */
    opACI()
    {
        this.regA = this.addByteCarry(this.getPCByte());
        this.nCyclesRemain -= 7;
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
        this.nCyclesRemain -= 11;
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
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xD1 (POP D)
     *
     * @this {CPU}
     */
    opPOPD()
    {
        this.setDE(this.popWord());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xD2 (JNC a16)
     *
     * @this {CPU}
     */
    opJNC()
    {
        let w = this.getPCWord();
        if (!this.getCF()) this.setPC(w);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xD3 (OUT d8)
     *
     * @this {CPU}
     */
    opOUT()
    {
        let port = this.getPCByte();
        this.busIO.writeData(port, this.regA);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xD4 (CNC a16)
     *
     * @this {CPU}
     */
    opCNC()
    {
        let w = this.getPCWord();
        if (!this.getCF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xD5 (PUSH D)
     *
     * @this {CPU}
     */
    opPUSHD()
    {
        this.pushWord(this.getDE());
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xD6 (SUI d8)
     *
     * @this {CPU}
     */
    opSUI()
    {
        this.regA = this.subByte(this.getPCByte());
        this.nCyclesRemain -= 7;
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
        this.nCyclesRemain -= 11;
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
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xDA (JC a16)
     *
     * @this {CPU}
     */
    opJC()
    {
        let w = this.getPCWord();
        if (this.getCF()) this.setPC(w);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xDB (IN d8)
     *
     * @this {CPU}
     */
    opIN()
    {
        let port = this.getPCByte();
        this.regA = this.busIO.readData(port) & 0xff;
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xDC (CC a16)
     *
     * @this {CPU}
     */
    opCC()
    {
        let w = this.getPCWord();
        if (this.getCF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xDE (SBI d8)
     *
     * @this {CPU}
     */
    opSBI()
    {
        this.regA = this.subByteBorrow(this.getPCByte());
        this.nCyclesRemain -= 7;
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
        this.nCyclesRemain -= 11;
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
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xE1 (POP H)
     *
     * @this {CPU}
     */
    opPOPH()
    {
        this.setHL(this.popWord());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xE2 (JPO a16)
     *
     * @this {CPU}
     */
    opJPO()
    {
        let w = this.getPCWord();
        if (!this.getPF()) this.setPC(w);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xE3 (XTHL)
     *
     * @this {CPU}
     */
    opXTHL()
    {
        let w = this.popWord();
        this.pushWord(this.getHL());
        this.setHL(w);
        this.nCyclesRemain -= 18;
    }

    /**
     * op=0xE4 (CPO a16)
     *
     * @this {CPU}
     */
    opCPO()
    {
        let w = this.getPCWord();
        if (!this.getPF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xE5 (PUSH H)
     *
     * @this {CPU}
     */
    opPUSHH()
    {
        this.pushWord(this.getHL());
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xE6 (ANI d8)
     *
     * @this {CPU}
     */
    opANI()
    {
        this.regA = this.andByte(this.getPCByte());
        this.nCyclesRemain -= 7;
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
        this.nCyclesRemain -= 11;
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
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xE9 (PCHL)
     *
     * @this {CPU}
     */
    opPCHL()
    {
        this.setPC(this.getHL());
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xEA (JPE a16)
     *
     * @this {CPU}
     */
    opJPE()
    {
        let w = this.getPCWord();
        if (this.getPF()) this.setPC(w);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xEB (XCHG)
     *
     * @this {CPU}
     */
    opXCHG()
    {
        let w = this.getHL();
        this.setHL(this.getDE());
        this.setDE(w);
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xEC (CPE a16)
     *
     * @this {CPU}
     */
    opCPE()
    {
        let w = this.getPCWord();
        if (this.getPF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xEE (XRI d8)
     *
     * @this {CPU}
     */
    opXRI()
    {
        this.regA = this.xorByte(this.getPCByte());
        this.nCyclesRemain -= 7;
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
        this.nCyclesRemain -= 11;
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
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xF1 (POP PSW)
     *
     * @this {CPU}
     */
    opPOPSW()
    {
        this.setPSW(this.popWord());
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xF2 (JP a16)
     *
     * @this {CPU}
     */
    opJP()
    {
        let w = this.getPCWord();
        if (!this.getSF()) this.setPC(w);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xF3 (DI)
     *
     * @this {CPU}
     */
    opDI()
    {
        this.clearIF();
        this.nCyclesRemain -= 4;
    }

    /**
     * op=0xF4 (CP a16)
     *
     * @this {CPU}
     */
    opCP()
    {
        let w = this.getPCWord();
        if (!this.getSF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xF5 (PUSH PSW)
     *
     * @this {CPU}
     */
    opPUPSW()
    {
        this.pushWord(this.getPSW());
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xF6 (ORI d8)
     *
     * @this {CPU}
     */
    opORI()
    {
        this.regA = this.orByte(this.getPCByte());
        this.nCyclesRemain -= 7;
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
        this.nCyclesRemain -= 11;
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
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xF9 (SPHL)
     *
     * @this {CPU}
     */
    opSPHL()
    {
        this.setSP(this.getHL());
        this.nCyclesRemain -= 5;
    }

    /**
     * op=0xFA (JM a16)
     *
     * @this {CPU}
     */
    opJM()
    {
        let w = this.getPCWord();
        if (this.getSF()) this.setPC(w);
        this.nCyclesRemain -= 10;
    }

    /**
     * op=0xFB (EI)
     *
     * @this {CPU}
     */
    opEI()
    {
        this.setIF();
        this.nCyclesRemain -= 4;
        this.checkINTR();
    }

    /**
     * op=0xFC (CM a16)
     *
     * @this {CPU}
     */
    opCM()
    {
        let w = this.getPCWord();
        if (this.getSF()) {
            this.pushWord(this.getPC());
            this.setPC(w);
            this.nCyclesRemain -= 6;
        }
        this.nCyclesRemain -= 11;
    }

    /**
     * op=0xFE (CPI d8)
     *
     * @this {CPU}
     */
    opCPI()
    {
        this.subByte(this.getPCByte());
        this.nCyclesRemain -= 7;
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
        this.nCyclesRemain -= 11;
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
         * regPCLast is an internal register that simply snapshots the PC at the start of every instruction;
         * this is useful not only for CPUs that need to support instruction restartability, but also for
         * diagnostic/debugging purposes.
         */
        this.regPCLast = this.regPC;

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
     * getPCLast()
     *
     * Returns the physical address of the last (or currently executing) instruction.
     *
     * @this {CPU}
     * @return {number}
     */
    getPCLast()
    {
        return this.regPCLast;
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
        return this.busMemory.readPair(addr);
    }

    /**
     * setByte(addr, b)
     *
     * @this {CPU}
     * @param {number} addr is a linear address
     * @param {number} b is the byte (8-bit) value to write (which we truncate to 8 bits to be safe)
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
        this.busMemory.writePair(addr, w & 0xffff);
    }

    /**
     * getPCByte()
     *
     * @this {CPU}
     * @return {number} byte at the current PC; PC advanced by 1
     */
    getPCByte()
    {
        let b = this.getByte(this.regPC);
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
        let w = this.getWord(this.regPC);
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
        let w = this.getWord(this.regSP);
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
         * If the Debugger is single-stepping, isRunning() will be false, which we take advantage
         * of here to avoid processing interrupts.  The Debugger will have to issue a "g" command
         * to resume normal interrupt processing.
         */
        if (this.time.isRunning()) {
            if ((this.intFlags & CPU.INTFLAG.INTR) && this.getIF()) {
                let nLevel;
                for (nLevel = 0; nLevel < 8; nLevel++) {
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
             * calls requestHALT(), which sets INTFLAG.HALT and then ends the current burst; the CPU should not
             * execute any more instructions until checkINTR() indicates a hardware interrupt has been requested.
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
     * nLevel can either be a valid interrupt level (0-7), or undefined to clear all pending interrupts
     * (eg, in the event of a system-wide reset).
     *
     * @this {CPU}
     * @param {number} [nLevel] (0-7, or undefined for all)
     */
    clearINTR(nLevel = -1)
    {
        let bitsClear = nLevel < 0? 0xff : (1 << nLevel);
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
     * set, then we know that checkINTR() will want to issue the interrupt, so we end the current burst.
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
     * toInstruction(addr, opcode)
     *
     * Returns a string representation of the specified instruction.
     *
     * @this {CPU}
     * @param {number} addr
     * @param {number|undefined} [opcode]
     * @return {string}
     */
    toInstruction(addr, opcode)
    {
        return this.dbg && this.dbg.dumpInstruction(addr, 1) || "";
    }

    /**
     * toString()
     *
     * Returns a string representation of the current CPU state.
     *
     * @this {CPU}
     * @return {string}
     */
    toString()
    {
        return this.sprintf("A=%02X BC=%04X DE=%04X HL=%04X SP=%04X I%d S%d Z%d A%d P%d C%d\n%s", this.regA, this.getBC(), this.getDE(), this.getHL(), this.getSP(), this.getIF()?1:0, this.getSF()?1:0, this.getZF()?1:0, this.getAF()?1:0, this.getPF()?1:0, this.getCF()?1:0, this.toInstruction(this.regPC));
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

Defs.CLASSES["CPU"] = CPU;

/**
 * @copyright https://www.pcjs.org/modules/devices/cpu/dbgio.js (C) Jeff Parsons 2012-2019
 */

/** @typedef {{ off: number, seg: number, type: number }} */
var Address;

/** @typedef {{ address: Address, type: number, name: string }} */
var SymbolObj;

 /** @typedef {{ device: Device, name: string, desc: string, func: function() }} */
var Dumper;

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
         * Default base (radix).  This is used by our own functions (eg, parseExpression()),
         * but not by those we inherited (eg, parseInt()), which still use base 10 by default;
         * however, you can always coerce values to any base in any of those functions with
         * a prefix (eg, "0x" for hex) or suffix (eg, "." for decimal).
         */
        this.nDefaultBase = 16;

        /*
         * Default endian (0 = little, 1 = big).
         */
        this.nDefaultEndian = 0;                // TODO: Use it or lose it

        /*
         * Default maximum instruction (opcode) length, overridden by the CPU-specific debugger.
         */
        this.maxOpcodeLength = 1;

        /*
         * Default parsing parameters, subexpression and address delimiters.
         */
        this.nASCIIBits = 8;                    // change to 7 for MACRO-10 compatibility
        this.achGroup = ['(',')'];
        this.achAddress = ['[',']'];

        /*
         * This controls how we stop the CPU on a break condition.  If fExceptionOnBreak is true, we'll
         * throw an exception, which the CPU will catch and halt; however, the downside of that approach
         * is that, in some cases, it may leave the CPU in an inconsistent state.  It's generally safer to
         * leave fExceptionOnBreak false, which will simply stop the clock, allowing the current instruction
         * to finish executing.
         */
        this.fExceptionOnBreak = false;

        /*
         * If greater than zero, decremented on every instruction until it hits zero, then CPU is stoppped.
         */
        this.counterBreak = 0;

        /*
         * If set to MESSAGE.ALL, then we break on all messages.  It can be set to a subset of message bits,
         * but there is currently no UI for that.
         */
        this.messagesBreak = MESSAGE.NONE;

        /*
         * variables is an object with properties that grow as setVariable() assigns more variables;
         * each property corresponds to one variable, where the property name is the variable name (ie,
         * a string beginning with a non-digit, followed by zero or more symbol characters and/or digits)
         * and the property value is the variable's numeric value.
         *
         * Note that parseValue() parses variables before numbers, so any variable that looks like a
         * unprefixed hex value (eg, "a5" as opposed to "0xa5") will trump the numeric value.  Unprefixed
         * hex values are a convenience of parseValue(), which always calls parseInt() with a default
         * base of 16; however, that default be overridden with a variety of explicit prefixes or suffixes
         * (eg, a leading "0o" to indicate octal, a trailing period to indicate decimal, etc.)
         *
         * See parseInt() for more details about supported numbers.
         */
        this.variables = {};

        /*
         * Arrays of Symbol objects, one sorted by name and the other sorted by value; see addSymbols().
         */
        this.symbolsByName = [];
        this.symbolsByValue = [];

        /*
         * Get access to the CPU, so that in part so we can connect to all its registers; the Debugger has
         * no registers of its own, so we simply replace our registers with the CPU's.
         */
        this.cpu = /** @type {CPU} */ (this.findDeviceByClass("CPU"));
        this.registers = this.cpu.connectDebugger(this);

        /*
         * Get access to the Input device, so that we can switch focus whenever we start the machine.
         */
        this.input = /** @type {Input} */ (this.findDeviceByClass("Input", false));

        /*
         * Get access to the Bus devices, so we have access to the I/O and memory address spaces.
         *
         * To minimize configuration redundancy, we rely on the CPU's configuration to get the Bus device IDs.
         */
        this.busIO = /** @type {Bus} */ (this.findDevice(this.cpu.config['busIO'], false));
        this.busMemory = /** @type {Bus} */ (this.findDevice(this.cpu.config['busMemory']));

        this.nDefaultBits = this.busMemory.addrWidth;
        this.addrMask = (Math.pow(2, this.nDefaultBits) - 1)|0;

        /*
         * Since we want to be able to clear/disable/enable/list break addresses by index number, we maintain
         * an array (aBreakIndexes) that maps index numbers to address array entries.  The mapping values are
         * a combination of BREAKTYPE (high byte) and break address entry (low byte).
         *
         * As for which ones are disabled, that will be handled by adding TWO_POW32 to the address; machine
         * performance will still be affected, because any block(s) with break addresses will still be trapping
         * accesses, so you should clear break addresses whenever possible.
         */
        this.cBreaks = 0;
        this.cBreakIgnore = 0;  // incremented and decremented around internal reads and writes
        this.aBreakAddrs = [];
        for (let type in DbgIO.BREAKTYPE) {
            this.aBreakAddrs[DbgIO.BREAKTYPE[type]] = [];
        }
        this.aBreakBuses = [];
        this.aBreakBuses[DbgIO.BREAKTYPE.READ] = this.busMemory;
        this.aBreakBuses[DbgIO.BREAKTYPE.WRITE] = this.busMemory;
        this.aBreakBuses[DbgIO.BREAKTYPE.INPUT] = this.busIO;
        this.aBreakBuses[DbgIO.BREAKTYPE.OUTPUT] = this.busIO;
        this.aBreakChecks = [];
        this.aBreakChecks[DbgIO.BREAKTYPE.READ] = this.checkBusRead.bind(this);
        this.aBreakChecks[DbgIO.BREAKTYPE.WRITE] = this.checkBusWrite.bind(this)
        this.aBreakChecks[DbgIO.BREAKTYPE.INPUT] = this.checkBusInput.bind(this)
        this.aBreakChecks[DbgIO.BREAKTYPE.OUTPUT] = this.checkBusOutput.bind(this)
        this.aBreakIndexes = [];
        this.fStepQuietly = undefined;          // when stepping, this informs onUpdate() how "quiet" to be
        this.tempBreak = null;                  // temporary auto-cleared break address managed by setTemp() and clearTemp()
        this.cInstructions = 0;                 // instruction counter (updated only if history is enabled)

        /*
         * Get access to the Time device, so we can stop and start time as needed.
         */
        this.time = /** @type {Time} */ (this.findDeviceByClass("Time"));
        this.time.addUpdate(this);

        /*
         * Initialize additional properties required for our onCommand() handler, including
         * support for dump extensions (which we use ourselves to implement the "d state" command).
         */
        this.aDumpers = [];                     // array of dump extensions (aka "Dumpers")
        this.sDumpPrev = "";                    // remembers the previous "dump" command invoked
        this.addDumper(this, "state", "dump machine state", this.dumpState);

        this.addressCode = this.newAddress();
        this.addressData = this.newAddress();
        this.historyForced = false;
        this.historyNext = 0;
        this.historyBuffer = [];
        this.addHandler(Device.HANDLER.COMMAND, this.onCommand.bind(this));

        let commands = /** @type {string} */ (this.getMachineConfig("commands"));
        if (commands) this.parseCommands(commands);
    }

    /**
     * addDumper(device, name, desc, func)
     *
     * @this {DbgIO}
     * @param {Device} device
     * @param {string} name
     * @param {string} desc
     * @param {function()} func
     */
    addDumper(device, name, desc, func)
    {
        this.aDumpers.push({device, name, desc, func});
    }

    /**
     * checkDumper(option, values)
     *
     * @this {DbgIO}
     * @param {string} option
     * @param {Array.<number>} values
     * @return {string|undefined}
     */
    checkDumper(option, values)
    {
        let result;
        for (let i = 0; i < this.aDumpers.length; i++) {
            let dumper = this.aDumpers[i];
            if (dumper.name == option) {
                result = dumper.func.call(dumper.device, values);
                break;
            }
        }
        return result;
    }

    /**
     * addSymbol(address, type, name)
     *
     * @this {DbgIO}
     * @param {Address} address
     * @param {number} type (see DbgIO.SYMBOL_TYPE values)
     * @param {string} name
     */
    addSymbol(address, type, name)
    {
        let symbol = {address, type, name};
        this.binaryInsert(this.symbolsByName, symbol, this.compareSymbolNames);
        this.binaryInsert(this.symbolsByValue, symbol, this.compareSymbolValues);
    }

    /**
     * addSymbols(aSymbols)
     *
     * This currently supports only symbol arrays, which consist of [address,type,name] triplets; eg:
     *
     *      "0320","=","HF_PORT",
     *      "0000:0034","4","HDISK_INT",
     *      "0040:0042","1","CMD_BLOCK",
     *      "0003","@","DISK_SETUP",
     *      "0000:004C","4","ORG_VECTOR",
     *      "0028",";","GET DISKETTE VECTOR"
     *
     * There are two basic symbol operations: findSymbolByValue(), which takes an address and finds the symbol,
     * if any, at that address, and findSymbolByName(), which takes a string and attempts to match it to an address.
     *
     * @this {DbgIO}
     * @param {Array|undefined} aSymbols
     */
    addSymbols(aSymbols)
    {
        if (aSymbols && aSymbols.length) {
            for (let iSymbol = 0; iSymbol < aSymbols.length-2; iSymbol += 3) {
                let address = this.parseAddress(aSymbols[iSymbol]);
                if (!address) continue;     // ignore symbols with bad addresses
                let type = DbgIO.SYMBOL_TYPES[aSymbols[iSymbol+1]];

                if (!type) continue;        // ignore symbols with unrecognized types
                let name = aSymbols[iSymbol+2];
                this.addSymbol(address, type, name);
            }
        }
    }

    /**
     * binaryInsert(a, v, fnCompare)
     *
     * If element v already exists in array a, the array is unchanged (we don't allow duplicates); otherwise, the
     * element is inserted into the array at the appropriate index.
     *
     * @this {DbgIO}
     * @param {Array} a is an array
     * @param {Object} v is the value to insert
     * @param {function(SymbolObj,SymbolObj):number} [fnCompare]
     */
    binaryInsert(a, v, fnCompare)
    {
        let index = this.binarySearch(a, v, fnCompare);
        if (index < 0) {
            a.splice(-(index + 1), 0, v);
        }
    }

    /**
     * binarySearch(a, v, fnCompare)
     *
     * @this {DbgIO}
     * @param {Array} a is an array
     * @param {Object} v
     * @param {function(SymbolObj,SymbolObj):number} [fnCompare]
     * @return {number} the index of matching entry if non-negative, otherwise the index of the insertion point
     */
    binarySearch(a, v, fnCompare)
    {
        let left = 0;
        let right = a.length;
        let found = 0;
        if (fnCompare === undefined) {
            fnCompare = function(a, b) { return a > b? 1 : a < b? -1 : 0; };
        }
        while (left < right) {
            let middle = (left + right) >> 1;
            let compareResult;
            compareResult = fnCompare(v, a[middle]);
            if (compareResult > 0) {
                left = middle + 1;
            } else {
                right = middle;
                found = !compareResult;
            }
        }
        return found? left : ~left;
    }

    /**
     * compareSymbolNames(symbol1, symbol2)
     *
     * @this {DbgIO}
     * @param {SymbolObj} symbol1
     * @param {SymbolObj} symbol2
     * @return {number}
     */
    compareSymbolNames(symbol1, symbol2)
    {
        return symbol1.name > symbol2.name? 1 : symbol1.name < symbol2.name? -1 : 0;
    }

    /**
     * compareSymbolValues(symbol1, symbol2)
     *
     * @this {DbgIO}
     * @param {SymbolObj} symbol1
     * @param {SymbolObj} symbol2
     * @return {number}
     */
    compareSymbolValues(symbol1, symbol2)
    {
        return symbol1.address.off > symbol2.address.off? 1 : symbol1.address.off < symbol2.address.off? -1 : 0;
    }

    /**
     * findSymbolByName(name)
     *
     * Search symbolsByName for name and return the corresponding symbol (undefined if not found).
     *
     * @this {DbgIO}
     * @param {string} name
     * @return {number} the index of matching entry if non-negative, otherwise the index of the insertion point
     */
    findSymbolByName(name)
    {
        let symbol = {address: null, type: 0, name};
        return this.binarySearch(this.symbolsByName, symbol, this.compareSymbolNames);
    }

    /**
     * findSymbolByValue(address)
     *
     * Search symbolsByValue for address and return the corresponding symbol (undefined if not found).
     *
     * @this {DbgIO}
     * @param {Address} address
     * @return {number} the index of matching entry if non-negative, otherwise the index of the insertion point
     */
    findSymbolByValue(address)
    {
        let symbol = {address, type: 0, name: undefined};
        return this.binarySearch(this.symbolsByValue, symbol, this.compareSymbolValues);
    }

    /**
     * getSymbol(name)
     *
     * @this {DbgIO}
     * @param {string} name
     * @return {number|undefined}
     */
    getSymbol(name)
    {
        let value;
        let i = this.findSymbolByName(name);
        if (i >= 0) {
            let symbol = this.symbolsByName[i];
            value = symbol.address.off;
        }
        return value;
    }

    /**
     * getSymbolName(address, type)
     *
     * @this {DbgIO}
     * @param {Address} address
     * @param {number} [type]
     * @return {string|undefined}
     */
    getSymbolName(address, type)
    {
        let name;
        let i = this.findSymbolByValue(address);
        if (i >= 0) {
            let symbol = this.symbolsByValue[i];
            if (!type || symbol.type == type) {
                name = symbol.name;
            }
        }
        return name;
    }

    /**
     * delVariable(name)
     *
     * @this {DbgIO}
     * @param {string} name
     */
    delVariable(name)
    {
        delete this.variables[name];
    }

    /**
     * getVariable(name)
     *
     * @this {DbgIO}
     * @param {string} name
     * @return {number|undefined}
     */
    getVariable(name)
    {
        if (this.variables[name]) {
            return this.variables[name].value;
        }
        name = name.substr(0, 6);
        return this.variables[name] && this.variables[name].value;
    }

    /**
     * getVariableFixup(name)
     *
     * @this {DbgIO}
     * @param {string} name
     * @return {string|undefined}
     */
    getVariableFixup(name)
    {
        return this.variables[name] && this.variables[name].sUndefined;
    }

    /**
     * isVariable(name)
     *
     * @this {DbgIO}
     * @param {string} name
     * @return {boolean}
     */
    isVariable(name)
    {
        return this.variables[name] !== undefined;
    }

    /**
     * resetVariables()
     *
     * @this {DbgIO}
     * @return {Object}
     */
    resetVariables()
    {
        let a = this.variables;
        this.variables = {};
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
        this.variables = a;
    }

    /**
     * setVariable(name, value, sUndefined)
     *
     * @this {DbgIO}
     * @param {string} name
     * @param {number} value
     * @param {string|undefined} [sUndefined]
     */
    setVariable(name, value, sUndefined)
    {
        this.variables[name] = {value, sUndefined};
    }

    /**
     * addAddress(address, offset, bus)
     *
     * All this function currently supports are physical (Bus) addresses, but that will change.
     *
     * @this {DbgIO}
     * @param {Address} address
     * @param {number} offset
     * @param {Bus} [bus] (default is busMemory)
     * @return {Address}
     */
    addAddress(address, offset, bus = this.busMemory)
    {
        address.off = (address.off + offset) & bus.addrLimit;
        return address;
    }

    /**
     * makeAddress(address)
     *
     * All this function currently supports are physical (Bus) addresses, but that will change.
     *
     * @this {DbgIO}
     * @param {Address|number} address
     * @return {Address}
     */
    makeAddress(address)
    {
        return typeof address == "number"? this.newAddress(address) : address;
    }

    /**
     * newAddress(address)
     *
     * All this function currently supports are physical (Bus) addresses, but that will change.
     *
     * @this {DbgIO}
     * @param {Address|number} [address]
     * @return {Address}
     */
    newAddress(address = 0)
    {
        let seg = -1, type = DbgIO.ADDRESS.PHYSICAL;
        if (typeof address == "number") return {off: address, seg, type};
        return {off: address.off, seg: address.seg, type: address.type};
    }

    /**
     * parseAddress(sAddress, aUndefined)
     *
     * @this {DbgIO}
     * @param {string} sAddress
     * @param {Array} [aUndefined]
     * @return {Address|undefined|null} (undefined if no address supplied, null if a parsing error occurred)
     */
    parseAddress(sAddress, aUndefined)
    {
        let address;
        if (sAddress) {
            address = this.newAddress();
            let iAddr = 0;
            let ch = sAddress.charAt(iAddr);

            switch(ch) {
            case '&':
                iAddr++;
                break;
            case '#':
                iAddr++;
                address.type = DbgIO.ADDRESS.PROTECTED;
                break;
            case '%':
                iAddr++;
                ch = sAddress.charAt(iAddr);
                if (ch == '%') {
                    iAddr++;
                } else {
                    address.type = DbgIO.ADDRESS.LINEAR;
                }
                break;
            }

            let iColon = sAddress.indexOf(':', iAddr);
            if (iColon >= 0) {
                let seg = this.parseExpression(sAddress.substring(iAddr, iColon), aUndefined);
                if (seg == undefined) {
                    address = null;
                } else {
                    address.seg = seg;
                    iAddr = iColon + 1;
                }
            }
            if (address) {
                let off = this.parseExpression(sAddress.substring(iAddr), aUndefined);
                if (off == undefined) {
                    address = null;
                } else {
                    address.off = off & this.addrMask;
                }
            }
        }
        return address;
    }

    /**
     * readAddress(address, advance, bus)
     *
     * All this function currently supports are physical (Bus) addresses, but that will change.
     *
     * @this {DbgIO}
     * @param {Address} address
     * @param {number} [advance] (amount to advance address after read, if any)
     * @param {Bus} [bus] (default is busMemory)
     * @return {number|undefined}
     */
    readAddress(address, advance, bus = this.busMemory)
    {
        this.cBreakIgnore++;
        let value = bus.readData(address.off);
        if (advance) this.addAddress(address, advance, bus);
        this.cBreakIgnore--;
        return value;
    }

    /**
     * writeAddress(address, value, bus)
     *
     * All this function currently supports are physical (Bus) addresses, but that will change.
     *
     * @this {DbgIO}
     * @param {Address} address
     * @param {number} value
     * @param {Bus} [bus] (default is busMemory)
     */
    writeAddress(address, value, bus = this.busMemory)
    {
        this.cBreakIgnore++;
        bus.writeData(address.off, value);
        this.cBreakIgnore--;
    }

    /**
     * setAddress(address, addr)
     *
     * All this function currently supports are physical (Bus) addresses, but that will change.
     *
     * @this {DbgIO}
     * @param {Address} address
     * @param {number} addr
     */
    setAddress(address, addr)
    {
        address.off = addr;
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
     * @param {Array} [aUndefined]
     * @return {number|undefined}
     */
    parseArray(asValues, iValue, iLimit, nBase, aUndefined)
    {
        let value;
        let sValue, sOp;
        let fError = false;
        let unary = 0;
        let aVals = [], aOps = [];

        let nBasePrev = this.nDefaultBase;
        this.nDefaultBase = nBase;

        while (iValue < iLimit) {
            let v;
            sValue = asValues[iValue++].trim();
            sOp = (iValue < iLimit? asValues[iValue++] : "");

            if (sValue) {
                v = this.parseValue(sValue, undefined, aUndefined, unary);
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
                    if (v != null && unary) {
                        v = this.parseUnary(v, unary);
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
                     * and unary -- TBD).
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
                    if (!(unary & (0xC0000000|0))) {
                        if (sOp == '+') {
                            continue;
                        }
                        if (sOp == '-') {
                            unary = (unary << 2) | 1;
                            continue;
                        }
                        if (sOp == '~' || sOp == '^-') {
                            unary = (unary << 2) | 2;
                            continue;
                        }
                        if (sOp == '^L') {
                            unary = (unary << 2) | 3;
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
                    // aUndefined = [];
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
            unary = 0;
        }

        if (fError || !this.evalOps(aVals, aOps) || aVals.length != 1) {
            fError = true;
        }

        if (!fError) {
            value = aVals.pop();

        } else if (!aUndefined) {
            this.printf("parse error (%s)\n", (sValue || sOp));
        }

        this.nDefaultBase = nBasePrev;
        return value;
    }

    /**
     * parseASCII(expr, chDelim, nBits)
     *
     * @this {DbgIO}
     * @param {string} expr
     * @param {string} chDelim
     * @param {number} nBits (number of bits to store for each ASCII character)
     * @return {string|undefined}
     */
    parseASCII(expr, chDelim, nBits)
    {
        let i;
        let cchMax = (this.nDefaultBits / nBits)|0;
        while ((i = expr.indexOf(chDelim)) >= 0) {
            let v = 0;
            let j = i + 1;
            let cch = cchMax;
            while (j < expr.length) {
                let ch = expr[j++];
                if (ch == chDelim) {
                    cch = -1;
                    break;
                }
                if (!cch) break;
                cch--;
                let c = ch.charCodeAt(0);
                if (nBits == 6) {
                    c -= 0x20;
                }
                c &= ((1 << nBits) - 1);
                v = this.truncate(v * Math.pow(2, nBits) + c, nBits * cchMax, true);
            }
            if (cch >= 0) {
                this.printf("parse error (%c%s%c)\n", chDelim, expr, chDelim);
                return undefined;
            } else {
                expr = expr.substr(0, i) + this.toBase(v) + expr.substr(j);
            }
        }
        return expr;
    }

    /**
     * parseExpression(expr, aUndefined)
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
     * @param {string|undefined} expr
     * @param {Array} [aUndefined] (collects any undefined variables)
     * @return {number|undefined} numeric value, or undefined if expr contains any undefined or invalid values
     */
    parseExpression(expr, aUndefined)
    {
        let value;
        if (expr) {
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
                expr = expr.split(this.achGroup[0]).join('{').split(this.achGroup[1]).join('}');
            }

            /*
             * Quoted ASCII characters can have a numeric value, too, which must be converted now, to avoid any
             * conflicts with the operators below.
             *
             * NOTE: MACRO-10 packs up to 5 7-bit ASCII codes from a double-quoted value, and up to 6 6-bit ASCII
             * (SIXBIT) codes from a sinqle-quoted value.
             */
            expr = this.parseASCII(expr, '"', this.nASCIIBits);
            if (!expr) return value;
            expr = this.parseASCII(expr, "'", 6);
            if (!expr) return value;

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
                expr = expr.replace(/(^|[^A-Z0-9$%.])([0-9]+)B/, "$1$2^_").replace(/\s+/g, ' ');
            }
            let asValues = expr.split(regExp);
            value = this.parseArray(asValues, 0, asValues.length, this.nDefaultBase, aUndefined);
        }
        return value;
    }

    /**
     * parseUnary(value, unary)
     *
     * unary is actually a small "stack" of unary operations encoded in successive pairs of bits.
     * As parseExpression() encounters each unary operator, unary is shifted left 2 bits, and the
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
     * @param {number} unary
     * @return {number}
     */
    parseUnary(value, unary)
    {
        while (unary) {
            let bit;
            switch(unary & 0o3) {
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
            unary >>>= 2;
        }
        return value;
    }

    /**
     * parseValue(sValue, sName, aUndefined, unary)
     *
     * @this {DbgIO}
     * @param {string} [sValue]
     * @param {string} [sName] is the name of the value, if any
     * @param {Array} [aUndefined]
     * @param {number} [unary] (0 for none, 1 for negate, 2 for complement, 3 for leading zeros)
     * @return {number|undefined} numeric value, or undefined if sValue is either undefined or invalid
     */
    parseValue(sValue, sName, aUndefined, unary = 0)
    {
        let value;
        if (sValue != undefined) {
            value = this.getRegister(sValue.toUpperCase());
            if (value == undefined) {
                value = this.getSymbol(sValue);
                if (value == undefined) {
                    value = this.getVariable(sValue);
                    if (value == undefined) {
                        /*
                         * A feature of MACRO-10 is that any single-digit number is automatically interpreted as base-10.
                         */
                        value = this.parseInt(sValue, sValue.length > 1 || this.nDefaultBase > 10? this.nDefaultBase : 10);
                    } else {
                        let sUndefined = this.getVariableFixup(sValue);
                        if (sUndefined) {
                            if (aUndefined) {
                                aUndefined.push(sUndefined);
                            } else {
                                let valueUndefined = this.parseExpression(sUndefined, aUndefined);
                                if (valueUndefined !== undefined) {
                                    value += valueUndefined;
                                } else {
                                    if (MAXDEBUG) this.printf("undefined %s: %s (%s)\n", (sName || "value"), sValue, sUndefined);
                                    value = undefined;
                                }
                            }
                        }
                    }
                }
            }
            if (value != undefined) {
                value = this.truncate(this.parseUnary(value, unary));
            } else {
                if (MAXDEBUG) this.printf("invalid %s: %s\n", (sName || "value"), sValue);
            }
        } else {
            if (MAXDEBUG) this.printf("missing %s\n", (sName || "value"));
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
            if (MAXDEBUG) this.printf("warning: value %d truncated to %d\n", v, vNew);
            v = vNew;
        }
        return v;
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
            return this.enumBreak(this.clearBreak);
        }
        let isEmpty = function(aBreaks) {
            for (let i = 0; i < aBreaks.length; i++) {
                if (aBreaks[i] != undefined) return false;
            }
            return true;
        };
        let result = "";
        if (index >= 0) {
            let mapping = this.aBreakIndexes[index];
            if (mapping != undefined) {
                let type = mapping >> 8;
                let entry = mapping & 0xff;
                let bus = this.aBreakBuses[type];
                if (!bus) {
                    result = "invalid bus";
                } else {
                    let success;
                    let aBreakAddrs = this.aBreakAddrs[type];
                    let addr = aBreakAddrs[entry];

                    if (addr >= NumIO.TWO_POW32) {
                        addr = (addr - NumIO.TWO_POW32)|0;
                    }
                    if (!(type & 1)) {
                        success = bus.untrapRead(addr, this.aBreakChecks[type]);
                    } else {
                        success = bus.untrapWrite(addr, this.aBreakChecks[type]);
                    }
                    if (success) {
                        aBreakAddrs[entry] = undefined;
                        this.aBreakIndexes[index] = undefined;
                        if (isEmpty(aBreakAddrs)) {
                            aBreakAddrs.length = 0;
                            if (isEmpty(this.aBreakIndexes)) {
                                this.aBreakIndexes.length = 0;
                            }
                        }
                        result = this.sprintf("%2d: %s %#0~x cleared\n", index, DbgIO.BREAKCMD[type], bus.addrWidth, addr);
                        if (!--this.cBreaks) {
                            if (!this.historyForced) result += this.enableHistory(false);
                        }

                    } else {
                        result = this.sprintf("invalid break address: %#0~x\n", bus.addrWidth, addr);
                    }
                }
            } else {
                result = this.sprintf("invalid break index: %d\n", index);
            }
        } else {
            result = "missing break index\n";
        }
        return result;
    }

    /**
     * clearTemp(addr)
     *
     * Clears the current temporary break address if it matches the specified physical address.
     *
     * @this {DbgIO}
     * @param {number} [addr]
     */
    clearTemp(addr)
    {
        if (this.tempBreak) {                   // if there's a previous temp break address
            if (addr == undefined || this.tempBreak.off == addr) {
                let index = this.findBreak(this.tempBreak);
                if (index >= 0) {               // and it wasn't already cleared via other means
                    this.clearBreak(index);     // then clear it now
                }
                this.tempBreak = null;
            }
        }
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
            return this.enumBreak(this.enableBreak, enable);
        }
        let result = "";
        if (index >= 0) {
            let mapping = this.aBreakIndexes[index];
            if (mapping != undefined) {
                let success = true;
                let type = mapping >> 8;
                let entry = mapping & 0xff;
                let aBreakAddrs = this.aBreakAddrs[type];
                let addr = aBreakAddrs[entry], addrPrint;
                if (addr != undefined) {
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
                    let bus = this.aBreakBuses[type];
                    if (success) {
                        aBreakAddrs[entry] = addr;
                        result = this.sprintf("%2d: %s %#0~x %s\n", index, DbgIO.BREAKCMD[type], bus.addrWidth, addrPrint, action);
                    } else {
                        result = this.sprintf("%2d: %s %#0~x already %s\n", index, DbgIO.BREAKCMD[type], bus.addrWidth, addrPrint, action);
                    }
                } else {
                    /*
                     * TODO: This is really an internal error; this.assert() would be more appropriate than an error message
                     */
                    result = this.sprintf("no break address at index: %d\n", index);
                }
            } else {
                result = this.sprintf("invalid break index: %d\n", index);
            }
        } else {
            result = "missing break index\n";
        }
        return result;
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
        let result = "";
        for (let index = 0; index < this.aBreakIndexes.length; index++) {
            if (this.aBreakIndexes[index] == undefined) continue;
            result += func.call(this, index, option);
        }
        if (!result) result = "no break addresses found";
        return result;
    }

    /**
     * findAddress(address, aBreakAddrs)
     *
     * @this {DbgIO}
     * @param {Address} address
     * @param {Array} aBreakAddrs
     * @return {number} (break address entry, -1 if not found)
     */
    findAddress(address, aBreakAddrs)
    {
        let entry = aBreakAddrs.indexOf(address.off);
        if (entry < 0) entry = aBreakAddrs.indexOf((address.off >>> 0) + NumIO.TWO_POW32);
        return entry;
    }

    /**
     * findBreak(address, type)
     *
     * @this {DbgIO}
     * @param {Address} address
     * @param {number} [type] (default is BREAKTYPE.READ)
     * @return {number} (index of break address, -1 if not found)
     */
    findBreak(address, type = DbgIO.BREAKTYPE.READ)
    {
        let index = -1;
        let entry = this.findAddress(address, this.aBreakAddrs[type]);
        if (entry >= 0) {
            for (let i = 0; i < this.aBreakIndexes.length; i++) {
                let mapping = this.aBreakIndexes[i];
                if (mapping != undefined && type == (mapping >> 8) && entry == (mapping & 0xff)) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    /**
     * listBreak(fCommands)
     *
     * @this {DbgIO}
     * @param {boolean} [fCommands] (true to generate a list of break commands for saveState())
     * @return {string}
     */
    listBreak(fCommands = false)
    {
        let result = "";
        for (let index = 0; index < this.aBreakIndexes.length; index++) {
            let mapping = this.aBreakIndexes[index];
            if (mapping == undefined) continue;
            let type = mapping >> 8;
            let entry = mapping & 0xff;
            let addr = this.aBreakAddrs[type][entry];
            let enabled = true;
            if (addr >= NumIO.TWO_POW32) {
                enabled = false;
                addr = (addr - NumIO.TWO_POW32)|0;
            }
            let bus = this.aBreakBuses[type];
            let command = this.sprintf("%s %#0~x", DbgIO.BREAKCMD[type], bus.addrWidth, addr);
            if (fCommands) {
                if (result) result += ';';
                result += command;
                if (!enabled) result += ";bd " + index;
            } else {
                result += this.sprintf("%2d: %s %s\n", index, command, enabled? "enabled" : "disabled");
            }
        }
        if (!result) {
            if (!fCommands) result = "no break addresses found\n";
        }
        return result;
    }

    /**
     * setBreak(address, type)
     *
     * @this {DbgIO}
     * @param {Address} [address]
     * @param {number} [type] (default is BREAKTYPE.READ)
     * @return {string}
     */
    setBreak(address, type = DbgIO.BREAKTYPE.READ)
    {
        let dbg = this;
        let result = "";

        /**
         * addBreakAddress(address, aBreakAddrs)
         *
         * @param {Address} address
         * @param {Array} aBreakAddrs
         * @return {number} (>= 0 if added, < 0 if not)
         */
        let addBreakAddress = function(address, aBreakAddrs) {
            let entry = dbg.findAddress(address, aBreakAddrs);
            if (entry >= 0) {
                entry = -(entry + 1);
            } else {
                for (entry = 0; entry < aBreakAddrs.length; entry++) {
                    if (aBreakAddrs[entry] == undefined) break;
                }
                aBreakAddrs[entry] = address.off;
            }
            return entry;
        };

        /**
         * addBreakIndex(type, entry)
         *
         * @param {number} type
         * @param {number} entry
         * @return {number} (new index)
         */
        let addBreakIndex = function(type, entry) {
            let index;
            for (index = 0; index < dbg.aBreakIndexes.length; index++) {
                if (dbg.aBreakIndexes[index] == undefined) break;
            }
            dbg.aBreakIndexes[index] = (type << 8) | entry;
            return index;
        };

        if (address) {
            let success;
            let bus = this.aBreakBuses[type];
            if (!bus) {
                result = "invalid bus";
            } else {
                let entry = addBreakAddress(address, this.aBreakAddrs[type]);
                if (entry >= 0) {
                    if (!(type & 1)) {
                        success = bus.trapRead(address.off, this.aBreakChecks[type]);
                    } else {
                        success = bus.trapWrite(address.off, this.aBreakChecks[type]);
                    }
                    if (success) {
                        let index = addBreakIndex(type, entry);
                        result = this.sprintf("%2d: %s %#0~x set\n", index, DbgIO.BREAKCMD[type], bus.addrWidth, address.off);
                        if (!this.cBreaks++) {
                            if (!this.historyBuffer.length) result += this.enableHistory(true);
                        }
                    } else {
                        result = this.sprintf("invalid break address: %#0~x\n", bus.addrWidth, address.off);
                        this.aBreakAddrs[type][entry] = undefined;
                    }
                } else {
                    result = this.sprintf("%s %#0~x already set\n", DbgIO.BREAKCMD[type], bus.addrWidth, address.off);
                }
            }
        } else {
            result = "missing break address\n";
        }
        return result;
    }

    /**
     * setBreakCounter(n)
     *
     * Set number of instructions to execute before breaking.
     *
     * @this {DbgIO}
     * @param {number} n (-1 if no number was supplied, so just display current counter)
     * @return {string}
     */
    setBreakCounter(n)
    {
        let result = "";
        if (n >= 0) this.counterBreak = n;
        result += "instruction break count: " + (this.counterBreak > 0? this.counterBreak : "disabled") + "\n";
        if (n > 0) {
            /*
             * It doesn't hurt to always call enableHistory(), but avoiding the call minimizes unnecessary messages.
             */
            if (!this.historyBuffer.length) result += this.enableHistory(true);
            this.historyForced = true;
        }
        return result;
    }

    /**
     * setBreakMessage(option)
     *
     * Set message(s) to break on when we are notified of being printed.
     *
     * @this {DbgIO}
     * @param {string} option
     * @return {string}
     */
    setBreakMessage(option)
    {
        let result;
        if (option) {
            let on = this.parseBoolean(option);
            if (on != undefined) {
                this.messagesBreak = on? MESSAGE.ALL : MESSAGE.NONE;
            } else {
                result = this.sprintf("unrecognized message option: %s\n", option);
            }
        }
        if (!result) {
            result = this.sprintf("break on message: %b\n", !!this.messagesBreak);
        }
        return result;
    }

    /**
     * setTemp(address)
     *
     * @this {DbgIO}
     * @param {Address} address
     */
    setTemp(address)
    {
        this.tempBreak = address;
    }

    /**
     * checkBusInput(base, offset, value)
     *
     * @this {DbgIO}
     * @param {number|undefined} base
     * @param {number} offset
     * @param {number} value
     */
    checkBusInput(base, offset, value)
    {
        if (this.cBreakIgnore) return;
        if (base == undefined) {
            this.stopCPU(this.sprintf("break on unknown input %#0x: %#0x", offset, value));
        } else {
            let addr = base + offset;
            if (this.aBreakAddrs[DbgIO.BREAKTYPE.INPUT].indexOf(addr) >= 0) {
                this.stopCPU(this.sprintf("break on input %#0x: %#0x", addr, value));
            }
        }
    }

    /**
     * checkBusOutput(base, offset, value)
     *
     * @this {DbgIO}
     * @param {number|undefined} base
     * @param {number} offset
     * @param {number} value
     */
    checkBusOutput(base, offset, value)
    {
        if (this.cBreakIgnore) return;
        if (base == undefined) {
            this.stopCPU(this.sprintf("break on unknown output %#0x: %#0x", offset, value));
        } else {
            let addr = base + offset;
            if (this.aBreakAddrs[DbgIO.BREAKTYPE.OUTPUT].indexOf(addr) >= 0) {
                this.stopCPU(this.sprintf("break on output %#0x: %#0x", addr, value));
            }
        }
    }

    /**
     * checkBusRead(base, offset, value)
     *
     * If historyBuffer has been allocated, then we need to record all instruction fetches, which we
     * distinguish as reads where the physical address matches cpu.getPCLast().
     *
     * TODO: Additional logic will be required for machines where the logical PC differs from the physical
     * address (eg, machines with segmentation or paging enabled), but that's an issue for another day.
     *
     * @this {DbgIO}
     * @param {number|undefined} base
     * @param {number} offset
     * @param {number} value
     */
    checkBusRead(base, offset, value)
    {
        if (this.cBreakIgnore) return;
        if (base == undefined) {
            this.stopCPU(this.sprintf("break on unknown read %#0x: %#0x", offset, value));
        } else {
            let addr = base + offset;
            if (this.historyBuffer.length) {
                if (addr == this.cpu.getPCLast()) {
                    this.cInstructions++;
                    if (this.counterBreak > 0) {
                        if (!--this.counterBreak) {
                            this.stopCPU(this.sprintf("break on instruction count"));
                        }
                    }
                    this.historyBuffer[this.historyNext++] = addr;
                    if (this.historyNext == this.historyBuffer.length) this.historyNext = 0;
                }
            }
            if (this.aBreakAddrs[DbgIO.BREAKTYPE.READ].indexOf(addr) >= 0) {
                this.stopCPU(this.sprintf("break on read %#0x: %#0x", addr, value));
                this.clearTemp(addr);
            }
        }
    }

    /**
     * checkBusWrite(base, offset, value)
     *
     * @this {DbgIO}
     * @param {number|undefined} base
     * @param {number} offset
     * @param {number} value
     */
    checkBusWrite(base, offset, value)
    {
        if (this.cBreakIgnore) return;
        if (base == undefined) {
            this.stopCPU(this.sprintf("break on unknown write %#0x: %#0x", offset, value));
        } else {
            let addr = base + offset;
            if (this.aBreakAddrs[DbgIO.BREAKTYPE.WRITE].indexOf(addr) >= 0) {
                this.stopCPU(this.sprintf("break on write %#0x: %#0x", addr, value));
            }
        }
    }

    /**
     * stopCPU(message)
     *
     * @this {DbgIO}
     * @param {string} message
     */
    stopCPU(message)
    {
        if (this.time.isRunning() && this.fExceptionOnBreak) {
            /*
             * We don't print the message in this case, because the CPU's exception handler already
             * does that; it has to be prepared for any kind of exception, not just those that we throw.
             */
            throw new Error(message);
        }
        this.println(message);
        this.time.stop();
    }

    /**
     * dumpAddress(address, bus)
     *
     * All this function currently supports are physical (Bus) addresses, but that will change.
     *
     * @this {DbgIO}
     * @param {Address} address
     * @param {Bus} [bus] (default is busMemory)
     * @return {string}
     */
    dumpAddress(address, bus = this.busMemory)
    {
        return this.toBase(address.off, this.nDefaultBase, bus.addrWidth, "");
    }

    /**
     * dumpHistory(index)
     *
     * The index parameter is interpreted as the number of instructions to rewind; if you also
     * specify a length, then that limits the number of instructions to display from the index point.
     *
     * @this {DbgIO}
     * @param {number} index
     * @param {number} [length]
     * @return {string}
     */
    dumpHistory(index, length = 10)
    {
        let result = "";
        if (this.historyBuffer.length) {
            let address, opcodes = [];
            if (length > this.historyBuffer.length) {
                length = this.historyBuffer.length;
            }
            if (index < 0) index = length;
            let i = this.historyNext - index;
            if (i < 0) i += this.historyBuffer.length;
            while (i >= 0 && i < this.historyBuffer.length && length > 0) {
                let addr = this.historyBuffer[i++];
                if (addr == undefined) break;
                if (i == this.historyBuffer.length) i = 0;
                if (address) {
                    address.off = addr;
                } else {
                    address = this.newAddress(addr);
                }
                for (let j = 0; j < this.maxOpcodeLength; j++) {
                    opcodes[j] = this.readAddress(address, 1);
                }
                this.addAddress(address, -opcodes.length);
                result += this.unassemble(address, opcodes, this.sprintf("[%6d]", index--));
                length--;
            }
        }
        return result || "no history";
    }

    /**
     * dumpInstruction(address, length)
     *
     * @this {DbgIO}
     * @param {Address|number} address
     * @param {number} length
     * @return {string}
     */
    dumpInstruction(address, length)
    {
        let opcodes = [], result = "";
        address = this.makeAddress(address);
        while (length--) {
            this.addAddress(address, opcodes.length);
            while (opcodes.length < this.maxOpcodeLength) {
                opcodes.push(this.readAddress(address, 1));
            }
            this.addAddress(address, -opcodes.length);
            result += this.unassemble(address, opcodes);
        }
        return result;
    }

    /**
     * dumpMemory(address, bits, length, format, ioBus)
     *
     * @this {DbgIO}
     * @param {Address} [address] (default is addressData; advanced by the length of the dump)
     * @param {number} [bits] (default size is the memory bus data width; e.g., 8 bits)
     * @param {number} [length] (default length of dump is 128 values)
     * @param {string} [format] (formatting options; only 'y' for binary output is currently supported)
     * @param {boolean} [useIO] (true for busIO; default is busMemory)
     * @return {string}
     */
    dumpMemory(address, bits, length, format, useIO)
    {
        let result = "";
        let bus = useIO? this.busIO : this.busMemory;
        if (!bits) bits = bus.dataWidth;
        let size = bits >> 3;
        if (!length) length = 128;
        let fASCII = false, cchBinary = 0;
        let cLines = ((length + 15) >> 4) || 1;
        let cbLine = (size == 4? 16 : this.nDefaultBase);
        if (format == 'y') {
            cbLine = size;
            cLines = length;
            cchBinary = size * 8;
        }
        if (!address) address = this.addressData;
        while (cLines-- && length > 0) {
            let data = 0, iByte = 0, i;
            let sData = "", sChars = "";
            let sAddress = this.dumpAddress(address, bus);
            for (i = cbLine; i > 0 && length > 0; i--) {
                let b = this.readAddress(address, 1, bus);
                data |= (b << (iByte++ << 3));
                if (iByte == size) {
                    sData += this.toBase(data, 0, bits, "");
                    sData += (size == 1? (i == 9? '-' : ' ') : " ");
                    if (cchBinary) sChars += this.toBase(data, 2, bits, "");
                    data = iByte = 0;
                }
                if (!cchBinary) sChars += (b >= 32 && b < 127? String.fromCharCode(b) : (fASCII? '' : '.'));
                length--;
            }
            if (result) result += '\n';
            if (fASCII) {
                result += sChars;
            } else {
                result += sAddress + "  " + sData + " " + sChars;
            }
        }
        this.addressData = address;
        return result;
    }

    /**
     * dumpState()
     *
     * Simulate what the Machine class does to obtain the current state of the entire machine.
     *
     * @this {DbgIO}
     * @return {string}
     */
    dumpState()
    {
        let state = [];
        this.enumDevices(function enumDevice(device) {
            if (device.onSave) device.onSave(state);
            return true;
        });
        return JSON.stringify(state, null, 2);
    }

    /**
     * editMemory(address, values, useIO)
     *
     * @this {DbgIO}
     * @param {Address|undefined} address
     * @param {Array.<number>} values
     * @param {boolean} [useIO] (true for busIO; default is busMemory)
     * @return {string}
     */
    editMemory(address, values, useIO)
    {
        let count = 0, result = "";
        let bus = useIO? this.busIO : this.busMemory;
        for (let i = 0; address != undefined && i < values.length; i++) {
            let prev = this.readAddress(address, 0, bus);
            if (prev == undefined) break;
            this.writeAddress(address, values[i], bus);
            result += this.sprintf("%#06x: %#0x changed to %#0x\n", address.off, prev, values[i]);
            this.addAddress(address, 1, bus);
            count++;
        }
        if (!count) result += this.sprintf("%d locations updated\n", count);
        this.time.update();
        return result;
    }

    /**
     * enableHistory(enable)
     *
     * History refers to instruction execution history, which means we want to trap every read where
     * the requested address is the first byte of an instruction.  So if history is being enabled, we
     * preallocate an array to record every such physical address.
     *
     * The upside to this approach is that no special hooks are required inside the CPU, since we are
     * simply leveraging the Bus' ability to use different read handlers for all ROM and RAM blocks.
     *
     * @this {DbgIO}
     * @param {boolean} [enable] (if undefined, then we simply return the current history status)
     * @return {string}
     */
    enableHistory(enable)
    {
        let result = "";
        if (enable != undefined) {
            if (enable == !this.historyBuffer.length) {
                let dbg = this, cBlocks = 0;
                cBlocks += this.busMemory.enumBlocks(Memory.TYPE.READABLE, function(block) {
                    if (enable) {
                        dbg.busMemory.trapRead(block.addr, dbg.aBreakChecks[DbgIO.BREAKTYPE.READ]);
                    } else {
                        dbg.busMemory.untrapRead(block.addr, dbg.aBreakChecks[DbgIO.BREAKTYPE.READ]);
                    }
                });
                if (cBlocks) {
                    if (enable) {
                        this.historyNext = 0;
                        this.historyBuffer = new Array(DbgIO.HISTORY_LIMIT);
                    } else {
                        this.historyBuffer = [];
                    }
                }
            }
        }
        result += this.sprintf("instruction history %s\n", this.historyBuffer.length? "enabled" : "disabled");
        return result;
    }

    /**
     * loadState(state)
     *
     * @this {DbgIO}
     * @param {Array} state
     * @return {boolean}
     */
    loadState(state)
    {
        let idDevice = state.shift();
        if (this.idDevice == idDevice) {
            this.parseCommands(state.shift());
            this.machine.messages = state.shift();
            return true;
        }
        return false;
    }

    /**
     * notifyMessage(messages)
     *
     * Provides the Debugger with a notification whenever a message is being printed, along with the messages bits;
     * if any of those bits are set in messagesBreak, we break (ie, we stop the CPU).
     *
     * @this {DbgIO}
     * @param {number} messages
     */
    notifyMessage(messages)
    {
        if (this.testBits(this.messagesBreak, messages)) {
            this.stopCPU(this.sprintf("break on message"));
            return;
        }
        /*
         * This is an effort to help keep the browser responsive when lots of messages are being generated; however, it
         * might not be sufficient.  TODO: Investigate whether a special flag to yield() might be needed, perhaps to call
         * endBurst() if too many messages are arriving within a single burst.
         */
        this.time.yield();
    }

    /**
     * onCommand(aTokens)
     *
     * Processes basic debugger commands.
     *
     * @this {DbgIO}
     * @param {Array.<string>} aTokens ([0] contains the entire command line; [1] and up contain tokens from the command)
     * @return {string|undefined}
     */
    onCommand(aTokens)
    {
        let cmd = aTokens[1], option = aTokens[2], values = [], aUndefined = [];
        let expr, name, index, address, bits, length, enable, useIO = false, result = "";

        this.fStepQuietly = undefined;

        if (option == '*') {
            index = -2;
        } else {
            index = this.parseInt(option);
            if (index == undefined) index = -1;
            address = this.parseAddress(option, aUndefined);
            if (address === null) return undefined;
        }

        length = 0;
        if (aTokens[3]) {
            length = this.parseInt(aTokens[3].substr(aTokens[3][0] == 'l'? 1 : 0)) || 8;
        }
        for (let i = 3; i < aTokens.length; i++) values.push(this.parseInt(aTokens[i], 16));

        if (cmd == 'd') {
            let dump = this.checkDumper(option, values);
            if (dump != undefined) return dump;
            cmd = this.sDumpPrev || cmd;
        }

        /*
         * We refrain from reporting potentially undefined symbols until after we've checked for dump extensions.
         */
        if (cmd[0] != 's' && aUndefined.length) {
            return "unrecognized symbol(s): " + aUndefined;
        }

        switch(cmd[0]) {
        case 'b':
            if (cmd[1] == 'c') {
                result = this.clearBreak(index);
            } else if (cmd[1] == 'd') {
                result = this.enableBreak(index);
            } else if (cmd[1] == 'e') {
                result = this.enableBreak(index, true);
            } else if (cmd[1] == 'i') {
                result = this.setBreak(address, DbgIO.BREAKTYPE.INPUT);
            } else if (cmd[1] == 'l') {
                result = this.listBreak();
            } else if (cmd[1] == 'm') {
                result = this.setBreakMessage(option);
            } else if (cmd[1] == 'n') {
                result = this.setBreakCounter(index);
            } else if (cmd[1] == 'o') {
                result = this.setBreak(address, DbgIO.BREAKTYPE.OUTPUT);
            } else if (cmd[1] == 'r') {
                result = this.setBreak(address, DbgIO.BREAKTYPE.READ);
            } else if (cmd[1] == 'w') {
                result = this.setBreak(address, DbgIO.BREAKTYPE.WRITE);
            } else if (cmd[1] == '?') {
                result = "break commands:\n";
                DbgIO.BREAK_COMMANDS.forEach((cmd) => {result += cmd + '\n';});
                break;
            } else if (cmd[1]) {
                result = undefined;
            }
            break;

        case 'd':
            this.sDumpPrev = cmd;
            if (cmd[1] == 'b' || !cmd[1]) {
                bits = 8;
            } else if (cmd[1] == 'w') {
                bits = 16;
            } else if (cmd[1] == 'd') {
                bits = 32;
            } else if (cmd[1] == 'i') {
                if (!this.busIO) {
                    result = "invalid bus";
                    break;
                }
                bits = this.busIO.dataWidth;
                length = length || 1;
                useIO = true;
            } else if (cmd[1] == 'h') {
                this.sDumpPrev = "";
                result = this.dumpHistory(index, length);
                break;
            } else if (cmd[1] == '?') {
                this.sDumpPrev = "";
                result = "dump commands:\n";
                DbgIO.DUMP_COMMANDS.forEach((cmd) => {result += cmd + '\n';});
                if (this.aDumpers.length) {
                    result += "dump extensions:\n";
                    for (let i = 0; i < this.aDumpers.length; i++) {
                        let dumper = this.aDumpers[i];
                        result += this.sprintf("d   %-12s%s\n", dumper.name, dumper.desc);
                    }
                }
                break;
            } else {
                result = undefined;
                break;
            }
            result = this.dumpMemory(address, bits, length, cmd[2], useIO);
            break;

        case 'e':
            if (cmd[1] == 'o') {
                if (!this.busIO) {
                    result = "invalid bus";
                    break;
                }
                useIO = true;
            } else if (cmd[1]) {
                result = undefined;
                break;
            }
            result = this.editMemory(address, values, useIO);
            break;

        case 'g':
            if (this.time.start()) {
                if (address != undefined) {
                    this.clearTemp();
                    result = this.setBreak(address);
                    if (result.indexOf(':') != 2) break;
                    this.setTemp(address);
                    result = "";
                }
                break;
            }
            result = "already started\n";
            break;

        case 'h':
            if (!this.time.stop()) result = "already stopped\n";
            break;

        case 'p':
            aTokens.shift();
            aTokens.shift();
            expr = aTokens.join(' ');
            result += this.sprintf("%s = %s\n", expr, this.toBase(this.parseExpression(expr)));
            break;

        case 'r':
            name = cmd.substr(1).toUpperCase();
            if (name) {
                if (this.cpu.getRegister(name) == undefined) {
                    result += this.sprintf("unrecognized register: %s\n", name);
                    break;
                }
                if (address != undefined) this.cpu.setRegister(name, address.off);
            }
            this.setAddress(this.addressCode, this.cpu.regPC);
            result += this.cpu.toString();
            break;

        case 's':
            enable = this.parseBoolean(option);
            if (cmd[1] == 'h') {
                /*
                 * Don't let the user turn off history if any breaks (which may depend on history) are still set.
                 */
                if (this.cBreaks || this.counterBreak > 0) {
                    enable = undefined;     // this ensures enableHistory() will simply return the status, not change it.
                }
                result = this.enableHistory(enable);
                if (enable != undefined) this.historyForced = enable;
            } else if (cmd[1] == 's' && this.styles) {
                index = this.styles.indexOf(option);
                if (index >= 0) this.style = this.styles[index];
                result = "style: " + this.style;
            } else if (cmd[1] == '?') {
                result = "set commands:\n";
                DbgIO.SET_COMMANDS.forEach((cmd) => {result += cmd + '\n';});
                break;
            } else {
                result = undefined;
            }
            break;

        case 't':
            length = this.parseInt(option, 10) || 1;
            this.fStepQuietly = true;
            if (cmd[1]) {
                if (cmd[1] != 'r') {
                    result = undefined;
                    break;
                }
                this.fStepQuietly = false;
            }
            this.time.onStep(length);
            break;

        case 'u':
            if (cmd[1]) {
                result = undefined;
                break;
            }
            if (!length) length = 8;
            if (!address) address = this.addressCode;
            result += this.dumpInstruction(address, length);
            this.addressCode = address;
            break;

        case '?':
            result = "debugger commands:\n";
            DbgIO.COMMANDS.forEach((cmd) => {result += cmd + '\n';});
            break;

        default:
            result = undefined;
            break;
        }

        if (result == undefined && aTokens[0]) {
            result = "unrecognized command '" + aTokens[0] + "' (try '?')\n";
        }

        return result;
    }

    /**
     * onLoad(state)
     *
     * Automatically called by the Machine device if the machine's 'autoSave' property is true.
     *
     * @this {DbgIO}
     * @param {Array} state
     * @return {boolean}
     */
    onLoad(state)
    {
        if (state) {
            let stateDbg = state[0];
            if (this.loadState(stateDbg)) {
                state.shift();
                return true;
            }
        }
        return false;
    }

    /**
     * onSave(state)
     *
     * Automatically called by the Machine device before all other devices have been powered down (eg, during
     * a page unload event).
     *
     * @this {DbgIO}
     * @param {Array} state
     */
    onSave(state)
    {
        let stateDbg = [];
        this.saveState(stateDbg);
        state.push(stateDbg);
    }

    /**
     * onUpdate(fTransition)
     *
     * @this {DbgIO}
     * @param {boolean} [fTransition]
     */
    onUpdate(fTransition)
    {
        if (fTransition) {
            if (this.time.isRunning()) {
                this.restoreFocus();
            } else {
                if (this.fStepQuietly) {
                    this.print(this.dumpInstruction(this.cpu.regPC, 1));
                } else {
                    if (this.cInstructions) {
                        this.cpu.println(this.cInstructions + " instructions executed");
                        this.cInstructions = 0;
                    }
                    this.cpu.print(this.cpu.toString());
                    if (this.fStepQuietly == undefined) this.setFocus();
                }
            }
        }
    }

    /**
     * saveState(stateDbg)
     *
     * @this {DbgIO}
     * @param {Array} stateDbg
     */
    saveState(stateDbg)
    {
        stateDbg.push(this.idDevice);
        stateDbg.push(this.listBreak(true));
        stateDbg.push(this.machine.messages);
    }

    /**
     * restoreFocus()
     *
     * @this {DbgIO}
     */
    restoreFocus()
    {
        if (this.input) this.input.setFocus();
    }

    /**
     * setFocus()
     *
     * @this {DbgIO}
     */
    setFocus()
    {
        let element = this.findBinding(WebIO.BINDING.PRINT, true);
        if (element) element.focus();
    }

    /**
     * unassemble(address, opcodes, annotation)
     *
     * Returns a string representation of the selected instruction.  Since all processor-specific code
     * should be in the overriding function, all we can do here is display the address and an opcode.
     *
     * @this {DbgIO}
     * @param {Address} address (advanced by the number of processed opcodes)
     * @param {Array.<number>} opcodes (each processed opcode is shifted out, reducing the size of the array)
     * @param {string} [annotation] (optional string to append to the final result)
     * @return {string}
     */
    unassemble(address, opcodes, annotation)
    {
        let dbg = this;
        let getNextOp = function() {
            let op = opcodes.shift();
            dbg.addAddress(address, 1);
            return op;
        };
        let sAddress = this.dumpAddress(address);
        return this.sprintf("%s %02x       unsupported       ; %s\n", sAddress, getNextOp(), annotation || "");
    }
}

DbgIO.COMMANDS = [
    "b?\t\tbreak commands",
    "d?\t\tdump commands",
    "e[o] [addr] ...\tedit memory/ports",
    "g    [addr]\trun (to addr)",
    "h\t\thalt",
    "p    [expr]\tparse expression",
    "r?   [value]\tdisplay/set registers",
    "s?\t\tset commands",
    "t[r] [n]\tstep (n instructions)",
    "u    [addr] [n]\tunassemble (at addr)"
];

DbgIO.BREAK_COMMANDS = [
    "bc [n|*]\tclear break address",
    "bd [n|*]\tdisable break address",
    "be [n|*]\tenable break address",
    "bl [n]\t\tlist break addresses",
    "bi [addr]\tbreak on input",
    "bo [addr]\tbreak on output",
    "br [addr]\tbreak on read",
    "bw [addr]\tbreak on write",
    "bm [on|off]\tbreak on message",
    "bn [count]\tbreak on instruction count"
];

DbgIO.DUMP_COMMANDS = [
    "db  [addr]\tdump bytes (8 bits)",
    "dw  [addr]\tdump words (16 bits)",
    "dd  [addr]\tdump dwords (32 bits)",
    "di  [addr]\tdump input ports",
    "d*y [addr]\tdump values in binary",
    "dh  [n] [l]\tdump instruction history buffer",
    "ds\t\tdump machine state"
];

DbgIO.SET_COMMANDS = [
    "sh [on|off]\tset instruction history",
    "ss\t\tset debugger style"
];

DbgIO.ADDRESS = {
    LINEAR:     0x01,           // if seg is -1, this indicates if the address is physical (clear) or linear (set)
    PHYSICAL:   0x00,
    PROTECTED:  0x02,           // if seg is NOT -1, this indicates if the address is real (clear) or protected (set)
    REAL:       0x00
};

/*
 * The required characteristics of these assigned values are as follows: all even values must be read
 * operations and all odd values must be write operations; all busMemory operations must come before all
 * busIO operations; and INPUT must be the first busIO operation.
 */
DbgIO.BREAKTYPE = {
    READ:       0,
    WRITE:      1,
    INPUT:      2,
    OUTPUT:     3
};

DbgIO.BREAKCMD = {
    [DbgIO.BREAKTYPE.READ]:     "br",
    [DbgIO.BREAKTYPE.WRITE]:    "bw",
    [DbgIO.BREAKTYPE.INPUT]:    "bi",
    [DbgIO.BREAKTYPE.OUTPUT]:   "bo"
};

/*
 * Predefined "virtual registers" that we expect the CPU to support.
 */
DbgIO.REGISTER = {
    PC:         "PC"            // the CPU's program counter
};

DbgIO.SYMBOL = {
    BYTE:       1,
    PAIR:       2,
    QUAD:       4,
    LABEL:      5,
    COMMENT:    6,
    VALUE:      7
};

DbgIO.SYMBOL_TYPES = {
    "=":        DbgIO.SYMBOL.VALUE,
    "1":        DbgIO.SYMBOL.BYTE,
    "2":        DbgIO.SYMBOL.PAIR,
    "4":        DbgIO.SYMBOL.QUAD,
    "@":        DbgIO.SYMBOL.LABEL,
    ";":        DbgIO.SYMBOL.COMMENT
};

DbgIO.HISTORY_LIMIT = 100000;

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

Defs.CLASSES["DbgIO"] = DbgIO;

/**
 * @copyright https://www.pcjs.org/modules/devices/cpu/dbg8080.js (C) Jeff Parsons 2012-2019
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
        this.styles = [Debugger.STYLE_8080, Debugger.STYLE_8086];
        this.style = Debugger.STYLE_8086;
        this.maxOpcodeLength = 3;
    }

    /**
     * unassemble(address, opcodes, annotation)
     *
     * Overrides DbgIO's default unassemble() function with one that understands 8080 instructions.
     *
     * @this {Debugger}
     * @param {Address} address (advanced by the number of processed opcodes)
     * @param {Array.<number>} opcodes (each processed opcode is shifted out, reducing the size of the array)
     * @param {string} [annotation] (optional string to append to the final result)
     * @return {string}
     */
    unassemble(address, opcodes, annotation)
    {
        let dbg = this;
        let sAddr = this.dumpAddress(address), sBytes = "";
        let label = this.getSymbolName(address, DbgIO.SYMBOL.LABEL);
        let comment = this.getSymbolName(address, DbgIO.SYMBOL.COMMENT);

        let getNextByte = function() {
            let byte = opcodes.shift();
            sBytes += dbg.toBase(byte, 16, 8, "");
            dbg.addAddress(address, 1);
            return byte;
        };

        let getNextWord = function() {
            return getNextByte() | (getNextByte() << 8);
        };

        /**
         * getImmOperand(type)
         *
         * @param {number} type
         * @return {string} operand
         */
        let getImmOperand = function(type) {
            var sOperand = ' ';
            var typeSize = type & Debugger.TYPE_SIZE;
            switch (typeSize) {
            case Debugger.TYPE_BYTE:
                sOperand = dbg.toBase(getNextByte(), 16, 8, "");
                break;
            case Debugger.TYPE_SBYTE:
                sOperand = dbg.toBase((getNextWord() << 24) >> 24, 16, 16, "");
                break;
            case Debugger.TYPE_WORD:
                sOperand = dbg.toBase(getNextWord(), 16, 16, "");
                break;
            default:
                return "imm(" + dbg.toBase(type, 16, 16, "") + ')';
            }
            if (dbg.style == Debugger.STYLE_8086 && (type & Debugger.TYPE_MEM)) {
                sOperand = '[' + sOperand + ']';
            } else if (!(type & Debugger.TYPE_REG)) {
                sOperand = (dbg.style == Debugger.STYLE_8080? '$' : "0x") + sOperand;
            }
            return sOperand;
        };

        /**
         * getRegOperand(iReg, type)
         *
         * @param {number} iReg
         * @param {number} type
         * @return {string} operand
         */
        let getRegOperand = function(iReg, type)
        {
            /*
             * Although this breaks with 8080 assembler conventions, I'm going to experiment with some different
             * mnemonics; specifically, "[HL]" instead of "M".  This is also more in keeping with how getImmOperand()
             * displays memory references (ie, by enclosing them in brackets).
             */
            var sOperand = Debugger.REGS[iReg];
            if (dbg.style == Debugger.STYLE_8086 && (type & Debugger.TYPE_MEM)) {
                if (iReg == Debugger.REG_M) {
                    sOperand = "HL";
                }
                sOperand = '[' + sOperand + ']';
            }
            return sOperand;
        };

        let opcode = getNextByte();

        let asOpcodes = this.style != Debugger.STYLE_8086? Debugger.INS_NAMES : Debugger.INS_NAMES_8086;
        let aOpDesc = Debugger.aaOpDescs[opcode];
        let iOpcode = aOpDesc[0];

        let sOperands = "";
        let sOpcode = asOpcodes[iOpcode];
        let cOperands = aOpDesc.length - 1;
        let typeSizeDefault = Debugger.TYPE_NONE, type;

        for (let iOperand = 1; iOperand <= cOperands; iOperand++) {

            let sOperand = "";

            type = aOpDesc[iOperand];
            if (type === undefined) continue;
            if ((type & Debugger.TYPE_OPT) && this.style == Debugger.STYLE_8080) continue;

            let typeMode = type & Debugger.TYPE_MODE;
            if (!typeMode) continue;

            let typeSize = type & Debugger.TYPE_SIZE;
            if (!typeSize) {
                type |= typeSizeDefault;
            } else {
                typeSizeDefault = typeSize;
            }

            let typeOther = type & Debugger.TYPE_OTHER;
            if (!typeOther) {
                type |= (iOperand == 1? Debugger.TYPE_OUT : Debugger.TYPE_IN);
            }

            if (typeMode & Debugger.TYPE_IMM) {
                sOperand = getImmOperand(type);
            }
            else if (typeMode & Debugger.TYPE_REG) {
                sOperand = getRegOperand((type & Debugger.TYPE_IREG) >> 8, type);
            }
            else if (typeMode & Debugger.TYPE_INT) {
                sOperand = ((opcode >> 3) & 0x7).toString();
            }

            if (!sOperand || !sOperand.length) {
                sOperands = "INVALID";
                break;
            }
            if (sOperands.length > 0) sOperands += ',';
            sOperands += (sOperand || "???");
        }

        let result = this.sprintf("%s %-7s%s %-7s %s", sAddr, sBytes, (type & Debugger.TYPE_UNDOC)? '*' : ' ', sOpcode, sOperands);
        if (!annotation) {
            if (comment) annotation = comment;
        } else {
            if (comment) annotation += " " + comment;
        }
        if (annotation) result = this.sprintf("%-32s; %s", result, annotation);
        if (label) result = label + ":\n" + result;
        return result + "\n";
    }
}

Debugger.STYLE_8080 = "8080";
Debugger.STYLE_8086 = "8086";

/*
 * CPU instruction ordinals
 */
Debugger.INS = {
    NONE:   0,  ACI:    1,  ADC:    2,  ADD:    3,  ADI:    4,  ANA:    5,  ANI:    6,  CALL:   7,
    CC:     8,  CM:     9,  CNC:   10,  CNZ:   11,  CP:    12,  CPE:   13,  CPO:   14,  CZ:    15,
    CMA:   16,  CMC:   17,  CMP:   18,  CPI:   19,  DAA:   20,  DAD:   21,  DCR:   22,  DCX:   23,
    DI:    24,  EI:    25,  HLT:   26,  IN:    27,  INR:   28,  INX:   29,  JMP:   30,  JC:    31,
    JM:    32,  JNC:   33,  JNZ:   34,  JP:    35,  JPE:   36,  JPO:   37,  JZ:    38,  LDA:   39,
    LDAX:  40,  LHLD:  41,  LXI:   42,  MOV:   43,  MVI:   44,  NOP:   45,  ORA:   46,  ORI:   47,
    OUT:   48,  PCHL:  49,  POP:   50,  PUSH:  51,  RAL:   52,  RAR:   53,  RET:   54,  RC:    55,
    RM:    56,  RNC:   57,  RNZ:   58,  RP:    59,  RPE:   60,  RPO:   61,  RZ:    62,  RLC:   63,
    RRC:   64,  RST:   65,  SBB:   66,  SBI:   67,  SHLD:  68,  SPHL:  69,  STA:   70,  STAX:  71,
    STC:   72,  SUB:   73,  SUI:   74,  XCHG:  75,  XRA:   76,  XRI:   77,  XTHL:  78
};

/*
 * CPU instruction names (mnemonics), indexed by CPU instruction ordinal (above)
 *
 * If you change the default style, using the "s" command (eg, "s 8086"), then the 8086 table
 * will be used instead.  TODO: Add a "s z80" command for Z80-style mnemonics.
 */
Debugger.INS_NAMES = [
    "NONE",     "ACI",      "ADC",      "ADD",      "ADI",      "ANA",      "ANI",      "CALL",
    "CC",       "CM",       "CNC",      "CNZ",      "CP",       "CPE",      "CPO",      "CZ",
    "CMA",      "CMC",      "CMP",      "CPI",      "DAA",      "DAD",      "DCR",      "DCX",
    "DI",       "EI",       "HLT",      "IN",       "INR",      "INX",      "JMP",      "JC",
    "JM",       "JNC",      "JNZ",      "JP",       "JPE",      "JPO",      "JZ",       "LDA",
    "LDAX",     "LHLD",     "LXI",      "MOV",      "MVI",      "NOP",      "ORA",      "ORI",
    "OUT",      "PCHL",     "POP",      "PUSH",     "RAL",      "RAR",      "RET",      "RC",
    "RM",       "RNC",      "RNZ",      "RP",       "RPE",      "RPO",      "RZ",       "RLC",
    "RRC",      "RST",      "SBB",      "SBI",      "SHLD",     "SPHL",     "STA",      "STAX",
    "STC",      "SUB",      "SUI",      "XCHG",     "XRA",      "XRI",      "XTHL"
];

Debugger.INS_NAMES_8086 = [
    "NONE",     "ADC",      "ADC",      "ADD",      "ADD",      "AND",      "AND",      "CALL",
    "CALLC",    "CALLS",    "CALLNC",   "CALLNZ",   "CALLNS",   "CALLP",    "CALLNP",   "CALLZ",
    "NOT",      "CMC",      "CMP",      "CMP",      "DAA",      "ADD",      "DEC",      "DEC",
    "CLI",      "STI",      "HLT",      "IN",       "INC",      "INC",      "JMP",      "JC",
    "JS",       "JNC",      "JNZ",      "JNS",      "JP",       "JNP",      "JZ",       "MOV",
    "MOV",      "MOV",      "MOV",      "MOV",      "MOV",      "NOP",      "OR",       "OR",
    "OUT",      "JMP",      "POP",      "PUSH",     "RCL",      "RCR",      "RET",      "RETC",
    "RETS",     "RETNC",    "RETNZ",    "RETNS",    "RETP",     "RETNP",    "RETZ",     "ROL",
    "ROR",      "RST",      "SBB",      "SBB",      "MOV",      "MOV",      "MOV",      "MOV",
    "STC",      "SUB",      "SUB",      "XCHG",     "XOR",      "XOR",      "XCHG"
];

Debugger.REG_B      = 0x00;
Debugger.REG_C      = 0x01;
Debugger.REG_D      = 0x02;
Debugger.REG_E      = 0x03;
Debugger.REG_H      = 0x04;
Debugger.REG_L      = 0x05;
Debugger.REG_M      = 0x06;
Debugger.REG_A      = 0x07;
Debugger.REG_BC     = 0x08;
Debugger.REG_DE     = 0x09;
Debugger.REG_HL     = 0x0A;
Debugger.REG_SP     = 0x0B;
Debugger.REG_PC     = 0x0C;
Debugger.REG_PS     = 0x0D;
Debugger.REG_PSW    = 0x0E;         // aka AF if Z80-style mnemonics

/*
 * NOTE: "PS" is the complete processor status, which includes bits like the Interrupt flag (IF),
 * which is NOT the same as "PSW", which is the low 8 bits of "PS" combined with "A" in the high byte.
 */
Debugger.REGS = [
    "B", "C", "D", "E", "H", "L", "M", "A", "BC", "DE", "HL", "SP", "PC", "PS", "PSW"
];

/*
 * Operand type descriptor masks and definitions
 */
Debugger.TYPE_SIZE  = 0x000F;       // size field
Debugger.TYPE_MODE  = 0x00F0;       // mode field
Debugger.TYPE_IREG  = 0x0F00;       // implied register field
Debugger.TYPE_OTHER = 0xF000;       // "other" field

/*
 * TYPE_SIZE values
 */
Debugger.TYPE_NONE  = 0x0000;       // (all other TYPE fields ignored)
Debugger.TYPE_BYTE  = 0x0001;       // byte, regardless of operand size
Debugger.TYPE_SBYTE = 0x0002;       // byte sign-extended to word
Debugger.TYPE_WORD  = 0x0003;       // word (16-bit value)

/*
 * TYPE_MODE values
 */
Debugger.TYPE_REG   = 0x0010;       // register
Debugger.TYPE_IMM   = 0x0020;       // immediate data
Debugger.TYPE_ADDR  = 0x0033;       // immediate (word) address
Debugger.TYPE_MEM   = 0x0040;       // memory reference
Debugger.TYPE_INT   = 0x0080;       // interrupt level encoded in instruction (bits 3-5)

/*
 * TYPE_IREG values, based on the REG_* constants.
 *
 * Note that TYPE_M isn't really a register, just an alternative form of TYPE_HL | TYPE_MEM.
 */
Debugger.TYPE_A     = (Debugger.REG_A  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_B     = (Debugger.REG_B  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_C     = (Debugger.REG_C  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_D     = (Debugger.REG_D  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_E     = (Debugger.REG_E  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_H     = (Debugger.REG_H  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_L     = (Debugger.REG_L  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE);
Debugger.TYPE_M     = (Debugger.REG_M  << 8 | Debugger.TYPE_REG | Debugger.TYPE_BYTE | Debugger.TYPE_MEM);
Debugger.TYPE_BC    = (Debugger.REG_BC << 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);
Debugger.TYPE_DE    = (Debugger.REG_DE << 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);
Debugger.TYPE_HL    = (Debugger.REG_HL << 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);
Debugger.TYPE_SP    = (Debugger.REG_SP << 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);
Debugger.TYPE_PC    = (Debugger.REG_PC << 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);
Debugger.TYPE_PSW   = (Debugger.REG_PSW<< 8 | Debugger.TYPE_REG | Debugger.TYPE_WORD);

/*
 * TYPE_OTHER bit definitions
 */
Debugger.TYPE_IN    = 0x1000;       // operand is input
Debugger.TYPE_OUT   = 0x2000;       // operand is output
Debugger.TYPE_BOTH  = (Debugger.TYPE_IN | Debugger.TYPE_OUT);
Debugger.TYPE_OPT   = 0x4000;       // optional operand (ie, normally omitted in 8080 assembly language)
Debugger.TYPE_UNDOC = 0x8000;       // opcode is an undocumented alternative encoding

/*
 * The aaOpDescs array is indexed by opcode, and each element is a sub-array (aOpDesc) that describes
 * the corresponding opcode. The sub-elements are as follows:
 *
 *      [0]: {number} of the opcode name (see INS.*)
 *      [1]: {number} containing the destination operand descriptor bit(s), if any
 *      [2]: {number} containing the source operand descriptor bit(s), if any
 *      [3]: {number} containing the occasional third operand descriptor bit(s), if any
 *
 * These sub-elements are all optional. If [0] is not present, the opcode is undefined; if [1] is not
 * present (or contains zero), the opcode has no (or only implied) operands; if [2] is not present, the
 * opcode has only a single operand.  And so on.
 *
 * Additional default rules:
 *
 *      1) If no TYPE_OTHER bits are specified for the first (destination) operand, TYPE_OUT is assumed;
 *      2) If no TYPE_OTHER bits are specified for the second (source) operand, TYPE_IN is assumed;
 *      3) If no size is specified for the second operand, the size is assumed to match the first operand.
 */
Debugger.aaOpDescs = [
/* 0x00 */  [Debugger.INS.NOP],
/* 0x01 */  [Debugger.INS.LXI,   Debugger.TYPE_BC,    Debugger.TYPE_IMM],
/* 0x02 */  [Debugger.INS.STAX,  Debugger.TYPE_BC   | Debugger.TYPE_MEM, Debugger.TYPE_A    | Debugger.TYPE_OPT],
/* 0x03 */  [Debugger.INS.INX,   Debugger.TYPE_BC],
/* 0x04 */  [Debugger.INS.INR,   Debugger.TYPE_B],
/* 0x05 */  [Debugger.INS.DCR,   Debugger.TYPE_B],
/* 0x06 */  [Debugger.INS.MVI,   Debugger.TYPE_B,     Debugger.TYPE_IMM],
/* 0x07 */  [Debugger.INS.RLC],
/* 0x08 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x09 */  [Debugger.INS.DAD,   Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_BC],
/* 0x0A */  [Debugger.INS.LDAX,  Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_BC   | Debugger.TYPE_MEM],
/* 0x0B */  [Debugger.INS.DCX,   Debugger.TYPE_BC],
/* 0x0C */  [Debugger.INS.INR,   Debugger.TYPE_C],
/* 0x0D */  [Debugger.INS.DCR,   Debugger.TYPE_C],
/* 0x0E */  [Debugger.INS.MVI,   Debugger.TYPE_C,     Debugger.TYPE_IMM],
/* 0x0F */  [Debugger.INS.RRC],
/* 0x10 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x11 */  [Debugger.INS.LXI,   Debugger.TYPE_DE,    Debugger.TYPE_IMM],
/* 0x12 */  [Debugger.INS.STAX,  Debugger.TYPE_DE   | Debugger.TYPE_MEM, Debugger.TYPE_A    | Debugger.TYPE_OPT],
/* 0x13 */  [Debugger.INS.INX,   Debugger.TYPE_DE],
/* 0x14 */  [Debugger.INS.INR,   Debugger.TYPE_D],
/* 0x15 */  [Debugger.INS.DCR,   Debugger.TYPE_D],
/* 0x16 */  [Debugger.INS.MVI,   Debugger.TYPE_D,     Debugger.TYPE_IMM],
/* 0x17 */  [Debugger.INS.RAL],
/* 0x18 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x19 */  [Debugger.INS.DAD,   Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_DE],
/* 0x1A */  [Debugger.INS.LDAX,  Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_DE   | Debugger.TYPE_MEM],
/* 0x1B */  [Debugger.INS.DCX,   Debugger.TYPE_DE],
/* 0x1C */  [Debugger.INS.INR,   Debugger.TYPE_E],
/* 0x1D */  [Debugger.INS.DCR,   Debugger.TYPE_E],
/* 0x1E */  [Debugger.INS.MVI,   Debugger.TYPE_E,     Debugger.TYPE_IMM],
/* 0x1F */  [Debugger.INS.RAR],
/* 0x20 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x21 */  [Debugger.INS.LXI,   Debugger.TYPE_HL,    Debugger.TYPE_IMM],
/* 0x22 */  [Debugger.INS.SHLD,  Debugger.TYPE_ADDR | Debugger.TYPE_MEM, Debugger.TYPE_HL   | Debugger.TYPE_OPT],
/* 0x23 */  [Debugger.INS.INX,   Debugger.TYPE_HL],
/* 0x24 */  [Debugger.INS.INR,   Debugger.TYPE_H],
/* 0x25 */  [Debugger.INS.DCR,   Debugger.TYPE_H],
/* 0x26 */  [Debugger.INS.MVI,   Debugger.TYPE_H,     Debugger.TYPE_IMM],
/* 0x27 */  [Debugger.INS.DAA],
/* 0x28 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x29 */  [Debugger.INS.DAD,   Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_HL],
/* 0x2A */  [Debugger.INS.LHLD,  Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_ADDR | Debugger.TYPE_MEM],
/* 0x2B */  [Debugger.INS.DCX,   Debugger.TYPE_HL],
/* 0x2C */  [Debugger.INS.INR,   Debugger.TYPE_L],
/* 0x2D */  [Debugger.INS.DCR,   Debugger.TYPE_L],
/* 0x2E */  [Debugger.INS.MVI,   Debugger.TYPE_L,     Debugger.TYPE_IMM],
/* 0x2F */  [Debugger.INS.CMA,   Debugger.TYPE_A    | Debugger.TYPE_OPT],
/* 0x30 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x31 */  [Debugger.INS.LXI,   Debugger.TYPE_SP,    Debugger.TYPE_IMM],
/* 0x32 */  [Debugger.INS.STA,   Debugger.TYPE_ADDR | Debugger.TYPE_MEM, Debugger.TYPE_A    | Debugger.TYPE_OPT],
/* 0x33 */  [Debugger.INS.INX,   Debugger.TYPE_SP],
/* 0x34 */  [Debugger.INS.INR,   Debugger.TYPE_M],
/* 0x35 */  [Debugger.INS.DCR,   Debugger.TYPE_M],
/* 0x36 */  [Debugger.INS.MVI,   Debugger.TYPE_M,     Debugger.TYPE_IMM],
/* 0x37 */  [Debugger.INS.STC],
/* 0x38 */  [Debugger.INS.NOP,   Debugger.TYPE_UNDOC],
/* 0x39 */  [Debugger.INS.DAD,   Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_SP],
/* 0x3A */  [Debugger.INS.LDA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_ADDR | Debugger.TYPE_MEM],
/* 0x3B */  [Debugger.INS.DCX,   Debugger.TYPE_SP],
/* 0x3C */  [Debugger.INS.INR,   Debugger.TYPE_A],
/* 0x3D */  [Debugger.INS.DCR,   Debugger.TYPE_A],
/* 0x3E */  [Debugger.INS.MVI,   Debugger.TYPE_A,     Debugger.TYPE_IMM],
/* 0x3F */  [Debugger.INS.CMC],
/* 0x40 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_B],
/* 0x41 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_C],
/* 0x42 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_D],
/* 0x43 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_E],
/* 0x44 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_H],
/* 0x45 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_L],
/* 0x46 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_M],
/* 0x47 */  [Debugger.INS.MOV,   Debugger.TYPE_B,     Debugger.TYPE_A],
/* 0x48 */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_B],
/* 0x49 */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_C],
/* 0x4A */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_D],
/* 0x4B */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_E],
/* 0x4C */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_H],
/* 0x4D */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_L],
/* 0x4E */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_M],
/* 0x4F */  [Debugger.INS.MOV,   Debugger.TYPE_C,     Debugger.TYPE_A],
/* 0x50 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_B],
/* 0x51 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_C],
/* 0x52 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_D],
/* 0x53 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_E],
/* 0x54 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_H],
/* 0x55 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_L],
/* 0x56 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_M],
/* 0x57 */  [Debugger.INS.MOV,   Debugger.TYPE_D,     Debugger.TYPE_A],
/* 0x58 */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_B],
/* 0x59 */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_C],
/* 0x5A */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_D],
/* 0x5B */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_E],
/* 0x5C */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_H],
/* 0x5D */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_L],
/* 0x5E */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_M],
/* 0x5F */  [Debugger.INS.MOV,   Debugger.TYPE_E,     Debugger.TYPE_A],
/* 0x60 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_B],
/* 0x61 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_C],
/* 0x62 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_D],
/* 0x63 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_E],
/* 0x64 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_H],
/* 0x65 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_L],
/* 0x66 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_M],
/* 0x67 */  [Debugger.INS.MOV,   Debugger.TYPE_H,     Debugger.TYPE_A],
/* 0x68 */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_B],
/* 0x69 */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_C],
/* 0x6A */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_D],
/* 0x6B */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_E],
/* 0x6C */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_H],
/* 0x6D */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_L],
/* 0x6E */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_M],
/* 0x6F */  [Debugger.INS.MOV,   Debugger.TYPE_L,     Debugger.TYPE_A],
/* 0x70 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_B],
/* 0x71 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_C],
/* 0x72 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_D],
/* 0x73 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_E],
/* 0x74 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_H],
/* 0x75 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_L],
/* 0x76 */  [Debugger.INS.HLT],
/* 0x77 */  [Debugger.INS.MOV,   Debugger.TYPE_M,     Debugger.TYPE_A],
/* 0x78 */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_B],
/* 0x79 */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_C],
/* 0x7A */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_D],
/* 0x7B */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_E],
/* 0x7C */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_H],
/* 0x7D */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_L],
/* 0x7E */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_M],
/* 0x7F */  [Debugger.INS.MOV,   Debugger.TYPE_A,     Debugger.TYPE_A],
/* 0x80 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0x81 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0x82 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0x83 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0x84 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0x85 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0x86 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0x87 */  [Debugger.INS.ADD,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0x88 */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0x89 */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0x8A */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0x8B */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0x8C */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0x8D */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0x8E */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0x8F */  [Debugger.INS.ADC,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0x90 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0x91 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0x92 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0x93 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0x94 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0x95 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0x96 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0x97 */  [Debugger.INS.SUB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0x98 */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0x99 */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0x9A */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0x9B */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0x9C */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0x9D */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0x9E */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0x9F */  [Debugger.INS.SBB,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0xA0 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0xA1 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0xA2 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0xA3 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0xA4 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0xA5 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0xA6 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0xA7 */  [Debugger.INS.ANA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0xA8 */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0xA9 */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0xAA */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0xAB */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0xAC */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0xAD */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0xAE */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0xAF */  [Debugger.INS.XRA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0xB0 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0xB1 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0xB2 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0xB3 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0xB4 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0xB5 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0xB6 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0xB7 */  [Debugger.INS.ORA,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0xB8 */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_B],
/* 0xB9 */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_C],
/* 0xBA */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_D],
/* 0xBB */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_E],
/* 0xBC */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_H],
/* 0xBD */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_L],
/* 0xBE */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_M],
/* 0xBF */  [Debugger.INS.CMP,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_A],
/* 0xC0 */  [Debugger.INS.RNZ],
/* 0xC1 */  [Debugger.INS.POP,   Debugger.TYPE_BC],
/* 0xC2 */  [Debugger.INS.JNZ,   Debugger.TYPE_ADDR],
/* 0xC3 */  [Debugger.INS.JMP,   Debugger.TYPE_ADDR],
/* 0xC4 */  [Debugger.INS.CNZ,   Debugger.TYPE_ADDR],
/* 0xC5 */  [Debugger.INS.PUSH,  Debugger.TYPE_BC],
/* 0xC6 */  [Debugger.INS.ADI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xC7 */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xC8 */  [Debugger.INS.RZ],
/* 0xC9 */  [Debugger.INS.RET],
/* 0xCA */  [Debugger.INS.JZ,    Debugger.TYPE_ADDR],
/* 0xCB */  [Debugger.INS.JMP,   Debugger.TYPE_ADDR | Debugger.TYPE_UNDOC],
/* 0xCC */  [Debugger.INS.CZ,    Debugger.TYPE_ADDR],
/* 0xCD */  [Debugger.INS.CALL,  Debugger.TYPE_ADDR],
/* 0xCE */  [Debugger.INS.ACI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xCF */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xD0 */  [Debugger.INS.RNC],
/* 0xD1 */  [Debugger.INS.POP,   Debugger.TYPE_DE],
/* 0xD2 */  [Debugger.INS.JNC,   Debugger.TYPE_ADDR],
/* 0xD3 */  [Debugger.INS.OUT,   Debugger.TYPE_IMM  | Debugger.TYPE_BYTE,Debugger.TYPE_A   | Debugger.TYPE_OPT],
/* 0xD4 */  [Debugger.INS.CNC,   Debugger.TYPE_ADDR],
/* 0xD5 */  [Debugger.INS.PUSH,  Debugger.TYPE_DE],
/* 0xD6 */  [Debugger.INS.SUI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xD7 */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xD8 */  [Debugger.INS.RC],
/* 0xD9 */  [Debugger.INS.RET,   Debugger.TYPE_UNDOC],
/* 0xDA */  [Debugger.INS.JC,    Debugger.TYPE_ADDR],
/* 0xDB */  [Debugger.INS.IN,    Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xDC */  [Debugger.INS.CC,    Debugger.TYPE_ADDR],
/* 0xDD */  [Debugger.INS.CALL,  Debugger.TYPE_ADDR | Debugger.TYPE_UNDOC],
/* 0xDE */  [Debugger.INS.SBI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xDF */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xE0 */  [Debugger.INS.RPO],
/* 0xE1 */  [Debugger.INS.POP,   Debugger.TYPE_HL],
/* 0xE2 */  [Debugger.INS.JPO,   Debugger.TYPE_ADDR],
/* 0xE3 */  [Debugger.INS.XTHL,  Debugger.TYPE_SP   | Debugger.TYPE_MEM| Debugger.TYPE_OPT,  Debugger.TYPE_HL | Debugger.TYPE_OPT],
/* 0xE4 */  [Debugger.INS.CPO,   Debugger.TYPE_ADDR],
/* 0xE5 */  [Debugger.INS.PUSH,  Debugger.TYPE_HL],
/* 0xE6 */  [Debugger.INS.ANI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xE7 */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xE8 */  [Debugger.INS.RPE],
/* 0xE9 */  [Debugger.INS.PCHL,  Debugger.TYPE_HL],
/* 0xEA */  [Debugger.INS.JPE,   Debugger.TYPE_ADDR],
/* 0xEB */  [Debugger.INS.XCHG,  Debugger.TYPE_HL   | Debugger.TYPE_OPT, Debugger.TYPE_DE  | Debugger.TYPE_OPT],
/* 0xEC */  [Debugger.INS.CPE,   Debugger.TYPE_ADDR],
/* 0xED */  [Debugger.INS.CALL,  Debugger.TYPE_ADDR | Debugger.TYPE_UNDOC],
/* 0xEE */  [Debugger.INS.XRI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xEF */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xF0 */  [Debugger.INS.RP],
/* 0xF1 */  [Debugger.INS.POP,   Debugger.TYPE_PSW],
/* 0xF2 */  [Debugger.INS.JP,    Debugger.TYPE_ADDR],
/* 0xF3 */  [Debugger.INS.DI],
/* 0xF4 */  [Debugger.INS.CP,    Debugger.TYPE_ADDR],
/* 0xF5 */  [Debugger.INS.PUSH,  Debugger.TYPE_PSW],
/* 0xF6 */  [Debugger.INS.ORI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xF7 */  [Debugger.INS.RST,   Debugger.TYPE_INT],
/* 0xF8 */  [Debugger.INS.RM],
/* 0xF9 */  [Debugger.INS.SPHL,  Debugger.TYPE_SP   | Debugger.TYPE_OPT, Debugger.TYPE_HL  | Debugger.TYPE_OPT],
/* 0xFA */  [Debugger.INS.JM,    Debugger.TYPE_ADDR],
/* 0xFB */  [Debugger.INS.EI],
/* 0xFC */  [Debugger.INS.CM,    Debugger.TYPE_ADDR],
/* 0xFD */  [Debugger.INS.CALL,  Debugger.TYPE_ADDR | Debugger.TYPE_UNDOC],
/* 0xFE */  [Debugger.INS.CPI,   Debugger.TYPE_A    | Debugger.TYPE_OPT, Debugger.TYPE_IMM | Debugger.TYPE_BYTE],
/* 0xFF */  [Debugger.INS.RST,   Debugger.TYPE_INT]
];

Defs.CLASSES["Debugger"] = Debugger;

/**
 * @copyright https://www.pcjs.org/modules/devices/main/machine.js (C) Jeff Parsons 2012-2019
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
     * Machine(idMachine, sConfig, sParms)
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
     *        "version": 2.00,
     *        "autoSave": true,
     *        "autoStart": true,
     *        "bindings": {
     *          "power": "powerTI57",
     *          "reset": "resetTI57",
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
     *          "surface": "imageTI57"
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
     * @param {string} [sParms] (optional JSON parameters that can supplement or override the configuration)
     */
    constructor(idMachine, sConfig, sParms)
    {
        super(idMachine, idMachine);

        let machine = this;
        this.ready = false;
        this.powered = false;
        this.sParms = sParms;
        this.sConfigFile = "";
        this.fConfigLoaded = false;
        this.fPageLoaded = false;

        /*
         * You can pass "m" commands to the machine via the "commands" parameter to turn on any desired
         * message groups, but since the Debugger is responsible for parsing those commands, and since the
         * Debugger is usually not initialized until last, one alternative is to hard-code any MESSAGE groups
         * here, to ensure that all relevant messages from all the device constructors get displayed.
         */
        this.messages = MESSAGE.WARN;

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
                        machine.printf("error (%d) loading configuration: %s\n", nErrorCode, sURL);
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
     * addBinding(binding, element)
     *
     * @this {Machine}
     * @param {string} binding
     * @param {Element} element
     */
    addBinding(binding, element)
    {
        let machine = this;

        switch(binding) {

        case Machine.BINDING.POWER:
            element.onclick = function onClickPower() {
                if (machine.ready) {
                    machine.onPower();
                }
            };
            break;

        case Machine.BINDING.RESET:
            element.onclick = function onClickReset() {
                if (machine.ready) {
                    machine.onReset();
                }
            };
            break;
        }
        super.addBinding(binding, element);
    }

    /**
     * initDevices()
     *
     * Initializes devices in the proper order.  For example, any Time devices should be initialized first,
     * to ensure that their timer services are available to other devices within their constructor.
     *
     * However, we should avoid device order dependencies whenever possible, so if a Device can defer a call
     * to another Device until its onLoad() or onPower() handler can be called, even better.
     *
     * @this {Machine}
     */
    initDevices()
    {
        let power = true;
        if (this.fConfigLoaded && this.fPageLoaded) {
            for (let idDevice in this.deviceConfigs) {
                let sClass;
                try {
                    let config = this.deviceConfigs[idDevice];
                    sClass = config['class'];
                    if (!Defs.CLASSES[sClass]) {
                        this.printf("unrecognized %s device class: %s\n", idDevice, sClass);
                    }
                    else if (sClass == "Machine") {
                        this.printf("PCjs %s v%3.2f\n%s\n%s\n", config['name'], +VERSION, Machine.COPYRIGHT, Machine.LICENSE);
                        if (this.sConfigFile) this.printf("Configuration: %s\n", this.sConfigFile);
                    } else {
                        let device = new Defs.CLASSES[sClass](this.idMachine, idDevice, config);
                        if (MAXDEBUG) this.printf("%s device: %s\n", sClass, idDevice);
                    }
                }
                catch (err) {
                    this.printf("error initializing %s device '%s': %s\n", sClass, idDevice, err.message);
                    this.removeDevice(idDevice);
                    power = false;
                }
            }
            if (this.fAutoSave) {
                let state = this.loadLocalStorage();
                this.enumDevices(function onDeviceLoad(device) {
                    if (device.onLoad) {
                        if (!device.onLoad(state)) {
                            device.printf("unable to restore state for device: %s\n", device.idDevice);
                            return false;
                        }
                    }
                    return true;
                });
            }
            this.onPower(power);
        }
    }

    /**
     * killDevices()
     *
     * @this {Machine}
     */
    killDevices()
    {
        if (this.fAutoSave) {
            let state = [];
            this.enumDevices(function onDeviceSave(device) {
                if (device.onSave) {
                    device.onSave(state);
                }
                return true;
            });
            this.saveLocalStorage(state);
        }
        this.onPower(false);
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
            this.deviceConfigs = JSON.parse(sConfig);
            this.checkConfig(this.deviceConfigs[this.idMachine], ['autoSave', 'autoStart']);
            this.fAutoSave = (this.config['autoSave'] !== false);
            this.fAutoStart = (this.config['autoStart'] !== false);
            if (this.sParms) {
                /*
                 * Historically, my web servers have not been consistent about quoting property names inside
                 * the optional parameters object, so we must use eval() instead of JSON.parse() to parse them.
                 * Of couse, the REAL problem is that JSON.parse() is being a dick about otherwise perfectly
                 * legitimate Object syntax, but I shall not repeat my long list of gripes about JSON here.
                 */
                let parms = /** @type {Object} */ (eval("(" + this.sParms + ")"));
                /*
                 * Slam all these parameters into the machine's config, overriding any matching machine configuration
                 * properties.  Any other devices that need access to these properties should use getMachineConfig().
                 */
                for (let prop in parms) {
                    this.config[prop] = parms[prop];
                }
            }
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

    /**
     * onPower(on)
     *
     * @this {Machine}
     * @param {boolean} [on]
     */
    onPower(on = !this.powered)
    {
        let machine = this;
        if (on) this.println("power on");
        this.enumDevices(function onDevicePower(device) {
            if (device.onPower && device != machine) {
                if (device.config['class'] != "CPU" || machine.fAutoStart || machine.ready) {
                    device.onPower(on);
                } else {
                    /*
                     * If we're not going to start the CPU on the first power notification, then we should
                     * we fake a transition to the "stopped" state, so that the Debugger will display the current
                     * machine state.
                     */
                    device.time.update(true);
                }
            }
            return true;
        });
        this.ready = true;
        this.powered = on;
        if (!on) this.println("power off");
    }

    /**
     * onReset()
     *
     * @this {Machine}
     */
    onReset()
    {
        let machine = this;
        this.enumDevices(function onDeviceReset(device) {
            if (device.onReset && device != machine) {
                device.onReset();
            }
            return true;
        });
    }
}

Machine.BINDING = {
    POWER:      "power",
    RESET:      "reset",
};

Machine.COPYRIGHT = "Copyright © 2012-2019 Jeff Parsons <Jeff@pcjs.org>";
Machine.LICENSE = "License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>";

/*
 * Create the designated machine FACTORY function (this should suffice for all compiled versions).
 *
 * In addition, expose the machine's COMMAND handler interface, so that it's easy to access any of the
 * machine's built-in commands from a browser or IDE debug console:
 *
 *      window.command("?")
 *
 * Normally, access to the COMMAND handlers will be through the machine's WebIO.BINDING.PRINT textarea,
 * but not all machines will have such a control, and sometimes that control will be inaccessible (eg, if
 * the browser is currently debugging the machine).
 */
window[FACTORY] = function createMachine(idMachine, sConfig, sParms) {
    let machine = new Machine(idMachine, sConfig, sParms);
    window[COMMAND] = function(commands) {
        return machine.parseCommands(commands);
    };
    return machine;
};

/*
 * If we're NOT running a compiled release (ie, FACTORY wasn't overriden from "Machine" to something else),
 * then create hard-coded aliases for all known factories; only DEBUG servers should be running uncompiled code.
 */
if (FACTORY == "Machine") {
    window['Invaders'] = window[FACTORY];
    window['LEDs'] = window[FACTORY];
    window['TMS1500'] = window[FACTORY];
    window['VT100'] = window[FACTORY];
}

Defs.CLASSES["Machine"] = Machine;
