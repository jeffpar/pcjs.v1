/**
 * @fileoverview Manages a collection of devices as a single machine
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
 * @class {Machine}
 * @unrestricted
 * @property {CPU} cpu
 * @property {string} sConfigFile
 * @property {boolean} fConfigLoaded
 * @property {boolean} fPageLoaded
 */
class Machine extends Device {
    /**
     * Machine(idMachine, sConfig)
     *
     * If sConfig contains a JSON object definition, then we parse it immediately and save the result in this.config;
     * otherwise, we assume it's the URL of an JSON object definition, so we request the resource, and once it's loaded,
     * we parse it.
     *
     * One important change in v2: the order of the device objects in the JSON file determines creation/initialization order.
     * In general, the Machine object should always be first (it's always created first anyway), and the Time object should
     * be listed next, so that its services are available to any other device when they're created/initialized.
     *
     * Sample config:
     *
     *    {
     *      "ti57": {
     *        "class": "Machine",
     *        "type": "TI57",
     *        "name": "TI-57 Programmable Calculator Simulation",
     *        "version": 1.10,
     *        "autoStart": true,
     *        "autoRestore": true,
     *        "bindings": {
     *          "clear": "clearTI57",
     *          "print": "printTI57"
     *        }
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
     *      },
     *      "cpu": {
     *        "class": "CPU",
     *        "type": "TMS-1500",
     *        "input": "buttons",
     *        "output": "display"
     *      }
     *    }
     *
     * @this {Machine}
     * @param {string} idMachine (of both the machine AND the <div> to contain it)
     * @param {string} sConfig (JSON configuration for entire machine, including any static resources)
     */
    constructor(idMachine, sConfig)
    {
        super(idMachine, idMachine, undefined, Machine.VERSION);

        let machine = this;
        this.cpu = null;
        this.sConfigFile = "";
        this.fConfigLoaded = this.fPageLoaded = false;

        sConfig = sConfig.trim();

        if (sConfig[0] == '{') {
            this.loadConfig(sConfig);
        } else {
            this.sConfigFile = sConfig;
            this.getResource(this.sConfigFile, function onLoadConfig(sURL, sResource, readyState, nErrorCode) {
                if (readyState == 4) {
                    if (!nErrorCode && sResource) {
                        machine.loadConfig(sResource);
                        machine.initDevices();
                    }
                    else {
                        machine.printf("Error (%d) loading configuration: %s\n", nErrorCode, sURL);
                    }
                }
            });
        }

        /*
         * Device initialization is now deferred until after the page is fully loaded, for the benefit
         * of devices (eg, Input) that may be dependent on page resources.
         *
         * Strangely, for these page events, I must use the window object rather than the document object.
         */
        window.addEventListener('load', function onLoadPage(event) {
            machine.fPageLoaded = true;
            machine.initDevices();
        });
        let sEvent = this.isUserAgent("iOS")? 'pagehide' : (this.isUserAgent("Opera")? 'unload' : undefined);
        window.addEventListener(sEvent || 'beforeunload', function onUnloadPage(event) {
            machine.killDevices();
        });
    }

    /**
     * initDevices()
     *
     * Initializes devices in the proper order.  For example, any Time devices should be initialized first,
     * to ensure that their timer services are available to other devices.
     *
     * @this {Machine}
     */
    initDevices()
    {
        if (this.fConfigLoaded && this.fPageLoaded) {
            for (let idDevice in this.config) {
                let device, sClass;
                try {
                    let config = this.config[idDevice], sStatus = "";
                    sClass = config['class'];
                    if (!Machine.CLASSES[sClass]) {
                        this.printf("unrecognized %s device class: %s\n", idDevice, sClass);
                    }
                    else if (sClass == Machine.CLASS.MACHINE) {
                        this.printf("PCjs %s v%3.2f\n%s\n%s\n", config['name'], Machine.VERSION, Machine.COPYRIGHT, Machine.LICENSE);
                        if (this.sConfigFile) this.printf("Configuration: %s\n", this.sConfigFile);
                    } else {
                        device = new Machine.CLASSES[sClass](this.idMachine, idDevice, config);
                        if (sClass == Machine.CLASS.CPU || sClass == Machine.CLASS.CHIP) {
                            if (!this.cpu) {
                                this.cpu = device;
                            } else {
                                this.printf("too many CPU devices: %s\n", idDevice);
                                continue;
                            }
                        }
                        this.printf("%s device: %s\n", sClass, device.status);
                    }
                }
                catch (err) {
                    this.printf("error initializing %s device class %s: %s\n", idDevice, sClass, err.message);
                    this.removeDevice(idDevice);
                }
            }
            let cpu = this.cpu;
            if (cpu) {
                if (cpu.onLoad && this.fAutoRestore) cpu.onLoad();
                if (cpu.onPower && this.fAutoStart) cpu.onPower(true);
            }
        }
    }

