/**
 * @fileoverview Implements PDP11 device support.
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
    var BusPDP11    = require("./bus");
}

/**
 * DevicePDP11(parmsDevice)
 *
 * The DevicePDP11 component supports the following (parmsDevice) properties:
 *
 *      name: the name of the device to be supported (eg, "unibus" for generic UNIBUS support)
 *
 * TODO: This is currently a "catch-all" device; ideally, each of the assorted devices emulated here
 * (eg, KW11, RK11, RL11, etc) would be a separate component.  But because we're in the middle of porting
 * all this code from a common module (iopage.js), that's the way it is.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsDevice
 */
function DevicePDP11(parmsDevice)
{
    Component.call(this, "Device", parmsDevice, DevicePDP11);
    this.sDeviceName = parmsDevice['name'];

    this.tty = {
        rbuf: [],
        rcsr: 0,
        xcsr: 0x80, /*0200*/
        delCode: 127,
        del: 0
    };

    this.display = {
        data: 0,
        address: 0,
        misc: 0x14,
        switches: 0
    };

    this.kw11 = {
        init: 0,
        csr: 0
    };

    this.rk11 = {
        rkds: 0x9C0, /*04700*/ // 017777400 Drive Status
        rker: 0, // 017777402 Error Register
        rkcs: 0x80, /*0200*/ // 017777404 Control Status
        rkwc: 0, // 017777406 Word Count
        rkba: 0, // 017777410 Bus Address
        rkda: 0, // 017777412 Disk Address
        rkdb: 0, // 017777416 Data Buffer
        meta: [],
        TRACKS: [406, 406, 406, 406],
        SECTORS: [12, 12, 12, 12]
    };

    this.rl11 = {
        csr: 0x81, // 017774400 Control status register
        bar: 0, // 017774402 Bus address
        dar: 0, // 017774404 Disk address
        mpr: 0, // 017774406 Multi purpose
        bae: 0, // 017774410 Bus address extension
        DAR: 0, // internal disk address
        meta: [], // sector cache
        SECTORS: [40, 40, 40, 40], // sectors per track
        TRACKS: [1024, 1024, 512, 512], // First two drives RL02 - last two RL01 - cylinders * 2
        STATUS: [0x9D /*0235*/, 0x9D /*0235*/, 0x1D /*035*/, 0x1D /*035*/] // First two drives RL02 - last two RL01
    };

    this.rp11 = {
        DTYPE: [0x2012 /*020022*/, 0x2010 /*020020*/, 0x2012 /*020022*/, 0x2022 /*020042*/], // Drive type rp04, rp06, rp07
        SECTORS: [22, 22, 22, 50], // sectors per track
        SURFACES: [19, 19, 19, 32], //
        CYLINDERS: [815, 411, 815, 630],
        meta: [], //meta data for drive
        rpcs1: 0x880, // Massbus 00 - actual register is a mix of controller and drive bits :-(
        rpwc: 0,
        rpba: 0,
        rpda: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 05
        rpcs2: 0,
        rpds: [0x11c0, 0x11c0, 0x11c0, 0x11c0, 0x11c0, 0x11c0, 0x11c0, 0x11c0], // Massbus 01 Read only
        rper1: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 02
        rpas: 0, // Massbus 04???
        rpla: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 07 Read only
        rpdb: 0,
        rpmr: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 03
        rpdt: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 06 Read only
        rpsn: [1, 2, 3, 4, 5, 6, 7, 8], // Massbus 10 Read only
        rpof: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 11
        rpdc: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 12
        rpcc: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 13 Read only
        rper2: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 14
        rper3: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 15
        rpec1: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 16 Read only
        rpec2: [0, 0, 0, 0, 0, 0, 0, 0], // Massbus 17 Read only
        rpbae: 0,
        rpcs3: 0
    };
}

Component.subclass(DevicePDP11);

DevicePDP11.UNIBUS_NAME = "unibus";
DevicePDP11.ADDR_PSW    = 0x3FFFFE; /*017777776*/       // PSW

