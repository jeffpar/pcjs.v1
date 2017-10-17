---
layout: page
title: "Q28157: Asynchronous SHELL Leaves Cursor Turned Off in New Process"
permalink: /pubs/pc/reference/microsoft/kb/Q28157/
---

## Q28157: Asynchronous SHELL Leaves Cursor Turned Off in New Process

	Article: Q28157
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	The following program starts CMD.EXE as an asynchronous process.
	However, CMD.EXE starts without a cursor visible.
	
	   x=SHELL("CMD.EXE")
	
	This is because there can be only one cursor on the screen at a time.
	When you do an asynchronous shell, the shelled program is subordinate
	to the main program that controls the screen/keyboard. Thus the cursor
	displayed is that of the main program. The cursor is turned off
	immediately after the shell (in the main program), so it disappears
	from the screen. If the cursor is explicitly turned on in the main
	program, there will be a cursor in the (asynchronously) shelled
	program.
