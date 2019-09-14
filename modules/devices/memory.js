/**
 * @fileoverview Simulates different types of memory (eg, NONE, ROM, RAM)
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
 * @typedef {Config} MemoryConfig
 * @property {number} [addr]
 * @property {number} size
 * @property {number} [type]
 * @property {Array.<number>} [values]
 * @property {number} [offset]
 */

/**
 * @class {Memory}
 * @unrestricted
 * @property {number|undefined} addr
 * @property {number} size
 * @property {number} type
 * @property {Array.<number>} values
 * @property {number} offset
 * @property {boolean} dirty
 * @property {boolean} dirtyEver
 */
class Memory extends Device {
    /**
     * Memory(idMachine, idDevice, config)
     *
     * @this {Memory}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {MemoryConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        this.addr = config['addr'];
        this.size = config['size'];
        this.type = config['type'] || Memory.TYPE.NONE;
        this.values = config['values'] || new Array(this.size);
        this.offset = config['offset'] || 0;
        this.dirty = this.dirtyEver = false;

        switch(this.type) {
        case Memory.TYPE.NONE:
            this.readData = this.readNone;
            this.writeData = this.writeNone;
            break;
        case Memory.TYPE.ROM:
            this.readData = this.readValue;
            this.writeData = this.writeNone;
            break;
        case Memory.TYPE.RAM:
            this.readData = this.readValue;
            this.writeData = this.writeValue;
            break;
        }
    }

    /**
     * isDirty()
     *
     * @return {boolean}
     */
    isDirty()
    {
        if (this.dirty) {
            this.dirty = false;
            this.dirtyEver = true;
            return true;
        }
        return false;
    }

    /**
     * readNone(offset)
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number|undefined}
     */
    readNone(offset)
    {
        return undefined;
    }

    /**
     * readValue(offset)
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number|undefined}
     */
    readValue(offset)
    {
        return this.values[this.offset + offset];
    }

    /**
     * writeNone(offset, value)
     *
     * @this {Memory}
     * @param {number} offset
     * @param {number} value
     */
    writeNone(offset, value)
    {
    }

    /**
     * writeValue(offset, value)
     *
     * @this {Memory}
     * @param {number} offset
     * @param {number} value
     */
    writeValue(offset, value)
    {
        this.values[this.offset + offset] = value;
        this.dirty = true;
    }
}

Memory.TYPE = {
    NONE:       0,
    ROM:        1,
    RAM:        2
};
