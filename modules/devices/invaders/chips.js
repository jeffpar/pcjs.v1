/**
 * @fileoverview Implements Space Invaders I/O chips
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
 * @typedef {PortsConfig} ChipsConfig
 * @property {number} addr
 * @property {number} size
 * @property {Object} switches
 */

/**
 * @class {Chips}
 * @unrestricted
 * @property {ChipsConfig} config
 */
class Chips extends Ports {
    /**
     * Chips(idMachine, idDevice, config)
     *
     * @this {Chips}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ChipsConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        for (let port in Chips.LISTENERS) {
            let listeners = Chips.LISTENERS[port];
            this.addListener(+port, listeners[0], listeners[1]);
        }
        this.input = /** @type {Input} */ (this.findDeviceByClass("Input"));
        let onButton = this.onButton.bind(this);
        let buttonIDs = Object.keys(Chips.STATUS1.KEYMAP);
        for (let i = 0; i < buttonIDs.length; i++) {
            this.input.addListener(Input.TYPE.IDMAP, buttonIDs[i], onButton);
        }
        this.switchConfig = config['switches'] || {};
        this.defaultSwitches = this.parseDIPSwitches(this.switchConfig['default'], 0xff);
        this.setSwitches(this.defaultSwitches);
        this.onReset();
    }

    /**
     * onButton(id, down)
     *
     * @this {Chips}
     * @param {string} id
     * @param {boolean} down
     */
    onButton(id, down)
    {
        let bit = Chips.STATUS1.KEYMAP[id];
        this.bStatus1 = (this.bStatus1 & ~bit) | (down? bit : 0);
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {Chips}
     */
    onReset()
    {
        this.bStatus0 = 0;
        this.bStatus1 = 0;
        this.bStatus2 = 0;
        this.wShiftData = 0;
        this.bShiftCount = 0;
    }

    /**
     * setSwitches(switches)
     *
     * @this {Chips}
     * @param {number|undefined} switches
     */
    setSwitches(switches)
    {
        /*
         * switches may be undefined when called from loadState() if a "pre-switches" state was loaded.
         */
        if (switches == undefined) return;
        /*
         * If this.switches is undefined, then this is the first setSwitches() call, so we should set func
         * to onSwitch(); otherwise, we omit func so that all addListener() will do is initialize the visual
         * state of the SWITCH controls.
         */
        let func = this.switches == undefined? this.onSwitch.bind(this) : null;
        /*
         * Now we can set the actual switches to the supplied setting, and initialize each of the (8) switches.
         */
        this.switches = switches;
        for (let i = 1; i <= 8; i++) {
            this.input.addListener(Input.TYPE.SWITCH, "sw"+i, func, !(switches & (1 << (i - 1))));
        }
    }

    /**
     * onSwitch(id, state)
     *
     * @this {Chips}
     * @param {string} id
     * @param {boolean} state
     */
    onSwitch(id, state)
    {
        let desc;
        let i = +id.slice(-1) - 1, bit = 1 << i;
        if (!state) {
            this.switches |= bit;
        } else {
            this.switches &= ~bit;
        }
        for (let sws in this.switchConfig) {
            if (sws == "default" || sws[i] != '0' && sws[i] != '1') continue;
            let mask = this.parseDIPSwitches(sws, -1);
            let switches = this.parseDIPSwitches(sws);
            if (switches == (this.switches & mask)) {
                desc = this.switchConfig[sws];
                break;
            }
        }
        this.printf("%s: %b (%s)\n", id, state, desc);
    }

    /**
     * inStatus0(port)
     *
     * @this {Chips}
     * @param {number} port (0x00)
     * @return {number} simulated port value
     */
    inStatus0(port)
    {
        let value = this.bStatus0;
        this.printf(MESSAGE.BUS, "inStatus0(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * inStatus1(port)
     *
     * @this {Chips}
     * @param {number} port (0x01)
     * @return {number} simulated port value
     */
    inStatus1(port)
    {
        let value = this.bStatus1;
        this.printf(MESSAGE.PORTS, "inStatus1(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * inStatus2(port)
     *
     * @this {Chips}
     * @param {number} port (0x02)
     * @return {number} simulated port value
     */
    inStatus2(port)
    {
        let value = this.bStatus2 | (this.switches & (Chips.STATUS2.DIP1_2 | Chips.STATUS2.DIP4 | Chips.STATUS2.DIP7));
        this.printf(MESSAGE.PORTS, "inStatus2(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * inShiftResult(port)
     *
     * @this {Chips}
     * @param {number} port (0x03)
     * @return {number} simulated port value
     */
    inShiftResult(port)
    {
        let value = (this.wShiftData >> (8 - this.bShiftCount)) & 0xff;
        this.printf(MESSAGE.PORTS, "inShiftResult(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * outShiftCount(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x02)
     * @param {number} value
     */
    outShiftCount(port, value)
    {
        this.printf(MESSAGE.PORTS, "outShiftCount(%#04x): %#04x\n", port, value);
        this.bShiftCount = value;
    }

    /**
     * outSound1(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x03)
     * @param {number} value
     */
    outSound1(port, value)
    {
        this.printf(MESSAGE.PORTS, "outSound1(%#04x): %#04x\n", port, value);
        this.bSound1 = value;
    }

    /**
     * outShiftData(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x04)
     * @param {number} value
     */
    outShiftData(port, value)
    {
        this.printf(MESSAGE.PORTS, "outShiftData(%#04x): %#04x\n", port, value);
        this.wShiftData = (value << 8) | (this.wShiftData >> 8);
    }

    /**
     * outSound2(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x05)
     * @param {number} value
     */
    outSound2(port, value)
    {
        this.printf(MESSAGE.PORTS, "outSound2(%#04x): %#04x\n", port, value);
        this.bSound2 = value;
    }

    /**
     * outWatchdog(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x06)
     * @param {number} value
     */
    outWatchdog(port, value)
    {
        this.printf(MESSAGE.PORTS, "outWatchDog(%#04x): %#04x\n", port, value);
    }

    /**
     * loadState(state)
     *
     * Memory and Ports states are managed by the Bus onLoad() handler, which calls our loadState() handler.
     *
     * @this {Chips}
     * @param {Array|undefined} state
     * @return {boolean}
     */
    loadState(state)
    {
        if (state) {
            let idDevice = state.shift();
            if (this.idDevice == idDevice) {
                this.bStatus0 = state.shift();
                this.bStatus1 = state.shift();
                this.bStatus2 = state.shift();
                this.wShiftData = state.shift();
                this.bShiftCount = state.shift();
                this.setSwitches(state.shift());
                return true;
            }
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * Memory and Ports states are managed by the Bus onSave() handler, which calls our saveState() handler.
     *
     * @this {Chips}
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
        state.push(this.switches);
    }

    /**
     * getKeyState(name, bit, value)
     *
     * This function was used to poll keys, before I added support for listener callbacks.
     *
     * The polling code in inStatus1() looked like this:
     *
     *      let ids = Object.keys(Chips.STATUS1.KEYMAP);
     *      for (let i = 0; i < ids.length; i++) {
     *          let id = ids[i];
     *          value = this.getKeyState(id, Chips.STATUS1.KEYMAP[id], value);
     *      }
     *
     * Since the hardware we're simulating is polling-based rather than interrupt-based, either approach
     * works just as well, but in general, listeners are more efficient.
     *
     * @this {Chips}
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

Chips.STATUS0 = {                   // NOTE: STATUS0 not used by the SI1978 ROMs; refer to STATUS1 instead
    PORT:       0,
    DIP4:       0x01,               // self-test request at power up?
    FIRE:       0x10,               // 1 = fire
    LEFT:       0x20,               // 1 = left
    RIGHT:      0x40,               // 1 = right
    PORT7:      0x80,               // some connection to (undocumented) port 7
    ALWAYS_SET: 0x0E                // always set
};

Chips.STATUS1 = {
    PORT:       1,
    CREDIT:     0x01,               // credit (coin slot)
    P2:         0x02,               // 1 = 2P start
    P1:         0x04,               // 1 = 1P start
    P1_FIRE:    0x10,               // 1 = fire (P1 fire if cocktail machine?)
    P1_LEFT:    0x20,               // 1 = left (P1 left if cocktail machine?)
    P1_RIGHT:   0x40,               // 1 = right (P1 right if cocktail machine?)
    ALWAYS_SET: 0x08                // always set
};

Chips.STATUS2 = {
    PORT:       2,
    DIP1_2:     0x03,               // 00 = 3 ships, 01 = 4 ships, 10 = 5 ships, 11 = 6 ships
    TILT:       0x04,               // 1 = tilt detected
    DIP4:       0x08,               // 0 = extra ship at 1500, 1 = extra ship at 1000
    P2_FIRE:    0x10,               // 1 = P2 fire (cocktail machines only?)
    P2_LEFT:    0x20,               // 1 = P2 left (cocktail machines only?)
    P2_RIGHT:   0x40,               // 1 = P2 right (cocktail machines only?)
    DIP7:       0x80,               // 0 = display coin info on demo ("attract") screen
    ALWAYS_SET: 0x00
};

Chips.SHIFT_RESULT = {              // bits 0-7 of barrel shifter result
    PORT:       3
};

Chips.SHIFT_COUNT = {
    PORT:       2,
    MASK:       0x07
};

Chips.SOUND1 = {
    PORT:       3,
    UFO:        0x01,
    SHOT:       0x02,
    PDEATH:     0x04,
    IDEATH:     0x08,
    EXPLAY:     0x10,
    AMP_ENABLE: 0x20
};

Chips.SHIFT_DATA = {
    PORT:       4
};

Chips.SOUND2 = {
    PORT:       5,
    FLEET1:     0x01,
    FLEET2:     0x02,
    FLEET3:     0x04,
    FLEET4:     0x08,
    UFO_HIT:    0x10
};

Chips.STATUS1.KEYMAP = {
    "1p":       Chips.STATUS1.P1,
    "2p":       Chips.STATUS1.P2,
    "coin":     Chips.STATUS1.CREDIT,
    "left":     Chips.STATUS1.P1_LEFT,
    "right":    Chips.STATUS1.P1_RIGHT,
    "fire":     Chips.STATUS1.P1_FIRE
};

Chips.LISTENERS = {
    0: [Chips.prototype.inStatus0],
    1: [Chips.prototype.inStatus1],
    2: [Chips.prototype.inStatus2, Chips.prototype.outShiftCount],
    3: [Chips.prototype.inShiftResult, Chips.prototype.outSound1],
    4: [null, Chips.prototype.outShiftData],
    5: [null, Chips.prototype.outSound2],
    6: [null, Chips.prototype.outWatchdog]
};

Defs.CLASSES["Chips"] = Chips;
