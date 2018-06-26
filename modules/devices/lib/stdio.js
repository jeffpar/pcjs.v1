/**
 * @fileoverview Class with stdio-like functions
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
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
 * <https://www.pcjs.org/modules/devices/machine.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * @class {StdIO}
 * @unrestricted
 * @property {string} bufferPrint
 */
class StdIO {
    /**
     * StdIO()
     *
     * @this {StdIO}
     */
    constructor()
    {
        this.bufferPrint = "";
    }

    /**
     * getHost()
     *
     * This is like getHostName() but with the port number, if any.
     *
     * @this {StdIO}
     * @return {string}
     */
    getHost()
    {
        return (window? window.location.host : "localhost");
    }

    /**
     * getHostName()
     *
     * @this {StdIO}
     * @return {string}
     */
    getHostName()
    {
        return (window? window.location.hostname : "localhost");
    }

    /**
     * getHostOrigin()
     *
     * This could also be implemented with window.location.origin, but that wasn't originally available in all browsers.
     *
     * @this {StdIO}
     * @return {string}
     */
    getHostOrigin()
    {
        return (window? window.location.protocol + "//" + window.location.host : "localhost");
    }

    /**
     * getHostProtocol()
     *
     * @this {StdIO}
     * @return {string}
     */
    getHostProtocol()
    {
        return (window? window.location.protocol : "file:");
    }

    /**
     * getHostURL()
     *
     * @this {StdIO}
     * @return {string|null}
     */
    getHostURL()
    {
        return (window? window.location.href : null);
    }

    /**
     * getResource(sURL, done)
     *
     * Request the specified resource, and once the request is complete, notify done().
     *
     * done() is passed four parameters:
     *
     *      done(sURL, sResource, readyState, nErrorCode)
     *
     * readyState comes from the request's 'readyState' property, and the operation should not be considered complete
     * until readyState is 4.
     *
     * If nErrorCode is zero, sResource should contain the requested data; otherwise, an error occurred.
     *
     * @this {StdIO}
     * @param {string} sURL
     * @param {function(string,string,number,number)} done
     */
    getResource(sURL, done)
    {
        let nErrorCode = 0, sResource = null;

        if (this.getHost() == "pcjs:8088") {
            /*
             * The larger resources that I've put on archive.pcjs.org are assumed to also be available locally
             * whenever the hostname is "pcjs"; otherwise, use "localhost" when debugging locally.
             *
             * NOTE: http://archive.pcjs.org is currently redirected to https://s3-us-west-2.amazonaws.com/archive.pcjs.org
             */
            sURL = sURL.replace(/^(http:\/\/archive\.pcjs\.org|https:\/\/[a-z0-9-]+\.amazonaws\.com\/archive\.pcjs\.org)(\/.*)\/([^/]*)$/, "$2/archive/$3");
            sURL = sURL.replace(/^https:\/\/jeffpar\.github\.io\/(pcjs-[a-z]+|private-[a-z]+)\/(.*)$/, "/$1/$2");
        }

        let obj = this;
        let xmlHTTP = (window.XMLHttpRequest? new window.XMLHttpRequest() : new window.ActiveXObject("Microsoft.XMLHTTP"));
        xmlHTTP.onreadystatechange = function()
        {
            if (xmlHTTP.readyState !== 4) {
                done(sURL, sResource, xmlHTTP.readyState, nErrorCode);
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
                // if (MAXDEBUG) Web.log("xmlHTTP.onreadystatechange(" + sURL + "): returned " + sResource.length + " bytes");
            }
            else {
                nErrorCode = xmlHTTP.status || -1;
            }
            done(sURL, sResource, xmlHTTP.readyState, nErrorCode);
        };

        xmlHTTP.open("GET", sURL, true);
        xmlHTTP.send();
    }

