---
layout: page
title: "Q11997: How to Modify the Environment for a Spawned Process"
permalink: /pubs/pc/reference/microsoft/kb/Q11997/
---

## Q11997: How to Modify the Environment for a Spawned Process

	Article: Q11997
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	Question:
	
	I use the spawnl() function to allow the user to run other programs
	without exiting mine. Is there a way to change the operating system
	command prompt to remind the user to type EXIT to return to my
	program?
	
	Response:
	
	Since PROMPT is a DOS and OS/2 environment variable, you just need to
	set your own value for PROMPT in the spawned processes environment. C
	allows you to specify the environment to be handed to a child process
	in one of the following two ways:
	
	1. Use one of the spawn*e() functions. See the C run-time library
	   reference or online help supplied with your compiler for specific
	   details about the spawn() family of functions.
	
	2. Use the putenv() function to modify the program's own local copy of
	   the environment, then use one of the spawn() functions other than
	   spawn*e(). Details on the putenv() function may also be found in the
	   C run-time library reference or online help.
	
	In general, a process may only alter the environment to be handed to a
	child process. The C run-time library functions give the illusion of
	being able to alter the environment space but this is accomplished by
	making a copy of the environment strings during start up and,
	thereafter, only altering this copy.
