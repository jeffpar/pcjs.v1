/**
 * @fileoverview Implements the PC6502 ROM component.
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
    var str         = require("../../shared/lib/strlib");
    var web         = require("../../shared/lib/weblib");
    var DumpAPI     = require("../../shared/lib/dumpapi");
    var Component   = require("../../shared/lib/component");
    var Memory      = require("./memory");
    var CPUDef      = require("./cpudef");
}

/**
 * ROM(parmsROM)
 *
 * The ROM component expects the following (parmsROM) properties:
 *
 *      addr: physical address of ROM
 *      size: amount of ROM, in bytes
 *      alias: physical alias address (null if none)
 *      file: name of ROM data file
 *      writable: true to make ROM writable (default is false)
 *
 * NOTE: The ROM data will not be copied into place until the Bus is ready (see initBus()) AND the
 * ROM data file has finished loading (see doneLoad()).
 *
 * Also, while the size parameter may seem redundant, I consider it useful to confirm that the ROM you received
 * is the ROM you expected.
 *
 * Finally, while making ROM "writable" may seem a contradiction in terms, I want to be able to load selected
 * CP/M binary files into memory purely for testing purposes, and the RAM component has no "file" option, so the
 * simplest solution was to add the option to load binary files into memory as "writable" ROMs.
 *
 * Moreover, if a "writable" ROM is installed at addr 0x100, that triggers our "Fake CP/M" support, providing
 * a quick-and-dirty means of loading simple CP/M test binaries.  See addROM() for details.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsROM
 */
function ROM(parmsROM)
{
    Component.call(this, "ROM", parmsROM, ROM);

    this.abROM = null;
    this.addrROM = parmsROM['addr'];
    this.sizeROM = parmsROM['size'];

    /*
     * The new 'alias' property can now be EITHER a single physical address (like 'addr') OR an array of
     * physical addresses; eg:
     *
     *      [0xf0000,0xffff0000,0xffff8000]
     *
     * We could have overloaded 'addr' to accomplish the same thing, but I think it's better to have any
     * aliased locations listed under a separate property.
     *
     * Most ROMs are not aliased, in which case the 'alias' property should have the default value of null.
     */
    this.addrAlias = parmsROM['alias'];

    this.sFilePath = parmsROM['file'];
    this.sFileName = str.getBaseName(this.sFilePath);

    if (this.sFilePath) {
        var sFileURL = this.sFilePath;
        if (DEBUG) this.log('load("' + sFileURL + '")');
        /*
         * If the selected ROM file has a ".json" extension, then we assume it's pre-converted
         * JSON-encoded ROM data, so we load it as-is; ditto for ROM files with a ".hex" extension.
         * Otherwise, we ask our server-side ROM converter to return the file in a JSON-compatible format.
         */
        var sFileExt = str.getExtension(this.sFileName);
        if (sFileExt != DumpAPI.FORMAT.JSON && sFileExt != DumpAPI.FORMAT.HEX) {
            sFileURL = web.getHost() + DumpAPI.ENDPOINT + '?' + DumpAPI.QUERY.FILE + '=' + this.sFilePath + '&' + DumpAPI.QUERY.FORMAT + '=' + DumpAPI.FORMAT.BYTES + '&' + DumpAPI.QUERY.DECIMAL + '=true';
        }
        var rom = this;
        web.getResource(sFileURL, null, true, function(sURL, sResponse, nErrorCode) {
            rom.doneLoad(sURL, sResponse, nErrorCode);
        });
    }
}

Component.subclass(ROM);

/*
 * NOTE: There's currently no need for this component to have a reset() function, since
 * once the ROM data is loaded, it can't be changed, so there's nothing to reinitialize.
 *
 * OK, well, I take that back, because the Debugger, if installed, has the ability to modify
 * ROM contents, so in that case, having a reset() function that restores the original ROM data
 * might be useful; then again, it might not, depending on what you're trying to debug.
 *
 * If we do add reset(), then we'll want to change copyROM() to hang onto the original
 * ROM data; currently, we release it after copying it into the read-only memory allocated
 * via bus.addMemory().
 */

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {ROM}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {CPUState} cpu
 * @param {Debugger6502} dbg
 */
