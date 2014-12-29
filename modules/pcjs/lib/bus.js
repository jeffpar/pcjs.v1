/**
 * @fileoverview Implements the PCjs Bus component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Sep-04
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
    var Component   = require("../../shared/lib/component");
    var Memory      = require("./memory");
    var State       = require("./state");
}

/**
 * @class BackTrack
 * @property {Object} obj
 * @property {number} off
 * @property {number} slot
 * @property {number} refs
 */

/**
 * Bus(cpu, dbg)
 *
 * The Bus component manages "physical" memory and I/O address spaces.
 *
 * The Bus component has no UI elements, so it does not require an init() handler,
 * but it still inherits from the Component class and must be allocated like any
 * other device component.  It's currently allocated by the Computer's init() handler,
 * which then calls the initBus() method of all the other components.
 *
 * When initMemory() initializes the entire address space, it also passes aMemBlocks
 * to the CPU object, so that the CPU can perform all its own address-to-block and memory
 * block accesses directly.
 *
 * For memory beyond the simple needs of the ROM and RAM components (ie, memory-mapped
 * devices), the address space must still be allocated through the Bus component via
 * addMemory().  If the component needs something more than simple read/write storage,
 * it must provide a controller with getMemoryBuffer() and getMemoryAccess() methods.
 *
 * By contrast, all port (I/O) operations are defined by external handlers; they register
 * with us, and we manage those registrations, as well as support for I/O breakpoints,
 * but unlike memory accesses, we're not involved with port data accesses.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsBus
 * @param {X86CPU|Component} cpu
 * @param {Debugger|Component} dbg
 */
function Bus(parmsBus, cpu, dbg)
{
    Component.call(this, "Bus", parmsBus, Bus);

    this.cpu = cpu;
    this.dbg = dbg;

    this.nBusWidth = parmsBus['buswidth'] || 20;

    /*
     * Compute all the Bus memory block addressing values that we rely on, based on the width of the bus.
     *
     * Regarding this.blockTotal, we want to avoid address-overflow-detection expressions like:
     *
     *      iBlock < this.blockTotal? iBlock : 0
     *
     * and as long as we know that this.blockTotal is a power-of-two (eg, 256 or 0x100, in the case
     * of nBusWidth == 20), we can define this.blockMask as (this.blockTotal - 1) and rewrite the previous
     * expression as:
     *
     *      iBlock & this.blockMask
     *
     * While we *could* say that we mask addresses with this.addrLimit to simulate "A20 wrap", the simple
     * fact is it relieves us from bounds-checking every aMemBlocks index.  Address wrapping at the 1Mb
     * boundary (ie, the A20 address line) is something we'll have to deal with more carefully on the 80286.
     *
     *      New property        Old property        Old hard-coded values (when nBusWidth was always 20)
     *      ------------        ------------        ----------------------------------------------------
     *      this.addrLimit      Bus.ADDR.LIMIT      0xfffff
     *      this.addrMask       N/A                 N/A
     *      this.blockSize      Bus.BLOCK.SIZE      4096
     *      this.blockLen       Bus.BLOCK.LEN       (this.blockSize >> 2)
     *      this.blockShift     Bus.BLOCK.SHIFT     12
     *      this.blockLimit     Bus.BLOCK.LIMIT     0xfff
     *      this.blockTotal     Bus.BLOCK.TOTAL     ((this.addrLimit + this.blockSize) / this.blockSize) | 0
     *      this.blockMask      Bus.BLOCK.MASK      (this.blockTotal - 1)   (ie, 0xff)
     *
     * Note that the blockShift calculation below chooses a 4Kb physical memory block size for a 20-bit bus
     * (1Mb address space) and a 16Kb physical memory block for a 24-bit bus (16Mb address space).  This yields
     * a 256-block array for the smaller bus and a 1024-block array for the larger bus.  If we left the block
     * size at 4Kb in all cases, we'd end up with a 4096-block array for an 80286, which seems a bit excessive.
     *
     * I can't think of any reason why a coarser block granularity (of 16Kb) should hurt anything, other than
     * wasting a little memory for ROMs smaller than the block size.  Realize that this is strictly a physical
     * memory implementation detail, which should have no bearing on segment or page granularity of any future
     * virtual memory implementation.
     */
    this.addrLimit = this.addrMask = (1 << this.nBusWidth) - 1;
    this.blockShift = (this.nBusWidth <= 20? 12 : 14);
    this.blockSize = 1 << this.blockShift;
    this.blockLen = this.blockSize >> 2;
    this.blockLimit = this.blockSize - 1;
    this.blockTotal = ((this.addrLimit + this.blockSize) / this.blockSize) | 0;
    this.blockMask = this.blockTotal - 1;

    /*
     * Lists of I/O notification functions: aPortInputNotify and aPortOutputNotify are arrays, indexed by
     * port, of sub-arrays which contain:
     *
     *      [0]: registered component
     *      [1]: registered function to call for every I/O access
     *
     * The registered function is called with the port address, and if the access was triggered by the CPU,
     * the physical address (EIP) that the access occurred from.
     *
     * WARNING: Unlike the (old) read and write memory notification functions, these support only one
     * pair of input/output functions per port.  A more sophisticated architecture could support a list
     * of chained functions across multiple components, but I doubt that will be necessary here.
     *
     * UPDATE: The Debugger now piggy-backs on these arrays to indicate ports for which it wants notification
     * of I/O.  In those cases, the registered component/function elements may or may not be set, but the following
     * additional element will be set:
     *
     *      [2]: true to break on I/O, false to ignore I/O
     *
     * The false case is important if fPortInputBreakAll and/or fPortOutputBreakAll is set, because it allows the
     * Debugger to selectively ignore specific ports.
     */
    this.aPortInputNotify = [];
    this.aPortOutputNotify = [];
    this.fPortInputBreakAll = this.fPortOutputBreakAll = false;

    /*
     * Allocate empty Memory blocks to span the entire physical address space.
     */
    this.initMemory();

    if (BACKTRACK) {
        /*
         * BackTrack objects have the following properties:
         *
         *      obj:    a reference to the source object (eg, ROM object, Sector object)
         *      off:    the offset within the source object that this object refers to
         *      slot:   the slot in abtObjects which this object currently occupies
         *      refs:   the number of memory references, as recorded by writeBackTrack()
         */
        this.abtObjects = [];
        this.cbtDeletions = 0;
    }

    this.setReady();
}

