/**
 * @fileoverview Simulates ROM
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
 * @typedef {Config} ROMConfig
 * @property {number} addr
 * @property {number} size
 * @property {Array.<number>} values
 * @property {string} file
 * @property {string} reference
 * @property {string} chipID
 * @property {number} [revision]
 * @property {string} [colorROM]
 * @property {string} [backgroundColorROM]
 */

/**
 * @class {ROM}
 * @unrestricted
 * @property {ROMConfig} config
 */
class ROM extends Memory {
    /**
     * ROM(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "rom": {
     *        "class": "ROM",
     *        "addr": 0,
     *        "size": 2048,
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
        config['type'] = Memory.TYPE.ROM;
        super(idMachine, idDevice, config);

        if (config['revision']) this.status = "revision " + config['revision'] + " " + this.status;

        this.bus = /** @type {Bus} */ (this.findDeviceByClass(Machine.CLASS.BUS));
        this.bus.addBlocks(config['addr'], config['size'], config['type'], this);

        /*
         * If an "array" binding has been supplied, then create an LED array sufficiently large to represent the
         * entire ROM.  If data.length is an odd power-of-two, then we will favor a slightly wider array over a taller
         * one, by virtue of using Math.ceil() instead of Math.floor() for the columns calculation.
         */
        if (Machine.CLASSES[Machine.CLASS.LED] && this.bindings[ROM.BINDING.ARRAY]) {
            let rom = this;
            let LED = Machine.CLASSES[Machine.CLASS.LED];
            let addrLines = Math.log2(this.values.length) / 2;
            this.cols = Math.pow(2, Math.ceil(addrLines));
            this.rows = (this.values.length / this.cols)|0;
            let configLEDs = {
                "class":            "LED",
                "bindings":         {"container": this.getBindingID(ROM.BINDING.ARRAY)},
                "type":             LED.TYPE.ROUND,
                "cols":             this.cols,
                "rows":             this.rows,
                "color":            this.getDefaultString('colorROM', "green"),
                "backgroundColor":  this.getDefaultString('backgroundColorROM', "black"),
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
            this.sCellDesc = this.getBindingText(ROM.BINDING.CELLDESC) || "";
            this.ledInput.addHover(function onROMHover(col, row) {
                if (rom.cpu) {
                    let sDesc = rom.sCellDesc;
                    if (col >= 0 && row >= 0) {
                        let offset = row * rom.cols + col;
                        this.assert(offset >= 0 && offset < rom.values.length);
                        let opcode = rom.values[offset];
                        sDesc = rom.cpu.toInstruction(rom.addr + offset, opcode);
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
     * loadState(state)
     *
     * If any saved values don't match (presumably overridden), abandon the given state and return false.
     *
     * @this {ROM}
     * @param {Array} state
     * @return {boolean}
     */
    loadState(state)
    {
        let length, success = true;
        let buffer = state.shift();
        if (buffer && this.ledArray) {
            length = buffer.length;
            this.assert(this.ledArray.buffer.length == length);
            if (this.ledArray.buffer.length == length) {
                this.ledArray.buffer = buffer;
                this.ledArray.drawBuffer(true);
            } else {
                this.printf("inconsistent saved LED state (%d), unable to load\n", length);
                success = false;
            }
        }
        /*
         * Version 1.21 and up also saves the ROM contents, since our "mini-debugger" has been updated
         * with an edit command ("e") to enable ROM patching.  However, we prefer to detect improvements
         * in saved state based on the length of the array, not the version number.
         */
        if (state.length) {
            let data = state.shift();
            let length = data && data.length || -1;
            if (this.values.length == length) {
                this.values = data;
            } else {
                this.printf("inconsistent saved ROM state (%d), unable to load\n", length);
                success = false;
            }
        }
        return success;
    }

    /**
     * onPower(fOn)
     *
     * @this {ROM}
     * @param {boolean} [fOn] (true to power on, false to power off; otherwise, toggle it)
     */
    onPower(fOn)
    {
        if (!this.cpu) {
            this.cpu = /* @type {CPU} */ (this.findDeviceByClass(Machine.CLASS.CPU));
        }
    }

    /**
     * readDirect(offset)
     *
     * This provides an alternative to readValue() for those callers who don't want the LED array to see their access.
     *
     * Note that this "Direct" function requires the caller to perform their own address-to-offset calculation, since they
     * are bypassing the Bus device.
     *
     * @this {ROM}
     * @param {number} offset
     * @return {number}
     */
    readDirect(offset)
    {
        return this.values[offset];
    }

    /**
     * readValue(offset)
     *
     * This overrides the Memory readValue() function so that the LED array, if any, can track ROM accesses.
     *
     * @this {ROM}
     * @param {number} offset
     * @return {number}
     */
    readValue(offset)
    {
        if (this.ledArray) {
            let LED = Machine.CLASSES[Machine.CLASS.LED];
            this.ledArray.setLEDState(offset % this.cols, (offset / this.cols)|0, LED.STATE.ON, LED.FLAGS.MODIFIED);
        }
        return this.values[offset];
    }

    /**
     * reset()
     *
     * Called by the CPU (eg, TMS1500) onReset() handler.  Originally, there was no need for this
     * handler, until we added the mini-debugger's ability to edit ROM locations via setData().  So this
     * gives the user the ability to revert back to the original ROM if they want to undo any modifications.
     *
     * @this {ROM}
     */
    reset()
    {
        this.values = this.config['values'];
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
            state.push(this.values);
        }
    }

    /**
     * writeDirect(offset, value)
     *
     * This provides an alternative to writeValue() for callers who need to "patch" the ROM (normally unwritable).
     *
     * Note that this "Direct" function requires the caller to perform their own address-to-offset calculation, since they
     * are bypassing the Bus device.
     *
     * @this {ROM}
     * @param {number} offset
     * @param {number} value
     */
    writeDirect(offset, value)
    {
        this.values[offset] = value;
    }
}

ROM.BINDING = {
    ARRAY:      "array",
    CELLDESC:   "cellDesc"
};
