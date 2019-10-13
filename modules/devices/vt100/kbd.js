/**
 * @fileoverview Implements VT100 Keyboard hardware
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2019 Jeff Parsons
 *
 * This file is part of PCjs, a computer emulation software project at <https://www.pcjs.org>.
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
 * <https://www.pcjs.org/modules/devices/machine.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * @typedef {Config} KeyboardConfig
 * @property {number} model
 */

/**
 * @class {Keyboard}
 * @unrestricted
 * @property {KeyboardConfig} config
 */
class Keyboard extends Device {
    /**
     * Keyboard(idMachine, idDevice, config)
     *
     * @this {Keyboard}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {KeyboardConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        this.time = /** @type {Time} */ (this.findDeviceByClass("Time"));
        this.ports = /** @type {Ports} */ (this.findDeviceByClass("Ports"));
        for (let port in Keyboard.LISTENERS) {
            let listeners = Keyboard.LISTENERS[port];
            this.ports.addListener(+port, listeners[0], listeners[1], this);
        }
        /*
         * Whereas Keyboard.LEDS maps bits to device ID, this.leds maps bits to device *objects*.
         */
        this.leds = {};
        for (let bit in Keyboard.LEDS) {
            this.leds[bit] = /** @type {LED} */ (this.findDevice(Keyboard.LEDS[bit]));
        }
        this.input = /** @type {Input} */ (this.findDeviceByClass("Input"));
        this.input.addKeyMap(Keyboard.KEYMAP);
        this.onReset();
    }

    /**
     * onPower()
     *
     * Called by the Machine device to provide notification of a power event.
     *
     * @this {Keyboard}
     */
    onPower()
    {
        if (!this.cpu) {
            this.cpu = /** @type {CPU} */ (this.findDeviceByClass("CPU"));
        }
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {Keyboard}
     */
    onReset()
    {
        this.bStatus = Keyboard.STATUS.INIT;
        this.bAddress = Keyboard.ADDRESS.INIT;
        this.fUARTBusy = false;
        this.nUARTSnap = 0;
        this.iKeyNext = -1;
    }

    /**
     * inUARTAddress(port)
     *
     * We take our cue from iKeyNext.  If it's -1 (default), we simply return the last value latched
     * in bAddress.  Otherwise, we call getActiveKey() to request the next mapped key value, latch it,
     * and increment iKeyNext.  Failing that, we latch ADDRESS.KEYLAST and reset iKeyNext to -1.
     *
     * @this {Keyboard}
     * @param {number} port (0x82)
     * @return {number} simulated port value
     */
    inUARTAddress(port)
    {
        let value = this.bAddress;
        if (this.iKeyNext >= 0) {
            let value = this.input.getActiveKey(this.iKeyNext, true);
            if (value) {
                this.iKeyNext++;
                if (value & 0x80) {
                    /*
                     * TODO: This code is supposed to be accompanied by a SHIFT key; make sure that it is.
                     */
                    value &= 0x7F;
                }
            } else {
                this.iKeyNext = -1;
                value = Keyboard.ADDRESS.KEYLAST;
            }
            this.bAddress = value;
            this.cpu.requestINTR(1);
        }
        this.printf(MESSAGE.PORTS, "inUARTAddress(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * outUARTStatus(port, value)
     *
     * @this {Keyboard}
     * @param {number} port (0x82)
     * @param {number} value
     */
    outUARTStatus(port, value)
    {
        this.printf(MESSAGE.PORTS, "outUARTStatus(%#04x): %#04x\n", port, value);
        this.updateLEDs(value, this.bStatus);
        this.bStatus = value;
        this.fUARTBusy = true;
        this.nUARTSnap = this.time.getCycles();
        if (value & Keyboard.STATUS.START) {
            this.iKeyNext = 0;
            this.cpu.requestINTR(1);
        }
    }

    /**
     * updateLEDs(value, previous)
     *
     * @this {Keyboard}
     * @param {number} value
     * @param {number} previous
     */
    updateLEDs(value, previous)
    {
        let delta = value ^ previous;
        for (let bit in this.leds) {
            let led = this.leds[bit];
            if (!led) continue;
            if (delta & bit) {
                led.setLEDState(0, 0, (value & bit)? LED.STATE.ON : LED.STATE.OFF);
            }
        }
    }

    /**
     * loadState(state)
     *
     * Memory and Ports states are managed by the Bus onLoad() handler, which calls our loadState() handler.
     *
     * @this {Keyboard}
     * @param {Array} state
     * @return {boolean}
     */
    loadState(state)
    {
        let idDevice = state.shift();
        if (this.idDevice == idDevice) {
            this.bStatus = state.shift();
            this.bAddress = state.shift();
            this.fUARTBusy = state.shift();
            this.nUARTSnap = state.shift();
            return true;
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * Memory and Ports states are managed by the Bus onSave() handler, which calls our saveState() handler.
     *
     * @this {Keyboard}
     * @param {Array} state
     */
    saveState(state)
    {
        state.push(this.idDevice);
        state.push(this.bStatus);
        state.push(this.bAddress);
        state.push(this.fUARTBusy);
        state.push(this.nUARTSnap);
    }
}

/*
 * Reading port 0x82 returns a key address from the VT100 keyboard's UART data output.
 *
 * Every time a keyboard scan is initiated (by setting the START bit of the status byte),
 * our internal address index (iKeyNext) is set to zero, and an interrupt is generated for
 * each entry in the aKeysActive array, along with a final interrupt for KEYLAST.
 */
Keyboard.ADDRESS = {
    PORT:       0x82,
    INIT:       0x7F,
    KEYLAST:    0x7F                // special end-of-scan key address (all valid key addresses are < KEYLAST)
};

/*
 * Writing port 0x82 updates the VT100's keyboard status byte via the keyboard's UART data input.
 */
Keyboard.STATUS = {
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
};

/*
 * Definitions of all VT100 keys (7-bit values representing key positions on the VT100).  These will be
 * used in a subsequent KEYMAP table.
 *
 * NOTE: The VT100 keyboard has both BACKSPACE and DELETE keys, whereas modern keyboards generally only
 * have DELETE.  And sadly, when you press DELETE, your modern keyboard and/or modern browser is reporting
 * it as keyCode 8: the code for BACKSPACE, aka CTRL-H.  You have to press a modified DELETE key to get
 * the actual DELETE keyCode of 127.
 *
 * We resolve this below by mapping KEYCODE.BS (8) to VT100 keyCode DELETE (0x03) and KEYCODE.DEL (127)
 * to VT100 keyCode BACKSPACE (0x33).  So, DELETE is BACKSPACE and BACKSPACE is DELETE.  Fortunately, this
 * confusion is all internal, because your physical key is (or should be) labeled DELETE, so the fact that
 * the browser is converting it to BACKSPACE and that we're converting BACKSPACE back into DELETE is
 * something most people don't need to worry their heads about.
 */
Keyboard.KEYCODE = {
    BS:         0x03,
    P:          0x05,
    O:          0x06,
    Y:          0x07,
    T:          0x08,
    W:          0x09,
    Q:          0x0A,
    RIGHT:      0x10,
    RBRACK:     0x14,
    LBRACK:     0x15,
    I:          0x16,
    U:          0x17,
    R:          0x18,
    E:          0x19,
    ONE:        0x1A,
    LEFT:       0x20,
    DOWN:       0x22,
    BREAK:      0x23,   // aka BREAK
    BQUOTE:     0x24,
    DASH:       0x25,
    NINE:       0x26,
    SEVEN:      0x27,
    FOUR:       0x28,
    THREE:      0x29,
    ESC:        0x2A,
    UP:         0x30,
    F3:         0x31,   // aka PF3
    F1:         0x32,   // aka PF1
    DEL:        0x33,
    EQUALS:     0x34,
    ZERO:       0x35,
    EIGHT:      0x36,
    SIX:        0x37,
    FIVE:       0x38,
    TWO:        0x39,
    TAB:        0x3A,
    NUM_7:      0x40,
    F4:         0x41,   // aka PF4
    F2:         0x42,   // aka PF2
    NUM_0:      0x43,
    LF:         0x44,   // aka LINE-FEED
    BSLASH:     0x45,
    L:          0x46,
    K:          0x47,
    G:          0x48,
    F:          0x49,
    A:          0x4A,
    NUM_8:      0x50,
    NUM_CR:     0x51,
    NUM_2:      0x52,
    NUM_1:      0x53,
    QUOTE:      0x55,
    SEMI:       0x56,
    J:          0x57,
    H:          0x58,
    D:          0x59,
    S:          0x5A,
    NUM_DEL:    0x60,   // aka KEYPAD PERIOD
    NUM_COMMA:  0x61,   // aka KEYPAD COMMA
    NUM_5:      0x62,
    NUM_4:      0x63,
    CR:         0x64,   // TODO: Figure out why the Technical Manual lists CR at both 0x04 and 0x64
    PERIOD:     0x65,
    COMMA:      0x66,
    N:          0x67,
    B:          0x68,
    X:          0x69,
    NO_SCROLL:  0x6A,   // aka NO-SCROLL
    NUM_9:      0x70,
    NUM_3:      0x71,
    NUM_6:      0x72,
    NUM_SUB:    0x73,   // aka KEYPAD MINUS
    SLASH:      0x75,
    M:          0x76,
    SPACE:      0x77,
    V:          0x78,
    C:          0x79,
    Z:          0x7A,
    SETUP:      0x7B,   // aka SET-UP
    CTRL:       0x7C,
    SHIFT:      0x7D,   // either shift key (doesn't matter)
    CAPS_LOCK:  0x7E
};

/*
 * Maps browser keyCodes to VT100 KEYCODE.
 */
Keyboard.KEYMAP = {
    [WebIO.KEYCODE.BS]:         Keyboard.KEYCODE.BS,
    [WebIO.KEYCODE.P]:          Keyboard.KEYCODE.P,
    [WebIO.KEYCODE.O]:          Keyboard.KEYCODE.O,
    [WebIO.KEYCODE.Y]:          Keyboard.KEYCODE.Y,
    [WebIO.KEYCODE.T]:          Keyboard.KEYCODE.T,
    [WebIO.KEYCODE.W]:          Keyboard.KEYCODE.W,
    [WebIO.KEYCODE.Q]:          Keyboard.KEYCODE.Q,
    [WebIO.KEYCODE.RIGHT]:      Keyboard.KEYCODE.RIGHT,
    [WebIO.KEYCODE.RBRACK]:     Keyboard.KEYCODE.RBRACK,
    [WebIO.KEYCODE.LBRACK]:     Keyboard.KEYCODE.LBRACK,
    [WebIO.KEYCODE.I]:          Keyboard.KEYCODE.I,
    [WebIO.KEYCODE.U]:          Keyboard.KEYCODE.U,
    [WebIO.KEYCODE.R]:          Keyboard.KEYCODE.R,
    [WebIO.KEYCODE.E]:          Keyboard.KEYCODE.E,
    [WebIO.KEYCODE.ONE]:        Keyboard.KEYCODE.ONE,
    [WebIO.KEYCODE.LEFT]:       Keyboard.KEYCODE.LEFT,
    [WebIO.KEYCODE.DOWN]:       Keyboard.KEYCODE.DOWN,
    [WebIO.KEYCODE.F6]:         Keyboard.KEYCODE.BREAK, // no natural mapping
    [WebIO.KEYCODE.BQUOTE]:     Keyboard.KEYCODE.BQUOTE,
    [WebIO.KEYCODE.DASH]:       Keyboard.KEYCODE.DASH,
    [WebIO.KEYCODE.NINE]:       Keyboard.KEYCODE.NINE,
    [WebIO.KEYCODE.SEVEN]:      Keyboard.KEYCODE.SEVEN,
    [WebIO.KEYCODE.FOUR]:       Keyboard.KEYCODE.FOUR,
    [WebIO.KEYCODE.THREE]:      Keyboard.KEYCODE.THREE,
    [WebIO.KEYCODE.ESC]:        Keyboard.KEYCODE.ESC,
    [WebIO.KEYCODE.UP]:         Keyboard.KEYCODE.UP,
    [WebIO.KEYCODE.F3]:         Keyboard.KEYCODE.F3,
    [WebIO.KEYCODE.F1]:         Keyboard.KEYCODE.F1,
    [WebIO.KEYCODE.DEL]:        Keyboard.KEYCODE.DEL,
    [WebIO.KEYCODE.EQUALS]:     Keyboard.KEYCODE.EQUALS,
    [WebIO.KEYCODE.ZERO]:       Keyboard.KEYCODE.ZERO,
    [WebIO.KEYCODE.EIGHT]:      Keyboard.KEYCODE.EIGHT,
    [WebIO.KEYCODE.SIX]:        Keyboard.KEYCODE.SIX,
    [WebIO.KEYCODE.FIVE]:       Keyboard.KEYCODE.FIVE,
    [WebIO.KEYCODE.TWO]:        Keyboard.KEYCODE.TWO,
    [WebIO.KEYCODE.TAB]:        Keyboard.KEYCODE.TAB,
    [WebIO.KEYCODE.NUM_7]:      Keyboard.KEYCODE.NUM_7,
    [WebIO.KEYCODE.F4]:         Keyboard.KEYCODE.F4,
    [WebIO.KEYCODE.F2]:         Keyboard.KEYCODE.F2,
    [WebIO.KEYCODE.NUM_0]:      Keyboard.KEYCODE.NUM_0,
    [WebIO.KEYCODE.F7]:         Keyboard.KEYCODE.LF,        // no natural mapping
    [WebIO.KEYCODE.BSLASH]:     Keyboard.KEYCODE.BSLASH,
    [WebIO.KEYCODE.L]:          Keyboard.KEYCODE.L,
    [WebIO.KEYCODE.K]:          Keyboard.KEYCODE.K,
    [WebIO.KEYCODE.G]:          Keyboard.KEYCODE.G,
    [WebIO.KEYCODE.F]:          Keyboard.KEYCODE.F,
    [WebIO.KEYCODE.A]:          Keyboard.KEYCODE.A,
    [WebIO.KEYCODE.NUM_8]:      Keyboard.KEYCODE.NUM_8,
    [WebIO.KEYCODE.CR]:         Keyboard.KEYCODE.NUM_CR,
    [WebIO.KEYCODE.NUM_2]:      Keyboard.KEYCODE.NUM_2,
    [WebIO.KEYCODE.NUM_1]:      Keyboard.KEYCODE.NUM_1,
    [WebIO.KEYCODE.QUOTE]:      Keyboard.KEYCODE.QUOTE,
    [WebIO.KEYCODE.SEMI]:       Keyboard.KEYCODE.SEMI,
    [WebIO.KEYCODE.J]:          Keyboard.KEYCODE.J,
    [WebIO.KEYCODE.H]:          Keyboard.KEYCODE.H,
    [WebIO.KEYCODE.D]:          Keyboard.KEYCODE.D,
    [WebIO.KEYCODE.S]:          Keyboard.KEYCODE.S,
    [WebIO.KEYCODE.NUM_DEL]:    Keyboard.KEYCODE.NUM_DEL,
    [WebIO.KEYCODE.F5]:         Keyboard.KEYCODE.NUM_COMMA, // no natural mapping
    [WebIO.KEYCODE.NUM_5]:      Keyboard.KEYCODE.NUM_5,
    [WebIO.KEYCODE.NUM_4]:      Keyboard.KEYCODE.NUM_4,
    [WebIO.KEYCODE.CR]:         Keyboard.KEYCODE.CR,
    [WebIO.KEYCODE.PERIOD]:     Keyboard.KEYCODE.PERIOD,
    [WebIO.KEYCODE.COMMA]:      Keyboard.KEYCODE.COMMA,
    [WebIO.KEYCODE.N]:          Keyboard.KEYCODE.N,
    [WebIO.KEYCODE.B]:          Keyboard.KEYCODE.B,
    [WebIO.KEYCODE.X]:          Keyboard.KEYCODE.X,
    [WebIO.KEYCODE.F8]:         Keyboard.KEYCODE.NO_SCROLL, // no natural mapping
    [WebIO.KEYCODE.NUM_9]:      Keyboard.KEYCODE.NUM_9,
    [WebIO.KEYCODE.NUM_3]:      Keyboard.KEYCODE.NUM_3,
    [WebIO.KEYCODE.NUM_6]:      Keyboard.KEYCODE.NUM_6,
    [WebIO.KEYCODE.NUM_SUB]:    Keyboard.KEYCODE.NUM_SUB,
    [WebIO.KEYCODE.SLASH]:      Keyboard.KEYCODE.SLASH,
    [WebIO.KEYCODE.M]:          Keyboard.KEYCODE.M,
    [WebIO.KEYCODE.SPACE]:      Keyboard.KEYCODE.SPACE,
    [WebIO.KEYCODE.V]:          Keyboard.KEYCODE.V,
    [WebIO.KEYCODE.C]:          Keyboard.KEYCODE.C,
    [WebIO.KEYCODE.Z]:          Keyboard.KEYCODE.Z,
    [WebIO.KEYCODE.F9]:         Keyboard.KEYCODE.SETUP,     // no natural mapping
    [WebIO.KEYCODE.CTRL]:       Keyboard.KEYCODE.CTRL,
    [WebIO.KEYCODE.SHIFT]:      Keyboard.KEYCODE.SHIFT,
    [WebIO.KEYCODE.CAPS_LOCK]:  Keyboard.KEYCODE.CAPS_LOCK
};

Keyboard.LEDS = {
    0x01:   "led4",
    0x02:   "led3",
    0x04:   "led2",
    0x08:   "led1",
    0x10:   "ledLocked",
    0x20:   "ledLocal"
};

Keyboard.LISTENERS = {
    0x82:   [Keyboard.prototype.inUARTAddress, Keyboard.prototype.outUARTStatus]
};

Defs.CLASSES["Keyboard"] = Keyboard;
