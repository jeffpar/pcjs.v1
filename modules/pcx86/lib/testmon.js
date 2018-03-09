/**
 * @fileoverview TestMonitor Class for SerialPort-based Testing
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
 * TestMonitor monitors activity on the bound SerialPort and a user I/O device (eg, a terminal,
 * a console window, etc).  It operates in several modes:
 * 
 * 1) TERMINAL mode: all data received from the SerialPort is routed the user output device,
 * and all data received from the user input device is routed to the SerialPort.  No special actions
 * are taken, until/unless the ATTENTION key is detected from the user input device (ie, Ctrl-T).
 * 
 * 2) PROMPT mode: data from the SerialPort is monitored for specific prompts (eg, "A>"), and
 * when one of those prompts is detected, we enter COMMAND mode, with category set to the appropriate
 * collection of tests.
 * 
 * 3) COMMAND mode: CR-terminated lines of user input are checked against the current set of test
 * commands, and if a match is found, the corresponding request is sent to the SerialPort.
 */

if (NODE) {
    var Keys        = require("../../shared/lib/keys");
    var Str         = require("../../shared/lib/strlib");
    var Web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var PCX86       = require("./defines");
}

/**
 * TestMonitor class
 *
 * @class TestMonitor
 * @property {string} mode
 * @property {string} promptActive
 * @property {string} promptBuffer
 * @property {Object|undefined} tests
 * @property {Object|undefined} category (eg, "DOS")
 * @property {string} commandBuffer
 * @property {function(...)} sendData
 * @property {function(...)} sendOutput
 * @property {function(string,...)} printf
 * @unrestricted (allows the class to define properties, both dot and named, outside of the constructor)
 */
class TestMonitor {
    /**
     * TestMonitor()
     *
     * @this {TestMonitor}
     */
    constructor()
    {
        if (DEBUG) console.log("TestMonitor()");
    }

    /**
     * bindController(controller, sendData, sendOutput, printf, sBinding)
     *
     * @this {TestMonitor}
     * @param {Object} controller
     * @param {function(...)} sendData
     * @param {function(...)} sendOutput
     * @param {function(string,...)} printf
     * @param {string} [sBinding]
     */
    bindController(controller, sendData, sendOutput, printf, sBinding)
    {
        this.sendData = sendData.bind(controller);
        this.sendOutput = sendOutput.bind(controller);
        this.printf = printf.bind(controller);
        controller.bindMonitor(this, this.receiveData, this.receiveInput, this.receiveTests);
        this.printf("%s TestMonitor v%s\n", APPNAME, APPVERSION || XMLVERSION);
        this.printf("Use Ctrl-T to toggle terminal mode%s\n", (sBinding? " (" + sBinding.toUpperCase() + ")" : ""));
        this.setMode(TestMonitor.MODE.TERMINAL);
    }

    /**
     * checkCommand()
     *
     * @this {TestMonitor}
     */
    checkCommand()
    {
        let suite = this.tests[this.category];
        let commands = suite['commands'];
        let aCommandParts = this.commandBuffer.split(' ');
        let command = commands[aCommandParts[0]];
        if (command) {
            let request = command['req'];
            if (request) {
                let errorMessage = "";
                request = request.replace(/\$([0-9]+)/g, function(match, index, offset, s) {
                    let i = +index;
                    let result = "";
                    if (i > aCommandParts.length) {
                        result = '$' + index;
                        errorMessage = "missing value for " + result;
                    } else {
                        result = (i? aCommandParts[i-1] : this.commandBuffer);
                    }
                    return result;
                });
                if (errorMessage) {
                    this.printf("%s\n", errorMessage);
                } else {
                    if (DEBUG) console.log("TestMonitor.checkCommand(" + this.commandBuffer + "): request '" + request + "'");
                    this.sendData(request);
                    let mode = command['mode'];
                    if (mode) this.setMode(mode);
                }
            } else {
                this.printf("missing request for command: %s\n", aCommandParts[0]);
            }
        } else {
            this.printf("unrecognized command: %s\n", this.commandBuffer);
        }
        this.commandBuffer = "";
    }
    
