/**
 * @fileoverview Implements the PC8080 RAM component.
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
    var Str = require("../../shared/lib/strlib");
    var Web = require("../../shared/lib/weblib");
    var DumpAPI = require("../../shared/lib/dumpapi");
    var Component = require("../../shared/lib/component");
    var State = require("../../shared/lib/state");
    var PC8080 = require("./defines");
    var CPUDef8080 = require("./cpudef");
    var Memory8080 = require("./memory");
}

/**
 * TODO: The Closure Compiler treats ES6 classes as 'struct' rather than 'dict' by default,
 * which would force us to declare all class properties in the constructor, as well as prevent
 * us from defining any named properties.  So, for now, we mark all our classes as 'unrestricted'.
 *
 * @unrestricted
 */
class RAM8080 extends Component {
    /**
     * RAM8080(parmsRAM)
     *
     * The RAM8080 component expects the following (parmsRAM) properties:
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
     * @this {RAM8080}
     * @param {Object} parmsRAM
     */
    constructor(parmsRAM)
    {
        super("RAM", parmsRAM);

        this.abInit = null;
        this.aSymbols = null;

        this.addrRAM = parmsRAM['addr'];
        this.sizeRAM = parmsRAM['size'];
        this.addrLoad = parmsRAM['load'];
        this.addrExec = parmsRAM['exec'];

        this.fInstalled = (!!this.sizeRAM); // 0 is the default value for 'size' when none is specified
        this.fAllocated = false;

        this.sFilePath = parmsRAM['file'];
        this.sFileName = Str.getBaseName(this.sFilePath);

        if (this.sFilePath) {
            var sFileURL = this.sFilePath;
            if (DEBUG) this.log('load("' + sFileURL + '")');
            /*
             * If the selected data file has a ".json" extension, then we assume it's pre-converted
             * JSON-encoded data, so we load it as-is; ditto for ROM files with a ".hex" extension.
             * Otherwise, we ask our server-side converter to return the file in a JSON-compatible format.
             */
            var sFileExt = Str.getExtension(this.sFileName);
            if (sFileExt != DumpAPI.FORMAT.JSON && sFileExt != DumpAPI.FORMAT.HEX) {
                sFileURL = Web.getHost() + DumpAPI.ENDPOINT + '?' + DumpAPI.QUERY.FILE + '=' + this.sFilePath + '&' + DumpAPI.QUERY.FORMAT + '=' + DumpAPI.FORMAT.BYTES + '&' + DumpAPI.QUERY.DECIMAL + '=true';
            }
            var ram = this;
            Web.getResource(sFileURL, null, true, function(sURL, sResponse, nErrorCode) {
                ram.doneLoad(sURL, sResponse, nErrorCode);
            });
        }
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {RAM8080}
     * @param {Computer8080} cmp
     * @param {Bus8080} bus
     * @param {CPUState8080} cpu
     * @param {Debugger8080} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.bus = bus;
        this.cpu = cpu;
        this.dbg = dbg;
        this.initRAM();
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {RAM8080}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        /*
         * The Computer powers up the CPU last, at which point CPUState state is restored,
         * which includes the Bus state, and since we use the Bus to allocate all our memory,
         * memory contents are already restored for us, so we don't need the usual restore
         * logic.
         */
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {RAM8080}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown(fSave, fShutdown)
    {
        /*
         * The Computer powers down the CPU first, at which point CPUState state is saved,
         * which includes the Bus state, and since we use the Bus component to allocate all
         * our memory, memory contents are already saved for us, so we don't need the usual
         * save logic.
         */
        return true;
    }

    /**
     * doneLoad(sURL, sData, nErrorCode)
     *
     * @this {RAM8080}
     * @param {string} sURL
     * @param {string} sData
     * @param {number} nErrorCode (response from server if anything other than 200)
     */
    doneLoad(sURL, sData, nErrorCode)
    {
        if (nErrorCode) {
            this.notice("Unable to load RAM resource (error " + nErrorCode + ": " + sURL + ")");
            return;
        }

        Component.addMachineResource(this.idMachine, sURL, sData);

        var resource = Web.parseMemoryResource(sURL, sData);
        if (resource) {
            this.abInit = resource.aBytes;
            this.aSymbols = resource.aSymbols;
            if (this.addrLoad == null) this.addrLoad = resource.addrLoad;
            if (this.addrExec == null) this.addrExec = resource.addrExec;
        } else {
            this.sFilePath = null;
        }
        this.initRAM();
    }

    /**
     * initRAM()
     *
     * This function is called by both initBus() and doneLoad(), but it cannot copy the initial data into place
     * until after initBus() has received the Bus component AND doneLoad() has received the data.  When both those
     * criteria are satisfied, the component becomes "ready".
     *
     * @this {RAM8080}
     */
    initRAM()
    {
        if (!this.fAllocated && this.sizeRAM) {
            if (this.bus.addMemory(this.addrRAM, this.sizeRAM, Memory8080.TYPE.RAM)) {
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

                var addr = this.addrRAM;
                if (this.addrLoad !== null) addr = this.addrLoad;
                for (var i = 0; i < this.abInit.length; i++) {
                    this.bus.setByteDirect(addr + i, this.abInit[i]);
                }

                if (this.addrExec !== null) {
                    /*
                     * Here's where we enable our "Fake CP/M" support, triggered by the user loading a "writable" ROM image
                     * at offset 0x100.  Fake CP/M support works by installing HLT opcodes at well-known CP/M addresses
                     * (namely, 0x0000, which is the CP/M reset vector, and 0x0005, which is the CP/M system call vector) and
                     * then telling the CPU to call us whenever a HLT occurs, so we can check PC for one of these addresses.
                     */
                    if (this.addrExec == RAM8080.CPM.INIT) {
                        for (i = 0; i < RAM8080.CPM.VECTORS.length; i++) {
                            this.bus.setByteDirect(RAM8080.CPM.VECTORS[i], CPUDef8080.OPCODE.HLT);
                        }

                        this.cpu.addHaltCheck(function(rom) {
                            return function(addr) {
                                return rom.checkCPMVector(addr)
                            };
                        }(this));
                    }
                    this.cpu.setReset(this.addrExec);
                }

                /*
                 * TODO: Consider an option to retain this data and give the user a way of restoring the initial contents.
                 */
                delete this.abInit;
            }
            this.setReady();
        }
    }

    /**
     * reset()
     *
     * @this {RAM8080}
     */
    reset()
    {
        /*
         * If you want to zero RAM on reset, then this would be a good place to do it.
         */
    }

    /**
     * checkCPMVector(addr)
     *
     * @this {RAM8080}
     * @param {number} addr (of the HLT opcode)
     * @return {boolean} true if special processing performed, false if not
     */
    checkCPMVector(addr)
    {
        var i = RAM8080.CPM.VECTORS.indexOf(addr);
        if (i >= 0) {
            var fCPM = false;
            var cpu = this.cpu;
            var dbg = this.dbg;
            if (addr == RAM8080.CPM.BDOS.VECTOR) {
                fCPM = true;
                switch(cpu.regC) {
                case RAM8080.CPM.BDOS.FUNC.CON_WRITE:
                    this.writeCPMString(this.getCPMChar(cpu.regE));
                    break;
                case RAM8080.CPM.BDOS.FUNC.STR_WRITE:
                    this.writeCPMString(this.getCPMString(cpu.getDE(), '$'));
                    break;
                default:
                    fCPM = false;
                    break;
                }
            }
            if (fCPM) {
                CPUDef8080.opRET.call(cpu);     // for recognized calls, automatically return
            }
            else if (dbg) {
                this.println("\nCP/M vector " + Str.toHexWord(addr));
                cpu.setPC(addr);                // this is purely for the Debugger's benefit, to show the HLT
                dbg.stopCPU();
            }
            return true;
        }
        return false;
    }

    /**
     * getCPMChar(ch)
     *
     * @this {RAM8080}
     * @param {number} ch
     * @return {string}
     */
    getCPMChar(ch)
    {
        return String.fromCharCode(ch);
    }

    /**
     * getCPMString(addr, chEnd)
     *
     * @this {RAM8080}
     * @param {number} addr (of a string)
     * @param {string|number} [chEnd] (terminating character, default is 0)
     * @return {string}
     */
    getCPMString(addr, chEnd)
    {
        var s = "";
        var cchMax = 255;
        var bEnd = chEnd && chEnd.length && chEnd.charCodeAt(0) || chEnd || 0;
        while (cchMax--) {
            var b = this.cpu.getByte(addr++);
            if (b == bEnd) break;
            s += String.fromCharCode(b);
        }
        return s;
    }

    /**
     * writeCPMString(s)
     *
     * @this {RAM8080}
     * @param {string} s
     */
    writeCPMString(s)
    {
        this.print(s.replace(/\r/g, ''));
    }

    /**
     * RAM8080.init()
     *
     * This function operates on every HTML element of class "ram", extracting the
     * JSON-encoded parameters for the RAM8080 constructor from the element's "data-value"
     * attribute, invoking the constructor to create a RAM8080 component, and then binding
     * any associated HTML controls to the new component.
     */
    static init()
    {
        var aeRAM = Component.getElementsByClass(document, PC8080.APPCLASS, "ram");
        for (var iRAM = 0; iRAM < aeRAM.length; iRAM++) {
            var eRAM = aeRAM[iRAM];
            var parmsRAM = Component.getComponentParms(eRAM);
            var ram = new RAM8080(parmsRAM);
            Component.bindComponentControls(ram, eRAM, PC8080.APPCLASS);
        }
    }
}

RAM8080.CPM = {
    BIOS: {
        VECTOR:         0x0000
    },
    BDOS: {
        VECTOR:         0x0005,
        FUNC: {                         // function number (specified in regC)
            RESET:      0x00,
            CON_READ:   0x01,           // output: A = L = ASCII character
            CON_WRITE:  0x02,           // input: E = ASCII character
            AUX_READ:   0x03,           // output: A = L = ASCII character
            AUX_WRITE:  0x04,           // input: E = ASCII character
            PRN_WRITE:  0x05,           // input: E = ASCII character
            MEM_SIZE:   0x06,           // output: base address of CCP (Console Command Processor), but which register? (perhaps moot if this was CP/M 1.3 only...)
            CON_IO:     0x06,           // input: E = ASCII character (or 0xFF to return ASCII character in A)
            GET_IOBYTE: 0x07,
            SET_IOBYTE: 0x08,
            STR_WRITE:  0x09            // input: DE = address of string
        }
    },
    INIT:               0x100
};

RAM8080.CPM.VECTORS = [RAM8080.CPM.BIOS.VECTOR, RAM8080.CPM.BDOS.VECTOR];

/*
 * Initialize all the RAM8080 modules on the page.
 */
Web.onInit(RAM8080.init);

if (NODE) module.exports = RAM8080;
