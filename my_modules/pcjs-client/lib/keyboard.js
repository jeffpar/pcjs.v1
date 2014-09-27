/**
 * @fileoverview Implements the PCjs Keyboard component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
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
    var str = require("../../shared/lib/strlib");
    var web = require("../../shared/lib/weblib");
    var Component = require("../../shared/lib/component");
    var ChipSet = require("./chipset");
    var State = require("./state");
    var CPU = require("./cpu");
}

/**
 * Keyboard(parmsKbd)
 *
 * The Keyboard component can be configured with the following (parmsKbd) properties:
 *
 *      model: model string; should be one of:
 *
 *          us83
 *          us84
 *          us101
 *
 *      Default is "us83" (US keyboard layout, 83 keys)
 *
 * Its main purpose is to receive binding requests for various keyboard events,
 * and to use those events to simulate the PC's keyboard hardware.
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

/*
 * Commands that can be sent to the Keyboard via the 8042; see sendCmd()
 */
Keyboard.CMD = {};
Keyboard.CMD.RESET          = 0xFF;
Keyboard.CMD.RESEND         = 0xFE;
Keyboard.CMD.DEFAULT_ON     = 0xF6;
Keyboard.CMD.DEFAULT_OFF    = 0xF5;
Keyboard.CMD.ENABLE         = 0xF4;
Keyboard.CMD.SETRATE        = 0xF3;
Keyboard.CMD.ECHO           = 0xEE;
Keyboard.CMD.SETLEDS        = 0xED;

Keyboard.CMDRES = {};
Keyboard.CMDRES.RESEND      = 0xFE;
Keyboard.CMDRES.ACK         = 0xFA;
Keyboard.CMDRES.OVERRUN     = 0x00;
Keyboard.CMDRES.DIAGFAIL    = 0xFD;
Keyboard.CMDRES.BREAKPREFIX = 0xF0;
Keyboard.CMDRES.BATSUCCESS  = 0xAA;     // Basic Assurance Test (BAT) completed successfully 
Keyboard.CMDRES.BATFAIL     = 0xFC;     // Basic Assurance Test (BAT) failed 
Keyboard.CMDRES.ECHO        = 0xEE;

/*
 * Keyboard keyCodes I must pay particular attention to...
 */
Keyboard.KEYCODE = {};
Keyboard.KEYCODE.DELETE     = 0x08;
Keyboard.KEYCODE.TAB        = 0x09;
Keyboard.KEYCODE.LF         = 0x0A;
Keyboard.KEYCODE.CR         = 0x0D;
Keyboard.KEYCODE.SHIFT      = 0x10;     // I map this to CHARCODE_LSHIFT
Keyboard.KEYCODE.CONTROL    = 0x11;
Keyboard.KEYCODE.ALT        = 0x12;
Keyboard.KEYCODE.CAPSLOCK   = 0x14;
Keyboard.KEYCODE.ESC        = 0x1B;     // NOTE: for some reason, this arrive only via keyDown/keyUp, not keyPress
Keyboard.KEYCODE.COMMAND    = 0x5B;

Keyboard.KEYCODE.F1         = 0x70;
Keyboard.KEYCODE.F2         = 0x71;
Keyboard.KEYCODE.F3         = 0x72;
Keyboard.KEYCODE.F4         = 0x73;
Keyboard.KEYCODE.F5         = 0x74;
Keyboard.KEYCODE.F6         = 0x75;
Keyboard.KEYCODE.F7         = 0x76;
Keyboard.KEYCODE.F8         = 0x77;
Keyboard.KEYCODE.F9         = 0x78;
Keyboard.KEYCODE.F10        = 0x79;
Keyboard.KEYCODE.L_ARROW    = 0x25;
Keyboard.KEYCODE.U_ARROW    = 0x26;
Keyboard.KEYCODE.R_ARROW    = 0x27;
Keyboard.KEYCODE.D_ARROW    = 0x28;

/*
 * The following charCodes are the same as the corresponding keyCodes
 */
Keyboard.CHARCODE = {};
Keyboard.CHARCODE.DELETE    = Keyboard.KEYCODE.DELETE;
Keyboard.CHARCODE.TAB       = Keyboard.KEYCODE.TAB;
Keyboard.CHARCODE.LF        = Keyboard.KEYCODE.LF;
Keyboard.CHARCODE.CR        = Keyboard.KEYCODE.CR;
Keyboard.CHARCODE.ESC       = Keyboard.KEYCODE.ESC;

/*
 * The following charCodes are NOT the same as the corresponding keyCodes, hence the bias (CHARCODE.PSEUDO).
 * I've deliberately chosen a bias that still produces values in the byte range (0x00-0xFF) for all the "shift"
 * keys and will therefore fit into individual bytes of aCharCodes, but which shouldn't conflict with any actual,
 * type-able keys.
 */
