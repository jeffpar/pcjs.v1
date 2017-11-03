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
 * <http://pcjs.org/modules/devices/machine.js>.
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
         * is applied, effectively locking execution on a single instruction.  The next 13-bit instruction word
         * fetched from ROM is stored in regIW.
         */
        this.regPC = 0;
        this.regIW = -1;

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

        // let chip = this;
        // this.states = new Array(32);
        // for (let i = 0; i < this.states.length; i++) {
        //     this.states[i] = new Array(4);
        // }
        // this.states[0][0] = chip.decodeIW.bind(this);   // S01.Φ1
        // this.states[22][0] = function setROMAddr() {    // S22.Φ1
        //     chip.rom.setAddr(chip.regPC);
        // };
        // this.states[29][2] = function getROMData() {    // S29.Φ2
        //     chip.regIW = chip.rom.getData();
        //     chip.time.doOutside(function() {
        //         chip.println(chip.disassemble(chip.regIW, chip.regPC));
        //         chip.stop();
        //     });
        // };

        this.fStop = false;

        if (DEBUG) {
            for (let addr = 0; addr < 0x800; addr++) {
                let w = this.rom.getData(addr);
                console.log(this.disassemble(w, addr).trim());
            }
        }

        this.addHandler(Device.HANDLER.COMMAND, this.onCommand.bind(this));
    }

    /**
     * decode()
     *
     * @this {Chip}
     */
    decode()
    {
        if (this.regIW > 0) {
        }
    }

    /**
     * disassemble(w, addr)
     *
     * Returns a string representation of the selected instruction.
     *
     * @param {number} w
     * @param {number} addr
     * @returns {string}
     */
    disassemble(w, addr)
    {
        let sOp = "???", sOperands = "";

        if (w & 0x1000) {
            let v;
            if (w & 0x0800) {
                sOp = "BR";
                if (w & 0x0400) {
                    sOp += "C";
                } else {
                    sOp += "NC";
                }
                v = (addr & 0x0400) | (w & 0x03FF);
            } else {
                sOp = "CALL";
                v = w & 0x07FF;
            }
            sOperands = this.sprintf("0x%04x", v);
        }
        else {
            let sMask = "", v;
            switch(w & Chip.IW_MF.MASK) {
            case Chip.IW_MF.MMSD:   // 0x0000: Mantissa Most Significant Digit (D12)
                sMask = "0x000F000000000000";
                break;
            case Chip.IW_MF.ALL:    // 0x0100: (D0-D15)
                sMask = "0xFFFFFFFFFFFFFFFF";
                break;
            case Chip.IW_MF.MANT:   // 0x0200: Mantissa (D2-D12)
                sMask = "0x000FFFFFFFFFFF00";
                break;
            case Chip.IW_MF.MAEX:   // 0x0300: Mantissa and Exponent (D0-D12)
                sMask = "0x000FFFFFFFFFFFFF";
                break;
            case Chip.IW_MF.LLSD:   // 0x0400: Mantissa Least Significant Digit (D2)
                sMask = "0x0000000000000F00";
                break;
            case Chip.IW_MF.EXP:    // 0x0500: Exponent (D0-D1)
                sMask = "0x00000000000000FF";
                break;
            case Chip.IW_MF.RES1:   // 0x0600: (reserved)
                break;
            case Chip.IW_MF.FMAEX:  // 0x0700: Flag and Mantissa and Exponent (D0-D13)
                sMask = "0x00FFFFFFFFFFFFFF";
                break;
            case Chip.IW_MF.D14:    // 0x0800: (D14)
                sMask = "0x0F00000000000000";
                break;
            case Chip.IW_MF.FLAG:   // 0x0900: (D13-D15)
                sMask = "0xFFF0000000000000";
                break;
            case Chip.IW_MF.DIGIT:  // 0x0a00: (D14-D15)
                sMask = "0xFF00000000000000";
                break;
            case Chip.IW_MF.RES2:   // 0x0b00: (reserved)
                break;
            case Chip.IW_MF.FF:     // 0x0c00: (used for flag operations)
                switch(w & Chip.IW_FF.MASK) {
                case Chip.IW_FF.SET:
                    sOp = "SET";
                    break;
                case Chip.IW_FF.RESET:
                    sOp = "CLR";
                    break;
                case Chip.IW_FF.TEST:
                    sOp = "TST";
                    break;
                case Chip.IW_FF.TOGGLE:
                    sOp = "NOT";
                    break;
                }
                sOperands = Chip.OP_REGS[(w & Chip.IW_FF.J_MASK) >> Chip.IW_FF.J_SHIFT];
                /*
                 * We can represent the bit address as either "register:digit:bit" (ie, [A-D]:[D13-D15]:[0-3])
                 * or "register:bit" ([A-D]:[52-63]); let's go with the latter.
                 *
                 *      Chip.D_VALS = ["?","D13","D14","D15"];
                 *      sOperands += ':' + Chip.D_VALS[(w & Chip.IW_FF.D_MASK) >> Chip.IW_FF.D_SHIFT];
                 *      sOperands += ':' + ((w & Chip.IW_FF.B_MASK) >> Chip.IW_FF.B_SHIFT);
                 */
                v = ((w & (Chip.IW_FF.D_MASK | Chip.IW_FF.B_MASK)) >> Chip.IW_FF.B_SHIFT) + 48;
                sOperands += ':' + (v < 52? "?" : v);
                break;
            case Chip.IW_MF.D13:    // 0x0d00: (D13)
                sMask = "0x00F0000000000000";
                break;
            case Chip.IW_MF.PF:     // 0x0e00: (used for misc operations)
                switch(w & Chip.IW_PF.MASK) {
                case Chip.IW_PF.STYA:   // 0x0000: Contents of storage register Y defined by RAB loaded into operational register A (Yn -> A)
                    sOp = "LOAD";
                    sOperands = "A,Y[RAB]";
                    break;
                case Chip.IW_PF.RABI:   // 0x0001: Bits 4-6 of instruction are stored in RAB
                    sOp = "LOAD";
                    sOperands = "RAB," + ((w & 0x70) >> 4);
                    break;
                case Chip.IW_PF.BRR5:   // 0x0002: Branch to R5
                    sOp = "BR";
                    sOperands = "R5";
                    break;
                case Chip.IW_PF.RET:    // 0x0003: Return
                    sOp = "RET";
                    break;
                case Chip.IW_PF.STAX:   // 0x0004: Contents of operational register A loaded into storage register X defined by RAB (A -> Xn)
                    sOp = "STORE";
                    sOperands = "X[RAB],A";
                    break;
                case Chip.IW_PF.STXA:   // 0x0005: Contents of storage register X defined by RAB loaded into operational register A (Xn -> A)
                    sOp = "LOAD";
                    sOperands = "A,X[RAB]";
                    break;
                case Chip.IW_PF.STAY:   // 0x0006: Contents of operational register A loaded into storage register Y defined by RAB (A -> Yn)
                    sOp = "STORE";
                    sOperands = "Y[RAB],A";
                    break;
                case Chip.IW_PF.DISP:   // 0x0007: registers A and B are output to the Display Decoder and the Keyboard is scanned
                    sOp = "DISP";
                    break;
                case Chip.IW_PF.BCDS:   // 0x0008: BCD set: enables BCD corrector in arithmetic unit
                    sOp = "BCDS";
                    break;
                case Chip.IW_PF.BCDR:   // 0x0009: BCD reset: disables BCD corrector in arithmetic unit (which then functions as hexadecimal)
                    sOp = "BCDR";
                    break;
                case Chip.IW_PF.RABR5:  // 0x000A: LSD of R5 (3 bits) is stored in RAB
                    sOp = "LOAD";
                    sOperands = "RAB,R5L";
                    break;
                default:
                    /*
                     * The "Hrast" emulator defines some additional opcodes at this point, without (as usual) any explanation;
                     * ie, are these pseudo-opcodes (which ?KEY almost certainly is) or are these undocumented opcodes that showed
                     * up in one or more of the patent listings and whose operation was inferred or deduced?
                     *
                     *      0x000B: POWOFF
                     *      0x000C: STAX MAEX (a special version of STAX)
                     *      0x000D: ?KEY (used in lieu of a second DISP instruction)
                     *      0x000E: STAY MAEX (a special version of STAY)
                     *      0x0EFF: NOP
                     */
                    break;
                }
                break;
            case Chip.IW_MF.D15:    // 0x0f00: (D15)
                sMask = "0xF000000000000000";
                break;
            }
            if (sMask) {
                let j = (w & Chip.IW_MF.J_MASK) >> Chip.IW_MF.J_SHIFT;
                let k = (w & Chip.IW_MF.K_MASK) >> Chip.IW_MF.K_SHIFT;
                let l = (w & Chip.IW_MF.L_MASK) >> Chip.IW_MF.L_SHIFT;
                let n = (w & Chip.IW_MF.N_MASK);

                sOp = "LOAD";
                let sOperator = "";
                let sDst = "?", sSrc = "?";
                if (!n) {
                    sOperator = (k == 5? "<<" : "+");
                } else {
                    sOperator = (k == 5? ">>" : "-");
                }

                switch(l) {
                case 0:
                    sDst = Chip.OP_REGS[j];
                    break;
                case 1:
                    if (k < 4) sDst = Chip.OP_REGS[k];
                    break;
                case 2:
                    if (k < 6) sDst = "NUL";            // "suppressed" operation
                    break;
                case 3:
                    if (!n) {
                        sOp = "XCHG";
                        if (!j) sDst = "A";             // NOTE j != 0 or k >= 4 is invalid
                        if (k < 4) sSrc = Chip.OP_REGS[k];
                    } else {
                        sOp = "MOVE";
                        sDst = Chip.OP_REGS[j];
                        sSrc = Chip.OP_REGS[k];         // NOTE: k == 5 is invalid
                    }
                    k = -1;
                    break;
                }

                switch(k) {
                case 0:
                case 1:
                case 2:
                case 3:
                    sSrc = Chip.OP_REGS[j] + sOperator + Chip.OP_REGS[k];
                    break;
                case 4:
                case 5:
                    sSrc = Chip.OP_REGS[j] + sOperator + "1";
                    break;
                case 6:
                    sSrc = Chip.OP_REGS[j] + sOperator + "R5L";
                    break;
                case 7:
                    sSrc = Chip.OP_REGS[j] + sOperator + "R5";
                    break;
                }
                sOperands = sDst + "," + sSrc + "," + sMask;
            }
        }
        return this.sprintf("0x%04x: 0x%04x  %-8s%s\n", addr, w, sOp, sOperands);
    }

    /**
     * onCommand(sCommand)
     *
     * @param {string} sCommand
     * @returns {boolean} (true if processed, false if not)
     */
    onCommand(sCommand)
    {
        let addr, n = 8, sResult = "";
        let aCommands = sCommand.split(' ');
        switch(aCommands[0]) {
        case "u":
            addr = aCommands[1]? (Number.parseInt(aCommands[1], 16) || 0) : this.regPC;
            while (n--) {
                sResult += this.disassemble(this.rom.getData(addr), addr++);
            }
            break;
        case "":
            return true;
        case "help":
        case "?":
            sResult = "supported commands:\nu [addr]";
            break;
        default:
            break;
        }
        if (!sResult) {
            sResult = "unsupported command: " + sCommand;
        }
        this.println(sResult.trim());
        return true;
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
        let nCycles = 128;

        return nCycles;
    }
}

