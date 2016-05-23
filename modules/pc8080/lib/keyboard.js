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
    var Messages    = require("./messages");
    var ChipSet     = require("./chipset");
}

/**
 * Keyboard(parmsKbd)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsKbd
 */
function Keyboard(parmsKbd)
{
    Component.call(this, "Keyboard", parmsKbd, Keyboard, Messages.KEYBOARD);

    this.reset();

    this.setReady();
}

Component.subclass(Keyboard);

/**
 * Alphanumeric and other common (printable) ASCII codes.
 *
 * TODO: Determine what we can do to get ALL constants like these inlined (enum doesn't seem to
 * get the job done); the problem seems to be limited to property references that use quotes, which
 * is why I've 'unquoted' as many of them as possible.
 *
 * @enum {number}
 */
Keyboard.ASCII = {
 CTRL_A:  1, CTRL_C:  3, CTRL_Z: 26,
    ' ': 32,    '!': 33,    '"': 34,    '#': 35,    '$': 36,    '%': 37,    '&': 38,    "'": 39,
    '(': 40,    ')': 41,    '*': 42,    '+': 43,    ',': 44,    '-': 45,    '.': 46,    '/': 47,
    '0': 48,    '1': 49,    '2': 50,    '3': 51,    '4': 52,    '5': 53,    '6': 54,    '7': 55,
    '8': 56,    '9': 57,    ':': 58,    ';': 59,    '<': 60,    '=': 61,    '>': 62,    '?': 63,
    '@': 64,     A:  65,     B:  66,     C:  67,     D:  68,     E:  69,     F:  70,     G:  71,
     H:  72,     I:  73,     J:  74,     K:  75,     L:  76,     M:  77,     N:  78,     O:  79,
     P:  80,     Q:  81,     R:  82,     S:  83,     T:  84,     U:  85,     V:  86,     W:  87,
     X:  88,     Y:  89,     Z:  90,    '[': 91,    '\\':92,    ']': 93,    '^': 94,    '_': 95,
    '`': 96,     a:  97,     b:  98,     c:  99,     d: 100,     e: 101,     f: 102,     g: 103,
     h:  104,    i: 105,     j: 106,     k: 107,     l: 108,     m: 109,     n: 110,     o: 111,
     p:  112,    q: 113,     r: 114,     s: 115,     t: 116,     u: 117,     v: 118,     w: 119,
     x:  120,    y: 121,     z: 122,    '{':123,    '|':124,    '}':125,    '~':126
};

/**
 * Browser keyCodes we must pay particular attention to.  For the most part, these are non-alphanumeric
 * or function keys, some which may require special treatment (eg, preventDefault() if returning false on
 * the initial keyDown event is insufficient).
 *
 * keyCodes for most common ASCII keys can simply use the appropriate ASCII code above.
 *
 * Most of these represent non-ASCII keys (eg, the LEFT arrow key), yet for some reason, browsers defined
 * them using ASCII codes (eg, the LEFT arrow key uses the ASCII code for '%' or 37).  This conflict is
 * discussed further in the definition of CLICKCODE below.
 *
 * @enum {number}
 */
