/**
 * @fileoverview Implements PCjs X86 Segment objects
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
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
    var str         = require("../../shared/lib/strlib");
    var X86         = require("./x86");
    var X86Help     = require("./x86help");
}

/**
 * X86Seg(cpu, sName)
 *
 * @constructor
 * @param {X86CPU} cpu
 * @param {number} id
 * @param {string} [sName] segment name
 * @param {boolean} [fProt] true if segment register used exclusively in protected-mode
 */
function X86Seg(cpu, id, sName, fProt)
{
    this.cpu = cpu;
    this.id = id;
    this.sName = sName || "";
    this.sel = 0;
    this.base = 0;
    this.limit = 0xffff;
    this.acc = 0;
    this.addrDesc = null;
    this.cpl = 0;
    this.dpl = 0;
    this.awScratch = (this.id == X86Seg.ID.CODE? new Array(32) : []);
    this.updateAccess(fProt);
}

X86Seg.ID = {
    NULL:   0,          // "NULL"
    CODE:   1,          // "CS"
    DATA:   2,          // "DS", "ES"
    STACK:  3,          // "SS"
    TSS:    4,          // "TSS"
    LDT:    5,          // "LDT"
    OTHER:  6,          // "VER"
    DEBUG:  7           // "DBG"
};

/*
 * Class methods
 */

/**
 * loadReal(sel, fSuppress)
 *
 * The default segment load() function for real-mode.
 *
 * @this {X86Seg}
 * @param {number} sel
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number|null} base address of selected segment, or null if error
 */
X86Seg.loadReal = function loadReal(sel, fSuppress)
{
    this.sel = sel;
    this.limit = 0xffff;
    this.cpl = this.dpl = 0;
    return this.base = sel << 4;
};

/**
 * loadProt(sel, fSuppress)
 *
 * This replaces the segment's default load() function whenever the segment is notified via updateAccess() by the
 * CPU's setProtMode() that the processor is now in protected-mode.
 *
 * Segments in protected-mode are referenced by selectors, which are indexes into descriptor tables (GDT, LDT, IDT)
 * whose descriptors are 4-word (8-byte) entries:
 *
 *      word 0: segment limit (0-15)
 *      word 1: base address low
 *      word 2: base address high (0-7), segment type (8-11), descriptor type (12), DPL (13-14), present bit (15)
 *      word 3: used only on 80386 and up (should be set to zero for upward compatibility)
 *
 * See X86.DESC for offset and bit definitions.
 *
 * @this {X86Seg}
 * @param {number} sel
 * @param {boolean} [fSuppress] is true to suppress any errors, cycle assessment, etc
 * @return {number|null} base address of selected segment, or null if error
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
        addrDTLimit = addrDT + this.cpu.segLDT.limit;
    }
    var addrDesc = addrDT + (sel & X86.SEL.MASK);
    if (addrDesc + 7 <= addrDTLimit) {
        /*
         * TODO: This is only the first of many steps toward accurately counting cycles in protected mode;
         * I simply noted that "POP segreg" takes 5 cycles in real mode and 20 in protected mode, so I'm
         * starting with a 15-cycle difference.  Obviously the difference will be much greater when the load fails.
         */
        if (!fSuppress) this.cpu.nStepCycles -= 15;
        return this.loadDesc8(sel, addrDesc);
    }
    if (!fSuppress) {
        X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT, sel);
    }
    return null;
};

/**
 * checkReadReal(off, cb, fSuppress)
 *
 * TODO: Invoke X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT) if off is 0xffff and cb is 1;
 * also, whether or not the opHelpFault() call should include an error code, since this is happening in real-mode.
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number|null} corresponding physical address if valid, null if not
 */
X86Seg.checkReadReal = function checkReadReal(off, cb, fSuppress)
{
    return this.base + off;
};

/**
 * checkWriteReal(off, cb, fSuppress)
 *
 * TODO: Invoke X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT) if off is 0xffff and cb is 1;
 * also, whether or not the opHelpFault() call should include an error code, since this is happening in real-mode.
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number|null} corresponding physical address if valid, null if not
 */
X86Seg.checkWriteReal = function checkWriteReal(off, cb, fSuppress)
{
    return this.base + off;
};

/**
 * checkReadProt(off, cb, fSuppress)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number|null} corresponding physical address if valid, null if not
 */
X86Seg.checkReadProt = function checkReadProt(off, cb, fSuppress)
{
    if (off + cb <= this.limit) {
        return this.base + off;
    }
    return X86Seg.checkReadProtDisallowed.call(this, off, cb, fSuppress);
};

