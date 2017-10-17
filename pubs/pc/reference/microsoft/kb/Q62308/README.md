---
layout: page
title: "Q62308: Internal Compiler Error '@(#)newcode.c:1.87', Line 697"
permalink: /pubs/pc/reference/microsoft/kb/Q62308/
---

## Q62308: Internal Compiler Error '@(#)newcode.c:1.87', Line 697

	Article: Q62308
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 22-JUN-1990
	
	The code below, when compiled with Microsoft C 6.00 with default
	options, produces the following error message:
	
	   test.c(1008) : fatal error C1001: Internal Compiler Error
	                  (compiler file '@(#)newcode.c:1.87', line 697)
	                  Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	    void foo( void )
	    {
	        _asm
	        {
	            Top:
	
	                nop         /* 1000 NOPs in the _asm block */
	                nop
	                nop
	
	                /* 997 more */
	
	                loop Top
	        }
	    }
	
	An out-of-range branch instruction is causing the error.
	
	The quick compiler, which may be invoked with the -qc switch on the CL
	command line, correctly generates this error:
	
	   test.c(1008) : error C2427: 'Top' : jump referencing label
	                                       is out of range
	
	Microsoft has confirmed this to be a problem with C 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