    /**
     * hex(n)
     *
     * This is a helper function intended for use in a debugging console, allowing you to display
     * numbers as hex by evaluating the expression "this.hex(n)".
     *
     * @this {StdIO}
     * @param {number} n
     */
    hex(n)
    {
        return this.sprintf("%x", n);
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
                console.log(this.bufferPrint + s.substr(0, i));
                this.bufferPrint = "";
                s = s.substr(i + 1);
            }
        }
        this.bufferPrint += s;
    }

    /**
     * println(s)
     *
     * @this {StdIO}
     * @param {string} s
     */
    println(s)
    {
        this.print(s + '\n');
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
            let type = aParts[iPart+5];

            /*
             * Check for unrecognized types immediately, so we don't inadvertently pop any arguments.
             */
            if ("dfjcsXx".indexOf(type) < 0) {
                buffer += aParts[iPart+1] + aParts[iPart+2] + aParts[iPart+3] + aParts[iPart+4] + type;
                continue;
            }

            let arg = args[iArg++];
            let flags = aParts[iPart+1];
            let width = aParts[iPart+2];
            if (width == '*') {
                width = arg;
                arg = args[iArg++];
            } else {
                width = +width || 0;
            }
            let precision = aParts[iPart+3];
            precision = precision? +precision.substr(1) : -1;
            let prefix = aParts[iPart+4];
            let ach = null, s;

            switch(type) {
            case 'd':
                /*
                 * We could use "arg |= 0", but there may be some value to supporting integers > 32 bits.
                 *
                 * Also, unlike the 'X' and 'x' hexadecimal cases, there's no need to explicitly check for a string
                 * arguments, because Math.trunc() automatically coerces any string value to a (decimal) number.
                 */
                arg = Math.trunc(arg);
                /* falls through */

            case 'f':
                s = arg + "";
                if (precision > 0) {
                    width -= (precision + 1);
                }
                if (s.length < width) {
                    if (flags.indexOf('0') >= 0) {
                        if (arg < 0) width--;
                        s = ("0000000000" + Math.abs(arg)).slice(-width);
                        if (arg < 0) s = '-' + s;
                    } else {
                        s = ("          " + s).slice(-width);
                    }
                }
                if (precision > 0) {
                    arg = Math.round((arg - Math.trunc(arg)) * Math.pow(10, precision));
                    s += '.' + ("0000000000" + Math.abs(arg)).slice(-precision);
                }
                buffer += s;
                break;

            case 'j':
                /*
                 * 'j' is one of our non-standard extensions to the sprintf() interface; it signals that
                 * the caller is providing an Object that should be rendered as JSON.  If a width is included
                 * (eg, "%2j"), it's used as an indentation value; otherwise, no whitespace is added.
                 */
                buffer += JSON.stringify(arg, null, width || null);
                break;

            case 'c':
                arg = String.fromCharCode(arg);
                /* falls through */

            case 's':
                /*
                 * 's' includes some non-standard behavior: if the argument is not actually a string, we allow
                 * JavaScript to "coerce" it to a string, using its associated toString() method.
                 */
                if (typeof arg == "string") {
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

            case 'X':
                ach = StdIO.HexUpperCase;
                /* falls through */

            case 'x':
                if (!ach) ach = StdIO.HexLowerCase;
                s = "";
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
                do {
                    let d = arg & 0xf;
                    arg >>>= 4;
                    if (flags.indexOf('0') >= 0 || s == "" || d || arg) {
                        s = ach[d] + s;
                    } else if (width) {
                        s = ' ' + s;
                    }
                } while (--width > 0 || arg);
                buffer += s;
                break;

            default:
                /*
                 * For reference purposes, the standard ANSI C set of types is "dioxXucsfeEgGpn%"
                 */
                buffer += "(unimplemented printf type %" + type + ")";
                break;
            }
        }

        buffer += aParts[iPart];
        return buffer;
    }
}

/*
 * Handy global constants
 */
StdIO.HexLowerCase = "0123456789abcdef";
StdIO.HexUpperCase = "0123456789ABCDEF";
