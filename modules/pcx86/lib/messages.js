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
    NONE:       0x00000000,
    CPU:        0x10000001,
    SEG:        0x10000002,
    DESC:       0x10000004,
    PORT:       0x10000008,
    TSS:        0x10000010,
    IOPM:       0x10000020,
    INT:        0x10000040,
    NMI:        0x10000080,
    FAULT:      0x10000100,
    TRAP:       0x10000200,
    BUS:        0x20000001,
    IRQ:        0x20000002,     
    MEM:        0x20000004,
    DMA:        0x20000008,
    FDC:        0x20000010,
    HDC:        0x20000020,
    DISK:       0x20000040,
    PIC:        0x20000080,
    TIMER:      0x20000100,
    CMOS:       0x20000200,
    RTC:        0x20000400,
    C8042:      0x20000800,
    KBD:        0x20001000,
    PARALLEL:   0x20002000,
    SERIAL:     0x20004000,
    MOUSE:      0x20008000,
    SPEAKER:    0x20010000,
    CHIPSET:    0x20020000,
    VIDEO:      0x20040000,
    COMPUTER:   0x20080000,
    DOS:        0x40100000,
    DATA:       0x40200000,
    EVENT:      0x40400000,
    KEY:        0x40800000,
    WARN:       0x41000000,
    HALT:       0x81000000|0,
    BUFFER:     0x82000000|0
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
    "port":     Messages.PORT,
    "tss":      Messages.TSS,
    "iopm":     Messages.IOPM,
    "int":      Messages.INT,
    "nmi":      Messages.NMI,
    "fault":    Messages.FAULT,
    "trap":     Messages.TRAP,
    "bus":      Messages.BUS,
    "irq":      Messages.IRQ,
    "mem":      Messages.MEM,
    "dma":      Messages.DMA,
    "fdc":      Messages.FDC,
    "hdc":      Messages.HDC,
    "disk":     Messages.DISK,
    "pic":      Messages.PIC,
    "timer":    Messages.TIMER,
    "cmos":     Messages.CMOS,
    "rtc":      Messages.RTC,
    "8042":     Messages.C8042,
    "kbd":      Messages.KBD,
    "parallel": Messages.PARALLEL,
    "serial":   Messages.SERIAL,
    "mouse":    Messages.MOUSE,
    "speaker":  Messages.SPEAKER,
    "chipset":  Messages.CHIPSET,
    "video":    Messages.VIDEO,
    "computer": Messages.COMPUTER,
    "dos":      Messages.DOS,
    "data":     Messages.DATA,
    "event":    Messages.EVENT,
    "key":      Messages.KEY,
    "warn":     Messages.WARN,
    /*
     * Now we turn to message actions rather than message types; for example, setting "halt"
     * on or off doesn't enable "halt" messages, but rather halts the CPU on any message above.
     *
     * Similarly, "m buffer on" turns on message buffering, deferring the display of all messages
     * until "m buffer off" is issued.
     */
    "halt":     Messages.HALT,
    "buffer":   Messages.BUFFER
};

if (NODE) module.exports = Messages;
