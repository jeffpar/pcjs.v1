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
 * @property {number} [width]
 * @property {Array.<number>} [values]
 */

/**
 * @class {Memory}
 * @unrestricted
 * @property {number} [addr]
 * @property {number} size
 * @property {number} type
 * @property {number} width
 * @property {Array.<number>} values
 * @property {Array} bufferRead
 * @property {Array} bufferWrite
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
        this.width = config['width'] || 8;
        this.values = config['values'];
        this.dataDirty = Math.pow(2, this.width);
        this.dataLimit = this.dataDirty - 1;
        if (!this.values) this.values = new Array(this.size).fill(this.dataLimit);

        switch(this.type) {
        case Memory.TYPE.NONE:
            this.readData = this.readNone;
            this.writeData = this.writeNone;
            this.bufferRead = this.values;
            this.bufferWrite = new Array(this.size);
            break;
        case Memory.TYPE.READONLY:
            this.readData = this.readValue;
            this.writeData = this.writeNone;
            this.bufferRead = this.values;
            this.bufferWrite = new Array(this.size);
            break;
        case Memory.TYPE.READWRITE:
            this.readData = this.readValue;
            this.writeData = this.writeValue;
            this.bufferRead = this.bufferWrite = this.values;
            break;
        case Memory.TYPE.READWRITE_DIRTY:
            this.readData = this.readValueDirty;
            this.writeData = this.writeValueDirty;
            this.bufferRead = this.bufferWrite = this.values;
            break;
        }
    }

    /**
     * onReset()
     *
     * Called by the Bus device to provide notification of a reset event.
     *
     * NOTE: Machines probably don't (and shouldn't) depend on the initial memory contents being zero, but this
     * can't hurt, and if we decide to save memory blocks in a compressed format (eg, RLE), this will help them compress.
     *
     * @this {Memory}
     */
    onReset()
    {
        if (this.type == Memory.TYPE.READWRITE) this.values.fill(0);
    }

    /**
     * isDirty()
     *
     * The current approach to dirty buffer tracking is a trade-off: speeding up writes (by eliminating a separate
     * dirty boolean property that we had to set on every write) but slowing down isDirty(), since we now have to check
     * every value in the buffer for the dataDirty bit (and clear it).
     *
     * The good news is that isDirty() is only called for a handful of special blocks (eg, video frame buffers), which
     * must request a new memory type: READWRITE_DIRTY.
     *
     * @this {Memory}
     * @return {boolean}
     */
    isDirty()
    {
        let dirty = false;
        for (let i = 0; i < this.size; i++) {
            if (this.values[i] & this.dataDirty) {
                this.values[i] &= this.dataLimit;
                dirty = true;
            }
        }
        return dirty;
    }

    /**
     * readNone(offset)
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number}
     */
    readNone(offset)
    {
        return this.dataLimit;
    }

    /**
     * readValue(offset)
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number}
     */
    readValue(offset)
    {
        this.assert(!(this.values[offset] & ~this.dataLimit), "readValue(%#0x) exceeds data width: %#0x", this.addr + offset, this.values[offset]);
        return this.values[offset];
    }

    /**
     * readValueDirty(offset)
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number}
     */
    readValueDirty(offset)
    {
        return this.values[offset] & this.dataLimit;
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
        this.assert(!(value & ~this.dataLimit), "writeValue(%#0x,%#0x) exceeds data width", this.addr + offset, value);
        this.values[offset] = value;
    }

    /**
     * writeValueDirty(offset, value)
     *
     * @this {Memory}
     * @param {number} offset
     * @param {number} value
     */
    writeValueDirty(offset, value)
    {
        this.assert(!(value & ~this.dataLimit), "writeValueDirty(%#0x,%#0x) exceeds data width", this.addr + offset, value);
        this.values[offset] = value | this.dataDirty;
    }

    /**
     * loadState(state)
     *
     * @this {Memory}
     * @param {Array} state
     * @return {boolean}
     */
    loadState(state)
    {
        let idDevice = state.shift();
        if (this.idDevice == idDevice) {
            if (state.length == 3) {
                /*
                 * Originally, I was saving 3 pieces of state after idDevice:
                 *
                 *      dirty (boolean)
                 *      dirtyEver (boolean)
                 *      values (Array)
                 *
                 * but I've decided to eliminate the separate dirty boolean flags on blocks and track dirtiness
                 * another way (with a special dataDirty bit outside the data width).  So if we have an older state,
                 * just throw away those two booleans.
                 */
                state.shift();
                state.shift();
            }
            /*
             * Now that we create multiple references to the values array (eg, bufferRead, bufferWrite), we can
             * no longer simply set this.values to state.shift(), because that would destroy the original array and
             * and invalidate its references.
             */
            let values = state.shift();
            for (let i = 0; i < this.size; i++) this.values[i] = values[i];
            return true;
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * @this {Memory}
     * @param {Array} state
     */
    saveState(state)
    {
        state.push(this.idDevice);
        state.push(this.values);
    }
}

/*
 * The following bit definition rules apply:
 *
 *      READABLE memory types have bit 0 set
 *      WRITABLE memory types have bit 1 set
 *      WRITABLE memory types with dirty tracking have bit 2 set
 *
 * Be aware of this when you're calling enumBlocks(), because it uses a "types" mask.
 */
Memory.TYPE = {
    NONE:               0x00,
    READONLY:           0x01,
    READWRITE:          0x03,
    READWRITE_DIRTY:    0x07
};
