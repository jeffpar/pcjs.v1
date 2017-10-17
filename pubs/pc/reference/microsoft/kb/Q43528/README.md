---
layout: page
title: "Q43528: VARPTR&#36; Malfunctions on Local Variable Length STRING Arrays"
permalink: /pubs/pc/reference/microsoft/kb/Q43528/
---

## Q43528: VARPTR&#36; Malfunctions on Local Variable Length STRING Arrays

	Article: Q43528
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 21-APR-1989
	
	The VARPTR$ function returns a string representation of a variable's
	address that can be used by the DRAW or PLAY statements. If VARPTR$ is
	used on an element of a local SUBprogram variable length STRING array,
	it generates an "Illegal Function CALL" during run time. This problem
	does not occur when run from within the QuickBASIC environment, but
	only when run as a compiled program. The problem occurs when the
	program is compiled with or without /D, or if it is compiled as a
	stand-alone executable file or one requiring the run-time module.
	
	Microsoft has confirmed this problem in Microsoft QuickBASIC Versions
	4.00, 4.00b, and 4.50, and the Microsoft BASIC Compiler Versions 6.00
	and 6.00b (buglist6.00, buglist6.00b). We are researching this problem
	and will post new information as it becomes available.
	
	Workarounds to this problem follow in the "More Information" section.
	
	If the following program is compiled and then executed, it will
	generate an "Illegal Function CALL" when VARPTR$ is CALLed:
	
	DECLARE SUB Drawit()
	SCREEN 9
	Drawit
	END
	
	SUB Drawit
	DIM A$(10)
	A$(1) = "U100L100D100R100"     'commands to draw a box
	DRAW "X" + VARPTR$(A$(1))
	END SUB
	
	There are several easy workarounds for this problem:
	
	1. Do not use the VARPTR$ function. The following two statements will
	   execute identically, and the second is much easier to implement:
	
	      DRAW "X" + VARPTR$(A$(1))
	      DRAW A$(1)
	
	2. Move the DIM statement to the Module level (main) code and change
	   it to DIM SHARED A$(10).
	
	3. Assign a temporary variable to A$(1) and use the temporary variable
	   in the VARPTR$ function.
