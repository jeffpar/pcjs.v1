/**
 * @fileoverview Implements the PCjs "physical" Memory component.
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
 * Memory(addr, used, size, type, controller)
 *
 * The Bus component allocates Memory objects so that each has a memory buffer with a
 * block-granular starting address and an address range equal to bus.blockSize; however,
 * the size of any given Memory object's underlying buffer can be either zero or bus.blockSize;
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
 * However, preliminary testing of that feature (FATARRAYS) did not yield significantly faster
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
 * @constructor
 * @param {number|null} [addr] of lowest used address in block
 * @param {number} [used] portion of block in bytes (0 for none); must be a multiple of 4
 * @param {number} [size] of block's buffer in bytes (0 for none); must be a multiple of 4
 * @param {number} [type] is one of the Memory.TYPE constants (default is Memory.TYPE.NONE)
 * @param {Object} [controller] is an optional memory controller component
 * @param {Bus} [bus]
 */
function Memory(addr, used, size, type, controller, bus)
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
    this.bus = bus;
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
        var a = controller.getMemoryBuffer(addr);
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
        this.setAccess(littleEndian? Memory.afnLittleEndian : Memory.afnBigEndian);
    } else {
        if (FATARRAYS) {
            this.ab = new Array(size);
        } else {
            /*
             * NOTE: This is the default mode of operation (!TYPEDARRAYS && !FATARRAYS), because it
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

/*
 * Basic memory types
 *
 * The type that is most critical is ROM, because it determines the fReadOnly setting for allocated
 * memory blocks.  Both RAM and VIDEO memory are always considered writable, and even ROM can be written
 * using the Bus setByteDirect() interface (which in turn uses the Memory writeByteDirect() interface),
 * allowing the ROM component to initialize its own memory.  Only the Memory interfaces used by the CPU
 * are designed to ignore writes to ROM.
 *
 * The other purpose these types serve is to provide the Control Panel with the ability to highlight
 * memory regions according to one of the following types.
 *
 * Unallocated regions of the address space also contain memory blocks, but the blocks themselves are
 * empty (that is, their data arrays are uninitialized) and the memory type is NONE.
 */
Memory.TYPE = {
    NONE:       0,
    RAM:        1,
    ROM:        2,
    VIDEO:      3,
    CTRL:       4,
    UNPAGED:    5,
    PAGED:      6,
    NAMES:      ["NONE",  "RAM",  "ROM",   "VIDEO", "H/W", "UNPAGED", "PAGED"],
    COLORS:     ["black", "blue", "green", "cyan"]
};

/*
 * Last used block ID
 */
Memory.idBlock = 0;

Memory.prototype = {
    constructor: Memory,
    parent: null,
    /**
     * clone(mem, type)
     *
     * Converts the current Memory block (this) into a clone of the given Memory block (mem),
     * and optionally overrides the current block's type with the specified type.
     *
     * @this {Memory}
     * @param {Memory} mem
     * @param {number} [type]
     */
    clone: function(mem, type) {
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
            this.setAccess(littleEndian? Memory.afnLittleEndian : Memory.afnBigEndian);
        } else {
            if (FATARRAYS) {
                this.ab = mem.ab;
            } else {
                this.adw = mem.adw;
            }
            this.setAccess(Memory.afnMemory);
        }
    },
    /**
     * save()
     *
     * This gets the contents of a Memory block as an array of 32-bit values;
     * used by Bus.saveMemory(), which in turn is called by X86CPU.save().
     *
     * Memory blocks with custom memory controllers do NOT save their contents;
     * that's the responsibility of the controller component.
     *
     * @this {Memory}
     * @return {Array|Int32Array|null}
     */
    save: function() {
        var adw, i;
        if (this.controller) {
            adw = null;
        }
        else if (FATARRAYS) {
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
    },
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
    restore: function(adw) {
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
            if (FATARRAYS) {
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
    },
    /**
     * setAccess(afn)
     *
     * If no afn is specified, a default is selected based on the Memory type.
     *
     * @this {Memory}
     * @param {Array.<function()>} [afn]
     * @param {boolean} [fDirect]
     */
    setAccess: function(afn, fDirect) {
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
        if (fDirect === undefined) fDirect = true;      // TODO: Verify that this is desired default behavior
        this.setReadAccess(afn, fDirect);
        this.setWriteAccess(afn, fDirect);
    },
    /**
     * setReadAccess(afn, fDirect)
     *
     * @this {Memory}
     * @param {Array.<function()>} afn
     * @param {boolean} [fDirect]
     */
    setReadAccess: function(afn, fDirect) {
        this.readByte = afn[0] || this.readNone;
        this.readShort = afn[1] || this.readShortDefault;
        this.readLong = afn[2] || this.readLongDefault;
        if (fDirect) {
            this.readByteDirect = afn[0] || this.readNone;
            this.readShortDirect = afn[1] || this.readShortDefault;
            this.readLongDirect = afn[2] || this.readLongDefault;
        }
    },
    /**
     * setWriteAccess(afn, fDirect)
     *
     * @this {Memory}
     * @param {Array.<function()>} afn
     * @param {boolean} [fDirect]
     */
    setWriteAccess: function(afn, fDirect) {
        this.writeByte = !this.fReadOnly && afn[3] || this.writeNone;
        this.writeShort = !this.fReadOnly && afn[4] || this.writeShortDefault;
        this.writeLong = !this.fReadOnly && afn[5] || this.writeLongDefault;
        if (fDirect) {
            this.writeByteDirect = afn[3] || this.writeNone;
            this.writeShortDirect = afn[4] || this.writeShortDefault;
            this.writeLongDirect = afn[5] || this.writeLongDefault;
        }
    },
    /**
     * resetReadAccess()
     *
     * @this {Memory}
     */
    resetReadAccess: function() {
        this.readByte = this.readByteDirect;
        this.readShort = this.readShortDirect;
        this.readLong = this.readLongDirect;
    },
    /**
     * resetWriteAccess()
     *
     * @this {Memory}
     */
    resetWriteAccess: function() {
        this.writeByte = this.fReadOnly? this.writeNone : this.writeByteDirect;
        this.writeShort = this.fReadOnly? this.writeNone : this.writeShortDirect;
        this.writeLong = this.fReadOnly? this.writeNone : this.writeLongDirect;
    },
    /**
     * setDebugger(dbg, addr, size)
     *
     * @this {Memory}
     * @param {Debugger} dbg
     * @param {number} addr of block
     * @param {number} size of block
     */
    setDebugger: function(dbg, addr, size) {
        if (DEBUGGER) {
            this.dbg = dbg;
            this.cReadBreakpoints = this.cWriteBreakpoints = 0;
            Component.assert(this.dbg);
            this.dbg.redoBreakpoints(addr, size);
        }
    },
    /**
     * adjustEndian(dw)
     *
     * @this {Memory}
     * @param {number} dw
     * @return {number}
     */
    adjustEndian: function(dw) {
        if (TYPEDARRAYS && !littleEndian) {
            dw = (dw << 24) | ((dw << 8) & 0x00ff0000) | ((dw >> 8) & 0x0000ff00) | (dw >>> 24);
        }
        return dw;
    },
    /**
     * getPageBlock(addr, fWrite)
     *
     * @this {Memory}
     * @param {number} addr
     * @param {boolean} fWrite (true if called for a write, false if for a read)
     * @return {Memory}
     */
    getPageBlock: function(addr, fWrite) {
        var block = this.bus.mapPageBlock(addr, fWrite);
        return block || this;
    },
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
    setPhysBlock: function(blockPhys, blockPDE, offPDE, blockPTE, offPTE) {
        this.blockPhys = blockPhys;
        this.blockPDE = blockPDE;
        this.iPDE = offPDE >> 2;    // convert offPDE into an adw index (iPDE)
        this.blockPTE = blockPTE;
        this.iPTE = offPTE >> 2;    // convert offPTE into an adw index (iPTE)
        this.bitPTEDirty = this.adjustEndian(X86.PTE.ACCESSED | X86.PTE.DIRTY);
        this.bitPTEAccessed = this.adjustEndian(X86.PTE.ACCESSED);
    },
    /**
     * addBreakpoint(off, fWrite)
     *
     * @this {Memory}
     * @param {number} off
     * @param {boolean} fWrite
     */
    addBreakpoint: function(off, fWrite) {
        if (DEBUGGER && this.dbg) {
            if (!fWrite) {
                if (this.cReadBreakpoints++ === 0) {
                    this.setReadAccess(Memory.afnChecked);
                }
                if (DEBUG) this.dbg.println("read breakpoint added to memory block " + str.toHex(this.addr));
            }
            else {
                if (this.cWriteBreakpoints++ === 0) {
                    this.setWriteAccess(Memory.afnChecked);
                }
                if (DEBUG) this.dbg.println("write breakpoint added to memory block " + str.toHex(this.addr));
            }
        }
    },
    /**
     * removeBreakpoint(off, fWrite)
     *
     * @this {Memory}
     * @param {number} off
     * @param {boolean} fWrite
     */
    removeBreakpoint: function(off, fWrite) {
        if (DEBUGGER && this.dbg) {
            if (!fWrite) {
                if (--this.cReadBreakpoints === 0) {
                    this.resetReadAccess();
                    if (DEBUG) this.dbg.println("all read breakpoints removed from memory block " + str.toHex(this.addr));
                }
                this.dbg.assert(this.cReadBreakpoints >= 0);
            }
            else {
                if (--this.cWriteBreakpoints === 0) {
                    this.resetWriteAccess();
                    if (DEBUG) this.dbg.println("all write breakpoints removed from memory block " + str.toHex(this.addr));
                }
                this.dbg.assert(this.cWriteBreakpoints >= 0);
            }
        }
    },
    /**
     * readNone(off)
     *
     * Previously, this always returned 0x00, but the initial memory probe by the Compaq DeskPro 386 ROM BIOS
     * writes 0x0000 to the first word of every 64Kb block in the nearly 16Mb address space it supports, and so
     * it would initially think that LOTS of RAM existed, only to be disappointed later when it performed a more
     * exhaustive memory test, and generating error messages in the process.
     *
     * TODO: Determine if we should have separate readByteNone(), readShortNone() and readLongNone() functions
     * to return 0xff, 0xffff and 0xffffffff|0, respectively.  This seems sufficient, as it seems unlikely
     * that a system would require nonexistent memory locations to have all bits set.
     *
     * Also, I'm reluctant to address that potential issue by simply returning -1, because to date, the Memory
     * component has always provided return values that are properly masked, and some callers may depend on that.
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readNone: function readNone(off, addr) {
        if (DEBUGGER && this.dbg && this.dbg.messageEnabled(Messages.MEM) /* && !off */) {
            this.dbg.message("attempt to read invalid block %" + str.toHex(this.addr), true);
        }
        return 0xff;
    },
    /**
     * writeNone(off, v, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} v (could be either a byte or word value, since we use the same handler for both kinds of accesses)
     * @param {number} addr
     */
    writeNone: function writeNone(off, v, addr) {
        if (DEBUGGER && this.dbg && this.dbg.messageEnabled(Messages.MEM) /* && !off */) {
            this.dbg.message("attempt to write " + str.toHexWord(v) + " to invalid block %" + str.toHex(this.addr), true);
        }
    },
    /**
     * readShortDefault(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortDefault: function readShortDefault(off, addr) {
        return this.readByteDirect(off, addr) | (this.readByteDirect(off + 1, addr) << 8);
    },
    /**
     * readLongDefault(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongDefault: function readLongDefault(off, addr) {
        return this.readByteDirect(off, addr) | (this.readByteDirect(off + 1, addr) << 8) | (this.readByteDirect(off + 2, addr) << 16) | (this.readByteDirect(off + 3, addr) << 24);
    },
    /**
     * writeShortDefault(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeShortDefault: function writeShortDefault(off, w, addr) {
        Component.assert(!(w & ~0xffff));
        this.writeByteDirect(off, w & 0xff);
        this.writeByteDirect(off + 1, w >> 8);
    },
    /**
     * writeLongDefault(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeLongDefault: function writeLongDefault(off, w, addr) {
        this.writeByteDirect(off, w & 0xff);
        this.writeByteDirect(off + 1, (w >> 8) & 0xff);
        this.writeByteDirect(off + 2, (w >> 16) & 0xff);
        this.writeByteDirect(off + 3, (w >>> 24));
    },
    /**
     * readByteMemory(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteMemory: function readByteMemory(off, addr) {
        Component.assert(off >= 0 && off < this.size);
        if (FATARRAYS) {
            return this.ab[off];
        }
        return ((this.adw[off >> 2] >>> ((off & 0x3) << 3)) & 0xff);
    },
    /**
     * readShortMemory(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortMemory: function readShortMemory(off, addr) {
        Component.assert(off >= 0 && off < this.size - 1);
        if (FATARRAYS) {
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
    },
    /**
     * readLongMemory(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongMemory: function readLongMemory(off, addr) {
        Component.assert(off >= 0 && off < this.size - 3);
        if (FATARRAYS) {
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
    },
    /**
     * writeByteMemory(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     * @param {number} addr
     */
    writeByteMemory: function writeByteMemory(off, b, addr) {
        Component.assert(off >= 0 && off < this.size && (b & 0xff) == b);
        if (FATARRAYS) {
            this.ab[off] = b;
        } else {
            var idw = off >> 2;
            var nShift = (off & 0x3) << 3;
            this.adw[idw] = (this.adw[idw] & ~(0xff << nShift)) | (b << nShift);
        }
        this.fDirty = true;
    },
    /**
     * writeShortMemory(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeShortMemory: function writeShortMemory(off, w, addr) {
        Component.assert(off >= 0 && off < this.size - 1 && (w & 0xffff) == w);
        if (FATARRAYS) {
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
    },
    /**
     * writeLongMemory(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongMemory: function writeLongMemory(off, l, addr) {
        Component.assert(off >= 0 && off < this.size - 3);
        if (FATARRAYS) {
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
    },
    /**
     * readByteChecked(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteChecked: function readByteChecked(off, addr) {
        if (DEBUGGER && this.dbg) this.dbg.checkMemoryRead(addr);
        return this.readByteDirect(off, addr);
    },
    /**
     * readShortChecked(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortChecked: function readShortChecked(off, addr) {
        if (DEBUGGER && this.dbg) {
            this.dbg.checkMemoryRead(addr) ||
            this.dbg.checkMemoryRead(addr + 1);
        }
        return this.readShortDirect(off, addr);
    },
    /**
     * readLongChecked(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongChecked: function readLongChecked(off, addr) {
        if (DEBUGGER && this.dbg) {
            this.dbg.checkMemoryRead(addr) ||
            this.dbg.checkMemoryRead(addr + 1) ||
            this.dbg.checkMemoryRead(addr + 2) ||
            this.dbg.checkMemoryRead(addr + 3);
        }
        return this.readLongDirect(off, addr);
    },
    /**
     * writeByteChecked(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} b
     */
    writeByteChecked: function writeByteChecked(off, b, addr) {
        if (DEBUGGER && this.dbg) this.dbg.checkMemoryWrite(addr);
        this.writeByteDirect(off, b, addr);
    },
    /**
     * writeShortChecked(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} w
     */
    writeShortChecked: function writeShortChecked(off, w, addr) {
        if (DEBUGGER && this.dbg) {
            this.dbg.checkMemoryWrite(addr) ||
            this.dbg.checkMemoryWrite(addr + 1);
        }
        this.writeShortDirect(off, w, addr);
    },
    /**
     * writeLongChecked(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongChecked: function writeLongChecked(off, l, addr) {
        if (DEBUGGER && this.dbg) {
            this.dbg.checkMemoryWrite(this.addr + off) ||
            this.dbg.checkMemoryWrite(this.addr + off + 1) ||
            this.dbg.checkMemoryWrite(this.addr + off + 2) ||
            this.dbg.checkMemoryWrite(this.addr + off + 3);
        }
        this.writeLongDirect(off, l);
    },
    /**
     * readBytePaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readBytePaged: function readBytePaged(off, addr) {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEAccessed;
        return this.blockPhys.readByte(off, addr);
    },
    /**
     * readShortPaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortPaged: function readShortPaged(off, addr) {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEAccessed;
        return this.blockPhys.readShort(off, addr);
    },
    /**
     * readLongPaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongPaged: function readLongPaged(off, addr) {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEAccessed;
        return this.blockPhys.readLong(off, addr);
    },
    /**
     * writeBytePaged(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     * @param {number} addr
     */
    writeBytePaged: function writeBytePaged(off, b, addr) {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEDirty;
        this.blockPhys.writeByte(off, b, addr);
    },
    /**
     * writeShortPaged(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeShortPaged: function writeShortPaged(off, w, addr) {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEDirty;
        this.blockPhys.writeShort(off, w, addr);
    },
    /**
     * writeLongPaged(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongPaged: function writeLongPaged(off, l, addr) {
        this.blockPDE.adw[this.iPDE] |= this.bitPTEAccessed;
        this.blockPTE.adw[this.iPTE] |= this.bitPTEDirty;
        this.blockPhys.writeLong(off, l, addr);
    },
    /**
     * readByteUnpaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteUnpaged: function readByteUnpaged(off, addr) {
        return this.getPageBlock(addr, false).readByte(off, addr);
    },
    /**
     * readShortUnpaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortUnpaged: function readShortUnpaged(off, addr) {
        return this.getPageBlock(addr, false).readShort(off, addr);
    },
    /**
     * readLongUnpaged(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongUnpaged: function readLongUnpaged(off, addr) {
        return this.getPageBlock(addr, false).readLong(off, addr);
    },
    /**
     * writeByteUnpaged(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     * @param {number} addr
     */
    writeByteUnpaged: function writeByteUnpaged(off, b, addr) {
        this.getPageBlock(addr, true).writeByte(off, b, addr);
    },
    /**
     * writeShortUnpaged(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     * @param {number} addr
     */
    writeShortUnpaged: function writeShortUnpaged(off, w, addr) {
        this.getPageBlock(addr, true).writeShort(off, w, addr);
    },
    /**
     * writeLongUnpaged(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongUnpaged: function writeLongUnpaged(off, l, addr) {
        this.getPageBlock(addr, true).writeLong(off, l, addr);
    },
    /**
     * readByteBigEndian(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteBigEndian: function readByteBigEndian(off, addr) {
        Component.assert(off >= 0 && off < this.size);
        return this.ab[off];
    },
    /**
     * readByteLittleEndian(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readByteLittleEndian: function readByteLittleEndian(off, addr) {
        Component.assert(off >= 0 && off < this.size);
        return this.ab[off];
    },
    /**
     * readShortBigEndian(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortBigEndian: function readShortBigEndian(off, addr) {
        Component.assert(off >= 0 && off < this.size - 1);
        return this.dv.getUint16(off, true);
    },
    /**
     * readShortLittleEndian(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readShortLittleEndian: function readShortLittleEndian(off, addr) {
        Component.assert(off >= 0 && off < this.size - 1);
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset
         * for an aligned read vs. always reading the bytes separately; it seems a safe bet
         * for longs, but it's less clear for shorts.
         */
        return (off & 0x1)? (this.ab[off] | (this.ab[off+1] << 8)) : this.aw[off >> 1];
    },
    /**
     * readLongBigEndian(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongBigEndian: function readLongBigEndian(off, addr) {
        Component.assert(off >= 0 && off < this.size - 3);
        return this.dv.getInt32(off, true);
    },
    /**
     * readLongLittleEndian(off, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @return {number}
     */
    readLongLittleEndian: function readLongLittleEndian(off, addr) {
        Component.assert(off >= 0 && off < this.size - 3);
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset
         * for an aligned read vs. always reading the bytes separately; it seems a safe bet
         * for longs, but it's less clear for shorts.
         */
        return (off & 0x3)? (this.ab[off] | (this.ab[off+1] << 8) | (this.ab[off+2] << 16) | (this.ab[off+3] << 24)) : this.adw[off >> 2];
    },
    /**
     * writeByteBigEndian(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     * @param {number} addr
     */
    writeByteBigEndian: function writeByteBigEndian(off, b, addr) {
        Component.assert(off >= 0 && off < this.size);
        this.ab[off] = b;
        this.fDirty = true;
    },
    /**
     * writeByteLittleEndian(off, b, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} b
     */
    writeByteLittleEndian: function writeByteLittleEndian(off, b, addr) {
        Component.assert(off >= 0 && off < this.size);
        this.ab[off] = b;
        this.fDirty = true;
    },
    /**
     * writeShortBigEndian(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} w
     */
    writeShortBigEndian: function writeShortBigEndian(off, w, addr) {
        Component.assert(off >= 0 && off < this.size - 1);
        this.dv.setUint16(off, w, true);
        this.fDirty = true;
    },
    /**
     * writeShortLittleEndian(off, w, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} addr
     * @param {number} w
     */
    writeShortLittleEndian: function writeShortLittleEndian(off, w, addr) {
        Component.assert(off >= 0 && off < this.size - 1);
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset
         * for an aligned write vs. always writing the bytes separately; it seems a safe bet
         * for longs, but it's less clear for shorts.
         */
        if (off & 0x1) {
            this.ab[off] = w;
            this.ab[off+1] = w >> 8;
        } else {
            this.aw[off >> 1] = w;
        }
        this.fDirty = true;
    },
    /**
     * writeLongBigEndian(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongBigEndian: function writeLongBigEndian(off, l, addr) {
        Component.assert(off >= 0 && off < this.size - 3);
        this.dv.setInt32(off, l, true);
        this.fDirty = true;
    },
    /**
     * writeLongLittleEndian(off, l, addr)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     * @param {number} addr
     */
    writeLongLittleEndian: function writeLongLittleEndian(off, l, addr) {
        Component.assert(off >= 0 && off < this.size - 3);
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset
         * for an aligned write vs. always writing the bytes separately; it seems a safe bet
         * for longs, but it's less clear for shorts.
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
    },
    /**
     * readBackTrackNone(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readBackTrackNone: function readBackTrackNone(off) {
        return 0;
    },
    /**
     * writeBackTrackNone(off, bti)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} bti
     */
    writeBackTrackNone: function writeBackTrackNone(off, bti) {
    },
    /**
     * modBackTrackNone(fMod)
     *
     * @this {Memory}
     * @param {boolean} fMod
     */
    modBackTrackNone: function modBackTrackNone(fMod) {
        return false;
    },
    /**
     * readBackTrackIndex(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readBackTrackIndex: function readBackTrackIndex(off) {
        Component.assert(off >= 0 && off < this.size);
        return this.abtIndexes[off];
    },
    /**
     * writeBackTrackIndex(off, bti)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} bti
     * @return {number} previous bti (0 if none)
     */
    writeBackTrackIndex: function writeBackTrackIndex(off, bti) {
        var btiPrev;
        Component.assert(off >= 0 && off < this.size);
        btiPrev = this.abtIndexes[off];
        this.abtIndexes[off] = bti;
        return btiPrev;
    },
    /**
     * modBackTrackIndex(fMod)
     *
     * @this {Memory}
     * @param {boolean} fMod
     * @return {boolean} previous value
     */
    modBackTrackIndex: function modBackTrackIndex(fMod) {
        var fModPrev = this.fModBackTrack;
        this.fModBackTrack = fMod;
        return fModPrev;
    }
};

