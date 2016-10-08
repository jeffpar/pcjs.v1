/**
 * @fileoverview Implements PDP11 device support.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright Jeff Parsons 2012-2016
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
    var BusPDP11    = require("./bus");
}

/**
 * DevicePDP11(parmsDevice)
 *
 * The Device component implements the following "default" devices:
 *
 *      KW11
 *      DISPLAY Registers
 *      MMU Registers
 *      CPU Registers (eg, PSW)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsDevice
 */
function DevicePDP11(parmsDevice)
{
    Component.call(this, "Device", parmsDevice, DevicePDP11);

    this.display = {
        data:       0,
        address:    0,
        misc:       0x14,
        switches:   0
    };

    this.kw11 = {
        csr:        0,
        timer:      -1          // initBus() will initialize this timer ID
    };
}

Component.subclass(DevicePDP11);

DevicePDP11.M9312 = [
    0x101F, /*0010037*/ 0x01C0, /*0000700*/ 0x105F, /*0010137*/ 0x01C2, /*0000702*/ 0x111F, /*0010437*/ 0x01C4, /*0000704*/ 0x0A1F, /*0005037*/ 0x01C6, /*0000706*/
    0x55DF, /*0052737*/ 0x8000, /*0100000*/ 0xFFFE, /*0177776*/ 0x35DF, /*0032737*/ 0x4000, /*0040000*/ 0xFFFE, /*0177776*/ 0x0302, /*0001402*/ 0x0A9F, /*0005237*/
    0x01C6, /*0000706*/ 0x0A1F, /*0005037*/ 0xFFFE, /*0177776*/ 0x0101, /*0000401*/ 0x0000, /*0000000*/ 0x0A06, /*0005006*/ 0x8104, /*0100404*/ 0x8503, /*0102403*/
    0x8202, /*0101002*/ 0x0501, /*0002401*/ 0x8301, /*0101401*/ 0x0000, /*0000000*/ 0x0AC6, /*0005306*/ 0x8003, /*0100003*/ 0x0302, /*0001402*/ 0x0401, /*0002001*/
    0x0701, /*0003401*/ 0x0000, /*0000000*/ 0x0C06, /*0006006*/ 0x8402, /*0102002*/ 0x8601, /*0103001*/ 0x0201, /*0001001*/ 0x0000, /*0000000*/ 0x15C6, /*0012706*/
    0xAAAA, /*0125252*/ 0x1180, /*0010600*/ 0x1001, /*0010001*/ 0x1042, /*0010102*/ 0x1083, /*0010203*/ 0x10C4, /*0010304*/ 0x1105, /*0010405*/ 0xE141, /*0160501*/
    0x0501, /*0002401*/ 0x0301, /*0001401*/ 0x0000, /*0000000*/ 0x0C42, /*0006102*/ 0x8601, /*0103001*/ 0x0501, /*0002401*/ 0x0000, /*0000000*/ 0x6083, /*0060203*/
    0x0A83, /*0005203*/ 0x0A43, /*0005103*/ 0x60C1, /*0060301*/ 0x8701, /*0103401*/ 0x0701, /*0003401*/ 0x0000, /*0000000*/ 0x0C04, /*0006004*/ 0x5103, /*0050403*/
    0x6143, /*0060503*/ 0x0A83, /*0005203*/ 0x8702, /*0103402*/ 0x0AC1, /*0005301*/ 0x0501, /*0002401*/ 0x0000, /*0000000*/ 0x0A40, /*0005100*/ 0x8301, /*0101401*/
    0x0000, /*0000000*/ 0x4001, /*0040001*/ 0x6041, /*0060101*/ 0x0601, /*0003001*/ 0x0701, /*0003401*/ 0x0000, /*0000000*/ 0x00C1, /*0000301*/ 0x2057, /*0020127*/
    0x5455, /*0052125*/ 0x0204, /*0001004*/ 0x3105, /*0030405*/ 0x0602, /*0003002*/ 0x0A45, /*0005105*/ 0x0201, /*0001001*/ 0x0000, /*0000000*/ 0x95C0, /*0112700*/
    0xFF01, /*0177401*/ 0x8001, /*0100001*/ 0x0000, /*0000000*/ 0x7E02, /*0077002*/ 0x0A01, /*0005001*/ 0x0A81, /*0005201*/ 0x7E02, /*0077002*/ 0x0BC0, /*0005700*/
    0x0202, /*0001002*/ 0x0BC1, /*0005701*/ 0x0301, /*0001401*/ 0x0000, /*0000000*/ 0x15C6, /*0012706*/ 0x01FE, /*0000776*/ 0x09F7, /*0004767*/ 0x0002, /*0000002*/
    0x0000, /*0000000*/ 0x25CE, /*0022716*/ 0x00D0, /*0000320*/ 0x0301, /*0001401*/ 0x0000, /*0000000*/ 0x15CE, /*0012716*/ 0x00E2, /*0000342*/ 0x0087, /*0000207*/
    0x0000, /*0000000*/ 0x0A26, /*0005046*/ 0x15E6, /*0012746*/ 0x00EC, /*0000354*/ 0x0002, /*0000002*/ 0x0000, /*0000000*/ 0x005F, /*0000137*/ 0x00F2, /*0000362*/
    0x0080, /*0000200*/ 0x15C5, /*0012705*/ 0xE000, /*0160000*/ 0x0A1F, /*0005037*/ 0x0006, /*0000006*/ 0x15DF, /*0012737*/ 0x0100, /*0000400*/ 0x0004, /*0000004*/
    0x15C6, /*0012706*/ 0x01FE, /*0000776*/ 0x0BE5, /*0005745*/ 0x15DF, /*0012737*/ 0x01CC, /*0000714*/ 0x004C, /*0000114*/ 0x0A1F, /*0005037*/ 0x004E, /*0000116*/
    0x15C3, /*0012703*/ 0xFFE6, /*0177746*/ 0x15CB, /*0012713*/ 0x000C, /*0000014*/ 0x15C2, /*0012702*/ 0x0200, /*0001000*/ 0x1080, /*0010200*/ 0x1008, /*0010010*/
    0x0BD0, /*0005720*/ 0x2005, /*0020005*/ 0x83FC, /*0101774*/ 0x1080, /*0010200*/ 0x1201, /*0011001*/ 0x2001, /*0020001*/ 0x0301, /*0001401*/ 0x0000, /*0000000*/
    0x0A50, /*0005120*/ 0x2005, /*0020005*/ 0x83F9, /*0101771*/ 0x1801, /*0014001*/ 0x0A41, /*0005101*/ 0x2001, /*0020001*/ 0x0301, /*0001401*/ 0x0000, /*0000000*/
    0x2002, /*0020002*/ 0x02F9, /*0001371*/ 0x0A0E, /*0005016*/ 0x15C4, /*0012704*/ 0xAAAA, /*0125252*/ 0x15CB, /*0012713*/ 0x0018, /*0000030*/ 0x15C0, /*0012700*/
    0x0800, /*0004000*/ 0x15C2, /*0012702*/ 0x0200, /*0001000*/ 0x0A44, /*0005104*/ 0x1108, /*0010410*/ 0x0A48, /*0005110*/ 0x0A48, /*0005110*/ 0x2204, /*0021004*/
    0x0301, /*0001401*/ 0x0000, /*0000000*/ 0x0C1F, /*0006037*/ 0xFFEA, /*0177752*/ 0x8702, /*0103402*/ 0x0000, /*0000000*/ 0x0131, /*0000461*/ 0x8A4E, /*0105116*/
    0x02F2, /*0001362*/ 0x0102, /*0000402*/ 0x0077, /*0000167*/ 0xFE88, /*0177210*/ 0x0BD0, /*0005720*/ 0x7E93, /*0077223*/ 0x15CB, /*0012713*/ 0x0024, /*0000044*/
    0x15C0, /*0012700*/ 0x0C00, /*0006000*/ 0x8A76, /*0105166*/ 0x0001, /*0000001*/ 0x02E4, /*0001344*/ 0x15C2, /*0012702*/ 0x0200, /*0001000*/ 0x1080, /*0010200*/
    0x1008, /*0010010*/ 0x0BD0, /*0005720*/ 0x2005, /*0020005*/ 0x83FC, /*0101774*/ 0x15C1, /*0012701*/ 0x0003, /*0000003*/ 0x0A0E, /*0005016*/ 0x0BDF, /*0005737*/
    0x01C6, /*0000706*/ 0x0210, /*0001020*/ 0x15CE, /*0012716*/ 0x0018, /*0000030*/ 0x1080, /*0010200*/ 0x0A48, /*0005110*/ 0x0A48, /*0005110*/ 0x2008, /*0020010*/
    0x0301, /*0001401*/ 0x0000, /*0000000*/ 0x0BD0, /*0005720*/ 0x0C1F, /*0006037*/ 0xFFEA, /*0177752*/ 0x8702, /*0103402*/ 0x0000, /*0000000*/ 0x0108, /*0000410*/
    0x2005, /*0020005*/ 0x83F3, /*0101763*/ 0x138B, /*0011613*/ 0x0A0E, /*0005016*/ 0x7E51, /*0077121*/ 0x0104, /*0000404*/ 0x0000, /*0000000*/ 0x0102, /*0000402*/
    0x15CB, /*0012713*/ 0x000C, /*0000014*/ 0x17C0, /*0013700*/ 0x01C0, /*0000700*/ 0x17C1, /*0013701*/ 0x01C2, /*0000702*/ 0x17C4, /*0013704*/ 0x01C4, /*0000704*/
    0x0074, /*0000164*/ 0x0002, /*0000002*/ 0x17C4, /*0013704*/ 0xFF78, /*0177570*/ 0x45C4, /*0042704*/ 0xFE00, /*0177000*/ 0x55C4, /*0052704*/ 0xF600, /*0173000*/
    0x97C0, /*0113700*/ 0xFF79, /*0177571*/ 0x0C80, /*0006200*/ 0x00A1, /*0000241*/ 0x004C, /*0000114*/ 0x0000, /*0000000*/ 0x4230, /*0041060*/ 0x2A2D  /*0025055*/
];

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

    var device = this;
    this.kw11.timer = this.cpu.addTimer(function() {
        device.kw11_interrupt();
    });

    bus.addIOTable(this, DevicePDP11.UNIBUS_IOTABLE);
    bus.addResetHandler(this.reset.bind(this));

    this.setReady();
};

