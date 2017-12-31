/**
 * @fileoverview Implements the PCx86 "physical" Memory component.
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

if (NODE) {
    var Str         = require("../../shared/lib/strlib");
    var Component   = require("../../shared/lib/component");
    var Messages    = require("./messages");
    var X86         = require("./x86");
}

/**
 * @class DataView
 * @property {function(number,boolean):number} getUint8
 * @property {function(number,number,boolean)} setUint8
 * @property {function(number,boolean):number} getUint16
 * @property {function(number,number,boolean)} setUint16
 * @property {function(number,boolean):number} getInt32
 * @property {function(number,number,boolean)} setInt32
 */

var littleEndian = (TYPEDARRAYS? (function() {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setUint16(0, 256, true);
    return new Uint16Array(buffer)[0] === 256;
})() : false);

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class Memory {
    /**
     * Memory(addr, used, size, type, controller)
     *
     * The Bus component allocates Memory objects so that each has a memory buffer with a
     * block-granular starting address and an address range equal to bus.nBlockSize; however,
     * the size of any given Memory object's underlying buffer can be either zero or bus.nBlockSize;
     * memory read/write functions for empty (buffer-less) blocks are mapped to readNone/writeNone.
     *
     * The Bus allocates empty blocks for the entire address space during initialization, so that
     * any reads/writes to undefined addresses will have no effect.  Later, the ROM and RAM
     * components will ask the Bus to allocate memory for specific ranges, and the Bus will allocate
     * as many new blockSize Memory objects as the ranges require.  Partial Memory blocks could
     * also be supported in theory, but in practice, they're not.
     *
     * Because Memory blocks now allow us to have a "sparse" address space, we could choose to
     * take the memory hit of allocating 4K arrays per block, where each element stores only one byte,
     * instead of the more frugal but slightly slower approach of allocating arrays of 32-bit dwords
     * (LONGARRAYS) and shifting/masking bytes/words to/from dwords; in theory, byte accesses would
     * be faster and word accesses somewhat less faster.
     *
     * However, preliminary testing of that feature (BYTEARRAYS) did not yield significantly faster
     * performance, so it is OFF by default to minimize our memory consumption.  Using TYPEDARRAYS
     * would seem best, but as discussed in defines.js, it's off by default, because it doesn't perform
     * as well as LONGARRAYS; the other advantage of TYPEDARRAYS is that it should theoretically use
     * about 1/2 the memory of LONGARRAYS (32-bit elements vs 64-bit numbers), but I value speed over
     * size at this point.  Also, not all JavaScript implementations support TYPEDARRAYS (IE9 is probably
     * the only real outlier: it lacks typed arrays but otherwise has all the necessary HTML5 support).
     *
     * WARNING: Since Memory blocks are low-level objects that have no UI requirements, they
     * do not inherit from the Component class, so if you want to use any Component class methods,
     * such as Component.assert(), use the corresponding Debugger methods instead (assuming a debugger
     * is available).
     *
     * @this {Memory}
     * @param {number|null} [addr] of lowest used address in block
     * @param {number} [used] portion of block in bytes (0 for none); must be a multiple of 4
     * @param {number} [size] of block's buffer in bytes (0 for none); must be a multiple of 4
     * @param {number} [type] is one of the Memory.TYPE constants (default is Memory.TYPE.NONE)
     * @param {Controller} [controller] is an optional memory controller component
     * @param {X86CPU} [cpu] is required for UNPAGED memory blocks, so that the CPU can map it to a PAGED block
     */
    constructor(addr, used, size, type, controller, cpu)
    {
        var i;
        this.id = (Memory.idBlock += 2);
        this.adw = null;
        this.offset = 0;
        this.addr = addr;
        this.used = used;
        this.size = size || 0;
        this.type = type || Memory.TYPE.NONE;
        this.fReadOnly = (type == Memory.TYPE.ROM);
        this.controller = null;
        this.cpu = cpu;             // if a CPU reference is provided, then this must be an UNPAGED Memory block allocation
        this.copyBreakpoints();     // initialize the block's Debugger info (eg, breakpoint totals); the caller will reinitialize

        /*
         * TODO: Study the impact of dirty block tracking.  As noted in the paged block handlers (eg, writeBytePLE),
         * the original purposes were to allow saveMemory() to save only dirty blocks, and to enable the Video component
         * to quickly detect changes to the video buffer.  But the benefit to saveMemory() is minimal, and the Video
         * component has other options; for example, it now uses a custom memory controller for all EGA/VGA video modes,
         * which performs its own dirty block tracking, and that could easily be extended to the older MDA/CGA video modes,
         * which still use conventional memory blocks.  Alternatively, we could restrict the use of dirty block tracking
         * to certain memory types (eg, VIDEO memory).
         *
         * However, a quick test with dirty block tracking disabled didn't yield a noticeable improvement in performance,
         * so I think the overhead of our block-based architecture is swamping the impact of these micro-updates.
         */
        this.fDirty = this.fDirtyEver = false;

        if (BACKTRACK) {
            if (!size || controller) {
                this.fModBackTrack = false;
                this.readBackTrack = this.readBackTrackNone;
                this.writeBackTrack = this.writeBackTrackNone;
                this.modBackTrack = this.modBackTrackNone;
            } else {
                this.fModBackTrack = true;
                this.readBackTrack = this.readBackTrackIndex;
                this.writeBackTrack = this.writeBackTrackIndex;
                this.modBackTrack = this.modBackTrackIndex;
                this.abtIndexes = new Array(size);
                for (i = 0; i < size; i++) this.abtIndexes[i] = 0;
            }
        }

        /*
         * For empty memory blocks, all we need to do is ensure all access functions
         * are mapped to "none" handlers (or "unpaged" handlers if paging is enabled).
         */
        if (!size) {
            this.setAccess();
            return;
        }

        /*
         * When a controller is specified, the controller must provide a buffer,
         * via getMemoryBuffer(), and memory access functions, via getMemoryAccess().
         */
        if (controller) {
            this.controller = controller;
            var a = controller.getMemoryBuffer(addr|0);
            this.adw = a[0];
            this.offset = a[1];
            this.setAccess(controller.getMemoryAccess());
            return;
        }

        /*
         * This is the normal case: allocate a buffer that provides 8 bits of data per address;
         * no controller is required because our default memory access functions (see afnMemory)
         * know how to deal with this simple 1-1 mapping of addresses to bytes and words.
         *
         * TODO: Consider initializing the memory array to random (or pseudo-random) values in DEBUG
         * mode; pseudo-random might be best, to help make any bugs reproducible.
         */
        if (TYPEDARRAYS) {
            this.buffer = new ArrayBuffer(size);
            this.dv = new DataView(this.buffer, 0, size);
            /*
             * If littleEndian is true, we can use ab[], aw[] and adw[] directly; well, we can use them
             * whenever the offset is a multiple of 1, 2 or 4, respectively.  Otherwise, we must fallback to
             * dv.getUint8()/dv.setUint8(), dv.getUint16()/dv.setUint16() and dv.getInt32()/dv.setInt32().
             */
            this.ab = new Uint8Array(this.buffer, 0, size);
            this.aw = new Uint16Array(this.buffer, 0, size >> 1);
            this.adw = new Int32Array(this.buffer, 0, size >> 2);
            this.setAccess(littleEndian? Memory.afnArrayLE : Memory.afnArrayBE);
        } else {
            if (BYTEARRAYS) {
                this.ab = new Array(size);
            } else {
                /*
                 * NOTE: This is the default mode of operation (!TYPEDARRAYS && !BYTEARRAYS), because it
                 * seems to provide the best performance; and although in theory, that performance might
                 * come at twice the overhead of TYPEDARRAYS, it's increasingly likely that the JavaScript
                 * runtime will notice that all we ever store are 32-bit values, and optimize accordingly.
                 */
                this.adw = new Array(size >> 2);
                for (i = 0; i < this.adw.length; i++) this.adw[i] = 0;
            }
            this.setAccess(Memory.afnMemory);
        }
    }

    /**
     * init(addr)
     *
     * Quick reinitializer when reusing a Memory block.
     *
     * @this {Memory}
     * @param {number} addr
     */
    init(addr)
    {
        this.addr = addr;
    }

    /**
     * clone(mem, type)
     *
     * Converts the current Memory block (this) into a clone of the given Memory block (mem),
     * and optionally overrides the current block's type with the specified type.
     *
     * @this {Memory}
     * @param {Memory} mem
     * @param {number} [type]
     * @param {DebuggerX86} [dbg]
     */
    clone(mem, type, dbg)
    {
        /*
         * Original memory block IDs are even; cloned memory block IDs are odd;
         * the original ID of the current block is lost, but that's OK, since it was presumably
         * produced merely to become a clone.
         */
        this.id = mem.id | 0x1;
        this.used = mem.used;
        this.size = mem.size;
        if (type) {
            this.type = type;
            this.fReadOnly = (type == Memory.TYPE.ROM);
        }
        if (TYPEDARRAYS) {
            this.buffer = mem.buffer;
            this.dv = mem.dv;
            this.ab = mem.ab;
            this.aw = mem.aw;
            this.adw = mem.adw;
            this.setAccess(littleEndian? Memory.afnArrayLE : Memory.afnArrayBE);
        } else {
            if (BYTEARRAYS) {
                this.ab = mem.ab;
            } else {
                this.adw = mem.adw;
            }
            this.setAccess(Memory.afnMemory);
        }
        this.copyBreakpoints(dbg, mem);
    }

    /**
     * save()
     *
     * This gets the contents of a Memory block as an array of 32-bit values; used by Bus.saveMemory(),
     * which in turn is called by X86CPU.save().
     *
     * Memory blocks with custom memory controllers do NOT save their contents; that's the responsibility
     * of the controller component.
     *
     * @this {Memory}
     * @return {Array|Int32Array|null}
     */
    save()
    {
        var adw, i;
        if (this.controller) {
            adw = null;
        }
        else if (BYTEARRAYS) {
            adw = new Array(this.size >> 2);
            var off = 0;
            for (i = 0; i < adw.length; i++) {
                adw[i] = this.ab[off] | (this.ab[off + 1] << 8) | (this.ab[off + 2] << 16) | (this.ab[off + 3] << 24);
                off += 4;
            }
        }
        else if (TYPEDARRAYS) {
            /*
             * It might be tempting to just return a copy of Int32Array(this.buffer, 0, this.size >> 2),
             * but we can't be sure of the "endianness" of an Int32Array -- which would be OK if the array
             * was always saved/restored on the same machine, but there's no guarantee of that, either.
             * So we use getInt32() and require little-endian values.
             *
             * Moreover, an Int32Array isn't treated by JSON.stringify() and JSON.parse() exactly like
             * a normal array; it's serialized as an Object rather than an Array, so it lacks a "length"
             * property and causes problems for State.store() and State.parse().
             */
            adw = new Array(this.size >> 2);
            for (i = 0; i < adw.length; i++) {
                adw[i] = this.dv.getInt32(i << 2, true);
            }
        }
        else {
            adw = this.adw;
        }
        return adw;
    }

    /**
     * restore(adw)
     *
     * This restores the contents of a Memory block from an array of 32-bit values;
     * used by Bus.restoreMemory(), which is called by X86CPU.restore(), after all other
     * components have been restored and thus all Memory blocks have been allocated
     * by their respective components.
     *
     * @this {Memory}
     * @param {Array|null} adw
     * @return {boolean} true if successful, false if block size mismatch
     */
    restore(adw)
    {
        if (this.controller) {
            return (adw == null);
        }
        /*
         * At this point, it's a consistency error for adw to be null; it's happened once already,
         * when there was a restore bug in the Video component that added the frame buffer at the video
         * card's "spec'ed" address instead of the programmed address, so there were no controller-owned
         * memory blocks installed at the programmed address, and so we arrived here at a block with
         * no controller AND no data.
         */
        Component.assert(adw != null);

        if (adw && this.size == adw.length << 2) {
            var i;
            if (BYTEARRAYS) {
                var off = 0;
                for (i = 0; i < adw.length; i++) {
                    this.ab[off] = adw[i] & 0xff;
                    this.ab[off + 1] = (adw[i] >> 8) & 0xff;
                    this.ab[off + 2] = (adw[i] >> 16) & 0xff;
                    this.ab[off + 3] = (adw[i] >> 24) & 0xff;
                    off += 4;
                }
            } else if (TYPEDARRAYS) {
                for (i = 0; i < adw.length; i++) {
                    this.dv.setInt32(i << 2, adw[i], true);
                }
            } else {
                this.adw = adw;
            }
            this.fDirty = true;
            return true;
        }
        return false;
    }

    /**
     * setAccess(afn, fDirect)
     *
     * The afn parameter should be a 6-entry function table containing two byte handlers, two
     * short handlers, and two long handlers.  See the static afnMemory table for an example.
     *
     * If no function table is specified, a default is selected based on the Memory type;
     * similarly, any undefined entries in the table are filled with default handlers that fall
     * back to the byte handlers, and if one or both byte handlers are undefined, they default
     * to handlers that simply ignore the access.
     *
     * fDirect indicates that both the default AND the direct handlers should be updated.  Direct
     * handlers normally match the default handlers, except when "checked" handlers are installed;
     * this allows "checked" handlers to know where to dispatch the call after performing checks.
     * Examples of checks are read/write breakpoints, but it's really up to the Debugger to decide
     * what the check consists of.
     *
     * @this {Memory}
     * @param {Array.<function()>} [afn] function table
     * @param {boolean} [fDirect] (true to update direct access functions as well; default is true)
     */
    setAccess(afn, fDirect)
    {
        if (!afn) {
            if (this.type == Memory.TYPE.UNPAGED) {
                afn = Memory.afnUnpaged;
            }
            else if (this.type == Memory.TYPE.PAGED) {
                afn = Memory.afnPaged;
            } else {
                Component.assert(this.type == Memory.TYPE.NONE);
                afn = Memory.afnNone;
            }
        }
        this.setReadAccess(afn, fDirect);
        this.setWriteAccess(afn, fDirect);
    }

    /**
     * setReadAccess(afn, fDirect)
     *
     * @this {Memory}
     * @param {Array.<function()>} afn
     * @param {boolean} [fDirect]
     */
    setReadAccess(afn, fDirect)
    {
        if (!fDirect || !this.cReadBreakpoints) {
            this.readByte = afn[0] || this.readNone;
            this.readShort = afn[2] || this.readShortDefault;
            this.readLong = afn[4] || this.readLongDefault;
        }
        if (fDirect || fDirect === undefined) {
            this.readByteDirect = afn[0] || this.readNone;
            this.readShortDirect = afn[2] || this.readShortDefault;
            this.readLongDirect = afn[4] || this.readLongDefault;
        }
    }

    /**
     * setWriteAccess(afn, fDirect)
     *
     * @this {Memory}
     * @param {Array.<function()>} afn
     * @param {boolean} [fDirect]
     */
    setWriteAccess(afn, fDirect)
    {
        if (!fDirect || !this.cWriteBreakpoints) {
            this.writeByte = !this.fReadOnly && afn[1] || this.writeNone;
            this.writeShort = !this.fReadOnly && afn[3] || this.writeShortDefault;
            this.writeLong = !this.fReadOnly && afn[5] || this.writeLongDefault;
        }
        if (fDirect || fDirect === undefined) {
            this.writeByteDirect = afn[1] || this.writeNone;
            this.writeShortDirect = afn[3] || this.writeShortDefault;
            this.writeLongDirect = afn[5] || this.writeLongDefault;
        }
    }

    /**
     * resetReadAccess()
     *
     * @this {Memory}
     */
    resetReadAccess()
    {
        this.readByte = this.readByteDirect;
        this.readShort = this.readShortDirect;
        this.readLong = this.readLongDirect;
    }

    /**
     * resetWriteAccess()
     *
     * @this {Memory}
     */
    resetWriteAccess()
    {
        this.writeByte = this.fReadOnly? this.writeNone : this.writeByteDirect;
        this.writeShort = this.fReadOnly? this.writeShortDefault : this.writeShortDirect;
        this.writeLong = this.fReadOnly? this.writeLongDefault : this.writeLongDirect;
    }

    /**
     * getPageBlock(addr, fWrite)
     *
     * Called for UNPAGED Memory blocks only.
     *
     * @this {Memory}
     * @param {number} addr
     * @param {boolean} fWrite (true if called for a write, false if for a read)
     * @return {Memory}
     */
    getPageBlock(addr, fWrite)
    {
        /*
         * Even when mapPageBlock() fails (ie, when the page is not present or has insufficient privileges), it
         * will trigger a fault (since we don't set fSuppress), but it will still return a block (ie, an empty block).
         */
        return this.cpu.mapPageBlock(addr, fWrite);
    }

    /**
     * setPhysBlock(blockPhys, blockPDE, offPDE, blockPTE, offPTE)
     *
     * @this {Memory}
     * @param {Memory} blockPhys
     * @param {Memory} blockPDE
     * @param {number} offPDE
     * @param {Memory} blockPTE
     * @param {number} offPTE
     */
    setPhysBlock(blockPhys, blockPDE, offPDE, blockPTE, offPTE)
    {
        this.blockPhys = blockPhys;
        this.blockPDE = blockPDE;
        this.iPDE = offPDE >> 2;    // convert offPDE into iPDE (an adw index)
        this.blockPTE = blockPTE;
        this.iPTE = offPTE >> 2;    // convert offPTE into iPTE (an adw index)
        /*
         * This is an optimization for "normal" pages, installing paged memory handlers that mimic
         * normal memory but also know how to update page tables.  If any of the criteria are not met
         * for these special handlers, we fall back to the slower default "paged" memory handlers.
         */
        if (TYPEDARRAYS && littleEndian && blockPhys.adw && !blockPhys.controller && !blockPhys.cReadBreakpoints && !blockPhys.cWriteBreakpoints) {
            this.ab = blockPhys.ab;
            this.aw = blockPhys.aw;
            this.adw = blockPhys.adw;
            this.setAccess(Memory.afnPagedLE);
        } else {
            this.bitPTEAccessed = blockPhys? Memory.adjustEndian(X86.PTE.ACCESSED) : 0;
            this.bitPTEDirty = blockPhys? Memory.adjustEndian(X86.PTE.ACCESSED | X86.PTE.DIRTY) : 0;
            this.setAccess(Memory.afnPaged);
        }
    }

    /**
     * printAddr(sMessage)
     *
     * @this {Memory}
     * @param {string} sMessage
     */
    printAddr(sMessage)
    {
        if (DEBUG && this.dbg && this.dbg.messageEnabled(Messages.MEM)) {
            this.dbg.printMessage(sMessage + ' ' + (this.addr != null? ('%' + Str.toHex(this.addr)) : '#' + this.id), true);
        }
    }

    /**
     * addBreakpoint(off, fWrite, cpu)
     *
     * NOTE: Some Memory blocks already require access to the CPU (eg, UNPAGED blocks that need to call cpu.mapPageBlock()),
     * while others require access only if the CPU has set a read or write breakpoint in one of its Debug registers; the latter
     * case is handled here by virtue of the CPU parameter.
     *
     * @this {Memory}
     * @param {number} off
     * @param {boolean} fWrite
     * @param {X86CPU} [cpu] (required for breakpoints set by the CPU, as opposed to the Debugger)
     */
    addBreakpoint(off, fWrite, cpu)
    {
        if (!fWrite) {
            if (this.cReadBreakpoints++ === 0) {
                if (cpu) this.cpu = cpu;
                this.setReadAccess(Memory.afnChecked, false);
            }
            if (DEBUG) this.printAddr("read breakpoint added to memory block");
        }
        else {
            if (this.cWriteBreakpoints++ === 0) {
                if (cpu) this.cpu = cpu;
                this.setWriteAccess(Memory.afnChecked, false);
            }
            if (DEBUG) this.printAddr("write breakpoint added to memory block");
        }
    }

    /**
     * removeBreakpoint(off, fWrite)
     *
     * NOTE: If this Memory block is not an UNPAGED block that might need to call cpu.mapPageBlock()), and it no
     * longer has any read or write breakpoints associated with it, then it no longer needs a CPU reference.  The
     * existence of a CPU reference only impacts the performance of the "checked" memory access functions, so it's
     * not critical to eliminate it.
     *
     * TODO: Another option would be to count CPU references separately from Debugger references, so that when
     * the former goes to zero, we can unconditionally remove the CPU reference; UNPAGED blocks would automatically
     * increment that reference count, so their CPU reference would never go away.
     *
     * @this {Memory}
     * @param {number} off
     * @param {boolean} fWrite
     */
    removeBreakpoint(off, fWrite)
    {
        if (!fWrite) {
            if (--this.cReadBreakpoints === 0) {
                this.resetReadAccess();
                if (DEBUG) this.printAddr("all read breakpoints removed from memory block");
            }
            Component.assert(this.cReadBreakpoints >= 0);
        }
        else {
            if (--this.cWriteBreakpoints === 0) {
                this.resetWriteAccess();
                if (DEBUG) this.printAddr("all write breakpoints removed from memory block");
            }
            Component.assert(this.cWriteBreakpoints >= 0);
        }
    }

    /**
     * copyBreakpoints(dbg, mem)
     *
     * @this {Memory}
     * @param {DebuggerX86} [dbg]
     * @param {Memory} [mem] (outgoing Memory block to copy breakpoints from, if any)
     */
    copyBreakpoints(dbg, mem)
    {
        this.dbg = dbg;
        this.cReadBreakpoints = this.cWriteBreakpoints = 0;
        if (mem) {
            if (mem.cpu) this.cpu = mem.cpu;
            if ((this.cReadBreakpoints = mem.cReadBreakpoints)) {
                this.setReadAccess(Memory.afnChecked, false);
            }
            if ((this.cWriteBreakpoints = mem.cWriteBreakpoints)) {
                this.setWriteAccess(Memory.afnChecked, false);
            }
        }
    }

    /**
     * readNone(off)
     *
     * Previously, this always returned 0x00, but the initial memory probe by the COMPAQ DeskPro 386 ROM BIOS
     * writes 0x0000 to the first word of every 64Kb block in the nearly 16Mb address space it supports, and
     * if it reads back 0x0000, it will initially think that LOTS of RAM exists, only to be disappointed later
     * when it performs a more exhaustive memory test, generating unwanted error messages in the process.
     *
     * TODO: Determine if we should have separate readByteNone(), readShortNone() and readLongNone() functions
     * to return 0xff, 0xffff and 0xffffffff|0, respectively.  This seems sufficient for now, as it seems unlikely
     * that a system would require nonexistent memory locations to return ALL bits set.
     *
     * Also, I'm reluctant to address that potential issue by simply returning -1, because to date, the above
     * Memory interfaces have always returned values that are properly masked to 8, 16 or 32 bits, respectively.
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readNone(off, addr)
    {
        if (DEBUGGER && this.dbg && this.dbg.messageEnabled(Messages.CPU | Messages.MEM) /* && !off */) {
            this.dbg.message("attempt to read invalid block %" + Str.toHex(addr), true);
        }
        return 0xff;
    }

    /**
     * writeNone(off, v, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} v (could be either a byte or word value, since we use the same handler for both kinds of accesses)
     * @param {number} addr
     */
    writeNone(off, v, addr)
    {
        if (DEBUGGER && this.dbg && this.dbg.messageEnabled(Messages.CPU | Messages.MEM) /* && !off */) {
            this.dbg.message("attempt to write " + Str.toHexWord(v) + " to invalid block %" + Str.toHex(addr), true);
        }
    }

    /**
     * readShortDefault(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortDefault(off, addr)
    {
        return this.readByte(off++, addr++) | (this.readByte(off, addr) << 8);
    }

    /**
     * readLongDefault(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongDefault(off, addr)
    {
        return this.readByte(off++, addr++) | (this.readByte(off++, addr++) << 8) | (this.readByte(off++, addr++) << 16) | (this.readByte(off, addr) << 24);
    }

    /**
     * writeShortDefault(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeShortDefault(off, w, addr)
    {
        this.writeByte(off++, w & 0xff, addr++);
        this.writeByte(off, w >> 8, addr);
    }

    /**
     * writeLongDefault(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeLongDefault(off, w, addr)
    {
        this.writeByte(off++, w & 0xff, addr++);
        this.writeByte(off++, (w >> 8) & 0xff, addr++);
        this.writeByte(off++, (w >> 16) & 0xff, addr++);
        this.writeByte(off, (w >>> 24), addr);
    }

    /**
     * readByteMemory(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteMemory(off, addr)
    {
        if (BYTEARRAYS) {
            return this.ab[off];
        }
        return ((this.adw[off >> 2] >>> ((off & 0x3) << 3)) & 0xff);
    }

    /**
     * readShortMemory(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortMemory(off, addr)
    {
        if (BYTEARRAYS) {
            return this.ab[off] | (this.ab[off + 1] << 8);
        }
        var w;
        var idw = off >> 2;
        var nShift = (off & 0x3) << 3;
        var dw = (this.adw[idw] >> nShift);
        if (nShift < 24) {
            w = dw & 0xffff;
        } else {
            w = (dw & 0xff) | ((this.adw[idw + 1] & 0xff) << 8);
        }
        return w;
    }

    /**
     * readLongMemory(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongMemory(off, addr)
    {
        if (BYTEARRAYS) {
            return this.ab[off] | (this.ab[off + 1] << 8) | (this.ab[off + 2] << 16) | (this.ab[off + 3] << 24);
        }
        var idw = off >> 2;
        var nShift = (off & 0x3) << 3;
        var l = this.adw[idw];
        if (nShift) {
            l >>>= nShift;
            l |= this.adw[idw + 1] << (32 - nShift);
        }
        return l;
    }

    /**
     * writeByteMemory(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     * @param {number} addr
     */
    writeByteMemory(off, b, addr)
    {
        if (BYTEARRAYS) {
            this.ab[off] = b;
        } else {
            var idw = off >> 2;
            var nShift = (off & 0x3) << 3;
            this.adw[idw] = (this.adw[idw] & ~(0xff << nShift)) | (b << nShift);
        }
        this.fDirty = true;
    }

    /**
     * writeShortMemory(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeShortMemory(off, w, addr)
    {
        if (BYTEARRAYS) {
            this.ab[off] = (w & 0xff);
            this.ab[off + 1] = (w >> 8);
        } else {
            var idw = off >> 2;
            var nShift = (off & 0x3) << 3;
            if (nShift < 24) {
                this.adw[idw] = (this.adw[idw] & ~(0xffff << nShift)) | (w << nShift);
            } else {
                this.adw[idw] = (this.adw[idw] & 0x00ffffff) | (w << 24);
                idw++;
                this.adw[idw] = (this.adw[idw] & (0xffffff00|0)) | (w >> 8);
            }
        }
        this.fDirty = true;
    }

    /**
     * writeLongMemory(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongMemory(off, l, addr)
    {
        if (BYTEARRAYS) {
            this.ab[off] = (l & 0xff);
            this.ab[off + 1] = (l >> 8) & 0xff;
            this.ab[off + 2] = (l >> 16) & 0xff;
            this.ab[off + 3] = (l >> 24) & 0xff;
        } else {
            var idw = off >> 2;
            var nShift = (off & 0x3) << 3;
            if (!nShift) {
                this.adw[idw] = l;
            } else {
                var mask = (0xffffffff|0) << nShift;
                this.adw[idw] = (this.adw[idw] & ~mask) | (l << nShift);
                idw++;
                this.adw[idw] = (this.adw[idw] & mask) | (l >>> (32 - nShift));
            }
        }
        this.fDirty = true;
    }

    /**
     * readByteChecked(off, addr)
     *
     * NOTE: When we're called in the context of a PAGED block (eg, with one or more DEBUGGER breakpoints set),
     * the checkMemory functions need "this.addr + off" rather than "addr", because the former will be the physical
     * address rather than the linear address.
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteChecked(off, addr)
    {
        if (!DEBUGGER || !this.dbg || this.addr == null || !this.dbg.checkMemoryRead(this.addr + off)) {
            if (I386 && this.cpu) this.cpu.checkMemoryException(addr, 1, false);
        }
        return this.readByteDirect(off, addr);
    }

    /**
     * readShortChecked(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortChecked(off, addr)
    {
        if (!DEBUGGER || !this.dbg || this.addr == null || !this.dbg.checkMemoryRead(this.addr + off, 2)) {
            if (I386 && this.cpu) this.cpu.checkMemoryException(addr, 2, false);
        }
        return this.readShortDirect(off, addr);
    }

    /**
     * readLongChecked(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongChecked(off, addr)
    {
        if (!DEBUGGER || !this.dbg || this.addr == null || !this.dbg.checkMemoryRead(this.addr + off, 4)) {
            if (I386 && this.cpu) this.cpu.checkMemoryException(addr, 4, false);
        }
        return this.readLongDirect(off, addr);
    }

    /**
     * writeByteChecked(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} b
     */
    writeByteChecked(off, b, addr)
    {
        if (!DEBUGGER || !this.dbg || this.addr == null || !this.dbg.checkMemoryWrite(this.addr + off)) {
            if (I386 && this.cpu) this.cpu.checkMemoryException(addr, 1, true);
        }
        if (this.fReadOnly) this.writeNone(off, b, addr); else this.writeByteDirect(off, b, addr);
    }

    /**
     * writeShortChecked(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} w
     */
    writeShortChecked(off, w, addr)
    {
        if (!DEBUGGER || !this.dbg || this.addr == null || !this.dbg.checkMemoryWrite(this.addr + off, 2)) {
            if (I386 && this.cpu) this.cpu.checkMemoryException(addr, 2, true);
        }
        if (this.fReadOnly) this.writeNone(off, w, addr); else this.writeShortDirect(off, w, addr);
    }

    /**
     * writeLongChecked(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongChecked(off, l, addr)
    {
        if (!DEBUGGER || !this.dbg || this.addr == null || !this.dbg.checkMemoryWrite(this.addr + off, 4)) {
            if (I386 && this.cpu) this.cpu.checkMemoryException(addr, 4, true);
        }
        if (this.fReadOnly) this.writeNone(off, l, addr); else this.writeLongDirect(off, l, addr);
    }

    /**
     * readBytePaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readBytePaged(off, addr)
    {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEAccessed;
        return this.blockPhys.readByte(off, addr);
    }

    /**
     * readShortPaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortPaged(off, addr)
    {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEAccessed;
        return this.blockPhys.readShort(off, addr);
    }

    /**
     * readLongPaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongPaged(off, addr)
    {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEAccessed;
        return this.blockPhys.readLong(off, addr);
    }

    /**
     * writeBytePaged(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     * @param {number} addr
     */
    writeBytePaged(off, b, addr)
    {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEDirty;
        this.blockPhys.writeByte(off, b, addr);
    }

    /**
     * writeShortPaged(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeShortPaged(off, w, addr)
    {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEDirty;
        this.blockPhys.writeShort(off, w, addr);
    }

    /**
     * writeLongPaged(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongPaged(off, l, addr)
    {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEDirty;
        this.blockPhys.writeLong(off, l, addr);
    }

    /**
     * readByteUnpaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteUnpaged(off, addr)
    {
        return this.getPageBlock(addr, false).readByte(off, addr);
    }

    /**
     * readShortUnpaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortUnpaged(off, addr)
    {
        return this.getPageBlock(addr, false).readShort(off, addr);
    }

    /**
     * readLongUnpaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongUnpaged(off, addr)
    {
        return this.getPageBlock(addr, false).readLong(off, addr);
    }

    /**
     * writeByteUnpaged(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     * @param {number} addr
     */
    writeByteUnpaged(off, b, addr)
    {
        this.getPageBlock(addr, true).writeByte(off, b, addr);
    }

    /**
     * writeShortUnpaged(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeShortUnpaged(off, w, addr)
    {
        this.getPageBlock(addr, true).writeShort(off, w, addr);
    }

    /**
     * writeLongUnpaged(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongUnpaged(off, l, addr)
    {
        this.getPageBlock(addr, true).writeLong(off, l, addr);
    }

    /**
     * readByteBE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteBE(off, addr)
    {
        return this.ab[off];
    }

    /**
     * readByteLE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteLE(off, addr)
    {
        return this.ab[off];
    }

    /**
     * readBytePLE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readBytePLE(off, addr)
    {
        this.blockPDE.adw[this.iPDE] |= X86.PTE.ACCESSED;
        this.blockPTE.adw[this.iPTE] |= X86.PTE.ACCESSED;
        /*
         * TODO: Review this performance hack.  Basically, after the first read of a page,
         * we redirect the default read handler to a faster handler.  However, if operating
         * systems clear the PDE/PTE bits without reloading CR3, they won't get set again.
         *
         * We should look into creating special write handlers for pages containing PDE/PTE
         * entries, and whenever those entries are written, reset the read/write handlers
         * for the corresponding pages.
         */
        this.readByte = this.readByteLE;
        return this.ab[off];
    }

    /**
     * readShortBE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortBE(off, addr)
    {
        return this.dv.getUint16(off, true);
    }

    /**
     * readShortLE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortLE(off, addr)
    {
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset for an aligned read
         * vs. always reading the bytes separately; it seems a safe bet for longs, but it's less clear for shorts.
         */
        return (off & 0x1)? (this.ab[off] | (this.ab[off+1] << 8)) : this.aw[off >> 1];
    }

    /**
     * readShortPLE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortPLE(off, addr)
    {
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset for an aligned read
         * vs. always reading the bytes separately; it seems a safe bet for longs, but it's less clear for shorts.
         */
        this.blockPDE.adw[this.iPDE] |= X86.PTE.ACCESSED;
        this.blockPTE.adw[this.iPTE] |= X86.PTE.ACCESSED;
        /*
         * TODO: Review this performance hack.  Basically, after the first read of a page,
         * we redirect the default read handler to a faster handler.  However, if operating
         * systems clear the PDE/PTE bits without reloading CR3, they won't get set again.
         *
         * We should look into creating special write handlers for pages containing PDE/PTE
         * entries, and whenever those entries are written, reset the read/write handlers
         * for the corresponding pages.
         */
        this.readShort = this.readShortLE;
        return (off & 0x1)? (this.ab[off] | (this.ab[off+1] << 8)) : this.aw[off >> 1];
    }

    /**
     * readLongBE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongBE(off, addr)
    {
        return this.dv.getInt32(off, true);
    }

    /**
     * readLongLE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongLE(off, addr)
    {
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset for an aligned read
         * vs. always reading the bytes separately; it seems a safe bet for longs, but it's less clear for shorts.
         */
        return (off & 0x3)? (this.ab[off] | (this.ab[off+1] << 8) | (this.ab[off+2] << 16) | (this.ab[off+3] << 24)) : this.adw[off >> 2];
    }

    /**
     * readLongPLE(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongPLE(off, addr)
    {
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset for an aligned read
         * vs. always reading the bytes separately; it seems a safe bet for longs, but it's less clear for shorts.
         */
        this.blockPDE.adw[this.iPDE] |= X86.PTE.ACCESSED;
        this.blockPTE.adw[this.iPTE] |= X86.PTE.ACCESSED;
        /*
         * TODO: Review this performance hack.  Basically, after the first read of a page,
         * we redirect the default read handler to a faster handler.  However, if operating
         * systems clear the PDE/PTE bits without reloading CR3, they won't get set again.
         *
         * We should look into creating special write handlers for pages containing PDE/PTE
         * entries, and whenever those entries are written, reset the read/write handlers
         * for the corresponding pages.
         */
        this.readLong = this.readLongLE;
        return (off & 0x3)? (this.ab[off] | (this.ab[off+1] << 8) | (this.ab[off+2] << 16) | (this.ab[off+3] << 24)) : this.adw[off >> 2];
    }

    /**
     * writeByteBE(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     * @param {number} addr
     */
    writeByteBE(off, b, addr)
    {
        this.ab[off] = b;
        this.fDirty = true;
    }

    /**
     * writeByteLE(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} b
     */
    writeByteLE(off, b, addr)
    {
        this.ab[off] = b;
        this.fDirty = true;
    }

    /**
     * writeBytePLE(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} b
     */
    writeBytePLE(off, b, addr)
    {
        this.ab[off] = b;
        this.blockPDE.adw[this.iPDE] |= X86.PTE.ACCESSED;
        this.blockPTE.adw[this.iPTE] |= X86.PTE.ACCESSED | X86.PTE.DIRTY;
        /*
         * TODO: Review this performance hack.  Basically, after the first write of a page,
         * we redirect the default write handler to a faster handler.  However, if operating
         * systems clear the PDE/PTE bits without reloading CR3, they won't get set again.
         *
         * We should look into creating special write handlers for pages containing PDE/PTE
         * entries, and whenever those entries are written, reset the read/write handlers
         * for the corresponding pages.
         */
        this.writeByte = this.writeByteLE;
        /*
         * NOTE: Technically, we should be setting the fDirty flag on blockPDE and blockPTE as well, but let's
         * consider the two sole uses of fDirty.  First, we have cleanMemory(), which is currently used only by
         * the Video component, and video memory should never contain page directories or page tables, so no
         * worries there.  Second, we have saveMemory(), but the CPU now asks that function to save all physical
         * memory blocks whenever paging is enabled, so no worries there either.
         */
        this.blockPhys.fDirty = true;
    }

    /**
     * writeShortBE(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} w
     */
    writeShortBE(off, w, addr)
    {
        this.dv.setUint16(off, w, true);
        this.fDirty = true;
    }

    /**
     * writeShortLE(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} w
     */
    writeShortLE(off, w, addr)
    {
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset for an aligned write
         * vs. always writing the bytes separately; it seems a safe bet for longs, but it's less clear for shorts.
         */
        if (off & 0x1) {
            this.ab[off] = w;
            this.ab[off+1] = w >> 8;
        } else {
            this.aw[off >> 1] = w;
        }
        this.fDirty = true;
    }

    /**
     * writeShortPLE(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} w
     */
    writeShortPLE(off, w, addr)
    {
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset for an aligned write
         * vs. always writing the bytes separately; it seems a safe bet for longs, but it's less clear for shorts.
         */
        if (off & 0x1) {
            this.ab[off] = w;
            this.ab[off+1] = w >> 8;
        } else {
            this.aw[off >> 1] = w;
        }
        this.blockPDE.adw[this.iPDE] |= X86.PTE.ACCESSED;
        this.blockPTE.adw[this.iPTE] |= X86.PTE.ACCESSED | X86.PTE.DIRTY;
        /*
         * TODO: Review this performance hack.  Basically, after the first write of a page,
         * we redirect the default write handler to a faster handler.  However, if operating
         * systems clear the PDE/PTE bits without reloading CR3, they won't get set again.
         *
         * We should look into creating special write handlers for pages containing PDE/PTE
         * entries, and whenever those entries are written, reset the read/write handlers
         * for the corresponding pages.
         */
        this.writeShort = this.writeShortLE;
        /*
         * NOTE: Technically, we should be setting the fDirty flag on blockPDE and blockPTE as well, but let's
         * consider the two sole uses of fDirty.  First, we have cleanMemory(), which is currently used only by
         * the Video component, and video memory should never contain page directories or page tables, so no
         * worries there.  Second, we have saveMemory(), but the CPU now asks that function to save all physical
         * memory blocks whenever paging is enabled, so no worries there either.
         */
        this.blockPhys.fDirty = true;
    }

    /**
     * writeLongBE(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongBE(off, l, addr)
    {
        this.dv.setInt32(off, l, true);
        this.fDirty = true;
    }

    /**
     * writeLongLE(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongLE(off, l, addr)
    {
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset for an aligned write
         * vs. always writing the bytes separately; it seems a safe bet for longs, but it's less clear for shorts.
         */
        if (off & 0x3) {
            this.ab[off] = l;
            this.ab[off+1] = (l >> 8);
            this.ab[off+2] = (l >> 16);
            this.ab[off+3] = (l >> 24);
        } else {
            this.adw[off >> 2] = l;
        }
        this.fDirty = true;
    }

    /**
     * writeLongPLE(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongPLE(off, l, addr)
    {
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset for an aligned write
         * vs. always writing the bytes separately; it seems a safe bet for longs, but it's less clear for shorts.
         */
        if (off & 0x3) {
            this.ab[off] = l;
            this.ab[off+1] = (l >> 8);
            this.ab[off+2] = (l >> 16);
            this.ab[off+3] = (l >> 24);
        } else {
            this.adw[off >> 2] = l;
        }
        this.blockPDE.adw[this.iPDE] |= X86.PTE.ACCESSED;
        this.blockPTE.adw[this.iPTE] |= X86.PTE.ACCESSED | X86.PTE.DIRTY;
        /*
         * TODO: Review this performance hack.  Basically, after the first write of a page,
         * we redirect the default write handler to a faster handler.  However, if operating
         * systems clear the PDE/PTE bits without reloading CR3, they won't get set again.
         *
         * We should look into creating special write handlers for pages containing PDE/PTE
         * entries, and whenever those entries are written, reset the read/write handlers
         * for the corresponding pages.
         */
        this.writeLong = this.writeLongLE;
        /*
         * NOTE: Technically, we should be setting the fDirty flag on blockPDE and blockPTE as well, but let's
         * consider the two sole uses of fDirty.  First, we have cleanMemory(), which is currently used only by
         * the Video component, and video memory should never contain page directories or page tables, so no
         * worries there.  Second, we have saveMemory(), but the CPU now asks that function to save all physical
         * memory blocks whenever paging is enabled, so no worries there either.
         */
        this.blockPhys.fDirty = true;
    }

    /**
     * readBackTrackNone(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readBackTrackNone(off)
    {
        return 0;
    }

    /**
     * writeBackTrackNone(off, bti)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} bti
     */
    writeBackTrackNone(off, bti)
    {
    }

    /**
     * modBackTrackNone(fMod)
     *
     * @this {Memory}
     * @param {boolean} fMod
     */
    modBackTrackNone(fMod)
    {
        return false;
    }

    /**
     * readBackTrackIndex(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readBackTrackIndex(off)
    {
        return this.abtIndexes[off];
    }

    /**
     * writeBackTrackIndex(off, bti)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} bti
     * @return {number} previous bti (0 if none)
     */
    writeBackTrackIndex(off, bti)
    {
        var btiPrev;
        btiPrev = this.abtIndexes[off];
        this.abtIndexes[off] = bti;
        return btiPrev;
    }

    /**
     * modBackTrackIndex(fMod)
     *
     * @this {Memory}
     * @param {boolean} fMod
     * @return {boolean} previous value
     */
    modBackTrackIndex(fMod)
    {
        var fModPrev = this.fModBackTrack;
        this.fModBackTrack = fMod;
        return fModPrev;
    }

    /**
     * adjustEndian(dw)
     *
     * @param {number} dw
     * @return {number}
     */
    static adjustEndian(dw)
    {
        if (TYPEDARRAYS && !littleEndian) {
            dw = (dw << 24) | ((dw << 8) & 0x00ff0000) | ((dw >> 8) & 0x0000ff00) | (dw >>> 24);
        }
        return dw;
    }
}

