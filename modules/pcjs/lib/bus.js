/**
 * @fileoverview Implements the PCjs Bus component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Sep-04
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
 * The Bus component manages physical memory and I/O address spaces.
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
     * While we *could* say that we mask addresses with this.busMask to simulate "A20 wrap", the simple
     * fact is it relieves us from bounds-checking every aMemBlocks index.  Address wrapping at the 1Mb
     * boundary (ie, the A20 address line) is something we'll have to deal with more carefully on the 80286.
     *
     *      New property        Old property        Old hard-coded values (when nBusWidth was always 20)
     *      ------------        ------------        ----------------------------------------------------
     *      this.busLimit       Bus.ADDR.LIMIT      0xfffff
     *      this.busMask        N/A                 N/A
     *      this.blockSize      Bus.BLOCK.SIZE      4096
     *      this.blockLen       Bus.BLOCK.LEN       (this.blockSize >> 2)
     *      this.blockShift     Bus.BLOCK.SHIFT     12
     *      this.blockLimit     Bus.BLOCK.LIMIT     0xfff
     *      this.blockTotal     Bus.BLOCK.TOTAL     ((this.busLimit + this.blockSize) / this.blockSize) | 0
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
    this.busLimit = this.busMask = (1 << this.nBusWidth) - 1;
    this.blockShift = (this.nBusWidth <= 20? 12 : 14);
    this.blockSize = 1 << this.blockShift;
    this.blockLen = this.blockSize >> 2;
    this.blockLimit = this.blockSize - 1;
    this.blockTotal = ((this.busLimit + this.blockSize) / this.blockSize) | 0;
    this.blockMask = this.blockTotal - 1;
    this.assert(this.blockTotal <= Bus.BLOCK.MASK);

    /*
     * Lists of I/O notification functions: aPortInputNotify and aPortOutputNotify are arrays, indexed by
     * port, of sub-arrays which contain:
     *
     *      [0]: registered component
     *      [1]: registered function to call for every I/O access
     *
     * The registered function is called with the port address, and if the access was triggered by the CPU,
     * the linear address (LIP) that the access occurred from.
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
         *      slot:   the slot (+1) in abtObjects which this object currently occupies
         *      refs:   the number of memory references, as recorded by writeBackTrack()
         */
        this.abtObjects = [];
        this.cbtDeletions = 0;
        this.ibtLastAlloc = -1;
        this.ibtLastDelete = 0;
    }

    this.setReady();
}

Component.subclass(Component, Bus);

if (BACKTRACK) {
    /*
     * BackTrack indexes are 31-bit values, where bits 0-8 store an object offset (0-511) and bits 16-30 store
     * an object number (1-32767).  Object number 0 is reserved for dynamic data (ie, data created independent
     * of any source); examples include zero values produced by instructions such as "SUB AX,AX" or "XOR AX,AX".
     * We must special-case instructions like that, because even though AX will almost certainly contain some source
     * data prior to the instruction, the result no longer has any connection to the source.  Similarly, "SBB AX,AX"
     * may produce 0 or -1, depending on carry, but since we don't track the source of individual bits (including the
     * carry flag), AX is now source-less.  TODO: This is an argument for maintaining source info on selected flags,
     * even though it would be rather expensive.
     *
     * The 7 middle bits (9-15) record type and access information, as follows:
     *
     *      bit 15: set to indicate a "data" byte, clear to indicate a "code" byte
     *
     * All bytes start out as "data" bytes; only once they've been executed do they become "code" bytes.  For code
     * bytes, the remaining 6 middle bits (9-14) represent an execution count that starts at 1 (on the byte's initial
     * transition from data to code) and tops out at 63.
     *
     * For data bytes, the remaining middle bits indicate any transformations the data has undergone; eg:
     *
     *      bit 14: ADD/SUB/INC/DEC
     *      bit 13: MUL/DIV
     *      bit 12: OR/AND/XOR/NOT
     *
     * We make no attempt to record the original data or the transformation data, only that the transformation occurred.
     *
     * Other middle bits indicate whether the data was ever read and/or written:
     *
     *      bit 11: READ
     *      bit 10: WRITE
     *
     * Bit 9 is reserved for now.
     */
    Bus.BACKTRACK = {
        SLOT_MAX:       32768,
        SLOT_SHIFT:     16,
        TYPE_DATA:      0x8000,
        TYPE_ADDSUB:    0x4000,
        TYPE_MULDIV:    0x2000,
        TYPE_LOGICAL:   0x1000,
        TYPE_READ:      0x0800,
        TYPE_WRITE:     0x0400,
        TYPE_COUNT_INC: 0x0200,
        TYPE_COUNT_MAX: 0x7E00,
        TYPE_MASK:      0xFE00,
        TYPE_SHIFT:     9,
        OFF_MAX:        512,
        OFF_MASK:       0x1FF
    };
}

