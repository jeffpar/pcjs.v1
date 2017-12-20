/**
 * @fileoverview Implements the PCx86 RAM component.
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
    var Str         = require("../../shared/lib/strlib");
    var Web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var State       = require("../../shared/lib/state");
    var PCX86       = require("./defines");
    var Memory      = require("./memory");
    var ROMx86      = require("./rom");
}

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class RAM extends Component {
    /**
     * RAM(parmsRAM)
     *
     * The RAM component expects the following (parmsRAM) properties:
     *
     *      addr: starting physical address of RAM (default is 0)
     *      size: amount of RAM, in bytes (default is 0, which means defer to motherboard switch settings)
     *      test: true (default) means don't interfere with any BIOS memory tests, false means "fake a warm boot"
     *
     * NOTE: We make a note of the specified size, but no memory is initially allocated for the RAM until the
     * Computer component calls powerUp().
     *
     * @this {RAM}
     * @param {Object} parmsRAM
     */
    constructor(parmsRAM)
    {
        super("RAM", parmsRAM);

        this.addrRAM = parmsRAM['addr'];
        this.sizeRAM = parmsRAM['size'];
        this.fTestRAM = parmsRAM['test'];
        this.fInstalled = (!!this.sizeRAM); // 0 is the default value for 'size' when none is specified
        this.fAllocated = false;
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {RAM}
     * @param {Computer} cmp
     * @param {Bus} bus
     * @param {X86CPU} cpu
     * @param {DebuggerX86} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.bus = bus;
        this.cpu = cpu;
        this.dbg = dbg;
        this.chipset = cmp.getMachineComponent("ChipSet");
        this.setReady();
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {RAM}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        if (!fRepower) {
            /*
             * The Computer powers up the CPU last, at which point X86CPU state is restored,
             * which includes the Bus state, and since we use the Bus to allocate all our memory,
             * memory contents are already restored for us, so we don't need the usual restore
             * logic.  We just need to call reset(), to allocate memory for the RAM.
             *
             * The only exception is when there's a custom Memory controller (eg, CompaqController).
             */
            this.reset();
            if (data && this.controller) {
                if (!this.restore(data)) return false;
            }
        }
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {RAM}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown(fSave, fShutdown)
    {
        /*
         * The Computer powers down the CPU first, at which point X86CPU state is saved,
         * which includes the Bus state, and since we use the Bus component to allocate all
         * our memory, memory contents are already saved for us, so we don't need the usual
         * save logic.
         *
         * The only exception is when there's a custom Memory controller (eg, CompaqController).
         */
        return (fSave && this.controller)? this.save() : true;
    }

    /**
     * reset()
     *
     * NOTE: When we were initialized, we were given an amount of INSTALLED memory (see sizeRAM above).
     * The ChipSet component, on the other hand, tells us how much SPECIFIED memory there is -- which,
     * like a real PC, may not match the amount of installed memory (due to either user error or perhaps
     * an attempt to prevent some portion of the installed memory from being used).
     *
     * However, since we're a virtual machine, we can defer allocation of RAM until we're able to query the
     * ChipSet component, and then allocate an amount of memory that matches the SPECIFIED memory, making
     * it easy to reconfigure the machine on the fly and prevent mismatches.
     *
     * But, we do that ONLY for the RAM instance configured with an addrRAM of 0x0000, and ONLY if that RAM
     * object was not given a specific size (see fInstalled).  If there are other RAM objects in the system,
     * they must necessarily specify a non-conflicting, non-zero start address, in which case their sizeRAM
     * value will never be affected by the ChipSet settings.
     *
     * @this {RAM}
     */
    reset()
    {
        if (!this.addrRAM && !this.fInstalled && this.chipset) {
            var baseRAM = this.chipset.getDIPMemorySize() * 1024;
            if (this.sizeRAM && baseRAM != this.sizeRAM) {
                this.bus.removeMemory(this.addrRAM, this.sizeRAM);
                this.fAllocated = false;
            }
            this.sizeRAM = baseRAM;
        }
        if (!this.fAllocated && this.sizeRAM) {
            if (this.bus.addMemory(this.addrRAM, this.sizeRAM, Memory.TYPE.RAM)) {
                this.fAllocated = true;

                /*
                 * NOTE: I'm specifying MAXDEBUG for status() messages because I'm not yet sure I want these
                 * messages buried in the app, since they're seen only when a Control Panel is active.  Another
                 * and perhaps better alternative is to add "comment" attributes to the XML configuration file
                 * for these components, which the Computer component will display as it "powers up" components.
                 */
                if (MAXDEBUG && this.fInstalled) this.status("specified size overrides SW1");

                /*
                 * Memory with an ID of "ramCPQ" is reserved for built-in memory located just below the 16Mb
                 * boundary on COMPAQ DeskPro 386 machines.
                 *
                 * Technically, that memory is part of the first 1Mb of memory that also provides up to 640Kb
                 * of conventional memory (ie, memory below 1Mb).
                 *
                 * However, PCx86 doesn't support individual memory allocations that (a) are discontiguous
                 * or (b) dynamically change location.  Components must simulate those features by performing
                 * a separate allocation for each starting address, and removing/adding memory allocations
                 * whenever their starting address changes.
                 *
                 * Therefore, a DeskPro 386's first 1Mb of physical memory is allocated by PCx86 in two pieces,
                 * and the second piece must have an ID of "ramCPQ", triggering the additional allocation of
                 * COMPAQ-specific memory-mapped registers.
                 *
                 * See CompaqController for more details.
                 */
                if (DESKPRO386) {
                    if (this.idComponent == "ramCPQ") {
                        this.controller = new CompaqController(this);
                        this.bus.addMemory(CompaqController.ADDR, 4, Memory.TYPE.CTRL, this.controller);
                    }
                }
            }
        }
        if (this.fAllocated) {
            if (!this.fTestRAM) {
                /*
                 * HACK: Set the word at 40:72 in the ROM BIOS Data Area (RBDA) to 0x1234 to bypass the ROM BIOS
                 * memory storage tests. See rom.js for all RBDA definitions.
                 */
                if (MAXDEBUG) this.status("ROM BIOS memory test has been disabled");
                this.bus.setShortDirect(ROMx86.BIOS.RESET_FLAG, ROMx86.BIOS.RESET_FLAG_WARMBOOT);
            }
            /*
             * Don't add the "ramCPQ" memory to the CMOS total, because addCMOSMemory() will add it to the extended
             * memory total, which will just confuse the COMPAQ BIOS.
             */
            if (!DESKPRO386 || this.idComponent != "ramCPQ") {
                if (this.chipset) this.chipset.addCMOSMemory(this.addrRAM, this.sizeRAM);
            }
        } else {
            Component.error("No RAM allocated");
        }
    }

    /**
     * save()
     *
     * This implements save support for the RAM component.
     *
     * @this {RAM}
     * @return {Object}
     */
    save()
    {
        var state = new State(this);
        if (this.controller) state.set(0, this.controller.save());
        return state.data();
    }

    /**
     * restore(data)
     *
     * This implements restore support for the RAM component.
     *
     * @this {RAM}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    restore(data)
    {
        if (this.controller) return this.controller.restore(data[0]);
        return true;
    }

    /**
     * RAM.init()
     *
     * This function operates on every HTML element of class "ram", extracting the
     * JSON-encoded parameters for the RAM constructor from the element's "data-value"
     * attribute, invoking the constructor to create a RAM component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeRAM = Component.getElementsByClass(document, PCX86.APPCLASS, "ram");
        for (var iRAM = 0; iRAM < aeRAM.length; iRAM++) {
            var eRAM = aeRAM[iRAM];
            var parmsRAM = Component.getComponentParms(eRAM);
            var ram = new RAM(parmsRAM);
            Component.bindComponentControls(ram, eRAM, PCX86.APPCLASS);
        }
    }
}

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class CompaqController {
    /**
     * CompaqController(ram)
     *
     * DeskPro 386 machines came with a minimum of 1Mb of RAM, which could be configured (via jumpers)
     * for 256Kb, 512Kb or 640Kb of conventional memory, starting at address 0x00000000, with the
     * remainder (768Kb, 512Kb, or 384Kb) accessible only at an address just below 0x01000000.  In PCx86,
     * this second chunk of RAM must be separately allocated, with an ID of "ramCPQ".
     *
     * The typical configuration was 640Kb of conventional memory, leaving 384Kb accessible at 0x00FA0000.
     * Presumably, the other configurations (256Kb and 512Kb) would leave 768Kb and 512Kb accessible at
     * 0x00F40000 and 0x00F80000, respectively.
     *
     * The DeskPro 386 also contained two memory-mapped registers at 0x80C00000.  The first is a write-only
     * mapping register that provides the ability to map the 128Kb at 0x00FE0000 to 0x000E0000, replacing
     * any ROMs in the range 0x000E0000-0x000FFFFF, and optionally write-protecting that 128Kb; internally,
     * this register corresponds to wMappings.
     *
     * The second register is a read-only diagnostics register that indicates jumper configuration and
     * parity errors; internally, this register corresponds to wSettings.
     *
     * To emulate the memory-mapped registers at 0x80C00000, the RAM component allocates a block at that
     * address using this custom controller once it sees an allocation for "ramCPQ".
     *
     * Later, when the addressability of "ramCPQ" memory is altered, we record the blocks in all the
     * memory slots spanning 0x000E0000-0x000FFFFF, and then update those slots with the blocks from
     * 0x00FE0000-0x00FFFFFF.  Note that only the top 128Kb of "ramCPQ" addressability is affected; the
     * rest of that memory, ranging anywhere from 256Kb to 640Kb, remains addressable at its original
     * location.  COMPAQ's CEMM and VDISK utilities were generally the only software able to access that
     * remaining memory (what COMPAQ refers to as "Compaq Built-in Memory").
     *
     * @this {CompaqController}
     * @param {RAM} ram
     */
    constructor(ram)
    {
        this.ram = ram;
        this.wMappings = CompaqController.MAPPINGS.DEFAULT;
        /*
         * TODO: wSettings needs to reflect the actual amount of configured memory....
         */
        this.wSettings = CompaqController.SETTINGS.DEFAULT;
        this.wRAMSetup = CompaqController.RAMSETUP.DEFAULT;
        this.aBlocksDst = null;
    }

    /**
     * save()
     *
     * This implements save support for the CompaqController component.
     *
     * @this {CompaqController}
     * @return {Array}
     */
    save()
    {
        return [this.wMappings, this.wRAMSetup];
    }

    /**
     * restore(data)
     *
     * This implements restore support for the CompaqController component.
     *
     * @this {CompaqController}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    restore(data)
    {
        this.setByte(0, data[0] & 0xff);
        this.setByte(2, data[1] & 0xff);
        return true;
    }

    /**
     * getByte(off)
     *
     * @this {CompaqController}
     * @param {number} off
     * @return {number}
     */
    getByte(off)
    {
        /*
         * Offsets 0-3 correspond to reads from 0x80C00000-0x80C00003; anything outside that range
         * returns our standard non-responsive value of 0xff.
         */
        var b = 0xff;
        if (off < 0x02) {
            b = (off & 0x1)? (this.wSettings >> 8) : (this.wSettings & 0xff);
        }
        else if (off < 0x4) {
            b = (off & 0x1)? (this.wRAMSetup >> 8) : (this.wRAMSetup & 0xff);
        }
        return b;
    }

    /**
     * setByte(off, b)
     *
     * @this {CompaqController}
     * @param {number} off (relative to 0x80C00000)
     * @param {number} b
     */
    setByte(off, b)
    {
        if (!off) {
            /*
             * This is a write to 0x80C00000
             */
            if (b != (this.wMappings & 0xff)) {
                var bus = this.ram.bus;
                if (!(b & CompaqController.MAPPINGS.UNMAPPED)) {
                    if (!this.aBlocksDst) {
                        this.aBlocksDst = bus.getMemoryBlocks(CompaqController.MAP_DST, CompaqController.MAP_SIZE);
                    }
                    /*
                     * You might think that the next three lines could ALSO be moved to the preceding IF,
                     * but it's possible for the write-protection feature to be enabled/disabled separately
                     * from the mapping feature.  We could avoid executing this code as well by checking the
                     * current read-write state, but this is an infrequent operation, so there's no point.
                     */
                    var aBlocks = bus.getMemoryBlocks(CompaqController.MAP_SRC, CompaqController.MAP_SIZE);
                    var type = (b & CompaqController.MAPPINGS.READWRITE)? Memory.TYPE.RAM : Memory.TYPE.ROM;
                    bus.setMemoryBlocks(CompaqController.MAP_DST, CompaqController.MAP_SIZE, aBlocks, type);
                }
                else {
                    if (this.aBlocksDst) {
                        bus.setMemoryBlocks(CompaqController.MAP_DST, CompaqController.MAP_SIZE, this.aBlocksDst);
                        this.aBlocksDst = null;
                    }
                }
                this.wMappings = (this.wMappings & ~0xff) | b;
            }
        }
        else if (off == 0x2) {
            /*
             * This is a write to 0x80C00002
             */
            this.wRAMSetup = (this.wRAMSetup & ~0xff) | b;
        }
    }

    /**
     * getMemoryBuffer(addr)
     *
     * @this {CompaqController}
     * @param {number} addr
     * @return {Array} containing the buffer (and an offset within that buffer)
     */
    getMemoryBuffer(addr)
    {
        return CompaqController.BUFFER;
    }

    /**
     * getMemoryAccess()
     *
     * @this {CompaqController}
     * @return {Array.<function()>}
     */
    getMemoryAccess()
    {
        return CompaqController.ACCESS;
    }

    /**
     * readByte(off, addr)
     *
     * NOTE: Even though we asked bus.addMemory() for only 4 bytes, corresponding to the 4 memory-mapped register
     * locations we must manage, we're at the mercy of the Bus component's physical block allocation granularity,
     * which, on 80386-based machines, is fixed at 4K (the same as the 80386 page size, to simplify emulation of paging).
     *
     * So we must allow for requests outside that 4-byte range.
     *
     * @this {Memory}
     * @param {number} off (relative to 0x80C00000)
     * @param {number} [addr]
     * @return {number}
     */
    static readByte(off, addr)
    {
        var b = this.controller.getByte(off);
        if (DEBUG) {
            this.controller.ram.printMessage("CompaqController.readByte(" + Str.toHexWord(off) + ") returned " + Str.toHexByte(b), 0, true);
        }
        return b;
    }

    /**
     * writeByte(off, b, addr)
     *
     * NOTE: Even though we asked bus.addMemory() for only 4 bytes, corresponding to the 4 memory-mapped register
     * locations we must manage, we're at the mercy of the Bus component's physical memory allocation granularity,
     * which, on 80386-based machines, is fixed at 4K (the same as the 80386 page size, to simplify emulation of paging).
     *
     * So we must allow for requests outside that 4-byte range.
     *
     * @this {Memory}
     * @param {number} off (relative to 0x80C00000)
     * @param {number} b
     * @param {number} [addr]
     */
    static writeByte(off, b, addr)
    {
        this.controller.setByte(off, b);
        /*
         * All bits in 0x80C00001 and 0x80C00003 are reserved, so we can simply ignore those writes.
         */
        if (DEBUG) {
            this.controller.ram.printMessage("CompaqController.writeByte(" + Str.toHexWord(off) + "," + Str.toHexByte(b) + ")", 0, true);
        }
    }
}

