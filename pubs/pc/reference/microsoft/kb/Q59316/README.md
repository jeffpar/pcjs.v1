---
layout: page
title: "Q59316: Evaluating Floating-Point Values to Zero"
permalink: /pubs/pc/reference/microsoft/kb/Q59316/
---

## Q59316: Evaluating Floating-Point Values to Zero

	Article: Q59316
	Version(s): 5.10 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 17-DEC-1990
	
	Comparing small double values to 0 (zero) causes machines with
	coprocessors to hang. Since double values use 64 bits (or 8 bytes) to
	store their values and a coprocessor uses an 80-bit register to hold
	floating point values, there is a 16-bit difference that causes any
	operations on the double values to be inaccurate. In Microsoft C
	version 6.00 and Quick C version 2.50, the long double type is fully
	supported and can be used to exactly match the coprocessor form. In
	that case, the problem goes away.
	
	Zero is an absolute value and not always the best value to evaluate
	small float values to. The recommended way to evaluate a float value
	is to compare the float with a small value other than 0 (for example,
	0.00001).
	
	Sample Code
	-----------
	
	/* The following sample program demonstrates the problem when
	 * evaluating a small double value to 0.
	 */
	
	#include <stdio.h>
	
	double rz = 0.7;
	
	void main (void)
	{
	   int i = 0;
	
	   while (rz != 0.0) {
	         rz = rz * rz;
	         i++;
	   }
	   printf ("rz = %lf   i = %d\n", rz, i);
	}
	
	The recommended way is to replace the while() loop in the above code
	with the following:
	
	      while (rz >= 0.00001) {
	          rz = rz * rz;
	          i++;
	    }
