---
layout: page
title: "Q33489: QB 4.00b UPDATE.DOC: Adds SLEEP Statement to Suspend"
permalink: /pubs/pc/reference/microsoft/kb/Q33489/
---

## Q33489: QB 4.00b UPDATE.DOC: Adds SLEEP Statement to Suspend

	Article: Q33489
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	The following information was taken from the QuickBASIC Version 4.00b
	UPDATE.DOC file. It describes features that have been added since
	Microsoft QuickBASIC Version 4.00 was released.
	
	This information applies to Microsoft QuickBASIC Versions 4.00b and
	4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 6.00b, and
	to Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	New Statement: SLEEP
	--------------------
	
	Action: Suspends the execution of a BASIC program
	
	Syntax: SLEEP <seconds>
	
	Remarks:
	
	In this syntax the optional parameter <seconds> determines how many
	seconds to suspend the program. SLEEP suspends a QuickBASIC program
	until one of the following three events occurs:
	
	1. The time period specified in the SLEEP statement has elapsed.
	
	2. A key is pressed.
	
	3. An enabled QuickBASIC event occurs.
	
	A QuickBASIC event is one that you can trap with an ON <event>
	statement such as ON COM or ON KEY. Note that a QuickBASIC event does
	not interrupt the suspension caused by SLEEP unless its trap is active
	when the event occurs. That is, the trap must have been set up with an
	ON <event> statement, turned on with an <event> ON statement, and not
	disabled with <event> OFF or <event> STOP. Note, too, that SLEEP
	responds only to actual keystrokes that occur after the SLEEP
	statement executes; SLEEP ignores characters that were stored in the
	keyboard buffer before the SLEEP statement executes.
	
	If you execute SLEEP with a time period of 0 (zero), or without
	specifying any time period, the program is suspended for an indefinite
	period. In this case, only a keystroke or QuickBASIC event can
	interrupt the suspension.
	
	Example:
	
	The following program suspends its execution for 20 seconds. Because
	the sample program has no ON EVENT statement, the only way to
	interrupt its suspension prior to the end of the 20-second delay is by
	pressing a key.
	
	   PRINT "Taking a twenty-second timeout..."
	   SLEEP 20
	   PRINT "Play ball!"
