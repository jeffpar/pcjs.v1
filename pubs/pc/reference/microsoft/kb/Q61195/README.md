---
layout: page
title: "Q61195: C 6.00 README: .DEF Files Allowed on Command Line"
permalink: /pubs/pc/reference/microsoft/kb/Q61195/
---

## Q61195: C 6.00 README: .DEF Files Allowed on Command Line

	Article: Q61195
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-AUG-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	.DEF Files Allowed on Command Line
	----------------------------------
	
	The CL command line can be used to specify the name of an OS/2 or
	Microsoft Windows(TM) module-definition file to be used by the linker.
	For example,
	
	   CL CLOCK.C CLOCK.DEF
	
	tells CL to pass the name of the module-definition file "CLOCK.DEF" to
	the linker after compiling.
