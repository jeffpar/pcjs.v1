/**
 * @fileoverview Simulates the instructions of a TMS-1500 chip
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
 * @property {Chip} chip
 * @property {Array.<number>} digits
 */
class Reg64 extends Device {
    /**
     * Reg64(chip, id)
     *
     * @this {Reg64}
     * @param {Chip} chip
     * @param {string} [id]
     */
    constructor(chip, id)
    {
        super(chip.idMachine, id);
        this.chip = chip;
        this.name = id;
        /*
         * Each Reg64 register contains 16 BCD/Hex digits, which we store as 16 independent 4-bit numbers,
         * where [0] is D0, aka DIGIT 0, and [15] is D15, aka DIGIT 15.
         */
        this.digits = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    /**
     * init(value, range)
     *
     * @this {Reg64}
     * @param {number} value
     * @param {Array.<number>} range
     * @returns {Reg64}
     */
    init(value, range = [0,15])
    {
        for (let i = 0; i < this.digits.length; i++) {
            this.digits[i] = 0;
        }
        for (let i = range[0], j = range[1]; i <= j; i++) {
            this.digits[i] = value & 0xf;
            value >>>= 4;
        }
        return this;
    }

    /**
     * toString()
     *
     * @this {Reg64}
     * @returns {string}
     */
    toString()
    {
        let s = this.idDevice + '=';
        if (s.length < 3) s += ' ';
        for (let i = this.digits.length - 1; i >= 0; i--) {
            s += Device.HexLowerCase[this.digits[i]];
            if (!(i % 4)) s += ' ';
        }
        return s;
    }

    /**
     * add(reg, regSrc, range, base)
     *
     * @this {Reg64}
     * @param {Reg64} reg
     * @param {Reg64} regSrc
     * @param {Array.<number>} range
     * @param {number} base
     */
    add(reg, regSrc, range, base)
    {
        let carry = 0;
        for (let i = range[0], j = range[1]; i <= j; i++) {
            this.digits[i] = reg.digits[i] + regSrc.digits[i] + carry;
            carry = 0;
            if (this.digits[i] >= base) {
                this.digits[i] -= base;
                carry = 1;
            }
        }
        if (carry) this.chip.fCOND = true;
        this.updateR5(range);
    }

    /**
     * move(regSrc, range)
     *
     * @this {Reg64}
     * @param {Reg64} regSrc
     * @param {Array.<number>} range
     */
    move(regSrc, range)
    {
        for (let i = range[0], j = range[1]; i <= j; i++) {
            this.digits[i] = regSrc.digits[i];
        }
        regSrc.updateR5(range);
    }

    /**
     * shl(reg, range)
     *
     * @this {Reg64}
     * @param {Reg64} reg
     * @param {Array.<number>} range
     */
    shl(reg, range)
    {
        let i, j;
        for (i = range[1], j = range[0]; i > j; i--) {
            this.digits[i] = reg.digits[i-1];
        }
        this.digits[i] = 0;
        this.updateR5(range);
    }

    /**
     * shr(reg, range)
     *
     * @this {Reg64}
     * @param {Reg64} reg
     * @param {Array.<number>} range
     */
    shr(reg, range)
    {
        let i, j;
        for (i = range[0], j = range[1]; i < j; i++) {
            this.digits[i] = reg.digits[i+1];
        }
        this.digits[i] = 0;
        this.updateR5(range);
    }

    /**
     * store(reg)
     *
     * STORE is similar to MOVE, but all digits are stored (ie, no mask is involved), and R5 is not affected.
     *
     * @this {Reg64}
     * @param {Reg64} reg
     */
    store(reg)
    {
        for (let i = 0, j = this.digits.length; i < j; i++) {
            this.digits[i] = reg.digits[i];
        }
    }

    /**
     * sub(reg, regSrc, range, base)
     *
     * @this {Reg64}
     * @param {Reg64} reg
     * @param {Reg64} regSrc
     * @param {Array.<number>} range
     * @param {number} base
     */
    sub(reg, regSrc, range, base)
    {
        let carry = 0;
        for (let i = range[0], j = range[1]; i <= j; i++) {
            this.digits[i] = reg.digits[i] - regSrc.digits[i] - carry;
            carry = 0;
            if (this.digits[i] < 0) {
                this.digits[i] += base;
                carry = 1;
            }
        }
        if (carry) this.chip.fCOND = true;
        this.updateR5(range);
    }

    /**
     * xchg(regSrc, range)
     *
     * @this {Reg64}
     * @param {Reg64} regSrc
     * @param {Array.<number>} range
     */
    xchg(regSrc, range)
    {
        for (let i = range[0], j = range[1]; i <= j; i++) {
            let d = this.digits[i];
            this.digits[i] = regSrc.digits[i];
            regSrc.digits[i] = d;
        }
        regSrc.updateR5(range);
    }

    /**
     * updateR5(range)
     *
     * @this {Reg64}
     */
    updateR5(range)
    {
        this.chip.regR5 = this.digits[range[0]];
        this.assert(!(this.chip.regR5 & ~0xf));
        if (range[1] > range[0]) {
            this.chip.regR5 |= this.digits[range[1]] << 4;
            this.assert(!(this.chip.regR5 & ~0xff));
        }
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
 * @property {Array.<Reg64>} regs (operational registers A-D)
 * @property {Array.<Reg64>} regsX (storage registers X0-X7)
 * @property {Array.<Reg64>} regsY (storage registers Y0-Y7)
 * @property {Reg64} regSupp (alternate register used when the destination must be suppressed)
 * @property {Reg64} regTemp (temporary register used to supply constants or other internal values)
 * @property {number} base (10 or 16)
 * @property {boolean} fCOND (true when a carry has been detected)
 * @property {number} regRAB
 * @property {number} regR5
 * @property {number} regOut
 * @property {number} regPC (program counter: address of next instruction to decode)
 * @property {Array.<number>} stack (3-level address stack; managed by push() and pop())
 * @property {number} regKey (current key status, propagated to regR5 at appropriate intervals)
 * @property {number} addrBreak
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
         * Four (4) Operational Registers (A-D)
         */
        this.regsABCD = new Array(4);
        for (let i = 0; i < 4; i++) {
            this.regsABCD[i] = new Reg64(this, String.fromCharCode(0x41+i));
        }

        /*
         * Aliases for each of the Operational Registers, since some instructions use hard-coded registers,
         * rather than calculating a register index (0-3).
         */
        this.regA = this.regsABCD[0];
        this.regB = this.regsABCD[1];
        this.regC = this.regsABCD[2];
        this.regD = this.regsABCD[3];

        /*
         * Eight (8) Storage Registers (X0-X7)
         */
        this.regsX = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.regsX[i] = new Reg64(this, "X" + i);
        }

        /*
         * Eight (8) Storage Registers (Y0-Y7)
         */
        this.regsY = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.regsY[i] = new Reg64(this, "Y" + i);
        }

