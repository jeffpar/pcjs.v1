/**
 * @fileoverview Implements the PC8080 ChipSet component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-25
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
    var usr         = require("../../shared/lib/usrlib");
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var Messages    = require("./messages");
    var State       = require("./state");
    var CPUDef      = require("./cpudef");
}

/**
 * ChipSet(parmsChipSet)
 *
 * The ChipSet component has the following component-specific (parmsChipSet) properties:
 *
 *      model:  eg, "SI1978" (should be a member of ChipSet.MODELS)
 *      swDIP:  eg, "00000000", where swDIP[0] is DIP0, swDIP[1] is DIP1, etc.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsChipSet
 */
function ChipSet(parmsChipSet)
{
    Component.call(this, "ChipSet", parmsChipSet, ChipSet, Messages.CHIPSET);

    var model = parmsChipSet['model'];

    /*
     * this.model is a numeric version of the 'model' string; when comparing this.model to "base"
     * model numbers, you should generally compare (this.model|0) to the target value, which truncates it.
     */
    if (model && !ChipSet.MODELS[model]) {
        Component.notice("Unrecognized ChipSet model: " + model);
    }

    this.config = ChipSet.MODELS[model] || ChipSet.SI1978;
    this.model = this.config.MODEL;

    this.bSwitches = this.parseDIPSwitches(parmsChipSet['swDIP']);

    /*
     * Here, I'm finally getting around to trying the Web Audio API.  Fortunately, based on what little I know about
     * sound generation, using the API to make the same noises as the IBM PC speaker seems straightforward.
     *
     * To start, we create an audio context, unless the 'sound' parameter has been explicitly set to false.
     *
     * From:
     *
     *      http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html
     *
     * "Similar to how HTML5 canvas requires a context on which lines and curves are drawn, Web Audio requires an audio context
     *  on which sounds are played and manipulated. This context will be the parent object of further audio objects to come....
     *  Your audio context is typically created when your page initializes and should be long-lived. You can play multiple sounds
     *  coming from multiple sources within the same context, so it is unnecessary to create more than one audio context per page."
     */
    this.fSpeaker = false;
    if (parmsChipSet['sound']) {
        this.classAudio = this.contextAudio = null;
        if (window) {
            this.classAudio = window['AudioContext'] || window['webkitAudioContext'];
        }
        if (this.classAudio) {
            this.contextAudio = new this.classAudio();
        } else {
            if (DEBUG) this.log("AudioContext not available");
        }
    }

    this.setReady();
}

Component.subclass(ChipSet);

ChipSet.SI1978 = {
    MODEL:          1978.1,
    STATUS0: {                          // NOTE: STATUS0 not used by the SI1978 ROMs; refer to STATUS1 instead
        PORT:       0,
        DIP4:       0x01,               // self-test request at power up?
        FIRE:       0x10,               // 1 = fire
        LEFT:       0x20,               // 1 = left
        RIGHT:      0x40,               // 1 = right
        PORT7:      0x80,               // some connection to (undocumented) port 7
        ALWAYS_SET: 0x0E                // always set
    },
    STATUS1: {
        PORT:       1,
        CREDIT:     0x01,               // credit (coin slot)
        P2:         0x02,               // 1 = 2P start
        P1:         0x04,               // 1 = 1P start
        P1_FIRE:    0x10,               // 1 = fire (P1 fire if cocktail machine?)
        P1_LEFT:    0x20,               // 1 = left (P1 left if cocktail machine?)
        P1_RIGHT:   0x40,               // 1 = right (P1 right if cocktail machine?)
        ALWAYS_SET: 0x08                // always set
    },
    STATUS2: {
        PORT:       2,
        DIP3_5:     0x03,               // 00 = 3 ships, 01 = 4 ships, 10 = 5 ships, 11 = 6 ships
        TILT:       0x04,               // 1 = tilt detected
        DIP6:       0x08,               // 0 = extra ship at 1500, 1 = extra ship at 1000
        P2_FIRE:    0x10,               // 1 = P2 fire (cocktail machines only?)
        P2_LEFT:    0x20,               // 1 = P2 left (cocktail machines only?)
        P2_RIGHT:   0x40,               // 1 = P2 right (cocktail machines only?)
        DIP7:       0x80,               // 0 = display coin info on demo ("attract") screen
        ALWAYS_SET: 0x00
    },
    SHIFT_RESULT: {                     // bits 0-7 of barrel shifter result
        PORT:       3
    },
    SHIFT_COUNT: {
        PORT:       2,
        MASK:       0x07
    },
    SOUND1: {
        PORT:       3,
        UFO:        0x01,
        SHOT:       0x02,
        PDEATH:     0x04,
        IDEATH:     0x08,
        EXPLAY:     0x10,
        AMP_ENABLE: 0x20
    },
    SHIFT_DATA: {
        PORT:       4
    },
    SOUND2: {
        PORT:       5,
        FLEET1:     0x01,
        FLEET2:     0x02,
        FLEET3:     0x04,
        FLEET4:     0x08,
        UFO_HIT:    0x10
    }
};

