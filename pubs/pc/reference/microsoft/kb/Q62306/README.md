---
layout: page
title: "Q62306: C1001: Internal Compiler Error: '../grammar.c', Line 140"
permalink: /pubs/pc/reference/microsoft/kb/Q62306/
---

	Article: Q62306
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-JUL-1990
	
	The code below, when compiled with Microsoft C 6.00 for the compact or
	large memory models, produces the following error:
	
	   test.c(13) : fatal error C1001: Internal Compiler Error
	                (compiler file '../grammar.c', line 140)
	                Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	#include <string.h>
	#pragma intrinsic( strcmp )         /* Intrinsic form of strcmp */
	
	char    *s1 = "Standard input",     /* s1 and s2 must be    */
	        *s2 = "Standard output";    /* initialized to fail. */
	
	void main()
	{
	    register int i;                 /* i must be register */
	
	    if( strcmp( s1, s2 ) == 0 );
	
	    for( i = 0; i < 5; ++i );
	}
	
	To work around this problem, one of several solutions may be used:
	
	1. Use the nonintrinsic form of strcpy.
	
	2. Do not specify i as a register variable.
	
	3. If appropriate, use a memory model with near data pointers.
	
	Microsoft has confirmed this to be a problem in C 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
