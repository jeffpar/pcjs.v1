/**
 * @fileoverview Implements the PCjs Hard Drive Controller (HDC) component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2012-Nov-26
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
    var str = require("../../shared/lib/strlib");
    var web = require("../../shared/lib/weblib");
    var DiskAPI = require("../../shared/lib/diskapi");
    var Component = require("../../shared/lib/component");
    var ChipSet = require("./chipset");
    var Disk = require("./disk");
    var State = require("./state");
}

/**
 * HDC(parmsHDC)
 *
 * The HDC component simulates an STC-506/412 interface to an IBM-compatible fixed disk drive. The first
 * such drive was a 10Mb 5.25-inch drive containing two platters and 4 heads. Data spanned 306 cylinders
 * for a total of 1224 tracks, with 17 sectors/track and 512 bytes/sector.
 *
 * HDC supports the following component-specific properties:
 *
 *      drives: an array of driveConfig objects, each containing 'name', 'path', 'size' and 'type' properties
 *
 * If 'path' is empty, a scratch disk image is created; otherwise, we make a note of the path, but we will NOT
 * pre-load it like we do for floppy disk images.
 *
 * My current plan is to read all disk data on-demand, keeping a cache of what we've read, and possibly adding
 * some read-ahead as well. Any portions of the disk image that are written before being read will never be read.
 *
 * TRIVIA: On p.1-179 of the PC XT Technical Reference Manual (revised APR83), it reads:
 *
 *      "WARNING: The last cylinder on the fixed disk drive is reserved for diagnostic use.
 *      Diagnostic write tests will destroy any data on this cylinder."
 *
 * Does FDISK insure that the last cylinder is reserved?  I'm sure we'll eventually find out.
 * 
 * @constructor
 * @extends Component
 * @param {Object} parmsHDC
 */
function HDC(parmsHDC) {

    Component.call(this, "HDC", parmsHDC, HDC);

    this['dmaRead'] = this.dmaRead;
    this['dmaWrite'] = this.dmaWrite;
    this['dmaWriteBuffer'] = this.dmaWriteBuffer;
    this['dmaWriteFormat'] = this.dmaWriteFormat;

    this.aDriveConfigs = [];

    if (parmsHDC['drives']) {
        try {
            /*
             * The most likely source of any exception will be right here, where we're parsing
             * the JSON-encoded disk data.
             */
            this.aDriveConfigs = eval("(" + parmsHDC['drives'] + ")");
            /*
             * Nothing more to do with aDriveConfigs now. initController() and autoMount() (if there are
             * any disk image "path" properties to process) will take care of the rest.
             */
        } catch (e) {
            this.error("HDC drive configuration error: " + e.message + " (" + parmsHDC['drives'] + ")");
        }
    }
    
    /*
     * The remainder of HDC initialization now takes place in our initBus() handler
     */
}

Component.subclass(Component, HDC);

/*
 * HDC BIOS interrupts, functions, and other parameters
 */
HDC.BIOS = {};
HDC.BIOS.DISK_INT = 0x13;

HDC.BIOS.DISK_CMD = {};
HDC.BIOS.DISK_CMD.RESET             = 0x00;
HDC.BIOS.DISK_CMD.GET_STATUS        = 0x01;
HDC.BIOS.DISK_CMD.READ_SECTORS      = 0x02;
HDC.BIOS.DISK_CMD.WRITE_SECTORS     = 0x03;
HDC.BIOS.DISK_CMD.VERIFY_SECTORS    = 0x04;
HDC.BIOS.DISK_CMD.FORMAT_TRACK      = 0x05;
HDC.BIOS.DISK_CMD.FORMAT_BAD        = 0x06;
HDC.BIOS.DISK_CMD.FORMAT_DRIVE      = 0x07;
HDC.BIOS.DISK_CMD.GET_DRIVEPARMS    = 0x08;
HDC.BIOS.DISK_CMD.SET_DRIVEPARMS    = 0x09;
HDC.BIOS.DISK_CMD.READ_LONG         = 0x0A;
HDC.BIOS.DISK_CMD.WRITE_LONG        = 0x0B;
HDC.BIOS.DISK_CMD.SEEK              = 0x0C;
HDC.BIOS.DISK_CMD.ALT_RESET         = 0x0D;
HDC.BIOS.DISK_CMD.READ_BUFFER       = 0x0E;
HDC.BIOS.DISK_CMD.WRITE_BUFFER      = 0x0F;
HDC.BIOS.DISK_CMD.TEST_READY        = 0x10;
HDC.BIOS.DISK_CMD.RECALIBRATE       = 0x11;
HDC.BIOS.DISK_CMD.RAM_DIAGNOSTIC    = 0x12;
HDC.BIOS.DISK_CMD.DRV_DIAGNOSTIC    = 0x13;
HDC.BIOS.DISK_CMD.CTL_DIAGNOSTIC    = 0x14;

/*
 * When the HDC BIOS overwrites the ROM BIOS INT 0x13 address, it saves the original INT 0x13 address
 * in the INT 0x40 vector.  The HDC BIOS's plan was simple, albeit slightly flawed: assign fixed disks
 * drive numbers >= 0x80, and whenever someone calls INT 0x13 with a drive number < 0x80, invoke the
 * original INT 0x13 diskette code via INT 0x40 and return via RET 2.
 * 
 * Unfortunately, not all original INT 0x13 functions required a drive number in DL (eg, the "reset"
 * function, where AH=0).  And the HDC BIOS knew this, which is why, in the case of the "reset" function,
 * the HDC BIOS performs BOTH an INT 0x40 diskette reset AND an HDC reset -- it can't be sure which
 * controller the caller really wants to reset.
 * 
 * An unfortunate side-effect of this behavior: when the HDC BIOS is initialized for the first time, it may
 * issue several resets internally, depending on whether there are 0, 1 or 2 hard disks installed, and each
 * of those resets also triggers completely useless diskette resets, each wasting up to two seconds waiting
 * for the FDC to interrupt.  The FDC tries to interrupt, but it can't, because at this early stage of
 * ROM BIOS initialization, IRQ_FDC hasn't been unmasked yet.
 * 
 * My work-around: have the HDC component hook INT 0x40, and every time an INT 0x40 is issued with AH=0 and
 * IRQ_FDC masked, eat the INT 0x40 interrupt.
 */
HDC.BIOS.DISKETTE_INT = 0x40;

/*
 * HDC defaults, in case drive parameters weren't specified
 */
HDC.DEFAULT_DRIVE_NAME = "Hard Drive";
HDC.DEFAULT_DRIVE_TYPE = 0x03;

/*
 * Each of the following DriveType arrays contain 4 values:
 * 
 *      [0]: total cylinders
 *      [1]: total heads
 *      [2]: total sectors/tracks
 *      [3]: total bytes/sector
 *      
 * verifyDrive() attempts to confirm that these values agree with the programmed drive characteristics.
 */
HDC.aDriveTypes = {
    0x00: [306, 2, 17, 512],
    0x01: [375, 8, 17, 512],
    0x02: [306, 6, 17, 512],
    0x03: [306, 4, 17, 512]
};

/*
 * HDC Data Register (0x320, read-write)
 * 
 * Writes to this register are discussed below; see HDC Commands.
 * 
 * Reads from this register after a command has been executed retrieve a "status byte",
 * which must NOT be confused with the Status Register (see below).  This data "status byte"
 * contains only two bits of interest: REG_DATA.STATUS_ERROR and REG_DATA.STATUS_UNIT.
 */
HDC.REG_DATA = {};
HDC.REG_DATA.PORT           = 0x320;    // port address
HDC.REG_DATA.STATUS_OK      = 0x00;     // no error
HDC.REG_DATA.STATUS_ERROR   = 0x02;     // error occurred during command execution
HDC.REG_DATA.STATUS_UNIT    = 0x20;     // logical unit number of the drive

/*
 * HDC Status Register (0x321, read-only)
 * 
 * WARNING: The IBM Technical Reference Manual *badly* confuses the REG_DATA "status byte" (above)
 * that the controller sends following an HDC.REG_DATA.CMD operation with the Status Register (below).
 * In fact, it's so badly confused that it completely fails to document any of the Status Register
 * bits below; I'm forced to guess at their meanings from the HDC BIOS listing.
 */
HDC.REG_STATUS = {};
HDC.REG_STATUS.PORT         = 0x321;    // port address
HDC.REG_STATUS.NONE         = 0x00;
HDC.REG_STATUS.REQ          = 0x01;     // HDC BIOS: request bit
HDC.REG_STATUS.IOMODE       = 0x02;     // HDC BIOS: mode bit (GUESS: set whenever REG_DATA contains a response?)
HDC.REG_STATUS.BUS          = 0x04;     // HDC BIOS: command/data bit (GUESS: set whenever REG_DATA ready for request?)
HDC.REG_STATUS.BUSY         = 0x08;     // HDC BIOS: busy bit
HDC.REG_STATUS.INTERRUPT    = 0x20;     // HDC BIOS: interrupt bit

/*
 * HDC Config Register (0x322, read-only)
 * 
 * This register is used to read HDC card switch settings that defined the "Drive Type" for
 * drives 0 and 1.  SW[1],SW[2] (for drive 0) and SW[3],SW[4] (for drive 1) are set as follows:
 * 
 *      ON,  ON     Drive Type 0   (306 cylinders, 2 heads) 
 *      ON,  OFF    Drive Type 1   (375 cylinders, 8 heads)
 *      OFF, ON     Drive Type 2   (306 cylinders, 6 heads)
 *      OFF, OFF    Drive Type 3   (306 cylinders, 4 heads)
 */

