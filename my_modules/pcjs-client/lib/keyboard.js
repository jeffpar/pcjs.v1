/**
 * @fileoverview Implements the PCjs Keyboard component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jun-20
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of PCjs, which is part of the JavaScript Machines Project (aka JSMachines)
 * at <http://jsmachines.net/> and <http://pcjs.org/>.
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
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

if (typeof module !== 'undefined') {
    var str         = require("../../shared/lib/strlib");
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var ChipSet     = require("./chipset");
    var State       = require("./state");
    var CPU         = require("./cpu");
    var Debugger    = require("./debugger");
}

/**
 * Keyboard(parmsKbd)
 *
 * The Keyboard component can be configured with the following (parmsKbd) properties:
 *
 *      model: model string; should be one of:
 *
 *          us83 (default)
 *          us84 (TODO: awaiting implementation)
 *          us101 (TODO: awaiting implementation)
 *
 * Its main purpose is to receive binding requests for various keyboard events, and to use those events
 * to simulate the PC's keyboard hardware.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsKbd
 */
function Keyboard(parmsKbd) {

    Component.call(this, "Keyboard", parmsKbd, Keyboard);

    this.nDefaultModel = parmsKbd['model'];

    /*
     * There are multiple ways that scan codes can be injected into the machine: button events,
     * soft-key events, keyDown/keyUp/keyPress events, and the injectKeys() interface.  Currently,
     * there's no attempt to provide any coordination among those mechanisms, except at the lowest
     * level, where scan code generation takes place.  addScanCode() insures that a key (scan code)
     * that's already in the "make" state will not trigger another "make" (unless a "repeat" has
     * been explicitly requested), and it insures that a key (scan code) already in the "break"
     * state will not trigger another "break".
     *
     * TODO: While it might seem sensible to save/restore this state data, I would argue that the
     * best thing to do on a save() is force a "break" of every key still active and NOT save this
     * data.  This relieves restore() from doing any extra work; it can simply assume -- as it has
     * always assumed -- that the keyboard is free of any active "makes".  That does mean saving
     * and restoring abScanBuffer, however, since the machine may not have been able to act upon
     * any of those forced "breaks" yet.
     *
     * TODO: addScanCode() should also provide a "fail-safe" mechanism that attempts to ensure that
     * a key cannot get stuck in the "make" state for more than a few seconds if the user did something
     * odd (eg, switched away from the current page or the entire browser mid-keystroke). For some browser
     * and key combinations (eg, Ctrl-Tab), this may be essential, to avoid stuck shift/modifier keys.
     */
    this.aScanCodesActive = {};

    /*
     * TODO: Make these delays configurable
     */
    this.msReleaseDelay  = 250;         // number of milliseconds before a down key is "forced" up (unless we see it go up)
    this.msReleaseRepeat = 100;         // number of milliseconds before a held key is "forced" up (assuming auto-repeat)
    this.msInjectDelay   = 300;         // number of milliseconds between injected keystrokes

    this.setReady();
}

Component.subclass(Component, Keyboard);

/**
 * Commands that can be sent to the Keyboard via the 8042; see sendCmd()
 *
 * @enum {number}
 */
Keyboard.CMD = {
    RESET:      0xFF,
    RESEND:     0xFE,
    DEF_ON:     0xF6,
    DEF_OFF:    0xF5,
    ENABLE:     0xF4,
    SET_RATE:   0xF3,
    ECHO:       0xEE,
    SET_LEDS:   0xED
};

/**
 * Command responses returned to the Keyboard via the 8042; see sendCmd()
 *
 * @enum {number}
 */
Keyboard.CMDRES = {
    OVERRUN:    0x00,
    LOAD_TEST:  0x65,     // undocumented "LOAD MANUFACTURING TEST REQUEST" response code
    BAT_SUCC:   0xAA,     // Basic Assurance Test (BAT) completed successfully
    ECHO:       0xEE,
    BREAK_PREF: 0xF0,
    ACK:        0xFA,
    BAT_FAIL:   0xFC,     // Basic Assurance Test (BAT) failed
    DIAG_FAIL:  0xFD,
    RESEND:     0xFE
};

/**
 * TODO: Determine what we can do to get ALL constants like these inlined (enum doesn't seem to be getting
 * the job done); the basic problem seems to be caused by referencing the properties with quotes.
 *
 * @enum {number}
 */
