---
layout: page
title: "Q62180: Internal Compiler Error: @(#)main.c:1.176, Line 807"
permalink: /pubs/pc/reference/microsoft/kb/Q62180/
---

## Q62180: Internal Compiler Error: @(#)main.c:1.176, Line 807

	Article: Q62180
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 29-MAY-1990
	
	The following code generates an internal compiler error:
	
	1. void main (void)
	2. {
	3.    _asm
	4.    {
	5.       fscale
	6.    foo:
	7.       fprem
	8.    }
	9. }
	
	Although this code is not overly useful, this is the minimum required
	to reproduce the error. The following command-line options were used:
	
	   cl /Od /c /W4 foo.c
	
	The sample code produces the following output:
	
	Microsoft (R) C Optimizing Compiler Version 6.00
	Copyright (c) Microsoft Corp 1984-1990. All rights reserved.
	
	foo.c
	foo.c(9) : warning C4102: 'foo' : unreferenced label
	foo.c(6) : fatal error C1001: Internal Compiler Error
	           (compiler file '@(#)main.c:1.176', line 807)
	           Contact Microsoft Product Support Services
	
	As a workaround, the optimize pragma can be used to turn off all
	optimizations, as follows:
	
	 1. #pragma optimize ("", off)
	 2.
	 3. void main (void)
	 4. {
	 5.    _asm
	 6.    {
	 7.       fscale
	 8.    foo:
	 9.       fprem
	10.    }
	11. }
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
