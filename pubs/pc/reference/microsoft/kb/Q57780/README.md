---
layout: page
title: "Q57780: Casting Pointer Subtraction May Yield Incorrect Code"
permalink: /pubs/pc/reference/microsoft/kb/Q57780/
---

	Article: Q57780
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 13-FEB-1990
	
	Microsoft QuickC Versions 2.00 and 2.01 will produce incorrect code if
	pointer subtraction is immediately cast to a long integer. The
	resulting value is not the number of elements between the two
	pointers, as it should be.
	
	The following code fragment demonstrates this problem:
	
	#include <stdio.h>
	#include <stddef.h>
	char
	   chArray [20],
	   *p1,
	   *p2;
	long
	   pdif;
	
	void main(void)
	{
	   p2 = &chArray[0];
	   p1 = &chArray[19];
	
	   printf("dif:  %lx\n", (long)(p1 - p2)); /* Invalid count */
	
	   pdif = (p1 - p2);
	   printf("dif:  %lx\n", pdif);  /* Correct count */
	}
	
	In the first printf(), the compiler does not clear out the high-order
	word when the cast is performed, so the resulting long value is
	incorrect. The workaround is to use the second form and calculate the
	count in a temporary variable first.
	
	According to the ANSI standard, pointer subtraction is defined between
	two pointers when they both are of the same type and they both point
	to the same array. The return value is the number of elements
	separating the two pointers. The resulting type is defined inside
	"stddef.h" with "ptrdiff_t". Microsoft C and QuickC define "ptrdiff_t"
	to be a two-byte signed integer.
