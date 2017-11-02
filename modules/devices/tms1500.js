/**
 * @fileoverview Simulates a TMS-1500 Chip
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @copyright © Jeff Parsons 2012-2017
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

/**
 * 64-bit Register
 *
 * @class {Reg64}
 * @unrestricted
 */
class Reg64 extends Device {
    /**
     * Reg64(idMachine, idDevice, config)
     *
     * @this {Reg64}
     * @param {string} idMachine
     * @param {string} [idDevice]
     * @param {Object} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);
        /*
         * Each Reg64 register contains 16 BCD/Hex digits, which we store as 16 independent 4-bit numbers.
         */
        this.digits = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
}

/**
 * TMS-1500 Calculator Chip
 *
 * This chip contains lots of small discrete devices, most of which will be emulated either within this
 * class or within another small container class in the same file, because most of them are either very simple
 * or have unique quirks, so it's not clear there's much reusability.
 *
 * One exception is the ROM, since ROMs are a very common device with very similar characteristics.  Since
 * the Machine class guarantees that the Chip class is initialized after the ROM class, we can look it up in
 * the constructor.
 *
 * @class {Chip}
 * @unrestricted
 */
class Chip extends Device {
    /**
     * Chip(idMachine, idDevice, config)
     *
     * Defines the basic devices of the TMS-1500 chip, as illustrated by U.S. Patent No. 4,125,901, Fig. 3 (p. 4)
     *
     * @this {Chip}
     * @param {string} idMachine
     * @param {string} [idDevice]
     * @param {Object} [config]
     */
    constructor(idMachine, idDevice, config)
    {
        super(idMachine, idDevice, config);

        /*
         * Four (4) Operational Registers: A-D
         */
        this.regsO = new Array(4);
        for (let i = 0; i < 4; i++) {
            this.regsO[i] = new Reg64(idMachine, "Register " + String.fromCharCode(0x41+i));
        }

        /*
         * Eight (8) Storage Registers: X0-X7
         */
        this.regsX = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.regsX[i] = new Reg64(idMachine, "Register X" + String.fromCharCode(0x30+i));
        }

