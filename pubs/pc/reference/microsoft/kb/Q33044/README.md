---
layout: page
title: "Q33044: PEN(5) Function in SCREEN 9 Returns Only 0 or 1 with Mouse"
permalink: /pubs/pc/reference/microsoft/kb/Q33044/
---

## Q33044: PEN(5) Function in SCREEN 9 Returns Only 0 or 1 with Mouse

	Article: Q33044
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 12-DEC-1989
	
	The PEN(5) function returns only a value of 0 or 1 instead of the
	actual y pixel coordinate when using the Microsoft Mouse in SCREEN 9,
	10, 11, or 12 (which are screen modes with resolutions of 640 x 350 or
	greater). This problem occurs both inside the QB.EXE environment and
	as a compiled .EXE program.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 3.00, 4.00, 4.00b, and 4.50, in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b (buglist6.00, buglist6.00b) for MS-DOS, and in
	Microsoft BASIC PDS Version 7.00 for MS-DOS (buglist7.00). We are
	researching this problem and will post new information here as it
	becomes available.
	
	The problem does not occur in SCREENs 1, 2, 7, 8, or 13, which have
	resolutions lower than 640 x 350.
	
	The following program hangs the machine in QuickBASIC 4.00:
	
	SCREEN 9
	CLS
	PEN ON
	true = -1
	WHILE true
	   x = PEN(4)         'x pixel coordinate
	   y = PEN(5)         'y pixel coordinate
	   PRINT "X= "x, "Y= "y
	WEND
