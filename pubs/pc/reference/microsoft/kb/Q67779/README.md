---
layout: page
title: "Q67779: C1001: Internal Compiler Error: regMD.c, Lines 3047 and 3020"
permalink: /pubs/pc/reference/microsoft/kb/Q67779/
---

	Article: Q67779
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 31-JAN-1991
	
	The sample code below produces the following internal compiler errors
	when compiled under different versions of the C compiler. The problem
	occurs when compiled with the /Og and /Oe optimizations under the
	compact and large memory models.
	
	Under C 6.00a
	-------------
	
	   file.c(11) : fatal error C1001: Internal Compiler Error
	                      (compiler file '@(#)regMD.c:1.110', line 3047)
	                      Contact Microsoft Product Support Services
	
	Under C 6.00
	------------
	
	   file.c(11) : fatal error C1001: Internal Compiler Error
	                      (compiler file '@(#)regMD.c:1.110', line 3020)
	                      Contact Microsoft Product Support Services
	
	The following are valid workarounds for the problem:
	
	1. Compile without the /Oe or /Og optimizations.
	
	2. Use the #pragma optimize switch in the code to turn off the
	   offending optimizations for the particular function.
	
	3. Compile under the small or medium memory models.
	
	Sample Code
	-----------
	
	#include<string.h>
	
	void foo (void)
	{
	    char *o, *wp, *cp;
	    int c,t;
	
	    for (;;)
	    {
	        wp++;
	        t = wp - cp;
	        if (c) t=0;
	        if (t) strncpy (&o[c], cp, t );
	        c = t;
	        cp = wp;
	    }
	}
