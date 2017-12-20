/**
 * @fileoverview Implements the PCx86 ROM component.
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
    var DumpAPI     = require("../../shared/lib/dumpapi");
    var Component   = require("../../shared/lib/component");
    var PCX86       = require("./defines");
    var Memory      = require("./memory");
}

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class ROMx86 extends Component {
    /**
     * ROMx86(parmsROM)
     *
     * The ROMx86 component expects the following (parmsROM) properties:
     *
     *      addr: physical address of ROM
     *      size: amount of ROM, in bytes
     *      alias: physical alias address (null if none)
     *      file: name of ROM data file
     *      notify: ID of a component to notify once the ROM is in place (optional)
     *
     * NOTE: The ROM data will not be copied into place until the Bus is ready (see initBus()) AND the
     * ROM data file has finished loading (see doneLoad()).
     *
     * Also, while the size parameter may seem redundant, I consider it useful to confirm that the ROM you received
     * is the ROM you expected.
     *
     * @this {ROMx86}
     * @param {Object} parmsROM
     */
    constructor(parmsROM)
    {
        super("ROMx86", parmsROM);

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

        /*
         * The 'notify' property can now (as of v1.18.2) contain an array of parameters that the notified
         * component (typically Video) may use as it sees fit.  For example, the Video component is generally
         * interested in knowing the offsets of specific font tables within the ROM, which used to be hard-coded
         * when all we supported were a few specific IBM video cards, but that's no longer feasible as we move
         * beyond the original handful of IBM cards.
         *
         * It's up to the notified component to decide how to interpret the parameters it receives, if any.
         */
        this.idNotify = parmsROM['notify'];
        this.aNotifyParms = null;
        if (this.idNotify) {
            var i = this.idNotify.indexOf('[');
            if (i > 0) {
                try {
                    this.aNotifyParms = eval(this.idNotify.substr(i));
                } catch (e) {}
                this.idNotify = this.idNotify.substr(0, i);
            }
        }

        this.sFileURL = this.sFilePath = parmsROM['file'];

        if (this.sFileURL) {
            var sFileName = Str.getBaseName(this.sFileURL);
            if (DEBUG) this.log('load("' + this.sFileURL + '")');
            /*
             * If the selected ROM file has a ".json" extension, then we assume it's pre-converted
             * JSON-encoded ROM data, so we load it as-is; ditto for ROM files with a ".hex" extension.
             * Otherwise, we ask our server-side ROM converter to return the file in a JSON-compatible format.
             */
            var sFileExt = Str.getExtension(sFileName);
            if (sFileExt != DumpAPI.FORMAT.JSON && sFileExt != DumpAPI.FORMAT.HEX) {
                this.sFileURL = Web.getHost() + DumpAPI.ENDPOINT + '?' + DumpAPI.QUERY.FILE + '=' + this.sFilePath + '&' + DumpAPI.QUERY.FORMAT + '=' + DumpAPI.FORMAT.BYTES + '&' + DumpAPI.QUERY.DECIMAL + '=true';
            }
        }
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {ROMx86}
     * @param {Computer} cmp
     * @param {Bus} bus
     * @param {X86CPU} cpu
     * @param {DebuggerX86} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.cmp = cmp;
        this.bus = bus;
        this.cpu = cpu;
        this.dbg = dbg;

        if (this.sFileURL) {
            var rom = this;
            var sProgress = "Loading " + this.sFileURL + "...";
            Web.getResource(this.sFileURL, null, true, function(sURL, sResponse, nErrorCode) {
                rom.doneLoad(sURL, sResponse, nErrorCode);
            }, function(nState) {
                rom.println(sProgress, Component.PRINT.PROGRESS);
            });
        }
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {ROMx86}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        if (this.aSymbols) {
            if (this.dbg) {
                this.dbg.addSymbols(this.id, 0, this.addrROM >>> 4, 0, this.addrROM, this.sizeROM, this.aSymbols);
            }
            /*
             * Our only role in the handling of symbols is to hand them off to the Debugger at our
             * first opportunity. Now that we've done that, our copy of the symbols, if any, are toast.
             */
            delete this.aSymbols;
        }
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * Since we have nothing to do on powerDown(), and no state to return, we could simply omit
     * this function.  But it doesn't hurt anything, and maybe we'll use our state to save something
     * useful down the road, like user-defined symbols (ie, symbols that the Debugger may have
     * created, above and beyond those symbols we automatically loaded, if any, along with the ROM).
     *
     * @this {ROMx86}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown(fSave, fShutdown)
    {
        return true;
    }

    /**
     * doneLoad(sURL, sROMData, nErrorCode)
     *
     * @this {ROMx86}
     * @param {string} sURL
     * @param {string} sROMData
     * @param {number} nErrorCode (response from server if anything other than 200)
     */
    doneLoad(sURL, sROMData, nErrorCode)
    {
        if (nErrorCode) {
            this.notice("Unable to load system ROM (error " + nErrorCode + ": " + sURL + ")", nErrorCode < 0);
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
                this.abROM[i] = Str.parseInt(asHexData[i], 16);
            }
        }
        this.copyROM();
    }

    /**
     * copyROM()
     *
     * This function is called by both initBus() and doneLoad(), but it cannot copy the the ROM data into place
     * until after initBus() has received the Bus component AND doneLoad() has received the abROM data.  When both
     * those criteria are satisfied, the component becomes "ready".
     *
     * @this {ROMx86}
     */
    copyROM()
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
                    this.setError("ROM size (" + Str.toHexLong(this.abROM.length) + ") does not match specified size (" + Str.toHexLong(this.sizeROM) + ")");
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
                     * If there's a component we should notify, notify it now, and give it the internal byte array, so that
                     * it doesn't have to ask the CPU for the data.  Currently, the only component that uses this notification
                     * option is the Video component, and only when the associated ROM contains font data that it needs.
                     */
                    if (this.idNotify) {
                        var component = Component.getComponentByID(this.idNotify, this.id);
                        if (component) {
                            component.onROMLoad(this.abROM, this.aNotifyParms);
                        } else {
                            this.notice("Unable to find component: " + this.idNotify);
                        }
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
    }

    /**
     * addROM(addr)
     *
     * @this {ROMx86}
     * @param {number} addr
     * @return {boolean}
     */
    addROM(addr)
    {
        if (this.bus.addMemory(addr, this.sizeROM, Memory.TYPE.ROM)) {
            if (DEBUG) this.log("addROM(): copying ROM to " + Str.toHexLong(addr) + " (" + Str.toHexLong(this.abROM.length) + " bytes)");
            var bto = null;
            for (var off = 0; off < this.abROM.length; off++) {
                this.bus.setByteDirect(addr + off, this.abROM[off]);
                if (BACKTRACK) {
                    bto = this.bus.addBackTrackObject(this, bto, off);
                    this.bus.writeBackTrackObject(addr + off, bto, off);
                }
            }
            return true;
        }
        /*
         * We don't need to report an error here, because addMemory() already takes care of that.
         */
        return false;
    }

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
     * @this {ROMx86}
     * @param {number} addr
     */
    cloneROM(addr)
    {
        var aBlocks = this.bus.getMemoryBlocks(this.addrROM, this.sizeROM);
        this.bus.setMemoryBlocks(addr, this.sizeROM, aBlocks);
    }

    /**
     * ROMx86.init()
     *
     * This function operates on every HTML element of class "rom", extracting the
     * JSON-encoded parameters for the ROM constructor from the element's "data-value"
     * attribute, invoking the constructor to create a ROM component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeROM = Component.getElementsByClass(document, PCX86.APPCLASS, "rom");
        for (var iROM = 0; iROM < aeROM.length; iROM++) {
            var eROM = aeROM[iROM];
            var parmsROM = Component.getComponentParms(eROM);
            var rom = new ROMx86(parmsROM);
            Component.bindComponentControls(rom, eROM, PCX86.APPCLASS);
        }
    }
}

/*
 * ROM BIOS Data Area (RBDA) definitions, in physical address form, using the same ALL-CAPS names
 * found in the original IBM PC ROM BIOS listing.  TODO: Fill in remaining RBDA holes.
 */
ROMx86.BIOS = {
    RS232_BASE:     0x400,              // 4 (word) I/O addresses of RS-232 adapters
    PRINTER_BASE:   0x408,              // 4 (word) I/O addresses of printer adapters
    EQUIP_FLAG:     0x410,              // installed hardware (word)
    MFG_TEST:       0x412,              // initialization flag (byte)
    MEMORY_SIZE:    0x413,              // memory size in K-bytes (word)
    RESET_FLAG:     0x472               // set to 0x1234 if keyboard reset underway (word)
};

// RESET_FLAG is the traditional end of the RBDA, as originally defined at real-mode segment 0x40.

ROMx86.BIOS.RESET_FLAG_WARMBOOT = 0x1234;   // value stored at ROMx86.BIOS.RESET_FLAG to indicate a "warm boot", bypassing memory tests

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

/*
 * Initialize all the ROM modules on the page.
 */
Web.onInit(ROMx86.init);

if (NODE) module.exports = ROM;
