---
layout: page
title: "Q33622: COMMON SHARED Problem when Period in Variable after CHAIN"
permalink: /pubs/pc/reference/microsoft/kb/Q33622/
---

## Q33622: COMMON SHARED Problem when Period in Variable after CHAIN

	Article: Q33622
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00b buglist4.50
	Last Modified: 12-DEC-1989
	
	When CHAINed inside the QuickBASIC Version 4.00b or Version 4.50
	editor, the following programs fail to pass the COMMON SHARED variable
	m$. There are no error messages at compile time or run time. The
	CHAINed program uses a period in an array name that appears to
	conflict with a separate user-defined type. Neither the array nor the
	user-defined type variable is passed in COMMON. The programs run
	correctly in QuickBASIC Version 4.00 or when run from an .EXE program
	compiled in Version 4.00b or Version 4.50.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00b and 4.50. This problem was corrected in the QBX.EXE environment
	of the Microsoft BASIC PDS Version 7.00 (fixlist7.00).
	
	The following is a code example:
	
	   'The CHAINing program, PROG1.BAS:
	   COMMON SHARED m$
	   m$ = "Nice to see you.  Sometimes I don't print, but I should!"
	   CHAIN "prog2"
	
	   'The CHAINed-to program, PROG2.BAS:
	   COMMON SHARED m$
	   TYPE t
	     a AS INTEGER
	   END TYPE
	   DIM c.n(5)    'If the period is taken out, it works correctly.
	   DIM d AS t    'If this line is taken out, or if d is DIMmed to
	                 'something else, it works correctly.
	   PRINT m$
