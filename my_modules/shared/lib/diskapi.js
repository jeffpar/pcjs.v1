/**
 * @fileoverview Disk APIs, as defined by httpapi.js and consumed by disk.js
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2014-May-08
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
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
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some JSMachines files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * JSMachines Project for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

/*
 * Our "DiskIO API" looks like:
 *
 *      http://www.pcjs.org/api/v1/disk?action=open&volume=*10mb.img&mode=demandrw&chs=c:h:s&machine=xxx&user=yyy
 */
var DiskAPI = {
    ENDPOINT:       "/api/v1/disk",
    QUERY: {
        ACTION:     "action",   // value is one of DiskAPI.ACTION.*
        VOLUME:     "volume",   // value is path of a disk image
        MODE:       "mode",     // value is one of DiskAPI.MODE.*
        CHS:        "chs",      // value is cylinders:heads:sectors:bytes
        ADDR:       "addr",     // value is cylinder:head:sector:count
        MACHINE:    "machine",  // value is machine token
        USER:       "user",     // value is user ID
        DATA:       "data"      // value is data to be written
    },
    ACTION: {
        OPEN:       "open",
        READ:       "read",
        WRITE:      "write",
        CLOSE:      "close"
    },
    MODE: {
        LOCAL:      "local",    // this mode implies no API (at best, localStorage backing only)
        PRELOAD:    "preload",  // this mode implies use of the DumpAPI
        DEMANDRW:   "demandrw",
        DEMANDRO:   "demandro"
    },
    FAIL: {
        BADACTION:  "invalid action",
        BADUSER:    "invalid user",
        BADVOL:     "invalid volume",
        OPENVOL:    "unable to open volume",
        CREATEVOL:  "unable to create volume",
        WRITEVOL:   "unable to write volume",
        REVOKED:    "access revoked"
    }
};

if (typeof module !== 'undefined') module.exports = DiskAPI;