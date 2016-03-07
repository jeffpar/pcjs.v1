/**
 * @fileoverview Implements PCjs control flow functions.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Mar-04
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
    var Messages    = require("./messages");
    var X86         = require("./x86");
}

/**
 * fnCALLF(off, sel)
 *
 * For protected-mode, this function must attempt to load the new code segment first, because if the new segment
 * requires a change in privilege level, the return address must be pushed on the NEW stack, not the current stack.
 *
 * Also, we rely on a new function, pushData(), instead of pushWord(), to accommodate the outgoing segment size,
 * which may differ from the incoming segment.  For example, when a 32-bit code segment performs a 16:32 call to a
 * 16-bit code segment, we must push 32-bit segment and offset values.
 *
 * TODO: Since setCSIP() already informs the segCS load() function when it's making a call, the load() function
 * could automatically push the old CS and IP values *before* segCS is updated -- which would be a better time to do
 * those pushes AND eliminate the need for pushData().  Unfortunately, load() is also used by loadIDT(), and loadIDT()
 * has different requirements (eg, pushing flags first), so it's not a trivial change.
 *
 * @this {X86CPU}
 * @param {number} off
 * @param {number} sel
 */
X86.fnCALLF = function(off, sel)
{
    /*
     * Since we always push the return address AFTER calling setCSIP(), and since either push could trigger a
     * fault (eg, segment fault, page fault, etc), we must not only snapshot regLSP into opLSP, but also the
     * current CS into opCS, so that fnFault() can always make CALLF restartable.  Ditto for opSS and the SS register.
     */
    this.opCS = this.getCS();
    this.opSS = this.getSS();
    this.opLSP = this.regLSP;
    var oldIP = this.getIP();
    var oldSize = (I386? this.sizeData : 2);
    if (this.setCSIP(off, sel, true) != null) {
        /*
         * When the OPERAND size is 32 bits, the 80386 will decrement the stack pointer by 4, write the selector
         * into the 2 lower bytes, and leave the 2 upper bytes untouched; at least, that's the case for all other
         * segment register writes, so we assume this case is no different.  Hence, the hard-coded size of 2.
         */
        this.pushData(this.opCS, oldSize, 2);
        this.pushData(oldIP, oldSize, oldSize);
    }
    this.opLSP = X86.ADDR_INVALID;
    this.opCS = this.opSS = -1;
};

/**
 * fnINT(nIDT, nError, nCycles)
 *
 * NOTE: We no longer use setCSIP(), because it always loads the new CS using segCS.load(), which only knows
 * how to load GDT and LDT descriptors, whereas interrupts must use setCS.loadIDT(), which deals exclusively
 * with IDT descriptors.
 *
 * @this {X86CPU}
 * @param {number} nIDT
 * @param {number|null} [nError]
 * @param {number} [nCycles] (in addition to the default of nOpCyclesInt)
 */
X86.fnINT = function(nIDT, nError, nCycles)
{
    /*
     * TODO: We assess the cycle cost up front, because otherwise, if loadIDT() fails, no cost may be assessed.
     */
    this.nStepCycles -= this.cycleCounts.nOpCyclesInt + (nCycles || 0);
    var oldPS = this.getPS();
    var oldCS = this.getCS();
    var oldIP = this.getIP();
    var addr = this.segCS.loadIDT(nIDT);
    if (addr !== X86.ADDR_INVALID) {
        /*
         * TODO: Determine if we should use pushData() instead of pushWord() for oldCS and nError, to deal with
         * the same 32-bit 80386 compatibility issue that fnCALLF(), opPUSHCS(), et al must deal with; namely, that
         * 32-bit segment register writes (and, reportedly, 32-bit error codes) don't modify the upper 16 bits.
         *
         * Also, note that fnCALLF() is using the OPERAND size in effect *before* CS is loaded, whereas here we're
         * using the OPERAND size in effect *after* CS is loaded.  Is that correct?  And does an explicit OPERAND
         * size override on an "INT" instruction have any effect on that behavior?  Is that even allowed?
         */
        this.pushWord(oldPS);
        this.pushWord(oldCS);
        this.pushWord(oldIP);
        if (nError != null) this.pushWord(nError);
        this.nFault = -1;
        this.setLIP(addr);
    }
};

