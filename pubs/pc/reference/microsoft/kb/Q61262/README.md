---
layout: page
title: "Q61262: argv"
permalink: /pubs/pc/reference/microsoft/kb/Q61262/
---

	Article: Q61262
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 11-JUL-1990
	
	If you use argv[0] in a program you have written, you may notice that
	the string pointed to by argv[0] is different depending upon what
	operating system/environment you are under. To access the full path
	name of the program, use the global variable _pgmptr, which always
	points to the full path, regardless of the environment you are in.
	(For more information, query on the word _pgmptr.)
	
	Under MS-DOS versions 3.x and later, argv[0] points to a string that
	contains the complete path of the program being run. Under MS-DOS
	versions 2.x, argv[0] contains the program name only. Under OS/2,
	argv[0] generally points to a string that reflects exactly what was
	entered to execute the program. The following are some exceptions to
	the OS/2 rule:
	
	1. OS/2 EXE linked with /PM:PM --
	
	      argv[0] points to complete path of program.
	
	2. OS/2 EXE under CodeView --
	
	      argv[0] points to complete path of program.
	
	These variations are not attributable to the C version 6.00 run-time
	functions; they merely reflect what is passed to the program at run
	time by the operating system.
