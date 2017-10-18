---
layout: page
title: "Q61054: Erroneous 8086 Opcode for Logical AND Instruction"
permalink: /pubs/pc/reference/microsoft/kb/Q61054/
---

## Q61054: Erroneous 8086 Opcode for Logical AND Instruction

	Article: Q61054
	Version(s): m5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 12-JUN-1990
	
	Problem:
	
	I bought an operating system for a V25 processor that runs with the
	INTEL 8086 instruction set. The operating system source code was
	assembled with MASM 5.10 and the .8086 directive. The instruction runs
	on an 8086 machine, but the machine with the V25 processor hangs at
	the following instruction:
	
	      AND Word Ptr [S+10], -5 ; Opcode generated is
	                              ; 83 64 0A FB
	
	Response:
	
	In Appendix A-4 of the INTEL 8086/8088 programmer's reference manual
	(1986 edition), there is no opcode for AND that begins with 83. There
	is an opcode for AND that begins with 81. The opcode for AND reads as
	follows:
	
	   81 64 0A 00 FB
	
	However, there is an opcode for a sign-extended immediate instruction
	in the 80386 instruction set that has the first byte of the opcode as
	83.
	
	The V25 adheres strictly to INTEL's 8086 standard and will not accept
	an 80386 instruction rather than an 8086 instruction.
	
	Microsoft has confirmed this to be a problem in MASM Version 5.10. We
	are researching this problem and will post new information here as it
	becomes available.
