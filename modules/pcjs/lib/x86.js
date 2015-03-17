/**
 * @fileoverview Defines PCjs x86 constants.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Sep-05
 *
 * Copyright © 2012-2015 Jeff Parsons <Jeff@pcjs.org>
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
    MODEL_80386:    80386,

    /*
     * This constant is used to mark points in the code where the physical address being returned
     * is invalid and should not be used.  TODO: There are still functions that will use an invalid
     * address, which is why we've tried to choose a value that causes the least harm, but ultimately,
     * we must add checks to those functions or throw a special JavaScript exception to bypass them.
     *
     * This value is also used to indicate non-existent EA address calculations, which are usually
     * detected with "regEA === ADDR_INVALID" and "regEAWrite === ADDR_INVALID" tests.  In a 32-bit CPU,
     * -1 could actually be a valid address, so consider changing it to NaN or null; my concern is that,
     * by mixing non-numbers (specifically, values outside the range of 32-bit integers), performance
     * may suffer.
     */
    ADDR_INVALID:   -1,

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
        IOPL: {
         MASK:  0x3000,     // bits 12-13: I/O Privilege Level (always set on 8086/80186, clear on 80286 reset)
         SHIFT: 12
        },
        NT:     0x4000,     // bit 14: Nested Task flag (always set on 8086/80186, clear on 80286 reset)
        BIT15:  0x8000      // bit 15: reserved (always set on 8086/80186, clear otherwise)
    },
    CR0: {
        /*
         * Machine Status Word (MSW) bit definitions
         */
        MSW: {
            PE:     0x0001, // protected-mode enabled
            MP:     0x0002, // monitor processor extension (ie, coprocessor)
            EM:     0x0004, // emulate processor extension
            TS:     0x0008, // task switch indicator
            ON:     0xfff0, // on the 80286, these bits are always on (TODO: Verify)
            MASK:   0xffff  // these are the only (MSW) bits that the 80286 can access (within CR0)
        },
        ET: 0x00000010,     // coprocessor type (80287 or 80387); always 1 on post-80386 CPUs
        PG: 0x80000000|0    // 0: paging disabled
    },
    SEL: {
        RPL:    0x0003,     // requested privilege level (0-3)
        LDT:    0x0004,     // table indicator (0: GDT, 1: LDT)
        MASK:   0xfff8      // table index
    },
    DESC: {                 // Descriptor Table Entry
        LIMIT: {
            OFFSET:     0x0
        },
        BASE: {
            OFFSET:     0x2
        },
        ACC: {              // bit definitions for the access word (offset 0x4)
            OFFSET:     0x4,
            BASE1623:                       0x00ff,
            MASK:                           0xff00,
            TYPE: {
                MASK:                       0x1f00,
                SEG:                        0x1000,
                NONSEG:                     0x0f00,
                /*
                 * The following bits apply only when SEG is set
                 */
                CODE:                       0x0800,     // set for CODE, clear for DATA
                ACCESSED:                   0x0100,     // set if accessed, clear if not accessed
                READABLE:                   0x0200,     // CODE: set if readable, clear if exec-only
                WRITABLE:                   0x0200,     // DATA: set if writable, clear if read-only
                CONFORMING:                 0x0400,     // CODE: set if conforming, clear if not
                EXPDOWN:                    0x0400,     // DATA: set if expand-down, clear if not
                /*
                 * The following are all the possible (valid) types (well, except for the variations
                 * of DATA and CODE where the ACCESSED bit (0x0100) may also be set)
                 */
                TSS:                        0x0100,
                LDT:                        0x0200,
                TSS_BUSY:                   0x0300,
                GATE_CALL:                  0x0400,
                GATE_TASK:                  0x0500,
                GATE_INT:                   0x0600,
                GATE_TRAP:                  0x0700,
                DATA_READONLY:              0x1000,
                DATA_WRITABLE:              0x1200,
                DATA_EXPDOWN_READONLY:      0x1400,
                DATA_EXPDOWN_WRITABLE:      0x1600,
                CODE_EXECONLY:              0x1800,
                CODE_READABLE:              0x1a00,
                CODE_CONFORMING:            0x1c00,
                CODE_CONFORMING_READABLE:   0x1e00
            },
            DPL: {
                MASK:                       0x6000,
                SHIFT:                      13
            },
            PRESENT:                        0x8000,
            INVALID:    0   // use X86.DESC.ACC.INVALID for invalid ACC values
        },
        EXT: {              // descriptor extension word (reserved on the 80286; "must be zero")
            OFFSET:     0x6,
            LIMIT1619:                      0x000f,
            AVAIL:                          0x0010,     // NOTE: set in various descriptors in OS/2
            /*
             * The BIG bit is known as the D bit for code segments; when set, all addresses and operands
             * in that code segment are assumed to be 32-bit.
             *
             * The BIG bit is known as the B bit for data segments; when set, it indicates: 1) all pushes,
             * pops, calls and returns use ESP instead of SP, and 2) the upper bound of an expand-down segment
             * is 0xffffffff instead of 0xffff.
             */
            BIG:                            0x0040,     // clear if default operand/address size is 16-bit, set if 32-bit
            GRANULARITY:                    0x0080,     // clear if limit is bytes, set if limit is 4Kb pages
            BASE2431:                       0xff00
        },
        INVALID: 0          // use X86.DESC.INVALID for invalid DESC values
    },
    TSS: {
        PREV_TSS:   0x00,
        CPL0_SP:    0x02,   // start of values altered by task switches
        CPL0_SS:    0x04,
        CPL1_SP:    0x06,
        CPL1_SS:    0x08,
        CPL2_SP:    0x0a,
        CPL2_SS:    0x0c,
        TASK_IP:    0x0e,
        TASK_PS:    0x10,
        TASK_AX:    0x12,
        TASK_CX:    0x14,
        TASK_DX:    0x16,
        TASK_BX:    0x18,
        TASK_SP:    0x1a,
        TASK_BP:    0x1c,
        TASK_SI:    0x1e,
        TASK_DI:    0x20,
        TASK_ES:    0x22,
        TASK_CS:    0x24,
        TASK_SS:    0x26,
        TASK_DS:    0x28,   // end of values altered by task switches
        TASK_LDT:   0x2a
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
     * Implementation Detail: For any opcode we know must generate a UD_FAULT interrupt, we invoke opHelpInvalid(),
     * NOT opHelpUndefined().  UD_FAULT is for INVALID opcodes, Intel's choice of "UD" notwithstanding.
     *
     * We reserve the term "undefined" for opcodes that require more investigation, and we invoke opHelpUndefined()
     * ONLY until an opcode's behavior has finally been defined, at which point it becomes either valid or invalid.
     * The term "illegal" seems completely superfluous; we don't need a third way of describing invalid opcodes.
     *
     * The term "undocumented" should be limited to operations that are valid but Intel simply never documented.
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
        /*
         * Flags were originally computed based on the following internal result registers:
         *
         *      CF: resultZeroCarry & resultSize
         *      PF: resultParitySign & 0xff
         *      AF: (resultParitySign ^ resultAuxOverflow) & 0x0010
         *      ZF: resultZeroCarry & (resultSize - 1)
         *      SF: resultParitySign & (resultSize >> 1)
         *      OF: (resultParitySign ^ resultAuxOverflow ^ (resultParitySign >> 1)) & (resultSize >> 1)
         *
         * I386 builds now rely on the following new result registers:
         *
         *      resultDst, resultSrc, resultArith, resultLogic and resultType
         *
         * and flags are now computed as follows:
         *
         *      CF: ((resultDst ^ ((resultDst ^ resultSrc) & (resultSrc ^ resultArith))) & resultType)
         *      PF: (resultLogic & 0xff)
         *      AF: ((resultArith ^ (resultDst ^ resultSrc)) & 0x0010)
         *      ZF: (resultLogic & ((resultType - 1) | resultType))
         *      SF: (resultLogic & resultType)
         *      OF: (((resultDst ^ resultArith) & (resultSrc ^ resultArith)) & resultType)
         *
         * Arithmetic operations should call:
         *
         *      setArithResult(dst, src, value, type)
         * eg:
         *      setArithResult(dst, src, dst+src, X86.RESULT.BYTE | X86.RESULT.ALL)
         *
         * The 4th parameter, type, indicates both the size of the result (BYTE, WORD or DWORD) and which of
         * the flags should now be considered "cached" by the new result registers.  If the previous resultType
         * specifies any flags not contained in the new type parameter, then those flags must be immediately
         * calculated and written to the appropriate bit(s) in regPS.
         */
        BYTE:       0x80,
        WORD:       0x8000,
        DWORD:      0x80000000|0,
        TYPE:       0x80008080|0,
        CF:         0x01,
        PF:         0x02,
        AF:         0x04,
        ZF:         0x08,
        SF:         0x10,
        OF:         0x20,
        ALL:        0x3F,
        LOGIC:      0x1A,
        NOTCF:      0x3E
    },
    /*
     * Bit values for opFlags, which are all reset to zero prior to each instruction
     */
    OPFLAG: {
        NOREAD:     0x0001,
        NOWRITE:    0x0002,
        NOINTR:     0x0004,     // indicates a segreg has been set, or a prefix, or an STI (delay INTR acknowledgement)
        SEG:        0x0010,     // segment override
        LOCK:       0x0020,     // lock prefix
        REPZ:       0x0040,     // repeat while Z (NOTE: this value MUST match PS.ZF; see opCMPSb/opCMPSw/opSCASb/opSCASw)
        REPNZ:      0x0080,     // repeat while NZ
        REPEAT:     0x0100,     // indicates that an instruction is being repeated (ie, some iteration AFTER the first)
        PUSHSP:     0x0200,     // the SP register is potentially being referenced by a PUSH SP opcode, adjustment may be required
        DATASIZE:   0x1000,     // data size override
        ADDRSIZE:   0x2000      // address size override
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
     * Common opcodes (and/or any opcodes we need to refer to explicitly)
     */
    OPCODE: {
        ES:         0x26,       // opES()
        CS:         0x2E,       // opCS()
        SS:         0x36,       // opSS()
        DS:         0x3E,       // opDS()
        PUSHSP:     0x54,
        PUSHA:      0x60,       // 80186 and up
        POPA:       0x61,       // 80186 and up
        BOUND:      0x62,       // 80186 and up
        ARPL:       0x63,       // 80286 and up
        FS:         0x64,       // 80386 and up
        GS:         0x65,       // 80386 and up
        OS:         0x66,       // 80386 and up
        AS:         0x67,       // 80386 and up
        PUSH16:     0x68,       // 80186 and up
        IMUL16:     0x69,       // 80186 and up
        PUSH8:      0x6A,       // 80186 and up
        IMUL8:      0x6B,       // 80186 and up
        INSB:       0x6C,       // 80186 and up
        INSW:       0x6D,       // 80186 and up
        OUTSB:      0x6E,       // 80186 and up
        OUTSW:      0x6F,       // 80186 and up
        ENTER:      0xC8,       // 80186 and up
        LEAVE:      0xC9,       // 80186 and up
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
        UD2:        0x0B0F      // UD2 (invalid opcode "guaranteed" to generate UD_FAULT on all post-8086 processors)
    }
};

