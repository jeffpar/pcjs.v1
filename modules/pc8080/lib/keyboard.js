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

/**
 * Alphanumeric and other common (printable) ASCII codes.
 *
 * TODO: Determine what we can do to get ALL constants like these inlined by the Closure Compiler
 * (enum doesn't seem to get the job done); the problem seems to be limited to property references
 * that use quotes, which is why I've 'unquoted' as many of them as possible.
 *
 * @enum {number}
 */
Keyboard8080.ASCII = {
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
 * Most of these represent non-ASCII characters (eg, the LEFT arrow key), yet for some reason, browsers
 * defined them using ASCII codes (eg, the LEFT arrow key uses 37, which is the ASCII code for '%').
 *
 * @enum {number}
 */
Keyboard8080.KEYCODE = {
    /* 0x08 */ BS:          8,
    /* 0x09 */ TAB:         9,
    /* 0x0A */ LF:          10,         // TODO: Determine if any key actually generates this (I suspect there is none)
    /* 0x0D */ CR:          13,
    /* 0x10 */ SHIFT:       16,
    /* 0x11 */ CTRL:        17,
    /* 0x12 */ ALT:         18,
    /* 0x13 */ PAUSE:       19,         // PAUSE/BREAK
    /* 0x14 */ CAPSLOCK:    20,
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
    /* 0x60 */ NUM_0:       96,
    /* 0x60 */ NUM_INS:     96,
    /* 0x60 */ FF_BQUOTE:   96,
    /* 0x61 */ NUM_1:       97,
    /* 0x61 */ NUM_END:     97,
    /* 0x62 */ NUM_2:       98,
    /* 0x62 */ NUM_DOWN:    98,
    /* 0x63 */ NUM_3:       99,
    /* 0x63 */ NUM_PGDN:    99,
    /* 0x64 */ NUM_4:       100,
    /* 0x64 */ NUM_LEFT:    100,
    /* 0x65 */ NUM_5:       101,
    /* 0x65 */ NUM_CENTER:  101,
    /* 0x66 */ NUM_6:       102,
    /* 0x66 */ NUM_RIGHT:   102,
    /* 0x67 */ NUM_7:       103,
    /* 0x67 */ NUM_HOME:    103,
    /* 0x68 */ NUM_8:       104,
    /* 0x68 */ NUM_UP:      104,
    /* 0x69 */ NUM_9:       105,
    /* 0x69 */ NUM_PGUP:    105,
    /* 0x6A */ NUM_MUL:     106,
    /* 0x6B */ NUM_ADD:     107,
    /* 0x6D */ NUM_SUB:     109,
    /* 0x6E */ NUM_DEL:     110,        // aka PERIOD
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
 * Check the event object's 'location' property for a non-zero value for the following ONRIGHT keys.
 */
Keyboard8080.KEYCODE.NUM_CR = Keyboard8080.KEYCODE.CR + Keyboard8080.KEYCODE.ONRIGHT;

/*
 * Maps "stupid" keyCodes to their "non-stupid" counterparts
 */
Keyboard8080.STUPID_KEYCODES = {};
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.SEMI]    = Keyboard8080.ASCII[';'];   // 186 -> 59
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.EQUALS]  = Keyboard8080.ASCII['='];   // 187 -> 61
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.COMMA]   = Keyboard8080.ASCII[','];   // 188 -> 44
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.DASH]    = Keyboard8080.ASCII['-'];   // 189 -> 45
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.PERIOD]  = Keyboard8080.ASCII['.'];   // 190 -> 46
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.SLASH]   = Keyboard8080.ASCII['/'];   // 191 -> 47
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.BQUOTE]  = Keyboard8080.ASCII['`'];   // 192 -> 96
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.LBRACK]  = Keyboard8080.ASCII['['];   // 219 -> 91
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.BSLASH]  = Keyboard8080.ASCII['\\'];  // 220 -> 92
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.RBRACK]  = Keyboard8080.ASCII[']'];   // 221 -> 93
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.QUOTE]   = Keyboard8080.ASCII["'"];   // 222 -> 39
Keyboard8080.STUPID_KEYCODES[Keyboard8080.KEYCODE.FF_DASH] = Keyboard8080.ASCII['-'];

Keyboard8080.MINPRESSTIME = 100;            // 100ms

/**
 * Alternate keyCode mappings to support popular "WASD"-style directional-key mappings.
 *
 * TODO: ES6 computed property name support may now be in all mainstream browsers, allowing us to use
 * a simple object literal for this and all other object initializations.
 */
Keyboard8080.WASDCODES = {};
Keyboard8080.WASDCODES[Keyboard8080.ASCII.A] = Keyboard8080.KEYCODE.LEFT;
Keyboard8080.WASDCODES[Keyboard8080.ASCII.D] = Keyboard8080.KEYCODE.RIGHT;
Keyboard8080.WASDCODES[Keyboard8080.ASCII.L] = Keyboard8080.KEYCODE.SPACE;

