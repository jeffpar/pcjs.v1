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
function Keyboard(parmsKbd)
{
    Component.call(this, "Keyboard", parmsKbd, Keyboard, Debugger.MESSAGE.KBD);

    this.nDefaultModel = parmsKbd['model'];
    this.fEscapeDisabled = false;

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

    this.aKeyTimers = [];

    this.setReady();
}

Component.subclass(Component, Keyboard);

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
    CTRLA: 1, CTRLZ: 26,
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
 * Browser keyCodes we must pay particular attention to.  For the most part, these are
 * non-alphanumeric or function keys, some which may require special treatment (eg,
 * preventDefault() if returning false on the initial keyDown event is insufficient).
 *
 * keyCodes for most common ASCII keys can simply use the appropriate ASCII code above.
 *
 * Most of these represent non-ASCII keys (eg, the LEFT arrow key), yet for some reason,
 * browsers defined them using ASCII codes (eg, the LEFT arrow key uses the ASCII code
 * for '%' or 37).  This conflict is discussed further in the definition of aButtonCodes below.
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
    /* 0x14 */  CAPS_LOCK:  20,
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
    /* 0x90 */  NUM_LOCK:   144,
    /* 0x91 */  SCROLL_LOCK:145,
    //
    // ONDOWN is a bias we add to browser keyCodes that we want to handle on "down" rather than "press".
    //
    // Note that these biases use what I'll call "Decimal Coded Binary" or DCB (the reverse of BCD),
    // where decimal digits are used to represent binary bit values, which can be added together without
    // affecting neighboring digits as long as you stick to 1, 2 or 4 in any given column.
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
    FAKE:                   4000,
    FAKE_CTRLC:             4003,
    FAKE_CTRLBREAK:         4063,
    FAKE_CTRLALTDEL:        4081
};

/**
 * The set of values that a browser may store in the 'location' property of a keyboard event object
 * which we also support.
 *
 * @enum {number}
 */
Keyboard.LOCATION = {
    LEFT:   1,
    RIGHT:  2,
    NUMPAD: 3
};

/**
 * These internal "shift key" states are used to indicate the current simulated shift/modifier key states
 * in shiftStates; note that right-hand shift bits match the corresponding left-hand bit shifted 1 bit right.
 *
 * @enum {number}
 */
Keyboard.STATES = {
    RSHIFT:         0x0001,
    SHIFT:          0x0002,
    RCTRL:          0x0004,         // 101-key keyboard only
    CTRL:           0x0008,
    RALT:           0x0010,         // 101-key keyboard only
    ALT:            0x0020,
    COMMAND:        0x0040,         // 101-key keyboard only (TODO: Treat this like the 'Windows' key)
    INSERT:         0x0080,         // TODO: Placeholder
    CAPS_LOCK:      0x0100,
    NUM_LOCK:       0x0200,
    SCROLL_LOCK:    0x0400,
    LOCK:           0x0700,         // STATES.CAPS_LOCK | STATES.NUM_LOCK | STATES.SCROLL_LOCK
    SIMULATE:       0x003f          // STATES.RSHIFT | STATES.SHIFT | STATES.RCTRL | STATES.CTRL | STATES.RALT | STATES.ALT
};

/**
 * Maps KEYCODES of shift/modifier keys to their corresponding (default) STATES bit above
 *
 * @enum {number}
 */
Keyboard.KEYSTATES = {};
Keyboard.KEYSTATES[Keyboard.KEYCODE.SHIFT]      = Keyboard.STATES.SHIFT;
Keyboard.KEYSTATES[Keyboard.KEYCODE.CTRL]       = Keyboard.STATES.CTRL;
Keyboard.KEYSTATES[Keyboard.KEYCODE.ALT]        = Keyboard.STATES.ALT;
Keyboard.KEYSTATES[Keyboard.KEYCODE.CAPS_LOCK]  = Keyboard.STATES.CAPS_LOCK;
Keyboard.KEYSTATES[Keyboard.KEYCODE.NUM_LOCK]   = Keyboard.STATES.NUM_LOCK;
Keyboard.KEYSTATES[Keyboard.KEYCODE.SCROLL_LOCK]= Keyboard.STATES.SCROLL_LOCK;

/**
 * Maps "soft-key" definitions of shift/modifier keys to their corresponding (default) STATES bit above
 *
 * @enum {number}
 */
Keyboard.LEDSTATES = {
    'caps-lock':    Keyboard.STATES.CAPS_LOCK,
    'num-lock':     Keyboard.STATES.NUM_LOCK,
    'scroll-lock':  Keyboard.STATES.SCROLL_LOCK
};

/**
 * In a perfect world, each one of our "button" codes would map to a unique browser keyCode.
 *
 * However, because most of these codes are for non-ASCII keys, which browsers brilliantly
 * map to ASCII keyCodes that conflict with *actual* ASCII keys, we must add an ONDOWN bias
 * to all these particular keyCodes, and make sure we store these keyCodes in our aKeyCodes
 * lookup table with the same bias.
 *
 * The good news is that ONDOWN also serves as a signal to our keyCode handlers that the key
 * in question should be handled during keyDown (not keyPress), since most if not all of these
 * non-alphanumeric keys don't generate a keyPress event anyway.
 *
 * @enum {number}
 */
Keyboard.aButtonCodes = {
    'tab':          Keyboard.KEYCODE.TAB        + Keyboard.KEYCODE.ONDOWN,
    'esc':          Keyboard.KEYCODE.ESC        + Keyboard.KEYCODE.ONDOWN,
    'caps-lock':    Keyboard.KEYCODE.CAPS_LOCK  + Keyboard.KEYCODE.ONDOWN,
    'f1':           Keyboard.KEYCODE.F1         + Keyboard.KEYCODE.ONDOWN,
    'f2':           Keyboard.KEYCODE.F2         + Keyboard.KEYCODE.ONDOWN,
    'f3':           Keyboard.KEYCODE.F3         + Keyboard.KEYCODE.ONDOWN,
    'f4':           Keyboard.KEYCODE.F4         + Keyboard.KEYCODE.ONDOWN,
    'f5':           Keyboard.KEYCODE.F5         + Keyboard.KEYCODE.ONDOWN,
    'f6':           Keyboard.KEYCODE.F6         + Keyboard.KEYCODE.ONDOWN,
    'f7':           Keyboard.KEYCODE.F7         + Keyboard.KEYCODE.ONDOWN,
    'f8':           Keyboard.KEYCODE.F8         + Keyboard.KEYCODE.ONDOWN,
    'f9':           Keyboard.KEYCODE.F9         + Keyboard.KEYCODE.ONDOWN,
    'f10':          Keyboard.KEYCODE.F10        + Keyboard.KEYCODE.ONDOWN,
    'left':         Keyboard.KEYCODE.LEFT       + Keyboard.KEYCODE.ONDOWN,   // formerly "left-arrow"
    'up':           Keyboard.KEYCODE.UP         + Keyboard.KEYCODE.ONDOWN,   // formerly "up-arrow"
    'right':        Keyboard.KEYCODE.RIGHT      + Keyboard.KEYCODE.ONDOWN,   // formerly "right-arrow"
    'down':         Keyboard.KEYCODE.DOWN       + Keyboard.KEYCODE.ONDOWN,   // formerly "down-arrow"
    /*
     * These bindings are for convenience (common key combinations that can be bound to a single control)
     */
    'ctrl-c':       Keyboard.KEYCODE.FAKE_CTRLC,
    'ctrl-break':   Keyboard.KEYCODE.FAKE_CTRLBREAK,
    'ctrl-alt-del': Keyboard.KEYCODE.FAKE_CTRLALTDEL
};

