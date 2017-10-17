---
layout: page
title: "Q38025: Signed char Type Converted to int Type at Function Call"
permalink: /pubs/pc/reference/microsoft/kb/Q38025/
---

## Q38025: Signed char Type Converted to int Type at Function Call

	Article: Q38025
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 15-NOV-1988
	
	Question :
	
	Any char value equal to or greater than 0x80 is printed with 0xff
	preceding it when I do the following:
	
	1. Declare an array of char and initialize it with hexadecimals.
	
	2. Later in the program, use printf to display the values of the
	   array element.
	
	3. Use "%2x" as format string. (See sample program below.)
	
	Why does this behavior occur?
	
	Response:
	
	Use "unsigned char" to declare the array "bit", or use the /J compiler
	option to change the char type from its default of signed char to
	unsigned char.
	
	This is not a problem of Microsoft C Compiler. In the sample program
	below, the element of array "bits" has char type, which is a signed
	type in the Microsoft C compiler. In C when a variable is used as an
	actual argument in a function call, usual unary data type conversion is
	automatically performed before the argument is passed to the function.
	
	In particular, signed char type is converted to int type using sign
	extension (see the "Microsoft C Optimizing Compiler Language
	Reference" manual for data conversion rules.) Because signed char type
	can represent values from -128 to 127 (in our compiler -128 is not
	defined), and a negative value is represented in two's complement form,
	any hexadecimal number greater than 0x80, which is a negative value in
	signed char type, will be converted to signed int type in
	corresponding two's complement form.
	
	For example, 0x80 (-128) is converted to 0xff80; 0x81 (-127) is
	converted to 0xff81.
	
	When using "printf" with unsigned hexadecimal integer control
	character "%x", the values are displayed in its unsigned hexadecimal
	format. If "%d" is used, the values are displayed in signed decimal
	format.
	
	The following is a sample program:
	
	#include <stdio.h>
	char bits[8] = {0x80, 0x81, 0x91, 0x00, 0x7f, 0x20, 0x40, 0x08} ;
	main()
	{  int i ;
	   for (i=0; i<8 ; i++)
	      printf("%2x ", bits[i]) ;
	   printf("\n") ;
	   for (i=0; i<8 ; i++)
	      printf("%d ", bits[i]) ;
	}
	
	Output :
	  ff80 ff81 ff91 00 7f 20 08
	  -128 -127 -111 0  127 32 8
