/**
 * @fileoverview Implements VT100 Keyboard hardware
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
 * @typedef {Config} KeyboardConfig
 * @property {number} model
 */

/**
 * @class {Keyboard}
 * @unrestricted
 * @property {KeyboardConfig} config
 */
class Keyboard extends Device {
    /**
     * Keyboard(idMachine, idDevice, config)
     *
     * @this {Keyboard}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {KeyboardConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        this.time = /** @type {Time} */ (this.findDeviceByClass("Time"));
        this.ports = /** @type {Ports} */ (this.findDeviceByClass("Ports"));
        for (let port in Keyboard.LISTENERS) {
            let listeners = Keyboard.LISTENERS[port];
            this.ports.addListener(+port, listeners[0], listeners[1], this);
        }
        this.onReset();
    }

    /**
     * onPower()
     *
     * Called by the Machine device to provide notification of a power event.
     *
     * @this {Keyboard}
     */
    onPower()
    {
        if (!this.cpu) {
            this.cpu = /** @type {CPU} */ (this.findDeviceByClass("CPU"));
        }
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {Keyboard}
     */
    onReset()
    {
        this.bVT100Status   = Ports.STATUS.INIT;
        this.bVT100Address  = Ports.ADDRESS.INIT;
        this.fVT100UARTBusy = false;
        this.nVT100UARTSnap = 0;
    }

    /**
     * inVT100UARTAddress(port)
     *
     * We take our cue from iKeyNext.  If it's -1 (default), we simply return the last value latched
     * in bVT100Address.  Otherwise, if iKeyNext is a valid index into aKeysActive, we look up the key
     * in the VT100.KEYMAP, latch it, and increment iKeyNext.  Failing that, we latch VT100.KEYLAST
     * and reset iKeyNext to -1.
     *
     * @this {Keyboard}
     * @param {number} port (0x82)
     * @return {number} simulated port value
     */
    inVT100UARTAddress(port)
    {
        let value = this.bVT100Address;
        // if (this.iKeyNext >= 0) {
        //     if (this.iKeyNext < this.aKeysActive.length) {
        //         let key = this.aKeysActive[this.iKeyNext];
        //         if (!MAXDEBUG) {
        //             this.iKeyNext++;
        //         } else {
        //             /*
        //              * In MAXDEBUG builds, this code removes the key as soon as it's been reported, because
        //              * when debugging, it's easy for the window to lose focus and never receive the keyUp event,
        //              * thereby leaving us with a stuck key.  However, this may cause more problems than it solves,
        //              * because the VT100's ROM seems to require that key presses persist for more than a single poll.
        //              */
        //             this.aKeysActive.splice(this.iKeyNext, 1);
        //         }
        //         value = Ports.KEYMAP[key.softCode];
        //         if (value & 0x80) {
        //             /*
        //              * TODO: This code is supposed to be accompanied by a SHIFT key; make sure that it is.
        //              */
        //             value &= 0x7F;
        //         }
        //     } else {
        //         this.iKeyNext = -1;
        //         value = Ports.KEYLAST;
        //     }
        //     this.bVT100Address = value;
        //     this.cpu.requestINTR(1);
        // }
        this.printf(MESSAGE.PORTS, "inVT100UARTAddress(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * outVT100UARTStatus(port, value)
     *
     * @this {Keyboard}
     * @param {number} port (0x82)
     * @param {number} value
     */
    outVT100UARTStatus(port, value)
    {
        this.printf(MESSAGE.PORTS, "outVT100UARTStatus(%#04x): %#04x\n", port, value);
        this.bVT100Status = value;
        this.fVT100UARTBusy = true;
        this.nVT100UARTSnap = this.time.getCycles();
        // this.updateLEDs(value & Ports.STATUS.LEDS);
        // if (value & Ports.STATUS.START) {
            // this.iKeyNext = 0;
            // this.cpu.requestINTR(1);
        // }
    }

    /**
     * loadState(state)
     *
     * Memory and Ports states are managed by the Bus onLoad() handler, which calls our loadState() handler.
     *
     * @this {Keyboard}
     * @param {Array} state
     * @return {boolean}
     */
    loadState(state)
    {
        let idDevice = state.shift();
        if (this.idDevice == idDevice) {
            this.bVT100Status   = state.shift();
            this.bVT100Address  = state.shift();
            this.fVT100UARTBusy = state.shift();
            this.nVT100UARTSnap = state.shift();
            return true;
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * Memory and Ports states are managed by the Bus onSave() handler, which calls our saveState() handler.
     *
     * @this {Keyboard}
     * @param {Array} state
     */
    saveState(state)
    {
        state.push(this.idDevice);
        state.push(this.bVT100Status);
        state.push(this.bVT100Address);
        state.push(this.fVT100UARTBusy);
        state.push(this.nVT100UARTSnap);
    }
}

/*
 * Reading port 0x82 returns a key address from the VT100 keyboard's UART data output.
 *
 * Every time a keyboard scan is initiated (by setting the START bit of the status byte),
 * our internal address index (iKeyNext) is set to zero, and an interrupt is generated for
 * each entry in the aKeysActive array, along with a final interrupt for KEYLAST.
 */
Ports.ADDRESS = {
    PORT:       0x82,
    INIT:       0x7F
};

/*
 * Writing port 0x82 updates the VT100's keyboard status byte via the keyboard's UART data input.
 */
Ports.STATUS = {
    PORT:       0x82,               // write-only
    LED4:       0x01,
    LED3:       0x02,
    LED2:       0x04,
    LED1:       0x08,
    LOCKED:     0x10,
    LOCAL:      0x20,
    LEDS:       0x3F,               // all LEDs
    START:      0x40,               // set to initiate a scan
    /*
     * From p. 4-38 of the VT100 Technical Manual (July 1982):
     *
     *      A bit (CLICK) in the keyboard status word controls the bell....  When a single status word contains
     *      the bell bit, flip-flop E3 toggles and turns on E1, generating a click. If the bell bit is set for
     *      many words in succession, the UART latch holds the data output constant..., allowing the circuit to
     *      produce an 800 hertz tone. Bell is generated by setting the bell bit for 0.25 seconds.  Each cycle of
     *      the tone is at a reduced amplitude compared with the single keyclick....  The overall effect of the
     *      tone burst on the ear is that of a beep.
     */
    CLICK:      0x80,
    INIT:       0x00
};

Keyboard.LISTENERS = {
    0x82: [Keyboard.prototype.inVT100UARTAddress, Keyboard.prototype.outVT100UARTStatus]
};

Defs.CLASSES["Keyboard"] = Keyboard;