/*
 * scanMemory() records block numbers in bits 0-14, a BackTrack "mod" bit in bit 15, and the block type at bit 16.
 */
Bus.BLOCK = {
    MASK:           0x7fff,
    BTMOD_SHIFT:    15,
    TYPE_SHIFT:     16
};

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
    this.cpu.initMemory(this.aMemBlocks, this.blockShift, this.blockLimit, this.blockMask);
    this.cpu.setAddressMask(this.busMask);
};

/**
 * reset()
 *
 * @this {Bus}
 */
Bus.prototype.reset = function()
{
    this.setA20(true);
    if (BACKTRACK) this.ibtLastDelete = 0;
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
 * addMemory(addr, size, type, controller)
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
 * @param {number} size of the length in bytes of the range; must be a multiple of blockSize
 * @param {number} type is one of the Memory.TYPE constants
 * @param {Object} [controller] is an optional memory controller component
 * @return {boolean} true if successful, false if not
 */
Bus.prototype.addMemory = function(addr, size, type, controller)
{
    if (!(addr & this.blockLimit) && size && !(size & this.blockLimit)) {
        var iBlock = addr >> this.blockShift;
        while (size > 0 && iBlock < this.aMemBlocks.length) {
            var block = this.aMemBlocks[iBlock];
            if (block !== undefined && block.size) {
                return this.reportError(1, addr, size);
            }
            addr = iBlock * this.blockSize;
            block = this.aMemBlocks[iBlock++] = new Memory(addr, this.blockSize, type, controller);
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
 * scanMemory(stats, addr, size)
 *
 * Returns a Stats object for the specified address range with the following properties:
 *
 *      cbTotal:    total bytes allocated
 *      cBlocks:    total Memory blocks allocated
 *      aBlocks:    array of allocated Memory block numbers
 *
 * aBlocks is preallocated to its maximum size, so don't rely on its length; at any given moment,
 * only the first cBlocks entries will be valid.
 *
 * @this {Bus}
 * @param {Object} [stats] previous stats, if any
 * @param {number} [addr] starting address of range (0 if none provided)
 * @param {number} [size] size of range, in bytes (up to end of address space if none provided)
 * @return {Object} updated stats (or new stats if no previous stats provided)
 */
Bus.prototype.scanMemory = function(stats, addr, size)
{
    if (addr == null) addr = 0;
    if (size == null) size = (this.busLimit + 1) - addr;
    if (stats == null) stats = {cbTotal: 0, cBlocks: 0, aBlocks: new Array(this.blockTotal)};

    var iBlock = addr >>> this.blockShift;
    var iBlockMax = ((addr + size - 1) >>> this.blockShift);

    stats.cbTotal = 0;
    stats.cBlocks = 0;
    while (iBlock <= iBlockMax) {
        var block = this.aMemBlocks[iBlock];
        stats.cbTotal += block.size;
        if (block.size) {
            var nBlock = iBlock;
            nBlock |= (block.type << Bus.BLOCK.TYPE_SHIFT);
            if (BACKTRACK) {
                var fMod = block.modBackTrack(false);
                if (fMod) nBlock |= (1 << Bus.BLOCK.BTMOD_SHIFT);
            }
            stats.aBlocks[stats.cBlocks++] = nBlock;
        }
        iBlock++;
    }
    return stats;
};

/**
 * getA20()
 *
 * @this {Bus}
 * @return {boolean} true if enabled, false if disabled
 */
Bus.prototype.getA20 = function()
{
    return this.busLimit == this.busMask;
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
            var addrMask = (this.busMask & ~0x100000) | (fEnable? 0x100000 : 0);
            if (addrMask != this.busMask) {
                this.busMask = addrMask;
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
 * The CPU could use this, but the CPU also needs to update BACKTRACK states.  There may also be a slight
 * performance advantage calling its own getByte() method vs. calling through another object (ie, the Bus object).
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} byte (8-bit) value at that address
 */
Bus.prototype.getByte = function(addr)
{
    return this.aMemBlocks[(addr & this.busMask) >> this.blockShift].readByte(addr & this.blockLimit);
};

/**
 * getByteDirect(addr)
 *
 * This is useful for the Debugger and other components that want to bypass getByte() breakpoint detection.
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} byte (8-bit) value at that address
 */
Bus.prototype.getByteDirect = function(addr)
{
    return this.aMemBlocks[(addr & this.busMask) >> this.blockShift].readByteDirect(addr & this.blockLimit);
};

/**
 * getShort(addr)
 *
 * The CPU could use this, but the CPU also needs to update cycle counts, along with BACKTRACK states.
 * There may also be a slight performance advantage calling its own getShort() method vs. calling through another
 * object (ie, the Bus object).
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} word (16-bit) value at that address
 */
Bus.prototype.getShort = function(addr)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.busMask) >> this.blockShift;
    if (off != this.blockLimit) {
        return this.aMemBlocks[iBlock].readShort(off);
    }
    return this.aMemBlocks[iBlock++].readByte(off) | (this.aMemBlocks[iBlock & this.blockMask].readByte(0) << 8);
};

/**
 * getShortDirect(addr)
 *
 * This is useful for the Debugger and other components that want to bypass getShort() breakpoint detection.
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} word (16-bit) value at that address
 */
Bus.prototype.getShortDirect = function(addr)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.busMask) >> this.blockShift;
    if (off != this.blockLimit) {
        return this.aMemBlocks[iBlock].readShortDirect(off);
    }
    return this.aMemBlocks[iBlock++].readByteDirect(off) | (this.aMemBlocks[iBlock & this.blockMask].readByteDirect(0) << 8);
};

/**
 * getLong(addr)
 *
 * The CPU could use this, but the CPU also needs to update cycle counts, along with BACKTRACK states.
 * There may also be a slight performance advantage calling its own getLong() method vs. calling through another
 * object (ie, the Bus object).
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} long (32-bit) value at that address
 */
Bus.prototype.getLong = function(addr)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.busMask) >> this.blockShift;
    if (off < this.blockLimit - 2) {
        return this.aMemBlocks[iBlock].readLong(off);
    }
    var nShift = (off & 0x3) << 3;
    return (this.aMemBlocks[iBlock].readLong(off & ~0x3) >>> nShift) | (this.aMemBlocks[(iBlock + 1) & this.blockMask].readLong(0) << (32 - nShift));
};

