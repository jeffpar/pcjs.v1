/**
 * @fileoverview Implements the PCjs RAM component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2012-Jun-15
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
    var web = require("../../shared/lib/weblib");
    var Component = require("../../shared/lib/component");
    var ROM = require("./rom");
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
 * for the RAM until the Computer component calls setPower().
 * 
 * @constructor
 * @extends Component
 * @param {Object} parmsRAM
 */
function RAM(parmsRAM) {

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
RAM.prototype.initBus = function(cmp, bus, cpu, dbg) {
    this.bus = bus;
    this.cpu = cpu;
    this.cmp = cmp;
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
RAM.prototype.powerUp = function(data, fRepower) {
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
RAM.prototype.powerDown = function(fSave) {
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
RAM.prototype.reset = function() {
    if (!this.addrRAM && !this.fInstalled && this.chipset) {
        var baseRAM = this.chipset.getSWMemorySize() * 1024;
        if (this.sizeRAM && baseRAM != this.sizeRAM) {
            this.bus.removeMemory(this.addrRAM, this.sizeRAM);
            this.fAllocated = false;
        }
        this.sizeRAM = baseRAM;
    }
    if (!this.fAllocated && this.sizeRAM) {
        if (this.bus.addMemory(this.addrRAM, this.sizeRAM)) {
            this.fAllocated = true;
            this.status(Math.floor(this.sizeRAM / 1024) + "Kb");
            /*
             * NOTE: I'm specifying MAXDEBUG for status() messages because I'm not yet sure I want these
             * messages buried in the app, since they're seen only when a Control Panel is active.  Another
             * and perhaps better alternative is to add "comment" attributes to the XML configuration file
             * for these components, which the Computer component will display as it "powers up" components.
             */
            if (MAXDEBUG && this.fInstalled) this.status("specified size overrides SW1");
        }
    }
    if (this.fAllocated) {
        if (!this.fTestRAM) {
            /*
             * HACK: Set the word at 40:72 in the ROM BIOS Data Area (RBDA) to 0x1234 to bypass the ROM BIOS
             * memory storage tests. See rom.js for all RBDA definitions.
             */
            if (MAXDEBUG) this.status("ROM BIOS memory test has been disabled");
            this.bus.setWordDirect(ROM.BIOS.RESET_FLAG, ROM.BIOS.RESET_FLAG_WARMBOOT);
        }
        if (this.chipset) this.chipset.addCMOSMemory(this.addrRAM, this.sizeRAM);
    } else {
        Component.error("No RAM allocated");
    }
};

/**
 * RAM.init()
 *
 * This function operates on every element (e) of class "ram", and initializes
 * all the necessary HTML to construct the RAM module(s) as spec'ed.
 *
 * Note that each element (e) of class "ram" is expected to have a "data-value"
 * attribute containing the same JSON-encoded parameters that the RAM constructor
 * expects.
 */
RAM.init = function() {
    var aeRAM = Component.getElementsByClass(window.document, PCJSCLASS, "ram");
    for (var iRAM = 0; iRAM < aeRAM.length; iRAM++) {
        var eRAM = aeRAM[iRAM];
        var parmsRAM = Component.getComponentParms(eRAM);
        var ram = new RAM(parmsRAM);
        Component.bindComponentControls(ram, eRAM, PCJSCLASS);
    }
};

/*
 * Initialize all the RAM modules on the page.
 */
web.onInit(RAM.init);

if (typeof APP_PCJS !== 'undefined') APP_PCJS.RAM = RAM;

if (typeof module !== 'undefined') module.exports = RAM;
