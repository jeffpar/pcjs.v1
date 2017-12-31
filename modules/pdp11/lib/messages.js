/**
 * @fileoverview Defines PDP-11 message categories.
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

var MessagesPDP11 = {
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
    PC11:       0x00001000,
    PAPER:      0x00001000,
    DISK:       0x00002000,
    READ:       0x00004000,
    WRITE:      0x00008000,
    RK11:       0x00010000,
    RL11:       0x00020000,
    RX11:       0x00040000,
    DL11:       0x00100000,
    SERIAL:     0x00100000,
    KW11:       0x00200000,
    TIMER:      0x00200000,
    SPEAKER:    0x01000000,
    COMPUTER:   0x02000000,
    LOG:        0x20000000,
    WARN:       0x40000000,
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
MessagesPDP11.CATEGORIES = {
    "cpu":      MessagesPDP11.CPU,
    "trap":     MessagesPDP11.TRAP,
    "fault":    MessagesPDP11.FAULT,
    "int":      MessagesPDP11.INT,
    "bus":      MessagesPDP11.BUS,
    "memory":   MessagesPDP11.MEMORY,
    "mmu":      MessagesPDP11.MMU,
    "rom":      MessagesPDP11.ROM,
    "device":   MessagesPDP11.DEVICE,
    "panel":    MessagesPDP11.PANEL,
    "keyboard": MessagesPDP11.KEYBOARD, // "kbd" is also allowed as shorthand for "keyboard"; see doMessages()
    "key":      MessagesPDP11.KEYS,     // using "key" instead of "keys", since the latter is a method on JavasScript objects
    "pc11":     MessagesPDP11.PC11,
    "paper":    MessagesPDP11.PAPER,
    "disk":     MessagesPDP11.DISK,
    "read":     MessagesPDP11.READ,
    "write":    MessagesPDP11.WRITE,
    "rk11":     MessagesPDP11.RK11,
    "rl11":     MessagesPDP11.RL11,
    "rx11":     MessagesPDP11.RX11,
    "dl11":     MessagesPDP11.DL11,
    "serial":   MessagesPDP11.SERIAL,
    "kw11":     MessagesPDP11.KW11,
    "timer":    MessagesPDP11.TIMER,
    "speaker":  MessagesPDP11.SPEAKER,
    "computer": MessagesPDP11.COMPUTER,
    /*
     * Now we turn to message actions rather than message types; for example, setting "halt"
     * on or off doesn't enable "halt" messages, but rather halts the CPU on any message above.
     *
     * Similarly, "m log on" turns on message logging, deferring the display of all messages
     * until "m log off" is issued.
     */
    "log":      MessagesPDP11.LOG,
    "warn":     MessagesPDP11.WARN,
    "halt":     MessagesPDP11.HALT
};

if (NODE) module.exports = MessagesPDP11;
