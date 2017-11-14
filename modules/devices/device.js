/**
 * @fileoverview Base class for devices, with assorted handy services
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
 * <http://pcjs.org/modules/devices/machine.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * @define {boolean}
 */
var COMPILED = false;

/**
 * @define {boolean}
 */
var DEBUG = (window.location.hostname == "pcjs" || window.location.hostname == "jeffpar.local");

/**
 * The following properties are the standard set of properties a Device's config object may contain.
 * Other devices will generally define their own extended versions (eg, LEDConfig, InputConfig, etc).
 *
 * @typedef {Object} Config
 * @property {string} class
 * @property {Object} [bindings]
 * @property {number} [version]
 * @property {Array.<string>} [overrides]
 */

/**
 * @class {Device}
 * @unrestricted
 * @property {string} idMachine
 * @property {string} idDevice
 * @property {Config} config
 * @property {Object} bindings [added by addBindings()]
 * @property {string} sCategories
 */
class Device {
    /**
     * Device()
     *
     * Supported config properties:
     *
     *      "bindings": object containing name/value pairs, where name is the generic name
     *      of a element, and value is the ID of the DOM element that should be mapped to it
     *
     * The properties in the "bindings" object are copied to our own bindings object in addBindings(),
     * but only for DOM elements that actually exist, and it is the elements themselves (rather than
     * their IDs) that we store.
     *
     * Also, URL parameters can be used to override config properties.  For example, the URL:
     *
     *      http://pcjs:8088/devices/ti57/machine/?cyclesPerSecond=100000
     *
     * will set the Time device's cyclesPerSecond config property to 100000.  In general, the values
     * will be treated as strings, unless they contain all digits (number), or equal "true" or "false"
     * (boolean).
     *
     * @this {Device}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {number} [version]
     * @param {Config} [config]
     */
    constructor(idMachine, idDevice, version, config)
    {
        this.config = config || {};
        this.idMachine = idMachine;
        this.idDevice = idDevice;
        this.version = version || 0;
        this.bindings = {};
        this.sCategories = "";

        /*
         * Add this Device to the global set of Devices, so that findDevice(), findBinding(), etc, will work.
         */
        this.addDevice();

        /*
         * Build the set of ACTUAL bindings (this.bindings) from the set of DESIRED bindings (this.config.bindings)
         */
        this.addBindings(this.config.bindings);

        this.checkVersion(this.config);

        /*
         * If this device's config contains an "overrides" array, then any of the properties listed in
         * that array may be overridden with a URL parameter.  We don't impose any checks on the overriding
         * value, so it is the responsibility of the component with overridable properties to validate them.
         */
        if (this.config.overrides) {
            let parms = Device.getURLParms();
            for (let prop in parms) {
                if (this.config.overrides.indexOf(prop) >= 0) {
                    let value;
                    let s = parms[prop];
                    /*
                     * You might think we could simply call parseInt() and check isNaN(), but parseInt() has
                     * some annoying quirks, like stopping at the first non-numeric character.  If the ENTIRE
                     * string isn't a number, then we don't want to treat ANY part of it as a number.
                     */
                    if (s.match(/^[+-]?[0-9.]+$/)) {
                        value = Number.parseInt(s, 10);
                    } else if (s == "true") {
                        value = true;
                    } else if (s == "false") {
                        value = false;
                    } else {
                        value = s;
                        s = '"' + s + '"';
                    }
                    this.config[prop] = value;
                    this.println("overriding " + idDevice + " property '" + prop + "' with " + s);
                }
            }
        }
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Device}
     * @param {string} binding
     * @param {HTMLElement} element
     */
    addBinding(binding, element)
    {
        let device = this;

        switch(binding) {

        case Device.BINDING.PRINT:
            if (!this.bindings[binding]) {
                let elementTextArea = /** @type {HTMLTextAreaElement} */ (element);
                this.bindings[binding] = elementTextArea;
                /*
                 * This was added for Firefox (Safari will clear the <textarea> on a page reload, but Firefox does not).
                 */
                elementTextArea.value = "";
                /*
                 * An onKeyPress handler has been added to this element simply to stop event propagation, so that if the
                 * element has been explicitly given focus, any key presses won't be picked up by the Input device (which,
                 * as that device's constructor explains, is monitoring key presses for the entire document).
                 */
                elementTextArea.addEventListener(
                    'keypress',
                    function onKeyPress(event) {
                        event = event || window.event;
                        let keyCode = event.which || event.keyCode;
                        if (keyCode) {
                            /*
                             * Move the caret to the end of any text in the textarea.
                             */
                            let sText = elementTextArea.value;
                            elementTextArea.setSelectionRange(sText.length, sText.length);

                            /*
                             * Don't let the Input device's document-based keypress handler see any key presses
                             * that came to this element first.
                             */
                            event.stopPropagation();

                            /*
                             * On the ENTER key, look for any COMMAND handlers and invoke them until one of them
                             * returns true.
                             */
                            if (keyCode == 13) {
                                let afn = device.findHandlers(Device.HANDLER.COMMAND);
                                if (afn) {
                                    /*
                                     * At the time we call any command handlers, a linefeed will not yet have been
                                     * appended to the text, so for consistency, we prevent the default behavior and
                                     * add the linefeed ourselves.  Unfortunately, one side-effect is that we must
                                     * go to some extra effort to ensure the cursor remains in view; hence the stupid
                                     * blur() and focus() calls.
                                     */
                                    event.preventDefault();
                                    sText = (elementTextArea.value += '\n');
                                    elementTextArea.blur();
                                    elementTextArea.focus();

                                    let i = sText.lastIndexOf('\n', sText.length - 2);
                                    let sCommand = sText.slice(i+1, -1);
                                    for (let i = 0; i < afn.length; i++) {
                                        if (afn[i](sCommand)) break;
                                    }
                                }
                            }
                        }
                    }
                );
            }
            break;

        default:
            if (!this.bindings[binding]) this.bindings[binding] = element;
            break;
        }
    }

