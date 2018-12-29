/**
 * @fileoverview Assorted helper functions
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a> (@jeffpar)
 * @copyright © 2012-2018 Jeff Parsons
 *
 * This file is part of PCjs, a computer emulation software project at <https://www.pcjs.org>.
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
 * <https://www.pcjs.org/modules/shared/lib/defines.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * @typedef {Object} BitField
 * @property {number} mask
 * @property {number} shift
 */

/**
 * @typedef {Object.<BitField>} BitFields
 */

class Usr {
    /**
     * binarySearch(a, v, fnCompare)
     *
     * @param {Array} a is an array
     * @param {number|string|Array|Object} v
     * @param {function((number|string|Array|Object), (number|string|Array|Object))} [fnCompare]
     * @return {number} the index of matching entry if non-negative, otherwise the index of the insertion point
     */
    static binarySearch(a, v, fnCompare)
    {
        let left = 0;
        let right = a.length;
        let found = 0;
        if (fnCompare === undefined) {
            fnCompare = function(a, b)
            {
                return a > b ? 1 : a < b ? -1 : 0;
            };
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
        return found ? left : ~left;
    }

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
    static binaryInsert(a, v, fnCompare)
    {
        let index = Usr.binarySearch(a, v, fnCompare);
        if (index < 0) {
            a.splice(-(index + 1), 0, v);
        }
    }

    /**
     * getTimestamp()
     *
     * @return {string} timestamp containing the current date and time ("yyyy-mm-dd hh:mm:ss")
     */
    static getTimestamp()
    {
        return Usr.formatDate("Y-m-d H:i:s");
    }

    /**
     * getMonthDays(nMonth, nYear)
     *
     * NOTE: If we're being called on behalf of the PCx86 RTC, its year is always truncated to two digits (mod 100),
     * so we have no idea what century the year 0 might refer to.  When using the normal leap-year formula, 0 fails
     * the mod 100 test but passes the mod 400 test, so as far as the RTC is concerned, every century year is a leap
     * year.  Since we're most likely dealing with the year 2000, that's fine, since 2000 was also a leap year.
     *
     * TODO: There IS a separate RTC CMOS byte that's supposed to be set to CMOS_ADDR.CENTURY_DATE; it's always BCD,
     * so theoretically it will contain values like 0x19 or 0x20 (for the 20th and 21st centuries, respectively), and
     * we could add that as another parameter to this function, to improve the accuracy, but that would go beyond what
     * a real RTC actually does.
     *
     * @param {number} nMonth (1-12)
     * @param {number} nYear (normally a 4-digit year, but it may also be mod 100)
     * @return {number} the maximum (1-based) day allowed for the specified month and year
     */
    static getMonthDays(nMonth, nYear)
    {
        let nDays = Usr.aMonthDays[nMonth - 1];
        if (nDays == 28) {
            if ((nYear % 4) === 0 && ((nYear % 100) || (nYear % 400) === 0)) {
                nDays++;
            }
        }
        return nDays;
    }

    /**
     * formatDate(format, date, fUTC)
     *
     * Supported identifiers in format include:
     *
     *      a:  lowercase ante meridiem and post meridiem (am or pm)
     *      d:  day of the month, 2 digits with leading zeros (01, 02, ..., 31)
     *      D:  3-letter day of the week ("Sun", "Mon", ..., "Sat")
     *      F:  month ("January", "February", ..., "December")
     *      g:  hour in 12-hour format, without leading zeros (1, 2, ..., 12)
     *      h:  hour in 24-hour format, without leading zeros (0, 1, ..., 23)
     *      H:  hour in 24-hour format, with leading zeros (00, 01, ..., 23)
     *      i:  minutes, with leading zeros (00, 01, ..., 59)
     *      j:  day of the month, without leading zeros (1, 2, ..., 31)
     *      l:  day of the week ("Sunday", "Monday", ..., "Saturday")
     *      m:  month, with leading zeros (01, 02, ..., 12)
     *      M:  3-letter month ("Jan", "Feb", ..., "Dec")
     *      n:  month, without leading zeros (1, 2, ..., 12)
     *      s:  seconds, with leading zeros (00, 01, ..., 59)
     *      y:  2-digit year (eg, 14)
     *      Y:  4-digit year (eg, 2014)
     *
     * For more inspiration, see: http://php.net/manual/en/function.date.php (of which we support ONLY a subset).
     *
     * NOTE: MDN documentation for JavaScript's Date constructor says:
     *
     *      Support for ISO 8601 formats differs in that date-only strings (e.g. "1970-01-01") are treated as UTC, not local.
     *
     * Unfortunately, Date objects don't record whether they were created with UTC or local times, so if you pass in
     * a date-only value, be sure to set fUTC to true, so that only UTC functions are used below, for consistency.
     *
     * @param {string} format (eg, "F j, Y", "Y-m-d H:i:s")
     * @param {Date|string|number} [date] (default is the current time)
     * @param {boolean} [fUTC] (default is false, for local time)
     * @return {string}
     */
    static formatDate(format, date, fUTC)
    {
        if (!date) {
            if (!fUTC) {
                date = new Date();
            } else {
                date = new Date(Date.now());
            }
        } else if (typeof date != "object") {
            if (typeof date == "string" && date.length <= 10) {
                if (fUTC === undefined) fUTC = true;
            }
            date = new Date(date);
        }
        let sDate = "";
        if (!isNaN(date.getTime())) {
            let iHour = fUTC? date.getUTCHours() : date.getHours();
            let iMinutes = fUTC? date.getUTCMinutes() : date.getMinutes();
            let iSeconds = fUTC? date.getUTCSeconds() : date.getSeconds();
            let iDayOfWeek = fUTC? date.getUTCDay() : date.getDay();
            let iDay = fUTC? date.getUTCDate() : date.getDate();
            let iMonth = (fUTC? date.getUTCMonth() : date.getMonth())+ 1;
            let iYear = fUTC? date.getUTCFullYear() : date.getFullYear();
            for (let i = 0; i < format.length; i++) {
                let ch;
                switch ((ch = format.charAt(i))) {
                case 'a':
                    sDate += (iHour < 12 ? "am" : "pm");
                    break;
                case 'd':
                    sDate += ('0' + iDay).slice(-2);
                    break;
                case 'D':
                    sDate += Usr.asDays[iDayOfWeek].substr(0, 3);
                    break;
                case 'F':
                    sDate += Usr.asMonths[iMonth - 1];
                    break;
                case 'g':
                    sDate += (!iHour ? 12 : (iHour > 12 ? iHour - 12 : iHour));
                    break;
                case 'h':
                    sDate += iHour;
                    break;
                case 'H':
                    sDate += ('0' + iHour).slice(-2);
                    break;
                case 'i':
                    sDate += ('0' + iMinutes).slice(-2);
                    break;
                case 'j':
                    sDate += iDay;
                    break;
                case 'l':
                    sDate += Usr.asDays[iDayOfWeek];
                    break;
                case 'm':
                    sDate += ('0' + iMonth).slice(-2);
                    break;
                case 'M':
                    sDate += Usr.asMonths[iMonth - 1].substr(0, 3);
                    break;
                case 'n':
                    sDate += iMonth;
                    break;
                case 's':
                    sDate += ('0' + iSeconds).slice(-2);
                    break;
                case 'y':
                    sDate += ("" + iYear).slice(-2);
                    break;
                case 'Y':
                    sDate += iYear;
                    break;
                default:
                    sDate += ch;
                    break;
                }
            }
        } else {
            sDate = "unknown";
        }
        return sDate;
    }

    /**
     * adjustDate(date, days)
     *
     * Although the setDate() method compensates for day-of-month values outside the current month:
     *
     *      > let d = new Date('11/4/2012');d
     *      2012-11-04T07:00:00.000Z
     *      > new Date(d.setDate(d.getDate() + 365))
     *      2014-11-04T08:00:00.000Z
     *
     * notice the discrepancy in the time-of-day.  Even if there is some technical reason (eg, a DayLight
     * Savings Time side-effect) why that answer is correct, it doesn't satisfy my goal of adjusting ONLY the
     * day, not the time-of-day.
     *
     * By comparison, the method below (multiplying the number of milliseconds in a day by the number of days)
     * works just fine, without any unexpected side-effects:
     *
     *      > let d = new Date('11/4/2012');d
     *      2012-11-04T07:00:00.000Z
     *      > new Date(d.getTime() + 365 * 86400000)
     *      2013-11-04T07:00:00.000Z
     *
     * @param {Date} date
     * @param {number} days (+/-)
     * @return {Date}
     */
    static adjustDate(date, days)
    {
        return new Date(date.getTime() + days * 86400000);
    }

    /**
     * defineBitFields(bfs)
     *
     * Prepares a bit field definition for use with getBitField() and setBitField(); eg:
     *
     *      let bfs = Usr.defineBitFields({num:20, count:8, btmod:1, type:3});
     *
     * The above defines a set of bit fields containing four fields: num (bits 0-19), count (bits 20-27), btmod (bit 28), and type (bits 29-31).
     *
     *      Usr.setBitField(bfs.num, n, 1);
     *
     * The above set bit field "bfs.num" in numeric variable "n" to the value 1.
     *
     * @param {Object} bfs
     * @return {BitFields}
     */
    static defineBitFields(bfs)
    {
        let bit = 0;
        for (let f in bfs) {
            let width = bfs[f];
            let mask = ((1 << width) - 1) << bit;
            bfs[f] = {mask: mask, shift: bit};
            bit += width;
        }
        return bfs;
    }

    /**
     * initBitFields(bfs, ...)
     *
     * @param {BitFields} bfs
     * @param {...number} var_args
     * @return {number} a value containing all supplied bit fields
     */
    static initBitFields(bfs, var_args)
    {
        let v = 0, i = 1;
        for (let f in bfs) {
            if (i >= arguments.length) break;
            v = Usr.setBitField(bfs[f], v, arguments[i++]);
        }
        return v;
    }

    /**
     * getBitField(bf, v)
     *
     * @param {BitField} bf
     * @param {number} v is a value containing bit fields
     * @return {number} the value of the bit field in v defined by bf
     */
    static getBitField(bf, v)
    {
        return (v & bf.mask) >> bf.shift;
    }

    /**
     * setBitField(bf, v, n)
     *
     * @param {BitField} bf
     * @param {number} v is a value containing bit fields
     * @param {number} n is a value to store in v in the bit field defined by bf
     * @return {number} updated v
     */
    static setBitField(bf, v, n)
    {
        return (v & ~bf.mask) | ((n << bf.shift) & bf.mask);
    }

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
    static indexOf(a, t, i)
    {
        if (Array.prototype.indexOf) {
            return a.indexOf(t, i);
        }
        i = i || 0;
        if (i < 0) i += a.length;
        if (i < 0) i = 0;
        for (let n = a.length; i < n; i++) {
            if (i in a && a[i] === t) return i;
        }
        return -1;
    }
}

Usr.asDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
Usr.asMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Usr.aMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * getTime()
 *
 * @return {number} the current time, in milliseconds
 */
Usr.getTime = Date.now || function() { return +new Date(); };

if (NODE) module.exports = Usr;
