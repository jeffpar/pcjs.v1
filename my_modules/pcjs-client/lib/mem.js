/**
 * @fileoverview Implements the PCjs "physical" Memory component.
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
    var Debugger    = require("./debugger");
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

/**
 * Memory(addr, size, fReadOnly, controller)
 *
 * The Bus component allocates Memory objects so that each has a memory buffer with a
 * block-granular starting address and an address range equal to bus.blockSize; however,
 * the size of any given Memory object's underlying buffer can be either zero or bus.blockSize;
 * memory read/write functions for empty (buffer-less) blocks are mapped to readNone/writeNone.
 *
 * The Bus allocates empty blocks for the entire address space during initialization, so that
 * any reads/writes to undefined addresses will have no effect.  Later, the ROM and RAM
 * components will ask the Bus to allocate memory for specific ranges, and the Bus will allocate
 * as many new BLOCK_SIZE Memory objects as the ranges require.  Partial Memory blocks could be
 * supported in theory, but in practice, they're not.
 *
 * NOTE: Since Memory blocks are low-level objects that have no UI requirements, they do not
 * inherit from the Component class; so, if you want to use println(), for example, you must
 * use the methods in the Debugger class.
 *
 * Because Memory blocks now allow us to have a "sparse" address space, we could choose to
 * take the memory hit of allocating 4K arrays per block, where each element stores only one byte,
 * instead of the more frugal but slightly slower approach of allocating arrays of 32-bit dwords
 * (DWORDARRAYS) and shifting/masking bytes/words to/from dwords; in theory, byte accesses would
 * be faster and word accesses somewhat less faster.
 *
 * However, preliminary testing of that feature (FATARRAYS) did not yield significantly faster
 * performance, so it is OFF by default to minimize our memory consumption.  Using TYPEDARRAYS is
 * probably best, although not all JavaScript implementations support them (IE9 is probably the
 * only real outlier: it lacks typed arrays but otherwise has all the necessary HTML5 support).
 *
 * @constructor
 * @param {number} addr of block (must be some multiple of bus.blockSize)
 * @param {number} [size] of block's buffer in bytes (0 for none); must be a multiple of 4
 * @param {boolean} [fReadOnly] is true if the block must be marked read-only
 * @param {Object} [controller] is an optional memory controller component
 */
function Memory(addr, size, fReadOnly, controller) {
    this.cb = size || 0;
    this.adw = null;
    this.offset = 0;
    this.fReadOnly = fReadOnly;
    this.controller = null;
    this.fDirty = this.fDirtyEver = false;

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
     */
    if (TYPEDARRAYS) {
        this.buffer = new ArrayBuffer(size);
        /**
         * @type {DataView}
         */
        this.dv = new DataView(this.buffer, 0, size);
        /*
         * We could also use dv.getUint8() and dv.setUint8(), but using ab[] to get/set bytes
         * in this.buffer is more convenient and presents no "endianness" issues.
         */
        this.ab = new Uint8Array(this.buffer, 0, size);
        this.setAccess(Memory.afnTypedArray);
    } else {
        if (FATARRAYS) {
            this.ab = new Array(size);
        } else {
            this.adw = new Array(size >> 2);
            for (var i = 0; i < this.adw.length; i++) {
                this.adw[i] = 0;
            }
        }
        this.setAccess(Memory.afnMemory);
    }
}