/**
 * readLKS(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.LKS or 177546)
 * @return {number}
 */
DevicePDP11.prototype.readLKS = function(addr)
{
    var result = this.kw11.lks;
    this.kw11.lks &= ~PDP11.KW11.LKS.MON;
    return result;
};

/**
 * writeLKS(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.LKS or 177546)
 */
DevicePDP11.prototype.writeLKS = function(data, addr)
{
    this.kw11.lks = data;
    if (data & PDP11.KW11.LKS.IE) {
        this.cpu.setTimer(this.kw11.timer, 1000/60);
    }
    this.kw11.lks = data & ~PDP11.KW11.LKS.MON;
};

/**
 * readMMR0(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.MMR0 or 177572)
 * @return {number}
 */
DevicePDP11.prototype.readMMR0 = function(addr)
{
    return this.cpu.getMMR0();
};

/**
 * writeMMR0(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.MMR0 or 177572)
 */
DevicePDP11.prototype.writeMMR0 = function(data, addr)
{
    this.cpu.setMMR0(data);
    this.updateDisplayMode();
};

/**
 * readMMR1(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.MMR1 or 177574)
 * @return {number}
 */
DevicePDP11.prototype.readMMR1 = function(addr)
{
    return this.cpu.getMMR1();
};

/**
 * readMMR2(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.MMR2 or 177576)
 * @return {number}
 */
