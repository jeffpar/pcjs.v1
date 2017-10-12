---
layout: page
title: "Q31510: Bitwise Complement Operator Appears to Fail on Comparison"
permalink: /pubs/pc/reference/microsoft/kb/Q31510/
---

	Article: Q31510
	Product: Microsoft C
	Version(s): 4.00 5.10 5.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 16-JUN-1988
	
	The bitwise complement operator (~) may appear to work incorrectly
	when used to compare unsigned characters, as illustrated in the
	following example.
	   However, when using the bitwise complement operator, it is
	important to note that it will perform the "usual arithmetic
	conversions" on operands. The usual arithmetic conversions are
	described in detail in Section 5.3.1 of "The Microsoft C Language
	Reference Guide."
	
	   The following program prints out as "failed" even though it
	appears that the two items should compare as "equal":
	
	#include <stdio.h>
	main()
	{
	 unsigned char i,j;
	 unsigned char k = 4;
	 i = k;
	 j = ~i;
	
	  if (j == ~i)
	    printf("passed\n");
	  else
	    printf("failed\n");
	
	}
	
	   The compiler takes the steps below to evaluate the following
	statement:
	
	   if (j == ~i)
	
	   1. The compiler converts the operand "i" to an unsigned integer (in
	the C manual, see step 5 of the usual arithmetic conversions).
	   2. The compiler complements the bits of this unsigned integer (the
	high byte becomes 0xFF).
	   3. The compiler converts the operand "j" to an unsigned integer
	(the high byte becomes 0x00).
	   4. The compiler compares the two operands.
	
	   Since the high bytes of the two operands differ, the comparison
	will fail.
	   To ensure that the compiler will compare only the low bytes of the
	two operands, cast the operand that is being complemented. For
	example, you can change the comparison to the following:
	
	 if (j == ~(unsigned char)i)
