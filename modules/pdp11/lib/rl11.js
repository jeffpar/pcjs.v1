/**
 * @fileoverview Implements the RL11 Disk Controller (for RL01 and RL02 Disks)
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2016
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
    var str           = require("../../shared/lib/strlib");
    var web           = require("../../shared/lib/weblib");
    var DiskAPI       = require("../../shared/lib/diskapi");
    var Component     = require("../../shared/lib/component");
    var State         = require("../../shared/lib/state");
    var PDP11         = require("./defines");
    var MessagesPDP11 = require("./messages");
    var DiskPDP11     = require("./disk");
}

/**
 * RL11(parms)
 *
 * The RL11 component has the following component-specific (parms) properties:
 *
 *      autoMount: one or more JSON-encoded objects, each containing 'name' and 'path' properties
 *
 * @constructor
 * @extends Component
 * @param {Object} parms
 */
function RL11(parms)
{
    Component.call(this, "RL11", parms, RL11, MessagesPDP11.DISK);

    /*
     * We record any 'autoMount' object now, but we no longer parse it until initBus(), because the
     * Computer's getMachineParm() service may have an override for us.
     */
    this.configMount = parms['autoMount'] || null;
    this.cAutoMount = 0;

    /*
     * TODO: Make this configurable
     */
    this.nDrives = 1;
    this.aDrives = new Array(this.nDrives);

    this.fLocalDisks = (!web.isMobile() && window && 'FileReader' in window);
}

Component.subclass(RL11);

/*
 * There's nothing super special about these values, except that NONE should be falsey and the others should not.
 */
RL11.SOURCE = {
    NONE:   "",
    LOCAL:  "?",
    REMOTE: "??"
};

/**
 * setBinding(sType, sBinding, control, sValue)
 *
 * @this {RL11}
 * @param {string|null} sType is the type of the HTML control (eg, "button", "list", "text", etc)
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "listDisks")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
RL11.prototype.setBinding = function(sType, sBinding, control, sValue)
{
    var rl11 = this;

    switch (sBinding) {

    case "listDisks":
        this.bindings[sBinding] = control;

        control.onchange = function onChangeListDisks(event) {
            var controlDesc = rl11.bindings["descDisk"];
            var controlOption = control.options[control.selectedIndex];
            if (controlDesc && controlOption) {
                var dataValue = {};
                var sValue = controlOption.getAttribute("data-value");
                if (sValue) {
                    try {
                        dataValue = eval("(" + sValue + ")");
                    } catch (e) {
                        Component.error("RL11 option error: " + e.message);
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
            var iDrive = str.parseInt(control.value, 10);
            if (iDrive != null) rl11.displayDisk(iDrive);
        };
        return true;

    case "loadDrive":
        this.bindings[sBinding] = control;

        control.onclick = function onClickLoadDrive(event) {
            var controlDisks = rl11.bindings["listDisks"];
            if (controlDisks) {
                var sDiskName = controlDisks.options[controlDisks.selectedIndex].text;
                var sDiskPath = controlDisks.value;
                rl11.loadSelectedDrive(sDiskName, sDiskPath);
            }
        };
        return true;

    case "saveDrive":
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
            var controlDrives = rl11.bindings["listDrives"];
            if (controlDrives && controlDrives.options && rl11.aDrives) {
                var iDriveSelected = str.parseInt(controlDrives.value, 10) || 0;
                var drive = rl11.aDrives[iDriveSelected];
                if (drive) {
                    /*
                     * Note the similarity (and hence factoring opportunity) between this code and the HDC's "saveHD*" binding.
                     */
                    var disk = drive.disk;
                    if (disk) {
                        if (DEBUG) rl11.println("saving disk " + disk.sDiskPath + "...");
                        var sAlert = web.downloadFile(disk.encodeAsBase64(), "octet-stream", true, disk.sDiskFile.replace(".json", ".img"));
                        web.alertUser(sAlert);
                    } else {
                        rl11.notice("No disk loaded in drive.");
                    }
                } else {
                    rl11.notice("No disk drive selected.");
                }
            }
        };
        return true;

    case "mountDrive":
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
                var sDiskName = str.getBaseName(sDiskPath, true);
                rl11.loadSelectedDrive(sDiskName, sDiskPath, file);
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
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {RL11}
 * @param {ComputerPDP11} cmp
 * @param {BusPDP11} bus
 * @param {CPUStatePDP11} cpu
 * @param {DebuggerPDP11} dbg
 */
