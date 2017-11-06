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
 * <http://pcjs.org/modules/devices/machine.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

if (typeof module !== "undefined") {
    var Device = require("device");
}

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
class Input extends Device {
    /**
     * Input(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "input": {
     *        "class": "Input",
     *        "map": [
     *          ["2nd",  "inv",  "lnx",  "ce",   "clr"],
     *          ["lrn",  "xchg", "sq",   "sqrt", "rcp"],
     *          ["sst",  "sto",  "rcl",  "sum",  "exp"],
     *          ["bst",  "ee",   "(",    ")",    "/"],
     *          ["gto",  "7",    "8",    "9",    "*"],
     *          ["sbr",  "4",    "5",    "6",    "-"],
     *          ["rst",  "1",    "2",    "3",    "+"],
     *          ["r/s",  "0",    ".",    "+/-",  "="]
     *        ],
     *        "location": [139, 325, 368, 478, 0.34, 0.5, 640, 853],
     *        "bindings": {
     *          "surface": "imageTI57",
     *          "power": "powerTI57"
     *        }
     *      }
     *
     * A word about the "power" button: the page will likely use absolute positioning to overlay the HTML button
     * onto the image of the physical button, and the temptation might be to use the style "display:none" to hide
     * it, but "opacity:0" should be used instead, because otherwise our efforts to use it as focusable element
     * will fail.
     *
     * @this {Input}
     * @param {string} idMachine
     * @param {string} [idDevice]
     * @param {LEDConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        this.aClickers = [];
        this.power = null;

        let input = this;
        this.time = this.findDeviceByClass(Machine.CLASS.TIME);

        let element = this.bindings[Input.BINDING.SURFACE];
        if (element) {
            /*
             * The location array, eg:
             *
             *      "location": [139, 325, 368, 478, 0.34, 0.5, 640, 853],
             *
             * contains the top left corner (xInput, yInput) and dimensions (cxInput, cyInput)
             * of the input rectangle where the buttons described in the map are located, relative
             * to the surface image.  It also describes the average amount of horizontal and vertical
             * space between buttons, as fractions of the average button width and height (hGap, vGap).
             * And finally, we store the dimensions of the surface image (cxSurface, cySurface).
             * With all that, we can now calculate the center lines for each column and row.
             *
             * NOTE: While element.naturalWidth and element.naturalHeight should, for all modern
             * browsers, contain the surface image's dimensions as well, those values still might not
             * be available if our constructor is called before the page's onload event has fired,
             * so we allow them to be stored in the location array, too.
             */
            this.xInput = this.config.location[0];
            this.yInput = this.config.location[1];
            this.cxInput = this.config.location[2];
            this.cyInput = this.config.location[3];
            this.hGap = this.config.location[4] || 1.0;
            this.vGap = this.config.location[5] || 1.0;
            this.cxSurface = this.config.location[6] || element.naturalWidth;
            this.cySurface = this.config.location[7] || element.naturalHeight;
            this.nRows = this.config.map.length;
            this.nCols = this.config.map[0].length;

            /*
             * To calculate the average button width (cxButton), we know that the overall width
             * must equal the sum of all the button widths + the sum of all the button gaps:
             *
             *      cxInput = nCols * cxButton + nCols * (cxButton * hGap)
             *
             * The number of gaps would normally be (nCols - 1), but we require that cxInput include
             * only 1/2 the gap at the edges, too.  Solving for cxButton:
             *
             *      cxButton = cxInput / (nCols + nCols * hGap)
             */
            this.cxButton = (this.cxInput / (this.nCols + this.nCols * this.hGap))|0;
            this.cyButton = (this.cyInput / (this.nRows + this.nRows * this.vGap))|0;
            this.cxGap = (this.cxButton * this.hGap)|0;
            this.cyGap = (this.cyButton * this.vGap)|0;

            /*
             * xStart and yStart record the last 'touchstart' or 'mousedown' position on the surface
             * image; they will be reset to -1 when movement has ended (eg, 'touchend' or 'mouseup').
             */
            this.xStart = this.yStart = -1;

            this.captureMouse(element);
            this.captureTouch(element);