Memory.prototype = {
    constructor: Memory,
    /**
     * readNone(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readNone: function(off) {
        if (DEBUGGER && this.dbg.messageEnabled(Debugger.MESSAGE.MEM) && !off) {
            this.dbg.message("attempt to read invalid block %" + str.toHex(this.addr) + " from " + str.toHexAddr(this.cpu.regIP, this.cpu.segCS.sel));
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
    writeNone: function(off, v) {
        if (DEBUGGER && this.dbg.messageEnabled(Debugger.MESSAGE.MEM) && !off) {
            this.dbg.message("attempt to write 0x" + str.toHexWord(v) + " to invalid block %" + str.toHex(this.addr) + " from " + str.toHexAddr(this.cpu.regIP, this.cpu.segCS.sel));
        }
    },
    /**
     * readByteMemory(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readByteMemory: function readByteMemory(off) {
        Component.assert(off >= 0 && off < this.cb);
        if (FATARRAYS) {
            return this.ab[off];
        }
        return ((this.adw[off >> 2] >>> ((off & 0x3) << 3)) & 0xff);
    },
    /**
     * readWordMemory(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readWordMemory: function readWordMemory(off) {
        Component.assert(off >= 0 && off < this.cb - 1);
        if (FATARRAYS) {
            return this.ab[off] | (this.ab[off + 1] << 8);
        }
        var w;
        var idw = off >> 2;
        var nShift = (off & 0x3) << 3;
        var dw = (this.adw[idw] >>> nShift);
        if (nShift < 24) {
            w = dw & 0xffff;
        } else {
            w = (dw & 0xff) | ((this.adw[idw + 1] & 0xff) << 8);
        }
        return w;
    },
    /**
     * writeByteMemory(off, b)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     */
    writeByteMemory: function writeByteMemory(off, b) {
        Component.assert(off >= 0 && off < this.cb && (b & 0xff) == b);
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
     * writeWordMemory(off, w)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     */
    writeWordMemory: function writeWordMemory(off, w) {
        Component.assert(off >= 0 && off < this.cb - 1 && (w & 0xffff) == w);
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
                this.adw[idw] = (this.adw[idw] & 0xffffff00) | (w >> 8);
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
    readByteChecked: function readByteChecked(off) {
        if (DEBUGGER) this.dbg.checkMemoryRead(this.addr + off);
        return this.readByteDirect(off);
    },
    /**
     * readWordChecked(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readWordChecked: function readWordChecked(off) {
        if (DEBUGGER) {
            this.dbg.checkMemoryRead(this.addr + off) || this.dbg.checkMemoryRead(this.addr + off + 1);     // jshint ignore:line
        }
        return this.readWordDirect(off);
    },
    /**
     * writeByteChecked(off, b)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     */
    writeByteChecked: function writeByteChecked(off, b) {
        if (DEBUGGER) this.dbg.checkMemoryWrite(this.addr + off);
        this.writeByteDirect(off, b);
    },
    /**
     * writeWordChecked(off, w)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     */
    writeWordChecked: function writeWordChecked(off, w) {
        if (DEBUGGER) {
            this.dbg.checkMemoryWrite(this.addr + off) || this.dbg.checkMemoryWrite(this.addr + off + 1);   // jshint ignore:line
        }
        this.writeWordDirect(off, w);
    },
    /**
     * readByteTypedArray(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readByteTypedArray: function readByteTypedArray(off) {
        Component.assert(off >= 0 && off < this.cb);
        return this.ab[off];
    },
    /**
     * readWordTypedArray(off)
     *
     * @this {Memory}
     * @param {number} off
     * @return {number}
     */
    readWordTypedArray: function readWordTypedArray(off) {
        Component.assert(off >= 0 && off < this.cb - 1);
        return this.dv.getUint16(off, true);
    },
    /**
     * writeByteTypedArray(off, b)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} b
     */
    writeByteTypedArray: function writeByteTypedArray(off, b) {
        Component.assert(off >= 0 && off < this.cb && (b & 0xff) == b);
        this.ab[off] = b;
        this.fDirty = true;
    },
    /**
     * writeWordTypedArray(off, w)
     *
     * @this {Memory}
     * @param {number} off
     * @param {number} w
     */
    writeWordTypedArray: function writeWordTypedArray(off, w) {
        Component.assert(off >= 0 && off < this.cb - 1 && (w & 0xffff) == w);
        this.dv.setUint16(off, w, true);
        this.fDirty = true;
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
            adw = new Array(this.cb >> 2);
            var off = 0;
            for (i = 0; i < adw.length; i++) {
                adw[i] = this.ab[off] | (this.ab[off + 1] << 8) | (this.ab[off + 2] << 16) | (this.ab[off + 3] << 24);
                off += 4;
            }
        }
        else if (TYPEDARRAYS) {
            /*
             * It might be tempting to just return a copy of Int32Array(this.buffer, 0, this.cb >> 2),
             * but we can't be sure of the "endianness" of an Int32Array -- which would be OK if the array
             * was always saved/restored on the same machine, but there's no guarantee of that, either.
             * So we use getInt32() and require little-endian values.
             *
             * Moreover, an Int32Array isn't treated by JSON.stringify() and JSON.parse() exactly like
             * a normal array; it's serialized as an Object rather than an Array, so it lacks a "length"
             * property and causes problems for State.store() and State.parse().
             */
            adw = new Array(this.cb >> 2);
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
         * card's "spec'ed" address instead of the programmed address, hence there were no controller-owned
         * memory blocks installed at the programmed address, and so we arrived here at a block with no
         * controller AND no data.
         */
        Component.assert(adw != null);
        if (adw && this.cb == adw.length << 2) {
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
        this.readByte = afn[0]? afn[0] : this.readNone;
        this.readWord = afn[1]? afn[1] : this.readNone;
        if (fDirect) {
            this.readByteDirect = afn[0]? afn[0] : this.readNone;
            this.readWordDirect = afn[1]? afn[1] : this.readNone;
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
        this.writeByte = afn[2] && !this.fReadOnly? afn[2] : this.writeNone;
        this.writeWord = afn[3] && !this.fReadOnly? afn[3] : this.writeNone;
        if (fDirect) {
            this.writeByteDirect = afn[2]? afn[2] : this.writeNone;
            this.writeWordDirect = afn[3]? afn[3] : this.writeNone;
        }
    },
    /**
     * resetReadAccess()
     *
     * @this {Memory}
     */
    resetReadAccess: function() {
        this.readByte = this.readByteDirect;
        this.readWord = this.readWordDirect;
    },
    /**
     * resetWriteAccess()
     *
     * @this {Memory}
     */
    resetWriteAccess: function() {
        this.writeByte = this.fReadOnly? this.writeNone : this.writeByteDirect;
        this.writeWord = this.fReadOnly? this.writeNone : this.writeWordDirect;
    },
    /**
     * setDebugInfo(cpu, dbg, addr, size)
     *
     * @this {Memory}
     * @param {X86CPU|Component} cpu
     * @param {Debugger|Component} dbg
     * @param {number} addr of block
     * @param {number} size of block
     */
    setDebugInfo: function(cpu, dbg, addr, size) {
        if (DEBUGGER) {
            this.cpu = cpu;
            this.dbg = dbg;
            this.addr = addr;
            this.cReadBreakpoints = this.cWriteBreakpoints = 0;
            if (this.dbg) this.dbg.redoBreakpoints(addr, size);
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
                Component.assert(this.cReadBreakpoints >= 0);
            }
            else {
                if (--this.cWriteBreakpoints === 0) {
                    this.resetWriteAccess();
                    if (DEBUG) this.dbg.println("all write breakpoints removed from memory block " + str.toHex(this.addr));
                }
                Component.assert(this.cWriteBreakpoints >= 0);
            }
        }
    }
};

Memory.afnMemory = [Memory.prototype.readByteMemory, Memory.prototype.readWordMemory, Memory.prototype.writeByteMemory, Memory.prototype.writeWordMemory];
Memory.afnChecked = [Memory.prototype.readByteChecked, Memory.prototype.readWordChecked, Memory.prototype.writeByteChecked, Memory.prototype.writeWordChecked];

if (TYPEDARRAYS) {
    Memory.afnTypedArray = [Memory.prototype.readByteTypedArray, Memory.prototype.readWordTypedArray, Memory.prototype.writeByteTypedArray, Memory.prototype.writeWordTypedArray];
}

if (typeof APP_PCJS !== 'undefined') APP_PCJS.Memory = Memory;

if (typeof module !== 'undefined') module.exports = Memory;
