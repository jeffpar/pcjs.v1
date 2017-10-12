---
layout: page
title: "Q29150: Using Full Pathnames to Compile Programs with M or MEP"
permalink: /pubs/pc/reference/microsoft/kb/Q29150/
---

	Article: Q29150
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | TAR75085
	Last Modified: 20-OCT-1988
	
	The full pathname of a file is not transferred to the compiler when an
	ARG COMPILE is executed in the Microsoft Editor for MS-DOS and OS/2.
	The following is an example:
	
	1. Invoke M.EXE as follows:
	
	M \c5\source\test.c
	
	2. Compile the program with ARG COMPILE. (The default value is
	   ALT+A SHIFT+F3). The following line is displayed:
	
	   CL /c /Zep /D LINT_ARGS test.c
	
	   The full pathname is not given.
	
	If you plan on compiling from other directories, you should define
	the compile command using the %|F option. The default option %s uses
	only the filename. For example, the TOOLS.INI file could be modified
	as follows to get the default compile with the full pathname:
	
	extmake:c cl /c /Zep /D LINT_ARGS %|F
	
	You also can select portions of the full pathname, and use the name
	more than once, as in the following example:
	
	%d|F - obtains the drive (and colon)
	%p|F - obtains the path
	%f|F - obtains the filename (no extension)
	%e|F - obtains the extension
	
	You can combine the "dpfe" any way you wish, as in the following:
	
	%dpf|F.xyz
	
	This combination produces the drive, path, and filename, with the
	extension .XYZ added to the filename.
