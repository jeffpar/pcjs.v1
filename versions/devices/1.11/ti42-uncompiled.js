"use strict";

/**
 * @copyright http://pcjs.org/modules/devices/device.js (C) Jeff Parsons 2012-2017
 */

/**
 * @define {boolean}
 */
var COMPILED = false;

/**
 * @define {boolean}
 */
var DEBUG = false;  // (window.location.hostname == "pcjs" || window.location.hostname == "jeffpar.local");

/**
 * @type {string}
 */
var MACHINE = "Machine";

/** @typedef {{ class: (string|undefined), bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined) }} */
var Config;

/**
 * @class {Device}
 * @unrestricted
 * @property {string} idMachine
 * @property {string} idDevice
 * @property {Config} config
 * @property {Object} bindings [added by addBindings()]
 * @property {string} sCommandPrev
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
        this.addDevice();
        this.checkVersion(this.config);
        this.checkOverrides(this.config);
        this.addBindings(this.config['bindings']);
        this.sCommandPrev = "";
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Device}
     * @param {string} binding
     * @param {Element} element
     */
    addBinding(binding, element)
    {
        let device = this;

        switch (binding) {

        case Device.BINDING.CLEAR:
            element.onclick = function onClickClear() {
                device.clear();
            };
            break;

        case Device.BINDING.PRINT:
            let elementTextArea = /** @type {HTMLTextAreaElement} */ (element);
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
                            device.doCommand(sText);
                        }
                    }
                }
            );
            break;
        }
    }

    /**
     * addBindings(bindings)
     *
     * Builds the set of ACTUAL bindings (this.bindings) from the set of DESIRED bindings (this.config['bindings']),
     * using either a "bindings" object map OR an array of "direct bindings".
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
                this.bindings[binding] = element;
                this.addBinding(binding, element);
            } else {
                if (!fDirectBindings) this.println("unable to find device ID: " + id);
            }
        }
    }

    /**
     * addBindingOptions(element, options, fReset, sDefault)
     *
     * @this {Device}
     * @param {Element|HTMLSelectElement} element
     * @param {Object} options (eg, key/value pairs for a series of "option" elements)
     * @param {boolean} [fReset]
     * @param {string} [sDefault]
     */
    addBindingOptions(element, options, fReset, sDefault)
    {
        if (fReset) {
            element.options.length = 0;
        }
        if (options) {
            for (let prop in options) {
                let option = document.createElement("option");
                option.text = prop;
                option.value = (typeof options[prop] == "string"? options[prop] : prop);
                element.appendChild(option);
                if (option.value == sDefault) element.selectedIndex = element.options.length - 1;
            }
        }
    }

    /**
     * addDevice()
     *
     * Adds this Device to the global set of Devices, so that findDevice(), findBinding(), etc, will work.
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
     * @param {function(Array.<string>,Device)} fn
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
     * @this {Device}
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
     * checkOverrides(config)
     *
     * @this {Device}
     * @param {Config} config
     */
    checkOverrides(config)
    {
        /*
         * If this device's config contains an "overrides" array, then any of the properties listed in
         * that array may be overridden with a URL parameter.  We don't impose any checks on the overriding
         * value, so it is the responsibility of the component with overridable properties to validate them.
         */
        if (config['overrides']) {
            let parms = Device.getURLParms();
            for (let prop in parms) {
                if (config['overrides'].indexOf(prop) >= 0) {
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
                    config[prop] = value;
                    this.println("overriding " + this.idDevice + " property '" + prop + "' with " + s);
                }
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
            else if (config.version && config.version > this.version) {
                sVersion = "Config";
                version = config.version;
            }
            if (sVersion) {
                let sError = this.sprintf("%s Device version (%3.2f) incompatible with %s version (%3.2f)", config.class, this.version, sVersion, version);
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
     * doCommand(sText)
     * 
     * @this {Device}
     * @param {string} sText
     */
    doCommand(sText)
    {
        let afnHandlers = this.findHandlers(Device.HANDLER.COMMAND);
        if (afnHandlers) {

            let i = sText.lastIndexOf('\n', sText.length - 2);
            let sCommand = sText.slice(i + 1, -1) || this.sCommandPrev;
            this.sCommandPrev = "";
            sCommand = sCommand.trim();
            let aTokens = sCommand.split(' ');
    
            switch(aTokens[0]) {
            case 'c':
                let c = aTokens[1];
                if (c) {
                    this.println("set category '" + c + "'");
                    this.setCategory(c);
                } else {
                    c = this.setCategory();
                    if (c) {
                        this.println("cleared category '" + c + "'");
                    } else {
                        this.println("no category set");
                    }
                }
                break;
            case '?':
                let sResult = "";
                Device.COMMANDS.forEach(cmd => {sResult += '\n' + cmd;});
                if (sResult) this.println("default commands:" + sResult);
                /* falls through */
            default:
                aTokens.unshift(sCommand);
                for (let i = 0; i < afnHandlers.length; i++) {
                    if (afnHandlers[i](aTokens, this)) break;
                }
                break;
            }
        }
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
     * @returns {Element|null|undefined}
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
                if (devices[i].config['class'] == idClass) {
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
     * @returns {Array.<function(Array.<string>,Device)>|undefined}
     */
    findHandlers(sType)
    {
        return Device.Handlers[this.idMachine] && Device.Handlers[this.idMachine][sType];
    }

    /**
     * getBindingID(name)
     * 
     * Since this.bindings contains the actual elements, not their original IDs, we must delve back into
     * the original this.config['bindings'] to determine the original ID.
     * 
     * @this {Device}
     * @param {string} name 
     * @returns {string|undefined}
     */
    getBindingID(name)
    {
        return this.config['bindings'] && this.config['bindings'][name];
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
     * getBounded(n, min, max)
     *
     * Restricts n to the bounds defined by min and max.  A side-effect is ensuring that the return
     * value is ALWAYS a number, even n is not.
     *
     * @this {Device}
     * @param {number} n
     * @param {number} min
     * @param {number} max
     * @returns {number} (updated n)
     */
    getBounded(n, min, max)
    {

        n = +n || 0;
        if (n < min) n = min;
        if (n > max) n = max;
        return n;
    }

    /**
     * getDefault(idConfig, defaultValue)
     *
     * @this {Device}
     * @param {string} idConfig
     * @param {*} defaultValue
     * @returns {*}
     */
    getDefault(idConfig, defaultValue)
    {
        let value = this.config[idConfig];
        if (value === undefined) {
            value = defaultValue;
        } else {
            let type = typeof defaultValue;
            if (typeof value != type) {

                if (type == "boolean") {
                    value = !!value;
                } else if (typeof defaultValue == "number") {
                    value = +value;
                }
            }
        }
        return value;
    }

    /**
     * getDefaultBoolean(idConfig, defaultValue)
     *
     * @this {Device}
     * @param {string} idConfig
     * @param {boolean} defaultValue
     * @returns {boolean}
     */
    getDefaultBoolean(idConfig, defaultValue)
    {
        return /** @type {boolean} */ (this.getDefault(idConfig, defaultValue));
    }

    /**
     * getDefaultNumber(idConfig, defaultValue)
     *
     * @this {Device}
     * @param {string} idConfig
     * @param {number} defaultValue
     * @returns {number}
     */
    getDefaultNumber(idConfig, defaultValue)
    {
        return /** @type {number} */ (this.getDefault(idConfig, defaultValue));
    }

    /**
     * getDefaultString(idConfig, defaultValue)
     *
     * @this {Device}
     * @param {string} idConfig
     * @param {string} defaultValue
     * @returns {string}
     */
    getDefaultString(idConfig, defaultValue)
    {
        return /** @type {string} */ (this.getDefault(idConfig, defaultValue));
    }

    /**
     * hasLocalStorage
     *
     * If localStorage support exists, is enabled, and works, return true.
     *
     * @this {Device}
     * @returns {boolean}
     */
    hasLocalStorage()
    {
        if (Device.LocalStorage.Available === undefined) {
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
        return !!Device.LocalStorage.Available;
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
     * isCategory(category)
     *
     * Use this function to enable/disable any code (eg, print() calls) based on 1) whether specific
     * categories are required, and 2) whether the specified category is one of them.
     *
     * @this {Device}
     * @param {string} category
     */
    isCategoryOn(category)
    {
        return (Device.Category && Device.Category.indexOf(category) >= 0);
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
     * @this {Device}
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
     * @returns {Array|null}
     */
    loadLocalStorage()
    {
        let state = null;
        if (this.hasLocalStorage()) {
            let sValue;
            if (window) {
                try {
                    sValue = window.localStorage.getItem(this.idMachine);
                    if (sValue) state = /** @type {Array} */ (JSON.parse(sValue));
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
        if (this.isCategoryOn(Device.CATEGORY.BUFFER)) {
            Device.PrintBuffer += s;
            return;
        }
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
     * @param {Array} state
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
     * setCategory(category)
     *
     * Use this function to set/clear categories.  Generally, these are thought of as print categories,
     * allowing code to use isCategoryOn() to decide whether to print a certain category of messages, but
     * it can be used to control any functionality related to a given category, not just printing.
     *
     * You usually want to use one of the predefined category strings in Device.CATEGORIES, but in reality,
     * the category string can be anything you want.
     *
     * If you want to enable multiple categories, specify them all in a single string (eg, "time|buffer",
     * or Device.CATEGORY.TIME + Device.CATEGORY.BUFFER).
     *
     * Device.CATEGORY.BUFFER is special, causing all print calls to be buffered; the print buffer will be
     * dumped as soon as setCategory() clears Device.CATEGORY.BUFFER.
     *
     * @this {Device}
     * @param {string} [category] (if undefined, clear previous category)
     * @returns {string}
     */
    setCategory(category = "")
    {
        let cPrev = Device.Category;
        let fFlush = (!category && this.isCategoryOn(Device.CATEGORY.BUFFER));
        Device.Category = category;
        if (fFlush) {
            let sBuffer = Device.PrintBuffer;
            Device.PrintBuffer = "";
            this.print(sBuffer);
        }
        return cPrev;
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
                let decode = function decodeParameter(s) {
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
    CLEAR:      "clear",
    PRINT:      "print"
};

/*
 * List of standard categories.
 *
 * Device.CATEGORY.BUFFER is special, causing all print calls to be buffered; the print buffer will be
 * dumped as soon as setCategory() clears Device.CATEGORY.BUFFER.
 */
Device.CATEGORY = {
    TIME:       "time",
    BUFFER:     "buffer"
};

Device.COMMANDS = [
    "c\tset category"
];

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
 * Category is a global string that contains zero or more Device.CATEGORY strings; see setCategory().
 *
 * @type {string}
 */
Device.Category = "";

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

/**
 * @copyright http://pcjs.org/modules/devices/input.js (C) Jeff Parsons 2012-2017
 */

/** @typedef {{ class: string, bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined), location: Array.<number>, map: (Array.<Array.<number>>|undefined), drag: (boolean|undefined), scroll: (boolean|undefined), hexagonal: (boolean|undefined), buttonDelay: (number|undefined) }} */
var InputConfig;

/**
 * @class {Input}
 * @unrestricted
 * @property {InputConfig} config
 * @property {Array.<number>} location
 * @property {Array.<Array.<number>>} map
 * @property {boolean} fDrag
 * @property {boolean} fScroll
 * @property {boolean} fHexagonal
 * @property {number} buttonDelay
 * @property {{
 *  surface: HTMLImageElement|undefined
 * }} bindings
 */
class Input extends Device {
    /**
     * Input(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "input": {
     *        "class": "Input",
     *        "location": [139, 325, 368, 478, 0.34, 0.5, 640, 853],
     *        "map": [
     *          ["2nd",  "inv",  "lnx",  "\\b",  "clr"],
     *          ["lrn",  "xchg", "sq",   "sqrt", "rcp"],
     *          ["sst",  "sto",  "rcl",  "sum",  "exp"],
     *          ["bst",  "ee",   "(",    ")",    "/"],
     *          ["gto",  "7",    "8",    "9",    "*"],
     *          ["sbr",  "4",    "5",    "6",    "-"],
     *          ["rst",  "1",    "2",    "3",    "+"],
     *          ["r/s",  "0",    ".",    "+/-",  "=|\\r"]
     *        ],
     *        "drag": false,
     *        "bindings": {
     *          "surface": "imageTI57",
     *          "power": "powerTI57",
     *          "reset": "resetTI57"
     *        }
     *      }
     *
     * A word about the "power" button: the page will likely use absolute positioning to overlay the HTML button
     * onto the image of the physical button, and the temptation might be to use the style "display:none" to hide
     * it, but "opacity:0" should be used instead, because otherwise our efforts to use it as focusable element
     * may fail.
     *
     * @this {Input}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {InputConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, Input.VERSION, config);

        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));

        this.onInput = null;
        this.onPower = null;
        this.onReset = null;
        this.onHover = null;

        /*
         * If 'drag' is true, then the onInput() handler will be called whenever the current col and/or row
         * changes, even if the mouse hasn't been released since the previous onInput() call.
         *
         * The default is false, because in general, allowing drag is a bad idea for calculator buttons.  But
         * I've made this an option for other input surfaces, like LED arrays, where you might want to turn a
         * series of LEDs on or off.
         */
        this.fDrag = this.getDefaultBoolean('drag', false);

        /*
         * If 'scroll' is true, then we do NOT call preventDefault() on touch events; this permits the input
         * surface to be scrolled like any other part of the page.  The default is false, because this has other
         * side-effects (eg, inadvertent zooms).
         */
        this.fScroll = this.getDefaultBoolean('scroll', false);

        /*
         * This is set on receipt of the first 'touch' event of any kind, and is used by the 'mouse' event
         * handlers to disregard mouse events if set.
         */
        this.fTouch = false;

        let element = this.bindings[Input.BINDING.SURFACE];
        if (element) {
            /*
             * The location array, eg:
             *
             *      "location": [139, 325, 368, 478, 0.34, 0.5, 640, 853, 180, 418, 75, 36],
             *
             * contains the top left corner (xInput, yInput) and dimensions (cxInput, cyInput)
             * of the input rectangle where the buttons described in the map are located, relative
             * to the surface image.  It also describes the average amount of horizontal and vertical
             * space between buttons, as fractions of the average button width and height (hGap, vGap).
             *
             * With all that, we can now calculate the center lines for each column and row.  This
             * obviously assumes that all the buttons are evenly laid out in a perfect grid.  For
             * devices that don't have such a nice layout, a different location array format will
             * have to be defined.
             *
             * NOTE: While element.naturalWidth and element.naturalHeight should, for all modern
             * browsers, contain the surface image's dimensions as well, those values still might not
             * be available if our constructor is called before the page's onload event has fired,
             * so we allow them to be stored in the next two elements of the location array, too.
             *
             * Finally, the position and size of the device's power button may be stored in the array
             * as well, in case some browsers refuse to generate onClickPower() events (eg, if they
             * think the button is inaccessible/not visible).
             */
            let location = this.config['location'];
            this.xInput = location[0];
            this.yInput = location[1];
            this.cxInput = location[2];
            this.cyInput = location[3];
            this.hGap = location[4] || 1.0;
            this.vGap = location[5] || 1.0;
            this.cxSurface = location[6] || element.naturalWidth || this.cxInput;
            this.cySurface = location[7] || element.naturalHeight || this.cyInput;
            this.xPower = location[8] || 0;
            this.yPower = location[9] || 0;
            this.cxPower = location[10] || 0;
            this.cyPower = location[11] || 0;
            this.map = this.config['map'];
            if (this.map) {
                this.nRows = this.map.length;
                this.nCols = this.map[0].length;
            } else {
                this.nCols = this.hGap;
                this.nRows = this.vGap;
                this.hGap = this.vGap = 0;
            }

            /*
             * If 'hexagonal' is true, then we treat the input grid as hexagonal, where even rows of the associated
             * display are offset.
             */
            this.fHexagonal = this.getDefaultBoolean('hexagonal', false);
            
            /*
             * The 'buttonDelay' setting is only necessary for devices (ie, old calculator chips) that are either slow
             * to respond and/or have debouncing logic that would otherwise be defeated.
             */
            this.buttonDelay = this.getDefaultNumber('buttonDelay', 0);

            /*
             * To calculate the average button width (cxButton), we know that the overall width
             * must equal the sum of all the button widths + the sum of all the button gaps:
             *
             *      cxInput = nCols * cxButton + nCols * (cxButton * hGap)
             *
             * The number of gaps would normally be (nCols - 1), but we require that cxInput include
             * only 1/2 the gap at the edges, too.  Solving for cxButton:
             *
             *      cxButton = cxInput / (nCols + nCols * hGap)
             */
            this.cxButton = (this.cxInput / (this.nCols + this.nCols * this.hGap))|0;
            this.cyButton = (this.cyInput / (this.nRows + this.nRows * this.vGap))|0;
            this.cxGap = (this.cxButton * this.hGap)|0;
            this.cyGap = (this.cyButton * this.vGap)|0;

            /*
             * xStart and yStart record the last 'touchstart' or 'mousedown' position on the surface
             * image; they will be reset to -1 when movement has ended (eg, 'touchend' or 'mouseup').
             */
            this.xStart = this.yStart = -1;

            this.captureMouse(element);
            this.captureTouch(element);

            if (this.time) {
                /*
                 * We use a timer for the touch/mouse release events, to ensure that the machine had
                 * enough time to notice the input before releasing it.
                 */
                let input = this;
                if (this.buttonDelay) {
                    this.timerInputRelease = this.time.addTimer("timerInputRelease", function onInputRelease() {
                        if (input.xStart < 0 && input.yStart < 0) { // auto-release ONLY if it's REALLY released
                            input.setPosition(-1, -1);
                        }
                    });
                }
                if (this.map) {
                    /*
                     * This auto-releases the last key reported after an appropriate delay, to ensure that
                     * the machine had enough time to notice the corresponding button was pressed.
                     */
                    if (this.buttonDelay) {
                        this.timerKeyRelease = this.time.addTimer("timerKeyRelease", function onKeyRelease() {
                            input.onKeyTimer();
                        });
                    }
                    /*
                     * I used to maintain a single-key buffer (this.keyPressed) and would immediately release
                     * that key as soon as another key was pressed, but it appears that the ROM wants a minimum
                     * delay between release and the next press -- probably for de-bouncing purposes.  So we
                     * maintain a key state: 0 means no key has gone down or up recently, 1 means a key just went
                     * down, and 2 means a key just went up.  keysPressed maintains a queue of keys (up to 16)
                     * received while key state is non-zero.
                     */
                    this.keyState = 0;
                    this.keysPressed = [];
                    /*
                     * I'm attaching my 'keypress' handlers to the document object, since image elements are
                     * not focusable.  I'm disinclined to do what I've done with other machines (ie, create an
                     * invisible <textarea> overlay), because in this case, I don't really want a soft keyboard
                     * popping up and obscuring part of the display.
                     *
                     * A side-effect, however, is that if the user attempts to explicitly give the image
                     * focus, we don't have anything for focus to attach to.  We address that in onMouseDown(),
                     * by redirecting focus to the "power" button, if any, not because we want that or any other
                     * button to have focus, but simply to remove focus from any other input element on the page.
                     */
                    this.captureKeys(document);
                }
            }

            /*
             * Finally, the active input state.  If there is no active input, col and row are -1.  After
             * this point, these variables will be updated by setPosition().
             */
            this.col = this.row = -1;
        }
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Input}
     * @param {string} binding
     * @param {Element} element
     */
    addBinding(binding, element)
    {
        let input = this;

        switch(binding) {

        case Input.BINDING.POWER:
            element.onclick = function onClickPower() {
                if (input.onPower) input.onPower();
            };
            break;

        case Input.BINDING.RESET:
            element.onclick = function onClickReset() {
                if (input.onReset) input.onReset();
            };
            break;
        }
        super.addBinding(binding, element);
    }

    /**
     * addClick(onPower, onReset)
     *
     * Called by the Chip device to set up power and reset notifications.
     *
     * @this {Input}
     * @param {function()} [onPower] (called when the "power" button, if any, is clicked)
     * @param {function()} [onReset] (called when the "reset" button, if any, is clicked)
     */
    addClick(onPower, onReset)
    {
        this.onPower = onPower;
        this.onReset = onReset;
    }

    /**
     * addHover(onHover)
     *
     * @this {Input}
     * @param {function(number, number)} onHover
     */
    addHover(onHover)
    {
        this.onHover = onHover;
    }

    /**
     * addInput(onInput)
     *
     * Called by the Chip device to set up input notifications.
     *
     * @this {Input}
     * @param {function(number,number)} onInput
     */
    addInput(onInput)
    {
        this.onInput = onInput;
    }

    /**
     * advanceKeyState()
     *
     * @this {Input}
     */
    advanceKeyState()
    {
        if (!this.buttonDelay) {
            this.onKeyTimer();
        } else {
            this.time.setTimer(this.timerKeyRelease, this.buttonDelay);
        }
    }

    /**
     * captureKeys(element)
     *
     * @this {Input}
     * @param {Document|HTMLElement} element
     */
    captureKeys(element)
    {
        let input = this;
        element.addEventListener(
            'keydown',
            function onKeyDown(event) {
                event = event || window.event;
                let activeElement = document.activeElement;
                if (activeElement == input.bindings[Input.BINDING.POWER]) {
                    let keyCode = event.which || event.keyCode;
                    let ch = Input.KEYCODE[keyCode];
                    if (ch && input.onKeyPress(ch)) event.preventDefault();
                }
            }
        );
        element.addEventListener(
            'keypress',
            function onKeyPress(event) {
                event = event || window.event;
                let charCode = event.which || event.charCode;
                let ch = String.fromCharCode(charCode);
                if (ch && input.onKeyPress(ch)) event.preventDefault();
            }
        );
    }

    /**
     * captureMouse(element)
     *
     * @this {Input}
     * @param {HTMLImageElement} element
     */
    captureMouse(element)
    {
        let input = this;

        element.addEventListener(
            'mousedown',
            function onMouseDown(event) {
                if (input.fTouch) return;
                /*
                 * If there are any text input elements on the page that might currently have focus,
                 * this is a good time to divert focus to a focusable element of our own (eg, a "power"
                 * button).  Otherwise, key presses could be confusingly processed in two places.
                 *
                 * Unfortunately, setting focus on an element can cause the browser to scroll the element
                 * into view, so to avoid that, we use the following scrollTo() work-around.
                 */
                let button = input.bindings[Input.BINDING.POWER];
                if (button) {
                    let x = window.scrollX, y = window.scrollY;
                    button.focus();
                    window.scrollTo(x, y);
                }
                if (!event.button) {
                    input.processEvent(element, Input.ACTION.PRESS, event);
                }
            }
        );

        element.addEventListener(
            'mousemove',
            function onMouseMove(event) {
                if (input.fTouch) return;
                input.processEvent(element, Input.ACTION.MOVE, event);
            }
        );

        element.addEventListener(
            'mouseup',
            function onMouseUp(event) {
                if (input.fTouch) return;
                if (!event.button) {
                    input.processEvent(element, Input.ACTION.RELEASE, event);
                }
            }
        );

        element.addEventListener(
            'mouseout',
            function onMouseOut(event) {
                if (input.fTouch) return;
                if (input.xStart < 0) {
                    input.processEvent(element, Input.ACTION.MOVE, event);
                } else {
                    input.processEvent(element, Input.ACTION.RELEASE, event);
                }
            }
        );
    }

    /**
     * captureTouch(element)
     *
     * @this {Input}
     * @param {HTMLImageElement} element
     */
    captureTouch(element)
    {
        let input = this;

        /*
         * NOTE: The mouse event handlers below deal only with events where the left button is involved
         * (ie, left button is pressed, down, or released).
         */
        element.addEventListener(
            'touchstart',
            function onTouchStart(event) {
                /*
                 * Under normal circumstances (ie, when fScroll is false), when any touch events arrive,
                 * processEvent() calls preventDefault(), which prevents a variety of potentially annoying
                 * behaviors (ie, zooming, scrolling, fake mouse events, etc).  Under non-normal circumstances,
                 * (ie, when fScroll is true), we set fTouch on receipt of a 'touchstart' event, which will
                 * help our mouse event handlers avoid any redundant actions due to fake mouse events.
                 */
                if (input.fScroll) input.fTouch = true;
                input.processEvent(element, Input.ACTION.PRESS, event);
            }
        );

        element.addEventListener(
            'touchmove',
            function onTouchMove(event) {
                input.processEvent(element, Input.ACTION.MOVE, event);
            }
        );

        element.addEventListener(
            'touchend',
            function onTouchEnd(event) {
                input.processEvent(element, Input.ACTION.RELEASE, event);
            }
        );
    }

    /**
     * onKeyPress(ch)
     *
     * @this {Input}
     * @param {string} ch
     * @returns {boolean} (true if processed, false if not)
     */
    onKeyPress(ch)
    {
        for (let row = 0; row < this.map.length; row++) {
            let rowMap = this.map[row];
            for (let col = 0; col < rowMap.length; col++) {
                let aParts = rowMap[col].split('|');
                if (aParts.indexOf(ch) >= 0) {
                    if (this.keyState) {
                        if (this.keysPressed.length < 16) {
                            this.keysPressed.push(ch);
                        }
                    } else {
                        this.keyState = 1;
                        this.setPosition(col, row);
                        this.advanceKeyState();
                    }
                    return true;
                }
            }
        }
        this.printf("unrecognized key '%s' (0x%02x)\n", ch, ch.charCodeAt(0));
        return false;
    }

    /**
     * onKeyTimer()
     *
     * @this {Input}
     */
    onKeyTimer()
    {

        if (this.keyState == 1) {
            this.keyState++;
            this.setPosition(-1, -1);
            this.advanceKeyState();
        } else {
            this.keyState = 0;
            if (this.keysPressed.length) {
                this.onKeyPress(this.keysPressed.shift());
            }
        }
    }

    /**
     * processEvent(element, action, event)
     *
     * @this {Input}
     * @param {HTMLImageElement} element
     * @param {number} action
     * @param {Event|MouseEvent|TouchEvent} [event] (eg, the object from a 'touch' or 'mouse' event)
     */
    processEvent(element, action, event)
    {
        let col = -1, row = -1;
        let fMultiTouch = false;
        let x, y, xInput, yInput, fButton, fInput, fPower;

        if (action < Input.ACTION.RELEASE) {

            /**
             * @name Event
             * @property {Array} targetTouches
             */
            event = event || window.event;

            if (!event.targetTouches || !event.targetTouches.length) {
                x = event.pageX;
                y = event.pageY;
            } else {
                x = event.targetTouches[0].pageX;
                y = event.targetTouches[0].pageY;
                fMultiTouch = (event.targetTouches.length > 1);
            }

            /*
             * Touch coordinates (that is, the pageX and pageY properties) are relative to the page, so to make
             * them relative to the element, we must subtract the element's left and top positions.  This Apple web page:
             *
             *      https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/AddingMouseandTouchControlstoCanvas/AddingMouseandTouchControlstoCanvas.html
             *
             * makes it sound simple, but it turns out we have to walk the element's entire "parentage" of DOM elements
             * to get the exact offsets.
             */
            let xOffset = 0;
            let yOffset = 0;
            let elementNext = element;
            do {
                if (!isNaN(elementNext.offsetLeft)) {
                    xOffset += elementNext.offsetLeft;
                    yOffset += elementNext.offsetTop;
                }
            } while ((elementNext = elementNext.offsetParent));

            /*
             * Due to the responsive nature of our pages, the displayed size of the surface image may be smaller than
             * the original size, and the coordinates we receive from events are based on the currently displayed size.
             */
            x = ((x - xOffset) * (this.cxSurface / element.offsetWidth))|0;
            y = ((y - yOffset) * (this.cySurface / element.offsetHeight))|0;

            xInput = x - this.xInput;
            yInput = y - this.yInput;

            /*
             * fInput is set if the event occurred somewhere within the input region (ie, the calculator keypad),
             * either on a button or between buttons, whereas fButton is set if the event occurred squarely (rectangularly?)
             * on a button.  fPower deals separately with the power button; it is set if the event occurred on the
             * power button.
             */
            fInput = fButton = false;
            fPower = (x >= this.xPower && x < this.xPower + this.cxPower && y >= this.yPower && y < this.yPower + this.cyPower);

            /*
             * I use the top of the input region, less some gap, to calculate a dividing line, above which
             * default actions should be allowed, and below which they should not.  Ditto for any event inside
             * the power button.
             */
            if (xInput >= 0 && xInput < this.cxInput && yInput + this.cyGap >= 0 || fPower) {
                /*
                 * If we allow touch events to be processed, they will generate mouse events as well, causing
                 * confusion and delays.  We can sidestep that problem by preventing default actions on any event
                 * that occurs within the input region.  One downside is that you can no longer scroll or zoom the
                 * image using touch, but that may be just as well, because you probably don't want sloppy touches
                 * moving your display around (or worse, a rapid double-tap zooming the display).  I do try to
                 * make one small concession for two-finger zoom operations (see fMultiTouch), but that's a bit
                 * fiddly, because it depends on both fingers hitting the surface at the same instant.
                 */
                if (!fMultiTouch && !this.fScroll) event.preventDefault();

                if (xInput >= 0 && xInput < this.cxInput && yInput >= 0 && yInput < this.cyInput) {
                    fInput = true;
                    /*
                     * The width and height of each column and row could be determined by computing cxGap + cxButton
                     * and cyGap + cyButton, respectively, but those gap and button sizes are merely estimates, and should
                     * only be used to help with the final button coordinate checks farther down.
                     */
                    let cxCol = (this.cxInput / this.nCols) | 0;
                    let cyCol = (this.cyInput / this.nRows) | 0;
                    let colInput = (xInput / cxCol) | 0;
                    let rowInput = (yInput / cyCol) | 0;

                    /*
                     * If the grid is hexagonal (aka "Lite-Brite" mode), then the cells of even-numbered rows are
                     * offset horizontally by 1/2 cell.  In addition, the last cell in those rows is unused, so if
                     * after compensating by 1/2 cell, the target column is the last cell, we set xInput to -1,
                     * effectively ignoring input on that cell.
                     */
                    if (this.fHexagonal && !(rowInput & 0x1)) {
                        xInput -= (cxCol >> 1);
                        colInput = (xInput / cxCol) | 0;
                        if (colInput == this.nCols - 1) xInput = -1;
                    }

                    /*
                     * (xCol,yCol) will be the top left corner of the button closest to the point of input.  However, that's
                     * based on our gap estimate.  If things seem "too tight", shrink the gap estimates, which will automatically
                     * increase the button size estimates.
                     */
                    let xCol = colInput * cxCol + (this.cxGap >> 1);
                    let yCol = rowInput * cyCol + (this.cyGap >> 1);

                    xInput -= xCol;
                    yInput -= yCol;
                    if (xInput >= 0 && xInput < this.cxButton && yInput >= 0 && yInput < this.cyButton) {
                        col = colInput;
                        row = rowInput;
                        fButton = true;
                    }
                }
            }
        }

        if (fMultiTouch) return;

        if (action == Input.ACTION.PRESS) {
            /*
             * Record the position of the event, transitioning xStart and yStart to non-negative values.
             */
            this.xStart = x;
            this.yStart = y;
            if (fInput) {
                /*
                 * The event occurred in the input region, so we call setPosition() regardless of whether
                 * it hit or missed a button.
                 */
                this.setPosition(col, row);
                /*
                 * On the other hand, if it DID hit a button, then we arm the auto-release timer, to ensure
                 * a minimum amount of time (ie, BUTTON_DELAY).
                 */
                if (fButton && this.buttonDelay) {
                    this.time.setTimer(this.timerInputRelease, this.buttonDelay, true);
                }
            } else if (fPower && this.onPower) {
                this.onPower();
            }
        }
        else if (action == Input.ACTION.MOVE) {
            if (this.xStart >= 0 && this.yStart >= 0 && this.fDrag) {
                this.setPosition(col, row);
            }
            else if (this.onHover) {
                this.onHover(col, row);
            }
        }
        else if (action == Input.ACTION.RELEASE) {
            /*
             * Don't immediately signal the release if the release timer is active (let the timer take care of it).
             */
            if (!this.buttonDelay || !this.time.isTimerSet(this.timerInputRelease)) {
                this.setPosition(-1, -1);
            }
            this.xStart = this.yStart = -1;
        }
        else {
            this.println("unrecognized action: " + action);
        }
    }

    /**
     * setPosition(col, row)
     *
     * @this {Input}
     * @param {number} col
     * @param {number} row
     */
    setPosition(col, row)
    {
        if (col != this.col || row != this.row) {
            this.col = col;
            this.row = row;
            if (this.onInput) this.onInput(col, row);
        }
    }
}

Input.ACTION = {
    PRESS:      1,              // eg, an action triggered by a 'mousedown' or 'touchstart' event
    MOVE:       2,              // eg, an action triggered by a 'mousemove' or 'touchmove' event
    RELEASE:    3               // eg, an action triggered by a 'mouseup' (or 'mouseout') or 'touchend' event
};

Input.BINDING = {
    POWER:      "power",
    RESET:      "reset",
    SURFACE:    "surface"
};

Input.KEYCODE = {               // keyCode from keydown/keyup events
    0x08:       "\b"            // backspace
};

Input.BUTTON_DELAY = 50;        // minimum number of milliseconds to ensure between button presses and releases

Input.VERSION   = 1.11;

/**
 * @copyright http://pcjs.org/modules/devices/led.js (C) Jeff Parsons 2012-2017
 */

/** @typedef {{ class: string, bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined), type: number, width: (number|undefined), height: (number|undefined), cols: (number|undefined), colsExtra: (number|undefined), rows: (number|undefined), rowsExtra: (number|undefined), color: (string|undefined), backgroundColor: (string|undefined), fixed: (boolean|undefined), hexagonal: (boolean|undefined), highlight: (boolean|undefined), persistent: (boolean|undefined) }} */
var LEDConfig;

/**
 * The ultimate goal is to provide support for a variety of LED types, such as:
 *
 * 1) LED Light (single light)
 * 2) LED Digit (7-segment digit)
 *
 * The initial goal is to manage a 12-element array of 7-segment LED digits for the TI-57.
 *
 * We create a "view" canvas element inside the specified "container" element, along with a "grid" canvas
 * where all the real drawing occurs; drawView() then renders the "grid" canvas onto the "view" canvas.
 *
 * Internally, our LED digits have a width and height of 96 and 128.  Those are "grid" dimensions which
 * cannot be changed, because our table of drawing coordinates in LED.SEGMENTS are hard-coded for those
 * dimensions.  The cell width and height that are specified as part of the LEDConfig are "view" dimensions,
 * which usually match the grid dimensions, but you're welcome to scale them up or down; the browser's
 * drawImage() function takes care of that.
 *
 * There is a low-level function, drawGridSegment(), for drawing specific LED segments of specific digits;
 * generally, you start with clearGrid(), draw all the segments for a given update, and then call drawView()
 * to make them visible.
 *
 * However, our Chip devices operate at a higher level.  They use setLEDState() to modify the state,
 * character, etc, that each of the LED cells should display, which updates our internal LED buffer.  Then
 * at whatever display refresh rate is set (typically 60Hz), drawBuffer() is called to see if the buffer
 * contents have been modified since the last refresh, and if so, it converts the contents of the buffer to
 * a string and calls drawString().
 *
 * This buffering strategy, combined with the buffer "tickled" flag (see below), not only makes life
 * simple for the Chip device, but also simulates how the display goes blank for short periods of time while
 * the Chip is busy performing calculations.
 *
 * @class {LED}
 * @unrestricted
 * @property {LEDConfig} config
 * @property {number} type (one of the LED.TYPE values)
 * @property {number} width (default is 96 for LED.TYPE.DIGIT, 32 otherwise; see LED.SIZES)
 * @property {number} height (default is 128 for LED.TYPE.DIGIT, 32 otherwise; see LED.SIZES)
 * @property {number} cols (default is 1)
 * @property {number} rows (default is 1)
 * @property {number} colsView (default is cols)
 * @property {number} rowsView (default is rows)
 * @property {string} color (default is none; ie, transparent foreground)
 * @property {string} colorBackground (default is none; ie, transparent background)
 * @property {boolean} fFixed (default is false, meaning the view may fill the container to its maximum size)
 * @property {boolean} fHexagonal (default is false)
 * @property {boolean} fHighlight (default is true)
 * @property {boolean} fPersistent (default is false for LED.TYPE.DIGIT, meaning the view will be blanked if not refreshed)
 * @property {number} widthView (computed)
 * @property {number} heightView (computed)
 * @property {number} widthGrid (computed)
 * @property {number} heightGrid (computed)
 * @property {HTMLCanvasElement} canvasView
 * @property {CanvasRenderingContext2D} contextView
 * @property {HTMLCanvasElement} canvasGrid
 * @property {CanvasRenderingContext2D} contextGrid
 * @property {{
 *  container: HTMLElement|undefined
 * }} bindings
 * @property {Array.<string|number>} buffer
 * @property {Array.<string|number>|null} bufferClone
 * @property {boolean} fBufferModified
 * @property {boolean} fTickled
 */
class LED extends Device {
    /**
     * LED(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "display": {
     *        "class": "LED",
     *        "type": 3,
     *        "cols": 12,
     *        "rows": 1,
     *        "color": "red",
     *        "bindings": {
     *          "container": "displayTI57"
     *        }
     *      }
     *
     * @this {LED}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {LEDConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, LED.VERSION, config);

        let container = this.bindings[LED.BINDING.CONTAINER];
        if (!container) {
            let sError = "LED binding for '" + LED.BINDING.CONTAINER + "' missing: '" + this.config.bindings[LED.BINDING.CONTAINER] + "'";
            throw new Error(sError);
        }

        let canvasView = /** @type {HTMLCanvasElement} */ (document.createElement("canvas"));
        if (!canvasView || !canvasView.getContext) {
            let sError = "LED device requires HTML5 canvas support";
            container.innerHTML = sError;
            throw new Error(sError);
        }

        this.container = container;
        this.canvasView = canvasView;

        this.type = this.getBounded(this.config['type'] || LED.TYPE.ROUND, LED.TYPE.ROUND, LED.TYPE.DIGIT);
        this.widthCell = LED.SIZES[this.type][0];
        this.heightCell = LED.SIZES[this.type][1];
        this.width = this.getDefaultNumber('width', this.widthCell);
        this.height = this.getDefaultNumber('height', this.heightCell);
        this.colsView = this.getDefaultNumber('cols',  1);
        this.cols = this.colsView + this.getDefaultNumber('colsExtra', 0);
        this.rowsView = this.getDefaultNumber('rows',  1);
        this.rows = this.rowsView + this.getDefaultNumber('rowsExtra', 0);
        this.widthView = this.width * this.colsView;
        this.heightView = this.height * this.rowsView;

        this.colorTransparent = this.getRGBAColor("black", 0);
        this.colorOn = this.getRGBColor(this.config['color']) || this.colorTransparent;
        this.colorOff = this.getRGBAColor(this.colorOn, 1.0, 0.25);
        this.colorHighlight = this.getRGBAColor(this.colorOn, 1.0, 2.0);
        this.colorBackground = this.getRGBColor(this.config['backgroundColor']);

        /*
         * We generally want our view canvas to be "responsive", not "fixed" (ie, to automatically resize
         * with changes to the overall window size), so we apply the following style attributes (formerly
         * applied with the "pcjs-canvas" style in /modules/shared/templates/components.css):
         *
         *      width: 100%;
         *      height: auto;
         *
         * But, if you really don't want that feature, then set the LED config's "fixed" property to true.
         */
        this.fFixed = this.getDefaultBoolean('fixed', false);
        if (!this.fFixed) {
            canvasView.style.width = "100%";
            canvasView.style.height = "auto";
        }

        /*
         * Hexagonal (aka "Lite-Brite" mode) and highlighting options
         */
        this.fHexagonal = this.getDefaultBoolean('hexagonal', false);
        this.fHighlight = this.getDefaultBoolean('highlight', true);

        /*
         * Persistent LEDS are the default, except for LED.TYPE.DIGIT, which is used with calculator displays
         * whose underlying hardware must constantly "refresh" the LEDs to prevent them from going dark.
         */
        this.fPersistent = this.getDefaultBoolean('persistent', (this.type < LED.TYPE.DIGIT));

        canvasView.setAttribute("width", this.widthView.toString());
        canvasView.setAttribute("height", this.heightView.toString());
        canvasView.style.backgroundColor = this.colorTransparent;
        container.appendChild(canvasView);
        this.contextView = /** @type {CanvasRenderingContext2D} */ (canvasView.getContext("2d"));

        /*
         * canvasGrid is where all LED segments are composited; then they're drawn onto canvasView.
         */
        this.canvasGrid = /** @type {HTMLCanvasElement} */ (document.createElement("canvas"));
        if (this.canvasGrid) {
            this.canvasGrid.width = this.widthGrid = this.widthCell * this.colsView;
            this.canvasGrid.height = this.heightGrid = this.heightCell * this.rowsView;
            this.contextGrid = this.canvasGrid.getContext("2d");
        }

        /*
         * Time to allocate our internal LED buffer.  Other devices access the buffer through interfaces
         * like setLEDState() and getLEDState().  The LED buffer contains four per elements per LED cell:
         *
         *      [0]:    state (eg, ON or OFF or a digit)
         *      [1]:    color
         *      [2]:    count(s) (eg, 0 to 8  4-bit counts)
         *      [3]:    flags (eg, PERIOD, MODIFIED, etc)
         *
         * The LED buffer also contains an extra (scratch) row at the end.  This extra row, along with the
         * dynamically allocated "clone" buffer, is used by the LED Controller for direct buffer manipulation;
         * see the low-level getBuffer(), getBufferClone(), and swapBuffers() interfaces.
         */
        this.nBufferInc = 4;
        this.nBufferCells = ((this.rows + 1) * this.cols) * this.nBufferInc;
        this.buffer = new Array(this.nBufferCells);
        this.bufferClone = null;
        this.nBufferSkip = (this.colsView < this.cols? (this.cols - this.colsView) * 4 : 0);

        /*
         * fBufferModified is straightforward: set to true by any setLEDState() call that actually
         * changed something in the LED buffer, set to false after every drawBuffer() call, periodic
         * or otherwise.
         *
         * fTickled is a flag which, under normal (idle) circumstances, will constantly be set to
         * true by periodic display operations that call setLEDState(); we clear it after every
         * periodic drawBuffer(), so if the machine fails to execute a setBuffer() in a timely manner,
         * we will see that fTickled hasn't been "tickled", and automatically blank the display.
         */
        this.fBufferModified = this.fTickled = false;

        /*
         * This records the location of the most recent LED buffer location updated via setLEDState(),
         * in case we want to highlight it.
         */
        this.iBufferRecent = -1;

        let led = this;
        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
        if (this.time) {
            this.time.addAnimator(function ledAnimate() {
                led.drawBuffer();
            });
        }
    }

    /**
     * clearBuffer(fDraw)
     *
     * @this {LED}
     * @param {boolean} [fDraw]
     */
    clearBuffer(fDraw)
    {
        this.initBuffer(this.buffer);
        this.fBufferModified = this.fTickled = true;
        if (fDraw) this.drawBuffer(true);
    }

    /**
     * clearGrid()
     *
     * @this {LED}
     */
    clearGrid()
    {
        if (this.colorBackground) {
            this.contextGrid.fillStyle = this.colorBackground;
            this.contextGrid.fillRect(0, 0, this.widthGrid, this.heightGrid);
        } else {
            this.contextGrid.clearRect(0, 0, this.widthGrid, this.heightGrid);
        }
    }

    /**
     * clearGridCell(col, row, xOffset)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {number} xOffset
     */
    clearGridCell(col, row, xOffset)
    {
        let xDst = col * this.widthCell + xOffset;
        let yDst = row * this.heightCell;
        if (this.colorBackground) {
            this.contextGrid.fillStyle = this.colorBackground;
            this.contextGrid.fillRect(xDst, yDst, this.widthCell, this.heightCell);
        } else {
            this.contextGrid.clearRect(xDst, yDst, this.widthCell, this.heightCell);
        }
    }

    /**
     * drawBuffer(fForced)
     *
     * This is our periodic (60Hz) redraw function; however, it can also be called synchronously
     * (eg, see clearBuffer()).  The other important periodic side-effect of this function is clearing
     * fTickled, so that if no other setLEDState() calls occur between now and the next drawBuffer(),
     * an automatic clearBuffer() will be triggered.  This simulates the normal blanking of the display
     * whenever the machine performs lengthy calculations, because for an LED display to remain lit,
     * the machine must perform a display operation ("refresh") at least 30-60 times per second.
     *
     * @this {LED}
     * @param {boolean} [fForced]
     */
    drawBuffer(fForced = false)
    {
        if (this.fBufferModified || fForced) {
            if (this.type < LED.TYPE.DIGIT) {
                this.drawGrid(fForced);
            } else {
                let s = "";
                for (let i = 0; i < this.buffer.length; i += this.nBufferInc) {
                    s += this.buffer[i] || ' ';
                    if (this.buffer[i+3] & LED.FLAGS.PERIOD) s += '.';
                }
                this.drawString(s);
            }
            this.fBufferModified = false;
            this.iBufferRecent = -1;
        }
        else if (!this.fPersistent && !this.fTickled) {
            this.clearBuffer(true);
        }
        this.fTickled = false;
    }

    /**
     * drawGrid(fForced)
     *
     * Used by drawBuffer() for LED.TYPE.ROUND and LED.TYPE.SQUARE.
     *
     * @this {LED}
     * @param {boolean} fForced
     */
    drawGrid(fForced)
    {
        if (!this.fPersistent || fForced) {
            this.clearGrid();
        }
        let i = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.colsView; col++) {
                let state = this.buffer[i];
                let color = this.buffer[i+1] || this.colorTransparent;
                let fModified = !!(this.buffer[i+3] & LED.FLAGS.MODIFIED);
                let fHighlight = (this.fHighlight && i == this.iBufferRecent);
                if (fModified || fHighlight || fForced) {
                    this.drawGridCell(state, color, col, row, fHighlight);
                    this.buffer[i+3] &= ~LED.FLAGS.MODIFIED;
                    if (fHighlight) this.buffer[i+3] |= LED.FLAGS.MODIFIED;
                }
                i += this.nBufferInc;
            }
            i += this.nBufferSkip;
        }
        this.drawView();
    }

    /**
     * drawGridCell(state, color, col, row, fHighlight)
     *
     * Used by drawGrid() for LED.TYPE.ROUND and LED.TYPE.SQUARE.
     *
     * @this {LED}
     * @param {string} state (eg, LED.STATE.ON or LED.STATE.OFF)
     * @param {string} [color]
     * @param {number} [col] (default is zero)
     * @param {number} [row] (default is zero)
     * @param {boolean} [fHighlight] (true if the cell should be highlighted; default is false)
     */
    drawGridCell(state, color, col = 0, row = 0, fHighlight = false)
    {
        let xOffset = 0;
        if (this.fHexagonal) {
            if (!(row & 0x1)) {
                xOffset = (this.widthCell >> 1);
                if (col == this.colsView - 1) return;
            }
        }

        let colorOn, colorOff;
        if (!color || color == this.colorOn) {
            colorOn = fHighlight? this.colorHighlight : this.colorOn;
            colorOff = this.colorOff;
        } else {
            colorOn = fHighlight? this.getRGBAColor(color, 1.0, 2.0) : color;
            colorOff = this.getRGBAColor(color, 1.0, 0.25);
        }

        let fTransparent = false;
        let colorCell = (state? colorOn : colorOff);
        if (colorOn == this.colorTransparent) {
            colorCell = this.colorBackground;
            fTransparent = true;
        }

        let xDst = col * this.widthCell + xOffset;
        let yDst = row * this.heightCell;

        /*
         * If this is NOT a persistent LED display, then drawGrid() will have done a preliminary clearGrid(),
         * eliminating the need to clear individual cells.  Whereas if this IS a persistent LED display, then
         * we need to clear cells on an as-drawn basis.  If we don't, there could be residual "bleed over"
         * around the edges of the shape we drew here previously.
         */
        if (this.fPersistent) {
            this.clearGridCell(col, row, xOffset);
        }

        this.contextGrid.fillStyle = colorCell;

        let coords = LED.SHAPES[this.type];
        if (coords.length == 3) {
            this.contextGrid.beginPath();
            this.contextGrid.arc(xDst + coords[0], yDst + coords[1], coords[2], 0, Math.PI * 2);
            if (fTransparent) {
                /*
                 * The following code works as well:
                 *
                 *      this.contextGrid.save();
                 *      this.contextGrid.clip();
                 *      this.contextGrid.clearRect(xDst, yDst, this.widthCell, this.heightCell);
                 *      this.contextGrid.restore();
                 *
                 * but I assume it's not as efficient.
                 */
                this.contextGrid.globalCompositeOperation = "destination-out";
                this.contextGrid.fill();
                this.contextGrid.globalCompositeOperation = "source-over";
            } else {
                this.contextGrid.fill();
            }
        } else {
            this.contextGrid.fillRect(xDst + coords[0], yDst + coords[1], coords[2], coords[3]);
        }
    }

    /**
     * drawGridSegment(seg, col, row)
     *
     * Used by drawSymbol() for LED.TYPE.DIGIT.
     *
     * @this {LED}
     * @param {string} seg (eg, "A")
     * @param {number} [col] (default is zero)
     * @param {number} [row] (default is zero)
     */
    drawGridSegment(seg, col = 0, row = 0)
    {
        let coords = LED.SEGMENTS[seg];
        if (coords) {
            let xDst = col * this.widthCell;
            let yDst = row * this.heightCell;
            this.contextGrid.fillStyle = this.colorOn;
            this.contextGrid.beginPath();
            if (coords.length == 3) {
                this.contextGrid.arc(xDst + coords[0], yDst + coords[1], coords[2], 0, Math.PI * 2);
            } else {
                for (let i = 0; i < coords.length; i += 2) {
                    if (!i) {
                        this.contextGrid.moveTo(xDst + coords[i], yDst + coords[i+1]);
                    } else {
                        this.contextGrid.lineTo(xDst + coords[i], yDst + coords[i+1]);
                    }
                }
            }
            this.contextGrid.closePath();
            this.contextGrid.fill();
        }
    }

    /**
     * drawString(s)
     *
     * Used by drawBuffer() for LED.TYPE.DIGIT.
     *
     * @this {LED}
     * @param {string} s
     */
    drawString(s)
    {
        this.clearGrid();
        for (let i = 0, col = 0, row = 0; i < s.length; i++) {
            let ch = s[i];
            if (ch == '.') {
                if (col) col--;
            }
            this.drawSymbol(ch, col, row);
            if (++col == this.colsView) {
                col = 0;
                if (++row == this.rows) {
                    break;
                }
            }
        }
        this.drawView();
    }

    /**
     * drawSymbol(symbol, col, row)
     *
     * Used by drawString() for LED.TYPE.DIGIT.
     *
     * If the symbol does not exist in LED.SYMBOL_SEGMENTS, then nothing is drawn.
     *
     * @this {LED}
     * @param {string} symbol
     * @param {number} [col] (default is zero)
     * @param {number} [row] (default is zero)
     */
    drawSymbol(symbol, col = 0, row = 0)
    {
        let segments = LED.SYMBOL_SEGMENTS[symbol];
        if (segments) {
            for (let i = 0; i < segments.length; i++) {
                this.drawGridSegment(segments[i], col, row)
            }
        }
    }

    /**
     * drawView()
     *
     * @this {LED}
     */
    drawView()
    {
        /*
         * Setting the 'globalCompositeOperation' property of a 2D context is something you rarely need to do,
         * because the default draw behavior ("source-over") is fine for most cases.  One case where it is NOT
         * fine is when we're using a transparent background color, because it doesn't copy over any transparent
         * pixels, effectively making it impossible to "turn off" any previously drawn LED segments.  To force
         * that behavior, we must select the "copy" behavior.
         *
         * Refer to: https://www.w3.org/TR/2dcontext/#dom-context-2d-globalcompositeoperation
         */
        this.contextView.globalCompositeOperation = (this.colorBackground && !this.fPersistent)? "source-over" : "copy";
        this.contextView.drawImage(this.canvasGrid, 0, 0, this.widthGrid, this.heightGrid, 0, 0, this.widthView, this.heightView);
    }

    /**
     * getBuffer()
     *
     * @this {LED}
     * @returns {Array}
     */
    getBuffer()
    {
        return this.buffer;
    }

    /**
     * getBufferClone()
     *
     * @this {LED}
     * @returns {Array}
     */
    getBufferClone()
    {
        if (!this.bufferClone) {
            this.bufferClone = new Array(this.nBufferCells);
            this.initBuffer(this.bufferClone);
        }
        return this.bufferClone;
    }

    /**
     * getLEDColor(col, row)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @returns {string}
     */
    getLEDColor(col, row)
    {
        let i = (row * this.cols + col) * this.nBufferInc;
        return this.buffer[i+1] || this.colorTransparent;
    }

    /**
     * getLEDColorValues(col, row, rgb)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {Array.<number>} rgb
     * @returns {boolean}
     */
    getLEDColorValues(col, row, rgb)
    {
        let i = (row * this.cols + col) * this.nBufferInc;
        return this.parseRGBValues(this.buffer[i+1] || this.colorTransparent, rgb);
    }

    /**
     * getLEDCounts(col, row, counts)
     *
     * This function returns success (true) ONLY for cells that are not transparent.
     *
     * For a typical "Lite-Brite" grid, transparent cells are considered "empty", so we want to
     * ignore them.
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {Array.<number>} counts
     * @returns {boolean}
     */
    getLEDCounts(col, row, counts)
    {
        let fSuccess = false;
        let i = (row * this.cols + col) * this.nBufferInc;
        if (i <= this.buffer.length - this.nBufferInc && this.buffer[i+1]) {
            fSuccess = true;
            let bits = this.buffer[i+2];
            for (let c = counts.length - 1; c >= 0; c--) {
                counts[c] = bits & 0xf;
                bits >>>= 4;
            }
        }
        return fSuccess;
    }

    /**
     * getLEDCountsPacked(col, row)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @returns {number}
     */
    getLEDCountsPacked(col, row)
    {
        let i = (row * this.cols + col) * this.nBufferInc;
        return (i <= this.buffer.length - this.nBufferInc)? this.buffer[i+2] : 0;
    }

    /**
     * getLEDState(col, row)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @returns {number|undefined}
     */
    getLEDState(col, row)
    {
        let state;
        let i = (row * this.cols + col) * this.nBufferInc;

        if (i >= 0 && i <= this.buffer.length - this.nBufferInc) {
            state = this.buffer[i];
        }
        return state;
    }

    /**
     * getDefaultColor()
     *
     * @this {LED}
     * @returns {string}
     */
    getDefaultColor()
    {
        return this.colorOn;
    }

    /**
     * getRGBColor(color, colorDefault)
     *
     * Returns a color string in the "hex" format that fillStyle recognizes (eg, "#rrggbb").
     *
     * The default is optional, allowing an undefined color to remain undefined if we want to use
     * that to signal transparency (as in the case of colorBackground).
     *
     * @this {LED}
     * @param {string|undefined} color
     * @param {string} [colorDefault]
     * @returns {string|undefined}
     */
    getRGBColor(color, colorDefault)
    {
        color = color || colorDefault;
        return color && LED.COLORS[color] || color;
    }

    /**
     * getRGBColorString(rgb)
     *
     * Returns a color string fillStyle recognizes (ie, "#rrggbb", or "rgba(r,g,b,a)" if an alpha value
     * less than 1 is set).
     *
     * TODO: Cache frequently requested colors.
     * 
     * @this {LED}
     * @param {Array.<number>} rgb
     * @returns {string}
     */
    getRGBColorString(rgb)
    {
        let s;
        if (rgb.length < 4 || rgb[3] == 1) {
            s = this.sprintf("#%02x%02x%02x", rgb[0], rgb[1], rgb[2]);
        } else {
            s = this.sprintf("rgba(%d,%d,%d,%d)", rgb[0], rgb[1], rgb[2], rgb[3]);
        }
        return s;
    }

    /**
     * getRGBAColor(color, alpha, brightness)
     *
     * Returns a color string in the "rgba" format that fillStyle recognizes (eg, "rgba(255, 255, 255, 0)").
     *
     * I used to use "alpha" to adjust the brightness, but it's safer to use the "brightness" parameter,
     * which simply scales all the RGB values.  That's because if any shapes are redrawn using a fillStyle
     * with alpha < 1.0, the target alpha values will be added instead of replaced, resulting in progressively
     * brighter shapes; probably not what you want.
     *
     * @this {LED}
     * @param {string} color
     * @param {number} [alpha]
     * @param {number} [brightness]
     * @returns {string}
     */
    getRGBAColor(color, alpha = 1.0, brightness = 1.0)
    {
        if (color) {
            let rgb = [];
            color = LED.COLORS[color] || color;
            if (this.parseRGBValues(color, rgb)) {
                color = "rgba(";
                let i;
                for (i = 0; i < 3; i++) {
                    let n = Math.round(rgb[i] * brightness);
                    n = (n < 0? 0 : (n > 255? 255 : n));
                    color += n + ",";
                }
                color += (i < rgb.length? rgb[i] : alpha) + ")";
            }
        }
        return color;
    }

    /**
     * initBuffer(buffer)
     *
     * @this {LED}
     * @param buffer
     */
    initBuffer(buffer)
    {
        for (let i = 0; i < buffer.length; i += this.nBufferInc) {
            if (this.type < LED.TYPE.DIGIT) {
                buffer[i] = LED.STATE.OFF;
            } else {
                buffer[i] = ' ';
            }
            buffer[i+1] = (this.colorOn == this.colorTransparent? null : this.colorOn);
            buffer[i+2] = 0;
            buffer[i+3] = LED.FLAGS.MODIFIED;
        }
    }

    /**
     * loadState(state)
     *
     * If any saved values don't match (possibly overridden), abandon the given state and return false.
     *
     * @this {LED}
     * @param {Array} state
     * @returns {boolean}
     */
    loadState(state)
    {
        let colorOn = state.shift();
        let colorBackground = state.shift();
        let buffer = state.shift();
        if (colorOn == this.colorOn && colorBackground == this.colorBackground && buffer && buffer.length == this.buffer.length) {
            this.buffer = buffer;
            /*
             * Loop over all the buffer colors to fix a legacy problem (ie, before we started storing null for colorTransparent)
             */
            for (let i = 0; i <= this.buffer.length - this.nBufferInc; i += this.nBufferInc) {
                if (this.buffer[i+1] == this.colorTransparent) this.buffer[i+1] = null;
            }
            this.drawBuffer(true);
            return true;
        }
        return false;
    }

    /**
     * parseRGBValues(color, rgb)
     *
     * @this {LED}
     * @param {string} color
     * @param {Array.<number>} rgb
     * @returns {boolean}
     */
    parseRGBValues(color, rgb)
    {
        let base = 16;
        let match = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        if (!match) {
            base = 10;
            match = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*(\d+|)\)$/i);
        }
        if (match) {
            let i;
            for (i = 1; i < match.length; i++) {
                rgb[i-1] = Number.parseInt(match[i], base);
            }
            rgb.length = i-1;
            return true;
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * @this {LED}
     * @param {Array} state
     */
    saveState(state)
    {
        if (this.buffer) {
            state.push(this.colorOn);
            state.push(this.colorBackground);
            state.push(this.buffer);
        }
    }

    /**
     * setContainerStyle(sAttr, sValue)
     * 
     * @this {LED}
     * @param {string} sAttr 
     * @param {string} sValue 
     */
    setContainerStyle(sAttr, sValue)
    {
        if (this.container) this.container.style[sAttr] = sValue;
    }
    
    /**
     * setLEDColor(col, row, color)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {string} [color]
     * @returns {boolean|null} (true if this call modified the LED color, false if not, null if error)
     */
    setLEDColor(col, row, color)
    {
        let fModified = null;
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            fModified = false;
            let colorNew = color || this.colorOn;
            if (colorNew == this.colorTransparent) colorNew = null;
            let i = (row * this.cols + col) * this.nBufferInc;
            if (this.buffer[i+1] !== colorNew) {
                this.buffer[i+1] = colorNew;
                if (!colorNew) this.buffer[i] = LED.STATE.OFF;  // transparent LEDs are automatically turned off
                this.buffer[i+3] |= LED.FLAGS.MODIFIED;
                this.fBufferModified = fModified = true;
            }
            this.iBufferRecent = i;
            this.fTickled = true;
        }
        return fModified;
    }

    /**
     * setLEDCounts(col, row, counts)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {Array.<number>} counts
     * @returns {boolean|null} (true if this call modified the LED color, false if not, null if error)
     */
    setLEDCounts(col, row, counts)
    {
        let fModified = null;
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            fModified = false;
            let i = (row * this.cols + col) * this.nBufferInc;
            let bits = 0;
            if (this.buffer[i+1]) {                             // only non-transparent LEDs are allowed to set counters
                for (let c = 0; c < counts.length; c++) {
                    bits = (bits << 4) | (counts[c] & 0xf);
                }
            }
            if (this.buffer[i+2] !== bits) {
                this.buffer[i+2] = bits;
                this.buffer[i+3] |= LED.FLAGS.MODIFIED;
                this.fBufferModified = fModified = true;
            }
            this.iBufferRecent = i;
            this.fTickled = true;
        }
        return fModified;
    }

    /**
     * setLEDCountsPacked(col, row, counts)
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {number} counts
     * @returns {boolean|null} (true if this call modified the LED state, false if not, null if error)
     */
    setLEDCountsPacked(col, row, counts)
    {
        let i = (row * this.cols + col) * this.nBufferInc;
        if (i <= this.buffer.length - this.nBufferInc) {
            if (this.buffer[i+2] != counts) {
                this.buffer[i+2] = counts;
                return true;
            }
            return false;
        }
        return null;
    }

    /**
     * setLEDState(col, row, state, flags)
     *
     * For LED.TYPE.ROUND or LED.TYPE.SQUARE, the state parameter should be LED.STATE.OFF or LED.STATE.ON.
     *
     * @this {LED}
     * @param {number} col
     * @param {number} row
     * @param {string|number} state (new state for the specified cell)
     * @param {number} [flags] (may only be zero or more of the bits in LED.FLAGS.SET)
     * @returns {boolean|null} (true if this call modified the LED state, false if not, null if error)
     */
    setLEDState(col, row, state, flags = 0)
    {
        let fModified = null;

        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            fModified = false;
            let i = (row * this.cols + col) * this.nBufferInc;
            if (this.buffer[i] !== state || (this.buffer[i+3] & LED.FLAGS.SET) !== flags) {
                this.buffer[i] = state;
                this.buffer[i+3] = (this.buffer[i+3] & ~LED.FLAGS.SET) | flags | LED.FLAGS.MODIFIED;
                this.fBufferModified = fModified = true;
            }
            this.iBufferRecent = i;
            this.fTickled = true;
        }
        return fModified;
    }

    /**
     * swapBuffers()
     *
     * @this {LED}
     */
    swapBuffers()
    {
        let buffer = this.buffer;
        this.buffer = this.bufferClone;
        this.bufferClone = buffer;
        this.fBufferModified = true;
    }
}

LED.TYPE = {
    ROUND:      1,      // a single (round) LED
    SQUARE:     2,      // a single (square) LED
    DIGIT:      3       // a 7-segment (digit) LED, with a period as an 8th segment
};

LED.BINDING = {
    CONTAINER:  "container"
};

LED.COLORS = {
    "aliceblue":            "#f0f8ff",
    "antiquewhite":         "#faebd7",
    "aqua":                 "#00ffff",
    "aquamarine":           "#7fffd4",
    "azure":                "#f0ffff",
    "beige":                "#f5f5dc",
    "bisque":               "#ffe4c4",
    "black":                "#000000",
    "blanchedalmond":       "#ffebcd",
    "blue":                 "#0000ff",
    "blueviolet":           "#8a2be2",
    "brown":                "#a52a2a",
    "burlywood":            "#deb887",
    "cadetblue":            "#5f9ea0",
    "chartreuse":           "#7fff00",
    "chocolate":            "#d2691e",
    "coral":                "#ff7f50",
    "cornflowerblue":       "#6495ed",
    "cornsilk":             "#fff8dc",
    "crimson":              "#dc143c",
    "cyan":                 "#00ffff",
    "darkblue":             "#00008b",
    "darkcyan":             "#008b8b",
    "darkgoldenrod":        "#b8860b",
    "darkgray":             "#a9a9a9",
    "darkgreen":            "#006400",
    "darkkhaki":            "#bdb76b",
    "darkmagenta":          "#8b008b",
    "darkolivegreen":       "#556b2f",
    "darkorange":           "#ff8c00",
    "darkorchid":           "#9932cc",
    "darkred":              "#8b0000",
    "darksalmon":           "#e9967a",
    "darkseagreen":         "#8fbc8f",
    "darkslateblue":        "#483d8b",
    "darkslategray":        "#2f4f4f",
    "darkturquoise":        "#00ced1",
    "darkviolet":           "#9400d3",
    "deeppink":             "#ff1493",
    "deepskyblue":          "#00bfff",
    "dimgray":              "#696969",
    "dodgerblue":           "#1e90ff",
    "firebrick":            "#b22222",
    "floralwhite":          "#fffaf0",
    "forestgreen":          "#228b22",
    "fuchsia":              "#ff00ff",
    "gainsboro":            "#dcdcdc",
    "ghostwhite":           "#f8f8ff",
    "gold":                 "#ffd700",
    "goldenrod":            "#daa520",
    "gray":                 "#808080",
    "green":                "#008000",
    "greenyellow":          "#adff2f",
    "honeydew":             "#f0fff0",
    "hotpink":              "#ff69b4",
    "indianred ":           "#cd5c5c",
    "indigo":               "#4b0082",
    "ivory":                "#fffff0",
    "khaki":                "#f0e68c",
    "lavender":             "#e6e6fa",
    "lavenderblush":        "#fff0f5",
    "lawngreen":            "#7cfc00",
    "lemonchiffon":         "#fffacd",
    "lightblue":            "#add8e6",
    "lightcoral":           "#f08080",
    "lightcyan":            "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgrey":            "#d3d3d3",
    "lightgreen":           "#90ee90",
    "lightpink":            "#ffb6c1",
    "lightsalmon":          "#ffa07a",
    "lightseagreen":        "#20b2aa",
    "lightskyblue":         "#87cefa",
    "lightslategray":       "#778899",
    "lightsteelblue":       "#b0c4de",
    "lightyellow":          "#ffffe0",
    "lime":                 "#00ff00",
    "limegreen":            "#32cd32",
    "linen":                "#faf0e6",
    "magenta":              "#ff00ff",
    "maroon":               "#800000",
    "mediumaquamarine":     "#66cdaa",
    "mediumblue":           "#0000cd",
    "mediumorchid":         "#ba55d3",
    "mediumpurple":         "#9370d8",
    "mediumseagreen":       "#3cb371",
    "mediumslateblue":      "#7b68ee",
    "mediumspringgreen":    "#00fa9a",
    "mediumturquoise":      "#48d1cc",
    "mediumvioletred":      "#c71585",
    "midnightblue":         "#191970",
    "mintcream":            "#f5fffa",
    "mistyrose":            "#ffe4e1",
    "moccasin":             "#ffe4b5",
    "navajowhite":          "#ffdead",
    "navy":                 "#000080",
    "oldlace":              "#fdf5e6",
    "olive":                "#808000",
    "olivedrab":            "#6b8e23",
    "orange":               "#ffa500",
    "orangered":            "#ff4500",
    "orchid":               "#da70d6",
    "palegoldenrod":        "#eee8aa",
    "palegreen":            "#98fb98",
    "paleturquoise":        "#afeeee",
    "palevioletred":        "#d87093",
    "papayawhip":           "#ffefd5",
    "peachpuff":            "#ffdab9",
    "peru":                 "#cd853f",
    "pink":                 "#ffc0cb",
    "plum":                 "#dda0dd",
    "powderblue":           "#b0e0e6",
    "purple":               "#800080",
    "rebeccapurple":        "#663399",
    "red":                  "#ff0000",
    "rosybrown":            "#bc8f8f",
    "royalblue":            "#4169e1",
    "saddlebrown":          "#8b4513",
    "salmon":               "#fa8072",
    "sandybrown":           "#f4a460",
    "seagreen":             "#2e8b57",
    "seashell":             "#fff5ee",
    "sienna":               "#a0522d",
    "silver":               "#c0c0c0",
    "skyblue":              "#87ceeb",
    "slateblue":            "#6a5acd",
    "slategray":            "#708090",
    "snow":                 "#fffafa",
    "springgreen":          "#00ff7f",
    "steelblue":            "#4682b4",
    "tan":                  "#d2b48c",
    "teal":                 "#008080",
    "thistle":              "#d8bfd8",
    "tomato":               "#ff6347",
    "turquoise":            "#40e0d0",
    "violet":               "#ee82ee",
    "wheat":                "#f5deb3",
    "white":                "#ffffff",
    "whitesmoke":           "#f5f5f5",
    "yellow":               "#ffff00",
    "yellowgreen":          "#9acd32"
};

LED.STATE = {
    OFF:        0,
    ON:         1
};

LED.FLAGS = {
    NONE:       0x00,
    SET:        0x81,
    PERIOD:     0x01,
    MODIFIED:   0x80,
};

LED.SHAPES = {
    [LED.TYPE.ROUND]:   [16, 16, 14],
    [LED.TYPE.SQUARE]:  [2, 2, 28, 28]
};

LED.SIZES = [
    [],
    [32,  32],          // LED.TYPE.ROUND
    [32,  32],          // LED.TYPE.SQUARE
    [96, 128]           // LED.TYPE.DIGIT
];

/*
 * The segments are arranged roughly as follows, in a 96x128 grid:
 *
 *      AAAA
 *     F    B
 *     F    B
 *      GGGG
 *     E    C
 *     E    C
 *      DDDD P
 *
 * The following arrays specify pairs of moveTo()/lineTo() coordinates, used by drawGridSegment().  They all
 * assume the hard-coded width and height in LED.SIZES[LED.TYPE.DIGIT] specified above.  If there is a triplet
 * instead of one or more pairs (eg, the 'P' or period segment), then the coordinates are treated as arc()
 * parameters.
 */
LED.SEGMENTS = {
    'A':        [30,   8,  79,   8,  67,  19,  37,  19],
    'B':        [83,  10,  77,  52,  67,  46,  70,  22],
    'C':        [77,  59,  71, 100,  61,  89,  64,  64],
    'D':        [28,  91,  58,  91,  69, 104,  15, 104],
    'E':        [18,  59,  28,  64,  25,  88,  12, 100],
    'F':        [24,  10,  34,  21,  31,  47,  18,  52],
    'G':        [24,  56,  34,  50,  60,  50,  71,  56,  61,  61,  33,  61],
    'P':        [80, 102,  8]
};

/*
 * Segmented symbols are formed with the following segments.
 */
LED.SYMBOL_SEGMENTS = {
    ' ':        [],
    '0':        ['A','B','C','D','E','F'],
    '1':        ['B','C'],
    '2':        ['A','B','D','E','G'],
    '3':        ['A','B','C','D','G'],
    '4':        ['B','C','F','G'],
    '5':        ['A','C','D','F','G'],
    '6':        ['A','C','D','E','F','G'],
    '7':        ['A','B','C'],
    '8':        ['A','B','C','D','E','F','G'],
    '9':        ['A','B','C','D','F','G'],
    '-':        ['G'],
    'E':        ['A','D','E','F','G'],
    '.':        ['P']
};

LED.VERSION     = 1.11;

/**
 * @copyright http://pcjs.org/modules/devices/rom.js (C) Jeff Parsons 2012-2017
 */

/** @typedef {{ class: string, bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined), wordSize: number, valueSize: number, valueTotal: number, littleEndian: boolean, file: string, reference: string, chipID: string, revision: (number|undefined), colorROM: (string|undefined), backgroundColorROM: (string|undefined), values: Array.<number> }} */
var ROMConfig;

/**
 * @class {ROM}
 * @unrestricted
 * @property {ROMConfig} config
 * @property {Array.<number>} data
 * @property {number} addrMask
 */
class ROM extends Device {
    /**
     * ROM(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "rom": {
     *        "class": "ROM",
     *        "wordSize": 13,
     *        "valueSize": 16,
     *        "valueTotal": 2048,
     *        "littleEndian": true,
     *        "file": "ti57le.bin",
     *        "reference": "",
     *        "chipID": "TMC1501NC DI 7741",
     *        "revision": "0",
     *        "bindings": {
     *          "array": "romArrayTI57",
     *          "cellDesc": "romCellTI57"
     *        },
     *        "overrides": ["colorROM","backgroundColorROM"],
     *        "values": [
     *          ...
     *        ]
     *      }
     *
     * @this {ROM}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {ROMConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, ROM.VERSION, config);

        this.data = config['values'];

        /*
         * This addrMask calculation assumes that the data array length is a power-of-two (which we assert).
         */
        this.addrMask = this.data.length - 1;


        /*
         * If an "array" binding has been supplied, then create an LED array sufficiently large to represent the
         * entire ROM.  If the power-of-two is odd, then we will favor a slightly wider array over a taller one,
         * by virtue of using Math.ceil() for cols and Math.floor() for rows.
         */
        if (this.bindings[ROM.BINDING.ARRAY]) {
            let rom = this;
            let addrLines = Math.log2(this.data.length) / 2;
            this.cols = Math.pow(2, Math.ceil(addrLines));
            this.rows = Math.pow(2, Math.floor(addrLines));
            let configLEDs = {
                "class":            "LED",
                "bindings":         {"container": this.getBindingID(ROM.BINDING.ARRAY)},
                "type":             LED.TYPE.ROUND,
                "cols":             this.cols,
                "rows":             this.rows,
                "color":            this.getDefaultString('colorROM', "green"),
                "backgroundColor":  this.getDefaultString('backgroundColorROM', "black"),
                "persistent":       true
            };
            this.ledArray = new LED(idMachine, idDevice + "LEDs", configLEDs);
            this.clearArray();
            let configInput = {
                "class":        "Input",
                "location":     [0, 0, this.ledArray.widthView, this.ledArray.heightView, this.cols, this.rows],
                "bindings":     {"surface": this.getBindingID(ROM.BINDING.ARRAY)}
            };
            this.ledInput = new Input(idMachine, idDevice + "Input", configInput);
            this.sCellDesc = this.getBindingText(ROM.BINDING.CELLDESC);
            this.ledInput.addHover(function onROMHover(col, row) {
                if (rom.chip) {
                    let sDesc = rom.sCellDesc;
                    if (col >= 0 && row >= 0) {
                        let addr = row * rom.cols + col;

                        let opCode = rom.data[addr];
                        sDesc = rom.chip.disassemble(opCode, addr);
                    }
                    rom.setBindingText(ROM.BINDING.CELLDESC, sDesc);
                }
            });
        }
    }

    /**
     * clearArray()
     *
     * clearBuffer(true) performs a combination of clearBuffer() and drawBuffer().
     *
     * @this {ROM}
     */
    clearArray()
    {
        if (this.ledArray) this.ledArray.clearBuffer(true);
    }

    /**
     * drawArray()
     *
     * This performs a simple drawBuffer(); intended for synchronous updates (eg, step operations);
     * otherwise, you should allow the LED object's async animation handler take care of drawing updates.
     *
     * @this {ROM}
     */
    drawArray()
    {
        if (this.ledArray) this.ledArray.drawBuffer();
    }

    /**
     * getData(addr, fInternal)
     *
     * Set fInternal to true if an internal caller (eg, the disassembler) is accessing the ROM, to avoid touching
     * the ledArray.
     *
     * @this {ROM}
     * @param {number} addr
     * @param {boolean} [fInternal]
     * @returns {number|undefined}
     */
    getData(addr, fInternal)
    {
        if (this.ledArray && !fInternal) {
            this.ledArray.setLEDState(addr % this.cols, (addr / this.cols)|0, LED.STATE.ON, LED.FLAGS.MODIFIED);
        }
        return this.data[addr];
    }

    /**
     * loadState(state)
     *
     * If any saved values don't match (presumably overridden), abandon the given state and return false.
     * 
     * @this {ROM}
     * @param {Array} state
     * @returns {boolean}
     */
    loadState(state)
    {
        let buffer = state.shift();
        if (buffer && this.ledArray) {

            if (this.ledArray.buffer.length == buffer.length) {
                this.ledArray.buffer = buffer;
                this.ledArray.drawBuffer(true);
                return true;
            }
        }
        return false;
    }

    /**
     * saveState(state)
     *
     * @this {ROM}
     * @param {Array} state
     */
    saveState(state)
    {
        if (this.ledArray) {
            state.push(this.ledArray.buffer);
        }
    }

    /**
     * setChip()
     *
     * @this {ROM}
     * @param {Chip} chip
     */
    setChip(chip)
    {
        this.chip = chip;
    }
}

ROM.BINDING = {
    ARRAY:      "array",
    CELLDESC:   "cellDesc"
};

ROM.VERSION     = 1.11;

/**
 * @copyright http://pcjs.org/modules/devices/time.js (C) Jeff Parsons 2012-2017
 */

/** @typedef {{ id: string, callBack: function(), msAuto: number, nCyclesLeft: number }} */
var Timer;

/** @typedef {{ class: string, bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined), cyclesMinimum: (number|undefined), cyclesMaximum: (number|undefined), cyclesPerSecond: (number|undefined), yieldsPerSecond: (number|undefined), yieldsPerUpdate: (number|undefined), requestAnimationFrame: (boolean|undefined), clockByFrame: boolean }} */
var TimeConfig;

/**
 * @class {Time}
 * @unrestricted
 * @property {TimeConfig} config
 * @property {number} nCyclesMinimum
 * @property {number} nCyclesMaximum
 * @property {number} nCyclesPerSecond
 * @property {number} nYieldsPerSecond
 * @property {number} nYieldsPerUpdate
 * @property {boolean} fClockByFrame
 */
class Time extends Device {
    /**
     * Time(idMachine, idDevice, config)
     *
     * Sample config:
     *
     *      "clock": {
     *        "class": "Time",
     *        "cyclesPerSecond": 650000,
     *        "clockByFrame": true,
     *        "bindings": {
     *          "run": "runTI57",
     *          "speed": "speedTI57",
     *          "step": "stepTI57"
     *        },
     *        "overrides": ["cyclesPerSecond","yieldsPerSecond","yieldsPerUpdate"]
     *      }
     *
     * @this {Time}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {TimeConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, Time.VERSION, config);

        /*
         * NOTE: The default speed of 650,000Hz (0.65Mhz) was a crude approximation based on real world TI-57
         * device timings.  I had originally assumed the speed as 1,600,000Hz (1.6Mhz), based on timing information
         * in TI's patents, but in hindsight, that speed seems rather high for a mid-1970's device, and reality
         * suggests it was much lower.  The TMS-1500 does burn through a lot of cycles (minimum of 128) per instruction,
         * but either that cycle burn was much higher, or the underlying clock speed was much lower.  I assume the latter.
         */
        this.nCyclesMinimum = this.getDefaultNumber('cyclesMinimum', 100000);
        this.nCyclesMaximum = this.getDefaultNumber('cyclesMaximum', 3000000);
        this.nCyclesPerSecond = this.getBounded(this.getDefaultNumber('cyclesPerSecond', 650000), this.nCyclesMinimum, this.nCyclesMaximum);
        this.nYieldsPerSecond = this.getBounded(this.getDefaultNumber('yieldsPerSecond', Time.YIELDS_PER_SECOND), 30, 120);
        this.nYieldsPerUpdate = this.getBounded(this.getDefaultNumber('yieldsPerUpdate', Time.YIELDS_PER_UPDATE), 1, this.nYieldsPerSecond);
        this.fClockByFrame = this.getDefaultBoolean('clockByFrame', true);
        this.fRequestAnimationFrame = this.fClockByFrame || this.getDefaultBoolean('requestAnimationFrame', true);

        this.nBaseMultiplier = this.nCurrentMultiplier = this.nTargetMultiplier = 1;
        this.mhzBase = (this.nCyclesPerSecond / 10000) / 100;
        this.mhzCurrent = this.mhzTarget = this.mhzBase * this.nTargetMultiplier;
        this.nYields = 0;
        this.msYield = Math.round(1000 / this.nYieldsPerSecond);
        this.aAnimators = [];
        this.aClockers = [];
        this.aTimers = [];
        this.aUpdaters = [];
        this.fRunning = this.fYield = this.fThrottling = false;
        this.nStepping = 0;
        this.idRunTimeout = this.idStepTimeout = 0;
        this.onRunTimeout = this.run.bind(this);
        this.onAnimationFrame = this.animate.bind(this);
        this.requestAnimationFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.setTimeout).bind(window);

        if (!this.fClockByFrame) {
            let time = this;
            this.timerYield = this.addTimer("timerYield", function onYield() {
                time.onYield();
            }, this.msYield);
        }
        this.resetSpeed();
    }

    /**
     * addAnimator(callBack)
     *
     * Animators are functions that used to be called with YIELDS_PER_SECOND frequency, when animate()
     * was called on every onYield() call, but now we rely on requestAnimationFrame(), so the frequency
     * is browser-dependent (but presumably at least 60Hz).
     *
     * @this {Time}
     * @param {function()} callBack
     */
    addAnimator(callBack)
    {
        this.aAnimators.push(callBack);
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Time}
     * @param {string} binding
     * @param {Element} element
     */
    addBinding(binding, element)
    {
        let time = this;

        switch(binding) {

        case Time.BINDING.RUN:
            element.onclick = function onClickRun() {
                time.onRun();
            };
            break;

        case Time.BINDING.STEP:
            element.onclick = function onClickStep() {
                time.onStep();
            };
            break;

        case Time.BINDING.THROTTLE:
            let elementInput = /** @type {HTMLInputElement} */ (element);
            elementInput.addEventListener("mousedown", function onThrottleStart() {
                time.fThrottling = true;
            });
            elementInput.addEventListener("mouseup", function onThrottleStop() {
                time.setSpeedThrottle();
                time.fThrottling = false;
            });
            elementInput.addEventListener("mousemove", function onThrottleChange() {
                if (time.fThrottling) {
                    time.setSpeedThrottle();
                }
            });
            elementInput.addEventListener("change", function onThrottleChange() {
                time.fThrottling = true;
                time.setSpeedThrottle();
                time.fThrottling = false;
            });
            break;
        }
        super.addBinding(binding, element);
    }

    /**
     * addClocker(callBack)
     *
     * Adds a clocker function that's called from doBurst() to process a specified number of cycles.
     *
     * @this {Time}
     * @param {function(number)} callBack
     */
    addClocker(callBack)
    {
        this.aClockers.push(callBack);
    }

    /**
     * addTimer(id, callBack, msAuto)
     *
     * Devices that want to have timers that fire after some number of milliseconds call addTimer() to create
     * the timer, and then setTimer() when they want to arm it.  Alternatively, they can specify an automatic
     * timeout value (in milliseconds) to have the timer fire automatically at regular intervals.  There is
     * currently no removeTimer() because these are generally used for the entire lifetime of a device.
     *
     * A timer is initially dormant; dormant timers have a cycle count of -1 (although any negative number will
     * suffice) and active timers have a non-negative cycle count.
     *
     * @this {Time}
     * @param {string} id
     * @param {function()} callBack
     * @param {number} [msAuto] (if set, enables automatic setTimer calls)
     * @returns {number} timer index (1-based)
     */
    addTimer(id, callBack, msAuto = -1)
    {
        let nCyclesLeft = -1;
        let iTimer = this.aTimers.length + 1;
        this.aTimers.push({id, callBack, msAuto, nCyclesLeft});
        if (msAuto >= 0) this.setTimer(iTimer, msAuto);
        return iTimer;
    }

    /**
     * addUpdater(callBack)
     *
     * Adds a status update function that's called from updateStatus(), either as the result
     * of periodic status updates from onYield(), single-step updates from step(), or transitional
     * updates from start() and stop().
     *
     * @this {Time}
     * @param {function(boolean)} callBack
     */
    addUpdater(callBack)
    {
        this.aUpdaters.push(callBack);
    }

    /**
     * animate()
     *
     * This is the callback function we supply to requestAnimationFrame().  The callback has a single
     * (DOMHighResTimeStamp) argument, which indicates the current time (returned from performance.now())
     * for when requestAnimationFrame() starts to fire callbacks.
     *
     * See: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
     *
     * @this {Time}
     * @param {number} [t]
     */
    animate(t)
    {
        if (this.fClockByFrame) {
            /*
             * Mimic the logic in run()
             */
            if (!this.fRunning) return;
            this.snapStart();
            try {
                this.fYield = false;
                do {
                    /*
                    * Execute the burst and then update all timers.
                    */
                    this.updateTimers(this.endBurst(this.doBurst(this.getCyclesPerFrame())));
                } while (this.fRunning && !this.fYield);
            }
            catch(err) {
                this.println(err.message);
                this.stop();
                return;
            }
            this.snapStop();
        }
        for (let i = 0; i < this.aAnimators.length; i++) {
            this.aAnimators[i]();
        }
        if (this.fRunning && this.fRequestAnimationFrame) this.requestAnimationFrame(this.onAnimationFrame);
    }

    /**
     * calcCycles()
     *
     * Calculate the maximum number of cycles we should attempt to process before the next yield.
     *
     * @this {Time}
     */
    calcCycles()
    {
        let nMultiplier = this.mhzCurrent / this.mhzBase;
        if (!nMultiplier || nMultiplier > this.nTargetMultiplier) {
            nMultiplier = this.nTargetMultiplier;
        }
        /*
         * nCyclesPerYield is now allowed to be a fractional number, so that for machines configured
         * to run at an extremely slow speed (eg, less than 60Hz), a fractional value here will signal
         * to snapStop() that it should increase msYield to a proportionally higher value.
         */
        this.nCyclesPerYield = (this.nCyclesPerSecond / this.nYieldsPerSecond * nMultiplier);
        this.nCurrentMultiplier = nMultiplier;
    }

    /**
     * calcSpeed(nCycles, msElapsed)
     *
     * @this {Time}
     * @param {number} nCycles
     * @param {number} msElapsed
     */
    calcSpeed(nCycles, msElapsed)
    {
        if (msElapsed) {
            this.mhzCurrent = (nCycles / (msElapsed * 10)) / 100;
        }
    }

    /**
     * doBurst(nCycles, fStep)
     *
     * @this {Time}
     * @param {number} nCycles
     * @param {boolean} [fStep]
     * @returns {number} (number of cycles actually executed)
     */
    doBurst(nCycles, fStep)
    {
        this.nCyclesBurst = this.nCyclesRemain = nCycles;
        if (!this.aClockers.length) {
            this.nCyclesRemain = 0;
            return this.nCyclesBurst;
        }
        let iClocker = 0;
        while (this.nCyclesRemain > 0) {
            if (iClocker < this.aClockers.length) {
                nCycles = this.aClockers[iClocker++](fStep? 0 : nCycles) || 1;
            } else {
                iClocker = nCycles = 0;
            }
            this.nCyclesRemain -= nCycles;
        }
        return this.nCyclesBurst - this.nCyclesRemain;
    }

    /**
     * doOutside(fn)
     *
     * Use this function to perform any work outside of normal time (eg, DOM updates),
     * to prevent that work from disrupting our speed calculations.
     *
     * @this {Time}
     * @param {function()} fn (should return true only if the function actually performed any work)
     * @returns {boolean}
     */
    doOutside(fn)
    {
        let msStart = Date.now();
        if (fn()) {
            let msStop = Date.now();
            this.msOutsideThisRun += msStop - msStart;
            return true;
        }
        return false;
    }

    /**
     * endBurst(nCycles)
     *
     * @this {Time}
     * @param {number} [nCycles]
     * @returns {number} (number of cycles executed in burst)
     */
    endBurst(nCycles = this.nCyclesBurst - this.nCyclesRemain)
    {
        if (this.fClockByFrame && this.fRunning) {
            this.nCyclesDeposited -= nCycles;
            if (this.nCyclesDeposited < 1) {
                this.fYield = true;
            }
        }
        this.nCyclesBurst = this.nCyclesRemain = 0;
        this.nCyclesThisRun += nCycles;
        this.nCyclesRun += nCycles;
        if (!this.fRunning) this.nCyclesRun = 0;
        return nCycles;
    }

    /**
     * getCycles(ms)
     *
     * If no time period is specified, this returns the current number of cycles per second.
     *
     * @this {Time}
     * @param {number} ms (default is 1000)
     * @returns {number} number of corresponding cycles
     */
    getCycles(ms = 1000)
    {
        return Math.ceil((this.nCyclesPerSecond * this.nCurrentMultiplier) / 1000 * ms);
    }

    /**
     * getCyclesPerBurst()
     *
     * This tells us how many cycles to execute as a burst.
     *
     * @this {Time}
     * @returns {number} (the maximum number of cycles we should execute in the next burst)
     */
    getCyclesPerBurst()
    {
        let nCycles = this.getCycles(this.msYield);
        for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
            let timer = this.aTimers[iTimer-1];

            if (timer.nCyclesLeft < 0) continue;
            if (nCycles > timer.nCyclesLeft) {
                nCycles = timer.nCyclesLeft;
            }
        }
        return nCycles;
    }

    /**
     * getCyclesPerFrame()
     *
     * This tells us how many cycles to execute per frame (assuming fClockByFrame).
     *
     * @this {Time}
     * @returns {number} (the maximum number of cycles we should execute in the next burst)
     */
    getCyclesPerFrame()
    {
        let nCycles = (this.nCyclesDeposited += this.nCyclesDepositPerFrame);
        if (nCycles < 1) {
            nCycles = 0;
        } else {
            nCycles |= 0;
            for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
                let timer = this.aTimers[iTimer-1];

                if (timer.nCyclesLeft < 0) continue;
                if (nCycles > timer.nCyclesLeft) {
                    nCycles = timer.nCyclesLeft;
                }
            }
        }
        return nCycles;
    }

    /**
     * getSpeed(mhz)
     *
     * @this {Time}
     * @param {number} mhz
     * @returns {string} the given speed, as a formatted string
     */
    getSpeed(mhz)
    {
        let s;
        if (mhz >= 1) {
            s = mhz.toFixed(2) + "Mhz";
        } else {
            let hz = Math.round(mhz * 1000000);
            if (hz <= 999) {
                s = hz + "Hz";
            } else {
                s = Math.ceil(hz / 1000) + "Khz";
            }
        }
        return s;
    }

    /**
     * getSpeedCurrent()
     *
     * @this {Time}
     * @returns {string} the current speed, as a formatted string
     */
    getSpeedCurrent()
    {
        return (this.fRunning && this.mhzCurrent)? this.getSpeed(this.mhzCurrent) : "Stopped";
    }

    /**
     * getSpeedTarget()
     *
     * @this {Time}
     * @returns {string} the target speed, as a formatted string
     */
    getSpeedTarget()
    {
        return this.getSpeed(this.mhzTarget);
    }

    /**
     * isRunning()
     *
     * @this {Time}
     * @returns {boolean}
     */
    isRunning()
    {
        return this.fRunning;
    }

    /**
     * isTimerSet(iTimer)
     *
     * NOTE: Even if the timer is armed, we return false if the clock is currently stopped;
     * in that sense, perhaps this function should be named isTimerArmedAndWillItFireOnTime().
     *
     * @this {Time}
     * @param {number} iTimer
     * @returns {boolean}
     */
    isTimerSet(iTimer)
    {
        if (this.fRunning) {
            if (iTimer > 0 && iTimer <= this.aTimers.length) {
                let timer = this.aTimers[iTimer - 1];
                return (timer.nCyclesLeft >= 0);
            }
        }
        return false;
    }

    /**
     * onRun()
     *
     * This handles the "run" button, if any, attached to the Time device.
     *
     * Note that this serves a different purpose than the "power" button that's managed by the Input device,
     * because toggling power also requires resetting the program counter prior to start() OR clearing the display
     * after stop().  See the Chip's onPower() function for details.
     *
     * @this {Time}
     */
    onRun()
    {
        if (this.fRunning) {
            this.stop();
        } else {
            this.start();
        }
    }

    /**
     * onStep(nRepeat)
     *
     * This handles the "step" button, if any, attached to the Time device.
     *
     * @this {Time}
     * @param {number} [nRepeat]
     */
    onStep(nRepeat)
    {
        if (!this.fRunning) {
            if (this.nStepping) {
                this.stop();
            } else {
                this.step(nRepeat);
            }
        } else {
            this.println("already running");
        }
    }

    /**
     * onYield()
     *
     * @this {Time}
     */
    onYield()
    {
        this.fYield = true;
        let nYields = this.nYields;
        let nCyclesPerSecond = this.getCycles();
        if (nCyclesPerSecond >= this.nYieldsPerSecond) {
            this.nYields++;
        } else {
            /*
             * Let's imagine that nCyclesPerSecond has dropped to 4, whereas the usual nYieldsPerSecond is 60;
             * that's means we're yielding at 1/15th the usual rate, so to compensate, we want to bump nYields
             * by 15 instead of 1.
             */
            this.nYields += Math.ceil(this.nYieldsPerSecond / nCyclesPerSecond);
        }
        if (this.nYields >= this.nYieldsPerUpdate && nYields < this.nYieldsPerUpdate) {
            this.updateStatus();
        }
        if (this.nYields >= this.nYieldsPerSecond) {
            this.nYields = 0;
        }
    }

    /**
     * resetSpeed()
     *
     * Resets speed and cycle information as part of any reset() or restore(); this typically occurs during powerUp().
     * It's important that this be called BEFORE the actual restore() call, because restore() may want to call setSpeed(),
     * which in turn assumes that all the cycle counts have been initialized to sensible values.
     *
     * @this {Time}
     */
    resetSpeed()
    {
        this.nCyclesRun = this.nCyclesBurst = this.nCyclesRemain = 0;
        if (!this.setSpeedThrottle()) this.setSpeed(this.nBaseMultiplier);
    }

    /**
     * resetTimers()
     *
     * When the target speed multiplier is altered, it's a good idea to run through all the timers that
     * have a fixed millisecond period and re-arm them, because the timers are using cycle counts that were based
     * on a previous multiplier.
     *
     * @this {Time}
     */
    resetTimers()
    {
        for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
            let timer = this.aTimers[iTimer-1];
            if (timer.msAuto >= 0) this.setTimer(iTimer, timer.msAuto, true);
        }
    }

    /**
     * run()
     *
     * @this {Time}
     */
    run()
    {
        this.idRunTimeout = 0;
        if (!this.fRunning) return;
        this.snapStart();
        try {
            this.fYield = false;
            do {
                /*
                 * Execute the burst and then update all timers.
                 */
                this.updateTimers(this.endBurst(this.doBurst(this.getCyclesPerBurst())));

            } while (this.fRunning && !this.fYield);
        }
        catch(err) {
            this.println(err.message);
            this.stop();
            return;
        }
        if (this.fRunning) {

            this.idRunTimeout = setTimeout(this.onRunTimeout, this.snapStop());
            if (!this.fRequestAnimationFrame) this.animate();
        }
    }

    /**
     * setSpeedThrottle()
     *
     * This handles speed adjustments requested by the throttling slider.
     *
     * @this {Time}
     * @returns {boolean} (true if a throttle exists, false if not)
     */
    setSpeedThrottle()
    {
        /*
         * We're not going to assume any direct relationship between the slider's min/max/value
         * and our own nCyclesMinimum/nCyclesMaximum/nCyclesPerSecond.  We're just going to calculate
         * a new target nCyclesPerSecond that is proportional, and then convert that to a speed multiplier.
         */
        let elementInput = this.bindings[Time.BINDING.THROTTLE];
        if (elementInput) {
            let ratio = (elementInput.value - elementInput.min) / (elementInput.max - elementInput.min);
            let nCycles = Math.floor((this.nCyclesMaximum - this.nCyclesMinimum) * ratio + this.nCyclesMinimum);
            let nMultiplier = nCycles / this.nCyclesPerSecond;

            this.setSpeed(nMultiplier);
            return true;
        }
        return false;
    }

    /**
     * setSpeed(nMultiplier)
     *
     * @this {Time}
     * @param {number} [nMultiplier] is the new proposed multiplier (reverts to default if target was too high)
     * @returns {boolean} true if successful, false if not
     *
     * @desc Whenever the speed is changed, the running cycle count and corresponding start time must be reset,
     * so that the next effective speed calculation obtains sensible results.  In fact, when run() initially calls
     * setSpeed() with no parameters, that's all this function does (it doesn't change the current speed setting).
     */
    setSpeed(nMultiplier)
    {
        let fSuccess = true;
        if (nMultiplier !== undefined) {
            /*
             * If we haven't reached 90% (0.9) of the current target speed, revert to the default multiplier.
             */
            if (!this.fThrottling && this.mhzCurrent > 0 && this.mhzCurrent < this.mhzTarget * 0.9) {
                nMultiplier = this.nBaseMultiplier;
                fSuccess = false;
            }
            this.nTargetMultiplier = nMultiplier;
            let mhzTarget = this.mhzBase * this.nTargetMultiplier;
            if (this.mhzTarget != mhzTarget) {
                this.mhzTarget = mhzTarget;
                this.setBindingText(Time.BINDING.SPEED, this.getSpeedTarget());
            }
            /*
             * After every yield, calcSpeed() will update mhzCurrent, but we also need to be optimistic
             * and set it to the mhzTarget now, so that the next calcCycles() call will make a reasonable
             * initial estimate.
             */
            this.mhzCurrent = this.mhzTarget;
        }
        if (this.fClockByFrame) {
            let nCyclesPerSecond = this.mhzCurrent * 1000000;
            this.nCyclesDepositPerFrame = (nCyclesPerSecond / 60) + 0.000001;
            this.nCyclesDeposited = 0;
        }
        this.nCyclesRun = 0;
        this.msStartRun = this.msEndRun = 0;
        this.calcCycles();      // calculate a new value for the current cycle multiplier
        this.resetTimers();     // and then update all the fixed-period timers using the new cycle multiplier
        return fSuccess;
    }

    /**
     * setTimer(iTimer, ms, fReset)
     *
     * Using the timer index from a previous addTimer() call, this sets that timer to fire after the
     * specified number of milliseconds.
     *
     * @this {Time}
     * @param {number} iTimer
     * @param {number} ms (converted into a cycle countdown internally)
     * @param {boolean} [fReset] (true if the timer should be reset even if already armed)
     * @returns {number} (number of cycles used to arm timer, or -1 if error)
     */
    setTimer(iTimer, ms, fReset)
    {
        let nCycles = -1;
        if (iTimer > 0 && iTimer <= this.aTimers.length) {
            let timer = this.aTimers[iTimer-1];
            if (fReset || timer.nCyclesLeft < 0) {
                nCycles = this.getCycles(ms);
                /*
                 * If we're currently executing a burst of cycles, the number of cycles it has executed in
                 * that burst so far must NOT be charged against the cycle timeout we're about to set.  The simplest
                 * way to resolve that is to immediately call endBurst() and bias the cycle timeout by the number
                 * of cycles that the burst executed.
                 */
                if (this.fRunning) {
                    nCycles += this.endBurst();
                }
                timer.nCyclesLeft = nCycles;
            }
        }
        return nCycles;
    }

    /**
     * snapStart()
     *
     * @this {Time}
     */
    snapStart()
    {
        this.calcCycles();

        this.nCyclesThisRun = 0;
        this.msOutsideThisRun = 0;
        this.msStartThisRun = Date.now();
        if (!this.msStartRun) this.msStartRun = this.msStartThisRun;

        /*
         * Try to detect situations where the browser may have throttled us, such as when the user switches
         * to a different tab; in those situations, Chrome and Safari may restrict setTimeout() callbacks
         * to roughly one per second.
         *
         * Another scenario: the user resizes the browser window.  setTimeout() callbacks are not throttled,
         * but there can still be enough of a lag between the callbacks that speed will be noticeably
         * erratic if we don't compensate for it here.
         *
         * We can detect throttling/lagging by verifying that msEndRun (which was set at the end of the
         * previous run and includes any requested sleep time) is comparable to the current msStartThisRun;
         * if the delta is significant, we compensate by bumping msStartRun forward by that delta.
         *
         * This shouldn't be triggered when the Debugger stops time, because setSpeed() -- which is called
         * whenever the time starts again -- zeroes msEndRun.
         */
        let msDelta = 0;
        if (this.msEndRun) {
            msDelta = this.msStartThisRun - this.msEndRun;
            if (msDelta > this.msYield) {
                this.msStartRun += msDelta;
                /*
                 * Bumping msStartRun forward should NEVER cause it to exceed msStartThisRun; however, just
                 * in case, I make absolutely sure it cannot happen, since doing so could result in negative
                 * speed calculations.
                 */

                if (this.msStartRun > this.msStartThisRun) {
                    this.msStartRun = this.msStartThisRun;
                }
            }
        }
    }

    /**
     * snapStop()
     *
     * @this {Time}
     * @returns {number}
     */
    snapStop()
    {
        this.msEndRun = Date.now();

        if (this.msOutsideThisRun) {
            this.msStartRun += this.msOutsideThisRun;
            this.msStartThisRun += this.msOutsideThisRun;
        }

        let msYield = this.msYield;
        if (this.nCyclesThisRun) {
            /*
             * Normally, we assume we executed a full quota of work over msYield.  If nCyclesThisRun is correct,
             * then the ratio of nCyclesThisRun/nCyclesPerYield should represent the percentage of work we performed,
             * and so applying that percentage to msYield should give us a better estimate of work vs. time.
             */
            msYield = Math.round(msYield * this.nCyclesThisRun / this.nCyclesPerYield);
        }

        let msElapsedThisRun = this.msEndRun - this.msStartThisRun;
        let msRemainsThisRun = msYield - msElapsedThisRun;

        let nCycles = this.nCyclesRun;
        let msElapsed = this.msEndRun - this.msStartRun;

        if (DEBUG && msRemainsThisRun < 0 && this.nTargetMultiplier > 1) {
            this.println("warning: updates @" + msElapsedThisRun + "ms (prefer " + Math.round(msYield) + "ms)");
        }

        this.calcSpeed(nCycles, msElapsed);

        if (msRemainsThisRun < 0) {
            /*
             * Try "throwing out" the effects of large anomalies, by moving the overall run start time up;
             * ordinarily, this should only happen when the someone is using an external Debugger or some other
             * tool or feature that is interfering with our overall execution.
             */
            if (msRemainsThisRun < -1000) {
                this.msStartRun -= msRemainsThisRun;
            }
            /*
             * If the last burst took MORE time than we allotted (ie, it's taking more than 1 second to simulate
             * nCyclesPerSecond), all we can do is yield for as little time as possible (ie, 0ms) and hope that the
             * simulation is at least usable.
             */
            msRemainsThisRun = 0;
        }
        else if (this.mhzCurrent < this.mhzTarget) {
            msRemainsThisRun = 0;
        }

        this.msEndRun += msRemainsThisRun;

        if (this.isCategoryOn(Device.CATEGORY.TIME)) {
            this.printf("after running %d cycles, resting for %dms\n", this.nCyclesThisRun, msRemainsThisRun);
        }

        return msRemainsThisRun;
    }

    /**
     * start()
     *
     * @this {Time}
     * @returns {boolean}
     */
    start()
    {
        if (this.fRunning || this.nStepping) {
            return false;
        }

        if (this.idRunTimeout) {
            clearTimeout(this.idRunTimeout);
            this.idRunTimeout = 0;
        }

        this.fRunning = true;
        this.msStartRun = this.msEndRun = 0;
        this.updateStatus(true);

        /*
         * Kickstart both the clockers and requestAnimationFrame; it's a little premature to start
         * animation here, because the first run() should take place before the first animate(), but
         * since clock speed is now decoupled from animation speed, this isn't something we should
         * worry about.
         */
        if (!this.fClockByFrame) {

            this.idRunTimeout = setTimeout(this.onRunTimeout, 0);
        }
        if (this.fRequestAnimationFrame) this.requestAnimationFrame(this.onAnimationFrame);
        return true;
    }

    /**
     * step(nRepeat)
     *
     * @this {Time}
     * @param {number} [nRepeat]
     * @returns {boolean} true if successful, false if already running
     */
    step(nRepeat = 1)
    {
        if (!this.fRunning) {
            if (nRepeat && !this.nStepping) {
                this.nStepping = nRepeat;
            }
            if (this.nStepping) {
                /*
                 * Execute a minimum-cycle burst and then update all timers.
                 */
                this.nStepping--;
                this.updateTimers(this.endBurst(this.doBurst(1, true)));
                this.updateStatus();
                if (this.nStepping) {
                    let time = this;
                    this.idStepTimeout = setTimeout(function onStepTimeout() {
                        time.step(0);
                    }, 0);
                    return true;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * stop()
     *
     * @this {Time}
     * @returns {boolean} true if successful, false if already stopped
     */
    stop()
    {
        if (this.nStepping) {
            this.nStepping = 0;
            this.updateStatus(true);
            return true;
        }
        if (this.fRunning) {
            this.fRunning = false;
            this.endBurst();
            this.updateStatus(true);
            return true;
        }
        return false;
    }

    /**
     * updateStatus(fTransition)
     *
     * Used for periodic status updates from onYield(), single-step updates from step(), and transitional
     * updates from start() and stop().
     *
     * @this {Time}
     * @param {boolean} [fTransition]
     */
    updateStatus(fTransition)
    {
        if (fTransition) {
            if (this.fRunning) {
                this.println("starting (" + this.getSpeedTarget() + " target by " + (this.fClockByFrame? "frame" : "timer") + ")");
            } else {
                this.println("stopping");
            }
        }

        this.setBindingText(Time.BINDING.RUN, this.fRunning? "Halt" : "Run");
        this.setBindingText(Time.BINDING.STEP, this.nStepping? "Stop" : "Step");
        if (!this.fThrottling) {
            this.setBindingText(Time.BINDING.SPEED, this.getSpeedCurrent());
        }

        for (let i = 0; i < this.aUpdaters.length; i++) {
            this.aUpdaters[i](fTransition);
        }
    }

    /**
     * updateTimers(nCycles)
     *
     * Used by run() to reduce all active timer countdown values by the number of cycles just executed;
     * this is the function that actually "fires" any timer(s) whose countdown has reached (or dropped below)
     * zero, invoking their callback function.
     *
     * @this {Time}
     * @param {number} nCycles (number of cycles actually executed)
     */
    updateTimers(nCycles)
    {
        if (nCycles >= 1) {
            for (let iTimer = this.aTimers.length; iTimer > 0; iTimer--) {
                let timer = this.aTimers[iTimer-1];

                if (timer.nCyclesLeft < 0) continue;
                timer.nCyclesLeft -= nCycles;
                if (timer.nCyclesLeft <= 0) {
                    timer.nCyclesLeft = -1; // zero is technically an "active" value, so ensure the timer is dormant now
                    timer.callBack();       // safe to invoke the callback function now
                    if (timer.msAuto >= 0) {
                        this.setTimer(iTimer, timer.msAuto);
                    }
                }
            }
        }
    }
}

Time.BINDING = {
    RUN:        "run",
    SPEED:      "speed",
    STEP:       "step",
    THROTTLE:   "throttle"
};

/*
 * We yield more often now (120 times per second instead of 60), to help ensure that requestAnimationFrame()
 * callbacks can be called as timely as possible.  And we still only want to perform DOM-related status updates
 * no more than twice per second, so the required number of yields before each update has been increased as well.
 */
Time.YIELDS_PER_SECOND = 120;
Time.YIELDS_PER_UPDATE = 60;

Time.VERSION    = 1.11;

/**
 * @copyright http://pcjs.org/modules/devices/tms1500.js (C) Jeff Parsons 2012-2017
 */

/**
 * 64-bit Register
 *
 * @class {Reg64}
 * @unrestricted
 * @property {Chip} chip
 * @property {Array.<number>} digits
 */
class Reg64 extends Device {
    /**
     * Reg64(chip, id, fInternal)
     *
     * @this {Reg64}
     * @param {Chip} chip
     * @param {string} id
     * @param {boolean} [fInternal]
     */
    constructor(chip, id, fInternal)
    {
        super(chip.idMachine, id, chip.version);
        this.chip = chip;
        this.name = id;

        /*
         * Each Reg64 register contains 16 BCD/Hex digits, which we store as 16 independent 4-bit numbers,
         * where [0] is D0, aka DIGIT 0, and [15] is D15, aka DIGIT 15.
         */
        this.digits = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        /*
         * Automatically add direct bindings for this new register and all its digits to the caller's bindings.
         */
        if (!fInternal) {
            let bindings = [];
            let name = "reg" + this.name;
            bindings.push(name);
            chip.regMap[name] = [this, -1];
            for (let d = 0; d < this.digits.length; d++) {
                name = this.sprintf("reg%s-%02d", this.name, d);
                bindings.push(name);
                chip.regMap[name] = [this, d];
            }
            chip.addBindings(bindings);
        }
    }

    /**
     * add(reg, regSrc, range, base)
     *
     * @this {Reg64}
     * @param {Reg64} reg
     * @param {Reg64} regSrc
     * @param {Array.<number>} range
     * @param {number} base
     */
    add(reg, regSrc, range, base)
    {
        let carry = 0;
        for (let i = range[0], j = range[1]; i <= j; i++) {
            this.digits[i] = reg.digits[i] + regSrc.digits[i] + carry;
            carry = 0;
            if (this.digits[i] >= base) {
                this.digits[i] -= base;
                carry = 1;
            }
        }
        if (carry) this.chip.fCOND = true;
        this.updateR5(range);
    }

    /**
     * get()
     *
     * @this {Reg64}
     * @returns {Array}
     */
    get()
    {
        return this.digits;
    }

    /**
     * init(value, range)
     *
     * @this {Reg64}
     * @param {number} value
     * @param {Array.<number>} range
     * @returns {Reg64}
     */
    init(value, range = [0,15])
    {
        for (let i = 0; i < this.digits.length; i++) {
            this.digits[i] = 0;
        }
        for (let i = range[0], j = range[1]; i <= j; i++) {
            this.digits[i] = value & 0xf;
            value >>>= 4;
        }
        return this;
    }

    /**
     * move(regSrc, range)
     *
     * @this {Reg64}
     * @param {Reg64} regSrc
     * @param {Array.<number>} range
     */
    move(regSrc, range)
    {
        for (let i = range[0], j = range[1]; i <= j; i++) {
            this.digits[i] = regSrc.digits[i];
        }
        regSrc.updateR5(range);
    }

    /**
     * set(digits)
     *
     * @this {Reg64}
     * @param {Array} digits
     */
    set(digits)
    {
        if (!digits || digits.length != this.digits.length) return;
        for (let i = 0; i < this.digits.length; i++) this.digits[i] = digits[i];
    }

    /**
     * shl(reg, range)
     *
     * @this {Reg64}
     * @param {Reg64} reg
     * @param {Array.<number>} range
     */
    shl(reg, range)
    {
        let i, j;
        for (i = range[1], j = range[0]; i > j; i--) {
            this.digits[i] = reg.digits[i-1];
        }
        this.digits[i] = 0;
        this.updateR5(range);
    }

    /**
     * shr(reg, range)
     *
     * @this {Reg64}
     * @param {Reg64} reg
     * @param {Array.<number>} range
     */
    shr(reg, range)
    {
        let i, j;
        for (i = range[0], j = range[1]; i < j; i++) {
            this.digits[i] = reg.digits[i+1];
        }
        this.digits[i] = 0;
        this.updateR5(range);
    }

    /**
     * store(reg)
     *
     * STORE is similar to MOVE, but all digits are stored (ie, no mask is involved), and R5 is not affected.
     *
     * @this {Reg64}
     * @param {Reg64} reg
     */
    store(reg)
    {
        for (let i = 0, j = this.digits.length; i < j; i++) {
            this.digits[i] = reg.digits[i];
        }
    }

    /**
     * sub(reg, regSrc, range, base)
     *
     * @this {Reg64}
     * @param {Reg64} reg
     * @param {Reg64} regSrc
     * @param {Array.<number>} range
     * @param {number} base
     */
    sub(reg, regSrc, range, base)
    {
        let carry = 0;
        for (let i = range[0], j = range[1]; i <= j; i++) {
            this.digits[i] = reg.digits[i] - regSrc.digits[i] - carry;
            carry = 0;
            if (this.digits[i] < 0) {
                this.digits[i] += base;
                carry = 1;
            }
        }
        if (carry) this.chip.fCOND = true;
        this.updateR5(range);
    }

    /**
     * toString(fSpaces)
     *
     * @this {Reg64}
     * @param {boolean} [fSpaces]
     * @returns {string}
     */
    toString(fSpaces = false)
    {
        let s = this.idDevice + '=';
        if (fSpaces && s.length < 3) s += ' ';
        for (let i = this.digits.length - 1; i >= 0; i--) {
            if (fSpaces) {
                s += Device.HexUpperCase[this.digits[i]];
            } else {
                s += Device.HexLowerCase[this.digits[i]] + ((i % 4)? '' : ' ');
            }
        }
        return s;
    }

    /**
     * updateR5(range)
     *
     * @this {Reg64}
     */
    updateR5(range)
    {
        this.chip.regR5 = this.digits[range[0]];

        if (range[0] < range[1]) {
            this.chip.regR5 |= this.digits[range[0]+1] << 4;

        }
    }

    /**
     * xchg(regSrc, range)
     *
     * @this {Reg64}
     * @param {Reg64} regSrc
     * @param {Array.<number>} range
     */
    xchg(regSrc, range)
    {
        for (let i = range[0], j = range[1]; i <= j; i++) {
            let d = this.digits[i];
            this.digits[i] = regSrc.digits[i];
            regSrc.digits[i] = d;
        }
        regSrc.updateR5(range);
    }
}

/**
 * TMS-150x Calculator Chip
 *
 * Emulates various TMS ("Texas Mos Standard") and TMC ("Texas Mos Custom") chips.  The 'type' property of
 * the config object should contain one of the following strings:
 *
 *      TI-57: "TMS-1501" or "TMC-1501" (or simply "1501")
 *      TI-55: "TMS-1503" or "TMC-1503" (or simply "1503")
 *
 * This chip contains lots of small discrete devices, most of which will be emulated either within this
 * class or within another small container class in the same file, because most of them are either very simple
 * or have unique quirks, so it's not clear there's much reusability.
 *
 * One exception is the ROM, since ROMs are a very common device with very similar characteristics.  Since
 * the Machine class guarantees that the Chip class is initialized after the ROM class, we can look it up in
 * the constructor.
 *
 * @class {Chip}
 * @unrestricted
 * @property {Array.<Reg64>} regsO (operational registers A-D)
 * @property {Reg64} regA (alias for regsO[0])
 * @property {Reg64} regB (alias for regsO[1])
 * @property {Reg64} regC (alias for regsO[2])
 * @property {Reg64} regD (alias for regsO[3])
 * @property {Array.<Reg64>} regsX (storage registers X0-X7)
 * @property {Array.<Reg64>} regsY (storage registers Y0-Y7)
 * @property {Reg64} regSupp (alternate register used when the destination must be suppressed)
 * @property {Reg64} regTemp (temporary register used to supply constants or other internal values)
 * @property {number} base (10 or 16)
 * @property {boolean} fCOND (true when a carry has been detected)
 * @property {number} regRAB
 * @property {number} regR5 (least significant masked digit(s) from last arithmetic result)
 * @property {number} regPC (program counter: address of next instruction to decode)
 * @property {number} regKey (current key status, propagated to regR5 at appropriate intervals)
 * @property {Array.<number>} stack (3-level address stack; managed by push() and pop())
 * @property {number} nCyclesClocked
 * @property {Input} input
 * @property {LED} led
 * @property {ROM} rom
 * @property {Time} time
 * @property {number} addrPrev
 * @property {number} addrStop
 * @property {Object} breakConditions
 * @property {number} nStringFormat
 * @property {number} type (one of the Chip.TYPE values)
 */
class Chip extends Device {
    /**
     * Chip(idMachine, idDevice, config)
     *
     * Defines the basic elements of the TMS-150x chip, as illustrated by U.S. Patent No. 4,125,901, Fig. 3 (p. 4)
     *
     * @this {Chip}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, Chip.VERSION, config);

        let sType = this.getDefaultString('type', "1501");
        this.type = Number.parseInt(sType.slice(-4), 10);

        this.regMap = {};

        /*
         * Four (4) Operational Registers (A-D)
         */
        this.regsO = new Array(4);
        for (let i = 0; i < 4; i++) {
            this.regsO[i] = new Reg64(this, String.fromCharCode(0x41+i));
        }

        /*
         * Aliases for each of the Operational Registers, since some instructions use hard-coded registers,
         * rather than calculating a register index (0-3).
         */
        this.regA = this.regsO[0];
        this.regB = this.regsO[1];
        this.regC = this.regsO[2];
        this.regD = this.regsO[3];

        /*
         * Eight (8) Storage Registers (X0-X7)
         */
        this.regsX = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.regsX[i] = new Reg64(this, "X" + i);
        }

        /*
         * Eight (8) Storage Registers (Y0-Y7)
         */
        this.regsY = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.regsY[i] = new Reg64(this, "Y" + i);
        }

        this.regSupp = new Reg64(this, "Supp", true);
        this.regTemp = new Reg64(this, "Temp", true);

        this.base = 10;
        this.fCOND = false;

        /*
         * RAB (Register Address Buffer) is a 3-bit register "selectively loadable by the I4-I6 bits of an
         * instruction word" and "also selectively loadable from the three least significant bits of the number
         * stored in R5 register".
         */
        this.regRAB = 0;

        /*
         * R5 is "an eight bit shift register which may be selectively loaded from either the serial output from
         * arithmetic unit" or "may be loaded on lines KR1-3 and KR5-7 via gates from keyboard logic (at which
         * times the MSB of each digit in Register R5 is loaded with a zero via gates according to the keyboard code
         * code indicated in Table II)".
         */
        this.regR5 = 0;

        /*
         * The "Output Register" is twelve bit register, one bit for each digit of the display.  This essentially
         * provides column information for the LED display, while the next register (regScanGen) provides row
         * information.
         *
         * However, this is only necessary if we decide to simulate the internal operation of the Display Decoder
         * and Keyboard Scanner.
         *
         * Refer to patent Fig. 11c (p. 28)
         */
        // this.regOut = 0;

        /*
         * The "Scan Generator Counter" is a 3-bit register.  It is updated once each instruction cycle.
         * It "does not count sequentially, but during eight instruction cycle provides the three bit binary
         * representations of zero through seven."  Here's the sequence from "Reference A" of Fig. 11e:
         *
         *                 DECODE    DISP     KBD
         *      W   V   U     SEG     SEG    SCAN    HOLD
         *      ---------  ------    ----    ----    ----
         *      1   1   1       D       -       -       1
         *      1   1   0       A       D     KS6       1
         *      1   0   1       B       A     KS5       1
         *      0   1   0       C       B     KS2       1
         *      1   0   0       E       C     KS4       1
         *      0   0   0       F       E     KS0       1
         *      0   0   1       G       F     KS1       1
         *      0   1   1       P       G     KS3       0
         *      ---------  ------    ----    ----    ----
         *      1   1   1       D       P     KS7       1
         *      1   1   0       A       D     KS6       1
         *      ...
         *
         * However, this is only necessary if we decide to simulate the internal operation of the Display Decoder
         * and Keyboard Scanner.
         *
         * Refer to patent Fig. 11e (p. 30)
         */
        // this.regScanGen = 0;

        /*
         * The "Segment/Keyboard Scan" is an 8-bit register "arranged as a ring counter for shifting a logical zero
         * to a different stage during each instruction cycle....  [It is] further interconnected with the RESET signal
         * for inserting a logical one into all stages of the counter."  The outputs from the stages are connected to
         * SEG D, followed by SEG A, SEG B, SEG C, SEG E, SEG F, SEG G, and SEG P.
         *
         * However, this is only necessary if we decide to simulate the internal operation of the Display Decoder
         * and Keyboard Scanner.
         *
         * Refer to patent Fig. 11b (p. 27)
         */
        // this.regSegKbdScan = 0xff;

        /*
         * The "State Time Generator" is represented by a 5-bit register that contains values 00000b through 11111b
         * for each of the 32 state times that occur during a single instruction cycle.  And since each "state time"
         * consists of four clock pulses, designated Φ1, P1, Φ2, and P2, we keep track of which pulse we're on, too.
         *
         * However, these are only necessary if we decide to simulate the internal operation of the Display Decoder
         * and Keyboard Scanner.
         *
         * Refer to patent Fig. 11f (p. 31)
         */
        // this.regStateTime = 0;
        // this.regPulseTime = 0;

        /*
         * The "Program Counter" (regPC) is an 11-bit register that automatically increments unless a HOLD signal
         * is applied, effectively locking execution on a single instruction.
         */
        this.regPC = 0;

        /*
         * If non-zero, a key is being pressed.  Bits 0-3 are the row (0-based) and bits 4-7 are the col (1-based).
         */
        this.regKey = 0;

        /*
         * The "Subroutine Stack".  "When an unconditional branch instruction is decoded by branch logic 32b, the
         * CALL signal goes to zero permitting the present ROM address plus one to be loaded into subroutine stack
         * register 33a....  Addresses previously loaded into subroutine stack/registers 33a and 33b are shifted
         * to registers 33b and 33c."
         *
         * We initialize it with "guard values" (-1) to help detect the presence of invalid data, and to catch stack
         * overflow/underflow errors.
         *
         * Refer to patent Fig. 7a (p. 9)
         */
        this.stack = [-1, -1, -1];

        /*
         * This internal cycle count is initialized on every clocker() invocation, enabling opcode functions that
         * need to consume a few extra cycles to bump this count upward as needed.
         */
        this.nCyclesClocked = 0;

        /*
         * Get access to the Input device, so we can add our click functions.
         */
        this.input = /** @type {Input} */ (this.findDevice(this.config['input']));
        this.input.addInput(this.onInput.bind(this));
        this.input.addClick(this.onPower.bind(this), this.onReset.bind(this));

        /*
         * Get access to the LED device, so we can update its display.
         */
        this.led = /** @type {LED} */ (this.findDevice(this.config['output']));

        /*
         * Get access to the ROM device, so we can give it access to functions like disassemble().
         */
        this.rom = /** @type {ROM} */ (this.findDeviceByClass(Machine.CLASS.ROM));
        if (this.rom) this.rom.setChip(this);

        /*
         * Get access to the Time device, so we can give it our clocker() function.
         */
        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
        if (this.time && this.rom) {
            this.time.addClocker(this.clocker.bind(this));
            this.time.addUpdater(this.updateStatus.bind(this));
        }

        /*
         * To add support for indicators like "2nd" and "INV", I use a set of flags to reflect
         * the state of the external indicator.  They are initially undefined and will be updated
         * by updateIndicators() whenever the internal and external states differ.
         */
        this.f2nd = this.fINV = this.angleMode = undefined;

        /*
         * The following set of properties are all debugger-related; see onCommand().
         */
        this.addrPrev = -1;
        this.addrStop = -1;
        this.breakConditions = {};
        this.nStringFormat = Chip.SFORMAT.DEFAULT;
        this.addHandler(Device.HANDLER.COMMAND, this.onCommand.bind(this));
    }

    /**
     * checkBreakCondition(c)
     *
     * @this {Chip}
     * @param {string} c
     * @returns {boolean}
     */
    checkBreakCondition(c)
    {
        if (this.breakConditions[c]) {
            this.breakConditions[c] = false;
            this.println("break on " + Chip.BREAK[c]);
            this.time.stop();
            return true;
        }
        return false;
    }

    /**
     * clearDisplays()
     *
     * There are certain events (eg, power off, reset) where it is wise to clear all associated displays,
     * such as the LED display, the ROM activity array (if any), and assorted calculator indicators.
     *
     * @this {Chip}
     */
    clearDisplays()
    {
        if (this.led) this.led.clearBuffer(true);
        if (this.rom) this.rom.clearArray();
        this.updateIndicators(false);
    }

    /**
     * clocker(nCyclesTarget)
     *
     * NOTE: TI patents imply that the TI-57 would have a standard cycle time of 0.625us, which translates to
     * 1,600,000 cycles per second.  However, my crude tests with a real device suggest that the TI-57 actually
     * ran at around 40% of that speed, which is why you'll see all my configuration files specifying 650,000
     * cycles per second instead.  But, for purposes of the following discussion, we'll continue to assume a cycle
     * time of 0.625us.
     *
     * Every set of four cycles is designated a "state time".  Within a single state time (2.5us), the four cycles
     * are designated Φ1, P1, Φ2, and P2.  Moreover, one state time is required to transfer 2 bits from a data word
     * register.  Since a data word consists of 16 BCD digits (ie, 64 bits), 32 state times (80us) are required to
     * "clock" all the bits from one register to another.  This total time is referred to as an instruction cycle.
     *
     * Note that some instructions (ie, the DISP instruction) slow the delivery of cycles, such that one state time
     * is 10us instead of 2.5us, and therefore the entire instruction cycle will take 320us instead of 80us.
     *
     * We're currently simulating a full 32 "state times" (128 cycles aka Chip.OP_CYCLES) per instruction, since
     * we don't perform discrete simulation of the Display Decoder/Keyboard Scanner circuitry.  See opDISP() for
     * an example of an operation that imposes additional cycle overhead.
     *
     * @this {Chip}
     * @param {number} nCyclesTarget (0 to single-step)
     * @returns {number} (number of cycles actually "clocked")
     */
    clocker(nCyclesTarget = 0)
    {
        /*
         * NOTE: We can assume that the rom exists here, because we don't call addClocker() it if doesn't.
         */
        this.nCyclesClocked = 0;
        while (this.nCyclesClocked <= nCyclesTarget) {
            if (this.addrStop == this.regPC) {
                this.addrStop = -1;
                this.println("break");
                this.time.stop();
                break;
            }
            let opCode = this.rom.getData(this.regPC);
            let addr = this.regPC;
            this.regPC = (addr + 1) & this.rom.addrMask;
            if (opCode == undefined || !this.decode(opCode, addr)) {
                this.regPC = addr;
                this.println("unimplemented opcode");
                this.time.stop();
                break;
            }
            this.nCyclesClocked += Chip.OP_CYCLES;
        }
        if (nCyclesTarget <= 0) {
            let chip = this;
            this.time.doOutside(function clockerOutside() {
                chip.rom.drawArray();
                chip.println(chip.toString());
            });
        }
        return this.nCyclesClocked;
    }

    /**
     * decode(opCode, addr)
     *
     * Most operations are performed inline, since this isn't a super complex instruction set, but
     * a few are separated into their own handlers (eg, opDISP).
     *
     * @this {Chip}
     * @param {number} opCode (opcode)
     * @param {number} addr (of the opcode)
     * @returns {boolean} (true if opcode successfully decoded, false if unrecognized or unsupported)
     */
    decode(opCode, addr)
    {
        if (opCode & 0x1000) {
            if (opCode & 0x0800) {  // BRC/BRNC
                if (!!(opCode & 0x0400) == this.fCOND) {
                    /*
                     * TODO: Determine whether to use bit 10 from the original PC (addr) or the incremented PC (regPC)
                     */
                    this.regPC = (addr & 0x0400) | (opCode & 0x03FF);
                }
            } else {                // CALL
                this.push(this.regPC);
                this.regPC = opCode & 0x07FF;
            }
            this.fCOND = false;
            return true;
        }

        let range, regSrc, regResult, iOp, base;
        let j, k, l, n, d, b, mask = opCode & Chip.IW_MF.MASK;

        switch(mask) {
        case Chip.IW_MF.MMSD:   // 0x0000: Mantissa Most Significant Digit (D12)
        case Chip.IW_MF.ALL:    // 0x0100: (D0-D15)
        case Chip.IW_MF.MANT:   // 0x0200: Mantissa (D2-D12)
        case Chip.IW_MF.MAEX:   // 0x0300: Mantissa and Exponent (D0-D12)
        case Chip.IW_MF.LLSD:   // 0x0400: Mantissa Least Significant Digit (D2)
        case Chip.IW_MF.EXP:    // 0x0500: Exponent (D0-D1)
        case Chip.IW_MF.FMAEX:  // 0x0700: Flag and Mantissa and Exponent (D0-D13)
        case Chip.IW_MF.D14:    // 0x0800: (D14)
        case Chip.IW_MF.FLAG:   // 0x0900: (D13-D15)
        case Chip.IW_MF.DIGIT:  // 0x0a00: (D14-D15)
        case Chip.IW_MF.D13:    // 0x0d00: (D13)
        case Chip.IW_MF.D15:    // 0x0f00: (D15)
            range = Chip.RANGE[mask];


            j = (opCode & Chip.IW_MF.J_MASK) >> Chip.IW_MF.J_SHIFT;
            k = (opCode & Chip.IW_MF.K_MASK) >> Chip.IW_MF.K_SHIFT;
            l = (opCode & Chip.IW_MF.L_MASK) >> Chip.IW_MF.L_SHIFT;
            n = (opCode & Chip.IW_MF.N_MASK);
            iOp = (n? Chip.OP.SUB : Chip.OP.ADD);

            switch(k) {
            case 0:
            case 1:
            case 2:
            case 3:
                regSrc = this.regsO[k];
                break;
            case 4:
                regSrc = this.regTemp.init(1, range);
                break;
            case 5:
                iOp = (n? Chip.OP.SHR : Chip.OP.SHL);
                break;
            case 6:
                regSrc = this.regTemp.init(this.regR5 & 0xf, range);
                break;
            case 7:
                regSrc = this.regTemp.init(this.regR5 & 0xff, range);
                break;
            }

            switch(l) {
            case 0:
                regResult = this.regsO[j];
                break;
            case 1:
                regResult = (k < 4? this.regsO[k] : undefined);
                break;
            case 2:
                regResult = (k < 5? this.regSupp : (k == 5? this.regsO[j] : undefined));
                break;
            case 3:
                if (!n) {

                    this.regA.xchg(regSrc, range);
                } else {

                    this.regsO[j].move(regSrc, range);
                }
                return true;
            }

            if (!regResult) break;

            base = (opCode >= Chip.IW_MF.D14? 16 : this.base);

            switch(iOp) {
            case Chip.OP.ADD:
                regResult.add(this.regsO[j], regSrc, range, base);
                break;
            case Chip.OP.SUB:
                regResult.sub(this.regsO[j], regSrc, range, base);
                break;
            case Chip.OP.SHL:
                regResult.shl(this.regsO[j], range);
                break;
            case Chip.OP.SHR:
                regResult.shr(this.regsO[j], range);
                break;
            }
            return true;

        case Chip.IW_MF.FF:     // 0x0c00: (used for flag operations)
            j = (opCode & Chip.IW_FF.J_MASK) >> Chip.IW_FF.J_SHIFT;
            d = (opCode & Chip.IW_FF.D_MASK) >> Chip.IW_FF.D_SHIFT;
            b = 1 << ((opCode & Chip.IW_FF.B_MASK) >> Chip.IW_FF.B_SHIFT);
            if (!d) break;
            d += 12;
            /*
             * For the following bit operations (SET, RESET, TEST, and TOGGLE, displayed by disassemble()
             * as "SET", "CLR", "TST", and "NOT") are rather trivial, so I didn't bother adding Reg64 methods
             * for them (eg, setBit, resetBit, testBit, toggleBit).
             */
            switch(opCode & Chip.IW_FF.MASK) {
            case Chip.IW_FF.SET:
                this.regsO[j].digits[d] |= b;
                break;
            case Chip.IW_FF.RESET:
                this.regsO[j].digits[d] &= ~b;
                break;
            case Chip.IW_FF.TEST:
                if (this.regsO[j].digits[d] & b) this.fCOND = true;
                break;
            case Chip.IW_FF.TOGGLE:
                this.regsO[j].digits[d] ^= b;
                break;
            }
            return true;

        case Chip.IW_MF.PF:     // 0x0e00: (used for misc operations)
            switch(opCode & Chip.IW_PF.MASK) {
            case Chip.IW_PF.STYA:       // 0x0000: Contents of storage register Y defined by RAB loaded into operational register A (Yn -> A)
                this.regA.store(this.regsY[this.regRAB]);
                break;
            case Chip.IW_PF.RABI:       // 0x0001: Bits 4-6 of instruction are stored in RAB
                this.regRAB = (opCode >> 4) & 0x7;
                break;
            case Chip.IW_PF.BRR5:       // 0x0002: Branch to R5
                /*
                 * TODO: Determine whether this type of BRANCH should set fCOND to false like other branches do
                 */
                this.regPC = this.regR5;
                break;
            case Chip.IW_PF.RET:        // 0x0003: Return
                this.fCOND = false;
                this.regPC = this.pop();
                break;
            case Chip.IW_PF.STAX:       // 0x0004: Contents of operational register A loaded into storage register X defined by RAB (A -> Xn)
                this.regsX[this.regRAB].store(this.regA);
                break;
            case Chip.IW_PF.STXA:       // 0x0005: Contents of storage register X defined by RAB loaded into operational register A (Xn -> A)
                this.regA.store(this.regsX[this.regRAB]);
                break;
            case Chip.IW_PF.STAY:       // 0x0006: Contents of operational register A loaded into storage register Y defined by RAB (A -> Yn)
                this.regsY[this.regRAB].store(this.regA);
                break;
            case Chip.IW_PF.DISP:       // 0x0007: registers A and B are output to the Display Decoder and the Keyboard is scanned
                return this.opDISP();
            case Chip.IW_PF.BCDS:       // 0x0008: BCD set: enables BCD corrector in arithmetic unit
                this.base = 10;
                break;
            case Chip.IW_PF.BCDR:       // 0x0009: BCD reset: disables BCD corrector in arithmetic unit (which then functions as hexadecimal)
                this.base = 16;
                break;
            case Chip.IW_PF.RABR5:      // 0x000A: LSD of R5 (3 bits) is stored in RAB
                this.regRAB = this.regR5 & 0x7;
                break;
            default:
                return false;
            }
            return true;

        case Chip.IW_MF.RES1:   // 0x0600: (reserved)
        case Chip.IW_MF.RES2:   // 0x0b00: (reserved)
        default:
            break;
        }
        return false;
    }

    /**
     * disassemble(opCode, addr, fCompact)
     *
     * Returns a string representation of the selected instruction.
     *
     * The TI-57 patents suggest mnemonics for some of the instructions, but not all, so I've taken
     * some liberties in the interests of clarity and familiarity.  Special-purpose instructions like
     * "BCDS" and "BCDR" are displayed as-is, but for more general-purpose instructions, I've adopted
     * the following format:
     *
     *      operation   destination,input(s)[,mask]
     *
     * Instructions that the patent refers to as "STYA", "STAY", "STXA", and "STAX" are all displayed
     * as "STORE" instructions; eg, instead of "STAX", I use:
     *
     *      STORE       X[RAB],A
     *
     * Instructions that use masks are displayed as either "LOAD", "MOVE", or "XCHG".  If the result
     * of the operation is suppressed, the destination will be displayed as "NUL" instead of a register.
     * And if the inputs are being added, subtracted, shifted left, or shifted right, they will be
     * displayed with "+", "-", "<<", or ">>", respectively.  Finally, the 16-digit mask is displayed,
     * as a series of hex digits rather than the unmemorable names used in the patents (eg, MMSD, FMAEX,
     * etc).  I do use the patent nomenclature internally, just not for display purposes.
     *
     * @this {Chip}
     * @param {number|undefined} opCode
     * @param {number} addr
     * @param {boolean} [fCompact]
     * @returns {string}
     */
    disassemble(opCode, addr, fCompact = false)
    {
        let sOp = "???", sOperands = "";

        if (opCode & 0x1000) {
            let v;
            if (opCode & 0x0800) {
                sOp = "BR";
                if (opCode & 0x0400) {
                    sOp += "C";
                } else {
                    sOp += "NC";
                }
                v = (addr & 0x0400) | (opCode & 0x03FF);
            } else {
                sOp = "CALL";
                v = opCode & 0x07FF;
            }
            sOperands = this.sprintf("0x%04x", v);
        }
        else if (opCode >= 0) {
            let mask = opCode & Chip.IW_MF.MASK;

            switch(mask) {
            case Chip.IW_MF.MMSD:   // 0x0000: Mantissa Most Significant Digit (D12)
            case Chip.IW_MF.ALL:    // 0x0100: (D0-D15)
            case Chip.IW_MF.MANT:   // 0x0200: Mantissa (D2-D12)
            case Chip.IW_MF.MAEX:   // 0x0300: Mantissa and Exponent (D0-D12)
            case Chip.IW_MF.LLSD:   // 0x0400: Mantissa Least Significant Digit (D2)
            case Chip.IW_MF.EXP:    // 0x0500: Exponent (D0-D1)
            case Chip.IW_MF.FMAEX:  // 0x0700: Flag and Mantissa and Exponent (D0-D13)
            case Chip.IW_MF.D14:    // 0x0800: (D14)
            case Chip.IW_MF.FLAG:   // 0x0900: (D13-D15)
            case Chip.IW_MF.DIGIT:  // 0x0a00: (D14-D15)
            case Chip.IW_MF.D13:    // 0x0d00: (D13)
            case Chip.IW_MF.D15:    // 0x0f00: (D15)
                let sMask = this.toStringMask(mask);
                let j = (opCode & Chip.IW_MF.J_MASK) >> Chip.IW_MF.J_SHIFT;
                let k = (opCode & Chip.IW_MF.K_MASK) >> Chip.IW_MF.K_SHIFT;
                let l = (opCode & Chip.IW_MF.L_MASK) >> Chip.IW_MF.L_SHIFT;
                let n = (opCode & Chip.IW_MF.N_MASK);

                sOp = "LOAD";
                let sOperator = "";
                let sDst = "?", sSrc = "?";

                if (!n) {
                    sOperator = (k == 5? "<<" : "+");
                } else {
                    sOperator = (k == 5? ">>" : "-");
                }

                switch(l) {
                case 0:
                    sDst = Chip.OP_INPUTS[j];
                    break;
                case 1:
                    if (k < 4) sDst = Chip.OP_INPUTS[k];
                    break;
                case 2:
                    if (k < 6) sDst = "NUL";    // "suppressed" operation
                    break;
                case 3:
                    if (!n) {
                        sOp = "XCHG";
                        if (!j) sDst = "A";     // j != 0 or k >= 4 is invalid
                        if (k < 4) sSrc = Chip.OP_INPUTS[k];
                    } else {
                        sOp = "MOVE";
                        sDst = Chip.OP_INPUTS[j];
                        sSrc = Chip.OP_INPUTS[k]; // k == 5 is invalid
                    }
                    k = -1;
                    break;
                }

                switch(k) {
                case 0:
                case 1:
                case 2:
                case 3:
                    sSrc = Chip.OP_INPUTS[j] + sOperator + Chip.OP_INPUTS[k];
                    break;
                case 4:
                case 5:
                    sSrc = Chip.OP_INPUTS[j] + sOperator + "1";
                    break;
                case 6:
                    sSrc = Chip.OP_INPUTS[j] + sOperator + "R5L";
                    break;
                case 7:
                    sSrc = Chip.OP_INPUTS[j] + sOperator + "R5";
                    break;
                }
                sOperands = sDst + "," + sSrc + "," + sMask;
                break;

            case Chip.IW_MF.FF:     // 0x0c00: (used for flag operations)
                switch(opCode & Chip.IW_FF.MASK) {
                case Chip.IW_FF.SET:
                    sOp = "SET";
                    break;
                case Chip.IW_FF.RESET:
                    sOp = "CLR";
                    break;
                case Chip.IW_FF.TEST:
                    sOp = "TST";
                    break;
                case Chip.IW_FF.TOGGLE:
                    sOp = "NOT";
                    break;
                }
                sOperands = this.regsO[(opCode & Chip.IW_FF.J_MASK) >> Chip.IW_FF.J_SHIFT].name;
                let d = ((opCode & Chip.IW_FF.D_MASK) >> Chip.IW_FF.D_SHIFT);
                sOperands += '[' + (d? (d + 12) : '?') + ':' + ((opCode & Chip.IW_FF.B_MASK) >> Chip.IW_FF.B_SHIFT) + ']';
                break;

            case Chip.IW_MF.PF:     // 0x0e00: (used for misc operations)
                let sStore = "STORE";
                switch(opCode & Chip.IW_PF.MASK) {
                case Chip.IW_PF.STYA:   // 0x0000: Contents of storage register Y defined by RAB loaded into operational register A (Yn -> A)
                    sOp = sStore;
                    sOperands = "A,Y[RAB]";
                    break;
                case Chip.IW_PF.RABI:   // 0x0001: Bits 4-6 of instruction are stored in RAB
                    sOp = sStore;
                    sOperands = "RAB," + ((opCode & 0x70) >> 4);
                    break;
                case Chip.IW_PF.BRR5:   // 0x0002: Branch to R5
                    sOp = "BR";
                    sOperands = "R5";
                    break;
                case Chip.IW_PF.RET:    // 0x0003: Return
                    sOp = "RET";
                    break;
                case Chip.IW_PF.STAX:   // 0x0004: Contents of operational register A loaded into storage register X defined by RAB (A -> Xn)
                    sOp = sStore;
                    sOperands = "X[RAB],A";
                    break;
                case Chip.IW_PF.STXA:   // 0x0005: Contents of storage register X defined by RAB loaded into operational register A (Xn -> A)
                    sOp = sStore;
                    sOperands = "A,X[RAB]";
                    break;
                case Chip.IW_PF.STAY:   // 0x0006: Contents of operational register A loaded into storage register Y defined by RAB (A -> Yn)
                    sOp = sStore;
                    sOperands = "Y[RAB],A";
                    break;
                case Chip.IW_PF.DISP:   // 0x0007: registers A and B are output to the Display Decoder and the Keyboard is scanned
                    sOp = "DISP";
                    break;
                case Chip.IW_PF.BCDS:   // 0x0008: BCD set: enables BCD corrector in arithmetic unit
                    sOp = "BCDS";
                    break;
                case Chip.IW_PF.BCDR:   // 0x0009: BCD reset: disables BCD corrector in arithmetic unit (which then functions as hexadecimal)
                    sOp = "BCDR";
                    break;
                case Chip.IW_PF.RABR5:  // 0x000A: LSD of R5 (3 bits) is stored in RAB
                    sOp = sStore;
                    sOperands = "RAB,R5L";
                    break;
                default:
                    break;
                }
                break;

            case Chip.IW_MF.RES1:   // 0x0600: (reserved)
            case Chip.IW_MF.RES2:   // 0x0b00: (reserved)
            default:
                break;
            }
        }
        return this.sprintf(fCompact? "%03X %04X\n" : "0x%04x: 0x%04x  %-8s%s\n", addr, opCode, sOp, sOperands);
    }

    /**
     * loadState(state)
     *
     * If any saved values don't match (possibly overridden), abandon the given state and return false.
     * 
     * @this {Chip}
     * @param {Object|Array|null} state
     * @returns {boolean}
     */
    loadState(state)
    {
        if (state) {
            let stateChip = state['stateChip'] || state[0];
            if (!stateChip || !stateChip.length) {
                this.println("Invalid saved state");
                return false;
            }
            let version = stateChip.shift();
            if ((version|0) !== (Chip.VERSION|0)) {
                this.printf("Saved state version mismatch: %3.2f\n", version);
                return false;
            }
            try {
                this.regsO.forEach(reg => reg.set(stateChip.shift()));
                this.regsX.forEach(reg => reg.set(stateChip.shift()));
                this.regsY.forEach(reg => reg.set(stateChip.shift()));
                this.regSupp.set(stateChip.shift());
                this.regTemp.set(stateChip.shift());
                this.base = stateChip.shift();
                this.fCOND = stateChip.shift();
                this.regRAB = stateChip.shift();
                this.regR5 = stateChip.shift();
                this.regPC = stateChip.shift();
                this.stack = stateChip.shift();
                this.regKey = stateChip.shift();
            } catch(err) {
                this.println("Chip state error: " + err.message);
                return false;
            }
            let stateROM = state['stateROM'] || state[1];
            if (stateROM && this.rom) {
                if (!this.rom.loadState(stateROM)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * onCommand(aTokens, machine)
     *
     * Processes commands for our "mini-debugger".
     *
     * @this {Chip}
     * @param {Array.<string>} aTokens
     * @param {Device} [machine]
     * @returns {boolean} (true if processed, false if not)
     */
    onCommand(aTokens, machine)
    {
        let sResult = "";
        let s = aTokens[1];
        let addr = Number.parseInt(aTokens[2], 16);
        if (isNaN(addr)) addr = -1;
        let nWords = Number.parseInt(aTokens[3], 10) || 8;

        this.nStringFormat = Chip.SFORMAT.DEFAULT;
        
        switch(s[0]) {
        case 'b':
            let c = s.substr(1);
            let condition;
            if (c == 'l') {
                for (c in Chip.BREAK) {
                    condition = Chip.BREAK[c];
                    sResult += "break on " + condition + " (b" + c + "): " + (this.breakConditions[c] || false) + '\n';
                }
                break;
            }
            condition = Chip.BREAK[c];
            if (condition) {
                this.breakConditions[c] = !this.breakConditions[c];
                sResult = "break on " + condition + " (b" + c + "): " + this.breakConditions[c];
            } else {
                if (c) sResult = "unrecognized break option '" + c + "'";
            }
            break;

        case 'g':
            if (this.time.start()) {
                this.addrStop = addr;
            } else {
                sResult = "already started";
            }
            break;

        case 'h':
            if (!this.time.stop()) sResult = "already stopped";
            break;

        case 't':
            if (s[1] == 'c') this.nStringFormat = Chip.SFORMAT.COMPACT;
            nWords = Number.parseInt(aTokens[2], 10) || 1;
            this.time.onStep(nWords);
            if (machine) machine.sCommandPrev = aTokens[0];
            break;

        case 'r':
            if (s[1] == 'c') this.nStringFormat = Chip.SFORMAT.COMPACT;
            this.setRegister(s.substr(1), addr);
            sResult += this.toString(s[1]);
            if (machine) machine.sCommandPrev = aTokens[0];
            break;

        case 'u':
            addr = (addr >= 0? addr : (this.addrPrev >= 0? this.addrPrev : this.regPC));
            while (nWords--) {
                let opCode = this.rom && this.rom.getData(addr, true);
                if (opCode == undefined) break;
                sResult += this.disassemble(opCode, addr++);
            }
            this.addrPrev = addr;
            if (machine) machine.sCommandPrev = aTokens[0];
            break;

        case '?':
            sResult = "available commands:";
            Chip.COMMANDS.forEach(cmd => {sResult += '\n' + cmd;});
            break;

        default:
            if (aTokens[0]) {
                sResult = "unrecognized command '" + aTokens[0] + "' (try '?')";
            }
            break;
        }
        if (sResult) this.println(sResult.trim());
        return true;
    }

    /**
     * onInput(col, row)
     *
     * Called by the Input device to provide notification of key presses and releases.
     *
     * Converts a logical (col,row), where the top left keyboard position is (0,0), into an 8-bit physical
     * location value, where bits 0-3 are the row (0-based) and bits 4-7 are the col (1-based).  Moreover,
     * if either col or row is negative, then all bits are cleared.
     *
     * @this {Chip}
     * @param {number} col
     * @param {number} row
     */
    onInput(col, row)
    {
        let b = 0;
        if (col >= 0 && row >= 0) {

            b = row | ((col + 1) << 4);
        }
        this.regKey = b;
    }

    /**
     * onPower(fOn)
     *
     * Automatically called by the Machine device after all other devices have been powered up (eg, after
     * a page load event), as well as when all devices are being powered down (eg, before a page unload event).
     *
     * May subsequently be called by the Input device to provide notification of a user-initiated power event
     * (eg, toggling a power button); in this case, fOn should NOT be set, so that no state is loaded or saved.
     *
     * @this {Chip}
     * @param {boolean} [fOn] (true to power on, false to power off; otherwise, toggle it)
     */
    onPower(fOn)
    {
        if (fOn == undefined) {
            fOn = !this.time.isRunning();
            if (fOn) this.regPC = 0;
        }
        if (fOn) {
            this.time.start();
        } else {
            this.time.stop();
            this.clearDisplays();
        }
    }

    /**
     * onReset()
     *
     * Called by the Input device to provide notification of a reset event.
     *
     * @this {Chip}
     */
    onReset()
    {
        this.println("reset");
        this.regPC = 0;
        this.clearDisplays();
        if (!this.time.isRunning()) {
            this.status();
        }
    }

    /**
     * onRestore()
     *
     * @this {Chip}
     */
    onRestore()
    {
        this.loadState(this.loadLocalStorage());
    }

    /**
     * onSave()
     *
     * @this {Chip}
     */
    onSave()
    {
        this.saveLocalStorage(this.saveState());
    }

    /**
     * opDISP()
     *
     * Handles the DISP opcode.  The following details/tables are from the TI patents:
     *
     *      Register A and Register B are outputted to the display decoder and the keyboard is scanned.
     *      A closed keyboard switch loads K5 and sets condition latch.
     *
     *      Display decoder receives a data representing numerals to be displayed from operational register A.
     *
     *      Display decoder is also responsive to the data from operational register B, which indicates where
     *      the decimal point is to be displayed among the numerals, whether minus signs are to be provided,
     *      and which digits are to be blanked, according to the codes listed in Table III.
     *
     *      TABLE II
     *
     *          Register R5
     *          --------------------------------
     *             7   6   5   4   3   2   1   0
     *           KR8 KR7 KR6 KR5 KR4 KR3 KR2 KR1
     *
     *            K             KS (Keyboard Line Actuated)
     *          -------------------------------------------
     *           001            K1
     *           010            K2
     *           011            K3
     *           100            K4
     *           101            K5
     *
     *            K             KS (Segment Scan Line Actuated)
     *          -----------------------------------------------
     *           000            KS0     (SEG E)
     *           001            KS1     (SEG F)
     *           010            KS2     (SEG B)
     *           011            KS3     (SEG G)
     *           100            KS4     (SEG C)
     *           101            KS5     (SEG A)
     *           110            KS6     (SEG D/D12)
     *
     *      TABLE III
     *
     *          Register B
     *          Control Code    Function
     *          ------------    ------------------------------------------------------------
     *           1XXX           Display digit is blanked in the corresponding digit position
     *           0XX1           Turns on minus sign (Segment G) in corresponding digit position
     *           XX1X           Turns on decimal point and digit specified by register A in corresponding digit position
     *           0XX0           Turns on digit specified by Register A in corresponding digit position
     *
     * @this {Chip}
     * @returns {boolean} (true to indicate the opcode was successfully decoded)
     */
    opDISP()
    {
        this.checkBreakCondition('o');

        if (this.led) {
            for (let col = 0, iDigit = 11; iDigit >= 0; col++, iDigit--) {
                let ch;
                if (this.regB.digits[iDigit] & 0x8) {
                    ch = ' ';
                }
                else if (this.regB.digits[iDigit] & 0x1) {
                    ch = '-';
                }
                else {
                    ch = Device.HexUpperCase[this.regA.digits[iDigit]];
                }
                if (this.led.setLEDState(col, 0, ch, (this.regB.digits[iDigit] & 0x2)? LED.FLAGS.PERIOD : 0)) {
                    this.checkBreakCondition('om');
                }
            }
            this.updateIndicators();
        }

        /*
         * The TI patents indicate that DISP operations slow the clock by a factor of 4, and on top of
         * that, the display scan generator uses a HOLD signal to prevent the Program Counter from being
         * incremented while it cycles through all 8 possible segments for all digits, so the total delay
         * imposed by DISP is a factor of 32.  Since every instruction already accounts for OP_CYCLES once,
         * I need to account for it here 31 more times.
         */
        this.nCyclesClocked += Chip.OP_CYCLES * 31;

        if (this.regKey) {
            this.regR5 = this.regKey;
            this.fCOND = true;
            this.checkBreakCondition('i');
        }

        return true;
    }

    /**
     * pop()
     *
     * @this {Chip}
     * @returns {number}
     */
    pop()
    {
        /*
         * Normally, you would simply decrement a stack pointer, but that's not how this stack was implemented.
         */
        let addr = this.stack[0];
        let i = 0, j = this.stack.length - 1;
        while (i < j) this.stack[i] = this.stack[++i];
        this.stack[i] = -1;

        return addr;
    }

    /**
     * push(addr)
     *
     * @this {Chip}
     * @param {number} addr
     */
    push(addr)
    {
        /*
         * Normally, you would simply increment a stack pointer, but that's not how this stack was implemented.
         */
        let i = this.stack.length - 1;
        /*
         * Apparently, legitimate values are allowed to fall off the end of the stack, so we can't assert overflow.
         *
         *
         */
        while (i > 0) this.stack[i] = this.stack[--i];
        this.stack[0] = addr;
    }

    /**
     * saveState()
     *
     * @this {Chip}
     * @returns {Array}
     */
    saveState()
    {
        let state = [[],[]];
        let stateChip = state[0];
        let stateROM = state[1];
        stateChip.push(Chip.VERSION);
        this.regsO.forEach(reg => stateChip.push(reg.get()));
        this.regsX.forEach(reg => stateChip.push(reg.get()));
        this.regsY.forEach(reg => stateChip.push(reg.get()));
        stateChip.push(this.regSupp.get());
        stateChip.push(this.regTemp.get());
        stateChip.push(this.base);
        stateChip.push(this.fCOND);
        stateChip.push(this.regRAB);
        stateChip.push(this.regR5);
        stateChip.push(this.regPC);
        stateChip.push(this.stack);
        stateChip.push(this.regKey);
        if (this.rom) this.rom.saveState(stateROM);
        return state;
    }

    /**
     * setRegister(name, value)
     *
     * @this {Chip}
     * @param {string} name
     * @param {number} value
     */
    setRegister(name, value)
    {
        if (!name || value < 0) return;

        switch(name) {
        case "pc":
            this.regPC = value;
            break;
        default:
            this.println("unrecognized register: " + name);
            break;
        }
    }
    /**
     * status()
     *
     * This is called by the Machine after all the individual devices have been initialized.
     *
     * @this {Chip}
     */
    status()
    {
        this.println(this.toString());
    }

    /**
     * toString(options, regs)
     *
     * @this {Chip}
     * @param {string} [options]
     * @param {Array.<Reg64>} [regs]
     * @returns {string}
     */
    toString(options = "", regs = null)
    {
        let s = "";
        if (this.nStringFormat) {
            if (this.rom) {
                s += this.disassemble(this.rom.getData(this.regPC, true), this.regPC, true);
            }
            s += "  ";
            for (let i = 0, n = this.regsO.length; i < n; i++) {
                s += this.regsO[i].toString() + ' ';
            }
            s += "\n ";
            s += " COND=" + (this.fCOND? 1 : 0);
            s += " BASE=" + this.base;
            s += " R5=" + this.sprintf("%02X", this.regR5);
            s += " RAB=" + this.regRAB + " ST=";
            this.stack.forEach((addr, i) => {s += this.sprintf("%03X ", (addr < 0? 0 : (addr & 0xfff)));});
            return s.trim();
        }
        if (regs) {
            for (let i = 0, n = regs.length >> 1; i < n; i++) {
                s += regs[i].toString(true) + '  ' + regs[i+n].toString(true) + '\n';
            }
            return s;
        }
        s += this.toString(options, this.regsO);
        if (options.indexOf('a') >= 0) {
            s += this.toString(options, this.regsX);
            s += this.toString(options, this.regsY);
        }
        s += "COND=" + (this.fCOND? 1 : 0);
        s += " BASE=" + this.base;
        s += " R5=" + this.sprintf("0x%02x", this.regR5);
        s += " RAB=" + this.regRAB + ' ';
        this.stack.forEach((addr, i) => {s += this.sprintf("ST%d=0x%04x ", i, addr & 0xffff);});
        if (this.rom) {
            s += '\n' + this.disassemble(this.rom.getData(this.regPC, true), this.regPC);
        }
        this.addrPrev = this.regPC;
        return s.trim();
    }

    /**
     * toStringMask(mask)
     *
     * @this {Chip}
     * @param {number} mask
     * @returns {string}
     */
    toStringMask(mask)
    {
        let s = "";
        let range = Chip.RANGE[mask];
        for (let i = 0; i < 16; i++) {
            if (!(i % 4)) s = ' ' + s;
            s = (range? (i >= range[0] && i <= range[1]? 'F' : '0') : '?') + s;
        }
        return s;
    }

    /**
     * updateIndicators(on)
     *
     * I made the following observations while running the TI-57's 1501 ROM:
     *
     *      "2nd"   C[14] bit 3 set
     *      "INV"   B[15] bit 2 set
     *      "Deg"   X4[15] == 0x0
     *      "Rad"   X4[15] == 0x4
     *      "Grad"  X4[15] == 0xC
     *
     * Similarly, for the TI-55's 1503 ROM:
     *
     *      "2nd"   B[15] bit 2 set
     *      "INV"   D[15] bit 3 set
     *      "Deg"   C[15] == 0x0
     *      "Rad"   C[15] == 0x1
     *      "Grad"  C[15] == 0x2
     *
     * If this is the first time any of the indicator properties (ie, f2nd, fINV, or angleMode) have been initialized,
     * we will also propagate the LED display color (this.led.color) to the indicator's color, so that the colors of all
     * the elements overlaid on the display match.
     *
     * NOTE: These indicators are specific to locations chosen by the ROM, not by the chip's hardware, but since the
     * ROMs are closely tied to their respective chips, I'm going to cheat and just check the chip type.
     *
     * @this {Chip}
     * @param {boolean} [on] (default is true, to display all active indicators; set to false to force all indicators off)
     */
    updateIndicators(on = true)
    {
        let element;
        let f2nd = on && (this.type == Chip.TYPE.TMS1501? !!(this.regC.digits[14] & 0x8) : !!(this.regB.digits[15] & 0x4));
        if (this.f2nd !== f2nd) {
            if (element = this.bindings['2nd']) {
                element.style.opacity = f2nd? "1" : "0";
                if (this.f2nd === undefined && this.led) element.style.color = this.led.color;
            }
            this.f2nd = f2nd;
        }
        let fINV = on && (this.type == Chip.TYPE.TMS1501? !!(this.regB.digits[15] & 0x4) : !!(this.regD.digits[15] & 0x8));
        if (this.fINV !== fINV) {
            if (element = this.bindings['INV']) {
                element.style.opacity = fINV? "1" : "0";
                if (this.fINV === undefined && this.led) element.style.color = this.led.color;
            }
            this.fINV = fINV;
        }
        let angleBits = (this.type == Chip.TYPE.TMS1501? (this.regsX[4].digits[15] >> 2) : this.regC.digits[15]);
        let angleMode = on? ((!angleBits)? Chip.ANGLEMODE.DEGREES : (angleBits == 1)? Chip.ANGLEMODE.RADIANS : Chip.ANGLEMODE.GRADIENTS) : Chip.ANGLEMODE.OFF;
        if (this.angleMode !== angleMode) {
            if (element = this.bindings['Deg']) {
                element.style.opacity = (angleMode == Chip.ANGLEMODE.DEGREES)? "1" : "0";
                if (this.angleMode === undefined && this.led) element.style.color = this.led.color;
            }
            if (element = this.bindings['Rad']) {
                element.style.opacity = (angleMode == Chip.ANGLEMODE.RADIANS)? "1" : "0";
                if (this.angleMode === undefined && this.led) element.style.color = this.led.color;
            }
            if (element = this.bindings['Grad']) {
                element.style.opacity = (angleMode == Chip.ANGLEMODE.GRADIENTS)? "1" : "0";
                if (this.angleMode === undefined && this.led) element.style.color = this.led.color;
            }
            this.angleMode = angleMode;
        }
    }

    /**
     * updateStatus(fTransition)
     *
     * Enumerate all bindings and update their values.
     *
     * Called by Time's updateStatus() function whenever 1) its YIELDS_PER_UPDATE threshold is reached
     * (default is twice per second), 2) a step() operation has just finished (ie, the device is being
     * single-stepped), and 3) a start() or stop() transition has occurred.
     *
     * @this {Chip}
     * @param {boolean} [fTransition]
     */
    updateStatus(fTransition)
    {
        for (let binding in this.bindings) {
            let regMap = this.regMap[binding];
            if (regMap) {
                let sValue;
                let reg = regMap[0];
                let digit = regMap[1];
                if (digit < 0) {
                    sValue = reg.toString();
                } else {
                    sValue = Device.HexUpperCase[reg.digits[digit]];
                }
                this.setBindingText(binding, sValue);
            }
        }
        if (fTransition && !this.time.isRunning()) {
            this.rom.drawArray();
            this.println(this.toString());
        }
    }
}

Chip.IW_MF = {          // Instruction Word Mask Field
    MASK:   0x0F00,
    MMSD:   0x0000,     // Mantissa Most Significant Digit (D12)
    ALL:    0x0100,     // (D0-D15)
    MANT:   0x0200,     // Mantissa (D2-D12)
    MAEX:   0x0300,     // Mantissa and Exponent (D0-D12)
    LLSD:   0x0400,     // Mantissa Least Significant Digit (D2)
    EXP:    0x0500,     // Exponent (D0-D1)
    RES1:   0x0600,     // (reserved)
    FMAEX:  0x0700,     // Flag and Mantissa and Exponent (D0-D13)
    D14:    0x0800,     // (D14)
    FLAG:   0x0900,     // (D13-D15)
    DIGIT:  0x0A00,     // (D14-D15)
    RES2:   0x0B00,     // (reserved)
    FF:     0x0C00,     // FF used for additional instruction decoding
    D13:    0x0D00,     // (D13)
    PF:     0x0E00,     // PF used for additional instruction decoding
    D15:    0x0F00,     // (D15)
    J_MASK: 0x00C0,
    J_SHIFT:     6,
    K_MASK: 0x0038,
    K_SHIFT:     3,
    L_MASK: 0x0006,
    L_SHIFT:     1,
    N_MASK: 0x0001
};

Chip.IW_FF = {          // Instruction Word Flag Field (used when the Mask Field is FF)
    MASK:   0x0003,
    SET:    0x0000,
    RESET:  0x0001,
    TEST:   0x0002,
    TOGGLE: 0x0003,
    J_MASK: 0x00C0,
    J_SHIFT:     6,
    D_MASK: 0x0030,
    D_SHIFT:     4,
    B_MASK: 0x000C,
    B_SHIFT:     2,
};

Chip.IW_PF = {          // Instruction Word Misc Field (used when the Mask Field is PF)
    MASK:   0x000F,
    STYA:   0x0000,     // Contents of storage register Y defined by RAB loaded into operational register A (Yn -> A)
    RABI:   0x0001,     // Bits 4-6 of instruction are stored in RAB
    BRR5:   0x0002,     // Branch to R5
    RET:    0x0003,     // Return
    STAX:   0x0004,     // Contents of operational register A loaded into storage register X defined by RAB (A -> Xn)
    STXA:   0x0005,     // Contents of storage register X defined by RAB loaded into operational register A (Xn -> A)
    STAY:   0x0006,     // Contents of operational register A loaded into storage register Y defined by RAB (A -> Yn)
    DISP:   0x0007,     // registers A and B are output to the Display Decoder and the Keyboard is scanned
    BCDS:   0x0008,     // BCD set: enables BCD corrector in arithmetic unit
    BCDR:   0x0009,     // BCD reset: disables BCD corrector in arithmetic unit (which then functions as hexadecimal)
    RABR5:  0x000A,     // LSD of R5 (3 bits) is stored in RAB
    RES1:   0x000B,     // (reserved)
    RES2:   0x000C,     // (reserved)
    RES3:   0x000D,     // (reserved)
    RES4:   0x000E,     // (reserved)
    RES5:   0x000F      // (reserved)
};

Chip.RANGE = {
    [Chip.IW_MF.MMSD]:  [12,12],        // 0x0000: Mantissa Most Significant Digit (D12)
    [Chip.IW_MF.ALL]:   [0,15],         // 0x0100: (D0-D15)
    [Chip.IW_MF.MANT]:  [2,12],         // 0x0200: Mantissa (D2-D12)
    [Chip.IW_MF.MAEX]:  [0,12],         // 0x0300: Mantissa and Exponent (D0-D12)
    [Chip.IW_MF.LLSD]:  [2,2],          // 0x0400: Mantissa Least Significant Digit (D2)
    [Chip.IW_MF.EXP]:   [0,1],          // 0x0500: Exponent (D0-D1)
    [Chip.IW_MF.FMAEX]: [0,13],         // 0x0700: Flag and Mantissa and Exponent (D0-D13)
    [Chip.IW_MF.D14]:   [14,14],        // 0x0800: (D14)
    [Chip.IW_MF.FLAG]:  [13,15],        // 0x0900: (D13-D15)
    [Chip.IW_MF.DIGIT]: [14,15],        // 0x0a00: (D14-D15)
    [Chip.IW_MF.D13]:   [13,13],        // 0x0d00: (D13)
    [Chip.IW_MF.D15]:   [15,15],        // 0x0f00: (D15)
};

Chip.OP_CYCLES = 128;                   // default number of cycles per instruction

/*
 * Table of operations used by the disassembler for "masked" operations
 */
Chip.OP = {
    ADD:    0,
    SUB:    1,
    SHL:    2,
    SHR:    3,
    XCHG:   4,
    MOVE:   5
};

Chip.TYPE = {
    TMS1501:    1501,       // aka TI-57
    TMS1502:    1502,       // aka TI-42 ("MBA")
    TMS1503:    1503        // aka TI-55
};

Chip.ANGLEMODE = {
    OFF:        0,
    DEGREES:    1,
    RADIANS:    2,
    GRADIENTS:  3
};

Chip.BREAK = {
    'i':    "input",
    'o':    "output",
    'om':   "output modification"
};

Chip.SFORMAT = {
    DEFAULT:    0,
    COMPACT:    1
};

/*
 * Table of operational inputs used by the disassembler for "masked" operations
 */
Chip.OP_INPUTS = ["A","B","C","D","1","?","R5L","R5"];

Chip.COMMANDS = [
    "b[c]\t\tbreak on condition c",
    "bl\t\tlist break conditions",
    "g [addr]\trun (to addr)",
    "h\t\thalt",
    "r[a]\t\tdump (all) registers",
    "t [n]\t\tstep (n instructions)",
    "u [addr] [n]\tdisassemble (at addr)"
];

Chip.VERSION    = 1.11;

MACHINE = "TMS1500";

/**
 * @copyright http://pcjs.org/modules/devices/machine.js (C) Jeff Parsons 2012-2017
 */

/**
 * @class {Machine}
 * @unrestricted
 */
class Machine extends Device {
    /**
     * Machine(idMachine, sConfig)
     *
     * Sample config:
     *
     *    {
     *      "ti57": {
     *        "class": "Machine",
     *        "type": "TI57",
     *        "name": "TI-57 Programmable Calculator Simulation",
     *        "version": 1.10,
     *        "autoPower": true,
     *        "bindings": {
     *          "clear": "clearTI57",
     *          "print": "printTI57"
     *        }
     *      },
     *      "chip": {
     *        "class": "Chip",
     *        "type": "TMS-1500",
     *        "input": "buttons",
     *        "output": "display"
     *      },
     *      "clock": {
     *        "class": "Time",
     *        "cyclesPerSecond": 650000
     *        "bindings": {
     *          "run": "runTI57",
     *          "speed": "speedTI57",
     *          "step": "stepTI57"
     *        },
     *        "overrides": ["cyclesPerSecond"]
     *      },
     *      "display": {
     *        "class": "LED",
     *        "type": 3,
     *        "cols": 12,
     *        "rows": 1,
     *        "color": "red",
     *        "bindings": {
     *          "container": "displayTI57"
     *        },
     *        "overrides": ["color","backgroundColor"]
     *      },
     *      "buttons": {
     *        "class": "Input",
     *        "map": [
     *          ["2nd",  "inv",  "lnx",  "\\b",  "clr"],
     *          ["lrn",  "xchg", "sq",   "sqrt", "rcp"],
     *          ["sst",  "sto",  "rcl",  "sum",  "exp"],
     *          ["bst",  "ee",   "(",    ")",    "/"],
     *          ["gto",  "7",    "8",    "9",    "*"],
     *          ["sbr",  "4",    "5",    "6",    "-"],
     *          ["rst",  "1",    "2",    "3",    "+"],
     *          ["r/s",  "0",    ".",    "+/-",  "=|\\r"]
     *        ],
     *        "location": [139, 325, 368, 478, 0.34, 0.5, 640, 853, 418, 180, 75, 36],
     *        "bindings": {
     *          "surface": "imageTI57",
     *          "power": "powerTI57",
     *          "reset": "resetTI57"
     *        }
     *      },
     *      "rom": {
     *        "class": "ROM",
     *        "wordSize": 13,
     *        "valueSize": 16,
     *        "valueTotal": 2048,
     *        "littleEndian": true,
     *        "file": "ti57le.bin",
     *        "reference": "",
     *        "values": [
     *        ]
     *      }
     *    }
     *
     * @this {Machine}
     * @param {string} idMachine (of both the machine AND the <div> to contain it)
     * @param {string} sConfig (JSON configuration for entire machine, including any static resources)
     */
    constructor(idMachine, sConfig)
    {
        super(idMachine, idMachine, Machine.VERSION);
        try {
            this.config = JSON.parse(sConfig);
            let config = this.config[idMachine];
            this.checkVersion(config);
            this.checkOverrides(config);
            this.addBindings(config['bindings']);
            this.fAutoPower = (config['autoPower'] !== false);
        } catch(err) {
            let sError = err.message;
            let match = sError.match(/position ([0-9]+)/);
            if (match) {
                sError += " ('" + sConfig.substr(+match[1], 40).replace(/\s+/g, ' ') + "...')";
            }
            this.println("machine '" + idMachine + "' initialization error: " + sError);
        }
        /*
         * Device initialization is now deferred until after the page is fully loaded, for the benefit
         * of devices (eg, Input) that may be dependent on page resources.
         *
         * Strangely, for these page events, I must use the window object rather than the document object.
         */
        let machine = this, chip = null;
        window.addEventListener('load', function onLoad(event) {
            chip = machine.initDevices();
            if (chip) {
                if (chip.onRestore) chip.onRestore();
                if (chip.onPower && machine.fAutoPower) chip.onPower(true);
            }
        });
        let sEvent = this.isUserAgent("iOS")? 'pagehide' : (this.isUserAgent("Opera")? 'unload' : undefined);
        window.addEventListener(sEvent || 'beforeunload', function onUnload(event) {
            if (chip) {
                if (chip.onSave) chip.onSave();
                if (chip.onPower) chip.onPower(false);
            }
        });
    }

    /**
     * initDevices()
     *
     * Initializes devices in the proper order.  For example, any Time devices should be initialized first,
     * to ensure that their timer services are available to other devices.
     *
     * @this {Machine}
     * @returns {Chip|undefined}
     */
    initDevices()
    {
        let idDevice, sClass, device, chip;
        for (let iClass = 0; iClass < Machine.CLASSORDER.length; iClass++) {
            for (idDevice in this.config) {
                try {
                    let config = this.config[idDevice], sStatus = "";
                    sClass = config['class'];
                    if (sClass != Machine.CLASSORDER[iClass]) continue;
                    switch (sClass) {
                    case Machine.CLASS.CHIP:
                        device = new Chip(this.idMachine, idDevice, config);
                        chip = device;
                        break;
                    case Machine.CLASS.INPUT:
                        device = new Input(this.idMachine, idDevice, config);
                        break;
                    case Machine.CLASS.LED:
                        device = new LED(this.idMachine, idDevice, config);
                        break;
                    case Machine.CLASS.ROM:
                        device = new ROM(this.idMachine, idDevice, config);
                        if (device.config['revision']) sStatus = "revision " + device.config['revision'];
                        break;
                    case Machine.CLASS.TIME:
                        device = new Time(this.idMachine, idDevice, config);
                        break;
                    case Machine.CLASS.MACHINE:
                        this.printf("PCjs %s v%3.2f\n", config['name'], Machine.VERSION);
                        this.println(Machine.COPYRIGHT);
                        this.println(Machine.LICENSE);
                        continue;
                    default:
                        this.println("unrecognized device class: " + sClass);
                        continue;
                    }
                    this.println(sClass + " device initialized" + (sStatus? " (" + sStatus + ")" : ""));
                }
                catch(err) {
                    this.println("error initializing " + sClass + " device '" + idDevice + "':\n" + err.message);
                    this.removeDevice(idDevice);
                }
            }
        }
        return chip;
    }
}

Machine.CLASS = {
    CHIP:       "Chip",
    INPUT:      "Input",
    LED:        "LED",
    MACHINE:    "Machine",
    ROM:        "ROM",
    TIME:       "Time"
};

Machine.CLASSORDER = [
    Machine.CLASS.MACHINE,
    Machine.CLASS.TIME,
    Machine.CLASS.LED,
    Machine.CLASS.INPUT,
    Machine.CLASS.ROM,
    Machine.CLASS.CHIP
];

Machine.COPYRIGHT = "Copyright © 2012-2017 Jeff Parsons <Jeff@pcjs.org>";
Machine.LICENSE = "License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>";

Machine.VERSION = 1.11;

window[MACHINE] = Machine;
