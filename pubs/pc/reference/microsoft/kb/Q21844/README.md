---
layout: page
title: "Q21844: Integer Overflow Handling in Compiler Differs from Interpreter"
permalink: /pubs/pc/reference/microsoft/kb/Q21844/
---

## Q21844: Integer Overflow Handling in Compiler Differs from Interpreter

	Article: Q21844
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 27-DEC-1989
	
	Question:
	   Why does the compiler give negative numbers or "Overflow" errors in
	intermediate calculations involving two integers, when the same program
	works correctly in the IBM BASICA and GW-BASIC Interpreters?
	   The following program is an example of the problem:
	
	   10 FOR I%=240 TO 300
	   20 Z! = INT( 130 * I% )
	   30 PRINT I%,Z!
	   40 NEXT
	
	   The above program will give incorrect negative results in
	QuickBASIC Version 1.x when I% exceeds 252 and Z! exceeds 32K
	(32,767).
	   In QuickBASIC Versions 2.x and greater, you will get an "Overflow"
	error.
	   The same program will run in GW-BASIC and IBM BASICA completely
	through to I%=300 and print the correct values for Z!.
	
	Response:
	   The above program will work properly if you make the integer
	constant "130" into a single-precision constant ("130!" or "130.") or
	double-precision constant "130#" as shown in the following example:
	
	   20 Z! = INT( 130! * I% )
	
	   QuickBASIC Version 1.x should not give negative results when an
	integer overflow occurs. This problem was corrected in Version 2.x and
	later, in which you properly get an "Overflow" message.
	   The QuickBASIC compiler handles integer overflow differently than
	the GW-BASIC and IBM BASICA Interpreters handle it.
	   When the compiler compiles a mathematical expression, it has to
	decide at compile time how to most efficiently optimize the expression
	into machine language. When the compiler sees the intermediate
	calculation 130*I% in the above program, it decides to restrict it to
	integer limits at compile time because 130*I% is the product of two
	integers. Changing the intermediate expression to the product of an
	integer and a higher-precision constant or variable will prevent the
	overflow problem.
	   The interpreters are able to dynamically make the decision at
	run time to convert 130*I% to a single-precision constant to avoid
	integer overflow. The disadvantage of dynamic handling is the slower
	speed of the interpreters when compared with the compiler.
