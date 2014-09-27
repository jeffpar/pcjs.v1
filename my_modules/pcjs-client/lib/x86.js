/**
 * @fileoverview Defines PCjs x86 constants.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2012-Sep-05
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of PCjs, which is part of the JavaScript Machines Project (aka JSMachines)
 * at <http://jsmachines.net/> and <http://pcjs.org/>.
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
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

var X86 = {
    /*
     * CPU model numbers
     */
	MODEL_8086:     8086,
	MODEL_8088:     8088,
	MODEL_80186:    80186,
	MODEL_80188:    80188,
	MODEL_80286:    80286,
    /*
     * Processor Status flag definitions (stored in regPS)
     */
	PS: {
        CF:     0x0001,     // bit 0: Carry flag
        BIT1:   0x0002,     // bit 1: reserved, always set
        PF:     0x0004,     // bit 2: Parity flag
        BIT3:   0x0008,     // bit 3: reserved, always clear
        AF:     0x0010,     // bit 4: Auxiliary Carry flag (aka Arithmetic flag)
        BIT5:   0x0020,     // bit 5: reserved, always clear
        ZF:     0x0040,     // bit 6: Zero flag
        SF:     0x0080,     // bit 7: Sign flag
        TF:     0x0100,     // bit 8: Trap flag
        IF:     0x0200,     // bit 9: Interrupt flag
        DF:     0x0400,     // bit 10: Direction flag
        OF:     0x0800,     // bit 11: Overflow flag
        IOPL:   0x3000,     //  12-13: I/O Privilege Level, always set on 8086/80186, clear on 80286
        NT:     0x4000,     // bit 14: Nested Task flag, always set on 8086/80186, clear on 80286
        BIT15:  0x8000      // bit 15: reserved, always set on 8086/80186, clear otherwise
    },
    /*
     * Machine Status Word definitions (stored in regMSW)
     */
    MSW: {
        PE:     0x0001,     // protected-mode enabled
        MP:     0x0002,     // monitor processor extension (ie, coprocessor)
        EM:     0x0004,     // emulate processor extension
        TS:     0x0008,     // task switch indicator
        SET:    0xfff0      // on the 80286, these are always set (TODO: Verify)
    },
    SEL: {
        LEVEL:  0x0003,     // selector privilege level (0-3)
        LDT:    0x0004,     // table indicator (0: GDT, 1: LDT)
        MASK:   0xfff8      // table index
    },
    DESC: {                 // Descriptor Table Entry
        LIMIT: {
            OFFSET:   0x0
        },
        BASE: {
            OFFSET:   0x2
        },
        ACC: {              // bit definitions for the access word (offset 0x4)
            OFFSET:   0x4,
            BASE1623: 0x00ff,
            MASK:     0xff00,
            TYPE: {
                MASK:       0x1f00,
                SEG:        0x1000,
                /*
                 * The rest of these apply only when SEG is set
                 */
                ACCESSED:   0x0100,
                READABLE:   0x0200, // CODE: set if readable, clear if execute-only
                WRITEABLE:  0x0200, // DATA: set if writable, clear if read-only
                CONFORMING: 0x0400, // CODE: set if conforming, clear if not
                EXPDOWN:    0x0400, // DATA: set if expand-down, clear if not
                CODE:       0x0800, // set for CODE, clear for DATA
                CODE_READABLE:            0x0A00, // both CODE and READABLE
                CODE_CONFORMING:          0x0C00, // both CODE and CONFORMING
                CODE_CONFORMING_READABLE: 0x0E00, // all of CODE and CONFORMING and READABLE
                /*
                 * The rest of these apply only when SEG is clear
                 */
                TSS:        0x0100,
                LDT:        0x0200,
                TSS_LDT:    0x0300,
                TSS_BUSY:   0x0300,
                GATE_CALL:  0x0400,
                GATE_TASK:  0x0500,
                GATE_INT:   0x0600,
                GATE_TRAP:  0x0700
            },
            LEVEL: {
                MASK:  0x6000,
                SHIFT: 13
            },
            PRESENT:  0x8000
        }
    },
    /*
     * Processor Exception Interrupts
     * 
     * Of the following exceptions, all are designed to be restartable, except for 0x08 and 0x09 (and 0x0D
     * after an attempt to write to a read-only segment).
     * 
     * Error codes are pushed onto the stack for 0x08 (always 0) and 0x0A through 0x0D.
     * 
     * Priority: Instruction exception, TRAP, NMI, Processor Extension Segment Overrun, and finally INTR.
     * 
     * All exceptions can also occur in real-mode, except where noted.  A GP_FAULT in real-mode can be triggered
     * by "any memory reference instruction that attempts to reference [a] 16-bit word at offset 0FFFFH".
     *
     * Interrupts beyond 0x10 (up through 0x1F) are reserved for future exceptions.
     * 
     * Implementation Detail: For any opcode we know must generate a UD_FAULT interrupt, we invoke opInvalid().
     * We reserve the term "undefined" for opcodes that require further investigation, and we invoke opUndefined()
     * in those cases until an opcode's behavior has been defined; at that point, it's either valid or invalid.
     * 
     * As for "illegal", that's a silly (and redundant) term in this context, so we don't use it.  Similarly,
     * the term "undocumented" should be limited to operations that are valid but that Intel did not document.
     */
    EXCEPTION: {
        DIV_ERR:    0x00,       // Divide Error Interrupt
        TRAP:       0x01,       // Single Step (aka Trap) Interrupt
        NMI:        0x02,       // Non-Maskable Interrupt
        BREAKPOINT: 0x03,       // Breakpoint Interrupt
        OVERFLOW:   0x04,       // INTO Overflow Interrupt (FYI, return address does NOT point to offending instruction)
        BOUND_ERR:  0x05,       // BOUND Error Interrupt
        UD_FAULT:   0x06,       // Invalid (aka Undefined or Illegal) Opcode (see implementation detail above)
        NM_FAULT:   0x07,       // No Math Unit Available (see ESC or WAIT)
        DF_FAULT:   0x08,       // Double Fault (see LIDT)
        MP_FAULT:   0x09,       // Math Unit Protection Fault (see ESC)
        TS_FAULT:   0x0A,       // Invalid Task State Segment Fault (protected-mode only)
        NP_FAULT:   0x0B,       // Not Present Fault (protected-mode only)
        SS_FAULT:   0x0C,       // Stack Fault (protected-mode only)
        GP_FAULT:   0x0D,       // General Protection Fault
        MF_FAULT:   0x10        // Math Fault (see ESC or WAIT)
    },
    ERRCODE: {
        EXT:        0x0001,
        IDT:        0x0002,
        LDT:        0x0004,
        MASK:       0xfff8      // index of corresponding entry in GDT, LDT or IDT
    },
    RESULT: {
        SIZE_BYTE:  0x00100,    // mask for byte arithmetic instructions (after subtracting 1)
        SIZE_WORD:  0x10000,    // mask for word arithmetic instructions (after subtracting 1)
        AUXOVF_AF:  0x00010,
        AUXOVF_OF:  0x08080,
        AUXOVF_CF:  0x10100
    },
    PARITY:  [                  // 256-byte array with a 1 wherever the number of set bits of the array index is EVEN
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1
    ],
    /*
     * Bit values for opFlags, which are all reset to zero prior to each instruction
     */
	OPFLAG: {
        NOREAD:     0x0001,
        NOWRITE:    0x0002,
        NOINTR:     0x0004,     // indicates a segreg has been set, or a prefix, or an STI (delay INTR acknowledgement)
        SEG:        0x0010,
        LOCK:       0x0020,
        REPZ:       0x0040,     // repeat while Z (NOTE: this value MUST match PS_ZF; see opCMPSb/opCMPSw/opSCASb/opSCASw)
        REPNZ:      0x0080,     // repeat while NZ
        REPEAT:     0x0100,     // this indicates that an instruction is being repeated (ie, some iteration AFTER the first)
        PUSHSP:     0x0200      // the SP register is potentially being referenced by a PUSH SP opcode, adjustment may be required
    },
    /*
     * Bit values for intFlags
     */
    INTFLAG: {
        NONE:       0x00,
        INTR:       0x01,       // h/w interrupt requested
        TRAP:       0x02,       // trap (INT 0x01) requested
        HALT:       0x04,       // halt (HLT) requested
        DMA:        0x08        // async DMA operation in progress
    },
    /*
     * Common opcodes
     */
    OPCODE: {
        ES:         0x26,       // opES()
		CS:         0x2E,       // opCS()
		SS:         0x36,       // opSS()
		DS:         0x3E,       // opDS()
        PUSHSP:     0x54,
        PUSHA:      0x60,
        POPA:       0x61,
        BOUND:      0x62,
        ARPL:       0x63,
        PUSH16:     0x68,
        IMUL16:     0x69,
        PUSH8:      0x6A,
        IMUL8:      0x6B,
        INSB:       0x6C,
        INSW:       0x6D,
        OUTSB:      0x6E,
        OUTSW:      0x6F,
        ENTER:      0xC8,
        LEAVE:      0xC9,
		CALLF:      0x9A,       // opCALLf()
		MOVSB:      0xA4,       // opMOVSb()
		MOVSW:      0xA5,       // opMOVSw()
		CMPSB:      0xA6,
		CMPSW:      0xA7,
		STOSB:      0xAA,
		STOSW:      0xAB,
		LODSB:      0xAC,
		LODSW:      0xAD,
		SCASB:      0xAE,
		SCASW:      0xAF,
		INT3:       0xCC,
		INTn:       0xCD,
		INTO:       0xCE,
        LOOPNZ:     0xE0,
        LOOPZ:      0xE1,
        LOOP:       0xE2,
		CALL:       0xE8,
        JMP:        0xE9,       // JMP opcode (2-byte displacement)
        JMPS:       0xEB,       // JMP opcode (1-byte displacement)
		LOCK:       0xF0,
		REPNZ:      0xF2,
		REPZ:       0xF3,
		CALLW:      0x10FF,
		CALLDW:     0x18FF,
        UD2:        0x0B0F      // UD2 (invalid opcode guaranteed to generate UD_FAULT on all post-8086 processors)
    }
};

