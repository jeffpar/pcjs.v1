---
layout: page
title: "Q43309: PRINT USING Incorrect Results, Hang for Double Precision"
permalink: /pubs/pc/reference/microsoft/kb/Q43309/
---

## Q43309: PRINT USING Incorrect Results, Hang for Double Precision

	Article: Q43309
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist 4.00b buglist4.50 SR# S890319-2 B_BasicC
	Last Modified: 26-FEB-1990
	
	PRINT USING for double precision numbers assigned to an expression in
	the range of (&H1D - 128) to (&H1D - 256) (where hex and decimal
	notations are mixed) can produce incorrect results in the program
	below. In the QB.EXE editor, it ignores the format string and prints a
	very large number. When compiled to an executable .EXE, it produces
	varied results depending on the version of the compiler and the
	options used. Compiling for Debug (with BC /d) does not affect the
	result.
	
	The following program, when compiled with BC.EXE Version 4.00 for use
	with BRUN, or with 4.00b, 6.00, or 6.00b for use with BCOM, prints
	large numbers as it does in the editor, but does not hang. When
	compiled with BC.EXE 4.00b, 4.50, 6.00, or 6.00b for use with BRUN, it
	prints very large numbers, and if run twice, it hangs the machine.
	When compiled with /O with BCOM in 4.00 and 4.50, it prints garbled
	output to the screen, but does not hang the machine.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b (buglist6.00, buglist6.00b) for MS-DOS and MS
	OS/2. This problem was corrected in Microsoft BASIC Professional
	Development System (PDS) Version 7.00 (fixlist7.00).
	
	Code Example
	------------
	
	' You can substitute "#" for each
	' double precision number with the same result.
	DEFDBL A-Z
	CLS
	
	j = &H1D - 128
	
	FOR i = 1 TO 128
	  j = j / 10
	  PRINT USING "##.#######"; j
	  NEXT
	END
