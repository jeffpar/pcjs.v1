---
layout: page
title: "Q67778: C1001: Internal Compiler Error: regMD.c, Line 1017"
permalink: /pubs/pc/reference/microsoft/kb/Q67778/
---

## Q67778: C1001: Internal Compiler Error: regMD.c, Line 1017

	Article: Q67778
	Version(s): 6.00a  | 6.00a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00a
	Last Modified: 28-DEC-1990
	
	When compiling with /Oe optimization under the compact or large memory
	models, the code below generates the following internal compiler error
	with Microsoft C version 6.00a:
	
	   fatal error c1001: Internal Compiler Error
	        (compiler file '@(#)regMD.c:1.110',line 1017)
	        Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	    char hex_digits[]={"f"};
	
	    int x(char *resultp, int item)
	    {
	        char *s;
	        int hundreds;
	
	        s=resultp;
	        hundreds=100;
	        if(hundreds)
	          *s++='0';
	        *s++=' ';
	        *s++=hex_digits[item/16];
	        *s++=hex_digits[item%16];
	    }
	
	The following are valid workarounds for the problem:
	
	1. Compile without the /Oe optimization.
	
	2. Use the #pragma optimize switch in the code to turn off the
	   offending optimizations for the particular function.
	
	3. Compile under the small or medium memory models.
