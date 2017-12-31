/**
 * @fileoverview Converts octal constants to hex.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
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

var fs = require("fs");

try {
    var sText = fs.readFileSync(process.argv[2], "utf-8");
    var asLines = sText.split('\n');
    for (var iLine = 0; iLine < asLines.length; iLine++) {
        var sLine = asLines[iLine];
        var match, re = /(^|[^0-9a-z_-])(0[0-7]+)([^0-9a-z_]|$)/gi;
        var iComment = sLine.indexOf("//");
        while (match = re.exec(sLine)) {
            if (iComment >= 0 && match.index > iComment) break;
            var n = parseInt(match[2], 8);
            if (n < 0) {
                console.log("found negative octal value (" + match[2] + "), skipping");
                continue;
            }
            var cch = (n <= 255? 2 : (n <= 65535? 4 : 8));
            var sReplace = match[1] + "0x" + ("00000000" + n.toString(16).toUpperCase()).substr(-cch) + match[3] + " /*" + match[2] + "*/";
            sLine = sLine.substr(0, match.index) + sReplace + sLine.substr(match.index + match[0].length);
            re.lastIndex = match.index + sReplace.length;
            asLines[iLine] = sLine;
        }
    }
    sText = "";
    for (iLine = 0; iLine < asLines.length; iLine++) {
        if (sText) sText += '\n';
        sText += asLines[iLine];
    }
    console.log(sText);
} catch (err) {
    console.log("error: " + err.message);
}
