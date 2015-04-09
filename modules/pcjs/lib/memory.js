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

/*
 * Historical Notes
 *
 * To minimize possible future confusion with regard to the 80386's page tables
 * and page-based virtual memory, the original Page component was converted into
 * this new Memory component, which provides callers with "blocks" of physical
 * memory rather than "pages".  Callers have been updated to refer to their Memory
 * allocations as "blocks" as well.
 *
 * Note that the Bus component continues to specify a default block size of 4Kb (for
 * the default "buswidth" of 20), but only because that seems to strike a good balance
 * between data structure overhead and the memory granularity requirements of most
 * system components.  For larger bus widths, larger physical block sizes may be used;
 * see the Bus constructor for details.
 */

"use strict";

if (typeof module !== 'undefined') {
    var str         = require("../../shared/lib/strlib");
    var Component   = require("../../shared/lib/component");
    var Messages    = require("./messages");
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
 * @param {number} addr of lowest used address in block
 * @param {number} [used] portion of block in bytes (0 for none); must be a multiple of 4
 * @param {number} [size] of block's buffer in bytes (0 for none); must be a multiple of 4
 * @param {number} [type] is one of the Memory.TYPE constants (default is Memory.TYPE.NONE)
 * @param {Object} [controller] is an optional memory controller component
 */
function Memory(addr, used, size, type, controller)
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
     * are mapped to "none" handlers.
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
     * mode; pseudo-random might be best, because if it uncovers a bug, the bug should be reproducible.
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
    NONE:   0,
    RAM:    1,
    ROM:    2,
    VIDEO:  3,
    CTRL:   4,
    NAMES:  ["NONE", "RAM", "ROM", "VIDEO", "H/W"],
    COLORS: ["black", "blue", "green", "cyan"]
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
         * the original ID of the current block is lost, but that's OK, since it was
         * presumably produced merely to become a clone.
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
     * @this {Memory}
     * @param {Array.<function()>} [afn]
     * @param {boolean} [fDirect]
     */
    setAccess: function(afn, fDirect) {
        if (!afn) afn = [];
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
        this.readShort = afn[1] || this.readNone;
        this.readLong = afn[2] || this.readNone;
        if (fDirect) {
            this.readByteDirect = afn[0] || this.readNone;
            this.readShortDirect = afn[1] || this.readNone;
            this.readLongDirect = afn[2] || this.readNone;
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
        this.writeShort = !this.fReadOnly && afn[4] || this.writeNone;
        this.writeLong = !this.fReadOnly && afn[5] || this.writeNone;
        if (fDirect) {
            this.writeByteDirect = afn[3] || this.writeNone;
            this.writeShortDirect = afn[4] || this.writeNone;
            this.writeLongDirect = afn[5] || this.writeNone;
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
     * setDebugInfo(cpu, dbg, size)
     *
     * @this {Memory}
     * @param {X86CPU|Component} cpu
     * @param {Debugger|Component} dbg
     * @param {number} size of block
     */
    setDebugInfo: function(cpu, dbg, size) {
        if (DEBUGGER) {
            this.cpu = cpu;
            this.dbg = dbg;
            this.cReadBreakpoints = this.cWriteBreakpoints = 0;
            if (this.dbg) this.dbg.redoBreakpoints(this.addr, size);
        }
    },
    /**
     * addBreakpoint(off, fWrite)
     *
     * @this {Memory}
     * @param {number} off
     * @param {boolean} fWrite
     */
    addBreakpoint: function(off, fWrite) {
        if (DEBUGGER) {
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
        if (DEBUGGER) {
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
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readNone: function readNone(off) {
        if (DEBUGGER && this.dbg.messageEnabled(Messages.MEM) /* && !off */) {
            this.dbg.message("attempt to read invalid block %" + str.toHex(this.addr) + " from " + this.dbg.hexOffset(this.cpu.getIP(), this.cpu.getCS()));
        }
        return 0;
    },
    /**
     * writeNone(off, v)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} v (could be either a byte or word value, since we use the same handler for both kinds of accesses)
     */
    writeNone: function writeNone(off, v)
    {
        if (DEBUGGER && this.dbg.messageEnabled(Messages.MEM) /* && !off */) {
            this.dbg.message("attempt to write " + str.toHexWord(v) + " to invalid block %" + str.toHex(this.addr), true);
        }
    },
    /**
     * readByteMemory(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readByteMemory: function readByteMemory(off)
    {
        Component.assert(off >= 0 && off < this.size);
        if (FATARRAYS) {
            return this.ab[off];
        }
        return ((this.adw[off >> 2] >>> ((off & 0x3) << 3)) & 0xff);
    },
    /**
     * readShortMemory(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readShortMemory: function readShortMemory(off)
    {
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
     * readLongMemory(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readLongMemory: function readLongMemory(off)
    {
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
     * writeByteMemory(off, b)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     */
    writeByteMemory: function writeByteMemory(off, b)
    {
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
     * writeShortMemory(off, w)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     */
    writeShortMemory: function writeShortMemory(off, w)
    {
        Component.assert(off >= 0 && off < this.size - 1 && (w & 0xffff) == w);
        if (FATARRAYS) {
            this.ab[off] = (w & 0xff);
            this.ab[off + 1] = (w >> 8);
        } else {
            var idw = off >> 2;
            var nShift = (off & 0x3) << 3;
            if (nShift < 24) {
                /*
                 *  0:  0xffff0000
                 *  8:  0xff0000ff
                 * 16:  0x0000ffff
                 */
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
     * writeLongMemory(off, l)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     */
    writeLongMemory: function writeLongMemory(off, l)
    {
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
                /*
                 *  8:  0xffffff00
                 * 16:  0xffff0000
                 * 24:  0xff000000
                 */
                var mask = (0xffffffff|0) << nShift;
                this.adw[idw] = (this.adw[idw] & ~mask) | (l << nShift);
                idw++;
                this.adw[idw] = (this.adw[idw] & mask) | (l >>> (32 - nShift));
            }
        }
        this.fDirty = true;
    },
    /**
     * readByteChecked(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readByteChecked: function readByteChecked(off)
    {
        if (DEBUGGER) this.dbg.checkMemoryRead(this.addr + off);
        return this.readByteDirect(off);
    },
    /**
     * readShortChecked(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readShortChecked: function readShortChecked(off)
    {
        if (DEBUGGER) {
            this.dbg.checkMemoryRead(this.addr + off) ||
            this.dbg.checkMemoryRead(this.addr + off + 1);
        }
        return this.readShortDirect(off);
    },
    /**
     * readLongChecked(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readLongChecked: function readLongChecked(off)
    {
        if (DEBUGGER) {
            this.dbg.checkMemoryRead(this.addr + off) ||
            this.dbg.checkMemoryRead(this.addr + off + 1) ||
            this.dbg.checkMemoryRead(this.addr + off + 2) ||
            this.dbg.checkMemoryRead(this.addr + off + 3);
        }
        return this.readLongDirect(off);
    },
    /**
     * writeByteChecked(off, b)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     */
    writeByteChecked: function writeByteChecked(off, b)
    {
        if (DEBUGGER) this.dbg.checkMemoryWrite(this.addr + off);
        this.writeByteDirect(off, b);
    },
    /**
     * writeShortChecked(off, w)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     */
    writeShortChecked: function writeShortChecked(off, w)
    {
        if (DEBUGGER) {
            this.dbg.checkMemoryWrite(this.addr + off) ||
            this.dbg.checkMemoryWrite(this.addr + off + 1);
        }
        this.writeShortDirect(off, w);
    },
    /**
     * writeLongChecked(off, l)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     */
    writeLongChecked: function writeLongChecked(off, l)
    {
        if (DEBUGGER) {
            this.dbg.checkMemoryWrite(this.addr + off) ||
            this.dbg.checkMemoryWrite(this.addr + off + 1) ||
            this.dbg.checkMemoryWrite(this.addr + off + 2) ||
            this.dbg.checkMemoryWrite(this.addr + off + 3);
        }
        this.writeLongDirect(off, l);
    },
    /**
     * readByteBigEndian(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readByteBigEndian: function readByteBigEndian(off)
    {
        Component.assert(off >= 0 && off < this.size);
        return this.ab[off];
    },
    /**
     * readByteLittleEndian(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readByteLittleEndian: function readByteLittleEndian(off)
    {
        Component.assert(off >= 0 && off < this.size);
        return this.ab[off];
    },
    /**
     * readShortBigEndian(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readShortBigEndian: function readShortBigEndian(off)
    {
        Component.assert(off >= 0 && off < this.size - 1);
        return this.dv.getUint16(off, true);
    },
    /**
     * readShortLittleEndian(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readShortLittleEndian: function readShortLittleEndian(off)
    {
        Component.assert(off >= 0 && off < this.size - 1);
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset
         * for an aligned read vs. always reading the bytes separately; it seems a safe bet
         * for longs, but it's less clear for shorts.
         */
        return (off & 0x1)? (this.ab[off] | (this.ab[off+1] << 8)) : this.aw[off >> 1];
    },
    /**
     * readLongBigEndian(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readLongBigEndian: function readLongBigEndian(off)
    {
        Component.assert(off >= 0 && off < this.size - 3);
        return this.dv.getInt32(off, true);
    },
    /**
     * readLongLittleEndian(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readLongLittleEndian: function readLongLittleEndian(off)
    {
        Component.assert(off >= 0 && off < this.size - 3);
        /*
         * TODO: It remains to be seen if there's any advantage to checking the offset
         * for an aligned read vs. always reading the bytes separately; it seems a safe bet
         * for longs, but it's less clear for shorts.
         */
        return (off & 0x3)? (this.ab[off] | (this.ab[off+1] << 8) | (this.ab[off+2] << 16) | (this.ab[off+3] << 24)) : this.adw[off >> 2];
    },
    /**
     * writeByteBigEndian(off, b)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     */
    writeByteBigEndian: function writeByteBigEndian(off, b)
    {
        Component.assert(off >= 0 && off < this.size);
        this.ab[off] = b;
        this.fDirty = true;
    },
    /**
     * writeByteLittleEndian(off, b)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     */
    writeByteLittleEndian: function writeByteLittleEndian(off, b)
    {
        Component.assert(off >= 0 && off < this.size);
        this.ab[off] = b;
        this.fDirty = true;
    },
    /**
     * writeShortBigEndian(off, w)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     */
    writeShortBigEndian: function writeShortBigEndian(off, w)
    {
        Component.assert(off >= 0 && off < this.size - 1);
        this.dv.setUint16(off, w, true);
        this.fDirty = true;
    },
    /**
     * writeShortLittleEndian(off, w)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     */
    writeShortLittleEndian: function writeShortLittleEndian(off, w)
    {
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
     * writeLongBigEndian(off, l)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     */
    writeLongBigEndian: function writeLongBigEndian(off, l)
    {
        Component.assert(off >= 0 && off < this.size - 3);
        this.dv.setInt32(off, l, true);
        this.fDirty = true;
    },
    /**
     * writeLongLittleEndian(off, l)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} l
     */
    writeLongLittleEndian: function writeLongLittleEndian(off, l)
    {
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
    readBackTrackNone: function readBackTrackNone(off)
    {
        return 0;
    },
    /**
     * writeBackTrackNone(off, bti)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} bti
     */
    writeBackTrackNone: function writeBackTrackNone(off, bti)
    {
    },
    /**
     * modBackTrackNone(fMod)
     *
     * @this {Memory}
     * @param {boolean} fMod
     */
    modBackTrackNone: function modBackTrackNone(fMod)
    {
        return false;
    },
    /**
     * readBackTrackIndex(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readBackTrackIndex: function readBackTrackIndex(off)
    {
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
    writeBackTrackIndex: function writeBackTrackIndex(off, bti)
    {
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
    modBackTrackIndex: function modBackTrackIndex(fMod)
    {
        var fModPrev = this.fModBackTrack;
        this.fModBackTrack = fMod;
        return fModPrev;
    }
};

Memory.afnMemory           = [Memory.prototype.readByteMemory,  Memory.prototype.readShortMemory,  Memory.prototype.readLongMemory,  Memory.prototype.writeByteMemory,  Memory.prototype.writeShortMemory,  Memory.prototype.writeLongMemory];
Memory.afnChecked          = [Memory.prototype.readByteChecked, Memory.prototype.readShortChecked, Memory.prototype.readLongChecked, Memory.prototype.writeByteChecked, Memory.prototype.writeShortChecked, Memory.prototype.writeLongChecked];

if (TYPEDARRAYS) {
    Memory.afnBigEndian    = [Memory.prototype.readByteBigEndian,    Memory.prototype.readShortBigEndian,    Memory.prototype.readLongBigEndian,    Memory.prototype.writeByteBigEndian,    Memory.prototype.writeShortBigEndian,    Memory.prototype.writeLongBigEndian];
    Memory.afnLittleEndian = [Memory.prototype.readByteLittleEndian, Memory.prototype.readShortLittleEndian, Memory.prototype.readLongLittleEndian, Memory.prototype.writeByteLittleEndian, Memory.prototype.writeShortLittleEndian, Memory.prototype.writeLongLittleEndian];
}

if (typeof module !== 'undefined') module.exports = Memory;
