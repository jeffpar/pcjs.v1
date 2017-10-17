---
layout: page
title: "Q48725: &quot;Illegal Number&quot; Using -2147483648&amp; in Long Integer Notation"
permalink: /pubs/pc/reference/microsoft/kb/Q48725/
---

## Q48725: &quot;Illegal Number&quot; Using -2147483648&amp; in Long Integer Notation

	Article: Q48725
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890824-44 B_BasicCom
	Last Modified: 20-DEC-1989
	
	BC.EXE, QB.EXE, and QBX.EXE do not allow the "&" character on the end
	of the smallest (negative) constant allowed for a long integer,
	-2147483648. To enter the smallest long integer constant in your
	source code, you must use either (-2147483647& - 1&) or -2147483648#.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	The BC.EXE compiler reports an "Illegal type character in numeric
	constant" error, and the QB.EXE and QBX.EXE editors report an "Illegal
	number" error for the following statement:
	
	   A& = -2147483648&
	
	The error may have surprised you since -2147483648& is within the
	allowed range for long integers (-2147483648& to +2147483647&).
	
	However, this is not a software problem. Both the BASIC compiler and
	the QB and QBX interpreters parse -2147483648& as follows:
	
	   - (2147483648&)
	
	In other words, "take a large long integer and negate it." This means
	that the number is first parsed as a positive long integer and then it
	is negated before it is assigned to the number. However, the largest
	positive long integer is 2147483647 (one fewer than the largest
	negative number), making 2147483648& an illegal number, and therefore,
	causing an error.
	
	You must use one of the following instead:
	
	   A& = (-2147483647& - 1&)
	or
	   A& = -2147483648#
