---
layout: page
title: "Q68265: Signed Is Converted to unsigned in Comparison with unsigned"
permalink: /pubs/pc/reference/microsoft/kb/Q68265/
---

	Article: Q68265
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 1-FEB-1991
	
	The additional adherence to the ANSI standard beginning with C
	versions 6.00 and 6.00a and QuickC versions 2.50 and 2.51 will cause a
	negative signed integer to be converted to an unsigned integer in a
	comparison. This is the correct and intended behavior, although it may
	produce results that are unexpected. The sample code below
	demonstrates this behavior.
	
	This is new in C 6.00 and is documented in "Microsoft C Advanced
	Programming Techniques" on page 422, section B.1.2. The following
	program will produce warning C4018 "signed/unsigned mismatch" at
	warning level 3 or 4. Casting of the variables will preserve their
	relationship in the expression.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	void main( void)
	{
	   int a = -1;
	   unsigned b = 1;
	
	   if ( b < a )
	      printf( "Signed was converted to unsigned\n");
	   else
	      printf( "Sign was preserved\n");
	}
	
	The output from the program above will be:
	
	   Signed was converted to unsigned
	
	Either of the following methods may be used to achieve the expected
	behavior:
	
	1. If you are sure that b is less than 32768, change the if statement
	   to:
	
	      if ( (signed int) b <  a)
	
	   Note: This will produce the most efficient code.
	
	2. Change the if statement to:
	
	      if ( (long) b < (long) a)