DevicePDP11.M9312 = [
    0x101F, /*0010037*/ 0x1C0, /*0000700*/ 0x105F, /*0010137*/ 0x1C2, /*0000702*/ 0x111F, /*0010437*/ 0x1C4, /*0000704*/ 0xA1F, /*0005037*/ 0x1C6, /*0000706*/
    0x55DF, /*0052737*/ 0x8000, /*0100000*/ 0xFFFE, /*0177776*/ 0x35DF, /*0032737*/ 0x4000, /*0040000*/ 0xFFFE, /*0177776*/ 0x302, /*0001402*/ 0xA9F, /*0005237*/
    0x1C6, /*0000706*/ 0xA1F, /*0005037*/ 0xFFFE, /*0177776*/ 0x101, /*0000401*/ 0x0, /*0000000*/ 0xA06, /*0005006*/ 0x8104, /*0100404*/ 0x8503, /*0102403*/
    0x8202, /*0101002*/ 0x501, /*0002401*/ 0x8301, /*0101401*/ 0x0, /*0000000*/ 0xAC6, /*0005306*/ 0x8003, /*0100003*/ 0x302, /*0001402*/ 0x401, /*0002001*/
    0x701, /*0003401*/ 0x0, /*0000000*/ 0xC06, /*0006006*/ 0x8402, /*0102002*/ 0x8601, /*0103001*/ 0x201, /*0001001*/ 0x0, /*0000000*/ 0x15C6, /*0012706*/
    0xAAAA, /*0125252*/ 0x1180, /*0010600*/ 0x1001, /*0010001*/ 0x1042, /*0010102*/ 0x1083, /*0010203*/ 0x10C4, /*0010304*/ 0x1105, /*0010405*/ 0xE141, /*0160501*/
    0x501, /*0002401*/ 0x301, /*0001401*/ 0x0, /*0000000*/ 0xC42, /*0006102*/ 0x8601, /*0103001*/ 0x501, /*0002401*/ 0x0, /*0000000*/ 0x6083, /*0060203*/
    0xA83, /*0005203*/ 0xA43, /*0005103*/ 0x60C1, /*0060301*/ 0x8701, /*0103401*/ 0x701, /*0003401*/ 0x0, /*0000000*/ 0xC04, /*0006004*/ 0x5103, /*0050403*/
    0x6143, /*0060503*/ 0xA83, /*0005203*/ 0x8702, /*0103402*/ 0xAC1, /*0005301*/ 0x501, /*0002401*/ 0x0, /*0000000*/ 0xA40, /*0005100*/ 0x8301, /*0101401*/
    0x0, /*0000000*/ 0x4001, /*0040001*/ 0x6041, /*0060101*/ 0x601, /*0003001*/ 0x701, /*0003401*/ 0x0, /*0000000*/ 0xC1, /*0000301*/ 0x2057, /*0020127*/
    0x5455, /*0052125*/ 0x204, /*0001004*/ 0x3105, /*0030405*/ 0x602, /*0003002*/ 0xA45, /*0005105*/ 0x201, /*0001001*/ 0x0, /*0000000*/ 0x95C0, /*0112700*/
    0xFF01, /*0177401*/ 0x8001, /*0100001*/ 0x0, /*0000000*/ 0x7E02, /*0077002*/ 0xA01, /*0005001*/ 0xA81, /*0005201*/ 0x7E02, /*0077002*/ 0xBC0, /*0005700*/
    0x202, /*0001002*/ 0xBC1, /*0005701*/ 0x301, /*0001401*/ 0x0, /*0000000*/ 0x15C6, /*0012706*/ 0x1FE, /*0000776*/ 0x9F7, /*0004767*/ 0x2, /*0000002*/
    0x0, /*0000000*/ 0x25CE, /*0022716*/ 0xD0, /*0000320*/ 0x301, /*0001401*/ 0x0, /*0000000*/ 0x15CE, /*0012716*/ 0xE2, /*0000342*/ 0x87, /*0000207*/
    0x0, /*0000000*/ 0xA26, /*0005046*/ 0x15E6, /*0012746*/ 0xEC, /*0000354*/ 0x2, /*0000002*/ 0x0, /*0000000*/ 0x5F, /*0000137*/ 0xF2, /*0000362*/
    0x80, /*0000200*/ 0x15C5, /*0012705*/ 0xE000, /*0160000*/ 0xA1F, /*0005037*/ 0x6, /*0000006*/ 0x15DF, /*0012737*/ 0x100, /*0000400*/ 0x4, /*0000004*/
    0x15C6, /*0012706*/ 0x1FE, /*0000776*/ 0xBE5, /*0005745*/ 0x15DF, /*0012737*/ 0x1CC, /*0000714*/ 0x4C, /*0000114*/ 0xA1F, /*0005037*/ 0x4E, /*0000116*/
    0x15C3, /*0012703*/ 0xFFE6, /*0177746*/ 0x15CB, /*0012713*/ 0xC, /*0000014*/ 0x15C2, /*0012702*/ 0x200, /*0001000*/ 0x1080, /*0010200*/ 0x1008, /*0010010*/
    0xBD0, /*0005720*/ 0x2005, /*0020005*/ 0x83FC, /*0101774*/ 0x1080, /*0010200*/ 0x1201, /*0011001*/ 0x2001, /*0020001*/ 0x301, /*0001401*/ 0x0, /*0000000*/
    0xA50, /*0005120*/ 0x2005, /*0020005*/ 0x83F9, /*0101771*/ 0x1801, /*0014001*/ 0xA41, /*0005101*/ 0x2001, /*0020001*/ 0x301, /*0001401*/ 0x0, /*0000000*/
    0x2002, /*0020002*/ 0x2F9, /*0001371*/ 0xA0E, /*0005016*/ 0x15C4, /*0012704*/ 0xAAAA, /*0125252*/ 0x15CB, /*0012713*/ 0x18, /*0000030*/ 0x15C0, /*0012700*/
    0x800, /*0004000*/ 0x15C2, /*0012702*/ 0x200, /*0001000*/ 0xA44, /*0005104*/ 0x1108, /*0010410*/ 0xA48, /*0005110*/ 0xA48, /*0005110*/ 0x2204, /*0021004*/
    0x301, /*0001401*/ 0x0, /*0000000*/ 0xC1F, /*0006037*/ 0xFFEA, /*0177752*/ 0x8702, /*0103402*/ 0x0, /*0000000*/ 0x131, /*0000461*/ 0x8A4E, /*0105116*/
    0x2F2, /*0001362*/ 0x102, /*0000402*/ 0x77, /*0000167*/ 0xFE88, /*0177210*/ 0xBD0, /*0005720*/ 0x7E93, /*0077223*/ 0x15CB, /*0012713*/ 0x24, /*0000044*/
    0x15C0, /*0012700*/ 0xC00, /*0006000*/ 0x8A76, /*0105166*/ 0x1, /*0000001*/ 0x2E4, /*0001344*/ 0x15C2, /*0012702*/ 0x200, /*0001000*/ 0x1080, /*0010200*/
    0x1008, /*0010010*/ 0xBD0, /*0005720*/ 0x2005, /*0020005*/ 0x83FC, /*0101774*/ 0x15C1, /*0012701*/ 0x3, /*0000003*/ 0xA0E, /*0005016*/ 0xBDF, /*0005737*/
    0x1C6, /*0000706*/ 0x210, /*0001020*/ 0x15CE, /*0012716*/ 0x18, /*0000030*/ 0x1080, /*0010200*/ 0xA48, /*0005110*/ 0xA48, /*0005110*/ 0x2008, /*0020010*/
    0x301, /*0001401*/ 0x0, /*0000000*/ 0xBD0, /*0005720*/ 0xC1F, /*0006037*/ 0xFFEA, /*0177752*/ 0x8702, /*0103402*/ 0x0, /*0000000*/ 0x108, /*0000410*/
    0x2005, /*0020005*/ 0x83F3, /*0101763*/ 0x138B, /*0011613*/ 0xA0E, /*0005016*/ 0x7E51, /*0077121*/ 0x104, /*0000404*/ 0x0, /*0000000*/ 0x102, /*0000402*/
    0x15CB, /*0012713*/ 0xC, /*0000014*/ 0x17C0, /*0013700*/ 0x1C0, /*0000700*/ 0x17C1, /*0013701*/ 0x1C2, /*0000702*/ 0x17C4, /*0013704*/ 0x1C4, /*0000704*/
    0x74, /*0000164*/ 0x2, /*0000002*/ 0x17C4, /*0013704*/ 0xFF78, /*0177570*/ 0x45C4, /*0042704*/ 0xFE00, /*0177000*/ 0x55C4, /*0052704*/ 0xF600, /*0173000*/
    0x97C0, /*0113700*/ 0xFF79, /*0177571*/ 0xC80, /*0006200*/ 0xA1, /*0000241*/ 0x4C, /*0000114*/ 0x0, /*0000000*/ 0x4230, /*0041060*/ 0x2A2D /*0025055*/
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
    switch(this.sDeviceName) {
    case DevicePDP11.UNIBUS_NAME:
    default:
        bus.addIOTable(this, DevicePDP11.UNIBUS_TABLE);
        bus.addIODefaultHandlers(this.reset.bind(this), this.access.bind(this));
        break;
    }
    this.setReady();
};

/**
 * readPSW(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr
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
 * @param {number} addr
 */
DevicePDP11.prototype.writePSW = function(data, addr)
{
    /*
     * TODO: Review the next line, which mimics access(), and determine if writePSW() can do this itself.
     */
    data = (data & 0xf8ef) | (this.cpu.readPSW() & 0x0710);
    this.cpu.writePSW(data);
};

/**
 * rk11_go()
 *
 * @this {DevicePDP11}
 */
DevicePDP11.prototype.rk11_go = function()
{
    var rk11 = this.rk11;
    var sector, address, count;
    var drive = (rk11.rkda >> 13) & 7;
    if (typeof rk11.meta[drive] === "undefined") {
        rk11.meta[drive] = {
            "cache": [],
            "postProcess": this.rk11_end,
            "drive": drive,
            "blocksize": 256,
            "mapped": 0,
            "maxblock": rk11.TRACKS[drive] * rk11.SECTORS[drive],
            "url": "rk" + drive + ".dsk"
        };
    }
    rk11.rkcs &= ~0x80; // turn off done bit
    switch ((rk11.rkcs >> 1) & 7) { // function code
        case 0: // controller reset
            rk11.rkds = 0x9C0; /*04700*/ // Set bits 6, 7, 8, 11
            rk11.rker = 0; //
            rk11.rkcs = 0x80; /*0200*/
            rk11.rkda = 0;
            break;
        case 1: // write
            if (((rk11.rkda >> 4) & 0x1ff) >= rk11.TRACKS[drive]) {
                rk11.rker |= 0x8040; // NXC
                rk11.rkcs |= 0xc000; // err
                break;
            }
            if ((rk11.rkda & 0xf) >= rk11.SECTORS[drive]) {
                rk11.rker |= 0x8020; // NXS
                rk11.rkcs |= 0xc000; // err
                break;
            }
            sector = (((rk11.rkda >> 4) & 0x1ff) * rk11.SECTORS[drive] + (rk11.rkda & 0xf));
            address = (((rk11.rkcs & 0x30)) << 12) | rk11.rkba;
            count = (0x10000 - rk11.rkwc) & 0xffff;
            this.writeData(rk11.meta[drive], sector, address, count);
            return;
        case 2: // read
            if (((rk11.rkda >> 4) & 0x1ff) >= rk11.TRACKS[drive]) {
                rk11.rker |= 0x8040; // NXC
                rk11.rkcs |= 0xc000; // err
                break;
            }
            if ((rk11.rkda & 0xf) >= rk11.SECTORS[drive]) {
                rk11.rker |= 0x8020; // NXS
                rk11.rkcs |= 0xc000; // err
                break;
            }
            sector = (((rk11.rkda >> 4) & 0x1ff) * rk11.SECTORS[drive] + (rk11.rkda & 0xf));
            address = (((rk11.rkcs & 0x30)) << 12) | rk11.rkba;
            count = (0x10000 - rk11.rkwc) & 0xffff;
            this.readData(rk11.meta[drive], sector, address, count);
            return;
        case 3: // Write Check
            break;
        case 4: // Seek - complete immediately
            break;
        default:
            break;
    }
    rk11.rkds = (drive << 13) | (rk11.rkds & 0x1ff0) | ((rk11.rkda % 9) & 0xf);
    this.cpu.interrupt(20, 5 << 5, 0x90, /*0220*/ function() {
        rk11.rkcs = (rk11.rkcs & 0xfffe) | 0x80; // turn off go & set done
        return !!(rk11.rkcs & 0x40);
    });
};

