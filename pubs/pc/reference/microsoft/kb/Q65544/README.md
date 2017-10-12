---
layout: page
title: "Q65544: C1001: Internal Compiler Error: @(#)grammar.c:1.138, Line 164"
permalink: /pubs/pc/reference/microsoft/kb/Q65544/
---

	Article: Q65544
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-SEP-1990
	
	The code below produces the following internal compiler error when
	compiled with loop optimization (/Ol) enabled:
	
	   test.c(10) : fatal error C1001: Internal Compiler Error
	                (compiler file '@(#)grammar.c:1.138', line 164)
	                Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	void main(void)
	{
	        double x;
	        int j;
	
	        for(j = 0; j < 1; j++) {
	                x = j > 0 ? 0.0 : 0.5;
	                x = j >> 2 & 1 > 0 ? 0.0 : 0.5;
	        }
	}
	
	To work around this problem, compile without loop optimization
	enabled, or use the #pragma optimize directive to turn off loop
	optimization for the function in which the error is occurring.
	
	Another valid workaround is to use an if-then construct in place of
	the ternary operators.
	
	Microsoft has confirmed this to be a problem with the C compiler
	version 6.00. We are researching this problem and will post new
	information here as it becomes available.
