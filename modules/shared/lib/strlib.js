/**
 * @fileoverview String-related helper functions
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 * @version 1.0
 * Created 2014-03-09
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
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
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see COPYRIGHT in /modules/shared/lib/defines.js).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

var str = {};

/**
 * isValidInt(s, base)
 *
 * The built-in parseInt() function has the annoying feature of returning a partial value (ie,
 * up to the point where it encounters an invalid character); eg, parseInt("foo", 16) returns 0xf.
 * So use this function to validate the entire string.
 *
 * @param {string} s is the string representation of some number
 * @param {number} [base] is the radix of the number represented above (only 2, 10 and 16 are supported)
 * @return {boolean} true if valid, false if invalid (or the specified base isn't supported)
 */
str.isValidInt = function(s, base)
{
    if (!base || base == 10) return s.match(/^[0-9]+$/) !== null;
    if (base == 16) return s.match(/^[0-9a-f]+$/i) !== null;
    if (base == 2) return s.match(/^[01]+$/i) !== null;
    return false;
};

/**
 * parseInt(s, base)
 *
 * This is a wrapper around the built-in parseInt() function, which recognizes certain prefixes (eg,
 * '$' or "0x" for hex) and suffixes (eg, 'h' for hex, or '.' for decimal), and then calls isValidInt()
 * to ensure we don't convert strings that contain partial values (see isValidInt() for details).
 *
 * We don't support multiple prefix/suffix combinations, nor do we support the "0b" prefix (or "b" suffix)
 * for binary, because 1) it's not commonly used, and 2) it conflicts with valid hex sequences.
 *
 * @param {string} s is the string representation of some number
 * @param {number} [base] is the default radix to use (default is 16); can be overridden by prefixes/suffixes
 * @return {number|undefined} corresponding value, or undefined if invalid
 */
str.parseInt = function(s, base)
{
    var value;
    if (s) {
        if (!base) base = 16;
        if (s.charAt(0) == '$') {
            base = 16;
            s = s.substr(1);
        } else if (s.substr(0, 2) == "0x") {
            base = 16;
            s = s.substr(2);
        } else {
            var chSuffix = s.charAt(s.length-1).toLowerCase();
            if (chSuffix == 'h') {
                base = 16;
                chSuffix = null;
            }
            else if (chSuffix == '.') {
                base = 10;
                chSuffix = null;
            }
            if (chSuffix == null) s = s.substr(0, s.length-1);
        }
        var v;
        if (str.isValidInt(s, base) && !isNaN(v = parseInt(s, base))) {
            value = v|0;
        }
    }
    return value;
};

/**
 * toBin(n, cch)
 *
 * Converts an integer to binary, with the specified number of digits (up to the default of 32).
 *
 * @param {number|null|undefined} n is a 32-bit value
 * @param {number} [cch] is the desired number of binary digits (32 is both the default and the maximum)
 * @return {string} the binary representation of n
 */
str.toBin = function(n, cch)
{
    var s = "";
    if (cch === undefined) {
        cch = 32;
    } else {
        if (cch > 32) cch = 32;
    }
    /*
     * An initial "falsey" check for null takes care of both null and undefined;
     * we can't rely entirely on isNaN(), because isNaN(null) returns false, oddly enough.
     *
     * Alternatively, we could mask and shift n regardless of whether it's null/undefined/NaN,
     * since JavaScript coerces such operands to zero, but I think there's "value" in seeing those
     * values displayed differently.
     */
    if (n == null || isNaN(n)) {
        while (cch-- > 0) s = '?' + s;
    } else {
        while (cch-- > 0) {
            s = ((n & 0x1)? '1' : '0') + s;
            n >>= 1;
        }
    }
    return s;
};

/**
 * toBinBytes(n, cb)
 *
 * Converts an integer to binary, with the specified number of bytes (up to the default of 4).
 *
 * @param {number|null|undefined} n is a 32-bit value
 * @param {number} [cb] is the desired number of binary bytes (4 is both the default and the maximum)
 * @return {string} the binary representation of n
 */
str.toBinBytes = function(n, cb)
{
    var s = "";
    if (!cb || cb > 4) cb = 4;
    for (var i = 0; i < cb; i++) {
        if (s) s = ',' + s;
        s = str.toBin(n & 0xff, 8) + 'b' + s;
        n >>= 8;
    }
    return s;
};

/**
 * toHex(n, cch)
 *
 * Converts an integer to hex, with the specified number of digits (up to the default of 8).
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
 * @param {number|null|undefined} n is a 32-bit value
 * @param {number} [cch] is the desired number of hex digits (8 is both the default and the maximum)
 * @return {string} the hex representation of n
 */
