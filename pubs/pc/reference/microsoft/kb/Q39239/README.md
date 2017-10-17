---
layout: page
title: "Q39239: &quot;Expression Too Complex&quot;, &quot;Stack Overflow&quot;, Adding Strings"
permalink: /pubs/pc/reference/microsoft/kb/Q39239/
---

## Q39239: &quot;Expression Too Complex&quot;, &quot;Stack Overflow&quot;, Adding Strings

	Article: Q39239
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 20-SEP-1990
	
	When the program below concatenates more than 19 string variables
	together in one equation, the BC.EXE compiler can give a misleading
	error message at compile time.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS; in Microsoft BASIC Compiler
	versions 6.00 and 6.00b (buglist6.00, buglist6.00b) for MS-DOS and MS
	OS/2; and in Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 (buglist7.00, buglist7.10) for MS-DOS and MS
	OS/2. We are researching this problem and will post new information
	here as it becomes available.
	
	To work around this problem, split up the concatenation line so that
	the program does two concatenations on separate lines.
	
	In QuickBASIC versions 4.00 and 4.50 and BASIC PDS 7.00, BC.EXE gives
	the following correct error message, but the message misleadingly
	points to the bottom of the next structure (IF..ENDIF, WHILE..WEND,
	or SELECT CASE) in the source file after the concatenation:
	
	   Expression Too Complex
	
	BC.EXE should point to the concatenation instead of to the end of the
	structure.
	
	In QuickBASIC version 4.00b and Microsoft BASIC Compiler versions 6.00
	and 6.00b for MS-DOS and OS/2, BC.EXE displays the following error
	message in a continuous stream; you must press CTRL+C or CTRL+BREAK to
	stop the compiler:
	
	   run-time error R6000 - stack overflow
	
	The following program will cause problems:
	
	   REM The line continuation character (_) is for display purposes
	   REM only and should be removed when typing in the program.
	   WHILE a$ = ""
	   b$ = INKEY$
	   a$ = b$ + c$ + d$ + e$ + f$ + g$ + h$ + i$ + j$ + k$ + l$ _
	           + m$ + n$ + o$ + p$ + q$ + r$ + s$ + t$ + u$
	   WEND
	
	The program can be changed as follows to correct the problem:
	
	   WHILE a$ = ""
	   b$ = INKEY$
	   a$ = b$ + c$ + d$ + e$ + f$ + g$ + h$ + i$ + j$ + k$ + l$
	   a$ = a$ + m$ + n$ + o$ + p$ + q$ + r$ + s$ + t$ + u$
	   WEND
