/**
 *  @fileoverview String-related helper functions
 *  @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 *  @version 1.0
 *  Created 2014-03-09
 *
 *  Copyright © 2012-2015 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of the JavaScript Machines Project (aka JSMachines) at <http://jsmachines.net/>
 * and <http://pcjs.org/>.
 *
 * JSMachines is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * JSMachines is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with JSMachines.
 * If not, see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some JSMachines files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * JSMachines Project for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

var str = {};

/**
 * isValidInt(s, base)
 *
 * Since the built-in parseInt() function has the annoying feature of returning a partial value
 * when it encounters an invalid character (eg, parseInt("foo", 16) returns 0xf), use this function
 * to validate the entire string first.
 *
 * @param {string} s is the string representation of some number
 * @param {number} [base] is the radix of the number represented above (only 10 and 16 are supported)
 * @return {boolean} true if valid (or we're not sure because the base isn't recognized), false if invalid
 */
str.isValidInt = function(s, base)
{
    if (!base || base == 10) return s.match(/^[0-9]+$/) !== null;
    if (base == 16) return s.match(/^[0-9a-f]+$/i) !== null;
    return true;
};

/**
 * parseInt(s, base)
 *
 * This is a wrapper around the built-in parseInt() function, which recognizes certain prefixes (eg,
 * '$' or "0x" for hex) and suffixes (eg, 'h' for hex or '.' for decimal), and then calls isValidInt()
 * to ensure we don't get partial values (see isValidInt() for details).
 *
 * @param {string} s is the string representation of some number
 * @param {number} [base] is the radix to assume (default is 16)
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
            if (chSuffix === null) s = s.substr(0, s.length-1);
        }
        var v;
        if (str.isValidInt(s, base) && !isNaN(v = parseInt(s, base))) {
            value = v|0;
        }
    }
    return value;
};

/**
 * toHex(n, cch)
 *
 * Converts an integer to hex, with the specified number of digits (up to the default of 8).
 *
 * You might be tempted to use the built-in n.toString(16) instead, but it doesn't zero-pad and it
 * doesn't properly convert negative values; for example, if n is -2147483647, then n.toString(16)
 * will return "-7fffffff" instead of "80000001".  Moreover, if n is undefined, n.toString() will throw
 * an exception, whereas toHex() will simply return '?' characters.
 *
 * NOTE: The following work-around (adapted from code found on StackOverflow) would be another solution,
 * taking care of negative values, zero-padding, and upper-casing, but not undefined/NaN values:
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
 * @param {number|undefined} b is a byte value
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
 * @param {number|undefined} w is a word (16-bit) value
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
 * @param {number|undefined} l is a dword (32-bit) value
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
 * Note that fStripExt can be used to strip ANY extension, whereas path.basename() will strip the extension only
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
 * pad(s, cch)
 *
 * Note that the maximum amount of padding currently supported is 40 spaces.
 *
 * @param {string} s is a string
 * @param {number} cch is desired length
 * @returns {string} the original string (s) with spaces padding it to the specified length
 */
str.pad = function(s, cch)
{
    return s + "                                        ".substr(0, cch - s.length);
};

/**
 * trim(s)
 *
 * @param {string} s
 * @returns {string}
 */
str.trim = function(s)
{
    if (String.prototype.trim) {
        return s.trim();
    }
    return s.replace(/^\s+|\s+$/g, "");
};

if (typeof module !== 'undefined') module.exports = str;
