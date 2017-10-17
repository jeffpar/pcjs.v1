---
layout: page
title: "Q26009: CONST &quot;Syntax Error&quot; with BC.EXE 4.00, but Works in Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q26009/
---

## Q26009: CONST &quot;Syntax Error&quot; with BC.EXE 4.00, but Works in Editor

	Article: Q26009
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 25-APR-1989
	
	The following line of code compiles properly inside the QB.EXE Version
	4.00, 4.00b, or 4.50 editor, but BC.EXE issues a "Syntax error" at the
	last parenthesis at compile time, as follows:
	
	   CONST True% = (0=0)
	
	QB.EXE Version 3.00 issues an "illegal constant" error message when
	this code is either run from memory or compiled.
	
	To work around this problem, use -1 or any other nonzero value to
	represent a logical TRUE, as follows:
	
	   CONST True% = -1
	   CONST False% = 0
	
	Microsoft is researching this problem and will post new information
	as it becomes available.
