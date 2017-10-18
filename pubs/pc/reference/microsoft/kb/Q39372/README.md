---
layout: page
title: "Q39372: MOV mem,accum and MOV accum,mem Formats Incorrectly Documented"
permalink: /pubs/pc/reference/microsoft/kb/Q39372/
---

## Q39372: MOV mem,accum and MOV accum,mem Formats Incorrectly Documented

	Article: Q39372
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	There is a documentation error on Page 77 of the "Microsoft Macro
	Assembler 5.1 Reference" manual (spiral-bound book). In the
	next-to-bottom big box, the MOV mem,accum and MOV accum,mem formats of
	the MOV instruction are incorrectly documented. The manual describes
	the binary format of these instructions as 101000dw, where a value of
	1 for d means to move from memory to AX and 0 for d means to move from
	AX to memory (as described on Page 27 of the same manual).
	
	This is reversed, as shown on Page 3-118 of "Intel's iAPX 86/88,
	186/188 User's Manual (Programmer's Reference)" and as assembled
	properly by MASM.
	
	Note: The Intel manual shows the bit patterns for these two types of
	the instruction separately. The memory to AX form has bit 1 (the d bit
	in our documentation) set to 0; the AX to memory form has bit 1 set to
	1.
