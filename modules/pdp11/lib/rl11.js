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

var Str = require("../../shared/lib/strlib");
var Web = require("../../shared/lib/weblib");
var DiskAPI = require("../../shared/lib/diskapi");
var Component = require("../../shared/lib/component");
var State = require("../../shared/lib/state");
var PDP11 = require("./defines");
var MessagesPDP11 = require("./messages");
var DiskPDP11 = require("./disk");

class RL11 extends Component {
    /**
     * RL11(parms)
     *
     * The RL11 component has the following component-specific (parms) properties:
     *
     *      autoMount: one or more JSON-encoded objects, each containing 'name' and 'path' properties
     *
     * The RL11 Disk Controller controls up to four RL01 or RL02 disk drives, which in turn read/write RL01K or
     * RL02K disk cartridges.  See [RL11 Disk Controller Configuration Files](/devices/pdp11/rl11/).
     *
     * RL01K disks are single-platter cartridges with 256 tracks per side, 40 sectors per track, and a sector size
     * of 256 bytes, for a total capacity of 5Mb (5,242,880 bytes).  See [RL01K Disk Images](/disks/dec/rl01k/).
     *
     * RL02K disks are single-platter cartridges with 512 tracks per side, 40 sectors per track, and a sector size
     * of 256 bytes, for a total capacity of 10Mb (10,485,760 bytes).  See [RL02K Disk Images](/disks/dec/rl02k/).
     *
     * @param {Object} parms
     */
    constructor(parms)
    {
        super("RL11", parms, RL11, MessagesPDP11.RL11);

        /*
         * We record any 'autoMount' object now, but we no longer parse it until initBus(),
         * because the Computer's getMachineParm() service may have an override for us.
         */
        this.configMount = this.parseConfig(parms['autoMount']);
        this.cAutoMount = 0;

        /*
         * The RL11 has two Drive Select bits, representing up to four drives.
         */
        this.nDrives = 4;
        this.aDrives = new Array(this.nDrives);
        this.fLocalDisks = (!Web.isMobile() && window && 'FileReader' in window);
        this.sDiskSource = RL11.SOURCE.NONE;

        this.irq = null;

        /*
         * Define all the properties to be initialized by initController()
         */
        this.regRLCS = this.regRLBA = this.regRLDA = this.tmpRLDA = this.regRLMP = this.regRLBE = 0;
    }

