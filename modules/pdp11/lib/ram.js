/**
 * @fileoverview Implements the PDP11 RAM component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2016
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.4 written by Paul Nankervis
 * (paulnank@hotmail.com) as of September 2016 at <http://skn.noip.me/pdp11/pdp11.html>.  This code
 * may be used freely provided the original authors are acknowledged in any modified source code.
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
    var str           = require("../../shared/lib/strlib");
    var web           = require("../../shared/lib/weblib");
    var DumpAPI       = require("../../shared/lib/dumpapi");
    var Component     = require("../../shared/lib/component");
    var State         = require("../../shared/lib/state");
    var PDP11         = require("./defines");
    var MemoryPDP11   = require("./memory");
    var MessagesPDP11 = require("./messages");
}

/**
 * RAMPDP11(parmsRAM)
 *
 * The RAMPDP11 component expects the following (parmsRAM) properties:
 *
 *      addr: starting physical address of RAM (default is 0)
 *      size: amount of RAM, in bytes (default is 0, which means defer to motherboard switch settings)
 *      file: name of optional data file to load into RAM (default is "")
 *      load: optional file load address (overrides any load address specified in the data file; default is null)
 *      exec: optional file exec address (overrides any exec address specified in the data file; default is null)
 *
 * NOTE: We make a note of the specified size, but no memory is initially allocated for the RAM until the
 * Computer component calls powerUp().
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsRAM
 */
function RAMPDP11(parmsRAM)
{
    Component.call(this, "RAM", parmsRAM, RAMPDP11);

    this.abInit = null;
    this.aSymbols = null;

    this.addrRAM = parmsRAM['addr'];
    this.sizeRAM = parmsRAM['size'];
    this.addrLoad = parmsRAM['load'];
    this.addrExec = parmsRAM['exec'];

    this.fInstalled = (!!this.sizeRAM); // 0 is the default value for 'size' when none is specified
    this.fAllocated = false;

    this.sFilePath = parmsRAM['file'];
    this.sFileName = str.getBaseName(this.sFilePath);

    if (this.sFilePath) {
        var sFileURL = this.sFilePath;
        if (DEBUG) this.log('load("' + sFileURL + '")');
        /*
         * If the selected data file has a ".json" extension, then we assume it's pre-converted
         * JSON-encoded data, so we load it as-is; ditto for ROM files with a ".hex" extension.
         * Otherwise, we ask our server-side converter to return the file in a JSON-compatible format.
         */
        var sFileExt = str.getExtension(this.sFileName);
        if (sFileExt != DumpAPI.FORMAT.JSON && sFileExt != DumpAPI.FORMAT.HEX) {
            sFileURL = web.getHost() + DumpAPI.ENDPOINT + '?' + DumpAPI.QUERY.FILE + '=' + this.sFilePath + '&' + DumpAPI.QUERY.FORMAT + '=' + DumpAPI.FORMAT.BYTES + '&' + DumpAPI.QUERY.DECIMAL + '=true';
        }
        var ram = this;
        web.getResource(sFileURL, null, true, function doneLoad(sURL, sResponse, nErrorCode) {
            ram.finishLoad(sURL, sResponse, nErrorCode);
        });
    }
}

Component.subclass(RAMPDP11);

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {RAMPDP11}
 * @param {ComputerPDP11} cmp
 * @param {BusPDP11} bus
 * @param {CPUStatePDP11} cpu
 * @param {DebuggerPDP11} dbg
 */
