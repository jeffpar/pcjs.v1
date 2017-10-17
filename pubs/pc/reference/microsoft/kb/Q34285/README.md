---
layout: page
title: "Q34285: CLEAR Can Cause READ/DATA &quot;Syntax Error&quot; in Non-Stand Alone"
permalink: /pubs/pc/reference/microsoft/kb/Q34285/
---

## Q34285: CLEAR Can Cause READ/DATA &quot;Syntax Error&quot; in Non-Stand Alone

	Article: Q34285
	Version(s): 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 11-DEC-1989
	
	A CLEAR statement will not correctly restore the DATA for a READ
	statement in a program compiled with the BRUNxx.LIB run-time library
	in QuickBASIC Version 4.00b, or in Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and MS OS/2. When run, the program will give
	a "Syntax error" message at the first READ statement.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	4.00b and in Microsoft BASIC Compiler Versions 6.00 and 6.00b
	(buglist6.00 and buglist6.00b). This problem does not occur when run
	in the QB.EXE editor environment. This problem was corrected in
	QuickBASIC Version 4.50 and in Microsoft BASIC Compiler Version 7.00
	(fixlist7.00).
	
	The following are two workarounds for the problem:
	
	1. Compile in BC.EXE Versions 4.00b or 6.00b as a stand-alone program
	   instead of with the BRUNxx.LIB run-time library.
	
	2. Insert a RESTORE statement after the CLEAR statement.
	
	If the RESTORE statement is inserted, the following program will run
	correctly. Otherwise, when compiled and run, you will receive a
	"Syntax error on line 30" error message:
	
	10 CLEAR
	   'RESTORE
	20 DATA 1, 2
	30 READ a, b
	40 PRINT a, b
	50 INPUT ; r$
	60 IF r$ <> "q" THEN GOTO 10    'Type "q" to end program.
