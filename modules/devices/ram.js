/**
 * @fileoverview Simulates RAM
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2019 Jeff Parsons
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
 * @typedef {Config} RAMConfig
 * @property {number} addr
 * @property {number} size
 */

/**
 * @class {RAM}
 * @unrestricted
 * @property {RAMConfig} config
 * @property {number} addr
 * @property {number} size
 */
class RAM extends Memory {
    /**
     * RAM(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "ram": {
     *        "class": "RAM",
     *        "addr": 8192,
     *        "size": 1024,
     *        "bus": "busMemory"
     *      }
     *
     * @this {RAM}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {RAMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        config['type'] = Memory.TYPE.READWRITE;
        super(idMachine, idDevice, config);

        let idBus = "bus";
        if (this.config[idBus]) idBus = this.config[idBus];
        this.bus = /** @type {Bus} */ (this.findDevice(idBus));
        if (!this.bus) {
            throw new Error(this.sprintf("unable to find bus '%s'", idBus));
        }
        this.bus.addBlocks(config['addr'], config['size'], config['type'], this);
    }

    /**
     * reset()
     *
     * @this {RAM}
     */
    reset()
    {
    }
}