ROM.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.copyROM();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {ROM}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
ROM.prototype.powerUp = function(data, fRepower)
{
    if (this.aSymbols) {
        if (this.dbg) {
            this.dbg.addSymbols(this.id, this.addrROM, this.sizeROM, this.aSymbols);
        }
        /*
         * Our only role in the handling of symbols is to hand them off to the Debugger at our
         * first opportunity. Now that we've done that, our copy of the symbols, if any, are toast.
         */
        delete this.aSymbols;
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * Since we have nothing to do on powerDown(), and no state to return, we could simply omit
 * this function.  But it doesn't hurt anything, and maybe we'll use our state to save something
 * useful down the road, like user-defined symbols (ie, symbols that the Debugger may have
 * created, above and beyond those symbols we automatically loaded, if any, along with the ROM).
 *
 * @this {ROM}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
ROM.prototype.powerDown = function(fSave, fShutdown)
{
    return true;
};

/**
 * doneLoad(sURL, sROMData, nErrorCode)
 *
 * @this {ROM}
 * @param {string} sURL
 * @param {string} sROMData
 * @param {number} nErrorCode (response from server if anything other than 200)
 */
ROM.prototype.doneLoad = function(sURL, sROMData, nErrorCode)
{
    if (nErrorCode) {
        this.notice("Unable to load system ROM (error " + nErrorCode + ": " + sURL + ")");
        return;
    }

    Component.addMachineResource(this.idMachine, sURL, sROMData);

    if (sROMData.charAt(0) == "[" || sROMData.charAt(0) == "{") {
        try {
            /*
             * The most likely source of any exception will be here: parsing the JSON-encoded ROM data.
             */
            var rom = eval("(" + sROMData + ")");
            var ab = rom['bytes'];
            /*
             * Resource 'longs' should always be 32-bit DWORD values, whereas 'data' bit lengths
             * will vary according to the machine architecture for which the resource was designed.
             */
            var adw = rom['longs'] || rom['data'];

            if (ab) {
                this.abROM = ab;
            }
            else if (adw) {
                /*
                 * Convert all the DWORDs into BYTEs, so that subsequent code only has to deal with abROM.
                 */
                this.abROM = new Array(adw.length * 4);
                for (var idw = 0, ib = 0; idw < adw.length; idw++) {
                    this.abROM[ib++] = adw[idw] & 0xff;
                    this.abROM[ib++] = (adw[idw] >> 8) & 0xff;
                    this.abROM[ib++] = (adw[idw] >> 16) & 0xff;
                    this.abROM[ib++] = (adw[idw] >> 24) & 0xff;
                }
            }
            else {
                this.abROM = rom;
            }

            this.aSymbols = rom['symbols'];

            if (!this.abROM.length) {
                Component.error("Empty ROM: " + sURL);
                return;
            }
            else if (this.abROM.length == 1) {
                Component.error(this.abROM[0]);
                return;
            }
        } catch (e) {
            this.notice("ROM data error: " + e.message);
            return;
        }
    }
    else {
        /*
         * Parse the ROM data manually; we assume it's in "simplified" hex form (a series of hex byte-values
         * separated by whitespace).
         */
        var sHexData = sROMData.replace(/\n/gm, " ").replace(/ +$/, "");
        var asHexData = sHexData.split(" ");
        this.abROM = new Array(asHexData.length);
        for (var i = 0; i < asHexData.length; i++) {
            this.abROM[i] = str.parseInt(asHexData[i], 16);
        }
    }
    this.copyROM();
};

/**
 * copyROM()
 *
 * This function is called by both initBus() and doneLoad(), but it cannot copy the the ROM data into place
 * until after initBus() has received the Bus component AND doneLoad() has received the abROM data.  When both
 * those criteria are satisfied, the component becomes "ready".
 *
 * @this {ROM}
 */
ROM.prototype.copyROM = function()
{
    if (!this.isReady()) {
        if (!this.sFilePath) {
            this.setReady();
        }
        else if (this.abROM && this.bus) {
            /*
             * If no explicit size was specified, then use whatever the actual size is.
             */
            if (!this.sizeROM) {
                this.sizeROM = this.abROM.length;
            }
            if (this.abROM.length != this.sizeROM) {
                /*
                 * Note that setError() sets the component's fError flag, which in turn prevents setReady() from
                 * marking the component ready.  TODO: Revisit this decision.  On the one hand, it sounds like a
                 * good idea to stop the machine in its tracks whenever a setError() occurs, but there may also be
                 * times when we'd like to forge ahead anyway.
                 */
                this.setError("ROM size (" + str.toHexLong(this.abROM.length) + ") does not match specified size (" + str.toHexLong(this.sizeROM) + ")");
            }
            else if (this.addROM(this.addrROM)) {

                var aliases = [];
                if (typeof this.addrAlias == "number") {
                    aliases.push(this.addrAlias);
                } else if (this.addrAlias != null && this.addrAlias.length) {
                    aliases = this.addrAlias;
                }
                for (var i = 0; i < aliases.length; i++) {
                    this.cloneROM(aliases[i]);
                }
                /*
                 * We used to hang onto the original ROM data so that we could restore any bytes the CPU overwrote,
                 * using memory write-notification handlers, but with the introduction of read-only memory blocks, that's
                 * no longer necessary.
                 *
                 * TODO: Consider an option to retain the ROM data, and give the user some way of restoring ROMs.
                 * That may be useful for "resumable" machines that save/restore all dirty block of memory, regardless
                 * whether they're ROM or RAM.  However, the only way to modify a machine's ROM is with the Debugger,
                 * and Debugger users should know better.
                 */
                delete this.abROM;
            }
            this.setReady();
        }
    }
};

/**
 * addROM(addr)
 *
 * @this {ROM}
 * @param {number} addr
 * @return {boolean}
 */
ROM.prototype.addROM = function(addr)
{
    if (this.bus.addMemory(addr, this.sizeROM, Memory.TYPE.ROM)) {
        if (DEBUG) this.log("addROM(): copying ROM to " + str.toHexLong(addr) + " (" + str.toHexLong(this.abROM.length) + " bytes)");
        var i;
        for (i = 0; i < this.abROM.length; i++) {
            this.bus.setByteDirect(addr + i, this.abROM[i]);
        }
        return true;
    }
    /*
     * We don't need to report an error here, because addMemory() already takes care of that.
     */
    return false;
};

/**
 * cloneROM(addr)
 *
 * For ROMs with one or more alias addresses, we used to call addROM() for each address.  However,
 * that obviously wasted memory, since each alias was an independent copy, and if you used the
 * Debugger to edit the ROM in one location, the changes would not appear in the other location(s).
 *
 * Now that the Bus component provides low-level getMemoryBlocks() and setMemoryBlocks() methods
 * to manually get and set the blocks of any memory range, it is now possible to create true aliases.
 *
 * @this {ROM}
 * @param {number} addr
 */
ROM.prototype.cloneROM = function(addr)
{
    var aBlocks = this.bus.getMemoryBlocks(this.addrROM, this.sizeROM);
    this.bus.setMemoryBlocks(addr, this.sizeROM, aBlocks);
};

/**
 * ROM.init()
 *
 * This function operates on every HTML element of class "rom", extracting the
 * JSON-encoded parameters for the ROM constructor from the element's "data-value"
 * attribute, invoking the constructor to create a ROM component, and then binding
 * any associated HTML controls to the new component.
 */
ROM.init = function()
{
    var aeROM = Component.getElementsByClass(document, APPCLASS, "rom");
    for (var iROM = 0; iROM < aeROM.length; iROM++) {
        var eROM = aeROM[iROM];
        var parmsROM = Component.getComponentParms(eROM);
        var rom = new ROM(parmsROM);
        Component.bindComponentControls(rom, eROM, APPCLASS);
    }
};

/*
 * Initialize all the ROM modules on the page.
 */
web.onInit(ROM.init);

if (NODE) module.exports = ROM;
