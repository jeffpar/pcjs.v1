---
layout: page
title: "Q60338: Cannot Set Breakpoint on an Executable Line with CodeView 3.00"
permalink: /pubs/pc/reference/microsoft/kb/Q60338/
---

## Q60338: Cannot Set Breakpoint on an Executable Line with CodeView 3.00

	Article: Q60338
	Version(s): 3.00   | 3.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 19-APR-1990
	
	If you cannot set a breakpoint on a particular line of code, make sure
	you have used the -Zi and -Od options to create executable code that
	has full CodeView debugging capabilities.
	
	Some code in the executable is concatenated if the -Od option is not
	used.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	int foo();
	
	void main (void)
	{
	   int a,b,c;
	
	   a = foo();/* this line would be concatenated into the next */
	   b = a + c;/* line to look like b=(a=foo())+c.              */
	}
	
	int foo()
	{
	   return(10);
	}