/**
 * checkReadProtDown(off, cb, fSuppress)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number|null} corresponding physical address if valid, null if not
 */
X86Seg.checkReadProtDown = function checkReadProtDown(off, cb, fSuppress)
{
    if (off + cb > this.limit) {
        return this.base + off;
    }
    return X86Seg.checkReadProtDisallowed.call(this, off, cb, fSuppress);
};

/**
 * checkReadProtDisallowed(off, cb, fSuppress)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number|null} corresponding physical address if valid, null if not
 */
X86Seg.checkReadProtDisallowed = function checkReadProtDisallowed(off, cb, fSuppress)
{
    if (!fSuppress) {
        X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT, 0);
    }
    return null;
};

/**
 * checkWriteProt(off, cb, fSuppress)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number|null} corresponding physical address if valid, null if not
 */
X86Seg.checkWriteProt = function checkWriteProt(off, cb, fSuppress)
{
    if (off + cb <= this.limit) {
        return this.base + off;
    }
    return X86Seg.checkWriteProtDisallowed.call(this, off, cb, fSuppress);
};

/**
 * checkWriteProtDown(off, cb, fSuppress)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number|null} corresponding physical address if valid, null if not
 */
X86Seg.checkWriteProtDown = function checkWriteProtDown(off, cb, fSuppress)
{
    if (off + cb > this.limit) {
        return this.base + off;
    }
    return X86Seg.checkWriteProtDisallowed.call(this, off, cb, fSuppress);
};

/**
 * checkWriteProtDisallowed(off, cb, fSuppress)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of extra bytes to check (0 or 1)
 * @param {boolean} [fSuppress] is true to suppress any errors
 * @return {number|null} corresponding physical address if valid, null if not
 */
X86Seg.checkWriteProtDisallowed = function checkWriteProtDisallowed(off, cb, fSuppress)
{
    if (!fSuppress) {
        X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT, 0);
    }
    return null;
};

/*
 * Object methods
 */

/**
 * loadDesc6(sel, addrDesc)
 *
 * Used to load a protected-mode selector that refers to a 6-byte "descriptor cache" (aka LOADALL) entry:
 *
 *      word 0: base address low
 *      word 1: base address high (0-7), segment type (8-11), descriptor type (12), DPL (13-14), present bit (15)
 *      word 2: segment limit (0-15)
 *
 * @this {X86Seg}
 * @param {number} sel is the selector
 * @param {number} addrDesc is the offset
 * @return {number} base address of selected segment
 */
X86Seg.prototype.loadDesc6 = function(sel, addrDesc)
{
    var acc = this.cpu.getWord(addrDesc + 2);
    var base = this.cpu.getWord(addrDesc + 0) | ((acc & 0xff) << 16);
    var limit = this.cpu.getWord(addrDesc + 4);

    this.sel = sel;
    this.base = base;
    this.limit = limit;
    this.acc = acc & X86.DESC.ACC.MASK;
    this.addrDesc = addrDesc;
    this.updateAccess();

    this.messageDebugger(sel, base, limit, acc);

    return base;
};

/**
 * loadDesc8(sel, addrDesc)
 *
 * Used to load a protected-mode selector that refers to an 8-byte "descriptor table" (GDT, LDT, IDT) entry:
 *
 *      word 0: segment limit (0-15)
 *      word 1: base address low
 *      word 2: base address high (0-7), segment type (8-11), descriptor type (12), DPL (13-14), present bit (15)
 *      word 3: used only on 80386 and up (should be set to zero for upward compatibility)
 *
 * See X86.DESC for offset and bit definitions.
 *
 * @this {X86Seg}
 * @param {number} sel is the selector
 * @param {number} addrDesc is the offset
 * @return {number|null} base address of selected segment, or null if error
 */
