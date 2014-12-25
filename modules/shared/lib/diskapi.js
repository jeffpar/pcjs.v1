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

/*
 * Common (supported) diskette formats
 */
DiskAPI.DISKETTE_FORMATS = {
    163840:  [40,1,8],          // media type 0xFE: 40 cylinders, 1 head (single-sided),   8 sectors/track, ( 320 total sectors x 512 bytes/sector ==  163840)
    184320:  [40,1,9],          // media type 0xFC: 40 cylinders, 1 head (single-sided),   9 sectors/track, ( 360 total sectors x 512 bytes/sector ==  184320)
    327680:  [40,2,8],          // media type 0xFF: 40 cylinders, 2 heads (double-sided),  8 sectors/track, ( 640 total sectors x 512 bytes/sector ==  327680)
    368640:  [40,2,9],          // media type 0xFD: 40 cylinders, 2 heads (double-sided),  9 sectors/track, ( 720 total sectors x 512 bytes/sector ==  368640)
    737280:  [80,2,9],          // media type 0xF9: 80 cylinders, 2 heads (double-sided),  9 sectors/track, (1440 total sectors x 512 bytes/sector ==  737280)
    1228800: [80,2,15],         // media type 0xF9: 80 cylinders, 2 heads (double-sided), 15 sectors/track, (2400 total sectors x 512 bytes/sector == 1228800)
    1474560: [80,2,18],         // media type 0xF0: 80 cylinders, 2 heads (double-sided), 18 sectors/track, (2880 total sectors x 512 bytes/sector == 1474560)
    2949120: [80,2,36]          // media type 0xF0: 80 cylinders, 2 heads (double-sided), 36 sectors/track, (5760 total sectors x 512 bytes/sector == 2949120)
};

/*
 * BIOS Parameter Block (BPB) offsets in DOS-compatible boot sectors
 */
DiskAPI.BPB = {
    JMP_OPCODE:     0x00,       // 1 byte for a JMP opcode, followed by a 1 or 2-byte offset
    OEM_STRING:     0x03,       // 8 bytes
    SECTOR_BYTES:   0x0B,       // 2 bytes: bytes per sector (eg, 0x200 or 512)
    CLUSTER_SECS:   0x0D,       // 1 byte: sectors per cluster (eg, 1)
    RESERVED_SECS:  0x0E,       // 2 bytes: reserved sectors; ie, # sectors preceding the first FAT--usually just the boot sector (eg, 1)
    FAT_TOTAL:      0x10,       // 1 byte: FAT copies (eg, 2)
    ROOT_ENTRIES:   0x11,       // 2 bytes: root directory entries (eg, 0x40 or 64) 0x40 * 0x20 = 0x800 (1 sector is 0x200 bytes, total of 4 sectors)
    TOTAL_SECS:     0x13,       // 2 bytes: number of sectors (eg, 0x140 or 320); if zero, refer to LARGE_SECS
    MEDIA_TYPE:     0x15,       // 1 byte: media type (eg, 0xFF: 320Kb, 0xFE: 160Kb, 0xFD: 360Kb, 0xFC: 180Kb)
    FAT_SECS:       0x16,       // 2 bytes: sectors per FAT (eg, 1)
    TRACK_SECS:     0x18,       // 2 bytes: sectors per track (eg, 8)
    HEAD_TOTAL:     0x1A,       // 2 bytes: number of heads (eg, 1)
    HIDDEN_SECS:    0x1C,       // 4 bytes: number of hidden sectors (always 0 for non-partitioned media)
    LARGE_SECS:     0x20        // 4 bytes: number of sectors if TOTAL_SECS is zero
};

/*
 * Directory Entry offsets in FAT-based disk images
 */
DiskAPI.DIR = {
    NAME:           0x00,       // 8 bytes
    EXT:            0x08,       // 3 bytes
    ATTR:           0x0B,       // 1 byte
    MODTIME:        0x16,       // 2 bytes
    MODDATE:        0x18,       // 2 bytes
    CLUSTER:        0x1A,       // 2 bytes
    SIZE:           0x1C,       // 4 bytes (typically zero for subdirectories)
    LENGTH:         0x20        // 32 bytes total
};

DiskAPI.ATTR = {
    READONLY:       0x01,       // PC-DOS 2.0 and up
    HIDDEN:         0x02,
    SYSTEM:         0x04,
    LABEL:          0x08,       // PC-DOS 2.0 and up
    SUBDIR:         0x10,       // PC-DOS 2.0 and up
    ARCHIVE:        0x20        // PC-DOS 2.0 and up
};

if (typeof module !== 'undefined') module.exports = DiskAPI;