/**
 * fnIRET()
 *
 * @this {X86CPU}
 */
X86.fnIRET = function()
{
    /*
     * Originally, we would snapshot regLSP into opLSP because newCS could trigger a segment fault,
     * but additionally, the stack segment could trigger either a segment fault or a page fault; indeed,
     * any operation that performs multiple stack modifications must take this precaution and snapshot regLSP.
     */
    this.opLSP = this.regLSP;

    this.nStepCycles -= this.cycleCounts.nOpCyclesIRet;

    if ((this.regCR0 & X86.CR0.MSW.PE) && (this.regPS & X86.PS.NT)) {
        var addrNew = this.segTSS.base;
        /*
         * Fortunately, X86.TSS286.PREV_TSS and X86.TSS386.PREV_TSS refer to the same TSS offset.
         * TODO: Update switchTS() to assess a cycle cost; currently, all we assess is what's shown above.
         */
        var sel = this.getShort(addrNew + X86.TSS286.PREV_TSS);
        this.segCS.switchTSS(sel, false);
    }
    else {
        var cpl = this.nCPL;
        var newIP = this.popWord();
        var newCS = this.popWord();
        var newPS = this.popWord();

        if (I386) {
            if (this.regPS & X86.PS.VM) {
                /*
                 * On the 80386, in V86-mode, RF is the only defined EFLAGS bit above bit 15 that may be changed by IRETD.
                 * This is less restrictive than POPFD, which cannot change ANY bits above bit 15; see opPOPF() for details.
                 */
                newPS = (newPS & (0xffff | X86.PS.RF)) | (this.regPS & ~(0xffff | X86.PS.RF));
            }
            else {
                if (newPS & X86.PS.VM) {
                    /*
                     * As noted in loadDesc8(), where the V86-mode frame we're about to pop was originally pushed,
                     * these frames ALWAYS contain 32-bit values, so make sure that sizeData reflects that.
                     */
                    this.assert(!!(this.regCR0 & X86.CR0.MSW.PE) && this.sizeData == 4);
                    /*
                     * We have to assume that a full V86-mode interrupt frame was on the protected-mode stack; namely:
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
                     * We've already popped EIP, CS, and EFLAGS into newIP, newCS and newPS, respectively, so we must now
                     * pop the rest, while we're still in protected-mode, before the switch to V86-mode alters the current
                     * operand size (among other things).
                     */
                    var newSP = this.popWord();
                    var newSS = this.popWord();
                    var newES = this.popWord();
                    var newDS = this.popWord();
                    var newFS = this.popWord();
                    var newGS = this.popWord();
                    this.setProtMode(true, true);       // flip the switch to V86-mode now
                    this.setSS(newSS);
                    this.setSP(newSP);
                    this.setES(newES);
                    this.setDS(newDS);
                    this.setFS(newFS);
                    this.setGS(newGS);
                }
            }
        }

        if (this.setCSIP(newIP, newCS, false) != null) {
            this.setPS(newPS, cpl);
            if (this.cIntReturn) this.checkIntReturn(this.regLIP);
        }
    }

    this.opLSP = X86.ADDR_INVALID;
};

/**
 * fnRETF(n)
 *
 * For protected-mode, this function must pop any arguments off the current stack AND whatever stack
 * we may have switched to; setCSIP() returns true if a stack switch occurred, false if not, and null
 * if an error occurred.
 *
 * @this {X86CPU}
 * @param {number} n
 */
