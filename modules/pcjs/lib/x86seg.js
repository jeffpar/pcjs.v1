/**
 * @fileoverview Implements PCjs X86 Segment Registers
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2014-Sep-10
 *
 * Copyright © 2012-2015 Jeff Parsons <Jeff@pcjs.org>
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

if (NODE) {
    var str         = require("../../shared/lib/strlib");
    var Messages    = require("./messages");
    var Memory      = require("./memory");
    var X86         = require("./x86");
}

/*
 * NOTE: The protected-mode support in this module was initially added for 80286 support, and is
 * currently being upgraded for 80386 support.  In a perfect world, all 80386-related support would
 * be disabled/skipped whenever the processor is merely an 80286.  And in fact, that's the case
 * with some of the early changes (eg, skipping X86.DESC.EXT.BASE2431 and X86.DESC.EXT.LIMIT1619
 * fields unless the processor is an 80386).
 *
 * However, the reality is that I won't always be that strict, either because I'm lazy or I don't
 * want to risk a run-time performance hit or (more pragmatically) because any 80286 code you're likely
 * to run probably won't attempt to use descriptor types or other features unique to the 80386 anyway,
 * so the extra paranoia may not be worth the effort.  Ultimately, I would like to see the code tailor
 * itself to the current CPU model, generally with model-specific functions, but that's a lot of work.
 */

/**
 * X86Seg "public" properties
 *
 * @class X86Seg
 * @property {number} sel
 * @property {number} limit (in protected-mode, this comes from descriptor word 0x0)
 * @property {number} base (in protected-mode, this comes from descriptor word 0x2)
 * @property {number} acc (in protected-mode, this comes from descriptor word 0x4; bits 0-7 supplement base bits 16-23)
 * @property {number} ext (in protected-mode, this is descriptor word 0x6, 80386 only; supplements limit bits 16-19 and base bits 24-31)
 * @property {number} type (this is a subset of acc, using X86.DESC.ACC.TYPE.MASK)
 *
 * TODO: Determine what good, if any, these class annotations are for either an IDE like WebStorm or a tool like
 * the Closure Compiler.  More importantly, what good do they do at runtime?  Is it better to simply ensure that all
 * object properties are explicitly initialized in the constructor, and document them there instead?  I started by
 * listing only what might be considered "public" properties above, in an effort to eliminate WebStorm inspection
 * warnings, but it didn't seem to help, so I stopped.
 */

/**
 * X86Seg(cpu, sName)
 *
 * @constructor
 * @param {X86CPU} cpu
 * @param {number} id
 * @param {string} [sName] segment register name
 * @param {boolean} [fProt] true if segment register used exclusively in protected-mode (eg, segLDT)
 */
function X86Seg(cpu, id, sName, fProt)
{
    this.cpu = cpu;
    this.dbg = cpu.dbg;
    this.id = id;
    this.sName = sName || "";
    this.sel = 0;
    this.limit = 0xffff;
    this.offMax = this.limit + 1;
    this.base = 0;
    this.acc = this.type = 0;
    this.ext = 0;
    this.cpl = this.dpl = 0;
    this.addrDesc = X86.ADDR_INVALID;
    this.sizeData = this.sizeAddr = 2;
    this.maskData = this.maskAddr = 0xffff;

    this.loadV86 = this.loadReal;
    this.checkReadV86 = this.checkReadReal;
    this.checkWriteV86 = this.checkWriteReal;

    /*
     * Preallocated object for "probed" segment loads
     */
    this.probe = {
        sel: -1, base: 0, limit: 0, acc: 0, type: 0, ext: 0, addrDesc: X86.ADDR_INVALID
    };

    /*
     * The following properties are used for CODE segments only (ie, segCS); if the process of loading
     * CS also requires a stack switch, then fStackSwitch will be set to true; additionally, if the stack
     * switch was the result of a CALL (ie, fCall is true) and one or more (up to 32) parameters are on
     * the old stack, they will be copied to awParms, and then once the stack is switched, the parameters
     * will be pushed from awParms onto the new stack.
     *
     * The typical ways of loading a new segment into CS are JMPF, CALLF (or INT), and RETF (or IRET),
     * via CPU functions setCSIP() and fnINT(), which use segCS.loadCode() and segCS.loadIDT(), respectively.
     *
     * loadCode() requires an fCall value: null means NO privilege level transition may occur, true
     * allows a stack switch and a privilege transition to a numerically lower privilege, and false allows
     * a stack restore and a privilege transition to a numerically greater privilege.
     *
     * loadIDT() sets fCall to true unconditionally in protected-mode (fCall has no meaning in real-mode).
     */
    if (this.id == X86Seg.ID.CODE) {
        this.offIP = 0;
        this.fCall = null;
        this.fStackSwitch = false;
        this.awParms = new Array(32);
        this.aCallBreaks = [];
    }
    this.updateMode(true, fProt);
}

X86Seg.ID = {
    NULL:   0,          // "NULL"
    CODE:   1,          // "CS"
    DATA:   2,          // "DS", "ES", "FS", "GS"
    STACK:  3,          // "SS"
    TSS:    4,          // "TSS"
    LDT:    5,          // "LDT"
    VER:    6,          // "VER"
    DBG:    7           // "DBG"
};

X86Seg.CALLBREAK_SEL = 0x0001;

/**
 * addCallBreak(fn)
 *
 * Returns a "call break" address in an [off, sel] array.  The given function, fn(), is called
 * whenever that address is called, and if fn() returns false, then the call is skipped.  Otherwise,
 * the call is performed (ie, the old CS:[E]IP is pushed on the stack, and CS:[E]IP is set to the
 * "call break" address.  Which is probably a bad idea, so your function should probably always
 * return false.  Just sayin'.  TODO: Should probably just force all "call break" calls to be skipped.
 *
 * @this {X86Seg}
 * @param {function()} fn
 * @return {Array.<number>} containing offset and selector of call-break address
 */
X86Seg.prototype.addCallBreak = function(fn)
{
    this.aCallBreaks.push(fn);
    return [this.aCallBreaks.length, X86Seg.CALLBREAK_SEL];
};

/**
 * loadCode(off, sel, fCall)
 *
 * A simple wrapper function that encapsulates setting offIP and fCall for segCS loads.
 *
 * @this {X86Seg}
 * @param {number} off
 * @param {number} sel
 * @param {boolean|undefined} fCall is true if CALLF in progress, false if RETF/IRET in progress, undefined otherwise
 * @return {number} base address of selected segment, or X86.ADDR_INVALID if error
 */
X86Seg.prototype.loadCode = function loadCode(off, sel, fCall)
{
    this.offIP = off;
    this.fCall = fCall;
    return this.load(sel);
};

/**
 * loadReal(sel, fProbe)
 *
 * The default segment load() function for real-mode.
 *
 * @this {X86Seg}
 * @param {number} sel
 * @param {boolean} [fProbe] (here only to make the function signatures of loadReal() and loadProt() match)
 * @return {number} base address of selected segment
 */
X86Seg.prototype.loadReal = function loadReal(sel, fProbe)
{
    this.sel = sel & 0xffff;
    /*
     * Loading a new value into a segment register in real-mode alters ONLY the selector and the base;
     * all other attributes (eg, limit, operand size, address size, etc) are unchanged.  If you run any
     * code that switches to protected-mode, loads a 32-bit code segment, and then switches back to
     * real-mode, it is THAT code's responsibility to load a 16-bit segment into CS before returning to
     * real-mode; otherwise, your machine will probably be toast.
     */
    return this.base = this.sel << 4;
};

/**
 * loadProt(sel, fProbe)
 *
 * This replaces the segment's default load() function whenever the segment is notified via updateMode() by the
 * CPU's setProtMode() that the processor is now in protected-mode.
 *
 * Segments in protected-mode are referenced by selectors, which are indexes into descriptor tables (GDT or LDT)
 * whose descriptors are 4-word (8-byte) entries:
 *
 *      word 0: segment limit (0-15)
 *      word 1: base address low
 *      word 2: base address high (0-7), segment type (8-11), descriptor type (12), DPL (13-14), present bit (15)
 *      word 3: used only on 80386 and up (should be set to zero for upward compatibility)
 *
 * See X86.DESC for offset and bit definitions.
 *
 * IDT descriptor entries are handled separately by loadIDT(), which is mapped to loadIDTReal() or loadIDTProt().
 *
 * @this {X86Seg}
 * @param {number} sel
 * @param {boolean} [fProbe]
 * @return {number} base address of selected segment, or X86.ADDR_INVALID if error
 */
