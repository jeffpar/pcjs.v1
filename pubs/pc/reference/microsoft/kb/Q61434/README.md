---
layout: page
title: "Q61434: XOR, OR, AND Convert Floating Point to Integer"
permalink: /pubs/pc/reference/microsoft/kb/Q61434/
---

## Q61434: XOR, OR, AND Convert Floating Point to Integer

	Article: Q61434
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900424-129 B_BasicCom
	Last Modified: 1-MAY-1990
	
	The BASIC bitwise operators (AND, OR, XOR, and NOT) do not operate
	directly on floating-point numbers (SINGLE ! or DOUBLE #) or string
	variables ($). They also do not operate directly on currency data type
	numbers (@) in Microsoft BASIC Professional Development System (PDS)
	version 7.00. When a bitwise operation is attempted with a
	floating-point variable that has a value greater than the maximum LONG
	integer (2,147,483,647), an "Overflow" error occurs.
	
	To properly perform a bitwise operation on a floating-point variable,
	the floating-point number must be moved into a LONG using a bitwise
	move. Two functions are listed below to move between SINGLEs and LONGs
	so that bitwise operations can be used on SINGLE floating-point
	numbers.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, and Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and Microsoft BASIC PDS version 7.00 for MS-DOS
	and MS OS/2.
	
	When a bitwise operation is attempted on a floating point or currency
	numeric type, the fractional number is converted to its INTEGER or
	LONG equivalent and the operation is then performed using INTEGERs or
	LONGs. This can cause an "Overflow" error message if the value of the
	floating-point number exceeds the maximum value of a LONG integer.
	
	Another method of performing bitwise operations on a floating-point
	number is to convert the number to a LONG, manipulate the bits, and
	then convert it back to a floating-point number. The code example
	below demonstrates moving between SINGLEs and LONGs using the MKS$,
	MKL$, CVS, and CVL functions. Converting DOUBLEs is more involved
	because they are longer than any integer type. A similar operation
	could be performed to convert DOUBLEs using two LONGs and the MKD$ and
	CVD functions as well.
	
	Code Example
	------------
	
	The following code example performs a bitwise move by using the MKS$,
	MKL$, CVS, and CVL functions using a string as an intermediary:
	
	'Module level demonstrates using functions
	s! = 1.0
	t! = 1.1
	l& = SingleToLong(s!)
	m& = SingleToLong(t!)
	n& = l& XOR m&                    'Bit AND (won't work with SINGLEs)
	PRINT HEX$(l&), HEX$(m&), HEX$(n&)'3F800000   3F8CCCCD   3F800000
	u! = LongToSingle(n&)             'Equivalent of bit AND of s! and
	                                  't!
	PRINT u!                          '1.75495E-39
	END
	
	FUNCTION SingleToLong&(s!)
	  SingleToLong& = CVL(MKS$(s!))
	END FUNCTION
	
	FUNCTION LongToSingle!(l&)
	  LongToSingle! = CVS(MKL$(l&))
	END FUNCTION