/**
 * rk11_end(err, meta, block, address, count)
 *
 * @this {DevicePDP11}
 * @param {number} err
 * @param {Object} meta
 * @param {number} block
 * @param {number} address
 * @param {number} count
 */
DevicePDP11.prototype.rk11_end = function(err, meta, block, address, count)
{
    var rk11 = this.rk11;
    rk11.rkba = address & 0xffff;
    rk11.rkcs = (rk11.rkcs & ~0x30) | ((address >> 12) & 0x30);
    rk11.rkwc = (0x10000 - count) & 0xffff;
    switch (err) {
        case 1: // read error
            rk11.rker |= 0x8100; // Report TE (Timing error)
            rk11.rkcs |= 0xc000; // err
            break;
        case 2: // NXM
            rk11.rker |= 0x8400; // NXM
            rk11.rkcs |= 0xc000; // err
            break;
    }
    this.cpu.interrupt(20, 5 << 5, 0x90, /*0220*/ function() {
        rk11.rkcs = (rk11.rkcs & 0xfffe) | 0x80; // turn off go & set done
        return !!(rk11.rkcs & 0x40);
    });
};

/**
 * rl11_go()
 *
 * @this {DevicePDP11}
 */
DevicePDP11.prototype.rl11_go = function()
{
    var rl11 = this.rl11;
    var sector, address, count;
    var drive = (rl11.csr >> 8) & 3;
    rl11.csr &= ~0x1; // ready bit (0!)
    if (typeof rl11.meta[drive] === "undefined") {
        rl11.meta[drive] = {
            "cache": [],
            "postProcess": this.rl11_end,
            "drive": drive,
            "blocksize": 128,
            "mapped": 1,
            "maxblock": rl11.TRACKS[drive] * rl11.SECTORS[drive],
            "url": "rl" + drive + ".dsk"
        };
    }
    switch ((rl11.csr >> 1) & 7) { // function code
        case 0: // no op
            break;
        case 1: // write check
            break;
        case 2: // get status
            if (rl11.mpr & 8) rl11.csr &= 0x3f;
            rl11.mpr = rl11.STATUS[drive] | (rl11.DAR & 0x40) /*0100*/; // bit 6 Head Select bit 7 Drive Type 1=rl02
            break;
        case 3: // seek
            if ((rl11.dar & 3) == 1) {
                if (rl11.dar & 4) {
                    rl11.DAR = ((rl11.DAR + (rl11.dar & 0xff80)) & 0xff80) | ((rl11.dar << 2) & 0x40);
                } else {
                    rl11.DAR = ((rl11.DAR - (rl11.dar & 0xff80)) & 0xff80) | ((rl11.dar << 2) & 0x40);
                }
                rl11.dar = rl11.DAR;
            }
            break;
        case 4: // read header
            rl11.mpr = rl11.DAR;
            break;
        case 5: // write
            if ((rl11.dar >> 6) >= rl11.TRACKS[drive]) {
                rl11.csr |= 0x9400; // HNF
                break;
            }
            if ((rl11.dar & 0x3f) >= rl11.SECTORS[drive]) {
                rl11.csr |= 0x9400; // HNF
                break;
            }
            sector = ((rl11.dar >> 6) * rl11.SECTORS[drive]) + (rl11.dar & 0x3f);
            address = (((rl11.bae & 0x3f)) << 16) | rl11.bar; // 22 bit mode
            count = (0x10000 - rl11.mpr) & 0xffff;
            this.writeData(rl11.meta[drive], sector, address, count);
            return;
        case 6: // read
            if ((rl11.dar >> 6) >= rl11.TRACKS[drive]) {
                rl11.csr |= 0x9400; // HNF
                break;
            }
            if ((rl11.dar & 0x3f) >= rl11.SECTORS[drive]) {
                rl11.csr |= 0x9400; // HNF
                break;
            }
            sector = ((rl11.dar >> 6) * rl11.SECTORS[drive]) + (rl11.dar & 0x3f);
            address = (((rl11.bae & 0x3f)) << 16) | rl11.bar; // 22 bit mode
            count = (0x10000 - rl11.mpr) & 0xffff;
            this.readData(rl11.meta[drive], sector, address, count);
            return;
        case 7: // Read data without header check
            break;
    }
    this.cpu.interrupt(20, 5 << 5, 0x70, /*0160*/ function() {
        rl11.csr |= 0x81; // turn off go & set ready
        return !!(rl11.csr & 0x40);
    });
};

/**
 * rl11_end(err, meta, block, address, count)
 *
 * @this {DevicePDP11}
 * @param {number} err
 * @param {Object} meta
 * @param {number} block
 * @param {number} address
 * @param {number} count
 */
DevicePDP11.prototype.rl11_end = function(err, meta, block, address, count)
{
    var rl11 = this.rl11;
    var sector = block;
    rl11.bar = address & 0xffff;
    rl11.csr = (rl11.csr & ~0x30) | ((address >> 12) & 0x30);
    rl11.bae = (address >> 16) & 0x3f; // 22 bit mode
    rl11.dar = ((~~(sector / rl11.SECTORS[meta.drive])) << 6) | (sector % rl11.SECTORS[meta.drive]);
    rl11.DAR = rl11.dar;
    rl11.mpr = (0x10000 - count) & 0xffff;
    switch (err) {
        case 1: // read error
            rl11.csr |= 0x8400; // Report operation incomplete
            break;
        case 2: // NXM
            rl11.csr |= 0xa000; // NXM
            break;
    }
    this.cpu.interrupt(20, 5 << 5, 0x70, /*0160*/ function() {
        rl11.csr |= 0x81; // turn off go & set ready
        return !!(rl11.csr & 0x40);
    });
};

/**
 * rp11_init()
 *
 * @this {DevicePDP11}
 */
DevicePDP11.prototype.rp11_init = function()
{
    var rp11 = this.rp11;
    rp11.rpcs1 = 0x880;
    rp11.rpcs2 = 0;
    rp11.rpds = [0x11c0, 0x11c0, 0x11c0, 0x11c0, 0x11c0, 0x11c0, 0x11c0, 0x11c0];
    rp11.rper1 = [0, 0, 0, 0, 0, 0, 0, 0];
    rp11.rpas = rp11.rpwc = rp11.rpba = rp11.rpbae = rp11.rpcs3 = 0;
};

/**
 * rp11_init()
 *
 * @this {DevicePDP11}
 * @param {number} drive
 * @param {number} flags
 */
DevicePDP11.prototype.rp11_attention = function(drive, flags)
{
    var rp11= this.rp11;
    rp11.rpas |= 1 << drive;
    rp11.rpds[drive] |= 0x8080;
    if (flags) {
        rp11.rper1[drive] |= flags;
        rp11.rpds[drive] |= 0x4000;
    }
};

