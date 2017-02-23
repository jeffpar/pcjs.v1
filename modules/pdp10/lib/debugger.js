/**
 * @fileoverview Implements the PDP-10 Debugger component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2017
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

if (NODE) {
    var Str = require("../../shared/lib/strlib");
    var Usr = require("../../shared/lib/usrlib");
    var Web = require("../../shared/lib/weblib");
    var Component = require("../../shared/lib/component");
    var Debugger = require("../../shared/lib/debugger");
    var Keys = require("../../shared/lib/keys");
    var State = require("../../shared/lib/state");
    var PDP10 = require("./defines");
    var BusPDP10 = require("./bus");
    var MemoryPDP10 = require("./memory");
    var MessagesPDP10 = require("./messages");
}

/**
 * DebuggerPDP10 Address Object
 *
 *      addr            address
 *      fPhysical       true if this is a physical address
 *      fTemporary      true if this is a temporary breakpoint address
 *      nBase           set if the address contained an explicit base (eg, 16, 10, 8, etc)
 *      sCmd            set for breakpoint addresses if there's an associated command string
 *      aCmds           preprocessed commands (from sCmd)
 *
 * @typedef {{
 *      addr:(number|null),
 *      fPhysical:(boolean),
 *      fTemporary:(boolean),
 *      nBase:(number|undefined),
 *      sCmd:(string|undefined),
 *      aCmds:(Array.<string>|undefined)
 * }}
 */
var DbgAddrPDP10;

class DebuggerPDP10 extends Debugger {
    /**
     * DebuggerPDP10(parmsDbg)
     *
     * The DebuggerPDP10 component supports the following optional (parmsDbg) properties:
     *
     *      commands: string containing zero or more commands, separated by ';'
     *
     *      messages: string containing zero or more message categories to enable;
     *      multiple categories must be separated by '|' or ';'.  Parsed by messageInit().
     *
     * The DebuggerPDP10 component is an optional component that implements a variety of user
     * commands for controlling the CPU, dumping and editing memory, etc.
     *
     * @param {Object} parmsDbg
     */
    constructor(parmsDbg)
    {
        if (DEBUGGER) {

            super(parmsDbg);

            /*
             * Since this Debugger doesn't use replaceRegs(), we can use parentheses instead of braces.
             */
            this.fInit = false;
            this.fParens = true;

            /*
             * Most commands that require an address call parseAddr(), which defaults to dbgAddrNextCode
             * or dbgAddrNextData when no address has been given.  doDump() and doUnassemble(), in turn,
             * update dbgAddrNextData and dbgAddrNextCode, respectively, when they're done.
             *
             * For TEMPORARY breakpoint addresses, we set fTemporary to true, so that they can be automatically
             * cleared when they're hit.
             */
            this.dbgAddrNextCode = this.newAddr();
            this.dbgAddrNextData = this.newAddr();
            this.dbgAddrAssemble = this.newAddr();

            /*
             * aSymbolTable is an array of SymbolTable objects, one per ROM or other chunk of address space,
             * where each object contains the following properties:
             *
             *      sModule
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
            this.nBreakInstructions = 0;

            /*
             * Execution history is allocated by historyInit() whenever checksEnabled() conditions change.
             * Execution history is updated whenever the CPU calls checkInstruction(), which will happen
             * only when checksEnabled() returns true (eg, whenever one or more breakpoints have been set).
             * This ensures that, by default, the CPU runs as fast as possible.
             */
            this.iInstructionHistory = 0;
            this.aInstructionHistory = [];
            this.nextHistory = undefined;
            this.historyInit();

            /*
             * Initialize DebuggerPDP10 message support.
             */
            this.dbg = this;
            this.afnDumpers = {};
            this.bitsMessage = this.bitsWarning = 0;
            this.sMessagePrev = null;
            this.aMessageBuffer = [];
            this.messageInit(parmsDbg['messages']);
            this.sInitCommands = parmsDbg['commands'];

            /*
             * Define remaining miscellaneous DebuggerPDP10 properties.
             */
            this.opTable = DebuggerPDP10.OPTABLE;
            this.aOpReserved = [];
            this.nStep = 0;
            this.sCmdTracePrev = null;
            this.sCmdDumpPrev = null;
            this.fIgnoreNextCheckFault = false;     // TODO: Does this serve any purpose on a PDP-11?
            this.nSuppressBreaks = 0;
            this.cInstructions = this.cInstructionsStart = 0;
            this.nCycles = this.nCyclesStart = this.msStart = 0;
            this.controlDebug = null;
            this.panel = null;

            /*
             * Make it easier to access DebuggerPDP10 commands from an external REPL (eg, the WebStorm
             * "live" console window); eg:
             *
             *      pdp10('r')
             *      pdp10('dw 0:0')
             *      pdp10('h')
             *      ...
             */
            var dbg = this;
            if (window) {
                if (window[PDP10.APPCLASS] === undefined) {
                    window[PDP10.APPCLASS] = function(s) { return dbg.doCommands(s); };
                }
            } else {
                if (global[PDP10.APPCLASS] === undefined) {
                    global[PDP10.APPCLASS] = function(s) { return dbg.doCommands(s); };
                }
            }

        }   // endif DEBUGGER
    }

    /**
     * getAddr(dbgAddr, fWrite)
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10|null} [dbgAddr]
     * @param {boolean} [fWrite]
     * @return {number} is the corresponding linear address, or PDP10.ADDR_INVALID
     */
    getAddr(dbgAddr, fWrite)
    {
        var addr = dbgAddr && dbgAddr.addr;
        if (addr == null) addr = PDP10.ADDR_INVALID;
        return addr;
    }

    /**
     * newAddr(addr, fPhysical, nBase)
     *
     * Returns a NEW DbgAddrPDP10 object, initialized with specified values and/or defaults.
     *
     * @this {DebuggerPDP10}
     * @param {number|null} [addr]
     * @param {boolean} [fPhysical]
     * @param {number} [nBase]
     * @return {DbgAddrPDP10}
     */
    newAddr(addr = null, fPhysical = false, nBase)
    {
        return {addr: addr, fPhysical: fPhysical, fTemporary: false, nBase: nBase};
    }

    /**
     * setAddr(dbgAddr, addr)
     *
     * Updates an EXISTING DbgAddrPDP10 object, initialized with specified values and/or defaults.
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr
     * @param {number} addr
     * @return {DbgAddrPDP10}
     */
    setAddr(dbgAddr, addr)
    {
        dbgAddr.addr = addr;
        dbgAddr.fTemporary = false;
        dbgAddr.nBase = undefined;
        return dbgAddr;
    }

    /**
     * packAddr(dbgAddr)
     *
     * Packs a DbgAddrPDP10 object into an Array suitable for saving in a machine state object.
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr
     * @return {Array}
     */
    packAddr(dbgAddr)
    {
        return [dbgAddr.addr, dbgAddr.fPhysical, dbgAddr.nBase, dbgAddr.fTemporary, dbgAddr.sCmd];
    }

    /**
     * unpackAddr(aAddr)
     *
     * Unpacks a DbgAddrPDP10 object from an Array created by packAddr() and restored from a saved machine state.
     *
     * @this {DebuggerPDP10}
     * @param {Array} aAddr
     * @return {DbgAddrPDP10}
     */
    unpackAddr(aAddr)
    {
        var dbgAddr = this.newAddr(aAddr[0], aAddr[1], aAddr[2]);
        dbgAddr.fTemporary = aAddr[3];
        if (aAddr[4]) {
            dbgAddr.aCmds = this.parseCommand(dbgAddr.sCmd = aAddr[4]);
        }
        return dbgAddr;
    }

    /**
     * initBus(bus, cpu, dbg)
     *
     * @this {DebuggerPDP10}
     * @param {ComputerPDP10} cmp
     * @param {BusPDP10} bus
     * @param {CPUStatePDP10} cpu
     * @param {DebuggerPDP10} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.bus = bus;
        this.cmp = cmp;
        this.cpu = cpu;
        this.panel = cmp.panel;

        /*
         * Re-initialize Debugger message support if necessary
         */
        var sMessages = /** @type {string|undefined} */ (cmp.getMachineParm('messages'));
        if (sMessages) this.messageInit(sMessages);

        /*
         * Update aOpReserved as appropriate for the current model
         */

        this.messageDump(MessagesPDP10.BUS,  function onDumpBus(asArgs) { dbg.dumpBus(asArgs); });