Keyboard.KEYCODE = {
    /* 0x08 */ BS:          8,
    /* 0x09 */ TAB:         9,
    /* 0x0A */ LF:          10,
    /* 0x0D */ CR:          13,
    /* 0x10 */ SHIFT:       16,
    /* 0x11 */ CTRL:        17,
    /* 0x12 */ ALT:         18,
    /* 0x13 */ PAUSE:       19,         // PAUSE/BREAK
    /* 0x14 */ CAPS_LOCK:   20,
    /* 0x1B */ ESC:         27,
    /* 0x20 */ SPACE:       32,
    /* 0x21 */ PGUP:        33,
    /* 0x22 */ PGDN:        34,
    /* 0x23 */ END:         35,
    /* 0x24 */ HOME:        36,
    /* 0x25 */ LEFT:        37,
    /* 0x26 */ UP:          38,
    /* 0x27 */ RIGHT:       39,
    /* 0x27 */ FF_QUOTE:    39,
    /* 0x28 */ DOWN:        40,
    /* 0x2C */ FF_COMMA:    44,
    /* 0x2C */ PRTSC:       44,
    /* 0x2D */ INS:         45,
    /* 0x2E */ DEL:         46,
    /* 0x2E */ FF_PERIOD:   46,
    /* 0x2F */ FF_SLASH:    47,
    /* 0x30 */ ZERO:        48,
    /* 0x31 */ ONE:         49,
    /* 0x32 */ TWO:         50,
    /* 0x33 */ THREE:       51,
    /* 0x34 */ FOUR:        52,
    /* 0x35 */ FIVE:        53,
    /* 0x36 */ SIX:         54,
    /* 0x37 */ SEVEN:       55,
    /* 0x38 */ EIGHT:       56,
    /* 0x39 */ NINE:        57,
    /* 0x3B */ FF_SEMI:     59,
    /* 0x3D */ FF_EQUALS:   61,
    /* 0x5B */ CMD:         91,         // aka WIN
    /* 0x5B */ FF_LBRACK:   91,
    /* 0x5C */ FF_BSLASH:   92,
    /* 0x5D */ RCMD:        93,         // aka MENU
    /* 0x5D */ FF_RBRACK:   93,
    /* 0x60 */ NUM_INS:     96,         // 0
    /* 0x60 */ FF_BQUOTE:   96,
    /* 0x61 */ NUM_END:     97,         // 1
    /* 0x62 */ NUM_DOWN:    98,         // 2
    /* 0x63 */ NUM_PGDN:    99,         // 3
    /* 0x64 */ NUM_LEFT:    100,        // 4
    /* 0x65 */ NUM_CENTER:  101,        // 5
    /* 0x66 */ NUM_RIGHT:   102,        // 6
    /* 0x67 */ NUM_HOME:    103,        // 7
    /* 0x68 */ NUM_UP:      104,        // 8
    /* 0x69 */ NUM_PGUP:    105,        // 9
    /* 0x6A */ NUM_MUL:     106,
    /* 0x6B */ NUM_ADD:     107,
    /* 0x6D */ NUM_SUB:     109,
    /* 0x6E */ NUM_DEL:     110,        // .
    /* 0x6F */ NUM_DIV:     111,
    /* 0x70 */ F1:          112,
    /* 0x71 */ F2:          113,
    /* 0x72 */ F3:          114,
    /* 0x73 */ F4:          115,
    /* 0x74 */ F5:          116,
    /* 0x75 */ F6:          117,
    /* 0x76 */ F7:          118,
    /* 0x77 */ F8:          119,
    /* 0x78 */ F9:          120,
    /* 0x79 */ F10:         121,
    /* 0x7A */ F11:         122,
    /* 0x7B */ F12:         123,
    /* 0x90 */ NUM_LOCK:    144,
    /* 0x91 */ SCROLL_LOCK: 145,
    /* 0xAD */ FF_DASH:     173,
    /* 0xBA */ SEMI:        186,        // Firefox: 59
    /* 0xBB */ EQUALS:      187,        // Firefox: 61
    /* 0xBC */ COMMA:       188,        // Firefox: 44
    /* 0xBD */ DASH:        189,        // Firefox: 173
    /* 0xBE */ PERIOD:      190,        // Firefox: 46
    /* 0xBF */ SLASH:       191,        // Firefox: 47
    /* 0xC0 */ BQUOTE:      192,        // Firefox: 96
    /* 0xDB */ LBRACK:      219,        // Firefox: 91
    /* 0xDC */ BSLASH:      220,        // Firefox: 92
    /* 0xDD */ RBRACK:      221,        // Firefox: 93
    /* 0xDE */ QUOTE:       222,        // Firefox: 39
    /* 0xE0 */ FF_CMD:      224,        // Firefox only (used for both CMD and RCMD)
    //
    // The following biases use what I'll call Decimal Coded Binary or DCB (the opposite of BCD),
    // where the thousands digit is used to store the sum of "binary" digits 1 and/or 2 and/or 4.
    //
    // Technically, that makes it DCO (Decimal Coded Octal), but then again, BCD should have really
    // been called HCD (Hexadecimal Coded Decimal), so if "they" can take liberties, so can I.
    //
    // ONDOWN is a bias we add to browser keyCodes that we want to handle on "down" rather than on "press".
    //
    ONDOWN:                 1000,
    //
    // ONRIGHT is a bias we add to browser keyCodes that need to check for a "right" location (default is "left")
    //
    ONRIGHT:                2000,
    //
    // FAKE is a bias we add to signal these are fake keyCodes corresponding to internal keystroke combinations.
    // The actual values are for internal use only and merely need to be unique and used consistently.
    //
    FAKE:                   4000
};