Keyboard.CHARCODE.PSEUDO    = 0xE0;
Keyboard.CHARCODE.RSHIFT    = Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.LSHIFT    = Keyboard.KEYCODE.SHIFT + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.CTRL      = Keyboard.KEYCODE.CONTROL + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.ALT       = Keyboard.KEYCODE.ALT + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.CAPSLOCK  = Keyboard.KEYCODE.CAPSLOCK + Keyboard.CHARCODE.PSEUDO;

Keyboard.CHARCODE.F1        = Keyboard.KEYCODE.F1 + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.F2        = Keyboard.KEYCODE.F2 + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.F3        = Keyboard.KEYCODE.F3 + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.F4        = Keyboard.KEYCODE.F4 + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.F5        = Keyboard.KEYCODE.F5 + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.F6        = Keyboard.KEYCODE.F6 + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.F7        = Keyboard.KEYCODE.F7 + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.F8        = Keyboard.KEYCODE.F8 + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.F9        = Keyboard.KEYCODE.F9 + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.F10       = Keyboard.KEYCODE.F10 + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.L_ARROW   = Keyboard.KEYCODE.L_ARROW + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.U_ARROW   = Keyboard.KEYCODE.U_ARROW + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.R_ARROW   = Keyboard.KEYCODE.R_ARROW + Keyboard.CHARCODE.PSEUDO;
Keyboard.CHARCODE.D_ARROW   = Keyboard.KEYCODE.D_ARROW + Keyboard.CHARCODE.PSEUDO;

/*
 * TODO: Looking at these two random definitions reminds me I need to do a COMPREHENSIVE review of all keyCode/charCode
 * processing.
 */
Keyboard.CHARCODE.CTRLBREAK = 0xFE;
Keyboard.CHARCODE.CTRLALTDEL= 0xFF;

/*
 * Other common character codes
 */
Keyboard.CHARCODE.CTRLC     = 0x03;
Keyboard.CHARCODE.CTRLO     = 0x0F;

/*
 * These are "shift key" states stored in bitsShift
 */
Keyboard.STATE = {};
Keyboard.STATE.LSHIFT       = 0x01;
Keyboard.STATE.RSHIFT       = 0x02;
Keyboard.STATE.CTRL         = 0x04;
Keyboard.STATE.ALT          = 0x08;
Keyboard.STATE.CAPSLOCK     = 0x10;
Keyboard.STATE.COMMAND      = 0x20;
Keyboard.STATE.SIMULATE     = (Keyboard.STATE.LSHIFT | Keyboard.STATE.RSHIFT | Keyboard.STATE.CTRL | Keyboard.STATE.ALT);

Keyboard.SIMCODE = {};
Keyboard.SIMCODE.KEYPRESS   = 0;
Keyboard.SIMCODE.KEYRELEASE = 1;
Keyboard.SIMCODE.KEYEVENT   = 2;
Keyboard.SIMCODE.KEYTIMEOUT = 3;
Keyboard.SIMCODE.AUTOCLEAR  = 4;

if (DEBUGGER) {
    Keyboard.aSimCodeDescs = ["keyPress", "keyRelease", "keyEvent", "keyTimeout", "autoClear"];
}

Keyboard.aSoftCodes = {
    'esc': 1, '1': 2, '2': 3, '3': 4, '4': 5, '5': 6, '6': 7, '7': 8, '8': 9, '9': 10, '0': 11, '-': 12, '=': 13, 'backspace': 14,
    'tab': 15, 'q': 16, 'w': 17, 'e': 18, 'r': 19, 't': 20, 'y': 21, 'u': 22, 'i': 23, 'o': 24, 'p': 25, '[': 26, ']': 27, 'enter': 28,
    'ctrl': 29, 'a': 30, 's': 31, 'd': 32, 'f': 33, 'g': 34, 'h': 35, 'j': 36, 'k': 37, 'l': 38, ';': 39, 'squote': 40, 'bquote': 41,
    'lshift': 42, 'bslash': 43, 'z': 44, 'x': 45, 'c': 46, 'v': 47, 'b': 48, 'n': 49, 'm': 50, ',': 51, '.': 52, '/': 53, 'rshift': 54, 'prtsc': 55,
    'alt': 56, 'space': 57, 'caps-lock': 58, 'f1': 59, 'f2': 60, 'f3': 61, 'f4': 62, 'f5': 63, 'f6': 64, 'f7': 65, 'f8': 66, 'f9': 67, 'f10': 68, 'num-lock': 69, 'scroll-lock': 70,
    'home': 71, 'up-arrow': 72, 'page-up': 73, 'num-minus': 74, 'left-arrow': 75, 'center': 76, 'right-arrow': 77, 'num-plus': 78, 'end': 79, 'down-arrow': 80, 'page-down': 81,
    'ins': 82, 'del': 83
};

