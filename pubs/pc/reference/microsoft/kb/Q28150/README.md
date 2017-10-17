---
layout: page
title: "Q28150: RND and RANDOMIZE Alternatives for Generating Random Numbers"
permalink: /pubs/pc/reference/microsoft/kb/Q28150/
---

## Q28150: RND and RANDOMIZE Alternatives for Generating Random Numbers

	Article: Q28150
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_BasicInt B_GWBasicI B_MQuickB
	Last Modified: 26-JUN-1989
	
	If you would like a substitute for RND and RANDOMIZE, you can use your
	own equation to generate random numbers as shown below.
	
	Microsoft BASIC offers the RND function to return random
	single-precision numbers between 0.000000 and 1.000000. The RANDOMIZE
	statement can be used to reseed (or initially start) a given sequence
	returned by RND. Microsoft BASIC uses the linear-congruential method
	for random-number generation in the RND function.
	
	This article applies to the following products:
	
	1. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	   OS/2
	
	2. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02, 2.00, 2.01,
	   3.00, 4.00, 4.00b, and 4.50 for the IBM PC
	
	3. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23 for
	   MS-DOS
	
	4. Microsoft QuickBASIC Compiler for the Apple Macintosh
	
	5. Most other Microsoft BASIC interpreters and compilers for Apple
	   Macintosh, MS-DOS, MS OS/2, XENIX, and CP/M-80
	
	Microsoft BASIC uses the linear-congruential method for random-number
	generation in the RND function. The following is an example of the
	linear-congruential method formula, similar to that used by RND in
	Microsoft BASIC:
	
	   x1 = ( x0 * a + c ) MOD 2^24
	
	In the above example, the variables equal the following:
	
	   x1=new number
	   x0=previous number
	   a=214013
	   c=2531011
	
	(Note: the MOD operator in the formula above returns the integer
	remainder after an integer division.)
	
	The expression x1/(2^24) returns a floating-point number between 0.0
	and 1.0. Please refer to Code Examples 1 and 2 below for an
	illustration.
	
	For more random number generation algorithms, see Pages 353-364 of
	"Microsoft QuickBASIC Programmer's Toolbox," by John C. Craig,
	published by Microsoft Press (1988). Seven random number subprograms
	are documented, and a companion disk in MS-DOS format is also
	available from Microsoft Press.
	
	The programs in Craig's book are written for QuickBASIC Version 4.00
	for the IBM PC. Some programs, such as the random number programs, are
	general and can easily be modified to run in Microsoft QuickBASIC for
	the Apple Macintosh. When you run these programs, you may wish to
	reseed the random number sequence regularly (such as every few hundred
	invocations) for greater uniformity.
	
	Code Example 1
	--------------
	
	The following is an example of the linear congruential method for
	generating pseudo-random numbers:
	
	DEFDBL A-Z  ' Requires double-precision intermediate variables.
	a = 214013
	c = 2531011
	z = 2 ^ 24
	INPUT "Input any seed value: ", x0
	FOR count = 1 TO 25   ' print 25 random numbers between 0.0 and 1.0:
	  temp = x0 * a + c
	' Calculate (temp MOD z) and assign to x1:
	  temp = temp / z
	  x1 = (temp - FIX(temp)) * z
	' Print the result as value between 0.0000000 and 1.0000000:
	  result = x1 / z
	  PRINT result
	' Reseed the calculation before the next iteration:
	  x0 = x1   ' x0 and x1 range from 0 to 16777216 (2^24)
	NEXT
	
	Code Example 2
	--------------
	
	The following is the same as Example 1, except the random numbers are
	plotted to illustrate their uniform distribution:
	
	DEFDBL A-Z     ' Requires double-precision intermediate variables.
	SCREEN 2  ' Remove this SCREEN statement to work in Macintosh BASIC
	a = 214013
	c = 2531011
	z = 2 ^ 24
	INPUT "Input seed value: ", x0
	FOR count = 1 TO 5000
	  temp = x0 * a + c
	  ' Calculate (temp MOD z) and assign to x1:
	  temp = temp / z
	  x1 = (temp - FIX(temp)) * z
	  result = x1 / z  ' Result is between 0.000000 and 1.000000
	  GOSUB 100       ' Plot Result
	  x0 = x1   ' x0 and x1 range from 0 to 16777216 (2^24)
	NEXT
	END
	' Plot the random points to see their uniform distribution:
	100 y = y + 1
	    IF y > 200 THEN y = 0   ' Wrap plot at y=200 pixels.
	    x = result * 500   ' Assumes screen mode <= 500 pixels wide.
	    PSET (x, y)   ' PSET requires a graphics screen mode.
	    RETURN
