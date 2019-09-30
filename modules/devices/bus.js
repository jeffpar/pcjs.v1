/**
 * @fileoverview Manages address spaces for machines
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
 * @typedef {Config} BusConfig
 * @property {string} type ("static" or "dynamic"; default is "static")
 * @property {number} addrWidth (default is 16)
 * @property {number} dataWidth (default is 8)
 * @property {number} [blockSize] (default is 1024)
 */

/**
 * @class {Bus}
 * @unrestricted
 * @property {BusConfig} config
 * @property {number} type (one of the Bus.TYPE values, converted from the config['type'] string)
 * @property {number} addrWidth
 * @property {number} dataWidth
 * @property {number} addrTotal
 * @property {number} addrLimit
 * @property {number} blockSize
 * @property {number} blockTotal
 * @property {number} blockShift
 * @property {number} blockLimit
 * @property {Array.<Memory>} blocks
 * @property {Array} blocksBufferRead
 * @property {Array} blocksBufferWrite
 * @property {number} nTraps
 */
class Bus extends Device {
    /**
     * Bus(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "bus": {
     *        "class": "Bus",
     *        "addrWidth": 16,
     *        "dataWidth": 8,
     *        "blockSize": 1024,
     *        "type": "static"
     *      }
     *
     * @this {Bus}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {BusConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        this.type = config['type'] == "dynamic"? Bus.TYPE.DYNAMIC : Bus.TYPE.STATIC;
        this.addrWidth = config['addrWidth'] || 16;
        this.dataWidth = config['dataWidth'] || 8;
        this.dataDirty = Math.pow(2, this.dataWidth);
        this.dataLimit = this.dataDirty - 1;
        this.addrTotal = Math.pow(2, this.addrWidth);
        this.addrLimit = (this.addrTotal - 1)|0;
        this.blockSize = config['blockSize'] || 1024;
        if (this.blockSize > this.addrTotal) this.blockSize = this.addrTotal;
        this.blockTotal = (this.addrTotal / this.blockSize)|0;
        this.blockShift = Math.log2(this.blockSize)|0;
        this.blockLimit = (1 << this.blockShift) - 1;
        this.blocks = new Array(this.blockTotal);
        this.blocksBufferRead = new Array(this.blockTotal);
        this.blocksBufferWrite = new Array(this.blockTotal);
        this.nTraps = 0;
        this.addTraps(this.type);
        let block = new Memory(idMachine, idDevice + "[NONE]", {"size": this.blockSize, "width": this.dataWidth});
        for (let addr = 0; addr < this.addrTotal; addr += this.blockSize) {
            this.addBlocks(addr, this.blockSize, Memory.TYPE.NONE, block);
        }
    }

    /**
     * addBlocks(addr, size, type, block)
     *
     * Bus interface for other devices to add blocks at specific addresses.  It's an error to add blocks to
     * regions that already contain blocks (other than blocks with TYPE of NONE).  There is no attempt to clean
     * up that error (and there is no removeBlocks() function) because it's currently considered a configuration
     * error, but that will likely change as machines with fancier buses are added.
     *
     * @this {Bus}
     * @param {number} addr is the starting physical address of the request
     * @param {number} size of the request, in bytes
     * @param {number} type is one of the Memory.TYPE constants
     * @param {Memory} [block] (optional preallocated block that must implement the same Memory interfaces the Bus uses)
     * @return {boolean} (currently always true, since all errors are treated as configuration errors)
     */
    addBlocks(addr, size, type, block)
    {
        let addrNext = addr;
        let sizeLeft = size;
        let offset = 0;
        let iBlock = addrNext >>> this.blockShift;
        while (sizeLeft > 0 && iBlock < this.blocks.length) {
            let blockNew;
            let addrBlock = iBlock * this.blockSize;
            let sizeBlock = this.blockSize - (addrNext - addrBlock);
            if (sizeBlock > sizeLeft) sizeBlock = sizeLeft;
            let blockExisting = this.blocks[iBlock];
            /*
             * If addrNext does not equal addrBlock, or sizeBlock does not equal this.blockSize, then either
             * the current block doesn't start on a block boundary or the size is something other than a block;
             * while we might support such requests down the road, that is currently a configuration error.
             */
            if (addrNext != addrBlock || sizeBlock != this.blockSize) {
                throw new Error(this.sprintf("addBlocks(%#0x,%#0x): block boundary error", addrNext, sizeBlock));
            }
            /*
             * Make sure that no block exists at the specified address, or if so, make sure its type is NONE.
             */
            if (blockExisting && blockExisting.type != Memory.TYPE.NONE) {
                throw new Error(this.sprintf("addBlocks(%#0x,%#0x): block (%d) already exists", addrNext, sizeBlock, blockExisting.type));
            }
            /*
             * When no block is provided, we must allocate one that matches the specified type (and remaining size).
             */
            let idBlock = this.idDevice + '[' + this.toBase(addrNext, 16, this.addrWidth) + ']';
            if (!block) {
                blockNew = new Memory(this.idMachine, idBlock, {type, addr: addrNext, size: sizeBlock, width: this.dataWidth});
            } else {
                /*
                 * When a block is provided, make sure its size maches the default Bus block size, and use it if so.
                 */
                if (block['size'] == this.blockSize) {
                    blockNew = block;
                } else {
                    /*
                     * When a block of a different size is provided, make a new block, importing any values as needed.
                     */
                    let values;
                    if (block['values']) {
                        values = block['values'].slice(offset, offset + sizeBlock);
                        if (values.length != sizeBlock) {
                            throw new Error(this.sprintf("addBlocks(%#0x,%#0x): insufficient values (%d)", addrNext, sizeBlock, values.length));
                        }
                    }
                    blockNew = new Memory(this.idMachine, idBlock, {type, addr: addrNext, size: sizeBlock, width: this.dataWidth, values});
                }
            }
            this.blocks[iBlock] = blockNew;
            this.blocksBufferRead[iBlock] = blockNew.bufferRead;
            this.blocksBufferWrite[iBlock] = blockNew.bufferWrite;
            addrNext = addrBlock + this.blockSize;
            sizeLeft -= sizeBlock;
            offset += sizeBlock;
            iBlock++;
        }
        return true;
    }