Component.subclass(Component, Bus);

if (BACKTRACK) {
    Bus.BACKTRACK = {
        SLOT_MAX:   32768,
        SLOT_SHIFT: 16,
        GEN_START:  1,
        GEN_MAX:    64,
        GEN_SHIFT:  9,
        OFF_MAX:    512
    };
}

/**
 * initMemory()
 *
 * Allocate enough (empty) Memory blocks to span the entire physical address space.
 *
 * @this {Bus}
 */
Bus.prototype.initMemory = function()
{
    this.aMemBlocks = new Array(this.blockTotal);
    for (var iBlock = 0; iBlock < this.blockTotal; iBlock++) {
        var addr = iBlock * this.blockSize;
        var block = this.aMemBlocks[iBlock] = new Memory(addr);
        if (DEBUGGER) block.setDebugInfo(this.cpu, this.dbg, addr, this.blockSize);
    }
    this.cpu.initMemory(this.aMemBlocks, this.addrLimit, this.blockShift, this.blockLimit, this.blockMask);
    this.cpu.setAddressMask(this.addrMask);
};

/**
 * reset()
 *
 * @this {Bus}
 */
Bus.prototype.reset = function()
{
    this.setA20(true);
};

/**
 * powerUp(data, fRepower)
 *
 * We don't need a powerDown() handler, because for largely historical reasons, our state (including the A20 state)
 * is saved by saveMemory().
 *
 * However, we do need a powerUp() handler, because on resumable machines, the Computer's onReset() function calls
 * everyone's powerUp() handler rather than their reset() handler.
 *
 * TODO: Perhaps Computer should be smarter: if there's no powerUp() handler, then fallback to the reset() handler.
 * In that case, however, we'd either need to remove the powerUp() stub in Component, or detect the existence of the stub.
 *
 * @this {Bus}
 * @param {Object|null} data (always null because we supply no powerDown() handler)
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
Bus.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) this.reset();
    return true;
};

/**
 * addMemory(addr, size, fReadOnly, controller)
 *
 * Adds new Memory blocks to the specified address range.  Any Memory blocks previously
 * added to that range must first be removed via removeMemory(); otherwise, you'll get
 * an allocation conflict error.  Moreover, the address range must start at a block-granular
 * address and span exactly one or more blocks; otherwise, you'll get a memory range error.
 *
 * These restrictions help prevent address calculation errors, redundant allocations, etc.
 *
 * @this {Bus}
 * @param {number} addr is the starting physical address of the memory address range
 * @param {number} size of the length in bytes of the range; must be a multiple of BLOCK_SIZE
 * @param {boolean} [fReadOnly] is true if the memory must be read-only; default is read-write
 * @param {Object} [controller] is an optional memory controller component
 * @return {boolean} true if successful, false if not
 */