/*
 * HDC Commands, as issued to REG_DATA
 * 
 * Commands are multi-byte sequences sent to REG_DATA, starting with a REG_DATA.CMD byte,
 * and followed by 5 more bytes, for a total of 6 bytes, which collectively are called a
 * Device Control Block (DCB).  Not all commands use all 6 bytes, but all 6 bytes must be present;
 * unused bytes are simply ignored.
 * 
 *      REG_DATA.CMD    (3-bit class code, 5-bit operation code)
 *      REG_DATA.HEAD   (1-bit drive number, 5-bit head number)
 *      REG_DATA.CLSEC  (upper bits of 10-bit cylinder number, 6-bit sector number)
 *      REG_DATA.CH     (lower bits of 10-bit cylinder number)
 *      REG_DATA.COUNT  (8-bit interleave or block count)
 *      REG_DATA.CTRL   (8-bit control field)
 *      
 * One command, HDC.REG_DATA.CMD.INIT_DRIVE, must include 8 additional bytes following the DCB:
 * 
 *      maximum number of cylinders (high)
 *      maximum number of cylinders (low)
 *      maximum number of heads
 *      start reduced write current cylinder (high)
 *      start reduced write current cylinder (low)
 *      start write precompensation cylinder (high)
 *      start write precompensation cylinder (low)
 *      maximum ECC data burst length
 *      
 * Note that the 3 word values above are stored in "big-endian" format (high byte followed by low byte),
 * rather than the more typical "little-endian" format (low byte followed by high byte).
 */
HDC.REG_DATA.CMD = {};
HDC.REG_DATA.CMD.TEST_READY     = 0x00;         // Test Drive Ready
HDC.REG_DATA.CMD.RECALIBRATE    = 0x01;         // Recalibrate
HDC.REG_DATA.CMD.REQUEST_SENSE  = 0x03;         // Request Sense Status
HDC.REG_DATA.CMD.FORMAT_DRIVE   = 0x04;         // Format Drive
HDC.REG_DATA.CMD.READ_VERIFY    = 0x05;         // Read Verify
HDC.REG_DATA.CMD.FORMAT_TRACK   = 0x06;         // Format Track
HDC.REG_DATA.CMD.FORMAT_BAD     = 0x07;         // Format Bad Track
HDC.REG_DATA.CMD.READ_DATA      = 0x08;         // Read
HDC.REG_DATA.CMD.WRITE_DATA     = 0x0A;         // Write
HDC.REG_DATA.CMD.SEEK           = 0x0B;         // Seek
HDC.REG_DATA.CMD.INIT_DRIVE     = 0x0C;         // Initialize Drive Characteristics
HDC.REG_DATA.CMD.READ_ECC_BURST = 0x0D;         // Read ECC Burst Error Length
HDC.REG_DATA.CMD.READ_BUFFER    = 0x0E;         // Read Data from Sector Buffer
HDC.REG_DATA.CMD.WRITE_BUFFER   = 0x0F;         // Write Data to Sector Buffer
HDC.REG_DATA.CMD.RAM_DIAGNOSTIC = 0xE0;         // RAM Diagnostic
HDC.REG_DATA.CMD.DRV_DIAGNOSTIC = 0xE3;         // HDC BIOS: CHK_DRV_CMD
HDC.REG_DATA.CMD.CTL_DIAGNOSTIC = 0xE4;         // HDC BIOS: CNTLR_DIAG_CMD
HDC.REG_DATA.CMD.READ_LONG      = 0xE5;         // HDC BIOS: RD_LONG_CMD
HDC.REG_DATA.CMD.WRITE_LONG     = 0xE6;         // HDC BIOS: WR_LONG_CMD

/*
 * HDC error conditions, as returned in byte 0 of the (4) bytes returned by the Request Sense Status command
 */
HDC.REG_DATA.ERR = {};
HDC.REG_DATA.ERR.NONE           = 0x00;
HDC.REG_DATA.ERR.NO_INDEX       = 0x01;         // no index signal detected
HDC.REG_DATA.ERR.SEEK_INCOMPLETE= 0x02;         // no seek-complete signal
HDC.REG_DATA.ERR.WRITE_FAULT    = 0x03;
HDC.REG_DATA.ERR.NOT_READY      = 0x04;         // after the controller selected the drive, the drive did not respond with a ready signal
HDC.REG_DATA.ERR.NO_TRACK       = 0x06;         // after stepping the max number of cylinders, the controller did not receive the track 00 signal from the drive
HDC.REG_DATA.ERR.STILL_SEEKING  = 0x08;
HDC.REG_DATA.ERR.ECC_ID_ERROR   = 0x10;
HDC.REG_DATA.ERR.ECC_DATA_ERROR = 0x11;
HDC.REG_DATA.ERR.NO_ADDR_MARK   = 0x12;
HDC.REG_DATA.ERR.NO_SECTOR      = 0x14;
HDC.REG_DATA.ERR.BAD_SEEK       = 0x15;         // seek error: the cylinder and/or head address did not compare with the expected target address
HDC.REG_DATA.ERR.ECC_CORRECTABLE= 0x18;         // correctable data error
HDC.REG_DATA.ERR.BAD_TRACK      = 0x19;
HDC.REG_DATA.ERR.BAD_CMD        = 0x20;
HDC.REG_DATA.ERR.BAD_DISK_ADDR  = 0x21;
HDC.REG_DATA.ERR.RAM            = 0x30;
HDC.REG_DATA.ERR.CHECKSUM       = 0x31;
HDC.REG_DATA.ERR.POLYNOMIAL     = 0x32;
HDC.REG_DATA.ERR.MASK           = 0x3F;
HDC.REG_DATA.SENSE_ADDR_VALID   = 0x80;

/*
 * HDC Command Sequences
 * 
 * Unlike the FDC, all the HDC commands have fixed-length command request sequences (well, OK, except for 
 * HDC.REG_DATA.CMD.INIT_DRIVE) and fixed-length response sequences (well, OK, except for HDC.REG_DATA.CMD.REQUEST_SENSE),
 * so a table of byte-lengths isn't much use, but having names for all the commands is still handy for debugging.
 */
if (DEBUG) {
    HDC.aCmdNames = {
        0x00: "Test Drive Ready",
        0x01: "Recalibrate",
        0x03: "Request Sense Status",
        0x04: "Format Drive",
        0x05: "Read Verify",
        0x06: "Format Track",
        0x07: "Format Bad Track",
        0x08: "Read",
        0x0A: "Write",
        0x0B: "Seek",
        0x0C: "Initialize Drive Characteristics",
        0x0D: "Read ECC Burst Error Length",
        0x0E: "Read Data from Sector Buffer",
        0x0F: "Write Data to Sector Buffer",
        0xE0: "RAM Diagnostic",
        0xE3: "Drive Diagnostic",
        0xE4: "Controller Diagnostic",
        0xE5: "Read Long",
        0xE6: "Write Long"
    };
}

/**
 * setBinding(sHTMLClass, sHTMLType, sBinding, control)
 * 
 * @this {HDC}
 * @param {string|null} sHTMLClass is the class of the HTML control (eg, "input", "output")
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "listDisks")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
HDC.prototype.setBinding = function(sHTMLClass, sHTMLType, sBinding, control) {
    /*
     * This is reserved for future use; for now, hard disk images can be specified during initialization only (no "hot-swapping")
     */
    return false;
};

/**
 * initBus(cmp, bus, cpu, dbg)
 * 
 * @this {HDC}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {X86CPU} cpu
 * @param {Debugger} dbg
 */
HDC.prototype.initBus = function(cmp, bus, cpu, dbg) {
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.cmp = cmp;

    /*
     * We need access to the ChipSet component, because we need to communicate with
     * the PIC and DMA controller.
     */
    this.chipset = cmp.getComponentByType("ChipSet");

    bus.addPortInputTable(this, HDC.aPortInput);
    bus.addPortOutputTable(this, HDC.aPortOutput);
    
    if (DEBUGGER) {
        cpu.addInterruptNotify(HDC.BIOS.DISK_INT, this, this.intBIOSDisk);
        cpu.addInterruptNotify(HDC.BIOS.DISKETTE_INT, this, this.intBIOSDiskette);
    }
    
    /*
     * The following code used to be performed in the HDC constructor, but now we need to wait for information
     * about the Computer to be available (eg, getMachineID() and getUserID()) before we start loading and/or
     * connecting to disk images.
     * 
     * If we didn't need auto-mount support, we could defer controller initialization until we received a powerUp()
     * notification, at which point reset() would call initController(), or restore() would restore the controller;
     * in that case, all we'd need to do here is call setReady().
     */
    this.initController();

    if (!this.autoMount()) {
        this.setReady();
    }
};

/**
 * powerUp(data, fRepower)
 *
 * @this {HDC}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
HDC.prototype.powerUp = function(data, fRepower) {
    if (!fRepower) {
        if (!data || !this.restore) {
            this.reset();
            if (this.cmp.fReload) {
                /*
                 * If the computer's fReload flag is set, we're required to toss all currently
                 * loaded disks and remount all disks specified in the auto-mount configuration. 
                 */
                this.autoMount(true);
            }
        } else {
            if (!this.restore(data)) return false;
        }
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 * 
 * @this {HDC}
 * @param {boolean} fSave
 * @param {boolean} [fShutdown]
 * @return {Object|boolean}
 */
HDC.prototype.powerDown = function(fSave, fShutdown) {
    return fSave && this.save? this.save() : true;
};

/**
 * getMachineID()
 * 
 * @return {string}
 */
HDC.prototype.getMachineID = function() {
    return this.cmp? this.cmp.getMachineID() : "";
};

/**
 * getUserID()
 *
 * @return {string}
 */
HDC.prototype.getUserID = function() {
    return this.cmp? this.cmp.getUserID() : "";
};

/**
 * reset()
 * 
 * @this {HDC}
 */
HDC.prototype.reset = function() {
    /*
     * NOTE: The controller is also initialized by the constructor, to assist with auto-mount support,
     * so think about whether we can skip powerUp initialization.
     */
    this.initController();
};

