/**
 * @fileoverview This file tests raw floating point access using typed arrays.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2014-Aug-20
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of PCjs, which is part of the JavaScript Machines Project (aka JSMachines)
 * at <http://jsmachines.net/> and <http://pcjs.org/>.
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
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

try {
    /*
     * If Node is running us, this will succeed, and we'll have a print()
     * function (an alias for console.log).  If JSC is running us instead,
     * then this will fail (there is neither a global NOR a console object),
     * but that's OK, because print() is a built-in function.
     *
     * TODO: Find a cleaner way of doing this, and while you're at it, alias
     * Node's process.argv to JSC's "arguments" array, and Node's process.exit()
     * to JSC's quit().
     *
     * UPDATE: Node *must* be used to run this test, because JSC's support for
     * typed arrays is incomplete.
     */
    var print = console.log;
} catch(err) {}

function toHex(v, len) {
    var s = "00000000" + v.toString(16);
    return "0x" + s.slice(s.length - (!len? 8 : (len < 8? len : 8))).toUpperCase();
}

var f = 3.4;

var af = new Float64Array(1);
af.set([f]);                        // the optional offset defaults to zero
var dv = new DataView(af.buffer);
var dw1 = dv.getUint32(0);
var dw2 = dv.getUint32(4);

print(f + " = " + toHex(dw1) + "," + toHex(dw2));