/*
 * Basic memory types
 *
 * RAM is the most conventional memory type, providing full read/write capability to x86-compatible (ie,
 * 'little endian") storage.  ROM is equally conventional, except that the fReadOnly property is set,
 * disabling writes.  VIDEO is treated exactly like RAM, unless a controller is provided.  Both RAM and
 * VIDEO memory are always considered writable, and even ROM can be written using the Bus setByteDirect()
 * interface (which in turn uses the Memory writeByteDirect() interface), allowing the ROM component to
 * initialize its own memory.  The CTRL type is used to identify memory-mapped devices that do not need
 * any default storage and always provide their own controller.
 *
 * UNPAGED and PAGED blocks are created by the CPU when paging is enabled; the role of an UNPAGED block
 * is simply to perform page translation and replace itself with a PAGED block, which redirects read/write
 * requests to the physical page located during translation.  UNPAGED and PAGED blocks are considered
 * "logical" blocks that don't contain any storage of their own; all other block types represent "physical"
 * memory (or a memory-mapped device).
 *
 * Unallocated regions of the address space contain a special memory block of type NONE that contains
 * no storage.  Mapping every addressible location to a memory block allows all accesses to be routed in
 * exactly the same manner, without resorting to any range or processor checks.
 *
 * Originally, the Debugger always went through the Bus interfaces, and could therefore modify ROMs as well,
 * but with the introduction of protected mode memory segmentation (and later paging), where logical and
 * physical addresses were no longer the same, that is no longer true.  For coherency, all Debugger memory
 * accesses now go through X86Seg and X86CPU memory interfaces, so that the user sees the same segment
 * and page translation that the CPU sees.  However, the Debugger uses a special probeAddr() interface to
 * read memory, along with a special "fSuppress" flag to mapPageBlock(), to prevent its memory accesses
 * from triggering segment and/or page faults when invalid or not-present segments or pages are accessed.
 *
 * These types are not mutually exclusive.  For example, VIDEO memory could be allocated as RAM, with or
 * without a custom controller (the original Monochrome and CGA video cards used read/write storage that
 * was indistinguishable from RAM), and CTRL memory could be allocated as an empty block of any type, with
 * a custom controller.  A few types are required for certain features (eg, ROM is required if you want
 * read-only memory), but the larger purpose of these types is to help document the caller's intent and to
 * provide the Control Panel with the ability to highlight memory regions accordingly.
 */
