---
layout: page
title: "Q69145: PWB Ignores Certain Compiler Switches in Additional Options"
permalink: /pubs/pc/reference/microsoft/kb/Q69145/
---

	Article: Q69145
	Product: Microsoft C
	Version(s): 1.00 1.10 | 1.00 1.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_c
	Last Modified: 25-FEB-1991
	
	The compiler switches
	
	   /Fo, /Fe, /F hexnum, /Fm, and /link link-info
	
	are ineffective when entered in the Additional Options field of the C
	Compiler Options dialog box from the Options menu of the Programmer's
	Workbench (PWB). This is the intended behavior. The functionality of
	all of these switches is provided through the Compiler, Link, and
	Build Options dialog boxes from the Options menu.
	
	The /Fo switch is overridden by PWB as it creates the .MAK file needed
	to build the project. To perform this function correctly:
	
	1. Set a program list from the Make menu.
	2. Choose Build Options from the Options menu.
	3. Choose the Build Directory button.
	4. Enter the destination path in that field, such as:
	
	      C:\C600\PROJECT\
	
	5. Rebuild the project, and both the .EXE and .OBJ files will be placed
	   in that directory.
	
	The other switches are used only to pass information to the linker
	when the CL command is used outside PWB without the /c option. Because
	PWB always compiles and links separately, these switches are lost. To
	utilize these switches from within PWB, select the appropriate options
	in the Link Options dialog box from the Options menu.
