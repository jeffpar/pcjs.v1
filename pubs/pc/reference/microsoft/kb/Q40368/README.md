---
layout: page
title: "Q40368: QuickBASIC 4.50 Does Not Return to 25-Line Mode after Make EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q40368/
---

## Q40368: QuickBASIC 4.50 Does Not Return to 25-Line Mode after Make EXE

	Article: Q40368
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890110-36 buglist4.50 B_BasicCom
	Last Modified: 15-DEC-1989
	
	When you invoke Microsoft QuickBASIC Version 4.50 with the
	high-resolution (QB /H) option and you compile a program using the
	Make EXE And Exit option, the screen remains in high-resolution mode
	when QuickBASIC exits back to MS-DOS. The resolution can be returned
	to 25-line mode by typing the following:
	
	   MODE CO80
	
	The commands to enter QuickBASIC using the high-resolution mode and
	the command to reset the resolution upon exit can be included in a
	batch file for convenience.
	
	The batch file might look like the following:
	
	  REM  *** Here is the STARTQB.BAT file ***
	  QB /H
	  MODE CO80
	
	Versions 4.00 and 4.00b of Microsoft QuickBASIC and the QBX.EXE
	environment provided with Microsoft BASIC PDS Version 7.00 all return
	to 25-line mode upon exiting (fixlist7.00).
