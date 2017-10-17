---
layout: page
title: "Q40546: LINE Statement with BF Option Outside Window Will Hang"
permalink: /pubs/pc/reference/microsoft/kb/Q40546/
---

## Q40546: LINE Statement with BF Option Outside Window Will Hang

	Article: Q40546
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00b SR# S881221-109 viewport
	Last Modified: 17-JAN-1990
	
	If a LINE statement with the BF (box filled) option is executed
	outside the boundaries of the physical view port set up by the VIEW
	statement, the computer will hang. The program runs properly inside
	the QuickBASIC QB.EXE environment, but fails when compiled with BC.EXE
	from Microsoft BASIC Compiler Version 6.00.
	
	Microsoft has confirmed this to be a problem with BC.EXE in Microsoft
	BASIC Compiler Version 6.00. This problem was corrected in Microsoft
	BASIC Compiler Version 6.00b.
	
	This problem does not occur in Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50, or in Microsoft BASIC Professional Development System
	(PDS) Version 7.00.
	
	The following program sets up a physical view port with the VIEW
	statement and then draws a line using the BF option, starting inside
	the box and moving outside the window's boundaries. If the program is
	compiled with Version 6.00 of Microsoft BASIC Compiler, the program
	will hang upon attempting to draw the first box that lies outside the
	window view port.
	
	The following is a code example:
	
	SCREEN 2
	xmin = 0: ymin = 0
	xmax = 1000: ymax = 1000
	dx = (xmax - xmin) / 10
	dy = (ymax - ymin) / 10
	VIEW (200, 50)-(400, 150)
	WINDOW SCREEN (xmin, ymin)-(xmax, ymax)
	LINE (xmin, ymin)-(xmax, ymax), 1, B
	x0 = xmin
	loop1:  x0 = x0 + dx
	        LOCATE 5, 35: PRINT USING "x0=####"; x0
	        LINE (x0, ymin + dy)-(x0 + 5, ymax - dy), 1, BF
	stall:  x$ = INKEY$: IF x$ = "" THEN GOTO stall
	        IF x$ = CHR$(27) THEN END
	        GOTO loop1
