---
layout: page
title: "Q66430: C1001: Internal Compiler Error: @(#)exphelp.c:1.115, Line 391"
permalink: /pubs/pc/reference/microsoft/kb/Q66430/
---

	Article: Q66430
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00a
	Last Modified: 9-NOV-1990
	
	The sample code below will produce the following internal compiler
	error when compiled with both /Oi and /Oe optimizations:
	
	   sample.c(10) : fatal error C1001: Internal Compiler Error
	                      (compiler file '@(#)exphelp.c:1.115', line 391)
	                      Contact Microsoft Product Support Services
	
	The following are several workarounds to this particular internal
	compiler error.
	
	1. Avoid using the optimizations /Oi and /Oe together.
	
	2. Insert the #pragma optimize statement into the code to turn off the
	   offending optimizations for the particular function.
	
	3. Use temporary variables to simplify the expression on line 10.
	
	Sample Code
	-----------
	
	1:      #include <math.h>
	2:      void main(void)
	3:      {
	4:           double x, y, z;
	5:           struct {
	6:                   double d;
	7:           } data;
	8:
	9:           z=2.0 * x;
	10:          data.d=(2.0*x) / sqrt( pow(2.0-y,2) + pow(z,2) );
	11:     }
	
	Microsoft has confirmed this to be a problem in C version 6.00. This
	problem has been corrected in version 6.00a.
