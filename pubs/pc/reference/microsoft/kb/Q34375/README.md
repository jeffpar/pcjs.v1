---
layout: page
title: "Q34375: Documentation Error on the LGDT Instruction"
permalink: /pubs/pc/reference/microsoft/kb/Q34375/
---

## Q34375: Documentation Error on the LGDT Instruction

	Article: Q34375
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-JAN-1989
	
	The "Microsoft Macro Assembler 5.10 Reference Guide" states that
	the LGDT instruction only takes a memory 64 operand while the Intel
	manual states the LGDT instruction takes a memory 48 operand.
	   The MASM Reference is incorrect. The correct operand size is memory
	48. These instructions load essentially a 2-field structure whose
	total size is 48 bits. The first two bytes are the limit field and the
	last four bytes are the base field. This can be defined using the DF
	directive, or by defining a structure as described.
