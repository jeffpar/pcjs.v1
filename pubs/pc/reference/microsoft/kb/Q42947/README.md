---
layout: page
title: "Q42947: Instant Watch on &#36;INCLUDE File CONST Name May Hang QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q42947/
---

## Q42947: Instant Watch on &#36;INCLUDE File CONST Name May Hang QB.EXE

	Article: Q42947
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890320-95 buglist4.00 buglist4.00b buglist4.50
	Last Modified: 26-FEB-1990
	
	The QuickBASIC environment may hang when attempting to add an Instant
	Watch on a CONST data name that is in an $INCLUDE file. Microsoft has
	confirmed this to be a problem in Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50 and in the QB.EXE that is shipped with Microsoft BASIC
	Compiler Versions 6.00 and 6.00b (buglist6.00, buglist6.00b). This
	problem was corrected in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 (fixlist7.00).
	
	The two files involved are the following:
	
	   REM ---- TEST.BI -------
	   CONST TRUE = -1
	
	   REM ---- TEST.BAS ------
	   REM $INCLUDE: 'test.bi'
	
	The following steps should cause the machine to hang. The steps must
	be followed closely to reproduce the problem:
	
	1. Load and run the TEST.BAS file.
	
	2. Choose the Include File command on the View pull-down menu.
	
	3. Highlight the "TRUE" CONSTant data name.
	
	4. Set an Instant Watch variable (press SHIFT+F9).
	
	The machine is now hung and a reboot is required. If the same
	sequence of events is followed as described above with the following
	exception, then the machine will not hang:
	
	   In Step 2, choose Include File Lines instead of the Include File
	   command.
	
	Additional reference word: B_BASICCOM