DevicePDP11.prototype.readMMR2 = function(addr)
{
    return this.cpu.regMMR2;
};

/**
 * writeMMR2(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.MMR2 or 177576)
 */
DevicePDP11.prototype.writeMMR2 = function(data, addr)
{
    this.cpu.regMMR2 = data;
};

/**
 * readMMR3(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.MMR3 or 172516)
 * @return {number}
 */
DevicePDP11.prototype.readMMR3 = function(addr)
{
    return this.cpu.regMMR3;
};

/**
 * writeMMR3(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.MMR3 or 172516)
 */
DevicePDP11.prototype.writeMMR3 = function(data, addr)
{
    this.cpu.setMMR3(data);
    this.updateDisplayMode();
};

/**
 * updateDisplayMode()
 *
 * @this {DevicePDP11}
 */
DevicePDP11.prototype.updateDisplayMode = function()
{
    /*
     * Set bit to 1 (22-bit), 2 (18-bit), or 4 (16-bit)
     */
    var bit = this.cpu.mmuEnable? ((this.cpu.regMMR3 & PDP11.MMR3.MMU_22BIT)? 1 : 2) : 4;
    this.display.misc = (this.display.misc & ~7) | bit;
};

/**
 * readSISDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SISDR0--SISDR7 or 172200--172216)
 * @return {number}
 */
DevicePDP11.prototype.readSISDR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPDR[1][reg];
};

/**
 * writeSISDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.SISDR0--SISDR7 or 172200--172216)
 */
DevicePDP11.prototype.writeSISDR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPDR[1][reg] = data & 0xff0f;
};

/**
 * readSDSDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SDSDR0--SDSDR7 or 172220--172236)
 * @return {number}
 */
DevicePDP11.prototype.readSDSDR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPDR[1][reg];
};

/**
 * writeSDSDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.SDSDR0--SDSDR7 or 172220--172236)
 */
DevicePDP11.prototype.writeSDSDR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPDR[1][reg] = data & 0xff0f;
};

/**
 * readSISAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SISAR0--SISAR7 or 172240--172256)
 * @return {number}
 */
DevicePDP11.prototype.readSISAR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPAR[1][reg];
};

/**
 * writeSISAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.SISAR0--SISAR7 or 172240--172256)
 */
