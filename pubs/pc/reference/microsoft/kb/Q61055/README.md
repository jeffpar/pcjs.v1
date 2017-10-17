---
layout: page
title: "Q61055: C1001: Internal Compiler Error: regMD.c: 1.100 Line 1017"
permalink: /pubs/pc/reference/microsoft/kb/Q61055/
---

## Q61055: C1001: Internal Compiler Error: regMD.c: 1.100 Line 1017

	Article: Q61055
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 15-MAY-1990
	
	The following sample code generates an internal compiler error when
	compiled with /Ole for optimizations in all memory models:
	
	   prog.c(15) : fatal error C1001: Internal Compiler Error
	                    (Compiler file '@(#)regMD.c:1.100', line 1017
	                    Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	 1:  void foo (unsigned);
	 2:
	 3:  /* Either of the following two pragmas are valid workarounds. */
	 4:  /* #pragma optimize ("l", off) */
	 5:  /* #pragma optimize ("e", off) */
	 6:
	 7:  void foo (unsigned start)
	 8:      {   /* Works if "start" is an "int" instead of "unsigned" */
	 9:      int i;
	10:      int end;
	11:
	12:      end = start + 8;       /* Works if "end = start" or if
	13:                                "end" is assigned to a constant */
	14:
	15:       for (i = start; i < end; ++i)
	16:           end++;             /* Works if empty statement or i++ */
	17:      }
	18:
	19:  /* #pragma optimize ("l", on) */
	20:  /* #pragma optimize ("e", on) */
	
	To work around this problem, disable either the global register
	allocation /Oe or the loop optimization /Ol. There is a conflict with
	both optimizations being enabled at the same time with this particular
	code.
	
	The following are two additional workarounds:
	
	1. Use the optimize() pragma to override the compiler's optimization
	   switch (as shown in the above program).
	
	   You can disable one of the optimizations before the function that
	   contains the offending statement, and then re-enable the
	   optimization after the closing curly brace (}) of the function.
	
	   With this method, you gain the optimum performance available for
	   your source code.
	
	2. Use -Ol or -Oe instead of -Ole.
	
	Microsoft has confirmed this to be a problem with Version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
