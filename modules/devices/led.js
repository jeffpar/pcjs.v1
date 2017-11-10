/**
 * @fileoverview Simulates LEDs
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
 * @typedef {Object} LEDConfig
 * @property {string} class
 * @property {Object} bindings
 * @property {number} type
 * @property {number} width
 * @property {number} height
 * @property {number} cols
 * @property {number} rows
 * @property {string} color
 * @property {string} backgroundColor
 * @property {string} fixedSize
 */

/**
 * The ultimate goal is to provide support for a variety of LED types, such as:
 *
 * 1) LED Light (single light)
 * 2) LED Array (two-dimensional)
 * 3) LED Digits (1 or more 7-segment digits)
 *
 * The initial goal is to manage a 12-element array of 7-segment LED digits for the TI-57.
 *
 * We create a "view" canvas element inside the specified "container" element, along with a "grid" canvas
 * where all the real drawing occurs; drawGrid() then renders the "grid" canvas onto the "view" canvas.
 *
 * Internally, our LED digits have a width and height of 96 and 128.  Those are "grid" dimensions which
 * cannot be changed, because our table of drawing coordinates in LED.SEGMENT are hard-coded for those
 * dimensions.  The cell width and height that are specified as part of the LEDConfig are "view" dimensions,
 * which usually match the grid dimensions, but you're welcome to scale them up or down; the browser's
 * drawImage() function takes care of that.
 *
 * There is a low-level function, drawGridSegment(), for drawing specific LED segments of specific digits;
 * generally, you start with clearGrid(), draw all the segments for a given update, and then call drawGrid()
 * to make them visible.
 *
 * However, our Chip device operates at a higher level.  We provide a "buffer" of character data representing
 * the fully-formed characters that each of the LED cells should display, which the Chip updates by calling
 * setBuffer().  Then at whatever display refresh rate is set (typically 60Hz), drawBuffer() is called to see
 * if the buffer contents have been modified since the last refresh, and if so, it converts the contents of
 * the buffer to a string and calls drawString().
 *
 * This buffering strategy, combined with the buffer "tickled" flag (see below), not only makes life
 * simple for the Chip device, but also simulates how the display goes blank for short periods of time while
 * the Chip is busy performing calculations.
 *
 * @class {LED}
 * @unrestricted
 * @property {LEDConfig} config
 * @property {number} type (one of the LED.TYPE values)
 * @property {number} width (default is 96)
 * @property {number} height (default is 128)
 * @property {number} cols (default is 1)
 * @property {number} rows (default is 1)
 * @property {string} color (default is "red")
 * @property {string} backgroundColor (default is "black")
 * @property {number} widthView (computed)
 * @property {number} heightView (computed)
 * @property {number} widthGrid (computed)
 * @property {number} heightGrid (computed)
 * @property {HTMLCanvasElement} canvasView
 * @property {CanvasRenderingContext2D} contextView
 * @property {HTMLCanvasElement} canvasGrid
 * @property {CanvasRenderingContext2D} contextGrid
 * @property {{
 *  container: HTMLElement|undefined
 * }} bindings
 * @property {Array.<string>} buffer
 * @property {boolean} fBufferModified
 * @property {boolean} fTickled
 */
