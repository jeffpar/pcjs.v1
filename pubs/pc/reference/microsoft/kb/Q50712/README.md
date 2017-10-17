---
layout: page
title: "Q50712: Run-Time Routines Assume That Direction Flag Is Clear in C"
permalink: /pubs/pc/reference/microsoft/kb/Q50712/
---

## Q50712: Run-Time Routines Assume That Direction Flag Is Clear in C

	Article: Q50712
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | DOCERR S_QUICKC S_QUICKASM
	Last Modified: 30-NOV-1989
	
	The C run-time routines assume that the direction flag is cleared. If
	you are using other functions with the C run-time functions, you must
	ensure that the other functions leave the direction flag alone or
	restore it to its original condition. Expecting the direction flag to
	be clear upon entry makes the run-time code faster and more efficient.
	
	The run-time functions that use the direction flag include the string
	manipulation and buffer manipulation routines.
	
	This is documented on Page 365 of the "Microsoft Macro Assembler
	Programmer's Guide," Versions 5.00 and 5.10:
	
	   Under DOS, the direction flag will normally be cleared
	   if your program has not changed it.
	
	This information is not included in the C 5.10 or QuickC 2.00 or 2.01
	manuals.
