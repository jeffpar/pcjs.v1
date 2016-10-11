/**
 * @fileoverview Implements RK11 device support.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright Jeff Parsons 2012-2016
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.4 written by Paul Nankervis
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
    var BusPDP11    = require("./bus");
}

/**
 * RK11(parmsDevice)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsRK11
 */
function RK11(parmsRK11)
{
    Component.call(this, "RK11", parmsRK11, RK11);

    this.rkds = 0x9C0;/*04700*/ // 017777400 Drive Status
    this.rker = 0;              // 017777402 Error Register
    this.rkcs = 0x80; /*0200*/  // 017777404 Control Status
    this.rkwc = 0;              // 017777406 Word Count
    this.rkba = 0;              // 017777410 Bus Address
    this.rkda = 0;              // 017777412 Disk Address
    this.rkdb = 0;              // 017777416 Data Buffer
    this.meta = [];
    this.TRACKS = [406, 406, 406, 406];
    this.SECTORS = [12, 12, 12, 12];
}

Component.subclass(RK11);

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {DevicePDP11}
 * @param {ComputerPDP11} cmp
 * @param {BusPDP11} bus
 * @param {CPUStatePDP11} cpu
 * @param {DebuggerPDP11} dbg
 */
RK11.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;

    this.setReady();
};

if (NODE) module.exports = RK11;
