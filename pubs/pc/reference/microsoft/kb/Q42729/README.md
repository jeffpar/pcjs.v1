---
layout: page
title: "Q42729: Direct Memory Addressing"
permalink: /pubs/pc/reference/microsoft/kb/Q42729/
---

## Q42729: Direct Memory Addressing

	Article: Q42729
	Version(s): 4.x 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 24-APR-1989
	
	Question:
	
	When I try to do a direct memory operation with the instruction MOV
	AX,[1000], the Macro Assembler generates a move instruction with the
	immediate value of 1000 rather than a direct memory access of the
	location 1000. How can I do a direct memory access instruction?
	
	Response:
	
	A segment register must be specified for a direct memory operand that
	contains a constant with no label, as in the following
	
	   MOV AX,DS:[1000]
	
	This example will not insert a segment override prefix into the
	assemble code because the instruction uses the DS register by default.
	Use of any segment register other than the default register would
	insert the override prefix.
	
	For more information, see Section 14.3.1 on Direct Memory Operands,
	Page 276 in the MASM 5.10 programmer's guide.
