---
layout: page
title: "Q61307: Do Not Start Programmer's WorkBench by Typing PWBED"
permalink: /pubs/pc/reference/microsoft/kb/Q61307/
---

	Article: Q61307
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 11-JUL-1990
	
	You cannot start the Programmer's WorkBench by typing PWBED. This is
	incorrect. Type PWB to start the Programmer's WorkBench environment.
	
	In the REAL MODE directory specified during setup, there will be two
	executables for the PWB, PWB.COM and PWBED.EXE. PWB.COM actually
	spawns PWBED.EXE. If you use PWBED to start the PWB, it will consume
	approximately 500K of memory. By executing a DOS SHELL from within the
	PWB and running CHKDSK, you will notice there is very little memory
	left.
	
	When you invoke the PWB the correct way (by typing PWB), then shell-
	out and do a CHKDSK, you will see that the PWB has only consumed
	approximately 8K of available memory.
	
	The PWB appears to work correctly if you invoke it with PWBED.
	However, since it is using so much memory, you will receive memory
	problems, such as "out of memory," "cannot compile," or "cannot
	build." These are caused because there is not enough memory to spawn
	either NMAKE, the compiler, or the linker.
