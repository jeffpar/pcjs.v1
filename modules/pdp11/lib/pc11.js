/**
 * @fileoverview Implements the PC11 High-Speed Paper Tape Reader/Punch
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
    var DumpAPI       = require("../../shared/lib/dumpapi");
    var Component     = require("../../shared/lib/component");
    var State         = require("../../shared/lib/state");
    var PDP11         = require("./defines");
    var MessagesPDP11 = require("./messages");
}

/**
 * PC11(parms)
 *
 * @constructor
 * @extends Component
 * @param {Object} parms
 */
function PC11(parms)
{
    Component.call(this, "PC11", parms, PC11);

    /*
     * We record any 'autoMount' object now, but we no longer parse it until initBus(), because the Computer's
     * getMachineParm() service may have an override for us.
     */
    this.configMount = parms['autoMount'] || null;

    /*
     * TODO: Technically, the PC11 should have a timer that "clocks" data from the abReader buffer into the
     * PRB register at the appropriate rate (300 CPS for the high-speed version, 10 CPS for the low-speed version).
     */
    this.prs = 0;               // PRS register
    this.prb = 0;               // PRB register
    this.iReader = 0;           // buffer index
    this.abReader = [];         // buffer for the PRB register

    this.flags.local = false;
    this.sTapeName = this.sTapePath = this.sTapeFile = "";

    /*
     * Support for local tape images is currently limited to desktop browsers with FileReader support;
     * when this flag is set, setBinding() allows local tape bindings and informs initBus() to update the
     * "listTapes" binding accordingly.
     */
    this.fLocalTapes = (!web.isMobile() && window && 'FileReader' in window);
}

Component.subclass(PC11);

/**
 * setBinding(sType, sBinding, control, sValue)
 *
 * @this {PC11}
 * @param {string|null} sType is the type of the HTML control (eg, "button", "list", "text", etc)
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "listTapes")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @param {string} [sValue] optional data value
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
PC11.prototype.setBinding = function(sType, sBinding, control, sValue)
{
    var pc11 = this;

    switch (sBinding) {

    case "listTapes":
        this.bindings[sBinding] = control;

        control.onchange = function onChangeListTapes(event) {
            var controlDesc = pc11.bindings["descTape"];
            var controlOption = control.options[control.selectedIndex];
            if (controlDesc && controlOption) {
                var dataValue = {};
                var sValue = controlOption.getAttribute("data-value");
                if (sValue) {
                    try {
                        dataValue = eval("(" + sValue + ")");
                    } catch (e) {
                        Component.error("PC11 option error: " + e.message);
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

    case "descTape":
        this.bindings[sBinding] = control;
        return true;

    case "loadTape":
        this.bindings[sBinding] = control;

        control.onclick = function onClickLoadTape(event) {
            var controlTapes = pc11.bindings["listTapes"];
            if (controlTapes) {
                var sTapeName = controlTapes.options[controlTapes.selectedIndex].text;
                var sTapePath = controlTapes.value;
                pc11.loadSelectedTape(sTapeName, sTapePath);
            }
        };
        return true;

    case "mountTape":
        if (!this.fLocalTapes) {
            if (DEBUG) this.log("Local tape support not available");
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
                var sTapePath = file.name;
                var sTapeName = str.getBaseName(sTapePath, true);
                pc11.loadSelectedTape(sTapeName, sTapePath, file);
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
 * @this {PC11}
 * @param {ComputerPDP11} cmp
 * @param {BusPDP11} bus
 * @param {CPUStatePDP11} cpu
 * @param {DebuggerPDP11} dbg
 */
PC11.prototype.initBus = function(cmp, bus, cpu, dbg)
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
                Component.error("PC11 auto-mount error: " + e.message + " (" + this.configMount + ")");
                this.configMount = null;
            }
        }
    }

    bus.addIOTable(this, PC11.UNIBUS_IOTABLE);

    this.addTape("None", "", true);
    if (this.fLocalTapes) this.addTape("Local Tape", "?");
    this.addTape("Remote Tape", "??");

    if (!this.autoMount()) this.setReady();
};

/**
 * powerUp(data, fRepower)
 *
 * @this {PC11}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
PC11.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data || !this.restore) {
            this.reset();
        } else {
            if (!this.restore(data)) return false;
        }
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {PC11}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
PC11.prototype.powerDown = function(fSave, fShutdown)
{
    return fSave? this.save() : true;
};

/**
 * reset()
 *
 * @this {PC11}
 */
