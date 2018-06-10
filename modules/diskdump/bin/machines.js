#!/usr/bin/env node
/**
 * @fileoverview Node command-line machine extraction tool
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2018 Jeff Parsons
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

var fs = require("fs");
var glob = require("glob");
var path = require("path");
var defines = require("../../shared/lib/defines");
var Str = require("../..//shared/lib/strlib");
var Proc = require("../../shared/lib/proclib");
var args = Proc.getArgs();

/**
 * printf(format, ...args)
 *
 * @param {string} format
 * @param {...} args
 */
function printf(format, ...args)
{
    process.stdout.write(Str.sprintf(format, ...args));
}

/**
 * processMachines(sDir, fDebug)
 *
 * @param {string} sDir
 * @param {boolean} [fDebug] (true if --debug is specified on the command-line)
 */
function processMachines(sDir, fDebug)
{
    let aMachines = [];
    let asFiles = glob.sync(path.join(sDir, "**", "README.md"));
    for (let i = 0; i < asFiles.length; i++) {
        let sFile = asFiles[i], sMarkdown;
        if (sFile.indexOf("/archive") >= 0 || sFile.indexOf("/private") >= 0 || sFile.indexOf("/unlisted") >= 0) continue;
        try {
            sMarkdown = fs.readFileSync(sFile, {encoding: "utf8"});
        } catch(err) {
            printf("error: %s\n", err.message);
            process.exit(1);
        }

        let sDir = path.dirname(sFile);
        let sParent = ".." + path.sep;
        while (sDir.indexOf(sParent) == 0) sDir = sDir.substr(sParent.length);
        let j = sDir.indexOf(path.sep);
        let sCategory = j > 0? sDir.charAt(0).toUpperCase() + sDir.substring(1, j) : "";
        sDir = path.sep + sDir + path.sep;

        if (fDebug) printf("opened %s\n", sFile);
        /*
         * Check the file for Front Matter (ie, a header at the top of the file delineated by "---" lines)
         * that includes both a "title" property and a "machines" section.
         */
        let matchFM = sMarkdown.match(/^---[\s\S]*?\ntitle:\s*(["']|)(.*?)\1\n[\s\S]*?machines:([\s\S]*?\n)\S/);
        if (matchFM) {
            let sTitle = matchFM[2].replace(/&amp;/g, '&');
            let asMachines = matchFM[3].split("\n  - ");
            for (let sMachine of asMachines) {
                if (!sMachine) continue;
                let machine = {};
                machine.title = sTitle;
                machine.directory = sDir;
                machine.category = sCategory;
                let aProps = sMachine.split("\n    ");
                processProperties(machine, aProps, 0, "");
                if (!machine.id) continue;
                /*
                 * When no "config" property is provided, a "machine.xml" in the same directory is implied.
                 */
                if (!machine.config) machine.config = path.join(sDir, "machine.xml");
                if (fDebug) printf("%2j\n", machine);
                aMachines.push(machine);
            }
        }
    }
    let launch = {};
    launch.version = "0.1.0";
    launch.configurations = [];
    let aTitles = {}, aDirectories = {};
    for (let i = 0; i < aMachines.length; i++) {
        let machine = aMachines[i];
        /*
         * We're letting this slide because there are a variety of pages (eg, machine "array" demos)
         * that contain multiple machines; such pages need only one launch entry.
         */
        if (aDirectories[machine.directory]) {
            // printf('warning: duplicate machine directory "%s"\n', machine.directory);
            continue;
        }
        aDirectories[machine.directory] = machine;
        if (aTitles[machine.title]) {
            printf('warning: duplicate machine title "%s"\n', machine.title);
            printf('current:  %s\n', machine.directory);
            printf('original: %s\n\n', aTitles[machine.title].directory);
            continue;
        }
        aTitles[machine.title] = machine;
        let entry = {};
        entry.name = machine.title;
        if (machine.category) entry.name = machine.category + ": " + entry.name;
        entry.type = "chrome";
        entry.request = "launch";
        entry.url = "http://localhost:8088" + machine.directory;
        entry.webRoot = '$' + "{workspaceFolder}";
        launch.configurations.push(entry);
    }
    printf("%2j\n", launch);
}

/**
 * processProperties(obj, aProps, iProp, sIndent)
 *
 * @param {Object} obj (the object to update)
 * @param {Array.<string>} aProps (array of property strings)
 * @param {number} iProp (index within aProps to process)
 * @param {string} sIndent (some quantity of spaces, initially none)
 * @return {number} (updated iProp)
 */
function processProperties(obj, aProps, iProp, sIndent)
{
    let re = new RegExp("^" + sIndent + "([^ :]*):\\s*(.*)");
    while (iProp < aProps.length) {
        let sProp = aProps[iProp];
        let prop = re.exec(sProp);
        if (!prop) break;
        iProp++;
        if (!prop[2]) {
            obj[prop[1]] = {};
            iProp = processProperties(obj[prop[1]], aProps, iProp, sIndent + "  ");
        } else {
            obj[prop[1]] = prop[2];
        }
    }
    return iProp;
}

if (args.argc > 1) {
    let argv = args.argv;
    processMachines(argv[1], argv['debug']);
    process.exit(0);
}

printf("usage: node machines.js [directory]\n");
