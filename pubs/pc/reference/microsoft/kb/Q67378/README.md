---
layout: page
title: "Q67378: OPEN &quot;SCRN:&quot; or &quot;CONS:&quot; Wrong Output in QBX.EXE When Step (F8)"
permalink: /pubs/pc/reference/microsoft/kb/Q67378/
---

## Q67378: OPEN &quot;SCRN:&quot; or &quot;CONS:&quot; Wrong Output in QBX.EXE When Step (F8)

	Article: Q67378
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901109-37 buglist7.00 buglist7.10
	Last Modified: 5-DEC-1990
	
	When you single step (F8) through a program that redirects screen
	output to either of the DOS standard devices "SCRN:" or "CONS:", the
	output will incorrectly flash momentarily on the QBX.EXE programming
	environment, instead of going to the output window.
	
	This problem occurs in the editing environment (QBX.EXE) of Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10.
	This problem does not occur in the Microsoft QuickBASIC environment
	(QB.EXE) shipped with QuickBASIC version 4.00, 4.00b, and 4.50.
	Microsoft is researching this problem and will post new information
	here as it becomes available.
	
	The following short program demonstrates the problem:
	
	OPEN "SCRN:" FOR OUTPUT AS #1   ' "CONS:" also shows problem.
	FOR i = 1 TO 10
	        PRINT #1, i
	NEXT i
	
	Single step through this program in the QBX.EXE 7.00 or 7.10
	environment by repeatedly pressing the F8 key. The output will
	momentarily flash on the environment screen; no text will be displayed
	on the output screen. Note that just running the program (F5) will
	correctly print to the output screen.