            if (this.time) {
                this.timerKbd = this.time.addTimer("timerKbd", function() {
                    input.onKeyTimer();
                });
                /*
                 * I used to maintain a single-key buffer (this.keyPressed) and would immediately release
                 * that key as soon as another key was pressed, but it appears that the ROM wants a minimum
                 * delay between release and the next press -- probably for de-bouncing purposes.  So we
                 * maintain a key state: 0 means no key has gone down or up recently, 1 means a key just went
                 * down, and 2 means a key just went up.  keysPressed maintains a queue of keys (up to 16)
                 * received while key state is non-zero.
                 */
                this.keyState = 0;
                this.keysPressed = [];
                /*
                 * I'm attaching my 'keypress' handlers to the document object, since image elements are
                 * not focusable.  I'm disinclined to do what I've done with other machines (ie, create an
                 * invisible <textarea> overlay), because in this case, I don't really want a soft keyboard
                 * popping up and obscuring part of the display.
                 *
                 * A side-effect, however, is that if the user attempts to explicitly give the image
                 * focus, we don't have anything for focus to attach to.  We address that in onMouseDown(),
                 * by redirecting focus to the "power" button, if any, not because we want that or any other
                 * button to have focus, but simply to remove focus from any other input element on the page.
                 */
                this.captureKbd(document);
            }

