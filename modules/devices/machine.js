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

/**
 * @class {Machine}
 * @unrestricted
 */
class Machine extends Control {
    /**
     * Machine(idMachine, sConfig)
     *
     * Sample config:
     *
     *    {
     *      "clock": {
     *        "class": "Time",
     *        "cyclesPerSecond": 1600000
     *        "bindings": {
     *          "run": "runTI57",
     *          "print": "printTI57"
     *        }
     *      },
     *      "display": {
     *        "class": "LED",
     *        "type": 3,
     *        "width": 96,
     *        "height": 128,
     *        "cols": 12,
     *        "rows": 1,
     *        "bindings": {
     *          "screen": "screenTI57"
     *        }
     *      },
     *      "rom": {
     *        "class": "ROM",
     *        "wordSize": 13,
     *        "valueSize": 16,
     *        "valueTotal": 2048,
     *        "littleEndian": true,
     *        "file": "ti57le.bin",
     *        "reference": "",
     *        "values": [
     *        ]
     *      }
     *    }
     *
     * @this {Machine}
     * @param {string} idMachine (of both the machine AND the <div> to contain it)
     * @param {string} sConfig (JSON configuration for entire machine, including any static resources)
     */
    constructor(idMachine, sConfig)
    {
        super(idMachine);
        try {
            this.config = JSON.parse(sConfig);
            for (let idControl in this.config) {
                let config = this.config[idControl];
                let sClass = config['class'], control;
                switch(sClass) {
                case Machine.CLASS.LED:
                    control = new LED(idMachine, idControl, config);
                    break;
                case Machine.CLASS.ROM:
                    control = new ROM(idMachine, idControl, config);
                    break;
                case Machine.CLASS.TIME:
                    control = new Time(idMachine, idControl, config);
                    break;
                }
            }
        } catch(err) {
            let sError = err.message;
            let match = sError.match(/position ([0-9]+)/);
            if (match) {
                sError += " (" + sConfig.substr(+match[1], 40).replace(/\s+/g, ' ') + "...)";
            }
            this.println("error: " + sError);
        }
    }
}

Machine.CLASS = {
    LED:    "LED",
    ROM:    "ROM",
    TIME:   "Time"
};
