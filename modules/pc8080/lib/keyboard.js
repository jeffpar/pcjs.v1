/**
 * @fileoverview Implements the PC8080 Keyboard component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-19
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
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
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see COPYRIGHT in /modules/shared/lib/defines.js).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

if (NODE) {
    var str         = require("../../shared/lib/strlib");
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var Keys        = require("../../shared/lib/keys");
    var PC8080      = require("./defines");
    var ChipSet8080 = require("./chipset");
    var Messages8080= require("./messages");
}

/**
 * Keyboard8080(parmsKbd)
 *
 * The Keyboard8080 component has the following component-specific (parmsKbd) properties:
 *
 *      model:  eg, "VT100" (should be a member of Keyboard8080.MODELS)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsKbd
 */
function Keyboard8080(parmsKbd)
{
    Component.call(this, "Keyboard", parmsKbd, Keyboard8080, Messages8080.KEYBOARD);

    var model = parmsKbd['model'];

    if (model && !Keyboard8080.MODELS[model]) {
        Component.notice("Unrecognized Keyboard8080 model: " + model);
    }

    this.config = Keyboard8080.MODELS[model] || {};

    this.reset();

    this.setReady();
}

Component.subclass(Keyboard8080);

Keyboard8080.MINPRESSTIME = 100;            // 100ms

/**
 * Alternate keyCode mappings to support popular "WASD"-style directional-key mappings.
 *
 * TODO: ES6 computed property name support may now be in all mainstream browsers, allowing us to use
 * a simple object literal for this and all other object initializations.
 */
Keyboard8080.WASDCODES = {};
Keyboard8080.WASDCODES[Keys.ASCII.A] = Keys.KEYCODE.LEFT;
Keyboard8080.WASDCODES[Keys.ASCII.D] = Keys.KEYCODE.RIGHT;
Keyboard8080.WASDCODES[Keys.ASCII.L] = Keys.KEYCODE.SPACE;

/*
 * Supported configurations
 */
Keyboard8080.SI1978 = {
    MODEL:          1978.1,
    KEYMAP: {},
    ALTCODES: Keyboard8080.WASDCODES,
    LEDCODES: {},
    SOFTCODES: {
        '1p':       Keys.KEYCODE.ONE,
        '2p':       Keys.KEYCODE.TWO,
        'coin':     Keys.KEYCODE.THREE,
        'left':     Keys.KEYCODE.LEFT,
        'right':    Keys.KEYCODE.RIGHT,
        'fire':     Keys.KEYCODE.SPACE
    }
};

Keyboard8080.VT100 = {
    MODEL:          100.0,
    KEYMAP: {},
    ALTCODES: {},
    LEDCODES: {},
    SOFTCODES: {
        'setup':    Keys.KEYCODE.F9
    },
    /*
     * Reading port 0x82 returns a key address from the VT100 keyboard's UART data output.
     *
     * Every time a keyboard scan is initiated (by setting the START bit of the status byte),
     * our internal address index (iKeyNext) is set to zero, and an interrupt is generated for
     * each entry in the aKeysActive array, along with a final interrupt for KEYLAST.
     */
    ADDRESS: {
        PORT:       0x82,
        INIT:       0x7F
    },
    /*
     * Writing port 0x82 updates the VT100's keyboard status byte via the keyboard's UART data input.
     */
    STATUS: {
        PORT:       0x82,               // write-only
        LED4:       0x01,
        LED3:       0x02,
        LED2:       0x04,
        LED1:       0x08,
        LOCKED:     0x10,
        LOCAL:      0x20,
        LEDS:       0x3F,               // all LEDs
        START:      0x40,               // set to initiate a scan
        /*
         * From p. 4-38 of the VT100 Technical Manual (July 1982):
         *
         *      A bit (CLICK) in the keyboard status word controls the bell....  When a single status word contains
         *      the bell bit, flip-flop E3 toggles and turns on E1, generating a click. If the bell bit is set for
         *      many words in succession, the UART latch holds the data output constant..., allowing the circuit to
         *      produce an 800 hertz tone. Bell is generated by setting the bell bit for 0.25 seconds.  Each cycle of
         *      the tone is at a reduced amplitude compared with the single keyclick....  The overall effect of the
         *      tone burst on the ear is that of a beep.
         */
        CLICK:      0x80,
        INIT:       0x00
    },
    KEYLAST:        0x7F            // special end-of-scan key address (all valid key addresses are < KEYLAST)
};