Bus.prototype.addMemory = function(addr, size, fReadOnly, controller)
{
    if (!(addr & this.blockLimit) && size && !(size & this.blockLimit)) {
        var iBlock = addr >> this.blockShift;
        while (size > 0 && iBlock < this.aMemBlocks.length) {
            var block = this.aMemBlocks[iBlock];
            if (block !== undefined && block.size) {
                return this.reportError(1, addr, size);
            }
            addr = iBlock * this.blockSize;
            block = this.aMemBlocks[iBlock++] = new Memory(addr, this.blockSize, fReadOnly, controller);
            if (DEBUGGER) block.setDebugInfo(this.cpu, this.dbg, addr, this.blockSize);
            size -= this.blockSize;
        }
        return true;
    }
    return this.reportError(2, addr, size);
};

/**
 * cleanMemory(addr, size)
 *
 * @this {Bus}
 * @param {number} addr
 * @param {number} size
 * @return {boolean} true if all blocks were clean, false if dirty; all blocks are cleaned in the process
 */
Bus.prototype.cleanMemory = function(addr, size)
{
    var fClean = true;
    var iBlock = addr >> this.blockShift;
    while (size > 0 && iBlock < this.aMemBlocks.length) {
        if (this.aMemBlocks[iBlock].fDirty) {
            this.aMemBlocks[iBlock].fDirty = fClean = false;
            this.aMemBlocks[iBlock].fDirtyEver = true;
        }
        size -= this.blockSize;
        iBlock++;
    }
    return fClean;
};

/**
 * getA20()
 *
 * @this {Bus}
 * @return {boolean} true if enabled, false if disabled
 */
Bus.prototype.getA20 = function()
{
    return this.addrLimit == this.addrMask;
};

/**
 * setA20(fEnable)
 *
 * @this {Bus}
 * @param {boolean} fEnable is true to enable A20 (default), false to disable
 */
Bus.prototype.setA20 = function(fEnable)
{
    this.assert(fEnable !== undefined);
    if (fEnable !== undefined) {
        if (this.nBusWidth > 20) {
            var addrMask = (this.addrMask & ~0x100000) | (fEnable? 0x100000 : 0);
            if (addrMask != this.addrMask) {
                this.addrMask = addrMask;
                /*
                 * This callback is required only because the CPU "insists" on using its own memory access functions.
                 */
                if (this.cpu) this.cpu.setAddressMask(addrMask);
            }
        }
    }
};

/**
 * getWidth()
 *
 * @this {Bus}
 * @return {number}
 */
Bus.prototype.getWidth = function()
{
    return this.nBusWidth;
};

/**
 * setMemoryAccess(addr, size)
 *
 * Updates the access functions in every block of the specified address range.  Since the only components
 * that should be dynamically modifying the memory access functions are those that use addMemory() with a custom
 * memory controller, we require that the block(s) being updated do in fact have a controller.
 *
 * @this {Bus}
 * @param {number} addr
 * @param {number} size
 * @param {Array.<function()>} [afn]
 * @return {boolean} true if successful, false if not
 */
Bus.prototype.setMemoryAccess = function(addr, size, afn)
{
    if (!(addr & this.blockLimit) && size && !(size & this.blockLimit)) {
        var iBlock = addr >> this.blockShift;
        while (size > 0) {
            var block = this.aMemBlocks[iBlock];
            if (!block.controller) {
                return this.reportError(5, addr, size);
            }
            block.setAccess(afn);
            size -= this.blockSize;
            iBlock++;
        }
        return true;
    }
    return this.reportError(3, addr, size);
};

