---
layout: page
title: "Q41388: .EXE Compiled BC /S May Not Print String in PRINT TAB(n),A&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q41388/
---

## Q41388: .EXE Compiled BC /S May Not Print String in PRINT TAB(n),A&#36;

	Article: Q41388
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881230-49 B_BasicCom
	Last Modified: 14-DEC-1989
	
	Creating an executable .EXE program with QuickBASIC Version 4.50 with
	the BC /S compiler option may cause the following statement to print a
	blank line:
	
	   PRINT TAB(n); A$
	
	The program works correctly from inside the QuickBASIC editor, or when
	compiled without the /S option.
	
	The /S option is used to minimize string data at compile time by
	writing quoted strings to the object file instead of the symbol table.
	The only use for the /S option is to help the compiler handle large
	programs at compile time. Normally, /S does not affect the size or
	behavior of the object code.
	
	This problem can be corrected by doing the following:
	
	1. Not using the /S compiler option.
	
	2. Replacing the PRINT TAB(nn) with a PRINT SPACE$(nn) statement.
	
	3. Compiling with the /X switch, which is normally used to indicate
	   the presence of ON ERROR with RESUME, RESUME NEXT, or RESUME 0.
	
	This problem occurs only in QuickBASIC Version 4.50; it does not occur
	in earlier versions of QuickBASIC, Microsoft BASIC Compiler 6.00 or
	6.00b, or Microsoft BASIC PDS Version 7.00.
	
	Code Examples
	-------------
	
	REM  ** SAMPLE PROGRAM 1 ** DOES NOT WORK CORRECTLY **
	
	A$ = "THIS SHOULD BE PRINTED"
	PRINT TAB(40 - LEN(A$) / 2); A$
	END
	
	REM  ** SAMPLE PROGRAM 2 ** WORKS FINE **
	
	A$ = "THIS SHOULD BE PRINTED"
	PRINT SPACE$(39 - LEN(A$) / 2); A$
	END
