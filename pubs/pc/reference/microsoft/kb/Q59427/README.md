---
layout: page
title: "Q59427: BC.EXE &quot;Internal Error Near x&quot; Using Static Long Integer Array"
permalink: /pubs/pc/reference/microsoft/kb/Q59427/
---

## Q59427: BC.EXE &quot;Internal Error Near x&quot; Using Static Long Integer Array

	Article: Q59427
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900305-180 B_BasicCom buglist4.00 buglist4.00b buglist4
	Last Modified: 20-SEP-1990
	
	Indexing a static long-integer array with an expression containing
	subtraction or division can cause the error, "Internal Error Near
	xxxx," at compile time with BC.EXE. Addition and multiplication work
	correctly; only division and subtraction cause the error.
	
	To work around the problem, change the expression to use addition or
	multiplication, or use a variable instead of an expression to
	subscript the static long-integer array.
	
	Microsoft has confirmed this to be a problem in the BC.EXE environment
	of Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50 for MS-DOS; in
	the BC.EXE environment of Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b); and in the
	BC.EXE environment of Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2 (buglist7.00,
	buglist7.10). We are researching this problem and will post new
	information here as it becomes available.
	
	This problem does not occur in the QB.EXE or QBX.EXE environment.
	
	Code Example
	------------
	
	The following code example produces the "Internal Error Near xxxx"
	error when compiled with BC.EXE. An example of the workaround
	suggested above is listed in a comment after the offending statement.
	
	Compile the program below as follows:
	
	   BC INTERNAL.BAS;
	
	(Note that the BC /D and /O compiler options do not eliminate the
	problem.)
	
	' INTERNAL.BAS
	DIM A&(10, 10)
	'Subtraction and division cause error, not addition or multiplication:
	B& = A&(i%, 1 - i%) + A&(i%, i%)   'Remove this line to prevent error
	'B& = A&(i%, 0 + 1 - i%) + A&(i%, i%) 'Equivalent line works correctly