/**
 * removeMemory(addr, size)
 *
 * Replaces every block in the specified address range with empty Memory blocks that will ignore all reads/writes.
 *
 * @this {Bus}
 * @param {number} addr
 * @param {number} size
 * @return {boolean} true if successful, false if not
 */
Bus.prototype.removeMemory = function(addr, size)
{
    if (!(addr & this.blockLimit) && size && !(size & this.blockLimit)) {
        var iBlock = addr >> this.blockShift;
        while (size > 0) {
            addr = iBlock * this.blockSize;
            var block = this.aMemBlocks[iBlock++] = new Memory(addr);
            if (DEBUGGER) block.setDebugInfo(this.cpu, this.dbg, addr, this.blockSize);
            size -= this.blockSize;
        }
        return true;
    }
    return this.reportError(4, addr, size);
};

/**
 * getByte(addr)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} byte (8-bit) value at that address
 */
Bus.prototype.getByte = function(addr)
{
    return this.aMemBlocks[(addr & this.addrMask) >> this.blockShift].readByte(addr & this.blockLimit);
};

/**
 * getByteDirect(addr)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} byte (8-bit) value at that address
 */
Bus.prototype.getByteDirect = function(addr)
{
    return this.aMemBlocks[(addr & this.addrMask) >> this.blockShift].readByteDirect(addr & this.blockLimit);
};

/**
 * getWord(addr)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} word (16-bit) value at that address
 */
Bus.prototype.getWord = function(addr)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.addrMask) >> this.blockShift;
    if (off != this.blockLimit) {
        return this.aMemBlocks[iBlock].readWord(off);
    }
    return this.aMemBlocks[iBlock++].readByte(off) | (this.aMemBlocks[iBlock & this.blockMask].readByte(0) << 8);
};

/**
 * getWordDirect(addr)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} word (16-bit) value at that address
 */
Bus.prototype.getWordDirect = function(addr)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.addrMask) >> this.blockShift;
    if (off != this.blockLimit) {
        return this.aMemBlocks[iBlock].readWordDirect(off);
    }
    return this.aMemBlocks[iBlock++].readByteDirect(off) | (this.aMemBlocks[iBlock & this.blockMask].readByteDirect(0) << 8);
};

/**
 * setByte(addr, b)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} b is the byte (8-bit) value to write (we truncate it to 8 bits to be safe)
 */
Bus.prototype.setByte = function(addr, b)
{
    this.aMemBlocks[(addr & this.addrMask) >> this.blockShift].writeByte(addr & this.blockLimit, b & 0xff);
};

/**
 * setByteDirect(addr, b)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} b is the byte (8-bit) value to write (we truncate it to 8 bits to be safe)
 */
Bus.prototype.setByteDirect = function(addr, b)
{
    this.aMemBlocks[(addr & this.addrMask) >> this.blockShift].writeByteDirect(addr & this.blockLimit, b & 0xff);
};

/**
 * setWord(addr, w)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} w is the word (16-bit) value to write (we truncate it to 16 bits to be safe)
 */
Bus.prototype.setWord = function(addr, w)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.addrMask) >> this.blockShift;
    if (off != this.blockLimit) {
        this.aMemBlocks[iBlock].writeWord(off, w & 0xffff);
        return;
    }
    this.aMemBlocks[iBlock++].writeByte(off, w & 0xff);
    this.aMemBlocks[iBlock & this.blockMask].writeByte(0, (w >> 8) & 0xff);
};

/**
 * setWordDirect(addr, w)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} w is the word (16-bit) value to write (we truncate it to 16 bits to be safe)
 */
Bus.prototype.setWordDirect = function(addr, w)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.addrMask) >> this.blockShift;
    if (off != this.blockLimit) {
        this.aMemBlocks[iBlock].writeWordDirect(off, w & 0xffff);
        return;
    }
    this.aMemBlocks[iBlock++].writeByteDirect(off, w & 0xff);
    this.aMemBlocks[iBlock & this.blockMask].writeByteDirect(0, (w >> 8) & 0xff);
};

