---
layout: page
title: "Q40553: Bad Results with Recursion of STATIC Procedure in QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q40553/
---

## Q40553: Bad Results with Recursion of STATIC Procedure in QB.EXE

	Article: Q40553
	Version(s): 4.00 4.00B 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 SR# S890113-13
	Last Modified: 23-JAN-1989
	
	The use of the STATIC clause in recursive functions or SUBprograms
	should be avoided. Using STATIC may cause you to overwrite values from
	a previous CALL. For example, recursively CALLing a STATIC SUBroutine
	and decrementing the passed parameter actually will change the value
	of the parameter when the procedure returns at the END SUB statement.
	However, the QuickBASIC editor incorrectly allows the recursive use of
	a STATIC subroutine or function without any side effects of changing
	the passed parameters. This problem can lead to subtle programming
	errors because the incorrect results don't become apparent until
	compile time.
	
	More information on recursion in Version 4.00 or 4.00b can be found
	on Pages 81-82 of "Microsoft QuickBASIC 4.0: Programming in BASIC:
	Selected Topics." For QuickBASIC Version 4.50, recursion is documented
	on Pages 71-72 of "Microsoft QuickBASIC: Programming in BASIC."
	
	The following is a code example:
	
	DECLARE SUB anysub (Param#)
	CLS
	 Param# = 10#
	 CALL anysub(Param#)
	END
	
	SUB anysub (Param#) STATIC
	  IF Param# > 1 THEN
	     CALL anysub(Param# - 1)
	  END IF
	  PRINT Param#;
	END SUB
	
	You will get the following results when this code sample is run in the
	QB.EXE editor:
	
	1  2  3  4  5  5  6  7  8  9  10
	
	You will get the following results when it is run as an executable
	.EXE program:
	
	1  1  1  1  1  1  1  1  1  1  10