        this.setReady();
    }

    /**
     * setBinding(sType, sBinding, control, sValue)
     *
     * @this {DebuggerPDP10}
     * @param {string|null} sType is the type of the HTML control (eg, "button", "textarea", "register", "flag", "rled", etc)
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "debugInput")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sType, sBinding, control, sValue)
    {
        var dbg = this;
        switch (sBinding) {

        case "debugInput":
            this.bindings[sBinding] = control;
            this.controlDebug = control;
            /*
             * For halted machines, this is fine, but for auto-start machines, it can be annoying.
             *
             *      control.focus();
             */
            control.onkeydown = function onKeyDownDebugInput(event) {
                var sCmd;
                if (event.keyCode == Keys.KEYCODE.CR) {
                    sCmd = control.value;
                    control.value = "";
                    dbg.doCommands(sCmd, true);
                }
                else if (event.keyCode == Keys.KEYCODE.ESC) {
                    control.value = sCmd = "";
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
                        control.value = sCmd;
                        control.setSelectionRange(cch, cch);
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
                        var sCmd = dbg.controlDebug.value;
                        dbg.controlDebug.value = "";
                        dbg.doCommands(sCmd, true);
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
                        fCompleted = dbg.stepCPU(fRepeat? 1 : 0, null);
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
     * setFocus(fScroll)
     *
     * @this {DebuggerPDP10}
     * @param {boolean} [fScroll] (true if you really want the control scrolled into view)
     */
    setFocus(fScroll)
    {
        if (this.controlDebug) {
            /*
             * This is the recommended work-around to prevent the browser from scrolling the focused element
             * into view.  The CPU is not a visual component, so when the CPU wants to set focus, the primary intent
             * is to ensure that keyboard input is fielded properly.
             */
            var x = 0, y = 0;
            if (!fScroll && window) {
                x = window.scrollX;
                y = window.scrollY;
            }

            this.controlDebug.focus();

            if (!fScroll && window) {
                window.scrollTo(x, y);
            }
        }
    }

    /**
     * getWord(dbgAddr, inc)
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr
     * @param {number} [inc]
     * @return {number}
     */
    getWord(dbgAddr, inc)
    {
        var w = PDP10.DATA_INVALID;
        var addr = this.getAddr(dbgAddr, false);
        if (addr !== PDP10.ADDR_INVALID) {
            w = this.bus.getWordDirect(addr);
            if (inc) this.incAddr(dbgAddr, inc);
        }
        return w;
    }

    /**
     * setWord(dbgAddr, w, inc)
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr
     * @param {number} w
     * @param {number} [inc]
     */
    setWord(dbgAddr, w, inc)
    {
        var addr = this.getAddr(dbgAddr, true);
        if (addr !== PDP10.ADDR_INVALID) {
            this.bus.setWordDirect(addr, w);
            if (inc) this.incAddr(dbgAddr, inc);
            this.cmp.updateDisplays(-1);
        }
    }

    /**
     * parseAddr(sAddr, fCode, fNoChecks, fPrint)
     *
     * Address evaluation and validation (eg, range checks) are no longer performed at this stage.  That's
     * done later, by getAddr(), which returns PDP10.ADDR_INVALID for invalid segments, out-of-range offsets,
     * etc.  The Debugger's low-level get/set memory functions verify all getAddr() results, but even if an
     * invalid address is passed through to the Bus memory interfaces, the address will simply be masked with
     * bus.nBusMask; in the case of PDP10.ADDR_INVALID, that will generally refer to the top of the physical
     * address space.
     *
     * @this {DebuggerPDP10}
     * @param {string|undefined} sAddr
     * @param {boolean} [fCode] (true if target is code, false if target is data)
     * @param {boolean} [fNoChecks] (true when setting breakpoints that may not be valid now, but will be later)
     * @param {boolean} [fPrint]
     * @return {DbgAddrPDP10|null|undefined}
     */
    parseAddr(sAddr, fCode, fNoChecks, fPrint)
    {
        var dbgAddr;
        var dbgAddrNext = (fCode? this.dbgAddrNextCode : this.dbgAddrNextData);
        var addr = dbgAddrNext.addr;
        var fPhysical, nBase;
        if (sAddr !== undefined) {
            sAddr = this.parseReference(sAddr);
            var ch = sAddr.charAt(0);
            if (ch == '%') {
                fPhysical = true;
                sAddr = sAddr.substr(1);
            }
            dbgAddr = this.findSymbolAddr(sAddr);
            if (dbgAddr) return dbgAddr;
            if (sAddr.indexOf("0x") >= 0) {
                nBase = 16
            } else if (sAddr.indexOf("0o") >= 0) {
                nBase = 8;
            } else if (sAddr.indexOf('.') >= 0) {
                nBase = 10;
            }
            addr = this.parseExpression(sAddr, fPrint);
        }
        if (addr != null) {
            dbgAddr = this.newAddr(addr, fPhysical, nBase);
        }
        return dbgAddr;
    }

    /**
     * parseAddrOptions(dbdAddr, sOptions)
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr
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
     * incAddr(dbgAddr, inc)
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr
     * @param {number} [inc] contains value to increment dbgAddr by (default is 1)
     */
    incAddr(dbgAddr, inc)
    {
        if (dbgAddr.addr != null) {
            dbgAddr.addr += (inc || 1);
        }
    }

    /**
     * toStrOffset(off)
     *
     * @this {DebuggerPDP10}
     * @param {number|null|undefined} [off]
     * @return {string} the hex representation of off
     */
    toStrOffset(off)
    {
        return this.toStrBase(off);
    }

    /**
     * toStrAddr(dbgAddr)
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr
     * @return {string} the hex representation of the address
     */
    toStrAddr(dbgAddr)
    {
        return this.toStrOffset(dbgAddr.addr);
    }

    /**
     * dumpBlocks(aBlocks, sAddr)
     *
     * @this {DebuggerPDP10}
     * @param {Array} aBlocks
     * @param {string} [sAddr] (optional block address)
     */
    dumpBlocks(aBlocks, sAddr)
    {
        var addr = 0, i = 0, n = aBlocks.length;

        if (sAddr) {
            addr = this.getAddr(this.parseAddr(sAddr));
            if (addr === PDP10.ADDR_INVALID) {
                this.println("invalid address: " + sAddr);
                return;
            }
            i = addr >>> this.bus.nBlockShift;
            n = 1;
        }

        this.println("blockid   physical   blockaddr  used    size    type");
        this.println("--------  ---------  ---------  ------  ------  ----");

        var typePrev = -1, cPrev = 0;
        while (n--) {
            var block = aBlocks[i];
            if (block.type == typePrev) {
                if (!cPrev++) this.println("...");
            } else {
                typePrev = block.type;
                var sType = MemoryPDP10.TYPE_NAMES[typePrev];
                if (block) {
                    this.println(Str.toHex(block.id, 8) + "  %" + Str.toHex(i << this.bus.nBlockShift, 8) + "  %" + Str.toHex(block.addr, 8) + "  " + Str.toHexWord(block.used) + "  " + Str.toHexWord(block.size) + "  " + sType);
                }
                if (typePrev != MemoryPDP10.TYPE.NONE) typePrev = -1;
                cPrev = 0;
            }
            addr += this.bus.nBlockSize;
            i++;
        }
    }

    /**
     * dumpBus(asArgs)
     *
     * Dumps Bus allocations.
     *
     * @this {DebuggerPDP10}
     * @param {Array.<string>} asArgs (asArgs[0] is an optional block address)
     */
    dumpBus(asArgs)
    {
        this.dumpBlocks(this.bus.aBusBlocks, asArgs[0]);
    }

    /**
     * dumpHistory(sPrev, sLines)
     *
     * If sLines is not a number, it can be a instruction filter.  However, for the moment, the only
     * supported filter is "call", which filters the history buffer for all CALL and RET instructions
     * from the specified previous point forward.
     *
     * @this {DebuggerPDP10}
     * @param {string} [sPrev] is a (decimal) number of instructions to rewind to (default is 10)
     * @param {string} [sLines] is a (decimal) number of instructions to print (default is, again, 10)
     */
    dumpHistory(sPrev, sLines)
    {
        var sMore = "";
        var cHistory = 0;
        var iHistory = this.iInstructionHistory;
        var aHistory = this.aInstructionHistory;

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
                if (aHistory[aHistory.length - 1].addr == null) {
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
            while (nLines > 0 && iHistory != this.iInstructionHistory) {

                var dbgAddr = aHistory[iHistory++];
                if (dbgAddr.addr == null) break;

                /*
                 * We must create a new dbgAddr from the address in aHistory, because dbgAddr was
                 * a reference, not a copy, and we don't want getInstruction() modifying the original.
                 */
                var dbgAddrNew = this.newAddr(dbgAddr.addr);

                var sComment = "history";
                var nSequence = nPrev--;

                /*
                 * TODO: Need to some UI to control whether cycle counts are displayed as part of the history.
                 * It's currently disabled in checkInstruction(), so it's disable here, too.
                 *
                if (DEBUG && dbgAddr.cycleCount != null) {
                    sComment = "cycles";
                    nSequence = dbgAddr.cycleCount;
                }
                 */

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
     * messageInit(sEnable)
     *
     * @this {DebuggerPDP10}
     * @param {string|undefined} sEnable contains zero or more message categories to enable, separated by '|'
     */
    messageInit(sEnable)
    {
        this.dbg = this;
        this.bitsMessage = this.bitsWarning = MessagesPDP10.FAULT | MessagesPDP10.WARN;
        this.sMessagePrev = null;
        this.aMessageBuffer = [];
        /*
         * Internally, we use "key" instead of "keys", since the latter is a method on JavasScript objects,
         * but externally, we allow the user to specify "keys"; "kbd" is also allowed as shorthand for "keyboard".
         */
        var aEnable = this.parseCommand(sEnable.replace("keys","key").replace("kbd","keyboard"), false, '|');
        if (aEnable.length) {
            for (var m in MessagesPDP10.CATEGORIES) {
                if (Usr.indexOf(aEnable, m) >= 0) {
                    this.bitsMessage |= MessagesPDP10.CATEGORIES[m];
                    this.println(m + " messages enabled");
                }
            }
        }
    }

    /**
     * messageDump(bitMessage, fnDumper)
     *
     * @this {DebuggerPDP10}
     * @param {number} bitMessage is one Messages category flag
     * @param {function(Array.<string>)} fnDumper is a function the Debugger can use to dump data for that category
     * @return {boolean} true if successfully registered, false if not
     */
    messageDump(bitMessage, fnDumper)
    {
        for (var m in MessagesPDP10.CATEGORIES) {
            if (bitMessage == MessagesPDP10.CATEGORIES[m]) {
                this.afnDumpers[m] = fnDumper;
                return true;
            }
        }
        return false;
    }

    /**
     * getRegIndex(sReg, off)
     *
     * @this {DebuggerPDP10}
     * @param {string} sReg
     * @param {number} [off] optional offset into sReg
     * @return {number} register index, or -1 if not found
     */
    getRegIndex(sReg, off)
    {
        return DebuggerPDP10.REGNAMES.indexOf(sReg.toUpperCase());
    }

    /**
     * getRegName(iReg)
     *
     * @this {DebuggerPDP10}
     * @param {number} iReg (0-7; not used for other registers)
     * @return {string|undefined}
     */
    getRegName(iReg)
    {
        return DebuggerPDP10.REGNAMES[iReg];
    }

    /**
     * getRegValue(iReg)
     *
     * @this {DebuggerPDP10}
     * @param {number} iReg
     * @return {number|undefined}
     */
    getRegValue(iReg)
    {
        var value;
        switch(iReg) {
        case DebuggerPDP10.REGS.PC:
            value = this.cpu.getPC();
            break;
        }
        return value;
    }

    /**
     * replaceRegs(s)
     *
     * TODO: Implement or eliminate.
     *
     * @this {DebuggerPDP10}
     * @param {string} s
     * @return {string}
     */
    replaceRegs(s)
    {
        return s;
    }

    /**
     * message(sMessage, fAddress)
     *
     * @this {DebuggerPDP10}
     * @param {string} sMessage is any caller-defined message string
     * @param {boolean} [fAddress] is true to display the current address
     */
    message(sMessage, fAddress)
    {
        if (fAddress) {
            sMessage += " @" + this.toStrAddr(this.newAddr(this.cpu.getLastPC()));
        }

        if (this.sMessagePrev && sMessage == this.sMessagePrev) return;
        this.sMessagePrev = sMessage;

        if (this.bitsMessage & MessagesPDP10.BUFFER) {
            this.aMessageBuffer.push(sMessage);
            return;
        }

        var fRunning;
        if ((this.bitsMessage & MessagesPDP10.HALT) && this.cpu && (fRunning = this.cpu.isRunning()) || this.isBusy(true)) {
            this.stopCPU();
            if (fRunning) sMessage += " (cpu halted)";
        }

        this.println(sMessage); // + " (" + this.cpu.getCycles() + " cycles)"

        /*
         * We have no idea what the frequency of println() calls might be; all we know is that they easily
         * screw up the CPU's careful assumptions about cycles per burst.  So we call yieldCPU() after every
         * message, to effectively end the current burst and start fresh.
         *
         * TODO: See CPUPDP10.calcStartTime() for a discussion of why we might want to call yieldCPU() *before*
         * we display the message.
         */
        if (this.cpu) this.cpu.yieldCPU();
    }

    /**
     * init()
     *
     * @this {DebuggerPDP10}
     * @param {boolean} [fAutoStart]
     */
    init(fAutoStart)
    {
        this.fInit = true;
        this.println("Type ? for help with PDPjs Debugger commands");
        this.updateStatus();
        if (!fAutoStart) this.setFocus();
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
     * @this {DebuggerPDP10}
     * @param {boolean} [fQuiet]
     */
    historyInit(fQuiet)
    {
        var i;
        if (!this.checksEnabled()) {
            if (this.aInstructionHistory && this.aInstructionHistory.length && !fQuiet) {
                this.println("instruction history buffer freed");
            }
            this.iInstructionHistory = 0;
            this.aInstructionHistory = [];
            return;
        }
        if (!this.aInstructionHistory || !this.aInstructionHistory.length) {
            this.aInstructionHistory = new Array(DebuggerPDP10.HISTORY_LIMIT);
            for (i = 0; i < this.aInstructionHistory.length; i++) {
                /*
                 * Preallocate dummy Addr (Array) objects in every history slot, so that
                 * checkInstruction() doesn't need to call newAddr() on every slot update.
                 */
                this.aInstructionHistory[i] = this.newAddr();
            }
            this.iInstructionHistory = 0;
            if (!fQuiet) {
                this.println("instruction history buffer allocated");
            }
        }
    }

    /**
     * startCPU(fUpdateFocus, fQuiet)
     *
     * @this {DebuggerPDP10}
     * @param {boolean} [fUpdateFocus] is true to update focus
     * @param {boolean} [fQuiet]
     * @return {boolean} true if run request successful, false if not
     */
    startCPU(fUpdateFocus, fQuiet)
    {
        if (!this.checkCPU(fQuiet)) return false;
        this.cpu.startCPU(fUpdateFocus);
        return true;
    }

    /**
     * stepCPU(nCycles, fRegs, fUpdateDisplays)
     *
     * @this {DebuggerPDP10}
     * @param {number} nCycles (0 for one instruction without checking breakpoints)
     * @param {boolean|null} [fRegs] is true to display registers after step (default is false; use null for previous setting)
     * @param {boolean} [fUpdateDisplays] is false to disable Computer display updates (default is true)
     * @return {boolean}
     */
    stepCPU(nCycles, fRegs, fUpdateDisplays)
    {
        if (!this.checkCPU()) return false;

        var sCmd = "";
        if (fRegs === null) {
            fRegs = (!this.sCmdTracePrev || this.sCmdTracePrev == "tr");
            sCmd = fRegs? "tr" : "t";
        }

        this.nCycles = 0;

        if (!nCycles) {
            /*
             * When single-stepping, the CPU won't call checkInstruction(), which is good for
             * avoiding breakpoints, but bad for instruction data collection if checks are enabled.
             * So we call checkInstruction() ourselves.
             */
            if (this.checksEnabled()) this.checkInstruction(this.cpu.getPC(), 0);
        }
        /*
         * For our typically tiny bursts (usually single instructions), mimic what runCPU() does.
         */
        try {
            nCycles = this.cpu.getBurstCycles(nCycles);
            var nCyclesStep = this.cpu.stepCPU(nCycles);
            if (nCyclesStep > 0) {
                this.cpu.updateTimers(nCyclesStep);
                this.nCycles += nCyclesStep;
                this.cpu.addCycles(nCyclesStep, true);
                this.cpu.updateChecksum(nCyclesStep);
                this.cInstructions++;
            }
        }
        catch(exception) {
            /*
             * We assume that any numeric exception was explicitly thrown by the CPU to interrupt the
             * current instruction.  For all other exceptions, we attempt a stack dump.
             */
            if (typeof exception != "number") {
                var e = exception;
                this.nCycles = 0;
                this.cpu.setError(e.stack || e.message);
            }
        }

        /*
         * Because we called cpu.stepCPU() and not cpu.startCPU(), we must nudge the Computer's update code,
         * and then update our own state.  Normally, the only time fUpdateDisplays will be false is when doTrace()
         * is calling us in a loop, in which case it will perform its own updateDisplays() when it's done.
         */
        if (fUpdateDisplays !== false) {
            if (this.panel) this.panel.stop();
            this.cmp.updateDisplays(-1);
        }

        this.updateStatus(fRegs || false, sCmd);
        return (this.nCycles > 0);
    }

    /**
     * stopCPU()
     *
     * @this {DebuggerPDP10}
     * @param {boolean} [fComplete]
     */
    stopCPU(fComplete)
    {
        if (this.cpu) this.cpu.stopCPU(fComplete);
    }

    /**
     * updateStatus(fRegs, sCmd)
     *
     * @this {DebuggerPDP10}
     * @param {boolean} [fRegs] (default is true)
     * @param {string} [sCmd]
     */
    updateStatus(fRegs, sCmd)
    {
        if (!this.fInit) return;

        if (fRegs === undefined) fRegs = true;

        if (sCmd) {
            this.println(DebuggerPDP10.PROMPT + sCmd);
        }

        this.dbgAddrNextCode = this.newAddr(this.cpu.getPC());

        /*
         * this.nStep used to be a simple boolean, but now it's 0 (or undefined)
         * if inactive, 1 if stepping over an instruction without a register dump, or 2
         * if stepping over an instruction with a register dump.
         */
        if (!fRegs || this.nStep == 1) {
            this.doUnassemble();
        } else {
            this.doRegisters();
        }
    }

    /**
     * checkCPU(fQuiet)
     *
     * Make sure the CPU is ready (finished initializing), powered, not already running, and not in an error state.
     *
     * @this {DebuggerPDP10}
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
     * @this {DebuggerPDP10}
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

            if (data) {
                return this.restore(data);
            }
        }
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {DebuggerPDP10}
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
     * @this {DebuggerPDP10}
     * @param {boolean} fQuiet (true only when called from our own powerUp handler)
     */
    reset(fQuiet)
    {
        this.historyInit();
        this.cInstructions = this.cInstructionsStart = 0;
        this.sMessagePrev = null;
        this.nCycles = 0;
        this.dbgAddrNextCode = this.newAddr(this.cpu.getPC());
        /*
         * fRunning is set by start() and cleared by stop().  In addition, we clear
         * it here, so that if the CPU is reset while running, we can prevent stop()
         * from unnecessarily dumping the CPU state.
         */
        this.flags.running = false;
        this.clearTempBreakpoint();
        if (!fQuiet) this.updateStatus();
    }

    /**
     * save()
     *
     * This implements (very rudimentary) save support for the Debugger component.
     *
     * @this {DebuggerPDP10}
     * @return {Object}
     */
    save()
    {
        var state = new State(this);
        state.set(0, this.packAddr(this.dbgAddrNextCode));
        state.set(1, this.packAddr(this.dbgAddrAssemble));
        state.set(2, [this.aPrevCmds, this.fAssemble, this.bitsMessage]);
        state.set(3, this.aSymbolTable);
        return state.data();
    }

    /**
     * restore(data)
     *
     * This implements (very rudimentary) restore support for the Debugger component.
     *
     * @this {DebuggerPDP10}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    restore(data)
    {
        var i = 0;
        if (data[2] !== undefined) {
            this.dbgAddrNextCode = this.unpackAddr(data[i++]);
            this.dbgAddrAssemble = this.unpackAddr(data[i++]);
            this.aPrevCmds = data[i][0];
            if (typeof this.aPrevCmds == "string") this.aPrevCmds = [this.aPrevCmds];
            this.fAssemble = data[i][1];
            this.bitsMessage |= data[i][2];     // keep our current message bits set, and simply "add" any extra bits defined by the saved state
        }
        if (data[3]) this.aSymbolTable = data[3];
        return true;
    }

    /**
     * start(ms, nCycles)
     *
     * This is a notification handler, called by the Computer, to inform us the CPU has started.
     *
     * @this {DebuggerPDP10}
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
     * @this {DebuggerPDP10}
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
                        sStopped += this.cInstructions + " instructions, ";
                        /*
                         * $ops displays progress by calculating cInstructions - cInstructionsStart, so before
                         * zeroing cInstructions, we should subtract cInstructions from cInstructionsStart (since
                         * we're effectively subtracting cInstructions from cInstructions as well).
                         */
                        this.cInstructionsStart -= this.cInstructions;
                        this.cInstructions = 0;
                    }
                    sStopped += this.nCycles + " cycles, " + msTotal + " ms, " + nCyclesPerSecond + " hz)";
                } else {
                    if (this.messageEnabled(MessagesPDP10.HALT)) {
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
            this.setFocus();
            this.clearTempBreakpoint(this.cpu.getPC());
            this.sMessagePrev = null;
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
     * @this {DebuggerPDP10}
     * @param {boolean} [fRelease] is true for release criteria only; default is false (any criteria)
     * @return {boolean} true if every instruction needs to pass through checkInstruction(), false if not
     */
    checksEnabled(fRelease)
    {
        return ((DEBUG && !fRelease)? true : (this.aBreakExec.length > 1 || !!this.nBreakInstructions));
    }

    /**
     * checkInstruction(addr, nState)
     *
     * This "check" function is called by the CPU to inform us about the next instruction to be executed,
     * giving us an opportunity to look for "exec" breakpoints and update opcode instruction history.
     *
     * @this {DebuggerPDP10}
     * @param {number} addr
     * @param {number} nState is < 0 if stepping, 0 if starting, or > 0 if running
     * @return {boolean} true if breakpoint hit, false if not
     */
    checkInstruction(addr, nState)
    {
        var opCode = -1;
        var cpu = this.cpu;

        /*
         * If opHalt() calls our stopInstruction() function, it will effectively rewind the PC back to the HALT,
         * purely for our debugging benefit, so we must compensate for that here by advancing the PC past the HALT
         * when the machine starts up again.
         */
        if (!nState) {
            opCode = this.cpu.readWord(addr);
            if ((opCode & PDP10.OPCODE.HALTMASK) == PDP10.OPCODE.HALT && this.cpu.getLastPC() == addr) {
                addr = this.cpu.advancePC(1);
            }
        }

        /*
         * If the CPU stopped on a breakpoint, we're not interested in stopping again if the machine is starting.
         */
        if (nState > 0) {
            if (this.nBreakInstructions) {
                if (!--this.nBreakInstructions) return true;
            }
            if (this.checkBreakpoint(addr, 1, this.aBreakExec)) {
                return true;
            }
        }

        /*
         * The rest of the instruction tracking logic can only be performed if historyInit() has allocated the
         * necessary data structures.  Note that there is no explicit UI for enabling/disabling history, other than
         * adding/removing breakpoints, simply because it's breakpoints that trigger the call to checkInstruction();
         * well, OK, and a few other things now, like enabling MessagesPDP10.INT messages.
         */
        if (nState >= 0 && this.aInstructionHistory.length) {
            this.cInstructions++;
            if (opCode < 0) {
                opCode = this.cpu.readWord(addr);
            }
            if ((opCode & 0xffff) != PDP10.OPCODE.INVALID) {
                var dbgAddr = this.aInstructionHistory[this.iInstructionHistory];
                this.setAddr(dbgAddr, addr);
                // if (DEBUG) dbgAddr.cycleCount = cpu.getCycles();
                if (++this.iInstructionHistory == this.aInstructionHistory.length) this.iInstructionHistory = 0;
            }
        }
        return false;
    }

    /**
     * stopInstruction(sMessage)
     *
     * TODO: Currently, the only way to prevent this call from stopping the CPU is when you're single-stepping.
     *
     * @this {DebuggerPDP10}
     * @param {string} [sMessage]
     * @return {boolean} true if stopping is enabled, false if not
     */
    stopInstruction(sMessage)
    {
        var cpu = this.cpu;
        if (cpu.isRunning()) {
            cpu.setPC(this.cpu.getLastPC());
            if (sMessage) this.println(sMessage);
            this.stopCPU();
            /*
             * TODO: Review the appropriate-ness of throwing a bogus vector number in order to immediately stop
             * the instruction.  It's handy, but it also means that we no longer actually return true, so callers
             * of either stopInstruction() or undefinedInstruction() may have unreachable code paths.
             */
            throw -1;
        }
        return false;
    }

    /**
     * undefinedInstruction(opCode)
     *
     * @this {DebuggerPDP10}
     * @param {number} opCode
     * @return {boolean} true if stopping is enabled, false if not
     */
    undefinedInstruction(opCode)
    {
        if (this.messageEnabled(MessagesPDP10.CPU)) {
            this.printMessage("undefined opcode " + this.toStrBase(opCode), true, true);
            return this.stopInstruction();  // allow the caller to step over it if they really want a trap generated
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
     * @this {DebuggerPDP10}
     * @param {number} addr
     * @param {number} [nb] (# of bytes; default is 1)
     * @return {boolean} true if breakpoint hit, false if not
     */
    checkMemoryRead(addr, nb)
    {
        if (this.checkBreakpoint(addr, nb || 1, this.aBreakRead)) {
            this.stopCPU(false);
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
     * @this {DebuggerPDP10}
     * @param {number} addr
     * @param {number} [nb] (# of bytes; default is 1)
     * @return {boolean} true if breakpoint hit, false if not
     */
    checkMemoryWrite(addr, nb)
    {
        if (this.checkBreakpoint(addr, nb || 1, this.aBreakWrite)) {
            this.stopCPU(false);
            return true;
        }
        return false;
    }

    /**
     * clearBreakpoints()
     *
     * @this {DebuggerPDP10}
     */
    clearBreakpoints()
    {
        var i, dbgAddr, addr;
        this.aBreakExec = ["bp"];
        if (this.aBreakRead !== undefined) {
            for (i = 1; i < this.aBreakRead.length; i++) {
                dbgAddr = this.aBreakRead[i];
                addr = this.getAddr(dbgAddr);
                this.bus.removeMemBreak(addr, false);
            }
        }
        this.aBreakRead = ["br"];
        if (this.aBreakWrite !== undefined) {
            for (i = 1; i < this.aBreakWrite.length; i++) {
                dbgAddr = this.aBreakWrite[i];
                addr = this.getAddr(dbgAddr);
                this.bus.removeMemBreak(addr, true);
            }
        }
        this.aBreakWrite = ["bw"];
        /*
         * nSuppressBreaks ensures we can't get into an infinite loop where a breakpoint lookup
         * requires reading memory that triggers more memory reads, which triggers more breakpoint checks.
         */
        this.nSuppressBreaks = 0;
        this.nBreakInstructions = 0;
    }

    /**
     * addBreakpoint(aBreak, dbgAddr, fTemporary)
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
     * @this {DebuggerPDP10}
     * @param {Array} aBreak
     * @param {DbgAddrPDP10} dbgAddr
     * @param {boolean} [fTemporary]
     * @return {boolean} true if breakpoint added, false if already exists
     */
    addBreakpoint(aBreak, dbgAddr, fTemporary)
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
        if (!fTemporary) {
            this.findBreakpoint(aBreak, dbgAddr, true, false, true);
        }

        if (aBreak != this.aBreakExec) {
            var addr = this.getAddr(dbgAddr);
            if (addr === PDP10.ADDR_INVALID) {
                this.println("invalid address: " + this.toStrAddr(dbgAddr));
                fSuccess = false;
            } else {
                var fWrite = (aBreak == this.aBreakWrite);
                this.bus.addMemBreak(addr, fWrite);
            }
        }

        if (fSuccess) {
            aBreak.push(dbgAddr);
            if (fTemporary) {
                dbgAddr.fTemporary = true;
            }
            else {
                this.printBreakpoint(aBreak, aBreak.length-1, "set");
                this.historyInit();
            }
        }

        // this.nSuppressBreaks--;

        return fSuccess;
    }

    /**
     * findBreakpoint(aBreak, dbgAddr, fRemove, fTemporary, fQuiet)
     *
     * @this {DebuggerPDP10}
     * @param {Array} aBreak
     * @param {DbgAddrPDP10} dbgAddr
     * @param {boolean} [fRemove]
     * @param {boolean} [fTemporary]
     * @param {boolean} [fQuiet]
     * @return {boolean} true if found, false if not
     */
    findBreakpoint(aBreak, dbgAddr, fRemove, fTemporary, fQuiet)
    {
        var fFound = false;
        var addr = this.getAddr(dbgAddr);
        for (var i = 1; i < aBreak.length; i++) {
            var dbgAddrBreak = aBreak[i];
            if (addr == this.getAddr(dbgAddrBreak)) {
                if (!fTemporary || dbgAddrBreak.fTemporary) {
                    fFound = true;
                    if (fRemove) {
                        if (!dbgAddrBreak.fTemporary && !fQuiet) {
                            this.printBreakpoint(aBreak, i, "cleared");
                        }
                        aBreak.splice(i, 1);
                        if (aBreak != this.aBreakExec) {
                            var fWrite = (aBreak == this.aBreakWrite);
                            this.bus.removeMemBreak(addr, fWrite);
                        }
                        /*
                         * We'll mirror the logic in addBreakpoint() and leave the history buffer alone if this
                         * was a temporary breakpoint.
                         */
                        if (!dbgAddrBreak.fTemporary) {
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
     * @this {DebuggerPDP10}
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
     * @this {DebuggerPDP10}
     * @param {Array} aBreak
     * @param {number} i
     * @param {string} [sAction]
     */
    printBreakpoint(aBreak, i, sAction)
    {
        var dbgAddr = aBreak[i];
        this.println(aBreak[0] + ' ' + this.toStrAddr(dbgAddr) + (sAction? (' ' + sAction) : (dbgAddr.sCmd? (' "' + dbgAddr.sCmd + '"') : '')));
    }

    /**
     * setTempBreakpoint(dbgAddr)
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr of new temp breakpoint
     */
    setTempBreakpoint(dbgAddr)
    {
        this.addBreakpoint(this.aBreakExec, dbgAddr, true);
    }

    /**
     * clearTempBreakpoint(addr)
     *
     * @this {DebuggerPDP10}
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
                if (dbgAddrBreak.fTemporary) {
                    if (!this.findBreakpoint(this.aBreakExec, dbgAddrBreak, true, true)) break;
                    i = 0;
                }
            }
        }
    }

    /**
     * checkBreakpoint(addr, nb, aBreak, fTemporary)
     *
     * @this {DebuggerPDP10}
     * @param {number} addr
     * @param {number} nb (# of bytes)
     * @param {Array} aBreak
     * @param {boolean} [fTemporary]
     * @return {boolean} true if breakpoint has been hit, false if not
     */
    checkBreakpoint(addr, nb, aBreak, fTemporary)
    {
        /*
         * Time to check for breakpoints; note that this should be done BEFORE updating history data
         * (see checkInstruction), since we might not actually execute the current instruction.
         */
        var fBreak = false;

        if (!this.nSuppressBreaks++) {

            for (var i = 1; !fBreak && i < aBreak.length; i++) {

                var dbgAddrBreak = aBreak[i];

                if (fTemporary && !dbgAddrBreak.fTemporary) continue;

                /*
                 * If we're checking an execution address, which is always virtual, and virtual
                 * addresses are always restricted to 16 bits, let's mask the breakpoint address to match
                 * (the user should know better, but we'll be nice).
                 */
                var addrBreak = this.getAddr(dbgAddrBreak) & (aBreak == this.aBreakExec? 0xffff : -1);
                for (var n = 0; n < nb; n++) {

                    if ((addr + n) != addrBreak) continue;

                    var a;
                    fBreak = true;
                    if (dbgAddrBreak.fTemporary) {
                        this.findBreakpoint(aBreak, dbgAddrBreak, true, true);
                        fTemporary = true;
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
                        if (!fTemporary) this.printBreakpoint(aBreak, i, "hit");
                        break;
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
     * Get the next instruction, by decoding the opcode and any operands.
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr
     * @param {string} [sComment] is an associated comment
     * @param {number|null} [nSequence] is an associated sequence number, undefined if none
     * @return {string} (and dbgAddr is updated to the next instruction)
     */
    getInstruction(dbgAddr, sComment, nSequence)
    {
        var opNames = DebuggerPDP10.OPNAMES;
        var dbgAddrOp = this.newAddr(dbgAddr.addr);
        var opCode = this.getWord(dbgAddr, 2);

        var opDesc;
        for (var mask in this.opTable) {
            var opMasks = this.opTable[mask];
            opDesc = opMasks[opCode & mask];
            if (opDesc) break;
        }

        if (!opDesc) {
            opDesc = DebuggerPDP10.OPNONE;
        }

        var opNum = opDesc[0];
        if (this.aOpReserved.indexOf(opNum) >= 0) {
            opDesc = DebuggerPDP10.OPNONE;
            opNum = opDesc[0];
        }

        var sOperands = "", sTarget = "";
        var sOpName = opNames[opNum];
        var cOperands = opDesc.length - 1;

        if (!opNum && !cOperands) {
            sOperands = this.toStrBase(opCode);
        }

        for (var iOperand = 1; iOperand <= cOperands; iOperand++) {

            var opType = opDesc[iOperand];
            if (opType === undefined) continue;

            var sOperand = this.getOperand(opCode, opType, dbgAddr);

            if (!sOperand || !sOperand.length) {
                sOperands = "INVALID";
                break;
            }

            /*
             * If getOperand() returns an Array rather than a string, then the first element is the original
             * operand, and the second element contains additional information (eg, the target) of the operand.
             */
            if (typeof sOperand != "string") {
                sTarget = sOperand[1];
                sOperand = sOperand[0];
            }

            if (sOperands.length > 0) sOperands += ',';
            sOperands += (sOperand || "???");
        }

        var sOpCodes = "";
        var sLine = this.toStrAddr(dbgAddrOp) + ":";
        if (dbgAddrOp.addr !== PDP10.ADDR_INVALID && dbgAddr.addr !== PDP10.ADDR_INVALID) {
            do {
                sOpCodes += ' ' + this.toStrBase(this.getWord(dbgAddrOp, 2));
                if (dbgAddrOp.addr == null) break;
            } while (dbgAddrOp.addr != dbgAddr.addr);
        }

        sLine += Str.pad(sOpCodes, 24);
        sLine += Str.pad(sOpName, 5);
        if (sOperands) sLine += ' ' + sOperands;

        if (sComment || sTarget) {
            sLine = Str.pad(sLine, 60) + ';' + (sComment || "");
            if (!this.cpu.flags.checksum) {
                sLine += (nSequence != null? '=' + nSequence.toString() : "");
            } else {
                var nCycles = this.cpu.getCycles();
                sLine += "cycles=" + nCycles.toString() + " cs=" + Str.toHex(this.cpu.nChecksum);
            }
            if (sTarget) {
                if (sLine.slice(-1) != ';') sLine += ' ';
                sLine += sTarget;
            }
        }
        return sLine;
    }

    /**
     * getOperand(opCode, opType, dbgAddr)
     *
     * If getOperand() returns an Array rather than a string, then the first element is the original
     * operand, and the second element is a comment containing additional information (eg, the target)
     * of the operand.
     *
     * @this {DebuggerPDP10}
     * @param {number} opCode
     * @param {number} opType
     * @param {DbgAddrPDP10} dbgAddr
     * @return {string|Array.<string>}
     */
    getOperand(opCode, opType, dbgAddr)
    {
        return "";
    }

    /**
     * parseInstruction(sOp, sOperand, addr)
     *
     * TODO: Unimplemented.  See parseInstruction() in modules/c1pjs/lib/debugger.js for a sample implementation.
     *
     * @this {DebuggerPDP10}
     * @param {string} sOp
     * @param {string|undefined} sOperand
     * @param {DbgAddrPDP10} dbgAddr of memory where this instruction is being assembled
     * @return {Array.<number>} of opcode bytes; if the instruction can't be parsed, the array will be empty
     */
    parseInstruction(sOp, sOperand, dbgAddr)
    {
        var aOpBytes = [];
        this.println("not supported yet");
        return aOpBytes;
    }

    /**
     * getRegOutput(iReg)
     *
     * @this {DebuggerPDP10}
     * @param {number} iReg
     * @return {string}
     */
    getRegOutput(iReg)
    {
        var sReg = this.getRegName(iReg) || "undefined";
        if (sReg) sReg += ' ';
        return sReg;
    }

    /**
     * getMiscDump()
     *
     * @this {DebuggerPDP10}
     * @return {string}
     */
    getMiscDump()
    {
        return "";
    }

    /**
     * getRegDump(fMisc)
     *
     * @this {DebuggerPDP10}
     * @param {boolean} [fMisc] (true to include misc registers)
     * @return {string}
     */
    getRegDump(fMisc)
    {
        var i;
        var sDump = "";
        sDump += this.getRegOutput(DebuggerPDP10.REGS.PC);
        if (fMisc) sDump += '\n' + this.getMiscDump();
        return sDump;
    }

    /**
     * comparePairs(p1, p2)
     *
     * @this {DebuggerPDP10}
     * @param {number|string|Array|Object} p1
     * @param {number|string|Array|Object} p2
     * @return {number}
     */
    comparePairs(p1, p2)
    {
        return p1[0] > p2[0]? 1 : p1[0] < p2[0]? -1 : 0;
    }

    /**
     * addSymbols(sModule, addr, len, aSymbols)
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
     *      [addr, len, aSymbols, aOffsets]
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
     * @this {DebuggerPDP10}
     * @param {string|null} sModule
     * @param {number|null} addr (physical address where the symbols are located, if the memory is physical; eg, ROM)
     * @param {number} len (the size of the region, in bytes)
     * @param {Object} aSymbols (collection of symbols in this group; the format of this collection is described below)
     */
    addSymbols(sModule, addr, len, aSymbols)
    {
        var dbgAddr = {};
        var aOffsets = [];
        for (var sSymbol in aSymbols) {
            var symbol = aSymbols[sSymbol];
            if (typeof symbol == "number") {
                aSymbols[sSymbol] = symbol = {'o': symbol};
            }
            var offSymbol = symbol['o'];
            var sAnnotation = symbol['a'];
            if (offSymbol !== undefined) {
                Usr.binaryInsert(aOffsets, [offSymbol >>> 0, sSymbol], this.comparePairs);
            }
            if (sAnnotation) symbol['a'] = sAnnotation.replace(/''/g, "\"");
        }
        var symbolTable = {
            sModule: sModule,
            addr: addr,
            len: len,
            aSymbols: aSymbols,
            aOffsets: aOffsets
        };
        this.aSymbolTable.push(symbolTable);
    }

    /**
     * dumpSymbols()
     *
     * TODO: Add "numerical" and "alphabetical" dump options. This is simply dumping them in whatever
     * order they appeared in the original MAP file.
     *
     * @this {DebuggerPDP10}
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
                var sSymbolOrig = symbolTable.aSymbols[sSymbol]['l'];
                if (sSymbolOrig) sSymbol = sSymbolOrig;
                this.println(this.toStrOffset(offSymbol) + ' ' + sSymbol);
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
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr
     * @param {boolean} [fNearest]
     * @return {Array} where [0] == symbol name, [1] == symbol value, [2] == any annotation, and [3] == any associated comment
     */
    findSymbol(dbgAddr, fNearest)
    {
        var aSymbol = [];
        var addrSymbol = this.getAddr(dbgAddr) >>> 0;
        for (var iTable = 0; iTable < this.aSymbolTable.length; iTable++) {
            var symbolTable = this.aSymbolTable[iTable];
            var addr = symbolTable.addr >>> 0;
            var len = symbolTable.len;
            if (addrSymbol >= addr && addrSymbol < addr + len) {
                var offSymbol = addrSymbol - addr;
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
        return aSymbol;
    }

    /**
     * findSymbolAddr(sSymbol)
     *
     * Search our symbol tables for sSymbol, and if found, return a dbgAddr (same as parseAddr()).
     *
     * @this {DebuggerPDP10}
     * @param {string} sSymbol
     * @return {DbgAddrPDP10|undefined}
     */
    findSymbolAddr(sSymbol)
    {
        var dbgAddr, offSymbol;

        if (sSymbol.match(/^[a-z_][a-z0-9_]*$/i)) {
            var sUpperCase = sSymbol.toUpperCase();
            for (var iTable = 0; iTable < this.aSymbolTable.length; iTable++) {
                var symbolTable = this.aSymbolTable[iTable];
                var symbol = symbolTable.aSymbols[sUpperCase];
                if (symbol != null) {
                    offSymbol = symbol['o'];
                    /*
                     * If the symbol matched but there's no 'o' offset (ie, it wasn't for an address), there's
                     * no point looking any farther, since each symbol appears only once.
                     *
                     * NOTE: We assume that every ROM is ORG'ed at 0x0000, and therefore unless the symbol has an
                     * explicitly-defined segment, we return the segment associated with the entire group; for a ROM,
                     * that segment is normally "addrROM >>> 4".  Down the road, we may want/need to support a special
                     * symbol entry (eg, ".ORG") that defines an alternate origin.
                     */
                    break;
                }
            }
        }
        if (offSymbol != null) {
            dbgAddr = this.newAddr(offSymbol);
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
     * @this {DebuggerPDP10}
     */
    doHelp()
    {
        var s = "commands:";
        for (var sCommand in DebuggerPDP10.COMMANDS) {
            s += '\n' + Str.pad(sCommand, 9) + DebuggerPDP10.COMMANDS[sCommand];
        }
        if (!this.checksEnabled()) s += "\nnote: history disabled if no exec breakpoints";
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
     * @this {DebuggerPDP10}
     * @param {Array.<string>} asArgs is the complete argument array, beginning with the "a" command in asArgs[0]
     */
    doAssemble(asArgs)
    {
        var dbgAddr = this.parseAddr(asArgs[1], true);
        if (!dbgAddr) return;

        this.dbgAddrAssemble = dbgAddr;
        if (asArgs[2] === undefined) {
            this.println("begin assemble at " + this.toStrAddr(dbgAddr));
            this.fAssemble = true;
            this.cmp.updateDisplays();
            return;
        }

        var aOps = this.parseInstruction(asArgs[2], asArgs[3], dbgAddr);
        if (aOps.length) {
            for (var i = 0; i < aOps.length; i++) {
                this.setWord(dbgAddr, aOps[i], 1);
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
     *      bp #    set exec breakpoint
     *      br #    set read breakpoint
     *      bw #    set write breakpoint
     *      bc #    clear breakpoint (* to clear all)
     *      bl      list all breakpoints
     *      bn [#]  break after # instruction(s)
     *
     * The "bn" command, like the "dh" command and all other commands that use an instruction count,
     * assumes a decimal value, regardless of the current base.  Use "bn" without an argument to display
     * the break count, and use "bn 0" to clear the break count.
     *
     * @this {DebuggerPDP10}
     * @param {string} sCmd
     * @param {string|undefined} [sAddr]
     * @param {string} [sOptions] (the rest of the breakpoint command-line)
     */
    doBreak(sCmd, sAddr, sOptions)
    {
        if (sAddr == '?') {
            this.println("breakpoint commands:");
            this.println("\tbp #\tset exec breakpoint");
            this.println("\tbr #\tset read breakpoint");
            this.println("\tbw #\tset write breakpoint");
            this.println("\tbc #\tclear breakpoint (* to clear all)");
            this.println("\tbl\tlist all breakpoints");
            this.println("\tbn [#]\tbreak after # instruction(s)");
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
            var n = +sAddr || 0;
            if (sAddr) this.nBreakInstructions = n;
            this.println("break after " + n + " instruction(s)");
            return;
        }

        if (sAddr === undefined) {
            this.println("missing breakpoint address");
            return;
        }

        var dbgAddr = this.newAddr();
        if (sAddr != '*') {
            dbgAddr = this.parseAddr(sAddr, true, true);
            if (!dbgAddr) return;
        }

        if (sParm == 'c') {
            if (dbgAddr.addr == null) {
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
            this.println("breakpoint missing: " + this.toStrAddr(dbgAddr));
            return;
        }

        if (dbgAddr.addr == null) return;

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
     * @this {DebuggerPDP10}
     * @param {string} [sCmd] (eg, "cls" or "clear")
     */
    doClear(sCmd)
    {
        /*
         * TODO: There should be a clear() component method that the Control Panel overrides to perform this function.
         */
        if (this.controlPrint) this.controlPrint.value = "";
    }

    /**
     * doDump(asArgs)
     *
     * @this {DebuggerPDP10}
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
            for (m in MessagesPDP10.CATEGORIES) {
                if (this.afnDumpers[m]) {
                    if (sDumpers) sDumpers += ',';
                    sDumpers = sDumpers + m;
                }
            }
            sDumpers += ",state,symbols";
            this.println("dump memory commands:");
            this.println("\tdw [a] [n]    dump n words at address a");
            this.println("\tds [a] [n]    dump n words at address a as JSON");
            this.println("\tdh [p] [n]    dump n instructions from history position p");
            if (sDumpers.length) this.println("dump extension commands:\n\t" + sDumpers);
            return;
        }

        if (sAddr == "state") {
            var sState = this.cmp.powerOff(true);
            if (sLen == "console") {
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
                if (sState) this.println(sState);
            }
            return;
        }

        if (sAddr == "symbols") {
            this.dumpSymbols();
            return;
        }

        if (sCmd == "d") {
            for (m in MessagesPDP10.CATEGORIES) {
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
            if (!sAddr) sCmd = this.sCmdDumpPrev || "dw";
        } else {
            this.sCmdDumpPrev = sCmd;
        }

        if (sCmd == "dh") {
            this.dumpHistory(sAddr, sLen);
            return;
        }

        var dbgAddr = this.parseAddr(sAddr);
        if (!dbgAddr) return;

        var len = 0;
        var fJSON = (sCmd == "ds");

        if (sLen) {
            if (sLen.charAt(0) == 'l') {
                sLen = sLen.substr(1) || sBytes;
                len = this.parseValue(sLen);
            }
            else {
                var dbgAddrEnd = this.parseAddr(sLen);
                if (dbgAddrEnd) len = dbgAddrEnd.addr - dbgAddr.addr;
            }
            if (len < 0) len = 0;
            if (len > 0x10000) len = 0x10000;
        }

        var nBase = this.nBase;
        if (dbgAddr.nBase) this.nBase = dbgAddr.nBase;

        var nBitsPerWord = 36;
        var nWords = len || 32;
        var nWordsPerLine = 4; // fJSON? 16 : this.nBase;
        var nLines = (((nWords + nWordsPerLine - 1) / nWordsPerLine)|0) || 1;

        var sDump = "";
        while (nLines-- && nWords > 0) {
            var sData = "", sChars = "";
            sAddr = this.toStrAddr(dbgAddr);
            var n = nWordsPerLine;
            while (n-- > 0 && nWords-- > 0) {
                var w = this.getWord(dbgAddr, 1);
                if (fJSON) {
                    if (sData) sData += ",";
                    sData += "0x"+ Str.toHex(w, nBitsPerWord >> 2);
                } else {
                    sData += this.toStrBase(w, nBitsPerWord >> 3);
                    sData += ' ';
                }
                var nBytesPerWord = nBitsPerWord >> 3;
                while (nBytesPerWord--) {
                    var c = w % 256;
                    sChars += (c >= 32 && c < 128? String.fromCharCode(c) : '.');
                    w /= 256;
                }
            }
            if (sDump) sDump += "\n";
            if (fJSON) {
                sDump += sData + ",";
            } else {
                sDump += sAddr + ":  " + sData + ((n == 0)? (' ' + sChars) : "");
            }
        }

        if (sDump) this.println(sDump);

        this.dbgAddrNextData = dbgAddr;
        this.nBase = nBase;
    }

    /**
     * doEdit(asArgs)
     *
     * @this {DebuggerPDP10}
     * @param {Array.<string>} asArgs
     */
    doEdit(asArgs)
    {
        var size, mask;
        var fnGet, fnSet;
        var sCmd = asArgs[0];
        var sAddr = asArgs[1];
        if (sCmd == "e" || sCmd == "ew") {
            size = 2;
            mask = 0xffff;
            fnGet = this.getWord;
            fnSet = this.setWord;
        } else {
            sAddr = null;
        }
        if (sAddr == null) {
            this.println("edit memory commands:");
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
            this.println("changing " + this.toStrAddr(dbgAddr) + (this.messageEnabled(MessagesPDP10.BUS)? "" : (" from " + this.toStrBase(fnGet.call(this, dbgAddr), size))) + " to " + this.toStrBase(vNew, size));
            //noinspection JSUnresolvedFunction
            fnSet.call(this, dbgAddr, vNew, size);
        }
    }

    /**
     * doHalt(fQuiet)
     *
     * @this {DebuggerPDP10}
     * @param {boolean} [fQuiet]
     */
    doHalt(fQuiet)
    {
        var sMsg;
        if (this.flags.running) {
            if (!fQuiet) this.println("halting");
            this.stopCPU();
        } else {
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
     * @this {DebuggerPDP10}
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
     * @this {DebuggerPDP10}
     * @param {Array.<string>} asArgs
     * @return {boolean} true only if the instruction info command ("n") is supported
     */
    doInfo(asArgs)
    {
        if (DEBUG) {
            this.println("msPerYield: " + this.cpu.msPerYield);
            this.println("nCyclesPerYield: " + this.cpu.nCyclesPerYield);
            return true;
        }
        return false;
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
     * @this {DebuggerPDP10}
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
     * @this {DebuggerPDP10}
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
            var aSymbol = this.findSymbol(dbgAddr, true);
            if (aSymbol.length) {
                var nDelta, sDelta, s;
                if (aSymbol[0]) {
                    sDelta = "";
                    nDelta = dbgAddr.addr - aSymbol[1];
                    if (nDelta) sDelta = " + " + Str.toHexWord(nDelta);
                    s = aSymbol[0] + " (" + this.toStrOffset(aSymbol[1]) + ')' + sDelta;
                    if (fPrint) this.println(s);
                    sSymbol = s;
                }
                if (aSymbol.length > 4 && aSymbol[4]) {
                    sDelta = "";
                    nDelta = aSymbol[5] - dbgAddr.addr;
                    if (nDelta) sDelta = " - " + Str.toHexWord(nDelta);
                    s = aSymbol[4] + " (" + this.toStrOffset(aSymbol[5]) + ')' + sDelta;
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
     * doMessages(asArgs)
     *
     * @this {DebuggerPDP10}
     * @param {Array.<string>} asArgs
     */
    doMessages(asArgs)
    {
        var m;
        var fCriteria = null;
        var sCategory = asArgs[1];
        if (sCategory == '?') sCategory = undefined;

        if (sCategory !== undefined) {
            var bitsMessage = 0;
            if (sCategory == "all") {
                bitsMessage = (0xffffffff|0) & ~(MessagesPDP10.HALT | MessagesPDP10.KEYS | MessagesPDP10.LOG);
                sCategory = null;
            } else if (sCategory == "on") {
                fCriteria = true;
                sCategory = null;
            } else if (sCategory == "off") {
                fCriteria = false;
                sCategory = null;
            } else {
                /*
                 * Internally, we use "key" instead of "keys", since the latter is a method on JavasScript objects,
                 * but externally, we allow the user to specify "keys"; "kbd" is also allowed as shorthand for "keyboard".
                 */
                if (sCategory == "keys") sCategory = "key";
                if (sCategory == "kbd") sCategory = "keyboard";
                for (m in MessagesPDP10.CATEGORIES) {
                    if (sCategory == m) {
                        bitsMessage = MessagesPDP10.CATEGORIES[m];
                        fCriteria = !!(this.bitsMessage & bitsMessage);
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
                    fCriteria = false;
                    if (bitsMessage == MessagesPDP10.BUFFER) {
                        var i = this.aMessageBuffer.length >= 1000? this.aMessageBuffer.length - 1000 : 0;
                        while (i < this.aMessageBuffer.length) {
                            this.println(this.aMessageBuffer[i++]);
                        }
                        this.aMessageBuffer = [];
                    }
                }
            }
        }

        /*
         * Display those message categories that match the current criteria (on or off)
         */
        var n = 0;
        var sCategories = "";
        for (m in MessagesPDP10.CATEGORIES) {
            if (!sCategory || sCategory == m) {
                var bitMessage = MessagesPDP10.CATEGORIES[m];
                var fEnabled = !!(this.bitsMessage & bitMessage);
                if (fCriteria !== null && fCriteria != fEnabled) continue;
                if (sCategories) sCategories += ',';
                if (!(++n % 10)) sCategories += "\n\t";     // jshint ignore:line
                /*
                 * Internally, we use "key" instead of "keys", since the latter is a method on JavasScript objects,
                 * but externally, we allow the user to specify "keys".
                 */
                if (m == "key") m = "keys";
                sCategories += m;
            }
        }

        if (sCategory === undefined) {
            this.println("message commands:\n\tm [category] [on|off]\tturn categories on/off");
        }

        this.println((fCriteria !== null? (fCriteria? "messages on:  " : "messages off: ") : "message categories:\n\t") + (sCategories || "none"));

        this.historyInit();     // call this just in case MessagesPDP10.INT was turned on
    }

    /**
     * doOptions(asArgs)
     *
     * @this {DebuggerPDP10}
     * @param {Array.<string>} asArgs
     */
    doOptions(asArgs)
    {
        switch (asArgs[1]) {

        case "base":
            if (asArgs[2]) {
                var nBase = +asArgs[2];
                if (nBase == 8 || nBase == 10 || nBase == 16) {
                    this.nBase = nBase;
                } else {
                    this.println("invalid base: " + nBase);
                    break;
                }
            }
            this.println("default base: " + this.nBase);
            break;

        case "cs":
            var nCycles;
            if (asArgs[3] !== undefined) nCycles = +asArgs[3];          // warning: decimal instead of hex conversion
            switch (asArgs[2]) {
                case "int":
                    this.cpu.nCyclesChecksumInterval = nCycles;
                    break;
                case "start":
                    this.cpu.nCyclesChecksumStart = nCycles;
                    break;
                case "stop":
                    this.cpu.nCyclesChecksumStop = nCycles;
                    break;
                default:
                    this.println("unknown cs option");
                    return;
            }
            if (nCycles !== undefined) {
                this.cpu.resetChecksum();
            }
            this.println("checksums " + (this.cpu.flags.checksum? "enabled" : "disabled"));
            return;

        case "sp":
            if (asArgs[2] !== undefined) {
                if (!this.cpu.setSpeed(+asArgs[2])) {
                    this.println("warning: using 1x multiplier, previous target not reached");
                }
            }
            this.println("target speed: " + this.cpu.getSpeedTarget() + " (" + this.cpu.getSpeed() + "x)");
            return;

        default:
            if (asArgs[1]) {
                this.println("unknown option: " + asArgs[1]);
                return;
            }
            /* falls through */

        case "?":
            this.println("debugger options:");
            this.println("\tbase #\t\tset default base to #");
            this.println("\tcs int #\tset checksum cycle interval to #");
            this.println("\tcs start #\tset checksum cycle start count to #");
            this.println("\tcs stop #\tset checksum cycle stop count to #");
            this.println("\tsp #\t\tset speed multiplier to #");
            break;
        }
    }

    /**
     * doRegisters(asArgs, fInstruction)
     *
     * @this {DebuggerPDP10}
     * @param {Array.<string>} [asArgs]
     * @param {boolean} [fInstruction] (true to include the current instruction; default is true)
     */
    doRegisters(asArgs, fInstruction)
    {
        if (asArgs && asArgs[1] == '?') {
            this.println("register commands:");
            this.println("\tr\tdump registers");
            this.println("\trm\tdump misc registers");
            this.println("\trx [#]\tset flag or register x to [#]");
            return;
        }

        var fMisc = false;
        var cpu = this.cpu;
        if (fInstruction == null) fInstruction = true;

        if (asArgs != null && asArgs.length > 1) {
            var sReg = asArgs[1];

            if (sReg == 'm') {
                fMisc = true;
            }
            else {
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

                var sRegMatch = sReg.toUpperCase();
                switch (sRegMatch) {
                case "PC":
                    cpu.setPC(w);
                    this.dbgAddrNextCode = this.newAddr(cpu.getPC());
                    break;
                default:
                    this.println("unknown register: " + sReg);
                    return;
                }
                this.cmp.updateDisplays();
                this.println("updated registers:");
            }
        }

        this.println(this.getRegDump(fMisc));

        if (fInstruction) {
            this.dbgAddrNextCode = this.newAddr(cpu.getPC());
            this.doUnassemble(this.toStrAddr(this.dbgAddrNextCode));
        }
    }

    /**
     * doRun(sCmd, sAddr, sOptions, fQuiet)
     *
     * @this {DebuggerPDP10}
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
     * @this {DebuggerPDP10}
     * @param {string} sCmd
     */
    doPrint(sCmd)
    {
        sCmd = Str.trim(sCmd);
        var a = sCmd.match(/^(['"])(.*?)\1$/);
        if (!a) {
            this.parseExpression(sCmd, true);
        } else {
            if (a[2].length > 1) {
                this.println(this.replaceRegs(a[2]));
            } else {
                this.printValue(null, a[2].charCodeAt(0));
            }
        }
    }

    /**
     * doStep(sCmd, sOption)
     *
     * @this {DebuggerPDP10}
     * @param {string} [sCmd] "p" or "pr"
     * @param {string} [sOption]
     */
    doStep(sCmd, sOption)
    {
        if (sOption == '?') {
            this.println("step commands:");
            this.println("\tp\tstep over instruction");
            this.println("\tpr\tstep over instruction with register update");
            return;
        }

        var fCallStep = true;
        var nRegs = (sCmd == "pr"? 1 : 0);
        /*
         * Set up the value for this.nStep (ie, 1 or 2) depending on whether the user wants
         * a subsequent register dump ("pr") or not ("p").
         */
        var nStep = 1 + nRegs;

        if (!this.nStep) {
            var dbgAddr = this.newAddr(this.cpu.getPC());
            var opCode = this.getWord(dbgAddr);

            if (this.nStep) {
                this.setTempBreakpoint(dbgAddr);
                if (!this.startCPU()) {
                    if (this.cmp) this.cmp.setFocus();
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
     * getCall(dbgAddr)
     *
     * Given a possible return address (typically from the stack), look for a matching CALL (or INT) that
     * immediately precedes that address.
     *
     * @this {DebuggerPDP10}
     * @param {DbgAddrPDP10} dbgAddr
     * @return {string|null} CALL instruction at or near dbgAddr, or null if none
     */
    getCall(dbgAddr)
    {
        var sCall = null;
        var addr = dbgAddr.addr;
        var addrOrig = addr;
        for (var n = 1; n <= 6 && !!addr; n++) {
            if (n > 2) {
                dbgAddr.addr = addr;
                var s = this.getInstruction(dbgAddr);
                if (s.indexOf("JSR") >= 0) {
                    /*
                     * Verify that the length of this call, when added to the address of the call, matches
                     * the original return address.  We do this by getting the string index of the opcode bytes,
                     * subtracting that from the string index of the next space, and dividing that difference
                     * by two, to yield the length of the CALL (or INT) instruction, in bytes.
                     */
                    var i = s.indexOf(' ');
                    var j = s.indexOf(' ', i+1);
                    if (addr + (j - i - 1)/2 == addrOrig) {
                        sCall = s;
                        break;
                    }
                }
            }
            addr -= 2;
        }
        dbgAddr.addr = addrOrig;
        return sCall;
    }

    /**
     * doStackTrace(sCmd, sAddr)
     *
     * Use "k" for a normal stack trace and "ks" for a stack trace with symbolic info.
     *
     * @this {DebuggerPDP10}
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
        var dbgAddrCall = this.newAddr();
        var dbgAddrStack = this.newAddr(/*this.cpu.getSP()*/);
        this.println("stack trace for " + this.toStrAddr(dbgAddrStack));

        while (cFrames < nFrames) {
            var sCall = null, sCallPrev = null, cTests = 256;
            while ((dbgAddrStack.addr >>> 0) < 0x10000) {
                dbgAddrCall.addr = this.getWord(dbgAddrStack, 2);
                /*
                 * Because we're using the auto-increment feature of getWord(), and because that will automatically
                 * wrap the offset around the end of the segment, we must also check the addr property to detect the wrap.
                 */
                if (dbgAddrStack.addr == null || !cTests--) break;
                if (dbgAddrCall.addr & 0x1) continue;           // an odd address on the PDP-11 is not a valid instruction boundary
                sCall = this.getCall(dbgAddrCall);
                if (sCall) break;
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
            sCall = Str.pad(sCall, 50) + "  ;" + (sSymbol || "stack=" + this.toStrAddr(dbgAddrStack)); // + " return=" + this.toStrAddr(dbgAddrCall));
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
     * doesn't display anything until the the chunk has finished.  "tc 1" is also a useful
     * command in that it doesn't inhibit interrupts like "t" or "tr" does.
     *
     * However, generally a more useful command is "bn", which allows you to break after some
     * number of instructions have been executed (as opposed to some number of cycles).
     *
     * @this {DebuggerPDP10}
     * @param {string} [sCmd] ("t", "tc", or "tr")
     * @param {string} [sCount] # of instructions to step
     */
    doTrace(sCmd, sCount)
    {
        if (sCount == '?') {
            this.println("trace commands:");
            this.println("\tt  [#]\ttrace # instructions");
            this.println("\ttr [#]\ttrace # instructions with register updates");
            this.println("\ttc [#]\ttrace # cycles");
            this.println("note: bn [#] breaks after # instructions without updates");
            return;
        }

        var dbg = this;
        var fRegs = (sCmd != "t");
        var nCount = this.parseValue(sCount, null, true) || 1;

        /*
         * We used to set nCycles to 1 when a count > 1 was specified, because nCycles set
         * to 0 used to mean "execute the next instruction without checking for interrupts".
         * Well, this machine's stepCPU() doesn't do that; it ALWAYS checks for interrupts,
         * so we should leave nCycles set to 0, so that if an interrupt is dispatched, we will
         * get to see the first instruction of the interrupt handler.
         */
        var nCycles = 0;    // (nCount == 1? 0 : 1);

        if (sCmd == "tc") {
            nCycles = nCount;
            nCount = 1;
        }
        this.sCmdTracePrev = sCmd;

        Web.onCountRepeat(
            nCount,
            function onCountStep() {
                return dbg.setBusy(true) && dbg.stepCPU(nCycles, fRegs, false);
            },
            function onCountStepComplete() {
                /*
                 * We explicitly called stepCPU() with fUpdateDisplays set to false, because repeatedly
                 * calling updateDisplays() can be very slow, especially if a Control Panel is present with
                 * displayLiveRegs enabled, so once the repeat count has been exhausted, we must perform
                 * a final updateDisplays().
                 */
                if (dbg.panel) dbg.panel.stop();
                dbg.cmp.updateDisplays(-1);
                dbg.setBusy(false);
            }
        );
    }

    /**
     * doUnassemble(sAddr, sAddrEnd, nLines)
     *
     * @this {DebuggerPDP10}
     * @param {string} [sAddr]
     * @param {string} [sAddrEnd]
     * @param {number} [nLines]
     */
    doUnassemble(sAddr, sAddrEnd, nLines)
    {
        var dbgAddr = this.parseAddr(sAddr, true);
        if (!dbgAddr) return;

        if (nLines === undefined) nLines = 1;

        var nBytes = 0x100;
        if (sAddrEnd !== undefined) {

            if (sAddrEnd.charAt(0) == 'l') {
                var n = this.parseValue(sAddrEnd.substr(1));
                if (n != null) nLines = n;
            }
            else {
                var dbgAddrEnd = this.parseAddr(sAddrEnd, true);
                if (!dbgAddrEnd || dbgAddrEnd.addr < dbgAddr.addr) return;

                nBytes = dbgAddrEnd.addr - dbgAddr.addr;
                if (!DEBUG && nBytes > 0x100) {
                    /*
                     * Limiting the amount of disassembled code to 256 bytes in non-DEBUG builds is partly to
                     * prevent the user from wedging the browser by dumping too many lines, but also a recognition
                     * that, in non-DEBUG builds, this.println() keeps print output buffer truncated to 8Kb anyway.
                     */
                    this.println("range too large");
                    return;
                }
                nLines = -1;
            }
        }

        var nPrinted = 0;
        var sInstruction;

        while (nBytes > 0 && nLines--) {

            var nSequence = (this.isBusy(false) || this.nStep)? this.nCycles : null;
            var sComment = (nSequence != null? "cycles" : null);
            var aSymbol = this.findSymbol(dbgAddr);

            var addr = dbgAddr.addr;    // we snap dbgAddr.addr *after* calling findSymbol(), which re-evaluates it

            if (aSymbol[0] && nLines) {
                if (!nPrinted && nLines || aSymbol[0].indexOf('+') < 0) {
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

            this.println(sInstruction);
            this.dbgAddrNextCode = dbgAddr;
            nBytes -= dbgAddr.addr - addr;
            nPrinted++;
        }
    }

    /**
     * splitArgs(sCmd)
     *
     * @this {DebuggerPDP10}
     * @param {string} sCmd
     * @return {Array.<string>}
     */
    splitArgs(sCmd)
    {
        var asArgs = sCmd.replace(/ +/g, ' ').split(' ');
        asArgs[0] = asArgs[0].toLowerCase();
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
     * @this {DebuggerPDP10}
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
                    this.println("ended assemble at " + this.toStrAddr(this.dbgAddrAssemble));
                    this.dbgAddrNextCode = this.dbgAddrAssemble;
                    this.fAssemble = false;
                }
                sCmd = "";
            }
            else if (!fQuiet) {
                this.println(DebuggerPDP10.PROMPT + sCmd);
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
                    sCmd = "a " + this.toStrAddr(this.dbgAddrAssemble) + ' ' + sCmd;
                }

                var fError = false;
                var asArgs = this.splitArgs(sCmd);

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
                    if (!COMPILED && sCmd == "debug") {
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
                    fError = true;
                    break;
                case 'k':
                    this.doStackTrace(asArgs[0], asArgs[1]);
                    break;
                case 'l':
                    if (asArgs[0] == "ln") {
                        this.doList(asArgs[1], true);
                        break;
                    }
                    fError = true;
                    break;
                case 'm':
                    this.doMessages(asArgs);
                    break;
                case 'p':
                    if (asArgs[0] == "print") {
                        this.doPrint(sCmd.substr(5));
                        break;
                    }
                    this.doStep(asArgs[0], asArgs[1]);
                    break;
                case 'r':
                    if (sCmd == "reset") {
                        if (this.cmp) this.cmp.reset();
                        break;
                    }
                    this.doRegisters(asArgs);
                    break;
                case 's':
                    this.doOptions(asArgs);
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
                    if (asArgs[0] == "ver") {
                        this.println((PDP10.APPNAME || "PDP10") + " version " + (XMLVERSION || PDP10.APPVERSION) + " (" + this.cpu.model + (PDP10.COMPILED? ",RELEASE" : (PDP10.DEBUG? ",DEBUG" : ",NODEBUG")) + ')');
                        this.println(Web.getUserAgent());
                        break;
                    }
                    fError = true;
                    break;
                case '?':
                    if (asArgs[1]) {
                        this.doPrint(sCmd.substr(1));
                        break;
                    }
                    this.doHelp();
                    break;
                case 'n':
                    if (!COMPILED && sCmd == "nodebug") {
                        window.DEBUG = false;
                        this.println("DEBUG checks off");
                        break;
                    }
                    if (this.doInfo(asArgs)) break;
                    /* falls through */
                default:
                    fError = true;
                    break;
                }
                if (fError) {
                    this.println("unknown command: " + sCmd);
                    result = false;
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
     * @this {DebuggerPDP10}
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
     * DebuggerPDP10.init()
     *
     * This function operates on every HTML element of class "debugger", extracting the
     * JSON-encoded parameters for the Debugger constructor from the element's "data-value"
     * attribute, invoking the constructor to create a Debugger component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeDbg = Component.getElementsByClass(document, PDP10.APPCLASS, "debugger");
        for (var iDbg = 0; iDbg < aeDbg.length; iDbg++) {
            var eDbg = aeDbg[iDbg];
            var parmsDbg = Component.getComponentParms(eDbg);
            var dbg = new DebuggerPDP10(parmsDbg);
            Component.bindComponentControls(dbg, eDbg, PDP10.APPCLASS);
        }
    }
}

if (DEBUGGER) {

    /*
     * NOTE: Every DebuggerPDP10 property from here to the first prototype function definition (initBus()) is
     * considered a "class constant"; most of them use our "all-caps" convention (and all of them SHOULD, but
     * that wouldn't help us catch any bugs).
     *
     * Technically, all of them should ALSO be preceded by a "@const" annotation, but that's a lot of work and it
     * really clutters the code.  I wish the Closure Compiler had a way to annotate every definition with a given
     * section with a single annotation....
     */

    DebuggerPDP10.COMMANDS = {
        '?':        "help/print",
        'a [#]':    "assemble",             // TODO: Implement this command someday
        'b [#]':    "breakpoint",           // multiple variations (use b? to list them)
        'c':        "clear output",
        'd [#]':    "dump memory",          // additional syntax: d [#] [l#], where l# is a number of bytes to dump
        'e [#]':    "edit memory",
        'g [#]':    "go [to #]",
        'h':        "halt",
        'if':       "eval expression",
        'int [#]':  "request interrupt",
        'k':        "stack trace",
        "ln":       "list nearest symbol(s)",
        'm':        "messages",
        'p':        "step over",            // other variations: pr (step and dump registers)
        'print':    "print expression",
        'r':        "dump/set registers",
        'reset':    "reset machine",
        's':        "set options",
        't [#]':    "trace",                // other variations: tr (trace and dump registers)
        'u [#]':    "unassemble",
        'var':      "assign variable",
        'ver':      "print version"
    };

    /*
     * CPU opcode IDs
     */
    DebuggerPDP10.OPS = {
        NONE:   0
    };

    /*
     * CPU opcode names, indexed by CPU opcode ordinal (above)
     */
    DebuggerPDP10.OPNAMES = [
        ".WORD",
    ];

    DebuggerPDP10.REGS = {
        PC:     0
    };

    DebuggerPDP10.REGNAMES = [
        "PC"
    ];

    /*
     * The OPTABLE contains opcode masks, and each mask refers to table of possible values, and each
     * value refers to an array that contains:
     *
     *      [0]: {number} of the opcode name (see OP.*)
     *      [1]: {number} containing the first operand type bit(s), if any
     *      [2]: {number} containing the second operand type bit(s), if any
     *
     * Note that, by convention, opcodes that require two operands list the SRC operand first and DST operand
     * second (ie, the OPPOSITE of the Intel convention).
     *
     * Also note that, for some of the newer PDP-11 opcodes (eg, MUL, DIV, ASH, ASHC), the location of the
     * opcode's SRC and DST bits are reversed.  This is why, for example, you'll see the MUL instruction defined
     * below as having OP_DST for the first operand and OP_SRCREG for the second operand.  This does NOT mean
     * that the opcode's destination operand is being listed first, but rather that the bits describing the source
     * operand are in the opcode's OP_DST field.
     */
    DebuggerPDP10.OPTABLE = {};

    DebuggerPDP10.OPNONE = [DebuggerPDP10.OPS.NONE];

    DebuggerPDP10.HISTORY_LIMIT = DEBUG? 100000 : 1000;

    DebuggerPDP10.PROMPT = ">> ";

    /*
     * Initialize every Debugger module on the page (as IF there's ever going to be more than one ;-))
     */
    Web.onInit(DebuggerPDP10.init);

}   // endif DEBUGGER

if (NODE) module.exports = DebuggerPDP10;
