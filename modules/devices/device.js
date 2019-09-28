/**
 * @fileoverview Base class for devices, with assorted handy services
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2019 Jeff Parsons
 *
 * This file is part of PCjs, a computer emulation software project at <https://www.pcjs.org>.
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
 * <https://www.pcjs.org/modules/devices/machine.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

/**
 * List of additional message groups, extending the base set defined in lib/webio.js.
 *
 * NOTE: To support more than 32 message groups, be sure to use "+", not "|", when concatenating.
 */
MESSAGE.ADDR            = 0x000000000001;       // this is a special bit (bit 0) used to append address info to messages
MESSAGE.BUS             = 0x000000000002;
MESSAGE.PORT            = 0x000000000004;
MESSAGE.MEMORY          = 0x000000000008;
MESSAGE.CPU             = 0x000000000010;
MESSAGE.VIDEO           = 0x000000000020;       // used with video hardware messages (see video.js)
MESSAGE.MONITOR         = 0x000000000040;       // used with video monitor messages (see monitor.js)
MESSAGE.SCREEN          = 0x000000000080;       // used with screen-related messages (also monitor.js)
MESSAGE.TIMER           = 0x000000000100;
MESSAGE.EVENT           = 0x000000000200;
MESSAGE.KEY             = 0x000000000400;
MESSAGE.WARN            = 0x000000000800;
MESSAGE.HALT            = 0x000000001000;

MessageNames["addr"]    = MESSAGE.ADDR;
MessageNames["bus"]     = MESSAGE.BUS;
MessageNames["port"]    = MESSAGE.PORT;
MessageNames["memory"]  = MESSAGE.MEMORY;
MessageNames["cpu"]     = MESSAGE.CPU;
MessageNames["video"]   = MESSAGE.VIDEO;
MessageNames["monitor"] = MESSAGE.MONITOR;
MessageNames["screen"]  = MESSAGE.SCREEN;
MessageNames["timer"]   = MESSAGE.TIMER;
MessageNames["event"]   = MESSAGE.EVENT;
MessageNames["key"]     = MESSAGE.KEY;
MessageNames["warn"]    = MESSAGE.WARN;
MessageNames["halt"]    = MESSAGE.HALT;
MessageNames["buffer"]  = MESSAGE.BUFFER;

/**
 * In addition to basic Device services, such as:
 *
 *      addDevice()
 *      enumDevices()
 *      findDevice()
 *      findDeviceByClass()
 *
 * this class also supports register "registration" services, to allow a Device to make any registers
 * it supports available by name to other devices (notably the Debugger):
 *
 *      defineRegister()
 *      getRegister()
 *      setRegister()
 *
 * Besides CPUs, other devices may have internal registers or ports that are useful to access by name, too.
 *
 * @class {Device}
 * @unrestricted
 * @property {string} status
 * @property {Object} registers
 * @property {Device|undefined|null} cpu
 */
class Device extends WebIO {
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
     *      http://localhost:4000/?cyclesPerSecond=100000
     *
     * will set the Time device's cyclesPerSecond config property to 100000.  In general, the values
     * will be treated as strings, unless they contain all digits (number), or equal "true" or "false"
     * (boolean).
     *
     * @this {Device}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {Config} [config]
     * @param {number} [version]
     */
    constructor(idMachine, idDevice, config, version)
    {
        super();
        this.idMachine = idMachine;
        this.idDevice = idDevice;
        this.checkConfig(config);
        this.checkVersion(version);
        this.addDevice();
        this.registers = {};
        this.cpu = undefined;
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
        if (Device.Machines[this.idMachine][this.idDevice]) {
            this.printf("warning: machine configuration contains multiple '%s' devices\n", this.idDevice);
        }
        Device.Machines[this.idMachine][this.idDevice] = this;
    }