X86Seg.prototype.loadProt = function loadProt(sel, fProbe)
{
    var addrDT;
    var addrDTLimit;
    var cpu = this.cpu;

    /*
     * Some instructions (eg, CALLF) load a 32-bit value for the selector, while others (eg, LDS) do not;
     * however, in ALL cases, only the low 16 bits are significant.
     */
    sel &= 0xffff;

    if (!(sel & X86.SEL.LDT)) {
        addrDT = cpu.addrGDT;
        addrDTLimit = cpu.addrGDTLimit;
    } else {
        addrDT = cpu.segLDT.base;
        addrDTLimit = (addrDT + cpu.segLDT.limit)|0;
    }
    /*
     * The ROM BIOS POST executes some test code in protected-mode without properly initializing the LDT,
     * which has no bearing on the ROM's own code, because it never loads any LDT selectors, but if at the same
     * time our Debugger attempts to validate a selector in one of its breakpoints, that could cause some grief.
     *
     * Fortunately, the Debugger now has its own interface, probeDesc(), so that should no longer be a concern.
     */
    if (addrDT) {
        var addrDesc = (addrDT + (sel & X86.SEL.MASK))|0;
        if ((addrDTLimit - addrDesc)|0 >= 7) {
            /*
             * TODO: This is the first of many steps toward accurately counting cycles in protected mode;
             * I simply noted that "POP segreg" takes 5 cycles in real mode and 20 in protected mode, so I'm
             * starting with a 15-cycle difference.  Obviously the difference will vary with the instruction,
             * and will be much greater whenever the load fails.
             */
            cpu.nStepCycles -= 15;
            return this.loadDesc8(addrDesc, sel, fProbe);
        }
        if (this.id < X86Seg.ID.VER) {
            X86.fnFault.call(cpu, X86.EXCEPTION.GP_FAULT, sel & X86.ERRCODE.SELMASK);
        }
    }
    return X86.ADDR_INVALID;
};

/**
 * loadIDTReal(nIDT)
 *
 * @this {X86Seg}
 * @param {number} nIDT
 * @return {number} address from selected vector
 */
X86Seg.prototype.loadIDTReal = function loadIDTReal(nIDT)
{
    var cpu = this.cpu;
    /*
     * NOTE: The Compaq DeskPro 386 ROM loads the IDTR for the real-mode IDT with a limit of 0xffff instead
     * of the normal 0x3ff.  A limit higher than 0x3ff is OK, since all real-mode IDT entries are 4 bytes, and
     * there's no way to issue an interrupt with a vector > 0xff.  Just something to be aware of.
     */
    cpu.assert(nIDT >= 0 && nIDT < 256 && !cpu.addrIDT && cpu.addrIDTLimit >= 0x3ff);
    /*
     * Intel documentation for INT/INTO under "REAL ADDRESS MODE EXCEPTIONS" says:
     *
     *      "[T]he 80286 will shut down if the SP = 1, 3, or 5 before executing the INT or INTO instruction--due to lack of stack space"
     *
     * TODO: Verify that 80286 real-mode actually enforces the above.  See http://www.pcjs.org/pubs/pc/reference/intel/80286/progref/#page-260
     */
    var addrIDT = cpu.addrIDT + (nIDT << 2);
    var off = cpu.getShort(addrIDT);
    cpu.regPS &= ~(X86.PS.TF | X86.PS.IF);
    return (this.load(cpu.getShort(addrIDT + 2)) + off)|0;
};

/**
 * loadIDTProt(nIDT)
 *
 * @this {X86Seg}
 * @param {number} nIDT
 * @return {number} address from selected vector, or X86.ADDR_INVALID if error
 */
X86Seg.prototype.loadIDTProt = function loadIDTProt(nIDT)
{
    var cpu = this.cpu;
    cpu.assert(nIDT >= 0 && nIDT < 256);

    nIDT <<= 3;
    var addrDesc = (cpu.addrIDT + nIDT)|0;
    if (((cpu.addrIDTLimit - addrDesc)|0) >= 7) {
        this.fCall = true;
        var addr = this.loadDesc8(addrDesc, nIDT);
        if (addr !== X86.ADDR_INVALID) addr += this.offIP;
        return addr;
    }
    X86.fnFault.call(cpu, X86.EXCEPTION.GP_FAULT, nIDT | X86.ERRCODE.IDT);
    return X86.ADDR_INVALID;
};

/**
 * checkReadReal(off, cb)
 *
 * TODO: Invoke X86.fnFault.call(this.cpu, X86.EXCEPTION.GP_FAULT) if off+cb is beyond offMax on 80186 and up;
 * also, determine whether fnFault() call should include an error code, since this is happening in real-mode.
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of bytes to check (1, 2 or 4)
 * @return {number} corresponding linear address if valid, or X86.ADDR_INVALID if error (TODO: No error conditions yet)
 */
X86Seg.prototype.checkReadReal = function checkReadReal(off, cb)
{
    return (this.base + off)|0;
};

/**
 * checkWriteReal(off, cb)
 *
 * TODO: Invoke X86.fnFault.call(this.cpu, X86.EXCEPTION.GP_FAULT) if off+cb is beyond offMax on 80186 and up;
 * also, determine whether fnFault() call should include an error code, since this is happening in real-mode.
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of bytes to check (1, 2 or 4)
 * @return {number} corresponding linear address if valid, or X86.ADDR_INVALID if error (TODO: No error conditions yet)
 */
X86Seg.prototype.checkWriteReal = function checkWriteReal(off, cb)
{
    return (this.base + off)|0;
};

/**
 * checkReadProt(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of bytes to check (1, 2 or 4)
 * @return {number} corresponding linear address if valid, or X86.ADDR_INVALID if not
 */
X86Seg.prototype.checkReadProt = function checkReadProt(off, cb)
{
    /*
     * Since off could be a 32-bit value with the sign bit (bit 31) set, we must convert
     * it to an unsigned value using ">>>"; offMax was already converted at segment load time.
     */
    if ((off >>> 0) + cb <= this.offMax) {
        return (this.base + off)|0;
    }
    return this.checkReadProtDisallowed(off, cb);
};

/**
 * checkReadProtDown(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of bytes to check (1, 2 or 4)
 * @return {number} corresponding linear address if valid, X86.ADDR_INVALID if not
 */
X86Seg.prototype.checkReadProtDown = function checkReadProtDown(off, cb)
{
    /*
     * Since off could be a 32-bit value with the sign bit (bit 31) set, we must convert
     * it to an unsigned value using ">>>"; offMax was already converted at segment load time.
     */
    if ((off >>> 0) + cb > this.offMax) {
        return (this.base + off)|0;
    }
    return this.checkReadProtDisallowed(off, cb);
};

/**
 * checkReadProtDisallowed(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of bytes to check (1, 2 or 4)
 * @return {number} corresponding linear address if valid, X86.ADDR_INVALID if not
 */
X86Seg.prototype.checkReadProtDisallowed = function checkReadProtDisallowed(off, cb)
{
    X86.fnFault.call(this.cpu, X86.EXCEPTION.GP_FAULT, 0);
    return X86.ADDR_INVALID;
};

/**
 * checkWriteProt(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of bytes to check (1, 2 or 4)
 * @return {number} corresponding linear address if valid, X86.ADDR_INVALID if not
 */
X86Seg.prototype.checkWriteProt = function checkWriteProt(off, cb)
{
    /*
     * Since off could be a 32-bit value with the sign bit (bit 31) set, we must convert
     * it to an unsigned value using ">>>"; offMax was already converted at segment load time.
     */
    if ((off >>> 0) + cb <= this.offMax) {
        return (this.base + off)|0;
    }
    return this.checkWriteProtDisallowed(off, cb);
};

/**
 * checkWriteProtDown(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of bytes to check (1, 2 or 4)
 * @return {number} corresponding linear address if valid, X86.ADDR_INVALID if not
 */
X86Seg.prototype.checkWriteProtDown = function checkWriteProtDown(off, cb)
{
    /*
     * Since off could be a 32-bit value with the sign bit (bit 31) set, we must convert
     * it to an unsigned value using ">>>"; offMax was already converted at segment load time.
     */
    if ((off >>> 0) + cb > this.offMax) {
        return (this.base + off)|0;
    }
    return this.checkWriteProtDisallowed(off, cb);
};

