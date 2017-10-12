---
layout: page
title: "Q69224: C1001: Internal Compiler Error: regMD.c, Lines 3881 and 3837"
permalink: /pubs/pc/reference/microsoft/kb/Q69224/
---

	Article: Q69224
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 25-FEB-1991
	
	The C version 6.00a compiler produces the following internal compiler
	error when the sample program below is compiled with the intrinsic
	optimization (/Oi):
	
	   file.c(7) : fatal error C1001: Internal Compiler Error
	               (compiler file '@(#)regMD.c:1.110', line 3881)
	               Contact Microsoft Product Support Services
	
	With C version 6.00, the error is the same, except it is line 3837.
	
	Using the function version of strlen() eliminates the problem.
	
	Microsoft has confirmed this to be a problem in the C compiler
	versions 6.00 and 6.00a. We are researching this problem and will post
	new information here as it becomes available.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	void main(void)
	{
	   char * string;
	   int j;
	
	   j = 8 * strlen(string);
	}