Memory.TYPE = {
    NONE:       0,
    RAM:        1,
    ROM:        2,
    VIDEO:      3,
    CTRL:       4,
    UNPAGED:    5,
    PAGED:      6,
    COLORS:     ["black", "blue", "green", "cyan"],
    NAMES:      ["NONE",  "RAM",  "ROM",   "VIDEO", "H/W", "UNPAGED", "PAGED"]
};

/*
 * Last used block ID (used for debugging only)
 */
Memory.idBlock = 0;


/*
 * This is the effective definition of afnNone, but we need not fully define it, because setAccess() uses these
 * defaults when any of the 6 handlers (ie, 2 byte handlers, 2 short handlers, and 2 long handlers) are undefined.
 *
Memory.afnNone = [
    Memory.prototype.readNone,
    Memory.prototype.writeNone,
    Memory.prototype.readShortDefault,
    Memory.prototype.writeShortDefault,
    Memory.prototype.readLongDefault,
    Memory.prototype.writeLongDefault
];
 */
Memory.afnNone = [];

Memory.afnMemory = [
    Memory.prototype.readByteMemory,
    Memory.prototype.writeByteMemory,
    Memory.prototype.readShortMemory,
    Memory.prototype.writeShortMemory,
    Memory.prototype.readLongMemory,
    Memory.prototype.writeLongMemory
];

