---
layout: page
title: "Q69164: BASIC Uses Radians, Not Degrees, for Trigonometric Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q69164/
---

## Q69164: BASIC Uses Radians, Not Degrees, for Trigonometric Functions

	Article: Q69164
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BASICCOM B_GWBasicI B_BasicInt B_MQuickB
	Last Modified: 14-FEB-1991
	
	You must pass angle measurements in radians (not degrees) to BASIC's
	trigonometric functions (SIN, COS, and TAN).
	
	All versions of Microsoft BASIC require radians for the built-in
	trigonometric functions (SIN, COS, TAN). Therefore, the value returned
	from BASIC's SINe, COSine, and TANgent will be different than your
	calculator's value, unless your calculator is using radians.
	
	To convert degrees to radians, multiply the degrees by pi/180, where
	pi equals 3.14159265359.
	
	This information applies to the following BASIC versions:
	
	1. Microsoft QuickBASIC versions 1.00, 1.00a, and 1.00b for Apple
	   Macintosh.
	
	2. Microsoft BASIC Compiler version 1.00 for Apple Macintosh.
	
	3. Microsoft BASIC Interpreter versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for Apple Macintosh.
	
	4. Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, and 4.50 for MS-DOS.
	
	5. Microsoft BASIC Compiler versions 5.35 and 5.36 for MS-DOS.
	
	6. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and
	   MS OS/2.
	
	7. Microsoft BASIC Professional Development System (PDS) versions 7.00
	   and 7.10 for MS-DOS and MS OS/2.
	
	8. Microsoft GW-BASIC Interpreter versions 3.20, 3.22, and 3.23 for
	   MS-DOS.
	
	Code Example
	------------
	
	'Radians = degrees * PI / 180
	PI = 3.141593
	X = 45
	' The following prints .8509035, which is the SIN of 45 radians,
	' which may not be what you wanted:
	PRINT SIN(X)
	
	' Now, convert X to radians before passing to the SIN function:
	PRINT SIN(X * PI / 180)  'This gives .7071068 as the SIN of 45 degrees
