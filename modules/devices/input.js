/**
 * @fileoverview Maps keyboard, mouse, and touch inputs to device inputs
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
 * @typedef {Object} InputConfig
 * @property {string} class
 * @property {Array.<Array.<number>>} map
 * @property {Array.<number>} location
 * @property {Object} bindings
 */

/**
 * @class {Input}
 * @unrestricted
 * @property {Array.<Array.<number>>} map
 * @property {Array.<number>} location
 * @property {{
 *  surface: HTMLImageElement|undefined
 * }} bindings
 */
class Input extends Control {
    /**
     * Input(idMachine, idControl, config)
     *
     * Sample config:
     *
     *      "input": {
     *        "class": "Input",
     *        "map": [
     *          ["2nd", "inv",  "lnx", "ce",   "clr"],
     *          ["lrn", "xchg", "sq",  "sqrt", "rcp"],
     *          ["sst", "sto",  "rcl", "sum",  "exp"],
     *          ["bst", "ee",   "(",   ")",    "div"],
     *          ["gto", "7",    "8",   "9",    "mul"],
     *          ["sbr", "4",    "5",   "6",    "sub"],
     *          ["rst", "1",    "2",   "3",    "add"],
     *          ["r/s", "0",    ".",   "+/-",  "equ"],
     *        ],
     *        "location": [136, 322, 459, 808],
     *        "bindings": {
     *          "surface": "imageTI57"
     *        }
     *      }
     *
     * @this {Input}
     * @param {string} idMachine
     * @param {string} [idControl]
     * @param {LEDConfig} [config]
     */
    constructor(idMachine, idControl, config)
    {
        super(idMachine, idControl, config);
        let element = this.bindings.surface;
        if (element) {
            /*
             * xStart and yStart record the last 'touchstart' or 'mousedown' position on the surface
             * image; they will be reset to -1 when movement has ended (eg, 'touchend' or 'mouseup').
             */
            this.xStart = this.yStart = -1;
            this.captureMouse(element);
            this.captureTouch(element);
        }
    }

    /**
     * captureMouse(element)
     *
     * @this {Input}
     * @param {HTMLImageElement} element
     */
    captureMouse(element)
    {
        let input = this;
        element.addEventListener(
            'mousedown',
            function onMouseDown(event) {
                if (!event.button) {
                    input.processEvent(element, Input.ACTION.PRESS, event);
                }
            }
        );
        element.addEventListener(
            'mousemove',
            function onMouseMove(event) {
                /*
                 * Sadly, the 'buttons' property is not supported in all browsers (eg, Safari),
                 * so my original test for the left button (event.buttons & 0x1) is not sufficient.
                 * Instead, we'll rely on our own xStart/yStart properties, which should only
                 * be positive after 'mousedown' and before 'mouseup'.
                 */
                if (input.xStart >= 0) {
                    input.processEvent(element, Input.ACTION.MOVE, event);
                }
            }
        );
        element.addEventListener(
            'mouseup',
            function onMouseUp(event) {
                if (!event.button) {
                    input.processEvent(element, Input.ACTION.RELEASE, event);
                }
            }
        );
        element.addEventListener(
            'mouseout',
            function onMouseUp(event) {
                if (input.xStart >= 0) {
                    input.processEvent(element, Input.ACTION.RELEASE, event);
                }
            }
        );
    }

    /**
     * captureTouch(element)
     *
     * @this {Input}
     * @param {HTMLImageElement} element
     */
    captureTouch(element)
    {
        let input = this;
        /*
         * NOTE: The mouse event handlers below deal only with events where the left button is involved
         * (ie, left button is pressed, down, or released).
         */
        element.addEventListener(
            'touchstart',
            function onTouchStart(event) {
                input.processEvent(element, Input.ACTION.PRESS, event);
            }
        );
        element.addEventListener(
            'touchmove',
            function onTouchMove(event) {
                input.processEvent(element, Input.ACTION.MOVE, event);
            }
        );
        element.addEventListener(
            'touchend',
            function onTouchEnd(event) {
                input.processEvent(element, Input.ACTION.RELEASE, event);
            }
        );
    }

    /**
     * processEvent(element, action, event)
     *
     * @this {Input}
     * @param {HTMLImageElement} element
     * @param {number} action
     * @param {Event} [event] (eg, the object from a 'touch' or 'mouse' event)
     */
    processEvent(element, action, event)
    {
        let x, y;

        if (action < Input.ACTION.RELEASE) {
            /**
             * @name Event
             * @property {Array} targetTouches
             */
            event = event || window.event;

            if (!event.targetTouches || !event.targetTouches.length) {
                x = event.pageX;
                y = event.pageY;
            } else {
                x = event.targetTouches[0].pageX;
                y = event.targetTouches[0].pageY;
            }

            /*
             * Touch coordinates (that is, the pageX and pageY properties) are relative to the page, so to make
             * them relative to the canvas, we must subtract the canvas's left and top positions.  This Apple web page:
             *
             *      https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/AddingMouseandTouchControlstoCanvas/AddingMouseandTouchControlstoCanvas.html
             *
             * makes it sound simple, but it turns out we have to walk the canvas' entire "parentage" of DOM elements
             * to get the exact offsets.
             */
            let xOffset = 0;
            let yOffset = 0;
            let elementNext = element;
            do {
                if (!isNaN(elementNext.offsetLeft)) {
                    xOffset += elementNext.offsetLeft;
                    yOffset += elementNext.offsetTop;
                }
            } while ((elementNext = elementNext.offsetParent));

            /*
             * Due to the responsive nature of our pages, the displayed size of the surface image may be smaller than
             * the original size, and the coordinates we receive from events are based on the currently displayed size.
             */
            x = (x - xOffset) * (element.naturalWidth / element.offsetWidth)|0;
            y = (y - yOffset) * (element.naturalHeight / element.offsetHeight)|0;
        }

        event.preventDefault();

        if (action == Input.ACTION.PRESS) {
            /*
             * All we do is record the grid position of that event, transitioning xStart and yStart
             * from negative to non-negative values (grid positions cannot be negative).
             */
            this.xStart = x;
            this.yStart = y;
            this.msStart = Date.now();
            if (DEBUG) this.println("press action: (" + this.xStart + "," + this.yStart + ")");
        }
        else if (action == Input.ACTION.MOVE) {
            /*
             * In the case of a mouse, this can happen all the time, whether a button is 'down' or not, but
             * our event listener automatically suppresses all moves except those where the left button is down.
             */
        }
        else if (action == Input.ACTION.RELEASE) {
            this.xStart = this.yStart = -1;
        }
        else {
            this.println("unrecognized action: " + action);
        }
    }
}

Input.ACTION = {
    PRESS:      1,      // eg, an action triggered by a 'mousedown' or 'touchstart' event
    MOVE:       2,      // eg, an action triggered by a 'mousemove' or 'touchmove' event
    RELEASE:    3       // eg, an action triggered by a 'mouseup' (or 'mouseout') or 'touchend' event
};