/*
 * BACKTRACK-related definitions (used only if BACKTRACK is defined)
 */
X86.BACKTRACK = {
    SP_LO:  0,
    SP_HI:  0
};

/*
 * Some PS flags are stored directly in regPS, hence the "direct" designation.
 */
X86.PS.DIRECT = (X86.PS.TF | X86.PS.IF | X86.PS.DF);

/*
 * However, PS arithmetic and logical flags may be "cached" across result registers.
 */
X86.PS.CACHED = (X86.PS.CF | X86.PS.PF | X86.PS.AF | X86.PS.ZF | X86.PS.SF | X86.PS.OF);

/*
 * These are the default "always set" PS bits for the 8086/8088; other processors must
 * adjust these bits accordingly.  The final adjusted value is then stored in the X86CPU
 * object as "this.PS_SET"; setPS() must use that value, NOT this one.
 *
 * TODO: Verify that PS.BIT1 was always set on reset, even on the 8086/8088.
 */
X86.PS.SET = (X86.PS.BIT1 | X86.PS.IOPL.MASK | X86.PS.NT | X86.PS.BIT15);

/*
 * PS.SAHF is a subset of the arithmetic flags, and refers only to those flags that the
 * SAHF and LAHF "8080 legacy" opcodes affect.
 */
X86.PS.SAHF = (X86.PS.CF | X86.PS.PF | X86.PS.AF | X86.PS.ZF | X86.PS.SF);

/*
 * Before we zero opFlags, we first see if any of the following PREFIX bits were set.  If any were set, they are OR'ed
 * into opPrefixes; otherwise, opPrefixes is zeroed as well.  This gives prefix-conscious instructions like LODS, MOVS,
 * STOS, CMPS, etc, a way of determining which prefixes, if any, immediately preceded them.
 */
X86.OPFLAG.PREFIXES = (X86.OPFLAG.SEG | X86.OPFLAG.LOCK | X86.OPFLAG.REPZ | X86.OPFLAG.REPNZ | X86.OPFLAG.DATASIZE | X86.OPFLAG.ADDRSIZE);

if (typeof module !== 'undefined') module.exports = X86;
