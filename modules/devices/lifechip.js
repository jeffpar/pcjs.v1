/**
 * @fileoverview Simulates a "Game of Life" Chip
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
 * "Game of Life" Chip
 *
 * @class {Chip}
 * @unrestricted
 */
class Chip extends Device {
    /**
     * Chip(idMachine, idDevice, config)
     *
     * @this {Chip}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, Chip.VERSION, config);

        /*
         * This internal cycle count is initialized on every clocker() invocation.
         */
        this.nCyclesClocked = 0;

        /*
         * Get access to the LED device, so we can update its display.
         */
        this.ledArray = /** @type {LED} */ (this.findDeviceByClass(Machine.CLASS.LED));
        if (this.ledArray) {

            /*
             * clearBuffer(true) performs a combination of clearBuffer() and drawBuffer().
             */
            this.ledArray.clearBuffer(true);

            let configInput = {
                class:          "Input",
                location:       [0, 0, this.ledArray.widthView, this.ledArray.heightView, this.ledArray.cols, this.ledArray.rows],
                drag:           true,
                bindings:       {surface: this.ledArray.config.bindings[LED.BINDING.CONTAINER]}
            };

            let led = this.ledArray;
            this.ledInput = new Input(idMachine, idDevice + "Input", configInput);
            this.ledInput.addClick(function(col, row) {
                if (col >= 0 && row >= 0) {
                    led.setBuffer(col, row, LED.STATE.ON - led.getBufferData(col, row));
                }
            });
        }

        /*
         * Get access to the Time device, so we can give it our clocker() function.
         */
        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
        if (this.time) {
            this.time.addClocker(this.clocker.bind(this));
        }
    }

    /**
     * clocker(nCyclesTarget)
     *
     * @this {Chip}
     * @param {number} nCyclesTarget (0 to single-step, -1 to display status only)
     * @returns {number} (number of cycles actually "clocked")
     */
    clocker(nCyclesTarget = 0)
    {
        this.nCyclesClocked = 0;
        while (this.nCyclesClocked <= nCyclesTarget) {
            this.nCyclesClocked += 1;
        }
        return this.nCyclesClocked;
    }

    /**
     * onPower(fOn)
     *
     * Automatically called by the Machine device after all other devices have been powered up (eg, after
     * a page load event), as well as when all devices are being powered down (eg, before a page unload event).
     *
     * May subsequently be called by the Input device to provide notification of a user-initiated power event
     * (eg, toggling a power button); in this case, fOn should NOT be set, so that no state is loaded or saved.
     *
     * @this {Chip}
     * @param {boolean} [fOn] (true to power on, false to power off; otherwise, toggle it)
     */
    onPower(fOn)
    {
        if (fOn) {
            this.time.start();
        } else {
            this.time.stop();
        }
    }
}

Chip.VERSION    = 1.03;