//optional increment :-(
// cs1 is half in drive and half in controller :-(

/**
 * rp11_go()
 *
 * @this {DevicePDP11}
 * @param {number} drive
 */
DevicePDP11.prototype.rp11_go = function(drive)
{
    var rp11 = this.rp11;
    var sector, address, count;
    rp11.rpcs1 &= ~0x4080; // Turn TRE & ready off
    rp11.rpcs2 &= ~0x800; // Turn off NEM (NXM)
    rp11.rpds[drive] &= ~0x480; // Turn off LST & ATA
    this.cpu.interrupt(-1, 0, 0xAC) /*0254*/; //remove pending interrupt
    if (typeof rp11.meta[drive] === "undefined") {
        rp11.meta[drive] = {
            "cache": [],
            "postProcess": this.rp11_end,
            "drive": drive,
            "blocksize": 256,
            "mapped": 0,
            "maxblock": rp11.CYLINDERS[0] * rp11.SURFACES[0] * rp11.SECTORS[0],
            "url": "rp" + drive + ".dsk"
        };
    }
    switch (rp11.rpcs1 & 0x3f) { // function code
        case 0x1: /*01*/ // NULL
            break;
        case 0x5: /*05*/ // seek
            rp11.rpcc[drive] = rp11.rpdc[drive];
            rp11.rpcs1 |= 0x8080;
            rp11.rpds[drive] |= 0x8080; // ATA
            rp11.rpas |= 1 << drive;
            break;
        case 0x9: /*011*/ // init
            this.rp11_init();
            break;
        case 0x13: /*023*/ // pack ack
            rp11.rpds[drive] |= 0x40; // set VV
            break;
        case 0x31: /*061*/ // write
            if (rp11.rpdc[drive] >= rp11.CYLINDERS[0] || (rp11.rpda[drive] >> 8) >= rp11.SURFACES[0] ||
                (rp11.rpda[drive] & 0xff) >= rp11.SECTORS[0]) {
                rp11.rper1[drive] |= 0x400; // invalid sector address
                rp11.rpcs1 |= 0xc000; // set SC & TRE
                break;
            }
            sector = (rp11.rpdc[drive] * rp11.SURFACES[0] + (rp11.rpda[drive] >> 8)) * rp11.SECTORS[0] + (rp11.rpda[drive] & 0xff);
            address = ((rp11.rpbae & 0x3f) << 16) | rp11.rpba; // 22 bit mode
            count = (0x10000 - rp11.rpwc) & 0xffff;
            this.writeData(rp11.meta[drive], sector, address, count);
            return;
        case 0x39: /*071*/ // read
            if (rp11.rpdc[drive] >= rp11.CYLINDERS[0] || (rp11.rpda[drive] >> 8) >= rp11.SURFACES[0] ||
                (rp11.rpda[drive] & 0xff) >= rp11.SECTORS[0]) {
                rp11.rper1[drive] |= 0x400; // invalid sector address
                rp11.rpcs1 |= 0xc000; // set SC & TRE
                break;
            }
            sector = (rp11.rpdc[drive] * rp11.SURFACES[0] + (rp11.rpda[drive] >> 8)) * rp11.SECTORS[0] + (rp11.rpda[drive] & 0xff);
            address = ((rp11.rpbae & 0x3f) << 16) | rp11.rpba; // 22 bit mode
            count = (0x10000 - rp11.rpwc) & 0xffff;
            this.readData(rp11.meta[drive], sector, address, count);
            return;
        default:
            break;
    }
    this.cpu.interrupt(3, 5 << 5, 0xAC, /*0254*/ function() {
        rp11.rpcs1 = (rp11.rpcs1 & 0xfffe) | 0x80; // Turn go off and ready on
        rp11.rpds[drive] |= 0x80; // ATA
        return !!(rp11.rpcs1 & 0x40);
    });
};

/**
 * rp11_end()
 *
 * @this {DevicePDP11}
 * @param {number} err
 * @param {Object} meta
 * @param {number} block
 * @param {number} address
 * @param {number} count
 */
DevicePDP11.prototype.rp11_end = function(err, meta, block, address, count)
{
    var rp11 = this.rp11;
    var surface, sector;
    rp11.rpwc = (0x10000 - count) & 0xffff;
    rp11.rpba = address & 0xffff;
    rp11.rpcs1 = (rp11.rpcs1 & ~0x300) | ((address >> 8) & 0x300);
    rp11.rpbae = (address >> 16) & 0x3f; // 22 bit mode
    sector = ~~(block / rp11.SECTORS[0]);
    surface = ~~(sector / rp11.SURFACES[0]);
    rp11.rpda[meta.drive] = ((sector % rp11.SURFACES[0]) << 8) | (block % rp11.SECTORS[0]);
    rp11.rpcc[meta.drive] = rp11.rpdc[meta.drive] = surface;
    rp11.rpas |= 1 << meta.drive;
    if (block >= meta.maxblock - 1) {
        rp11.rpds[meta.drive] |= 0x400; // LST
    }
    switch (err) {
        case 1: // read error
            rp11.rpcs2 |= 0x200; // MXF Missed transfer
            rp11.rpcs1 |= 0xc000; // set SC & TRE
            break;
        case 2: // NXM
            rp11.rpcs2 |= 0x800; // NEM (NXM)
            rp11.rpcs1 |= 0xc000; // set SC & TRE
            break;
    }
    this.cpu.interrupt(20, 5 << 5, 0xAC, /*0254*/ function() {
        rp11.rpds[meta.drive] |= 0x80;
        rp11.rpcs1 = (rp11.rpcs1 & 0xfffe) | 0x80; // Turn go off and ready on
        return !!(rp11.rpcs1 & 0x40);
    });
};

/**
 * kw11_interrupt()
 *
 * @this {DevicePDP11}
 */
DevicePDP11.prototype.kw11_interrupt = function()
{
    this.kw11.csr |= 0x80;
    if (this.kw11.csr & 0x40) {
        this.cpu.interrupt(0, 6 << 5, 0x40 /*0100*/);
    }
};

/**
 * mapUnibus(unibusAddress)
 *
 * @this {DevicePDP11}
 * @param {number} unibusAddress
 * @return {number}
 */
DevicePDP11.prototype.mapUnibus = function(unibusAddress)
{
    var idx = (unibusAddress >> 13) & 0x1f;
    if (idx < 31) {
        if (this.cpu.MMR3 & 0x20) {
            unibusAddress = (this.cpu.unibusMap[idx] + (unibusAddress & 0x1ffe)) & 0x3ffffe;
            if (unibusAddress >= PDP11.IOBASE_UNIBUS && unibusAddress < PDP11.IOBASE_22BIT) this.cpu.panic(898);
        }
    } else {
        unibusAddress |= PDP11.IOBASE_22BIT;
    }
    return unibusAddress;
};

/**
 * getData(xhr, callback, meta, block, address, count)
 *
 * @this {DevicePDP11}
 * @param {XMLHttpRequest} xhr
 * @param {function(Object,number,number,number)} callback
 * @param {Object} meta
 * @param {number} block
 * @param {number} address
 * @param {number} count
 */
DevicePDP11.prototype.getData = function(xhr, callback, meta, block, address, count)
{
    var arrayBuffer, byteArray, blockno, word, base;
    arrayBuffer = /** @type {ArrayBuffer} */ (xhr.response);
    if ((xhr.status != 0 && xhr.status != 206) || !arrayBuffer) {
        meta.postProcess(1, meta, block, address, count); // NXD - read error?
    } else {
        byteArray = new Uint8Array(arrayBuffer);
        blockno = block;
        for (base = 0; base < byteArray.length;) {
            if (typeof meta.cache[blockno] === "undefined") {
                meta.cache[blockno] = [];
                for (word = 0; word < meta.blocksize; word++) {
                    if (base < byteArray.length) {
                        meta.cache[blockno][word] = (byteArray[base] & 0xff) | ((byteArray[base + 1] << 8) & 0xff00);
                    } else {
                        meta.cache[blockno][word] = 0;
                    }
                    base += 2;
                }
            } else {
                base += meta.blocksize << 1;
            }
            blockno++;
        }
        callback(meta, block, address, count);
    }
};