X86.fnRETF = function(n)
{
    /*
     * Originally, we would snapshot regLSP into opLSP because newCS could trigger a segment fault,
     * but additionally, the stack segment could trigger either a segment fault or a page fault; indeed,
     * any operation that performs multiple stack modifications must take this precaution and snapshot regLSP.
     */
    this.opLSP = this.regLSP;

    var newIP = this.popWord();
    var newCS = this.popWord();

    if (n) this.setSP(this.getSP() + n);            // TODO: optimize

    if (this.setCSIP(newIP, newCS, false)) {        // returns true if a stack switch occurred
        /*
         * Fool me once, shame on... whatever.  If setCSIP() indicates a stack switch occurred,
         * make sure we're in protected mode, because automatic stack switches can't occur in real mode.
         */
        this.assert(!!(this.regCR0 & X86.CR0.MSW.PE));

        if (n) this.setSP(this.getSP() + n);        // TODO: optimize

        /*
         * As per Intel documentation: "If any of [the DS or ES] registers refer to segments whose DPL is
         * less than the new CPL (excluding conforming code segments), the segment register is loaded with
         * the null selector."
         *
         * TODO: I'm not clear on whether a conforming code segment must also be marked readable, so I'm playing
         * it safe and using CODE_CONFORMING instead of CODE_CONFORMING_READABLE.  Also, for the record, I've not
         * seen this situation occur yet (eg, in OS/2 1.0).
         */
        this.zeroSeg(this.segDS);
        this.zeroSeg(this.segES);
        if (I386 && this.model >= X86.MODEL_80386) {
            this.zeroSeg(this.segFS);
            this.zeroSeg(this.segGS);
        }
    }
    if (n == 2 && this.cIntReturn) this.checkIntReturn(this.regLIP);

    this.opLSP = X86.ADDR_INVALID;
};

/**
 * fnGRPFault(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnGRPFault = function(dst, src)
{
    /*
     * This should NEVER be called on 8086/8088 CPUs, and yet we preset some of the handlers in aOpGrpPOPw,
     * aOpGrp4b, and aOpGrp4w to call it.  initProcessor() DOES patch aOpGrp4b[0x07] and aOpGrp4w[0x07] to
     * fnGRPInvalid, but that's it.
     *
     * However, given the infrequency of this call, it's simpler to continue presetting all the handlers in
     * aOpGrpPOPw to their post-8086 default, and deal with the appropriate 8086 behavior here (which for now,
     * is to call fnGRPUndefined instead).
     */
    if (this.model < X86.MODEL_80186) {
        return X86.fnGRPUndefined.call(this, dst, src);
    }
    X86.fnFault.call(this, X86.EXCEPTION.GP_FAULT, 0);
    return dst;
};

/**
 * fnGRPInvalid(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnGRPInvalid = function(dst, src)
{
    X86.opInvalid.call(this);
    return dst;
};

/**
 * fnGRPUndefined(dst, src)
 *
 * @this {X86CPU}
 * @param {number} dst
 * @param {number} src
 * @return {number}
 */
X86.fnGRPUndefined = function(dst, src)
{
    X86.opUndefined.call(this);
    return dst;
};

/**
 * fnDivOverflow()
 *
 * @this {X86CPU}
 */
X86.fnDivOverflow = function()
{
    /*
     * Divide error exceptions are traps on the 8086 and faults on later processors.  I question the value of that
     * change, because it implies that someone might actually want to restart a failing divide.  The only reasonable
     * explanation I can see for the change is to enable the exception handler to accurately record the address of
     * the failing divide, which seems like a very minor benefit.  It doesn't change the fact that, on any processor,
     * the exception handler's only reasonable recourse is to unwind execution to a safe point (or terminate the app).
     *
     * TODO: Determine the proper cycle cost.
     */
    if (this.model == X86.MODEL_8086) {
        X86.fnTrap.call(this, X86.EXCEPTION.DE_EXC, 2);
    } else {
        X86.fnFault.call(this, X86.EXCEPTION.DE_EXC, null, 2);
    }
};

/**
 * fnInterrupt(nIDT, nCycles)
 *
 * Helper to dispatch external interrupts.  nCycles defaults to 11 for the 8086/8088
 * if no alternate value is specified.
 *
 * @this {X86CPU}
 * @param {number} nIDT
 * @param {number} [nCycles] (number of cycles in addition to the default of nOpCyclesInt)
 */
