---
layout: page
title: "Q64565: #if Uses Only Lower 2 Bytes of Expression for Test"
permalink: /pubs/pc/reference/microsoft/kb/Q64565/
---

	Article: Q64565
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	The #if compiler directive uses only the lower 2 bytes of the
	evaluated expression when testing for true or false.
	
	The following code, when compiled using the C 6.00 compiler, will
	evaluate the #if expression to false, when it should evaluate to
	true since the number is non-zero:
	
	Sample Code
	-----------
	
	void main (void)
	{
	#if 0xFFFF0000L
	  printf("TRUE\n");
	#else
	  printf("FALSE\n");
	#endif
	}
	
	According to the ANSI standard (Section 3.8.1), any long expression in
	an #if directive must be evaluated as if it were a long value.
	
	The workaround for this problem is to only use 2-byte expressions in
	an #if directive.
	
	Microsoft has confirmed this to be a problem with the Microsoft C
	Compiler version 6.00. We are researching this problem and will post
	new information here as it becomes available.
