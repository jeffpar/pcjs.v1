---
layout: page
title: "Q62309: Internal Compiler Error '@(#)regMD.c:1.100', Line 3074"
permalink: /pubs/pc/reference/microsoft/kb/Q62309/
---

	Article: Q62309
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 22-JUN-1990
	
	The code below, when compiled with Microsoft C 6.00, produces the
	following error message:
	
	   test.c(8) : fatal error C1001: Internal Compiler Error
	               (compiler file '@(#)regMD.c:1.100', line 3074)
	               Contact Microsoft Product Support Services
	
	Sample Code
	------ ----
	
	void test ( long Addr1, long Addr2 )
	{
	    /* This expression compiles. */
	    if( ((Addr1 & 0x0FFF0000) - (Addr2 & 0x0FFFF0000)) >= 0 );
	
	    /* Removing parens around Addr1 & 0x0FFF0000 causes ICE */
	    if( (Addr1 & 0x0FFF0000 - (Addr2 & 0x0FFFF0000)) >= 0 );
	}
	
	The error may be worked around, as seen in the sample code, by placing
	parentheses around the subexpression involving Addr.
	
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
