---
layout: page
title: "Q43166: C: How Stack Checking Is Done"
permalink: /pubs/pc/reference/microsoft/kb/Q43166/
---

## Q43166: C: How Stack Checking Is Done

	Article: Q43166
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 22-MAY-1989
	
	Microsoft C does stack checking to check for stack overflow. The stack
	for an application program grows from high memory to low memory. The
	lowest memory location to which the stack can grow is determined in
	Microsoft C as follows:
	
	&end + STACKSLOP      /* in assembly: OFFSET _end + STACKSLOP */
	
	The _end symbol is created by Microsoft LINK which assigns it the
	address of the lowest memory location of the STACK segment.
	
	STACKSLOP is a manifest constant. For DOS, STACKSLOP = 256 (decimal);
	for OS/2, STACKSLOP = 512 (decimal).
	
	At runtime, the function _chkstk is called, on entry to each function,
	to check the stack. If the current value of the SP register minus the
	total size of the local variables is less than the sum of &end plus
	STACKLOP, _chkstk prints the following error message and terminates
	the program:
	
	R6000   stack overflow
	
	Otherwise, _chkstk will update the value of SP according to the total
	size of the local variables.
	
	The source code for the function _chkstk is included in the startup
	source code in the Microsoft C Optimizing Compiler Version 5.10.
	
	The value of the SP register is not updated if the stack overflow
	condition is detected.
	
	Stack checking can be manually disabled with either the compile line
	option /Gs, or with the pragma; #pragma check_stack(off). In that
	case, SP will be updated even if a stack overflow occurs.
	
	For more information on _end, query on _edata.
