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
        this.input = /** @type {Input} */ (this.findDeviceByClass(Machine.CLASS.INPUT));
        this.input.addKeyListener("1p", this.onButton.bind(this));
        this.input.addKeyListener("2p", this.onButton.bind(this));
        this.input.addKeyListener("coin", this.onButton.bind(this));
        this.input.addKeyListener("left", this.onButton.bind(this));
        this.input.addKeyListener("right", this.onButton.bind(this));
        this.input.addKeyListener("fire", this.onButton.bind(this));
        this.input.addSurfaceListener(4, 4, 0, 0, this.onButton.bind(this, "1p"));
        this.input.addSurfaceListener(4, 4, 3, 0, this.onButton.bind(this, "2p"));
        this.input.addSurfaceListener(4, 4, 2, 0, this.onButton.bind(this, "coin"));
        this.input.addSurfaceListener(4, 4, 0, 3, this.onButton.bind(this, "left"));
        this.input.addSurfaceListener(4, 4, 1, 3, this.onButton.bind(this, "right"));
        this.input.addSurfaceListener(4, 4, 3, 3, this.onButton.bind(this, "fire"));
        this.reset();
    }

    /**
     * onButton(id, down)
     *
     * @this {Chip}
     * @param {string} id
     * @param {boolean} down
     */
    onButton(id, down)
    {
        let bit = Chip.STATUS1.KEYMAP[id];
        this.bStatus1 = (this.bStatus1 & ~bit) | (down? bit : 0);
    }

    /**
     * reset()
     *
     * @this {Chip}
     */
    reset()
    {
        this.bStatus0 = 0;
        this.bStatus1 = 0;
        this.bStatus2 = 0;
        this.wShiftData = 0;
        this.bShiftCount = 0;
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
        this.printf(MESSAGE.BUS, "inStatus0(%d): %#04x\n", port, value);
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
        this.printf(MESSAGE.PORT, "inStatus1(%d): %#04x\n", port, value);
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
        this.printf(MESSAGE.PORT, "inStatus2(%d): %#04x\n", port, value);
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
        this.printf(MESSAGE.PORT, "inShiftResult(%d): %#04x\n", port, value);
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
        this.printf(MESSAGE.PORT, "outShiftCount(%d): %#04x\n", port, value);
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
        this.printf(MESSAGE.PORT, "outSound1(%d): %#04x\n", port, value);
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
        this.printf(MESSAGE.PORT, "outShiftData(%d): %#04x\n", port, value);
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
        this.printf(MESSAGE.PORT, "outSound2(%d): %#04x\n", port, value);
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
        this.printf(MESSAGE.PORT, "outWatchDog(%d): %#04x\n", port, value);
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

    /**
     * loadState(state)
     *
     * @this {Chip}
     * @param {Array} state
     * @return {boolean}
     */
    loadState(state)
    {
        let idDevice = state.shift();
        if (this.idDevice == idDevice) {
            this.bStatus0 = state.shift();
            this.bStatus1 = state.shift();
            this.bStatus2 = state.shift();
            this.wShiftData = state.shift();
            this.bShiftCount = state.shift();
            return true;
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * @this {Chip}
     * @param {Array} state
     */
    saveState(state)
    {
        state.push(this.idDevice);
        state.push(this.bStatus0);
        state.push(this.bStatus1);
        state.push(this.bStatus2);
        state.push(this.wShiftData);
        state.push(this.bShiftCount);
    }

    /**
     * getKeyState(name, bit, value)
     *
     * This function was used to poll keys, before I added support for listener callbacks.
     *
     * The polling code in inStatus1() looked like this:
     *
     *      let ids = Object.keys(Chip.STATUS1.KEYMAP);
     *      for (let i = 0; i < ids.length; i++) {
     *          let id = ids[i];
     *          value = this.getKeyState(id, Chip.STATUS1.KEYMAP[id], value);
     *      }
     *
     * Since the hardware we're simulating is polling-based rather than interrupt-based, either approach
     * works just as well, but in general, listeners are more efficient.
     *
     * @this {Chip}
     * @param {string} name
     * @param {number} bit
     * @param {number} value
     * @return {number} (updated value)
     */
    getKeyState(name, bit, value)
    {
        if (this.input) {
            let state = this.input.getKeyState(name);
            if (state != undefined) {
                value = (value & ~bit) | (state? bit : 0);
            }
        }
        return value;
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

Chip.STATUS0 = {                    // NOTE: STATUS0 not used by the SI1978 ROMs; refer to STATUS1 instead
    PORT:       0,
    DIP4:       0x01,               // self-test request at power up?
    FIRE:       0x10,               // 1 = fire
    LEFT:       0x20,               // 1 = left
    RIGHT:      0x40,               // 1 = right
    PORT7:      0x80,               // some connection to (undocumented) port 7
    ALWAYS_SET: 0x0E                // always set
};

Chip.STATUS1 = {
    PORT:       1,
    CREDIT:     0x01,               // credit (coin slot)
    P2:         0x02,               // 1 = 2P start
    P1:         0x04,               // 1 = 1P start
    P1_FIRE:    0x10,               // 1 = fire (P1 fire if cocktail machine?)
    P1_LEFT:    0x20,               // 1 = left (P1 left if cocktail machine?)
    P1_RIGHT:   0x40,               // 1 = right (P1 right if cocktail machine?)
    ALWAYS_SET: 0x08                // always set
};

Chip.STATUS2 = {
    PORT:       2,
    DIP3_5:     0x03,               // 00 = 3 ships, 01 = 4 ships, 10 = 5 ships, 11 = 6 ships
    TILT:       0x04,               // 1 = tilt detected
    DIP6:       0x08,               // 0 = extra ship at 1500, 1 = extra ship at 1000
    P2_FIRE:    0x10,               // 1 = P2 fire (cocktail machines only?)
    P2_LEFT:    0x20,               // 1 = P2 left (cocktail machines only?)
    P2_RIGHT:   0x40,               // 1 = P2 right (cocktail machines only?)
    DIP7:       0x80,               // 0 = display coin info on demo ("attract") screen
    ALWAYS_SET: 0x00
};

Chip.SHIFT_RESULT = {               // bits 0-7 of barrel shifter result
    PORT:       3
};

Chip.SHIFT_COUNT = {
    PORT:       2,
    MASK:       0x07
};

Chip.SOUND1 = {
    PORT:       3,
    UFO:        0x01,
    SHOT:       0x02,
    PDEATH:     0x04,
    IDEATH:     0x08,
    EXPLAY:     0x10,
    AMP_ENABLE: 0x20
};

Chip.SHIFT_DATA = {
    PORT:       4
};

Chip.SOUND2 = {
    PORT:       5,
    FLEET1:     0x01,
    FLEET2:     0x02,
    FLEET3:     0x04,
    FLEET4:     0x08,
    UFO_HIT:    0x10
};

Chip.STATUS1.KEYMAP = {
    "1p":       Chip.STATUS1.P1,
    "2p":       Chip.STATUS1.P2,
    "coin":     Chip.STATUS1.CREDIT,
    "left":     Chip.STATUS1.P1_LEFT,
    "right":    Chip.STATUS1.P1_RIGHT,
    "fire":     Chip.STATUS1.P1_FIRE
};
