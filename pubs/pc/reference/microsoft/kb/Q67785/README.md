---
layout: page
title: "Q67785: Bit Operations on Char May Produce Unexpected Results"
permalink: /pubs/pc/reference/microsoft/kb/Q67785/
---

## Q67785: Bit Operations on Char May Produce Unexpected Results

	Article: Q67785
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 6-FEB-1991
	
	Bit manipulations on type char may produce different results depending
	on the compiler switches. The /J and /qc switches have different
	effects on the code below when using the Microsoft C versions 6.00 and
	6.00a compiler.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	char unsigned ary[4] = {0xF6, 0xF7, 0xF8, 0xF9};
	
	void main(void)
	{
	   unsigned long result1, result2;
	   char *p;
	   p = ary;
	   result1 = *p | ( *(p+2) << 8);
	   result1 += ( *(p+1) | ( *(p+3) << 8)) * 0x10000;
	   result2 = (unsigned long)(( *(p+2) << 8) | *p) |
	             (unsigned long)(( *(p+3) << 8) | *(p+1)) << 16;
	   printf("result1 = %lX\n", result1);
	   printf("result2 = %lX\n", result2);
	}
	
	When compiled with
	
	   cl /qc /J foo.c
	
	the results are:
	
	   result1 = F9F7F8F6
	   result2 = F9F7F8F6
	
	When compiled with
	
	   cl /J foo.c
	
	the results are:
	
	   result1 = F9F6F8F6
	   result2 = FFFFF8F6
	
	When compiled with
	
	   cl /qc foo.c
	or
	   cl foo.c
	
	the results are:
	
	   result1 = FFF6FFF6
	   result2 = FFFFFFF6
	
	The differences occur because of a problem in the Quick Compiler. When
	an integral promotion is required, the Quick Compiler incorrectly
	converts an unsigned char to an unsigned int. According to ANSI, if
	all the values of a char can be represented in an int, it is converted
	to an int; otherwise, it is converted to an unsigned int (see section
	3.2.1.1). This is also documented in the "Advanced Programming
	Techniques" manual on page 422.
	
	There are a number of ways to work around this problem depending on
	the desired results. If the intent was to generate results equal to
	F9F7F8F6 (as the Quick Compiler with /J did), declare "p" as a pointer
	to an unsigned char and modify the equations for "result1" and
	"result2" to use unsigned int casts where appropriate. For example:
	
	   result1 = *p | ((unsigned int)*(p+2) << 8);
	   result1 += ( *(p+1) | ( *(p+3) << 8)) * 0x10000;
	
	-or-
	
	   result2 = ((unsigned long)(((unsigned int)*(p+2) << 8) | *p)|
	             (unsigned long)(( *(p+3) << 8) | *(p+1)) << 16;
	
	If the results from the full optimizing compiler with /J are desired,
	again declare "p" as a pointer to unsigned char and replace the above
	mentioned casts with signed int. Finally, if the results without /J
	are desired, declare "p" as a pointer to a signed char.
	
	Microsoft has confirmed this to be a problem in the Microsoft C
	Compiler versions 6.00 and 6.00a. We are researching this problem and
	will post new information here as it becomes available.