PC11.prototype.reset = function()
{
    this.prs &= ~PDP11.PC11.PRS.CLEAR;
    this.prb = 0;
    this.iReader = 0;
    this.abReader = [];
};

/**
 * autoMount(fRemount)
 *
 * @this {PC11}
 * @param {boolean} [fRemount] is true if we're remounting all auto-mounted tapes
 * @return {boolean} true if one or more tape images are being auto-mounted, false if none
 */
PC11.prototype.autoMount = function(fRemount)
{
    if (!fRemount) this.cAutoMount = 0;
    if (this.configMount) {
        var sTapePath = this.configMount['path'];
        var sTapeName = this.configMount['name'] || this.findTape(sTapePath);
        if (sTapePath && sTapeName) {
            if (!this.loadTape(sTapeName, sTapePath, true) && fRemount) {
                this.setReady(false);
            }
        } else {
            this.notice("Incorrect auto-mount settings for PC11 (" + JSON.stringify(this.configMount) + ")");
        }
    }
    return !!this.cAutoMount;
};

/**
 * loadSelectedTape(sTapeName, sTapePath, file)
 *
 * @this {PC11}
 * @param {string} sTapeName
 * @param {string} sTapePath
 * @param {File} [file] is set if there's an associated File object
 */
PC11.prototype.loadSelectedTape = function(sTapeName, sTapePath, file)
{
    if (!sTapePath) {
        this.unloadTape();
        return;
    }

    if (sTapePath == "?") {
        this.notice('Use "Choose File" and "Mount" to select and load a local tape.');
        return;
    }

    /*
     * If the special path of "??" is selected, then we want to prompt the user for a URL.  Oh, and
     * make sure we pass an empty string as the 2nd parameter to prompt(), so that IE won't display
     * "undefined" -- because after all, undefined and "undefined" are EXACTLY the same thing, right?
     *
     * TODO: This is literally all I've done to support remote tape images. There's probably more
     * I should do, like dynamically updating "listTapes" to include new entries, and adding new entries
     * to the save/restore data.
     */
    if (sTapePath == "??") {
        sTapePath = window.prompt("Enter the URL of a remote tape image.", "") || "";
        if (!sTapePath) return;
        sTapeName = str.getBaseName(sTapePath);
        if (DEBUG) this.println("Attempting to load " + sTapePath + " as \"" + sTapeName + "\"");
    }

    this.loadTape(sTapeName, sTapePath, false, file);
};

/**
 * loadTape(sTapeName, sTapePath, fAutoMount, file)
 *
 * NOTE: If sTapePath is already loaded, nothing needs to be done.
 *
 * @this {PC11}
 * @param {string} sTapeName
 * @param {string} sTapePath
 * @param {boolean} [fAutoMount]
 * @param {File} [file] is set if there's an associated File object
 * @return {number} 1 if tape loaded, 0 if queued up (or busy), -1 if already loaded
 */
PC11.prototype.loadTape = function(sTapeName, sTapePath, fAutoMount, file)
{
    if (sTapePath) {
        if (this.sTapePath.toLowerCase() != sTapePath.toLowerCase()) {

            this.unloadTape(fAutoMount, true);

            if (this.flags.busy) {
                this.notice("PC11 busy");
                return 0;
            }

            // if (DEBUG) this.println("tape queued: " + sTapeName);

            this.flags.busy = true;
            if (fAutoMount) {
                this.fAutoMount = true;
                this.cAutoMount++;
                if (this.messageEnabled()) this.printMessage("auto-loading tape: " + sTapeName);
            }

            this.flags.local = !!file;
            if (!this.load(sTapeName, sTapePath, file)) {
                return 0;
            }
            return 1;
        }
        if (DEBUG) this.println("tape loaded");
    }
    return -1;
};

/**
 * load(sTapeName, sTapePath, file)
 *
 * @this {PC11}
 * @param {string} sTapeName
 * @param {string} sTapePath
 * @param {File} [file] is set if there's an associated File object
 * @return {boolean} true if load completed (successfully or not), false if queued
 */
