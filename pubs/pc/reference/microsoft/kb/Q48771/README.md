---
layout: page
title: "Q48771: LIB.LIB: Cannot Find Library"
permalink: /pubs/pc/reference/microsoft/kb/Q48771/
---

	Article: Q48771
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM
	Last Modified: 10-OCT-1989
	
	The following error occurs when you try to compile and link
	a program in the QC environment, and don't use or have LIB.LIB:
	
	   LIB.LIB: cannot find library
	
	This error occurs when a trailing space is included at the end of the
	library files directory in Options.Environment. Remove the trailing
	space or retype the directory and path without the trailing space.