    /**
     * parseConfig(config)
     *
     * @this {RL11}
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
     * @this {RL11}
     * @param {string|null} sType is the type of the HTML control (eg, "button", "list", "text", etc)
     * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "listDisks")
     * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
     * @param {string} [sValue] optional data value
     * @return {boolean} true if binding was successful, false if unrecognized binding request
     */
    setBinding(sType, sBinding, control, sValue)
    {
        var rl11 = this;

        switch (sBinding) {

        case "listDisks":
            this.bindings[sBinding] = control;

            control.onchange = function onChangeListDisks(event) {
                var controlDesc = rl11.bindings["descDisk"];
                var controlOption = control.options && control.options[control.selectedIndex];
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
                var iDrive = Str.parseInt(control.value, 10);
                if (iDrive != null) rl11.displayDisk(iDrive);
            };
            return true;

        case "loadDisk":
            this.bindings[sBinding] = control;

            control.onclick = function onClickLoadDrive(event) {
                var controlDisks = rl11.bindings["listDisks"];
                if (controlDisks && controlDisks.options) {
                    var sDiskName = controlDisks.options[controlDisks.selectedIndex].text;
                    var sDiskPath = controlDisks.value;
                    rl11.loadSelectedDrive(sDiskName, sDiskPath);
                }
            };
            return true;

        case "bootDisk":
            this.bindings[sBinding] = control;

            control.onclick = function onClickBootDisk(event) {
                rl11.bootSelectedDisk();
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
                var controlDrives = rl11.bindings["listDrives"];
                if (controlDrives && controlDrives.options && rl11.aDrives) {
                    var iDriveSelected = Str.parseInt(controlDrives.value, 10) || 0;
                    var drive = rl11.aDrives[iDriveSelected];
                    if (drive) {
                        /*
                         * Note the similarity (and hence factoring opportunity) between this code and the HDC's "saveHD*" binding.
                         */
                        var disk = drive.disk;
                        if (disk) {
                            if (DEBUG) rl11.println("saving disk " + disk.sDiskPath + "...");
                            var sAlert = Web.downloadFile(disk.encodeAsBase64(), "octet-stream", true, disk.sDiskFile.replace(".json", ".img"));
                            Web.alertUser(sAlert);
                        } else {
                            rl11.notice("No disk loaded in drive.");
                        }
                    } else {
                        rl11.notice("No disk drive selected.");
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
    }

    /**
     * initBus(cmp, bus, cpu, dbg)
     *
     * @this {RL11}
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

        this.irq = this.cpu.addIRQ(PDP11.RL11.VEC, PDP11.RL11.PRI, MessagesPDP11.RL11);

        bus.addIOTable(this, RL11.UNIBUS_IOTABLE);
        bus.addResetHandler(this.reset.bind(this));

        this.addDisk("None", RL11.SOURCE.NONE, true);
        if (this.fLocalDisks) this.addDisk("Local Disk", RL11.SOURCE.LOCAL);
        this.addDisk("Remote Disk", RL11.SOURCE.REMOTE);

        if (!this.autoMount()) this.setReady();
    }

    /**
     * getDriveName(iDrive)
     *
     * @this {RL11}
     * @param {number} iDrive
     * @return {string}
     */
    getDriveName(iDrive)
    {
        return "RL" + iDrive;
    }

    /**
     * getDriveNumber(sDrive)
     *
     * @this {RL11}
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
     * @this {RL11}
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
     * @this {RL11}
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
     * @this {RL11}
     */
    reset()
    {
        this.initController();
    }

    /**
     * save()
     *
     * This implements save support for the RL11 component.
     *
     * @this {RL11}
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
     * This implements restore support for the RL11 component.
     *
     * @this {RL11}
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
     * @this {RL11}
     * @return {Array}
     */
    saveController()
    {
        return [];
    }

    /**
     * autoMount(fRemount)
     *
     * @this {RL11}
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
     * @this {RL11}
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
            sDiskName = Str.getBaseName(sDiskPath);
            this.status("Attempting to load " + sDiskPath + " as \"" + sDiskName + "\"");
            this.sDiskSource = RL11.SOURCE.REMOTE;
        }
        else {
            this.sDiskSource = sDiskPath;
        }

        this.loadDrive(iDrive, sDiskName, sDiskPath, false, file);
    }

    /**
     * bootSelectedDisk()
     *
     * @this {RL11}
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
        var err = this.readData(drive, 0, 0, 0, 512, 0x0000);
        if (err) {
            this.notice("Unable to read the boot sector (" + err + ")");
        }
    }

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
    loadDrive(iDrive, sDiskName, sDiskPath, fAutoMount, file)
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
     * @this {RL11}
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
     * @this {RL11}
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
     * @this {RL11}
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
     * @this {RL11}
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
     * @this {RL11}
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
                this.sDiskSource = RL11.SOURCE.NONE;
                this.displayDisk(iDrive);
            }
        }
    }

    /**
     * unloadAllDrives(fDiscard)
     *
     * @this {RL11}
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
     * @this {RL11}
     * @param {Array} [data]
     * @return {boolean} true if successful, false if failure
     */
    initController(data)
    {
        var i = 0;
        if (!data) data = [];
        this.regRLCS = data[i++] || (PDP11.RL11.RLCS.DRDY | PDP11.RL11.RLCS.CRDY);
        this.regRLBA = data[i++] || 0;
        this.regRLDA = data[i++] || 0;
        this.tmpRLDA = data[i++] || 0;
        this.regRLMP = data[i++] || 0;
        this.regRLBE = data[i] || 0;

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
     * @this {RL11}
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
        drive.nCylinders = 512;
        drive.nHeads = 2;
        drive.nSectors = 40;
        drive.cbSector = 256;
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

        /*
         * Default drive status bits returned via the controller's Get Status command via the RLMP register
         */
        drive.status = PDP11.RL11.RLMP.GS_ST.LOCKON | PDP11.RL11.RLMP.GS_BH | PDP11.RL11.RLMP.GS_HO;

        return fSuccess;
    }

    /**
     * processCommand()
     *
     * @this {RL11}
     */
    processCommand()
    {
        var fInterrupt = true;
        var fnReadWrite, sFunc = "";
        var iDrive = (this.regRLCS & PDP11.RL11.RLCS.DS) >> PDP11.RL11.RLCS.SHIFT.DS;
        var drive = this.aDrives[iDrive];
        var disk = drive.disk;
        var iCylinder, iHead, iSector, nWords, addr;

        /*
         * The typical pattern of DRDY and CRDY:
         *
         *  1) Normally both set
         *  2) CRDY is cleared to process a command
         *  3) DRDY is cleared to indicate a command in process
         */
        this.regRLCS &= ~PDP11.RL11.RLCS.DRDY;

        switch(this.regRLCS & PDP11.RL11.RLCS.FUNC) {

        case PDP11.RL11.FUNC.NOP:
        case PDP11.RL11.FUNC.WCHK:
        case PDP11.RL11.FUNC.RDNC:
            break;

        case PDP11.RL11.FUNC.STATUS:
            if (this.regRLMP & PDP11.RL11.RLMP.GS_BH) {
                this.regRLCS &= (PDP11.RL11.RLCS.DRDY | PDP11.RL11.RLCS.FUNC | PDP11.RL11.RLCS.BAE);    // TODO: Review
            }
            /*
             * The bit indicating whether or not the disk contains 256 or 512 cylinders is critical;
             * for example, the first RSTS/E disk image we tried was an RL01K, which has only 256 cylinders,
             * and the operating system would crash mysteriously if we didn't report the correct geometry.
             */
            this.regRLMP = drive.status | (this.tmpRLDA & PDP11.RL11.RLDA.RW_HS) | (disk && disk.nCylinders == 512? PDP11.RL11.RLMP.GS_DT : 0);
            break;

        case PDP11.RL11.FUNC.SEEK:
            if ((this.regRLDA & PDP11.RL11.RLDA.GS_CMD) == PDP11.RL11.RLDA.SEEK_CMD) {
                var darCA = (this.regRLDA & PDP11.RL11.RLDA.RW_CA);
                var darHS = (this.regRLDA & PDP11.RL11.RLDA.SEEK_HS) << 2;
                if (this.regRLDA & PDP11.RL11.RLDA.SEEK_DIR) {
                    this.tmpRLDA += darCA;
                } else {
                    this.tmpRLDA -= darCA;
                }
                this.regRLDA = this.tmpRLDA = (this.tmpRLDA & PDP11.RL11.RLDA.RW_CA) | darHS;
            }
            break;

        case PDP11.RL11.FUNC.RHDR:
            this.regRLMP = this.tmpRLDA;
            break;

        case PDP11.RL11.FUNC.RDATA:
            sFunc = "READ";
            fnReadWrite = this.readData;
            /* falls through */

        case PDP11.RL11.FUNC.WDATA:
            if (!sFunc) sFunc = "WRITE";
            if (!fnReadWrite) fnReadWrite = this.writeData;

            iCylinder = this.regRLDA >> PDP11.RL11.RLDA.SHIFT.RW_CA;
            iHead = (this.regRLDA & PDP11.RL11.RLDA.RW_HS)? 1 : 0;
            iSector = this.regRLDA & PDP11.RL11.RLDA.RW_SA;
            if (!disk || iCylinder >= disk.nCylinders || iSector >= disk.nSectors) {
                this.regRLCS |= PDP11.RL11.ERRC.HNF | PDP11.RL11.RLCS.ERR;
                break;
            }
            nWords = (0x10000 - this.regRLMP) & 0xffff;
            addr = (((this.regRLBE & PDP11.RL11.RLBE.MASK)) << 16) | this.regRLBA;   // 22 bit mode

            if (this.messageEnabled()) this.printMessage(this.type + ": " + sFunc + "(" + iCylinder + ":" + iHead + ":" + iSector + ") " + Str.toOct(addr) + "--" + Str.toOct(addr + (nWords << 1)), true, true);

            fInterrupt = fnReadWrite.call(this, drive, iCylinder, iHead, iSector, nWords, addr, this.doneReadWrite.bind(this));
            break;

        default:
            break;
        }

        if (fInterrupt) {
            this.regRLCS |= PDP11.RL11.RLCS.DRDY | PDP11.RL11.RLCS.CRDY;
            if (this.regRLCS & PDP11.RL11.RLCS.IE) this.cpu.setIRQ(this.irq);
        }
    }

    /**
     * readData(drive, iCylinder, iHead, iSector, nWords, addr, done)
     *
     * @this {RL11}
     * @param {Object} drive
     * @param {number} iCylinder
     * @param {number} iHead
     * @param {number} iSector
     * @param {number} nWords
     * @param {number} addr
     * @param {function(...)} [done]
     * @return {boolean|number} true if complete, false if queued (or if no done() is supplied, the error code, if any)
     */
    readData(drive, iCylinder, iHead, iSector, nWords, addr, done)
    {
        var err = 0;
        var checksum = 0;
        var disk = drive.disk;
        var sector = null, ibSector;

        if (!disk) {
            err = PDP11.RL11.ERRC.HNF;      // TODO: Review
            nWords = 0;
        }

        var sWords = "";
        while (nWords) {
            if (!sector) {
                sector = disk.seek(iCylinder, iHead, iSector + 1);
                if (!sector) {
                    err = PDP11.RL11.ERRC.HNF;
                    break;
                }
                ibSector = 0;
            }
            var b0, b1, data;
            if ((b0 = disk.read(sector, ibSector++)) < 0 || (b1 = disk.read(sector, ibSector++)) < 0) {
                err = PDP11.RL11.ERRC.HNF;
                break;
            }
            /*
             * Apparently, this controller honors the UNIBUS Map registers, which means we must call mapUnibus()
             * on the address REGARDLESS whether it is actually >= BusPDP11.UNIBUS_22BIT.  TODO: This is inherited
             * code, so let's review the documentation on this.
             */
            this.bus.setWordDirect(this.cpu.mapUnibus(addr), data = b0 | (b1 << 8));
            if (DEBUG && this.messageEnabled(MessagesPDP11.READ)) {
                if (!sWords) sWords = Str.toOct(addr) + ": ";
                sWords += Str.toOct(data) + ' ';
                if (sWords.length >= 64) {
                    console.log(sWords);
                    sWords = "";
                }
            }
            if (this.bus.checkFault()) {
                err = PDP11.RL11.ERRC.NXM;
                break;
            }
            addr += 2;
            nWords--;
            checksum += data;
            if (ibSector >= disk.cbSector) {
                sector = null;
                if (++iSector >= disk.nSectors) {
                    iSector = 0;
                    if (++iHead >= disk.nHeads) {
                        iHead = 0;
                        if (++iCylinder >= disk.nCylinders) {
                            err = PDP11.RL11.ERRC.HNF;
                            break;
                        }
                    }
                }
            }
        }

        if (DEBUG && this.messageEnabled(MessagesPDP11.READ)) {
            console.log("checksum: " + (checksum|0));
        }

        return done? done(err, iCylinder, iHead, iSector, nWords, addr) : err;
    }

    /**
     * writeData(drive, iCylinder, iHead, iSector, nWords, addr, done)
     *
     * @this {RL11}
     * @param {Object} drive
     * @param {number} iCylinder
     * @param {number} iHead
     * @param {number} iSector
     * @param {number} nWords
     * @param {number} addr
     * @param {function(...)} [done]
     * @return {boolean|number} true if complete, false if queued (or if no done() is supplied, the error code, if any)
     */
    writeData(drive, iCylinder, iHead, iSector, nWords, addr, done)
    {
        var err = 0;
        var checksum = 0;
        var disk = drive.disk;
        var sector = null, ibSector;

        if (!disk) {
            err = PDP11.RL11.ERRC.HNF;      // TODO: Review
            nWords = 0;
        }

        var sWords = "";
        while (nWords) {
            /*
             * Apparently, this controller honors the UNIBUS Map registers, which means we must call mapUnibus()
             * on the address REGARDLESS whether it is actually >= BusPDP11.UNIBUS_22BIT.  TODO: This is inherited
             * code, so let's review the documentation on this.
             */
            var data = this.bus.getWordDirect(this.cpu.mapUnibus(addr));
            if (this.bus.checkFault()) {
                err = PDP11.RL11.ERRC.NXM;
                break;
            }
            if (DEBUG && this.messageEnabled(MessagesPDP11.WRITE)) {
                if (!sWords) sWords = Str.toOct(addr) + ": ";
                sWords += Str.toOct(data) + ' ';
                if (sWords.length >= 64) {
                    console.log(sWords);
                    sWords = "";
                }
            }
            addr += 2;
            nWords--;
            checksum += data;
            if (!sector) {
                sector = disk.seek(iCylinder, iHead, iSector + 1, true);
                if (!sector) {
                    err = PDP11.RL11.ERRC.HNF;
                    break;
                }
                ibSector = 0;
            }
            if (!disk.write(sector, ibSector++, data & 0xff) || !disk.write(sector, ibSector++, data >> 8)) {
                err = PDP11.RL11.ERRC.HNF;
                break;
            }
            if (ibSector >= disk.cbSector) {
                sector = null;
                if (++iSector >= disk.nSectors) {
                    iSector = 0;
                    if (++iHead >= disk.nHeads) {
                        iHead = 0;
                        if (++iCylinder >= disk.nCylinders) {
                            err = PDP11.RL11.ERRC.HNF;
                            break;
                        }
                    }
                }
            }
        }

        if (DEBUG && this.messageEnabled(MessagesPDP11.WRITE)) {
            console.log("checksum: " + (checksum|0));
        }

        return done? done(err, iCylinder, iHead, iSector, nWords, addr) : err;
    }

    /**
     * doneReadWrite(err, iCylinder, iHead, iSector, nWords, addr)
     *
     * @this {RL11}
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
        this.regRLBA = addr & 0xffff;
        this.regRLCS = (this.regRLCS & ~PDP11.RL11.RLCS.BAE) | ((addr >> (16 - PDP11.RL11.RLCS.SHIFT.BAE)) & PDP11.RL11.RLCS.BAE);
        this.regRLBE = (addr >> 16) & PDP11.RL11.RLBE.MASK;         // 22 bit mode
        this.regRLDA = (iCylinder << PDP11.RL11.RLDA.SHIFT.RW_CA) | (iHead? PDP11.RL11.RLDA.RW_HS : 0) | (iSector & PDP11.RL11.RLDA.RW_SA);
        this.tmpRLDA = this.regRLDA;
        this.regRLMP = (0x10000 - nWords) & 0xffff;
        if (err) {
            this.regRLCS |= err | PDP11.RL11.RLCS.ERR;
        }
        return true;
    }

    /**
     * readRLCS(addr)
     *
     * @this {RL11}
     * @param {number} addr (eg, PDP11.UNIBUS.RLCS or 174400)
     * @return {number}
     */
    readRLCS(addr)
    {
        return this.regRLCS & PDP11.RL11.RLCS.RMASK;
    }

    /**
     * writeRLCS(data, addr)
     *
     * @this {RL11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RLCS or 174400)
     */
    writeRLCS(data, addr)
    {
        this.regRLCS = (this.regRLCS & ~PDP11.RL11.RLCS.WMASK) | (data & PDP11.RL11.RLCS.WMASK);
        this.regRLBE = (this.regRLBE & 0x3C) | ((data & PDP11.RL11.RLCS.BAE) >> PDP11.RL11.RLCS.SHIFT.BAE);
        if (!(this.regRLCS & PDP11.RL11.RLCS.CRDY)) this.processCommand();
    }

    /**
     * readRLBA(addr)
     *
     * @this {RL11}
     * @param {number} addr (eg, PDP11.UNIBUS.RLBA or 174402)
     * @return {number}
     */
    readRLBA(addr)
    {
        return this.regRLBA;
    }

    /**
     * writeRLBA(data, addr)
     *
     * @this {RL11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RLBA or 174402)
     */
    writeRLBA(data, addr)
    {
        this.regRLBA = data & PDP11.RL11.RLBA.WMASK;
    }

    /**
     * readRLDA(addr)
     *
     * @this {RL11}
     * @param {number} addr (eg, PDP11.UNIBUS.RLDA or 174404)
     * @return {number}
     */
    readRLDA(addr)
    {
        return this.regRLDA;
    }

    /**
     * writeRLDA(data, addr)
     *
     * @this {RL11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RLDA or 174404)
     */
    writeRLDA(data, addr)
    {
        this.regRLDA = data;
    }

    /**
     * readRLMP(addr)
     *
     * @this {RL11}
     * @param {number} addr (eg, PDP11.UNIBUS.RLMP or 174406)
     * @return {number}
     */
    readRLMP(addr)
    {
        return this.regRLMP;
    }

    /**
     * writeRLMP(data, addr)
     *
     * @this {RL11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RLMP or 174406)
     */
    writeRLMP(data, addr)
    {
        this.regRLMP = data;
    }

    /**
     * readRLBE(addr)
     *
     * @this {RL11}
     * @param {number} addr (eg, PDP11.UNIBUS.RLBE or 174410)
     * @return {number}
     */
    readRLBE(addr)
    {
        return this.regRLBE;
    }

    /**
     * writeRLBE(data, addr)
     *
     * Curiously, we see RSTS/E v7.0 writing RLBE bits that aren't documented:
     *
     *      R0=000000 R1=000000 R2=174410 R3=000000 R4=102076 R5=045166
     *      SP=052662 PC=067624 PS=034344 IR=000000 SL=000377 T0 N0 Z1 V0 C0
     *      067624: 012712 000300          MOV   #300,@R2
     *
     * @this {RL11}
     * @param {number} data
     * @param {number} addr (eg, PDP11.UNIBUS.RLBE or 174410)
     */
    writeRLBE(data, addr)
    {
        this.regRLBE = data & PDP11.RL11.RLBE.MASK;
        this.regRLCS = (this.regRLCS & ~PDP11.RL11.RLCS.BAE) | ((this.regRLBE & 0x3) << PDP11.RL11.RLCS.SHIFT.BAE);
    }
}

/*
 * There's nothing super special about these values, except that NONE should be falsey and the others should not.
 */
RL11.SOURCE = {
    NONE:   "",
    LOCAL:  "?",
    REMOTE: "??"
};

/*
 * ES6 ALERT: As you can see below, I've finally started using computed property names.
 */
RL11.UNIBUS_IOTABLE = {
    [PDP11.UNIBUS.RLCS]:     /* 174400 */    [null, null, RL11.prototype.readRLCS,  RL11.prototype.writeRLCS,   "RLCS"],
    [PDP11.UNIBUS.RLBA]:     /* 174402 */    [null, null, RL11.prototype.readRLBA,  RL11.prototype.writeRLBA,   "RLBA"],
    [PDP11.UNIBUS.RLDA]:     /* 174404 */    [null, null, RL11.prototype.readRLDA,  RL11.prototype.writeRLDA,   "RLDA"],
    [PDP11.UNIBUS.RLMP]:     /* 174406 */    [null, null, RL11.prototype.readRLMP,  RL11.prototype.writeRLMP,   "RLMP"],
    [PDP11.UNIBUS.RLBE]:     /* 174410 */    [null, null, RL11.prototype.readRLBE,  RL11.prototype.writeRLBE,   "RLBE"]
};

module.exports = RL11;
