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
 * @property {number} addrWidth
 * @property {number} dataWidth
 * @property {number} blockSize
 */

/**
 * @class {Bus}
 * @unrestricted
 * @property {BusConfig} config
 * @property {number} addrWidth
 * @property {number} dataWidth
 * @property {number} addrTotal
 * @property {number} addrMask
 * @property {number} blockSize
 * @property {number} blockShift
 * @property {number} blockMask
 * @property {number} blockTotal
 * @property {Array.<Memory>} blocks
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
     *        "blockSize": 1024
     *      }
     *
     * @this {Bus}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ROMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config, Bus.VERSION);

        this.addrWidth = config['addrWidth'] || 16;
        this.dataWidth = config['dataWidth'] || 8;
        this.addrTotal = Math.pow(2, this.addrWidth);
        this.addrMask = (this.addrTotal - 1)|0;
        this.blockSize = config['blockSize'] || 1024;
        this.blockShift = Math.log2(this.blockSize)|0;
        this.blockMask = (1 << this.blockShift) - 1;
        this.blockTotal = (this.addrTotal / this.blockSize)|0;
        this.blocks = new Array(this.blockTotal);
        let memory = new Memory(idMachine, idDevice + ".null", {"addr": undefined, "size": this.blockSize});
        for (let addr = 0; addr < this.addrTotal; addr += this.blockSize) {
            this.addBlocks(addr, this.blockSize, Memory.TYPE.NONE, memory);
        }
    }

    /**
     * addBlocks(addr, size, type, block)
     *
     * Bus interface for other devices to add blocks at specific addresses.
     *
     * @this {Bus}
     * @param {number} addr is the starting physical address of the request
     * @param {number} size of the request, in bytes
     * @param {number} type is one of the Memory.TYPE constants
     * @param {Memory} [block] (optional preallocated block that must implement the same Memory interfaces the Bus uses)
     */
    addBlocks(addr, size, type, block)
    {
        let addrNext = addr;
        let sizeLeft = size;
        let iBlock = addrNext >>> this.blockShift;
        while (sizeLeft > 0 && iBlock < this.blocks.length) {
            let addrBlock = iBlock * this.blockSize;
            let sizeBlock = this.blockSize - (addrNext - addrBlock);
            if (sizeBlock > sizeLeft) sizeBlock = sizeLeft;
            this.blocks[iBlock++] = block || new Memory(this.idMachine, this.idDevice + ".block" + iBlock, {type, addr: addrNext, size: sizeBlock});
            addrNext = addrBlock + this.blockSize;
            sizeLeft -= sizeBlock;
        }
    }

    /**
     * readWord(addr)
     *
     * @this {Bus}
     * @param {number} addr
     * @returns {number|undefined}
     */
    readWord(addr)
    {
        return this.blocks[(addr & this.addrMask) >>> this.blockShift].readWord(addr & this.blockMask);
    }
}

Bus.VERSION = +VERSION || 2.00;
