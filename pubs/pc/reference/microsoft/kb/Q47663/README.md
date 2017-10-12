---
layout: page
title: "Q47663: Variable Width, Precision Available with printf"
permalink: /pubs/pc/reference/microsoft/kb/Q47663/
---

	Article: Q47663
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC 1.00 1.10 2.00 2.01 S_QuickASM
	Last Modified: 9-AUG-1989
	
	The Microsoft run-time library function printf() allows the width of
	the format specifier to be supplied at run time. This is done with the
	use of the * with the format specifier. This is mentioned on Pages 460
	and 461 of the "Microsoft C 5.1 Optimizing Compiler Run-Time Library
	Reference." The following code sample demonstrates this capability.
	
	Code Sample
	-----------
	
	/* This program defines a procedure to print out a floating point
	   number with variable width and precision.
	*/
	#include <stdio.h>
	
	void print(int, int, float);
	
	void main(void) {
	   print (10, 2, 1234.5678f);
	   print (9, 4, 1234.5678f);
	   print (5, 2, 1234.5678f);
	}
	
	void print(int w, int p, float value)  {
	   printf ("Printf format :%*.*f\n", w, p, value);
	   printf ("Width =        0123456789012\n");
	}
