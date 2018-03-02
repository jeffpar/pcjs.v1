#!/usr/bin/env node
/**
 * @fileoverview SerialPort-based Experimental Code (superseded by testmon.js)
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

var fDebug = false;
var args = Proc.getArgs();
var argv = args.argv;
if (argv['debug'] !== undefined) fDebug = argv['debug'];

var sPortName = "/dev/tty.KeySerial1";
var baudRate = 9600;

/**
 * printf(format, ...args)
 *
 * @param {string} format
 * @param {...} args
 */
function printf(format, ...args)
{
    console.log(Str.sprintf(format, ...args).replace(/\n$/,""));
}

printf("hello %s\n", "world");

var port = new SerialPort(sPortName, {baudRate});

port.on('data', function(data) {
    console.log("data(" + typeof data + "): ", data);
});

port.write('symdeb\r');

var stdin = process.stdin;
var stdout = process.stdout;

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding("utf8");

stdin.on("data", function(key) {
    if (key === '\u0003') {     // ctrl-c
        process.exit();
    }
    /*
     * Node defines the first parameter of write() as a "chunk", which can be a string, Buffer, or Uint8Array.
     */
    stdout.write(key);
});
