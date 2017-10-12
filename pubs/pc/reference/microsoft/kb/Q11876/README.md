---
layout: page
title: "Q11876: C 5.00/5.10 Give "Constant Too Large" with Decimal Initializer"
permalink: /pubs/pc/reference/microsoft/kb/Q11876/
---

	Article: Q11876
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	Problem:
	
	When I attempt to use the most negative long integer, my results
	depend on whether I used decimal or hexadecimal to enter the value.
	The results also seem to vary between C version 5.00 and the newer
	compilers.
	
	For example, the following program produces the compiler warning
	"constant too big" when compiled with C 5.00:
	
	long d1, d2;
	
	void main(void)
	{
	    long  d1 = -2147483648L;
	    long  d2 =  0x80000000;
	    printf("d1 = %ld", d1);
	    printf("d2 = %ld", d2);
	}
	
	The compiler assigns the value -2147483647 to d1, although it assigns
	-2147483648 to d2. The internal representation of d1 seems incorrect.
	
	Response:
	
	In C versions 5.00 and earlier, the decimal constant -2147483648L is
	treated semantically as a unary minus sign applied to a positive
	constant, 2147483648L. The positive constant is outside the valid
	range for constants, and therefore, is reduced to the maximum positive
	long integer; thus, the message "constant too large" is issued.
	
	On the other hand, the hexadecimal constant 0x80000000 is treated
	semantically as a series of bits. It has few enough bits to fit into a
	long integer, so no message is issued. Had the constant contained too
	many bits to fit into a long integer, it too would have been reduced
	to 2^31 - 1.
	
	C version 5.10 does not complete compilation in this situation and
	halts with the error, "C2177: constant too large." This ensures that
	you will not be using an unexpected value.
	
	Beginning with C version 6.00, long constants can be initialized to
	decimal values larger than MAX_LONG (as per the ANSI draft standard),
	so this is no longer a problem at compilation time.