PC11.prototype.load = function(sTapeName, sTapePath, file)
{
    var sTapeURL = sTapePath;

    if (DEBUG) {
        var sMessage = 'load("' + sTapeName + '","' + sTapePath + '")';
        this.printMessage(sMessage);
    }

    var sTapeFile = str.getBaseName(sTapePath);

    var pc11 = this;

    if (file) {
        var reader = new FileReader();
        reader.onload = function() {
            pc11.build(reader.result);
        };
        reader.readAsArrayBuffer(file);
        return true;
    }

    /*
     * If there's an occurrence of API_ENDPOINT anywhere in the path, we assume we can use it as-is;
     * ie, that the user has already formed a URL of the type we use ourselves for unconverted tape images.
     */
    if (sTapePath.indexOf(DumpAPI.ENDPOINT) < 0) {
        /*
         * If the selected tape image has a "json" extension, then we assume it's a pre-converted
         * JSON-encoded tape image, so we load it as-is; otherwise, we ask our server-side tape image
         * converter to return the corresponding JSON-encoded data.
         */
        var sTapeExt = str.getExtension(sTapePath);
        if (sTapeExt == DumpAPI.FORMAT.JSON || sTapeExt == DumpAPI.FORMAT.JSON_GZ) {
            sTapeURL = encodeURI(sTapePath);
        } else {
            var sTapeParm = DumpAPI.QUERY.PATH;
            sTapeURL = web.getHost() + DumpAPI.ENDPOINT + '?' + sTapeParm + '=' + encodeURIComponent(sTapePath) + "&" + DumpAPI.QUERY.FORMAT + "=" + DumpAPI.FORMAT.JSON;
        }
    }

    return !!web.getResource(sTapeURL, null, true, function(sURL, sResponse, nErrorCode) {
        pc11.doneLoad(sURL, sTapeName, sTapePath, sResponse, nErrorCode);
    });
};

/**
 * build(buffer)
 *
 * Builds a disk image from an ArrayBuffer (eg, from a FileReader object), rather than from JSON-encoded data.
 *
 * @this {PC11}
 * @param {?} buffer (we KNOW this is an ArrayBuffer, but we can't seem to convince the Closure Compiler)
 */
PC11.prototype.build = function(buffer)
{
    if (buffer) {
        this.aTapeData = new Uint8Array(buffer, 0, buffer.byteLength);
    }
};

/**
 * doneLoad(sURL, sTapeName, sTapePath, sTapeData, nErrorCode)
 *
 * @this {PC11}
 * @param {string} sURL
 * @param {string} sTapeName
 * @param {string} sTapePath
 * @param {string} sTapeData
 * @param {number} nErrorCode (response from server if anything other than 200)
 */
PC11.prototype.doneLoad = function(sURL, sTapeName, sTapePath, sTapeData, nErrorCode)
{
    this.flags.busy = false;

    var fPrintOnly = (nErrorCode < 0 && this.cmp && !this.cmp.flags.powered);

    if (nErrorCode) {
        /*
         * This can happen for innocuous reasons, such as the user switching away too quickly, forcing
         * the request to be cancelled.  And unfortunately, the browser cancels XMLHttpRequest requests
         * BEFORE it notifies any page event handlers, so if the Computer's being powered down, we won't know
         * that yet.  For now, we rely on the lack of a specific error (nErrorCode < 0), and suppress the
         * notify() alert if there's no specific error AND the computer is not powered up yet.
         */
        this.notice("Unable to load tape \"" + sTapeName + "\" (error " + nErrorCode + ": " + sURL + ")", fPrintOnly);
    }
    else {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage('doneLoad("' + sTapePath + '")');
        }

        Component.addMachineResource(this.idMachine, sURL, sTapeData);

        var resource = web.parseMemoryResource(sURL, sTapeData);
        if (resource) {
            this.sTapeName = sTapeName;
            this.sTapePath = sTapePath;
            this.aTapeData = resource.aBytes;
            if (DEBUG) this.println("tape loaded: " + sTapeName);
        }
    }

    if (this.fAutoMount) {
        this.fAutoMount = false;
        if (!--this.cAutoMount) this.setReady();
    }

    this.displayTape();
};

/**
 * addTape(sName, sPath, fTop)
 *
 * @this {PC11}
 * @param {string} sName
 * @param {string} sPath
 * @param {boolean} [fTop] (default is bottom)
 */
PC11.prototype.addTape = function(sName, sPath, fTop)
{
    var controlTapes = this.bindings["listTapes"];
    if (controlTapes && controlTapes.options) {
        for (var i = 0; i < controlTapes.options.length; i++) {
            if (controlTapes.options[i].value == sPath) return;
        }
        var controlOption = document.createElement("option");
        controlOption.text = sName;
        controlOption.value = sPath;
        if (fTop && controlTapes.childNodes[0]) {
            controlTapes.insertBefore(controlOption, controlTapes.childNodes[0]);
        } else {
            controlTapes.appendChild(controlOption);
        }
    }
};