CompaqController.ADDR       = 0x80C00000|0;
CompaqController.MAP_SRC    = 0x00FE0000;
CompaqController.MAP_DST    = 0x000E0000;
CompaqController.MAP_SIZE   = 0x00020000;

/*
 * Bit definitions for the 16-bit write-only memory-mapping register (wMappings)
 *
 * NOTE: Although COMPAQ says the memory at %FE0000 is "relocated", it actually remains addressable
 * at %FE0000; it simply becomes addressable at %0E0000 as well, displacing any ROMs that used to be
 * addressable at %0E0000 through %0FFFFF.
 */
CompaqController.MAPPINGS = {
    UNMAPPED:   0x0001,             // is this bit is CLEAR, the last 128Kb (at 0x00FE0000) is mapped to 0x000E0000
    READWRITE:  0x0002,             // if this bit is CLEAR, the last 128Kb (at 0x00FE0000) is read-only (ie, write-protected)
    RESERVED:   0xFFFC,             // the remaining 6 bits are reserved and should always be SET
    DEFAULT:    0xFFFF              // our default settings (no mapping, no write-protection)
};

/*
 * Bit definitions for the 16-bit read-only settings/diagnostics register (wSettings)
 *
 * SW1-7 and SW1-8 are mapped to bits 5 and 4 of wSettings, respectively, as follows:
 *
 *      SW1-7   SW1-8   Bit5    Bit4    Amount (of base memory provided by the COMPAQ 32-bit memory board)
 *      -----   -----   ----    ----    ------
 *        ON      ON      0       0     640Kb
 *        ON      OFF     0       1     Invalid
 *        OFF     ON      1       0     512Kb
 *        OFF     OFF     1       1     256Kb
 *
 * Other SW1 switches include:
 *
 *      SW1-1:  ON enables fail-safe timer
 *      SW1-2:  ON indicates 80387 coprocessor installed
 *      SW1-3:  ON sets memory from 0xC00000 to 0xFFFFFF (between 12 and 16 megabytes) non-cacheable
 *      SW1-4:  ON selects AUTO system speed (OFF selects HIGH system speed)
 *      SW1-5:  RESERVED (however, the system can read its state; see below)
 *      SW1-6:  COMPAQ Dual-Mode Monitor or Color Monitor (OFF selects Monochrome monitor other than COMPAQ)
 *
 * While SW1-7 and SW1-8 are connected to this memory-mapped register, other SW1 DIP switches are accessible
 * through the 8042 Keyboard Controller's KBC.INPORT register, as follows:
 *
 *      SW1-1:  TODO: Determine
 *      SW1-2:  ChipSet.KC8042.INPORT.COMPAQ_NO80387 clear if ON, set (0x04) if OFF
 *      SW1-3:  TODO: Determine
 *      SW1-4:  ChipSet.KC8042.INPORT.COMPAQ_HISPEED clear if ON, set (0x10) if OFF
 *      SW1-5:  ChipSet.KC8042.INPORT.COMPAQ_DIP5OFF clear if ON, set (0x20) if OFF
 *      SW1-6:  ChipSet.KC8042.INPORT.COMPAQ_NONDUAL clear if ON, set (0x40) if OFF
 */
