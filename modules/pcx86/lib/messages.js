/**
 * @fileoverview Defines message categories.
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

var Messages = {
    CPU:        0x00000001,
    SEG:        0x00000002,
    DESC:       0x00000004,
    TSS:        0x00000008,
    INT:        0x00000010,
    FAULT:      0x00000020,
    BUS:        0x00000040,
    MEM:        0x00000080,
    PORT:       0x00000100,
    DMA:        0x00000200,
    PIC:        0x00000400,
    TIMER:      0x00000800,
    CMOS:       0x00001000,
    RTC:        0x00002000,
    C8042:      0x00004000,
    CHIPSET:    0x00008000,
    KEYBOARD:   0x00010000,
    KEYS:       0x00020000,
    VIDEO:      0x00040000,
    FDC:        0x00080000,
    HDC:        0x00100000,
    DISK:       0x00200000,
    PARALLEL:   0x00400000,
    SERIAL:     0x00800000,
    MOUSE:      0x01000000,
    SPEAKER:    0x02000000,
    COMPUTER:   0x04000000,
    DOS:        0x08000000,
    DATA:       0x10000000,
    BUFFER:     0x20000000,
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
Messages.CATEGORIES = {
    "cpu":      Messages.CPU,
    "seg":      Messages.SEG,
    "desc":     Messages.DESC,
    "tss":      Messages.TSS,
    "int":      Messages.INT,
    "fault":    Messages.FAULT,
    "bus":      Messages.BUS,
    "mem":      Messages.MEM,
    "port":     Messages.PORT,
    "dma":      Messages.DMA,
    "pic":      Messages.PIC,
    "timer":    Messages.TIMER,
    "cmos":     Messages.CMOS,
    "rtc":      Messages.RTC,
    "8042":     Messages.C8042,
    "chipset":  Messages.CHIPSET,       // ie, anything else in ChipSet besides DMA, PIC, TIMER, CMOS, RTC and 8042
    "keyboard": Messages.KEYBOARD,      // "kbd" is also allowed as shorthand for "keyboard"; see doMessages()
    "key":      Messages.KEYS,          // using "key" instead of "keys", since the latter is a method on JavasScript objects
    "video":    Messages.VIDEO,
    "fdc":      Messages.FDC,
    "hdc":      Messages.HDC,
    "disk":     Messages.DISK,
    "parallel": Messages.PARALLEL,
    "serial":   Messages.SERIAL,
    "mouse":    Messages.MOUSE,
    "speaker":  Messages.SPEAKER,
    "computer": Messages.COMPUTER,
    "dos":      Messages.DOS,
    "data":     Messages.DATA,
    /*
     * Now we turn to message actions rather than message types; for example, setting "halt"
     * on or off doesn't enable "halt" messages, but rather halts the CPU on any message above.
     *
     * Similarly, "m buffer on" turns on message buffering, deferring the display of all messages
     * until "m buffer off" is issued.
     */
    "buffer":   Messages.BUFFER,
    "warn":     Messages.WARN,
    "halt":     Messages.HALT
};

if (NODE) module.exports = Messages;
