/**
 * @fileoverview Implements the PDP11 RAM component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2016
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.4 written by Paul Nankervis
 * (paulnank@hotmail.com) as of September 2016 at <http://skn.noip.me/pdp11/pdp11.html>.  This code
 * may be used freely provided the original authors are acknowledged in any modified source code.
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
    var str          = require("../../shared/lib/strlib");
    var web          = require("../../shared/lib/weblib");
    var Component    = require("../../shared/lib/component");
    var State        = require("../../shared/lib/state");
    var PDP11        = require("./defines");
    var MemoryPDP11  = require("./memory");
    var ROMPDP11     = require("./rom");
}

/**
 * RAMPDP11(parmsRAM)
 *
 * The RAMPDP11 component expects the following (parmsRAM) properties:
 *
 *      addr: starting physical address of RAM (default is 0)
 *      size: amount of RAM, in bytes (default is 0, which means defer to motherboard switch settings)
 *
 * NOTE: We make a note of the specified size, but no memory is initially allocated for the RAM until the
 * Computer component calls powerUp().
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsRAM
 */
function RAMPDP11(parmsRAM)
{
    Component.call(this, "RAM", parmsRAM, RAMPDP11);

    this.addrRAM = parmsRAM['addr'];
    this.sizeRAM = parmsRAM['size'];
    this.fInstalled = (!!this.sizeRAM); // 0 is the default value for 'size' when none is specified
    this.fAllocated = false;
}

Component.subclass(RAMPDP11);

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {RAMPDP11}
 * @param {ComputerPDP11} cmp
 * @param {BusPDP11} bus
 * @param {CPUStatePDP11} cpu
 * @param {DebuggerPDP11} dbg
 */
RAMPDP11.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.initRAM();
};

/**
 * initRAM()
 *
 * @this {RAMPDP11}
 */
RAMPDP11.prototype.initRAM = function()
{
    if (!this.fAllocated && this.sizeRAM) {
        if (this.bus.addMemory(this.addrRAM, this.sizeRAM, MemoryPDP11.TYPE.RAM)) {
            this.fAllocated = true;
        }
    }
    if (!this.fAllocated) {
        Component.error("No RAM allocated");
    }
    this.setReady();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {RAMPDP11}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
RAMPDP11.prototype.powerUp = function(data, fRepower)
{
    /*
     * The Computer powers up the CPU last, at which point CPUState state is restored,
     * which includes the Bus state, and since we use the Bus to allocate all our memory,
     * memory contents are already restored for us, so we don't need the usual restore
     * logic.
     */
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {RAMPDP11}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
RAMPDP11.prototype.powerDown = function(fSave, fShutdown)
{
    /*
     * The Computer powers down the CPU first, at which point CPUState state is saved,
     * which includes the Bus state, and since we use the Bus component to allocate all
     * our memory, memory contents are already saved for us, so we don't need the usual
     * save logic.
     */
    return true;
};

/**
 * reset()
 *
 * @this {RAMPDP11}
 */
RAMPDP11.prototype.reset = function()
{
    /*
     * If you want to zero RAM on reset, then this would be a good place to do it.
     */
};

/**
 * RAMPDP11.init()
 *
 * This function operates on every HTML element of class "ram", extracting the
 * JSON-encoded parameters for the RAMPDP11 constructor from the element's "data-value"
 * attribute, invoking the constructor to create a RAMPDP11 component, and then binding
 * any associated HTML controls to the new component.
 */
RAMPDP11.init = function()
{
    var aeRAM = Component.getElementsByClass(document, PDP11.APPCLASS, "ram");
    for (var iRAM = 0; iRAM < aeRAM.length; iRAM++) {
        var eRAM = aeRAM[iRAM];
        var parmsRAM = Component.getComponentParms(eRAM);
        var ram = new RAMPDP11(parmsRAM);
        Component.bindComponentControls(ram, eRAM, PDP11.APPCLASS);
    }
};

/*
 * Initialize all the RAMPDP11 modules on the page.
 */
web.onInit(RAMPDP11.init);

if (NODE) module.exports = RAMPDP11;
