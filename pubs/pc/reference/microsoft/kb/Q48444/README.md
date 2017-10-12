---
layout: page
title: "Q48444: The Interrupt Attribute Pushes Registers on the Stack"
permalink: /pubs/pc/reference/microsoft/kb/Q48444/
---

	Article: Q48444
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC  S_QuickASM
	Last Modified: 16-JAN-1990
	
	The interrupt attribute can be applied to a function to tell the
	compiler that the function is an interrupt handler.
	
	When an interrupt function is called, all registers (except SS) are
	saved on the stack. Examining the assembler code the compiler
	generates for an interrupt handler could cause confusion. When
	compiling without the /G1 or /G2 switch (these switches inform the
	compiler to generate 186 or 286 code accordingly) the assembler code
	appears as it should, however, when using one of the two
	aforementioned switches, the assembler output may be deceiving in that
	the registers appear as though they are not being saved on the stack
	as advertised.
	
	This potential misinterpretation results from the use of the PUSHA
	instruction, which does not exist in the 8086 instruction set, but
	does apply to the 80186 and more recent sets. The PUSHA instruction
	pushes the general purpose registers onto the stack in the following
	order: AX, CX, DX, BX, SP, BP, SI, DI.  For further information
	regarding the PUSHA instruction, you should consult an reference
	manual for Intel's 80x86-based assembly.
	
	The text that follows displays two partial assembler listings of an
	interrupt handler called foo. The second case demonstrates the usage
	of the 186, 286, 386 specific instruction PUSHA (for load all).
	
	/* Without G1 or G2 */
	
	_foo    PROC FAR
	        push    ax
	        push    cx
	        push    dx
	        push    bx
	        push    sp
	        push    bp
	        push    si
	        push    di
	        push    ds
	        push    es
	
	 /* With G1 or G2 */
	
	 _foo    PROC FAR
	        pusha              ; This pushes all general purpose registers
	        push    ds         ; for the 80186 processors and above.
	        push    es
