---
layout: page
title: "Q40192: Error A2105 with PUSHA and POPA Instructions"
permalink: /pubs/pc/reference/microsoft/kb/Q40192/
---

## Q40192: Error A2105 with PUSHA and POPA Instructions

	Article: Q40192
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	MASM generates the following error message if the PUSHA or POPA
	instructions are used without a prior .186, .286, or .386 directive:
	
	   A2105: Expected: instruction, directive, or label
	
	This error does not clearly indicate exactly what the problem is. By
	default, the Macro Assembler generates code for the 8086 processor,
	for which these instructions have not been implemented.
	
	Page 302 of the "Macro Assembler 5.1 Programmer's Guide" states that
	these instructions are implemented only for the 80186, 80286, and
	80386 processors.
	
	If you have an 8086-based computer, you will have to push and pop the
	registers individually, using PUSH and POP. If you have a 80186,
	80286, or 80386-based computer, add the appropriate directive to the
	code.