/*
 * One of the many chips in the VT100 is an 8224, which operates at 24.8832MHz.  That frequency is divided by 9
 * to yield a 361.69ns clock period for the 8080 CPU, which means the CPU is running at 2.76Mhz (cycles per second).
 * Hence the CPU component in the VT100's machine.xml is defined as:
 *
 *      <cpu id="cpu8080" model="8080" cycles="2764800"/>
 *
 * where 2764800 = 24883200 / 9. Beyond that, we don't really care about that particular 8224.  I only mention it
 * because knowing the CPU frequency is helpful for simulating some of the other circuits below that we DO care about.
 */
ChipSet.VT100 = {
    MODEL:          100.0,
    FLAGS_BUFFER: {
        PORT:       0x42,               // read-only
        XMIT:       0x01,               // active if SET
        NO_AVO:     0x02,               // AVO present if CLEAR
        NO_GFX:     0x04,               // VT125 graphics board present if CLEAR
        OPTION:     0x08,               // OPTION present if SET
        NO_EVEN:    0x10,               // EVEN FIELD active if CLEAR
        NVR_DATA:   0x20,               // NVR DATA if SET
        NVR_CLK:    0x40,               // NVR CLOCK if SET
        KBD_XMIT:   0x80                // KBD XMIT BUFFER empty if SET
    },
    BRIGHTNESS: {
        PORT:       0x42,               // write-only
        INIT:       0x00                // for lack of a better guess
    },
    NVR: {
        LATCH: {
            PORT:   0x62                // write-only
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
        WORDMASK:   0x3fff              // NVR words are 14-bit
    },
    DC012: {                            // generates scan counts for the Video Processor
        PORT:       0xA2,               // write-only
        INIT:       0x00                // for lack of a better guess
    },
    /*
     * As p. 4-55 (105) of the July 1982 Technical Manual explains:
     *
     *      The DCO11 is a custom designed bipolar circuit that provides most of the timing signals required by the
     *      video processor. Internal counters divide the output of a 24.0734 MHz oscillator (located elsewhere on the
     *      terminal controller module) into the lower frequencies that define dot, character, scan, and frame timing.
     *      The counters are programmable through various input pins to control the number of characters per line,
     *      the frequency at which the screen is refreshed, and whether the display is interlaced or noninterlaced.
     *      These parameters can be controlled through SET-UP mode or by the host.
     *
     * On p. 4-56, the DC011 Block Diagram shows 8 outputs labeled LBA0 through LBA7.  From p. 4-61:
     *
     *      Several of the LBAs are used as general purpose clocks in the VT100. LBA 3 and LBA 4 are used to generate
     *      timing for the keyboard. These signals satisfy the keyboard's requirement of two square-waves, one twice the
     *      frequency of the other, even though every 16th transition is delayed (the second stage of the horizontal
     *      counter divides by 17, not 16). LBA 7 is used by the nonvolatile RAM.
     *
     * And on p. 4-62, timings are provided for the LBA0 through LBA7 when the VT100 is in 80-column mode; in particular:
     *
     *      LBA6:   16.82353us (when LBA6 is low, for a period of 33.64706us)
     *      LBA7:   31.77778us (when LBA7 is high, for a period of 63.55556us)
     *
     * If we assume that the CPU cycle count increments once every 361.69ns, it will increment roughly 88 times every
     * time LBA7 toggles.  So we can divide the CPU cycle count by 88 and set LBA to the low bit of that truncated
     * result.  An even faster (but less accurate) solution would be to mask bit 6 of the CPU cycle count, which will
     * doesn't change until the count has been incremented 64 times.  See getVT100LBA() for the chosen implementation.
     */
    DC011: {                            // generates Line Buffer Addresses (LBAs) for the Video Processor
        PORT:       0xC2,               // write-only
        INIT:       0x00                // for lack of a better guess
    }
};

/*
 * Supported model strings
 */
ChipSet.MODELS = {
    "SI1978":       ChipSet.SI1978,
    "VT100":        ChipSet.VT100
};

/**
 * parseDIPSwitches(sBits, bDefault)
 *
 * @this {ChipSet}
 * @param {string} sBits describing switch settings
 * @param {number} [bDefault]
 * @return {number|undefined}
 */
ChipSet.prototype.parseDIPSwitches = function(sBits, bDefault)
{
    var b = bDefault;
    if (sBits) {
        /*
         * NOTE: We can't use parseInt() with a base of 2, because both bit order and bit sense are reversed.
         */
        b = 0;
        var bit = 0x1;
        for (var i = 0; i < sBits.length; i++) {
            if (sBits.charAt(i) == "0") b |= bit;
            bit <<= 1;
        }
    }
    return b;
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {ChipSet}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "sw1")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
ChipSet.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    return false;
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {ChipSet}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger} dbg
 */
