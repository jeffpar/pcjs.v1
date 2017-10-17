---
layout: page
title: "Q63272: Single-Line DEF FN Can Cause Program to Rerun ON ERROR"
permalink: /pubs/pc/reference/microsoft/kb/Q63272/
---

## Q63272: Single-Line DEF FN Can Cause Program to Rerun ON ERROR

	Article: Q63272
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50 SR# S900606-
	Last Modified: 8-NOV-1990
	
	A program will incorrectly return from an error-handling routine if an
	error occurs in a single-line DEF FN function. If the error occurs
	during the execution of a single-line DEF FN function, when the error
	handler executes a RESUME or RESUME NEXT, the program will resume on
	the line after the DEF FN definition instead of on the line or line
	after where the DEF FN function was invoked. This usually results in
	an infinite loop that eventually causes an "Out of stack space" error
	after the FN function invocations have been nested too many times.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	4.00, 4.00b, and 4.50; in Microsoft BASIC Compiler versions 6.00 and
	6.00b (buglist6.00, buglist6.00b); and in Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS
	(buglist7.00, buglist7.10). This problem occurs in both the
	QB.EXE/QBX.EXE editor environment and the BC.EXE compiler. We are
	researching this problem and will post new information here as it
	becomes available.
	
	The following code example demonstrates this problem:
	
	   10 ON ERROR GOTO handler
	   20 REM For the following program:
	   30 CLS
	   40 DEF fnx (x%) = 1 / x%
	   45
	   50 PRINT "line after the DEF FN": PRINT
	   60 PRINT fnx(0)
	   70 END
	   80 handler:
	   90   RESUME NEXT
	
	In the example above, an error will occur on the PRINT fnx(0). In the
	error handler, the RESUME NEXT should cause the program to RESUME on
	line 70 after the PRINT fnx(0), but instead the program will resume on
	the line after the DEF FN definition (line 45). This will cause the
	PRINT fnx(0) on line 60 to be executed again, causing another error,
	which effectively is an infinite loop. The program will eventually run
	out of stack space and quit with a run-time error.
	
	To work around this problem, simply expand the single-line DEF FN to a
	multiple-line DEF FN ... END DEF. To correct the example above, you
	would make the following changes:
	
	   10 ON ERROR GOTO handler
	   20 REM For the following program:
	   30 CLS
	   40 DEF fnx (x%)
	        fnx = 1 / x%
	      END DEF
	   45
	   50 PRINT "line after the DEF FN": PRINT
	   60 PRINT fnx(0)
	   70 END
	   80 handler:
	   90   RESUME NEXT
	
	This program will execute correctly. The FN function will return a 0
	and the program will resume on the line after the PRINT fnx(0)
	statement.
