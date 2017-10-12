---
layout: page
title: "Q58653: CodeView Does Not Support Debugging Spawned Process"
permalink: /pubs/pc/reference/microsoft/kb/Q58653/
---

	Article: Q58653
	Product: Microsoft C
	Version(s): 2.20 2.30
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-FEB-1990
	
	The following are several reasons why CodeView doesn't provide
	debugging support for spawned processes under DOS:
	
	1. DOS is not a multitasking operating system. CodeView cannot start
	   another thread/process to watch the execution of the spawned
	   process.
	
	2. DOS does not provide debugging support for the DOS BIOS calls (int
	   21h). Since all spawn() and exec() functions under DOS have to go
	   through the BIOS to run, CodeView cannot follow the spawned
	   program.
	
	3. DOS only recognizes 640K of memory; therefore, there is
	   insufficient memory to debug a large program, since both the parent
	   and child processes have to reside in memory at the same time.
