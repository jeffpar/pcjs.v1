/**
 * @fileoverview Implements the PC8080 CPU module.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
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
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var Messages    = require("./messages");
    var Memory      = require("./memory");
    var State       = require("./state");
    var CPU         = require("./cpu");
    var CPUDef      = require("./cpudef");
}

/**
 * CPUSim(parmsCPU)
 *
 * The CPUSim class uses the following (parmsCPU) properties:
 *
 *      model: a number (eg, 8080) that should match one of the CPUDef.MODEL_* values
 *
 * This extends the CPU class and passes any remaining parmsCPU properties to the CPU class
 * constructor, along with a default speed (cycles per second) based on the specified (or default)
 * CPU model number.
 *
 * The CPUSim class was initially written to simulate a 8080 microprocessor, although over time
 * it may evolved to support other microprocessors (eg, the Zilog Z80).
 *
 * @constructor
 * @extends CPU
 * @param {Object} parmsCPU
 */
function CPUSim(parmsCPU)
{
    this.model = parmsCPU['model'] || CPUDef.MODEL_8080;

    var nCyclesDefault = 0;
    switch(this.model) {
    case CPUDef.MODEL_8080:
    default:
        nCyclesDefault = 1000000;
        break;
    }

    CPU.call(this, parmsCPU, nCyclesDefault);

    /*
     * Initialize processor operation to match the requested model
     */
    this.initProcessor();

    /*
     * A variety of stepCPU() state variables that don't strictly need to be initialized before the first
     * stepCPU() call, but it's good form to do so.
     */
    this.resetCycles();
    this.flags.fComplete = this.flags.fDebugCheck = false;

    /*
     * If there are no live registers to display, then updateStatus() can skip a bit....
     */
    this.cLiveRegs = 0;

    /*
     * We're just declaring aBusBlocks and associated Bus parameters here; they'll be initialized by initMemory()
     * when the Bus is initialized.
     */
    this.aBusBlocks = [];
    this.nBusMask = 0;
    this.nBlockShift = this.nBlockSize = this.nBlockLimit = this.nBlockTotal = this.nBlockMask = 0;

    /*
     * This initial resetRegs() call is important to create all the registers, so that if/when we call restore(),
     * it will have something to fill in.
     */
    this.resetRegs();
}

Component.subclass(CPUSim, CPU);

/**
 * initMemory(aBusBlocks, nBlockShift, nBusMask)
 *
 * Notification from Bus.initMemory(), giving us direct access to the entire memory space.
 *
 * @this {CPUSim}
 * @param {Array} aBusBlocks
 * @param {number} nBlockShift
 * @param {number} nBusMask
 */
CPUSim.prototype.initMemory = function(aBusBlocks, nBlockShift, nBusMask)
{
    this.aBusBlocks = aBusBlocks;
    this.nBlockShift = nBlockShift;
    this.nBlockSize = 1 << this.nBlockShift;
    this.nBlockLimit = this.nBlockSize - 1;
    this.nBlockTotal = aBusBlocks.length;
    this.nBlockMask = this.nBlockTotal - 1;
    this.nBusMask = nBusMask;
};

/**
 * addMemBreak(addr, fWrite)
 *
 * NOTE: addMemBreak() could be merged with addMemCheck(), but the new merged interface would
 * have to provide one additional parameter indicating whether the Debugger or the CPU is the client.
 *
 * For now, this is simply a DEBUGGER-only interface.
 *
 * @this {CPUSim}
 * @param {number} addr
 * @param {boolean} fWrite is true for a memory write breakpoint, false for a memory read breakpoint
 */
CPUSim.prototype.addMemBreak = function(addr, fWrite)
{
    if (DEBUGGER) {
        var iBlock = addr >>> this.nBlockShift;
        this.aBusBlocks[iBlock].addBreakpoint(addr & this.nBlockLimit, fWrite);
    }
};

