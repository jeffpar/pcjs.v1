---
layout: page
title: "Q28027: SETUP Program Can Create Subdirectory Only If Parent Exists"
permalink: /pubs/pc/reference/microsoft/kb/Q28027/
---

## Q28027: SETUP Program Can Create Subdirectory Only If Parent Exists

	Article: Q28027
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 7-FEB-1990
	
	The SETUP.EXE program can create a subdirectory only if the parent
	directory already exists. For example, if you want to place the
	library files in a subdirectory named \BC6\LIB, the directory \BC6
	must exist before SETUP is run.
	
	This information applies to the SETUP.EXE program in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2, Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2, and Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50 for the
	MS-DOS.
	
	This is also a limitation of DOS. You cannot use the MKDIR command to
	create a subdirectory in a directory that does not exist.
