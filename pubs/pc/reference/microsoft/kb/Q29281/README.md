---
layout: page
title: "Q29281: Using printf() with Far Pointers in Small Model Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q29281/
---

	Article: Q29281
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	Problem:
	
	I have a number of far pointers pointing to various data items in my
	program. I compiled the program in the small-memory model. However,
	printf() will not return the data to the area in which the pointers
	are pointing.
	
	Response:
	
	To use printf() to print data items (strings and pointers only) that
	have been declared as far in a small- or medium-memory model, use F to
	modify the %s or %p field. For example, if you have the following
	declaration
	
	   char far *ptr;
	
	you can print out the value of the pointer with the following call:
	
	   printf("%Fp",ptr);
	
	You also can print out the string pointed to by ptr (assuming that it
	has been initialized in your code) with the following call:
	
	   printf("%Fs",ptr);
	
	For additional information on the use of the F specifier with
	printf(), refer to the  C run-time library reference or online help
	that was supplied with your particular version of the compiler.