/*
 * This is the effective definition of afnNone, but we need not fully define it, because setAccess()
 * uses these defaults when any of the 6 handlers (ie, 3 read handlers and 3 write handlers) are undefined.
 *
Memory.afnNone              = [Memory.prototype.readNone,        Memory.prototype.readShortDefault, Memory.prototype.readLongDefault, Memory.prototype.writeNone,        Memory.prototype.writeShortDefault, Memory.prototype.writeLongDefault];
 */

Memory.afnNone              = [];
Memory.afnMemory            = [Memory.prototype.readByteMemory,  Memory.prototype.readShortMemory,  Memory.prototype.readLongMemory,  Memory.prototype.writeByteMemory,  Memory.prototype.writeShortMemory,  Memory.prototype.writeLongMemory];
Memory.afnChecked           = [Memory.prototype.readByteChecked, Memory.prototype.readShortChecked, Memory.prototype.readLongChecked, Memory.prototype.writeByteChecked, Memory.prototype.writeShortChecked, Memory.prototype.writeLongChecked];

if (PAGEBLOCKS) {
    Memory.afnPaged         = [Memory.prototype.readBytePaged,   Memory.prototype.readShortPaged,   Memory.prototype.readLongPaged,   Memory.prototype.writeBytePaged,   Memory.prototype.writeShortPaged,   Memory.prototype.writeLongPaged];
    Memory.afnUnpaged       = [Memory.prototype.readByteUnpaged, Memory.prototype.readShortUnpaged, Memory.prototype.readLongUnpaged, Memory.prototype.writeByteUnpaged, Memory.prototype.writeShortUnpaged, Memory.prototype.writeLongUnpaged];
}

if (TYPEDARRAYS) {
    Memory.afnBigEndian     = [Memory.prototype.readByteBigEndian,    Memory.prototype.readShortBigEndian,    Memory.prototype.readLongBigEndian,    Memory.prototype.writeByteBigEndian,    Memory.prototype.writeShortBigEndian,    Memory.prototype.writeLongBigEndian];
    Memory.afnLittleEndian  = [Memory.prototype.readByteLittleEndian, Memory.prototype.readShortLittleEndian, Memory.prototype.readLongLittleEndian, Memory.prototype.writeByteLittleEndian, Memory.prototype.writeShortLittleEndian, Memory.prototype.writeLongLittleEndian];
}

if (typeof module !== 'undefined') module.exports = Memory;