DevicePDP11.prototype.writeSISAR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPAR[1][reg] = data;
    this.cpu.mmuPDR[1][reg] &= 0xff0f;

};

/**
 * readSDSAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SDSAR0--SDSAR7 or 172260--172276)
 * @return {number}
 */
DevicePDP11.prototype.readSDSAR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPAR[1][reg];
};

/**
 * writeSDSAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.SDSAR0--SDSAR7 or 172260--172276)
 */
DevicePDP11.prototype.writeSDSAR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPAR[1][reg] = data;
    this.cpu.mmuPDR[1][reg] &= 0xff0f;
};

/**
 * readKISDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.KISDR0--KISDR7 or 172300--172316)
 * @return {number}
 */
DevicePDP11.prototype.readKISDR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPDR[0][reg];
};

/**
 * writeKISDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.KISDR0--KISDR7 or 172300--172316)
 */
DevicePDP11.prototype.writeKISDR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPDR[0][reg] = data & 0xff0f;
};

/**
 * readKDSDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.KDSDR0--KDSDR7 or 172320--172336)
 * @return {number}
 */
DevicePDP11.prototype.readKDSDR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPDR[0][reg];
};

/**
 * writeKDSDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.KDSDR0--KDSDR7 or 172320--172336)
 */
DevicePDP11.prototype.writeKDSDR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPDR[0][reg] = data & 0xff0f;
};

/**
 * readKISAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.KISAR0--KISAR7 or 172340--172356)
 * @return {number}
 */
DevicePDP11.prototype.readKISAR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPAR[0][reg];
};

/**
 * writeKISAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.KISAR0--KISAR7 or 172340--172356)
 */
DevicePDP11.prototype.writeKISAR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPAR[0][reg] = data;
    this.cpu.mmuPDR[0][reg] &= 0xff0f;

};

/**
 * readKDSAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.KDSAR0--KDSAR7 or 172360--172376)
 * @return {number}
 */
DevicePDP11.prototype.readKDSAR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPAR[0][reg];
};

/**
 * writeKDSAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.KDSAR0--KDSAR7 or 172360--172376)
 */
DevicePDP11.prototype.writeKDSAR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPAR[0][reg] = data;
    this.cpu.mmuPDR[0][reg] &= 0xff0f;
};

/**
 * readUISDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.UISDR0--UISDR7 or 177600--177616)
 * @return {number}
 */
DevicePDP11.prototype.readUISDR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPDR[3][reg];
};

/**
 * writeUISDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.UISDR0--UISDR7 or 177600--177616)
 */
DevicePDP11.prototype.writeUISDR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPDR[3][reg] = data & 0xff0f;
};

/**
 * readUDSDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.UDSDR0--UDSDR7 or 177620--177636)
 * @return {number}
 */
DevicePDP11.prototype.readUDSDR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPDR[3][reg];
};

/**
 * writeUDSDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.UDSDR0--UDSDR7 or 177620--177636)
 */
DevicePDP11.prototype.writeUDSDR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPDR[3][reg] = data & 0xff0f;
};

/**
 * readUISAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.UISAR0--UISAR7 or 177640--177656)
 * @return {number}
 */
DevicePDP11.prototype.readUISAR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPAR[3][reg];
};

/**
 * writeUISAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.UISAR0--UISAR7 or 177640--177656)
 */
DevicePDP11.prototype.writeUISAR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPAR[3][reg] = data;
    this.cpu.mmuPDR[3][reg] &= 0xff0f;

};

/**
 * readUDSAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.UDSAR0--UDSAR7 or 177660--177676)
 * @return {number}
 */
DevicePDP11.prototype.readUDSAR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPAR[3][reg];
};

/**
 * writeUDSAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.UDSAR0--UDSAR7 or 177660--177676)
 */
DevicePDP11.prototype.writeUDSAR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPAR[3][reg] = data;
    this.cpu.mmuPDR[3][reg] &= 0xff0f;
};

/**
 * readRSET0(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.R0SET0--R5SET0 or 177700--177705)
 * @return {number}
 */
DevicePDP11.prototype.readRSET0 = function(addr)
{
    var data;
    var reg = addr & 7;
    if (this.cpu.regPSW & PDP11.PSW.REGSET) {
        data = this.cpu.regsAlt[reg];
    } else {
        data = this.cpu.regsGen[reg];
    }
    return data;
};

/**
 * writeRSET0(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.R0SET0--R5SET0 or 177700--177705)
 */
DevicePDP11.prototype.writeRSET0 = function(data, addr)
{
    var reg = addr & 7;
    if (this.cpu.regPSW & PDP11.PSW.REGSET) {
        this.cpu.regsAlt[reg] = data;
    } else {
        this.cpu.regsGen[reg] = data;
    }
};

