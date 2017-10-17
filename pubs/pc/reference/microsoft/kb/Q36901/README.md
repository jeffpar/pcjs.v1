---
layout: page
title: "Q36901: Numerical Calculations and Loops Are Faster with Integers"
permalink: /pubs/pc/reference/microsoft/kb/Q36901/
---

## Q36901: Numerical Calculations and Loops Are Faster with Integers

	Article: Q36901
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom floating point
	Last Modified: 28-DEC-1989
	
	The time needed to process numbers as floating-point numbers is
	significantly longer than with integers. Since the default data type
	is single-precision floating-point numbers, it is quite common for
	people to use a floating-point variable to represent a number that
	could be represented as an integer or long. A FOR-NEXT loop that does
	nothing takes approximately six times as long to run when the index
	variable is specified as a single-precision number rather than as an
	integer.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	In the following code example that multiplies zero by zero, the
	version that uses integer variables runs five times as fast as the
	version using floating-point variables if the computer has an 80x87
	coprocessor or 25 times as fast with no coprocessor.
	
	The results of testing with a previous version of QuickBASIC is as
	follows:
	
	The integer loop is only three times as fast under QuickBASIC Version
	3.00.
	
	The following is a code example:
	
	' The following loop uses the default data type, single precision:
	CLS
	x1 = TIMER
	FOR i = 1 TO 30000
	  j = j * j
	NEXT i
	x2 = TIMER
	' The following loop uses integer variables:
	DEFINT I-K
	FOR ii = 1 TO 30000
	   k = k * k
	NEXT
	x3 = TIMER
	PRINT "default loop ="; x2 - x1
	PRINT "integer loop  ="; x3 - x2
