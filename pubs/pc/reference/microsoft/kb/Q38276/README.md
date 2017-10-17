---
layout: page
title: "Q38276: &quot;Out Of Memory&quot; During CHAIN Using Large COMMON Block"
permalink: /pubs/pc/reference/microsoft/kb/Q38276/
---

## Q38276: &quot;Out Of Memory&quot; During CHAIN Using Large COMMON Block

	Article: Q38276
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 29-NOV-1988
	
	The two programs shown below demonstrate that a program can run out of
	memory when CHAINing to another program if there is insufficient
	memory to copy the COMMON data. If run from within the QB.EXE
	environment, the error is simply "Out of memory," while the error
	message "Out of memory during chain" is produced when the programs are
	run as .EXE programs. To solve the error, you must use a smaller
	COMMON block.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	and Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2.
	
	The following are code examples:
	
	'chain1.bas
	DIM a#(5000)
	COMMON a#(), b#(), c#()
	 x = FRE(-1) - 1000
	 PRINT FRE(-1)
	DIM b#(x / 16), c#(x / 16)
	PRINT FRE(-1)
	CHAIN "chain2"
	
	'chain2.bas
	DIM a#(5000)
	COMMON a#(), b#(), c#()
	PRINT FRE(-1)
	PRINT "Chain complete"
