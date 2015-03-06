/**
 * @fileoverview Implements the PCjs RAM component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jun-15
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
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var Memory      = require("./memory");
    var ROM         = require("./rom");
}

/**
 * RAM(parmsRAM)
 *
 * The RAM component expects the following (parmsRAM) properties:
 *
 *      addr: starting physical address of RAM
 *      size: amount of RAM, in bytes (optional)
 *
 * NOTE: We make a note of the specified size, but no memory is initially allocated
 * for the RAM until the Computer component calls powerUp().
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsRAM
 */
function RAM(parmsRAM)
{
    Component.call(this, "RAM", parmsRAM, RAM);

    this.addrRAM = parmsRAM['addr'];
    this.sizeRAM = parmsRAM['size'];
    this.fTestRAM = parmsRAM['test'];
    this.fInstalled = (!!this.sizeRAM); // 0 is the default value for 'size' when none is specified
    this.fAllocated = false;
}

Component.subclass(Component, RAM);

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {RAM}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {X86CPU} cpu
 * @param {Debugger} dbg
 */
RAM.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.chipset = cmp.getComponentByType("ChipSet");
    this.setReady();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {RAM}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
RAM.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        /*
         * The Computer powers up the CPU last, at which point the X86 state is restored,
         * which includes the Bus state, and since we use the Bus to allocate all our memory,
         * memory contents are already restored for us, so we don't need the usual restore
         * logic.  We just need to call reset(), to allocate memory for the RAM.
         *
        if (!data || !this.restore) {
            this.reset();
        } else {
            if (!this.restore(data)) return false;
        }
         */
        this.reset();
    }
    return true;
};

/**
 * powerDown(fSave)
 *
 * @this {RAM}
 * @param {boolean} fSave
 * @return {Object|boolean}
 */