CompaqController.SETTINGS = {
    B0_PARITY:  0x0001,         // parity OK in byte 0
    B1_PARITY:  0x0002,         // parity OK in byte 1
    B2_PARITY:  0x0004,         // parity OK in byte 2
    B3_PARITY:  0x0008,         // parity OK in byte 3
    BASE_640KB: 0x0000,         // SW1-7,8: ON  ON   Bits 5,4: 00
    BASE_ERROR: 0x0010,         // SW1-7,8: ON  OFF  Bits 5,4: 01
    BASE_512KB: 0x0020,         // SW1-7,8: OFF ON   Bits 5,4: 10
    BASE_256KB: 0x0030,         // SW1-7,8: OFF OFF  Bits 5,4: 11
    /*
     * TODO: The DeskPro 386/25 TechRef says bit 6 (0x40) is always set,
     * but setting it results in memory configuration errors; review.
     */
    ADDED_1MB:  0x0040,
    /*
     * TODO: The DeskPro 386/25 TechRef says bit 7 (0x80) is always clear; review.
     */
    PIGGYBACK:  0x0080,
    SYS_4MB:    0x0100,         // 4Mb on system board
    SYS_1MB:    0x0200,         // 1Mb on system board
    SYS_NONE:   0x0300,         // no memory on system board
    MODA_4MB:   0x0400,         // 4Mb on module A board
    MODA_1MB:   0x0800,         // 1Mb on module A board
    MODA_NONE:  0x0C00,         // no memory on module A board
    MODB_4MB:   0x1000,         // 4Mb on module B board
    MODB_1MB:   0x2000,         // 1Mb on module B board
    MODB_NONE:  0x3000,         // no memory on module B board
    MODC_4MB:   0x4000,         // 4Mb on module C board
    MODC_1MB:   0x8000,         // 1Mb on module C board
    MODC_NONE:  0xC000,         // no memory on module C board
    /*
     * NOTE: It doesn't seem to matter to the ROM whether I set any of bits 8-15 or not....
     */
    DEFAULT:    0x0A0F          // our default settings (ie, parity OK, 640Kb base memory, 1Mb system memory, 1Mb module A memory)
};

CompaqController.RAMSETUP = {
    SETUP:      0x000F,
    CACHE:      0x0040,
    RESERVED:   0xFFB0,
    DEFAULT:    0x0002          // our default settings (ie, 2Mb, cache disabled)
};

CompaqController.BUFFER = [null, 0];
CompaqController.ACCESS = [CompaqController.readByte, null, null, CompaqController.writeByte, null, null];

/*
 * Initialize all the RAM modules on the page.
 */
Web.onInit(RAM.init);

if (NODE) module.exports = RAM;