Keyboard.aButtonCodes = {
    'tab':          Keyboard.CHARCODE.TAB,
    'esc':          Keyboard.CHARCODE.ESC,
    'rshift':       Keyboard.CHARCODE.RSHIFT,
    'lshift':       Keyboard.CHARCODE.LSHIFT,
    'ctrl':         Keyboard.CHARCODE.CTRL,
    'alt':          Keyboard.CHARCODE.ALT,
    'caps-lock':    Keyboard.CHARCODE.CAPSLOCK,
    'f1':           Keyboard.CHARCODE.F1,
    'f2':           Keyboard.CHARCODE.F2,
    'f3':           Keyboard.CHARCODE.F3,
    'f4':           Keyboard.CHARCODE.F4,
    'f5':           Keyboard.CHARCODE.F5,
    'f6':           Keyboard.CHARCODE.F6,
    'f7':           Keyboard.CHARCODE.F7,
    'f8':           Keyboard.CHARCODE.F8,
    'f9':           Keyboard.CHARCODE.F9,
    'f10':          Keyboard.CHARCODE.F10,
    'left-arrow':   Keyboard.CHARCODE.L_ARROW,
    'up-arrow':     Keyboard.CHARCODE.U_ARROW,
    'right-arrow':  Keyboard.CHARCODE.R_ARROW,
    'down-arrow':   Keyboard.CHARCODE.D_ARROW,
    /*
     * These last few bindings are for convenience (common key combinations that can be bound to a single control)
     */
    'ctrl-c':       Keyboard.CHARCODE.CTRLC,
    'ctrl-break':   Keyboard.CHARCODE.CTRLBREAK,
    'ctrl-alt-del': Keyboard.CHARCODE.CTRLALTDEL
};

/*
 * This array is used by keyEventSimulate() to lookup a given charCode and convert it to a scan code
 * (lower byte) plus any required shift key states (upper bytes).
 *
 * Using charCodes (from keyPress events) proved to be more robust than using keyCodes (from keyDown and
 * keyUp events), in part because of differences in the way browsers generate the keyDown and keyUp events.
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
 * There are still a few times that I call keyEventSimulate() from keyEvent(), and for those occasions,
 * I create a pseudo-charCode value by adding CHARCODE.PSEUDO (0xE0) to the keyCode value, to avoid any
 * confusion with real charCodes:
 *
 *      CHARCODE_LSHIFT     (originally 0x10, which also looks like CTRL-P, so converted to 0xF0)
 *      CHARCODE_CTRL       (originally 0x11, which also looks like CTRL-Q, so converted to 0xF1)
 *      CHARCODE_ALT        (originally 0x12, which also looks like CTRL-R, so converted to 0xF2)
 *      CHARCODE_CAPSLOCK   (originally 0x14, which also looks like CTRL-T, so converted to 0xF4)
 *
 * Again, as things currently stand, iOS devices should never generate the above charCodes, so any emulated
 * software that relies detecting on shift-key state changes will not work on those devices.
 */
