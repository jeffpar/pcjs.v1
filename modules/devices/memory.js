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
 * @property {Array} valuesRead
 * @property {Array} valuesWrite
 * @property {boolean} fDirty
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
        this.dataDirty = Math.pow(2, this.width);
        this.dataLimit = this.dataDirty - 1;
        this.buffer = this.dataView = null
        this.values = this.valuePairs = this.valueQuads = null;
        if (this.width == 8) {
            this.buffer = new ArrayBuffer(this.size);
            this.dataView = new DataView(this.buffer, 0, this.size);
            /*
             * If littleEndian is true, we can use valuePairs[] and valueQuads[] directly; well, we can use
             * them whenever the offset is a multiple of 1, 2 or 4, respectively.  Otherwise, we must fallback
             * to dv.getUint8()/dv.setUint8(), dv.getUint16()/dv.setUint16() and dv.getInt32()/dv.setInt32().
             */
            this.values = new Uint8Array(this.buffer, 0, this.size);
            this.valuePairs = new Uint16Array(this.buffer, 0, this.size >> 1);
            this.valueQuads = new Int32Array(this.buffer, 0, this.size >> 2);
        }
        this.initValues(config['values']);

        switch(this.type) {
        case Memory.TYPE.NONE:
            this.readData = this.readNone;
            this.writeData = this.writeNone;
            this.valuesRead = this.values;
            this.valuesWrite = new Array(this.size);
            break;
        case Memory.TYPE.READONLY:
            this.readData = this.readValue;
            this.writeData = this.writeNone;
            this.valuesRead = this.values;
            this.valuesWrite = new Array(this.size);
            break;
        case Memory.TYPE.READWRITE:
            this.readData = this.readValue;
            this.writeData = this.writeValue;
            this.valuesRead = this.valuesWrite = this.values;
            break;
        case Memory.TYPE.READWRITE_DIRTY:
            this.readData = this.readValueDirty;
            this.writeData = this.writeValueDirty;
            this.valuesRead = this.valuesWrite = this.values;
            break;
        default:
            this.assert(false, "unsupported memory type: %d", this.type);
            break;
        }
    }

    /**
     * initValues(values)
     *
     * @this {Memory}
     * @param {Array.<number>|undefined} values
     */
    initValues(values)
    {
        if (!this.values) {
            if (values) {
                this.assert(values.length == this.size);
                this.values = values;
            } else {
                this.values = new Array(this.size).fill(this.dataLimit);
            }
        } else {
            if (values) {
                this.assert(values.length == this.size);
                for (let i = 0; i < this.size; i++) {
                    this.assert(!(values[i] & ~this.dataLimit));
                    this.values[i] = values[i];
                }
            }
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
        if (this.type >= Memory.TYPE.READWRITE) this.values.fill(0);
    }

    /**
     * isDirty()
     *
     * This function used to scan the entire block for any dataDirty bits:
     *
     *      let dirty = false;
     *      for (let i = 0; i < this.size; i++) {
     *          if (this.values[i] & this.dataDirty) {
     *              this.values[i] &= this.dataLimit;
     *              dirty = true;
     *          }
     *      }
     *      return dirty;
     *
     * but we've reverted back to maintaining a separate flag (fDirty) for tracking dirty blocks.
     *
     * @this {Memory}
     * @return {boolean}
     */
    isDirty()
    {
        if (this.fDirty) {
            this.fDirty = false;
            return true;
        }
        return false;
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
        /*
         * A read of non-existent memory isn't fatal, but I'd still like to see it if it happens in a DEBUG build.
         */
        this.assert(false, "readNone(%#0x)", this.addr + offset);
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
     * This function used to mask a dirty bit embedded in the values:
     *
     *      return this.values[offset] & this.dataLimit;    // dataLimit mask clears dataDirty
     *
     * but we've reverted back to maintaining a separate flag (fDirty) for tracking dirty blocks.
     *
     * @this {Memory}
     * @param {number} offset
     * @return {number}
     */
    readValueDirty(offset)
    {
        return this.values[offset];
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
        /*
         * A write to non-existent (or read-only) memory isn't fatal, but I'd still like to see it if it happens in a DEBUG build.
         */
        this.assert(false, "writeNone(%#0x,%#0x)", this.addr + offset, value);
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
     * This function used to set a dirty bit embedded in the values:
     *
     *      this.values[offset] = value | this.dataDirty;
     *
     * but we've reverted back to maintaining a separate flag (fDirty) for tracking dirty blocks.
     *
     * @this {Memory}
     * @param {number} offset
     * @param {number} value
     */
    writeValueDirty(offset, value)
    {
        this.assert(!(value & ~this.dataLimit), "writeValueDirty(%#0x,%#0x) exceeds data width", this.addr + offset, value);
        this.values[offset] = value;
        this.fDirty = true;
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
            /*
             * Now that we create multiple references to the values array (eg, valuesRead, valuesWrite), we can
             * no longer simply set this.values to state.shift(), because that would destroy the original array and
             * and invalidate its references.
             */
            this.fDirty = state.shift();
            state.shift();      // formerly fDirtyEver, now unused
            this.initValues(this.decompress(state.shift(), this.size));
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
        state.push(this.fDirty);
        state.push(false);      // formerly fDirtyEver, now unused
        state.push(this.compress(this.values));
    }
}

/*
 * Memory block types use discrete bits so that enumBlocks() can be passed a set of combined types,
 * by OR'ing the desired types together.
 */
Memory.TYPE = {
    NONE:               0x01,
    READONLY:           0x02,
    READWRITE:          0x04,
    READWRITE_DIRTY:    0x08,
    /*
     * The rest are not discrete memory types, but rather sets of types that are handy for enumBlocks().
     */
    READABLE:           0x0E,
    WRITABLE:           0x0C
};