/**
 * addBackTrackObject(obj, bto, off)
 *
 * If bto is null, then we create bto (ie, an object that wraps obj and records off).
 *
 * If bto is NOT null, then we verify that off is within bto's range; if not, then we must
 * create a new bto and return that instead.
 *
 * @this {Bus}
 * @param {Object} obj
 * @param {Object} bto
 * @param {number} off
 * @return {Object|null}
 */
Bus.prototype.addBackTrackObject = function(obj, bto, off)
{
    if (BACKTRACK && obj) {
        if (!bto || bto.obj != obj || off < bto.off || off >= bto.off + Bus.BACKTRACK.OFF_MAX) {
            var slot;
            var cbtObjects = this.abtObjects.length;
            bto = {obj: obj, off: off, slot: 0, refs: 0};
            if (!this.cbtDeletions) {
                slot = cbtObjects;
            } else {
                for (slot = 0; slot < cbtObjects; slot++) {
                    if (!this.abtObjects[slot]) {
                        this.cbtDeletions--;
                        break;
                    }
                }
                this.assert(slot < cbtObjects);
            }
            this.assert(slot < Bus.BACKTRACK.SLOT_MAX);
            bto.slot = slot;
            if (slot == cbtObjects) {
                this.abtObjects.push(bto);
            } else {
                this.abtObjects[slot] = bto;
            }
        }
        return bto;
    }
    return null;
};

/**
 * writeBackTrackObject(addr, bto, off)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {Object|null} bto
 * @param {number} off
 */
Bus.prototype.writeBackTrackObject = function(addr, bto, off)
{
    if (BACKTRACK && bto) {
        this.assert(off - bto.off >= 0 && off - bto.off < Bus.BACKTRACK.OFF_MAX);
        var bti = (bto.slot << Bus.BACKTRACK.SLOT_SHIFT) | (Bus.BACKTRACK.GEN_START << Bus.BACKTRACK.GEN_SHIFT) | (off - bto.off);
        this.writeBackTrack(addr, bti);
    }
};

/**
 * readBackTrack(addr)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number}
 */
Bus.prototype.readBackTrack = function(addr)
{
    if (BACKTRACK) {
        return this.aMemBlocks[(addr & this.addrMask) >> this.blockShift].readBackTrack(addr & this.blockLimit);
    }
    return 0;
};

/**
 * writeBackTrack(addr, bti)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} bti
 */
Bus.prototype.writeBackTrack = function(addr, bti)
{
    if (BACKTRACK) {
        var slot = bti >>> Bus.BACKTRACK.SLOT_SHIFT;
        var btiPrev = this.aMemBlocks[(addr & this.addrMask) >> this.blockShift].writeBackTrack(addr & this.blockLimit, bti);
        var slotPrev = btiPrev >>> Bus.BACKTRACK.SLOT_SHIFT;
        if (slot != slotPrev) {
            if (btiPrev) {
                var btoPrev = this.abtObjects[slotPrev];
                if (!btoPrev) {
                    if (DEBUGGER && this.dbg && this.dbg.messageEnabled(Messages.WARN)) {
                        this.dbg.message("writeBackTrack(%" + str.toHex(addr) + ',' + str.toHex(bti) + "): previous index (" + str.toHex(btiPrev) + ") refers to empty slot (" + slotPrev + ")");
                    }
                }
                else if (btoPrev.refs <= 0) {
                    if (DEBUGGER && this.dbg && this.dbg.messageEnabled(Messages.WARN)) {
                        this.dbg.message("writeBackTrack(%" + str.toHex(addr) + ',' + str.toHex(bti) + "): previous index (" + str.toHex(btiPrev) + ") refers to object with bad ref count (" + btoPrev.refs + ")");
                    }
                } else if (!--btoPrev.refs) {
                    this.abtObjects[slotPrev] = null;
                    this.cbtDeletions++;
                }
            }
            if (bti) {
                var bto = this.abtObjects[slot];
                if (bto) {
                    this.assert(slot == bto.slot);
                    bto.refs++;
                }
            }
        }
    }
};