RAM.prototype.powerDown = function(fSave)
{
    /*
     * The Computer powers down the CPU first, at which point the X86 state is saved,
     * which includes the Bus state, and since we use the Bus component to allocate all
     * our memory, memory contents are already saved for us, so we don't need the usual
     * save logic.
     *
    return fSave && this.save ? this.save() : true;
     */
    return true;
};

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
RAM.prototype.reset = function()
{
    if (!this.addrRAM && !this.fInstalled && this.chipset) {
        var baseRAM = this.chipset.getSWMemorySize() * 1024;
        if (this.sizeRAM && baseRAM != this.sizeRAM) {
            this.bus.removeMemory(this.addrRAM, this.sizeRAM);
            this.fAllocated = false;
        }
        this.sizeRAM = baseRAM;
    }
    if (!this.fAllocated && this.sizeRAM) {
        if (this.bus.addMemory(this.addrRAM, this.sizeRAM, Memory.TYPE.RAM)) {
            this.fAllocated = true;

            var status = Math.floor(this.sizeRAM / 1024) + "Kb";
            if (this.comment) {
                status += " (" + this.comment + ")";
                this.comment = null;
            }
            this.status(status);

            /*
             * NOTE: I'm specifying MAXDEBUG for status() messages because I'm not yet sure I want these
             * messages buried in the app, since they're seen only when a Control Panel is active.  Another
             * and perhaps better alternative is to add "comment" attributes to the XML configuration file
             * for these components, which the Computer component will display as it "powers up" components.
             */
            if (MAXDEBUG && this.fInstalled) this.status("specified size overrides SW1");
            /*
             * Memory with an ID of "ramCPQ" is reserved for built-in memory located just below the 16Mb
             * boundary on Compaq DeskPro 386 machines.
             *
             * Technically, that memory is part of the first 1Mb of memory that also provides up to 640Kb
             * of conventional memory (ie, memory below 1Mb).
             *
             * However, PCjs doesn't support individual memory allocations that (a) are discontiguous
             * or (b) dynamically change location.  Components must simulate those features by performing
             * a separate allocation for each starting address, and removing/adding memory allocations
             * whenever their starting address changes.
             *
             * Therefore, a DeskPro 386's first 1Mb of physical memory is allocated by PCjs in two pieces,
             * and the second piece must have an ID of "ramCPQ", triggering the additional allocation of
             * Compaq-specific memory-mapped registers.
             *
             * See CompaqController for more details.
             */
            if (COMPAQ386) {
                if (this.idComponent == "ramCPQ") {
                    this.controller = new CompaqController(this);
                    this.bus.addMemory(CompaqController.ADDR, 1, Memory.TYPE.CTRL, this.controller);
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
            this.bus.setShortDirect(ROM.BIOS.RESET_FLAG, ROM.BIOS.RESET_FLAG_WARMBOOT);
        }
        if (this.chipset) this.chipset.addCMOSMemory(this.addrRAM, this.sizeRAM);
    } else {
        Component.error("No RAM allocated");
    }
};

/**
 * RAM.init()
 *
 * This function operates on every HTML element of class "ram", extracting the
 * JSON-encoded parameters for the RAM constructor from the element's "data-value"
 * attribute, invoking the constructor to create a RAM component, and then binding
 * any associated HTML controls to the new component.
 */
RAM.init = function()
{
    var aeRAM = Component.getElementsByClass(window.document, PCJSCLASS, "ram");
    for (var iRAM = 0; iRAM < aeRAM.length; iRAM++) {
        var eRAM = aeRAM[iRAM];
        var parmsRAM = Component.getComponentParms(eRAM);
        var ram = new RAM(parmsRAM);
        Component.bindComponentControls(ram, eRAM, PCJSCLASS);
    }
};

/**
 * CompaqController(ram)
 *
 * DeskPro 386 machines came with a minimum of 1Mb of RAM, which could be configured (via jumpers)
 * for 256Kb, 512Kb or 640Kb of conventional memory, starting at address 0x00000000, with the
 * remainder (768Kb, 512Kb, or 384Kb) accessible only at addresses just below 0x01000000.  This
 * second chunk of RAM must have an ID of "ramCPQ".
 *
 * The typical configuration was 640Kb of conventional memory, leaving 384Kb accessible at 0x00FA0000.
 * Presumably, the other configurations (256Kb and 512Kb) would leave 768Kb and 512Kb accessible at
 * 0x00F40000 and 0x00F80000, respectively.
 *
 * The DeskPro 386 also contained two memory-mapped registers at 0x80C00000.  The first is a write-only
 * mapping register that provides the ability to map the 128Kb at 0x00FE0000 to 0x000E0000, replacing
 * any ROMs in the range 0x000E0000-0x000FFFFF, and optionally write-protecting that 128Kb.  The second
 * register is a read-only diagnostics register that indicates jumper configuration and parity errors.
 *
 * To emulate the memory-mapped registers at 0x80C00000, the RAM component allocates a block at that
 * address using this custom controller once it sees an allocation for "ramCPQ".
 *
 * Later, when the addressibility of "ramCPQ" memory is altered, we record the blocks in all the
 * memory slots spanning 0x000E0000-0x000FFFFF, and then update those slots with the blocks from
 * 0x00FE0000-0x00FFFFFF.  Note that only the top 128Kb of "ramCPQ" addressibility is affected; the
 * rest of that memory, ranging anywhere from 256Kb to 640Kb, remains addressible at its original
 * location.  Compaq's CEMM and VDISK utilities were generally the only software able to access that
 * remaining memory.
 *
 * @constructor
 * @param {RAM} ram
 */
function CompaqController(ram)
{
    this.ram = ram;
    this.bMapping = CompaqController.MAPPING.DEFAULT;
    this.bSettings = CompaqController.SETTINGS.BASE_640KB;
}

CompaqController.ADDR = 0x80C00000;

/*
 * Bit definitions for the 8-bit write-only memory-mapping register (bMapping)
 */
CompaqController.MAPPING = {
    NORELOC:    0x01,               // is this bit is CLEAR, the last 128Kb (at 0x00FE0000) is relocated to 0x000E0000
    READWRITE:  0x02,               // if this bit is CLEAR, the last 128Kb (at 0x00FE0000) is read-only (ie, write-protected)
    RESERVED:   0xFC,               // the remaining 6 bits are reserved and should always be SET
    DEFAULT:    0xFF
};

/*
 * Bit definitions for the 8-bit read-only settings/diagnostics register (bSettings)
 */
CompaqController.SETTINGS = {
    B0_PARITY:  0x01,
    B1_PARITY:  0x02,
    B2_PARITY:  0x04,
    B3_PARITY:  0x08,
    BASE_640KB: 0x00,
    BASE_ERROR: 0x10,
    BASE_512KB: 0x20,
    BASE_256KB: 0x30,
    ADDED_1MB:  0x40,
    PIGGYBACK:  0x80
};

/**
 * readByte(off)
 *
 * @this {Memory}
 * @param {number} off
 * @return {number}
 */
CompaqController.readByte = function readCompaqControllerByte(off)
{
    return this.controller.bSettings;
};

/**
 * writeByte(off, b)
 *
 * @this {Memory}
 * @param {number} off
 * @param {number} b (which should already be pre-masked to 8 bits; see Bus.prototype.setByteDirect)
 */
CompaqController.writeByte = function writeCompaqControllerByte(off, b)
{
    this.controller.bMapping = b;
};

CompaqController.ACCESS = [CompaqController.readByte, CompaqController.readByte, CompaqController.readByte,
                           CompaqController.writeByte, CompaqController.writeByte, CompaqController.writeByte];

/**
 * getMemoryBuffer(addr)
 *
 * @this {CompaqController}
 * @param {number} addr
 * @return {Array} containing the buffer (and an offset within that buffer)
 */
CompaqController.prototype.getMemoryBuffer = function(addr)
{
    return [null, 0];
};

/**
 * getMemoryAccess()
 *
 * @this {CompaqController}
 * @return {Array.<function()>}
 */
CompaqController.prototype.getMemoryAccess = function()
{
    return CompaqController.ACCESS;
};

/*
 * Initialize all the RAM modules on the page.
 */
web.onInit(RAM.init);

if (typeof module !== 'undefined') module.exports = RAM;