X86Seg.prototype.loadDesc8 = function(sel, addrDesc)
{
    var limit = this.cpu.getWord(addrDesc + X86.DESC.LIMIT.OFFSET);
    var acc = this.cpu.getWord(addrDesc + X86.DESC.ACC.OFFSET);
    var type = (acc & X86.DESC.ACC.TYPE.MASK);
    var base = this.cpu.getWord(addrDesc + X86.DESC.BASE.OFFSET) | ((acc & X86.DESC.ACC.BASE1623) << 16);
    var ext = (DEBUG? this.cpu.getWord(addrDesc + X86.DESC.EXT.OFFSET) : 0);
    var selMasked = sel & X86.SEL.MASK;

    while (true) {
        if (this.id == X86Seg.ID.CODE) {
            this.fStackSwitch = false;
            var fCall = this.fCall;
            var rpl = sel & X86.SEL.RPL;
            var dpl = (acc & X86.DESC.ACC.DPL.MASK) >> X86.DESC.ACC.DPL.SHIFT;
            var regSP;
            if (type == X86.DESC.ACC.TYPE.GATE_CALL) {
                /*
                 * Since we are X86Seg.ID.CODE, we can use this.cpl instead of the more generic this.cpu.segCS.cpl
                 */
                if (rpl < this.cpl) rpl = this.cpl;
                if (rpl <= dpl) {
                    var cplPrev = this.cpl;
                    if (this.load(base & 0xffff, true) != null) {
                        this.cpu.regIP = limit;
                        if (this.cpl < cplPrev) {
                            if (fCall !== true) {
                                base = null;
                                break;
                            }
                            regSP = this.cpu.regSP;
                            var i = 0, nWords = (acc & 0x1f);
                            while (nWords--) {
                                this.awScratch[i++] = this.cpu.getSOWord(this.cpu.segSS, regSP);
                                regSP += 2;
                            }
                            var addrTSS = this.cpu.segTSS.base;
                            var offSP = (this.cpl << 2) + X86.TSS.CPL0_SP;
                            var offSS = offSP + 2;
                            var regSPPrev = this.cpu.regSP;
                            var regSSPrev = this.cpu.segSS.sel;
                            this.cpu.regSP = this.cpu.getWord(addrTSS + offSP);
                            this.cpu.segSS.load(this.cpu.getWord(addrTSS + offSS));
                            this.cpu.pushWord(regSSPrev);
                            this.cpu.pushWord(regSPPrev);
                            while (i) this.cpu.pushWord(this.awScratch[--i]);
                            this.fStackSwitch = true;
                        }
                        return this.base;
                    }
                }
            }
            else if (type >= X86.DESC.ACC.TYPE.CODE_EXECONLY /* || dpl > this.cpu.segCS.cpl */) {
                rpl = sel & X86.SEL.RPL;
                if (rpl > this.cpl) {
                    if (fCall !== false) {
                        base = null;
                        break;
                    }
                    regSP = this.cpu.popWord();
                    this.cpu.segSS.load(this.cpu.popWord());
                    this.cpu.regSP = regSP;
                    this.fStackSwitch = true;
                }
            }
            else {
                X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT, sel, true);
                base = null;
                break;
            }
            if (DEBUG) this.cpu.assert(!!selMasked);    // a null CS selector should be caught by the final preceding check
        }
        else if (this.id == X86Seg.ID.DATA) {
            if (selMasked) {
                if (type < X86.DESC.ACC.TYPE.DATA_READONLY || (type & (X86.DESC.ACC.TYPE.CODE | X86.DESC.ACC.TYPE.READABLE)) == X86.DESC.ACC.TYPE.CODE) {
                    X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT, sel, true);
                    base = null;
                    break;
                }
            }
        }
        else if (this.id == X86Seg.ID.STACK) {
            if (!selMasked || type < X86.DESC.ACC.TYPE.DATA_READONLY || (type & (X86.DESC.ACC.TYPE.CODE | X86.DESC.ACC.TYPE.READABLE)) == X86.DESC.ACC.TYPE.CODE) {
                X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.GP_FAULT, sel, true);
                base = null;
                break;
            }
        }
        else if (this.id == X86Seg.ID.TSS) {
            if (!selMasked || type != X86.DESC.ACC.TYPE.TSS && type != X86.DESC.ACC.TYPE.TSS_BUSY) {
                X86Help.opHelpFault.call(this.cpu, X86.EXCEPTION.TS_FAULT, sel, true);
                base = null;
                break;
            }
        }
        else if (this.id == X86Seg.ID.OTHER) {
            /*
             * For LSL, we must support any descriptor marked X86.DESC.ACC.TYPE.SEG, as well as TSS and LDT descriptors.
             */
            if (!(acc & X86.DESC.ACC.TYPE.SEG) && type > X86.DESC.ACC.TYPE.TSS_BUSY) {
                base = null;
                break;
            }
        }
        this.sel = sel;
        this.base = base;
        this.limit = limit;
        this.acc = acc;
        this.type = type;
        this.addrDesc = addrDesc;
        this.updateAccess();
        break;
    }
    this.messageDebugger(sel, base, limit, acc, ext);
    return base;
};

