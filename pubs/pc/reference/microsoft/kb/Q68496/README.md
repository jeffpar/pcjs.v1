---
layout: page
title: "Q68496: C1001: Internal Compiler Error: grammar.c, Line 140"
permalink: /pubs/pc/reference/microsoft/kb/Q68496/
---

	Article: Q68496
	Product: Microsoft C
	Version(s): 6.00a  | 6.00a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00a
	Last Modified: 1-FEB-1991
	
	The C version 6.00a compiler produces the following internal compiler
	error when the sample program below is compiled with /AL and any of
	these optimizations: default, /Oa, /Oc, /Oi, /On, /Op, /Or, /Os, /Ot,
	/Ow, or /Oz:
	
	   file.c(6) : fatal error C1001: Internal Compiler Error
	                (compiler file '../grammar.c', line 140)
	                Contact Microsoft Product Support Services
	
	The following are valid workarounds:
	
	1. Compile with one of the following optimizations:
	
	      /Od, /Oe, /Og, /Ol and /Ox
	
	2. Use the optimize pragma to turn off optimizations for the function
	   in which the error is occurring.
	
	3. Use the /qc (quick compile) compiler option.
	
	Sample Code
	-----------
	
	void select( int *x, int d, int *y, int *z)
	{
	   int sx;
	
	   if( x != z && sx < 0)
	      x[0] = (-x[0]);      /* this line causes error */
	}
	
	Microsoft has confirmed this to be a problem in C version 6.00a. We
	are researching this problem and will post new information here as it
	becomes available.
