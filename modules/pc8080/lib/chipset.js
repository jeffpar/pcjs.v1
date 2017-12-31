/**
 * @fileoverview Implements the PC8080 ChipSet component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
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
 * You are required to include the above copyright notice in every modified copy of this work
 * and to display that copyright notice when the software starts running; see COPYRIGHT in
 * <http://pcjs.org/modules/shared/lib/defines.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

if (NODE) {
    var Str = require("../../shared/lib/strlib");
    var Usr = require("../../shared/lib/usrlib");
    var Web = require("../../shared/lib/weblib");
    var Component = require("../../shared/lib/component");
    var State = require("../../shared/lib/state");
    var PC8080 = require("./defines");
    var CPUDef8080 = require("./cpudef");
    var Messages8080 = require("./messages");
}

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class ChipSet8080 extends Component {
    /**
     * ChipSet8080(parmsChipSet)
     *
     * The ChipSet8080 component has the following component-specific (parmsChipSet) properties:
     *
     *      model:  eg, "SI1978" (should be a member of ChipSet8080.MODELS)
     *      swDIP:  eg, "00000000", where swDIP[0] is DIP0, swDIP[1] is DIP1, etc.
     *
     * @this {ChipSet8080}
     * @param {Object} parmsChipSet
     */
    constructor(parmsChipSet)
    {
        super("ChipSet", parmsChipSet, Messages8080.CHIPSET);

        var model = parmsChipSet['model'];

        if (model && !ChipSet8080.MODELS[model]) {
            Component.notice("Unrecognized ChipSet model: " + model);
        }

        this.config = ChipSet8080.MODELS[model] || {};

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

    /**
     * parseDIPSwitches(sBits, bDefault)
     *
     * @this {ChipSet8080}
     * @param {string} sBits describing switch settings
     * @param {number} [bDefault]
     * @return {number|undefined}
     */
    parseDIPSwitches(sBits, bDefault)
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
    }

    /**
     * setBinding(sHTMLType, sBinding, control, sValue)
     *
     * @this {ChipSet8080}
     * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "sw1")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sHTMLType, sBinding, control, sValue)
    {
        return false;
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {ChipSet8080}
     * @param {Computer8080} cmp
     * @param {Bus8080} bus
     * @param {CPUState8080} cpu
     * @param {Debugger8080} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.bus = bus;
        this.cpu = cpu;
        this.dbg = dbg;
        this.cmp = cmp;
        this.kbd = /** @type {Keyboard8080} */ (cmp.getMachineComponent("Keyboard"));
        this.serial = /** @type {SerialPort8080} */ (cmp.getMachineComponent("SerialPort"));
        this.video = /** @type {Video8080} */ (cmp.getMachineComponent("Video"));
        bus.addPortInputTable(this, this.config.portsInput);
        bus.addPortOutputTable(this, this.config.portsOutput);

        if (DEBUGGER) {
            if (dbg) {
                var chipset = this;
                dbg.messageDump(Messages8080.NVR, function onDumpNVR() {
                    chipset.dumpNVR();
                });
            }
        }
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {ChipSet8080}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        if (!fRepower) {
            if (!data) {
                this.reset();
            } else {
                if (!this.restore(data)) return false;
            }
        }
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {ChipSet8080}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown(fSave, fShutdown)
    {
        return fSave? this.save() : true;
    }

    /**
     * dumpNVR()
     *
     * @this {ChipSet8080}
     */
    dumpNVR()
    {
        if (DEBUGGER) {
            var sDump = "";
            for (var iWord = 0; iWord < this.aNVRWords.length; iWord++) {
                if (sDump) {
                    sDump += (iWord && (iWord % 10)? ", " : ",\n");
                }
                sDump += Str.toHexWord(this.aNVRWords[iWord]);
            }
            this.dbg.println(sDump);
        }
    }

    /**
     * reset()
     *
     * @this {ChipSet8080}
     */
    reset()
    {
        if (this.config.INIT && !this.restore(this.config.INIT)) {
            this.notice("reset error");
        }
    }

    /**
     * save()
     *
     * This implements save support for the ChipSet component.
     *
     * @this {ChipSet8080}
     * @return {Object}
     */
    save()
    {
        var state = new State(this);
        switch(this.config.MODEL) {
        case ChipSet8080.SI1978.MODEL:
            state.set(0, [this.bStatus0, this.bStatus1, this.bStatus2, this.wShiftData, this.bShiftCount, this.bSound1, this.bSound2]);
            break;
        case ChipSet8080.VT100.MODEL:
            state.set(0, [this.bBrightness, this.bFlags]);
            state.set(1, [this.bDC011Cols, this.bDC011Rate]);
            state.set(2, [this.bDC012Scroll, this.bDC012Blink, this.bDC012Reverse, this.bDC012Attr]);
            state.set(3, [this.dNVRAddr, this.wNVRData, this.bNVRLatch, this.bNVROut, this.aNVRWords]);
            break;
        }
        return state.data();
    }

    /**
     * restore(data)
     *
     * This implements restore support for the ChipSet component.
     *
     * @this {ChipSet8080}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    restore(data)
    {
        var a;
        if (data && (a = data[0]) && a.length) {
            switch(this.config.MODEL) {
            case ChipSet8080.SI1978.MODEL:
                this.bStatus0      = a[0];
                this.bStatus1      = a[1];
                this.bStatus2      = a[2];
                this.wShiftData    = a[3];
                this.bShiftCount   = a[4];
                this.bSound1       = a[5];
                this.bSound2       = a[6];
                return true;
            case ChipSet8080.VT100.MODEL:
                this.bBrightness   = a[0];
                this.bFlags        = a[1];
                a = data[1];
                this.bDC011Cols    = a[0];
                this.bDC011Rate    = a[1];
                a = data[2];
                this.bDC012Scroll  = a[0];
                this.bDC012Blink   = a[1];
                this.bDC012Reverse = a[2];
                this.bDC012Attr    = a[3];
                a = data[3];
                this.dNVRAddr      = a[0];          // 20-bit address
                this.wNVRData      = a[1];          // 14-bit word
                this.bNVRLatch     = a[2];          // 1 byte
                this.bNVROut       = a[3];          // 1 bit
                this.aNVRWords     = a[4];          // 100 14-bit words
                return true;
            }
        }
        return false;
    }

    /**
     * start()
     *
     * Notification from the CPU that it's starting.
     *
     * @this {ChipSet8080}
     */
    start()
    {
        /*
         * Currently, all we (may) do with this notification is allow the speaker to make noise.
         */
    }

    /**
     * stop()
     *
     * Notification from the CPU that it's stopping.
     *
     * @this {ChipSet8080}
     */
    stop()
    {
        /*
         * Currently, all we (may) do with this notification is prevent the speaker from making noise.
         */
    }

    /**
     * updateStatus0(bit, fSet)
     *
     * @this {ChipSet8080}
     * @param {number} bit
     * @param {boolean} fSet
     */
    updateStatus0(bit, fSet)
    {
        this.bStatus0 &= ~bit;
        if (fSet) this.bStatus0 |= bit;
    }

    /**
     * updateStatus1(bit, fSet)
     *
     * @this {ChipSet8080}
     * @param {number} bit
     * @param {boolean} fSet
     */
    updateStatus1(bit, fSet)
    {
        this.bStatus1 &= ~bit;
        if (fSet) this.bStatus1 |= bit;
    }

    /**
     * updateStatus2(bit, fSet)
     *
     * @this {ChipSet8080}
     * @param {number} bit
     * @param {boolean} fSet
     */
    updateStatus2(bit, fSet)
    {
        this.bStatus2 &= ~bit;
        if (fSet) this.bStatus2 |= bit;
    }

    /**
     * inSIStatus0(port, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x00)
     * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
     * @return {number} simulated port value
     */
    inSIStatus0(port, addrFrom)
    {
        var b = this.bStatus0;
        this.printMessageIO(port, null, addrFrom, "STATUS0", b, true);
        return b;
    }

    /**
     * inSIStatus1(port, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x01)
     * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
     * @return {number} simulated port value
     */
    inSIStatus1(port, addrFrom)
    {
        var b = this.bStatus1;
        this.printMessageIO(port, null, addrFrom, "STATUS1", b, true);
        return b;
    }

    /**
     * inSIStatus2(port, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x02)
     * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
     * @return {number} simulated port value
     */
    inSIStatus2(port, addrFrom)
    {
        var b = this.bStatus2;
        this.printMessageIO(port, null, addrFrom, "STATUS2", b, true);
        return b;
    }

    /**
     * inSIShiftResult(port, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x03)
     * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
     * @return {number} simulated port value
     */
    inSIShiftResult(port, addrFrom)
    {
        var b = (this.wShiftData >> (8 - this.bShiftCount)) & 0xff;
        this.printMessageIO(port, null, addrFrom, "SHIFT.RESULT", b, true);
        return b;
    }

    /**
     * outSIShiftCount(port, b, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x02)
     * @param {number} b
     * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
     */
    outSIShiftCount(port, b, addrFrom)
    {
        this.printMessageIO(port, b, addrFrom, "SHIFT.COUNT", null, true);
        this.bShiftCount = b;
    }

    /**
     * outSISound1(port, b, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x03)
     * @param {number} b
     * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
     */
    outSISound1(port, b, addrFrom)
    {
        this.printMessageIO(port, b, addrFrom, "SOUND1", null, true);
        this.bSound1 = b;
    }

    /**
     * outSIShiftData(port, b, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x04)
     * @param {number} b
     * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
     */
    outSIShiftData(port, b, addrFrom)
    {
        this.printMessageIO(port, b, addrFrom, "SHIFT.DATA", null, true);
        this.wShiftData = (b << 8) | (this.wShiftData >> 8);
    }

    /**
     * outSISound2(port, b, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x05)
     * @param {number} b
     * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
     */
    outSISound2(port, b, addrFrom)
    {
        this.printMessageIO(port, b, addrFrom, "SOUND2", null, true);
        this.bSound2 = b;
    }

    /**
     * outSIWatchdog(port, b, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x06)
     * @param {number} b
     * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
     */
    outSIWatchdog(port, b, addrFrom)
    {
        this.printMessageIO(port, b, addrFrom, "WATCHDOG", null, true);
    }

    /**
     * getVT100LBA(iBit)
     *
     * Returns the state of the requested (simulated) LBA bit.
     *
     * NOTE: This is currently only used to obtain LBA7, which we approximate with the slightly faster approach
     * of masking bit 6 of the CPU cycle count (see the DC011 discussion above).  This will result in a shorter LBA7
     * period than if we divided the cycle count by 88, but a shorter LBA7 period is probably helpful in terms of
     * overall performance.
     *
     * @param {number} iBit
     * @return {number}
     */
    getVT100LBA(iBit)
    {
        return (this.cpu.getCycles() & (1 << (iBit - 1))) << 1;
    }

    /**
     * getNVRAddr()
     *
     * @return {number}
     */
    getNVRAddr()
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
    }

    /**
     * doNVRCommand()
     */
    doNVRCommand()
    {
        var addr, data;
        var bit = this.bNVRLatch & 0x1;
        var bCmd = (this.bNVRLatch >> 1) & 0x7;

        switch(bCmd) {
        case ChipSet8080.VT100.NVR.CMD.STANDBY:
            break;

        case ChipSet8080.VT100.NVR.CMD.ACCEPT_ADDR:
            this.dNVRAddr = (this.dNVRAddr << 1) | bit;
            break;

        case ChipSet8080.VT100.NVR.CMD.ERASE:
            addr = this.getNVRAddr();
            this.aNVRWords[addr] = ChipSet8080.VT100.NVR.WORDMASK;
            this.printMessage("doNVRCommand(): erase data at addr " + Str.toHexWord(addr));
            break;

        case ChipSet8080.VT100.NVR.CMD.ACCEPT_DATA:
            this.wNVRData = (this.wNVRData << 1) | bit;
            break;

        case ChipSet8080.VT100.NVR.CMD.WRITE:
            addr = this.getNVRAddr();
            data = this.wNVRData & ChipSet8080.VT100.NVR.WORDMASK;
            this.aNVRWords[addr] = data;
            this.printMessage("doNVRCommand(): write data " + Str.toHexWord(data) + " to addr " + Str.toHexWord(addr));
            break;

        case ChipSet8080.VT100.NVR.CMD.READ:
            addr = this.getNVRAddr();
            data = this.aNVRWords[addr];
            /*
             * If we don't explicitly initialize aNVRWords[], pretend any uninitialized words contains WORDMASK.
             */
            if (data == null) data = ChipSet8080.VT100.NVR.WORDMASK;
            this.wNVRData = data;
            this.printMessage("doNVRCommand():  read data " + Str.toHexWord(data) + " from addr " + Str.toHexWord(addr));
            break;

        case ChipSet8080.VT100.NVR.CMD.SHIFT_OUT:
            this.wNVRData <<= 1;
            /*
             * Since WORDMASK is 0x3fff, this will mask the shifted data with 0x4000, which is the bit we want to isolate.
             */
            this.bNVROut = this.wNVRData & (ChipSet8080.VT100.NVR.WORDMASK + 1);
            break;

        default:
            this.printMessage("doNVRCommand(): unrecognized command " + Str.toHexByte(bCmd));
            break;
        }
    }

    /**
     * inVT100Flags(port, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x42)
     * @param {number} [addrFrom] (not defined if the Debugger is trying to read the specified port)
     * @return {number} simulated port value
     */
    inVT100Flags(port, addrFrom)
    {
        var b = this.bFlags;

        /*
         * The NVR_CLK bit is driven by LBA7 (ie, bit 7 from Line Buffer Address generation); see the DC011 discussion above.
         */
        b &= ~ChipSet8080.VT100.FLAGS.NVR_CLK;
        if (this.getVT100LBA(7)) {
            b |= ChipSet8080.VT100.FLAGS.NVR_CLK;
            if (b != this.bFlags) {
                this.doNVRCommand();
            }
        }

        b &= ~ChipSet8080.VT100.FLAGS.NVR_DATA;
        if (this.bNVROut) {
            b |= ChipSet8080.VT100.FLAGS.NVR_DATA;
        }

        b &= ~ChipSet8080.VT100.FLAGS.KBD_XMIT;
        if (this.kbd && this.kbd.isVT100TransmitterReady()) {
            b |= ChipSet8080.VT100.FLAGS.KBD_XMIT;
        }

        b &= ~ChipSet8080.VT100.FLAGS.UART_XMIT;
        if (this.serial && this.serial.isTransmitterReady()) {
            b |= ChipSet8080.VT100.FLAGS.UART_XMIT;
        }

        this.bFlags = b;
        this.printMessageIO(port, null, addrFrom, "FLAGS", b);
        return b;
    }

    /**
     * outVT100Brightness(port, b, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x42)
     * @param {number} b
     * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
     */
    outVT100Brightness(port, b, addrFrom)
    {
        this.printMessageIO(port, b, addrFrom, "BRIGHTNESS");
        this.bBrightness = b;
    }

    /**
     * outVT100NVRLatch(port, b, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0x62)
     * @param {number} b
     * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
     */
    outVT100NVRLatch(port, b, addrFrom)
    {
        this.printMessageIO(port, b, addrFrom, "NVR.LATCH");
        this.bNVRLatch = b;
    }

    /**
     * outVT100DC012(port, b, addrFrom)
     *
     * TODO: Consider whether we should disable any interrupts (eg, vertical retrace) until
     * this port is initialized at runtime.
     *
     * @this {ChipSet8080}
     * @param {number} port (0xA2)
     * @param {number} b
     * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
     */
    outVT100DC012(port, b, addrFrom)
    {
        this.printMessageIO(port, b, addrFrom, "DC012");

        var bOpt = b & 0x3;
        var bCmd = (b >> 2) & 0x3;
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
     * outVT100DC011(port, b, addrFrom)
     *
     * @this {ChipSet8080}
     * @param {number} port (0xC2)
     * @param {number} b
     * @param {number} [addrFrom] (not defined if the Debugger is trying to write the specified port)
     */
    outVT100DC011(port, b, addrFrom)
    {
        this.printMessageIO(port, b, addrFrom, "DC011");
        if (b & ChipSet8080.VT100.DC011.RATE60) {
            b &= ChipSet8080.VT100.DC011.RATE50;
            if (this.bDC011Rate != b) {
                this.bDC011Rate = b;
                if (this.video) {
                    this.video.updateRate(this.bDC011Rate == ChipSet8080.VT100.DC011.RATE50? 50 : 60);
                }
            }
        } else {
            b &= ChipSet8080.VT100.DC011.COLS132;
            if (this.bDC011Cols != b) {
                this.bDC011Cols = b;
                if (this.video) {
                    var nCols = (this.bDC011Cols == ChipSet8080.VT100.DC011.COLS132? 132 : 80);
                    var nRows = (nCols > 80 && (this.bFlags & ChipSet8080.VT100.FLAGS.NO_AVO)? 14 : 24);
                    this.video.updateDimensions(nCols, nRows);
                }
            }
        }
    }

    /**
     * ChipSet8080.init()
     *
     * This function operates on every HTML element of class "chipset", extracting the
     * JSON-encoded parameters for the ChipSet constructor from the element's "data-value"
     * attribute, invoking the constructor to create a ChipSet component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeChipSet = Component.getElementsByClass(document, PC8080.APPCLASS, "chipset");
        for (var iChip = 0; iChip < aeChipSet.length; iChip++) {
            var eChipSet = aeChipSet[iChip];
            var parmsChipSet = Component.getComponentParms(eChipSet);
            var chipset = new ChipSet8080(parmsChipSet);
            Component.bindComponentControls(chipset, eChipSet, PC8080.APPCLASS);
        }
    }
}

/*
 * NOTE: The STATUS1 port could have been handled entirely by the Keyboard component, but it was just as easy
 * to create a simple ChipSet interface, updateStatus1(), that the Keyboard calls whenever it wants to simulate a
 * button press or release.  It's a six-of-one, half-a-dozen-of-another choice, since technically, Space Invaders
 * doesn't have a keyboard.
 */
ChipSet8080.SI1978 = {
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
 * to yield a 361.69ns clock period for the 8080 CPU, which means (in theory) that the CPU is running at 2.76Mhz.
 *
 * Hence the CPU component in the VT100's machine.xml should be defined as:
 *
 *      <cpu id="cpu8080" model="8080" cycles="2764800"/>
 *
 * WARNING: The choice of clock speed has an effect on other simulated VT100 circuits; see the DC011 Timing Chip
 * discussion below, along with the getVT100LBA() function.
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
 *
 * Most of these are handled by the ChipSet component, since it exists as sort of a "catch-all" component,
 * but some are more appropriately handled by other components; eg, port 0x82 is handled by the Keyboard component,
 * so it's defined there instead of here.
 */
ChipSet8080.VT100 = {
    MODEL:          100.0,
    FLAGS: {
        PORT:       0x42,               // read-only
        UART_XMIT:  0x01,               // PUSART transmit buffer empty if SET
        NO_AVO:     0x02,               // AVO present if CLEAR
        NO_GFX:     0x04,               // VT125 graphics board present if CLEAR
        OPTION:     0x08,               // OPTION present if SET
        NO_EVEN:    0x10,               // EVEN FIELD active if CLEAR
        NVR_DATA:   0x20,               // NVR DATA if SET
        NVR_CLK:    0x40,               // NVR CLOCK if SET
        KBD_XMIT:   0x80                // KBD transmit buffer empty if SET
    },
    BRIGHTNESS: {
        PORT:       0x42,               // write-only
        INIT:       0x00                // for lack of a better guess
    },
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
     * doesn't change until the count has been incremented 64 times.  See getVT100LBA() for the chosen implementation.
     */
    DC011: {                            // generates Line Buffer Addresses (LBAs) for the Video Processor
        PORT:       0xC2,               // write-only
        COLS80:     0x00,
        COLS132:    0x10,
        RATE60:     0x20,
        RATE50:     0x30,
        INITCOLS:   0x00,               // ie, COLS80
        INITRATE:   0x20                // ie, RATE60
    },
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
    DC012: {                            // generates scan counts for the Video Processor
        PORT:       0xA2,               // write-only
        SCROLL_LO:  0x00,
        INITSCROLL: 0x00,
        INITBLINK:  0x00,
        INITREVERSE:0x00,
        INITATTR:   0x00
    },
    /*
     * ER1400 Non-Volatile RAM (NVR) Chip Definitions
     */
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
        /*
         * The Technical Manual, p. 4-18, also notes that "Early VT100s can disable the receiver interrupt by
         * programming D4 in the NVR latch. However, this is never used by the VT100."
         */
    }
};

/*
 * Supported models and their configurations
 */
ChipSet8080.MODELS = {
    "SI1978":       ChipSet8080.SI1978,
    "VT100":        ChipSet8080.VT100
};

ChipSet8080.SI1978.INIT = [
    [
        ChipSet8080.SI1978.STATUS0.ALWAYS_SET,
        ChipSet8080.SI1978.STATUS1.ALWAYS_SET,
        ChipSet8080.SI1978.STATUS2.ALWAYS_SET,
        0, 0, 0, 0
    ]
];

ChipSet8080.VT100.INIT = [
    [
        ChipSet8080.VT100.BRIGHTNESS.INIT,
        ChipSet8080.VT100.FLAGS.NO_AVO | ChipSet8080.VT100.FLAGS.NO_GFX
    ],
    [
        ChipSet8080.VT100.DC011.INITCOLS,
        ChipSet8080.VT100.DC011.INITRATE
    ],
    [
        ChipSet8080.VT100.DC012.INITSCROLL,
        ChipSet8080.VT100.DC012.INITBLINK,
        ChipSet8080.VT100.DC012.INITREVERSE,
        ChipSet8080.VT100.DC012.INITATTR
    ],
    [
        0, 0, 0, 0,
        [
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
             */
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
        ],
        [
            /*
             * The TRUE factory defaults (not currently used for anything; they're just here for reference, wasting space....)
             */
            0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80,
            0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80,
            0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80,
            0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E80, 0x2E00,
            0x2E08, 0x2E8E, 0x2E20, 0x2ED0, 0x2E50, 0x2E00, 0x2E20, 0x2E00, 0x2EE0, 0x2EE0,
            0x2E69, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
            0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000
        ]
    ]
];

/*
 * Port notification tables
 */
ChipSet8080.SI1978.portsInput = {
    0x00: ChipSet8080.prototype.inSIStatus0,
    0x01: ChipSet8080.prototype.inSIStatus1,
    0x02: ChipSet8080.prototype.inSIStatus2,
    0x03: ChipSet8080.prototype.inSIShiftResult
};

ChipSet8080.SI1978.portsOutput = {
    0x02: ChipSet8080.prototype.outSIShiftCount,
    0x03: ChipSet8080.prototype.outSISound1,
    0x04: ChipSet8080.prototype.outSIShiftData,
    0x05: ChipSet8080.prototype.outSISound2,
    0x06: ChipSet8080.prototype.outSIWatchdog
};

ChipSet8080.VT100.portsInput = {
    0x42: ChipSet8080.prototype.inVT100Flags
};

ChipSet8080.VT100.portsOutput = {
    0x42: ChipSet8080.prototype.outVT100Brightness,
    0x62: ChipSet8080.prototype.outVT100NVRLatch,
    0xA2: ChipSet8080.prototype.outVT100DC012,
    0xC2: ChipSet8080.prototype.outVT100DC011
};

/*
 * Initialize every ChipSet module on the page.
 */
Web.onInit(ChipSet8080.init);

if (NODE) module.exports = ChipSet8080;
