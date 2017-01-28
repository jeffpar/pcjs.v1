/**
 * @fileoverview Implements a generic disk drive controller
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
    var Str = require("../../shared/es6/strlib");
    var Web = require("../../shared/es6/weblib");
    var DiskAPI = require("../../shared/es6/diskapi");
    var Component = require("../../shared/es6/component");
    var State = require("../../shared/es6/state");
    var PDP11 = require("./defines");
    var MessagesPDP11 = require("./messages");
    var DiskPDP11 = require("./disk");
}

/**
 * @typedef {{
 *  PRI:        number,
 *  VEC:        number,
 *  DRIVES:     number
 * }}
 */
var Config;

class DriveController extends Component {
    /**
     * DriveController(type, parms, bitsMessage, configDC)
     *
     * The DriveController component has the following component-specific (parms) properties:
     *
     *      autoMount: one or more JSON-encoded objects, each containing 'name' and 'path' properties
     *
     * @param {string} type
     * @param {Object} parms
     * @param {number} bitsMessage
     * @param {Config} configDC
     * @param {Array} driveInfo
     * @param {Object} tableIO
     */
    constructor(type, parms, bitsMessage, configDC, driveInfo, tableIO)
    {
        super(type, parms, bitsMessage);

        /*
         * We preliminarily parse and record any 'autoMount' object now, but we no longer process it
         * until initBus(), because the Computer's getMachineParm() service may have an override for us.
         */
        this.configMount = this.parseConfig(parms['autoMount']);
        this.cAutoMount = 0;

        this.configDC = configDC;
        this.driveInfo = driveInfo;
        this.tableIO = tableIO;

        this.nDrives = configDC.DRIVES;
        this.aDrives = new Array(this.nDrives);
        this.fLocalDisks = (!Web.isMobile() && window && 'FileReader' in window);
        this.sDiskSource = DriveController.SOURCE.NONE;

        /*
         * The following array keeps track of every disk image we've ever mounted.  Each entry in the
         * array is another array whose elements are:
         *
         *      [0]: name of disk
         *      [1]: path of disk
         *      [2]: array of deltas, uninitialized until the disk is unmounted and/or all state is saved
         *
         * See functions addDiskHistory() and updateDiskHistory().
         */
        this.aDiskHistory = [];

        this.irq = null;
    }

    /**
     * parseConfig(config)
     *
     * @this {DriveController}
     * @param {*} config
     * @return {*}
     */
    parseConfig(config)
    {
        if (config && typeof config == "string") {
            try {
                /*
                 * The most likely source of any exception will be right here, where we're parsing
                 * this JSON-encoded data.
                 */
                config = eval("(" + config + ")");
            } catch (e) {
                Component.error(this.type + " auto-mount error: " + e.message + " (" + config + ")");
                config = null;
            }
        }
        return config || {};
    }

    /**
     * setBinding(sType, sBinding, control, sValue)
     *
     * @this {DriveController}
     * @param {string|null} sType is the type of the HTML control (eg, "button", "list", "text", etc)
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "listDisks")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sType, sBinding, control, sValue)
    {
        var dc = this;

        switch (sBinding) {

        case "listDisks":
            this.bindings[sBinding] = control;

            control.onchange = function onChangeListDisks(event) {
                var controlDesc = dc.bindings["descDisk"];
                var controlOption = control.options && control.options[control.selectedIndex];
                if (controlDesc && controlOption) {
                    var dataValue = {};
                    var sValue = controlOption.getAttribute("data-value");
                    if (sValue) {
                        try {
                            dataValue = eval("(" + sValue + ")");
                        } catch (e) {
                            Component.error(dc.type + " option error: " + e.message);
                        }
                    }
                    var sHTML = dataValue['desc'];
                    if (sHTML === undefined) sHTML = "";
                    var sHRef = dataValue['href'];
                    if (sHRef !== undefined) sHTML = "<a href=\"" + sHRef + "\" target=\"_blank\">" + sHTML + "</a>";
                    controlDesc.innerHTML = sHTML;
                }
            };
            return true;

        case "descDisk":
        case "listDrives":
            this.bindings[sBinding] = control;
            /*
             * I tried going with onclick instead of onchange, so that if you wanted to confirm what's
             * loaded in a particular drive, you could click the drive control without having to change it.
             * However, that doesn't seem to work for all browsers, so I've reverted to onchange.
             */
            control.onchange = function onChangeListDrives(event) {
                var iDrive = Str.parseInt(control.value, 10);
                if (iDrive != null) dc.displayDisk(iDrive);
            };
            return true;

