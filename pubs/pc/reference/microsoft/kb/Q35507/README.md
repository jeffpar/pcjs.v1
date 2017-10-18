---
layout: page
title: "Q35507: Real-Number Encoding Needs Exact Number of Digits"
permalink: /pubs/pc/reference/microsoft/kb/Q35507/
---

## Q35507: Real-Number Encoding Needs Exact Number of Digits

	Article: Q35507
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S880913-6
	Last Modified: 12-JAN-1989
	
	In MASM, real numbers are initialized by using DD, DQ, and DT
	directives. The number of digits for encoded numbers declared with DD,
	DQ, and DT must be 8, 16, and 20 digits, respectively. If a leading 0
	is supplied, the number must be 9, 17, or 21 digits.
	
	For example, the following MASM line generates the assembler
	warning A4057: Illegal size for operand:
	
	_x     DQ   0000000000r
	
	The real number should be defined with exactly 17 digits.
	MASM will correctly evaluate the constant, but the warning
	is telling the user the number of digits used is not correct.
	Information concerning real-number constants can be found
	in the "Microsoft Macro Assembler 5.10 Programmer's Guide."
