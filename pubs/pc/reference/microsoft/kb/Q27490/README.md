---
layout: page
title: "Q27490: FUNCTION Fails to Return Zero by Default When Compiled as .EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q27490/
---

## Q27490: FUNCTION Fails to Return Zero by Default When Compiled as .EXE

	Article: Q27490
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 20-SEP-1990
	
	When a FUNCTION is called multiple times inside the QB.EXE editor, the
	FUNCTION automatically returns a value of (0) zero unless it is set to
	some other value within the FUNCTION, as expected.
	
	However, when run from an .EXE file, the value returned by a FUNCTION
	is no longer reset to zero by default; it retains its value from the
	previous invocation.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	4.00, 4.00b, and 4.50 for MS-DOS; in Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b); and in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 (buglist7.00, buglist7.10) for MS-DOS and MS OS/2. We are
	researching this problem and will report new information here as it
	becomes available.
	
	When running the program below in the QB.EXE or QBX.EXE editor, the
	first five FUNCTION calls return a value of 99; the next five, from
	i%=6 to 10, return zeros, as expected. However, when run as an .EXE
	program, the last five FUNCTION calls incorrectly return a value of
	99 instead of zero.
	
	To work around the problem, add the line "fun%=0" as the first line of
	the function; the .EXE file will then work properly.
	
	The following a code example demonstrates the problem when compiled
	with BC.EXE, linked, and run as an .EXE program:
	
	   DECLARE FUNCTION fun% (i%)
	   FOR i% = 1 TO 10
	     PRINT fun%(i%)
	   NEXT i%
	   FUNCTION fun% (i%) STATIC
	     ' fun%=0   ' This line can be added as a workaround.
	   IF i% <= 5 THEN fun% = 99
	   END FUNCTION