RL11.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;

    this.configMount = this.cmp.getMachineParm('autoMount') || this.configMount;

    if (this.configMount) {
        if (typeof this.configMount == "string") {
            try {
                /*
                 * The most likely source of any exception will be right here, where we're parsing
                 * this JSON-encoded data.
                 */
                this.configMount = eval("(" + this.configMount + ")");
            } catch (e) {
                Component.error("RL11 auto-mount error: " + e.message + " (" + this.configMount + ")");
                this.configMount = null;
            }
        }
    }

    this.triggerReaderInterrupt = this.cpu.addTrigger(PDP11.RL11.VEC, PDP11.RL11.PRI);

    bus.addIOTable(this, RL11.UNIBUS_IOTABLE);

    this.addDisk("None", RL11.SOURCE.NONE, true);
    if (this.fLocalDisks) this.addDisk("Local Disk", RL11.SOURCE.LOCAL);
    this.addDisk("Remote Disk", RL11.SOURCE.REMOTE);

    if (!this.autoMount()) this.setReady();
};

/**
 * getDriveName(iDrive)
 *
 * @this {RL11}
 * @param {number} iDrive
 * @return {string}
 */
RL11.prototype.getDriveName = function(iDrive)
{
    return "RL" + iDrive;
};

/**
 * powerUp(data, fRepower)
 *
 * @this {RL11}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
RL11.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data || !this.restore) {
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
                /*
                 * TODO: This conversion of drive number to drive letter, starting with A:, is very simplistic
                 * and will NOT match the drive mappings that DOS ultimately uses.  We'll need to spiff this up at
                 * some point.
                 */
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
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {RL11}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
RL11.prototype.powerDown = function(fSave, fShutdown)
{
    return fSave? this.save() : true;
};

/**
 * reset()
 *
 * @this {RL11}
 */
RL11.prototype.reset = function()
{
    this.initController();
};

/**
 * save()
 *
 * This implements save support for the RL11 component.
 *
 * @this {RL11}
 * @return {Object}
 */
