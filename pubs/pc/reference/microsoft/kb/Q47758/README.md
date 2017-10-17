---
layout: page
title: "Q47758: SETMEM(0) Returns Total Heap, FRE(-1) Returns Available Heap"
permalink: /pubs/pc/reference/microsoft/kb/Q47758/
---

## Q47758: SETMEM(0) Returns Total Heap, FRE(-1) Returns Available Heap

	Article: Q47758
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-DEC-1989
	
	The program shown below demonstrates the difference between the
	SETMEM(0) and FRE(-1) functions. SETMEM(0) returns the TOTAL possible
	amount of far heap space, while FRE(-1) returns the far heap space
	minus any data (in DGROUP or far heap) that is currently allocated.
	For Microsoft BASIC PDS Version 7.00, FRE(-1) refers only to far heap;
	to get available expanded memory you must use FRE(-3).
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS, and to
	Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	The following program is MEMSIZE.BAS, which invokes SETMEM(0) and
	FRE(-1) before and after allocating a data string:
	
	CLS
	PRINT "Setmem                        : "; SETMEM(0)
	PRINT "Nonstring array             -1: "; FRE(-1)
	a$ = SPACE$(200)
	PRINT
	PRINT "      --- After Allocation ---"
	PRINT "Setmem                        : "; SETMEM(0)
	PRINT "Nonstring array             -1: "; FRE(-1)
	
	After the string is allocated, SETMEM(0) returns the same value as it
	did before the call. FRE(-1), however, is decreased by the size of the
	string (200 bytes for the string plus 2 bytes for the string
	descriptor).
