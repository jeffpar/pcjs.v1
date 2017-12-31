/**
 * @fileoverview Process-related helper functions
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

class Proc {
    /**
     * getArgs()
     *
     * Processes command-line arguments.  Arguments may be introduced by either
     * a double-hyphen (--) or a long dash (—), and argument values, if any, must be
     * separated by an "=" without any intervening whitespace.  Arguments without
     * an explicit value default to true, and any argument appearing more than once
     * is automatically converted to an Array.
     *
     * Single-hyphen (-) arguments are allowed as well; they are treated as a series
     * of single-character arguments, each set to true, and any of these arguments
     * appearing more than once is discarded.
     *
     * @return {{argc:number, argv:{}}}
     */
    static getArgs()
    {
        var argc = 0;
        var argv = {};
        for (var i = 2; i < process.argv.length; i++) {
            var j, sSep;
            var sArg = process.argv[i];
            if (!sArg.indexOf(sSep = "--") || !sArg.indexOf(sSep = "—")) {
                sArg = sArg.substr(sSep.length);
                var sValue = true;
                j = sArg.indexOf("=");
                if (j > 0) {
                    sValue = sArg.substr(j + 1);
                    sArg = sArg.substr(0, j);
                    sValue = (sValue == "true") ? true : ((sValue == "false") ? false : sValue);
                }
                if (argv[sArg] === undefined) {
                    argc++;
                    argv[sArg] = sValue;
                } else {
                    // console.log("too many '" + sArg + "' arguments");
                    if (typeof argv[sArg] == "string") {
                        argv[sArg] = [argv[sArg]];
                    }
                    argv[sArg].push(sValue);
                }
            } else if (!sArg.indexOf("-")) {
                for (j = 1; j < sArg.length; j++) {
                    var ch = sArg.charAt(j);
                    if (argv[ch] === undefined) {
                        argv[ch] = true;
                        argc++;
                    }
                }
            }
        }
        return {argc: argc, argv: argv};
    }
}

if (NODE) module.exports = Proc;