Keyboard.aCharCodes = [];
Keyboard.aCharCodes[0x20] = 0x39;                                       // SPACE
Keyboard.aCharCodes[0x31] = 0x02;                                       // 1
Keyboard.aCharCodes[0x21] = 0x02 | (Keyboard.CHARCODE.LSHIFT << 8);     // !
Keyboard.aCharCodes[0x32] = 0x03;                                       // 2
Keyboard.aCharCodes[0x40] = 0x03 | (Keyboard.CHARCODE.LSHIFT << 8);     // @
Keyboard.aCharCodes[0x33] = 0x04;                                       // 3
Keyboard.aCharCodes[0x23] = 0x04 | (Keyboard.CHARCODE.LSHIFT << 8);     // #
Keyboard.aCharCodes[0x34] = 0x05;                                       // 4
Keyboard.aCharCodes[0x24] = 0x05 | (Keyboard.CHARCODE.LSHIFT << 8);     // $
Keyboard.aCharCodes[0x35] = 0x06;                                       // 5
Keyboard.aCharCodes[0x25] = 0x06 | (Keyboard.CHARCODE.LSHIFT << 8);     // %
Keyboard.aCharCodes[0x36] = 0x07;                                       // 6
Keyboard.aCharCodes[0x5E] = 0x07 | (Keyboard.CHARCODE.LSHIFT << 8);     // ^
Keyboard.aCharCodes[0x37] = 0x08;                                       // 7
Keyboard.aCharCodes[0x26] = 0x08 | (Keyboard.CHARCODE.LSHIFT << 8);     // &
Keyboard.aCharCodes[0x38] = 0x09;                                       // 8
Keyboard.aCharCodes[0x2A] = 0x09 | (Keyboard.CHARCODE.LSHIFT << 8);     // *
Keyboard.aCharCodes[0x39] = 0x0A;                                       // 9
Keyboard.aCharCodes[0x28] = 0x0A | (Keyboard.CHARCODE.LSHIFT << 8);     // (
Keyboard.aCharCodes[0x30] = 0x0B;                                       // 0
Keyboard.aCharCodes[0x29] = 0x0B | (Keyboard.CHARCODE.LSHIFT << 8);     // )
Keyboard.aCharCodes[0x2D] = 0x0C;                                       // -
Keyboard.aCharCodes[0x5F] = 0x0C | (Keyboard.CHARCODE.LSHIFT << 8);     // _
Keyboard.aCharCodes[0x3D] = 0x0D;                                       // =
Keyboard.aCharCodes[0x2B] = 0x0D | (Keyboard.CHARCODE.LSHIFT << 8);     // +
Keyboard.aCharCodes[0x71] = 0x10;                                       // q
Keyboard.aCharCodes[0x51] = 0x10 | (Keyboard.CHARCODE.LSHIFT << 8);     // Q
Keyboard.aCharCodes[0x77] = 0x11;                                       // w
Keyboard.aCharCodes[0x57] = 0x11 | (Keyboard.CHARCODE.LSHIFT << 8);     // W
Keyboard.aCharCodes[0x65] = 0x12;                                       // e
Keyboard.aCharCodes[0x45] = 0x12 | (Keyboard.CHARCODE.LSHIFT << 8);     // E
Keyboard.aCharCodes[0x72] = 0x13;                                       // r
Keyboard.aCharCodes[0x52] = 0x13 | (Keyboard.CHARCODE.LSHIFT << 8);     // R
Keyboard.aCharCodes[0x74] = 0x14;                                       // t
Keyboard.aCharCodes[0x54] = 0x14 | (Keyboard.CHARCODE.LSHIFT << 8);     // T
Keyboard.aCharCodes[0x79] = 0x15;                                       // y
Keyboard.aCharCodes[0x59] = 0x15 | (Keyboard.CHARCODE.LSHIFT << 8);     // Y
Keyboard.aCharCodes[0x75] = 0x16;                                       // u
Keyboard.aCharCodes[0x55] = 0x16 | (Keyboard.CHARCODE.LSHIFT << 8);     // U
Keyboard.aCharCodes[0x69] = 0x17;                                       // i
Keyboard.aCharCodes[0x49] = 0x17 | (Keyboard.CHARCODE.LSHIFT << 8);     // I
Keyboard.aCharCodes[0x6F] = 0x18;                                       // o
Keyboard.aCharCodes[0x4F] = 0x18 | (Keyboard.CHARCODE.LSHIFT << 8);     // O
Keyboard.aCharCodes[0x70] = 0x19;                                       // p
Keyboard.aCharCodes[0x50] = 0x19 | (Keyboard.CHARCODE.LSHIFT << 8);     // P
Keyboard.aCharCodes[0x5B] = 0x1A;                                       // [
Keyboard.aCharCodes[0x7B] = 0x1A | (Keyboard.CHARCODE.LSHIFT << 8);     // {
Keyboard.aCharCodes[0x5D] = 0x1B;                                       // ]
Keyboard.aCharCodes[0x7D] = 0x1B | (Keyboard.CHARCODE.LSHIFT << 8);     // }
Keyboard.aCharCodes[0x61] = 0x1E;                                       // a
Keyboard.aCharCodes[0x41] = 0x1E | (Keyboard.CHARCODE.LSHIFT << 8);     // A
Keyboard.aCharCodes[0x73] = 0x1F;                                       // s
Keyboard.aCharCodes[0x53] = 0x1F | (Keyboard.CHARCODE.LSHIFT << 8);     // S
Keyboard.aCharCodes[0x64] = 0x20;                                       // d
Keyboard.aCharCodes[0x44] = 0x20 | (Keyboard.CHARCODE.LSHIFT << 8);     // D
Keyboard.aCharCodes[0x66] = 0x21;                                       // f
Keyboard.aCharCodes[0x46] = 0x21 | (Keyboard.CHARCODE.LSHIFT << 8);     // F
Keyboard.aCharCodes[0x67] = 0x22;                                       // g
Keyboard.aCharCodes[0x47] = 0x22 | (Keyboard.CHARCODE.LSHIFT << 8);     // G
Keyboard.aCharCodes[0x68] = 0x23;                                       // h
Keyboard.aCharCodes[0x48] = 0x23 | (Keyboard.CHARCODE.LSHIFT << 8);     // H
Keyboard.aCharCodes[0x6A] = 0x24;                                       // j
Keyboard.aCharCodes[0x4A] = 0x24 | (Keyboard.CHARCODE.LSHIFT << 8);     // J
Keyboard.aCharCodes[0x6B] = 0x25;                                       // k
Keyboard.aCharCodes[0x4B] = 0x25 | (Keyboard.CHARCODE.LSHIFT << 8);     // K
Keyboard.aCharCodes[0x6C] = 0x26;                                       // l
Keyboard.aCharCodes[0x4C] = 0x26 | (Keyboard.CHARCODE.LSHIFT << 8);     // L
Keyboard.aCharCodes[0x3B] = 0x27;                                       // ;
Keyboard.aCharCodes[0x3A] = 0x27 | (Keyboard.CHARCODE.LSHIFT << 8);     // :
Keyboard.aCharCodes[0x27] = 0x28;                                       // '
Keyboard.aCharCodes[0x22] = 0x28 | (Keyboard.CHARCODE.LSHIFT << 8);     // "
Keyboard.aCharCodes[0x60] = 0x29;                                       // `
Keyboard.aCharCodes[0x7E] = 0x29 | (Keyboard.CHARCODE.LSHIFT << 8);     // ~
Keyboard.aCharCodes[0x5C] = 0x2B;                                       // \
Keyboard.aCharCodes[0x7C] = 0x2B | (Keyboard.CHARCODE.LSHIFT << 8);     // |
Keyboard.aCharCodes[0x7A] = 0x2C;                                       // z
Keyboard.aCharCodes[0x5A] = 0x2C | (Keyboard.CHARCODE.LSHIFT << 8);     // Z
Keyboard.aCharCodes[0x78] = 0x2D;                                       // x
Keyboard.aCharCodes[0x58] = 0x2D | (Keyboard.CHARCODE.LSHIFT << 8);     // X
Keyboard.aCharCodes[0x63] = 0x2E;                                       // c
Keyboard.aCharCodes[0x43] = 0x2E | (Keyboard.CHARCODE.LSHIFT << 8);     // C
Keyboard.aCharCodes[0x76] = 0x2F;                                       // v
Keyboard.aCharCodes[0x56] = 0x2F | (Keyboard.CHARCODE.LSHIFT << 8);     // V
Keyboard.aCharCodes[0x62] = 0x30;                                       // b
Keyboard.aCharCodes[0x42] = 0x30 | (Keyboard.CHARCODE.LSHIFT << 8);     // B
Keyboard.aCharCodes[0x6E] = 0x31;                                       // n
Keyboard.aCharCodes[0x4E] = 0x31 | (Keyboard.CHARCODE.LSHIFT << 8);     // N
Keyboard.aCharCodes[0x6D] = 0x32;                                       // m
Keyboard.aCharCodes[0x4D] = 0x32 | (Keyboard.CHARCODE.LSHIFT << 8);     // M
Keyboard.aCharCodes[0x2C] = 0x33;                                       // ,
Keyboard.aCharCodes[0x3C] = 0x33 | (Keyboard.CHARCODE.LSHIFT << 8);     // <
Keyboard.aCharCodes[0x2E] = 0x34;                                       // .
Keyboard.aCharCodes[0x3E] = 0x34 | (Keyboard.CHARCODE.LSHIFT << 8);     // >
Keyboard.aCharCodes[0x2F] = 0x35;                                       // /
Keyboard.aCharCodes[0x3F] = 0x35 | (Keyboard.CHARCODE.LSHIFT << 8);     // ?

