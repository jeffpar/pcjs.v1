/**
 * @fileoverview Simulates the creation of a complete machine
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

/*
 * Instantiating a machine requires a config object that contains all the other required configs; eg:
 *
 *      {
 *        clock: {
 *          class: "Time",
 *          cyclesPerSecond: 1600000
 *          bindings: {
 *            run: "runTI57",
 *            print: "printTI57"
 *          }
 *        }
 *      }
 */

class Machine extends Control {
    /**
     * Machine(id, sConfig)
     *
     * @this {Machine}
     * @param {string} id (of both the machine AND the <div> to contain it)
     * @param {string} sConfig (JSON configuration for entire machine, including any static resources)
     */
    constructor(id, sConfig)
    {
        super(id);
        try {
            this.config = JSON.parse(sConfig);
        } catch(err) {
            let sError = err.message;
            let match = sError.match(/position ([0-9]+)/);
            if (match) {
                sError += " (" + sConfig.substr(+match[1], 40).replace(/\s+/g, ' ') + "...)";
            }
            this.println("error: " + sError);
        }
        this.setReady();
    }
}