RL11.prototype.save = function()
{
    var state = new State(this);
    // state.set(0, this.saveController());
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the RL11 component.
 *
 * @this {RL11}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
RL11.prototype.restore = function(data)
{
    return true;    // this.initController(data[0]);
};

/**
 * initController(data)
 *
 * @this {RL11}
 * @param {Array} [data]
 * @return {boolean} true if successful, false if failure
 */
RL11.prototype.initController = function(data)
{
    var fSuccess = true;
    for (var iDrive = 0; iDrive < this.aDrives.length; iDrive++) {
        var drive = this.aDrives[iDrive];
        if (drive === undefined) {
            drive = this.aDrives[iDrive] = {};
        }
        if (!this.initDrive(drive, iDrive)) {
            fSuccess = false;
        }
    }
    return true;
};

/**
 * saveController()
 *
 * @this {RL11}
 * @return {Array}
 */
RL11.prototype.saveController = function()
{
    var data = [];
    return data;
};

/**
 * initDrive(drive, iDrive, data)
 *
 * TODO: Consider a separate Drive class that any drive controller can use, since there's a lot of commonality
 * between the drive objects created by disk controllers.  This will clean up overall drive management and allow
 * us to factor out some common Drive methods.
 *
 * @this {RL11}
 * @param {Object} drive
 * @param {number} iDrive
 * @param {Array|undefined} [data]
 * @return {boolean} true if successful, false if failure
 */
RL11.prototype.initDrive = function(drive, iDrive, data)
{
    var i = 0;
    var fSuccess = true;

    drive.iDrive = iDrive;
    drive.fBusy = drive.fLocal = false;

    drive.name = this.idComponent;
    drive.nCylinders = 512;
    drive.nHeads = 2;
    drive.nSectors = 40;
    drive.cbSector = 256;
    drive.fRemovable = true;

    /*
     * The next group of properties are set by various controller command sequences.
     */
    drive.bHead = 0;
    drive.bCylinderSeek = 0;
    drive.bCylinder = 0;
    drive.bSector = 1;
    drive.bSectorEnd = drive.nSectors;      // aka EOT
    drive.nBytes = drive.cbSector;

    /*
     * The next group of properties are managed by worker functions (eg, doRead()) to maintain state across DMA requests.
     */
    drive.ibSector = 0;
    drive.sector = null;

    if (!drive.disk) {
        drive.sDiskPath = "";               // ensure this is initialized to a default that displayDisk() can deal with
    }

    return fSuccess;
};

/**
 * autoMount(fRemount)
 *
 * @this {RL11}
 * @param {boolean} [fRemount] is true if we're remounting all auto-mounted disks
 * @return {boolean} true if one or more disk images are being auto-mounted, false if none
 */
RL11.prototype.autoMount = function(fRemount)
{
    if (!fRemount) this.cAutoMount = 0;
    if (this.configMount) {
        for (var sDrive in this.configMount) {
            var configDrive = this.configMount[sDrive];
            var sDiskPath = configDrive['path'] || "";
            var sDiskName = configDrive['name'] || this.findDisk(sDiskPath);
            if (sDiskPath && sDiskName) {
                /*
                 * WARNING: This conversion of drive letter to drive number, starting with A:, is very simplistic
                 * and is not guaranteed to match the drive mapping that DOS ultimately uses.
                 */
                var iDrive = sDrive.charCodeAt(0) - 0x41;
                if (iDrive >= 0 && iDrive < this.aDrives.length) {
                    if (!this.loadDrive(iDrive, sDiskName, sDiskPath, true) && fRemount) {
                        this.setReady(false);
                    }
                    continue;
                }
            }
            this.notice("Incorrect auto-mount settings for drive " + sDrive + " (" + JSON.stringify(configDrive) + ")");
        }
    }
    return !!this.cAutoMount;
};

/**
 * loadSelectedDrive(sDiskName, sDiskPath, file)
 *
 * @this {RL11}
 * @param {string} sDiskName
 * @param {string} sDiskPath
 * @param {File} [file] is set if there's an associated File object
 */
RL11.prototype.loadSelectedDrive = function(sDiskName, sDiskPath, file)
{
    var controlDrives = this.bindings["listDrives"];
    var iDrive = controlDrives && str.parseInt(controlDrives.value, 10);

    if (iDrive === undefined || iDrive < 0 || iDrive >= this.aDrives.length) {
        this.notice("Unable to load the selected drive");
        return;
    }

    if (!sDiskPath) {
        this.unloadDrive(iDrive);
        return;
    }

    if (sDiskPath == RL11.SOURCE.LOCAL) {
        this.notice('Use "Choose File" and "Mount" to select and load a local disk.');
        return;
    }

    /*
     * If the special RL11.SOURCE.REMOTE path is selected, then we want to prompt the user for a URL.
     * Oh, and make sure we pass an empty string as the 2nd parameter to prompt(), so that IE won't display
     * "undefined" -- because after all, undefined and "undefined" are EXACTLY the same thing, right?
     *
     * TODO: This is literally all I've done to support remote disk images. There's probably more
     * I should do, like dynamically updating "listDisks" to include new entries, and adding new entries
     * to the save/restore data.
     */
    if (sDiskPath == RL11.SOURCE.REMOTE) {
        sDiskPath = window.prompt("Enter the URL of a remote disk image.", "") || "";
        if (!sDiskPath) return;
        sDiskName = str.getBaseName(sDiskPath);
        this.status("Attempting to load " + sDiskPath + " as \"" + sDiskName + "\"");
        this.sDiskSource = RL11.SOURCE.REMOTE;
    }
    else {
        this.sDiskSource = sDiskPath;
    }

    this.loadDrive(iDrive, sDiskName, sDiskPath, false, file);
};

/**
 * loadDrive(iDrive, sDiskName, sDiskPath, fAutoMount, file)
 *
 * NOTE: If sDiskPath is already loaded, nothing needs to be done.
 *
 * @this {RL11}
 * @param {number} iDrive
 * @param {string} sDiskName
 * @param {string} sDiskPath
 * @param {boolean} [fAutoMount]
 * @param {File} [file] is set if there's an associated File object
 * @return {number} 1 if disk loaded, 0 if queued up (or busy), -1 if already loaded
 */
RL11.prototype.loadDrive = function(iDrive, sDiskName, sDiskPath, fAutoMount, file)
{
    var nResult = -1;
    var drive = this.aDrives[iDrive];

    if (drive.sDiskPath.toLowerCase() != sDiskPath.toLowerCase()) {

        nResult++;
        this.unloadDrive(iDrive, true);

        if (drive.fBusy) {
            this.notice("RL11 busy");
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
            if (disk.load(sDiskName, sDiskPath, file, this.doneLoadDrive)) {
                nResult++;
            }
        }
    }
    return nResult;
};

/**
 * doneLoadDrive(drive, disk, sDiskName, sDiskPath, fAutoMount)
 *
 * The disk parameter is set if the disk was successfully loaded, null if not.
 *
 * @this {RL11}
 * @param {Object} drive
 * @param {DiskPDP11} disk
 * @param {string} sDiskName
 * @param {string} sDiskPath
 * @param {boolean} [fAutoMount]
 */
RL11.prototype.doneLoadDrive = function onLoadDrive(drive, disk, sDiskName, sDiskPath, fAutoMount)
{
    var aDiskInfo;

    drive.fBusy = false;

    if (disk) {
        /*
         * We shouldn't mount the disk unless we're sure the drive is able to handle it.
         */
        aDiskInfo = disk.info();
        if (disk && aDiskInfo[0] > drive.nCylinders || aDiskInfo[1] > drive.nHeads /* || aDiskInfo[2] > drive.nSectors */) {
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

        // this.addDiskHistory(sDiskName, sDiskPath, disk);

        /*
         * For a local disk (ie, one loaded via mountDrive()), the disk.restore() performed by addDiskHistory()
         * may have altered the disk geometry, so refresh the disk info.
         */
        aDiskInfo = disk.info();

        /*
         * Clearly, a successful mount implies a disk change, and I suppose that, technically, an *unsuccessful*
         * mount should imply the same, but what would the real-world analog be?  Inserting a piece of cardboard
         * instead of an actual disk?  In any case, if we can do the user a favor by pretending (as far as the
         * disk change line is concerned) that an unsuccessful mount never happened, let's do it.
         *
         * Successful unmounts are a different story, however; those *do* trigger a change. See unloadDrive().
         */

        // this.regInput |= FDC.REG_INPUT.DISK_CHANGE;

        /*
         * With the addition of notify(), users are now "alerted" whenever a disk has finished loading;
         * notify() is selective about its output, using print() if a print window is open, alert() otherwise.
         *
         * WARNING: This conversion of drive number to drive letter, starting with A:, is very simplistic
         * and will not match the drive mappings that DOS ultimately uses (ie, for drives beyond B:).
         */
        this.notice("Mounted disk \"" + sDiskName + "\" in drive " + this.getDriveName(drive.iDrive), drive.fAutoMount || fAutoMount);

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
};

/**
 * addDisk(sName, sPath, fTop)
 *
 * @this {RL11}
 * @param {string} sName
 * @param {string} sPath
 * @param {boolean} [fTop] (default is bottom)
 */
RL11.prototype.addDisk = function(sName, sPath, fTop)
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
};

/**
 * findDisk(sPath)
 *
 * This is used to deal with mount requests (eg, autoMount) that supply a path without a name;
 * if we can find the path in the "listDisks" control, then we return the associated disk name.
 *
 * @this {RL11}
 * @param {string} sPath
 * @return {string|null}
 */
RL11.prototype.findDisk = function(sPath)
{
    var controlDisks = this.bindings["listDisks"];
    if (controlDisks && controlDisks.options) {
        for (var i = 0; i < controlDisks.options.length; i++) {
            var control = controlDisks.options[i];
            if (control.value == sPath) return control.text;
        }
    }
    return str.getBaseName(sPath, true);
};

/**
 * displayDisk(iDrive, fUpdateDrive)
 *
 * @this {RL11}
 * @param {number} iDrive (unvalidated)
 * @param {boolean} [fUpdateDrive] is true to update the drive list to match the specified drive (eg, the auto-mount case)
 */
RL11.prototype.displayDisk = function(iDrive, fUpdateDrive)
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
            var iDriveSelected = str.parseInt(controlDrives.value, 10);
            var sTargetPath = (drive.fLocal? RL11.SOURCE.LOCAL : drive.sDiskPath);
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
                    if (str.parseInt(controlDrives.options[i].value, 10) == drive.iDrive) {
                        if (controlDrives.selectedIndex != i) {
                            controlDrives.selectedIndex = i;
                        }
                        break;
                    }
                }
            }
        }
    }
};

