---
layout: page
title: "Q32164: BASIC Example of CALL SetUEvent, ON UEVENT GOSUB Trapping"
permalink: /pubs/pc/reference/microsoft/kb/Q32164/
---

## Q32164: BASIC Example of CALL SetUEvent, ON UEVENT GOSUB Trapping

	Article: Q32164
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	The following products support user-defined event trapping with the
	statements ON UEVENT GOSUB, UEVENT ON, and SetUEvent:
	
	1. QuickBASIC Compiler Versions 4.00b and 4.50
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	   OS/2
	
	3. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	Microsoft QuickBASIC Versions 4.00 and earlier do not support
	user-defined events.
	
	Below is a short example of how to trap a user-defined event.
	
	You can cause a user-defined event in a program by executing the CALL
	SetUEvent statement whenever a desired condition occurs. To CALL the
	SetUEvent routine in the QuickBASIC environment, you must invoke
	QB.EXE with the /L switch to load QB.QLB. For BASIC PDS 7.00 you must
	start QBX with /L to load QBX.QLB. An .EXE program that CALLs
	SetUEvent must be linked to QB.LIB because the SetUEvent routine is
	located in the QB.LIB library provided on the product disk. For BASIC
	PDS 7.00 you must link with QBX.LIB.
	
	The UEVENT ON statement turns on trapping of user-defined events. The
	< ON UEVENT GOSUB label > statement instructs a program where to go
	when a user-defined event occurs.
	
	The following example invokes the event handler if the value 5 is
	accepted from the keyboard:
	
	ON UEVENT GOSUB event1
	UEVENT ON
	INPUT "enter a number"; a
	IF a = 5 THEN CALL setuevent
	END
	event1:
	   PRINT "invoked event handler with value"; a
	   RETURN