/*
 * Table to map host key codes to VT100 key addresses (ie, unique 7-bit values representing key positions on the VT100)
 */
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.DEL]     =   0x03;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.P]         =   0x05;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.O]         =   0x06;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.Y]         =   0x07;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.T]         =   0x08;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.W]         =   0x09;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.Q]         =   0x0A;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.RIGHT]   =   0x10;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.RBRACK]  =   0x14;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.LBRACK]  =   0x15;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.I]         =   0x16;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.U]         =   0x17;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.R]         =   0x18;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.E]         =   0x19;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.ONE]     =   0x1A;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.LEFT]    =   0x20;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.DOWN]    =   0x22;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.F6]      =   0x23;   // aka BREAK
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.PAUSE]   =   0x23;   // aka BREAK
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.BQUOTE]  =   0x24;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.DASH]    =   0x25;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NINE]    =   0x26;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.SEVEN]   =   0x27;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.FOUR]    =   0x28;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.THREE]   =   0x29;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.ESC]     =   0x2A;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.UP]      =   0x30;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.F3]      =   0x31;   // aka PF3
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.F1]      =   0x32;   // aka PF1
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.BS]      =   0x33;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.EQUALS]  =   0x34;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.ZERO]    =   0x35;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.EIGHT]   =   0x36;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.SIX]     =   0x37;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.FIVE]    =   0x38;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.TWO]     =   0x39;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.TAB]     =   0x3A;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_7]   =   0x40;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.F4]      =   0x41;   // aka PF4
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.F2]      =   0x42;   // aka PF2
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_0]   =   0x43;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.F7]      =   0x44;   // aka LINE FEED
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.BSLASH]  =   0x45;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.L]         =   0x46;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.K]         =   0x47;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.G]         =   0x48;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.F]         =   0x49;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.A]         =   0x4A;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_8]   =   0x50;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_CR]  =   0x51;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_2]   =   0x52;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_1]   =   0x53;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.QUOTE]   =   0x55;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.SEMI]    =   0x56;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.J]         =   0x57;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.H]         =   0x58;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.D]         =   0x59;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.S]         =   0x5A;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_DEL] =   0x60;   // keypad period
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.F5]      =   0x61;   // aka KEYPAD COMMA
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_5]   =   0x62;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_4]   =   0x63;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.CR]      =   0x64;   // TODO: Figure out why the Technical Manual lists CR at both 0x04 and 0x64
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.PERIOD]  =   0x65;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.COMMA]   =   0x66;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.N]         =   0x67;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.B]         =   0x68;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.X]         =   0x69;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.F8]      =   0x6A;   // aka NO SCROLL
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_9]   =   0x70;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_3]   =   0x71;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_6]   =   0x72;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.NUM_SUB] =   0x73;   // aka KEYPAD MINUS
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.SLASH]   =   0x75;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.M]         =   0x76;
Keyboard8080.VT100.KEYMAP[Keys.ASCII[' ']]      =   0x77;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.V]         =   0x78;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.C]         =   0x79;
Keyboard8080.VT100.KEYMAP[Keys.ASCII.Z]         =   0x7A;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.F9]      =   0x7B;   // aka SET-UP
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.CTRL]    =   0x7C;
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.SHIFT]   =   0x7D;   // either shift key (doesn't matter)
Keyboard8080.VT100.KEYMAP[Keys.KEYCODE.CAPS_LOCK] = 0x7E;

