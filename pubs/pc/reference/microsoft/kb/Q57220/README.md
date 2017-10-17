---
layout: page
title: "Q57220: Inline Assembly May Cause Debugger to Skip Lines"
permalink: /pubs/pc/reference/microsoft/kb/Q57220/
---

## Q57220: Inline Assembly May Cause Debugger to Skip Lines

	Article: Q57220
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 buglist2.01
	Last Modified: 17-JAN-1990
	
	The following code causes the debugger to skip (or jump) over a line
	of source code. The statement that causes this action is the "_asm in
	ax,21h;" inline assembly statement. This problem happens only when you
	are debugging with the integrated debugger and loading the 21h port
	using the "in" instruction. If you run the program from the DOS
	prompt, the program will execute properly.
	
	Code Example
	------------
	
	 1: void main (void)
	 2:    {
	 3:    _asm in ax, 21h;
	 4:    printf ("Test1\n");
	 5:    printf ("Test2\n");
	 6:    }
	
	Compile the above program and trace through it using F8. Line #4 will
	be skipped. The "_asm in ax,21h;" inline assembly statement is what
	causes the line to be skipped; however, this program will run as
	expected when executed outside the integrated environment. It will
	also run as expected from within the environment as long as the trace
	(F8) command is not used.
	
	Microsoft has confirmed this to be a problem in Versions 2.00 and
	2.01. We are researching this problem and will post new information
	here as it becomes available.
