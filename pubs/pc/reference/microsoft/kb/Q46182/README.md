---
layout: page
title: "Q46182: ON TIMER Can Wrongly Trigger CALL SETUEVENT, ON UEVENT Trap"
permalink: /pubs/pc/reference/microsoft/kb/Q46182/
---

## Q46182: ON TIMER Can Wrongly Trigger CALL SETUEVENT, ON UEVENT Trap

	Article: Q46182
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00b buglist4.50 SR# S890614-84 B_BasicCom
	Last Modified: 26-FEB-1990
	
	You cannot use the UEVENT and TIMER event trapping simultaneously.
	After CALL SETUEVENT is invoked just once, each subsequent timer event
	from the ON TIMER statement improperly activates the user-defined
	event (UEVENT) trap.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00b and 4.50, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b (buglist6.00, buglist6.00b). This problem was corrected in
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2 (fixlist7.00).
	
	SETUEVENT improperly activates at the same frequency as the ON TIMER
	event. This behavior continues to occur until the TIMER OFF statement
	is used. The problem occurs both in a compiled .EXE program and in the
	QB.EXE environment. SETUEVENT can be called from another language or
	from the BASIC program itself to reproduce the problem.
	
	The problem does not apply to QuickBASIC Version 4.00 and earlier
	versions because they don't support user-defined event trapping (ON
	UEVENT GOSUB and CALL SETUEVENT).
	
	The following sample code demonstrates the problem in a compiled .EXE
	program or in the QB.EXE environment:
	
	' Turn the timer and uevent on:
	TIMER ON
	UEVENT ON
	
	' Set up the handler routines for events:
	ON UEVENT GOSUB ueventhandler
	ON TIMER(1) GOSUB timerhandler   ' Timer event occurs every 1 second.
	
	'Invoke a user-defined event just once:
	CALL setuevent
	PRINT "Press any key to end."
	WHILE INKEY$ = ""
	WEND
	END
	
	ueventhandler:
	  PRINT "This uevent should only occur once."
	  RETURN
	
	timerhandler:
	  PRINT "A timer event occurred."
	  ' TIMER OFF   'Add this line to work around the problem.
	  RETURN
	
	Related Problem
	---------------
	
	In the QB.EXE environment, simply stopping the execution of the
	program and commenting out the ON TIMER statement fails to stop the
	activation of the SETUEVENT event during subsequent program runs. For
	more information on this separate QB.EXE environment problem, query on
	the following words:
	
	   SETUEVENT and buglist4.50
