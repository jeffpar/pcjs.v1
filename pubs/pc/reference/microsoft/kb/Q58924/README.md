---
layout: page
title: "Q58924: RUN Inside ON ERROR Handler Causes &quot;Press Any Key&quot; in EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q58924/
---

## Q58924: RUN Inside ON ERROR Handler Causes &quot;Press Any Key&quot; in EXE

	Article: Q58924
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900201-75 buglist4.00 buglist4.00b buglist4.50
	Last Modified: 26-FEB-1990
	
	Using a RUN statement to run a file from inside an error-handling
	routine causes the message "press any key to return to system" to be
	displayed before passing control to the new program. This problem
	occurs in compiled EXE files only; the QuickBASIC QB.EXE environment
	transfers control without any message.
	
	Use one of the following to work around the problem:
	
	1. Use CHAIN instead of RUN.
	2. To restart the same program, use RUN without a filename.
	3. RESUME to a line that executes the RUN statement.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00,
	buglist6.00b). This problem was corrected in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 (fixlist7.00).
	
	The following code example displays the "press any key..." message
	when run in EXE form. The three workarounds mentioned above are each
	listed in comments.
	
	   'A.BAS  compile and link commands:
	   '   BC   /E A;
	   '   LINK    A;
	   ON ERROR GOTO handle:
	   PRINT "Before error"
	   IF INKEY$ <> CHR$(27) THEN ERROR 100
	   END
	
	   handle:
	   PRINT "In error"
	   'CHAIN "a"                       'Workaround #1
	   'RUN                             'Workaround #2
	   'RESUME 110                      'Workaround #3
	   110 RUN "a"
