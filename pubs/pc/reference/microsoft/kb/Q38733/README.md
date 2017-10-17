---
layout: page
title: "Q38733: Overflow in Integer Math Expressions Not Checked"
permalink: /pubs/pc/reference/microsoft/kb/Q38733/
---

## Q38733: Overflow in Integer Math Expressions Not Checked

	Article: Q38733
	Version(s): 4.00 5.00 5.10  | 5.10
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 12-DEC-1988
	
	The operations performed by the integer arithmetic and shift operators
	do not check for overflow or underflow conditions. Information may be
	lost if the result of an operation cannot be represented in the type of
	the operands after conversion. All expressions are evaluated prior to
	assignment to a variable.
	
	Rules for numeric conversion are described on Page 115 of the
	"Microsoft C Language Reference" manual.
	
	The following example demonstrates the overflow condition:
	
	#include <stdio.h>
	void main(void);
	void main()
	{
	long l;
	
	    l = 70 * 1000;              /* First Example            */
	    printf( "l = %ld\n", l );   /* l = 4464 = 70000 % 65536 */
	                                /* Overflow not caught!!!   */
	
	    l = 70L * 1000;             /* Second Example           */
	    printf( "l = %ld\n", l );   /* l = 70000                */
	                                /* arithmetic in long--no   */
	                                /*   overflow               */
	}
	
	In the first example, 70 and 1000 are considered as integers. Because
	both are integer types, integer math is being performed. Integers can
	have at most a value of 32,767. When 70 is multiplied to 1000, the
	product exceeds the maximum value that an integer can hold. Overflow
	is not checked and information is lost. Thus we get a value of 4464,
	which is 70,000 mod 65,536.
	
	The workaround is the second example. Conversions occur if the types
	of the operands are different. Because 70 is a long integer (32 bits.
	Without the L, it is considered a normal integer of 16 bits). Because
	a long integer is used, all operands will be converted to long and the
	math will be done using 32-bit arithmetic. The product is large enough
	to handle the multiplication, so the correct result of 70,000 is
	generated.