/**
 * removeMemBreak(addr, fWrite)
 *
 * NOTE: removeMemBreak() could be merged with removeMemCheck(), but the new merged interface would
 * have to provide one additional parameter indicating whether the Debugger or the CPU is the client.
 *
 * For now, this is simply a DEBUGGER-only interface.
 *
 * @this {CPUSim}
 * @param {number} addr
 * @param {boolean} fWrite is true for a memory write breakpoint, false for a memory read breakpoint
 */
CPUSim.prototype.removeMemBreak = function(addr, fWrite)
{
    if (DEBUGGER) {
        var iBlock = addr >>> this.nBlockShift;
        this.aBusBlocks[iBlock].removeBreakpoint(addr & this.nBlockLimit, fWrite);
    }
};

/**
 * addMemCheck(addr, fWrite)
 *
 * These functions provide Debug register functionality to the CPU by leveraging the same Memory block-based
 * breakpoint support originally created for our built-in Debugger.  Only minimal changes were required to the
 * Memory component, by adding additional checkMemoryException() call-outs from the "checked" Memory access
 * functions.
 *
 * Note that those call-outs occur only AFTER our own Debugger (if present) has checked the address and has
 * passed on it, because we want our own Debugger's breakpoints to take precedence over any breakpoints that
 * the emulated machine may have enabled.
 *
 * @this {CPUSim}
 * @param {number} addr
 * @param {boolean} fWrite is true for a memory write check, false for a memory read check
 */
CPUSim.prototype.addMemCheck = function(addr, fWrite)
{
    var iBlock = addr >>> this.nBlockShift;
    this.aBusBlocks[iBlock].addBreakpoint(addr & this.nBlockLimit, fWrite, this);
};

/**
 * removeMemCheck(addr, fWrite)
 *
 * @this {CPUSim}
 * @param {number} addr
 * @param {boolean} fWrite is true for a memory write check, false for a memory read check
 */
CPUSim.prototype.removeMemCheck = function(addr, fWrite)
{
    var iBlock = addr >>> this.nBlockShift;
    this.aBusBlocks[iBlock].removeBreakpoint(addr & this.nBlockLimit, fWrite);
};

/**
 * initProcessor()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.initProcessor = function()
{
    this.aOps = CPUDef.aOps;
};

/**
 * reset()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.reset = function()
{
    if (this.flags.fRunning) this.stopCPU();
    this.resetRegs();
    this.resetCycles();
    this.clearError();      // clear any fatal error/exception that setError() may have flagged
};

/**
 * resetRegs()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.resetRegs = function()
{
    this.regA = 0;
    this.regB = 0;
    this.regC = 0;
    this.regD = 0;
    this.regE = 0;
    this.regH = 0;
    this.regL = 0;
    this.setSP(0);
    this.setPC(0);

    /*
     * This resets the Processor Status flags (regPS), along with all the internal "result registers";
     * we've taken care to ensure that both CPL and IOPL are initialized before this first setPS() call.
     */
    this.setPS(0);

    /*
     * intFlags contains some internal states we use to indicate whether a hardware interrupt (INTFLAG.INTR) or
     * Trap software interrupt (INTR.TRAP) has been requested, as well as when we're in a "HLT" state (INTFLAG.HALT)
     * that requires us to wait for a hardware interrupt (INTFLAG.INTR) before continuing execution.
     *
     * intFlags must be cleared only by checkINTR(), whereas opFlags must be cleared prior to every CPU operation.
     */
    this.intFlags = CPUDef.INTFLAG.NONE;
};

/**
 * getChecksum()
 *
 * @this {CPUSim}
 * @return {number} a 32-bit summation of key elements of the current CPU state (used by the CPU checksum code)
 */
CPUSim.prototype.getChecksum = function()
{
    var sum = (this.regA + this.regB + this.regC + this.regD + this.regE + this.regH + this.regL)|0;
    sum = (sum + this.getSP() + this.getPC() + this.getPS())|0;
    return sum;
};

/**
 * save()
 *
 * This implements save support for the CPUSim component.
 *
 * @this {CPUSim}
 * @return {Object|null}
 */
