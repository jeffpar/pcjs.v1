/**
 * @fileoverview Implements PCjs X86 Segment objects
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2014-Sep-10
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
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
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

if (typeof module !== 'undefined') {
    var X86 = require("./x86");
    var X86Help = require("./x86help");
}

/**
 * X86Seg(cpu, sName)
 * 
 * @constructor
 * @param {X86CPU} cpu
 * @param {string} [sName] segment name
 * @param {boolean} [fProt] true if segment register used exclusively in protected-mode 
 */
function X86Seg(cpu, sName, fProt)
{
    this.cpu = cpu;
    this.sel = 0;
    this.base = 0;
    this.limit = 0xffff;
    this.acc = 0;
    this.level = 0;
    this.sName = sName;
    this.setProt(fProt);
}

/*
 * Class methods
 */

/**
 * loadReal(sel, fSuppress)
 * 
 * This is the default real-mode load() function.
 *
 * @this {X86Seg}
 * @param {number} sel containing a selector
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number} base address of selected segment, or -1 if error
 */
X86Seg.loadReal = function loadReal(sel, fSuppress)
{
    this.sel = sel;
    this.limit = 0xffff;        // TODO: Consider NOT setting the limit field in real-mode (unless it's required for, say, LOADALL support?)
    return this.base = sel << 4;
};

/**
 * loadProt(sel, fSuppress)
 *
 * This replaces the segment's default load() function whenever the segment is notified (eg, by the CPU's setProtMode()
 * function) the processor is now in protected-mode.
 * 
 * Segments in protected-mode are referenced by selectors, which are indexes into descriptor tables (GDT, LDT, IDT) whose
 * descriptors are 4-word (8-byte) entries:
 *
 *      word 0: segment limit (0-15)
 *      word 1: base address low
 *      word 2: base address high (0-7), segment type (8-11), descriptor type (12), DPL (13-14), present bit (15)
 *      word 3: used only on 80386 and up (should be set to zero for upward compatibility)
 *      
 * See X86.DESC for offset and bit definitions.
 *
 * @this {X86Seg}
 * @param {number} sel containing a selector
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number} base address of selected segment, or -1 if error
 */
X86Seg.loadProt = function loadProt(sel, fSuppress)
{
    var addrDT;
    var addrDTLimit;
    if (!(sel & X86.SEL.LDT)) {
        addrDT = this.cpu.addrGDT;
        addrDTLimit = this.cpu.addrGDTLimit;
    } else {
        addrDT = this.cpu.segLDT.base;
        addrDTLimit = this.cpu.segLDT.limit;
    }
    var offDT = addrDT + (sel & X86.SEL.MASK);
    if (offDT + 7 <= addrDTLimit) {
        this.checkRead = X86Seg.checkReadProtEnabled;
        this.checkWrite = X86Seg.checkWriteProtEnabled;
        
        /*
         * TODO: This is only the first of many steps toward accurately counting cycles in protected mode;
         * I simply noticed that "POP segreg" takes 5 cycles in real mode and 20 in protected mode, so I'm
         * starting with a 15-cycle penalty.  Obviously the penalty will be much greater when the load fails.
         */
        this.cpu.nStepCycles -= 15;
        
        var limit = this.cpu.getWord(offDT + X86.DESC.LIMIT.OFFSET);
        var acc = this.cpu.getWord(offDT + X86.DESC.ACC.OFFSET);
        var base = this.cpu.getWord(offDT + X86.DESC.BASE.OFFSET) | ((acc & X86.DESC.ACC.BASE1623) << 16);
        /*
         * For LSL (which uses fSuppress), we must support X86.DESC.ACC.TYPE.SEG as well as TSS and LDT.
         */
        var accType = (acc & X86.DESC.ACC.TYPE.MASK);
        if (accType & X86.DESC.ACC.TYPE.SEG) {
            if ((accType & X86.DESC.ACC.TYPE.CODE_READABLE) == X86.DESC.ACC.TYPE.CODE) {
                this.checkWrite = X86Seg.checkReadProtDisabled;
            }
            if ((accType & X86.DESC.ACC.TYPE.CODE) || !(accType & X86.DESC.ACC.TYPE.WRITEABLE)) {
                this.checkWrite = X86Seg.checkWriteProtDisabled;
            }
            this.sel = sel;
            this.limit = limit;
            this.acc = acc;
            this.level = (acc & X86.DESC.ACC.LEVEL.MASK) >> X86.DESC.ACC.LEVEL.SHIFT;
            return this.base = base;
        }
        else if (accType && accType <= X86.DESC.ACC.TYPE.TSS_BUSY) {
            this.sel = sel;
            this.limit = limit;
            this.acc = acc;
            this.level = (acc & X86.DESC.ACC.LEVEL.MASK) >> X86.DESC.ACC.LEVEL.SHIFT;
            return this.base = base;
        }
    }
    return -1;
};

