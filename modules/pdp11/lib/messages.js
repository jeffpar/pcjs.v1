/**
 * @fileoverview Defines PDP11 message categories.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright Jeff Parsons 2012-2016
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.3 written by Paul Nankervis
 * (paulnank@hotmail.com) as of August 2016 from http://skn.noip.me/pdp11/pdp11.html.  This code
 * may be used freely provided the original author name is acknowledged in any modified source code.
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
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see COPYRIGHT in /modules/shared/lib/defines.js).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

var MessagesPDP11 = {
    CPU:        0x00000001,
    TRAP:       0x00000010,
    BUS:        0x00000040,
    MEM:        0x00000080,
    KEYBOARD:   0x00010000,
    KEYS:       0x00020000,
    DISK:       0x00200000,
    SERIAL:     0x00800000,
    SPEAKER:    0x02000000,
    COMPUTER:   0x04000000,
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
MessagesPDP11.CATEGORIES = {
    "cpu":      MessagesPDP11.CPU,
    "trap":     MessagesPDP11.TRAP,
    "bus":      MessagesPDP11.BUS,
    "mem":      MessagesPDP11.MEM,
    "keyboard": MessagesPDP11.KEYBOARD, // "kbd" is also allowed as shorthand for "keyboard"; see doMessages()
    "key":      MessagesPDP11.KEYS,     // using "key" instead of "keys", since the latter is a method on JavasScript objects
    "disk":     MessagesPDP11.DISK,
    "serial":   MessagesPDP11.SERIAL,
    "speaker":  MessagesPDP11.SPEAKER,
    "computer": MessagesPDP11.COMPUTER,
    "log":      MessagesPDP11.LOG,
    "warn":     MessagesPDP11.WARN,
    /*
     * Now we turn to message actions rather than message types; for example, setting "halt"
     * on or off doesn't enable "halt" messages, but rather halts the CPU on any message above.
     *
     * Similarly, "m buffer on" turns on message buffering, deferring the display of all messages
     * until "m buffer off" is issued.
     */
    "buffer":   MessagesPDP11.BUFFER,
    "halt":     MessagesPDP11.HALT
};

if (NODE) module.exports = MessagesPDP11;
