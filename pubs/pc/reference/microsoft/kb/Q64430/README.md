---
layout: page
title: "Q64430: Abrupt Branch to ON Event GOSUB Handler from Separate Handler"
permalink: /pubs/pc/reference/microsoft/kb/Q64430/
---

## Q64430: Abrupt Branch to ON Event GOSUB Handler from Separate Handler

	Article: Q64430
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900712-87 B_BasicCom
	Last Modified: 3-AUG-1990
	
	When program control is within an ON <event> GOSUB handler, it is
	still possible to trap other events (where <event> can be COM, KEY,
	PEN, PLAY, STRIG, TIMER, etc.). This is normal behavior for ON <event>
	GOSUB trapping, but may be undesirable for those who want to disable
	all event trapping within an ON <event> handler. This article gives a
	code example demonstrating normal flow of control when a second
	trappable key is pressed within a given ON KEY GOSUB handler. The
	comments in this program show a method of temporarily disabling KEY
	and other event trapping within an ON KEY GOSUB handler.
	
	This information applies to Microsoft QuickBASIC versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	PDS (Professional Development System) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	Within an ON <event> GOSUB handler, event trapping is suspended within
	the handler for only the trapped event. Any other active event traps
	(set with other ON <event> GOSUB statements) triggered within an event
	handler will cause control to immediately branch to the other ON
	<event> handler during execution of the initial handler. Upon
	terminating the second handler, control resumes where it left off in
	the original handler. This abrupt transfer of control may be
	problematic for those who want all actions surrounding a particular
	event, a key press for example, to be processed in full before
	subsequent key presses or events are handled.
	
	The code example below demonstrates a case of control branching from
	one ON KEY handler to another when a second key is pressed within the
	first handler. The example contains the code (remarked out) necessary
	to temporarily disable all ON KEY and other event trapping within the
	initial ON KEY handler. If you unremark (uncomment) the code shown,
	the program will complete each handler without interruption.
	
	Code Example
	------------
	
	'DECLARE SUB EventsStop ()  ' These are the DECLARE statements for the
	'DECLARE SUB EventsOn ()    ' SUBs that disable and enable key and
	                            ' event trapping. (DECLARE statements are
	                            ' not needed or supported for QuickBASIC
	                            ' 3.00 or earlier versions.)
	CLS
	
	ON KEY(1) GOSUB F1KeyHandler   ' Trapping for F1 function key.
	ON KEY(2) GOSUB F2KeyHandler   ' Trapping for F2 function key.
	
	KEY(1) ON
	KEY(2) ON
	
	PRINT "Please, press the F1 key"
	SLEEP
	PRINT "Exiting program"
	END
	
	' To temporarily disable all key and event trapping within an
	' event handler, the CALL to SUB EventsStop must be the first
	' statement and the CALL to SUB EventsOn must be the last statement
	' of the handler before the RETURN.
	
	F1KeyHandler:
	        'CALL EventsStop       ' Include this statement to temporarily
	                               ' disable all or selected ON KEY and
	                               ' event statements
	
	        PRINT "In F1 key handler"
	        PRINT "Press F2 to jump to F2 key handler"
	        SLEEP
	        PRINT "Exiting F1 key handler"
	
	        'CALL EventsOn         ' Include this statement so that any
	                               ' keys pressed or events occurring
	                               ' during the execution of this handler
	                               ' will be processed at this point.
	        RETURN
	
	F2KeyHandler:
	        'CALL EventsStop       ' Include this statement to temporarily
	                               ' disable all or selected key and event
	                               ' trapping within this handler.
	        PRINT "In F2 key handler"
	        PRINT "Exiting F2 key handler"
	
	        'CALL EventsOn         ' Include this statement so that
	                               ' any trappable keys or events triggered
	                               ' during the execution of this handler
	                               ' will be processed at this point.
	        RETURN
	
	SUB EventsOn               'All keys and events to enable go in here
	        KEY(1) ON
	        KEY(2) ON
	
	        'TIMER ON          'Examples of events that may be enabled
	        'COM(1) ON
	END SUB
	
	SUB EventsStop             'All keys and events to temporarily disable
	        KEY(1) STOP        'go in here
	        KEY(2) STOP
	
	        'TIMER STOP        'Examples of events that may be temporarily
	        'COM(1) STOP       'disabled
	END SUB
	
	Additional References
	---------------------
	
	For more description of normal program flow within an ON <event> GOSUB
	handler, please see the following:
	
	1. Page 315 of "Microsoft BASIC 7.0: Programmer's Guide" for BASIC PDS
	   versions 7.00 and 7.10
	
	2. Page 234 of "Microsoft QuickBASIC 4.5: Programming in BASIC" manual
	   for QuickBASIC version 4.50
	
	3. Page 289 of "Microsoft QuickBASIC 4.0: Programming in BASIC:
	   Selected Topics" manual for QuickBASIC versions 4.00 and 4.00b
	
	4. Page 357 of "Microsoft QuickBASIC Compiler" manual for versions
	   2.00, 2.01, and 3.00