/**
 * save()
 * 
 * This implements save support for the HDC component.
 *
 * @this {HDC}
 * @return {Object}
 */
HDC.prototype.save = function() {
    var state = new State(this);
    state.set(0, this.saveController());
    return state.data();
};

/**
 * restore(data)
 * 
 * This implements restore support for the HDC component.
 *
 * @this {HDC}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
HDC.prototype.restore = function(data) {
    return this.initController(data[0]);
};

/**
 * initController(data)
 * 
 * @this {HDC}
 * @param {Array} [data]
 * @return {boolean} true if successful, false if failure
 */
HDC.prototype.initController = function(data) {
    var i = 0;
    var fSuccess = true;
    if (data === undefined) data = [0, HDC.REG_STATUS.NONE, new Array(14), 0, 0];
    this.regConfig = data[i++];
    this.regStatus = data[i++];
    this.regDataArray = data[i++];  // there can be up to 14 command bytes (6 for normal commands, plus 8 more for HDC.REG_DATA.CMD.INIT_DRIVE)
    this.regDataIndex = data[i++];  // used to control the next data byte to be received
    this.regDataTotal = data[i++];  // used to control the next data byte to be sent (internally, we use regDataIndex to read data bytes, up to this total)
    this.regReset = data[i++];
    this.regPulse = data[i++];
    this.regPattern = data[i++];

    /*
     * Initialize iDriveAllowFail only if it's never been initialized before, otherwise its entire
     * purpose will be defeated.  See the related HACK in intBIOSDisk() for more details.
     */
    var iDriveAllowFail = data[i++];
    if (iDriveAllowFail !== undefined) {
        this.iDriveAllowFail = iDriveAllowFail;
    } else {
        if (this.iDriveAllowFail === undefined) this.iDriveAllowFail = -1;
    }

    if (this.aDrives === undefined) {
        this.aDrives = new Array(this.aDriveConfigs.length);
    }

    var dataDrives = data[i];
    if (dataDrives === undefined) dataDrives = [];

    for (var iDrive = 0; iDrive < this.aDrives.length; iDrive++) {
        if (this.aDrives[iDrive] === undefined) {
            this.aDrives[iDrive] = {};
        }
        var drive = this.aDrives[iDrive];
        var driveConfig = this.aDriveConfigs[iDrive];
        if (!this.initDrive(iDrive, drive, driveConfig, dataDrives[iDrive])) {
            fSuccess = false;
        }
        /*
         * The original STC-506/412 controller had two pairs of DIP switches to indicate a drive
         * type (0, 1, 2 or 3) for drives 0 and 1.  Those switch settings are recorded in regConfig,
         * now that drive.type has been validated by initDrive().
         */
        if (iDrive <= 1) {
            this.regConfig |= (drive.type & 0x3) << ((1 - iDrive) << 1);
        }
    }
    if (DEBUG) this.messageDebugger("HDC initialized for " + this.aDrives.length + " drive(s)");
    return fSuccess;
};

/**
 * saveController()
 * 
 * @this {HDC}
 * @return {Array}
 */
HDC.prototype.saveController = function() {
    var i = 0;
    var data = [];
    data[i++] = this.regConfig;
    data[i++] = this.regStatus;
    data[i++] = this.regDataArray;
    data[i++] = this.regDataIndex;
    data[i++] = this.regDataTotal;
    data[i++] = this.regReset;
    data[i++] = this.regPulse;
    data[i++] = this.regPattern;
    data[i++] = this.iDriveAllowFail;
    data[i] = this.saveDrives();
    return data;
};

/**
 * initDrive(iDrive, drive, driveConfig, data)
 * 
 * @this {HDC}
 * @param {number} iDrive
 * @param {Object} drive
 * @param {Object} driveConfig (contains one or more of the following properties: 'name', 'path', 'size', 'type')
 * @param {Array} [data]
 * @return {boolean} true if successful, false if failure
 */
HDC.prototype.initDrive = function(iDrive, drive, driveConfig, data) {
    var i = 0;
    var fSuccess = true;
    if (data === undefined) data = [HDC.REG_DATA.ERR.NONE, 0, false, new Array(8)];

    drive.iDrive = iDrive;

    /*
     * errorCode could be an HDC global, but in order to insulate HDC state from the operation of various functions that operate on drive
     * objects (eg, readByte and writeByte), I've made it a per-drive variable.  This choice is probably contrary to how the actual hardware
     * works, but I prefer this approach, as long as it doesn't expose any incompatibilities that any software actually cares about.
     */
    drive.errorCode = data[i++];
    drive.senseCode = data[i++];
    drive.fRemovable = data[i++];
    drive.abDriveParms = data[i++];         // captures drive parameters programmed via HDC.REG_DATA.CMD.INIT_DRIVE
    drive.abSectorBuffer = data[i++];

    /*
     * The next group of properties are set by various HDC command sequences.
     */
    drive.bHead = data[i++];
    drive.nHeads = data[i++];
    drive.wCylinder = data[i++];
    drive.bSector = data[i++];
    drive.bSectorEnd = data[i++];           // aka EOT
    drive.nBytes = data[i++];

    drive.name = driveConfig['name'];
    if (drive.name === undefined) drive.name = HDC.DEFAULT_DRIVE_NAME;
    drive.path = driveConfig['path'];

    /*
     * If no 'mode' is specified, we fall back to the original behavior, which is to completely preload
     * any specific disk image, or create an empty (purely local) disk image.
     */
    drive.mode = driveConfig['mode'] || (drive.path? DiskAPI.MODE.PRELOAD : DiskAPI.MODE.LOCAL);
    
    /*
     * On-demand I/O of raw disk images is supported only if there's a valid user ID; fall back to an empty
     * local disk image if there's not.
     */
    if (drive.mode == DiskAPI.MODE.DEMANDRO || drive.mode == DiskAPI.MODE.DEMANDRW) {
        if (!this.getUserID()) drive.mode = DiskAPI.MODE.LOCAL;
    }

    drive.type = driveConfig['type'];
    if (drive.type === undefined || HDC.aDriveTypes[drive.type] === undefined) drive.type = HDC.DEFAULT_DRIVE_TYPE;
    var driveType = HDC.aDriveTypes[drive.type];
    drive.nSectors = driveType[2];          // sectors/track
    drive.cbSector = driveType[3];          // bytes/sector

    /*
     * The next group of properties are set by user requests to load/unload disk images.
     * 
     * NOTE: I now avoid reinitializing drive.disk in order to retain any previously mounted disk across resets.
     */
    if (drive.disk === undefined) {
        drive.disk = null;
        this.notice("Type " + drive.type + " \"" + drive.name + "\" is fixed disk " + iDrive, true);
    }

    /*
     * With the advent of save/restore, we need to verify every drive at initialization, not just whenever
     * drive characteristics are initialized.  Thus, if we've restored a sensible set of drive characteristics,
     * then verifyDrive will create an empty disk if none has been provided, insuring we are ready for
     * disk.restore().
     */
    this.verifyDrive(drive);

    /*
     * The next group of properties are managed by worker functions (eg, doRead()) to maintain state across DMA requests.
     */
    drive.ibSector = data[i++];             // location of the next byte to be accessed in the above sector
    drive.sector = null;                    // initialized to null by worker, and then set to the next sector satisfying the request

    if (drive.disk) {
        var deltas = data[i];
        if (deltas !== undefined && drive.disk.restore(deltas) < 0) {
            fSuccess = false;
        }
        if (fSuccess && drive.ibSector !== undefined) {
            drive.sector = drive.disk.seek(drive.wCylinder, drive.bHead, drive.bSector + 1);
        }
    }
    return fSuccess;
};

/**
 * saveDrives()
 * 
 * @this {HDC}
 * @return {Array}
 */
HDC.prototype.saveDrives = function() {
    var i = 0;
    var data = [];
    for (var iDrive = 0; iDrive < this.aDrives.length; iDrive++) {
        data[i++] = this.saveDrive(this.aDrives[iDrive]);
    }
    return data;
};

/**
 * saveDrive(drive)
 * 
 * @this {HDC}
 * @return {Array}
 */
HDC.prototype.saveDrive = function(drive) {
    var i = 0;
    var data = [];
    data[i++] = drive.errorCode;
    data[i++] = drive.senseCode;
    data[i++] = drive.fRemovable;
    data[i++] = drive.abDriveParms;
    data[i++] = drive.abSectorBuffer;
    data[i++] = drive.bHead;
    data[i++] = drive.nHeads;
    data[i++] = drive.wCylinder;
    data[i++] = drive.bSector;
    data[i++] = drive.bSectorEnd;
    data[i++] = drive.nBytes;
    data[i++] = drive.ibSector;
    data[i] = drive.disk? drive.disk.save() : null;
    return data;
};

/**
 * copyDrive(iDrive)
 * 
 * @this {HDC}
 * @param {number} iDrive
 * @return {Object|undefined} (undefined if the requested drive does not exist)
 */
HDC.prototype.copyDrive = function(iDrive) {
    var driveNew;
    var driveOld = this.aDrives[iDrive];
    if (driveOld !== undefined) {
        driveNew = {};
        for (var p in driveOld) {
            driveNew[p] = driveOld[p];
        }
    }
    return driveNew;
};

/**
 * verifyDrive(drive, type)
 *
 * If no disk image is attached, create an empty disk with the specified drive characteristics.
 * Normally, we'd rely on the drive characteristics programmed via the HDC.REG_DATA.CMD.INIT_DRIVE
 * command, but if an explicit drive type is specified, then we use the characteristics (geometry)
 * associated with that type.
 * 
 * @this {HDC}
 * @param {Object} drive
 * @param {number} [type] to create a disk of the specified type, if no disk exists yet
 */