Keyboard.aCharCodes[Keyboard.CHARCODE.DELETE]   = 0x0E;
Keyboard.aCharCodes[Keyboard.CHARCODE.TAB]      = 0x0F;
Keyboard.aCharCodes[Keyboard.CHARCODE.CR]       = 0x1C;
Keyboard.aCharCodes[Keyboard.CHARCODE.ESC]      = 0x01;
Keyboard.aCharCodes[Keyboard.CHARCODE.LSHIFT]   = 0x2A;
Keyboard.aCharCodes[Keyboard.CHARCODE.RSHIFT]   = 0x36;
Keyboard.aCharCodes[Keyboard.CHARCODE.CTRL]     = 0x1D;
Keyboard.aCharCodes[Keyboard.CHARCODE.ALT]      = 0x38;
Keyboard.aCharCodes[Keyboard.CHARCODE.CAPSLOCK] = 0x3A;
Keyboard.aCharCodes[Keyboard.CHARCODE.F1]       = 0x3B;
Keyboard.aCharCodes[Keyboard.CHARCODE.F2]       = 0x3C;
Keyboard.aCharCodes[Keyboard.CHARCODE.F3]       = 0x3D;
Keyboard.aCharCodes[Keyboard.CHARCODE.F4]       = 0x3E;
Keyboard.aCharCodes[Keyboard.CHARCODE.F5]       = 0x3F;
Keyboard.aCharCodes[Keyboard.CHARCODE.F6]       = 0x40;
Keyboard.aCharCodes[Keyboard.CHARCODE.F7]       = 0x41;
Keyboard.aCharCodes[Keyboard.CHARCODE.F8]       = 0x42;
Keyboard.aCharCodes[Keyboard.CHARCODE.F9]       = 0x43;
Keyboard.aCharCodes[Keyboard.CHARCODE.F10]      = 0x44;
Keyboard.aCharCodes[Keyboard.CHARCODE.L_ARROW]  = 0x4B;
Keyboard.aCharCodes[Keyboard.CHARCODE.U_ARROW]  = 0x48;
Keyboard.aCharCodes[Keyboard.CHARCODE.R_ARROW]  = 0x4D;
Keyboard.aCharCodes[Keyboard.CHARCODE.D_ARROW]  = 0x50;
Keyboard.aCharCodes[Keyboard.CHARCODE.CTRLBREAK]= 0x46 + (Keyboard.CHARCODE.CTRL << 8);
Keyboard.aCharCodes[Keyboard.CHARCODE.CTRLALTDEL]=0x53 + (Keyboard.CHARCODE.CTRL << 8) + (Keyboard.CHARCODE.ALT << 16);

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
     * but we could certainly add a way if the need ever arose).
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
                control.onclick = function(kbd, sKey, charCode) {
                    return function onClickKeyboard(event) {
                        if (DEBUG) kbd.println(sKey + " clicked");
                        if (kbd.cpu) kbd.cpu.setFocus();
                        return !kbd.keyPressSimulate(charCode);
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
    this.cmp = cmp;
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
    this.messageDebugger("mobile keyboard support: " + (this.fMobile ? "true" : "false"));
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
    this.messageDebugger("keyboard reset", true);
    this.abScanBuffer = [0xAA];
    if (this.chipset) this.chipset.setIRR(ChipSet.IRQ.KBD, 4);
};

/**
 * setEnable(fEnable, fClock)
 * 
 * This is the ChipSet's primary interface for controlling "Model F" keyboards (ie, those used
 * with MODEL_5150 and MODEL_5160 machines)
 * 
 * @this {Keyboard}
 * @param {boolean} fEnable is true if the keyboard interface should be enabled
 * @param {boolean} fClock is true if the keyboard's simulated clock line should go "high"
 */
Keyboard.prototype.setEnable = function(fEnable, fClock)
{
    if (this.fClock !== fClock) {
        if (DEBUG) this.messageDebugger("keyboard clock changing to " + fClock, true);
        /*
         * Toggling the clock line low and then high signals a "reset", which we acknowledge when enabled
         */
        this.fClock = this.fResetOnEnable = fClock;
    }
    if (this.fEnable !== fEnable) {
        if (DEBUG) this.messageDebugger("keyboard enable changing to " + fEnable, true);
        this.fEnable = fEnable;
        if (fEnable) {
            if (this.fResetOnEnable) {
                this.resetDevice();
                this.fResetOnEnable = false;
            }
            else {
                this.shiftScanCode();
            }
        }
    }
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
    }
    return b;
};