/*
 * Maps "stupid" keyCodes to their "non-stupid" counterparts
 */
Keyboard.STUPID_KEYCODES = {};
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.SEMI]    = Keyboard.ASCII[';'];   // 186 -> 59
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.EQUALS]  = Keyboard.ASCII['='];   // 187 -> 61
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.COMMA]   = Keyboard.ASCII[','];   // 188 -> 44
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.DASH]    = Keyboard.ASCII['-'];   // 189 -> 45
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.PERIOD]  = Keyboard.ASCII['.'];   // 190 -> 46
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.SLASH]   = Keyboard.ASCII['/'];   // 191 -> 47
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.BQUOTE]  = Keyboard.ASCII['`'];   // 192 -> 96
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.LBRACK]  = Keyboard.ASCII['['];   // 219 -> 91
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.BSLASH]  = Keyboard.ASCII['\\'];  // 220 -> 92
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.RBRACK]  = Keyboard.ASCII[']'];   // 221 -> 93
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.QUOTE]   = Keyboard.ASCII["'"];   // 222 -> 39
Keyboard.STUPID_KEYCODES[Keyboard.KEYCODE.FF_DASH] = Keyboard.ASCII['-'];

/**
 * Maps SOFTCODE (string) to KEYCODE (number).
 *
 * @enum {number}
 */
Keyboard.SOFTCODES = {
    '1p':       Keyboard.KEYCODE.ONE,
    '2p':       Keyboard.KEYCODE.TWO,
    'coin':     Keyboard.KEYCODE.THREE,
    'left':     Keyboard.KEYCODE.LEFT,
    'right':    Keyboard.KEYCODE.RIGHT,
    'fire':     Keyboard.KEYCODE.SPACE
};

/**
 * Alternate keyCode mappings (to support the popular WASD directional mappings)
 *
 * TODO: ES6 computed property name support may now be in all mainstream browsers, allowing us to use
 * a simple object literal for this and all other object initializations.
 */
Keyboard.ALTCODES = {};
Keyboard.ALTCODES[Keyboard.ASCII.A] = Keyboard.KEYCODE.LEFT;
Keyboard.ALTCODES[Keyboard.ASCII.D] = Keyboard.KEYCODE.RIGHT;
Keyboard.ALTCODES[Keyboard.ASCII.L] = Keyboard.KEYCODE.SPACE;

/**
 * getSoftCode(keyCode)
 *
 * @this {Keyboard}
 * @return {string|null}
 */
Keyboard.prototype.getSoftCode = function(keyCode)
{
    keyCode = Keyboard.ALTCODES[keyCode] || keyCode;
    for (var sSoftCode in Keyboard.SOFTCODES) {
        if (Keyboard.SOFTCODES[sSoftCode] === keyCode) {
            return sSoftCode;
        }
    }
    return null;
};