        case "loadDisk":
            this.bindings[sBinding] = control;

            control.onclick = function onClickLoadDrive(event) {
                var controlDisks = dc.bindings["listDisks"];
                if (controlDisks && controlDisks.options) {
                    var sDiskName = controlDisks.options[controlDisks.selectedIndex].text;
                    var sDiskPath = controlDisks.value;
                    dc.loadSelectedDrive(sDiskName, sDiskPath);
                }
            };
            return true;

        case "bootDisk":
            this.bindings[sBinding] = control;

            control.onclick = function onClickBootDisk(event) {
                dc.bootSelectedDisk();
            };
            return true;

        case "saveDisk":
            /*
             * Yes, technically, this feature does not require "Local disk support" (which is really a reference
             * to FileReader support), but since fLocalDisks is also false for all mobile devices, and since there
             * is an "orthogonality" to disabling both features in tandem, let's just let it slide, OK?
             */
            if (!this.fLocalDisks) {
                if (DEBUG) this.log("Local disk support not available");
                /*
                 * We could also simply hide the control; eg:
                 *
                 *      control.style.display = "none";
                 *
                 * but removing the control altogether seems better.
                 */
                control.parentNode.removeChild(/** @type {Node} */ (control));
                return false;
            }

            this.bindings[sBinding] = control;

            control.onclick = function onClickSaveDrive(event) {
                var controlDrives = dc.bindings["listDrives"];
                if (controlDrives && controlDrives.options && dc.aDrives) {
                    var iDriveSelected = Str.parseInt(controlDrives.value, 10) || 0;
                    var drive = dc.aDrives[iDriveSelected];
                    if (drive) {
                        /*
                         * Note the similarity (and hence factoring opportunity) between this code and the HDC's "saveHD*" binding.
                         */
                        var disk = drive.disk;
                        if (disk) {
                            if (DEBUG) dc.println("saving disk " + disk.sDiskPath + "...");
                            var sAlert = Web.downloadFile(disk.encodeAsBase64(), "octet-stream", true, disk.sDiskFile.replace(".json", ".img"));
                            Component.alertUser(sAlert);
                        } else {
                            dc.notice("No disk loaded in drive.");
                        }
                    } else {
                        dc.notice("No disk drive selected.");
                    }
                }
            };
            return true;

        case "mountDisk":
            if (!this.fLocalDisks) {
                if (DEBUG) this.log("Local disk support not available");
                /*
                 * We could also simply hide the control; eg:
                 *
                 *      control.style.display = "none";
                 *
                 * but removing the control altogether seems better.
                 */
                control.parentNode.removeChild(/** @type {Node} */ (control));
                return false;
            }

            this.bindings[sBinding] = control;

            /*
             * Enable "Mount" button only if a file is actually selected
             */
            control.addEventListener('change', function() {
                var fieldset = control.children[0];
                var files = fieldset.children[0].files;
                var submit = fieldset.children[1];
                submit.disabled = !files.length;
            });

            control.onsubmit = function(event) {
                var file = event.currentTarget[1].files[0];
                if (file) {
                    var sDiskPath = file.name;
                    var sDiskName = Str.getBaseName(sDiskPath, true);
                    dc.loadSelectedDrive(sDiskName, sDiskPath, file);
                }
                /*
                 * Prevent reloading of web page after form submission
                 */
                return false;
            };
            return true;

