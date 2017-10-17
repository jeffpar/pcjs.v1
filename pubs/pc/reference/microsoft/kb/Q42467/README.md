---
layout: page
title: "Q42467: If FRE(-2) Returns Small Negative Values, Increase Stack"
permalink: /pubs/pc/reference/microsoft/kb/Q42467/
---

## Q42467: If FRE(-2) Returns Small Negative Values, Increase Stack

	Article: Q42467
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890218-1 B_BasicCom
	Last Modified: 15-DEC-1989
	
	FRE(-2) returns negative values if bytes are added to the stack in
	small increments as the stack starts to run out of space. The negative
	number is an indication that stack space is extremely low. To increase
	stack space use
	
	   CLEAR ,,stacksize
	
	if using QuickBASIC 4.00, 4.00b, or 4.50 or Microsoft BASIC Compiler
	Version 6.00 or 6.00b.
	
	If using Microsoft BASIC PDS Version 7.00, you can use either the
	CLEAR statement or the STACK statement. For example, to set the stack
	size as the program is running use:
	
	   STACK stacksize
	
	where stacksize is the number of bytes that you want for the stack.
	The default stack size is in QuickBASIC 4.00, 4.00b, 4.50 and the
	BASIC compiler 6.00 and 6.00b is 2000 bytes. The default stacksize in
	BASIC PDS 7.00 is 3K under DOS or 3.5K under OS/2 protected mode.
	CLEAR also closes all files and releases file buffers, clears all
	COMMON variables, sets numeric variables and arrays to zero, sets
	string variables to null, and deallocates dynamic arrays. To save
	values in variables, use CLEAR to set the stack size in the beginning
	of the program. The STACK statement in BASIC PDS 7.00 resets the stack
	size without any of the side effects of the CLEAR statement. The stack
	space can also be set at link time with the /ST:stacksize option,
	where stacksize is the number of bytes in the stack.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
