---
layout: page
title: "Q38279: Long-Integer Array May Give Zero Unless Compiled /d (Debug)"
permalink: /pubs/pc/reference/microsoft/kb/Q38279/
---

## Q38279: Long-Integer Array May Give Zero Unless Compiled /d (Debug)

	Article: Q38279
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 13-MAR-1990
	
	Code Example 1 below shows a case where you must compile a QuickBASIC
	Version 4.00 or 4.00b program that uses LONG-integer arrays with the
	/d (debug) option, or else restructure the program as shown in Example
	2. Otherwise, the result of a division with a LONG-integer array may
	incorrectly result in zero.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	When Code Example 1 below is compiled with BC.EXE in QuickBASIC
	Version 4.00 or 4.00b, (in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2, the debug (/d) option is required). If you
	compile without using the /d option, the code produces the following
	printout:
	
	   20000  0  0  0
	   20000  0  0  0
	   20000  0  0  0
	
	Code Example 1 displays the following correct results when executed
	within the QB.EXE editor:
	
	   20000  20000  0  0
	   20000  20000  20000  0
	   20000  20000  20000  20000
	
	If you use a temporary variable to hold the value of Ddiv(ival) and
	then divide by the temporary variable, the correct results are
	generated (see Example 2).
	
	[Note that QuickBASIC versions earlier than 4.00 and BASIC compiler
	versions earlier than 6.00 do not support long integers.]
	
	The following are code examples:
	
	Example 1
	---------
	
	' Requires BC.EXE debug (/d) option in Versions 4.00 and 4.00b.
	' OK in BC.EXE Version 4.50 with or without /d (debug) option.
	DEFINT I, L: DEFLNG N: DEFDBL D
	DIM NVal(3), NNum(3), Ddiv(5)
	Ddiv(2) = 5
	Ival = 2
	FOR i = 0 TO 2
	  NNum(i) = 100000
	  NVal(i) = NNum(i) / Ddiv(Ival)
	  PRINT NVal(i); NVal(0); NVal(1); NVal(2)
	NEXT
	
	Example 2
	---------
	
	' This works with or without /d (debug) option in Versions 4.00,
	' 4.00b, and 4.50.
	DEFINT I, L: DEFLNG N: DEFDBL D
	DIM NVal(3), NNum(3), Ddiv(5)
	Ddiv(2) = 5
	Ival = 2
	FOR i = 0 TO 2
	  NNum(i) = 100000
	  DTemp = Ddiv(Ival)
	  NVal(i) = NNum(i) / DTemp
	  PRINT NVal(i); NVal(0); NVal(1); NVal(2)
	NEXT
