---
layout: page
title: "Q43023: Multiple Event Traps Can Malfunction in QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q43023/
---

## Q43023: Multiple Event Traps Can Malfunction in QB.EXE

	Article: Q43023
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00b buglist4.50 SR# S890315-133 B_BasicCom
	Last Modified: 26-FEB-1990
	
	The programs below demonstrate that SETUEVENT is mistakenly remembered
	in the QuickBASIC Version 4.50 environment between program
	invocations. Also, any other event trap causes the UEVENT to activate.
	This is incorrect behavior, since starting a new program should reset
	and remove event handlers from programs previously run in the QB.EXE
	environment.
	
	Microsoft has confirmed this to be a problem with QB.EXE in QuickBASIC
	Versions 4.00b and 4.50, and with QB.EXE in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS (buglist6.00 buglist6.00b). This
	problem was corrected in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 (fixlist7.00).
	
	The following program is EVENT1.BAS, which sets up a user-defined
	event trap but never activates it. The second program is EVENT2.BAS,
	which sets up and activates another user-defined event trap.
	
	The first time EVENT1.BAS is run in QB.EXE, the user-defined event
	trap never occurs (which is correct). If it is run after EVENT2.BAS,
	the EVENT1 procedure is activated. This is because the SETUEVENT is
	remembered between the programs.
	
	The steps to reproduce this are as follows:
	
	1. Invoke QB.EXE.
	
	2. Load EVENT1.BAS, and it runs correctly.
	
	3. Load EVENT2.BAS and run it.
	
	4. Load EVENT1.BAS again. User event remembers TIMER event.
	
	The following is the program EVENT1.BAS:
	
	CLS
	ON UEVENT GOSUB event1
	UEVENT ON
	DO: LOOP UNTIL INKEY$ <> ""
	END
	
	event1:
	 PRINT "user event"
	 RETURN
	
	The following is the program EVENT2.BAS:
	
	'**** PROGRAM #2
	CLS
	ON UEVENT GOSUB event1
	ON TIMER(1) GOSUB timeout
	UEVENT ON
	TIMER ON
	CALL setuevent
	DO: LOOP UNTIL INKEY$ <> ""
	END
	
	timeout:
	  PRINT "timeout"
	RETURN
	
	event1:
	  PRINT "user event"
	RETURN
