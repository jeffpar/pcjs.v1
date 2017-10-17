---
layout: page
title: "Q69344: Promotion of char to int May Add Two Hex Digits in printf()"
permalink: /pubs/pc/reference/microsoft/kb/Q69344/
---

## Q69344: Promotion of char to int May Add Two Hex Digits in printf()

	Article: Q69344
	Version(s): 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | s_quickc hexidecimal conversion
	Last Modified: 25-FEB-1991
	
	When trying to display a signed char in two-digit hexadecimal format, as
	follows
	
	   char hex_byte = 0x80;
	   printf( "The Hex value is %X", hex_byte);
	
	four digits will be displayed if the char has a value of 0x80 to 0xFF
	because of promotion of the char to a signed int. The %x and %X
	specifiers designate an unsigned hex integer, but because leading 0's
	(zeros) are dropped, values in the range of 0 to 127 produce the
	desired two digits. See the sample code below.
	
	To preserve the two-digit display for all possible values, just
	typecast the char to an unsigned char in the printf() argument list,
	as shown below:
	
	   printf( "The Hex value is %X", (unsigned char)hex_byte);
	
	Another way to achieve this, if sign is of no consequence, is to
	declare the variables as unsigned char.
	
	For ANSI compliance, the compiler promotes all char arguments to
	signed int. If the type is signed char, then the value will be
	sign-extended. Thus, the int will be negative if the left-most bit of
	the char was set, resulting in a different value for the int. When an
	unsigned char is promoted, a 0 (zero) is placed in the high byte so
	that the value is retained.
	
	This promotion may also cause problems with comparisons of signed and
	unsigned chars. This situation, unlike the printf() situation, will
	produce a C4018 (signed/unsigned mismatch) warning at warning level 3
	and above, beginning with C version 6.00.
	
	This behavior is also observed in QuickC versions 2.00 and 2.50 and
	QuickC with QuickAssembler versions 2.01 and 2.51.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	void main( void)
	{
	   char goo = 127;
	   char foo = 128;
	
	   printf( "goo = %X\n",   goo); /* yields "7F" */
	   printf( "foo = %X\n",   foo); /* yields "FF80" */
	
	   /* correct way to represent the char as two hex digits "80" */
	   printf( "foo = %X\n",   (unsigned char)foo);
	}
