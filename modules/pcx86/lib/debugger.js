/**
 * @fileoverview Implements the PCx86 Debugger component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
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

if (DEBUGGER) {
    if (NODE) {
        var Str         = require("../../shared/lib/strlib");
        var Usr         = require("../../shared/lib/usrlib");
        var Web         = require("../../shared/lib/weblib");
        var Component   = require("../../shared/lib/component");
        var Debugger    = require("../../shared/lib/debugger");
        var Keys        = require("../../shared/lib/keys");
        var State       = require("../../shared/lib/state");
        var PCX86       = require("./defines");
        var CPU         = require("./cpu");
        var X86         = require("./x86");
        var X86Seg      = require("./x86seg");
        var Interrupts  = require("./interrupts");
        var Messages    = require("./messages");
        var Memory      = require("./memory");
    }
}

/**
 * Debugger Address Object
 *
 *      off             offset, if any
 *      sel             selector, if any (if null, addr should be set to a linear address)
 *      addr            linear address, if any (if null, addr will be recomputed from sel:off)
 *      type            one of the DebuggerX86.ADDRTYPE values
 *      fData32         true if 32-bit operand size in effect
 *      fAddr32         true if 32-bit address size in effect
 *      fData32Orig     original fData32 value, if any
 *      fAddr32Orig     original fAddr32 value, if any
 *      cOverrides      non-zero if any overrides were processed with this address
 *      fComplete       true if a complete instruction was processed with this address
 *      fTempBreak      true if this is a temporary breakpoint address
 *      sCmd            set for breakpoint addresses if there's an associated command string
 *      aCmds           preprocessed commands (from sCmd)
 *
 * @typedef {{
 *      off:(number|null|undefined),
 *      sel:(number|null|undefined),
 *      addr:(number|null|undefined),
 *      type:(number|undefined),
 *      fData32:(boolean|undefined),
 *      fAddr32:(boolean|undefined),
 *      fData32Orig:(boolean|undefined),
 *      fAddr32Orig:(boolean|undefined),
 *      cOverrides:(number|undefined),
 *      fComplete:(boolean|undefined),
 *      fTempBreak:(boolean|undefined),
 *      sCmd:(string|undefined),
 *      aCmds:(Array.<string>|undefined)
 * }} DbgAddrX86
 */
var DbgAddrX86;