HDC.prototype.verifyDrive = function(drive, type) {
    if (drive) {
        var nHeads = 0, nCylinders = 0;
        if (type == null) {
            /*
             * If the caller wants us to use the programmed drive parameters, we use those,
             * but if there aren't any drive parameters (yet), then use default parameters based
             * on drive.type.
             * 
             * We used to do the last step ONLY if there was no drive.path -- otherwise, we'd waste
             * time creating an empty disk if autoMount() was going to load an image from drive.path;
             * but hopefully the Disk component is smarter now.
             */
            nHeads = drive.abDriveParms[2];
            if (nHeads) {
                nCylinders = (drive.abDriveParms[0] << 8) | drive.abDriveParms[1];
            } else {
                type = drive.type;
            }
        }
        if (type != null && !nHeads) {
            nHeads = HDC.aDriveTypes[type][1];
            nCylinders = HDC.aDriveTypes[type][0];
        }
        if (nHeads) {
            /*
             * The assumption here is that if the 3rd drive parameter byte (abDriveParms[2]) has been set
             * (ie, if nHeads is valid) then the first two bytes (ie, the low and high cylinder byte values)
             * must have been set as well.
             *
             * Do these values agree with those for the given drive type?  Even if they don't, all we do is warn.
             */
            var driveType = HDC.aDriveTypes[drive.type];
            if (driveType) {
                if (nCylinders != driveType[0] && nHeads != driveType[1]) {
                    this.notice("Warning: drive parameters (" + nCylinders + "," + nHeads + ") do not match drive type " + drive.type + " (" + driveType[0] + "," + driveType[1] + ")");
                }
            }
            drive.nCylinders = nCylinders;
            drive.nHeads = nHeads;
            if (drive.disk == null) {
                drive.disk = new Disk(this, drive, drive.mode);
            }
        }
    }
};

/**
 * seekDrive(drive, iSector, nSectors)
 *
 * The HDC doesn't need this function, since all HDC requests from the CPU are handled by doCmd().  This function
 * is used by other components (eg, Debugger) to mimic an HDC request, using a drive object obtained from copyDrive(),
 * to avoid disturbing the internal state of the HDC's drive objects.
 *
 * Also note that in an actual HDC request, drive.nBytes is initialized to the size of a single sector; the extent
 * of the entire transfer is actually determined by a count that has been pre-loaded into the DMA controller.  The HDC
 * isn't aware of the extent of the transfer, so in the case of a read request, all readByte() can do is return bytes
 * until the current track (or, in the case of a multi-track request, the current cylinder) has been exhausted.
 *
 * Since seekDrive() is for use with non-DMA requests, we use nBytes to specify the length of the entire transfer.
 * 
 * @this {HDC}
 * @param {Object} drive
 * @param {number} iSector (a "logical" sector number, relative to the entire disk, NOT a physical sector number)
 * @param {number} nSectors
 * @return {boolean} true if successful, false if invalid position request
 */
HDC.prototype.seekDrive = function(drive, iSector, nSectors) {
    if (drive.disk) {
        var aDiskInfo = drive.disk.info();
        var nCylinders = aDiskInfo[0];
        /*
         * If nCylinders is zero, we probably have an empty disk image, awaiting initialization (see verifyDrive()) 
         */
        if (nCylinders) {
            var nHeads = aDiskInfo[1];
            var nSectorsPerTrack = aDiskInfo[2];
            var nSectorsPerCylinder = nHeads * nSectorsPerTrack;
            var nSectorsPerDisk = nCylinders * nSectorsPerCylinder;
            if (iSector + nSectors <= nSectorsPerDisk) {
                drive.wCylinder = Math.floor(iSector / nSectorsPerCylinder);
                iSector %= nSectorsPerCylinder;
                drive.bHead = Math.floor(iSector / nSectorsPerTrack);
                /*
                 * Important difference between the FDC and the HDC: the HDC uses 0-based sector numbers, so unlike
                 * FDC.seekDrive(), we must NOT add 1 to bSector below.  I could change how sector numbers are stored in
                 * hard disk images, but it seems preferable to keep the image format consistent and controller-independent.
                 */
                drive.bSector = (iSector % nSectorsPerTrack);
                drive.nBytes = nSectors * aDiskInfo[3];
                /*
                 * NOTE: We don't set nSectorEnd, as an HDC command would, but it's irrelevant, because we don't actually
                 * do anything with nSectorEnd at this point.  Perhaps someday, when we faithfully honor/restrict requests
                 * to a single track (or a single cylinder, in the case of multi-track requests). 
                 */
                drive.errorCode = HDC.REG_DATA.ERR.NONE;
                /*
                 * At this point, we've finished simulating what an HDC.REG_DATA.CMD.READ_DATA command would have performed,
                 * up through doRead().  Now it's the caller responsibility to call readByte(), like the DMA Controller would.
                 */
                return true;
            }
        }
    }
    return false;
};

/**
 * autoMount(fRemount)
 * 
 * @this {HDC}
 * @param {boolean} [fRemount] is true if we're remounting all auto-mounted disks
 * @return {boolean} true if one or more disk images are being auto-mounted, false if none
 */
HDC.prototype.autoMount = function(fRemount) {
    if (!fRemount) this.cAutoMount = 0;
    for (var iDrive = 0; iDrive < this.aDrives.length; iDrive++) {
        var drive = this.aDrives[iDrive];
        if (drive.name && drive.path) {
            if (!this.loadDisk(iDrive, drive.name, drive.path, true) && fRemount)
                this.setReady(false);
            continue;
        }
        if (fRemount && drive.type !== undefined) {
            drive.disk = null;
            this.verifyDrive(drive, drive.type);
        }
    }
    return !!this.cAutoMount;
};

/**
 * loadDisk(iDrive, sDiskName, sDiskPath, fAutoMount)
 * 
 * @this {HDC}
 * @param {number} iDrive
 * @param {string} sDiskName
 * @param {string} sDiskPath
 * @param {boolean} fAutoMount
 * @return {boolean} true if disk (already) loaded, false if queued up (or busy)
 */
HDC.prototype.loadDisk = function(iDrive, sDiskName, sDiskPath, fAutoMount) {
    var drive = this.aDrives[iDrive];
    if (drive.fBusy) {
        this.notice("Drive " + iDrive + " busy");
        return true;
    }
    drive.fBusy = true;
    if (fAutoMount) {
        drive.fAutoMount = true;
        this.cAutoMount++;
        this.messageDebugger("loading " + sDiskName);
    }
    var disk = drive.disk || new Disk(this, drive, drive.mode);
    disk.load(sDiskName, sDiskPath, this.mountDisk);
    return false;
};

/**
 * mountDisk(drive, disk, sDiskName, sDiskPath)
 * 
 * This is a callback issued by the Disk component once its own mount() operation has finished.
 * 
 * @this {HDC}
 * @param {Object} drive
 * @param {Disk} disk is set if the disk was successfully mounted, null if not
 * @param {string} sDiskName
 * @param {string} sDiskPath
 */
HDC.prototype.mountDisk = function(drive, disk, sDiskName, sDiskPath) {
    drive.fBusy = false;
    if ((drive.disk = disk)) {
        /*
         * With the addition of notify(), users are now "alerted" whenever a diskette has finished loading;
         * notify() is selective about its output, using print() if a print window is open, otherwise alert().
         *
         * WARNING: This conversion of drive number to drive letter, starting with "C:" (0x43), is very simplistic
         * and is not guaranteed to match the drive mapping that DOS ultimately uses.
         */
        this.notice("Mounted disk \"" + sDiskName + "\" in drive " + String.fromCharCode(0x43 + drive.iDrive), drive.fAutoMount);
    }
    if (drive.fAutoMount) {
        drive.fAutoMount = false;
        if (!--this.cAutoMount) this.setReady();
    }
};

/**
 * inHDCData(port, addrFrom)
 *
 * NOTE: At the moment, we support only auto-mounts; there is no user interface for selecting hard disk images,
 * let alone unloading them, so there is currently no need for the following function.
 * 
 * @this {HDC}
 * @param {number} iDrive
 *
 HDC.prototype.unloadDrive = function(iDrive) {
    this.aDrives[iDrive].disk = null;
    //
    // WARNING: This conversion of drive number to drive letter, starting with "C:" (0x43), is very simplistic
    // and is not guaranteed to match the drive mapping that DOS ultimately uses.
    //
    this.notice("Drive " + String.fromCharCode(0x43 + iDrive) + " unloaded");
};
 */

/**
 * @this {HDC}
 * @param {number} port (0x320)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
HDC.prototype.inHDCData = function(port, addrFrom) {
    var bIn = 0;
    if (this.regDataIndex < this.regDataTotal) {
        bIn = this.regDataArray[this.regDataIndex];
    }
    if (this.chipset) this.chipset.clearIRR(ChipSet.IRQ.HDC);
    this.regStatus &= ~HDC.REG_STATUS.INTERRUPT;

    this.messagePort(port, null, addrFrom, "DATA[" + this.regDataIndex + "]", bIn);
    if (++this.regDataIndex >= this.regDataTotal) {
        this.regDataIndex = this.regDataTotal = 0;
        this.regStatus &= ~(HDC.REG_STATUS.IOMODE | HDC.REG_STATUS.BUS | HDC.REG_STATUS.BUSY);
    }
    return bIn;
};

/**
 * outHDCData(port, bOut, addrFrom)
 * 
 * @this {HDC}
 * @param {number} port (0x320)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
HDC.prototype.outHDCData = function(port, bOut, addrFrom) {
    this.messagePort(port, bOut, addrFrom, "DATA[" + this.regDataTotal + "]");
    if (this.regDataTotal < this.regDataArray.length) {
        this.regDataArray[this.regDataTotal++] = bOut;
    }
    var bCmd = this.regDataArray[0];
    var cbCmd = (bCmd != HDC.REG_DATA.CMD.INIT_DRIVE? 6 : this.regDataArray.length);
    if (this.regDataTotal == 6) {
        /*
         * REG_STATUS.REQ must be CLEAR following any 6-byte command sequence that the HDC BIOS "COMMAND" function outputs,
         * yet it must also be SET before the HDC BIOS will proceed with the remaining the 8-byte sequence that's part of
         * HDC.REG_DATA.CMD.INIT_DRIVE command. See inHDCStatus() for HACK details.
         */
        this.regStatus &= ~HDC.REG_STATUS.REQ;
    }
    if (this.regDataTotal >= cbCmd) {
        /*
         * It's essential that REG_STATUS.IOMODE be set here, at least after the final 8-byte HDC.REG_DATA.CMD.INIT_DRIVE sequence.  
         */
        this.regStatus |= HDC.REG_STATUS.IOMODE;
        this.regStatus &= ~HDC.REG_STATUS.REQ;
        this.doCmd();
    }
};

