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

        this.fWrap = this.config['wrap'] || false;
        this.sRule = this.config['rule'] || "B3/S23";   // default rule (births require 3 neighbors, survivors require 2 or 3)

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
            this.ledInput.addInput(function onLEDInput(col, row) {
                if (col >= 0 && row >= 0) {
                    led.setBuffer(col, row, LED.STATE.ON - led.getBufferData(col, row));
                    led.drawBuffer();
                }
            });

            /*
             * Get access to the Input device, so we can add our click functions.
             */
            this.input = /** @type {Input} */ (this.findDeviceByClass(Machine.CLASS.INPUT));
            this.input.addClick(this.onPower.bind(this), this.onReset.bind(this));

            /*
             * Get access to the Time device, so we can give it our clocker() function.
             */
            this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
            if (this.time) {
                this.time.addClocker(this.clocker.bind(this));
            }
        }
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Input}
     * @param {string} binding
     * @param {HTMLElement} element
     */
    addBinding(binding, element)
    {
        let chip = this;
        let patterns = this.config['patterns'];
        if (patterns && patterns[binding]) {
            element.onclick = function onClickPattern() {
                chip.loadPattern(binding);
            };
        }
        super.addBinding(binding, element);
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
        let nCyclesClocked = 0;
        if (nCyclesTarget >= 0) {
            do {
                this.doGeneration();
                nCyclesClocked += 1;
            } while (nCyclesClocked < nCyclesTarget);
        }
        return nCyclesClocked;
    }

    /**
     * doGeneration()
     *
     * @this {Chip}
     */
    doGeneration()
    {
        let buffer = this.ledArray.getBuffer();
        let bufferClone = this.ledArray.getBufferClone();
        let nCols = this.ledArray.cols;
        let nRows = this.ledArray.rows;
        let nInc = this.ledArray.nBufferInc;
        let nCellsPerRow = nCols * nInc, nCells = nRows * nCellsPerRow;

        let iCell = 0;
        let iCellDummy = nCells;
        let iNO = iCell - nCellsPerRow;
        let iNW = iNO - nInc;
        let iNE = iNO + nInc;
        let iWE = iCell - nInc;
        let iEA = iCell + nInc;
        let iSO = iCell + nCellsPerRow;
        let iSW = iSO - nInc;
        let iSE = iSO + nInc;

        for (let row = 0; row < nRows; row++) {
            if (!row) {
                if (!this.fWrap) {
                    iNO = iNW = iNE = iCellDummy;
                } else {
                    iNO += nCells; iNW += nCells; iNE += nCells;
                }
            } else if (row == nRows - 1) {
                if (!this.fWrap) {
                    iSO = iSW = iSE = iCellDummy;
                } else {
                    iSO -= nCells; iSW -= nCells; iSE -= nCells;
                }
            }
            for (let col = 0; col < nCols; col++) {
                if (!col) {
                    if (!this.fWrap) {
                        iWE = iNW = iSW = iCellDummy;
                    } else {
                        iWE += nCellsPerRow; iNW += nCellsPerRow; iSW += nCellsPerRow;
                    }
                } else if (col == 1) {
                    if (!this.fWrap) {
                        iWE = iCell - nInc; iNW = iNO - nInc; iSW = iSO - nInc;
                    } else {
                        iWE -= nCellsPerRow; iNW -= nCellsPerRow; iSW -= nCellsPerRow;
                    }
                } else if (col == nCols - 1) {
                    if (!this.fWrap) {
                        iEA = iNE = iSE = iCellDummy;
                    } else {
                        iEA -= nCellsPerRow; iNE -= nCellsPerRow; iSE -= nCellsPerRow;
                    }
                }
                let state = buffer[iCell];
                let nNeighbors = buffer[iNW]+buffer[iNO]+buffer[iNE]+buffer[iEA]+buffer[iSE]+buffer[iSO]+buffer[iSW]+buffer[iWE];
                this.assert(!isNaN(nNeighbors));
                if (nNeighbors == 3) {
                    state = LED.STATE.ON;
                } else if (nNeighbors != 2) {
                    state = LED.STATE.OFF;
                }
                bufferClone[iCell] = state;
                bufferClone[iCell+1] = (buffer[iCell] !== state)? LED.STATE.DIRTY : buffer[iCell+1];
                iCell += nInc; iNW += nInc; iNO += nInc; iNE += nInc; iEA += nInc; iSE += nInc; iSO += nInc; iSW += nInc; iWE += nInc;
            }
            if (!this.fWrap) {
                if (!row) {
                    iNO = iCell - nCellsPerRow; iNW = iNO - nInc; iNE = iNO + nInc;
                }
                iEA = iCell + nInc; iNE = iNO + nInc; iSE = iSO + nInc;
            } else {
                if (!row) {
                    iNO -= nCells; iNW -= nCells; iNE -= nCells;
                }
                iEA += nCellsPerRow; iNE += nCellsPerRow; iSE += nCellsPerRow;
            }
        }
        this.assert(iCell == nCells);
        this.ledArray.swapBufferClone();
    }

    /**
     * loadPattern(id)
     *
     * @this {Chip}
     * @param {string} id
     */
    loadPattern(id)
    {
        let ledArray = this.ledArray;
        let patterns = this.config['patterns'];
        let lines = patterns && patterns[id];
        if (!lines) {
            this.println("unknown pattern: " + id);
            return;
        }
        this.println("loading pattern '" + id + "'");
        let nCmds = 0;
        let width = 0, height = 0, rule = "", sPattern = "";
        ledArray.clearBuffer();
        for (let i = 0; i < lines.length; i++) {
            let sLine = lines[i];
            if (sLine[0] == '#') {
                this.println(sLine);
                continue;
            }
            if (!nCmds++) {
                let match = sLine.match(/x\s*=\s*([0-9]+)\s*,\s*y\s*=\s*([0-9]+)\s*(?:,\s*rule\s*=\s*(\S+)|)/i);
                if (!match) {
                    this.println("unrecognized header line");
                    return;
                }
                width = +match[1];
                height = +match[2];
                rule = match[3];
                if (rule != this.sRule) {
                    this.println("unsupported rule: " + rule);
                    return;
                }
                continue;
            }
            let end = sLine.indexOf('!');
            if (end >= 0) {
                sPattern += sLine.substr(0, end);
                break;
            }
            sPattern += sLine;
        }
        if (width > ledArray.cols || height > ledArray.rows) {
            this.printf("pattern too large (%d,%d)\n", width, height);
            return;
        }
        let iCol = (ledArray.cols - width) >> 1;
        let iRow = (ledArray.rows - height) >> 1;
        let aTokens = sPattern.split(/([bo$])/);
        let i = 0, col = iCol, row = iRow;
        while (i < aTokens.length - 1) {
            let count = aTokens[i++];
            if (count === "") count = 1;
            let token = aTokens[i++];
            while (count--) {
                switch(token) {
                case '$':
                    col = iCol;
                    row++;
                    break;
                case 'b':
                    ledArray.setBuffer(col++, row, LED.STATE.OFF);
                    break;
                case 'o':
                    ledArray.setBuffer(col++, row, LED.STATE.ON);
                    break;
                }
            }
        }
        ledArray.drawBuffer();
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

    /**
     * onReset()
     *
     * Called by the Input device to provide notification of a reset event.
     *
     * @this {Chip}
     */
    onReset()
    {
        this.println("reset");
        this.ledArray.clearBuffer(true);
    }
}

Chip.VERSION    = 1.10;
