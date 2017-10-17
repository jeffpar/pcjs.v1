---
layout: page
title: "Q44490: Current Statement Color Defaults to Green on Blue with /NOHI"
permalink: /pubs/pc/reference/microsoft/kb/Q44490/
---

## Q44490: Current Statement Color Defaults to Green on Blue with /NOHI

	Article: Q44490
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890504-69
	Last Modified: 20-DEC-1989
	
	When you invoke the QB.EXE environment of QuickBASIC Version 4.50 or
	the QBX.EXE environment of Microsoft BASIC PDS Version 7.00 with the
	/NOHI switch on a color monitor, the color of the Current Statement
	always starts out as Green on Blue, regardless of color changes in the
	previous QB or QBX session. This is a design limitation for the /NOHI
	option.
	
	You can change the color of the Current Statement by choosing Display
	from the Options pull-down menu.
	
	To reproduce this behavior, do the following:
	
	1. Bring up the environment (QB.EXE or QBX.EXE).
	
	2. Choose Display from the Options menu.
	
	3. Change the color of the Current Statement.
	
	4. Exit the environment (by pressing ALT+F+X).
	
	5. Restart the environment with the /NOHI option.
	
	/NOHI makes the color for the Current Statement always start out as
	Green on Blue (the default), regardless of the colors chosen in the
	previous QB or QBX session. This behavior occurs only with the Current
	Statement color setting. Changes to the Normal Text and Breakpoint
	Line colors are retained between sessions. The QB.INI or QBX.INI file
	remembers the color options.
	
	The /NOHI switch is only available in the QB.EXE environment of
	QuickBASIC 4.50 and the QBX.EXE environment of Microsoft BASIC PDS
	7.00.