/**
 * inHDCStatus(port, addrFrom)
 * 
 * @this {HDC}
 * @param {number} port (0x321)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
HDC.prototype.inHDCStatus = function(port, addrFrom) {
    var b = this.regStatus;
    this.messagePort(port, null, addrFrom, "STATUS", b);
    /*
     * HACK: The HDC BIOS will not finish the HDC.REG_DATA.CMD.INIT_DRIVE sequence unless it sees REG_STATUS.REQ set again, nor will
     * it read any of the REG_DATA bytes returned from a HDC.REG_DATA.CMD.REQUEST_SENSE command unless REG_STATUS.REQ is set again, so
     * we turn it back on if there are unprocessed data bytes.
     */
    if (this.regDataIndex < this.regDataTotal) {
        this.regStatus |= HDC.REG_STATUS.REQ;
    }
    return b;
};

/**
 * outHDCReset(port, bOut, addrFrom)
 * 
 * @this {HDC}
 * @param {number} port (0x321)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
HDC.prototype.outHDCReset = function(port, bOut, addrFrom) {
    this.messagePort(port, bOut, addrFrom, "RESET");
    /*
     * Not sure what to do with this value, and the value itself may be "don't care", but we'll save it anyway. 
     */
    this.regReset = bOut;
    if (this.chipset) this.chipset.clearIRR(ChipSet.IRQ.HDC);
    this.initController();
};

/**
 * inHDCConfig(port, addrFrom)
 * 
 * @this {HDC}
 * @param {number} port (0x322)
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to read the specified port)
 * @return {number} simulated port value
 */
HDC.prototype.inHDCConfig = function(port, addrFrom) {
    this.messagePort(port, null, addrFrom, "CONFIG", this.regConfig);
    return this.regConfig;
};

/**
 * outHDCPulse(port, bOut, addrFrom)
 * 
 * @this {HDC}
 * @param {number} port (0x322)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
HDC.prototype.outHDCPulse = function(port, bOut, addrFrom) {
    this.messagePort(port, bOut, addrFrom, "PULSE");
    /*
     * Not sure what to do with this value, and the value itself may be "don't care", but we'll save it anyway. 
     */
    this.regPulse = bOut;
    /*
     * The HDC BIOS "COMMAND" function (@C800:0562) waits for these ALL status bits after writing to both regPulse
     * and regPattern, so we must oblige it.
     */
    /*
     * TODO: Figure out exactly when either REG_STATUS.BUS or REG_STATUS.BUSY supposed to be cleared.
     * The HDC BIOS doesn't care much about them, except for the one location mentioned above. However, MS-DOS 4.0
     * (aka the unreleased "multitasking" version of MS-DOS) cares, so I'm going to start by clearing them at the
     * same point I clear REG_STATUS.IOMODE.
     */
    this.regStatus = HDC.REG_STATUS.REQ | HDC.REG_STATUS.BUS | HDC.REG_STATUS.BUSY;
};

/**
 * outHDCPattern(port, bOut, addrFrom)
 * 
 * @this {HDC}
 * @param {number} port (0x323)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
HDC.prototype.outHDCPattern = function(port, bOut, addrFrom) {
    this.messagePort(port, bOut, addrFrom, "PATTERN");
    this.regPattern = bOut;
};

/**
 * outHDCNoise(port, bOut, addrFrom)
 * 
 * @this {HDC}
 * @param {number} port (0x327, 0x32B or 0x32F)
 * @param {number} bOut
 * @param {number} [addrFrom] (not defined whenever the Debugger tries to write the specified port)
 */
HDC.prototype.outHDCNoise = function(port, bOut, addrFrom) {
    this.messagePort(port, bOut, addrFrom, "NOISE");
};

/**
 * intBIOSDisk(addr)
 *
 * NOTE: This function tries to differentiate HDC requests from FDC requests, by whether the INT 0x13 drive number in DL is >= 0x80
 *
 * HACK: The HDC BIOS code for both INT 0x13/AH=0x00 and INT 0x13/AH=0x09 calls "INIT_DRV" @C800:0427, which is hard-coded
 * to issue the HDC.REG_DATA.CMD.INIT_DRIVE command for BOTH drives 0 and 1 (aka drive numbers 0x80 and 0x81), regardless of
 * the drive number specified in DL; this means that the HDC.REG_DATA.CMD.INIT_DRIVE command must always succeed for drive 1
 * if it also succeeds for drive 0 -- even if there is no drive 1.  Bizarre, but OK, whatever.
 *
 * So assuming we a have drive 0, when the power-on diagnostics in "DISK_SETUP" @C800:0003 call INT 0x13/AH=0x09 @C800:00DB
 * for drive 0, it must succeed.  No problem. But when "DISK_SETUP" starts probing for additional drives, it first issues
 * INT 0x13/AH=0x00, followed by INT 0x13/AH=0x11, and finally INT 0x13/AH=0x09.  If the first (AH=0x00) or third (AH=0x09)
 * INT 0x13 fails, it quickly moves on (ie, it jumps to "POD_DONE").  But as we just discussed, both those operations call "INIT_DRV",
 * which can't return an error.  This means the only function that can return an error in this context is the recalibrate function
 * (AH=0x11).  That sucks, because the way the HDC BIOS is written, it will loop for anywhere from 1.5 seconds to 25 seconds
 * (depending on whether the controller is part of the "System Unit" or not; see port 0x213), attempting to recalibrate drive 1
 * until it finally times out.
 *
 * Normally, you'll only experience the 1.5 second delay, but even so, it's a ridiculous waste of time and a lot of useless
 * INT 0x13 calls.  So I monitor INT 0x13/AH=0x00 for DL >= 0x80 and set a special HDC.REG_DATA.CMD.INIT_DRIVE override flag
 * (iDriveAllowFail) that will allow that command to fail, and in theory, make the the HDC BIOS "DISK_SETUP" code much more efficient.
 * 
 * @this {HDC}
 * @param {number} addr
 * @return {boolean} true to proceed with the INT 0x13 software interrupt, false to skip
 */
HDC.prototype.intBIOSDisk = function(addr) {
    var AH = this.cpu.regAX >> 8;
    var DL = this.cpu.regDX & 0xff;
    if (!AH && DL > 0x80) {
        this.iDriveAllowFail = DL - 0x80;
    }
    if (DEBUGGER) {
        if (this.dbg && this.dbg.messageEnabled(this.dbg.MESSAGE_HDC) && DL >= 0x80) {
            this.dbg.message("HDC.intBIOSDisk(AX=" + str.toHexWord(this.cpu.regAX) + ",DL=" + str.toHexByte(DL) + ") at " + str.toHexAddr(addr - this.cpu.segCS.base, this.cpu.segCS.sel));
            // this.cpu.haltCPU();
            this.cpu.addInterruptReturn(addr, function (hdc, nCycles) {
                return function onBIOSDiskReturn(nLevel) {
                    hdc.intBIOSDiskReturn(nCycles, nLevel);
                };
            }(this, this.cpu.getCycles()));
        }
    }
    return true;
};

/**
 * intBIOSDiskReturn(nCycles, nLevel)
 * 
 * @this {HDC}
 * @param {number} nCycles
 * @param {number} nLevel
 */
HDC.prototype.intBIOSDiskReturn = function(nCycles, nLevel) {
    if (DEBUGGER) {
        nCycles = this.cpu.getCycles() - nCycles;
        this.messageDebugger("HDC.intBIOSDiskReturn(" + nLevel + "): C=" + (this.cpu.getCF()? 1 : 0) + " (cycles=" + nCycles + ")");
        // if (DEBUG && nCycles > 10000) this.cpu.haltCPU();
    }
};

/**
 * intBIOSDiskette(addr)
 *
 * Every time an INT 0x40 is issued with AH=0 and IRQ_FDC masked, eat the INT 0x40 interrupt.
 *
 * For more details on why this is necessary, see the definition of HDC.BIOS.DISKETTE_INT (above)
 * 
 * @this {HDC}
 * @param {number} addr
 * @return {boolean} true to proceed with the INT 0x40 software interrupt, false to skip
 */
HDC.prototype.intBIOSDiskette = function(addr) {
    var AH = this.cpu.regAX >> 8;
    if ((!AH && this.chipset && this.chipset.checkIMR(ChipSet.IRQ.FDC))) {
        if (DEBUG) this.messageDebugger("HDC.intBIOSDiskette(): skipping useless INT 0x40 diskette reset");
        return false;
    }
    return true;
};

/**
 * doCmd()
 * 
 * @this {HDC}
 */
