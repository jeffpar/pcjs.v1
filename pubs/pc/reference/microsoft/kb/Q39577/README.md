---
layout: page
title: "Q39577: DRAW &quot;Illegal Function Call&quot; In .EXE Compiled with BC /D"
permalink: /pubs/pc/reference/microsoft/kb/Q39577/
---

## Q39577: DRAW &quot;Illegal Function Call&quot; In .EXE Compiled with BC /D

	Article: Q39577
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom ptm226
	Last Modified: 10-APR-1989
	
	The program example below will draw a large number 1 on the screen.
	This program works correctly under QB.EXE and as a .EXE program when
	compiled WITHOUT the debug option.
	
	The program causes an "Illegal function call" at run time if compiled
	using the debug option (BC /D). The program can be modified to work
	correctly by using a single variable-length string instead of an
	element of a variable-length string array, i.e., B$ instead of A$(x)
	and by not using the VARPTR$ FUNCTION.  The following two statements
	will execute identically:
	
	                          DRAW "X" + VARPTR$(A$(1))
	                          DRAW A$(1)
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in the BASIC Compiler Versions 6.00 and
	6.00b (buglist6.00, buglist6.00b) for MS-DOS and OS/2. The program
	works correctly in QuickBASIC Version 3.00. We are researching this
	problem and will post new information as it becomes available.
	
	The following is a code example:
	
	DIM a$(65)
	a$(17) = "BU6BR2NG1D6L1R2BR4"
	SCREEN 1
	DRAW "BM52,52;s24;c1"
	DRAW "x" + VARPTR$(a$(17))
	INPUT x$
	END