/**
 * getLongDirect(addr)
 *
 * This is useful for the Debugger and other components that want to bypass getLong() breakpoint detection.
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @return {number} long (32-bit) value at that address
 */
Bus.prototype.getLongDirect = function(addr)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.busMask) >> this.blockShift;
    if (off < this.blockLimit - 2) {
        return this.aMemBlocks[iBlock].readLongDirect(off);
    }
    var nShift = (off & 0x3) << 3;
    return (this.aMemBlocks[iBlock].readLongDirect(off & ~0x3) >>> nShift) | (this.aMemBlocks[(iBlock + 1) & this.blockMask].readLongDirect(0) << (32 - nShift));
};

/**
 * setByte(addr, b)
 *
 * The CPU could use this, but the CPU also needs to update BACKTRACK states.  There may also be a slight
 * performance advantage calling its own setByte() method vs. calling through another object (ie, the Bus object).
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} b is the byte (8-bit) value to write (we truncate it to 8 bits to be safe)
 */
Bus.prototype.setByte = function(addr, b)
{
    this.aMemBlocks[(addr & this.busMask) >> this.blockShift].writeByte(addr & this.blockLimit, b & 0xff);
};

/**
 * setByteDirect(addr, b)
 *
 * This is useful for the Debugger and other components that want to bypass breakpoint detection AND read-only
 * memory protection (for example, this is an interface the ROM component could use to initialize ROM contents).
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} b is the byte (8-bit) value to write (we truncate it to 8 bits to be safe)
 */
Bus.prototype.setByteDirect = function(addr, b)
{
    this.aMemBlocks[(addr & this.busMask) >> this.blockShift].writeByteDirect(addr & this.blockLimit, b & 0xff);
};

/**
 * setShort(addr, w)
 *
 * The CPU could use this, but the CPU also needs to update cycle counts, along with BACKTRACK states.
 * There may also be a slight performance advantage calling its own setShort() method vs. calling through another
 * object (ie, the Bus object).
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} w is the word (16-bit) value to write (we truncate it to 16 bits to be safe)
 */
