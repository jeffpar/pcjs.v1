---
layout: page
title: "Q50251: /Ol Causes Constant Overflow Warnings c4057 c4056"
permalink: /pubs/pc/reference/microsoft/kb/Q50251/
---

	Article: Q50251
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 17-JUL-1990
	
	The following small program, when compiled with loop optimization
	(/Ol), produces the following warnings on the auto-decrement statement
	in the second for loop:
	
	   warning C4057: overflow in constant multiplication
	   warning C4056: overflow in constant arithmetic
	
	The warnings occur as a side effect of the optimization of the second
	loop. Because the second loop has no functional value, it is optimized
	to the loop-terminating conditions by the compiler. The warnings
	appear to be benign; the program runs as expected. It is recommended,
	however, that if you encounter these errors you generate an assembly
	listing of the code and check the loop for correctness. These warnings
	do not occur in any version of QuickC, QCL, or QuickAssembler.
	
	Sample Code
	-----------
	
	#include<stdio.h>
	
	void main(void)
	{
	     unsigned char *p1,
	                      *start,
	                      i,
	                      j;
	
	     start = "abcdefgh";
	     for(i = 0, p1 = &start[7]; i < 7; i++){
	          p1--;
	          j = *p1;
	     }
	     for(i = 0, p1 = &start[7]; i < 7; i++){
	          p1--;
	     }
	}