        this.regSupp = new Reg64(this, "Supp");
        this.regTemp = new Reg64(this, "Temp");

        this.base = 10;
        this.fCOND = false;

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
         * However, this is only necessary if we decide to simulate the internal operation of the Display Decoder
         * and Keyboard Scanner.
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
         * However, this is only necessary if we decide to simulate the internal operation of the Display Decoder
         * and Keyboard Scanner.
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
         * However, this is only necessary if we decide to simulate the internal operation of the Display Decoder
         * and Keyboard Scanner.
         *
         * Refer to patent Fig. 11b (p. 27)
         */
        this.regSegKbdScan = 0xff;

        /*
         * The "State Time Generator" is represented by a 5-bit register that contains values 00000b through 11111b
         * for each of the 32 state times that occur during a single instruction cycle.  And since each "state time"
         * consists of four clock pulses, designated Φ1, P1, Φ2, and P2, we keep track of which pulse we're on, too.
         *
         * However, these are only necessary if we decide to simulate the internal operation of the Display Decoder
         * and Keyboard Scanner.
         *
         * Refer to patent Fig. 11f (p. 31)
         */
        this.regStateTime = 0;
        this.regPulseTime = 0;

        /*
         * This internal cycle count is initialized on every clocker() invocation, enabling opcode functions
         * that need to consume a few extra cycles to bump this count upward as needed.
         */
        this.nCyclesClocked = 0;

        /*
         * The "Program Counter" (regPC) is an 11-bit register that automatically increments unless a HOLD signal
         * is applied, effectively locking execution on a single instruction.
         */
        this.regPC = 0;

        /*
         * The "Subroutine Stack".  "When an unconditional branch instruction is decoded by branch logic 32b, the
         * CALL signal goes to zero permitting the present ROM address plus one to be loaded into subroutine stack
         * register 33a....  Addresses previously loaded into subroutine stack/registers 33a and 33b are shifted
         * to registers 33b and 33c."
         *
         * We initialize it with "guard values" (-1) to help detect the presence of invalid data, and to catch stack
         * overflow/underflow errors.
         *
         * Refer to patent Fig. 7a (p. 9)
         */
        this.stack = [-1, -1, -1];

