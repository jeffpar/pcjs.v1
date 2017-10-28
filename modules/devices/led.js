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
 * @typedef {{
 *  class:              string,
 *  type:               number,
 *  xSize:              number,
 *  ySize:              number,
 *  xTotal:             number,
 *  yTotal:             number,
 *  color:              string,
 *  backgroundColor:    string,
 *  bindings:           Object
 * }} LEDConfig
 */

/*
 * Provides support for a variety of LED types:
 *
 * 1) LED Light (single light)
 * 2) LED Array (two-dimensional)
 * 3) LED Digits (1 or more 7-segment digits)
 *
 * To prototype this, I want to be able to include "led.js" and call an interface with a JSON object
 * that describes the type, style (eg, round or square), color, and size.
 *
 * The initial goal is to generate a 12-element array of 7-segment LED digits.
 *
 * We will need to create a canvas element inside the specified container element.  There must be interfaces
 * for enabling/disabling/toggling power to any combination of xSelect and ySelect.  There must also be a time
 * interface to indicate the passage of time, which should be called a minimum of every 1/60th of a second;
 * any addressable LED segment that was last toggled more than 1/60th second earlier will be blanked.
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
     *        "xSize": 96,
     *        "ySize": 128,
     *        "xTotal": 12,
     *        "yTotal": 1,
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
            let canvas = /** @type {HTMLCanvasElement} */ (document.createElement("canvas"));
            if (canvas === undefined || !canvas.getContext) {
                container.innerHTML = "Browser missing HTML5 canvas support";
            } else {
                let width = this.config.xSize;
                let height = this.config.ySize;
                switch(this.config.type) {
                case LED.TYPE.SINGLE:
                    break;
                case LED.TYPE.ARRAY:
                    break;
                case LED.TYPE.DIGITS:
                    width *= this.config.xTotal;
                    height *= this.config.yTotal;
                    break;
                }
                canvas.setAttribute("class", "pcjs-canvas");
                canvas.setAttribute("width", width.toString());
                canvas.setAttribute("height", height.toString());
                canvas.style.height = "auto";
                canvas.style.backgroundColor = this.config.backgroundColor;
                container.appendChild(canvas);
                let context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
            }
        }
    }
}

LED.TYPE = {
    SINGLE: 1,
    ARRAY:  2,
    DIGITS: 3
};