Keyboard8080.VT100.LEDCODES = {
    'l4':       Keyboard8080.VT100.STATUS.LED4,
    'l3':       Keyboard8080.VT100.STATUS.LED3,
    'l2':       Keyboard8080.VT100.STATUS.LED2,
    'l1':       Keyboard8080.VT100.STATUS.LED1,
    'locked':   Keyboard8080.VT100.STATUS.LOCKED,
    'local':    Keyboard8080.VT100.STATUS.LOCAL,
    'online':  ~Keyboard8080.VT100.STATUS.LOCAL
};

/*
 * Supported models and their configurations
 */
Keyboard8080.MODELS = {
    "SI1978":       Keyboard8080.SI1978,
    "VT100":        Keyboard8080.VT100
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {Keyboard8080}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "esc")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Keyboard8080.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    /*
     * There's a special binding that the Video component uses ("kbd") to effectively bind its
     * screen to the entire keyboard, in Video.powerUp(); ie:
     *
     *      video.kbd.setBinding("canvas", "kbd", video.canvasScreen);
     * or:
     *      video.kbd.setBinding("textarea", "kbd", video.textareaScreen);
     *
     * However, it's also possible for the keyboard XML definition to define a control that serves
     * a similar purpose; eg:
     *
     *      <control type="text" binding="kbd" width="2em">Kbd</control>
     *
     * The latter is purely experimental, while we work on finding ways to trigger the soft keyboard on
     * certain pesky devices (like the Kindle Fire).  Note that even if you use the latter, the former will
     * still be enabled (there's currently no way to configure the Video component to not bind its screen,
     * but we could certainly add one if the need ever arose).
     */
    var kbd = this;
    var id = sHTMLType + '-' + sBinding;

    if (this.bindings[id] === undefined) {

        if (sHTMLType == "led" && this.config.LEDCODES[sBinding]) {
            this.bindings[id] = control;
            return true;
        }

        switch (sBinding) {
        case "kbd":
            /*
             * Recording the binding ID prevents multiple controls (or components) from attempting to erroneously
             * bind a control to the same ID, but in the case of a "dual display" configuration, we actually want
             * to allow BOTH video components to call setBinding() for "kbd", so that it doesn't matter which
             * display the user gives focus to.
             *
             *      this.bindings[id] = control;
             */
            control.onkeydown = function onKeyDown(event) {
                return kbd.onKeyDown(event, true);
            };
            control.onkeyup = function onKeyUp(event) {
                return kbd.onKeyDown(event, false);
            };
            return true;

        default:
            if (this.config.SOFTCODES && this.config.SOFTCODES[sBinding] !== undefined) {
                this.bindings[id] = control;
                var fnDown = function(kbd, softCode) {
                    return function onKeyboardBindingDown(event) {
                        /*
                         * iOS Usability Improvement: Calling preventDefault() prevents rapid clicks from
                         * also being (mis)interpreted as a desire to "zoom" in on the machine.
                         */
                        event.preventDefault();
                        kbd.onSoftKeyDown(softCode, true);
                        /*
                         * I'm assuming we only need to give focus back on the "up" event...
                         *
                         *      if (kbd.cmp) kbd.cmp.updateFocus();
                         */
                    };
                }(this, this.config.SOFTCODES[sBinding]);
                var fnUp = function (kbd, softCode) {
                    return function onKeyboardBindingUp(event) {
                        kbd.onSoftKeyDown(softCode, false);
                        /*
                         * Give focus back to the machine (since clicking the button takes focus away).
                         *
                         *      if (kbd.cmp) kbd.cmp.updateFocus();
                         *
                         * iOS Usability Improvement: NOT calling updateFocus() keeps the soft keyboard down
                         * (assuming it was already down).
                         */
                    };
                }(this, this.config.SOFTCODES[sBinding]);
                if ('ontouchstart' in window) {
                    control.ontouchstart = fnDown;
                    control.ontouchend = fnUp;
                } else {
                    control.onmousedown = fnDown;
                    control.onmouseup = control.onmouseout = fnUp;
                }
                return true;
            }
            break;
        }
    }
    return false;
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {Keyboard8080}
 * @param {Computer8080} cmp
 * @param {Bus8080} bus
 * @param {CPUState8080} cpu
 * @param {Debugger8080} dbg
 */
