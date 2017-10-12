---
layout: page
title: "Q40357: Operation of scanf When Using the Width Option in the Format"
permalink: /pubs/pc/reference/microsoft/kb/Q40357/
---

	Article: Q40357
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-MAY-1989
	
	The scanf run-time library function under Microsoft C allows the
	specification of the width that you would like to read in from the
	input device. Some examples of this width formatting are as follows:
	
	   scanf ("%10s", buffer);   /* read ten chars into buffer[] */
	   scanf ("%5d", &i);     /* read five digits of a number into i */
	
	When using width parameters in the format, the first n digits are read
	into the address specified.
	
	When used with a character string, the width parameter performs as
	follows:
	
	   char buffer[15];
	   scanf ("%10s", buffer);
	
	The first 10 characters are read, and a NULL terminator is added to
	the end of the string.
	
	When used with an integer or float, scanf always reads the first n
	characters (including decimal if in a float) specified with the width
	format. Entering Invalid characters (e.g. a decimal in an integer, any
	alphabetic character) causes the termination and failure of the read.