        /*
         * Eight (8) Storage Registers: Y0-Y7
         */
        this.regsY = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.regsY[i] = new Reg64(idMachine, "Register Y" + String.fromCharCode(0x30+i));
        }

        /*
         * RAB (Register Address Buffer) is a 3-bit register "selectively loadable by the I4-I6 bits of an
         * instruction word" and "also selectively loadable from the three least significant bits of the number
         * stored in R5 register".
         */
        this.regRAB = 0;

        /*
         * R5 is "an eight bit shift register which may be selectively loaded from either the serial output from
         * arithmetic unit" or "may be loaded on lines KR1-3 and KR5-7 via gates from keyboard logic (at which
         * times the MSB of each digit in Register R5 is loaded with a zero via gates according to the keyboard code
         * code indicated in Table II)".
         */
        this.regR5 = 0;

        /*
         * The "Output Register" is twelve bit register, one bit for each digit of the display.  This essentially
         * provides column information for the LED display, while the next register (regSGC) provides row information.
         *
         * Refer to patent Fig. 11c (p. 28)
         */
        this.regOut = 0;

        /*
         * The "Scan Generator Counter" is a 3-bit register.  It is updated once each instruction cycle.
         * It "does not count sequentially, but during eight instruction cycle provides the three bit binary
         * representations of zero through seven."  Here's the sequence from "Reference A" of Fig. 11e:
         *
         *                 DECODE    DISP     KBD
         *      W   V   U     SEG     SEG    SCAN    HOLD
         *      ---------  ------    ----    ----    ----
         *      1   1   1       D       -       -       1
         *      1   1   0       A       D     KS6       1
         *      1   0   1       B       A     KS5       1
         *      0   1   0       C       B     KS2       1
         *      1   0   0       E       C     KS4       1
         *      0   0   0       F       E     KS0       1
         *      0   0   1       G       F     KS1       1
         *      0   1   1       P       G     KS3       0
         *      ---------  ------    ----    ----    ----
         *      1   1   1       D       P     KS7       1
         *      1   1   0       A       D     KS6       1
         *      ...
         *
         * Refer to patent Fig. 11e (p. 30)
         */
        this.regScanGen = 0;

        /*
         * The "Segment/Keyboard Scan" is an 8-bit register "arranged as a ring counter for shifting a logical zero
         * to a different stage during each instruction cycle....  [It is] further interconnected with the RESET signal
         * for inserting a logical one into all stages of the counter."  The outputs from the stages are connected to
         * SEG D, followed by SEG A, SEG B, SEG C, SEG E, SEG F, SEG G, and SEG P.
         *
         * Refer to patent Fig. 11b (p. 27)
         */
        this.regSegKbdScan = 0xff;

        /*
         * The "State Time Generator" is represented by a 5-bit register that contains values 00000b through 11111b
         * for each of the 32 state times that occur during a single instruction cycle.  And since each "state time"
         * consists of four clock pulses, designated Φ1, P1, Φ2, and P2, we keep track of which pulse we're on, too.
         *
         * Refer to patent Fig. 11f (p. 31)
         */
        this.regStateTime = 0;
        this.regPulseTime = 0;

        /*
         * The "Program Counter" (regPC) is an 11-bit register that automatically increments unless a HOLD signal
         * is applied, effectively locking execution on a single instruction.  The next 13-bit instruction fetched
         * from ROM is stored in regIns.
         */
        this.regPC = 0;
        this.regIns = -1;

        /*
         * The "Subroutine Stack".  "When an unconditional branch instruction is decoded by branch logic 32b, the
         * CALL signal goes to zero permitting the present ROM address plus one to be loaded into subroutine stack
         * register 33a....  Addresses previously loaded into subroutine stack/registers 33a and 33b are shifted
         * to registers 33b and 33c."
         *
         * Refer to patent Fig. 7a (p. 9)
         */
        this.regPCStack = [0,0,0];

        /*
         * Get access to the ROM device.
         */
        this.rom = /** @type {ROM} */ (this.findDeviceByClass(Machine.CLASS.ROM));

        /*
         * Get access to the Time device, so we can give it our clocker() function.
         */
        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
        this.time.addClocker(this.clocker.bind(this));

        let chip = this;
        this.states = new Array(32);
        for (let i = 0; i < this.states.length; i++) {
            this.states[i] = new Array(4);
        }
        this.states[0][0] = chip.decodeIns.bind(this);  // S01.Φ1
        this.states[22][0] = function setROMAddr() {    // S22.Φ1
            chip.rom.setAddr(chip.regPC);
        };
        this.states[29][2] = function getROMData() {    // S29.Φ2
            chip.regIns = chip.rom.getData();
            chip.time.doOutside(function() {
                chip.println(chip.rom.getString());
                chip.stop();
            });
        };
        this.fStop = false;
    }

    /**
     * decodeIns()
     *
     * @this {Chip}
     */
    decodeIns()
    {
        if (this.regIns > 0) {
        }
    }

    /**
     * stop()
     *
     * @this {Chip}
     */
    stop()
    {
        this.time.stop();
        this.fStop = true;
    }

    /**
     * clocker(fStep)
     *
     * The TI-57 has a standard cycle time of 0.625us, which translates to 1,600,000 cycles per second.
     *
     * Every set of four cycles is designated a "state time".  Within a single state time (2.5us), the four cycles
     * are designated Φ1, P1, Φ2, and P2.  Moreover, one state time is required to transfer 2 bits from a data word
     * register.  Since a data word consists of 16 BCD digits (ie, 64 bits), 32 state times (80us) are required to
     * "clock" all the bits from one register to another.  This total time is referred to as an instruction cycle.
     *
     * Note that some instructions (ie, display instructions) slow the delivery of cycles, such that one state time
     * is 10us instead of 2.5us, and therefore the entire instruction cycle will take 320us instead of 80us.
     *
     * I'll start with the assumption that simulating a full 32 "state times", or 128 cycles, per call makes the most
     * sense.  So that's what we'll do.
     *
     * @this {Chip}
     * @param {boolean} [fStep] (default is false)
     * @returns {number}
     */
    clocker(fStep = false)
    {
        let nCycles = 0;
        this.fStop = fStep;
        do {
            let fn = this.states[this.regStateTime][this.regPulseTime];
            if (fn) fn();
            nCycles++;
            this.regPulseTime = (this.regPulseTime + 1) & 0x3;
            if (!this.regPulseTime) {
                this.regStateTime = (this.regStateTime + 1) & 0x1f;
            }
        } while ((this.regPulseTime || this.regStateTime) && !this.fStop);
        return nCycles;
    }
}