    /**
     * checkConfig(config)
     *
     * @this {Device}
     * @param {Config} [config]
     */
    checkConfig(config = {})
    {
        /*
         * If this device's config contains an "overrides" array, then any of the properties listed in
         * that array may be overridden with a URL parameter.  We don't impose any checks on the overriding
         * value, so it is the responsibility of the component with overridable properties to validate them.
         */
        if (config['overrides']) {
            let parms = this.getURLParms();
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
        this.config = config;
        this.addBindings(config['bindings']);
        this.checkMachine(config);
    }

    /**
     * checkMachine(config)
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
    checkMachine(config)
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
     * checkVersion(version)
     *
     * @this {Device}
     * @param {number} [version]
     */
    checkVersion(version)
    {
        this.version = version || +VERSION;
    }

    /**
     * defineRegister(name, get, set)
     *
     * @this {Device}
     * @param {string} name
     * @param {function()} get
     * @param {function(number)} set
     */
    defineRegister(name, get, set)
    {
        this.registers[name] = {get: get.bind(this), set: set.bind(this)};
    }

    /**
     * enumDevices(func)
     *
     * @this {Device}
     * @param {function(Device)} func
     */
    enumDevices(func)
    {
        let id;
        try {
            let devices = Device.Machines[this.idMachine];
            if (devices) {
                for (id in devices) {
                    let device = devices[id];
                    if (device.config['class'] != Machine.CLASS.MACHINE) {
                        func(device);
                    }
                }
            }
        } catch(err) {
            this.printf("error while enumerating device '%s': %s\n", id, err.message);
        }
    }

    /**
     * findBinding(name, all)
     *
     * This will search the current device's bindings, and optionally all the device bindings within the
     * machine.  If the binding is found in another device, that binding is recorded in this device as well.
     *
     * @this {Device}
     * @param {string} name
     * @param {boolean} [all]
     * @return {Element|null|undefined}
     */
    findBinding(name, all = false)
    {
        let element = super.findBinding(name, all);
        if (element === undefined && all) {
            let devices = Device.Machines[this.idMachine];
            for (let id in devices) {
                element = devices[id].bindings[name];
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
     * @return {Device|null}
     */
    findDevice(idDevice)
    {
        let devices = Device.Machines[this.idMachine];
        return devices && devices[idDevice] || null;
    }

    /**
     * findDeviceByClass(idClass)
     *
     * This is only appropriate for device classes where no more than one instance of the device is allowed;
     * for example, it is NOT appropriate for the Bus class, because machines can have multiple buses (eg, an
     * I/O bus and a memory bus).
     *
     * @this {Device}
     * @param {string} idClass
     * @return {Device|null}
     */
    findDeviceByClass(idClass)
    {
        let device = null;
        let devices = Device.Machines[this.idMachine];
        if (devices) {
            for (let id in devices) {
                if (devices[id].config['class'] == idClass) {
                    device = devices[id];
                    break;
                }
            }
        }
        return device;
    }

    /**
     * getRegister(name)
     *
     * @this {Device}
     * @param {string} name
     * @return {number|undefined}
     */
    getRegister(name)
    {
        let reg = this.registers[name];
        return reg && reg.get();
    }

    /**
     * printf(format, ...args)
     *
     * Just as WebIO.printf() overrides StdIO.printf() to add support for Messages, we override WebIO.printf()
     * to add support for MESSAGE.ADDR: if that message bit is set, we want to append the current execution address
     * (PC) to any message-driven printf() call.
     *
     * @this {Device}
     * @param {string|number} format
     * @param {...} args
     */
    printf(format, ...args)
    {
        if (typeof format == "number" && (Messages & MESSAGE.ADDR) && this.isMessageOn(format)) {
            /*
             * The following will execute at most once, because findDeviceByClass() returns either a Device or null,
             * neither of which is undefined.  Hopefully no message-based printf() calls will arrive with MESSAGE.ADDR
             * set *before* the CPU device has been initialized.
             */
            if (this.cpu === undefined) {
                this.cpu = /** @type {CPU} */ (this.findDeviceByClass(Machine.CLASS.CPU));
            }
            if (this.cpu) {
                format = args.shift();
                let s = this.sprintf(format, ...args).trim();
                super.printf("%s at %#0x\n", s, this.cpu.regPCLast);
                return;
            }
        }
        super.printf(format, ...args);
    }

    /**
     * removeDevice(idDevice)
     *
     * @this {Device}
     * @param {string} idDevice
     */
    removeDevice(idDevice)
    {
        let device;
        let devices = Device.Machines[this.idMachine];
        if (devices) delete devices[idDevice];
    }

    /**
     * setRegister(name, value)
     *
     * @this {Device}
     * @param {string} name
     * @param {number} value
     */
    setRegister(name, value)
    {
        let reg = this.registers[name];
        if (reg) reg.set(value);
    }
}

/**
 * Machines is a global object whose properties are machine IDs and whose values are arrays of Devices.
 *
 * @type {Object}
 */
Device.Machines = {};
