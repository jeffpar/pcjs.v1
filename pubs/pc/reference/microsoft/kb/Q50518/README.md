---
layout: page
title: "Q50518: BX Register Is Popped Twice for a C Interrupt Function"
permalink: /pubs/pc/reference/microsoft/kb/Q50518/
---

	Article: Q50518
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC S_QuickAsm 2.00 2.01
	Last Modified: 21-MAR-1990
	
	The interrupt keyword is used to designate specific C functions as
	interrupt service routines and instructs the compiler to generate
	appropriate entry and exit instructions.
	
	If you compile code with the /G1 or /G2 options (80186 or 80286 code
	generation) then the compiler produces pusha and popa instructions
	that save and restore all vital registers.
	
	However, if you compile with the default /G0 (8086 code generation)
	then the registers are each explicitly pushed and popped. One
	difference in this code, which may at first appear to be a bug, is
	that the BX register is popped twice, but the SP register is not
	popped at all.
	
	This is not a problem. The SP register is saved in the following
	instruction sequence:
	
	   mov     bp, sp
	   .
	   .       ISR code
	   .
	   mov     sp, bp
	
	The peculiar double popping of BX can be explained by the following:
	
	   The registers are pushed AX, CX, DX, BX, SP, BP, SI, DI, DS, ES
	   (left to right)
	
	   The registers are popped AX, CX, DX, BX, BX, BP, SI, DI, DS, ES
	   (right to left)
	
	Notice that ES receives the old ES; DS the old DS, but BX receives the
	old SP, then BX receives the old BX.
	
	The first pop of SP to BX is necessary to remove the previous value of
	SP from the stack. The second pop of BX is necessary to restore the
	old BX value.
	
	The old value of SP was restored in the "MOV  SP,BP" instruction,
	which immediately proceeds the popping of all the registers.
	
	This ensures that the state of the registers are saved and then
	restored in the Interrupt Service Routine.
