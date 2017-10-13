---
layout: page
title: "Q37624: Using a Logical AND Operation &amp;&amp; and OR Operation &#124;&#124;"
permalink: /pubs/pc/reference/microsoft/kb/Q37624/
---

	Article: Q37624
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 16-NOV-1988
	
	Question:
	
	Why does the statement for the integers a, b, c, and d result in
	values of 1 for a, 2 for b, but 0 for c and d in the following
	example?
	
	   a = (b = 2) || (c = 3) && (d = 4)
	
	I thought that the logical AND operation && would be performed before
	the logical OR operation ||, so that c and d would be assigned 3 and
	4. The "Microsoft C 5.1 Optimizing Compiler Reference," Page 137
	states "Expressions with higher-precedence operators are evaluated
	first."
	
	Response:
	
	While it's true that logical AND has a higher precedence than logical
	OR, precedence in C means how operands are grouped, not necessarily
	the order in which they are evaluated. The documentation is incorrect
	on this point.
	
	The following
	
	   lvalue = operand1 || operand2 && operand3;
	
	will be grouped as follows:
	
	   lvalue = operand1 || (operand2 && operand3);
	
	However, this does not mean (operand2 && operand3) will be evaluated
	first in the above statement. In fact, this statement is a logical OR
	expression with two operands: operand1 and (operand2 && aoperand3).
	Operands are defined as an entity on which an operator acts; in this
	case the logical OR operator || acts on operand1 and (operand2 &&
	operand3). Logical OR expressions are evaluated in left-to-right
	order, so operand1 will be evaluated first.
	
	As noted in the proposed ANSI C standard, section 3.3.14 of both the
	November 1987 and May 1988 drafts for the logical OR operator, "If the
	first operand compares unequal to 0, the second operand is not
	evaluated." In this case, if operand1 != 0, (operand2 && operand3)
	will not be evaluated. This is the behavior of both the C Version 5.10
	and QuickC Version 1.01 compilers. This behavior has been a feature
	of C since the original K & R, and is so handy that many modern
	Pascal compilers now provide this functionality.
	
	The following example demonstrates this behavior:
	
	#include <stdio.h>
	int a,b,c,d;
	main() {
	    a = (b = 2) || (c = 3) && (d = 4);
	    printf("a = %d, b = %d, c = %d, d = %d\n",a,b,c,d);
	    }
	
	The following is an example of output resulting from a program
	
	   a = 1, b = 2, c = 0, d = 0
	
	Because (b = 2) is not 0, no further evaluations are performed, and c
	and d are not assigned 3 and 4. If the intent is to assign values to
	variables, then separate assignment statements should be made.
	
	As noted in "The C Programming Language", second edition by Kernighan
	and Ritchie, Page 54, "The moral is that writing code that depends on
	the order of evaluation is a bad programming practice in any
	language."
