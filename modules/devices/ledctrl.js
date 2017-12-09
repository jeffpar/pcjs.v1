/**
 * @fileoverview Simulates an LED controller
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
 * @typedef {Config} LCConfig
 * @property {string} class
 * @property {Object} [bindings]
 * @property {number} [version]
 * @property {Array.<string>} [overrides]
 * @property {boolean} [toggle]
 * @property {boolean} [wrap]
 * @property {string} [rule]
 * @property {string} [pattern]
 * @property {Object} [patterns]
 * @property {Object} [colors]
 */

/**
 * LED Controller Chip
 *
 * @class {Chip}
 * @unrestricted
 * @property {boolean} fToggle
 * @property {boolean} fWrap
 * @property {string} sRule
 * @property {string} sPatternInit
 * @property {LED} ledArray
 * @property {Object} colorPalette
 * @property {string} colorDefault (obtained from the ledArray)
 * @property {string} colorSelected (set by updateColorSelection())
 * @property {Array.<string>} colorArray
 */
class Chip extends Device {
    /**
     * Chip(idMachine, idDevice, config)
     *
     * @this {Chip}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {LCConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, Chip.VERSION, config);

        /*
         * The 'toggle' property is set to true for grids like the "Game of Life", where you normally
         * just want to toggle a cell on or off; it's false for the "Lite-Brite" grid where we're dealing
         * with LEDs of multiple colors.  I admit it's a kludgy distinction between grids with different
         * UI requirements, but it's good enough to get the ball rolling.  We'll revisit the UI later.
         */
        this.fToggle = this.getDefault(this.config['toggle'], true);

        /*
         * These are grid "behavior" properties.  If 'wrap' is true, then any off-grid neighbor cell locations
         * are mapped to the opposite edge; otherwise, they are mapped to the LED array's "scratch" row.
         */
        this.fWrap = this.getDefault(this.config['wrap'], false);
        this.sRule = this.getDefault(this.config['rule'], "B3/S23");    // default rule (births require 3 neighbors, survivors require 2 or 3)
        this.sPatternInit = this.getDefault(this.config['pattern'], "");

        /*
         * Since all bindings should have been completed by super(), we can make a preliminary call
         * to getCounts() to determine how many counts are stored per LED, to preallocate a count buffer.
         */
        this.countBuffer = new Array(this.getCounts().length);

        /*
         * Get access to the LED device, so we can update its display.
         */
        this.ledArray = /** @type {LED} */ (this.findDeviceByClass(Machine.CLASS.LED));
        if (this.ledArray) {

            /*
             * If loadPattern() didn't load anything into the LED array, then call
             * clearBuffer(true), which performs a combination of clearBuffer() and drawBuffer().
             */
            if (!this.loadPattern()) this.ledArray.clearBuffer(true);

            let configInput = {
                class:          "Input",
                location:       [0, 0, this.ledArray.widthView, this.ledArray.heightView, this.ledArray.cols, this.ledArray.rows],
                drag:           true,
                hexagonal:      this.ledArray.fHexagonal,
                bindings:       {surface: this.ledArray.config.bindings[LED.BINDING.CONTAINER]}
            };

            let chip = this;
            let ledArray = this.ledArray;

            this.ledInput = new Input(idMachine, idDevice + "Input", configInput);
            this.ledInput.addInput(function onLEDInput(col, row) {
                if (col >= 0 && row >= 0) {
                    if (chip.colorSelected) {
                        if (!ledArray.setLEDColor(col, row, chip.colorSelected)) {
                            if (chip.fToggle) {
                                ledArray.setLEDState(col, row, LED.STATE.ON - ledArray.getLEDState(col, row));
                            } else {
                                if (!ledArray.getLEDState(col, row)) {
                                    ledArray.setLEDColor(col, row);
                                } else {
                                    ledArray.setLEDState(col, row, LED.STATE.OFF);
                                }
                            }
                        } else {
                            ledArray.setLEDState(col, row, LED.STATE.ON);
                        }
                    }
                    else {
                        ledArray.setLEDState(col, row, LED.STATE.ON - ledArray.getLEDState(col, row));
                    }
                    ledArray.setLEDCounts(col, row, chip.getCounts());
                    ledArray.drawBuffer();
                }
            });

            this.colorArray = [];
            this.colorDefault = ledArray.getDefaultColor();
            this.updateColorSelection(this.colorDefault);
            this.updateColorSwatches();

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
                this.time.addUpdater(this.updateStatus.bind(this));
            }

