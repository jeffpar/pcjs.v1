---
layout: page
title: "Q39384: INPUT to Out of Range Array Element Can Hang; or Bad Value"
permalink: /pubs/pc/reference/microsoft/kb/Q39384/
---

## Q39384: INPUT to Out of Range Array Element Can Hang; or Bad Value

	Article: Q39384
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 21-DEC-1988
	
	When an array element in an INPUT statement is out of range, the
	QuickBASIC editor may hang, instead of producing a "Subscript out of
	range" error message. (The problem occurs when the program explicitly
	dimensions the array or uses the default values.)
	
	The program also fails if compiled to an executable file. If compiled
	with the DEBUG option /d, the program will hang, similar to the
	QuickBASIC editor. Without the /d option, the results will vary from
	incorrect values being displayed to the machine hanging.
	
	This information applies to QuickBASIC Version 4.00 and 4.00b, and the
	BASIC Compiler Version 6.00 and 6.00b (buglist6.00, buglist6.00B). This
	problem was corrected in QuickBASIC Version 4.50.
	
	To work around the problem you should avoid assigning array elements
	that are outside of the allowed range.
	
	The following two code examples demonstrate the problem:
	
	REM *** EXAMPLE 1: Using the DEFAULT array size limits, 0 to 10
	FOR a = 1 TO 20
	    INPUT "ENTER NUMBER "; b(a)
	NEXT a
	
	REM *** EXAMPLE 2: Using DIM statement to explicitly set limits
	DIM b(10)
	FOR a = 1 TO 20
	    INPUT "ENTER NUMBER "; b(a)
	NEXT a
