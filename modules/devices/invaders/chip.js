/**
 * @fileoverview Implements the Space Invaders I/O ports
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
 * @typedef {Config} ChipConfig
 * @property {number} addr
 * @property {number} size
 * @property {number} [type]
 * @property {number} [width]
 * @property {Array.<number>} [values]
 */

/**
 * @class {Chip}
 * @unrestricted
 * @property {ChipConfig} config
 */
class Chip extends Port {
    /**
     * Chip(idMachine, idDevice, config)
     *
     * @this {Chip}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ChipConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        config['type'] = Port.TYPE.READWRITE;
        super(idMachine, idDevice, config);
        let idBus = this.config['bus'];
        this.bus = /** @type {Bus} */ (this.findDevice(idBus));
        if (!this.bus) {
            throw new Error(this.sprintf("unable to find bus '%s'", idBus));
        } else {
            this.bus.addBlocks(config['addr'], config['size'], Port.TYPE.READWRITE, this);
        }
        this.bStatus0 = 0;
        this.bStatus1 = 0;
        this.bStatus2 = 0;
    }

    /**
     * inStatus0(port)
     *
     * @this {Chip}
     * @param {number} port (0x00)
     * @return {number} simulated port value
     */
    inStatus0(port)
    {
        let value = this.bStatus0;
        this.printf(MESSAGE.CHIP, "inStatus0(%d): %#04x\n", port, value);
        return value;
    }

    /**
     * inStatus1(port)
     *
     * @this {Chip}
     * @param {number} port (0x01)
     * @return {number} simulated port value
     */
    inStatus1(port)
    {
        let value = this.bStatus1;
        this.printf(MESSAGE.CHIP, "inStatus1(%d): %#04x\n", port, value);
        return value;
    }

    /**
     * inStatus2(port)
     *
     * @this {Chip}
     * @param {number} port (0x02)
     * @return {number} simulated port value
     */
    inStatus2(port)
    {
        let value = this.bStatus2;
        this.printf(MESSAGE.CHIP, "inStatus2(%d): %#04x\n", port, value);
        return value;
    }

    /**
     * inShiftResult(port)
     *
     * @this {Chip}
     * @param {number} port (0x03)
     * @return {number} simulated port value
     */
    inShiftResult(port)
    {
        let value = (this.wShiftData >> (8 - this.bShiftCount)) & 0xff;
        this.printf(MESSAGE.CHIP, "inShiftResult(%d): %#04x\n", port, value);
        return value;
    }

    /**
     * outShiftCount(port, value)
     *
     * @this {Chip}
     * @param {number} port (0x02)
     * @param {number} value
     */
    outShiftCount(port, value)
    {
        this.printf(MESSAGE.CHIP, "outShiftCount(%d): %#04x\n", port, value);
        this.bShiftCount = value;
    }

    /**
     * outSound1(port, value)
     *
     * @this {Chip}
     * @param {number} port (0x03)
     * @param {number} value
     */
    outSound1(port, value)
    {
        this.printf(MESSAGE.CHIP, "outSound1(%d): %#04x\n", port, value);
        this.bSound1 = value;
    }

    /**
     * outShiftData(port, value)
     *
     * @this {Chip}
     * @param {number} port (0x04)
     * @param {number} value
     */
    outShiftData(port, value)
    {
        this.printf(MESSAGE.CHIP, "outShiftData(%d): %#04x\n", port, value);
        this.wShiftData = (value << 8) | (this.wShiftData >> 8);
    }

    /**
     * outSound2(port, value)
     *
     * @this {Chip}
     * @param {number} port (0x05)
     * @param {number} value
     */
    outSound2(port, value)
    {
        this.printf(MESSAGE.CHIP, "outSound2(%d): %#04x\n", port, value);
        this.bSound2 = value;
    }

    /**
     * outWatchdog(port, value)
     *
     * @this {Chip}
     * @param {number} port (0x06)
     * @param {number} value
     */
    outWatchdog(port, value)
    {
        this.printf(MESSAGE.CHIP, "outWatchDog(%d): %#04x\n", port, value);
    }

    /**
     * readValue(offset)
     *
     * This overrides the default Port readValue() function.
     *
     * @this {Chip}
     * @param {number} offset
     * @return {number}
     */
    readValue(offset)
    {
        let value = 0xff;
        let port = this.addr + offset;
        let func = Chip.INPUTS[port];
        if (func) value = func.call(this, port);
        return value;
    }

    /**
     * writeValue(offset)
     *
     * This overrides the default Port writeValue() function.
     *
     * @this {Chip}
     * @param {number} offset
     * @param {number} value
     */
    writeValue(offset, value)
    {
        let port = this.addr + offset;
        let func = Chip.OUTPUTS[port];
        if (func) func.call(this, port, value);
    }
}

Chip.INPUTS = {
    0: Chip.prototype.inStatus0,
    1: Chip.prototype.inStatus1,
    2: Chip.prototype.inStatus2,
    3: Chip.prototype.inShiftResult
};

Chip.OUTPUTS = {
    2: Chip.prototype.outShiftCount,
    3: Chip.prototype.outSound1,
    4: Chip.prototype.outShiftData,
    5: Chip.prototype.outSound2,
    6: Chip.prototype.outWatchdog
};
