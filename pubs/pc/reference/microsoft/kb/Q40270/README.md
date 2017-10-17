---
layout: page
title: "Q40270: How CodeView Handles DosExitList Routines"
permalink: /pubs/pc/reference/microsoft/kb/Q40270/
---

## Q40270: How CodeView Handles DosExitList Routines

	Article: Q40270
	Version(s): 2.20
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	Question:
	
	CodeView does not seem to be executing my DosExitList. What should I
	do to execute the exit list?
	
	Response:
	
	If you are in your program and issue the GO command, your program
	executes to the end of your application, giving the message "Thread
	terminated normally." At this point, you can use the GO command or
	trace into your exit routine. However, if you would like to quit your
	program and go to your exit handler in the middle of executing your
	program, you have two choices.
	
	When you quit CodeView ("q"), your code including your DosExitList
	will not be executed. The first method to execute your DosExitList is
	the safest, but you are not able to trace through your exit routine.
	When you want to exit, type the following:
	
	   ? myexithandler()
	
	This command executes the function "myexithandler", which is your
	DosExitList routine. After this command has been performed, you can
	quit CodeView ("q") because all of your cleanup has been accomplished.
	
	The second method, which is less reliable, is to modify the instruction
	pointer (IP) so that you can effectively jump to the end of your
	program. Before you do this, make certain that you are not in a
	subfunction. If you are not in main(), jumping to the end of the
	program causes problems with the stack. While in your main() routine,
	enter the following at the CodeView command line, where XXXX is the
	value of the IP when you are at the last curly brace at the end of
	your program:
	
	   R IP XXXX
	
	This command causes a jump to the last curly brace; you can step
	through your program from there. This method allows you to step
	through your exit routine, but it is a little more risky.
