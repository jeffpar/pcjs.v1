/**
 * @fileoverview Defines message categories.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © 2012-2020 Jeff Parsons
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

var Messages8080 = {
    NONE:       0x00000000,
    DEFAULT:    0x00000000,
    ADDRESS:    0x00000001,
    CPU:        0x00000002,
    BUS:        0x00000004,
    MEM:        0x00000008,
    PORT:       0x00000010,
    NVR:        0x00000020,
    CHIPSET:    0x00000040,
    KEYBOARD:   0x00000080,
    KEYS:       0x00000100,
    VIDEO:      0x00000200,
    FDC:        0x00000400,
    DISK:       0x00000800,
    SERIAL:     0x00001000,
    SPEAKER:    0x00002000,
    COMPUTER:   0x00004000,
    WARN:       0x10000000,
    HALT:       0x20000000,
    BUFFER:     0x40000000,
    ALL:        0xffffffff|0
};

/*
 * Message categories supported by the messageEnabled() function and other assorted message
 * functions. Each category has a corresponding bit value that can be combined (ie, OR'ed) as
 * needed.  The Debugger's message command ("m") is used to turn message categories on and off,
 * like so:
 *
 *      m port on
 *      m port off
 *      ...
 *
 * NOTE: The order of these categories can be rearranged, alphabetized, etc, as desired; just be
 * aware that changing the bit values could break saved Debugger states (not a huge concern, just
 * something to be aware of).
 */
Messages8080.CATEGORIES = {
    "cpu":      Messages8080.CPU,
    "bus":      Messages8080.BUS,
    "mem":      Messages8080.MEM,
    "port":     Messages8080.PORT,
    "nvr":      Messages8080.NVR,
    "chipset":  Messages8080.CHIPSET,
    "keyboard": Messages8080.KEYBOARD,  // "kbd" is also allowed as shorthand for "keyboard"; see doMessages()
    "key":      Messages8080.KEYS,      // using "key" instead of "keys", since the latter is a method on JavasScript objects
    "video":    Messages8080.VIDEO,
    "fdc":      Messages8080.FDC,
    "disk":     Messages8080.DISK,
    "serial":   Messages8080.SERIAL,
    "speaker":  Messages8080.SPEAKER,
    "computer": Messages8080.COMPUTER,
    "warn":     Messages8080.WARN,
    /*
     * Now we turn to message actions rather than message types; for example, setting "halt"
     * on or off doesn't enable "halt" messages, but rather halts the CPU on any message above.
     *
     * Similarly, "m buffer on" turns on message buffering, deferring the display of all messages
     * until "m buffer off" is issued.
     */
    "halt":     Messages8080.HALT,
    "buffer":   Messages8080.BUFFER
};

if (typeof module !== "undefined") module.exports = Messages8080;