/**
 * findTape(sPath)
 *
 * This is used to deal with mount requests (eg, autoMount) that supply a path without a name;
 * if we can find the path in the "listTapes" control, then we return the associated tape name.
 *
 * @this {PC11}
 * @param {string} sPath
 * @return {string|null}
 */
PC11.prototype.findTape = function(sPath)
{
    var controlTapes = this.bindings["listTapes"];
    if (controlTapes && controlTapes.options) {
        for (var i = 0; i < controlTapes.options.length; i++) {
            var control = controlTapes.options[i];
            if (control.value == sPath) return control.text;
        }
    }
    return str.getBaseName(sPath, true);
};

/**
 * displayTape()
 *
 * @this {PC11}
 */
PC11.prototype.displayTape = function()
{
    var controlTapes = this.bindings["listTapes"];

    if (controlTapes && controlTapes.options) {
        var sTargetPath = (this.flags.local? "?" : this.sTapePath);
        for (var i = 0; i < controlTapes.options.length; i++) {
            if (controlTapes.options[i].value == sTargetPath) {
                if (controlTapes.selectedIndex != i) {
                    controlTapes.selectedIndex = i;
                }
                break;
            }
        }
        if (i == controlTapes.options.length) controlTapes.selectedIndex = 0;
    }
};

/**
 * unloadTape(fAutoUnload, fQuiet)
 *
 * @this {PC11}
 * @param {boolean} [fAutoUnload] is true if this unload is being forced as part of an automount and/or restored mount
 * @param {boolean} [fQuiet]
 */
PC11.prototype.unloadTape = function(fAutoUnload, fQuiet)
{
    this.sTapeName = "";
    this.sTapePath = "";
    this.flags.local = false;
};

/**
 * save()
 *
 * This implements save support for the PC11 component.
 *
 * @this {PC11}
 * @return {Object}
 */
PC11.prototype.save = function()
{
    var state = new State(this);
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the PC11 component.
 *
 * @this {PC11}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
PC11.prototype.restore = function(data)
{
    return true;
};

/**
 * readPRS(addr)
 *
 * @this {PC11}
 * @param {number} addr (eg, PDP11.UNIBUS.PRS or 177550)
 * @return {number}
 */
PC11.prototype.readPRS = function(addr)
{
    return this.prs;
};

/**
 * writePRS(data, addr)
 *
 * @this {PC11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.PRS or 177550)
 */
PC11.prototype.writePRS = function(data, addr)
{
    if (data & PDP11.PC11.PRS.RE) {
        if (this.prs & PDP11.PC11.PRS.ERROR) {
            data &= ~PDP11.PC11.PRS.RE;
            // if (this.prs & PDP11.PC11.PRS.RIE) {
                // TODO: Generate an interrupt
            // }
        } else {
            this.prs &= ~PDP11.PC11.PRS.DONE;
            this.prs |= PDP11.PC11.PRS.BUSY;
        }
    }
    this.prs = (this.prs & ~PDP11.PC11.PRS.WMASK) | (data & PDP11.PC11.PRS.WMASK);
};

/**
 * readPRB(addr)
 *
 * @this {PC11}
 * @param {number} addr (eg, PDP11.UNIBUS.PRB or 177552)
 * @return {number}
 */
PC11.prototype.readPRB = function(addr)
{
    return this.prb;
};

/**
 * writePRB(data, addr)
 *
 * @this {PC11}
 * @param {number} data
 * @param {number} addr (eg, PDP11.UNIBUS.PRB or 177552)
 */
PC11.prototype.writePRB = function(data, addr)
{
};

/*
 * ES6 ALERT: As you can see below, I've finally started using computed property names.
 */
PC11.UNIBUS_IOTABLE = {
    [PDP11.UNIBUS.PRS]:     /* 177550 */    [null, null, PC11.prototype.readPRS,    PC11.prototype.writePRS,    "PRS"],
    [PDP11.UNIBUS.PRB]:     /* 177552 */    [null, null, PC11.prototype.readPRB,    PC11.prototype.writePRB,    "PRB"]
};

if (NODE) module.exports = PC11;
