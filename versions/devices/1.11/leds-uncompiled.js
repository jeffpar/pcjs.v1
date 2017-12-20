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
var DEBUG = true; // (window.location.hostname == "pcjs" || window.location.hostname == "jeffpar.local");

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

            case 'c':
                arg = String.fromCharCode(arg);
                /* falls through */

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
 * @property {Array.<string|number|null>} buffer
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

        this.type = this.getBounded(this.getDefaultNumber('type', LED.TYPE.ROUND), LED.TYPE.SMALL, LED.TYPE.DIGIT);
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
        this.nBufferIncExtra = (this.colsView < this.cols? (this.cols - this.colsView) * 4 : 0);

        /*
         * fBufferModified is straightforward: set to true by any setLEDState() call that actually
         * changed something in the LED buffer, set to false after every drawBuffer() call, periodic
         * or otherwise.
         *
         * fTickled is a flag which, under normal (idle) circumstances, will constantly be set to
         * true by periodic display operations that call setLEDState(); we clear it after every
         * periodic drawBuffer(), so if the machine fails to execute a setBuffer() in a timely manner,
         * we will see that fTickled hasn't been "tickled", and automatically blank the display.
         * 
         * fDisplayOn is a global "on/off" switch for the entire display.
         */
        this.fBufferModified = this.fTickled = false;
        this.fDisplayOn = true;

        /*
         * nShiftedLeft is an optimization that tells drawGrid() when it can minimize the number of
         * individual cells to redraw, by shifting the entire grid image leftward and redrawing only
         * the rightmost cells.
         */
        this.nShiftedLeft = 0;

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
     * @param {boolean} [fForced] (if not set, this is a normal refresh call)
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
     * Used by drawBuffer() for LED.TYPE.ROUND, LED.TYPE.SQUARE, etc.
     * 
     * If the buffer was recently shifted left (ie, nShiftedLeft is set), then we take advantage
     * of that knowledge to use drawImage() to shift the entire grid image left, and then redrawing
     * only the rightmost visible column.
     *
     * @this {LED}
     * @param {boolean} [fForced] (if not set, this is a normal refresh call)
     */
    drawGrid(fForced)
    {
        let colRedraw = 0;
        if (!this.fPersistent || fForced) {
            this.clearGrid();
        } else if (this.nShiftedLeft) {
            colRedraw = this.colsView - this.nShiftedLeft;
            let xStart = this.widthCell * this.nShiftedLeft;
            let cxVisible = this.widthCell * colRedraw;
            this.contextGrid.drawImage(this.canvasGrid, xStart, 0, cxVisible, this.heightGrid, 0, 0, cxVisible, this.heightGrid);
            /*
             * At this point, the only grid drawing we might need to do now is the column at colRedraw,
             * but we still loop over the entire buffer to ensure all the cell MODIFIED states are in sync.
             */
        }
        let i = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.colsView; col++) {
                let state = this.buffer[i];
                let color = this.buffer[i+1] || this.colorTransparent;
                let fLeaveModified = false;
                let fModified = !!(this.buffer[i+3] & LED.FLAGS.MODIFIED);
                let fHighlight = (this.fHighlight && i == this.iBufferRecent);
                if (!this.fDisplayOn && state) {
                    state = LED.STATE.OFF;
                    fModified = fLeaveModified = true;
                }
                if (fModified || fHighlight || fForced) {
                    if (col >= colRedraw) {
                        this.drawGridCell(state, color, col, row, fHighlight);
                    }
                    if (fHighlight || fLeaveModified) {
                        this.buffer[i+3] |= LED.FLAGS.MODIFIED;
                    } else {
                        this.buffer[i+3] &= ~LED.FLAGS.MODIFIED;
                    }
                }
                i += this.nBufferInc;
            }
            i += this.nBufferIncExtra;
        }
        this.nShiftedLeft = 0;
        this.drawView();
    }

    /**
     * drawGridCell(state, color, col, row, fHighlight)
     *
     * Used by drawGrid() for LED.TYPE.ROUND, LED.TYPE.SQUARE, etc.
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
        this.contextView.globalCompositeOperation = (this.colorBackground && this.colorOn != this.colorTransparent)? "source-over" : "copy";
        this.contextView.drawImage(this.canvasGrid, 0, 0, this.widthGrid, this.heightGrid, 0, 0, this.widthView, this.heightView);
    }

    /**
     * enableDisplay(on)
     * 
     * @this {LED}
     * @param {boolean} [on]
     */
    enableDisplay(on = true)
    {
        if (this.fDisplayOn != on) {
            this.fDisplayOn = on;
            this.fBufferModified = true;
        }
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
        if (i <= this.buffer.length - this.nBufferInc) {
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
     * @param {Array.<number|string|null>} buffer
     */
    initBuffer(buffer)
    {
        for (let i = 0; i < buffer.length; i += this.nBufferInc) {
            this.initCell(buffer, i);
        }
    }

    /**
     * initCell(buffer, iCell)
     *
     * @this {LED}
     * @param {Array.<number|string|null>} buffer
     * @param {number} iCell
     */
    initCell(buffer, iCell)
    {
        if (this.type < LED.TYPE.DIGIT) {
            buffer[iCell] = LED.STATE.OFF;
        } else {
            buffer[iCell] = ' ';
        }
        buffer[iCell+1] = (this.colorOn == this.colorTransparent? null : this.colorOn);
        buffer[iCell+2] = 0;
        buffer[iCell+3] = LED.FLAGS.MODIFIED;
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
     * @param {number} [flags]
     * @returns {boolean} (true if this call modified the LED state, false if not)
     */
    setLEDState(col, row, state, flags = 0)
    {
        let fModified = false;
        let flagsSet = flags & LED.FLAGS.SET;
        let i = (row * this.cols + col) * this.nBufferInc;
        if (i <= this.buffer.length - this.nBufferInc) {
            if (this.buffer[i] !== state || (this.buffer[i+3] & LED.FLAGS.SET) !== flagsSet) {
                this.buffer[i] = state;
                this.buffer[i+3] = (this.buffer[i+3] & ~LED.FLAGS.SET) | flagsSet | LED.FLAGS.MODIFIED;
                this.fBufferModified = fModified = true;
            }
            this.iBufferRecent = i;
            this.fTickled = true;
            this.nShiftedLeft = 0;
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
    SMALL:      0,      // a smaller, more efficient (round) LED for large grids
    ROUND:      1,      // a single (round) LED
    SQUARE:     2,      // a single (square) LED
    DIGIT:      3       // a 7-segment (digit) LED, with optional period as an 8th segment
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

/*
 * NOTE: Although technically the MODIFIED flag is an internal flag, it may be set explicitly as well;
 * the ROM device uses the setLEDState() flags parameter to set it, in order to trigger highlighting of
 * the most recently active LED.
 */
LED.FLAGS = {
    NONE:       0x00,
    SET:        0x81,   // bits that may be set using the flags parameter of setLEDState()
    PERIOD:     0x01,   // used with DIGIT-type LED to indicate that the period "segment" should be on, too
    MODIFIED:   0x80,   // cell has been modified since the last time it was drawn
};

LED.SHAPES = {
    [LED.TYPE.SMALL]:   [4, 4, 4],
    [LED.TYPE.ROUND]:   [16, 16, 14],
    [LED.TYPE.SQUARE]:  [2, 2, 28, 28]
};

LED.SIZES = [
    [8,   8],           // LED.TYPE.SMALL
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

/** @typedef {{ class: string, bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined), cyclesMinimum: (number|undefined), cyclesMaximum: (number|undefined), cyclesPerSecond: (number|undefined), yieldsPerSecond: (number|undefined), yieldsPerUpdate: (number|undefined), requestAnimationFrame: (boolean|undefined), clockByFrame: (boolean|undefined) }} */
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

        /*
         * When fClockByFrame is true, we rely exclusively on requestAnimationFrame() instead of setTimeout()
         * to drive the clock, which means we automatically yield after every frame, so no yield timer is required.
         */
        if (!this.fClockByFrame) {
            let time = this;
            this.timerYield = this.addTimer("timerYield", function onYield() {
                time.onYield();
            }, this.msYield);
        }
        else {
            /*
             * When clocking exclusively by animation frames, setSpeed() calculates how many cycles
             * each animation frame should "deposit" in our cycle bank:
             * 
             *      this.nCyclesDepositPerFrame = (nCyclesPerSecond / 60) + 0.00000001;
             *
             * After that amount is added to our "balance" (this.nCyclesDeposited), we make a "withdrawal"
             * whenever the balance is >= 1.0 and call all our clocking functions with the maximum number
             * of cycles we were able to withdraw.
             *
             * setSpeed() also adds a tiny amount of "interest" to each "deposit" (0.00000001); otherwise
             * you can end up in situations where the deposit amount is, say, 0.2499999 instead of 0.25,
             * and four such deposits would still fall short of the 1-cycle threshold.
             */
            this.nCyclesDeposited = this.nCyclesDepositPerFrame = 0;
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
     * doBurst(nCycles)
     *
     * @this {Time}
     * @param {number} nCycles
     * @returns {number} (number of cycles actually executed)
     */
    doBurst(nCycles)
    {
        this.nCyclesBurst = this.nCyclesRemain = nCycles;
        if (!this.aClockers.length) {
            this.nCyclesRemain = 0;
            return this.nCyclesBurst;
        }
        let iClocker = 0;
        while (this.nCyclesRemain > 0) {
            if (iClocker < this.aClockers.length) {
                nCycles = this.aClockers[iClocker++](nCycles) || 1;
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
        if (this.fClockByFrame) {
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
            this.nCyclesDepositPerFrame = (nCyclesPerSecond / 60) + 0.00000001;
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
                let nCycles = (this.fClockByFrame? this.getCyclesPerFrame() : 0) || 1;
                this.nStepping--;
                this.updateTimers(this.endBurst(this.doBurst(nCycles)));
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
 * @copyright http://pcjs.org/modules/devices/ledctrl.js (C) Jeff Parsons 2012-2017
 */

/** @typedef {{ class: string, bindings: (Object|undefined), version: (number|undefined), overrides: (Array.<string>|undefined), wrap: (boolean|undefined), rule: (string|undefined), pattern: (string|undefined), patterns: (Object|undefined), message: (string|undefined), toggleColor: (boolean|undefined), colors: (Object|undefined) }} */
var LCConfig;

/**
 * LED Controller Chip
 *
 * @class {Chip}
 * @unrestricted
 * @property {boolean} fWrap
 * @property {string} sRule
 * @property {string} sPattern
 * @property {string} sMessage
 * @property {string} sMessageInit
 * @property {boolean} fToggleColor
 * @property {LED} leds
 * @property {Object} colorPalette
 * @property {string} colorDefault (obtained from the leds)
 * @property {string} colorSelected (set by updateColorSelection())
 * @property {Array.<string>} colors
 */
class Chip extends Device {
    /**
     * Chip(idMachine, idDevice, config)
     *
     * @this {Chip}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {LCConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, Chip.VERSION, config);

        /*
         * These are grid "behavior" properties.  If 'wrap' is true, then any off-grid neighbor cell
         * locations are mapped to the opposite edge; otherwise, they are mapped to the LEDs "scratch" row.
         */
        this.fWrap = this.getDefaultBoolean('wrap', false);
        this.sRule = this.getDefaultString('rule', "");
        this.sPattern = this.getDefaultString('pattern', "");
        this.setMessage(this.sMessageInit = this.getDefaultString('message', ""));
        
        /*
         * The 'toggleColor' property currently affects only grids that have a color palette: if true,
         * then only an LED's color is toggled; otherwise, only its state (ie, ON or OFF) is toggled.
         */
        this.fToggleColor = this.getDefaultBoolean('toggleColor', false);
        
        /*
         * Since all bindings should have been completed by super(), we can make a preliminary call
         * to getCounts() to determine how many counts are stored per LED, to preallocate a count buffer.
         */
        this.countBuffer = new Array(this.getCounts().length);

        /*
         * Get access to the LED device, so we can update its display.
         */
        let leds = /** @type {LED} */ (this.findDeviceByClass(Machine.CLASS.LED));
        if (leds) {
            this.leds = leds;

            /*
             * If loadPattern() didn't load anything into the LED array, then call
             * clearBuffer(true), which performs a combination of clearBuffer() and drawBuffer().
             */
            if (!this.loadPattern()) leds.clearBuffer(true);

            /*
             * Get access to the Input device, so we can add our click functions.
             */
            this.input = /** @type {Input} */ (this.findDeviceByClass(Machine.CLASS.INPUT));
            if (this.input) {
                this.input.addClick(this.onPower.bind(this), this.onReset.bind(this));
            }

            let configInput = {
                "class":        "Input",
                "location":     [0, 0, leds.widthView, leds.heightView, leds.colsView, leds.rowsView],
                "drag":         !!(this.input && this.input.fDrag),
                "scroll":       !!(this.input && this.input.fScroll),
                "hexagonal":    leds.fHexagonal,
                "bindings":     {"surface": leds.getBindingID(LED.BINDING.CONTAINER)}
            };

            let chip = this;
            this.ledInput = new Input(idMachine, idDevice + "Input", configInput);
            this.ledInput.addInput(function onLEDInput(col, row) {
                chip.onInput(col, row);
            });

            this.colors = [];
            this.colorDefault = leds.getDefaultColor();
            this.updateColorSelection(this.colorDefault);
            this.updateColorSwatches();
            this.updateBackgroundImage(this.config[Chip.BINDING.IMAGE_SELECTION]);

            /*
             * Get access to the Time device, so we can give it our clocker() function.
             */
            this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
            if (this.time) {
                this.time.addClocker(this.clocker.bind(this));
                this.time.addUpdater(this.updateStatus.bind(this));
            }

            /*
             * Establish an onCommand() handler.
             */
            this.addHandler(Device.HANDLER.COMMAND, this.onCommand.bind(this));
        }
    }

    /**
     * addBinding(binding, element)
     *
     * @this {Chip}
     * @param {string} binding
     * @param {Element} element
     */
    addBinding(binding, element)
    {
        let chip = this;

        switch(binding) {
        case Chip.BINDING.COLOR_PALETTE:
        case Chip.BINDING.COLOR_SELECTION:
            element.onchange = function onSelectChange() {
                chip.updateColorPalette(binding);
            };
            this.updateColorPalette();
            break;

        case Chip.BINDING.IMAGE_SELECTION:
            element.onchange = function onImageChange() {
                chip.updateBackgroundImage();
            };
            break;

        case Chip.BINDING.PATTERN_SELECTION:
            this.addBindingOptions(element, this.buildPatternOptions(this.config[Chip.BINDING.PATTERN_SELECTION]), false, this.config['pattern']);
            element.onchange = function onPatternChange() {
                chip.updatePattern();
            };
            break;

        case Chip.BINDING.SAVE:
            element.onclick = function onClickSave() {
                let sPattern = chip.savePattern(true);
                let elementSymbol = chip.bindings[Chip.BINDING.SYMBOL_INPUT];
                if (elementSymbol) {
                    sPattern = '"' + elementSymbol.value + '":"' + sPattern.replace(/^([0-9]+\/)*/, "") + '",';
                }
                chip.println(sPattern);
            };
            break;

        case Chip.BINDING.SAVE_TO_URL:
            element.onclick = function onClickSaveToURL() {
                let sPattern = chip.savePattern();
                chip.println(sPattern);
                let href = window.location.href;
                if (href.indexOf('pattern=') >= 0) {
                    href = href.replace(/(pattern=)[^&]*/, "$1" + sPattern.replace(/\$/g, "$$$$"));
                } else {
                    href += ((href.indexOf('?') < 0)? '?' : '&') + "pattern=" + sPattern;
                }
                window.location = href;
            };
            break;

        case Chip.BINDING.SYMBOL_INPUT:
            element.onkeypress = function onChangeSymbol(event) {
                element.value = String.fromCharCode(event.charCode);
                let elementPreview = chip.bindings[Chip.BINDING.SYMBOL_PREVIEW];
                if (elementPreview) elementPreview.textContent = element.value;
                event.preventDefault();
            };
            break;

        default:
            if (binding.startsWith(Chip.BINDING.COLOR_SWATCH)) {
                element.onclick = function onClickColorSwatch() {
                    chip.updateColorSwatches(binding);
                };
                break;
            }
            /*
             * This code allows you to bind a specific control (ie, a button) to a specific pattern;
             * however, it's preferable to use the PATTERN_SELECTION binding above, and use a single list.
             */
            let patterns = this.config[Chip.BINDING.PATTERN_SELECTION];
            if (patterns && patterns[binding]) {
                element.onclick = function onClickPattern() {
                    chip.loadPattern(binding);
                };
            }
        }
        super.addBinding(binding, element);
    }

    /**
     * buildPatternOptions(patterns)
     *
     * @this {Chip}
     * @param {Object} patterns
     * @returns {Object}
     */
    buildPatternOptions(patterns)
    {
        let options = {};
        for (let id in patterns) {
            let name = id;
            let lines = patterns[id];
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].indexOf("#N") == 0) {
                    name = lines[i].substr(2).trim();
                    break;
                }
            }
            options[name] = id;
        }
        return options;
    }

    /**
     * clocker(nCyclesTarget)
     *
     * @this {Chip}
     * @param {number} nCyclesTarget (0 to single-step)
     * @returns {number} (number of cycles actually "clocked")
     */
    clocker(nCyclesTarget = 0)
    {
        let nCyclesClocked = 0;
        if (nCyclesTarget >= 0) {
            let nActive, nCycles = 1;
            do {
                switch(this.sRule) {
                case Chip.RULES.ANIM4:
                    nActive = this.doCycling();
                    break;
                case Chip.RULES.LEFT1:
                    nCycles = nCyclesTarget || nCycles;
                    nActive = this.doShifting(nCycles);
                    break;
                case Chip.RULES.LIFE1:
                    nActive = this.doCounting();
                    break;
                }
                if (!nCyclesTarget) this.println("active cells: " + nActive);
                nCyclesClocked += nCycles;
            } while (nCyclesClocked < nCyclesTarget);
        }
        return nCyclesClocked;
    }

    /**
     * doCounting()
     *
     * Implements rule LIFE1 (straight-forward implementation of Conway's Game of Life rule "B3/S23").
     * 
     * This iterates row-by-row and column-by-column.  It takes advantage of the one-dimensional LED
     * buffer layout to move through the entire grid with a "master" cell index (iCell) and corresponding
     * indexes for all 8 "neighboring" cells (iNO, iNE, iEA, iSE, iSO, iSW, iWE, and iNW), incrementing
     * them all in unison.
     *
     * The row and col variables are used only to detect when we are at the "edges" of the grid, and whether
     * (depending on the wrap setting) any north, east, south, or west indexes that are now "off the grid"
     * should be adjusted to the other side of the grid (or set to the dead "scratch" row at the end of the
     * grid if wrap is disabled).  Similarly, when we leave an "edge", those same indexes must be restored
     * to their normal positions, relative to the "master" index (iCell).
     *
     * The inline tests for whether iCell is at an edge are unavoidable, unless we break the logic up into
     * 5 discrete steps: one for the rectangle just inside the edges, and then four for each of the north,
     * east, south, and west edge strips.  But unless we really need that (presumably tiny) speed boost,
     * I'm inclined to keep the logic simple.
     *
     * The logic is still a bit cluttered by the all the edge detection checks (and the wrap checks within
     * each edge case), and perhaps I should have written two versions of this function (with and without wrap),
     * but again, that would produce more repetition of the rest of the game logic, so I'm still inclined to
     * leave it as-is.
     *
     * @this {Chip}
     * @returns {number}
     */
    doCounting()
    {
        let cActive = 0;
        let leds = this.leds;
        let buffer = leds.getBuffer();
        let bufferClone = leds.getBufferClone();
        let nCols = leds.colsView;
        let nRows = leds.rows;
        /*
         * The number of LED buffer elements per cell is an LED implementation detail that should not be
         * assumed, so we obtain it from the LED object, and use it to calculate the per-cell increment,
         * per-row increment, and per-grid increment; the latter gives us the offset of the LED buffer's
         * scratch row, which we rely upon when wrap is turned off.
         * 
         * NOTE: Since we're only processing colsView, not cols, we must include nBufferIncExtra in nIncPerRow.
         */
        let nInc = leds.nBufferInc;
        let nIncPerRow = nCols * nInc + leds.nBufferIncExtra;
        let nIncPerGrid = nRows * nIncPerRow;

        let iCell = 0;
        let iCellDummy = nIncPerGrid;
        let iNO = iCell - nIncPerRow;
        let iNW = iNO - nInc;
        let iNE = iNO + nInc;
        let iWE = iCell - nInc;
        let iEA = iCell + nInc;
        let iSO = iCell + nIncPerRow;
        let iSW = iSO - nInc;
        let iSE = iSO + nInc;

        for (let row = 0; row < nRows; row++) {
            if (!row) {                         // at top (north) edge; restore will be done after the col loop ends
                if (!this.fWrap) {
                    iNO = iNW = iNE = iCellDummy;
                } else {
                    iNO += nIncPerGrid; iNW += nIncPerGrid; iNE += nIncPerGrid;
                }
            } else if (row == nRows - 1) {      // at bottom (south) edge
                if (!this.fWrap) {
                    iSO = iSW = iSE = iCellDummy;
                } else {
                    iSO -= nIncPerGrid; iSW -= nIncPerGrid; iSE -= nIncPerGrid;
                }
            }
            for (let col = 0; col < nCols; col++) {
                if (!col) {                     // at left (west) edge
                    if (!this.fWrap) {
                        iWE = iNW = iSW = iCellDummy;
                    } else {
                        iWE += nIncPerRow; iNW += nIncPerRow; iSW += nIncPerRow;
                    }
                } else if (col == 1) {          // just finished left edge, restore west indexes
                    if (!this.fWrap) {
                        iWE = iCell - nInc; iNW = iNO - nInc; iSW = iSO - nInc;
                    } else {
                        iWE -= nIncPerRow; iNW -= nIncPerRow; iSW -= nIncPerRow;
                    }
                } else if (col == nCols - 1) {  // at right (east) edge; restore will be done after the col loop ends
                    if (!this.fWrap) {
                        iEA = iNE = iSE = iCellDummy;
                    } else {
                        iEA -= nIncPerRow; iNE -= nIncPerRow; iSE -= nIncPerRow;
                    }
                }
                let state = buffer[iCell];
                let nNeighbors = buffer[iNW]+buffer[iNO]+buffer[iNE]+buffer[iEA]+buffer[iSE]+buffer[iSO]+buffer[iSW]+buffer[iWE];

                if (nNeighbors == 3) {
                    state = LED.STATE.ON;
                } else if (nNeighbors != 2) {
                    state = LED.STATE.OFF;
                }
                bufferClone[iCell] = state;
                bufferClone[iCell+1] = buffer[iCell+1];
                bufferClone[iCell+2] = buffer[iCell+2];
                bufferClone[iCell+3] = buffer[iCell+3] | ((buffer[iCell] !== state)? LED.FLAGS.MODIFIED : 0);
                iCell += nInc; iNW += nInc; iNO += nInc; iNE += nInc; iEA += nInc; iSE += nInc; iSO += nInc; iSW += nInc; iWE += nInc;
                if (state == LED.STATE.ON) cActive++;
            }
            if (!this.fWrap) {
                if (!row) {
                    iNO = iCell - nIncPerRow; iNW = iNO - nInc; iNE = iNO + nInc;
                }
                iEA = iCell + nInc; iNE = iNO + nInc; iSE = iSO + nInc;
            } else {
                if (!row) {
                    iNO -= nIncPerGrid; iNW -= nIncPerGrid; iNE -= nIncPerGrid;
                }
                iEA += nIncPerRow; iNE += nIncPerRow; iSE += nIncPerRow;
            }
        }

        /*
         * swapBuffers() takes care of setting the buffer-wide modified flags (leds.fBufferModified), so we don't have to.
         */
        leds.swapBuffers();
        return cActive;
    }

    /**
     * doCycling()
     *
     * Implements rule ANIM4 (animation using 4-bit counters for state/color cycling).
     *
     * @this {Chip}
     * @returns {number}
     */
    doCycling()
    {
        let cActive = 0;
        let leds = this.leds;
        let nCols = leds.colsView, nRows = leds.rows;
        let counts = this.countBuffer;
        for (let row = 0; row < nRows; row++) {
            for (let col = 0; col < nCols; col++) {
                if (!leds.getLEDCounts(col, row, counts)) continue;
                cActive++;
                /*
                 * Here's the layout of each cell's counts (which mirrors the Chip.COUNTS layout):
                 *
                 *      [0] is the "working" count
                 *      [1] is the ON count
                 *      [2] is the OFF count
                 *      [3] is the color-cycle count
                 *
                 * Whenever the working count is zero, we examine the cell's state and advance it to
                 * the next state: if it was ON, it goes to OFF (and the OFF count is loaded into
                 * the working count); if it was OFF, then color-cycle count (if any) is applied, and
                 * the state goes to ON (and the ON count is loaded).
                 */
                if (counts[0]) {
                    counts[0]--;
                }
                else {
                    let state = leds.getLEDState(col, row), stateNew = state || 0;
                    switch(state) {
                    case LED.STATE.ON:
                        stateNew = LED.STATE.OFF;
                        counts[0] = counts[2];
                        if (counts[0]) {
                            counts[0]--;
                            break;
                        }
                        /* falls through */
                    case LED.STATE.OFF:
                        if (counts[3]) {
                            let color = leds.getLEDColor(col, row);
                            let iColor = this.colors.indexOf(color);
                            if (iColor >= 0) {
                                iColor = (iColor + counts[3]);
                                while (iColor >= this.colors.length) iColor -= this.colors.length;
                                leds.setLEDColor(col, row, this.colors[iColor]);
                            }
                        }
                        stateNew = LED.STATE.ON;
                        counts[0] = counts[1];
                        if (counts[0]) {
                            counts[0]--;
                        }
                        break;
                    }
                    if (stateNew !== state) leds.setLEDState(col, row, stateNew);
                }
                leds.setLEDCounts(col, row, counts);
            }
        }
        return cActive;
    }

    /**
     * doShifting()
     *
     * Implements rule LEFT1 (shift left one cell).
     * 
     * Some of the state we maintain outside of the LED array includes the number of columns of data remaining
     * in the "offscreen" portion of the array (nMessageCount).  Whenever we see that it's zero, we load it with the
     * next chuck of data (ie, the LED pattern for the next symbol in sMessage).
     * 
     * @this {Chip}
     * @param {number} [shift] (default is 1, for a leftward shift of one cell)
     * @returns {number}
     */
    doShifting(shift = 1)
    {
        let cActive = 0;
        let leds = this.leds;
        let nCols = leds.cols, nRows = leds.rows;

        /*
         * If nShiftedLeft is already set, we can't allow another shift until the display has been redrawn.
         */
        if (leds.nShiftedLeft) {
            return 0;
        }

        if (!this.processMessageCmd(shift)) {
            return 0;
        }

        //
        // This is a very slow and simple shift-and-exchange loop, which through a series of exchanges,
        // also migrates the left-most column to the right-most column.  Good for testing but not much else.
        //
        // for (let row = 0; row < nRows; row++) {
        //     for (let col = 0; col < nCols - 1; col++) {
        //         let stateLeft = leds.getLEDState(col, row) || LED.STATE.OFF;
        //         let stateRight = leds.getLEDState(col + 1, row) || LED.STATE.OFF;
        //         if (stateRight) cActive++;
        //         leds.setLEDState(col, row, stateRight);
        //         leds.setLEDState(col + 1, row, stateLeft);
        //     }
        // }
        // leds.nShiftedLeft = 1;
        //

        let buffer = leds.getBuffer();
        let nInc = leds.nBufferInc * shift;
        let nIncPerRow = leds.nBufferInc * nCols;
        
        let col = 0, nEmptyCols = 0, iCell = 0;
        this.nLeftEmpty = this.nRightEmpty = -1;

        while (col < nCols - shift) {
            let isEmptyCol = 1;
            let iCellOrig = iCell;
            for (let row = 0; row < nRows; row++) {
                let stateOld = buffer[iCell];
                let stateNew = (buffer[iCell] = buffer[iCell + nInc]);
                let flagsNew = ((stateNew !== stateOld)? LED.FLAGS.MODIFIED : 0);
                buffer[iCell + 1] = buffer[iCell + nInc + 1];
                buffer[iCell + 2] = buffer[iCell + nInc + 2];
                buffer[iCell + 3] = buffer[iCell + nInc + 3] | flagsNew;
                if (stateNew) {
                    cActive++;
                    isEmptyCol = 0;
                }
                iCell += nIncPerRow;
            }
            iCell = iCellOrig + leds.nBufferInc;
            if (col++ < leds.colsView) {
                if (isEmptyCol) {
                    nEmptyCols++;
                } else {
                    if (this.nLeftEmpty < 0) this.nLeftEmpty = nEmptyCols;
                    nEmptyCols = 0;
                }
            }
        }

        if (this.nLeftEmpty < 0) this.nLeftEmpty = nEmptyCols;
        this.nRightEmpty = nEmptyCols;

        while (col < nCols) {
            let iCellOrig = iCell;
            for (let row = 0; row < nRows; row++) {
                leds.initCell(buffer, iCell);
                iCell += nIncPerRow;
            }
            iCell = iCellOrig + leds.nBufferInc;
            col++;
        }

        leds.fBufferModified = true;
        leds.nShiftedLeft = shift;
        
        return cActive;
    }

    /**
     * getCount(binding)
     * 
     * @this {Chip}
     * @param {string} binding 
     * @returns {number}
     */
    getCount(binding)
    {
        let count = 0;
        let element = this.bindings[binding];
        if (element && element.options) {
            let option = element.options[element.selectedIndex];
            count = option && +option.value || 0;
        }
        return count;
    }
    
    /**
     * getCounts()
     *
     * @this {Chip}
     * @param {boolean} [fAdvance]
     * @returns {Array.<number>}
     */
    getCounts(fAdvance)
    {
        let init = 0;
        if (fAdvance) {
            let element = this.bindings[Chip.BINDING.COUNT_INIT];
            if (element && element.options) {
                let option = element.options[element.selectedIndex];
                if (option) {
                    init = +option.value || 0;
                    /*
                     * A more regular pattern results if we stick to a range of counts equal to the
                     * sum of the ON and OFF counts.  Let's get that sum now.  However, this assumes
                     * that the user is starting with an initial count of ZERO.  Also, we're only going
                     * to do this if the sum of ON and OFF counts is EVEN; if it's odd, then we'll let
                     * the user do their thing.
                     */
                    element.selectedIndex++;
                    let range = this.getCount(Chip.BINDING.COUNT_ON) + this.getCount(Chip.BINDING.COUNT_OFF);
                    let fReset = (!(range & 1) && init == range - 1);
                    if (fReset || element.selectedIndex < 0 || element.selectedIndex >= element.options.length) {
                        element.selectedIndex = 0;
                    }
                }
            }
        }
        let counts = [init];
        for (let i = 1; i < Chip.COUNTS.length; i++) {
            counts.push(this.getCount(Chip.COUNTS[i]));
        }
        return counts;
    }

    /**
     * loadPattern(id)
     *
     * If no id is specified, load the initialization pattern, if any, set via the LCConfig
     * "pattern" property (which, in turn, can be set as URL override, if desired).
     *
     * NOTE: Our initialization pattern is a extended single-string version of the RLE pattern
     * file format: "col/row/width/height/tokens".  The default rule is assumed.
     *
     * @this {Chip}
     * @param {string} [id]
     * @returns {boolean}
     */
    loadPattern(id)
    {
        let leds = this.leds;
        let iCol = -1, iRow = -1, width, height, rule, sPattern = "";

        if (!id) {
            /*
             * If no id is provided, then we fallback to sPattern, which can be either an
             * id (if it doesn't start with a digit) or one of our own extended pattern strings.
             */
            if (!this.sPattern.match(/^[0-9]/)) id = /** @type {string} */ (this.sPattern);
        }

        if (!id) {
            if (!this.sPattern) {
                return false;
            }
            let i = 0;
            let aParts = this.sPattern.split('/');
            if (aParts.length == 5) {           // extended pattern string
                iCol = +aParts[i++];
                iRow = +aParts[i++];
            }
            if (aParts.length == 3 || aParts.length == 5) {
                width = +aParts[i++];           // conventional pattern string
                height = +aParts[i++];
                sPattern = aParts[i];
            }
            else {
                this.println("unrecognized pattern: " + this.sPattern);
                return false;
            }
            rule = this.sRule;  // TODO: If we ever support multiple rules, then allow rule overrides, too
        }
        else {
            let patterns = this.config[Chip.BINDING.PATTERN_SELECTION];
            let lines = patterns && patterns[id];
            if (!lines) {
                this.println("unknown pattern: " + id);
                return false;
            }
            this.println("loading pattern '" + id + "'");
            for (let i = 0, n = 0; i < lines.length; i++) {
                let sLine = lines[i];
                if (sLine[0] == '#') {
                    this.println(sLine);
                    continue;
                }
                if (!n++) {
                    let match = sLine.match(/x\s*=\s*([0-9]+)\s*,\s*y\s*=\s*([0-9]+)\s*(?:,\s*rule\s*=\s*(\S+)|)/i);
                    if (!match) {
                        this.println("unrecognized header line");
                        return false;
                    }
                    width = +match[1];
                    height = +match[2];
                    rule = match[3];
                    continue;
                }
                let end = sLine.indexOf('!');
                if (end >= 0) {
                    sPattern += sLine.substr(0, end);
                    break;
                }
                sPattern += sLine;
            }
        }

        if (rule != this.sRule) {
            this.println("unsupported rule: " + rule);
            return false;
        }

        if (iCol < 0) iCol = (leds.cols - width) >> 1;
        if (iRow < 0) iRow = (leds.rows - height) >> 1;

        if (iCol < 0 || iCol + width > leds.cols || iRow < 0 || iRow + height > leds.rows) {
            this.printf("pattern too large (%d,%d)\n", width, height);
            return false;
        }

        return this.loadPatternString(iCol, iRow, sPattern) > 0;
    }

    /**
     * loadPatternString(col, row, sPattern, fOverwrite)
     *
     * @this {Chip}
     * @param {number} col
     * @param {number} row
     * @param {string} sPattern
     * @param {boolean} [fOverwrite]
     * @returns {number} (number of columns changed, 0 if none)
     */
    loadPatternString(col, row, sPattern, fOverwrite = false)
    {
        let leds = this.leds;
        let rgb = [0, 0, 0, 1], counts = 0;
        let fColors = false, fCounts = false;

        /*
         * TODO: Cache these pattern splits.
         */
        let aTokens = sPattern.split(/([a-z$])/i);
        
        if (!fOverwrite) leds.clearBuffer();
        
        /*
         * We could add checks that verify that col and row stay within the bounds of the specified
         * width and height of the pattern, but it's possible that there are some legit patterns out
         * there that didn't get their bounds quite right.  And in any case, no harm can come of it,
         * because setLEDState() will ignore any parameters outside the LED's array bounds.
         */
        let i = 0, iCol = col, colMax = 0;
        while (i < aTokens.length - 1) {
            let n = aTokens[i++];
            let token = aTokens[i++];
            let v = +n, nRepeat = (n === ""? 1 : v);
            while (nRepeat--) {
                let nAdvance = 0, fModified = false;
                switch(token) {
                case '$':
                    fColors = fCounts = false;
                    col = iCol;
                    row++;
                    break;
                case 'C':
                    counts = v;
                    fCounts = true;
                    break;
                case 'R':
                    rgb[0] = v;
                    fColors = true;
                    break;
                case 'G':
                    rgb[1] = v;
                    fColors = true;
                    break;
                case 'B':
                    rgb[2] = v;
                    fColors = true;
                    break;
                case 'A':
                    rgb[3] = v;
                    fColors = true;
                    break;
                case 'b':
                    fModified = leds.setLEDState(col, row, LED.STATE.OFF);
                    nAdvance++;
                    break;
                case 'o':
                    fModified = leds.setLEDState(col, row, LED.STATE.ON);
                    nAdvance++;
                    break;
                default:
                    this.printf("unrecognized pattern token: %s\n", token);
                    break;
                }
                if (fModified == null) {
                    this.printf("invalid pattern position (%d,%d)\n", col, row);
                } else {
                    if (fColors) {
                        let color = leds.getRGBColorString(rgb);
                        leds.setLEDColor(col, row, color);
                    }
                    if (fCounts) {
                        leds.setLEDCountsPacked(col, row, counts);
                    }
                    if (colMax < col) colMax = col;
                    col += nAdvance;
                }
            }
        }

        if (!fOverwrite) leds.drawBuffer(true);

        return ((colMax -= (iCol - 1)) < 0? 0 : colMax);
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
                this.sMessage = stateChip.shift();
                this.iMessageNext = stateChip.shift();
                this.sMessageCmd = stateChip.shift();
                this.nMessageCount = stateChip.shift();
            } catch(err) {
                this.println("Chip state error: " + err.message);
                return false;
            }
            if (!Device.getURLParms()['message'] && !Device.getURLParms()['pattern'] && !Device.getURLParms()[Chip.BINDING.IMAGE_SELECTION]) {
                let stateLEDs = state['stateLEDs'] || state[1];
                if (stateLEDs && this.leds) {
                    if (!this.leds.loadState(stateLEDs)) return false;
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
        let s = aTokens.shift();
        let c = aTokens.shift();

        switch(c[0]) {
        case 's':
            this.setMessage(aTokens.join(' '));
            break;

        case '?':
            sResult = "";
            Chip.COMMANDS.forEach(cmd => {sResult += '\n' + cmd;});
            if (sResult) sResult = "additional commands:" + sResult;
            break;

        default:
            if (s) sResult = "unrecognized command '" + s + "' (try '?')";
            break;
        }
        if (sResult) this.println(sResult.trim());
        return true;
    }

    /**
     * onInput(col, row)
     *
     * @this {Chip}
     * @param {number} col
     * @param {number} row
     */
    onInput(col, row)
    {
        let leds = this.leds;
        if (col >= 0 && row >= 0) {
            if (this.colorSelected) {
                if (!leds.setLEDColor(col, row, this.colorSelected)) {
                    if (this.fToggleColor) {
                        leds.setLEDColor(col, row);
                    } else {
                        leds.setLEDState(col, row, LED.STATE.ON - leds.getLEDState(col, row));
                    }
                } else {
                    leds.setLEDState(col, row, LED.STATE.ON);
                }
            }
            else {
                leds.setLEDState(col, row, LED.STATE.ON - leds.getLEDState(col, row));
            }
            let fAdvance = !!leds.getLEDState(col, row);
            leds.setLEDCounts(col, row, this.getCounts(fAdvance));
            leds.drawBuffer();
        }
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
        if (this.time) {
            if (fOn) {
                this.time.start();
            } else {
                this.time.stop();
            }
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
        this.leds.clearBuffer(true);
        this.leds.enableDisplay(true);
        if (this.sMessageInit) this.setMessage(this.sMessageInit);
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
     * processMessageCmd(shift, cmd, count)
     * 
     * @this {Chip}
     * @param {number} [shift]
     * @param {string} [cmd]
     * @param {number} [count]
     * @returns {boolean} (true to shift another cell, false if not)
     */
    processMessageCmd(shift = 1, cmd, count)
    {
        if (cmd) {
            this.sMessageCmd = cmd;
            this.nMessageCount = count;
        }

        // this.println("processing command '" + this.sMessageCmd + "', count " + this.nMessageCount);

        switch(this.sMessageCmd) {

        case Chip.MESSAGE_CMD.HALT:
            return false;

        case Chip.MESSAGE_CMD.LOAD:
        case Chip.MESSAGE_CMD.SCROLL:
            if (this.nMessageCount > 0) {
                this.nMessageCount -= shift;
                return true;
            }
            break;

        case Chip.MESSAGE_CMD.PAUSE:
            if (this.nMessageCount > 0) {
                this.nMessageCount -= shift;
                return false;
            }
            break;

        case Chip.MESSAGE_CMD.CENTER:
            if (this.nLeftEmpty > this.nRightEmpty) return true;
            break;

        case Chip.MESSAGE_CMD.OFF:
            this.leds.enableDisplay(false);
            this.sMessageCmd = Chip.MESSAGE_CMD.PAUSE;
            break;

        case Chip.MESSAGE_CMD.ON:
            this.leds.enableDisplay(true);
            this.sMessageCmd = Chip.MESSAGE_CMD.PAUSE;
            break;

        default:

            return false;
        }

        if (!cmd) return this.processMessageSymbol(shift);
        return false;
    }
    
    /**
     * processMessageSymbol(shift)
     * 
     * @this {Chip}
     * @param {number} [shift]
     * @returns {boolean} (true if another message symbol loaded)
     */
    processMessageSymbol(shift = 1)
    {
        if (this.sMessage) {
            if (this.iMessageNext >= this.sMessage.length) {
                this.iMessageNext = 0;
            }
            let chSymbol = this.sMessage[this.iMessageNext++];
            if (chSymbol == '$') {
                let cols = 0;
                let i = this.iMessageNext;
                while (i < this.sMessage.length) {
                    let d = this.sMessage.charCodeAt(i) - 0x30;
                    if (d < 0 || d > 9) break;
                    cols = cols * 10 + d;
                    i++;
                }
                if (i < this.sMessage.length) {
                    let ch = this.sMessage[i++];
                    if (ch == '$') {
                        this.iMessageNext = i;
                    } else {
                        let cmd = Chip.MESSAGE_CODE[ch];
                        if (cmd) {
                            this.iMessageNext = i;
                            return this.processMessageCmd(shift, cmd, cols);
                        }
                        this.println("unrecognized message code: $" + ch);
                    }
                }
            }
            if (chSymbol == ' ') {
                this.nMessageCount += 2;
            } else {
                let col = this.leds.colsView + 1;
                let delta = (this.nMessageCount < 0? this.nMessageCount : 0);
                let sPattern = Chip.SYMBOLS[chSymbol];
                if (sPattern) this.nMessageCount += this.loadPatternString(col + delta, 0, sPattern, true);
                this.nMessageCount += (2 - shift);
                // this.printf("loaded symbol '%s' at offscreen column %d (%d), new count %d\n", chSymbol, (col - this.leds.colsView), delta, this.nMessageCount);
            }
            this.sMessageCmd = Chip.MESSAGE_CMD.SCROLL;
            return true;
        }
        this.sMessageCmd = Chip.MESSAGE_CMD.HALT;
        return false;
    }
    
    /**
     * savePattern(fMinWidth, fMinHeight)
     *
     * We save our patterns as a string that is largely compatible with the "Game of Life RLE Format"
     * (refer to http://www.conwaylife.com/w/index.php?title=Run_Length_Encoded), which uses <repetition><tag>
     * pairs to describes runs of identical cells; the <tag> is either 'o' for "active" cells, 'b' for "inactive"
     * cells, or '$' for end of line.
     *
     * We say "largely" compatible because it's not really a goal for our pattern strings to be compatible
     * with any other RLE reader.  For example, we don't break our string into lines of 70 characters or less,
     * so that's already one incompatibility.  Also, we don't attempt to determine the minimum bounding
     * rectangle for the current pattern, because we use these strings to save/restore the entire grid as it
     * originally appeared, not just the pattern within the grid.  Both of those differences can be dealt with
     * in the future with a special RLE-compatibility flag, if we ever care.
     *
     * Moreover, we must deal with grids containing multi-color cells and additional state (eg, internal counters)
     * not found in typical "Game of Life" grids, so we may precede each <repetition><tag> pair with zero or more
     * <value><modifier> pairs, where <modifier> can be:
     *
     *      'R':    red color value (assumed zero if not present)
     *      'G':    green color value (assumed zero if not present)
     *      'B':    blue color value (assumed zero if not present)
     *      'C':    packed count value (ie, internal counts packed into a single unsigned 32-bit number)
     *
     * If we use any of the above modifiers, they are always preceded with a value unless the value is zero
     * (unlike the <repetition><tag> pairs, where a repetition of 1 is assumed if omitted).
     *
     * Also, a modifier remains in effect until modified by another modifier, reducing the amount of
     * "modifier noise" in the pattern string.
     *
     * @this {Chip}
     * @param {boolean} [fMinWidth] (set to true to determine the minimum width)
     * @param {boolean} [fMinHeight] (set to true to determine the minimum height)
     * @returns {string}
     */
    savePattern(fMinWidth, fMinHeight)
    {
        let leds = this.leds;

        let sPattern = "";
        let iCol = 0, iRow = 0;
        let nCols = this.leds.cols, nRows = this.leds.rows;

        let fColors = !!this.colors.length;
        let state, rgb = [0, 0, 0], counts;
        let stateLast = 0, rgbLast = [0, 0, 0, 1], countsLast = 0;
        let statePrev = 0, rgbPrev = [0, 0, 0, 1], countsPrev = 0, nPrev = 0;

        /**
         * flushRun(fEndRow)
         * 
         * @param {boolean} [fEndRow]
         */
        let flushRun = function(fEndRow) {
            let fDelta = false;
            if (rgb[3] == null) rgb[3] = 1;
            if (nPrev) {
                if (fColors) {
                    if (rgb[0] !== rgbPrev[0] || rgb[1] !== rgbPrev[1] || rgb[2] !== rgbPrev[2] || rgb[3] !== rgbPrev[3]) {
                        fDelta = true;
                    }
                    if (counts !== countsPrev) {
                        fDelta = true;
                    }
                }
                if (state !== statePrev) {
                    fDelta = true;
                }
                if (fDelta || fEndRow && statePrev) {
                    if (fColors) {
                        if (rgbLast[0] !== rgbPrev[0]) {
                            rgbLast[0] = rgbPrev[0];
                            sPattern += (rgbPrev[0] || "") + 'R';
                        }
                        if (rgbLast[1] !== rgbPrev[1]) {
                            rgbLast[1] = rgbPrev[1];
                            sPattern += (rgbPrev[1] || "") + 'G';
                        }
                        if (rgbLast[2] !== rgbPrev[2]) {
                            rgbLast[2] = rgbPrev[2];
                            sPattern += (rgbPrev[2] || "") + 'B';
                        }
                        if (rgbLast[3] !== rgbPrev[3]) {
                            rgbLast[3] = rgbPrev[3];
                            sPattern += (rgbPrev[3] || "") + 'A';
                        }
                        if (countsLast !== countsPrev) {
                            countsLast = countsPrev;
                            sPattern += (countsPrev || "") + 'C';
                        }
                    }
                    if (nPrev > 1) sPattern += nPrev;
                    sPattern += (statePrev === LED.STATE.ON? 'o' : 'b');
                    stateLast = statePrev;
                    fDelta = true;
                }
            }
            if (fEndRow) {
                sPattern += '$';
                nPrev = 0;
            } else {
                if (!fDelta) {
                    nPrev++;
                } else {
                    nPrev = 1;
                }
                statePrev = state;
                rgbPrev[0] = rgb[0];
                rgbPrev[1] = rgb[1];
                rgbPrev[2] = rgb[2];
                rgbPrev[3] = rgb[3];
                countsPrev = counts;
            }
        };

        /*
         * Before we begin, see if either fMinWidth or fMinHeight are set, requiring a bounds prescan.
         */
        let colMin = 0, colMax = leds.cols - 1;
        let rowMin = 0, rowMax = leds.rows - 1;
        if (fMinWidth || fMinHeight) {
            if (fMinWidth) {
                colMin = colMax; colMax = 0;
            }
            if (fMinHeight) {
                rowMin = rowMax; rowMax = 0;
            }
            for (let row = 0; row < leds.rows; row++) {
                for (let col = 0; col < leds.cols; col++) {
                    state = leds.getLEDState(col, row);
                    if (state) {
                        if (fMinWidth) {
                            if (colMin > col) colMin = col;
                            if (colMax < col) colMax = col;
                        }
                        if (fMinHeight) {
                            if (rowMin > row) rowMin = row;
                            if (rowMax < row) rowMax = row;
                        }
                    }
                }
            }
            nCols = colMax - colMin + 1;
            nRows = rowMax - rowMin + 1;
            if (nCols < 0) nCols = 0;
            if (nRows < 0) nRows = 0;
        }

        /*
         * Begin pattern generation.
         */
        for (let row = rowMin; row <= rowMax; row++) {
            for (let col = colMin; col <= colMax; col++) {
                state = leds.getLEDState(col, row);
                leds.getLEDColorValues(col, row, rgb);
                counts = leds.getLEDCountsPacked(col, row);
                flushRun();
            }
            flushRun(true);
        }

        /*
         * Remove all '$' at the beginning of the pattern, if we've asked for the minimum height (or no minimums at all)
         */
        if (fMinHeight || !fMinWidth) {
            while (sPattern[0] == '$') {
                iRow++; nRows--;
                sPattern = sPattern.slice(1);
            }
        }

        /*
         * Similarly, remove all '$$' at the end of the pattern.
         */
        while (sPattern.slice(-2) == '$$') {
            nRows--;
            sPattern = sPattern.slice(0, -1);
        }
        if (sPattern == '$') nRows = 0;

        /*
         * If we've asked for either the minimum width or height, then don't bother including starting col and row (which
         * we only want for patterns used to save/restore the state of the entire grid).
         */
        sPattern = ((fMinWidth || fMinHeight)? "" : (iCol + '/' + iRow + '/')) + nCols + '/' + nRows + '/' + sPattern.slice(0, -1);
        sPattern = sPattern.replace(/\$+$/, '');
        return sPattern;
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
        let stateLEDs = state[1];
        stateChip.push(Chip.VERSION);
        stateChip.push(this.sMessage);
        stateChip.push(this.iMessageNext);
        stateChip.push(this.sMessageCmd);
        stateChip.push(this.nMessageCount);
        if (this.leds) {
            this.leds.saveState(stateLEDs);
        }
        return state;
    }

    /**
     * setMessage(s)
     *
     * @this {Chip}
     * @param {string} s
     */
    setMessage(s)
    {
        if (this.sMessage != s) {
            if (s) this.println("new message: '" + s + "'");
            this.sMessage = s;
        }
        this.sMessageCmd = Chip.MESSAGE_CMD.LOAD;
        this.iMessageNext = this.nMessageCount = 0;
    }
    
    /**
     * updateBackgroundImage(sImage)
     *
     * @this {Chip}
     * @param {string} [sImage]
     */
    updateBackgroundImage(sImage)
    {
        let element = this.bindings[Chip.BINDING.IMAGE_SELECTION];
        if (element && element.options.length) {
            if (sImage) {
                for (let i = 0; i < element.options.length; i++) {
                    if (element.options[i].value == sImage) {
                        element.selectedIndex = i;
                        break;
                    }
                }
            }
            sImage = element.options[element.selectedIndex].value;
            this.leds.setContainerStyle('backgroundImage', sImage? ("url('" + sImage + "')") : "none");
        }
    }

    /**
     * updateColorPalette(binding)
     *
     * In addition to being called whenever the COLOR_PALETTE or COLOR_SELECTION onChange handler is
     * called, this is also called when any of the color controls are initialized, because we don't know
     * in what order the elements will be bound.
     *
     * @this {Chip}
     * @param {string} [binding] (if set, the selection for the specified binding has changed)
     */
    updateColorPalette(binding)
    {
        let elementPalette = this.bindings[Chip.BINDING.COLOR_PALETTE];
        let elementSelection = this.bindings[Chip.BINDING.COLOR_SELECTION];

        let fPaletteChange = (binding === Chip.BINDING.COLOR_PALETTE);
        if (elementPalette && !elementPalette.options.length) {
            this.addBindingOptions(elementPalette, this.config['colors'], true);
            fPaletteChange = true;
        }

        if (elementPalette && elementSelection && (!elementSelection.options.length || fPaletteChange)) {
            let sPalette = elementPalette.options[elementPalette.selectedIndex].value;
            this.colorPalette = this.config['colors'][sPalette];
            for (let color in this.colorPalette) {
                let sColorOverride = this.config[color.toLowerCase()];
                if (sColorOverride) {
                    if (sColorOverride[0] != '#') sColorOverride = '#' + sColorOverride;
                    this.println("overriding color '" + color + "' with " + sColorOverride + " (formerly " + this.colorPalette[color] + ")");
                    this.colorPalette[color] = sColorOverride;
                }
            }
            this.addBindingOptions(elementSelection, this.colorPalette, true);
        }

        if (elementPalette && elementSelection && elementSelection.options.length) {
            this.colorSelected = elementSelection.options[elementSelection.selectedIndex].value;
            this.updateColorSwatches();
        }
    }

    /**
     * updateColorSelection(color)
     *
     * @this {Chip}
     * @param {string} color
     */
    updateColorSelection(color)
    {
        let element = this.bindings[Chip.BINDING.COLOR_SELECTION];
        if (element) {
            let i;
            for (i = 0; i < element.options.length; i++) {
                if (element.options[i].value == color) {
                    this.colorSelected = color;
                    if (element.selectedIndex != i) {
                        element.selectedIndex = i;
                    }
                    break;
                }
            }
            if (i == element.options.length) element.selectedIndex = 0;
        }
    }

    /**
     * updateColorSwatches(binding)
     *
     * @this {Chip}
     * @param {string} [binding] (set if a specific color swatch was just clicked)
     */
    updateColorSwatches(binding)
    {
        let i = 1, elementSwatch;
        /*
         * Some machines use a single swatch called COLOR_SWATCH_SELECTED; update as appropriate.
         */
        if (!binding) {
            if (this.colorSelected) {
                elementSwatch = this.bindings[Chip.BINDING.COLOR_SWATCH_SELECTED];
                if (elementSwatch) {
                    elementSwatch.style.backgroundColor = this.colorSelected;
                }
            }
        }
        /*
         * Other machines use a series of swatches named COLOR_SWATCH + "1", COLOR_SWATCH + "2", etc;
         * for each color in colorPalette, update the next available swatch.
         */
        if (this.colorPalette) {
            for (let idColor in this.colorPalette) {
                let color = this.colorPalette[idColor];
                if (this.colors) this.colors[i-1] = color;
                let idSwatch = Chip.BINDING.COLOR_SWATCH + i++;
                elementSwatch = this.bindings[idSwatch];
                if (!elementSwatch) break;
                elementSwatch.style.display = "inline-block";
                if (idSwatch == binding) {
                    this.updateColorSelection(color);
                }
                if (binding && binding != idSwatch || color != this.colorSelected) {
                    color = this.leds.getRGBAColor(color, 1.0, 0.50);
                }
                elementSwatch.style.backgroundColor = color;
            }
        }
        /*
         * Finally, for any remaining swatches in the series (ie, because the current palette doesn't need
         * them all), hide them.
         */
        while (true) {
            let idSwatch = Chip.BINDING.COLOR_SWATCH + i++;
            let elementSwatch = this.bindings[idSwatch];
            if (!elementSwatch) break;
            elementSwatch.style.display = "none";
        }
    }

    /**
     * updatePattern()
     *
     * @this {Chip}
     */
    updatePattern()
    {
        let element = this.bindings[Chip.BINDING.PATTERN_SELECTION];
        if (element && element.options.length) {
            let sPattern = element.options[element.selectedIndex].value;
            if (!sPattern) {
                this.onReset();
            } else {
                this.loadPattern(sPattern);
            }
        }
    }

    /**
     * updateStatus(fTransition)
     *
     * Update the LEDs as needed.
     *
     * Called by Time's updateStatus() function whenever 1) its YIELDS_PER_UPDATE threshold is reached
     * (default is twice per second), 2) a step() operation has just finished (ie, the device is being
     * single-stepped), and 3) a start() or stop() transition has occurred.
     *
     * Of those, all we currently care about are step() and stop() notifications, because we want to make sure
     * the LED display is in sync with the last LED buffer update.  In both of those cases, time has stopped.
     * If time has NOT stopped, then the LED's normal animator function (ledAnimate()) takes care of updating
     * the LED display.
     *
     * @this {Chip}
     * @param {boolean} [fTransition]
     */
    updateStatus(fTransition)
    {
        if (!this.time.isRunning()) {
            this.leds.drawBuffer();
        }
    }
}

Chip.BINDING = {
    COLOR_PALETTE:          "colorPalette",
    COLOR_SELECTION:        "colorSelection",
    COLOR_SWATCH:           "colorSwatch",
    COLOR_SWATCH_SELECTED:  "colorSwatchSelected",
    COUNT_INIT:             "countInit",
    COUNT_ON:               "countOn",
    COUNT_OFF:              "countOff",
    COUNT_CYCLE:            "countCycle",
    IMAGE_SELECTION:        "backgroundImage",
    PATTERN_SELECTION:      "patterns",
    SYMBOL_INPUT:           "symbolInput",
    SYMBOL_PREVIEW:         "symbolPreview",
    SAVE:                   "save",
    SAVE_TO_URL:            "saveToURL"
};

Chip.COUNTS = [null, Chip.BINDING.COUNT_ON, Chip.BINDING.COUNT_OFF, Chip.BINDING.COUNT_CYCLE];

Chip.COMMANDS = [
    "s\tset string"
];

Chip.MESSAGE_CMD = {
    LOAD:       "load",
    SCROLL:     "scroll",
    PAUSE:      "pause",
    HALT:       "halt",
    CENTER:     "center",
    OFF:        "off",
    ON:         "on"
};

/*
 * The symbol `$` is used as a prefix to embed "command codes" in an LED message.  Current command codes include:
 *
 *      $b (blank the display; turns all LEDs off)
 *      $c (center the current display contents; ie, continue scrolling until centered)
 *      $h (halt scrolling)
 *      $o (turn the display on; the opposite of blank)
 *      $p (pause scrolling)
 *      $s (scroll/shift the display one cell, without adding more symbols)
 *
 * The default operation is to scroll the display, adding new symbols to the vacated end of the display as needed.
 * When all symbols in the current message have been processed, processing returns to the beginning of the message.
 *
 * To change the default operation at any point, insert one or more command codes into the string.  Commands may also
 * include a count immediately after the `$` (eg, `$90s`), which determines how many "steps" (cycles) that command
 * should remain in effect before advancing to the next symbol (or command) in the message.  So, for example, `$90s`
 * will scroll the display 90 times (without adding new symbols) before continuing to the next symbol.  The default
 * count for an operation is 1.
 *
 * For convenience, commands that don't need a count (eg, `$b` and `$o`) automatically treat the count as a pause (`$p`).
 * In other words, `$30b` is equivalent to `$b$30p`.
 *
 * Finally, if you want to embed `$` as a normal symbol, use two of them (`$$`).
 */
Chip.MESSAGE_CODE = {
    'b':        Chip.MESSAGE_CMD.OFF,
    'c':        Chip.MESSAGE_CMD.CENTER,
    'h':        Chip.MESSAGE_CMD.HALT,
    'o':        Chip.MESSAGE_CMD.ON,
    'p':        Chip.MESSAGE_CMD.PAUSE,
    's':        Chip.MESSAGE_CMD.SCROLL
};

Chip.RULES = {
    ANIM4:      "A4",       // animation using 4-bit counters for state/color cycling
    LEFT1:      "L1",       // shift left one cell
    LIFE1:      "B3/S23"    // Game of Life v1.0 (births require 3 neighbors, survivors require 2 or 3)
};

/*
 * Symbols can be formed with the following 16x16 grid patterns.
 */
Chip.SYMBOLS = {
    "0":"$2b2o$bo2bo$o4bo$o4bo$o4bo$o4bo$o4bo$o4bo$o4bo$bo2bo$2b2o",
    "1":"$3bo$2b2o$4o$3bo$3bo$3bo$3bo$3bo$3bo$3bo$3bo",
    "2":"$2b3o$bo3bo$o5bo$o5bo$6bo$5bo$3b2o$2bo$bo$o$7o",
    "3":"$b4o$o4bo$o4bo$5bo$4bo$2b2o$4bo$5bo$o4bo$o4bo$b4o",
    "4":"$5bo$4b2o$3bobo$2bo2bo$bo3bo$o4bo$o4bo$8o$5bo$5bo$5bo",
    "5":"$6o$o$o$o$4o$4bo$5bo$5bo$5bo$o3bo$b3o",
    "6":"$2b4o$bo4bo$o$o$o$ob4o$2o4bo$o5bo$o5bo$bo4bo$2b4o",
    "7":"$8o$7bo$6bo$5bo$4bo$4bo$3bo$3bo$2bo$2bo$2bo",
    "8":"$b4o$o4bo$o4bo$o4bo$bo2bo$2b2o$bo2bo$o4bo$o4bo$o4bo$b4o",
    "9":"$b4o$o4bo$o5bo$o5bo$o4b2o$b4obo$6bo$6bo$6bo$o4bo$b4o",
    "A":"$3b2o$2bo2bo$bo4bo$bo4bo$o6bo$o6bo$o6bo$8o$o6bo$o6bo$o6bo",
    "B":"$6o$o5bo$o5bo$o5bo$o4bo$7o$o6bo$o6bo$o6bo$o6bo$7o",
    "C":"$2b4o$bo4bo$o6bo$o$o$o$o$o$o6bo$bo4bo$2b4o",
    "D":"$6o$o5bo$o6bo$o6bo$o6bo$o6bo$o6bo$o6bo$o6bo$o5bo$6o",
    "E":"$7o$o$o$o$o$6o$o$o$o$o$7o",
    "F":"$7o$o$o$o$o$6o$o$o$o$o$o",
    "G":"$2b4o$bo4bo$o$o$o$o3b4o$o6bo$o6bo$o6bo$bo4bo$2b4o",
    "H":"$o6bo$o6bo$o6bo$o6bo$o6bo$8o$o6bo$o6bo$o6bo$o6bo$o6bo",
    "I":"$o$o$o$o$o$o$o$o$o$o$o",
    "J":"$5bo$5bo$5bo$5bo$5bo$5bo$5bo$o4bo$o4bo$o4bo$b4o",
    "K":"$o6bo$o5bo$o4bo$o3bo$o2bo$ob2o$2o2bo$o4bo$o5bo$o6bo$o7bo",
    "L":"$o$o$o$o$o$o$o$o$o$o$7o",
    "M":"$o8bo$2o6b2o$obo4bobo$obo4bobo$o2bo2bo2bo$o2bo2bo2bo$o3b2o3bo$o8bo$o8bo$o8bo$o8bo",
    "N":"$2o5bo$obo4bo$obo4bo$o2bo3bo$o2bo3bo$o3bo2bo$o3bo2bo$o4bobo$o4bobo$o4bobo$o5b2o",
    "O":"$3b4o$2bo4bo$bo6bo$o8bo$o8bo$o8bo$o8bo$o8bo$bo6bo$2bo4bo$3b4o",
    "P":"$6o$o5bo$o6bo$o6bo$o6bo$o5bo$6o$o$o$o$o",
    "Q":"$3b4o$2bo4bo$bo6bo$o8bo$o8bo$o8bo$o8bo$o8bo$bo4bobo$2bo4bo$3b4obo$9bo",
    "R":"$6o$o5bo$o5bo$o5bo$o5bo$6o$o2bo$o3bo$o4bo$o5bo$o6bo",
    "S":"$2b4o$bo4bo$o6bo$o$bo$2b4o$6bo$7bo$o6bo$bo4bo$2b4o",
    "T":"$9o$4bo$4bo$4bo$4bo$4bo$4bo$4bo$4bo$4bo$4bo",
    "U":"$o6bo$o6bo$o6bo$o6bo$o6bo$o6bo$o6bo$o6bo$o6bo$bo4bo$2b4o",
    "V":"$o8bo$o8bo$bo6bo$bo6bo$bo6bo$2bo4bo$2bo4bo$2bo4bo$3bo2bo$3bo2bo$4b2o",
    "W":"$o4b2o4bo$o4b2o4bo$o4b2o4bo$o3bo2bo3bo$bo2bo2bo2bo$bo2bo2bo2bo$bo2bo2bo2bo$bo2bo2bo2bo$2b2o4b2o$2b2o4b2o$2b2o4b2o",
    "X":"$o8bo$bo6bo$2bo4bo$3bo2bo$4b2o$4b2o$4b2o$3bo2bo$2bo4bo$bo6bo$o8bo",
    "Y":"$o5bo$o5bo$bo3bo$bo3bo$2bobo$2bobo$3bo$3bo$3bo$3bo$3bo",
    "Z":"$9o$8bo$7bo$6bo$5bo$4bo$3bo$2bo$bo$o$9o",
    "a":"$$$$b4o$o4bo$5bo$b5o$o4bo$o4bo$o3b2o$b3obo",
    "b":"$o$o$o$ob3o$2o3bo$o5bo$o5bo$o5bo$o5bo$2o3bo$ob3o",
    "c":"$$$$2b4o$bo4bo$o$o$o$o$bo4bo$2b4o",
    "d":"$6bo$6bo$6bo$2b3obo$bo3b2o$o5bo$o5bo$o5bo$o5bo$bo3b2o$2b3obo",
    "e":"$$$$2b3o$bo3bo$o5bo$7o$o$o$bo4bo$2b4o",
    "f":"$2b2o$bo2bo$bo$bo$4o$bo$bo$bo$bo$bo$bo",
    "g":"$$$$2b2obo$bo2b2o$o4bo$o4bo$o4bo$bo2b2o$2b2obo$5bo$5bo$o4bo$b4o",
    "h":"$o$o$o$ob3o$2o3bo$o4bo$o4bo$o4bo$o4bo$o4bo$o4bo",
    "i":"$$o$$o$o$o$o$o$o$o$o",
    "j":"$$3bo$$3bo$3bo$3bo$3bo$3bo$3bo$3bo$3bo$3bo$o2bo$b2o",
    "k":"$o$o$o$o4bo$o3bo$o2bo$obo$2obo$o3bo$o4bo$o5bo",
    "l":"$o$o$o$o$o$o$o$o$o$o$o",
    "m":"$$$$ob2o3b2o$2o2bobo2bo$o4bo4bo$o4bo4bo$o4bo4bo$o4bo4bo$o4bo4bo$o4bo4bo",
    "n":"$$$$ob3o$2o3bo$o4bo$o4bo$o4bo$o4bo$o4bo$o4bo",
    "o":"$$$$2b4o$bo4bo$o6bo$o6bo$o6bo$o6bo$bo4bo$2b4o",
    "p":"$$$$ob3o$2o3bo$o5bo$o5bo$o5bo$o5bo$2o3bo$ob3o$o$o$o",
    "q":"$$$$2b3obo$bo3b2o$o5bo$o5bo$o5bo$o5bo$bo3b2o$2b3obo$6bo$6bo$6bo",
    "r":"$$$$ob2o$2o2bo$o$o$o$o$o$o",
    "s":"$$$$b4o$o4bo$o$b4o$5bo$5bo$o4bo$b4o",
    "t":"$$bo$bo$4o$bo$bo$bo$bo$bo$bo2bo$2b2o",
    "u":"$$$$o4bo$o4bo$o4bo$o4bo$o4bo$o4bo$o3b2o$b3obo",
    "v":"$$$$o5bo$o5bo$bo3bo$bo3bo$bo3bo$2bobo$2bobo$3bo",
    "w":"$$$$o3b2o3bo$o3b2o3bo$o3b2o3bo$o3b2o3bo$bobo2bobo$bobo2bobo$bobo2bobo$2bo4bo",
    "x":"$$$$$o5bo$bo3bo$2bobo$3bo$2bobo$bo3bo$o5bo",
    "y":"$$$$o5bo$o5bo$bo3bo$bo3bo$2bobo$2bobo$3bo$3bo$3bo$2bo$2o",
    "z":"$$$$6o$5bo$4bo$3bo$2bo$bo$o$6o",
    "!":"$o$o$o$o$o$o$o$o$$o$o",
    "\"":"$obo$obo$obo$obo",
    "#":"$2bo2bo$2bo2bo$2bo2bo$8o$2bo2bo$2bo2bo$2bo2bo$8o$2bo2bo$2bo2bo$2bo2bo",
    "$":"3bo$2b4o$bobo2bo$o2bo$o2bo$bobo$2b3o$3bobo$3bo2bo$3bo2bo$o2bobo$b4o$3bo",
    "%":"$b2o7bo$o2bo5bo$o2bo4bo$o2bo3bo$o2bo2bo$b2o2bo2b2o$4bo2bo2bo$3bo3bo2bo$2bo4bo2bo$bo5bo2bo$o7b2o",
    "&":"$b3o$o3bo$o3bo$o3bo$bobo$2bo$bobo$o3bobo$o4bo$o3bobo$b3o3bo",
    "'":"$o$o$o$o",
    "(":"$3bo$2bo$bo$bo$o$o$o$o$o$o$bo$bo$2bo$3bo",
    ")":"$o$bo$2bo$2bo$3bo$3bo$3bo$3bo$3bo$3bo$2bo$2bo$bo$o",
    "*":"2bo$obobo$b3o$b3o$o3bo",
    "+":"$$$$3bo$3bo$3bo$7o$3bo$3bo$3bo",
    ",":"$$$$$$$$$$2o$2o$bo$o",
    ".":"$$$$$$$$$$2o$2o",
    "/":"$3bo$3bo$2bo$2bo$2bo$bo$bo$bo$o$o$o",
    ":":"$$$$2o$2o$$$$$2o$2o",
    ";":"$$$$2o$2o$$$$$2o$2o$bo$o",
    "<":"$$$$6b2o$4b2o$2b2o$2o$2o$2b2o$4b2o$6b2o",
    ">":"$$$$2o$2b2o$4b2o$6b2o$6b2o$4b2o$2b2o$2o",
    "=":"$$$$$$8o$$$8o",
    "?":"$b4o$o4bo$o4bo$5bo$4bo$3bo$2bo$2bo$$2bo$2bo",
    "@":"$3b4o$2bo4bo$bo6bo$o3b2o3bo$o2bo2bo2bo$o2bo2bo2bo$o3b2o3bo$o5b3o$bo$2bo5bo$3b5o",
    "[":"$3o$o$o$o$o$o$o$o$o$o$o$o$o$3o",
    "]":"$3o$2bo$2bo$2bo$2bo$2bo$2bo$2bo$2bo$2bo$2bo$2bo$2bo$3o",
    "\\":"$o$o$bo$bo$bo$2bo$2bo$2bo$3bo$3bo$3bo",
    "^":"$2b2o$2b2o$bo2bo$bo2bo$o4bo$o4bo",
    "_":"$$$$$$$$$$$$$8o",
    "`":"o$bo$2bo",
    "{":"$2b2o$bo$bo$bo$bo$bo$bo$o$bo$bo$bo$bo$bo$2b2o",
    "}":"$2o$2bo$2bo$2bo$2bo$2bo$2bo$3bo$2bo$2bo$2bo$2bo$2bo$2o",
    "|":"o$o$o$o$o$o$o$o$o$o$o$o$o$o$o",
    "~":"$$$$$$b3o3bo$o3b3o"
};

Chip.VERSION    = 1.11;

MACHINE = "LEDs";

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