ChipSet.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.cmp = cmp;
    bus.addPortInputTable(this, this.config.portsInput);
    bus.addPortOutputTable(this, this.config.portsOutput);
};

/**
 * powerUp(data, fRepower)
 *
 * @this {ChipSet}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
ChipSet.prototype.powerUp = function(data, fRepower)
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
 * @this {ChipSet}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
ChipSet.prototype.powerDown = function(fSave, fShutdown)
{
    return fSave? this.save() : true;
};

ChipSet.SI1978.init = [
    [
        ChipSet.SI1978.STATUS0.ALWAYS_SET,
        ChipSet.SI1978.STATUS1.ALWAYS_SET,
        ChipSet.SI1978.STATUS2.ALWAYS_SET,
        0, 0, 0, 0
    ]
];

ChipSet.VT100.init = [
    [
        ChipSet.VT100.BRIGHTNESS.INIT,
        ChipSet.VT100.FLAGS_BUFFER.NO_AVO | ChipSet.VT100.FLAGS_BUFFER.NO_GFX,
        ChipSet.VT100.DC012.INIT,
        ChipSet.VT100.DC011.INIT
    ],
    [
        0, 0, 0, 0, new Array(100)
    ]
];

/**
 * reset()
 *
 * @this {ChipSet}
 */
ChipSet.prototype.reset = function()
{
    if (!this.restore(this.config.init)) {
        this.notice("reset error");
    }
};

/**
 * save()
 *
 * This implements save support for the ChipSet component.
 *
 * @this {ChipSet}
 * @return {Object}
 */