            /*
             * The following set of properties are all debugger-related; see onCommand().
             */
            this.sCommandPrev = "";
            this.addHandler(Device.HANDLER.COMMAND, this.onCommand.bind(this));
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

        switch(binding) {
        case Chip.BINDING.COLOR_PALETTE:
        case Chip.BINDING.COLOR_SELECTION:
            element.onchange = function onSelectChange() {
                chip.updateColorPalette(binding);
            };
            this.updateColorPalette();
            break;

        case Chip.BINDING.SAVE_TO_URL:
            element.onclick = function onClickSave() {
                let sPattern = chip.savePattern();
                chip.println(sPattern);
                let href = window.location.href;
                if (href.indexOf('pattern=') >= 0) {
                    href = href.replace(/(pattern=)[^&]*/, "$1" + sPattern.replace(/\$/g, "$$$$"));
                } else {
                    href += ((href.indexOf('?') < 0)? '?' : '&') + "pattern=" + sPattern;
                }
                window.location = href;
            };
            break;

        default:
            if (binding.startsWith(Chip.BINDING.COLOR_SWATCH)) {
                element.onclick = function onClickColorSwatch() {
                    chip.updateColorSwatches(binding);
                };
                break;
            }
            let patterns = this.config['patterns'];
            if (patterns && patterns[binding]) {
                element.onclick = function onClickPattern() {
                    chip.loadPattern(binding);
                };
            }
        }
        super.addBinding(binding, element);
    }

    /**
     * clocker(nCyclesTarget)
     *
     * @this {Chip}
     * @param {number} nCyclesTarget (0 to single-step)
     * @returns {number} (number of cycles actually "clocked")
     */
    clocker(nCyclesTarget = 0)
    {
        let nCyclesClocked = 0;
        if (nCyclesTarget >= 0) {
            let nAlive;
            do {
                switch(this.sRule) {
                case "C8":
                    nAlive = this.countCells();
                    break;
                default:
                    nAlive = this.countNeighbors();
                    break;
                }
                if (!nCyclesTarget) this.println("living cells: " + nAlive);
                nCyclesClocked += 1;
            } while (nCyclesClocked < nCyclesTarget);
        }
        return nCyclesClocked;
    }

    /**
     * countCells()
     *
     * @this {Chip}
     * @returns {number}
     */
    countCells()
    {
        let cAlive = 0;
        let ledArray = this.ledArray;
        let nCols = ledArray.cols, nRows = ledArray.rows;
        let counts = this.countBuffer;
        for (let row = 0; row < nRows; row++) {
            for (let col = 0; col < nCols; col++) {
                if (!ledArray.getLEDCounts(col, row, counts)) continue;
                cAlive++;
                /*
                 * Here's the layout of the cell's counts (which mirrors the Chip.COUNTS layout):
                 *
                 *      [0] is the "working" count
                 *      [1] is the ON count
                 *      [2] is the OFF count
                 *      [3] is the color-cycle count
                 *
                 * Whenever the working count is zero, we examine the cell's state and advance it to
                 * the next state: if it was ON, it goes to OFF (and the OFF count is loaded into
                 * the working count); if it was OFF, then color-cycle count (if any) is applied, and
                 * the state goes to ON (and the ON count is loaded).
                 */
                if (counts[0]) {
                    counts[0]--;
                }
                if (!counts[0]) {
                    let state = ledArray.getLEDState(col, row), stateNew = state;
                    switch(state) {
                    case LED.STATE.ON:
                        stateNew = LED.STATE.OFF;
                        counts[0] = counts[2];
                        if (counts[0]) break;
                        /* falls through */
                    case LED.STATE.OFF:
                        if (counts[3]) {
                            let color = ledArray.getLEDColor(col, row);
                            let iColor = this.colorArray.indexOf(color);
                            if (iColor >= 0) {
                                iColor = (iColor + counts[3]);
                                while (iColor >= this.colorArray.length) iColor -= this.colorArray.length;
                                ledArray.setLEDColor(col, row, this.colorArray[iColor]);
                            }
                        }
                        stateNew = LED.STATE.ON;
                        counts[0] = counts[1];
                        break;
                    }
                    if (stateNew !== state) ledArray.setLEDState(col, row, stateNew);
                }
                ledArray.setLEDCounts(col, row, counts);
            }
        }
        return cAlive;
    }

    /**
     * countNeighbors()
     *
     * This contains a straight-forward implementation of the Conway "Game of Life" rules ("B3/S23"),
     * iterating row-by-row and column-by-column.  It takes advantage of the LED array's one-dimensional
     * buffer layout to move through the entire grid with a "master" cell index (iCell) and corresponding
     * indexes for all 8 "neighboring" cells (iNO, iNE, iEA, iSE, iSO, iSW, iWE, and iNW), incrementing
     * them all in unison.
     *
     * The row and col variables are used only to detect when we are at the "edges" of the grid, and whether
     * (depending on the wrap setting) any north, east, south, or west indexes that are now "off the grid"
     * should be adjusted to the other side of the grid (or set to the dead "scratch" row at the end of the
     * grid if wrap is disabled).  Similarly, when we leave an "edge", those same indexes must be restored
     * to their normal positions, relative to the "master" index (iCell).
     *
     * The inline tests for whether iCell is at an edge are unavoidable, unless we break the logic up into
     * 5 discrete steps: one for the rectangle just inside the edges, and then four for each of the north,
     * east, south, and west edge strips.  But unless we really need that (presumably tiny) speed boost,
     * I'm inclined to keep the logic simple.
     *
     * The logic is still a bit cluttered by the all the edge detection checks (and the wrap checks within
     * each edge case), and perhaps I should have written two versions of this function (with and without wrap),
     * but again, that would produce more repetition of the rest of the game logic, so I'm still inclined to
     * leave it as-is.
     *
     * @this {Chip}
     * @returns {number}
     */
    countNeighbors()
    {
        let cAlive = 0;
        let buffer = this.ledArray.getBuffer();
        let bufferClone = this.ledArray.getBufferClone();
        let nCols = this.ledArray.cols;
        let nRows = this.ledArray.rows;
        /*
         * The number of LED buffer elements per cell is an LED implementation detail that should not be
         * assumed, so we obtain it from the LED object, and use it to calculate the per-cell increment,
         * per-row increment, and per-grid increment; the latter gives us the offset of the LED buffer's
         * scratch row, which we rely upon when wrap is turned off.
         */
        let nInc = this.ledArray.nBufferInc;
        let nIncPerRow = nCols * nInc;
        let nIncPerGrid = nRows * nIncPerRow;

        let iCell = 0;
        let iCellDummy = nIncPerGrid;
        let iNO = iCell - nIncPerRow;
        let iNW = iNO - nInc;
        let iNE = iNO + nInc;
        let iWE = iCell - nInc;
        let iEA = iCell + nInc;
        let iSO = iCell + nIncPerRow;
        let iSW = iSO - nInc;
        let iSE = iSO + nInc;

        for (let row = 0; row < nRows; row++) {
            if (!row) {                         // at top (north) edge; restore will be done after the col loop ends
                if (!this.fWrap) {
                    iNO = iNW = iNE = iCellDummy;
                } else {
                    iNO += nIncPerGrid; iNW += nIncPerGrid; iNE += nIncPerGrid;
                }
            } else if (row == nRows - 1) {      // at bottom (south) edge
                if (!this.fWrap) {
                    iSO = iSW = iSE = iCellDummy;
                } else {
                    iSO -= nIncPerGrid; iSW -= nIncPerGrid; iSE -= nIncPerGrid;
                }
            }
            for (let col = 0; col < nCols; col++) {
                if (!col) {                     // at left (west) edge
                    if (!this.fWrap) {
                        iWE = iNW = iSW = iCellDummy;
                    } else {
                        iWE += nIncPerRow; iNW += nIncPerRow; iSW += nIncPerRow;
                    }
                } else if (col == 1) {          // just finished left edge, restore west indexes
                    if (!this.fWrap) {
                        iWE = iCell - nInc; iNW = iNO - nInc; iSW = iSO - nInc;
                    } else {
                        iWE -= nIncPerRow; iNW -= nIncPerRow; iSW -= nIncPerRow;
                    }
                } else if (col == nCols - 1) {  // at right (east) edge; restore will be done after the col loop ends
                    if (!this.fWrap) {
                        iEA = iNE = iSE = iCellDummy;
                    } else {
                        iEA -= nIncPerRow; iNE -= nIncPerRow; iSE -= nIncPerRow;
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
                bufferClone[iCell+1] = buffer[iCell+1];
                bufferClone[iCell+2] = buffer[iCell+2];
                bufferClone[iCell+3] = buffer[iCell+3] | ((buffer[iCell] !== state)? LED.FLAGS.MODIFIED : 0);
                iCell += nInc; iNW += nInc; iNO += nInc; iNE += nInc; iEA += nInc; iSE += nInc; iSO += nInc; iSW += nInc; iWE += nInc;
                if (state == LED.STATE.ON) cAlive++;
            }
            if (!this.fWrap) {
                if (!row) {
                    iNO = iCell - nIncPerRow; iNW = iNO - nInc; iNE = iNO + nInc;
                }
                iEA = iCell + nInc; iNE = iNO + nInc; iSE = iSO + nInc;
            } else {
                if (!row) {
                    iNO -= nIncPerGrid; iNW -= nIncPerGrid; iNE -= nIncPerGrid;
                }
                iEA += nIncPerRow; iNE += nIncPerRow; iSE += nIncPerRow;
            }
        }
        this.assert(iCell == nIncPerGrid);
        this.ledArray.swapBuffers();
        return cAlive;
    }

    /**
     * getCounts()
     *
     * @this {Chip}
     * @returns {Array.<number>}
     */
    getCounts()
    {
        let counts = [0];
        for (let i = 1; i < Chip.COUNTS.length; i++) {
            let elementCount;
            let binding = Chip.COUNTS[i];
            if (elementCount = this.bindings[binding]) {
                counts.push(+elementCount.options[elementCount.selectedIndex].value);
            }
        }
        return counts;
    }

    /**
     * loadPattern(id)
     *
     * If no id is specified, we load the initialization pattern, if any, set via the LCConfig
     * "pattern" property (which, in turn, can be set as URL override, if desired).
     *
     * NOTE: Our initialization pattern is a extended single-string version of the RLE pattern
     * file format: "col/row/width/height/tokens".  The default rule is assumed.
     *
     * @this {Chip}
     * @param {string} [id]
     * @returns {boolean}
     */
    loadPattern(id)
    {
        let ledArray = this.ledArray;
        let iCol = -1, iRow = -1, width, height, rule, sPattern = "";

        if (!id) {
            /*
             * If no id is provided, then we fallback to sPatternInit, which can be either an
             * id (if it doesn't start with a digit) or one of our own extended pattern strings.
             */
            if (!this.sPatternInit.match(/^[0-9]/)) id = this.sPatternInit;
        }

        if (!id) {
            if (!this.sPatternInit) {
                return false;
            }
            let i = 0;
            let aParts = this.sPatternInit.split('/');
            if (aParts.length == 5) {           // extended pattern string
                iCol = +aParts[i++];
                iRow = +aParts[i++];
            }
            if (aParts.length == 3 || aParts.length == 5) {
                width = +aParts[i++];           // conventional pattern string
                height = +aParts[i++];
                sPattern = aParts[i];
            }
            else {
                this.println("unrecognized pattern: " + this.sPatternInit);
                return false;
            }
            rule = this.sRule;  // TODO: If we ever support multiple rules, then allow rule overrides, too
        }
        else {
            let patterns = this.config['patterns'];
            let lines = patterns && patterns[id];
            if (!lines) {
                this.println("unknown pattern: " + id);
                return false;
            }
            this.println("loading pattern '" + id + "'");
            for (let i = 0, n = 0; i < lines.length; i++) {
                let sLine = lines[i];
                if (sLine[0] == '#') {
                    this.println(sLine);
                    continue;
                }
                if (!n++) {
                    let match = sLine.match(/x\s*=\s*([0-9]+)\s*,\s*y\s*=\s*([0-9]+)\s*(?:,\s*rule\s*=\s*(\S+)|)/i);
                    if (!match) {
                        this.println("unrecognized header line");
                        return false;
                    }
                    width = +match[1];
                    height = +match[2];
                    rule = match[3];
                    continue;
                }
                let end = sLine.indexOf('!');
                if (end >= 0) {
                    sPattern += sLine.substr(0, end);
                    break;
                }
                sPattern += sLine;
            }
        }

        if (rule != this.sRule) {
            this.println("unsupported rule: " + rule);
            return false;
        }

        if (iCol < 0) iCol = (ledArray.cols - width) >> 1;
        if (iRow < 0) iRow = (ledArray.rows - height) >> 1;

        if (iCol < 0 || iCol + width > ledArray.cols || iRow < 0 || iRow + height > ledArray.rows) {
            this.printf("pattern too large (%d,%d)\n", width, height);
            return false;
        }

        let i = 0, col = iCol, row = iRow;
        let aTokens = sPattern.split(/([a-z$])/i);

        ledArray.clearBuffer();

        let rgb = [0, 0, 0, 1], counts = 0;
        let fColors = false, fCounts = false;

        /*
         * We could add checks that verify that col and row stay within the bounds of the specified
         * width and height of the pattern, but it's possible that there are some legit patterns out
         * there that didn't get their bounds quite right.  And in any case, no harm can come of it,
         * because setLEDState() will ignore any parameters outside the LED array's bounds.
         */
        while (i < aTokens.length - 1) {
            let n = aTokens[i++];
            let token = aTokens[i++];
            let v = +n, nRepeat = (n === ""? 1 : v);
            while (nRepeat--) {
                let nAdvance = 0, fModified = false;
                switch(token) {
                case '$':
                    fColors = fCounts = false;
                    col = iCol;
                    row++;
                    break;
                case 'C':
                    counts = v;
                    fCounts = true;
                    break;
                case 'R':
                    rgb[0] = v;
                    fColors = true;
                    break;
                case 'G':
                    rgb[1] = v;
                    fColors = true;
                    break;
                case 'B':
                    rgb[2] = v;
                    fColors = true;
                    break;
                case 'A':
                    rgb[3] = v;
                    fColors = true;
                    break;
                case 'b':
                    fModified = ledArray.setLEDState(col, row, LED.STATE.OFF);
                    nAdvance++;
                    break;
                case 'o':
                    fModified = ledArray.setLEDState(col, row, LED.STATE.ON);
                    nAdvance++;
                    break;
                default:
                    this.printf("unrecognized pattern token: %s\n", token);
                    break;
                }
                if (fModified == null) {
                    this.printf("invalid pattern position (%d,%d)\n", col, row);
                } else {
                    if (fColors) {
                        let color = ledArray.getRGBColorString(rgb);
                        ledArray.setLEDColor(col, row, color);
                    }
                    if (fCounts) {
                        ledArray.setLEDCountsPacked(col, row, counts);
                    }
                    col += nAdvance;
                }
            }
        }

        ledArray.drawBuffer(true);
        return true;
    }

    /**
     * onCommand(sCommand)
     *
     * Processes commands for our "mini-debugger".
     *
     * If sCommand is blank (ie, if Enter alone was pressed), then sCommandPrev will be used,
     * but sCommandPrev is set only for certain commands deemed "repeatable" (eg, step and dump
     * commands).
     *
     * @this {Chip}
     * @param {string} sCommand
     * @returns {boolean} (true if processed, false if not)
     */
    onCommand(sCommand)
    {
        let sResult = "";

        if (sCommand == "") {
            sCommand = this.sCommandPrev;
        }
        this.sCommandPrev = "";
        sCommand = sCommand.trim();

        let aCommands = sCommand.split(' ');
        let s = aCommands[0], c = aCommands[1];

        switch(s[0]) {
        case 'c':
            if (c) {
                this.println("set category '" + c + "'");
                this.setCategory(c);
            } else {
                c = this.setCategory();
                if (c) {
                    this.println("cleared category '" + c + "'");
                } else {
                    this.println("no category set");
                }
            }
            break;

        case '?':
            sResult = "available commands:";
            Chip.COMMANDS.forEach(cmd => {sResult += '\n' + cmd;});
            break;

        default:
            if (sCommand) {
                sResult = "unrecognized command '" + sCommand + "' (try '?')";
            }
            break;
        }
        if (sResult) this.println(sResult.trim());
        return true;
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
     * @param {boolean} [fOn] (true to power on, false to power off)
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

    /**
     * savePattern()
     *
     * We save our patterns as a string that is largely compatible with the "Game of Life RLE Format"
     * (refer to http://www.conwaylife.com/w/index.php?title=Run_Length_Encoded), which uses <repetition><tag>
     * pairs to describes runs of identical cells; the <tag> is either 'o' for "alive" cells, 'b' for "dead"
     * cells, or '$' for end of line.
     *
     * We say "largely" compatible because it's not really a goal for our pattern strings to be compatible
     * with any other RLE reader.  For example, we don't break our string into lines of 70 characters or less,
     * so that's already one incompatibility.  Also, we don't attempt to determine the minimum bounding
     * rectangle for the current pattern, because we use these strings to save/restore the entire grid as it
     * originally appeared, not just the pattern within the grid.  Both of those differences can be dealt with
     * in the future with a special RLE-compatibility flag, if we ever care.
     *
     * Moreover, we must deal with grids containing multi-color cells and additional state (eg, internal counters)
     * not found in typical "Game of Life" grids, so we may precede each <repetition><tag> pair with zero or more
     * <value><modifier> pairs, where <modifier> can be:
     *
     *      'R':    red color value (assumed zero if not present)
     *      'G':    green color value (assumed zero if not present)
     *      'B':    blue color value (assumed zero if not present)
     *      'C':    packed count value (ie, internal counts packed into a single unsigned 32-bit number)
     *
     * If we use any of the above modifiers, they are always preceded with a value unless the value is zero
     * (unlike the <repetition><tag> pairs, where a repetition of 1 is assumed if omitted).
     *
     * Also, a modifier remains in effect until modified by another modifier, reducing the amount of
     * "modifier noise" in the pattern string.
     *
     * @this {Chip}
     * @returns {string}
     */
    savePattern()
    {
        let ledArray = this.ledArray;

        let sPattern = "";
        let iCol = 0, iRow = 0;
        let nCols = this.ledArray.cols, nRows = this.ledArray.rows;

        let fColors = !!this.colorArray.length;
        let state, rgb = [0, 0, 0], counts;
        let stateLast = 0, rgbLast = [0, 0, 0, 1], countsLast = 0;
        let statePrev = 0, rgbPrev = [0, 0, 0, 1], countsPrev = 0, nPrev = 0;

        let flushRun = function(fEndRow) {
            let fDelta = false;
            if (rgb[3] == null) rgb[3] = 1;
            if (nPrev) {
                if (fColors) {
                    if (rgb[0] !== rgbPrev[0] || rgb[1] !== rgbPrev[1] || rgb[2] !== rgbPrev[2] || rgb[3] !== rgbPrev[3]) {
                        fDelta = true;
                    }
                    if (counts !== countsPrev) {
                        fDelta = true;
                    }
                }
                if (state !== statePrev) {
                    fDelta = true;
                }
                if (fDelta || fEndRow && statePrev) {
                    if (fColors) {
                        if (rgbLast[0] !== rgbPrev[0]) {
                            rgbLast[0] = rgbPrev[0];
                            sPattern += (rgbPrev[0] || "") + 'R';
                        }
                        if (rgbLast[1] !== rgbPrev[1]) {
                            rgbLast[1] = rgbPrev[1];
                            sPattern += (rgbPrev[1] || "") + 'G';
                        }
                        if (rgbLast[2] !== rgbPrev[2]) {
                            rgbLast[2] = rgbPrev[2];
                            sPattern += (rgbPrev[2] || "") + 'B';
                        }
                        if (rgbLast[3] !== rgbPrev[3]) {
                            rgbLast[3] = rgbPrev[3];
                            sPattern += (rgbPrev[3] || "") + 'A';
                        }
                        if (countsLast !== countsPrev) {
                            countsLast = countsPrev;
                            sPattern += (countsPrev || "") + 'C';
                        }
                    }
                    if (nPrev > 1) sPattern += nPrev;
                    sPattern += (statePrev === LED.STATE.ON? 'o' : 'b');
                    stateLast = statePrev;
                    fDelta = true;
                }
            }
            if (fEndRow) {
                sPattern += '$';
                nPrev = 0;
            } else {
                if (!fDelta) {
                    nPrev++;
                } else {
                    nPrev = 1;
                }
                statePrev = state;
                rgbPrev[0] = rgb[0];
                rgbPrev[1] = rgb[1];
                rgbPrev[2] = rgb[2];
                rgbPrev[3] = rgb[3];
                countsPrev = counts;
            }
        };

        for (let row = 0; row < ledArray.rows; row++) {
            for (let col = 0; col < ledArray.cols; col++) {
                state = ledArray.getLEDState(col, row);
                ledArray.getLEDColorValues(col, row, rgb);
                counts = ledArray.getLEDCountsPacked(col, row);
                flushRun();
            }
            flushRun(true);
        }

        /*
         * Remove all '$' at the beginning of the pattern.
         */
        while (sPattern[0] == '$') {
            iRow++; nRows--;
            sPattern = sPattern.slice(1);
        }

        /*
         * Similarly, remove all '$$' at the end of the pattern.
         */
        while (sPattern.slice(-2) == '$$') {
            nRows--;
            sPattern = sPattern.slice(0, -1);
        }

        sPattern = iCol + '/' + iRow + '/' + nCols + '/' + nRows + '/' + sPattern.slice(0, -1);

        sPattern = sPattern.replace(/\$+$/, '');
        return sPattern;
    }

    /**
     * updateColorPalette(binding)
     *
     * In addition to being called whenever the COLOR_PALETTE or COLOR_SELECTION onChange handler is
     * called, this is also called when any of the color controls are initialized, because we don't know
     * in what order the elements will be bound.
     *
     * @this {Chip}
     * @param {string} [binding] (if set, the selection for the specified binding has changed)
     */
    updateColorPalette(binding)
    {
        let elementPalette = this.bindings[Chip.BINDING.COLOR_PALETTE];
        let elementSelection = this.bindings[Chip.BINDING.COLOR_SELECTION];

        let fPaletteChange = (binding === Chip.BINDING.COLOR_PALETTE);
        if (elementPalette && !elementPalette.options.length) {
            this.addBindingOptions(elementPalette, this.config['colors']);
            fPaletteChange = true;
        }

        if (elementPalette && elementSelection && (!elementSelection.options.length || fPaletteChange)) {
            let sPalette = elementPalette.options[elementPalette.selectedIndex].value;
            this.colorPalette = this.config['colors'][sPalette];
            this.addBindingOptions(elementSelection, this.colorPalette);
        }

        if (elementPalette && elementSelection && elementSelection.options.length) {
            this.colorSelected = elementSelection.options[elementSelection.selectedIndex].value;
            this.updateColorSwatches();
        }
    }

    /**
     * updateColorSelection(color)
     *
     * @this {Chip}
     * @param {string} color
     */
    updateColorSelection(color)
    {
        let elementSelection = this.bindings[Chip.BINDING.COLOR_SELECTION];
        if (elementSelection) {
            let i;
            for (i = 0; i < elementSelection.options.length; i++) {
                if (elementSelection.options[i].value == color) {
                    this.colorSelected = color;
                    if (elementSelection.selectedIndex != i) {
                        elementSelection.selectedIndex = i;
                    }
                    break;
                }
            }
            if (i == elementSelection.options.length) elementSelection.selectedIndex = 0;
        }
    }

    /**
     * updateColorSwatches(binding)
     *
     * @this {Chip}
     * @param {string} [binding]
     */
    updateColorSwatches(binding)
    {
        let i = 1, elementSwatch;
        /*
         * Some machines use only a single swatch called COLOR_SWATCH_SELECTED; update as appropriate.
         */
        if (!binding && this.colorSelected) {
            elementSwatch = this.bindings[Chip.BINDING.COLOR_SWATCH_SELECTED];
            if (elementSwatch) {
                elementSwatch.style.backgroundColor = this.colorSelected;
            }
        }
        /*
         * Other machines use a series of swatches named COLOR_SWATCH + "1", COLOR_SWATCH + "2", etc;
         * for each color in colorPalette, update the next available swatch.
         */
        if (this.colorPalette) {
            for (let idColor in this.colorPalette) {
                let color = this.colorPalette[idColor];
                if (this.colorArray) this.colorArray[i-1] = color;
                let idSwatch = Chip.BINDING.COLOR_SWATCH + i++;
                elementSwatch = this.bindings[idSwatch];
                if (!elementSwatch) break;
                elementSwatch.style.display = "inline-block";
                if (idSwatch == binding) {
                    this.updateColorSelection(color);
                }
                if (color != this.colorSelected) {
                    color = this.ledArray.getRGBAColor(color, 1.0, 0.50);
                }
                elementSwatch.style.backgroundColor = color;
            }
        }
        /*
         * Finally, for any remaining swatches in the series (ie, because the current palette doesn't need
         * them all), hide them.
         */
        while (true) {
            let idSwatch = Chip.BINDING.COLOR_SWATCH + i++;
            let elementSwatch = this.bindings[idSwatch];
            if (!elementSwatch) break;
            elementSwatch.style.display = "none";
        }
    }

    /**
     * updateStatus(fTransition)
     *
     * Update the LED array as needed.
     *
     * Called by Time's updateStatus() function whenever 1) its YIELDS_PER_UPDATE threshold is reached
     * (default is twice per second), 2) a step() operation has just finished (ie, the device is being
     * single-stepped), and 3) a start() or stop() transition has occurred.
     *
     * Of those, all we currently care about are step() and stop() notifications, because we want to make sure
     * the LED display is in sync with the last LED buffer update performed by countNeighbors().  In both of those
     * cases, time has stopped.  If time has NOT stopped, then the LED's normal animator function (ledAnimate())
     * takes care of updating the LED display.
     *
     * @this {Chip}
     * @param {boolean} [fTransition]
     */
    updateStatus(fTransition)
    {
        if (!this.time.isRunning()) {
            this.ledArray.drawBuffer();
        }
    }
}

Chip.BINDING = {
    COLOR_PALETTE:         "colorPalette",
    COLOR_SELECTION:       "colorSelection",
    COLOR_SWATCH:          "colorSwatch",
    COLOR_SWATCH_SELECTED: "colorSwatchSelected",
    COUNT_ON:              "countOn",
    COUNT_OFF:             "countOff",
    COUNT_CYCLE:           "countCycle",
    SAVE_TO_URL:           "saveToURL",
};

Chip.COUNTS = [null, Chip.BINDING.COUNT_ON, Chip.BINDING.COUNT_OFF, Chip.BINDING.COUNT_CYCLE];

Chip.COMMANDS = [
    "c\tset category"
];

Chip.VERSION    = 1.10;
