---
layout: page
title: "Q69538: C Compiler May Give Wrong Line Number for a C2125 Error"
permalink: /pubs/pc/reference/microsoft/kb/Q69538/
---

	Article: Q69538
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 25-FEB-1991
	
	The C compiler will correctly produce a "C2125: allocation exceeds
	64K" error for an array larger than 64K that is not declared as huge
	or compiled for the huge memory model. However, the line number that
	the compiler displays for the error is incorrect. The sample program
	below demonstrates this problem.
	
	The following error message shows the incorrect line number generated
	when the sample code below is compiled with C version 5.10, 6.00, or
	6.00a:
	
	   file.c(7) : error C2125: 'array' : allocation exceeds 64K
	
	The error is actually generated because of the array declaration on
	line 4, but the compiler always lists the line with the opening brace
	for the main() function as the location of the error (line 7 in this
	case).
	
	When the quick compile (/qc) option is specified under C 6.00 or
	6.00a, the correct line number (line 4) is generated in the error
	message:
	
	   test.c(4) : error C2125: 'array' : allocation exceeds 64K
	
	Note that if you are compiling inside the Programmer's WorkBench
	(PWB), the incorrect line number in the error message will cause PWB
	to take you to an incorrect line in the source code when the compiler
	errors are displayed.
	
	Microsoft has confirmed this to be a problem in C versions 5.10, 6.00,
	and 6.00a. We are researching this problem and will post new
	information here as it becomes available.
	
	Sample Code
	-----------
	
	/* Compile options needed: none
	*/
	
	char array[100000];  /* Error should be generated for this line (4) */
	
	void main(void)
	{                    /* Error message refers to this line (7) */
	}