Chip.IW_MF = {          // Instruction Word Mask Field
    MASK:   0x0F00,
    MMSD:   0x0000,     // Mantissa Most Significant Digit (D12)
    ALL:    0x0100,     // (D0-D15)
    MANT:   0x0200,     // Mantissa (D2-D12)
    MAEX:   0x0300,     // Mantissa and Exponent (D0-D12)
    LLSD:   0x0400,     // Mantissa Least Significant Digit (D2)
    EXP:    0x0500,     // Exponent (D0-D1)
    RES1:   0x0600,     // (reserved)
    FMAEX:  0x0700,     // Flag and Mantissa and Exponent (D0-D13)
    D14:    0x0800,     // (D14)
    FLAG:   0x0900,     // (D13-D15)
    DIGIT:  0x0A00,     // (D14-D15)
    RES2:   0x0B00,     // (reserved)
    FF:     0x0C00,     // FF used for additional instruction decoding
    D13:    0x0D00,     // (D13)
    PF:     0x0E00,     // PF used for additional instruction decoding
    D15:    0x0F00,     // (D15)
    J_MASK: 0x00C0,
    J_SHIFT:     6,
    K_MASK: 0x0038,
    K_SHIFT:     3,
    L_MASK: 0x0006,
    L_SHIFT:     1,
    N_MASK: 0x0001
};