/**
 * readScanCode(fShift)
 * 
 * This is the ChipSet's interface for reading scan codes.
 *
 * @this {Keyboard}
 * @param {boolean} [fShift]
 * @return {number} next scan code, or 0 if none
 */
Keyboard.prototype.readScanCode = function(fShift)
{
    var b = 0;
    if (this.abScanBuffer.length) {
        b = this.abScanBuffer[0];
        this.messageDebugger("scan code " + str.toHexByte(b) + " delivered");
        if (fShift) this.shiftScanCode();
    }
    return b;
};

/**
 * shiftScanCode()
 * 
 * This is the ChipSet's interface to advance scan codes.
 * 
 * @this {Keyboard}
 */
Keyboard.prototype.shiftScanCode = function()
{
    if (this.abScanBuffer.length > 0) {
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
         * saving/restoring anything, and that was OK, but if we don't at least re-initialize fClock/fEnable,
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
    return fSave && this.save ? this.save() : true;
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
     * When a key "down" is simulated on behalf of some charCode, I save
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
    this.fEnable = data[i];
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
    data[i] = this.fEnable;
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
    control.style.color = (f ? "#ffffff" : "#000000");
    control.style.backgroundColor = (f ? "#000000" : "#ffffff");
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
                if (DEBUG) this.messageDebugger("scan code " + str.toHexByte(bScan) + " redundant");
                return;
            }
            this.aScanCodesActive[bKey] = fDown;
            this.messageDebugger("scan code " + str.toHexByte(bScan) + " buffered");
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
    var msDelay = (fRepeat ? this.msReleaseRepeat : this.msReleaseDelay);
    if (this.cpu && this.cpu.mhz) msDelay /= this.cpu.mhz;
    return msDelay;
};

/**
 * autoClear(notCharCode)
 * 
 * @this {Keyboard}
 * @param {number} [notCharCode]
 */
