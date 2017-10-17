---
layout: page
title: "Q60966: QB.EXE and QBX.EXE Erase Line If You Type STRIG ON"
permalink: /pubs/pc/reference/microsoft/kb/Q60966/
---

## Q60966: QB.EXE and QBX.EXE Erase Line If You Type STRIG ON

	Article: Q60966
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S900410-80
	Last Modified: 30-MAY-1990
	
	If the following code example is typed into the Microsoft QuickBASIC
	(QB.EXE) or QuickBASIC extended (QBX.EXE) editors, the line "STRIG ON"
	will disappear when you either move the cursor off that line, press
	RETURN, or try to run the program.
	
	This is not considered a problem with QB.EXE or QBX.EXE. Page 411 of
	the "Microsoft QuickBASIC 4.0: BASIC Language Reference," Page 411 of
	the "Microsoft BASIC Compiler 6.0: BASIC Language Reference," and Page
	361 of the "Microsoft BASIC 7.0: Language Reference" state that the
	STRIG ON and STRIG OFF statements are ignored. These statements are
	provided for compatibility with earlier versions of BASIC.
	
	Code Example
	------------
	
	   PRINT "Before Line"
	   STRIG ON                 'This line will disappear if entered
	                            'in CAPS or not
	   PRINT "After Line"
	
	Output
	------
	
	   Before Line
	   After Line