/**
 * checkWriteProtDisallowed(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of bytes to check (1, 2 or 4)
 * @return {number} corresponding linear address if valid, X86.ADDR_INVALID if not
 */
X86Seg.prototype.checkWriteProtDisallowed = function checkWriteProtDisallowed(off, cb)
{
    X86.fnFault.call(this.cpu, X86.EXCEPTION.GP_FAULT, 0);
    return X86.ADDR_INVALID;
};

/**
 * checkReadDebugger(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of bytes to check (1, 2 or 4)
 * @return {number} corresponding linear address if valid, or X86.ADDR_INVALID if error
 */
X86Seg.prototype.checkReadDebugger = function checkReadDebugger(off, cb)
{
    /*
     * The Debugger doesn't have separate "check" interfaces for real and protected mode,
     * since it's not performance-critical.  If addrDesc is invalid, then we assume real mode.
     *
     * TODO: This doesn't actually check the segment for readability.
     */
    if (DEBUGGER) {
        if (this.addrDesc === X86.ADDR_INVALID ||
            this.fExpDown && (off >>> 0) + cb > this.offMax ||
            !this.fExpDown && (off >>> 0) + cb <= this.offMax) {
            return (this.base + off)|0;
        }
    }
    return X86.ADDR_INVALID;
};

/**
 * checkWriteDebugger(off, cb)
 *
 * @this {X86Seg}
 * @param {number} off is a segment-relative offset
 * @param {number} cb is number of bytes to check (1, 2 or 4)
 * @return {number} corresponding linear address if valid, or X86.ADDR_INVALID if error
 */
X86Seg.prototype.checkWriteDebugger = function checkWriteDebugger(off, cb)
{
    /*
     * The Debugger doesn't have separate "check" interfaces for real and protected mode,
     * since it's not performance-critical.  If addrDesc is invalid, then we assume real mode.
     *
     * TODO: This doesn't actually check the segment for writability.
     */
    if (DEBUGGER) {
        if (this.addrDesc === X86.ADDR_INVALID ||
            this.fExpDown && (off >>> 0) + cb > this.offMax ||
            !this.fExpDown && (off >>> 0) + cb <= this.offMax) {
            return (this.base + off)|0;
        }
    }
    return X86.ADDR_INVALID;
};

/**
 * loadAcc(sel, fGDT)
 *
 * @this {X86Seg}
 * @param {number} sel (protected-mode only)
 * @param {boolean} [fGDT] is true if sel must be in the GDT
 * @return {number} ACC field from descriptor, or X86.DESC.ACC.INVALID if error
 */
X86Seg.prototype.loadAcc = function(sel, fGDT)
{
    var addrDT;
    var addrDTLimit;
    var cpu = this.cpu;

    if (!(sel & X86.SEL.LDT)) {
        addrDT = cpu.addrGDT;
        addrDTLimit = cpu.addrGDTLimit;
    } else if (!fGDT) {
        addrDT = cpu.segLDT.base;
        addrDTLimit = (addrDT + cpu.segLDT.limit)|0;
    }
    if (addrDT !== undefined) {
        var addrDesc = (addrDT + (sel & X86.SEL.MASK))|0;
        if (((addrDTLimit - addrDesc)|0) >= 7) {
            return cpu.getShort(addrDesc + X86.DESC.ACC.OFFSET);
        }
    }
    X86.fnFault.call(cpu, X86.EXCEPTION.GP_FAULT, sel & X86.ERRCODE.SELMASK);
    return X86.DESC.ACC.INVALID;
};

/**
 * loadDesc6(addrDesc, sel)
 *
 * Used to load a protected-mode selector that refers to a 6-byte "descriptor cache" (aka LOADALL) entry:
 *
 *      word 0: base address low
 *      word 1: base address high (0-7), segment type (8-11), descriptor type (12), DPL (13-14), present bit (15)
 *      word 2: segment limit (0-15)
 *
 * @this {X86Seg}
 * @param {number} addrDesc is the descriptor address
 * @param {number} sel is the associated selector
 * @return {number} base address of selected segment
 */
X86Seg.prototype.loadDesc6 = function(addrDesc, sel)
{
    var cpu = this.cpu;
    var acc = cpu.getShort(addrDesc + 2);
    var base = cpu.getShort(addrDesc) | ((acc & 0xff) << 16);
    var limit = cpu.getShort(addrDesc + 4);

    this.sel = sel;
    this.base = base;
    this.limit = limit;
    this.offMax = (limit >>> 0) + 1;
    this.acc = acc;
    this.type = (acc & X86.DESC.ACC.TYPE.MASK);
    this.ext = 0;
    this.addrDesc = addrDesc;
    this.updateMode(true);

    if (DEBUG) this.messageSeg(sel, base, limit, this.type);

    return base;
};

/**
 * loadDesc8(addrDesc, sel, fProbe)
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
 * When fProbe is set, we do NOT modify the public properties of the X86Seg object (see class X86Seg above).
 * We will generate a fault if any of the usual error conditions are detected (and return X86.ADDR_INVALID), but
 * otherwise, we merely stash all the descriptor values it reads in the X86Seg's private "probe" object.
 *
 * Probed loads allow us to deal with complex segment load operations (ie, those involving an implied stack-switch
 * or task-switch), by allowing us to probe all the new selectors and generate the necessary faults before modifying
 * any segment registers; if all the probes succeed, then all the loads can proceed.
 *
 * The next non-probed load of a probed selector will move those probed descriptor values into the X86Seg object,
 * saving us from having to reload and reparse the descriptor.  However, if a different selector is loaded between
 * the probed and non-probed loads, the probed data is tossed.
 *
 * @this {X86Seg}
 * @param {number} addrDesc is the descriptor address
 * @param {number} sel is the associated selector, or nIDT*8 if IDT descriptor
 * @param {boolean} [fProbe] (true if this is a probe)
 * @return {number} base address of selected segment, or X86.ADDR_INVALID if error
 */