/*
 * Scan code constants
 */
Keyboard.SCANCODE = {
    ESC:         0x01,
    ONE:         0x02,
    TWO:         0x03,
    THREE:       0x04,
    FOUR:        0x05,
    FIVE:        0x06,
    SIX:         0x07,
    SEVEN:       0x08,
    EIGHT:       0x09,
    NINE:        0x0a,
    ZERO:        0x0b,
    DASH:        0x0c,
    EQUALS:      0x0d,
    BS:          0x0e,
    TAB:         0x0f,
    Q:           0x10,
    W:           0x11,
    E:           0x12,
    R:           0x13,
    T:           0x14,
    Y:           0x15,
    U:           0x16,
    I:           0x17,
    O:           0x18,
    P:           0x19,
    LBRACK:      0x1a,
    RBRACK:      0x1b,
    ENTER:       0x1c,
    CTRL:        0x1d,
    A:           0x1e,
    S:           0x1f,
    D:           0x20,
    F:           0x21,
    G:           0x22,
    H:           0x23,
    J:           0x24,
    K:           0x25,
    L:           0x26,
    SEMI:        0x27,
    QUOTE:       0x28,
    BQUOTE:      0x29,
    SHIFT:       0x2a,
    BSLASH:      0x2b,
    Z:           0x2c,
    X:           0x2d,
    C:           0x2e,
    V:           0x2f,
    B:           0x30,
    N:           0x31,
    M:           0x32,
    COMMA:       0x33,
    PERIOD:      0x34,
    SLASH:       0x35,
    RSHIFT:      0x36,
    PRTSC:       0x37,           // unshifted '*'; becomes dedicated 'Print Screen' key on 101-key keyboards
    ALT:         0x38,
    SPACE:       0x39,
    CAPS_LOCK:   0x3a,
    F1:          0x3b,
    F2:          0x3c,
    F3:          0x3d,
    F4:          0x3e,
    F5:          0x3f,
    F6:          0x40,
    F7:          0x41,
    F8:          0x42,
    F9:          0x43,
    F10:         0x44,
    NUM_LOCK:    0x45,
    SCROLL_LOCK: 0x46,
    NUM_HOME:    0x47,
    NUM_UP:      0x48,
    NUM_PGUP:    0x49,
    NUM_SUB:     0x4a,
    NUM_LEFT:    0x4b,
    NUM_CENTER:  0x4c,
    NUM_RIGHT:   0x4d,
    NUM_ADD:     0x4e,
    NUM_END:     0x4f,
    NUM_DOWN:    0x50,
    NUM_PGDN:    0x51,
    NUM_INS:     0x52,
    NUM_DEL:     0x53,
    SYSREQ:      0x54,           // 84-key keyboard only (simulated with 'alt'+'prtsc' on 101-key keyboards)
    PAUSE:       0x54,           // 101-key keyboard only
    F11:         0x57,
    F12:         0x58,
    WIN:         0x5b,
    RWIN:        0x5c,
    MENU:        0x5d,
    MAKE:        0x7f,
    BREAK:       0x80,
    EXTEND1:     0xe0,
    EXTEND2:     0xe1
};

/**
 * Define identifiers for all possible keys, based on their primary (unshifted) character or function.
 * This also serves as a definition of all supported scan codes, making it possible to create full-featured
 * "soft keyboards".
 *
 * One exception to the (unshifted) rule above is 'prtsc': on the original IBM 83-key and 84-key keyboards,
 * its primary (unshifted) character was '*', but on 101-key keyboards, it became a separate key ('prtsc',
 * now labeled "Print Screen"), as did the num-pad '*' ('num-mul'), so 'prtsc' seems worthy of an exception
 * to the rule.
 *
 * On 83-key and 84-key keyboards, 'ctrl'+'num-lock' triggered a "pause" operation and 'ctrl'+'scroll-lock'
 * triggered a "break" operation.
 *
 * On 101-key keyboards, IBM decided to move both those special operations to a new 'pause' ("Pause/Break")
 * key, near the new dedicated 'prtsc' ("Print Screen/SysRq") key -- and to drop the "e" from "SysReq".
 * Those keys behave as follows:
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
 *      TODO: Implement the above behaviors.
 *
 * All key identifiers must be quotable using single-quotes, because that's how components.xsl will encode them
 * *inside* the "data-value" attribute of the corresponding HTML control.  Which, in turn, is why the single-quote
 * key is defined as 'quote' rather than "'".  Similarly, if there was unshifted "double-quote" key, it could
 * not be called '"', because components.xsl quotes the *entire* "data-value" attribute using double-quotes.
 *
 * In the (informal) numbering of keys below, two keys are deliberately numbered 84, reflecting the fact that
 * the 'sysreq' key was added to the 84-key keyboard but then dropped from the 101-key keyboard as a stand-alone key.
 *
 * @enum {number}
 */
