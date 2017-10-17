---
layout: page
title: "Q48928: Cast of Float to Long Truncates Value to 1 Less Than Expected"
permalink: /pubs/pc/reference/microsoft/kb/Q48928/
---

## Q48928: Cast of Float to Long Truncates Value to 1 Less Than Expected

	Article: Q48928
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC S_QuickAsm
	Last Modified: 7-DEC-1989
	
	Question:
	
	When I cast a float to a long integer, the result is one less than the
	expected value.
	
	The following is an example:
	
	   double i, j;
	   char  r[] = "16.49";
	
	   i = atof(r) * 100;
	   printf ("%ld\n", (long)i);
	
	What causes this code to produce 1648 instead of 1649?
	
	Response:
	
	When a float or double value is converted to an integer number, the
	value is truncated. You are getting 1648 and not 1649 because the
	float value is not stored exactly as 1649.0000. The value is stored as
	1648.99999...999. When you cast the double value to a long integer,
	the number is truncated at the decimal point to 1648.
	
	This is expected behaviour for C Version 5.10, QuickC Versions 1.01
	and 2.00, and QuickC with QuickAssembler Version 2.01.
	
	The workaround for this constraint is to add 0.5 to the double value
	before converting to an integer value. The following code produces the
	correct result:
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <math.h>
	
	double i, j;
	char  r[] = "16.49";
	
	main ()
	{
	        i = atof(r) * 100;
	        printf ("%ld\n", (long)(i + 0.5));
	}