X86Seg.prototype.loadDesc8 = function(addrDesc, sel, fProbe)
{
    var cpu = this.cpu;

    /*
     * If the previous load was a successful "probed" load of the same segment, then we simply load
     * up all the cached descriptor values from the probe and return.
     */
    if (!fProbe && sel === this.probe.sel) {
        this.sel = sel;
        this.base = this.probe.base;
        this.limit = this.probe.limit;
        this.offMax = (this.probe.limit >>> 0) + 1;
        this.acc = this.probe.acc;
        this.type = this.probe.type;
        this.ext = this.probe.ext;
        this.addrDesc = this.probe.addrDesc;
        this.probe.sel = -1;
        this.updateMode(true, true, false);
        return this.base;
    }

    /*
     * Any other load, probed or otherwise, should "flush" the probe cache, by setting probe.sel to -1.
     */
    this.probe.sel = -1;

    /*
     * Load the descriptor from memory.
     */
    var limit = cpu.getShort(addrDesc + X86.DESC.LIMIT.OFFSET);
    var acc = cpu.getShort(addrDesc + X86.DESC.ACC.OFFSET);
    var type = (acc & X86.DESC.ACC.TYPE.MASK);
    var base = cpu.getShort(addrDesc + X86.DESC.BASE.OFFSET) | ((acc & X86.DESC.ACC.BASE1623) << 16);
    var ext = cpu.getShort(addrDesc + X86.DESC.EXT.OFFSET);
    var selMasked = sel & X86.SEL.MASK;

    if (I386 && cpu.model >= X86.MODEL_80386) {
        var limitOrig = limit;
        base |= (ext & X86.DESC.EXT.BASE2431) << 16;
        limit |= (ext & X86.DESC.EXT.LIMIT1619) << 16;
        if (ext & X86.DESC.EXT.LIMITPAGES) limit = (limit << 12) | 0xfff;
    }

    switch (this.id) {

    case X86Seg.ID.CODE:

        var fCall = this.fCall;
        this.fStackSwitch = false;

        /*
         * This special bit of code is currently used only by the Debugger, when it needs to inject
         * a 16:32 callback address into the machine that it can intercept calls to.  We call these
         * "call break" addresses, because they're like private breakpoints that only operate when
         * a particular address is called; specifically, an address with selector 0x0001 and an offset
         * that forms an index (1-based) into the aCallBreaks function table.
         *
         * In protected-mode, 0x0001 is an invalid code selector (a null selector with an RPL of 1),
         * and while it's not inconceivable that an operating system might use such a selector for
         * some strange purpose, I've not seen such an operating system.  And in any case, those
         * operating systems are not likely to trigger the Debugger's call to addCallBreak(), so no
         * call breaks will be generated, and this code will never execute.
         *
         * TODO: If we ever need this to be mode-independent, it can be moved somewhere where it will
         * trigger for both real and protected-mode code segment loads, because CALLBREAK_SEL (0x0001)
         * is also a very unlikely real-mode CS value (but again, not inconceivable).  I think this is
         * a reasonable solution, and it's likely the best we can do without injecting code into the
         * machine that we could address -- and even then, it would not be a mode-independent address.
         */
        if (fCall && sel == X86Seg.CALLBREAK_SEL && this.aCallBreaks.length) {
            var iBreak = this.offIP - 1;
            var fnCallBreak = this.aCallBreaks[iBreak];
            cpu.assert(fnCallBreak);
            if (fnCallBreak && !fnCallBreak()) {
                return X86.ADDR_INVALID;
            }
        }

        var rpl = sel & X86.SEL.RPL;
        var dpl = (acc & X86.DESC.ACC.DPL.MASK) >> X86.DESC.ACC.DPL.SHIFT;

        var sizeGate, selCode, cplOld, fIDT;
        var addrTSS, offSP, lenSP, regSPPrev, regSSPrev, regPSClear, regSP;

        /*
         * TODO: As discussed below for X86Seg.ID.DATA, it's likely that testing the PRESENT bit should
         * be performed *after* checking the other, more serious potential problems.
         */
        if (selMasked && !(acc & X86.DESC.ACC.PRESENT)) {
            if (this.id < X86Seg.ID.VER) X86.fnFault.call(cpu, X86.EXCEPTION.NP_FAULT, sel & X86.ERRCODE.SELMASK);
            return X86.ADDR_INVALID;
        }

        /*
         * Since we are X86Seg.ID.CODE, we can use this.cpl instead of the more generic cpu.segCS.cpl
         */
        if (type >= X86.DESC.ACC.TYPE.CODE_EXECONLY) {
            rpl = sel & X86.SEL.RPL;
            if (rpl > this.cpl) {
                /*
                 * If fCall is false, then we must have a RETF to a less privileged segment, which is OK.
                 *
                 * Otherwise, we must be dealing with a CALLF or JMPF to a less privileged segment, in which
                 * case either DPL == CPL *or* the new segment is conforming and DPL <= CPL.
                 */
                if (fCall !== false && !(dpl == this.cpl || (type & X86.DESC.ACC.TYPE.CONFORMING) && dpl <= this.cpl)) {
                    return X86.ADDR_INVALID;
                }
                /*
                 * It's critical that any stack switch occur with the operand size in effect at the time of
                 * the current instruction, BEFORE any calls to updateMode() and resetSizes(), otherwise the
                 * operand size (or operand override) in effect on an instruction like IRETD will be ignored.
                 */
                regSP = cpu.popWord();
                cpu.setSS(cpu.popWord(), true);
                cpu.setSP(regSP);
                this.fStackSwitch = true;
            }
            sizeGate = 0;
        }
        else if (type == X86.DESC.ACC.TYPE.TSS286 || type == X86.DESC.ACC.TYPE.TSS386) {
            if (!this.switchTSS(sel, fCall)) {
                return X86.ADDR_INVALID;
            }
            return this.base;
        }
        else if (type == X86.DESC.ACC.TYPE.GATE_CALL) {
            sizeGate = 2;
            regPSClear = 0;
            if (rpl < this.cpl) rpl = this.cpl;     // set RPL to max(RPL,CPL) for call gates
        }
        else if (type == X86.DESC.ACC.TYPE.GATE386_CALL) {
            sizeGate = 4;
            regPSClear = 0;
            if (rpl < this.cpl) rpl = this.cpl;     // set RPL to max(RPL,CPL) for call gates
        }
        else if (type == X86.DESC.ACC.TYPE.GATE286_INT) {
            sizeGate = 2;
            regPSClear = (X86.PS.VM | X86.PS.NT | X86.PS.TF | X86.PS.IF);
            cpu.assert(!(acc & 0x1f));
        }
        else if (type == X86.DESC.ACC.TYPE.GATE386_INT) {
            sizeGate = 4;
            regPSClear = (X86.PS.VM | X86.PS.NT | X86.PS.TF | X86.PS.IF);
            cpu.assert(!(acc & 0x1f));
        }
        else if (type == X86.DESC.ACC.TYPE.GATE286_TRAP) {
            sizeGate = 2;
            regPSClear = (X86.PS.VM | X86.PS.NT | X86.PS.TF);
            cpu.assert(!(acc & 0x1f));
        }
        else if (type == X86.DESC.ACC.TYPE.GATE386_TRAP) {
            sizeGate = 4;
            regPSClear = (X86.PS.VM | X86.PS.NT | X86.PS.TF);
            cpu.assert(!(acc & 0x1f));
        }
        else if (type == X86.DESC.ACC.TYPE.GATE_TASK) {
            if (!this.switchTSS(base & 0xffff, fCall)) {
                return X86.ADDR_INVALID;
            }
            return this.base;
        }

        if (sizeGate) {
            /*
             * Note that since GATE_INT/GATE_TRAP descriptors should appear in the IDT only, that means sel
             * will actually be nIDT * 8, which means the rpl will always be zero; additionally, the nWords
             * portion of ACC should always be zero, but that's really dependent on the descriptor being properly
             * set (which we assert above).
             */
            cplOld = this.cpl;
            fIDT = (addrDesc == cpu.addrIDT + sel);

            /*
             * Software interrupts (where fIDT is true and cpu.nFault < 0) require an additional test: if DPL < CPL,
             * then we must fall into the GP_FAULT code at the end of this case.
             */
            if (rpl <= dpl && (!fIDT || cpu.nFault >= 0 || cplOld <= dpl))  {

                /*
                 * For gates, there is no "base" and "limit", but rather "selector" and "offset"; the selector
                 * is located where the first 16 bits of base are normally stored, and the offset comes from the
                 * original limit and ext fields.
                 *
                 * TODO: Verify the PRESENT bit of the gate descriptor, and issue NP_FAULT as appropriate.
                 */
                selCode = base & 0xffff;
                if (I386 && (type & X86.DESC.ACC.NONSEG_386)) {
                    limit = limitOrig | (ext << 16);
                }

                var cplNew = (selCode & X86.SEL.RPL), selStack = 0, offStack = 0;

                /*
                 * If a stack switch is required, we must perform "probed" loads of both the new selCode
                 * and selStack segments, so that if either probe fails, a fault will be generated while the
                 * old code segment is still loaded.
                 */
                if (cplNew < cplOld) {
                    if (this.loadProt(selCode, true) === X86.ADDR_INVALID) {
                        return X86.ADDR_INVALID;
                    }
                    addrTSS = cpu.segTSS.base;
                    if (!I386 || !(type & X86.DESC.ACC.NONSEG_386)) {
                        offSP = (cplNew << 2) + X86.TSS286.CPL0_SP;
                        lenSP = 2;
                    } else {
                        offSP = (cplNew << 2) + X86.TSS386.CPL0_ESP;
                        lenSP = 4;
                    }
                    selStack = cpu.getShort(addrTSS + offSP + lenSP);
                    if (cpu.segSS.loadProt(selStack, true) === X86.ADDR_INVALID) {
                        return X86.ADDR_INVALID;
                    }
                    /*
                     * Both probes succeeded, so we can proceed with "normal" loads for both selCode and
                     * selStack (which should automatically use the values cached by the "probed" loads above).
                     */
                    offStack = (lenSP == 2)? cpu.getShort(addrTSS + offSP) : cpu.getLong(addrTSS + offSP);
                }

                /*
                 * Now that we're past all the probes, it should be safe to clear all flags that need clearing.
                 */
                var regPS = cpu.regPS;
                cpu.regPS &= ~regPSClear;
                if (regPS & X86.PS.VM) {
                    cpu.setProtMode(true, false);
                }

                if (this.loadProt(selCode) === X86.ADDR_INVALID) {
                    return X86.ADDR_INVALID;
                }

                cpu.setDataSize(sizeGate);

                this.offIP = limit;
                cpu.assert(this.cpl == cplNew);

                if (this.cpl < cplOld) {
                    if (fCall !== true) {
                        cpu.assert(false);
                        return X86.ADDR_INVALID;
                    }

                    regSP = cpu.getSP();
                    var i = 0, nWords = (acc & 0x1f);
                    while (nWords--) {
                        this.awParms[i++] = cpu.getSOWord(cpu.segSS, regSP);
                        regSP += 2;
                    }

                    regSSPrev = cpu.getSS();
                    regSPPrev = cpu.getSP();

                    cpu.setSS(selStack, true);
                    cpu.setSP(offStack);

                    if (regPS & X86.PS.VM) {
                        /*
                         * Frames coming from V86-mode ALWAYS contain 32-bit values, and look like this:
                         *
                         *      low:    EIP
                         *              CS (padded to 32 bits)
                         *              EFLAGS
                         *              ESP
                         *              SS (padded to 32 bits)
                         *              ES (padded to 32 bits)
                         *              DS (padded to 32 bits)
                         *              FS (padded to 32 bits)
                         *      high:   GS (padded to 32 bits)
                         *
                         * Our caller (eg, fnINT()) will take care of pushing the final bits (EFLAGS, CS, and EIP).
                         */
                        cpu.setDataSize(4);
                        cpu.assert(I386 && cpu.model >= X86.MODEL_80386);
                        cpu.pushWord(cpu.segGS.sel);
                        cpu.setGS(0);
                        cpu.pushWord(cpu.segFS.sel);
                        cpu.setFS(0);
                        cpu.pushWord(cpu.segDS.sel);
                        cpu.setDS(0);
                        cpu.pushWord(cpu.segES.sel);
                        cpu.setES(0);
                    }
                    cpu.pushWord(regSSPrev);
                    cpu.pushWord(regSPPrev);
                    while (i) cpu.pushWord(this.awParms[--i]);
                    this.fStackSwitch = true;
                }
                return this.base;
            }
        }

        if (sizeGate !== 0) {
            var nError = (sel & X86.ERRCODE.SELMASK) | (fIDT? X86.ERRCODE.IDT : 0);
            if (this.id < X86Seg.ID.VER) X86.fnFault.call(cpu, X86.EXCEPTION.GP_FAULT, nError);
            return X86.ADDR_INVALID;
        }
        break;

    case X86Seg.ID.DATA:
        if (selMasked) {
            /*
             * OS/2 1.0 faults on segments with "empty descriptors" multiple times during boot; for example:
             *
             *      Fault 0x0B (0x002C) on opcode 0x8E at 3190:3A05 (%112625)
             *      AX=0000 BX=0970 CX=0300 DX=0300 SP=0ABE BP=0ABA SI=0000 DI=001A
             *      SS=0038[175CE0,0B5F] DS=19C0[177300,2C5F] ES=001F[1743A0,07FF] A20=ON
             *      CS=3190[10EC20,B89F] LD=0028[174BC0,003F] GD=[11A4E0,490F] ID=[11F61A,03FF]
             *      TR=0010 MS=0000FFF3 PS=3256 V0 D0 I1 T0 S0 Z1 A1 P1 C0
             *      3190:3A05 8E4604          MOV      ES,[BP+04]
             *      ## dw ss:bp+4 l1
             *      0038:0ABE  002F  19C0  0000  067C  07FC  0AD2  0010  C420   /.....|....... .
             *      ## ds 2f
             *      dumpDesc(0x002F): %174BE8
             *      base=000000 limit=0000 type=0x00 (undefined) ext=0x0000 dpl=0x00
             *
             * And Windows 95 Setup, during the "Analyzing Your Computer" phase, will fault on an attempt to load
             * a GDT selector of type LDT (why it does this is a mystery I've not yet investigated):
             *
             *      Fault 0x0D (0x26F0) on opcode 0x8E @039F:039B (%199E9B)
             *      EAX=0000149F EBX=00000100 ECX=000026F3 EDX=0020149F
             *      ESP=0000AA34 EBP=0000AA3C ESI=000026E7 EDI=00000080
             *      SS=155F[002AC9D0,C0BF] DS=149F[0031B470,9B1F] ES=0237[000C0000,FFFF]
             *      CS=039F[00199B00,2ABF] FS=0000[00000000,0000] GS=0000[00000000,0000]
             *      LD=0038[00FA4C50,FFEF] GD=[00FA0800,011F] ID=[00FA0000,07FF] TR=0088 A20=ON
             *      CR0=0000FFF1 CR2=00000000 CR3=00000000 PS=00003246 V0 D0 I1 T0 S0 Z1 A0 P1 C0
             *      039F:039B 8EC1            MOV      ES,CX
             *      ## ds cx
             *      dumpDesc(0x26F3): %00FA2EF0
             *      base=0006C726 limit=0000 type=0x02 (ldt,not present) ext=0x0000 dpl=0x00
             *
             * In both cases, the segment type is not valid for the target segment register *and* the PRESENT bit
             * is clear.  OS/2 doesn't seem to care whether I report an NP_FAULT or GP_FAULT, but Windows 95 definitely
             * cares: it will resolve the fault only if a GP_FAULT is reported.  And Intel's 80386 Programmers Reference
             * implies that, yes, NP_FAULT checks are supposed to be performed *after* GP_FAULT checks.
             */
            if (type < X86.DESC.ACC.TYPE.SEG || (type & (X86.DESC.ACC.TYPE.CODE | X86.DESC.ACC.TYPE.READABLE)) == X86.DESC.ACC.TYPE.CODE) {
                if (this.id < X86Seg.ID.VER) X86.fnFault.call(cpu, X86.EXCEPTION.GP_FAULT, sel & X86.ERRCODE.SELMASK);
                return X86.ADDR_INVALID;
            }
            /*
             * TODO: This would be a good place to perform some additional access rights checks, too.
             */
            if (!(acc & X86.DESC.ACC.PRESENT)) {
                if (this.id < X86Seg.ID.VER) X86.fnFault.call(cpu, X86.EXCEPTION.NP_FAULT, sel & X86.ERRCODE.SELMASK);
                return X86.ADDR_INVALID;
            }
        }
        break;

    case X86Seg.ID.STACK:
        if (!(acc & X86.DESC.ACC.PRESENT)) {
            if (this.id < X86Seg.ID.VER) X86.fnFault.call(cpu, X86.EXCEPTION.SS_FAULT, sel & X86.ERRCODE.SELMASK);
            return X86.ADDR_INVALID;
        }
        if (!selMasked || type < X86.DESC.ACC.TYPE.SEG || (type & (X86.DESC.ACC.TYPE.CODE | X86.DESC.ACC.TYPE.WRITABLE)) != X86.DESC.ACC.TYPE.WRITABLE) {
            if (this.id < X86Seg.ID.VER) X86.fnFault.call(cpu, X86.EXCEPTION.GP_FAULT, sel & X86.ERRCODE.SELMASK);
            return X86.ADDR_INVALID;
        }
        break;

    case X86Seg.ID.TSS:
        var typeTSS = type & ~X86.DESC.ACC.TSS_BUSY;
        if (!selMasked || typeTSS != X86.DESC.ACC.TYPE.TSS286 && typeTSS != X86.DESC.ACC.TYPE.TSS386) {
            if (this.id < X86Seg.ID.VER) X86.fnFault.call(cpu, X86.EXCEPTION.GP_FAULT, sel & X86.ERRCODE.SELMASK);
            return X86.ADDR_INVALID;
        }
        /*
         * For more efficient IOPM lookups, we cache the starting linear address in segTSS.addrIOPM, and the
         * last valid address in segTSS.addrIOPMLimit.
         */
        if (typeTSS == X86.DESC.ACC.TYPE.TSS386) {
            this.addrIOPM = (base + cpu.getShort(base + X86.TSS386.TASK_IOPM + 2))|0;
            this.addrIOPMLimit = (base + this.limit)|0;
        }
        break;

    case X86Seg.ID.VER:
        /*
         * For LSL, we must support any descriptor marked X86.DESC.ACC.TYPE.SEG, as well as TSS and LDT descriptors.
         */
        if (!(type & X86.DESC.ACC.TYPE.SEG) && type > X86.DESC.ACC.TYPE.TSS286_BUSY && type != X86.DESC.ACC.TYPE.TSS386 && type != X86.DESC.ACC.TYPE.TSS386_BUSY) {
            return X86.ADDR_INVALID;
        }
        break;

    default:
        /*
         * The only other cases are:
          *
          *     X86Seg.ID.NULL, X86Seg.ID.LDT, and X86Seg.ID.DBG
          *
          * which correspond to segNULL, segLDT and segDebugger; however, segLDT is the only one that might require further validation (TODO: Investigate).
         */
        break;
    }

    if (fProbe) {
        this.probe.sel = sel;
        this.probe.base = base;
        this.probe.limit = limit;
        this.probe.acc = acc;
        this.probe.type = type;
        this.probe.ext = ext;
        this.probe.addrDesc = addrDesc;
    } else {
        this.sel = sel;
        this.base = base;
        this.limit = limit;
        this.offMax = (limit >>> 0) + 1;
        this.acc = acc;
        this.type = type;
        this.ext = ext;
        this.addrDesc = addrDesc;
        /*
         * A quick recap of what updateMode(fLoad=true, fProt=true, fV86=false) actually updates:
         *
         *      cpl
         *      dpl
         *      dataSize
         *      dataMask
         *      addrSize
         *      addrMask
         *      fExpDown
         *      load()
         *      loadIDT()
         *      checkRead()
         *      checkWrite()
         */
        this.updateMode(true, true, false);
    }

    if (DEBUG) this.messageSeg(sel, base, limit, type, ext);

    return base;
};