            /*
             * Finally, the active input state.  If there is no active input, col and row are -1.  After
             * this point, these variables will be updated by setPosition().
             */
            this.col = this.row = -1;
        }

        element = this.bindings[Input.BINDING.CLEAR];
        if (element) {
            element.onclick = function onClickClear() {
                let printElement = input.findBinding(Device.BINDING.PRINT, true);
                if (printElement) printElement.value = "";
            };
        }

        element = this.bindings[Input.BINDING.POWER];
        if (element) {
            element.onclick = function onClickPower() {
                if (input.power) input.power();
            };
        }

        element = this.bindings[Input.BINDING.RESET];
        if (element) {
            element.onclick = function onClickReset() {
                if (input.reset) input.reset();
            };
        }
    }

    /**
     * addClicker(clicker, power, reset)
     *
     * Called by the Chip device to setup keyboard and power click notifications.
     *
     * @this {Input}
     * @param {function(number)} clicker
     * @param {function()} power (called when the "power" button, if any, is clicked)
     * @param {function()} reset (called when the "reset" button, if any, is clicked)
     */
    addClicker(clicker, power, reset)
    {
        this.aClickers.push(clicker);
        this.power = power;
        this.reset = reset;
    }

    /**
     * captureKbd(element)
     *
     * @this {Input}
     * @param {HTMLDocument|HTMLElement} element
     */
    captureKbd(element)
    {
        let input = this;
        element.addEventListener(
            'keypress',
            function onKeyPress(event) {
                event = event || window.event;
                let keyCode = event.which || event.keyCode;
                if (keyCode) {
                    input.onKeyPress(String.fromCharCode(keyCode));
                }
            }
        );
    }

    /**
     * onKeyPress(ch)
     *
     * @this {Input}
     * @param {string} ch
     */
    onKeyPress(ch)
    {
        if (this.keyState) {
            if (this.keysPressed.length < 16) {
                this.keysPressed.push(ch);
            }
            return;
        }
        for (let row = 0; row < this.config.map.length; row++) {
            let rowMap = this.config.map[row];
            for (let col = 0; col < rowMap.length; col++) {
                if (ch == rowMap[col]) {
                    this.keyState = 1;
                    this.setPosition(col, row);
                    this.time.setTimer(this.timerKbd, Input.KBD_DELAY);
                    return;
                }
            }
        }
        this.println("key not recognized: " + ch);
    }

    /**
     * onKeyTimer()
     *
     * @this {Input}
     */
    onKeyTimer()
    {
        this.assert(this.keyState);
        if (this.keyState == 1) {
            this.keyState++;
            this.setPosition(-1, -1);
            this.time.setTimer(this.timerKbd, Input.KBD_DELAY);
        } else {
            this.keyState = 0;
            if (this.keysPressed.length) {
                this.onKeyPress(this.keysPressed.shift());
            }
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
                /*
                 * If there are any text input elements on the page that might currently have focus,
                 * this is a good time to divert focus to a focusable element of our own (eg, a "power"
                 * button).  Otherwise, key presses could be confusingly processed in two places.
                 *
                 * Unfortunately, setting focus on an element can cause the browser to scroll the element
                 * into view, so to avoid that, we use the following scrollTo() work-around.
                 */
                let button = input.bindings[Input.BINDING.POWER];
                if (button) {
                    let x = window.scrollX, y = window.scrollY;
                    button.focus();
                    window.scrollTo(x, y);
                }
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
        let x, y, xInput, yInput, col, row, fInput;

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
            x = ((x - xOffset) * (this.cxSurface / element.offsetWidth))|0;
            y = ((y - yOffset) * (this.cySurface / element.offsetHeight))|0;

            xInput = x - this.xInput;
            yInput = y - this.yInput;
            if (xInput >= 0 && xInput < this.cxInput && yInput >= 0 && yInput < this.cyInput) {
                fInput = true;
                /*
                 * The width and height of each column and row could be determined by computing cxGap + cxButton
                 * and cyGap + cyButton, respectively, but those gap and button sizes are merely estimates, and should
                 * only be used to help with the final button coordinate checks farther down.
                 */
                let cxCol = (this.cxInput / this.nCols)|0;
                let cyCol = (this.cyInput / this.nRows)|0;
                let colInput = (xInput / cxCol)|0;
                let rowInput = (yInput / cyCol)|0;

                /*
                 * (xCol,yCol) will be the top left corner of the button closest to the point of input.  However, that's
                 * based on our gap estimate.  If things seem "too tight", shrink the gap estimates, which will automatically
                 * increase the button size estimates.
                 */
                let xCol = colInput * cxCol + (this.cxGap >> 1);
                let yCol = rowInput * cyCol + (this.cyGap >> 1);

                xInput -= xCol;
                yInput -= yCol;
                col = row = -1;
                if (xInput >= 0 && xInput < this.cxButton && yInput >= 0 && yInput < this.cyButton) {
                    col = colInput;
                    row = rowInput;
                }
                /*
                 * If we allow touch events to be processed, they will generate mouse events as well, causing
                 * confusion and delays.  We can sidestep that problem by preventing default actions on any event
                 * that occurs within the input region.  One downside is that you can no longer scroll the image
                 * using touch, but that may be just as well, because you probably don't want a sloppy touch moving
                 * your device around (or worse, a rapid double-tap zooming the device).  Besides, if you really
                 * want to move or zoom the device, the solution is simple: touch *outside* the input region.
                 */
                event.preventDefault();
            }
        }

        if (action == Input.ACTION.PRESS) {
            /*
             * All we do is record the position of the event, transitioning xStart and yStart
             * from negative to non-negative values.
             */
            this.xStart = x;
            this.yStart = y;
            if (fInput) {
                this.setPosition(col, row);
            }
        }
        else if (action == Input.ACTION.MOVE) {
            /*
             * In the case of a mouse, this can happen all the time, whether a button is 'down' or not, but
             * our event listener automatically suppresses all moves except those where the left button is down.
             */
        }
        else if (action == Input.ACTION.RELEASE) {
            this.setPosition(-1, -1);
            this.xStart = this.yStart = -1;
        }
        else {
            this.println("unrecognized action: " + action);
        }
    }

    /**
     * setPosition(col, row)
     *
     * @this {Input}
     * @param {number} col
     * @param {number} row
     */
    setPosition(col, row)
    {
        if (col != this.col || row != this.row) {
            this.col = col;
            this.row = row;
            this.updateClickers(col, row);
            if (TEST) {
                // this.println("input: col=" + col + ", row=" + row);
                let led = /** @type {LED} */ (this.findDeviceByClass(Machine.CLASS.LED));
                if (led) {
                    led.clearGrid();
                    led.drawSymbol(col < 0? "-" : col.toString(), 9, 0);
                    led.drawSymbol(row < 0? "-" : row.toString(), 11, 0);
                    led.drawGrid();
                }
            }
        }
    }

    /**
     * updateClickers(col, row)
     *
     * @param {number} col
     * @param {number} row
     */
    updateClickers(col, row)
    {
        for (let i = 0; i < this.aClickers.length; i++) {
            this.aClickers[i](col, row);
        }
    }
}

Input.ACTION = {
    PRESS:      1,              // eg, an action triggered by a 'mousedown' or 'touchstart' event
    MOVE:       2,              // eg, an action triggered by a 'mousemove' or 'touchmove' event
    RELEASE:    3               // eg, an action triggered by a 'mouseup' (or 'mouseout') or 'touchend' event
};

Input.BINDING = {
    CLEAR:      "clear",
    POWER:      "power",
    RESET:      "reset",
    SURFACE:    "surface"
};

Input.KBD_DELAY = 50;           // minimum number of milliseconds to ensure between key presses and releases