        default:
            break;
        }
        return false;
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {DriveController}
     * @param {ComputerPDP11} cmp
     * @param {BusPDP11} bus
     * @param {CPUStatePDP11} cpu
     * @param {DebuggerPDP11} dbg
     */
    initBus(cmp, bus, cpu, dbg)
    {
        this.cmp = cmp;
        this.bus = bus;
        this.cpu = cpu;
        this.dbg = dbg;

        var configMount = this.parseConfig(this.cmp.getMachineParm('autoMount'));

        /*
         * Add only drives from the machine-wide autoMount configuration that match drives managed by this component.
         */
        if (configMount) {
            for (var sDrive in configMount) {
                if (sDrive.substr(0, 2) != this.type.substr(0, 2)) continue;
                this.configMount[sDrive] = configMount[sDrive];
            }
        }

        /*
         * If we didn't need auto-mount support, we could defer controller initialization until we received
         * a powerUp() notification, at which point reset() would call initController(), or restore() would restore
         * the controller; in that case, all we'd need to do here is call setReady().
         */
        this.initController();

        this.irq = this.cpu.addIRQ(this.configDC.VEC, this.configDC.PRI, this.bitsMessage);

        bus.addIOTable(this, this.tableIO);
        bus.addResetHandler(this.reset.bind(this));

        this.addDisk("None", DriveController.SOURCE.NONE, true);
        if (this.fLocalDisks) this.addDisk("Local Disk", DriveController.SOURCE.LOCAL);
        this.addDisk("Remote Disk", DriveController.SOURCE.REMOTE);

        if (!this.autoMount()) this.setReady();
    }

    /**
     * getDriveName(iDrive)
     *
     * Form a drive name using the two-letter controller type prefix and the drive number.
     *
     * @this {DriveController}
     * @param {number} iDrive
     * @return {string}
     */
    getDriveName(iDrive)
    {
        return this.type.substr(0, 2) + iDrive;
    }

    /**
     * getDriveNumber(sDrive)
     *
     * @this {DriveController}
     * @param {string} sDrive
     * @return {number} (0-3, or -1 if error)
     */
    getDriveNumber(sDrive)
    {
        var iDrive = -1;
        if (sDrive) {
            iDrive = sDrive.charCodeAt(sDrive.length - 1) - 0x30;
            if (iDrive < 0 || iDrive > 9) iDrive = -1;
        }
        return iDrive;
    }

    /**
     * powerUp(data, fRepower)
     *
     * @this {DriveController}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
    {
        if (!fRepower) {
            if (!data) {
                this.reset();
                if (this.cmp.fReload) {
                    /*
                     * If the computer's fReload flag is set, we're required to toss all currently
                     * loaded disks and remount all disks specified in the auto-mount configuration.
                     */
                    this.unloadAllDrives(true);
                    this.autoMount(true);
                }
            } else {
                if (!this.restore(data)) return false;
            }
            /*
             * Populate the HTML controls to match the actual (well, um, specified) number of floppy drives.
             */
            var controlDrives;
            if ((controlDrives = this.bindings['listDrives'])) {
                while (controlDrives.firstChild) {
                    controlDrives.removeChild(controlDrives.firstChild);
                }
                controlDrives.value = "";
                for (var iDrive = 0; iDrive < this.nDrives; iDrive++) {
                    var controlOption = document.createElement("option");
                    controlOption.value = iDrive;
                    controlOption.text = this.getDriveName(iDrive);
                    controlDrives.appendChild(controlOption);
                }
                if (this.nDrives > 0) {
                    controlDrives.value = "0";
                    this.displayDisk(0);
                }
            }
        }
        return true;
    }

    /**
     * powerDown(fSave, fShutdown)
     *
     * @this {DriveController}
     * @param {boolean} [fSave]
     * @param {boolean} [fShutdown]
     * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
     */
    powerDown(fSave, fShutdown)
    {
        return fSave? this.save() : true;
    }

    /**
     * reset()
     *
     * @this {DriveController}
     */
    reset()
    {
        this.initController();
    }

    /**
     * save()
     *
     * This implements save support for the DriveController component.
     *
     * @this {DriveController}
     * @return {Object}
     */
    save()
    {
        var state = new State(this);
        state.set(0, this.saveController());
        state.set(0, this.saveDeltas());
        return state.data();
    }

    /**
     * restore(data)
     *
     * This implements restore support for the DriveController component.
     *
     * @this {DriveController}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    restore(data)
    {
        return this.initController(data[0], data[1]);
    }

    /**
     * initController(aRegs, aHistory)
     *
     * @this {DriveController}
     * @param {Array} [aRegs]
     * @param {Array} [aHistory]
     * @return {boolean} true if successful, false if failure
     */
    initController(aRegs, aHistory)
    {
        var fSuccess = true;

        /*
         * Initialize the disk history (if available) before initializing the drives, so that any disk deltas can be
         * applied to disk images that are already loaded.
         */
        if (aHistory) this.aDiskHistory = aHistory;

        for (var iDrive = 0; iDrive < this.aDrives.length; iDrive++) {
            var drive = this.aDrives[iDrive];
            if (drive === undefined) {
                drive = this.aDrives[iDrive] = {};
            }
            if (!this.initDrive(drive, iDrive, this.driveInfo)) {
                fSuccess = false;
            }
        }
        return fSuccess;
    }

    /**
     * saveController()
     *
     * Placeholder for subclasses.
     *
     * @this {DriveController}
     * @return {Array}
     */
    saveController()
    {
    }

    /**
     * saveDeltas()
     *
     * This returns an array of entries, one for each disk image we've ever mounted, including any deltas; ie:
     *
     *      [name, path, deltas]
     *
     * aDiskHistory contains exactly that, except that deltas may not be up-to-date for any currently mounted
     * disk image(s), so we call updateHistory() for all those disks, and then aDiskHistory is ready to be saved.
     *
     * @this {DriveController}
     * @return {Array}
     */
    saveDeltas()
    {
        for (var iDrive = 0; iDrive < this.aDrives.length; iDrive++) {
            var drive = this.aDrives[iDrive];
            if (drive.disk) {
                this.updateDiskHistory(drive.sDiskName, drive.sDiskPath, drive.disk);
            }
        }
        return this.aDiskHistory;
    }

    /**
     * initDrive(drive, iDrive, driveInfo)
     *
     * @this {DriveController}
     * @param {Object} drive
     * @param {number} iDrive
     * @param {Array} driveInfo
     * @return {boolean} true if successful, false if failure
     */
    initDrive(drive, iDrive, driveInfo)
    {
        var i = 0;
        var fSuccess = true;

        drive.iDrive = iDrive;
        drive.name = this.idComponent;
        drive.fBusy = drive.fLocal = false;
        drive.fRemovable = true;

        /*
         * NOTE: We initialize the following drive properties to their MAXIMUMs; disks may have
         * these or SMALLER values (subject to the limits of what the controller supports, of course).
         */
        drive.nCylinders = driveInfo[0];
        drive.nHeads = driveInfo[1];
        drive.nSectors = driveInfo[2];
        drive.cbSector = driveInfo[3];
        drive.status = driveInfo[4];

        /*
         * The next group of properties are set by various controller command sequences.
         */
        drive.bHead = 0;
        drive.bCylinder = 0;
        drive.bSector = 1;
        drive.bSectorEnd = drive.nSectors;      // aka EOT
        drive.nBytes = drive.cbSector;

        /*
         * The next group of properties are managed by worker functions (eg, doRead()) to maintain state across DMA requests.
         */
        drive.ibSector = 0;
        drive.sector = null;

        if (!drive.disk) drive.sDiskPath = "";  // ensure this is initialized to a default that displayDisk() can deal with

        return fSuccess;
    }

    /**
     * autoMount(fRemount)
     *
     * @this {DriveController}
     * @param {boolean} [fRemount] is true if we're remounting all auto-mounted disks
     * @return {boolean} true if one or more disk images are being auto-mounted, false if none
     */
    autoMount(fRemount)
    {
        if (!fRemount) this.cAutoMount = 0;
        for (var sDrive in this.configMount) {
            var configDrive = this.configMount[sDrive];
            var sDiskPath = configDrive['path'] || "";
            var sDiskName = configDrive['name'] || this.findDisk(sDiskPath);
            if (sDiskPath && sDiskName) {
                var iDrive = this.getDriveNumber(sDrive);
                if (iDrive >= 0 && iDrive < this.aDrives.length) {
                    if (!this.loadDrive(iDrive, sDiskName, sDiskPath, true) && fRemount) {
                        this.setReady(false);
                    }
                    continue;
                }
            }
            this.notice("Incorrect auto-mount settings for drive " + sDrive + " (" + JSON.stringify(configDrive) + ")");
        }
        return !!this.cAutoMount;
    }

    /**
     * loadSelectedDrive(sDiskName, sDiskPath, file)
     *
     * @this {DriveController}
     * @param {string} sDiskName
     * @param {string} sDiskPath
     * @param {File} [file] is set if there's an associated File object
     */
    loadSelectedDrive(sDiskName, sDiskPath, file)
    {
        var controlDrives = this.bindings["listDrives"];
        var iDrive = controlDrives && Str.parseInt(controlDrives.value, 10);

        if (iDrive === undefined || iDrive < 0 || iDrive >= this.aDrives.length) {
            this.notice("Unable to load the selected drive");
            return;
        }

        if (!sDiskPath) {
            this.unloadDrive(iDrive);
            return;
        }

        if (sDiskPath == DriveController.SOURCE.LOCAL) {
            this.notice('Use "Choose File" and "Mount" to select and load a local disk.');
            return;
        }

        /*
         * If the special DriveController.SOURCE.REMOTE path is selected, then we want to prompt the user for a URL.
         * Oh, and make sure we pass an empty string as the 2nd parameter to prompt(), so that IE won't display
         * "undefined" -- because after all, undefined and "undefined" are EXACTLY the same thing, right?
         *
         * TODO: This is literally all I've done to support remote disk images. There's probably more
         * I should do, like dynamically updating "listDisks" to include new entries, and adding new entries
         * to the save/restore data.
         */
        if (sDiskPath == DriveController.SOURCE.REMOTE) {
            sDiskPath = window.prompt("Enter the URL of a remote disk image.", "") || "";
            if (!sDiskPath) return;
            sDiskName = Str.getBaseName(sDiskPath);
            this.status("Attempting to load " + sDiskPath + " as \"" + sDiskName + "\"");
            this.sDiskSource = DriveController.SOURCE.REMOTE;
        }
        else {
            this.sDiskSource = sDiskPath;
        }

        this.loadDrive(iDrive, sDiskName, sDiskPath, false, file);
    }

    /**
     * bootSelectedDisk()
     *
     * @this {DriveController}
     */
    bootSelectedDisk()
    {
        var drive;
        var controlDrives = this.bindings["listDrives"];
        var iDrive = controlDrives && Str.parseInt(controlDrives.value, 10);

        if (iDrive == null || iDrive < 0 || iDrive >= this.aDrives.length || !(drive = this.aDrives[iDrive])) {
            this.notice("Unable to boot the selected drive");
            return;
        }
        if (!drive.disk) {
            this.notice("Load a disk into the drive first");
            return;
        }
        /*
         * NOTE: We're calling setReset() BEFORE reading the boot code in order to eliminate any side-effects
         * of the previous state of either the controller OR the CPU; for example, we don't want any previous MMU
         * or UNIBUS Map registers affecting the simulated readData() call.  Also, some boot code (eg, RSTS/E)
         * expects the controller to be in a READY state; since setReset() triggers a call to our reset() handler,
         * a READY state is assured, and the readData() call shouldn't do anything to change that.
         */
        this.cpu.setReset(0, true);
        var err = this.readData(drive, 0, 0, 0, 512, 0x0000, 2);
        if (err) {
            this.notice("Unable to read the boot sector (" + err + ")");
        }
    }

    /**
     * loadDrive(iDrive, sDiskName, sDiskPath, fAutoMount, file)
     *
     * NOTE: If sDiskPath is already loaded, nothing needs to be done.
     *
     * @this {DriveController}
     * @param {number} iDrive
     * @param {string} sDiskName
     * @param {string} sDiskPath
     * @param {boolean} [fAutoMount]
     * @param {File} [file] is set if there's an associated File object
     * @return {number} 1 if disk loaded, 0 if queued up (or busy), -1 if already loaded
     */
    loadDrive(iDrive, sDiskName, sDiskPath, fAutoMount, file)
    {
        var nResult = -1;
        var drive = this.aDrives[iDrive];

        if (drive.sDiskPath.toLowerCase() != sDiskPath.toLowerCase()) {

            nResult++;
            this.unloadDrive(iDrive, true);

            if (drive.fBusy) {
                this.notice(this.type + " busy");
            }
            else {
                // this.status("disk queued: " + sDiskName);
                drive.fBusy = true;
                if (fAutoMount) {
                    drive.fAutoMount = true;
                    this.cAutoMount++;
                    if (this.messageEnabled()) this.printMessage("auto-loading disk: " + sDiskName);
                }
                drive.fLocal = !!file;
                var disk = new DiskPDP11(this, drive, DiskAPI.MODE.PRELOAD);
                if (disk.load(sDiskName, sDiskPath, file, this.finishLoadDrive)) {
                    nResult++;
                }
            }
        }
        return nResult;
    }

    /**
     * finishLoadDrive(drive, disk, sDiskName, sDiskPath, fAutoMount)
     *
     * The disk parameter is set if the disk was successfully loaded, null if not.
     *
     * @this {DriveController}
     * @param {Object} drive
     * @param {DiskPDP11} disk
     * @param {string} sDiskName
     * @param {string} sDiskPath
     * @param {boolean} [fAutoMount]
     */
    finishLoadDrive(drive, disk, sDiskName, sDiskPath, fAutoMount)
    {
        drive.fBusy = false;

        if (disk) {
            /*
             * TODO: While this is a perfectly reasonable thing to do, one wonders if the Disk object shouldn't
             * have done this itself, since we passed our Drive object to it (it already knows the drive's limits).
             */
            if (disk.nCylinders > drive.nCylinders || disk.nHeads > drive.nHeads /* || disk.nSectors > drive.nSectors */) {
                this.notice("Disk \"" + sDiskName + "\" too large for drive " + this.getDriveName(drive.iDrive));
                disk = null;
            }
        }

        if (disk) {
            drive.disk = disk;
            drive.sDiskName = sDiskName;
            drive.sDiskPath = sDiskPath;

            /*
             * Adding local disk image names to the disk list seems like a nice idea, but it's too confusing,
             * because then it looks like the "Mount" button should be able to (re)load them, and that can NEVER
             * happen, for security reasons; local disk images can ONLY be loaded via the "Mount" button after
             * the user has selected them via the "Choose File" button.
             *
             *      this.addDisk(sDiskName, sDiskPath);
             *
             * So we're going to take a different approach: when displayDisk() is asked to display the name
             * of a local disk image, it will map all such disks to "Local Disk", and any attempt to "Mount" such
             * a disk, will essentially result in a "Disk not found" error.
             */
            this.addDiskHistory(sDiskName, sDiskPath, disk);

            /*
             * With the addition of notify(), users are now "alerted" whenever a disk has finished loading;
             * notify() is selective about its output, using print() if a print window is open, alert() otherwise.
             */
            this.notice("Loaded disk \"" + sDiskName + "\" in drive " + this.getDriveName(drive.iDrive), drive.fAutoMount || fAutoMount);

            /*
             * Since you usually want the Computer to have focus again after loading a new disk, let's try automatically
             * updating the focus after a successful load.
             */
            if (this.cmp) this.cmp.setFocus();
        }
        else {
            drive.fLocal = false;
        }

        if (drive.fAutoMount) {
            drive.fAutoMount = false;
            if (!--this.cAutoMount) this.setReady();
        }

        this.displayDisk(drive.iDrive);
    }

    /**
     * addDisk(sName, sPath, fTop)
     *
     * @this {DriveController}
     * @param {string} sName
     * @param {string} sPath
     * @param {boolean} [fTop] (default is bottom)
     */
    addDisk(sName, sPath, fTop)
    {
        var controlDisks = this.bindings["listDisks"];
        if (controlDisks && controlDisks.options) {
            for (var i = 0; i < controlDisks.options.length; i++) {
                if (controlDisks.options[i].value == sPath) return;
            }
            var controlOption = document.createElement("option");
            controlOption.text = sName;
            controlOption.value = sPath;
            if (fTop && controlDisks.childNodes[0]) {
                controlDisks.insertBefore(controlOption, controlDisks.childNodes[0]);
            } else {
                controlDisks.appendChild(controlOption);
            }
        }
    }

    /**
     * findDisk(sPath)
     *
     * This is used to deal with mount requests (eg, autoMount) that supply a path without a name;
     * if we can find the path in the "listDisks" control, then we return the associated disk name.
     *
     * @this {DriveController}
     * @param {string} sPath
     * @return {string|null}
     */
    findDisk(sPath)
    {
        var controlDisks = this.bindings["listDisks"];
        if (controlDisks && controlDisks.options) {
            for (var i = 0; i < controlDisks.options.length; i++) {
                var control = controlDisks.options[i];
                if (control.value == sPath) return control.text;
            }
        }
        return Str.getBaseName(sPath, true);
    }

    /**
     * displayDisk(iDrive, fUpdateDrive)
     *
     * @this {DriveController}
     * @param {number} iDrive (unvalidated)
     * @param {boolean} [fUpdateDrive] is true to update the drive list to match the specified drive (eg, the auto-mount case)
     */
    displayDisk(iDrive, fUpdateDrive)
    {
        /*
         * First things first: validate iDrive.
         */
        if (iDrive >= 0 && iDrive < this.aDrives.length) {
            var drive = this.aDrives[iDrive];
            var controlDisks = this.bindings["listDisks"];
            var controlDrives = this.bindings["listDrives"];
            /*
             * Next, make sure controls for both drives and disks exist.
             */
            if (controlDisks && controlDrives && controlDisks.options && controlDrives.options) {
                /*
                 * Next, make sure the drive whose disk we're updating is the currently selected drive.
                 */
                var i;
                var iDriveSelected = Str.parseInt(controlDrives.value, 10);
                var sTargetPath = (drive.fLocal? DriveController.SOURCE.LOCAL : drive.sDiskPath);
                if (!isNaN(iDriveSelected) && iDriveSelected == iDrive) {
                    for (i = 0; i < controlDisks.options.length; i++) {
                        if (controlDisks.options[i].value == sTargetPath) {
                            if (controlDisks.selectedIndex != i) {
                                controlDisks.selectedIndex = i;
                            }
                            break;
                        }
                    }
                    if (i == controlDisks.options.length) controlDisks.selectedIndex = 0;
                }
                if (fUpdateDrive) {
                    for (i = 0; i < controlDrives.options.length; i++) {
                        if (Str.parseInt(controlDrives.options[i].value, 10) == drive.iDrive) {
                            if (controlDrives.selectedIndex != i) {
                                controlDrives.selectedIndex = i;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * unloadDrive(iDrive, fLoading)
     *
     * @this {DriveController}
     * @param {number} iDrive
     * @param {boolean} [fLoading]
     */
    unloadDrive(iDrive, fLoading)
    {
        var drive = this.aDrives[iDrive];

        if (drive.disk || fLoading === false) {

            /*
             * Before we toss the disk's information, capture any deltas that may have occurred.
             */
            this.updateDiskHistory(drive.sDiskName, drive.sDiskPath, drive.disk);

            drive.sDiskName = "";
            drive.sDiskPath = "";
            drive.disk = null;
            drive.fLocal = false;

            // this.regInput |= FDC.REG_INPUT.DISK_CHANGE;

            if (!fLoading) {
                this.notice("Drive " + this.getDriveName(iDrive) + " unloaded", fLoading);
                this.sDiskSource = DriveController.SOURCE.NONE;
                this.displayDisk(iDrive);
            }
        }
    }

    /**
     * unloadAllDrives(fDiscard)
     *
     * @this {DriveController}
     * @param {boolean} fDiscard to discard all disk history before unloading
     */
    unloadAllDrives(fDiscard)
    {
        if (fDiscard) this.aDiskHistory = [];

        for (var iDrive = 0; iDrive < this.aDrives.length; iDrive++) {
            this.unloadDrive(iDrive, true);
        }
    }

    /**
     * addDiskHistory(sDiskName, sDiskPath, disk)
     *
     * @this {DriveController}
     * @param {string} sDiskName
     * @param {string} sDiskPath
     * @param {DiskPDP11} disk containing corresponding disk image
     */
    addDiskHistory(sDiskName, sDiskPath, disk)
    {
        var i;
        this.assert(!!sDiskPath);
        for (i = 0; i < this.aDiskHistory.length; i++) {
            if (this.aDiskHistory[i][1] == sDiskPath) {
                var nChanges = disk.restore(this.aDiskHistory[i][2]);
                if (DEBUG && this.messageEnabled()) {
                    this.printMessage("disk '" + sDiskName + "' restored from history (" + nChanges + " changes)");
                }
                return;
            }
        }
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("disk '" + sDiskName + "' added to history (nothing to restore)");
        }
        this.aDiskHistory[i] = [sDiskName, sDiskPath, []];
    }

    /**
     * removeDiskHistory(sDiskName, sDiskPath)
     *
     * @this {DriveController}
     * @param {string} sDiskName
     * @param {string} sDiskPath
     */
    removeDiskHistory(sDiskName, sDiskPath)
    {
        var i;
        for (i = 0; i < this.aDiskHistory.length; i++) {
            if (this.aDiskHistory[i][1] == sDiskPath) {
                this.aDiskHistory.splice(i, 1);
                if (DEBUG && this.messageEnabled()) {
                    this.printMessage("disk '" + sDiskName + "' removed from history");
                }
                return;
            }
        }
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("unable to remove disk '" + sDiskName + "' from history (" + sDiskPath + ")");
        }
    }

    /**
     * updateDiskHistory(sDiskName, sDiskPath, disk)
     *
     * @this {DriveController}
     * @param {string} sDiskName
     * @param {string} sDiskPath
     * @param {DiskPDP11} disk containing corresponding disk image, with possible deltas
     */
    updateDiskHistory(sDiskName, sDiskPath, disk)
    {
        var i;
        for (i = 0; i < this.aDiskHistory.length; i++) {
            if (this.aDiskHistory[i][1] == sDiskPath) {
                this.aDiskHistory[i][2] = disk.save();
                if (DEBUG && this.messageEnabled()) {
                    this.printMessage("disk '" + sDiskName + "' updated in history");
                }
                return;
            }
        }
        /*
         * I used to report this as an error (at least in the DEBUG release), but it's no longer really
         * an error, because if we're trying to re-mount a clean copy of a disk, we toss its history, then
         * unload, and then reload/remount.  And since unloadDrive's normal behavior is to call updateDiskHistory()
         * before unloading, the fact that the disk is no longer listed here can't be treated as an error.
         */
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("unable to update disk '" + sDiskName + "' in history (" + sDiskPath + ")");
        }
    }

    /**
     * readData(drive, iCylinder, iHead, iSector, nWords, addr, inc, fCheck, done)
     *
     * Placeholder for subclasses.
     *
     * @this {DriveController}
     * @param {Object} drive
     * @param {number} iCylinder
     * @param {number} iHead
     * @param {number} iSector
     * @param {number} nWords
     * @param {number} addr
     * @param {number} inc (normally 2, unless inhibited, in which case it's 0)
     * @param {boolean} [fCheck]
     * @param {function(...)} [done]
     * @return {boolean|number} true if complete, false if queued (or if no done() is supplied, the error code, if any)
     */
    readData(drive, iCylinder, iHead, iSector, nWords, addr, inc, fCheck, done)
    {
        return false;
    }

    /**
     * writeData(drive, iCylinder, iHead, iSector, nWords, addr, inc, fCheck, done)
     *
     * Placeholder for subclasses.
     *
     * @this {DriveController}
     * @param {Object} drive
     * @param {number} iCylinder
     * @param {number} iHead
     * @param {number} iSector
     * @param {number} nWords
     * @param {number} addr
     * @param {number} inc (normally 2, unless inhibited, in which case it's 0)
     * @param {boolean} [fCheck]
     * @param {function(...)} [done]
     * @return {boolean|number} true if complete, false if queued (or if no done() is supplied, the error code, if any)
     */
    writeData(drive, iCylinder, iHead, iSector, nWords, addr, inc, fCheck, done)
    {
        return false;
    }
}

/*
 * There's nothing super special about these values, except that NONE should be falsey and the others should not.
 */
DriveController.SOURCE = {
    NONE:   "",
    LOCAL:  "?",
    REMOTE: "??"
};
