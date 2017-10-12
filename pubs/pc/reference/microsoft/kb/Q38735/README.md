---
layout: page
title: "Q38735: Viewing Array Elements in CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q38735/
---

	Article: Q38735
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 12-DEC-1988
	
	Question:
	
	In CodeView, why am I unable to view elements of an array with an
	index of type char in my C program? Whenever I do so, I get the
	following error:
	
	   "operand types incorrect for this operation"
	
	Response:
	
	Using a char variable to index an array is only valid in the C
	language. As CodeView supports multiple languages, it does not allow
	a char variable to index into an array, even if the program is written
	in C.
	
	For a workaround to view elements of an array indexed by a variable of
	type "char", you need to cast the variable to an int type in
	CodeView's Dialog Box as follows:
	
	   > ? buffer[(int)i]
	
	The following code sample demonstrates the situation:
	
	#include <stdio.h>
	main()
	{
	   int  j = 5;
	   char i = 5;
	   char buffer[10];
	
	   scanf("%s",buffer);
	
	}
	
	When the above program is loaded, CodeView allows you to view
	the fifth element of the array with the following commands:
	
	   > ?buffer[5]
	
	   > ?buffer[j].
	
	However, the following command causes the error: "operand types
	incorrect for this operation":
	
	   > ?buffer[i]