ChipSet.prototype.save = function()
{
    var state = new State(this);
    switch(this.model) {
    case ChipSet.SI1978.MODEL:
        state.set(0, [this.bStatus0, this.bStatus1, this.bStatus2, this.wShiftData, this.bShiftCount, this.bSound1, this.bSound2]);
        break;
    case ChipSet.VT100.MODEL:
        state.set(0, [this.bBrightness, this.bFlagsBuffer, this.bDC012, this.bDC011]);
        state.set(1, [this.dNVRAddr, this.wNVRData, this.bNVRLatch, this.bNVROut, this.aNVRWords]);
        break;
    }
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the ChipSet component.
 *
 * @this {ChipSet}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
ChipSet.prototype.restore = function(data)
{
    var a;
    if (data && (a = data[0]) && a.length) {
        switch(this.model) {
        case ChipSet.SI1978.MODEL:
            this.bStatus0 = a[0];
            this.bStatus1 = a[1];
            this.bStatus2 = a[2];
            this.wShiftData = a[3];
            this.bShiftCount = a[4];
            this.bSound1 = a[5];
            this.bSound2 = a[6];
            return true;
        case ChipSet.VT100.MODEL:
            this.bBrightness = a[0];
            this.bFlagsBuffer = a[2];
            this.bDC012 = a[3];
            this.bDC011 = a[4];
            a = data[1];
            this.dNVRAddr = a[0];               // 20-bit address
            this.wNVRData = a[1];               // 14-bit word
            this.bNVRLatch = a[2];              // 1 byte
            this.bNVROut = a[3];                // 1 bit
            this.aNVRWords = a[4];              // 100 14-bit words
            return true;
        }
    }
    return false;
};

/**
 * start()
 *
 * Notification from the CPU that it's starting.
 *
 * @this {ChipSet}
 */
ChipSet.prototype.start = function()
{
    /*
     * Currently, all we (may) do with this notification is allow the speaker to make noise.
     */
};

/**
 * stop()
 *
 * Notification from the CPU that it's stopping.
 *
 * @this {ChipSet}
 */
ChipSet.prototype.stop = function()
{
    /*
     * Currently, all we (may) do with this notification is prevent the speaker from making noise.
     */
};

/**
 * updateStatus0(bit, fSet)
 *
 * @this {ChipSet}
 * @param {number} bit
 * @param {boolean} fSet
 */
ChipSet.prototype.updateStatus0 = function(bit, fSet)
{
    this.bStatus0 &= ~bit;
    if (fSet) this.bStatus0 |= bit;
};

/**
 * updateStatus1(bit, fSet)
 *
 * @this {ChipSet}
 * @param {number} bit
 * @param {boolean} fSet
 */
ChipSet.prototype.updateStatus1 = function(bit, fSet)
{
    this.bStatus1 &= ~bit;
    if (fSet) this.bStatus1 |= bit;
};

/**
 * updateStatus2(bit, fSet)
 *
 * @this {ChipSet}
 * @param {number} bit
 * @param {boolean} fSet
 */
ChipSet.prototype.updateStatus2 = function(bit, fSet)
{
    this.bStatus2 &= ~bit;
    if (fSet) this.bStatus2 |= bit;
};

/**
 * inSIStatus0(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x00)
 * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inSIStatus0 = function(port, addrFrom)
{
    var b = this.bStatus0;
    this.printMessageIO(port, null, addrFrom, "STATUS0", b, true);
    return b;
};

/**
 * inSIStatus1(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x01)
 * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inSIStatus1 = function(port, addrFrom)
{
    var b = this.bStatus1;
    this.printMessageIO(port, null, addrFrom, "STATUS1", b, true);
    return b;
};

/**
 * inSIStatus2(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x02)
 * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inSIStatus2 = function(port, addrFrom)
{
    var b = this.bStatus2;
    this.printMessageIO(port, null, addrFrom, "STATUS2", b, true);
    return b;
};

/**
 * inSIShiftResult(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x03)
 * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inSIShiftResult = function(port, addrFrom)
{
    var b = (this.wShiftData >> (8 - this.bShiftCount)) & 0xff;
    this.printMessageIO(port, null, addrFrom, "SHIFT.RESULT", b, true);
    return b;
};

/**
 * outSIShiftCount(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x02)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outSIShiftCount = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "SHIFT.COUNT", null, true);
    this.bShiftCount = b;
};

/**
 * outSISound1(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x03)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outSISound1 = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "SOUND1", null, true);
    this.bSound1 = b;
};

/**
 * outSIShiftData(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x04)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outSIShiftData = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "SHIFT.DATA", null, true);
    this.wShiftData = (b << 8) | (this.wShiftData >> 8);
};

/**
 * outSISound2(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x05)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outSISound2 = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "SOUND2", null, true);
    this.bSound2 = b;
};

/**
 * outSIWatchdog(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x06)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outSIWatchdog = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "WATCHDOG", null, true);
};

/**
 * getVT100LBA(nBit)
 *
 * Returns the state of the requested (simulated) LBA bit.
 *
 * NOTE: This is currently only used to obtain LBA7, which we approximate with the slightly faster approach
 * of masking bit 6 of the CPU cycle count (see the DC011 discussion above).  This will result in a shorter LBA7
 * period than if we divided the cycle count by 88, but a shorter LBA7 period is probably helpful in terms of
 * overall performance.
 *
 * @param {number} nBit
 * @return {number}
 */
ChipSet.prototype.getVT100LBA = function(nBit)
{
    return (this.cpu.getCycles() & (1 << (nBit - 1))) << 1;
};

/**
 * getNVRAddr()
 *
 * @return {number}
 */
ChipSet.prototype.getNVRAddr = function()
{
    var i;
    var tens = 0, ones = 0;
    var addr = ~this.dNVRAddr;
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
};

/**
 * doNVRCommand()
 */
ChipSet.prototype.doNVRCommand = function()
{
    var addr, data;
    var bit = this.bNVRLatch & 0x1;
    var bCmd = (this.bNVRLatch >> 1) & 0x7;

    switch(bCmd) {
    case ChipSet.VT100.NVR.CMD.STANDBY:
        break;

    case ChipSet.VT100.NVR.CMD.ACCEPT_ADDR:
        this.dNVRAddr = (this.dNVRAddr << 1) | bit;
        break;

    case ChipSet.VT100.NVR.CMD.ERASE:
        addr = this.getNVRAddr();
        this.aNVRWords[addr] = ChipSet.VT100.NVR.WORDMASK;
        this.printMessage("doNVRCommand(): erase data at addr " + str.toHexWord(addr));
        break;

    case ChipSet.VT100.NVR.CMD.ACCEPT_DATA:
        this.wNVRData = (this.wNVRData << 1) | bit;
        break;

    case ChipSet.VT100.NVR.CMD.WRITE:
        addr = this.getNVRAddr();
        data = this.wNVRData & ChipSet.VT100.NVR.WORDMASK;
        this.aNVRWords[addr] = data;
        this.printMessage("doNVRCommand(): write data " + str.toHexWord(data) + " to addr " + str.toHexWord(addr));
        break;

    case ChipSet.VT100.NVR.CMD.READ:
        addr = this.getNVRAddr();
        data = this.aNVRWords[addr];
        /*
         * Since we don't explicitly initialize aNVRWords[], we pretend any uninitialized words contains WORDMASK.
         */
        if (data == null) data = ChipSet.VT100.NVR.WORDMASK;
        this.wNVRData = data;
        this.printMessage("doNVRCommand():  read data " + str.toHexWord(data) + " from addr " + str.toHexWord(addr));
        break;

    case ChipSet.VT100.NVR.CMD.SHIFT_OUT:
        this.wNVRData <<= 1;
        /*
         * Since WORDMASK is 0x3fff, this will mask the shifted data with 0x4000, which is the bit we want to isolate.
         */
        this.bNVROut = this.wNVRData & (ChipSet.VT100.NVR.WORDMASK + 1);
        break;

    default:
        this.printMessage("doNVRCommand(): unrecognized command " + str.toHexByte(bCmd));
        break;
    }
};

/**
 * inVT100FlagsBuffer(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x42)
 * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inVT100FlagsBuffer = function(port, addrFrom)
{
    /*
     * The NVR_CLK bit is driven by LBA7 (ie, bit 7 from Line Buffer Address generation); see the DC011 discussion above.
     */
    var b = this.bFlagsBuffer;
    b &= ~ChipSet.VT100.FLAGS_BUFFER.NVR_CLK;
    if (this.getVT100LBA(7)) {
        b |= ChipSet.VT100.FLAGS_BUFFER.NVR_CLK;
        if (b != this.bFlagsBuffer) {
            this.doNVRCommand();
        }
    }
    b &= ~ChipSet.VT100.FLAGS_BUFFER.NVR_DATA;
    if (this.bNVROut) {
        b |= ChipSet.VT100.FLAGS_BUFFER.NVR_DATA;
    }
    this.bFlagsBuffer = b;
    this.printMessageIO(port, null, addrFrom, "FLAGS.BUFFER", b, true);
    return b;
};