RAMPDP11.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.initRAM();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {RAMPDP11}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
RAMPDP11.prototype.powerUp = function(data, fRepower)
{
    if (this.aSymbols) {
        if (this.dbg) {
            this.dbg.addSymbols(this.id, this.addrRAM, this.sizeRAM, this.aSymbols);
        }
        /*
         * Our only role in the handling of symbols is to hand them off to the Debugger at our
         * first opportunity. Now that we've done that, our copy of the symbols, if any, are toast.
         */
        delete this.aSymbols;
    }
    /*
     * The Computer powers up the CPU last, at which point CPUState state is restored,
     * which includes the Bus state, and since we use the Bus to allocate all our memory,
     * memory contents are already restored for us, so we don't need the usual restore
     * logic.
     */
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {RAMPDP11}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
RAMPDP11.prototype.powerDown = function(fSave, fShutdown)
{
    /*
     * The Computer powers down the CPU first, at which point CPUState state is saved,
     * which includes the Bus state, and since we use the Bus component to allocate all
     * our memory, memory contents are already saved for us, so we don't need the usual
     * save logic.
     */
    return true;
};

/**
 * finishLoad(sURL, sData, nErrorCode)
 *
 * @this {RAMPDP11}
 * @param {string} sURL
 * @param {string} sData
 * @param {number} nErrorCode (response from server if anything other than 200)
 */
RAMPDP11.prototype.finishLoad = function(sURL, sData, nErrorCode)
{
    if (nErrorCode) {
        this.notice("Unable to load RAM resource (error " + nErrorCode + ": " + sURL + ")");
        this.sFilePath = null;
    }
    else {
        Component.addMachineResource(this.idMachine, sURL, sData);
        var resource = web.parseMemoryResource(sURL, sData);
        if (resource) {
            this.abInit = resource.aBytes;
            this.aSymbols = resource.aSymbols;
            if (this.addrLoad == null) this.addrLoad = resource.addrLoad;
            if (this.addrExec == null) this.addrExec = resource.addrExec;
        } else {
            this.sFilePath = null;
        }
    }
    this.initRAM();
};

/**
 * initRAM()
 *
 * This function is called by both initBus() and finishLoad(), but it cannot copy the initial data into place
 * until after initBus() has received the Bus component AND finishLoad() has received the data.  When both those
 * criteria are satisfied, the component becomes "ready".
 *
 * @this {RAMPDP11}
 */
RAMPDP11.prototype.initRAM = function()
{
    if (!this.bus) return;

    if (!this.fAllocated && this.sizeRAM) {
        if (this.bus.addMemory(this.addrRAM, this.sizeRAM, MemoryPDP11.TYPE.RAM)) {
            this.fAllocated = true;
        }
    }
    if (!this.isReady()) {
        if (!this.fAllocated) {
            Component.error("No RAM allocated");
        }
        else if (this.sFilePath) {
            /*
             * Too early...
             */
            if (!this.abInit || !this.bus) return;
            this.loadImage(this.abInit, this.addrLoad, this.addrExec, this.addrRAM);
            /*
             * NOTE: We now retain this data, so that reset() can return the RAM to its predefined state.
             *
             *      delete this.abInit;
             */
        }
        this.setReady();
    }
};

/**
 * reset()
 *
 * @this {RAMPDP11}
 */
RAMPDP11.prototype.reset = function()
{
    if (this.fAllocated) {
        /*
         * TODO: Add a configuration parameter for selecting the byte pattern on reset?
         * Note that when memory blocks are originally created, they are currently always
         * zero-initialized, so this would only affect resets.
         */
        this.bus.zeroMemory(this.addrRAM, this.sizeRAM, 0);
        if (this.abInit) {
            this.loadImage(this.abInit, this.addrLoad, this.addrExec, this.addrRAM, true);
        }
    }
};

/**
 * loadImage(aBytes, addrLoad, addrExec, addrInit, fReset)
 *
 * If the array contains a PAPER tape image in the "Absolute Format," load it as specified
 * by the format; otherwise, load it as-is using the address(es) supplied.
 *
 * @this {RAMPDP11}
 * @param {Array|Uint8Array} aBytes
 * @param {number|null} [addrLoad]
 * @param {number|null} [addrExec] (this CAN override any starting address INSIDE the image)
 * @param {number|null} [addrInit]
 * @param {boolean} [fReset]
 * @return {boolean} (true if loaded, false if not)
 */
RAMPDP11.prototype.loadImage = function(aBytes, addrLoad, addrExec, addrInit, fReset)
{
    var fLoaded = false;
    /*
	 * Data on tapes in the "Absolute Format" is organized into blocks; each block begins with
	 * a 6-byte header:
     *
     *      2-byte signature (0x0001)
     *      2-byte block length (N + 6, because it includes the 6-byte header)
     *      2-byte load address
     *
     * followed by N data bytes.  If N is zero, then the 2-byte load address is the exec address,
     * unless the address is odd (usually 1).  DEC's Absolute Loader jumps to the exec address
     * in former case, halts in the latter.
     *
     * All values are stored "little endian" (low byte followed by high byte), just like the
     * PDP-11's memory architecture.
     *
     * After the data bytes, there is a single checksum byte.  The 8-bit sum of all the bytes in
     * the block (including the header bytes and checksum byte) should be zero.
     *
     * ANOMALIES: Tape files don't always begin with a signature word, so I allow any number of
     * leading zeros before the first signature.  Tape files don't always end cleanly either, so as
     * soon as I see an invalid signature, I break out of the loop without signalling an error, as
     * long as at least ONE block was successfully processed.  In fact, it's possible that as
     * soon as a block with ZERO data bytes is encountered, processing is supposed to stop, but
     * I haven't examined enough tapes (or the Absolute Loader code) to know for sure.
     */
    if (addrLoad == null) {
        var off = 0, fError = false;
        while (off < aBytes.length - 1) {
            var w = (aBytes[off] & 0xff) | ((aBytes[off+1] & 0xff) << 8);
            if (!w) {           // ignore pairs of leading zeros
                off += 2;
                continue;
            }
            if (!(w & 0xff)) {  // as well as single bytes of zero
                off++;
                continue;
            }
            var offBlock = off;
            if (w != 0x0001) {
                this.printMessage("invalid signature (" + str.toHexWord(w) + ") at offset " + str.toHexWord(offBlock), MessagesPDP11.PAPER);
                break;
            }
            if (off + 6 >= aBytes.length) {
                this.printMessage("invalid block at offset " + str.toHexWord(offBlock), MessagesPDP11.PAPER);
                break;
            }
            off += 2;
            var checksum = w;
            var len = (aBytes[off++] & 0xff) | ((aBytes[off++] & 0xff) << 8);
            var addr = (aBytes[off++] & 0xff) | ((aBytes[off++] & 0xff) << 8);
            checksum += (len & 0xff) + (len >> 8) + (addr & 0xff) + (addr >> 8);
            var offData = off, cbData = len -= 6;
            while (len > 0 && off < aBytes.length) {
                checksum += aBytes[off++] & 0xff;
                len--;
            }
            if (len != 0 || off >= aBytes.length) {
                this.printMessage("insufficient data for block at offset " + str.toHexWord(offBlock), MessagesPDP11.PAPER);
                break;
            }
            checksum += aBytes[off++] & 0xff;
            if (checksum & 0xff) {
                this.printMessage("invalid checksum (" + str.toHexByte(checksum) + ") for block at offset " + str.toHexWord(offBlock), MessagesPDP11.PAPER);
                break;
            }
            if (!cbData) {
                if (addr & 0x1) {
                    this.cpu.stopCPU();
                } else {
                    if (addrExec == null) addrExec = addr;
                }
                if (addrExec != null) this.printMessage("starting address: " + str.toHexWord(addrExec), MessagesPDP11.PAPER);
            } else {
                this.printMessage("loading " + str.toHexWord(cbData) + " bytes at " + str.toHexWord(addr) + "-" + str.toHexWord(addr + cbData - 1), MessagesPDP11.PAPER);
                while (cbData--) {
                    this.cpu.setByteDirect(addr++, aBytes[offData++] & 0xff);
                }
            }
            fLoaded = true;
        }
    }
    if (!fLoaded) {
        if (addrLoad == null) addrLoad = addrInit;
        if (addrLoad != null) {
            for (var i = 0; i < aBytes.length; i++) {
                this.cpu.setByteDirect(addrLoad + i, aBytes[i]);
            }
            fLoaded = true;
        }
    }
    if (fLoaded) {
        /*
         * Set the start address to whatever the caller provided, or failing that, whatever start
         * address was specified inside the image.
         *
         * For example, the diagnostic "MAINDEC-11-D0AA-PB" doesn't include a start address inside the
         * image, but we know that the directions for that diagnostic say to "Start and Restart at 200",
         * so we have manually inserted an "exec":128 in the JSON containing the image.
         */
        if (addrExec != null) this.cpu.setReset(addrExec, fReset);
    }
    return fLoaded;
};

/**
 * RAMPDP11.init()
 *
 * This function operates on every HTML element of class "ram", extracting the
 * JSON-encoded parameters for the RAMPDP11 constructor from the element's "data-value"
 * attribute, invoking the constructor to create a RAMPDP11 component, and then binding
 * any associated HTML controls to the new component.
 */
RAMPDP11.init = function()
{
    var aeRAM = Component.getElementsByClass(document, PDP11.APPCLASS, "ram");
    for (var iRAM = 0; iRAM < aeRAM.length; iRAM++) {
        var eRAM = aeRAM[iRAM];
        var parmsRAM = Component.getComponentParms(eRAM);
        var ram = new RAMPDP11(parmsRAM);
        Component.bindComponentControls(ram, eRAM, PDP11.APPCLASS);
    }
};

/*
 * Initialize all the RAMPDP11 modules on the page.
 */
web.onInit(RAMPDP11.init);

if (NODE) module.exports = RAMPDP11;