Keyboard.aSoftCodes = {
    /*  1 */    'esc':          Keyboard.SCANCODE.ESC,
    /*  2 */    '1':            Keyboard.SCANCODE.ONE,
    /*  3 */    '2':            Keyboard.SCANCODE.TWO,
    /*  4 */    '3':            Keyboard.SCANCODE.THREE,
    /*  5 */    '4':            Keyboard.SCANCODE.FOUR,
    /*  6 */    '5':            Keyboard.SCANCODE.FIVE,
    /*  7 */    '6':            Keyboard.SCANCODE.SIX,
    /*  8 */    '7':            Keyboard.SCANCODE.SEVEN,
    /*  9 */    '8':            Keyboard.SCANCODE.EIGHT,
    /* 10 */    '9':            Keyboard.SCANCODE.NINE,
    /* 11 */    '0':            Keyboard.SCANCODE.ZERO,
    /* 12 */    '-':            Keyboard.SCANCODE.DASH,
    /* 13 */    '=':            Keyboard.SCANCODE.EQUALS,
    /* 14 */    'bs':           Keyboard.SCANCODE.BS,
    /* 15 */    'tab':          Keyboard.SCANCODE.TAB,
    /* 16 */    'q':            Keyboard.SCANCODE.Q,
    /* 17 */    'w':            Keyboard.SCANCODE.W,
    /* 18 */    'e':            Keyboard.SCANCODE.E,
    /* 19 */    'r':            Keyboard.SCANCODE.R,
    /* 20 */    't':            Keyboard.SCANCODE.T,
    /* 21 */    'y':            Keyboard.SCANCODE.Y,
    /* 22 */    'u':            Keyboard.SCANCODE.U,
    /* 23 */    'i':            Keyboard.SCANCODE.I,
    /* 24 */    'o':            Keyboard.SCANCODE.O,
    /* 25 */    'p':            Keyboard.SCANCODE.P,
    /* 26 */    '[':            Keyboard.SCANCODE.LBRACK,
    /* 27 */    ']':            Keyboard.SCANCODE.RBRACK,
    /* 28 */    'enter':        Keyboard.SCANCODE.ENTER,
    /* 29 */    'ctrl':         Keyboard.SCANCODE.CTRL,
    /* 30 */    'a':            Keyboard.SCANCODE.A,
    /* 31 */    's':            Keyboard.SCANCODE.S,
    /* 32 */    'd':            Keyboard.SCANCODE.D,
    /* 33 */    'f':            Keyboard.SCANCODE.F,
    /* 34 */    'g':            Keyboard.SCANCODE.G,
    /* 35 */    'h':            Keyboard.SCANCODE.H,
    /* 36 */    'j':            Keyboard.SCANCODE.J,
    /* 37 */    'k':            Keyboard.SCANCODE.K,
    /* 38 */    'l':            Keyboard.SCANCODE.L,
    /* 39 */    ';':            Keyboard.SCANCODE.SEMI,
    /* 40 */    'quote':        Keyboard.SCANCODE.QUOTE,        // formerly "squote"
    /* 41 */    '`':            Keyboard.SCANCODE.BQUOTE,       // formerly "bquote"
    /* 42 */    'shift':        Keyboard.SCANCODE.SHIFT,        // formerly "lshift"
    /* 43 */    '\\':           Keyboard.SCANCODE.BSLASH,       // formerly "bslash"
    /* 44 */    'z':            Keyboard.SCANCODE.Z,
    /* 45 */    'x':            Keyboard.SCANCODE.X,
    /* 46 */    'c':            Keyboard.SCANCODE.C,
    /* 47 */    'v':            Keyboard.SCANCODE.V,
    /* 48 */    'b':            Keyboard.SCANCODE.B,
    /* 49 */    'n':            Keyboard.SCANCODE.N,
    /* 50 */    'm':            Keyboard.SCANCODE.M,
    /* 51 */    ',':            Keyboard.SCANCODE.COMMA,
    /* 52 */    '.':            Keyboard.SCANCODE.PERIOD,
    /* 53 */    '/':            Keyboard.SCANCODE.SLASH,
    /* 54 */    'right-shift':  Keyboard.SCANCODE.RSHIFT,       // formerly "rshift"
    /* 55 */    'prtsc':        Keyboard.SCANCODE.PRTSC,        // unshifted '*'; becomes dedicated 'Print Screen' key on 101-key keyboards
    /* 56 */    'alt':          Keyboard.SCANCODE.ALT,
    /* 57 */    'space':        Keyboard.SCANCODE.SPACE,
    /* 58 */    'caps-lock':    Keyboard.SCANCODE.CAPS_LOCK,
    /* 59 */    'f1':           Keyboard.SCANCODE.F1,
    /* 60 */    'f2':           Keyboard.SCANCODE.F2,
    /* 61 */    'f3':           Keyboard.SCANCODE.F3,
    /* 62 */    'f4':           Keyboard.SCANCODE.F4,
    /* 63 */    'f5':           Keyboard.SCANCODE.F5,
    /* 64 */    'f6':           Keyboard.SCANCODE.F6,
    /* 65 */    'f7':           Keyboard.SCANCODE.F7,
    /* 66 */    'f8':           Keyboard.SCANCODE.F8,
    /* 67 */    'f9':           Keyboard.SCANCODE.F9,
    /* 68 */    'f10':          Keyboard.SCANCODE.F10,
    /* 69 */    'num-lock':     Keyboard.SCANCODE.NUM_LOCK,
    /* 70 */    'scroll-lock':  Keyboard.SCANCODE.SCROLL_LOCK,  // TODO: 0xe046 on 101-key keyboards?
    /* 71 */    'num-home':     Keyboard.SCANCODE.NUM_HOME,     // formerly "home"
    /* 72 */    'num-up':       Keyboard.SCANCODE.NUM_UP,       // formerly "up-arrow"
    /* 73 */    'num-pgup':     Keyboard.SCANCODE.NUM_PGUP,     // formerly "page-up"
    /* 74 */    'num-sub':      Keyboard.SCANCODE.NUM_SUB,      // formerly "num-minus"
    /* 75 */    'num-left':     Keyboard.SCANCODE.NUM_LEFT,     // formerly "left-arrow"
    /* 76 */    'num-center':   Keyboard.SCANCODE.NUM_CENTER,   // formerly "center"
    /* 77 */    'num-right':    Keyboard.SCANCODE.NUM_RIGHT,    // formerly "right-arrow"
    /* 78 */    'num-add':      Keyboard.SCANCODE.NUM_ADD,      // formerly "num-plus"
    /* 79 */    'num-end':      Keyboard.SCANCODE.NUM_END,      // formerly "end"
    /* 80 */    'num-down':     Keyboard.SCANCODE.NUM_DOWN,     // formerly "down-arrow"
    /* 81 */    'num-pgdn':     Keyboard.SCANCODE.NUM_PGDN,     // formerly "page-down"
    /* 82 */    'num-ins':      Keyboard.SCANCODE.NUM_INS,      // formerly "ins"
    /* 83 */    'num-del':      Keyboard.SCANCODE.NUM_DEL,      // formerly "del"
    /* 84 */    'sysreq':       Keyboard.SCANCODE.SYSREQ,       // 84-key keyboard only (simulated with 'alt'+'prtsc' on 101-key keyboards)
    /* 84 */    'pause':        Keyboard.SCANCODE.PAUSE,        // 101-key keyboard only
    /* 85 */    'f11':          Keyboard.SCANCODE.F11,
    /* 86 */    'f12':          Keyboard.SCANCODE.F12,
    /* 87 */    'num-enter':    Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.ENTER << 8),
    /* 88 */    'right-ctrl':   Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.CTRL << 8),
    /* 89 */    'num-div':      Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.SLASH << 8),
    /* 90 */    'num-mul':      Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.PRTSC << 8),
    /* 91 */    'right-alt':    Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.ALT << 8),
    /* 92 */    'home':         Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.NUM_HOME << 8),
    /* 93 */    'up':           Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.NUM_UP << 8),
    /* 94 */    'pgup':         Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.NUM_PGUP << 8),
    /* 95 */    'left':         Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.NUM_LEFT << 8),
    /* 96 */    'right':        Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.NUM_RIGHT << 8),
    /* 97 */    'end':          Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.NUM_END << 8),
    /* 98 */    'down':         Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.NUM_DOWN << 8),
    /* 99 */    'pgdn':         Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.NUM_PGDN << 8),
   /* 100 */    'ins':          Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.NUM_INS << 8),
   /* 101 */    'del':          Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.NUM_DEL << 8),
                'win':          Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.WIN << 8),
                'right-win':    Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.RWIN << 8),
                'menu':         Keyboard.SCANCODE.EXTEND1 | (Keyboard.SCANCODE.MENU << 8)
};

/**
 * This array is used by keySimulateUpOrDown() to lookup a given keyCode and convert it to a scan code
 * (lower byte) plus any required shift key states (upper bytes).
 *
 * Using keyCodes from keyPress events proved to be more robust than using keyCodes from keyDown and
 * keyUp events, in part because of differences in the way browsers generate the keyDown and keyUp events.
 * For example, Safari on iOS devices will not generate up/down events for shift keys, and for other keys,
 * the up/down events are usually generated after the actual press is complete, and in rapid succession,
 * which doesn't always give a simulation (eg, C1Pjs) enough time to detect the key.
 *
 * The other problem (which is more of a problem with keyboards like the C1P than any IBM keyboards) is
 * that the shift/modifier state for a character on the "source" keyboard may not match the shift/modifier
 * state for the same character on the "target" keyboard.  And since this code is inherited from C1Pjs,
 * we've inherited the same solution: keySimulateUpOrDown() has the ability to "undo" any states in
 * shiftStates that conflict with the state(s) required for the character in question.
 *
 * @enum {number}
 */
