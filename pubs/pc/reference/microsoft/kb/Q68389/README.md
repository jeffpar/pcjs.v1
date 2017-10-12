---
layout: page
title: "Q68389: sizeof(char Expression) Same as sizeof(int)"
permalink: /pubs/pc/reference/microsoft/kb/Q68389/
---

	Article: Q68389
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1991
	
	Question:
	
	If I print out the sizeof a char, an int, and a long, I get 1, 2, and
	4 bytes, respectively. However, if I shift each type by 1 and print
	the sizeof each after the shift, I get 2, 2, and 4 bytes. Why does a
	shifted char return 2 bytes, whereas an unshifted char returns 1 byte?
	
	Response:
	
	This is ANSI-specified behavior. Below is section 3.3.7 from the ANSI
	specifications, which details the semantics of the shift operator:
	
	   Semantics
	      The integral promotions are performed on each of the operands.
	      The type of the result is that of the promoted left operand. If
	      the value of the right operand is negative or is greater than or
	      equal to the width in bits of the promoted left operand, the
	      behavior is undefined.
	
	This means that chars are promoted to integers by default. If you
	really want a char result, you must cast the final result.
	
	The ANSI-specified semantics of all operators specify promotion from
	char to int, so the size of any char expression will be the sizeof
	int. This was also the case for Kernighan and Ritchie (K & R) C.
	
	The sizes of the int and long expressions stay the same because no
	promotion takes place.
	
	Note that if int is the same size as long rather than short in this
	implementation, the sizeof both a short expression and a char
	expression will be 4, as will be the sizeof both an int and a long
	expression.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	void main(void)
	{
	   short si;
	   long li;
	   char sc;
	   unsigned char uc;
	
	   printf("Signed char width: %d\n",
	           sizeof((char)(sc<<1));           // 1 byte
	
	   printf("Signed char width: %d\n",
	           sizeof(sc<<1));                 // 2 bytes
	
	   printf("Unsigned char width: %d\n",
	           sizeof((unsigned char)uc<<1));  // 1 byte
	
	   printf("Unsigned char width: %d\n",
	           sizeof(uc<<1));                 // 2 bytes
	
	   printf("Short width: %d\n",
	           sizeof(si<<1));                 // 2 bytes
	
	   printf("Long width: %d\n",
	           sizeof(li<<1));                 // 4 bytes
	}