/**
 * saveMemory()
 *
 * The only memory blocks we save are those marked as dirty; most likely all of RAM will have been marked dirty,
 * and even if our dirty-memory flags were as smart as our dirty-sector flags (ie, were set only when a write changed
 * what was already there), it's unlikely that would reduce the number of RAM blocks we must save/restore.  At least
 * all the ROM blocks should be clean (except in the unlikely event that the Debugger was used to modify them).
 *
 * All dirty blocks will be stored in a single array, as pairs of block numbers and data arrays, like so:
 *
 *      [iBlock0, [dw0, dw1, ...], iBlock1, [dw0, dw1, ...], ...]
 *
 * In a normal 4Kb block, there will be 1K DWORD values in the data array.  Remember that each DWORD is a signed 32-bit
 * integer (because they are formed using bit-wise operator rather than floating-point math operators), so don't be
 * surprised to see negative numbers in the data.
 *
 * The above example assumes "uncompressed" data arrays.  If we choose to use "compressed" data arrays, the data arrays
 * will look like:
 *
 *      [count0, dw0, count1, dw1, ...]
 *
 * where each count indicates how many times the following DWORD value occurs.  A data array length less than 1K indicates
 * that it's compressed, since we'll only store them in compressed form if they actually shrank, and we'll use State
 * helper methods compress() and decompress() to create and expand the compressed data arrays.
 *
 * @this {Bus}
 * @return {Array} a
 */
Bus.prototype.saveMemory = function()
{
    var i = 0;
    var a = [];
    for (var iBlock = 0; iBlock < this.blockTotal; iBlock++) {
        var block = this.aMemBlocks[iBlock];
        /*
         * We have to check both fDirty and fDirtyEver, because we may have called cleanMemory() on some of
         * the memory blocks (eg, video memory), and while cleanMemory() will clear a dirty block's fDirty flag,
         * it also sets the dirty block's fDirtyEver flag, which is left set for the lifetime of the machine.
         */
        if (block.fDirty || block.fDirtyEver) {
            a[i++] = iBlock;
            a[i++] = State.compress(block.save());
        }
    }
    a[i] = this.getA20();
    return a;
};

/**
 * restoreMemory(a)
 *
 * This restores the contents of all Memory blocks; called by X86CPU.restore().
 *
 * In theory, we ONLY have to save/restore block contents.  Other block attributes,
 * like fReadOnly, the memory controller (if any), and the active memory access functions,
 * should already be restored, since every component (re)allocates all the memory blocks
 * it was using when it's restored.  And since the CPU is guaranteed to be the last
 * component to be restored, all those blocks (and their attributes) should be in place now.
 *
 * See saveMemory() for a description of how the memory block contents are saved.
 *
 * @this {Bus}
 * @param {Array} a
 * @return {boolean} true if successful, false if not
 */
Bus.prototype.restoreMemory = function(a)
{
    var i;
    for (i = 0; i < a.length - 1; i += 2) {
        var iBlock = a[i];
        var adw = a[i+1];
        if (adw && adw.length < this.blockLen) {
            adw = State.decompress(adw, this.blockLen);
        }
        var block = this.aMemBlocks[iBlock];
        if (!block || !block.restore(adw)) {
            /*
             * Either the block to restore hasn't been allocated, indicating a change in the machine
             * configuration since it was last saved (the most likely explanation) or there's some internal
             * inconsistency (eg, the block size is wrong).
             */
            Component.error("Unable to restore memory block " + iBlock);
            return false;
        }
    }
    if (a[i] !== undefined) this.setA20(a[i]);
    return true;
};

/**
 * addMemoryBreakpoint(addr, fWrite)
 *
 * @this {Bus}
 * @param {number} addr
 * @param {boolean} fWrite is true for a memory write breakpoint, false for a memory read breakpoint
 */
Bus.prototype.addMemoryBreakpoint = function(addr, fWrite)
{
    if (DEBUGGER) {
        var iBlock = addr >> this.blockShift;
        this.aMemBlocks[iBlock].addBreakpoint(addr & this.blockLimit, fWrite);
    }
};

/**
 * removeMemoryBreakpoint(addr, fWrite)
 *
 * @this {Bus}
 * @param {number} addr
 * @param {boolean} fWrite is true for a memory write breakpoint, false for a memory read breakpoint
 */
Bus.prototype.removeMemoryBreakpoint = function(addr, fWrite)
{
    if (DEBUGGER) {
        var iBlock = addr >> this.blockShift;
        this.aMemBlocks[iBlock].removeBreakpoint(addr & this.blockLimit, fWrite);
    }
};

