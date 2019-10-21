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
 * @typedef {Config} KbdIOConfig
 * @property {number} model
 */

/**
 * @class {KbdIO}
 * @unrestricted
 * @property {KbdIOConfig} config
 */
class KbdIO extends Device {
    /**
     * KbdIO(idMachine, idDevice, config)
     *
     * @this {KbdIO}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {KbdIOConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        this.time = /** @type {Time} */ (this.findDeviceByClass("Time"));
        this.ports = /** @type {Ports} */ (this.findDeviceByClass("Ports"));
        for (let port in KbdIO.LISTENERS) {
            let listeners = KbdIO.LISTENERS[port];
            this.ports.addListener(+port, listeners[0], listeners[1], this);
        }
        /*
         * Whereas KbdIO.LEDS maps bits to device ID, this.leds maps bits to the devices themselves.
         */
        this.leds = {};
        for (let bit in KbdIO.LEDS) {
            this.leds[bit] = /** @type {LED} */ (this.findDevice(KbdIO.LEDS[bit]));
        }
        this.input = /** @type {Input} */ (this.findDeviceByClass("Input"));
        this.input.addKeyMap(this, KbdIO.KEYMAP, KbdIO.BINDINGMAP);
        this.onReset();
    }

    /**
     * onPower(on)
     *
     * Called by the Machine device to provide notification of a power event.
     *
     * @this {KbdIO}
     * @param {boolean} on
     */
    onPower(on)
    {
        if (!this.cpu) {
            this.cpu = /** @type {CPU} */ (this.findDeviceByClass("CPU"));
        } else {
            this.updateLEDs(on? this.bStatus : undefined);
        }
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {KbdIO}
     */
    onReset()
    {
        this.bStatus = KbdIO.STATUS.INIT;
        this.bAddress = KbdIO.ADDRESS.INIT;
        this.fUARTBusy = false;
        this.nUARTSnap = 0;
        this.iKeyNext = -1;
        this.updateLEDs();
    }

    /**
     * isTransmitterReady()
     *
     * Called whenever the VT100 Chips device needs the KbdIO UART transmitter status.
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
     *      3) Call the Chips device getLBA(4) function for the state of the simulated LBA4, and count 160 LBA4
     *      transitions; however, that would be the worst solution, because there's no guarantee that the firmware's
     *      UART polling will occur regularly and/or frequently enough for us to catch every LBA4 transition.
     *
     * I'm going with solution #1 because it's less overhead.
     *
     * @this {KbdIO}
     * @return {boolean} (true if ready, false if not)
     */
    isTransmitterReady()
    {
        if (this.fUARTBusy) {
            if (this.time.getCycles() >= this.nUARTSnap) {
                this.fUARTBusy = false;
            }
        }
        return !this.fUARTBusy;
    }

    /**
     * inUARTAddress(port)
     *
     * We take our cue from iKeyNext.  If it's -1 (default), we simply return the last value latched
     * in bAddress.  Otherwise, we call getActiveKey() to request the next mapped key value, latch it,
     * and increment iKeyNext.  Failing that, we latch ADDRESS.KEYLAST and reset iKeyNext to -1.
     *
     * @this {KbdIO}
     * @param {number} port (0x82)
     * @return {number} simulated port value
     */
    inUARTAddress(port)
    {
        let value = this.bAddress;
        if (this.iKeyNext >= 0) {
            let value = this.input.getActiveKey(this.iKeyNext);
            if (value >= 0) {
                this.iKeyNext++;
                if (value & 0x80) {
                    /*
                     * TODO: This code is supposed to be accompanied by a SHIFT key; make sure that it is.
                     */
                    value &= 0x7F;
                }
            } else {
                this.iKeyNext = -1;
                value = KbdIO.ADDRESS.KEYLAST;
            }
            this.bAddress = value;
            this.cpu.requestINTR(1);
        }
        this.printf(MESSAGE.KBD + MESSAGE.PORTS, "inUARTAddress(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * outUARTStatus(port, value)
     *
     * @this {KbdIO}
     * @param {number} port (0x82)
     * @param {number} value
     */
    outUARTStatus(port, value)
    {
        this.printf(MESSAGE.KBD + MESSAGE.PORTS, "outUARTStatus(%#04x): %#04x\n", port, value);
        this.updateLEDs(value, this.bStatus);
        this.bStatus = value;
        this.fUARTBusy = true;
        /*
         * Set nUARTSnap to the number of cycles required before clearing fUARTBusy; see isTransmitterReady().
         *
         * NOTE: getCyclesPerMS(1.2731488) should work out to 3520 cycles for a CPU clocked at 361.69ns per cycle,
         * which is roughly 2.76Mhz.  We could just hard-code 3520 instead of calling getCyclesPerMS(), but this helps
         * maintain a reasonable blink rate for the cursor even when the user cranks up the CPU speed.
         */
        this.nUARTSnap = this.time.getCycles() + this.time.getCyclesPerMS(1.2731488);
        if (value & KbdIO.STATUS.START) {
            this.iKeyNext = 0;
            this.cpu.requestINTR(1);
        }
    }

    /**
     * updateLEDs(value, previous)
     *
     * @this {KbdIO}
     * @param {number} [value] (if not provided, all LEDS are turned off)
     * @param {number} [previous] (if not provided, all LEDs are updated)
     */
    updateLEDs(value, previous)
    {
        for (let id in this.leds) {
            let led = this.leds[id];
            if (!led) continue;
            let bit = +id, on, changed = 1, redraw = 1;
            if (value != undefined) {
                if (!(bit & (bit - 1))) {       // if a single bit is set, this will be zero
                    on = value & bit;           // and "on" will be true if that single bit is set
                } else {
                    bit = ~bit & 0xff;          // otherwise, we assume that a single bit is clear
                    on = !(value & bit);        // so "on" will be true if that same single bit is clear
                }
                if (previous != undefined) {
                    changed = (value ^ previous) & bit;
                    redraw = 0;
                }
            }
            if (changed) {                      // call setLEDState() only if the bit changed
                led.setLEDState(0, 0, on? LED.STATE.ON : LED.STATE.OFF);
                if (redraw) led.drawBuffer();
            }
        }
    }

    /**
     * loadState(state)
     *
     * Memory and Ports states are managed by the Bus onLoad() handler, which calls our loadState() handler.
     *
     * @this {KbdIO}
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
     * @this {KbdIO}
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
KbdIO.ADDRESS = {
    PORT:       0x82,
    INIT:       0x7F,
    KEYLAST:    0x7F                // special end-of-scan key address (all valid key addresses are < KEYLAST)
};

/*
 * Writing port 0x82 updates the VT100's keyboard status byte via the keyboard's UART data input.
 */
KbdIO.STATUS = {
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
 * Definitions of all VT100 keys (7-bit values representing key positions on the VT100).  We call these
 * VT100 key values KEYNUMs, to avoid confusion with browser KEYCODEs.  They are be used in a subsequent
 * KEYMAP table.
 */
KbdIO.KEYNUM = {
    DEL:        0x03,
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
    BS:         0x33,
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
 * Virtual KEYCODE definitions.
 *
 * A virtual keyCode is one that is (hopefully) outside the range of all browser keyCodes.  It refers
 * to a key (or key combination) that has no analog on a modern keyboard and/or that we need to associate
 * with an on-screen control.
 *
 * A good example is the VT100 SET-UP key, which has no counterpart on a modern keyboard.
 */
KbdIO.KEYCODE = {
    SETUP:      WebIO.KEYCODE.VIRTUAL + 1
};

/*
 * Maps browser keyCode (and any virtual keyCode) to VT100 KEYNUM.
 *
 * NOTE: The VT100 keyboard has both BACKSPACE and DELETE keys, whereas modern keyboards generally only
 * have DELETE.  And sadly, when you press DELETE, your modern keyboard and/or modern browser is reporting
 * it as keyCode 8: the code for BACKSPACE, aka CTRL-H.  You have to press a modified DELETE key to get
 * the actual DELETE keyCode of 127.
 *
 * We resolve this below by mapping KEYCODE.BS (8) to VT100 KEYNUM.DEL (0x03) and KEYCODE.DEL (127)
 * to VT100 KEYNUM.BS (0x33).  So, DELETE is BACKSPACE and BACKSPACE is DELETE.  Fortunately, this
 * confusion is all internal, because your physical key is (or should be) labeled DELETE, so the fact that
 * the browser is converting it to BACKSPACE and that we're converting BACKSPACE back into DELETE is
 * something most people don't need to worry their heads about.
 */
KbdIO.KEYMAP = {
    [WebIO.KEYCODE.BS]:         KbdIO.KEYNUM.DEL,
    [WebIO.KEYCODE.P]:          KbdIO.KEYNUM.P,
    [WebIO.KEYCODE.O]:          KbdIO.KEYNUM.O,
    [WebIO.KEYCODE.Y]:          KbdIO.KEYNUM.Y,
    [WebIO.KEYCODE.T]:          KbdIO.KEYNUM.T,
    [WebIO.KEYCODE.W]:          KbdIO.KEYNUM.W,
    [WebIO.KEYCODE.Q]:          KbdIO.KEYNUM.Q,
    [WebIO.KEYCODE.RIGHT]:      KbdIO.KEYNUM.RIGHT,
    [WebIO.KEYCODE.RBRACK]:     KbdIO.KEYNUM.RBRACK,
    [WebIO.KEYCODE.LBRACK]:     KbdIO.KEYNUM.LBRACK,
    [WebIO.KEYCODE.I]:          KbdIO.KEYNUM.I,
    [WebIO.KEYCODE.U]:          KbdIO.KEYNUM.U,
    [WebIO.KEYCODE.R]:          KbdIO.KEYNUM.R,
    [WebIO.KEYCODE.E]:          KbdIO.KEYNUM.E,
    [WebIO.KEYCODE.ONE]:        KbdIO.KEYNUM.ONE,
    [WebIO.KEYCODE.LEFT]:       KbdIO.KEYNUM.LEFT,
    [WebIO.KEYCODE.DOWN]:       KbdIO.KEYNUM.DOWN,
    [WebIO.KEYCODE.F6]:         KbdIO.KEYNUM.BREAK,         // no natural mapping
    [WebIO.KEYCODE.BQUOTE]:     KbdIO.KEYNUM.BQUOTE,
    [WebIO.KEYCODE.DASH]:       KbdIO.KEYNUM.DASH,
    [WebIO.KEYCODE.NINE]:       KbdIO.KEYNUM.NINE,
    [WebIO.KEYCODE.SEVEN]:      KbdIO.KEYNUM.SEVEN,
    [WebIO.KEYCODE.FOUR]:       KbdIO.KEYNUM.FOUR,
    [WebIO.KEYCODE.THREE]:      KbdIO.KEYNUM.THREE,
    [WebIO.KEYCODE.ESC]:        KbdIO.KEYNUM.ESC,
    [WebIO.KEYCODE.UP]:         KbdIO.KEYNUM.UP,
    [WebIO.KEYCODE.F3]:         KbdIO.KEYNUM.F3,
    [WebIO.KEYCODE.F1]:         KbdIO.KEYNUM.F1,
    [WebIO.KEYCODE.DEL]:        KbdIO.KEYNUM.BS,
    [WebIO.KEYCODE.EQUALS]:     KbdIO.KEYNUM.EQUALS,
    [WebIO.KEYCODE.ZERO]:       KbdIO.KEYNUM.ZERO,
    [WebIO.KEYCODE.EIGHT]:      KbdIO.KEYNUM.EIGHT,
    [WebIO.KEYCODE.SIX]:        KbdIO.KEYNUM.SIX,
    [WebIO.KEYCODE.FIVE]:       KbdIO.KEYNUM.FIVE,
    [WebIO.KEYCODE.TWO]:        KbdIO.KEYNUM.TWO,
    [WebIO.KEYCODE.TAB]:        KbdIO.KEYNUM.TAB,
    [WebIO.KEYCODE.NUM_7]:      KbdIO.KEYNUM.NUM_7,
    [WebIO.KEYCODE.F4]:         KbdIO.KEYNUM.F4,
    [WebIO.KEYCODE.F2]:         KbdIO.KEYNUM.F2,
    [WebIO.KEYCODE.NUM_0]:      KbdIO.KEYNUM.NUM_0,
    [WebIO.KEYCODE.F7]:         KbdIO.KEYNUM.LF,            // no natural mapping
    [WebIO.KEYCODE.BSLASH]:     KbdIO.KEYNUM.BSLASH,
    [WebIO.KEYCODE.L]:          KbdIO.KEYNUM.L,
    [WebIO.KEYCODE.K]:          KbdIO.KEYNUM.K,
    [WebIO.KEYCODE.G]:          KbdIO.KEYNUM.G,
    [WebIO.KEYCODE.F]:          KbdIO.KEYNUM.F,
    [WebIO.KEYCODE.A]:          KbdIO.KEYNUM.A,
    [WebIO.KEYCODE.NUM_8]:      KbdIO.KEYNUM.NUM_8,
    [WebIO.KEYCODE.CR]:         KbdIO.KEYNUM.NUM_CR,
    [WebIO.KEYCODE.NUM_2]:      KbdIO.KEYNUM.NUM_2,
    [WebIO.KEYCODE.NUM_1]:      KbdIO.KEYNUM.NUM_1,
    [WebIO.KEYCODE.QUOTE]:      KbdIO.KEYNUM.QUOTE,
    [WebIO.KEYCODE.SEMI]:       KbdIO.KEYNUM.SEMI,
    [WebIO.KEYCODE.J]:          KbdIO.KEYNUM.J,
    [WebIO.KEYCODE.H]:          KbdIO.KEYNUM.H,
    [WebIO.KEYCODE.D]:          KbdIO.KEYNUM.D,
    [WebIO.KEYCODE.S]:          KbdIO.KEYNUM.S,
    [WebIO.KEYCODE.NUM_DEL]:    KbdIO.KEYNUM.NUM_DEL,
    [WebIO.KEYCODE.F5]:         KbdIO.KEYNUM.NUM_COMMA,     // no natural mapping
    [WebIO.KEYCODE.NUM_5]:      KbdIO.KEYNUM.NUM_5,
    [WebIO.KEYCODE.NUM_4]:      KbdIO.KEYNUM.NUM_4,
    [WebIO.KEYCODE.CR]:         KbdIO.KEYNUM.CR,
    [WebIO.KEYCODE.PERIOD]:     KbdIO.KEYNUM.PERIOD,
    [WebIO.KEYCODE.COMMA]:      KbdIO.KEYNUM.COMMA,
    [WebIO.KEYCODE.N]:          KbdIO.KEYNUM.N,
    [WebIO.KEYCODE.B]:          KbdIO.KEYNUM.B,
    [WebIO.KEYCODE.X]:          KbdIO.KEYNUM.X,
    [WebIO.KEYCODE.F8]:         KbdIO.KEYNUM.NO_SCROLL,     // no natural mapping
    [WebIO.KEYCODE.NUM_9]:      KbdIO.KEYNUM.NUM_9,
    [WebIO.KEYCODE.NUM_3]:      KbdIO.KEYNUM.NUM_3,
    [WebIO.KEYCODE.NUM_6]:      KbdIO.KEYNUM.NUM_6,
    [WebIO.KEYCODE.NUM_SUB]:    KbdIO.KEYNUM.NUM_SUB,
    [WebIO.KEYCODE.SLASH]:      KbdIO.KEYNUM.SLASH,
    [WebIO.KEYCODE.M]:          KbdIO.KEYNUM.M,
    [WebIO.KEYCODE.SPACE]:      KbdIO.KEYNUM.SPACE,
    [WebIO.KEYCODE.V]:          KbdIO.KEYNUM.V,
    [WebIO.KEYCODE.C]:          KbdIO.KEYNUM.C,
    [WebIO.KEYCODE.Z]:          KbdIO.KEYNUM.Z,
    [WebIO.KEYCODE.F9]:         KbdIO.KEYNUM.SETUP,         // no natural mapping
    [KbdIO.KEYCODE.SETUP]:      KbdIO.KEYNUM.SETUP,         // NOTE: virtual keyCode mapping
    [WebIO.KEYCODE.CTRL]:       KbdIO.KEYNUM.CTRL,
    [WebIO.KEYCODE.SHIFT]:      KbdIO.KEYNUM.SHIFT,
    [WebIO.KEYCODE.CAPS_LOCK]:  KbdIO.KEYNUM.CAPS_LOCK
};

/*
 * Maps bindings to browser (WebIO) or virtual (KbdIO) keyCode.
 */
KbdIO.BINDINGMAP = {
    "keySetup":                 KbdIO.KEYCODE.SETUP         // NOTE: virtual keyCode mapping
};

KbdIO.LEDS = {
    0x01:   "led4",
    0x02:   "led3",
    0x04:   "led2",
    0x08:   "led1",
    0x10:   "ledLocked",
    0x20:   "ledLocal",
    0xDF:   "ledOnline"
};

KbdIO.LISTENERS = {
    0x82:   [KbdIO.prototype.inUARTAddress, KbdIO.prototype.outUARTStatus]
};

Defs.CLASSES["KbdIO"] = KbdIO;
