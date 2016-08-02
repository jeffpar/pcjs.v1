"use strict";

// ./modules/shared/lib/defines.js

/**
 * @fileoverview Compile-time definitions used by C1Pjs and PCjs.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2014-May-08
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

/**
 * @define {string}
 */
var APPVERSION = "1.x.x";       // this @define is overridden by the Closure Compiler with the version in package.json

var XMLVERSION = null;          // this is set in non-COMPILED builds by embedMachine() if a version number was found in the machine XML

var COPYRIGHT = "Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>";

var LICENSE = "License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>";

var CSSCLASS = "pcjs";

/**
 * @define {string}
 */
var SITEHOST = "localhost:8088";// this @define is overridden by the Closure Compiler with "www.pcjs.org"

/**
 * @define {boolean}
 */
var COMPILED = false;           // this @define is overridden by the Closure Compiler (to true)

/**
 * @define {boolean}
 */
var DEBUG = true;               // this @define is overridden by the Closure Compiler (to false) to remove DEBUG-only code

/**
 * @define {boolean}
 */
var MAXDEBUG = false;           // this @define is overridden by the Closure Compiler (to false) to remove MAXDEBUG-only code

/**
 * @define {boolean}
 */
var PRIVATE = false;            // this @define is overridden by the Closure Compiler (to false) to enable PRIVATE code

/*
 * NODE should be true if we're running under NodeJS (eg, command-line), false if not (eg, web browser)
 */
var NODE = false;


// ./modules/shared/lib/dumpapi.js

/**
 * @fileoverview Disk APIs, as defined by diskdump.js and consumed by disk.js
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2014-May-08
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

/*
 * Our "DiskDump API", such as it was, used to look like:
 *
 *      http://jsmachines.net/bin/convdisk.php?disk=/disks/pc/dos/ibm/2.00/PCDOS200-DISK1.json&format=img
 *
 * To make it (a bit) more "REST-like", the above request now looks like:
 *
 *      http://www.pcjs.org/api/v1/dump?disk=/disks/pc/dos/ibm/2.00/PCDOS200-DISK1.json&format=img
 *
 * Similarly, our "FileDump API" used to look like:
 *
 *      http://jsmachines.net/bin/convrom.php?rom=/devices/pc/rom/5150/1981-04-24/PCBIOS-REV1.rom&format=json
 *
 * and that request now looks like:
 *
 *      http://www.pcjs.org/api/v1/dump?file=/devices/pc/rom/5150/1981-04-24/PCBIOS-REV1.rom&format=json
 *
 * I don't think it makes sense to avoid "query" parameters, because blending the path of a disk image with the
 * the rest of the URL would be (a) confusing, and (b) more work to parse.
 */
var DumpAPI = {
    ENDPOINT:       "/api/v1/dump",
    QUERY: {
        DIR:        "dir",      // value is path of a directory (DiskDump only)
        DISK:       "disk",     // value is path of a disk image (DiskDump only)
        FILE:       "file",     // value is path of a ROM image file (FileDump only)
        IMG:        "img",      // alias for DISK
        PATH:       "path",     // value is path of a one or more files (DiskDump only)
        FORMAT:     "format",   // value is one of FORMAT values below
        COMMENTS:   "comments", // value is either "true" or "false"
        DECIMAL:    "decimal",  // value is either "true" to force all numbers to decimal, "false" or undefined otherwise
        MBHD:       "mbhd",     // value is hard drive size in Mb (formerly "mbsize") (DiskDump only) (DEPRECATED)
        SIZE:       "size"      // value is target disk size in Kb (supersedes "mbhd") (DiskDump only)
    },
    FORMAT: {
        JSON:       "json",     // default
        JSON_GZ:    "gz",       // gzip is currently used ONLY for compressed JSON
        DATA:       "data",     // same as "json", but built without JSON.stringify() (DiskDump only)
        HEX:        "hex",      // deprecated
        BYTES:      "bytes",    // displays data as hex bytes; normally used only when comments are enabled
        IMG:        "img",      // returns the raw disk data (ie, using a Buffer object) (DiskDump only)
        ROM:        "rom"       // returns the raw file data (ie, using a Buffer object) (FileDump only)
    }
};

/*
 * Because we use an overloaded API endpoint (ie, one that's shared with the FileDump module), we must
 * also provide a list of commands which, when combined with the endpoint, define a unique request.
 */
DumpAPI.asDiskCommands = [DumpAPI.QUERY.DIR, DumpAPI.QUERY.DISK, DumpAPI.QUERY.PATH];
DumpAPI.asFileCommands = [DumpAPI.QUERY.FILE];


// ./modules/shared/lib/reportapi.js

/**
 * @fileoverview Report API, as defined by httpapi.js
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2014-May-13
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

var ReportAPI = {
    ENDPOINT:       "/api/v1/report",
    QUERY: {
        APP:        "app",
        VER:        "ver",
        URL:        "url",
        USER:       "user",
        TYPE:       "type",
        DATA:       "data"
    },
    TYPE: {
        BUG:        "bug"
    },
    RES: {
        OK:         "Thank you"
    }
};


// ./modules/shared/lib/userapi.js

/**
 * @fileoverview User API, as defined by httpapi.js
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2014-May-13
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

/*
 * Examples of User API requests:
 *
 *      web.getHost() + UserAPI.ENDPOINT + '?' + UserAPI.QUERY.REQ + '=' + UserAPI.REQ.VERIFY + '&' + UserAPI.QUERY.USER + '=' + sUser;
 */

var UserAPI = {
    ENDPOINT:       "/api/v1/user",
    QUERY: {
        REQ:        "req",      // specifies a request
        USER:       "user",     // specifies a user ID
        STATE:      "state",    // specifies a state ID
        DATA:       "data"      // specifies state data
    },
    REQ: {
        CREATE:     "create",   // creates a user ID
        VERIFY:     "verify",   // requests verification of a user ID
        STORE:      "store",    // stores a machine state on the server
        LOAD:       "load"      // loads a machine state from the server
    },
    RES: {
        CODE:       "code",
        DATA:       "data"
    },
    CODE: {
        OK:         "ok",
        FAIL:       "error"
    },
    FAIL: {
        DUPLICATE:  "user already exists",
        VERIFY:     "unable to verify user",
        BADSTATE:   "invalid state parameter",
        NOSTATE:    "no machine state",
        BADLOAD:    "unable to load machine state",
        BADSTORE:   "unable to save machine state"
    }
};


// ./modules/shared/lib/strlib.js

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
 * @returns {string} the original string (s) with spaces padding it to the specified length
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
 * @returns {string}
 */
str.trim = function(s)
{
    if (String.prototype.trim) {
        return s.trim();
    }
    return s.replace(/^\s+|\s+$/g, "");
};


// ./modules/shared/lib/usrlib.js

/**
 * @fileoverview Assorted helper functions
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

var usr = {};

/**
 * binarySearch(a, v, fnCompare)
 *
 * @param {Array} a is an array
 * @param {number|string|Array|Object} v
 * @param {function((number|string|Array|Object), (number|string|Array|Object))} [fnCompare]
 * @return {number} the index of matching entry if non-negative, otherwise the index of the insertion point
 */
usr.binarySearch = function(a, v, fnCompare) {
    var left = 0;
    var right = a.length;
    var found = 0;
    if (fnCompare === undefined) {
        fnCompare = function(a, b) {
            return a > b? 1 : a < b? -1 : 0;
        };
    }
    while (left < right) {
        var middle = (left + right) >> 1;
        var compareResult;
        compareResult = fnCompare(v, a[middle]);
        if (compareResult > 0) {
            left = middle + 1;
        } else {
            right = middle;
            found = !compareResult;
        }
    }
    return found? left : ~left;
};

/**
 * binaryInsert(a, v, fnCompare)
 *
 * If element v already exists in array a, the array is unchanged (we don't allow duplicates); otherwise, the
 * element is inserted into the array at the appropriate index.
 *
 * @param {Array} a is an array
 * @param {number|string|Array|Object} v is the value to insert
 * @param {function((number|string|Array|Object), (number|string|Array|Object))} [fnCompare]
 */
usr.binaryInsert = function(a, v, fnCompare) {
    var index = usr.binarySearch(a, v, fnCompare);
    if (index < 0) {
        a.splice(-(index + 1), 0, v);
    }
};

/**
 * getTime()
 *
 * @return {number} the current time, in milliseconds
 */
usr.getTime = Date.now || function() { return +new Date(); };

/**
 * getTimestamp()
 *
 * @return {string} timestamp containing the current date and time ("yyyy-mm-dd hh:mm:ss")
 */
usr.getTimestamp = function() {
    var date = new Date();
    var padNum = function(n) {
        return (n < 10? "0" : "") + n;
    };
    return date.getFullYear() + "-" + padNum(date.getMonth() + 1) + "-" + padNum(date.getDate()) + " " + padNum(date.getHours()) + ":" + padNum(date.getMinutes()) + ":" + padNum(date.getSeconds());
};

/**
 * getMonthDays(nMonth, nYear)
 *
 * Note that if we're being called on behalf of the RTC, its year is always truncated to two digits (mod 100),
 * so we have no idea what century the year 0 might refer to.  When using the normal leap-year formula, 0 fails
 * the mod 100 test but passes the mod 400 test, so as far as the RTC is concerned, every century year is a leap
 * year.  Since we're most likely dealing with the year 2000, that's fine, since 2000 was also a leap year.
 *
 * TODO: There IS a separate CMOS byte that's supposed to be set to CMOS_ADDR.CENTURY_DATE; it's always BCD,
 * so theoretically it will contain values like 0x19 or 0x20 (for the 20th and 21st centuries, respectively), and
 * we could add that as another parameter to this function, to improve the accuracy, but that would go beyond what
 * a real RTC actually does.
 *
 * @param {number} nMonth (1-12)
 * @param {number} nYear (normally a 4-digit year, but it may also be mod 100)
 * @return {number} the maximum (1-based) day allowed for the specified month and year
 */
usr.getMonthDays = function(nMonth, nYear)
{
    var nDays = usr.aMonthDays[nMonth - 1];
    if (nDays == 28) {
        if ((nYear % 4) === 0 && ((nYear % 100) || (nYear % 400) === 0)) {
            nDays++;
        }
    }
    return nDays;
};

usr.asDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
usr.asMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
usr.aMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * formatDate(sFormat, date)
 *
 * @param {string} sFormat (eg, "F j, Y", "Y-m-d H:i:s")
 * @param {Date} [date] (default is the current time)
 * @return {string}
 *
 * Supported identifiers in sFormat include:
 *
 *      a:  lowercase ante meridiem and post meridiem (am or pm)
 *      d:  day of the month, 2 digits with leading zeros (01,...,31)
 *      g:  hour in 12-hour format, without leading zeros (1,...,12)
 *      i:  minutes, with leading zeros (00,...,59)
 *      j:  day of the month, without leading zeros (1,...,31)
 *      l:  day of the week ("Sunday",...,"Saturday")
 *      m:  month, with leading zeros (01,...,12)
 *      s:  seconds, with leading zeros (00,...,59)
 *      F:  month ("January",...,"December")
 *      H:  hour in 24-hour format, with leading zeros (00,...,23)
 *      Y:  year (eg, 2014)
 *
 * For more inspiration, see: http://php.net/manual/en/function.date.php
 */
usr.formatDate = function(sFormat, date) {
    var sDate = "";
    if (!date) date = new Date();
    var iHour = date.getHours();
    var iDay = date.getDate();
    var iMonth = date.getMonth() + 1;
    for (var i = 0; i < sFormat.length; i++) {
        var ch;
        switch((ch = sFormat.charAt(i))) {
        case 'a':
            sDate += (iHour < 12? "am" : "pm");
            break;
        case 'd':
            sDate += ('0' + iDay).slice(-2);
            break;
        case 'g':
            sDate += (!iHour? 12 : (iHour > 12? iHour - 12 : iHour));
            break;
        case 'i':
            sDate += ('0' + date.getMinutes()).slice(-2);
            break;
        case 'j':
            sDate += iDay;
            break;
        case 'l':
            sDate += usr.asDays[date.getDay()];
            break;
        case 'm':
            sDate += ('0' + iMonth).slice(-2);
            break;
        case 's':
            sDate += ('0' + date.getSeconds()).slice(-2);
            break;
        case 'F':
            sDate += usr.asMonths[iMonth - 1];
            break;
        case 'H':
            sDate += ('0' + iHour).slice(-2);
            break;
        case 'Y':
            sDate += date.getFullYear();
            break;
        default:
            sDate += ch;
            break;
        }
    }
    return sDate;
};

/**
 * @typedef {{
 *  mask:       number,
 *  shift:      number
 * }}
 */
var BitField;

/**
 * @typedef {Object.<BitField>}
 */
var BitFields;

/**
 * defineBitFields(bfs)
 *
 * Prepares a bit field definition for use with getBitField() and setBitField(); eg:
 *
 *      var bfs = usr.defineBitFields({num:20, count:8, btmod:1, type:3});
 *
 * The above defines a set of bit fields containg four fields: num (bits 0-19), count (bits 20-27), btmod (bit 28), and type (bits 29-31).
 *
 *      usr.setBitField(bfs.num, n, 1);
 *
 * The above set bit field "bfs.num" in numeric variable "n" to the value 1.
 *
 * @param {Object} bfs
 * @return {BitFields}
 */
usr.defineBitFields = function(bfs)
{
    var bit = 0;
    for (var f in bfs) {
        var width = bfs[f];
        var mask = ((1 << width) - 1) << bit;
        bfs[f] = {mask: mask, shift: bit};
        bit += width;
    }
    //
    return bfs;
};

/**
 * initBitFields(bfs, ...)
 *
 * @param {BitFields} bfs
 * @param {...number} var_args
 * @return {number} a value containing all supplied bit fields
 */
usr.initBitFields = function(bfs, var_args)
{
    var v = 0, i = 1;
    for (var f in bfs) {
        if (i >= arguments.length) break;
        v = usr.setBitField(bfs[f], v, arguments[i++]);
    }
    return v;
};

/**
 * getBitField(bf, v)
 *
 * @param {BitField} bf
 * @param {number} v is a value containing bit fields
 * @return {number} the value of the bit field in v defined by bf
 */
usr.getBitField = function(bf, v)
{
    return (v & bf.mask) >> bf.shift;
};

/**
 * setBitField(bf, v, n)
 *
 * @param {BitField} bf
 * @param {number} v is a value containing bit fields
 * @param {number} n is a value to store in v in the bit field defined by bf
 * @return {number} updated v
 */
usr.setBitField = function(bf, v, n)
{
    //
    return (v & ~bf.mask) | ((n << bf.shift) & bf.mask);
};

/**
 * indexOf(a, t, i)
 *
 * Use this instead of Array.prototype.indexOf() if you can't be sure the browser supports it.
 *
 * @param {Array} a
 * @param {*} t
 * @param {number} [i]
 * @returns {number}
 */
usr.indexOf = function(a, t, i)
{
    if (Array.prototype.indexOf) {
        return a.indexOf(t, i);
    }
    i = i || 0;
    if (i < 0) i += a.length;
    if (i < 0) i = 0;
    for (var n = a.length; i < n; i++) {
        if (i in a && a[i] === t) return i;
    }
    return -1;
};


// ./modules/shared/lib/weblib.js

/**
 * @fileoverview Browser-related helper functions
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 * @version 1.0
 * Created 2014-05-08
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

/*
 * According to http://www.w3schools.com/jsref/jsref_obj_global.asp, these are the *global* properties
 * and functions of JavaScript-in-the-Browser:
 *
 * Property             Description
 * ---
 * Infinity             A numeric value that represents positive/negative infinity
 * NaN                  "Not-a-Number" value
 * undefined            Indicates that a variable has not been assigned a value
 *
 * Function             Description
 * ---
 * decodeURI()          Decodes a URI
 * decodeURIComponent() Decodes a URI component
 * encodeURI()          Encodes a URI
 * encodeURIComponent() Encodes a URI component
 * escape()             Deprecated in version 1.5. Use encodeURI() or encodeURIComponent() instead
 * eval()               Evaluates a string and executes it as if it was script code
 * isFinite()           Determines whether a value is a finite, legal number
 * isNaN()              Determines whether a value is an illegal number
 * Number()             Converts an object's value to a number
 * parseFloat()         Parses a string and returns a floating point number
 * parseInt()           Parses a string and returns an integer
 * String()             Converts an object's value to a string
 * unescape()           Deprecated in version 1.5. Use decodeURI() or decodeURIComponent() instead
 *
 * And according to http://www.w3schools.com/jsref/obj_window.asp, these are the properties and functions
 * of the *window* object.
 *
 * Property             Description
 * ---
 * closed               Returns a Boolean value indicating whether a window has been closed or not
 * defaultStatus        Sets or returns the default text in the statusbar of a window
 * document             Returns the Document object for the window (See Document object)
 * frames               Returns an array of all the frames (including iframes) in the current window
 * history              Returns the History object for the window (See History object)
 * innerHeight          Returns the inner height of a window's content area
 * innerWidth           Returns the inner width of a window's content area
 * length               Returns the number of frames (including iframes) in a window
 * location             Returns the Location object for the window (See Location object)
 * name                 Sets or returns the name of a window
 * navigator            Returns the Navigator object for the window (See Navigator object)
 * opener               Returns a reference to the window that created the window
 * outerHeight          Returns the outer height of a window, including toolbars/scrollbars
 * outerWidth           Returns the outer width of a window, including toolbars/scrollbars
 * pageXOffset          Returns the pixels the current document has been scrolled (horizontally) from the upper left corner of the window
 * pageYOffset          Returns the pixels the current document has been scrolled (vertically) from the upper left corner of the window
 * parent               Returns the parent window of the current window
 * screen               Returns the Screen object for the window (See Screen object)
 * screenLeft           Returns the x coordinate of the window relative to the screen
 * screenTop            Returns the y coordinate of the window relative to the screen
 * screenX              Returns the x coordinate of the window relative to the screen
 * screenY              Returns the y coordinate of the window relative to the screen
 * self                 Returns the current window
 * status               Sets or returns the text in the statusbar of a window
 * top                  Returns the topmost browser window
 *
 * Method               Description
 * ---
 * alert()              Displays an alert box with a message and an OK button
 * atob()               Decodes a base-64 encoded string
 * blur()               Removes focus from the current window
 * btoa()               Encodes a string in base-64
 * clearInterval()      Clears a timer set with setInterval()
 * clearTimeout()       Clears a timer set with setTimeout()
 * close()              Closes the current window
 * confirm()            Displays a dialog box with a message and an OK and a Cancel button
 * createPopup()        Creates a pop-up window
 * focus()              Sets focus to the current window
 * moveBy()             Moves a window relative to its current position
 * moveTo()             Moves a window to the specified position
 * open()               Opens a new browser window
 * print()              Prints the content of the current window
 * prompt()             Displays a dialog box that prompts the visitor for input
 * resizeBy()           Resizes the window by the specified pixels
 * resizeTo()           Resizes the window to the specified width and height
 * scroll()             This method has been replaced by the scrollTo() method.
 * scrollBy()           Scrolls the content by the specified number of pixels
 * scrollTo()           Scrolls the content to the specified coordinates
 * setInterval()        Calls a function or evaluates an expression at specified intervals (in milliseconds)
 * setTimeout()         Calls a function or evaluates an expression after a specified number of milliseconds
 * stop()               Stops the window from loading
 */

/* global window: true, setTimeout: false, clearTimeout: false, SITEHOST: false */


var web = {};

/*
 * We must defer loading the Component module until the function(s) requiring it are
 * called; otherwise, we create an initialization cycle in which Component requires weblib
 * and weblib requires Component.
 *
 * In an ideal world, weblib would not be dependent on Component, but we really want to use
 * its I/O functions.  The simplest solution is to create wrapper functions.
 */

/**
 * log(s, type)
 *
 * For diagnostic output only.  DEBUG must be true (or "--debug" specified via the command-line)
 * for Component.log() to display anything.
 *
 * @param {string} [s] is the message text
 * @param {string} [type] is the message type
 */
web.log = function(s, type)
{
    Component.log(s, type);
};

/**
 * notice(s, fPrintOnly, id)
 *
 * If Component.notice() calls web.alertUser(), it will fall back to web.log() if all else fails.
 *
 * @param {string} s is the message text
 * @param {boolean} [fPrintOnly]
 * @param {string} [id] is the caller's ID, if any
 */
web.notice = function(s, fPrintOnly, id)
{
    Component.notice(s, fPrintOnly, id);
};

/**
 * getResource(sURL, dataPost, fAsync, done)
 *
 * Request the specified resource (sURL), and once the request is complete, notify done().
 *
 * Also, if dataPost is set to a string, that string can be used to control the response format;
 * by default, the response format is plain text, but you can specify "bytes" to request arbitrary
 * binary data, which should come back as a string of bytes.
 *
 * TODO: The "bytes" option works by calling overrideMimeType(), which was never a best practice.
 * Instead, we should implement supported response types ("text" and "arraybuffer", at a minimum)
 * by setting xmlHTTP.responseType to one of those values before calling xmlHTTP.send().
 *
 * @param {string} sURL
 * @param {string|Object|null} [dataPost] for a POST request (default is a GET request)
 * @param {boolean} [fAsync] is true for an asynchronous request
 * @param {function(string,string,number)} [done]
 * @return {Array|null} Array containing [sResource, nErrorCode], or null if no response yet
 */
web.getResource = function(sURL, dataPost, fAsync, done)
{
    var nErrorCode = 0, sResource = null, response = null;

    if (typeof resources == 'object' && (sResource = resources[sURL])) {
        if (done) done(sURL, sResource, nErrorCode);
        return [sResource, nErrorCode];
    }
    else if (fAsync && typeof resources == 'function') {
        resources(sURL, function(sResource, nErrorCode) {
            if (done) done(sURL, sResource, nErrorCode);
        });
        return response;
    }

    if (DEBUG) {
        /*
         * The larger resources that we put on archive.pcjs.org should also be available locally...
         */
        sURL = sURL.replace("http://archive.pcjs.org", "");
    }


    var xmlHTTP = (window.XMLHttpRequest? new window.XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP"));
    if (fAsync) {
        xmlHTTP.onreadystatechange = function() {
            if (xmlHTTP.readyState === 4) {
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
                if (xmlHTTP.status == 200 || !xmlHTTP.status && sResource.length && web.getHostProtocol() == "file:") {
                    if (MAXDEBUG) web.log("xmlHTTP.onreadystatechange(" + sURL + "): returned " + sResource.length + " bytes");
                }
                else {
                    nErrorCode = xmlHTTP.status || -1;
                    web.log("xmlHTTP.onreadystatechange(" + sURL + "): error code " + nErrorCode);
                }
                if (done) done(sURL, sResource, nErrorCode);
            }
        };
    }

    if (dataPost && typeof dataPost == "object") {
        var sDataPost = "";
        for (var p in dataPost) {
            if (!dataPost.hasOwnProperty(p)) continue;
            if (sDataPost) sDataPost += "&";
            sDataPost += p + '=' + encodeURIComponent(dataPost[p]);
        }
        sDataPost = sDataPost.replace(/%20/g, '+');
        if (MAXDEBUG) web.log("web.getResource(POST " + sURL + "): " + sDataPost.length + " bytes");
        xmlHTTP.open("POST", sURL, !!fAsync);   // ensure that fAsync is a valid boolean (Internet Explorer xmlHTTP functions insist on it)
        xmlHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHTTP.send(sDataPost);
    } else {
        if (MAXDEBUG) web.log("web.getResource(GET " + sURL + ")");
        xmlHTTP.open("GET", sURL, !!fAsync);    // ensure that fAsync is a valid boolean (Internet Explorer xmlHTTP functions insist on it)
        if (dataPost == "bytes") {
            xmlHTTP.overrideMimeType("text/plain; charset=x-user-defined");
        }
        xmlHTTP.send();
    }

    if (!fAsync) {
        sResource = xmlHTTP.responseText;
        if (xmlHTTP.status == 200) {
            if (MAXDEBUG) web.log("web.getResource(" + sURL + "): returned " + sResource.length + " bytes");
        } else {
            nErrorCode = xmlHTTP.status || -1;
            web.log("web.getResource(" + sURL + "): error code " + nErrorCode);
        }
        if (done) done(sURL, sResource, nErrorCode);
        response = [sResource, nErrorCode];
    }
    return response;
};

/**
 * sendReport(sApp, sVer, sURL, sUser, sType, sReport, sHostName)
 *
 * Send a report (eg, bug report) to the server.
 *
 * @param {string} sApp (eg, "PCjs")
 * @param {string} sVer (eg, "1.02")
 * @param {string} sURL (eg, "/devices/pc/machine/5150/mda/64kb/machine.xml")
 * @param {string} sUser (ie, the user key, if any)
 * @param {string} sType (eg, "bug"); one of ReportAPI.TYPE.*
 * @param {string} sReport (eg, unparsed state data)
 * @param {string} [sHostName] (default is http://SITEHOST)
 */
web.sendReport = function(sApp, sVer, sURL, sUser, sType, sReport, sHostName)
{
    var dataPost = {};
    dataPost[ReportAPI.QUERY.APP] = sApp;
    dataPost[ReportAPI.QUERY.VER] = sVer;
    dataPost[ReportAPI.QUERY.URL] = sURL;
    dataPost[ReportAPI.QUERY.USER] = sUser;
    dataPost[ReportAPI.QUERY.TYPE] = sType;
    dataPost[ReportAPI.QUERY.DATA] = sReport;
    var sReportURL = (sHostName? sHostName : "http://" + SITEHOST) + ReportAPI.ENDPOINT;
    web.getResource(sReportURL, dataPost, true);
};

/**
 * getHost()
 *
 * @return {string}
 */
web.getHost = function()
{
    return ("http://" + (window? window.location.host : SITEHOST));
};

/**
 * getHostURL()
 *
 * @return {string|null}
 */
web.getHostURL = function()
{
    return (window? window.location.href : null);
};

/**
 * getHostProtocol()
 *
 * @return {string}
 */
web.getHostProtocol = function()
{
    return (window? window.location.protocol : "file:");
};

/**
 * getUserAgent()
 *
 * @return {string}
 */
web.getUserAgent = function()
{
    return (window? window.navigator.userAgent : "");
};

/**
 * alertUser(sMessage)
 *
 * @param {string} sMessage
 */
web.alertUser = function(sMessage)
{
    if (window) window.alert(sMessage); else web.log(sMessage);
};

/**
 * confirmUser(sPrompt)
 *
 * @param {string} sPrompt
 * @returns {boolean} true if the user clicked OK, false if Cancel/Close
 */
web.confirmUser = function(sPrompt)
{
    var fResponse = false;
    if (window) {
        fResponse = window.confirm(sPrompt);
    }
    return fResponse;
};

/**
 * promptUser()
 *
 * @param {string} sPrompt
 * @param {string} [sDefault]
 * @returns {string|null}
 */
web.promptUser = function(sPrompt, sDefault)
{
    var sResponse = null;
    if (window) {
        sResponse = window.prompt(sPrompt, sDefault === undefined? "" : sDefault);
    }
    return sResponse;
};

/**
 * fLocalStorage
 *
 * true if localStorage support exists, is enabled, and works; "falsey" otherwise
 *
 * @type {boolean|null}
 */
web.fLocalStorage = null;

/**
 * TODO: Is there any way to get the Closure Compiler to stop inlining this string?  This
 * isn't cutting it.
 *
 * @const {string}
 */
web.sLocalStorageTest = "PCjs.localStorage";

/**
 * hasLocalStorage
 *
 * true if localStorage support exists, is enabled, and works; false otherwise
 *
 * @return {boolean}
 */
web.hasLocalStorage = function() {
    if (web.fLocalStorage == null) {
        var f = false;
        if (window) {
            try {
                window.localStorage.setItem(web.sLocalStorageTest, web.sLocalStorageTest);
                f = (window.localStorage.getItem(web.sLocalStorageTest) == web.sLocalStorageTest);
                window.localStorage.removeItem(web.sLocalStorageTest);
            } catch(e) {
                web.logLocalStorageError(e);
                f = false;
            }
        }
        web.fLocalStorage = f;
    }
    return web.fLocalStorage;
};

/**
 * logLocalStorageError(e)
 *
 * @param {Error} e is an exception
 */
web.logLocalStorageError = function(e)
{
    web.log(e.message, "localStorage error");
};

/**
 * getLocalStorageItem(sKey)
 *
 * Returns the requested key value, or null if the key does not exist, or undefined if localStorage is not available
 *
 * @param {string} sKey
 * @return {string|null|undefined} sValue
 */
web.getLocalStorageItem = function(sKey)
{
    var sValue;
    if (window) {
        try {
            sValue = window.localStorage.getItem(sKey);
        } catch(e) {
            web.logLocalStorageError(e);
        }
    }
    return sValue;
};

/**
 * setLocalStorageItem(sKey, sValue)
 *
 * @param {string} sKey
 * @param {string} sValue
 * @return {boolean} true if localStorage is available, false if not
 */
web.setLocalStorageItem = function(sKey, sValue)
{
    try {
        window.localStorage.setItem(sKey, sValue);
        return true;
    } catch(e) {
        web.logLocalStorageError(e);
    }
    return false;
};

/**
 * removeLocalStorageItem(sKey)
 *
 * @param {string} sKey
 */
web.removeLocalStorageItem = function(sKey)
{
    try {
        window.localStorage.removeItem(sKey);
    } catch(e) {
        web.logLocalStorageError(e);
    }
};

/**
 * getLocalStorageKeys()
 *
 * @return {Array}
 */
web.getLocalStorageKeys = function()
{
    var a = [];
    try {
        for (var i = 0, c = window.localStorage.length; i < c; i++) {
            a.push(window.localStorage.key(i));
        }
    } catch(e) {
        web.logLocalStorageError(e);
    }
    return a;
};

/**
 * reloadPage()
 */
web.reloadPage = function()
{
    if (window) window.location.reload();
};

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
 * That's a nice idea, but in the meantime, they hosed the XSL transform code in embed.js, which contained
 * some very critical browser-specific code; turning on IE's "Compatibility Mode" didn't help either, because
 * that's a sledgehammer solution which restores the old user-agent string but also disables other features like
 * HTML5 canvas support. As an interim solution, I'm treating any "MSIE" check as a check for either "MSIE" or
 * "Trident".
 *
 * UPDATE: I've since found ways to make the code in embed.js more browser-agnostic, so for now, there's isn't
 * any code that cares about "MSIE", but I've left the change in place, because I wouldn't be surprised if I'll
 * need more IE-specific code in the future, perhaps for things like copy/paste functionality, or mouse capture.
 *
 * @param {string} s is a substring to search for in the user-agent; as noted above, "iOS" and "MSIE" are special values
 * @return {boolean} is true if the string was found, false if not
 */
web.isUserAgent = function(s)
{
    if (window) {
        var userAgent = web.getUserAgent();
        /*
         * Here's one case where we have to be careful with Component, because when isUserAgent() is called by
         * the init code below, component.js hasn't been loaded yet.  The simple solution for now is to remove the call.
         *
         *      web.log("agent: " + userAgent);
         *
         * And yes, it would be pointless to use the conditional (?) operator below, if not for the Google Closure
         * Compiler (v20130823) failing to detect the entire expression as a boolean.
         */
        return (s == "iOS" && userAgent.match(/(iPod|iPhone|iPad)/) && userAgent.match(/AppleWebKit/) || s == "MSIE" && userAgent.match(/(MSIE|Trident)/) || (userAgent.indexOf(s) >= 0))? true : false;
    }
    return false;
};

/**
 * isMobile()
 *
 * Check the browser's user-agent string for the substring "Mobi", as per Mozilla recommendation:
 *
 *      https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
 *
 * @return {boolean} is true if the browser appears to be a mobile (ie, non-desktop) web browser, false if not
 */
web.isMobile = function()
{
    return web.isUserAgent("Mobi");
};

/**
 * getURLParameters(sParms)
 *
 * @param {string} [sParms] containing the parameter portion of a URL (ie, after the '?')
 * @return {Object} containing properties for each parameter found
 */
web.getURLParameters = function(sParms)
{
    var aParms = {};
    if (window) {       // an alternative to "if (typeof module === 'undefined')" if require("defines") was used
        if (!sParms) {
            /*
             * Note that window.location.href returns the entire URL, whereas window.location.search
             * returns only the parameters, if any (starting with the '?', which we skip over with a substr() call).
             */
            sParms = window.location.search.substr(1);
        }
        var match;
        var pl = /\+/g; // RegExp for replacing addition symbol with a space
        var search = /([^&=]+)=?([^&]*)/g;
        var decode = function(s) { return decodeURIComponent(s.replace(pl, " ")); };

        while ((match = search.exec(sParms))) {
            aParms[decode(match[1])] = decode(match[2]);
        }
    }
    return aParms;
};

/**
 * downloadFile(sData, sType, fBase64, sFileName)
 *
 * @param {string} sData
 * @param {string} sType
 * @param {boolean} [fBase64]
 * @param {string} [sFileName]
 */
web.downloadFile = function(sData, sType, fBase64, sFileName)
{
    var link = null, sAlert;
    var sURI = "data:application/" + sType + (fBase64? ";base64" : "") + ",";

    if (!web.isUserAgent("Firefox")) {
        sURI += (fBase64? sData : encodeURI(sData));
    } else {
        sURI += (fBase64? sData : encodeURIComponent(sData));
    }
    if (sFileName) {
        link = document.createElement('a');
        if (typeof link.download != 'string') link = null;
    }
    if (link) {
        link.href = sURI;
        link.download = sFileName;
        document.body.appendChild(link);    // Firefox allegedly requires the link to be in the body
        link.click();
        document.body.removeChild(link);
        sAlert = 'Check your Downloads folder for ' + sFileName + '.';
    } else {
        window.open(sURI);
        sAlert = 'Check your browser for a new window/tab containing the requested data' + (sFileName? (' (' + sFileName + ')') : '') + '.';
    }
    return sAlert;
};

/**
 * onCountRepeat(n, fnRepeat, fnComplete, msDelay)
 *
 * Call fnRepeat() n times with an msDelay millisecond delay between calls,
 * then call fnComplete() when n has been exhausted OR fnRepeat() returns false.
 *
 * @param {number} n
 * @param {function()} fnRepeat
 * @param {function()} fnComplete
 * @param {number} [msDelay]
 */
web.onCountRepeat = function(n, fnRepeat, fnComplete, msDelay)
{
    var fnTimeout = function doCountRepeat() {
        n -= 1;
        if (n >= 0) {
            if (!fnRepeat()) n = 0;
        }
        if (n > 0) {
            setTimeout(fnTimeout, msDelay || 0);
            return;
        }
        fnComplete();
    };
    fnTimeout();
};

/**
 * onClickRepeat(e, msDelay, msRepeat, fn)
 *
 * Repeatedly call fn() with an initial msDelay, and an msRepeat delay thereafter,
 * as long as HTML control Object e has an active "down" event and fn() returns true.
 *
 * @param {Object} e
 * @param {number} msDelay
 * @param {number} msRepeat
 * @param {function(boolean)} fn is passed false on the first call, true on all repeated calls
 */
web.onClickRepeat = function(e, msDelay, msRepeat, fn)
{
    var ms = 0, timer = null, fIgnoreMouseEvents = false;

    var fnRepeat = function doClickRepeat() {
        if (fn(ms === msRepeat)) {
            timer = setTimeout(fnRepeat, ms);
            ms = msRepeat;
        }
    };
    e.onmousedown = function() {
        // web.log("onMouseDown()");
        if (!fIgnoreMouseEvents) {
            if (!timer) {
                ms = msDelay;
                fnRepeat();
            }
        }
    };
    e.ontouchstart = function() {
        // web.log("onTouchStart()");
        if (!timer) {
            ms = msDelay;
            fnRepeat();
        }
    };
    e.onmouseup = e.onmouseout = function() {
        // web.log("onMouseUp()/onMouseOut()");
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };
    e.ontouchend = e.ontouchcancel = function() {
        // web.log("onTouchEnd()/onTouchCancel()");
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        /*
         * Devices that generate ontouch* events ALSO generate onmouse* events,
         * and generally do so immediately after all the touch events are complete,
         * so unless we want double the action, we need to ignore mouse events.
         */
        fIgnoreMouseEvents = true;
    };
};

web.aPageEventHandlers = {
    'init': [],         // list of window 'onload' handlers
    'show': [],         // list of window 'onpageshow' handlers
    'exit': []          // list of window 'onunload' handlers (although we prefer to use 'onbeforeunload' if possible)
};

web.fPageReady = false; // set once the browser's first page initialization has occurred
web.fPageEventsEnabled = true;

/**
 * onPageEvent(sName, fn)
 *
 * @param {string} sFunc
 * @param {function()} fn
 *
 * Use this instead of setting window['onload'], window['onunload'], etc.
 * Allows multiple JavaScript modules to define a handler for the same event.
 *
 * Moreover, it's risky to refer to obscure event handlers with "dot" names, because
 * the Closure Compiler may erroneously replace them (eg, window.onpageshow is a good example).
 */
web.onPageEvent = function(sFunc, fn)
{
    if (window) {
        var fnPrev = window[sFunc];
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
};

/**
 * onInit(fn)
 *
 * @param {function()} fn
 *
 * Use this instead of setting window.onload.  Allows multiple JavaScript modules to define their own 'onload' event handler.
 */
web.onInit = function(fn)
{
    web.aPageEventHandlers['init'].push(fn);
};

/**
 * onShow(fn)
 *
 * @param {function()} fn
 *
 * Use this instead of setting window.onpageshow.  Allows multiple JavaScript modules to define their own 'onpageshow' event handler.
 */
web.onShow = function(fn)
{
    web.aPageEventHandlers['show'].push(fn);
};

/**
 * onExit(fn)
 *
 * @param {function()} fn
 *
 * Use this instead of setting window.onunload.  Allows multiple JavaScript modules to define their own 'onunload' event handler.
 */
web.onExit = function(fn)
{
    web.aPageEventHandlers['exit'].push(fn);
};

/**
 * doPageEvent(afn)
 *
 * @param {Array.<function()>} afn
 */
web.doPageEvent = function(afn)
{
    if (web.fPageEventsEnabled) {
        try {
            for (var i = 0; i < afn.length; i++) {
                afn[i]();
            }
        } catch(e) {
            web.notice("An unexpected exception occurred:\n\n" + e.message + "\n\nPlease send this information to support@pcjs.org. Thanks.");
        }
    }
};

/**
 * enablePageEvents(fEnable)
 *
 * @param {boolean} fEnable is true to enable page events, false to disable (they're enabled by default)
 */
web.enablePageEvents = function(fEnable)
{
    if (!web.fPageEventsEnabled && fEnable) {
        web.fPageEventsEnabled = true;
        if (web.fPageReady) web.sendPageEvent('init');
        return;
    }
    web.fPageEventsEnabled = fEnable;
};

/**
 * sendPageEvent(sEvent)
 *
 * This allows us to manually trigger page events.
 *
 * @param {string} sEvent (one of 'init', 'show' or 'exit')
 */
web.sendPageEvent = function(sEvent)
{
    if (web.aPageEventHandlers[sEvent]) {
        web.doPageEvent(web.aPageEventHandlers[sEvent]);
    }
};

web.onPageEvent('onload', function onPageLoad() { web.fPageReady = true; web.doPageEvent(web.aPageEventHandlers['init']); });
web.onPageEvent('onpageshow', function onPageShow() { web.doPageEvent(web.aPageEventHandlers['show']); });
web.onPageEvent(web.isUserAgent("Opera") || web.isUserAgent("iOS")? 'onunload' : 'onbeforeunload', function onPageUnload() { web.doPageEvent(web.aPageEventHandlers['exit']); });


// ./modules/shared/lib/component.js

/**
 * @fileoverview The Component class used by C1Pjs and PCx86.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-May-14
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

/*
 * All the C1Pjs and PCjs components now use JSDoc types, primarily so that Google's Closure Compiler
 * will compile everything with ZERO warnings.  For more information about the JSDoc types supported by
 * the Closure Compiler:
 *
 *      https://developers.google.com/closure/compiler/docs/js-for-compiler#types
 *
 * I also attempted to use JSLint, but it's excessively strict for my taste, so this is the only file
 * I tried massaging for JSLint's sake.  I gave up when it complained about my use of "while (true)";
 * replacing "true" with an assignment expression didn't make it any happier.
 *
 * I wasn't thrilled about replacing all "++" and "--" operators with "+= 1" and "-= 1", nor about using
 * "(s || '')" instead of "(s? s : '')", because while the former may seem simpler, it is NOT more portable.
 * It's not that I'm trying to write "portable JavaScript", but some of this code was ported from C code I'd
 * written about 14 years earlier, and portability is good, so I'm not going to rewrite if there's no need.
 *
 * UPDATE: I've since switched to JSHint, which seems to have more reasonable defaults.
 */

/* global window: true, DEBUG: true */


/**
 * Component(type, parms, constructor, bitsMessage)
 *
 * A Component object requires:
 *
 *      type: a user-defined type name (eg, "CPU")
 *
 * and accepts any or all of the following (parms) properties:
 *
 *      id: component ID (default is "")
 *      name: component name (default is ""; if blank, toString() will use the type name only)
 *      comment: component comment string (default is undefined)
 *
 * Subclasses that use Component.subclass() to extend Component will likely have additional (parms) properties.
 *
 * @constructor
 * @param {string} type
 * @param {Object} [parms]
 * @param {Object} [constructor]
 * @param {number} [bitsMessage] selects message(s) that the component wants to enable (default is 0)
 */
function Component(type, parms, constructor, bitsMessage)
{
    this.type = type;

    if (!parms) parms = {'id': "", 'name': ""};

    this.id = parms['id'];
    this.name = parms['name'];
    this.comment = parms['comment'];
    this.parms = parms;
    if (this.id === undefined) this.id = "";

    var i = this.id.indexOf('.');
    if (i > 0) {
        this.idMachine = this.id.substr(0, i);
        this.idComponent = this.id.substr(i + 1);
    } else {
        this.idComponent = this.id;
    }

    /*
     * Recording the constructor is really just a debugging aid, because many of our constructors
     * have class constants, but they're hard to find when the constructors are buried among all the
     * other globals.
     */
    this[type] = constructor;

    /*
     * Gather all the various component flags (booleans) into a single "flags" object, and encourage
     * subclasses to do the same, to reduce the property clutter we have to wade through while debugging.
     */
    this.flags = {
        fReady: false,
        fBusy: false,
        fBusyCancel: false,
        fPowered: false,
        fError: false
    };

    this.fnReady = null;
    this.clearError();
    this.bindings = {};
    this.dbg = null;                    // by default, no connection to a Debugger
    this.bitsMessage = bitsMessage || 0;

    /*
     * TODO: Consider adding another parameter to the Component() constructor that allows components to tell
     * us if they support single or multiple instances per machine.  For example, there can be multiple SerialPort
     * components per machine, but only one CPU component (well, OK, an FPU is also supported, but that's considered
     * a different component).
     *
     * It's not critical, but it would help catch machine configuration errors; for example, a machine that mistakenly
     * includes two CPU components may, aside from wasting memory, end up with odd side-effects, like unresponsive
     * CPU controls.
     */
    Component.add(this);
}

/**
 * Component.parmsURL
 *
 * Initialized to the set of URL parameters, if any, for the current web page.
 *
 * @type {Object}
 */
Component.parmsURL = web.getURLParameters();

/**
 * Component.inherit(p)
 *
 * Returns a newly created object that inherits properties from the prototype object p.
 * It uses the ECMAScript 5 function Object.create() if it is defined, and otherwise falls back to an older technique.
 *
 * See: Flanagan, David (2011-04-18). JavaScript: The Definitive Guide: The Definitive Guide (Kindle Locations 9854-9903). OReilly Media - A. Kindle Edition (Example 6-1)
 *
 * @param {Object} p
 */
Component.inherit = function(p)
{
    if (window) {
        if (!p) throw new TypeError();
        if (Object.create) {
            return Object.create(p);
        }
        var t = typeof p;
        if (t !== "object" && t !== "function") throw new TypeError();
    }
    /**
     * @constructor
     */
    function F() {}
    F.prototype = p;
    return new F();
};

/**
 * Component.extend(o, p)
 *
 * Copies the enumerable properties of p to o and returns o.
 * If o and p have a property by the same name, o's property is overwritten.
 *
 * See: Flanagan, David (2011-04-18). JavaScript: The Definitive Guide: The Definitive Guide (Kindle Locations 9854-9903). OReilly Media - A. Kindle Edition (Example 6-2)
 *
 * @param {Object} o
 * @param {Object} p
 */
Component.extend = function(o, p)
{
    for (var prop in p) {
        o[prop] = p[prop];
    }
    return o;
};

/**
 * Component.subclass(subclass, superclass, methods, statics)
 *
 * See: Flanagan, David (2011-04-18). JavaScript: The Definitive Guide: The Definitive Guide (Kindle Locations 9854-9903). OReilly Media - A. Kindle Edition (Example 9-11)
 *
 * @param {Object} subclass is the constructor for the new subclass
 * @param {Object} [superclass] is the constructor of the superclass (default is Component)
 * @param {Object} [methods] contains all instance methods
 * @param {Object} [statics] contains all class properties and methods
 */
Component.subclass = function(subclass, superclass, methods, statics)
{
    if (!superclass) superclass = Component;
    subclass.prototype = Component.inherit(superclass.prototype);
    subclass.prototype.constructor = subclass;
    subclass.prototype.parent = superclass.prototype;
    if (methods) {
        Component.extend(subclass.prototype, methods);
    }
    if (statics) {
        Component.extend(subclass, statics);
    }
    return subclass;
};

/*
 * Every component created on the current page is recorded in this array (see Component.add()).
 *
 * This enables any component to locate another component by ID (see Component.getComponentByID())
 * or by type (see Component.getComponentByType()).
 */
Component.components = [];

/**
 * Component.add(component)
 *
 * @param {Component} component
 */
Component.add = function(component)
{
    /*
     * This just generates a lot of useless noise, handy in the early days, not so much these days....
     *
     *      if (DEBUG) Component.log("Component.add(" + component.type + "," + component.id + ")");
     */
    Component.components.push(component);
};

/*
 * Every machine on the page are now recorded as well, by their machine ID.  We then record the various resources
 * used by that machine.
 */
Component.machines = {};

/**
 * Component.addMachine(idMachine)
 *
 * @param {string} idMachine
 */
Component.addMachine = function(idMachine)
{
    Component.machines[idMachine] = {};
};

/**
 * Component.addMachineResource(idMachine, sName, data)
 *
 * @param {string} idMachine
 * @param {string|null} sName (name of the resource)
 * @param {*} data
 */
Component.addMachineResource = function(idMachine, sName, data)
{
    /*
     * I used to assert(Component.machines[idMachine]), but when we're running as a Node app, embed.js is not used,
     * so addMachine() is never called, so resources do not need to be recorded.
     */
    if (Component.machines[idMachine] && sName) {
        Component.machines[idMachine][sName] = data;
    }
};

/**
 * Component.getMachineResources(idMachine)
 *
 * @param {string} idMachine
 * @return {Object|undefined}
 */
Component.getMachineResources = function(idMachine)
{
    return Component.machines[idMachine];
};

/**
 * Component.log(s, type)
 *
 * For diagnostic output only.
 *
 * @param {string} [s] is the message text
 * @param {string} [type] is the message type
 */
Component.log = function(s, type)
{
    if (DEBUG) {
        if (s) {
            var sElapsed = "", sMsg = (type? (type + ": ") : "") + s;
            if (typeof usr != "undefined") {
                if (Component.msStart === undefined) {
                    Component.msStart = usr.getTime();
                }
                sElapsed = (usr.getTime() - Component.msStart) + "ms: ";
            }
            if (window && window.console) console.log(sElapsed + sMsg.replace(/\n/g, " "));
        }
    }
};

/**
 * Component.assert(f, s)
 *
 * Verifies conditions that must be true (for DEBUG builds only).
 *
 * The Closure Compiler should automatically remove all references to Component.assert() in non-DEBUG builds.
 *
 * TODO: Add a task to the build process that "asserts" there are no instances of "assertion failure" in RELEASE builds.
 *
 * @param {boolean} f is the expression we are asserting to be true
 * @param {string} [s] is description of the assertion on failure
 */
Component.assert = function(f, s)
{
    if (DEBUG) {
        if (!f) {
            if (!s) s = "assertion failure";
            Component.log(s);
            throw new Error(s);
        }
    }
};

/**
 * Component.println(s, type, id)
 *
 * For non-diagnostic messages, which components may override to control the destination/appearance of their output.
 *
 * Components that inherit from this class should use the instance method, this.println(), rather than Component.println(),
 * because if a Control Panel is loaded, it will override only the instance method, not the class method (overriding the class
 * method would improperly affect any other machines loaded on the same page).
 *
 * @param {string} [s] is the message text
 * @param {string} [type] is the message type
 * @param {string} [id] is the caller's ID, if any
 */
Component.println = function(s, type, id)
{
    if (DEBUG) {
        Component.log((id? (id + ": ") : "") + (s? ("\"" + s + "\"") : ""), type);
    }
};

/**
 * Component.notice(s, fPrintOnly, id)
 *
 * notice() is like println() but implies a need for user notification, so we alert() as well.
 *
 * @param {string} s is the message text
 * @param {boolean} [fPrintOnly]
 * @param {string} [id] is the caller's ID, if any
 */
Component.notice = function(s, fPrintOnly, id)
{
    if (DEBUG) {
        Component.println(s, "notice", id);
    }
    if (!fPrintOnly) web.alertUser(s);
};

/**
 * Component.warning(s)
 *
 * @param {string} s describes the warning
 */
Component.warning = function(s)
{
    if (DEBUG) {
        Component.println(s, "warning");
    }
    web.alertUser(s);
};

/**
 * Component.error(s)
 *
 * @param {string} s describes the error; an alert() is displayed as well
 */
Component.error = function(s)
{
    if (DEBUG) {
        Component.println(s, "error");
    }
    web.alertUser(s);
};

/**
 * Component.getComponents(idRelated)
 *
 * We could store components as properties, using the component's ID, and change
 * this linear lookup into a property lookup, but some components may have no ID.
 *
 * @param {string} [idRelated] of related component
 * @return {Array} of components
 */
Component.getComponents = function(idRelated)
{
    var i;
    var aComponents = [];
    /*
     * getComponentByID(id, idRelated)
     *
     * If idRelated is provided, we check it for a machine prefix, and use any
     * existing prefix to constrain matches to IDs with the same prefix, in order to
     * avoid matching components belonging to other machines.
     */
    if (idRelated) {
        if ((i = idRelated.indexOf('.')) > 0)
            idRelated = idRelated.substr(0, i + 1);
        else
            idRelated = "";
    }
    for (i = 0; i < Component.components.length; i++) {
        var component = Component.components[i];
        if (!idRelated || !component.id.indexOf(idRelated)) {
            aComponents.push(component);
        }
    }
    return aComponents;
};

/**
 * Component.getComponentByID(id, idRelated)
 *
 * We could store components as properties, using the component's ID, and change
 * this linear lookup into a property lookup, but some components may have no ID.
 *
 * @param {string} id of the desired component
 * @param {string} [idRelated] of related component
 * @return {Component|null}
 */
Component.getComponentByID = function(id, idRelated)
{
    if (id !== undefined) {
        var i;
        /*
         * If idRelated is provided, we check it for a machine prefix, and use any
         * existing prefix to constrain matches to IDs with the same prefix, in order to
         * avoid matching components belonging to other machines.
         */
        if (idRelated && (i = idRelated.indexOf('.')) > 0) {
            id = idRelated.substr(0, i + 1) + id;
        }
        for (i = 0; i < Component.components.length; i++) {
            if (Component.components[i].id === id) {
                return Component.components[i];
            }
        }
        if (Component.components.length) {
            Component.log("Component ID '" + id + "' not found", "warning");
        }
    }
    return null;
};

/**
 * Component.getComponentByType(sType, idRelated, componentPrev)
 *
 * @param {string} sType of the desired component
 * @param {string} [idRelated] of related component
 * @param {Component|null} [componentPrev] of previously returned component, if any
 * @return {Component|null}
 */
Component.getComponentByType = function(sType, idRelated, componentPrev)
{
    if (sType !== undefined) {
        var i;
        /*
         * If idRelated is provided, we check it for a machine prefix, and use any
         * existing prefix to constrain matches to IDs with the same prefix, in order to
         * avoid matching components belonging to other machines.
         */
        if (idRelated) {
            if ((i = idRelated.indexOf('.')) > 0) {
                idRelated = idRelated.substr(0, i + 1);
            } else {
                idRelated = "";
            }
        }
        for (i = 0; i < Component.components.length; i++) {
            if (componentPrev) {
                if (componentPrev == Component.components[i]) componentPrev = null;
                continue;
            }
            if (sType == Component.components[i].type && (!idRelated || !Component.components[i].id.indexOf(idRelated))) {
                return Component.components[i];
            }
        }
        Component.log("Component type '" + sType + "' not found", "warning");
    }
    return null;
};

/**
 * Component.getComponentParms(element)
 *
 * @param {Object} element from the DOM
 */
Component.getComponentParms = function(element)
{
    var parms = null;
    var sParms = element.getAttribute("data-value");
    if (sParms) {
        try {
            parms = eval("(" + sParms + ")");   // jshint ignore:line
            /*
             * We can no longer invoke removeAttribute() because some components (eg, Panel) need
             * to run their initXXX() code more than once, to avoid initialization-order dependencies.
             *
             *      if (!DEBUG) {
             *          element.removeAttribute("data-value");
             *      }
             */
        } catch(e) {
            Component.error(e.message + " (" + sParms + ")");
        }
    }
    return parms;
};

/**
 * Component.bindExternalControl(component, sControl, sBinding, sType)
 *
 * @param {Component} component
 * @param {string} sControl
 * @param {string} sBinding
 * @param {string} [sType] is the external component type
 */
Component.bindExternalControl = function(component, sControl, sBinding, sType)
{
    if (sControl) {
        if (sType === undefined) sType = "Panel";
        var target = Component.getComponentByType(sType, component.id);
        if (target) {
            var eBinding = target.bindings[sControl];
            if (eBinding) {
                component.setBinding(null, sBinding, eBinding);
            }
        }
    }
};

/**
 * Component.bindComponentControls(component, element, sAppClass)
 *
 * @param {Component} component
 * @param {Object} element from the DOM
 * @param {string} sAppClass
 */
Component.bindComponentControls = function(component, element, sAppClass)
{
    var aeControls = Component.getElementsByClass(element.parentNode, sAppClass + "-control");

    for (var iControl = 0; iControl < aeControls.length; iControl++) {

        var aeChildNodes = aeControls[iControl].childNodes;

        for (var iNode = 0; iNode < aeChildNodes.length; iNode++) {
            var control = aeChildNodes[iNode];
            if (control.nodeType !== 1 /* document.ELEMENT_NODE */) {
                continue;
            }
            var sClass = control.getAttribute("class");
            if (!sClass) continue;
            var aClasses = sClass.split(" ");
            for (var iClass = 0; iClass < aClasses.length; iClass++) {
                var parms;
                sClass = aClasses[iClass];
                switch (sClass) {
                    case sAppClass + "-binding":
                        parms = Component.getComponentParms(control);
                        if (parms && parms['binding']) {
                            component.setBinding(parms['type'], parms['binding'], control, parms['value']);
                        } else if (!parms || parms['type'] != "description") {
                            Component.log("Component '" + component.toString() + "' missing binding" + (parms? " for " + parms['type'] : ""), "warning");
                        }
                        iClass = aClasses.length;
                        break;
                    default:
                        // if (DEBUG) Component.log("Component.bindComponentControls(" + component.toString() + "): unrecognized control class \"" + sClass + "\"", "warning");
                        break;
                }
            }
        }
    }
};

/**
 * Component.getElementsByClass(element, sClass, sObjClass)
 *
 * This is a cross-browser helper function, since not all browser's support getElementsByClassName()
 *
 * TODO: This should probably be moved into weblib.js at some point, along with the control binding functions above,
 * to keep all the browser-related code together.
 *
 * @param {Object} element from the DOM
 * @param {string} sClass
 * @param {string} [sObjClass]
 * @return {Array|NodeList}
 */
Component.getElementsByClass = function(element, sClass, sObjClass)
{
    if (sObjClass) sClass += '-' + sObjClass + "-object";
    /*
     * Use the browser's built-in getElementsByClassName() if it appears to be available
     * (for example, it's not available in IE8, but it should be available in IE9 and up)
     */
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(sClass);
    }
    var i, j, ae = [];
    var aeAll = element.getElementsByTagName("*");
    var re = new RegExp('(^| )' + sClass + '( |$)');
    for (i = 0, j = aeAll.length; i < j; i++) {
        if (re.test(aeAll[i].className)) {
            ae.push(aeAll[i]);
        }
    }
    if (!ae.length) {
        Component.log('No elements of class "' + sClass + '" found');
    }
    return ae;
};

Component.prototype = {
    constructor: Component,
    parent: null,
    /**
     * toString()
     *
     * @this {Component}
     * @return {string}
     */
    toString: function() {
        return (this.name? this.name : (this.id || this.type));
    },
    /**
     * getMachineNum()
     *
     * @this {Component}
     * @return {number} unique machine number
     */
    getMachineNum: function() {
        var nMachine = 1;
        if (this.idMachine) {
            var aDigits = this.idMachine.match(/\d+/);
            if (aDigits !== null)
                nMachine = parseInt(aDigits[0], 10);
        }
        return nMachine;
    },
    /**
     * setBinding(sHTMLType, sBinding, control, sValue)
     *
     * Component's setBinding() method is intended to be overridden by subclasses.
     *
     * @this {Component}
     * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding: function(sHTMLType, sBinding, control, sValue) {
        switch (sBinding) {
        case "clear":
            if (!this.bindings[sBinding]) {
                this.bindings[sBinding] = control;
                control.onclick = (function(component) {
                    return function clearPanel() {
                        if (component.bindings['print']) {
                            component.bindings['print'].value = "";
                        }
                    };
                }(this));
            }
            return true;
        case "print":
            if (!this.bindings[sBinding]) {
                this.bindings[sBinding] = control;
                /*
                 * HACK: Save this particular HTML element so that the Debugger can access it, too
                 */
                this.controlPrint = control;
                /*
                 * This was added for Firefox (Safari automatically clears the <textarea> on a page reload,
                 * but Firefox does not).
                 */
                control.value = "";
                this.println = (function(control) {
                    return function printPanel(s, type) {
                        s = (type !== undefined? (type + ": ") : "") + (s || "");
                        /*
                         * Prevent the <textarea> from getting too large; otherwise, printing becomes slower and slower.
                         */
                        if (COMPILED) {
                            if (control.value.length > 8192) {
                                control.value = control.value.substr(control.value.length - 4096);
                            }
                        }
                        control.value += s + "\n";
                        control.scrollTop = control.scrollHeight;
                        if (DEBUG && window && window.console) console.log(s);
                    };
                }(control));
                /**
                 * Override this.notice() with a replacement function that eliminates the web.alertUser() call
                 *
                 * @this {Component}
                 * @param {string} s
                 * @param {boolean} [fPrintOnly]
                 * @param {string} [id]
                 */
                this.notice = function noticePanel(s, fPrintOnly, id) {
                    this.println(s, "notice", id);
                };
            }
            return true;
        default:
            return false;
        }
    },
    /**
     * log(s, type)
     *
     * For diagnostic output only.
     *
     * WARNING: Even though this function's body is completely wrapped in DEBUG, that won't prevent the Closure Compiler
     * from including it, so all calls must still be prefixed with "if (DEBUG) ....".  For this reason, the class method,
     * Component.log(), is preferred, because the compiler IS smart enough to remove those calls.
     *
     * @this {Component}
     * @param {string} [s] is the message text
     * @param {string} [type] is the message type
     */
    log: function(s, type) {
        if (DEBUG) {
            Component.log(s, type || this.id || this.type);
        }
    },
    /**
     * assert(f, s)
     *
     * Verifies conditions that must be true (for DEBUG builds only).
     *
     * WARNING: Make sure you preface all calls to this.assert() with "if (DEBUG)", because unlike Component.assert(),
     * the Closure Compiler can't be sure that this instance method hasn't been overridden, so it refuses to treat it as
     * dead code in non-DEBUG builds.
     *
     * TODO: Add a task to the build process that "asserts" there are no instances of "assertion failure" in RELEASE builds.
     *
     * @this {Component}
     * @param {boolean} f is the expression we are asserting to be true
     * @param {string} [s] is description of the assertion on failure
     */
    assert: function(f, s) {
        if (DEBUG) {
            if (!f) {
                s = "assertion failure in " + (this.id || this.type) + (s? ": " + s : "");
                if (DEBUGGER && this.dbg) {
                    this.dbg.stopCPU();
                    /*
                     * Why do we throw an Error only to immediately catch and ignore it?  Simply to give
                     * any IDE the opportunity to inspect the application's state.  Even when the IDE has
                     * control, you should still be able to invoke Debugger commands from the IDE's REPL,
                     * using the '$' global function that the Debugger constructor defines; eg:
                     *
                     *      $('r')
                     *      $('dw 0:0')
                     *      $('h')
                     *      ...
                     *
                     * If you have no desire to stop on assertions, consider this a no-op.  However, another
                     * potential benefit of creating an Error object is that, for browsers like Chrome, we get
                     * a stack trace, too.
                     */
                    try {
                        throw new Error(s);
                    } catch(e) {
                        this.println(e.stack || e.message);
                    }
                    return;
                }
                this.log(s);
                throw new Error(s);
            }
        }
    },
    /**
     * println(s, type)
     *
     * For non-diagnostic messages, which components may override to control the destination/appearance of their output.
     *
     * Components using this.println() should wait until after their constructor has run to display any messages, because
     * if a Control Panel has been loaded, its override will not take effect until its own constructor has run.
     *
     * @this {Component}
     * @param {string} [s] is the message text
     * @param {string} [type] is the message type
     * @param {string} [id] is the caller's ID, if any
     */
    println: function(s, type, id) {
        Component.println(s, type, id || this.id);
    },
    /**
     * status(s)
     *
     * status() is like println() but it also includes information about the component (ie, the component ID),
     * which is why there is no corresponding Component.status() function.
     *
     * @param {string} s is the message text
     */
    status: function(s) {
        this.println(this.idComponent + ": " + s);
    },
    /**
     * notice(s, fPrintOnly)
     *
     * notice() is like println() but implies a need for user notification, so we alert() as well; however, if this.println()
     * is overridden, this.notice will be replaced with a similar override, on the assumption that the override is taking care
     * of alerting the user.
     *
     * @this {Component}
     * @param {string} s is the message text
     * @param {boolean} [fPrintOnly]
     * @param {string} [id] is the caller's ID, if any
     */
    notice: function(s, fPrintOnly, id) {
        Component.notice(s, fPrintOnly, id || this.id);
    },
    /**
     * setError(s)
     *
     * Set a fatal error condition
     *
     * @this {Component}
     * @param {string} s describes a fatal error condition
     */
    setError: function(s) {
        this.flags.fError = true;
        this.notice(s);         // TODO: Any cases where we should still prefix this string with "Fatal error: "?
    },
    /**
     * clearError()
     *
     * Clear any fatal error condition
     *
     * @this {Component}
     */
    clearError: function() {
        this.flags.fError = false;
    },
    /**
     * isError()
     *
     * Report any fatal error condition
     *
     * @this {Component}
     * @return {boolean} true if a fatal error condition exists, false if not
     */
    isError: function() {
        if (this.flags.fError) {
            this.println(this.toString() + " error");
            return true;
        }
        return false;
    },
    /**
     * isReady(fnReady)
     *
     * Return the "ready" state of the component; if the component is not ready, it will queue the optional
     * notification function, otherwise it will immediately call the notification function, if any, without queuing it.
     *
     * NOTE: Since only the Computer component actually cares about the "readiness" of other components, the so-called
     * "queue" of notification functions supports exactly one function.  This keeps things nice and simple.
     *
     * @this {Component}
     * @param {function()} [fnReady]
     * @return {boolean} true if the component is in a "ready" state, false if not
     */
    isReady: function(fnReady) {
        if (fnReady) {
            if (this.flags.fReady) {
                fnReady();
            } else {
                if (MAXDEBUG) this.log("NOT ready");
                this.fnReady = fnReady;
            }
        }
        return this.flags.fReady;
    },
    /**
     * setReady(fReady)
     *
     * Set the "ready" state of the component to true, and call any queued notification functions.
     *
     * @this {Component}
     * @param {boolean} [fReady] is assumed to indicate "ready" unless EXPLICITLY set to false
     */
    setReady: function(fReady) {
        if (!this.flags.fError) {
            this.flags.fReady = (fReady !== false);
            if (this.flags.fReady) {
                if (MAXDEBUG /* || this.name */) this.log("ready");
                var fnReady = this.fnReady;
                this.fnReady = null;
                if (fnReady) fnReady();
            }
        }
    },
    /**
     * isBusy(fCancel)
     *
     * Return the "busy" state of the component
     *
     * @this {Component}
     * @param {boolean} [fCancel] is set to true to cancel a "busy" state
     * @return {boolean} true if "busy", false if not
     */
    isBusy: function(fCancel) {
        if (this.flags.fBusy) {
            if (fCancel) {
                this.flags.fBusyCancel = true;
            } else if (fCancel === undefined) {
                this.println(this.toString() + " busy");
            }
        }
        return this.flags.fBusy;
    },
    /**
     * setBusy(fBusy)
     *
     * Update the current busy state; if an fCancel request is pending, it will be honored now.
     *
     * @this {Component}
     * @param {boolean} fBusy
     * @return {boolean}
     */
    setBusy: function(fBusy) {
        if (this.flags.fBusyCancel) {
            if (this.flags.fBusy) {
                this.flags.fBusy = false;
            }
            this.flags.fBusyCancel = false;
            return false;
        }
        if (this.flags.fError) {
            this.println(this.toString() + " error");
            return false;
        }
        this.flags.fBusy = fBusy;
        return this.flags.fBusy;
    },
    /**
     * powerUp(fSave)
     *
     * @this {Component}
     * @param {Object|null} data
     * @param {boolean} [fRepower] is true if this is "repower" notification
     * @return {boolean} true if successful, false if failure
     */
    powerUp: function(data, fRepower) {
        this.flags.fPowered = true;
        return true;
    },
    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {Component}
     * @param {boolean} fSave
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown: function(fSave, fShutdown) {
        if (fShutdown) this.flags.fPowered = false;
        return true;
    },
    /**
     * messageEnabled(bitsMessage)
     *
     * If bitsMessage is not specified, the component's MESSAGE category is used.
     *
     * @this {Component}
     * @param {number} [bitsMessage] is zero or more MESSAGE_* category flag(s)
     * @return {boolean} true if all specified message enabled, false if not
     */
    messageEnabled: function(bitsMessage) {
        if (DEBUGGER && this.dbg) {
            if (this === this.dbg) {
                bitsMessage |= 0;
            } else {
                bitsMessage = bitsMessage || this.bitsMessage;
            }
            var bitsEnabled = this.dbg.bitsMessage & bitsMessage;
            return (!!bitsMessage && bitsEnabled === bitsMessage || !!(bitsEnabled & this.dbg.bitsWarning));
        }
        return false;
    },
    /**
     * printMessage(sMessage, bitsMessage, fAddress)
     *
     * If bitsMessage is not specified, the component's MESSAGE category is used.
     * If bitsMessage is true, the message is displayed regardless.
     *
     * @this {Component}
     * @param {string} sMessage is any caller-defined message string
     * @param {number|boolean} [bitsMessage] is zero or more MESSAGE_* category flag(s)
     * @param {boolean} [fAddress] is true to display the current address
     */
    printMessage: function(sMessage, bitsMessage, fAddress) {
        if (DEBUGGER && this.dbg) {
            if (bitsMessage === true || this.messageEnabled(bitsMessage | 0)) {
                this.dbg.message(sMessage, fAddress);
            }
        }
    },
    /**
     * printMessageIO(port, bOut, addrFrom, name, bIn, bitsMessage)
     *
     * If bitsMessage is not specified, the component's MESSAGE category is used.
     * If bitsMessage is true, the message is displayed as long as MESSAGE.PORT is enabled.
     *
     * @this {Component}
     * @param {number} port
     * @param {number|null} bOut if an output operation
     * @param {number|null} [addrFrom]
     * @param {string|null} [name] of the port, if any
     * @param {number|null} [bIn] is the input value, if known, on an input operation
     * @param {number|boolean} [bitsMessage] is zero or more MESSAGE_* category flag(s)
     */
    printMessageIO: function(port, bOut, addrFrom, name, bIn, bitsMessage) {
        if (DEBUGGER && this.dbg) {
            if (bitsMessage === true) {
                bitsMessage = 0;
            } else if (bitsMessage == null) {
                bitsMessage = this.bitsMessage;
            }
            this.dbg.messageIO(this, port, bOut, addrFrom, name, bIn, bitsMessage);
        }
    }
};


// ./modules/pc8080/lib/defines.js

/**
 * @fileoverview PC8080-specific compile-time definitions.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
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

/**
 * @define {string}
 */
var APPCLASS = "pc8080";        // this @define is the default application class (eg, "pcx86", "c1pjs")

/**
 * @define {string}
 */
var APPNAME = "PC8080";         // this @define is the default application name (eg, "PCx86", "C1Pjs")

/**
 * @define {boolean}
 *
 * WARNING: DEBUGGER needs to accurately reflect whether or not the Debugger component is (or will be) loaded.
 * In the compiled case, we rely on the Closure Compiler to override DEBUGGER as appropriate.  When it's *false*,
 * nearly all of debugger.js will be conditionally removed by the compiler, reducing it to little more than a
 * "type skeleton", which also solves some type-related warnings we would otherwise have if we tried to remove
 * debugger.js from the compilation process altogether.
 *
 * However, when we're in "development mode" and running uncompiled code in debugger-less configurations,
 * I would like to skip loading debugger.js altogether.  When doing that, we must ALSO arrange for an additional file
 * (nodebugger.js) to be loaded immediately after this file, which *explicitly* overrides DEBUGGER with *false*.
 */
var DEBUGGER = true;            // this @define is overridden by the Closure Compiler to remove Debugger-related support

/**
 * @define {boolean}
 *
 * BYTEARRAYS is a Closure Compiler compile-time option that allocates an Array of numbers for every Memory block,
 * where each a number represents ONE byte; very wasteful, but potentially slightly faster.
 *
 * See the Memory component for details.
 */
var BYTEARRAYS = false;

/**
 * TYPEDARRAYS enables use of typed arrays for Memory blocks.  This used to be a compile-time-only option, but I've
 * added Memory access functions for typed arrays (see Memory.afnTypedArray), so support can be enabled dynamically now.
 *
 * See the Memory component for details.
 */
var TYPEDARRAYS = (typeof ArrayBuffer !== 'undefined');

/*
 * Combine all the shared globals and machine-specific globals into one machine-specific global object,
 * which all machine components should start using; eg: "if (PC8080.DEBUG) ..." instead of "if (DEBUG) ...".
 */
var PC8080 = {
    APPCLASS:    APPCLASS,
    APPNAME:     APPNAME,
    APPVERSION:  APPVERSION,    // shared
    BYTEARRAYS:  BYTEARRAYS,
    COMPILED:    COMPILED,      // shared
    CSSCLASS:    CSSCLASS,      // shared
    DEBUG:       DEBUG,         // shared
    DEBUGGER:    DEBUGGER,
    MAXDEBUG:    MAXDEBUG,      // shared
    PRIVATE:     PRIVATE,       // shared
    TYPEDARRAYS: TYPEDARRAYS,
    SITEHOST:    SITEHOST,      // shared
    XMLVERSION:  XMLVERSION     // shared
}


// ./modules/pc8080/lib/cpudef.js

/**
 * @fileoverview Defines PC8080 CPU constants.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
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

var CPUDef = {
    /*
     * CPU model numbers (supported)
     */
    MODEL_8080: 8080,

    /*
     * This constant is used to mark points in the code where the physical address being returned
     * is invalid and should not be used.
     *
     * In a 32-bit CPU, -1 (ie, 0xffffffff) could actually be a valid address, so consider changing
     * ADDR_INVALID to NaN or null (which is also why all ADDR_INVALID tests should use strict equality
     * operators).
     *
     * The main reason I'm NOT using NaN or null now is my concern that, by mixing non-numbers
     * (specifically, values outside the range of signed 32-bit integers), performance may suffer.
     *
     * WARNING: Like many of the properties defined here, ADDR_INVALID is a common constant, which the
     * Closure Compiler will happily inline (with or without @const annotations; in fact, I've yet to
     * see a @const annotation EVER improve automatic inlining).  However, if you don't make ABSOLUTELY
     * certain that this file is included BEFORE the first reference to any of these properties, that
     * automatic inlining will no longer occur.
     */
    ADDR_INVALID: -1,

    /*
     * Processor Status flag definitions (stored in regPS)
     */
    PS: {
        CF:     0x0001,         // bit 0: Carry flag
        BIT1:   0x0002,         // bit 1: reserved, always set
        PF:     0x0004,         // bit 2: Parity flag
        BIT3:   0x0008,         // bit 3: reserved, always clear
        AF:     0x0010,         // bit 4: Auxiliary Carry flag
        BIT5:   0x0020,         // bit 5: reserved, always clear
        ZF:     0x0040,         // bit 6: Zero flag
        SF:     0x0080,         // bit 7: Sign flag
        ALL:    0x00D5,         // all "arithmetic" flags (CF, PF, AF, ZF, SF)
        MASK:   0x00FF,         //
        IF:     0x0200          // bit 9: Interrupt flag (set if interrupts enabled; for internal use only)
    },
    PARITY:  [                  // 256-byte array with a 1 wherever the number of set bits of the array index is EVEN
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
    ],
    /*
     * Interrupt-related flags (stored in intFlags)
     */
    INTFLAG: {
        NONE:       0x00,
        INTL:       0x07,       // last interrupt level requested
        INTR:       0x08,       // set if interrupt has been requested
        HALT:       0x10        // halt requested; see opHLT()
    },
    /*
     * Opcode definitions
     */
    OPCODE: {
        HLT:    0x76,           // Halt
        ACI:    0xCE,           // Add with Carry Immediate (affects PS.ALL)
        CALL:   0xCD,           // Call
        RST0:   0xC7
        // to be continued....
    }
};

/*
 * These are the internal PS bits (outside of PS.MASK) that getPS() and setPS() can get and set,
 * but which cannot be seen with any of the documented instructions.
 */
CPUDef.PS.INTERNAL  =   (CPUDef.PS.IF);

/*
 * PS "arithmetic" flags are NOT stored in regPS; they are maintained across separate result registers,
 * hence the RESULT designation.
 */
CPUDef.PS.RESULT    =   (CPUDef.PS.CF | CPUDef.PS.PF | CPUDef.PS.AF | CPUDef.PS.ZF | CPUDef.PS.SF);

/*
 * These are the "always set" PS bits for the 8080.
 */
CPUDef.PS.SET       =   (CPUDef.PS.BIT1);


// ./modules/pc8080/lib/messages.js

/**
 * @fileoverview Defines message categories.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
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

var Messages = {
    CPU:        0x00000001,
    BUS:        0x00000040,
    MEM:        0x00000080,
    PORT:       0x00000100,
    CHIPSET:    0x00008000,
    KEYBOARD:   0x00010000,
    KEYS:       0x00020000,
    VIDEO:      0x00040000,
    FDC:        0x00080000,
    DISK:       0x00200000,
    SERIAL:     0x00800000,
    SPEAKER:    0x02000000,
    COMPUTER:   0x04000000,
    LOG:        0x10000000,
    WARN:       0x20000000,
    BUFFER:     0x40000000,
    HALT:       0x80000000|0
};


// ./modules/pc8080/lib/panel.js

/**
 * @fileoverview Implements the PC8080 Panel component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-19
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


/**
 * Panel(parmsPanel)
 *
 * The Panel component has no required (parmsPanel) properties.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsPanel
 */
function Panel(parmsPanel)
{
    Component.call(this, "Panel", parmsPanel, Panel);
}

Component.subclass(Panel);

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * Most panel layouts don't have bindings of their own, so we pass along all binding requests to the
 * Computer, CPU, Keyboard and Debugger components first.  The order shouldn't matter, since any component
 * that doesn't recognize the specified binding should simply ignore it.
 *
 * @this {Panel}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Panel.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    if (this.cmp && this.cmp.setBinding(sHTMLType, sBinding, control, sValue)) return true;
    if (this.cpu && this.cpu.setBinding(sHTMLType, sBinding, control, sValue)) return true;
    if (this.kbd && this.kbd.setBinding(sHTMLType, sBinding, control, sValue)) return true;
    if (DEBUGGER && this.dbg && this.dbg.setBinding(sHTMLType, sBinding, control, sValue)) return true;
    return this.parent.setBinding.call(this, sHTMLType, sBinding, control, sValue);
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {Panel}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger} dbg
 */
Panel.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.kbd = cmp.getMachineComponent("Keyboard");
};

/**
 * powerUp(data, fRepower)
 *
 * @this {Panel}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
Panel.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) Panel.init();
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {Panel}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
Panel.prototype.powerDown = function(fSave, fShutdown)
{
    return true;
};

/**
 * updateStatus(fForce)
 *
 * Update function for Panels containing elements with high-frequency display requirements.
 *
 * For older (and slower) DOM-based display elements, those are sill being managed by the CPUState component,
 * so it has its own updateStatus() handler.
 *
 * The Computer's updateStatus() handler is currently responsible for calling both our handler and the CPU's handler.
 *
 * @this {Panel}
 * @param {boolean} [fForce] (true will display registers even if the CPU is running and "live" registers are not enabled)
 */
Panel.prototype.updateStatus = function(fForce)
{
};

/**
 * Panel.init()
 *
 * This function operates on every HTML element of class "panel", extracting the
 * JSON-encoded parameters for the Panel constructor from the element's "data-value"
 * attribute, invoking the constructor to create a Panel component, and then binding
 * any associated HTML controls to the new component.
 *
 * NOTE: Unlike most other component init() functions, this one is designed to be
 * called multiple times: once at load time, so that we can bind our print()
 * function to the panel's output control ASAP, and again when the Computer component
 * is verifying that all components are ready and invoking their powerUp() functions.
 *
 * Our powerUp() method gives us a second opportunity to notify any components that
 * that might care (eg, CPU, Keyboard, and Debugger) that we have some controls they
 * might want to use.
 */
Panel.init = function()
{
    var fReady = false;
    var aePanels = Component.getElementsByClass(document, PC8080.APPCLASS, "panel");
    for (var iPanel=0; iPanel < aePanels.length; iPanel++) {
        var ePanel = aePanels[iPanel];
        var parmsPanel = Component.getComponentParms(ePanel);
        var panel = Component.getComponentByID(parmsPanel['id']);
        if (!panel) {
            fReady = true;
            panel = new Panel(parmsPanel);
        }
        Component.bindComponentControls(panel, ePanel, PC8080.APPCLASS);
        if (fReady) panel.setReady();
    }
};

/*
 * Initialize every Panel module on the page.
 */
web.onInit(Panel.init);


// ./modules/pc8080/lib/bus.js

/**
 * @fileoverview Implements the PC8080 Bus component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
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


/**
 * Bus(cpu, dbg)
 *
 * The Bus component manages physical memory and I/O address spaces.
 *
 * The Bus component has no UI elements, so it does not require an init() handler,
 * but it still inherits from the Component class and must be allocated like any
 * other device component.  It's currently allocated by the Computer's init() handler,
 * which then calls the initBus() method of all the other components.
 *
 * For memory beyond the simple needs of the ROM and RAM components (ie, memory-mapped
 * devices), the address space must still be allocated through the Bus component via
 * addMemory().  If the component needs something more than simple read/write storage,
 * it must provide a custom controller.
 *
 * All port (I/O) operations are defined by external handlers; they register with us,
 * and we manage those registrations and provide support for I/O breakpoints, but the
 * only default I/O behavior we provide is ignoring writes to any unregistered output
 * ports and returning 0xff from any unregistered input ports.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsBus
 * @param {CPUState} cpu
 * @param {Debugger} dbg
 */
function Bus(parmsBus, cpu, dbg)
{
    Component.call(this, "Bus", parmsBus, Bus);

    this.cpu = cpu;
    this.dbg = dbg;

    this.nBusWidth = parmsBus['busWidth'] || 16;

    /*
     * Compute all Bus memory block parameters, based on the width of the bus.
     *
     * Regarding blockTotal, we want to avoid using block overflow expressions like:
     *
     *      iBlock < this.nBlockTotal? iBlock : 0
     *
     * As long as we know that blockTotal is a power of two (eg, 256 or 0x100, in the case of
     * nBusWidth == 20 and blockSize == 4096), we can define blockMask as (blockTotal - 1) and
     * rewrite the previous expression as:
     *
     *      iBlock & this.nBlockMask
     *
     *      Bus Property        Old hard-coded values (when nBusWidth was always 20)
     *      ------------        ----------------------------------------------------
     *      this.nBusLimit      0xfffff
     *      this.nBusMask       [same as busLimit]
     *      this.nBlockSize     4096
     *      this.nBlockLen      (this.nBlockSize >> 2)
     *      this.nBlockShift    12
     *      this.nBlockLimit    0xfff
     *      this.nBlockTotal    ((this.nBusLimit + this.nBlockSize) / this.nBlockSize) | 0
     *      this.nBlockMask     (this.nBlockTotal - 1) [ie, 0xff]
     *
     * Note that we choose a nBlockShift value (and thus a physical memory block size) based on "buswidth":
     *
     *      Bus Width                       Block Shift     Block Size
     *      ---------                       -----------     ----------
     *      16 bits (64Kb address space):   10              1Kb (64 maximum blocks)
     *      20 bits (1Mb address space):    12              4Kb (256 maximum blocks)
     *      24 bits (16Mb address space):   14              16Kb (1K maximum blocks)
     *      32 bits (4Gb address space);    15              32Kb (128K maximum blocks)
     *
     * The coarser block granularities (ie, 16Kb and 32Kb) may cause problems for certain RAM and/or ROM
     * allocations that are contiguous but are allocated out of order, or that have different controller
     * requirements.  Your choices, for the moment, are either to ensure the allocations are performed in
     * order, or to choose smaller nBlockShift values (at the expense of a generating a larger block array).
     */
    this.addrTotal = Math.pow(2, this.nBusWidth);
    this.nBusLimit = this.nBusMask = (this.addrTotal - 1) | 0;
    this.nBlockShift = (this.nBusWidth <= 16)? 10 : ((this.nBusWidth <= 20)? 12 : (this.nBusWidth <= 24? 14 : 15));
    this.nBlockSize = 1 << this.nBlockShift;
    this.nBlockLen = this.nBlockSize >> 2;
    this.nBlockLimit = this.nBlockSize - 1;
    this.nBlockTotal = (this.addrTotal / this.nBlockSize) | 0;
    this.nBlockMask = this.nBlockTotal - 1;


    /*
     * Lists of I/O notification functions: aPortInputNotify and aPortOutputNotify are arrays, indexed by
     * port, of sub-arrays which contain:
     *
     *      [0]: registered function to call for every I/O access
     *
     * The registered function is called with the port address, and if the access was triggered by the CPU,
     * the instruction pointer (IP) at the point of access.
     *
     * WARNING: Unlike the (old) read and write memory notification functions, these support only one
     * pair of input/output functions per port.  A more sophisticated architecture could support a list
     * of chained functions across multiple components, but I doubt that will be necessary here.
     *
     * UPDATE: The Debugger now piggy-backs on these arrays to indicate ports for which it wants notification
     * of I/O.  In those cases, the registered component/function elements may or may not be set, but the
     * following additional element will be set:
     *
     *      [1]: true to break on I/O, false to ignore I/O
     *
     * The false case is important if fPortInputBreakAll and/or fPortOutputBreakAll is set, because it allows the
     * Debugger to selectively ignore specific ports.
     */
    this.aPortInputNotify = [];
    this.aPortOutputNotify = [];
    this.fPortInputBreakAll = this.fPortOutputBreakAll = false;

    /*
     * By default, all I/O ports are 1 byte wide; ports that are wider must add themselves to one or both of
     * these lists, using addPortInputWidth() and/or addPortOutputWidth().
     */
    this.aPortInputWidth = [];
    this.aPortOutputWidth = [];

    /*
     * Allocate empty Memory blocks to span the entire physical address space.
     */
    this.initMemory();

    this.setReady();
}

Component.subclass(Bus);

Bus.ERROR = {
    ADD_MEM_INUSE:      1,
    ADD_MEM_BADRANGE:   2,
    SET_MEM_BADRANGE:   4,
    REM_MEM_BADRANGE:   5
};

/**
 * @typedef {number}
 */
var BlockInfo;

/**
 * This defines the BlockInfo bit fields used by scanMemory() when it creates the aBlocks array.
 *
 * @typedef {{
 *  num:    BitField,
 *  count:  BitField,
 *  btmod:  BitField,
 *  type:   BitField
 * }}
 */
Bus.BlockInfo = usr.defineBitFields({num:20, count:8, btmod:1, type:3});

/**
 * BusInfo object definition (returned by scanMemory())
 *
 *  cbTotal:    total bytes allocated
 *  cBlocks:    total Memory blocks allocated
 *  aBlocks:    array of allocated Memory block numbers
 *
 * @typedef {{
 *  cbTotal:    number,
 *  cBlocks:    number,
 *  aBlocks:    Array.<BlockInfo>
 * }}
 */
var BusInfo;

/**
 * initMemory()
 *
 * Allocate enough (empty) Memory blocks to span the entire physical address space.
 *
 * @this {Bus}
 */
Bus.prototype.initMemory = function()
{
    var block = new Memory();
    block.copyBreakpoints(this.dbg);
    this.aMemBlocks = new Array(this.nBlockTotal);
    for (var iBlock = 0; iBlock < this.nBlockTotal; iBlock++) {
        this.aMemBlocks[iBlock] = block;
    }
};

/**
 * reset()
 *
 * @this {Bus}
 */
Bus.prototype.reset = function()
{
};

/**
 * powerUp(data, fRepower)
 *
 * We don't need a powerDown() handler, because for largely historical reasons, our state is saved by saveMemory(),
 * which called by the CPU.
 *
 * However, we do need a powerUp() handler, because on resumable machines, the Computer's onReset() function calls
 * everyone's powerUp() handler rather than their reset() handler.
 *
 * TODO: Perhaps Computer should be smarter: if there's no powerUp() handler, then fallback to the reset() handler.
 * In that case, however, we'd either need to remove the powerUp() stub in Component, or detect the existence of the stub.
 *
 * @this {Bus}
 * @param {Object|null} data (always null because we supply no powerDown() handler)
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
Bus.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) this.reset();
    return true;
};

/**
 * addMemory(addr, size, type)
 *
 * Adds new Memory blocks to the specified address range.  Any Memory blocks previously
 * added to that range must first be removed via removeMemory(); otherwise, you'll get
 * an allocation conflict error.  This helps prevent address calculation errors, redundant
 * allocations, etc.
 *
 * We've relaxed some of the original requirements (ie, that addresses must start at a
 * block-granular address, or that sizes must be equal to exactly one or more blocks),
 * because machines with large block sizes can make it impossible to load certain ROMs at
 * their required addresses.  Every allocation still allocates a whole number of blocks.
 *
 * Even so, Bus memory management does NOT provide a general-purpose heap.  Most memory
 * allocations occur during machine initialization and never change.  In particular, there
 * is NO support for removing partial-block allocations.
 *
 * Each Memory block keeps track of a start address (addr) and length (used), indicating
 * the used space within the block; any free space that precedes or follows that used space
 * can be allocated later, by simply extending the beginning or ending of the previously used
 * space.  However, any holes that might have existed between the original allocation and an
 * extension are subsumed by the extension.
 *
 * @this {Bus}
 * @param {number} addr is the starting physical address of the request
 * @param {number} size of the request, in bytes
 * @param {number} type is one of the Memory.TYPE constants
 * @return {boolean} true if successful, false if not
 */
Bus.prototype.addMemory = function(addr, size, type)
{
    var addrNext = addr;
    var sizeLeft = size;
    var iBlock = addrNext >>> this.nBlockShift;

    while (sizeLeft > 0 && iBlock < this.aMemBlocks.length) {

        var block = this.aMemBlocks[iBlock];
        var addrBlock = iBlock * this.nBlockSize;
        var sizeBlock = this.nBlockSize - (addrNext - addrBlock);
        if (sizeBlock > sizeLeft) sizeBlock = sizeLeft;

        if (block && block.size) {
            if (block.type == type) {
                /*
                 * Where there is already a similar block with a non-zero size, we allow the allocation only if:
                 *
                 *   1) addrNext + sizeLeft <= block.addr (the request precedes the used portion of the current block), or
                 *   2) addrNext >= block.addr + block.used (the request follows the used portion of the current block)
                 */
                if (addrNext + sizeLeft <= block.addr) {
                    block.used += (block.addr - addrNext);
                    block.addr = addrNext;
                    return true;
                }
                if (addrNext >= block.addr + block.used) {
                    var sizeAvail = block.size - (addrNext - addrBlock);
                    if (sizeAvail > sizeLeft) sizeAvail = sizeLeft;
                    block.used = addrNext - block.addr + sizeAvail;
                    addrNext = addrBlock + this.nBlockSize;
                    sizeLeft -= sizeAvail;
                    iBlock++;
                    continue;
                }
            }
            return this.reportError(Bus.ERROR.ADD_MEM_INUSE, addrNext, sizeLeft);
        }

        var blockNew = new Memory(addrNext, sizeBlock, this.nBlockSize, type);
        blockNew.copyBreakpoints(this.dbg, block);
        this.aMemBlocks[iBlock++] = blockNew;

        addrNext = addrBlock + this.nBlockSize;
        sizeLeft -= sizeBlock;
    }

    if (sizeLeft <= 0) {
        this.status(Math.floor(size / 1024) + "Kb " + Memory.TYPE.NAMES[type] + " at " + str.toHexWord(addr));
        return true;
    }

    return this.reportError(Bus.ERROR.ADD_MEM_BADRANGE, addr, size);
};

/**
 * cleanMemory(addr, size)
 *
 * @this {Bus}
 * @param {number} addr
 * @param {number} size
 * @return {boolean} true if all blocks were clean, false if dirty; all blocks are cleaned in the process
 */
Bus.prototype.cleanMemory = function(addr, size)
{
    var fClean = true;
    var iBlock = addr >>> this.nBlockShift;
    while (size > 0 && iBlock < this.aMemBlocks.length) {
        if (this.aMemBlocks[iBlock].fDirty) {
            this.aMemBlocks[iBlock].fDirty = fClean = false;
            this.aMemBlocks[iBlock].fDirtyEver = true;
        }
        size -= this.nBlockSize;
        iBlock++;
    }
    return fClean;
};

/**
 * scanMemory(info, addr, size)
 *
 * Returns a BusInfo object for the specified address range.
 *
 * @this {Bus}
 * @param {Object} [info] previous BusInfo, if any
 * @param {number} [addr] starting address of range (0 if none provided)
 * @param {number} [size] size of range, in bytes (up to end of address space if none provided)
 * @return {Object} updated info (or new info if no previous info provided)
 */
Bus.prototype.scanMemory = function(info, addr, size)
{
    if (addr == null) addr = 0;
    if (size == null) size = (this.addrTotal - addr) | 0;
    if (info == null) info = {cbTotal: 0, cBlocks: 0, aBlocks: []};

    var iBlock = addr >>> this.nBlockShift;
    var iBlockMax = ((addr + size - 1) >>> this.nBlockShift);

    info.cbTotal = 0;
    info.cBlocks = 0;
    while (iBlock <= iBlockMax) {
        var block = this.aMemBlocks[iBlock];
        info.cbTotal += block.size;
        if (block.size) {
            info.aBlocks.push(usr.initBitFields(Bus.BlockInfo, iBlock, 0, 0, block.type));
            info.cBlocks++
        }
        iBlock++;
    }
    return info;
};

/**
 * getWidth()
 *
 * @this {Bus}
 * @return {number}
 */
Bus.prototype.getWidth = function()
{
    return this.nBusWidth;
};

/**
 * removeMemory(addr, size)
 *
 * Replaces every block in the specified address range with empty Memory blocks that ignore all reads/writes.
 *
 * TODO: Update the removeMemory() interface to reflect the relaxed requirements of the addMemory() interface.
 *
 * @this {Bus}
 * @param {number} addr
 * @param {number} size
 * @return {boolean} true if successful, false if not
 */
Bus.prototype.removeMemory = function(addr, size)
{
    if (!(addr & this.nBlockLimit) && size && !(size & this.nBlockLimit)) {
        var iBlock = addr >>> this.nBlockShift;
        while (size > 0) {
            var blockOld = this.aMemBlocks[iBlock];
            var blockNew = new Memory(addr);
            blockNew.copyBreakpoints(this.dbg, blockOld);
            this.aMemBlocks[iBlock++] = blockNew;
            addr = iBlock * this.nBlockSize;
            size -= this.nBlockSize;
        }
        return true;
    }
    return this.reportError(Bus.ERROR.REM_MEM_BADRANGE, addr, size);
};

/**
 * getMemoryBlocks(addr, size)
 *
 * @this {Bus}
 * @param {number} addr is the starting physical address
 * @param {number} size of the request, in bytes
 * @return {Array} of Memory blocks
 */
Bus.prototype.getMemoryBlocks = function(addr, size)
{
    var aBlocks = [];
    var iBlock = addr >>> this.nBlockShift;
    while (size > 0 && iBlock < this.aMemBlocks.length) {
        aBlocks.push(this.aMemBlocks[iBlock++]);
        size -= this.nBlockSize;
    }
    return aBlocks;
};

/**
 * setMemoryBlocks(addr, size, aBlocks, type)
 *
 * If no type is specified, then specified address range uses all the provided blocks as-is;
 * this form of setMemoryBlocks() is used for complete physical aliases.
 *
 * Otherwise, new blocks are allocated with the specified type; the underlying memory from the
 * provided blocks is still used, but the new blocks may have different access to that memory.
 *
 * @this {Bus}
 * @param {number} addr is the starting physical address
 * @param {number} size of the request, in bytes
 * @param {Array} aBlocks as returned by getMemoryBlocks()
 * @param {number} [type] is one of the Memory.TYPE constants
 */
Bus.prototype.setMemoryBlocks = function(addr, size, aBlocks, type)
{
    var i = 0;
    var iBlock = addr >>> this.nBlockShift;
    while (size > 0 && iBlock < this.aMemBlocks.length) {
        var block = aBlocks[i++];

        if (!block) break;
        if (type !== undefined) {
            var blockNew = new Memory(addr);
            blockNew.clone(block, type, this.dbg);
            block = blockNew;
        }
        this.aMemBlocks[iBlock++] = block;
        size -= this.nBlockSize;
    }
};

/**
 * getByte(addr)
 *
 * @this {Bus}
 * @param {number} addr is a physical address
 * @return {number} byte (8-bit) value at that address
 */
Bus.prototype.getByte = function(addr)
{
    return this.aMemBlocks[(addr & this.nBusMask) >>> this.nBlockShift].readByte(addr & this.nBlockLimit, addr);
};

/**
 * getByteDirect(addr)
 *
 * This is useful for the Debugger and other components that want to bypass getByte() breakpoint detection.
 *
 * @this {Bus}
 * @param {number} addr is a physical address
 * @return {number} byte (8-bit) value at that address
 */
Bus.prototype.getByteDirect = function(addr)
{
    return this.aMemBlocks[(addr & this.nBusMask) >>> this.nBlockShift].readByteDirect(addr & this.nBlockLimit, addr);
};

/**
 * getShort(addr)
 *
 * @this {Bus}
 * @param {number} addr is a physical address
 * @return {number} word (16-bit) value at that address
 */
Bus.prototype.getShort = function(addr)
{
    var off = addr & this.nBlockLimit;
    var iBlock = (addr & this.nBusMask) >>> this.nBlockShift;
    if (off != this.nBlockLimit) {
        return this.aMemBlocks[iBlock].readShort(off, addr);
    }
    return this.aMemBlocks[iBlock++].readByte(off, addr) | (this.aMemBlocks[iBlock & this.nBlockMask].readByte(0, addr + 1) << 8);
};

/**
 * getShortDirect(addr)
 *
 * This is useful for the Debugger and other components that want to bypass getShort() breakpoint detection.
 *
 * @this {Bus}
 * @param {number} addr is a physical address
 * @return {number} word (16-bit) value at that address
 */
Bus.prototype.getShortDirect = function(addr)
{
    var off = addr & this.nBlockLimit;
    var iBlock = (addr & this.nBusMask) >>> this.nBlockShift;
    if (off != this.nBlockLimit) {
        return this.aMemBlocks[iBlock].readShortDirect(off, addr);
    }
    return this.aMemBlocks[iBlock++].readByteDirect(off, addr) | (this.aMemBlocks[iBlock & this.nBlockMask].readByteDirect(0, addr + 1) << 8);
};

/**
 * setByte(addr, b)
 *
 * @this {Bus}
 * @param {number} addr is a physical address
 * @param {number} b is the byte (8-bit) value to write (we truncate it to 8 bits to be safe)
 */
Bus.prototype.setByte = function(addr, b)
{
    this.aMemBlocks[(addr & this.nBusMask) >>> this.nBlockShift].writeByte(addr & this.nBlockLimit, b & 0xff, addr);
};

/**
 * setByteDirect(addr, b)
 *
 * This is useful for the Debugger and other components that want to bypass breakpoint detection AND read-only
 * memory protection (for example, this is an interface the ROM component could use to initialize ROM contents).
 *
 * @this {Bus}
 * @param {number} addr is a physical address
 * @param {number} b is the byte (8-bit) value to write (we truncate it to 8 bits to be safe)
 */
Bus.prototype.setByteDirect = function(addr, b)
{
    this.aMemBlocks[(addr & this.nBusMask) >>> this.nBlockShift].writeByteDirect(addr & this.nBlockLimit, b & 0xff, addr);
};

/**
 * setShort(addr, w)
 *
 * @this {Bus}
 * @param {number} addr is a physical address
 * @param {number} w is the word (16-bit) value to write (we truncate it to 16 bits to be safe)
 */
Bus.prototype.setShort = function(addr, w)
{
    var off = addr & this.nBlockLimit;
    var iBlock = (addr & this.nBusMask) >>> this.nBlockShift;
    if (off != this.nBlockLimit) {
        this.aMemBlocks[iBlock].writeShort(off, w & 0xffff, addr);
        return;
    }
    this.aMemBlocks[iBlock++].writeByte(off, w & 0xff, addr);
    this.aMemBlocks[iBlock & this.nBlockMask].writeByte(0, (w >> 8) & 0xff, addr + 1);
};

/**
 * setShortDirect(addr, w)
 *
 * This is useful for the Debugger and other components that want to bypass breakpoint detection AND read-only
 * memory protection (for example, this is an interface the ROM component could use to initialize ROM contents).
 *
 * @this {Bus}
 * @param {number} addr is a physical address
 * @param {number} w is the word (16-bit) value to write (we truncate it to 16 bits to be safe)
 */
Bus.prototype.setShortDirect = function(addr, w)
{
    var off = addr & this.nBlockLimit;
    var iBlock = (addr & this.nBusMask) >>> this.nBlockShift;
    if (off != this.nBlockLimit) {
        this.aMemBlocks[iBlock].writeShortDirect(off, w & 0xffff, addr);
        return;
    }
    this.aMemBlocks[iBlock++].writeByteDirect(off, w & 0xff, addr);
    this.aMemBlocks[iBlock & this.nBlockMask].writeByteDirect(0, (w >> 8) & 0xff, addr + 1);
};

/**
 * addMemBreak(addr, fWrite)
 *
 * @this {Bus}
 * @param {number} addr
 * @param {boolean} fWrite is true for a memory write breakpoint, false for a memory read breakpoint
 */
Bus.prototype.addMemBreak = function(addr, fWrite)
{
    if (DEBUGGER) {
        var iBlock = addr >>> this.nBlockShift;
        this.aMemBlocks[iBlock].addBreakpoint(addr & this.nBlockLimit, fWrite);
    }
};

/**
 * removeMemBreak(addr, fWrite)
 *
 * @this {Bus}
 * @param {number} addr
 * @param {boolean} fWrite is true for a memory write breakpoint, false for a memory read breakpoint
 */
Bus.prototype.removeMemBreak = function(addr, fWrite)
{
    if (DEBUGGER) {
        var iBlock = addr >>> this.nBlockShift;
        this.aMemBlocks[iBlock].removeBreakpoint(addr & this.nBlockLimit, fWrite);
    }
};

/**
 * saveMemory(fAll)
 *
 * The only memory blocks we save are those marked as dirty, but most likely all of RAM will have been marked dirty,
 * and even if our dirty-memory flags were as smart as our dirty-sector flags (ie, were set only when a write changed
 * what was already there), it's unlikely that would reduce the number of RAM blocks we must save/restore.  At least
 * all the ROM blocks should be clean (except in the unlikely event that the Debugger was used to modify them).
 *
 * All dirty blocks will be stored in a single array, as pairs of block numbers and data arrays, like so:
 *
 *      [iBlock0, [dw0, dw1, ...], iBlock1, [dw0, dw1, ...], ...]
 *
 * In a normal 4Kb block, there will be 1K DWORD values in the data array.  Remember that each DWORD is a signed 32-bit
 * integer (because they are formed using bit-wise operator rather than floating-point math operators), so don't be
 * surprised to see negative numbers in the data.
 *
 * The above example assumes "uncompressed" data arrays.  If we choose to use "compressed" data arrays, the data arrays
 * will look like:
 *
 *      [count0, dw0, count1, dw1, ...]
 *
 * where each count indicates how many times the following DWORD value occurs.  A data array length less than 1K indicates
 * that it's compressed, since we'll only store them in compressed form if they actually shrank, and we'll use State
 * helper methods compress() and decompress() to create and expand the compressed data arrays.
 *
 * @this {Bus}
 * @param {boolean} [fAll] (true to save all non-ROM memory blocks, regardless of their dirty flags)
 * @return {Array} a
 */
Bus.prototype.saveMemory = function(fAll)
{
    var i = 0;
    var a = [];

    for (var iBlock = 0; iBlock < this.nBlockTotal; iBlock++) {
        var block = this.aMemBlocks[iBlock];
        /*
         * We have to check both fDirty and fDirtyEver, because we may have called cleanMemory() on some of
         * the memory blocks (eg, video memory), and while cleanMemory() will clear a dirty block's fDirty flag,
         * it also sets the dirty block's fDirtyEver flag, which is left set for the lifetime of the machine.
         */
        if (fAll && block.type != Memory.TYPE.ROM || block.fDirty || block.fDirtyEver) {
            a[i++] = iBlock;
            a[i++] = State.compress(block.save());
        }
    }

    return a;
};

/**
 * restoreMemory(a)
 *
 * This restores the contents of all Memory blocks; called by CPUState.restore().
 *
 * In theory, we ONLY have to save/restore block contents.  Other block attributes,
 * like the type, the memory controller (if any), and the active memory access functions,
 * should already be restored, since every component (re)allocates all the memory blocks
 * it was using when it's restored.  And since the CPU is guaranteed to be the last
 * component to be restored, all those blocks (and their attributes) should be in place now.
 *
 * See saveMemory() for more information on how the memory block contents are saved.
 *
 * @this {Bus}
 * @param {Array} a
 * @return {boolean} true if successful, false if not
 */
Bus.prototype.restoreMemory = function(a)
{
    var i;
    for (i = 0; i < a.length - 1; i += 2) {
        var iBlock = a[i];
        var adw = a[i+1];
        if (adw && adw.length < this.nBlockLen) {
            adw = State.decompress(adw, this.nBlockLen);
        }
        var block = this.aMemBlocks[iBlock];
        if (!block || !block.restore(adw)) {
            /*
             * Either the block to restore hasn't been allocated, indicating a change in the machine
             * configuration since it was last saved (the most likely explanation) or there's some internal
             * inconsistency (eg, the block size is wrong).
             */
            Component.error("Unable to restore memory block " + iBlock);
            return false;
        }
    }
    return true;
};

/**
 * addPortInputBreak(port)
 *
 * @this {Bus}
 * @param {number} [port]
 * @return {boolean} true if break on port input enabled, false if disabled
 */
Bus.prototype.addPortInputBreak = function(port)
{
    if (port === undefined) {
        this.fPortInputBreakAll = !this.fPortInputBreakAll;
        return this.fPortInputBreakAll;
    }
    if (this.aPortInputNotify[port] === undefined) {
        this.aPortInputNotify[port] = [null, false];
    }
    this.aPortInputNotify[port][1] = !this.aPortInputNotify[port][1];
    return this.aPortInputNotify[port][1];
};

/**
 * addPortInputNotify(start, end, fn)
 *
 * Add a port input-notification handler to the list of such handlers.
 *
 * @this {Bus}
 * @param {number} start port address
 * @param {number} end port address
 * @param {function(number,number)} fn is called with the port and IP values at the time of the input
 */
Bus.prototype.addPortInputNotify = function(start, end, fn)
{
    if (fn !== undefined) {
        for (var port = start; port <= end; port++) {
            if (this.aPortInputNotify[port] !== undefined) {
                Component.warning("Input port " + str.toHexWord(port) + " already registered");
                continue;
            }
            this.aPortInputNotify[port] = [fn, false];
            if (MAXDEBUG) this.log("addPortInputNotify(" + str.toHexWord(port) + ")");
        }
    }
};

/**
 * addPortInputTable(component, table, offset)
 *
 * Add port input-notification handlers from the specified table (a batch version of addPortInputNotify)
 *
 * @this {Bus}
 * @param {Component} component
 * @param {Object} table
 * @param {number} [offset] is an optional port offset
 */
Bus.prototype.addPortInputTable = function(component, table, offset)
{
    if (offset === undefined) offset = 0;
    for (var port in table) {
        this.addPortInputNotify(+port + offset, +port + offset, table[port].bind(component));
    }
};

/**
 * addPortInputWidth(port, size)
 *
 * By default, all input ports are 1 byte wide; ports that are wider must call this function.
 *
 * @this {Bus}
 * @param {number} port
 * @param {number} size (1, 2 or 4)
 */
Bus.prototype.addPortInputWidth = function(port, size)
{
    this.aPortInputWidth[port] = size;
};

/**
 * checkPortInputNotify(port, size, addrIP)
 *
 * @this {Bus}
 * @param {number} port
 * @param {number} size (1, 2 or 4)
 * @param {number} [addrIP] is the IP value at the time of the input
 * @return {number} simulated port data
 *
 * NOTE: It seems that parts of the ROM BIOS (like the RS-232 probes around F000:E5D7 in the 5150 BIOS)
 * assume that ports for non-existent hardware return 0xff rather than 0x00, hence my new default (0xff) below.
 */
Bus.prototype.checkPortInputNotify = function(port, size, addrIP)
{
    var data = 0, shift = 0;

    while (size > 0) {

        var aNotify = this.aPortInputNotify[port];
        var sizePort = this.aPortInputWidth[port] || 1;
        var maskPort = (sizePort == 1? 0xff : (sizePort == 2? 0xffff : -1));
        var dataPort = maskPort;

        /*
         * TODO: We need to decide what to do about 8-bit I/O to a 16-bit port (ditto for 16-bit I/O
         * to a 32-bit port).  We probably should pass the size through to the aNotify[0] handler,
         * and let it decide what to do, but I don't feel like changing all the I/O handlers right now.
         * The good news, at least, is that the 8-bit handlers would not have to do anything special.
         * This assert will warn us if this is a pressing need.
         */


        if (aNotify !== undefined) {
            if (aNotify[0]) {
                dataPort = aNotify[0](port, addrIP);
                if (dataPort === undefined) {
                    dataPort = maskPort;
                } else {
                    dataPort &= maskPort;
                }
            }
            if (DEBUGGER && this.dbg && this.fPortInputBreakAll != aNotify[1]) {
                this.dbg.checkPortInput(port, size, dataPort);
            }
        }
        else {
            if (DEBUGGER && this.dbg) {
                this.dbg.messageIO(this, port, null, addrIP);
                if (this.fPortInputBreakAll) this.dbg.checkPortInput(port, size, dataPort);
            }
        }

        data |= dataPort << shift;
        shift += (sizePort << 3);
        port += sizePort;
        size -= sizePort;
    }


    return data;
};

/**
 * removePortInputNotify(start, end)
 *
 * Remove port input-notification handler(s) (to be ENABLED later if needed)
 *
 * @this {Bus}
 * @param {number} start address
 * @param {number} end address
 *
Bus.prototype.removePortInputNotify = function(start, end)
{
    for (var port = start; port < end; port++) {
        if (this.aPortInputNotify[port]) {
            delete this.aPortInputNotify[port];
        }
    }
};
 */

/**
 * addPortOutputBreak(port)
 *
 * @this {Bus}
 * @param {number} [port]
 * @return {boolean} true if break on port output enabled, false if disabled
 */
Bus.prototype.addPortOutputBreak = function(port)
{
    if (port === undefined) {
        this.fPortOutputBreakAll = !this.fPortOutputBreakAll;
        return this.fPortOutputBreakAll;
    }
    if (this.aPortOutputNotify[port] === undefined) {
        this.aPortOutputNotify[port] = [null, false];
    }
    this.aPortOutputNotify[port][1] = !this.aPortOutputNotify[port][1];
    return this.aPortOutputNotify[port][1];
};

/**
 * addPortOutputNotify(start, end, fn)
 *
 * Add a port output-notification handler to the list of such handlers.
 *
 * @this {Bus}
 * @param {number} start port address
 * @param {number} end port address
 * @param {function(number,number)} fn is called with the port and IP values at the time of the output
 */
Bus.prototype.addPortOutputNotify = function(start, end, fn)
{
    if (fn !== undefined) {
        for (var port = start; port <= end; port++) {
            if (this.aPortOutputNotify[port] !== undefined) {
                Component.warning("Output port " + str.toHexWord(port) + " already registered");
                continue;
            }
            this.aPortOutputNotify[port] = [fn, false];
            if (MAXDEBUG) this.log("addPortOutputNotify(" + str.toHexWord(port) + ")");
        }
    }
};

/**
 * addPortOutputTable(component, table, offset)
 *
 * Add port output-notification handlers from the specified table (a batch version of addPortOutputNotify)
 *
 * @this {Bus}
 * @param {Component} component
 * @param {Object} table
 * @param {number} [offset] is an optional port offset
 */
Bus.prototype.addPortOutputTable = function(component, table, offset)
{
    if (offset === undefined) offset = 0;
    for (var port in table) {
        this.addPortOutputNotify(+port + offset, +port + offset, table[port].bind(component));
    }
};

/**
 * addPortOutputWidth(port, size)
 *
 * By default, all output ports are 1 byte wide; ports that are wider must call this function.
 *
 * @this {Bus}
 * @param {number} port
 * @param {number} size (1, 2 or 4)
 */
Bus.prototype.addPortOutputWidth = function(port, size)
{
    this.aPortOutputWidth[port] = size;
};

/**
 * checkPortOutputNotify(port, size, data, addrIP)
 *
 * @this {Bus}
 * @param {number} port
 * @param {number} size
 * @param {number} data
 * @param {number} [addrIP] is the IP value at the time of the output
 */
Bus.prototype.checkPortOutputNotify = function(port, size, data, addrIP)
{
    var shift = 0;

    while (size > 0) {

        var aNotify = this.aPortOutputNotify[port];
        var sizePort = this.aPortOutputWidth[port] || 1;
        var maskPort = (sizePort == 1? 0xff : (sizePort == 2? 0xffff : -1));
        var dataPort = (data >>>= shift) & maskPort;

        /*
         * TODO: We need to decide what to do about 8-bit I/O to a 16-bit port (ditto for 16-bit I/O
         * to a 32-bit port).  We probably should pass the size through to the aNotify[0] handler,
         * and let it decide what to do, but I don't feel like changing all the I/O handlers right now.
         * The good news, at least, is that the 8-bit handlers would not have to do anything special.
         * This assert will warn us if this is a pressing need.
         */


        if (aNotify !== undefined) {
            if (aNotify[0]) {
                aNotify[0](port, dataPort, addrIP);
            }
            if (DEBUGGER && this.dbg && this.fPortOutputBreakAll != aNotify[1]) {
                this.dbg.checkPortOutput(port, size, dataPort);
            }
        }
        else {
            if (DEBUGGER && this.dbg) {
                this.dbg.messageIO(this, port, dataPort, addrIP);
                if (this.fPortOutputBreakAll) this.dbg.checkPortOutput(port, size, dataPort);
            }
        }

        shift += (sizePort << 3);
        port += sizePort;
        size -= sizePort;
    }

};

/**
 * removePortOutputNotify(start, end)
 *
 * Remove port output-notification handler(s) (to be ENABLED later if needed)
 *
 * @this {Bus}
 * @param {number} start address
 * @param {number} end address
 *
Bus.prototype.removePortOutputNotify = function(start, end)
{
    for (var port = start; port < end; port++) {
        if (this.aPortOutputNotify[port]) {
            delete this.aPortOutputNotify[port];
        }
    }
};
 */

/**
 * reportError(op, addr, size, fQuiet)
 *
 * @this {Bus}
 * @param {number} op
 * @param {number} addr
 * @param {number} size
 * @param {boolean} [fQuiet] (true if any error should be quietly logged)
 * @return {boolean} false
 */
Bus.prototype.reportError = function(op, addr, size, fQuiet)
{
    var sError = "Memory block error (" + op + ": " + str.toHex(addr) + "," + str.toHex(size) + ")";
    if (fQuiet) {
        if (this.dbg) {
            this.dbg.message(sError);
        } else {
            this.log(sError);
        }
    } else {
        Component.error(sError);
    }
    return false;
};


// ./modules/pc8080/lib/memory.js

/**
 * @fileoverview Implements the PC8080 Memory component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
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


/**
 * @class DataView
 * @property {function(number,boolean):number} getUint8
 * @property {function(number,number,boolean)} setUint8
 * @property {function(number,boolean):number} getUint16
 * @property {function(number,number,boolean)} setUint16
 * @property {function(number,boolean):number} getInt32
 * @property {function(number,number,boolean)} setInt32
 */

var littleEndian = (TYPEDARRAYS? (function() {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setUint16(0, 256, true);
    return new Uint16Array(buffer)[0] === 256;
})() : false);

/**
 * Memory(addr, used, size, type)
 *
 * The Bus component allocates Memory objects so that each has a memory buffer with a
 * block-granular starting address and an address range equal to bus.nBlockSize; however,
 * the size of any given Memory object's underlying buffer can be either zero or bus.nBlockSize;
 * memory read/write functions for empty (buffer-less) blocks are mapped to readNone/writeNone.
 *
 * The Bus allocates empty blocks for the entire address space during initialization, so that
 * any reads/writes to undefined addresses will have no effect.  Later, the ROM and RAM
 * components will ask the Bus to allocate memory for specific ranges, and the Bus will allocate
 * as many new blockSize Memory objects as the ranges require.  Partial Memory blocks could
 * also be supported in theory, but in practice, they're not.
 *
 * Because Memory blocks now allow us to have a "sparse" address space, we could choose to
 * take the memory hit of allocating 4K arrays per block, where each element stores only one byte,
 * instead of the more frugal but slightly slower approach of allocating arrays of 32-bit dwords
 * (LONGARRAYS) and shifting/masking bytes/words to/from dwords; in theory, byte accesses would
 * be faster and word accesses somewhat less faster.
 *
 * However, preliminary testing of that feature (BYTEARRAYS) did not yield significantly faster
 * performance, so it is OFF by default to minimize our memory consumption.  Using TYPEDARRAYS
 * would seem best, but as discussed in defines.js, it's off by default, because it doesn't perform
 * as well as LONGARRAYS; the other advantage of TYPEDARRAYS is that it should theoretically use
 * about 1/2 the memory of LONGARRAYS (32-bit elements vs 64-bit numbers), but I value speed over
 * size at this point.  Also, not all JavaScript implementations support TYPEDARRAYS (IE9 is probably
 * the only real outlier: it lacks typed arrays but otherwise has all the necessary HTML5 support).
 *
 * WARNING: Since Memory blocks are low-level objects that have no UI requirements, they
 * do not inherit from the Component class, so if you want to use any Component class methods,
 * such as Component.assert(), use the corresponding Debugger methods instead (assuming a debugger
 * is available).
 *
 * @constructor
 * @param {number|null} [addr] of lowest used address in block
 * @param {number} [used] portion of block in bytes (0 for none); must be a multiple of 4
 * @param {number} [size] of block's buffer in bytes (0 for none); must be a multiple of 4
 * @param {number} [type] is one of the Memory.TYPE constants (default is Memory.TYPE.NONE)
 */
function Memory(addr, used, size, type)
{
    var i;
    this.id = (Memory.idBlock += 2);
    this.adw = null;
    this.offset = 0;
    this.addr = addr;
    this.used = used;
    this.size = size || 0;
    this.type = type || Memory.TYPE.NONE;
    this.fReadOnly = (type == Memory.TYPE.ROM);
    this.copyBreakpoints();     // initialize the block's Debugger info; the caller will reinitialize

    /*
     * TODO: Study the impact of dirty block tracking.  The original purposes were to allow saveMemory()
     * to save only dirty blocks, and to enable the Video component to quickly detect changes to the video buffer.
     * But the benefit to saveMemory() is minimal, and the Video component has other options; for example, it now
     * uses a custom memory controller for all EGA/VGA video modes, which performs its own dirty block tracking,
     * and that could easily be extended to the older MDA/CGA video modes, which still use conventional memory blocks.
     * Alternatively, we could restrict the use of dirty block tracking to certain memory types (eg, VIDEO memory).
     *
     * However, a quick test with dirty block tracking disabled didn't yield a noticeable improvement in performance,
     * so I think the overhead of our block-based architecture is swamping the impact of these micro-updates.
     */
    this.fDirty = this.fDirtyEver = false;

    /*
     * For empty memory blocks, all we need to do is ensure all access functions are mapped to "none" handlers.
     */
    if (!size) {
        this.setAccess();
        return;
    }

    /*
     * This is the normal case: allocate a buffer that provides 8 bits of data per address;
     * no controller is required because our default memory access functions (see afnMemory)
     * know how to deal with this simple 1-1 mapping of addresses to bytes and words.
     *
     * TODO: Consider initializing the memory array to random (or pseudo-random) values in DEBUG
     * mode; pseudo-random might be best, to help make any bugs reproducible.
     */
    if (TYPEDARRAYS) {
        this.buffer = new ArrayBuffer(size);
        this.dv = new DataView(this.buffer, 0, size);
        /*
         * If littleEndian is true, we can use ab[], aw[] and adw[] directly; well, we can use them
         * whenever the offset is a multiple of 1, 2 or 4, respectively.  Otherwise, we must fallback to
         * dv.getUint8()/dv.setUint8(), dv.getUint16()/dv.setUint16() and dv.getInt32()/dv.setInt32().
         */
        this.ab = new Uint8Array(this.buffer, 0, size);
        this.aw = new Uint16Array(this.buffer, 0, size >> 1);
        this.adw = new Int32Array(this.buffer, 0, size >> 2);
        this.setAccess(littleEndian? Memory.afnArrayLE : Memory.afnArrayBE);
    } else {
        if (BYTEARRAYS) {
            this.ab = new Array(size);
        } else {
            /*
             * NOTE: This is the default mode of operation (!TYPEDARRAYS && !BYTEARRAYS), because it
             * seems to provide the best performance; and although in theory, that performance might
             * come at twice the overhead of TYPEDARRAYS, it's increasingly likely that the JavaScript
             * runtime will notice that all we ever store are 32-bit values, and optimize accordingly.
             */
            this.adw = new Array(size >> 2);
            for (i = 0; i < this.adw.length; i++) this.adw[i] = 0;
        }
        this.setAccess(Memory.afnMemory);
    }
}

/*
 * Basic memory types
 *
 * RAM is the most conventional memory type, providing full read/write capability to x86-compatible (ie,
 * 'little endian") storage.  ROM is equally conventional, except that the fReadOnly property is set,
 * disabling writes.  VIDEO is treated exactly like RAM, unless a controller is provided.  Both RAM and
 * VIDEO memory are always considered writable, and even ROM can be written using the Bus setByteDirect()
 * interface (which in turn uses the Memory writeByteDirect() interface), allowing the ROM component to
 * initialize its own memory.  The CTRL type is used to identify memory-mapped devices that do not need
 * any default storage and always provide their own controller.
 *
 * Unallocated regions of the address space contain a special memory block of type NONE that contains
 * no storage.  Mapping every addressible location to a memory block allows all accesses to be routed in
 * exactly the same manner, without resorting to any range or processor checks.
 *
 * These types are not mutually exclusive.  For example, VIDEO memory could be allocated as RAM, with or
 * without a custom controller (the original Monochrome and CGA video cards used read/write storage that
 * was indistinguishable from RAM), and CTRL memory could be allocated as an empty block of any type, with
 * a custom controller.  A few types are required for certain features (eg, ROM is required if you want
 * read-only memory), but the larger purpose of these types is to help document the caller's intent and to
 * provide the Control Panel with the ability to highlight memory regions accordingly.
 */
Memory.TYPE = {
    NONE:       0,
    RAM:        1,
    ROM:        2,
    VIDEO:      3,
    CTRL:       4,
    COLORS:     ["black", "blue", "green", "cyan"],
    NAMES:      ["NONE",  "RAM",  "ROM",   "VID",  "H/W"]
};

/*
 * Last used block ID (used for debugging only)
 */
Memory.idBlock = 0;

/**
 * adjustEndian(dw)
 *
 * @param {number} dw
 * @return {number}
 */
Memory.adjustEndian = function(dw) {
    if (TYPEDARRAYS && !littleEndian) {
        dw = (dw << 24) | ((dw << 8) & 0x00ff0000) | ((dw >> 8) & 0x0000ff00) | (dw >>> 24);
    }
    return dw;
};

Memory.prototype = {
    constructor: Memory,
    parent: null,
    /**
     * init(addr)
     *
     * Quick reinitializer when reusing a Memory block.
     *
     * @this {Memory}
     * @param {number} addr
     */
    init: function(addr) {
        this.addr = addr;
    },
    /**
     * clone(mem, type)
     *
     * Converts the current Memory block (this) into a clone of the given Memory block (mem),
     * and optionally overrides the current block's type with the specified type.
     *
     * @this {Memory}
     * @param {Memory} mem
     * @param {number} [type]
     * @param {Debugger} [dbg]
     */
    clone: function(mem, type, dbg) {
        /*
         * Original memory block IDs are even; cloned memory block IDs are odd;
         * the original ID of the current block is lost, but that's OK, since it was presumably
         * produced merely to become a clone.
         */
        this.id = mem.id | 0x1;
        this.used = mem.used;
        this.size = mem.size;
        if (type) {
            this.type = type;
            this.fReadOnly = (type == Memory.TYPE.ROM);
        }
        if (TYPEDARRAYS) {
            this.buffer = mem.buffer;
            this.dv = mem.dv;
            this.ab = mem.ab;
            this.aw = mem.aw;
            this.adw = mem.adw;
            this.setAccess(littleEndian? Memory.afnArrayLE : Memory.afnArrayBE);
        } else {
            if (BYTEARRAYS) {
                this.ab = mem.ab;
            } else {
                this.adw = mem.adw;
            }
            this.setAccess(Memory.afnMemory);
        }
        this.copyBreakpoints(dbg, mem);
    },
    /**
     * save()
     *
     * This gets the contents of a Memory block as an array of 32-bit values; used by Bus.saveMemory(),
     * which in turn is called by CPUState.save().
     *
     * Memory blocks with custom memory controllers do NOT save their contents; that's the responsibility
     * of the controller component.
     *
     * @this {Memory}
     * @return {Array|Int32Array|null}
     */
    save: function() {
        var adw, i;
        if (BYTEARRAYS) {
            adw = new Array(this.size >> 2);
            var off = 0;
            for (i = 0; i < adw.length; i++) {
                adw[i] = this.ab[off] | (this.ab[off + 1] << 8) | (this.ab[off + 2] << 16) | (this.ab[off + 3] << 24);
                off += 4;
            }
        }
        else if (TYPEDARRAYS) {
            /*
             * It might be tempting to just return a copy of Int32Array(this.buffer, 0, this.size >> 2),
             * but we can't be sure of the "endianness" of an Int32Array -- which would be OK if the array
             * was always saved/restored on the same machine, but there's no guarantee of that, either.
             * So we use getInt32() and require little-endian values.
             *
             * Moreover, an Int32Array isn't treated by JSON.stringify() and JSON.parse() exactly like
             * a normal array; it's serialized as an Object rather than an Array, so it lacks a "length"
             * property and causes problems for State.store() and State.parse().
             */
            adw = new Array(this.size >> 2);
            for (i = 0; i < adw.length; i++) {
                adw[i] = this.dv.getInt32(i << 2, true);
            }
        }
        else {
            adw = this.adw;
        }
        return adw;
    },
    /**
     * restore(adw)
     *
     * This restores the contents of a Memory block from an array of 32-bit values;
     * used by Bus.restoreMemory(), which is called by CPUState.restore(), after all other
     * components have been restored and thus all Memory blocks have been allocated
     * by their respective components.
     *
     * @this {Memory}
     * @param {Array|null} adw
     * @return {boolean} true if successful, false if block size mismatch
     */
    restore: function(adw) {
        /*
         * At this point, it's a consistency error for adw to be null; it's happened once already,
         * when there was a restore bug in the Video component that added the frame buffer at the video
         * card's "spec'ed" address instead of the programmed address, so there were no controller-owned
         * memory blocks installed at the programmed address, and so we arrived here at a block with
         * no controller AND no data.
         */


        if (adw && this.size == adw.length << 2) {
            var i;
            if (BYTEARRAYS) {
                var off = 0;
                for (i = 0; i < adw.length; i++) {
                    this.ab[off] = adw[i] & 0xff;
                    this.ab[off + 1] = (adw[i] >> 8) & 0xff;
                    this.ab[off + 2] = (adw[i] >> 16) & 0xff;
                    this.ab[off + 3] = (adw[i] >> 24) & 0xff;
                    off += 4;
                }
            } else if (TYPEDARRAYS) {
                for (i = 0; i < adw.length; i++) {
                    this.dv.setInt32(i << 2, adw[i], true);
                }
            } else {
                this.adw = adw;
            }
            this.fDirty = true;
            return true;
        }
        return false;
    },
    /**
     * setAccess(afn, fDirect)
     *
     * If no function table is specified, a default is selected based on the Memory type.
     *
     * @this {Memory}
     * @param {Array.<function()>} [afn] function table
     * @param {boolean} [fDirect] (true to update direct access functions as well; default is true)
     */
    setAccess: function(afn, fDirect) {
        if (!afn) {

            afn = Memory.afnNone;
        }
        this.setReadAccess(afn, fDirect);
        this.setWriteAccess(afn, fDirect);
    },
    /**
     * setReadAccess(afn, fDirect)
     *
     * @this {Memory}
     * @param {Array.<function()>} afn
     * @param {boolean} [fDirect]
     */
    setReadAccess: function(afn, fDirect) {
        if (!fDirect || !this.cReadBreakpoints) {
            this.readByte = afn[0] || this.readNone;
            this.readShort = afn[1] || this.readShortDefault;
        }
        if (fDirect || fDirect === undefined) {
            this.readByteDirect = afn[0] || this.readNone;
            this.readShortDirect = afn[1] || this.readShortDefault;
        }
    },
    /**
     * setWriteAccess(afn, fDirect)
     *
     * @this {Memory}
     * @param {Array.<function()>} afn
     * @param {boolean} [fDirect]
     */
    setWriteAccess: function(afn, fDirect) {
        if (!fDirect || !this.cWriteBreakpoints) {
            this.writeByte = !this.fReadOnly && afn[2] || this.writeNone;
            this.writeShort = !this.fReadOnly && afn[3] || this.writeShortDefault;
        }
        if (fDirect || fDirect === undefined) {
            this.writeByteDirect = afn[2] || this.writeNone;
            this.writeShortDirect = afn[3] || this.writeShortDefault;
        }
    },
    /**
     * resetReadAccess()
     *
     * @this {Memory}
     */
    resetReadAccess: function() {
        this.readByte = this.readByteDirect;
        this.readShort = this.readShortDirect;
    },
    /**
     * resetWriteAccess()
     *
     * @this {Memory}
     */
    resetWriteAccess: function() {
        this.writeByte = this.fReadOnly? this.writeNone : this.writeByteDirect;
        this.writeShort = this.fReadOnly? this.writeShortDefault : this.writeShortDirect;
    },
    /**
     * printAddr(sMessage)
     *
     * @this {Memory}
     * @param {string} sMessage
     */
    printAddr: function(sMessage) {
        if (DEBUG && this.dbg && this.dbg.messageEnabled(Messages.MEM)) {
            this.dbg.printMessage(sMessage + ' ' + (this.addr != null? ('%' + str.toHex(this.addr)) : '#' + this.id), true);
        }
    },
    /**
     * addBreakpoint(off, fWrite)
     *
     * @this {Memory}
     * @param {number} off
     * @param {boolean} fWrite
     */
    addBreakpoint: function(off, fWrite) {
        if (!fWrite) {
            if (this.cReadBreakpoints++ === 0) {
                this.setReadAccess(Memory.afnChecked, false);
            }
            if (DEBUG) this.printAddr("read breakpoint added to memory block");
        }
        else {
            if (this.cWriteBreakpoints++ === 0) {
                this.setWriteAccess(Memory.afnChecked, false);
            }
            if (DEBUG) this.printAddr("write breakpoint added to memory block");
        }
    },
    /**
     * removeBreakpoint(off, fWrite)
     *
     * @this {Memory}
     * @param {number} off
     * @param {boolean} fWrite
     */
    removeBreakpoint: function(off, fWrite) {
        if (!fWrite) {
            if (--this.cReadBreakpoints === 0) {
                this.resetReadAccess();
                if (DEBUG) this.printAddr("all read breakpoints removed from memory block");
            }

        }
        else {
            if (--this.cWriteBreakpoints === 0) {
                this.resetWriteAccess();
                if (DEBUG) this.printAddr("all write breakpoints removed from memory block");
            }

        }
    },
    /**
     * copyBreakpoints(dbg, mem)
     *
     * @this {Memory}
     * @param {Debugger} [dbg]
     * @param {Memory} [mem] (outgoing Memory block to copy breakpoints from, if any)
     */
    copyBreakpoints: function(dbg, mem) {
        this.dbg = dbg;
        this.cReadBreakpoints = this.cWriteBreakpoints = 0;
        if (mem) {
            if ((this.cReadBreakpoints = mem.cReadBreakpoints)) {
                this.setReadAccess(Memory.afnChecked, false);
            }
            if ((this.cWriteBreakpoints = mem.cWriteBreakpoints)) {
                this.setWriteAccess(Memory.afnChecked, false);
            }
        }
    },
    /**
     * readNone(off)
     *
     * Previously, this always returned 0x00, but the initial memory probe by the COMPAQ DeskPro 386 ROM BIOS
     * writes 0x0000 to the first word of every 64Kb block in the nearly 16Mb address space it supports, and
     * if it reads back 0x0000, it will initially think that LOTS of RAM exists, only to be disappointed later
     * when it performs a more exhaustive memory test, generating unwanted error messages in the process.
     *
     * TODO: Determine if we should have separate readByteNone(), readShortNone() and readLongNone() functions
     * to return 0xff, 0xffff and 0xffffffff|0, respectively.  This seems sufficient for now, as it seems unlikely
     * that a system would require nonexistent memory locations to return ALL bits set.
     *
     * Also, I'm reluctant to address that potential issue by simply returning -1, because to date, the above
     * Memory interfaces have always returned values that are properly masked to 8, 16 or 32 bits, respectively.
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readNone: function readNone(off, addr) {
        if (DEBUGGER && this.dbg && this.dbg.messageEnabled(Messages.CPU | Messages.MEM) /* && !off */) {
            this.dbg.message("attempt to read invalid block %" + str.toHex(this.addr), true);
        }
        return 0xff;
    },
    /**
     * writeNone(off, v, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} v (could be either a byte or word value, since we use the same handler for both kinds of accesses)
     * @param {number} addr
     */
    writeNone: function writeNone(off, v, addr) {
        if (DEBUGGER && this.dbg && this.dbg.messageEnabled(Messages.CPU | Messages.MEM) /* && !off */) {
            this.dbg.message("attempt to write " + str.toHexWord(v) + " to invalid block %" + str.toHex(this.addr), true);
        }
    },
    /**
     * readShortDefault(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortDefault: function readShortDefault(off, addr) {
        return this.readByte(off++, addr++) | (this.readByte(off, addr) << 8);
    },
    /**
     * writeShortDefault(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeShortDefault: function writeShortDefault(off, w, addr) {
        this.writeByte(off++, w & 0xff, addr++);
        this.writeByte(off, w >> 8, addr);
    },
    /**
     * readByteMemory(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteMemory: function readByteMemory(off, addr) {
        if (BYTEARRAYS) {
            return this.ab[off];
        }
        return ((this.adw[off >> 2] >>> ((off & 0x3) << 3)) & 0xff);
    },
    /**
     * readShortMemory(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortMemory: function readShortMemory(off, addr) {
        if (BYTEARRAYS) {
            return this.ab[off] | (this.ab[off + 1] << 8);
        }
        var w;
        var idw = off >> 2;
        var nShift = (off & 0x3) << 3;
        var dw = (this.adw[idw] >> nShift);
        if (nShift < 24) {
            w = dw & 0xffff;
        } else {
            w = (dw & 0xff) | ((this.adw[idw + 1] & 0xff) << 8);
        }
        return w;
    },
    /**
     * writeByteMemory(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     * @param {number} addr
     */
    writeByteMemory: function writeByteMemory(off, b, addr) {
        if (BYTEARRAYS) {
            this.ab[off] = b;
        } else {
            var idw = off >> 2;
            var nShift = (off & 0x3) << 3;
            this.adw[idw] = (this.adw[idw] & ~(0xff << nShift)) | (b << nShift);
        }
        this.fDirty = true;
    },
    /**
     * writeShortMemory(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeShortMemory: function writeShortMemory(off, w, addr) {
        if (BYTEARRAYS) {
            this.ab[off] = (w & 0xff);
            this.ab[off + 1] = (w >> 8);
        } else {
            var idw = off >> 2;
            var nShift = (off & 0x3) << 3;
            if (nShift < 24) {
                this.adw[idw] = (this.adw[idw] & ~(0xffff << nShift)) | (w << nShift);
            } else {
                this.adw[idw] = (this.adw[idw] & 0x00ffffff) | (w << 24);
                idw++;
                this.adw[idw] = (this.adw[idw] & (0xffffff00|0)) | (w >> 8);
            }
        }
        this.fDirty = true;
    },
    /**
     * readByteChecked(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteChecked: function readByteChecked(off, addr) {
        if (DEBUGGER && this.dbg && this.addr != null) {
            this.dbg.checkMemoryRead(this.addr + off);
        }
        return this.readByteDirect(off, addr);
    },
    /**
     * readShortChecked(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortChecked: function readShortChecked(off, addr) {
        if (DEBUGGER && this.dbg && this.addr != null) {
            this.dbg.checkMemoryRead(this.addr + off, 2);
        }
        return this.readShortDirect(off, addr);
    },
    /**
     * writeByteChecked(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} b
     */
    writeByteChecked: function writeByteChecked(off, b, addr) {
        if (DEBUGGER && this.dbg && this.addr != null) {
            this.dbg.checkMemoryWrite(this.addr + off);
        }
        if (this.fReadOnly) this.writeNone(off, b, addr); else this.writeByteDirect(off, b, addr);
    },
    /**
     * writeShortChecked(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} w
     */
    writeShortChecked: function writeShortChecked(off, w, addr) {
        if (DEBUGGER && this.dbg && this.addr != null) {
            this.dbg.checkMemoryWrite(this.addr + off, 2)
        }
        if (this.fReadOnly) this.writeNone(off, w, addr); else this.writeShortDirect(off, w, addr);
    },
    /**
     * readByteBE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteBE: function readByteBE(off, addr) {
        return this.ab[off];
    },
    /**
     * readByteLE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteLE: function readByteLE(off, addr) {
        return this.ab[off];
    },
    /**
     * readShortBE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortBE: function readShortBE(off, addr) {
        return this.dv.getUint16(off, true);
    },
    /**
     * readShortLE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortLE: function readShortLE(off, addr) {
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset for an aligned read
         * vs. always reading the bytes separately; it seems a safe bet for longs, but it's less clear for shorts.
         */
        return (off & 0x1)? (this.ab[off] | (this.ab[off+1] << 8)) : this.aw[off >> 1];
    },
    /**
     * writeByteBE(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     * @param {number} addr
     */
    writeByteBE: function writeByteBE(off, b, addr) {
        this.ab[off] = b;
        this.fDirty = true;
    },
    /**
     * writeByteLE(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} b
     */
    writeByteLE: function writeByteLE(off, b, addr) {
        this.ab[off] = b;
        this.fDirty = true;
    },
    /**
     * writeShortBE(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} w
     */
    writeShortBE: function writeShortBE(off, w, addr) {
        this.dv.setUint16(off, w, true);
        this.fDirty = true;
    },
    /**
     * writeShortLE(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} w
     */
    writeShortLE: function writeShortLE(off, w, addr) {
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset for an aligned write
         * vs. always writing the bytes separately; it seems a safe bet for longs, but it's less clear for shorts.
         */
        if (off & 0x1) {
            this.ab[off] = w;
            this.ab[off+1] = w >> 8;
        } else {
            this.aw[off >> 1] = w;
        }
        this.fDirty = true;
    }
};

/*
 * This is the effective definition of afnNone, but we need not fully define it, because setAccess()
 * uses these defaults when any of the 6 handlers (ie, 3 read handlers and 3 write handlers) are undefined.
 *
Memory.afnNone          = [Memory.prototype.readNone,        Memory.prototype.readShortDefault, Memory.prototype.writeNone,        Memory.prototype.writeShortDefault];
 */

Memory.afnNone          = [];
Memory.afnMemory        = [Memory.prototype.readByteMemory,  Memory.prototype.readShortMemory,  Memory.prototype.writeByteMemory,  Memory.prototype.writeShortMemory];
Memory.afnChecked       = [Memory.prototype.readByteChecked, Memory.prototype.readShortChecked, Memory.prototype.writeByteChecked, Memory.prototype.writeShortChecked];

if (TYPEDARRAYS) {
    Memory.afnArrayBE   = [Memory.prototype.readByteBE,      Memory.prototype.readShortBE,      Memory.prototype.writeByteBE,      Memory.prototype.writeShortBE];
    Memory.afnArrayLE   = [Memory.prototype.readByteLE,      Memory.prototype.readShortLE,      Memory.prototype.writeByteLE,      Memory.prototype.writeShortLE];
}


// ./modules/pc8080/lib/cpu.js

/**
 * @fileoverview Controls the PC8080 CPU component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
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


/**
 * CPU(parmsCPU, nCyclesDefault)
 *
 * The CPU class supports the following (parmsCPU) properties:
 *
 *      cycles: the machine's base cycles per second; the CPUState constructor will
 *      provide us with a default (based on the CPU model) to use as a fallback.
 *
 *      multiplier: base cycle multiplier; default is 1.
 *
 *      autoStart: true to automatically start, false to not, or null if "it depends";
 *      null is the default, which means do not autostart UNLESS there is no Debugger
 *      and no "Run" button (ie, no way to manually start the machine).
 *
 *      csStart: the number of cycles that runCPU() must wait before generating
 *      checksum records; -1 if disabled. checksum records are a diagnostic aid
 *      used to help compare one CPU run to another.
 *
 *      csInterval: the number of cycles that runCPU() must execute before
 *      generating a checksum record; -1 if disabled.
 *
 *      csStop: the number of cycles to stop generating checksum records.
 *
 * This component is primarily responsible for interfacing the CPU with the outside
 * world (eg, Panel and Debugger components), and managing overall CPU operation.
 *
 * It is extended by the CPUState component, where the simulation control logic resides.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsCPU
 * @param {number} nCyclesDefault
 */
function CPU(parmsCPU, nCyclesDefault)
{
    Component.call(this, "CPU", parmsCPU, CPU, Messages.CPU);

    var nCycles = parmsCPU['cycles'] || nCyclesDefault;

    var nMultiplier = parmsCPU['multiplier'] || 1;

    this.aCounts = {};
    this.aCounts.nCyclesPerSecond = nCycles;
    this.aCounts.nVideoUpdates = 0;

    /*
     * nCyclesMultiplier replaces the old "speed" variable (0, 1, 2) and eliminates the need for
     * the constants (SPEED_SLOW, SPEED_FAST and SPEED_MAX).  The UI simply doubles the multiplier
     * until we've exceeded the host's speed limit and then starts the multiplier over at 1.
     */
    this.aCounts.nCyclesMultiplier = nMultiplier;
    this.aCounts.mhzDefault = Math.round(this.aCounts.nCyclesPerSecond / 10000) / 100;
    /*
     * TODO: Take care of this with an initial setSpeed() call instead?
     */
    this.aCounts.mhzTarget = this.aCounts.mhzDefault * this.aCounts.nCyclesMultiplier;

    /*
     * We add a number of flags to the set initialized by Component
     */
    this.flags.fRunning = false;
    this.flags.fStarting = false;
    this.flags.fAutoStart = parmsCPU['autoStart'];

    /*
     * TODO: Add some UI for fDisplayLiveRegs (either an XML property, or a UI checkbox, or both)
     */
    this.flags.fDisplayLiveRegs = false;

    /*
     * Get checksum parameters, if any. runCPU() behavior is not affected until fChecksum
     * is true, which won't happen until resetChecksum() is called with nCyclesChecksumInterval
     * ("csInterval") set to a positive value.
     *
     * As above, any of these parameters can also be set with the Debugger's execution options
     * command ("x"); for example, "x cs int 5000" will set nCyclesChecksumInterval to 5000
     * and call resetChecksum().
     */
    this.flags.fChecksum = false;
    this.aCounts.nChecksum = this.aCounts.nCyclesChecksumNext = 0;
    this.aCounts.nCyclesChecksumStart = parmsCPU["csStart"];
    this.aCounts.nCyclesChecksumInterval = parmsCPU["csInterval"];
    this.aCounts.nCyclesChecksumStop = parmsCPU["csStop"];

    this.onRunTimeout = this.runCPU.bind(this); // function onRunTimeout() { cpu.runCPU(); };

    this.setReady();
}

Component.subclass(CPU);

/*
 * Constants that control the frequency at which various updates should occur.
 *
 * These values do NOT control the simulation directly.  Instead, they are used by
 * calcCycles(), which uses the nCyclesPerSecond passed to the constructor as a starting
 * point and computes the following variables:
 *
 *      this.aCounts.nCyclesPerYield         (this.aCounts.nCyclesPerSecond / CPU.YIELDS_PER_SECOND)
 *      this.aCounts.nCyclesPerVideoUpdate   (this.aCounts.nCyclesPerSecond / CPU.VIDEO_UPDATES_PER_SECOND)
 *      this.aCounts.nCyclesPerStatusUpdate  (this.aCounts.nCyclesPerSecond / CPU.STATUS_UPDATES_PER_SECOND)
 *
 * The above variables are also multiplied by any cycle multiplier in effect, via setSpeed(),
 * and then they're used to initialize another set of variables for each runCPU() iteration:
 *
 *      this.aCounts.nCyclesNextYield        <= this.aCounts.nCyclesPerYield
 *      this.aCounts.nCyclesNextVideoUpdate  <= this.aCounts.nCyclesPerVideoUpdate
 *      this.aCounts.nCyclesNextStatusUpdate <= this.aCounts.nCyclesPerStatusUpdate
 */
CPU.YIELDS_PER_SECOND         = 30;
CPU.VIDEO_UPDATES_PER_SECOND  = 60;
CPU.STATUS_UPDATES_PER_SECOND = 2;

CPU.BUTTONS = ["power", "reset"];

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {CPU}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPU} cpu
 * @param {Debugger} dbg
 */
CPU.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.dbg = dbg;

    for (var i = 0; i < CPU.BUTTONS.length; i++) {
        var control = this.bindings[CPU.BUTTONS[i]];
        if (control) this.cmp.setBinding(null, CPU.BUTTONS[i], control);
    }

    /*
     * We need to know the refresh rate (and corresponding interrupt rate, if any) of the Video component.
     */
    var video = cmp.getMachineComponent("Video");
    this.refreshRate = video && video.getRefreshRate() || CPU.VIDEO_UPDATES_PER_SECOND;

    /*
     * Attach the ChipSet component to the CPU so that it can be notified whenever the CPU stops and starts.
     */
    this.chipset = cmp.getMachineComponent("ChipSet");

    /*
     * We've already saved the parmsCPU 'autoStart' setting, but there may be a machine (or URL) override.
     */
    var sAutoStart = cmp.getMachineParm('autoStart');
    if (sAutoStart != null) {
        this.flags.fAutoStart = (sAutoStart == "true"? true : (sAutoStart  == "false"? false : !!sAutoStart));
    }

    this.setReady();
};

/**
 * reset()
 *
 * @this {CPU}
 */
CPU.prototype.reset = function()
{
     this.aCounts.nVideoUpdates = 0;
};

/**
 * save()
 *
 * This is a placeholder for save support (overridden by the CPUState component).
 *
 * @this {CPU}
 * @return {Object|null}
 */
CPU.prototype.save = function()
{
    return null;
};

/**
 * restore(data)
 *
 * This is a placeholder for restore support (overridden by the CPUState component).
 *
 * @this {CPU}
 * @param {Object} data
 * @return {boolean} true if restore successful, false if not
 */
CPU.prototype.restore = function(data)
{
    return false;
};

/**
 * powerUp(data, fRepower)
 *
 * @this {CPU}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
CPU.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data || !this.restore) {
            this.reset();
        } else {
            this.resetCycles();
            if (!this.restore(data)) return false;
            this.resetChecksum();
        }
        /*
         * Give the Debugger a chance to do/print something once we've powered up
         */
        if (DEBUGGER && this.dbg) {
            this.dbg.init();
        } else {
            /*
             * The Computer (this.cmp) knows if there's a Control Panel (this.cmp.panel), and the Control Panel
             * knows if there's a "print" control (this.cmp.panel.controlPrint), and if there IS a "print" control
             * but no debugger, the machine is probably misconfigured (most likely, the page simply neglected to
             * load the Debugger component).
             *
             * However, we don't actually need to check all that; it's always safe use println(), regardless whether
             * a Control Panel with a "print" control is present or not.
             */
            this.println("No debugger detected");
        }
    }
    /*
     * The Computer component (which is responsible for all powerDown and powerUp notifications)
     * is now responsible for managing a component's fPowered flag, not us.
     *
     *      this.flags.fPowered = true;
     */
    this.updateCPU();
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {CPU}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
CPU.prototype.powerDown = function(fSave, fShutdown)
{
    /*
     * The Computer component (which is responsible for all powerDown and powerUp notifications)
     * is now responsible for managing a component's fPowered flag, not us.
     *
     *      this.flags.fPowered = false;
     */
    return fSave? this.save() : true;
};

/**
 * autoStart()
 *
 * @this {CPU}
 * @return {boolean} true if started, false if not
 */
CPU.prototype.autoStart = function()
{
    /*
     * Start running automatically on power-up, assuming there's no Debugger and no "Run" button
     */
    if (this.flags.fAutoStart || (!DEBUGGER || !this.dbg) && this.bindings["run"] === undefined) {
        /*
         * Now we ALSO set fUpdateFocus when calling runCPU(), on the assumption that in the "auto-starting" context,
         * a machine without focus is like a day without sunshine.
         */
        this.runCPU(true);
        return true;
    }
    return false;
};

/**
 * isPowered()
 *
 * @this {CPU}
 * @return {boolean}
 */
CPU.prototype.isPowered = function()
{
    if (!this.flags.fPowered) {
        this.println(this.toString() + " not powered");
        return false;
    }
    return true;
};

/**
 * isRunning()
 *
 * @this {CPU}
 * @return {boolean}
 */
CPU.prototype.isRunning = function()
{
    return this.flags.fRunning;
};

/**
 * getChecksum()
 *
 * This will be implemented by the CPUState component.
 *
 * @this {CPU}
 * @return {number} a 32-bit summation of key elements of the current CPU state (used by the CPU checksum code)
 */
CPU.prototype.getChecksum = function()
{
    return 0;
};

/**
 * resetChecksum()
 *
 * If checksum generation is enabled (fChecksum is true), this resets the running 32-bit checksum and the
 * cycle counter that will trigger the next displayChecksum(); called by resetCycles(), which is called whenever
 * the CPU is reset or restored.
 *
 * @this {CPU}
 * @return {boolean} true if checksum generation enabled, false if not
 */
CPU.prototype.resetChecksum = function()
{
    if (this.aCounts.nCyclesChecksumStart === undefined) this.aCounts.nCyclesChecksumStart = 0;
    if (this.aCounts.nCyclesChecksumInterval === undefined) this.aCounts.nCyclesChecksumInterval = -1;
    if (this.aCounts.nCyclesChecksumStop === undefined) this.aCounts.nCyclesChecksumStop = -1;
    this.flags.fChecksum = (this.aCounts.nCyclesChecksumStart >= 0 && this.aCounts.nCyclesChecksumInterval > 0);
    if (this.flags.fChecksum) {
        this.aCounts.nChecksum = 0;
        this.aCounts.nCyclesChecksumNext = this.aCounts.nCyclesChecksumStart - this.nTotalCycles;
        /*
         *  this.aCounts.nCyclesChecksumNext = this.aCounts.nCyclesChecksumStart + this.aCounts.nCyclesChecksumInterval -
         *      (this.nTotalCycles % this.aCounts.nCyclesChecksumInterval);
         */
        return true;
    }
    return false;
};

/**
 * updateChecksum(nCycles)
 *
 * When checksum generation is enabled (fChecksum is true), runCPU() asks stepCPU() to execute a minimum
 * number of cycles (1), effectively limiting execution to a single instruction, and then we're called with
 * the exact number cycles that were actually executed.  This should give us instruction-granular checksums
 * at precise intervals that are 100% repeatable.
 *
 * @this {CPU}
 * @param {number} nCycles
 */
CPU.prototype.updateChecksum = function(nCycles)
{
    if (this.flags.fChecksum) {
        /*
         * Get a 32-bit summation of the current CPU state and add it to our running 32-bit checksum
         */
        var fDisplay = false;
        this.aCounts.nChecksum = (this.aCounts.nChecksum + this.getChecksum())|0;
        this.aCounts.nCyclesChecksumNext -= nCycles;
        if (this.aCounts.nCyclesChecksumNext <= 0) {
            this.aCounts.nCyclesChecksumNext += this.aCounts.nCyclesChecksumInterval;
            fDisplay = true;
        }
        if (this.aCounts.nCyclesChecksumStop >= 0) {
            if (this.aCounts.nCyclesChecksumStop <= this.getCycles()) {
                this.aCounts.nCyclesChecksumInterval = this.aCounts.nCyclesChecksumStop = -1;
                this.resetChecksum();
                this.stopCPU();
                fDisplay = true;
            }
        }
        if (fDisplay) this.displayChecksum();
    }
};

/**
 * displayChecksum()
 *
 * When checksum generation is enabled (fChecksum is true), this is called to provide a crude log of all
 * checksums generated at the specified cycle intervals, as specified by the "csStart" and "csInterval" parmsCPU
 * properties).
 *
 * @this {CPU}
 */
CPU.prototype.displayChecksum = function()
{
    this.println(this.getCycles() + " cycles: " + "checksum=" + str.toHex(this.aCounts.nChecksum));
};

/**
 * displayValue(sLabel, nValue, cch)
 *
 * This is principally for displaying register values, but in reality, it can be used to display any
 * numeric (hex) value bound to the given label.
 *
 * @this {CPU}
 * @param {string} sLabel
 * @param {number} nValue
 * @param {number} cch
 */
CPU.prototype.displayValue = function(sLabel, nValue, cch)
{
    if (this.bindings[sLabel]) {
        if (nValue === undefined) {
            this.setError("Value for " + sLabel + " is invalid");
            this.stopCPU();
        }
        var sVal;
        if (!this.flags.fRunning || this.flags.fDisplayLiveRegs) {
            sVal = str.toHex(nValue, cch);
        } else {
            sVal = "--------".substr(0, cch);
        }
        /*
         * TODO: Determine if this test actually avoids any redrawing when a register hasn't changed, and/or if
         * we should maintain our own (numeric) cache of displayed register values (to avoid creating these temporary
         * string values that will have to garbage-collected), and/or if this is actually slower, and/or if I'm being
         * too obsessive.
         */
        if (this.bindings[sLabel].textContent != sVal) this.bindings[sLabel].textContent = sVal;
    }
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {CPU}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "run")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
CPU.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    var cpu = this;
    var fBound = false;

    switch (sBinding) {
    case "power":
    case "reset":
        /*
         * The "power" and "reset" buttons are functions of the entire computer, not just the CPU,
         * but it's not always convenient to stick a power button in the Computer component definition,
         * so we record those bindings here and pass them on to the Computer component in initBus().
         */
        this.bindings[sBinding] = control;
        fBound = true;
        break;

    case "run":
        this.bindings[sBinding] = control;
        control.onclick = function onClickRun() {
            if (!cpu.cmp || !cpu.cmp.checkPower()) return;
            if (!cpu.flags.fRunning)
                cpu.runCPU(true);
            else
                cpu.stopCPU(true);
        };
        fBound = true;
        break;

    case "speed":
        this.bindings[sBinding] = control;
        fBound = true;
        break;

    case "setSpeed":
        this.bindings[sBinding] = control;
        control.onclick = function onClickSetSpeed() {
            cpu.setSpeed(cpu.aCounts.nCyclesMultiplier << 1, true);
        };
        control.textContent = this.getSpeedTarget();
        fBound = true;
        break;

    default:
        break;
    }
    return fBound;
};

/**
 * setBurstCycles(nCycles)
 *
 * This function is used by the ChipSet component whenever a very low timer count is set,
 * in anticipation of the timer requiring an update sooner than the normal nCyclesPerYield
 * period in runCPU() would normally provide.
 *
 * @this {CPU}
 * @param {number} nCycles is the target number of cycles to drop the current burst to
 * @return {boolean}
 */
CPU.prototype.setBurstCycles = function(nCycles)
{
    if (this.flags.fRunning) {
        var nDelta = this.nStepCycles - nCycles;
        /*
         * NOTE: If nDelta is negative, we will actually be increasing nStepCycles and nBurstCycles.
         * Which is OK, but if we're also taking snapshots of the cycle counts, to make sure that instruction
         * costs are being properly assessed, then we need to update nSnapCycles as well.
         *
         * TODO: If the delta is negative, we could simply ignore the request, but we must first carefully
         * consider the impact on the ChipSet timers, if any.
         */
        // if (DEBUG) this.nSnapCycles -= nDelta;
        this.nStepCycles -= nDelta;
        this.nBurstCycles -= nDelta;
        return true;
    }
    return false;
};

/**
 * addCycles(nCycles, fEndStep)
 *
 * @this {CPU}
 * @param {number} nCycles
 * @param {boolean} [fEndStep]
 */
CPU.prototype.addCycles = function(nCycles, fEndStep)
{
    this.nTotalCycles += nCycles;
    if (fEndStep) {
        this.nBurstCycles = this.nStepCycles = 0;
    }
};

/**
 * calcCycles(fRecalc)
 *
 * Calculate the number of cycles to process for each "burst" of CPU activity.  The size of a burst
 * is driven by the following values:
 *
 *      CPU.YIELDS_PER_SECOND (eg, 30)
 *      CPU.VIDEO_UPDATES_PER_SECOND (eg, 60)
 *      CPU.STATUS_UPDATES_PER_SECOND (eg, 5)
 *
 * The largest of the above values forces the size of the burst to its smallest value.  Let's say that
 * largest value is 30.  Assuming nCyclesPerSecond is 1,000,000, that results in bursts of 33,333 cycles.
 *
 * At the end of each burst, we subtract burst cycles from yield, video, and status cycle "threshold"
 * counters. Whenever the "next yield" cycle counter goes to (or below) zero, we compare elapsed time
 * to the time we expected the virtual hardware to take (eg, 1000ms/50 or 20ms), and if we still have time
 * remaining, we sleep the remaining time (or 0ms if there's no remaining time), and then restart runCPU().
 *
 * Similarly, whenever the "next video update" cycle counter goes to (or below) zero, we call updateVideo(),
 * and whenever the "next status update" cycle counter goes to (or below) zero, we call updateStatus().
 *
 * @this {CPU}
 * @param {boolean} [fRecalc] is true if the caller wants to recalculate thresholds based on the most recent
 * speed calculation (see calcSpeed).
 */
CPU.prototype.calcCycles = function(fRecalc)
{
    /*
     * Calculate the most cycles we're allowed to execute in a single "burst"
     */
    var nMostUpdatesPerSecond = CPU.YIELDS_PER_SECOND;
    if (nMostUpdatesPerSecond < this.refreshRate) nMostUpdatesPerSecond = this.refreshRate;
    if (nMostUpdatesPerSecond < CPU.STATUS_UPDATES_PER_SECOND) nMostUpdatesPerSecond = CPU.STATUS_UPDATES_PER_SECOND;

    /*
     * Calculate cycle "per" values for the yield, video update, and status update cycle counters
     */
    var vMultiplier = 1;
    if (fRecalc) {
        if (this.aCounts.nCyclesMultiplier > 1 && this.aCounts.mhz) {
            vMultiplier = (this.aCounts.mhz / this.aCounts.mhzDefault);
        }
    }

    this.aCounts.msPerYield = Math.round(1000 / CPU.YIELDS_PER_SECOND);
    this.aCounts.nCyclesPerBurst = Math.floor(this.aCounts.nCyclesPerSecond / nMostUpdatesPerSecond * vMultiplier);
    this.aCounts.nCyclesPerYield = Math.floor(this.aCounts.nCyclesPerSecond / CPU.YIELDS_PER_SECOND * vMultiplier);
    this.aCounts.nCyclesPerVideoUpdate = Math.floor(this.aCounts.nCyclesPerSecond / this.refreshRate * vMultiplier);
    this.aCounts.nCyclesPerStatusUpdate = Math.floor(this.aCounts.nCyclesPerSecond / CPU.STATUS_UPDATES_PER_SECOND * vMultiplier);

    /*
     * And initialize "next" yield, video update, and status update cycle "threshold" counters to those "per" values
     */
    if (!fRecalc) {
        this.aCounts.nCyclesNextYield = this.aCounts.nCyclesPerYield;
        this.aCounts.nCyclesNextVideoUpdate = this.aCounts.nCyclesPerVideoUpdate;
        this.aCounts.nCyclesNextStatusUpdate = this.aCounts.nCyclesPerStatusUpdate;
    }
    this.aCounts.nCyclesRecalc = 0;
};

/**
 * getCycles(fScaled)
 *
 * getCycles() returns the number of cycles executed so far.  Note that we can be called after
 * runCPU() OR during runCPU(), perhaps from a handler triggered during the current run's stepCPU(),
 * so nRunCycles must always be adjusted by number of cycles stepCPU() was asked to run (nBurstCycles),
 * less the number of cycles it has yet to run (nStepCycles).
 *
 * nRunCycles is zeroed whenever the CPU is halted or the CPU speed is changed, which is why we also
 * have nTotalCycles, which accumulates all nRunCycles before we zero it.  However, nRunCycles and
 * nTotalCycles eventually get reset by calcSpeed(), to avoid overflow, so components that rely on
 * getCycles() returning steadily increasing values should also be prepared for a reset at any time.
 *
 * @this {CPU}
 * @param {boolean} [fScaled] is true if the caller wants a cycle count relative to a multiplier of 1
 * @return {number}
 */
CPU.prototype.getCycles = function(fScaled)
{
    var nCycles = this.nTotalCycles + this.nRunCycles + this.nBurstCycles - this.nStepCycles;
    if (fScaled && this.aCounts.nCyclesMultiplier > 1 && this.aCounts.mhz > this.aCounts.mhzDefault) {
        /*
         * We could scale the current cycle count by the current effective speed (this.aCounts.mhz); eg:
         *
         *      nCycles = Math.round(nCycles / (this.aCounts.mhz / this.aCounts.mhzDefault));
         *
         * but that speed will fluctuate somewhat: large fluctuations at first, but increasingly smaller
         * fluctuations after each burst of instructions that runCPU() executes.
         *
         * Alternatively, we can scale the cycle count by the multiplier, which is good in that the
         * multiplier doesn't vary once the user changes it, but a potential downside is that the
         * multiplier might be set too high, resulting in a target speed that's higher than the effective
         * speed is able to reach.
         *
         * Also, if multipliers were always limited to a power-of-two, then this could be calculated
         * with a simple shift.  However, only the "setSpeed" UI binding limits it that way; the Debugger
         * interface allows any value, as does the CPU "multiplier" parmsCPU property (from the machine's
         * XML file).
         */
        nCycles = Math.round(nCycles / this.aCounts.nCyclesMultiplier);
    }
    return nCycles;
};

/**
 * getCyclesPerSecond()
 *
 * This returns the CPU's "base" speed (ie, the original cycles per second defined for the machine)
 *
 * @this {CPU}
 * @return {number}
 */
CPU.prototype.getCyclesPerSecond = function()
{
    return this.aCounts.nCyclesPerSecond;
};

/**
 * resetCycles()
 *
 * Resets speed and cycle information as part of any reset() or restore(); this typically occurs during powerUp().
 * It's important that this be called BEFORE the actual restore() call, because restore() may want to call setSpeed(),
 * which in turn assumes that all the cycle counts have been initialized to sensible values.
 *
 * @this {CPU}
 */
CPU.prototype.resetCycles = function()
{
    this.aCounts.mhz = 0;
    this.nTotalCycles = this.nRunCycles = this.nBurstCycles = this.nStepCycles = 0;
    this.resetChecksum();
    this.setSpeed(1);
};

/**
 * getSpeed()
 *
 * @this {CPU}
 * @return {number} the current speed multiplier
 */
CPU.prototype.getSpeed = function()
{
    return this.aCounts.nCyclesMultiplier;
};

/**
 * getSpeedCurrent()
 *
 * @this {CPU}
 * @return {string} the current speed, in mhz, as a string formatted to two decimal places
 */
CPU.prototype.getSpeedCurrent = function()
{
    /*
     * TODO: Has toFixed() been "fixed" in all browsers (eg, IE) to return a rounded value now?
     */
    return ((this.flags.fRunning && this.aCounts.mhz)? (this.aCounts.mhz.toFixed(2) + "Mhz") : "Stopped");
};

/**
 * getSpeedTarget()
 *
 * @this {CPU}
 * @return {string} the target speed, in mhz, as a string formatted to two decimal places
 */
CPU.prototype.getSpeedTarget = function()
{
    /*
     * TODO: Has toFixed() been "fixed" in all browsers (eg, IE) to return a rounded value now?
     */
    return this.aCounts.mhzTarget.toFixed(2) + "Mhz";
};

/**
 * setSpeed(nMultiplier, fUpdateFocus)
 *
 * NOTE: This used to return the target speed, in mhz, but no callers appear to care at this point.
 *
 * @this {CPU}
 * @param {number} [nMultiplier] is the new proposed multiplier (reverts to 1 if the target was too high)
 * @param {boolean} [fUpdateFocus] is true to update Computer focus
 * @return {boolean} true if successful, false if not
 *
 * @desc Whenever the speed is changed, the running cycle count and corresponding start time must be reset,
 * so that the next effective speed calculation obtains sensible results.  In fact, when runCPU() initially calls
 * setSpeed() with no parameters, that's all this function does (it doesn't change the current speed setting).
 */
CPU.prototype.setSpeed = function(nMultiplier, fUpdateFocus)
{
    var fSuccess = false;
    if (nMultiplier !== undefined) {
        /*
         * If we haven't reached 80% (0.8) of the current target speed, revert to a multiplier of one (1).
         */
        if (this.aCounts.mhz / this.aCounts.mhzTarget < 0.8) {
            nMultiplier = 1;
        } else {
            fSuccess = true;
        }
        this.aCounts.nCyclesMultiplier = nMultiplier;
        var mhz = this.aCounts.mhzDefault * this.aCounts.nCyclesMultiplier;
        if (this.aCounts.mhzTarget != mhz) {
            this.aCounts.mhzTarget = mhz;
            var sSpeed = this.getSpeedTarget();
            var controlSpeed = this.bindings["setSpeed"];
            if (controlSpeed) controlSpeed.textContent = sSpeed;
            this.println("target speed: " + sSpeed);
        }
        if (fUpdateFocus && this.cmp) this.cmp.updateFocus();
    }
    this.addCycles(this.nRunCycles);
    this.nRunCycles = 0;
    this.aCounts.msStartRun = usr.getTime();
    this.aCounts.msEndThisRun = 0;
    this.calcCycles();
    return fSuccess;
};

/**
 * calcSpeed(nCycles, msElapsed)
 *
 * @this {CPU}
 * @param {number} nCycles
 * @param {number} msElapsed
 */
CPU.prototype.calcSpeed = function(nCycles, msElapsed)
{
    if (msElapsed) {
        this.aCounts.mhz = Math.round(nCycles / (msElapsed * 10)) / 100;
        if (msElapsed >= 86400000) {
            this.nTotalCycles = 0;
            this.setSpeed();        // reset all counters once per day so that we never have to worry about overflow
        }
    }
};

/**
 * calcStartTime()
 *
 * @this {CPU}
 */
CPU.prototype.calcStartTime = function()
{
    if (this.aCounts.nCyclesRecalc >= this.aCounts.nCyclesPerSecond) {
        this.calcCycles(true);
    }
    this.aCounts.nCyclesThisRun = 0;
    this.aCounts.msStartThisRun = usr.getTime();

    /*
     * Try to detect situations where the browser may have throttled us, such as when the user switches
     * to a different tab; in those situations, Chrome and Safari may restrict setTimeout() callbacks
     * to roughly one per second.
     *
     * Another scenario: the user resizes the browser window.  setTimeout() callbacks are not throttled,
     * but there can still be enough of a lag between the callbacks that CPU speed will be noticeably
     * erratic if we don't compensate for it here.
     *
     * We can detect throttling/lagging by verifying that msEndThisRun (which was set at the end of the
     * previous run and includes any requested sleep time) is comparable to the current msStartThisRun;
     * if the delta is significant, we compensate by bumping msStartRun forward by that delta.
     *
     * This shouldn't be triggered when the Debugger halts the CPU, because setSpeed() -- which is called
     * whenever the CPU starts running again -- zeroes msEndThisRun.
     *
     * This also won't do anything about other internal delays; for example, Debugger message() calls.
     * By the time the message() function has called yieldCPU(), the cost of the message has already been
     * incurred, so it will be end up being charged against the instruction(s) that triggered it.
     *
     * TODO: Consider calling yieldCPU() sooner from message(), so that it can arrange for the msEndThisRun
     * "snapshot" to occur sooner; it's unclear, however, whether that will really improve the CPU's ability
     * to hit its target speed, since you would expect any instruction that displays a message to be an
     * EXTREMELY slow instruction.
     */
    if (this.aCounts.msEndThisRun) {
        var msDelta = this.aCounts.msStartThisRun - this.aCounts.msEndThisRun;
        if (msDelta > this.aCounts.msPerYield) {
            if (MAXDEBUG) this.println("large time delay: " + msDelta + "ms");
            this.aCounts.msStartRun += msDelta;
            /*
             * Bumping msStartRun forward should NEVER cause it to exceed msStartThisRun; however, just
             * in case, I make absolutely sure it cannot happen, since doing so could result in negative
             * speed calculations.
             */

            if (this.aCounts.msStartRun > this.aCounts.msStartThisRun) {
                this.aCounts.msStartRun = this.aCounts.msStartThisRun;
            }
        }
    }
};

/**
 * calcRemainingTime()
 *
 * @this {CPU}
 * @return {number}
 */
CPU.prototype.calcRemainingTime = function()
{
    this.aCounts.msEndThisRun = usr.getTime();

    var msYield = this.aCounts.msPerYield;
    if (this.aCounts.nCyclesThisRun) {
        /*
         * Normally, we would assume we executed a full quota of work over msPerYield, but since the CPU
         * now has the option of calling yieldCPU(), that might not be true.  If nCyclesThisRun is correct, then
         * the ratio of nCyclesThisRun/nCyclesPerYield should represent the percentage of work we performed,
         * and so applying that percentage to msPerYield should give us a better estimate of work vs. time.
         */
        msYield = Math.round(msYield * this.aCounts.nCyclesThisRun / this.aCounts.nCyclesPerYield);
    }

    var msElapsedThisRun = this.aCounts.msEndThisRun - this.aCounts.msStartThisRun;
    var msRemainsThisRun = msYield - msElapsedThisRun;

    /*
     * We could pass only "this run" results to calcSpeed():
     *
     *      nCycles = this.aCounts.nCyclesThisRun;
     *      msElapsed = msElapsedThisRun;
     *
     * but it seems preferable to use longer time periods and hopefully get a more accurate speed.
     *
     * Also, if msRemainsThisRun >= 0 && this.aCounts.nCyclesMultiplier == 1, we could pass these results instead:
     *
     *      nCycles = this.aCounts.nCyclesThisRun;
     *      msElapsed = this.aCounts.msPerYield;
     *
     * to insure that we display a smooth, constant N Mhz.  But for now, I prefer seeing any fluctuations.
     */
    var nCycles = this.nRunCycles;
    var msElapsed = this.aCounts.msEndThisRun - this.aCounts.msStartRun;

    if (MAXDEBUG && msRemainsThisRun < 0 && this.aCounts.nCyclesMultiplier > 1) {
        this.println("warning: updates @" + msElapsedThisRun + "ms (prefer " + Math.round(msYield) + "ms)");
    }

    this.calcSpeed(nCycles, msElapsed);

    if (msRemainsThisRun < 0 || this.aCounts.mhz < this.aCounts.mhzTarget) {
        /*
         * If the last burst took MORE time than we allotted (ie, it's taking more than 1 second to simulate
         * nCyclesPerSecond), all we can do is yield for as little time as possible (ie, 0ms) and hope that the
         * simulation is at least usable.
         */
        msRemainsThisRun = 0;
    }

    /*
     * Last but not least, update nCyclesRecalc, so that when runCPU() starts up again and calls calcStartTime(),
     * it'll be ready to decide if calcCycles() should be called again.
     */
    this.aCounts.nCyclesRecalc += this.aCounts.nCyclesThisRun;

    if (DEBUG && this.messageEnabled(Messages.LOG) && msRemainsThisRun) {
        this.log("calcRemainingTime: " + msRemainsThisRun + "ms to sleep after " + this.aCounts.msEndThisRun + "ms");
    }

    this.aCounts.msEndThisRun += msRemainsThisRun;
    return msRemainsThisRun;
};

/**
 * runCPU(fUpdateFocus)
 *
 * @this {CPU}
 * @param {boolean} [fUpdateFocus] is true to update Computer focus
 */
CPU.prototype.runCPU = function(fUpdateFocus)
{
    if (!this.setBusy(true)) {
        this.updateCPU();
        if (this.cmp) this.cmp.stop(usr.getTime(), this.getCycles());
        return;
    }

    this.startCPU(fUpdateFocus);

    /*
     *  calcStartTime() initializes the cycle counter and timestamp for this runCPU() invocation, and optionally
     *  recalculates the the maximum number of cycles for each burst if the nCyclesRecalc threshold has been reached.
     */
    this.calcStartTime();
    try {
        do {
            var nCyclesPerBurst = (this.flags.fChecksum? 1 : this.aCounts.nCyclesPerBurst);

            /*
             * nCyclesPerBurst is how many cycles we WANT to run on each iteration of stepCPU(), but it may run
             * significantly less (or slightly more, since we can't execute partial instructions).
             */
            this.stepCPU(nCyclesPerBurst);

            /*
             * nBurstCycles, less any remaining nStepCycles, is how many cycles stepCPU() ACTUALLY ran (nCycles).
             * We add that to nCyclesThisRun, as well as nRunCycles, which is the cycle count since the CPU first
             * started running.
             */
            var nCycles = this.nBurstCycles - this.nStepCycles;
            this.nRunCycles += nCycles;
            this.aCounts.nCyclesThisRun += nCycles;
            this.addCycles(0, true);
            this.updateChecksum(nCycles);

            this.aCounts.nCyclesNextVideoUpdate -= nCycles;
            if (this.aCounts.nCyclesNextVideoUpdate <= 0) {
                this.aCounts.nCyclesNextVideoUpdate += this.aCounts.nCyclesPerVideoUpdate;
                if (this.cmp) this.cmp.updateVideo(this.aCounts.nVideoUpdates++);
                if (this.aCounts.nVideoUpdates > this.refreshRate) this.aCounts.nVideoUpdates = 0;
            }

            this.aCounts.nCyclesNextStatusUpdate -= nCycles;
            if (this.aCounts.nCyclesNextStatusUpdate <= 0) {
                this.aCounts.nCyclesNextStatusUpdate += this.aCounts.nCyclesPerStatusUpdate;
                if (this.cmp) this.cmp.updateStatus();
            }

            this.aCounts.nCyclesNextYield -= nCycles;
            if (this.aCounts.nCyclesNextYield <= 0) {
                this.aCounts.nCyclesNextYield += this.aCounts.nCyclesPerYield;
                break;
            }
        } while (this.flags.fRunning);
    }
    catch (e) {
        this.stopCPU();
        this.updateCPU();
        if (this.cmp) this.cmp.stop(usr.getTime(), this.getCycles());
        this.setBusy(false);
        this.setError(e.stack || e.message);
        return;
    }
    setTimeout(this.onRunTimeout, this.calcRemainingTime());
};

/**
 * startCPU(fUpdateFocus)
 *
 * WARNING: Other components must use runCPU() to get the CPU running; this is a runCPU() helper function only.
 *
 * @param {boolean} [fUpdateFocus]
 */
CPU.prototype.startCPU = function(fUpdateFocus)
{
    if (!this.flags.fRunning) {
        /*
         *  setSpeed() without a speed parameter leaves the selected speed in place, but also resets the
         *  cycle counter and timestamp for the current series of runCPU() calls, calculates the maximum number
         *  of cycles for each burst based on the last known effective CPU speed, and resets the nCyclesRecalc
         *  threshold counter.
         */
        this.setSpeed();
        if (this.cmp) this.cmp.start(this.aCounts.msStartRun, this.getCycles());
        this.flags.fRunning = true;
        this.flags.fStarting = true;
        if (this.chipset) this.chipset.start();
        var controlRun = this.bindings["run"];
        if (controlRun) controlRun.textContent = "Halt";
        if (this.cmp) {
            this.cmp.updateStatus(true);
            if (fUpdateFocus) this.cmp.updateFocus(true);
        }
    }
};

/**
 * stepCPU(nMinCycles)
 *
 * This will be implemented by the CPUState component.
 *
 * @this {CPU}
 * @param {number} nMinCycles (0 implies a single-step, and therefore breakpoints should be ignored)
 * @return {number} of cycles executed; 0 indicates that the last instruction was not executed
 */
CPU.prototype.stepCPU = function(nMinCycles)
{
    return 0;
};

/**
 * stopCPU(fComplete)
 *
 * For use by any component that wants to stop the CPU.
 *
 * This similar to yieldCPU(), but it doesn't need to zero nCyclesNextYield to break out of runCPU();
 * it simply needs to clear fRunning (well, "simply" may be oversimplifying a bit....)
 *
 * @this {CPU}
 * @param {boolean} [fComplete]
 */
CPU.prototype.stopCPU = function(fComplete)
{
    this.isBusy(true);
    this.nBurstCycles -= this.nStepCycles;
    this.nStepCycles = 0;
    this.addCycles(this.nRunCycles);
    this.nRunCycles = 0;
    if (this.flags.fRunning) {
        this.flags.fRunning = false;
        if (this.chipset) this.chipset.stop();
        var controlRun = this.bindings["run"];
        if (controlRun) controlRun.textContent = "Run";
    }
    this.flags.fComplete = fComplete;
};

/**
 * updateCPU(fForce)
 *
 * This used to be performed at the end of every stepCPU(), but runCPU() -- which relies upon
 * stepCPU() -- needed to have more control over when these updates are performed.  However, for
 * other callers of stepCPU(), such as the Debugger, the combination of stepCPU() + updateCPU()
 * provides the old behavior.
 *
 * @this {CPU}
 * @param {boolean} [fForce] (true to force a video update; used by the Debugger)
 */
CPU.prototype.updateCPU = function(fForce)
{
    if (this.cmp) {
        this.cmp.updateVideo(-1);
        this.cmp.updateStatus(fForce);
    }
};

/**
 * yieldCPU()
 *
 * Similar to stopCPU() with regard to how it resets various cycle countdown values, but the CPU
 * remains in a "running" state.
 *
 * @this {CPU}
 */
CPU.prototype.yieldCPU = function()
{
    this.aCounts.nCyclesNextYield = 0;  // this will break us out of runCPU(), once we break out of stepCPU()
    this.nBurstCycles -= this.nStepCycles;
    this.nStepCycles = 0;               // this will break us out of stepCPU()
    // if (DEBUG) this.nSnapCycles = this.nBurstCycles;
    /*
     * The Debugger calls yieldCPU() after every message() to ensure browser responsiveness, but it looks
     * odd for those messages to show CPU state changes but for the CPU's own status display to not (ditto
     * for the Video display), so I've added this call to try to keep things looking synchronized.
     */
    this.updateCPU();
};


// ./modules/pc8080/lib/cpustate.js

/**
 * @fileoverview Implements the PC8080 CPU component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
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


/**
 * CPUState(parmsCPU)
 *
 * The CPUState class uses the following (parmsCPU) properties:
 *
 *      model: a number (eg, 8080) that should match one of the CPUDef.MODEL_* values
 *
 * This extends the CPU class and passes any remaining parmsCPU properties to the CPU class
 * constructor, along with a default speed (cycles per second) based on the specified (or default)
 * CPU model number.
 *
 * The CPUState class was initially written to simulate a 8080 microprocessor, although over time
 * it may evolved to support other microprocessors (eg, the Zilog Z80).
 *
 * @constructor
 * @extends CPU
 * @param {Object} parmsCPU
 */
function CPUState(parmsCPU)
{
    this.model = +parmsCPU['model'] || CPUDef.MODEL_8080;

    var nCyclesDefault = 0;
    switch(this.model) {
    case CPUDef.MODEL_8080:
    default:
        nCyclesDefault = 1000000;
        break;
    }

    CPU.call(this, parmsCPU, nCyclesDefault);

    /*
     * Initialize processor operation to match the requested model
     */
    this.initProcessor();

    /*
     * A variety of stepCPU() state variables that don't strictly need to be initialized before the first
     * stepCPU() call, but it's good form to do so.
     */
    this.resetCycles();
    this.flags.fComplete = this.flags.fDebugCheck = false;

    /*
     * If there are no live registers to display, then updateStatus() can skip a bit....
     */
    this.cLiveRegs = 0;

    /*
     * Array of halt handlers, if any (see addHaltCheck)
     */
    this.afnHalt = [];
    this.addrReset = 0x0000;

    /*
     * This initial resetRegs() call is important to create all the registers, so that if/when we call restore(),
     * it will have something to fill in.
     */
    this.resetRegs();
}

Component.subclass(CPUState, CPU);

/**
 * addHaltCheck(fn)
 *
 * Records a function that will be called during HLT opcode processing.
 *
 * @this {CPUState}
 * @param {function(number)} fn
 */
CPUState.prototype.addHaltCheck = function(fn)
{
    this.afnHalt.push(fn);
};

/**
 * initProcessor()
 *
 * Interestingly, if I dynamically generate aOps as an array of functions bound to "this", using the bind()
 * method, overall performance is worse.  You would think that eliminating the need to use the call() method
 * on every opcode function invocation would be helpful, but it's not.  I'm not sure exactly why yet; perhaps
 * a Closure Compiler optimization is defeated when generating the function array at run-time instead of at
 * compile-time.
 *
 * @this {CPUState}
 */
CPUState.prototype.initProcessor = function()
{
    this.aOps = CPUDef.aOps8080;
};

/**
 * reset()
 *
 * @this {CPUState}
 */
CPUState.prototype.reset = function()
{
    if (this.flags.fRunning) this.stopCPU();
    this.resetRegs();
    this.resetCycles();
    this.clearError();      // clear any fatal error/exception that setError() may have flagged
    this.parent.reset.call(this);
};

/**
 * resetRegs()
 *
 * @this {CPUState}
 */
CPUState.prototype.resetRegs = function()
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
    this.intFlags = CPUDef.INTFLAG.NONE;
};

/**
 * setReset(addr)
 *
 * @this {CPUState}
 * @param {number} addr
 */
CPUState.prototype.setReset = function(addr)
{
    this.addrReset = addr;
    this.setPC(addr);
};

/**
 * getChecksum()
 *
 * @this {CPUState}
 * @return {number} a 32-bit summation of key elements of the current CPU state (used by the CPU checksum code)
 */
CPUState.prototype.getChecksum = function()
{
    var sum = (this.regA + this.regB + this.regC + this.regD + this.regE + this.regH + this.regL)|0;
    sum = (sum + this.getSP() + this.getPC() + this.getPS())|0;
    return sum;
};

/**
 * save()
 *
 * This implements save support for the CPUState component.
 *
 * @this {CPUState}
 * @return {Object|null}
 */
CPUState.prototype.save = function()
{
    var state = new State(this);
    state.set(0, [this.regA, this.regB, this.regC, this.regD, this.regE, this.regH, this.regL, this.getSP(), this.getPC(), this.getPS()]);
    state.set(1, [this.intFlags, this.nTotalCycles, this.getSpeed()]);
    state.set(2, this.bus.saveMemory());
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the CPUState component.
 *
 * @this {CPUState}
 * @param {Object} data
 * @return {boolean} true if restore successful, false if not
 */
CPUState.prototype.restore = function(data)
{
    var a = data[0];
    this.regA = a[0];
    this.regB = a[1];
    this.regC = a[2];
    this.regD = a[3];
    this.regE = a[4];
    this.regH = a[5];
    this.regL = a[6];
    this.setSP(a[7]);
    this.setPC(a[8]);
    this.setPS(a[9]);
    a = data[1];
    this.intFlags = a[0];
    this.nTotalCycles = a[1];
    this.setSpeed(a[3]);
    return this.bus.restoreMemory(data[2]);
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {CPUState}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "AX")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
CPUState.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    var fBound = false;
    switch (sBinding) {
    case "A":
    case "B":
    case "C":
    case "BC":
    case "D":
    case "E":
    case "DE":
    case "H":
    case "L":
    case "HL":
    case "SP":
    case "PC":
    case "PS":
    case "IF":
    case "SF":
    case "ZF":
    case "AF":
    case "PF":
    case "CF":
        this.bindings[sBinding] = control;
        this.cLiveRegs++;
        fBound = true;
        break;
    default:
        fBound = this.parent.setBinding.call(this, sHTMLType, sBinding, control);
        break;
    }
    return fBound;
};

/**
 * getBC()
 *
 * @this {CPUState}
 * @return {number}
 */
CPUState.prototype.getBC = function()
{
    return (this.regB << 8) | this.regC;
};

/**
 * setBC(w)
 *
 * @this {CPUState}
 * @param {number} w
 */
CPUState.prototype.setBC = function(w)
{
    this.regB = (w >> 8) & 0xff;
    this.regC = w & 0xff;
};

/**
 * getDE()
 *
 * @this {CPUState}
 * @return {number}
 */
CPUState.prototype.getDE = function()
{
    return (this.regD << 8) | this.regE;
};

/**
 * setDE(w)
 *
 * @this {CPUState}
 * @param {number} w
 */
CPUState.prototype.setDE = function(w)
{
    this.regD = (w >> 8) & 0xff;
    this.regE = w & 0xff;
};

/**
 * getHL()
 *
 * @this {CPUState}
 * @return {number}
 */
CPUState.prototype.getHL = function()
{
    return (this.regH << 8) | this.regL;
};

/**
 * setHL(w)
 *
 * @this {CPUState}
 * @param {number} w
 */
CPUState.prototype.setHL = function(w)
{
    this.regH = (w >> 8) & 0xff;
    this.regL = w & 0xff;
};

/**
 * getSP()
 *
 * @this {CPUState}
 * @return {number}
 */
CPUState.prototype.getSP = function()
{
    return this.regSP;
};

/**
 * setSP(off)
 *
 * @this {CPUState}
 * @param {number} off
 */
CPUState.prototype.setSP = function(off)
{
    this.regSP = off & 0xffff;
};

/**
 * getPC()
 *
 * @this {CPUState}
 * @return {number}
 */
CPUState.prototype.getPC = function()
{
    return this.regPC;
};

/**
 * offPC()
 *
 * @this {CPUState}
 * @param {number} off
 * @return {number}
 */
CPUState.prototype.offPC = function(off)
{
    return (this.regPC + off) & 0xffff;
};

/**
 * setPC(off)
 *
 * @this {CPUState}
 * @param {number} off
 */
CPUState.prototype.setPC = function(off)
{
    this.regPC = off & 0xffff;
};

/**
 * clearCF()
 *
 * @this {CPUState}
 */
CPUState.prototype.clearCF = function()
{
    this.resultZeroCarry &= 0xff;
};

/**
 * getCF()
 *
 * @this {CPUState}
 * @return {number} 0 or 1 (CPUDef.PS.CF)
 */
CPUState.prototype.getCF = function()
{
    return (this.resultZeroCarry & 0x100)? CPUDef.PS.CF : 0;
};

/**
 * setCF()
 *
 * @this {CPUState}
 */
CPUState.prototype.setCF = function()
{
    this.resultZeroCarry |= 0x100;
};

/**
 * updateCF(CF)
 *
 * @this {CPUState}
 * @param {number} CF (0x000 or 0x100)
 */
CPUState.prototype.updateCF = function(CF)
{
    this.resultZeroCarry = (this.resultZeroCarry & 0xff) | CF;
};

/**
 * clearPF()
 *
 * @this {CPUState}
 */
CPUState.prototype.clearPF = function()
{
    if (this.getPF()) this.resultParitySign ^= 0x1;
};

/**
 * getPF()
 *
 * @this {CPUState}
 * @return {number} 0 or CPUDef.PS.PF
 */
CPUState.prototype.getPF = function()
{
    return (CPUDef.PARITY[this.resultParitySign & 0xff])? CPUDef.PS.PF : 0;
};

/**
 * setPF()
 *
 * @this {CPUState}
 */
CPUState.prototype.setPF = function()
{
    if (!this.getPF()) this.resultParitySign ^= 0x1;
};

/**
 * clearAF()
 *
 * @this {CPUState}
 */
CPUState.prototype.clearAF = function()
{
    this.resultAuxOverflow = (this.resultParitySign & 0x10) | (this.resultAuxOverflow & ~0x10);
};

/**
 * getAF()
 *
 * @this {CPUState}
 * @return {number} 0 or CPUDef.PS.AF
 */
CPUState.prototype.getAF = function()
{
    return ((this.resultParitySign ^ this.resultAuxOverflow) & 0x10)? CPUDef.PS.AF : 0;
};

/**
 * setAF()
 *
 * @this {CPUState}
 */
CPUState.prototype.setAF = function()
{
    this.resultAuxOverflow = (~this.resultParitySign & 0x10) | (this.resultAuxOverflow & ~0x10);
};

/**
 * clearZF()
 *
 * @this {CPUState}
 */
CPUState.prototype.clearZF = function()
{
    this.resultZeroCarry |= 0xff;
};

/**
 * getZF()
 *
 * @this {CPUState}
 * @return {number} 0 or CPUDef.PS.ZF
 */
CPUState.prototype.getZF = function()
{
    return (this.resultZeroCarry & 0xff)? 0 : CPUDef.PS.ZF;
};

/**
 * setZF()
 *
 * @this {CPUState}
 */
CPUState.prototype.setZF = function()
{
    this.resultZeroCarry &= ~0xff;
};

/**
 * clearSF()
 *
 * @this {CPUState}
 */
CPUState.prototype.clearSF = function()
{
    if (this.getSF()) this.resultParitySign ^= 0xc0;
};

/**
 * getSF()
 *
 * @this {CPUState}
 * @return {number} 0 or CPUDef.PS.SF
 */
CPUState.prototype.getSF = function()
{
    return (this.resultParitySign & 0x80)? CPUDef.PS.SF : 0;
};

/**
 * setSF()
 *
 * @this {CPUState}
 */
CPUState.prototype.setSF = function()
{
    if (!this.getSF()) this.resultParitySign ^= 0xc0;
};

/**
 * clearIF()
 *
 * @this {CPUState}
 */
CPUState.prototype.clearIF = function()
{
    this.regPS &= ~CPUDef.PS.IF;
};

/**
 * getIF()
 *
 * @this {CPUState}
 * @return {number} 0 or CPUDef.PS.IF
 */
CPUState.prototype.getIF = function()
{
    return (this.regPS & CPUDef.PS.IF);
};

/**
 * setIF()
 *
 * @this {CPUState}
 */
CPUState.prototype.setIF = function()
{
    this.regPS |= CPUDef.PS.IF;
};

/**
 * getPS()
 *
 * @this {CPUState}
 * @return {number}
 */
CPUState.prototype.getPS = function()
{
    return (this.regPS & ~CPUDef.PS.RESULT) | (this.getSF() | this.getZF() | this.getAF() | this.getPF() | this.getCF());
};

/**
 * setPS(regPS)
 *
 * @this {CPUState}
 * @param {number} regPS
 */
CPUState.prototype.setPS = function(regPS)
{
    this.resultZeroCarry = this.resultParitySign = this.resultAuxOverflow = 0;
    if (regPS & CPUDef.PS.CF) this.resultZeroCarry |= 0x100;
    if (!(regPS & CPUDef.PS.PF)) this.resultParitySign |= 0x01;
    if (regPS & CPUDef.PS.AF) this.resultAuxOverflow |= 0x10;
    if (!(regPS & CPUDef.PS.ZF)) this.resultZeroCarry |= 0xff;
    if (regPS & CPUDef.PS.SF) this.resultParitySign ^= 0xc0;
    this.regPS = (this.regPS & ~(CPUDef.PS.RESULT | CPUDef.PS.INTERNAL)) | (regPS & CPUDef.PS.INTERNAL) | CPUDef.PS.SET;

};

/**
 * getPSW()
 *
 * @this {CPUState}
 * @return {number}
 */
CPUState.prototype.getPSW = function()
{
    return (this.getPS() & CPUDef.PS.MASK) | (this.regA << 8);
};

/**
 * setPSW(w)
 *
 * @this {CPUState}
 * @param {number} w
 */
CPUState.prototype.setPSW = function(w)
{
    this.setPS((w & CPUDef.PS.MASK) | (this.regPS & ~CPUDef.PS.MASK));
    this.regA = w >> 8;
};

/**
 * addByte(src)
 *
 * @this {CPUState}
 * @param {number} src
 * @return {number} regA + src
 */
CPUState.prototype.addByte = function(src)
{
    this.resultAuxOverflow = this.regA ^ src;
    return this.resultParitySign = (this.resultZeroCarry = this.regA + src) & 0xff;
};

/**
 * addByteCarry(src)
 *
 * @this {CPUState}
 * @param {number} src
 * @return {number} regA + src + carry
 */
CPUState.prototype.addByteCarry = function(src)
{
    this.resultAuxOverflow = this.regA ^ src;
    return this.resultParitySign = (this.resultZeroCarry = this.regA + src + ((this.resultZeroCarry & 0x100)? 1 : 0)) & 0xff;
};

/**
 * andByte(src)
 *
 * Ordinarily, one would expect the Auxiliary Carry flag (AF) to be clear after this operation,
 * but apparently the 8080 will set AF if bit 3 in either operand is set.
 *
 * @this {CPUState}
 * @param {number} src
 * @return {number} regA & src
 */
CPUState.prototype.andByte = function(src)
{
    this.resultZeroCarry = this.resultParitySign = this.resultAuxOverflow = this.regA & src;
    if ((this.regA | src) & 0x8) this.resultAuxOverflow ^= 0x10;        // set AF by inverting bit 4 in resultAuxOverflow
    return this.resultZeroCarry;
};

/**
 * decByte(b)
 *
 * We perform this operation using 8-bit two's complement arithmetic, by negating and then adding
 * the implied src of 1.  This appears to mimic how the 8080 manages the Auxiliary Carry flag (AF).
 *
 * @this {CPUState}
 * @param {number} b
 * @return {number}
 */
CPUState.prototype.decByte = function(b)
{
    this.resultAuxOverflow = b ^ 0xff;
    b = this.resultParitySign = (b + 0xff) & 0xff;
    this.resultZeroCarry = (this.resultZeroCarry & ~0xff) | b;
    return b;
};

/**
 * incByte(b)
 *
 * @this {CPUState}
 * @param {number} b
 * @return {number}
 */
CPUState.prototype.incByte = function(b)
{
    this.resultAuxOverflow = b;
    b = this.resultParitySign = (b + 1) & 0xff;
    this.resultZeroCarry = (this.resultZeroCarry & ~0xff) | b;
    return b;
};

/**
 * orByte(src)
 *
 * @this {CPUState}
 * @param {number} src
 * @return {number} regA | src
 */
CPUState.prototype.orByte = function(src)
{
    return this.resultParitySign = this.resultZeroCarry = this.resultAuxOverflow = this.regA | src;
};

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
 * @this {CPUState}
 * @param {number} src
 * @return {number} regA - src
 */
CPUState.prototype.subByte = function(src)
{
    src ^= 0xff;
    this.resultAuxOverflow = this.regA ^ src;
    return this.resultParitySign = (this.resultZeroCarry = (this.regA + src + 1) ^ 0x100) & 0xff;
};

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
 * @this {CPUState}
 * @param {number} src
 * @return {number} regA - src - carry
 */
CPUState.prototype.subByteBorrow = function(src)
{
    src ^= 0xff;
    this.resultAuxOverflow = this.regA ^ src;
    return this.resultParitySign = (this.resultZeroCarry = (this.regA + src + ((this.resultZeroCarry & 0x100)? 0 : 1)) ^ 0x100) & 0xff;
};

/**
 * xorByte(src)
 *
 * @this {CPUState}
 * @param {number} src
 * @return {number} regA ^ src
 */
CPUState.prototype.xorByte = function(src)
{
    return this.resultParitySign = this.resultZeroCarry = this.resultAuxOverflow = this.regA ^ src;
};

/**
 * getByte(addr)
 *
 * @this {CPUState}
 * @param {number} addr is a linear address
 * @return {number} byte (8-bit) value at that address
 */
CPUState.prototype.getByte = function(addr)
{
    return this.bus.getByte(addr);
};

/**
 * getWord(addr)
 *
 * @this {CPUState}
 * @param {number} addr is a linear address
 * @return {number} word (16-bit) value at that address
 */
CPUState.prototype.getWord = function(addr)
{
    return this.bus.getShort(addr);
};

/**
 * setByte(addr, b)
 *
 * @this {CPUState}
 * @param {number} addr is a linear address
 * @param {number} b is the byte (8-bit) value to write (which we truncate to 8 bits; required by opSTOSb)
 */
CPUState.prototype.setByte = function(addr, b)
{
    this.bus.setByte(addr, b);
};

/**
 * setWord(addr, w)
 *
 * @this {CPUState}
 * @param {number} addr is a linear address
 * @param {number} w is the word (16-bit) value to write (which we truncate to 16 bits to be safe)
 */
CPUState.prototype.setWord = function(addr, w)
{
    this.bus.setShort(addr, w);
};

/**
 * getPCByte()
 *
 * @this {CPUState}
 * @return {number} byte at the current PC; PC advanced by 1
 */
CPUState.prototype.getPCByte = function()
{
    var b = this.getByte(this.regPC);
    this.setPC(this.regPC + 1);
    return b;
};

/**
 * getPCWord()
 *
 * @this {CPUState}
 * @return {number} word at the current PC; PC advanced by 2
 */
CPUState.prototype.getPCWord = function()
{
    var w = this.getWord(this.regPC);
    this.setPC(this.regPC + 2);
    return w;
};

/**
 * popWord()
 *
 * @this {CPUState}
 * @return {number} word popped from the current SP; SP increased by 2
 */
CPUState.prototype.popWord = function()
{
    var w = this.getWord(this.regSP);
    this.setSP(this.regSP + 2);
    return w;
};

/**
 * pushWord(w)
 *
 * @this {CPUState}
 * @param {number} w is the word (16-bit) value to push at current SP; SP decreased by 2
 */
CPUState.prototype.pushWord = function(w)
{
    this.setSP(this.regSP - 2);
    this.setWord(this.regSP, w);
};

/**
 * checkINTR()
 *
 * @this {CPUState}
 * @return {boolean} true if h/w interrupt has just been acknowledged, false if not
 */
CPUState.prototype.checkINTR = function()
{
    if ((this.intFlags & CPUDef.INTFLAG.INTR) && this.getIF()) {
        var bRST = CPUDef.OPCODE.RST0 | ((this.intFlags & CPUDef.INTFLAG.INTL) << 3);
        this.clearINTR();
        this.clearIF();
        this.aOps[bRST].call(this);
        return true;
    }
    return false;
};

/**
 * clearINTR()
 *
 * @this {CPUState}
 */
CPUState.prototype.clearINTR = function()
{
    this.intFlags &= ~(CPUDef.INTFLAG.INTL | CPUDef.INTFLAG.INTR);
};

/**
 * requestINTR(nLevel)
 *
 * This is called by any component that wants to request a h/w interrupt.
 *
 * NOTE: We allow INTR to be set regardless of the current state of interrupt flag (IF), on the theory
 * that if/when the CPU briefly turns interrupts off, it shouldn't lose the last h/w interrupt requested.
 * So instead of ignoring INTR here, checkINTR() ignores INTR as long as the interrupt flag (IF) is clear.
 *
 * The downside is that, as long as the CPU has interrupts disabled, an active INTR state will slow stepCPU()
 * down slightly.  We could avoid that by introducing a two-stage interrupt tracking system, where a separate
 * variable keeps track of the last interrupt requested whenever the interrupt flag (IF) is clear, and when
 * setIF() finally occurs, that interrupt is propagated to intFlags.  But for now, we're going to assume that
 * scenario is rare.
 *
 * @this {CPUState}
 * @param {number} nLevel (0-7)
 */
CPUState.prototype.requestINTR = function(nLevel)
{
    this.intFlags = (this.intFlags & ~CPUDef.INTFLAG.INTL) | nLevel | CPUDef.INTFLAG.INTR;
};

/**
 * updateReg(sReg, nValue, cch)
 *
 * This function helps updateStatus() by massaging the register names and values according to
 * CPU type before passing the call to displayValue(); in the "old days", updateStatus() called
 * displayValue() directly (although then it was called displayReg()).
 *
 * @this {CPUState}
 * @param {string} sReg
 * @param {number} nValue
 * @param {number} [cch] (default is 2 hex digits)
 */
CPUState.prototype.updateReg = function(sReg, nValue, cch)
{
    this.displayValue(sReg, nValue, cch || 2);
};

/**
 * updateStatus(fForce)
 *
 * This provides periodic Control Panel updates (eg, a few times per second; see STATUS_UPDATES_PER_SECOND).
 * this is where we take care of any DOM updates (eg, register values) while the CPU is running.
 *
 * Any high-frequency updates should be performed in updateVideo(), which should avoid DOM updates, since updateVideo()
 * can be called up to 60 times per second (see VIDEO_UPDATES_PER_SECOND).
 *
 * @this {CPUState}
 * @param {boolean} [fForce] (true will display registers even if the CPU is running and "live" registers are not enabled)
 */
CPUState.prototype.updateStatus = function(fForce)
{
    if (this.cLiveRegs) {
        if (fForce || !this.flags.fRunning || this.flags.fDisplayLiveRegs) {
            this.updateReg("A", this.regA);
            this.updateReg("B", this.regB);
            this.updateReg("C", this.regC);
            this.updateReg("BC", this.getBC(), 4);
            this.updateReg("D", this.regD);
            this.updateReg("E", this.regE);
            this.updateReg("DE", this.getDE(), 4);
            this.updateReg("H", this.regH);
            this.updateReg("L", this.regL);
            this.updateReg("HL", this.getHL(), 4);
            this.updateReg("SP", this.getSP(), 4);
            this.updateReg("PC", this.getPC(), 4);
            var regPS = this.getPS();
            this.updateReg("PS", regPS, 4);
            this.updateReg("IF", (regPS & CPUDef.PS.IF)? 1 : 0, 1);
            this.updateReg("SF", (regPS & CPUDef.PS.SF)? 1 : 0, 1);
            this.updateReg("ZF", (regPS & CPUDef.PS.ZF)? 1 : 0, 1);
            this.updateReg("AF", (regPS & CPUDef.PS.AF)? 1 : 0, 1);
            this.updateReg("PF", (regPS & CPUDef.PS.PF)? 1 : 0, 1);
            this.updateReg("CF", (regPS & CPUDef.PS.CF)? 1 : 0, 1);
        }
    }
    var controlSpeed = this.bindings["speed"];
    if (controlSpeed) controlSpeed.textContent = this.getSpeedCurrent();
};

/**
 * stepCPU(nMinCycles)
 *
 * NOTE: Single-stepping should not be confused with the Trap flag; single-stepping is a Debugger
 * operation that's completely independent of Trap status.  The CPU can go in and out of Trap mode,
 * in and out of h/w interrupt service routines (ISRs), etc, but from the Debugger's perspective,
 * they're all one continuous stream of instructions that can be stepped or run at will.  Moreover,
 * stepping vs. running should never change the behavior of the simulation.
 *
 * As a result, the Debugger's complete independence means you can run other 8086/8088 debuggers
 * (eg, DEBUG) inside the simulation without interference; you can even "debug" them with the Debugger.
 *
 * @this {CPUState}
 * @param {number} nMinCycles (0 implies a single-step, and therefore breakpoints should be ignored)
 * @return {number} of cycles executed; 0 indicates a pre-execution condition (ie, an execution breakpoint
 * was hit), -1 indicates a post-execution condition (eg, a read or write breakpoint was hit), and a positive
 * number indicates successful completion of that many cycles (which should always be >= nMinCycles).
 */
CPUState.prototype.stepCPU = function(nMinCycles)
{
    /*
     * The Debugger uses fComplete to determine if the instruction completed (true) or was interrupted
     * by a breakpoint or some other exceptional condition (false).  NOTE: this does NOT include JavaScript
     * exceptions, which stepCPU() expects the caller to catch using its own exception handler.
     *
     * The CPU relies on the use of stopCPU() rather than fComplete, because the CPU never single-steps
     * (ie, nMinCycles is always some large number), whereas the Debugger does.  And conversely, when the
     * Debugger is single-stepping (even when performing multiple single-steps), fRunning is never set,
     * so stopCPU() would have no effect as far as the Debugger is concerned.
     */
    this.flags.fComplete = true;

    /*
     * fDebugCheck is true if we need to "check" every instruction with the Debugger.
     */
    var fDebugCheck = this.flags.fDebugCheck = (DEBUGGER && this.dbg && this.dbg.checksEnabled());

    /*
     * nDebugState is checked only when fDebugCheck is true, and its sole purpose is to tell the first call
     * to checkInstruction() that it can skip breakpoint checks, and that will be true ONLY when fStarting is
     * true OR nMinCycles is zero (the latter means the Debugger is single-stepping).
     *
     * Once we snap fStarting, we clear it, because technically, we've moved beyond "starting" and have
     * officially "started" now.
     */
    var nDebugState = (!nMinCycles)? -1 : (this.flags.fStarting? 0 : 1);
    this.flags.fStarting = false;

    /*
     * We move the minimum cycle count to nStepCycles (the number of cycles left to step), so that other
     * functions have the ability to force that number to zero (eg, stopCPU()), and thus we don't have to check
     * any other criteria to determine whether we should continue stepping or not.
     */
    this.nBurstCycles = this.nStepCycles = nMinCycles;

    do {
        if (this.intFlags) {
            if (this.checkINTR()) {
                if (!nMinCycles) {

                    if (DEBUGGER) {
                        this.println("interrupt dispatched");
                        break;
                    }
                }
            }
            else if (this.intFlags & CPUDef.INTFLAG.HALT) {
                /*
                 * As discussed in opHLT(), the CPU is never REALLY halted by a HLT instruction; instead,
                 * opHLT() sets CPUDef.INTFLAG.HALT, signalling to us that we're free to end the current burst
                 * AND that we should not execute any more instructions until checkINTR() indicates a hardware
                 * interrupt has been requested.
                 *
                 * One downside to this approach is that it *might* appear to the careful observer that we
                 * executed a full complement of instructions during bursts where CPUDef.INTFLAG.HALT was set,
                 * when in fact we did not.  However, the steady advance of the overall cycle count, and thus
                 * the steady series calls to stepCPU(), is needed to ensure that timer updates, video updates,
                 * etc, all continue to occur at the expected rates.
                 *
                 * If necessary, we can add another bookkeeping cycle counter (eg, one that keeps tracks of the
                 * number of cycles during which we did not actually execute any instructions).
                 */
                this.nStepCycles = 0;
                break;
            }
        }

        if (DEBUGGER && fDebugCheck) {
            if (this.dbg.checkInstruction(this.regPC, nDebugState)) {
                this.stopCPU();
                break;
            }
            nDebugState = 1;
        }

        this.aOps[this.getPCByte()].call(this);

    } while (this.nStepCycles > 0);

    return (this.flags.fComplete? this.nBurstCycles - this.nStepCycles : (this.flags.fComplete === undefined? 0 : -1));
};

/**
 * CPUState.init()
 *
 * This function operates on every HTML element of class "cpu", extracting the
 * JSON-encoded parameters for the CPUState constructor from the element's "data-value"
 * attribute, invoking the constructor (which in turn invokes the CPU constructor)
 * to create a CPUState component, and then binding any associated HTML controls to the
 * new component.
 */
CPUState.init = function()
{
    var aeCPUs = Component.getElementsByClass(document, PC8080.APPCLASS, "cpu");
    for (var iCPU = 0; iCPU < aeCPUs.length; iCPU++) {
        var eCPU = aeCPUs[iCPU];
        var parmsCPU = Component.getComponentParms(eCPU);
        var cpu = new CPUState(parmsCPU);
        Component.bindComponentControls(cpu, eCPU, PC8080.APPCLASS);
    }
};

/*
 * Initialize every CPU module on the page
 */
web.onInit(CPUState.init);


// ./modules/pc8080/lib/cpuops.js

/**
 * @fileoverview Implements PC8080 opcode handlers.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-20
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


/**
 * op=0x00 (NOP)
 *
 * @this {CPUState}
 */
CPUDef.opNOP = function()
{
    this.nStepCycles -= 4;
};

/**
 * op=0x01 (LXI B,d16)
 *
 * @this {CPUState}
 */
CPUDef.opLXIB = function()
{
    this.setBC(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x02 (STAX B)
 *
 * @this {CPUState}
 */
CPUDef.opSTAXB = function()
{
    this.setByte(this.getBC(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x03 (INX B)
 *
 * @this {CPUState}
 */
CPUDef.opINXB = function()
{
    this.setBC(this.getBC() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x04 (INR B)
 *
 * @this {CPUState}
 */
CPUDef.opINRB = function()
{
    this.regB = this.incByte(this.regB);
    this.nStepCycles -= 5;
};

/**
 * op=0x05 (DCR B)
 *
 * @this {CPUState}
 */
CPUDef.opDCRB = function()
{
    this.regB = this.decByte(this.regB);
    this.nStepCycles -= 5;
};

/**
 * op=0x06 (MVI B,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIB = function()
{
    this.regB = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x07 (RLC)
 *
 * @this {CPUState}
 */
CPUDef.opRLC = function()
{
    var carry = this.regA << 1;
    this.regA = (carry & 0xff) | (carry >> 8);
    this.updateCF(carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x09 (DAD B)
 *
 * @this {CPUState}
 */
CPUDef.opDADB = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getBC());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x0A (LDAX B)
 *
 * @this {CPUState}
 */
CPUDef.opLDAXB = function()
{
    this.regA = this.getByte(this.getBC());
    this.nStepCycles -= 7;
};

/**
 * op=0x0B (DCX B)
 *
 * @this {CPUState}
 */
CPUDef.opDCXB = function()
{
    this.setBC(this.getBC() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x0C (INR C)
 *
 * @this {CPUState}
 */
CPUDef.opINRC = function()
{
    this.regC = this.incByte(this.regC);
    this.nStepCycles -= 5;
};

/**
 * op=0x0D (DCR C)
 *
 * @this {CPUState}
 */
CPUDef.opDCRC = function()
{
    this.regC = this.decByte(this.regC);
    this.nStepCycles -= 5;
};

/**
 * op=0x0E (MVI C,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIC = function()
{
    this.regC = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x0F (RRC)
 *
 * @this {CPUState}
 */
CPUDef.opRRC = function()
{
    var carry = (this.regA << 8) & 0x100;
    this.regA = (carry | this.regA) >> 1;
    this.updateCF(carry);
    this.nStepCycles -= 4;
};

/**
 * op=0x11 (LXI D,d16)
 *
 * @this {CPUState}
 */
CPUDef.opLXID = function()
{
    this.setDE(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x12 (STAX D)
 *
 * @this {CPUState}
 */
CPUDef.opSTAXD = function()
{
    this.setByte(this.getDE(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x13 (INX D)
 *
 * @this {CPUState}
 */
CPUDef.opINXD = function()
{
    this.setDE(this.getDE() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x14 (INR D)
 *
 * @this {CPUState}
 */
CPUDef.opINRD = function()
{
    this.regD = this.incByte(this.regD);
    this.nStepCycles -= 5;
};

/**
 * op=0x15 (DCR D)
 *
 * @this {CPUState}
 */
CPUDef.opDCRD = function()
{
    this.regD = this.decByte(this.regD);
    this.nStepCycles -= 5;
};

/**
 * op=0x16 (MVI D,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVID = function()
{
    this.regD = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x17 (RAL)
 *
 * @this {CPUState}
 */
CPUDef.opRAL = function()
{
    var carry = this.regA << 1;
    this.regA = (carry & 0xff) | this.getCF();
    this.updateCF(carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x19 (DAD D)
 *
 * @this {CPUState}
 */
CPUDef.opDADD = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getDE());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x1A (LDAX D)
 *
 * @this {CPUState}
 */
CPUDef.opLDAXD = function()
{
    this.regA = this.getByte(this.getDE());
    this.nStepCycles -= 7;
};

/**
 * op=0x1B (DCX D)
 *
 * @this {CPUState}
 */
CPUDef.opDCXD = function()
{
    this.setDE(this.getDE() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x1C (INR E)
 *
 * @this {CPUState}
 */
CPUDef.opINRE = function()
{
    this.regE = this.incByte(this.regE);
    this.nStepCycles -= 5;
};

/**
 * op=0x1D (DCR E)
 *
 * @this {CPUState}
 */
CPUDef.opDCRE = function()
{
    this.regE = this.decByte(this.regE);
    this.nStepCycles -= 5;
};

/**
 * op=0x1E (MVI E,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIE = function()
{
    this.regE = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x1F (RAR)
 *
 * @this {CPUState}
 */
CPUDef.opRAR = function()
{
    var carry = (this.regA << 8);
    this.regA = ((this.getCF() << 8) | this.regA) >> 1;
    this.updateCF(carry & 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x21 (LXI H,d16)
 *
 * @this {CPUState}
 */
CPUDef.opLXIH = function()
{
    this.setHL(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x22 (SHLD a16)
 *
 * @this {CPUState}
 */
CPUDef.opSHLD = function()
{
    this.setWord(this.getPCWord(), this.getHL());
    this.nStepCycles -= 16;
};

/**
 * op=0x23 (INX H)
 *
 * @this {CPUState}
 */
CPUDef.opINXH = function()
{
    this.setHL(this.getHL() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x24 (INR H)
 *
 * @this {CPUState}
 */
CPUDef.opINRH = function()
{
    this.regH = this.incByte(this.regH);
    this.nStepCycles -= 5;
};

/**
 * op=0x25 (DCR H)
 *
 * @this {CPUState}
 */
CPUDef.opDCRH = function()
{
    this.regH = this.decByte(this.regH);
    this.nStepCycles -= 5;
};

/**
 * op=0x26 (MVI H,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIH = function()
{
    this.regH = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x27 (DAA)
 *
 * @this {CPUState}
 */
CPUDef.opDAA = function()
{
    var src = 0;
    var CF = this.getCF();
    var AF = this.getAF();
    if (AF || (this.regA & 0x0F) > 9) {
        src |= 0x06;
    }
    if (CF || this.regA >= 0x9A) {
        src |= 0x60;
        CF = CPUDef.PS.CF;
    }
    this.regA = this.addByte(src);
    this.updateCF(CF? 0x100 : 0);
    this.nStepCycles -= 4;
};

/**
 * op=0x29 (DAD H)
 *
 * @this {CPUState}
 */
CPUDef.opDADH = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getHL());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x2A (LHLD a16)
 *
 * @this {CPUState}
 */
CPUDef.opLHLD = function()
{
    this.setHL(this.getWord(this.getPCWord()));
    this.nStepCycles -= 16;
};

/**
 * op=0x2B (DCX H)
 *
 * @this {CPUState}
 */
CPUDef.opDCXH = function()
{
    this.setHL(this.getHL() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x2C (INR L)
 *
 * @this {CPUState}
 */
CPUDef.opINRL = function()
{
    this.regL = this.incByte(this.regL);
    this.nStepCycles -= 5;
};

/**
 * op=0x2D (DCR L)
 *
 * @this {CPUState}
 */
CPUDef.opDCRL = function()
{
    this.regL = this.decByte(this.regL);
    this.nStepCycles -= 5;
};

/**
 * op=0x2E (MVI L,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIL = function()
{
    this.regL = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x2F (CMA)
 *
 * @this {CPUState}
 */
CPUDef.opCMA = function()
{
    this.regA = ~this.regA & 0xff;
    this.nStepCycles -= 4;
};

/**
 * op=0x31 (LXI SP,d16)
 *
 * @this {CPUState}
 */
CPUDef.opLXISP = function()
{
    this.setSP(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0x32 (STA a16)
 *
 * @this {CPUState}
 */
CPUDef.opSTA = function()
{
    this.setByte(this.getPCWord(), this.regA);
    this.nStepCycles -= 13;
};

/**
 * op=0x33 (INX SP)
 *
 * @this {CPUState}
 */
CPUDef.opINXSP = function()
{
    this.setSP(this.getSP() + 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x34 (INR M)
 *
 * @this {CPUState}
 */
CPUDef.opINRM = function()
{
    var addr = this.getHL();
    this.setByte(addr, this.incByte(this.getByte(addr)));
    this.nStepCycles -= 10;
};

/**
 * op=0x35 (DCR M)
 *
 * @this {CPUState}
 */
CPUDef.opDCRM = function()
{
    var addr = this.getHL();
    this.setByte(addr, this.decByte(this.getByte(addr)));
    this.nStepCycles -= 10;
};

/**
 * op=0x36 (MVI M,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIM = function()
{
    this.setByte(this.getHL(), this.getPCByte());
    this.nStepCycles -= 10;
};

/**
 * op=0x37 (STC)
 *
 * @this {CPUState}
 */
CPUDef.opSTC = function()
{
    this.setCF();
    this.nStepCycles -= 4;
};

/**
 * op=0x39 (DAD SP)
 *
 * @this {CPUState}
 */
CPUDef.opDADSP = function()
{
    var w;
    this.setHL(w = this.getHL() + this.getSP());
    this.updateCF((w >> 8) & 0x100);
    this.nStepCycles -= 10;
};

/**
 * op=0x3A (LDA a16)
 *
 * @this {CPUState}
 */
CPUDef.opLDA = function()
{
    this.regA = this.getByte(this.getPCWord());
    this.nStepCycles -= 13;
};

/**
 * op=0x3B (DCX SP)
 *
 * @this {CPUState}
 */
CPUDef.opDCXSP = function()
{
    this.setSP(this.getSP() - 1);
    this.nStepCycles -= 5;
};

/**
 * op=0x3C (INR A)
 *
 * @this {CPUState}
 */
CPUDef.opINRA = function()
{
    this.regA = this.incByte(this.regA);
    this.nStepCycles -= 5;
};

/**
 * op=0x3D (DCR A)
 *
 * @this {CPUState}
 */
CPUDef.opDCRA = function()
{
    this.regA = this.decByte(this.regA);
    this.nStepCycles -= 5;
};

/**
 * op=0x3E (MVI A,d8)
 *
 * @this {CPUState}
 */
CPUDef.opMVIA = function()
{
    this.regA = this.getPCByte();
    this.nStepCycles -= 7;
};

/**
 * op=0x3F (CMC)
 *
 * @this {CPUState}
 */
CPUDef.opCMC = function()
{
    this.updateCF(this.getCF()? 0 : 0x100);
    this.nStepCycles -= 4;
};

/**
 * op=0x40 (MOV B,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBB = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x41 (MOV B,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBC = function()
{
    this.regB = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x42 (MOV B,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBD = function()
{
    this.regB = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x43 (MOV B,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBE = function()
{
    this.regB = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x44 (MOV B,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBH = function()
{
    this.regB = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x45 (MOV B,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBL = function()
{
    this.regB = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x46 (MOV B,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBM = function()
{
    this.regB = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x47 (MOV B,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVBA = function()
{
    this.regB = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x48 (MOV C,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCB = function()
{
    this.regC = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x49 (MOV C,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCC = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x4A (MOV C,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCD = function()
{
    this.regC = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x4B (MOV C,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCE = function()
{
    this.regC = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x4C (MOV C,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCH = function()
{
    this.regC = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x4D (MOV C,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCL = function()
{
    this.regC = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x4E (MOV C,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCM = function()
{
    this.regC = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x4F (MOV C,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVCA = function()
{
    this.regC = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x50 (MOV D,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDB = function()
{
    this.regD = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x51 (MOV D,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDC = function()
{
    this.regD = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x52 (MOV D,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDD = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x53 (MOV D,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDE = function()
{
    this.regD = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x54 (MOV D,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDH = function()
{
    this.regD = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x55 (MOV D,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDL = function()
{
    this.regD = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x56 (MOV D,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDM = function()
{
    this.regD = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x57 (MOV D,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVDA = function()
{
    this.regD = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x58 (MOV E,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEB = function()
{
    this.regE = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x59 (MOV E,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEC = function()
{
    this.regE = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x5A (MOV E,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVED = function()
{
    this.regE = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x5B (MOV E,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEE = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x5C (MOV E,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEH = function()
{
    this.regE = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x5D (MOV E,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEL = function()
{
    this.regE = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x5E (MOV E,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEM = function()
{
    this.regE = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x5F (MOV E,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVEA = function()
{
    this.regE = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x60 (MOV H,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHB = function()
{
    this.regH = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x61 (MOV H,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHC = function()
{
    this.regH = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x62 (MOV H,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHD = function()
{
    this.regH = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x63 (MOV H,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHE = function()
{
    this.regH = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x64 (MOV H,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHH = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x65 (MOV H,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHL = function()
{
    this.regH = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x66 (MOV H,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHM = function()
{
    this.regH = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x67 (MOV H,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVHA = function()
{
    this.regH = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x68 (MOV L,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLB = function()
{
    this.regL = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x69 (MOV L,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLC = function()
{
    this.regL = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x6A (MOV L,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLD = function()
{
    this.regL = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x6B (MOV L,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLE = function()
{
    this.regL = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x6C (MOV L,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLH = function()
{
    this.regL = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x6D (MOV L,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLL = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x6E (MOV L,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLM = function()
{
    this.regL = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x6F (MOV L,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVLA = function()
{
    this.regL = this.regA;
    this.nStepCycles -= 5;
};

/**
 * op=0x70 (MOV M,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVMB = function()
{
    this.setByte(this.getHL(), this.regB);
    this.nStepCycles -= 7;
};

/**
 * op=0x71 (MOV M,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVMC = function()
{
    this.setByte(this.getHL(), this.regC);
    this.nStepCycles -= 7;
};

/**
 * op=0x72 (MOV M,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVMD = function()
{
    this.setByte(this.getHL(), this.regD);
    this.nStepCycles -= 7;
};

/**
 * op=0x73 (MOV M,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVME = function()
{
    this.setByte(this.getHL(), this.regE);
    this.nStepCycles -= 7;
};

/**
 * op=0x74 (MOV M,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVMH = function()
{
    this.setByte(this.getHL(), this.regH);
    this.nStepCycles -= 7;
};

/**
 * op=0x75 (MOV M,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVML = function()
{
    this.setByte(this.getHL(), this.regL);
    this.nStepCycles -= 7;
};

/**
 * op=0x76 (HLT)
 *
 * @this {CPUState}
 */
CPUDef.opHLT = function()
{
    /*
     * The CPU is never REALLY halted by a HLT instruction; instead, by setting X86.INTFLAG.HALT,
     * we are signalling to stepCPU() that it's free to end the current burst AND that it should not
     * execute any more instructions until checkINTR() indicates a hardware interrupt is requested.
     */
    var addr = this.getPC() - 1;

    /*
     * If any HLT check functions are installed, call them, and if any of them return true, then
     * immediately stop HLT processing.
     */
    if (this.afnHalt.length) {
        for (var i = 0; i < this.afnHalt.length; i++) {
            if (this.afnHalt[i](addr)) return;
        }
    }

    this.intFlags |= CPUDef.INTFLAG.HALT;
    this.nStepCycles -= 7;

    /*
     * If a Debugger is present and the HALT message category is enabled, then we REALLY halt the CPU,
     * on the theory that whoever's using the Debugger would like to see HLTs.
     */
    if (DEBUGGER && this.dbg && this.messageEnabled(Messages.HALT)) {
        this.setPC(addr);               // this is purely for the Debugger's benefit, to show the HLT
        this.dbg.stopCPU();
        return;
    }

    /*
     * We also REALLY halt the machine if interrupts have been disabled, since that means it's dead
     * in the water (we have no NMI generation mechanism at the moment).
     */
    if (!this.getIF()) {
        if (DEBUGGER && this.dbg) this.setPC(addr);
        this.stopCPU();
    }
};

/**
 * op=0x77 (MOV M,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVMA = function()
{
    this.setByte(this.getHL(), this.regA);
    this.nStepCycles -= 7;
};

/**
 * op=0x78 (MOV A,B)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAB = function()
{
    this.regA = this.regB;
    this.nStepCycles -= 5;
};

/**
 * op=0x79 (MOV A,C)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAC = function()
{
    this.regA = this.regC;
    this.nStepCycles -= 5;
};

/**
 * op=0x7A (MOV A,D)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAD = function()
{
    this.regA = this.regD;
    this.nStepCycles -= 5;
};

/**
 * op=0x7B (MOV A,E)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAE = function()
{
    this.regA = this.regE;
    this.nStepCycles -= 5;
};

/**
 * op=0x7C (MOV A,H)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAH = function()
{
    this.regA = this.regH;
    this.nStepCycles -= 5;
};

/**
 * op=0x7D (MOV A,L)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAL = function()
{
    this.regA = this.regL;
    this.nStepCycles -= 5;
};

/**
 * op=0x7E (MOV A,M)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAM = function()
{
    this.regA = this.getByte(this.getHL());
    this.nStepCycles -= 7;
};

/**
 * op=0x7F (MOV A,A)
 *
 * @this {CPUState}
 */
CPUDef.opMOVAA = function()
{
    this.nStepCycles -= 5;
};

/**
 * op=0x80 (ADD B)
 *
 * @this {CPUState}
 */
CPUDef.opADDB = function()
{
    this.regA = this.addByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x81 (ADD C)
 *
 * @this {CPUState}
 */
CPUDef.opADDC = function()
{
    this.regA = this.addByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x82 (ADD D)
 *
 * @this {CPUState}
 */
CPUDef.opADDD = function()
{
    this.regA = this.addByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x83 (ADD E)
 *
 * @this {CPUState}
 */
CPUDef.opADDE = function()
{
    this.regA = this.addByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x84 (ADD H)
 *
 * @this {CPUState}
 */
CPUDef.opADDH = function()
{
    this.regA = this.addByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x85 (ADD L)
 *
 * @this {CPUState}
 */
CPUDef.opADDL = function()
{
    this.regA = this.addByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x86 (ADD M)
 *
 * @this {CPUState}
 */
CPUDef.opADDM = function()
{
    this.regA = this.addByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x87 (ADD A)
 *
 * @this {CPUState}
 */
CPUDef.opADDA = function()
{
    this.regA = this.addByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0x88 (ADC B)
 *
 * @this {CPUState}
 */
CPUDef.opADCB = function()
{
    this.regA = this.addByteCarry(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x89 (ADC C)
 *
 * @this {CPUState}
 */
CPUDef.opADCC = function()
{
    this.regA = this.addByteCarry(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x8A (ADC D)
 *
 * @this {CPUState}
 */
CPUDef.opADCD = function()
{
    this.regA = this.addByteCarry(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x8B (ADC E)
 *
 * @this {CPUState}
 */
CPUDef.opADCE = function()
{
    this.regA = this.addByteCarry(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x8C (ADC H)
 *
 * @this {CPUState}
 */
CPUDef.opADCH = function()
{
    this.regA = this.addByteCarry(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x8D (ADC L)
 *
 * @this {CPUState}
 */
CPUDef.opADCL = function()
{
    this.regA = this.addByteCarry(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x8E (ADC M)
 *
 * @this {CPUState}
 */
CPUDef.opADCM = function()
{
    this.regA = this.addByteCarry(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x8F (ADC A)
 *
 * @this {CPUState}
 */
CPUDef.opADCA = function()
{
    this.regA = this.addByteCarry(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0x90 (SUB B)
 *
 * @this {CPUState}
 */
CPUDef.opSUBB = function()
{
    this.regA = this.subByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x91 (SUB C)
 *
 * @this {CPUState}
 */
CPUDef.opSUBC = function()
{
    this.regA = this.subByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x92 (SUB D)
 *
 * @this {CPUState}
 */
CPUDef.opSUBD = function()
{
    this.regA = this.subByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x93 (SUB E)
 *
 * @this {CPUState}
 */
CPUDef.opSUBE = function()
{
    this.regA = this.subByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x94 (SUB H)
 *
 * @this {CPUState}
 */
CPUDef.opSUBH = function()
{
    this.regA = this.subByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x95 (SUB L)
 *
 * @this {CPUState}
 */
CPUDef.opSUBL = function()
{
    this.regA = this.subByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x96 (SUB M)
 *
 * @this {CPUState}
 */
CPUDef.opSUBM = function()
{
    this.regA = this.subByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x97 (SUB A)
 *
 * @this {CPUState}
 */
CPUDef.opSUBA = function()
{
    this.regA = this.subByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0x98 (SBB B)
 *
 * @this {CPUState}
 */
CPUDef.opSBBB = function()
{
    this.regA = this.subByteBorrow(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0x99 (SBB C)
 *
 * @this {CPUState}
 */
CPUDef.opSBBC = function()
{
    this.regA = this.subByteBorrow(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0x9A (SBB D)
 *
 * @this {CPUState}
 */
CPUDef.opSBBD = function()
{
    this.regA = this.subByteBorrow(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0x9B (SBB E)
 *
 * @this {CPUState}
 */
CPUDef.opSBBE = function()
{
    this.regA = this.subByteBorrow(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0x9C (SBB H)
 *
 * @this {CPUState}
 */
CPUDef.opSBBH = function()
{
    this.regA = this.subByteBorrow(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0x9D (SBB L)
 *
 * @this {CPUState}
 */
CPUDef.opSBBL = function()
{
    this.regA = this.subByteBorrow(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0x9E (SBB M)
 *
 * @this {CPUState}
 */
CPUDef.opSBBM = function()
{
    this.regA = this.subByteBorrow(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0x9F (SBB A)
 *
 * @this {CPUState}
 */
CPUDef.opSBBA = function()
{
    this.regA = this.subByteBorrow(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xA0 (ANA B)
 *
 * @this {CPUState}
 */
CPUDef.opANAB = function()
{
    this.regA = this.andByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xA1 (ANA C)
 *
 * @this {CPUState}
 */
CPUDef.opANAC = function()
{
    this.regA = this.andByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xA2 (ANA D)
 *
 * @this {CPUState}
 */
CPUDef.opANAD = function()
{
    this.regA = this.andByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xA3 (ANA E)
 *
 * @this {CPUState}
 */
CPUDef.opANAE = function()
{
    this.regA = this.andByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xA4 (ANA H)
 *
 * @this {CPUState}
 */
CPUDef.opANAH = function()
{
    this.regA = this.andByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xA5 (ANA L)
 *
 * @this {CPUState}
 */
CPUDef.opANAL = function()
{
    this.regA = this.andByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xA6 (ANA M)
 *
 * @this {CPUState}
 */
CPUDef.opANAM = function()
{
    this.regA = this.andByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xA7 (ANA A)
 *
 * @this {CPUState}
 */
CPUDef.opANAA = function()
{
    this.regA = this.andByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xA8 (XRA B)
 *
 * @this {CPUState}
 */
CPUDef.opXRAB = function()
{
    this.regA = this.xorByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xA9 (XRA C)
 *
 * @this {CPUState}
 */
CPUDef.opXRAC = function()
{
    this.regA = this.xorByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xAA (XRA D)
 *
 * @this {CPUState}
 */
CPUDef.opXRAD = function()
{
    this.regA = this.xorByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xAB (XRA E)
 *
 * @this {CPUState}
 */
CPUDef.opXRAE = function()
{
    this.regA = this.xorByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xAC (XRA H)
 *
 * @this {CPUState}
 */
CPUDef.opXRAH = function()
{
    this.regA = this.xorByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xAD (XRA L)
 *
 * @this {CPUState}
 */
CPUDef.opXRAL = function()
{
    this.regA = this.xorByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xAE (XRA M)
 *
 * @this {CPUState}
 */
CPUDef.opXRAM = function()
{
    this.regA = this.xorByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xAF (XRA A)
 *
 * @this {CPUState}
 */
CPUDef.opXRAA = function()
{
    this.regA = this.xorByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xB0 (ORA B)
 *
 * @this {CPUState}
 */
CPUDef.opORAB = function()
{
    this.regA = this.orByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xB1 (ORA C)
 *
 * @this {CPUState}
 */
CPUDef.opORAC = function()
{
    this.regA = this.orByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xB2 (ORA D)
 *
 * @this {CPUState}
 */
CPUDef.opORAD = function()
{
    this.regA = this.orByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xB3 (ORA E)
 *
 * @this {CPUState}
 */
CPUDef.opORAE = function()
{
    this.regA = this.orByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xB4 (ORA H)
 *
 * @this {CPUState}
 */
CPUDef.opORAH = function()
{
    this.regA = this.orByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xB5 (ORA L)
 *
 * @this {CPUState}
 */
CPUDef.opORAL = function()
{
    this.regA = this.orByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xB6 (ORA M)
 *
 * @this {CPUState}
 */
CPUDef.opORAM = function()
{
    this.regA = this.orByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xB7 (ORA A)
 *
 * @this {CPUState}
 */
CPUDef.opORAA = function()
{
    this.regA = this.orByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xB8 (CMP B)
 *
 * @this {CPUState}
 */
CPUDef.opCMPB = function()
{
    this.subByte(this.regB);
    this.nStepCycles -= 4;
};

/**
 * op=0xB9 (CMP C)
 *
 * @this {CPUState}
 */
CPUDef.opCMPC = function()
{
    this.subByte(this.regC);
    this.nStepCycles -= 4;
};

/**
 * op=0xBA (CMP D)
 *
 * @this {CPUState}
 */
CPUDef.opCMPD = function()
{
    this.subByte(this.regD);
    this.nStepCycles -= 4;
};

/**
 * op=0xBB (CMP E)
 *
 * @this {CPUState}
 */
CPUDef.opCMPE = function()
{
    this.subByte(this.regE);
    this.nStepCycles -= 4;
};

/**
 * op=0xBC (CMP H)
 *
 * @this {CPUState}
 */
CPUDef.opCMPH = function()
{
    this.subByte(this.regH);
    this.nStepCycles -= 4;
};

/**
 * op=0xBD (CMP L)
 *
 * @this {CPUState}
 */
CPUDef.opCMPL = function()
{
    this.subByte(this.regL);
    this.nStepCycles -= 4;
};

/**
 * op=0xBE (CMP M)
 *
 * @this {CPUState}
 */
CPUDef.opCMPM = function()
{
    this.subByte(this.getByte(this.getHL()));
    this.nStepCycles -= 7;
};

/**
 * op=0xBF (CMP A)
 *
 * @this {CPUState}
 */
CPUDef.opCMPA = function()
{
    this.subByte(this.regA);
    this.nStepCycles -= 4;
};

/**
 * op=0xC0 (RNZ)
 *
 * @this {CPUState}
 */
CPUDef.opRNZ = function()
{
    if (!this.getZF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xC1 (POP B)
 *
 * @this {CPUState}
 */
CPUDef.opPOPB = function()
{
    this.setBC(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xC2 (JNZ a16)
 *
 * @this {CPUState}
 */
CPUDef.opJNZ = function()
{
    var w = this.getPCWord();
    if (!this.getZF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xC3 (JMP a16)
 *
 * @this {CPUState}
 */
CPUDef.opJMP = function()
{
    this.setPC(this.getPCWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xC4 (CNZ a16)
 *
 * @this {CPUState}
 */
CPUDef.opCNZ = function()
{
    var w = this.getPCWord();
    if (!this.getZF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xC5 (PUSH B)
 *
 * @this {CPUState}
 */
CPUDef.opPUSHB = function()
{
    this.pushWord(this.getBC());
    this.nStepCycles -= 11;
};

/**
 * op=0xC6 (ADI d8)
 *
 * @this {CPUState}
 */
CPUDef.opADI = function()
{
    this.regA = this.addByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xC7 (RST 0)
 *
 * @this {CPUState}
 */
CPUDef.opRST0 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0);
    this.nStepCycles -= 11;
};

/**
 * op=0xC8 (RZ)
 *
 * @this {CPUState}
 */
CPUDef.opRZ = function()
{
    if (this.getZF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xC9 (RET)
 *
 * @this {CPUState}
 */
CPUDef.opRET = function()
{
    this.setPC(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xCA (JZ a16)
 *
 * @this {CPUState}
 */
CPUDef.opJZ = function()
{
    var w = this.getPCWord();
    if (this.getZF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xCC (CZ a16)
 *
 * @this {CPUState}
 */
CPUDef.opCZ = function()
{
    var w = this.getPCWord();
    if (this.getZF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xCD (CALL a16)
 *
 * @this {CPUState}
 */
CPUDef.opCALL = function()
{
    var w = this.getPCWord();
    this.pushWord(this.getPC());
    this.setPC(w);
    this.nStepCycles -= 17;
};

/**
 * op=0xCE (ACI d8)
 *
 * @this {CPUState}
 */
CPUDef.opACI = function()
{
    this.regA = this.addByteCarry(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xCF (RST 1)
 *
 * @this {CPUState}
 */
CPUDef.opRST1 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x08);
    this.nStepCycles -= 11;
};

/**
 * op=0xD0 (RNC)
 *
 * @this {CPUState}
 */
CPUDef.opRNC = function()
{
    if (!this.getCF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xD1 (POP D)
 *
 * @this {CPUState}
 */
CPUDef.opPOPD = function()
{
    this.setDE(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xD2 (JNC a16)
 *
 * @this {CPUState}
 */
CPUDef.opJNC = function()
{
    var w = this.getPCWord();
    if (!this.getCF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xD3 (OUT d8)
 *
 * @this {CPUState}
 */
CPUDef.opOUT = function()
{
    var port = this.getPCByte();
    this.bus.checkPortOutputNotify(port, 1, this.regA, this.offPC(-2));
    this.nStepCycles -= 10;
};

/**
 * op=0xD4 (CNC a16)
 *
 * @this {CPUState}
 */
CPUDef.opCNC = function()
{
    var w = this.getPCWord();
    if (!this.getCF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xD5 (PUSH D)
 *
 * @this {CPUState}
 */
CPUDef.opPUSHD = function()
{
    this.pushWord(this.getDE());
    this.nStepCycles -= 11;
};

/**
 * op=0xD6 (SUI d8)
 *
 * @this {CPUState}
 */
CPUDef.opSUI = function()
{
    this.regA = this.subByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xD7 (RST 2)
 *
 * @this {CPUState}
 */
CPUDef.opRST2 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x10);
    this.nStepCycles -= 11;
};

/**
 * op=0xD8 (RC)
 *
 * @this {CPUState}
 */
CPUDef.opRC = function()
{
    if (this.getCF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xDA (JC a16)
 *
 * @this {CPUState}
 */
CPUDef.opJC = function()
{
    var w = this.getPCWord();
    if (this.getCF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xDB (IN d8)
 *
 * @this {CPUState}
 */
CPUDef.opIN = function()
{
    var port = this.getPCByte();
    this.regA = this.bus.checkPortInputNotify(port, 1, this.offPC(-2)) & 0xff;
    this.nStepCycles -= 10;
};

/**
 * op=0xDC (CC a16)
 *
 * @this {CPUState}
 */
CPUDef.opCC = function()
{
    var w = this.getPCWord();
    if (this.getCF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xDE (SBI d8)
 *
 * @this {CPUState}
 */
CPUDef.opSBI = function()
{
    this.regA = this.subByteBorrow(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xDF (RST 3)
 *
 * @this {CPUState}
 */
CPUDef.opRST3 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x18);
    this.nStepCycles -= 11;
};

/**
 * op=0xE0 (RPO)
 *
 * @this {CPUState}
 */
CPUDef.opRPO = function()
{
    if (!this.getPF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xE1 (POP H)
 *
 * @this {CPUState}
 */
CPUDef.opPOPH = function()
{
    this.setHL(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xE2 (JPO a16)
 *
 * @this {CPUState}
 */
CPUDef.opJPO = function()
{
    var w = this.getPCWord();
    if (!this.getPF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xE3 (XTHL)
 *
 * @this {CPUState}
 */
CPUDef.opXTHL = function()
{
    var w = this.popWord();
    this.pushWord(this.getHL());
    this.setHL(w);
    this.nStepCycles -= 18;
};

/**
 * op=0xE4 (CPO a16)
 *
 * @this {CPUState}
 */
CPUDef.opCPO = function()
{
    var w = this.getPCWord();
    if (!this.getPF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xE5 (PUSH H)
 *
 * @this {CPUState}
 */
CPUDef.opPUSHH = function()
{
    this.pushWord(this.getHL());
    this.nStepCycles -= 11;
};

/**
 * op=0xE6 (ANI d8)
 *
 * @this {CPUState}
 */
CPUDef.opANI = function()
{
    this.regA = this.andByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xE7 (RST 4)
 *
 * @this {CPUState}
 */
CPUDef.opRST4 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x20);
    this.nStepCycles -= 11;
};

/**
 * op=0xE8 (RPE)
 *
 * @this {CPUState}
 */
CPUDef.opRPE = function()
{
    if (this.getPF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xE9 (PCHL)
 *
 * @this {CPUState}
 */
CPUDef.opPCHL = function()
{
    this.setPC(this.getHL());
    this.nStepCycles -= 5;
};

/**
 * op=0xEA (JPE a16)
 *
 * @this {CPUState}
 */
CPUDef.opJPE = function()
{
    var w = this.getPCWord();
    if (this.getPF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xEB (XCHG)
 *
 * @this {CPUState}
 */
CPUDef.opXCHG = function()
{
    var w = this.getHL();
    this.setHL(this.getDE());
    this.setDE(w);
    this.nStepCycles -= 5;
};

/**
 * op=0xEC (CPE a16)
 *
 * @this {CPUState}
 */
CPUDef.opCPE = function()
{
    var w = this.getPCWord();
    if (this.getPF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xEE (XRI d8)
 *
 * @this {CPUState}
 */
CPUDef.opXRI = function()
{
    this.regA = this.xorByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xEF (RST 5)
 *
 * @this {CPUState}
 */
CPUDef.opRST5 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x28);
    this.nStepCycles -= 11;
};

/**
 * op=0xF0 (RP)
 *
 * @this {CPUState}
 */
CPUDef.opRP = function()
{
    if (!this.getSF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xF1 (POP PSW)
 *
 * @this {CPUState}
 */
CPUDef.opPOPSW = function()
{
    this.setPSW(this.popWord());
    this.nStepCycles -= 10;
};

/**
 * op=0xF2 (JP a16)
 *
 * @this {CPUState}
 */
CPUDef.opJP = function()
{
    var w = this.getPCWord();
    if (!this.getSF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xF3 (DI)
 *
 * @this {CPUState}
 */
CPUDef.opDI = function()
{
    this.clearIF();
    this.nStepCycles -= 4;
};

/**
 * op=0xF4 (CP a16)
 *
 * @this {CPUState}
 */
CPUDef.opCP = function()
{
    var w = this.getPCWord();
    if (!this.getSF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xF5 (PUSH PSW)
 *
 * @this {CPUState}
 */
CPUDef.opPUPSW = function()
{
    this.pushWord(this.getPSW());
    this.nStepCycles -= 11;
};

/**
 * op=0xF6 (ORI d8)
 *
 * @this {CPUState}
 */
CPUDef.opORI = function()
{
    this.regA = this.orByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xF7 (RST 6)
 *
 * @this {CPUState}
 */
CPUDef.opRST6 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x30);
    this.nStepCycles -= 11;
};

/**
 * op=0xF8 (RM)
 *
 * @this {CPUState}
 */
CPUDef.opRM = function()
{
    if (this.getSF()) {
        this.setPC(this.popWord());
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 5;
};

/**
 * op=0xF9 (SPHL)
 *
 * @this {CPUState}
 */
CPUDef.opSPHL = function()
{
    this.setSP(this.getHL());
    this.nStepCycles -= 5;
};

/**
 * op=0xFA (JM a16)
 *
 * @this {CPUState}
 */
CPUDef.opJM = function()
{
    var w = this.getPCWord();
    if (this.getSF()) this.setPC(w);
    this.nStepCycles -= 10;
};

/**
 * op=0xFB (EI)
 *
 * @this {CPUState}
 */
CPUDef.opEI = function()
{
    this.setIF();var w = this.getHL();
    this.nStepCycles -= 4;
};

/**
 * op=0xFC (CM a16)
 *
 * @this {CPUState}
 */
CPUDef.opCM = function()
{
    var w = this.getPCWord();
    if (this.getSF()) {
        this.pushWord(this.getPC());
        this.setPC(w);
        this.nStepCycles -= 6;
    }
    this.nStepCycles -= 11;
};

/**
 * op=0xFE (CPI d8)
 *
 * @this {CPUState}
 */
CPUDef.opCPI = function()
{
    this.subByte(this.getPCByte());
    this.nStepCycles -= 7;
};

/**
 * op=0xFF (RST 7)
 *
 * @this {CPUState}
 */
CPUDef.opRST7 = function()
{
    this.pushWord(this.getPC());
    this.setPC(0x38);
    this.nStepCycles -= 11;
};

/*
 * This 256-entry array of opcode functions is at the heart of the CPU engine: stepCPU(n).
 *
 * It might be worth trying a switch() statement instead, to see how the performance compares,
 * but I suspect that would vary quite a bit across JavaScript engines; for now, I'm putting my
 * money on array lookup.
 */
CPUDef.aOps8080 = [
    /* 0x00-0x03 */ CPUDef.opNOP,   CPUDef.opLXIB,  CPUDef.opSTAXB, CPUDef.opINXB,
    /* 0x04-0x07 */ CPUDef.opINRB,  CPUDef.opDCRB,  CPUDef.opMVIB,  CPUDef.opRLC,
    /* 0x08-0x0B */ CPUDef.opNOP,   CPUDef.opDADB,  CPUDef.opLDAXB, CPUDef.opDCXB,
    /* 0x0C-0x0F */ CPUDef.opINRC,  CPUDef.opDCRC,  CPUDef.opMVIC,  CPUDef.opRRC,
    /* 0x10-0x13 */ CPUDef.opNOP,   CPUDef.opLXID,  CPUDef.opSTAXD, CPUDef.opINXD,
    /* 0x14-0x17 */ CPUDef.opINRD,  CPUDef.opDCRD,  CPUDef.opMVID,  CPUDef.opRAL,
    /* 0x18-0x1B */ CPUDef.opNOP,   CPUDef.opDADD,  CPUDef.opLDAXD, CPUDef.opDCXD,
    /* 0x1C-0x1F */ CPUDef.opINRE,  CPUDef.opDCRE,  CPUDef.opMVIE,  CPUDef.opRAR,
    /* 0x20-0x23 */ CPUDef.opNOP,   CPUDef.opLXIH,  CPUDef.opSHLD,  CPUDef.opINXH,
    /* 0x24-0x27 */ CPUDef.opINRH,  CPUDef.opDCRH,  CPUDef.opMVIH,  CPUDef.opDAA,
    /* 0x28-0x2B */ CPUDef.opNOP,   CPUDef.opDADH,  CPUDef.opLHLD,  CPUDef.opDCXH,
    /* 0x2C-0x2F */ CPUDef.opINRL,  CPUDef.opDCRL,  CPUDef.opMVIL,  CPUDef.opCMA,
    /* 0x30-0x33 */ CPUDef.opNOP,   CPUDef.opLXISP, CPUDef.opSTA,   CPUDef.opINXSP,
    /* 0x34-0x37 */ CPUDef.opINRM,  CPUDef.opDCRM,  CPUDef.opMVIM,  CPUDef.opSTC,
    /* 0x38-0x3B */ CPUDef.opNOP,   CPUDef.opDADSP, CPUDef.opLDA,   CPUDef.opDCXSP,
    /* 0x3C-0x3F */ CPUDef.opINRA,  CPUDef.opDCRA,  CPUDef.opMVIA,  CPUDef.opCMC,
    /* 0x40-0x43 */ CPUDef.opMOVBB, CPUDef.opMOVBC, CPUDef.opMOVBD, CPUDef.opMOVBE,
    /* 0x44-0x47 */ CPUDef.opMOVBH, CPUDef.opMOVBL, CPUDef.opMOVBM, CPUDef.opMOVBA,
    /* 0x48-0x4B */ CPUDef.opMOVCB, CPUDef.opMOVCC, CPUDef.opMOVCD, CPUDef.opMOVCE,
    /* 0x4C-0x4F */ CPUDef.opMOVCH, CPUDef.opMOVCL, CPUDef.opMOVCM, CPUDef.opMOVCA,
    /* 0x50-0x53 */ CPUDef.opMOVDB, CPUDef.opMOVDC, CPUDef.opMOVDD, CPUDef.opMOVDE,
    /* 0x54-0x57 */ CPUDef.opMOVDH, CPUDef.opMOVDL, CPUDef.opMOVDM, CPUDef.opMOVDA,
    /* 0x58-0x5B */ CPUDef.opMOVEB, CPUDef.opMOVEC, CPUDef.opMOVED, CPUDef.opMOVEE,
    /* 0x5C-0x5F */ CPUDef.opMOVEH, CPUDef.opMOVEL, CPUDef.opMOVEM, CPUDef.opMOVEA,
    /* 0x60-0x63 */ CPUDef.opMOVHB, CPUDef.opMOVHC, CPUDef.opMOVHD, CPUDef.opMOVHE,
    /* 0x64-0x67 */ CPUDef.opMOVHH, CPUDef.opMOVHL, CPUDef.opMOVHM, CPUDef.opMOVHA,
    /* 0x68-0x6B */ CPUDef.opMOVLB, CPUDef.opMOVLC, CPUDef.opMOVLD, CPUDef.opMOVLE,
    /* 0x6C-0x6F */ CPUDef.opMOVLH, CPUDef.opMOVLL, CPUDef.opMOVLM, CPUDef.opMOVLA,
    /* 0x70-0x73 */ CPUDef.opMOVMB, CPUDef.opMOVMC, CPUDef.opMOVMD, CPUDef.opMOVME,
    /* 0x74-0x77 */ CPUDef.opMOVMH, CPUDef.opMOVML, CPUDef.opHLT,   CPUDef.opMOVMA,
    /* 0x78-0x7B */ CPUDef.opMOVAB, CPUDef.opMOVAC, CPUDef.opMOVAD, CPUDef.opMOVAE,
    /* 0x7C-0x7F */ CPUDef.opMOVAH, CPUDef.opMOVAL, CPUDef.opMOVAM, CPUDef.opMOVAA,
    /* 0x80-0x83 */ CPUDef.opADDB,  CPUDef.opADDC,  CPUDef.opADDD,  CPUDef.opADDE,
    /* 0x84-0x87 */ CPUDef.opADDH,  CPUDef.opADDL,  CPUDef.opADDM,  CPUDef.opADDA,
    /* 0x88-0x8B */ CPUDef.opADCB,  CPUDef.opADCC,  CPUDef.opADCD,  CPUDef.opADCE,
    /* 0x8C-0x8F */ CPUDef.opADCH,  CPUDef.opADCL,  CPUDef.opADCM,  CPUDef.opADCA,
    /* 0x90-0x93 */ CPUDef.opSUBB,  CPUDef.opSUBC,  CPUDef.opSUBD,  CPUDef.opSUBE,
    /* 0x94-0x97 */ CPUDef.opSUBH,  CPUDef.opSUBL,  CPUDef.opSUBM,  CPUDef.opSUBA,
    /* 0x98-0x9B */ CPUDef.opSBBB,  CPUDef.opSBBC,  CPUDef.opSBBD,  CPUDef.opSBBE,
    /* 0x9C-0x9F */ CPUDef.opSBBH,  CPUDef.opSBBL,  CPUDef.opSBBM,  CPUDef.opSBBA,
    /* 0xA0-0xA3 */ CPUDef.opANAB,  CPUDef.opANAC,  CPUDef.opANAD,  CPUDef.opANAE,
    /* 0xA4-0xA7 */ CPUDef.opANAH,  CPUDef.opANAL,  CPUDef.opANAM,  CPUDef.opANAA,
    /* 0xA8-0xAB */ CPUDef.opXRAB,  CPUDef.opXRAC,  CPUDef.opXRAD,  CPUDef.opXRAE,
    /* 0xAC-0xAF */ CPUDef.opXRAH,  CPUDef.opXRAL,  CPUDef.opXRAM,  CPUDef.opXRAA,
    /* 0xB0-0xB3 */ CPUDef.opORAB,  CPUDef.opORAC,  CPUDef.opORAD,  CPUDef.opORAE,
    /* 0xB4-0xB7 */ CPUDef.opORAH,  CPUDef.opORAL,  CPUDef.opORAM,  CPUDef.opORAA,
    /* 0xB8-0xBB */ CPUDef.opCMPB,  CPUDef.opCMPC,  CPUDef.opCMPD,  CPUDef.opCMPE,
    /* 0xBC-0xBF */ CPUDef.opCMPH,  CPUDef.opCMPL,  CPUDef.opCMPM,  CPUDef.opCMPA,
    /* 0xC0-0xC3 */ CPUDef.opRNZ,   CPUDef.opPOPB,  CPUDef.opJNZ,   CPUDef.opJMP,
    /* 0xC4-0xC7 */ CPUDef.opCNZ,   CPUDef.opPUSHB, CPUDef.opADI,   CPUDef.opRST0,
    /* 0xC8-0xCB */ CPUDef.opRZ,    CPUDef.opRET,   CPUDef.opJZ,    CPUDef.opJMP,
    /* 0xCC-0xCF */ CPUDef.opCZ,    CPUDef.opCALL,  CPUDef.opACI,   CPUDef.opRST1,
    /* 0xD0-0xD3 */ CPUDef.opRNC,   CPUDef.opPOPD,  CPUDef.opJNC,   CPUDef.opOUT,
    /* 0xD4-0xD7 */ CPUDef.opCNC,   CPUDef.opPUSHD, CPUDef.opSUI,   CPUDef.opRST2,
    /* 0xD8-0xDB */ CPUDef.opRC,    CPUDef.opRET,   CPUDef.opJC,    CPUDef.opIN,
    /* 0xDC-0xDF */ CPUDef.opCC,    CPUDef.opCALL,  CPUDef.opSBI,   CPUDef.opRST3,
    /* 0xE0-0xE3 */ CPUDef.opRPO,   CPUDef.opPOPH,  CPUDef.opJPO,   CPUDef.opXTHL,
    /* 0xE4-0xE7 */ CPUDef.opCPO,   CPUDef.opPUSHH, CPUDef.opANI,   CPUDef.opRST4,
    /* 0xE8-0xEB */ CPUDef.opRPE,   CPUDef.opPCHL,  CPUDef.opJPE,   CPUDef.opXCHG,
    /* 0xEC-0xEF */ CPUDef.opCPE,   CPUDef.opCALL,  CPUDef.opXRI,   CPUDef.opRST5,
    /* 0xF0-0xF3 */ CPUDef.opRP,    CPUDef.opPOPSW, CPUDef.opJP,    CPUDef.opDI,
    /* 0xF4-0xF7 */ CPUDef.opCP,    CPUDef.opPUPSW, CPUDef.opORI,   CPUDef.opRST6,
    /* 0xF8-0xFB */ CPUDef.opRM,    CPUDef.opSPHL,  CPUDef.opJM,    CPUDef.opEI,
    /* 0xFC-0xFF */ CPUDef.opCM,    CPUDef.opCALL,  CPUDef.opCPI,   CPUDef.opRST7
];

// ./modules/pc8080/lib/chipset.js

/**
 * @fileoverview Implements the PC8080 ChipSet component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-25
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


/**
 * ChipSet(parmsChipSet)
 *
 * The ChipSet component has the following component-specific (parmsChipSet) properties:
 *
 *      model:  eg, "SI1978" (should be a member of ChipSet.MODELS)
 *      swDIP:  eg, "00000000", where swDIP[0] is DIP0, swDIP[1] is DIP1, etc.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsChipSet
 */
function ChipSet(parmsChipSet)
{
    Component.call(this, "ChipSet", parmsChipSet, ChipSet, Messages.CHIPSET);

    var model = parmsChipSet['model'];

    /*
     * this.model is a numeric version of the 'model' string; when comparing this.model to "base"
     * model numbers, you should generally compare (this.model|0) to the target value, which truncates it.
     */
    if (model && !ChipSet.MODELS[model]) {
        Component.notice("Unrecognized ChipSet model: " + model);
    }

    this.model = ChipSet.MODELS[model] || ChipSet.SI_1978.MODEL;

    this.bSwitches = this.parseDIPSwitches(parmsChipSet['swDIP']);

    /*
     * Here, I'm finally getting around to trying the Web Audio API.  Fortunately, based on what little I know about
     * sound generation, using the API to make the same noises as the IBM PC speaker seems straightforward.
     *
     * To start, we create an audio context, unless the 'sound' parameter has been explicitly set to false.
     *
     * From:
     *
     *      http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html
     *
     * "Similar to how HTML5 canvas requires a context on which lines and curves are drawn, Web Audio requires an audio context
     *  on which sounds are played and manipulated. This context will be the parent object of further audio objects to come....
     *  Your audio context is typically created when your page initializes and should be long-lived. You can play multiple sounds
     *  coming from multiple sources within the same context, so it is unnecessary to create more than one audio context per page."
     */
    this.fSpeaker = false;
    if (parmsChipSet['sound']) {
        this.classAudio = this.contextAudio = null;
        if (window) {
            this.classAudio = window['AudioContext'] || window['webkitAudioContext'];
        }
        if (this.classAudio) {
            this.contextAudio = new this.classAudio();
        } else {
            if (DEBUG) this.log("AudioContext not available");
        }
    }

    this.setReady();
}

Component.subclass(ChipSet);

ChipSet.SI_1978 = {
    MODEL:          1978.1,
    STATUS0: {                          // NOTE: STATUS0 not used by the SI_1978 ROMs; refer to STATUS1 instead
        PORT:       0,
        DIP4:       0x01,               // self-test request at power up?
        FIRE:       0x10,               // 1 = fire
        LEFT:       0x20,               // 1 = left
        RIGHT:      0x40,               // 1 = right
        PORT7:      0x80,               // some connection to (undocumented) port 7
        ALWAYS_SET: 0x0E                // always set
    },
    STATUS1: {
        PORT:       1,
        CREDIT:     0x01,               // credit (coin slot)
        P2:         0x02,               // 1 = 2P start
        P1:         0x04,               // 1 = 1P start
        P1_FIRE:    0x10,               // 1 = fire (P1 fire if cocktail machine?)
        P1_LEFT:    0x20,               // 1 = left (P1 left if cocktail machine?)
        P1_RIGHT:   0x40,               // 1 = right (P1 right if cocktail machine?)
        ALWAYS_SET: 0x08                // always set
    },
    STATUS2: {
        PORT:       2,
        DIP3_5:     0x03,               // 00 = 3 ships, 01 = 4 ships, 10 = 5 ships, 11 = 6 ships
        TILT:       0x04,               // 1 = tilt detected
        DIP6:       0x08,               // 0 = extra ship at 1500, 1 = extra ship at 1000
        P2_FIRE:    0x10,               // 1 = P2 fire (cocktail machines only?)
        P2_LEFT:    0x20,               // 1 = P2 left (cocktail machines only?)
        P2_RIGHT:   0x40,               // 1 = P2 right (cocktail machines only?)
        DIP7:       0x80,               // 0 = display coin info on demo ("attract") screen
        ALWAYS_SET: 0x00
    },
    SHIFT_RESULT: {                     // bits 0-7 of barrel shifter result
        PORT:       3
    },
    SHIFT_COUNT: {
        PORT:       2,
        MASK:       0x07
    },
    SOUND1: {
        PORT:       3,
        UFO:        0x01,
        SHOT:       0x02,
        PDEATH:     0x04,
        IDEATH:     0x08,
        EXPLAY:     0x10,
        AMP_ENABLE: 0x20
    },
    SHIFT_DATA: {
        PORT:       4
    },
    SOUND2: {
        PORT:       5,
        FLEET1:     0x01,
        FLEET2:     0x02,
        FLEET3:     0x04,
        FLEET4:     0x08,
        UFO_HIT:    0x10
    }
};

/*
 * Supported model strings
 */
ChipSet.MODELS = {
    "SI1978":       ChipSet.SI_1978.MODEL
};

/**
 * parseDIPSwitches(sBits, bDefault)
 *
 * @this {ChipSet}
 * @param {string} sBits describing switch settings
 * @param {number} [bDefault]
 * @return {number|undefined}
 */
ChipSet.prototype.parseDIPSwitches = function(sBits, bDefault)
{
    var b = bDefault;
    if (sBits) {
        /*
         * NOTE: We can't use parseInt() with a base of 2, because both bit order and bit sense are reversed.
         */
        b = 0;
        var bit = 0x1;
        for (var i = 0; i < sBits.length; i++) {
            if (sBits.charAt(i) == "0") b |= bit;
            bit <<= 1;
        }
    }
    return b;
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {ChipSet}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "sw1")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
ChipSet.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    return false;
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {ChipSet}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger} dbg
 */
ChipSet.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.cmp = cmp;
    if (this.model == ChipSet.SI_1978.MODEL) {
        bus.addPortInputTable(this, ChipSet.aPortInput);
        bus.addPortOutputTable(this, ChipSet.aPortOutput);
    }
};

/**
 * powerUp(data, fRepower)
 *
 * @this {ChipSet}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
ChipSet.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data) {
            this.reset();
        } else {
            if (!this.restore(data)) return false;
        }
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {ChipSet}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
ChipSet.prototype.powerDown = function(fSave, fShutdown)
{
    return fSave? this.save() : true;
};

/**
 * reset()
 *
 * @this {ChipSet}
 */
ChipSet.prototype.reset = function()
{
    this.bStatus0 = ChipSet.SI_1978.STATUS0.ALWAYS_SET;
    this.bStatus1 = ChipSet.SI_1978.STATUS1.ALWAYS_SET;
    this.bStatus2 = ChipSet.SI_1978.STATUS2.ALWAYS_SET;
    this.wShiftData = 0;
    this.bShiftCount = 0;
    this.bSound1 = this.bSound2 = 0;
};

/**
 * save()
 *
 * This implements save support for the ChipSet component.
 *
 * @this {ChipSet}
 * @return {Object}
 */
ChipSet.prototype.save = function()
{
    var state = new State(this);
    if (this.model == ChipSet.SI_1978.MODEL) {
        state.set(0, [this.bStatus0, this.bStatus1, this.bStatus2, this.wShiftData, this.bShiftCount, this.bSound1, this.bSound2]);
    }
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the ChipSet component.
 *
 * @this {ChipSet}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
ChipSet.prototype.restore = function(data)
{
    var a, i;
    a = data[0];
    if (this.model == ChipSet.SI_1978.MODEL) {
        this.bStatus0 = a[0];
        this.bStatus1 = a[1];
        this.bStatus2 = a[2];
        this.wShiftData = a[3];
        this.bShiftCount = a[4];
        this.bSound1 = a[5];
        this.bSound2 = a[6];
    }
    return true;
};

/**
 * start()
 *
 * Notification from the CPU that it's starting.
 *
 * @this {ChipSet}
 */
ChipSet.prototype.start = function()
{
    /*
     * Currently, all we (may) do with this notification is allow the speaker to make noise.
     */
};

/**
 * stop()
 *
 * Notification from the CPU that it's stopping.
 *
 * @this {ChipSet}
 */
ChipSet.prototype.stop = function()
{
    /*
     * Currently, all we (may) do with this notification is prevent the speaker from making noise.
     */
};

/**
 * updateStatus0(bit, fSet)
 *
 * @this {ChipSet}
 * @param {number} bit
 * @param {boolean} fSet
 */
ChipSet.prototype.updateStatus0 = function(bit, fSet)
{
    this.bStatus0 &= ~bit;
    if (fSet) this.bStatus0 |= bit;
};

/**
 * updateStatus1(bit, fSet)
 *
 * @this {ChipSet}
 * @param {number} bit
 * @param {boolean} fSet
 */
ChipSet.prototype.updateStatus1 = function(bit, fSet)
{
    this.bStatus1 &= ~bit;
    if (fSet) this.bStatus1 |= bit;
};

/**
 * updateStatus2(bit, fSet)
 *
 * @this {ChipSet}
 * @param {number} bit
 * @param {boolean} fSet
 */
ChipSet.prototype.updateStatus2 = function(bit, fSet)
{
    this.bStatus2 &= ~bit;
    if (fSet) this.bStatus2 |= bit;
};

/**
 * inSIStatus0(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x00)
 * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inSIStatus0 = function(port, addrFrom)
{
    var b = this.bStatus0;
    this.printMessageIO(port, null, addrFrom, "STATUS0", b, true);
    return b;
};

/**
 * inSIStatus1(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x01)
 * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inSIStatus1 = function(port, addrFrom)
{
    var b = this.bStatus1;
    this.printMessageIO(port, null, addrFrom, "STATUS1", b, true);
    return b;
};

/**
 * inSIStatus2(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x02)
 * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inSIStatus2 = function(port, addrFrom)
{
    var b = this.bStatus2;
    this.printMessageIO(port, null, addrFrom, "STATUS2", b, true);
    return b;
};

/**
 * inSIShiftResult(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x03)
 * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inSIShiftResult = function(port, addrFrom)
{
    var b = (this.wShiftData >> (8 - this.bShiftCount)) & 0xff;
    this.printMessageIO(port, null, addrFrom, "SHIFT.RESULT", b, true);
    return b;
};

/**
 * outSIShiftCount(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x02)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outSIShiftCount = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "SHIFT.COUNT", null, true);
    this.bShiftCount = b;
};

/**
 * outSISound1(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x03)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outSISound1 = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "SOUND1", null, true);
    this.bSound1 = b;
};

/**
 * outSIShiftData(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x04)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outSIShiftData = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "SHIFT.DATA", null, true);
    this.wShiftData = (b << 8) | (this.wShiftData >> 8);
};

/**
 * outSISound2(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x05)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outSISound2 = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "SOUND2", null, true);
    this.bSound2 = b;
};

/**
 * outSIWatchdog(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x06)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outSIWatchdog = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "WATCHDOG", null, true);
};

/*
 * Port input notification tables
 */
ChipSet.aPortInput = {
    0x00: ChipSet.prototype.inSIStatus0,
    0x01: ChipSet.prototype.inSIStatus1,
    0x02: ChipSet.prototype.inSIStatus2,
    0x03: ChipSet.prototype.inSIShiftResult
};

/*
 * Port output notification tables
 */
ChipSet.aPortOutput = {
    0x02: ChipSet.prototype.outSIShiftCount,
    0x03: ChipSet.prototype.outSISound1,
    0x04: ChipSet.prototype.outSIShiftData,
    0x05: ChipSet.prototype.outSISound2,
    0x06: ChipSet.prototype.outSIWatchdog
};

/**
 * ChipSet.init()
 *
 * This function operates on every HTML element of class "chipset", extracting the
 * JSON-encoded parameters for the ChipSet constructor from the element's "data-value"
 * attribute, invoking the constructor to create a ChipSet component, and then binding
 * any associated HTML controls to the new component.
 */
ChipSet.init = function()
{
    var aeChipSet = Component.getElementsByClass(document, PC8080.APPCLASS, "chipset");
    for (var iChip = 0; iChip < aeChipSet.length; iChip++) {
        var eChipSet = aeChipSet[iChip];
        var parmsChipSet = Component.getComponentParms(eChipSet);
        var chipset = new ChipSet(parmsChipSet);
        Component.bindComponentControls(chipset, eChipSet, PC8080.APPCLASS);
    }
};

/*
 * Initialize every ChipSet module on the page.
 */
web.onInit(ChipSet.init);


// ./modules/pc8080/lib/rom.js

/**
 * @fileoverview Implements the PC8080 ROM component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-19
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


/**
 * ROM(parmsROM)
 *
 * The ROM component expects the following (parmsROM) properties:
 *
 *      addr: physical address of ROM
 *      size: amount of ROM, in bytes
 *      alias: physical alias address (null if none)
 *      file: name of ROM data file
 *      writable: true to make ROM writable (default is false)
 *
 * NOTE: The ROM data will not be copied into place until the Bus is ready (see initBus()) AND the
 * ROM data file has finished loading (see doneLoad()).
 *
 * Also, while the size parameter may seem redundant, I consider it useful to confirm that the ROM you received
 * is the ROM you expected.
 *
 * Finally, while making ROM "writable" may seem a contradiction in terms, I want to be able to load selected
 * CP/M binary files into memory purely for testing purposes, and the RAM component has no "file" option, so the
 * simplest solution was to add the option to load binary files into memory as "writable" ROMs.
 *
 * Moreover, if a "writable" ROM is installed at addr 0x100, that triggers our "Fake CP/M" support, providing
 * a quick-and-dirty means of loading simple CP/M test binaries.  See addROM() for details.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsROM
 */
function ROM(parmsROM)
{
    Component.call(this, "ROM", parmsROM, ROM);

    this.abROM = null;
    this.addrROM = parmsROM['addr'];
    this.sizeROM = parmsROM['size'];
    this.fWritable = parmsROM['writable'];

    /*
     * The new 'alias' property can now be EITHER a single physical address (like 'addr') OR an array of
     * physical addresses; eg:
     *
     *      [0xf0000,0xffff0000,0xffff8000]
     *
     * We could have overloaded 'addr' to accomplish the same thing, but I think it's better to have any
     * aliased locations listed under a separate property.
     *
     * Most ROMs are not aliased, in which case the 'alias' property should have the default value of null.
     */
    this.addrAlias = parmsROM['alias'];

    this.sFilePath = parmsROM['file'];
    this.sFileName = str.getBaseName(this.sFilePath);

    if (this.sFilePath) {
        var sFileURL = this.sFilePath;
        if (DEBUG) this.log('load("' + sFileURL + '")');
        /*
         * If the selected ROM file has a ".json" extension, then we assume it's pre-converted
         * JSON-encoded ROM data, so we load it as-is; ditto for ROM files with a ".hex" extension.
         * Otherwise, we ask our server-side ROM converter to return the file in a JSON-compatible format.
         */
        var sFileExt = str.getExtension(this.sFileName);
        if (sFileExt != DumpAPI.FORMAT.JSON && sFileExt != DumpAPI.FORMAT.HEX) {
            sFileURL = web.getHost() + DumpAPI.ENDPOINT + '?' + DumpAPI.QUERY.FILE + '=' + this.sFilePath + '&' + DumpAPI.QUERY.FORMAT + '=' + DumpAPI.FORMAT.BYTES + '&' + DumpAPI.QUERY.DECIMAL + '=true';
        }
        var rom = this;
        web.getResource(sFileURL, null, true, function(sURL, sResponse, nErrorCode) {
            rom.doneLoad(sURL, sResponse, nErrorCode);
        });
    }
}

Component.subclass(ROM);

ROM.CPM = {
    BIOS: {
        VECTOR:         0x0000
    },
    BDOS: {
        VECTOR:         0x0005,
        FUNC: {                         // function number (specified in regC)
            RESET:      0x00,
            CON_READ:   0x01,           // output: A = L = ASCII character
            CON_WRITE:  0x02,           // input: E = ASCII character
            AUX_READ:   0x03,           // output: A = L = ASCII character
            AUX_WRITE:  0x04,           // input: E = ASCII character
            PRN_WRITE:  0x05,           // input: E = ASCII character
            MEM_SIZE:   0x06,           // output: base address of CCP (Console Command Processor), but which register? (perhaps moot if this was CP/M 1.3 only...)
            CON_IO:     0x06,           // input: E = ASCII character (or 0xFF to return ASCII character in A)
            GET_IOBYTE: 0x07,
            SET_IOBYTE: 0x08,
            STR_WRITE:  0x09            // input: DE = address of string
        }
    }
};

ROM.CPM.VECTORS = [ROM.CPM.BIOS.VECTOR, ROM.CPM.BDOS.VECTOR];

/*
 * NOTE: There's currently no need for this component to have a reset() function, since
 * once the ROM data is loaded, it can't be changed, so there's nothing to reinitialize.
 *
 * OK, well, I take that back, because the Debugger, if installed, has the ability to modify
 * ROM contents, so in that case, having a reset() function that restores the original ROM data
 * might be useful; then again, it might not, depending on what you're trying to debug.
 *
 * If we do add reset(), then we'll want to change copyROM() to hang onto the original
 * ROM data; currently, we release it after copying it into the read-only memory allocated
 * via bus.addMemory().
 */

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {ROM}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger} dbg
 */
ROM.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.copyROM();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {ROM}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
ROM.prototype.powerUp = function(data, fRepower)
{
    if (this.aSymbols) {
        if (this.dbg) {
            this.dbg.addSymbols(this.id, this.addrROM, this.sizeROM, this.aSymbols);
        }
        /*
         * Our only role in the handling of symbols is to hand them off to the Debugger at our
         * first opportunity. Now that we've done that, our copy of the symbols, if any, are toast.
         */
        delete this.aSymbols;
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * Since we have nothing to do on powerDown(), and no state to return, we could simply omit
 * this function.  But it doesn't hurt anything, and maybe we'll use our state to save something
 * useful down the road, like user-defined symbols (ie, symbols that the Debugger may have
 * created, above and beyond those symbols we automatically loaded, if any, along with the ROM).
 *
 * @this {ROM}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
ROM.prototype.powerDown = function(fSave, fShutdown)
{
    return true;
};

/**
 * doneLoad(sURL, sROMData, nErrorCode)
 *
 * @this {ROM}
 * @param {string} sURL
 * @param {string} sROMData
 * @param {number} nErrorCode (response from server if anything other than 200)
 */
ROM.prototype.doneLoad = function(sURL, sROMData, nErrorCode)
{
    if (nErrorCode) {
        this.notice("Unable to load system ROM (error " + nErrorCode + ": " + sURL + ")");
        return;
    }

    Component.addMachineResource(this.idMachine, sURL, sROMData);

    if (sROMData.charAt(0) == "[" || sROMData.charAt(0) == "{") {
        try {
            /*
             * The most likely source of any exception will be here: parsing the JSON-encoded ROM data.
             */
            var rom = eval("(" + sROMData + ")");
            var ab = rom['bytes'];
            var adw = rom['data'];

            if (ab) {
                this.abROM = ab;
            }
            else if (adw) {
                /*
                 * Convert all the DWORDs into BYTEs, so that subsequent code only has to deal with abROM.
                 */
                this.abROM = new Array(adw.length * 4);
                for (var idw = 0, ib = 0; idw < adw.length; idw++) {
                    this.abROM[ib++] = adw[idw] & 0xff;
                    this.abROM[ib++] = (adw[idw] >> 8) & 0xff;
                    this.abROM[ib++] = (adw[idw] >> 16) & 0xff;
                    this.abROM[ib++] = (adw[idw] >> 24) & 0xff;
                }
            }
            else {
                this.abROM = rom;
            }

            this.aSymbols = rom['symbols'];

            if (!this.abROM.length) {
                Component.error("Empty ROM: " + sURL);
                return;
            }
            else if (this.abROM.length == 1) {
                Component.error(this.abROM[0]);
                return;
            }
        } catch (e) {
            this.notice("ROM data error: " + e.message);
            return;
        }
    }
    else {
        /*
         * Parse the ROM data manually; we assume it's in "simplified" hex form (a series of hex byte-values
         * separated by whitespace).
         */
        var sHexData = sROMData.replace(/\n/gm, " ").replace(/ +$/, "");
        var asHexData = sHexData.split(" ");
        this.abROM = new Array(asHexData.length);
        for (var i = 0; i < asHexData.length; i++) {
            this.abROM[i] = str.parseInt(asHexData[i], 16);
        }
    }
    this.copyROM();
};

/**
 * copyROM()
 *
 * This function is called by both initBus() and doneLoad(), but it cannot copy the the ROM data into place
 * until after initBus() has received the Bus component AND doneLoad() has received the abROM data.  When both
 * those criteria are satisfied, the component becomes "ready".
 *
 * @this {ROM}
 */
ROM.prototype.copyROM = function()
{
    if (!this.isReady()) {
        if (!this.sFilePath) {
            this.setReady();
        }
        else if (this.abROM && this.bus) {
            /*
             * If no explicit size was specified, then use whatever the actual size is.
             */
            if (!this.sizeROM) {
                this.sizeROM = this.abROM.length;
            }
            if (this.abROM.length != this.sizeROM) {
                /*
                 * Note that setError() sets the component's fError flag, which in turn prevents setReady() from
                 * marking the component ready.  TODO: Revisit this decision.  On the one hand, it sounds like a
                 * good idea to stop the machine in its tracks whenever a setError() occurs, but there may also be
                 * times when we'd like to forge ahead anyway.
                 */
                this.setError("ROM size (" + str.toHexLong(this.abROM.length) + ") does not match specified size (" + str.toHexLong(this.sizeROM) + ")");
            }
            else if (this.addROM(this.addrROM)) {

                var aliases = [];
                if (typeof this.addrAlias == "number") {
                    aliases.push(this.addrAlias);
                } else if (this.addrAlias != null && this.addrAlias.length) {
                    aliases = this.addrAlias;
                }
                for (var i = 0; i < aliases.length; i++) {
                    this.cloneROM(aliases[i]);
                }
                /*
                 * We used to hang onto the original ROM data so that we could restore any bytes the CPU overwrote,
                 * using memory write-notification handlers, but with the introduction of read-only memory blocks, that's
                 * no longer necessary.
                 *
                 * TODO: Consider an option to retain the ROM data, and give the user some way of restoring ROMs.
                 * That may be useful for "resumable" machines that save/restore all dirty block of memory, regardless
                 * whether they're ROM or RAM.  However, the only way to modify a machine's ROM is with the Debugger,
                 * and Debugger users should know better.
                 */
                delete this.abROM;
            }
            this.setReady();
        }
    }
};

/**
 * addROM(addr)
 *
 * @this {ROM}
 * @param {number} addr
 * @return {boolean}
 */
ROM.prototype.addROM = function(addr)
{
    if (this.bus.addMemory(addr, this.sizeROM, this.fWritable?  Memory.TYPE.RAM : Memory.TYPE.ROM)) {
        if (DEBUG) this.log("addROM(): copying ROM to " + str.toHexLong(addr) + " (" + str.toHexLong(this.abROM.length) + " bytes)");
        var i;
        for (i = 0; i < this.abROM.length; i++) {
            this.bus.setByteDirect(addr + i, this.abROM[i]);
        }
        if (this.fWritable && addr == 0x100) {
            /*
             * Here's where we enable our "Fake CP/M" support, triggered by the user loading a "writable" ROM image
             * at offset 0x100.  Fake CP/M support works by installing HLT opcodes at well-known CP/M addresses
             * (namely, 0x0000, which is the CP/M reset vector, and 0x0005, which is the CP/M system call vector) and
             * then telling the CPU to call us whenever a HLT occurs, so we can check PC for one of these addresses.
             */
            for (i = 0; i < ROM.CPM.VECTORS.length; i++) {
                this.bus.setByteDirect(ROM.CPM.VECTORS[i], CPUDef.OPCODE.HLT);
            }

            this.cpu.addHaltCheck(function(rom) {
                return function(addr) {
                    return rom.checkCPMVector(addr)
                };
            }(this));

            this.cpu.setReset(addr);
        }
        return true;
    }
    /*
     * We don't need to report an error here, because addMemory() already takes care of that.
     */
    return false;
};

/**
 * checkCPMVector(addr)
 *
 * @this {ROM}
 * @param {number} addr (of the HLT opcode)
 * @return {boolean} true if special processing performed, false if not
 */
ROM.prototype.checkCPMVector = function(addr)
{
    var i = ROM.CPM.VECTORS.indexOf(addr);
    if (i >= 0) {
        var fCPM = false;
        var cpu = this.cpu;
        var dbg = this.dbg;
        if (addr == ROM.CPM.BDOS.VECTOR) {
            fCPM = true;
            switch(cpu.regC) {
            case ROM.CPM.BDOS.FUNC.CON_WRITE:
                this.writeCPMString(this.getCPMChar(cpu.regE));
                break;
            case ROM.CPM.BDOS.FUNC.STR_WRITE:
                this.writeCPMString(this.getCPMString(cpu.getDE(), '$'));
                break;
            default:
                fCPM = false;
                break;
            }
        }
        if (fCPM) {
            CPUDef.opRET.call(cpu);         // for recognized calls, automatically return
        }
        else if (dbg) {
            this.println("\nCP/M vector " + str.toHexWord(addr));
            cpu.setPC(addr);                // this is purely for the Debugger's benefit, to show the HLT
            dbg.stopCPU();
        }
        return true;
    }
    return false;
};


/**
 * getCPMChar(ch)
 *
 * @this {ROM}
 * @param {number} ch
 * @return {string}
 */
ROM.prototype.getCPMChar = function(ch)
{
    return String.fromCharCode(ch);
};

/**
 * getCPMString(addr, chEnd)
 *
 * @this {ROM}
 * @param {number} addr (of a string)
 * @param {string|number} [chEnd] (terminating character, default is 0)
 * @return {string}
 */
ROM.prototype.getCPMString = function(addr, chEnd)
{
    var s = "";
    var cchMax = 255;
    var bEnd = chEnd && chEnd.length && chEnd.charCodeAt(0) || chEnd || 0;
    while (cchMax--) {
        var b = this.cpu.getByte(addr++);
        if (b == bEnd) break;
        s += String.fromCharCode(b);
    }
    return s;
};

/**
 * writeCPMString(s)
 *
 * @this {ROM}
 * @param {string} s
 */
ROM.prototype.writeCPMString = function(s)
{
    s = s.replace(/\r/g, '');
    if (this.controlPrint) {
        this.controlPrint.value += s;
        this.controlPrint.scrollTop = this.controlPrint.scrollHeight;
    }
};

/**
 * cloneROM(addr)
 *
 * For ROMs with one or more alias addresses, we used to call addROM() for each address.  However,
 * that obviously wasted memory, since each alias was an independent copy, and if you used the
 * Debugger to edit the ROM in one location, the changes would not appear in the other location(s).
 *
 * Now that the Bus component provides low-level getMemoryBlocks() and setMemoryBlocks() methods
 * to manually get and set the blocks of any memory range, it is now possible to create true aliases.
 *
 * @this {ROM}
 * @param {number} addr
 */
ROM.prototype.cloneROM = function(addr)
{
    var aBlocks = this.bus.getMemoryBlocks(this.addrROM, this.sizeROM);
    this.bus.setMemoryBlocks(addr, this.sizeROM, aBlocks);
};

/**
 * ROM.init()
 *
 * This function operates on every HTML element of class "rom", extracting the
 * JSON-encoded parameters for the ROM constructor from the element's "data-value"
 * attribute, invoking the constructor to create a ROM component, and then binding
 * any associated HTML controls to the new component.
 */
ROM.init = function()
{
    var aeROM = Component.getElementsByClass(document, PC8080.APPCLASS, "rom");
    for (var iROM = 0; iROM < aeROM.length; iROM++) {
        var eROM = aeROM[iROM];
        var parmsROM = Component.getComponentParms(eROM);
        var rom = new ROM(parmsROM);
        Component.bindComponentControls(rom, eROM, PC8080.APPCLASS);
    }
};

/*
 * Initialize all the ROM modules on the page.
 */
web.onInit(ROM.init);


// ./modules/pc8080/lib/ram.js

/**
 * @fileoverview Implements the PC8080 RAM component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-19
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


/**
 * RAM(parmsRAM)
 *
 * The RAM component expects the following (parmsRAM) properties:
 *
 *      addr: starting physical address of RAM (default is 0)
 *      size: amount of RAM, in bytes (default is 0, which means defer to motherboard switch settings)
 *
 * NOTE: We make a note of the specified size, but no memory is initially allocated for the RAM until the
 * Computer component calls powerUp().
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsRAM
 */
function RAM(parmsRAM)
{
    Component.call(this, "RAM", parmsRAM, RAM);

    this.addrRAM = parmsRAM['addr'];
    this.sizeRAM = parmsRAM['size'];
    this.fInstalled = (!!this.sizeRAM); // 0 is the default value for 'size' when none is specified
    this.fAllocated = false;
}

Component.subclass(RAM);

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {RAM}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger} dbg
 */
RAM.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.setReady();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {RAM}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
RAM.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        /*
         * The Computer powers up the CPU last, at which point CPUState state is restored,
         * which includes the Bus state, and since we use the Bus to allocate all our memory,
         * memory contents are already restored for us, so we don't need the usual restore
         * logic.  We just need to call reset(), to allocate memory for the RAM.
         */
        this.reset();
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {RAM}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
RAM.prototype.powerDown = function(fSave, fShutdown)
{
    /*
     * The Computer powers down the CPU first, at which point CPUState state is saved,
     * which includes the Bus state, and since we use the Bus component to allocate all
     * our memory, memory contents are already saved for us, so we don't need the usual
     * save logic.
     */
    return (fSave)? this.save() : true;
};

/**
 * reset()
 *
 * @this {RAM}
 */
RAM.prototype.reset = function()
{
    if (!this.fAllocated && this.sizeRAM) {
        if (this.bus.addMemory(this.addrRAM, this.sizeRAM, Memory.TYPE.RAM)) {
            this.fAllocated = true;
        }
    }
    if (!this.fAllocated) {
        Component.error("No RAM allocated");
    }
};

/**
 * save()
 *
 * This implements save support for the RAM component.
 *
 * @this {RAM}
 * @return {Object}
 */
RAM.prototype.save = function()
{
    return null;
};

/**
 * restore(data)
 *
 * This implements restore support for the RAM component.
 *
 * @this {RAM}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
RAM.prototype.restore = function(data)
{
    return true;
};

/**
 * RAM.init()
 *
 * This function operates on every HTML element of class "ram", extracting the
 * JSON-encoded parameters for the RAM constructor from the element's "data-value"
 * attribute, invoking the constructor to create a RAM component, and then binding
 * any associated HTML controls to the new component.
 */
RAM.init = function()
{
    var aeRAM = Component.getElementsByClass(document, PC8080.APPCLASS, "ram");
    for (var iRAM = 0; iRAM < aeRAM.length; iRAM++) {
        var eRAM = aeRAM[iRAM];
        var parmsRAM = Component.getComponentParms(eRAM);
        var ram = new RAM(parmsRAM);
        Component.bindComponentControls(ram, eRAM, PC8080.APPCLASS);
    }
};

/*
 * Initialize all the RAM modules on the page.
 */
web.onInit(RAM.init);


// ./modules/pc8080/lib/keyboard.js

/**
 * @fileoverview Implements the PC8080 Keyboard component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-19
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


/**
 * Keyboard(parmsKbd)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsKbd
 */
function Keyboard(parmsKbd)
{
    Component.call(this, "Keyboard", parmsKbd, Keyboard, Messages.KEYBOARD);

    this.reset();

    this.setReady();
}

Component.subclass(Keyboard);

/**
 * Alphanumeric and other common (printable) ASCII codes.
 *
 * TODO: Determine what we can do to get ALL constants like these inlined (enum doesn't seem to
 * get the job done); the problem seems to be limited to property references that use quotes, which
 * is why I've 'unquoted' as many of them as possible.
 *
 * @enum {number}
 */
Keyboard.ASCII = {
 CTRL_A:  1, CTRL_C:  3, CTRL_Z: 26,
    ' ': 32,    '!': 33,    '"': 34,    '#': 35,    '$': 36,    '%': 37,    '&': 38,    "'": 39,
    '(': 40,    ')': 41,    '*': 42,    '+': 43,    ',': 44,    '-': 45,    '.': 46,    '/': 47,
    '0': 48,    '1': 49,    '2': 50,    '3': 51,    '4': 52,    '5': 53,    '6': 54,    '7': 55,
    '8': 56,    '9': 57,    ':': 58,    ';': 59,    '<': 60,    '=': 61,    '>': 62,    '?': 63,
    '@': 64,     A:  65,     B:  66,     C:  67,     D:  68,     E:  69,     F:  70,     G:  71,
     H:  72,     I:  73,     J:  74,     K:  75,     L:  76,     M:  77,     N:  78,     O:  79,
     P:  80,     Q:  81,     R:  82,     S:  83,     T:  84,     U:  85,     V:  86,     W:  87,
     X:  88,     Y:  89,     Z:  90,    '[': 91,    '\\':92,    ']': 93,    '^': 94,    '_': 95,
    '`': 96,     a:  97,     b:  98,     c:  99,     d: 100,     e: 101,     f: 102,     g: 103,
     h:  104,    i: 105,     j: 106,     k: 107,     l: 108,     m: 109,     n: 110,     o: 111,
     p:  112,    q: 113,     r: 114,     s: 115,     t: 116,     u: 117,     v: 118,     w: 119,
     x:  120,    y: 121,     z: 122,    '{':123,    '|':124,    '}':125,    '~':126
};

/**
 * Browser keyCodes we must pay particular attention to.  For the most part, these are non-alphanumeric
 * or function keys, some which may require special treatment (eg, preventDefault() if returning false on
 * the initial keyDown event is insufficient).
 *
 * keyCodes for most common ASCII keys can simply use the appropriate ASCII code above.
 *
 * Most of these represent non-ASCII keys (eg, the LEFT arrow key), yet for some reason, browsers defined
 * them using ASCII codes (eg, the LEFT arrow key uses the ASCII code for '%' or 37).  This conflict is
 * discussed further in the definition of CLICKCODE below.
 *
 * @enum {number}
 */
Keyboard.KEYCODE = {
    /* 0x08 */ BS:          8,
    /* 0x09 */ TAB:         9,
    /* 0x0A */ LF:          10,
    /* 0x0D */ CR:          13,
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
    /* 0x5B */ CMD:         91,         // aka WIN
    /* 0x5B */ FF_LBRACK:   91,
    /* 0x5C */ FF_BSLASH:   92,
    /* 0x5D */ RCMD:        93,         // aka MENU
    /* 0x5D */ FF_RBRACK:   93,
    /* 0x60 */ NUM_INS:     96,         // 0
    /* 0x60 */ FF_BQUOTE:   96,
    /* 0x61 */ NUM_END:     97,         // 1
    /* 0x62 */ NUM_DOWN:    98,         // 2
    /* 0x63 */ NUM_PGDN:    99,         // 3
    /* 0x64 */ NUM_LEFT:    100,        // 4
    /* 0x65 */ NUM_CENTER:  101,        // 5
    /* 0x66 */ NUM_RIGHT:   102,        // 6
    /* 0x67 */ NUM_HOME:    103,        // 7
    /* 0x68 */ NUM_UP:      104,        // 8
    /* 0x69 */ NUM_PGUP:    105,        // 9
    /* 0x6A */ NUM_MUL:     106,
    /* 0x6B */ NUM_ADD:     107,
    /* 0x6D */ NUM_SUB:     109,
    /* 0x6E */ NUM_DEL:     110,        // .
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
    /* 0xBA */ SEMI:        186,        // Firefox: 59
    /* 0xBB */ EQUALS:      187,        // Firefox: 61
    /* 0xBC */ COMMA:       188,        // Firefox: 44
    /* 0xBD */ DASH:        189,        // Firefox: 173
    /* 0xBE */ PERIOD:      190,        // Firefox: 46
    /* 0xBF */ SLASH:       191,        // Firefox: 47
    /* 0xC0 */ BQUOTE:      192,        // Firefox: 96
    /* 0xDB */ LBRACK:      219,        // Firefox: 91
    /* 0xDC */ BSLASH:      220,        // Firefox: 92
    /* 0xDD */ RBRACK:      221,        // Firefox: 93
    /* 0xDE */ QUOTE:       222,        // Firefox: 39
    /* 0xE0 */ FF_CMD:      224,        // Firefox only (used for both CMD and RCMD)
    //
    // The following biases use what I'll call Decimal Coded Binary or DCB (the opposite of BCD),
    // where the thousands digit is used to store the sum of "binary" digits 1 and/or 2 and/or 4.
    //
    // Technically, that makes it DCO (Decimal Coded Octal), but then again, BCD should have really
    // been called HCD (Hexadecimal Coded Decimal), so if "they" can take liberties, so can I.
    //
    // ONDOWN is a bias we add to browser keyCodes that we want to handle on "down" rather than on "press".
    //
    ONDOWN:                 1000,
    //
    // ONRIGHT is a bias we add to browser keyCodes that need to check for a "right" location (default is "left")
    //
    ONRIGHT:                2000,
    //
    // FAKE is a bias we add to signal these are fake keyCodes corresponding to internal keystroke combinations.
    // The actual values are for internal use only and merely need to be unique and used consistently.
    //
    FAKE:                   4000
};

/*
 * Maps "stupid" keyCodes to their "non-stupid" counterparts
 */
Keyboard.STUPID_KEYCODES = {};
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.SEMI]    = Keyboard.ASCII[';'];   // 186 -> 59
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.EQUALS]  = Keyboard.ASCII['='];   // 187 -> 61
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.COMMA]   = Keyboard.ASCII[','];   // 188 -> 44
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.DASH]    = Keyboard.ASCII['-'];   // 189 -> 45
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.PERIOD]  = Keyboard.ASCII['.'];   // 190 -> 46
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.SLASH]   = Keyboard.ASCII['/'];   // 191 -> 47
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.BQUOTE]  = Keyboard.ASCII['`'];   // 192 -> 96
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.LBRACK]  = Keyboard.ASCII['['];   // 219 -> 91
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.BSLASH]  = Keyboard.ASCII['\\'];  // 220 -> 92
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.RBRACK]  = Keyboard.ASCII[']'];   // 221 -> 93
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.QUOTE]   = Keyboard.ASCII["'"];   // 222 -> 39
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.FF_DASH] = Keyboard.ASCII['-'];

/**
 * Maps SOFTCODE (string) to KEYCODE (number).
 *
 * @enum {number}
 */
Keyboard.SOFTCODES = {
    '1p':       Keyboard.KEYCODE.ONE,
    '2p':       Keyboard.KEYCODE.TWO,
    'coin':     Keyboard.KEYCODE.THREE,
    'left':     Keyboard.KEYCODE.LEFT,
    'right':    Keyboard.KEYCODE.RIGHT,
    'fire':     Keyboard.KEYCODE.SPACE
};

/**
 * Alternate keyCode mappings (to support the popular WASD directional mappings)
 *
 * TODO: ES6 computed property name support may now be in all mainstream browsers, allowing us to use
 * a simple object literal for this and all other object initializations.
 */
Keyboard.ALTCODES = {};
Keyboard.ALTCODES[Keyboard.ASCII.A] = Keyboard.KEYCODE.LEFT;
Keyboard.ALTCODES[Keyboard.ASCII.D] = Keyboard.KEYCODE.RIGHT;
Keyboard.ALTCODES[Keyboard.ASCII.L] = Keyboard.KEYCODE.SPACE;

/**
 * getSoftCode(keyCode)
 *
 * @this {Keyboard}
 * @return {string|null}
 */
Keyboard.prototype.getSoftCode = function(keyCode)
{
    keyCode = Keyboard.ALTCODES[keyCode] || keyCode;
    for (var sSoftCode in Keyboard.SOFTCODES) {
        if (Keyboard.SOFTCODES[sSoftCode] === keyCode) {
            return sSoftCode;
        }
    }
    return null;
};

/**
 * reset()
 *
 * @this {Keyboard}
 */
Keyboard.prototype.reset = function()
{
    /*
     * As SOFTCODE keyDown events are encountered, a corresponding property is set to true in
     * keysPressed, and as SOFTCODE keyUp events are encountered, the property is set to false.
     */
    this.keysPressed = {};
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {Keyboard}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "esc")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Keyboard.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    /*
     * There's a special binding that the Video component uses ("kbd") to effectively bind its
     * screen to the entire keyboard, in Video.powerUp(); ie:
     *
     *      video.kbd.setBinding("canvas", "kbd", video.canvasScreen);
     * or:
     *      video.kbd.setBinding("textarea", "kbd", video.textareaScreen);
     *
     * However, it's also possible for the keyboard XML definition to define a control that serves
     * a similar purpose; eg:
     *
     *      <control type="text" binding="kbd" width="2em">Kbd</control>
     *
     * The latter is purely experimental, while we work on finding ways to trigger the soft keyboard on
     * certain pesky devices (like the Kindle Fire).  Note that even if you use the latter, the former will
     * still be enabled (there's currently no way to configure the Video component to not bind its screen,
     * but we could certainly add one if the need ever arose).
     */
    var kbd = this;
    var id = sHTMLType + '-' + sBinding;

    if (this.bindings[id] === undefined) {
        switch (sBinding) {
        case "kbd":
            /*
             * Recording the binding ID prevents multiple controls (or components) from attempting to erroneously
             * bind a control to the same ID, but in the case of a "dual display" configuration, we actually want
             * to allow BOTH video components to call setBinding() for "kbd", so that it doesn't matter which
             * display the user gives focus to.
             *
             *      this.bindings[id] = control;
             */
            control.onkeydown = function onKeyDown(event) {
                return kbd.onKeyDown(event, true);
            };
            control.onkeyup = function onKeyUp(event) {
                return kbd.onKeyDown(event, false);
            };
            return true;

        default:
            if (Keyboard.SOFTCODES[sBinding] !== undefined) {
                this.bindings[id] = control;
                var fnDown = function(kbd, sSoftCode) {
                    return function onMouseOrTouchDownKeyboard(event) {
                        kbd.onSoftKeyDown(sSoftCode, true);
                    };
                }(this, sBinding);
                var fnUp = function (kbd, sSoftCode) {
                    return function onMouseOrTouchUpKeyboard(event) {
                        kbd.onSoftKeyDown(sSoftCode, false);
                    };
                }(this, sBinding);
                if ('ontouchstart' in window) {
                    control.ontouchstart = fnDown;
                    control.ontouchend = fnUp;
                } else {
                    control.onmousedown = fnDown;
                    control.onmouseup = control.onmouseout = fnUp;
                }
                return true;
            }
            break;
        }
    }
    return false;
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {Keyboard}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger} dbg
 */
Keyboard.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.dbg = dbg;     // NOTE: The "dbg" property must be set for the message functions to work
    this.chipset = cmp.getMachineComponent("ChipSet");
};

/**
 * onKeyDown(event, fDown)
 *
 * @this {Keyboard}
 * @param {Object} event
 * @param {boolean} fDown is true for a keyDown event, false for a keyUp event
 * @return {boolean} true to pass the event along, false to consume it
 */
Keyboard.prototype.onKeyDown = function(event, fDown)
{
    var fPass = true;
    var keyCode = event.keyCode;
    var sSoftCode = this.getSoftCode(keyCode);

    if (sSoftCode) {
        fPass = this.onSoftKeyDown(sSoftCode, fDown);
    }

    if (!fPass) {
        event.preventDefault();
    }

    if (!COMPILED && this.messageEnabled(Messages.KEYS)) {
        this.printMessage("onKey" + (fDown? "Down" : "Up") + "(" + keyCode + "): " + (fPass? "true" : "false"), true);
    }

    return fPass;
};

/**
 * onSoftKeyDown(sSoftCode, fDown)
 *
 * @this {Keyboard}
 * @param {string} sSoftCode
 * @param {boolean} fDown is true for a down event, false for an up event
 * @return {boolean} true to pass the event along, false to consume it
 */
Keyboard.prototype.onSoftKeyDown = function(sSoftCode, fDown)
{
    this.keysPressed[sSoftCode] = fDown;

    if (this.chipset) {
        switch(sSoftCode) {
        case '1p':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.P1, fDown);
            break;

        case '2p':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.P2, fDown);
            break;

        case 'coin':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.CREDIT, fDown);
            break;

        case 'left':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.P1_LEFT, fDown);
            break;

        case 'right':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.P1_RIGHT, fDown);
            break;

        case 'fire':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.P1_FIRE, fDown);
            break;
        }
    }
    return false;
};

/**
 * Keyboard.init()
 *
 * This function operates on every HTML element of class "keyboard", extracting the
 * JSON-encoded parameters for the Keyboard constructor from the element's "data-value"
 * attribute, invoking the constructor to create a Keyboard component, and then binding
 * any associated HTML controls to the new component.
 */
Keyboard.init = function()
{
    var aeKbd = Component.getElementsByClass(document, PC8080.APPCLASS, "keyboard");
    for (var iKbd = 0; iKbd < aeKbd.length; iKbd++) {
        var eKbd = aeKbd[iKbd];
        var parmsKbd = Component.getComponentParms(eKbd);
        var kbd = new Keyboard(parmsKbd);
        Component.bindComponentControls(kbd, eKbd, PC8080.APPCLASS);
    }
};

/*
 * Initialize every Keyboard module on the page.
 */
web.onInit(Keyboard.init);


// ./modules/pc8080/lib/video.js

/**
 * @fileoverview Implements the PC8080 Video component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-20
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


/**
 * Video(parmsVideo, canvas, context, textarea, container)
 *
 * The Video component can be configured with the following (parmsVideo) properties:
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
 * We record all the above values now, but we defer creation of the frame buffer until our initBus()
 * handler is called.  At that point, we will also compute the extent of the frame buffer, determine the
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
 * of the off-screen buffer and then relies on setPixel() to "rotate" the data into it.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsVideo
 * @param {Object} [canvas]
 * @param {Object} [context]
 * @param {Object} [textarea]
 * @param {Object} [container]
 */
function Video(parmsVideo, canvas, context, textarea, container)
{
    var video = this;
    this.fGecko = web.isUserAgent("Gecko/");
    var i, sEvent, asWebPrefixes = ['', 'moz', 'ms', 'webkit'];

    Component.call(this, "Video", parmsVideo, Video, Messages.VIDEO);

    this.cxScreen = parmsVideo['screenWidth'];
    this.cyScreen = parmsVideo['screenHeight'];

    this.addrBuffer = parmsVideo['bufferAddr'];
    this.fUseRAM = parmsVideo['bufferRAM'];

    var sFormat = parmsVideo['bufferFormat'];
    this.nFormat = sFormat && Video.FORMATS[sFormat.toLowerCase()] || Video.FORMAT.UNKNOWN;

    this.cxBuffer = parmsVideo['bufferCols'];
    this.cyBuffer = parmsVideo['bufferRows'];
    this.nBitsPerPixel = parmsVideo['bufferBits'] || 1;
    this.iBitFirstPixel = parmsVideo['bufferLeft'] || 0;
    this.rotateBuffer = parmsVideo['bufferRotate'];
    if (this.rotateBuffer) {
        this.rotateBuffer = this.rotateBuffer % 360;
        if (this.rotateBuffer > 0) this.rotateBuffer -= 360;
        if (this.rotateBuffer != -90) {
            this.notice("unsupported buffer rotation: " + this.rotateBuffer);
            this.rotateBuffer = 0;
        }
    }

    this.interruptRate = parmsVideo['interruptRate'];
    this.refreshRate = parmsVideo['refreshRate'] || 60;

    this.canvasScreen = canvas;
    this.contextScreen = context;
    this.textareaScreen = textarea;
    this.inputScreen = textarea || canvas || null;

    /*
     * Support for disabling (or, less commonly, enabling) image smoothing, which all browsers
     * seem to support now (well, OK, I still have to test the latest MS Edge browser), despite
     * it still being labelled "experimental technology".  Let's hope the browsers standardize
     * on this.  I see other options emerging, like the CSS property "image-rendering: pixelated"
     * that's apparently been added to Chrome.  Sigh.
     */
    var fSmoothing = parmsVideo['smoothing'];
    var sSmoothing = Component.parmsURL['smoothing'];
    if (sSmoothing) fSmoothing = (sSmoothing == "true");
    if (fSmoothing != null) {
        for (i = 0; i < asWebPrefixes.length; i++) {
            sEvent = asWebPrefixes[i];
            if (!sEvent) {
                sEvent = 'imageSmoothingEnabled';
            } else {
                sEvent += 'ImageSmoothingEnabled';
            }
            if (this.contextScreen[sEvent] !== undefined) {
                this.contextScreen[sEvent] = fSmoothing;
                break;
            }
        }
    }

    this.rotateScreen = parmsVideo['screenRotate'];
    if (this.rotateScreen) {
        this.rotateScreen = this.rotateScreen % 360;
        if (this.rotateScreen > 0) this.rotateScreen -= 360;
        if (this.rotateScreen != -90) {
            this.notice("unsupported screen rotation: " + this.rotateScreen);
            this.rotateScreen = 0;
        } else {
            this.contextScreen.translate(0, this.cyScreen);
            this.contextScreen.rotate((this.rotateScreen * Math.PI)/180);
            this.contextScreen.scale(this.cyScreen/this.cxScreen, this.cxScreen/this.cyScreen);
        }
    }

    this.initColors();

    /*
     * Allocate off-screen buffers.
     */
    var cxBuffer = this.cxBuffer;
    var cyBuffer = this.cyBuffer;
    if (this.rotateBuffer) {
        cxBuffer = this.cyBuffer;
        cyBuffer = this.cxBuffer;
    }
    this.imageBuffer = this.contextScreen.createImageData(cxBuffer, cyBuffer);
    this.canvasBuffer = document.createElement("canvas");
    this.canvasBuffer.width = cxBuffer;
    this.canvasBuffer.height = cyBuffer;
    this.contextBuffer = this.canvasBuffer.getContext("2d");

    /*
     * Here's the gross code to handle full-screen support across all supported browsers.  The lack of standards
     * is exasperating; browsers can't agree on 'full' or 'Full, 'request' or 'Request', 'screen' or 'Screen', and
     * while some browsers honor other browser prefixes, most browsers don't.
     */
    this.container = container;
    if (this.container) {
        this.container.doFullScreen = container['requestFullscreen'] || container['msRequestFullscreen'] || container['mozRequestFullScreen'] || container['webkitRequestFullscreen'];
        if (this.container.doFullScreen) {
            for (i = 0; i < asWebPrefixes.length; i++) {
                sEvent = asWebPrefixes[i] + 'fullscreenchange';
                if ('on' + sEvent in document) {
                    var onFullScreenChange = function() {
                        var fFullScreen = (document['fullscreenElement'] || document['msFullscreenElement'] || document['mozFullScreenElement'] || document['webkitFullscreenElement']);
                        video.notifyFullScreen(fFullScreen? true : false);
                    };
                    document.addEventListener(sEvent, onFullScreenChange, false);
                    break;
                }
            }
            for (i = 0; i < asWebPrefixes.length; i++) {
                sEvent = asWebPrefixes[i] + 'fullscreenerror';
                if ('on' + sEvent in document) {
                    var onFullScreenError = function() {
                        video.notifyFullScreen(null);
                    };
                    document.addEventListener(sEvent, onFullScreenError, false);
                    break;
                }
            }
        }
    }

    if (DEBUG) this.nCyclesPrev = 0;
}

Component.subclass(Video);

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
    "vt100":        Video.FORMAT.VT100
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {Video}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger} dbg
 */
Video.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;

    if (!this.nFormat) {
        this.chipset = cmp.getMachineComponent("ChipSet");
        if (this.chipset && this.chipset.model == ChipSet.SI_1978.MODEL) {
            this.nFormat = Video.FORMAT.SI1978;
        }
    }

    /*
     * Compute the size of the frame buffer and allocate.
     */
    if (!this.fUseRAM) {
        this.sizeBuffer = ((this.cxBuffer * this.nBitsPerPixel) >> 3) * this.cyBuffer;
        if (this.bus.addMemory(this.addrBuffer, this.sizeBuffer, Memory.TYPE.VIDEO)) {
            /*
             * Compute the number of cells and initialize the cell cache; note that sizeBuffer is a number of
             * bytes, whereas nCellCache is a number of 16-bit words (aka shorts) because we fetch memory 16 bits
             * at a time during screen updates.
             */
            this.nCellCache = this.sizeBuffer >> 1;
            this.nPixelsPerCell = (16 / this.nBitsPerPixel)|0;
            this.initCache();
        }
    }

    /*
     * If we have an associated keyboard, then ensure that the keyboard will be notified whenever the canvas
     * gets focus and receives input.
     */
    this.kbd = cmp.getMachineComponent("Keyboard");
    if (this.kbd && this.canvasScreen) {
        this.kbd.setBinding(this.textareaScreen? "textarea" : "canvas", "kbd", this.inputScreen);
    }

    this.setReady();
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {Video}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "refresh")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Video.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    var video = this;

    switch (sBinding) {
    case "fullScreen":
        this.bindings[sBinding] = control;
        if (this.container && this.container.doFullScreen) {
            control.onclick = function onClickFullScreen() {
                if (DEBUG) video.printMessage("fullScreen()");
                video.doFullScreen();
            };
        } else {
            if (DEBUG) this.log("FullScreen API not available");
            control.parentNode.removeChild(/** @type {Node} */ (control));
        }
        return true;

    default:
        break;
    }
    return false;
};

/**
 * doFullScreen()
 *
 * @this {Video}
 * @return {boolean} true if request successful, false if not (eg, failed OR not supported)
 */
Video.prototype.doFullScreen = function()
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
};

/**
 * notifyFullScreen(fFullScreen)
 *
 * @this {Video}
 * @param {boolean|null} fFullScreen (null if there was a full-screen error)
 */
Video.prototype.notifyFullScreen = function(fFullScreen)
{
    if (!fFullScreen && this.container) {
        if (!this.fGecko) {
            this.container.style.width = this.container.style.height = "";
        } else {
            this.canvasScreen.style.width = this.canvasScreen.style.height = "";
        }
    }
    this.printMessage("notifyFullScreen(" + fFullScreen + ")", true);
};

/**
 * setFocus()
 *
 * @this {Video}
 */
Video.prototype.setFocus = function()
{
    if (this.inputScreen) this.inputScreen.focus();
};

/**
 * getRefreshRate()
 *
 * @this {Video}
 * @return {number}
 */
Video.prototype.getRefreshRate = function()
{
    return Math.max(this.refreshRate, this.interruptRate);
};

/**
 * initCache()
 *
 * Initializes the contents of our internal cell cache.
 *
 * @this {Video}
 */
Video.prototype.initCache = function()
{
    this.fCellCacheValid = false;
    if (this.aCellCache === undefined || this.aCellCache.length != this.nCellCache) {
        this.aCellCache = new Array(this.nCellCache);
    }
};

/**
 * initColors()
 *
 * This creates an array of nColors, with additional OVERLAY_TOTAL colors tacked on to the end of the array.
 *
 * @this {Video}
 */
Video.prototype.initColors = function()
{
    var rgbBlack  = [0x00, 0x00, 0x00, 0xff];
    var rgbWhite  = [0xff, 0xff, 0xff, 0xff];
    this.nColors = (1 << this.nBitsPerPixel);
    this.aRGB = new Array(this.nColors + Video.COLORS.OVERLAY_TOTAL);
    this.aRGB[0] = rgbBlack;
    this.aRGB[1] = rgbWhite;
    if (this.nFormat == Video.FORMAT.SI1978) {
        var rgbGreen  = [0x00, 0xff, 0x00, 0xff];
        var rgbYellow = [0xff, 0xff, 0x00, 0xff];
        this.aRGB[this.nColors + Video.COLORS.OVERLAY_TOP] = rgbYellow;
        this.aRGB[this.nColors + Video.COLORS.OVERLAY_BOTTOM] = rgbGreen;
    }
};

/**
 * setPixel(imageBuffer, x, y, bPixel)
 *
 * @this {Video}
 * @param {Object} imageBuffer
 * @param {number} x
 * @param {number} y
 * @param {number} bPixel (ie, an index into aRGB)
 */
Video.prototype.setPixel = function(imageBuffer, x, y, bPixel)
{
    var index;
    if (!this.rotateBuffer) {
        index = (x + y * imageBuffer.width);
    } else {
        index = (imageBuffer.height - x - 1) * imageBuffer.width + y;
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
    imageBuffer.data[index] = rgb[0];
    imageBuffer.data[index+1] = rgb[1];
    imageBuffer.data[index+2] = rgb[2];
    imageBuffer.data[index+3] = rgb[3];
};

/**
 * updateScreen(n)
 *
 * Propagates the video buffer to the cell cache and updates the screen with any changes.  Forced updates
 * are generally internal updates triggered by an I/O operation or other state change, while non-forced updates
 * are the periodic updates coming from the CPU.
 *
 * For every cell in the video buffer, compare it to the cell stored in the cell cache, render if it differs,
 * and then update the cell cache to match.  Since initCache() sets every cell in the cell cache to an
 * invalid value, we're assured that the next call to updateScreen() will redraw the entire (visible) video buffer.
 *
 * @this {Video}
 * @param {number} n (where 0 <= n < getRefreshRate() for a normal update, or -1 for a forced update)
 */
Video.prototype.updateScreen = function(n)
{
    var fClean;
    var fUpdate = true;

    if (n >= 0) {
        if (!(n & 1)) {
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

        /*
         * Since this is not a forced update, if our cell cache is valid AND the buffer is clean, then do nothing.
         */
        if (fUpdate && this.fCellCacheValid) {
            if ((fClean = this.bus.cleanMemory(this.addrBuffer, this.sizeBuffer))) {
                fUpdate = false;
            }
        }
    }

    if (DEBUG) {
        var nCycles = this.cpu.getCycles();
        var nCyclesDelta = nCycles - this.nCyclesPrev;
        this.nCyclesPrev = nCycles;
        this.printMessage("updateScreen(" + n + "): clean=" + fClean + ", update=" + fUpdate + ", cycles=" + nCycles + ", delta=" + nCyclesDelta);
    }
    if (!fUpdate) return;

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
        var data = this.bus.getShortDirect(addr);

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
        this.contextScreen.drawImage(this.canvasBuffer, 0, 0, this.canvasBuffer.width, this.canvasBuffer.height, 0, 0, this.cxScreen, this.cyScreen);
    }
};

/**
 * Video.init()
 *
 * This function operates on every HTML element of class "video", extracting the
 * JSON-encoded parameters for the Video constructor from the element's "data-value"
 * attribute, invoking the constructor to create a Video component, and then binding
 * any associated HTML controls to the new component.
 */
Video.init = function()
{
    var aeVideo = Component.getElementsByClass(document, PC8080.APPCLASS, "video");
    for (var iVideo = 0; iVideo < aeVideo.length; iVideo++) {
        var eVideo = aeVideo[iVideo];
        var parmsVideo = Component.getComponentParms(eVideo);

        var eCanvas = document.createElement("canvas");
        if (eCanvas === undefined || !eCanvas.getContext) {
            eVideo.innerHTML = "<br/>Missing &lt;canvas&gt; support. Please try a newer web browser.";
            return;
        }

        eCanvas.setAttribute("class", "pcjs-canvas");
        eCanvas.setAttribute("width", parmsVideo['screenWidth']);
        eCanvas.setAttribute("height", parmsVideo['screenHeight']);
        eCanvas.style.backgroundColor = parmsVideo['screenColor'];

        /*
         * The "contenteditable" attribute on a canvas element NOTICEABLY slows down canvas drawing on
         * Safari as soon as you give the canvas focus (ie, click away from the canvas, and drawing speeds
         * up; click on the canvas, and drawing slows down).  So the "transparent textarea hack" that we
         * once employed as only a work-around for Android devices is now our default.
         *
         *      eCanvas.setAttribute("contenteditable", "true");
         *
         * HACK: A canvas style of "auto" provides for excellent responsive canvas scaling in EVERY browser
         * except IE9/IE10, so I recalculate the appropriate CSS height every time the parent DIV is resized;
         * IE11 works without this hack, so we take advantage of the fact that IE11 doesn't identify as "MSIE".
         *
         * The other reason it's good to keep this particular hack limited to IE9/IE10 is that most other
         * browsers don't actually support an 'onresize' handler on anything but the window object.
         */
        eCanvas.style.height = "auto";
        if (web.getUserAgent().indexOf("MSIE") >= 0) {
            eVideo.onresize = function(eParent, eChild, cx, cy) {
                return function onResizeVideo() {
                    eChild.style.height = (((eParent.clientWidth * cy) / cx) | 0) + "px";
                };
            }(eVideo, eCanvas, parmsVideo['screenWidth'], parmsVideo['screenHeight']);
            eVideo.onresize();
        }
        /*
         * The following is a related hack that allows the user to force the screen to use a particular aspect
         * ratio if an 'aspect' attribute or URL parameter is set.  Initially, it's just for testing purposes
         * until we figure out a better UI.  And note that we use our web.onPageEvent() helper function to make
         * sure we don't trample any other 'onresize' handler(s) attached to the window object.
         */
        var aspect = +(parmsVideo['aspect'] || Component.parmsURL['aspect']);
        /*
         * No 'aspect' parameter yields NaN, which is falsey, and anything else must satisfy my arbitrary
         * constraints of 0.3 <= aspect <= 3.33, to prevent any useless (or worse, browser-blowing) results.
         */
        if (aspect && aspect >= 0.3 && aspect <= 3.33) {
            web.onPageEvent('onresize', function(eParent, eChild, aspectRatio) {
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
            }(eVideo, eCanvas, aspect));
            window['onresize']();
        }
        eVideo.appendChild(eCanvas);

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
         *      var eInput = document.createElement("input");
         *      eInput.setAttribute("type", "password");
         *      eInput.setAttribute("style", "position:absolute; left:0; top:0; width:100%; height:100%; opacity:0.5");
         *      eVideo.appendChild(eInput);
         *
         * See this Chromium issue for more information: https://code.google.com/p/chromium/issues/detail?id=118639
         */
        var eTextArea = document.createElement("textarea");

        /*
         * As noted in keyboard.js, the keyboard on an iOS device tends to pop up with the SHIFT key depressed,
         * which is not the initial keyboard state that the Keyboard component expects, so hopefully turning off
         * these "auto" attributes will help.
         */
        if (web.isUserAgent("iOS")) {
            eTextArea.setAttribute("autocapitalize", "off");
            eTextArea.setAttribute("autocorrect", "off");
        }
        eVideo.appendChild(eTextArea);

        /*
         * Now we can create the Video object, record it, and wire it up to the associated document elements.
         */
        var eContext = eCanvas.getContext("2d");
        var video = new Video(parmsVideo, eCanvas, eContext, eTextArea /* || eInput */, eVideo);

        /*
         * Bind any video-specific controls (eg, the Refresh button). There are no essential controls, however;
         * even the "Refresh" button is just a diagnostic tool, to ensure that the screen contents are up-to-date.
         */
        Component.bindComponentControls(video, eVideo, PC8080.APPCLASS);
    }
};

/*
 * Initialize every Video module on the page.
 */
web.onInit(Video.init);


// ./modules/pc8080/lib/debugger.js

/**
 * @fileoverview Implements the PC8080 Debugger component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
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

if (DEBUGGER) {
}

/**
 * Debugger Address Object
 *
 *      addr            address
 *      fTemporary      true if this is a temporary breakpoint address
 *      sCmd            set for breakpoint addresses if there's an associated command string
 *      aCmds           preprocessed commands (from sCmd)
 *
 * @typedef {{
 *      addr:(number|undefined),
 *      fTemporary:(boolean|undefined),
 *      sCmd:(string|undefined),
 *      aCmds:(Array.<string>|undefined)
 * }}
 */
var DbgAddr;

/**
 * Debugger(parmsDbg)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsDbg
 *
 * The Debugger component supports the following optional (parmsDbg) properties:
 *
 *      commands: string containing zero or more commands, separated by ';'
 *
 *      messages: string containing zero or more message categories to enable;
 *      multiple categories must be separated by '|' or ';'.  Parsed by messageInit().
 *
 * The Debugger component is an optional component that implements a variety of user
 * commands for controlling the CPU, dumping and editing memory, etc.
 */
function Debugger(parmsDbg)
{
    if (DEBUGGER) {

        Component.call(this, "Debugger", parmsDbg, Debugger);

        this.style = Debugger.STYLE_8080;

        /*
         * These keep track of instruction activity, but only when tracing or when Debugger checks
         * have been enabled (eg, one or more breakpoints have been set).
         *
         * They are zeroed by the reset() notification handler.  cInstructions is advanced by
         * stepCPU() and checkInstruction() calls.  nCycles is updated by every stepCPU() or stop()
         * call and simply represents the number of cycles performed by the last run of instructions.
         */
        this.nCycles = 0;
        this.cOpcodes = this.cOpcodesStart = 0;

        /*
         * Most commands that require an address call parseAddr(), which defaults to dbgAddrNextCode
         * or dbgAddrNextData when no address has been given.  doDump() and doUnassemble(), in turn,
         * update dbgAddrNextData and dbgAddrNextCode, respectively, when they're done.
         *
         * For TEMPORARY breakpoint addresses, we set fTemporary to true, so that they can be automatically
         * cleared when they're hit.
         */
        this.dbgAddrNextCode = this.newAddr();
        this.dbgAddrNextData = this.newAddr();

        /*
         * This maintains command history.  New commands are inserted at index 0 of the array.
         * When Enter is pressed on an empty input buffer, we default to the command at aPrevCmds[0].
         */
        this.iPrevCmd = -1;
        this.aPrevCmds = [];

        /*
         * fAssemble is true when "assemble mode" is active, false when not.
         */
        this.fAssemble = false;
        this.dbgAddrAssemble = this.newAddr();

        /*
         * aSymbolTable is an array of SymbolTable objects, one per ROM or other chunk of address space,
         * where each object contains the following properties:
         *
         *      sModule
         *      addr (physical address, if any; eg, symbols for a ROM)
         *      len
         *      aSymbols
         *      aOffsets
         *
         * See addSymbols() for more details, since that's how callers add sets of symbols to the table.
         */
        this.aSymbolTable = [];

        /*
         * aVariables is an object with properties that grows as setVariable() assigns more variables;
         * each property corresponds to one variable, where the property name is the variable name (ie,
         * a string beginning with a letter or underscore, followed by zero or more additional letters,
         * digits, or underscores) and the property value is the variable's numeric value.  See doVar()
         * and setVariable() for details.
         *
         * Note that parseValue(), through its reliance on str.parseInt(), assumes a default base of 16
         * if no base is explicitly indicated (eg, a trailing decimal period), and if you define variable
         * names containing exclusively hex alpha characters (a-f), those variables will take precedence
         * over the corresponding hex values.  In other words, if you define variables "a" and "b", you
         * will no longer be able to simply type "a" or "b" to specify the decimal values 10 or 11.
         */
        this.aVariables = {};

        /*
         * clearBreakpoints() initializes the breakpoints lists: aBreakExec is a list of addresses
         * to halt on whenever attempting to execute an instruction at the corresponding address,
         * and aBreakRead and aBreakWrite are lists of addresses to halt on whenever a read or write,
         * respectively, occurs at the corresponding address.
         *
         * NOTE: Curiously, after upgrading the Google Closure Compiler from v20141215 to v20150609,
         * the resulting compiled code would crash in clearBreakpoints(), because the (renamed) aBreakRead
         * property was already defined.  To eliminate whatever was confusing the Closure Compiler, I've
         * explicitly initialized all the properties that clearBreakpoints() (re)initializes.
         */
        this.aBreakExec = this.aBreakRead = this.aBreakWrite = [];
        this.clearBreakpoints();

        /*
         * The new "bn" command allows you to specify a number of instructions to execute and then stop;
         * "bn 0" disables any outstanding count.
         */
        this.nBreakIns = 0;

        /*
         * Execution history is allocated by historyInit() whenever checksEnabled() conditions change.
         * Execution history is updated whenever the CPU calls checkInstruction(), which will happen
         * only when checksEnabled() returns true (eg, whenever one or more breakpoints have been set).
         * This ensures that, by default, the CPU runs as fast as possible.
         */
        this.historyInit();

        /*
         * Initialize Debugger message support
         */
        this.afnDumpers = [];
        this.messageInit(parmsDbg['messages']);

        this.sInitCommands = parmsDbg['commands'];

        /*
         * Make it easier to access Debugger commands from an external REPL (eg, the WebStorm
         * "live" console window); eg:
         *
         *      $('r')
         *      $('dw 0:0')
         *      $('h')
         *      ...
         */
        var dbg = this;
        if (window) {
            if (window['$'] === undefined) {
                window['$'] = function(s) { return dbg.doCommands(s); };
            }
        } else {
            if (global['$'] === undefined) {
                global['$'] = function(s) { return dbg.doCommands(s); };
            }
        }

    }   // endif DEBUGGER
}

if (DEBUGGER) {

    Component.subclass(Debugger);

    /*
     * NOTE: Every Debugger property from here to the first prototype function definition (initBus()) is a
     * considered a "class constant"; most of them use our "all-caps" convention (and all of them SHOULD, but
     * that wouldn't help us catch any bugs).
     *
     * Technically, all of them should ALSO be preceded by a "@const" annotation, but that's a lot of work and it
     * really clutters the code.  I wish the Closure Compiler had a way to annotate every definition with a given
     * section with a single annotation....
     *
     * Bugs can slip through the cracks without those annotations; for example, I unthinkingly redefined TYPE_SI
     * at one point, and if all the definitions had been preceded by an "@const", that mistake would have been
     * caught at compile-time.
     */

    Debugger.COMMANDS = {
        '?':     "help/print",
        'a [#]': "assemble",            // TODO: Implement this command someday
        'b [#]': "breakpoint",          // multiple variations (use b? to list them)
        'c':     "clear output",
        'd [#]': "dump memory",         // additional syntax: d [#] [l#], where l# is a number of bytes to dump
        'e [#]': "edit memory",
        'f':     "frequencies",
        'g [#]': "go [to #]",
        'h':     "halt",
        'i [#]': "input port #",
        'if':    "eval expression",
        'k':     "stack trace",
        "ln":    "list nearest symbol(s)",
        'm':     "messages",
        'o [#]': "output port #",
        'p':     "step over",           // other variations: pr (step and dump registers)
        'print': "print expression",
        'r':     "dump/set registers",
        'reset': "reset machine",
        's':     "set options",
        't [#]': "trace",               // other variations: tr (trace and dump registers)
        'u [#]': "unassemble",
        'v':     "print version",
        'var':   "assign variable"
    };

    Debugger.STYLE_8080 = 8080;
    Debugger.STYLE_8086 = 8086;

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
     * NOte that TYPE_M isn't really a register, just an alternative form of TYPE_HL | TYPE_MEM.
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

    /*
     * Message categories supported by the messageEnabled() function and other assorted message
     * functions. Each category has a corresponding bit value that can be combined (ie, OR'ed) as
     * needed.  The Debugger's message command ("m") is used to turn message categories on and off,
     * like so:
     *
     *      m port on
     *      m port off
     *      ...
     *
     * NOTE: The order of these categories can be rearranged, alphabetized, etc, as desired; just be
     * aware that changing the bit values could break saved Debugger states (not a huge concern, just
     * something to be aware of).
     */
    Debugger.MESSAGES = {
        "cpu":      Messages.CPU,
        "bus":      Messages.BUS,
        "mem":      Messages.MEM,
        "port":     Messages.PORT,
        "chipset":  Messages.CHIPSET,
        "keyboard": Messages.KEYBOARD,  // "kbd" is also allowed as shorthand for "keyboard"; see doMessages()
        "key":      Messages.KEYS,      // using "key" instead of "keys", since the latter is a method on JavasScript objects
        "video":    Messages.VIDEO,
        "fdc":      Messages.FDC,
        "disk":     Messages.DISK,
        "serial":   Messages.SERIAL,
        "speaker":  Messages.SPEAKER,
        "computer": Messages.COMPUTER,
        "log":      Messages.LOG,
        "warn":     Messages.WARN,
        /*
         * Now we turn to message actions rather than message types; for example, setting "halt"
         * on or off doesn't enable "halt" messages, but rather halts the CPU on any message above.
         *
         * Similarly, "m buffer on" turns on message buffering, defering the display of all messages
         * until "m buffer off" is issued.
         */
        "buffer":   Messages.BUFFER,
        "halt":     Messages.HALT
    };

    Debugger.HISTORY_LIMIT = DEBUG? 100000 : 1000;

    /**
     * initBus(bus, cpu, dbg)
     *
     * @this {Debugger}
     * @param {Computer} cmp
     * @param {Bus} bus
     * @param {CPUState} cpu
     * @param {Debugger} dbg
     */
    Debugger.prototype.initBus = function(cmp, bus, cpu, dbg)
    {
        this.bus = bus;
        this.cpu = cpu;
        this.cmp = cmp;

        /*
         * Re-initialize Debugger message support if necessary
         */
        var sMessages = cmp.getMachineParm('messages');
        if (sMessages) this.messageInit(sMessages);

        this.aaOpDescs = Debugger.aaOpDescs;

        this.messageDump(Messages.BUS,  function onDumpBus(asArgs) { dbg.dumpBus(asArgs); });

        this.setReady();
    };

    /**
     * setBinding(sHTMLType, sBinding, control, sValue)
     *
     * @this {Debugger}
     * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "debugInput")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    Debugger.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
    {
        var dbg = this;
        switch (sBinding) {

        case "debugInput":
            this.bindings[sBinding] = control;
            this.controlDebug = control;
            /*
             * For halted machines, this is fine, but for auto-start machines, it can be annoying.
             *
             *      control.focus();
             */
            control.onkeydown = function onKeyDownDebugInput(event) {
                var sCmds;
                if (event.keyCode == Keyboard.KEYCODE.CR) {
                    sCmds = control.value;
                    control.value = "";
                    dbg.doCommands(sCmds, true);
                }
                else if (event.keyCode == Keyboard.KEYCODE.ESC) {
                    control.value = sCmds = "";
                }
                else {
                    if (event.keyCode == Keyboard.KEYCODE.UP) {
                        if (dbg.iPrevCmd < dbg.aPrevCmds.length - 1) {
                            sCmds = dbg.aPrevCmds[++dbg.iPrevCmd];
                        }
                    }
                    else if (event.keyCode == Keyboard.KEYCODE.DOWN) {
                        if (dbg.iPrevCmd > 0) {
                            sCmds = dbg.aPrevCmds[--dbg.iPrevCmd];
                        } else {
                            sCmds = "";
                            dbg.iPrevCmd = -1;
                        }
                    }
                    if (sCmds != null) {
                        var cch = sCmds.length;
                        control.value = sCmds;
                        control.setSelectionRange(cch, cch);
                    }
                }
                if (sCmds != null && event.preventDefault) event.preventDefault();
            };
            return true;

        case "debugEnter":
            this.bindings[sBinding] = control;
            web.onClickRepeat(
                control,
                500, 100,
                function onClickDebugEnter(fRepeat) {
                    if (dbg.controlDebug) {
                        var sCmds = dbg.controlDebug.value;
                        dbg.controlDebug.value = "";
                        dbg.doCommands(sCmds, true);
                        return true;
                    }
                    if (DEBUG) dbg.log("no debugger input buffer");
                    return false;
                }
            );
            return true;

        case "step":
            this.bindings[sBinding] = control;
            web.onClickRepeat(
                control,
                500, 100,
                function onClickStep(fRepeat) {
                    var fCompleted = false;
                    if (!dbg.isBusy(true)) {
                        dbg.setBusy(true);
                        fCompleted = dbg.stepCPU(fRepeat? 1 : 0);
                        dbg.setBusy(false);
                    }
                    return fCompleted;
                }
            );
            return true;

        default:
            break;
        }
        return false;
    };

    /**
     * updateFocus()
     *
     * @this {Debugger}
     */
    Debugger.prototype.updateFocus = function()
    {
        if (this.controlDebug) this.controlDebug.focus();
    };

    /**
     * getAddr(dbgAddr, fWrite, nb)
     *
     * @this {Debugger}
     * @param {DbgAddr|null|undefined} dbgAddr
     * @param {boolean} [fWrite]
     * @param {number} [nb] number of bytes to check (1 or 2); default is 1
     * @return {number} is the corresponding linear address, or CPUDef.ADDR_INVALID
     */
    Debugger.prototype.getAddr = function(dbgAddr, fWrite, nb)
    {
        var addr = dbgAddr && dbgAddr.addr;
        if (addr == null) {
            addr = CPUDef.ADDR_INVALID;
        }
        return addr;
    };

    /**
     * getByte(dbgAddr, inc)
     *
     * We must route all our memory requests through the CPU now, in case paging is enabled.
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {number} [inc]
     * @return {number}
     */
    Debugger.prototype.getByte = function(dbgAddr, inc)
    {
        var b = 0xff;
        var addr = this.getAddr(dbgAddr, false, 1);
        if (addr !== CPUDef.ADDR_INVALID) {
            b = this.bus.getByteDirect(addr);
            if (inc) this.incAddr(dbgAddr, inc);
        }
        return b;
    };

    /**
     * getWord(dbgAddr, fAdvance)
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {boolean} [fAdvance]
     * @return {number}
     */
    Debugger.prototype.getWord = function(dbgAddr, fAdvance)
    {
        return this.getShort(dbgAddr, fAdvance? 2 : 0);
    };

    /**
     * getShort(dbgAddr, inc)
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {number} [inc]
     * @return {number}
     */
    Debugger.prototype.getShort = function(dbgAddr, inc)
    {
        var w = 0xffff;
        var addr = this.getAddr(dbgAddr, false, 2);
        if (addr !== CPUDef.ADDR_INVALID) {
            w = this.bus.getShortDirect(addr);
            if (inc) this.incAddr(dbgAddr, inc);
        }
        return w;
    };

    /**
     * setByte(dbgAddr, b, inc)
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {number} b
     * @param {number} [inc]
     */
    Debugger.prototype.setByte = function(dbgAddr, b, inc)
    {
        var addr = this.getAddr(dbgAddr, true, 1);
        if (addr !== CPUDef.ADDR_INVALID) {
            this.bus.setByteDirect(addr, b);
            if (inc) this.incAddr(dbgAddr, inc);
            this.cpu.updateCPU(true);           // we set fForce to true in case video memory was the target
        }
    };

    /**
     * setShort(dbgAddr, w, inc)
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {number} w
     * @param {number} [inc]
     */
    Debugger.prototype.setShort = function(dbgAddr, w, inc)
    {
        var addr = this.getAddr(dbgAddr, true, 2);
        if (addr !== CPUDef.ADDR_INVALID) {
            this.bus.setShortDirect(addr, w);
            if (inc) this.incAddr(dbgAddr, inc);
            this.cpu.updateCPU(true);           // we set fForce to true in case video memory was the target
        }
    };

    /**
     * newAddr(addr)
     *
     * Returns a NEW DbgAddr object, initialized with specified values and/or defaults.
     *
     * @this {Debugger}
     * @param {number} [addr]
     * @return {DbgAddr}
     */
    Debugger.prototype.newAddr = function(addr)
    {
        return {addr: addr, fTemporary: false};
    };

    /**
     * setAddr(dbgAddr, addr)
     *
     * Updates an EXISTING DbgAddr object, initialized with specified values and/or defaults.
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {number} addr
     * @return {DbgAddr}
     */
    Debugger.prototype.setAddr = function(dbgAddr, addr)
    {
        dbgAddr.addr = addr;
        dbgAddr.fTemporary = false;
        return dbgAddr;
    };

    /**
     * packAddr(dbgAddr)
     *
     * Packs a DbgAddr object into an Array suitable for saving in a machine state object.
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @return {Array}
     */
    Debugger.prototype.packAddr = function(dbgAddr)
    {
        return [dbgAddr.addr, dbgAddr.fTemporary];
    };

    /**
     * unpackAddr(aAddr)
     *
     * Unpacks a DbgAddr object from an Array created by packAddr() and restored from a saved machine state.
     *
     * @this {Debugger}
     * @param {Array} aAddr
     * @return {DbgAddr}
     */
    Debugger.prototype.unpackAddr = function(aAddr)
    {
        return {addr: aAddr[0], fTemporary: aAddr[1]};
    };

    /**
     * parseAddr(sAddr, fCode, fNoChecks, fPrint)
     *
     * Address evaluation and validation (eg, range checks) are no longer performed at this stage.  That's
     * done later, by getAddr(), which returns CPUDef.ADDR_INVALID for invalid segments, out-of-range offsets,
     * etc.  The Debugger's low-level get/set memory functions verify all getAddr() results, but even if an
     * invalid address is passed through to the Bus memory interfaces, the address will simply be masked with
     * Bus.nBusLimit; in the case of CPUDef.ADDR_INVALID, that will generally refer to the top of the physical
     * address space.
     *
     * @this {Debugger}
     * @param {string|undefined} sAddr
     * @param {boolean} [fCode] (true if target is code, false if target is data)
     * @param {boolean} [fNoChecks] (true when setting breakpoints that may not be valid now, but will be later)
     * @param {boolean} [fPrint]
     * @return {DbgAddr|null|undefined}
     */
    Debugger.prototype.parseAddr = function(sAddr, fCode, fNoChecks, fPrint)
    {
        var dbgAddr;
        var dbgAddrNext = (fCode? this.dbgAddrNextCode : this.dbgAddrNextData);
        var addr = dbgAddrNext.addr;
        if (sAddr !== undefined) {
            sAddr = this.parseReference(sAddr);
            dbgAddr = this.findSymbolAddr(sAddr);
            if (dbgAddr) return dbgAddr;
            addr = this.parseExpression(sAddr, fPrint);
        }
        if (addr != null) {
            dbgAddr = this.newAddr(addr);
        }
        return dbgAddr;
    };

    /**
     * parseAddrOptions(dbdAddr, sOptions)
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {string} [sOptions]
     */
    Debugger.prototype.parseAddrOptions = function(dbgAddr, sOptions)
    {
        if (sOptions) {
            var a = sOptions.match(/(['"])(.*?)\1/);
            if (a) {
                dbgAddr.aCmds = this.parseCommand(dbgAddr.sCmd = a[2]);
            }
        }
    };

    /**
     * incAddr(dbgAddr, inc)
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {number} [inc] contains value to increment dbgAddr by (default is 1)
     */
    Debugger.prototype.incAddr = function(dbgAddr, inc)
    {
        if (dbgAddr.addr != null) {
            dbgAddr.addr += (inc || 1);
        }
    };

    /**
     * toHexOffset(off)
     *
     * @this {Debugger}
     * @param {number|null|undefined} [off]
     * @return {string} the hex representation of off
     */
    Debugger.prototype.toHexOffset = function(off)
    {
        return str.toHex(off, 4);
    };

    /**
     * toHexAddr(dbgAddr)
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @return {string} the hex representation of the address
     */
    Debugger.prototype.toHexAddr = function(dbgAddr)
    {
        return this.toHexOffset(dbgAddr.addr);
    };

    /**
     * getSZ(dbgAddr, cchMax)
     *
     * Gets zero-terminated (aka "ASCIIZ") string from dbgAddr.  It also stops at the first '$', in case this is
     * a '$'-terminated string -- mainly because I'm lazy and didn't feel like writing a separate get() function.
     * Yes, a zero-terminated string containing a '$' will be prematurely terminated, and no, I don't care.
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {number} [cchMax] (default is 256)
     * @return {string} (and dbgAddr advanced past the terminating zero)
     */
    Debugger.prototype.getSZ = function(dbgAddr, cchMax)
    {
        var s = "";
        cchMax = cchMax || 256;
        while (s.length < cchMax) {
            var b = this.getByte(dbgAddr, 1);
            if (!b || b == 0x24 || b >= 127) break;
            s += (b >= 32? String.fromCharCode(b) : '.');
        }
        return s;
    };

    /**
     * dumpBlocks(aBlocks, sAddr)
     *
     * @this {Debugger}
     * @param {Array} aBlocks
     * @param {string} [sAddr] (optional block address)
     */
    Debugger.prototype.dumpBlocks = function(aBlocks, sAddr)
    {
        var addr = 0, i = 0, n = aBlocks.length;

        if (sAddr) {
            addr = this.getAddr(this.parseAddr(sAddr));
            if (addr === CPUDef.ADDR_INVALID) {
                this.println("invalid address: " + sAddr);
                return;
            }
            i = addr >>> this.bus.nBlockShift;
            n = 1;
        }

        this.println("blockid   physical   blockaddr   used    size    type");
        this.println("--------  ---------  ----------  ------  ------  ----");

        var typePrev = -1, cPrev = 0;
        while (n--) {
            var block = aBlocks[i];
            if (block.type == typePrev) {
                if (!cPrev++) this.println("...");
            } else {
                typePrev = block.type;
                var sType = Memory.TYPE.NAMES[typePrev];
                if (block) {
                    this.println(str.toHex(block.id) + "  %" + str.toHex(i << this.bus.nBlockShift) + "  %%" + str.toHex(block.addr) + "  " + str.toHexWord(block.used) + "  " + str.toHexWord(block.size) + "  " + sType);
                }
                if (typePrev != Memory.TYPE.NONE) typePrev = -1;
                cPrev = 0;
            }
            addr += this.bus.nBlockSize;
            i++;
        }
    };

    /**
     * dumpBus(asArgs)
     *
     * Dumps Bus allocations.
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs (asArgs[0] is an optional block address)
     */
    Debugger.prototype.dumpBus = function(asArgs)
    {
        this.dumpBlocks(this.bus.aMemBlocks, asArgs[0]);
    };

    /**
     * dumpHistory(sPrev, sLines)
     *
     * If sLines is not a number, it can be a instruction filter.  However, for the moment, the only
     * supported filter is "call", which filters the history buffer for all CALL and RET instructions
     * from the specified previous point forward.
     *
     * @this {Debugger}
     * @param {string} [sPrev] is a (decimal) number of instructions to rewind to (default is 10)
     * @param {string} [sLines] is a (decimal) number of instructions to print (default is, again, 10)
     */
    Debugger.prototype.dumpHistory = function(sPrev, sLines)
    {
        var sMore = "";
        var cHistory = 0;
        var iHistory = this.iOpcodeHistory;
        var aHistory = this.aOpcodeHistory;

        if (aHistory.length) {
            var nPrev = +sPrev || this.nextHistory;
            var nLines = +sLines || 10;

            if (isNaN(nPrev)) {
                nPrev = nLines;
            } else {
                sMore = "more ";
            }

            if (nPrev > aHistory.length) {
                this.println("note: only " + aHistory.length + " available");
                nPrev = aHistory.length;
            }

            iHistory -= nPrev;
            if (iHistory < 0) {
                /*
                 * If the dbgAddr of the last aHistory element contains a valid selector, wrap around.
                 */
                if (aHistory[aHistory.length - 1].addr == null) {
                    nPrev = iHistory + nPrev;
                    iHistory = 0;
                } else {
                    iHistory += aHistory.length;
                }
            }

            var aFilters = [];
            if (sLines == "call") {
                nLines = 100000;
                aFilters = ["CALL"];
            }

            if (sPrev !== undefined) {
                this.println(nPrev + " instructions earlier:");
            }

            /*
             * TODO: The following is necessary to prevent dumpHistory() from causing additional (or worse, recursive)
             * faults due to segmented addresses that are no longer valid, but the only alternative is to dramatically
             * increase the amount of memory used to store instruction history (eg, storing copies of all the instruction
             * bytes alongside the execution addresses).
             *
             * For now, we're living dangerously, so that our history dumps actually work.
             *
             *      this.nSuppressBreaks++;
             *
             * If you re-enable this protection, be sure to re-enable the decrement below, too.
             */
            while (nLines > 0 && iHistory != this.iOpcodeHistory) {

                var dbgAddr = aHistory[iHistory++];
                if (dbgAddr.addr == null) break;

                /*
                 * We must create a new dbgAddr from the address in aHistory, because dbgAddr was
                 * a reference, not a copy, and we don't want getInstruction() modifying the original.
                 */
                var dbgAddrNew = this.newAddr(dbgAddr.addr);

                var sComment = "history";
                var nSequence = nPrev--;
                if (DEBUG && dbgAddr.cycleCount != null) {
                    sComment = "cycles";
                    nSequence = dbgAddr.cycleCount;
                }

                var sInstruction = this.getInstruction(dbgAddrNew, sComment, nSequence);

                if (!aFilters.length || sInstruction.indexOf(aFilters[0]) >= 0) {
                    this.println(sInstruction);
                }

                /*
                 * If there were OPERAND or ADDRESS overrides on the previous instruction, getInstruction()
                 * will have automatically disassembled additional bytes, so skip additional history entries.
                 */
                if (dbgAddrNew.cOverrides) {
                    iHistory += dbgAddrNew.cOverrides; nLines -= dbgAddrNew.cOverrides; nPrev -= dbgAddrNew.cOverrides;
                }

                if (iHistory >= aHistory.length) iHistory = 0;
                this.nextHistory = nPrev;
                cHistory++;
                nLines--;
            }
            /*
             * See comments above.
             *
             *      this.nSuppressBreaks--;
             */
        }

        if (!cHistory) {
            this.println("no " + sMore + "history available");
            this.nextHistory = undefined;
        }
    };

    /**
     * messageInit(sEnable)
     *
     * @this {Debugger}
     * @param {string|undefined} sEnable contains zero or more message categories to enable, separated by '|'
     */
    Debugger.prototype.messageInit = function(sEnable)
    {
        this.dbg = this;
        this.bitsMessage = this.bitsWarning = Messages.WARN;
        this.sMessagePrev = null;
        this.aMessageBuffer = [];
        /*
         * Internally, we use "key" instead of "keys", since the latter is a method on JavasScript objects,
         * but externally, we allow the user to specify "keys"; "kbd" is also allowed as shorthand for "keyboard".
         */
        var aEnable = this.parseCommand(sEnable.replace("keys","key").replace("kbd","keyboard"), false, '|');
        if (aEnable.length) {
            for (var m in Debugger.MESSAGES) {
                if (usr.indexOf(aEnable, m) >= 0) {
                    this.bitsMessage |= Debugger.MESSAGES[m];
                    this.println(m + " messages enabled");
                }
            }
        }
    };

    /**
     * messageDump(bitMessage, fnDumper)
     *
     * @this {Debugger}
     * @param {number} bitMessage is one Messages category flag
     * @param {function(Array.<string>)} fnDumper is a function the Debugger can use to dump data for that category
     * @return {boolean} true if successfully registered, false if not
     */
    Debugger.prototype.messageDump = function(bitMessage, fnDumper)
    {
        for (var m in Debugger.MESSAGES) {
            if (bitMessage == Debugger.MESSAGES[m]) {
                this.afnDumpers[m] = fnDumper;
                return true;
            }
        }
        return false;
    };

    /**
     * getRegIndex(sReg, off)
     *
     * @this {Debugger}
     * @param {string} sReg
     * @param {number} [off] optional offset into sReg
     * @return {number} register index, or -1 if not found
     */
    Debugger.prototype.getRegIndex = function(sReg, off)
    {
        var i;
        sReg = sReg.toUpperCase();
        if (off == null) {
            i = usr.indexOf(Debugger.REGS, sReg);
        } else {
            i = usr.indexOf(Debugger.REGS, sReg.substr(off, 2));
            if (i < 0) i = usr.indexOf(Debugger.REGS, sReg.substr(off, 1));
        }
        return i;
    };

    /**
     * getRegString(iReg)
     *
     * @this {Debugger}
     * @param {number} iReg
     * @return {string}
     */
    Debugger.prototype.getRegString = function(iReg)
    {
        var cch = 0;
        var n = this.getRegValue(iReg);
        if (n !== undefined) {
            switch(iReg) {
            case Debugger.REG_A:
            case Debugger.REG_B:
            case Debugger.REG_C:
            case Debugger.REG_D:
            case Debugger.REG_E:
            case Debugger.REG_H:
            case Debugger.REG_L:
            case Debugger.REG_M:
                cch = 2;
                break;
            case Debugger.REG_BC:
            case Debugger.REG_DE:
            case Debugger.REG_HL:
            case Debugger.REG_SP:
            case Debugger.REG_PC:
            case Debugger.REG_PS:
            case Debugger.REG_PSW:
                cch = 4;
                break;
            }
        }
        return cch? str.toHex(n, cch) : "??";
    };

    /**
     * getRegValue(iReg)
     *
     * @this {Debugger}
     * @param {number} iReg
     * @return {number|undefined}
     */
    Debugger.prototype.getRegValue = function(iReg)
    {
        var n;
        if (iReg >= 0) {
            var cpu = this.cpu;
            switch(iReg) {
            case Debugger.REG_A:
                n = cpu.regA;
                break;
            case Debugger.REG_B:
                n = cpu.regB;
                break;
            case Debugger.REG_C:
                n = cpu.regC;
                break;
            case Debugger.REG_BC:
                n = cpu.getBC();
                break;
            case Debugger.REG_D:
                n = cpu.regD;
                break;
            case Debugger.REG_E:
                n = cpu.regE;
                break;
            case Debugger.REG_DE:
                n = cpu.getDE();
                break;
            case Debugger.REG_H:
                n = cpu.regH;
                break;
            case Debugger.REG_L:
                n = cpu.regL;
                break;
            case Debugger.REG_HL:
                n = cpu.getHL();
                break;
            case Debugger.REG_M:
                n = cpu.getByte(cpu.getHL());
                break;
            case Debugger.REG_SP:
                n = cpu.getSP();
                break;
            case Debugger.REG_PC:
                n = cpu.getPC();
                break;
            case Debugger.REG_PS:
                n = cpu.getPS();
                break;
            case Debugger.REG_PSW:
                n = cpu.getPSW();
                break;
            default:
                break;
            }
        }
        return n;
    };

    /**
     * replaceRegs(s)
     *
     * @this {Debugger}
     * @param {string} s
     * @return {string}
     */
    Debugger.prototype.replaceRegs = function(s)
    {
        /*
         * Replace any references first; this means that register references inside the reference
         * do NOT need to be prefixed with '@'.
         */
        s = this.parseReference(s);

        /*
         * Replace every @XX (or @XXX), where XX (or XXX) is a register, with the register's value.
         */
        var i = 0;
        var b, sChar, sAddr, dbgAddr, sReplace;
        while ((i = s.indexOf('@', i)) >= 0) {
            var iReg = this.getRegIndex(s, i + 1);
            if (iReg >= 0) {
                s = s.substr(0, i) + this.getRegString(iReg) + s.substr(i + 1 + Debugger.REGS[iReg].length);
            }
            i++;
        }
        /*
         * Replace every #XX, where XX is a hex byte value, with the corresponding ASCII character (if printable).
         */
        i = 0;
        while ((i = s.indexOf('#', i)) >= 0) {
            sChar = s.substr(i+1, 2);
            b = str.parseInt(sChar, 16);
            if (b != null && b >= 32 && b < 128) {
                sReplace = sChar + " '" + String.fromCharCode(b) + "'";
                s = s.replace('#' + sChar, sReplace);
                i += sReplace.length;
                continue;
            }
            i++;
        }
        /*
         * Replace every $XXXX:XXXX, where XXXX:XXXX is a segmented address, with the zero-terminated string at that address.
         */
        i = 0;
        while ((i = s.indexOf('$', i)) >= 0) {
            sAddr = s.substr(i+1, 9);
            dbgAddr = this.parseAddr(sAddr);
            if (dbgAddr) {
                sReplace = sAddr + ' "' + this.getSZ(dbgAddr) + '"';
                s = s.replace('$' + sAddr, sReplace);
                i += sReplace.length;
                continue;
            }
            i++;
        }
        /*
         * Replace every ^XXXX:XXXX, where XXXX:XXXX is a segmented address, with the FCB filename stored at that address.
         */
        i = 0;
        while ((i = s.indexOf('^', i)) >= 0) {
            sAddr = s.substr(i+1, 9);
            dbgAddr = this.parseAddr(sAddr);
            if (dbgAddr) {
                this.incAddr(dbgAddr);
                sReplace = sAddr + ' "' + this.getSZ(dbgAddr, 11) + '"';
                s = s.replace('^' + sAddr, sReplace);
                i += sReplace.length;
                continue;
            }
            i++;
        }
        return s;
    };

    /**
     * message(sMessage, fAddress)
     *
     * @this {Debugger}
     * @param {string} sMessage is any caller-defined message string
     * @param {boolean} [fAddress] is true to display the current CS:IP
     */
    Debugger.prototype.message = function(sMessage, fAddress)
    {
        if (fAddress) {
            sMessage += " at " + this.toHexAddr(this.newAddr(this.cpu.getPC()));
        }

        if (this.bitsMessage & Messages.BUFFER) {
            this.aMessageBuffer.push(sMessage);
            return;
        }

        if (this.sMessagePrev && sMessage == this.sMessagePrev) return;
        this.sMessagePrev = sMessage;

        if (this.bitsMessage & Messages.HALT) {
            this.stopCPU();
            sMessage += " (cpu halted)";
        }

        this.println(sMessage); // + " (" + this.cpu.getCycles() + " cycles)"

        /*
         * We have no idea what the frequency of println() calls might be; all we know is that they easily
         * screw up the CPU's careful assumptions about cycles per burst.  So we call yieldCPU() after every
         * message, to effectively end the current burst and start fresh.
         *
         * TODO: See CPU.calcStartTime() for a discussion of why we might want to call yieldCPU() *before*
         * we display the message.
         */
        if (this.cpu) this.cpu.yieldCPU();
    };

    /**
     * messageIO(component, port, bOut, addrFrom, name, bIn, bitsMessage)
     *
     * Most (if not all) port handlers should provide a name for their respective ports, so if no name is provided,
     * we assume this is an unknown port, and display a message by default.
     *
     * @this {Debugger}
     * @param {Component} component
     * @param {number} port
     * @param {number|null} bOut if an output operation
     * @param {number|null} [addrFrom]
     * @param {string|null} [name] of the port, if any
     * @param {number|null} [bIn] is the input value, if known, on an input operation
     * @param {number} [bitsMessage] is one or more Messages category flag(s)
     */
    Debugger.prototype.messageIO = function(component, port, bOut, addrFrom, name, bIn, bitsMessage)
    {
        bitsMessage |= Messages.PORT;
        if (name == null || (this.bitsMessage & bitsMessage) == bitsMessage) {
            this.message(component.idComponent + '.' + (bOut != null? "outPort" : "inPort") + '(' + str.toHexWord(port) + ',' + (name? name : "unknown") + (bOut != null? ',' + str.toHexByte(bOut) : "") + ')' + (bIn != null? (": " + str.toHexByte(bIn)) : "") + (addrFrom != null? (" at " + this.toHexOffset(addrFrom)) : ""));
        }
    };

    /**
     * init()
     *
     * @this {Debugger}
     */
    Debugger.prototype.init = function()
    {
        this.println("Type ? for help with PC8080 Debugger commands");
        this.updateStatus();
        if (this.sInitCommands) {
            var sCmds = this.sInitCommands;
            this.sInitCommands = null;
            this.doCommands(sCmds);
        }
    };

    /**
     * historyInit(fQuiet)
     *
     * This function is intended to be called by the constructor, reset(), addBreakpoint(), findBreakpoint()
     * and any other function that changes the checksEnabled() criteria used to decide whether checkInstruction()
     * should be called.
     *
     * That is, if the history arrays need to be allocated and haven't already been allocated, then allocate them,
     * and if the arrays are no longer needed, then deallocate them.
     *
     * @this {Debugger}
     * @param {boolean} [fQuiet]
     */
    Debugger.prototype.historyInit = function(fQuiet)
    {
        var i;
        if (!this.checksEnabled()) {
            if (this.aOpcodeHistory && this.aOpcodeHistory.length && !fQuiet) {
                this.println("instruction history buffer freed");
            }
            this.iOpcodeHistory = 0;
            this.aOpcodeHistory = [];
            this.aaOpcodeCounts = [];
            return;
        }
        if (!this.aOpcodeHistory || !this.aOpcodeHistory.length) {
            this.aOpcodeHistory = new Array(Debugger.HISTORY_LIMIT);
            for (i = 0; i < this.aOpcodeHistory.length; i++) {
                /*
                 * Preallocate dummy Addr (Array) objects in every history slot, so that
                 * checkInstruction() doesn't need to call newAddr() on every slot update.
                 */
                this.aOpcodeHistory[i] = this.newAddr();
            }
            this.iOpcodeHistory = 0;
            if (!fQuiet) {
                this.println("instruction history buffer allocated");
            }
        }
        if (!this.aaOpcodeCounts || !this.aaOpcodeCounts.length) {
            this.aaOpcodeCounts = new Array(256);
            for (i = 0; i < this.aaOpcodeCounts.length; i++) {
                this.aaOpcodeCounts[i] = [i, 0];
            }
        }
    };

    /**
     * runCPU(fUpdateFocus)
     *
     * @this {Debugger}
     * @param {boolean} [fUpdateFocus] is true to update focus
     * @return {boolean} true if run request successful, false if not
     */
    Debugger.prototype.runCPU = function(fUpdateFocus)
    {
        if (!this.isCPUAvail()) return false;
        this.cpu.runCPU(fUpdateFocus);
        return true;
    };

    /**
     * stepCPU(nCycles, fRegs, fUpdateCPU)
     *
     * @this {Debugger}
     * @param {number} nCycles (0 for one instruction without checking breakpoints)
     * @param {boolean} [fRegs] is true to display registers after step (default is false)
     * @param {boolean} [fUpdateCPU] is false to disable calls to updateCPU() (default is true)
     * @return {boolean}
     */
    Debugger.prototype.stepCPU = function(nCycles, fRegs, fUpdateCPU)
    {
        if (!this.isCPUAvail()) return false;

        this.nCycles = 0;

        if (!nCycles) {
            /*
             * When single-stepping, the CPU won't call checkInstruction(), which is good for
             * avoiding breakpoints, but bad for instruction data collection if checks are enabled.
             * So we call checkInstruction() ourselves.
             */
            if (this.checksEnabled()) this.checkInstruction(this.cpu.getPC(), 0);
        }
        try {
            var nCyclesStep = this.cpu.stepCPU(nCycles);
            if (nCyclesStep > 0) {
                this.nCycles += nCyclesStep;
                this.cpu.addCycles(nCyclesStep, true);
                this.cpu.updateChecksum(nCyclesStep);
                this.cOpcodes++;
            }
        }
        catch(exception) {
            if (typeof exception != "number") {
                var e = exception;
                this.nCycles = 0;
                this.cpu.setError(e.stack || e.message);
            }
        }

        /*
         * Because we called cpu.stepCPU() and not cpu.runCPU(), we must nudge the cpu's update code,
         * and then update our own state.  Normally, the only time fUpdateCPU will be false is when doTrace()
         * is calling us in a loop, in which case it will perform its own updateCPU() when it's done.
         */
        if (fUpdateCPU !== false) this.cpu.updateCPU();

        this.updateStatus(fRegs || false);
        return (this.nCycles > 0);
    };

    /**
     * stopCPU()
     *
     * @this {Debugger}
     * @param {boolean} [fComplete]
     */
    Debugger.prototype.stopCPU = function(fComplete)
    {
        if (this.cpu) this.cpu.stopCPU(fComplete);
    };

    /**
     * updateStatus(fRegs)
     *
     * @this {Debugger}
     * @param {boolean} [fRegs] (default is true)
     */
    Debugger.prototype.updateStatus = function(fRegs)
    {
        if (fRegs === undefined) fRegs = true;

        this.dbgAddrNextCode = this.newAddr(this.cpu.getPC());
        /*
         * this.nStep used to be a simple boolean, but now it's 0 (or undefined)
         * if inactive, 1 if stepping over an instruction without a register dump, or 2
         * if stepping over an instruction with a register dump.
         */
        if (!fRegs || this.nStep == 1)
            this.doUnassemble();
        else {
            this.doRegisters();
        }
    };

    /**
     * isCPUAvail()
     *
     * Make sure the CPU is ready (finished initializing), not busy (already running), and not in an error state.
     *
     * @this {Debugger}
     * @return {boolean}
     */
    Debugger.prototype.isCPUAvail = function()
    {
        if (!this.cpu)
            return false;
        if (!this.cpu.isReady())
            return false;
        if (!this.cpu.isPowered())
            return false;
        if (this.cpu.isBusy())
            return false;
        return !this.cpu.isError();
    };

    /**
     * powerUp(data, fRepower)
     *
     * @this {Debugger}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    Debugger.prototype.powerUp = function(data, fRepower)
    {
        if (!fRepower) {
            /*
             * Because Debugger save/restore support is somewhat limited (and didn't always exist),
             * we deviate from the typical save/restore design pattern: instead of reset OR restore,
             * we always reset and then perform a (potentially limited) restore.
             */
            this.reset(true);

            // this.println(data? "resuming" : "powering up");

            if (data && this.restore) {
                if (!this.restore(data)) return false;
            }
        }
        return true;
    };

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {Debugger}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean}
     */
    Debugger.prototype.powerDown = function(fSave, fShutdown)
    {
        if (fShutdown) this.println(fSave? "suspending" : "shutting down");
        return fSave? this.save() : true;
    };

    /**
     * reset(fQuiet)
     *
     * This is a notification handler, called by the Computer, to inform us of a reset.
     *
     * @this {Debugger}
     * @param {boolean} fQuiet (true only when called from our own powerUp handler)
     */
    Debugger.prototype.reset = function(fQuiet)
    {
        this.historyInit();
        this.cOpcodes = this.cOpcodesStart = 0;
        this.sMessagePrev = null;
        this.nCycles = 0;
        this.dbgAddrNextCode = this.newAddr(this.cpu.getPC());
        /*
         * fRunning is set by start() and cleared by stop().  In addition, we clear
         * it here, so that if the CPU is reset while running, we can prevent stop()
         * from unnecessarily dumping the CPU state.
         */
        this.flags.fRunning = false;
        this.clearTempBreakpoint();
        if (!fQuiet) this.updateStatus();
    };

    /**
     * save()
     *
     * This implements (very rudimentary) save support for the Debugger component.
     *
     * @this {Debugger}
     * @return {Object}
     */
    Debugger.prototype.save = function()
    {
        var state = new State(this);
        state.set(0, this.packAddr(this.dbgAddrNextCode));
        state.set(1, this.packAddr(this.dbgAddrAssemble));
        state.set(2, [this.aPrevCmds, this.fAssemble, this.bitsMessage]);
        state.set(3, this.aSymbolTable);
        return state.data();
    };

    /**
     * restore(data)
     *
     * This implements (very rudimentary) restore support for the Debugger component.
     *
     * @this {Debugger}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    Debugger.prototype.restore = function(data)
    {
        var i = 0;
        if (data[2] !== undefined) {
            this.dbgAddrNextCode = this.unpackAddr(data[i++]);
            this.dbgAddrAssemble = this.unpackAddr(data[i++]);
            this.aPrevCmds = data[i][0];
            if (typeof this.aPrevCmds == "string") this.aPrevCmds = [this.aPrevCmds];
            this.fAssemble = data[i][1];
            this.bitsMessage |= data[i][2];     // keep our current message bits set, and simply "add" any extra bits defined by the saved state
        }
        if (data[3]) this.aSymbolTable = data[3];
        return true;
    };

    /**
     * start(ms, nCycles)
     *
     * This is a notification handler, called by the Computer, to inform us the CPU has started.
     *
     * @this {Debugger}
     * @param {number} ms
     * @param {number} nCycles
     */
    Debugger.prototype.start = function(ms, nCycles)
    {
        if (!this.nStep) this.println("running");
        this.flags.fRunning = true;
        this.msStart = ms;
        this.nCyclesStart = nCycles;
    };

    /**
     * stop(ms, nCycles)
     *
     * This is a notification handler, called by the Computer, to inform us the CPU has now stopped.
     *
     * @this {Debugger}
     * @param {number} ms
     * @param {number} nCycles
     */
    Debugger.prototype.stop = function(ms, nCycles)
    {
        if (this.flags.fRunning) {
            this.flags.fRunning = false;
            this.nCycles = nCycles - this.nCyclesStart;
            if (!this.nStep) {
                var sStopped = "stopped";
                if (this.nCycles) {
                    var msTotal = ms - this.msStart;
                    var nCyclesPerSecond = (msTotal > 0? Math.round(this.nCycles * 1000 / msTotal) : 0);
                    sStopped += " (";
                    if (this.checksEnabled()) {
                        sStopped += this.cOpcodes + " opcodes, ";
                        /*
                         * $ops displays progress by calculating cOpcodes - cOpcodesStart, so before
                         * zeroing cOpcodes, we should subtract cOpcodes from cOpcodesStart (since we're
                         * effectively subtracting cOpcodes from cOpcodes as well).
                         */
                        this.cOpcodesStart -= this.cOpcodes;
                        this.cOpcodes = 0;
                    }
                    sStopped += this.nCycles + " cycles, " + msTotal + " ms, " + nCyclesPerSecond + " hz)";
                } else {
                    if (this.messageEnabled(Messages.HALT)) {
                        /*
                         * It's possible the user is trying to 'g' past a fault that was blocked by helpCheckFault()
                         * for the Debugger's benefit; if so, it will continue to be blocked, so try displaying a helpful
                         * message (another helpful tip would be to simply turn off the "halt" message category).
                         */
                        sStopped += " (use the 't' command to execute blocked faults)";
                    }
                }
                this.println(sStopped);
            }
            this.updateStatus(true);
            this.updateFocus();
            this.clearTempBreakpoint(this.cpu.getPC());
        }
    };

    /**
     * checksEnabled(fRelease)
     *
     * This "check" function is called by the CPU; we indicate whether or not every instruction needs to be checked.
     *
     * Originally, this returned true even when there were only read and/or write breakpoints, but those breakpoints
     * no longer require the intervention of checkInstruction(); the Bus component automatically swaps in/out appropriate
     * "checked" Memory access functions to deal with those breakpoints in the corresponding Memory blocks.  So I've
     * simplified the test below.
     *
     * @this {Debugger}
     * @param {boolean} [fRelease] is true for release criteria only; default is false (any criteria)
     * @return {boolean} true if every instruction needs to pass through checkInstruction(), false if not
     */
    Debugger.prototype.checksEnabled = function(fRelease)
    {
        return ((DEBUG && !fRelease)? true : (this.aBreakExec.length > 1 || !!this.nBreakIns));
    };

    /**
     * checkInstruction(addr, nState)
     *
     * This "check" function is called by the CPU to inform us about the next instruction to be executed,
     * giving us an opportunity to look for "exec" breakpoints and update opcode frequencies and instruction history.
     *
     * @this {Debugger}
     * @param {number} addr
     * @param {number} nState is < 0 if stepping, 0 if starting, or > 0 if running
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkInstruction = function(addr, nState)
    {
        var cpu = this.cpu;

        if (nState > 0) {
            if (this.nBreakIns && !--this.nBreakIns) {
                return true;
            }
            if (this.checkBreakpoint(addr, 1, this.aBreakExec)) {
                return true;
            }
        }

        /*
         * The rest of the instruction tracking logic can only be performed if historyInit() has allocated the
         * necessary data structures.  Note that there is no explicit UI for enabling/disabling history, other than
         * adding/removing breakpoints, simply because it's breakpoints that trigger the call to checkInstruction();
         * well, OK, and a few other things now, like enabling Messages.INT messages.
         */
        if (nState >= 0 && this.aaOpcodeCounts.length) {
            this.cOpcodes++;
            var bOpcode = this.bus.getByteDirect(addr);
            if (bOpcode != null) {
                this.aaOpcodeCounts[bOpcode][1]++;
                var dbgAddr = this.aOpcodeHistory[this.iOpcodeHistory];
                this.setAddr(dbgAddr, cpu.getPC());
                if (DEBUG) dbgAddr.cycleCount = cpu.getCycles();
                if (++this.iOpcodeHistory == this.aOpcodeHistory.length) this.iOpcodeHistory = 0;
            }
        }
        return false;
    };

    /**
     * checkMemoryRead(addr, nb)
     *
     * This "check" function is called by a Memory block to inform us that a memory read occurred, giving us an
     * opportunity to track the read if we want, and look for a matching "read" breakpoint, if any.
     *
     * In the "old days", it would be an error for this call to fail to find a matching Debugger breakpoint, but now
     * Memory blocks have no idea whether the Debugger or the machine's Debug register(s) triggered this "checked" read.
     *
     * If we return true, we "trump" the machine's Debug register(s); false allows normal Debug register processing.
     *
     * @this {Debugger}
     * @param {number} addr
     * @param {number} [nb] (# of bytes; default is 1)
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkMemoryRead = function(addr, nb)
    {
        if (this.checkBreakpoint(addr, nb || 1, this.aBreakRead)) {
            this.stopCPU(true);
            return true;
        }
        return false;
    };

    /**
     * checkMemoryWrite(addr, nb)
     *
     * This "check" function is called by a Memory block to inform us that a memory write occurred, giving us an
     * opportunity to track the write if we want, and look for a matching "write" breakpoint, if any.
     *
     * In the "old days", it would be an error for this call to fail to find a matching Debugger breakpoint, but now
     * Memory blocks have no idea whether the Debugger or the machine's Debug register(s) triggered this "checked" write.
     *
     * If we return true, we "trump" the machine's Debug register(s); false allows normal Debug register processing.
     *
     * @this {Debugger}
     * @param {number} addr
     * @param {number} [nb] (# of bytes; default is 1)
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkMemoryWrite = function(addr, nb)
    {
        if (this.checkBreakpoint(addr, nb || 1, this.aBreakWrite)) {
            this.stopCPU(true);
            return true;
        }
        return false;
    };

    /**
     * checkPortInput(port, size, data)
     *
     * This "check" function is called by the Bus component to inform us that port input occurred.
     *
     * @this {Debugger}
     * @param {number} port
     * @param {number} size
     * @param {number} data
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkPortInput = function(port, size, data)
    {
        /*
         * We trust that the Bus component won't call us unless we told it to, so we halt unconditionally
         */
        this.println("break on input from port " + str.toHexWord(port) + ": " + str.toHex(data));
        this.stopCPU(true);
        return true;
    };

    /**
     * checkPortOutput(port, size, data)
     *
     * This "check" function is called by the Bus component to inform us that port output occurred.
     *
     * @this {Debugger}
     * @param {number} port
     * @param {number} size
     * @param {number} data
     * @return {boolean} true if breakpoint hit, false if not
     */
    Debugger.prototype.checkPortOutput = function(port, size, data)
    {
        /*
         * We trust that the Bus component won't call us unless we told it to, so we halt unconditionally
         */
        this.println("break on output to port " + str.toHexWord(port) + ": " + str.toHex(data));
        this.stopCPU(true);
        return true;
    };

    /**
     * clearBreakpoints()
     *
     * @this {Debugger}
     */
    Debugger.prototype.clearBreakpoints = function()
    {
        var i, dbgAddr;
        this.aBreakExec = ["bp"];
        if (this.aBreakRead !== undefined) {
            for (i = 1; i < this.aBreakRead.length; i++) {
                dbgAddr = this.aBreakRead[i];
                this.bus.removeMemBreak(this.getAddr(dbgAddr), false);
            }
        }
        this.aBreakRead = ["br"];
        if (this.aBreakWrite !== undefined) {
            for (i = 1; i < this.aBreakWrite.length; i++) {
                dbgAddr = this.aBreakWrite[i];
                this.bus.removeMemBreak(this.getAddr(dbgAddr), true);
            }
        }
        this.aBreakWrite = ["bw"];
        /*
         * nSuppressBreaks ensures we can't get into an infinite loop where a breakpoint lookup requires
         * reading a segment descriptor via getSegment(), and that triggers more memory reads, which triggers
         * more breakpoint checks.
         */
        this.nSuppressBreaks = 0;
    };

    /**
     * addBreakpoint(aBreak, dbgAddr, fTemporary)
     *
     * In case you haven't already figured this out, all our breakpoint commands use the address
     * to identify a breakpoint, not an incrementally assigned breakpoint index like other debuggers;
     * see doBreak() for details.
     *
     * This has a few implications, one being that you CANNOT set more than one kind of breakpoint
     * on a single address.  In practice, that's rarely a problem, because you can almost always set
     * a different breakpoint on a neighboring address.
     *
     * Also, there is one exception to the "one address, one breakpoint" rule, and that involves
     * temporary breakpoints (ie, one-time execution breakpoints that either a "p" or "g" command
     * may create to step over a chunk of code).  Those breakpoints automatically clear themselves,
     * so there usually isn't any need to refer to them using breakpoint commands.
     *
     * TODO: Consider supporting the more "traditional" breakpoint index syntax; the current
     * address-based syntax was implemented solely for expediency and consistency.  At the same time,
     * also consider a more WDEB386-like syntax, where "br" is used to set a variety of access-specific
     * breakpoints, using modifiers like "r1", "r2", "w1", "w2, etc.
     *
     * @this {Debugger}
     * @param {Array} aBreak
     * @param {DbgAddr} dbgAddr
     * @param {boolean} [fTemporary]
     * @return {boolean} true if breakpoint added, false if already exists
     */
    Debugger.prototype.addBreakpoint = function(aBreak, dbgAddr, fTemporary)
    {
        var fSuccess = true;

        // this.nSuppressBreaks++;

        /*
         * Instead of complaining that a breakpoint already exists (as we used to do), we now
         * allow breakpoints to be re-set; this makes it easier to update any commands that may
         * be associated with the breakpoint.
         *
         * The only exception: we DO allow a temporary breakpoint at an address where there may
         * already be a breakpoint, so that you can easily step ("p" or "g") over such addresses.
         */
        if (!fTemporary) {
            this.findBreakpoint(aBreak, dbgAddr, true, false, true);
        }

        if (aBreak != this.aBreakExec) {
            var addr = this.getAddr(dbgAddr);
            if (addr === CPUDef.ADDR_INVALID) {
                this.println("invalid address: " + this.toHexAddr(dbgAddr));
                fSuccess = false;
            } else {
                this.bus.addMemBreak(addr, aBreak == this.aBreakWrite);
            }
        }

        if (fSuccess) {
            aBreak.push(dbgAddr);
            if (fTemporary) {
                dbgAddr.fTemporary = true;
            }
            else {
                this.printBreakpoint(aBreak, aBreak.length-1, "set");
                this.historyInit();
            }
        }

        // this.nSuppressBreaks--;

        return fSuccess;
    };

    /**
     * findBreakpoint(aBreak, dbgAddr, fRemove, fTemporary, fQuiet)
     *
     * @this {Debugger}
     * @param {Array} aBreak
     * @param {DbgAddr} dbgAddr
     * @param {boolean} [fRemove]
     * @param {boolean} [fTemporary]
     * @param {boolean} [fQuiet]
     * @return {boolean} true if found, false if not
     */
    Debugger.prototype.findBreakpoint = function(aBreak, dbgAddr, fRemove, fTemporary, fQuiet)
    {
        var fFound = false;
        var addr = this.getAddr(dbgAddr);
        for (var i = 1; i < aBreak.length; i++) {
            var dbgAddrBreak = aBreak[i];
            if (addr == this.getAddr(dbgAddrBreak)) {
                if (!fTemporary || dbgAddrBreak.fTemporary) {
                    fFound = true;
                    if (fRemove) {
                        if (!dbgAddrBreak.fTemporary && !fQuiet) {
                            this.printBreakpoint(aBreak, i, "cleared");
                        }
                        aBreak.splice(i, 1);
                        if (aBreak != this.aBreakExec) {
                            this.bus.removeMemBreak(addr, aBreak == this.aBreakWrite);
                        }
                        /*
                         * We'll mirror the logic in addBreakpoint() and leave the history buffer alone if this
                         * was a temporary breakpoint.
                         */
                        if (!dbgAddrBreak.fTemporary) {
                            this.historyInit();
                        }
                        break;
                    }
                    if (!fQuiet) this.printBreakpoint(aBreak, i, "exists");
                    break;
                }
            }
        }
        return fFound;
    };

    /**
     * listBreakpoints(aBreak)
     *
     * @this {Debugger}
     * @param {Array} aBreak
     * @return {number} of breakpoints listed, 0 if none
     */
    Debugger.prototype.listBreakpoints = function(aBreak)
    {
        for (var i = 1; i < aBreak.length; i++) {
            this.printBreakpoint(aBreak, i);
        }
        return aBreak.length - 1;
    };

    /**
     * printBreakpoint(aBreak, i, sAction)
     *
     * @this {Debugger}
     * @param {Array} aBreak
     * @param {number} i
     * @param {string} [sAction]
     */
    Debugger.prototype.printBreakpoint = function(aBreak, i, sAction)
    {
        var dbgAddr = aBreak[i];
        this.println(aBreak[0] + ' ' + this.toHexAddr(dbgAddr) + (sAction? (' ' + sAction) : (dbgAddr.sCmd? (' "' + dbgAddr.sCmd + '"') : '')));
    };

    /**
     * setTempBreakpoint(dbgAddr)
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr of new temp breakpoint
     */
    Debugger.prototype.setTempBreakpoint = function(dbgAddr)
    {
        this.addBreakpoint(this.aBreakExec, dbgAddr, true);
    };

    /**
     * clearTempBreakpoint(addr)
     *
     * @this {Debugger}
     * @param {number|undefined} [addr] clear all temp breakpoints if no address specified
     */
    Debugger.prototype.clearTempBreakpoint = function(addr)
    {
        if (addr !== undefined) {
            this.checkBreakpoint(addr, 1, this.aBreakExec, true);
            this.nStep = 0;
        } else {
            for (var i = 1; i < this.aBreakExec.length; i++) {
                var dbgAddrBreak = this.aBreakExec[i];
                if (dbgAddrBreak.fTemporary) {
                    if (!this.findBreakpoint(this.aBreakExec, dbgAddrBreak, true, true)) break;
                    i = 0;
                }
            }
        }
    };

    /**
     * checkBreakpoint(addr, nb, aBreak, fTemporary)
     *
     * @this {Debugger}
     * @param {number} addr
     * @param {number} nb (# of bytes)
     * @param {Array} aBreak
     * @param {boolean} [fTemporary]
     * @return {boolean} true if breakpoint has been hit, false if not
     */
    Debugger.prototype.checkBreakpoint = function(addr, nb, aBreak, fTemporary)
    {
        /*
         * Time to check for execution breakpoints; note that this should be done BEFORE updating frequency
         * or history data (see checkInstruction), since we might not actually execute the current instruction.
         */
        var fBreak = false;

        if (!this.nSuppressBreaks++) {

            for (var i = 1; !fBreak && i < aBreak.length; i++) {

                var dbgAddrBreak = aBreak[i];

                if (fTemporary && !dbgAddrBreak.fTemporary) continue;

                /*
                 * We used to calculate the linear address of the breakpoint at the time the
                 * breakpoint was added, so that a breakpoint set in one mode (eg, in real-mode)
                 * would still work as intended if the mode changed later (eg, to protected-mode).
                 *
                 * However, that created difficulties setting protected-mode breakpoints in segments
                 * that might not be defined yet, or that could move in physical memory.
                 *
                 * If you want to create a real-mode breakpoint that will break regardless of mode,
                 * use the physical address of the real-mode memory location instead.
                 */
                var addrBreak = this.getAddr(dbgAddrBreak);
                for (var n = 0; n < nb; n++) {
                    if (addr + n == addrBreak) {
                        var a;
                        fBreak = true;
                        if (dbgAddrBreak.fTemporary) {
                            this.findBreakpoint(aBreak, dbgAddrBreak, true, true);
                            fTemporary = true;
                        }
                        if (a = dbgAddrBreak.aCmds) {
                            /*
                             * When one or more commands are attached to a breakpoint, we don't halt by default.
                             * Instead, we set fBreak to true only if, at the completion of all the commands, the
                             * CPU is halted; in other words, you should include "h" as one of the breakpoint commands
                             * if you want the breakpoint to stop execution.
                             *
                             * Another useful command is "if", which will return false if the expression is false,
                             * at which point we'll jump ahead to the next "else" command, and if there isn't an "else",
                             * we abort.
                             */
                            fBreak = false;
                            for (var j = 0; j < a.length; j++) {
                                if (!this.doCommand(a[j], true)) {
                                    if (a[j].indexOf("if")) {
                                        fBreak = true;          // the failed command wasn't "if", so abort
                                        break;
                                    }
                                    var k = j + 1;
                                    for (; k < a.length; k++) {
                                        if (!a[k].indexOf("else")) break;
                                        j++;
                                    }
                                    if (k == a.length) {        // couldn't find an "else" after the "if", so abort
                                        fBreak = true;
                                        break;
                                    }
                                    /*
                                     * If we're still here, we'll execute the "else" command (which is just a no-op),
                                     * followed by any remaining commands.
                                     */
                                }
                            }
                            if (!this.cpu.isRunning()) fBreak = true;
                        }
                        if (fBreak) {
                            if (!fTemporary) this.printBreakpoint(aBreak, i, "hit");
                            break;
                        }
                    }
                }
            }
        }

        this.nSuppressBreaks--;

        return fBreak;
    };

    /**
     * getInstruction(dbgAddr, sComment, nSequence)
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {string} [sComment] is an associated comment
     * @param {number} [nSequence] is an associated sequence number, undefined if none
     * @return {string} (and dbgAddr is updated to the next instruction)
     */
    Debugger.prototype.getInstruction = function(dbgAddr, sComment, nSequence)
    {
        var dbgAddrIns = this.newAddr(dbgAddr.addr);

        var bOpcode = this.getByte(dbgAddr, 1);

        var asOpcodes = this.style != Debugger.STYLE_8086? Debugger.INS_NAMES : Debugger.INS_NAMES_8086;
        var aOpDesc = this.aaOpDescs[bOpcode];
        var iIns = aOpDesc[0];

        var sOperands = "";
        var sOpcode = asOpcodes[iIns];
        var cOperands = aOpDesc.length - 1;
        var typeSizeDefault = Debugger.TYPE_NONE, type;

        for (var iOperand = 1; iOperand <= cOperands; iOperand++) {

            var disp, off, cch;
            var sOperand = "";

            type = aOpDesc[iOperand];
            if (type === undefined) continue;
            if ((type & Debugger.TYPE_OPT) && this.style == Debugger.STYLE_8080) continue;

            var typeMode = type & Debugger.TYPE_MODE;
            if (!typeMode) continue;

            var typeSize = type & Debugger.TYPE_SIZE;
            if (!typeSize) {
                type |= typeSizeDefault;
            } else {
                typeSizeDefault = typeSize;
            }

            var typeOther = type & Debugger.TYPE_OTHER;
            if (!typeOther) {
                type |= (iOperand == 1? Debugger.TYPE_OUT : Debugger.TYPE_IN);
            }

            if (typeMode & Debugger.TYPE_IMM) {
                sOperand = this.getImmOperand(type, dbgAddr);
            }
            else if (typeMode & Debugger.TYPE_REG) {
                sOperand = this.getRegOperand((type & Debugger.TYPE_IREG) >> 8, type, dbgAddr);
            }
            else if (typeMode & Debugger.TYPE_INT) {
                sOperand = ((bOpcode >> 3) & 0x7).toString();
            }

            if (!sOperand || !sOperand.length) {
                sOperands = "INVALID";
                break;
            }
            if (sOperands.length > 0) sOperands += ',';
            sOperands += (sOperand || "???");
        }

        var sBytes = "";
        var sLine = this.toHexAddr(dbgAddrIns) + ' ';
        if (dbgAddrIns.addr !== CPUDef.ADDR_INVALID && dbgAddr.addr !== CPUDef.ADDR_INVALID) {
            do {
                sBytes += str.toHex(this.getByte(dbgAddrIns, 1), 2);
                if (dbgAddrIns.addr == null) break;
            } while (dbgAddrIns.addr != dbgAddr.addr);
        }

        sLine += str.pad(sBytes, 10);
        sLine += (type & Debugger.TYPE_UNDOC)? '*' : ' ';
        sLine += str.pad(sOpcode, 7);
        if (sOperands) sLine += ' ' + sOperands;

        if (sComment) {
            sLine = str.pad(sLine, 40) + ';' + sComment;
            if (!this.cpu.flags.fChecksum) {
                sLine += (nSequence != null? '=' + nSequence.toString() : "");
            } else {
                var nCycles = this.cpu.getCycles();
                sLine += "cycles=" + nCycles.toString() + " cs=" + str.toHex(this.cpu.aCounts.nChecksum);
            }
        }
        return sLine;
    };

    /**
     * getImmOperand(type, dbgAddr)
     *
     * @this {Debugger}
     * @param {number} type
     * @param {DbgAddr} dbgAddr
     * @return {string} operand
     */
    Debugger.prototype.getImmOperand = function(type, dbgAddr)
    {
        var sOperand = ' ';
        var typeSize = type & Debugger.TYPE_SIZE;

        switch (typeSize) {
        case Debugger.TYPE_BYTE:
            sOperand = str.toHex(this.getByte(dbgAddr, 1), 2);
            break;
        case Debugger.TYPE_SBYTE:
            sOperand = str.toHex((this.getByte(dbgAddr, 1) << 24) >> 24, 4);
            break;
        case Debugger.TYPE_WORD:
            sOperand = str.toHex(this.getShort(dbgAddr, 2), 4);
            break;
        default:
            return "imm(" + str.toHexWord(type) + ')';
        }
        if (this.style == Debugger.STYLE_8086 && (type & Debugger.TYPE_MEM)) {
            sOperand = '[' + sOperand + ']';
        } else if (!(type & Debugger.TYPE_REG)) {
            sOperand = (this.style == Debugger.STYLE_8080? '$' : "0x") + sOperand;
        }
        return sOperand;
    };

    /**
     * getRegOperand(iReg, type, dbgAddr)
     *
     * @this {Debugger}
     * @param {number} iReg
     * @param {number} type
     * @param {DbgAddr} dbgAddr
     * @return {string} operand
     */
    Debugger.prototype.getRegOperand = function(iReg, type, dbgAddr)
    {
        /*
         * Although this breaks with 8080 assembler conventions, I'm going to experiment with some different
         * mnemonics; specifically, "[HL]" instead of "M".  This is also more in keeping with how getImmOperand()
         * displays memory references (ie, by enclosing them in brackets).
         */
        var sOperand = Debugger.REGS[iReg];
        if (this.style == Debugger.STYLE_8086 && (type & Debugger.TYPE_MEM)) {
            if (iReg == Debugger.REG_M) {
                sOperand = "HL";
            }
            sOperand = '[' + sOperand + ']';
        }
        return sOperand;
    };

    /**
     * parseInstruction(sOp, sOperand, addr)
     *
     * TODO: Unimplemented.  See parseInstruction() in modules/c1pjs/lib/debugger.js for a working implementation.
     *
     * @this {Debugger}
     * @param {string} sOp
     * @param {string|undefined} sOperand
     * @param {DbgAddr} dbgAddr of memory where this instruction is being assembled
     * @return {Array.<number>} of opcode bytes; if the instruction can't be parsed, the array will be empty
     */
    Debugger.prototype.parseInstruction = function(sOp, sOperand, dbgAddr)
    {
        var aOpBytes = [];
        this.println("not supported yet");
        return aOpBytes;
    };

    /**
     * getFlagOutput(sFlag)
     *
     * @this {Debugger}
     * @param {string} sFlag
     * @return {string} value of flag
     */
    Debugger.prototype.getFlagOutput = function(sFlag)
    {
        var b;
        switch (sFlag) {
        case "IF":
            b = this.cpu.getIF();
            break;
        case "SF":
            b = this.cpu.getSF();
            break;
        case "ZF":
            b = this.cpu.getZF();
            break;
        case "AF":
            b = this.cpu.getAF();
            break;
        case "PF":
            b = this.cpu.getPF();
            break;
        case "CF":
            b = this.cpu.getCF();
            break;
        default:
            b = 0;
            break;
        }
        return sFlag.charAt(0) + (b? '1' : '0') + ' ';
    };

    /**
     * getRegOutput(iReg)
     *
     * @this {Debugger}
     * @param {number} iReg
     * @return {string}
     */
    Debugger.prototype.getRegOutput = function(iReg)
    {
        var sReg = Debugger.REGS[iReg];
        return sReg + '=' + this.getRegString(iReg) + ' ';
    };

    /**
     * getRegDump()
     *
     * Sample 8080 register dump:
     *
     *      A=00 BC=0000 DE=0000 HL=0000 SP=0000 I0 S0 Z0 A0 P0 C0
     *      0000 00         NOP
     *
     * @this {Debugger}
     * @return {string}
     */
    Debugger.prototype.getRegDump = function()
    {
        var s;
        s = this.getRegOutput(Debugger.REG_A) +
            this.getRegOutput(Debugger.REG_BC) +
            this.getRegOutput(Debugger.REG_DE) +
            this.getRegOutput(Debugger.REG_HL) +
            this.getRegOutput(Debugger.REG_SP) +
            this.getFlagOutput("IF") + this.getFlagOutput("SF") + this.getFlagOutput("ZF") +
            this.getFlagOutput("AF") + this.getFlagOutput("PF") + this.getFlagOutput("CF");
        return s;
    };

    Debugger.aBinOpPrecedence = {
        '||':   0,      // logical OR
        '&&':   1,      // logical AND
        '|':    2,      // bitwise OR
        '^':    3,      // bitwise XOR
        '&':    4,      // bitwise AND
        '!=':   5,      // inequality
        '==':   5,      // equality
        '>=':   6,      // greater than or equal to
        '>':    6,      // greater than
        '<=':   6,      // less than or equal to
        '<':    6,      // less than
        '>>>':  7,      // unsigned bitwise right shift
        '>>':   7,      // bitwise right shift
        '<<':   7,      // bitwise left shift
        '-':    8,      // subtraction
        '+':    8,      // addition
        '%':    9,      // remainder
        '/':    9,      // division
        '*':    9       // multiplication
    };

    /**
     * evalExpression(aVals, aOps, cOps)
     *
     * In Node, if you set a variable to 0x80000001; ie:
     *
     *      foo=0x80000001|0
     *
     * and then calculate foo*foo using "(foo*foo).toString(2)", the result is:
     *
     *      '11111111111111111111111111111100000000000000000000000000000000'
     *
     * which is slightly incorrect because it has overflowed JavaScript's floating-point precision.
     *
     * 0x80000001 in decimal is -2147483647, so the product is 4611686014132420609, which is 0x3FFFFFFF00000001.
     *
     * @this {Debugger}
     * @param {Array.<number>} aVals
     * @param {Array.<string>} aOps
     * @param {number} [cOps] (default is all)
     * @return {boolean} true if successful, false if error
     */
    Debugger.prototype.evalExpression = function(aVals, aOps, cOps)
    {
        cOps = cOps || -1;
        while (cOps-- && aOps.length) {
            var chOp = aOps.pop();
            if (aVals.length < 2) return false;
            var valNew;
            var val2 = aVals.pop();
            var val1 = aVals.pop();
            switch(chOp) {
            case '*':
                valNew = val1 * val2;
                break;
            case '/':
                if (!val2) return false;
                valNew = val1 / val2;
                break;
            case '%':
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
                valNew = val1 & val2;
                break;
            case '^':
                valNew = val1 ^ val2;
                break;
            case '|':
                valNew = val1 | val2;
                break;
            case '&&':
                valNew = (val1 && val2? 1 : 0);
                break;
            case '||':
                valNew = (val1 || val2? 1 : 0);
                break;
            default:
                return false;
            }
            aVals.push(valNew|0);
        }
        return true;
    };

    /**
     * parseExpression(sExp, fPrint)
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
     * predecessor is encountered, evaluate, and push the result back onto aVals.
     *
     * Unary operators like '~' and ternary operators like '?:' are not supported; neither are parentheses.
     *
     * However, parseReference() now makes it possible to write parenthetical-style sub-expressions by using
     * {...} (braces), as well as address references by using [...] (brackets).
     *
     * Why am I using braces instead of parentheses for sub-expressions?  Because parseReference() serves
     * multiple purposes, the other being reference replacement in message strings passing through replaceRegs(),
     * and I didn't want parentheses taking on a new meaning in message strings.
     *
     * @this {Debugger}
     * @param {string|undefined} sExp
     * @param {boolean} [fPrint] is true to print all resolved values, false for quiet parsing
     * @return {number|undefined} numeric value, or undefined if sExp contains any undefined or invalid values
     */
    Debugger.prototype.parseExpression = function(sExp, fPrint)
    {
        var value;

        if (sExp) {
            /*
             * First process (and eliminate) any references, aka sub-expressions.
             */
            sExp = this.parseReference(sExp);

            var i = 0;
            var fError = false;
            var sExpOrig = sExp;
            var aVals = [], aOps = [];
            /*
             * All browsers (including, I believe, IE9 and up) support the following idiosyncrasy of a regexp split():
             * when the regexp uses a capturing pattern, the resulting array will include entries for all the pattern
             * matches along with the non-matches.  This effectively means that, in the set of expressions that we
             * support, all even entries in asValues will contain "values" and all odd entries will contain "operators".
             *
             * And although I tried to list the supported operators in "precedential" order, bitwise operators must
             * be out-of-order so that we don't mistakenly match either '>' or '<' when they're part of '>>' or '<<'.
             */
            var regExp = /(\|\||&&|\||^|&|!=|==|>=|>>>|>>|>|<=|<<|<|-|\+|%|\/|\*)/;
            var asValues = sExp.split(regExp);
            while (i < asValues.length) {
                var sValue = asValues[i++];
                var cchValue = sValue.length;
                var s = str.trim(sValue);
                if (!s) {
                    fError = true;
                    break;
                }
                var v = this.parseValue(s, null, fPrint === false);
                if (v === undefined) {
                    fError = true;
                    fPrint = false;
                    break;
                }
                aVals.push(v);
                if (i == asValues.length) break;
                var sOp = asValues[i++], cchOp = sOp.length;

                if (aOps.length && Debugger.aBinOpPrecedence[sOp] < Debugger.aBinOpPrecedence[aOps[aOps.length-1]]) {
                    this.evalExpression(aVals, aOps, 1);
                }
                aOps.push(sOp);
                sExp = sExp.substr(cchValue + cchOp);
            }
            if (!this.evalExpression(aVals, aOps) || aVals.length != 1) {
                fError = true;
            }
            if (!fError) {
                value = aVals.pop();
                if (fPrint) this.printValue(null, value);
            } else {
                if (fPrint) this.println("error parsing '" + sExpOrig + "' at character " + (sExpOrig.length - sExp.length));
            }
        }
        return value;
    };

    /**
     * parseReference(s)
     *
     * Returns the given string with any "{expression}" sequences replaced with the value of the expression,
     * and any "[address]" references replaced with the contents of the address.  Expressions are parsed BEFORE
     * addresses.  Owing to this function's simplistic parsing, nested braces/brackets are not supported
     * (define intermediate variables if needed).
     *
     * @this {Debugger}
     * @param {string} s
     * @return {string}
     */
    Debugger.prototype.parseReference = function(s)
    {
        var a;
        while (a = s.match(/\{(.*?)}/)) {
            if (a[1].indexOf('{') >= 0) break;          // unsupported nested brace(s)
            var value = this.parseExpression(a[1]);
            s = s.replace('{' + a[1] + '}', value != null? str.toHex(value) : "undefined");
        }
        while (a = s.match(/\[(.*?)]/)) {
            if (a[1].indexOf('[') >= 0) break;          // unsupported nested bracket(s)
            var dbgAddr = this.parseAddr(a[1]);
            s = s.replace('[' + a[1] + ']', dbgAddr? str.toHex(this.getWord(dbgAddr), 4) : "undefined");
        }
        return this.parseSysVars(s);
    };

    /**
     * parseSysVars(s)
     *
     * Returns the given string with any recognized "$var" replaced with its value; eg:
     *
     *      $ops: the number of opcodes executed since the last time it was displayed (or reset)
     *
     * @this {Debugger}
     * @param {string} s
     * @return {string}
     */
    Debugger.prototype.parseSysVars = function(s)
    {
        var a;
        while (a = s.match(/\$([a-z]+)/i)) {
            var v = null;
            switch(a[1].toLowerCase()) {
            case "ops":
                v = this.cOpcodes - this.cOpcodesStart;
                break;
            }
            if (v == null) break;
            s = s.replace(a[0], v.toString());
        }
        return s;
    };

    /**
     * parseValue(sValue, sName, fQuiet)
     *
     * @this {Debugger}
     * @param {string|undefined} sValue
     * @param {string|null} [sName] is the name of the value, if any
     * @param {boolean} [fQuiet]
     * @return {number|undefined} numeric value, or undefined if sValue is either undefined or invalid
     */
    Debugger.prototype.parseValue = function(sValue, sName, fQuiet)
    {
        var value;
        if (sValue !== undefined) {
            var iReg = this.getRegIndex(sValue);
            if (iReg >= 0) {
                value = this.getRegValue(iReg);
            } else {
                value = this.getVariable(sValue);
                if (value === undefined) value = str.parseInt(sValue);
            }
            if (value === undefined && !fQuiet) this.println("invalid " + (sName? sName : "value") + ": " + sValue);
        } else {
            if (!fQuiet) this.println("missing " + (sName || "value"));
        }
        return value;
    };

    /**
     * printValue(sVar, value)
     *
     * @this {Debugger}
     * @param {string|null} sVar
     * @param {number|undefined} value
     * @return {boolean} true if value defined, false if not
     */
    Debugger.prototype.printValue = function(sVar, value)
    {
        var sValue;
        var fDefined = false;
        if (value !== undefined) {
            fDefined = true;
            sValue = str.toHexLong(value) + " " + value + ". (" + str.toBinBytes(value) + ")";
        }
        sVar = (sVar != null? (sVar + ": ") : "");
        this.println(sVar + sValue);
        return fDefined;
    };

    /**
     * printVariable(sVar)
     *
     * @this {Debugger}
     * @param {string} [sVar]
     * @return {boolean} true if all value(s) defined, false if not
     */
    Debugger.prototype.printVariable = function(sVar)
    {
        if (sVar) {
            return this.printValue(sVar, this.aVariables[sVar]);
        }
        var cVariables = 0;
        for (sVar in this.aVariables) {
            this.printValue(sVar, this.aVariables[sVar]);
            cVariables++;
        }
        return cVariables > 0;
    };

    /**
     * delVariable(sVar)
     *
     * @this {Debugger}
     * @param {string} sVar
     */
    Debugger.prototype.delVariable = function(sVar)
    {
        delete this.aVariables[sVar];
    };

    /**
     * getVariable(sVar)
     *
     * @this {Debugger}
     * @param {string} sVar
     * @return {number|undefined}
     */
    Debugger.prototype.getVariable = function(sVar)
    {
        return this.aVariables[sVar];
    };

    /**
     * setVariable(sVar, value)
     *
     * @this {Debugger}
     * @param {string} sVar
     * @param {number} value
     */
    Debugger.prototype.setVariable = function(sVar, value)
    {
        this.aVariables[sVar] = value;
    };

    /**
     * comparePairs(p1, p2)
     *
     * @this {Debugger}
     * @param {number|string|Array|Object} p1
     * @param {number|string|Array|Object} p2
     * @return {number}
     */
    Debugger.prototype.comparePairs = function(p1, p2)
    {
        return p1[0] > p2[0]? 1 : p1[0] < p2[0]? -1 : 0;
    };

    /**
     * addSymbols(sModule, addr, len, aSymbols)
     *
     * As filedump.js (formerly convrom.php) explains, aSymbols is a JSON-encoded object whose properties consist
     * of all the symbols (in upper-case), and the values of those properties are objects containing any or all of
     * the following properties:
     *
     *      'v': the value of an absolute (unsized) value
     *      'b': either 1, 2, 4 or undefined if an unsized value
     *      's': either a hard-coded segment or undefined
     *      'o': the offset of the symbol within the associated address space
     *      'l': the original-case version of the symbol, present only if it wasn't originally upper-case
     *      'a': annotation for the specified offset; eg, the original assembly language, with optional comment
     *
     * To that list of properties, we also add:
     *
     *      'p': the physical address (calculated whenever both 's' and 'o' properties are defined)
     *
     * Note that values for any 'v', 'b', 's' and 'o' properties are unquoted decimal values, and the values
     * for any 'l' or 'a' properties are quoted strings. Also, if double-quotes were used in any of the original
     * annotation ('a') values, they will have been converted to two single-quotes, so we're responsible for
     * converting them back to individual double-quotes.
     *
     * For example:
     *      {
     *          'HF_PORT': {
     *              'v':800
     *          },
     *          'HDISK_INT': {
     *              'b':4, 's':0, 'o':52
     *          },
     *          'ORG_VECTOR': {
     *              'b':4, 's':0, 'o':76
     *          },
     *          'CMD_BLOCK': {
     *              'b':1, 's':64, 'o':66
     *          },
     *          'DISK_SETUP': {
     *              'o':3
     *          },
     *          '.40': {
     *              'o':40, 'a':"MOV AX,WORD PTR ORG_VECTOR ;GET DISKETTE VECTOR"
     *          }
     *      }
     *
     * If a symbol only has an offset, then that offset value can be assigned to the symbol property directly:
     *
     *          'DISK_SETUP': 3
     *
     * The last property is an example of an "anonymous" entry, for offsets where there is no associated symbol.
     * Such entries are identified by a period followed by a unique number (usually the offset of the entry), and
     * they usually only contain offset ('o') and annotation ('a') properties.  I could eliminate the leading
     * period, but it offers a very convenient way of quickly discriminating among genuine vs. anonymous symbols.
     *
     * We add all these entries to our internal symbol table, which is an array of 4-element arrays, each of which
     * look like:
     *
     *      [addr, len, aSymbols, aOffsets]
     *
     * There are two basic symbol operations: findSymbol(), which takes an address and finds the symbol, if any,
     * at that address, and findSymbolAddr(), which takes a string and attempts to match it to a non-anonymous
     * symbol with a matching offset ('o') property.
     *
     * To implement findSymbol() efficiently, addSymbols() creates an array of [offset, sSymbol] pairs
     * (aOffsets), one pair for each symbol that corresponds to an offset within the specified address space.
     *
     * We guarantee the elements of aOffsets are in offset order, because we build it using binaryInsert();
     * it's quite likely that the MAP file already ordered all its symbols in offset order, but since they're
     * hand-edited files, we can't assume that, and we need to ensure that findSymbol()'s binarySearch() operates
     * properly.
     *
     * @this {Debugger}
     * @param {string|null} sModule
     * @param {number|null} addr (physical address where the symbols are located, if the memory is physical; eg, ROM)
     * @param {number} len (the size of the region, in bytes)
     * @param {Object} aSymbols (collection of symbols in this group; the format of this collection is described below)
     */
    Debugger.prototype.addSymbols = function(sModule, addr, len, aSymbols)
    {
        var dbgAddr = {};
        var aOffsets = [];
        for (var sSymbol in aSymbols) {
            var symbol = aSymbols[sSymbol];
            if (typeof symbol == "number") {
                aSymbols[sSymbol] = symbol = {'o': symbol};
            }
            var offSymbol = symbol['o'];
            var sAnnotation = symbol['a'];
            if (offSymbol !== undefined) {
                usr.binaryInsert(aOffsets, [offSymbol >>> 0, sSymbol], this.comparePairs);
            }
            if (sAnnotation) symbol['a'] = sAnnotation.replace(/''/g, "\"");
        }
        var symbolTable = {
            sModule: sModule,
            addr: addr,
            len: len,
            aSymbols: aSymbols,
            aOffsets: aOffsets
        };
        this.aSymbolTable.push(symbolTable);
    };

    /**
     * dumpSymbols()
     *
     * TODO: Add "numerical" and "alphabetical" dump options. This is simply dumping them in whatever
     * order they appeared in the original MAP file.
     *
     * @this {Debugger}
     */
    Debugger.prototype.dumpSymbols = function()
    {
        for (var iTable = 0; iTable < this.aSymbolTable.length; iTable++) {
            var symbolTable = this.aSymbolTable[iTable];
            for (var sSymbol in symbolTable.aSymbols) {
                if (sSymbol.charAt(0) == '.') continue;
                var symbol = symbolTable.aSymbols[sSymbol];
                var offSymbol = symbol['o'];
                if (offSymbol === undefined) continue;
                var sSymbolOrig = symbolTable.aSymbols[sSymbol]['l'];
                if (sSymbolOrig) sSymbol = sSymbolOrig;
                this.println(this.toHexOffset(offSymbol) + ' ' + sSymbol);
            }
        }
    };

    /**
     * findSymbol(dbgAddr, fNearest)
     *
     * Search aSymbolTable for dbgAddr, and return an Array for the corresponding symbol (empty if not found).
     *
     * If fNearest is true, and no exact match was found, then the Array returned will contain TWO sets of
     * entries: [0]-[3] will refer to closest preceding symbol, and [4]-[7] will refer to the closest subsequent symbol.
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @param {boolean} [fNearest]
     * @return {Array} where [0] == symbol name, [1] == symbol value, [2] == any annotation, and [3] == any associated comment
     */
    Debugger.prototype.findSymbol = function(dbgAddr, fNearest)
    {
        var aSymbol = [];
        var addrSymbol = this.getAddr(dbgAddr) >>> 0;
        for (var iTable = 0; iTable < this.aSymbolTable.length; iTable++) {
            var symbolTable = this.aSymbolTable[iTable];
            var addr = symbolTable.addr >>> 0;
            var len = symbolTable.len;
            if (addrSymbol >= addr && addrSymbol < addr + len) {
                var offSymbol = addrSymbol - addr;
                var result = usr.binarySearch(symbolTable.aOffsets, [offSymbol], this.comparePairs);
                if (result >= 0) {
                    this.returnSymbol(iTable, result, aSymbol);
                }
                else if (fNearest) {
                    result = ~result;
                    this.returnSymbol(iTable, result-1, aSymbol);
                    this.returnSymbol(iTable, result, aSymbol);
                }
                break;
            }
        }
        return aSymbol;
    };

    /**
     * findSymbolAddr(sSymbol)
     *
     * Search aSymbolTable for sSymbol, and if found, return a dbgAddr (same as parseAddr())
     *
     * @this {Debugger}
     * @param {string} sSymbol
     * @return {DbgAddr|undefined}
     */
    Debugger.prototype.findSymbolAddr = function(sSymbol)
    {
        var dbgAddr;
        if (sSymbol.match(/^[a-z_][a-z0-9_]*$/i)) {
            var sUpperCase = sSymbol.toUpperCase();
            for (var iTable = 0; iTable < this.aSymbolTable.length; iTable++) {
                var symbolTable = this.aSymbolTable[iTable];
                var symbol = symbolTable.aSymbols[sUpperCase];
                if (symbol !== undefined) {
                    var offSymbol = symbol['o'];
                    if (offSymbol !== undefined) {
                        /*
                         * We assume that every ROM is ORG'ed at 0x0000, and therefore unless the symbol has an
                         * explicitly-defined segment, we return the segment associated with the entire group; for
                         * a ROM, that segment is normally "addrROM >>> 4".  Down the road, we may want/need to
                         * support a special symbol entry (eg, ".ORG") that defines an alternate origin.
                         */
                        dbgAddr = this.newAddr(offSymbol);
                    }
                    /*
                     * The symbol matched, but it wasn't for an address (no 'o' offset), and there's no point
                     * looking any farther, since each symbol appears only once, so we indicate it's an unknown symbol.
                     */
                    break;
                }
            }
        }
        return dbgAddr;
    };

    /**
     * returnSymbol(iTable, iOffset, aSymbol)
     *
     * Helper function for findSymbol().
     *
     * @param {number} iTable
     * @param {number} iOffset
     * @param {Array} aSymbol is updated with the specified symbol, if it exists
     */
    Debugger.prototype.returnSymbol = function(iTable, iOffset, aSymbol)
    {
        var symbol = {};
        var aOffsets = this.aSymbolTable[iTable].aOffsets;
        var offset = 0, sSymbol = null;
        if (iOffset >= 0 && iOffset < aOffsets.length) {
            offset = aOffsets[iOffset][0];
            sSymbol = aOffsets[iOffset][1];
        }
        if (sSymbol) {
            symbol = this.aSymbolTable[iTable].aSymbols[sSymbol];
            sSymbol = (sSymbol.charAt(0) == '.'? null : (symbol['l'] || sSymbol));
        }
        aSymbol.push(sSymbol);
        aSymbol.push(offset);
        aSymbol.push(symbol['a']);
        aSymbol.push(symbol['c']);
    };

    /**
     * doHelp()
     *
     * @this {Debugger}
     */
    Debugger.prototype.doHelp = function()
    {
        var s = "commands:";
        for (var sCommand in Debugger.COMMANDS) {
            s += '\n' + str.pad(sCommand, 7) + Debugger.COMMANDS[sCommand];
        }
        if (!this.checksEnabled()) s += "\nnote: frequency/history disabled if no exec breakpoints";
        this.println(s);
    };

    /**
     * doAssemble(asArgs)
     *
     * This always receives the complete argument array, where the order of the arguments is:
     *
     *      [0]: the assemble command (assumed to be "a")
     *      [1]: the target address (eg, "200")
     *      [2]: the operation code, aka instruction name (eg, "adc")
     *      [3]: the operation mode operand, if any (eg, "14", "[1234]", etc)
     *
     * The Debugger enters "assemble mode" whenever only the first (or first and second) arguments are present.
     * As long as "assemble mode is active, the user can omit the first two arguments on all later assemble commands
     * until "assemble mode" is cancelled with an empty command line; the command processor automatically prepends "a"
     * and the next available target address to the argument array.
     *
     * Entering "assemble mode" is optional; one could enter a series of fully-qualified assemble commands; eg:
     *
     *      a ff00 cld
     *      a ff01 ldx 28
     *      ...
     *
     * without ever entering "assemble mode", but of course, that requires more typing and doesn't take advantage
     * of automatic target address advancement (see dbgAddrAssemble).
     *
     * NOTE: As the previous example implies, you can even assemble new instructions into ROM address space;
     * as our setByte() function explains, the ROM write-notification handlers only refuse writes from the CPU.
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs is the complete argument array, beginning with the "a" command in asArgs[0]
     */
    Debugger.prototype.doAssemble = function(asArgs)
    {
        var dbgAddr = this.parseAddr(asArgs[1], true);
        if (!dbgAddr) return;

        this.dbgAddrAssemble = dbgAddr;
        if (asArgs[2] === undefined) {
            this.println("begin assemble at " + this.toHexAddr(dbgAddr));
            this.fAssemble = true;
            this.cpu.updateCPU();
            return;
        }

        var aOpBytes = this.parseInstruction(asArgs[2], asArgs[3], dbgAddr);
        if (aOpBytes.length) {
            for (var i = 0; i < aOpBytes.length; i++) {
                this.setByte(dbgAddr, aOpBytes[i], 1);
            }
            /*
             * Since getInstruction() also updates the specified address, dbgAddrAssemble is automatically advanced.
             */
            this.println(this.getInstruction(this.dbgAddrAssemble));
        }
    };

    /**
     * doBreak(sCmd, sAddr, sOptions)
     *
     * As the "help" output below indicates, the following breakpoint commands are supported:
     *
     *      bp [a]  set exec breakpoint on linear addr [a]
     *      br [a]  set read breakpoint on linear addr [a]
     *      bw [a]  set write breakpoint on linear addr [a]
     *      bc [a]  clear breakpoint on linear addr [a] (use "*" for all breakpoints)
     *      bl      list breakpoints
     *
     * to which we have recently added the following I/O breakpoint commands:
     *
     *      bi [p]  toggle input breakpoint on port [p] (use "*" for all input ports)
     *      bo [p]  toggle output breakpoint on port [p] (use "*" for all output ports)
     *
     * These two new commands operate as toggles so that if "*" is used to trap all input (or output),
     * you can also use these commands to NOT trap specific ports.
     *
     *      bn [n]  break after [n] instructions
     *
     * TODO: Update the "bl" command to include any/all I/O breakpoints, and the "bc" command to
     * clear them.  Because "bi" and "bo" commands are piggy-backing on Bus functions, those breakpoints
     * are currently outside the realm of what the "bl" and "bc" commands are aware of.
     *
     * @this {Debugger}
     * @param {string} sCmd
     * @param {string|undefined} [sAddr]
     * @param {string} [sOptions] (the rest of the breakpoint command-line)
     */
    Debugger.prototype.doBreak = function(sCmd, sAddr, sOptions)
    {
        if (sAddr == '?') {
            this.println("breakpoint commands:");
            this.println("\tbi [p]\ttoggle break on input port [p]");
            this.println("\tbo [p]\ttoggle break on output port [p]");
            this.println("\tbp [a]\tset exec breakpoint at addr [a]");
            this.println("\tbr [a]\tset read breakpoint at addr [a]");
            this.println("\tbw [a]\tset write breakpoint at addr [a]");
            this.println("\tbc [a]\tclear breakpoint at addr [a]");
            this.println("\tbl\tlist all breakpoints");
            this.println("\tbn [n]\tbreak after [n] instruction(s)");
            return;
        }

        var sParm = sCmd.charAt(1);
        if (sParm == 'l') {
            var cBreaks = 0;
            cBreaks += this.listBreakpoints(this.aBreakExec);
            cBreaks += this.listBreakpoints(this.aBreakRead);
            cBreaks += this.listBreakpoints(this.aBreakWrite);
            if (!cBreaks) this.println("no breakpoints");
            return;
        }

        if (sParm == 'n') {
            this.nBreakIns = this.parseValue(sAddr);
            this.println("break after " + this.nBreakIns + " instruction(s)");
            return;
        }

        if (sAddr === undefined) {
            this.println("missing breakpoint address");
            return;
        }

        var dbgAddr = this.newAddr();
        if (sAddr != '*') {
            dbgAddr = this.parseAddr(sAddr, true, true);
            if (!dbgAddr) return;
        }

        sAddr = str.toHexWord(dbgAddr.addr);

        if (sParm == 'c') {
            if (dbgAddr.addr == null) {
                this.clearBreakpoints();
                this.println("all breakpoints cleared");
                return;
            }
            if (this.findBreakpoint(this.aBreakExec, dbgAddr, true))
                return;
            if (this.findBreakpoint(this.aBreakRead, dbgAddr, true))
                return;
            if (this.findBreakpoint(this.aBreakWrite, dbgAddr, true))
                return;
            this.println("breakpoint missing: " + this.toHexAddr(dbgAddr));
            return;
        }

        if (sParm == 'i') {
            this.println("breakpoint " + (this.bus.addPortInputBreak(dbgAddr.addr)? "enabled" : "cleared") + ": port " + sAddr + " (input)");
            return;
        }

        if (sParm == 'o') {
            this.println("breakpoint " + (this.bus.addPortOutputBreak(dbgAddr.addr)? "enabled" : "cleared") + ": port " + sAddr + " (output)");
            return;
        }

        if (dbgAddr.addr == null) return;

        this.parseAddrOptions(dbgAddr, sOptions);

        if (sParm == 'p') {
            this.addBreakpoint(this.aBreakExec, dbgAddr);
            return;
        }
        if (sParm == 'r') {
            this.addBreakpoint(this.aBreakRead, dbgAddr);
            return;
        }
        if (sParm == 'w') {
            this.addBreakpoint(this.aBreakWrite, dbgAddr);
            return;
        }
        this.println("unknown breakpoint command: " + sParm);
    };

    /**
     * doClear(sCmd)
     *
     * @this {Debugger}
     * @param {string} [sCmd] (eg, "cls" or "clear")
     */
    Debugger.prototype.doClear = function(sCmd)
    {
        /*
         * TODO: There should be a clear() component method that the Control Panel overrides to perform this function.
         */
        if (this.controlPrint) this.controlPrint.value = "";
    };

    /**
     * doDump(asArgs)
     *
     * The length parameter is interpreted as a number of bytes, in hex, which we convert to the appropriate number
     * of lines, because we always display whole lines.  If the length is omitted/undefined, it defaults to 0x80 (128.)
     * bytes, which normally translates to 8 lines.
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs (formerly sCmd, [sAddr], [sLen] and [sBytes])
     */
    Debugger.prototype.doDump = function(asArgs)
    {
        var m;
        var sCmd = asArgs[0];
        var sAddr = asArgs[1];
        var sLen = asArgs[2];
        var sBytes = asArgs[3];

        if (sAddr == '?') {
            var sDumpers = "";
            for (m in Debugger.MESSAGES) {
                if (this.afnDumpers[m]) {
                    if (sDumpers) sDumpers += ',';
                    sDumpers = sDumpers + m;
                }
            }
            sDumpers += ",state,symbols";
            this.println("dump memory commands:");
            this.println("\tdb [a] [#]    dump # bytes at address a");
            this.println("\tdw [a] [#]    dump # words at address a");
            this.println("\tdd [a] [#]    dump # dwords at address a");
            this.println("\tdh [#] [#]    dump # instructions from history");
            if (sDumpers.length) this.println("dump extension commands:\n\t" + sDumpers);
            return;
        }

        if (sAddr == "state") {
            var sState = this.cmp.powerOff(true);
            if (sLen == "console") {
                /*
                 * Console buffers are notoriously small, and even the following code, which breaks the
                 * data into parts (eg, "d state console 1", "d state console 2", etc) just isn't that helpful.
                 *
                 *      var nPart = +sBytes;
                 *      if (nPart) sState = sState.substr(1000000 * (nPart-1), 1000000);
                 *
                 * So, the best way to capture a large machine state is to use the new "Save Machine" link
                 * that downloads a machine's entire state.  Alternatively, run your own local server and use
                 * server-side storage.  Take a look at the "Save" binding in computer.js, which binds an HTML
                 * control to the computer.powerOff() and computer.saveServerState() functions.
                 */
                console.log(sState);
            } else {
                this.doClear();
                this.println(sState);
            }
            return;
        }

        if (sAddr == "symbols") {
            this.dumpSymbols();
            return;
        }

        if (sCmd == "d") {
            for (m in Debugger.MESSAGES) {
                if (asArgs[1] == m) {
                    var fnDumper = this.afnDumpers[m];
                    if (fnDumper) {
                        asArgs.shift();
                        asArgs.shift();
                        fnDumper(asArgs);
                    } else {
                        this.println("no dump registered for " + sAddr);
                    }
                    return;
                }
            }
            if (!sAddr) sCmd = this.sCmdDumpPrev || "db";
        } else {
            this.sCmdDumpPrev = sCmd;
        }

        if (sCmd == "dh") {
            this.dumpHistory(sAddr, sLen);
            return;
        }

        var dbgAddr = this.parseAddr(sAddr);
        if (!dbgAddr) return;

        var len = 0;                            // 0 is not a default; it triggers the appropriate default below
        if (sLen) {
            if (sLen.charAt(0) == 'l') {
                sLen = sLen.substr(1) || sBytes;
            }
            len = this.parseValue(sLen) >>> 0;  // negative lengths not allowed
            if (len > 0x10000) len = 0x10000;   // prevent bad user (or variable) input from producing excessive output
        }

        var sDump = "";
        var size = (sCmd == "dd"? 4 : (sCmd == "dw"? 2 : 1));
        var cb = (size * len) || 128;
        var cLines = ((cb + 15) >> 4) || 1;

        while (cLines-- && cb > 0) {
            var data = 0, iByte = 0, i;
            var sData = "", sChars = "";
            sAddr = this.toHexAddr(dbgAddr);
            for (i = 16; i > 0 && cb > 0; i--) {
                var b = this.getByte(dbgAddr, 1);
                data |= (b << (iByte++ << 3));
                if (iByte == size) {
                    sData += str.toHex(data, size * 2);
                    sData += (size == 1? (i == 9? '-' : ' ') : "  ");
                    data = iByte = 0;
                }
                sChars += (b >= 32 && b < 128? String.fromCharCode(b) : '.');
                cb--;
            }
            if (sDump) sDump += '\n';
            sDump += sAddr + "  " + sData + ((i == 0)? (' ' + sChars) : "");
        }

        if (sDump) this.println(sDump);
        this.dbgAddrNextData = dbgAddr;
    };

    /**
     * doEdit(asArgs)
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs
     */
    Debugger.prototype.doEdit = function(asArgs)
    {
        var size = 1;
        var mask = 0xff;
        var fnGet = this.getByte;
        var fnSet = this.setByte;
        if (asArgs[0] == "ew") {
            size = 2;
            mask = 0xffff;
            fnGet = this.getShort;
            fnSet = this.setShort;
        }
        var cch = size << 1;

        var sAddr = asArgs[1];
        if (sAddr == null) {
            this.println("edit memory commands:");
            this.println("\teb [a] [...]  edit bytes at address a");
            this.println("\tew [a] [...]  edit words at address a");
            return;
        }

        var dbgAddr = this.parseAddr(sAddr);
        if (!dbgAddr) return;

        for (var i = 2; i < asArgs.length; i++) {
            var vNew = this.parseExpression(asArgs[i]);
            if (vNew === undefined) {
                this.println("unrecognized value: " + asArgs[i]);
                break;
            }
            if (vNew & ~mask) {
                this.println("warning: " + str.toHex(vNew) + " exceeds " + size + "-byte value");
            }
            var vOld = fnGet.call(this, dbgAddr);
            this.println("changing " + this.toHexAddr(dbgAddr) + " from 0x" + str.toHex(vOld, cch) + " to 0x" + str.toHex(vNew, cch));
            fnSet.call(this, dbgAddr, vNew, size);
        }
    };

    /**
     * doFreqs(sParm)
     *
     * @this {Debugger}
     * @param {string|undefined} sParm
     */
    Debugger.prototype.doFreqs = function(sParm)
    {
        if (sParm == '?') {
            this.println("frequency commands:");
            this.println("\tclear\tclear all frequency counts");
            return;
        }
        var i;
        var cData = 0;
        if (this.aaOpcodeCounts) {
            if (sParm == "clear") {
                for (i = 0; i < this.aaOpcodeCounts.length; i++)
                    this.aaOpcodeCounts[i] = [i, 0];
                this.println("frequency data cleared");
                cData++;
            }
            else if (sParm !== undefined) {
                this.println("unknown frequency command: " + sParm);
                cData++;
            }
            else {
                var aaSortedOpcodeCounts = this.aaOpcodeCounts.slice();
                aaSortedOpcodeCounts.sort(function(p, q) {
                    return q[1] - p[1];
                });
                var asOpcodes = this.style != Debugger.STYLE_8086? Debugger.INS_NAMES : Debugger.INS_NAMES_8086;
                for (i = 0; i < aaSortedOpcodeCounts.length; i++) {
                    var bOpcode = aaSortedOpcodeCounts[i][0];
                    var cFreq = aaSortedOpcodeCounts[i][1];
                    if (cFreq) {
                        this.println((asOpcodes[this.aaOpDescs[bOpcode][0]] + "  ").substr(0, 5) + " (" + str.toHexByte(bOpcode) + "): " + cFreq + " times");
                        cData++;
                    }
                }
            }
        }
        if (!cData) {
            this.println("no frequency data available");
        }
    };

    /**
     * doHalt(fQuiet)
     *
     * @this {Debugger}
     * @param {boolean} [fQuiet]
     */
    Debugger.prototype.doHalt = function(fQuiet)
    {
        var sMsg;
        if (this.flags.fRunning) {
            sMsg = "halting";
            this.stopCPU();
        } else {
            if (this.isBusy(true)) return;
            sMsg = "already halted";
        }
        if (!fQuiet) this.println(sMsg);
    };

    /**
     * doIf(sCmd, fQuiet)
     *
     * NOTE: Don't forget that the default base for all numeric constants is 16 (hex), so when you evaluate
     * an expression like "a==10", it will compare the value of the variable "a" to 0x10; use a trailing period
     * (eg, "10.") if you really intend decimal.
     *
     * Also, if no variable named "a" exists, "a" will evaluate to 0x0A, so the expression "a==10" becomes
     * "0x0A==0x10" (false), whereas the expression "a==10." becomes "0x0A==0x0A" (true).
     *
     * @this {Debugger}
     * @param {string} sCmd
     * @param {boolean} [fQuiet]
     * @return {boolean} true if expression is non-zero, false if zero (or undefined due to a parse error)
     */
    Debugger.prototype.doIf = function(sCmd, fQuiet)
    {
        sCmd = str.trim(sCmd);
        if (!this.parseExpression(sCmd)) {
            if (!fQuiet) this.println("false: " + sCmd);
            return false;
        }
        if (!fQuiet) this.println("true: " + sCmd);
        return true;
    };

    /**
     * doInfo(asArgs)
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs
     * @return {boolean} true only if the instruction info command ("n") is supported
     */
    Debugger.prototype.doInfo = function(asArgs)
    {
        if (DEBUG) {
            this.println("msPerYield: " + this.cpu.aCounts.msPerYield);
            this.println("nCyclesPerBurst: " + this.cpu.aCounts.nCyclesPerBurst);
            this.println("nCyclesPerYield: " + this.cpu.aCounts.nCyclesPerYield);
            this.println("nCyclesPerVideoUpdate: " + this.cpu.aCounts.nCyclesPerVideoUpdate);
            this.println("nCyclesPerStatusUpdate: " + this.cpu.aCounts.nCyclesPerStatusUpdate);
            return true;
        }
        return false;
    };

    /**
     * doInput(sPort)
     *
     * Simulate a 1-byte port input operation.
     *
     * @this {Debugger}
     * @param {string|undefined} sPort
     */
    Debugger.prototype.doInput = function(sPort)
    {
        if (!sPort || sPort == '?') {
            this.println("input commands:");
            this.println("\ti [p]\tread port [p]");
            /*
             * TODO: Regarding this warning, consider adding an "unchecked" version of
             * bus.checkPortInputNotify(), since all Debugger memory accesses are unchecked, too.
             *
             * All port I/O handlers ARE aware when the Debugger is calling (addrFrom is undefined),
             * but changing them all to be non-destructive would take time, and situations where you
             * actually want to affect the hardware state are just as likely as not....
             */
            this.println("warning: port accesses can affect hardware state");
            return;
        }
        var port = this.parseValue(sPort);
        if (port !== undefined) {
            var bIn = this.bus.checkPortInputNotify(port, 1);
            this.println(str.toHexWord(port) + ": " + str.toHexByte(bIn));
        }
    };

    /**
     * doVar(sCmd)
     *
     * The command must be of the form "{variable} = [{expression}]", where expression may contain constants,
     * operators, registers, symbols, other variables, or nothing at all; in the latter case, the variable, if
     * any, is deleted.
     *
     * Other supported shorthand: "var" with no parameters prints the values of all variables, and "var {variable}"
     * prints the value of the specified variable.
     *
     * @this {Debugger}
     * @param {string} sCmd
     * @return {boolean} true if valid "var" assignment, false if not
     */
    Debugger.prototype.doVar = function(sCmd)
    {
        var a = sCmd.match(/^\s*([A-Z_]?[A-Z0-9_]*)\s*(=?)\s*(.*)$/i);
        if (a) {
            if (!a[1]) {
                if (!this.printVariable()) this.println("no variables");
                return true;    // it's not considered an error to print an empty list of variables
            }
            if (!a[2]) {
                return this.printVariable(a[1]);
            }
            if (!a[3]) {
                this.delVariable(a[1]);
                return true;    // it's not considered an error to delete a variable that didn't exist
            }
            var v = this.parseExpression(a[3]);
            if (v !== undefined) {
                this.setVariable(a[1], v);
                return true;
            }
            return false;
        }
        this.println("invalid assignment:" + sCmd);
        return false;
    };

    /**
     * doList(sAddr, fPrint)
     *
     * @this {Debugger}
     * @param {string} sAddr
     * @param {boolean} [fPrint]
     * @return {string|null}
     */
    Debugger.prototype.doList = function(sAddr, fPrint)
    {
        var sSymbol = null;

        var dbgAddr = this.parseAddr(sAddr, true);
        if (dbgAddr) {
            var addr = this.getAddr(dbgAddr);
            var aSymbol = this.findSymbol(dbgAddr, true);
            if (aSymbol.length) {
                var nDelta, sDelta, s;
                if (aSymbol[0]) {
                    sDelta = "";
                    nDelta = dbgAddr.addr - aSymbol[1];
                    if (nDelta) sDelta = " + " + str.toHexWord(nDelta);
                    s = aSymbol[0] + " (" + this.toHexOffset(aSymbol[1]) + ')' + sDelta;
                    if (fPrint) this.println(s);
                    sSymbol = s;
                }
                if (aSymbol.length > 4 && aSymbol[4]) {
                    sDelta = "";
                    nDelta = aSymbol[5] - dbgAddr.addr;
                    if (nDelta) sDelta = " - " + str.toHexWord(nDelta);
                    s = aSymbol[4] + " (" + this.toHexOffset(aSymbol[5]) + ')' + sDelta;
                    if (fPrint) this.println(s);
                    if (!sSymbol) sSymbol = s;
                }
            } else {
                if (fPrint) this.println("no symbols");
            }
        }
        return sSymbol;
    };

    /**
     * doMessages(asArgs)
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs
     */
    Debugger.prototype.doMessages = function(asArgs)
    {
        var m;
        var fCriteria = null;
        var sCategory = asArgs[1];
        if (sCategory == '?') sCategory = undefined;

        if (sCategory !== undefined) {
            var bitsMessage = 0;
            if (sCategory == "all") {
                bitsMessage = (0xffffffff|0) & ~(Messages.HALT | Messages.KEYS | Messages.LOG);
                sCategory = null;
            } else if (sCategory == "on") {
                fCriteria = true;
                sCategory = null;
            } else if (sCategory == "off") {
                fCriteria = false;
                sCategory = null;
            } else {
                /*
                 * Internally, we use "key" instead of "keys", since the latter is a method on JavasScript objects,
                 * but externally, we allow the user to specify "keys"; "kbd" is also allowed as shorthand for "keyboard".
                 */
                if (sCategory == "keys") sCategory = "key";
                if (sCategory == "kbd") sCategory = "keyboard";
                for (m in Debugger.MESSAGES) {
                    if (sCategory == m) {
                        bitsMessage = Debugger.MESSAGES[m];
                        fCriteria = !!(this.bitsMessage & bitsMessage);
                        break;
                    }
                }
                if (!bitsMessage) {
                    this.println("unknown message category: " + sCategory);
                    return;
                }
            }
            if (bitsMessage) {
                if (asArgs[2] == "on") {
                    this.bitsMessage |= bitsMessage;
                    fCriteria = true;
                }
                else if (asArgs[2] == "off") {
                    this.bitsMessage &= ~bitsMessage;
                    fCriteria = false;
                    if (bitsMessage == Messages.BUFFER) {
                        for (var i = 0; i < this.aMessageBuffer.length; i++) {
                            this.println(this.aMessageBuffer[i]);
                        }
                        this.aMessageBuffer = [];
                    }
                }
            }
        }

        /*
         * Display those message categories that match the current criteria (on or off)
         */
        var n = 0;
        var sCategories = "";
        for (m in Debugger.MESSAGES) {
            if (!sCategory || sCategory == m) {
                var bitMessage = Debugger.MESSAGES[m];
                var fEnabled = !!(this.bitsMessage & bitMessage);
                if (fCriteria !== null && fCriteria != fEnabled) continue;
                if (sCategories) sCategories += ',';
                if (!(++n % 10)) sCategories += "\n\t";     // jshint ignore:line
                /*
                 * Internally, we use "key" instead of "keys", since the latter is a method on JavasScript objects,
                 * but externally, we allow the user to specify "keys".
                 */
                if (m == "key") m = "keys";
                sCategories += m;
            }
        }

        if (sCategory === undefined) {
            this.println("message commands:\n\tm [category] [on|off]\tturn categories on/off");
        }

        this.println((fCriteria !== null? (fCriteria? "messages on:  " : "messages off: ") : "message categories:\n\t") + (sCategories || "none"));

        this.historyInit();     // call this just in case Messages.INT was turned on
    };

    /**
     * doOptions(asArgs)
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs
     */
    Debugger.prototype.doOptions = function(asArgs)
    {
        switch (asArgs[1]) {
        case "8080":
            this.style = Debugger.STYLE_8080;
            break;

        case "8086":
            this.style = Debugger.STYLE_8086;
            break;

        case "cs":
            var nCycles;
            if (asArgs[3] !== undefined) nCycles = +asArgs[3];          // warning: decimal instead of hex conversion
            switch (asArgs[2]) {
                case "int":
                    this.cpu.aCounts.nCyclesChecksumInterval = nCycles;
                    break;
                case "start":
                    this.cpu.aCounts.nCyclesChecksumStart = nCycles;
                    break;
                case "stop":
                    this.cpu.aCounts.nCyclesChecksumStop = nCycles;
                    break;
                default:
                    this.println("unknown cs option");
                    return;
            }
            if (nCycles !== undefined) {
                this.cpu.resetChecksum();
            }
            this.println("checksums " + (this.cpu.flags.fChecksum? "enabled" : "disabled"));
            return;

        case "sp":
            if (asArgs[2] !== undefined) {
                if (!this.cpu.setSpeed(+asArgs[2])) {
                    this.println("warning: using 1x multiplier, previous target not reached");
                }
            }
            this.println("target speed: " + this.cpu.getSpeedTarget() + " (" + this.cpu.getSpeed() + "x)");
            return;

        case "?":
            this.println("debugger options:");
            this.println("\t8080\t\tselect 8080-style mnemonics");
            this.println("\t8086\t\tselect 8086-style mnemonics");
            this.println("\tcs int #\tset checksum cycle interval to #");
            this.println("\tcs start #\tset checksum cycle start count to #");
            this.println("\tcs stop #\tset checksum cycle stop count to #");
            this.println("\tsp #\t\tset speed multiplier to #");
            break;

        default:
            if (asArgs[1]) {
                this.println("unknown option: " + asArgs[1]);
                return;
            }
            break;
        }
        this.println(this.style + "-style mnemonics enabled");
    };

    /**
     * doOutput(sPort, sByte)
     *
     * Simulate a 1-byte port output operation.
     *
     * @this {Debugger}
     * @param {string|undefined} sPort
     * @param {string|undefined} sByte (string representation of 1 byte)
     */
    Debugger.prototype.doOutput = function(sPort, sByte)
    {
        if (!sPort || sPort == '?') {
            this.println("output commands:");
            this.println("\to [p] [b]\twrite byte [b] to port [p]");
            /*
             * TODO: Regarding this warning, consider adding an "unchecked" version of
             * bus.checkPortOutputNotify(), since all Debugger memory accesses are unchecked, too.
             *
             * All port I/O handlers ARE aware when the Debugger is calling (addrFrom is undefined),
             * but changing them all to be non-destructive would take time, and situations where you
             * actually want to affect the hardware state are just as likely as not....
             */
            this.println("warning: port accesses can affect hardware state");
            return;
        }
        var port = this.parseValue(sPort, "port #");
        var bOut = this.parseValue(sByte);
        if (port !== undefined && bOut !== undefined) {
            this.bus.checkPortOutputNotify(port, 1, bOut);
            this.println(str.toHexWord(port) + ": " + str.toHexByte(bOut));
        }
    };

    /**
     * doRegisters(asArgs, fInstruction)
     *
     * @this {Debugger}
     * @param {Array.<string>} [asArgs]
     * @param {boolean} [fInstruction] (true to include the current instruction; default is true)
     */
    Debugger.prototype.doRegisters = function(asArgs, fInstruction)
    {
        if (asArgs && asArgs[1] == '?') {
            this.println("register commands:");
            this.println("\tr\tdump registers");
            this.println("\trx [#]\tset flag or register x to [#]");
            return;
        }

        var cpu = this.cpu;
        if (fInstruction == null) fInstruction = true;

        if (asArgs != null && asArgs.length > 1) {
            var sReg = asArgs[1];
            var sValue = null;
            var i = sReg.indexOf('=');
            if (i > 0) {
                sValue = sReg.substr(i + 1);
                sReg = sReg.substr(0, i);
            }
            else if (asArgs.length > 2) {
                sValue = asArgs[2];
            }
            else {
                this.println("missing value for " + asArgs[1]);
                return;
            }

            var fValid = false;
            var w = this.parseExpression(sValue);

            if (w !== undefined) {
                fValid = true;
                var sRegMatch = sReg.toUpperCase();
                switch (sRegMatch) {
                case "A":
                    cpu.regA = w & 0xff;
                    break;
                case "B":
                    cpu.regB = w & 0xff;
                    break;
                case "BC":
                    cpu.regB = ((w >> 8) & 0xff);
                    /* falls through */
                case "C":
                    cpu.regC = w & 0xff;
                    break;
                case "D":
                    cpu.regD = w & 0xff;
                    break;
                case "DE":
                    cpu.regD = ((w >> 8) & 0xff);
                    /* falls through */
                case "E":
                    cpu.regE = w & 0xff;
                    break;
                case "H":
                    cpu.regH = w & 0xff;
                    break;
                case "HL":
                    cpu.regH = ((w >> 8) & 0xff);
                    /* falls through */
                case "L":
                    cpu.regL = w & 0xff;
                    break;
                case "SP":
                    cpu.setSP(w);
                    break;
                case "PC":
                    cpu.setPC(w);
                    this.dbgAddrNextCode = this.newAddr(cpu.getPC());
                    break;
                case "PS":
                    cpu.setPS(w);
                    break;
                case "PSW":
                    cpu.setPSW(w);
                    break;
                case "CF":
                    if (w) cpu.setCF(); else cpu.clearCF();
                    break;
                case "PF":
                    if (w) cpu.setPF(); else cpu.clearPF();
                    break;
                case "AF":
                    if (w) cpu.setAF(); else cpu.clearAF();
                    break;
                case "ZF":
                    if (w) cpu.setZF(); else cpu.clearZF();
                    break;
                case "SF":
                    if (w) cpu.setSF(); else cpu.clearSF();
                    break;
                case "IF":
                    if (w) cpu.setIF(); else cpu.clearIF();
                    break;
                default:
                    this.println("unknown register: " + sReg);
                    return;
                }
            }
            if (!fValid) {
                this.println("invalid value: " + sValue);
                return;
            }
            cpu.updateCPU();
            this.println("updated registers:");
        }

        this.println(this.getRegDump());

        if (fInstruction) {
            this.dbgAddrNextCode = this.newAddr(cpu.getPC());
            this.doUnassemble(this.toHexAddr(this.dbgAddrNextCode));
        }
    };

    /**
     * doRun(sCmd, sAddr, sOptions, fQuiet)
     *
     * @this {Debugger}
     * @param {string} sCmd
     * @param {string|undefined} [sAddr]
     * @param {string} [sOptions] (the rest of the breakpoint command-line)
     * @param {boolean} [fQuiet]
     */
    Debugger.prototype.doRun = function(sCmd, sAddr, sOptions, fQuiet)
    {
        if (sCmd == "gt") {
            this.fIgnoreNextCheckFault = true;
        }
        if (sAddr !== undefined) {
            var dbgAddr = this.parseAddr(sAddr, true);
            if (!dbgAddr) return;
            this.parseAddrOptions(dbgAddr, sOptions);
            this.setTempBreakpoint(dbgAddr);
        }
        if (!this.runCPU(true)) {
            if (!fQuiet) this.println("cpu busy or unavailable, run command ignored");
        }
    };

    /**
     * doPrint(sCmd)
     *
     * NOTE: If the string to print is a quoted string, then we run it through replaceRegs(), so that
     * you can take advantage of all the special replacement options used for software interrupt logging.
     *
     * @this {Debugger}
     * @param {string} sCmd
     */
    Debugger.prototype.doPrint = function(sCmd)
    {
        sCmd = str.trim(sCmd);
        var a = sCmd.match(/^(['"])(.*?)\1$/);
        if (!a) {
            this.parseExpression(sCmd, true);
        } else {
            this.println(this.replaceRegs(a[2]));
        }
    };

    /**
     * doStep(sCmd)
     *
     * @this {Debugger}
     * @param {string} [sCmd] "p" or "pr"
     */
    Debugger.prototype.doStep = function(sCmd)
    {
        var fCallStep = true;
        var fRegs = (sCmd == "pr"? 1 : 0);
        /*
         * Set up the value for this.nStep (ie, 1 or 2) depending on whether the user wants
         * a subsequent register dump ("pr") or not ("p").
         */
        var nStep = 1 + fRegs;
        if (!this.nStep) {
            var dbgAddr = this.newAddr(this.cpu.getPC());
            var bOpcode = this.getByte(dbgAddr);

            switch (bOpcode) {
            case CPUDef.OPCODE.CALL:
                if (fCallStep) {
                    this.nStep = nStep;
                    this.incAddr(dbgAddr, 3);
                }
                break;
            default:
                break;
            }

            if (this.nStep) {
                this.setTempBreakpoint(dbgAddr);
                if (!this.runCPU()) {
                    if (this.cmp) this.cmp.updateFocus();
                    this.nStep = 0;
                }
                /*
                 * A successful run will ultimately call stop(), which will in turn call clearTempBreakpoint(),
                 * which will clear nStep, so there's your assurance that nStep will be reset.  Now we may have
                 * stopped for reasons unrelated to the temporary breakpoint, but that's OK.
                 */
            } else {
                this.doTrace(fRegs? "tr" : "t");
            }
        } else {
            this.println("step in progress");
        }
    };

    /**
     * getCall(dbgAddr)
     *
     * Given a possible return address (typically from the stack), look for a matching CALL (or INT) that
     * immediately precedes that address.
     *
     * @this {Debugger}
     * @param {DbgAddr} dbgAddr
     * @return {string|null} CALL instruction at or near dbgAddr, or null if none
     */
    Debugger.prototype.getCall = function(dbgAddr)
    {
        var sCall = null;
        var addr = dbgAddr.addr;
        var addrOrig = addr;
        for (var n = 1; n <= 6 && !!addr; n++) {
            if (n > 2) {
                dbgAddr.addr = addr;
                var s = this.getInstruction(dbgAddr);
                if (s.indexOf("CALL") >= 0) {
                    /*
                     * Verify that the length of this CALL (or INT), when added to the address of the CALL (or INT),
                     * matches the original return address.  We do this by getting the string index of the opcode bytes,
                     * subtracting that from the string index of the next space, and dividing that difference by two,
                     * to yield the length of the CALL (or INT) instruction, in bytes.
                     */
                    var i = s.indexOf(' ');
                    var j = s.indexOf(' ', i+1);
                    if (addr + (j - i - 1)/2 == addrOrig) {
                        sCall = s;
                        break;
                    }
                }
            }
            addr--;
        }
        dbgAddr.addr = addrOrig;
        return sCall;
    };

    /**
     * doStackTrace(sCmd, sAddr)
     *
     * Use "k" for a normal stack trace and "ks" for a stack trace with symbolic info.
     *
     * @this {Debugger}
     * @param {string} [sCmd]
     * @param {string} [sAddr] (not used yet)
     */
    Debugger.prototype.doStackTrace = function(sCmd, sAddr)
    {
        if (sAddr == '?') {
            this.println("stack trace commands:");
            this.println("\tk\tshow frame addresses");
            this.println("\tks\tshow symbol information");
            return;
        }

        var nFrames = 10, cFrames = 0;
        var dbgAddrCall = this.newAddr();
        var dbgAddrStack = this.newAddr(this.cpu.getSP());
        this.println("stack trace for " + this.toHexAddr(dbgAddrStack));

        while (cFrames < nFrames) {
            var sCall = null, sCallPrev = null, cTests = 256;
            while ((dbgAddrStack.addr >>> 0) < 0x10000) {
                dbgAddrCall.addr = this.getWord(dbgAddrStack, true);
                /*
                 * Because we're using the auto-increment feature of getWord(), and because that will automatically
                 * wrap the offset around the end of the segment, we must also check the addr property to detect the wrap.
                 */
                if (dbgAddrStack.addr == null || !cTests--) break;
                sCall = this.getCall(dbgAddrCall);
                if (sCall) break;
            }
            /*
             * The sCallPrev check eliminates duplicate sequential calls, which are usually (but not always)
             * indicative of a false positive, in which case the previous call is probably bogus as well, but
             * at least we won't duplicate that mistake.  Of course, there are always exceptions, recursion
             * being one of them, but it's rare that we're debugging recursive code.
             */
            if (!sCall || sCall == sCallPrev) break;
            var sSymbol = null;
            if (sCmd == "ks") {
                var a = sCall.match(/[0-9A-F]+$/);
                if (a) sSymbol = this.doList(a[0]);
            }
            sCall = str.pad(sCall, 50) + "  ;" + (sSymbol || "stack=" + this.toHexAddr(dbgAddrStack)); // + " return=" + this.toHexAddr(dbgAddrCall));
            this.println(sCall);
            sCallPrev = sCall;
            cFrames++;
        }
        if (!cFrames) this.println("no return addresses found");
    };

    /**
     * doTrace(sCmd, sCount)
     *
     * The "t" and "tr" commands interpret the count as a number of instructions, and since
     * we call the Debugger's stepCPU() for each iteration, a single instruction includes
     * any/all prefixes; the CPU's stepCPU() treats prefixes as discrete operations.  The only
     * difference between "t" and "tr": the former displays only the next instruction, while
     * the latter also displays the (updated) registers.
     *
     * The "tc" command interprets the count as a number of cycles rather than instructions,
     * allowing you to quickly execute large chunks of instructions with a single command; it
     * doesn't display anything until the the chunk has finished.
     *
     * However, generally a more useful command is "bn", which allows you to break after some
     * number of instructions have been executed (as opposed to some number of cycles).
     *
     * @this {Debugger}
     * @param {string} [sCmd] ("t", "tc", or "tr")
     * @param {string} [sCount] # of instructions to step
     */
    Debugger.prototype.doTrace = function(sCmd, sCount)
    {
        var dbg = this;
        var fRegs = (sCmd != "t");
        var nCount = this.parseValue(sCount, null, true) || 1;
        var nCycles = (nCount == 1? 0 : 1);
        if (sCmd == "tc") {
            nCycles = nCount;
            nCount = 1;
        }
        web.onCountRepeat(
            nCount,
            function onCountStep() {
                return dbg.setBusy(true) && dbg.stepCPU(nCycles, fRegs, false);
            },
            function onCountStepComplete() {
                /*
                 * We explicitly called stepCPU() with fUpdateCPU === false, because repeatedly
                 * calling updateCPU() can be very slow, especially when fDisplayLiveRegs is true,
                 * so once the repeat count has been exhausted, we must perform a final updateCPU().
                 */
                dbg.cpu.updateCPU();
                dbg.setBusy(false);
            }
        );
    };

    /**
     * doUnassemble(sAddr, sAddrEnd, n)
     *
     * @this {Debugger}
     * @param {string} [sAddr]
     * @param {string} [sAddrEnd]
     * @param {number} [n]
     */
    Debugger.prototype.doUnassemble = function(sAddr, sAddrEnd, n)
    {
        var dbgAddr = this.parseAddr(sAddr, true);
        if (!dbgAddr) return;

        if (n === undefined) n = 1;

        var cb = 0x100;
        if (sAddrEnd !== undefined) {

            var dbgAddrEnd = this.parseAddr(sAddrEnd, true);
            if (!dbgAddrEnd || dbgAddrEnd.addr < dbgAddr.addr) return;

            cb = dbgAddrEnd.addr - dbgAddr.addr;
            if (!DEBUG && cb > 0x100) {
                /*
                 * Limiting the amount of disassembled code to 256 bytes in non-DEBUG builds is partly to
                 * prevent the user from wedging the browser by dumping too many lines, but also a recognition
                 * that, in non-DEBUG builds, this.println() keeps print output buffer truncated to 8Kb anyway.
                 */
                this.println("range too large");
                return;
            }
            n = -1;
        }

        var cLines = 0;
        var sInstruction;

        while (cb > 0 && n--) {

            var nSequence = (this.isBusy(false) || this.nStep)? this.nCycles : null;
            var sComment = (nSequence != null? "cycles" : null);
            var aSymbol = this.findSymbol(dbgAddr);

            var addr = dbgAddr.addr;    // we snap dbgAddr.addr *after* calling findSymbol(), which re-evaluates it

            if (aSymbol[0] && n) {
                if (!cLines && n || aSymbol[0].indexOf('+') < 0) {
                    var sLabel = aSymbol[0] + ':';
                    if (aSymbol[2]) sLabel += ' ' + aSymbol[2];
                    this.println(sLabel);
                }
            }

            if (aSymbol[3]) {
                sComment = aSymbol[3];
                nSequence = null;
            }

            sInstruction = this.getInstruction(dbgAddr, sComment, nSequence);

            this.println(sInstruction);
            this.dbgAddrNextCode = dbgAddr;
            cb -= dbgAddr.addr - addr;
            cLines++;
        }
    };

    /**
     * parseCommand(sCmd, fSave, chSep)
     *
     * @this {Debugger}
     * @param {string|undefined} sCmd
     * @param {boolean} [fSave] is true to save the command, false if not
     * @param {string} [chSep] is the command separator character (default is ';')
     * @return {Array.<string>}
     */
    Debugger.prototype.parseCommand = function(sCmd, fSave, chSep)
    {
        if (fSave) {
            if (!sCmd) {
                if (this.fAssemble) {
                    sCmd = "end";
                } else {
                    sCmd = this.aPrevCmds[this.iPrevCmd+1];
                }
            } else {
                if (this.iPrevCmd < 0 && this.aPrevCmds.length) {
                    this.iPrevCmd = 0;
                }
                if (this.iPrevCmd < 0 || sCmd != this.aPrevCmds[this.iPrevCmd]) {
                    this.aPrevCmds.splice(0, 0, sCmd);
                    this.iPrevCmd = 0;
                }
                this.iPrevCmd--;
            }
        }
        var a = [];
        if (sCmd) {
            /*
             * With the introduction of breakpoint commands (ie, quoted command sequences
             * associated with a breakpoint), we can no longer perform simplistic splitting.
             *
             *      a = sCmd.split(chSep || ';');
             *      for (var i = 0; i < a.length; i++) a[i] = str.trim(a[i]);
             *
             * We may now split on semi-colons ONLY if they are outside a quoted sequence.
             *
             * Also, to allow quoted strings *inside* breakpoint commands, we first replace all
             * DOUBLE double-quotes with single quotes.
             */
            sCmd = sCmd.toLowerCase().replace(/""/g, "'");

            var iPrev = 0;
            var chQuote = null;
            chSep = chSep || ';';
            /*
             * NOTE: Processing charAt() up to and INCLUDING length is not a typo; we're taking
             * advantage of the fact that charAt() with an invalid index returns an empty string,
             * allowing us to use the same substring() call to capture the final portion of sCmd.
             *
             * In a sense, it allows us to pretend that the string ends with a zero terminator.
             */
            for (var i = 0; i <= sCmd.length; i++) {
                var ch = sCmd.charAt(i);
                if (ch == '"' || ch == "'") {
                    if (!chQuote) {
                        chQuote = ch;
                    } else if (ch == chQuote) {
                        chQuote = null;
                    }
                }
                else if (ch == chSep && !chQuote || !ch) {
                    /*
                     * Recall that substring() accepts starting (inclusive) and ending (exclusive)
                     * indexes, whereas substr() accepts a starting index and a length.  We need the former.
                     */
                    a.push(str.trim(sCmd.substring(iPrev, i)));
                    iPrev = i + 1;
                }
            }
        }
        return a;
    };

    /**
     * shiftArgs(asArgs)
     *
     * Used with any command (eg, "r") that allows but doesn't require whitespace between command and first argument.
     *
     * @this {Debugger}
     * @param {Array.<string>} asArgs
     * @return {Array.<string>}
     */
    Debugger.prototype.shiftArgs = function(asArgs)
    {
        if (asArgs && asArgs.length) {
            var s0 = asArgs[0];
            var ch0 = s0.charAt(0);
            for (var i = 1; i < s0.length; i++) {
                var ch = s0.charAt(i);
                if (ch0 == '?' || ch0 == 'r' || ch < 'a' || ch > 'z') {
                    asArgs[0] = s0.substr(i);
                    asArgs.unshift(s0.substr(0, i));
                    break;
                }
            }
        }
        return asArgs;
    };

    /**
     * doCommand(sCmd, fQuiet)
     *
     * @this {Debugger}
     * @param {string} sCmd
     * @param {boolean} [fQuiet]
     * @return {boolean} true if command processed, false if unrecognized
     */
    Debugger.prototype.doCommand = function(sCmd, fQuiet)
    {
        var result = true;

        try {
            if (!sCmd.length || sCmd == "end") {
                if (this.fAssemble) {
                    this.println("ended assemble at " + this.toHexAddr(this.dbgAddrAssemble));
                    this.dbgAddrNextCode = this.dbgAddrAssemble;
                    this.fAssemble = false;
                }
                sCmd = "";
            }
            else if (!fQuiet) {
                var sPrompt = ">> ";
                this.println(sPrompt + sCmd);
            }

            var ch = sCmd.charAt(0);
            if (ch == '"' || ch == "'") return true;

            /*
             * Zap the previous message buffer to ensure the new command's output is not tossed out as a repeat.
             */
            this.sMessagePrev = null;

            /*
             * I've relaxed the !isBusy() requirement, to maximize our ability to issue Debugger commands externally.
             */
            if (this.isReady() /* && !this.isBusy(true) */ && sCmd.length > 0) {

                if (this.fAssemble) {
                    sCmd = "a " + this.toHexAddr(this.dbgAddrAssemble) + ' ' + sCmd;
                }

                var asArgs = this.shiftArgs(sCmd.replace(/ +/g, ' ').split(' '));

                switch (asArgs[0].charAt(0)) {
                case 'a':
                    this.doAssemble(asArgs);
                    break;
                case 'b':
                    this.doBreak(asArgs[0], asArgs[1], sCmd);
                    break;
                case 'c':
                    this.doClear(asArgs[0]);
                    break;
                case 'd':
                    if (!COMPILED && sCmd == "debug") {
                        window.DEBUG = true;
                        this.println("DEBUG checks on");
                        break;
                    }
                    this.doDump(asArgs);
                    break;
                case 'e':
                    if (asArgs[0] == "else") break;
                    this.doEdit(asArgs);
                    break;
                case 'f':
                    this.doFreqs(asArgs[1]);
                    break;
                case 'g':
                    this.doRun(asArgs[0], asArgs[1], sCmd, fQuiet);
                    break;
                case 'h':
                    this.doHalt(fQuiet);
                    break;
                case 'i':
                    if (asArgs[0] == "if") {
                        if (!this.doIf(sCmd.substr(2), fQuiet)) {
                            result = false;
                        }
                        break;
                    }
                    this.doInput(asArgs[1]);
                    break;
                case 'k':
                    this.doStackTrace(asArgs[0], asArgs[1]);
                    break;
                case 'l':
                    if (asArgs[0] == "ln") {
                        this.doList(asArgs[1], true);
                        break;
                    }
                    break;
                case 'm':
                    this.doMessages(asArgs);
                    break;
                case 'o':
                    this.doOutput(asArgs[1], asArgs[2]);
                    break;
                case 'p':
                    if (asArgs[0] == "print") {
                        this.doPrint(sCmd.substr(5));
                        break;
                    }
                    this.doStep(asArgs[0]);
                    break;
                case 'r':
                    if (sCmd == "reset") {
                        if (this.cmp) this.cmp.reset();
                        break;
                    }
                    this.doRegisters(asArgs);
                    break;
                case 's':
                    this.doOptions(asArgs);
                    break;
                case 't':
                    this.doTrace(asArgs[0], asArgs[1]);
                    break;
                case 'u':
                    this.doUnassemble(asArgs[1], asArgs[2], 8);
                    break;
                case 'v':
                    if (asArgs[0] == "var") {
                        if (!this.doVar(sCmd.substr(3))) {
                            result = false;
                        }
                        break;
                    }
                    this.println((APPNAME || "PC8080") + " version " + (XMLVERSION || APPVERSION) + " (" + this.cpu.model + (COMPILED? ",RELEASE" : (DEBUG? ",DEBUG" : ",NODEBUG")) + (TYPEDARRAYS? ",TYPEDARRAYS" : (BYTEARRAYS? ",BYTEARRAYS" : ",LONGARRAYS")) + ')');
                    this.println(web.getUserAgent());
                    break;
                case '?':
                    if (asArgs[1]) {
                        this.doPrint(sCmd.substr(1));
                        break;
                    }
                    this.doHelp();
                    break;
                case 'n':
                    if (!COMPILED && sCmd == "nodebug") {
                        window.DEBUG = false;
                        this.println("DEBUG checks off");
                        break;
                    }
                    if (this.doInfo(asArgs)) break;
                    /* falls through */
                default:
                    this.println("unknown command: " + sCmd);
                    result = false;
                    break;
                }
            }
        } catch(e) {
            this.println("debugger error: " + (e.stack || e.message));
            result = false;
        }
        return result;
    };

    /**
     * doCommands(sCmds, fSave)
     *
     * @this {Debugger}
     * @param {string} sCmds
     * @param {boolean} [fSave]
     * @return {boolean} true if all commands processed, false if not
     */
    Debugger.prototype.doCommands = function(sCmds, fSave)
    {
        var a = this.parseCommand(sCmds, fSave);
        for (var s in a) {
            if (!this.doCommand(a[s])) return false;
        }
        return true;
    };

    /**
     * Debugger.init()
     *
     * This function operates on every HTML element of class "debugger", extracting the
     * JSON-encoded parameters for the Debugger constructor from the element's "data-value"
     * attribute, invoking the constructor to create a Debugger component, and then binding
     * any associated HTML controls to the new component.
     */
    Debugger.init = function()
    {
        var aeDbg = Component.getElementsByClass(document, PC8080.APPCLASS, "debugger");
        for (var iDbg = 0; iDbg < aeDbg.length; iDbg++) {
            var eDbg = aeDbg[iDbg];
            var parmsDbg = Component.getComponentParms(eDbg);
            var dbg = new Debugger(parmsDbg);
            Component.bindComponentControls(dbg, eDbg, PC8080.APPCLASS);
        }
    };

    /*
     * Initialize every Debugger module on the page (as IF there's ever going to be more than one ;-))
     */
    web.onInit(Debugger.init);

}   // endif DEBUGGER


// ./modules/pc8080/lib/state.js

/**
 * @fileoverview The State class used by PCjs machines.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-19
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


/**
 * State(component, sVersion, sSuffix)
 *
 * State objects are used by components to save/restore their state.
 *
 * During a save operation, components add data to a State object via set(),
 * and then return the resulting data using data().
 *
 * During a restore operation, the Computer component passes the results of each
 * data() call back to the originating component.
 *
 * WARNING: Since State objects are low-level objects that have no UI requirements,
 * they do not inherit from the Component class, so you should only use class methods
 * of Component, such as Component.assert(), or Debugger methods if the Debugger
 * is available.
 *
 * @constructor
 * @param {Component} component
 * @param {string} [sVersion] is used to append a major version number to the key
 * @param {string} [sSuffix] is used to append any additional suffixes to the key
 */
function State(component, sVersion, sSuffix) {
    this.id = component.id;
    this.key = State.key(component, sVersion, sSuffix);
    this.dbg = component.dbg;
    this.unload(component.parms);
}

/**
 * State.key(component, sVersion, sSuffix)
 *
 * This encapsulates the key generation code.
 *
 * @param {Component} component
 * @param {string} [sVersion] is used to append a major version number to the key
 * @param {string} [sSuffix] is used to append any additional suffixes to the key
 * @return {string} key
 */
State.key = function(component, sVersion, sSuffix) {
    var key = component.id;
    if (sVersion) {
        var i = sVersion.indexOf('.');
        if (i > 0) key += ".v" + sVersion.substr(0, i);
    }
    if (sSuffix) {
        key += "." + sSuffix;
    }
    return key;
};

/**
 * State.compress(aSrc)
 *
 * @param {Array.<number>|null} aSrc
 * @return {Array.<number>|null} is either the original array (aSrc), or a smaller array of "count, value" pairs (aComp)
 */
State.compress = function(aSrc) {
    if (aSrc) {
        var iSrc = 0;
        var iComp = 0;
        var aComp = [];
        while (iSrc < aSrc.length) {
            var n = aSrc[iSrc];

            var iCompare = iSrc + 1;
            while (iCompare < aSrc.length && aSrc[iCompare] === n) iCompare++;
            aComp[iComp++] = iCompare - iSrc;
            aComp[iComp++] = n;
            iSrc = iCompare;
        }
        if (aComp.length < aSrc.length) return aComp;
    }
    return aSrc;
};

/**
 * State.decompress(aComp)
 *
 * @param {Array.<number>} aComp
 * @param {number} nLength is expected length of decompressed data
 * @return {Array.<number>}
 */
State.decompress = function(aComp, nLength) {
    var iDst = 0;
    var aDst = new Array(nLength);
    var iComp = 0;
    while (iComp < aComp.length - 1) {
        var c = aComp[iComp++];
        var n = aComp[iComp++];
        while (c--) {
            aDst[iDst++] = n;
        }
    }

    return aDst;
};

/**
 * State.compressEvenOdd(aSrc)
 *
 * This is a very simple variation on compress() that compresses all the EVEN elements of aSrc first,
 * followed by all the ODD elements.  This tends to work better on EGA video memory, because when odd/even
 * addressing is enabled (eg, for text modes), the DWORD values tend to alternate, which is the worst case
 * for compress(), but the best case for compressEvenOdd().
 *
 * One wrinkle we support: if the first element is uninitialized, then we assume the entire array is undefined,
 * and return an empty compressed array.  Conversely, decompressEvenOdd() will take an empty compressed array
 * and return an uninitialized array.
 *
 * @param {Array.<number>|null} aSrc
 * @return {Array.<number>|null} is either the original array (aSrc), or a smaller array of "count, value" pairs (aComp)
 */
State.compressEvenOdd = function(aSrc) {
    if (aSrc) {
        var iComp = 0, aComp = [];
        if (aSrc[0] !== undefined) {
            for (var off = 0; off < 2; off++) {
                var iSrc = off;
                while (iSrc < aSrc.length) {
                    var n = aSrc[iSrc];
                    var iCompare = iSrc + 2;
                    while (iCompare < aSrc.length && aSrc[iCompare] === n) iCompare += 2;
                    aComp[iComp++] = (iCompare - iSrc) >> 1;
                    aComp[iComp++] = n;
                    iSrc = iCompare;
                }
            }
        }
        if (aComp.length < aSrc.length) return aComp;
    }
    return aSrc;
};

/**
 * State.decompressEvenOdd(aComp, nLength)
 *
 * This is the counterpart to compressEvenOdd().  Note that because there's nothing in the compressed sequence
 * that differentiates a compress() sequence from a compressEvenOdd() sequence, you simply have to be consistent:
 * if you used even/odd compression, then you must use even/odd decompression.
 *
 * @param {Array.<number>} aComp
 * @param {number} nLength is expected length of decompressed data
 * @return {Array.<number>}
 */
State.decompressEvenOdd = function(aComp, nLength) {
    var iDst = 0;
    var aDst = new Array(nLength);
    var iComp = 0;
    while (iComp < aComp.length - 1) {
        var c = aComp[iComp++];
        var n = aComp[iComp++];
        while (c--) {
            aDst[iDst] = n;
            iDst += 2;
        }
        /*
         * The output of a "count,value" pair will never exceed the end of the output array, so as soon as we reach it
         * the first time, we know it's time to switch to ODD elements, and as soon as we reach it again, we should be
         * done.
         */

        if (iDst == nLength) iDst = 1;
    }

    return aDst;
};

State.prototype = {
    constructor: State,
    /**
     * set(id, data)
     *
     * @this {State}
     * @param {number|string} id
     * @param {Object|string} data
     */
    set: function(id, data) {
        try {
            this[this.id][id] = data;
        } catch(e) {
            Component.log(e.message);
        }
    },
    /**
     * get(id)
     *
     * @this {State}
     * @param {number|string} id
     * @return {Object|string|null}
     */
    get: function(id) {
        return this[this.id][id] || null;
    },
    /**
     * value()
     *
     * Use this instead of data() if you haven't called parse() yet.
     *
     * @this {State}
     * @return {string}
     */
    value: function() {
        return this[this.id];
    },
    /**
     * data()
     *
     * @this {State}
     * @return {Object}
     */
    data: function() {
        return this[this.id];
    },
    /**
     * load(s)
     *
     * WARNING: Make sure you follow this call with either a call to parse() or unload(),
     * because any stringified data that we've loaded isn't usable until it's been parsed.
     *
     * @this {State}
     * @param {Object|string|null} [s]
     * @return {boolean} true if state exists in localStorage, false if not
     */
    load: function(s) {
        if (s) {
            this[this.id] = s;
            this.fLoaded = true;
            return true;
        }
        if (this.fLoaded) {
            /*
             * This is assumed to be a redundant load().
             */
            return true;
        }
        if (web.hasLocalStorage()) {
            s = web.getLocalStorageItem(this.key);
            if (s) {
                this[this.id] = s;
                this.fLoaded = true;
                if (DEBUG) this.printString("localStorage(" + this.key + "): " + s.length + " bytes loaded");
                return true;
            }
        }
        return false;
    },
    /**
     * parse()
     *
     * This completes the load() operation, by parsing what was loaded, on the assumption there
     * might be some benefit to deferring parsing until we've given the user a chance to confirm.
     * Otherwise, load() could have just as easily done this, too.
     *
     * @this {State}
     * @return {boolean} true if successful, false if error
     */
    parse: function() {
        var fSuccess = true;
        try {
            this[this.id] = JSON.parse(this[this.id]);
        } catch (e) {
            Component.error(e.message || e);
            fSuccess = false;
        }
        return fSuccess;
    },
    /**
     * store()
     *
     * @this {State}
     * @return {boolean} true if successful, false if error
     */
    store: function() {
        var fSuccess = true;
        if (web.hasLocalStorage()) {
            var s = JSON.stringify(this[this.id]);
            if (web.setLocalStorageItem(this.key, s)) {
                if (DEBUG) this.printString("localStorage(" + this.key + "): " + s.length + " bytes stored");
            } else {
                /*
                 * WARNING: Because browsers tend to disable all alerts() during an "unload" operation,
                 * it's unlikely anyone will ever see the "quota" errors that occur at this point.  Need to
                 * think of some way to notify the user that there's a problem, and offer a way of cleaning
                 * up old states.
                 */
                Component.error("Unable to store " + s.length + " bytes in browser local storage");
                fSuccess = false;
            }
        }
        return fSuccess;
    },
    /**
     * toString()
     *
     * We can't know whether this might be called before parse() or after parse(), so we check.
     * If before, then this[this.id] will still be in string form; if after, it will be an Object.
     *
     * @this {State}
     * @return {string} JSON-encoded state
     */
    toString: function() {
        var value = this[this.id];
        return (typeof value == "string"? value : JSON.stringify(value));
    },
    /**
     * unload(parms)
     *
     * This discards any data saved via set() or loaded via load(), creating an empty State object.
     * Note that you have to follow this call with an explicit call to store() if you want to remove
     * the state from localStorage as well.
     *
     * @this {State}
     * @param {Object} [parms]
     */
    unload: function(parms) {
        this[this.id] = {};
        if (parms) this.set("parms", parms);
        this.fLoaded = false;
    },
    /**
     * clear(fAll)
     *
     * This unloads the current state, and then clears ALL localStorage for the current machine,
     * independent of version, to reduce the chance of orphaned states wasting part of our limited allocation.
     *
     * @this {State}
     * @param {boolean} [fAll] true to unconditionally clear ALL localStorage for the current domain
     */
    clear: function(fAll) {
        this.unload();
        var aKeys = web.getLocalStorageKeys();
        for (var i = 0; i < aKeys.length; i++) {
            var sKey = aKeys[i];
            if (sKey && (fAll || sKey.substr(0, this.key.length) == this.key)) {
                web.removeLocalStorageItem(sKey);
                if (DEBUG) this.printString("localStorage(" + sKey + ") removed");
                aKeys.splice(i, 1);
                i = 0;
            }
        }
    },
    /**
     * printString(s)
     *
     * @this {State}
     * @param {string} s is any caller-defined string
     */
    printString: function(s) {
        if (DEBUG && DEBUGGER && this.dbg) {
            if (this.dbg.messageEnabled(Messages.LOG)) {
                this.dbg.message(s);
            }
        }
    }
};


// ./modules/pc8080/lib/computer.js

/**
 * @fileoverview Implements the PC8080 Computer component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
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


/**
 * Computer(parmsComputer, parmsMachine, fSuspended)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsComputer
 * @param {Object} [parmsMachine]
 * @param {boolean} [fSuspended]
 *
 * The Computer component has no required (parmsComputer) properties, but it does
 * support the following:
 *
 *      autoPower: true to automatically power the computer (default), false to wait;
 *      false is honored only if a "power" button binding exists.
 *
 *      busWidth: number of memory address lines (address bits) on the computer's "bus";
 *      20 is the minimum (and the default), which implies 8086/8088 real-mode addressing,
 *      while 24 is required for 80286 protected-mode addressing.  This value is passed
 *      directly through to the Bus component; see that component for more details.
 *
 *      resume: one of the Computer.RESUME constants, which are as follows:
 *          '0' if resume disabled (default)
 *          '1' if enabled without prompting
 *          '2' if enabled with prompting
 *          '3' if enabled with prompting and auto-delete
 *          or a string containing the path of a predefined JSON-encoded state
 *
 *      state: the path to JSON-encoded state file (see details regarding 'state' below)
 *
 * The parmsMachine object, if provided, may contain any of:
 *
 *      autoMount: if set, this should override any 'autoMount' property in the FDC's
 *      parmsFDC object.
 *
 *      autoPower: if set, this should override any 'autoPower' property in the Computer's
 *      parmsComputer object.
 *
 *      messages: if set, this should override any 'messages' property in the Debugger's
 *      parmsDbg object.
 *
 *      state: if set, this should override any 'state' property in the Computer's
 *      parmsComputer object.
 *
 *      url: the location of the machine XML file
 *
 * If a predefined state is supplied AND it's successfully loaded, then resume behavior
 * defaults to '1' (ie, resume enabled without prompting).
 *
 * This component insures that all components are ready before "powering" them.
 *
 * Different components become ready at different times, and initialization order (ie,
 * the order the scripts are combined on the page) only partially determines readiness.
 * This is because components like ROM and Video must finish loading their resource files
 * before they are ready.  Other components become ready after we call their initBus()
 * function, because they have a Bus or CPU dependency, such as access to memory management
 * functions.  And other components, like CPU and Panel, are ready as soon as their
 * constructor finishes.
 *
 * Once a component has indicated it's ready, we call its powerUp() notification
 * function (if it has one--it's optional).  We call the CPU's powerUp() function last,
 * so that the CPU is assured that all other components are ready and "powered".
 */
function Computer(parmsComputer, parmsMachine, fSuspended) {

    Component.call(this, "Computer", parmsComputer, Computer, Messages.COMPUTER);

    this.flags.fPowered = false;

    this.setMachineParms(parmsMachine);

    this.fAutoPower = this.getMachineParm('autoPower', parmsComputer);

    /*
     * nPowerChange is 0 while the power state is stable, 1 while power is transitioning
     * to "on", and -1 while power is transitioning to "off".
     */
    this.nPowerChange = 0;

    /*
     * TODO: Deprecate 'buswidth' (it should have always used camelCase)
     */
    this.nBusWidth = parmsComputer['busWidth'] || parmsComputer['buswidth'];

    this.resume = Computer.RESUME_NONE;
    this.sStateData = null;
    this.fStateData = false;            // remembers if sStateData was loaded
    this.fServerState = false;

    this.url = this.getMachineParm('url') || "";

    /*
     * Generate a random number x (where 0 <= x < 1), add 0.1 so that it's guaranteed to be
     * non-zero, convert to base 36, and chop off the leading digit and "decimal" point.
     */
    this.sMachineID = (Math.random() + 0.1).toString(36).substr(2,12);
    this.sUserID = this.queryUserID();

    /*
     * Find the appropriate CPU (and Debugger and Control Panel, if any)
     *
     * CLOSURE COMPILER TIP: To override the type of a right-hand expression (as we need to do here,
     * where we know getComponentByType() will only return an CPUState object or null), wrap the expression
     * in parentheses.  I never knew this until I stumbled across it in "Closure: The Definitive Guide".
     */
    this.cpu = /** @type {CPUState} */ (Component.getComponentByType("CPU", this.id));
    if (!this.cpu) {
        Component.error("Unable to find CPU component");
        return;
    }
    this.dbg = /** @type {Debugger} */ (Component.getComponentByType("Debugger", this.id));

    /*
     * Enumerate all Video components for future updateVideo() calls.
     */
    this.aVideo = [];
    for (var video = null; (video = this.getMachineComponent("Video", video));) {
        this.aVideo.push(video);
    }

    /*
     * Initialize the Bus component
     */
    this.bus = new Bus({'id': this.idMachine + '.bus', 'busWidth': this.nBusWidth}, this.cpu, this.dbg);

    /*
     * Iterate through all the components and connect them to the Control Panel, if any
     */
    var iComponent, component;
    var aComponents = Component.getComponents(this.id);
    this.panel = /** @type {Panel} */ (Component.getComponentByType("Panel", this.id));

    if (this.panel && this.panel.controlPrint) {
        for (iComponent = 0; iComponent < aComponents.length; iComponent++) {
            component = aComponents[iComponent];
            /*
             * I can think of many "cleaner" ways for the Control Panel component to pass its
             * notice(), println(), etc, overrides on to all the other components, but it's just
             * too darn convenient to slam those overrides into the components directly.
             */
            component.notice = this.panel.notice;
            component.println = this.panel.println;
            component.controlPrint = this.panel.controlPrint;
        }
    }

    this.println(PC8080.APPNAME + " v" + PC8080.APPVERSION + "\n" + COPYRIGHT + "\n" + LICENSE);

    if (DEBUG && this.messageEnabled()) this.printMessage("TYPEDARRAYS: " + TYPEDARRAYS);

    /*
     * Iterate through all the components again and call their initBus() handler, if any
     */
    for (iComponent = 0; iComponent < aComponents.length; iComponent++) {
        component = aComponents[iComponent];
        if (component.initBus) component.initBus(this, this.bus, this.cpu, this.dbg);
    }

    var sStatePath = null;
    var sResume = parmsComputer['resume'];
    if (sResume !== undefined) {
        /*
         * DEPRECATE: This goofiness is a holdover from when the 'resume' property was a string (either a
         * single-digit string or a path); now it's always a number, so it never has a 'length' property and
         * the call to parseInt() is unnecessary.
         */
        if (sResume.length > 1) {
            sStatePath = this.sResumePath = sResume;
        } else {
            this.resume = parseInt(sResume, 10);
        }
    }

    /*
     * The Computer 'state' property allows a state file to be specified independent of the 'resume' feature;
     * previously, you could only use 'resume' to load a state file -- which we still support, but loading a state
     * file that way prevents the machine's state from being saved, since we always resume from the 'resume' file.
     *
     * The other wrinkle is on the restore side: we need to IGNORE the 'state' property if a saved state now exists.
     * So we have to peek at localStorage, and unfortunately, the only way to "peek" is to actually load the data,
     * but we're not ready to use it yet, so powerUp() has been changed to use any existing stateComputer that we've
     * already loaded.
     *
     * However, there's now a wrinkle to the wrinkle: if a 'state' parameter has been passed via the URL, then that
     * OVERRIDES everything; it overrides any 'state' Computer parameter AND it disables resume of any saved state in
     * localStorage (in other words, it prevents fAllowResume from being true, and forcing resume off).
     */
    var fAllowResume;
    var sState = this.getMachineParm('state') || (fAllowResume = true) && parmsComputer['state'];

    if (sState) {
        sStatePath = this.sStatePath = sState;
        if (!fAllowResume) {
            this.fServerState = true;
            this.resume = Computer.RESUME_NONE;
        }
        if (this.resume) {
            this.stateComputer = new State(this, PC8080.APPVERSION);
            if (this.stateComputer.load()) {
                sStatePath = null;
            } else {
                delete this.stateComputer;
            }
        }
    }

    /*
     * If sStatePath is set, we must use it.  But if there's no sStatePath AND resume is set,
     * then we have the option of resuming from a server-side state, assuming a valid USERID.
     */
    if (!sStatePath && this.resume) {
        sStatePath = this.getServerStatePath();
        if (sStatePath) this.fServerState = true;
    }

    if (!sStatePath) {
        this.setReady();
    } else {
        var cmp = this;
        web.getResource(sStatePath, null, true, function(sURL, sResource, nErrorCode) {
            cmp.doneLoad(sURL, sResource, nErrorCode);
        });
    }

    if (!this.bindings["power"]) this.fAutoPower = true;

    /*
     * Power on the computer, giving every component the opportunity to reset or restore itself.
     */
    if (!fSuspended && this.fAutoPower) this.wait(this.powerOn);
}

Component.subclass(Computer);

Computer.STATE_FAILSAFE  = "failsafe";
Computer.STATE_VALIDATE  = "validate";
Computer.STATE_TIMESTAMP = "timestamp";
Computer.STATE_VERSION   = "version";
Computer.STATE_HOSTURL   = "url";
Computer.STATE_BROWSER   = "browser";
Computer.STATE_USERID    = "user";

/*
 * The following constants define all the resume options.  Negative values (eg, RESUME_REPOWER) are for
 * internal use only, and RESUME_DELETE is not documented (it provides a way of deleting ALL saved states
 * whenever a resume is declined).  As a result, the only "end-user" values are 0, 1 and 2.
 */
Computer.RESUME_REPOWER  = -1;  // resume without changing any state (for internal use only)
Computer.RESUME_NONE     =  0;  // default (no resume)
Computer.RESUME_AUTO     =  1;  // automatically save/restore state
Computer.RESUME_PROMPT   =  2;  // automatically save but conditionally restore (WARNING: if restore is declined, any state is discarded)
Computer.RESUME_DELETE   =  3;  // same as RESUME_PROMPT but discards ALL machines states whenever ANY machine restore is declined (undocumented)

/**
 * getMachineID()
 *
 * @return {string}
 */
Computer.prototype.getMachineID = function()
{
    return this.sMachineID;
};

/**
 * setMachineParms(parmsMachine)
 *
 * If no explicit machine parms were provided, then we check for 'parms' in the bundled resources (if any).
 *
 * @param {Object} [parmsMachine]
 */
Computer.prototype.setMachineParms = function(parmsMachine)
{
    if (!parmsMachine) {
        var sParms;
        if (typeof resources == 'object' && (sParms = resources['parms'])) {
            try {
                parmsMachine = /** @type {Object} */ (eval("(" + sParms + ")"));
            } catch(e) {
                Component.error(e.message + " (" + sParms + ")");
            }
        }
    }
    this.parmsMachine = parmsMachine;
};

/**
 * getMachineParm(sParm, parmsComponent)
 *
 * If the machine parameter doesn't exist, we check for a matching component parameter (if parmsComponent is provided),
 * and failing that, we check the bundled resources (if any).
 *
 * At the moment, the only bundled resource request we expect to encounter is 'state'; if it exists, then we return
 * 'state' back to the caller (ie, the name of the resource), so that the caller will then attempt to load the 'state'
 * resource to obtain the actual state.
 *
 * @param {string} sParm
 * @param {Object} [parmsComponent]
 * @return {string|undefined}
 */
Computer.prototype.getMachineParm = function(sParm, parmsComponent)
{
    /*
     * When checking parmsURL, the check is allowed be a bit looser, because URL parameters are
     * user-supplied, whereas most other parameters are developer-supplied.  Granted, a developer
     * may also be sloppy and neglect to use correct case (eg, 'automount' instead of 'autoMount'),
     * but there are limits to my paranoia.
     */
    var sParmLC = sParm.toLowerCase();
    var value = Component.parmsURL[sParm] || Component.parmsURL[sParmLC];

    if (value === undefined && this.parmsMachine) {
        value = this.parmsMachine[sParm];
    }
    if (value === undefined && parmsComponent) {
        value = parmsComponent[sParm];
    }
    if (value === undefined && typeof resources == 'object' && resources[sParm]) {
        value = sParm;
    }
    return value;
};

/**
 * saveMachineParms()
 *
 * @return {string|null}
 */
Computer.prototype.saveMachineParms = function()
{
    return this.parmsMachine? JSON.stringify(this.parmsMachine) : null;
};

/**
 * getUserID()
 *
 * @return {string}
 */
Computer.prototype.getUserID = function()
{
    return this.sUserID || "";
};

/**
 * doneLoad(sURL, sStateData, nErrorCode)
 *
 * @this {Computer}
 * @param {string} sURL
 * @param {string} sStateData
 * @param {number} nErrorCode
 */
Computer.prototype.doneLoad = function(sURL, sStateData, nErrorCode)
{
    if (!nErrorCode) {
        this.sStateData = sStateData;
        this.fStateData = true;
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("loaded state file " + sURL.replace(this.sUserID || "xxx", "xxx"));
        }
    } else {
        this.sResumePath = null;
        this.fServerState = false;
        this.notice('Unable to load machine state from server (error ' + nErrorCode + (sStateData? ': ' + str.trim(sStateData) : '') + ')');
    }
    this.setReady();
};

/**
 * wait(fn, parms)
 *
 * wait() waits until every component is ready (including ourselves, the last component we check), then calls the
 * specified Computer method.
 *
 * TODO: The Closure Compiler makes it difficult for us to define a function type for "fn" that works in all cases;
 * sometimes we want to pass a function that takes only a "number", and other times we want to pass a function that
 * takes only an "Array" (the type will mirror that of the "parms" parameter).  However, the Closure Compiler insists
 * that both functions must be declared as accepting both types of parameters.  So once again, we must use an untyped
 * function declaration, instead of something stricter like:
 *
 *      param {function(this:Computer, (number|Array|undefined)): undefined} fn
 *
 * @this {Computer}
 * @param {function(...)} fn
 * @param {number|Array} [parms] optional parameters
 */
Computer.prototype.wait = function(fn, parms)
{
    var computer = this;
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent <= aComponents.length; iComponent++) {
        var component = (iComponent < aComponents.length ? aComponents[iComponent] : this);
        if (!component.isReady()) {
            component.isReady(function onComponentReady() {
                computer.wait(fn, parms);
            });
            return;
        }
    }
    if (DEBUG && this.messageEnabled()) this.printMessage("Computer.wait(ready)");
    fn.call(this, parms);
};

/**
 * validateState(stateComputer)
 *
 * NOTE: We clear() stateValidate only when there's no stateComputer.
 *
 * @this {Computer}
 * @param {State|null} [stateComputer]
 * @return {boolean} true if state passes validation, false if not
 */
Computer.prototype.validateState = function(stateComputer)
{
    var fValid = true;
    var stateValidate = new State(this, PC8080.APPVERSION, Computer.STATE_VALIDATE);
    if (stateValidate.load() && stateValidate.parse()) {
        var sTimestampValidate = stateValidate.get(Computer.STATE_TIMESTAMP);
        var sTimestampComputer = stateComputer ? stateComputer.get(Computer.STATE_TIMESTAMP) : "unknown";
        if (sTimestampValidate != sTimestampComputer) {
            this.notice("Machine state may be out-of-date\n(" + sTimestampValidate + " vs. " + sTimestampComputer + ")\nCheck your browser's local storage limits");
            fValid = false;
            if (!stateComputer) stateValidate.clear();
        } else {
            if (DEBUG && this.messageEnabled()) {
                this.printMessage("Last state: " + sTimestampComputer + " (validate: " + sTimestampValidate + ")");
            }
        }
    }
    return fValid;
};

/**
 * powerOn(resume)
 *
 * Power every component "up", applying any previously available state information.
 *
 * @this {Computer}
 * @param {number} [resume] is a valid RESUME value; default is this.resume
 */
Computer.prototype.powerOn = function(resume)
{
    if (resume === undefined) {
        resume = this.resume || (this.sStateData? Computer.RESUME_AUTO : Computer.RESUME_NONE);
    }

    if (DEBUG && this.messageEnabled()) {
        this.printMessage("Computer.powerOn(" + (resume == Computer.RESUME_REPOWER ? "repower" : (resume ? "resume" : "")) + ")");
    }

    if (this.nPowerChange) {
        return;
    }
    this.nPowerChange++;

    var fRepower = false;
    var fRestore = false;
    this.fRestoreError = false;
    var stateComputer = this.stateComputer || new State(this, PC8080.APPVERSION);

    if (resume == Computer.RESUME_REPOWER) {
        fRepower = true;
    }
    else if (resume > Computer.RESUME_NONE) {
        if (stateComputer.load(this.sStateData)) {
            /*
             * Since we're resuming something (either a predefined state or a state from localStorage), let's
             * create a "failsafe" checkpoint in localStorage, and destroy it at the end of a successful powerOn().
             * Which means, of course, that if a previous "failsafe" checkpoint already exists, something bad
             * may have happened the last time around.
             */
            this.stateFailSafe = new State(this, PC8080.APPVERSION, Computer.STATE_FAILSAFE);
            if (this.stateFailSafe.load()) {
                this.powerReport(stateComputer);
                /*
                 * We already know resume is something other than RESUME_NONE, so we'll go ahead and bump it
                 * all the way to RESUME_PROMPT, so that the user will be prompted, and if the user declines to
                 * restore, the state will be removed.
                 */
                resume = Computer.RESUME_PROMPT;
                /*
                 * To ensure that the set() below succeeds, we need to call unload(), otherwise it may fail
                 * with a "read only" error (eg, "TypeError: Cannot assign to read only property 'timestamp'").
                 */
                this.stateFailSafe.unload();
            }

            this.stateFailSafe.set(Computer.STATE_TIMESTAMP, usr.getTimestamp());
            this.stateFailSafe.store();

            var fValidate = this.resume && !this.fServerState;
            if (resume == Computer.RESUME_AUTO || web.confirmUser("Click OK to restore the previous " + PC8080.APPNAME + " machine state, or CANCEL to reset the machine.")) {
                fRestore = stateComputer.parse();
                if (fRestore) {
                    var sCode = stateComputer.get(UserAPI.RES.CODE);
                    var sData = stateComputer.get(UserAPI.RES.DATA);
                    if (sCode) {
                        if (sCode == UserAPI.CODE.OK) {
                            stateComputer.load(sData);
                        } else {
                            /*
                             * A missing (or not yet created) state file is no cause for alarm, but other errors might be
                             */
                            if (sCode == UserAPI.CODE.FAIL && sData != UserAPI.FAIL.NOSTATE) {
                                this.notice("Error: " + sData);
                                if (sData == UserAPI.FAIL.VERIFY) this.resetUserID();
                            } else {
                                this.println(sCode + ": " + sData);
                            }
                            /*
                             * Try falling back to the state that we should have saved in localStorage, as a backup to the
                             * server-side state.
                             */
                            stateComputer.unload();     // discard the invalid server-side state first
                            if (stateComputer.load()) {
                                fRestore = stateComputer.parse();
                                fValidate = true;
                            } else {
                                fRestore = false;       // hmmm, there was nothing in localStorage either
                            }
                        }
                    }
                }
                /*
                 * If the load/parse was successful, and it was from localStorage (not sStateData),
                 * then we should to try verify that localStorage snapshot is current.  One reason it may
                 * NOT be current is if localStorage was full and we got a quota error during the last
                 * powerOff().
                 */
                if (fValidate) this.validateState(fRestore? stateComputer : null);
            } else {
                /*
                 * RESUME_PROMPT indicates we should delete the state if they clicked Cancel to confirm() above.
                 */
                if (resume == Computer.RESUME_PROMPT) stateComputer.clear();
            }
        } else {
            /*
             * If there's no state, then there should also be no validation timestamp; if there is, then once again,
             * we're probably dealing with a quota error.
             */
            this.validateState();
        }
        delete this.sStateData;
        delete this.stateComputer;
    }

    /*
     * Start powering all components, including any data they may need to restore their state;
     * we restore power to the CPU last.
     */
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (component !== this && component != this.cpu) {
            fRestore = this.powerRestore(component, stateComputer, fRepower, fRestore);
        }
    }

    /*
     * Assuming this is not a repower, we must perform another wait, because some components may
     * have marked themselves as "not ready" again (eg, the FDC component, if the restore forced it
     * to mount one or more additional disk images).
     */
    var aParms = [stateComputer, resume, fRestore];

    if (resume != Computer.RESUME_REPOWER) {
        this.wait(this.donePowerOn, aParms);
        return;
    }
    this.donePowerOn(aParms);
};

/**
 * powerRestore(component, stateComputer, fRepower, fRestore)
 *
 * @this {Computer}
 * @param {Component} component
 * @param {State} stateComputer
 * @param {boolean} fRepower
 * @param {boolean} fRestore
 * @return {boolean} true if restore should continue, false if not
 */
Computer.prototype.powerRestore = function(component, stateComputer, fRepower, fRestore)
{
    if (!component.flags.fPowered) {

        component.flags.fPowered = true;

        if (component.powerUp) {

            var data = null;
            if (fRestore) {
                data = stateComputer.get(component.id);
                if (!data) {
                    /*
                     * This is a hack that makes it possible for a machine whose ID has been
                     * supplemented with a suffix (a single letter or digit) to find object IDs
                     * in states created from a machine without the suffix.
                     *
                     * For example, if a state file was created from a machine with ID "ibm5160"
                     * but the current machine is "ibm5160a", this attempts a second lookup with
                     * "ibm5160", enabling us to find objects that match the original machine ID
                     * (eg, "ibm5160.romEGA").
                     */
                    data = stateComputer.get(component.id.replace(/[a-z0-9]\./i, '.'));
                }
            }

            /*
             * State.get() will return whatever was originally passed to State.set() (eg, an
             * Object or a string), but components are supposed to store only Objects, so if a
             * string comes back, something went wrong.  By explicitly eliminating "string" data,
             * the Closure Compiler stops complaining that we might be passing strings to our
             * powerUp() functions (even though we know we're not).
             *
             * TODO: Determine if there's some way to coerce the Closure Compiler into treating
             * data as Object or null, without having to include this runtime check.  An assert
             * would be a good idea, but this is overkill.
             */
            if (typeof data === "string") data = null;

            /*
             * If computer is null, this is simply a repower notification, which most components
             * don't do anything with.  Exceptions include: CPU (since it may be halted) and Video
             * (since its screen may be "turned off").
             */
            if (!component.powerUp(data, fRepower) && data) {

                Component.error("Unable to restore state for " + component.type);
                /*
                 * If this is a resume error for a machine that also has a predefined state
                 * AND we're not restoring from that state, then throw away the current state,
                 * prevent any new state from being created, and then force a reload, which will
                 * hopefully restore us to the functioning predefined state.
                 *
                 * TODO: Considering doing this in ALL cases, not just in situations where a
                 * 'state' exists but we're not actually resuming from it.
                 */
                if (this.sStatePath && !this.fStateData) {
                    stateComputer.clear();
                    this.resume = Computer.RESUME_NONE;
                    web.reloadPage();
                } else {
                    /*
                     * In all other cases, we set fRestoreError, which should trigger a call to
                     * powerReport() and then delete the offending state.
                     */
                    this.fRestoreError = true;
                }
                /*
                 * Any failure triggers an automatic to call powerUp() again, without any state,
                 * in the hopes that the component can recover by performing a reset.
                 */
                component.powerUp(null);
                /*
                 * We also disable the rest of the restore operation, because it's not clear
                 * the remaining state information can be trusted;  the machine is already in an
                 * inconsistent state, so we're not likely to make things worse, and the only
                 * alternative (starting over and performing a state-less reset) isn't likely to make
                 * the user any happier.  But, we'll see... we need some experience with the code.
                 */
                fRestore = false;
            }
        }

        if (!fRepower && component.comment) {
            var asComments = component.comment.split("|");
            for (var i = 0; i < asComments.length; i++) {
                component.status(asComments[i]);
            }
        }
    }
    return fRestore;
};

/**
 * donePowerOn(aParms)
 *
 * This is nothing more than a continuation of powerOn(), giving us the option of calling wait() one more time.
 *
 * @this {Computer}
 * @param {Array} aParms containing [stateComputer, resume, fRestore]
 */
Computer.prototype.donePowerOn = function(aParms)
{
    var stateComputer = aParms[0];
    var fRepower = (aParms[1] < 0);
    var fRestore = aParms[2];

    if (DEBUG && this.flags.fPowered && this.messageEnabled()) {
        this.printMessage("Computer.donePowerOn(): redundant");
    }

    this.fInitialized = true;
    this.flags.fPowered = true;
    var controlPower = this.bindings["power"];
    if (controlPower) controlPower.textContent = "Shutdown";

    /*
     * Once we get to this point, we're guaranteed that all components are ready, so it's safe to power the CPU;
     * the CPU should begin executing immediately, unless a debugger is attached.
     */
    if (this.cpu) {
        /*
         * TODO: Do we not care about the return value here? (ie, is checking fRestoreError sufficient)?
         */
        this.powerRestore(this.cpu, stateComputer, fRepower, fRestore);
        this.cpu.autoStart();
    }

    /*
     * If the state was bad, offer to report it and then delete it.  Deleting may be moot, since invariably a new
     * state will be created on powerOff() before the next powerOn(), but it seems like good paranoia all the same.
     */
    if (this.fRestoreError) {
        this.powerReport(stateComputer);
        stateComputer.clear();
    }

    if (!fRepower && this.stateFailSafe) {
        this.stateFailSafe.clear();
        delete this.stateFailSafe;
    }

    this.nPowerChange = 0;
};

/**
 * checkPower()
 *
 * @this {Computer}
 * @return {boolean} true if the computer is fully powered, false otherwise
 */
Computer.prototype.checkPower = function()
{
    if (this.flags.fPowered) return true;

    var component = null, iComponent;
    var aComponents = Component.getComponents(this.id);
    for (iComponent = 0; iComponent < aComponents.length; iComponent++) {
        component = aComponents[iComponent];
        if (component !== this && !component.flags.fReady) break;
    }
    if (iComponent == aComponents.length) {
        for (iComponent = 0; iComponent < aComponents.length; iComponent++) {
            component = aComponents[iComponent];
            if (component !== this && !component.flags.fPowered) break;
        }
    }
    if (iComponent == aComponents.length) component = this;
    var s = "The " + component.type + " component (" + component.id + ") is not " + (!component.flags.fReady? "ready yet" + (component.fnReady? " (waiting for notification)" : "") : "powered yet") + ".";
    web.alertUser(s);
    return false;
};

/**
 * powerReport(stateComputer)
 *
 * @this {Computer}
 * @param {State} stateComputer
 */
Computer.prototype.powerReport = function(stateComputer)
{
    if (web.confirmUser("There may be a problem with your " + PC8080.APPNAME + " machine.\n\nTo help us diagnose it, click OK to send this " + PC8080.APPNAME + " machine state to http://" + SITEHOST + ".")) {
        web.sendReport(PC8080.APPNAME, PC8080.APPVERSION, this.url, this.getUserID(), ReportAPI.TYPE.BUG, stateComputer.toString());
    }
};

/**
 * powerOff(fSave, fShutdown)
 *
 * Power every component "down" and optionally save the machine state.
 *
 * There's one scenario that powerOff() isn't currently able to deal with very effectively: what to do when
 * the user switches away while it's still being restored, causing Disk getResource() calls to fail.  The
 * Disk component calls notify() when that happens -- see Disk.mount() -- but the FDC and HDC controllers don't
 * notify *us* of those problems, so Computer assumes that the restore was completely successful, when in fact
 * it was only partially successful.
 *
 * Then we immediately arrive here to perform a save, following that incomplete restore.  It would be wrong to
 * deal with that incomplete restore by setting fRestoreError, because we don't want to trigger a powerReport()
 * and the deletion of the previous state, because the state itself was presumably OK.  Unfortunately, the new
 * state we now save will no longer include manually mounted disk images whose remounts were interrupted, so future
 * restores won't remount them either.
 *
 * We could perhaps solve this by having the Disk component notify us in those situations, set a new flag
 * (fRestoreIncomplete?), and set fSave to false if that's ever set.  Be careful though: when fSave is false,
 * that means MORE than not saving; it also means deleting any previous state, which is NOT what you'd want to
 * do in a "fRestoreIncomplete" situation.  Also, we have to worry about Disk operations that fail for other reasons,
 * making sure those failures don't interfere with the save process in the same way.
 *
 * As it stands, the worst that happens is any manually mounted disk images might have to be manually remounted,
 * which doesn't seem like a huge problem.
 *
 * @this {Computer}
 * @param {boolean} [fSave] is true to request a saved state
 * @param {boolean} [fShutdown] is true if the machine is being shut down
 * @return {string|null} string representing the saved state (or null if error)
 */
Computer.prototype.powerOff = function(fSave, fShutdown)
{
    var data;
    var sState = "none";

    if (DEBUG && this.messageEnabled()) {
        this.printMessage("Computer.powerOff(" + (fSave ? "save" : "nosave") + (fShutdown ? ",shutdown" : "") + ")");
    }

    if (this.nPowerChange) {
        return null;
    }
    this.nPowerChange--;

    var stateComputer = new State(this, PC8080.APPVERSION);
    var stateValidate = new State(this, PC8080.APPVERSION, Computer.STATE_VALIDATE);

    var sTimestamp = usr.getTimestamp();
    stateValidate.set(Computer.STATE_TIMESTAMP, sTimestamp);
    stateComputer.set(Computer.STATE_TIMESTAMP, sTimestamp);
    stateComputer.set(Computer.STATE_VERSION, APPVERSION);
    stateComputer.set(Computer.STATE_HOSTURL, web.getHostURL());
    stateComputer.set(Computer.STATE_BROWSER, web.getUserAgent());

    /*
     * Always power the CPU "down" first, just to help insure it doesn't ask other components to do anything
     * after they're no longer ready.
     */
    if (this.cpu && this.cpu.powerDown) {
        if (fShutdown) this.cpu.stopCPU();
        data = this.cpu.powerDown(fSave, fShutdown);
        if (typeof data === "object") stateComputer.set(this.cpu.id, data);
        if (fShutdown) {
            this.cpu.flags.fPowered = false;
            if (data === false) sState = null;
        }
    }

    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (component.flags.fPowered) {
            if (component.powerDown) {
                data = component.powerDown(fSave, fShutdown);
                if (typeof data === "object") stateComputer.set(component.id, data);
            }
            if (fShutdown) {
                component.flags.fPowered = false;
                if (data === false) sState = null;
            }
        }
    }

    if (sState) {
        if (fShutdown) {
            var fClear = false;
            var fClearAll = false;
            if (fSave) {
                if (this.sUserID) {
                    this.saveServerState(this.sUserID, stateComputer.toString());
                }
                if (!stateValidate.store() || !stateComputer.store()) {
                    sState = null;
                    /*
                     * New behavior as of v1.13.2:  if it appears that localStorage is full, we blow it ALL away.
                     * Dedicated server-side storage is the only way we'll ever be able to reliably preserve a
                     * particular machine's state.  Historically, attempting to limp along with whatever localStorage
                     * is left just generates the same useless and annoying warnings over and over.
                     */
                    fClear = fClearAll = true;
                }
            }
            else {
                /*
                 * I used to ALWAYS clear (ie, delete) any associated computer state, but now I do this only if the
                 * current machine is "resumable", because there are situations where I have two configurations
                 * for the same machine -- one resumable and one not -- and I don't want the latter throwing away the
                 * state of the former.
                 *
                 * So this code is here now strictly for callers to delete the state of a "resumable" machine, not as
                 * some paranoid clean-up operation.
                 *
                 * An undocumented feature of this operation is that if your configuration uses the special 'resume="3"'
                 * value, and you click the "Reset" button, and then you click OK to reset the everything, this will
                 * actually reset EVERYTHING (ie, all localStorage for ALL configs will be reclaimed).
                 */
                if (this.resume) {
                    fClear = true;
                    fClearAll = (this.resume == Computer.RESUME_DELETE);
                }
            }
            if (fClear) {
                stateComputer.clear(fClearAll);
            }
        } else {
            sState = stateComputer.toString();
        }
    }

    if (fShutdown) {
        this.flags.fPowered = false;
        var controlPower = this.bindings["power"];
        if (controlPower) controlPower.textContent = "Power";
    }

    this.nPowerChange = 0;

    return sState;
};

/**
 * reset()
 *
 * Notify all (other) components with a reset() method that the Computer is being reset.
 *
 * NOTE: We'd like to reset the Bus first (due to the importance of the A20 line), but since we
 * allocated the Bus object ourselves, after all the other components were allocated, it ends
 * up near the end of Component's list of components.  Hence the special case for this.bus below.
 *
 * @this {Computer}
 */
Computer.prototype.reset = function()
{
    if (this.bus && this.bus.reset) {
        /*
         * TODO: Why does WebStorm think that this.bus.type is undefined? The base class (Component)
         * constructor defines it.
         */
        this.printMessage("Resetting " + this.bus.type);
        this.bus.reset();
    }
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (component !== this && component !== this.bus && component.reset) {
            this.printMessage("Resetting " + component.type);
            component.reset();
        }
    }
};

/**
 * start(ms, nCycles)
 *
 * Notify all (other) components with a start() method that the CPU has started.
 *
 * Note that we're called by runCPU(), which is why we exclude the CPU component,
 * as well as ourselves.
 *
 * @this {Computer}
 * @param {number} ms
 * @param {number} nCycles
 */
Computer.prototype.start = function(ms, nCycles)
{
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (component.type == "CPU" || component === this) continue;
        if (component.start) {
            component.start(ms, nCycles);
        }
    }
};

/**
 * stop(ms, nCycles)
 *
 * Notify all (other) components with a stop() method that the CPU has stopped.
 *
 * Note that we're called by runCPU(), which is why we exclude the CPU component,
 * as well as ourselves.
 *
 * @this {Computer}
 * @param {number} ms
 * @param {number} nCycles
 */
Computer.prototype.stop = function(ms, nCycles)
{
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (component.type == "CPU" || component === this) continue;
        if (component.stop) {
            component.stop(ms, nCycles);
        }
    }
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {Computer}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Computer.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    var computer = this;

    switch (sBinding) {
    case "power":
        this.bindings[sBinding] = control;
        control.onclick = function onClickPower() {
            computer.onPower();
        };
        return true;

    case "reset":
        this.bindings[sBinding] = control;
        control.onclick = function onClickReset() {
            computer.onReset();
        };
        return true;

    /*
     * Technically, this binding should now be called "saveState", to clearly distinguish it from
     * the "Save Machine" control that's normally bound to the savePC() function in save.js.  Saving
     * an entire machine includes everything needed to start/restore the machine; eg, the machine
     * XML configuration file(s) *and* the JSON-encoded machine state.
     */
    case "save":
        /*
         * Since this feature depends on the server supporting the PCjs User API (see userapi.js),
         * and since pcjs.org is no longer running a Node web server, we disable the feature for that
         * particular host.
         */
        if (str.endsWith(web.getHost(), "pcjs.org")) {
            if (DEBUG) this.log("Remote user API not available");
            /*
             * We could also simply hide the control; eg:
             *
             *      control.style.display = "none";
             *
             * but removing the control altogether seems better.
             */
            control.parentNode.removeChild(/** @type {Node} */ (control));
            return false;
        }
        this.bindings[sBinding] = control;
        control.onclick = function onClickSave() {
            var sUserID = computer.queryUserID(true);
            if (sUserID) {
                /*
                 * I modified the test to include a check for sStatePath so that I could save new states
                 * for machines with existing states; otherwise, I'd have no (easy) way of capturing and
                 * updating their state.  Making the machine (even temporarily) resumable would have been
                 * one work-around, but it's not appropriate for some machines, as their state is simply
                 * too large (for localStorage anyway, which is the default storage solution).
                 */
                var fSave = !!(computer.resume && !computer.sResumePath || computer.sStatePath);
                var sState = computer.powerOff(fSave);
                if (fSave) {
                    computer.saveServerState(sUserID, sState);
                } else {
                    computer.notice("Resume disabled, machine state not saved");
                }
            }
            /*
             * This seemed like a handy alternative, but it turned out to be a no-go, at least for large states:
             *
             *      var sState = computer.powerOff(true);
             *      if (sState) {
             *          sState = "data:text/json;charset=utf-8," + encodeURIComponent(sState);
             *          window.open(sState);
             *      }
             *
             * Perhaps if I embedded the data in a link on the current page instead; eg:
             *
             *      $('<a href="' + sState + '" download="state.json">Download</a>').appendTo('#container');
             */
        };
        return true;

    default:
        break;
    }
    return false;
};

/**
 * resetUserID()
 */
Computer.prototype.resetUserID = function()
{
    web.setLocalStorageItem(Computer.STATE_USERID, "");
    this.sUserID = null;
};

/**
 * queryUserID(fPrompt)
 *
 * @param {boolean} [fPrompt]
 * @returns {string|null|undefined}
 */
Computer.prototype.queryUserID = function(fPrompt)
{
    var sUserID = this.sUserID;
    if (!sUserID) {
        sUserID = web.getLocalStorageItem(Computer.STATE_USERID);
        if (sUserID !== undefined) {
            if (!sUserID && fPrompt) {
                /*
                 * NOTE: Warning the user here that "Save" operations are not currently supported by pcjs.org is
                 * merely a precaution, because ordinarily, setBinding() should have already determined if we are
                 * running from pcjs.org and disabled any "Save" button.
                 */
                sUserID = web.promptUser("Saving machine states on the pcjs.org server is currently unsupported.\n\nIf you're running your own server, enter your user ID below.");
                if (sUserID) {
                    sUserID = this.verifyUserID(sUserID);
                    if (!sUserID) this.notice("The user ID is invalid.");
                }
            }
        } else if (fPrompt) {
            this.notice("Browser local storage is not available");
        }
    }
    return sUserID;
};

/**
 * verifyUserID(sUserID)
 *
 * @this {Computer}
 * @param {string} sUserID
 * @return {string} validated user ID, or null if error
 */
Computer.prototype.verifyUserID = function(sUserID)
{
    this.sUserID = null;
    var fMessages = DEBUG && this.messageEnabled();
    if (fMessages) this.printMessage("verifyUserID(" + sUserID + ")");
    var sRequest = web.getHost() + UserAPI.ENDPOINT + '?' + UserAPI.QUERY.REQ + '=' + UserAPI.REQ.VERIFY + '&' + UserAPI.QUERY.USER + '=' + sUserID;
    var response = web.getResource(sRequest);
    var nErrorCode = response[0];
    var sResponse = response[1];
    if (!nErrorCode && sResponse) {
        try {
            response = eval("(" + sResponse + ")");
            if (response.code && response.code == UserAPI.CODE.OK) {
                web.setLocalStorageItem(Computer.STATE_USERID, response.data);
                if (fMessages) this.printMessage(Computer.STATE_USERID + " updated: " + response.data);
                this.sUserID = response.data;
            } else {
                if (fMessages) this.printMessage(response.code + ": " + response.data);
            }
        } catch (e) {
            Component.error(e.message + " (" + sResponse + ")");
        }
    } else {
        if (fMessages) this.printMessage("invalid response (error " + nErrorCode + ")");
    }
    return this.sUserID;
};

/**
 * getServerStatePath()
 *
 * @this {Computer}
 * @return {string|null} sStatePath (null if no localStorage or no USERID stored in localStorage)
 */
Computer.prototype.getServerStatePath = function()
{
    var sStatePath = null;
    if (this.sUserID) {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage(Computer.STATE_USERID + " for load: " + this.sUserID);
        }
        sStatePath = web.getHost() + UserAPI.ENDPOINT + '?' + UserAPI.QUERY.REQ + '=' + UserAPI.REQ.LOAD + '&' + UserAPI.QUERY.USER + '=' + this.sUserID + '&' + UserAPI.QUERY.STATE + '=' + State.key(this, PC8080.APPVERSION);
    } else {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage(Computer.STATE_USERID + " unavailable");
        }
    }
    return sStatePath;
};

/**
 * saveServerState(sUserID, sState)
 *
 * @param {string} sUserID
 * @param {string|null} sState
 */
Computer.prototype.saveServerState = function(sUserID, sState)
{
    /*
     * We must pass fSync == true, because (as I understand it) browsers will blow off any async
     * requests when a page is being closed.  Since our request is synchronous, storeServerState()
     * should also return a result, but there's not much we can do with it, since browsers ALSO
     * tend to blow off alerts() and the like when closing down.
     */
    if (sState) {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("size of server state: " + sState.length + " bytes");
        }
        var response = this.storeServerState(sUserID, sState, true);
        if (response && response[UserAPI.RES.CODE] == UserAPI.CODE.OK) {
            this.notice("Machine state saved to server");
        } else if (sState) {
            var sError = (response && response[UserAPI.RES.DATA]) || UserAPI.FAIL.BADSTORE;
            if (response[UserAPI.RES.CODE] == UserAPI.CODE.FAIL) {
                sError = "Error: " + sError;
            } else {
                sError = "Error " + response[UserAPI.RES.CODE] + ": " + sError;
            }
            this.notice(sError);
            this.resetUserID();
        }
    } else {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("no state to store");
        }
    }
};

/**
 * storeServerState(sUserID, sState, fSync)
 *
 * @this {Computer}
 * @param {string} sUserID
 * @param {string} sState
 * @param {boolean} [fSync] is true if we're powering down and should perform a synchronous request (default is async)
 * @return {*} server response if fSync is true and a response was received; otherwise null
 */
Computer.prototype.storeServerState = function(sUserID, sState, fSync)
{
    if (DEBUG && this.messageEnabled()) {
        this.printMessage(Computer.STATE_USERID + " for store: " + sUserID);
    }
    /*
     * TODO: Determine whether or not any browsers cancel our request if we're called during a browser "shutdown" event,
     * and whether or not it matters if we do an async request (currently, we're not, to try to ensure the request goes through).
     */
    var dataPost = {};
    dataPost[UserAPI.QUERY.REQ] = UserAPI.REQ.STORE;
    dataPost[UserAPI.QUERY.USER] = sUserID;
    dataPost[UserAPI.QUERY.STATE] = State.key(this, PC8080.APPVERSION);
    dataPost[UserAPI.QUERY.DATA] = sState;
    var sRequest = web.getHost() + UserAPI.ENDPOINT;
    if (!fSync) {
        web.getResource(sRequest, dataPost, true);
    } else {
        var response = web.getResource(sRequest, dataPost);
        var sResponse = response[0];
        if (response[1]) {
            if (sResponse) {
                var i = sResponse.indexOf('\n');
                if (i > 0) sResponse = sResponse.substr(0, i);
                if (!sResponse.indexOf("Error: ")) sResponse = sResponse.substr(7);
            }
            sResponse = '{"' + UserAPI.RES.CODE + '":' + response[1] + ',"' + UserAPI.RES.DATA + '":"' + sResponse + '"}';
        }
        if (DEBUG && this.messageEnabled()) this.printMessage(sResponse);
        return JSON.parse(sResponse);
    }
    return null;
};

/**
 * onPower()
 *
 * This handles UI requests to toggle the computer's power (eg, see the "power" button binding).
 *
 * @this {Computer}
 */
Computer.prototype.onPower = function()
{
    if (!this.nPowerChange) {
        if (!this.flags.fPowered) {
            this.wait(this.powerOn);
        } else {
            this.powerOff(false, true);
        }
    }
};

/**
 * onReset()
 *
 * This handles UI requests to reset the computer's state (eg, see the "reset" button binding).
 *
 * @this {Computer}
 */
Computer.prototype.onReset = function()
{
    /*
     * I'm going to start with the presumption that it makes little sense for an "unpowered" computer to be "reset";
     * ditto if the power state is currently being changed.
     */
    if (!this.flags.fPowered || this.nPowerChange) return;

    /*
     * If this is a "resumable" machine (and it's not using a predefined state), then we overload the reset
     * operation to offer an explicit "save or discard" option first.  This is currently the only UI we offer to
     * discard a machine's state, including any disk changes.  The traditional "reset" operation is still available
     * for non-resumable machines.
     *
     * TODO: Break this behavior out into a separate "discard" operation, in case the designer of the machine really
     * wants to clutter the UI with confusing options. ;-)
     */
    if (this.resume && !this.sResumePath) {
        /*
         * I used to bypass the prompt if this.resume == Computer.RESUME_AUTO, setting fSave to true automatically,
         * but that gives the user no means of resetting a resumable machine that contains errors in its resume state.
         */
        var fSave = (/* this.resume == Computer.RESUME_AUTO || */ web.confirmUser("Click OK to save changes to this " + PC8080.APPNAME + " machine.\n\nWARNING: If you CANCEL, all disk changes will be discarded."));
        this.powerOff(fSave, true);
        /*
         * Forcing the page to reload is an expedient option, but ugly. It's preferable to call powerOn()
         * and rely on all the components to reset themselves to their default state.  The components with
         * the greatest burden here are FDC and HDC, which must rely on the fReload flag to determine whether
         * or not to unload/reload all their original auto-mounted disk images.
         *
         * However, if we started with a predefined state (ie, sStatePath is set), we take this shortcut, because
         * we don't (yet) have code in place to gracefully reload the initial state (requires calling getResource()
         * again); alternatively, we could avoid throwing that state away, but it seems better to save the memory.
         *
         * TODO: Make this more graceful, so that we can stop using the reloadPage() sledgehammer.
         */
        if (!fSave && this.sStatePath) {
            web.reloadPage();
            return;
        }
        if (!fSave) this.fReload = true;
        this.powerOn(Computer.RESUME_NONE);
        this.fReload = false;
    } else {
        this.reset();
        if (this.cpu) this.cpu.autoStart();
    }
};

/**
 * getMachineComponent(sType, componentPrev)
 *
 * @this {Computer}
 * @param {string} sType
 * @param {Component|null} [componentPrev] of previously returned component, if any
 * @return {Component|null}
 */
Computer.prototype.getMachineComponent = function(sType, componentPrev)
{
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (componentPrev) {
            if (componentPrev == component) componentPrev = null;
            continue;
        }
        if (component.type == sType) return component;
    }
    return null;
};

/**
 * updateFocus(fScroll)
 *
 * NOTE: When soft keyboard buttons call us to return focus to the machine (and away from the button),
 * the scroll feature has annoying effect on iOS, so we no longer do it by default (fScroll must be true).
 *
 * @this {Computer}
 * @param {boolean} [fScroll]
 */
Computer.prototype.updateFocus = function(fScroll)
{
    if (this.aVideo.length) {
        /*
         * This seems to be recommended work-around to prevent the browser from scrolling the focused element
         * into view.  The CPU is not a visual component, so when the CPU wants to set focus, the primary intent
         * is to ensure that keyboard input is fielded properly.
         */
        var x = 0, y = 0;
        if (fScroll && window) {
            x = window.scrollX;
            y = window.scrollY;
        }
        /*
         * TODO: We need a mechanism to determine the "active" display, instead of hard-coding this to aVideo[0].
         */
        this.aVideo[0].setFocus();
        if (fScroll && window) {
            window.scrollTo(x, y);
        }
    }
};

/**
 * updateStatus(fForce)
 *
 * If any DOM controls were bound to the CPU, then we need to call its updateStatus() handler; if there are no
 * such bindings, then cpu.updateStatus() does nothing.
 *
 * Similarly, if there's a Panel, then we need to call its updateStatus() handler, in case it created its own canvas
 * and implemented its own register display (eg, dumpRegisters()); if not, then panel.updateStatus() also does nothing.
 *
 * In practice, there will *either* be a Panel with a custom canvas *or* a set of DOM controls bound to the CPU *or*
 * neither.  In theory, there could be BOTH, but that would be unusual.
 *
 * TODO: Consider alternate approaches to these largely register-oriented display updates.  Ordinarily, we like to
 * separate logic from presentation, and currently the CPUState contains both, since it's the component that intimately
 * knows the names, number, sizes, etc, of all the active registers.  The Panel component is the logical candidate,
 * but Panel is an optional component; generally, only machines that include Debugger also include Panel.
 *
 * @this {Computer}
 * @param {boolean} [fForce] (true will display registers even if the CPU is running and "live" registers are not enabled)
  */
Computer.prototype.updateStatus = function(fForce)
{
    /*
     * fForce is generally set to true whenever the CPU is transitioning to/from a running state, in which case
     * cpu.updateStatus() will definitely want to hide/show register contents; however, at other times, when the
     * CPU is running, constantly updating the DOM controls too frequently can adversely impact overall performance.
     *
     * So fForce serves as a hint to help cpu.updateStatus() make a more informed decision.  panel.updateStatus()
     * currently doesn't care, on the theory that canvas updates should be significantly faster than DOM updates,
     * but we still pass fForce on.
     */
    if (this.cpu) this.cpu.updateStatus(fForce);
    if (this.panel) this.panel.updateStatus(fForce);
};

/**
 * updateVideo(n)
 *
 * Any high-frequency updates should be performed here (avoid updating DOM elements).
 *
 * @this {Computer}
 * @param {number} n (where 0 <= n < VIDEO_UPDATES_PER_SECOND for a normal update, or -1 for a forced update)
 */
Computer.prototype.updateVideo = function(n)
{
    for (var i = 0; i < this.aVideo.length; i++) {
        this.aVideo[i].updateScreen(n);
    }
};

/**
 * Computer.init()
 *
 * For every machine represented by an HTML element of class "pcjs-machine", this function
 * locates the HTML element of class "computer", extracting the JSON-encoded parameters for the
 * Computer constructor from the element's "data-value" attribute, invoking the constructor to
 * create a Computer component, and then binding any associated HTML controls to the new component.
 */
Computer.init = function()
{
    /*
     * In non-COMPILED builds, embedMachine() may have set XMLVERSION.
     */
    if (!COMPILED && PC8080.XMLVERSION) PC8080.APPVERSION = PC8080.XMLVERSION;

    var aeMachines = Component.getElementsByClass(document, PC8080.APPCLASS + "-machine");

    for (var iMachine = 0; iMachine < aeMachines.length; iMachine++) {

        var eMachine = aeMachines[iMachine];
        var parmsMachine = Component.getComponentParms(eMachine);

        var aeComputers = Component.getElementsByClass(eMachine, PC8080.APPCLASS, "computer");

        for (var iComputer = 0; iComputer < aeComputers.length; iComputer++) {

            var eComputer = aeComputers[iComputer];
            var parmsComputer = Component.getComponentParms(eComputer);

            /*
             * We set fSuspended in the Computer constructor because we want to "power up" the
             * computer ourselves, after any/all bindings are in place.
             */
            var computer = new Computer(parmsComputer, parmsMachine, true);

            if (DEBUG && computer.messageEnabled()) {
                computer.printMessage("onInit(" + computer.flags.fPowered + ")");
            }

            /*
             * Bind any "power", "reset" and "save" buttons.  An "erase" button was also considered,
             * but "reset" now provides a way to force the machine to start from scratch again, so "erase"
             * may be redundant now.
             */
            Component.bindComponentControls(computer, eComputer, PC8080.APPCLASS);

            /*
             * Power on the computer, giving every component the opportunity to reset or restore itself.
             */
            if (computer.fAutoPower) computer.wait(computer.powerOn);
        }
    }
};

/**
 * Computer.show()
 *
 * When exit() is using an "onbeforeunload" handler, this "onpageshow" handler allows us to repower everything,
 * without either resetting or restoring.  We call powerOn() with a special resume value (RESUME_REPOWER) if the
 * computer is already marked as "ready", meaning the browser didn't change anything.  This "repower" process
 * should be very quick, essentially just marking all components as powered again (so that, for example, the Video
 * component will start drawing again) and firing the CPU up again.
 */
Computer.show = function()
{
    var aeComputers = Component.getElementsByClass(document, PC8080.APPCLASS, "computer");
    for (var iComputer = 0; iComputer < aeComputers.length; iComputer++) {
        var eComputer = aeComputers[iComputer];
        var parmsComputer = Component.getComponentParms(eComputer);
        var computer = /** @type {Computer} */ (Component.getComponentByType("Computer", parmsComputer['id']));
        if (computer) {

            if (DEBUG && computer.messageEnabled()) {
                computer.printMessage("onShow(" + computer.fInitialized + "," + computer.flags.fPowered + ")");
            }

            if (computer.fInitialized && !computer.flags.fPowered) {
                /**
                 * Repower the computer, notifying every component to continue running as-is.
                 */
                computer.powerOn(Computer.RESUME_REPOWER);
            }
        }
    }
};

/**
 * Computer.exit()
 *
 * The Computer is currently the only component that uses an "exit" handler, which web.onExit() defines as
 * either an "unload" or "onbeforeunload" handler.  This gives us the opportunity to save the machine state,
 * using our powerOff() function, before the page goes away.
 *
 * It's worth noting that "onbeforeunload" offers one nice feature when used instead of "onload": the entire
 * page (and therefore this entire application) is retained in its current state by the browser (well, some
 * browsers), so that if you go to a new URL, either by entering a new URL in the same window/tab, or by pressing
 * the FORWARD button, and then you press the BACK button, the page is immediately restored to its previous state.
 *
 * In fact, that's how some browsers operate whether you have an "onbeforeunload" handler or not; in other words,
 * an "onbeforeunload" handler doesn't change the page retention behavior of the browser.  By contrast, the mere
 * presence of an "onunload" handler generally causes a browser to throw the page away once the handler returns.
 *
 * However, in order to safely use "onbeforeunload", we must add yet another handler ("onpageshow") to repower
 * everything, without either resetting or restoring.  Hence, the Computer.show() function, which calls powerOn()
 * with a special resume value (RESUME_REPOWER) if the computer is already marked as "ready", meaning the browser
 * didn't change anything.  This "repower" process should be very quick, essentially just marking all components as
 * powered again (so that, for example, the Video component will start drawing again) and firing the CPU up again.
 *
 * Reportedly, some browsers (eg, Opera) don't support "onbeforeunload", in which case Component will have to use
 * "unload" instead.  But even when the page must be rebuilt from scratch, the combination of browser cache and
 * localStorage means the simulation should be restored and become operational almost immediately.
 */
Computer.exit = function()
{
    var aeComputers = Component.getElementsByClass(document, PC8080.APPCLASS, "computer");
    for (var iComputer = 0; iComputer < aeComputers.length; iComputer++) {
        var eComputer = aeComputers[iComputer];
        var parmsComputer = Component.getComponentParms(eComputer);
        var computer = /** @type {Computer} */ (Component.getComponentByType("Computer", parmsComputer['id']));
        if (computer) {

            if (DEBUG && computer.messageEnabled()) {
                computer.printMessage("onExit(" + computer.flags.fPowered + ")");
            }

            if (computer.flags.fPowered) {
                /**
                 * Power off the computer, giving every component an opportunity to save its state,
                 * but only if 'resume' has been set AND there is no valid resume path (because if a valid resume
                 * path exists, we'll always load our state from there, and not from whatever we save here).
                 */
                computer.powerOff(!!(computer.resume && !computer.sResumePath), true);
            }
        }
    }
};

/*
 * Initialize every Computer on the page.
 */
web.onInit(Computer.init);
web.onShow(Computer.show);
web.onExit(Computer.exit);


// ./modules/shared/lib/embed.js

/**
 * @fileoverview C1Pjs and PCjs embedding functionality.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Aug-28
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

/* global document: true, window: true, XSLTProcessor: false, APPNAME: false, APPVERSION: false, XMLVERSION: true, DEBUG: true */


/*
 * We now support asynchronous XML and XSL file loads; simply set fAsync (below) to true.
 *
 * NOTE: For that support to work, we have to keep track of the number of machines on the page
 * (ie, how many embedMachine() calls were issued), reduce the count as each machine XML file
 * is fully transformed into HTML, and when the count finally returns to zero, notify all the
 * machine component init() handlers.
 *
 * Also, to prevent those init() handlers from running prematurely, we must disable all page
 * notification events at the start of the embedding process (web.enablePageEvents(false)) and
 * re-enable them at the end (web.enablePageEvents(true)).
 */
var fAsync = true;
var cAsyncMachines = 0;

/**
 * loadXML(sFile, idMachine, sAppClass, sParms, fResolve, display, done)
 *
 * This is the preferred way to load all XML and XSL files. It uses getResource()
 * to load them as strings, which parseXML() can massage before parsing/transforming them.
 *
 * For example, since I've been unable to get the XSLT document() function to work inside any
 * XSL document loaded by JavaScript's XSLT processor, that has prevented me from dynamically
 * loading any XML machine file that uses the "ref" attribute to refer to and incorporate
 * another XML document.
 *
 * To solve that, I've added an fResolve parameter that tells parseXML() to fetch any
 * referenced documents ITSELF and insert them into the XML string prior to parsing, instead
 * of relying on the XSLT template to pull them in.  That fetching is handled by resolveXML(),
 * which iterates over the XML until all "refs" have been resolved (including any nested
 * references).
 *
 * Also, XSL files with a <!DOCTYPE [...]> cause MSIE's Microsoft.XMLDOM.loadXML() function
 * to choke, so I strip that out prior to parsing as well.
 *
 * TODO: Figure out why the XSLT document() function works great when the web browser loads an
 * XML file (and the associated XSL file) itself, but does not work when loading documents via
 * JavaScript XSLT support. Is it broken, is it a security issue, or am I just calling it wrong?
 *
 * @param {string} sXMLFile
 * @param {string|null|undefined} idMachine
 * @param {string|null|undefined} sAppClass
 * @param {string|null|undefined} sParms
 * @param {boolean} fResolve is true to resolve any "ref" attributes
 * @param {function(string)} display
 * @param {function(string,Object)} done (string contains the unparsed XML string data, and Object contains a parsed XML object)
 */
function loadXML(sXMLFile, idMachine, sAppClass, sParms, fResolve, display, done)
{
    var doneLoadXML = function(sURLName, sXML, nErrorCode) {
        if (nErrorCode) {
            if (!sXML) sXML = "unable to load " + sXMLFile + " (" + nErrorCode + ")";
            done(sXML, null);
            return;
        }
        parseXML(sXML, sXMLFile, idMachine, sAppClass, sParms, fResolve, display, done);
    };
    display("Loading " + sXMLFile + "...");
    web.getResource(sXMLFile, null, fAsync, doneLoadXML);
}

/**
 * parseXML(sXML, sXMLFile, idMachine, sAppClass, sParms, fResolve, display, done)
 *
 * Generates an XML document from an XML string. This function also provides a work-around for XSLT's
 * lack of support for the document() function (at least on some browsers), by replacing every reference
 * tag (ie, a tag with a "ref" attribute) with the contents of the referenced file.
 *
 * @param {string} sXML
 * @param {string|null} sXMLFile
 * @param {string|null|undefined} idMachine
 * @param {string|null|undefined} sAppClass
 * @param {string|null|undefined} sParms
 * @param {boolean} fResolve is true to resolve any "ref" attributes; default is false
 * @param {function(string)} display
 * @param {function(string,Object)} done (string contains the unparsed XML string data, and Object contains a parsed XML object)
 */
function parseXML(sXML, sXMLFile, idMachine, sAppClass, sParms, fResolve, display, done)
{
    var buildXML = function(sXML, sError) {
        if (sError) {
            done(sError, null);
            return;
        }
        if (idMachine) {

            /*
             * A more sensible place to record the machine XML would be embedMachine(), like we do for the
             * XSL file, but since we're about to modify the original machine XML, it's best to record it now.
             */
            Component.addMachineResource(idMachine, sXMLFile, sXML);

            var sURL = sXMLFile;
            if (sURL && sURL.indexOf('/') < 0 && window.location.pathname.slice(-1) == '/') {
                sURL = window.location.pathname + sURL;
            }
            /*
             * We embed the URL of the XML file both as a separate "xml" attribute for easy access from the
             * XSL file, and as part of the "parms" attribute for easy access from machines (see getMachineParm()).
             */
            if (!sParms) {
                sParms = '{';
            } else if (sParms.slice(-1) == '}') {
                sParms = sParms.slice(0, -1);
                if (sParms.length > 1) sParms += ',';
            } else {            // sParms must just be a "state" file, so encode it as a "state" property
                sParms = '{state:"' + sParms + '",';
            }
            sParms += 'url:"' + sURL + '"}';
            /*
             * Note that while we no longer generate a machine XML file with a "state" attribute (because it's
             * encoded inside the "parms" attribute), the XSL file must still cope with "state" attributes inside
             * other XML files; for example, manifest XML files like /apps/pc/1981/visicalc/manifest.xml contain
             * machine elements with "state" attributes that must still be passed down to the computer element
             * "the old fashioned way".
             *
             * Until/unless that changes, components.xsl cannot be simplified as much as I might have hoped.
             */
            if (typeof resources == 'object') sURL = null;      // turn off URL inclusion if we have embedded resources
            sXML = sXML.replace(/(<machine[^>]*\sid=)(['"]).*?\2/, "$1$2" + idMachine + "$2" + (sParms? " parms='" + sParms + "'" : "") + (sURL? ' url="' + sURL + '"' : ''));
        }

        if (!fResolve) {
            /*
             * I'm trying to switch to a shared components.xsl (at least for all PC-class machines),
             * but in the interim, that means hacking the XSL file on the fly to reflect the actual class.
             */
            sXML = sXML.replace(/(<xsl:variable name="APPCLASS">).*?(<\/xsl:variable>)/, "$1" + sAppClass + "$2");

            /*
             * Non-COMPILED kludge to replace the version number template in the XSL file (which we assume we're reading,
             * since fResolve is false) with whatever XMLVERSION we extracted from the XML file (see corresponding kludge below).
             */
            if (!COMPILED && XMLVERSION) {
                sXML = sXML.replace(/<xsl:variable name="APPVERSION">1.x.x<\/xsl:variable>/, '<xsl:variable name="APPVERSION">' + XMLVERSION + '</xsl:variable>');
            }
        }

        /*
         * If the resource we requested is not really an XML file (or the file didn't exist and the server simply returned
         * a message like "Cannot GET /devices/pc/machine/5150/cga/64kb/donkey/machine.xml"), we'd like to display a more
         * meaningful message, because the XML DOM parsers will blithely return a document that contains nothing useful; eg:
         *
         *      This page contains the following errors:error on line 1 at column 1:
         *      Document is empty Below is a rendering of the page up to the first error.
         *
         * Supposedly, the IE XML DOM parser will throw an exception, but I haven't tested that, and unless all other
         * browsers do that, that's not helpful.
         *
         * The best I can do at this stage (assuming web.getResource() didn't drop any error information on the floor)
         * is verify that the requested resource "looks like" valid XML (in other words, it begins with a '<').
         */
        var xmlDoc = null;
        if (sXML.charAt(0) == '<') {
            try {
                /*
                 * Another hack for MSIE, which fails to load XSL documents containing a <!DOCTYPE [...]> tag.
                 *
                 * This is also why the XSLTProcessor 'transformToFragment' method in Microsoft Edge silently failed,
                 * so I had pull this hack out of the "ActiveXObject" code.  And rather than add yet-another Microsoft
                 * browser check, I'm going to try doing this across the board, and hope that none of the other XSLT
                 * processors fail *without* the DOCTYPE tag.
                 */
                if (!fResolve) {
                    sXML = sXML.replace(/<!DOCTYPE(.|[\r\n])*]>\s*/g, "");
                }
                /*
                 * Beginning with Microsoft Edge and the corresponding release of Windows 10, all the
                 * 'ActiveXObject' crud has gone away; but of course, this code must remain in place if
                 * we want to continue supporting older Internet Explorer browsers (ie, back to IE9).
                 */
                /** @namespace window.ActiveXObject */
                if (window.ActiveXObject || 'ActiveXObject' in window) {        // second test is required for IE11 on Windows 8.1
                    xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc['loadXML'](sXML);
                } else {
                    /** @namespace window.DOMParser */
                    xmlDoc = (new window.DOMParser()).parseFromString(sXML, "text/xml");
                }
            } catch(e) {
                xmlDoc = null;
                sXML = e.message;
            }
        } else {
            sXML = "unrecognized XML: " + (sXML.length > 255? sXML.substr(0, 255) + "..." : sXML);
        }
        done(sXML, xmlDoc);
    };
    if (sXML) {
        if (PRIVATE) sXML = sXML.replace(/\/library.xml/, "/private/library.xml");
        if (fResolve) {
            resolveXML(sXML, display, buildXML);
            return;
        }
        buildXML(sXML, null);
        return;
    }
    done("no data" + (sXMLFile? " for file: " + sXMLFile : ""), null);
}

/**
 * resolveXML(sXML, display, done)
 *
 * Replaces every tag with a "ref" attribute with the contents of the corresponding file.
 *
 * TODO: Fix some of the limitations of this code, such as: 1) requiring the "ref" attribute
 * to appear as the tag's first attribute, 2) requiring the "ref" attribute to be double-quoted,
 * and 3) requiring the "ref" tag to be self-closing.
 *
 * @param {string} sXML
 * @param {function(string)} display
 * @param {function(string,(string|null))} done (the first string contains the resolved XML data, the second is for any error message)
 */
function resolveXML(sXML, display, done)
{
    var matchRef;
    var reRef = /<([a-z]+)\s+ref="(.*?)"(.*?)\/>/g;

    if ((matchRef = reRef.exec(sXML))) {

        var sRefFile = matchRef[2];

        var doneReadXML = function(sURLName, sXMLRef, nErrorCode) {
            if (nErrorCode || !sXMLRef) {
                done(sXML, "unable to resolve XML reference: " + matchRef[0] + " (" + nErrorCode + ")");
                return;
            }
            /*
             * If there are additional attributes in the "referring" XML tag, we want to insert them
             * into the "referred" XML tag; attributes that don't exist in the referred tag should be
             * appended, and attributes that DO exist should be overwritten.
             */
            var sRefAttrs = matchRef[3];
            if (sRefAttrs) {
                var aXMLRefTag = sXMLRef.match(new RegExp("<" + matchRef[1] + "[^>]*>"));
                if (aXMLRefTag) {
                    var sXMLNewTag = aXMLRefTag[0];
                    /*
                     * Iterate over all the attributes in the "referring" XML tag (sRefAttrs)
                     */
                    var matchAttr;
                    var reAttr = /( [a-z]+=)(['"])(.*?)\2/g;
                    while ((matchAttr = reAttr.exec(sRefAttrs))) {
                        if (sXMLNewTag.indexOf(matchAttr[1]) < 0) {
                            /*
                             * This is the append case
                             */
                            sXMLNewTag = sXMLNewTag.replace(">", matchAttr[0] + ">");
                        } else {
                            /*
                             * This is the overwrite case
                             */
                            sXMLNewTag = sXMLNewTag.replace(new RegExp(matchAttr[1] + "(['\"])(.*?)\\1"), matchAttr[0]);
                        }
                    }
                    if (aXMLRefTag[0] != sXMLNewTag) {
                        sXMLRef = sXMLRef.replace(aXMLRefTag[0], sXMLNewTag);
                    }
                } else {
                    done(sXML, "missing <" + matchRef[1] + "> in " + sRefFile);
                    return;
                }
            }

            /*
             * Apparently when a Windows Azure server delivers one of my XML files, it may modify the first line:
             *
             *      <?xml version="1.0" encoding="UTF-8"?>\n
             *
             * I didn't determine exactly what it was doing at this point (probably just changing the \n to \r\n),
             * but in any case, relaxing the following replace() solved it.
             */
            sXMLRef = sXMLRef.replace(/<\?xml[^>]*>[\r\n]*/, "");

            sXML = sXML.replace(matchRef[0], sXMLRef);

            resolveXML(sXML, display, done);
        };

        display("Loading " + sRefFile + "...");
        web.getResource(sRefFile, null, fAsync, doneReadXML);
        return;
    }
    done(sXML, null);
}

/**
 * embedMachine(sName, sVersion, idMachine, sXMLFile, sXSLFile, sParms)
 *
 * This allows to you embed a machine on a web page, by transforming the machine XML into HTML.
 *
 * @param {string} sName is the app name (eg, "PCjs")
 * @param {string} sVersion is the app version (eg, "1.15.7")
 * @param {string} idMachine
 * @param {string} sXMLFile
 * @param {string} sXSLFile
 * @param {string} [sParms]
 * @return {boolean} true if successful, false if error
 */
function embedMachine(sName, sVersion, idMachine, sXMLFile, sXSLFile, sParms)
{
    var eMachine, eWarning, fSuccess = true;

    cAsyncMachines++;
    Component.addMachine(idMachine);

    var doneMachine = function() {

        if (!--cAsyncMachines) {
            if (fAsync) web.enablePageEvents(true);
        }
    };

    var displayError = function(sError) {
        Component.log(sError);
        displayMessage("Error: " + sError);
        if (fSuccess) doneMachine();
        fSuccess = false;
    };

    var displayMessage = function(sMessage) {
        if (eWarning === undefined) {
            /*
             * Our MarkOut module (in convertMDMachineLinks()) creates machine containers that look like:
             *
             *      <div id="' + sMachineID + '" class="machine-placeholder"><p>Embedded PC</p><p class="machine-warning">...</p></div>
             *
             * with the "machine-warning" paragraph pre-populated with a warning message that the user will
             * see if nothing at all happens.  But hopefully, in the normal case (and especially the error case),
             * *something* will have happened.
             *
             * Note that it is the HTMLOut module (in processMachines()) that ultimately decides which scripts to
             * include and then generates the embedXXX() call.
             */
            var aeWarning = (eMachine && Component.getElementsByClass(eMachine, "machine-warning"));
            eWarning = (aeWarning && aeWarning[0]) || eMachine;
        }
        if (eWarning) eWarning.innerHTML = str.escapeHTML(sMessage);
    };

    try {
        eMachine = document.getElementById(idMachine);
        if (eMachine) {

            /*
             * If we have a 'css' resource, add it to the page first.
             */
            var css;
            if (typeof resources == "object" && (css = resources['css'])) {
                var head = document.head || document.getElementsByTagName('head')[0];
                var style = document.createElement('style');
                style.type = 'text/css';
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                head.appendChild(style);
            }

            var sAppClass = sName.toLowerCase();        // eg, "pcx86" or "c1pjs"
            if (!sXSLFile) {
                /*
                 * Now that PCjs is an open-source project, we can make the following test more flexible,
                 * and revert to the internal template if DEBUG *or* internal version (instead of *and*).
                 *
                 * Third-party sites that don't use the PCjs server will ALWAYS want to specify a fully-qualified
                 * path to the XSL file, unless they choose to mirror our folder structure.
                 */
                if (DEBUG || sVersion == "1.x.x") {
                    sXSLFile = "/modules/" + sAppClass + "/templates/components.xsl";
                } else {
                    sXSLFile = "/versions/" + sAppClass + "/" + sVersion + "/components.xsl";
                }
            }

            var processXML = function(sXML, xml) {
                if (!xml) {
                    displayError(sXML);
                    return;
                }

                /*
                 * Non-COMPILED kludge to extract the version number from the stylesheet path in the machine XML file;
                 * we don't need this code in COMPILED (non-DEBUG) releases, because APPVERSION is hard-coded into them.
                 */
                if (!COMPILED) {
                    var aMatch = sXML.match(/<\?xml-stylesheet[^>]* href=(['"])[^'"]*?\/([0-9.]*)\/([^'"]*)\1/);
                    if (aMatch) XMLVERSION = aMatch[2];
                }

                var transformXML = function(sXSL, xsl) {
                    if (!xsl) {
                        displayError(sXSL);
                        return;
                    }

                    /*
                     * Record the XSL file, in case someone wants to save the entire machine later.
                     */
                    Component.addMachineResource(idMachine, sXSLFile, sXSL);

                    /*
                     * The <machine> template in components.xsl now generates a "machine div" that makes
                     * the div we required the caller of embedMachine() to provide redundant, so instead
                     * of appending this fragment to the caller's node, we REPLACE the caller's node.
                     * This works only because because we ALSO inject the caller's "machine div" ID into
                     * the fragment's ID during parseXML().
                     *
                     *      eMachine.innerHTML = sFragment;
                     *
                     * Also, if the transform function fails, make sure you're using the appropriate
                     * "components.xsl" and not a "machine.xsl", because the latter will not produce valid
                     * embeddable HTML (and is the most common cause of failure at this final stage).
                     */
                    displayMessage("Processing " + sXMLFile + "...");

                    /*
                     * Beginning with Microsoft Edge and the corresponding release of Windows 10, all the
                     * 'ActiveXObject' crud has gone away; but of course, this code must remain in place if
                     * we want to continue supporting older Internet Explorer browsers (ie, back to IE9).
                     */
                    if (window.ActiveXObject || 'ActiveXObject' in window) {        // second test is required for IE11 on Windows 8.1
                        var sFragment = xml['transformNode'](xsl);
                        if (sFragment) {
                            eMachine.outerHTML = sFragment;
                            doneMachine();
                        } else {
                            displayError("transformNodeToObject failed");
                        }
                    }
                    else if (document.implementation && document.implementation.createDocument) {
                        var xsltProcessor = new XSLTProcessor();
                        xsltProcessor['importStylesheet'](xsl);
                        var eFragment = xsltProcessor['transformToFragment'](xml, document);
                        if (eFragment) {
                            /*
                             * This fails in Microsoft Edge...
                             *
                            var machine = eFragment.getElementById(idMachine);
                            if (!machine) {
                                displayError("machine generation failed: " + idMachine);
                            } else
                            */
                            if (eMachine.parentNode) {
                                eMachine.parentNode.replaceChild(eFragment, eMachine);
                                doneMachine();
                            } else {
                                /*
                                 * NOTE: This error can occur if our Node web server, when processing a folder with
                                 * both a manifest.xml with a machine.xml reference AND a README.md containing a
                                 * machine link, generates duplicate embedXXX() calls for the same machine; if the
                                 * first embedXXX() call finds its target, subsequent calls for the same target will
                                 * fail.
                                 *
                                 * Technically, such a folder is in a misconfigured state, but it happens, in part
                                 * because when we switched to the Jekyll web server, we had to add machine links to
                                 * all README.md files where we had previously relied on manifest.xml or machine.xml
                                 * processing.  This is because the Jekyll web server currently doesn't process XML
                                 * files, nor is support for that likely to be added any time soon; it was a nice
                                 * feature of the Node web server, but it's not clear that it's worth doing for Jekyll.
                                 */
                                displayError("invalid machine element: " + idMachine);
                            }
                        } else {
                            displayError("transformToFragment failed");
                        }
                    } else {
                        /*
                         * Perhaps I should have performed this test at the outset; on the other hand, I'm
                         * not aware of any browsers don't support one or both of the above XSLT transformation
                         * methods, so treat this as a bug.
                         */
                        displayError("unable to transform XML: unsupported browser");
                    }
                };
                loadXML(sXSLFile, null, sAppClass, null, false, displayMessage, transformXML);
            };

            if (sXMLFile.charAt(0) != '<') {
                loadXML(sXMLFile, idMachine, sAppClass, sParms, true, displayMessage, processXML);
            } else {
                parseXML(sXMLFile, null, idMachine, sAppClass, sParms, false, displayMessage, processXML);
            }
        } else {
            displayError("missing machine element: " + idMachine);
        }
    } catch(e) {
        displayError(e.message);
    }
    return fSuccess;
}

/**
 * embedC1P(idMachine, sXMLFile, sXSLFile)
 *
 * @param {string} idMachine
 * @param {string} sXMLFile
 * @param {string} sXSLFile
 * @return {boolean} true if successful, false if error
 */
function embedC1P(idMachine, sXMLFile, sXSLFile)
{
    if (fAsync) web.enablePageEvents(false);
    return embedMachine("C1Pjs", APPVERSION, idMachine, sXMLFile, sXSLFile);
}

/**
 * embedPCx86(idMachine, sXMLFile, sXSLFile, sParms)
 *
 * @param {string} idMachine
 * @param {string} sXMLFile
 * @param {string} sXSLFile
 * @param {string} [sParms]
 * @return {boolean} true if successful, false if error
 */
function embedPCx86(idMachine, sXMLFile, sXSLFile, sParms)
{
    if (fAsync) web.enablePageEvents(false);
    return embedMachine("PCx86", APPVERSION, idMachine, sXMLFile, sXSLFile, sParms);
}

/**
 * embedPC8080(idMachine, sXMLFile, sXSLFile, sParms)
 *
 * @param {string} idMachine
 * @param {string} sXMLFile
 * @param {string} sXSLFile
 * @param {string} [sParms]
 * @return {boolean} true if successful, false if error
 */
function embedPC8080(idMachine, sXMLFile, sXSLFile, sParms)
{
    if (fAsync) web.enablePageEvents(false);
    return embedMachine("PC8080", APPVERSION, idMachine, sXMLFile, sXSLFile, sParms);
}

/**
 * Prevent the Closure Compiler from renaming functions we want to export,
 * by adding them as (named) properties of a global object.
 */
if (APPNAME == "C1Pjs") {
    window['embedC1P']    = embedC1P;
}
if (APPNAME == "PCx86") {
    window['embedPC']     = embedPCx86;         // WARNING: embedPC() deprecated as of v1.23.0
    window['embedPCx86']  = embedPCx86;
}
if (APPNAME == "PC8080") {
    window['embedPC8080'] = embedPC8080;
}

window['enableEvents'] = web.enablePageEvents;
window['sendEvent']    = web.sendPageEvent;

// ./modules/shared/lib/save.js

/**
 * @fileoverview PCjs save functionality.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Feb-17
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

/* global window: true, APPVERSION: false, XMLVERSION: true, DEBUG: true */


/**
 * savePC(idMachine, sPCJSFile, callback)
 *
 * @param {string} idMachine
 * @param {string} sPCJSFile
 * @param {function(Object)} [callback]
 * @return {boolean} true if successful, false if error
 */
function savePC(idMachine, sPCJSFile, callback)
{
    var cmp = /** @type {Computer} */ (Component.getComponentByType("Computer", idMachine));
    var dbg = /** @type {Debugger} */ (Component.getComponentByType("Debugger", idMachine));
    if (cmp) {
        var sState = cmp.powerOff(true);
        var sParms = cmp.saveMachineParms();
        if (!sPCJSFile) {
            if (DEBUG) {
                sPCJSFile = "/tmp/pcjs/" + (XMLVERSION || APPVERSION) + "/pc.js"
            } else {
                sPCJSFile = "/versions/pcjs/" + (XMLVERSION || APPVERSION) + "/pc" + (dbg? "-dbg" : "") + ".js";
            }
        }
        if (callback && callback({ state: sState, parms: sParms })) return true;
        web.getResource(sPCJSFile, null, true, function(sURL, sResponse, nErrorCode) {
            downloadCSS(sURL, sResponse, nErrorCode, [idMachine, str.getBaseName(sPCJSFile, true), sParms, sState]);
        });
        return true;
    }
    web.alertUser("Unable to identify machine '" + idMachine + "'");
    return false;
}

/**
 * downloadCSS(sURL, sPCJS, nErrorCode, aMachineInfo)
 *
 * @param {string} sURL
 * @param {string} sPCJS
 * @param {number} nErrorCode
 * @param {Array} aMachineInfo ([0] = idMachine, [1] = sScript, [2] = sParms, [3] = sState)
 */
function downloadCSS(sURL, sPCJS, nErrorCode, aMachineInfo)
{
    if (!nErrorCode && sPCJS) {
        aMachineInfo.push(sPCJS);
        var res = Component.getMachineResources(aMachineInfo[0]);
        var sCSSFile = null;
        for (var sName in res) {
            if (str.endsWith(sName, "components.xsl")) {
                sCSSFile = sName.replace(".xsl", ".css");
                break;
            }
        }
        if (!sCSSFile) {
            /*
             * This is probably a bad idea (ie, allowing downloadPC() to proceed with our stylesheet)...
             */
            downloadPC(sURL, null, 0, aMachineInfo);
        } else {
            web.getResource(sCSSFile, null, true, function(sURL, sResponse, nErrorCode) {
                downloadPC(sURL, sResponse, nErrorCode, aMachineInfo);
            });
        }
        return;
    }
    web.alertUser("Error (" + nErrorCode + ") requesting " + sURL);
}

/**
 * downloadPC(sURL, sCSS, nErrorCode, aMachineInfo)
 *
 * @param {string} sURL
 * @param {string|null} sCSS
 * @param {number} nErrorCode
 * @param {Array} aMachineInfo ([0] = idMachine, [1] = sScript, [2] = sParms, [3] = sState, [4] = sPCJS)
 */
function downloadPC(sURL, sCSS, nErrorCode, aMachineInfo)
{
    var matchScript, sXMLFile, sXSLFile;
    var idMachine = aMachineInfo[0], sScript = aMachineInfo[1], sPCJS = aMachineInfo[4];

    /*
     * sPCJS is supposed to contain the entire PCjs script, which has been wrapped with:
     *
     *      (function(){...
     *
     * at the top and:
     *
     *      ...})();
     *
     * at the bottom, thanks to the following Closure Compiler option:
     *
     *      --output_wrapper "(function(){%output%})();"
     *
     * Immediately inside that wrapping, we want to embed all the specified machine's resources, using:
     *
     *      var resources = {"xml": "...", "xsl": "...", ...};
     *
     * Note that the "resources" variable has been added to our externs.js, to prevent it from being renamed
     * by the Closure Compiler.
     */
    matchScript = sPCJS.match(/^(\s*\(function\(\)\{)([\s\S]*)(}\)\(\);\s*)$/);
    if (!matchScript) {
        /*
         * If the match failed, we assume that a DEBUG (uncompiled) script is being used,
         * so we'll provide a fake match that should work with whatever script was provided.
         */
        if (DEBUG) {
            matchScript = [sPCJS, "", sPCJS, ""];
        } else {
            sPCJS = "";
        }
    }

    var resOld = Component.getMachineResources(idMachine), resNew = {};
    for (var sName in resOld) {
        var data = resOld[sName];
        var sExt = str.getExtension(sName);
        if (sExt == "xml") {
            /*
             * Look through this resource for <disk> entries whose paths do not appear as one of the
             * other machine resources, and remove those entries.
             */
            var matchDisk, reDisk = /[ \t]*<disk [^>]*path=(['"])(.*?)\1.*?<\/disk>\n?/g;
            while (matchDisk = reDisk.exec(resOld[sName])) {
                var path = matchDisk[2];
                if (path) {
                    if (resOld[path]) {
                        Component.log("recording disk: '" + path + "'");
                    } else {
                        data = data.replace(matchDisk[0], "");
                    }
                }
            }
            sXMLFile = sName = str.getBaseName(sName);
        }
        else if (sExt == "xsl") {
            sXSLFile = sName = str.getBaseName(sName);
        }
        Component.log("saving resource: '" + sName + "' (" + data.length + " bytes)");
        resNew[sName] = data;
    }

    if (sCSS) {
        resNew[sName = 'css'] = sCSS;
        Component.log("saving resource: '" + sName + "' (" + sCSS.length + " bytes)");
    }

    if (aMachineInfo[2]) {
        var sParms = resNew[sName = 'parms'] = aMachineInfo[2];
        Component.log("saving resource: '" + sName + "' (" + sParms.length + " bytes)");
    }

    if (aMachineInfo[3]) {
        var sState = resNew[sName = 'state'] = aMachineInfo[3];
        Component.log("saving resource: '" + sName + "' (" + sState.length + " bytes)");
    }

    if (sXMLFile && sXSLFile) {
        var sResources = JSON.stringify(resNew);

        sScript += ".js";
        sPCJS = matchScript[1] + "var resources=" + sResources + ";" + matchScript[2] + matchScript[3];
        Component.log("saving machine: '" + idMachine + "' (" + sPCJS.length + " bytes)");

        sPCJS = sPCJS.replace(/\u00A9/g, "&#xA9;");

        var sAlert = web.downloadFile(sPCJS, "javascript", false, sScript);

        sAlert += ', copy it to your web server as "' + sScript + '", and then add the following to your web page:\n\n';
        sAlert += '<div id="' + idMachine + '"></div>\n';
        sAlert += '...\n';
        sAlert += '<script type="text/javascript" src="' + sScript + '"></script>\n';
        sAlert += '<script type="text/javascript">embedPC("' + idMachine + '","' + sXMLFile + '","' + sXSLFile + '");</script>\n\n';
        sAlert += 'The machine should appear where the <div> is located.';
        web.alertUser(sAlert);
        return;
    }
    web.alertUser("Missing XML/XSL resources");
}

/**
 * Prevent the Closure Compiler from renaming functions we want to export, by adding them
 * as (named) properties of a global object.
 */
window['savePC'] = savePC;
