/**
 * @fileoverview My homage to MACRO-10: a work-alike assembler for the PDP-10
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2017
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

if (NODE) {
    var Str = require("../../shared/lib/strlib");
    var Web = require("../../shared/lib/weblib");
    var Debugger = require("../../shared/lib/debugger");
    var PDP10 = require("./defines");
    var DebuggerPDP10 = require("./debugger");
}

/**
 * @class Macro10
 */
class Macro10 {
    /**
     * Macro10(sURL, nAddr, dbg, done)
     *
     * The done() callback is called after the resource has been loaded and parsed, with an error code
     * indicating overall success or failure.  The caller must use other methods to obtain further results.
     *
     * The callback is passed three parameters:
     *
     *      done(macro10, sURL, nErrorCode)
     *
     * If nErrorCode is zero, the assembly process completed successfully.
     *
     * For access to basic services (eg, println()), we rely on the caller.  This is NOT an extension of
     * Component, so those services are NOT part of this class.
     *
     * @this {Macro10}
     * @param {string} sURL (the URL of the resource to be assembled)
     * @param {number|null} nAddr (the absolute address to assemble the code at, if any)
     * @param {DebuggerPDP10} dbg (used to provide services like println() to the Macro10 class)
     * @param {function(Macro10,string,number)} done
     */
    constructor(sURL, nAddr, dbg, done)
    {
        this.sURL = sURL;
        this.nAddr = nAddr;
        this.dbg = dbg;
        this.done = done;
        var macro10 = this;
        Web.getResource(sURL, null, true, function(sURL, sResource, nErrorCode) {
            if (!nErrorCode) {
                nErrorCode = macro10.parse(sURL, sResource);
            }
            macro10.done(macro10, sURL, nErrorCode);
        });
    }

    /**
     * parse(sURL, sResource)
     *
     * Begin the assembly process.
     *
     * @this {Macro10}
     * @param {string} sURL
     * @param {string} sResource
     * @return {number}
     */
    parse(sURL, sResource)
    {
        var match, re;
        var sText = sResource;
        if (Str.endsWith(sURL, ".html")) {
            /*
             * We want to parse ONLY text between <PRE>...</PRE> tags.
             */
            sText = "";
            re = /<pre>([\s\S]*?)<\/pre>/gi;
            while (match = re.exec(sResource)) {
                sText += match[1];
            }
        }
        var i;
        var asLines = sText.split(/\r?\n/);
        for (i = 0; i < asLines.length; i++) {
            //this.dbg.println(asLines[i]);
        }
        return 0;
    }
}