/**
 * setBase(addr)
 *
 * This is used in unusual situations where the base must be set independently; normally, the base
 * is set according to the selector provided to load(), but there are a few cases where setBase() is
 * required (eg, in resetRegs() where the 80286 wants the real-mode CS selector to be 0xF000 but the
 * CS base must be 0xFF0000, and possibly LOADALL).
 *
 * @this {X86Seg}
 * @param {number} addr
 */
X86Seg.prototype.setBase = function(addr)
{
    this.base = addr;
};

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
    return [this.sel, this.base, this.limit, this.acc, this.id, this.sName, this.cpl, this.dpl, this.addrDesc];
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
        this.sel      = a[0];
        this.base     = a[1];
        this.limit    = a[2];
        this.acc      = a[3];
        this.id       = a[4];
        this.sName    = a[5];
        this.cpl      = a[6];
        this.dpl      = a[7];
        this.addrDesc = a[8];
    }
};

/**
 * updateAccess(fProt)
 *
 * Ensures that the segment register's access (ie, load and check methods) matches the specified (or current)
 * operating mode (real or protected).
 *
 * @this {X86Seg}
 * @param {boolean} [fProt] true for protected-mode access, false for real-mode access, undefined for current mode
 * @return {boolean}
 */
X86Seg.prototype.updateAccess = function(fProt)
{
    if (fProt === undefined) {
        fProt = !!(this.cpu.regMSW & X86.MSW.PE);
    }
    if (fProt) {
        this.load = X86Seg.loadProt;
        this.checkRead = X86Seg.checkReadProt;
        this.checkWrite = X86Seg.checkWriteProt;
        if (this.acc & X86.DESC.ACC.TYPE.SEG) {
            /*
             * If the READABLE bit of CODE_READABLE is not set, then disallow reads
             */
            if ((this.acc & X86.DESC.ACC.TYPE.CODE_READABLE) == X86.DESC.ACC.TYPE.CODE_EXECONLY) {
                this.checkWrite = X86Seg.checkReadProtDisallowed;
            }
            /*
             * If the CODE bit is set, or the the WRITABLE bit is not set, then disallow writes
             */
            if ((this.acc & X86.DESC.ACC.TYPE.CODE) || !(this.acc & X86.DESC.ACC.TYPE.WRITABLE)) {
                this.checkWrite = X86Seg.checkWriteProtDisallowed;
            }
            /*
             * If the CODE bit is not set *and* the EXPDOWN bit is set, then invert the limit check
             */
            if ((this.acc & (X86.DESC.ACC.TYPE.CODE | X86.DESC.ACC.TYPE.EXPDOWN)) == X86.DESC.ACC.TYPE.EXPDOWN) {
                if (this.checkRead == X86Seg.checkReadProt) this.checkRead = X86Seg.checkReadProtDown;
                if (this.checkWrite == X86Seg.checkWriteProt) this.checkWrite = X86Seg.checkWriteProtDown;
            }
        }
        this.cpl = this.sel & X86.SEL.RPL;
        this.dpl = (this.acc & X86.DESC.ACC.DPL.MASK) >> X86.DESC.ACC.DPL.SHIFT;
    } else {
        this.load = X86Seg.loadReal;
        this.checkRead = X86Seg.checkReadReal;
        this.checkWrite = X86Seg.checkWriteReal;
        this.cpl = this.dpl = 0;
        this.addrDesc = null;
    }
    this.fCall = null;          // true if CALLF in progress, false if RETF in progress, null/undefined otherwise (X86Seg.ID.CODE only)
    this.fStackSwitch = false;  // true if a stack switch occurred on the last loadDesc8(), false otherwise (X86Seg.ID.CODE only)
    return fProt;
};

/**
 * messageDebugger(sel base, limit, acc, ext)
 *
 * @param {number} sel
 * @param {number|null} base
 * @param {number} limit
 * @param {number} acc
 * @param {number} [ext]
 */
X86Seg.prototype.messageDebugger = function(sel, base, limit, acc, ext)
{
    if (DEBUG) {
        if (DEBUGGER) {
            var ch = (this.sName.length < 3? " " : "");
            var sDPL = " dpl=" + this.dpl;
            if (this.id == X86Seg.ID.CODE) sDPL += " cpl=" + this.cpl;
            this.cpu.messageDebugger("loadSeg(" + this.sName + "):" + ch + "sel=" + str.toHexWord(sel) + " base=" + str.toHex(base) + " limit=" + str.toHexWord(limit) + " acc=" + str.toHexWord(acc) + sDPL, Debugger.MESSAGE.SEG);
        }
        this.cpu.assert(base != null && (!ext || ext == X86.DESC.EXT.AVAIL));
    }
};

if (typeof module !== 'undefined') module.exports = X86Seg;
