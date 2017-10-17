---
layout: page
title: "Q50638: &quot;Subscript Out Of Range&quot; If REDIM Long Integer Array in SUB"
permalink: /pubs/pc/reference/microsoft/kb/Q50638/
---

## Q50638: &quot;Subscript Out Of Range&quot; If REDIM Long Integer Array in SUB

	Article: Q50638
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom SR# S891016-
	Last Modified: 15-DEC-1989
	
	REDIMing (redimensioning with REDIM) a dynamic long integer array that
	was passed to a SUBprogram generates a "Subscript Out Of Range" error
	at run time.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS and in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00,
	buglist6.00b). This problem was corrected in Microsoft BASIC PDS
	Version 7.00 (fixlist7.00).
	
	The "Subscript Out Of Range" occurs whether the SUBprogram is compiled
	as part of the main program or it is compiled in a separate module.
	
	You can work around this problem by using an array type other than
	long integer, or by passing the array through a COMMON SHARED block.
	
	The following code demonstrates the problem passing a dynamic array of
	long integers to a SUBprogram and REDIMing it in the SUBprogram.
	
	REM $DYNAMIC
	DIM arrayb&(50)
	CALL Test(arrayb&())
	END
	
	SUB Test(arrayc&())
	   REDIM arrayc&(100)
	END SUB
