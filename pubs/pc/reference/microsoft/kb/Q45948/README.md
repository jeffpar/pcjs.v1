---
layout: page
title: "Q45948: Failure to Trap Event Compiled BC /w; Needs Line Label or /v"
permalink: /pubs/pc/reference/microsoft/kb/Q45948/
---

## Q45948: Failure to Trap Event Compiled BC /w; Needs Line Label or /v

	Article: Q45948
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890613-138 B_BasicCom
	Last Modified: 29-DEC-1989
	
	The /w compiler option produces smaller EXE files, but event checking
	is done much less frequently than if /v is used.
	
	In programs without line labels or line numbers, event trapping
	requires the /v (check between statements) compiler option. In
	programs compiled with the /v option, events are checked before every
	statement.
	
	If your program is compiled with the /w option, events are checked
	only when a labeled or numbered line is encountered at run time. As a
	result, if compiled with the /w switch, your program will never trap
	an event if it doesn't pass through a statement that has a label or
	line number.
	
	This information applies to all ON Event GOSUB statements [where Event
	can be COM(n), KEY(n), PEN, PLAY(n), STRIG(n), or TIMER(n)] for event
	trapping in Microsoft QuickBASIC Versions 1.00, 1.01, 1.02, 2.00,
	2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS; Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2; and Microsoft BASIC
	PDS Version 7.00 for MS-DOS and MS OS/2. In QuickBASIC 4.00b and
	later, BASIC compiler 6.00 and 6.00b, and BASIC PDS 7.00, the ON
	UEVENT GOSUB and CALL SetUEvent statements were added for user-defined
	event trapping.
	
	Code Sample
	-----------
	
	The following code sample, which requires QuickBASIC 4.00b or later,
	or BASIC compiler 6.00 or later, will not trap the user-defined event
	if compiled with the /w option. To trap the event, either use the /v
	option or place a line label in the idle loop as shown.
	
	ON UEVENT GOSUB handle:
	UEVENT ON
	WHILE i$ <> CHR$(27)      'Press escape to exit
	  IF i$ = " " THEN        'Press space to cause UEVENT
	'linelabel:         'Remove comment at start of line for /w to trap
	    CALL SetUEvent
	  END IF
	  i$ = INKEY$
	WEND
	END
	
	handle: PRINT "ON UEVENT"
	RETURN
	
	Note that the command-line compiler has a different name in different
	versions, as shown.
	
	QuickBASIC Versions 4.x and BASIC compiler 6.00 and 6.00b and BASIC
	PDS 7.00 compile with BC.EXE, as follows:
	
	   BC test/V
	
	QuickBASIC Versions 2.x and 3.00 compile with QB.EXE, as follows:
	
	   QB test/V;
	
	QuickBASIC Versions 1.x compile with BASCOM.EXE, as follows:
	
	   BASCOM test/V;