X86.fnInterrupt = function(nIDT, nCycles)
{
    this.nFault = nIDT;
    if (nCycles === undefined) nCycles = 11;
    X86.fnINT.call(this, nIDT, null, nCycles);
};

/**
 * fnTrap(nIDT, nCycles)
 *
 * Helper to dispatch traps (ie, exceptions that occur AFTER the instruction, with NO error code)
 *
 * @this {X86CPU}
 * @param {number} nIDT
 * @param {number} [nCycles] (number of cycles in addition to the default of nOpCyclesInt)
 */
X86.fnTrap = function(nIDT, nCycles)
{
    this.nFault = -1;
    X86.fnINT.call(this, nIDT, null, nCycles);
};

/**
 * fnFault(nFault, nError, nCycles, fHalt)
 *
 * Helper to dispatch faults (ie, exceptions that occur DURING an instruction and MAY generate an error code)
 *
 * @this {X86CPU}
 * @param {number} nFault
 * @param {number|null} [nError] (if omitted, no error code will be pushed)
 * @param {number} [nCycles] cycle count to pass through to fnINT(), if any
 * @param {boolean} [fHalt] (true to halt the CPU, false to not, undefined if "it depends")
 */
X86.fnFault = function(nFault, nError, nCycles, fHalt)
{
    var fDispatch = false;

    if (!this.aFlags.fComplete) {
        /*
         * Prior to each new burst of instructions, stepCPU() sets fComplete to true, and the only (normal) way
         * for fComplete to become false is through stopCPU(), which isn't ordinarily called, except by the Debugger.
         */
        this.setLIP(this.opLIP);
    }
    else if (this.model >= X86.MODEL_80186) {

        fDispatch = true;

        if (this.nFault < 0) {
            /*
             * Single-fault (error code is passed through, and the responsible instruction is restartable.
             */
            if (this.opCS != -1) {
                /*
                 * HACK: We must slam 3 into this.segCS.cpl to ensure that loading the original CS segment doesn't
                 * fail.  For example, if we faulted in the middle of a ring transition that loaded CS with a higher
                 * privilege (lower CPL) code segment, then our attempt here to reload the lower privilege (higher CPL)
                 * code segment could be viewed as a privilege violation (which it would be outside this context).
                 */
                this.segCS.cpl = 3;
                this.setCS(this.opCS);
                this.opCS = -1;
            }
            this.setLIP(this.opLIP);
            if (this.opSS != -1) {
                this.setSS(this.opSS);
                this.opSS = -1;
            }
            if (this.opLSP !== X86.ADDR_INVALID) {
                this.setSP((this.regESP & ~this.segSS.maskAddr) | (this.opLSP - this.segSS.base));
                this.opLSP = X86.ADDR_INVALID;
            }
        }
        else if (this.nFault != X86.EXCEPTION.DF_FAULT) {
            /*
             * Double-fault (error code is always zero, and the responsible instruction is not restartable)
             */
            nError = 0;
            nFault = X86.EXCEPTION.DF_FAULT;
        }
        else {
            /*
             * Triple-fault (usually referred to in Intel literature as a "shutdown", but at least on the 80286,
             * it's actually a "reset")
             */
            nError = 0;
            nFault = -1;
            this.resetRegs();
            fDispatch = fHalt = false;
        }
    }

    if (X86.fnCheckFault.call(this, nFault, nError, fHalt)) {
        /*
         * If this is a fault that would normally be dispatched BUT fnCheckFault() wants us to halt,
         * then we throw a bogus fault number (-1), simply to interrupt the current instruction in exactly
         * the same way that a dispatched fault would interrupt it.
         */
        if (fDispatch) throw -1;
    }

    if (fDispatch) {

        this.nFault = nFault;
        X86.fnINT.call(this, nFault, nError, nCycles);

        /*
         * REP'eated instructions that rewind regLIP to opLIP used to screw up this dispatch,
         * so now we slip the new regLIP into opLIP, effectively turning their action into a no-op.
         */
        this.opLIP = this.regLIP;

        /*
         * X86.OPFLAG.FAULT flag is used by selected opcodes to provide an early exit, restore register(s),
         * or whatever is needed to help ensure instruction restartability; there is currently no general
         * mechanism for snapping and restoring all registers for any instruction that might fault.
         *
         * X86.EXCEPTION.DB_EXC exceptions set their own special flag, X86.OPFLAG.DBEXC, to prevent redundant
         * DEBUG exceptions, so we don't need to set OPFLAG.FAULT in that case, because a DEBUG exception
         * doesn't actually prevent an instruction from executing (and therefore doesn't need to be restarted).
         */
        if (nFault == X86.EXCEPTION.DB_EXC) {
            this.opFlags |= X86.OPFLAG.DBEXC;
        } else {
            this.assert(nFault >= 0);
            this.opFlags |= X86.OPFLAG.FAULT;
        }

        /*
         * Since this fault is likely being issued in the context of an instruction that hasn't finished
         * executing, if we don't do anything to interrupt that execution (eg, throw a JavaScript exception),
         * then we would need to shut off all further reads/writes for the current instruction.
         *
         * That's easy for any EA-based memory accesses: simply set both the NOREAD and NOWRITE flags.
         * However, there are also direct, non-EA-based memory accesses to consider.  A perfect example is
         * opPUSHA(): if a GP fault occurs on any PUSH other than the last, a subsequent PUSH is likely to
         * cause another fault, which we will misinterpret as a double-fault -- unless the handler for
         * such an opcode checks this.opFlags for X86.OPFLAG.FAULT after each step of the operation.
         *
         *      this.opFlags |= (X86.OPFLAG.NOREAD | X86.OPFLAG.NOWRITE);
         *
         * Fortunately, we now throw an exception that terminates the current instruction, so the above hack
         * should no longer be necessary.
         */
        throw nFault;
    }
};

