/**
 * @fileoverview Simulates ROMs
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
 * @typedef {Object} ROMConfig
 * @property {string} class
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
     * @param {string} [idDevice]
     * @param {ROMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        this.addr = 0;
        this.data = config.values;
    }

    /**
     * setAddr(addr)
     *
     * Selects a word.
     *
     * @param {number} addr
     */
    setAddr(addr)
    {
        this.addr = addr;
    }

    /**
     * getData()
     *
     * Returns the selected word.
     *
     * @returns {number}
     */
    getData()
    {
        return this.data[this.addr];
    }

    /**
     * getString()
     *
     * Returns a string representation of the selected word.
     *
     * @returns {string}
     */
    getString()
    {
        let sOp = "???";
        let sOperand = "", v;
        let w = this.data[this.addr];
        if (w & 0x1000) {
            if (w & 0x0800) {
                sOp = "BR";
                if (w & 0x0400) {
                    sOp += "C";
                } else {
                    sOp += "NC";
                }
                v = (this.addr & 0x0400) | (w & 0x03FF);
            } else {
                sOp = "CALL";
                v = w & 0x07FF;
            }
            sOperand = this.sprintf("0x%04x", v);
        } else {

        }
        return this.sprintf("0x%04x: 0x%04x  %-8s%s", this.addr, w, sOp, sOperand);
    }
}
