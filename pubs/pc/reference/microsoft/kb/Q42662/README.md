---
layout: page
title: "Q42662: Corrupt Parameters in SUB Using PRINT with Comma; BC.EXE 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q42662/
---

## Q42662: Corrupt Parameters in SUB Using PRINT with Comma; BC.EXE 4.50

	Article: Q42662
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890309-98 buglist4.50
	Last Modified: 14-FEB-1991
	
	In the example below, parameters that are passed to a SUBprogram and
	printed out with a comma separating them will be corrupted within the
	SUBprogram. This problem occurs only when the program has been
	compiled to an EXE file. Altering the compile switches does not change
	the incorrect results.
	
	The program below demonstrates this problem. The problem exists only
	when the parameters have been passed to a SUBprogram and are compiled
	to an EXE file.
	
	This problem occurs in .EXE programs only in QuickBASIC version 4.50.
	Microsoft is researching this problem and will post new information
	here as it becomes available. Previous versions of QuickBASIC, and
	Microsoft BASIC Compiler versions 6.00, 6.00b, and 7.00, produce the
	correct results (fixlist6.00 fixlist6.00b fixlist7.00).
	
	The following program is TEST.BAS, which creates two variables and
	passes them to a subroutine. The subroutine then prints the variables.
	
	   DECLARE SUB test (a, b)
	   a = 1
	   b = 2
	   CALL test(a, b)
	   PRINT a, b
	
	   SUB test (a, b)
	      PRINT a, b
	      b = 100
	      PRINT a, b   ' This prints incorrectly.
	      b = 256
	   END SUB
	
	The compiled EXE file prints the following incorrect output:
	
	   1             2
	   1             3.363116E-44
	   1             100
	
	If any PRINT statement is altered (for example, the first "PRINT a, b"
	in the SUB is changed to a "PRINT a; b"), or if the program is run
	from the QB.EXE environment, the correct output will be produced, as
	follows:
	
	   1             2
	   1             100
	   1             256
	
	Another workaround for the problem is to compile with BC /X, or to add
	"ON ERROR GOTO label" and "RESUME" statements to the program.
	
	Another workaround is to assign a local variable to the passed
	variable and then print the local variable instead of the passed
	variable, for example:
	
	   SUB test (a, b)
	      x = a  ' Assign passed parameter to local variable.
	      y = b  ' Assign passed parameter to local variable.
	      PRINT x, y
	      y = 100
	      PRINT x, y   ' This prints correctly.
	      y = 256
	      a = x  ' Pass back values to parameters
	      b = y  ' Pass back values to parameters
	   END SUB