Keyboard.prototype.autoClear = function(notCharCode)
{
    if (this.prevCharDown && (notCharCode === undefined || notCharCode != this.prevCharDown)) {
        if (DEBUG) this.messageDebugger("autoClear(" + str.toHexWord(this.prevCharDown) + ")");
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
 * @param {boolean} fDown is true if called for a keyDown event, false if called for a keyUp event
 * @return {boolean} true to pass the event along, false to consume it
 */
Keyboard.prototype.keyEvent = function(event, fDown)
{
    var fPass;
    var fAutoClear = !fDown;
    var keyCode = event.keyCode;

    if (fDown) this.prevKeyDown = keyCode;

    if (keyCode + Keyboard.CHARCODE.PSEUDO == Keyboard.CHARCODE.LSHIFT) {
        this.bitsShift &= ~Keyboard.STATE.LSHIFT;
        if (fDown) this.bitsShift |= Keyboard.STATE.LSHIFT;
        keyCode += Keyboard.CHARCODE.PSEUDO;
        fAutoClear = false;
    }
    else if (keyCode + Keyboard.CHARCODE.PSEUDO == Keyboard.CHARCODE.CTRL) {
        this.bitsShift &= ~Keyboard.STATE.CTRL;
        if (fDown) this.bitsShift |= Keyboard.STATE.CTRL;
        keyCode += Keyboard.CHARCODE.PSEUDO;
        fAutoClear = false;
    }
    else if (keyCode + Keyboard.CHARCODE.PSEUDO == Keyboard.CHARCODE.ALT) {
        this.bitsShift &= ~Keyboard.STATE.ALT;
        if (fDown) this.bitsShift |= Keyboard.STATE.ALT;
        keyCode += Keyboard.CHARCODE.PSEUDO;
        fAutoClear = false;
    }
    else if (keyCode + Keyboard.CHARCODE.PSEUDO == Keyboard.CHARCODE.CAPSLOCK) {
        /*
         * FYI, this generates a "down" event ONLY when getting locked, and an "up" event ONLY
         * when getting unlocked--which is exactly what I want, even though that may seem a little
         * counter-intuitive (since the key itself actually went down AND up for each event).
         */
        this.bitsShift &= ~Keyboard.STATE.CAPSLOCK;
        if (fDown) this.bitsShift |= Keyboard.STATE.CAPSLOCK;
        keyCode += Keyboard.CHARCODE.PSEUDO;
        fPass = this.keyPressSimulate(keyCode);
    }
    else if (keyCode == Keyboard.KEYCODE.COMMAND) {
        /*
         * Avoid interfering with useful Browser key commands, like COMMAND-Q, COMMAND-T, etc.
         */
        this.bitsShift &= ~Keyboard.STATE.COMMAND;
        if (fDown) this.bitsShift |= Keyboard.STATE.COMMAND;
        fAutoClear = false;
        fPass = true;
    }
    else if (keyCode == Keyboard.KEYCODE.TAB || keyCode == Keyboard.KEYCODE.ESC || keyCode == Keyboard.KEYCODE.DELETE) {
        /*
         * HACK for simulating Ctrl-Break using Ctrl-Del (Mac) / Ctrl-Backspace (Windows)
         */
        if (keyCode == Keyboard.KEYCODE.DELETE && (this.bitsShift & Keyboard.STATE.CTRL)) {
            keyCode = Keyboard.CHARCODE.CTRLBREAK;
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
        fPass = (fDown? !this.keyPressSimulate(keyCode) : false);
    }
    else {
        /*
         * Function keys, arrow keys, etc, should fall into the next category, independent of
         * whatever modifier keys (eg, ALT, CTRL, etc) may also be pressed.
         */
        if (Keyboard.aCharCodes[keyCode + Keyboard.CHARCODE.PSEUDO] !== undefined) {
            keyCode += Keyboard.CHARCODE.PSEUDO;
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
                keyCode += 0x20;
            }
            // this.messageDebugger("ALT event: keyCode: 0x" + str.toHexWord(keyCode));
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
        fPass = !this.keyEventSimulate(keyCode, fDown, Keyboard.SIMCODE.KEYEVENT);
    }

    if (DEBUG) this.messageDebugger(/*(fDown?"\n":"") +*/ "key" + (fDown ? "Down" : "Up") + "(" + str.toHexWord(keyCode) + "): " + (fPass ? "pass" : "consume"));
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
    /*
     * Browser-independent charCode extraction...
     */
    event = event || window.event;
    var charCode = event.which || event.keyCode;

    /*
     * Let's stop any injection currently in progress, too
     */
    this.sInjectBuffer = "";

    if (charCode == Keyboard.CHARCODE.DELETE || charCode == Keyboard.CHARCODE.TAB) {
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
            // if (event.altKey) this.messageDebugger("ALT press: charCode: 0x" + str.toHexWord(charCode));
            if (this.bitsShift & (Keyboard.STATE.CTRL | Keyboard.STATE.ALT))
                fPass = false;
            else
                fPass = !this.keyPressSimulate(charCode);
        }
    }

    if (DEBUG) this.messageDebugger("keyPress(0x" + str.toHexWord(charCode) + "): " + (fPass ? "pass" : "consume"));
    return fPass;
};

/**
 * keyPressSimulate(charCode)
 * 
 * @this {Keyboard}
 * @param {number} charCode
 * @param {boolean} [fQuickRelease] is true to simulate the press and release immediately
 * @return {boolean} true if successfully simulated, false if unrecognized/unsupported key
 */
Keyboard.prototype.keyPressSimulate = function(charCode, fQuickRelease)
{
    var fSimulated = false;

    /*
     * Auto-clear any previous down key EXCEPT for charCode (because it may be held and repeating).
     */
    this.autoClear(charCode);

    if (this.keyEventSimulate(charCode, true, Keyboard.SIMCODE.KEYPRESS)) {
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
            this.keyEventSimulate(charCode, false, Keyboard.SIMCODE.KEYRELEASE);
        }
        else {
            var fRepeat = false;
            if (this.aKeyTimers[charCode]) {
                clearTimeout(this.aKeyTimers[charCode]);
                fRepeat = true;
            }
            var msDelay = this.calcReleaseDelay(fRepeat);
            this.aKeyTimers[this.prevCharDown = charCode] = setTimeout(function (kbd) {
                return function onKeyPressSimulateTimeout() {
                    kbd.keyEventSimulate(charCode, false, Keyboard.SIMCODE.KEYTIMEOUT);
                };
            }(this), msDelay);
            if (DEBUG) this.messageDebugger("keyPressSimulate(0x" + str.toHexWord(charCode) + "): setTimeout()");
        }
        fSimulated = true;
    }
    if (DEBUG) this.messageDebugger("keyPressSimulate(0x" + str.toHexWord(charCode) + "): " + (fSimulated ? "true" : "false"));
    return fSimulated;
};

/**
 * keyEventSimulate(charCode, fDown, simCode)
 * 
 * @this {Keyboard}
 * @param {number} charCode
 * @param {boolean} fDown
 * @param {number} simCode indicates the origin of the event
 * @return {boolean} true if successfully simulated, false if unrecognized/unsupported key
 */
Keyboard.prototype.keyEventSimulate = function(charCode, fDown, simCode)
{
    var fSimulated = false;

    if (!fDown) {
        this.aKeyTimers[charCode] = null;
        if (this.prevCharDown == charCode) this.prevCharDown = 0;
    }

    var wCode = Keyboard.aCharCodes[charCode];
    if (wCode === undefined) {
        /*
         * Perhaps we're dealing with a CTRL variation of an alphabetic key; this won't
         * affect non-CTRL-key combos like CR or LF, because they're defined in aCharCodes,
         * and this bit of code relieves us from having to explicitly define every CTRL-letter
         * possibility in aCharCodes.
         *
         * TODO: Support for CTRL-anything-else (as well as ALT-anything-else) is still TBD.
         */
        if (charCode >= 0x01 && charCode <= 0x1A) {
            charCode += 0x40;
            wCode = (Keyboard.aCharCodes[charCode] & 0xff) | (Keyboard.CHARCODE.CTRL << 8);
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
        abScanCodes.push((wCode & 0xff) | (fDown ? 0 : 0x80));

        while (wCode >>= 8) {
            var bScan = 0;
            var bShiftCode = wCode & 0xff;
            if (bShiftCode == Keyboard.CHARCODE.LSHIFT) {
                if (!(this.bitsShift & (Keyboard.STATE.LSHIFT | Keyboard.STATE.CAPSLOCK))) {
                    bScan = 0x2A;
                }
            } else if (bShiftCode == Keyboard.CHARCODE.RSHIFT) {
                if (!(this.bitsShift & (Keyboard.STATE.RSHIFT | Keyboard.STATE.CAPSLOCK))) {
                    bScan = 0x36;
                }
            } else if (bShiftCode == Keyboard.CHARCODE.CTRL) {
                if (!(this.bitsShift & Keyboard.STATE.CTRL)) {
                    bScan = 0x1D;
                }
            } else if (bShiftCode == Keyboard.CHARCODE.ALT) {
                if (!(this.bitsShift & Keyboard.STATE.ALT)) {
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
    if (DEBUG && DEBUGGER) this.messageDebugger("keyEventSimulate(0x" + str.toHexWord(charCode) + "," + (fDown ? "down" : "up") + "," + Keyboard.aSimCodeDescs[simCode] + "): " + (fSimulated ? "true" : "false"));
    return fSimulated;
};

/**
 * messageDebugger(sMessage, fPort)
 *
 * This is a combination of the Debugger's messageEnabled(MESSAGE_KBD) and message() functions, for convenience.
 * 
 * @this {Keyboard}
 * @param {string} sMessage is any caller-defined message string
 * @param {boolean} [fPort] is true if the message is port-related, false if not
 */
Keyboard.prototype.messageDebugger = function(sMessage, fPort)
{
    if (DEBUGGER && this.dbg) {
        if (this.dbg.messageEnabled(this.dbg.MESSAGE_KBD | (fPort ? this.dbg.MESSAGE_PORT : 0))) {
            this.dbg.message(sMessage);
        }
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
