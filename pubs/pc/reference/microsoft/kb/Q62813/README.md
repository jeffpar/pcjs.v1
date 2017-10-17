---
layout: page
title: "Q62813: FRE(-1) Decreases with Repeated Use of DEF FNa&#36; in QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q62813/
---

## Q62813: FRE(-1) Decreases with Repeated Use of DEF FNa&#36; in QBX.EXE

	Article: Q62813
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900520-2 buglist7.00 fixlist7.10
	Last Modified: 2-NOV-1990
	
	Repeated use of a DEF FN function to return a string in the QBX.EXE
	environment causes far heap memory to decrease as shown in the
	following program. This does not occur with a compiled .EXE program or
	if a FUNCTION procedure is used in place of the DEF FN function.
	
	Microsoft has confirmed this to be a problem in the QBX.EXE
	environment of Microsoft BASIC Professional Development System (PDS)
	version 7.00 for MS-DOS. This problem was corrected in BASIC PDS 7.10.
	
	To work around the above problem, use a BASIC FUNCTION procedure in
	place of the DEF FN function.
	
	This problem does not occur with any version of Microsoft QuickBASIC
	(QB.EXE) or any version of Microsoft BASIC Compiler (BC.EXE).
	
	Microsoft QuickBASIC versions 4.00 and later and Microsoft BASIC
	Compiler versions 6.00 and later have a method of implementing
	functions that is much more straightforward than DEF FN. These
	products allow true FUNCTION procedures to be created, much like the
	functions available in Pascal and C. A BASIC FUNCTION...END FUNCTION
	block is a procedure that allows you to return a value to the calling
	subprogram, but in all other respects is the same as a SUB...END SUB
	subprogram procedure. Using a FUNCTION procedure instead of DEF FN
	avoids the DEF FN problem described in this article.
	
	The following code example demonstrates the problem when run in the
	QuickBASIC Extended environment (QBX.EXE) that comes with BASIC PDS
	7.00.
	
	Code Example
	------------
	
	DEF FNa$ = "This is a test string."
	FOR i% = 1 TO 100
	  PRINT FRE(-1)   ' Show available far heap.
	  PRINT FNa$
	NEXT
	
	Output
	------
	
	 179376
	This is a test string.
	 179344
	This is a test string.
	 179328
	This is a test string.
	 179296
	This is a test string.
