---
layout: page
title: "Q42586: Variable with Periods in COMMON Block Can Cause Problems"
permalink: /pubs/pc/reference/microsoft/kb/Q42586/
---

## Q42586: Variable with Periods in COMMON Block Can Cause Problems

	Article: Q42586
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 26-FEB-1990
	
	In the Microsoft QB.EXE editor, CHAINing between programs that have a
	COMMON block can cause errors, under the following conditions:
	
	1. The programs have a COMMON block.
	
	2. The COMMON block contains an array, a user-defined TYPE variable,
	   and a simple variable that contains one or more periods.
	
	The result is an "array not defined" error message in the CHAINed-to
	program. If the period(s) are removed from the simple variable, the
	programs CHAIN and run correctly. This error occurs only when running
	in the QB.EXE editor. The programs execute properly after being
	compiled with BC.EXE.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50. This problem was corrected in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 (fixlist7.00).
	Microsoft also recommends that you do not use periods in variable
	names, since the period is now used to distinguish between
	user-defined-TYPE variables. There may be conflicts between the two
	usages.
	
	In the following program examples, the COMMON block consists of an
	integer array, a user-defined-TYPE variable, and a single-precision
	variable. If PROG1.BAS is run inside the QuickBASIC environment, a
	"Subscript out of range" error occurs in PROG2.BAS, on the PRINT
	statement. This is because the array dimensions have not been
	correctly passed in the COMMON block.
	
	If the periods are removed from the variable x.to.y in PROG2.BAS, the
	program executes normally. Also, if the programs are compiled as they
	appear here with BC.EXE, they CHAIN together and run properly.
	
	Code Example
	------------
	
	'----------------------------------- PROG1.BAS
	'$DYNAMIC
	TYPE test
	  a AS INTEGER
	  b AS INTEGER
	END TYPE
	COMMON SHARED c() AS INTEGER
	COMMON SHARED Typed AS test
	COMMON SHARED x.to.y
	DIM SHARED c(1 TO 60) AS INTEGER
	
	c(3) = 42
	PRINT "Press a key to CHAIN to PROG2..."
	WHILE INKEY$ = "": WEND
	CHAIN "PROG2"
	END
	
	'----------------------------------- PROG2.BAS
	'$DYNAMIC
	TYPE test
	  a AS INTEGER
	  b AS INTEGER
	END TYPE
	COMMON SHARED c() AS INTEGER
	COMMON SHARED Typed AS test
	COMMON SHARED x.to.y
	
	PRINT UBOUND(c), c(3)
	END
