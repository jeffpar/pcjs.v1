---
layout: page
title: "Q58955: Twice-Called String FUNCTION May Fail in QB/QBX Quick Library"
permalink: /pubs/pc/reference/microsoft/kb/Q58955/
---

## Q58955: Twice-Called String FUNCTION May Fail in QB/QBX Quick Library

	Article: Q58955
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 buglist7.10 B_QuickBas
	Last Modified: 6-AUG-1990
	
	In the QBX.EXE or QB.EXE environment, a STATIC string FUNCTION located
	in a Quick library (.QLB) that is invoked twice within the same PRINT
	or assignment statement may give incorrect results. This problem only
	exists with a STATIC string FUNCTION in a Quick library that is
	invoked twice in one statement with a plus sign (+, for string
	concatenation) connecting the two invocations. This problem can be
	worked around easily by using temporary variables and splitting the
	statement into two statements. The problem does not occur in compiled
	and linked .EXE programs.
	
	Microsoft has confirmed this to be a problem in the QBX.EXE
	environment shipped with Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS, in the QB.EXE
	environment shipped with Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS, and in the QB.EXE environment shipped with Microsoft
	QuickBASIC versions 4.00, 4.00b, and 4.50 (buglist4.00, buglist4.00b,
	buglist4.50) for MS-DOS. We are researching this problem and will post
	new information here as it becomes available.
	
	Code Example
	------------
	
	The following code example demonstrates the problem:
	
	   FUNCTION Foop$(x$) STATIC
	     Foop$ = x$ + "Z"
	   END FUNCTION
	
	The module above should be compiled and built into a Quick library,
	then QBX should be started with that Quick library. Calling this
	FUNCTION twice in a row gives the incorrect results, as follows:
	
	   DECLARE FUNCTION Foop$(x$)
	   PRINT Foop$("abc")+Foop$("def")
	
	This example prints "defZdefZ" instead of correctly printing
	"abcZdefZ".
