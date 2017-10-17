---
layout: page
title: "Q32969: Problem Passing Array in COMMON Also in SUB Argument in .QLB"
permalink: /pubs/pc/reference/microsoft/kb/Q32969/
---

## Q32969: Problem Passing Array in COMMON Also in SUB Argument in .QLB

	Article: Q32969
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50
	Last Modified: 8-DEC-1989
	
	If a string array is specified in a COMMON statement and also in the
	argument list of a subprogram in a Quick library, garbage characters
	will be displayed on the screen when that array is printed from the
	subprogram. Under QuickBASIC Versions 4.00 and 4.00b, this problem
	occurs only within the QB.EXE editor; the .EXE file runs without
	encountering any problems. Under QuickBASIC Version 4.50, the problem
	occurs both in the QB.EXE and the .EXE unless the library is created
	using the debug option (/D). When the /D switch is used to build the
	library, the program works correctly.
	
	Under QuickBASIC Versions 4.00, 4.00b, and 4.50, if the subprogram is
	not part of a Quick library, the program executes correctly from
	inside the QuickBASIC editor.
	
	Microsoft has confirmed this to be a problem in the QB.EXE editor in
	Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50, and in the
	Microsoft BASIC Compiler Versions 6.00 and 6.00b (buglist6.00,
	buglist6.00b) for MS-DOS and MS OS/2. This problem has been corrected
	in the Microsoft BASIC Compiler Version 7.00 (fixlist7.00).
	
	To work around this problem, do one of the following:
	
	1. Use the /D (debug) option when creating the Quick library.
	
	2. Compile the program as an executable file to run.
	
	3. Do not use a Quick library. (A separately loaded source file can be
	   substituted in the QB.EXE editor.)
	
	The following code examples demonstrate the problem:
	
	The main program is as follows:
	
	     DECLARE SUB qstnaire (question$())
	     DEFINT I-N
	     DIM question$(5)
	     COMMON question$()
	     CLS
	     INPUT question$(1)
	     CALL qstnaire(question$())
	     END
	
	The subprogram in the Quick library is as follows:
	
	     DEFINT I-N
	     SUB qstnaire (question$()) STATIC
	     PRINT question$(i);
	     END SUB
