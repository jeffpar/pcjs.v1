---
layout: page
title: "Q44241: .EXE with PRINT TAB or SPC Can Hang If Compiled with BC /S"
permalink: /pubs/pc/reference/microsoft/kb/Q44241/
---

## Q44241: .EXE with PRINT TAB or SPC Can Hang If Compiled with BC /S

	Article: Q44241
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890208-138 buglist4.50
	Last Modified: 16-MAY-1989
	
	An .EXE program compiled in Microsoft QuickBASIC Version 4.50 can
	hang when all of the following three conditions are met:
	
	1. The program was compiled with the BC /s option.
	
	2. The program was printed with the PRINT or PRINT# statement.
	
	3. Any combination of TAB or SPC functions was used in the PRINT or
	   PRINT# statement.
	
	The following are workarounds for the problem:
	
	1. Break your program into smaller modules so that the /s switch is
	   not needed.
	
	2. When compiling, include the /X switch, which is normally used to
	   indicate the presence of ON ERROR with RESUME, RESUME NEXT, or
	   RESUME 0.
	
	This problem occurs only with Microsoft QuickBASIC Version 4.50, not
	with QuickBASIC Version 4.00 or 4.00b or with the Microsoft BASIC
	Compiler Version 6.00 or 6.00b. We are researching this problem and
	will post new information as it becomes available.
	
	The following program example demonstrates the problem that occurs
	when a program is compiled with the BC /s option:
	
	   c$ = "hello"
	   d$ = "bye"
	   print tab(8); c$; tab(16); d$