class LED extends Device {
    /**
     * LED(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "display": {
     *        "class": "LED",
     *        "type": 3,
     *        "cols": 12,
     *        "rows": 1,
     *        "color": "red",
     *        "backgroundColor": "black",
     *        "bindings": {
     *          "container": "displayTI57"
     *        }
     *      }
     *
     * @this {LED}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {LEDConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, LED.VERSION, config);

        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
        if (this.time) {
            this.time.addAnimator(this.drawBuffer.bind(this));
        }

        let container = this.bindings[LED.BINDING.CONTAINER];
        if (container) {
            let canvasView = /** @type {HTMLCanvasElement} */ (document.createElement("canvas"));
            if (canvasView == undefined || !canvasView.getContext) {
                container.innerHTML = "Browser missing HTML5 canvas support";
            } else {
                this.canvasView = canvasView;

                this.type = this.config['type'];
                this.width = this.config['width'] || 96;
                this.height = this.config['height'] || 128;
                this.cols = this.config['cols'] || 1;
                this.rows = this.config['rows'] || 1;
                this.widthView = this.width * this.cols;
                this.heightView = this.height * this.rows;
                this.color = (this.config['color'] || "red");
                this.backgroundColor = (this.backgroundColor || "black");

                if (!this.config['fixedSize']) {
                    canvasView.setAttribute("class", "pcjs-canvas");
                }
                canvasView.setAttribute("width", this.widthView.toString());
                canvasView.setAttribute("height", this.heightView.toString());
                canvasView.style.backgroundColor = this.backgroundColor;
                container.appendChild(canvasView);
                this.contextView = /** @type {CanvasRenderingContext2D} */ (canvasView.getContext("2d"));

                /*
                 * canvasGrid is where all LED segments are composited; then they're drawn onto canvasView.
                 */
                this.canvasGrid = /** @type {HTMLCanvasElement} */ (document.createElement("canvas"));
                if (this.canvasGrid) {
                    this.canvasGrid.width = this.widthGrid = LED.CELL.WIDTH * this.cols;
                    this.canvasGrid.height = this.heightGrid = LED.CELL.HEIGHT * this.rows;
                    this.contextGrid = this.canvasGrid.getContext("2d");
                }

                /*
                 * This records LED cell changes via setBuffer().  It contains two per elements per cell;
                 * the first records the primary character (eg, a digit) and the second records the secondary
                 * character, if any (eg, a decimal point).
                 */
                this.buffer = new Array(this.rows * this.cols * 2);

                /*
                 * fBufferModified is straightforward: set to true by any setBuffer() call that actually
                 * changed something in the buffer, set to false after every drawBuffer() call, periodic or
                 * otherwise.
                 *
                 * fTickled is a flag which, under normal (idle) circumstances, will constantly be set to
                 * true by periodic DISP calls to setBuffer(); we clear it after every periodic drawBuffer(),
                 * so if the machine fails to execute a setBuffer() in a timely manner, we will see that
                 * fTickled hasn't been "tickled", and automatically blank the screen.
                 */
                this.fBufferModified = this.fTickled = false;
            }
        }
    }

    /**
     * clearBuffer(fDraw)
     *
     * @this {LED}
     * @param {boolean} [fDraw]
     */
    clearBuffer(fDraw)
    {
        let i = 0;
        while (i < this.buffer.length) {
            this.buffer[i++] = ' ';
            this.buffer[i++] = '';
            this.fBufferModified = this.fTickled = true;
        }
        if (fDraw) this.drawBuffer();
    }

    /**
     * clearGrid()
     *
     * @this {LED}
     */
    clearGrid()
    {
        this.contextGrid.fillStyle = this.backgroundColor;
        this.contextGrid.fillRect(0, 0, this.widthGrid, this.heightGrid);
    }

    /**
     * drawBuffer()
     *
     * This is our periodic (60Hz) redraw function; however, it can also be called synchronously
     * (eg, see clearBuffer()).  The other important periodic side-effect of this function is clearing
     * fTickled, so that if no other setBuffer() calls occur between now and the next drawBuffer(),
     * an automatic clearBuffer() will be triggered.  This simulates the normal blanking of the screen
     * whenever the machine performs lengthy calculations, because for the LED display to remain on,
     * the machine must perform a DISP operation at least 30-60 times per second.
     *
     * @this {LED}
     */
    drawBuffer()
    {
        if (this.fBufferModified) {
            let s = "", i = 0;
            while (i < this.buffer.length) {
                s += this.buffer[i++] || ' ';
                s += this.buffer[i++] || '';
            }
            this.fBufferModified = false;
            this.drawString(s);
        }
        else if (!this.fTickled) {
            this.clearBuffer(true);
        }
        this.fTickled = false;
    }

    /**
     * drawGrid()
     *
     * @this {LED}
     */
    drawGrid()
    {
        this.contextView.drawImage(this.canvasGrid, 0, 0, this.widthGrid, this.heightGrid, 0, 0, this.widthView, this.heightView);
    }

    /**
     * drawGridSegment(idSeg, col, row)
     *
     * @this {LED}
     * @param {string} idSeg (eg, "A")
     * @param {number} [col] (default is zero)
     * @param {number} [row] (default is zero)
     */
    drawGridSegment(idSeg, col = 0, row = 0)
    {
        let coords = LED.SEGMENT[idSeg];
        if (coords) {
            let xBias = col * LED.CELL.WIDTH;
            let yBias = row * LED.CELL.HEIGHT;
            this.contextGrid.fillStyle = this.color;
            this.contextGrid.beginPath();
            if (coords.length == 3) {
                this.contextGrid.arc(coords[0] + xBias, coords[1] + yBias, coords[2], 0, 2 * Math.PI);
            } else {
                for (let i = 0; i < coords.length; i += 2) {
                    if (!i) {
                        this.contextGrid.moveTo(coords[i] + xBias, coords[i + 1] + yBias);
                    } else {
                        this.contextGrid.lineTo(coords[i] + xBias, coords[i + 1] + yBias);
                    }
                }
            }
            this.contextGrid.closePath();
            this.contextGrid.fill();
        }
    }

    /**
     * drawString(s)
     *
     * @this {LED}
     * @param {string} s
     */
    drawString(s)
    {
        this.clearGrid();
        for (let i = 0, col = 0, row = 0; i < s.length; i++, col++) {
            let ch = s[i];
            if (ch == '.') {
                if (col) col--;
            }
            this.drawSymbol(ch, col, row);
        }
        this.drawGrid();
    }

    /**
     * drawSymbol(symbol, col, row)
     *
     * If the symbol does not exist in LED.SYMBOLS, then nothing is drawn.
     *
     * @this {LED}
     * @param {string} symbol
     * @param {number} [col] (default is zero)
     * @param {number} [row] (default is zero)
     */
    drawSymbol(symbol, col = 0, row = 0)
    {
        let segments = LED.SYMBOLS[symbol];
        if (segments) {
            for (let i = 0; i < segments.length; i++) {
                this.drawGridSegment(segments[i], col, row)
            }
        }
    }

    /**
     * setBuffer(col, row, ch1, ch2)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {string} ch1
     * @param {string} [ch2]
     * @returns {boolean} (true if this call modified the buffer, false if not)
     */
    setBuffer(col, row, ch1, ch2 = '')
    {
        let fModified = false;
        let i = (row * this.cols + col) * 2;
        this.assert(row >= 0 && row < this.rows && col >= 0 && col < this.cols);
        if (this.buffer[i] !== ch1 || this.buffer[i+1] !== ch2) {
            this.buffer[i] = ch1;
            this.buffer[i+1] = ch2;
            this.fBufferModified = fModified = true;
        }
        this.fTickled = true;
        return fModified;
    }
}

