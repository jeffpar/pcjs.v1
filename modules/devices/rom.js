/**
 * @fileoverview Simulates ROM
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
 * <http://pcjs.org/modules/devices/machine.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * @typedef {Object} ROMConfig
 * @property {string} class
 * @property {Object} bindings
 * @property {number} wordSize
 * @property {number} valueSize
 * @property {number} valueTotal
 * @property {boolean} littleEndian
 * @property {string} file
 * @property {string} reference
 * @property {Array.<number>} values
 */

/**
 * @class {ROM}
 * @unrestricted
 * @property {ROMConfig} config
 * @property {Array.<number>} data
 * @property {number} addrMask
 */
class ROM extends Device {
    /**
     * ROM(idMachine, idDevice, config)
     *
     * Sample config:
     *
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
     *
     * @this {ROM}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ROMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, ROM.VERSION, config);

        // TODO: Determine why I get an inspection error if I use this.config instead of config....

        this.data = config['values'];

        /*
         * WARNING: This assumes that the data array length is a power-of-two (which we assert below).
         */
        this.addrMask = this.data.length - 1;
        this.assert(!((this.addrMask + 1) & this.addrMask));
    }

    /**
     * getData(addr)
     *
     * @param {number} addr
     * @returns {number|undefined}
     */
    getData(addr)
    {
        return this.data[addr];
    }
}

ROM.VERSION     = 1.02;