str.toHex = function(n, cch)
{
    var s = "";
    if (cch === undefined) {
        cch = 8;
    } else {
        if (cch > 8) cch = 8;
    }
    /*
     * An initial "falsey" check for null takes care of both null and undefined;
     * we can't rely entirely on isNaN(), because isNaN(null) returns false, oddly enough.
     *
     * Alternatively, we could mask and shift n regardless of whether it's null/undefined/NaN,
     * since JavaScript coerces such operands to zero, but I think there's "value" in seeing those
     * values displayed differently.
     */
    if (n == null || isNaN(n)) {
        while (cch-- > 0) s = '?' + s;
    } else {
        while (cch-- > 0) {
            var d = n & 0xf;
            d += (d >= 0 && d <= 9? 0x30 : 0x41 - 10);
            s = String.fromCharCode(d) + s;
            n >>= 4;
        }
    }
    return s;
};

/**
 * toHexByte(b)
 *
 * Alias for "0x" + str.toHex(b, 2)
 *
 * @param {number|null|undefined} b is a byte value
 * @return {string} the hex representation of b
 */
str.toHexByte = function(b)
{
    return "0x" + str.toHex(b, 2);
};

/**
 * toHexWord(w)
 *
 * Alias for "0x" + str.toHex(w, 4)
 *
 * @param {number|null|undefined} w is a word (16-bit) value
 * @return {string} the hex representation of w
 */
str.toHexWord = function(w)
{
    return "0x" + str.toHex(w, 4);
};

/**
 * toHexLong(l)
 *
 * Alias for "0x" + toHex(l)
 *
 * @param {number|null|undefined} l is a dword (32-bit) value
 * @return {string} the hex representation of w
 */
str.toHexLong = function(l)
{
    return "0x" + str.toHex(l);
};

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
str.getBaseName = function(sFileName, fStripExt)
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
};

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
str.getExtension = function(sFileName)
{
    var sExtension = "";
    var i = sFileName.lastIndexOf(".");
    if (i >= 0) {
        sExtension = sFileName.substr(i + 1).toLowerCase();
    }
    return sExtension;
};

/**
 * endsWith(s, sSuffix)
 *
 * @param {string} s
 * @param {string} sSuffix
 * @return {boolean} true if s ends with sSuffix, false if not
 */
str.endsWith = function(s, sSuffix)
{
    return s.indexOf(sSuffix, s.length - sSuffix.length) !== -1;
};

str.aHTMLEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
};

/**
 * escapeHTML(sHTML)
 *
 * @param {string} sHTML
 * @return {string} with HTML entities "escaped", similar to PHP's htmlspecialchars()
 */
str.escapeHTML = function(sHTML)
{
    return sHTML.replace(/[&<>"']/g, function(m) {
        return str.aHTMLEscapeMap[m];
    });
};

/**
 * replaceAll(sFind, sReplace, s)
 *
 * @param {string} sFind
 * @param {string} sReplace
 * @param {string} s
 * @return {string}
 */
str.replaceAll = function(sFind, sReplace, s)
{
    var a = {};
    a[sFind] = sReplace;
    return str.replaceArray(a, s);
};

/**
 * replaceArray(a, s)
 *
 * @param {Object} a
 * @param {string} s
 * @return {string}
 */
str.replaceArray = function(a, s)
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
        k = k.replace(/([\\[\]*{}().+?])/g, "\\$1");
        sMatch += (sMatch? '|' : '') + k;
    }
    return s.replace(new RegExp('(' + sMatch + ')', "g"), function(m) {
        return a[m];
    });
};

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
str.pad = function(s, cch, fPadLeft)
{
    var sPadding = "                                        ";
    return fPadLeft? (sPadding + s).slice(-cch) : (s + sPadding).slice(0, cch);
};

/**
 * trim(s)
 *
 * @param {string} s
 * @return {string}
 */
str.trim = function(s)
{
    if (String.prototype.trim) {
        return s.trim();
    }
    return s.replace(/^\s+|\s+$/g, "");
};

/*
 * Any codes commented out in the following table are deemed "printable"
 */
str.aASCIICodes = {
    0x00:   "NUL",
    0x01:   "SOH",      // (CTRL_A) Start of Heading
    0x02:   "STX",      // (CTRL_B) Start of Text
    0x03:   "ETX",      // (CTRL_C) End of Text
    0x04:   "EOT",      // (CTRL_D) End of Transmission
    0x05:   "ENQ",      // (CTRL_E) Enquiry
    0x06:   "ACK",      // (CTRL_F) Acknowledge
    0x07:   "BEL",      // (CTRL_G) Bell
    0x08:   "BS",       // (CTRL_H) Backspace
    0x09:   "TAB",      // (CTRL_I) Horizontal Tab
 // 0x0A:   "LF",       // (CTRL_J) Line Feed (New Line)
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
    0x1F:   "US"        // Unit Separator
};

/**
 * toASCIICode(b)
 *
 * @param {number} b
 * @return {string}
 */
str.toASCIICode = function(b)
{
    var s = str.aASCIICodes[b];
    if (s) {
        s = '<' + s + '>';
    } else {
        s = String.fromCharCode(b);
    }
    return s;
};

if (NODE) module.exports = str;