Keyboard8080.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.cpu = cpu;
    this.dbg = dbg;     // NOTE: The "dbg" property must be set for the message functions to work
    this.chipset = /** @type {ChipSet8080} */ (cmp.getMachineComponent("ChipSet"));
    bus.addPortInputTable(this, this.config.portsInput);
    bus.addPortOutputTable(this, this.config.portsOutput);
};

/**
 * powerUp(data, fRepower)
 *
 * @this {Keyboard8080}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
Keyboard8080.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data) {
            this.reset();
        } else {
            if (!this.restore(data)) return false;
        }
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {Keyboard8080}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
Keyboard8080.prototype.powerDown = function(fSave, fShutdown)
{
    return fSave? this.save() : true;
};

Keyboard8080.VT100.INIT = [
    [
        Keyboard8080.VT100.STATUS.INIT,         // bVT100Status
        Keyboard8080.VT100.ADDRESS.INIT,        // bVT100Address
        false,                                  // fVT100UARTBusy
        0,                                      // nVT100UARTCycleSnap
        -1                                      // iKeyNext
    ]
];

/**
 * reset()
 *
 * @this {Keyboard8080}
 */
Keyboard8080.prototype.reset = function()
{
    /*
     * As keyDown events are encountered, a corresponding "softCode" is looked up.  If one is found,
     * then an entry for the key is added to the aKeysActive array.  Each "key" entry in aKeysActive contains:
     *
     *      softCode:           number or string representing the key pressed
     *      msDown:             timestamp of the most recent "down" event
     *      fAutoRelease:       true to auto-release the key after MINPRESSTIME (set when "up" occurs too quickly)
     *
     * When the key is finally released (or auto-released), its entry is removed from the array.
     */
    this.aKeysActive = [];

    if (this.config.INIT && !this.restore(this.config.INIT)) {
        this.notice("reset error");
    }
};

/**
 * save()
 *
 * This implements save support for the Keyboard component.
 *
 * @this {Keyboard8080}
 * @return {Object}
 */
