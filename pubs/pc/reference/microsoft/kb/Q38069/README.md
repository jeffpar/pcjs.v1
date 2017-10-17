---
layout: page
title: "Q38069: &quot;Division By Zero&quot; Dynamic, Fixed-Length STRING&#42;1, 64K+ Array"
permalink: /pubs/pc/reference/microsoft/kb/Q38069/
---

## Q38069: &quot;Division By Zero&quot; Dynamic, Fixed-Length STRING&#42;1, 64K+ Array

	Article: Q38069
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 13-DEC-1989
	
	A DIM statement gives the following error at run time when you
	dimension a dynamic, fixed-length STRING*1 array 64K or larger (which
	requires compiling with the /AH option):
	
	   "Division by zero"
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). The
	"Division by zero" error occurs both in the QB.EXE editor and in a
	compiled .EXE program. This problem was corrected in Microsoft BASIC
	PDS Version 7.00 (fixlist7.00).
	
	This problem does not occur with static fixed-length STRING*1 arrays,
	or any static or dynamic array smaller than 64K.
	
	The following is a code example:
	
	' This program must be compiled with the /AH option.
	' A static array (limited to 64K or smaller) is ok:
	DIM darray(1 TO 4096, 1 TO 16) AS STRING * 1
	REM $DYNAMIC
	' A dynamic, STRING*1, 64K+ array gives "DIVISION BY ZERO" at run time:
	DIM carray(1 TO 4096, 1 TO 16) AS STRING * 1
