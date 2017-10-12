---
layout: page
title: "Q39602: Wrong Syntax for fopen Mode Argument Gives NULL Return Value"
permalink: /pubs/pc/reference/microsoft/kb/Q39602/
---

	Article: Q39602
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 29-DEC-1988
	
	In the second argument to the fopen function, if the specification of
	the mode character t (text) or b (binary) is before the file-access
	type r (read), w (write), or a (append), no compilation errors occur.
	However, at run-time, fopen fails to open the file and returns NULL.
	
	Page 275 of the "Microsoft C Run-Time Library Reference" states that
	the mode character is to be appended to the character string for the
	type argument. If, instead, the mode character is placed before the
	beginning of the type argument, then fopen fails. An example follows.
	
	Please note that the string which is passed as the second parameter
	to fopen could be a variable string as well as a constant string.
	Since the variable string could be constructed at run-time, it is
	impossible to check for this error at compile time.
	
	Also note that strings of the form below are explicitly prohibited on
	page 275 of the C Runtime Library Reference.
	
	The program below demonstrates this behavior. It prints "failed"
	and does not open a file. If the second argument to fopen is changed
	to "wt", then it prints "succeeded" and the file is opened.
	
	The following is the program:
	
	#include <stdio.h>
	FILE *s;
	void main(void);
	void main(void)
	{
	  if ((s = fopen("test.dat","tw")) == NULL)
	    printf("fopen failed\n");
	  else
	    printf("fopen succeeded\n");
	}
