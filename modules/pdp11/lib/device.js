/**
 * @fileoverview Implements PDP11 device support.
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
    var str           = require("../../shared/lib/strlib");
    var web           = require("../../shared/lib/weblib");
    var Component     = require("../../shared/lib/component");
    var State         = require("../../shared/lib/state");
    var BusPDP11      = require("./bus");
    var MemoryPDP11   = require("./memory");
    var MessagesPDP11 = require("./messages");
    var PC11          = require("./pc11");
    var RL11          = require("./rl11");
}

/**
 * DevicePDP11(parmsDevice)
 *
 * The Device component implements the following "default" devices:
 *
 *      KW11 (KW11-L Line Time Clock)
 *
 * as well providing access to all the MMU and CPU registers, PSW, etc.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsDevice
 */
function DevicePDP11(parmsDevice)
{
    Component.call(this, "Device", parmsDevice, DevicePDP11, MessagesPDP11.DEVICE);

    this.kw11 = {               // KW11 registers
        csr:        0,
        timer:      -1          // initBus() will initialize this timer ID
    };
}

Component.subclass(DevicePDP11);

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
    this.cmp = cmp;
    this.cpu = cpu;
    this.dbg = dbg;

    var device = this;
    this.kw11.timer = cpu.addTimer(function() {
        device.interruptKW11();
    });

    this.kw11.irq = cpu.addIRQ(PDP11.KW11.VEC, PDP11.KW11.PRI, MessagesPDP11.KW11);

    bus.addIOTable(this, DevicePDP11.UNIBUS_IOTABLE);
    bus.addResetHandler(this.reset.bind(this));

    if (DEBUGGER && dbg) {
        dbg.messageDump(MessagesPDP11.MMU, function onDumpMMU(asArgs) {
            device.dumpMMU(asArgs);
        });
    }
    this.setReady();
};

/**
 * dumpMMU(asArgs)
 *
 * @this {DevicePDP11}
 * @param {Array.<string>} asArgs
 */
DevicePDP11.prototype.dumpMMU = function(asArgs)
{
    if (DEBUGGER) {
        var cpu = this.cpu;
        this.dumpRegs("KIPDR", cpu.mmuPDR[0], 0, asArgs[0]);
        this.dumpRegs("KDPDR", cpu.mmuPDR[0], 8, asArgs[0]);
        this.dumpRegs("KIPAR", cpu.mmuPAR[0], 0, asArgs[0]);
        this.dumpRegs("KDPAR", cpu.mmuPAR[0], 8, asArgs[0], true);
        this.dumpRegs("SIPDR", cpu.mmuPDR[1], 0, asArgs[0]);
        this.dumpRegs("SDPDR", cpu.mmuPDR[1], 8, asArgs[0]);
        this.dumpRegs("SIPAR", cpu.mmuPAR[1], 0, asArgs[0]);
        this.dumpRegs("SDPAR", cpu.mmuPAR[1], 8, asArgs[0], true);
        this.dumpRegs("UIPDR", cpu.mmuPDR[3], 0, asArgs[0]);
        this.dumpRegs("UDPDR", cpu.mmuPDR[3], 8, asArgs[0]);
        this.dumpRegs("UIPAR", cpu.mmuPAR[3], 0, asArgs[0]);
        this.dumpRegs("UDPAR", cpu.mmuPAR[3], 8, asArgs[0], true);
    }
};

/**
 * dumpRegs(sName, aRegs, offset, sFilter, fBreak)
 *
 * @this {DevicePDP11}
 * @param {string} sName
 * @param {Array.<number>} aRegs
 * @param {number} offset
 * @param {string} sFilter
 * @param {boolean} [fBreak]
 */
DevicePDP11.prototype.dumpRegs = function(sName, aRegs, offset, sFilter, fBreak)
{
    if (DEBUGGER) {
        var dbg = this.dbg;
        if (sFilter && sName.indexOf(sFilter.toUpperCase()) < 0) return;
        var sDump = sName + ":";
        for (var i = 0; i < 8; i++) {
            sDump += ' ' + dbg.toStrBase(aRegs[offset + i]);
        }
        dbg.println(sDump + (fBreak? '\n' : ''));
    }
};