/*
 * Some PS flags are stored directly in regPS, hence the "direct" designation.
 */
X86.PS.DIRECT =     (X86.PS.TF | X86.PS.IF | X86.PS.DF);

/*
 * However, PS "arithmetic" flags are NOT stored in regPS; they are maintained across
 * separate result registers, hence the "indirect" designation.
 */
X86.PS.INDIRECT =   (X86.PS.CF | X86.PS.PF | X86.PS.AF | X86.PS.ZF | X86.PS.SF | X86.PS.OF);

/*
 * NOTE: This is the default for 8086/8088; other processors must tweak these bits before
 * calling setPS().  TODO: Verify that PS_1 was always set on reset, even on the 8086/8088.
 */
X86.PS.SET =        (X86.PS.BIT1 | X86.PS.IOPL | X86.PS.NT | X86.PS.BIT15);

/*
 * getPS() brings all the direct and indirect flags together, and setPS() performs the
 * reverse, setting all the corresponding "result registers" to match the indirect flags.
 * 
 * These "result registers" are created/reset by an initial call to setPS(0); they include:
 * 
 *      this.resultSize (must be set to one of: SIZE_BYTE or SIZE_WORD)
 *      this.resultValue
 *      this.resultParitySign
 *      this.resultAuxOverflow
 *
 * PS_SAHF is a subset of the arithmetic flags, and refers only to those flags that the
 * SAHF and LAHF "8080 legacy" opcodes affect.
 */
X86.PS.SAHF =       (X86.PS.CF | X86.PS.PF | X86.PS.AF | X86.PS.ZF | X86.PS.SF);

/*
 * Before we zero opFlags, we first see if any of the following PREFIX bits were set.  If any were set, they are OR'ed
 * into opPrefixes; otherwise, opPrefixes is zeroed as well.  This gives prefix-conscious instructions like LODS, MOVS,
 * STOS, CMPS, etc, a way of determining which prefixes, if any, immediately preceded them.
 */
X86.OPFLAG.PREFIXES = (X86.OPFLAG.SEG | X86.OPFLAG.LOCK | X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ);

if (typeof module !== 'undefined') module.exports = X86;
