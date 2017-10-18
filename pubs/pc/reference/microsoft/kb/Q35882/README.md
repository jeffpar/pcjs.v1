---
layout: page
title: "Q35882: Warning A5114: Operand Size Does Not Match Segment Word Size"
permalink: /pubs/pc/reference/microsoft/kb/Q35882/
---

## Q35882: Warning A5114: Operand Size Does Not Match Segment Word Size

	Article: Q35882
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The MASM warning A5114: "Operand size does not match segment word
	size" occurs when using 32-bit operands in USE16 segments. The warning
	is only generated on push and pop instructions using an operand with
	the size other than the size of the segment. For example, using dword
	push in a USE16 segment or using a word push in a USE32 segment. The
	warning is not generated for any other use of 32-bit operands.
	
	The warning message may have been added to aid the programmer trying
	to convert code from 16-bit segments to 32-bit segments. The warning
	message should only occur in 32-bit segments when 16-bit push/pop
	operands are given, and not in the converse situation.
	
	Microsoft is researching the subject and will post more information
	when available.
