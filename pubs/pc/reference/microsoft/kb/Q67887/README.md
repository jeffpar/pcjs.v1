---
layout: page
title: "Q67887: &quot;Illegal Function Call,&quot; Negative Number to Fractional Power"
permalink: /pubs/pc/reference/microsoft/kb/Q67887/
---

## Q67887: &quot;Illegal Function Call,&quot; Negative Number to Fractional Power

	Article: Q67887
	Version(s): 1.00a 1.00b | 6.00 6.00b 7.00 7.10
	Operating System: MACINTOSH   | MS-DOS
	Flags: ENDUSER | B_QuickBas B_GWBasicI
	Last Modified: 2-JAN-1991
	
	Raising a negative number to a fractional power gives an "Illegal
	function call" in BASIC because the result will be a complex number,
	which is not supported in BASIC. (A complex number is of the form
	x+y*i where x is the real component and y is the imaginary component;
	i is the square root of -1.)
	
	Note: -5^(-Y) is not the same as X^(-Y) when X = -5 because -5^(-Y) is
	actually parsed as -(5^(-Y)). In other words, the exponentiation
	operator (^) has greater precedence than the subtraction (-) operator.
	
	This information applies to most versions of Microsoft BASIC,
	including the following:
	
	1. Microsoft QuickBASIC version 1.00 for the Apple Macintosh.
	2. Microsoft BASIC Compiler version 1.00 for the Apple Macintosh.
	3. Microsoft BASIC Interpreter versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for the Apple Macintosh.
	4. Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, 4.50 for MS-DOS.
	5. Microsoft BASIC Compiler versions 5.35 and 5.36 for MS-DOS.
	6. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS OS/2 and
	   MS-DOS.
	7. Microsoft BASIC Professional Development System (PDS) versions 7.00
	   and 7.10 for MS-DOS and MS OS/2.
	8. Microsoft GW-BASIC Interpreter versions 3.20, 3.22, 3.23 for
	   MS-DOS.
	
	The first PRINT statement below gives "Illegal function call." Many
	programmers will try debugging this code by substituting an actual
	constant for X, and the PRINT will seem to give the correct result.
	However, upon close examination of the precedence of operators, it
	will be apparent that the exponential symbol takes precedence over the
	minus sign. The expression 5^(-1/6) is parsed first and then the
	negation of this expression is performed. The third PRINT demonstrates
	what is actually happening in the first PRINT statement:
	
	X = -5
	PRINT X ^ (-1 / 6)       ' generates "Illegal function call"
	PRINT -5 ^ (-1 / 6)      ' same as PRINT -(5 ^ (-1 / 6)); no error
	PRINT (-5) ^ (-1 / 6)    ' generates "Illegal function call"
	
	To avoid the "Illegal function call" message, raise the absolute value
	(ABS) of X to the fractional power. If you do this when X is a
	negative number, please remember that you must multiply by i (the
	square root of -1) to get the true mathematical result. Because the
	square root of -1 cannot be represented in BASIC, you must keep track
	of imaginary number results yourself using a flag variable or warning
	message, for example:
	
	   X=-5
	   PRINT ABS(X) ^ (-1 / 6)
	   IF SGN(X) < 0 THEN
	      PRINT "Warning: the resulting root is an imaginary number. This"
	      PRINT "root should be multiplied by i, the square root of -1."
	   END IF
