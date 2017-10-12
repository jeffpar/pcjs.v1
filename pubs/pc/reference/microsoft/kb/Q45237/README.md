---
layout: page
title: "Q45237: Unsigned Characters and Arithmetic Operators"
permalink: /pubs/pc/reference/microsoft/kb/Q45237/
---

	Article: Q45237
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 13-SEP-1989
	
	Question:
	
	In the sample program below, I compare two unsigned character
	variables.  The conditional always evaluates to true, even when x and
	y are complements. When I examine the assembly code produced, it
	appears as though the compiler is generating code to compare two
	unsigned integers, not unsigned characters. Is this a bug?
	
	Sample Program
	--------------
	
	#include <stdio.h>
	void main (void)
	{
	   unsigned char x, y;
	   x = 0;
	   y = 255;
	
	   if (x != (~y))
	       printf ("y is not a complement of x\n");
	   else
	       printf ("y is a complement of x\n");
	}
	
	Response:
	
	The code generated in this case is correct. The Microsoft C language
	reference guide clearly states that operands of unsigned character
	type are promoted to unsigned integer type when using arithmetic
	operators. Refer to Point 5, Page 116, in the "Microsoft C for the
	MS-DOS Operating System: Language Reference."
	
	For this sample code to work as you intended, cast the "~y" as
	unsigned character, as follows:
	
	   if (x != (unsigned char)(~y))
	       printf ("y is not a complement of x\n");
	   else
	       printf ("y is a complement of x\n");
