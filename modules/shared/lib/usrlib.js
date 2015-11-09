/**
 *  @fileoverview Assorted helper functions
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
    // Component.assert(bit <= 32);
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
    // Component.assert(!(n & ~(bf.mask >>> bf.shift)));
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

if (NODE) module.exports = usr;
