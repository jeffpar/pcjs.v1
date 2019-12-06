/**
 * @fileoverview Implements I/O ports
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2019 Jeff Parsons
 * @license MIT
 *
 * This file is part of PCjs, a computer emulation software project at <https://www.pcjs.org>.
 */

"use strict";

/**
 * @typedef {Config} PortsConfig
 * @property {number} [addr]
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
        /*
         * Some machines instantiate a Ports device through their configuration, which must include an 'addr';
         * it's also possible that a device may dynamically allocate a Ports device and add it to the Bus itself
         * (eg, the PDP11 IOPAGE).
         */
        if (config['addr'] != undefined) {
            this.bus.addBlocks(config['addr'], config['size'], Memory.TYPE.NONE, this);
        }
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
     * @returns {number}
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
