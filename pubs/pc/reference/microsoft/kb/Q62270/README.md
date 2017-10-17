---
layout: page
title: "Q62270: Problem with SCREEN 0 Paging on CGA in QB.EXE &amp; QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q62270/
---

## Q62270: Problem with SCREEN 0 Paging on CGA in QB.EXE &amp; QBX.EXE

	Article: Q62270
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900517-177 B_QuickBas buglist7.00 buglist7.10
	Last Modified: 6-AUG-1990
	
	Paging through the active and visible pages of SCREEN 0 does not work
	correctly on a CGA monitor in the QBX.EXE or QB.EXE environment  This
	problem occurs only when single-stepping through a program and setting
	breakpoints to view the output of the various pages. Machines equipped
	with EGA or VGA video adapters do not demonstrate this problem.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	QuickBASIC version 4.50 (buglist4.50) and in the QBX.EXE environment
	of Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10. We are researching this problem and will post new
	information here as it becomes available.
	
	This problem does not occur in QuickBASIC versions 4.00 and 4.00b.
	
	The following code example demonstrates the problem in QB.EXE or
	QBX.EXE. Step through the program using the F8 key. After the PRINT
	statement, press the F4 function key to view the output screen. The
	screen will not be updated on a CGA monitor.
	
	Code Example
	------------
	
	   DEFINT A-Z
	   DO UNTIL INKEY$ <> ""
	      SCREEN 0, 0, x, x
	      CLS
	      PRINT "SCREEN MODE 0, PAGE"; x
	      x = x + 1          ' Press F4 key to view the output screen
	      IF x = 8 THEN x = 0
	   LOOP
