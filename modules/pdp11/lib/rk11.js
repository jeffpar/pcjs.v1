/**
 * @fileoverview Implements the RK11 Disk Controller (for RK03 Disks)
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

class RK11 extends Component {
    /**
     * RK11(parms)
     *
     * The RK11 component has the following component-specific (parms) properties:
     *
     *      autoMount: one or more JSON-encoded objects, each containing 'name' and 'path' properties
     *
     * The RK11 Disk Controller controls up to eight RK05 disk drives, which in turn read/write RK03-KA
     * disk cartridges.  See [RK11 Disk Controller Configuration Files](/devices/pdp11/rk11/).
     *
     * RK03 (or more precisely, RK03-KA) disks are single-platter cartridges with 203 tracks per side,
     * 12 sectors per track, and a sector size of 256 words (512 bytes), for a total capacity of 2.38Mb
     * (2,494,464 bytes).  See [RK03-KA Disk Images](/disks/dec/rk03/).
     *
     * @param {Object} parms
     */
    constructor(parms)
    {
        super("RK11", parms, RK11, MessagesPDP11.RK11);

        /*
         * We preliminarily parse and record any 'autoMount' object now, but we no longer process it
         * until initBus(), because the Computer's getMachineParm() service may have an override for us.
         */
        this.configMount = this.parseConfig(parms['autoMount']);
        this.cAutoMount = 0;

        /*
         * The RK11 has three Drive Select bits, representing up to eight drives.
         */
        this.nDrives = 8;
        this.aDrives = new Array(this.nDrives);
        this.fLocalDisks = (!Web.isMobile() && window && 'FileReader' in window);
        this.sDiskSource = RK11.SOURCE.NONE;

        this.irq = null;

        /*
         * Define all the properties to be initialized by initController()
         */
        this.regRKDS = this.regRKER = this.regRKCS = this.regRKWC = this.regRKBA = this.regRKDA = this.regRKDB = 0;
    }

    /**
     * parseConfig(config)
     *
     * @this {RK11}
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
     * @this {RK11}
     * @param {string|null} sType is the type of the HTML control (eg, "button", "list", "text", etc)
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "listDisks")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sType, sBinding, control, sValue)
    {
        var rk11 = this;

        switch (sBinding) {

        case "listDisks":
            this.bindings[sBinding] = control;

            control.onchange = function onChangeListDisks(event) {
                var controlDesc = rk11.bindings["descDisk"];
                var controlOption = control.options && control.options[control.selectedIndex];
                if (controlDesc && controlOption) {
                    var dataValue = {};
                    var sValue = controlOption.getAttribute("data-value");
                    if (sValue) {
                        try {
                            dataValue = eval("(" + sValue + ")");
                        } catch (e) {
                            Component.error("RK11 option error: " + e.message);
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
                if (iDrive != null) rk11.displayDisk(iDrive);
            };
            return true;

        case "loadDisk":
            this.bindings[sBinding] = control;

            control.onclick = function onClickLoadDrive(event) {
                var controlDisks = rk11.bindings["listDisks"];
                if (controlDisks && controlDisks.options) {
                    var sDiskName = controlDisks.options[controlDisks.selectedIndex].text;
                    var sDiskPath = controlDisks.value;
                    rk11.loadSelectedDrive(sDiskName, sDiskPath);
                }
            };
            return true;

        case "bootDisk":
            this.bindings[sBinding] = control;

            control.onclick = function onClickBootDisk(event) {
                rk11.bootSelectedDisk();
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
                var controlDrives = rk11.bindings["listDrives"];
                if (controlDrives && controlDrives.options && rk11.aDrives) {
                    var iDriveSelected = Str.parseInt(controlDrives.value, 10) || 0;
                    var drive = rk11.aDrives[iDriveSelected];
                    if (drive) {
                        /*
                         * Note the similarity (and hence factoring opportunity) between this code and the HDC's "saveHD*" binding.
                         */
                        var disk = drive.disk;
                        if (disk) {
                            if (DEBUG) rk11.println("saving disk " + disk.sDiskPath + "...");
                            var sAlert = Web.downloadFile(disk.encodeAsBase64(), "octet-stream", true, disk.sDiskFile.replace(".json", ".img"));
                            Web.alertUser(sAlert);
                        } else {
                            rk11.notice("No disk loaded in drive.");
                        }
                    } else {
                        rk11.notice("No disk drive selected.");
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
                    rk11.loadSelectedDrive(sDiskName, sDiskPath, file);
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
     * @this {RK11}
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

        this.irq = this.cpu.addIRQ(RK11.VEC, RK11.PRI, MessagesPDP11.RK11);

        bus.addIOTable(this, RK11.UNIBUS_IOTABLE);
        bus.addResetHandler(this.reset.bind(this));

        this.addDisk("None", RK11.SOURCE.NONE, true);
        if (this.fLocalDisks) this.addDisk("Local Disk", RK11.SOURCE.LOCAL);
        this.addDisk("Remote Disk", RK11.SOURCE.REMOTE);

        if (!this.autoMount()) this.setReady();
    }

    /**
     * getDriveName(iDrive)
     *
     * @this {RK11}
     * @param {number} iDrive
     * @return {string}
     */
    getDriveName(iDrive)
    {
        return "RK" + iDrive;
    }

    /**
     * getDriveNumber(sDrive)
     *
     * @this {RK11}
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
     * @this {RK11}
     * @param {Object|null} data
     * @param {boolean} [fRepower]
     * @return {boolean} true if successful, false if failure
     */
    powerUp(data, fRepower)
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
     * @this {RK11}
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
     * @this {RK11}
     */
    reset()
    {
        this.initController();
    }

    /**
     * save()
     *
     * This implements save support for the RK11 component.
     *
     * @this {RK11}
     * @return {Object}
     */
    save()
    {
        var state = new State(this);
        // state.set(0, this.saveController());
        return state.data();
    }

    /**
     * restore(data)
     *
     * This implements restore support for the RK11 component.
     *
     * @this {RK11}
     * @param {Object} data
     * @return {boolean} true if successful, false if failure
     */
    restore(data)
    {
        return this.initController(data[0]);
    }

    /**
     * saveController()
     *
     * @this {RK11}
     * @return {Array}
     */
    saveController()
    {
        return [];
    }

    /**
     * autoMount(fRemount)
     *
     * @this {RK11}
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
     * @this {RK11}
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

        if (sDiskPath == RK11.SOURCE.LOCAL) {
            this.notice('Use "Choose File" and "Mount" to select and load a local disk.');
            return;
        }

        /*
         * If the special RK11.SOURCE.REMOTE path is selected, then we want to prompt the user for a URL.
         * Oh, and make sure we pass an empty string as the 2nd parameter to prompt(), so that IE won't display
         * "undefined" -- because after all, undefined and "undefined" are EXACTLY the same thing, right?
         *
         * TODO: This is literally all I've done to support remote disk images. There's probably more
         * I should do, like dynamically updating "listDisks" to include new entries, and adding new entries
         * to the save/restore data.
         */
        if (sDiskPath == RK11.SOURCE.REMOTE) {
            sDiskPath = window.prompt("Enter the URL of a remote disk image.", "") || "";
            if (!sDiskPath) return;
            sDiskName = Str.getBaseName(sDiskPath);
            this.status("Attempting to load " + sDiskPath + " as \"" + sDiskName + "\"");
            this.sDiskSource = RK11.SOURCE.REMOTE;
        }
        else {
            this.sDiskSource = sDiskPath;
        }

        this.loadDrive(iDrive, sDiskName, sDiskPath, false, file);
    }

    /**
     * bootSelectedDisk()
     *
     * @this {RK11}
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
     * @this {RK11}
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
                this.notice("RK11 busy");
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
     * @this {RK11}
     * @param {Object} drive
     * @param {DiskPDP11} disk
     * @param {string} sDiskName
     * @param {string} sDiskPath
     * @param {boolean} [fAutoMount]
     */
    finishLoadDrive(drive, disk, sDiskName, sDiskPath, fAutoMount)
    {
        var aDiskInfo;

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
            // this.addDiskHistory(sDiskName, sDiskPath, disk);

            /*
             * For a local disk (ie, one loaded via mountDrive()), the disk.restore() performed by addDiskHistory()
             * may have altered the disk geometry, so refresh the disk info.
             */
            // aDiskInfo = disk.info();

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
     * @this {RK11}
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
     * @this {RK11}
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
     * @this {RK11}
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
                var sTargetPath = (drive.fLocal? RK11.SOURCE.LOCAL : drive.sDiskPath);
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
     * @this {RK11}
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
            // this.updateDiskHistory(drive.sDiskName, drive.sDiskPath, drive.disk);

            drive.sDiskName = "";
            drive.sDiskPath = "";
            drive.disk = null;
            drive.fLocal = false;

            // this.regInput |= FDC.REG_INPUT.DISK_CHANGE;

            if (!fLoading) {
                this.notice("Drive " + this.getDriveName(iDrive) + " unloaded", fLoading);
                this.sDiskSource = RK11.SOURCE.NONE;
                this.displayDisk(iDrive);
            }
        }
    }

    /**
     * unloadAllDrives(fDiscard)
     *
     * @this {RK11}
     * @param {boolean} fDiscard to discard all disk history before unloading
     */
    unloadAllDrives(fDiscard)
    {
        // if (fDiscard) this.aDiskHistory = [];

        for (var iDrive = 0; iDrive < this.aDrives.length; iDrive++) {
            this.unloadDrive(iDrive, true);
        }
    }

    /**
     * initController(data)
     *
     * @this {RK11}
     * @param {Array} [data]
     * @return {boolean} true if successful, false if failure
     */
    initController(data)
    {
        var i = 0;
        if (!data) data = [];
        this.regRKDS = data[i++] || (RK11.RKDS.RK05 | RK11.RKDS.SOK | RK11.RKDS.RRDY);
        this.regRKER = data[i++] || 0;
        this.regRKCS = data[i++] || (RK11.RKCS.CRDY);
        this.regRKWC = data[i++] || 0;
        this.regRKBA = data[i++] || 0;
        this.regRKDA = data[i++] || 0;
        this.regRKDB = data[i] || 0;    // TODO: Determine if there's anything we should be doing to the RKDB register

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
        return fSuccess;
    }

    /**
     * initDrive(drive, iDrive, data)
     *
     * TODO: Consider a separate Drive class that any drive controller can use, since there's a lot of commonality
     * between the drive objects created by disk controllers.  This will clean up overall drive management and allow
     * us to factor out some common Drive methods.
     *
     * @this {RK11}
     * @param {Object} drive
     * @param {number} iDrive
     * @param {Array|undefined} [data]
     * @return {boolean} true if successful, false if failure
     */
    initDrive(drive, iDrive, data)
    {
        var i = 0;
        var fSuccess = true;

        drive.iDrive = iDrive;
        drive.name = this.idComponent;
        drive.fBusy = drive.fLocal = false;

        /*
         * NOTE: We initialize the following drive properties to their MAXIMUMs; disks may have
         * these or SMALLER values (subject to the limits of what the controller supports, of course).
         */
        drive.nCylinders = 203;
        drive.nHeads = 2;
        drive.nSectors = 12;
        drive.cbSector = 512;
        drive.fRemovable = true;

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

        drive.status = RK11.RKDS.RK05 | RK11.RKDS.SOK | RK11.RKDS.RRDY;

        return fSuccess;
    }

    /**
     * processCommand()
     *
     * @this {RK11}
     */
    processCommand()
    {
        var fInterrupt = true;
        var fnReadWrite, func, sFunc = "";
        var iDrive = (this.regRKDA & RK11.RKDA.DS) >> RK11.RKDA.SHIFT.DS;
        var drive = this.aDrives[iDrive];
        var iCylinder, iHead, iSector, nWords, addr, inc;

        this.regRKCS &= ~(RK11.RKCS.CRDY | RK11.RKCS.SCP);
        this.regRKER &= ~(RK11.RKER.SE);

        switch(func = this.regRKCS & RK11.RKCS.FUNC) {

        case RK11.FUNC.CRESET:
            if (this.messageEnabled()) this.printMessage(this.type + ": CRESET(" + iDrive + ")", true);
            this.regRKER = this.regRKDA = 0;
            this.regRKCS = RK11.RKCS.CRDY;
            break;

        case RK11.FUNC.RCHK:
            sFunc = "RCHK";
            /* falls through */

        case RK11.FUNC.READ:
            if (!sFunc) sFunc = "READ";
            fnReadWrite = this.readData;
            /* falls through */

        case RK11.FUNC.WCHK:
            if (!sFunc) sFunc = "WCHK";
            /* falls through */

        case RK11.FUNC.WRITE:
            if (!sFunc) sFunc = "WRITE";
            if (!fnReadWrite) fnReadWrite = this.writeData;

            iCylinder = (this.regRKDA & RK11.RKDA.CA) >> RK11.RKDA.SHIFT.CA;
            iHead = (this.regRKDA & RK11.RKDA.HS) >> RK11.RKDA.SHIFT.HS;
            iSector = this.regRKDA & RK11.RKDA.SA;
            nWords = (0x10000 - this.regRKWC) & 0xffff;
            addr = (((this.regRKCS & RK11.RKCS.MEX)) << (16 - RK11.RKCS.SHIFT.MEX)) | this.regRKBA;
            inc = (this.regRKCS & RK11.RKCS.IBA)? 0 : 2;

            if (this.messageEnabled()) this.printMessage(this.type + ": " + sFunc + "(" + iCylinder + ":" + iHead + ":" + iSector + ") " + Str.toOct(addr) + "--" + Str.toOct(addr + (nWords << 1)), true, true);

            if (iCylinder >= drive.nCylinders) {
                this.regRKER |= RK11.RKER.NXC;
                break;
            }
            if (iSector >= drive.nSectors) {
                this.regRKER |= RK11.RKER.NXS;
                break;
            }

            fInterrupt = fnReadWrite.call(this, drive, iCylinder, iHead, iSector, nWords, addr, inc, (func >= RK11.FUNC.WCHK), this.doneReadWrite.bind(this));
            break;

        case RK11.FUNC.SEEK:
            iCylinder = (this.regRKDA & RK11.RKDA.CA) >> RK11.RKDA.SHIFT.CA;
            if (this.messageEnabled()) this.printMessage(this.type + ": SEEK(" + iCylinder + ")", true);
            if (iCylinder < drive.nCylinders) {
                this.regRKCS |= RK11.RKCS.SCP;
            } else {
                this.regRKER |= RK11.RKER.NXC;
            }
            break;

        case RK11.FUNC.DRESET:
            if (this.messageEnabled()) this.printMessage(this.type + ": DRESET(" + iDrive + ")");
            this.regRKER = this.regRKDA = 0;
            this.regRKCS = RK11.RKCS.CRDY | RK11.RKCS.SCP;
            break;

        default:
            if (this.messageEnabled()) this.printMessage(this.type + ": UNSUPPORTED(" + func + ")");
            break;
        }

        this.regRKDS = drive.status | (drive.disk? RK11.RKDS.DRDY : 0) | (iDrive << RK11.RKDS.SHIFT.ID) | (this.regRKDA & RK11.RKDS.SC);

        this.updateErrors();

        if (fInterrupt) {
            this.regRKCS &= ~RK11.RKCS.GO;
            this.regRKCS |= RK11.RKCS.CRDY;
            if (this.regRKCS & RK11.RKCS.IE) this.cpu.setIRQ(this.irq);
        }
    }

    /**
     * readData(drive, iCylinder, iHead, iSector, nWords, addr, inc, fCheck, done)
     *
     * @this {RK11}
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
        var err = 0;
        var disk = drive.disk;
        var sector = null, ibSector;

        if (!disk) {
            err = RK11.RKER.NXD;
            nWords = 0;
        }

        var sWords = "";
        while (nWords) {
            if (!sector) {
                if (iCylinder >= disk.nCylinders) {
                    err = RK11.RKER.NXC;
                    break;
                }
                sector = disk.seek(iCylinder, iHead, iSector + 1);
                if (!sector) {
                    err = RK11.RKER.SKE;
                    break;
                }
                ibSector = 0;
                if (++iSector >= disk.nSectors) {
                    iSector = 0;
                    if (++iHead >= disk.nHeads) {
                        iHead = 0;
                        ++iCylinder;
                    }
                }
            }
            var b0, b1;
            if ((b0 = disk.read(sector, ibSector++)) < 0 || (b1 = disk.read(sector, ibSector++)) < 0) {
                err = RK11.RKER.NXS;
                break;
            }
            if (!fCheck) {
                var data = b0 | (b1 << 8);
                this.bus.setWordDirect(this.cpu.mapUnibus(addr), data);
                if (DEBUG && this.messageEnabled(MessagesPDP11.READ)) {
                    if (!sWords) sWords = Str.toOct(addr) + ": ";
                    sWords += Str.toOct(data) + ' ';
                    if (sWords.length >= 64) {
                        console.log(sWords);
                        sWords = "";
                    }
                }
                if (this.bus.checkFault()) {
                    err = RK11.RKER.NXM;
                    break;
                }
            }
            if (ibSector >= disk.cbSector) sector = null;
            addr += inc;
            nWords--;
        }
        return done? done(err, iCylinder, iHead, iSector, nWords, addr) : err;
    }

    /**
     * writeData(drive, iCylinder, iHead, iSector, nWords, addr, inc, fCheck, done)
     *
     * @this {RK11}
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
        var err = 0;
        var disk = drive.disk;
        var sector = null, ibSector;

        if (!disk) {
            err = RK11.RKER.NXD;
            nWords = 0;
        }

        while (nWords) {
            var data = this.bus.getWordDirect(this.cpu.mapUnibus(addr));
            if (this.bus.checkFault()) {
                err = RK11.RKER.NXM;
                break;
            }
            if (!sector) {
                if (iCylinder >= disk.nCylinders) {
                    err = RK11.RKER.NXC;
                    break;
                }
                sector = disk.seek(iCylinder, iHead, iSector + 1, true);
                if (!sector) {
                    err = RK11.RKER.SKE;
                    break;
                }
                ibSector = 0;
                if (++iSector >= disk.nSectors) {
                    iSector = 0;
                    if (++iHead >= disk.nHeads) {
                        iHead = 0;
                        ++iCylinder;
                    }
                }
            }
            if (fCheck) {
                var b0, b1;
                if ((b0 = disk.read(sector, ibSector++)) < 0 || (b1 = disk.read(sector, ibSector++)) < 0) {
                    err = RK11.RKER.NXS;
                    break;
                }
                /*
                 * NOTE: During the 11/70 CPU EXERCISER diagnostic, a number of WCHK requests will fail
                 * when the test starts reading/writing with physical addresses > 177777.  I'm pretty sure all
                 * the UNIBUS address calculations are fine, and therefore those failures are expected.
                 *
                 * Originally, those failures were causing me some grief because I was treating a WCE error like
                 * any other error; ie, as a HARD error.  That was wrong.  Two errors (WCE and CSE) are soft
                 * errors, so while they should still trigger the general-purpose RKCS ERR bit, they should NOT
                 * trigger the RKCS HE (Hard Error) bit.  This is all taken care of in updateErrors() now.
                 */
                if (data != (b0 | (b1 << 8))) {
                    err = RK11.RKER.WCE;
                    break;
                }
            } else {
                if (!disk.write(sector, ibSector++, data & 0xff) || !disk.write(sector, ibSector++, data >> 8)) {
                    err = RK11.RKER.NXS;
                    break;
                }
            }
            if (ibSector >= disk.cbSector) sector = null;
            addr += inc;
            nWords--;
        }
        return done? done(err, iCylinder, iHead, iSector, nWords, addr) : err;
    }

    /**
     * doneReadWrite(err, iCylinder, iHead, iSector, nWords, addr)
     *
     * @this {RK11}
     * @param {number} err
     * @param {number} iCylinder
     * @param {number} iHead
     * @param {number} iSector
     * @param {number} nWords
     * @param {number} addr
     * @return {boolean}
     */
    doneReadWrite(err, iCylinder, iHead, iSector, nWords, addr)
    {
        this.regRKBA = addr & 0xffff;
        this.regRKCS = (this.regRKCS & ~RK11.RKCS.MEX) | ((addr >> (16 - RK11.RKCS.SHIFT.MEX)) & RK11.RKCS.MEX);
        this.regRKWC = (0x10000 - nWords) & 0xffff;
        this.regRKDA = (this.regRKDA & ~RK11.RKDA.SA) | (iSector & RK11.RKDA.SA);
        this.regRKER |= err;
        this.updateErrors();
        return true;
    }

    /**
     * updateErrors()
     *
     * @this {RK11}
     */
    updateErrors()
    {
        /*
         * Reflect RKER bits to RKCS bits as appropriate.
         *
         * TODO: I'm not entirely sure about the handling of the DRE bit here.  DEC's RK11 documentation says:
         *
         *      Sets if one of the drives in the system senses a loss of either AC or DC power and a function is
         *      either initiated or in process while the selected drive is not ready or in some error condition.
         *
         * I'm not sure how to parse all the "ands" and "ors" in that sentence.  For now, we're treating the DRE bit
         * much like the high error bit found in other hardware registers: we always set it if any lower error bits
         * are also set.
         */
        this.regRKCS &= ~RK11.RKCS.ERR;
        if (this.regRKER) {
            this.regRKER |= RK11.RKER.DRE;
            this.regRKCS |= RK11.RKCS.ERR;
            if (this.regRKER & RK11.RKER.HE) this.regRKCS |= RK11.RKCS.HE;
            if (this.messageEnabled()) this.printMessage(this.type + ": ERROR: " + Str.toOct(this.regRKER));
        }
    }

    /**
     * readRKDS(addr)
     *
     * @this {RK11}
     * @param {number} addr (eg, PDP11.UNIBUS.RKDS or 177400)
     * @return {number}
     */
    readRKDS(addr)
    {
        return this.regRKDS;
    }

    /**
     * writeRKDS(data, addr)
     *
     * @this {RK11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RKDS or 177400)
     */
    writeRKDS(data, addr)
    {
        /*
         * This is a read-only register
         */
    }

    /**
     * readRKER(addr)
     *
     * @this {RK11}
     * @param {number} addr (eg, PDP11.UNIBUS.RKER or 177402)
     * @return {number}
     */
    readRKER(addr)
    {
        return this.regRKER;
    }

    /**
     * writeRKER(data, addr)
     *
     * @this {RK11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RKER or 177402)
     */
    writeRKER(data, addr)
    {
        /*
         * This is a read-only register
         */
    }

    /**
     * readRKCS(addr)
     *
     * @this {RK11}
     * @param {number} addr (eg, PDP11.UNIBUS.RKCS or 177404)
     * @return {number}
     */
    readRKCS(addr)
    {
        return this.regRKCS & RK11.RKCS.RMASK;
    }

    /**
     * writeRKCS(data, addr)
     *
     * @this {RK11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RKCS or 177404)
     */
    writeRKCS(data, addr)
    {
        this.regRKCS = (this.regRKCS & ~RK11.RKCS.WMASK) | (data & RK11.RKCS.WMASK);

        if (this.regRKCS & RK11.RKCS.GO) this.processCommand();
    }

    /**
     * readRKWC(addr)
     *
     * @this {RK11}
     * @param {number} addr (eg, PDP11.UNIBUS.RKWC or 177406)
     * @return {number}
     */
    readRKWC(addr)
    {
        return this.regRKWC;
    }

    /**
     * writeRKWC(data, addr)
     *
     * @this {RK11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RKWC or 177406)
     */
    writeRKWC(data, addr)
    {
        this.regRKWC = data;
    }

    /**
     * readRKBA(addr)
     *
     * @this {RK11}
     * @param {number} addr (eg, PDP11.UNIBUS.RKBA or 177410)
     * @return {number}
     */
    readRKBA(addr)
    {
        return this.regRKBA;
    }

    /**
     * writeRKBA(data, addr)
     *
     * @this {RK11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RKBA or 177410)
     */
    writeRKBA(data, addr)
    {
        this.regRKBA = data;
    }

    /**
     * readRKDA(addr)
     *
     * @this {RK11}
     * @param {number} addr (eg, PDP11.UNIBUS.RKDA or 177412)
     * @return {number}
     */
    readRKDA(addr)
    {
        return this.regRKDA;
    }

    /**
     * writeRKDA(data, addr)
     *
     * @this {RK11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RKDA or 177412)
     */
    writeRKDA(data, addr)
    {
        this.regRKDA = data;
    }

    /**
     * readRKDB(addr)
     *
     * @this {RK11}
     * @param {number} addr (eg, PDP11.UNIBUS.RKDB or 177416)
     * @return {number}
     */
    readRKDB(addr)
    {
        return this.regRKDB;
    }

    /**
     * writeRKDB(data, addr)
     *
     * @this {RK11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RKDB or 177416)
     */
    writeRKDB(data, addr)
    {
        this.regRKDB = data;
    }
}