/**
 * readR6KERNEL(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.R6KERNEL or 177706)
 * @return {number}
 */
DevicePDP11.prototype.readR6KERNEL = function(addr)
{
    var data;
    if (!(this.cpu.regPSW & PDP11.PSW.CMODE)) {         // Kernel Mode
        data = this.cpu.regsGen[6];
    } else {
        data = this.cpu.regsAltStack[0];
    }
    return data;
};

/**
 * writeR6KERNEL(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.R6KERNEL or 177706)
 */
DevicePDP11.prototype.writeR6KERNEL = function(data, addr)
{
    if (!(this.cpu.regPSW & PDP11.PSW.CMODE)) {         // Kernel Mode
        this.cpu.regsGen[6] = data;
    } else {
        this.cpu.regsAltStack[0] = data;
    }
};

/**
 * readR7KERNEL(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.R7KERNEL or 177707)
 * @return {number}
 */
DevicePDP11.prototype.readR7KERNEL = function(addr)
{
    return this.cpu.regsGen[7];
};

/**
 * writeR7KERNEL(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.R7KERNEL or 177707)
 */
DevicePDP11.prototype.writeR7KERNEL = function(data, addr)
{
    this.cpu.regsGen[7] = data;
};

/**
 * readRSET1(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.R0SET1--R5SET1 or 177710--177715)
 * @return {number}
 */
DevicePDP11.prototype.readRSET1 = function(addr)
{
    var data;
    var reg = addr & 7;
    if (this.cpu.regPSW & PDP11.PSW.REGSET) {
        data = this.cpu.regsGen[reg];
    } else {
        data = this.cpu.regsAlt[reg];
    }
    return data;
};

/**
 * writeRSET1(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.R0SET1--R5SET1 or 177710--177715)
 */
DevicePDP11.prototype.writeRSET1 = function(data, addr)
{
    var reg = addr & 7;
    if (this.cpu.regPSW & PDP11.PSW.REGSET) {
        this.cpu.regsGen[reg] = data;
    } else {
        this.cpu.regsAlt[reg] = data;
    }
};

/**
 * readR6SUPER(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.R6SUPER or 177716)
 * @return {number}
 */
DevicePDP11.prototype.readR6SUPER = function(addr)
{
    var data;
    if (((this.cpu.regPSW & PDP11.PSW.CMODE) >> PDP11.PSW.SHIFT.CMODE) == PDP11.MODE.SUPER) {
        data = this.cpu.regsGen[6];
    } else {
        data = this.cpu.regsAltStack[1];
    }
    return data;
};

/**
 * writeR6SUPER(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.R6SUPER or 177716)
 */
DevicePDP11.prototype.writeR6SUPER = function(data, addr)
{
    if (((this.cpu.regPSW & PDP11.PSW.CMODE) >> PDP11.PSW.SHIFT.CMODE) == PDP11.MODE.SUPER) {
        this.cpu.regsGen[6] = data;
    } else {
        this.cpu.regsAltStack[1] = data;
    }
};

/**
 * readR6USER(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.R6USER or 177717)
 * @return {number}
 */
DevicePDP11.prototype.readR6USER = function(addr)
{
    var data;
    if (((this.cpu.regPSW & PDP11.PSW.CMODE) >> PDP11.PSW.SHIFT.CMODE) == PDP11.MODE.USER) {
        data = this.cpu.regsGen[6];
    } else {
        data = this.cpu.regsAltStack[3];
    }
    return data;
};

/**
 * writeR6USER(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.R6USER or 177717)
 */
DevicePDP11.prototype.writeR6USER = function(data, addr)
{
    if (((this.cpu.regPSW & PDP11.PSW.CMODE) >> PDP11.PSW.SHIFT.CMODE) == PDP11.MODE.USER) {
        this.cpu.regsGen[6] = data;
    } else {
        this.cpu.regsAltStack[3] = data;
    }
};

/**
 * readCTRL(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.LAERR--UNDEF2 or 177740--177756)
 * @return {number}
 */
DevicePDP11.prototype.readCTRL = function(addr)
{
    var reg = (addr - PDP11.UNIBUS.LAERR) >> 1;
    return this.cpu.regsControl[reg];
};

/**
 * writeCTRL(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.LAERR--UNDEF2 or 177740--177756)
 */
DevicePDP11.prototype.writeCTRL = function(data, addr)
{
    var reg = (addr - PDP11.UNIBUS.LAERR) >> 1;
    this.cpu.regsControl[reg] = data;
};

/**
 * readSIZE(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.LSIZE--HSIZE or 177760--177762)
 * @return {number}
 */
