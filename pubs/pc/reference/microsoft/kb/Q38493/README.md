---
layout: page
title: "Q38493: CodeView Problem Stepping into BASIC GOSUB Compiled /X or /D"
permalink: /pubs/pc/reference/microsoft/kb/Q38493/
---

## Q38493: CodeView Problem Stepping into BASIC GOSUB Compiled /X or /D

	Article: Q38493
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | S_CodeView B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 20-SEP-1990
	
	If you compile the program below with BC /X or /D in addition to the
	/Zi option (and then LINK with /CO) for Microsoft CodeView
	compatibility, the GOSUB subroutine cannot be "stepped into" in
	CodeView (using the F8 key in CV.EXE). The CodeView stepping-in
	process works correctly if the program is compiled without /X and
	without /D. The compiler switch /X is needed to do error trapping
	using ON ERROR with RESUME statements.
	
	To work around this limitation, do the following:
	
	1. When the GOSUB is encountered, switch the View option to "Mixed"
	   mode and step through lines in "Mixed" mode until the subroutine
	   is reached, then switch back to "BASIC" mode.
	
	2. When the RETURN statement is reached, go back into "Mixed" mode
	   until you are back to the line after the GOSUB.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	versions 4.00, 4.00b, and 4.50; in Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b); and
	in Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
	
	Code Example
	------------
	
	   CLS
	   PRINT "Point 1"
	   GOSUB 100
	   PRINT "Point 3"
	   END
	
	   REM * Subroutine *
	   100 PRINT "Point 2"
	   200 RETURN