/**
 * probeDesc(sel)
 *
 * This is a neutered version of loadProt() designed for the Debugger.
 *
 * @this {X86Seg}
 * @param {number} sel
 * @return {number} base address of selected segment, or X86.ADDR_INVALID if error
 */
X86Seg.prototype.probeDesc = function(sel)
{
    var addrDT;
    var addrDTLimit;
    var cpu = this.cpu;

    sel &= 0xffff;

    if (!(sel & X86.SEL.LDT)) {
        addrDT = cpu.addrGDT;
        addrDTLimit = cpu.addrGDTLimit;
    } else {
        addrDT = cpu.segLDT.base;
        addrDTLimit = (addrDT + cpu.segLDT.limit)|0;
    }

    var addrDesc = (addrDT + (sel & X86.SEL.MASK))|0;

    if ((addrDTLimit - addrDesc)|0 >= 7) {

        /*
         * Load the descriptor from memory using probeAddr().
         */
        var limit = cpu.probeAddr(addrDesc + X86.DESC.LIMIT.OFFSET, 2);
        var acc = cpu.probeAddr(addrDesc + X86.DESC.ACC.OFFSET, 2);
        var type = (acc & X86.DESC.ACC.TYPE.MASK);
        var base = cpu.probeAddr(addrDesc + X86.DESC.BASE.OFFSET, 2) | ((acc & X86.DESC.ACC.BASE1623) << 16);
        var ext = cpu.probeAddr(addrDesc + X86.DESC.EXT.OFFSET, 2);

        if (I386 && cpu.model >= X86.MODEL_80386) {
            base |= (ext & X86.DESC.EXT.BASE2431) << 16;
            limit |= (ext & X86.DESC.EXT.LIMIT1619) << 16;
            if (ext & X86.DESC.EXT.LIMITPAGES) limit = (limit << 12) | 0xfff;
        }

        this.sel = sel;
        this.base = base;
        this.limit = limit;
        this.offMax = (limit >>> 0) + 1;
        this.acc = acc;
        this.type = type;
        this.ext = ext;
        this.addrDesc = addrDesc;
        this.updateMode(true, true, false);
        return base;
    }
    return X86.ADDR_INVALID;
};

