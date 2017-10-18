---
layout: page
title: "Q38936: "
permalink: /pubs/pc/reference/microsoft/kb/Q38936/
---

## Q38936: 

	Article: Q38936
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-JAN-1989
	
	The code fragment in section 7.1.3 on Page 147 of the "Microsoft Macro
	Assembler Programmer's Guide" causes a warning A4031: "Operand types
	must match." There is an error in the example.
	
	Change the line below
	
	   mov ax, [bx].month
	
	to the following:
	
	   mov ah, [bx].month
	
	Because the structure field month is defined as a byte, the assignment
	to a word register generates the operand-mismatch warning message. The
	change to a byte register resolves the warning. The following is also
	acceptable:
	
	   mov ax, word ptr [bx].month
