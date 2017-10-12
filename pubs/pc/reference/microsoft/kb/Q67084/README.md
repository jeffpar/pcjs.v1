---
layout: page
title: "Q67084: Make Your Function Return Zero When Redefining _nullcheck()"
permalink: /pubs/pc/reference/microsoft/kb/Q67084/
---

	Article: Q67084
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr S_QUICKC
	Last Modified: 18-DEC-1990
	
	By default, Microsoft C checks the NULL segment before the final
	termination of a program in order to determine if a null pointer
	assignment has occurred. This check can be suppressed by defining your
	own function called _nullcheck(), which is the name of the library
	routine that is normally linked in to do the checking.
	
	The online help for C versions 6.00 and 6.00a and QuickC versions 2.50
	and 2.51 describes how to replace this function, but there is an error
	in the help files. The help states that you just need to declare your
	own routine "named _nullcheck that does nothing". This is not
	completely true. You actually need to make your function return a
	value of zero; otherwise, the program exit code will be set to 255.
	
	The following is a valid way to define the _nullcheck() function in
	your program:
	
	    int _cdecl _nullcheck( void)
	    {
	        return (0);
	    }
