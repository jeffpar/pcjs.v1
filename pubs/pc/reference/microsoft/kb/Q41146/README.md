---
layout: page
title: "Q41146: QB 4.50 SHELL Forces Linefeed If Cursor Is on Line 25"
permalink: /pubs/pc/reference/microsoft/kb/Q41146/
---

## Q41146: QB 4.50 SHELL Forces Linefeed If Cursor Is on Line 25

	Article: Q41146
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890203-69 buglist4.50
	Last Modified: 15-MAY-1989
	
	The first program below demonstrates that a SHELL statement in
	QuickBASIC Version 4.50 programs causes the screen to scroll up
	(linefeed) one line if the cursor is LOCATEd on line 25. (The problem
	occurs in programs run in both the QB.EXE editor and .EXE programs.)
	
	If the cursor is not LOCATEd on line 25 at the time SHELL executes,
	then SHELL does not cause a linefeed.
	
	Microsoft has confirmed this to be a problem in Version 4.50. We are
	researching this problem and will post new information as it becomes
	available. This problem does not occur in earlier versions.
	
	The following program redirects output of a directory to a file and
	scrolls the screen up one line after the SHELL statement:
	
	CLS
	WIDTH 80,25  ' Must use WIDTH or VIEW PRINT 1 to 25 to use line 25.
	LOCATE 1,1
	PRINT "LINE 1. This scrolls off the screen after SHELL."
	LOCATE 2,1
	PRINT "LINE 2. This line scrolls up one line."
	LOCATE 25,1
	PRINT "LINE 25: NOW DOING A SHELL";
	SHELL " DIR c:\ > TEST.TXT"
	
	The following program can be used as a workaround to prevent the
	linefeed caused by SHELL:
	
	CLS
	WIDTH 80, 25
	LOCATE 1, 1
	PRINT "LINE 1 now stays on the screen without scrolling."
	LOCATE 2, 1
	PRINT "LINE 2 remains as the second line."
	LOCATE 25, 1
	PRINT "LINE 25 : DOING A SHELL AFTER CURSOR IS MOVED TO LINE 23";
	xpos% = POS(0)       ' Saves the cursor position, which is
	ypos% = CSRLIN       ' currently on line 25.
	LOCATE 23, 1
	SHELL "DIR c:\ > TEST.TXT"
	LOCATE ypos%, xpos%  'returns cursor to line 25 in remembered column.
