---
layout: page
title: "Q62812: Must Start Program to Use Set Next Statement from Debug Menu"
permalink: /pubs/pc/reference/microsoft/kb/Q62812/
---

## Q62812: Must Start Program to Use Set Next Statement from Debug Menu

	Article: Q62812
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900528-1
	Last Modified: 11-JUN-1990
	
	When debugging a BASIC program in the QB.EXE or QBX.EXE environment,
	the Set Next Statement command from the Debug menu cannot be used
	unless the program is first started.
	
	This information applies to QB.EXE in Microsoft QuickBASIC versions
	4.00, 4.00b, and 4.50, to QB.EXE in Microsoft BASIC Compiler versions
	6.00 and 6.00b, and to QBX.EXE in Microsoft BASIC Professional
	Development System (PDS) version 7.00.
	
	To use the Set Next Statement option, the program must be started in
	one of the following ways:
	
	1. Restart the program by choosing Restart from the Run menu
	   by pressing ALT, R, R.
	
	2. Use the F8 key to step to the first line of the program.
	
	3. Start the program with SHIFT+F5 (or choose Start from the Run
	   menu). Then stop the program with a breakpoint or by pressing
	   CTRL+BREAK.
	
	After this, you should be able to use the Set Next Statement option.
	To use this debugging option, move the cursor with the arrow keys or
	mouse to the line of code where you want execution to begin. Then
	choose Set Next Statement from the Debug menu. That line will be
	highlighted, showing that it will be the next line to execute when you
	continue running the program.
