---
layout: page
title: "Q39378: &quot;Formal Parameter Specification Illegal&quot; for DECLARE Variable"
permalink: /pubs/pc/reference/microsoft/kb/Q39378/
---

## Q39378: &quot;Formal Parameter Specification Illegal&quot; for DECLARE Variable

	Article: Q39378
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881208-34
	Last Modified: 21-DEC-1988
	
	The BC.EXE compiler generates a "Formal parameter specification
	illegal" error when a DECLARE statement uses a variable that is the
	same name as a FUNCTION or SUB previously declared in the program.
	The QB.EXE editor will not generate an error for the same DECLARE
	statement.
	
	In general, you should never have any variables with the same name as
	any other identifier in your programs. You should also avoid having
	any two variables or identifiers that only differ by the data type
	specifier. For example A$ and A% are poor choices for variable names
	in the same program.
	
	This information applies to Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50, and to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2.
	
	The DECLARE statement is only used as a prototype for checking the
	number and types of the arguments used to invoke the procedures, and
	it affects the entire module. The type of the variables can be
	INTEGER, LONG, SINGLE, DOUBLE, STRING, or a user-defined type.
	Fixed-length strings (STRING*n) cannot be used in a DECLARE statement,
	because only variable-length strings can be passed to SUB and FUNCTION
	procedures.
	
	More information about the DECLARE statement can be found in the
	"Microsoft QuickBASIC: BASIC Language Reference" manual (on pages
	139-146 for QuickBASIC Versions 4.00 and 4.00b; pages 55-56, 271, 299,
	and 332- 333 for QuickBASIC Version 4.50; and pages 139-146 for BASIC
	Compiler Versions 6.00, and 6.00b).
	
	The following is a code example:
	
	DECLARE FUNCTION test% (Num%)
	DECLARE SUB ShowTest (test%)   ' This will generate an error
	A = test%(10)
	ShowTest (A)
	END
	
	SUB ShowTest (Var%)
	    PRINT Var%
	END SUB
	
	FUNCTION test% (Num%)
	    test% = Num%
	END FUNCTION
	
	The following error is generated for the above program:
	
	Microsoft (R) QuickBASIC Compiler Version 4.50
	(C) Copyright Microsoft Corporation 1982-1988.
	All rights reserved.
	Simultaneously published in the U.S. and Canada.
	 0030   0006    DECLARE SUB ShowTest (test%)
	                                      ^ Formal parameter
	                                        specification illegal
	
	43869 Bytes Available
	43355 Bytes Free
	
	    0 Warning Error(s)
	    1 Severe  Error(s)
