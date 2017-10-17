---
layout: page
title: "Q31426: &quot;Duplicate Definition&quot; on STATIC Array in Second CALL to SUB"
permalink: /pubs/pc/reference/microsoft/kb/Q31426/
---

## Q31426: &quot;Duplicate Definition&quot; on STATIC Array in Second CALL to SUB

	Article: Q31426
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 28-DEC-1989
	
	In the following sources, the example of using the STATIC statement
	does not clearly explain what will happen with a second call to the
	SUB:
	
	1. Page 80 of the "Microsoft QuickBASIC 4.0: Programming in BASIC:
	   Selected Topics" manual for Versions 4.00 and 4.00b
	
	2. Page 70 of the "Microsoft QuickBASIC: Programming in BASIC" manual
	   for Version 4.50
	
	If SubProg2 is called more than once, the DIM statement gives you a
	"Duplicate Definition" error message. This is because in a recursive
	procedure, arrays are always dimensioned dynamically (that is, at run
	time), and making the array retain its values between calls (with the
	STATIC statement) means that the array was already dimensioned at the
	second call.
	
	The example should be changed as follows:
	
	1. Declare an additional STATIC variable as a flag.
	
	2. Put the DIM in an IF...END IF block that executes only upon first
	   call to the routine, and not on subsequent calls, as determined by
	   the flag variable.
	
	This correction also applies to the following:
	
	1. Page 80 of "Microsoft BASIC Compiler Version 6.00 for MS OS/2 and
	   MS-DOS: Programming in BASIC: Selected Topics" for the BASIC
	   compiler Versions 6.00 and 6.00b
	
	2. Page 66 of "Microsoft BASIC 7.0: Programmer's Guide" for Microsoft
	   BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	Removing the array from the STATIC statement also eliminates the
	"Duplicate Definition."
	
	The following code demonstrates how to avoid the "Duplicate
	Definition" error:
	
	DECLARE SUB dummy ()
	PRINT "call the subroutine"
	CALL dummy
	PRINT "call the routine again"
	CALL dummy
	
	SUB dummy
	STATIC a(), FirstPassFlag   ' STATIC retains values between CALLs
	' FirstPassFlag assures that array gets DIMensioned only once.
	IF FirstPassFlag = 0 THEN
	   DIM a(1)
	   FirstPassFlag = 1
	END IF
	print "continuing on"
	END SUB