/**
 * outVT100Brightness(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x42)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outVT100Brightness = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "BRIGHTNESS", null, true);
    this.bBrightness = b;
};

/**
 * outVT100NVRLatch(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x62)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outVT100NVRLatch = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "NVR.LATCH", null, true);
    this.bNVRLatch = b;
};

/**
 * outVT100DC012(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0xA2)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outVT100DC012 = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "DC012", null, true);
    this.bDC012 = b;
};

/**
 * outVT100DC011(port, b, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0xC2)
 * @param {number} b
 * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outVT100DC011 = function(port, b, addrFrom)
{
    this.printMessageIO(port, b, addrFrom, "DC011", null, true);
    this.bDC011 = b;
};

/*
 * Port notification tables
 */
ChipSet.SI1978.portsInput = {
    0x00: ChipSet.prototype.inSIStatus0,
    0x01: ChipSet.prototype.inSIStatus1,
    0x02: ChipSet.prototype.inSIStatus2,
    0x03: ChipSet.prototype.inSIShiftResult
};

ChipSet.SI1978.portsOutput = {
    0x02: ChipSet.prototype.outSIShiftCount,
    0x03: ChipSet.prototype.outSISound1,
    0x04: ChipSet.prototype.outSIShiftData,
    0x05: ChipSet.prototype.outSISound2,
    0x06: ChipSet.prototype.outSIWatchdog
};

