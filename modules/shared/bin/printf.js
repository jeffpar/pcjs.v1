#!/usr/bin/env node
/**
 * @fileoverview Test the sprintf() function
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
 * @suppress {missingProperties}
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
 * <https://www.pcjs.org/modules/shared/lib/defines.js>.
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

var repl = require("repl");
var Defines = require("../lib/defines");
var Str = require("../lib/strlib");

/**
 * printf(format, args)
 *
 * @param {string} format
 * @param {...} args
 * @return {boolean}
 */
function printf(format, ...args)
{
    console.log("printf(" + format + "): '" + Str.sprintf(format, ...args) + "'");
    return true;
}

/**
 * onCommand(cmd, context, filename, callback)
 *
 * @param {string} cmd
 * @param {Object} context
 * @param {string} filename
 * @param {function(Object|null, Object)} [callback]
 */
var onCommand = function (cmd, context, filename, callback)
{
    var result = false;
    var args = cmd.trim().split(',');
    result = printf(...args);
    if (callback) callback(null, result);
};

onCommand("%s%s=%d,foo,bar,33");

repl.start({
    prompt: "printf> ",
    input: process.stdin,
    output: process.stdout,
    eval: onCommand
});