    /**
     * setMode(mode, category)
     * 
     * @this {TestMonitor}
     * @param {string} mode
     * @param {string} [category]
     */
    setMode(mode, category)
    {
        if (mode != this.mode) {
            switch (mode) {
            case TestMonitor.MODE.TERMINAL:
                this.category = null;
                break;

            case TestMonitor.MODE.PROMPT:
                this.aCategories = [];
                this.aPrompts = [];
                this.cchPromptLongest = 0;
                for (let category in this.tests) {
                    let suite = this.tests[category];
                    let prompt = suite[TestMonitor.MODE.PROMPT];
                    if (prompt) {
                        /*
                         * The 'prompt' property is allowed to contain a string or array of strings.
                         */
                        if (typeof prompt == "string") {
                            prompt = [prompt];
                        }
                        for (let i = 0; i < prompt.length; i++) {
                            this.aCategories.push(category);
                            this.aPrompts.push(prompt[i]);
                            if (this.cchPromptLongest < prompt[i].length) {
                                this.cchPromptLongest = prompt[i].length;
                            }
                        }
                    }
                }
                this.promptActive = this.promptBuffer = "";
                this.category = null;
                break;

            case TestMonitor.MODE.COMMAND:
                if (category) this.category = category;
                this.commandBuffer = "";
                break;

            default:
                this.printf("unrecognized mode: %s\n", mode);
                return;
            }

            this.mode = mode;
            this.printf("mode: %s\n", this.category || this.mode);
        }
    }
    
    /**
     * receiveTests(tests)
     *
     * @this {TestMonitor}
     * @param {Object} tests
     */
    receiveTests(tests)
    {
        if (DEBUG) console.log("TestMonitor.receiveTests(" + JSON.stringify(tests) + ")");
        this.tests = tests;
        this.setMode(TestMonitor.MODE.PROMPT);
    }

    /**
     * receiveData(data)
     *
     * @this {TestMonitor}
     * @param {number} data
     */
    receiveData(data)
    {
        if (this.mode == TestMonitor.MODE.PROMPT) {
            if (this.promptBuffer.length >= this.cchPromptLongest) {
                this.promptBuffer = this.promptBuffer.slice(-(this.cchPromptLongest - 1));
            }
            if (data == 10) this.promptBuffer = "";
            this.promptBuffer += String.fromCharCode(data);
            if (DEBUG) console.log("TestMonitor.receiveData(" + data + "): checking prompts for '" + this.promptBuffer + "'");
            let i = this.aPrompts.indexOf(this.promptBuffer);
            if (i >= 0) {
                this.setMode(TestMonitor.MODE.COMMAND, this.aCategories[i]);
            }
        } else if (this.mode == TestMonitor.MODE.TERMINAL) {
            this.sendOutput(data);
        } else {
            /*
             * TODO: This is where we need to collect the response to any commands we have issued.
             */
            // this.sendOutput(data);
            if (DEBUG) console.log("TestMonitor.receiveData(" + data + "): ignored while mode is '" + this.mode + "'");
        }
    }

    /**
     * receiveInput(charCode)
     *
     * @this {TestMonitor}
     * @param {number} charCode
     */
    receiveInput(charCode)
    {
        if (DEBUG) console.log("TestMonitor.receiveInput(" + charCode + ")");
        if (charCode == Keys.ASCII.CTRL_T) {
            this.setMode(this.mode == TestMonitor.MODE.TERMINAL? (this.category? TestMonitor.MODE.COMMAND : TestMonitor.MODE.PROMPT) : TestMonitor.MODE.TERMINAL);
            return;
        }
        if (this.mode == TestMonitor.MODE.TERMINAL || this.mode == TestMonitor.MODE.PROMPT) {
            this.sendData(charCode);
        } else if (this.mode == TestMonitor.MODE.COMMAND) {
            if (charCode == Keys.KEYCODE.CR) {
                this.sendOutput(Keys.KEYCODE.LF);
                this.checkCommand();
            } else {
                this.sendOutput(charCode);
                if (charCode == 8) {
                    if (this.commandBuffer.length) {
                        this.commandBuffer = this.commandBuffer.slice(0, -1);
                    }
                } else {
                    this.commandBuffer += String.fromCharCode(charCode);
                }
            }
        }
    }
}

TestMonitor.MODE = {
    TERMINAL:   "terminal",
    PROMPT:     "prompt",
    COMMAND:    "command"
};

if (NODE) module.exports = TestMonitor;