/**
 * unloadDrive(iDrive, fLoading)
 *
 * @this {RL11}
 * @param {number} iDrive
 * @param {boolean} [fLoading]
 */
RL11.prototype.unloadDrive = function(iDrive, fLoading)
{
    var drive = this.aDrives[iDrive];

    if (drive.disk || fLoading === false) {

        /*
         * Before we toss the disk's information, capture any deltas that may have occurred.
         */
        // this.updateDiskHistory(drive.sDiskName, drive.sDiskPath, drive.disk);

        drive.sDiskName = "";
        drive.sDiskPath = "";
        drive.disk = null;
        drive.fLocal = false;

        // this.regInput |= FDC.REG_INPUT.DISK_CHANGE;

        /*
         * WARNING: This conversion of drive number to drive letter, starting with A:, is very simplistic
         * and is not guaranteed to match the drive mapping that DOS ultimately uses.
         */
        if (!fLoading) {
            this.notice("Drive " + this.getDriveName(iDrive) + " unloaded", fLoading);
            this.sDiskSource = RL11.SOURCE.NONE;
            this.displayDisk(iDrive);
        }
    }
};

/**
 * unloadAllDrives(fDiscard)
 *
 * @this {RL11}
 * @param {boolean} fDiscard to discard all disk history before unloading
 */
RL11.prototype.unloadAllDrives = function(fDiscard)
{
    // if (fDiscard) this.aDiskHistory = [];

    for (var iDrive = 0; iDrive < this.aDrives.length; iDrive++) {
        this.unloadDrive(iDrive, true);
    }
};

/*
 * ES6 ALERT: As you can see below, I've finally started using computed property names.
 */
RL11.UNIBUS_IOTABLE = {
};

if (NODE) module.exports = RL11;