Bus.prototype.setShort = function(addr, w)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.busMask) >> this.blockShift;
    if (off != this.blockLimit) {
        this.aMemBlocks[iBlock].writeShort(off, w & 0xffff);
        return;
    }
    this.aMemBlocks[iBlock++].writeByte(off, w & 0xff);
    this.aMemBlocks[iBlock & this.blockMask].writeByte(0, (w >> 8) & 0xff);
};

/**
 * setShortDirect(addr, w)
 *
 * This is useful for the Debugger and other components that want to bypass breakpoint detection AND read-only
 * memory protection (for example, this is an interface the ROM component could use to initialize ROM contents).
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} w is the word (16-bit) value to write (we truncate it to 16 bits to be safe)
 */
Bus.prototype.setShortDirect = function(addr, w)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.busMask) >> this.blockShift;
    if (off != this.blockLimit) {
        this.aMemBlocks[iBlock].writeShortDirect(off, w & 0xffff);
        return;
    }
    this.aMemBlocks[iBlock++].writeByteDirect(off, w & 0xff);
    this.aMemBlocks[iBlock & this.blockMask].writeByteDirect(0, (w >> 8) & 0xff);
};

/**
 * setLong(addr, l)
 *
 * The CPU could use this, but the CPU also needs to update cycle counts, along with BACKTRACK states.
 * There may also be a slight performance advantage calling its own setLong() method vs. calling through another
 * object (ie, the Bus object).
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} l is the long (32-bit) value to write
 */
Bus.prototype.setLong = function(addr, l)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.busMask) >> this.blockShift;
    if (off < this.blockLimit - 2) {
        this.aMemBlocks[iBlock].writeLong(off, l);
        return;
    }
    var lPrev, nShift = (off & 0x3) << 3;
    off &= ~0x3;
    lPrev = this.aMemBlocks[iBlock].readLong(off);
    this.aMemBlocks[iBlock].writeLong(off, (lPrev & ~(0xffffffff << nShift)) | (l << nShift));
    iBlock = (iBlock + 1) & this.blockMask;
    lPrev = this.aMemBlocks[iBlock].readLong(0);
    this.aMemBlocks[iBlock].writeLong(0, (lPrev & (0xffffffff << nShift)) | (l >>> (32 - nShift)));
};

/**
 * setLongDirect(addr, l)
 *
 * This is useful for the Debugger and other components that want to bypass breakpoint detection AND read-only
 * memory protection (for example, this is an interface the ROM component could use to initialize ROM contents).
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} l is the long (32-bit) value to write
 */
Bus.prototype.setLongDirect = function(addr, l)
{
    var off = addr & this.blockLimit;
    var iBlock = (addr & this.busMask) >> this.blockShift;
    if (off < this.blockLimit - 2) {
        this.aMemBlocks[iBlock].writeLongDirect(off, l);
        return;
    }
    var lPrev, nShift = (off & 0x3) << 3;
    off &= ~0x3;
    lPrev = this.aMemBlocks[iBlock].readLongDirect(off);
    this.aMemBlocks[iBlock].writeLongDirect(off, (lPrev & ~(0xffffffff << nShift)) | (l << nShift));
    iBlock = (iBlock + 1) & this.blockMask;
    lPrev = this.aMemBlocks[iBlock].readLongDirect(0);
    this.aMemBlocks[iBlock].writeLongDirect(0, (lPrev & (0xffffffff << nShift)) | (l >>> (32 - nShift)));
};

/**
 * addBackTrackObject(obj, bto, off)
 *
 * If bto is null, then we create bto (ie, an object that wraps obj and records off).
 *
 * If bto is NOT null, then we verify that off is within the given bto's range; if not,
 * then we must create a new bto and return that instead.
 *
 * @this {Bus}
 * @param {Object} obj
 * @param {Object} bto
 * @param {number} off (the offset within obj that this wrapper object is relative to)
 * @return {Object|null}
 */
