/**
 * @fileoverview Implements the PC8080 ChipSet component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-25
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
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
 * that loads or runs any version of this software (see Computer.COPYRIGHT).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
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

    this.model = ChipSet.MODELS[model] || ChipSet.SI_1978.MODEL;

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

ChipSet.SI_1978 = {
    MODEL:          1978.1,
    STATUS0: {                          // NOTE: STATUS0 not used by the SI_1978 ROMs; refer to STATUS1 instead
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
 * Supported model strings
 */
ChipSet.MODELS = {
    "SI1978":       ChipSet.SI_1978.MODEL
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
    if (this.model == ChipSet.SI_1978.MODEL) {
        bus.addPortInputTable(this, ChipSet.aPortInput);
        bus.addPortOutputTable(this, ChipSet.aPortOutput);
    }
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

/**
 * reset()
 *
 * @this {ChipSet}
 */
ChipSet.prototype.reset = function()
{
    this.bStatus0 = ChipSet.SI_1978.STATUS0.ALWAYS_SET;
    this.bStatus1 = ChipSet.SI_1978.STATUS1.ALWAYS_SET;
    this.bStatus2 = ChipSet.SI_1978.STATUS2.ALWAYS_SET;
    this.wShiftData = 0;
    this.bShiftCount = 0;
    this.bSound1 = this.bSound2 = 0;
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
    if (this.model == ChipSet.SI_1978.MODEL) {
        state.set(0, [this.bStatus0, this.bStatus1, this.bStatus2, this.wShiftData, this.bShiftCount, this.bSound1, this.bSound2]);
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
    var a, i;
    a = data[0];
    if (this.model == ChipSet.SI_1978.MODEL) {
        this.bStatus0 = a[0];
        this.bStatus1 = a[1];
        this.bStatus2 = a[2];
        this.wShiftData = a[3];
        this.bShiftCount = a[4];
        this.bSound1 = a[5];
        this.bSound2 = a[6];
    }
    return true;
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

/*
 * Port input notification tables
 */
ChipSet.aPortInput = {
    0x00: ChipSet.prototype.inSIStatus0,
    0x01: ChipSet.prototype.inSIStatus1,
    0x02: ChipSet.prototype.inSIStatus2,
    0x03: ChipSet.prototype.inSIShiftResult
};

/*
 * Port output notification tables
 */
ChipSet.aPortOutput = {
    0x02: ChipSet.prototype.outSIShiftCount,
    0x03: ChipSet.prototype.outSISound1,
    0x04: ChipSet.prototype.outSIShiftData,
    0x05: ChipSet.prototype.outSISound2,
    0x06: ChipSet.prototype.outSIWatchdog
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
    var aeChipSet = Component.getElementsByClass(document, APPCLASS, "chipset");
    for (var iChip = 0; iChip < aeChipSet.length; iChip++) {
        var eChipSet = aeChipSet[iChip];
        var parmsChipSet = Component.getComponentParms(eChipSet);
        var chipset = new ChipSet(parmsChipSet);
        Component.bindComponentControls(chipset, eChipSet, APPCLASS);
    }
};

/*
 * Initialize every ChipSet module on the page.
 */
web.onInit(ChipSet.init);

if (NODE) module.exports = ChipSet;
