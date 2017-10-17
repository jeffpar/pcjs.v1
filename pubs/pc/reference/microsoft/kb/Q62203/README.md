---
layout: page
title: "Q62203: ADAPTER.BAS Needs SLEEP Statement When Compiled"
permalink: /pubs/pc/reference/microsoft/kb/Q62203/
---

## Q62203: ADAPTER.BAS Needs SLEEP Statement When Compiled

	Article: Q62203
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900504-3
	Last Modified: 29-MAY-1990
	
	The sample program APAPTER.BAS included with Microsoft BASIC
	Professional Development System (PDS) version 7.00 must have the SLEEP
	statement added to the code after the call to the SUBprogram so that
	the message that states what video modes are supported on the monitor
	is displayed when the program is compiled.
	
	This information applies to Microsoft BASIC PDS 7.00 for MS-DOS and
	OS/2.
	
	ADAPTER.BAS works correctly when compiled, except that the message
	displayed at the end of the program that states what video modes are
	supported by the monitor is displayed and then erased. This is due to
	the statement "SCREEN 0, 0", which sets the screen mode back to mode 0
	following the test. This problem is related to the second parameter,
	0, which is the "Color switch" parameter. When anything in the video
	mode changes, the screen is erased. When the message is displayed in
	the compiled program, the program ends and the screen mode is set back
	to composite color monitor mode. A color switch parameter of 0 in the
	SCREEN statement sets it to noncolor. By removing the color switch
	parameter or setting it to 1, ADAPTER.BAS will work correctly.
	
	ADAPTER.BAS works in the environment because the SCREEN mode is not
	reset until you respond to the "Press any key to continue" message.
	This can be demonstrated in the compiled program by placing a SLEEP
	statement following the CALL to the SUBprogram Adapter and leaving the
	SCREEN 0, 0 statement as is.
	
	Code Example
	------------
	
	  -------ADAPTER.BAS-----------
	
	  DECLARE SUB Adapter ()
	  DEFINT A-Z
	  Adapter
	  SLEEP
	  END
