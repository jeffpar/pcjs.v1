---
layout: page
title: "Q43809: Changes in scanf() and printf() for Long Types in C"
permalink: /pubs/pc/reference/microsoft/kb/Q43809/
---

	Article: Q43809
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 19-SEP-1989
	
	As of Version 5.10 of the Microsoft C Optimizing Compiler and Version
	1.00 of the QuickC compiler, the scanf() and printf() functions no
	longer support the uppercase D, O, and I type characters, which
	represented long-integer fields.
	
	Current versions of Microsoft C compilers precede the type characters
	in the format portion of the printf() and scanf() functions with an
	"l"  (lowercase letter "l") to specify long-type fields.
	
	The uppercase "X" format specifier also has been changed; it now
	specifies that uppercase letters are to be used when displaying
	hexadecimal numbers in a printf() statement.
	
	The following code fragment reads an integer into a variable and then
	displays the value of the variable:
	
	int i;
	scanf( "%d", &i );
	printf( "%d", i );
	
	The following code fragment accepts and displays the value of a long
	integer variable:
	
	long i;
	scanf( "%ld", &i );
	printf( "%ld", i );
