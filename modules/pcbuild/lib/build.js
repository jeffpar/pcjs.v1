/**
 * @fileoverview PCjs Build Options
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Feb-10
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of the JavaScript Machines Project (aka JSMachines) at <http://jsmachines.net/>
 * and <http://pcjs.org/>.
 *
 * JSMachines is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * JSMachines is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with JSMachines.
 * If not, see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see Computer.COPYRIGHT).
 *
 * Some JSMachines files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * JSMachines Project for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

/*
 * This file provides all the UI options for building a functional PCjs PC.
 */

var typeAddress = {
    type: "address"
};

var typeBoolean = {
    type: "boolean"
};

var typeNumber = {
    type: "number"
};

var typePath = {
    type: "string"
};

var typeString = {
    type: "string"
};

var machineTypes = {
    '5150': "IBM PC (Model 5150)",
    '5160': "IBM PC XT (Model 5160)",
    '5170': "IBM PC AT (Model 5170)",
    'deskpro386': "COMPAQ DeskPro 386"
};

var aMachineElements = {
    'machine': {
        choices: machineTypes
    },
    'name': {
        desc: "Machine Description"
    },
    'computer': {
        desc: "General Computer Features",
        'buswidth': {
            type: typeNumber,
            values: [20, 24, 32]
        },
        'resume': {
            type: typeNumber,
            value: [0, 1, 2],
            descs: ["Resume Disabled", "Resume Enabled", "Resume with Prompt"]
        }
    },
    'ram': {
        desc: "Read-Write Memory (Conventional or Extended)",
        'addr': {
            type: typeAddress
        },
        'size': {
            type: typeNumber
        }
    },
    'rom': {
        desc: "Read-Only Memory",
        'addr': {
            type: typeAddress
        },
        'size': {
            type: typeNumber
        },
        'file': {
            type: typePath
        }
    }
};


/**
 * buildPC(idElement)
 *
 * @param {string} idElement (the ID of the DIV where build UI options should be presented)
 */
function buildPC(idElement)
{
    alert("build.js loaded: " + idElement);
}