/**
 * checkReadReal(off, cb)
 *
 * TODO: Invoke X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT) if off is 0xffff and cb is 1;
 * also, whether or not the opHelpFault() call should include an error code, since this is happening in real-mode.
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number} corresponding physical address if valid, -1 if not
 */
X86Seg.checkReadReal = function checkReadReal(off, cb, fSuppress)
{
    return this.base + off;
};

/**
 * checkWriteReal(off, cb)
 *
 * TODO: Invoke X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT) if off is 0xffff and cb is 1;
 * also, whether or not the opHelpFault() call should include an error code, since this is happening in real-mode.
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number} corresponding physical address if valid, -1 if not
 */
X86Seg.checkWriteReal = function checkWriteReal(off, cb, fSuppress)
{
    return this.base + off;
};

/**
 * checkReadProtEnabled(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number} corresponding physical address if valid, -1 if not
 */
X86Seg.checkReadProtEnabled = function checkReadProtEnabled(off, cb, fSuppress)
{
    if (off + cb <= this.limit) {
        return this.base + off;
    }
    return X86Seg.checkReadProtDisabled.call(this, off, cb, fSuppress);
};

/**
 * checkReadProtDisabled(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number} corresponding physical address if valid, -1 if not
 */
X86Seg.checkReadProtDisabled = function checkReadProtDisabled(off, cb, fSuppress)
{
    if (!fSuppress) {
        X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT, 0);
    }
    return -1;
};

/**
 * checkWriteProtEnabled(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number} corresponding physical address if valid, -1 if not
 */
X86Seg.checkWriteProtEnabled = function checkWriteProtEnabled(off, cb, fSuppress)
{
    if (off + cb <= this.limit) {
        return this.base + off;
    }
    return X86Seg.checkWriteProtDisabled.call(this, off, cb, fSuppress);
};

/**
 * checkWriteProtDisabled(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number} corresponding physical address if valid, -1 if not
 */
X86Seg.checkWriteProtDisabled = function checkWriteProtDisabled(off, cb, fSuppress)
{
    if (!fSuppress) {
        X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT, 0);
    }
    return -1;
};

/*
 * Object methods
 */

/**
 * save()
 *
 * Early versions of PCjs saved only segment selectors, since that's all that mattered in real-mode;
 * newer versions need to save/restore the entire segment object.
 * 
 * @this {X86Seg}
 * @return {Array}
 */
X86Seg.prototype.save = function()
{
    return [this.sel, this.base, this.limit, this.acc, this.level, this.sName];
};

/**
 * restore(a)
 *
 * Early versions of PCjs saved only segment selectors, since that's all that mattered in real-mode;
 * newer versions need to save/restore the entire segment object.
 * 
 * @this {X86Seg}
 * @param {Array|number} a
 */
X86Seg.prototype.restore = function(a)
{
    if (typeof a == "number") {
        this.load(a);
    } else {
        this.sel   = a[0];
        this.base  = a[1];
        this.limit = a[2];
        this.acc   = a[3];
        this.level = a[4];
        this.sName = a[5];
    }
};

/**
 * setBase(addr)
 * 
 * This is used in unusual situations where the base must be set independently; normally, the base
 * is set according to the selector provided to load(), but there are a few cases where setBase() is
 * required (eg, in resetRegs() where the 80286 wants the real-mode CS selector to be 0xF000 but the
 * CS base must be 0xFF0000, and LOADALL).
 * 
 * @this {X86Seg}
 * @param {number} addr
 */
X86Seg.prototype.setBase = function(addr)
{
    this.base = addr;
};

/**
 * setProt(fProt)
 *
 * @this {X86Seg}
 * @param {boolean} [fProt]
 */
X86Seg.prototype.setProt = function(fProt)
{
    if (fProt === undefined) {
        fProt = !!(this.cpu.regMSW & X86.MSW.PE);
    }
    if (fProt) {
        this.load = X86Seg.loadProt;
        this.checkRead = X86Seg.checkReadProtEnabled;
        this.checkWrite = X86Seg.checkWriteProtEnabled;
    } else {
        this.load = X86Seg.loadReal;
        this.checkRead = X86Seg.checkReadReal;
        this.checkWrite = X86Seg.checkWriteReal;
    }
};

if (typeof module !== 'undefined') module.exports = X86Seg;
