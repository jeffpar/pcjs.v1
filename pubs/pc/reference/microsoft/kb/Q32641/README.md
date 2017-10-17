---
layout: page
title: "Q32641: Problem Passing Array Element to SUB Compiled with No /Debug"
permalink: /pubs/pc/reference/microsoft/kb/Q32641/
---

## Q32641: Problem Passing Array Element to SUB Compiled with No /Debug

	Article: Q32641
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	The code sample below runs correctly when compiled with the debug
	option turned off (in either the QuickBASIC environment or in an .EXE
	file). The program passes an integer variable i and an array element
	number i to a non-STATIC subprogram.
	
	However, the program gives incorrect results at run time when compiled
	with BC /D or with debug selected from the Make EXE File command in
	the Run menu in QuickBASIC.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in the Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b).
	This problem has been corrected in the Microsoft BASIC Compiler
	Version 7.00 (fixlist7.00).
	
	The equivalent code works correctly in QuickBASIC Version 3.00 with or
	without the /D (debug) compiler option.
	
	The following code example demonstrates the problem:
	
	DECLARE SUB test (i AS INTEGER, j AS INTEGER)
	DIM a(2) AS INTEGER
	DIM i AS INTEGER
	a(1) = 1
	a(2) = 2
	i = 1
	CALL test(i, a(i))
	PRINT i, a(1), a(2)
	END
	
	SUB test (i AS INTEGER, j AS INTEGER)
	i = 2
	END SUB