/**
 * reset()
 *
 * @this {DevicePDP11}
 */
DevicePDP11.prototype.reset = function()
{
    this.kw11.lks = PDP11.KW11.LKS.MON;
    this.cpu.setTimer(this.kw11.timer, 1000/60, true);
};

/**
 * interruptKW11()
 *
 * We used to call this function only when the the KW11's "Interrupt Enable" bit was set,
 * but now we call it at 60Hz regardless.  In part, this was so we could piggy-back on it
 * to drive display updates, but more importantly, the KW11's "Monitor" bit is supposed to
 * be set at the "line frequency" independent of whether KW11 interrupts are enabled or not.
 *
 * @this {DevicePDP11}
 */
DevicePDP11.prototype.interruptKW11 = function()
{
    this.kw11.lks |= PDP11.KW11.LKS.MON;
    if (this.kw11.lks & PDP11.KW11.LKS.IE) {
        this.cpu.setIRQ(this.kw11.irq);
    }
    if (this.cmp) this.cmp.updateDisplays(1);
    this.cpu.setTimer(this.kw11.timer, 1000/60);
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
    /*
     * NOTE: The original code always cleared LKS.MON (bit 7) after snapping the value for the read,
     * but based on DEC's "Non-Interrupt Mode" programming examples, it's clear that's not how LKS.MON
     * operates; if the caller wants to clear it, they must explicitly clear it with a write.
     */
    return this.kw11.lks;
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
    /*
     * NOTE: The original code always cleared LKS.MON (bit 7) as part of any write, but based on DEC's
     * "Non-Interrupt Mode" programming examples, which explicitly CLRB after TSTB reveals LKS.MON is set,
     * I think that was wrong, and that all a write should do is mask off all the other (non-writable) bits.
     */
    this.kw11.lks = data & PDP11.KW11.LKS.MASK;
    if (!(this.kw11.lks & PDP11.KW11.LKS.IE)) this.cpu.clearIRQ(this.kw11.irq);
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
    this.cpu.setMMR0((data & ~PDP11.MMR0.COMPLETED) | (this.cpu.regMMR0 & PDP11.MMR0.COMPLETED));
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
    return this.cpu.getMMR2();
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
    return this.cpu.getMMR3();
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
};

/**
 * readUNIMAP(addr)
 *
 * NOTE: The UNIBUS map is 32 registers spread across 64 words, so we first calculate the word index.
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.UNIMAP)
 * @return {number}
 */
DevicePDP11.prototype.readUNIMAP = function(addr)
{
    var word = (addr >> 1) & 0x3f, reg = word >> 1;
    var data = this.cpu.regsUniMap[reg];
    return (word & 1)? (data >> 16) : (data & 0xffff);
};

/**
 * writeUNIMAP(data, addr)
 *
 * NOTE: The UNIBUS map is 32 registers spread across 64 words, so we first calculate the word index.
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.UNIMAP)
 */
DevicePDP11.prototype.writeUNIMAP = function(data, addr)
{
    var word = (addr >> 1) & 0x3f, reg = word >> 1;
    if (word & 1) {
        this.cpu.regsUniMap[reg] = (this.cpu.regsUniMap[reg] & 0xffff) | ((data & 0x003f) << 16);
    } else {
        this.cpu.regsUniMap[reg] = (this.cpu.regsUniMap[reg] & ~0xffff) | (data & 0xfffe);
    }
};

/**
 * readSIPDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SIPDR0--SIPDR7 or 172200--172216)
 * @return {number}
 */
DevicePDP11.prototype.readSIPDR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPDR[1][reg];
};

/**
 * writeSIPDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.SIPDR0--SIPDR7 or 172200--172216)
 */
DevicePDP11.prototype.writeSIPDR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPDR[1][reg] = data & 0xff0f;
};

/**
 * readSDPDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SDPDR0--SDPDR7 or 172220--172236)
 * @return {number}
 */
DevicePDP11.prototype.readSDPDR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPDR[1][reg];
};

/**
 * writeSDPDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.SDPDR0--SDPDR7 or 172220--172236)
 */
DevicePDP11.prototype.writeSDPDR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPDR[1][reg] = data & 0xff0f;
};

