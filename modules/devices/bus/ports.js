/**
 * @fileoverview Implements I/O ports
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
 * @typedef {Config} PortsConfig
 * @property {number} addr
 * @property {number} size
 */

/**
 * @class {Ports}
 * @unrestricted
 * @property {PortsConfig} config
 * @property {number} addr
 * @property {number} size
 * @property {number} type
 * @property {Object.<function(number)>} aInputs
 * @property {Object.<function(number,number)>} aOutputs
 */
class Ports extends Memory {
    /**
     * Ports(idMachine, idDevice, config)
     *
     * @this {Ports}
     * @param {string} idMachine
     * @param {string} idDevice
     * @param {PortsConfig} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        this.bus.addBlocks(config['addr'], config['size'], config['type'], this);
        this.aInputs = {};
        this.aOutputs = {};
    }

    /**
     * addListener(port, input, output, device)
     *
     * @this {Ports}
     * @param {number} port
     * @param {function(number)|null} [input]
     * @param {function(number,number)|null} [output]
     * @param {Device} [device]
     */
    addListener(port, input, output, device)
    {
        if (input) {
            if (this.aInputs[port]) {
                throw new Error(this.sprintf("input listener for port %#0x already exists", port));
            }
            this.aInputs[port] = input.bind(device || this);
        }
        if (output) {
            if (this.aOutputs[port]) {
                throw new Error(this.sprintf("output listener for port %#0x already exists", port));
            }
            this.aOutputs[port] = output.bind(device || this);
        }
    }

    /**
     * readNone(offset)
     *
     * This overrides the default readNone() function, which is the default handler for all I/O ports.
     *
     * @this {Ports}
     * @param {number} offset
     * @return {number}
     */
    readNone(offset)
    {
        let port = this.addr + offset;
        let func = this.aInputs[port];
        if (func) {
            return func(port);
        }
        this.printf(MESSAGE.PORTS + MESSAGE.MISC, "readNone(%#04x): unknown port\n", port);
        return super.readNone(offset);
    }

    /**
     * writeNone(offset)
     *
     * This overrides the default writeNone() function, which is the default handler for all I/O ports.
     *
     * @this {Ports}
     * @param {number} offset
     * @param {number} value
     */
    writeNone(offset, value)
    {
        let port = this.addr + offset;
        let func = this.aOutputs[port];
        if (func) {
            func(port, value);
            return;
        }
        this.printf(MESSAGE.PORTS + MESSAGE.MISC, "writeNone(%#04x,%#04x): unknown port\n", port, value);
        super.writeNone(offset, value);
    }
}

Defs.CLASSES["Ports"] = Ports;