/**
 * fnPageFault(addr, fPresent, fWrite)
 *
 * Helper to dispatch page faults.
 *
 * @this {X86CPU}
 * @param {number} addr
 * @param {boolean} fPresent
 * @param {boolean} fWrite
 */
X86.fnPageFault = function(addr, fPresent, fWrite)
{
    this.regCR2 = addr;
    var nError = 0;
    if (fPresent) nError |= X86.PTE.PRESENT;
    if (fWrite) nError |= X86.PTE.READWRITE;
    if (this.nCPL == 3) nError |= X86.PTE.USER;
    X86.fnFault.call(this, X86.EXCEPTION.PF_FAULT, nError);
};

/**
 * fnCheckFault(nFault, nError, fHalt)
 *
 * Aside from giving the Debugger an opportunity to report every fault, this also gives us the ability to
 * halt exception processing in tracks: return true to prevent the fault handler from being dispatched.
 *
 * At the moment, the only Debugger control you have over fault interception is setting MESSAGE.FAULT, which
 * will display faults as they occur, and MESSAGE.HALT, which will halt after any Debugger message, including
 * MESSAGE.FAULT.  If you want execution to continue after halting, clear MESSAGE.FAULT and/or MESSAGE.HALT,
 * or single-step over the offending instruction, which will allow the fault to be dispatched.
 *
 * @this {X86CPU}
 * @param {number} nFault
 * @param {number|null} [nError] (if omitted, no error code will be reported)
 * @param {boolean} [fHalt] (true to halt the CPU, false to not, undefined if "it depends")
 * @return {boolean|undefined} true to block the fault (often desirable when fHalt is true), otherwise dispatch it
 */