Keyboard8080.prototype.save = function()
{
    var state = new State(this);
    switch(this.config.MODEL) {
    case Keyboard8080.SI1978.MODEL:
        break;
    case Keyboard8080.VT100.MODEL:
        state.set(0, [this.bVT100Status, this.bVT100Address, this.fVT100UARTBusy, this.nVT100UARTCycleSnap, -1]);
        break;
    }
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the Keyboard component.
 *
 * @this {Keyboard8080}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
Keyboard8080.prototype.restore = function(data)
{
    var a;
    if (data && (a = data[0]) && a.length) {
        switch(this.config.MODEL) {
        case Keyboard8080.SI1978.MODEL:
            return true;

        case Keyboard8080.VT100.MODEL:
            this.bVT100Status = a[0];
            this.updateLEDs(this.bVT100Status & Keyboard8080.VT100.STATUS.LEDS);
            this.bVT100Address = a[1];
            this.fVT100UARTBusy = a[2];
            this.nVT100UARTCycleSnap = a[3];
            this.iKeyNext = a[4];
            return true;
        }
    }
    return false;
};

/**
 * setLED(control, f)
 *
 * @this {Keyboard8080}
 * @param {Object} control is an HTML control DOM object
 * @param {boolean} f is true if the LED represented by control should be "on", false if "off"
 */
Keyboard8080.prototype.setLED = function(control, f)
{
    /*
     * TODO: Add support for user-definable LED colors
     */
    control.style.backgroundColor = (f? "#ff0000" : "#000000");
};

/**
 * updateLEDs(bLEDs)
 *
 * @this {Keyboard8080}
 * @param {number} bLEDs
 */
Keyboard8080.prototype.updateLEDs = function(bLEDs)
{
    this.bLEDs = bLEDs;
    for (var sBinding in this.config.LEDCODES) {
        var id = "led-" + sBinding;
        var control = this.bindings[id];
        if (control) {
            var bitLED = this.config.LEDCODES[sBinding];
            var fOn = !!(bLEDs & bitLED);
            if (bitLED & (bitLED-1)) {
                fOn = !(bLEDs & ~bitLED);
            }
            this.setLED(control, fOn);
        }
    }
};

/**
 * getSoftCode(keyCode)
 *
 * Returns a number if the keyCode exists in the KEYMAP, or a string if the keyCode has a soft-code string.
 *
 * @this {Keyboard8080}
 * @return {string|number|null}
 */
Keyboard8080.prototype.getSoftCode = function(keyCode)
{
    keyCode = this.config.ALTCODES[keyCode] || keyCode;
    if (this.config.KEYMAP[keyCode]) {
        return keyCode;
    }
    for (var sSoftCode in this.config.SOFTCODES) {
        if (this.config.SOFTCODES[sSoftCode] === keyCode) {
            return sSoftCode;
        }
    }
    return null;
};

/**
 * onKeyDown(event, fDown)
 *
 * @this {Keyboard8080}
 * @param {Object} event
 * @param {boolean} fDown is true for a keyDown event, false for up
 * @return {boolean} true to pass the event along, false to consume it
 */
Keyboard8080.prototype.onKeyDown = function(event, fDown)
{
    var fPass = true;
    var keyCode = event.keyCode;
    var softCode = this.getSoftCode(keyCode);

    if (softCode) {
        fPass = this.onSoftKeyDown(softCode, fDown);
        event.preventDefault();
    }

    if (!COMPILED && this.messageEnabled(Messages8080.KEYS)) {
        this.printMessage("onKey" + (fDown? "Down" : "Up") + "(" + keyCode + "): softCode=" + softCode + ", pass=" + (fPass? "true" : "false"), true);
    }

    return fPass;
};

/**
 * indexOfSoftKey(softCode)
 *
 * @this {Keyboard8080}
 * @param {number|string} softCode
 * @return {number} index of softCode in aKeysActive, or -1 if not found
 */
Keyboard8080.prototype.indexOfSoftKey = function(softCode)
{
    var i;
    for (i = 0; i < this.aKeysActive.length; i++) {
        if (this.aKeysActive[i].softCode == softCode) return i;
    }
    return -1;
};

/**
 * onSoftKeyDown(softCode, fDown)
 *
 * @this {Keyboard8080}
 * @param {number|string} softCode
 * @param {boolean} fDown is true for a down event, false for up
 * @return {boolean} true to pass the event along, false to consume it
 */
Keyboard8080.prototype.onSoftKeyDown = function(softCode, fDown)
{
    var i = this.indexOfSoftKey(softCode);
    if (fDown) {
        // this.println(softCode + " down");
        if (i < 0) {
            this.aKeysActive.push({
                softCode: softCode,
                msDown: Date.now(),
                fAutoRelease: false
            });
        } else {
            this.aKeysActive[i].msDown = Date.now();
            this.aKeysActive[i].fAutoRelease = false;
        }
    } else if (i >= 0) {
        // this.println(softCode + " up");
        if (!this.aKeysActive[i].fAutoRelease) {
            var msDown = this.aKeysActive[i].msDown;
            if (msDown) {
                var msElapsed = Date.now() - msDown;
                if (msElapsed < Keyboard8080.MINPRESSTIME) {
                    // this.println(softCode + " released after only " + msElapsed + "ms");
                    this.aKeysActive[i].fAutoRelease = true;
                    this.checkSoftKeysToRelease();
                    return true;
                }
            }
        }
        this.aKeysActive.splice(i, 1);
    } else {
        // this.println(softCode + " up with no down?");
    }

    if (this.chipset) {
        var bit = 0;
        switch(softCode) {
        case '1p':
            bit = ChipSet8080.SI1978.STATUS1.P1;
            break;
        case '2p':
            bit = ChipSet8080.SI1978.STATUS1.P2;
            break;
        case 'coin':
            bit = ChipSet8080.SI1978.STATUS1.CREDIT;
            break;
        case 'left':
            bit = ChipSet8080.SI1978.STATUS1.P1_LEFT;
            break;
        case 'right':
            bit = ChipSet8080.SI1978.STATUS1.P1_RIGHT;
            break;
        case 'fire':
            bit = ChipSet8080.SI1978.STATUS1.P1_FIRE;
            break;
        }
        if (bit) {
            this.chipset.updateStatus1(bit, fDown);
        }
    }
    return true;
};

/**
 * checkSoftKeysToRelease()
 *
 * @this {Keyboard8080}
 */
Keyboard8080.prototype.checkSoftKeysToRelease = function()
{
    var i = 0;
    var msDelayMin = -1;
    while (i < this.aKeysActive.length) {
        if (this.aKeysActive[i].fAutoRelease) {
            var softCode = this.aKeysActive[i].softCode;
            var msDown = this.aKeysActive[i].msDown;
            var msElapsed = Date.now() - msDown;
            var msDelay = Keyboard8080.MINPRESSTIME - msElapsed;
            if (msDelay > 0) {
                if (msDelayMin < 0 || msDelayMin > msDelay) {
                    msDelayMin = msDelay;
                }
            } else {
                /*
                 * Because the key is already in the auto-release state, this next call guarantees that the
                 * key will be removed from the array; a consequence of that removal, however, is that we must
                 * reset our array index to zero.
                 */
                this.onSoftKeyDown(softCode, false);
                i = 0;
                continue;
            }
        }
        i++;
    }
    if (msDelayMin >= 0) {
        var kbd = this;
        setTimeout(function() { kbd.checkSoftKeysToRelease(); }, msDelayMin);
    }
};

/**
 * isVT100TransmitterReady()
 *
 * Called whenever the VT100 ChipSet circuit needs the Keyboard UART's transmitter status.
 *
 * From p. 4-32 of the VT100 Technical Manual (July 1982):
 *
 *      The operating clock for the keyboard interface comes from an address line in the video processor (LBA4).
 *      This signal has an average period of 7.945 microseconds. Each data byte is transmitted with one start bit
 *      and one stop bit, and each bit lasts 16 clock periods. The total time for each data byte is 160 times 7.945
 *      or 1.27 milliseconds. Each time the Transmit Buffer Empty flag on the terminal's UART gets set (when the
 *      current byte is being transmitted), the microprocessor loads another byte into the transmit buffer. In this
 *      way, the stream of status bytes to the keyboard is continuous.
 *
 * We used to always return true (after all, what's wrong with an infinitely fast UART?), but unfortunately,
 * the VT100 firmware relies on the UART's slow transmission speed to drive cursor blink rate.  We have several
 * options:
 *
 *      1) Snapshot the CPU cycle count each time a byte is transmitted (see outVT100UARTStatus()) and then every
 *      time this is polled, see if the cycle count has exceeded the snapshot value by the necessary threshold;
 *      if we assume 361.69ns per CPU cycle, there are 22 CPU cycles for every 1 LBA4 cycle, and since transmission
 *      time is supposed to last for 160 LBA4 cycles, the threshold is 22*160 CPU cycles, or 3520 cycles.
 *
 *      2) Set a CPU timer using the new setTimer() interface, which can be passed the number of milliseconds to
 *      wait before firing (in this case, roughly 1.27ms).
 *
 *      3) Call the ChipSet's getVT100LBA(4) function for the state of the simulated LBA4, and count 160 LBA4
 *      transitions; however, that would be the worst solution, because there's no guarantee that the firmware's
 *      UART polling will occur regularly and/or frequently enough for us to catch every LBA4 transition.
 *
 * I'm going with solution #1 because it's less overhead.
 *
 * @this {Keyboard8080}
 * @return {boolean} (true if ready, false if not)
 */
Keyboard8080.prototype.isVT100TransmitterReady = function()
{
    if (this.fVT100UARTBusy) {
        /*
         * NOTE: getMSCycles(1.2731488) should work out to 3520 cycles for a CPU clocked at 361.69ns per cycle,
         * which is roughly 2.76Mhz.  We could just hard-code 3520 instead of calling getMSCycles(), but this helps
         * maintain a reasonable blink rate for the cursor even when the user cranks up the CPU speed.
         */
        if (this.cpu.getCycles() >= this.nVT100UARTCycleSnap + this.cpu.getMSCycles(1.2731488)) {
            this.fVT100UARTBusy = false;
        }
    }
    return !this.fVT100UARTBusy;
};

/**
 * inVT100UARTAddress(port, addrFrom)
 *
 * We take our cue from iKeyNext.  If it's -1 (default), we simply return the last value latched
 * in bVT100Address.  Otherwise, if iKeyNext is a valid index into aKeysActive, we look up the key
 * in the VT100.KEYMAP, latch it, and increment iKeyNext.  Failing that, we latch Keyboard8080.VT100.KEYLAST
 * and reset iKeyNext to -1.
 *
 * @this {Keyboard8080}
 * @param {number} port (0x82)
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 * @return {number} simulated port value
 */
Keyboard8080.prototype.inVT100UARTAddress = function(port, addrFrom)
{
    var b = this.bVT100Address;
    if (this.iKeyNext >= 0) {
        if (this.iKeyNext < this.aKeysActive.length) {
            var key = this.aKeysActive[this.iKeyNext];
            if (!MAXDEBUG) {
                this.iKeyNext++;
            } else {
                /*
                 * In MAXDEBUG builds, this code removes the key as soon as it's been reported, because
                 * when debugging, it's easy for the window to lose focus and never receive the keyUp event,
                 * thereby leaving us with a stuck key.  However, this may cause more problems than it solves,
                 * because the VT100's ROM seems to require that key presses persist for more than a single poll.
                 */
                this.aKeysActive.splice(this.iKeyNext, 1);
            }
            b = Keyboard8080.VT100.KEYMAP[key.softCode];
            if (b & 0x80) {
                /*
                 * TODO: This code is supposed to be accompanied by a SHIFT key; make sure that it is.
                 */
                b &= 0x7F;
            }
        } else {
            this.iKeyNext = -1;
            b = Keyboard8080.VT100.KEYLAST;
        }
        this.bVT100Address = b;
        this.cpu.requestINTR(1);
    }
    this.printMessageIO(port, null, addrFrom, "KBDUART.ADDRESS", b);
    return b;
};

/**
 * outVT100UARTStatus(port, b, addrFrom)
 *
 * @this {Keyboard8080}
 * @param {number} port (0x82)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
Keyboard8080.prototype.outVT100UARTStatus = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "KBDUART.STATUS");
    this.bVT100Status = b;
    this.fVT100UARTBusy = true;
    this.nVT100UARTCycleSnap = this.cpu.getCycles();
    this.updateLEDs(b & Keyboard8080.VT100.STATUS.LEDS);
    if (b & Keyboard8080.VT100.STATUS.START) {
        this.iKeyNext = 0;
        this.cpu.requestINTR(1);
    }
};

/*
 * Port notification tables
 */
Keyboard8080.VT100.portsInput = {
    0x82: Keyboard8080.prototype.inVT100UARTAddress
};

Keyboard8080.VT100.portsOutput = {
    0x82: Keyboard8080.prototype.outVT100UARTStatus
};

/**
 * Keyboard8080.init()
 *
 * This function operates on every HTML element of class "keyboard", extracting the
 * JSON-encoded parameters for the Keyboard constructor from the element's "data-value"
 * attribute, invoking the constructor to create a Keyboard component, and then binding
 * any associated HTML controls to the new component.
 */
Keyboard8080.init = function()
{
    var aeKbd = Component.getElementsByClass(document, PC8080.APPCLASS, "keyboard");
    for (var iKbd = 0; iKbd < aeKbd.length; iKbd++) {
        var eKbd = aeKbd[iKbd];
        var parmsKbd = Component.getComponentParms(eKbd);
        var kbd = new Keyboard8080(parmsKbd);
        Component.bindComponentControls(kbd, eKbd, PC8080.APPCLASS);
    }
};

/*
 * Initialize every Keyboard module on the page.
 */
web.onInit(Keyboard8080.init);

if (NODE) module.exports = Keyboard8080;
