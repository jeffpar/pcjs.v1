---
layout: page
title: "Q34029: C Version 5.10 LINK and Windows LINK4"
permalink: /pubs/pc/reference/microsoft/kb/Q34029/
---

	Article: Q34029
	Product: Microsoft C
	Version(s): 5.10    | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G880603-1453
	Last Modified: 8-AUG-1988
	
	If you are developing Windows applications, you can use the
	Segemented Executable Linker provided with C Version 5.10.
	   If you choose to use this linker for developing Windows
	applications, you must put the EXETYPE WINDOWS statement in your .DEF
	file. If you use LINK4, you do not have to put the EXETYPE WINDOWS
	statement in your .DEF file because the use of LINK4 causes the .EXE
	file to be identified as a Windows application.