HDC.prototype.doCmd = function() {
    var hdc = this;
    this.regDataIndex = 0;
    
    var bCmd = this.popCmd();
    var bCmdOrig = bCmd;
    var b1 = this.popCmd();
    var bDrive = b1 & 0x20;
    var iDrive = (bDrive >> 5);

    var bHead = b1 & 0x1f;
    var b2 = this.popCmd();
    var b3 = this.popCmd();
    var wCylinder = ((b2 << 2) & 0x300) | b3;
    var bSector = b2 & 0x3f;
    var bCount = this.popCmd();             // block count or interleave count, depending on the command
    var bControl = this.popCmd();
    var bParm, bDataStatus;

    var drive = this.aDrives[iDrive];
    if (drive) {
        drive.wCylinder = wCylinder;
        drive.bHead = bHead;
        drive.bSector = bSector;
        drive.nBytes = bCount * drive.cbSector;
    }

    /*
     * I tried to save normal command processing from having to deal with invalid drives,
     * but the HDC BIOS initializes both drive 0 AND drive 1 on a HDC.REG_DATA.CMD.INIT_DRIVE command,
     * and apparently that particular command has no problem with non-existent drives.
     * 
     * So I've separated the commands into two groups: drive-ambivalent commands should be
     * processed in the first group, and all the rest should be processed in the second group. 
     */
    switch (bCmd) {
        case HDC.REG_DATA.CMD.REQUEST_SENSE:        // 0x03
            this.beginResult(drive? drive.errorCode : HDC.REG_DATA.ERR.NOT_READY);
            this.pushResult(b1);
            this.pushResult(b2);
            this.pushResult(b3);
            /*
             * Although not terribly clear from IBM's "Fixed Disk Adapter" documentation,
             * a data "status byte" also follows the 4 "sense bytes".  Interestingly, The HDC BIOS
             * checks that data status byte for REG_DATA.STATUS_ERROR, but I have to wonder if it
             * would have ever been set for this command....
             *
             * The whole point of the HDC.REG_DATA.CMD.REQUEST_SENSE command is to obtain details about a
             * previous error, so if HDC.REG_DATA.CMD.REQUEST_SENSE itself reports an error, what would that mean?
             */
            this.pushResult(HDC.REG_DATA.STATUS_OK | bDrive);
            bCmd = -1;                              // mark the command as complete
            break;
        case HDC.REG_DATA.CMD.INIT_DRIVE:           // 0x0C
            /*
             * Pop off all the extra "Initialize Drive Characteristics" bytes and store them,
             * for the benefit of other functions, like verifyDrive().
             */
            var i = 0;
            while ((bParm = this.popCmd()) >= 0) {
                if (drive && i < drive.abDriveParms.length) {
                    drive.abDriveParms[i++] = bParm;
                }
            }
            if (drive) this.verifyDrive(drive);
            bDataStatus = HDC.REG_DATA.STATUS_OK;
            if (!drive && this.iDriveAllowFail == iDrive) {
                this.iDriveAllowFail = -1;
                if (DEBUG) this.messageDebugger("HDC.doCmd(): fake failure triggered");
                bDataStatus = HDC.REG_DATA.STATUS_ERROR;
            }
            this.beginResult(bDataStatus | bDrive);
            bCmd = -1;                              // mark the command as complete
            break;
        case HDC.REG_DATA.CMD.RAM_DIAGNOSTIC:       // 0xE0
        case HDC.REG_DATA.CMD.CTL_DIAGNOSTIC:       // 0xE4
            this.beginResult(HDC.REG_DATA.STATUS_OK | bDrive);
            bCmd = -1;                              // mark the command as complete
            break;
    }

    if (bCmd >= 0) {
        if (drive === undefined) {
            bCmd = -1;
        } else {
            /*
             * In preparation for this command, zero out the drive's errorCode and senseCode.
             * Commands that require a disk address should update senseCode with HDC.REG_DATA.SENSE_ADDR_VALID.
             * And of course, any command that encounters an error should set the appropriate error code.
             */
            drive.errorCode = HDC.REG_DATA.ERR.NONE;
            drive.senseCode = 0;
        }
        switch (bCmd) {
            case HDC.REG_DATA.CMD.TEST_READY:       // 0x00
                this.beginResult(HDC.REG_DATA.STATUS_OK | bDrive);
                break;
            case HDC.REG_DATA.CMD.RECALIBRATE:      // 0x01
                drive.bControl = bControl;
                if (DEBUG) this.messageDebugger("HDC.doCmd(): drive " + iDrive + " control byte: 0x" + str.toHexByte(bControl));
                this.beginResult(HDC.REG_DATA.STATUS_OK | bDrive);
                break;
            case HDC.REG_DATA.CMD.READ_VERIFY:      // 0x05
                /*
                 * This is a non-DMA operation, so we simply pretend everything is OK for now; TODO: Revisit.
                 */
                this.beginResult(HDC.REG_DATA.STATUS_OK | bDrive);
                break;
            case HDC.REG_DATA.CMD.READ_DATA:        // 0x08
                this.doRead(drive, function(bStatus) {
                    hdc.beginResult(bStatus | bDrive);
                });
                break;
            case HDC.REG_DATA.CMD.WRITE_DATA:       // 0x0A
                /*
                 * QUESTION: The IBM TechRef (p1-188) implies that bCount is used as part of HDC.REG_DATA.CMD.WRITE_DATA command,
                 * but it is omitted from the HDC.REG_DATA.CMD.READ_DATA command.  Is that correct?  Note that, as far as the length
                 * of the transfer is concerned, we rely exclusively on the DMA controller being programmed with the
                 * appropriate byte count.
                 */
                this.doWrite(drive, function(bStatus) {
                    hdc.beginResult(bStatus | bDrive);
                });
                break;
            case HDC.REG_DATA.CMD.WRITE_BUFFER:     // 0x0F
                this.doWriteToBuffer(drive, function(bStatus) {
                    hdc.beginResult(bStatus | bDrive);
                });
                break;
            default:
                if (DEBUG) this.messageDebugger((bCmd < 0? "HDC.doCmd(): invalid drive" : "unsupported operation") + " (command=0x" + str.toHexByte(bCmdOrig) + ",drive=" + iDrive + ")");
                this.beginResult(HDC.REG_DATA.STATUS_ERROR | bDrive);
                if (DEBUG && DEBUGGER && this.dbg && this.dbg.messageEnabled(this.dbg.MESSAGE_HDC) && bCmd >= 0) this.cpu.haltCPU();
                break;
        }
    }
};

/**
 * popCmd()
 * 
 * @this {HDC}
 * @return {number}
 */
HDC.prototype.popCmd = function() {
    var bCmd = -1;
    var bCmdIndex = this.regDataIndex;
    if (bCmdIndex < this.regDataTotal) {
        bCmd = this.regDataArray[this.regDataIndex++];
        if (DEBUG && DEBUGGER && this.dbg && this.dbg.messageEnabled((bCmdIndex > 0? this.dbg.MESSAGE_PORT : 0) | this.dbg.MESSAGE_HDC)) {
            this.dbg.message("HDC.CMD[" + bCmdIndex + "]: 0x" + str.toHexByte(bCmd) + (!bCmdIndex && HDC.aCmdNames[bCmd]? (" (" + HDC.aCmdNames[bCmd] + ")") : ""));
        }
    }
    return bCmd;
};

/**
 * beginResult(bResult)
 * 
 * @this {HDC}
 * @param {number} [bResult]
 */
HDC.prototype.beginResult = function(bResult) {
    this.regDataIndex = this.regDataTotal = 0;
    
    if (bResult !== undefined) {
        if (DEBUG) this.messageDebugger("HDC.beginResult(0x" + str.toHexByte(bResult) + ")");
        this.pushResult(bResult);
    }
    /*
     * After the Execution phase (eg, DMA Terminal Count has occurred, or the EOT sector has been read/written),
     * an interrupt is supposed to occur, signaling the beginning of the Result Phase.  Once the data "status byte"
     * has been read from REG_DATA, the interrupt is cleared (see inHDCData).
     */
    if (this.chipset) this.chipset.setIRR(ChipSet.IRQ.HDC);
    this.regStatus |= HDC.REG_STATUS.INTERRUPT;
};

/**
 * pushResult(bResult)
 * 
 * @this {HDC}
 * @param {number} bResult
 */
HDC.prototype.pushResult = function(bResult) {
    if (DEBUG && DEBUGGER && this.dbg && this.dbg.messageEnabled((this.regDataTotal > 0? this.dbg.MESSAGE_PORT : 0) | this.dbg.MESSAGE_HDC)) this.dbg.message("HDC.RES[" + this.regDataTotal + "]: 0x" + str.toHexByte(bResult));
    this.regDataArray[this.regDataTotal++] = bResult;
};

/**
 * dmaRead(drive, b, done)
 *
 * @this {HDC}
 * @param {Object} drive
 * @param {number} b
 * @param {function(number,boolean)} done
 */
HDC.prototype.dmaRead = function(drive, b, done) {
    if (b === undefined || b < 0) {
        this.readByte(drive, done);
        return;
    }
    /*
     * The DMA controller should be ASKING for data, not GIVING us data; this suggests an internal DMA miscommunication
     */
    if (DEBUG) this.messageDebugger("dmaRead(): invalid DMA acknowledgement");
    done(-1, false);
};

/**
 * dmaWrite(drive, b)
 *
 * @this {HDC}
 * @param {Object} drive
 * @param {number} b
 * @return {number}
 */
HDC.prototype.dmaWrite = function(drive, b) {
    if (b !== undefined && b >= 0)
        return this.writeByte(drive, b);
    /*
     * The DMA controller should be GIVING us data, not ASKING for data; this suggests an internal DMA miscommunication
     */
    if (DEBUG) this.messageDebugger("dmaWrite(): invalid DMA acknowledgement");
    return -1;
};

/**
 * dmaWriteBuffer(drive, b)
 *
 * @this {HDC}
 * @param {Object} drive
 * @param {number} b
 * @return {number}
 */
HDC.prototype.dmaWriteBuffer = function(drive, b) {
    if (b !== undefined && b >= 0)
        return this.writeBuffer(drive, b);
    /*
     * The DMA controller should be GIVING us data, not ASKING for data; this suggests an internal DMA miscommunication
     */
    if (DEBUG) this.messageDebugger("dmaWriteBuffer(): invalid DMA acknowledgement");
    return -1;
};

