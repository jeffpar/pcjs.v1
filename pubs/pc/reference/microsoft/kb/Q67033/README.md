---
layout: page
title: "Q67033: C1001: Internal Compiler Error: @(#)grammer.c:1.138, Line 164"
permalink: /pubs/pc/reference/microsoft/kb/Q67033/
---

	Article: Q67033
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_quickc buglist6.00 buglist6.00a
	Last Modified: 28-NOV-1990
	
	If a semicolon (;) is missing at the end of a structure, union, or
	enumerator definition, and the statement following the semicolon is a
	variable declaration of any of the unsigned types except for
	"unsigned", no compiler error is generated. However, in the sample
	code below, attempting to use this variable may result in the
	following internal compiler error:
	
	   fatal error C1001: Internal Compiler Error
	        (compiler file '@(#)grammar.c:1.138', line 164)
	        Contact Microsoft Product Support Services
	
	Similarly, QuickC version 2.51 does not generate an error on the
	missing semicolon; however, no internal compiler error is generated
	and the program will experience unpredictable results on attempts to
	use the variable declared after the structure, union, or enumerator
	definition.
	
	Sample Code
	-----------
	
	struct foo {
	     int i;
	}                    /* missing semicolon (;) */
	
	unsigned char c;
	
	void main(void)
	{
	     c==0;
	}
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
