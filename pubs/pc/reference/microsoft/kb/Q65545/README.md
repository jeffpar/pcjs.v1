---
layout: page
title: "Q65545: C1001: Internal Compiler Error: @(#)exphelp.c:1.115, Line 698"
permalink: /pubs/pc/reference/microsoft/kb/Q65545/
---

## Q65545: C1001: Internal Compiler Error: @(#)exphelp.c:1.115, Line 698

	Article: Q65545
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-SEP-1990
	
	When compiled with default optimizations in the huge memory model, the
	code below produces the error message:
	
	   test.c(10) : fatal error C1001: Internal Compiler Error
	                (compiler file '@(#)exphelp.c:1.115', line 698)
	                Contact Microsoft Product Support Services
	
	When compiled in the large memory model, the same code produces the
	following error message:
	
	   test.c(10) : fatal error C1001: Internal Compiler Error
	                (compiler file '@(#)emit.c:1.115', line 437)
	                Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	void main(void)
	{
	        char *foo, *bar;
	        int baz;
	
	        foo = (bar - ((char *) 0) + baz) & ~ baz;
	}
	
	Microsoft has confirmed this to be a problem with the C compiler
	version 6.00. We are researching this problem and will post new
	information here as it becomes available.