/*
 * There's nothing super special about these values, except that NONE should be falsey and the others should not.
 */
RK11.SOURCE = {
    NONE:   "",
    LOCAL:  "?",
    REMOTE: "??"
};

/*
 * Alias RK11 definitions as class constants
 */
RK11.PRI    =   PDP11.RK11.PRI;
RK11.VEC    =   PDP11.RK11.VEC;
RK11.RKDS   =   PDP11.RK11.RKDS;        // 177400: Drive Status Register
RK11.RKER   =   PDP11.RK11.RKER;        // 177402: Error Register
RK11.RKCS   =   PDP11.RK11.RKCS;        // 177404: Control Status Register
RK11.RKDA   =   PDP11.RK11.RKDA;        // 177412: Disk Address Register
RK11.FUNC   =   PDP11.RK11.FUNC;

/*
 * ES6 ALERT: As you can see below, I've finally started using computed property names.
 */
RK11.UNIBUS_IOTABLE = {
    [PDP11.UNIBUS.RKDS]:     /* 177400 */    [null, null, RK11.prototype.readRKDS,  RK11.prototype.writeRKDS,   "RKDS"],
    [PDP11.UNIBUS.RKER]:     /* 177402 */    [null, null, RK11.prototype.readRKER,  RK11.prototype.writeRKER,   "RKER"],
    [PDP11.UNIBUS.RKCS]:     /* 177404 */    [null, null, RK11.prototype.readRKCS,  RK11.prototype.writeRKCS,   "RKCS"],
    [PDP11.UNIBUS.RKWC]:     /* 177406 */    [null, null, RK11.prototype.readRKWC,  RK11.prototype.writeRKWC,   "RKWC"],
    [PDP11.UNIBUS.RKBA]:     /* 177410 */    [null, null, RK11.prototype.readRKBA,  RK11.prototype.writeRKBA,   "RKBA"],
    [PDP11.UNIBUS.RKDA]:     /* 177412 */    [null, null, RK11.prototype.readRKDA,  RK11.prototype.writeRKDA,   "RKDA"],
    [PDP11.UNIBUS.RKDB]:     /* 177416 */    [null, null, RK11.prototype.readRKDB,  RK11.prototype.writeRKDB,   "RKDB"]
};

if (NODE) module.exports = RK11;