    /**
     * addBindings(bindings)
     *
     * This function supports either a "bindings" object map, or an array of "direct bindings".
     *
     * @this {Device}
     * @param {Object} bindings
     */
    addBindings(bindings)
    {
        let fDirectBindings = Array.isArray(bindings);
        for (let binding in bindings) {
            let id = bindings[binding];
            if (fDirectBindings) binding = id;
            let element = document.getElementById(id);
            if (element) {
                this.addBinding(binding, element);
            } else {
                if (!fDirectBindings) this.println("unable to find device ID: " + id);
            }
        }
    }

    /**
     * addDevice()
     *
     * @this {Device}
     */
    addDevice()
    {
        if (!Device.Machines[this.idMachine]) Device.Machines[this.idMachine] = [];
        Device.Machines[this.idMachine].push(this);
    }

    /**
     * addHandler(sType, fn)
     *
     * @this {Device}
     * @param {string} sType
     * @param {function(string)} fn
     */
    addHandler(sType, fn)
    {
        if (!Device.Handlers[this.idMachine]) Device.Handlers[this.idMachine] = {};
        if (!Device.Handlers[this.idMachine][sType]) Device.Handlers[this.idMachine][sType] = [];
        Device.Handlers[this.idMachine][sType].push(fn);
    }

    /**
     * alert(s, type)
     *
     * @param {string} s
     * @param {string} [type]
     */
    alert(s, type)
    {
        if (type && Device.Alerts.list.indexOf(type) < 0) {
            alert(s);
            Device.Alerts.list.push(type);
        }
        this.println(s);
    }

    /**
     * assert(f, s)
     *
     * Verifies conditions that must be true (for DEBUG builds only).
     *
     * The Closure Compiler should automatically remove all references to assert() in non-DEBUG builds.
     * TODO: Add a task to the build process that "asserts" there are no instances of "assertion failure" in RELEASE builds.
     *
     * @this {Device}
     * @param {*} f is the expression asserted to be true
     * @param {string} [s] is description of the assertion on failure
     */
    assert(f, s)
    {
        if (DEBUG) {
            if (!f) {
                throw new Error(s || "assertion failure");
            }
        }
    }

    /**
     * checkVersion(config)
     *
     * Verify that device's version matches the machine's version, and also that the config version stored in
     * the JSON (if any) matches the device's version.
     *
     * This is normally performed by the constructor, but the Machine device cannot be fully initialized in the
     * constructor, so it calls this separately.
     *
     * @this {Device}
     * @param {Config} config
     */
    checkVersion(config)
    {
        if (this.version) {
            let sVersion = "", version;
            let machine = this.findDevice(this.idMachine);
            if (machine.version != this.version) {
                sVersion = "Machine";
                version = machine.version;
            }
            else if (config.version && config.version != this.version) {
                sVersion = "Config";
                version = config.version;
            }
            if (sVersion) {
                let sError = this.sprintf("%s Device version (%3.2f) does not match %s version (%3.2f)", config.class, this.version, sVersion, version);
                this.alert("Error: " + sError + '\n\n' + "Clearing your browser's cache may resolve the issue.", Device.Alerts.Version);
            }
        }
    }

