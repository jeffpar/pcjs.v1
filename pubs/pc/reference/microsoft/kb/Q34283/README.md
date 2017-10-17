---
layout: page
title: "Q34283: BC Hangs on a POKE with a FUNCTION Passed a Dynamic Array"
permalink: /pubs/pc/reference/microsoft/kb/Q34283/
---

## Q34283: BC Hangs on a POKE with a FUNCTION Passed a Dynamic Array

	Article: Q34283
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 11-DEC-1989
	
	BC.EXE hangs at compile time when compiling the program below. This
	program uses a POKE statement that directly invokes a FUNCTION
	procedure that is passed a dynamic-array element as an argument.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00 and buglist6.00b). This
	problem has been corrected in QuickBASIC Version 4.50 and in
	Microsoft BASIC Compiler Version 7.00 (fixlist7.00).
	
	The following are several workarounds for this problem:
	
	1. Make the array STATIC instead of DYNAMIC.
	
	2. Use a temporary variable to pass the array element to the FUNCTION
	   procedure.
	
	3. Use a temporary variable to receive the value returned from the
	   FUNCTION and POKE that temporary variable.
	
	Note that Page 201 of the "Microsoft QuickBASIC 4.0: BASIC Language
	Reference" manual gives the following related information:
	
	   "Because BASIC may rearrange arithmetic expressions for
	    greater efficiency, avoid using FUNCTION procedures that
	    change program variables in arithmetic expressions."
	
	The following code example demonstrates the problem:
	
	REM This program demonstrates the problem at compile-time in BC.EXE
	DEFINT A-Z
	DECLARE FUNCTION charOff (row)
	REM $DYNAMIC
	DIM SHARED a(4)  AS INTEGER
	' Poke a value returned by a function that is passed a dynamic
	' array element:
	POKE charOff(a(1)), 210
	END
	
	FUNCTION charOff (row)
	END FUNCTION