/*
 * Supported configurations
 */
Keyboard8080.SI1978 = {
    MODEL:          1978.1,
    KEYMAP: {},
    ALTCODES: Keyboard8080.WASDCODES,
    LEDCODES: {},
    SOFTCODES: {
        '1p':       Keyboard8080.KEYCODE.ONE,
        '2p':       Keyboard8080.KEYCODE.TWO,
        'coin':     Keyboard8080.KEYCODE.THREE,
        'left':     Keyboard8080.KEYCODE.LEFT,
        'right':    Keyboard8080.KEYCODE.RIGHT,
        'fire':     Keyboard8080.KEYCODE.SPACE
    }
};

Keyboard8080.VT100 = {
    MODEL:          100.0,
    KEYMAP: {},
    ALTCODES: {},
    LEDCODES: {},
    SOFTCODES: {
        'setup':    Keyboard8080.KEYCODE.F9
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
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.DEL]     =   0x03;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.P]         =   0x05;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.O]         =   0x06;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.Y]         =   0x07;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.T]         =   0x08;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.W]         =   0x09;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.Q]         =   0x0A;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.RIGHT]   =   0x10;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.RBRACK]  =   0x14;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.LBRACK]  =   0x15;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.I]         =   0x16;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.U]         =   0x17;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.R]         =   0x18;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.E]         =   0x19;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.ONE]     =   0x1A;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.LEFT]    =   0x20;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.DOWN]    =   0x22;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.F6]      =   0x23;   // aka BREAK
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.PAUSE]   =   0x23;   // aka BREAK
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.BQUOTE]  =   0x24;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.DASH]    =   0x25;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NINE]    =   0x26;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.SEVEN]   =   0x27;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.FOUR]    =   0x28;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.THREE]   =   0x29;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.ESC]     =   0x2A;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.UP]      =   0x30;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.F3]      =   0x31;   // aka PF3
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.F1]      =   0x32;   // aka PF1
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.BS]      =   0x33;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.EQUALS]  =   0x34;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.ZERO]    =   0x35;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.EIGHT]   =   0x36;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.SIX]     =   0x37;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.FIVE]    =   0x38;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.TWO]     =   0x39;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.TAB]     =   0x3A;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_7]   =   0x40;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.F4]      =   0x41;   // aka PF4
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.F2]      =   0x42;   // aka PF2
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_0]   =   0x43;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.F7]      =   0x44;   // aka LINE FEED
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.BSLASH]  =   0x45;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.L]         =   0x46;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.K]         =   0x47;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.G]         =   0x48;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.F]         =   0x49;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.A]         =   0x4A;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_8]   =   0x50;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_CR]  =   0x51;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_2]   =   0x52;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_1]   =   0x53;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.QUOTE]   =   0x55;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.SEMI]    =   0x56;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.J]         =   0x57;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.H]         =   0x58;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.D]         =   0x59;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.S]         =   0x5A;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_DEL] =   0x60;   // keypad period
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.F5]      =   0x61;   // aka KEYPAD COMMA
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_5]   =   0x62;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_4]   =   0x63;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.CR]      =   0x64;   // TODO: Figure out why the Technical Manual lists CR at both 0x04 and 0x64
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.PERIOD]  =   0x65;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.COMMA]   =   0x66;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.N]         =   0x67;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.B]         =   0x68;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.X]         =   0x69;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.F8]      =   0x6A;   // aka NO SCROLL
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_9]   =   0x70;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_3]   =   0x71;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_6]   =   0x72;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.NUM_SUB] =   0x73;   // aka KEYPAD MINUS
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.SLASH]   =   0x75;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.M]         =   0x76;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII[' ']]      =   0x77;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.V]         =   0x78;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.C]         =   0x79;
Keyboard8080.VT100.KEYMAP[Keyboard8080.ASCII.Z]         =   0x7A;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.F9]      =   0x7B;   // aka SET-UP
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.CTRL]    =   0x7C;
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.SHIFT]   =   0x7D;   // either shift key (doesn't matter)
Keyboard8080.VT100.KEYMAP[Keyboard8080.KEYCODE.CAPSLOCK]=   0x7E;

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
                         */
                        if (kbd.cmp) kbd.cmp.updateFocus();
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
 *      time this is polled, see if the cycle count has exceeded the snapshot value by the necessary threshold
 *      amount; if we assume 361.69ns per CPU cycle, there are 22 CPU cycles for every 1 LBA4 cycle, and since
 *      transmission time is supposed to last for 160 LBA4 cycles, that means 22*160 CPU cycles, or 3520 cycles.
 *
 *      2) Set a CPU timer using the new setTimer() interface, which can be passed the number of milliseconds to
 *      wait before firing (in this case, 7945ms).
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
        if (this.cpu.getCycles() >= this.nVT100UARTCycleSnap + 3520) {
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