/**
 * dmaWriteFormat(drive, b)
 *
 * @this {HDC}
 * @param {Object} drive
 * @param {number} b
 * @returns {number}
 */
HDC.prototype.dmaWriteFormat = function(drive, b) {
    if (b !== undefined && b >= 0)
        return this.writeFormat(drive, b);
    /*
     * The DMA controller should be GIVING us data, not ASKING for data; this suggests an internal DMA miscommunication
     */
    if (DEBUG) this.messageDebugger("dmaWritedFormat(): invalid DMA acknowledgement");
    return -1;
};

/**
 * doRead(drive, done)
 *
 * @this {HDC}
 * @param {Object} drive
 * @param {function(number)} done (dataStatus is REG_DATA.STATUS_OK or REG_DATA.STATUS_ERROR; if error, then drive.errorCode should be set as well)
 */
HDC.prototype.doRead = function(drive, done) {
    drive.errorCode = HDC.REG_DATA.ERR.NOT_READY;

    if (DEBUG) this.messageDebugger("HDC.doRead(" + drive.wCylinder + ":" + drive.bHead + ":" + drive.bSector + ")");

    // if (DEBUG) this.messageDebugger("HDC.doRead(head=" + str.toHexByte(drive.bHead) + ",cyl=" + str.toHexWord(drive.wCylinder) + ",sec=" + str.toHexByte(drive.bSector) + ")");
    
    if (drive.disk) {
        drive.sector = null;
        if (this.chipset) {
            /*
             * We need to reverse the original logic, and default to success unless/until an actual error occurs;
             * otherwise dmaRead()/readByte() will bail on us.  The original approach used to work because requestDMA()
             * would immediately call us back with fComplete set to true EVEN if the DMA channel was not yet unmasked;
             * now the callback is deferred until the DMA channel has been unmasked and the DMA request has finished.
             */
            drive.errorCode = HDC.REG_DATA.ERR.NONE;
            this.chipset.connectDMA(ChipSet.DMA_HDC, this, 'dmaRead', drive);
            this.chipset.requestDMA(ChipSet.DMA_HDC, function(fComplete) {
                if (!fComplete) {
                    /*
                     * If an incomplete request wasn't triggered by an explicit error, then let's make explicit (ie,
                     * revert to the default failure code that we originally set above). 
                     */
                    if (drive.errorCode == HDC.REG_DATA.ERR.NONE) {
                        drive.errorCode = HDC.REG_DATA.ERR.NOT_READY;
                    }
                }
                done(drive.errorCode? HDC.REG_DATA.STATUS_ERROR : HDC.REG_DATA.STATUS_OK);
            });
            return;
        }
    }
    done(drive.errorCode? HDC.REG_DATA.STATUS_ERROR : HDC.REG_DATA.STATUS_OK);
};

/**
 * doWrite(drive, done)
 * 
 * @this {HDC}
 * @param {Object} drive
 * @param {function(number)} done (dataStatus is REG_DATA.STATUS_OK or REG_DATA.STATUS_ERROR; if error, then drive.errorCode should be set as well)
 */
HDC.prototype.doWrite = function(drive, done) {
    drive.errorCode = HDC.REG_DATA.ERR.NOT_READY;

    if (DEBUG) this.messageDebugger("HDC.doWrite(" + drive.wCylinder + ":" + drive.bHead + ":" + drive.bSector + ")");

    // if (DEBUG) this.messageDebugger("HDC.doWrite(head=" + str.toHexByte(drive.bHead) + ",cyl=" + str.toHexWord(drive.wCylinder) + ",sec=" + str.toHexByte(drive.bSector) + ")");
    
    if (drive.disk) {
        drive.sector = null;
        if (this.chipset) {
            /*
             * We need to reverse the original logic, and default to success unless/until an actual error occurs;
             * otherwise dmaWrite()/writeByte() will bail on us.  The original approach would work because requestDMA()
             * would immediately call us back with fComplete set to true EVEN if the DMA channel was not yet unmasked;
             * now the callback is deferred until the DMA channel has been unmasked and the DMA request has finished.
             */
            drive.errorCode = HDC.REG_DATA.ERR.NONE;
            this.chipset.connectDMA(ChipSet.DMA_HDC, this, 'dmaWrite', drive);
            this.chipset.requestDMA(ChipSet.DMA_HDC, function(fComplete) {
                if (!fComplete) {
                    /*
                     * If an incomplete request wasn't triggered by an explicit error, then let's make explicit (ie,
                     * revert to the default failure code that we originally set above). 
                     */
                    if (drive.errorCode == HDC.REG_DATA.ERR.NONE) {
                        drive.errorCode = HDC.REG_DATA.ERR.NOT_READY;
                    }
                    /*
                     * Mask any error that's the result of an attempt to write beyond the end of the track (which is
                     * something the MS-DOS 4.0M's FORMAT utility seems to like to do).
                     */
                    if (drive.errorCode == HDC.REG_DATA.ERR.NO_SECTOR) {
                        drive.errorCode = HDC.REG_DATA.ERR.NONE;
                    }
                }
                done(drive.errorCode? HDC.REG_DATA.STATUS_ERROR : HDC.REG_DATA.STATUS_OK);
            });
            return;
        }
    }
    done(drive.errorCode? HDC.REG_DATA.STATUS_ERROR : HDC.REG_DATA.STATUS_OK);
};

/**
 * doWriteToBuffer(drive, done)
 * 
 * @this {HDC}
 * @param {Object} drive
 * @param {function(number)} done (dataStatus is REG_DATA.STATUS_OK or REG_DATA.STATUS_ERROR; if error, then drive.errorCode should be set as well)
 */
HDC.prototype.doWriteToBuffer = function(drive, done) {
    drive.errorCode = HDC.REG_DATA.ERR.NOT_READY;
    
    if (DEBUG) this.messageDebugger("HDC.doWriteToBuffer()");
    
    if (!drive.abSectorBuffer || drive.abSectorBuffer.length != drive.nBytes) {
        drive.abSectorBuffer = new Array(drive.nBytes);
    }
    drive.ibSector = 0;
    if (this.chipset) {
        /*
         * We need to reverse the original logic, and default to success unless/until an actual error occurs;
         * otherwise dmaWriteBuffer() will bail on us.  The original approach would work because requestDMA()
         * would immediately call us back with fComplete set to true EVEN if the DMA channel was not yet unmasked;
         * now the callback is deferred until the DMA channel has been unmasked and the DMA request has finished.
         */
        drive.errorCode = HDC.REG_DATA.ERR.NONE;
        this.chipset.connectDMA(ChipSet.DMA_HDC, this, 'dmaWriteBuffer', drive);
        this.chipset.requestDMA(ChipSet.DMA_HDC, function(fComplete) {
            if (!fComplete) {
                /*
                 * If an incomplete request wasn't triggered by an explicit error, then let's make explicit (ie,
                 * revert to the default failure code that we originally set above). 
                 */
                if (drive.errorCode == HDC.REG_DATA.ERR.NONE) {
                    drive.errorCode = HDC.REG_DATA.ERR.NOT_READY;
                }
            }
            done(drive.errorCode? HDC.REG_DATA.STATUS_ERROR : HDC.REG_DATA.STATUS_OK);
        });
        return;
    }
    done(drive.errorCode? HDC.REG_DATA.STATUS_ERROR : HDC.REG_DATA.STATUS_OK);
};

/**
 * doFormat(drive, done)
 *
 * The drive variable is initialized by doCmd() to the following extent:
 *
 *      drive.bHead (ignored)
 *      drive.nBytes (bytes/sector)
 *      drive.bSectorEnd (sectors/track)
 *      drive.bFiller (fill byte)
 *
 * and we expect the DMA controller to provide C, H, R and N (ie, 4 bytes) for each sector to be formatted.
 * 
 * @this {HDC}
 * @param {Object} drive
 * @param {function(number)} done (dataStatus is REG_DATA.STATUS_OK or REG_DATA.STATUS_ERROR; if error, then drive.errorCode should be set as well)
 */
HDC.prototype.doFormat = function(drive, done) {
    drive.errorCode = HDC.REG_DATA.ERR.NOT_READY;
    
    // if (DEBUG) this.messageDebugger("HDC.doFormat()");
    
    if (drive.disk) {
        drive.sector = null;
        if (this.chipset) {
            drive.cbFormat = 0;
            drive.abFormat = new Array(4);
            drive.bFormatting = true;
            drive.cSectorsFormatted = 0;
            /*
             * We need to reverse the original logic, and default to success unless/until an actual error occurs;
             * otherwise dmaWriteFormat() will bail on us.  The original approach would work because requestDMA()
             * would immediately call us back with fComplete set to true EVEN if the DMA channel was not yet unmasked;
             * now the callback is deferred until the DMA channel has been unmasked and the DMA request has finished.
             */
            drive.errorCode = HDC.REG_DATA.ERR.NONE;
            this.chipset.connectDMA(ChipSet.DMA_HDC, this, 'dmaWriteFormat', drive);
            this.chipset.requestDMA(ChipSet.DMA_HDC, function(fComplete) {
                if (!fComplete) {
                    /*
                     * If an incomplete request wasn't triggered by an explicit error, then let's make explicit (ie,
                     * revert to the default failure code that we originally set above). 
                     */
                    if (drive.errorCode == HDC.REG_DATA.ERR.NONE) {
                        drive.errorCode = HDC.REG_DATA.ERR.NOT_READY;
                    }
                }
                drive.bFormatting = false;
                done(drive.errorCode? HDC.REG_DATA.STATUS_ERROR : HDC.REG_DATA.STATUS_OK);
            });
            return;
        }
    }
    done(drive.errorCode? HDC.REG_DATA.STATUS_ERROR : HDC.REG_DATA.STATUS_OK);
};