/**
 * addPortInputBreak(port)
 *
 * @this {Bus}
 * @param {number} [port]
 * @return {boolean} true if break on port input enabled, false if disabled
 */
Bus.prototype.addPortInputBreak = function(port)
{
    if (port === undefined) {
        this.fPortInputBreakAll = !this.fPortInputBreakAll;
        return this.fPortInputBreakAll;
    }
    if (this.aPortInputNotify[port] === undefined) {
        this.aPortInputNotify[port] = [null, null, false];
    }
    this.aPortInputNotify[port][2] = !this.aPortInputNotify[port][2];
    return this.aPortInputNotify[port][2];
};

/**
 * addPortInputNotify(start, end, component, fn)
 *
 * Add a port input-notification handler to the list of such handlers.
 *
 * @this {Bus}
 * @param {number} start port address
 * @param {number} end port address
 * @param {Component} component
 * @param {function(number,number)} fn is called with the port and EIP values at the time of the input
 */
Bus.prototype.addPortInputNotify = function(start, end, component, fn)
{
    if (fn !== undefined) {
        for (var port = start; port <= end; port++) {
            if (this.aPortInputNotify[port] !== undefined) {
                Component.warning("Input port " + str.toHexWord(port) + " registered by " + this.aPortInputNotify[port][0].id + ", ignoring " + component.id);
                continue;
            }
            this.aPortInputNotify[port] = [component, fn, false, false];
            if (MAXDEBUG) this.log("addPortInputNotify(" + str.toHexWord(port) + "," + component.id + ")");
        }
    }
};

/**
 * addPortInputTable(component, table, offset)
 *
 * Add port input-notification handlers from the specified table (a batch version of addPortInputNotify)
 *
 * @this {Bus}
 * @param {Component} component
 * @param {Object} table
 * @param {number} [offset] is an optional port offset
 */
Bus.prototype.addPortInputTable = function(component, table, offset)
{
    if (offset === undefined) offset = 0;
    for (var port in table) {
        /*
         * JavaScript coerces property keys to strings, so we use parseInt() to coerce them back to numbers.
         */
        port = parseInt(port, 10);
        this.addPortInputNotify(port + offset, port + offset, component, table[port]);
    }
};

/**
 * checkPortInputNotify(port, addrFrom)
 *
 * @this {Bus}
 * @param {number} port
 * @param {number} [addrFrom] is the EIP value at the time of the input
 * @return {number} simulated port value (0xff if none)
 *
 * NOTE: It seems that at least parts of the ROM BIOS (like the RS-232 probes around F000:E5D7 in the 5150 BIOS)
 * assume that ports for non-existent hardware return 0xff rather than 0x00, hence my new default (0xff) below.
 */
Bus.prototype.checkPortInputNotify = function(port, addrFrom)
{
    var bIn = 0xff;
    var aNotify = this.aPortInputNotify[port];
    if (aNotify !== undefined) {
        if (aNotify[1]) {
            bIn = aNotify[1].call(aNotify[0], port, addrFrom);
        }
        if (DEBUGGER && this.dbg && this.fPortInputBreakAll != aNotify[2]) {
            this.dbg.checkPortInput(port, bIn);
        }
    }
    else {
        if (DEBUGGER && this.dbg) {
            this.dbg.messageIO(this, port, null, addrFrom);
            if (this.fPortInputBreakAll) this.dbg.checkPortInput(port, bIn);
        }
    }
    return bIn;
};

/**
 * removePortInputNotify(start, end, component, fn)
 *
 * Remove a port input-notification handler from the list of such handlers (to be ENABLED later if needed)
 *
 * @this {Bus}
 * @param {number} start address
 * @param {number} end address
 * @param {Component} component
 * @param {function(number,number)} fn of previously added handler
 *
Bus.prototype.removePortInputNotify = function(start, end, component, fn)
 {
    for (var port = start; port < end; port++) {
        if (this.aPortInputNotify[port] && this.aPortInputNotify[port][0] == component && this.aPortInputNotify[port][1] == fn) {
            this.aPortInputNotify[port] = undefined;
        }
    }
};
 */

/**
 * addPortOutputBreak(port)
 *
 * @this {Bus}
 * @param {number} [port]
 * @return {boolean} true if break on port output enabled, false if disabled
 */