DevicePDP11.prototype.readSIZE = function(addr)
{
    return addr == PDP11.UNIBUS.LSIZE? ((BusPDP11.MAX_MEMORY >> 6) - 1) : 0;
};

/**
 * writeSIZE(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.LSIZE--HSIZE or 177760--177762)
 */
DevicePDP11.prototype.writeSIZE = function(data, addr)
{
};

/**
 * readSYSID(addr)
 *
 * TODO: For SYSID, we currently ignore writes and return 1 on reads
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SYSID or 177764)
 * @return {number}
 */
DevicePDP11.prototype.readSYSID = function(addr)
{
    return 1;
};

/**
 * writeSYSID(data, addr)
 *
 * TODO: For SYSID, we currently ignore writes and return 1 on reads
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.SYSID or 177764)
 */
DevicePDP11.prototype.writeSYSID = function(data, addr)
{
};

/**
 * readCPUERR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.CPUERR or 177766)
 * @return {number}
 */
DevicePDP11.prototype.readCPUERR = function(addr)
{
    return this.cpu.regErr;
};

/**
 * writeCPUERR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.CPUERR or 177766)
 */
DevicePDP11.prototype.writeCPUERR = function(data, addr)
{
    this.cpu.regErr = 0;        // TODO: Confirm that writes always zero the register
};

/**
 * readMB(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.MB or 177770)
 * @return {number}
 */
DevicePDP11.prototype.readMB = function(addr)
{
    return this.cpu.regMB;
};

/**
 * writeMB(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.MB or 177770)
 */
DevicePDP11.prototype.writeMB = function(data, addr)
{
    if (!(addr & 0x1)) data &= 0xff;    // Required for KB11-CM without MFPT instruction
    this.cpu.regMB = data;
};

/**
 * readPIR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.PIR or 177772)
 * @return {number}
 */
DevicePDP11.prototype.readPIR = function(addr)
{
    return this.cpu.getPIR();
};

/**
 * writePIR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.PIR or 177772)
 */
DevicePDP11.prototype.writePIR = function(data, addr)
{
    this.cpu.setPIR(data);
};

/**
 * readSL(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SL or 177774)
 * @return {number}
 */
DevicePDP11.prototype.readSL = function(addr)
{
    return this.cpu.getSL();
};

/**
 * writeSL(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.SL or 177774)
 */
DevicePDP11.prototype.writeSL = function(data, addr)
{
    this.cpu.setSL(data);
};

/**
 * readPSW(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.PSW or 177776)
 * @return {number}
 */
DevicePDP11.prototype.readPSW = function(addr)
{
    return this.cpu.getPSW();
};

/**
 * writePSW(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.PSW or 177776)
 */
DevicePDP11.prototype.writePSW = function(data, addr)
{
    var maskDisallowed = PDP11.PSW.UNUSED | PDP11.PSW.TF;
    this.cpu.setPSW((data & ~maskDisallowed) | (this.cpu.getPSW() & maskDisallowed));
    this.cpu.opFlags |= PDP11.OPFLAG.NO_FLAGS;
};

/**
 * kw11_interrupt()
 *
 * @this {DevicePDP11}
 */
DevicePDP11.prototype.kw11_interrupt = function()
{
    this.kw11.lks |= PDP11.KW11.LKS.MON;
    if (this.kw11.lks & PDP11.KW11.LKS.IE) {
        this.cpu.interrupt(PDP11.KW11.DELAY, PDP11.KW11.PRI, PDP11.KW11.VEC);
        this.cpu.setTimer(this.kw11.timer, 1000/60);
    }
};

/**
 * reset()
 *
 * Formerly reset_iopage().
 *
 * @this {DevicePDP11}
 */
DevicePDP11.prototype.reset = function()
{
    this.display.misc = (this.display.misc & ~0x77) | 0x14; // kernel 16 bit
    this.kw11.lks = 0;
};

/*
 * ES6 ALERT: As you can see below, I've finally started using computed property names.
 */