/**
 * switchTSS(selNew, fNest)
 *
 * Implements TSS (Task State Segment) task switching.
 *
 * NOTES: This typically occurs during double-fault processing, because the IDT entry for DF_FAULT normally
 * contains a task gate.  Interestingly, if we force a GP_FAULT to occur at a sufficiently early point in the
 * OS/2 1.0 initialization code, OS/2 does a nice job of displaying the GP fault and then shutting down:
 *
 *      0090:067B FB            STI
 *      0090:067C EBFD          JMP      067B
 *
 * but it may not have yet reprogrammed the master PIC to re-vector hardware interrupts to IDT entries 0x50-0x57,
 * so when the next timer interrupt (IRQ 0) occurs, it vectors through IDT entry 0x08, which is the DF_FAULT
 * vector. A spurious double-fault is generated, and a clean shutdown turns into a messy crash.
 *
 * Of course, that all could have been avoided if IBM had heeded Intel's advice and not used Intel-reserved IDT
 * entries for PC interrupts.
 *
 * TODO: Add TSS validity checks and appropriate generation of TS_FAULT exceptions; the only rudimentary checks
 * we currently perform are of the GP_FAULT variety.
 *
 * @this {X86Seg}
 * @param {number} selNew
 * @param {boolean|null} [fNest] is true if nesting, false if un-nesting, null if neither
 * @return {boolean} true if successful, false if error
 */