Bus.prototype.addBackTrackObject = function(obj, bto, off)
{
    if (BACKTRACK && obj) {
        var cbtObjects = this.abtObjects.length;
        if (!bto) {
            /*
             * Try the most recently created bto, on the off-chance it's what the caller needs
             */
            if (this.ibtLastAlloc >= 0) bto = this.abtObjects[this.ibtLastAlloc];
        }
        if (!bto || bto.obj != obj || off < bto.off || off >= bto.off + Bus.BACKTRACK.OFF_MAX) {

            bto = {obj: obj, off: off, slot: 0, refs: 0};

            var slot;
            if (!this.cbtDeletions) {
                slot = cbtObjects;
            } else {
                for (slot = this.ibtLastDelete; slot < cbtObjects; slot++) {
                    var btoTest = this.abtObjects[slot];
                    if (!btoTest || !btoTest.refs && !this.isBackTrackWeak(slot << Bus.BACKTRACK.SLOT_SHIFT)) {
                        this.ibtLastDelete = slot + 1;
                        this.cbtDeletions--;
                        break;
                    }
                }
                /*
                 * There's no longer any guarantee that simply because cbtDeletions was non-zero that there WILL
                 * be an available (existing) slot, because cbtDeletions also counts weak references that may still
                 * be weak.
                 *
                 *      this.assert(slot < cbtObjects);
                 */
            }
            this.assert(slot < Bus.BACKTRACK.SLOT_MAX);
            this.ibtLastAlloc = slot;
            bto.slot = slot + 1;
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
 * getBackTrackIndex(bto, off)
 *
 * @this {Bus}
 * @param {Object|null} bto
 * @param {number} off
 * @return {number}
 */
Bus.prototype.getBackTrackIndex = function(bto, off)
{
    var bti = 0;
    if (BACKTRACK && bto) {
        bti = (bto.slot << Bus.BACKTRACK.SLOT_SHIFT) | Bus.BACKTRACK.TYPE_DATA | (off - bto.off);
    }
    return bti;
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
        var bti = (bto.slot << Bus.BACKTRACK.SLOT_SHIFT) | Bus.BACKTRACK.TYPE_DATA | (off - bto.off);
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
        return this.aMemBlocks[(addr & this.busMask) >> this.blockShift].readBackTrack(addr & this.blockLimit);
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
        var iBlock = (addr & this.busMask) >> this.blockShift;
        var btiPrev = this.aMemBlocks[iBlock].writeBackTrack(addr & this.blockLimit, bti);
        var slotPrev = btiPrev >>> Bus.BACKTRACK.SLOT_SHIFT;
        if (slot != slotPrev) {
            this.aMemBlocks[iBlock].modBackTrack(true);
            if (btiPrev && slotPrev) {
                var btoPrev = this.abtObjects[slotPrev-1];
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
                    /*
                     * We used to just slam a null into the previous slot and consider it gone, but there may still
                     * be "weak references" to that slot (ie, it may still be associated with a register bti).
                     *
                     * The easiest way to handle weak references is to leave the slot allocated, with the object's ref
                     * count sitting at zero, and change addBackTrackObject() to look for both empty slots AND non-empty
                     * slots with a ref count of zero; in the latter case, it should again check for weak references,
                     * after which we can re-use the slot if all its weak references are now gone.
                     */
                    if (!this.isBackTrackWeak(btiPrev)) this.abtObjects[slotPrev-1] = null;
                    /*
                     * TODO: Consider what the appropriate trigger should be for resetting ibtLastDelete to zero;
                     * if we don't OCCASIONALLY set it to zero, we may never clear out obsolete weak references,
                     * whereas if we ALWAYS set it to zero, we may be forcing addBackTrackObject() to scan the entire
                     * table too often.
                     *
                     * I'd prefer to do something like this:
                     *
                     *      if (this.ibtLastDelete > slotPrev-1) this.ibtLastDelete = slotPrev-1;
                     *
                     * or even this:
                     *
                     *      if (this.ibtLastDelete > slotPrev-1) this.ibtLastDelete = 0;
                     *
                     * But neither one of those guarantees that we will at least occasionally scan the entire table.
                     */
                    this.ibtLastDelete = 0;
                    this.cbtDeletions++;
                }
            }
            if (bti && slot) {
                var bto = this.abtObjects[slot-1];
                if (bto) {
                    this.assert(slot == bto.slot);
                    bto.refs++;
                }
            }
        }
    }
};

/**
 * isBackTrackWeak(bti)
 *
 * @param {number} bti
 * @returns {boolean} true if the given bti is still referenced by a register, false if not
 */
Bus.prototype.isBackTrackWeak = function(bti)
{
    var bt = this.cpu.backTrack;
    var slot = bti >> Bus.BACKTRACK.SLOT_SHIFT;
    return (bt.btiAL   >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiAH   >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiBL   >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiBH   >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiCL   >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiCH   >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiDL   >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiDH   >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiBPLo >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiBPHi >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiSILo >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiSIHi >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiDILo >> Bus.BACKTRACK.SLOT_SHIFT == slot ||
            bt.btiDIHi >> Bus.BACKTRACK.SLOT_SHIFT == slot
    );
};

/**
 * updateBackTrackCode(addr, bti)
 *
 * @this {Bus}
 * @param {number} addr is a physical (non-segmented) address
 * @param {number} bti
 */
Bus.prototype.updateBackTrackCode = function(addr, bti)
{
    if (BACKTRACK) {
        if (bti & Bus.BACKTRACK.TYPE_DATA) {
            bti = (bti & ~Bus.BACKTRACK.TYPE_MASK) | Bus.BACKTRACK.TYPE_COUNT_INC;
        } else if ((bti & Bus.BACKTRACK.TYPE_MASK) < Bus.BACKTRACK.TYPE_COUNT_MAX) {
            bti += Bus.BACKTRACK.TYPE_COUNT_INC;
        } else {
            return;
        }
        this.aMemBlocks[(addr & this.busMask) >> this.blockShift].writeBackTrack(addr & this.blockLimit, bti);
    }
};

/**
 * getBackTrackObject(bti)
 *
 * @this {Bus}
 * @param {number} bti
 * @return {Object|null}
 */
Bus.prototype.getBackTrackObject = function(bti)
{
    if (BACKTRACK) {
        var slot = bti >>> Bus.BACKTRACK.SLOT_SHIFT;
        if (slot) {
            var bto = this.abtObjects[slot-1];
            if (bto) return bto.obj;
        }
    }
    return null;
};

/**
 * getBackTrackObjectFromAddr(addr)
 *
 * @this {Bus}
 * @param {number} addr
 * @return {Object|null}
 */
Bus.prototype.getBackTrackObjectFromAddr = function(addr)
{
    return BACKTRACK? this.getBackTrackObject(this.readBackTrack(addr)) : null;
};

/**
 * getBackTrackInfo(bti)
 *
 * @this {Bus}
 * @param {number} bti
 * @return {string|null}
 */
Bus.prototype.getBackTrackInfo = function(bti)
{
    if (BACKTRACK) {
        var bto = this.getBackTrackObject(bti);
        if (bto) {
            var off = bti & Bus.BACKTRACK.OFF_MASK;
            var file = bto.obj.file;
            if (file) {
                this.assert(!bto.off);
                return file.sName + '[' + (bto.obj.offFile + off) + ']';
            }
            return bto.obj.idComponent + '[' + (bto.off + off) + ']';
        }
    }
    return null;
};

/**
 * getBackTrackInfoFromAddr(addr)
 *
 * @this {Bus}
 * @param {number} addr
 * @return {string|null}
 */
Bus.prototype.getBackTrackInfoFromAddr = function(addr)
{
    return BACKTRACK? this.getBackTrackInfo(this.readBackTrack(addr)) : null;
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
 * like the type, the memory controller (if any), and the active memory access functions,
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
 * addMemBreak(addr, fWrite)
 *
 * @this {Bus}
 * @param {number} addr
 * @param {boolean} fWrite is true for a memory write breakpoint, false for a memory read breakpoint
 */
Bus.prototype.addMemBreak = function(addr, fWrite)
{
    if (DEBUGGER) {
        var iBlock = addr >> this.blockShift;
        this.aMemBlocks[iBlock].addBreakpoint(addr & this.blockLimit, fWrite);
    }
};

/**
 * removeMemBreak(addr, fWrite)
 *
 * @this {Bus}
 * @param {number} addr
 * @param {boolean} fWrite is true for a memory write breakpoint, false for a memory read breakpoint
 */
Bus.prototype.removeMemBreak = function(addr, fWrite)
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
 * @param {function(number,number)} fn is called with the port and LIP values at the time of the input
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
 * @param {number} [addrFrom] is the LIP value at the time of the input
 * @return {number} simulated port value (0xff if none)
 *
 * NOTE: It seems that at least parts of the ROM BIOS (like the RS-232 probes around F000:E5D7 in the 5150 BIOS)
 * assume that ports for non-existent hardware return 0xff rather than 0x00, hence my new default (0xff) below.
 */
Bus.prototype.checkPortInputNotify = function(port, addrFrom)
{
    var bIn = 0xff;
    var aNotify = this.aPortInputNotify[port];

    if (BACKTRACK) {
        this.cpu.backTrack.btiIO = 0;
    }
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
 * @param {function(number,number)} fn is called with the port and LIP values at the time of the output
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
 * @param {number} [addrFrom] is the LIP value at the time of the output
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
