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
 * @property {boolean} [wrap]
 * @property {string} [rule]
 * @property {string} [pattern]
 * @property {Object} [patterns]
 * @property {string} [symbols]
 * @property {boolean} [toggleColor]
 * @property {Object} [colors]
 */

/**
 * LED Controller Chip
 *
 * @class {Chip}
 * @unrestricted
 * @property {boolean} fWrap
 * @property {string} sRule
 * @property {string} sPattern
 * @property {string} sSymbols
 * @property {boolean} fToggleColor
 * @property {LED} leds
 * @property {Object} colorPalette
 * @property {string} colorDefault (obtained from the leds)
 * @property {string} colorSelected (set by updateColorSelection())
 * @property {Array.<string>} colors
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
         * These are grid "behavior" properties.  If 'wrap' is true, then any off-grid neighbor cell
         * locations are mapped to the opposite edge; otherwise, they are mapped to the LEDs "scratch" row.
         */
        this.fWrap = this.getDefaultBoolean('wrap', false);
        this.sRule = this.getDefaultString('rule', "");
        this.sPattern = this.getDefaultString('pattern', "");
        this.sSymbols = this.getDefaultString('symbols', "");
        
        /*
         * The 'toggleColor' property currently affects only grids that have a color palette: if true,
         * then only an LED's color is toggled; otherwise, only its state (ie, ON or OFF) is toggled.
         */
        this.fToggleColor = this.getDefaultBoolean('toggleColor', false);
        
        /*
         * Since all bindings should have been completed by super(), we can make a preliminary call
         * to getCounts() to determine how many counts are stored per LED, to preallocate a count buffer.
         */
        this.countBuffer = new Array(this.getCounts().length);

        /*
         * Get access to the LED device, so we can update its display.
         */
        let leds = /** @type {LED} */ (this.findDeviceByClass(Machine.CLASS.LED));
        if (leds) {
            this.leds = leds;

            /*
             * If loadPattern() didn't load anything into the LED array, then call
             * clearBuffer(true), which performs a combination of clearBuffer() and drawBuffer().
             */
            if (!this.loadPattern()) leds.clearBuffer(true);

            /*
             * Get access to the Input device, so we can add our click functions.
             */
            this.input = /** @type {Input} */ (this.findDeviceByClass(Machine.CLASS.INPUT));
            if (this.input) {
                this.input.addClick(this.onPower.bind(this), this.onReset.bind(this));
            }

            let configInput = {
                "class":        "Input",
                "location":     [0, 0, leds.widthView, leds.heightView, leds.colsView, leds.rowsView],
                "drag":         !!(this.input && this.input.fDrag),
                "scroll":       !!(this.input && this.input.fScroll),
                "hexagonal":    leds.fHexagonal,
                "bindings":     {"surface": leds.getBindingID(LED.BINDING.CONTAINER)}
            };

            let chip = this;
            this.ledInput = new Input(idMachine, idDevice + "Input", configInput);
            this.ledInput.addInput(function onLEDInput(col, row) {
                chip.onInput(col, row);
            });

            this.colors = [];
            this.colorDefault = leds.getDefaultColor();
            this.updateColorSelection(this.colorDefault);
            this.updateColorSwatches();
            this.updateBackgroundImage(this.config[Chip.BINDING.IMAGE_SELECTION]);

            /*
             * Get access to the Time device, so we can give it our clocker() function.
             */
            this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
            if (this.time) {
                this.time.addClocker(this.clocker.bind(this));
                this.time.addUpdater(this.updateStatus.bind(this));
            }

            /*
             * Establish an onCommand() handler.
             */
            this.addHandler(Device.HANDLER.COMMAND, this.onCommand.bind(this));

            this.iSymbolNext = this.nColsRemaining = 0;
        }
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Chip}
     * @param {string} binding
     * @param {Element} element
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

        case Chip.BINDING.IMAGE_SELECTION:
            element.onchange = function onImageChange() {
                chip.updateBackgroundImage();
            };
            break;

        case Chip.BINDING.PATTERN_SELECTION:
            this.addBindingOptions(element, this.buildPatternOptions(this.config[Chip.BINDING.PATTERN_SELECTION]), false, this.config['pattern']);
            element.onchange = function onPatternChange() {
                chip.updatePattern();
            };
            break;

        case Chip.BINDING.SAVE:
            element.onclick = function onClickSave() {
                let sPattern = chip.savePattern(true);
                let elementSymbol = chip.bindings[Chip.BINDING.SYMBOL_INPUT];
                if (elementSymbol) {
                    sPattern = '"' + elementSymbol.value + '":"' + sPattern + '",';
                }
                chip.println(sPattern);
            };
            break;

        case Chip.BINDING.SAVE_TO_URL:
            element.onclick = function onClickSaveToURL() {
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

        case Chip.BINDING.SYMBOL_INPUT:
            element.onkeypress = function onChangeSymbol(event) {
                element.value = String.fromCharCode(event.charCode);
                let elementPreview = chip.bindings[Chip.BINDING.SYMBOL_PREVIEW];
                if (elementPreview) elementPreview.textContent = element.value;
                event.preventDefault();
            };
            break;

        default:
            if (binding.startsWith(Chip.BINDING.COLOR_SWATCH)) {
                element.onclick = function onClickColorSwatch() {
                    chip.updateColorSwatches(binding);
                };
                break;
            }
            /*
             * This code allows you to bind a specific control (ie, a button) to a specific pattern;
             * however, it's preferable to use the PATTERN_SELECTION binding above, and use a single list.
             */
            let patterns = this.config[Chip.BINDING.PATTERN_SELECTION];
            if (patterns && patterns[binding]) {
                element.onclick = function onClickPattern() {
                    chip.loadPattern(binding);
                };
            }
        }
        super.addBinding(binding, element);
    }

    /**
     * buildPatternOptions(patterns)
     *
     * @this {Chip}
     * @param {Object} patterns
     * @returns {Object}
     */
    buildPatternOptions(patterns)
    {
        let options = {};
        for (let id in patterns) {
            let name = id;
            let lines = patterns[id];
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].indexOf("#N") == 0) {
                    name = lines[i].substr(2).trim();
                    break;
                }
            }
            options[name] = id;
        }
        return options;
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
                case Chip.RULES.ANIM4:
                    nAlive = this.doCycling();
                    break;
                case Chip.RULES.LEFT1:
                    nAlive = this.doShifting(1);
                    break;
                case Chip.RULES.LIFE1:
                    nAlive = this.doCounting();
                    break;
                }
                if (!nCyclesTarget) this.println("living cells: " + nAlive);
                nCyclesClocked += 1;
            } while (nCyclesClocked < nCyclesTarget);
        }
        return nCyclesClocked;
    }

    /**
     * doCounting()
     *
     * Implements rule LIFE1 (straight-forward implementation of Conway's Game of Life rule "B3/S23").
     * 
     * This iterates row-by-row and column-by-column.  It takes advantage of the one-dimensional LED
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
    doCounting()
    {
        let cAlive = 0;
        let buffer = this.leds.getBuffer();
        let bufferClone = this.leds.getBufferClone();
        let nCols = this.leds.cols;
        let nRows = this.leds.rows;
        /*
         * The number of LED buffer elements per cell is an LED implementation detail that should not be
         * assumed, so we obtain it from the LED object, and use it to calculate the per-cell increment,
         * per-row increment, and per-grid increment; the latter gives us the offset of the LED buffer's
         * scratch row, which we rely upon when wrap is turned off.
         */
        let nInc = this.leds.nBufferInc;
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
        this.leds.swapBuffers();
        return cAlive;
    }

    /**
     * doCycling()
     *
     * Implements rule ANIM4 (animation using 4-bit counters for state/color cycling).
     *
     * @this {Chip}
     * @returns {number}
     */
    doCycling()
    {
        let cAlive = 0;
        let leds = this.leds;
        let nCols = leds.cols, nRows = leds.rows;
        let counts = this.countBuffer;
        for (let row = 0; row < nRows; row++) {
            for (let col = 0; col < nCols; col++) {
                if (!leds.getLEDCounts(col, row, counts)) continue;
                cAlive++;
                /*
                 * Here's the layout of each cell's counts (which mirrors the Chip.COUNTS layout):
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
                else {
                    let state = leds.getLEDState(col, row), stateNew = state || 0;
                    switch(state) {
                    case LED.STATE.ON:
                        stateNew = LED.STATE.OFF;
                        counts[0] = counts[2];
                        if (counts[0]) {
                            counts[0]--;
                            break;
                        }
                        /* falls through */
                    case LED.STATE.OFF:
                        if (counts[3]) {
                            let color = leds.getLEDColor(col, row);
                            let iColor = this.colors.indexOf(color);
                            if (iColor >= 0) {
                                iColor = (iColor + counts[3]);
                                while (iColor >= this.colors.length) iColor -= this.colors.length;
                                leds.setLEDColor(col, row, this.colors[iColor]);
                            }
                        }
                        stateNew = LED.STATE.ON;
                        counts[0] = counts[1];
                        if (counts[0]) {
                            counts[0]--;
                        }
                        break;
                    }
                    if (stateNew !== state) leds.setLEDState(col, row, stateNew);
                }
                leds.setLEDCounts(col, row, counts);
            }
        }
        return cAlive;
    }

    /**
     * doShifting()
     *
     * Implements rule LEFT1 (shift left one cell).
     * 
     * Some of the state we maintain outside of the LED array includes the number of columns of data remaining in
     * the "offscreen" portion of the array (nColsRemaining).  Whenever we see that it's zero, we load it with the
     * next chuck of data (ie, the LED pattern for the next symbol in sSymbols).
     * 
     * @this {Chip}
     * @param {number} [shift] (default is 1, for a leftward shift of one cell)
     * @returns {number}
     */
    doShifting(shift = 1)
    {
        let cAlive = 0;
        let leds = this.leds;
        let nCols = leds.cols, nRows = leds.rows;

        if (!this.nColsRemaining) {
            if (this.sSymbols && this.iSymbolNext < this.sSymbols.length) {
                this.nColsRemaining = this.loadPatternString(leds.colsView, 0, Chip.SYMBOLS[this.sSymbols[this.iSymbolNext++]], true);
            }
        }
        for (let row = 0; row < nRows; row++) {
            for (let col = 0; col < nCols - shift; col++) {
                let stateLeft = leds.getLEDState(col, row) || LED.STATE.OFF;
                if (stateLeft) cAlive++;
                let stateRight = leds.getLEDState(col + 1, row) || LED.STATE.OFF;
                leds.setLEDState(col, row, stateRight);
                leds.setLEDState(col + 1, row, stateLeft);
            }
        }
        if (this.nColsRemaining) this.nColsRemaining--;
        return cAlive;
    }

    /**
     * getCount(binding)
     * 
     * @this {Chip}
     * @param {string} binding 
     * @returns {number}
     */
    getCount(binding)
    {
        let count = 0;
        let element = this.bindings[binding];
        if (element && element.options) {
            let option = element.options[element.selectedIndex];
            count = option && +option.value || 0;
        }
        return count;
    }
    
    /**
     * getCounts()
     *
     * @this {Chip}
     * @param {boolean} [fAdvance]
     * @returns {Array.<number>}
     */
    getCounts(fAdvance)
    {
        let init = 0;
        if (fAdvance) {
            let element = this.bindings[Chip.BINDING.COUNT_INIT];
            if (element && element.options) {
                let option = element.options[element.selectedIndex];
                if (option) {
                    init = +option.value || 0;
                    /*
                     * A more regular pattern results if we stick to a range of counts equal to the
                     * sum of the ON and OFF counts.  Let's get that sum now.  However, this assumes
                     * that the user is starting with an initial count of ZERO.  Also, we're only going
                     * to do this if the sum of ON and OFF counts is EVEN; if it's odd, then we'll let
                     * the user do their thing.
                     */
                    element.selectedIndex++;
                    let range = this.getCount(Chip.BINDING.COUNT_ON) + this.getCount(Chip.BINDING.COUNT_OFF);
                    let fReset = (!(range & 1) && init == range - 1);
                    if (fReset || element.selectedIndex < 0 || element.selectedIndex >= element.options.length) {
                        element.selectedIndex = 0;
                    }
                }
            }
        }
        let counts = [init];
        for (let i = 1; i < Chip.COUNTS.length; i++) {
            counts.push(this.getCount(Chip.COUNTS[i]));
        }
        return counts;
    }

    /**
     * loadPattern(id)
     *
     * If no id is specified, load the initialization pattern, if any, set via the LCConfig
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
        let leds = this.leds;
        let iCol = -1, iRow = -1, width, height, rule, sPattern = "";

        if (!id) {
            /*
             * If no id is provided, then we fallback to sPattern, which can be either an
             * id (if it doesn't start with a digit) or one of our own extended pattern strings.
             */
            if (!this.sPattern.match(/^[0-9]/)) id = /** @type {string} */ (this.sPattern);
        }

        if (!id) {
            if (!this.sPattern) {
                return false;
            }
            let i = 0;
            let aParts = this.sPattern.split('/');
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
                this.println("unrecognized pattern: " + this.sPattern);
                return false;
            }
            rule = this.sRule;  // TODO: If we ever support multiple rules, then allow rule overrides, too
        }
        else {
            let patterns = this.config[Chip.BINDING.PATTERN_SELECTION];
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

        if (iCol < 0) iCol = (leds.cols - width) >> 1;
        if (iRow < 0) iRow = (leds.rows - height) >> 1;

        if (iCol < 0 || iCol + width > leds.cols || iRow < 0 || iRow + height > leds.rows) {
            this.printf("pattern too large (%d,%d)\n", width, height);
            return false;
        }

        return this.loadPatternString(iCol, iRow, sPattern) > 0;
    }

    /**
     * loadPatternString(col, row, sPattern, fOverwrite)
     *
     * @this {Chip}
     * @param {number} col
     * @param {number} row
     * @param {string} sPattern
     * @param {boolean} [fOverwrite]
     * @returns {number} (number of columns changed, 0 if none)
     */
    loadPatternString(col, row, sPattern, fOverwrite = false)
    {
        let leds = this.leds;
        let rgb = [0, 0, 0, 1], counts = 0;
        let fColors = false, fCounts = false;

        /*
         * TODO: Cache these pattern splits.
         */
        let aTokens = sPattern.split(/([a-z$])/i);
        
        if (!fOverwrite) leds.clearBuffer();
        
        /*
         * We could add checks that verify that col and row stay within the bounds of the specified
         * width and height of the pattern, but it's possible that there are some legit patterns out
         * there that didn't get their bounds quite right.  And in any case, no harm can come of it,
         * because setLEDState() will ignore any parameters outside the LED's array bounds.
         */
        let i = 0, iCol = col, colMax = 0;
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
                    fModified = leds.setLEDState(col, row, LED.STATE.OFF);
                    nAdvance++;
                    break;
                case 'o':
                    fModified = leds.setLEDState(col, row, LED.STATE.ON);
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
                        let color = leds.getRGBColorString(rgb);
                        leds.setLEDColor(col, row, color);
                    }
                    if (fCounts) {
                        leds.setLEDCountsPacked(col, row, counts);
                    }
                    if (colMax < col) colMax = col;
                    col += nAdvance;
                }
            }
        }

        if (!fOverwrite) leds.drawBuffer(true);

        return ((colMax -= (iCol - 1)) < 0? 0 : colMax);
    }
    
    /**
     * loadState(state)
     *
     * If any saved values don't match (possibly overridden), abandon the given state and return false.
     * 
     * @this {Chip}
     * @param {Object|Array|null} state
     * @returns {boolean}
     */
    loadState(state)
    {
        if (state) {
            let stateChip = state['stateChip'] || state[0];
            if (!stateChip || !stateChip.length) {
                this.println("Invalid saved state");
                return false;
            }
            let version = stateChip.shift();
            if ((version|0) !== (Chip.VERSION|0)) {
                this.printf("Saved state version mismatch: %3.2f\n", version);
                return false;
            }
            // try {
            // } catch(err) {
            //     this.println("Chip state error: " + err.message);
            //     return false;
            // }
            if (!Device.getURLParms()['pattern'] && !Device.getURLParms()[Chip.BINDING.IMAGE_SELECTION]) {
                let stateLEDs = state['stateLEDs'] || state[1];
                if (stateLEDs && this.leds && !this.sSymbols) {
                    if (!this.leds.loadState(stateLEDs)) return false;
                }
            }
        }
        return true;
    }

    /**
     * onCommand(aTokens, machine)
     *
     * Processes commands for our "mini-debugger".
     *
     * @this {Chip}
     * @param {Array.<string>} aTokens
     * @param {Device} [machine]
     * @returns {boolean} (true if processed, false if not)
     */
    onCommand(aTokens, machine)
    {
        let sResult = "";
        let s = aTokens[1], c = aTokens[2];

        switch(s[0]) {
        case '?':
            sResult = "";
            Chip.COMMANDS.forEach(cmd => {sResult += '\n' + cmd;});
            if (sResult) sResult = "available commands:" + sResult;
            break;

        default:
            if (aTokens[0]) {
                sResult = "unrecognized command '" + aTokens[0] + "' (try '?')";
            }
            break;
        }
        if (sResult) this.println(sResult.trim());
        return true;
    }

    /**
     * onInput(col, row)
     *
     * @this {Chip}
     * @param {number} col
     * @param {number} row
     */
    onInput(col, row)
    {
        let leds = this.leds;
        if (col >= 0 && row >= 0) {
            if (this.colorSelected) {
                if (!leds.setLEDColor(col, row, this.colorSelected)) {
                    if (this.fToggleColor) {
                        leds.setLEDColor(col, row);
                    } else {
                        leds.setLEDState(col, row, LED.STATE.ON - leds.getLEDState(col, row));
                    }
                } else {
                    leds.setLEDState(col, row, LED.STATE.ON);
                }
            }
            else {
                leds.setLEDState(col, row, LED.STATE.ON - leds.getLEDState(col, row));
            }
            let fAdvance = !!leds.getLEDState(col, row);
            leds.setLEDCounts(col, row, this.getCounts(fAdvance));
            leds.drawBuffer();
        }
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
        if (this.time) {
            if (fOn) {
                this.time.start();
            } else {
                this.time.stop();
            }
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
        this.leds.clearBuffer(true);
    }

    /**
     * onRestore()
     *
     * @this {Chip}
     */
    onRestore()
    {
        this.loadState(this.loadLocalStorage());
    }

    /**
     * onSave()
     *
     * @this {Chip}
     */
    onSave()
    {
        this.saveLocalStorage(this.saveState());
    }

    /**
     * savePattern(fMinWidth, fMinHeight)
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
     * @param {boolean} [fMinWidth] (set to true to determine the minimum width)
     * @param {boolean} [fMinHeight] (set to true to determine the minimum height)
     * @returns {string}
     */
    savePattern(fMinWidth, fMinHeight)
    {
        let leds = this.leds;

        let sPattern = "";
        let iCol = 0, iRow = 0;
        let nCols = this.leds.cols, nRows = this.leds.rows;

        let fColors = !!this.colors.length;
        let state, rgb = [0, 0, 0], counts;
        let stateLast = 0, rgbLast = [0, 0, 0, 1], countsLast = 0;
        let statePrev = 0, rgbPrev = [0, 0, 0, 1], countsPrev = 0, nPrev = 0;

        /**
         * flushRun(fEndRow)
         * 
         * @param {boolean} [fEndRow]
         */
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

        /*
         * Before we begin, see if either fMinWidth or fMinHeight are set, requiring a bounds prescan.
         */
        let colMin = 0, colMax = leds.cols - 1;
        let rowMin = 0, rowMax = leds.rows - 1;
        if (fMinWidth || fMinHeight) {
            if (fMinWidth) {
                colMin = colMax; colMax = 0;
            }
            if (fMinHeight) {
                rowMin = rowMax; rowMax = 0;
            }
            for (let row = 0; row < leds.rows; row++) {
                for (let col = 0; col < leds.cols; col++) {
                    state = leds.getLEDState(col, row);
                    if (state) {
                        if (fMinWidth) {
                            if (colMin > col) colMin = col;
                            if (colMax < col) colMax = col;
                        }
                        if (fMinHeight) {
                            if (rowMin > row) rowMin = row;
                            if (rowMax < row) rowMax = row;
                        }
                    }
                }
            }
            nCols = colMax - colMin + 1;
            nRows = rowMax - rowMin + 1;
            if (nCols < 0) nCols = 0;
            if (nRows < 0) nRows = 0;
        }

        /*
         * Begin pattern generation.
         */
        for (let row = rowMin; row <= rowMax; row++) {
            for (let col = colMin; col <= colMax; col++) {
                state = leds.getLEDState(col, row);
                leds.getLEDColorValues(col, row, rgb);
                counts = leds.getLEDCountsPacked(col, row);
                flushRun();
            }
            flushRun(true);
        }

        /*
         * Remove all '$' at the beginning of the pattern, if we're asked for the minimum height (or no minimums at all)
         */
        if (fMinHeight || !fMinWidth) {
            while (sPattern[0] == '$') {
                iRow++; nRows--;
                sPattern = sPattern.slice(1);
            }
        }

        /*
         * Similarly, remove all '$$' at the end of the pattern.
         */
        while (sPattern.slice(-2) == '$$') {
            nRows--;
            sPattern = sPattern.slice(0, -1);
        }
        if (sPattern == '$') nRows = 0;

        /*
         * If we were asked for either the minimum width or height, then don't bother including starting col and row (which
         * we only want for patterns used to save/restore entire grids).
         */
        sPattern = ((fMinWidth || fMinHeight)? "" : (iCol + '/' + iRow + '/')) + nCols + '/' + nRows + '/' + sPattern.slice(0, -1);
        sPattern = sPattern.replace(/\$+$/, '');
        return sPattern;
    }

    /**
     * saveState()
     *
     * @this {Chip}
     * @returns {Array}
     */
    saveState()
    {
        let state = [[],[]];
        let stateChip = state[0];
        let stateLEDs = state[1];
        stateChip.push(Chip.VERSION);
        if (this.leds) this.leds.saveState(stateLEDs);
        return state;
    }

    /**
     * updateBackgroundImage(sImage)
     *
     * @this {Chip}
     * @param {string} [sImage]
     */
    updateBackgroundImage(sImage)
    {
        let element = this.bindings[Chip.BINDING.IMAGE_SELECTION];
        if (element && element.options.length) {
            if (sImage) {
                for (let i = 0; i < element.options.length; i++) {
                    if (element.options[i].value == sImage) {
                        element.selectedIndex = i;
                        break;
                    }
                }
            }
            sImage = element.options[element.selectedIndex].value;
            this.leds.setContainerStyle('backgroundImage', sImage? ("url('" + sImage + "')") : "none");
        }
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
            this.addBindingOptions(elementPalette, this.config['colors'], true);
            fPaletteChange = true;
        }

        if (elementPalette && elementSelection && (!elementSelection.options.length || fPaletteChange)) {
            let sPalette = elementPalette.options[elementPalette.selectedIndex].value;
            this.colorPalette = this.config['colors'][sPalette];
            for (let color in this.colorPalette) {
                let sColorOverride = this.config[color.toLowerCase()];
                if (sColorOverride) {
                    if (sColorOverride[0] != '#') sColorOverride = '#' + sColorOverride;
                    this.println("overriding color '" + color + "' with " + sColorOverride + " (formerly " + this.colorPalette[color] + ")");
                    this.colorPalette[color] = sColorOverride;
                }
            }
            this.addBindingOptions(elementSelection, this.colorPalette, true);
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
        let element = this.bindings[Chip.BINDING.COLOR_SELECTION];
        if (element) {
            let i;
            for (i = 0; i < element.options.length; i++) {
                if (element.options[i].value == color) {
                    this.colorSelected = color;
                    if (element.selectedIndex != i) {
                        element.selectedIndex = i;
                    }
                    break;
                }
            }
            if (i == element.options.length) element.selectedIndex = 0;
        }
    }

    /**
     * updateColorSwatches(binding)
     *
     * @this {Chip}
     * @param {string} [binding] (set if a specific color swatch was just clicked)
     */
    updateColorSwatches(binding)
    {
        let i = 1, elementSwatch;
        /*
         * Some machines use a single swatch called COLOR_SWATCH_SELECTED; update as appropriate.
         */
        if (!binding) {
            if (this.colorSelected) {
                elementSwatch = this.bindings[Chip.BINDING.COLOR_SWATCH_SELECTED];
                if (elementSwatch) {
                    elementSwatch.style.backgroundColor = this.colorSelected;
                }
            }
        }
        /*
         * Other machines use a series of swatches named COLOR_SWATCH + "1", COLOR_SWATCH + "2", etc;
         * for each color in colorPalette, update the next available swatch.
         */
        if (this.colorPalette) {
            // this.println("updateColorSwatches(" + this.colorSelected + ")");
            for (let idColor in this.colorPalette) {
                let color = this.colorPalette[idColor];
                if (this.colors) this.colors[i-1] = color;
                let idSwatch = Chip.BINDING.COLOR_SWATCH + i++;
                elementSwatch = this.bindings[idSwatch];
                if (!elementSwatch) break;
                elementSwatch.style.display = "inline-block";
                if (idSwatch == binding) {
                    this.updateColorSelection(color);
                }
                if (binding && binding != idSwatch || color != this.colorSelected) {
                    color = this.leds.getRGBAColor(color, 1.0, 0.50);
                }
                elementSwatch.style.backgroundColor = color;
                // this.println("swatch '" + idSwatch + "' updated to color '" + color + "'");
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
     * updatePattern()
     *
     * @this {Chip}
     */
    updatePattern()
    {
        let element = this.bindings[Chip.BINDING.PATTERN_SELECTION];
        if (element && element.options.length) {
            let sPattern = element.options[element.selectedIndex].value;
            if (!sPattern) {
                this.onReset();
            } else {
                this.loadPattern(sPattern);
            }
        }
    }

    /**
     * updateStatus(fTransition)
     *
     * Update the LEDs as needed.
     *
     * Called by Time's updateStatus() function whenever 1) its YIELDS_PER_UPDATE threshold is reached
     * (default is twice per second), 2) a step() operation has just finished (ie, the device is being
     * single-stepped), and 3) a start() or stop() transition has occurred.
     *
     * Of those, all we currently care about are step() and stop() notifications, because we want to make sure
     * the LED display is in sync with the last LED buffer update.  In both of those cases, time has stopped.
     * If time has NOT stopped, then the LED's normal animator function (ledAnimate()) takes care of updating
     * the LED display.
     *
     * @this {Chip}
     * @param {boolean} [fTransition]
     */
    updateStatus(fTransition)
    {
        if (!this.time.isRunning()) {
            this.leds.drawBuffer();
        }
    }
}

Chip.BINDING = {
    COLOR_PALETTE:          "colorPalette",
    COLOR_SELECTION:        "colorSelection",
    COLOR_SWATCH:           "colorSwatch",
    COLOR_SWATCH_SELECTED:  "colorSwatchSelected",
    COUNT_INIT:             "countInit",
    COUNT_ON:               "countOn",
    COUNT_OFF:              "countOff",
    COUNT_CYCLE:            "countCycle",
    IMAGE_SELECTION:        "backgroundImage",
    PATTERN_SELECTION:      "patterns",
    SYMBOL_INPUT:           "symbolInput",
    SYMBOL_PREVIEW:         "symbolPreview",
    SAVE:                   "save",
    SAVE_TO_URL:            "saveToURL"
};

Chip.COUNTS = [null, Chip.BINDING.COUNT_ON, Chip.BINDING.COUNT_OFF, Chip.BINDING.COUNT_CYCLE];

Chip.COMMANDS = [];

Chip.RULES = {
    ANIM4:      "A4",       // animation using 4-bit counters for state/color cycling
    LEFT1:      "L1",       // shift left one cell
    LIFE1:      "B3/S23"    // Game of Life v1.0 (births require 3 neighbors, survivors require 2 or 3)
};

/*
 * Symbols can be formed with the following 16x16 grid patterns.
 */
Chip.SYMBOLS = {
    "A": "10/14/$3b4o$2bo4bo$2bo4bo$bo6bo$bo6bo$o8bo$o8bo$o8bo$10o$o8bo$o8bo$o8bo$o8bo",
    "B": "10/14/$7o$o6bo$o7bo$o7bo$o7bo$o6bo$8o$o7bo$o8bo$o8bo$o8bo$o8bo$9o",
    "C": "8/14/$2b6o$bo$o$o$o$o$o$o$o$o$o$bo$2b6o",
    "D": "10/14/$8o$o7bo$o8bo$o8bo$o8bo$o8bo$o8bo$o8bo$o8bo$o8bo$o8bo$o7bo$8o",
    "E": "8/14/$8o$o$o$o$o$o$7o$o$o$o$o$o$8o",
    "F": "8/14/$8o$o$o$o$o$o$o$7o$o$o$o$o$o",
    "G": "9/14/$2b6o$bo$o$o$o$o$o$o$o6b2o$o7bo$o7bo$bo6bo$2b7o",
    "H": "10/14/$o8bo$o8bo$o8bo$o8bo$o8bo$o8bo$10o$o8bo$o8bo$o8bo$o8bo$o8bo$o8bo",
    "I": "7/14/$7o$3bo$3bo$3bo$3bo$3bo$3bo$3bo$3bo$3bo$3bo$3bo$7o",
    "J": "9/14/$8bo$8bo$8bo$8bo$8bo$8bo$8bo$8bo$o7bo$o7bo$o7bo$bo5bo$2b5o"
};

Chip.VERSION    = 1.11;

MACHINE = "LEDs";
