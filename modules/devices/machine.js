/**
 * @fileoverview Simulates the creation of a complete machine
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
     *        "bindings": {
     *          "print": "printTI57"
     *        }
     *      },
     *      "chip": {
     *        "class": "Chip",
     *        "type": "TMS-1500"
     *      },
     *      "clock": {
     *        "class": "Time",
     *        "cyclesPerSecond": 1600000
     *        "bindings": {
     *          "run": "runTI57",
     *          "speed": "speedTI57"
     *        }
     *      },
     *      "display": {
     *        "class": "LED",
     *        "type": 3,
     *        "cols": 12,
     *        "rows": 1,
     *        "color": "red",
     *        "backgroundColor": "black",
     *        "bindings": {
     *          "container": "displayTI57"
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
        super(idMachine);
        try {
            this.config = JSON.parse(sConfig);
            this.addBindings(this.config[idMachine].bindings);
        } catch(err) {
            let sError = err.message;
            let match = sError.match(/position ([0-9]+)/);
            if (match) {
                sError += " ('" + sConfig.substr(+match[1], 40).replace(/\s+/g, ' ') + "...')";
            }
            this.println(sError);
        }
        /*
         * Device initialization is now deferred until after the page is fully loaded, for the benefit
         * of devices (eg, Input) that may be dependent on page resources.
         *
         * Strangely, for 'load' events, I must use the window object (not document).
         */
        let machine = this;
        window.addEventListener('load', function onLoad(event) {
            machine.initDevices();
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
        let idDevice, sClass, device;
        for (let iClass = 0; iClass < Machine.CLASSORDER.length; iClass++) {
            for (idDevice in this.config) {
                try {
                    let config = this.config[idDevice];
                    sClass = config['class'];
                    if (sClass != Machine.CLASSORDER[iClass]) continue;
                    switch (sClass) {
                    case Machine.CLASS.CHIP:
                        device = new Chip(this.idMachine, idDevice, config);
                        break;
                    case Machine.CLASS.INPUT:
                        device = new Input(this.idMachine, idDevice, config);
                        break;
                    case Machine.CLASS.LED:
                        device = new LED(this.idMachine, idDevice, config);
                        break;
                    case Machine.CLASS.ROM:
                        device = new ROM(this.idMachine, idDevice, config);
                        break;
                    case Machine.CLASS.TIME:
                        device = new Time(this.idMachine, idDevice, config);
                        break;
                    case Machine.CLASS.MACHINE:
                        this.println(config.name);
                        this.println(Machine.COPYRIGHT);
                        this.println(Machine.LICENSE);
                        continue;
                    default:
                        this.println("unrecognized device class: " + sClass);
                        continue;
                    }
                    this.println(sClass + " device initialized");
                }
                catch(err) {
                    this.println("error initializing device " + idDevice + ": " + err.message);
                }
            }
        }
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