/**
 * getCache(callback, meta, block, address, count)
 *
 * @this {DevicePDP11}
 * @param {function(Object,number,number,number)} callback
 * @param {Object} meta
 * @param {number} block
 * @param {number} address
 * @param {number} count
 */
DevicePDP11.prototype.getCache = function(callback, meta, block, address, count)
{
    var device = this;
    var sectors = ~~((count + meta.blocksize - 1) / meta.blocksize);
    var xhr = new XMLHttpRequest();
    if (sectors < 2048 && block + 2048 < meta.maxblock) sectors = 2048; // make it a decent read
    xhr.open("GET", meta.url, true);
    xhr.setRequestHeader("Range", "bytes=" + ((block * meta.blocksize) << 1) + "-" +
        ((((block + sectors) * meta.blocksize) << 1) - 1));
    xhr.responseType = "arraybuffer";
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 /* xhr.DONE */) {
            device.getData(xhr, callback.bind(device), meta, block, address, count);
        }
    };
    xhr.send(null);
};

/**
 * readData(meta, block, address, count)
 *
 * @this {DevicePDP11}
 * @param {Object} meta
 * @param {number} block
 * @param {number} address
 * @param {number} count
 */
DevicePDP11.prototype.readData = function(meta, block, address, count)
{
    var word;
    while (count > 0) {
        if (typeof meta.cache[block] === "undefined") {
            this.getCache(this.readData, meta, block, address, count);
            return;
        }
        for (word = 0; word < meta.blocksize && count > 0; word++) {
            if (this.cpu.writeWordByAddr((meta.mapped? this.mapUnibus(address) : address), meta.cache[block][word]) < 0) {
                meta.postProcess(2, meta, block, address, count); // NXM
                return;
            }
            //if (meta.increment) {
            address += 2;
            //}
            --count;
        }
        block++;
    }
    meta.postProcess(0, meta, block, address, count); // success
};

/**
 * writeData(meta, block, address, count)
 *
 * @this {DevicePDP11}
 * @param {Object} meta
 * @param {number} block
 * @param {number} address
 * @param {number} count
 */
DevicePDP11.prototype.writeData = function(meta, block, address, count)
{
    var word, data;
    while (count > 0) {
        if (typeof meta.cache[block] === "undefined") {
            meta.cache[block] = [];
            for (word = 0; word < meta.blocksize; word++) {
                meta.cache[block][word] = 0;
            }
        }
        for (word = 0; word < meta.blocksize && count > 0; word++) {
            data = this.cpu.readWordByAddr((meta.mapped? this.mapUnibus(address) : address));
            if (data < 0) {
                meta.postProcess(2, meta, block, address, count); // NXM
                return;
            }
            meta.cache[block][word] = data;
            //if (meta.increment) {
            address += 2;
            //}
            --count;
        }
        block++;
    }
    meta.postProcess(0, meta, block, address, count); // success
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
    this.tty.rcsr = 0;
    this.tty.xcsr = 0x80; /*0200*/
    this.kw11.csr = 0;
    this.rk11.rkcs = 0x80; /*0200*/
    this.rl11.csr = 0x80;
    this.rp11_init();
};

/**
 * access(physicalAddress, data, byteFlag)
 *
 * Formerly access_iopage().
 *
 * @this {DevicePDP11}
 * @param {number} physicalAddress
 * @param {number} data (-1 if read)
 * @param {number} byteFlag (zero if word, non-zero if byte)
 * @return {number}
 */
