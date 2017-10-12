---
layout: page
title: "Q65645: Use of Ternary Conditional Operator with a Constant"
permalink: /pubs/pc/reference/microsoft/kb/Q65645/
---

	Article: Q65645
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-OCT-1990
	
	The following use of the ternary conditional operator (?) should
	convert the integer 2 into a float to match the 3.00. However, because
	the constant 1 is used instead of a variable, the conversion is never
	done. Instead of 2.0 (float), 2 (integer) is passed to printf() and
	instead of printing 2.000000, the program prints 0.000000.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	double x;
	
	void main (void)
	{
	   x= 5.5;
	   printf ("%f\n", 1?2:3.00);
	}
	
	According to the ANSI Standard, if the second and third operands to a
	conditional operator are arithmetic types, the usual arithmetic
	conversions are performed to make them a common type. (See Section
	3.3.15, Lines 6-10). In this case, they should both evaluate to
	floats.
	
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