Chip.IW_FF = {          // Instruction Word F (Flag) Field (used when the Mask Field is FF)
    MASK:   0x0003,
    SET:    0x0000,
    RESET:  0x0001,
    TEST:   0x0002,
    TOGGLE: 0x0003,
    J_MASK: 0x00C0,
    J_SHIFT:     6,
    D_MASK: 0x0030,
    D_SHIFT:     4,
    B_MASK: 0x000C,
    B_SHIFT:     2,
};

Chip.IW_PF = {          // Instruction Word P (Misc) Field (used when the Mask Field is PF)
    MASK:   0x000F,
    STYA:   0x0000,     // Contents of storage register Y defined by RAB loaded into operational register A (Yn -> A)
    RABI:   0x0001,     // Bits 4-6 of instruction are stored in RAB
    BRR5:   0x0002,     // Branch to R5
    RET:    0x0003,     // Return
    STAX:   0x0004,     // Contents of operational register A loaded into storage register X defined by RAB (A -> Xn)
    STXA:   0x0005,     // Contents of storage register X defined by RAB loaded into operational register A (Xn -> A)
    STAY:   0x0006,     // Contents of operational register A loaded into storage register Y defined by RAB (A -> Yn)
    DISP:   0x0007,     // registers A and B are output to the Display Decoder and the Keyboard is scanned
    BCDS:   0x0008,     // BCD set: enables BCD corrector in arithmetic unit
    BCDR:   0x0009,     // BCD reset: disables BCD corrector in arithmetic unit (which then functions as hexadecimal)
    RABR5:  0x000A,     // LSD of R5 (3 bits) is stored in RAB
    RES1:   0x000B,     // (reserved)
    RES2:   0x000C,     // (reserved)
    RES3:   0x000D,     // (reserved)
    RES4:   0x000E,     // (reserved)
    RES5:   0x000F      // (reserved)
};

Chip.OP_REGS = ["A","B","C","D","1","?","R5L","R5"];
