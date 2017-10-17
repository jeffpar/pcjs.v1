---
layout: page
title: "Q21863: Passing Variables to ON ERROR and ON Event Handlers"
permalink: /pubs/pc/reference/microsoft/kb/Q21863/
---

## Q21863: Passing Variables to ON ERROR and ON Event Handlers

	Article: Q21863
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 29-DEC-1989
	
	This article discusses how a QuickBASIC program can I pass variables
	to ON ERROR and ON "event" handler routines compiled with subprograms
	that are separate from the main program.
	
	(The different ON "event" statements are ON TIMER GOSUB, ON KEY GOSUB,
	ON PLAY GOSUB, ON STRIG GOSUB, and ON PEN GOSUB.)
	
	This information applies to Microsoft QuickBASIC 1.00 1.01 1.02 2.00
	2.01 3.00 4.00 4.00B and 4.50, to Microsoft BASIC Compiler 6.00 and
	6.00B, and to Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	Variables can be passed through the COMMON SHARED statement to ON
	ERROR and ON "event" handler routines compiled separately from the
	main program. Variables that are not in COMMON SHARED are not
	accessible to the handler routines (unless the handler is in the same
	source file as the main program).
	
	The following is an example of a separately compiled subprogram that
	shares a flag variable with its error handler routine:
	
	   ' TEST.BAS
	   COMMON SHARED FLAG
	   errortrap:
	      ' The error is handled here:
	      PRINT "Error Number Trapped="ERR
	      FLAG=5
	      RESUME NEXT  ' Resumes to line after where error occurred.
	   SUB test STATIC
	   ON ERROR GOTO errortrap
	   FLAG=0
	   ERROR 5  ' Forces a test error number 5 to occur.
	   PRINT "FLAG=",FLAG  ' Execution resumes here after the error.
	   END SUB
	
	This program is called by the following separate main program module:
	
	   ' MAIN.BAS
	   CALL TEST
	
	First, compile as follows:
	
	   BC MAIN/X;
	   BC TEST/X;
	
	You then can LINK MAIN+TEST; run the resulting program as an example.
	
	You cannot use the linenumber or linelabel option of RETURN or RESUME
	in conjunction with subprograms.
	
	In QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00, and 4.00,
	error and event handling routines are local to each separately
	compiled module. A given error or event handling routine serves all
	subprograms compiled in the same module. The ON ERROR GOTO or ON event
	GOSUB statement should appear in each subprogram that is compiled
	separately from the main program.
	
	QuickBASIC Versions 4.00b and 4.50, Microsoft BASIC Compiler Versions
	6.00 and 6.00b, and Microsoft BASIC PDS Version 7.00 offer global
	error handling, which is described in a separate article. For more
	information, query on the following words:
	
	   global and error and handling and QuickBASIC