    /**
     * killDevices()
     *
     * @this {Machine}
     */
    killDevices()
    {
        let cpu;
        if ((cpu = this.cpu)) {
            if (cpu.onSave) cpu.onSave();
            if (cpu.onPower) cpu.onPower(false);
        }

    }

    /**
     * loadConfig(sConfig)
     *
     * @this {Machine}
     * @param {string} sConfig
     */
    loadConfig(sConfig)
    {
        try {
            this.config = JSON.parse(sConfig);
            let config = this.config[this.idMachine];
            this.checkConfig(config);
            this.checkMachine(config);
            this.fAutoStart = (config['autoStart'] !== false);
            this.fAutoRestore = (config['autoRestore'] !== false);
            this.fConfigLoaded = true;
        } catch(err) {
            let sError = err.message;
            let match = sError.match(/position ([0-9]+)/);
            if (match) {
                sError += " ('" + sConfig.substr(+match[1], 40).replace(/\s+/g, ' ') + "...')";
            }
            this.println("machine '" + this.idMachine + "' initialization error: " + sError);
        }
    }
}

Machine.CLASS = {
    BUS:        "Bus",
    CPU:        "CPU",
    CHIP:       "Chip",
    INPUT:      "Input",
    LED:        "LED",
    MACHINE:    "Machine",
    MEMORY:     "Memory",
    RAM:        "RAM",
    ROM:        "ROM",
    TIME:       "Time",
    VIDEO:      "Video"
};

Machine.CLASSES = {};

if (typeof Bus != "undefined") Machine.CLASSES[Machine.CLASS.BUS] = Bus;
if (typeof CPU != "undefined") Machine.CLASSES[Machine.CLASS.CPU] = CPU;
if (typeof Chip != "undefined") Machine.CLASSES[Machine.CLASS.CHIP] = Chip;
if (typeof Input != "undefined") Machine.CLASSES[Machine.CLASS.INPUT] = Input;
if (typeof LED != "undefined") Machine.CLASSES[Machine.CLASS.LED] = LED;
if (typeof Machine != "undefined") Machine.CLASSES[Machine.CLASS.MACHINE] = Machine;
if (typeof Memory != "undefined") Machine.CLASSES[Machine.CLASS.MEMORY] = Memory;
if (typeof RAM != "undefined") Machine.CLASSES[Machine.CLASS.RAM] = RAM;
if (typeof ROM != "undefined") Machine.CLASSES[Machine.CLASS.ROM] = ROM;
if (typeof Time != "undefined") Machine.CLASSES[Machine.CLASS.TIME] = Time;
if (typeof Video != "undefined") Machine.CLASSES[Machine.CLASS.VIDEO] = Video;

Machine.COPYRIGHT = "Copyright © 2012-2019 Jeff Parsons <Jeff@pcjs.org>";
Machine.LICENSE = "License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>";

Machine.VERSION = +VERSION || 2.00;

/*
 * If we're running a compiled version, create the designated FACTORY function.
 *
 * If we're NOT running a compiled version (ie, FACTORY wasn't overriden), create hard-coded aliases for all known factories;
 * only DEBUG servers should be running uncompiled code.
 */
window[FACTORY] = function(idMachine, sConfig) {
    return new Machine(idMachine, sConfig);
};

if (FACTORY == "Machine") {
    window['LEDs'] = window[FACTORY];
    window['TMS1500'] = window[FACTORY];
}
