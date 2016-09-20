/**
 * @fileoverview Implements the PDP11 device support.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Sep-20
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.3 written by Paul Nankervis
 * (paulnank@hotmail.com) as of August 2016 from http://skn.noip.me/pdp11/pdp11.html.  This code
 * may be used freely provided the original author name is acknowledged in any modified source code.
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
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var State       = require("../../shared/lib/state");
    var BusPDP11    = require("./memory");
}

/**
 * DevicePDP11(parmsDevice)
 *
 * The DevicePDP11 component supports the following (parmsDevice) properties:
 *
 *      name: the name of the device to be supported (eg, "unibus" for generic UNIBUS support)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsDevice
 */
function DevicePDP11(parmsDevice)
{
    Component.call(this, "Device", parmsDevice, DevicePDP11);
    this.sDeviceName = parmsDevice['name'];
}

Component.subclass(DevicePDP11);

DevicePDP11.UNIBUS_NAME = "unibus";
DevicePDP11.ADDR_PSW    = 0x3FFFFE; /*017777776*/       // PSW

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {DevicePDP11}
 * @param {ComputerPDP11} cmp
 * @param {BusPDP11} bus
 * @param {CPUStatePDP11} cpu
 * @param {DebuggerPDP11} dbg
 */
DevicePDP11.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    switch(this.sDeviceName) {
    case DevicePDP11.UNIBUS_NAME:
    default:
        bus.addIOTable(this, DevicePDP11.UNIBUS_TABLE);
        break;
    }
    this.setReady();
};

/**
 * readPSW(addr)
 *
 * @this {DevicePDP11}
 * @param {number} [addr]
 * @return {number}
 */
DevicePDP11.prototype.readPSW = function(addr)
{
    return this.cpu.readPSW();
};

/**
 * writePSW(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} [addr]
 */
DevicePDP11.prototype.writePSW = function(data, addr)
{
    this.cpu.writePSW(data);
};

DevicePDP11.UNIBUS_TABLE = {};
DevicePDP11.UNIBUS_TABLE[DevicePDP11.ADDR_PSW] = [DevicePDP11.prototype.readPSW, DevicePDP11.prototype.writePSW];

/**
 * DevicePDP11.init()
 *
 * This function operates on every HTML element of class "device", extracting the
 * JSON-encoded parameters for the DevicePDP11 constructor from the element's "data-value"
 * attribute, invoking the constructor to create a DevicePDP11 component, and then binding
 * any associated HTML controls to the new component.
 */
DevicePDP11.init = function()
{
    var aeDevice = Component.getElementsByClass(document, PDP11.APPCLASS, "device");
    for (var iDevice = 0; iDevice < aeDevice.length; iDevice++) {
        var eDevice = aeDevice[iDevice];
        var parmsDevice = Component.getComponentParms(eDevice);
        var device = new DevicePDP11(parmsDevice);
        Component.bindComponentControls(device, eDevice, PDP11.APPCLASS);
    }
};

/*
 * Initialize all the DevicePDP11 modules on the page.
 */
web.onInit(DevicePDP11.init);

if (NODE) module.exports = DevicePDP11;
