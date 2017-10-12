---
layout: page
title: "Q40113: Incorrect Code Generation with /J"
permalink: /pubs/pc/reference/microsoft/kb/Q40113/
---

	Article: Q40113
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist5.00 buglist5.10
	Last Modified: 5-JAN-1989
	
	If the following program is compiled with the /J compiler option
	(which changes the default for char type from signed to unsigned) in
	the Microsoft C Optimizing Compiler Versions 5.00 and 5.10, it will
	not calculate the value of the long integer variable "result"
	correctly:
	
	#include <stdio.h>
	void main(void)
	{
	unsigned long result = 'b';
	
	result = result - 'a' + 1  ;
	printf("result = %lx", result) ;
	}
	
	Compiled without /J, the program works correctly. Replacing "-a+1"
	with "-96", or using a char type variable to store the value "a" also
	prevents the problem.
	
	Microsoft has confirmed this to be a problem in Versions 5.00 and
	5.10. We are researching this problem and will post new information as
	it becomes available.
	
	The following is the assembly-code listing generated with /J :
	
	;|*** unsigned long result = 'b';
	        mov     WORD PTR [bp-4],98      ;result
	        mov     WORD PTR [bp-2],0
	;|***
	;|*** result = result - 'a' + 1  ;
	        add     WORD PTR [bp-4],-96     ;This sets the carry flag
	                                        ;incorrectly.
	        adc     WORD PTR [bp-2],0
	
	The following is the code generated without /J :
	
	;|*** unsigned long result = 'b';
	        mov     WORD PTR [bp-4],98      ;result
	        mov     WORD PTR [bp-2],0
	;|***
	;|*** result = result - 'a' + 1  ;
	        sub     WORD PTR [bp-4],96      ;result
	        sbb     WORD PTR [bp-2],0