X86Seg.prototype.switchTSS = function switchTSS(selNew, fNest)
{
    var cpu = this.cpu;
    cpu.assert(this === cpu.segCS);

    var cplOld = this.cpl;
    var selOld = cpu.segTSS.sel;
    var addrOld = cpu.segTSS.base;

    if (!fNest) {
        /*
         * TODO: Verify that it is (always) correct to require that the BUSY bit be currently set.
         */
        if (!(cpu.segTSS.type & X86.DESC.ACC.TSS_BUSY)) {
            X86.fnFault.call(cpu, X86.EXCEPTION.GP_FAULT, selNew & X86.ERRCODE.SELMASK);
            return false;
        }
        /*
         * TODO: Should I be more paranoid about writing our cached ACC value back into the descriptor?
         */
        cpu.setShort(cpu.segTSS.addrDesc + X86.DESC.ACC.OFFSET, cpu.segTSS.acc &= ~X86.DESC.ACC.TSS_BUSY);
    }

    if (cpu.segTSS.load(selNew) === X86.ADDR_INVALID) {
        return false;
    }

    var addrNew = cpu.segTSS.base;
    if (DEBUG && DEBUGGER && this.dbg && this.dbg.messageEnabled(Messages.TSS)) {
        this.dbg.message((fNest? "Task switch" : "Task return") + ": TR " + str.toHexWord(selOld) + " (%" + str.toHex(addrOld, 6) + "), new TR " + str.toHexWord(selNew) + " (%" + str.toHex(addrNew, 6) + ")");
    }

    if (fNest !== false) {
        if (cpu.segTSS.type & X86.DESC.ACC.TSS_BUSY) {
            X86.fnFault.call(cpu, X86.EXCEPTION.GP_FAULT, selNew & X86.ERRCODE.SELMASK);
            return false;
        }
        cpu.setShort(cpu.segTSS.addrDesc + X86.DESC.ACC.OFFSET, cpu.segTSS.acc |= X86.DESC.ACC.TSS_BUSY);
    }

    /*
     * Now that we're done checking the TSS_BUSY bit in the TYPE field (which is a subset of the ACC field),
     * sync any changes made above in the ACC field to the TYPE field.
     */
    cpu.segTSS.type = (cpu.segTSS.type & ~X86.DESC.ACC.TSS_BUSY) | (cpu.segTSS.acc & X86.DESC.ACC.TSS_BUSY);

    /*
     * Update the old TSS
     */
    var offSS, offSP;
    if (cpu.segTSS.type == X86.DESC.ACC.TYPE.TSS286 || cpu.segTSS.type == X86.DESC.ACC.TYPE.TSS286_BUSY) {
        cpu.setShort(addrOld + X86.TSS286.TASK_IP, cpu.getIP());
        cpu.setShort(addrOld + X86.TSS286.TASK_PS, cpu.getPS());
        cpu.setShort(addrOld + X86.TSS286.TASK_AX, cpu.regEAX);
        cpu.setShort(addrOld + X86.TSS286.TASK_CX, cpu.regECX);
        cpu.setShort(addrOld + X86.TSS286.TASK_DX, cpu.regEDX);
        cpu.setShort(addrOld + X86.TSS286.TASK_BX, cpu.regEBX);
        cpu.setShort(addrOld + X86.TSS286.TASK_SP, cpu.getSP());
        cpu.setShort(addrOld + X86.TSS286.TASK_BP, cpu.regEBP);
        cpu.setShort(addrOld + X86.TSS286.TASK_SI, cpu.regESI);
        cpu.setShort(addrOld + X86.TSS286.TASK_DI, cpu.regEDI);
        cpu.setShort(addrOld + X86.TSS286.TASK_ES, cpu.segES.sel);
        cpu.setShort(addrOld + X86.TSS286.TASK_CS, cpu.segCS.sel);
        cpu.setShort(addrOld + X86.TSS286.TASK_SS, cpu.segSS.sel);
        cpu.setShort(addrOld + X86.TSS286.TASK_DS, cpu.segDS.sel);
        /*
         * Reload all registers from the new TSS; it's important to reload the LDTR sooner
         * rather than later, so that as segment registers are reloaded, any LDT selectors will
         * will be located in the correct table.
         */
        cpu.segLDT.load(cpu.getShort(addrNew + X86.TSS286.TASK_LDT));
        cpu.setPS(cpu.getShort(addrNew + X86.TSS286.TASK_PS) | (fNest? X86.PS.NT : 0));
        cpu.assert(!fNest || !!(cpu.regPS & X86.PS.NT));
        cpu.regEAX = cpu.getShort(addrNew + X86.TSS286.TASK_AX);
        cpu.regECX = cpu.getShort(addrNew + X86.TSS286.TASK_CX);
        cpu.regEDX = cpu.getShort(addrNew + X86.TSS286.TASK_DX);
        cpu.regEBX = cpu.getShort(addrNew + X86.TSS286.TASK_BX);
        cpu.regEBP = cpu.getShort(addrNew + X86.TSS286.TASK_BP);
        cpu.regESI = cpu.getShort(addrNew + X86.TSS286.TASK_SI);
        cpu.regEDI = cpu.getShort(addrNew + X86.TSS286.TASK_DI);
        cpu.segES.load(cpu.getShort(addrNew + X86.TSS286.TASK_ES));
        cpu.segDS.load(cpu.getShort(addrNew + X86.TSS286.TASK_DS));
        cpu.setCSIP(cpu.getShort(addrNew + X86.TSS286.TASK_IP), cpu.getShort(addrNew + X86.TSS286.TASK_CS));
        offSS = X86.TSS286.TASK_SS;
        offSP = X86.TSS286.TASK_SP;
        if (this.cpl < cplOld) {
            offSP = (this.cpl << 2) + X86.TSS286.CPL0_SP;
            offSS = offSP + 2;
        }
        cpu.setSS(cpu.getShort(addrNew + offSS), true);
        cpu.setSP(cpu.getShort(addrNew + offSP));
    } else {
        cpu.assert(cpu.segTSS.type == X86.DESC.ACC.TYPE.TSS386 || cpu.segTSS.type == X86.DESC.ACC.TYPE.TSS386_BUSY);
        cpu.setLong(addrOld + X86.TSS386.TASK_CR3, cpu.regCR3);
        cpu.setLong(addrOld + X86.TSS386.TASK_EIP, cpu.getIP());
        cpu.setLong(addrOld + X86.TSS386.TASK_PS,  cpu.getPS());
        cpu.setLong(addrOld + X86.TSS386.TASK_EAX, cpu.regEAX);
        cpu.setLong(addrOld + X86.TSS386.TASK_ECX, cpu.regECX);
        cpu.setLong(addrOld + X86.TSS386.TASK_EDX, cpu.regEDX);
        cpu.setLong(addrOld + X86.TSS386.TASK_EBX, cpu.regEBX);
        cpu.setLong(addrOld + X86.TSS386.TASK_ESP, cpu.getSP());
        cpu.setLong(addrOld + X86.TSS386.TASK_EBP, cpu.regEBP);
        cpu.setLong(addrOld + X86.TSS386.TASK_ESI, cpu.regESI);
        cpu.setLong(addrOld + X86.TSS386.TASK_EDI, cpu.regEDI);
        cpu.setLong(addrOld + X86.TSS386.TASK_ES,  cpu.segES.sel);
        cpu.setLong(addrOld + X86.TSS386.TASK_CS,  cpu.segCS.sel);
        cpu.setLong(addrOld + X86.TSS386.TASK_SS,  cpu.segSS.sel);
        cpu.setLong(addrOld + X86.TSS386.TASK_DS,  cpu.segDS.sel);

        /*
         * segFS and segGS exist only on 80386 machines
         */
        cpu.assert(I386 && cpu.model >= X86.MODEL_80386);
        cpu.setLong(addrOld + X86.TSS386.TASK_FS,  cpu.segFS.sel);
        cpu.setLong(addrOld + X86.TSS386.TASK_GS,  cpu.segGS.sel);

        /*
         * Reload all registers from the new TSS; it's important to reload the LDTR sooner
         * rather than later, so that as segment registers are reloaded, any LDT selectors will
         * will be located in the correct table.
         */
        X86.fnLCR3.call(cpu, cpu.getLong(addrNew + X86.TSS386.TASK_CR3));
        cpu.segLDT.load(cpu.getShort(addrNew + X86.TSS386.TASK_LDT));
        cpu.setPS(cpu.getLong(addrNew + X86.TSS386.TASK_PS) | (fNest? X86.PS.NT : 0));
        cpu.assert(!fNest || !!(cpu.regPS & X86.PS.NT));
        cpu.regEAX = cpu.getLong(addrNew + X86.TSS386.TASK_EAX);
        cpu.regECX = cpu.getLong(addrNew + X86.TSS386.TASK_ECX);
        cpu.regEDX = cpu.getLong(addrNew + X86.TSS386.TASK_EDX);
        cpu.regEBX = cpu.getLong(addrNew + X86.TSS386.TASK_EBX);
        cpu.regEBP = cpu.getLong(addrNew + X86.TSS386.TASK_EBP);
        cpu.regESI = cpu.getLong(addrNew + X86.TSS386.TASK_ESI);
        cpu.regEDI = cpu.getLong(addrNew + X86.TSS386.TASK_EDI);
        cpu.segES.load(cpu.getShort(addrNew + X86.TSS386.TASK_ES));
        cpu.segDS.load(cpu.getShort(addrNew + X86.TSS386.TASK_DS));

        /*
         * segFS and segGS exist only on 80386 machines
         */
        cpu.assert(I386 && cpu.model >= X86.MODEL_80386);
        cpu.segFS.load(cpu.getShort(addrNew + X86.TSS386.TASK_FS));
        cpu.segGS.load(cpu.getShort(addrNew + X86.TSS386.TASK_GS));

        cpu.setCSIP(cpu.getLong(addrNew + X86.TSS386.TASK_EIP), cpu.getShort(addrNew + X86.TSS386.TASK_CS));
        offSS = X86.TSS386.TASK_SS;
        offSP = X86.TSS386.TASK_ESP;
        if (this.cpl < cplOld) {
            offSP = (this.cpl << 2) + X86.TSS386.CPL0_ESP;
            offSS = offSP + 4;
        }
        cpu.setSS(cpu.getShort(addrNew + offSS), true);
        cpu.setSP(cpu.getLong(addrNew + offSP));
    }

    /*
     * Fortunately, X86.TSS286.PREV_TSS and X86.TSS386.PREV_TSS refer to the same TSS offset.
     */
    if (fNest) cpu.setShort(addrNew + X86.TSS286.PREV_TSS, selOld);

    cpu.regCR0 |= X86.CR0.MSW.TS;
    return true;
};

/**
 * setBase(addr)
 *
 * This is used in unusual situations where the base must be set independently; normally, the base is
 * set according to the selector provided to load(), but there are a few cases where setBase() is required.
 *
 * For example, in resetRegs(), the real-mode CS selector must be reset to 0xF000 for an 80286 or 80386,
 * but the CS base must be set to 0x00FF0000 or 0xFFFF0000, respectively.  To simplify life for setBase()
 * callers, we allow them to specify 32-bit bases, which we then truncate to 24 bits as needed.
 *
 * WARNING: Since the CPU must maintain regLIP as the sum of the CS base and the current IP, all calls
 * to segCS.setBase() need to go through cpu.setCSBase().
 *
 * @this {X86Seg}
 * @param {number} addr
 * @return {number} addr, truncated as needed
 */
X86Seg.prototype.setBase = function(addr)
{
    if (this.cpu.model < X86.MODEL_80386) addr &= 0xffffff;
    return this.base = addr;
};

/**
 * save()
 *
 * Early versions of PCjs saved only segment selectors, since that's all that mattered in real-mode;
 * newer versions need to save/restore all the "core" properties of the X86Seg object (ie, properties other
 * than those that updateMode() will take care of restoring later).
 *
 * @this {X86Seg}
 * @return {Array}
 */
X86Seg.prototype.save = function()
{
    return [
        this.sel,
        this.base,
        this.limit,
        this.acc,
        this.id,
        this.sName,
        this.cpl,
        this.dpl,
        this.addrDesc,
        this.sizeAddr,
        this.maskAddr,
        this.sizeData,
        this.maskData,
        this.type,
        this.offMax
    ];
};

