---
layout: page
title: "Q58124: BASIC 7.00/7.10: Incorrect Results with Alternate Math Library"
permalink: /pubs/pc/reference/microsoft/kb/Q58124/
---

## Q58124: BASIC 7.00/7.10: Incorrect Results with Alternate Math Library

	Article: Q58124
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist7.00 fixlist7.10
	Last Modified: 20-SEP-1990
	
	Using Microsoft BASIC Professional Development System (PDS) version
	7.00 for MS-DOS and MS OS/2, the code example below produces incorrect
	results when compiled with the alternate math library (/FPa).
	
	This code works correctly in the QBX.EXE environment or when compiled
	with BC /D (debug) or /X. It also works correctly when compiled with
	BC /FPa in Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS
	and MS OS/2. Dimensioning the array as double-precision also works
	around the problem.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	version 7.00. This problem was corrected in BASIC PDS 7.10.
	
	Code Example
	------------
	
	   DIM A(3)
	   A(i%) = 5
	   sx = A(i%)
	   pr = .1 * A(i%)
	   PRINT pr, sx, A(i%)
	
	Compile as follows:
	
	   BC prog /o /fpa;
	
	Link as follows:
	
	   LINK prog;
	
	The correct output from BASIC 7.10 is as follows:
	
	   .5     5     5