X86.fnCheckFault = function(nFault, nError, fHalt)
{
    var bitsMessage = Messages.FAULT;

    var bOpcode = this.probeAddr(this.regLIP);

    /*
     * OS/2 1.0 uses an INT3 (0xCC) opcode in conjunction with an invalid IDT to trigger a triple-fault
     * reset and return to real-mode, and these resets happen quite frequently during boot; for example,
     * OS/2 startup messages are displayed using a series of INT 0x10 BIOS calls for each character, and
     * each series of BIOS calls requires a round-trip mode switch.
     *
     * Since we really only want to halt on "bad" faults, not "good" (ie, intentional) faults, we take
     * advantage of the fact that all 3 faults comprising the triple-fault point to an INT3 (0xCC) opcode,
     * and so whenever we see that opcode, we ignore the caller's fHalt flag, and suppress FAULT messages
     * unless CPU messages are also enabled.
     *
     * When a triple fault shows up, nFault is -1; it displays as 0xff only because we use toHexByte().
     */
    if (bOpcode == X86.OPCODE.INT3 && !this.addrIDTLimit) {
        fHalt = false;
    }

    /*
     * There are a number of V86-mode exceptions we don't need to know about.  For starters, Windows 3.00
     * (and other versions of enhanced-mode Windows) use an ARPL to switch out of V86-mode, so we can ignore
     * those UD_FAULTs.
     *
     * Ditto for software interrupts, which will generate a GP_FAULT when the interrupt number (eg, 0x6D)
     * exceeds the protected-mode IDT's limit (eg, a limit of 0x2FF corresponds to a maximum interrupt number
     * of 0x5F).  Windows doesn't really care if its IDT is too small, because it has to simulate all software
     * interrupts in V86-mode regardless (they generate a GP_FAULT if IOPL < 3, and even when IOPL == 3, only
     * the protected-mode IDT handler gets to run).
     */
    if ((this.regPS & X86.PS.VM)) {
        if (nFault == X86.EXCEPTION.UD_FAULT && bOpcode == X86.OPCODE.ARPL ||
            nFault == X86.EXCEPTION.GP_FAULT && bOpcode == X86.OPCODE.INTN) {
            fHalt = false;
        }
    }

    /*
     * If fHalt has been explicitly set to false, we also take that as a cue to disable fault messages
     * (which you can override by turning on CPU messages).
     */
    if (fHalt === false) {
        bitsMessage |= Messages.CPU;
    }

    /*
     * Similarly, the PC AT ROM BIOS deliberately generates a couple of GP faults as part of the POST
     * (Power-On Self Test); we don't want to ignore those, but we don't want to halt on them either.  We
     * detect those faults by virtue of the LIP being in the range 0x0F0000 to 0x0FFFFF.
     *
     * TODO: Be aware that this test can trigger false positives, such as when a V86-mode ARPL is hit; eg:
     *
     *      &FD82:22F7 6338            ARPL     [BX+SI],DI
     */
    if (this.regLIP >= 0x0F0000 && this.regLIP <= 0x0FFFFF) {
        fHalt = false;
    }

    /*
     * However, the foregoing notwithstanding, if MESSAGE.HALT is enabled along with all the other required
     * MESSAGE bits, then we want to halt regardless.
     */
    if (this.messageEnabled(bitsMessage | Messages.HALT)) {
        fHalt = true;
    }

    if (this.messageEnabled(bitsMessage) || fHalt) {

        var fRunning = this.aFlags.fRunning;
        var sMessage = "Fault " + str.toHexByte(nFault) + (nError != null? " (" + str.toHexWord(nError) + ")" : "") + " on opcode " + str.toHexByte(bOpcode);
        if (fHalt && fRunning) sMessage += " (blocked by PCjs Debugger)";

        if (DEBUGGER && this.dbg) {
            this.printMessage(sMessage, fHalt || bitsMessage, true);
            if (fHalt) {
                /*
                 * By setting fHalt to fRunning (which is true while running but false while single-stepping),
                 * this allows a fault to be dispatched when you single-step over a faulting instruction; you can
                 * then continue single-stepping into the fault handler, or start running again.
                 *
                 * Note that we had to capture fRunning before calling printMessage(), because if MESSAGE.HALT
                 * is set, printMessage() will have already halted the CPU.
                 */
                fHalt = fRunning;
                this.dbg.stopCPU();
            }
        } else {
            /*
             * If there's no Debugger, then messageEnabled() must have returned false, which means that fHalt must
             * be true.  Which means we should shut the machine down.
             */
            this.assert(fHalt);
            this.notice(sMessage);
            this.stopCPU();
        }
    }
    return fHalt;
};