/**
 * restore(a)
 *
 * Early versions of PCjs saved only segment selectors, since that's all that mattered in real-mode;
 * newer versions need to save/restore all the "core" properties of the X86Seg object (ie, properties other
 * than those that updateMode() will take care of restoring later).
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
        this.sizeAddr = a[9]  || 2;
        this.maskAddr = a[10] || 0xffff;
        this.sizeData = a[11] || 2;
        this.maskData = a[12] || 0xffff;
        this.type     = a[13] || (this.acc & X86.DESC.ACC.TYPE.MASK);
        this.offMax   = a[14] || (this.limit >>> 0) + 1;
    }
};

/**
 * updateMode(fLoad, fProt, fV86)
 *
 * Ensures that the segment register's access (ie, load and check methods) matches the specified (or current)
 * operating mode (real or protected).
 *
 * @this {X86Seg}
 * @param {boolean} [fLoad] true if the segment was just (re)loaded, false if not
 * @param {boolean} [fProt] true for protected-mode access, false for real-mode access, undefined for current mode
 * @param {boolean} [fV86] true for V86-mode access, false for protected-mode access, undefined for current mode
 */
X86Seg.prototype.updateMode = function(fLoad, fProt, fV86)
{
    if (fProt === undefined) {
        fProt = !!(this.cpu.regCR0 & X86.CR0.MSW.PE);
    }

    /*
     * The fExpDown property is used for STACK segments only (ie, segSS); we want to make it easier for
     * setSS() to set stack lower and upper limits, which requires knowing whether or not the segment is
     * marked as EXPDOWN.
     */
    this.fExpDown = false;

    if (fProt) {
        this.load = this.loadProt;
        this.loadIDT = this.loadIDTProt;
        this.checkRead = this.checkReadProt;
        this.checkWrite = this.checkWriteProt;

        if (fV86 === undefined) {
            fV86 = !!(this.cpu.regPS & X86.PS.VM);
        }

        if (fV86) {
            this.load = this.loadV86;
            this.checkRead = this.checkReadV86;
            this.checkWrite = this.checkWriteV86;
            /*
             * One important feature of V86-mode (as compared to real-mode) are that other segment attributes
             * (eg, limit, operand size, address size, etc) ARE updated, whereas in real-mode, segment attributes
             * remain set to whatever was in effect in protected-mode.
             */
            this.cpl = this.dpl = 3;
            this.sizeData = this.sizeAddr = 2;
            this.maskData = this.maskAddr = 0xffff;
            this.limit = 0xffff;
            this.offMax = this.limit + 1;
            this.sizeAddr = this.sizeData;
            this.addrDesc = X86.ADDR_INVALID;
            this.fStackSwitch = false;
            return;
        }

        /*
         * TODO: For null GDT selectors, should we rely on the descriptor being invalid, or should we assume that
         * the null descriptor might contain uninitialized (or other) data?  I'm assuming the latter, hence the
         * following null selector test.  However, if we're not going to consult the descriptor, is there anything
         * else we should (or should not) be doing for null GDT selectors?
         */
        if (!(this.sel & ~X86.SEL.RPL)) {
            this.checkRead = this.checkReadProtDisallowed;
            this.checkWrite = this.checkWriteProtDisallowed;

        }
        else if (this.type & X86.DESC.ACC.TYPE.SEG) {
            /*
             * If the READABLE bit of CODE_READABLE is not set, then disallow reads.
             */
            if ((this.type & X86.DESC.ACC.TYPE.CODE_READABLE) == X86.DESC.ACC.TYPE.CODE_EXECONLY) {
                this.checkRead = this.checkReadProtDisallowed;
            }
            /*
             * If the CODE bit is set, or the the WRITABLE bit is not set, then disallow writes.
             */
            if ((this.type & X86.DESC.ACC.TYPE.CODE) || !(this.type & X86.DESC.ACC.TYPE.WRITABLE)) {
                this.checkWrite = this.checkWriteProtDisallowed;
            }
            /*
             * If the CODE bit is not set *and* the EXPDOWN bit is set, then invert the limit check.
             */
            if ((this.type & (X86.DESC.ACC.TYPE.CODE | X86.DESC.ACC.TYPE.EXPDOWN)) == X86.DESC.ACC.TYPE.EXPDOWN) {
                if (this.checkRead == this.checkReadProt) this.checkRead = this.checkReadProtDown;
                if (this.checkWrite == this.checkWriteProt) this.checkWrite = this.checkWriteProtDown;
                this.fExpDown = true;
            }
            if (fLoad && this.id < X86Seg.ID.VER) {
                /*
                 * We must update the descriptor's ACCESSED bit whenever the segment is "accessed" (ie,
                 * loaded); unlike the ACCESSED and DIRTY bits in PTEs, a descriptor ACCESSED bit is only
                 * updated on loads, not on every memory access.
                 *
                 * We compute address of the descriptor byte containing the ACCESSED bit (offset 0x5);
                 * note that it's perfectly normal for addrDesc to occasionally be invalid (eg, when the CPU
                 * is creating protected-mode-only segment registers like LDT and TSS, or when the CPU has
                 * transitioned from real-mode to protected-mode and new selector(s) have not been loaded yet).
                 *
                 * TODO: Note I do NOT update the ACCESSED bit for null GDT selectors, because I assume the
                 * hardware does not update it either.  In fact, I've seen code that uses the null GDT descriptor
                 * for other purposes, on the assumption that that descriptor is completely unused.
                 */
                if ((this.sel & ~X86.SEL.RPL) && this.addrDesc !== X86.ADDR_INVALID) {
                    var addrType = this.addrDesc + X86.DESC.ACC.TYPE.OFFSET;
                    this.cpu.setByte(addrType, this.cpu.getByte(addrType) | (X86.DESC.ACC.TYPE.ACCESSED >> 8));
                }
            }
        }
        /*
         * TODO: For non-SEG descriptors, are there other checks or functions we should establish?
         */

        /*
         * Any update to the following properties must occur only on segment loads, not simply when
         * we're updating segment registers as part of a mode change.
         */
        if (fLoad) {
            this.cpl = this.sel & X86.SEL.RPL;
            this.dpl = (this.acc & X86.DESC.ACC.DPL.MASK) >> X86.DESC.ACC.DPL.SHIFT;
            if (this.cpu.model < X86.MODEL_80386 || !(this.ext & X86.DESC.EXT.BIG)) {
                this.sizeData = 2;
                this.maskData = 0xffff;
            } else {
                this.sizeData = 4;
                this.maskData = (0xffffffff|0);
            }
            this.sizeAddr = this.sizeData;
            this.maskAddr = this.maskData;
        }
        return;
    }
    /*
     * One important feature of real-mode (as compared to V86-mode) are that other segment attributes
     * (eg, limit, operand size, address size, etc) are NOT updated, enabling features like "big real-mode"
     * (aka "unreal mode"), which is used by system software like HIMEM.SYS to access extended memory from
     * real-mode.
     */
    this.load = this.loadReal;
    this.loadIDT = this.loadIDTReal;
    this.checkRead = this.checkReadReal;
    this.checkWrite = this.checkWriteReal;
    this.cpl = this.dpl = 0;
    this.addrDesc = X86.ADDR_INVALID;
    this.fStackSwitch = false;
};

/**
 * messageSeg(sel, base, limit, type, ext)
 *
 * @this {X86Seg}
 * @param {number} sel
 * @param {number} base
 * @param {number} limit
 * @param {number} type
 * @param {number} [ext]
 */
X86Seg.prototype.messageSeg = function(sel, base, limit, type, ext)
{
    if (DEBUG) {
        if (DEBUGGER && this.dbg && this.dbg.messageEnabled(Messages.SEG)) {
            var ch = (this.sName.length < 3? " " : "");
            var sDPL = " dpl=" + this.dpl;
            if (this.id == X86Seg.ID.CODE) sDPL += " cpl=" + this.cpl;
            this.dbg.message("loadSeg(" + this.sName + "):" + ch + "sel=" + str.toHexWord(sel) + " base=" + str.toHex(base) + " limit=" + str.toHexWord(limit) + " type=" + str.toHexWord(type) + sDPL, true);
        }
        this.cpu.assert(/* base !== X86.ADDR_INVALID && */ (this.cpu.model >= X86.MODEL_80386 || !ext || ext == X86.DESC.EXT.AVAIL));
    }
};

if (NODE) module.exports = X86Seg;