    /**
     * clear()
     *
     * @this {Device}
     */
    clear()
    {
        let element = this.findBinding(Device.BINDING.PRINT, true);
        if (element) element.value = "";
    }

    /**
     * findBinding(name, fAll)
     *
     * This will search the current device's bindings, and optionally all the device bindings within the
     * machine.  If the binding is found in another device, that binding is recorded in this device as well.
     *
     * @this {Device}
     * @param {string} name
     * @param {boolean} [fAll]
     * @returns {HTMLElement|null|undefined}
     */
    findBinding(name, fAll = false)
    {
        let element = this.bindings[name];
        if (element === undefined && fAll) {
            let devices = Device.Machines[this.idMachine];
            for (let i in devices) {
                element = devices[i].bindings[name];
                if (element) break;
            }
            if (!element) element = null;
            this.bindings[name] = element;
        }
        return element;
    }

    /**
     * findDevice(idDevice)
     *
     * @this {Device}
     * @param {string} idDevice
     * @returns {Device|undefined}
     */
    findDevice(idDevice)
    {
        let device;
        let devices = Device.Machines[this.idMachine];
        if (devices) {
            for (let i in devices) {
                if (devices[i].idDevice == idDevice) {
                    device = devices[i];
                    break;
                }
            }
        }
        return device;
    }

    /**
     * findDeviceByClass(idClass)
     *
     * @this {Device}
     * @param {string} idClass
     * @returns {Device|undefined}
     */
    findDeviceByClass(idClass)
    {
        let device;
        let devices = Device.Machines[this.idMachine];
        if (devices) {
            for (let i in devices) {
                if (devices[i].config.class == idClass) {
                    device = devices[i];
                    break;
                }
            }
        }
        return device;
    }

    /**
     * findHandlers(sType)
     *
     * @this {Device}
     * @param {string} sType
     * @returns {Array.<function()>|undefined}
     */
    findHandlers(sType)
    {
        return Device.Handlers[this.idMachine] && Device.Handlers[this.idMachine][sType];
    }

    /**
     * hasLocalStorage
     *
     * If localStorage support exists, is enabled, and works, return true.
     *
     * @returns {boolean}
     */
    hasLocalStorage()
    {
        if (Device.LocalStorage.Available == null) {
            let f = false;
            if (window) {
                try {
                    window.localStorage.setItem(Device.LocalStorage.Test, Device.LocalStorage.Test);
                    f = (window.localStorage.getItem(Device.LocalStorage.Test) == Device.LocalStorage.Test);
                    window.localStorage.removeItem(Device.LocalStorage.Test);
                } catch(err) {
                    this.println(err.message);
                    f = false;
                }
            }
            Device.LocalStorage.Available = f;
        }
        return Device.LocalStorage.Available;
    }

    /**
     * getBindingText(name)
     *
     * @this {Device}
     * @param {string} name
     * @return {string|undefined}
     */
    getBindingText(name)
    {
        let sText;
        let element = this.bindings[name];
        if (element) sText = element.textContent;
        return sText;
    }

    /**
     * hex(n)
     *
     * This is a helper function intended for use in a debugging console, allowing you to display
     * numbers as hex by evaluating the expression "this.hex(n)".  Technically, this should be a static
     * method, since there's nothing instance-specific about it, but "this.hex()" is easier to type than
     * "Device.hex()".
     *
     * @this {Device}
     * @param {number} n
     */
    hex(n)
    {
        return this.sprintf("%x", n);
    }

    /**
     * isCategoryOn(category)
     *
     * Use this function to enable/disable any calls (eg, print() calls) based on 1) whether specific
     * categories are required, and 2) whether the specified category is one of them.
     *
     * @this {Device}
     * @param {string} category
     */
    isCategoryOn(category)
    {
        return (!this.sCategories || this.sCategories.indexOf(category) >= 0);
    }