DevicePDP11.prototype.access = function(physicalAddress, data, byteFlag)
{
    var result, idx;
    var cpu = this.cpu;
    switch (physicalAddress & ~0x3F) /*077*/ {
        case 0x3FFFC0: /*017777700*/ // 017777700 - 017777777
            switch (physicalAddress & ~1) {
                case 0x3FFFFE: /*017777776*/ // PSW
                    Component.assert(false);        // verify that this is being handled by our new registered functions now
                    result = cpu.readPSW();
                    if (data >= 0) {
                        if (physicalAddress & 1) {
                            data = (data << 8) | (result & 0xff);
                        } else {
                            if (byteFlag) data = (result & 0xff00) | (data & 0xff);
                        }
                        data = (data & 0xf8ef) | (result & 0x0710);
                        cpu.writePSW(data);
                        return -1; // KLUDGE - no trap but abort any CC updates
                    }
                    break;
                case 0x3FFFFC: /*017777774*/ // stack limit
                    if (data < 0) {
                        result = cpu.stackLimit & 0xff00;
                    } else {
                        if (physicalAddress & 1) {
                            data = data << 8;
                        }
                        cpu.stackLimit = data | 0xff;
                        result = 0;
                    }
                    //log.push("stacklimit access "+cpu.stackLimit.toString(8));
                    break;
                case 0x3FFFFA: /*017777772*/ // PIR
                    if (data < 0) {
                        result = cpu.pir;
                    } else {
                        if (physicalAddress & 1) {
                            data = data << 8;
                        }
                        result = data & 0xfe00;
                        if (result) {
                            idx = result >> 9;
                            do {
                                result += 0x22;
                            } while (idx >>= 1);
                        }
                        cpu.pir = result;
                        cpu.priorityReview = 2;
                    }
                    break;
                case 0x3FFFF6: /*017777766*/ // CPU error
                    if (cpu.cpuType !== 70) return cpu.trap(4, 222);
                    if (data < 0) {
                        result = cpu.CPU_Error;
                    } else {
                        result = cpu.CPU_Error = 0; // Always writes as zero?
                    }
                    break;
                case 0x3FFFF4: /*017777764*/ // System I/D
                    if (cpu.cpuType !== 70) return cpu.trap(4, 224);
                    result = 1;
                    break;
                case 0x3FFFF2: /*017777762*/ // Upper size
                    if (cpu.cpuType !== 70) return cpu.trap(4, 226);
                    result = 0;
                    break;
                case 0x3FFFF0: /*017777760*/ // Lower size
                    if (cpu.cpuType !== 70) return cpu.trap(4, 228);
                    result = (PDP11.MAX_MEMORY >> 6) - 1;
                    break;
                case 0x3FFFF8: /*017777770*/ // Microprogram break
                    if (data >= 0 && !(physicalAddress & 1)) data &= 0xff; // Required for KB11-CM without MFPT instruction
                    /* falls through */
                case 0x3FFFEE: /*017777756*/ //
                case 0x3FFFEC: /*017777754*/ //
                case 0x3FFFEA: /*017777752*/ // Hit/miss
                case 0x3FFFE8: /*017777750*/ // Maintenance
                case 0x3FFFE6: /*017777746*/ // Cache control
                case 0x3FFFE4: /*017777744*/ // Memory system error
                case 0x3FFFE2: /*017777742*/ // High error address
                case 0x3FFFE0: /*017777740*/ // Low error address
                    if (cpu.cpuType !== 70) return cpu.trap(4, 232);
                    idx = (physicalAddress - 0x3FFFE0) /*017777740*/ >> 1;
                    if (data < 0) {
                        result = cpu.controlReg[idx];
                    } else {
                        result = this.insertData(cpu.controlReg[idx], physicalAddress, data, byteFlag);
                        if (result >= 0) {
                            cpu.controlReg[idx] = result;
                        }
                    }
                    break;
                case 0x3FFFCE: /*017777716*/ // User and Super SP
                    if (physicalAddress & 1) {
                        if ((cpu.PSW >> 14) & 3 == 3) { // User Mode
                            if (data >= 0) cpu.regsGen[6] = data;
                            result = cpu.regsGen[6];
                        } else {
                            if (data >= 0) cpu.regsAltStack[3] = data;
                            result = cpu.regsAltStack[3];
                        }
                    } else {
                        if ((cpu.PSW >> 14) & 3 == 1) { // Super Mode
                            if (data >= 0) cpu.regsGen[6] = data;
                            result = cpu.regsGen[6];
                        } else {
                            if (data >= 0) cpu.regsAltStack[1] = data;
                            result = cpu.regsAltStack[1];
                        }
                    }
                    return result;
                case 0x3FFFCC: /*017777714*/
                case 0x3FFFCA: /*017777712*/
                case 0x3FFFC8: /*017777710*/ // Register set 1
                    idx = physicalAddress & 7;
                    if (cpu.PSW & 0x800) {
                        if (data >= 0) cpu.regsGen[idx] = data;
                        result = cpu.regsGen[idx];
                    } else {
                        if (data >= 0) cpu.regsAlt[idx] = data;
                        result = cpu.regsAlt[idx];
                    }
                    return result;
                case 0x3FFFC6: /*017777706*/ // Kernel SP & PC
                    if (physicalAddress & 1) {
                        if (data >= 0) cpu.regsGen[7] = data;
                        result = cpu.regsGen[7];
                    } else {
                        if ((cpu.PSW >> 14) & 3 == 0) { // Kernel Mode
                            if (data >= 0) cpu.regsGen[6] = data;
                            result = cpu.regsGen[6];
                        } else {
                            if (data >= 0) cpu.regsAltStack[0] = data;
                            result = cpu.regsAltStack[0];
                        }
                    }
                    return result;
                case 0x3FFFC4: /*017777704*/
                case 0x3FFFC2: /*017777702*/
                case 0x3FFFC0: /*017777700*/ // Register set 0
                    idx = physicalAddress & 7;
                    if (cpu.PSW & 0x800) {
                        if (data >= 0) cpu.regsAlt[idx] = data;
                        result = cpu.regsAlt[idx];
                    } else {
                        if (data >= 0) cpu.regsGen[idx] = data;
                        result = cpu.regsGen[idx];
                    }
                    return result;
                default:
                    cpu.CPU_Error |= 0x10;
                    return cpu.trap(4, 124);
            }
            break;
        case 0x3FFF80: /*017777600*/ // 017777600 - 017777677 MMU user mode Map
            idx = (physicalAddress >> 1) & 0x1F; /*037*/
            result = this.insertData(cpu.mmuMap[3][idx], physicalAddress, data, byteFlag);
            if (result >= 0) {
                cpu.mmuMap[3][idx] = result;
                cpu.mmuMap[3][idx & 0xf] &= 0xff0f;
            }
            break;
        case 0x3FFF40: /*017777500*/ // 017777500 - 017777577
            var tty = this.tty;
            var kw11 = this.kw11;
            switch (physicalAddress & ~1) {
                case 0x3FFF7E: /*017777576*/ // MMR2
                    result = this.insertData(cpu.MMR2, physicalAddress, data, byteFlag);
                    if (result >= 0) cpu.MMR2 = result;
                    break;
                case 0x3FFF7C: /*017777574*/ // MMR1
                    result = cpu.MMR1;
                    if (result & 0xff00) result = ((result << 8) | (result >> 8)) & 0xffff;
                    break;
                case 0x3FFF7A: /*017777572*/ // MMR0
                    cpu.MMR0 = (cpu.MMR0 & 0xf381) | (cpu.mmuLastMode << 5) | (cpu.mmuLastPage << 1);
                    if (data < 0) {
                        result = cpu.MMR0;
                    } else {
                        result = this.insertData(cpu.MMR0, physicalAddress, data, byteFlag);
                        if (result >= 0) {
                            cpu.MMR0 = result &= 0xf381;
                            cpu.mmuLastMode = (result >> 5) & 3;
                            cpu.mmuLastPage = (result >> 1) & 0xf;
                            if (result & 0x101) {
                                idx = 2; // 18 bit
                                if (cpu.MMR3 & 0x10) idx = 1; // 22 bit
                                if (result & 0x1) {
                                    cpu.mmuEnable = PDP11.READ_MODE | PDP11.WRITE_MODE;
                                } else {
                                    cpu.mmuEnable = PDP11.WRITE_MODE;
                                }
                            } else {
                                cpu.mmuEnable = 0;
                                idx = 4; // 16 bit
                            }
                            this.display.misc = (this.display.misc & ~7) | idx;
                        }
                    }
                    break;
                case 0x3FFF78: /*017777570*/ // console display/switch;
                    if (data < 0) {
                        result = this.display.switches & 0xffff;
                    } else {
                        result = this.insertData(this.display.data, physicalAddress, data, byteFlag);
                        if (result >= 0) this.display.data = result;
                    }
                    break;
                case 0x3FFF76: /*017777566*/ // console xbuf
                    if (data >= 0) {
                        data &= 0x7f;
                        if (data) {
                        switch (data) {
                        case 0:
                        case 0xD: /*015*/
                            /*
                            if (document.forms.console.line.value.length > 9000) {
                                document.forms.console.line.value = document.forms.console.line.value.substring(document.forms.console.line.value.length - 8192);
                            }
                            */
                            break;
                        case 0x8: /*010*/
                            /*
                            if (!tty.del) {
                                document.forms.console.line.value = document.forms.console.line.value.substring(0, document.forms.console.line.value.length - 1);
                            }
                            */
                            break;
                        default:
                            /*
                            document.forms.console.line.value += String.fromCharCode(data);
                            if (data == 0x0A) {
                                document.forms.console.line.scrollTop = document.forms.console.line.scrollHeight;
                            }
                            */
                        }
                        tty.del = 0;
                        }
                        tty.xcsr &= ~0x80; /*0200*/
                        cpu.interrupt(100, 4 << 5, 0x34, /*064*/ function() {
                            tty.xcsr |= 0x80; /*0200*/
                            return !!(tty.xcsr & 0x40); /*0100*/
                        });
                    }
                    result = 0;
                    break;
                case 0x3FFF74: /*017777564*/ // console xcsr
                    if (data < 0) {
                        result = tty.xcsr;
                    } else {
                        result = this.insertData(tty.xcsr, physicalAddress, data, byteFlag);
                        if (result >= 0) {
                            if ((tty.xcsr & 0xC0) /*0300*/ == 0x80  /*0200*/&& (result & 0x40) /*0100*/) {
                                cpu.interrupt(8, 4 << 5, 0x34, /*064*/ function() {
                                    tty.xcsr |= 0x80; /*0200*/
                                    return !!(tty.xcsr & 0x40); /*0100*/
                                });
                            }
                            tty.xcsr = (tty.xcsr & 0x80) /*0200*/ | (result & ~0x80) /*0200*/;
                        }
                    }
                    break;
                case 0x3FFF72: /*017777562*/ // console rbuf
                    result = 0;
                    if (data < 0) {
                        tty.rcsr &= ~0x80; /*0200*/
                        if (tty.rbuf.length > 0) {
                            result = tty.rbuf.shift();
                            if (tty.rbuf.length > 0) {
                                setTimeout(function() {
                                    tty.rcsr |= 0x80; /*0200*/
                                    if (tty.rcsr & 0x40) /*0100*/ cpu.interrupt(40, 4 << 5, 0x30) /*060*/;
                                }, 50);
                            }
                        }
                    }
                    break;
                case 0x3FFF70: /*017777560*/ // console rcsr
                    if (data < 0) {
                        result = tty.rcsr;
                    } else {
                        result = this.insertData(tty.rcsr, physicalAddress, data, byteFlag);
                        if (result >= 0) tty.rcsr = (tty.rcsr & 0x80) /*0200*/ | (result & ~0x80) /*0200*/;
                    }
                    break;
                case 0x3FFF66: /*017777546*/ // kw11.csr
                    if (data < 0) {
                        result = kw11.csr;
                        kw11.csr &= ~0x80; /*0200*/
                    } else {
                        result = this.insertData(kw11.csr, physicalAddress, data, byteFlag);
                        if (result >= 0) {
                            if (result & 0x40) /*0100*/ {
                                if (!kw11.init) {
                                    setInterval(this.kw11_interrupt.bind(this), 25);
                                    kw11.init = 1;
                                }
                            }
                            kw11.csr = result & ~0x80; /*0200*/
                        }
                    }
                    break;
                default:
                    cpu.CPU_Error |= 0x10;
                    return cpu.trap(4, 126);
            }
            break;
        case 0x3FFF00: /*017777400*/ // 017777400 - 017777477
            var rk11 = this.rk11;
            switch (physicalAddress & ~1) {
                case 0x3FFF00: /*017777400*/ // rk11.rkds
                    result = this.insertData(rk11.rkds, physicalAddress, data, byteFlag);
                    if (result >= 0) rk11.rkds = result;
                    break;
                case 0x3FFF02: /*017777402*/ // rk11.rker
                    result = this.insertData(rk11.rker, physicalAddress, data, byteFlag);
                    if (result >= 0) rk11.rker = result;
                    break;
                case 0x3FFF04: /*017777404*/ // rk11.rkcs
                    result = this.insertData(rk11.rkcs, physicalAddress, data, byteFlag);
                    if (data >= 0 && result >= 0) {
                        rk11.rkcs = (result & ~0x9080) | (rk11.rkcs & 0x9080); // Bits 7 and 12 - 15 are read only
                        if (rk11.rkcs & 1) {
                            this.rk11_go();
                        }
                    }
                    break;
                case 0x3FFF06: /*017777406*/ // rk11.rkwc
                    result = this.insertData(rk11.rkwc, physicalAddress, data, byteFlag);
                    if (result >= 0) rk11.rkwc = result;
                    break;
                case 0x3FFF08: /*017777410*/ // rk11.rkba
                    result = this.insertData(rk11.rkba, physicalAddress, data, byteFlag);
                    if (result >= 0) rk11.rkba = result;
                    break;
                case 0x3FFF0A: /*017777412*/ // rk11.rkda
                    result = this.insertData(rk11.rkda, physicalAddress, data, byteFlag);
                    if (result >= 0) rk11.rkda = result;
                    break;
                case 0x3FFF0C: /*017777414*/ // rk11.unused
                    break;
                case 0x3FFF0E: /*017777416*/ // rk11.rkdb
                    result = this.insertData(rk11.rkdb, physicalAddress, data, byteFlag);
                    if (result >= 0) rk11.rkdb = result;
                    break;
                default:
                    cpu.CPU_Error |= 0x10;
                    return cpu.trap(4, 128);
            }
            break;
        case 0x3FFDC0: /*017776700*/ // 017777600 - 017777677 rp11 controller
            //if (physicalAddress != 017776700) console.log("RP11 register " + physicalAddress.toString(8) + " " + data.toString(8));
            var rp11 = this.rp11;
            idx = rp11.rpcs2 & 7;
            switch (physicalAddress & ~1) {
                case 0x3FFDC0: /*017776700*/ // rp11.rpcs1 Control status 1
                    result = this.insertData(rp11.rpcs1, physicalAddress, data, byteFlag);
                    if (data >= 0 && result >= 0) {
                        rp11.rpbae = (rp11.rpbae & 0x3c) | ((result >> 8) & 0x3);
                        rp11.rpcs1 = (result & 0x437f) | (rp11.rpcs1 & 0x8880) | 0x800;
                        if (result & 1 && (rp11.rpcs1 & 0x80)) {
                            this.rp11_go(idx);
                        } else {
                            if ((result & 0xc0) == 0xc0) {
                                cpu.interrupt(0, 5 << 5, 0xAC) /*0254*/;
                            }
                        }
                    }
                    break;
                case 0x3FFDC2: /*017776702*/ // rp11.rpwc  Word count
                    result = this.insertData(rp11.rpwc, physicalAddress, data, byteFlag);
                    if (result >= 0) rp11.rpwc = result;
                    break;
                case 0x3FFDC4: /*017776704*/ // rp11.rpba  Memory address
                    result = this.insertData(rp11.rpba, physicalAddress, data, byteFlag);
                    if (result >= 0) rp11.rpba = result & 0xfffe; // must be even
                    break;
                case 0x3FFDC6: /*017776706*/ // rp11.rpda  Disk address
                    result = this.insertData(rp11.rpda[idx], physicalAddress, data, byteFlag);
                    if (result >= 0) rp11.rpda[idx] = result & 0x1f1f;
                    break;
                case 0x3FFDC8: /*017776710*/ // rp11.rpcs2 Control status 2
                    result = this.insertData(rp11.rpcs2, physicalAddress, data, byteFlag);
                    if (result >= 0) {
                        rp11.rpcs2 = (result & 0x3f) | (rp11.rpcs2 & 0xffc0);
                        if (result & 0x80) /*0200*/ this.rp11_init();
                    }
                    break;
                case 0x3FFDCA: /*017776712*/ // rp11.rpds  drive status
                    result = rp11.rpds[idx];
                    break;
                case 0x3FFDCC: /*017776714*/ // rp11.rper1 Error 1
                    result = rp11.rper1[idx];
                    break;
                case 0x3FFDCE: /*017776716*/ // rp11.rpas  Attention summary
                    result = this.insertData(rp11.rpas, physicalAddress, data, byteFlag);
                    if (result >= 0) rp11.rpas = result & 0xff;
                    break;
                case 0x3FFDD0: /*017776720*/ // rp11.rpla  Look ahead
                    result = rp11.rpla[idx];
                    break;
                case 0x3FFDD2: /*017776722*/ // rp11.rpdb  Data buffer
                    result = this.insertData(rp11.rpdb, physicalAddress, data, byteFlag);
                    if (result >= 0) rp11.rpdb = result;
                    break;
                case 0x3FFDD4: /*017776724*/ // rp11.rpmr  Maintenance
                    result = this.insertData(rp11.rpmr[idx], physicalAddress, data, byteFlag);
                    if (result >= 0) rp11.rpmr[idx] = result & 0x3ff;
                    break;
                case 0x3FFDD6: /*017776726*/ // rp11.rpdt  drive type read only
                    result = 0x2012; /*020022*/ // rp11.rpdt[idx];
                    break;
                case 0x3FFDD8: /*017776730*/ // rp11.rpsn  Serial number read only
                    result = rp11.rpsn[idx];
                    break;
                case 0x3FFDDA: /*017776732*/ // rp11.rpof  Offset register
                    result = this.insertData(rp11.rpof[idx], physicalAddress, data, byteFlag);
                    if (result >= 0) rp11.rpof[idx] = result;
                    break;
                case 0x3FFDDC: /*017776734*/ // rp11.rpdc  Desired cylinder
                    result = this.insertData(rp11.rpdc[idx], physicalAddress, data, byteFlag);
                    if (result >= 0) rp11.rpdc[idx] = result & 0x1ff;
                    break;
                case 0x3FFDDE: /*017776736*/ // rp11.rpcc  Current cylinder read only
                    rp11.rpcc[idx] = rp11.rpdc[idx];
                    result = rp11.rpcc[idx];
                    break;
                case 0x3FFDE0: /*017776740*/ // rp11.rper2 Error 2
                    result = rp11.rper2[idx];
                    break;
                case 0x3FFDE2: /*017776742*/ // rp11.rper3 Error 3
                    result = rp11.rper3[idx];
                    break;
                case 0x3FFDE4: /*017776744*/ // rp11.rpec1 Error correction 1 read only
                    result = rp11.rpec1[idx];
                    break;
                case 0x3FFDE6: /*017776746*/ // rp11.rpec2 Error correction 2 read only
                    result = rp11.rpec2[idx];
                    break;
                case 0x3FFDE8: /*017776750*/ // rp11.rpbae Bus address extension
                    result = this.insertData(rp11.rpbae, physicalAddress, data, byteFlag);
                    if (result >= 0) {
                        rp11.rpbae = result & 0x3f;
                        rp11.rpcs1 = (rp11.rpcs1 & ~0x300) | ((result & 0x3) << 8);
                    }
                    break;
                case 0x3FFDEA: /*017776752*/ // rp11.rpcs3 Control status 3
                    result = this.insertData(rp11.rpcs3, physicalAddress, data, byteFlag);
                    if (result >= 0) rp11.rpcs3 = result;
                    break;
                default:
                    cpu.CPU_Error |= 0x10;
                    return cpu.trap(4, 132);
            }
            break;
        case 0x3FF900: /*017774400*/ // 017774400 - 017774477
            var rl11 = this.rl11;
            switch (physicalAddress & ~1) {
                case 0x3FF900: /*017774400*/ // rl11.csr
                    result = this.insertData(rl11.csr, physicalAddress, data, byteFlag);
                    if (data >= 0 && result >= 0) {
                        rl11.bae = (rl11.bae & 0x3c) | ((result >> 4) & 0x3);
                        rl11.csr = (rl11.csr & ~0x3fe) | (result & 0x3fe);
                        if (!(rl11.csr & 0x80)) {
                            this.rl11_go();
                        }
                    }
                    break;
                case 0x3FF902: /*017774402*/ // rl11.bar
                    result = this.insertData(rl11.bar, physicalAddress, data, byteFlag);
                    if (result >= 0) {
                        rl11.bar = result & 0xfffe;
                    }
                    break;
                case 0x3FF904: /*017774404*/ // rl11.dar
                    result = this.insertData(rl11.dar, physicalAddress, data, byteFlag);
                    if (result >= 0) rl11.dar = result;
                    break;
                case 0x3FF906: /*017774406*/ // rl11.mpr
                    result = this.insertData(rl11.mpr, physicalAddress, data, byteFlag);
                    if (result >= 0) rl11.mpr = result;
                    break;
                case 0x3FF908: /*017774410*/ // rl11.bae
                    result = this.insertData(rl11.bae, physicalAddress, data, byteFlag);
                    if (result >= 0) {
                        rl11.bae = result & 0x3f;
                        rl11.csr = (rl11.csr & ~0x30) | ((rl11.bae & 0x3) << 4);
                    }
                    break;
                default:
                    cpu.CPU_Error |= 0x10;
                    return cpu.trap(4, 134);
            }
            break;
        case 0x3FF540: /*017772500*/ // 017772500 - 017772577
            switch (physicalAddress & ~1) {
                case 0x3FF54E: /*017772516*/ // MMR3 - UB 22 x K S U
                    if (data < 0) {
                        result = cpu.MMR3;
                    } else {
                        result = this.insertData(cpu.MMR3, physicalAddress, data, byteFlag);
                        if (result >= 0) {
                            if (cpu.cpuType !== 70) result &= ~0x30; // don't allow 11/45 to do 22 bit or use unibus map
                            cpu.MMR3 = result;
                            cpu.mmuMask[0] = (result & 4 ? 0xf : 0x7);
                            cpu.mmuMask[1] = (result & 2 ? 0xf : 0x7);
                            cpu.mmuMask[3] = (result & 1 ? 0xf : 0x7);
                            if (cpu.mmuEnable) {
                                idx = 2; // 18 bit
                                if (cpu.MMR3 & 0x10) idx = 1; // 22 bit
                                this.display.misc = (this.display.misc & ~7) | idx;
                            }
                        }
                    }
                    break;
                default:
                    cpu.CPU_Error |= 0x10;
                    return cpu.trap(4, 136);
            }
            break;
        case 0x3FF4C0: /*017772300*/ // 017772300 - 017772377 MMU kernel mode Map
            idx = (physicalAddress >> 1) & 0x1F; /*037*/
            result = this.insertData(cpu.mmuMap[0][idx], physicalAddress, data, byteFlag);
            if (result >= 0) {
                cpu.mmuMap[0][idx] = result;
                cpu.mmuMap[0][idx & 0xf] &= 0xff0f;
            }
            break;
        case 0x3FF480: /*017772200*/ // 017772200 - 017772277 MMU super mode Map
            idx = (physicalAddress >> 1) & 0x1F; /*037*/
            result = this.insertData(cpu.mmuMap[1][idx], physicalAddress, data, byteFlag);
            if (result >= 0) {
                cpu.mmuMap[1][idx] = result;
                cpu.mmuMap[1][idx & 0xf] &= 0xff0f;
            }
            break;
        case 0x3FF0C0: /*017770300*/ // 017770300 - 017770377 Unibus Map
        case 0x3FF080: /*017770200*/ // 017770200 - 017770277 Unibus Map
            if (cpu.cpuType !== 70) return cpu.trap(4, 234);
            idx = (physicalAddress >> 2) & 0x1f;
            result = cpu.unibusMap[idx];
            if (physicalAddress & 0x2) /*02*/ result = result >> 16;
            result &= 0xffff;
            if (data >= 0) {
                result = this.insertData(result, physicalAddress, data, byteFlag);
                if (result >= 0) {
                    if (physicalAddress & 0x2) /*02*/ {
                        cpu.unibusMap[idx] = (result << 16) | (cpu.unibusMap[idx] & 0xffff);
                    } else {
                        cpu.unibusMap[idx] = (cpu.unibusMap[idx] & 0xffff0000) | (result & 0xfffe);
                    }
                }
            }
            break;
        case 0x3FEA00: /*017765000*/ // 017765000 - 017765777 Bootstrap diagnostic
        case 0x3FEA40: /*017765100*/
        case 0x3FEA80: /*017765200*/
        case 0x3FEAC0: /*017765300*/
        case 0x3FEB00: /*017765400*/
        case 0x3FEB40: /*017765500*/
        case 0x3FEB80: /*017765600*/
        case 0x3FEBC0: /*017765700*/
            if (data < 0) {
                idx = (physicalAddress >> 1) & 0xff;
                result = DevicePDP11.M9312[idx];
            } else {
                cpu.CPU_Error |= 0x10;
                return cpu.trap(4, 138);
            }
            break;
        default:
            cpu.CPU_Error |= 0x10;
            return cpu.trap(4, 142);
    }
    if (byteFlag && result >= 0) { // make any required byte adjustment
        if ((physicalAddress & 1)) {
            result = result >> 8;
        } else {
            result &= 0xff;
        }
    }
    if (typeof result === "undefined") {
        cpu.panic(76);
    }
    return result;
};

/**
 * insertData(original, physicalAddress, data, byteFlag)
 *
 * @this {DevicePDP11}
 * @param {number} original
 * @param {number} physicalAddress
 * @param {number} data
 * @param {number} byteFlag
 * @return {number}
 */
DevicePDP11.prototype.insertData = function(original, physicalAddress, data, byteFlag)
{
    if (physicalAddress & 1) {
        if (!byteFlag) {
            //log.push("TRAP 4 201 " + physicalAddress.toString(8) + " " + data.toString(8));
            return this.cpu.trap(4, 122);
        }
        if (data >= 0) {
            data = ((data << 8) & 0xff00) | (original & 0xff);
        } else {
            data = original;
        }
    } else {
        if (data >= 0) {
            if (byteFlag) {
                data = (original & 0xff00) | (data & 0xff);
            }
        } else {
            data = original;
        }
    }
    return data;
};

DevicePDP11.UNIBUS_TABLE = {};
DevicePDP11.UNIBUS_TABLE[DevicePDP11.ADDR_PSW] = [null, null, DevicePDP11.prototype.readPSW, DevicePDP11.prototype.writePSW];

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
