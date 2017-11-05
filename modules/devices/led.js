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
 * @property {number} type
 * @property {number} width
 * @property {number} height
 * @property {number} cols
 * @property {number} rows
 * @property {string} color
 * @property {string} backgroundColor
 * @property {string} fixedSize
 * @property {Object} bindings
 */

/**
 * The ultimate goal is to provide support for a variety of LED types, such as:
 *
 * 1) LED Light (single light)
 * 2) LED Array (two-dimensional)
 * 3) LED Digits (1 or more 7-segment digits)
 *
 * The initial goal is to generate a 12-element array of 7-segment LED digits.  The default width and height
 * of 96 and 128 match our internal cell size and yield an aspect ratio of 0.75.
 *
 * We will need to create a canvas element inside the specified container element.  There must be interfaces
 * for enabling/disabling/toggling power to any combination of xSelect and ySelect.  There must also be a time
 * interface to indicate the passage of time, which should be called a minimum of every 1/60th of a second;
 * any addressable LED segment that was last toggled more than 1/60th second earlier should be blanked.
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
     * @param {string} [idDevice]
     * @param {LEDConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        let container = this.bindings[LED.BINDING.CONTAINER];
        if (container) {
            let canvasView = /** @type {HTMLCanvasElement} */ (document.createElement("canvas"));
            if (canvasView == undefined || !canvasView.getContext) {
                container.innerHTML = "Browser missing HTML5 canvas support";
            } else {
                this.canvasView = canvasView;

                this.type = config.type;
                this.width = config.width || 96;
                this.height = config.height || 128;
                this.cols = config.cols || 1;
                this.rows = config.rows || 1;
                this.widthView = this.width * this.cols;
                this.heightView = this.height * this.rows;
                this.color = (config.color || "red");
                this.backgroundColor = (this.backgroundColor || "black");

                if (!config.fixedSize) {
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
                 * Test code to draw all segments of all digits.
                 */
                if (TEST) {
                    this.clearGrid();
                    for (let iCol = 0; iCol < this.cols; iCol++) {
                        for (let idSeg in LED.SEGMENT) {
                            this.drawGridSegment(idSeg, iCol, 0);
                        }
                    }
                    this.drawGrid();
                }
            }
        }
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
     * @param {string} idSeg (eg, "SA")
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
     * drawSymbol(symbol, col, row)
     *
     * @this {LED}
     * @param {string} symbol (must exist in LED.SYMBOLS)
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
}

LED.TYPE = {
    SINGLE: 1,
    ARRAY:  2,
    DIGITS: 3
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

LED.SEGMENT = {
    "SA":       [30,  8, 79,  8, 67, 19, 37, 19],
    "SB":       [83, 10, 77, 52, 67, 46, 70, 22],
    "SC":       [77, 59, 71,100, 61, 89, 64, 64],
    "SD":       [28, 91, 58, 91, 69,104, 15,104],
    "SE":       [18, 59, 28, 64, 25, 88, 12,100],
    "SF":       [24, 10, 34, 21, 31, 47, 18, 52],
    "SG":       [24, 56, 34, 50, 60, 50, 71, 56, 61, 61, 33, 61],
    "SP":       [80,102, 8]
};

/*
 * Normally, the construction of digits (or any other symbol) will be determined by the machine itself, but
 * for diagnostic purposes, it's handy to have our own symbol to segment map.
 */
LED.SYMBOLS = {
    "0":        ["SA","SB","SC","SD","SE","SF"],
    "1":        ["SB","SC"],
    "2":        ["SA","SB","SD","SE","SG"],
    "3":        ["SA","SB","SC","SD","SG"],
    "4":        ["SB","SC","SF","SG"],
    "5":        ["SA","SC","SD","SF","SG"],
    "6":        ["SA","SC","SD","SE","SF","SG"],
    "7":        ["SA","SB","SC"],
    "8":        ["SA","SB","SC","SD","SE","SF","SG"],
    "9":        ["SA","SB","SC","SD","SF","SG"],
    "-":        ["SG"]
};