/**
 * readSIPAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SIPAR0--SIPAR7 or 172240--172256)
 * @return {number}
 */
DevicePDP11.prototype.readSIPAR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPAR[1][reg];
};

/**
 * writeSIPAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.SIPAR0--SIPAR7 or 172240--172256)
 */
DevicePDP11.prototype.writeSIPAR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPAR[1][reg] = data;
    this.cpu.mmuPDR[1][reg] &= 0xff0f;

};

/**
 * readSDPAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SDPAR0--SDPAR7 or 172260--172276)
 * @return {number}
 */
DevicePDP11.prototype.readSDPAR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPAR[1][reg];
};

/**
 * writeSDPAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.SDPAR0--SDPAR7 or 172260--172276)
 */
DevicePDP11.prototype.writeSDPAR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPAR[1][reg] = data;
    this.cpu.mmuPDR[1][reg] &= 0xff0f;
};

/**
 * readKIPDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.KIPDR0--KIPDR7 or 172300--172316)
 * @return {number}
 */
DevicePDP11.prototype.readKIPDR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPDR[0][reg];
};

/**
 * writeKIPDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.KIPDR0--KIPDR7 or 172300--172316)
 */
DevicePDP11.prototype.writeKIPDR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPDR[0][reg] = data & 0xff0f;
};

/**
 * readKDPDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.KDPDR0--KDPDR7 or 172320--172336)
 * @return {number}
 */
DevicePDP11.prototype.readKDPDR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPDR[0][reg];
};

/**
 * writeKDPDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.KDPDR0--KDPDR7 or 172320--172336)
 */
DevicePDP11.prototype.writeKDPDR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPDR[0][reg] = data & 0xff0f;
};

/**
 * readKIPAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.KIPAR0--KIPAR7 or 172340--172356)
 * @return {number}
 */
DevicePDP11.prototype.readKIPAR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPAR[0][reg];
};

/**
 * writeKIPAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.KIPAR0--KIPAR7 or 172340--172356)
 */
DevicePDP11.prototype.writeKIPAR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPAR[0][reg] = data;
    this.cpu.mmuPDR[0][reg] &= 0xff0f;

};

/**
 * readKDPAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.KDPAR0--KDPAR7 or 172360--172376)
 * @return {number}
 */
DevicePDP11.prototype.readKDPAR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPAR[0][reg];
};

/**
 * writeKDPAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.KDPAR0--KDPAR7 or 172360--172376)
 */
DevicePDP11.prototype.writeKDPAR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPAR[0][reg] = data;
    this.cpu.mmuPDR[0][reg] &= 0xff0f;
};

/**
 * readUIPDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.UIPDR0--UIPDR7 or 177600--177616)
 * @return {number}
 */
DevicePDP11.prototype.readUIPDR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPDR[3][reg];
};

/**
 * writeUIPDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.UIPDR0--UIPDR7 or 177600--177616)
 */
DevicePDP11.prototype.writeUIPDR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPDR[3][reg] = data & 0xff0f;
};

/**
 * readUDPDR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.UDPDR0--UDPDR7 or 177620--177636)
 * @return {number}
 */
DevicePDP11.prototype.readUDPDR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPDR[3][reg];
};

/**
 * writeUDPDR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.UDPDR0--UDPDR7 or 177620--177636)
 */
DevicePDP11.prototype.writeUDPDR = function(data, addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    this.cpu.mmuPDR[3][reg] = data & 0xff0f;
};

/**
 * readUIPAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.UIPAR0--UIPAR7 or 177640--177656)
 * @return {number}
 */
DevicePDP11.prototype.readUIPAR = function(addr)
{
    var reg = (addr >> 1) & 7;
    return this.cpu.mmuPAR[3][reg];
};

/**
 * writeUIPAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.UIPAR0--UIPAR7 or 177640--177656)
 */
DevicePDP11.prototype.writeUIPAR = function(data, addr)
{
    var reg = (addr >> 1) & 7;
    this.cpu.mmuPAR[3][reg] = data;
    this.cpu.mmuPDR[3][reg] &= 0xff0f;

};

/**
 * readUDPAR(addr)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.UDPAR0--UDPAR7 or 177660--177676)
 * @return {number}
 */