DevicePDP11.UNIBUS_IOTABLE = {
    [PDP11.UNIBUS.SISDR0]:  /* 172200 */    [null, null, DevicePDP11.prototype.readSISDR,   DevicePDP11.prototype.writeSISDR,   "SISDR"],
    [PDP11.UNIBUS.SDSDR0]:  /* 172220 */    [null, null, DevicePDP11.prototype.readSDSDR,   DevicePDP11.prototype.writeSDSDR,   "SDSDR"],
    [PDP11.UNIBUS.SISAR0]:  /* 172240 */    [null, null, DevicePDP11.prototype.readSISAR,   DevicePDP11.prototype.writeSISAR,   "SISAR"],
    [PDP11.UNIBUS.SDSAR0]:  /* 172260 */    [null, null, DevicePDP11.prototype.readSDSAR,   DevicePDP11.prototype.writeSDSAR,   "SDSAR"],
    [PDP11.UNIBUS.KISDR0]:  /* 172300 */    [null, null, DevicePDP11.prototype.readKISDR,   DevicePDP11.prototype.writeKISDR,   "KISDR"],
    [PDP11.UNIBUS.KDSDR0]:  /* 172320 */    [null, null, DevicePDP11.prototype.readKDSDR,   DevicePDP11.prototype.writeKDSDR,   "KDSDR"],
    [PDP11.UNIBUS.KISAR0]:  /* 172340 */    [null, null, DevicePDP11.prototype.readKISAR,   DevicePDP11.prototype.writeKISAR,   "KISAR"],
    [PDP11.UNIBUS.KDSAR0]:  /* 172360 */    [null, null, DevicePDP11.prototype.readKDSAR,   DevicePDP11.prototype.writeKDSAR,   "KDSAR"],
    [PDP11.UNIBUS.MMR3]:    /* 172516 */    [null, null, DevicePDP11.prototype.readMMR3,    DevicePDP11.prototype.writeMMR3,    "MMR3"],
    [PDP11.UNIBUS.LKS]:     /* 177546 */    [null, null, DevicePDP11.prototype.readLKS,     DevicePDP11.prototype.writeLKS,     "LKS"],
    [PDP11.UNIBUS.MMR0]:    /* 177572 */    [null, null, DevicePDP11.prototype.readMMR0,    DevicePDP11.prototype.writeMMR0,    "MMR0"],
    [PDP11.UNIBUS.MMR1]:    /* 177574 */    [null, null, DevicePDP11.prototype.readMMR1,    null,                               "MMR1"],
    [PDP11.UNIBUS.MMR2]:    /* 177576 */    [null, null, DevicePDP11.prototype.readMMR2,    null,                               "MMR2"],
    [PDP11.UNIBUS.UISDR0]:  /* 177600 */    [null, null, DevicePDP11.prototype.readUISDR,   DevicePDP11.prototype.writeUISDR,   "UISDR"],
    [PDP11.UNIBUS.UDSDR0]:  /* 177620 */    [null, null, DevicePDP11.prototype.readUDSDR,   DevicePDP11.prototype.writeUDSDR,   "UDSDR"],
    [PDP11.UNIBUS.UISAR0]:  /* 177640 */    [null, null, DevicePDP11.prototype.readUISAR,   DevicePDP11.prototype.writeUISAR,   "UISAR"],
    [PDP11.UNIBUS.UDSAR0]:  /* 177660 */    [null, null, DevicePDP11.prototype.readUDSAR,   DevicePDP11.prototype.writeUDSAR,   "UDSAR"],
    [PDP11.UNIBUS.R0SET0]:  /* 177700 */    [DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   DevicePDP11.prototype.readRSET0,    DevicePDP11.prototype.writeRSET0,   "R0SET0"],
    [PDP11.UNIBUS.R1SET0]:  /* 177701 */    [DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   DevicePDP11.prototype.readRSET0,    DevicePDP11.prototype.writeRSET0,   "R1SET0"],
    [PDP11.UNIBUS.R2SET0]:  /* 177702 */    [DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   DevicePDP11.prototype.readRSET0,    DevicePDP11.prototype.writeRSET0,   "R2SET0"],
    [PDP11.UNIBUS.R3SET0]:  /* 177703 */    [DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   DevicePDP11.prototype.readRSET0,    DevicePDP11.prototype.writeRSET0,   "R3SET0"],
    [PDP11.UNIBUS.R4SET0]:  /* 177704 */    [DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   DevicePDP11.prototype.readRSET0,    DevicePDP11.prototype.writeRSET0,   "R4SET0"],
    [PDP11.UNIBUS.R5SET0]:  /* 177705 */    [DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   DevicePDP11.prototype.readRSET0,    DevicePDP11.prototype.writeRSET0,   "R5SET0"],
    [PDP11.UNIBUS.R6KERNEL]:/* 177706 */    [DevicePDP11.prototype.readR6KERNEL,DevicePDP11.prototype.writeR6KERNEL,DevicePDP11.prototype.readR6KERNEL, DevicePDP11.prototype.writeR6KERNEL,"R6KERNEL"],
    [PDP11.UNIBUS.R7KERNEL]:/* 177707 */    [DevicePDP11.prototype.readR7KERNEL,DevicePDP11.prototype.writeR7KERNEL,DevicePDP11.prototype.readR7KERNEL, DevicePDP11.prototype.writeR7KERNEL,"R7KERNEL"],
    [PDP11.UNIBUS.R0SET1]:  /* 177710 */    [DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   DevicePDP11.prototype.readRSET1,    DevicePDP11.prototype.writeRSET1,   "R0SET1"],
    [PDP11.UNIBUS.R1SET1]:  /* 177711 */    [DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   DevicePDP11.prototype.readRSET1,    DevicePDP11.prototype.writeRSET1,   "R1SET1"],
    [PDP11.UNIBUS.R2SET1]:  /* 177712 */    [DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   DevicePDP11.prototype.readRSET1,    DevicePDP11.prototype.writeRSET1,   "R2SET1"],
    [PDP11.UNIBUS.R3SET1]:  /* 177713 */    [DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   DevicePDP11.prototype.readRSET1,    DevicePDP11.prototype.writeRSET1,   "R3SET1"],
    [PDP11.UNIBUS.R4SET1]:  /* 177714 */    [DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   DevicePDP11.prototype.readRSET1,    DevicePDP11.prototype.writeRSET1,   "R4SET1"],
    [PDP11.UNIBUS.R5SET1]:  /* 177715 */    [DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   DevicePDP11.prototype.readRSET1,    DevicePDP11.prototype.writeRSET1,   "R5SET1"],
    [PDP11.UNIBUS.R6SUPER]: /* 177716 */    [DevicePDP11.prototype.readR6SUPER, DevicePDP11.prototype.writeR6SUPER, DevicePDP11.prototype.readR6SUPER,  DevicePDP11.prototype.writeR6SUPER, "R6SUPER"],
    [PDP11.UNIBUS.R6USER]:  /* 177717 */    [DevicePDP11.prototype.readR6USER,  DevicePDP11.prototype.writeR6USER,  DevicePDP11.prototype.readR6USER,   DevicePDP11.prototype.writeR6USER,  "R6USER"],
    [PDP11.UNIBUS.LAERR]:   /* 177740 */    [null, null, DevicePDP11.prototype.readCTRL,    DevicePDP11.prototype.writeCTRL,    "CTRL",     PDP11.MODEL_1170],
    [PDP11.UNIBUS.LSIZE]:   /* 177760 */    [null, null, DevicePDP11.prototype.readSIZE,    DevicePDP11.prototype.writeSIZE,    "LSIZE",    PDP11.MODEL_1170],
    [PDP11.UNIBUS.HSIZE]:   /* 177762 */    [null, null, DevicePDP11.prototype.readSIZE,    DevicePDP11.prototype.writeSIZE,    "HSIZE",    PDP11.MODEL_1170],
    [PDP11.UNIBUS.SYSID]:   /* 177764 */    [null, null, DevicePDP11.prototype.readSYSID,   DevicePDP11.prototype.writeSYSID,   "SYSID",    PDP11.MODEL_1170],
    [PDP11.UNIBUS.CPUERR]:  /* 177766 */    [null, null, DevicePDP11.prototype.readCPUERR,  DevicePDP11.prototype.writeCPUERR,  "CPUERR",   PDP11.MODEL_1170],
    [PDP11.UNIBUS.MB]:      /* 177770 */    [null, null, DevicePDP11.prototype.readMB,      DevicePDP11.prototype.writeMB,      "MB",       PDP11.MODEL_1170],
    [PDP11.UNIBUS.PIR]:     /* 177772 */    [null, null, DevicePDP11.prototype.readPIR,     DevicePDP11.prototype.writePIR,     "PIR"],
    [PDP11.UNIBUS.SL]:      /* 177774 */    [null, null, DevicePDP11.prototype.readSL,      DevicePDP11.prototype.writeSL,      "SL"],
    [PDP11.UNIBUS.PSW]:     /* 177776 */    [null, null, DevicePDP11.prototype.readPSW,     DevicePDP11.prototype.writePSW,     "PSW"]
};

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISDR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSDR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SISAR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.SDSAR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISDR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSDR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KISAR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.KDSAR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISDR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSDR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UISAR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR3] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR4] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR5] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR6] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR0];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR7] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UDSAR0];

DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.HAERR]  = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.LAERR];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.MEMERR] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.LAERR];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.CACHEC] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.LAERR];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.MAINT]  = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.LAERR];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.HITMISS]= DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.LAERR];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UNDEF1] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.LAERR];
DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.UNDEF2] = DevicePDP11.UNIBUS_IOTABLE[PDP11.UNIBUS.LAERR];

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
        switch(parmsDevice['name']) {
        case 'default':
            var device = new DevicePDP11(parmsDevice);
            Component.bindComponentControls(device, eDevice, PDP11.APPCLASS);
            break;
        }
    }
};

/*
 * Initialize all the DevicePDP11 modules on the page.
 */
web.onInit(DevicePDP11.init);

if (NODE) module.exports = DevicePDP11;
