/**
 * @fileoverview Implements the PC11 High-Speed Paper Tape Reader/Punch
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2016
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
    var str           = require("../../shared/lib/strlib");
    var web           = require("../../shared/lib/weblib");
    var Component     = require("../../shared/lib/component");
    var State         = require("../../shared/lib/state");
    var PDP11         = require("./defines");
    var MessagesPDP11 = require("./messages");
}

/**
 * PC11(parms)
 *
 * @constructor
 * @extends Component
 * @param {Object} parms
 */
function PC11(parms)
{
    Component.call(this, "PC11", parms, PC11);

    /*
     * TODO: Technically, the PC11 should have a timer that "clocks" data from the abReader buffer into the
     * PRB register at the appropriate rate (300 CPS for the high-speed version, 10 CPS for the low-speed version).
     */
    this.prs = 0;       // PRS register
    this.prb = 0;       // PRB register
    this.iReader = 0;   // buffer index
    this.abReader = []; // buffer for the PRB register
}

Component.subclass(PC11);

/**
 * setBinding(sType, sBinding, control, sValue)
 *
 * @this {PC11}
 * @param {string|null} sType is the type of the HTML control (eg, "button", "textarea", "register", "flag", "rled", etc)
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "buffer")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
PC11.prototype.setBinding = function(sType, sBinding, control, sValue)
{
    return false;
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {PC11}
 * @param {ComputerPDP11} cmp
 * @param {BusPDP11} bus
 * @param {CPUStatePDP11} cpu
 * @param {DebuggerPDP11} dbg
 */
PC11.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.setReady();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {PC11}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
PC11.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data || !this.restore) {
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
 * @this {PC11}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
PC11.prototype.powerDown = function(fSave, fShutdown)
{
    return fSave? this.save() : true;
};

/**
 * reset()
 *
 * @this {PC11}
 */
PC11.prototype.reset = function()
{
    this.prs &= ~PDP11.PC11.PRS.CLEAR;
    this.prb = 0;
    this.iReader = 0;
    this.abReader = [];
};

/**
 * save()
 *
 * This implements save support for the PC11 component.
 *
 * @this {PC11}
 * @return {Object}
 */
PC11.prototype.save = function()
{
    var state = new State(this);
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the PC11 component.
 *
 * @this {PC11}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
PC11.prototype.restore = function(data)
{
    return true;
};

/**
 * readPRS(addr)
 *
 * @this {PC11}
 * @param {number} addr (eg, PDP11.UNIBUS.PRS or 177550)
 * @return {number}
 */
PC11.prototype.readPRS = function(addr)
{
    return this.prs;
};

/**
 * writePRS(data, addr)
 *
 * @this {PC11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.PRS or 177550)
 */
PC11.prototype.writePRS = function(data, addr)
{
    if (data & PDP11.PC11.PRS.RE) {
        if (this.prs & PDP11.PC11.PRS.ERROR) {
            data &= ~PDP11.PC11.PRS.RE;
            // if (this.prs & PDP11.PC11.PRS.RIE) {
                // TODO: Generate an interrupt
            // }
        } else {
            this.prs &= ~PDP11.PC11.PRS.DONE;
            this.prs |= PDP11.PC11.PRS.BUSY;
        }
    }
    this.prs = (this.prs & ~PDP11.PC11.PRS.WMASK) | (data & PDP11.PC11.PRS.WMASK);
};

/**
 * readPRB(addr)
 *
 * @this {PC11}
 * @param {number} addr (eg, PDP11.UNIBUS.PRB or 177552)
 * @return {number}
 */
PC11.prototype.readPRB = function(addr)
{
    return this.prb;
};

/**
 * writePRB(data, addr)
 *
 * @this {PC11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.PRB or 177552)
 */
PC11.prototype.writePRB = function(data, addr)
{
};

/*
 * ES6 ALERT: As you can see below, I've finally started using computed property names.
 */
PC11.UNIBUS_IOTABLE = {
    [PDP11.UNIBUS.PRS]:     /* 177550 */    [null, null, PC11.prototype.readPRS,    PC11.prototype.writePRS,    "PRS"],
    [PDP11.UNIBUS.PRB]:     /* 177552 */    [null, null, PC11.prototype.readPRB,    PC11.prototype.writePRB,    "PRB"]
};

if (NODE) module.exports = PC11;