Keyboard.aKeyCodes = {};
Keyboard.aKeyCodes[Keyboard.KEYCODE.ESC   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.ESC;
Keyboard.aKeyCodes[Keyboard.ASCII['1']]   = Keyboard.SCANCODE.ONE;
Keyboard.aKeyCodes[Keyboard.ASCII['!']]   = Keyboard.SCANCODE.ONE    | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['2']]   = Keyboard.SCANCODE.TWO;
Keyboard.aKeyCodes[Keyboard.ASCII['@']]   = Keyboard.SCANCODE.TWO    | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['3']]   = Keyboard.SCANCODE.THREE;
Keyboard.aKeyCodes[Keyboard.ASCII['#']]   = Keyboard.SCANCODE.THREE  | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['4']]   = Keyboard.SCANCODE.FOUR;
Keyboard.aKeyCodes[Keyboard.ASCII['$']]   = Keyboard.SCANCODE.FOUR   | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['5']]   = Keyboard.SCANCODE.FIVE;
Keyboard.aKeyCodes[Keyboard.ASCII['%']]   = Keyboard.SCANCODE.FIVE   | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['6']]   = Keyboard.SCANCODE.SIX;
Keyboard.aKeyCodes[Keyboard.ASCII['^']]   = Keyboard.SCANCODE.SIX    | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['7']]   = Keyboard.SCANCODE.SEVEN;
Keyboard.aKeyCodes[Keyboard.ASCII['&']]   = Keyboard.SCANCODE.SEVEN  | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['8']]   = Keyboard.SCANCODE.EIGHT;
Keyboard.aKeyCodes[Keyboard.ASCII['*']]   = Keyboard.SCANCODE.EIGHT  | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['9']]   = Keyboard.SCANCODE.NINE;
Keyboard.aKeyCodes[Keyboard.ASCII['(']]   = Keyboard.SCANCODE.NINE   | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['0']]   = Keyboard.SCANCODE.ZERO;
Keyboard.aKeyCodes[Keyboard.ASCII[')']]   = Keyboard.SCANCODE.ZERO   | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['-']]   = Keyboard.SCANCODE.DASH;
Keyboard.aKeyCodes[Keyboard.ASCII['_']]   = Keyboard.SCANCODE.DASH   | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['=']]   = Keyboard.SCANCODE.EQUALS;
Keyboard.aKeyCodes[Keyboard.ASCII['+']]   = Keyboard.SCANCODE.EQUALS | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.BS    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.BS;
Keyboard.aKeyCodes[Keyboard.KEYCODE.TAB   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.TAB;
Keyboard.aKeyCodes[Keyboard.ASCII.q]      = Keyboard.SCANCODE.Q;
Keyboard.aKeyCodes[Keyboard.ASCII.Q]      = Keyboard.SCANCODE.Q      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.w]      = Keyboard.SCANCODE.W;
Keyboard.aKeyCodes[Keyboard.ASCII.W]      = Keyboard.SCANCODE.W      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.e]      = Keyboard.SCANCODE.E;
Keyboard.aKeyCodes[Keyboard.ASCII.E]      = Keyboard.SCANCODE.E      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.r]      = Keyboard.SCANCODE.R;
Keyboard.aKeyCodes[Keyboard.ASCII.R]      = Keyboard.SCANCODE.R      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.t]      = Keyboard.SCANCODE.T;
Keyboard.aKeyCodes[Keyboard.ASCII.T]      = Keyboard.SCANCODE.T      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.y]      = Keyboard.SCANCODE.Y;
Keyboard.aKeyCodes[Keyboard.ASCII.Y]      = Keyboard.SCANCODE.Y      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.u]      = Keyboard.SCANCODE.U;
Keyboard.aKeyCodes[Keyboard.ASCII.U]      = Keyboard.SCANCODE.U      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.i]      = Keyboard.SCANCODE.I;
Keyboard.aKeyCodes[Keyboard.ASCII.I]      = Keyboard.SCANCODE.I      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.o]      = Keyboard.SCANCODE.O;
Keyboard.aKeyCodes[Keyboard.ASCII.O]      = Keyboard.SCANCODE.O      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.p]      = Keyboard.SCANCODE.P;
Keyboard.aKeyCodes[Keyboard.ASCII.P]      = Keyboard.SCANCODE.P      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['[']]   = Keyboard.SCANCODE.LBRACK;
Keyboard.aKeyCodes[Keyboard.ASCII['{']]   = Keyboard.SCANCODE.LBRACK | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII[']']]   = Keyboard.SCANCODE.RBRACK;
Keyboard.aKeyCodes[Keyboard.ASCII['}']]   = Keyboard.SCANCODE.RBRACK | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.CR]   = Keyboard.SCANCODE.ENTER;
Keyboard.aKeyCodes[Keyboard.KEYCODE.CTRL  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.CTRL;
Keyboard.aKeyCodes[Keyboard.ASCII.a]      = Keyboard.SCANCODE.A;
Keyboard.aKeyCodes[Keyboard.ASCII.A]      = Keyboard.SCANCODE.A      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.s]      = Keyboard.SCANCODE.S;
Keyboard.aKeyCodes[Keyboard.ASCII.S]      = Keyboard.SCANCODE.S      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.d]      = Keyboard.SCANCODE.D;
Keyboard.aKeyCodes[Keyboard.ASCII.D]      = Keyboard.SCANCODE.D      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.f]      = Keyboard.SCANCODE.F;
Keyboard.aKeyCodes[Keyboard.ASCII.F]      = Keyboard.SCANCODE.F      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.g]      = Keyboard.SCANCODE.G;
Keyboard.aKeyCodes[Keyboard.ASCII.G]      = Keyboard.SCANCODE.G      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.h]      = Keyboard.SCANCODE.H;
Keyboard.aKeyCodes[Keyboard.ASCII.H]      = Keyboard.SCANCODE.H      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.j]      = Keyboard.SCANCODE.J;
Keyboard.aKeyCodes[Keyboard.ASCII.J]      = Keyboard.SCANCODE.J      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.k]      = Keyboard.SCANCODE.K;
Keyboard.aKeyCodes[Keyboard.ASCII.K]      = Keyboard.SCANCODE.K      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.l]      = Keyboard.SCANCODE.L;
Keyboard.aKeyCodes[Keyboard.ASCII.L]      = Keyboard.SCANCODE.L      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII[';']]   = Keyboard.SCANCODE.SEMI;
Keyboard.aKeyCodes[Keyboard.ASCII[':']]   = Keyboard.SCANCODE.SEMI   | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII["'"]]   = Keyboard.SCANCODE.QUOTE;
Keyboard.aKeyCodes[Keyboard.ASCII['"']]   = Keyboard.SCANCODE.QUOTE  | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['`']]   = Keyboard.SCANCODE.BQUOTE;
Keyboard.aKeyCodes[Keyboard.ASCII['~']]   = Keyboard.SCANCODE.BQUOTE | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.SHIFT + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.SHIFT;
Keyboard.aKeyCodes[Keyboard.ASCII['\\']]  = Keyboard.SCANCODE.BSLASH;
Keyboard.aKeyCodes[Keyboard.ASCII['|']]   = Keyboard.SCANCODE.BSLASH | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.z]      = Keyboard.SCANCODE.Z;
Keyboard.aKeyCodes[Keyboard.ASCII.Z]      = Keyboard.SCANCODE.Z      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.x]      = Keyboard.SCANCODE.X;
Keyboard.aKeyCodes[Keyboard.ASCII.X]      = Keyboard.SCANCODE.X      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.c]      = Keyboard.SCANCODE.C;
Keyboard.aKeyCodes[Keyboard.ASCII.C]      = Keyboard.SCANCODE.C      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.v]      = Keyboard.SCANCODE.V;
Keyboard.aKeyCodes[Keyboard.ASCII.V]      = Keyboard.SCANCODE.V      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.b]      = Keyboard.SCANCODE.B;
Keyboard.aKeyCodes[Keyboard.ASCII.B]      = Keyboard.SCANCODE.B      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.n]      = Keyboard.SCANCODE.N;
Keyboard.aKeyCodes[Keyboard.ASCII.N]      = Keyboard.SCANCODE.N      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII.m]      = Keyboard.SCANCODE.M;
Keyboard.aKeyCodes[Keyboard.ASCII.M]      = Keyboard.SCANCODE.M      | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII[',']]   = Keyboard.SCANCODE.COMMA;
Keyboard.aKeyCodes[Keyboard.ASCII['<']]   = Keyboard.SCANCODE.COMMA  | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['.']]   = Keyboard.SCANCODE.PERIOD;
Keyboard.aKeyCodes[Keyboard.ASCII['>']]   = Keyboard.SCANCODE.PERIOD | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.ASCII['/']]   = Keyboard.SCANCODE.SLASH;
Keyboard.aKeyCodes[Keyboard.ASCII['?']]   = Keyboard.SCANCODE.SLASH  | (Keyboard.SCANCODE.SHIFT << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.SHIFT + Keyboard.KEYCODE.ONDOWN  +  Keyboard.KEYCODE.ONRIGHT] = Keyboard.SCANCODE.RSHIFT;
// TODO: 0x37 ('prtsc')
Keyboard.aKeyCodes[Keyboard.KEYCODE.ALT   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.ALT;
Keyboard.aKeyCodes[Keyboard.ASCII[' ']]   = Keyboard.SCANCODE.SPACE;
Keyboard.aKeyCodes[Keyboard.KEYCODE.CAPS_LOCK   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.CAPS_LOCK;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F1    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F1;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F2    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F2;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F3    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F3;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F4    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F4;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F5    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F5;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F6    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F6;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F7    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F7;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F8    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F8;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F9    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F9;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F10   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F10;
Keyboard.aKeyCodes[Keyboard.KEYCODE.NUM_LOCK    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_LOCK;
Keyboard.aKeyCodes[Keyboard.KEYCODE.SCROLL_LOCK + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.SCROLL_LOCK;
// TODO: 0x4a ('num-sub') and 0x4e ('num-add')
Keyboard.aKeyCodes[Keyboard.KEYCODE.HOME  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_HOME;
Keyboard.aKeyCodes[Keyboard.KEYCODE.UP    + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_UP;
Keyboard.aKeyCodes[Keyboard.KEYCODE.PGUP  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_PGUP;
Keyboard.aKeyCodes[Keyboard.KEYCODE.LEFT  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_LEFT;
Keyboard.aKeyCodes[Keyboard.KEYCODE.RIGHT + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_RIGHT;
Keyboard.aKeyCodes[Keyboard.KEYCODE.END   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_END;
Keyboard.aKeyCodes[Keyboard.KEYCODE.DOWN  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_DOWN;
Keyboard.aKeyCodes[Keyboard.KEYCODE.PGDN  + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_PGDN;
Keyboard.aKeyCodes[Keyboard.KEYCODE.INS   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_INS;
Keyboard.aKeyCodes[Keyboard.KEYCODE.DEL   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.NUM_DEL;
/*
 * Entries beyond this point are for keys that existed only on 101-key keyboards (well, except for 'sysreq',
 * which also existed on the 84-key keyboard), which ALSO means that these keys essentially did not exist
 * for a MODEL_5150 or MODEL_5160 machine, because those machines could use only 83-key keyboards.  Remember
 * that IBM machines and IBM keyboards are our reference point here, so while there were undoubtedly 5150/5160
 * clones that could use newer keyboards, as well as 3rd-party keyboards that could work with older machines,
 * support for non-IBM configurations is left for another day.
 *
 * TODO: The only relevance of newer keyboards to older machines is the fact that you're probably using a newer
 * keyboard with your browser, which raises the question of what to do with newer keys that older machines
 * wouldn't understand.  I don't attempt to filter out any of the entries below based on machine model, but that
 * would seem like a wise thing to do.
 *
 * TODO: Add entries for 'num-mul', 'num-div', 'num-enter', the stand-alone arrow keys, etc, AND at the same time,
 * make sure that keys with multi-byte sequences (eg, 0xe0 0x1c) work properly.
 */
Keyboard.aKeyCodes[Keyboard.KEYCODE.F11   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F11;
Keyboard.aKeyCodes[Keyboard.KEYCODE.F12   + Keyboard.KEYCODE.ONDOWN] =  Keyboard.SCANCODE.F12;

Keyboard.aKeyCodes[Keyboard.KEYCODE.FAKE_CTRLC]      = Keyboard.SCANCODE.C           | (Keyboard.SCANCODE.CTRL << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.FAKE_CTRLBREAK]  = Keyboard.SCANCODE.SCROLL_LOCK | (Keyboard.SCANCODE.CTRL << 8);
Keyboard.aKeyCodes[Keyboard.KEYCODE.FAKE_CTRLALTDEL] = Keyboard.SCANCODE.NUM_DEL     | (Keyboard.SCANCODE.CTRL << 8) | (Keyboard.SCANCODE.ALT << 16);

/**
 * keySimulateUpOrDown() codes (for diagnostic purposes only)
 *
 * @enum {number}
 */
Keyboard.SIMCODE = {
    KEYPRESS:   0,
    KEYRELEASE: 1,
    KEYUPDOWN:  2,
    KEYTIMEOUT: 3,
    AUTOCLEAR:  4
};

if (DEBUGGER) {
    Keyboard.aSimCodeDescs = ["keyPress", "keyRelease", "keyUpDown", "keyTimeout", "autoClear"];
}

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
    LOAD_TEST:  0x65,   // undocumented "LOAD MANUFACTURING TEST REQUEST" response code
    BAT_SUCC:   0xAA,   // Basic Assurance Test (BAT) completed successfully
    ECHO:       0xEE,
    BREAK_PREF: 0xF0,   // break prefix
    ACK:        0xFA,
    BAT_FAIL:   0xFC,   // Basic Assurance Test (BAT) failed
    DIAG_FAIL:  0xFD,
    RESEND:     0xFE,
    BUFF_FULL:  0xFF    // TODO: Verify this response code (is it just for older 83-key keyboards?)
};

Keyboard.LIMIT = {
    MAX_SCANCODES: 20   // TODO: Verify this limit for newer keyboards (84-key and up)
};

/**
 * setBinding(sHTMLType, sBinding, control)
 *
 * @this {Keyboard}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "esc")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Keyboard.prototype.setBinding = function(sHTMLType, sBinding, control)
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
            this.bindings[id] = control;
            control.onkeydown = function onKeyDownKeyboard(event) {
                return kbd.keyUpDown(event, true);
            };
            control.onkeypress = function onKeyPressKeyboard(event) {
                return kbd.keyPress(event);
            };
            control.onkeyup = function onKeyUpKeyboard(event) {
                return kbd.keyUpDown(event, false);
            };
            return true;

        case "caps-lock":
            this.bindings[id] = control;
            control.onclick = function onClickCapsLock(event) {
                return kbd.toggleCapsLock(event);
            };
            return true;

        case "num-lock":
            this.bindings[id] = control;
            control.onclick = function onClickNumLock(event) {
                return kbd.toggleNumLock(event);
            };
            return true;

        case "scroll-lock":
            this.bindings[id] = control;
            control.onclick = function onClickScrollLock(event) {
                return kbd.toggleScrollLock(event);
            };
            return true;

        default:
            if (Keyboard.aButtonCodes[sBinding] !== undefined && sHTMLType == "button") {
                this.bindings[id] = control;
                control.onclick = function(kbd, sKey, keyCode) {
                    return function onClickKeyboard(event) {
                        if (DEBUG && kbd.messageEnabled()) kbd.messageDebugger(sKey + " clicked", Debugger.MESSAGE.KEYS);
                        if (kbd.cpu) kbd.cpu.setFocus();
                        kbd.checkShiftState(keyCode);
                        return !kbd.keySimulatePress(keyCode);
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
                }(this, sBinding, Keyboard.aSoftCodes[sBinding] | Keyboard.SCANCODE.BREAK);
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
 * findBinding(bKey, sType, fDown)
 *
 * @this {Keyboard}
 * @param {number} bKey
 * @param {string} sType is the type of control (eg, "button" or "key")
 * @param {boolean} [fDown] is true if the key is going down, false if up, or undefined if unchanged
 * @return {Object} is the HTML control DOM object (eg, HTMLButtonElement), or undefined if no such control exists
 */
Keyboard.prototype.findBinding = function(bKey, sType, fDown)
{
    var control;
    for (var sBinding in Keyboard.aSoftCodes) {
        if (Keyboard.aSoftCodes[sBinding] == bKey) {
            var id = sType + '-' + sBinding;
            control = this.bindings[id];
            if (control && fDown !== undefined) {
                this.setSoftKeyState(control, fDown);
            }
            break;
        }
    }
    return control;
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
 * notifyEscape(fDisabled)
 *
 * When ESC is used by the browser to disable pointer lock, this gives us the option of mapping a different key to ESC.
 *
 * @this {Keyboard}
 * @param {boolean} fDisabled
 */
Keyboard.prototype.notifyEscape = function(fDisabled)
{
    this.fEscapeDisabled = fDisabled;
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
    this.fMobile = web.isMobile();
    this.messageDebugger("mobile keyboard support: " + (this.fMobile? "true" : "false"));
    /*
     * TODO: Determine how to declare this superclass method in order to avoid a type warning in WebStorm
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
    this.messageDebugger("keyboard reset", Debugger.MESSAGE.KBD | Debugger.MESSAGE.PORT);
    this.abScanBuffer = [Keyboard.CMDRES.BAT_SUCC];
    if (this.chipset) this.chipset.notifyKbdData(true);
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
        if (DEBUG && this.messageEnabled(Debugger.MESSAGE.KBD | Debugger.MESSAGE.PORT)) {
            this.messageDebugger("keyboard clock line changing to " + fClock, true);
        }
        /*
         * Toggling the clock line low and then high signals a "reset", which we acknowledge once the
         * data line is high as well.
         */
        this.fClock = this.fResetOnEnable = fClock;
    }
    if (this.fData !== fData) {
        if (DEBUG && this.messageEnabled(Debugger.MESSAGE.KBD | Debugger.MESSAGE.PORT)) {
            this.messageDebugger("keyboard data line changing to " + fData, true);
        }
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
 * This is the ChipSet's interface for reading scan codes.  This also doubles as the ChipSet's interface for checking
 * whether or not any data is available.
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
        if (this.messageEnabled()) this.messageDebugger("scan code 0x" + str.toHexByte(b) + " delivered");
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
                if (this.chipset) this.chipset.notifyKbdData(true);
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
     * The current (assumed) physical state of the various shift/lock keys.
     *
     * TODO: Determine how (or whether) we can query the browser's initial shift/lock key states.
     */
    this.shiftStates = 0;

    /*
     * New scan codes are "pushed" onto abScanBuffer and then "shifted" off.
     */
    this.abScanBuffer = [];

    /*
     * When a key "down" is simulated on behalf of some keyCode, I save the timer object responsible for
     * simulating the key "up" here, so that if I detect the actual key going up sooner, I can cancel the
     * timer and simulate the "up" immediately.  Similarly, if another press for the same key arrives before
     * last one expired (eg, auto-repeat), I need to cancel the previous timer for that key before setting another.
     */
    for (var i in this.aKeyTimers) {
        if (str.isValidInt(i)) continue; // ignore any non-numeric properties, if any
        if (this.aKeyTimers[i]) {
            clearTimeout(this.aKeyTimers[i]);
            this.aKeyTimers[i] = null;
        }
    }

    this.prevCharDown = 0;
    this.prevKeyDown = 0;

    /*
     * Make sure the auto-injection buffer is empty (an injection could have been in progress on any reset after the first).
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
 * @this {Keyboard}
 * @param {number} bScan
 * @param {boolean} [fRepeat]
 */
Keyboard.prototype.addScanCode = function(bScan, fRepeat)
{
    var bKey = bScan & Keyboard.SCANCODE.MAKE;
    var fDown = (bKey == bScan);
    /*
     * Prepare for the possibility that our reset() function may not have been called yet.
     *
     * TODO: Determine whether we need to reset() the Keyboard sooner (ie, in the constructor),
     * or if we need to protect other methods from prematurely accessing certain Keyboard structures,
     * as a result of calls from any of the key event handlers established by setBinding().
     */
    if (this.abScanBuffer) {
        if (this.abScanBuffer.length < Keyboard.LIMIT.MAX_SCANCODES) {
            if (!fDown && !this.aScanCodesActive[bKey] || fDown && this.aScanCodesActive[bKey] && !fRepeat) {
                if (MAXDEBUG && this.messageEnabled()) this.messageDebugger("scan code 0x" + str.toHexByte(bScan) + " redundant");
                return;
            }
            this.aScanCodesActive[bKey] = fDown;
            if (this.messageEnabled()) this.messageDebugger("scan code 0x" + str.toHexByte(bScan) + " buffered");
            this.abScanBuffer.push(bScan);
            if (this.abScanBuffer.length == 1) {
                if (this.chipset) this.chipset.notifyKbdData(true);
            }
            this.findBinding(bKey, "key", fDown);
            return;
        }
        if (this.abScanBuffer.length == Keyboard.LIMIT.MAX_SCANCODES) {
            this.abScanBuffer.push(Keyboard.CMDRES.BUFF_FULL);
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
     * Unfortunately, with a large initial delay, we need to enable the auto-clear code in the keyUpDown()
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
        if (DEBUG) {
            if (this.messageEnabled()) this.messageDebugger("autoClear(" + this.prevCharDown + ")");
            this.assert(this.aKeyTimers[this.prevCharDown]);
        }
        clearTimeout(this.aKeyTimers[this.prevCharDown]);
        this.keySimulateUpOrDown(this.prevCharDown, false, Keyboard.SIMCODE.AUTOCLEAR);
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
        this.keySimulatePress(ch);
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
 * setLED(control, f)
 *
 * @this {Keyboard}
 * @param {Object} control is an HTML control DOM object
 * @param {boolean} f is true if the LED represented by control should be "on", false if "off"
 */
Keyboard.prototype.setLED = function(control, f)
{
    control.style.backgroundColor = (f? "#00ff00" : "#000000");
};

/**
 * updateLEDs(bitState)
 *
 * Updates any and all shift-related LEDs with the corresponding state in shiftStates.
 *
 * @this {Keyboard}
 * @param {number} [bitState] is the bit in shiftStates that may have changed, if known; undefined if not
 */
Keyboard.prototype.updateLEDs = function(bitState)
{
    var control;
    for (var sBinding in Keyboard.LEDSTATES) {
        var id = "led-" + sBinding;
        var bitLED = Keyboard.LEDSTATES[sBinding];
        if ((!bitState || bitState == bitLED) && (control = this.bindings[id])) {
            this.setLED(control, !!(this.shiftStates & bitLED));
        }
    }
};

/**
 * toggleCapsLock(event)
 *
 * @this {Keyboard}
 * @param {Object} event
 */
Keyboard.prototype.toggleCapsLock = function(event)
{
    if (this.cpu) this.cpu.setFocus();
    this.keySimulatePress(Keyboard.KEYCODE.CAPS_LOCK + Keyboard.KEYCODE.ONDOWN, true);
};

/**
 * toggleNumLock(event)
 *
 * @this {Keyboard}
 * @param {Object} event
 */
Keyboard.prototype.toggleNumLock = function(event)
{
    if (this.cpu) this.cpu.setFocus();
    this.keySimulatePress(Keyboard.KEYCODE.NUM_LOCK + Keyboard.KEYCODE.ONDOWN, true);
};

/**
 * toggleScrollLock(event)
 *
 * @this {Keyboard}
 * @param {Object} event
 */
Keyboard.prototype.toggleScrollLock = function(event)
{
    if (this.cpu) this.cpu.setFocus();
    this.keySimulatePress(Keyboard.KEYCODE.SCROLL_LOCK + Keyboard.KEYCODE.ONDOWN, true);
};

/**
 * checkShiftState(keyCode, fDown)
 *
 * @this {Keyboard}
 * @param {number} keyCode (should already include any ONDOWN and/or ONRIGHT modifiers)
 * @param {boolean} [fDown] is true for down, false for up, undefined for TBD
 */
Keyboard.prototype.checkShiftState = function(keyCode, fDown)
{
    if (Keyboard.aKeyCodes[keyCode]) {
        var bCode = Math.floor(keyCode % 1000);
        var fRight = (Math.floor(keyCode / 1000) & 2);
        var bitState = Keyboard.KEYSTATES[bCode] || 0;
        if (bitState) {
            if (fRight) bitState >>= 1;
            if (bitState & Keyboard.STATES.LOCK) {
                fDown = !(this.shiftStates & bitState);
            }
            this.shiftStates &= ~bitState;
            if (fDown) this.shiftStates |= bitState;

            this.updateLEDs(bitState);
        }
    }
};

/**
 * keyUpDown(event, fDown)
 *
 * @this {Keyboard}
 * @param {Object} event
 * @param {boolean} fDown is true for a keyDown event, false for a keyUp event
 * @return {boolean} true to pass the event along, false to consume it
 */
Keyboard.prototype.keyUpDown = function(event, fDown)
{
    var fPass;
    var fAutoClear = !fDown;
    var keyCode = event.keyCode;

    var keyCodeSim = keyCode;

    if (fDown) this.prevKeyDown = keyCode;

    if (Keyboard.aKeyCodes[keyCode + Keyboard.KEYCODE.ONDOWN]) {

        keyCodeSim += Keyboard.KEYCODE.ONDOWN;
        var bitState = Keyboard.KEYSTATES[keyCode] || 0;

        if (bitState) {
            if (event.location == Keyboard.LOCATION.RIGHT) {
                bitState >>= 1;
                keyCodeSim += Keyboard.KEYCODE.ONRIGHT;
            }
            this.shiftStates &= ~bitState;
            if (fDown) this.shiftStates |= bitState;

            this.updateLEDs(bitState);

            if (keyCode == Keyboard.KEYCODE.CAPS_LOCK || keyCode == Keyboard.KEYCODE.NUM_LOCK || keyCode == Keyboard.KEYCODE.SCROLL_LOCK) {
                /*
                 * FYI, "lock" keys generate a "down" event ONLY when getting locked, and an "up" event ONLY
                 * when getting unlocked--which is exactly what I want, even though that may seem a little
                 * counter-intuitive.
                 *
                 * However, since the key DID actually go down AND up on each event, we must make sure both make
                 * and break scan codes are delivered; keySimulatePress() will take care of that.
                 */
                fPass = this.keySimulatePress(keyCodeSim);
            } else {
                fAutoClear = false;
            }
        } else {
            if (keyCode == Keyboard.KEYCODE.BS || keyCode == Keyboard.KEYCODE.TAB || keyCode == Keyboard.KEYCODE.ESC) {
                /*
                 * HACK for simulating Ctrl-Break using Ctrl-Del (Mac) / Ctrl-Backspace (Windows)
                 */
                if (keyCode == Keyboard.KEYCODE.BS && (this.shiftStates & (Keyboard.STATES.CTRL|Keyboard.STATES.ALT)) == Keyboard.STATES.CTRL) {
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
                 * I don't get keyPress events for ESC (why?) and I never want the browser to act on BS
                 * (which does double-duty as the "Back" button and leaves the current page), so I have
                 * to simulate them now.
                 *
                 * Note that I call the "press" simulate method and NOT the "event" simulate method, because
                 * the former takes care of simulating both individual "down" and "up" events.
                 */
                fPass = (fDown? !this.keySimulatePress(keyCodeSim) : false);
            } else {
                /*
                 * No effect, at least in IE9....
                 *
                if (keyCode == Keyboard.KEYCODE.F1 || keyCode == Keyboard.KEYCODE.F11 || keyCode == Keyboard.KEYCODE.F12) {
                    this.println("preventDefault()");
                    event.preventDefault();
                }
                 */
            }
        }
    }
    else {
        if (keyCode == Keyboard.KEYCODE.COMMAND) {
            /*
             * Avoid interfering with useful Browser key commands, like COMMAND-Q, COMMAND-T, etc.
             */
            this.shiftStates &= ~Keyboard.STATES.COMMAND;
            if (fDown) this.shiftStates |= Keyboard.STATES.COMMAND;
            fAutoClear = false;
            fPass = true;
        }
        /*
         * All other ALT and/or CTRL-key combinations are handled here (in part because not all
         * generate keyPress events, and even those that do may generate odd keyCodes that I'd rather
         * not create mappings for).
         */
        else if (event.altKey || event.ctrlKey) {
            if (keyCode >= Keyboard.ASCII.A && keyCode <= Keyboard.ASCII.Z) {
                /*
                 * Convert "upper-case" letter combinations into "lower-case" combinations, so
                 * that keySimulateUpOrDown() doesn't think it also needs to simulate a SHIFT key, too.
                 */
                keyCodeSim += (Keyboard.ASCII.a - Keyboard.ASCII.A);
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
        this.shiftStates &= ~Keyboard.STATES.COMMAND;
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
        fPass = !this.keySimulateUpOrDown(keyCodeSim, fDown, Keyboard.SIMCODE.KEYUPDOWN);
    }

    if (DEBUG && this.messageEnabled(Debugger.MESSAGE.KEYS)) {
        this.messageDebugger(/*(fDown?"\n":"") +*/ "key" + (fDown? "Down" : "Up") + "(" + keyCode + "): " + (fPass? "pass" : "consume"), true);
    }
    return fPass;
};

/**
 * keyPress(event)
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
         * Unlike Safari and Chrome, Firefox doesn't seem to honor our "consume" request for the "down" BS keyEvent,
         * so we must ALSO check for the BS key here, and again "consume" it.  Ditto for TAB.
         *
         * This is just one example of a larger Firefox problem (see https://bugzilla.mozilla.org/show_bug.cgi?id=501496).
         * Basically, Firefox is not honoring our consumption of keyDown events, and generates keyPress events anyway.
         * This causes us grief for various CTRL and ALT combinations, resulting in duplicate key presses.  So, I'm going
         * to try to fix this below, by setting fPass to true if either of those modifier keys is currently down;
         * if they're not, then we'll continue with the original code that sets fPass based on the return from keySimulatePress().
         */
        fPass = false;
    } else {
        if (this.shiftStates & Keyboard.STATES.COMMAND) {
            this.shiftStates &= ~Keyboard.STATES.COMMAND;
        } else {
            // if (DEBUG && event.altKey) this.messageDebugger("ALT press: keyCode " + keyCode, Debugger.MESSAGE.KEYS);
            if (this.shiftStates & (Keyboard.STATES.CTRL | Keyboard.STATES.ALT)) {
                fPass = false;
            } else {
                if (this.fEscapeDisabled && keyCode == Keyboard.ASCII['`']) keyCode = Keyboard.KEYCODE.ESC;
                fPass = !this.keySimulatePress(keyCode);
            }
        }
    }

    if (DEBUG && this.messageEnabled(Debugger.MESSAGE.KEYS)) {
        this.messageDebugger("keyPress(" + keyCode + "): " + (fPass? "pass" : "consume"), true);
    }
    return fPass;
};

/**
 * keySimulatePress(keyCode, fCheckShift, fQuickRelease)
 *
 * @this {Keyboard}
 * @param {number} keyCode
 * @param {boolean} [fCheckShift]
 * @param {boolean} [fQuickRelease] is true to simulate the press and release immediately
 * @return {boolean} true if successfully simulated, false if unrecognized/unsupported key
 */
Keyboard.prototype.keySimulatePress = function(keyCode, fCheckShift, fQuickRelease)
{
    var fSimulated = false;

    /*
     * Auto-clear any previous down key EXCEPT for keyCode (because it may be held and repeating).
     */
    this.autoClear(keyCode);

    if (fCheckShift) this.checkShiftState(keyCode);

    if (this.keySimulateUpOrDown(keyCode, true, Keyboard.SIMCODE.KEYPRESS)) {
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
            this.keySimulateUpOrDown(keyCode, false, Keyboard.SIMCODE.KEYRELEASE);
        }
        else {
            var fRepeat = false;
            if (this.aKeyTimers[keyCode]) {
                clearTimeout(this.aKeyTimers[keyCode]);
                this.aKeyTimers[keyCode] = null;
                fRepeat = true;
            }
            var msDelay = this.calcReleaseDelay(fRepeat);
            this.aKeyTimers[this.prevCharDown = keyCode] = setTimeout(function (kbd) {
                return function onkeySimulatePressTimeout() {
                    kbd.keySimulateUpOrDown(keyCode, false, Keyboard.SIMCODE.KEYTIMEOUT);
                };
            }(this), msDelay);
            if (DEBUG && this.messageEnabled()) {
                this.messageDebugger("keySimulatePress(" + keyCode + "): setTimeout()");
            }
        }
        fSimulated = true;
    }
    if (DEBUG && this.messageEnabled(Debugger.MESSAGE.KEYS)) {
        this.messageDebugger("keySimulatePress(" + keyCode + "): " + (fSimulated? "true" : "false"), true);
    }
    return fSimulated;
};

/**
 * keySimulateUpOrDown(keyCode, fDown, simCode)
 *
 * @this {Keyboard}
 * @param {number} keyCode
 * @param {boolean} fDown
 * @param {number} simCode indicates the origin of the event
 * @return {boolean} true if successfully simulated, false if unrecognized/unsupported key
 */
Keyboard.prototype.keySimulateUpOrDown = function(keyCode, fDown, simCode)
{
    var fSimulated = false;

    if (!fDown) {
        this.aKeyTimers[keyCode] = null;
        if (this.prevCharDown == keyCode) this.prevCharDown = 0;
    }

    var wCode = Keyboard.aKeyCodes[keyCode] || Keyboard.aKeyCodes[keyCode + Keyboard.KEYCODE.ONDOWN];

    if (wCode !== undefined) {
        /*
         * Hack to transform the IBM "BACKSPACE" key (which we normally map to KEYCODE_DELETE) to the IBM "DEL" key
         * whenever both CTRL and ALT are pressed as well, so that it's easier to simulate that old favorite: CTRL-ALT-DEL
         */
        if (wCode == Keyboard.SCANCODE.BS) {
            if ((this.shiftStates & (Keyboard.STATES.CTRL | Keyboard.STATES.ALT)) == (Keyboard.STATES.CTRL | Keyboard.STATES.ALT)) {
                wCode = Keyboard.SCANCODE.NUM_DEL;
            }
        }

        var abScanCodes = [];
        var bCode = wCode & 0xff;
        abScanCodes.push(bCode | (fDown? 0 : Keyboard.SCANCODE.BREAK));

        var fAlpha = (keyCode >= Keyboard.ASCII.A && keyCode <= Keyboard.ASCII.Z || keyCode >= Keyboard.ASCII.a && keyCode <= Keyboard.ASCII.z);

        while (wCode >>>= 8) {
            var bShift = 0;
            var bScan = wCode & 0xff;
            /*
             * TODO: The handling of aKeyCodes entries with "extended" codes still needs to be tested, and
             * moreover, if any of them need to perform any shift-state modifications, those modifications will
             * need to be encoded differently.
             */
            if (bCode == Keyboard.SCANCODE.EXTEND1 || bCode == Keyboard.SCANCODE.EXTEND2) {
                abScanCodes.push(bCode | (fDown? 0 : Keyboard.SCANCODE.BREAK));
                continue;
            }
            if (bScan == Keyboard.SCANCODE.SHIFT) {
                if (!(this.shiftStates & (Keyboard.STATES.SHIFT | Keyboard.STATES.RSHIFT))) {
                    if (!(this.shiftStates & Keyboard.STATES.CAPS_LOCK) || !fAlpha) {
                        bShift = bScan;
                    }
                }
            } else if (bScan == Keyboard.SCANCODE.CTRL) {
                if (!(this.shiftStates & (Keyboard.STATES.CTRL | Keyboard.STATES.RCTRL))) {
                    bShift = bScan;
                }
            } else if (bScan == Keyboard.SCANCODE.ALT) {
                if (!(this.shiftStates & (Keyboard.STATES.ALT | Keyboard.STATES.RALT))) {
                    bShift = bScan;
                }
            } else {
                abScanCodes.push(bCode | (fDown? 0 : Keyboard.SCANCODE.BREAK));

            }
            if (bShift) {
                if (fDown)
                    abScanCodes.unshift(bShift);
                else
                    abScanCodes.push(bShift | Keyboard.SCANCODE.BREAK);
            }
        }

        for (var i = 0; i < abScanCodes.length; i++) {
            this.addScanCode(abScanCodes[i]);
        }

        fSimulated = true;
    }
    if (DEBUG && this.messageEnabled(Debugger.MESSAGE.KEYS)) {
        this.messageDebugger("keySimulateUpOrDown(" + keyCode + "," + (fDown? "down" : "up") + "," + Keyboard.aSimCodeDescs[simCode] + "): " + (fSimulated? "true" : "false"), true);
    }
    return fSimulated;
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
