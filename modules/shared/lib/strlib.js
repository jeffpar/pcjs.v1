/**
 * @fileoverview String-related helper functions
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
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
 */

"use strict";

class Str {
    /**
     * isValidInt(s, base)
     *
     * The built-in parseInt() function has the annoying feature of returning a partial value (ie,
     * up to the point where it encounters an invalid character); eg, parseInt("foo", 16) returns 0xf.
     *
     * So it's best to use our own Str.parseInt() function, which will in turn use this function to
     * validate the entire string.
     *
     * @param {string} s is the string representation of some number
     * @param {number} [base] is the radix to use (default is 10); only 2, 8, 10 and 16 are supported
     * @return {boolean} true if valid, false if invalid (or the specified base isn't supported)
     */
    static isValidInt(s, base)
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
     * binary), and then calls isValidInt() to ensure we don't convert strings that contain partial values;
     * see isValidInt() for details.
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
     * @param {string} s is the string representation of some number
     * @param {number} [base] is the radix to use (default is 10); can be overridden by prefixes/suffixes
     * @return {number|undefined} corresponding value, or undefined if invalid
     */
    static parseInt(s, base)
    {
        var value;

        if (s) {
            if (!base) base = 10;

            var ch, chPrefix, chSuffix;
            var fCommas = (s.indexOf(',') > 0);
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
            var v, shift = 0;
            if (base <= 10) {
                var match = s.match(/(-?[0-9]+)B([0-9]*)/);
                if (match) {
                    s = match[1];
                    shift = 35 - ((match[2] || 35) & 0xff);
                }
            }
            if (Str.isValidInt(s, base) && !isNaN(v = parseInt(s, base))) {
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
     * toBase(n, radix, cch, sPrefix, nGrouping)
     *
     * Displays the given number as an unsigned integer using the specified radix and number of digits.
     *
     * @param {number|null|undefined} n
     * @param {number} radix (ie, the base)
     * @param {number} cch (the desired number of digits)
     * @param {string} [sPrefix] (default is none)
     * @param {number} [nGrouping]
     * @return {string}
     */
    static toBase(n, radix, cch, sPrefix = "", nGrouping = 0)
    {
        /*
         * An initial "falsey" check for null takes care of both null and undefined;
         * we can't rely entirely on isNaN(), because isNaN(null) returns false, oddly enough.
         *
         * Alternatively, we could mask and shift n regardless of whether it's null/undefined/NaN,
         * since JavaScript coerces such operands to zero, but I think there's "value" in seeing those
         * values displayed differently.
         */
        var s = "";
        if (isNaN(n)) {
            n = null;
        } else if (n != null) {
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
                n += Math.pow(radix, cch);
            }
            if (n >= Math.pow(radix, cch)) {
                cch = Math.ceil(Math.log(n) / Math.log(radix));
            }
        }
        var g = nGrouping || -1;
        while (cch-- > 0) {
            if (!g) {
                s = ',' + s;
                g = nGrouping;
            }
            if (n == null) {
                s = '?' + s;
            } else {
                var d = n % radix;
                d += (d >= 0 && d <= 9? 0x30 : 0x41 - 10);
                s = String.fromCharCode(d) + s;
                n = Math.trunc(n / radix);
            }
            g--;
        }
        return sPrefix + s;
    }

    /**
     * toBin(n, cch, nGrouping)
     *
     * Converts an integer to binary, with the specified number of digits (up to a maximum of 36).
     *
     * @param {number|null|undefined} n (supports integers up to 36 bits now)
     * @param {number} [cch] is the desired number of binary digits (0 or undefined for default of either 8, 18, or 36)
     * @param {number} [nGrouping]
     * @return {string} the binary representation of n
     */
    static toBin(n, cch, nGrouping)
    {
        if (!cch) {
            // cch = Math.ceil(Math.log(Math.abs(n) + 1) / Math.LN2) || 1;
            var v = Math.abs(n);
            if (v <= 0b11111111) {
                cch = 8;
            } else if (v <= 0b111111111111111111) {
                cch = 18;
            } else {
                cch = 36;
            }
        } else if (cch > 36) cch = 36;
        return Str.toBase(n, 2, cch, "", nGrouping);
    }

    /**
     * toBinBytes(n, cb, fPrefix)
     *
     * Converts an integer to binary, with the specified number of bytes (up to the default of 4).
     *
     * @param {number|null|undefined} n (interpreted as a 32-bit value)
     * @param {number} [cb] is the desired number of binary bytes (4 is both the default and the maximum)
     * @param {boolean} [fPrefix]
     * @return {string} the binary representation of n
     */
    static toBinBytes(n, cb, fPrefix)
    {
        var s = "";
        if (!cb || cb > 4) cb = 4;
        for (var i = 0; i < cb; i++) {
            if (s) s = ',' + s;
            s = Str.toBin(n & 0xff, 8) + s;
            n >>= 8;
        }
        return (fPrefix? "0b" : "") + s;
    }

    /**
     * toOct(n, cch, fPrefix)
     *
     * Converts an integer to octal, with the specified number of digits (default of 6; max of 12)
     *
     * You might be tempted to use the built-in n.toString(8) instead, but it doesn't zero-pad and it
     * doesn't properly convert negative values.  Moreover, if n is undefined, n.toString() will throw
     * an exception, whereas this function will return '?' characters.
     *
     * @param {number|null|undefined} n (supports integers up to 36 bits now)
     * @param {number} [cch] is the desired number of octal digits (0 or undefined for default of either 6, 8, or 12)
     * @param {boolean} [fPrefix]
     * @return {string} the octal representation of n
     */
    static toOct(n, cch, fPrefix)
    {
        if (!cch) {
            // cch = Math.ceil(Math.log(Math.abs(n) + 1) / Math.log(8)) || 1;
            var v = Math.abs(n);
            if (v <= 0o777777) {
                cch = 6;
            } else if (v <= 0o77777777) {
                cch = 8;
            } else {
                cch = 12;
            }
        } else if (cch > 12) cch = 12;
        return Str.toBase(n, 8, cch, fPrefix? "0o" : "");
    }

    /**
     * toDec(n, cch)
     *
     * Converts an integer to decimal, with the specified number of digits (default of 5; max of 11)
     *
     * You might be tempted to use the built-in n.toString(10) instead, but it doesn't zero-pad and it
     * doesn't properly convert negative values.  Moreover, if n is undefined, n.toString() will throw
     * an exception, whereas this function will return '?' characters.
     *
     * @param {number|null|undefined} n (supports integers up to 36 bits now)
     * @param {number} [cch] is the desired number of decimal digits (0 or undefined for default of either 5 or 11)
     * @return {string} the decimal representation of n
     */
    static toDec(n, cch)
    {
        if (!cch) {
            // cch = Math.ceil(Math.log(Math.abs(n) + 1) / Math.LN10) || 1;
            var v = Math.abs(n);
            if (v <= 99999) {
                cch = 5;
            } else {
                cch = 11;
            }
        } else if (cch > 11) cch = 11;
        return Str.toBase(n, 10, cch);
    }

    /**
     * toHex(n, cch, fPrefix)
     *
     * Converts an integer to hex, with the specified number of digits (default of 4 or 8, max of 9).
     *
     * You might be tempted to use the built-in n.toString(16) instead, but it doesn't zero-pad and it
     * doesn't properly convert negative values; for example, if n is -2147483647, then n.toString(16)
     * will return "-7fffffff" instead of "80000001".  Moreover, if n is undefined, n.toString() will
     * throw an exception, whereas this function will return '?' characters.
     *
     * NOTE: The following work-around (adapted from code found on StackOverflow) would be another solution,
     * taking care of negative values, zero-padding, and upper-casing, but not null/undefined/NaN values:
     *
     *      s = (n < 0? n + 0x100000000 : n).toString(16);
     *      s = "00000000".substr(0, 8 - s.length) + s;
     *      s = s.substr(0, cch).toUpperCase();
     *
     * @param {number|null|undefined} n (supports integers up to 36 bits now)
     * @param {number} [cch] is the desired number of hex digits (0 or undefined for default of either 4, 8, or 9)
     * @param {boolean} [fPrefix]
     * @return {string} the hex representation of n
     */
    static toHex(n, cch, fPrefix)
    {
        if (!cch) {
            // cch = Math.ceil(Math.log(Math.abs(n) + 1) / Math.log(16)) || 1;
            var v = Math.abs(n);
            if (v <= 0xffff) {
                cch = 4;
            } else if (v <= 0xffffffff) {
                cch = 8;
            } else {
                cch = 9;
            }
        } else if (cch > 9) cch = 9;
        return Str.toBase(n, 16, cch, fPrefix? "0x" : "");
    }

    /**
     * toHexByte(b)
     *
     * Alias for Str.toHex(b, 2, true)
     *
     * @param {number|null|undefined} b is a byte value
     * @return {string} the hex representation of b
     */
    static toHexByte(b)
    {
        return Str.toHex(b, 2, true);
    }

    /**
     * toHexWord(w)
     *
     * Alias for Str.toHex(w, 4, true)
     *
     * @param {number|null|undefined} w is a word (16-bit) value
     * @return {string} the hex representation of w
     */
    static toHexWord(w)
    {
        return Str.toHex(w, 4, true);
    }

    /**
     * toHexLong(l)
     *
     * Alias for Str.toHex(l, 8, true)
     *
     * @param {number|null|undefined} l is a dword (32-bit) value
     * @return {string} the hex representation of w
     */
    static toHexLong(l)
    {
        return Str.toHex(l, 8, true);
    }

    /**
     * getBaseName(sFileName, fStripExt)
     *
     * This is a poor-man's version of Node's path.basename(), which Node-only components should use instead.
     *
     * Note that if fStripExt is true, this strips ANY extension, whereas path.basename() strips the extension only
     * if it matches the second parameter (eg, path.basename("/foo/bar/baz/asdf/quux.html", ".html") returns "quux").
     *
     * @param {string} sFileName
     * @param {boolean} [fStripExt]
     * @return {string}
     */
    static getBaseName(sFileName, fStripExt)
    {
        var sBaseName = sFileName;

        var i = sFileName.lastIndexOf('/');
        if (i >= 0) sBaseName = sFileName.substr(i + 1);

        /*
         * This next bit is a kludge to clean up names that are part of a URL that includes unsightly query parameters.
         */
        i = sBaseName.indexOf('&');
        if (i > 0) sBaseName = sBaseName.substr(0, i);

        if (fStripExt) {
            i = sBaseName.lastIndexOf(".");
            if (i > 0) {
                sBaseName = sBaseName.substring(0, i);
            }
        }
        return sBaseName;
    }

    /**
     * getExtension(sFileName)
     *
     * This is a poor-man's version of Node's path.extname(), which Node-only components should use instead.
     *
     * Note that we EXCLUDE the period from the returned extension, whereas path.extname() includes it.
     *
     * @param {string} sFileName
     * @return {string} the filename's extension (in lower-case and EXCLUDING the "."), or an empty string
     */
    static getExtension(sFileName)
    {
        var sExtension = "";
        var i = sFileName.lastIndexOf(".");
        if (i >= 0) {
            sExtension = sFileName.substr(i + 1).toLowerCase();
        }
        return sExtension;
    }

    /**
     * endsWith(s, sSuffix)
     *
     * @param {string} s
     * @param {string} sSuffix
     * @return {boolean} true if s ends with sSuffix, false if not
     */
    static endsWith(s, sSuffix)
    {
        return s.indexOf(sSuffix, s.length - sSuffix.length) !== -1;
    }

    /**
     * escapeHTML(sHTML)
     *
     * @param {string} sHTML
     * @return {string} with HTML entities "escaped", similar to PHP's htmlspecialchars()
     */
    static escapeHTML(sHTML)
    {
        return sHTML.replace(/[&<>"']/g, function(m)
        {
            return Str.HTMLEscapeMap[m];
        });
    }

    /**
     * replace(sSearch, sReplace, s)
     *
     * The JavaScript replace() function ALWAYS interprets "$" specially in replacement strings, even when
     * the search string is NOT a RegExp; specifically:
     *
     *      $$  Inserts a "$"
     *      $&  Inserts the matched substring
     *      $`  Inserts the portion of the string that precedes the matched substring
     *      $'  Inserts the portion of the string that follows the matched substring
     *      $n  Where n is a positive integer less than 100, inserts the nth parenthesized sub-match string,
     *          provided the first argument was a RegExp object
     *
     * So, if a replacement string containing dollar signs passes through a series of replace() calls, untold
     * problems could result.  Hence, this function, which simply uses the replacement string as-is.
     *
     * Similar to the JavaScript replace() method (when sSearch is a string), this replaces only ONE occurrence
     * (ie, the FIRST occurrence); it might be nice to add options to replace the LAST occurrence and/or ALL
     * occurrences, but we'll revisit that later.
     *
     * @param {string} sSearch
     * @param {string} sReplace
     * @param {string} s
     * @return {string}
     */
    static replace(sSearch, sReplace, s)
    {
        var i = s.indexOf(sSearch);
        if (i >= 0) {
            s = s.substr(0, i) + sReplace + s.substr(i + sSearch.length);
        }
        return s;
    }

    /**
     * replaceAll(sSearch, sReplace, s)
     *
     * @param {string} sSearch
     * @param {string} sReplace
     * @param {string} s
     * @return {string}
     */
    static replaceAll(sSearch, sReplace, s)
    {
        var a = {};
        a[sSearch] = sReplace;
        return Str.replaceArray(a, s);
    }

    /**
     * replaceArray(a, s)
     *
     * @param {Object} a
     * @param {string} s
     * @return {string}
     */
    static replaceArray(a, s)
    {
        var sMatch = "";
        for (var k in a) {
            /*
             * As noted in:
             *
             *      http://www.regexguru.com/2008/04/escape-characters-only-when-necessary/
             *
             * inside character classes, only backslash, caret, hyphen and the closing bracket need to be
             * escaped.  And in fact, if you ensure that the closing bracket is first, the caret is not first,
             * and the hyphen is last, you can avoid escaping those as well.
             */
            k = k.replace(/([\\[\]*{}().+?|$])/g, "\\$1");
            sMatch += (sMatch? '|' : '') + k;
        }
        return s.replace(new RegExp('(' + sMatch + ')', "g"), function(m)
        {
            return a[m];
        });
    }

    /**
     * pad(s, cch, fPadLeft)
     *
     * NOTE: the maximum amount of padding currently supported is 40 spaces.
     *
     * @param {string} s is a string
     * @param {number} cch is desired length
     * @param {boolean} [fPadLeft] (default is padding on the right)
     * @return {string} the original string (s) with spaces padding it to the specified length
     */
    static pad(s, cch, fPadLeft)
    {
        var sPadding = "                                        ";
        return fPadLeft? (sPadding + s).slice(-cch) : (s + sPadding).slice(0, cch);
    }

    /**
     * sprintf(format, ...args)
     *
     * Copied from the CCjs project (/ccjs/lib/stdio.js) and extended.  Far from complete let alone sprintf-compatible,
     * but it's a start.
     *
     * @param {string} format
     * @param {...} args
     * @return {string}
     */
    static sprintf(format, ...args)
    {
        var parts = format.split(/%([-+ 0#]?)([0-9]*)(\.?)([0-9]*)([hlL]?)([A-Za-z%])/);
        var buffer = "";
        var partIndex = 0;
        for (var i = 0; i < args.length; i++) {

            var arg = args[i], d, s;
            buffer += parts[partIndex++];
            var flags = parts[partIndex];
            var minimum = +parts[partIndex+1] || 0;
            var precision = +parts[partIndex+3] || 0;
            var conversion = parts[partIndex+5];

            switch(conversion) {
            case 'd':
            case 'f':
                d = Math.trunc(arg);
                s = d + "";
                if (precision) {
                    minimum -= (precision + 1);
                }
                if (s.length < minimum) {
                    if (flags == '0') {
                        if (d < 0) minimum--;
                        s = ("0000000000" + Math.abs(d)).slice(-minimum);
                        if (d < 0) s = '-' + s;
                    } else {
                        s = ("          " + s).slice(-minimum);
                    }
                }
                if (precision) {
                    d = Math.trunc((arg - Math.trunc(arg)) * Math.pow(10, precision));
                    s += '.' + ("0000000000" + Math.abs(d)).slice(-precision);
                }
                buffer += s;
                break;
            case 's':
                buffer += arg;
                break;
            default:
                /*
                 * The supported ANSI C set of conversions: "dioxXucsfeEgGpn%"
                 */
                buffer += "(unrecognized printf conversion %" + conversion + ")";
                break;
            }

            partIndex += 6;
        }
        buffer += parts[partIndex];
        return buffer;
    }

    /**
     * stripLeadingZeros(s, fPad)
     *
     * @param {string} s
     * @param {boolean} [fPad]
     * @return {string}
     */
    static stripLeadingZeros(s, fPad)
    {
        var cch = s.length;
        s = s.replace(/^0+([0-9A-F]+)$/i, "$1");
        if (fPad) s = Str.pad(s, cch, true);
        return s;
    }

    /**
     * trim(s)
     *
     * @param {string} s
     * @return {string}
     */
    static trim(s)
    {
        if (String.prototype.trim) {
            return s.trim();
        }
        return s.replace(/^\s+|\s+$/g, "");
    }

    /**
     * toASCIICode(b)
     *
     * @param {number} b
     * @return {string}
     */
    static toASCIICode(b)
    {
        var s;
        if (b != Str.ASCII.CR && b != Str.ASCII.LF) {
            s = Str.ASCIICodeMap[b];
        }
        if (s) {
            s = '<' + s + '>';
        } else {
            s = String.fromCharCode(b);
        }
        return s;
    }
}

/*
 * Map special characters to their HTML escape sequences.
 */
Str.HTMLEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
};

/*
 * Map "unprintable" ASCII codes to mnemonics, to more clearly see what's being printed.
 */
Str.ASCIICodeMap = {
    0x00:   "NUL",
    0x01:   "SOH",      // (CTRL_A) Start of Heading
    0x02:   "STX",      // (CTRL_B) Start of Text
    0x03:   "ETX",      // (CTRL_C) End of Text
    0x04:   "EOT",      // (CTRL_D) End of Transmission
    0x05:   "ENQ",      // (CTRL_E) Enquiry
    0x06:   "ACK",      // (CTRL_F) Acknowledge
    0x07:   "BEL",      // (CTRL_G) Bell
    0x08:   "BS",       // (CTRL_H) Backspace
    0x09:   "TAB",      // (CTRL_I) Horizontal Tab (aka HT)
    0x0A:   "LF",       // (CTRL_J) Line Feed (New Line)
    0x0B:   "VT",       // (CTRL_K) Vertical Tab
    0x0C:   "FF",       // (CTRL_L) Form Feed (New Page)
    0x0D:   "CR",       // (CTRL_M) Carriage Return
    0x0E:   "SO",       // (CTRL_N) Shift Out
    0x0F:   "SI",       // (CTRL_O) Shift In
    0x10:   "DLE",      // (CTRL_P) Data Link Escape
    0x11:   "XON",      // (CTRL_Q) Device Control 1 (aka DC1)
    0x12:   "DC2",      // (CTRL_R) Device Control 2
    0x13:   "XOFF",     // (CTRL_S) Device Control 3 (aka DC3)
    0x14:   "DC4",      // (CTRL_T) Device Control 4
    0x15:   "NAK",      // (CTRL_U) Negative Acknowledge
    0x16:   "SYN",      // (CTRL_V) Synchronous Idle
    0x17:   "ETB",      // (CTRL_W) End of Transmission Block
    0x18:   "CAN",      // (CTRL_X) Cancel
    0x19:   "EM",       // (CTRL_Y) End of Medium
    0x1A:   "SUB",      // (CTRL_Z) Substitute
    0x1B:   "ESC",      // Escape
    0x1C:   "FS",       // File Separator
    0x1D:   "GS",       // Group Separator
    0x1E:   "RS",       // Record Separator
    0x1F:   "US",       // Unit Separator
    0x7F:   "DEL"
};

/*
 * Refer to: https://en.wikipedia.org/wiki/Code_page_437
 */
Str.CP437ToUnicode = [
    '\u0000', '\u263A', '\u263B', '\u2665', '\u2666', '\u2663', '\u2660', '\u2022',
    '\u25D8', '\u25CB', '\u25D9', '\u2642', '\u2640', '\u266A', '\u266B', '\u263C',
    '\u25BA', '\u25C4', '\u2195', '\u203C', '\u00B6', '\u00A7', '\u25AC', '\u21A8',
    '\u2191', '\u2193', '\u2192', '\u2190', '\u221F', '\u2194', '\u25B2', '\u25BC',
    '\u0020', '\u0021', '\u0022', '\u0023', '\u0024', '\u0025', '\u0026', '\u0027',
    '\u0028', '\u0029', '\u002A', '\u002B', '\u002C', '\u002D', '\u002E', '\u002F',
    '\u0030', '\u0031', '\u0032', '\u0033', '\u0034', '\u0035', '\u0036', '\u0037',
    '\u0038', '\u0039', '\u003A', '\u003B', '\u003C', '\u003D', '\u003E', '\u003F',
    '\u0040', '\u0041', '\u0042', '\u0043', '\u0044', '\u0045', '\u0046', '\u0047',
    '\u0048', '\u0049', '\u004A', '\u004B', '\u004C', '\u004D', '\u004E', '\u004F',
    '\u0050', '\u0051', '\u0052', '\u0053', '\u0054', '\u0055', '\u0056', '\u0057',
    '\u0058', '\u0059', '\u005A', '\u005B', '\u005C', '\u005D', '\u005E', '\u005F',
    '\u0060', '\u0061', '\u0062', '\u0063', '\u0064', '\u0065', '\u0066', '\u0067',
    '\u0068', '\u0069', '\u006A', '\u006B', '\u006C', '\u006D', '\u006E', '\u006F',
    '\u0070', '\u0071', '\u0072', '\u0073', '\u0074', '\u0075', '\u0076', '\u0077',
    '\u0078', '\u0079', '\u007A', '\u007B', '\u007C', '\u007D', '\u007E', '\u2302',
    '\u00C7', '\u00FC', '\u00E9', '\u00E2', '\u00E4', '\u00E0', '\u00E5', '\u00E7',
    '\u00EA', '\u00EB', '\u00E8', '\u00EF', '\u00EE', '\u00EC', '\u00C4', '\u00C5',
    '\u00C9', '\u00E6', '\u00C6', '\u00F4', '\u00F6', '\u00F2', '\u00FB', '\u00F9',
    '\u00FF', '\u00D6', '\u00DC', '\u00A2', '\u00A3', '\u00A5', '\u20A7', '\u0192',
    '\u00E1', '\u00ED', '\u00F3', '\u00FA', '\u00F1', '\u00D1', '\u00AA', '\u00BA',
    '\u00BF', '\u2310', '\u00AC', '\u00BD', '\u00BC', '\u00A1', '\u00AB', '\u00BB',
    '\u2591', '\u2592', '\u2593', '\u2502', '\u2524', '\u2561', '\u2562', '\u2556',
    '\u2555', '\u2563', '\u2551', '\u2557', '\u255D', '\u255C', '\u255B', '\u2510',
    '\u2514', '\u2534', '\u252C', '\u251C', '\u2500', '\u253C', '\u255E', '\u255F',
    '\u255A', '\u2554', '\u2569', '\u2566', '\u2560', '\u2550', '\u256C', '\u2567',
    '\u2568', '\u2564', '\u2565', '\u2559', '\u2558', '\u2552', '\u2553', '\u256B',
    '\u256A', '\u2518', '\u250C', '\u2588', '\u2584', '\u258C', '\u2590', '\u2580',
    '\u03B1', '\u00DF', '\u0393', '\u03C0', '\u03A3', '\u03C3', '\u00B5', '\u03C4',
    '\u03A6', '\u0398', '\u03A9', '\u03B4', '\u221E', '\u03C6', '\u03B5', '\u2229',
    '\u2261', '\u00B1', '\u2265', '\u2264', '\u2320', '\u2321', '\u00F7', '\u2248',
    '\u00B0', '\u2219', '\u00B7', '\u221A', '\u207F', '\u00B2', '\u25A0', '\u00A0'
];

/*
 * TODO: Future home of a complete ASCII table.
 */
Str.ASCII = {
    LF:     0x0A,
    CR:     0x0D
};

Str.TYPES = {
    NULL:       0,
    BYTE:       1,
    WORD:       2,
    DWORD:      3,
    NUMBER:     4,
    STRING:     5,
    BOOLEAN:    6,
    OBJECT:     7,
    ARRAY:      8
};

if (NODE) module.exports = Str;