ChipSet.VT100.portsInput = {
    0x42: ChipSet.prototype.inVT100FlagsBuffer
};

ChipSet.VT100.portsOutput = {
    0x42: ChipSet.prototype.outVT100Brightness,
    0x62: ChipSet.prototype.outVT100NVRLatch,
    0xA2: ChipSet.prototype.outVT100DC012,
    0xC2: ChipSet.prototype.outVT100DC011
};

/**
 * ChipSet.init()
 *
 * This function operates on every HTML element of class "chipset", extracting the
 * JSON-encoded parameters for the ChipSet constructor from the element's "data-value"
 * attribute, invoking the constructor to create a ChipSet component, and then binding
 * any associated HTML controls to the new component.
 */
ChipSet.init = function()
{
    var aeChipSet = Component.getElementsByClass(document, PC8080.APPCLASS, "chipset");
    for (var iChip = 0; iChip < aeChipSet.length; iChip++) {
        var eChipSet = aeChipSet[iChip];
        var parmsChipSet = Component.getComponentParms(eChipSet);
        var chipset = new ChipSet(parmsChipSet);
        Component.bindComponentControls(chipset, eChipSet, PC8080.APPCLASS);
    }
};

/*
 * Initialize every ChipSet module on the page.
 */
web.onInit(ChipSet.init);

if (NODE) module.exports = ChipSet;
