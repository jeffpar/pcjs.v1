/**
 * @fileoverview Defines PDP-10 message categories.
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

var MessagesPDP10 = {
    CPU:        0x00000001,
    TRAP:       0x00000002,
    FAULT:      0x00000004,
    INT:        0x00000008,
    BUS:        0x00000010,
    MEMORY:     0x00000020,
    MMU:        0x00000040,
    ROM:        0x00000080,
    DEVICE:     0x00000100,
    PANEL:      0x00000200,
    KEYBOARD:   0x00000400,
    KEYS:       0x00000800,
    PAPER:      0x00001000,
    READ:       0x00004000,
    WRITE:      0x00008000,
    SERIAL:     0x00100000,
    TIMER:      0x00200000,
    SPEAKER:    0x01000000,
    COMPUTER:   0x02000000,
    LOG:        0x10000000,
    WARN:       0x20000000,
    BUFFER:     0x40000000,
    HALT:       0x80000000|0
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
MessagesPDP10.CATEGORIES = {
    "cpu":      MessagesPDP10.CPU,
    "trap":     MessagesPDP10.TRAP,
    "fault":    MessagesPDP10.FAULT,
    "int":      MessagesPDP10.INT,
    "bus":      MessagesPDP10.BUS,
    "memory":   MessagesPDP10.MEMORY,
    "mmu":      MessagesPDP10.MMU,
    "rom":      MessagesPDP10.ROM,
    "device":   MessagesPDP10.DEVICE,
    "panel":    MessagesPDP10.PANEL,
    "keyboard": MessagesPDP10.KEYBOARD, // "kbd" is also allowed as shorthand for "keyboard"; see doMessages()
    "key":      MessagesPDP10.KEYS,     // using "key" instead of "keys", since the latter is a method on JavasScript objects
    "paper":    MessagesPDP10.PAPER,
    "read":     MessagesPDP10.READ,
    "write":    MessagesPDP10.WRITE,
    "serial":   MessagesPDP10.SERIAL,
    "timer":    MessagesPDP10.TIMER,
    "speaker":  MessagesPDP10.SPEAKER,
    "computer": MessagesPDP10.COMPUTER,
    "log":      MessagesPDP10.LOG,
    "warn":     MessagesPDP10.WARN,
    /*
     * Now we turn to message actions rather than message types; for example, setting "halt"
     * on or off doesn't enable "halt" messages, but rather halts the CPU on any message above.
     *
     * Similarly, "m buffer on" turns on message buffering, deferring the display of all messages
     * until "m buffer off" is issued.
     */
    "buffer":   MessagesPDP10.BUFFER,
    "halt":     MessagesPDP10.HALT
};

if (NODE) module.exports = MessagesPDP10;