LED.TYPE = {
    SINGLE:     1,
    ARRAY:      2,
    DIGITS:     3
};

LED.BINDING = {
    CONTAINER:  "container"
};

/*
 * Each segment is an array containing an initial moveTo() point followed by one or more lineTo() coords.
 */
LED.CELL = {
    WIDTH:      96,
    HEIGHT:     128
};

/*
 * The segments are arranged as follows:
 *
 *      AAAA
 *     F    B
 *     F    B
 *      GGGG
 *     E    C
 *     E    C
 *      DDDD P
 */
LED.SEGMENT = {
    'A':        [30,  8, 79,  8, 67, 19, 37, 19],
    'B':        [83, 10, 77, 52, 67, 46, 70, 22],
    'C':        [77, 59, 71,100, 61, 89, 64, 64],
    'D':        [28, 91, 58, 91, 69,104, 15,104],
    'E':        [18, 59, 28, 64, 25, 88, 12,100],
    'F':        [24, 10, 34, 21, 31, 47, 18, 52],
    'G':        [24, 56, 34, 50, 60, 50, 71, 56, 61, 61, 33, 61],
    'P':        [80,102, 8]
};

/*
 * Symbols are formed with the following segments.
 */
LED.SYMBOLS = {
    ' ':        [],
    '0':        ['A','B','C','D','E','F'],
    '1':        ['B','C'],
    '2':        ['A','B','D','E','G'],
    '3':        ['A','B','C','D','G'],
    '4':        ['B','C','F','G'],
    '5':        ['A','C','D','F','G'],
    '6':        ['A','C','D','E','F','G'],
    '7':        ['A','B','C'],
    '8':        ['A','B','C','D','E','F','G'],
    '9':        ['A','B','C','D','F','G'],
    '-':        ['G'],
    'E':        ['A','D','E','F','G'],
    '.':        ['P']
};

LED.VERSION     = 1.01;