/*
 * Debugger Breakpoint Tips
 *
 * Here's an example of our powerful new breakpoint command capabilities:
 *
 *      bp 0397:022B "?'GlobalAlloc(wFlags:[ss:sp+8],dwBytes:[ss:sp+6][ss:sp+4])';g [ss:sp+2]:[ss:sp] '?ax;if ax'"
 *
 * The above breakpoint will display a pleasing "GlobalAlloc()" string containing the current
 * stack parameters, and will briefly stop execution on the return to print the result in AX,
 * halting the CPU whenever AX is zero (the default behavior of "if" whenever the expression is
 * false is to look for an "else" and automatically halt when there is no "else").
 *
 * How do you figure out where the code for GlobalAlloc is in the first place?  You need to have
 * BACKTRACK support enabled (which currently means running the non-COMPILED version), so that as
 * the Disk component loads disk images, it will automatically extract symbolic information from all
 * "NE" (New Executable) binaries on those disks, which the Debugger's "dt" command can then search
 * for you; eg:
 *
 *      ## dt globalalloc
 *      GLOBALALLOC: KRNL386.EXE 0001:022B len 0xC570
 *
 * And then you just need to do a bit more sleuthing to find the right CODE segment.  And that just
 * got easier, now that the PCx86 Debugger mimics portions of the Windows Debugger INT 0x41 interface;
 * see intWindowsDebugger() for details.  So even if you neglect to run WDEB386.EXE /E inside the
 * machine before running Windows, you should still see notifications like:
 *
 *      KERNEL!undefined code(0001)=#0397 len 0000C580
 *
 * in the PCx86 Debugger output window, as segments are being loaded by the Windows kernel.
 */

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class DebuggerX86 extends Debugger {
    /**
     * DebuggerX86(parmsDbg)
     *
     * The DebuggerX86 component is an optional component that implements a variety of user commands
     * for controlling the CPU, dumping and editing memory, etc.
     *
     * DebuggerX86 extends the shared Debugger component and supports the following optional (parmsDbg)
     * properties:
     *
     *      commands: string containing zero or more commands, separated by ';'
     *
     *      messages: string containing zero or more message categories to enable;
     *      multiple categories must be separated by '|' or ';'.  Parsed by messageInit().
     *
     * @this {DebuggerX86}
     * @param {Object} parmsDbg
     */
    constructor(parmsDbg)
    {
        if (DEBUGGER) {

            super(parmsDbg);

            /*
             * Default number of hex chars in a register and a linear address (ie, for real-mode);
             * updated by initBus().
             */
            this.cchReg = 4;
            this.cchAddr = 5;
            this.maskAddr = 0xfffff;

            /*
             * Most commands that require an address call parseAddr(), which defaults to dbgAddrNextCode
             * or dbgAddrNextData when no address has been given.  doDump() and doUnassemble(), in turn,
             * update dbgAddrNextData and dbgAddrNextCode, respectively, when they're done.
             *
             * All dbgAddr variables contain properties off, sel, and addr, where sel:off represents the
             * segmented address and addr is the corresponding linear address (if known).  For certain
             * segmented addresses (eg, breakpoint addresses), we pre-compute the linear address and save
             * that in addr, so that the breakpoint will still operate as intended even if the mode changes
             * later (eg, from real-mode to protected-mode).
             *
             * Finally, for TEMPORARY breakpoint addresses, we set fTempBreak to true, so that they can be
             * automatically cleared when they're hit.
             */
            this.dbgAddrNextCode = this.newAddr(0, 0);
            this.dbgAddrNextData = this.newAddr(0, 0);
            this.dbgAddrAssemble = this.newAddr(0, 0);

            /*
             * aSymbolTable is an array of SymbolTable objects, one per ROM or other chunk of address space,
             * where each object contains the following properties:
             *
             *      sModule
             *      nSegment
             *      sel
             *      off
             *      addr (physical address, if any; eg, symbols for a ROM)
             *      len
             *      aSymbols
             *      aOffsets
             *
             * See addSymbols() for more details, since that's how callers add sets of symbols to the table.
             */
            this.aSymbolTable = [];

            /*
             * clearBreakpoints() initializes the breakpoints lists: aBreakExec is a list of addresses
             * to halt on whenever attempting to execute an instruction at the corresponding address,
             * and aBreakRead and aBreakWrite are lists of addresses to halt on whenever a read or write,
             * respectively, occurs at the corresponding address.
             *
             * NOTE: Curiously, after upgrading the Google Closure Compiler from v20141215 to v20150609,
             * the resulting compiled code would crash in clearBreakpoints(), because the (renamed) aBreakRead
             * property was already defined.  To eliminate whatever was confusing the Closure Compiler, I've
             * explicitly initialized all the properties that clearBreakpoints() (re)initializes.
             */
            this.aBreakExec = this.aBreakRead = this.aBreakWrite = [];
            this.clearBreakpoints();

            /*
             * The new "bn" command allows you to specify a number of instructions to execute and then stop;
             * "bn 0" disables any outstanding count.
             */
            this.nBreakIns = 0;

            /*
             * Execution history is allocated by historyInit() whenever checksEnabled() conditions change.
             * Execution history is updated whenever the CPU calls checkInstruction(), which will happen
             * only when checksEnabled() returns true (eg, whenever one or more breakpoints have been set).
             * This ensures that, by default, the CPU runs as fast as possible.
             */
            this.historyInit();

            /*
             * Initialize Debugger message support
             */
            this.afnDumpers = {};
            this.messageInit(parmsDbg['messages']);

            this.sInitCommands = parmsDbg['commands'];

            /*
             * Make it easier to access Debugger commands from an external REPL, like the WebStorm "live" console
             * window; eg:
             *
             *      pcx86('r')
             *      pcx86('dw 0:0')
             *      pcx86('h')
             *      ...
             */
            var dbg = this;
            if (window) {
                if (window[PCX86.APPCLASS] === undefined) {
                    window[PCX86.APPCLASS] = function(s) { return dbg.doCommands(s); };
                }
            } else {
                if (global[PCX86.APPCLASS] === undefined) {
                    global[PCX86.APPCLASS] = function(s) { return dbg.doCommands(s); };
                }
            }

        }   // endif DEBUGGER
    }

    /**
     * initBus(bus, cpu, dbg)
     *
     * @this {DebuggerX86}
     * @param {Computer} cmp
     * @param {Bus} bus
     * @param {X86CPU} cpu
     * @param {DebuggerX86} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.bus = bus;
        this.cpu = cpu;
        this.cmp = cmp;
        this.fdc = cmp.getMachineComponent("FDC");
        this.hdc = cmp.getMachineComponent("HDC");
        this.fpu = cmp.getMachineComponent("FPU");
        this.mouse = cmp.getMachineComponent("Mouse");
        if (MAXDEBUG) this.chipset = cmp.getMachineComponent("ChipSet");

        /*
         * Re-initialize Debugger message support if necessary
         */
        var sMessages = cmp.getMachineParm('messages');
        if (sMessages) this.messageInit(sMessages);

        this.cchAddr = bus.getWidth() >> 2;
        this.maskAddr = bus.nBusLimit;

        /*
         * Allocate a special segment "register", for use whenever a requested selector is not currently loaded
         */
        this.segDebugger = new X86Seg(this.cpu, X86Seg.ID.DBG, "DBG");

        this.aaOpDescs = DebuggerX86.aaOpDescs;
        if (this.cpu.model >= X86.MODEL_80186) {
            this.aaOpDescs = DebuggerX86.aaOpDescs.slice();
            this.aaOpDescs[0x0F] = DebuggerX86.aOpDescUndefined;
            if (this.cpu.model >= X86.MODEL_80286) {
                /*
                 * TODO: Consider whether the aOpDesc0F table should be split in two: one for 80286-only instructions,
                 * and one for both 80286 and 80386.  For now, the Debugger is not as strict as the X86CPU is about
                 * the instructions it supports for each type of CPU, in part because an 80286 machine could still be
                 * presented with 80386-only code that is simply "skipped over" when then CPU doesn't support it.
                 *
                 * Obviously I'm not being entirely consistent, since I don't disassemble *any* 0x0F opcodes for any
                 * pre-80286 CPUs.  But at least I'm being up front about it.
                 */
                this.aaOpDescs[0x0F] = DebuggerX86.aOpDesc0F;
                if (I386 && this.cpu.model >= X86.MODEL_80386) this.cchReg = 8;
            }
        }

        this.messageDump(Messages.BUS,  function onDumpBus(asArgs) { dbg.dumpBus(asArgs); });
        this.messageDump(Messages.DESC, function onDumpSel(asArgs) { dbg.dumpSel(asArgs); });
        this.messageDump(Messages.DOS,  function onDumpDOS(asArgs) { dbg.dumpDOS(asArgs); });
        this.messageDump(Messages.MEM,  function onDumpMem(asArgs) { dbg.dumpMem(asArgs); });
        this.messageDump(Messages.TSS,  function onDumpTSS(asArgs) { dbg.dumpTSS(asArgs); });

        if (Interrupts.WINDBG.ENABLED || Interrupts.WINDBGRM.ENABLED) {
            this.fWinDbg = null;
            this.cTrapFaults = 0;
            this.fIgnoreNextCheckFault = false;
            this.cpu.addIntNotify(Interrupts.WINCB.VECTOR, this.intWindowsCallBack.bind(this));
            this.cpu.addIntNotify(Interrupts.WINDBG.VECTOR, this.intWindowsDebugger.bind(this));
        }
        if (Interrupts.WINDBGRM.ENABLED) {
            this.fWinDbgRM = null;
            this.cpu.addIntNotify(Interrupts.WINDBGRM.VECTOR, this.intWindowsDebuggerRM.bind(this));
        }

        this.setReady();
    }

    /**
     * addSegmentInfo(dbgAddr, nSegment, sel, fCode, fPrint)
     *
     * CONDITIONAL: if (Interrupts.WINDBG.ENABLED || Interrupts.WINDBGRM.ENABLED)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr (address of module name)
     * @param {number} nSegment (logical segment number)
     * @param {number} sel (current selector)
     * @param {boolean} fCode (true if code segment, false if data segment)
     * @param {boolean} [fPrint] (false means we're merely monitoring, so let WDEB386 print its own notifications)
     */
    addSegmentInfo(dbgAddr, nSegment, sel, fCode, fPrint)
    {
        var sModule = this.getSZ(dbgAddr);
        var seg = this.getSegment(sel);
        var len = seg? seg.limit + 1 : 0;
        var sSection = (fCode? "_CODE" : "_DATA") + Str.toHex(nSegment, 2);
        if (fPrint && this.messageEnabled(Messages.MEM)) {
            this.message(sModule + ' ' + (fCode? "code" : "data") + '(' + Str.toHex(nSegment, 4) + ")=#" + Str.toHex(sel, 4) + " len " + Str.toHex(len));
        }
        var off = 0;
        var aSymbols = this.findModuleInfo(sModule, nSegment);
        aSymbols[sModule + sSection] = off;
        this.addSymbols(sModule, nSegment, sel, off, null, len, aSymbols);
    }

    /**
     * removeSegmentInfo(sel, fPrint)
     *
     * CONDITIONAL: if (Interrupts.WINDBG.ENABLED || Interrupts.WINDBGRM.ENABLED)
     *
     * @this {DebuggerX86}
     * @param {number} sel
     * @param {boolean} [fPrint] (false means we're merely monitoring OR we don't really care about these notifications)
     */
    removeSegmentInfo(sel, fPrint)
    {
        var sModuleRemoved = this.removeSymbols(null, sel);
        if (fPrint && this.messageEnabled(Messages.MEM)) {
            if (sModuleRemoved) {
                this.message(sModuleRemoved + " #" + Str.toHex(sel, 4) + " removed");
            } else {
                this.message("unable to remove module for segment #" + Str.toHex(sel, 4));
            }
        }
    }

    /**
     * addSectionInfo(dbgAddr, fCode, fPrint)
     *
     * CONDITIONAL: if (Interrupts.WINDBG.ENABLED || Interrupts.WINDBGRM.ENABLED)
     *
     *  dbgAddr -> D386_Device_Params structure:
     *      DD_logical_seg  dw  ?   ; logical segment # from map
     *      DD_actual_sel   dw  ?   ; actual selector value
     *      DD_base         dd  ?   ; linear address offset for start of segment
     *      DD_length       dd  ?   ; actual length of segment
     *      DD_name         df  ?   ; 16:32 ptr to null terminated module name
     *      DD_sym_name     df  ?   ; 16:32 ptr to null terminated parent name (eg, "DOS386")
     *      DD_alias_sel    dw  ?   ; alias selector value (0 = none)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr (address of D386_Device_Params)
     * @param {boolean} fCode (true if code section, false if data section)
     * @param {boolean} [fPrint] (false means we're merely monitoring, so let WDEB386 print its own notifications)
     */
    addSectionInfo(dbgAddr, fCode, fPrint)
    {
        var nSegment = this.getShort(dbgAddr, 2);
        var sel = this.getShort(dbgAddr, 2);
        var off = this.getLong(dbgAddr, 4);
        var len = this.getLong(dbgAddr, 4);
        var dbgAddrModule = this.newAddr(this.getLong(dbgAddr, 4), this.getShort(dbgAddr, 2));
        var dbgAddrParent = this.newAddr(this.getLong(dbgAddr, 4), this.getShort(dbgAddr, 2));
        // sel = this.getShort(dbgAddr, 2) || sel;
        var sParent = this.getSZ(dbgAddrParent).toUpperCase();
        var sModule = this.getSZ(dbgAddrModule).toUpperCase();
        if (sParent == sModule) {
            sParent = "";
        } else {
            sParent += '!';
        }
        var sSection = (fCode? "_CODE" : "_DATA") + Str.toHex(nSegment, 2);
        if (fPrint && this.messageEnabled(Messages.MEM)) {
            /*
             * Mimics WDEB386 output, except that WDEB386 only displays a linear address, omitting the selector.
             */
            this.message(sParent + sModule + ' ' + (fCode? "code" : "data") + '(' + Str.toHex(nSegment, 4) + ")=" + Str.toHex(sel, 4) + ':' + Str.toHex(off) + " len " + Str.toHex(len));
        }
        /*
         * TODO: Add support for 32-bit symbols; findModuleInfo() relies on Disk.getModuleInfo(), and the Disk
         * component doesn't yet know how to parse 32-bit executables.
         */
        var aSymbols = this.findModuleInfo(sModule, nSegment);
        aSymbols[sModule + sSection] = off;
        this.addSymbols(sModule, nSegment, sel, off, null, len, aSymbols);
    }

    /**
     * removeSectionInfo(nSegment, dbgAddr, fPrint)
     *
     * CONDITIONAL: if (Interrupts.WINDBG.ENABLED || Interrupts.WINDBGRM.ENABLED)
     *
     * @this {DebuggerX86}
     * @param {number} nSegment (logical segment number)
     * @param {DbgAddrX86} dbgAddr (address of module)
     * @param {boolean} [fPrint] (false means we're merely monitoring OR we don't really care about these notifications)
     */
    removeSectionInfo(nSegment, dbgAddr, fPrint)
    {
        var sModule = this.getSZ(dbgAddr).toUpperCase();
        var sModuleRemoved = this.removeSymbols(sModule, nSegment);
        if (fPrint && this.messageEnabled(Messages.MEM)) {
            if (sModuleRemoved) {
                this.message(sModule + ' ' + Str.toHex(nSegment, 4) + " removed");
            } else {
                this.message("unable to remove " + sModule + " for section " + Str.toHex(nSegment, 4));
            }
        }
    }

    /**
     * intWindowsCallBack()
     *
     * CONDITIONAL: if (Interrupts.WINDBG.ENABLED || Interrupts.WINDBGRM.ENABLED)
     *
     * This intercepts calls to Windows callback addresses, which use INT 0x30 (aka Transfer Space Faults).
     *
     * We're only interested in one particular callback: the VW32_Int41Dispatch (0x002A002A) that KERNEL32
     * issues as 32-bit executable sections are loaded.
     *
     * At the time that INT 0x30 occurs, a far 32-bit call has been made, preceded by a near 32-bit call,
     * preceded by a 32-bit push of the Windows Debugger function # that would normally be in EAX if this had
     * been an actual INT 0x41.
     *
     * NOTE: Regardless whether we're "handling" INT 0x41 or merely "monitoring" INT 0x41, as far as THIS
     * interrupt is concerned, we always let the system process it, because execution never continues at the
     * instruction following an INT 0x30; in fact, execution doesn't even continue after the far 32-bit call
     * (even though the kernel places a "RET 4" after that call).  So, rather than recreate all that automatic
     * address popping, we let the system do it for us, since it's designed to work whether a debugger (eg,
     * WDEB386's DEBUG VxD) is installed or not.
     *
     * TODO: Consider "consuming" all VW32_Int41Dispatch callbacks, because the Windows 95 kernel goes to
     * great effort to pass those requests on to the DEBUG VxD, which end up going nowhere when the VxD isn't
     * loaded (to load it, you must either run WDEB386.EXE or install the VxD via SYSTEM.INI).  Regrettably,
     * Windows 95 assumes that if WDEB386 support is present, then a DEBUG VxD must be present as well.
     *
     * @this {DebuggerX86}
     * @param {number} addr
     * @return {boolean} true to proceed with the INT 0x30 software interrupt
     */
    intWindowsCallBack(addr)
    {
        var cpu = this.cpu;

        if (this.fWinDbg != null && cpu.regEAX == 0x002A002A) {

            var DX = cpu.regEDX & 0xffff;
            var SI = cpu.regESI & 0xffff;
            var dbgAddr = this.newAddr(cpu.getSP() + 0x0C, cpu.getSS());
            var EAX = this.getLong(dbgAddr);

            switch(EAX) {
            case Interrupts.WINDBG.LOADSEG32:
                /*
                 *  SI == segment type:
                 *      0x0     code selector
                 *      0x1     data selector
                 *  DX:EBX -> D386_Device_Params structure (see addSectionInfo() for details)
                 */
                this.addSectionInfo(this.newAddr(cpu.regEBX, DX), !SI, !!this.fWinDbg);
                break;
            }
        }
        return true;
    }

    /**
     * intWindowsDebugger()
     *
     * CONDITIONAL: if (Interrupts.WINDBG.ENABLED || Interrupts.WINDBGRM.ENABLED)
     *
     * This intercepts calls to the Windows Debugger protected-mode interface (INT 0x41).
     *
     * It's enabled if Interrupts.WINDBG.ENABLED is true, but it must ALSO be enabled if
     * Interrupts.WINDBGRM.ENABLED is true, because if the latter decides to respond to requests,
     * then we must start responding, too.  Windows assumes that if INT 0x68 support is present,
     * then INT 0x41 support must be present as well.
     *
     * That is why intWindowsDebuggerRM() will also set this.fWinDbg to true: we MUST return false
     * for all INT 0x41 requests, so that all requests are consumed, since there's no guarantee
     * that a valid INT 0x41 handler will exist inside the machine.
     *
     * @this {DebuggerX86}
     * @param {number} addr
     * @return {boolean} true to proceed with the INT 0x41 software interrupt, false to skip
     */
    intWindowsDebugger(addr)
    {
        var dbgAddr;
        var cpu = this.cpu;
        var AX = cpu.regEAX & 0xffff;
        var BX = cpu.regEBX & 0xffff;
        var CX = cpu.regECX & 0xffff;
        var DX = cpu.regEDX & 0xffff;
        var SI = cpu.regESI & 0xffff;
        var DI = cpu.regEDI & 0xffff;
        var ES = cpu.segES.sel;

        if (this.fWinDbg == null) {
            if (AX == Interrupts.WINDBG.IS_LOADED) {
                /*
                 * We're only going to respond to this function if no one else did, in which case,
                 * we'll set fWinDbg to true and handle additional notifications.
                 */
                cpu.addIntReturn(addr, function(dbg) {
                    return function onInt41Return(nLevel) {
                        if ((cpu.regEAX & 0xffff) != Interrupts.WINDBG.LOADED) {
                            cpu.regEAX = (cpu.regEAX & ~0xffff) | Interrupts.WINDBG.LOADED;
                            /*
                             * TODO: We need a DEBUGGER message category; using the MEM category for now.
                             */
                            dbg.printMessage("INT 0x41 handling enabled", Messages.MEM);
                            dbg.fWinDbg = true;
                        } else {
                            dbg.printMessage("INT 0x41 monitoring enabled", Messages.MEM);
                            dbg.fWinDbg = false;
                        }
                    };
                }(this));
            }
            return true;
        }

        /*
         * NOTE: If this.fWinDbg is true, then all cases should return false, because we're taking full
         * responsibility for all requests (don't assume there's valid interrupt handler inside the machine).
         */
        switch(AX) {
        case Interrupts.WINDBG.IS_LOADED:           // 0x004F
            if (this.fWinDbg) {
                cpu.regEAX = (cpu.regEAX & ~0xffff) | Interrupts.WINDBG.LOADED;
                this.printMessage("INT 0x41 handling enabled", Messages.MEM);
            }
            break;

        case Interrupts.WINDBG.LOADSEG:             // 0x0050
            this.addSegmentInfo(this.newAddr(DI, ES), BX+1, CX, !(SI & 0x1), !!this.fWinDbg);
            break;

        case Interrupts.WINDBG.FREESEG:             // 0x0052
            this.removeSegmentInfo(BX);
            break;

        case Interrupts.WINDBG.KRNLVARS:            // 0x005A
            /*
             *  BX = version number of this data (0x3A0)
             *  DX:CX points to:
             *      WORD    hGlobalHeap     ****
             *      WORD    pGlobalHeap     ****
             *      WORD    hExeHead        ****
             *      WORD    hExeSweep
             *      WORD    topPDB
             *      WORD    headPDB
             *      WORD    topsizePDB
             *      WORD    headTDB         ****
             *      WORD    curTDB          ****
             *      WORD    loadTDB
             *      WORD    LockTDB
             *      WORD    SelTableLen     ****
             *      DWORD   SelTableStart   ****
             */
            break;

        case Interrupts.WINDBG.RELSEG:              // 0x005C
        case Interrupts.WINDBG.EXITCALL:            // 0x0062
        case Interrupts.WINDBG.LOADDLL:             // 0x0064
        case Interrupts.WINDBG.DELMODULE:           // 0x0065
        case Interrupts.WINDBG.UNKNOWN66:           // 0x0066
        case Interrupts.WINDBG.UNKNOWN67:           // 0x0067
            /*
             * TODO: Figure out what to do with these notifications, if anything
             */
            break;

        case Interrupts.WINDBG.LOADHIGH:            // 0x005D
        case Interrupts.WINDBG.REGDOTCMD:           // 0x0070
        case Interrupts.WINDBG.CONDBP:              // 0xF001
            break;

        case Interrupts.WINDBG.CHECKFAULT:          // 0x007F
            if (this.fWinDbg) {
                /*
                 * AX == 0 means handle fault normally, 1 means issue TRAPFAULT
                 */
                cpu.regEAX = (cpu.regEAX & ~0xffff) | (this.fIgnoreNextCheckFault? 0 : 1);
                if (DEBUG) this.println("INT 0x41 CHECKFAULT: fault=" + Str.toHexWord(BX) + " type=" + Str.toHexWord(CX) + " trap=" + !this.fIgnoreNextCheckFault);
            }
            break;

        case Interrupts.WINDBG.TRAPFAULT:           // 0x0083
            /*
             * If we responded with AX == 1 to a preceding CHECKFAULT notification, then we should receive the
             * following TRAPFAULT notification; additionally, a TRAPFAULT notification may be issued without
             * any CHECKFAULT warning if the user was presented with a fault dialog containing a "Debug" button,
             * and the user clicked it.
             *
             * Regardless, whenever we receive this notification, we allocate a temporary breakpoint at the
             * reported fault address.
             */
            if (this.fWinDbg) {
                dbgAddr = this.newAddr(cpu.regEDX, CX);
                if (!this.cTrapFaults++) {
                    this.println("INT 0x41 TRAPFAULT: fault=" + Str.toHexWord(BX) + " error=" + Str.toHexLong(cpu.regESI) + " addr=" + this.toHexAddr(dbgAddr));
                    this.addBreakpoint(this.aBreakExec, dbgAddr, true);
                    this.historyInit(true);         // temporary breakpoints don't normally trigger history, but in this case, we want it to
                } else {
                    this.println("TRAPFAULT failed");
                    this.findBreakpoint(this.aBreakExec, dbgAddr, true, true, true);
                    this.cTrapFaults = 0;
                    this.stopCPU();
                }
            }
            break;

        case Interrupts.WINDBG.GETSYMBOL:           // 0x008D
            if (this.fWinDbg) cpu.regEAX = (cpu.regEAX & ~0xffff)|1;        // AX == 1 means not found
            break;

        case Interrupts.WINDBG.LOADSEG32:           // 0x0150
            /*
             *  SI == segment type:
             *      0x0     code selector
             *      0x1     data selector
             *  DX:EBX -> D386_Device_Params structure (see addSectionInfo() for details)
             */
            this.addSectionInfo(this.newAddr(cpu.regEBX, DX), !SI, !!this.fWinDbg);
            break;

        case Interrupts.WINDBG.FREESEG32:           // 0x0152
            /*
             *  BX == segment number
             *  DX:EDI -> module name
             */
            this.removeSectionInfo(BX, this.newAddr(cpu.regEDI, DX));
            break;

        default:
            if (DEBUG && this.fWinDbg) {
                this.println("INT 0x41: " + Str.toHexWord(AX));
            }
            break;
        }

        /*
         * Let's try to limit the scope of any "gt" command by resetting this flag after any INT 0x41
         */
        this.fIgnoreNextCheckFault = false;

        return !this.fWinDbg;
    }

    /**
     * intWindowsDebuggerRM()
     *
     * CONDITIONAL: if (Interrupts.WINDBGRM.ENABLED)
     *
     * This intercepts calls to the Windows Debugger real-mode interface (INT 0x68).
     *
     * @this {DebuggerX86}
     * @param {number} addr
     * @return {boolean} true to proceed with the INT 0x68 software interrupt, false to skip
     */
    intWindowsDebuggerRM(addr)
    {
        var cpu = this.cpu;
        var AL = cpu.regEAX & 0xff;
        var AH = (cpu.regEAX >> 8) & 0xff;
        var BX = cpu.regEBX & 0xffff;
        var CX = cpu.regECX & 0xffff;
        var DX = cpu.regEDX & 0xffff;
        var DI = cpu.regEDI & 0xffff;
        var ES = cpu.segES.sel;

        if (this.fWinDbgRM == null) {
            if (AH == Interrupts.WINDBGRM.IS_LOADED) {
                /*
                 * It looks like IFSHLP.SYS issues a preliminary INT 0x68 before Windows 95 gets rolling,
                 * and the Windows Debugger will not have had a chance to load yet, so we need to ignore
                 * that call.  We detect IFSHLP.SYS by looking for "IFS$" in the caller's code segment,
                 * where the IFSHLP device driver header is located.
                 */
                if (cpu.getLong((cpu.segCS.sel << 4) + 0x0A) == 0x24534649) {
                    if (DEBUG) this.println("Ignoring INT 0x68 from IFSHLP.SYS");
                    return true;
                }
                /*
                 * Ditto for WDEB386 itself, which presumably wants to avoid loading on top of itself.
                 */
                if (cpu.getLong((cpu.segCS.sel << 4) + 0x5F) == 0x42454457) {
                    if (DEBUG) this.println("Ignoring INT 0x68 from WDEB386.EXE");
                    return true;
                }
                /*
                 * We're only going to respond to this function if no one else did, in which case, we'll set
                 * fWinDbgRM to true and handle additional notifications.
                 */
                cpu.addIntReturn(addr, function(dbg) {
                    return function onInt68Return(nLevel) {
                        if ((cpu.regEAX & 0xffff) != Interrupts.WINDBGRM.LOADED) {
                            cpu.regEAX = (cpu.regEAX & ~0xffff) | Interrupts.WINDBGRM.LOADED;
                            dbg.printMessage("INT 0x68 handling enabled", Messages.MEM);
                            /*
                             * If we turn on INT 0x68 handling, we must also turn on INT 0x41 handling,
                             * because Windows assumes that the latter handler exists whenever the former does.
                             */
                            dbg.fWinDbg = dbg.fWinDbgRM = true;
                        } else {
                            dbg.printMessage("INT 0x68 monitoring enabled", Messages.MEM);
                            dbg.fWinDbgRM = false;
                        }
                    };
                }(this));
            }
            return true;
        }

        /*
         * NOTE: If this.fWinDbgRM is true, then all cases should return false, because we're taking full
         * responsibility for all requests (don't assume there's valid interrupt handler inside the machine).
         */
        switch(AH) {
        case Interrupts.WINDBGRM.IS_LOADED:         // 0x43
            if (this.fWinDbgRM) {
                cpu.regEAX = (cpu.regEAX & ~0xffff) | Interrupts.WINDBGRM.LOADED;
            }
            break;

        case Interrupts.WINDBGRM.PREP_PMODE:        // 0x44
            if (this.fWinDbgRM) {
                /*
                 * Use our fancy new "call break" mechanism to obtain a special address that will
                 * trap all calls, routing control to the specified function (callWindowsDebuggerPMInit).
                 */
                var a = cpu.segCS.addCallBreak(this.callWindowsDebuggerPMInit.bind(this));
                if (a) {
                    cpu.regEDI = a[0];              // ES:EDI receives the "call break" address
                    cpu.setES(a[1]);
                }
            }
            break;

        case Interrupts.WINDBGRM.FREESEG:           // 0x48
            this.removeSegmentInfo(BX);
            break;

        case Interrupts.WINDBGRM.REMOVESEGS:        // 0x4F
            /*
             * TODO: This probably just signals the end of module loading; nothing is required, but we should
             * clean up whatever we can....
             */
            break;

        case Interrupts.WINDBGRM.LOADSEG:           // 0x50
            if (AL == 0x20) {
                /*
                 *  Real-mode EXE
                 *  CX == paragraph
                 *  ES:DI -> module name
                 */
                this.addSegmentInfo(this.newAddr(DI, ES), 0, CX, true, !!this.fWinDbgRM);
            }
            else if (AL < 0x80) {
                /*
                 *  AL == segment type:
                 *      0x00    code selector
                 *      0x01    data selector
                 *      0x10    code segment
                 *      0x11    data segment
                 *      0x40    code segment & sel
                 *      0x41    data segment & sel
                 *  BX == segment #
                 *  CX == actual segment/selector
                 *  DX == actual selector (if 0x40 or 0x41)
                 *  ES:DI -> module name
                 */
                this.addSegmentInfo(this.newAddr(DI, ES), BX+1, (AL & 0x40)? DX : CX, !(AL & 0x1), !!this.fWinDbgRM);
            }
            else {
                /*
                 *  AL == segment type:
                 *      0x80    device driver code seg
                 *      0x81    device driver data seg
                 *  ES:DI -> D386_Device_Params structure (see addSectionInfo() for details)
                 */
                this.addSectionInfo(this.newAddr(DI, ES), !(AL & 0x1), !!this.fWinDbgRM);
            }
            if (this.fWinDbgRM) {
                cpu.regEAX = (cpu.regEAX & ~0xff) | 0x01;
            }
            break;

        default:
            if (DEBUG && this.fWinDbgRM) {
                this.println("INT 0x68: " + Str.toHexByte(AH));
            }
            break;
        }

        return !this.fWinDbgRM;
    }

    /**
     * callWindowsDebuggerPMInit()
     *
     * CONDITIONAL: if (Interrupts.WINDBGRM.ENABLED)
     *
     * This intercepts calls to the Windows Debugger "PMInit" interface; eg:
     *
     *      AL = function code
     *
     *          0 - initialize IDT
     *              ES:EDI points to protected mode IDT
     *
     *          1 - initialize page checking
     *              BX = physical selector
     *              ECX = linear bias
     *
     *          2 - specify that debug queries are supported
     *
     *          3 - initialize spare PTE
     *              EBX = linear address of spare PTE
     *              EDX = linear address the PTE represents
     *
     *          4 - set Enter/Exit VMM routine address
     *              EBX = Enter VMM routine address
     *              ECX = Exit VMM routine address
     *              EDX = $_Debug_Out_Service address
     *              ESI = $_Trace_Out_Service address
     *              The VMM enter/exit routines must return with a retfd
     *
     *          5 - get debugger size/physical address
     *              returns: AL = 0 (don't call AL = 1)
     *              ECX = size in bytes
     *              ESI = starting physical code/data address
     *
     *          6 - set debugger base/initialize spare PTE
     *              EBX = linear address of spare PTE
     *              EDX = linear address the PTE represents
     *              ESI = starting linear address of debug code/data
     *
     *          7 - enable memory context functions
     *
     * @this {DebuggerX86}
     * @return {boolean} (must always return false to skip the call, because the call is using a CALLBREAK address)
     */
    callWindowsDebuggerPMInit()
    {
        var cpu = this.cpu;
        var AL = cpu.regEAX & 0xff;
        if (MAXDEBUG) this.println("INT 0x68 callback: " + Str.toHexByte(AL));
        if (AL == 5) {
            cpu.regECX = cpu.regESI = 0;                // our in-machine debugger footprint is zero
            cpu.regEAX = (cpu.regEAX & ~0xff) | 0x01;   // TODO: Returning a "don't call" response sounds good, but what does it REALLY mean?
        }
        return false;
    }

    /**
     * setBinding(sHTMLType, sBinding, control, sValue)
     *
     * @this {DebuggerX86}
     * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "debugInput")
     * @param {HTMLElement} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sHTMLType, sBinding, control, sValue)
    {
        var dbg = this;
        switch (sBinding) {

        case "debugInput":
            var controlInput = /** @type {HTMLInputElement} */ (control);
            this.bindings[sBinding] = controlInput;
            this.controlDebug = controlInput;
            /*
             * For halted machines, this is fine, but for auto-start machines, it can be annoying.
             *
             *      controlInput.focus();
             */
            controlInput.onkeydown = function onKeyDownDebugInput(event) {
                var sCmd;
                if (event.keyCode == Keys.KEYCODE.CR) {
                    sCmd = controlInput.value;
                    controlInput.value = "";
                    dbg.doCommands(sCmd, true);
                }
                else if (event.keyCode == Keys.KEYCODE.ESC) {
                    controlInput.value = sCmd = "";
                }
                else {
                    if (event.keyCode == Keys.KEYCODE.UP) {
                        sCmd = dbg.getPrevCommand();
                    }
                    else if (event.keyCode == Keys.KEYCODE.DOWN) {
                        sCmd = dbg.getNextCommand();
                    }
                    if (sCmd != null) {
                        var cch = sCmd.length;
                        controlInput.value = sCmd;
                        controlInput.setSelectionRange(cch, cch);
                    }
                }
                if (sCmd != null && event.preventDefault) event.preventDefault();
            };
            return true;

        case "debugEnter":
            this.bindings[sBinding] = control;
            Web.onClickRepeat(
                control,
                500, 100,
                function onClickDebugEnter(fRepeat) {
                    if (dbg.controlDebug) {
                        var sCmds = dbg.controlDebug.value;
                        dbg.controlDebug.value = "";
                        dbg.doCommands(sCmds, true);
                        return true;
                    }
                    if (DEBUG) dbg.log("no debugger input buffer");
                    return false;
                }
            );
            return true;

        case "step":
            this.bindings[sBinding] = control;
            Web.onClickRepeat(
                control,
                500, 100,
                function onClickStep(fRepeat) {
                    var fCompleted = false;
                    if (!dbg.isBusy(true)) {
                        dbg.setBusy(true);
                        fCompleted = dbg.stepCPU(fRepeat? 1 : 0);
                        dbg.setBusy(false);
                    }
                    return fCompleted;
                }
            );
            return true;

        default:
            break;
        }
        return false;
    }

    /**
     * updateFocus()
     *
     * @this {DebuggerX86}
     */
    updateFocus()
    {
        if (this.controlDebug) this.controlDebug.focus();
    }

    /**
     * getCPUMode()
     *
     * @this {DebuggerX86}
     * @return {boolean} (true if protected mode, false if not)
     */
    getCPUMode()
    {
        return !!(this.cpu && (this.cpu.regCR0 & X86.CR0.MSW.PE) && !(this.cpu.regPS & X86.PS.VM));
    }

    /**
     * getAddressType()
     *
     * @this {DebuggerX86}
     * @return {number}
     */
    getAddressType()
    {
        return this.getCPUMode()? DebuggerX86.ADDRTYPE.PROT : DebuggerX86.ADDRTYPE.REAL;
    }

    /**
     * getSegment(sel, type)
     *
     * If the selector matches that of any of the CPU segment registers, then return the CPU's segment
     * register, instead of using our own segDebugger segment register.  This makes it possible for us to
     * see what the CPU is seeing at certain critical junctures, such as after an LMSW instruction has
     * switched the processor from real to protected mode.  Actually loading the selector from the GDT/LDT
     * should be done only as a last resort.
     *
     * @this {DebuggerX86}
     * @param {number|null|undefined} sel
     * @param {number} [type] (defaults to getAddressType())
     * @return {X86Seg|null} seg
     */
    getSegment(sel, type)
    {
        var typeDefault = this.getAddressType();

        if (!type) type = typeDefault;

        if (type == typeDefault) {
            if (sel === this.cpu.getCS()) return this.cpu.segCS;
            if (sel === this.cpu.getDS()) return this.cpu.segDS;
            if (sel === this.cpu.getES()) return this.cpu.segES;
            if (sel === this.cpu.getSS()) return this.cpu.segSS;
            if (I386 && this.cpu.model >= X86.MODEL_80386) {
                if (sel === this.cpu.getFS()) return this.cpu.segFS;
                if (sel === this.cpu.getGS()) return this.cpu.segGS;
            }
            /*
             * Even if nSuppressBreaks is set, we'll allow the call in real-mode,
             * because a loadReal() request using segDebugger should generally be safe.
             */
            if (this.nSuppressBreaks && type == DebuggerX86.ADDRTYPE.PROT || !this.segDebugger) return null;
        }
        var seg = this.segDebugger;
        if (type != DebuggerX86.ADDRTYPE.PROT) {
            seg.loadReal(sel);
            seg.limit = 0xffff;         // although an ACTUAL real-mode segment load would not modify the limit,
            seg.offMax = 0x10000;       // proper segDebugger operation requires that we update the limit ourselves
        } else {
            seg.probeDesc(sel);
        }
        return seg;
    }

    /**
     * getAddr(dbgAddr, fWrite, nb)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86|null|undefined} dbgAddr
     * @param {boolean} [fWrite]
     * @param {number} [nb] number of bytes to check (1, 2 or 4); default is 1
     * @return {number} is the corresponding linear address, or X86.ADDR_INVALID
     */
    getAddr(dbgAddr, fWrite, nb)
    {
        /*
         * Some addresses (eg, breakpoint addresses) save their original linear address in dbgAddr.addr,
         * so we want to use that if it's there, but otherwise, dbgAddr is assumed to be a segmented address
         * whose linear address must always be (re)calculated based on current machine state (mode, active
         * descriptor tables, etc).
         */
        var addr = dbgAddr && dbgAddr.addr;
        if (addr == null) {
            addr = X86.ADDR_INVALID;
            if (dbgAddr) {
                /*
                 * TODO: We should try to cache the seg inside dbgAddr, to avoid unnecessary calls to getSegment().
                 */
                var seg = this.getSegment(dbgAddr.sel, dbgAddr.type);
                if (seg) {
                    if (!fWrite) {
                        addr = seg.checkReadDebugger(dbgAddr.off || 0, nb || 1);
                    } else {
                        addr = seg.checkWriteDebugger(dbgAddr.off || 0, nb || 1);
                    }
                    dbgAddr.addr = addr;
                }
            }
        }
        return addr;
    }

    /**
     * getByte(dbgAddr, inc)
     *
     * We must route all our memory requests through the CPU now, in case paging is enabled.
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {number} [inc]
     * @return {number}
     */
    getByte(dbgAddr, inc)
    {
        var b = 0xff;
        var addr = this.getAddr(dbgAddr, false, 1);
        if (addr !== X86.ADDR_INVALID) {
            /*
             * TODO: Determine what we should do about the fact that we're masking any error from probeAddr()
             */
            b = this.cpu.probeAddr(addr, 1, dbgAddr.type == DebuggerX86.ADDRTYPE.PHYSICAL) | 0;
            if (inc) this.incAddr(dbgAddr, inc);
        }
        return b;
    }

    /**
     * getWord(dbgAddr, fAdvance)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {boolean} [fAdvance]
     * @return {number}
     */
    getWord(dbgAddr, fAdvance)
    {
        return dbgAddr.fData32? this.getLong(dbgAddr, fAdvance? 4 : 0) : this.getShort(dbgAddr, fAdvance? 2 : 0);
    }

    /**
     * getShort(dbgAddr, inc)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {number} [inc]
     * @return {number}
     */
    getShort(dbgAddr, inc)
    {
        var w = 0xffff;
        var addr = this.getAddr(dbgAddr, false, 2);
        if (addr !== X86.ADDR_INVALID) {
            /*
             * TODO: Determine what we should do about the fact that we're masking any error from probeAddr()
             */
            w = this.cpu.probeAddr(addr, 2, dbgAddr.type == DebuggerX86.ADDRTYPE.PHYSICAL) | 0;
            if (inc) this.incAddr(dbgAddr, inc);
        }
        return w;
    }

    /**
     * getLong(dbgAddr, inc)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {number} [inc]
     * @return {number}
     */
    getLong(dbgAddr, inc)
    {
        var l = -1;
        var addr = this.getAddr(dbgAddr, false, 4);
        if (addr !== X86.ADDR_INVALID) {
            /*
             * TODO: Determine what we should do about the fact that we're masking any error from probeAddr()
             */
            l = this.cpu.probeAddr(addr, 4, dbgAddr.type == DebuggerX86.ADDRTYPE.PHYSICAL) | 0;
            if (inc) this.incAddr(dbgAddr, inc);
        }
        return l;
    }

    /**
     * setByte(dbgAddr, b, inc, fNoUpdate)
     *
     * NOTE: If you need to patch a ROM, you MUST use the ROM location's physical address.
     *
     * WARNING: Be careful with the editing commands that use function, because we don't have a safe
     * counterpart to cpu.probeAddr().
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {number} b
     * @param {number} [inc]
     * @param {boolean} [fNoUpdate] (when doing a large number of setByte() calls, set this to true and call cpu.updateCPU() when you're done)
     */
    setByte(dbgAddr, b, inc, fNoUpdate)
    {
        var addr = this.getAddr(dbgAddr, true, 1);
        if (addr !== X86.ADDR_INVALID) {
            if (dbgAddr.type != DebuggerX86.ADDRTYPE.PHYSICAL) {
                this.cpu.setByte(addr, b);
            } else {
                this.bus.setByteDirect(addr, b);
            }
            if (inc) this.incAddr(dbgAddr, inc);
            if (!fNoUpdate) this.cpu.updateCPU(true);   // we set fForce to true in case video memory was the target
        }
    }

    /**
     * setShort(dbgAddr, w, inc)
     *
     * NOTE: If you need to patch a ROM, you MUST use the ROM location's physical address.
     *
     * WARNING: Be careful with the editing commands that use function, because we don't have a safe
     * counterpart to cpu.probeAddr().
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {number} w
     * @param {number} [inc]
     */
    setShort(dbgAddr, w, inc)
    {
        var addr = this.getAddr(dbgAddr, true, 2);
        if (addr !== X86.ADDR_INVALID) {
            if (dbgAddr.type != DebuggerX86.ADDRTYPE.PHYSICAL) {
                this.cpu.setShort(addr, w);
            } else {
                this.bus.setShortDirect(addr, w);
            }
            if (inc) this.incAddr(dbgAddr, inc);
            this.cpu.updateCPU(true);           // we set fForce to true in case video memory was the target
        }
    }

    /**
     * newAddr(off, sel, addr, type, fData32, fAddr32)
     *
     * Returns a NEW DbgAddrX86 object, initialized with specified values and/or defaults.
     *
     * @this {DebuggerX86}
     * @param {number|null|undefined} [off] (default is zero)
     * @param {number|null|undefined} [sel] (default is undefined)
     * @param {number|null|undefined} [addr] (default is undefined)
     * @param {number} [type] (default is based on current CPU mode)
     * @param {boolean} [fData32] (default is the current CPU operand size)
     * @param {boolean} [fAddr32] (default is the current CPU address size)
     * @return {DbgAddrX86}
     */
    newAddr(off, sel, addr, type, fData32, fAddr32)
    {
        return this.setAddr({}, off, sel, addr, type, fData32, fAddr32);
    }

    /**
     * getAddrPrefix(dbgAddr)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @return {string}
     */
    getAddrPrefix(dbgAddr)
    {
        var ch;

        switch (dbgAddr.type) {
        case DebuggerX86.ADDRTYPE.REAL:
        case DebuggerX86.ADDRTYPE.V86:
            ch = '&';
            break;
        case DebuggerX86.ADDRTYPE.PROT:
            ch = '#';
            break;
        case DebuggerX86.ADDRTYPE.LINEAR:
            ch = '%';
            break;
        case DebuggerX86.ADDRTYPE.PHYSICAL:
            ch = '%%';
            break;
        default:
            ch = dbgAddr.sel? '' : '%';
            break;
        }
        return ch;
    }

    /**
     * setAddr(dbgAddr, off, sel, addr, type, fData32, fAddr32)
     *
     * Updates an EXISTING DbgAddrX86 object, initialized with specified values and/or defaults.
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {number|null|undefined} [off] (default is zero)
     * @param {number|null|undefined} [sel] (default is undefined)
     * @param {number|null|undefined} [addr] (default is undefined)
     * @param {number} [type] (default is based on current CPU mode)
     * @param {boolean} [fData32] (default is the current CPU operand size)
     * @param {boolean} [fAddr32] (default is the current CPU address size)
     * @return {DbgAddrX86}
     */
    setAddr(dbgAddr, off, sel, addr, type, fData32, fAddr32)
    {
        dbgAddr.off = off || 0;
        dbgAddr.sel = sel;
        dbgAddr.addr = addr;
        dbgAddr.type = type || this.getAddressType();
        dbgAddr.fData32 = (fData32 != null)? fData32 : !!(this.cpu && this.cpu.segCS.sizeData == 4);
        dbgAddr.fAddr32 = (fAddr32 != null)? fAddr32 : !!(this.cpu && this.cpu.segCS.sizeAddr == 4);
        dbgAddr.fTempBreak = false;
        return dbgAddr;
    }

    /**
     * packAddr(dbgAddr)
     *
     * Packs a DbgAddrX86 object into an Array suitable for saving in a machine state object.
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @return {Array}
     */
    packAddr(dbgAddr)
    {
        return [dbgAddr.off, dbgAddr.sel, dbgAddr.addr, dbgAddr.fTempBreak, dbgAddr.fData32, dbgAddr.fAddr32, dbgAddr.cOverrides, dbgAddr.fComplete];
    }

    /**
     * unpackAddr(aAddr)
     *
     * Unpacks a DbgAddrX86 object from an Array created by packAddr() and restored from a saved machine state.
     *
     * @this {DebuggerX86}
     * @param {Array} aAddr
     * @return {DbgAddrX86}
     */
    unpackAddr(aAddr)
    {
        return {off: aAddr[0], sel: aAddr[1], addr: aAddr[2], fTempBreak: aAddr[3], fData32: aAddr[4], fAddr32: aAddr[5], cOverrides: aAddr[6], fComplete: aAddr[7]};
    }

    /**
     * checkLimit(dbgAddr, fUpdate)
     *
     * Used by incAddr() and parseAddr() to ensure that the (updated) dbgAddr offset is within segment bounds.
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {boolean} [fUpdate] (true to update segment info)
     * @return {boolean}
     */
    checkLimit(dbgAddr, fUpdate)
    {
        if (dbgAddr.sel != null) {
            var seg = this.getSegment(dbgAddr.sel, dbgAddr.type);
            if (seg) {
                var off = dbgAddr.off & seg.maskAddr;
                if (!seg.fExpDown) {
                    if ((off >>> 0) >= seg.offMax) {
                        return false;
                    }
                }
                else {
                    if ((off >>> 0) < seg.offMax) {
                        return false;
                    }
                }
                if (fUpdate) {
                    dbgAddr.off = off;
                    dbgAddr.fData32 = (seg.sizeData == 4);
                    dbgAddr.fAddr32 = (seg.sizeAddr == 4);
                }
            }
        }
        return true;
    }

    /**
     * parseAddr(sAddr, fCode, fNoChecks, fQuiet)
     *
     * As discussed above, dbgAddr variables contain one or more of: off, sel, and addr.  They represent
     * a segmented address (sel:off) when sel is defined or a linear address (addr) when sel is undefined
     * (or null).
     *
     * To create a segmented address, specify two values separated by ':'; for a linear address, use
     * a '%' prefix.  We check for ':' after '%', so if for some strange reason you specify both, the
     * address will be treated as segmented, not linear.
     *
     * The '%' syntax is similar to that used by the Windows 80386 kernel debugger (wdeb386) for linear
     * addresses.  If/when we add support for processors with page tables, we will likely adopt the same
     * convention for linear addresses and provide a different syntax (eg, "%%") physical memory references.
     *
     * Address evaluation and validation (eg, range checks) are no longer performed at this stage.  That's
     * done later, by getAddr(), which returns X86.ADDR_INVALID for invalid segments, out-of-range offsets,
     * etc.  The Debugger's low-level get/set memory functions verify all getAddr() results, but even if an
     * invalid address is passed through to the Bus memory interfaces, the address will simply be masked with
     * Bus.nBusLimit; in the case of X86.ADDR_INVALID, that will generally refer to the top of the physical
     * address space.
     *
     * @this {DebuggerX86}
     * @param {string|undefined} sAddr
     * @param {boolean} [fCode] (true if target is code, false if target is data)
     * @param {boolean} [fNoChecks] (true when setting breakpoints that may not be valid now, but will be later)
     * @param {boolean} [fQuiet]
     * @return {DbgAddrX86|null|undefined}
     */
    parseAddr(sAddr, fCode, fNoChecks, fQuiet)
    {
        var dbgAddr;
        var dbgAddrNext = (fCode? this.dbgAddrNextCode : this.dbgAddrNextData);

        var type = fNoChecks? DebuggerX86.ADDRTYPE.NONE : dbgAddrNext.type;
        var off = dbgAddrNext.off, sel = dbgAddrNext.sel, addr = dbgAddrNext.addr;

        if (sAddr !== undefined) {

            sAddr = this.parseReference(sAddr);

            var ch = sAddr.charAt(0);
            var iColon = sAddr.indexOf(':');

            switch(ch) {
            case '&':
                type = DebuggerX86.ADDRTYPE.REAL;
                break;
            case '#':
                type = DebuggerX86.ADDRTYPE.PROT;
                break;
            case '%':
                type = DebuggerX86.ADDRTYPE.LINEAR;
                ch = sAddr.charAt(1);
                if (ch == '%') {
                    type = DebuggerX86.ADDRTYPE.PHYSICAL;
                    ch += ch;
                }
                off = addr = 0;
                sel = null;             // we still have code that relies on this crutch, instead of the type field
                break;
            default:
                if (iColon >= 0) type = DebuggerX86.ADDRTYPE.NONE;
                ch = '';
                break;
            }

            if (ch) {
                sAddr = sAddr.substr(ch.length);
                iColon -= ch.length;
            }

            dbgAddr = this.findSymbolAddr(sAddr);
            if (dbgAddr) return dbgAddr;

            if (iColon < 0) {
                if (sel != null) {
                    off = this.parseExpression(sAddr, fQuiet);
                    addr = null;
                } else {
                    addr = this.parseExpression(sAddr, fQuiet);
                    if (addr == null) off = null;
                }
            }
            else {
                sel = this.parseExpression(sAddr.substring(0, iColon), fQuiet);
                off = this.parseExpression(sAddr.substring(iColon + 1), fQuiet);
                addr = null;
            }
        }

        if (off != null) {
            dbgAddr = this.newAddr(off, sel, addr, type);
            if (!fNoChecks && !this.checkLimit(dbgAddr, true)) {
                this.println("invalid offset: " + this.toHexAddr(dbgAddr));
                dbgAddr = null;
            }
        }
        return dbgAddr;
    }

    /**
     * parseAddrOptions(dbgAddr, sOptions)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {string} [sOptions]
     */
    parseAddrOptions(dbgAddr, sOptions)
    {
        if (sOptions) {
            var a = sOptions.match(/(['"])(.*?)\1/);
            if (a) {
                dbgAddr.aCmds = this.parseCommand(dbgAddr.sCmd = a[2]);
            }
        }
    }

    /**
     * parseAddrReference(s, sAddr)
     *
     * Returns the given string with the given address references replaced with the contents of the address.
     *
     * @this {Debugger}
     * @param {string} s
     * @param {string} sAddr
     * @return {string}
     */
    parseAddrReference(s, sAddr)
    {
        var dbgAddr = this.parseAddr(sAddr);
        return s.replace('[' + sAddr + ']', dbgAddr? Str.toHex(this.getWord(dbgAddr), dbgAddr.fData32? 8 : 4) : "undefined");
    }

    /**
     * incAddr(dbgAddr, inc)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {number} [inc] contains value to increment dbgAddr by (default is 1)
     */
    incAddr(dbgAddr, inc)
    {
        inc = inc || 1;
        if (dbgAddr.addr != null) {
            dbgAddr.addr += inc;
        }
        if (dbgAddr.sel != null) {
            dbgAddr.off += inc;
            if (!this.checkLimit(dbgAddr)) {
                dbgAddr.off = 0;
                dbgAddr.addr = null;
            }
        }
    }

    /**
     * toHexOffset(off, sel, fAddr32)
     *
     * @this {DebuggerX86}
     * @param {number|null|undefined} [off]
     * @param {number|null|undefined} [sel]
     * @param {boolean} [fAddr32] is true for 32-bit ADDRESS size
     * @return {string} the hex representation of off (or sel:off)
     */
    toHexOffset(off, sel, fAddr32)
    {
        if (sel != null) {
            return Str.toHex(sel, 4) + ':' + Str.toHex(off, (off & ~0xffff) || fAddr32? 8 : 4);
        }
        return Str.toHex(off);
    }

    /**
     * toHexAddr(dbgAddr)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @return {string} the hex representation of the address
     */
    toHexAddr(dbgAddr)
    {
        var ch = this.getAddrPrefix(dbgAddr);
        /*
         * TODO: Revisit the decision to check sel == null; I would rather see these decisions based on type.
         */
        return (dbgAddr.type >= DebuggerX86.ADDRTYPE.LINEAR || dbgAddr.sel == null)? (ch + Str.toHex(dbgAddr.addr)) : (ch + this.toHexOffset(dbgAddr.off, dbgAddr.sel, dbgAddr.fAddr32));
    }

    /**
     * getSZ(dbgAddr, cchMax)
     *
     * Gets zero-terminated (aka "ASCIIZ") string from dbgAddr.  It also stops at the first '$', in case this is
     * a '$'-terminated string -- mainly because I'm lazy and didn't feel like writing a separate get() function.
     * Yes, a zero-terminated string containing a '$' will be prematurely terminated, and no, I don't care.
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {number} [cchMax] (default is 256)
     * @return {string} (and dbgAddr advanced past the terminating zero)
     */
    getSZ(dbgAddr, cchMax)
    {
        var s = "";
        cchMax = cchMax || 256;
        while (s.length < cchMax) {
            var b = this.getByte(dbgAddr, 1);
            if (!b || b == 0x24 || b >= 127) break;
            s += (b >= 32? String.fromCharCode(b) : '.');
        }
        return s;
    }

    /**
     * dumpBackTrack(asArgs)
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     */
    dumpBackTrack(asArgs)
    {
        var sInfo = "no information";
        if (BACKTRACK) {
            var sAddr = asArgs[0];
            var dbgAddr = this.parseAddr(sAddr, true, true, true);
            if (dbgAddr) {
                var addr = this.getAddr(dbgAddr);
                if (dbgAddr.type != DebuggerX86.ADDRTYPE.PHYSICAL) {
                    var pageInfo = this.getPageInfo(addr);
                    if (pageInfo) {
                        dbgAddr.addr = pageInfo.addrPhys;
                        dbgAddr.type = DebuggerX86.ADDRTYPE.PHYSICAL;
                    }
                }
                sInfo = this.toHexAddr(dbgAddr) + ": " + (this.bus.getSymbol(addr, true) || sInfo);
            } else {
                var component, componentPrev = null;
                while (component = this.cmp.getMachineComponent("Disk", componentPrev)) {
                    var aInfo = component.getSymbolInfo(sAddr);
                    if (aInfo.length) {
                        sInfo = "";
                        for (var i in aInfo) {
                            var a = aInfo[i];
                            if (sInfo) sInfo += '\n';
                            sInfo += a[0] + ": " + a[1] + ' ' + Str.toHex(a[2], 4) + ':' + Str.toHex(a[3], 4) + " len " + Str.toHexWord(a[4]);
                        }
                    }
                    componentPrev = component;
                }
            }
        }
        return sInfo;
    }

    /**
     * dumpBlocks(aBlocks, sAddr, fLinear)
     *
     * @this {DebuggerX86}
     * @param {Array} aBlocks
     * @param {string} [sAddr] (optional block address)
     * @param {boolean} [fLinear] (true if linear, physical otherwise)
     */
    dumpBlocks(aBlocks, sAddr, fLinear)
    {
        var addr = 0, i = 0, n = aBlocks.length;

        if (sAddr) {
            addr = this.getAddr(this.parseAddr(sAddr));
            if (addr === X86.ADDR_INVALID) {
                this.println("invalid address: " + sAddr);
                return;
            }
            i = addr >>> this.cpu.nBlockShift;
            n = 1;
        }

        this.println("blockid   " + (fLinear? "linear  " : "physical") + "   blockaddr   used    size    type");
        this.println("--------  ---------  ----------  ------  ------  ----");

        var typePrev = -1, cPrev = 0;
        while (n--) {
            var block = aBlocks[i];
            /*
             * We need to replicate a portion of what probeAddr() does, which is to "peek" at the
             * underlying physical block of any UNPAGED block.  An UNPAGED block doesn't imply
             * that the page is invalid, but merely that the CPU has not yet been asked to perform
             * the page directory/page table lookup.
             *
             * To do that, we use the same mapPageBlock() interface that the CPU uses, with fSuppress
             * set, so that it doesn't 1) generate a fault or 2) modify the block.  Blocks should only
             * "validated" when a CPU operation touches the corresponding page, and they should be only
             * be "invalidated" when the CPU wants to flush the TLB (ie, whenever CR3 is updated).
             */
            if (block && block.type == Memory.TYPE.UNPAGED) {
                block = this.cpu.mapPageBlock(addr, false, true);
            }
            if (block.type == typePrev) {
                if (!cPrev++) this.println("...");
            } else {
                typePrev = block.type;
                var sType = Memory.TYPE.NAMES[typePrev];
                if (typePrev == Memory.TYPE.PAGED) {
                    block = block.blockPhys;
                    this.assert(block);
                    sType += " -> " + Memory.TYPE.NAMES[block.type];
                }
                if (block) {
                    this.println(Str.toHex(block.id, 8) + "  %" + Str.toHex(i << this.cpu.nBlockShift, 8) + "  %%" + Str.toHex(block.addr, 8) + "  " + Str.toHexWord(block.used) + "  " + Str.toHexWord(block.size) + "  " + sType);
                }
                if (typePrev != Memory.TYPE.NONE && typePrev != Memory.TYPE.UNPAGED) typePrev = -1;
                cPrev = 0;
            }
            addr += this.cpu.nBlockSize;
            i++;
        }
    }

    /**
     * dumpBus(asArgs)
     *
     * Dumps Bus allocations.
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs (asArgs[0] is an optional block address)
     */
    dumpBus(asArgs)
    {
        this.dumpBlocks(this.cpu.aBusBlocks, asArgs[0]);
    }

    /**
     * dumpDOS(asArgs)
     *
     * Dumps DOS MCBs (Memory Control Blocks).
     *
     * TODO: Add some code to detect the current version of DOS (if any) and locate the first MCB automatically.
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     */
    dumpDOS(asArgs)
    {
        var mcb;
        var sMCB = asArgs[0];
        if (sMCB) {
            mcb = this.parseValue(sMCB);
        }
        if (mcb === undefined) {
            this.println("invalid MCB");
            return;
        }
        this.println("dumpMCB(" + Str.toHexWord(mcb) + ')');
        while (mcb) {
            var dbgAddr = this.newAddr(0, mcb);
            var bSig = this.getByte(dbgAddr, 1);
            var wPID = this.getShort(dbgAddr, 2);
            var wParas = this.getShort(dbgAddr, 5);
            if (bSig != 0x4D && bSig != 0x5A) break;
            this.println(this.toHexOffset(0, mcb) + ": '" + String.fromCharCode(bSig) + "' PID=" + Str.toHexWord(wPID) + " LEN=" + Str.toHexWord(wParas) + ' "' + this.getSZ(dbgAddr, 8) + '"');
            mcb += 1 + wParas;
        }
    }

    /**
     * dumpIDT(asArgs)
     *
     * Dumps an IDT vector entry.
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     */
    dumpIDT(asArgs)
    {
        var sIDT = asArgs[0];

        if (!sIDT) {
            this.println("no IDT vector");
            return;
        }

        var nIDT = this.parseValue(sIDT);
        if (nIDT === undefined || nIDT < 0 || nIDT > 255) {
            this.println("invalid vector: " + sIDT);
            return;
        }

        var ch = '&', fProt = this.cpu.getProtMode(), fAddr32 = false;
        var addrIDT = this.cpu.addrIDT + (nIDT << (fProt? 3 : 2));
        var off = this.cpu.getShort(addrIDT + X86.DESC.LIMIT.OFFSET);
        var sel = this.cpu.getShort(addrIDT + X86.DESC.BASE.OFFSET);
        if (fProt) {
            ch = '#';
            var acc = this.cpu.getShort(addrIDT + X86.DESC.ACC.OFFSET);
            if (acc & X86.DESC.ACC.TYPE.NONSEG_386) {
                fAddr32 = true;
                off |= this.cpu.getShort(addrIDT + X86.DESC.EXT.OFFSET) << 16;
            }
        }

        this.println("dumpIDT(" + Str.toHexWord(nIDT) + "): " + ch + Str.toHex(sel, 4) + ':' + Str.toHex(off, fAddr32? 8 : 4));
    }

    /**
     * dumpMem(asArgs)
     *
     * Dumps page allocations.
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs (asArgs[0] is an optional block address)
     */
    dumpMem(asArgs)
    {
        this.dumpBlocks(this.cpu.aMemBlocks, asArgs[0], this.cpu.aMemBlocks !== this.cpu.aBusBlocks);
    }

    /**
     * getPageEntry(addrPE, lPE, fPTE)
     *
     * @this {DebuggerX86}
     * @param {number} addrPE
     * @param {number} lPE
     * @param {boolean} [fPTE] (true if the entry is a PTE, false if it's a PDE)
     * @return {string}
     */
    getPageEntry(addrPE, lPE, fPTE)
    {
        var s = Str.toHex(addrPE) + ' ' + Str.toHex(lPE) + ' ';
        s += (fPTE && (lPE & X86.PTE.DIRTY))? 'D' : '-';
        s += (lPE & X86.PTE.ACCESSED)? 'A' : '-';
        s += (lPE & X86.PTE.USER)? 'U' : 'S';
        s += (lPE & X86.PTE.READWRITE)? 'W' : 'R';
        s += (lPE & X86.PTE.PRESENT)? 'P' : 'N';
        return s;
    }

    /**
     * getPageInfo(addr)
     *
     * @this {DebuggerX86}
     * @param {number} addr
     * @return {Object|null}
     */
    getPageInfo(addr)
    {
        var pageInfo = null;
        if (I386 && this.cpu.model >= X86.MODEL_80386) {
            var bus = this.bus;
            /*
             * Here begins code remarkably similar to mapPageBlock() (with fSuppress set).
             */
            pageInfo = {};
            pageInfo.offPDE = (addr & X86.LADDR.PDE.MASK) >>> X86.LADDR.PDE.SHIFT;
            pageInfo.addrPDE = this.cpu.regCR3 + pageInfo.offPDE;
            pageInfo.blockPDE = bus.aMemBlocks[(pageInfo.addrPDE & bus.nBusMask) >>> bus.nBlockShift];
            pageInfo.lPDE = pageInfo.blockPDE.readLong(pageInfo.offPDE);
            pageInfo.offPTE = (addr & X86.LADDR.PTE.MASK) >>> X86.LADDR.PTE.SHIFT;
            pageInfo.addrPTE = (pageInfo.lPDE & X86.PTE.FRAME) + pageInfo.offPTE;
            pageInfo.blockPTE = bus.aMemBlocks[(pageInfo.addrPTE & bus.nBusMask) >>> bus.nBlockShift];
            pageInfo.lPTE = pageInfo.blockPTE.readLong(pageInfo.offPTE);
            pageInfo.addrPhys = (pageInfo.lPTE & X86.PTE.FRAME) + (addr & X86.LADDR.OFFSET);
            //var blockPhys = bus.aMemBlocks[(addrPhys & bus.nBusMask) >>> bus.nBlockShift];
        }
        return pageInfo;
    }

    /**
     * dumpPage(asArgs)
     *
     * Dumps page table information about the given linear address.
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     */
    dumpPage(asArgs)
    {
        var sAddr = asArgs[0];
        if (!sAddr) {
            this.println("missing address");
            return;
        }

        var addr = this.getAddr(this.parseAddr(sAddr));
        if (addr === X86.ADDR_INVALID) {
            this.println("invalid address: " + sAddr);
            return;
        }

        var pageInfo = this.getPageInfo(addr);
        if (!pageInfo) {
            this.println("unsupported operation");
            return;
        }

        this.println("linear     PDE addr   PDE             PTE addr   PTE             physical" );
        this.println("---------  ---------- --------        ---------- --------        ----------");
        var s = '%' + Str.toHex(addr);
        s += "  %%" + this.getPageEntry(pageInfo.addrPDE, pageInfo.lPDE);
        s += "  %%" + this.getPageEntry(pageInfo.addrPTE, pageInfo.lPTE, true);
        s += "  %%" + Str.toHex(pageInfo.addrPhys);
        this.println(s);
    }

    /**
     * dumpSel(asArgs)
     *
     * Dumps a descriptor for the given selector.
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     */
    dumpSel(asArgs)
    {
        var sSel = asArgs[0];

        if (!sSel) {
            this.println("no selector");
            return;
        }

        var sel = this.parseValue(sSel);
        if (sel === undefined) {
            this.println("invalid selector: " + sSel);
            return;
        }

        var seg = this.getSegment(sel, DebuggerX86.ADDRTYPE.PROT);
        this.println("dumpSel(" + Str.toHexWord(seg? seg.sel : sel) + "): %" + Str.toHex(seg? seg.addrDesc : null, this.cchAddr));
        if (!seg) return;

        var sType;
        var fGate = false;
        if (seg.type & X86.DESC.ACC.TYPE.SEG) {
            if (seg.type & X86.DESC.ACC.TYPE.CODE) {
                sType = "code";
                sType += (seg.type & X86.DESC.ACC.TYPE.READABLE)? ",readable" : ",execonly";
                if (seg.type & X86.DESC.ACC.TYPE.CONFORMING) sType += ",conforming";
            }
            else {
                sType = "data";
                sType += (seg.type & X86.DESC.ACC.TYPE.WRITABLE)? ",writable" : ",readonly";
                if (seg.type & X86.DESC.ACC.TYPE.EXPDOWN) sType += ",expdown";
            }
            if (seg.type & X86.DESC.ACC.TYPE.ACCESSED) sType += ",accessed";
        }
        else {
            var sysDesc = DebuggerX86.SYSDESCS[seg.type];
            if (sysDesc) {
                sType = sysDesc[0];
                fGate = sysDesc[1];
            }
        }

        if (sType && !(seg.acc & X86.DESC.ACC.PRESENT)) sType += ",not present";

        var sDump;
        if (fGate) {
            sDump = "seg=" + Str.toHexWord(seg.base & 0xffff) + " off=" + Str.toHexWord(seg.limit);
        } else {
            sDump = "base=" + Str.toHex(seg.base, this.cchAddr) + " limit=" + this.getLimitString(seg.limit);
        }
        /*
         * When we dump the EXT word, we mask off the LIMIT1619 and BASE2431 bits, because those have already
         * been incorporated into the limit and base properties of the segment register; all we care about here
         * are whether EXT contains any of the AVAIL (0x10), BIG (0x40) or LIMITPAGES (0x80) bits.
         */
        this.println(sDump + " type=" + Str.toHexByte(seg.type >> 8) + " (" + sType + ')' + " ext=" + Str.toHexWord(seg.ext & ~(X86.DESC.EXT.LIMIT1619 | X86.DESC.EXT.BASE2431)) + " dpl=" + Str.toHexByte(seg.dpl));
    }

    /**
     * dumpHistory(sPrev, sLines, sComment)
     *
     * If sLines is not a number, it can be a instruction filter.  However, for the moment, the only
     * supported filter is "call", which filters the history buffer for all CALL and RET instructions
     * from the specified previous point forward.
     *
     * @this {DebuggerX86}
     * @param {string} [sPrev] is a (decimal) number of instructions to rewind to (default is 10)
     * @param {string} [sLines] is a (decimal) number of instructions to print (default is, again, 10)
     * @param {string} [sComment] (should be either "history" or "cycles"; default is "history")
     */
    dumpHistory(sPrev, sLines, sComment = "history")
    {
        var sMore = "";
        var cHistory = 0;
        var iHistory = this.iOpcodeHistory;
        var aHistory = this.aOpcodeHistory;

        if (aHistory.length) {
            var nPrev = +sPrev || this.nextHistory;
            var nLines = +sLines || 10;

            if (isNaN(nPrev)) {
                nPrev = nLines;
            } else {
                sMore = "more ";
            }

            if (nPrev > aHistory.length) {
                this.println("note: only " + aHistory.length + " available");
                nPrev = aHistory.length;
            }

            iHistory -= nPrev;
            if (iHistory < 0) {
                /*
                 * If the dbgAddr of the last aHistory element contains a valid selector, wrap around.
                 */
                if (aHistory[aHistory.length - 1].sel == null) {
                    nPrev = iHistory + nPrev;
                    iHistory = 0;
                } else {
                    iHistory += aHistory.length;
                }
            }

            var aFilters = [];
            if (sLines == "call") {
                nLines = 100000;
                aFilters = ["CALL"];
            }

            if (sPrev !== undefined) {
                this.println(nPrev + " instructions earlier:");
            }

            /*
             * TODO: The following is necessary to prevent dumpHistory() from causing additional (or worse, recursive)
             * faults due to segmented addresses that are no longer valid, but the only alternative is to dramatically
             * increase the amount of memory used to store instruction history (eg, storing copies of all the instruction
             * bytes alongside the execution addresses).
             *
             * For now, we're living dangerously, so that our history dumps actually work.
             *
             *      this.nSuppressBreaks++;
             *
             * If you re-enable this protection, be sure to re-enable the decrement below, too.
             */
            while (nLines > 0 && iHistory != this.iOpcodeHistory) {

                var dbgAddr = aHistory[iHistory++];
                if (dbgAddr.sel == null) break;

                /*
                 * We must create a new dbgAddr from the address in aHistory, because dbgAddr was
                 * a reference, not a copy, and we don't want getInstruction() modifying the original.
                 */
                var dbgAddrNew = this.newAddr(dbgAddr.off, dbgAddr.sel, dbgAddr.addr, dbgAddr.type, dbgAddr.fData32, dbgAddr.fAddr32);

                var nSequence = nPrev--;
                if (dbgAddr.cycleCount != null && sComment == "cycles") {
                    nSequence = dbgAddr.cycleCount;
                }

                var sInstruction = this.getInstruction(dbgAddrNew, sComment, nSequence);

                if (!aFilters.length || sInstruction.indexOf(aFilters[0]) >= 0) {
                    this.println(sInstruction);
                }

                /*
                 * If there were OPERAND or ADDRESS overrides on the previous instruction, getInstruction()
                 * will have automatically disassembled additional bytes, so skip additional history entries.
                 */
                if (dbgAddrNew.cOverrides) {
                    iHistory += dbgAddrNew.cOverrides; nLines -= dbgAddrNew.cOverrides; nPrev -= dbgAddrNew.cOverrides;
                }

                if (iHistory >= aHistory.length) iHistory = 0;
                this.nextHistory = nPrev;
                cHistory++;
                nLines--;
            }
            /*
             * See comments above.
             *
             *      this.nSuppressBreaks--;
             */
        }

        if (!cHistory) {
            this.println("no " + sMore + "history available");
            this.nextHistory = undefined;
        }
    }

    /**
     * dumpTSS(asArgs)
     *
     * This dumps a TSS using the given selector.  If none is specified, the current TR is used.
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     */
    dumpTSS(asArgs)
    {
        var seg;
        var sSel = asArgs[0];

        if (!sSel) {
            seg = this.cpu.segTSS;
        } else {
            var sel = this.parseValue(sSel);
            if (sel === undefined) {
                this.println("invalid task selector: " + sSel);
                return;
            }
            seg = this.getSegment(sel, DebuggerX86.ADDRTYPE.PROT);
        }

        this.println("dumpTSS(" + Str.toHexWord(seg? seg.sel : sel) + "): %" + Str.toHex(seg? seg.base : null, this.cchAddr));
        if (!seg) return;

        var sDump = "";
        var type = seg.type & ~X86.DESC.ACC.TYPE.TSS_BUSY;
        var cch = (type == X86.DESC.ACC.TYPE.TSS286? 4 : 8);
        var aTSSFields = (type == X86.DESC.ACC.TYPE.TSS286? DebuggerX86.TSS286 : DebuggerX86.TSS386);
        var off, addr, v;
        for (var sField in aTSSFields) {
            off = aTSSFields[sField];
            addr = seg.base + off;
            v = this.cpu.probeAddr(addr, 2);
            if (type == X86.DESC.ACC.TYPE.TSS386) {
                v |= this.cpu.probeAddr(addr + 2, 2) << 16;
            }
            if (sDump) sDump += '\n';
            sDump += Str.toHexWord(off) + ' ' + Str.pad(sField + ':', 11) + Str.toHex(v, cch);
        }
        if (type == X86.DESC.ACC.TYPE.TSS386) {
            var iPort = 0;
            off = (v >>> 16);
            /*
             * We arbitrarily cut the IOPM dump off at port 0x3FF; we're not currently interested in anything above that.
             */
            while (off < seg.offMax && iPort < 0x3ff) {
                addr = seg.base + off;
                v = this.cpu.probeAddr(addr, 2);
                sDump += "\n" + Str.toHexWord(off) + " ports " + Str.toHexWord(iPort) + '-' + Str.toHexWord(iPort+15) + ": " + Str.toBinBytes(v, 2);
                iPort += 16;
                off += 2;
            }
        }
        this.println(sDump);
    }

    /**
     * findModuleInfo(sModule, nSegment)
     *
     * Since we're not sure what Disk the module was loaded from, we have to check all of them.
     *
     * @this {DebuggerX86}
     * @param {string} sModule
     * @param {number} nSegment
     * @return {Object}
     */
    findModuleInfo(sModule, nSegment)
    {
        var aSymbols = [];
        if (SYMBOLS) {
            var component, componentPrev = null;
            while (component = this.cmp.getMachineComponent("Disk", componentPrev)) {
                aSymbols = component.getModuleInfo(sModule, nSegment);
                if (aSymbols.length) break;
                componentPrev = component;
            }
        }
        return aSymbols;
    }

    /**
     * messageInit(sEnable)
     *
     * @this {DebuggerX86}
     * @param {string|undefined} sEnable contains zero or more message categories to enable, separated by '|'
     */
    messageInit(sEnable)
    {
        this.dbg = this;
        this.bitsMessage = this.bitsWarning = Messages.WARN;
        this.sMessagePrev = null;
        this.aMessageBuffer = [];
        var aEnable = this.parseCommand(sEnable, false, '|');
        if (aEnable.length) {
            for (var m in Messages.CATEGORIES) {
                if (Usr.indexOf(aEnable, m) >= 0) {
                    this.bitsMessage |= Messages.CATEGORIES[m];
                    this.println(m + " messages enabled");
                }
            }
        }
        this.historyInit();     // call this just in case Messages.INT was turned on
    }

    /**
     * messageDump(bitMessage, fnDumper)
     *
     * @this {DebuggerX86}
     * @param {number} bitMessage is one Messages category flag
     * @param {function(Array.<string>)} fnDumper is a function the Debugger can use to dump data for that category
     * @return {boolean} true if successfully registered, false if not
     */
    messageDump(bitMessage, fnDumper)
    {
        for (var m in Messages.CATEGORIES) {
            if (bitMessage == Messages.CATEGORIES[m]) {
                this.afnDumpers[m] = fnDumper;
                return true;
            }
        }
        return false;
    }

    /**
     * getRegIndex(sReg, off)
     *
     * @this {DebuggerX86}
     * @param {string} sReg
     * @param {number} [off] optional offset into sReg
     * @return {number} register index, or -1 if not found
     */
    getRegIndex(sReg, off)
    {
        var i;
        sReg = sReg.toUpperCase();
        if (off == null) {
            i = Usr.indexOf(DebuggerX86.REGS, sReg);
        } else {
            i = Usr.indexOf(DebuggerX86.REGS, sReg.substr(off, 3));
            if (i < 0) i = Usr.indexOf(DebuggerX86.REGS, sReg.substr(off, 2));
        }
        return i;
    }

    /**
     * getRegString(iReg)
     *
     * @this {DebuggerX86}
     * @param {number} iReg
     * @return {string}
     */
    getRegString(iReg)
    {
        var cch = 0;
        var n = this.getRegValue(iReg);
        if (n != null) {
            switch(iReg) {
            case DebuggerX86.REG_AL:
            case DebuggerX86.REG_CL:
            case DebuggerX86.REG_DL:
            case DebuggerX86.REG_BL:
            case DebuggerX86.REG_AH:
            case DebuggerX86.REG_CH:
            case DebuggerX86.REG_DH:
            case DebuggerX86.REG_BH:
                cch = 2;
                break;
            case DebuggerX86.REG_AX:
            case DebuggerX86.REG_CX:
            case DebuggerX86.REG_DX:
            case DebuggerX86.REG_BX:
            case DebuggerX86.REG_SP:
            case DebuggerX86.REG_BP:
            case DebuggerX86.REG_SI:
            case DebuggerX86.REG_DI:
            case DebuggerX86.REG_IP:
            case DebuggerX86.REG_SEG + DebuggerX86.REG_ES:
            case DebuggerX86.REG_SEG + DebuggerX86.REG_CS:
            case DebuggerX86.REG_SEG + DebuggerX86.REG_SS:
            case DebuggerX86.REG_SEG + DebuggerX86.REG_DS:
            case DebuggerX86.REG_SEG + DebuggerX86.REG_FS:
            case DebuggerX86.REG_SEG + DebuggerX86.REG_GS:
                cch = 4;
                break;
            case DebuggerX86.REG_EAX:
            case DebuggerX86.REG_ECX:
            case DebuggerX86.REG_EDX:
            case DebuggerX86.REG_EBX:
            case DebuggerX86.REG_ESP:
            case DebuggerX86.REG_EBP:
            case DebuggerX86.REG_ESI:
            case DebuggerX86.REG_EDI:
            case DebuggerX86.REG_CR0:
            case DebuggerX86.REG_CR1:
            case DebuggerX86.REG_CR2:
            case DebuggerX86.REG_CR3:
            case DebuggerX86.REG_EIP:
                cch = 8;
                break;
            case DebuggerX86.REG_PS:
                cch = this.cchReg;
                break;
            }
        }
        return cch? Str.toHex(n, cch) : "??";
    }

    /**
     * getRegValue(iReg)
     *
     * @this {DebuggerX86}
     * @param {number} iReg
     * @return {number|undefined}
     */
    getRegValue(iReg)
    {
        var n;
        if (iReg >= 0) {
            var cpu = this.cpu;
            switch(iReg) {
            case DebuggerX86.REG_AL:
                n = cpu.regEAX & 0xff;
                break;
            case DebuggerX86.REG_CL:
                n = cpu.regECX & 0xff;
                break;
            case DebuggerX86.REG_DL:
                n = cpu.regEDX & 0xff;
                break;
            case DebuggerX86.REG_BL:
                n = cpu.regEBX & 0xff;
                break;
            case DebuggerX86.REG_AH:
                n = (cpu.regEAX >> 8) & 0xff;
                break;
            case DebuggerX86.REG_CH:
                n = (cpu.regECX >> 8) & 0xff;
                break;
            case DebuggerX86.REG_DH:
                n = (cpu.regEDX >> 8) & 0xff;
                break;
            case DebuggerX86.REG_BH:
                n = (cpu.regEBX >> 8) & 0xff;
                break;
            case DebuggerX86.REG_AX:
                n = cpu.regEAX & 0xffff;
                break;
            case DebuggerX86.REG_CX:
                n = cpu.regECX & 0xffff;
                break;
            case DebuggerX86.REG_DX:
                n = cpu.regEDX & 0xffff;
                break;
            case DebuggerX86.REG_BX:
                n = cpu.regEBX & 0xffff;
                break;
            case DebuggerX86.REG_SP:
                n = cpu.getSP() & 0xffff;
                break;
            case DebuggerX86.REG_BP:
                n = cpu.regEBP & 0xffff;
                break;
            case DebuggerX86.REG_SI:
                n = cpu.regESI & 0xffff;
                break;
            case DebuggerX86.REG_DI:
                n = cpu.regEDI & 0xffff;
                break;
            case DebuggerX86.REG_IP:
                n = cpu.getIP() & 0xffff;
                break;
            case DebuggerX86.REG_PS:
                n = cpu.getPS();
                break;
            case DebuggerX86.REG_SEG + DebuggerX86.REG_ES:
                n = cpu.getES();
                break;
            case DebuggerX86.REG_SEG + DebuggerX86.REG_CS:
                n = cpu.getCS();
                break;
            case DebuggerX86.REG_SEG + DebuggerX86.REG_SS:
                n = cpu.getSS();
                break;
            case DebuggerX86.REG_SEG + DebuggerX86.REG_DS:
                n = cpu.getDS();
                break;
            default:
                if (this.cpu.model == X86.MODEL_80286) {
                    if (iReg == DebuggerX86.REG_CR0) {
                        n = cpu.regCR0;
                    }
                }
                else if (I386 && this.cpu.model >= X86.MODEL_80386) {
                    switch(iReg) {
                    case DebuggerX86.REG_EAX:
                        n = cpu.regEAX;
                        break;
                    case DebuggerX86.REG_ECX:
                        n = cpu.regECX;
                        break;
                    case DebuggerX86.REG_EDX:
                        n = cpu.regEDX;
                        break;
                    case DebuggerX86.REG_EBX:
                        n = cpu.regEBX;
                        break;
                    case DebuggerX86.REG_ESP:
                        n = cpu.getSP();
                        break;
                    case DebuggerX86.REG_EBP:
                        n = cpu.regEBP;
                        break;
                    case DebuggerX86.REG_ESI:
                        n = cpu.regESI;
                        break;
                    case DebuggerX86.REG_EDI:
                        n = cpu.regEDI;
                        break;
                    case DebuggerX86.REG_CR0:
                        n = cpu.regCR0;
                        break;
                    case DebuggerX86.REG_CR1:
                        n = cpu.regCR1;
                        break;
                    case DebuggerX86.REG_CR2:
                        n = cpu.regCR2;
                        break;
                    case DebuggerX86.REG_CR3:
                        n = cpu.regCR3;
                        break;
                    case DebuggerX86.REG_SEG + DebuggerX86.REG_FS:
                        n = cpu.getFS();
                        break;
                    case DebuggerX86.REG_SEG + DebuggerX86.REG_GS:
                        n = cpu.getGS();
                        break;
                    case DebuggerX86.REG_EIP:
                        n = cpu.getIP();
                        break;
                    }
                }
                break;
            }
        }
        return n;
    }

    /**
     * replaceRegs(s)
     *
     * @this {DebuggerX86}
     * @param {string} s
     * @return {string}
     */
    replaceRegs(s)
    {
        /*
         * Replace any references first; this means that register references inside the reference
         * do NOT need to be prefixed with '@'.
         */
        s = this.parseReference(s) || s;

        /*
         * Replace every @XX (or @XXX), where XX (or XXX) is a register, with the register's value.
         */
        var i = 0;
        var b, sChar, sAddr, dbgAddr, sReplace;
        while ((i = s.indexOf('@', i)) >= 0) {
            var iReg = this.getRegIndex(s, i + 1);
            if (iReg >= 0) {
                s = s.substr(0, i) + this.getRegString(iReg) + s.substr(i + 1 + DebuggerX86.REGS[iReg].length);
            }
            i++;
        }
        /*
         * Replace every #XX, where XX is a hex byte value, with the corresponding ASCII character (if printable).
         */
        i = 0;
        while ((i = s.indexOf('#', i)) >= 0) {
            sChar = s.substr(i+1, 2);
            b = Str.parseInt(sChar, 16);
            if (b != null && b >= 32 && b < 127) {
                sReplace = sChar + " '" + String.fromCharCode(b) + "'";
                s = s.replace('#' + sChar, sReplace);
                i += sReplace.length;
                continue;
            }
            i++;
        }
        /*
         * Replace every $XXXX:XXXX, where XXXX:XXXX is a segmented address, with the zero-terminated string at that address.
         */
        i = 0;
        while ((i = s.indexOf('$', i)) >= 0) {
            sAddr = s.substr(i+1, 9);
            dbgAddr = this.parseAddr(sAddr);
            if (dbgAddr) {
                sReplace = sAddr + ' "' + this.getSZ(dbgAddr) + '"';
                s = s.replace('$' + sAddr, sReplace);
                i += sReplace.length;
                continue;
            }
            i++;
        }
        /*
         * Replace every ^XXXX:XXXX, where XXXX:XXXX is a segmented address, with the FCB filename stored at that address.
         */
        i = 0;
        while ((i = s.indexOf('^', i)) >= 0) {
            sAddr = s.substr(i+1, 9);
            dbgAddr = this.parseAddr(sAddr);
            if (dbgAddr) {
                this.incAddr(dbgAddr);
                sReplace = sAddr + ' "' + this.getSZ(dbgAddr, 11) + '"';
                s = s.replace('^' + sAddr, sReplace);
                i += sReplace.length;
                continue;
            }
            i++;
        }
        return s;
    }

    /**
     * message(sMessage, fAddress)
     *
     * @this {DebuggerX86}
     * @param {string} sMessage is any caller-defined message string
     * @param {boolean} [fAddress] is true to display the current CS:IP
     */
    message(sMessage, fAddress)
    {
        if (fAddress) {
            sMessage += " at " + this.toHexAddr(this.newAddr(this.cpu.getIP(), this.cpu.getCS())) + " (%" + Str.toHex(this.cpu.regLIP) + ")";
        }

        if ((this.bitsMessage & Messages.BUFFER) == Messages.BUFFER) {
            this.aMessageBuffer.push(sMessage);
            return;
        }

        if (this.sMessagePrev && sMessage == this.sMessagePrev) return;
        this.sMessagePrev = sMessage;

        if ((this.bitsMessage & Messages.HALT) == Messages.HALT) {
            this.stopCPU();
            sMessage += " (cpu halted)";
        }

        this.println(sMessage); // + " (" + this.cpu.getCycles() + " cycles)"

        /*
         * We have no idea what the frequency of println() calls might be; all we know is that they easily
         * screw up the CPU's careful assumptions about cycles per burst.  So we call yieldCPU() after every
         * message, to effectively end the current burst and start fresh.
         *
         * TODO: See CPU.calcStartTime() for a discussion of why we might want to call yieldCPU() *before*
         * we display the message.
         */
        if (this.cpu) this.cpu.yieldCPU();
    }

    /**
     * messageInt(nInt, addr, fForce)
     *
     * @this {DebuggerX86}
     * @param {number} nInt
     * @param {number} addr (LIP after the "INT n" instruction has been fetched but not dispatched)
     * @param {boolean} [fForce] (true if the message should be forced)
     * @return {boolean} true if message generated (which in turn triggers addIntReturn() inside checkIntNotify()), false if not
     */
    messageInt(nInt, addr, fForce)
    {
        var AH, DL;
        var fMessage = fForce;

        /*
         * We currently arrive here only because the CPU has already determined that INT messages are enabled,
         * or because the ChipSet's RTC interrupt handler has already determined that INT messages are enabled.
         *
         * But software interrupts are very common, so we generally require additional categories to be enabled;
         * unless the caller has set fForce, we check those additional categories now.
         */
        if (!fMessage) {
            /*
             * Display all software interrupts if CPU messages are enabled (and it's not an "annoying" interrupt);
             * note that in some cases, even "annoying" interrupts can be turned with an extra message category.
             */
            fMessage = this.messageEnabled(Messages.CPU) && DebuggerX86.INT_ANNOYING.indexOf(nInt) < 0;
            if (!fMessage) {
                /*
                 * Alternatively, display this software interrupt if its corresponding message category is enabled.
                 */
                var nCategory = DebuggerX86.INT_MESSAGES[nInt];
                if (nCategory) {
                    if (this.messageEnabled(nCategory)) {
                        fMessage = true;
                    } else {
                        /*
                         * Alternatively, display this FDC interrupt if HDC messages are enabled (since they share
                         * a common software interrupt).  Normally, an HDC BIOS will copy the original DISK (0x13)
                         * vector to the ALT_DISK (0x40) vector, but it's a nuisance having to check different
                         * interrupts in different configurations for the same frickin' functionality, so we don't.
                         */
                        fMessage = (nCategory == Messages.FDC && this.messageEnabled(nCategory = Messages.HDC));
                    }
                }
            }
        }
        if (fMessage) {
            AH = (this.cpu.regEAX >> 8) & 0xff;
            DL = this.cpu.regEDX & 0xff;
            if (nInt == Interrupts.DOS /* 0x21 */ && AH == 0x0b ||
                nCategory == Messages.FDC && DL >= 0x80 || nCategory == Messages.HDC && DL < 0x80) {
                fMessage = false;
            }
        }
        if (fMessage) {
            var aFuncs = Interrupts.FUNCS[nInt];
            var sFunc = (aFuncs && aFuncs[AH]) || "";
            if (sFunc) sFunc = ' ' + this.replaceRegs(sFunc);
            /*
             * For display purposes only, rewind addr to the address of the responsible "INT n" instruction;
             * we know it's the two-byte "INT n" instruction because that's the only opcode handler that calls
             * checkIntNotify() at the moment.
             */
            addr -= 2;
            this.message("INT " + Str.toHexByte(nInt) + ": AH=" + Str.toHexByte(AH) + " at " + this.toHexOffset(addr - this.cpu.segCS.base, this.cpu.getCS()) + sFunc);
        }
        return fMessage;
    }

    /**
     * messageIntReturn(nInt, nLevel, nCycles)
     *
     * @this {DebuggerX86}
     * @param {number} nInt
     * @param {number} nLevel
     * @param {number} nCycles
     * @param {string} [sResult]
     */
    messageIntReturn(nInt, nLevel, nCycles, sResult)
    {
        this.message("INT " + Str.toHexByte(nInt) + ": C=" + (this.cpu.getCF()? 1 : 0) + (sResult || "") + " (cycles=" + nCycles + (nLevel? ",level=" + (nLevel+1) : "") + ')');
    }

    /**
     * messageIO(component, port, bOut, addrFrom, name, bIn, bitsMessage)
     *
     * @this {DebuggerX86}
     * @param {Component} component
     * @param {number} port
     * @param {number|null} bOut if an output operation
     * @param {number|null} [addrFrom]
     * @param {string|null} [name] of the port, if any
     * @param {number|null} [bIn] is the input value, if known, on an input operation
     * @param {number} [bitsMessage] is one or more Messages category flag(s)
     */
    messageIO(component, port, bOut, addrFrom, name, bIn, bitsMessage)
    {
        bitsMessage |= Messages.PORT;
        if (addrFrom == null || (this.bitsMessage & bitsMessage) == bitsMessage) {
            var selFrom = null;
            if (addrFrom != null) {
                selFrom = this.cpu.getCS();
                addrFrom -= this.cpu.segCS.base;
            }
            this.message(component.idComponent + '.' + (bOut != null? "outPort" : "inPort") + '(' + Str.toHexWord(port) + ',' + (name? name : "unknown") + (bOut != null? ',' + Str.toHexByte(bOut) : "") + ')' + (bIn != null? (": " + Str.toHexByte(bIn)) : "") + (addrFrom != null? (" at " + this.toHexOffset(addrFrom, selFrom)) : ""));
        }
    }

    /**
     * init()
     *
     * @this {DebuggerX86}
     */
    init()
    {
        this.println("Type ? for help with PCx86 Debugger commands");
        this.updateStatus();
        if (this.sInitCommands) {
            var sCmds = this.sInitCommands;
            this.sInitCommands = null;
            this.doCommands(sCmds);
        }
    }

    /**
     * historyInit(fQuiet)
     *
     * This function is intended to be called by the constructor, reset(), addBreakpoint(), findBreakpoint()
     * and any other function that changes the checksEnabled() criteria used to decide whether checkInstruction()
     * should be called.
     *
     * That is, if the history arrays need to be allocated and haven't already been allocated, then allocate them,
     * and if the arrays are no longer needed, then deallocate them.
     *
     * @this {DebuggerX86}
     * @param {boolean} [fQuiet]
     */
    historyInit(fQuiet)
    {
        var i;
        if (!this.checksEnabled()) {
            if (this.aOpcodeHistory && this.aOpcodeHistory.length && !fQuiet) {
                this.println("instruction history buffer freed");
            }
            this.iOpcodeHistory = 0;
            this.aOpcodeHistory = [];
            this.aaOpcodeCounts = [];
            return;
        }
        if (!this.aOpcodeHistory || !this.aOpcodeHistory.length) {
            this.aOpcodeHistory = new Array(DebuggerX86.HISTORY_LIMIT);
            for (i = 0; i < this.aOpcodeHistory.length; i++) {
                /*
                 * Preallocate dummy Addr (Array) objects in every history slot, so that
                 * checkInstruction() doesn't need to call newAddr() on every slot update.
                 */
                this.aOpcodeHistory[i] = this.newAddr();
            }
            this.iOpcodeHistory = 0;
            if (!fQuiet) {
                this.println("instruction history buffer allocated");
            }
        }
        if (!this.aaOpcodeCounts || !this.aaOpcodeCounts.length) {
            this.aaOpcodeCounts = new Array(256);
            for (i = 0; i < this.aaOpcodeCounts.length; i++) {
                this.aaOpcodeCounts[i] = [i, 0];
            }
        }
    }

    /**
     * startCPU(fUpdateFocus, fQuiet)
     *
     * @this {DebuggerX86}
     * @param {boolean} [fUpdateFocus]
     * @param {boolean} [fQuiet]
     * @return {boolean} true if run request successful, false if not
     */
    startCPU(fUpdateFocus, fQuiet)
    {
        if (this.checkCPU(fQuiet)) {
            return this.cpu.startCPU(fUpdateFocus, fQuiet);
        }
        return false;
    }

    /**
     * stepCPU(nCycles, fRegs, fUpdateCPU)
     *
     * @this {DebuggerX86}
     * @param {number} nCycles (0 for one instruction without checking breakpoints)
     * @param {boolean} [fRegs] is true to display registers after step (default is false)
     * @param {boolean} [fUpdateCPU] is false to disable calls to updateCPU() (default is true)
     * @return {boolean}
     */
    stepCPU(nCycles, fRegs, fUpdateCPU)
    {
        if (!this.checkCPU()) return false;

        this.nCycles = 0;
        do {
            if (!nCycles) {
                /*
                 * When single-stepping, the CPU won't call checkInstruction(), which is good for
                 * avoiding breakpoints, but bad for instruction data collection if checks are enabled.
                 * So we call checkInstruction() ourselves.
                 */
                if (this.checksEnabled()) this.checkInstruction(this.cpu.regLIP, 0);
            }
            /*
             * For our typically tiny bursts (usually single instructions), mimic what runCPU() does.
             */
            try {
                var nCyclesStep = this.cpu.stepCPU(nCycles);
                if (nCyclesStep > 0) {
                    this.nCycles += nCyclesStep;
                    this.cpu.addCycles(nCyclesStep, true);
                    this.cpu.updateChecksum(nCyclesStep);
                    this.cOpcodes++;
                }
            }
            catch(exception) {
                if (typeof exception != "number") {
                    var e = exception;
                    this.nCycles = 0;
                    this.cpu.setError(e.stack || e.message);
                }
            }
        } while (this.cpu.opFlags & X86.OPFLAG_PREFIXES);

        /*
         * Because we called cpu.stepCPU() and not cpu.startCPU(), we must nudge the cpu's update code,
         * and then update our own state.  Normally, the only time fUpdateCPU will be false is when doTrace()
         * is calling us in a loop, in which case it will perform its own updateCPU() when it's done.
         */
        if (fUpdateCPU !== false) this.cpu.updateCPU();

        this.updateStatus(fRegs || false);
        return (this.nCycles > 0);
    }

    /**
     * stopCPU()
     *
     * @this {DebuggerX86}
     * @param {boolean} [fComplete]
     * @return {boolean}
     */
    stopCPU(fComplete)
    {
        return this.cpu && this.cpu.stopCPU(fComplete) || false;
    }

    /**
     * updateStatus(fRegs)
     *
     * @this {DebuggerX86}
     * @param {boolean} [fRegs] (default is true)
     */
    updateStatus(fRegs)
    {
        if (fRegs === undefined) fRegs = true;

        this.dbgAddrNextCode = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
        /*
         * this.nStep used to be a simple boolean, but now it's 0 (or undefined)
         * if inactive, 1 if stepping over an instruction without a register dump, or 2
         * if stepping over an instruction with a register dump.
         */
        if (!fRegs || this.nStep == 1)
            this.doUnassemble();
        else {
            this.doRegisters();
        }
    }

    /**
     * checkCPU(fQuiet)
     *
     * Make sure the CPU is ready (finished initializing), not busy (already running), and not in an error state.
     *
     * @this {DebuggerX86}
     * @param {boolean} [fQuiet]
     * @return {boolean}
     */
    checkCPU(fQuiet)
    {
        if (!this.cpu || !this.cpu.isReady() || !this.cpu.isPowered() || this.cpu.isRunning()) {
            if (!fQuiet) this.println("cpu busy or unavailable, command ignored");
            return false;
        }
        return !this.cpu.isError();
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {DebuggerX86}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        if (!fRepower) {
            /*
             * Because Debugger save/restore support is somewhat limited (and didn't always exist),
             * we deviate from the typical save/restore design pattern: instead of reset OR restore,
             * we always reset and then perform a (potentially limited) restore.
             */
            this.reset(true);

            // this.println(data? "resuming" : "powering up");

            if (data && this.restore) {
                if (!this.restore(data)) return false;
            }
        }
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {DebuggerX86}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean}
     */
    powerDown(fSave, fShutdown)
    {
        if (fShutdown) this.println(fSave? "suspending" : "shutting down");
        return fSave? this.save() : true;
    }

    /**
     * reset(fQuiet)
     *
     * This is a notification handler, called by the Computer, to inform us of a reset.
     *
     * @this {DebuggerX86}
     * @param {boolean} fQuiet (true only when called from our own powerUp handler)
     */
    reset(fQuiet)
    {
        this.historyInit();
        this.cOpcodes = this.cOpcodesStart = 0;
        this.sMessagePrev = null;
        this.nCycles = 0;
        this.dbgAddrNextCode = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
        this.clearTempBreakpoint();
        if (!fQuiet && !this.flags.running) this.updateStatus();
    }

    /**
     * save()
     *
     * This implements (very rudimentary) save support for the Debugger component.
     *
     * @this {DebuggerX86}
     * @return {Object}
     */
    save()
    {
        var state = new State(this);
        state.set(0, this.packAddr(this.dbgAddrNextCode));
        state.set(1, this.packAddr(this.dbgAddrNextData));
        state.set(2, this.packAddr(this.dbgAddrAssemble));
        state.set(3, [this.aPrevCmds, this.fAssemble, this.bitsMessage]);
        state.set(4, this.aSymbolTable);
        state.set(5, [this.aBreakExec, this.aBreakRead, this.aBreakWrite]);
        return state.data();
    }

    /**
     * restore(data)
     *
     * This implements (very rudimentary) restore support for the Debugger component.
     *
     * @this {DebuggerX86}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    restore(data)
    {
        var i = 0;
        if (data[i]) this.dbgAddrNextCode = this.unpackAddr(data[i++]);
        /*
         * dbgAddrNextData wasn't saved until there were at least 6 elements, hence the check for data[5] instead of data[i]
         */
        if (data[5]) this.dbgAddrNextData = this.unpackAddr(data[i++]);
        if (data[i]) this.dbgAddrAssemble = this.unpackAddr(data[i++]);
        if (data[i]) {
            this.aPrevCmds = data[i][0];
            if (typeof this.aPrevCmds == "string") this.aPrevCmds = [this.aPrevCmds];
            this.fAssemble = data[i][1];
            var bits = data[i][2];
            /*
             * We supplement the message bits only the incoming bits adhere to the new format (ie, if bits exist in both the high
             * nibble and one of the low nibbles).
             */
            if ((bits & 0xf0000000) && (bits & 0x0fffffff)) {
                this.bitsMessage |= bits;       // include any saved message bits ONLY if they match our new format (ie, bits in both high and low nibbles)
            }
            i++;
        }
        if (data[i]) {
            this.aSymbolTable = data[i++];
        }
        if (data[i]) {
            this.restoreBreakpoints(this.aBreakExec, data[i][0]);
            this.restoreBreakpoints(this.aBreakRead, data[i][1]);
            this.restoreBreakpoints(this.aBreakWrite, data[i][2]);
        }
        return true;
    }

    /**
     * start(ms, nCycles)
     *
     * This is a notification handler, called by the Computer, to inform us the CPU has started.
     *
     * @this {DebuggerX86}
     * @param {number} ms
     * @param {number} nCycles
     */
    start(ms, nCycles)
    {
        if (!this.nStep) this.println("running");
        this.flags.running = true;
        this.msStart = ms;
        this.nCyclesStart = nCycles;
    }

    /**
     * stop(ms, nCycles)
     *
     * This is a notification handler, called by the Computer, to inform us the CPU has now stopped.
     *
     * @this {DebuggerX86}
     * @param {number} ms
     * @param {number} nCycles
     */
    stop(ms, nCycles)
    {
        if (this.flags.running) {
            this.flags.running = false;
            this.nCycles = nCycles - this.nCyclesStart;
            if (!this.nStep) {
                var sStopped = "stopped";
                if (this.nCycles) {
                    var msTotal = ms - this.msStart;
                    var nCyclesPerSecond = (msTotal > 0? Math.round(this.nCycles * 1000 / msTotal) : 0);
                    sStopped += " (";
                    if (this.checksEnabled()) {
                        sStopped += this.cOpcodes + " opcodes, ";
                        /*
                         * $ops displays progress by calculating cOpcodes - cOpcodesStart, so before
                         * zeroing cOpcodes, we should subtract cOpcodes from cOpcodesStart (since we're
                         * effectively subtracting cOpcodes from cOpcodes as well).
                         */
                        this.cOpcodesStart -= this.cOpcodes;
                        this.cOpcodes = 0;
                    }
                    sStopped += this.nCycles + " cycles, " + msTotal + " ms, " + nCyclesPerSecond + " hz)";
                    if (MAXDEBUG && this.chipset) {
                        var i, c, n;
                        for (i = 0; i < this.chipset.acInterrupts.length; i++) {
                            c = this.chipset.acInterrupts[i];
                            if (!c) continue;
                            n = c / Math.round(msTotal / 1000);
                            this.println("IRQ" + i + ": " + c + " interrupts (" + n + " per sec)");
                            this.chipset.acInterrupts[i] = 0;
                        }
                        for (i = 0; i < this.chipset.acTimersFired.length; i++) {
                            c = this.chipset.acTimersFired[i];
                            if (!c) continue;
                            n = c / Math.round(msTotal / 1000);
                            this.println("TIMER" + i + ": " + c + " fires (" + n + " per sec)");
                            this.chipset.acTimersFired[i] = 0;
                        }
                        n = 0;
                        for (i = 0; i < this.chipset.acTimer0Counts.length; i++) {
                            var a = this.chipset.acTimer0Counts[i];
                            n += a[0];
                            this.println("TIMER0 update #" + i + ": [" + a[0] + ',' + a[1] + ',' + a[2] + ']');
                        }
                        this.chipset.acTimer0Counts = [];
                    }
                } else {
                    if (this.messageEnabled(Messages.HALT)) {
                        /*
                         * It's possible the user is trying to 'g' past a fault that was blocked by helpCheckFault()
                         * for the Debugger's benefit; if so, it will continue to be blocked, so try displaying a helpful
                         * message (another helpful tip would be to simply turn off the "halt" message category).
                         */
                        sStopped += " (use the 't' command to execute blocked faults)";
                    }
                }
                this.println(sStopped);
            }
            this.updateStatus(true);
            this.updateFocus();
            this.clearTempBreakpoint(this.cpu.regLIP);
        }
    }

    /**
     * checksEnabled(fRelease)
     *
     * This "check" function is called by the CPU; we indicate whether or not every instruction needs to be checked.
     *
     * Originally, this returned true even when there were only read and/or write breakpoints, but those breakpoints
     * no longer require the intervention of checkInstruction(); the Bus component automatically swaps in/out appropriate
     * "checked" Memory access functions to deal with those breakpoints in the corresponding Memory blocks.  So I've
     * simplified the test below.
     *
     * @this {DebuggerX86}
     * @param {boolean} [fRelease] is true for release criteria only; default is false (any criteria)
     * @return {boolean} true if every instruction needs to pass through checkInstruction(), false if not
     */
    checksEnabled(fRelease)
    {
        return ((DEBUG && !fRelease)? true : (this.aBreakExec.length > 1 || !!this.nBreakIns || this.messageEnabled(Messages.INT) /* || this.aBreakRead.length > 1 || this.aBreakWrite.length > 1 */));
    }

    /**
     * checkInstruction(addr, nState)
     *
     * This "check" function is called by the CPU to inform us about the next instruction to be executed,
     * giving us an opportunity to look for "exec" breakpoints and update opcode frequencies and instruction history.
     *
     * @this {DebuggerX86}
     * @param {number} addr
     * @param {number} nState is < 0 if stepping, 0 if starting, or > 0 if running
     * @return {boolean} true if breakpoint hit, false if not
     */
    checkInstruction(addr, nState)
    {
        var cpu = this.cpu;

        if (nState > 0) {
            if (this.nBreakIns && !--this.nBreakIns) {
                return true;
            }
            if (this.checkBreakpoint(addr, 1, this.aBreakExec)) {
                return true;
            }
            /*
             * Halt if running with interrupts disabled and IOPL < CPL, because that's likely an error
             */
            if (MAXDEBUG && !(cpu.regPS & X86.PS.IF) && cpu.nIOPL < cpu.nCPL) {
                this.printMessage("interrupts disabled at IOPL " + cpu.nIOPL + " and CPL " + cpu.nCPL, true);
                return true;
            }
        }

        /*
         * The rest of the instruction tracking logic can only be performed if historyInit() has allocated the
         * necessary data structures.  Note that there is no explicit UI for enabling/disabling history, other than
         * adding/removing breakpoints, simply because it's breakpoints that trigger the call to checkInstruction();
         * well, OK, and a few other things now, like enabling Messages.INT messages.
         */
        if (nState >= 0 && this.aaOpcodeCounts.length) {
            this.cOpcodes++;
            var bOpcode = cpu.probeAddr(addr);
            if (bOpcode != null) {
                this.aaOpcodeCounts[bOpcode][1]++;
                var dbgAddr = this.aOpcodeHistory[this.iOpcodeHistory];
                this.setAddr(dbgAddr, cpu.getIP(), cpu.getCS());
                dbgAddr.cycleCount = cpu.getCycles();
                if (++this.iOpcodeHistory == this.aOpcodeHistory.length) this.iOpcodeHistory = 0;
            }
        }
        return false;
    }

    /**
     * checkMemoryRead(addr, nb)
     *
     * This "check" function is called by a Memory block to inform us that a memory read occurred, giving us an
     * opportunity to track the read if we want, and look for a matching "read" breakpoint, if any.
     *
     * In the "old days", it would be an error for this call to fail to find a matching Debugger breakpoint, but now
     * Memory blocks have no idea whether the Debugger or the machine's Debug register(s) triggered this "checked" read.
     *
     * If we return true, we "trump" the machine's Debug register(s); false allows normal Debug register processing.
     *
     * @this {DebuggerX86}
     * @param {number} addr
     * @param {number} [nb] (# of bytes; default is 1)
     * @return {boolean} true if breakpoint hit, false if not
     */
    checkMemoryRead(addr, nb)
    {
        if (this.checkBreakpoint(addr, nb || 1, this.aBreakRead)) {
            this.stopCPU(true);
            return true;
        }
        return false;
    }

    /**
     * checkMemoryWrite(addr, nb)
     *
     * This "check" function is called by a Memory block to inform us that a memory write occurred, giving us an
     * opportunity to track the write if we want, and look for a matching "write" breakpoint, if any.
     *
     * In the "old days", it would be an error for this call to fail to find a matching Debugger breakpoint, but now
     * Memory blocks have no idea whether the Debugger or the machine's Debug register(s) triggered this "checked" write.
     *
     * If we return true, we "trump" the machine's Debug register(s); false allows normal Debug register processing.
     *
     * @this {DebuggerX86}
     * @param {number} addr
     * @param {number} [nb] (# of bytes; default is 1)
     * @return {boolean} true if breakpoint hit, false if not
     */
    checkMemoryWrite(addr, nb)
    {
        if (this.checkBreakpoint(addr, nb || 1, this.aBreakWrite)) {
            this.stopCPU(true);
            return true;
        }
        return false;
    }

    /**
     * checkPortInput(port, size, data)
     *
     * This "check" function is called by the Bus component to inform us that port input occurred.
     *
     * @this {DebuggerX86}
     * @param {number} port
     * @param {number} size
     * @param {number} data
     * @return {boolean} true if breakpoint hit, false if not
     */
    checkPortInput(port, size, data)
    {
        /*
         * We trust that the Bus component won't call us unless we told it to, so we halt unconditionally
         */
        this.println("break on input from port " + Str.toHexWord(port) + ": " + Str.toHex(data));
        this.stopCPU(true);
        return true;
    }

    /**
     * checkPortOutput(port, size, data)
     *
     * This "check" function is called by the Bus component to inform us that port output occurred.
     *
     * @this {DebuggerX86}
     * @param {number} port
     * @param {number} size
     * @param {number} data
     * @return {boolean} true if breakpoint hit, false if not
     */
    checkPortOutput(port, size, data)
    {
        /*
         * We trust that the Bus component won't call us unless we told it to, so we halt unconditionally
         */
        this.println("break on output to port " + Str.toHexWord(port) + ": " + Str.toHex(data));
        this.stopCPU(true);
        return true;
    }

    /**
     * clearBreakpoints()
     *
     * @this {DebuggerX86}
     */
    clearBreakpoints()
    {
        var i, dbgAddr;
        this.aBreakExec = ["bp"];
        if (this.aBreakRead !== undefined) {
            for (i = 1; i < this.aBreakRead.length; i++) {
                dbgAddr = this.aBreakRead[i];
                this.cpu.removeMemBreak(this.getAddr(dbgAddr), false, dbgAddr.type == DebuggerX86.ADDRTYPE.PHYSICAL);
            }
        }
        this.aBreakRead = ["br"];
        if (this.aBreakWrite !== undefined) {
            for (i = 1; i < this.aBreakWrite.length; i++) {
                dbgAddr = this.aBreakWrite[i];
                this.cpu.removeMemBreak(this.getAddr(dbgAddr), true, dbgAddr.type == DebuggerX86.ADDRTYPE.PHYSICAL);
            }
        }
        this.aBreakWrite = ["bw"];
        /*
         * nSuppressBreaks ensures we can't get into an infinite loop where a breakpoint lookup requires
         * reading a segment descriptor via getSegment(), and that triggers more memory reads, which triggers
         * more breakpoint checks.
         */
        this.nSuppressBreaks = 0;
    }

    /**
     * addBreakpoint(aBreak, dbgAddr, fTempBreak, fQuiet)
     *
     * In case you haven't already figured this out, all our breakpoint commands use the address
     * to identify a breakpoint, not an incrementally assigned breakpoint index like other debuggers;
     * see doBreak() for details.
     *
     * This has a few implications, one being that you CANNOT set more than one kind of breakpoint
     * on a single address.  In practice, that's rarely a problem, because you can almost always set
     * a different breakpoint on a neighboring address.
     *
     * Also, there is one exception to the "one address, one breakpoint" rule, and that involves
     * temporary breakpoints (ie, one-time execution breakpoints that either a "p" or "g" command
     * may create to step over a chunk of code).  Those breakpoints automatically clear themselves,
     * so there usually isn't any need to refer to them using breakpoint commands.
     *
     * TODO: Consider supporting the more "traditional" breakpoint index syntax; the current
     * address-based syntax was implemented solely for expediency and consistency.  At the same time,
     * also consider a more WDEB386-like syntax, where "br" is used to set a variety of access-specific
     * breakpoints, using modifiers like "r1", "r2", "w1", "w2, etc.
     *
     * @this {DebuggerX86}
     * @param {Array} aBreak
     * @param {DbgAddrX86} dbgAddr
     * @param {boolean} [fTempBreak]
     * @param {boolean} [fQuiet]
     * @return {boolean} true if breakpoint added, false if already exists
     */
    addBreakpoint(aBreak, dbgAddr, fTempBreak, fQuiet)
    {
        var fSuccess = true;

        // this.nSuppressBreaks++;

        /*
         * Instead of complaining that a breakpoint already exists (as we used to do), we now
         * allow breakpoints to be re-set; this makes it easier to update any commands that may
         * be associated with the breakpoint.
         *
         * The only exception: we DO allow a temporary breakpoint at an address where there may
         * already be a breakpoint, so that you can easily step ("p" or "g") over such addresses.
         */
        if (!fTempBreak) {
            this.findBreakpoint(aBreak, dbgAddr, true, false, true);
        }

        if (aBreak != this.aBreakExec) {
            var addr = this.getAddr(dbgAddr);
            if (addr === X86.ADDR_INVALID) {
                this.println("invalid address: " + this.toHexAddr(dbgAddr));
                fSuccess = false;
            } else {
                this.cpu.addMemBreak(addr, aBreak == this.aBreakWrite, dbgAddr.type == DebuggerX86.ADDRTYPE.PHYSICAL);
            }
        }

        if (fSuccess) {
            aBreak.push(dbgAddr);
            if (fTempBreak) {
                /*
                 * Force temporary breakpoints to use their linear address, if one is available, by zapping
                 * the selector; this allows us to step over calls or interrupts that change the processor mode.
                 *
                 * TODO: Unfortunately, this will fail to "step" over a call in segment that moves during the call;
                 * consider alternatives.
                 */
                if (dbgAddr.addr != null) dbgAddr.sel = null;
                dbgAddr.fTempBreak = true;
            }
            else {
                if (!fQuiet) this.printBreakpoint(aBreak, aBreak.length-1, "set");
                this.historyInit();
            }
        }

        // this.nSuppressBreaks--;

        return fSuccess;
    }

    /**
     * findBreakpoint(aBreak, dbgAddr, fRemove, fTempBreak, fQuiet)
     *
     * @this {DebuggerX86}
     * @param {Array} aBreak
     * @param {DbgAddrX86} dbgAddr
     * @param {boolean} [fRemove]
     * @param {boolean} [fTempBreak]
     * @param {boolean} [fQuiet]
     * @return {boolean} true if found, false if not
     */
    findBreakpoint(aBreak, dbgAddr, fRemove, fTempBreak, fQuiet)
    {
        var fFound = false;
        var addr = this.mapBreakpoint(this.getAddr(dbgAddr));
        for (var i = 1; i < aBreak.length; i++) {
            var dbgAddrBreak = aBreak[i];
            if (addr !== X86.ADDR_INVALID && addr == this.mapBreakpoint(this.getAddr(dbgAddrBreak)) ||
                addr === X86.ADDR_INVALID && dbgAddr.sel == dbgAddrBreak.sel && dbgAddr.off == dbgAddrBreak.off) {
                if (!fTempBreak || dbgAddrBreak.fTempBreak) {
                    fFound = true;
                    if (fRemove) {
                        if (!dbgAddrBreak.fTempBreak && !fQuiet) {
                            this.printBreakpoint(aBreak, i, "cleared");
                        }
                        aBreak.splice(i, 1);
                        if (aBreak != this.aBreakExec) {
                            this.cpu.removeMemBreak(addr, aBreak == this.aBreakWrite, dbgAddrBreak.type == DebuggerX86.ADDRTYPE.PHYSICAL);
                        }
                        /*
                         * We'll mirror the logic in addBreakpoint() and leave the history buffer alone if this
                         * was a temporary breakpoint.
                         */
                        if (!dbgAddrBreak.fTempBreak) {
                            this.historyInit();
                        }
                        break;
                    }
                    if (!fQuiet) this.printBreakpoint(aBreak, i, "exists");
                    break;
                }
            }
        }
        return fFound;
    }

    /**
     * listBreakpoints(aBreak)
     *
     * @this {DebuggerX86}
     * @param {Array} aBreak
     * @return {number} of breakpoints listed, 0 if none
     */
    listBreakpoints(aBreak)
    {
        for (var i = 1; i < aBreak.length; i++) {
            this.printBreakpoint(aBreak, i);
        }
        return aBreak.length - 1;
    }

    /**
     * printBreakpoint(aBreak, i, sAction)
     *
     * TODO: We may need to start printing linear addresses also (if any), because segmented address can be ambiguous.
     *
     * @this {DebuggerX86}
     * @param {Array} aBreak
     * @param {number} i
     * @param {string} [sAction]
     */
    printBreakpoint(aBreak, i, sAction)
    {
        var dbgAddr = aBreak[i];
        this.println(aBreak[0] + ' ' + this.toHexAddr(dbgAddr) + (sAction? (' ' + sAction) : (dbgAddr.sCmd? (' "' + dbgAddr.sCmd + '"') : '')));
    }

    /**
     * restoreBreakpoints(aBreak, aDbgAddr)
     *
     * @this {DebuggerX86}
     * @param {Array} aBreak
     * @param {Array} aDbgAddr
     */
    restoreBreakpoints(aBreak, aDbgAddr)
    {
        if (aDbgAddr[0] != aBreak[0]) return;
        for (var i = 1; i < aDbgAddr.length; i++) {
            var dbgAddr = aDbgAddr[i];
            this.addBreakpoint(aBreak, dbgAddr, dbgAddr.fTempBreak, true);
        }
    }

    /**
     * setTempBreakpoint(dbgAddr)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr of new temp breakpoint
     */
    setTempBreakpoint(dbgAddr)
    {
        this.addBreakpoint(this.aBreakExec, dbgAddr, true);
    }

    /**
     * clearTempBreakpoint(addr)
     *
     * @this {DebuggerX86}
     * @param {number|undefined} [addr] clear all temp breakpoints if no address specified
     */
    clearTempBreakpoint(addr)
    {
        if (addr !== undefined) {
            this.checkBreakpoint(addr, 1, this.aBreakExec, true);
            this.nStep = 0;
        } else {
            for (var i = 1; i < this.aBreakExec.length; i++) {
                var dbgAddrBreak = this.aBreakExec[i];
                if (dbgAddrBreak.fTempBreak) {
                    if (!this.findBreakpoint(this.aBreakExec, dbgAddrBreak, true, true)) break;
                    i = 0;
                }
            }
        }
    }

    /**
     * mapBreakpoint(addr)
     *
     * @this {DebuggerX86}
     * @param {number} addr
     * @return {number}
     */
    mapBreakpoint(addr)
    {
        /*
         * Map addresses in the top 64Kb at the top of the address space (assuming either a 16Mb or 4Gb
         * address space) to the top of the 1Mb range.
         *
         * The fact that those two 64Kb regions are aliases of each other on an 80286 is a pain in the BUTT,
         * because any CS-based breakpoint you set immediately after a CPU reset will have a physical address
         * in the top 16Mb, yet after the first inter-segment JMP, you will be running in the first 1Mb.
         */
        if (addr !== X86.ADDR_INVALID) {
            var mask = (this.maskAddr & ~0xffff);
            if ((addr & mask) == mask) addr &= 0x000fffff;
        }
        return addr;
    }

    /**
     * checkBreakpoint(addr, nb, aBreak, fTempBreak)
     *
     * @this {DebuggerX86}
     * @param {number} addr
     * @param {number} nb (# of bytes)
     * @param {Array} aBreak
     * @param {boolean} [fTempBreak]
     * @return {boolean} true if breakpoint has been hit, false if not
     */
    checkBreakpoint(addr, nb, aBreak, fTempBreak)
    {
        /*
         * Time to check for execution breakpoints; note that this should be done BEFORE updating frequency
         * or history data (see checkInstruction), since we might not actually execute the current instruction.
         */
        var fBreak = false;

        if (!this.nSuppressBreaks++) {

            addr = this.mapBreakpoint(addr);

            /*
             * As discussed in opINT3(), I decided to check for INT3 instructions here: we'll tell the CPU to
             * stop on INT3 whenever both the INT and HALT message bits are set; a simple "g" command allows you
             * to continue.
             */
            if (this.messageEnabled(Messages.INT | Messages.HALT)) {
                if (this.cpu.probeAddr(addr) == X86.OPCODE.INT3) {
                    fBreak = true;
                }
            }

            for (var i = 1; !fBreak && i < aBreak.length; i++) {

                var dbgAddrBreak = aBreak[i];

                if (fTempBreak && !dbgAddrBreak.fTempBreak) continue;

                /*
                 * We need to zap the linear address field of the breakpoint address before
                 * calling getAddr(), to force it to recalculate the linear address every time,
                 * unless this is a breakpoint on a linear address (as indicated by a null sel).
                 */
                if (dbgAddrBreak.sel != null) dbgAddrBreak.addr = null;

                /*
                 * We used to calculate the linear address of the breakpoint at the time the
                 * breakpoint was added, so that a breakpoint set in one mode (eg, in real-mode)
                 * would still work as intended if the mode changed later (eg, to protected-mode).
                 *
                 * However, that created difficulties setting protected-mode breakpoints in segments
                 * that might not be defined yet, or that could move in physical memory.
                 *
                 * If you want to create a real-mode breakpoint that will break regardless of mode,
                 * use the physical address of the real-mode memory location instead.
                 */
                var addrBreak = this.mapBreakpoint(this.getAddr(dbgAddrBreak));
                for (var n = 0; n < nb; n++) {
                    if (addr + n == addrBreak) {
                        var a;
                        fBreak = true;
                        if (dbgAddrBreak.fTempBreak) {
                            this.findBreakpoint(aBreak, dbgAddrBreak, true, true);
                            fTempBreak = true;
                        }
                        if (a = dbgAddrBreak.aCmds) {
                            /*
                             * When one or more commands are attached to a breakpoint, we don't halt by default.
                             * Instead, we set fBreak to true only if, at the completion of all the commands, the
                             * CPU is halted; in other words, you should include "h" as one of the breakpoint commands
                             * if you want the breakpoint to stop execution.
                             *
                             * Another useful command is "if", which will return false if the expression is false,
                             * at which point we'll jump ahead to the next "else" command, and if there isn't an "else",
                             * we abort.
                             */
                            fBreak = false;
                            for (var j = 0; j < a.length; j++) {
                                if (!this.doCommand(a[j], true)) {
                                    if (a[j].indexOf("if")) {
                                        fBreak = true;          // the failed command wasn't "if", so abort
                                        break;
                                    }
                                    var k = j + 1;
                                    for (; k < a.length; k++) {
                                        if (!a[k].indexOf("else")) break;
                                        j++;
                                    }
                                    if (k == a.length) {        // couldn't find an "else" after the "if", so abort
                                        fBreak = true;
                                        break;
                                    }
                                    /*
                                     * If we're still here, we'll execute the "else" command (which is just a no-op),
                                     * followed by any remaining commands.
                                     */
                                }
                            }
                            if (!this.cpu.isRunning()) fBreak = true;
                        }
                        if (fBreak) {
                            if (!fTempBreak) this.printBreakpoint(aBreak, i, "hit");
                            break;
                        }
                    }
                }
            }
        }

        this.nSuppressBreaks--;

        return fBreak;
    }

    /**
     * getInstruction(dbgAddr, sComment, nSequence)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {string} [sComment] is an associated comment
     * @param {number|null} [nSequence] is an associated sequence number, null or undefined if none
     * @return {string} (and dbgAddr is updated to the next instruction)
     */
    getInstruction(dbgAddr, sComment, nSequence)
    {
        var dbgAddrIns = this.newAddr(dbgAddr.off, dbgAddr.sel, dbgAddr.addr, dbgAddr.type);

        var bOpcode = this.getByte(dbgAddr, 1);

        /*
         * Incorporate OPERAND and ADDRESS size prefixes into the current instruction.
         *
         * And the verdict is in: redundant OPERAND and ADDRESS prefixes must be ignored;
         * see opOS() and opAS() for details.  We limit the amount of redundancy to something
         * reasonable (ie, 4).
         */
        var cMaxOverrides = 4, cOverrides = 0;
        var fDataPrefix = false, fAddrPrefix = false;

        while ((bOpcode == X86.OPCODE.OS || bOpcode == X86.OPCODE.AS) && cMaxOverrides--) {
            if (bOpcode == X86.OPCODE.OS) {
                if (!fDataPrefix) {
                    dbgAddr.fData32 = !dbgAddr.fData32;
                    fDataPrefix = true;
                }
                cOverrides++;
            } else {
                if (!fAddrPrefix) {
                    dbgAddr.fAddr32 = !dbgAddr.fAddr32;
                    fAddrPrefix = true;
                }
                cOverrides++;
            }
            bOpcode = this.getByte(dbgAddr, 1);
        }

        var bModRM = -1;
        var asOpcodes = DebuggerX86.INS_NAMES;
        var aOpDesc = this.aaOpDescs[bOpcode];
        var iIns = aOpDesc[0];

        if (iIns == DebuggerX86.INS.OP0F) {
            var b = this.getByte(dbgAddr, 1);
            aOpDesc = DebuggerX86.aaOp0FDescs[b] || DebuggerX86.aOpDescUndefined;
            bOpcode |= (b << 8);
            iIns = aOpDesc[0];
        }

        if (iIns == DebuggerX86.INS.ESC) {
            bModRM = this.getByte(dbgAddr, 1);
            var aOpFPUDesc = this.getFPUInstruction(bOpcode, bModRM);
            if (aOpFPUDesc) {
                asOpcodes = DebuggerX86.FINS_NAMES;
                aOpDesc = aOpFPUDesc;
                iIns = aOpDesc[0];
            }
        }

        if (iIns >= asOpcodes.length) {
            bModRM = this.getByte(dbgAddr, 1);
            aOpDesc = DebuggerX86.aaGrpDescs[iIns - asOpcodes.length][(bModRM >> 3) & 0x7];
            iIns = aOpDesc[0];
        }

        var sOpcode = asOpcodes[iIns];
        var cOperands = aOpDesc.length - 1;
        var sOperands = "";

        if (dbgAddr.fData32) {
            if (iIns == DebuggerX86.INS.CBW) {
                sOpcode = "CWDE";           // sign-extend AX into EAX, instead of AL into AX
            }
            else if (iIns == DebuggerX86.INS.CWD) {
                sOpcode = "CDQ";            // sign-extend EAX into EDX:EAX, instead of AX into DX:AX
            }
            else if (iIns >= DebuggerX86.INS.POPA && iIns <= DebuggerX86.INS.PUSHA) {
                sOpcode += 'D';             // transform POPA/POPF/PUSHF/PUSHA to POPAD/POPFD/PUSHFD/PUSHAD as appropriate
            }
        }
        if (this.isStringIns(bOpcode)) {
            cOperands = 0;              // suppress operands for string instructions, and add 'D' suffix as appropriate
            if (dbgAddr.fData32 && sOpcode.slice(-1) == 'W') sOpcode = sOpcode.slice(0, -1) + 'D';
        }

        var typeCPU = -1;
        var fComplete = true;

        for (var iOperand = 1; iOperand <= cOperands; iOperand++) {

            var disp, off, cch;
            var sOperand = "";
            var type = aOpDesc[iOperand];
            if (type === undefined) continue;

            if (typeCPU < 0) typeCPU = type >> DebuggerX86.TYPE_CPU_SHIFT;

            if (iIns == DebuggerX86.INS.LOADALL) {
                if (typeCPU == DebuggerX86.CPU_80286) {
                    sOperands = "[%800]";
                } else if (typeCPU == DebuggerX86.CPU_80386) {
                    sOperands = "ES:[" + (dbgAddr.fAddr32? 'E':'') + "DI]";
                }
            }

            var typeSize = type & DebuggerX86.TYPE_SIZE;
            if (typeSize == DebuggerX86.TYPE_NONE) {
                continue;
            }
            if (typeSize == DebuggerX86.TYPE_PREFIX) {
                fComplete = false;
                continue;
            }
            var typeMode = type & DebuggerX86.TYPE_MODE;
            if (typeMode >= DebuggerX86.TYPE_MODRM) {
                if (bModRM < 0) {
                    bModRM = this.getByte(dbgAddr, 1);
                }
                if (typeMode < DebuggerX86.TYPE_MODREG) {
                    /*
                     * This test also encompasses TYPE_MODMEM, which is basically the inverse of the case
                     * below (ie, only Mod values *other* than 11 are allowed); however, I believe that in
                     * some cases that's merely a convention, and that if you try to execute an instruction
                     * like "LEA AX,BX", it will actually do something (on some if not all processors), so
                     * there's probably some diagnostic value in allowing those cases to be disassembled.
                     */
                    sOperand = this.getModRMOperand(sOpcode, bModRM, type, cOperands, dbgAddr);
                }
                else if (typeMode == DebuggerX86.TYPE_MODREG) {
                    /*
                     * TYPE_MODREG instructions assume that Mod is 11 (only certain early 80486 steppings
                     * actually *required* that Mod contain 11) and always treat RM as a register (which we
                     * could also simulate by setting Mod to 11 and letting getModRMOperand() do its thing).
                     */
                    sOperand = this.getRegOperand(bModRM & 0x7, type, dbgAddr);
                }
                else {
                    /*
                     * All remaining cases are register-based (eg, TYPE_REG); getRegOperand() will figure out which.
                     */
                    sOperand = this.getRegOperand((bModRM >> 3) & 0x7, type, dbgAddr);
                }
            }
            else if (typeMode == DebuggerX86.TYPE_ONE) {
                sOperand = '1';
            }
            else if (typeMode == DebuggerX86.TYPE_IMM) {
                sOperand = this.getImmOperand(type, dbgAddr);
            }
            else if (typeMode == DebuggerX86.TYPE_IMMOFF) {
                if (!dbgAddr.fAddr32) {
                    cch = 4;
                    off = this.getShort(dbgAddr, 2);
                } else {
                    cch = 8;
                    off = this.getLong(dbgAddr, 4);
                }
                sOperand = '[' + Str.toHex(off, cch) + ']';
            }
            else if (typeMode == DebuggerX86.TYPE_IMMREL) {
                if (typeSize == DebuggerX86.TYPE_BYTE) {
                    disp = ((this.getByte(dbgAddr, 1) << 24) >> 24);
                }
                else {
                    disp = this.getWord(dbgAddr, true);
                }
                off = (dbgAddr.off + disp) & (dbgAddr.fData32? -1 : 0xffff);
                sOperand = Str.toHex(off, dbgAddr.fData32? 8: 4);
                var aSymbol = this.findSymbol(this.newAddr(off, dbgAddr.sel));
                if (aSymbol[0]) sOperand += " (" + aSymbol[0] + ")";
            }
            else if (typeMode == DebuggerX86.TYPE_IMPREG) {
                if (typeSize == DebuggerX86.TYPE_ST) {
                    sOperand = "ST";
                } else if (typeSize == DebuggerX86.TYPE_STREG) {
                    sOperand = "ST(" + (bModRM & 0x7) + ")";
                } else {
                    sOperand = this.getRegOperand((type & DebuggerX86.TYPE_IREG) >> 8, type, dbgAddr);
                }
            }
            else if (typeMode == DebuggerX86.TYPE_IMPSEG) {
                sOperand = this.getRegOperand((type & DebuggerX86.TYPE_IREG) >> 8, DebuggerX86.TYPE_SEGREG, dbgAddr);
            }
            else if (typeMode == DebuggerX86.TYPE_DSSI) {
                sOperand = "DS:[SI]";
            }
            else if (typeMode == DebuggerX86.TYPE_ESDI) {
                sOperand = "ES:[DI]";
            }
            if (!sOperand || !sOperand.length) {
                sOperands = "INVALID";
                break;
            }
            if (sOperands.length > 0) sOperands += ',';
            sOperands += (sOperand || "???");
        }

        var sBytes = "";
        var sLine = this.toHexAddr(dbgAddrIns) + ' ';
        if (dbgAddrIns.addr !== X86.ADDR_INVALID && dbgAddr.addr !== X86.ADDR_INVALID) {
            do {
                sBytes += Str.toHex(this.getByte(dbgAddrIns, 1), 2);
                if (dbgAddrIns.addr == null) break;
            } while (dbgAddrIns.addr != dbgAddr.addr);
        }

        sLine += Str.pad(sBytes, dbgAddrIns.fAddr32? 25 : 17);
        sLine += Str.pad(sOpcode, 8);
        if (sOperands) sLine += ' ' + sOperands;

        if (this.cpu.model < DebuggerX86.CPUS[typeCPU]) {
            sComment = DebuggerX86.CPUS[typeCPU] + " CPU only";
        }

        if (sComment && fComplete) {
            sLine = Str.pad(sLine, dbgAddrIns.fAddr32? 74 : 62) + ';' + sComment;
            if (!this.cpu.flags.checksum) {
                sLine += (nSequence != null? '=' + nSequence.toString() : "");
            } else {
                var nCycles = this.cpu.getCycles();
                sLine += "cycles=" + nCycles.toString() + " cs=" + Str.toHex(this.cpu.counts.nChecksum);
            }
        }

        this.initAddrSize(dbgAddr, fComplete, cOverrides);
        return sLine;
    }

    /**
     * getFPUInstruction(bOpcode, bModRM)
     *
     * @this {DebuggerX86}
     * @param {number} bOpcode
     * @param {number} bModRM
     * @return {Array|null} (FPU instruction group, or null if none)
     */
    getFPUInstruction(bOpcode, bModRM)
    {
        var aOpDesc = null;

        var mod = (bModRM >> 6) & 0x3;
        var reg = (bModRM >> 3) & 0x7;
        var r_m = (bModRM & 0x7);

        /*
         * Similar to how opFPU() decodes FPU instructions, we combine mod and reg into one
         * decodable value: put mod in the high nibble and reg in the low nibble, after first
         * collapsing all mod values < 3 to zero.
         */
        var modReg = (mod < 3? 0 : 0x30) + reg;

        /*
         * All values >= 0x34 imply mod == 3 and reg >= 4, so now we shift reg into the high
         * nibble and r_m into the low, yielding values >= 0x40.
         */
        if ((bOpcode == X86.OPCODE.ESC1 || bOpcode == X86.OPCODE.ESC3) && modReg >= 0x34) {
            modReg = (reg << 4) | r_m;
        }

        var aaOpDesc = DebuggerX86.aaaOpFPUDescs[bOpcode];
        if (aaOpDesc) aOpDesc = aaOpDesc[modReg];

        return aOpDesc;
    }

    /**
     * getImmOperand(type, dbgAddr)
     *
     * @this {DebuggerX86}
     * @param {number} type
     * @param {DbgAddrX86} dbgAddr
     * @return {string} operand
     */
    getImmOperand(type, dbgAddr)
    {
        var sOperand = ' ';
        var typeSize = type & DebuggerX86.TYPE_SIZE;

        switch (typeSize) {
        case DebuggerX86.TYPE_BYTE:
            /*
             * There's the occasional immediate byte we don't need to display (eg, the 0x0A
             * following an AAM or AAD instruction), so we suppress the byte if it lacks a TYPE_IN
             * or TYPE_OUT designation (and TYPE_BOTH, as the name implies, includes both).
             */
            if (type & DebuggerX86.TYPE_BOTH) {
                sOperand = Str.toHex(this.getByte(dbgAddr, 1), 2);
            }
            break;
        case DebuggerX86.TYPE_SBYTE:
            sOperand = Str.toHex((this.getByte(dbgAddr, 1) << 24) >> 24, dbgAddr.fData32? 8: 4);
            break;
        case DebuggerX86.TYPE_WORD:
            if (dbgAddr.fData32) {
                sOperand = Str.toHex(this.getLong(dbgAddr, 4));
                break;
            }
            /* falls through */
        case DebuggerX86.TYPE_SHORT:
            sOperand = Str.toHex(this.getShort(dbgAddr, 2), 4);
            break;
        case DebuggerX86.TYPE_FARP:
            dbgAddr = this.newAddr(this.getWord(dbgAddr, true), this.getShort(dbgAddr, 2), null, dbgAddr.type, dbgAddr.fData32, dbgAddr.fAddr32);
            sOperand = this.toHexAddr(dbgAddr);
            var aSymbol = this.findSymbol(dbgAddr);
            if (aSymbol[0]) sOperand += " (" + aSymbol[0] + ")";
            break;
        default:
            sOperand = "imm(" + Str.toHexWord(type) + ')';
            break;
        }
        return sOperand;
    }

    /**
     * getRegOperand(bReg, type, dbgAddr)
     *
     * @this {DebuggerX86}
     * @param {number} bReg
     * @param {number} type
     * @param {DbgAddrX86} dbgAddr
     * @return {string} operand
     */
    getRegOperand(bReg, type, dbgAddr)
    {
        var typeMode = type & DebuggerX86.TYPE_MODE;
        if (typeMode == DebuggerX86.TYPE_SEGREG) {
            if (bReg > DebuggerX86.REG_GS ||
                bReg >= DebuggerX86.REG_FS && this.cpu.model < X86.MODEL_80386) return "??";
            bReg += DebuggerX86.REG_SEG;
        }
        else if (typeMode == DebuggerX86.TYPE_CTLREG) {
            bReg += DebuggerX86.REG_CR0;
        }
        else if (typeMode == DebuggerX86.TYPE_DBGREG) {
            bReg += DebuggerX86.REG_DR0;
        }
        else if (typeMode == DebuggerX86.TYPE_TSTREG) {
            bReg += DebuggerX86.REG_TR0;
        }
        else {
            var typeSize = type & DebuggerX86.TYPE_SIZE;
            if (typeSize >= DebuggerX86.TYPE_SHORT) {
                if (bReg < DebuggerX86.REG_AX) {
                    bReg += DebuggerX86.REG_AX - DebuggerX86.REG_AL;
                }
                if (typeSize == DebuggerX86.TYPE_LONG || typeSize == DebuggerX86.TYPE_WORD && dbgAddr.fData32) {
                    bReg += DebuggerX86.REG_EAX - DebuggerX86.REG_AX;
                }
            }
        }
        return DebuggerX86.REGS[bReg];
    }

    /**
     * getSIBOperand(bMod, dbgAddr)
     *
     * @this {DebuggerX86}
     * @param {number} bMod
     * @param {DbgAddrX86} dbgAddr
     * @return {string} operand
     */
    getSIBOperand(bMod, dbgAddr)
    {
        var bSIB = this.getByte(dbgAddr, 1);
        var bScale = bSIB >> 6;
        var bIndex = (bSIB >> 3) & 0x7;
        var bBase = bSIB & 0x7;
        var sOperand = "";
        /*
         * Unless bMod is zero AND bBase is 5, there's always a base register.
         */
        if (bMod || bBase != 5) {
            sOperand = DebuggerX86.RMS[bBase + 8];
        }
        if (bIndex != 4) {
            if (sOperand) sOperand += '+';
            sOperand += DebuggerX86.RMS[bIndex + 8];
            if (bScale) sOperand += '*' + (0x1 << bScale);
        }
        /*
         * If bMod is zero AND bBase is 5, there's a 32-bit displacement instead of a base register.
         */
        if (!bMod && bBase == 5) {
            if (sOperand) sOperand += '+';
            sOperand += Str.toHex(this.getLong(dbgAddr, 4));
        }
        return sOperand;
    }

    /**
     * getModRMOperand(sOpcode, bModRM, type, cOperands, dbgAddr)
     *
     * @this {DebuggerX86}
     * @param {string} sOpcode
     * @param {number} bModRM
     * @param {number} type
     * @param {number} cOperands (if 1, memory operands are prefixed with the size; otherwise, size can be inferred)
     * @param {DbgAddrX86} dbgAddr
     * @return {string} operand
     */
    getModRMOperand(sOpcode, bModRM, type, cOperands, dbgAddr)
    {
        var sOperand = "";
        var bMod = bModRM >> 6;
        var bRM = bModRM & 0x7;
        if (bMod < 3) {
            var disp;
            var fInteger = (sOpcode.indexOf("FI") == 0);
            if (!bMod && (!dbgAddr.fAddr32 && bRM == 6 || dbgAddr.fAddr32 && bRM == 5)) {
                bMod = 2;
            } else {
                if (dbgAddr.fAddr32) {
                    if (bRM != 4) {
                        bRM += 8;
                    } else {
                        sOperand = this.getSIBOperand(bMod, dbgAddr);
                    }
                }
                if (!sOperand) sOperand = DebuggerX86.RMS[bRM];
            }
            if (bMod == 1) {
                disp = this.getByte(dbgAddr, 1);
                if (!(disp & 0x80)) {
                    sOperand += '+' + Str.toHex(disp, 2);
                }
                else {
                    disp = ((disp << 24) >> 24);
                    sOperand += '-' + Str.toHex(-disp, 2);
                }
            }
            else if (bMod == 2) {
                if (sOperand) sOperand += '+';
                if (!dbgAddr.fAddr32) {
                    disp = this.getShort(dbgAddr, 2);
                    sOperand += Str.toHex(disp, 4);
                } else {
                    disp = this.getLong(dbgAddr, 4);
                    sOperand += Str.toHex(disp);
                }
            }
            sOperand = '[' + sOperand + ']';
            if (cOperands == 1) {
                var sPrefix = "";
                type &= DebuggerX86.TYPE_SIZE;
                if (type == DebuggerX86.TYPE_WORD) {
                    type = (dbgAddr.fData32? DebuggerX86.TYPE_LONG : DebuggerX86.TYPE_SHORT);
                }
                switch(type) {
                case DebuggerX86.TYPE_FARP:
                    sPrefix = "FAR";
                    break;
                case DebuggerX86.TYPE_BYTE:
                    sPrefix = "BYTE";
                    break;
                case DebuggerX86.TYPE_SHORT:
                    if (fInteger) {
                        sPrefix = "INT16";
                        break;
                    }
                    /* falls through */
                    sPrefix = "WORD";
                    break;
                case DebuggerX86.TYPE_LONG:
                    sPrefix = "DWORD";
                    break;
                case DebuggerX86.TYPE_SINT:
                    if (fInteger) {
                        sPrefix = "INT32";
                        break;
                    }
                    /* falls through */
                case DebuggerX86.TYPE_SREAL:
                    sPrefix = "REAL32";
                    break;
                case DebuggerX86.TYPE_LINT:
                    if (fInteger) {
                        sPrefix = "INT64";
                        break;
                    }
                    /* falls through */
                case DebuggerX86.TYPE_LREAL:
                    sPrefix = "REAL64";
                    break;
                case DebuggerX86.TYPE_TREAL:
                    sPrefix = "REAL80";
                    break;
                case DebuggerX86.TYPE_BCD80:
                    sPrefix = "BCD80";
                    break;
                }
                if (sPrefix) sOperand = sPrefix + ' ' + sOperand;
            }
        }
        else {
            sOperand = this.getRegOperand(bRM, type, dbgAddr);
        }
        return sOperand;
    }

    /**
     * parseInstruction(sOp, sOperand, addr)
     *
     * TODO: Unimplemented.  See parseInstruction() in modules/c1pjs/lib/debugger.js for a working implementation.
     *
     * @this {DebuggerX86}
     * @param {string} sOp
     * @param {string|undefined} sOperand
     * @param {DbgAddrX86} dbgAddr of memory where this instruction is being assembled
     * @return {Array.<number>} of opcode bytes; if the instruction can't be parsed, the array will be empty
     */
    parseInstruction(sOp, sOperand, dbgAddr)
    {
        var aOpBytes = [];
        this.println("not supported yet");
        return aOpBytes;
    }

    /**
     * getFlagOutput(sFlag)
     *
     * @this {DebuggerX86}
     * @param {string} sFlag
     * @return {string} value of flag
     */
    getFlagOutput(sFlag)
    {
        var b;
        switch (sFlag) {
        case 'V':
            b = this.cpu.getOF();
            break;
        case 'D':
            b = this.cpu.getDF();
            break;
        case 'I':
            b = this.cpu.getIF();
            break;
        case 'T':
            b = this.cpu.getTF();
            break;
        case 'S':
            b = this.cpu.getSF();
            break;
        case 'Z':
            b = this.cpu.getZF();
            break;
        case 'A':
            b = this.cpu.getAF();
            break;
        case 'P':
            b = this.cpu.getPF();
            break;
        case 'C':
            b = this.cpu.getCF();
            break;
        default:
            b = 0;
            break;
        }
        return sFlag + (b? '1' : '0') + ' ';
    }

    /**
     * getLimitString(l)
     *
     * @this {DebuggerX86}
     * @param {number} l
     * @return {string}
     */
    getLimitString(l)
    {
        return Str.toHex(l, (l & ~0xffff)? 8 : 4);
    }

    /**
     * getRegOutput(iReg)
     *
     * @this {DebuggerX86}
     * @param {number} iReg
     * @return {string}
     */
    getRegOutput(iReg)
    {
        if (iReg >= DebuggerX86.REG_AX && iReg <= DebuggerX86.REG_DI && this.cchReg > 4) iReg += DebuggerX86.REG_EAX - DebuggerX86.REG_AX;
        var sReg = DebuggerX86.REGS[iReg];
        if (iReg == DebuggerX86.REG_CR0 && this.cpu.model == X86.MODEL_80286) sReg = "MS";
        return sReg + '=' + this.getRegString(iReg) + ' ';
    }

    /**
     * getSegOutput(seg, fProt)
     *
     * @this {DebuggerX86}
     * @param {X86Seg} seg
     * @param {boolean} [fProt]
     * @return {string}
     */
    getSegOutput(seg, fProt)
    {
        return seg.sName + '=' + Str.toHex(seg.sel, 4) + (fProt? '[' + Str.toHex(seg.base, this.cchAddr) + ',' + this.getLimitString(seg.limit) + ']' : "");
    }

    /**
     * getDTROutput(sName, sel, addr, addrLimit)
     *
     * @this {DebuggerX86}
     * @param {string} sName
     * @param {number|null} sel
     * @param {number} addr
     * @param {number} addrLimit
     * @return {string}
     */
    getDTROutput(sName, sel, addr, addrLimit)
    {
        return sName + '=' + (sel != null? Str.toHex(sel, 4) : "") + '[' + Str.toHex(addr, this.cchAddr) + ',' + Str.toHex(addrLimit - addr, 4) + ']';
    }

    /**
     * getRegDump(fProt)
     *
     * Sample 8086 and 80286 real-mode register dump:
     *
     *      AX=0000 BX=0000 CX=0000 DX=0000 SP=0000 BP=0000 SI=0000 DI=0000
     *      SS=0000 DS=0000 ES=0000 PS=0002 V0 D0 I0 T0 S0 Z0 A0 P0 C0
     *      F000:FFF0 EA5BE000F0    JMP      F000:E05B
     *
     * Sample 80386 real-mode register dump:
     *
     *      EAX=00000000 EBX=00000000 ECX=00000000 EDX=00000000
     *      ESP=00000000 EBP=00000000 ESI=00000000 EDI=00000000
     *      SS=0000 DS=0000 ES=0000 FS=0000 GS=0000 PS=00000002 V0 D0 I0 T0 S0 Z0 A0 P0 C0
     *      F000:FFF0 EA05F900F0    JMP      F000:F905
     *
     * Sample 80286 protected-mode register dump:
     *
     *      AX=0000 BX=0000 CX=0000 DX=0000 SP=0000 BP=0000 SI=0000 DI=0000
     *      SS=0000[000000,FFFF] DS=0000[000000,FFFF] ES=0000[000000,FFFF] A20=ON
     *      CS=F000[FF0000,FFFF] LD=0000[000000,FFFF] GD=[000000,FFFF] ID=[000000,03FF]
     *      TR=0000 MS=FFF0 PS=0002 V0 D0 I0 T0 S0 Z0 A0 P0 C0
     *      F000:FFF0 EA5BE000F0    JMP      F000:E05B
     *
     * Sample 80386 protected-mode register dump:
     *
     *      EAX=00000000 EBX=00000000 ECX=00000000 EDX=00000000
     *      ESP=00000000 EBP=00000000 ESI=00000000 EDI=00000000
     *      SS=0000[00000000,FFFF] DS=0000[00000000,FFFF] ES=0000[00000000,FFFF]
     *      CS=F000[FFFF0000,FFFF] FS=0000[00000000,FFFF] GS=0000[00000000,FFFF]
     *      LD=0000[00000000,FFFF] GD=[00000000,FFFF] ID=[00000000,03FF] TR=0000 A20=ON
     *      CR0=00000010 CR2=00000000 CR3=00000000 PS=00000002 V0 D0 I0 T0 S0 Z0 A0 P0 C0
     *      F000:0000FFF0 EA05F900F0    JMP      F000:0000F905
     *
     * This no longer includes CS in real-mode (or EIP in any mode), because that information can be obtained from the
     * first line of disassembly, which an "r" or "rp" command will also display.
     *
     * Note that even when the processor is in real mode, you can always use the "rp" command to force a protected-mode
     * dump, in case you need to verify any selector base or limit values, since those also affect real-mode operation.
     *
     * @this {DebuggerX86}
     * @param {boolean} [fProt]
     * @return {string}
     */
    getRegDump(fProt)
    {
        var s;
        if (fProt === undefined) fProt = this.getCPUMode();

        s = this.getRegOutput(DebuggerX86.REG_AX) +
            this.getRegOutput(DebuggerX86.REG_BX) +
            this.getRegOutput(DebuggerX86.REG_CX) +
            this.getRegOutput(DebuggerX86.REG_DX) + (this.cchReg > 4? '\n' : '') +
            this.getRegOutput(DebuggerX86.REG_SP) +
            this.getRegOutput(DebuggerX86.REG_BP) +
            this.getRegOutput(DebuggerX86.REG_SI) +
            this.getRegOutput(DebuggerX86.REG_DI) + '\n' +
            this.getSegOutput(this.cpu.segSS, fProt) + ' ' +
            this.getSegOutput(this.cpu.segDS, fProt) + ' ' +
            this.getSegOutput(this.cpu.segES, fProt) + ' ';

        if (fProt) {
            var sTR = "TR=" + Str.toHex(this.cpu.segTSS.sel, 4);
            var sA20 = "A20=" + (this.bus.getA20()? "ON " : "OFF ");
            if (this.cpu.model < X86.MODEL_80386) {
                sTR = '\n' + sTR;
                s += sA20; sA20 = '';
            }
            s += '\n' + this.getSegOutput(this.cpu.segCS, fProt) + ' ';
            if (I386 && this.cpu.model >= X86.MODEL_80386) {
                sA20 += '\n';
                s += this.getSegOutput(this.cpu.segFS, fProt) + ' ' +
                     this.getSegOutput(this.cpu.segGS, fProt) + '\n';
            }
            s += this.getDTROutput("LD", this.cpu.segLDT.sel, this.cpu.segLDT.base, this.cpu.segLDT.base + this.cpu.segLDT.limit) + ' ' +
                 this.getDTROutput("GD", null, this.cpu.addrGDT, this.cpu.addrGDTLimit) + ' ' +
                 this.getDTROutput("ID", null, this.cpu.addrIDT, this.cpu.addrIDTLimit) + ' ';
            s += sTR + ' ' + sA20;
            s += this.getRegOutput(DebuggerX86.REG_CR0);
            if (I386 && this.cpu.model >= X86.MODEL_80386) {
                s += this.getRegOutput(DebuggerX86.REG_CR2) + this.getRegOutput(DebuggerX86.REG_CR3);
            }
        } else {
            if (I386 && this.cpu.model >= X86.MODEL_80386) {
                s += this.getSegOutput(this.cpu.segFS, fProt) + ' ' +
                     this.getSegOutput(this.cpu.segGS, fProt) + ' ';
            }
        }

        s += this.getRegOutput(DebuggerX86.REG_PS) +
             this.getFlagOutput('V') + this.getFlagOutput('D') + this.getFlagOutput('I') + this.getFlagOutput('T') +
             this.getFlagOutput('S') + this.getFlagOutput('Z') + this.getFlagOutput('A') + this.getFlagOutput('P') + this.getFlagOutput('C');

        return s;
    }

    /**
     * comparePairs(p1, p2)
     *
     * @this {DebuggerX86}
     * @param {number|string|Array|Object} p1
     * @param {number|string|Array|Object} p2
     * @return {number}
     */
    comparePairs(p1, p2)
    {
        return p1[0] > p2[0]? 1 : p1[0] < p2[0]? -1 : 0;
    }

    /**
     * addSymbols(sModule, nSegment, sel, off, addr, len, aSymbols)
     *
     * As filedump.js (formerly convrom.php) explains, aSymbols is a JSON-encoded object whose properties consist
     * of all the symbols (in upper-case), and the values of those properties are objects containing any or all of
     * the following properties:
     *
     *      'v': the value of an absolute (unsized) value
     *      'b': either 1, 2, 4 or undefined if an unsized value
     *      's': either a hard-coded segment or undefined
     *      'o': the offset of the symbol within the associated address space
     *      'l': the original-case version of the symbol, present only if it wasn't originally upper-case
     *      'a': annotation for the specified offset; eg, the original assembly language, with optional comment
     *
     * To that list of properties, we also add:
     *
     *      'p': the physical address (calculated whenever both 's' and 'o' properties are defined)
     *
     * Note that values for any 'v', 'b', 's' and 'o' properties are unquoted decimal values, and the values
     * for any 'l' or 'a' properties are quoted strings. Also, if double-quotes were used in any of the original
     * annotation ('a') values, they will have been converted to two single-quotes, so we're responsible for
     * converting them back to individual double-quotes.
     *
     * For example:
     *      {
     *          'HF_PORT': {
     *              'v':800
     *          },
     *          'HDISK_INT': {
     *              'b':4, 's':0, 'o':52
     *          },
     *          'ORG_VECTOR': {
     *              'b':4, 's':0, 'o':76
     *          },
     *          'CMD_BLOCK': {
     *              'b':1, 's':64, 'o':66
     *          },
     *          'DISK_SETUP': {
     *              'o':3
     *          },
     *          '.40': {
     *              'o':40, 'a':"MOV AX,WORD PTR ORG_VECTOR ;GET DISKETTE VECTOR"
     *          }
     *      }
     *
     * If a symbol only has an offset, then that offset value can be assigned to the symbol property directly:
     *
     *          'DISK_SETUP': 3
     *
     * The last property is an example of an "anonymous" entry, for offsets where there is no associated symbol.
     * Such entries are identified by a period followed by a unique number (usually the offset of the entry), and
     * they usually only contain offset ('o') and annotation ('a') properties.  I could eliminate the leading
     * period, but it offers a very convenient way of quickly discriminating among genuine vs. anonymous symbols.
     *
     * We add all these entries to our internal symbol table, which is an array of 4-element arrays, each of which
     * look like:
     *
     *      [sel, off, addr, len, aSymbols, aOffsets]
     *
     * There are two basic symbol operations: findSymbol(), which takes an address and finds the symbol, if any,
     * at that address, and findSymbolAddr(), which takes a string and attempts to match it to a non-anonymous
     * symbol with a matching offset ('o') property.
     *
     * To implement findSymbol() efficiently, addSymbols() creates an array of [offset, sSymbol] pairs
     * (aOffsets), one pair for each symbol that corresponds to an offset within the specified address space.
     *
     * We guarantee the elements of aOffsets are in offset order, because we build it using binaryInsert();
     * it's quite likely that the MAP file already ordered all its symbols in offset order, but since they're
     * hand-edited files, we can't assume that, and we need to ensure that findSymbol()'s binarySearch() operates
     * properly.
     *
     * @this {DebuggerX86}
     * @param {string|null} sModule
     * @param {number} nSegment (zero if undefined)
     * @param {number} sel (the default segment/selector for all symbols in this group)
     * @param {number} off (from the base of the given selector)
     * @param {number|null} addr (physical address where the symbols are located, if the memory is physical; eg, ROM)
     * @param {number} len (the size of the region, in bytes)
     * @param {Object} aSymbols (collection of symbols in this group; the format of this collection is described below)
     */
    addSymbols(sModule, nSegment, sel, off, addr, len, aSymbols)
    {
        var dbgAddr = {};
        var aOffsets = [];
        for (var sSymbol in aSymbols) {
            var symbol = aSymbols[sSymbol];
            if (typeof symbol == "number") {
                aSymbols[sSymbol] = symbol = {'o': symbol};
            }
            var offSymbol = symbol['o'];
            var selSymbol = symbol['s'];
            var sAnnotation = symbol['a'];
            if (offSymbol !== undefined) {
                if (selSymbol !== undefined) {
                    dbgAddr.off = offSymbol;
                    dbgAddr.sel = selSymbol;
                    dbgAddr.addr = null;
                    /*
                     * getAddr() computes the corresponding physical address and saves it in dbgAddr.addr.
                     */
                    this.getAddr(dbgAddr);
                    /*
                     * The physical address for any symbol located in the top 64Kb of the machine's address space
                     * should be relocated to the top 64Kb of the first 1Mb, so that we're immune from any changes
                     * to the A20 line.
                     */
                    if ((dbgAddr.addr & ~0xffff) == (this.bus.nBusLimit & ~0xffff)) {
                        dbgAddr.addr &= 0x000fffff;
                    }
                    symbol['p'] = dbgAddr.addr;
                }
                Usr.binaryInsert(aOffsets, [offSymbol >>> 0, sSymbol], this.comparePairs);
            }
            if (sAnnotation) symbol['a'] = sAnnotation.replace(/''/g, "\"");
        }
        var symbolTable = {
            sModule: sModule,
            nSegment: nSegment,
            sel: sel,
            off: off,
            addr: addr,
            len: len,
            aSymbols: aSymbols,
            aOffsets: aOffsets
        };
        this.aSymbolTable.push(symbolTable);
    }

    /**
     * removeSymbols(sModule, nSegment)
     *
     * @this {DebuggerX86}
     * @param {string|null} sModule
     * @param {number} [nSegment] (segment # if sModule set, selector if sModule clear)
     * @return {string|null} name of the module removed, or null if no module was found
     */
    removeSymbols(sModule, nSegment)
    {
        var sModuleRemoved = null;
        for (var iTable = 0; iTable < this.aSymbolTable.length; iTable++) {
            var symbolTable = this.aSymbolTable[iTable];
            if (sModule && symbolTable.sModule != sModule) continue;
            if (sModule && nSegment == symbolTable.nSegment || !sModule && nSegment == symbolTable.sel) {
                sModuleRemoved = symbolTable.sModule;
                this.aSymbolTable.splice(iTable, 1);
                break;
            }
        }
        return sModuleRemoved;
    }

    /**
     * dumpSymbols()
     *
     * TODO: Add "numerical" and "alphabetical" dump options. This is simply dumping them in whatever
     * order they appeared in the original MAP file.
     *
     * @this {DebuggerX86}
     */
    dumpSymbols()
    {
        for (var iTable = 0; iTable < this.aSymbolTable.length; iTable++) {
            var symbolTable = this.aSymbolTable[iTable];
            for (var sSymbol in symbolTable.aSymbols) {
                if (sSymbol.charAt(0) == '.') continue;
                var symbol = symbolTable.aSymbols[sSymbol];
                var offSymbol = symbol['o'];
                if (offSymbol === undefined) continue;
                var selSymbol = symbol['s'];
                if (selSymbol === undefined) selSymbol = symbolTable.sel;
                var sSymbolOrig = symbolTable.aSymbols[sSymbol]['l'];
                if (sSymbolOrig) sSymbol = sSymbolOrig;
                this.println(this.toHexOffset(offSymbol, selSymbol) + ' ' + sSymbol);
            }
        }
    }

    /**
     * findSymbol(dbgAddr, fNearest)
     *
     * Search aSymbolTable for dbgAddr, and return an Array for the corresponding symbol (empty if not found).
     *
     * If fNearest is true, and no exact match was found, then the Array returned will contain TWO sets of
     * entries: [0]-[3] will refer to closest preceding symbol, and [4]-[7] will refer to the closest subsequent symbol.
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {boolean} [fNearest]
     * @return {Array} where [0] == symbol name, [1] == symbol value, [2] == any annotation, and [3] == any associated comment
     */
    findSymbol(dbgAddr, fNearest)
    {
        var aSymbol = [];
        var offSymbol = dbgAddr.off >>> 0;
        var addrSymbol = this.getAddr(dbgAddr) >>> 0;
        for (var iTable = 0; iTable < this.aSymbolTable.length; iTable++) {
            var symbolTable = this.aSymbolTable[iTable];
            var sel = symbolTable.sel;
            var off = symbolTable.off >>> 0;
            var addr = symbolTable.addr;
            if (addr != null) addr >>>= 0;
            var len = symbolTable.len;
            if (sel == 0x30) sel = 0x28;        // TODO: Remove this hack once we're able to differentiate Windows 95 ring 0 code and data
            if (sel == dbgAddr.sel && offSymbol >= off && offSymbol < off + len || addr != null && addrSymbol >= addr && addrSymbol < addr + len) {
                var result = Usr.binarySearch(symbolTable.aOffsets, [offSymbol], this.comparePairs);
                if (result >= 0) {
                    this.returnSymbol(iTable, result, aSymbol);
                }
                else if (fNearest) {
                    result = ~result;
                    this.returnSymbol(iTable, result-1, aSymbol);
                    this.returnSymbol(iTable, result, aSymbol);
                }
                break;
            }
        }
        if (!aSymbol.length) {
            var sSymbol = this.bus.getSymbol(addrSymbol, true);
            if (sSymbol) {
                aSymbol.push(sSymbol);
                aSymbol.push(addrSymbol);
            }
        }
        return aSymbol;
    }

    /**
     * findSymbolAddr(sSymbol)
     *
     * Search aSymbolTable for sSymbol, and if found, return a dbgAddr (same as parseAddr())
     *
     * @this {DebuggerX86}
     * @param {string} sSymbol
     * @return {DbgAddrX86|undefined}
     */
    findSymbolAddr(sSymbol)
    {
        var dbgAddr;
        if (sSymbol.match(/^[a-z_][a-z0-9_]*$/i)) {
            var sUpperCase = sSymbol.toUpperCase();
            for (var iTable = 0; iTable < this.aSymbolTable.length; iTable++) {
                var symbolTable = this.aSymbolTable[iTable];
                var symbol = symbolTable.aSymbols[sUpperCase];
                if (symbol !== undefined) {
                    var offSymbol = symbol['o'];
                    if (offSymbol !== undefined) {
                        /*
                         * We assume that every ROM is ORG'ed at 0x0000, and therefore unless the symbol has an
                         * explicitly-defined segment, we return the segment associated with the entire group; for
                         * a ROM, that segment is normally "addrROM >>> 4".  Down the road, we may want/need to
                         * support a special symbol entry (eg, ".ORG") that defines an alternate origin.
                         */
                        var selSymbol = symbol['s'];
                        if (selSymbol === undefined) selSymbol = symbolTable.sel;
                        dbgAddr = this.newAddr(offSymbol, selSymbol, symbol['p']);
                    }
                    /*
                     * The symbol matched, but it wasn't for an address (no 'o' offset), and there's no point
                     * looking any farther, since each symbol appears only once, so we indicate it's an unknown symbol.
                     */
                    break;
                }
            }
        }
        return dbgAddr;
    }

    /**
     * returnSymbol(iTable, iOffset, aSymbol)
     *
     * Helper function for findSymbol().
     *
     * @param {number} iTable
     * @param {number} iOffset
     * @param {Array} aSymbol is updated with the specified symbol, if it exists
     */
    returnSymbol(iTable, iOffset, aSymbol)
    {
        var symbol = {};
        var aOffsets = this.aSymbolTable[iTable].aOffsets;
        var offset = 0, sSymbol = null;
        if (iOffset >= 0 && iOffset < aOffsets.length) {
            offset = aOffsets[iOffset][0];
            sSymbol = aOffsets[iOffset][1];
        }
        if (sSymbol) {
            symbol = this.aSymbolTable[iTable].aSymbols[sSymbol];
            sSymbol = (sSymbol.charAt(0) == '.'? null : (symbol['l'] || sSymbol));
        }
        aSymbol.push(sSymbol);
        aSymbol.push(offset);
        aSymbol.push(symbol['a']);
        aSymbol.push(symbol['c']);
    }

    /**
     * doHelp()
     *
     * @this {DebuggerX86}
     */
    doHelp()
    {
        var s = "commands:";
        for (var sCommand in DebuggerX86.COMMANDS) {
            s += '\n' + Str.pad(sCommand, 7) + DebuggerX86.COMMANDS[sCommand];
        }
        if (!this.checksEnabled()) s += "\nnote: frequency/history disabled if no exec breakpoints";
        this.println(s);
    }

    /**
     * doAssemble(asArgs)
     *
     * This always receives the complete argument array, where the order of the arguments is:
     *
     *      [0]: the assemble command (assumed to be "a")
     *      [1]: the target address (eg, "200")
     *      [2]: the operation code, aka instruction name (eg, "adc")
     *      [3]: the operation mode operand, if any (eg, "14", "[1234]", etc)
     *
     * The Debugger enters "assemble mode" whenever only the first (or first and second) arguments are present.
     * As long as "assemble mode is active, the user can omit the first two arguments on all later assemble commands
     * until "assemble mode" is cancelled with an empty command line; the command processor automatically prepends "a"
     * and the next available target address to the argument array.
     *
     * Entering "assemble mode" is optional; one could enter a series of fully-qualified assemble commands; eg:
     *
     *      a ff00 cld
     *      a ff01 ldx 28
     *      ...
     *
     * without ever entering "assemble mode", but of course, that requires more typing and doesn't take advantage
     * of automatic target address advancement (see dbgAddrAssemble).
     *
     * NOTE: As the previous example implies, you can even assemble new instructions into ROM address space;
     * as our setByte() function explains, the ROM write-notification handlers only refuse writes from the CPU.
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs is the complete argument array, beginning with the "a" command in asArgs[0]
     */
    doAssemble(asArgs)
    {
        var dbgAddr = this.parseAddr(asArgs[1], true);
        if (!dbgAddr) return;

        this.dbgAddrAssemble = dbgAddr;
        if (asArgs[2] === undefined) {
            this.println("begin assemble at " + this.toHexAddr(dbgAddr));
            this.fAssemble = true;
            this.cpu.updateCPU();
            return;
        }

        var aOpBytes = this.parseInstruction(asArgs[2], asArgs[3], dbgAddr);
        if (aOpBytes.length) {
            for (var i = 0; i < aOpBytes.length; i++) {
                this.setByte(dbgAddr, aOpBytes[i], 1);
            }
            /*
             * Since getInstruction() also updates the specified address, dbgAddrAssemble is automatically advanced.
             */
            this.println(this.getInstruction(this.dbgAddrAssemble));
        }
    }

    /**
     * doBreak(sCmd, sAddr, sOptions)
     *
     * As the "help" output below indicates, the following breakpoint commands are supported:
     *
     *      bp [a]  set exec breakpoint on linear addr [a]
     *      br [a]  set read breakpoint on linear addr [a]
     *      bw [a]  set write breakpoint on linear addr [a]
     *      bc [a]  clear breakpoint on linear addr [a] (use "*" for all breakpoints)
     *      bl      list breakpoints
     *
     * to which we have recently added the following I/O breakpoint commands:
     *
     *      bi [p]  toggle input breakpoint on port [p] (use "*" for all input ports)
     *      bo [p]  toggle output breakpoint on port [p] (use "*" for all output ports)
     *
     * These two new commands operate as toggles so that if "*" is used to trap all input (or output),
     * you can also use these commands to NOT trap specific ports.
     *
     *      bn [n]  break after [n] instructions
     *
     * TODO: Update the "bl" command to include any/all I/O breakpoints, and the "bc" command to
     * clear them.  Because "bi" and "bo" commands are piggy-backing on Bus functions, those breakpoints
     * are currently outside the realm of what the "bl" and "bc" commands are aware of.
     *
     * @this {DebuggerX86}
     * @param {string} sCmd
     * @param {string|undefined} [sAddr]
     * @param {string} [sOptions] (the rest of the breakpoint command-line)
     */
    doBreak(sCmd, sAddr, sOptions)
    {
        if (sAddr == '?') {
            this.println("breakpoint commands:");
            this.println("\tbi [p]\ttoggle break on input port [p]");
            this.println("\tbo [p]\ttoggle break on output port [p]");
            this.println("\tbp [a]\tset exec breakpoint at addr [a]");
            this.println("\tbr [a]\tset read breakpoint at addr [a]");
            this.println("\tbw [a]\tset write breakpoint at addr [a]");
            this.println("\tbc [a]\tclear breakpoint at addr [a]");
            this.println("\tbl\tlist all breakpoints");
            this.println("\tbn [n]\tbreak after [n] instruction(s)");
            return;
        }
        var sParm = sCmd.charAt(1);
        if (sParm == 'l') {
            var cBreaks = 0;
            cBreaks += this.listBreakpoints(this.aBreakExec);
            cBreaks += this.listBreakpoints(this.aBreakRead);
            cBreaks += this.listBreakpoints(this.aBreakWrite);
            if (!cBreaks) this.println("no breakpoints");
            return;
        }
        if (sParm == 'n') {
            this.nBreakIns = this.parseValue(sAddr);
            this.println("break after " + this.nBreakIns + " instruction(s)");
            return;
        }
        if (sAddr === undefined) {
            this.println("missing breakpoint address");
            return;
        }
        var dbgAddr = {};
        if (sAddr != '*') {
            dbgAddr = this.parseAddr(sAddr, true, true);
            if (!dbgAddr) return;
        }

        sAddr = (dbgAddr.off == null? sAddr : Str.toHexWord(dbgAddr.off));

        if (sParm == 'c') {
            if (dbgAddr.off == null) {
                this.clearBreakpoints();
                this.println("all breakpoints cleared");
                return;
            }
            if (this.findBreakpoint(this.aBreakExec, dbgAddr, true))
                return;
            if (this.findBreakpoint(this.aBreakRead, dbgAddr, true))
                return;
            if (this.findBreakpoint(this.aBreakWrite, dbgAddr, true))
                return;
            this.println("breakpoint missing: " + this.toHexAddr(dbgAddr));
            return;
        }

        if (sParm == 'i') {
            this.println("breakpoint " + (this.bus.addPortInputBreak(dbgAddr.off)? "enabled" : "cleared") + ": port " + sAddr + " (input)");
            return;
        }

        if (sParm == 'o') {
            this.println("breakpoint " + (this.bus.addPortOutputBreak(dbgAddr.off)? "enabled" : "cleared") + ": port " + sAddr + " (output)");
            return;
        }

        if (dbgAddr.off == null) return;

        this.parseAddrOptions(dbgAddr, sOptions);

        if (sParm == 'p') {
            this.addBreakpoint(this.aBreakExec, dbgAddr);
            return;
        }
        if (sParm == 'r') {
            this.addBreakpoint(this.aBreakRead, dbgAddr);
            return;
        }
        if (sParm == 'w') {
            this.addBreakpoint(this.aBreakWrite, dbgAddr);
            return;
        }
        this.println("unknown breakpoint command: " + sParm);
    }

    /**
     * doClear(sCmd)
     *
     * @this {DebuggerX86}
     * @param {string} [sCmd] (eg, "cls" or "clear")
     */
    doClear(sCmd)
    {
        this.cmp.clearPanel();
    }

    /**
     * doDump(asArgs)
     *
     * For memory dumps, the second parameter (sLen) is interpreted as a length (by default, in hex)
     * only if it contains an 'l' prefix; otherwise it's interpreted as an ending address (inclusive).
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs (formerly sCmd, [sAddr], [sLen] and [sBytes])
     */
    doDump(asArgs)
    {
        var m;
        var sCmd = asArgs[0];
        var sAddr = asArgs[1];
        var sLen = asArgs[2];
        var sBytes = asArgs[3];

        if (sAddr == '?') {
            var sDumpers = "";
            for (m in Messages.CATEGORIES) {
                if (this.afnDumpers[m]) {
                    if (sDumpers) sDumpers += ',';
                    sDumpers += m;
                }
            }
            sDumpers += ",state,symbols";
            this.println("dump memory commands:");
            this.println("\tdb [a] [#]    dump # bytes at address a");
            this.println("\tdw [a] [#]    dump # words at address a");
            this.println("\tdd [a] [#]    dump # dwords at address a");
            this.println("\tdh [#] [#]    dump # instructions from history");
            this.println("\tdi [#]        dump descriptor info for IDT #");
            this.println("\tds [#]        dump descriptor info for selector #");
            if (BACKTRACK) {
                this.println("\tdt [a]        dump backtrack info for address a");
            }
            if (sDumpers.length) this.println("dump extension commands:\n\t" + sDumpers);
            return;
        }

        if (sAddr == "state") {
            var sState = this.cmp.powerOff(true);
            if (!sState) {
                this.println("powerOff() error");
            }
            else if (sLen == "console") {
                /*
                 * Console buffers are notoriously small, and even the following code, which breaks the
                 * data into parts (eg, "d state console 1", "d state console 2", etc) just isn't that helpful.
                 *
                 *      var nPart = +sBytes;
                 *      if (nPart) sState = sState.substr(1000000 * (nPart-1), 1000000);
                 *
                 * So, the best way to capture a large machine state is to use the new "Save Machine" link
                 * that downloads a machine's entire state.  Alternatively, run your own local server and use
                 * server-side storage.  Take a look at the "Save" binding in computer.js, which binds an HTML
                 * control to the computer.powerOff() and computer.saveServerState() functions.
                 */
                console.log(sState);
            } else {
                this.doClear();
                this.println(sState);
            }
            return;
        }

        if (sAddr == "symbols") {
            this.dumpSymbols();
            return;
        }

        /*
         * Transform a "ds" command into a "d desc" command (simply as shorthand); ditto for "dg" and "dl",
         * only because that's the syntax that WDEB386 used.  I'm uncertain what WDEB386 would do with an LDT
         * selector passed to "dg" or a GDT selector passed to "dl" (because I'm too lazy to check right now),
         * but that seems nonsensical.
         */
        if (sCmd == "ds" || sCmd == "dg" || sCmd == "dl") {
            sCmd = "d";
            asArgs = [sCmd, "desc", sAddr];
        }

        /*
         * Handle the "dp" (aka "d page") commands here.
         */
        if (sCmd == "d" && sAddr == "page") {
            sCmd = "dp";
            asArgs.shift();
        }
        if (sCmd == "dp") {
            asArgs.shift();
            this.dumpPage(asArgs);
            return;
        }

        if (sCmd == "d") {
            /*
             * Transform a "d disk" command into a "l json" command (TODO: Register a dumper for "disk" instead?)
             */
            if (sAddr == "disk") {
                asArgs[0] = "l";
                asArgs[1] = "json";
                this.doLoad(asArgs);
                return;
            }
            for (m in Messages.CATEGORIES) {
                if (asArgs[1] == m) {
                    var fnDumper = this.afnDumpers[m];
                    if (fnDumper) {
                        asArgs.shift();
                        asArgs.shift();
                        fnDumper(asArgs);
                    } else {
                        this.println("no dump registered for " + sAddr);
                    }
                    return;
                }
            }
            if (!sAddr) sCmd = this.sCmdDumpPrev || "db";
        }

        if (sCmd == "dh") {
            this.dumpHistory(sAddr, sLen, sBytes);
            return;
        }

        if (sCmd == "di") {
            asArgs.shift();
            this.dumpIDT(asArgs);
            return;
        }

        if (sCmd == "dt") {
            asArgs.shift();
            var sInfo = this.dumpBackTrack(asArgs);
            this.println(sInfo);
            return;
        }

        if (sCmd[1] && "abwd".indexOf(sCmd[1]) < 0) {
            this.println("unrecognized dump command");
            return;
        }

        this.sCmdDumpPrev = sCmd;

        var dbgAddr = this.parseAddr(sAddr);
        if (!dbgAddr || dbgAddr.sel == null && dbgAddr.addr == null) return;

        var len = 0;
        if (sLen) {
            if (sLen.charAt(0) == 'l') {
                sLen = sLen.substr(1) || sBytes;
                len = this.parseValue(sLen);
            } else {
                var dbgAddrEnd = this.parseAddr(sLen);
                if (!dbgAddrEnd) return;
                len = dbgAddrEnd.off - dbgAddr.off + 1;
            }
            if (len < 0 || len > 0x10000) len = 0;
        }

        var sDump = "";
        var fASCII = false;
        var size = (sCmd == "dd"? 4 : (sCmd == "dw"? 2 : 1));
        var cb = (size * len) || 128;
        var cLines = ((cb + 15) >> 4) || 1;
        var cbLine = (size == 4? 16 : this.nBase);  // the base also happens to be a reasonable number of bytes/line
        if (sCmd[1] == 'a') {
            fASCII = true;
            cLines = 25;
            cbLine = 160;
            cb = cLines * cbLine;
        }
        while (cLines-- && cb > 0) {
            var data = 0, iByte = 0, i;
            var sData = "", sChars = "";
            sAddr = this.toHexAddr(dbgAddr);
            for (i = cbLine; i > 0 && cb > 0; i--) {
                var b = this.getByte(dbgAddr, 1);
                data |= (b << (iByte++ << 3));
                if (iByte == size) {
                    sData += (this.nBase == 8? Str.toOct(data, size * 3) : Str.toHex(data, size * 2));
                    sData += (size == 1? (i == 9? '-' : ' ') : "  ");
                    data = iByte = 0;
                }
                sChars += (b >= 32 && b < 127? String.fromCharCode(b) : (fASCII? '' : '.'));
                cb--;
            }
            if (sDump) sDump += '\n';
            if (fASCII) {
                sDump += sChars;
            } else {
                sDump += sAddr + "  " + sData + Str.pad(sChars, sChars.length + i * 3 + 1, true);
            }
        }
        if (sDump) this.println(sDump.replace(/\s*$/, ""));
        this.dbgAddrNextData = dbgAddr;
    }

    /**
     * doEdit(asArgs)
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     */
    doEdit(asArgs)
    {
        var size = 1;
        var mask = 0xff;
        var fnGet = this.getByte;
        var fnSet = this.setByte;
        if (asArgs[0] == "ew") {
            size = 2;
            mask = 0xffff;
            fnGet = this.getShort;
            fnSet = this.setShort;
        }
        var cch = size << 1;

        var sAddr = asArgs[1];
        if (sAddr == null) {
            this.println("edit memory commands:");
            this.println("\teb [a] [...]  edit bytes at address a");
            this.println("\tew [a] [...]  edit words at address a");
            return;
        }

        var dbgAddr = this.parseAddr(sAddr);
        if (!dbgAddr) return;

        for (var i = 2; i < asArgs.length; i++) {
            var vNew = this.parseExpression(asArgs[i]);
            if (vNew === undefined) {
                this.println("unrecognized value: " + asArgs[i]);
                break;
            }
            if (vNew & ~mask) {
                this.println("warning: " + Str.toHex(vNew) + " exceeds " + size + "-byte value");
            }
            var vOld = fnGet.call(this, dbgAddr);
            this.println("changing " + this.toHexAddr(dbgAddr) + " from " + Str.toHex(vOld, cch, true) + " to " + Str.toHex(vNew, cch, true));
            fnSet.call(this, dbgAddr, vNew, size);
        }
    }

    /**
     * doFreqs(sParm)
     *
     * @this {DebuggerX86}
     * @param {string|undefined} sParm
     */
    doFreqs(sParm)
    {
        if (sParm == '?') {
            this.println("frequency commands:");
            this.println("\tclear\tclear all frequency counts");
            return;
        }
        var i;
        var cData = 0;
        if (this.aaOpcodeCounts) {
            if (sParm == "clear") {
                for (i = 0; i < this.aaOpcodeCounts.length; i++)
                    this.aaOpcodeCounts[i] = [i, 0];
                this.println("frequency data cleared");
                cData++;
            }
            else if (sParm !== undefined) {
                this.println("unknown frequency command: " + sParm);
                cData++;
            }
            else {
                var aaSortedOpcodeCounts = this.aaOpcodeCounts.slice();
                aaSortedOpcodeCounts.sort(function(p, q) {
                    return q[1] - p[1];
                });
                for (i = 0; i < aaSortedOpcodeCounts.length; i++) {
                    var bOpcode = aaSortedOpcodeCounts[i][0];
                    var cFreq = aaSortedOpcodeCounts[i][1];
                    if (cFreq) {
                        this.println((DebuggerX86.INS_NAMES[this.aaOpDescs[bOpcode][0]] + "  ").substr(0, 5) + " (" + Str.toHexByte(bOpcode) + "): " + cFreq + " times");
                        cData++;
                    }
                }
            }
        }
        if (!cData) {
            this.println("no frequency data available");
        }
    }

    /**
     * doHalt(fQuiet)
     *
     * @this {DebuggerX86}
     * @param {boolean} [fQuiet]
     */
    doHalt(fQuiet)
    {
        if (!this.stopCPU()) {
            if (this.isBusy(true)) return;
            if (!fQuiet) this.println("already halted");
        }
    }

    /**
     * doIf(sCmd, fQuiet)
     *
     * NOTE: Don't forget that the default base for all numeric constants is 16 (hex), so when you evaluate
     * an expression like "a==10", it will compare the value of the variable "a" to 0x10; use a trailing period
     * (eg, "10.") if you really intend decimal.
     *
     * Also, if no variable named "a" exists, "a" will evaluate to 0x0A, so the expression "a==10" becomes
     * "0x0A==0x10" (false), whereas the expression "a==10." becomes "0x0A==0x0A" (true).
     *
     * @this {DebuggerX86}
     * @param {string} sCmd
     * @param {boolean} [fQuiet]
     * @return {boolean} true if expression is non-zero, false if zero (or undefined due to a parse error)
     */
    doIf(sCmd, fQuiet)
    {
        sCmd = Str.trim(sCmd);
        if (!this.parseExpression(sCmd)) {
            if (!fQuiet) this.println("false: " + sCmd);
            return false;
        }
        if (!fQuiet) this.println("true: " + sCmd);
        return true;
    }

    /**
     * doInfo(asArgs)
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     * @return {boolean} true only if the instruction info command ("n") is supported
     */
    doInfo(asArgs)
    {
        if (DEBUG) {
            this.println("msPerYield: " + this.cpu.counts.msPerYield);
            this.println("nCyclesPerYield: " + this.cpu.counts.nCyclesPerYield);
            return true;
        }
        return false;
    }

    /**
     * doInput(sPort)
     *
     * Simulate a 1-byte port input operation.
     *
     * @this {DebuggerX86}
     * @param {string|undefined} sPort
     */
    doInput(sPort)
    {
        if (!sPort || sPort == '?') {
            this.println("input commands:");
            this.println("\ti [p]\tread port [p]");
            /*
             * TODO: Regarding this warning, consider adding an "unchecked" version of
             * bus.checkPortInputNotify(), since all Debugger memory accesses are unchecked, too.
             *
             * All port I/O handlers ARE aware when the Debugger is calling (addrFrom is undefined),
             * but changing them all to be non-destructive would take time, and situations where you
             * actually want to affect the hardware state are just as likely as not....
             */
            this.println("warning: port accesses can affect hardware state");
            return;
        }
        var port = this.parseValue(sPort);
        if (port !== undefined) {
            var bIn = this.bus.checkPortInputNotify(port, 1);
            this.println(Str.toHexWord(port) + ": " + Str.toHexByte(bIn));
        }
    }

    /**
     * doInt(sInt)
     *
     * Displays information about the given software interrupt (assuming that said interrupt is in progress).
     *
     * These messages also reset the system variable $ops (by updating cOpcodesStart), to make it easier to see
     * how many opcodes were executed since these interrupts "started".
     *
     * @this {DebuggerX86}
     * @param {string|undefined} sInt
     * @return {boolean} true if successful, false if not
     */
    doInt(sInt)
    {
        switch(this.parseValue(sInt)) {
        case 0x13:
            this.messageInt(Interrupts.DISK, this.cpu.regLIP, true);
            this.cOpcodesStart = this.cOpcodes;
            return true;
        case 0x21:
            this.messageInt(Interrupts.DOS, this.cpu.regLIP, true);
            this.cOpcodesStart = this.cOpcodes;
            return true;
        default:
            return false;
        }
    }

    /**
     * doVar(sCmd)
     *
     * The command must be of the form "{variable} = [{expression}]", where expression may contain constants,
     * operators, registers, symbols, other variables, or nothing at all; in the latter case, the variable, if
     * any, is deleted.
     *
     * Other supported shorthand: "var" with no parameters prints the values of all variables, and "var {variable}"
     * prints the value of the specified variable.
     *
     * @this {DebuggerX86}
     * @param {string} sCmd
     * @return {boolean} true if valid "var" assignment, false if not
     */
    doVar(sCmd)
    {
        var a = sCmd.match(/^\s*([A-Z_]?[A-Z0-9_]*)\s*(=?)\s*(.*)$/i);
        if (a) {
            if (!a[1]) {
                if (!this.printVariable()) this.println("no variables");
                return true;    // it's not considered an error to print an empty list of variables
            }
            if (!a[2]) {
                return this.printVariable(a[1]);
            }
            if (!a[3]) {
                this.delVariable(a[1]);
                return true;    // it's not considered an error to delete a variable that didn't exist
            }
            var v = this.parseExpression(a[3]);
            if (v !== undefined) {
                this.setVariable(a[1], v);
                return true;
            }
            return false;
        }
        this.println("invalid assignment:" + sCmd);
        return false;
    }

    /**
     * doList(sAddr, fPrint)
     *
     * @this {DebuggerX86}
     * @param {string} sAddr
     * @param {boolean} [fPrint]
     * @return {string|null}
     */
    doList(sAddr, fPrint)
    {
        var sSymbol = null;

        var dbgAddr = this.parseAddr(sAddr, true);
        if (dbgAddr) {

            var addr = this.getAddr(dbgAddr);
            if (MAXDEBUG && fPrint) {
                this.println(this.toHexAddr(dbgAddr) + " (%" + Str.toHex(addr, this.cchAddr) + ')');
            }

            var aSymbol = this.findSymbol(dbgAddr, true);
            if (aSymbol.length) {
                var nDelta, sDelta, s;
                if (aSymbol[0]) {
                    sDelta = "";
                    nDelta = dbgAddr.off - aSymbol[1];
                    if (nDelta) sDelta = " + " + Str.toHexWord(nDelta);
                    s = aSymbol[0] + " (" + this.toHexOffset(aSymbol[1], dbgAddr.sel) + ')' + sDelta;
                    if (fPrint) this.println(s);
                    sSymbol = s;
                }
                if (aSymbol.length > 4 && aSymbol[4]) {
                    sDelta = "";
                    nDelta = aSymbol[5] - dbgAddr.off;
                    if (nDelta) sDelta = " - " + Str.toHexWord(nDelta);
                    s = aSymbol[4] + " (" + this.toHexOffset(aSymbol[5], dbgAddr.sel) + ')' + sDelta;
                    if (fPrint) this.println(s);
                    if (!sSymbol) sSymbol = s;
                }
            } else {
                if (fPrint) this.println("no symbols");
            }
        }
        return sSymbol;
    }

    /**
     * doLoad(asArgs)
     *
     * The format of this command mirrors the DOS DEBUG "L" command:
     *
     *      l [address] [drive #] [sector #] [# sectors]
     *
     * The only optional parameter is the last, which defaults to 1 sector if not specified.
     *
     * As a quick-and-dirty way of getting the current contents of a disk image as a JSON dump
     * (which you can then save as .json disk image file), I also support this command:
     *
     *      l json [drive #]
     *
     * which is aliased to this command:
     *
     *      d disk [drive #]
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     */
    doLoad(asArgs)
    {
        if (!asArgs[1] || asArgs[1] == '?') {
            this.println("load commands:");
            this.println("\tl [address] [drive #] [sector #] [# sectors]");
            return;
        }

        var fJSON = (asArgs[1] == "json");
        var iDrive, iSector = 0, nSectors = 0;

        var dbgAddr = (fJSON? {} : this.parseAddr(asArgs[1]));
        if (!dbgAddr) return;

        iDrive = this.parseValue(asArgs[2], "drive #");
        if (iDrive === undefined) return;
        if (!fJSON) {
            iSector = this.parseValue(asArgs[3], "sector #");
            if (iSector === undefined) return;
            nSectors = this.parseValue(asArgs[4], "# of sectors");
            if (nSectors === undefined) nSectors = 1;
        }

        /*
         * We choose the disk controller very simplistically: FDC for drives 0 or 1, and HDC for drives 2
         * and up, unless no HDC is present, in which case we assume FDC for all drive numbers.
         *
         * Both controllers must obviously support the same interfaces; ie, copyDrive(), seekDrive(),
         * and readData().  We also rely on the disk property to determine whether the drive is "loaded".
         *
         * In the case of the HDC, if the drive is valid, then by definition it is also "loaded", since an HDC
         * drive and its disk are inseparable; it's certainly possible that the disk object may be empty at
         * this point (ie, if the disk is uninitialized and unformatted), but that will only affect whether the
         * read succeeds or not.
         */
        var dc = this.fdc;
        if (iDrive >= 2 && this.hdc) {
            iDrive -= 2;
            dc = this.hdc;
        }
        if (dc) {
            var drive = dc.copyDrive(iDrive);
            if (drive) {
                if (drive.disk) {
                    if (fJSON) {
                        /*
                         * This is an interim solution to dumping disk images in JSON.  It has many problems, the
                         * "biggest" being that the large disk images really need to be compressed first, because they
                         * get "inflated" with use.  See the dump() method in the Disk component for more details.
                         */
                        this.doClear();
                        this.println(drive.disk.convertToJSON());
                        return;
                    }
                    if (dc.seekDrive(drive, iSector, nSectors)) {
                        var cb = 0;
                        var fAbort = false;
                        var sAddr = this.toHexAddr(dbgAddr);
                        while (!fAbort && drive.nBytes-- > 0) {
                            (function(dbg, dbgAddrCur) {
                                dc.readData(drive, function(b, fAsync) {
                                    if (b < 0) {
                                        dbg.println("out of data at address " + dbg.toHexAddr(dbgAddrCur));
                                        fAbort = true;
                                        return;
                                    }
                                    dbg.setByte(dbgAddrCur, b, 1, true);
                                    cb++;
                                });
                            }(this, dbgAddr));
                        }
                        /*
                         * Call updateCPU() now, since we forced setByte() to defer all updates
                         */
                        this.cpu.updateCPU(true);
                        this.println(cb + " bytes read at " + sAddr);
                    } else {
                        this.println("sector " + iSector + " request out of range");
                    }
                } else {
                    this.println("drive " + iDrive + " not loaded");
                }
            } else {
                this.println("invalid drive: " + iDrive);
            }
        } else {
            this.println("disk controller not present");
        }
    }

    /**
     * doMessages(asArgs)
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     */
    doMessages(asArgs)
    {
        let m;
        let fCriteria = null;
        let sCategory = asArgs[1];
        if (sCategory == '?') sCategory = undefined;

        if (sCategory !== undefined) {
            let bitsMessage = 0;
            if (sCategory == "all") {
                bitsMessage = (0xffffffff|0) & ~(Messages.HALT | Messages.BUFFER);
                sCategory = null;
            } else if (sCategory == "on") {
                fCriteria = true;
                sCategory = null;
            } else if (sCategory == "off") {
                fCriteria = false;
                sCategory = null;
            } else {
                for (m in Messages.CATEGORIES) {
                    if (sCategory == m) {
                        bitsMessage = Messages.CATEGORIES[m];
                        fCriteria = ((this.bitsMessage & bitsMessage) === bitsMessage);
                        break;
                    }
                }
                if (!bitsMessage) {
                    this.println("unknown message category: " + sCategory);
                    return;
                }
            }
            if (bitsMessage) {
                if (asArgs[2] == "on") {
                    this.bitsMessage |= bitsMessage;
                    fCriteria = true;
                }
                else if (asArgs[2] == "off") {
                    this.bitsMessage &= ~bitsMessage;
                    if (!(this.bitsMessage & 0xF0000000) && bitsMessage) {
                        this.bitsMessage = 0;   // if all the high (shared) bits were turned off, ensure all the low bits are off as well.
                    }
                    fCriteria = false;
                    if (bitsMessage == Messages.BUFFER) {
                        for (var i = 0; i < this.aMessageBuffer.length; i++) {
                            this.println(this.aMessageBuffer[i]);
                        }
                        this.aMessageBuffer = [];
                    }
                }
            }
        }

        /*
         * Display those message categories that match the current criteria (on or off)
         */
        let n = 0;
        let sCategories = "";
        for (m in Messages.CATEGORIES) {
            if (!sCategory || sCategory == m) {
                let bitsMessage = Messages.CATEGORIES[m];
                let fEnabled = ((this.bitsMessage & bitsMessage) === bitsMessage);
                if (fCriteria !== null && fCriteria != fEnabled) continue;
                if (sCategories) sCategories += ',';
                if (!(++n % 10)) sCategories += "\n\t";     // jshint ignore:line
                sCategories += m;
            }
        }

        if (sCategory === undefined) {
            this.println("message commands:\n\tm [category] [on|off]\tturn categories on/off");
        }

        this.println((fCriteria !== null? (fCriteria? "messages on:  " : "messages off: ") : "message categories:\n\t") + (sCategories || "none"));

        this.historyInit();     // call this just in case Messages.INT was turned on
    }

    /**
     * doMouse(sAction, sDelta)
     *
     * When using the "click" action, specify 0 for Mouse.BUTTON.LEFT or 2 for Mouse.BUTTON.RIGHT.
     *
     * @this {DebuggerX86}
     * @param {string} sAction
     * @param {string} sDelta
     */
    doMouse(sAction, sDelta)
    {
        if (this.mouse) {
            var sign = 1;
            if (sDelta.charAt(0) == '-') {
                sign = -1;
                sDelta = sDelta.substr(1);
            }
            var n = this.parseValue(sDelta, sAction);
            if (n === undefined) return;
            n = (n * sign)|0;
            switch(sAction) {
            case "x":
                this.mouse.moveMouse(n, 0);
                break;
            case "y":
                this.mouse.moveMouse(0, n);
                break;
            case "click":
                this.mouse.clickMouse(n, true);
                this.mouse.clickMouse(n, false);
                break;
            default:
                this.println("unknown action: " + sAction);
                break;
            }
            return;
        }
        this.println("no mouse");
    }

    /**
     * doExecOptions(asArgs)
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     */
    doExecOptions(asArgs)
    {
        if (!asArgs[1] || asArgs[1] == '?') {
            this.println("execution options:");
            this.println("\tcs int #\tset checksum cycle interval to #");
            this.println("\tcs start #\tset checksum cycle start count to #");
            this.println("\tcs stop #\tset checksum cycle stop count to #");
            this.println("\tsp #\t\tset speed multiplier to #");
            return;
        }
        switch (asArgs[1]) {
        case "cs":
            var nCycles;
            if (asArgs[3] !== undefined) nCycles = +asArgs[3];          // warning: decimal instead of hex conversion
            switch (asArgs[2]) {
                case "int":
                    this.cpu.counts.nCyclesChecksumInterval = nCycles;
                    break;
                case "start":
                    this.cpu.counts.nCyclesChecksumStart = nCycles;
                    break;
                case "stop":
                    this.cpu.counts.nCyclesChecksumStop = nCycles;
                    break;
                default:
                    this.println("unknown cs option");
                    return;
            }
            if (nCycles !== undefined) {
                this.cpu.resetChecksum();
            }
            this.println("checksums " + (this.cpu.flags.checksum? "enabled" : "disabled"));
            break;
        case "sp":
            if (asArgs[2] !== undefined) {
                if (!this.cpu.setSpeed(+asArgs[2])) {
                    this.println("warning: using 1x multiplier, previous target not reached");
                }
            }
            this.println("target speed: " + this.cpu.getSpeedTarget() + " (" + this.cpu.getSpeed() + "x)");
            break;
        default:
            this.println("unknown option: " + asArgs[1]);
            break;
        }
    }

    /**
     * doOutput(sPort, sByte)
     *
     * Simulate a 1-byte port output operation.
     *
     * @this {DebuggerX86}
     * @param {string|undefined} sPort
     * @param {string|undefined} sByte (string representation of 1 byte)
     */
    doOutput(sPort, sByte)
    {
        if (!sPort || sPort == '?') {
            this.println("output commands:");
            this.println("\to [p] [b]\twrite byte [b] to port [p]");
            /*
             * TODO: Regarding this warning, consider adding an "unchecked" version of
             * bus.checkPortOutputNotify(), since all Debugger memory accesses are unchecked, too.
             *
             * All port I/O handlers ARE aware when the Debugger is calling (addrFrom is undefined),
             * but changing them all to be non-destructive would take time, and situations where you
             * actually want to affect the hardware state are just as likely as not....
             */
            this.println("warning: port accesses can affect hardware state");
            return;
        }
        var port = this.parseValue(sPort, "port #");
        var bOut = this.parseValue(sByte);
        if (port !== undefined && bOut !== undefined) {
            this.bus.checkPortOutputNotify(port, 1, bOut);
            this.println(Str.toHexWord(port) + ": " + Str.toHexByte(bOut));
        }
    }

    /**
     * doRegisters(asArgs, fInstruction)
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} [asArgs]
     * @param {boolean} [fInstruction] (true to include the current instruction; default is true)
     */
    doRegisters(asArgs, fInstruction)
    {
        if (asArgs && asArgs[1] == '?') {
            this.println("register commands:");
            this.println("\tr\tdump registers");
            if (this.fpu) this.println("\trfp\tdump floating-point registers");
            this.println("\trp\tdump all registers");
            this.println("\trx [#]\tset flag or register x to [#]");
            return;
        }

        var fProt;
        if (fInstruction == null) fInstruction = true;

        if (asArgs != null && asArgs.length > 1) {
            var sReg = asArgs[1];
            if (this.fpu && sReg == "fp") {
                this.doFPURegisters(asArgs);
                return;
            }
            if (sReg == 'p') {
                fProt = (this.cpu.model >= X86.MODEL_80286);
            }
            else {
             // fInstruction = false;
                var sValue = null;
                var i = sReg.indexOf('=');
                if (i > 0) {
                    sValue = sReg.substr(i + 1);
                    sReg = sReg.substr(0, i);
                }
                else if (asArgs.length > 2) {
                    sValue = asArgs[2];
                }
                else {
                    this.println("missing value for " + asArgs[1]);
                    return;
                }

                var w = this.parseExpression(sValue);
                if (w === undefined) return;

                var fValid = true;
                var sRegMatch = sReg.toUpperCase();
                if (sRegMatch.charAt(0) == 'E' && this.cchReg <= 4) {
                    sRegMatch = null;
                }
                switch (sRegMatch) {
                case "AL":
                    this.cpu.regEAX = (this.cpu.regEAX & ~0xff) | (w & 0xff);
                    break;
                case "AH":
                    this.cpu.regEAX = (this.cpu.regEAX & ~0xff00) | ((w << 8) & 0xff);
                    break;
                case "AX":
                    this.cpu.regEAX = (this.cpu.regEAX & ~0xffff) | (w & 0xffff);
                    break;
                case "BL":
                    this.cpu.regEBX = (this.cpu.regEBX & ~0xff) | (w & 0xff);
                    break;
                case "BH":
                    this.cpu.regEBX = (this.cpu.regEBX & ~0xff00) | ((w << 8) & 0xff);
                    break;
                case "BX":
                    this.cpu.regEBX = (this.cpu.regEBX & ~0xffff) | (w & 0xffff);
                    break;
                case "CL":
                    this.cpu.regECX = (this.cpu.regECX & ~0xff) | (w & 0xff);
                    break;
                case "CH":
                    this.cpu.regECX = (this.cpu.regECX & ~0xff00) | ((w << 8) & 0xff);
                    break;
                case "CX":
                    this.cpu.regECX = (this.cpu.regECX & ~0xffff) | (w & 0xffff);
                    break;
                case "DL":
                    this.cpu.regEDX = (this.cpu.regEDX & ~0xff) | (w & 0xff);
                    break;
                case "DH":
                    this.cpu.regEDX = (this.cpu.regEDX & ~0xff00) | ((w << 8) & 0xff);
                    break;
                case "DX":
                    this.cpu.regEDX = (this.cpu.regEDX & ~0xffff) | (w & 0xffff);
                    break;
                case "SP":
                    this.cpu.setSP((this.cpu.getSP() & ~0xffff) | (w & 0xffff));
                    break;
                case "BP":
                    this.cpu.regEBP = (this.cpu.regEBP & ~0xffff) | (w & 0xffff);
                    break;
                case "SI":
                    this.cpu.regESI = (this.cpu.regESI & ~0xffff) | (w & 0xffff);
                    break;
                case "DI":
                    this.cpu.regEDI = (this.cpu.regEDI & ~0xffff) | (w & 0xffff);
                    break;
                /*
                 * DANGER: For any of the segment loads below, by going through the normal CPU
                 * segment load procedure, you run the risk of generating a fault in the machine
                 * if you're not careful.  So, um, be careful.
                 */
                case "DS":
                    this.cpu.setDS(w);
                    break;
                case "ES":
                    this.cpu.setES(w);
                    break;
                case "SS":
                    this.cpu.setSS(w);
                    break;
                case "CS":
                 // fInstruction = true;
                    this.cpu.setCS(w);
                    this.dbgAddrNextCode = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
                    break;
                case "IP":
                case "EIP":
                 // fInstruction = true;
                    this.cpu.setIP(w);
                    this.dbgAddrNextCode = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
                    break;
                /*
                 * I used to alias "PC" (Program Counter) to "IP" (Instruction Pointer), because in PC-DOS 1.00
                 * through 2.10, DEBUG.COM did the same thing.  Then I discovered that, starting with PC-DOS 3.00,
                 * DEBUG.COM changed "PC" to refer to the 16-bit flags register (Program or Processor Control?)
                 * I've elected to go for PC-DOS 3.00+ compatibility, since that will be more widely known.
                 *
                 * PCx86 prefers "PS" (Processor Status) for accessing the FLAGS register in its 16-bit (or 32-bit)
                 * entirety.  Individual flag bits can also be accessed as 1-bit registers, using the names shown
                 * below ("C", "P", "A", "Z", etc.)
                 */
                case "PC":
                case "PS":
                    this.cpu.setPS(w);
                    break;
                case 'C':
                    if (w) this.cpu.setCF(); else this.cpu.clearCF();
                    break;
                case 'P':
                    if (w) this.cpu.setPF(); else this.cpu.clearPF();
                    break;
                case 'A':
                    if (w) this.cpu.setAF(); else this.cpu.clearAF();
                    break;
                case 'Z':
                    if (w) this.cpu.setZF(); else this.cpu.clearZF();
                    break;
                case 'S':
                    if (w) this.cpu.setSF(); else this.cpu.clearSF();
                    break;
                case 'I':
                    if (w) this.cpu.setIF(); else this.cpu.clearIF();
                    break;
                case 'D':
                    if (w) this.cpu.setDF(); else this.cpu.clearDF();
                    break;
                case 'V':
                    if (w) this.cpu.setOF(); else this.cpu.clearOF();
                    break;
                default:
                    var fUnknown = true;
                    if (this.cpu.model >= X86.MODEL_80286) {
                        fUnknown = false;
                        switch(sRegMatch){
                        case "MS":
                            this.cpu.setMSW(w);
                            break;
                        case "TR":
                            /*
                             * DANGER: Like any of the segment loads above, by going through the normal CPU
                             * segment load procedure, you run the risk of generating a fault in the machine
                             * if you're not careful.  So, um, be careful.
                             */
                            if (this.cpu.segTSS.load(w) === X86.ADDR_INVALID) {
                                fValid = false;
                            }
                            break;
                        /*
                         * TODO: Add support for GDTR (addr and limit), IDTR (addr and limit), and perhaps
                         * even the ability to edit descriptor information associated with each segment register.
                         */
                        default:
                            fUnknown = true;
                            if (I386 && this.cpu.model >= X86.MODEL_80386) {
                                fUnknown = false;
                                switch(sRegMatch){
                                case "EAX":
                                    this.cpu.regEAX = w;
                                    break;
                                case "EBX":
                                    this.cpu.regEBX = w;
                                    break;
                                case "ECX":
                                    this.cpu.regECX = w;
                                    break;
                                case "EDX":
                                    this.cpu.regEDX = w;
                                    break;
                                case "ESP":
                                    this.cpu.setSP(w);
                                    break;
                                case "EBP":
                                    this.cpu.regEBP = w;
                                    break;
                                case "ESI":
                                    this.cpu.regESI = w;
                                    break;
                                case "EDI":
                                    this.cpu.regEDI = w;
                                    break;
                                /*
                                 * DANGER: For any of the segment loads below, by going through the normal CPU
                                 * segment load procedure, you run the risk of generating a fault in the machine
                                 * if you're not careful.  So, um, be careful.
                                 */
                                case "FS":
                                    this.cpu.setFS(w);
                                    break;
                                case "GS":
                                    this.cpu.setGS(w);
                                    break;
                                case "CR0":
                                    this.cpu.regCR0 = w;
                                    X86.helpLoadCR0.call(this.cpu, w);
                                    break;
                                case "CR2":
                                    this.cpu.regCR2 = w;
                                    break;
                                case "CR3":
                                    this.cpu.regCR3 = w;
                                    X86.helpLoadCR3.call(this.cpu, w);
                                    break;
                                /*
                                 * TODO: Add support for DR0-DR7 and TR6-TR7.
                                 */
                                default:
                                    fUnknown = true;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    if (fUnknown) {
                        this.println("unknown register: " + sReg);
                        return;
                    }
                }
                if (!fValid) {
                    this.println("invalid value: " + sValue);
                    return;
                }
                this.cpu.updateCPU();
                this.println("updated registers:");
            }
        }

        this.println(this.getRegDump(fProt));

        if (fInstruction) {
            this.dbgAddrNextCode = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
            this.doUnassemble(this.toHexAddr(this.dbgAddrNextCode));
        }
    }

    /**
     * doFPURegisters(asArgs)
     *
     * NOTE: If we're called, the existence of an FPU has already been verified.
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} [asArgs]
     */
    doFPURegisters(asArgs)
    {
        var fpu = this.fpu;
        this.assert(fpu);
        var wStatus = fpu.getStatus(), wControl = fpu.getControl();
        for (var i = 0; i < 8; i++) {
            var a = fpu.readFPUStack(i);
            if (!a) break;
            var sValue = Str.pad(a[2].toFixed(15), 24, true);
            this.println("ST" + i + ": " + sValue + "  " + Str.toHex(a[4]) + "," + Str.toHex(a[3]) + "  [" + a[0] + ":" + DebuggerX86.FPU_TAGS[a[1]] + "]");
            // this.println("  REG" + a[0] + " " + Str.toBin(a[7], 16) + Str.toBin(a[6]) + Str.toBin(a[5]));
        }
        this.println("    B3SSS210ESPUOZDI               xxxIRRPPIxPUOZDI");
        this.println("SW: " + Str.toBin(wStatus, 16) + " (" + Str.toHexWord(wStatus) + ")  CW: " + Str.toBin(wControl, 16) + " (" + Str.toHexWord(wControl) + ")");
    }

    /**
     * doRun(sCmd, sAddr, sOptions, fQuiet)
     *
     * @this {DebuggerX86}
     * @param {string} sCmd
     * @param {string|undefined} [sAddr]
     * @param {string} [sOptions] (the rest of the breakpoint command-line)
     * @param {boolean} [fQuiet]
     */
    doRun(sCmd, sAddr, sOptions, fQuiet)
    {
        if (sCmd == "gt") {
            this.fIgnoreNextCheckFault = true;
        }
        if (sAddr !== undefined) {
            var dbgAddr = this.parseAddr(sAddr, true);
            if (!dbgAddr) return;
            this.parseAddrOptions(dbgAddr, sOptions);
            this.setTempBreakpoint(dbgAddr);
        }
        this.startCPU(true, fQuiet);
    }

    /**
     * doPrint(sCmd)
     *
     * NOTE: If the string to print is a quoted string, then we run it through replaceRegs(), so that
     * you can take advantage of all the special replacement options used for software interrupt logging.
     *
     * @this {DebuggerX86}
     * @param {string} sCmd
     */
    doPrint(sCmd)
    {
        sCmd = Str.trim(sCmd);
        var a = sCmd.match(/^(['"])(.*?)\1$/);
        if (!a) {
            this.parseExpression(sCmd, false);
        } else {
            this.println(this.replaceRegs(a[2]));
        }
    }

    /**
     * doStep(sCmd)
     *
     * @this {DebuggerX86}
     * @param {string} [sCmd] "p" or "pr"
     */
    doStep(sCmd)
    {
        var fCallStep = true;
        var nRegs = (sCmd == "pr"? 1 : 0);
        /*
         * Set up the value for this.nStep (ie, 1 or 2) depending on whether the user wants
         * a subsequent register dump ("pr") or not ("p").
         */
        var nStep = 1 + nRegs;
        if (!this.nStep) {
            var fPrefix;
            var fRepeat = false;
            var dbgAddr = this.newAddr(this.cpu.getIP(), this.cpu.getCS());
            do {
                fPrefix = false;
                var bOpcode = this.getByte(dbgAddr);
                switch (bOpcode) {
                case X86.OPCODE.ES:
                case X86.OPCODE.CS:
                case X86.OPCODE.SS:
                case X86.OPCODE.DS:
                case X86.OPCODE.FS:     // I386 only
                case X86.OPCODE.GS:     // I386 only
                case X86.OPCODE.OS:     // I386 only
                case X86.OPCODE.AS:     // I386 only
                case X86.OPCODE.LOCK:
                    this.incAddr(dbgAddr, 1);
                    fPrefix = true;
                    break;
                case X86.OPCODE.INT3:
                case X86.OPCODE.INTO:
                    this.nStep = nStep;
                    this.incAddr(dbgAddr, 1);
                    break;
                case X86.OPCODE.INTN:
                case X86.OPCODE.LOOPNZ:
                case X86.OPCODE.LOOPZ:
                case X86.OPCODE.LOOP:
                    this.nStep = nStep;
                    this.incAddr(dbgAddr, dbgAddr.fData32? 4 : 2);
                    break;
                case X86.OPCODE.CALL:
                    if (fCallStep) {
                        this.nStep = nStep;
                        this.incAddr(dbgAddr, dbgAddr.fData32? 5 : 3);
                    }
                    break;
                case X86.OPCODE.CALLF:
                    if (fCallStep) {
                        this.nStep = nStep;
                        this.incAddr(dbgAddr, dbgAddr.fData32? 7 : 5);
                    }
                    break;
                case X86.OPCODE.GRP4W:
                    if (fCallStep) {
                        var w = this.getWord(dbgAddr) & X86.OPCODE.CALLMASK;
                        if (w == X86.OPCODE.CALLW || w == X86.OPCODE.CALLFDW) {
                            this.nStep = nStep;
                            this.getInstruction(dbgAddr);       // advance dbgAddr past this variable-length CALL
                        }
                    }
                    break;
                case X86.OPCODE.REPZ:
                case X86.OPCODE.REPNZ:
                    this.incAddr(dbgAddr, 1);
                    fRepeat = fPrefix = true;
                    break;
                case X86.OPCODE.INSB:
                case X86.OPCODE.INSW:
                case X86.OPCODE.OUTSB:
                case X86.OPCODE.OUTSW:
                case X86.OPCODE.MOVSB:
                case X86.OPCODE.MOVSW:
                case X86.OPCODE.CMPSB:
                case X86.OPCODE.CMPSW:
                case X86.OPCODE.STOSB:
                case X86.OPCODE.STOSW:
                case X86.OPCODE.LODSB:
                case X86.OPCODE.LODSW:
                case X86.OPCODE.SCASB:
                case X86.OPCODE.SCASW:
                    if (fRepeat) {
                        this.nStep = nStep;
                        this.incAddr(dbgAddr, 1);
                    }
                    break;
                default:
                    break;
                }
            } while (fPrefix);

            if (this.nStep) {
                this.setTempBreakpoint(dbgAddr);
                if (!this.startCPU()) {
                    if (this.cmp) this.cmp.updateFocus();
                    this.nStep = 0;
                }
                /*
                 * A successful run will ultimately call stop(), which will in turn call clearTempBreakpoint(),
                 * which will clear nStep, so there's your assurance that nStep will be reset.  Now we may have
                 * stopped for reasons unrelated to the temporary breakpoint, but that's OK.
                 */
            } else {
                this.doTrace(nRegs? "tr" : "t");
            }
        } else {
            this.println("step in progress");
        }
    }

    /**
     * getCall(dbgAddr, fFar)
     *
     * Given a possible return address (typically from the stack), look for a matching CALL (or INT) that
     * immediately precedes that address.
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {boolean} [fFar]
     * @return {string|null} CALL instruction at or near dbgAddr, or null if none
     */
    getCall(dbgAddr, fFar)
    {
        var sCall = null;
        var off = dbgAddr.off;
        var offOrig = off;
        for (var n = 1; n <= 6 && !!off; n++) {
            if (n > 2) {
                dbgAddr.off = off;
                dbgAddr.addr = null;
                var s = this.getInstruction(dbgAddr);
                if (s.indexOf("CALL") >= 0 || fFar && s.indexOf("INT") >= 0) {
                    /*
                     * Verify that the length of this CALL (or INT), when added to the address of the CALL (or INT),
                     * matches the original return address.  We do this by getting the string index of the opcode bytes,
                     * subtracting that from the string index of the next space, and dividing that difference by two,
                     * to yield the length of the CALL (or INT) instruction, in bytes.
                     */
                    var i = s.indexOf(' ');
                    var j = s.indexOf(' ', i+1);
                    if (off + (j - i - 1)/2 == offOrig) {
                        sCall = s;
                        break;
                    }
                }
            }
            off--;
        }
        dbgAddr.off = offOrig;
        return sCall;
    }

    /**
     * doStackTrace(sCmd, sAddr)
     *
     * Use "k" for a normal stack trace and "ks" for a stack trace with symbolic info.
     *
     * @this {DebuggerX86}
     * @param {string} [sCmd]
     * @param {string} [sAddr] (not used yet)
     */
    doStackTrace(sCmd, sAddr)
    {
        if (sAddr == '?') {
            this.println("stack trace commands:");
            this.println("\tk\tshow frame addresses");
            this.println("\tks\tshow symbol information");
            return;
        }

        var nFrames = 10, cFrames = 0;
        var selCode = this.cpu.segCS.sel;
        var dbgAddrCall = this.newAddr();
        var dbgAddrStack = this.newAddr(this.cpu.getSP(), this.cpu.getSS());
        this.println("stack trace for " + this.toHexAddr(dbgAddrStack));

        while (cFrames < nFrames) {
            var sCall = null, sCallPrev = null, cTests = 256;
            while ((dbgAddrStack.off >>> 0) < (this.cpu.regLSPLimit >>> 0)) {
                dbgAddrCall.off = this.getWord(dbgAddrStack, true);
                /*
                 * Because we're using the auto-increment feature of getWord(), and because that will automatically
                 * wrap the offset around the end of the segment, we must also check the addr property to detect the wrap.
                 */
                if (dbgAddrStack.addr == null || !cTests--) break;
                dbgAddrCall.sel = selCode;
                sCall = this.getCall(dbgAddrCall);
                if (sCall) break;
                dbgAddrCall.sel = this.getWord(dbgAddrStack);
                sCall = this.getCall(dbgAddrCall, true);
                if (sCall) {
                    selCode = this.getWord(dbgAddrStack, true);
                    /*
                     * It's not strictly necessary that we skip over the flags word that's pushed as part of any INT
                     * instruction, but it reduces the risk of misinterpreting it as a return address on the next iteration.
                     */
                    if (sCall.indexOf("INT") > 0) this.getWord(dbgAddrStack, true);
                    break;
                }
            }
            /*
             * The sCallPrev check eliminates duplicate sequential calls, which are usually (but not always)
             * indicative of a false positive, in which case the previous call is probably bogus as well, but
             * at least we won't duplicate that mistake.  Of course, there are always exceptions, recursion
             * being one of them, but it's rare that we're debugging recursive code.
             */
            if (!sCall || sCall == sCallPrev) break;
            var sSymbol = null;
            if (sCmd == "ks") {
                var a = sCall.match(/[0-9A-F]+$/);
                if (a) sSymbol = this.doList(a[0]);
            }
            sCall = Str.pad(sCall, 50) + "  ;" + (sSymbol || "stack=" + this.toHexAddr(dbgAddrStack)); // + " return=" + this.toHexAddr(dbgAddrCall));
            this.println(sCall);
            sCallPrev = sCall;
            cFrames++;
        }
        if (!cFrames) this.println("no return addresses found");
    }

    /**
     * doTrace(sCmd, sCount)
     *
     * The "t" and "tr" commands interpret the count as a number of instructions, and since
     * we call the Debugger's stepCPU() for each iteration, a single instruction includes
     * any/all prefixes; the CPU's stepCPU() treats prefixes as discrete operations.  The only
     * difference between "t" and "tr": the former displays only the next instruction, while
     * the latter also displays the (updated) registers.
     *
     * The "tc" command interprets the count as a number of cycles rather than instructions,
     * allowing you to quickly execute large chunks of instructions with a single command; it
     * doesn't display anything until the the chunk has finished.
     *
     * However, generally a more useful command is "bn", which allows you to break after some
     * number of instructions have been executed (as opposed to some number of cycles).
     *
     * @this {DebuggerX86}
     * @param {string} [sCmd] ("t", "tc", or "tr")
     * @param {string} [sCount] # of instructions to step
     */
    doTrace(sCmd, sCount)
    {
        var dbg = this;
        var fRegs = (sCmd != "t");
        var nCount = this.parseValue(sCount, null, true) || 1;
        var nCycles = (nCount == 1? 0 : 1);
        if (sCmd == "tc") {
            nCycles = nCount;
            nCount = 1;
        }
        Web.onCountRepeat(
            nCount,
            function onCountStep() {
                return dbg.setBusy(true) && dbg.stepCPU(nCycles, fRegs, false);
            },
            function onCountStepComplete() {
                /*
                 * We explicitly called stepCPU() with fUpdateCPU === false, because repeatedly
                 * calling updateCPU() can be very slow, especially when fDisplayLiveRegs is true,
                 * so once the repeat count has been exhausted, we must perform a final updateCPU().
                 */
                dbg.cpu.updateCPU();
                dbg.setBusy(false);
            }
        );
    }

    /**
     * initAddrSize(dbgAddr, fComplete, cOverrides)
     *
     * @this {DebuggerX86}
     * @param {DbgAddrX86} dbgAddr
     * @param {boolean} fComplete
     * @param {number} [cOverrides]
     */
    initAddrSize(dbgAddr, fComplete, cOverrides)
    {
        /*
         * We use dbgAddr.fComplete to record whether or not the caller (ie, getInstruction())
         * processed a complete instruction.
         */
        dbgAddr.fComplete = fComplete;
        /*
         * For proper disassembly of instructions preceded by an OPERAND (0x66) size prefix, we set
         * dbgAddr.fData32 to true whenever the operand size is 32-bit; similarly, for an ADDRESS (0x67)
         * size prefix, we set dbgAddr.fAddr32 to true whenever the address size is 32-bit.
         *
         * Initially (and every time we've processed a complete instruction), both fields must be
         * set to their original value.
         */
        if (fComplete) {
            if (dbgAddr.fData32Orig != null) dbgAddr.fData32 = dbgAddr.fData32Orig;
            if (dbgAddr.fAddr32Orig != null) dbgAddr.fAddr32 = dbgAddr.fAddr32Orig;
            dbgAddr.fData32Orig = dbgAddr.fData32;
            dbgAddr.fAddr32Orig = dbgAddr.fAddr32;
        }
        /*
         * Use cOverrides to record whether we previously processed any OPERAND or ADDRESS overrides.
         */
        dbgAddr.cOverrides = cOverrides || 0;
    }

    /**
     * isStringIns(bOpcode)
     *
     * @this {DebuggerX86}
     * @param {number} bOpcode
     * @return {boolean} true if string instruction, false if not
     */
    isStringIns(bOpcode)
    {
        return (bOpcode >= X86.OPCODE.MOVSB && bOpcode <= X86.OPCODE.CMPSW || bOpcode >= X86.OPCODE.STOSB && bOpcode <= X86.OPCODE.SCASW);
    }

    /**
     * doUnassemble(sAddr, sAddrEnd, n)
     *
     * @this {DebuggerX86}
     * @param {string} [sAddr]
     * @param {string} [sAddrEnd]
     * @param {number} [n]
     */
    doUnassemble(sAddr, sAddrEnd, n)
    {
        var dbgAddr = this.parseAddr(sAddr, true);
        if (!dbgAddr) return;

        if (n === undefined) n = 1;

        var cb = 0x100;
        if (sAddrEnd !== undefined) {

            var dbgAddrEnd = this.parseAddr(sAddrEnd, true);
            if (!dbgAddrEnd || dbgAddrEnd.off < dbgAddr.off) return;

            /*
             * We now +1 the count to make the ending address inclusive (just like the dump command).
             */
            cb = dbgAddrEnd.off - dbgAddr.off + 1;
            if (cb < 0) cb = 1;
            /*
             * Limiting the amount of disassembled code to 4K helps prevent the user from wedging the browser.
             */
            if (cb > 0x1000) cb = 0x1000;
            n = -1;
        }

        var cLines = 0;
        var sInstruction;
        this.initAddrSize(dbgAddr, true);

        while (cb > 0 && n--) {

            var nSequence = (this.isBusy(false) || this.nStep)? this.nCycles : null;
            var sComment = (nSequence != null? "cycles" : null);
            var aSymbol = this.findSymbol(dbgAddr);

            var addr = dbgAddr.addr;    // we snap dbgAddr.addr *after* calling findSymbol(), which re-evaluates it

            if (aSymbol[0] && n) {
                if (!cLines && n || aSymbol[0].indexOf('+') < 0) {
                    var sLabel = aSymbol[0] + ':';
                    if (aSymbol[2]) sLabel += ' ' + aSymbol[2];
                    this.println(sLabel);
                }
            }

            if (aSymbol[3]) {
                sComment = aSymbol[3];
                nSequence = null;
            }

            sInstruction = this.getInstruction(dbgAddr, sComment, nSequence);

            /*
             * If getInstruction() reported that it did not process a complete instruction (via dbgAddr.fComplete),
             * then bump the instruction count by one, so that we display one more line (and hopefully the complete
             * instruction).
             */
            if (!dbgAddr.fComplete && !n) n++;

            this.println(sInstruction);
            this.dbgAddrNextCode = dbgAddr;
            cb -= dbgAddr.addr - addr;
            cLines++;
        }
    }

    /**
     * parseCommand(sCmd, fSave, chSep)
     *
     * @this {DebuggerX86}
     * @param {string|undefined} sCmd
     * @param {boolean} [fSave] is true to save the command, false if not
     * @param {string} [chSep] is the command separator character (default is ';')
     * @return {Array.<string>}
     */
    parseCommand(sCmd, fSave, chSep)
    {
        if (fSave) {
            if (!sCmd) {
                sCmd = this.aPrevCmds[this.iPrevCmd+1];
            } else {
                if (this.iPrevCmd < 0 && this.aPrevCmds.length) {
                    this.iPrevCmd = 0;
                }
                if (this.iPrevCmd < 0 || sCmd != this.aPrevCmds[this.iPrevCmd]) {
                    this.aPrevCmds.splice(0, 0, sCmd);
                    this.iPrevCmd = 0;
                }
                this.iPrevCmd--;
            }
        }
        var a = [];
        if (sCmd) {
            /*
             * With the introduction of breakpoint commands (ie, quoted command sequences
             * associated with a breakpoint), we can no longer perform simplistic splitting.
             *
             *      a = sCmd.split(chSep || ';');
             *      for (var i = 0; i < a.length; i++) a[i] = Str.trim(a[i]);
             *
             * We may now split on semi-colons ONLY if they are outside a quoted sequence.
             *
             * Also, to allow quoted strings *inside* breakpoint commands, we first replace all
             * DOUBLE double-quotes with single quotes.
             */
            sCmd = sCmd.toLowerCase().replace(/""/g, "'");

            var iPrev = 0;
            var chQuote = null;
            chSep = chSep || ';';
            /*
             * NOTE: Processing charAt() up to and INCLUDING length is not a typo; we're taking
             * advantage of the fact that charAt() with an invalid index returns an empty string,
             * allowing us to use the same substring() call to capture the final portion of sCmd.
             *
             * In a sense, it allows us to pretend that the string ends with a zero terminator.
             */
            for (var i = 0; i <= sCmd.length; i++) {
                var ch = sCmd.charAt(i);
                if (ch == '"' || ch == "'") {
                    if (!chQuote) {
                        chQuote = ch;
                    } else if (ch == chQuote) {
                        chQuote = null;
                    }
                }
                else if (ch == chSep && !chQuote || !ch) {
                    /*
                     * Recall that substring() accepts starting (inclusive) and ending (exclusive)
                     * indexes, whereas substr() accepts a starting index and a length.  We need the former.
                     */
                    a.push(Str.trim(sCmd.substring(iPrev, i)));
                    iPrev = i + 1;
                }
            }
        }
        return a;
    }

    /**
     * shiftArgs(asArgs)
     *
     * Used with any command (eg, "r") that allows but doesn't require whitespace between command and first argument.
     *
     * @this {DebuggerX86}
     * @param {Array.<string>} asArgs
     * @return {Array.<string>}
     */
    shiftArgs(asArgs)
    {
        if (asArgs && asArgs.length) {
            var s0 = asArgs[0];
            var ch0 = s0.charAt(0);
            for (var i = 1; i < s0.length; i++) {
                var ch = s0.charAt(i);
                if (ch0 == '?' || ch0 == 'r' || ch < 'a' || ch > 'z') {
                    asArgs[0] = s0.substr(i);
                    asArgs.unshift(s0.substr(0, i));
                    break;
                }
            }
        }
        return asArgs;
    }

    /**
     * doCommand(sCmd, fQuiet)
     *
     * @this {DebuggerX86}
     * @param {string} sCmd
     * @param {boolean} [fQuiet]
     * @return {boolean} true if command processed, false if unrecognized
     */
    doCommand(sCmd, fQuiet)
    {
        var result = true;

        try {
            if (!sCmd.length || sCmd == "end") {
                if (this.fAssemble) {
                    this.println("ended assemble at " + this.toHexAddr(this.dbgAddrAssemble));
                    this.dbgAddrNextCode = this.dbgAddrAssemble;
                    this.fAssemble = false;
                }
                sCmd = "";
            }
            else if (!fQuiet) {
                var sPrompt = ">> ";
                if (this.cpu.regCR0 & X86.CR0.MSW.PE) {
                    sPrompt = (this.cpu.regPS & X86.PS.VM)? "-- " : "## ";
                }
                this.println(sPrompt + sCmd);
            }

            var ch = sCmd.charAt(0);
            if (ch == '"' || ch == "'") return true;

            /*
             * Zap the previous message buffer to ensure the new command's output is not tossed out as a repeat.
             */
            this.sMessagePrev = null;

            /*
             * I've relaxed the !isBusy() requirement, to maximize our ability to issue Debugger commands externally.
             */
            if (this.isReady() /* && !this.isBusy(true) */ && sCmd.length > 0) {

                if (this.fAssemble) {
                    sCmd = "a " + this.toHexAddr(this.dbgAddrAssemble) + ' ' + sCmd;
                }

                var asArgs = this.shiftArgs(sCmd.replace(/ +/g, ' ').split(' '));

                switch (asArgs[0].charAt(0)) {
                case 'a':
                    this.doAssemble(asArgs);
                    break;
                case 'b':
                    this.doBreak(asArgs[0], asArgs[1], sCmd);
                    break;
                case 'c':
                    this.doClear(asArgs[0]);
                    break;
                case 'd':
                    if (!PCX86.COMPILED && sCmd == "debug") {
                        window.DEBUG = true;
                        this.println("DEBUG checks on");
                        break;
                    }
                    this.doDump(asArgs);
                    break;
                case 'e':
                    if (asArgs[0] == "else") break;
                    this.doEdit(asArgs);
                    break;
                case 'f':
                    this.doFreqs(asArgs[1]);
                    break;
                case 'g':
                    this.doRun(asArgs[0], asArgs[1], sCmd, fQuiet);
                    break;
                case 'h':
                    this.doHalt(fQuiet);
                    break;
                case 'i':
                    if (asArgs[0] == "if") {
                        if (!this.doIf(sCmd.substr(2), fQuiet)) {
                            result = false;
                        }
                        break;
                    }
                    if (asArgs[0] == "int") {
                        if (!this.doInt(asArgs[1])) {
                            result = false;
                        }
                        break;
                    }
                    this.doInput(asArgs[1]);
                    break;
                case 'k':
                    this.doStackTrace(asArgs[0], asArgs[1]);
                    break;
                case 'l':
                    if (asArgs[0] == "ln") {
                        this.doList(asArgs[1], true);
                        break;
                    }
                    this.doLoad(asArgs);
                    break;
                case 'm':
                    if (asArgs[0] == "mouse") {
                        this.doMouse(asArgs[1], asArgs[2]);
                        break;
                    }
                    this.doMessages(asArgs);
                    break;
                case 'o':
                    this.doOutput(asArgs[1], asArgs[2]);
                    break;
                case 'p':
                    if (asArgs[0] == "print") {
                        this.doPrint(sCmd.substr(5));
                        break;
                    }
                    this.doStep(asArgs[0]);
                    break;
                case 'r':
                    if (sCmd == "reset") {
                        if (this.cmp) this.cmp.reset();
                        break;
                    }
                    this.doRegisters(asArgs);
                    break;
                case 't':
                    this.doTrace(asArgs[0], asArgs[1]);
                    break;
                case 'u':
                    this.doUnassemble(asArgs[1], asArgs[2], 8);
                    break;
                case 'v':
                    if (asArgs[0] == "var") {
                        if (!this.doVar(sCmd.substr(3))) {
                            result = false;
                        }
                        break;
                    }
                    this.println((PCX86.APPNAME || "PCx86") + " version " + (XMLVERSION || PCX86.APPVERSION) + " (" + this.cpu.model + (PCX86.COMPILED? ",RELEASE" : (PCX86.DEBUG? ",DEBUG" : ",NODEBUG")) + (PCX86.PREFETCH? ",PREFETCH" : ",NOPREFETCH") + (PCX86.TYPEDARRAYS? ",TYPEDARRAYS" : (PCX86.BYTEARRAYS? ",BYTEARRAYS" : ",LONGARRAYS")) + (PCX86.BACKTRACK? ",BACKTRACK" : ",NOBACKTRACK") + ')');
                    this.println(Web.getUserAgent());
                    break;
                case 'x':
                    this.doExecOptions(asArgs);
                    break;
                case '?':
                    if (asArgs[1]) {
                        this.doPrint(sCmd.substr(1));
                        break;
                    }
                    this.doHelp();
                    break;
                case 'n':
                    if (!PCX86.COMPILED && sCmd == "nodebug") {
                        window.DEBUG = false;
                        this.println("DEBUG checks off");
                        break;
                    }
                    if (this.doInfo(asArgs)) break;
                    /* falls through */
                default:
                    this.println("unknown command: " + sCmd);
                    result = false;
                    break;
                }
            }
        } catch(e) {
            this.println("debugger error: " + (e.stack || e.message));
            result = false;
        }
        return result;
    }

    /**
     * doCommands(sCmds, fSave)
     *
     * @this {DebuggerX86}
     * @param {string} sCmds
     * @param {boolean} [fSave]
     * @return {boolean} true if all commands processed, false if not
     */
    doCommands(sCmds, fSave)
    {
        var a = this.parseCommand(sCmds, fSave);
        for (var s in a) {
            if (!this.doCommand(a[+s])) return false;
        }
        return true;
    }

    /**
     * DebuggerX86.init()
     *
     * This function operates on every HTML element of class "debugger", extracting the
     * JSON-encoded parameters for the Debugger constructor from the element's "data-value"
     * attribute, invoking the constructor to create a Debugger component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeDbg = Component.getElementsByClass(document, PCX86.APPCLASS, "debugger");
        for (var iDbg = 0; iDbg < aeDbg.length; iDbg++) {
            var eDbg = aeDbg[iDbg];
            var parmsDbg = Component.getComponentParms(eDbg);
            var dbg = new DebuggerX86(parmsDbg);
            Component.bindComponentControls(dbg, eDbg, PCX86.APPCLASS);
        }
    }
}

if (DEBUGGER) {

    /*
     * NOTE: The Debugger properties below are considered "class constants"; most of them use our "all-caps"
     * convention (and all of them SHOULD, but that wouldn't help us catch any bugs).
     *
     * Technically, all of them should ALSO be preceded by a "@const" annotation, but that's a lot of work and it
     * really clutters the code.  I wish the Closure Compiler had a way to annotate every definition with a given
     * section with a single annotation....
     *
     * Bugs can slip through the cracks without those annotations; for example, I unthinkingly redefined TYPE_SI
     * at one point, and if all the definitions had been preceded by an "@const", that mistake would have been
     * caught at compile-time.
     */

    /*
     * Information regarding interrupts of interest (used by messageInt() and others)
     */
    DebuggerX86.INT_MESSAGES = {
        0x10:       Messages.VIDEO,
        0x13:       Messages.FDC,
        0x15:       Messages.CHIPSET,
        0x16:       Messages.KBD,
     // 0x1A:       Messages.RTC,       // ChipSet contains its own custom messageInt() handler for the RTC
        0x1C:       Messages.TIMER,
        0x21:       Messages.DOS,
        0x33:       Messages.MOUSE
    };

    /*
     * Information regarding "annoying" interrupts (which aren't annoying so much as too frequent);
     * note that some of these can still be enabled if you really want them (eg, RTC can be turned on
     * with RTC messages, ALT_TIMER with TIMER messages, etc).
     */
    DebuggerX86.INT_ANNOYING = [Interrupts.RTC, Interrupts.ALT_TIMER, Interrupts.DOS_IDLE, Interrupts.DOS_NETBIOS, Interrupts.ALT_VIDEO];

    DebuggerX86.COMMANDS = {
        '?':     "help/print",
        'a [#]': "assemble",            // TODO: Implement this command someday
        'b [#]': "breakpoint",          // multiple variations (use b? to list them)
        'c':     "clear output",
        'd [#]': "dump memory",         // additional syntax: d [#] [l#], where l# is a number of bytes to dump
        'e [#]': "edit memory",
        'f':     "frequencies",
        'g [#]': "go [to #]",
        'h':     "halt",
        'i [#]': "input port #",
        'if':    "eval expression",
        'k':     "stack trace",
        'l':     "load sector(s)",
        "ln":    "list nearest symbol(s)",
        'm':     "messages",
        'mouse': "mouse action",        // syntax: mouse {action} {delta} (eg, mouse x 10, mouse click 0, etc)
        'o [#]': "output port #",
        'p':     "step over",           // other variations: pr (step and dump registers)
        'print': "print expression",
        'r':     "dump/set registers",
        'reset': "reset machine",
        't [#]': "trace",               // other variations: tr (trace and dump registers)
        'u [#]': "unassemble",
        'x':     "execution options",
        'v':     "print version",
        'var':   "assign variable"
    };

    /*
     * Supported address types; the type field in a DbgAddrX86 object may be one of:
     *
     *      NONE, REAL, PROT, V86, LINEAR or PHYSICAL
     *
     * REAL and V86 addresses are specified with a '&' prefix, PROT addresses with a '#' prefix,
     * LINEAR addresses with '%', and PHYSICAL addresses with '%%'.
     */
    DebuggerX86.ADDRTYPE = {
        NONE:       0x00,
        REAL:       0x01,
        PROT:       0x02,
        V86:        0x03,
        LINEAR:     0x04,
        PHYSICAL:   0x05
    };

    /*
     * CPU instruction ordinals
     *
     * Note that individual instructions end with ordinal 162 and instruction groups begin with ordinal 163;
     * the disassembler knows it's dealing with a group whenever the ordinal is not a valid index into INS_NAMES.
     *
     * NOTE: While this list started alphabetical, there are a few wrinkles; eg, POPA/POPF/PUSHF/PUSHA are
     * sequential to make it easier to detect instructions that require a D suffix when the operand size is 32 bits.
     */
    DebuggerX86.INS = {
        NONE:   0,   AAA:    1,   AAD:    2,   AAM:    3,   AAS:    4,   ADC:    5,   ADD:    6,   AND:    7,
        ARPL:   8,   AS:     9,   BOUND:  10,  BSF:    11,  BSR:    12,  BT:     13,  BTC:    14,  BTR:    15,
        BTS:    16,  CALL:   17,  CBW:    18,  CLC:    19,  CLD:    20,  CLI:    21,  CLTS:   22,  CMC:    23,
        CMP:    24,  CMPSB:  25,  CMPSW:  26,  CS:     27,  CWD:    28,  DAA:    29,  DAS:    30,  DEC:    31,
        DIV:    32,  DS:     33,  ENTER:  34,  ES:     35,  ESC:    36,  FS:     37,  GS:     38,  HLT:    39,
        IBTS:   40,  IDIV:   41,  IMUL:   42,  IN:     43,  INC:    44,  INS:    45,  INT:    46,  INT3:   47,
        INTO:   48,  IRET:   49,  JBE:    50,  JC:     51,  JCXZ:   52,  JG:     53,  JGE:    54,  JL:     55,
        JLE:    56,  JMP:    57,  JA:     58,  JNC:    59,  JNO:    60,  JNP:    61,  JNS:    62,  JNZ:    63,
        JO:     64,  JP:     65,  JS:     66,  JZ:     67,  LAHF:   68,  LAR:    69,  LDS:    70,  LEA:    71,
        LEAVE:  72,  LES:    73,  LFS:    74,  LGDT:   75,  LGS:    76,  LIDT:   77,  LLDT:   78,  LMSW:   79,
        LOADALL:80,  LOCK:   81,  LODSB:  82,  LODSW:  83,  LOOP:   84,  LOOPNZ: 85,  LOOPZ:  86,  LSL:    87,
        LSS:    88,  LTR:    89,  MOV:    90,  MOVSB:  91,  MOVSW:  92,  MOVSX:  93,  MOVZX:  94,  MUL:    95,
        NEG:    96,  NOP:    97,  NOT:    98,  OR:     99,  OS:     100, OUT:    101, OUTS:   102, POP:    103,
        POPA:   104, POPF:   105, PUSHF:  106, PUSHA:  107, PUSH:   108, RCL:    109, RCR:    110, REPNZ:  111,
        REPZ:   112, RET:    113, RETF:   114, ROL:    115, ROR:    116, SAHF:   117, SALC:   118, SAR:    119,
        SBB:    120, SCASB:  121, SCASW:  122, SETBE:  123, SETC:   124, SETG:   125, SETGE:  126, SETL:   127,
        SETLE:  128, SETNBE: 129, SETNC:  130, SETNO:  131, SETNP:  132, SETNS:  133, SETNZ:  134, SETO:   135,
        SETP:   136, SETS:   137, SETZ:   138, SGDT:   139, SHL:    140, SHLD:   141, SHR:    142, SHRD:   143,
        SIDT:   144, SLDT:   145, SMSW:   146, SS:     147, STC:    148, STD:    149, STI:    150, STOSB:  151,
        STOSW:  152, STR:    153, SUB:    154, TEST:   155, VERR:   156, VERW:   157, WAIT:   158, XBTS:   159,
        XCHG:   160, XLAT:   161, XOR:    162, GRP1B:  163, GRP1W:  164, GRP1SW: 165, GRP2B:  166, GRP2W:  167,
        GRP2B1: 168, GRP2W1: 169, GRP2BC: 170, GRP2WC: 171, GRP3B:  172, GRP3W:  173, GRP4B:  174, GRP4W:  175,
        OP0F:   176, GRP6:   177, GRP7:   178, GRP8:   179
    };

    /*
     * CPU instruction names (mnemonics), indexed by CPU instruction ordinal (above)
     */
    DebuggerX86.INS_NAMES = [
        "INVALID","AAA",    "AAD",    "AAM",    "AAS",    "ADC",    "ADD",    "AND",
        "ARPL",   "AS:",    "BOUND",  "BSF",    "BSR",    "BT",     "BTC",    "BTR",
        "BTS",    "CALL",   "CBW",    "CLC",    "CLD",    "CLI",    "CLTS",   "CMC",
        "CMP",    "CMPSB",  "CMPSW",  "CS:",    "CWD",    "DAA",    "DAS",    "DEC",
        "DIV",    "DS:",    "ENTER",  "ES:",    "ESC",    "FS:",    "GS:",    "HLT",
        "IBTS",   "IDIV",   "IMUL",   "IN",     "INC",    "INS",    "INT",    "INT3",
        "INTO",   "IRET",   "JBE",    "JC",     "JCXZ",   "JG",     "JGE",    "JL",
        "JLE",    "JMP",    "JA",     "JNC",    "JNO",    "JNP",    "JNS",    "JNZ",
        "JO",     "JP",     "JS",     "JZ",     "LAHF",   "LAR",    "LDS",    "LEA",
        "LEAVE",  "LES",    "LFS",    "LGDT",   "LGS",    "LIDT",   "LLDT",   "LMSW",
        "LOADALL","LOCK",   "LODSB",  "LODSW",  "LOOP",   "LOOPNZ", "LOOPZ",  "LSL",
        "LSS",    "LTR",    "MOV",    "MOVSB",  "MOVSW",  "MOVSX",  "MOVZX",  "MUL",
        "NEG",    "NOP",    "NOT",    "OR",     "OS:",    "OUT",    "OUTS",   "POP",
        "POPA",   "POPF",   "PUSHF",  "PUSHA",  "PUSH",   "RCL",    "RCR",    "REPNZ",
        "REPZ",   "RET",    "RETF",   "ROL",    "ROR",    "SAHF",   "SALC",   "SAR",
        "SBB",    "SCASB",  "SCASW",  "SETBE",  "SETC",   "SETG",   "SETGE",  "SETL",
        "SETLE",  "SETNBE", "SETNC",  "SETNO",  "SETNP",  "SETNS",  "SETNZ",  "SETO",
        "SETP",   "SETS",   "SETZ",   "SGDT",   "SHL",    "SHLD",   "SHR",    "SHRD",
        "SIDT",   "SLDT",   "SMSW",   "SS:",    "STC",    "STD",    "STI",    "STOSB",
        "STOSW",  "STR",    "SUB",    "TEST",   "VERR",   "VERW",   "WAIT",   "XBTS",
        "XCHG",   "XLAT",   "XOR"
    ];

    /*
     * FPU instruction ordinals
     *
     * Unlike CPU instruction ordinals, these are not organized alphabetically (which I did only for the
     * sake of tidiness), but rather by functionality; ie:
     *
     *      0-3:    real transfers
     *      4-6:    integer transfers
     *      7-8:    packed decimal transfers
     *      9-11:   addition
     *      12-17:  subtraction
     *      18-20:  multiplication
     *      21-26:  division
     *      27-33:  other
     *      34-40:  comparisons
     *      41-45:  transcendental
     *      46-52:  constants
     *      53-77:  coprocessor control
     *      78---:  new for 80287 or higher
     *
     * Also, unlike the CPU instructions, there is no NONE ("INVALID") instruction; if an ESC instruction
     * can't be decoded as a valid FPU instruction, then it should remain an ESC instruction.
     */
    DebuggerX86.FINS = {
        FLD:    0,   FST:    1,   FSTP:   2,   FXCH:   3,   FILD:   4,   FIST:   5,   FISTP:  6,   FBLD:   7,
        FBSTP:  8,   FADD:   9,   FADDP:  10,  FIADD:  11,  FSUB:   12,  FSUBP:  13,  FISUB:  14,  FSUBR:  15,
        FSUBRP: 16,  FISUBR: 17,  FMUL:   18,  FMULP:  19,  FIMUL:  20,  FDIV:   21,  FDIVP:  22,  FIDIV:  23,
        FDIVR:  24,  FDIVRP: 25,  FIDIVR: 26,  FSQRT:  27,  FSCALE: 28,  FPREM:  29,  FRNDINT:30,  FXTRACT:31,
        FABS:   32,  FCHS:   33,  FCOM:   34,  FCOMP:  35,  FCOMPP: 36,  FICOM:  37,  FICOMP: 38,  FTST:   39,
        FXAM:   40,  FPTAN:  41,  FPATAN: 42,  F2XM1:  43,  FYL2X:  44,  FYL2XP1:45,  FLDZ:   46,  FLD1:   47,
        FLDPI:  48,  FLDL2T: 49,  FLDL2E: 50,  FLDLG2: 51,  FLDLN2: 52,  FINIT:  53,  FNINIT: 54,  FDISI:  55,
        FNDISI: 56,  FENI:   57,  FNENI:  58,  FLDCW:  59,  FSTCW:  60,  FNSTCW: 61,  FSTSW:  62,  FNSTSW: 63,
        FCLEX:  64,  FNCLEX: 65,  FSTENV: 66,  FNSTENV:67,  FLDENV: 68,  FSAVE:  69,  FNSAVE: 70,  FRSTOR: 71,
        FINCSTP:72,  FDECSTP:73,  FFREE:  74,  FFREEP: 75,  FNOP:   76,  FWAIT:  77,  FSETPM: 78,  FSINCOS:79,
        FSTSWAX:80
    };

    /*
     * FPU instruction names (mnemonics), indexed by FPU instruction ordinal (above)
     */
    DebuggerX86.FINS_NAMES = [
        "FLD",    "FST",    "FSTP",   "FXCH",   "FILD",   "FIST",   "FISTP",  "FBLD",
        "FBSTP",  "FADD",   "FADDP",  "FIADD",  "FSUB",   "FSUBP",  "FISUB",  "FSUBR",
        "FSUBRP", "FISUBR", "FMUL",   "FMULP",  "FIMUL",  "FDIV",   "FDIVP",  "FIDIV",
        "FDIVR",  "FDIVRP", "FIDIVR", "FSQRT",  "FSCALE", "FPREM",  "FRNDINT","FXTRACT",
        "FABS",   "FCHS",   "FCOM",   "FCOMP",  "FCOMPP", "FICOM",  "FICOMP", "FTST",
        "FXAM",   "FPTAN",  "FPATAN", "F2XM1",  "FYL2X",  "FYL2XP1","FLDZ",   "FLD1",
        "FLDPI",  "FLDL2T", "FLDL2E", "FLDLG2", "FLDLN2", "FINIT",  "FNINIT", "FDISI",
        "FNDISI", "FENI",   "FNENI",  "FLDCW",  "FSTCW",  "FNSTCW", "FSTSW",  "FNSTSW",
        "FCLEX",  "FNCLEX", "FSTENV", "FNSTENV","FLDENV", "FSAVE",  "FNSAVE", "FRSTOR",
        "FINCSTP","FDECSTP","FFREE",  "FFREEP", "FNOP",   "FWAIT",  "FSETPM", "FSINCOS",
        "FSTSWAX"
    ];

    DebuggerX86.FPU_TAGS = ["VALID", "ZERO ", "SPEC ", "EMPTY"];

    DebuggerX86.CPU_8086  = 0;
    DebuggerX86.CPU_80186 = 1;
    DebuggerX86.CPU_80286 = 2;
    DebuggerX86.CPU_80386 = 3;
    DebuggerX86.CPUS = [8086, 80186, 80286, 80386];

    /*
     * ModRM masks and definitions
     */
    DebuggerX86.REG_AL         = 0x00;          // bits 0-2 are standard Reg encodings
    DebuggerX86.REG_CL         = 0x01;
    DebuggerX86.REG_DL         = 0x02;
    DebuggerX86.REG_BL         = 0x03;
    DebuggerX86.REG_AH         = 0x04;
    DebuggerX86.REG_CH         = 0x05;
    DebuggerX86.REG_DH         = 0x06;
    DebuggerX86.REG_BH         = 0x07;
    DebuggerX86.REG_AX         = 0x08;
    DebuggerX86.REG_CX         = 0x09;
    DebuggerX86.REG_DX         = 0x0A;
    DebuggerX86.REG_BX         = 0x0B;
    DebuggerX86.REG_SP         = 0x0C;
    DebuggerX86.REG_BP         = 0x0D;
    DebuggerX86.REG_SI         = 0x0E;
    DebuggerX86.REG_DI         = 0x0F;
    DebuggerX86.REG_SEG        = 0x10;
    DebuggerX86.REG_IP         = 0x16;
    DebuggerX86.REG_PS         = 0x17;
    DebuggerX86.REG_EAX        = 0x18;
    DebuggerX86.REG_ECX        = 0x19;
    DebuggerX86.REG_EDX        = 0x1A;
    DebuggerX86.REG_EBX        = 0x1B;
    DebuggerX86.REG_ESP        = 0x1C;
    DebuggerX86.REG_EBP        = 0x1D;
    DebuggerX86.REG_ESI        = 0x1E;
    DebuggerX86.REG_EDI        = 0x1F;
    DebuggerX86.REG_CR0        = 0x20;
    DebuggerX86.REG_CR1        = 0x21;
    DebuggerX86.REG_CR2        = 0x22;
    DebuggerX86.REG_CR3        = 0x23;
    DebuggerX86.REG_DR0        = 0x28;
    DebuggerX86.REG_DR1        = 0x29;
    DebuggerX86.REG_DR2        = 0x2A;
    DebuggerX86.REG_DR3        = 0x2B;
    DebuggerX86.REG_DR6        = 0x2E;
    DebuggerX86.REG_DR7        = 0x2F;
    DebuggerX86.REG_TR0        = 0x30;
    DebuggerX86.REG_TR6        = 0x36;
    DebuggerX86.REG_TR7        = 0x37;
    DebuggerX86.REG_EIP        = 0x38;

    DebuggerX86.REGS = [
        "AL",  "CL",  "DL",  "BL",  "AH",  "CH",  "DH",  "BH",
        "AX",  "CX",  "DX",  "BX",  "SP",  "BP",  "SI",  "DI",
        "ES",  "CS",  "SS",  "DS",  "FS",  "GS",  "IP",  "PS",
        "EAX", "ECX", "EDX", "EBX", "ESP", "EBP", "ESI", "EDI",
        "CR0", "CR1", "CR2", "CR3", null,  null,  null,  null,  // register names used with TYPE_CTLREG
        "DR0", "DR1", "DR2", "DR3", null,  null,  "DR6", "DR7", // register names used with TYPE_DBGREG
        null,  null,  null,  null,  null,  null,  "TR6", "TR7", // register names used with TYPE_TSTREG
        "EIP"
    ];

    DebuggerX86.REG_ES         = 0x00;          // bits 0-1 are standard SegReg encodings
    DebuggerX86.REG_CS         = 0x01;
    DebuggerX86.REG_SS         = 0x02;
    DebuggerX86.REG_DS         = 0x03;
    DebuggerX86.REG_FS         = 0x04;
    DebuggerX86.REG_GS         = 0x05;
    DebuggerX86.REG_UNKNOWN    = 0x00;

    DebuggerX86.MOD_NODISP     = 0x00;          // use RM below, no displacement
    DebuggerX86.MOD_DISP8      = 0x01;          // use RM below + 8-bit displacement
    DebuggerX86.MOD_DISP16     = 0x02;          // use RM below + 16-bit displacement
    DebuggerX86.MOD_REGISTER   = 0x03;          // use REG above

    DebuggerX86.RM_BXSI        = 0x00;
    DebuggerX86.RM_BXDI        = 0x01;
    DebuggerX86.RM_BPSI        = 0x02;
    DebuggerX86.RM_BPDI        = 0x03;
    DebuggerX86.RM_SI          = 0x04;
    DebuggerX86.RM_DI          = 0x05;
    DebuggerX86.RM_BP          = 0x06;
    DebuggerX86.RM_IMMOFF      = DebuggerX86.RM_BP;       // only if MOD_NODISP
    DebuggerX86.RM_BX          = 0x07;

    DebuggerX86.RMS = [
        "BX+SI", "BX+DI", "BP+SI", "BP+DI", "SI",    "DI",    "BP",    "BX",
        "EAX",   "ECX",   "EDX",   "EBX",   "ESP",   "EBP",   "ESI",   "EDI"
    ];

    /*
     * Operand type descriptor masks and definitions
     *
     * Note that the letters in () in the comments refer to Intel's
     * nomenclature used in Appendix A of the 80386 Programmers Reference Manual.
     */
    DebuggerX86.TYPE_SIZE      = 0x000F;        // size field
    DebuggerX86.TYPE_MODE      = 0x00F0;        // mode field
    DebuggerX86.TYPE_IREG      = 0x0F00;        // implied register field
    DebuggerX86.TYPE_OTHER     = 0xF000;        // "other" field

    /*
     * TYPE_SIZE values.  Some definitions use duplicate values when the operands are the
     * same size and the Debugger doesn't need to make a distinction.
     */
    DebuggerX86.TYPE_NONE      = 0x0000;        //     (all other TYPE fields ignored)
    DebuggerX86.TYPE_BYTE      = 0x0001;        // (b) byte, regardless of operand size
    DebuggerX86.TYPE_SBYTE     = 0x0002;        //     byte sign-extended to word
    DebuggerX86.TYPE_SHORT     = 0x0003;        // (w) 16-bit value
    DebuggerX86.TYPE_WORD      = 0x0004;        // (v) 16-bit or 32-bit value
    DebuggerX86.TYPE_LONG      = 0x0005;        // (d) 32-bit value
    DebuggerX86.TYPE_SEGP      = 0x0006;        // (p) 32-bit or 48-bit pointer
    DebuggerX86.TYPE_FARP      = 0x0007;        // (p) 32-bit or 48-bit pointer for JMP/CALL
    DebuggerX86.TYPE_PREFIX    = 0x0008;        //     (treat similarly to TYPE_NONE)
    /*
     * The remaining TYPE_SIZE values are for the FPU.  Note that there are not enough values
     * within this nibble for every type to have a unique value, so to differentiate between two
     * types of the same size (eg, SINT and SREAL), we can inspect the opcode string, because only
     * FI* instructions use INT operands.  Also, some FPU sizes are not in this list (eg, the
     * so-called "word-integer"); since a word-integer is always 16 bits, we specify TYPE_SHORT,
     * which the Debugger should display as "INT16" for FI* instructions.
     */
    DebuggerX86.TYPE_ST        = 0x0009;        //     FPU ST (implicit stack top)
    DebuggerX86.TYPE_STREG     = 0x000A;        //     FPU ST (explicit stack register, relative to top)
    DebuggerX86.TYPE_SINT      = 0x000B;        //     FPU SI (short-integer; 32-bit); displayed as "INT32"
    DebuggerX86.TYPE_SREAL     = 0x000B;        //     FPU SR (short-real; 32-bit); displayed as "REAL32"
    DebuggerX86.TYPE_LINT      = 0x000C;        //     FPU LI (long-integer; 64-bit); displayed as "INT64"
    DebuggerX86.TYPE_LREAL     = 0x000C;        //     FPU LR (long-real; 64-bit); displayed as "REAL64"
    DebuggerX86.TYPE_TREAL     = 0x000D;        //     FPU TR (temp-real; 80-bit); displayed as "REAL80"
    DebuggerX86.TYPE_BCD80     = 0x000E;        //     FPU PD (packed-decimal; 18 BCD digits in 80 bits, bits 72-78 unused, sign in bit 79); displayed as "BCD80"
    DebuggerX86.TYPE_ENV       = 0x000F;        //     FPU ENV (environment; 14 bytes in real-mode, 28 bytes in protected-mode)
    DebuggerX86.TYPE_FPU       = 0x000F;        //     FPU SAVE (save/restore; 94 bytes in real-mode, 108 bytes in protected-mode)

    /*
     * TYPE_MODE values.  Order is somewhat important, as all values implying
     * the presence of a ModRM byte are assumed to be >= TYPE_MODRM.
     */
    DebuggerX86.TYPE_IMM       = 0x0000;        // (I) immediate data
    DebuggerX86.TYPE_ONE       = 0x0010;        //     implicit 1 (eg, shifts/rotates)
    DebuggerX86.TYPE_IMMOFF    = 0x0020;        // (A) immediate offset
    DebuggerX86.TYPE_IMMREL    = 0x0030;        // (J) immediate relative
    DebuggerX86.TYPE_DSSI      = 0x0040;        // (X) memory addressed by DS:SI
    DebuggerX86.TYPE_ESDI      = 0x0050;        // (Y) memory addressed by ES:DI
    DebuggerX86.TYPE_IMPREG    = 0x0060;        //     implicit register in TYPE_IREG
    DebuggerX86.TYPE_IMPSEG    = 0x0070;        //     implicit segment reg in TYPE_IREG
    DebuggerX86.TYPE_MODRM     = 0x0080;        // (E) standard ModRM decoding
    DebuggerX86.TYPE_MODMEM    = 0x0090;        // (M) ModRM refers to memory only
    DebuggerX86.TYPE_MODREG    = 0x00A0;        // (R) ModRM refers to register only
    DebuggerX86.TYPE_REG       = 0x00B0;        // (G) standard Reg decoding
    DebuggerX86.TYPE_SEGREG    = 0x00C0;        // (S) Reg selects segment register
    DebuggerX86.TYPE_CTLREG    = 0x00D0;        // (C) Reg selects control register
    DebuggerX86.TYPE_DBGREG    = 0x00E0;        // (D) Reg selects debug register
    DebuggerX86.TYPE_TSTREG    = 0x00F0;        // (T) Reg selects test register

    /*
     * TYPE_IREG values, based on the REG_* constants.
     * For convenience, they include TYPE_IMPREG or TYPE_IMPSEG as appropriate.
     */
    DebuggerX86.TYPE_AL = (DebuggerX86.REG_AL << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_BYTE);
    DebuggerX86.TYPE_CL = (DebuggerX86.REG_CL << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_BYTE);
    DebuggerX86.TYPE_DL = (DebuggerX86.REG_DL << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_BYTE);
    DebuggerX86.TYPE_BL = (DebuggerX86.REG_BL << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_BYTE);
    DebuggerX86.TYPE_AH = (DebuggerX86.REG_AH << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_BYTE);
    DebuggerX86.TYPE_CH = (DebuggerX86.REG_CH << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_BYTE);
    DebuggerX86.TYPE_DH = (DebuggerX86.REG_DH << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_BYTE);
    DebuggerX86.TYPE_BH = (DebuggerX86.REG_BH << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_BYTE);
    DebuggerX86.TYPE_AX = (DebuggerX86.REG_AX << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_WORD);
    DebuggerX86.TYPE_CX = (DebuggerX86.REG_CX << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_WORD);
    DebuggerX86.TYPE_DX = (DebuggerX86.REG_DX << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_WORD);
    DebuggerX86.TYPE_BX = (DebuggerX86.REG_BX << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_WORD);
    DebuggerX86.TYPE_SP = (DebuggerX86.REG_SP << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_WORD);
    DebuggerX86.TYPE_BP = (DebuggerX86.REG_BP << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_WORD);
    DebuggerX86.TYPE_SI = (DebuggerX86.REG_SI << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_WORD);
    DebuggerX86.TYPE_DI = (DebuggerX86.REG_DI << 8 | DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_WORD);
    DebuggerX86.TYPE_ES = (DebuggerX86.REG_ES << 8 | DebuggerX86.TYPE_IMPSEG | DebuggerX86.TYPE_SHORT);
    DebuggerX86.TYPE_CS = (DebuggerX86.REG_CS << 8 | DebuggerX86.TYPE_IMPSEG | DebuggerX86.TYPE_SHORT);
    DebuggerX86.TYPE_SS = (DebuggerX86.REG_SS << 8 | DebuggerX86.TYPE_IMPSEG | DebuggerX86.TYPE_SHORT);
    DebuggerX86.TYPE_DS = (DebuggerX86.REG_DS << 8 | DebuggerX86.TYPE_IMPSEG | DebuggerX86.TYPE_SHORT);
    DebuggerX86.TYPE_FS = (DebuggerX86.REG_FS << 8 | DebuggerX86.TYPE_IMPSEG | DebuggerX86.TYPE_SHORT);
    DebuggerX86.TYPE_GS = (DebuggerX86.REG_GS << 8 | DebuggerX86.TYPE_IMPSEG | DebuggerX86.TYPE_SHORT);

    /*
     * TYPE_OTHER bit definitions
     */
    DebuggerX86.TYPE_IN    = 0x1000;            // operand is input
    DebuggerX86.TYPE_OUT   = 0x2000;            // operand is output
    DebuggerX86.TYPE_BOTH  = (DebuggerX86.TYPE_IN | DebuggerX86.TYPE_OUT);
    DebuggerX86.TYPE_8086  = (DebuggerX86.CPU_8086 << 14);
    DebuggerX86.TYPE_8087  = DebuggerX86.TYPE_8086;
    DebuggerX86.TYPE_80186 = (DebuggerX86.CPU_80186 << 14);
    DebuggerX86.TYPE_80286 = (DebuggerX86.CPU_80286 << 14);
    DebuggerX86.TYPE_80287 = DebuggerX86.TYPE_80286;
    DebuggerX86.TYPE_80386 = (DebuggerX86.CPU_80386 << 14);
    DebuggerX86.TYPE_80387 = DebuggerX86.TYPE_80386;
    DebuggerX86.TYPE_CPU_SHIFT = 14;

    DebuggerX86.HISTORY_LIMIT = DEBUG? 100000 : 1000;

    /*
     * Opcode 0x0F has a distinguished history:
     *
     *      On the 8086, it functioned as POP CS
     *      On the 80186, it generated an Invalid Opcode (UD_FAULT) exception
     *      On the 80286, it introduced a new (and growing) series of two-byte opcodes
     *
     * Based on the active CPU model, we make every effort to execute and disassemble this (and every other)
     * opcode appropriately, by setting the opcode's entry in aaOpDescs accordingly.  0x0F in aaOpDescs points
     * to the 8086 table: aOpDescPopCS.
     *
     * Note that we must NOT modify aaOpDescs directly.  this.aaOpDescs will point to DebuggerX86.aaOpDescs
     * if the processor is an 8086, because that's the processor that the hard-coded contents of the table
     * represent; for all other processors, this.aaOpDescs will contain a copy of the table that we can modify.
     */
    DebuggerX86.aOpDescPopCS     = [DebuggerX86.INS.POP,  DebuggerX86.TYPE_CS   | DebuggerX86.TYPE_OUT];
    DebuggerX86.aOpDescUndefined = [DebuggerX86.INS.NONE, DebuggerX86.TYPE_NONE];
    DebuggerX86.aOpDesc0F        = [DebuggerX86.INS.OP0F, DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_BOTH];

    /*
     * The aaOpDescs array is indexed by opcode, and each element is a sub-array (aOpDesc) that describes
     * the corresponding opcode. The sub-elements are as follows:
     *
     *      [0]: {number} of the opcode name (see INS.*)
     *      [1]: {number} containing the destination operand descriptor bit(s), if any
     *      [2]: {number} containing the source operand descriptor bit(s), if any
     *      [3]: {number} containing the occasional third operand descriptor bit(s), if any
     *
     * These sub-elements are all optional. If [0] is not present, the opcode is undefined; if [1] is not
     * present (or contains zero), the opcode has no (or only implied) operands; if [2] is not present, the
     * opcode has only a single operand.  And so on.
     */
    DebuggerX86.aaOpDescs = [
    /* 0x00 */ [DebuggerX86.INS.ADD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x01 */ [DebuggerX86.INS.ADD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x02 */ [DebuggerX86.INS.ADD,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x03 */ [DebuggerX86.INS.ADD,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x04 */ [DebuggerX86.INS.ADD,   DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x05 */ [DebuggerX86.INS.ADD,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x06 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_ES     | DebuggerX86.TYPE_IN],
    /* 0x07 */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_ES     | DebuggerX86.TYPE_OUT],

    /* 0x08 */ [DebuggerX86.INS.OR,    DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x09 */ [DebuggerX86.INS.OR,    DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x0A */ [DebuggerX86.INS.OR,    DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x0B */ [DebuggerX86.INS.OR,    DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x0C */ [DebuggerX86.INS.OR,    DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x0D */ [DebuggerX86.INS.OR,    DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x0E */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_CS     | DebuggerX86.TYPE_IN],
    /* 0x0F */ DebuggerX86.aOpDescPopCS,

    /* 0x10 */ [DebuggerX86.INS.ADC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x11 */ [DebuggerX86.INS.ADC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x12 */ [DebuggerX86.INS.ADC,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x13 */ [DebuggerX86.INS.ADC,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x14 */ [DebuggerX86.INS.ADC,   DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x15 */ [DebuggerX86.INS.ADC,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x16 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_SS     | DebuggerX86.TYPE_IN],
    /* 0x17 */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_SS     | DebuggerX86.TYPE_OUT],

    /* 0x18 */ [DebuggerX86.INS.SBB,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x19 */ [DebuggerX86.INS.SBB,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x1A */ [DebuggerX86.INS.SBB,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x1B */ [DebuggerX86.INS.SBB,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x1C */ [DebuggerX86.INS.SBB,   DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x1D */ [DebuggerX86.INS.SBB,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x1E */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_DS     | DebuggerX86.TYPE_IN],
    /* 0x1F */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_DS     | DebuggerX86.TYPE_OUT],

    /* 0x20 */ [DebuggerX86.INS.AND,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x21 */ [DebuggerX86.INS.AND,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x22 */ [DebuggerX86.INS.AND,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x23 */ [DebuggerX86.INS.AND,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x24 */ [DebuggerX86.INS.AND,   DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x25 */ [DebuggerX86.INS.AND,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x26 */ [DebuggerX86.INS.ES,    DebuggerX86.TYPE_PREFIX],
    /* 0x27 */ [DebuggerX86.INS.DAA],

    /* 0x28 */ [DebuggerX86.INS.SUB,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x29 */ [DebuggerX86.INS.SUB,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x2A */ [DebuggerX86.INS.SUB,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x2B */ [DebuggerX86.INS.SUB,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x2C */ [DebuggerX86.INS.SUB,   DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x2D */ [DebuggerX86.INS.SUB,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x2E */ [DebuggerX86.INS.CS,    DebuggerX86.TYPE_PREFIX],
    /* 0x2F */ [DebuggerX86.INS.DAS],

    /* 0x30 */ [DebuggerX86.INS.XOR,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x31 */ [DebuggerX86.INS.XOR,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x32 */ [DebuggerX86.INS.XOR,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x33 */ [DebuggerX86.INS.XOR,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x34 */ [DebuggerX86.INS.XOR,   DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x35 */ [DebuggerX86.INS.XOR,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x36 */ [DebuggerX86.INS.SS,    DebuggerX86.TYPE_PREFIX],
    /* 0x37 */ [DebuggerX86.INS.AAA],

    /* 0x38 */ [DebuggerX86.INS.CMP,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x39 */ [DebuggerX86.INS.CMP,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x3A */ [DebuggerX86.INS.CMP,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x3B */ [DebuggerX86.INS.CMP,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x3C */ [DebuggerX86.INS.CMP,   DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_IN,     DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x3D */ [DebuggerX86.INS.CMP,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_IN,     DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x3E */ [DebuggerX86.INS.DS,    DebuggerX86.TYPE_PREFIX],
    /* 0x3F */ [DebuggerX86.INS.AAS],

    /* 0x40 */ [DebuggerX86.INS.INC,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH],
    /* 0x41 */ [DebuggerX86.INS.INC,   DebuggerX86.TYPE_CX     | DebuggerX86.TYPE_BOTH],
    /* 0x42 */ [DebuggerX86.INS.INC,   DebuggerX86.TYPE_DX     | DebuggerX86.TYPE_BOTH],
    /* 0x43 */ [DebuggerX86.INS.INC,   DebuggerX86.TYPE_BX     | DebuggerX86.TYPE_BOTH],
    /* 0x44 */ [DebuggerX86.INS.INC,   DebuggerX86.TYPE_SP     | DebuggerX86.TYPE_BOTH],
    /* 0x45 */ [DebuggerX86.INS.INC,   DebuggerX86.TYPE_BP     | DebuggerX86.TYPE_BOTH],
    /* 0x46 */ [DebuggerX86.INS.INC,   DebuggerX86.TYPE_SI     | DebuggerX86.TYPE_BOTH],
    /* 0x47 */ [DebuggerX86.INS.INC,   DebuggerX86.TYPE_DI     | DebuggerX86.TYPE_BOTH],

    /* 0x48 */ [DebuggerX86.INS.DEC,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH],
    /* 0x49 */ [DebuggerX86.INS.DEC,   DebuggerX86.TYPE_CX     | DebuggerX86.TYPE_BOTH],
    /* 0x4A */ [DebuggerX86.INS.DEC,   DebuggerX86.TYPE_DX     | DebuggerX86.TYPE_BOTH],
    /* 0x4B */ [DebuggerX86.INS.DEC,   DebuggerX86.TYPE_BX     | DebuggerX86.TYPE_BOTH],
    /* 0x4C */ [DebuggerX86.INS.DEC,   DebuggerX86.TYPE_SP     | DebuggerX86.TYPE_BOTH],
    /* 0x4D */ [DebuggerX86.INS.DEC,   DebuggerX86.TYPE_BP     | DebuggerX86.TYPE_BOTH],
    /* 0x4E */ [DebuggerX86.INS.DEC,   DebuggerX86.TYPE_SI     | DebuggerX86.TYPE_BOTH],
    /* 0x4F */ [DebuggerX86.INS.DEC,   DebuggerX86.TYPE_DI     | DebuggerX86.TYPE_BOTH],

    /* 0x50 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_IN],
    /* 0x51 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_CX     | DebuggerX86.TYPE_IN],
    /* 0x52 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_DX     | DebuggerX86.TYPE_IN],
    /* 0x53 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_BX     | DebuggerX86.TYPE_IN],
    /* 0x54 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_SP     | DebuggerX86.TYPE_IN],
    /* 0x55 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_BP     | DebuggerX86.TYPE_IN],
    /* 0x56 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_SI     | DebuggerX86.TYPE_IN],
    /* 0x57 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_DI     | DebuggerX86.TYPE_IN],

    /* 0x58 */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_OUT],
    /* 0x59 */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_CX     | DebuggerX86.TYPE_OUT],
    /* 0x5A */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_DX     | DebuggerX86.TYPE_OUT],
    /* 0x5B */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_BX     | DebuggerX86.TYPE_OUT],
    /* 0x5C */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_SP     | DebuggerX86.TYPE_OUT],
    /* 0x5D */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_BP     | DebuggerX86.TYPE_OUT],
    /* 0x5E */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_SI     | DebuggerX86.TYPE_OUT],
    /* 0x5F */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_DI     | DebuggerX86.TYPE_OUT],

    /* 0x60 */ [DebuggerX86.INS.PUSHA, DebuggerX86.TYPE_NONE   | DebuggerX86.TYPE_80286],
    /* 0x61 */ [DebuggerX86.INS.POPA,  DebuggerX86.TYPE_NONE   | DebuggerX86.TYPE_80286],
    /* 0x62 */ [DebuggerX86.INS.BOUND, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x63 */ [DebuggerX86.INS.ARPL,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_OUT,                           DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
    /* 0x64 */ [DebuggerX86.INS.FS,    DebuggerX86.TYPE_PREFIX | DebuggerX86.TYPE_80386],
    /* 0x65 */ [DebuggerX86.INS.GS,    DebuggerX86.TYPE_PREFIX | DebuggerX86.TYPE_80386],
    /* 0x66 */ [DebuggerX86.INS.OS,    DebuggerX86.TYPE_PREFIX | DebuggerX86.TYPE_80386],
    /* 0x67 */ [DebuggerX86.INS.AS,    DebuggerX86.TYPE_PREFIX | DebuggerX86.TYPE_80386],

    /* 0x68 */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80286],
    /* 0x69 */ [DebuggerX86.INS.IMUL,  DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x6A */ [DebuggerX86.INS.PUSH,  DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_SBYTE | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80286],
    /* 0x6B */ [DebuggerX86.INS.IMUL,  DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x6C */ [DebuggerX86.INS.INS,   DebuggerX86.TYPE_ESDI   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_DX    | DebuggerX86.TYPE_IN],
    /* 0x6D */ [DebuggerX86.INS.INS,   DebuggerX86.TYPE_ESDI   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_DX    | DebuggerX86.TYPE_IN],
    /* 0x6E */ [DebuggerX86.INS.OUTS,  DebuggerX86.TYPE_DX     | DebuggerX86.TYPE_IN    | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_DSSI | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x6F */ [DebuggerX86.INS.OUTS,  DebuggerX86.TYPE_DX     | DebuggerX86.TYPE_IN    | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_DSSI | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],

    /* 0x70 */ [DebuggerX86.INS.JO,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x71 */ [DebuggerX86.INS.JNO,   DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x72 */ [DebuggerX86.INS.JC,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x73 */ [DebuggerX86.INS.JNC,   DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x74 */ [DebuggerX86.INS.JZ,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x75 */ [DebuggerX86.INS.JNZ,   DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x76 */ [DebuggerX86.INS.JBE,   DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x77 */ [DebuggerX86.INS.JA,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],

    /* 0x78 */ [DebuggerX86.INS.JS,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x79 */ [DebuggerX86.INS.JNS,   DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x7A */ [DebuggerX86.INS.JP,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x7B */ [DebuggerX86.INS.JNP,   DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x7C */ [DebuggerX86.INS.JL,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x7D */ [DebuggerX86.INS.JGE,   DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x7E */ [DebuggerX86.INS.JLE,   DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x7F */ [DebuggerX86.INS.JG,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],

    /* 0x80 */ [DebuggerX86.INS.GRP1B, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x81 */ [DebuggerX86.INS.GRP1W, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x82 */ [DebuggerX86.INS.GRP1B, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x83 */ [DebuggerX86.INS.GRP1SW,DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x84 */ [DebuggerX86.INS.TEST,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x85 */ [DebuggerX86.INS.TEST,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_REG   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x86 */ [DebuggerX86.INS.XCHG,  DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH],
    /* 0x87 */ [DebuggerX86.INS.XCHG,  DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH],

    /* 0x88 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT,  DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x89 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,  DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x8A */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0x8B */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x8C */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,  DebuggerX86.TYPE_SEGREG | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
    /* 0x8D */ [DebuggerX86.INS.LEA,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,  DebuggerX86.TYPE_MODMEM | DebuggerX86.TYPE_WORD ],
    /* 0x8E */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_SEGREG | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_OUT,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0x8F */ [DebuggerX86.INS.POP,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT],

    /* 0x90 */ [DebuggerX86.INS.NOP],
    /* 0x91 */ [DebuggerX86.INS.XCHG,  DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_CX  | DebuggerX86.TYPE_BOTH],
    /* 0x92 */ [DebuggerX86.INS.XCHG,  DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_DX  | DebuggerX86.TYPE_BOTH],
    /* 0x93 */ [DebuggerX86.INS.XCHG,  DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_BX  | DebuggerX86.TYPE_BOTH],
    /* 0x94 */ [DebuggerX86.INS.XCHG,  DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_SP  | DebuggerX86.TYPE_BOTH],
    /* 0x95 */ [DebuggerX86.INS.XCHG,  DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_BP  | DebuggerX86.TYPE_BOTH],
    /* 0x96 */ [DebuggerX86.INS.XCHG,  DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_SI  | DebuggerX86.TYPE_BOTH],
    /* 0x97 */ [DebuggerX86.INS.XCHG,  DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_BOTH,   DebuggerX86.TYPE_DI  | DebuggerX86.TYPE_BOTH],

    /* 0x98 */ [DebuggerX86.INS.CBW],
    /* 0x99 */ [DebuggerX86.INS.CWD],
    /* 0x9A */ [DebuggerX86.INS.CALL,  DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_FARP |  DebuggerX86.TYPE_IN],
    /* 0x9B */ [DebuggerX86.INS.WAIT],
    /* 0x9C */ [DebuggerX86.INS.PUSHF],
    /* 0x9D */ [DebuggerX86.INS.POPF],
    /* 0x9E */ [DebuggerX86.INS.SAHF],
    /* 0x9F */ [DebuggerX86.INS.LAHF],

    /* 0xA0 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMMOFF | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xA1 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMMOFF | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xA2 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_IMMOFF | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT,     DebuggerX86.TYPE_AL    | DebuggerX86.TYPE_IN],
    /* 0xA3 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_IMMOFF | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,     DebuggerX86.TYPE_AX    | DebuggerX86.TYPE_IN],
    /* 0xA4 */ [DebuggerX86.INS.MOVSB, DebuggerX86.TYPE_ESDI   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT,     DebuggerX86.TYPE_DSSI  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xA5 */ [DebuggerX86.INS.MOVSW, DebuggerX86.TYPE_ESDI   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,     DebuggerX86.TYPE_DSSI  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xA6 */ [DebuggerX86.INS.CMPSB, DebuggerX86.TYPE_ESDI   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN,      DebuggerX86.TYPE_DSSI  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xA7 */ [DebuggerX86.INS.CMPSW, DebuggerX86.TYPE_ESDI   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN,      DebuggerX86.TYPE_DSSI  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],

    /* 0xA8 */ [DebuggerX86.INS.TEST,  DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_IN,     DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xA9 */ [DebuggerX86.INS.TEST,  DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_IN,     DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xAA */ [DebuggerX86.INS.STOSB, DebuggerX86.TYPE_ESDI   | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT,   DebuggerX86.TYPE_AL    | DebuggerX86.TYPE_IN],
    /* 0xAB */ [DebuggerX86.INS.STOSW, DebuggerX86.TYPE_ESDI   | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,   DebuggerX86.TYPE_AX    | DebuggerX86.TYPE_IN],
    /* 0xAC */ [DebuggerX86.INS.LODSB, DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_DSSI | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xAD */ [DebuggerX86.INS.LODSW, DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_DSSI | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xAE */ [DebuggerX86.INS.SCASB, DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_IN,     DebuggerX86.TYPE_ESDI | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xAF */ [DebuggerX86.INS.SCASW, DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_IN,     DebuggerX86.TYPE_ESDI | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],

    /* 0xB0 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xB1 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_CL     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xB2 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_DL     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xB3 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_BL     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xB4 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_AH     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xB5 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_CH     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xB6 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_DH     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xB7 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_BH     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],

    /* 0xB8 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xB9 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_CX     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xBA */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_DX     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xBB */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_BX     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xBC */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_SP     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xBD */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_BP     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xBE */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_SI     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xBF */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_DI     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],

    /* 0xC0 */ [DebuggerX86.INS.GRP2B, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80186,  DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
    /* 0xC1 */ [DebuggerX86.INS.GRP2W, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80186,  DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
    /* 0xC2 */ [DebuggerX86.INS.RET,   DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
    /* 0xC3 */ [DebuggerX86.INS.RET],
    /* 0xC4 */ [DebuggerX86.INS.LES,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,   DebuggerX86.TYPE_MODMEM  | DebuggerX86.TYPE_SEGP  | DebuggerX86.TYPE_IN],
    /* 0xC5 */ [DebuggerX86.INS.LDS,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,   DebuggerX86.TYPE_MODMEM  | DebuggerX86.TYPE_SEGP  | DebuggerX86.TYPE_IN],
    /* 0xC6 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT,   DebuggerX86.TYPE_IMM     | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xC7 */ [DebuggerX86.INS.MOV,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,   DebuggerX86.TYPE_IMM     | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],

    /* 0xC8 */ [DebuggerX86.INS.ENTER, DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80286,    DebuggerX86.TYPE_IMM   | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
    /* 0xC9 */ [DebuggerX86.INS.LEAVE, DebuggerX86.TYPE_NONE   | DebuggerX86.TYPE_80286],
    /* 0xCA */ [DebuggerX86.INS.RETF,  DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
    /* 0xCB */ [DebuggerX86.INS.RETF],
    /* 0xCC */ [DebuggerX86.INS.INT3],
    /* 0xCD */ [DebuggerX86.INS.INT,   DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xCE */ [DebuggerX86.INS.INTO],
    /* 0xCF */ [DebuggerX86.INS.IRET],

    /* 0xD0 */ [DebuggerX86.INS.GRP2B1,DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH,  DebuggerX86.TYPE_ONE    | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
    /* 0xD1 */ [DebuggerX86.INS.GRP2W1,DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH,  DebuggerX86.TYPE_ONE    | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
    /* 0xD2 */ [DebuggerX86.INS.GRP2BC,DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH,  DebuggerX86.TYPE_CL     | DebuggerX86.TYPE_IN],
    /* 0xD3 */ [DebuggerX86.INS.GRP2WC,DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH,  DebuggerX86.TYPE_CL     | DebuggerX86.TYPE_IN],
    /* 0xD4 */ [DebuggerX86.INS.AAM,   DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_BYTE],
    /* 0xD5 */ [DebuggerX86.INS.AAD,   DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_BYTE],
    /* 0xD6 */ [DebuggerX86.INS.SALC],
    /* 0xD7 */ [DebuggerX86.INS.XLAT],

    /* 0xD8 */ [DebuggerX86.INS.ESC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xD9 */ [DebuggerX86.INS.ESC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xDA */ [DebuggerX86.INS.ESC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xDB */ [DebuggerX86.INS.ESC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xDC */ [DebuggerX86.INS.ESC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xDD */ [DebuggerX86.INS.ESC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xDE */ [DebuggerX86.INS.ESC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xDF */ [DebuggerX86.INS.ESC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],

    /* 0xE0 */ [DebuggerX86.INS.LOOPNZ,DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xE1 */ [DebuggerX86.INS.LOOPZ, DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xE2 */ [DebuggerX86.INS.LOOP,  DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xE3 */ [DebuggerX86.INS.JCXZ,  DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xE4 */ [DebuggerX86.INS.IN,    DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
    /* 0xE5 */ [DebuggerX86.INS.IN,    DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_IMM  | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
    /* 0xE6 */ [DebuggerX86.INS.OUT,   DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN,    DebuggerX86.TYPE_AL   | DebuggerX86.TYPE_IN],
    /* 0xE7 */ [DebuggerX86.INS.OUT,   DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN,    DebuggerX86.TYPE_AX   | DebuggerX86.TYPE_IN],

    /* 0xE8 */ [DebuggerX86.INS.CALL,  DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xE9 */ [DebuggerX86.INS.JMP,   DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
    /* 0xEA */ [DebuggerX86.INS.JMP,   DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_FARP  | DebuggerX86.TYPE_IN],
    /* 0xEB */ [DebuggerX86.INS.JMP,   DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
    /* 0xEC */ [DebuggerX86.INS.IN,    DebuggerX86.TYPE_AL     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_DX   | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
    /* 0xED */ [DebuggerX86.INS.IN,    DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_OUT,    DebuggerX86.TYPE_DX   | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
    /* 0xEE */ [DebuggerX86.INS.OUT,   DebuggerX86.TYPE_DX     | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN,    DebuggerX86.TYPE_AL    | DebuggerX86.TYPE_IN],
    /* 0xEF */ [DebuggerX86.INS.OUT,   DebuggerX86.TYPE_DX     | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN,    DebuggerX86.TYPE_AX    | DebuggerX86.TYPE_IN],

    /* 0xF0 */ [DebuggerX86.INS.LOCK,  DebuggerX86.TYPE_PREFIX],
    /* 0xF1 */ [DebuggerX86.INS.NONE],
    /* 0xF2 */ [DebuggerX86.INS.REPNZ, DebuggerX86.TYPE_PREFIX],
    /* 0xF3 */ [DebuggerX86.INS.REPZ,  DebuggerX86.TYPE_PREFIX],
    /* 0xF4 */ [DebuggerX86.INS.HLT],
    /* 0xF5 */ [DebuggerX86.INS.CMC],
    /* 0xF6 */ [DebuggerX86.INS.GRP3B, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH],
    /* 0xF7 */ [DebuggerX86.INS.GRP3W, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH],

    /* 0xF8 */ [DebuggerX86.INS.CLC],
    /* 0xF9 */ [DebuggerX86.INS.STC],
    /* 0xFA */ [DebuggerX86.INS.CLI],
    /* 0xFB */ [DebuggerX86.INS.STI],
    /* 0xFC */ [DebuggerX86.INS.CLD],
    /* 0xFD */ [DebuggerX86.INS.STD],
    /* 0xFE */ [DebuggerX86.INS.GRP4B, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH],
    /* 0xFF */ [DebuggerX86.INS.GRP4W, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH]
    ];

    DebuggerX86.aaOp0FDescs = {
        0x00: [DebuggerX86.INS.GRP6,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_BOTH],
        0x01: [DebuggerX86.INS.GRP7,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_BOTH],
        0x02: [DebuggerX86.INS.LAR,    DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_MODMEM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_IN],
        0x03: [DebuggerX86.INS.LSL,    DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_MODMEM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_IN],
        0x05: [DebuggerX86.INS.LOADALL,DebuggerX86.TYPE_80286],
        0x06: [DebuggerX86.INS.CLTS,   DebuggerX86.TYPE_80286],
        0x07: [DebuggerX86.INS.LOADALL,DebuggerX86.TYPE_80386],   // TODO: implied operand is ES:[(E)DI]
        0x20: [DebuggerX86.INS.MOV,    DebuggerX86.TYPE_MODREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_CTLREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_IN],
        0x21: [DebuggerX86.INS.MOV,    DebuggerX86.TYPE_MODREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_DBGREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_IN],
        0x22: [DebuggerX86.INS.MOV,    DebuggerX86.TYPE_CTLREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_MODREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_IN],
        0x23: [DebuggerX86.INS.MOV,    DebuggerX86.TYPE_DBGREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_MODREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_IN],
        0x24: [DebuggerX86.INS.MOV,    DebuggerX86.TYPE_MODREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_TSTREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_IN],
        0x26: [DebuggerX86.INS.MOV,    DebuggerX86.TYPE_TSTREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_MODREG | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_IN],
        0x80: [DebuggerX86.INS.JO,     DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x81: [DebuggerX86.INS.JNO,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x82: [DebuggerX86.INS.JC,     DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x83: [DebuggerX86.INS.JNC,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x84: [DebuggerX86.INS.JZ,     DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x85: [DebuggerX86.INS.JNZ,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x86: [DebuggerX86.INS.JBE,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x87: [DebuggerX86.INS.JA,     DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x88: [DebuggerX86.INS.JS,     DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x89: [DebuggerX86.INS.JNS,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x8A: [DebuggerX86.INS.JP,     DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x8B: [DebuggerX86.INS.JNP,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x8C: [DebuggerX86.INS.JL,     DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x8D: [DebuggerX86.INS.JGE,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x8E: [DebuggerX86.INS.JLE,    DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x8F: [DebuggerX86.INS.JG,     DebuggerX86.TYPE_IMMREL | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386],
        0x90: [DebuggerX86.INS.SETO,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x91: [DebuggerX86.INS.SETNO,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x92: [DebuggerX86.INS.SETC,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x93: [DebuggerX86.INS.SETNC,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x94: [DebuggerX86.INS.SETZ,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x95: [DebuggerX86.INS.SETNZ,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x96: [DebuggerX86.INS.SETBE,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x97: [DebuggerX86.INS.SETNBE, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x98: [DebuggerX86.INS.SETS,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x99: [DebuggerX86.INS.SETNS,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x9A: [DebuggerX86.INS.SETP,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x9B: [DebuggerX86.INS.SETNP,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x9C: [DebuggerX86.INS.SETL,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x9D: [DebuggerX86.INS.SETGE,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x9E: [DebuggerX86.INS.SETLE,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0x9F: [DebuggerX86.INS.SETG,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386],
        0xA0: [DebuggerX86.INS.PUSH,   DebuggerX86.TYPE_FS     | DebuggerX86.TYPE_IN    | DebuggerX86.TYPE_80386],
        0xA1: [DebuggerX86.INS.POP,    DebuggerX86.TYPE_FS     | DebuggerX86.TYPE_OUT   | DebuggerX86.TYPE_80386],
        0xA3: [DebuggerX86.INS.BT,     DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN   | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        0xA4: [DebuggerX86.INS.SHLD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        0xA5: [DebuggerX86.INS.SHLD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN, DebuggerX86.TYPE_CL  | DebuggerX86.TYPE_IN],
        0xA6: [DebuggerX86.INS.XBTS,   DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN, DebuggerX86.TYPE_AX  | DebuggerX86.TYPE_IN,  DebuggerX86.TYPE_CL    | DebuggerX86.TYPE_IN],
        0xA7: [DebuggerX86.INS.IBTS,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_AX     | DebuggerX86.TYPE_IN, DebuggerX86.TYPE_CL  | DebuggerX86.TYPE_IN, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        0xA8: [DebuggerX86.INS.PUSH,   DebuggerX86.TYPE_GS     | DebuggerX86.TYPE_IN    | DebuggerX86.TYPE_80386],
        0xA9: [DebuggerX86.INS.POP,    DebuggerX86.TYPE_GS     | DebuggerX86.TYPE_OUT   | DebuggerX86.TYPE_80386],
        0xAB: [DebuggerX86.INS.BTS,    DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        0xAC: [DebuggerX86.INS.SHRD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        0xAD: [DebuggerX86.INS.SHRD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN, DebuggerX86.TYPE_CL  | DebuggerX86.TYPE_IN],
        0xAF: [DebuggerX86.INS.IMUL,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        0xB2: [DebuggerX86.INS.LSS,    DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,                           DebuggerX86.TYPE_MODMEM | DebuggerX86.TYPE_SEGP  | DebuggerX86.TYPE_IN],
        0xB3: [DebuggerX86.INS.BTR,    DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        0xB4: [DebuggerX86.INS.LFS,    DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,                           DebuggerX86.TYPE_MODMEM | DebuggerX86.TYPE_SEGP  | DebuggerX86.TYPE_IN],
        0xB5: [DebuggerX86.INS.LGS,    DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT,                           DebuggerX86.TYPE_MODMEM | DebuggerX86.TYPE_SEGP  | DebuggerX86.TYPE_IN],
        0xB6: [DebuggerX86.INS.MOVZX,  DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
        0xB7: [DebuggerX86.INS.MOVZX,  DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
        0xBA: [DebuggerX86.INS.GRP8,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_IMM    | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
        0xBB: [DebuggerX86.INS.BTC,    DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        0xBC: [DebuggerX86.INS.BSF,    DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        0xBD: [DebuggerX86.INS.BSR,    DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        0xBE: [DebuggerX86.INS.MOVSX,  DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
        0xBF: [DebuggerX86.INS.MOVSX,  DebuggerX86.TYPE_REG    | DebuggerX86.TYPE_LONG  | DebuggerX86.TYPE_OUT  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN]
    };

    /*
     * Be sure to keep the following table in sync with X86FPU.aaOps
     */
    DebuggerX86.aaaOpFPUDescs = {
        0xD8: {
            0x00: [DebuggerX86.FINS.FADD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_IN],
            0x01: [DebuggerX86.FINS.FMUL,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_IN],
            0x02: [DebuggerX86.FINS.FCOM,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_IN],
            0x03: [DebuggerX86.FINS.FCOMP,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_IN],
            0x04: [DebuggerX86.FINS.FSUB,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_IN],
            0x05: [DebuggerX86.FINS.FSUBR,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_IN],
            0x06: [DebuggerX86.FINS.FDIV,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_IN],
            0x07: [DebuggerX86.FINS.FDIVR,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_IN],
            0x30: [DebuggerX86.FINS.FADD,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST    | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],
            0x31: [DebuggerX86.FINS.FMUL,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST    | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],
            0x32: [DebuggerX86.FINS.FCOM,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST    | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],
            0x33: [DebuggerX86.FINS.FCOMP,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST    | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],
            0x34: [DebuggerX86.FINS.FSUB,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST    | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],
            0x35: [DebuggerX86.FINS.FSUBR,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST    | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],
            0x36: [DebuggerX86.FINS.FDIV,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST    | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],
            0x37: [DebuggerX86.FINS.FDIVR,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST    | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN]
        },
        0xD9: {
            0x00: [DebuggerX86.FINS.FLD,    DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_IN],
            0x02: [DebuggerX86.FINS.FST,    DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_OUT],
            0x03: [DebuggerX86.FINS.FSTP,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SREAL | DebuggerX86.TYPE_OUT],
            0x04: [DebuggerX86.FINS.FLDENV, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_ENV   | DebuggerX86.TYPE_IN],
            0x05: [DebuggerX86.FINS.FLDCW,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
            0x06: [DebuggerX86.FINS.FSTENV, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_ENV   | DebuggerX86.TYPE_OUT],
            0x07: [DebuggerX86.FINS.FSTCW,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_OUT],
            0x30: [DebuggerX86.FINS.FLD,    DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT],
            0x31: [DebuggerX86.FINS.FXCH,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT],
            0x32: [DebuggerX86.FINS.FNOP],
            0x33: [DebuggerX86.FINS.FSTP,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT],   // Obsolete encoding
            0x40: [DebuggerX86.FINS.FCHS],
            0x41: [DebuggerX86.FINS.FABS],
            0x44: [DebuggerX86.FINS.FTST],
            0x45: [DebuggerX86.FINS.FXAM],
            0x50: [DebuggerX86.FINS.FLD1],
            0x51: [DebuggerX86.FINS.FLDL2T],
            0x52: [DebuggerX86.FINS.FLDL2E],
            0x53: [DebuggerX86.FINS.FLDPI],
            0x54: [DebuggerX86.FINS.FLDLG2],
            0x55: [DebuggerX86.FINS.FLDLN2],
            0x56: [DebuggerX86.FINS.FLDZ],
            0x60: [DebuggerX86.FINS.F2XM1],
            0x61: [DebuggerX86.FINS.FYL2X],
            0x62: [DebuggerX86.FINS.FPTAN],
            0x63: [DebuggerX86.FINS.FPATAN],
            0x64: [DebuggerX86.FINS.FXTRACT],
            0x66: [DebuggerX86.FINS.FDECSTP],
            0x67: [DebuggerX86.FINS.FINCSTP],
            0x70: [DebuggerX86.FINS.FPREM],
            0x71: [DebuggerX86.FINS.FYL2XP1],
            0x72: [DebuggerX86.FINS.FSQRT],
            0x74: [DebuggerX86.FINS.FRNDINT],
            0x75: [DebuggerX86.FINS.FSCALE]
        },
        0xDA: {
            0x00: [DebuggerX86.FINS.FIADD,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT | DebuggerX86.TYPE_IN],
            0x01: [DebuggerX86.FINS.FIMUL,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT | DebuggerX86.TYPE_IN],
            0x02: [DebuggerX86.FINS.FICOM,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT | DebuggerX86.TYPE_IN],
            0x03: [DebuggerX86.FINS.FICOMP, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT | DebuggerX86.TYPE_IN],
            0x04: [DebuggerX86.FINS.FISUB,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT | DebuggerX86.TYPE_IN],
            0x05: [DebuggerX86.FINS.FISUBR, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT | DebuggerX86.TYPE_IN],
            0x06: [DebuggerX86.FINS.FIDIV,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT | DebuggerX86.TYPE_IN],
            0x07: [DebuggerX86.FINS.FIDIVR, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT | DebuggerX86.TYPE_IN]
        },
        0xDB: {
            0x00: [DebuggerX86.FINS.FILD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT  | DebuggerX86.TYPE_IN],
            0x02: [DebuggerX86.FINS.FIST,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT  | DebuggerX86.TYPE_OUT],
            0x03: [DebuggerX86.FINS.FISTP,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SINT  | DebuggerX86.TYPE_OUT],
            0x05: [DebuggerX86.FINS.FLD,    DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_TREAL | DebuggerX86.TYPE_IN],
            0x07: [DebuggerX86.FINS.FSTP,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_TREAL | DebuggerX86.TYPE_OUT],
            0x40: [DebuggerX86.FINS.FENI],
            0x41: [DebuggerX86.FINS.FDISI],
            0x42: [DebuggerX86.FINS.FCLEX],
            0x43: [DebuggerX86.FINS.FINIT],
            0x44: [DebuggerX86.FINS.FSETPM,  DebuggerX86.TYPE_80287],
            0x73: [DebuggerX86.FINS.FSINCOS, DebuggerX86.TYPE_80387]
        },
        0xDC: {
            0x00: [DebuggerX86.FINS.FADD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_IN],
            0x01: [DebuggerX86.FINS.FMUL,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_IN],
            0x02: [DebuggerX86.FINS.FCOM,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_IN],
            0x03: [DebuggerX86.FINS.FCOMP,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_IN],
            0x04: [DebuggerX86.FINS.FSUB,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_IN],
            0x05: [DebuggerX86.FINS.FSUBR,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_IN],
            0x06: [DebuggerX86.FINS.FDIV,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_IN],
            0x07: [DebuggerX86.FINS.FDIVR,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_IN],
            0x30: [DebuggerX86.FINS.FADD,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN],
            0x31: [DebuggerX86.FINS.FMUL,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN],
            0x32: [DebuggerX86.FINS.FCOM,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],    // Obsolete encoding
            0x33: [DebuggerX86.FINS.FCOMP,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],    // Obsolete encoding
            0x34: [DebuggerX86.FINS.FSUBR,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN],
            0x35: [DebuggerX86.FINS.FSUB,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN],
            0x36: [DebuggerX86.FINS.FDIVR,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN],
            0x37: [DebuggerX86.FINS.FDIV,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN]
        },
        0xDD: {
            0x00: [DebuggerX86.FINS.FLD,    DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_IN],
            0x02: [DebuggerX86.FINS.FST,    DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_OUT],
            0x03: [DebuggerX86.FINS.FSTP,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LREAL | DebuggerX86.TYPE_OUT],
            0x04: [DebuggerX86.FINS.FRSTOR, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_FPU   | DebuggerX86.TYPE_IN],
            0x06: [DebuggerX86.FINS.FSAVE,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_FPU   | DebuggerX86.TYPE_OUT],
            0x07: [DebuggerX86.FINS.FSTSW,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_OUT],
            0x30: [DebuggerX86.FINS.FFREE,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],
            0x31: [DebuggerX86.FINS.FXCH,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT],   // Obsolete encoding
            0x32: [DebuggerX86.FINS.FST,    DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],
            0x33: [DebuggerX86.FINS.FSTP,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN]
        },
        0xDE: {
            0x00: [DebuggerX86.FINS.FIADD,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
            0x01: [DebuggerX86.FINS.FIMUL,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
            0x02: [DebuggerX86.FINS.FICOM,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
            0x03: [DebuggerX86.FINS.FICOMP, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
            0x04: [DebuggerX86.FINS.FISUB,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
            0x05: [DebuggerX86.FINS.FISUBR, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
            0x06: [DebuggerX86.FINS.FIDIV,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
            0x07: [DebuggerX86.FINS.FIDIVR, DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
            0x30: [DebuggerX86.FINS.FADDP,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN],
            0x31: [DebuggerX86.FINS.FMULP,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN],
            0x32: [DebuggerX86.FINS.FCOMP,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],    // Obsolete encoding
            0x33: [DebuggerX86.FINS.FCOMPP, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],
            0x34: [DebuggerX86.FINS.FSUBRP, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN],
            0x35: [DebuggerX86.FINS.FSUBP,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN],
            0x36: [DebuggerX86.FINS.FDIVRP, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN],
            0x37: [DebuggerX86.FINS.FDIVP,  DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_ST | DebuggerX86.TYPE_IN]
        },
        0xDF: {
            0x00: [DebuggerX86.FINS.FILD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_IN],
            0x02: [DebuggerX86.FINS.FIST,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_OUT],
            0x03: [DebuggerX86.FINS.FISTP,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_SHORT | DebuggerX86.TYPE_OUT],
            0x04: [DebuggerX86.FINS.FBLD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BCD80 | DebuggerX86.TYPE_IN],
            0x05: [DebuggerX86.FINS.FILD,   DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LINT  | DebuggerX86.TYPE_IN],
            0x06: [DebuggerX86.FINS.FBSTP,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_BCD80 | DebuggerX86.TYPE_OUT],
            0x07: [DebuggerX86.FINS.FISTP,  DebuggerX86.TYPE_MODRM  | DebuggerX86.TYPE_LINT  | DebuggerX86.TYPE_OUT],
            0x30: [DebuggerX86.FINS.FFREEP, DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],    // Obsolete encoding
            0x31: [DebuggerX86.FINS.FXCH,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_OUT],   // Obsolete encoding
            0x32: [DebuggerX86.FINS.FSTP,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],    // Obsolete encoding
            0x33: [DebuggerX86.FINS.FSTP,   DebuggerX86.TYPE_IMPREG | DebuggerX86.TYPE_STREG | DebuggerX86.TYPE_IN],    // Obsolete encoding
            0x34: [DebuggerX86.FINS.FSTSWAX, DebuggerX86.TYPE_80287]
        }
    };

    DebuggerX86.aaGrpDescs = [
      [
        /* GRP1B */
        [DebuggerX86.INS.ADD,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.OR,   DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.ADC,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SBB,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.AND,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SUB,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.XOR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.CMP,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN]
      ],
      [
        /* GRP1W */
        [DebuggerX86.INS.ADD,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.OR,   DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.ADC,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SBB,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.AND,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SUB,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.XOR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.CMP,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN]
      ],
      [
        /* GRP1SW */
        [DebuggerX86.INS.ADD,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_SBYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.OR,   DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_SBYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.ADC,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_SBYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SBB,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_SBYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.AND,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_SBYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SUB,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_SBYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.XOR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_SBYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.CMP,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_SBYTE | DebuggerX86.TYPE_IN]
      ],
      [
        /* GRP2B */
        [DebuggerX86.INS.ROL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.ROR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
         DebuggerX86.aOpDescUndefined,
        [DebuggerX86.INS.SAR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN]
      ],
      [
        /* GRP2W */
        [DebuggerX86.INS.ROL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.ROR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
         DebuggerX86.aOpDescUndefined,
        [DebuggerX86.INS.SAR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH | DebuggerX86.TYPE_80286, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN]
      ],
      [
        /* GRP2B1 */
        [DebuggerX86.INS.ROL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.ROR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
         DebuggerX86.aOpDescUndefined,
        [DebuggerX86.INS.SAR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN]
      ],
      [
        /* GRP2W1 */
        [DebuggerX86.INS.ROL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.ROR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
         DebuggerX86.aOpDescUndefined,
        [DebuggerX86.INS.SAR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_ONE | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN]
      ],
      [
        /* GRP2BC */
        [DebuggerX86.INS.ROL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.ROR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
         DebuggerX86.aOpDescUndefined,
        [DebuggerX86.INS.SAR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN]
      ],
      [
        /* GRP2WC */
        [DebuggerX86.INS.ROL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.ROR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.RCR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.SHR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN],
         DebuggerX86.aOpDescUndefined,
        [DebuggerX86.INS.SAR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH, DebuggerX86.TYPE_CL | DebuggerX86.TYPE_IN]
      ],
      [
        /* GRP3B */
        [DebuggerX86.INS.TEST, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
         DebuggerX86.aOpDescUndefined,
        [DebuggerX86.INS.NOT,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH],
        [DebuggerX86.INS.NEG,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH],
        [DebuggerX86.INS.MUL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.IMUL, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH],
        [DebuggerX86.INS.DIV,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.IDIV, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH]
      ],
      [
        /* GRP3W */
        [DebuggerX86.INS.TEST, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN,   DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
         DebuggerX86.aOpDescUndefined,
        [DebuggerX86.INS.NOT,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH],
        [DebuggerX86.INS.NEG,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH],
        [DebuggerX86.INS.MUL,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.IMUL, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH],
        [DebuggerX86.INS.DIV,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.IDIV, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH]
      ],
      [
        /* GRP4B */
        [DebuggerX86.INS.INC,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH],
        [DebuggerX86.INS.DEC,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_BYTE  | DebuggerX86.TYPE_BOTH],
         DebuggerX86.aOpDescUndefined,
         DebuggerX86.aOpDescUndefined,
         DebuggerX86.aOpDescUndefined,
         DebuggerX86.aOpDescUndefined,
         DebuggerX86.aOpDescUndefined,
         DebuggerX86.aOpDescUndefined
      ],
      [
        /* GRP4W */
        [DebuggerX86.INS.INC,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH],
        [DebuggerX86.INS.DEC,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_BOTH],
        [DebuggerX86.INS.CALL, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.CALL, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_FARP  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.JMP,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.JMP,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_FARP  | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.PUSH, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN],
         DebuggerX86.aOpDescUndefined
      ],
      [ /* OP0F */ ],
      [
        /* GRP6 */
        [DebuggerX86.INS.SLDT, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_OUT | DebuggerX86.TYPE_80286],
        [DebuggerX86.INS.STR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_OUT | DebuggerX86.TYPE_80286],
        [DebuggerX86.INS.LLDT, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_IN  | DebuggerX86.TYPE_80286],
        [DebuggerX86.INS.LTR,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_IN  | DebuggerX86.TYPE_80286],
        [DebuggerX86.INS.VERR, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_IN  | DebuggerX86.TYPE_80286],
        [DebuggerX86.INS.VERW, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_IN  | DebuggerX86.TYPE_80286],
         DebuggerX86.aOpDescUndefined,
         DebuggerX86.aOpDescUndefined
      ],
      [
        /* GRP7 */
        [DebuggerX86.INS.SGDT, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_OUT | DebuggerX86.TYPE_80286],
        [DebuggerX86.INS.SIDT, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_OUT | DebuggerX86.TYPE_80286],
        [DebuggerX86.INS.LGDT, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_IN  | DebuggerX86.TYPE_80286],
        [DebuggerX86.INS.LIDT, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_IN  | DebuggerX86.TYPE_80286],
        [DebuggerX86.INS.SMSW, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_OUT | DebuggerX86.TYPE_80286],
         DebuggerX86.aOpDescUndefined,
        [DebuggerX86.INS.LMSW, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_SHORT| DebuggerX86.TYPE_IN  | DebuggerX86.TYPE_80286],
         DebuggerX86.aOpDescUndefined
      ],
      [
        /* GRP8 */
         DebuggerX86.aOpDescUndefined,
         DebuggerX86.aOpDescUndefined,
         DebuggerX86.aOpDescUndefined,
         DebuggerX86.aOpDescUndefined,
        [DebuggerX86.INS.BT,  DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_IN  | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.BTS, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.BTR, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN],
        [DebuggerX86.INS.BTC, DebuggerX86.TYPE_MODRM | DebuggerX86.TYPE_WORD  | DebuggerX86.TYPE_OUT | DebuggerX86.TYPE_80386, DebuggerX86.TYPE_IMM | DebuggerX86.TYPE_BYTE | DebuggerX86.TYPE_IN]
      ]
    ];

    /*
     * Table of system (non-segment) descriptors, including indicators of which ones are gates.
     */
    DebuggerX86.SYSDESCS = {
        0x0100: ["tss286",       false],
        0x0200: ["ldt",          false],
        0x0300: ["busy tss286",  false],
        0x0400: ["call gate",    true],
        0x0500: ["task gate",    true],
        0x0600: ["int gate286",  true],
        0x0700: ["trap gate286", true],
        0x0900: ["tss386",       false],
        0x0B00: ["busy tss386",  false],
        0x0C00: ["call gate386", true],
        0x0E00: ["int gate386",  true],
        0x0F00: ["trap gate386", true]
    };

    /*
     * TSS field names and offsets used by dumpTSS()
     */
    DebuggerX86.TSS286 = {
        "PREV_TSS":     0x00,
        "CPL0_SP":      0x02,
        "CPL0_SS":      0x04,
        "CPL1_SP":      0x06,
        "CPL1_SS":      0x08,
        "CPL2_SP":      0x0a,
        "CPL2_SS":      0x0c,
        "TASK_IP":      0x0e,
        "TASK_PS":      0x10,
        "TASK_AX":      0x12,
        "TASK_CX":      0x14,
        "TASK_DX":      0x16,
        "TASK_BX":      0x18,
        "TASK_SP":      0x1a,
        "TASK_BP":      0x1c,
        "TASK_SI":      0x1e,
        "TASK_DI":      0x20,
        "TASK_ES":      0x22,
        "TASK_CS":      0x24,
        "TASK_SS":      0x26,
        "TASK_DS":      0x28,
        "TASK_LDT":     0x2a
    };
    DebuggerX86.TSS386 = {
        "PREV_TSS":     0x00,
        "CPL0_ESP":     0x04,
        "CPL0_SS":      0x08,
        "CPL1_ESP":     0x0c,
        "CPL1_SS":      0x10,
        "CPL2_ESP":     0x14,
        "CPL2_SS":      0x18,
        "TASK_CR3":     0x1C,
        "TASK_EIP":     0x20,
        "TASK_PS":      0x24,
        "TASK_EAX":     0x28,
        "TASK_ECX":     0x2C,
        "TASK_EDX":     0x30,
        "TASK_EBX":     0x34,
        "TASK_ESP":     0x38,
        "TASK_EBP":     0x3C,
        "TASK_ESI":     0x40,
        "TASK_EDI":     0x44,
        "TASK_ES":      0x48,
        "TASK_CS":      0x4C,
        "TASK_SS":      0x50,
        "TASK_DS":      0x54,
        "TASK_FS":      0x58,
        "TASK_GS":      0x5C,
        "TASK_LDT":     0x60,
        "TASK_IOPM":    0x64
    };

    /*
     * Initialize every Debugger module on the page (as IF there's ever going to be more than one ;-))
     */
    Web.onInit(DebuggerX86.init);

}   // endif DEBUGGER

if (NODE) module.exports = DebuggerX86;
