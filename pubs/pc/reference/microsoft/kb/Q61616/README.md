---
layout: page
title: "Q61616: CL.EXE Command-Line Switches Are Order Dependent"
permalink: /pubs/pc/reference/microsoft/kb/Q61616/
---

## Q61616: CL.EXE Command-Line Switches Are Order Dependent

	Article: Q61616
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-MAY-1990
	
	With the Microsoft C version 6.00 compiler, command-line switches are
	order dependent. For instance, the -Zr switch, which checks for null
	pointers and out-of-range far pointers, must appear AFTER the -qc
	switch. The option -Zr can be used only with the -qc (quick compile)
	option. Therefore, the following is the correct method:
	
	   cl -qc -Zr
	
	The following is the incorrect method:
	
	   cl -Zr -qc
	
	Also, if two options are for the same feature, the last option
	specified on the command-line will be used. Finally, CL environment
	variables are added to the beginning of the command line, which may
	alter the order of certain switches. The following are three examples:
	
	1. CL /Ox /Od foo.c
	
	2. CL /Od /Ox foo.c
	
	3. set CL=/Od
	   CL /Ox foo.c
	
	Example 1 will disable optimizations, and Example 2 and 3 will enable
	optimizations.
