---
layout: page
title: "Q49707: Shifting (SHL) Using an 8-Bit Constant"
permalink: /pubs/pc/reference/microsoft/kb/Q49707/
---

## Q49707: Shifting (SHL) Using an 8-Bit Constant

	Article: Q49707
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 29-MAR-1990
	
	Problem:
	
	Page 96 of the "Microsoft Macro Assembler for MS OS/2 and MS-DOS
	Operating Systems: Version 5.1 Update" says that I can use the
	shift-left instruction (SHL) with an 8-bit constant. Yet, when I
	assemble my source code, I get the following error:
	
	   A2052: Improper operand type
	
	Response:
	
	The third paragraph on Page 96 states the following:
	
	   On the 8088 and 8086, the source operand can be either CL or 1. On
	   the 80186-80386 processors, the source operand can be CL or an
	   8-bit constant.
	
	To use the 8-bit constant, you must specify that you are writing 186,
	286, or 386 code. The assembler assumes the worst and defaults to the
	8088 options and doesn't accept the 8-bit constant.
	
	The following code generates the error:
	
	.model small
	.code
	shl bl,2
	end
	
	To correct the problem, use the .186, .286, or .386 directive such as
	the following:
	
	.model small
	.286
	.code
	shl bl,2
	end
