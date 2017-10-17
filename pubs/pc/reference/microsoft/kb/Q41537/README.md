---
layout: page
title: "Q41537: QB Editor Causes Fourth Line to Be Overwritten by Third Line"
permalink: /pubs/pc/reference/microsoft/kb/Q41537/
---

## Q41537: QB Editor Causes Fourth Line to Be Overwritten by Third Line

	Article: Q41537
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50  SR# S890216-212
	Last Modified: 8-MAR-1989
	
	When the following sequence of events occurs, the QB.EXE editor causes
	the fourth line to be overwritten by the third line; therefore, the
	information on the third line is duplicated:
	
	1. Run QB.EXE and type the program example shown below.
	
	2. Type an additional word on line three following BULL.
	
	3. Try to move the cursor down one line with the DOWN ARROW key.
	
	4. Clear the error message; press ENTER.
	
	5. Use SHIFT+UP ARROW to highlight all lines.
	
	6. Press the TAB key.
	
	This problem appears only when an error occurs prior to performing the
	text selection step.
	
	Microsoft has confirmed this to be a problem in the QB.EXE program
	provided in QuickBASIC Versions 4.00, 4.00b, and 4.50 and to the
	QB.EXE program supplied with Microsoft BASIC Compiler Version 6.00 and
	6.00b (buglist6.00, buglist6.00b) for MS-DOS and OS/2. We are
	researching this problem and will post new information as it becomes
	available.
	
	The following is an example code:
	
	'create a program with several lines
	'make one of the lines call a subprogram
	'cause an error by adding an extra word on the call line
	'just press return
	'start from line 1, use shift+down arrow to highlight all lines
	'press the TAB key
	'Line three replaces line four
	    REM line one
	    REM line two
	    CALL bull
	    REM line four