DevicePDP11.prototype.readUDPAR = function(addr)
{
    var reg = ((addr >> 1) & 7) + 8;
    return this.cpu.mmuPAR[3][reg];
};

/**
 * writeUDPAR(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.UDPAR0--UDPAR7 or 177660--177676)
 */
DevicePDP11.prototype.writeUDPAR = function(data, addr)
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
    var reg = (addr - PDP11.UNIBUS.CTRL) >> 1;
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
    var reg = (addr - PDP11.UNIBUS.CTRL) >> 1;
    this.cpu.regsControl[reg] = data;
};

/**
 * readSIZE(addr)
 *
 * We're adhering to DEC's documentation, which says:
 *
 *      This read-only register specifies the memory size of the system. It is defined to indicate the
 *      last addressable block of 32 words in memory (bit 0 is equivalent to bit 6 of the Physical Address).
 *
 * Looking at the Memory Clear "toggle-in" code in /devices/pdp11/machine/1170/panel/debugger/README.md, the
 * memory loop gives up when the block number stored in KIPAR0 is >= LSIZE, suggesting that LSIZE is actually
 * the total number of 64-byte blocks, rather than the block number of the last block.  But that code is
 * not conclusive, since it writes 8192 bytes at a time rather than 64, so it doesn't really matter if LSIZE
 * is off by one.
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.LSIZE--HSIZE or 177760--177762)
 * @return {number}
 */
DevicePDP11.prototype.readSIZE = function(addr)
{
    return addr == PDP11.UNIBUS.LSIZE? ((this.bus.getMemoryLimit(MemoryPDP11.TYPE.RAM) >> 6) - 1) : 0;
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
    if (!(addr & 0x1)) {
        data &= 0xff;           // required for KB11-CM without MFPT instruction
    }
    this.cpu.regMB = data;
};

/**
 * readPIR(addr, fPreWrite)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.PIR or 177772)
 * @param {boolean} [fPreWrite]
 * @return {number}
 */