    /**
     * isUserAgent(s)
     *
     * Check the browser's user-agent string for the given substring; "iOS" and "MSIE" are special values you can
     * use that will match any iOS or MSIE browser, respectively (even IE11, in the case of "MSIE").
     *
     * 2013-11-06: In a questionable move, MSFT changed the user-agent reported by IE11 on Windows 8.1, eliminating
     * the "MSIE" string (which MSDN calls a "version token"; see http://msdn.microsoft.com/library/ms537503.aspx);
     * they say "public websites should rely on feature detection, rather than browser detection, in order to design
     * their sites for browsers that don't support the features used by the website." So, in IE11, we get a user-agent
     * that tries to fool apps into thinking the browser is more like WebKit or Gecko:
     *
     *      Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko
     *
     * @param {string} s is a substring to search for in the user-agent; as noted above, "iOS" and "MSIE" are special values
     * @returns {boolean} is true if the string was found, false if not
     */
    isUserAgent(s)
    {
        if (window) {
            let userAgent = window.navigator.userAgent;
            return s == "iOS" && !!userAgent.match(/(iPod|iPhone|iPad)/) && !!userAgent.match(/AppleWebKit/) || s == "MSIE" && !!userAgent.match(/(MSIE|Trident)/) || (userAgent.indexOf(s) >= 0);
        }
        return false;
    }

    /**
     * loadLocalStorage()
     *
     * @this {Device}
     * @returns {Object|null}
     */
    loadLocalStorage()
    {
        let state = null;
        if (this.hasLocalStorage()) {
            let sValue;
            if (window) {
                try {
                    sValue = window.localStorage.getItem(this.idMachine);
                    state = JSON.parse(sValue);
                } catch (err) {
                    this.println(err.message);
                }
            }
        }
        return state;
    }

    /**
     * print(s)
     *
     * @this {Device}
     * @param {string} s
     */
    print(s)
    {
        let element = this.findBinding(Device.BINDING.PRINT, true);
        if (element) {
            element.value += s;
            /*
             * Prevent the <textarea> from getting too large; otherwise, printing becomes slower and slower.
             */
            if (!DEBUG && element.value.length > 8192) {
                element.value = element.value.substr(element.value.length - 4096);
            }
            element.scrollTop = element.scrollHeight;
        }
        if (DEBUG || !element) {
            let i = s.lastIndexOf('\n');
            if (i >= 0) {
                console.log(Device.PrintBuffer + s.substr(0, i));
                Device.PrintBuffer = "";
                s = s.substr(i + 1);
            }
            Device.PrintBuffer += s;
        }
    }

    /**
     * println(s)
     *
     * @this {Device}
     * @param {string} s
     */
    println(s)
    {
        this.print(s + '\n');
    }

    /**
     * printf(format, ...args)
     *
     * @this {Device}
     * @param {string} format
     * @param {...} args
     */
    printf(format, ...args)
    {
        this.print(this.sprintf(format, ...args));
    }

