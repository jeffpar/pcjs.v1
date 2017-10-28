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
 * <http://pcjs.org/modules/shared/lib/defines.js>.
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
 * Provides support for a variety of LED types:
 *
 * 1) LED Light (single light)
 * 2) LED Array (two-dimensional)
 * 3) LED Digits (1 or more 7-segment digits)
 *
 * To prototype this, I want to be able to include "led.js" and call an interface with a JSON object
 * that describes the type, style (eg, round or square), color, and size.
 *
 * The initial goal is to generate a 12-element array of 7-segment LED digits.  The default width and height
 * of 96 and 128 yield an aspect ratio of 0.75.
 *
 * We will need to create a canvas element inside the specified container element.  There must be interfaces
 * for enabling/disabling/toggling power to any combination of xSelect and ySelect.  There must also be a time
 * interface to indicate the passage of time, which should be called a minimum of every 1/60th of a second;
 * any addressable LED segment that was last toggled more than 1/60th second earlier will be blanked.
 *
 * @class {LED}
 * @unrestricted
 * @property {number} width (default is 96)
 * @property {number} height (default is 128)
 * @property {number} cols (default is 1)
 * @property {number} rows (default is 1)
 * @property {number} widthView (computed)
 * @property {number} heightView (computed)
 * @property {number} widthGrid (computed)
 * @property {number} heightGrid (computed)
 * @property {string} color (default is "red")
 * @property {string} backgroundColor (default is "black")
 * @property {HTMLCanvasElement} canvasView
 * @property {CanvasRenderingContext2D} contextView
 * @property {HTMLCanvasElement} canvasGrid
 * @property {CanvasRenderingContext2D} contextGrid
 */
class LED extends Control {
    /**
     * LED(idMachine, idControl, config)
     *
     * Sample config:
     *
     *      "display": {
     *        "class": "LED",
     *        "type": 3,
     *        "width": 96,
     *        "height": 128,
     *        "cols": 12,
     *        "rows": 1,
     *        "bindings": {
     *          "screen": "screenTI57"
     *        }
     *      }
     *
     * @this {LED}
     * @param {string} idMachine
     * @param {string} [idControl]
     * @param {LEDConfig} [config]
     */
    constructor(idMachine, idControl, config)
    {
        super(idMachine, idControl, config);
        let container = this.bindings.screen;
        if (container) {
            let canvasView = /** @type {HTMLCanvasElement} */ (document.createElement("canvas"));
            if (canvasView == undefined || !canvasView.getContext) {
                container.innerHTML = "Browser missing HTML5 canvas support";
            } else {
                this.canvasView = canvasView;
                this.width = this.config.width || 96;
                this.height = this.config.height || 128;
                this.cols = this.config.cols || 1;
                this.rows = this.config.rows || 1;
                this.widthView = this.width * this.cols;
                this.heightView = this.height * this.rows;
                this.color = (this.config.color || "red");
                this.backgroundColor = (this.config.backgroundColor || "black");
                switch(this.config.type) {
                case LED.TYPE.SINGLE:
                    break;
                case LED.TYPE.ARRAY:
                    break;
                case LED.TYPE.DIGITS:
                    break;
                }
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
                 * Test code
                 */
                this.clearGrid();
                for (let idSeg in LED.SEGMENT) {
                    this.drawGridSegment(0, 0, idSeg);
                }
                this.renderGrid();
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
        this.contextGrid.clearRect(0, 0, this.widthGrid, this.heightGrid);
    }

    /**
     * drawGridSegment(col, row, idSeg)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {string} idSeg (eg, "SA")
     */
    drawGridSegment(col, row, idSeg)
    {
        let points = LED.SEGMENT[idSeg];
        if (points) {
            this.contextGrid.fillStyle = this.color;
            this.contextGrid.beginPath();
            for (let i = 0; i < points.length; i += 2) {
                if (!i) {
                    this.contextGrid.moveTo(points[i], points[i+1]);
                } else {
                    this.contextGrid.lineTo(points[i], points[i+1]);
                }
            }
            this.contextGrid.closePath();
            this.contextGrid.fill();
        }
    }

    /**
     * renderGrid()
     *
     * @this {LED}
     */
    renderGrid()
    {
        this.contextView.drawImage(this.canvasGrid, 0, 0, this.widthGrid, this.heightGrid, 0, 0, this.widthView, this.heightView);
    }
}

LED.TYPE = {
    SINGLE: 1,
    ARRAY:  2,
    DIGITS: 3
};

/*
 * Each segment is an array containing an initial moveTo() point followed by one or more lineTo() points.
 */
LED.CELL = {
    WIDTH:      96,
    HEIGHT:     128
};
LED.SEGMENT = {
    "SA":       [ 28,   8,  84,   8,  70,  20,  37,  20],
    "SB":       [ 88,  12,  82,  58,  70,  52,  74,  24],
    "SC":       [ 81,  65,  75, 111,  64,  98,  67,  71],
    "SD":       [ 28, 101,  61, 101,  72, 116,  12, 116],
    "SE":       [ 15,  64,  27,  71,  24,  99,   9, 111],
    "SF":       [ 23,  10,  34,  23,  30,  51,  16,  58],
    "SG":       [ 35,  55,  63,  55,  75,  61,  63,  68,  33,  68,  22,  61]
};
