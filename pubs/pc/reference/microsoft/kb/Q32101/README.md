---
layout: page
title: "Q32101: No Error QB.EXE If DYNAMIC Array Wrongly DIMmed Before COMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q32101/
---

## Q32101: No Error QB.EXE If DYNAMIC Array Wrongly DIMmed Before COMMON

	Article: Q32101
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	The QB.EXE Versions 4.00 and 4.00b environments fail to generate an
	error if a DYNAMIC array is DIMensioned before it appears in a COMMON
	statement. For dynamic arrays, a DIM statement allocates memory for
	the array at run time, and is considered to be an "executable"
	statement.
	
	(Note: A STATIC array is required to be DIMensioned before it appears
	in a COMMON statement. For static arrays, a DIM statement is a
	"nonexecutable," as defined in Page 10 of the "Microsoft QuickBASIC
	4.0: BASIC Language Reference." This is a difference between static
	and dynamic arrays.)
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the version of QuickBASIC provided with the
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (buglist6.00, buglist6.00b). This problem has been corrected in
	QuickBASIC Version 4.50 and in the QBX.EXE of the Microsoft BASIC
	Compiler Version 7.00 (fixlist7.00).
	
	BC.EXE Versions 4.00, 4.00b, and 4.50 (and QB.EXE 4.50) correctly trap
	the error at compile time and display the following message:
	
	   COMMON and DECLARE must precede executable statements
	
	The following statement is from Page 117 of the "Microsoft QuickBASIC
	4.0: BASIC Language Reference" manual and refers to $DYNAMIC arrays
	that are also in COMMON:
	
	   A dynamic array must be dimensioned in a later DIM or REDIM
	   statement.
	
	QuickBASIC Versions 2.00 and 3.00 correctly generate a "COMMON Out of
	Order" error inside the QB.EXE environment for the following example:
	
	REM This program runs correctly in the QB.EXE 4.00 environment, but
	REM it should not. [Please remember that BASIC modules linked with
	REM Microsoft FORTRAN modules must use STATIC arrays, not DYNAMIC.]
	
	' $DYNAMIC
	DIM x%(2048)
	COMMON SHARED /xxx/ x%()
	END
