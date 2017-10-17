---
layout: page
title: "Q46069: Function to Round Floating Point to Specified Decimal Places"
permalink: /pubs/pc/reference/microsoft/kb/Q46069/
---

## Q46069: Function to Round Floating Point to Specified Decimal Places

	Article: Q46069
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890620-96 B_BasicCom B_MQuickB B_GWBasicI B_BasicInt
	Last Modified: 10-AUG-1990
	
	There is no function built into BASIC to round a floating-point
	variable to a specified number of decimal places and store the new
	value in a floating-point variable.
	
	Below are two examples of functions that round the value stored in the
	variable through the use of integer rounding and reassignment to
	floating point. Note that the number of digits accepted by these
	functions is limited by the integer (or long integer) format.
	
	Please also note that many floating-point decimal-notation numbers
	cannot be represented exactly in the binary format used for internal
	storage (IEEE or MBF, depending upon the BASIC version), and you may
	notice a variation from the expected result at the limits of single or
	double precision. For example, where you expect 2.0, BASIC might PRINT
	1.9999999, even after using the rounding function code examples
	provided below.
	
	The following numeric formats store numbers exactly: Decimal math
	packages (BCD), and CURRENCY, INTEGER, and LONG integer data types.
	
	Alternative Methods for Rounding Floating-Point Variables
	---------------------------------------------------------
	
	Note that BASIC's PRINT USING statement rounds displayed values to any
	decimal place, but does not change the actual value stored in the
	variable. Also, the PRINT #n USING statement can output rounded values
	as ASCII strings to a disk file, but can't change the values stored in
	the floating-point variable.
	
	For great accuracy in financial calculations (or other calculations
	that require a fixed number of decimal places), Microsoft recommends
	using the CURRENCY data type introduced in BASIC PDS 7.00 and 7.10.
	The CURRENCY data type is very fast and gives decimal math accurate to
	19 digits, with four digits to the right of the decimal point.
	
	You may also use LONG integers (stored in number of cents) so that all
	calculations are performed using whole numbers. LONG integers are
	supported in QuickBASIC versions 4.00, 4.00b, and 4.50 for MS-DOS, in
	Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS
	OS/2, in Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS and MS OS/2, and in QuickBASIC
	version 1.00 for Apple Macintosh. (Note that in the Macintosh versions
	of BASIC and QuickBASIC, Microsoft recommends the decimal math (d)
	version rather than the binary math (b) version for the best accuracy
	for floating-point numbers.)
	
	Another alternative is to store and manipulate floating-point numbers
	entirely as ASCII strings stored in string variables, but this is a
	low-speed alternative.
	
	As another alternative, BASIC PDS 7.00 and 7.10 introduce the add-on
	library FORMATx$ functions (FormatI$, FormatL$, FormatS$, FormatD$,
	FormatC$), which take a number and return a formatted string.
	
	Code Example 1
	--------------
	
	The Round# FUNCTION below is designed for QuickBASIC versions 4.00,
	4.00b, and 4.50 for MS-DOS, BASIC compiler versions 6.00 and 6.00b for
	MS-DOS and OS/2, and BASIC PDS versions 7.00 and 7.10 for MS-DOS and
	MS OS/2. (You can convert this FUNCTION procedure to a SUBprogram
	procedure for use in QuickBASIC for Macintosh, which doesn't support
	the FUNCTION statement but does support LONG integers.)
	
	This FUNCTION rounds to the specified significant digits. For example,
	the program below rounds "3.12345" to 4 decimals as "3.1235":
	
	   DECLARE FUNCTION Round# (x#, n%)
	   PRINT Round#(3.12345#, 4)
	   '
	   ' Round# rounds x# to n% decimal places.
	   ' Single or Double can be passed.
	   '
	   ' WARNING: This FUNCTION is limited by the shifted number
	   '          x# * (10^n%)  <  2,147,483,647 (maximum LONG)
	   '
	   FUNCTION Round# (x#, n%)
	     temp&  = x# * (10 ^ (n%))     'Shift the number; store in LONG
	     Round# = temp& / (10 ^ (n%))  'Shift number back
	   END FUNCTION
	
	Code Example 2
	--------------
	
	A similar DEF FN function is as follows for other BASICs that do not
	support LONG integers or FUNCTION procedures:
	
	   10 DEF FNRound(x!,n%) = (CINT(x! * (10^n%))) / (10^n%)
	   20 x! = 3.4567
	   30 n% = 3
	   40 PRINT FNRound(x!, n%)  ' Prints 3.457
	
	Warning: This function is limited by the following shifted number:
	
	   x! * (10^n%) < 32767 (maximum short integer)
	
	This DEF FN function can be used in the following products:
	
	1. Microsoft GW-BASIC Interpreter versions 3.20, 3.22, and 3.23 for
	   MS-DOS
	
	2. Microsoft QuickBASIC Compiler versions 1.00, 1.01, 1.02, 2.00,
	   2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS
	
	3. Microsoft BASIC Compiler versions 5.35 and 5.36 for MS-DOS
	
	4. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS
	   OS/2
	
	5. Microsoft BASIC PDS versions 7.00 and 7.10 for MS-DOS and MS OS/2
	
	6. Microsoft QuickBASIC version 1.00 for Apple Macintosh
	
	7. Microsoft BASIC Compiler version 1.00 for Apple Macintosh
	
	8. Microsoft BASIC Interpreter versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for Apple Macintosh
