---
layout: page
title: "Q31511: Variable Passed to Dynamic SUB Changes after Integer Division"
permalink: /pubs/pc/reference/microsoft/kb/Q31511/
---

## Q31511: Variable Passed to Dynamic SUB Changes after Integer Division

	Article: Q31511
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 8-DEC-1989
	
	When run from a compiled .EXE program, the dynamic subprogram below
	prints an incorrect value for a passed parameter after an unrelated
	integer division. The program runs correctly in the QB.EXE editor.
	
	Compiling the program with the BC /D (debug) option or the BC /O
	option does not correct the problem.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50 and in the Microsoft BASIC
	Compiler Version 7.00 (fixlist7.00).
	
	The following is a code example of the subprogram:
	
	DECLARE SUB box (x!, y!)
	
	REM $DYNAMIC
	CLS
	CALL box(50!, 2!)
	
	REM $STATIC
	SUB box (x!, y!)
	  PRINT "x! = "; x!
	  lf = (70 - x!) \ 2
	  dn = (20 - y!) \ 2
	  PRINT "x! = "; x!  ' This line prints incorrect value from .EXE program.
	END SUB
