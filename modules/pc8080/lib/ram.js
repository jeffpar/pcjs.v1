/**
 * @fileoverview Implements the PC8080 RAM component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-19
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
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var Memory8080  = require("./memory");
    var ROM8080     = require("./rom");
    var State8080   = require("./state");
}

/**
 * RAM8080(parmsRAM)
 *
 * The RAM8080 component expects the following (parmsRAM) properties:
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
function RAM8080(parmsRAM)
{
    Component.call(this, "RAM", parmsRAM, RAM8080);

    this.addrRAM = parmsRAM['addr'];
    this.sizeRAM = parmsRAM['size'];
    this.fInstalled = (!!this.sizeRAM); // 0 is the default value for 'size' when none is specified
    this.fAllocated = false;
}

Component.subclass(RAM8080);

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {RAM8080}
 * @param {Computer8080} cmp
 * @param {Bus8080} bus
 * @param {CPUState8080} cpu
 * @param {Debugger8080} dbg
 */
RAM8080.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.setReady();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {RAM8080}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
RAM8080.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        /*
         * The Computer powers up the CPU last, at which point CPUState state is restored,
         * which includes the Bus state, and since we use the Bus to allocate all our memory,
         * memory contents are already restored for us, so we don't need the usual restore
         * logic.  We just need to call reset(), to allocate memory for the RAM.
         */
        this.reset();
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {RAM8080}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
RAM8080.prototype.powerDown = function(fSave, fShutdown)
{
    /*
     * The Computer powers down the CPU first, at which point CPUState state is saved,
     * which includes the Bus state, and since we use the Bus component to allocate all
     * our memory, memory contents are already saved for us, so we don't need the usual
     * save logic.
     */
    return (fSave)? this.save() : true;
};

/**
 * reset()
 *
 * @this {RAM8080}
 */
RAM8080.prototype.reset = function()
{
    if (!this.fAllocated && this.sizeRAM) {
        if (this.bus.addMemory(this.addrRAM, this.sizeRAM, Memory8080.TYPE.RAM)) {
            this.fAllocated = true;
        }
    }
    if (!this.fAllocated) {
        Component.error("No RAM allocated");
    }
};

/**
 * save()
 *
 * This implements save support for the RAM8080 component.
 *
 * @this {RAM8080}
 * @return {Object}
 */
RAM8080.prototype.save = function()
{
    return null;
};

/**
 * restore(data)
 *
 * This implements restore support for the RAM8080 component.
 *
 * @this {RAM8080}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
RAM8080.prototype.restore = function(data)
{
    return true;
};

/**
 * RAM8080.init()
 *
 * This function operates on every HTML element of class "ram", extracting the
 * JSON-encoded parameters for the RAM8080 constructor from the element's "data-value"
 * attribute, invoking the constructor to create a RAM8080 component, and then binding
 * any associated HTML controls to the new component.
 */
RAM8080.init = function()
{
    var aeRAM = Component.getElementsByClass(document, PC8080.APPCLASS, "ram");
    for (var iRAM = 0; iRAM < aeRAM.length; iRAM++) {
        var eRAM = aeRAM[iRAM];
        var parmsRAM = Component.getComponentParms(eRAM);
        var ram = new RAM8080(parmsRAM);
        Component.bindComponentControls(ram, eRAM, PC8080.APPCLASS);
    }
};

/*
 * Initialize all the RAM8080 modules on the page.
 */
web.onInit(RAM8080.init);

if (NODE) module.exports = RAM8080;
