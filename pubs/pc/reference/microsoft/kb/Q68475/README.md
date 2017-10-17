---
layout: page
title: "Q68475: &quot;C2118: Negative Subscript&quot; May Be Caused by int Expression"
permalink: /pubs/pc/reference/microsoft/kb/Q68475/
---

## Q68475: &quot;C2118: Negative Subscript&quot; May Be Caused by int Expression

	Article: Q68475
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 1-FEB-1991
	
	The compiler error "C2118: negative subscript" may be caused by an
	integer expression in the subscript of an array. If the expression
	evaluates to greater than 32768, its value becomes negative, thus
	causing the aforementioned error.
	
	To work around this situation, add an uppercase (or lowercase) "L" to
	one of the terms of the expression. This will force the compiler to
	use long math to evaluate the expression.
	
	Sample Code
	-----------
	
	   #include <stdio.h>
	   char foo[1000 * 33];
	
	If the above two-line program is compiled, the following error is
	generated:
	
	   file.c(2) : error C2118: negative subscript
	
	To eliminate the error, add "L" to one of the terms to indicate it is
	a long constant. For example,
	
	   #include <stdio.h>
	   char foo[1000L * 33];
	
	This is correct and expected behavior for the Microsoft C Compiler
	because the evaluation of integer expressions is done using integer
	math. In this case, integer math produces an incorrect result because
	the value of the expression is larger than an integer. By using a long
	integer as one of the operands, you can force the expression to be
	evaluated using long math, which does not overflow in this case.