        /*
         * Get access to the Input device, so we can add our clicker function.
         */
        this.regKey = 0;
        this.input = /** @type {Input} */ (this.findDeviceByClass(Machine.CLASS.INPUT));
        this.input.addClicker(this.setKey.bind(this));

        /*
         * Get access to the LED device, so we can draw symbols.
         */
        this.led = /** @type {LED} */ (this.findDeviceByClass(Machine.CLASS.LED));

        /*
         * Get access to the ROM device.
         */
        this.rom = /** @type {ROM} */ (this.findDeviceByClass(Machine.CLASS.ROM));

        /*
         * Get access to the Time device, so we can give it our clocker() function.
         */
        this.time = /** @type {Time} */ (this.findDeviceByClass(Machine.CLASS.TIME));
        this.time.addClocker(this.clocker.bind(this));

        this.addrBreak = -1;
        this.addHandler(Device.HANDLER.COMMAND, this.onCommand.bind(this));
    }

    /**
     * clocker(nCyclesTarget)
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
     * We're currently simulating a full 32 "state times" (128 cycles aka Chip.OP_CYCLES) per operation, since
     * we don't perform discrete simulation of the Display Decoder/Keyboard Scanner circuitry.  See opDISP() for
     * an example of an operation that imposes additional cycle overhead.
     *
     * @this {Chip}
     * @param {number} nCyclesTarget (0 to single-step, -1 to display status only)
     * @returns {number} (number of cycles actually "clocked")
     */
    clocker(nCyclesTarget = 0)
    {
        this.nCyclesClocked = 0;
        do {
            if (this.addrBreak == this.regPC) {
                this.addrBreak = -1;
                this.println("break");
                this.time.stop();
                nCyclesTarget = 0;      // this is simply to trigger toString() below
                break;
            }
            let opCode = this.rom.getData(this.regPC);
            let addr = this.regPC;
            this.regPC = (addr + 1) & this.rom.addrMask;
            if (!this.decode(opCode, addr)) {
                this.regPC = addr;
                this.time.stop();
                this.println("unimplemented opcode");
                nCyclesTarget = 0;      // this is simply to trigger toString() below
                break;
            }
            this.nCyclesClocked += Chip.OP_CYCLES;
        } while (this.nCyclesClocked < nCyclesTarget);
        if (nCyclesTarget <= 0) {
            this.println(this.toString());
        }
        return this.nCyclesClocked;
    }

    /**
     * decode(opCode, addr)
     *
     * Most operations are performed inline, since this isn't a super complex instruction set, but
     * a few are separated into their own handlers (eg, opDISP).
     *
     * @this {Chip}
     * @param {number} opCode (opcode)
     * @param {number} addr (of the opcode)
     * @returns {boolean} (true if opcode successfully decoded, false if unrecognized or unsupported)
     */
    decode(opCode, addr)
    {
        if (opCode & 0x1000) {
            if (opCode & 0x0800) {  // BRC/BRNC
                if (!!(opCode & 0x0400) == this.fCOND) {
                    /*
                     * TODO: Determine whether to use bit 10 from the original PC (addr) or the incremented PC (regPC)
                     */
                    this.regPC = (addr & 0x0400) | (opCode & 0x03FF);
                }
            } else {                // CALL
                this.push(this.regPC);
                this.regPC = opCode & 0x07FF;
            }
            this.fCOND = false;
            return true;
        }

        let range, regSrc, regResult, iOp, base;
        let j, k, l, n, d, b, mask = opCode & Chip.IW_MF.MASK;

        switch(mask) {
        case Chip.IW_MF.MMSD:   // 0x0000: Mantissa Most Significant Digit (D12)
        case Chip.IW_MF.ALL:    // 0x0100: (D0-D15)
        case Chip.IW_MF.MANT:   // 0x0200: Mantissa (D2-D12)
        case Chip.IW_MF.MAEX:   // 0x0300: Mantissa and Exponent (D0-D12)
        case Chip.IW_MF.LLSD:   // 0x0400: Mantissa Least Significant Digit (D2)
        case Chip.IW_MF.EXP:    // 0x0500: Exponent (D0-D1)
        case Chip.IW_MF.FMAEX:  // 0x0700: Flag and Mantissa and Exponent (D0-D13)
        case Chip.IW_MF.D14:    // 0x0800: (D14)
        case Chip.IW_MF.FLAG:   // 0x0900: (D13-D15)
        case Chip.IW_MF.DIGIT:  // 0x0a00: (D14-D15)
        case Chip.IW_MF.D13:    // 0x0d00: (D13)
        case Chip.IW_MF.D15:    // 0x0f00: (D15)
            range = Chip.RANGE[mask];
            this.assert(range);

            j = (opCode & Chip.IW_MF.J_MASK) >> Chip.IW_MF.J_SHIFT;
            k = (opCode & Chip.IW_MF.K_MASK) >> Chip.IW_MF.K_SHIFT;
            l = (opCode & Chip.IW_MF.L_MASK) >> Chip.IW_MF.L_SHIFT;
            n = (opCode & Chip.IW_MF.N_MASK);
            iOp = (n? Chip.OP.SUB : Chip.OP.ADD);

            switch(k) {
            case 0:
            case 1:
            case 2:
            case 3:
                regSrc = this.regsABCD[k];
                break;
            case 4:
                regSrc = this.regTemp.init(1, range);
                break;
            case 5:
                iOp = (n? Chip.OP.SHR : Chip.OP.SHL);
                break;
            case 6:
                regSrc = this.regTemp.init(this.regR5 & 0xf, range);
                break;
            case 7:
                regSrc = this.regTemp.init(this.regR5 & 0xff, range);
                break;
            }

            switch(l) {
            case 0:
                regResult = this.regsABCD[j];
                break;
            case 1:
                regResult = (k < 4? this.regsABCD[k] : undefined);
                break;
            case 2:
                regResult = (k < 5? this.regSupp : (k == 5? this.regsABCD[j] : undefined));
                break;
            case 3:
                if (!n) {
                    this.assert(!j && k < 4);
                    this.regA.xchg(regSrc, range);
                } else {
                    this.assert(k != 5);
                    this.regsABCD[j].move(regSrc, range);
                }
                return true;
            }

            if (!regResult) break;

            base = (opCode >= Chip.IW_MF.D14? 16 : this.base);

            switch(iOp) {
            case Chip.OP.ADD:
                regResult.add(this.regsABCD[j], regSrc, range, base);
                break;
            case Chip.OP.SUB:
                regResult.sub(this.regsABCD[j], regSrc, range, base);
                break;
            case Chip.OP.SHL:
                regResult.shl(this.regsABCD[j], range);
                break;
            case Chip.OP.SHR:
                regResult.shr(this.regsABCD[j], range);
                break;
            }
            return true;

        case Chip.IW_MF.FF:     // 0x0c00: (used for flag operations)
            j = (opCode & Chip.IW_FF.J_MASK) >> Chip.IW_FF.J_SHIFT;
            d = (opCode & Chip.IW_FF.D_MASK) >> Chip.IW_FF.D_SHIFT;
            b = 1 << ((opCode & Chip.IW_FF.B_MASK) >> Chip.IW_FF.B_SHIFT);
            if (!d) break;
            d += 12;
            /*
             * For the following bit operations (SET, RESET, TEST, and TOGGLE, displayed by disassemble()
             * as "SET", "CLR", "TST", and "NOT") are rather trivial, so I didn't bother adding Reg64 methods
             * for them (eg, setBit, resetBit, testBit, toggleBit).
             */
            switch(opCode & Chip.IW_FF.MASK) {
            case Chip.IW_FF.SET:
                this.regsABCD[j].digits[d] |= b;
                break;
            case Chip.IW_FF.RESET:
                this.regsABCD[j].digits[d] &= ~b;
                break;
            case Chip.IW_FF.TEST:
                if (this.regsABCD[j].digits[d] & b) this.fCOND = true;
                break;
            case Chip.IW_FF.TOGGLE:
                this.regsABCD[j].digits[d] ^= b;
                break;
            }
            return true;

        case Chip.IW_MF.PF:     // 0x0e00: (used for misc operations)
            switch(opCode & Chip.IW_PF.MASK) {
            case Chip.IW_PF.STYA:       // 0x0000: Contents of storage register Y defined by RAB loaded into operational register A (Yn -> A)
                this.regA.store(this.regsY[this.regRAB]);
                break;
            case Chip.IW_PF.RABI:       // 0x0001: Bits 4-6 of instruction are stored in RAB
                this.regRAB = (opCode >> 4) & 0x7;
                break;
            case Chip.IW_PF.BRR5:       // 0x0002: Branch to R5
                /*
                 * TODO: Determine whether this type of BRANCH should set fCOND to false like other branches do
                 */
                this.regPC = this.regR5;
                break;
            case Chip.IW_PF.RET:        // 0x0003: Return
                this.fCOND = false;
                this.regPC = this.pop();
                break;
            case Chip.IW_PF.STAX:       // 0x0004: Contents of operational register A loaded into storage register X defined by RAB (A -> Xn)
                this.regsX[this.regRAB].store(this.regA);
                break;
            case Chip.IW_PF.STXA:       // 0x0005: Contents of storage register X defined by RAB loaded into operational register A (Xn -> A)
                this.regA.store(this.regsX[this.regRAB]);
                break;
            case Chip.IW_PF.STAY:       // 0x0006: Contents of operational register A loaded into storage register Y defined by RAB (A -> Yn)
                this.regsY[this.regRAB].store(this.regA);
                break;
            case Chip.IW_PF.DISP:       // 0x0007: registers A and B are output to the Display Decoder and the Keyboard is scanned
                return this.opDISP();
            case Chip.IW_PF.BCDS:       // 0x0008: BCD set: enables BCD corrector in arithmetic unit
                this.base = 10;
                break;
            case Chip.IW_PF.BCDR:       // 0x0009: BCD reset: disables BCD corrector in arithmetic unit (which then functions as hexadecimal)
                this.base = 16;
                break;
            case Chip.IW_PF.RABR5:      // 0x000A: LSD of R5 (3 bits) is stored in RAB
                this.regRAB = this.regR5 & 0x7;
                break;
            default:
                return false;
            }
            return true;

        case Chip.IW_MF.RES1:   // 0x0600: (reserved)
        case Chip.IW_MF.RES2:   // 0x0b00: (reserved)
        default:
            break;
        }
        return false;
    }

    /**
     * disassemble(opCode, addr)
     *
     * Returns a string representation of the selected instruction.
     *
     * The TI-57 patents suggest mnemonics for some of the instructions, but not all, so I've taken
     * some liberties in the interests of clarity and familiarity.  Special-purpose instructions like
     * "BCDS" and "BCDR" are displayed as-is, but for more general-purpose instructions, I've adopted
     * the following format:
     *
     *      operation   destination,input(s)[,mask]
     *
     * Instructions that the patent refers to as "STYA", "STAY", "STXA", and "STAX" are all displayed
     * as "STORE" instructions; eg, instead of "STAX", I use:
     *
     *      STORE       X[RAB],A
     *
     * Instructions that use masks are displayed as either "LOAD", "MOVE", or "XCHG".  If the result
     * of the operation is suppressed, the destination will be displayed as "NUL" instead of a register.
     * And if the inputs are being added, subtracted, shifted left, or shifted right, they will be
     * displayed with "+", "-", "<", or ">", respectively.  Finally, the 16-digit mask is displayed,
     * as a series of hex digits rather than the unmemorable names used in the patents (eg, MMSD, FMAEX,
     * etc).  I do use the patent nomenclature internally, just not for display purposes.
     *
     * @this {Chip}
     * @param {number} opCode
     * @param {number} addr
     * @returns {string}
     */
    disassemble(opCode, addr)
    {
        let sOp = "???", sOperands = "";

        if (opCode & 0x1000) {
            let v;
            if (opCode & 0x0800) {
                sOp = "BR";
                if (opCode & 0x0400) {
                    sOp += "C";
                } else {
                    sOp += "NC";
                }
                v = (addr & 0x0400) | (opCode & 0x03FF);
            } else {
                sOp = "CALL";
                v = opCode & 0x07FF;
            }
            sOperands = this.sprintf("0x%04x", v);
        }
        else {
            let mask = opCode & Chip.IW_MF.MASK;

            switch(mask) {
            case Chip.IW_MF.MMSD:   // 0x0000: Mantissa Most Significant Digit (D12)
            case Chip.IW_MF.ALL:    // 0x0100: (D0-D15)
            case Chip.IW_MF.MANT:   // 0x0200: Mantissa (D2-D12)
            case Chip.IW_MF.MAEX:   // 0x0300: Mantissa and Exponent (D0-D12)
            case Chip.IW_MF.LLSD:   // 0x0400: Mantissa Least Significant Digit (D2)
            case Chip.IW_MF.EXP:    // 0x0500: Exponent (D0-D1)
            case Chip.IW_MF.FMAEX:  // 0x0700: Flag and Mantissa and Exponent (D0-D13)
            case Chip.IW_MF.D14:    // 0x0800: (D14)
            case Chip.IW_MF.FLAG:   // 0x0900: (D13-D15)
            case Chip.IW_MF.DIGIT:  // 0x0a00: (D14-D15)
            case Chip.IW_MF.D13:    // 0x0d00: (D13)
            case Chip.IW_MF.D15:    // 0x0f00: (D15)
                let sMask = this.toStringMask(mask);
                let j = (opCode & Chip.IW_MF.J_MASK) >> Chip.IW_MF.J_SHIFT;
                let k = (opCode & Chip.IW_MF.K_MASK) >> Chip.IW_MF.K_SHIFT;
                let l = (opCode & Chip.IW_MF.L_MASK) >> Chip.IW_MF.L_SHIFT;
                let n = (opCode & Chip.IW_MF.N_MASK);

                sOp = "LOAD";
                let sOperator = "";
                let sDst = "?", sSrc = "?";

                if (!n) {
                    sOperator = (k == 5? "<" : "+");
                } else {
                    sOperator = (k == 5? ">" : "-");
                }

                switch(l) {
                case 0:
                    sDst = Chip.OP_INPUTS[j];
                    break;
                case 1:
                    if (k < 4) sDst = Chip.OP_INPUTS[k];
                    break;
                case 2:
                    if (k < 6) sDst = "NUL";    // "suppressed" operation
                    break;
                case 3:
                    if (!n) {
                        sOp = "XCHG";
                        if (!j) sDst = "A";     // j != 0 or k >= 4 is invalid
                        if (k < 4) sSrc = Chip.OP_INPUTS[k];
                    } else {
                        sOp = "MOVE";
                        sDst = Chip.OP_INPUTS[j];
                        sSrc = Chip.OP_INPUTS[k]; // k == 5 is invalid
                    }
                    k = -1;
                    break;
                }

                switch(k) {
                case 0:
                case 1:
                case 2:
                case 3:
                    sSrc = Chip.OP_INPUTS[j] + sOperator + Chip.OP_INPUTS[k];
                    break;
                case 4:
                case 5:
                    sSrc = Chip.OP_INPUTS[j] + sOperator + "1";
                    break;
                case 6:
                    sSrc = Chip.OP_INPUTS[j] + sOperator + "R5L";
                    break;
                case 7:
                    sSrc = Chip.OP_INPUTS[j] + sOperator + "R5";
                    break;
                }
                sOperands = sDst + "," + sSrc + "," + sMask;
                break;

            case Chip.IW_MF.FF:     // 0x0c00: (used for flag operations)
                switch(opCode & Chip.IW_FF.MASK) {
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
                sOperands = this.regsABCD[(opCode & Chip.IW_FF.J_MASK) >> Chip.IW_FF.J_SHIFT].name;
                let d = ((opCode & Chip.IW_FF.D_MASK) >> Chip.IW_FF.D_SHIFT);
                sOperands += '[' + (d? (d + 12) : '?') + ']';
                sOperands += ':' + ((opCode & Chip.IW_FF.B_MASK) >> Chip.IW_FF.B_SHIFT);
                break;

            case Chip.IW_MF.PF:     // 0x0e00: (used for misc operations)
                let sStore = "STORE";
                switch(opCode & Chip.IW_PF.MASK) {
                case Chip.IW_PF.STYA:   // 0x0000: Contents of storage register Y defined by RAB loaded into operational register A (Yn -> A)
                    sOp = sStore;
                    sOperands = "A,Y[RAB]";
                    break;
                case Chip.IW_PF.RABI:   // 0x0001: Bits 4-6 of instruction are stored in RAB
                    sOp = sStore;
                    sOperands = "RAB," + ((opCode & 0x70) >> 4);
                    break;
                case Chip.IW_PF.BRR5:   // 0x0002: Branch to R5
                    sOp = "BR";
                    sOperands = "R5";
                    break;
                case Chip.IW_PF.RET:    // 0x0003: Return
                    sOp = "RET";
                    break;
                case Chip.IW_PF.STAX:   // 0x0004: Contents of operational register A loaded into storage register X defined by RAB (A -> Xn)
                    sOp = sStore;
                    sOperands = "X[RAB],A";
                    break;
                case Chip.IW_PF.STXA:   // 0x0005: Contents of storage register X defined by RAB loaded into operational register A (Xn -> A)
                    sOp = sStore;
                    sOperands = "A,X[RAB]";
                    break;
                case Chip.IW_PF.STAY:   // 0x0006: Contents of operational register A loaded into storage register Y defined by RAB (A -> Yn)
                    sOp = sStore;
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
                    sOp = sStore;
                    sOperands = "RAB,R5L";
                    break;
                default:
                    break;
                }
                break;

            case Chip.IW_MF.RES1:   // 0x0600: (reserved)
            case Chip.IW_MF.RES2:   // 0x0b00: (reserved)
            default:
                break;
            }
        }
        return this.sprintf("0x%04x: 0x%04x  %-8s%s\n", addr, opCode, sOp, sOperands);
    }

    /**
     * onCommand(sCommand)
     *
     * @this {Chip}
     * @param {string} sCommand
     * @returns {boolean} (true if processed, false if not)
     */
    onCommand(sCommand)
    {
        let sResult = "";
        let aCommands = sCommand.split(' ');
        let s = aCommands[0];
        let addr = Number.parseInt(aCommands[1], 16) || -1;
        let nLines = Number.parseInt(aCommands[2], 10) || 8;
        switch(s[0]) {
        case "g":
            if (this.time.start()) {
                this.addrBreak = addr;
            } else {
                sResult = "already started";
            }
            break;
        case "h":
            if (!this.time.stop()) sResult = "already stopped";
            break;
        case "t":
            if (!this.time.step()) sResult = "already running";
            break;
        case "r":
            sResult += this.toString(s[1]);
            break;
        case "u":
            addr = (addr >= 0? addr : this.regPC);
            while (nLines--) {
                let opCode = this.rom.getData(addr);
                if (opCode == undefined) break;
                sResult += this.disassemble(opCode, addr++);
            }
            break;
        case "?":
            sResult = "available commands:";
            Chip.COMMANDS.forEach(cmd => {sResult += '\n' + cmd;});
            break;
        default:
            if (sResult) {
                sResult = "unrecognized command: " + sCommand + " (try help)";
            }
            break;
        }
        if (sResult) this.println(sResult.trim());
        return true;
    }

    /**
     * opDISP()
     *
     * Handles the DISP opcode.  The following details/tables are from the TI patents:
     *
     *      Register A and Register B are outputted to the display decoder and the keyboard is scanned.
     *      A closed keyboard switch loads K5 and sets condition latch.
     *
     *      Display decoder receives a data representing numerals to be displayed from operational register A.
     *
     *      Display decoder is also responsive to the data from operational register B, which indicates where
     *      the decimal point is to be displayed among the numerals, whether minus signs are to be provided,
     *      and which digits are to be blanked, according to the codes listed in Table III.
     *
     *      TABLE II
     *
     *          Register R5
     *          --------------------------------
     *             7   6   5   4   3   2   1   0
     *           KR8 KR7 KR6 KR5 KR4 KR3 KR2 KR1
     *
     *            K             KS (Keyboard Line Actuated)
     *          -------------------------------------------
     *           001            K1
     *           010            K2
     *           011            K3
     *           100            K4
     *           101            K5
     *
     *            K             KS (Segment Scan Line Actuated)
     *          -----------------------------------------------
     *           000            KS0     (SEG E)
     *           001            KS1     (SEG F)
     *           010            KS2     (SEG B)
     *           011            KS3     (SEG G)
     *           100            KS4     (SEG C)
     *           101            KS5     (SEG A)
     *           110            KS6     (SEG D/D12)
     *
     *      TABLE III
     *
     *          Register B
     *          Digit Control Code  Function
     *          ------------------  -----------------------------------------------------
     *              1XXX            Display digit is blanked in the corresponding digit position
     *              0XX1            Turns on minus sign (Segment G) in corresponding digit position
     *              XX1X            Turns on decimal point and digit specified by register A in corresponding digit position
     *              0XX0            Turns on digit specified by Register A in corresponding digit position
     *
     * @this {Chip}
     * @returns {boolean} (true to indicate the opcode was successfully decoded)
     */
    opDISP()
    {
        let s = "";
        for (let i = 11; i >= 0; i--) {
            if (this.regB.digits[i] & 0x8) {
                s += ' ';
            } else if (this.regB.digits[i] & 0x1) {
                s += '-';
            } else {
                s += Device.HexUpperCase[this.regA.digits[i]];
            }
            if (this.regB.digits[i] & 0x2) {
                s += '.';
            }
        }
        if (this.regA.digits[14] == 0x0E) {
            s = 'E' + s;
        }
        if (this.regKey) {
            this.regR5 = this.regKey;
            this.fCOND = 1;
        }
        this.led.drawString(s);

        // if (DEBUG) this.printf("display: \"%s\"  key: 0x%02x\n", s, this.regKey);
        // this.time.stop();

        /*
         * The DISP operation slows the clock by a factor of 4; to simulate that additional overhead, we simply
         * bump nCyclesClocked by three more OP_CYCLES, in addition to the OP_CYCLES that clocker() already incurs.
         */
        this.nCyclesClocked += Chip.OP_CYCLES * 3;
        return true;
    }

    /**
     * pop()
     *
     * @this {Chip}
     * @returns {number}
     */
    pop()
    {
        let addr = this.stack.shift();      // remove the first element
        this.stack.push(-1);                // and append a new "guard value" at the end
        this.assert(addr >= 0, "stack underflow");
        return addr;
    }

    /**
     * push(addr)
     *
     * @this {Chip}
     * @param {number} addr
     */
    push(addr)
    {
        this.stack.unshift(addr);           // insert a new first element
        addr = this.stack.pop();            // and remove the element falling off the end
        this.assert(addr < 0, "stack overflow");
    }

    /**
     * setKey(col, row)
     *
     * Converts a logical (col,row), where the top left keyboard position is (0,0), into an 8-bit physical
     * location value, where bits 0-3 are the row (0-based) and bits 4-7 are the col (1-based).  Moreover,
     * if either col or row is negative, then all bits are cleared.
     *
     * @this {Chip}
     * @param {number} col
     * @param {number} row
     */
    setKey(col, row)
    {
        let b = 0;
        if (col >= 0 && row >= 0) {
            this.assert(col < 5 && row < 8);
            b = row | ((col + 1) << 4);
        }
        this.regKey = b;
    }

    /**
     * status()
     *
     * @this {Chip}
     */
    status()
    {
        this.println(this.toString());
    }

    /**
     * toString(options, regs)
     *
     * @this {Chip}
     * @param {string} [options]
     * @param {Array.<Reg64>} [regs]
     * @returns {string}
     */
    toString(options = "", regs = null)
    {
        let s = "";
        if (regs) {
            for (let i = 0, n = regs.length >> 1; i < n; i++) {
                s += regs[i].toString() + '  ' + regs[i+n].toString() + '\n';
            }
            return s;
        }
        s += this.toString(options, this.regsABCD);
        if (options.indexOf('a') >= 0) {
            s += this.toString(options, this.regsX);
            s += this.toString(options, this.regsY);
        }
        s += "COND=" + (this.fCOND? 1 : 0) + " BASE=" + this.base + " R5=" + this.sprintf("0x%02x", this.regR5) + " RAB=" + this.regRAB + ' ';
        this.stack.forEach((addr, i) => {s += this.sprintf("ST%d=0x%04x ", i, addr & 0xffff);});
        s += '\n' + this.disassemble(this.rom.getData(this.regPC), this.regPC);
        return s.trim();
    }

    /**
     * toStringMask(mask)
     *
     * @this {Chip}
     * @param {number} mask
     * @returns {string}
     */
    toStringMask(mask)
    {
        let s = "";
        let range = Chip.RANGE[mask];
        for (let i = 0; i < 16; i++) {
            if (!(i % 4)) s = ' ' + s;
            s = (range? (i >= range[0] && i <= range[1]? 'F' : '0') : '?') + s;
        }
        return s;
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

Chip.IW_FF = {          // Instruction Word Flag Field (used when the Mask Field is FF)
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

Chip.IW_PF = {          // Instruction Word Misc Field (used when the Mask Field is PF)
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

Chip.RANGE = {
    [Chip.IW_MF.MMSD]:  [12,12],        // 0x0000: Mantissa Most Significant Digit (D12)
    [Chip.IW_MF.ALL]:   [0,15],         // 0x0100: (D0-D15)
    [Chip.IW_MF.MANT]:  [2,12],         // 0x0200: Mantissa (D2-D12)
    [Chip.IW_MF.MAEX]:  [0,12],         // 0x0300: Mantissa and Exponent (D0-D12)
    [Chip.IW_MF.LLSD]:  [2,2],          // 0x0400: Mantissa Least Significant Digit (D2)
    [Chip.IW_MF.EXP]:   [0,1],          // 0x0500: Exponent (D0-D1)
    [Chip.IW_MF.FMAEX]: [0,13],         // 0x0700: Flag and Mantissa and Exponent (D0-D13)
    [Chip.IW_MF.D14]:   [14,14],        // 0x0800: (D14)
    [Chip.IW_MF.FLAG]:  [13,15],        // 0x0900: (D13-D15)
    [Chip.IW_MF.DIGIT]: [14,15],        // 0x0a00: (D14-D15)
    [Chip.IW_MF.D13]:   [13,13],        // 0x0d00: (D13)
    [Chip.IW_MF.D15]:   [15,15],        // 0x0f00: (D15)
};

Chip.OP_CYCLES = 128;                   // default number of cycles per operation

/*
 * Table of operations used by the disassembler for "masked" operations
 */
Chip.OP = {
    ADD:    0,
    SUB:    1,
    SHL:    2,
    SHR:    3,
    XCHG:   4,
    MOVE:   5
};

/*
 * Table of operational inputs used by the disassembler for "masked" operations
 */
Chip.OP_INPUTS = ["A","B","C","D","1","?","R5L","R5"];

Chip.COMMANDS = [
    "g [addr]\trun (to addr)",
    "h\t\thalt",
    "r[a]\t\tdump registers",
    "t\t\tstep",
    "u [addr] [n]\tdisassemble (at addr)"
];
