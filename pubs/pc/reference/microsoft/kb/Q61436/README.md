---
layout: page
title: "Q61436: Problem of Testing Floating-Point Equality, IF n=VAL(&quot;n&quot;)"
permalink: /pubs/pc/reference/microsoft/kb/Q61436/
---

## Q61436: Problem of Testing Floating-Point Equality, IF n=VAL(&quot;n&quot;)

	Article: Q61436
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900416-32 B_BasicCom
	Last Modified: 14-FEB-1991
	
	A floating-point constant passed in a string to the VAL function can
	return a slightly different floating-point result compared to the same
	floating-point constant in an IF statement, resulting in an apparent
	inequality. This floating-point difference may seem like a software
	problem, but it is actually a design limitation. This behavior is
	demonstrated in the program below.
	
	To reliably test for floating-point equality (in any binary
	floating-point format, such as IEEE or Microsoft Binary Format), you
	must subtract the two floating-point numbers being compared and test
	whether their difference is less than a value at the limits of
	significance for single or double precision.
	
	The example below applies to Microsoft QuickBASIC versions 4.00,
	4.00b, and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00
	and 6.00b for MS-DOS and MS OS/2; and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	You might expect the conditions in the IF statements in the program
	below to both be true and PRINT their messages. Instead, only the
	second IF is true and PRINTs its message:
	
	   a$ = "0.1"
	   IF .1 <= VAL(a$) THEN PRINT "This is false, and does not print."
	   s = VAL(a$)   ' This time use a temporary variable s.
	   IF .1 <= s THEN PRINT "This is true and does print."
	
	There is an inequality in the first IF statement because the numeric
	constant .1 in the IF is assigned at compile time, whereas the VAL(A$)
	function is calculated at run time and different numeric storage is
	allocated internally so that a tiny difference exists between the
	numbers at the limits of single precision. In the second IF statement,
	the comparison of .1 and "s" is compiled differently than in the first
	IF, and the comparison luckily expected a "true" result. However, you
	should avoid both of the above numeric comparison techniques for
	testing the equality of floating-point numbers.
	
	Instead, to reliably test for floating-point equality (in any binary
	floating-point format), you must subtract the two floating-point
	numbers being compared and test whether their difference is less than
	a value that is about 7 significant digits smaller than the value
	being compared for single precision (in other words, divide by 10^7 to
	find the comparison value), or about 15 significant digits smaller
	than the value being compared for double precision (divide by 10^15).
	For example:
	
	A$ = ".1"
	IF .1 - VAL(A$) <= .1 / 10^7 THEN PRINT "Equal within single precision"
	
	B$ = ".1#"
	IF .1# - VAL(B$) <= .1# / 10^15 THEN PRINT "Equal within double precision"
	
	References:
	
	Note that many numbers in decimal (base 10) notation do not have an
	exact representation in the binary (base 2) floating-point storage
	format used in BASIC's SINGLE and DOUBLE precision data types. This
	often causes BASIC to return floating-point results different than you
	might expect, as explained in separate articles found with the
	following query:
	
	   floating and point and format and QuickBASIC