DevicePDP11.prototype.readPIR = function(addr, fPreWrite)
{
    if (fPreWrite) return 0;
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
 * readSL(addr, fPreWrite)
 *
 * @this {DevicePDP11}
 * @param {number} addr (eg, PDP11.UNIBUS.SL or 177774)
 * @param {boolean} [fPreWrite]
 * @return {number}
 */
DevicePDP11.prototype.readSL = function(addr, fPreWrite)
{
    if (fPreWrite) return 0;
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
    /*
     * pdp11.js disallowed PSW.TF in addition to PSW.UNUSED, but DEC's "TRAP TEST" expects the
     * following instruction to trap:
     *
     *      004174: 052767 000020 173574   BIS   #20,177776
     *
     * Since that test was written for the PDP-11/20, it's possible that newer machines
     * have a different behavior, but for now, we assume that all machines allow setting PSW.TF.
     */
    var maskDisallowed = PDP11.PSW.UNUSED;
    this.cpu.setPSW((data & ~maskDisallowed) | (this.cpu.getPSW() & maskDisallowed));
    this.cpu.opFlags |= PDP11.OPFLAG.NO_FLAGS;
};

/**
 * writeIgnored(data, addr)
 *
 * @this {DevicePDP11}
 * @param {number} data
 * @param {number} addr
 */
DevicePDP11.prototype.writeIgnored = function(data, addr)
{
    if (this.messageEnabled()) {
        this.printMessage("writeIgnored(" + str.toOct(addr) + "): " + str.toOct(data), true, true);
    }
};

/*
 * ES6 ALERT: As you can see below, I've finally started using computed property names.
 */
DevicePDP11.UNIBUS_IOTABLE = {
    [PDP11.UNIBUS.UNIMAP]:  /* 170200 */    [null, null, DevicePDP11.prototype.readUNIMAP,  DevicePDP11.prototype.writeUNIMAP,  "UNIMAP",   64, PDP11.MODEL_1170],
    [PDP11.UNIBUS.SIPDR0]:  /* 172200 */    [null, null, DevicePDP11.prototype.readSIPDR,   DevicePDP11.prototype.writeSIPDR,   "SIPDR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.SDPDR0]:  /* 172220 */    [null, null, DevicePDP11.prototype.readSDPDR,   DevicePDP11.prototype.writeSDPDR,   "SDPDR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.SIPAR0]:  /* 172240 */    [null, null, DevicePDP11.prototype.readSIPAR,   DevicePDP11.prototype.writeSIPAR,   "SIPAR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.SDPAR0]:  /* 172260 */    [null, null, DevicePDP11.prototype.readSDPAR,   DevicePDP11.prototype.writeSDPAR,   "SDPAR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.KIPDR0]:  /* 172300 */    [null, null, DevicePDP11.prototype.readKIPDR,   DevicePDP11.prototype.writeKIPDR,   "KIPDR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.KDPDR0]:  /* 172320 */    [null, null, DevicePDP11.prototype.readKDPDR,   DevicePDP11.prototype.writeKDPDR,   "KDPDR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.KIPAR0]:  /* 172340 */    [null, null, DevicePDP11.prototype.readKIPAR,   DevicePDP11.prototype.writeKIPAR,   "KIPAR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.KDPAR0]:  /* 172360 */    [null, null, DevicePDP11.prototype.readKDPAR,   DevicePDP11.prototype.writeKDPAR,   "KDPAR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.MMR3]:    /* 172516 */    [null, null, DevicePDP11.prototype.readMMR3,    DevicePDP11.prototype.writeMMR3,    "MMR3",     1,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.LKS]:     /* 177546 */    [null, null, DevicePDP11.prototype.readLKS,     DevicePDP11.prototype.writeLKS,     "LKS"],
    [PDP11.UNIBUS.MMR0]:    /* 177572 */    [null, null, DevicePDP11.prototype.readMMR0,    DevicePDP11.prototype.writeMMR0,    "MMR0",     1,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.MMR1]:    /* 177574 */    [null, null, DevicePDP11.prototype.readMMR1,    DevicePDP11.prototype.writeIgnored, "MMR1",     1,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.MMR2]:    /* 177576 */    [null, null, DevicePDP11.prototype.readMMR2,    DevicePDP11.prototype.writeIgnored, "MMR2",     1,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.UIPDR0]:  /* 177600 */    [null, null, DevicePDP11.prototype.readUIPDR,   DevicePDP11.prototype.writeUIPDR,   "UIPDR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.UDPDR0]:  /* 177620 */    [null, null, DevicePDP11.prototype.readUDPDR,   DevicePDP11.prototype.writeUDPDR,   "UDPDR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.UIPAR0]:  /* 177640 */    [null, null, DevicePDP11.prototype.readUIPAR,   DevicePDP11.prototype.writeUIPAR,   "UIPAR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.UDPAR0]:  /* 177660 */    [null, null, DevicePDP11.prototype.readUDPAR,   DevicePDP11.prototype.writeUDPAR,   "UDPAR",    8,  PDP11.MODEL_1145, MessagesPDP11.MMU],
    [PDP11.UNIBUS.R0SET0]:  /* 177700 */    [null, null, DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   "R0SET0"],
    [PDP11.UNIBUS.R1SET0]:  /* 177701 */    [null, null, DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   "R1SET0"],
    [PDP11.UNIBUS.R2SET0]:  /* 177702 */    [null, null, DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   "R2SET0"],
    [PDP11.UNIBUS.R3SET0]:  /* 177703 */    [null, null, DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   "R3SET0"],
    [PDP11.UNIBUS.R4SET0]:  /* 177704 */    [null, null, DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   "R4SET0"],
    [PDP11.UNIBUS.R5SET0]:  /* 177705 */    [null, null, DevicePDP11.prototype.readRSET0,   DevicePDP11.prototype.writeRSET0,   "R5SET0"],
    [PDP11.UNIBUS.R6KERNEL]:/* 177706 */    [null, null, DevicePDP11.prototype.readR6KERNEL,DevicePDP11.prototype.writeR6KERNEL,"R6KERNEL"],
    [PDP11.UNIBUS.R7KERNEL]:/* 177707 */    [null, null, DevicePDP11.prototype.readR7KERNEL,DevicePDP11.prototype.writeR7KERNEL,"R7KERNEL"],
    [PDP11.UNIBUS.R0SET1]:  /* 177710 */    [null, null, DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   "R0SET1",   1,  PDP11.MODEL_1145],
    [PDP11.UNIBUS.R1SET1]:  /* 177711 */    [null, null, DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   "R1SET1",   1,  PDP11.MODEL_1145],
    [PDP11.UNIBUS.R2SET1]:  /* 177712 */    [null, null, DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   "R2SET1",   1,  PDP11.MODEL_1145],
    [PDP11.UNIBUS.R3SET1]:  /* 177713 */    [null, null, DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   "R3SET1",   1,  PDP11.MODEL_1145],
    [PDP11.UNIBUS.R4SET1]:  /* 177714 */    [null, null, DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   "R4SET1",   1,  PDP11.MODEL_1145],
    [PDP11.UNIBUS.R5SET1]:  /* 177715 */    [null, null, DevicePDP11.prototype.readRSET1,   DevicePDP11.prototype.writeRSET1,   "R5SET1",   1,  PDP11.MODEL_1145],
    [PDP11.UNIBUS.R6SUPER]: /* 177716 */    [null, null, DevicePDP11.prototype.readR6SUPER, DevicePDP11.prototype.writeR6SUPER, "R6SUPER",  1,  PDP11.MODEL_1145],
    [PDP11.UNIBUS.R6USER]:  /* 177717 */    [null, null, DevicePDP11.prototype.readR6USER,  DevicePDP11.prototype.writeR6USER,  "R6USER",   1,  PDP11.MODEL_1145],
    [PDP11.UNIBUS.CTRL]:    /* 177740 */    [null, null, DevicePDP11.prototype.readCTRL,    DevicePDP11.prototype.writeCTRL,    "CTRL",     8,  PDP11.MODEL_1170],
    [PDP11.UNIBUS.LSIZE]:   /* 177760 */    [null, null, DevicePDP11.prototype.readSIZE,    DevicePDP11.prototype.writeSIZE,    "LSIZE",    1,  PDP11.MODEL_1170],
    [PDP11.UNIBUS.HSIZE]:   /* 177762 */    [null, null, DevicePDP11.prototype.readSIZE,    DevicePDP11.prototype.writeSIZE,    "HSIZE",    1,  PDP11.MODEL_1170],
    [PDP11.UNIBUS.SYSID]:   /* 177764 */    [null, null, DevicePDP11.prototype.readSYSID,   DevicePDP11.prototype.writeSYSID,   "SYSID",    1,  PDP11.MODEL_1170],
    [PDP11.UNIBUS.CPUERR]:  /* 177766 */    [null, null, DevicePDP11.prototype.readCPUERR,  DevicePDP11.prototype.writeCPUERR,  "CPUERR",   1,  PDP11.MODEL_1170],
    [PDP11.UNIBUS.MB]:      /* 177770 */    [null, null, DevicePDP11.prototype.readMB,      DevicePDP11.prototype.writeMB,      "MB",       1,  PDP11.MODEL_1170],
    [PDP11.UNIBUS.PIR]:     /* 177772 */    [null, null, DevicePDP11.prototype.readPIR,     DevicePDP11.prototype.writePIR,     "PIR"],
    [PDP11.UNIBUS.SL]:      /* 177774 */    [null, null, DevicePDP11.prototype.readSL,      DevicePDP11.prototype.writeSL,      "SL"],
    [PDP11.UNIBUS.PSW]:     /* 177776 */    [null, null, DevicePDP11.prototype.readPSW,     DevicePDP11.prototype.writePSW,     "PSW"]
};

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
        var device;
        var eDevice = aeDevice[iDevice];
        var parmsDevice = Component.getComponentParms(eDevice);
        switch(parmsDevice['type']) {
        case 'default':
            device = new DevicePDP11(parmsDevice);
            Component.bindComponentControls(device, eDevice, PDP11.APPCLASS);
            break;
        case 'pc11':
            device = new PC11(parmsDevice);
            Component.bindComponentControls(device, eDevice, PDP11.APPCLASS);
            break;
        case 'rl11':
            device = new RL11(parmsDevice);
            Component.bindComponentControls(device, eDevice, PDP11.APPCLASS);
            break;
        case 'rk11':
            device = new RK11(parmsDevice);
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
