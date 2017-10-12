---
layout: page
title: "Q67078: Different Warnings May Appear Using Different Optimizations"
permalink: /pubs/pc/reference/microsoft/kb/Q67078/
---

	Article: Q67078
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER |
	Last Modified: 4-JAN-1991
	
	Different warning messages can appear from separate compiles of the
	same code when different optimizations are used. This is normal and
	occurs because some warnings are found only while optimizing.
	
	If the sample code below is compiled with /W4 (all warnings) and the
	/Os optimization (optimize for space), no warnings are found. However,
	when the code is compiled with /W4 and /Osle (optimize for size, loop,
	and global-register allocation), the following warning is generated:
	
	   FILE.c(7) : warning C4202: unreachable code
	
	There are several other optimizations and code examples that will
	exhibit this same type of behavior. Once again, this is normal and
	serves to notify the developer that there MAY be a problem.
	
	Sample Code
	-----------
	
	 1. #include <stdio.h>
	 2.
	 3. void main(void)
	 4. {
	 5.    goto bottom;
	 6.
	 7.    printf("Not used\n");    // Code that is not used
	 8.
	 9. bottom:printf("Hello World!");
	10. }
