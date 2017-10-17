---
layout: page
title: "Q57866: BASIC PDS 7.00 Supports Short-Circuit Boolean Expressions"
permalink: /pubs/pc/reference/microsoft/kb/Q57866/
---

## Q57866: BASIC PDS 7.00 Supports Short-Circuit Boolean Expressions

	Article: Q57866
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | B_QuickBas SR# S890703-44
	Last Modified: 20-JAN-1990
	
	Microsoft BASIC Professional Development System (PDS) Version 7.00
	supports "short-circuit" optimization of Boolean expressions, as
	described below. To take advantage of this speed optimization in
	complex IF, WHILE, DO LOOP WHILE, or DO LOOP UNTIL statements, the
	quickest Boolean conditions should appear first.
	
	Microsoft QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	4.00, 4.00b, and 4.50 and Microsoft BASIC Compiler Versions 6.00 and
	6.00b DON'T support short-circuit Boolean expressions.
	
	Boolean expressions are those expressions in BASIC that evaluate to
	true or false. In BASIC, the IF, WHILE, and DO LOOP {WHILE | UNTIL}
	statements all require Boolean expressions as part of their syntax.
	
	A "short-circuit" Boolean expression is a unique kind of Boolean
	expression. If a Boolean expression consists of more than one part,
	not all the parts may be evaluated. The evaluation of the expression
	may stop, or "short circuit," partway through. Consider the following
	two-part Boolean expression:
	
	   IF <condition1> AND <condition2> THEN
	
	If <condition1> evaluates to false, it isn't necessary to evaluate
	<condition2>, because "false" AND "anything else" is still false.
	Therefore, we can short circuit the expression and not evaluate
	<condition2>.
	
	The same rule applies to the following expression:
	
	   IF <condition1> OR <condition2> THEN
	
	If <condition1> is true, we do not need to evaluate <condition2>
	because "true" OR "anything else" always evaluates to true.
	
	Short-circuit Boolean expressions are desirable for two reasons.
	First, they allow you to optimize code by evaluating only as much of
	the Boolean expression as necessary. This can generate faster, more
	efficient code. In the examples above, if <condition2> were very
	complex, a short-circuit Boolean might speed up program execution by
	evaluating the whole expression only when absolutely necessary.
	Second, short-circuit Booleans can be used to prevent error
	conditions. In the code example below, BASIC PDS 7.00 prevents the
	"Division by zero" error in .EXE programs since it supports
	short-circuit Booleans. QBX.EXE programs in BASIC 7.00, and QB.EXE and
	.EXE programs in QuickBASIC 4.00, 4.00b, and 4.50, give the "Division by
	zero" error.
	
	BASIC 7.00 will short circuit IF expressions as long as doing so does
	not change the semantics of the statement. The following is an
	example:
	
	   IF (a% < b%) OR (c! < d!) THEN PRINT
	
	The compiler compares a% and b%. If a% is less than b%, the compiler
	skips the floating-point comparison. On the other hand, consider the
	following statements:
	
	   DECLARE FUNCTION Foo! (p!)
	   IF (a% < b%) OR (c! < Foo!(d!)) THEN PRINT
	
	The compiler avoids the floating-point comparison when a% is less
	than b%, but it still calls the function Foo. This is because existing
	programs may rely on the side effects of the function Foo.
	
	This feature affects the best way to write code in BASIC PDS 7.00.
	Specifically, in complex IF, WHILE, DO LOOP WHILE, or DO LOOP UNTIL
	conditions, the quickest conditions should appear first.
	
	Code Example
	------------
	
	The following program determines if a compiler supports short-circuit
	Boolean optimization for an IF statement. Since it supports
	short-circuit Booleans, BASIC PDS Version 7.00 prevents the "Division
	by zero" error in the .EXE program. QBX.EXE programs in BASIC 7.00,
	and QB.EXE and .EXE programs in QuickBASIC 4.00, 4.00b, and 4.50, give
	the "Division by zero" error.
	
	DEFINT A-Z
	ON ERROR GOTO errorhandle
	a = 1
	b = 1
	c = 0
	CLS
	LOCATE 10, 10
	
	' In the following IF statement, b / c is not executed if
	' short-circuit Booleans are supported because a = 1 evaluates to
	' true, and therefore, the whole expression is true. This is
	' because (true OR <anything>) evaluates to true.
	
	IF (a = 1 OR ((b / c) = 1)) THEN
	   ' If this PRINTs, then short-circuit Booleans are supported.
	   PRINT "This compiler supports short-circuit Booleans"
	END IF
	terminate:
	PRINT "End of program reached"
	END
	errorhandle:
	   IF ERR = 11 THEN PRINT "Division by zero, Error="; ERR
	   LOCATE 11, 10
	   PRINT "This compiler does not support short-circuit Booleans"
	   RESUME terminate     ' End the program.
