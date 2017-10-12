---
layout: page
title: "Q69413: C1001: Internal Compiler Error: regMD.c, Lines 3101 and 3074"
permalink: /pubs/pc/reference/microsoft/kb/Q69413/
---

	Article: Q69413
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 25-FEB-1991
	
	The Microsoft C Compiler versions 6.00 and 6.00a produce the following
	internal compiler errors when the sample program below is compiled
	with default optimization:
	
	With C 6.00a
	------------
	
	   file.c(5) : fatal error C1001: Internal Compiler Error
	               (compiler file '@(#)regMD.c:1.110', line 3101)
	               Contact Microsoft Product Support Services
	
	With C 6.00
	-----------
	
	   file.c(5) : fatal error C1001: Internal Compiler Error
	               (compiler file '@(#)regMD.c:1.100', line 3074)
	               Contact Microsoft Product Support Services
	
	These errors will occur under any memory model when using any one of
	the following optimizations (although the errors may not occur when
	some of these options are combined):
	
	   /Oa, /Oc, /Od, /Oi, /On, /Op, /Or, /Os, /Ot, /Ow, or /Oz
	
	There are several possible ways to work around these errors:
	
	1. Do not use any of the above options and do not use the default
	   optimization for the module where the error occurs.
	
	2. Add /Oe or /Og; one of these combined with other optimizations
	   may eliminate the problem.
	
	3. Selectively disable optimizations for the particular function that
	   is producing the error through use of the optimize pragma.
	
	4. Rewrite the statement to use an if-else construct instead of the
	   ternary operator.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	/* Compile options needed: none
	*/
	
	void func(unsigned char uch1, unsigned char uch2)
	{
	    uch2 = uch1 ? (unsigned char)'0' : (unsigned char)(uch1 % 24);
	}
