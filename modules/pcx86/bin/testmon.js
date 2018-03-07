#!/usr/bin/env node
/**
 * @fileoverview Node-based Test Monitor
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
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

var fs = require("fs");
var path = require("path");
var SerialPort = require("serialport");

var Defines = require("../../shared/lib/defines");
var Str = require("../../shared/lib/strlib");
var Proc = require("../../shared/lib/proclib");
var TestMonitor = require("../lib/testmon.js");
var Machines = require("../../../_data/machines.json");

var fDebug = false;
var args = Proc.getArgs();
var argv = args.argv;

var baudRate = 9600;
var rtscts = true;

if (argv['debug'] !== undefined) {
    fDebug = argv['debug'];
}
if (argv['baud'] !== undefined) {
    baudRate = +argv['baud'];
    console.log("opening with baudRate " + baudRate);
}
if (global.DEBUG !== undefined) {
    global.DEBUG = fDebug;
}
if (global.APPVERSION !== undefined) {
    global.APPVERSION = Machines['shared']['version'];
}

/**
 * The PortController class mimics the PCx86 TestController class, providing wrappers around Node's SerialPort
 * interfaces that are compatible with the PCx86 TestMonitor module. 
 * 
 * @class PortController
 */
class PortController {
    /**
     * PortController()
     *
     * @this {PortController}
     * @param {string} path
     * @param {Object} options
     */
    constructor(path, options)
    {
        let controller = this;
        this.port = new SerialPort(path, options);

        this.port.on('data', function(data) {
            controller.receiveData(data);
        });

        this.port.on('open', function() {
            console.log("Connected to: ",controller.port.path);
            controller.port.get(function(error, status){
                console.log('get() results:');
                console.log(error);
                console.log(status);
            });
        });

        this.stdin = process.stdin;
        this.stdout = process.stdout;

        try {
            this.stdin.setRawMode(true);
        } catch(err) {
            console.log("unable to use stdin.setRawMode()");
        }
        this.stdin.resume();
        this.stdin.setEncoding("utf8");

        this.stdin.on('data', function(data) {
            controller.receiveInput(data);
        });

        this.tests = require("../../../tests/pcx86/tests.json");
        this.deliverData = this.deliverInput = this.deliverTests = null;
        
        let monitor = new TestMonitor();
        monitor.bindController(this, this.sendData, this.sendOutput, this.printf);
    }

    /**
     * bindMonitor(monitor, deliverData, deliverInput, deliverTests)
     *
     * @this {PortController}
     * @param {TestMonitor} monitor
     * @param {function(number)} deliverData
     * @param {function(number)} deliverInput
     * @param {function(Object)} deliverTests
     */
    bindMonitor(monitor, deliverData, deliverInput, deliverTests)
    {
        this.deliverData = deliverData.bind(monitor);
        this.deliverInput = deliverInput.bind(monitor);
        this.deliverTests = deliverTests.bind(monitor);
        if (this.tests && this.deliverTests) {
            this.deliverTests(this.tests);
            this.tests = null;
        }
    }

    /**
     * printf(format, ...args)
     *
     * @this {PortController}
     * @param {string} format
     * @param {...} args
     */
    printf(format, ...args)
    {
        this.stdout.write(Str.sprintf(format, ...args));
    }

    /**
     * receiveData(data)
     *
     * @this {PortController}
     * @param {number|string|Array} data
     */
    receiveData(data)
    {
        if (this.deliverInput) {

            if (typeof data == "number") {
                this.deliverData(data);
            }
            else if (typeof data == "string") {
                for (let i = 0; i < data.length; i++) this.deliverData(data.charCodeAt(i));
            }
            else {
                for (let i = 0; i < data.length; i++) this.deliverData(data[i]);
            }
        } else {
            console.log("data(" + typeof data + "): ", data);
        }
    }

    /**
     * receiveInput(data)
     *
     * @this {PortController}
     * @param {string} data
     */
    receiveInput(data)
    {
        if (data === '\u0003') {        // ctrl-c
            process.exit();
        }
        
        if (this.deliverInput) {
            this.deliverInput(data.charCodeAt(0));
        }
        /*
         * Node defines the first parameter of write() as a "chunk", which can be a string, Buffer, or Uint8Array.
         */
        // this.stdout.write(data);
    }
    
    /**
     * sendData(data)
     *
     * @this {PortController}
     * @param {number|string|Array} data
     */
    sendData(data)
    {
        if (typeof data == "number") {
            data = String.fromCharCode(data);
        }
        this.port.write(/** @type {string|Array} */ (data));
    }

    /**
     * sendOutput(data)
     *
     * @this {PortController}
     * @param {number|string|Array} data
     */
    sendOutput(data)
    {
        if (typeof data == "number") {
            this.printf("%c", data);
        }
        else if (typeof data == "string") {
            this.printf("%s", data);
        }
        else {
            for (let i = 0; i < data.length; i++) this.printf("[0x%02x]", data[i]);
        }
    }
}

let controller = new PortController("/dev/tty.KeySerial1", {baudRate, rtscts});
