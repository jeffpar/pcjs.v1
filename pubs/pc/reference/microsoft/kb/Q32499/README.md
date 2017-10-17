---
layout: page
title: "Q32499: PRINT Does Not Scroll Line 25 after a SHELL"
permalink: /pubs/pc/reference/microsoft/kb/Q32499/
---

## Q32499: PRINT Does Not Scroll Line 25 after a SHELL

	Article: Q32499
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 12-DEC-1989
	
	The code example below does not work correctly when compiled in
	QuickBASIC Versions 4.00 or 4.00b (in the environment or in an .EXE
	program) or in Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS
	OS/2 and MS-DOS.
	
	The first line printed after returning from a SHELL statement is
	printed on line 25 and does not scroll when something else is printed
	after it (i.e., the subsequent PRINT statements are printed above line
	25).
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and in Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This problem was
	corrected in QuickBASIC Version 4.50 and in Microsoft BASIC PDS
	Version 7.00 (fixlist7.00).
	
	The workaround is to send output to the console ("cons:") device using
	the PRINT# statement, as shown below.
	
	The following code demonstrates the problem:
	
	PRINT "before shell"
	SHELL
	PRINT "after shell1"
	PRINT "after shell2"
	INPUT a$
	PRINT a$
	END
	
	The workaround is to print to the console ("cons:") device, as in the
	following program:
	
	OPEN "cons:" FOR OUTPUT AS #1
	PRINT #1, "before shell"
	SHELL
	PRINT #1, "after shell1"
	PRINT #1, "after shell2"
	INPUT a$
	PRINT #1, a$
	END
