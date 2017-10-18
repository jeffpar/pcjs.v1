---
layout: page
title: "Q67439: MASM Instructions Operand Size Documented Wrong"
permalink: /pubs/pc/reference/microsoft/kb/Q67439/
---

## Q67439: MASM Instructions Operand Size Documented Wrong

	Article: Q67439
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 6-FEB-1991
	
	In the "Microsoft Macro Assembler 5.1 Reference" manual, a number of
	instructions indicate that their operand size is a mem64 when they
	should indicate an operand size of mem48. The instructions are
	documented incorrectly as LGDT, LIDT, LLDT, SGDT, SIDT, and SLDT.
	These instructions require the FWORD PTR operator and not the QWORD
	PTR operator. If the QWORD PTR operator is used, the Microsoft Macro
	Assembler (MASM) will generate the following warning:
	
	   warning A4057: illegal size for operand
	
	These instructions are privileged 286 and 386 instructions that are
	used to load and save the protected mode descriptor table registers.
	These registers are only 6 bytes long, even though descriptor table
	entries are normally 8 bytes.