Memory.afnChecked = [
    Memory.prototype.readByteChecked,
    Memory.prototype.writeByteChecked,
    Memory.prototype.readShortChecked,
    Memory.prototype.writeShortChecked,
    Memory.prototype.readLongChecked,
    Memory.prototype.writeLongChecked
];

if (PAGEBLOCKS) {
    Memory.afnPaged = [
        Memory.prototype.readBytePaged,
        Memory.prototype.writeBytePaged,
        Memory.prototype.readShortPaged,
        Memory.prototype.writeShortPaged,
        Memory.prototype.readLongPaged,
        Memory.prototype.writeLongPaged
    ];

    Memory.afnUnpaged = [
        Memory.prototype.readByteUnpaged,
        Memory.prototype.writeByteUnpaged,
        Memory.prototype.readShortUnpaged,
        Memory.prototype.writeShortUnpaged,
        Memory.prototype.readLongUnpaged,
        Memory.prototype.writeLongUnpaged
    ];
}

if (TYPEDARRAYS) {
    Memory.afnArrayBE = [
        Memory.prototype.readByteBE,
        Memory.prototype.writeByteBE,
        Memory.prototype.readShortBE,
        Memory.prototype.writeShortBE,
        Memory.prototype.readLongBE,
        Memory.prototype.writeLongBE
    ];

    Memory.afnArrayLE = [
        Memory.prototype.readByteLE,
        Memory.prototype.writeByteLE,
        Memory.prototype.readShortLE,
        Memory.prototype.writeShortLE,
        Memory.prototype.readLongLE,
        Memory.prototype.writeLongLE
    ];

    Memory.afnPagedLE = [
        Memory.prototype.readBytePLE,
        Memory.prototype.writeBytePLE,
        Memory.prototype.readShortPLE,
        Memory.prototype.writeShortPLE,
        Memory.prototype.readLongPLE,
        Memory.prototype.writeLongPLE
    ];
}

if (NODE) module.exports = Memory;
