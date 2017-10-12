---
layout: page
title: "Q44816: printf Appears to Print Incorrect Results for Floats"
permalink: /pubs/pc/reference/microsoft/kb/Q44816/
---

	Article: Q44816
	Product: Microsoft C
	Version(s): 5.10 | 5.10
	Operating System: DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 1-JUN-1989
	
	Question:
	
	The printf() below does not print out the correct values for the float
	if I print the float with a hexadecimal specifier before the float
	specifier. Is this a problem with the code or printf()?
	
	Response:
	
	The problem here is that we are using a 2-byte format specifier for an
	8-byte value. To correct this problem, replace "%x" and "%lx" with
	"%lx %lx".
	
	Code example
	------------
	
	#include <stdio.h>
	main()
	{
	        float flt  = 1.701411e+038;
	        double dbl = 1.701411e+038;
	
	 printf("\nFLOAT         %x   %e", flt,flt);
	 printf("\nDOUBLE        %lx  %le",dbl,dbl);
	}
	
	The above code produces incorrect output. However, the source code is
	incorrect. When printing, the above code is using a 2-byte hex format
	specifier %x or a 4-byte hex format specifier %lx with an 8-byte
	double argument (the float is also passed as a double). This produces
	the incorrect results. To solve this problem, use two %lx format
	specifiers to remove 8-bytes off the stack before printing the second
	double. An example is as follows:
	
	   printf("\nFloat  %lx %lx %e",flt,flt);
	   printf("\nDouble %lx %lx %le",dbl,dbl);
	
	This works correctly for Microsoft C under MS-DOS or OS/2; however,
	this code may not be portable under other systems that support types
	of different sizes.
	
	Eight bytes are passed, independent of the fact that one argument is a
	float and the other a double, because the float is being promoted to a
	double. This is because all floats are passed as doubles unless they
	are specified as floats in the prototype. Because printf() has
	variable number of parameters, the arguments are not prototyped and
	therefore all floats are promoted up to doubles.
