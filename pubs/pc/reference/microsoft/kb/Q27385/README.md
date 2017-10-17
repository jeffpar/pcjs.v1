---
layout: page
title: "Q27385: LINE INPUT to Fixed-Length String Crashes QB.EXE Interpreter"
permalink: /pubs/pc/reference/microsoft/kb/Q27385/
---

## Q27385: LINE INPUT to Fixed-Length String Crashes QB.EXE Interpreter

	Article: Q27385
	Version(s): 4.00
	Operating System: MS-DOS
	Flags: ENDUSER | ptm37 fixlistbc6.00 buglist4.00 fixlist4.00b fixlist4.50
	Last Modified: 7-NOV-1988
	
	Using a fixed-length string to accept input in a LINE INPUT statement
	can hang the QB.EXE Interpreter.
	
	Microsoft has confirmed this to be a problem in Version 4.00. This
	problem was corrected in QuickBASIC Versions 4.00b and 4.50, and in
	the Microsoft BASIC Compiler Version 6.00 for MS-DOS and OS/2.
	
	The following is an example program showing the problem:
	
	   DIM C AS STRING * 10
	   LINE INPUT C
	   PRINT C
	
	Run the program and type 1 in response to the LINE INPUT. This will
	hang QB.EXE.
	
	The workaround for this problem is to LINE INPUT into a
	variable-length string and then assign to a fixed-length string.