    /**
     * cleanBlocks(addr, size)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {number} size
     * @return {boolean} true if all blocks were clean, false if dirty; all blocks are cleaned in the process
     */
    cleanBlocks(addr, size)
    {
        let clean = true;
        let iBlock = addr >>> this.blockShift;
        let sizeBlock = this.blockSize - (addr & this.blockLimit);
        while (size > 0 && iBlock < this.blocks.length) {
            if (this.blocks[iBlock].isDirty()) clean = false;
            size -= sizeBlock;
            sizeBlock = this.blockSize;
            iBlock++;
        }
        return clean;
    }

    /**
     * enumBlocks(types, func)
     *
     * This is used by the Debugger to enumerate all the blocks of certain types.
     *
     * @this {Bus}
     * @param {number} types
     * @param {function(Memory)} func
     * @return {number} (the number of blocks enumerated)
     */
    enumBlocks(types, func)
    {
        let cBlocks = 0;
        for (let iBlock = 0; iBlock < this.blocks.length; iBlock++) {
            let block = this.blocks[iBlock];
            if (!block || !(block.type & types)) continue;
            func(block);
            cBlocks++;
        }
        return cBlocks;
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {Bus}
     */
    onReset()
    {
        /*
         * The following logic isn't needed because Memory and Port objects are Devices as well,
         * so their onReset() handlers will be invoked automatically.
         *
         *      this.enumBlocks(Memory.TYPE.READWRITE_DIRTY, function(block) {
         *          if (block.onReset) block.onReset();
         *      });
         */
    }

    /**
     * onLoad(state)
     *
     * Automatically called by the Machine device if the machine's 'autoSave' property is true.
     *
     * @this {Bus}
     * @param {Array} state
     * @return {boolean}
     */
    onLoad(state)
    {
        return state && this.loadState(state)? true : false;
    }

    /**
     * onSave(state)
     *
     * Automatically called by the Machine device before all other devices have been powered down (eg, during
     * a page unload event).
     *
     * @this {Bus}
     * @param {Array} state
     */
    onSave(state)
    {
        this.saveState(state);
    }

    /**
     * loadState(state)
     *
     * @this {Bus}
     * @param {Array} state
     * @return {boolean}
     */
    loadState(state)
    {
        for (let iBlock = 0; iBlock < this.blocks.length; iBlock++) {
            let block = this.blocks[iBlock];
            if (block.type <= Memory.TYPE.READONLY) continue;
            if (block.loadState) {
                let stateBlock = state.shift();
                if (!block.loadState(stateBlock)) return false;
            }
        }
        return true;
    }

    /**
     * saveState(state)
     *
     * @this {Bus}
     * @param {Array} state
     */
    saveState(state)
    {
        for (let iBlock = 0; iBlock < this.blocks.length; iBlock++) {
            let block = this.blocks[iBlock];
            if (block.type <= Memory.TYPE.READONLY) continue;
            if (block.saveState) {
                let stateBlock = [];
                block.saveState(stateBlock);
                state.push(stateBlock);
            }
        }
    }

    /**
     * readDataBuffer(addr)
     *
     * @this {Bus}
     * @param {number} addr
     * @return {number}
     */
    readDataBuffer(addr)
    {
        return this.blocksBufferRead[addr >>> this.blockShift][addr & this.blockLimit] & this.dataLimit;
    }

    /**
     * writeDataBuffer(addr, value)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {number} value
     */
    writeDataBuffer(addr, value)
    {
        this.assert(!(value & ~this.dataLimit), "writeDataBuffer(%#0x,%#0x) exceeds data width", addr, value);
        this.blocksBufferWrite[addr >>> this.blockShift][addr & this.blockLimit] = value | this.dataDirty;
    }

    /**
     * readDataFunction(addr)
     *
     * @this {Bus}
     * @param {number} addr
     * @return {number}
     */
    readDataFunction(addr)
    {
        return this.blocks[addr >>> this.blockShift].readData(addr & this.blockLimit);
    }

    /**
     * writeDataFunction(addr, value)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {number} value
     */
    writeDataFunction(addr, value)
    {
        this.blocks[addr >>> this.blockShift].writeData(addr & this.blockLimit, value);
    }

    /**
     * addTraps(inc)
     *
     * We prefer that our readData() and writeData() functions access the corresponding buffers directly,
     * but if any traps are enabled, then we must revert to calling functions instead, which can perform the
     * necessary trap checks.
     *
     * @this {Bus}
     * @param {number} inc (0 to initialize, 1 or -1 otherwise)
     */
    addTraps(inc)
    {
        this.nTraps += inc;
        if (!this.nTraps) {
            this.readData = this.readDataBuffer;
            this.writeData = this.writeDataBuffer;
        }
        else {
            this.readData = this.readDataFunction;
            this.writeData = this.writeDataFunction;
        }
        this.assert(this.nTraps >= 0);
    }

    /**
     * trapRead(addr, func)
     *
     * I've decided to call the trap handler AFTER reading the value, so that we can pass the value
     * along with the address; for example, the Debugger might find that useful for its history buffer.
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function(number,number)} func (receives the address and the value read)
     * @return {boolean} true if trap successful, false if unsupported or already trapped by another function
     */
    trapRead(addr, func)
    {
        /*
         * Blocks like Memory.TYPE.NONE do not have a fixed address, because they are typically shared across
         * multiple regions, so we cannot currently support trapping any locations within such blocks.  That
         * could be resolved by always allocating unique blocks (which wastes space), or by including the
         * runtime addr in all block read/write function calls (which wastes time), so I'm simply punting the
         * feature for now.  Its importance depends on scenarios that require trapping accesses to nonexistent
         * memory locations.
         */
        let iBlock = addr >>> this.blockShift, block = this.blocks[iBlock];
        if (block.addr == undefined) return false;
        let readTrap = function(offset) {
            let value = block.readPrev(offset);
            block.readTrap(block.addr + offset, value);
            return value;
        };
        if (!block.nReadTraps) {
            block.nReadTraps = 1;
            block.readTrap = func;
            block.readPrev = block.readData;
            block.readData = readTrap;
            this.addTraps(1);
        } else if (block.readTrap == func) {
            block.nReadTraps++;
        } else {
            return false;
        }
        return true;
    }

    /**
     * trapWrite(addr, func)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function(number, number)} func (receives the address and the value to write)
     * @return {boolean} true if trap successful, false if unsupported already trapped by another function
     */
    trapWrite(addr, func)
    {
        /*
         * See trapRead() for an explanation of why blocks without a fixed address cannot currently be trapped.
         */
        let iBlock = addr >>> this.blockShift, block = this.blocks[iBlock];
        if (block.addr == undefined) return false;
        let writeTrap = function(offset, value) {
            block.writeTrap(block.addr + offset, value);
            block.writePrev(offset, value);
        };
        if (!block.nWriteTraps) {
            block.nWriteTraps = 1;
            block.writeTrap = func;
            block.writePrev = block.writeData;
            block.writeData = writeTrap;
            this.addTraps(1);
        } else if (block.writeTrap == func) {
            block.nWriteTraps++;
        } else {
            return false;
        }
        return true;
    }

    /**
     * untrapRead(addr, func)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function(number,number)} func
     * @return {boolean} true if untrap successful, false if no (or another) trap was in effect
     */
    untrapRead(addr, func)
    {
        let iBlock = addr >>> this.blockShift, block = this.blocks[iBlock];
        if (block.nReadTraps && block.readTrap == func) {
            if (!--block.nReadTraps) {
                block.readData = block.readPrev;
                block.readPrev = block.readTrap = undefined;
                this.addTraps(-1);
            }
            return true;
        }
        return false;
    }

    /**
     * untrapWrite(addr, func)
     *
     * @this {Bus}
     * @param {number} addr
     * @param {function(number, number)} func
     * @return {boolean} true if untrap successful, false if no (or another) trap was in effect
     */
    untrapWrite(addr, func)
    {
        let iBlock = addr >>> this.blockShift, block = this.blocks[iBlock];
        if (block.nWriteTraps && block.writeTrap == func) {
            if (!--block.nWriteTraps) {
                block.writeData = block.writePrev;
                block.writePrev = block.writeTrap = undefined;
                this.addTraps(-1);
            }
            return true;
        }
        return false;
    }
}

/*
 * A "dynamic" bus (eg, an I/O bus) is one where block accesses should always be performed via function (not buffer),
 * because there's "logic" on the other end, whereas a "static" bus can be accessed either way, via function or buffer.
 *
 * Also, when trapping is enabled on one or more blocks of a bus, all accesses must again be performed via function,
 * to ensure that the trap handler gets invoked.
 *
 * This is why it's important that TYPE.DYNAMIC be 1 (not 0), because we pass that value to addTraps() to effectively
 * force all blocks on a "dynamic" bus to use function calls.
 */
Bus.TYPE = {
    STATIC:     0,
    DYNAMIC:    1
};