Keyboard.ASCII = {
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
 * Browser keyCodes we must pay particular attention to.
 *
 * @enum {number}
 */
Keyboard.KEYCODE = {
    /* 0x08 */  BS:         8,
    /* 0x09 */  TAB:        9,
    /* 0x0A */  LF:         10,
    /* 0x0D */  CR:         13,
    /* 0x10 */  SHIFT:      16,
    /* 0x11 */  CTRL:       17,
    /* 0x12 */  ALT:        18,
    /* 0x14 */  CAPSLOCK:   20,
    /* 0x1B */  ESC:        27,
    /* 0x21 */  PGUP:       33,
    /* 0x22 */  PGDN:       34,
    /* 0x23 */  END:        35,
    /* 0x24 */  HOME:       36,
    /* 0x25 */  LEFT:       37,
    /* 0x26 */  UP:         38,
    /* 0x27 */  RIGHT:      39,
    /* 0x28 */  DOWN:       40,
    /* 0x2D */  INS:        45,
    /* 0x2E */  DEL:        46,
    /* 0x5B */  COMMAND:    91,         // TODO: Treat this like the 'Windows' key
    /* 0x70 */  F1:         112,
    /* 0x71 */  F2:         113,
    /* 0x72 */  F3:         114,
    /* 0x73 */  F4:         115,
    /* 0x74 */  F5:         116,
    /* 0x75 */  F6:         117,
    /* 0x76 */  F7:         118,
    /* 0x77 */  F8:         119,
    /* 0x78 */  F9:         120,
    /* 0x79 */  F10:        121,
    /* 0x7A */  F11:        122,
    /* 0x7B */  F12:        123,
    //
    // This is a bias we add to browser keyCodes that we want to handle on "down" rather than "press"
    //
    ONDOWN:                 1000,
    //
    // This is a bias we add to browser keyCodes that need to check for a "right" location (default is "left")
    //
    ONRIGHT:                2000,
    //
    // This is a bias we add to create fake keyCodes that correspond to special keystroke sequences
    //
    FAKE:                   4000,
    FAKE_CTRLC:             4003,
    FAKE_CTRLBREAK:         4101,
    FAKE_CTRLALTDEL:        4102
};

/**
 * The set of values that a browser may store in the 'location' property of a
 * keyboard event object which we also support.
 *
 * @enum {number}
 */
Keyboard.LOCATION = {
    LEFT:   1,
    RIGHT:  2,
    NUMPAD: 3
};

/**
 * These "shift key" states are stored in bitsShift, as well as in aKeyCodes;
 * note that the right-hand versions of selected shift bits are shifted 1 bit right.
 *
 * @enum {number}
 */
Keyboard.STATE = {
    RSHIFT:     0x0001,
    SHIFT:      0x0002,
    RCTRL:      0x0004,         // 101-key keyboard only
    CTRL:       0x0008,
    RALT:       0x0010,         // 101-key keyboard only
    ALT:        0x0020,
    COMMAND:    0x0040,         // 101-key keyboard only (TODO: Treat this like the 'Windows' key)
    INSERT:     0x0080,         // TODO: Placeholder
    CAPSLOCK:   0x0100,
    NUMLOCK:    0x0200,         // TODO: Placeholder
    SCROLLLOCK: 0x0400,         // TODO: Placeholder
    SIMULATE:   0x003f          // STATE.RSHIFT | STATE.SHIFT | STATE.RCTRL | STATE.CTRL | STATE.RALT | STATE.ALT
};

/**
 * Maps the KEYCODE of a "shift key" to its corresponding (default) STATE bit above
 *
 * @enum {number}
 */
Keyboard.STATEKEYS = {
    0x10:       Keyboard.STATE.SHIFT,
    0x11:       Keyboard.STATE.CTRL,
    0x12:       Keyboard.STATE.ALT
};

/**
 * Browsers brilliantly define keyCodes for non-ASCII keys (eg, 37 for the LEFT arrow key) with
 * values that overlap ASCII keyCodes (eg, 37 is also the ASCII code for '%'), which unnecessarily
 * complicates life for keyDown/keyPress/keyUp handlers, all of which receive a keyCode property,
 * but which does NOT always contain the same value for the same key press.
 *
 * We solve the problem by adding an ONDOWN bias to all these particular keyCodes, and then make
 * sure we store these keyCodes in aKeyCodes with the same bias.  ONDOWN is also a signal to our
 * keyCode handlers that the key in question should be handled during keyDown, not keyPress, often
 * because they don't generate a keyPress event anyway.
 *
 * @enum {number}
 */
Keyboard.aButtonCodes = {
    'tab':          Keyboard.KEYCODE.TAB   + Keyboard.KEYCODE.ONDOWN,
    'esc':          Keyboard.KEYCODE.ESC   + Keyboard.KEYCODE.ONDOWN,
    'right-shift':  Keyboard.KEYCODE.SHIFT + Keyboard.KEYCODE.ONDOWN + Keyboard.KEYCODE.ONRIGHT,
    'shift':        Keyboard.KEYCODE.SHIFT + Keyboard.KEYCODE.ONDOWN,
    'ctrl':         Keyboard.KEYCODE.CTRL  + Keyboard.KEYCODE.ONDOWN,
    'alt':          Keyboard.KEYCODE.ALT   + Keyboard.KEYCODE.ONDOWN,
    'caps-lock':    Keyboard.KEYCODE.CAPSLOCK + Keyboard.KEYCODE.ONDOWN,
    'f1':           Keyboard.KEYCODE.F1    + Keyboard.KEYCODE.ONDOWN,
    'f2':           Keyboard.KEYCODE.F2    + Keyboard.KEYCODE.ONDOWN,
    'f3':           Keyboard.KEYCODE.F3    + Keyboard.KEYCODE.ONDOWN,
    'f4':           Keyboard.KEYCODE.F4    + Keyboard.KEYCODE.ONDOWN,
    'f5':           Keyboard.KEYCODE.F5    + Keyboard.KEYCODE.ONDOWN,
    'f6':           Keyboard.KEYCODE.F6    + Keyboard.KEYCODE.ONDOWN,
    'f7':           Keyboard.KEYCODE.F7    + Keyboard.KEYCODE.ONDOWN,
    'f8':           Keyboard.KEYCODE.F8    + Keyboard.KEYCODE.ONDOWN,
    'f9':           Keyboard.KEYCODE.F9    + Keyboard.KEYCODE.ONDOWN,
    'f10':          Keyboard.KEYCODE.F10   + Keyboard.KEYCODE.ONDOWN,
    'left':         Keyboard.KEYCODE.LEFT  + Keyboard.KEYCODE.ONDOWN,   // formerly "left-arrow"
    'up':           Keyboard.KEYCODE.UP    + Keyboard.KEYCODE.ONDOWN,   // formerly "up-arrow"
    'right':        Keyboard.KEYCODE.RIGHT + Keyboard.KEYCODE.ONDOWN,   // formerly "right-arrow"
    'down':         Keyboard.KEYCODE.DOWN  + Keyboard.KEYCODE.ONDOWN,   // formerly "down-arrow"
    /*
     * These bindings are for convenience (common key combinations that can be bound to a single control)
     */
    'ctrl-c':       Keyboard.KEYCODE.FAKE_CTRLC,
    'ctrl-break':   Keyboard.KEYCODE.FAKE_CTRLBREAK,
    'ctrl-alt-del': Keyboard.KEYCODE.FAKE_CTRLALTDEL
};

/**
 * Define "soft keyboard" identifiers for all possible keys, based on their primary (unshifted) character
 * or function.  This also serves as a definition of all supported scan codes.
 *
 * One exception to the above rule is 'prtsc': on the original IBM 83-key and 84-key keyboards, its primary
 * (unshifted) character was '*', but on 101-key keyboards, it became a separate key ('prtsc', now labeled
 * 'Print Screen'), as did the num-pad '*' ('num-mul'), so 'prtsc' seems worthy of an exception to the rule.
 *
 * On 83-key and 84-key keyboards, 'ctrl'+'num-lock' triggered a "pause" operation and 'ctrl'+'scroll-lock'
 * triggered a "break" operation (I'm using double-quotes to describe the operations and single-quotes to
 * describe the keys).
 *
 * On 101-key keyboards, IBM decided to move both those special operations to a new 'pause' key, alongside
 * the dedicated 'prtsc' ('Print Screen') key.  Those keys behaved as follows:
 *
 *      When 'pause' is pressed alone, it generates 0xe1 0x1d 0x45 0xe1 0x9d 0xc5 on make (nothing on break),
 *      which essentially simulates the make-and-break of the 'ctrl' and 'num-lock' keys (ignoring the 0xe1),
 *      triggering a "pause" operation.
 *
 *      When 'pause' is pressed with 'ctrl', it generates 0xe0 0x46 0xe0 0xc6 on make (nothing on break) and
 *      does not repeat, which essentially simulates the make-and-break of 'scroll-lock', which, in conjunction
 *      with the separate make-and-break of 'ctrl', triggers a "break" operation.
 *
 *      When 'prtsc' is pressed alone, it generates 0xe0 0x2a 0xe0 0x37, simulating the make of both 'shift'
 *      and 'prtsc'; when pressed with 'shift' or 'ctrl', it generates only 0xe0 0x37; and when pressed with
 *      'alt', it generates only 0x54 (to simulate 'sysreq').
 *
 * All key identifiers must be quotable using single-quotes, because that's how components.xsl will encode them
 * in the "data-value" attribute of the corresponding HTML control.  Which, in turn, is why the single-quote
 * key is defined as 'quote' rather than "'".  Similarly, if there was unshifted "double-quote" key, it could
 * not be called '"', because XML files must quote all their bindings using double-quotes.
 *
 * In the (informal) numbering of keys below, two keys are deliberately numbered 84, reflecting the fact that
 * the 'sysreq' key was added to the 84-key keyboard but then dropped from the 101-key keyboard.
 *
 * @enum {number}
 */
Keyboard.aSoftCodes = {
    /*  1 */    'esc':          0x01,
    /*  2 */    '1':            0x02,
    /*  3 */    '2':            0x03,
    /*  4 */    '3':            0x04,
    /*  5 */    '4':            0x05,
    /*  6 */    '5':            0x06,
    /*  7 */    '6':            0x07,
    /*  8 */    '7':            0x08,
    /*  9 */    '8':            0x09,
    /* 10 */    '9':            0x0a,
    /* 11 */    '0':            0x0b,
    /* 12 */    '-':            0x0c,
    /* 13 */    '=':            0x0d,
    /* 14 */    'backspace':    0x0e,
    /* 15 */    'tab':          0x0f,
    /* 16 */    'q':            0x10,
    /* 17 */    'w':            0x11,
    /* 18 */    'e':            0x12,
    /* 19 */    'r':            0x13,
    /* 20 */    't':            0x14,
    /* 21 */    'y':            0x15,
    /* 22 */    'u':            0x16,
    /* 23 */    'i':            0x17,
    /* 24 */    'o':            0x18,
    /* 25 */    'p':            0x19,
    /* 26 */    '[':            0x1a,
    /* 27 */    ']':            0x1b,
    /* 28 */    'enter':        0x1c,
    /* 29 */    'ctrl':         0x1d,
    /* 30 */    'a':            0x1e,
    /* 31 */    's':            0x1f,
    /* 32 */    'd':            0x20,
    /* 33 */    'f':            0x21,
    /* 34 */    'g':            0x22,
    /* 35 */    'h':            0x23,
    /* 36 */    'j':            0x24,
    /* 37 */    'k':            0x25,
    /* 38 */    'l':            0x26,
    /* 39 */    ';':            0x27,
    /* 40 */    'quote':        0x28,           // formerly "squote"
    /* 41 */    '`':            0x29,           // formerly "bquote"
    /* 42 */    'shift':        0x2a,           // formerly "lshift"
    /* 43 */    '\\':           0x2b,           // formerly "bslash"
    /* 44 */    'z':            0x2c,
    /* 45 */    'x':            0x2d,
    /* 46 */    'c':            0x2e,
    /* 47 */    'v':            0x2f,
    /* 48 */    'b':            0x30,
    /* 49 */    'n':            0x31,
    /* 50 */    'm':            0x32,
    /* 51 */    ',':            0x33,
    /* 52 */    '.':            0x34,
    /* 53 */    '/':            0x35,
    /* 54 */    'right-shift':  0x36,           // formerly "rshift"
    /* 55 */    'prtsc':        0x37,           // unshifted '*'; becomes dedicated 'Print Screen' key on 101-key keyboards
    /* 56 */    'alt':          0x38,
    /* 57 */    'space':        0x39,
    /* 58 */    'caps-lock':    0x3a,
    /* 59 */    'f1':           0x3b,
    /* 60 */    'f2':           0x3c,
    /* 61 */    'f3':           0x3d,
    /* 62 */    'f4':           0x3e,
    /* 63 */    'f5':           0x3f,
    /* 64 */    'f6':           0x40,
    /* 65 */    'f7':           0x41,
    /* 66 */    'f8':           0x42,
    /* 67 */    'f9':           0x43,
    /* 68 */    'f10':          0x44,
    /* 69 */    'num-lock':     0x45,
    /* 70 */    'scroll-lock':  0x46,           // 0xe046 on 101-key keyboards?
    /* 71 */    'num-home':     0x47,           // formerly "home"
    /* 72 */    'num-up':       0x48,           // formerly "up-arrow"
    /* 73 */    'num-pgup':     0x49,           // formerly "page-up"
    /* 74 */    'num-sub':      0x4a,           // formerly "num-minus"
    /* 75 */    'num-left':     0x4b,           // formerly "left-arrow"
    /* 76 */    'num-center':   0x4c,           // formerly "center"
    /* 77 */    'num-right':    0x4d,           // formerly "right-arrow"
    /* 78 */    'num-add':      0x4e,           // formerly "num-plus"
    /* 79 */    'num-end':      0x4f,           // formerly "end"
    /* 80 */    'num-down':     0x50,           // formerly "down-arrow"
    /* 81 */    'num-pgdn':     0x51,           // formerly "page-down"
    /* 82 */    'num-ins':      0x52,           // formerly "ins"
    /* 83 */    'num-del':      0x53,           // formerly "del"
    /* 84 */    'sysreq':       0x54,           // 84-key keyboard only (simulated with 'alt'+'prtsc' on 101-key keyboards)
    /* 84 */    'pause':        0x54,           // 101-key keyboard only
    /* 85 */    'f11':          0x57,
    /* 86 */    'f12':          0x58,
    /* 87 */    'num-enter':    0xe01c,
    /* 88 */    'right-ctrl':   0xe01d,
    /* 89 */    'num-div':      0xe035,
    /* 90 */    'num-mul':      0xe037,
    /* 91 */    'right-alt':    0xe038,
    /* 92 */    'home':         0xe047,
    /* 93 */    'up':           0xe048,
    /* 94 */    'pgup':         0xe049,
    /* 95 */    'left':         0xe04b,
    /* 96 */    'right':        0xe04d,
    /* 97 */    'end':          0xe04f,
    /* 98 */    'down':         0xe050,
    /* 99 */    'pgdn':         0xe051,
   /* 100 */    'ins':          0xe052,
   /* 101 */    'del':          0xe053,
                'win':          0xe05b,         // ie, the 'Windows' key
                'right-win':    0xe05c,
                'menu':         0xe05d
};

/**
 * This array is used by keyEventSimulate() to lookup a given keyCode and convert it to a scan code
 * (lower byte) plus any required shift key states (upper bytes).
 *
 * Using keyCodes from keyPress events proved to be more robust than using keyCodes from keyDown and
 * keyUp events, in part because of differences in the way browsers generate the keyDown and keyUp events.
 * For example, Safari on iOS devices will not generate up/down events for shift keys, and for other keys,
 * the up/down events are usually generated after the actual press is complete, and in rapid succession,
 * which doesn't always give the simulation enough time to detect the key.
 *
 * The other problem (which is more of a problem with keyboards like the C1P than any IBM keyboards) is
 * that the shift/modifier state for a character on the "source" keyboard may not match the shift/modifier
 * state for the same character on the "target" keyboard.  And since this code is inherited from C1Pjs,
 * we've inherited the same solution: keyEventSimulate() has the ability to "undo" any states in bitsShift
 * that conflict with the state(s) required for the character in question.
 *
 * @enum {number}
 */
Keyboard.aKeyCodes = {};
Keyboard.aKeyCodes[Keyboard.KEYCODE.ESC   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['esc'];
Keyboard.aKeyCodes[Keyboard.ASCII['1']]   = Keyboard.aSoftCodes['1'];
Keyboard.aKeyCodes[Keyboard.ASCII['!']]   = Keyboard.aSoftCodes['1'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['2']]   = Keyboard.aSoftCodes['2'];
Keyboard.aKeyCodes[Keyboard.ASCII['@']]   = Keyboard.aSoftCodes['2'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['3']]   = Keyboard.aSoftCodes['3'];
Keyboard.aKeyCodes[Keyboard.ASCII['#']]   = Keyboard.aSoftCodes['3'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['4']]   = Keyboard.aSoftCodes['4'];
Keyboard.aKeyCodes[Keyboard.ASCII['$']]   = Keyboard.aSoftCodes['4'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['5']]   = Keyboard.aSoftCodes['5'];
Keyboard.aKeyCodes[Keyboard.ASCII['%']]   = Keyboard.aSoftCodes['5'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['6']]   = Keyboard.aSoftCodes['6'];
Keyboard.aKeyCodes[Keyboard.ASCII['^']]   = Keyboard.aSoftCodes['6'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['7']]   = Keyboard.aSoftCodes['7'];
Keyboard.aKeyCodes[Keyboard.ASCII['&']]   = Keyboard.aSoftCodes['7'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['8']]   = Keyboard.aSoftCodes['8'];
Keyboard.aKeyCodes[Keyboard.ASCII['*']]   = Keyboard.aSoftCodes['8'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['9']]   = Keyboard.aSoftCodes['9'];
Keyboard.aKeyCodes[Keyboard.ASCII['(']]   = Keyboard.aSoftCodes['9'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['0']]   = Keyboard.aSoftCodes['0'];
Keyboard.aKeyCodes[Keyboard.ASCII[')']]   = Keyboard.aSoftCodes['0'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['-']]   = Keyboard.aSoftCodes['-'];
Keyboard.aKeyCodes[Keyboard.ASCII['_']]   = Keyboard.aSoftCodes['-'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['=']]   = Keyboard.aSoftCodes['='];
Keyboard.aKeyCodes[Keyboard.ASCII['+']]   = Keyboard.aSoftCodes['='] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.BS    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['backspace'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.TAB   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['tab'];
Keyboard.aKeyCodes[Keyboard.ASCII.q]      = Keyboard.aSoftCodes['q'];
Keyboard.aKeyCodes[Keyboard.ASCII.Q]      = Keyboard.aSoftCodes['q'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.w]      = Keyboard.aSoftCodes['w'];
Keyboard.aKeyCodes[Keyboard.ASCII.W]      = Keyboard.aSoftCodes['w'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.e]      = Keyboard.aSoftCodes['e'];
Keyboard.aKeyCodes[Keyboard.ASCII.E]      = Keyboard.aSoftCodes['e'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.r]      = Keyboard.aSoftCodes['r'];
Keyboard.aKeyCodes[Keyboard.ASCII.R]      = Keyboard.aSoftCodes['r'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.t]      = Keyboard.aSoftCodes['t'];
Keyboard.aKeyCodes[Keyboard.ASCII.T]      = Keyboard.aSoftCodes['t'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.y]      = Keyboard.aSoftCodes['y'];
Keyboard.aKeyCodes[Keyboard.ASCII.Y]      = Keyboard.aSoftCodes['y'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.u]      = Keyboard.aSoftCodes['u'];
Keyboard.aKeyCodes[Keyboard.ASCII.U]      = Keyboard.aSoftCodes['u'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.i]      = Keyboard.aSoftCodes['i'];
Keyboard.aKeyCodes[Keyboard.ASCII.I]      = Keyboard.aSoftCodes['i'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.o]      = Keyboard.aSoftCodes['o'];
Keyboard.aKeyCodes[Keyboard.ASCII.O]      = Keyboard.aSoftCodes['o'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.p]      = Keyboard.aSoftCodes['p'];
Keyboard.aKeyCodes[Keyboard.ASCII.P]      = Keyboard.aSoftCodes['p'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['[']]   = Keyboard.aSoftCodes['['];
Keyboard.aKeyCodes[Keyboard.ASCII['{']]   = Keyboard.aSoftCodes['['] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII[']']]   = Keyboard.aSoftCodes[']'];
Keyboard.aKeyCodes[Keyboard.ASCII['}']]   = Keyboard.aSoftCodes[']'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.CR]   = Keyboard.aSoftCodes['enter'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.CTRL  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['ctrl'];
Keyboard.aKeyCodes[Keyboard.ASCII.a]      = Keyboard.aSoftCodes['a'];
Keyboard.aKeyCodes[Keyboard.ASCII.A]      = Keyboard.aSoftCodes['a'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.s]      = Keyboard.aSoftCodes['s'];
Keyboard.aKeyCodes[Keyboard.ASCII.S]      = Keyboard.aSoftCodes['s'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.d]      = Keyboard.aSoftCodes['d'];
Keyboard.aKeyCodes[Keyboard.ASCII.D]      = Keyboard.aSoftCodes['d'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.f]      = Keyboard.aSoftCodes['f'];
Keyboard.aKeyCodes[Keyboard.ASCII.F]      = Keyboard.aSoftCodes['f'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.g]      = Keyboard.aSoftCodes['g'];
Keyboard.aKeyCodes[Keyboard.ASCII.G]      = Keyboard.aSoftCodes['g'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.h]      = Keyboard.aSoftCodes['h'];
Keyboard.aKeyCodes[Keyboard.ASCII.H]      = Keyboard.aSoftCodes['h'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.j]      = Keyboard.aSoftCodes['j'];
Keyboard.aKeyCodes[Keyboard.ASCII.J]      = Keyboard.aSoftCodes['j'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.k]      = Keyboard.aSoftCodes['k'];
Keyboard.aKeyCodes[Keyboard.ASCII.K]      = Keyboard.aSoftCodes['k'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.l]      = Keyboard.aSoftCodes['l'];
Keyboard.aKeyCodes[Keyboard.ASCII.L]      = Keyboard.aSoftCodes['l'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII[';']]   = Keyboard.aSoftCodes[';'];
Keyboard.aKeyCodes[Keyboard.ASCII[':']]   = Keyboard.aSoftCodes[';'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII["'"]]   = Keyboard.aSoftCodes['quote'];
Keyboard.aKeyCodes[Keyboard.ASCII['"']]   = Keyboard.aSoftCodes['quote'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['`']]   = Keyboard.aSoftCodes['`'];
Keyboard.aKeyCodes[Keyboard.ASCII['~']]   = Keyboard.aSoftCodes['`'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.SHIFT + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['shift'];
Keyboard.aKeyCodes[Keyboard.ASCII['\\']]  = Keyboard.aSoftCodes['\\'];
Keyboard.aKeyCodes[Keyboard.ASCII['\\']]  = Keyboard.aSoftCodes['\\']| (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.z]      = Keyboard.aSoftCodes['z'];
Keyboard.aKeyCodes[Keyboard.ASCII.Z]      = Keyboard.aSoftCodes['z'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.x]      = Keyboard.aSoftCodes['x'];
Keyboard.aKeyCodes[Keyboard.ASCII.X]      = Keyboard.aSoftCodes['x'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.c]      = Keyboard.aSoftCodes['c'];
Keyboard.aKeyCodes[Keyboard.ASCII.C]      = Keyboard.aSoftCodes['c'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.v]      = Keyboard.aSoftCodes['v'];
Keyboard.aKeyCodes[Keyboard.ASCII.V]      = Keyboard.aSoftCodes['v'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.b]      = Keyboard.aSoftCodes['b'];
Keyboard.aKeyCodes[Keyboard.ASCII.B]      = Keyboard.aSoftCodes['b'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.n]      = Keyboard.aSoftCodes['n'];
Keyboard.aKeyCodes[Keyboard.ASCII.N]      = Keyboard.aSoftCodes['n'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.m]      = Keyboard.aSoftCodes['m'];
Keyboard.aKeyCodes[Keyboard.ASCII.M]      = Keyboard.aSoftCodes['m'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII[',']]   = Keyboard.aSoftCodes[','];
Keyboard.aKeyCodes[Keyboard.ASCII['<']]   = Keyboard.aSoftCodes[','] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['.']]   = Keyboard.aSoftCodes['.'];
Keyboard.aKeyCodes[Keyboard.ASCII['>']]   = Keyboard.aSoftCodes['.'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['/']]   = Keyboard.aSoftCodes['/'];
Keyboard.aKeyCodes[Keyboard.ASCII['?']]   = Keyboard.aSoftCodes['/'] | (Keyboard.STATE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.SHIFT + Keyboard.KEYCODE.ONDOWN +  Keyboard.KEYCODE.ONRIGHT] = Keyboard.aSoftCodes['right-shift'];
// TBD: 0x37 ('prtsc') goes here
Keyboard.aKeyCodes[Keyboard.KEYCODE.ALT   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['alt'];
Keyboard.aKeyCodes[Keyboard.ASCII[' ']]   = Keyboard.aSoftCodes['space'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.CAPSLOCK+Keyboard.KEYCODE.ONDOWN]=  Keyboard.aSoftCodes['caps-lock'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.F1    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['f1'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.F2    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['f2'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.F3    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['f3'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.F4    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['f4'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.F5    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['f5'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.F6    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['f6'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.F7    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['f7'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.F8    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['f8'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.F9    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['f9'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.F10   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['f10'];
// TBD: 0x45 ('num-lock') and 0x46 ('scroll-lock') go here
Keyboard.aKeyCodes[Keyboard.KEYCODE.HOME  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['num-home'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.UP    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['num-up'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.PGUP  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['num-pgup'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.LEFT  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['num-left'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.RIGHT + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['num-right'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.END   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['num-end'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.DOWN  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['num-down'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.PGDN  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['num-pgdn'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.INS   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['num-ins'];
Keyboard.aKeyCodes[Keyboard.KEYCODE.DEL   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.aSoftCodes['num-del'];
// TBD for all keyboards: 'num-add', 'num-sub'
// TBD for 101-key keyboards: 'num-mul', 'num-div', 'num-enter', the stand-alone arrow keys, etc.
Keyboard.aKeyCodes[Keyboard.KEYCODE.FAKE_CTRLC]      = Keyboard.aSoftCodes['c'] + (Keyboard.STATE.CTRL << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.FAKE_CTRLBREAK]  = Keyboard.aSoftCodes['scroll-lock'] + (Keyboard.STATE.CTRL << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.FAKE_CTRLALTDEL] = Keyboard.aSoftCodes['num-del'] + (Keyboard.STATE.CTRL << 8) + (Keyboard.STATE.ALT << 16);

/**
 * Options for keyEventSimulate()
 *
 * @enum {number}
 */
Keyboard.SIMCODE = {
    KEYPRESS:   0,
    KEYRELEASE: 1,
    KEYEVENT:   2,
    KEYTIMEOUT: 3,
    AUTOCLEAR:  4
};

if (DEBUGGER) {
    Keyboard.aSimCodeDescs = ["keyPress", "keyRelease", "keyEvent", "keyTimeout", "autoClear"];
}

/**
 * setBinding(sHTMLClass, sHTMLType, sBinding, control)
 *
 * @this {Keyboard}
 * @param {string|null} sHTMLClass is the class of the HTML control (eg, "input", "output")
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "esc")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Keyboard.prototype.setBinding = function(sHTMLClass, sHTMLType, sBinding, control)
{
    /*
     * There's a special binding that the Video component uses ("kbd") to effectively bind its
     * canvas to the entire keyboard, in Video.powerUp(); ie:
     *
     *      video.kbd.setBinding("input", "canvas", "kbd", video.canvasScreen);
     * or:
     *      video.kbd.setBinding("input", "textarea", "kbd", video.textareaScreen);
     *
     * However, it's also possible for the keyboard XML definition to define a control that serves
     * a similar purpose; eg:
     *
     *      <control class="input" type="text" binding="kbd" width="2em">Kbd</control>
     *
     * The latter is purely experimental, while we work on finding ways to trigger the soft keyboard on
     * certain pesky devices (like the Kindle Fire).  Note that even if you use the latter, the former will
     * still be enabled (there's currently no way to configure the Video component to not bind its canvas,
     * but we could certainly add one if the need ever arose).
     */
    var kbd = this;
    var id = sHTMLType + '-' + sBinding;
    if (this.bindings[id] === undefined) {
        switch (sBinding) {
        case "kbd":
            this.bindings[id] = control;
            control.onkeydown = function onKeyDownKeyboard(event) {
                return kbd.keyEvent(event, true);
            };
            control.onkeypress = function onKeyPressKeyboard(event) {
                return kbd.keyPress(event);
            };
            control.onkeyup = function onKeyUpKeyboard(event) {
                return kbd.keyEvent(event, false);
            };
            return true;
        default:
            if (Keyboard.aButtonCodes[sBinding] !== undefined && sHTMLType == "button") {
                this.bindings[id] = control;
                control.onclick = function(kbd, sKey, keyCode) {
                    return function onClickKeyboard(event) {
                        if (DEBUG) kbd.println(sKey + " clicked");
                        if (kbd.cpu) kbd.cpu.setFocus();
                        return !kbd.keyPressSimulate(keyCode);
                    };
                }(this, sBinding, Keyboard.aButtonCodes[sBinding]);
                return true;
            } else if (Keyboard.aSoftCodes[sBinding] !== undefined) {
                this.bindings[id] = control;
                var fnDown = function(kbd, sKey, bScan) {
                    return function onMouseOrTouchDownKeyboard(event) {
                        kbd.addScanCode(bScan);
                    };
                }(this, sBinding, Keyboard.aSoftCodes[sBinding]);
                var fnUp = function (kbd, sKey, bScan) {
                    return function onMouseOrTouchUpKeyboard(event) {
                        kbd.addScanCode(bScan);
                    };
                }(this, sBinding, Keyboard.aSoftCodes[sBinding] | 0x80);
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
 * findBinding(bKey, t, fDown)
 *
 * @this {Keyboard}
 * @param {number} bKey
 * @param {string} t is the type of control (eg, "button" or "key")
 * @param {boolean} [fDown] is true if the key is going down, false if up, or undefined if unchanged
 * @return {Object} is the HTML control DOM object (eg, HTMLButtonElement), or undefined if no such control exists
 */
Keyboard.prototype.findBinding = function(bKey, t, fDown)
{
    var e;
    for (var s in Keyboard.aSoftCodes) {
        if (Keyboard.aSoftCodes[s] == bKey) {
            var id = t + '-' + s;
            e = this.bindings[id];
            if (e && fDown !== undefined) {
                this.setSoftKeyState(e, fDown);
            }
            break;
        }
    }
    return e;
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {Keyboard}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {X86CPU} cpu
 * @param {Debugger} dbg
 */
Keyboard.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.chipset = cmp.getComponentByType("ChipSet");
};

/**
 * setModel(nModel)
 *
 * @this {Keyboard}
 * @param {number} nModel
 */
Keyboard.prototype.setModel = function(nModel)
{
};

/**
 * setReady()
 *
 * @this {Keyboard}
 */
Keyboard.prototype.setReady = function()
{
    this.iOS = web.isUserAgent("iOS");
    this.fMobile = (this.iOS || web.isUserAgent("Android"));
    this.messageDebugger("mobile keyboard support: " + (this.fMobile? "true" : "false"));
    /*
     * TODO: Determine how to declare this superclass method in order to avoid a type warning
     */
    return Component.prototype.setReady.call(this);
};

/**
 * resetDevice()
 *
 * @this {Keyboard}
 */
Keyboard.prototype.resetDevice = function()
{
    /*
     * TODO: There's more to reset, like LED indicators, default type rate, and emptying the scan code buffer.
     */
    this.messageDebugger("keyboard reset", Debugger.MESSAGE_PORT);
    this.abScanBuffer = [Keyboard.CMDRES.BAT_SUCC];
    if (this.chipset) this.chipset.setIRR(ChipSet.IRQ.KBD, 4);
};

/**
 * setEnable(fData, fClock)
 *
 * This is the ChipSet's primary interface for toggling keyboard "data" and "clock" lines.
 * For MODEL_5150 and MODEL_5160 machines, this function is called from the ChipSet's PPI_B
 * output handler.  For MODEL_5170 machines, this function is called when selected KBC.CMD
 * "data bytes" have been written.
 *
 * @this {Keyboard}
 * @param {boolean} fData is true if the keyboard simulated data line should be enabled
 * @param {boolean} fClock is true if the keyboard's simulated clock line should be enabled
 * @return {boolean} true if keyboard was re-enabled, false if not (or no change)
 */
Keyboard.prototype.setEnable = function(fData, fClock)
{
    var fReset = false;
    if (this.fClock !== fClock) {
        if (DEBUG) this.messageDebugger("keyboard clock line changing to " + fClock, Debugger.MESSAGE_PORT);
        /*
         * Toggling the clock line low and then high signals a "reset", which we acknowledge once the
         * data line is high as well.
         */
        this.fClock = this.fResetOnEnable = fClock;
    }
    if (this.fData !== fData) {
        if (DEBUG) this.messageDebugger("keyboard data line changing to " + fData, Debugger.MESSAGE_PORT);
        this.fData = fData;
        /*
         * TODO: Review this code; it was added during the early days of MODEL_5150 testing and may not be
         * *exactly* what's called for here.
         */
        if (fData && !this.fResetOnEnable) {
            this.shiftScanCode();
        }
    }
    if (this.fData && this.fResetOnEnable) {
        this.resetDevice();
        this.fResetOnEnable = false;
        fReset = true;
    }
    return fReset;
};

/**
 * sendCmd(bCmd)
 *
 * This is the ChipSet's primary interface for controlling "Model M" keyboards (ie, those used
 * with MODEL_5170 machines).  Commands are delivered through the ChipSet's 8042 Keyboard Controller.
 *
 * @this {Keyboard}
 * @param {number} bCmd should be one of the Keyboard.CMD.* command codes (Model M keyboards only)
 * @return {number} response should be one of the Keyboard.CMDRES.* response codes, or -1 if unrecognized
 */
Keyboard.prototype.sendCmd = function(bCmd)
{
    var b = -1;
    switch(bCmd) {
    case Keyboard.CMD.RESET:
        b = Keyboard.CMDRES.ACK;
        this.resetDevice();
        break;
    default:
        break;
    }
    return b;
};

/**
 * readScanCode(fShift)
 *
 * This is the ChipSet's interface for reading scan codes.
 *
 * @this {Keyboard}
 * @param {boolean} [fShift] is used by the MODEL_5170 8042 Keyboard Controller (supersedes the old setEnable() interface)
 * @return {number} next scan code, or 0 if none
 */
Keyboard.prototype.readScanCode = function(fShift)
{
    var b = 0;
    if (this.abScanBuffer.length) {
        b = this.abScanBuffer[0];
        this.messageDebugger("scan code 0x" + str.toHexByte(b) + " delivered");
        if (fShift) this.shiftScanCode();
    }
    return b;
};

/**
 * shiftScanCode(fFlush)
 *
 * This is the ChipSet's interface to advance (or flush) scan codes.
 *
 * @this {Keyboard}
 * @param {boolean} [fFlush] is true to completely flush the keyboard buffer
 */
Keyboard.prototype.shiftScanCode = function(fFlush)
{
    if (this.abScanBuffer.length > 0) {
        if (fFlush) {
            /*
             * This is now called after receipt of an 8042 self-test command, to ensure we don't
             * overwrite the self-test response byte with left-over scan codes.
             */
            this.abScanBuffer = [];
        } else {
            /*
             * The keyboard interrupt service routine toggles the enable bit after reading a scan code, so
             * presumably this is the proper point at which to shift the last scan code out, and then assert
             * another interrupt if more scan codes exist.
             */
            this.abScanBuffer.shift();
            if (this.abScanBuffer.length > 0) {
                if (this.chipset) this.chipset.setIRR(ChipSet.IRQ.KBD);
            }
        }
    }
};

/**
 * powerUp(data, fRepower)
 *
 * @this {Keyboard}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
Keyboard.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        /*
         * TODO: Save/restore support for Keyboard is the barest minimum.  In fact, originally, I wasn't
         * saving/restoring anything, and that was OK, but if we don't at least re-initialize fClock/fData,
         * we can get a spurious reset following a restore.  In an ideal world, we might choose to save/restore
         * abScanBuffer as well, but realistically, I think it's going to be safer to always start with an
         * empty buffer--and who's going to notice anyway?
         *
         * So, like Debugger, we deviate from the typical save/restore pattern: instead of reset OR restore,
         * we always reset and then perform a (very limited) restore.
         */
        this.reset();
        if (data && this.restore) {
            if (!this.restore(data)) return false;
        }
    }
    return true;
};

/**
 * powerDown(fSave)
 *
 * @this {Keyboard}
 * @param {boolean} fSave
 * @return {Object|boolean}
 */
Keyboard.prototype.powerDown = function(fSave)
{
    return fSave && this.save? this.save() : true;
};

/**
 * reset()
 *
 * @this {Keyboard}
 */
Keyboard.prototype.reset = function()
{
    this.setModel(this.nDefaultModel);

    this.initState();

    /*
     * The physical (not virtual) state of various shift keys.
     *
     * QUESTION: In JavaScript, how do you query initial key states?
     */
    this.bitsShift = 0;

    /*
     * New scan codes are "pushed" onto abScanBuffer and then "shifted" off.
     */
    this.abScanBuffer = [];

    /*
     * When a key "down" is simulated on behalf of some keyCode, I save
     * the timer object responsible for simulating the key "up" here, so that
     * if I detect the actual key going up sooner, I can cancel the timer and
     * simulate the "up" immediately.  Similarly, if another press for the same
     * key arrives before last one expired (eg, auto-repeat), I need to cancel
     * the previous timer for that key before setting another.
     *
     * NOTE: If this is anything other than an initial reset, then we need to
     * make sure there are no outstanding timers before we blow the array away.
     */
    if (this.aKeyTimers) {
        for (var i in this.aKeyTimers) {
            if (str.isValidInt(i)) continue; // ignore any non-numeric properties, if any
            if (this.aKeyTimers[i]) clearTimeout(this.aKeyTimers[i]);
        }
    }
    this.aKeyTimers = [];
    this.prevCharDown = 0;
    this.prevKeyDown = 0;

    /*
     * Make sure the auto-injection buffer is empty, too (an injection could have been
     * in progress on any reset after the first).
     */
    this.sInjectBuffer = "";
};

/**
 * save()
 *
 * This implements save support for the Keyboard component.
 *
 * @this {Keyboard}
 * @return {Object}
 */
Keyboard.prototype.save = function()
{
    var state = new State(this);
    state.set(0, this.saveState());
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the Keyboard component.
 *
 * @this {Keyboard}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
Keyboard.prototype.restore = function(data)
{
    return this.initState(data[0]);
};

/**
 * initState(data)
 *
 * @this {Keyboard}
 * @param {Array} [data]
 * @return {boolean} true if successful, false if failure
 */
Keyboard.prototype.initState = function(data)
{
    var i = 0;
    if (data === undefined) data = [];
    this.fClock = data[i++];
    this.fData = data[i];
    return true;
};

/**
 * saveState()
 *
 * @this {Keyboard}
 * @return {Array}
 */
Keyboard.prototype.saveState = function()
{
    var i = 0;
    var data = [];
    data[i++] = this.fClock;
    data[i] = this.fData;
    return data;
};

/**
 * setSoftKeyState(control, f)
 *
 * @this {Keyboard}
 * @param {Object} control is an HTML control DOM object
 * @param {boolean} f is true if the key represented by e should be "on", false if "off"
 */
Keyboard.prototype.setSoftKeyState = function(control, f)
{
    control.style.color = (f? "#ffffff" : "#000000");
    control.style.backgroundColor = (f? "#000000" : "#ffffff");
};

/**
 * addScanCode(bScan, fRepeat)
 *
 * An actual IBM keyboard will only buffer up to 20 scan codes, so we impose the same limit here.
 *
 * Just as 0xAA is a special scan code response to a software reset, 0xFF is a special scan code response
 * to an internal buffer overrun.  I try to simulate both.
 *
 * @this {Keyboard}
 * @param {number} bScan
 * @param {boolean} [fRepeat]
 */
Keyboard.prototype.addScanCode = function(bScan, fRepeat)
{
    var bKey = bScan & 0x7f;
    var fDown = (bKey == bScan);
    /*
     * Prepare for the possibility that our reset() function may not have been called yet.
     *
     * TODO: Determine whether we need to reset() the Keyboard sooner (ie, in the constructor),
     * or if we need to protect other methods from prematurely accessing certain Keyboard structures,
     * as a result of calls from any of the key event handlers established by setBinding().
     */
    if (this.abScanBuffer) {
        if (this.abScanBuffer.length < 20) {
            if (!fDown && !this.aScanCodesActive[bKey] || fDown && this.aScanCodesActive[bKey] && !fRepeat) {
                if (MAXDEBUG) this.messageDebugger("scan code 0x" + str.toHexByte(bScan) + " redundant");
                return;
            }
            this.aScanCodesActive[bKey] = fDown;
            this.messageDebugger("scan code 0x" + str.toHexByte(bScan) + " buffered");
            this.abScanBuffer.push(bScan);
            if (this.abScanBuffer.length == 1) {
                if (this.chipset) this.chipset.setIRR(ChipSet.IRQ.KBD);
            }
            this.findBinding(bKey, "key", fDown);
            return;
        }
        if (this.abScanBuffer.length == 20) {
            this.abScanBuffer.push(0xFF);
        }
        this.messageDebugger("scan code buffer overflow");
    }
};

/**
 * calcReleaseDelay(fRepeat)
 *
 * Attempts to scale our default "release" delay appropriately for the current CPU speed.
 *
 * Note that if the effective CPU speed exceeds 16Mhz, it becomes very difficult to rely on timer-driven key events
 * (even the shortest available timer delay still gives the CPU too much time, so it thinks that even the briefest key
 * press represents a held key, resulting in multiple keystrokes).
 *
 * @this {Keyboard}
 * @param {boolean} fRepeat is true if a timeout had already been active for the current key
 * @return {number}
 */
Keyboard.prototype.calcReleaseDelay = function(fRepeat)
{
    /*
     * NOTE: This delay affects only the "up" delay, not repeat delay, but it's useful to have an initial
     * "up" delay that's sufficiently large to ensure the native machine's auto-repeat behavior cooperates
     * with the virtual machine's auto-repeat behavior. msReleaseDelay is the initial delay, msReleaseRepeat
     * is the subsequent delay.
     *
     * Unfortunately, with a large initial delay, we need to enable the auto-clear code in the keyEvent()
     * handler, otherwise doing things like pressing ENTER repeatedly will result in sluggish behavior
     * (because you can generally press/release/repress keys faster than they will auto-repeat).
     */
    var msDelay = (fRepeat? this.msReleaseRepeat : this.msReleaseDelay);
    if (this.cpu && this.cpu.aCounts.mhz) msDelay /= this.cpu.aCounts.mhz;
    return msDelay;
};

/**
 * autoClear(notKeyCode)
 *
 * @this {Keyboard}
 * @param {number} [notKeyCode]
 */
Keyboard.prototype.autoClear = function(notKeyCode)
{
    if (this.prevCharDown && (notKeyCode === undefined || notKeyCode != this.prevCharDown)) {
        if (DEBUG) this.messageDebugger("autoClear(" + this.prevCharDown + ")");
        Component.assert(this.aKeyTimers[this.prevCharDown]);
        clearTimeout(this.aKeyTimers[this.prevCharDown]);
        this.keyEventSimulate(this.prevCharDown, false, Keyboard.SIMCODE.AUTOCLEAR);
    }
};

/**
 * injectKeys(sKeyCodes, msDelay)
 *
 * @this {Keyboard}
 * @param {string} sKeyCodes
 * @param {number|undefined} [msDelay] is an optional injection delay (default is msInjectDelay)
 */
Keyboard.prototype.injectKeys = function(sKeyCodes, msDelay)
{
    this.sInjectBuffer = sKeyCodes;
    if (DEBUG) this.log("injectKeys(" + this.sInjectBuffer.split("\n").join("\\n") + ")");
    this.injectKeysFromBuffer(msDelay || this.msInjectDelay);
};

/**
 * injectKeysFromBuffer(msDelay)
 *
 * @this {Keyboard}
 * @param {number} msDelay is the delay between injected keys
 */
Keyboard.prototype.injectKeysFromBuffer = function(msDelay)
{
    if (this.sInjectBuffer.length > 0) {
        var ch = this.sInjectBuffer.charCodeAt(0);
        /*
         * I could require all callers to supply CRs instead of LFs, but this is friendlier.
         */
        if (ch == 0x0a) ch = 0x0d;

        this.sInjectBuffer = this.sInjectBuffer.substr(1);
        this.keyPressSimulate(ch);
    }
    if (this.sInjectBuffer.length > 0) {
        setTimeout(function (kbd) {
            return function onInjectKeyTimeout() {
                kbd.injectKeysFromBuffer(msDelay);
            };
        }(this), msDelay);
    }
};

/**
 * keyEvent(event, fDown)
 *
 * @this {Keyboard}
 * @param {Object} event
 * @param {boolean} fDown is true for a keyDown event, false for a keyUp event
 * @return {boolean} true to pass the event along, false to consume it
 */
Keyboard.prototype.keyEvent = function(event, fDown)
{
    var fPass;
    var fAutoClear = !fDown;
    var keyCode = event.keyCode;

    var keyCodeSim = keyCode;

    if (fDown) this.prevKeyDown = keyCode;

    var wCode = Keyboard.aKeyCodes[keyCode + Keyboard.KEYCODE.ONDOWN];
    if (wCode) {
        keyCodeSim += Keyboard.KEYCODE.ONDOWN;
        var bShift = Keyboard.STATEKEYS[keyCode] || 0;
        if (bShift) {
            if (event.location == Keyboard.LOCATION.RIGHT) {
                bShift >>= 1;
                keyCodeSim += Keyboard.KEYCODE.ONRIGHT;
            }
            this.bitsShift &= ~bShift;
            if (fDown) this.bitsShift |= bShift;
            if (keyCode == Keyboard.KEYCODE.CAPSLOCK) {
                /*
                 * FYI, CAPSLOCK generates a "down" event ONLY when getting locked, and an "up" event ONLY
                 * when getting unlocked--which is exactly what I want, even though that may seem a little
                 * counter-intuitive (since the key itself actually went down AND up for each event).
                 */
                fPass = this.keyPressSimulate(keyCodeSim);
            } else {
                fAutoClear = false;
            }
        } else {
            if (keyCode == Keyboard.KEYCODE.TAB || keyCode == Keyboard.KEYCODE.ESC || keyCode == Keyboard.KEYCODE.BS) {
                /*
                 * HACK for simulating Ctrl-Break using Ctrl-Del (Mac) / Ctrl-Backspace (Windows)
                 */
                if (keyCode == Keyboard.KEYCODE.BS && (this.bitsShift & (Keyboard.STATE.CTRL|Keyboard.STATE.ALT)) == Keyboard.STATE.CTRL) {
                    keyCodeSim = Keyboard.KEYCODE.FAKE_CTRLBREAK;
                }
                /*
                 * If I don't consume TAB on the "down" event, then that's all I'll see, because the
                 * browser will see it and give focus to the next control. But the "down" side is that
                 * that no "press" event will be generated.  This puts it in the same category as ESC,
                 * which also generates "down" and "up" events (LOTS of "down" events for that matter),
                 * but no "press" event.  The C1P has no TAB key, so it's safe to completely ignore,
                 * hence the code below, but a PC does, so I need to simulate it.
                 *
                 *      fPass = fAutoClear = false;
                 *
                 * I don't get keyPress events for ESC (why?) and I never want the browser to act on DELETE
                 * (which does double-duty as the "Back" button and leaves the current page), so I have to
                 * simulate them now.
                 *
                 * Note that I call the "press" simulate method and NOT the "event" simulate method, because
                 * the former takes care of simulating both individual "down" and "up" events.
                 */
                fPass = (fDown? !this.keyPressSimulate(keyCodeSim) : false);
            }
        }
    }
    else {
        if (keyCode == Keyboard.KEYCODE.COMMAND) {
            /*
             * Avoid interfering with useful Browser key commands, like COMMAND-Q, COMMAND-T, etc.
             */
            this.bitsShift &= ~Keyboard.STATE.COMMAND;
            if (fDown) this.bitsShift |= Keyboard.STATE.COMMAND;
            fAutoClear = false;
            fPass = true;
        }
        /*
         * All other ALT and/or CTRL-key combinations are handled here (in part because not all
         * generate keyPress events, and even those that do may generate odd keyCodes that I'd rather
         * not create mappings for).
         */
        else if (event.altKey || event.ctrlKey) {
            if (keyCode >= 0x41 && keyCode <= 0x5A) {
                /*
                 * Convert "upper-case" letter combinations into "lower-case" combinations, so
                 * that keyEventSimulate() doesn't think it also needs to simulate a SHIFT key, too.
                 */
                keyCodeSim += 0x20;
            }
            // if (DEBUG) this.messageDebugger("ALT event: keyCode " + keyCode);
        }
        else {
            /*
             * Pass on anything else, and we'll take care of it at the keyPress stage (if at all) rather
             * than the keyDown/keyUp stage.
             */
            fPass = true;

            /*
             * At this point, I have a difficult choice to make: leave fAutoClear true for any remaining
             * "up" events, so that keys will repeat immediately when released/pressed repeatedly (most
             * noticeable with the Enter key), or set fAutoClear to false to ensure that polling apps have
             * enough time to see every key press.
             *
             * I've decided that the former is more important than the latter, so if polling apps are still
             * missing keystrokes, then perhaps nCyclesThreshold needs to be supplemented in some way.
             *
             *      fAutoClear = false;
             */
        }
    }

    if (fAutoClear) {
        /*
         * When you use a command like COMMAND-T, I see the COMMAND key going down, but not going up,
         * so I think the COMMAND key is still down and ignore all input; to easily get out of that state,
         * I clear our internal BIT_COMMAND whenever I see ANY key go up (well, ALMOST any key; cases
         * above that explicitly clear fAutoClear -- such as the COMMAND key itself -- are exceptions
         * to the rule).
         */
        this.bitsShift &= ~Keyboard.STATE.COMMAND;
        /*
         * I don't reliably get keyDown/keyUp events for all keys on all devices, but for those devices that
         * I DO, it seems like a good idea to cancel any pending key "up" simulation on receipt of the actual
         * keyUp event.
         *
         * However, the following code is problematic for Safari on iOS devices, which as noted above, doesn't
         * generate keyDown/keyUp events until after the press operation is complete, and then they are generated
         * in rapid succession, which doesn't give the C1P enough time to detect the key.  So I simply don't do
         * this on iOS devices.
         */
        if (!this.fMobile && keyCode == this.prevKeyDown) this.autoClear();
    }

    if (fPass === undefined) {
        fPass = !this.keyEventSimulate(keyCodeSim, fDown, Keyboard.SIMCODE.KEYEVENT);
    }

    if (DEBUG) this.messageDebugger(/*(fDown?"\n":"") +*/ "key" + (fDown? "Down" : "Up") + "(" + keyCode + "): " + (fPass? "pass" : "consume"), Debugger.MESSAGE_KEYS);
    return fPass;
};

/**
 * keyPress(event)
 *
 * We've stopped relying on keyPress for keyboard emulation purposes, but it's still handy to hook and monitor
 * when debugging.
 *
 * @this {Keyboard}
 * @param {Object} event
 * @return {boolean} true to pass the event along, false to consume it
 */
Keyboard.prototype.keyPress = function(event)
{
    var fPass = true;
    event = event || window.event;
    var keyCode = event.which || event.keyCode;

    /*
     * Let's stop any injection currently in progress, too
     */
    this.sInjectBuffer = "";

    if (keyCode == Keyboard.KEYCODE.BS || keyCode == Keyboard.KEYCODE.TAB) {
        /*
         * Unlike Safari and Chrome, Firefox doesn't seem to honor our "consume" request for the "down" DELETE keyEvent,
         * so we must ALSO check for the DELETE key here, and again "consume" it.  Ditto for TAB.
         *
         * In fact, this is just one example of a larger Firefox problem (see https://bugzilla.mozilla.org/show_bug.cgi?id=501496).
         * Basically, Firefox is not honoring our consumption of keyDown events, and generates keyPress events anyway.
         * This causes us grief for various CTRL and ALT combinations, resulting in duplicate key presses.
         * So, I'm going to try to fix this below, by setting fPass to true if either of those modifier keys is currently down;
         * if they're not, then we'll continue with the original code that sets fPass based on the return value from keyPressSimulate().
         */
        fPass = false;
    } else {
        if (this.bitsShift & Keyboard.STATE.COMMAND)
            this.bitsShift &= ~Keyboard.STATE.COMMAND;
        else {
            // if (DEBUG && event.altKey) this.messageDebugger("ALT press: keyCode " + keyCode, Debugger.MESSAGE_KEYS);
            if (this.bitsShift & (Keyboard.STATE.CTRL | Keyboard.STATE.ALT))
                fPass = false;
            else
                fPass = !this.keyPressSimulate(keyCode);
        }
    }

    if (DEBUG) this.messageDebugger("keyPress(" + keyCode + "): " + (fPass? "pass" : "consume"), Debugger.MESSAGE_KEYS);
    return fPass;
};

/**
 * keyPressSimulate(keyCode)
 *
 * @this {Keyboard}
 * @param {number} keyCode
 * @param {boolean} [fQuickRelease] is true to simulate the press and release immediately
 * @return {boolean} true if successfully simulated, false if unrecognized/unsupported key
 */
Keyboard.prototype.keyPressSimulate = function(keyCode, fQuickRelease)
{
    var fSimulated = false;

    /*
     * Auto-clear any previous down key EXCEPT for keyCode (because it may be held and repeating).
     */
    this.autoClear(keyCode);

    if (this.keyEventSimulate(keyCode, true, Keyboard.SIMCODE.KEYPRESS)) {
        /*
         * If fQuickRelease is set, we switch to an alternate approach, which is to immediately queue a
         * "release" event as well.  I used to also do this at high speeds, because the CPU could get lucky
         * and execute a LOT of instructions between delivery of the keyPress event and the "keyTimeout"
         * event, and since JavaScript events (including timeouts) are delivered synchronously, it might
         * take too long for the "keyTimeout" event to arrive.
         *
         * Why don't we ALWAYS do this?  Because at normal CPU speeds, we want to faithfully simulate how
         * long a key is held, so that features like auto-repeat work properly.
         *
         * TODO: The above is probably more true for C1Pjs (where some of this code came from) than PCjs,
         * so revisit these assumptions.  The fact that I had to add the fQuickRelease parameter suggests
         * that it's time to review/overhaul this code.
         */
        if (fQuickRelease /* || this.cpu.speed == CPU.SPEED_MAX */) {
            this.keyEventSimulate(keyCode, false, Keyboard.SIMCODE.KEYRELEASE);
        }
        else {
            var fRepeat = false;
            if (this.aKeyTimers[keyCode]) {
                clearTimeout(this.aKeyTimers[keyCode]);
                fRepeat = true;
            }
            var msDelay = this.calcReleaseDelay(fRepeat);
            this.aKeyTimers[this.prevCharDown = keyCode] = setTimeout(function (kbd) {
                return function onKeyPressSimulateTimeout() {
                    kbd.keyEventSimulate(keyCode, false, Keyboard.SIMCODE.KEYTIMEOUT);
                };
            }(this), msDelay);
            if (DEBUG) this.messageDebugger("keyPressSimulate(" + keyCode + "): setTimeout()");
        }
        fSimulated = true;
    }
    if (DEBUG) this.messageDebugger("keyPressSimulate(" + keyCode + "): " + (fSimulated? "true" : "false"));
    return fSimulated;
};

/**
 * keyEventSimulate(keyCode, fDown, simCode)
 *
 * @this {Keyboard}
 * @param {number} keyCode
 * @param {boolean} fDown
 * @param {number} simCode indicates the origin of the event
 * @return {boolean} true if successfully simulated, false if unrecognized/unsupported key
 */
Keyboard.prototype.keyEventSimulate = function(keyCode, fDown, simCode)
{
    var fSimulated = false;

    if (!fDown) {
        this.aKeyTimers[keyCode] = null;
        if (this.prevCharDown == keyCode) this.prevCharDown = 0;
    }

    var wCode = Keyboard.aKeyCodes[keyCode] || Keyboard.aKeyCodes[keyCode + Keyboard.KEYCODE.ONDOWN];
    if (wCode === undefined) {
        /*
         * Perhaps we're dealing with a CTRL variation of an alphabetic key; this won't
         * affect non-CTRL-key combos like CR or LF, because they're defined in aKeyCodes,
         * and this bit of code relieves us from having to explicitly define every CTRL-letter
         * possibility in aKeyCodes.
         *
         * TODO: Support for CTRL-anything-else (as well as ALT-anything-else) is still TBD.
         */
        if (keyCode >= 0x01 && keyCode <= 0x1A) {
            keyCode += 0x40;
            wCode = (Keyboard.aKeyCodes[keyCode] & 0xff) | (Keyboard.STATE.CTRL << 8);
        }
    }

    if (wCode !== undefined) {
        /*
         * Hack to transform the IBM "BACKSPACE" key (which we normally map to KEYCODE_DELETE) to the IBM "DEL" key
         * whenever both CTRL and ALT are pressed as well, so that it's easier to simulate that old favorite: CTRL-ALT-DEL
         */
        if (wCode == 0x0E) {
            if ((this.bitsShift & (Keyboard.STATE.CTRL | Keyboard.STATE.ALT)) == (Keyboard.STATE.CTRL | Keyboard.STATE.ALT)) {
                wCode = 0x53;
            }
        }

        var abScanCodes = [];
        abScanCodes.push((wCode & 0xff) | (fDown? 0 : 0x80));

        while (wCode >>= 8) {
            var bScan = 0;
            var bShift = wCode & 0xff;
            if (bShift == Keyboard.STATE.SHIFT) {
                /*
                 * TODO: The fact that CAPSLOCK is currently set affects only letters....
                 */
                if (!(this.bitsShift & (Keyboard.STATE.SHIFT | Keyboard.STATE.RSHIFT | Keyboard.STATE.CAPSLOCK))) {
                    bScan = 0x2A;
                }
            } else if (bShift == Keyboard.STATE.CTRL) {
                if (!(this.bitsShift & (Keyboard.STATE.CTRL | Keyboard.STATE.RCTRL))) {
                    bScan = 0x1D;
                }
            } else if (bShift == Keyboard.STATE.ALT) {
                if (!(this.bitsShift & (Keyboard.STATE.ALT | Keyboard.STATE.RALT))) {
                    bScan = 0x38;
                }
            }
            if (bScan) {
                if (fDown)
                    abScanCodes.unshift(bScan);
                else
                    abScanCodes.push(bScan | 0x80);
            }
        }

        for (var i = 0; i < abScanCodes.length; i++) {
            this.addScanCode(abScanCodes[i]);
        }

        fSimulated = true;
    }
    if (DEBUG && DEBUGGER) this.messageDebugger("keyEventSimulate(" + keyCode + "," + (fDown? "down" : "up") + "," + Keyboard.aSimCodeDescs[simCode] + "): " + (fSimulated? "true" : "false"));
    return fSimulated;
};

/**
 * messageDebugger(sMessage, bitsMessage)
 *
 * This is a combination of the Debugger's messageEnabled(MESSAGE_KBD) and message() functions, for convenience.
 *
 * @this {Keyboard}
 * @param {string} sMessage is any caller-defined message string
 * @param {number} [bitsMessage] is one or more Debugger MESSAGE_* category flag(s)
 */
Keyboard.prototype.messageDebugger = function(sMessage, bitsMessage)
{
    if (DEBUGGER && this.dbg) {
        if (bitsMessage == null) bitsMessage = Debugger.MESSAGE_KBD;
        if (bitsMessage == Debugger.MESSAGE_PORT) bitsMessage |= Debugger.MESSAGE_KBD;
        if (this.dbg.messageEnabled(bitsMessage)) this.dbg.message(sMessage);
    }
};

/**
 * Keyboard.init()
 *
 * This function operates on every element (e) of class "keyboard", and initializes
 * all the necessary HTML to construct the Keyboard module(s) as spec'ed.
 *
 * Note that each element (e) of class "keyboard" is expected to have a "data-value"
 * attribute containing the same JSON-encoded parameters that the Keyboard constructor
 * expects.
 */
Keyboard.init = function()
{
    var aeKbd = Component.getElementsByClass(window.document, PCJSCLASS, "keyboard");
    for (var iKbd = 0; iKbd < aeKbd.length; iKbd++) {
        var eKbd = aeKbd[iKbd];
        var parmsKbd = Component.getComponentParms(eKbd);
        var kbd = new Keyboard(parmsKbd);
        Component.bindComponentControls(kbd, eKbd, PCJSCLASS);
    }
};

/*
 * Initialize every Keyboard module on the page.
 */
web.onInit(Keyboard.init);

if (typeof APP_PCJS !== 'undefined') APP_PCJS.Keyboard = Keyboard;

if (typeof module !== 'undefined') module.exports = Keyboard;
