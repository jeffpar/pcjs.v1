---
layout: page
title: "Q38728: Initializing Large Character Arrays"
permalink: /pubs/pc/reference/microsoft/kb/Q38728/
---

## Q38728: Initializing Large Character Arrays

	Article: Q38728
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G881128-6987
	Last Modified: 16-JAN-1989
	
	Question:
	
	How can I initialize an array of characters larger than 512 bytes?
	When I try initializing using a character string literal, as follows,
	
	    char a[] = " *** 1000 characters *** ";
	
	I get the following compiler message:
	
	    Warning C4009: string too big, trailing chars truncated
	
	Response:
	
	One method of initializing character arrays is to use a character
	string literal. The minimum limit allowed by ANSI for a characters
	string literal after concatenation is 509 characters. The limit in
	Microsoft C is 512 characters. Because the limit on the length of a
	string literal is 512 characters, you cannot initialize character
	arrays longer than 512 bytes with this method.
	
	The following won't work correctly either because the compiler treats
	these as a single string literal rather than specially as an
	initializer:
	
	char stuff[] =
	        "xxx...xxx"
	            ...
	        "xxx...xxx";
	
	(The ANSI standard says that strings separated only by white space are
	automatically concatenated.)
	
	There are, however, a few other methods you can use that will work
	successfully, such as the following:
	
	char stuff [] =
	        { 'a', ...
	               ...
	          ... 'z' };
	
	However, such an initializer is no fun to type. If you decide to use
	this method, you might want to write a program that will read a data
	file and output the proper initializer.
	
	You might also want to try the following:
	
	char stuff[][10] =  {
	        "0123456789",
	                ...
	        "0123456789"  };
	
	The value 10 is not important EXCEPT that it must match the actual
	length of the string constants. If any of the constants are shorter
	than the length you specify, the end of that row will be padded out
	with zero bytes. If any are longer, the extra characters will be
	thrown away. You can use another pointer to access the following in
	almost any method you want:
	
	   char *stuffptr = (char *) stuff;
	
	This method seems to be the most convenient.
	
	You can also define the array in MASM and link it to your C
	program. In MASM, once you've done the correct segment and public
	definitions, you could write the following:
	
	stuff   db      "abcdefghijkl"
	        db      "morestuff"
	        ...
	        db      "laststuff"
	
	In C, you could access the array with the following:
	
	extern char stuff[];   /*    char * stuff;   will NOT work    */
	
	Finally, you could read the values into the array at run-time from a
	data file. If you read the file in large blocks, (e.g. using read or
	fread) you'll find that the I/O is quite fast.