/**
 * reset()
 *
 * @this {Keyboard}
 */
Keyboard.prototype.reset = function()
{
    /*
     * As SOFTCODE keyDown events are encountered, a corresponding property is set to true in
     * keysPressed, and as SOFTCODE keyUp events are encountered, the property is set to false.
     */
    this.keysPressed = {};
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {Keyboard}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "esc")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Keyboard.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
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
            if (Keyboard.SOFTCODES[sBinding] !== undefined) {
                this.bindings[id] = control;
                var fnDown = function(kbd, sSoftCode) {
                    return function onMouseOrTouchDownKeyboard(event) {
                        kbd.onSoftKeyDown(sSoftCode, true);
                    };
                }(this, sBinding);
                var fnUp = function (kbd, sSoftCode) {
                    return function onMouseOrTouchUpKeyboard(event) {
                        kbd.onSoftKeyDown(sSoftCode, false);
                    };
                }(this, sBinding);
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
 * @this {Keyboard}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger} dbg
 */
Keyboard.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.dbg = dbg;     // NOTE: The "dbg" property must be set for the message functions to work
    this.chipset = cmp.getMachineComponent("ChipSet");
};

/**
 * onKeyDown(event, fDown)
 *
 * @this {Keyboard}
 * @param {Object} event
 * @param {boolean} fDown is true for a keyDown event, false for a keyUp event
 * @return {boolean} true to pass the event along, false to consume it
 */
Keyboard.prototype.onKeyDown = function(event, fDown)
{
    var fPass = true;
    var keyCode = event.keyCode;
    var sSoftCode = this.getSoftCode(keyCode);

    if (sSoftCode) {
        fPass = this.onSoftKeyDown(sSoftCode, fDown);
    }

    if (!fPass) {
        event.preventDefault();
    }

    if (!COMPILED && this.messageEnabled(Messages.KEYS)) {
        this.printMessage("onKey" + (fDown? "Down" : "Up") + "(" + keyCode + "): " + (fPass? "true" : "false"), true);
    }

    return fPass;
};

/**
 * onSoftKeyDown(sSoftCode, fDown)
 *
 * @this {Keyboard}
 * @param {string} sSoftCode
 * @param {boolean} fDown is true for a down event, false for an up event
 * @return {boolean} true to pass the event along, false to consume it
 */
Keyboard.prototype.onSoftKeyDown = function(sSoftCode, fDown)
{
    this.keysPressed[sSoftCode] = fDown;

    if (this.chipset) {
        switch(sSoftCode) {
        case '1p':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.P1, fDown);
            break;

        case '2p':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.P2, fDown);
            break;

        case 'coin':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.CREDIT, fDown);
            break;

        case 'left':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.P1_LEFT, fDown);
            break;

        case 'right':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.P1_RIGHT, fDown);
            break;

        case 'fire':
            this.chipset.updateStatus1(ChipSet.SI_1978.STATUS1.P1_FIRE, fDown);
            break;
        }
    }
    return false;
};

/**
 * Keyboard.init()
 *
 * This function operates on every HTML element of class "keyboard", extracting the
 * JSON-encoded parameters for the Keyboard constructor from the element's "data-value"
 * attribute, invoking the constructor to create a Keyboard component, and then binding
 * any associated HTML controls to the new component.
 */
Keyboard.init = function()
{
    var aeKbd = Component.getElementsByClass(document, PC8080.APPCLASS, "keyboard");
    for (var iKbd = 0; iKbd < aeKbd.length; iKbd++) {
        var eKbd = aeKbd[iKbd];
        var parmsKbd = Component.getComponentParms(eKbd);
        var kbd = new Keyboard(parmsKbd);
        Component.bindComponentControls(kbd, eKbd, PC8080.APPCLASS);
    }
};

/*
 * Initialize every Keyboard module on the page.
 */
web.onInit(Keyboard.init);

if (NODE) module.exports = Keyboard;
