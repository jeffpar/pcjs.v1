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
 * @typedef {Config} ROMConfig
 * @property {string} class
 * @property {Object} [bindings]
 * @property {number} [version]
 * @property {Array.<string>} [overrides]
 * @property {number} wordSize
 * @property {number} valueSize
 * @property {number} valueTotal
 * @property {boolean} littleEndian
 * @property {string} file
 * @property {string} reference
 * @property {string} chipID
 * @property {number} [revision]
 * @property {string} [colorROM]
 * @property {string} [backgroundColorROM]
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
     *        "chipID": "TMC1501NC DI 7741",
     *        "revision": "0",
     *        "bindings": {
     *          "array": "romArrayTI57",
     *          "cellDesc": "romCellTI57"
     *        },
     *        "overrides": ["colorROM","backgroundColorROM"],
     *        "values": [
     *          ...
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

        this.data = config['values'];

        /*
         * This addrMask calculation assumes that the data array length is a power-of-two (which we assert).
         */
        this.addrMask = this.data.length - 1;
        this.assert(!((this.addrMask + 1) & this.addrMask));

        /*
         * If an "array" binding has been supplied, then create an LED array sufficiently large to represent the
         * entire ROM.  If the power-of-two is odd, then we will favor a slightly wider array over a taller one,
         * by virtue of using Math.ceil() for cols and Math.floor() for rows.
         */
        if (this.bindings[ROM.BINDING.ARRAY]) {
            let rom = this;
            let addrLines = Math.log2(this.data.length) / 2;
            this.cols = Math.pow(2, Math.ceil(addrLines));
            this.rows = Math.pow(2, Math.floor(addrLines));
            let configLEDs = {
                "class":            "LED",
                "bindings":         {"container": this.getBindingID(ROM.BINDING.ARRAY)},
                "type":             LED.TYPE.ROUND,
                "cols":             this.cols,
                "rows":             this.rows,
                "color":            this.getDefault('colorROM', "green"),
                "backgroundColor":  this.getDefault('backgroundColorROM', "black"),
                "persistent":       true
            };
            this.ledArray = new LED(idMachine, idDevice + "LEDs", configLEDs);
            this.clearArray();
            let configInput = {
                "class":        "Input",
                "location":     [0, 0, this.ledArray.widthView, this.ledArray.heightView, this.cols, this.rows],
                "bindings":     {"surface": this.getBindingID(ROM.BINDING.ARRAY)}
            };
            this.ledInput = new Input(idMachine, idDevice + "Input", configInput);
            this.sCellDesc = this.getBindingText(ROM.BINDING.CELLDESC);
            this.ledInput.addHover(function onROMHover(col, row) {
                if (rom.chip) {
                    let sDesc = rom.sCellDesc;
                    if (col >= 0 && row >= 0) {
                        let addr = row * rom.cols + col;
                        this.assert(addr >= 0 && addr < rom.data.length);
                        let opCode = rom.data[addr];
                        sDesc = rom.chip.disassemble(opCode, addr);
                    }
                    rom.setBindingText(ROM.BINDING.CELLDESC, sDesc);
                }
            });
        }
    }

    /**
     * clearArray()
     *
     * clearBuffer(true) performs a combination of clearBuffer() and drawBuffer().
     *
     * @this {ROM}
     */
    clearArray()
    {
        if (this.ledArray) this.ledArray.clearBuffer(true);
    }

    /**
     * drawArray()
     *
     * This performs a simple drawBuffer(); intended for synchronous updates (eg, step operations);
     * otherwise, you should allow the LED object's async animation handler take care of drawing updates.
     *
     * @this {ROM}
     */
    drawArray()
    {
        if (this.ledArray) this.ledArray.drawBuffer();
    }

    /**
     * getData(addr, fInternal)
     *
     * Set fInternal to true if an internal caller (eg, the disassembler) is accessing the ROM, to avoid touching
     * the ledArray.
     *
     * @this {ROM}
     * @param {number} addr
     * @param {boolean} [fInternal]
     * @returns {number|undefined}
     */
    getData(addr, fInternal)
    {
        if (this.ledArray && !fInternal) {
            this.ledArray.setLEDState(addr % this.cols, (addr / this.cols)|0, LED.STATE.ON, LED.FLAGS.MODIFIED);
        }
        return this.data[addr];
    }

    /**
     * loadState(state)
     *
     * If any saved values don't match (presumably overridden), abandon the given state and return false.
     * 
     * @this {ROM}
     * @param {Array} state
     * @returns {boolean}
     */
    loadState(state)
    {
        let buffer = state.shift();
        if (buffer && this.ledArray) {
            this.assert(this.ledArray.buffer.length == buffer.length);
            if (this.ledArray.buffer.length == buffer.length) {
                this.ledArray.buffer = buffer;
                this.ledArray.drawBuffer(true);
                return true;
            }
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * @this {ROM}
     * @param {Array} state
     */
    saveState(state)
    {
        if (this.ledArray) {
            state.push(this.ledArray.buffer);
        }
    }

    /**
     * setChip()
     *
     * @this {ROM}
     * @param {Chip} chip
     */
    setChip(chip)
    {
        this.chip = chip;
    }
}

ROM.BINDING = {
    ARRAY:      "array",
    CELLDESC:   "cellDesc"
};

ROM.VERSION     = 1.11;
