---
layout: page
title: "Q34610: WRITE# Statement Works with Semicolon Despite BC.EXE Error"
permalink: /pubs/pc/reference/microsoft/kb/Q34610/
---

## Q34610: WRITE# Statement Works with Semicolon Despite BC.EXE Error

	Article: Q34610
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	Microsoft does not recommend linking object modules that produced one
	or more severe error messages at compile time. The behavior of such
	programs cannot be guaranteed to work in future product versions, or
	even to work at all.
	
	An example is shown below for the case of improperly using a WRITE#
	statement with a trailing semicolon with the intent to suppress a
	carriage return. PRINT# is intended for this purpose, not WRITE#.
	
	This information applies to QuickBASIC Versions 4.00 4.00b and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	According to Page 455 of the "Microsoft QuickBASIC 4.0: BASIC Language
	Reference" manual for QuickBASIC Versions 4.00 and 4.00b, the WRITE#
	statement should not allow a semicolon at the end of its arguments.
	QB.EXE correctly displays an "Expected:Expression" error message on
	the WRITE# statement at run time. A "Syntax Error" is correctly
	produced when the BC.EXE compiler tries to compile the following
	program, which has a semicolon at the end of a WRITE statement:
	
	open "data" for output as #1
	write #1, str$(5);    ' This line is not allowed to have a ";"
	write #1, str$(5)
	close #1
	
	Despite the "severe" error message at compile time, BC.EXE produces an
	object module that can be linked into an executable program. This
	program executes as you might expect a WRITE# with a semicolon at the
	end to work (i.e., no carriage return or linefeed). However, this
	behavior cannot be guaranteed for future versions.
	
	Note that the PRINT# statement can be used in place of the WRITE#
	statement if you wish to use a trailing semicolon to suppress the
	carriage return, as shown in the following program:
	
	open "data" for output as #1
	PRINT#1, CHR$(34) + STR$(5) + CHR$(34) + ", ";    'This is allowed.
	write #1, str$(5)
	close #1
	
	The WRITE# statement delimits output arguments with commas, and also
	places double quotation marks around string arguments.