/**
 * readByte(drive, done)
 *
 * The following drive variable properties must have been setup prior to our first call:
 *
 *      drive.wCylinder
 *      drive.bHead
 *      drive.bSector
 *      drive.sector (initialized to null)
 *
 * On the first readByte() request, since drive.sector will be null, we ask the Disk object to look
 * up the first sector of the request.  We then ask the Disk for bytes from that sector until the sector
 * is exhausted, and then we look up the next sector and continue the process.
 *
 * NOTE: Since the HDC isn't aware of the extent of the transfer, all readByte() can do is return bytes
 * until the current track (or, in the case of a multi-track request, the current cylinder) has been exhausted.
 *
 * TODO: Research the requirements, if any, for multi-track I/O and determine what if anything needs to be
 * done.  At the very least, if it must be supported, there would need to be some head-incrementing somewhere.
 *
 * @this {HDC}
 * @param {Object} drive
 * @param {function(number,boolean)} done (number is next available byte from drive, or -1 if no more bytes available)
 */
HDC.prototype.readByte = function(drive, done) {
    var b = -1;
    if (drive.errorCode) {
        done(b, false);
        return;
    }
    if (drive.sector) {
        b = drive.disk.read(drive.sector, drive.ibSector++);
        if (b >= 0) {
            done(b, false);
            return;
        }
    }
    /*
     * Locate the next sector, and then try reading again.
     *
     * Important difference between the FDC and the HDC: the HDC uses 0-based sector numbers,
     * hence the "+1" below.  I could change how sector numbers are stored in the image, but it
     * seems preferable to keep the image format consistent and controller-independent.
     */
    drive.disk.seek(drive.wCylinder, drive.bHead, drive.bSector + 1, false, function(sector, fAsync) {
        var b = -1;
        if ((drive.sector = sector)) {
            drive.ibSector = 0;
            drive.bSector++;
            b = drive.disk.read(drive.sector, drive.ibSector++);
        } else {
            drive.errorCode = HDC.REG_DATA.ERR.NO_SECTOR;
        }
        done(b, fAsync);
    });
};

/**
 * writeByte(drive, b)
 *
 * The following drive variable properties must have been setup prior to our first call:
 *
 *      drive.wCylinder
 *      drive.bHead
 *      drive.bSector
 *      drive.sector (initialized to null)
 *
 * On the first writeByte() request, since drive.sector will be null, we ask the Disk object to look
 * up the first sector of the request.  We then send the Disk bytes for that sector until the sector
 * is full, and then we look up the next sector and continue the process.
 *
 * NOTE: Since the HDC isn't aware of the extent of the transfer, all writeByte() can do is accept bytes
 * until the current track (or, in the case of a multi-track request, the current cylinder) has been exhausted.
 *
 * TODO: Research the requirements, if any, for multi-track I/O and determine what if anything needs to be
 * done.  At the very least, if it must be supported, there would need to be some head-incrementing somewhere.
 * 
 * @this {HDC}
 * @param {Object} drive
 * @param {number} b containing next byte to write
 * @return {number} (b unchanged; return -1 if command should be terminated)
 */
HDC.prototype.writeByte = function(drive, b) {
    if (drive.errorCode) return -1;
    do {
        if (drive.sector) {
            if (drive.disk.write(drive.sector, drive.ibSector++, b))
                break;
        }
        /*
         * Locate the next sector, and then try writing again.
         *
         * Important difference between the FDC and the HDC: the HDC uses 0-based sector numbers,
         * hence the "+1" below.  I could change how sector numbers are stored in the image, but it
         * seems preferable to keep the image format consistent and controller-independent.
         */
        drive.disk.seek(drive.wCylinder, drive.bHead, drive.bSector + 1, true, function(sector, fAsync) {
            drive.sector = sector;
        });
        if (!drive.sector) {
            drive.errorCode = HDC.REG_DATA.ERR.NO_SECTOR;
            b = -1;
            break;
        }
        drive.ibSector = 0;
        drive.bSector++;
    } while (true);
    return b;
};

/**
 * writeBuffer(drive, b)
 *
 * NOTE: Since the HDC isn't aware of the extent of the transfer, all writeBuffer() can do is accept bytes
 * until the buffer is full.
 *
 * TODO: Support for HDC.REG_DATA.CMD.READ_BUFFER is missing, and support for HDC.REG_DATA.CMD.WRITE_BUFFER may not be complete;
 * tests required.
 * 
 * @this {HDC}
 * @param {Object} drive
 * @param {number} b containing next byte to write
 * @return {number} (b unchanged; return -1 if command should be terminated)
 */
HDC.prototype.writeBuffer = function(drive, b) {
    if (drive.ibSector < drive.abSectorBuffer.length) {
        drive.abSectorBuffer[drive.ibSector++] = b;
    } else {
        /*
         * TODO: Determine the proper error code to return here. 
         */
        drive.errorCode = HDC.REG_DATA.ERR.NO_SECTOR;
        b = -1;
    }
    return b;
};

/**
 * writeFormat(drive, b)
 * 
 * @this {HDC}
 * @param {Object} drive
 * @param {number} b containing a format command byte
 * @return {number} (b if successful, -1 if command should be terminated)
 */
HDC.prototype.writeFormat = function(drive, b) {
    if (drive.errorCode) return -1;
    drive.abFormat[drive.cbFormat++] = b;
    if (drive.cbFormat == drive.abFormat.length) {
        drive.wCylinder = drive.abFormat[0];    // C
        drive.bHead = drive.abFormat[1];        // H
        drive.bSector = drive.abFormat[2];      // R
        drive.nBytes = 128 << drive.abFormat[3];// N (0 => 128, 1 => 256, 2 => 512, 3 => 1024)
        drive.cbFormat = 0;

        if (DEBUG) this.messageDebugger("HDC.writeFormat(" + drive.wCylinder + ":" + drive.bHead + ":" + drive.bSector + ":" + drive.nBytes + ")");

        // if (DEBUG) this.messageDebugger("HDC.writeFormat(head=" + str.toHexByte(drive.bHead) + ",cyl=" + str.toHexWord(drive.wCylinder) + ",sec=" + str.toHexByte(drive.bSector) + ",len=" + str.toHexWord(drive.nBytes) + ")");
        
        for (var i = 0; i < drive.nBytes; i++) {
            if (this.writeByte(drive, drive.bFiller) < 0) {
                return -1;
            }
        }
        drive.cSectorsFormatted++;
    }
    if (drive.cSectorsFormatted >= drive.bSectorEnd) b = -1;
    return b;
};

/**
 * messageDebugger(sMessage)
 *
 * This is a combination of the Debugger's messageEnabled(MESSAGE_HDC) and message() functions, for convenience.
 * 
 * @this {HDC}
 * @param {string} sMessage is any caller-defined message string
 */
HDC.prototype.messageDebugger = function(sMessage) {
    if (DEBUGGER && this.dbg) {
        if (this.dbg.messageEnabled(this.dbg.MESSAGE_HDC)) {
            this.dbg.message(sMessage);
        }
    }
};

/**
 * messagePort(port, bOut, addrFrom, name, bIn)
 *
 * This is an internal version of the Debugger's messagePort() function, for convenience.
 * 
 * @this {HDC}
 * @param {number} port
 * @param {number|null} bOut if an output operation
 * @param {number|null} [addrFrom]
 * @param {string|null} [name] of the port, if any
 * @param {number} [bIn] is the input value, if known, on an input operation
 */
HDC.prototype.messagePort = function(port, bOut, addrFrom, name, bIn) {
    if (DEBUGGER && this.dbg) {
        this.dbg.messagePort(this, port, bOut, addrFrom, name, this.dbg.MESSAGE_HDC, bIn);
    }
};

/*
 * Port input notification table
 */
HDC.aPortInput = {
    0x320: HDC.prototype.inHDCData,
    0x321: HDC.prototype.inHDCStatus,
    0x322: HDC.prototype.inHDCConfig
};

/*
 * Port output notification table
 */
HDC.aPortOutput = {
    0x320: HDC.prototype.outHDCData,
    0x321: HDC.prototype.outHDCReset,
    0x322: HDC.prototype.outHDCPulse,
    0x323: HDC.prototype.outHDCPattern,
    /*
     * The PC XT Fixed Disk BIOS includes some additional "housekeeping" that it performs
     * not only on port 0x323 but also on three additional ports at increments of 4 (see all
     * references to "RESET INT/DMA MASK" in the Fixed Disk BIOS).  It's not clear to me if
     * those ports refer to additional HDC controllers, and I haven't seen other references to
     * them, but in any case, they represent a lot of "I/O noise" that we simply squelch here.
     */
    0x327: HDC.prototype.outHDCNoise,
    0x32B: HDC.prototype.outHDCNoise,
    0x32F: HDC.prototype.outHDCNoise
};

/**
 * HDC.init()
 *
 * This function operates on every element (e) of class "hdc", and initializes
 * all the necessary HTML to construct the HDC module(s) as spec'ed.
 *
 * Note that each element (e) of class "hdc" is expected to have a "data-value"
 * attribute containing the same JSON-encoded parameters that the HDC constructor expects.
 */
HDC.init = function() {
    var aeHDC = Component.getElementsByClass(window.document, PCJSCLASS, "hdc");
    for (var iHDC = 0; iHDC < aeHDC.length; iHDC++) {
        var eHDC = aeHDC[iHDC];
        var parmsHDC = Component.getComponentParms(eHDC);
        var hdc = new HDC(parmsHDC);
        Component.bindComponentControls(hdc, eHDC, PCJSCLASS);
    }
};

/*
 * Initialize every Hard Drive Controller (HDC) module on the page.
 */
web.onInit(HDC.init);

if (typeof APP_PCJS !== 'undefined') APP_PCJS.HDC = HDC;

if (typeof module !== 'undefined') module.exports = HDC;
