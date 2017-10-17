---
layout: page
title: "Q68145: C1001: Internal Compiler Error: grammar.c, Line 164"
permalink: /pubs/pc/reference/microsoft/kb/Q68145/
---

## Q68145: C1001: Internal Compiler Error: grammar.c, Line 164

	Article: Q68145
	Version(s): 6.00a  | 6.00a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00a fastcall
	Last Modified: 24-JAN-1991
	
	The sample code below produces the following internal compiler error
	when compiled with default optimizations:
	
	   cl /c /Gs t.c
	
	   t.c(10) : fatal error C1001: Internal Compiler Error
	                   (compiler file '@(#)grammar.c:1.138', line 164)
	                   Contact Microsoft Product Support Services
	
	The following is a list of possible workarounds:
	
	1. Turn off all optimizations (compile with /Od).
	
	2. Remove the _fastcall keyword from the function declaration.
	
	3. Reduce the complex expression by using temporary variables.
	
	4. Compile with the /qc (Quick Compile) option.
	
	Sample Code
	-----------
	
	1: #include<math.h>
	2:
	3: double _fastcall round(void)
	4: {
	5:     char *decimal;
	6:     double sign;
	7:     int right;
	8:
	9:     right=(int)(((int)(atof(decimal)+1.0))*1.0);
	10:    return (sign*(1.0+((double)right)));
	11:}
	
	Microsoft has confirmed this to be a problem in C version 6.00a. We
	are researching this problem and will post new information here as it
	becomes available.
