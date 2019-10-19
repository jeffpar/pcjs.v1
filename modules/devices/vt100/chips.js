/**
 * @fileoverview Implements VT100 I/O ports
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
 * @class {Chips}
 * @unrestricted
 */
class Chips extends Device {
    /**
     * Chips(idMachine, idDevice, config)
     *
     * @this {Chips}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        this.time = /** @type {Time} */ (this.findDeviceByClass("Time"));
        this.ports = /** @type {Ports} */ (this.findDeviceByClass("Ports"));
        for (let port in Chips.LISTENERS) {
            let listeners = Chips.LISTENERS[port];
            this.ports.addListener(+port, listeners[0], listeners[1], this);
        }
        this.dbg = undefined;
        this.onReset();
    }

    /**
     * onPower()
     *
     * Called by the Machine device to provide notification of a power event.
     *
     * @this {Chips}
     */
    onPower()
    {
        /*
         * This is also a good time to get access to the Debugger, if any, and add our dump extensions.
         */
        if (this.dbg === undefined) {
            this.dbg = /* @type {Debugger} */ (this.findDeviceByClass("Debugger", false));
            if (this.dbg) this.dbg.addDumper(this, "nvr", "dump non-volatile ram", this.dumpNVR);
        }
    }

    /**
     * onReset()
     *
     * Called by the Machine device to provide notification of a reset event.
     *
     * @this {Chips}
     */
    onReset()
    {
        this.bBrightness    = Chips.BRIGHTNESS.INIT;
        this.bFlags         = Chips.FLAGS.NO_AVO | Chips.FLAGS.NO_GFX;
        this.bDC011Cols     = Chips.DC011.INITCOLS;
        this.bDC011Rate     = Chips.DC011.INITRATE;
        this.bDC012Scroll   = Chips.DC012.INITSCROLL;
        this.bDC012Blink    = Chips.DC012.INITBLINK;
        this.bDC012Reverse  = Chips.DC012.INITREVERSE;
        this.bDC012Attr     = Chips.DC012.INITATTR;
        this.dNVRAddr       = 0;
        this.wNVRData       = 0;
        this.bNVRLatch      = 0;
        this.bNVROut        = 0;
       /*
        * The following array contains the data we use to initialize all (100) words of NVR (Non-Volatile RAM).
        *
        * I used to initialize every word to 0x3ff, as if the NVR had been freshly erased, but that causes the
        * firmware to (attempt to) beep and then display an error code (2).  As the DEC Technical Manual says:
        *
        *      If the NVR fails, the bell sounds several times to inform the operator, and then default settings
        *      stored in the ROM allow the terminal to work.
        *
        * but I think what they meant to say is that default settings are stored in the RAM copy of NVR.  So then
        * I went into SET-UP, pressed SHIFT-S to save those settings back to NVR, and then used the PC8080 debugger
        * "d nvr" command to dump the NVR contents.  The results are below.
        *
        * The first dump actually contains only two modifications to the factory defaults: enabling ONLINE instead
        * of LOCAL operation, and turning ANSI support ON.  The second dump is unmodified (the TRUE factory defaults).
        *
        * By making selective changes, you can discern where the bits for certain features are stored.  For example,
        * smooth-scrolling is apparently controlled by bit 7 of the word at offset 0x2B (and is ON by default in
        * the factory settings).  And it's likely that the word at offset 0x32 (ie, the last word that's not zero)
        * is the NVR checksum.
        *
        * The TRUE factory defaults are here for reference:
        *
        *   0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80,
        *   0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80,
        *   0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80,
        *   0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E00,
        *   0x2E08, 0x2E8E, 0x2E20, 0x2ED0, 0x2E50, 0x2E00, 0x2E20, 0x2E00, 0x2EE0, 0x2EE0,
        *   0x2E69, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
        *   0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
        *   0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
        *   0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
        *   0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000
        */
       this.aNVRWords = [
           0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80,
           0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80,
           0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80,
           0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E00,
           0x2E08, 0x2E8E, 0x2E00, 0x2ED0, 0x2E70, 0x2E00, 0x2E20, 0x2E00, 0x2EE0, 0x2EE0,
           0x2E7D, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
           0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
           0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
           0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
           0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000
        ];
    }

    /**
     * getLBA(iBit)
     *
     * Returns the state of the requested (simulated) LBA bit.
     *
     * NOTE: This is currently only used to obtain LBA7, which we approximate with the slightly faster approach
     * of masking bit 6 of the CPU cycle count (see the DC011 discussion above).  This will result in a shorter LBA7
     * period than if we divided the cycle count by 88, but a shorter LBA7 period is probably helpful in terms of
     * overall performance.
     *
     * @this {Chips}
     * @param {number} iBit
     * @return {number}
     */
    getLBA(iBit)
    {
        return (this.time.getCycles() & (1 << (iBit - 1))) << 1;
    }

    /**
     * getNVRAddr()
     *
     * @this {Chips}
     * @return {number}
     */
    getNVRAddr()
    {
        let i;
        let tens = 0, ones = 0;
        let addr = ~this.dNVRAddr;
        for (i = 0; i < 10; i++) {
            if (addr & 0x1) tens = 9-i;
            addr >>= 1;
        }
        for (i = 0; i < 10; i++) {
            if (addr & 0x1) ones = 9-i;
            addr >>= 1;
        }
        addr = tens*10 + ones;
        this.assert(addr >= 0 && addr < this.aNVRWords.length);
        return addr;
    }

    /**
     * doNVRCommand()
     *
     * @this {Chips}
     */
    doNVRCommand()
    {
        let addr, data;
        let bit = this.bNVRLatch & 0x1;
        let bCmd = (this.bNVRLatch >> 1) & 0x7;

        switch(bCmd) {
        case Chips.NVR.CMD.STANDBY:
            break;

        case Chips.NVR.CMD.ACCEPT_ADDR:
            this.dNVRAddr = (this.dNVRAddr << 1) | bit;
            break;

        case Chips.NVR.CMD.ERASE:
            addr = this.getNVRAddr();
            this.aNVRWords[addr] = Chips.NVR.WORDMASK;
            this.printf(MESSAGE.CHIPS, "doNVRCommand(): erase data at addr %#06x\n", addr);
            break;

        case Chips.NVR.CMD.ACCEPT_DATA:
            this.wNVRData = (this.wNVRData << 1) | bit;
            break;

        case Chips.NVR.CMD.WRITE:
            addr = this.getNVRAddr();
            data = this.wNVRData & Chips.NVR.WORDMASK;
            this.aNVRWords[addr] = data;
            this.printf(MESSAGE.CHIPS, "doNVRCommand(): write data %#06x to addr %#06x\n", data, addr);
            break;

        case Chips.NVR.CMD.READ:
            addr = this.getNVRAddr();
            data = this.aNVRWords[addr];
            /*
             * If we don't explicitly initialize aNVRWords[], pretend any uninitialized words contains WORDMASK.
             */
            if (data == null) data = Chips.NVR.WORDMASK;
            this.wNVRData = data;
            this.printf(MESSAGE.CHIPS, "doNVRCommand(): read data %#06x from addr %#06x\n", data, addr);
            break;

        case Chips.NVR.CMD.SHIFT_OUT:
            this.wNVRData <<= 1;
            /*
             * Since WORDMASK is 0x3fff, this will mask the shifted data with 0x4000, which is the bit we want to isolate.
             */
            this.bNVROut = this.wNVRData & (Chips.NVR.WORDMASK + 1);
            break;

        default:
            this.printf(MESSAGE.CHIPS, "doNVRCommand(): unrecognized command %#04x\n", bCmd);
            break;
        }
    }

    /**
     * inFlags(port)
     *
     * @this {Chips}
     * @param {number} port (0x42)
     * @return {number} simulated port value
     */
    inFlags(port)
    {
        let value = this.bFlags;

        /*
         * The NVR_CLK bit is driven by LBA7 (ie, bit 7 from Line Buffer Address generation); see the DC011 discussion above.
         */
        value &= ~Chips.FLAGS.NVR_CLK;
        if (this.getLBA(7)) {
            value |= Chips.FLAGS.NVR_CLK;
            if (value != this.bFlags) {
                this.doNVRCommand();
            }
        }

        value &= ~Chips.FLAGS.NVR_DATA;
        if (this.bNVROut) {
            value |= Chips.FLAGS.NVR_DATA;
        }

        value &= ~Chips.FLAGS.KBD_XMIT;
        if (this.kbd && this.kbd.isTransmitterReady()) {
            value |= Chips.FLAGS.KBD_XMIT;
        }

        value &= ~Chips.FLAGS.UART_XMIT;
        if (this.serial && this.serial.isTransmitterReady()) {
            value |= Chips.FLAGS.UART_XMIT;
        }

        this.bFlags = value;
        this.printf(MESSAGE.CHIPS, "inFlags(%#04x): %#04x\n", port, value);
        return value;
    }

    /**
     * outBrightness(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x42)
     * @param {number} value
     */
    outBrightness(port, value)
    {
        this.printf(MESSAGE.CHIPS, "outBrightness(%#04x): %#04x\n", port, value);
        this.bBrightness = value;
    }

    /**
     * outNVRLatch(port, value)
     *
     * @this {Chips}
     * @param {number} port (0x62)
     * @param {number} value
     */
    outNVRLatch(port, value)
    {
        this.printf(MESSAGE.CHIPS, "outNVRLatch(%#04x): %#04x\n", port, value);
        this.bNVRLatch = value;
    }

    /**
     * outDC012(port, value)
     *
     * TODO: Consider whether we should disable any interrupts (eg, vertical retrace) until
     * this port is initialized at runtime.
     *
     * @this {Chips}
     * @param {number} port (0xA2)
     * @param {number} value
     */
    outDC012(port, value)
    {
        this.printf(MESSAGE.CHIPS, "outDC012(%#04x): %#04x\n", port, value);
        let bOpt = value & 0x3;
        let bCmd = (value >> 2) & 0x3;
        switch(bCmd) {
        case 0x0:
            this.bDC012Scroll = (this.bDC012Scroll & ~0x3) | bOpt;
            break;
        case 0x1:
            this.bDC012Scroll = (this.bDC012Scroll & ~0xC) | (bOpt << 2);
            if (this.video) this.video.updateScrollOffset(this.bDC012Scroll);
            break;
        case 0x2:
            switch(bOpt) {
            case 0x0:
                this.bDC012Blink = ~this.bDC012Blink;
                break;
            case 0x1:
                // TODO: Clear vertical frequency interrupt?
                break;
            case 0x2:
            case 0x3:
                this.bDC012Reverse = 0x3 - bOpt;
                break;
            }
            break;
        case 0x3:
            this.bDC012Attr = bOpt;
            break;
        }
    }

    /**
     * outDC011(port, value)
     *
     * @this {Chips}
     * @param {number} port (0xC2)
     * @param {number} value
     */
    outDC011(port, value)
    {
        this.printf(MESSAGE.CHIPS, "outNDC011(%#04x): %#04x\n", port, value);
        if (value & Chips.DC011.RATE60) {
            value &= Chips.DC011.RATE50;
            if (this.bDC011Rate != value) {
                this.bDC011Rate = value;
                if (this.video) {
                    this.video.updateRate(this.bDC011Rate == Chips.DC011.RATE50? 50 : 60);
                }
            }
        } else {
            value &= Chips.DC011.COLS132;
            if (this.bDC011Cols != value) {
                this.bDC011Cols = value;
                if (this.video) {
                    let nCols = (this.bDC011Cols == Chips.DC011.COLS132? 132 : 80);
                    let nRows = (nCols > 80 && (this.bFlags & Chips.FLAGS.NO_AVO)? 14 : 24);
                    this.video.updateDimensions(nCols, nRows);
                }
            }
        }
    }

    /**
     * loadState(state)
     *
     * Memory and Ports states are managed by the Bus onLoad() handler, which calls our loadState() handler.
     *
     * @this {Chips}
     * @param {Array} state
     * @return {boolean}
     */
    loadState(state)
    {
        let idDevice = state.shift();
        if (this.idDevice == idDevice) {
            this.bBrightness    = state.shift();
            this.bFlags         = state.shift();
            this.bDC011Cols     = state.shift();
            this.bDC011Rate     = state.shift();
            this.bDC012Scroll   = state.shift();
            this.bDC012Blink    = state.shift();
            this.bDC012Reverse  = state.shift();
            this.bDC012Attr     = state.shift();
            this.dNVRAddr       = state.shift(); // 20-bit address
            this.wNVRData       = state.shift(); // 14-bit word
            this.bNVRLatch      = state.shift(); // 1 byte
            this.bNVROut        = state.shift(); // 1 bit
            this.aNVRWords      = state.shift(); // 100 14-bit words
            return true;
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * Memory and Ports states are managed by the Bus onSave() handler, which calls our saveState() handler.
     *
     * @this {Chips}
     * @param {Array} state
     */
    saveState(state)
    {
        state.push(this.idDevice);
        state.push(this.bBrightness);
        state.push(this.bFlags);
        state.push(this.bDC011Cols);
        state.push(this.bDC011Rate);
        state.push(this.bDC012Scroll);
        state.push(this.bDC012Blink);
        state.push(this.bDC012Reverse);
        state.push(this.bDC012Attr);
        state.push(this.dNVRAddr);
        state.push(this.wNVRData);
        state.push(this.bNVRLatch);
        state.push(this.bNVROut);
        state.push(this.aNVRWords);
    }

    /**
     * dumpNVR(values)
     *
     * @this {Chips}
     * @param {Array.<number>} values (the Debugger passes along any values on the command-line, but we don't use them)
     */
    dumpNVR(values)
    {
        let sDump = "";
        for (let iWord = 1; iWord <= this.aNVRWords.length; iWord++) {
            sDump += this.sprintf("%04x%c", this.aNVRWords[iWord-1], (iWord % 10)? ' ' : '\n');
        }
        return sDump;
    }
}

/*
 * One of the many chips in the VT100 is an 8224, which operates at 24.8832MHz.  That frequency is divided by 9
 * to yield a 361.69ns clock period for the 8080 CPU, which means (in theory) that the CPU is running at 2.76Mhz,
 * so the machine should be configured with "cyclesPerSecond" set to 2764800.
 *
 * WARNING: The choice of clock speed has an effect on other simulated VT100 circuits; see the DC011 Timing Chip
 * discussion below, along with the getLBA() function.
 *
 * For reference, here is a list of all the VT100 I/O ports, from /devices/pc8080/machine/vt100/debugger/README.md,
 * which in turn comes from p. 4-17 of the VT100 Technical Manual (July 1982):
 *
 *      READ OR WRITE
 *      00H     PUSART data bus
 *      01H     PUSART command port
 *
 *      WRITE ONLY (Decoded with I/O WR L)
 *      02H     Baud rate generator
 *      42H     Brightness D/A latch
 *      62H     NVR latch
 *      82H     Keyboard UART data input [used to update the Keyboard Status Byte -JP]
 *      A2H     Video processor DC012
 *      C2H     Video processor DC011
 *      E2H     Graphics port
 *
 *      READ ONLY (Decoded with I/O RD L)
 *      22H     Modem buffer
 *      42H     Flags buffer
 *      82H     Keyboard UART data output
 */
Chips.FLAGS = {
    PORT:       0x42,           // read-only
    UART_XMIT:  0x01,           // PUSART transmit buffer empty if SET
    NO_AVO:     0x02,           // AVO present if CLEAR
    NO_GFX:     0x04,           // VT125 graphics board present if CLEAR
    OPTION:     0x08,           // OPTION present if SET
    NO_EVEN:    0x10,           // EVEN FIELD active if CLEAR
    NVR_DATA:   0x20,           // NVR DATA if SET
    NVR_CLK:    0x40,           // NVR CLOCK if SET
    KBD_XMIT:   0x80            // KBD transmit buffer empty if SET
};

Chips.BRIGHTNESS = {
    PORT:       0x42,           // write-only
    INIT:       0x00            // for lack of a better guess
};

/*
 * Reading port 0x82 returns a key address from the VT100 keyboard's UART data output.
 *
 * Every time a keyboard scan is initiated (by setting the START bit of the status byte),
 * our internal address index (iKeyNext) is set to zero, and an interrupt is generated for
 * each entry in the aKeysActive array, along with a final interrupt for KEYLAST.
 */
Chips.ADDRESS = {
    PORT:       0x82,
    INIT:       0x7F
};

/*
 * Writing port 0x82 updates the VT100's keyboard status byte via the keyboard's UART data input.
 */
Chips.STATUS = {
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
 * DC011 is referred to as a Timing Chip.
 *
 * As p. 4-55 (105) of the VT100 Technical Manual (July 1982) explains:
 *
 *      The DCO11 is a custom designed bipolar circuit that provides most of the timing signals required by the
 *      video processor. Internal counters divide the output of a 24.0734 MHz oscillator (located elsewhere on the
 *      terminal controller module) into the lower frequencies that define dot, character, scan, and frame timing.
 *      The counters are programmable through various input pins to control the number of characters per line,
 *      the frequency at which the screen is refreshed, and whether the display is interlaced or noninterlaced.
 *      These parameters can be controlled through SET-UP mode or by the host.
 *
 *          Table 4-6-1: Video Mode Selection (Write Address 0xC2)
 *
 *          D5  D4      Configuration
 *          --  --      -------------
 *          0   0       80-column mode, interlaced
 *          0   1       132-column mode, interlaced
 *          1   0       60Hz, non-interlaced
 *          1   1       50Hz, non-interlaced
 *
 * On p. 4-56, the DC011 Block Diagram shows 8 outputs labeled LBA0 through LBA7.  From p. 4-61:
 *
 *      Several of the LBAs are used as general purpose clocks in the VT100. LBA3 and LBA4 are used to generate
 *      timing for the keyboard. These signals satisfy the keyboard's requirement of two square-waves, one twice the
 *      frequency of the other, even though every 16th transition is delayed (the second stage of the horizontal
 *      counter divides by 17, not 16). LBA7 is used by the nonvolatile RAM.
 *
 * And on p. 4-62, timings are provided for the LBA0 through LBA7; in particular:
 *
 *      LBA6:   16.82353us (when LBA6 is low, for a period of 33.64706us)
 *      LBA7:   31.77778us (when LBA7 is high, for a period of 63.55556us)
 *
 * If we assume that the CPU cycle count increments once every 361.69ns, it will increment roughly 88 times every
 * time LBA7 toggles.  So we can divide the CPU cycle count by 88 and set LBA to the low bit of that truncated
 * result.  An even faster (but less accurate) solution would be to mask bit 6 of the CPU cycle count, which will
 * doesn't change until the count has been incremented 64 times.  See getLBA() for the chosen implementation.
 */
Chips.DC011 = {                 // generates Line Buffer Addresses (LBAs) for the Video Processor
    PORT:       0xC2,           // write-only
    COLS80:     0x00,
    COLS132:    0x10,
    RATE60:     0x20,
    RATE50:     0x30,
    INITCOLS:   0x00,           // ie, COLS80
    INITRATE:   0x20            // ie, RATE60
};

/*
 * DC012 is referred to as a Control Chip.
 *
 * As p. 4-67 (117) of the VT100 Technical Manual (July 1982) explains:
 *
 *      The DCO12 performs three main functions.
 *
 *       1. Scan count generation. This involves two counters, a multiplexer to switch between the counters,
 *          double-height logic, scroll and line attribute latches, and various logic controlling switching between
 *          the two counters. This is the biggest part of the chip. It includes all scrolling, double-height logic,
 *          and feeds into the underline and hold request circuits.
 *
 *       2. Generation of HOLD REQUEST. This uses information from the scan counters and the scrolling logic to
 *          decide when to generate HOLD REQUEST.
 *
 *       3. Video modifications: dot stretching, blanking, addition of attributes to video outputs, and multiple
 *          intensity levels.
 *
 *      The input decoder accepts a 4-bit command from the microprocessor when VID WR 2 L is asserted. Table 4-6-2
 *      lists the commands.
 *
 *      D3 D2 D1 D0     Function
 *      -- -- -- --     --------
 *      0  0  0  0      Load low order scroll latch = 00
 *      0  0  0  1      Load low order scroll latch = 01
 *      0  0  1  0      Load low order scroll latch = 10
 *      0  0  1  1      Load low order scroll latch = 11
 *
 *      0  1  0  0      Load high order scroll latch = 00
 *      0  1  0  1      Load high order scroll latch = 01
 *      0  1  1  0      Load high order scroll latch = 10
 *      0  1  1  1      Load high order scroll latch = 11 (not used)
 *
 *      1  0  0  0      Toggle blink flip-flop
 *      1  0  0  1      Clear vertical frequency interrupt
 *
 *      1  0  1  0      Set reverse field on
 *      1  0  1  1      Set reverse field off
 *
 *      1  1  0  0      Set basic attribute to underline*
 *      1  1  0  1      Set basic attribute to reverse video*
 *      1  1  1  0      Reserved for future specification*
 *      1  1  1  1      Reserved for future specification*
 *
 *      *These functions also clear blink flip-flop.
 */
Chips.DC012 = {                 // generates scan counts for the Video Processor
    PORT:       0xA2,           // write-only
    SCROLL_LO:  0x00,
    INITSCROLL: 0x00,
    INITBLINK:  0x00,
    INITREVERSE:0x00,
    INITATTR:   0x00
};

/*
 * ER1400 Non-Volatile RAM (NVR) Chip Definitions
 */
Chips.NVR = {
    LATCH: {
        PORT:   0x62            // write-only
    },
    CMD: {
        ACCEPT_DATA:    0x0,
        ACCEPT_ADDR:    0x1,
        SHIFT_OUT:      0x2,
        WRITE:          0x4,
        ERASE:          0x5,
        READ:           0x6,
        STANDBY:        0x7
    },
    WORDMASK:   0x3fff          // NVR words are 14-bit
    /*
     * The Technical Manual, p. 4-18, also notes that "Early VT100s can disable the receiver interrupt by
     * programming D4 in the NVR latch. However, this is never used by the VT100."
     */
};

Chips.LISTENERS = {
    0x42: [Chips.prototype.inFlags, Chips.prototype.outBrightness],
    0x62: [null, Chips.prototype.outNVRLatch],
    0xA2: [null, Chips.prototype.outDC012],
    0xC2: [null, Chips.prototype.outDC011]
};

Defs.CLASSES["Chips"] = Chips;