Bus.prototype.addPortOutputBreak = function(port)
{
    if (port === undefined) {
        this.fPortOutputBreakAll = !this.fPortOutputBreakAll;
        return this.fPortOutputBreakAll;
    }
    if (this.aPortOutputNotify[port] === undefined) {
        this.aPortOutputNotify[port] = [null, null, false];
    }
    this.aPortOutputNotify[port][2] = !this.aPortOutputNotify[port][2];
    return this.aPortOutputNotify[port][2];
};

/**
 * addPortOutputNotify(start, end, component, fn)
 *
 * Add a port output-notification handler to the list of such handlers.
 *
 * @this {Bus}
 * @param {number} start port address
 * @param {number} end port address
 * @param {Component} component
 * @param {function(number,number)} fn is called with the port and EIP values at the time of the output
 */
Bus.prototype.addPortOutputNotify = function(start, end, component, fn)
{
    if (fn !== undefined) {
        for (var port = start; port <= end; port++) {
            if (this.aPortOutputNotify[port] !== undefined) {
                Component.warning("Output port " + str.toHexWord(port) + " registered by " + this.aPortOutputNotify[port][0].id + ", ignoring " + component.id);
                continue;
            }
            this.aPortOutputNotify[port] = [component, fn, false, false];
            if (MAXDEBUG) this.log("addPortOutputNotify(" + str.toHexWord(port) + "," + component.id + ")");
        }
    }
};

/**
 * addPortOutputTable(component, table, offset)
 *
 * Add port output-notification handlers from the specified table (a batch version of addPortOutputNotify)
 *
 * @this {Bus}
 * @param {Component} component
 * @param {Object} table
 * @param {number} [offset] is an optional port offset
 */
Bus.prototype.addPortOutputTable = function(component, table, offset)
{
    if (offset === undefined) offset = 0;
    for (var port in table) {
        /*
         * JavaScript converts property keys to strings (brilliant), so we use parseInt() to convert them back to numbers.
         */
        port = parseInt(port, 10);
        this.addPortOutputNotify(port + offset, port + offset, component, table[port]);
    }
};

/**
 * checkPortOutputNotify(port, bOut, addrFrom)
 *
 * @this {Bus}
 * @param {number} port
 * @param {number} bOut
 * @param {number} [addrFrom] is the EIP value at the time of the output
 */
Bus.prototype.checkPortOutputNotify = function(port, bOut, addrFrom)
{
    var aNotify = this.aPortOutputNotify[port];
    if (aNotify !== undefined) {
        if (aNotify[1]) {
            aNotify[1].call(aNotify[0], port, bOut, addrFrom);
        }
        if (DEBUGGER && this.dbg && this.fPortOutputBreakAll != aNotify[2]) {
            this.dbg.checkPortOutput(port, bOut);
        }
    }
    else {
        if (DEBUGGER && this.dbg) {
            this.dbg.messageIO(this, port, bOut, addrFrom);
            if (this.fPortOutputBreakAll) this.dbg.checkPortOutput(port, bOut);
        }
    }
};

/**
 * removePortOutputNotify(start, end, component, fn)
 *
 * Remove a port output-notification handler from the list of such handlers (to be ENABLED later if needed)
 *
 * @this {Bus}
 * @param {number} start address
 * @param {number} end address
 * @param {Component} component
 * @param {function(number,number)} fn of previously added handler
 *
Bus.prototype.removePortOutputNotify = function(start, end, component, fn)
 {
    for (var port = start; port < end; port++) {
        if (this.aPortOutputNotify[port] && this.aPortOutputNotify[port][0] == component && this.aPortOutputNotify[port][1] == fn) {
            this.aPortOutputNotify[port] = undefined;
        }
    }
};
 */

/**
 * reportError(op, addr, size)
 *
 * @this {Bus}
 * @param {number} op
 * @param {number} addr
 * @param {number} size
 * @return {boolean} false
 */
Bus.prototype.reportError = function(op, addr, size)
{
    Component.error("Memory block error (" + op + "," + str.toHex(addr) + "," + str.toHex(size) + ")");
    return false;
};

if (typeof APP_PCJS !== 'undefined') APP_PCJS.Bus = Bus;

if (typeof module !== 'undefined') module.exports = Bus;
