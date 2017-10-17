---
layout: page
title: "Q69333: How to Work Around Floating-Point Accuracy/Comparison Problems"
permalink: /pubs/pc/reference/microsoft/kb/Q69333/
---

## Q69333: How to Work Around Floating-Point Accuracy/Comparison Problems

	Article: Q69333
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 14-FEB-1991
	
	To reliably test whether two floating-point variables or expressions
	are equal (using IEEE format or MBF), you must subtract the two
	variables being compared and test whether their difference is less
	than a value chosen at the limits of significance for single or double
	precision. NO OTHER TEST FOR EQUALITY WILL BE RELIABLE. The following
	formulas reliably test whether X and Y are equal:
	
	1. For single precision, you must test whether the difference of X and Y
	   is less than the value 7 significant digits smaller than X or Y.
	   Divide X or Y by 10^7 to find the comparison value. For example:
	
	      IF ABS(X! - Y!) <= (X! / 10^7) THEN PRINT "Equal within 7 digits"
	
	2. For double precision, you must test whether the difference of X and Y
	   is less than the value 15 significant digits smaller than X or Y.
	   Divide X or Y by 10^15 to find the comparison value. For example:
	
	      IF ABS(X# - Y#) <= (X# / 10^15) THEN PRINT "Equal within 15 digits"
	
	The IEEE floating-point format is found in Microsoft QuickBASIC
	versions 3.00 (QB87.EXE coprocessor version only), 4.00, 4.00b, and
	4.50 for MS-DOS; in Microsoft BASIC Compiler versions 6.00 and 6.00b
	for MS-DOS and MS OS/2; and in Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	MBF (Microsoft Binary Format) is found in Microsoft QuickBASIC
	versions 3.00 (QB.EXE non-coprocessor version only), 2.01, 2.00, 1.01,
	and 1.00 for MS-DOS; and in Microsoft GW-BASIC Interpreter versions
	3.20, 3.22, and 3.23 for MS-DOS.
	
	   NOTE: Significant digits in a calculated number can be lost due to
	   the following: multiple calculations, especially addition of
	   numbers far apart in value, or subtraction of numbers similar in
	   value. When a number results from multiple calculations, you may
	   need to change your test for equality to use fewer significant
	   digits to reflect the mathematical loss of significant digits. If
	   your test of significance uses too many significant digits, you may
	   fail to discover that numbers compared for equality are actually
	   equal within the possible limit of accuracy.
	
	In the above BASIC versions that use IEEE floating-point format,
	intermediate calculations are performed in an internal 64-bit
	temporary register, which has more bits of accuracy than are stored in
	single- or double-precision variables. This often results in an IF
	statement saying that the intermediate calculation is not equal to the
	expression being compared, as in the following example:
	
	   X = 25
	   Y = 60.1
	   IF 1502.5 = (X * Y) THEN PRINT "equal"
	
	Running the above code will NOT print "equal". In contrast, the
	following method using a placeholder variable will print "equal", but
	is still NOT a reliable technique as a test for equality:
	
	   Z = 25 * 60.1
	   IF 1502.5 = Z THEN PRINT "equal"
	
	Note that explicit numeric type casts (! for single precision, # for
	double precision) will affect the precision in which calculations are
	stored and printed. Whichever type casting you perform, you may still
	see unexpected rounding results:
	
	   PRINT 69.82! + 1    'single precision, prints 70.82
	   PRINT 69.82# + 1    'double precision, prints 70.81999999999999
	
	For an exact decimal (base 10) numeric representation, such as for
	calculations of dollars and cents, you should use the CURRENCY (@)
	data type found in BASIC PDS 7.00/7.10. The CURRENCY data type exactly
	stores up to 19 digits, with 4 digits after the decimal place.
	
	Reference:
	
	Both the IEEE and MBF standards attempt to balance accuracy and
	precision with numeric range and speed. Accuracy measures how many
	significant bits of precision are not lost in calculations. Precision
	refers to the number of bits in the mantissa, which determines how
	many decimal digits can be represented.
	
	Both IEEE format and MBF store numbers of the form 1.x to the power of
	y (where x and y are base 2 numbers; x is the mantissa, and y is the
	exponent).
	
	MBF single precision has 24 bits of mantissa, and double precision has
	56 bits of mantissa. All MBF calculations are performed within just 24
	or 56 bits.
	
	IEEE single precision has 24 bits of mantissa, and double precision
	has 53 bits of mantissa. However, all single and double precision IEEE
	calculations in QuickBASIC 3.00/4.x, BASIC Compiler 6.00/6.00b, and
	BASIC PDS 7.00/7.10 are performed in a 64-bit temporary register for
	great accuracy. As a result, IEEE calculations are more accurate than
	MBF calculations, despite MBF's ability to represent more bits in
	double precision.
	
	Most numbers in decimal (base 10) notation do NOT have an exact
	representation in the binary (base 2) floating-point storage format
	used in single- and double-precision data types. Both IEEE format and
	MBF cannot exactly represent (and must round off) all numbers that are
	not of the form 1.x to the power of y (where x and y are base 2
	numbers). The numbers that can be exactly represented are spread out
	over a very wide range. A high density of representable numbers is
	near 1.0 and -1.0, but fewer and fewer representable numbers occur as
	the numbers go towards 0 or infinity.
	
	The above limitations often cause BASIC to return floating-point
	results different than you might expect, as explained in many separate
	articles found with the following query:
	
	   floating and point and format and QuickBASIC
