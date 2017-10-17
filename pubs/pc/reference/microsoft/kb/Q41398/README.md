---
layout: page
title: "Q41398: Garbage with PRINT TAB, Array Element in .EXE Compiled in 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q41398/
---

## Q41398: Garbage with PRINT TAB, Array Element in .EXE Compiled in 4.50

	Article: Q41398
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 SR# S881221-120
	Last Modified: 12-NOV-1990
	
	A QuickBASIC version 4.50 program compiled with BC.EXE displays
	garbage (a memory dump) on the screen (plus random beeps) when all of
	the following conditions occur simultaneously:
	
	1. Two consecutive PRINT, PRINT#, or LPRINT statements occur, the
	   second of which uses the TAB function.
	
	2. The variable being printed is an element of an array.
	
	3. The program is compiled with BC without the /D option.
	
	4. The program is compiled without the /O option.
	
	Microsoft has confirmed this to be a problem in QuickBASIC version
	4.50. This problem is corrected in Microsoft BASIC Professional
	Development System (PDS) version 7.00 (fixlist7.00).
	
	This problem does not occur in QuickBASIC version 4.00 or 4.00b.
	
	There are several workarounds for this problem:
	
	1. Use the /D (debug) switch when compiling.
	
	2. Replace the TAB function with an equivalent number of spaces.
	
	3. Put an IF statement between the PRINT, PRINT#, or LPRINT statements
	   (as shown in comment in program below).
	
	4. Use local variables for the subscripts.
	
	5. Use the /X switch when compiling, which is normally used to
	   indicate the presence of ON ERROR with RESUME, RESUME NEXT, or
	   RESUME 0.
	
	6. Use the /AH switch when compiling. (Invoking QB /AH will ensure
	   that the Make EXE File command compiles with  /AH).
	
	Code Example
	------------
	
	DIM lbc%(8), wmsg$(8)
	COMMON SHARED lbc%(), wmsg$()
	' OPEN "CON" FOR OUTPUT AS #1    ' This lets you use PRINT#1 below.
	CLS
	FOR i% = 1 TO 8
	  lbc%(i%) = i%
	  wmsg$(i%) = STRING$(17, 48 + i%)
	NEXT
	j% = 58
	FOR i% = 1 TO 4
	LOCATE 2 + i%, 3
	    PRINT wmsg$(lbc%(i%));   ' Also, PRINT#1, and LPRINT give problem
	  ' IF i%=4 THEN j%= 58 ' INSERT THIS STATEMENT TO CORRECT PROBLEM
	  ' A simple assignment will not correct the problem.
	  ' The following statement fails:
	    PRINT TAB(j%); wmsg$(lbc%(i% + 4));  ' Also PRINT#1, or LPRINT
	  ' The following statement also fails:
	  '  PRINT wmsg$(lbc%(i%)); TAB(j%); wmsg$(lbc%(i% + 4));
	NEXT i%
