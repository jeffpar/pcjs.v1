Exceptions from Undefined Opcodes and String Instructions
---

The exception 13 handler will probably use a lookup table for the opcode byte of the instruction causing exception
13 to determine the correct action for this instruction. In general, any undefined opcode causes exception 6 and
would therefore not invoke exception 13. However, some implementations may emulate some instructions. The following
explains the empty entries in the opcode map to aid in determining an emulation strategy.

The following is a list of exclusions from the general rule of undefined 80286 opcodes causing exception 6.

 * The [LOADALL](../loadall/) instruction (opcode 0F04H) will cause exception 13 in protected mode if executed when
 CPL is not 0. [LOADALL](../loadall/) may be executed at any time in real address mode.
 
 * The 0F05H opcode will cause exception 13 in protected mode if executed when CPL is not 0. If 0F05H is executed
 in real address mode, or in protected mode when CPL=O, the 80286 stops normal execution. RESET must be used to
 restart the CPU in this case. The 0F05H opcode may be executed at any time in real address mode.
 
 * The opcode 82H is an alias for opcode 80H.
 
 * The 0D0H/0D1H opcode with a REG field = 6 is an alias for the SHL instruction (REG = 7).
 
 * The opcode 0D6H is a proprietary single byte instruction. No restrictions apply to its execution.
 It can be emulated as a NOP.

 * The 0F1H opcode is a prefix which performs no function. It counts like any other prefix towards the maximum
 instruction length. No restrictions apply to its execution.
   
 * The 0F6H/0F7H opcode with a REG field = 1 is an alias for the TEST instruction (REG=0).

Restarting string instructions which caused exception 12 (if SS override was used) or exception 13 requires updating
SI, DI, and CX (if repeat was used). Which registers are updated depends on the instruction and when the exception was
detected. The following rules apply:

 * For STOS, the DI register must always be updated by the exception handler to restart tne instruction.
 The state of the DF bit in the flag word and the operand size determines whether to use +2, +1, -1, or -2 to
 update DI. If a repeated STOS was used, add 2 to CX to restart the instruction.
 
 * For INS, the DI register must always be updated by the exception handler to restart the instruction. The state
 of the DF bit in the flag word and the operand size determines whether to use +2, +1, -1, or -2 to update DI.
 If a repeated INS was used, increment CX to restart the instruction. If exception 13 was not caused by an invalid
 IOPL during the first I/O read, then increment CX again if INS was repeated.
    
 * For SCAS, the SI register must always be updated by the exception handler to restart the instruction.
 The state of the DF bit in the flag word and the operand size determines whether to use +2, +1, -1, or -2 to
 update SI. If SCAS was repeated, add 2 to CX to restart it.
 
 * For OUTS, the SI register must always be updated by the exception handler to restart the instruction. The state
 of the DF bit in the flag word and the operand size determines whether to use +2, +1, -1, or -2 to update SI.
 If OUTS was repeated, add 2 to CX to restart it. Note that exception 13 may have been caused by an insufficient IOPL.
    
 * For MOVS, the SI register must always be updated by the exception handler to restart the instruction. The state
 of the DF bit in the flag word and the operand size determines whether to use +2, +1, -1, or -2 to update SI.
 The DI register must also be updated if the source operand (i.e. DS:SI or seg:SI if a segment override prefix was
 used) did not cause the exception. After updating SI, look at the source operand address to see if exception 13
 would occur. If not, then DI must also be updated the same as SI. Always increment CX to restart MOVS if it was
 repeated. IF DI was updated and a repeat prefix was used, then CX must be incremented again for correct instruction
 restart.
    
 * For CMPS, the DI register must always be updated by the exception handler to restart the instruction. The state
 of the DF bit in the flag word and the operand size determines whether to use +2, +1, -1, or -2 to update DI.
 The SI register must also be updated if the ES:DI operand did not cause the exception. After updating DI, look at
 ES:DI to see if exception 13 would occur. If not, then SI must also be updated the same as DI. Increment CX if
 CMPS was repeated to restart it. IF SI was updated and a repeat prefix was used, then CX must be incremented for
 correct instruction restart.

Early 80286 Errata of Interest
---

Early versions of the 80286 have several errata items which may effect the implementation of software to emulate an
8086/8088 on a protected mode 80286 or expansion of the address space in real mode. These errata are in the A1 and B1
steppings of the 80286 and are fixed in later steppings of the 80286.

 * If the ES register has a null selector or ES:DI exceeds the segment limit when executing either the non-repeated
 MOVS or INS instructions, the saved CS:IP value seen by the exception 13 handler will point after the MOVS or
 INS instruction. The saved CS:IP value in later steppings will point at the failed instruction (including prefixes).

 * If the segment register used for the destination operand in either the POP to memory, FSTSW/FNSTSW, or
 FSTCW/FNSTCW instructions has a null selector in it or the segment limit is violated, the saved CS:IP value
 seen by the exception 13 (or 12 if SS override was used) handler will point after the POP/FSTSW/FNSTSW/FSTCW/FNSTCW
 instruction. The saved CS:IP value in later steppings will point at the failed instruction (including prefixes).

 * If the stack limit is violated by a PUSH from memory instruction, the saved CS:IP value seen by the exception 12
 handler will point after the PUSH instruction. The saved CS:IP value in later steppings will point at the failed
 PUSH instruction (including prefixes).

 * If a segment limit violation or IOPL violation occurs in the repeated MOVS, INS, OUTS, CMPS, SCAS, or STOS
 instructions, the value of CX seen by the exception 12 or 13 handler will be the value used at the start of the
 instruction. The SI and DI register values will reflect the iterations used by the instruction. Later steppings
 of the 80286 will assure the saved value of the CX register reflects the number of iterations performed.
    
 * The [LOADALL](../loadall/) instruction may incorrectly enter protected mode. This only affects systems that use [LOADALL](../loadall/) while
 in real mode and want to remain in real mode. Two possible workarounds are possible: execute [LOADALL](../loadall/) using
 0-wait memory for the data values or be sure bit 0 of memory location 804H is zero. HOLD requests and processor
 extension data transfers should be inhibited while [LOADALL](../loadall/) is running. Later steppings of the 80286 will correctly
 load the MSW during [LOADALL](../loadall/) with HOLD and processor extension transfers.

[This information is from an undated 15-page Intel document titled "Undocumented iAPX 286 Test Instruction"]