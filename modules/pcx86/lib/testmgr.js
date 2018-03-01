/**
 * @fileoverview TestManager Class for SerialPort-based Testing
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

/*
 * Overview
 * --------
 * 
 * This module is being created to send a series of automated commands to a machine via
 * a serial port, and to optionally verify the responses to those commands.  It is designed
 * to be loaded by a Node server-side script and communicate with another machine's serial port
 * using one of the Node server's serial ports (and the Node SerialPort package).  It is also
 * designed to be loaded by the browser, and communicate with a PCjs machine's serial port
 * using PCjs' own SerialPort interfaces.
 */

if (NODE) {
    var Str         = require("../../shared/lib/strlib");
    var Web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var PCX86       = require("./defines");
}

/**
 * TestManager class
 *
 * @class TestManager
 * @property {function(string,...)} printf
 * @property {function(string,...)} printf
 * @unrestricted (allows the class to define properties, both dot and named, outside of the constructor)
 */
class TestManager {
    /**
     * TestManager()
     *
     * @this {TestManager}
     */
    constructor()
    {
        if (DEBUG) console.log("TestManager()");
    }

    /**
     * bindController(controller, sendData, sendOutput)
     *
     * @this {TestManager}
     * @param {Object} controller
     * @param {function(...)} sendData
     * @param {function(...)} sendOutput
     */
    bindController(controller, sendData, sendOutput)
    {
        this.controller = controller;
        this.sendData = sendData.bind(controller);
        this.printf = sendOutput.bind(controller);
        this.controller.bindManager(this, this.receiveData, this.receiveInput);
        if (DEBUG) this.printf("hello %s\n", "world");
    }

    /**
     * receiveData(data)
     *
     * @this {TestManager}
     * @param {number|string|Array} data
     */
    receiveData(data)
    {
        if (DEBUG) console.log("TestManager.receiveData(" + data + ")");
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

    /**
     * receiveInput(charCode)
     *
     * @this {TestManager}
     * @param {number} charCode
     */
    receiveInput(charCode)
    {
        if (DEBUG) console.log("TestManager.receiveInput(" + charCode + ")");
        this.sendData(charCode);
    }
}

if (NODE) module.exports = TestManager;