CPUSim.prototype.save = function()
{
    var state = new State(this);
    state.set(0, [this.regA, this.regB, this.regC, this.regD, this.regE, this.regH, this.regL, this.getSP(), this.getPC(), this.getPS()]);
    state.set(1, [this.opFlags, this.intFlags, this.nTotalCycles, this.getSpeed()]);
    state.set(2, this.bus.saveMemory());
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the CPUSim component.
 *
 * @this {CPUSim}
 * @param {Object} data
 * @return {boolean} true if restore successful, false if not
 */
CPUSim.prototype.restore = function(data)
{
    var a = data[0];
    this.regA = a[0];
    this.regB = a[1];
    this.regC = a[2];
    this.regD = a[3];
    this.regE = a[4];
    this.regH = a[5];
    this.regL = a[6];
    this.setSP(a[7]);
    this.setPC(a[8]);
    this.setPS(a[9]);
    a = data[1];
    this.opFlags = a[0];
    this.intFlags = a[1];
    this.nTotalCycles = a[2];
    this.setSpeed(a[3]);
    return this.bus.restoreMemory(data[2]);
};

/**
 * setBinding(sHTMLType, sBinding, control, sValue)
 *
 * @this {CPUSim}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "AX")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
CPUSim.prototype.setBinding = function(sHTMLType, sBinding, control, sValue)
{
    var fBound = false;
    switch (sBinding) {
    case "A":
    case "B":
    case "C":
    case "D":
    case "E":
    case "H":
    case "L":
    case "SP":
    case "PC":
    case "F":
    case "SF":
    case "ZF":
    case "AF":
    case "PF":
    case "CF":
        this.bindings[sBinding] = control;
        this.cLiveRegs++;
        fBound = true;
        break;
    default:
        fBound = this.parent.setBinding.call(this, sHTMLType, sBinding, control);
        break;
    }
    return fBound;
};

/**
 * getBC()
 *
 * @this {CPUSim}
 * @return {number}
 */
CPUSim.prototype.getBC = function()
{
    return (this.regB << 8) | this.regC;
};

/**
 * setBC(w)
 *
 * @this {CPUSim}
 * @param {number} w
 */
CPUSim.prototype.setBC = function(w)
{
    this.regB = (w >> 8) & 0xff;
    this.regC = w & 0xff;
};

/**
 * getDE()
 *
 * @this {CPUSim}
 * @return {number}
 */
CPUSim.prototype.getDE = function()
{
    return (this.regD << 8) | this.regE;
};

/**
 * setDE(w)
 *
 * @this {CPUSim}
 * @param {number} w
 */
CPUSim.prototype.setDE = function(w)
{
    this.regD = (w >> 8) & 0xff;
    this.regE = w & 0xff;
};

/**
 * getHL()
 *
 * @this {CPUSim}
 * @return {number}
 */
CPUSim.prototype.getHL = function()
{
    return (this.regH << 8) | this.regL;
};

/**
 * setHL(w)
 *
 * @this {CPUSim}
 * @param {number} w
 */
CPUSim.prototype.setHL = function(w)
{
    this.regH = (w >> 8) & 0xff;
    this.regL = w & 0xff;
};

/**
 * getSP()
 *
 * @this {CPUSim}
 * @return {number}
 */
CPUSim.prototype.getSP = function()
{
    return this.regSP;
};

/**
 * setSP(off)
 *
 * @this {CPUSim}
 * @param {number} off
 */
CPUSim.prototype.setSP = function(off)
{
    this.regSP = off & 0xffff;
};

/**
 * getPC()
 *
 * @this {CPUSim}
 * @return {number}
 */
CPUSim.prototype.getPC = function()
{
    return this.regPC;
};

/**
 * setPC(off)
 *
 * @this {CPUSim}
 * @param {number} off
 */
CPUSim.prototype.setPC = function(off)
{
    this.regPC = off & 0xffff;
};

/**
 * getCF()
 *
 * @this {CPUSim}
 * @return {number} 0 or CPUDef.PS.CF
 */
CPUSim.prototype.getCF = function()
{
    return (this.resultZeroCarry & 0x100)? CPUDef.PS.CF : 0;
};

/**
 * getPF()
 *
 * @this {CPUSim}
 * @return {number} 0 or CPUDef.PS.PF
 */
CPUSim.prototype.getPF = function()
{
    return (CPUDef.PARITY[this.resultParitySign & 0xff])? CPUDef.PS.PF : 0;
};

/**
 * getAF()
 *
 * @this {CPUSim}
 * @return {number} 0 or CPUDef.PS.AF
 */
CPUSim.prototype.getAF = function()
{
    return ((this.resultParitySign ^ this.resultAuxOverflow) & 0x10)? CPUDef.PS.AF : 0;
};

/**
 * getZF()
 *
 * @this {CPUSim}
 * @return {number} 0 or CPUDef.PS.ZF
 */
CPUSim.prototype.getZF = function()
{
    return (this.resultZeroCarry & 0xff)? 0 : CPUDef.PS.ZF;
};

/**
 * getSF()
 *
 * @this {CPUSim}
 * @return {number} 0 or CPUDef.PS.SF
 */
CPUSim.prototype.getSF = function()
{
    return (this.resultParitySign & 0x80)? CPUDef.PS.SF : 0;
};

/**
 * getIF()
 *
 * @this {CPUSim}
 * @return {number} 0 or CPUDef.PS.IF
 */
CPUSim.prototype.getIF = function()
{
    return (this.regPS & CPUDef.PS.IF);
};

/**
 * clearCF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.clearCF = function()
{
    this.resultZeroCarry &= 0xff;
};

/**
 * clearPF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.clearPF = function()
{
    if (this.getPF()) this.resultParitySign ^= 0x1;
};

/**
 * clearAF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.clearAF = function()
{
    this.resultAuxOverflow = (this.resultParitySign & 0x10) | (this.resultAuxOverflow & ~0x10);
};

/**
 * clearZF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.clearZF = function()
{
    this.resultZeroCarry |= 0xff;
};

/**
 * clearSF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.clearSF = function()
{
    if (this.getSF()) this.resultParitySign ^= 0xc0;
};

/**
 * clearIF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.clearIF = function()
{
    this.regPS &= ~CPUDef.PS.IF;
};

/**
 * setCF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.setCF = function()
{
    this.resultZeroCarry |= 0x100;
};

/**
 * setPF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.setPF = function()
{
    if (!this.getPF()) this.resultParitySign ^= 0x1;
};

/**
 * setAF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.setAF = function()
{
    this.resultAuxOverflow = (~this.resultParitySign & 0x10) | (this.resultAuxOverflow & ~0x10);
};

/**
 * setZF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.setZF = function()
{
    this.resultZeroCarry &= ~0xff;
};

/**
 * setSF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.setSF = function()
{
    if (!this.getSF()) this.resultParitySign ^= 0xc0;
};

/**
 * setIF()
 *
 * @this {CPUSim}
 */
CPUSim.prototype.setIF = function()
{
    this.regPS |= CPUDef.PS.IF;
};

/**
 * updateAF(fAuxCarry)
 *
 * @this {CPUSim}
 * @param {boolean} fAuxCarry
 */
CPUSim.prototype.updateAF = function(fAuxCarry)
{
    if (fAuxCarry) {
        this.setAF();
    } else {
        this.clearAF();
    }
};

/**
 * updateCF(fCarry)
 *
 * @this {CPUSim}
 * @param {boolean} fCarry
 */
CPUSim.prototype.updateCF = function(fCarry)
{
    if (fCarry) {
        this.resultZeroCarry |= 0x100;
    } else {
        this.resultZeroCarry &= ~0x100;
    }
};

/**
 * getPS()
 *
 * @this {CPUSim}
 * @return {number}
 */
CPUSim.prototype.getPS = function()
{
    return (this.regPS & ~CPUDef.PS.INDIRECT) | (this.getSF() | this.getZF() | this.getAF() | this.getPF() | this.getCF());
};

/**
 * setPS(regPS)
 *
 * @this {CPUSim}
 * @param {number} regPS
 */
CPUSim.prototype.setPS = function(regPS)
{
    this.resultZeroCarry = this.resultParitySign = this.resultAuxOverflow = 0;
    if (regPS & CPUDef.PS.CF) this.resultZeroCarry |= 0x100;
    if (!(regPS & CPUDef.PS.PF)) this.resultParitySign |= 0x01;
    if (regPS & CPUDef.PS.AF) this.resultAuxOverflow |= 0x10;
    if (!(regPS & CPUDef.PS.ZF)) this.resultZeroCarry |= 0xff;
    if (regPS & CPUDef.PS.SF) this.resultParitySign ^= 0xc0;
    this.regPS = (this.regPS & ~CPUDef.PS.DIRECT) | (regPS & CPUDef.PS.DIRECT) | CPUDef.PS.SET;
    Component.assert((regPS & CPUDef.PS.INDIRECT) == (this.getPS() & CPUDef.PS.INDIRECT));
};

/**
 * incByte(b)
 *
 * @this {CPUSim}
 * @param {number} b
 * @return {number}
 */
CPUSim.prototype.incByte = function(b)
{
    this.resultAuxOverflow = b;
    b = (this.resultParitySign = b + 1) & 0xff;
    this.resultZeroCarry = (this.resultZeroCarry & ~0xff) | b;
    return b;
};

/**
 * decByte(b)
 *
 * @this {CPUSim}
 * @param {number} b
 * @return {number}
 */
CPUSim.prototype.decByte = function(b)
{
    this.resultAuxOverflow = b;
    b = (this.resultParitySign = b - 1) & 0xff;
    this.resultZeroCarry = (this.resultZeroCarry & ~0xff) | b;
    return b;
};

/**
 * addByte(dst, src)
 *
 * @this {CPUSim}
 * @param {number} dst
 * @param {number} src
 * @return {number} dst + src
 */
CPUSim.prototype.addByte = function(dst, src)
{
    this.resultAuxOverflow = dst ^ src;
    return (this.resultZeroCarry = this.resultParitySign = dst + src) & 0xff;
};

/**
 * addByteCarry(dst, src)
 *
 * @this {CPUSim}
 * @param {number} dst
 * @param {number} src
 * @return {number} dst + src + carry
 */
CPUSim.prototype.addByteCarry = function(dst, src)
{
    this.resultAuxOverflow = dst ^ src;
    return (this.resultZeroCarry = this.resultParitySign = dst + src + ((this.resultZeroCarry & 0x100)? 1 : 0)) & 0xff;
};

/**
 * getByte(addr)
 *
 * @this {CPUSim}
 * @param {number} addr is a linear address
 * @return {number} byte (8-bit) value at that address
 */
CPUSim.prototype.getByte = function(addr)
{
    return this.aBusBlocks[(addr & this.nBusMask) >>> this.nBlockShift].readByte(addr & this.nBlockLimit, addr);
};

/**
 * getWord(addr)
 *
 * @this {CPUSim}
 * @param {number} addr is a linear address
 * @return {number} word (16-bit) value at that address
 */
CPUSim.prototype.getWord = function(addr)
{
    var off = addr & this.nBlockLimit;
    var iBlock = (addr & this.nBusMask) >>> this.nBlockShift;
    if (off < this.nBlockLimit) {
        return this.aBusBlocks[iBlock].readShort(off, addr);
    }
    var w = this.aBusBlocks[iBlock].readByte(off, addr);
    w |= this.aBusBlocks[(iBlock + 1) & this.nBlockMask].readByte(0, addr + 1) << 8;
    return w;
};

/**
 * setByte(addr, b)
 *
 * @this {CPUSim}
 * @param {number} addr is a linear address
 * @param {number} b is the byte (8-bit) value to write (which we truncate to 8 bits; required by opSTOSb)
 */
CPUSim.prototype.setByte = function(addr, b)
{
    this.aBusBlocks[(addr & this.nBusMask) >>> this.nBlockShift].writeByte(addr & this.nBlockLimit, b & 0xff, addr);
};

/**
 * setWord(addr, w)
 *
 * @this {CPUSim}
 * @param {number} addr is a linear address
 * @param {number} w is the word (16-bit) value to write (which we truncate to 16 bits to be safe)
 */
CPUSim.prototype.setWord = function(addr, w)
{
    var off = addr & this.nBlockLimit;
    var iBlock = (addr & this.nBusMask) >>> this.nBlockShift;
    if (off < this.nBlockLimit) {
        this.aBusBlocks[iBlock].writeShort(off, w & 0xffff, addr);
        return;
    }
    this.aBusBlocks[iBlock++].writeByte(off, w & 0xff, addr);
    this.aBusBlocks[iBlock & this.nBlockMask].writeByte(0, (w >> 8) & 0xff, addr + 1);
};

/**
 * getPCByte()
 *
 * @this {CPUSim}
 * @return {number} byte at the current PC; PC advanced by 1
 */
CPUSim.prototype.getPCByte = function()
{
    var b = this.getByte(this.regPC);
    this.setPC(this.regPC + 1);
    return b;
};

/**
 * getPCWord()
 *
 * @this {CPUSim}
 * @return {number} word at the current PC; PC advanced by 2
 */
CPUSim.prototype.getPCWord = function()
{
    var w = this.getWord(this.regPC);
    this.setPC(this.regPC + 2);
    return w;
};

/**
 * popWord()
 *
 * @this {CPUSim}
 * @return {number} word popped from the current SP; SP increased by 2
 */
CPUSim.prototype.popWord = function()
{
    var w = this.getWord(this.regSP);
    this.setSP(this.regSP + 2);
    return w;
};

/**
 * pushWord(w)
 *
 * @this {CPUSim}
 * @param {number} w is the word (16-bit) value to push at current SP; SP decreased by 2
 */
CPUSim.prototype.pushWord = function(w)
{
    this.setSP(this.regSP - 2);
    this.setWord(this.regSP, w);
};

/**
 * checkINTR()
 *
 * This must only be called when intFlags (containing the simulated INTFLAG.INTR signal) is known to be set.
 * Note that it's perfectly possible that between the time updateINTR(true) was called and we request the
 * interrupt vector number below, the interrupt could have been cleared or masked, in which case getIRRVector()
 * will return -1 and we'll simply clear INTFLAG.INTR.
 *
 * @this {CPUSim}
 * @return {boolean} true if h/w interrupt (or trap) has just been acknowledged, false if not
 */
CPUSim.prototype.checkINTR = function()
{
    return false;
};

/**
 * updateINTR(fRaise)
 *
 * This is called by the ChipSet component whenever a h/w interrupt needs to be simulated.
 * This is how the PIC component simulates raising the INTFLAG.INTR signal.  We will honor the request
 * only if we have a reference back to the ChipSet component.  The CPU will then "respond" by calling
 * checkINTR() and request the corresponding interrupt vector from the ChipSet.
 *
 * @this {CPUSim}
 * @param {boolean} fRaise is true to raise INTFLAG.INTR, false to lower
 */
CPUSim.prototype.updateINTR = function(fRaise)
{
    if (this.chipset) {
        if (fRaise) {
            this.intFlags |= CPUDef.INTFLAG.INTR;
        } else {
            this.intFlags &= ~CPUDef.INTFLAG.INTR;
        }
    }
};

/**
 * updateReg(sReg, nValue, cch)
 *
 * This function helps updateStatus() by massaging the register names and values according to
 * CPU type before passing the call to displayValue(); in the "old days", updateStatus() called
 * displayValue() directly (although then it was called displayReg()).
 *
 * @this {CPUSim}
 * @param {string} sReg
 * @param {number} nValue
 * @param {number} [cch] (default is 2 hex digits)
 */
CPUSim.prototype.updateReg = function(sReg, nValue, cch)
{
    this.displayValue(sReg, nValue, cch || 2);
};

/**
 * updateStatus(fForce)
 *
 * This provides periodic Control Panel updates (eg, a few times per second; see STATUS_UPDATES_PER_SECOND).
 * this is where we take care of any DOM updates (eg, register values) while the CPU is running.
 *
 * Any high-frequency updates should be performed in updateVideo(), which should avoid DOM updates, since updateVideo()
 * can be called up to 60 times per second (see VIDEO_UPDATES_PER_SECOND).
 *
 * @this {CPUSim}
 * @param {boolean} [fForce] (true will display registers even if the CPU is running and "live" registers are not enabled)
 */
CPUSim.prototype.updateStatus = function(fForce)
{
    if (this.cLiveRegs) {
        if (fForce || !this.flags.fRunning || this.flags.fDisplayLiveRegs) {
            this.updateReg("A", this.regA);
            this.updateReg("B", this.regB);
            this.updateReg("C", this.regC);
            this.updateReg("D", this.regD);
            this.updateReg("E", this.regE);
            this.updateReg("H", this.regH);
            this.updateReg("L", this.regL);
            this.updateReg("SP", this.getSP(), 4);
            this.updateReg("PC", this.getPC(), 4);
            var regPS = this.getPS();
            this.updateReg("F", regPS, 2);
            this.updateReg("SF", (regPS & CPUDef.PS.SF), 1);
            this.updateReg("ZF", (regPS & CPUDef.PS.ZF), 1);
            this.updateReg("AF", (regPS & CPUDef.PS.AF), 1);
            this.updateReg("PF", (regPS & CPUDef.PS.PF), 1);
            this.updateReg("CF", (regPS & CPUDef.PS.CF), 1);
        }
    }
    var controlSpeed = this.bindings["speed"];
    if (controlSpeed) controlSpeed.textContent = this.getSpeedCurrent();
};

/**
 * stepCPU(nMinCycles)
 *
 * NOTE: Single-stepping should not be confused with the Trap flag; single-stepping is a Debugger
 * operation that's completely independent of Trap status.  The CPU can go in and out of Trap mode,
 * in and out of h/w interrupt service routines (ISRs), etc, but from the Debugger's perspective,
 * they're all one continuous stream of instructions that can be stepped or run at will.  Moreover,
 * stepping vs. running should never change the behavior of the simulation.
 *
 * As a result, the Debugger's complete independence means you can run other 8086/8088 debuggers
 * (eg, DEBUG) inside the simulation without interference; you can even "debug" them with the Debugger.
 *
 * @this {CPUSim}
 * @param {number} nMinCycles (0 implies a single-step, and therefore breakpoints should be ignored)
 * @return {number} of cycles executed; 0 indicates a pre-execution condition (ie, an execution breakpoint
 * was hit), -1 indicates a post-execution condition (eg, a read or write breakpoint was hit), and a positive
 * number indicates successful completion of that many cycles (which should always be >= nMinCycles).
 */
CPUSim.prototype.stepCPU = function(nMinCycles)
{
    /*
     * The Debugger uses fComplete to determine if the instruction completed (true) or was interrupted
     * by a breakpoint or some other exceptional condition (false).  NOTE: this does NOT include JavaScript
     * exceptions, which stepCPU() expects the caller to catch using its own exception handler.
     *
     * The CPU relies on the use of stopCPU() rather than fComplete, because the CPU never single-steps
     * (ie, nMinCycles is always some large number), whereas the Debugger does.  And conversely, when the
     * Debugger is single-stepping (even when performing multiple single-steps), fRunning is never set,
     * so stopCPU() would have no effect as far as the Debugger is concerned.
     */
    this.flags.fComplete = true;

    /*
     * fDebugCheck is true if we need to "check" every instruction with the Debugger.
     */
    var fDebugCheck = this.flags.fDebugCheck = (DEBUGGER && this.dbg && this.dbg.checksEnabled());

    /*
     * nDebugState is checked only when fDebugCheck is true, and its sole purpose is to tell the first call
     * to checkInstruction() that it can skip breakpoint checks, and that will be true ONLY when fStarting is
     * true OR nMinCycles is zero (the latter means the Debugger is single-stepping).
     *
     * Once we snap fStarting, we clear it, because technically, we've moved beyond "starting" and have
     * officially "started" now.
     */
    var nDebugState = (!nMinCycles)? -1 : (this.flags.fStarting? 0 : 1);
    this.flags.fStarting = false;

    /*
     * We move the minimum cycle count to nStepCycles (the number of cycles left to step), so that other
     * functions have the ability to force that number to zero (eg, stopCPU()), and thus we don't have to check
     * any other criteria to determine whether we should continue stepping or not.
     */
    this.nBurstCycles = this.nStepCycles = nMinCycles;

    /*
     * NOTE: Even though runCPU() calls updateAllTimers(), we need an additional call here if we're being
     * called from the Debugger, so that any single-stepping will update the timers as well.
     */
    if (this.chipset && !nMinCycles) this.chipset.updateAllTimers();

    /*
     * Let's also suppress h/w interrupts whenever the Debugger is single-stepping an instruction; I'm loathe
     * to allow Debugger interactions to affect the behavior of the virtual machine in ANY way, but I'm making
     * this small concession to avoid the occasional and sometimes unexpected Debugger command that ends up
     * stepping into a hardware interrupt service routine (ISR).
     *
     * Note that this is similar to the problem discussed in checkINTR() regarding the priority of external h/w
     * interrupts vs. Trap interrupts, but they require different solutions, because our Debugger operates
     * independently of the CPU.
     *
     * One exception I make here is when you've asked the Debugger to display PIC messages, the idea being that
     * if you're watching the PIC that closely, then you want to hardware interrupts to occur regardless.
     */
    if (!nMinCycles) this.opFlags |= CPUDef.OPFLAG.NOINTR;

    do {
        if (this.intFlags) {
            if (this.checkINTR()) {
                if (!nMinCycles) {
                    this.assert(DEBUGGER);  // nMinCycles of zero should be generated ONLY by the Debugger
                    if (DEBUGGER) {
                        this.println("interrupt dispatched");
                        this.opFlags = 0;
                        break;
                    }
                }
            }
            if (this.intFlags & CPUDef.INTFLAG.HALT) {
                /*
                 * As discussed in opHLT(), the CPU is never REALLY halted by a HLT instruction; instead,
                 * opHLT() sets CPUDef.INTFLAG.HALT, signalling to us that we're free to end the current burst
                 * AND that we should not execute any more instructions until checkINTR() indicates a hardware
                 * interrupt has been requested.
                 *
                 * One downside to this approach is that it *might* appear to the careful observer that we
                 * executed a full complement of instructions during bursts where CPUDef.INTFLAG.HALT was set,
                 * when in fact we did not.  However, the steady advance of the overall cycle count, and thus
                 * the steady series calls to stepCPU(), is needed to ensure that timer updates, video updates,
                 * etc, all continue to occur at the expected rates.
                 *
                 * If necessary, we can add another bookkeeping cycle counter (eg, one that keeps tracks of the
                 * number of cycles during which we did not actually execute any instructions).
                 */
                this.nStepCycles = 0;
                this.opFlags = 0;
                break;
            }
        }

        if (DEBUGGER && fDebugCheck) {
            if (this.dbg.checkInstruction(this.regPC, nDebugState)) {
                this.stopCPU();
                break;
            }
            nDebugState = 1;
        }

        this.opFlags = 0;

        this.aOps[this.getPCByte()].call(this);

    } while (this.nStepCycles > 0);

    return (this.flags.fComplete? this.nBurstCycles - this.nStepCycles : (this.flags.fComplete === undefined? 0 : -1));
};

/**
 * CPUSim.init()
 *
 * This function operates on every HTML element of class "cpu", extracting the
 * JSON-encoded parameters for the CPUSim constructor from the element's "data-value"
 * attribute, invoking the constructor (which in turn invokes the CPU constructor)
 * to create a CPUSim component, and then binding any associated HTML controls to the
 * new component.
 */
CPUSim.init = function()
{
    var aeCPUs = Component.getElementsByClass(document, PCJSCLASS, "cpu");
    for (var iCPU = 0; iCPU < aeCPUs.length; iCPU++) {
        var eCPU = aeCPUs[iCPU];
        var parmsCPU = Component.getComponentParms(eCPU);
        var cpu = new CPUSim(parmsCPU);
        Component.bindComponentControls(cpu, eCPU, PCJSCLASS);
    }
};

/*
 * Initialize every CPU module on the page
 */
web.onInit(CPUSim.init);

if (NODE) module.exports = CPUSim;