    /**
     * removeDevice(idDevice)
     *
     * @this {Device}
     * @param {string} idDevice
     * @returns {boolean} (true if successfully removed, false if not)
     */
    removeDevice(idDevice)
    {
        let device;
        let devices = Device.Machines[this.idMachine];
        if (devices) {
            for (let i in devices) {
                if (devices[i].idDevice == idDevice) {
                    devices.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * saveLocalStorage(state)
     *
     * @this {Device}
     * @param {Object} state
     * @returns {boolean} true if successful, false if error
     */
    saveLocalStorage(state)
    {
        if (this.hasLocalStorage()) {
            let sValue = JSON.stringify(state);
            try {
                window.localStorage.setItem(this.idMachine, sValue);
                return true;
            } catch(err) {
                this.println(err.message);
            }
        }
        return false;
    }

    /**
     * setBindingText(name, text)
     *
     * @this {Device}
     * @param {string} name
     * @param {string} text
     */
    setBindingText(name, text)
    {
        let element = this.bindings[name];
        if (element) element.textContent = text;
    }

    /**
     * sprintf(format, ...args)
     *
     * Copied from the CCjs project (https://github.com/jeffpar/ccjs/blob/master/lib/stdio.js) and extended.
     *
     * Far from complete, let alone sprintf-compatible, but it's adequate for the handful of sprintf-style format
     * specifiers that I use.
     *
     * @this {Device}
     * @param {string} format
     * @param {...} args
     * @returns {string}
     */
    sprintf(format, ...args)
    {
        let buffer = "";
        let aParts = format.split(/%([-+ 0#]?)([0-9]*)(\.?)([0-9]*)([hlL]?)([A-Za-z%])/);

        let iArg = 0, iPart;
        for (iPart = 0; iPart < aParts.length - 7; iPart += 7) {

            buffer += aParts[iPart];

            let arg = args[iArg++];
            if (arg === undefined) continue;

            let flags = aParts[iPart+1];
            let minimum = +aParts[iPart+2] || 0;
            let precision = +aParts[iPart+4] || 0;
            let conversion = aParts[iPart+6];

            let ach = null, s;

            switch(conversion) {
            case 'd':
                /*
                 * We could use "arg |= 0", but there may be some value to supporting integers > 32 bits.
                 */
                arg = Math.trunc(arg);
                /* falls through */

            case 'f':
                s = Math.trunc(arg) + "";
                if (precision) {
                    minimum -= (precision + 1);
                }
                if (s.length < minimum) {
                    if (flags == '0') {
                        if (arg < 0) minimum--;
                        s = ("0000000000" + Math.abs(arg)).slice(-minimum);
                        if (arg < 0) s = '-' + s;
                    } else {
                        s = ("          " + s).slice(-minimum);
                    }
                }
                if (precision) {
                    arg = Math.trunc((arg - Math.trunc(arg)) * Math.pow(10, precision));
                    s += '.' + ("0000000000" + Math.abs(arg)).slice(-precision);
                }
                buffer += s;
                break;

            case 's':
                while (arg.length < minimum) {
                    if (flags == '-') {
                        arg += ' ';
                    } else {
                        arg = ' ' + arg;
                    }
                }
                buffer += arg;
                break;

            case 'X':
                ach = Device.HexUpperCase;
                /* falls through */

            case 'x':
                if (!ach) ach = Device.HexLowerCase;
                s = "";
                do {
                    s = ach[arg & 0xf] + s;
                    arg >>>= 4;
                } while (--minimum > 0 || arg);
                buffer += s;
                break;

            default:
                /*
                 * The supported ANSI C set of conversions: "dioxXucsfeEgGpn%"
                 */
                buffer += "(unrecognized printf conversion %" + conversion + ")";
                break;
            }
        }

        buffer += aParts[iPart];
        return buffer;
    }

    /**
     * getURLParms(sParms)
     *
     * @param {string} [sParms] containing the parameter portion of a URL (ie, after the '?')
     * @returns {Object} containing properties for each parameter found
     */
    static getURLParms(sParms)
    {
        let parms = Device.URLParms;
        if (!parms) {
            parms = {};
            if (window) {
                if (!sParms) {
                    /*
                     * Note that window.location.href returns the entire URL, whereas window.location.search
                     * returns only the parameters, if any (starting with the '?', which we skip over with a substr() call).
                     */
                    sParms = window.location.search.substr(1);
                }
                let match;
                let pl = /\+/g; // RegExp for replacing addition symbol with a space
                let search = /([^&=]+)=?([^&]*)/g;
                let decode = function(s) {
                    return decodeURIComponent(s.replace(pl, " ")).trim();
                };

                while ((match = search.exec(sParms))) {
                    parms[decode(match[1])] = decode(match[2]);
                }
            }
            Device.URLParms = parms;
        }
        return parms;
    }
}

Device.BINDING = {
    PRINT:      "print"
};

Device.CATEGORY = {
    TIME:       "time",
    BUFFER:     "buffer"
};

Device.HANDLER = {
    COMMAND:    "command"
};

Device.Alerts = {
    list:       [],
    Version:    "version"
};

Device.LocalStorage = {
    Available:  undefined,
    Test:       "PCjs.localStorage"
};

/**
 * Handlers is a global object whose properties are machine IDs, each of which contains zero or more
 * handler IDs, each of which contains an arrays of functions.
 *
 * @type {Object}
 */
Device.Handlers = {};

/**
 * Machines is a global object whose properties are machine IDs and whose values are arrays of Devices.
 *
 * @type {Object}
 */
Device.Machines = {};

/**
 * PrintBuffer is a global string that buffers partial lines for our print services when using console.log().
 *
 * @type {string}
 */
Device.PrintBuffer = "";

/*
 * Handy global constants
 */
Device.HexLowerCase = "0123456789abcdef";
Device.HexUpperCase = "0123456789ABCDEF";