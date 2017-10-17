---
layout: page
title: "Q30860: Program Aborts after SHELL on COMPAQ 386/20, COMPAQ DOS 3.31"
permalink: /pubs/pc/reference/microsoft/kb/Q30860/
---

## Q30860: Program Aborts after SHELL on COMPAQ 386/20, COMPAQ DOS 3.31

	Article: Q30860
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 11-DEC-1989
	
	A program quits prematurely after executing a SHELL command if it is
	running under COMPAQ DOS Version 3.31. The problem has been duplicated
	only on a COMPAQ 386 running at 20-megahertz speed.
	
	The problem occurs both in the QB.EXE editor and in a compiled .EXE
	program.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b (buglist6.00, buglist6.00b) for MS-DOS.
	
	To work around this problem, use an older version of COMPAQ DOS, such
	as Version 3.20.
	
	The following code example demonstrates the problem:
	
	   PRINT "START"
	   SHELL "DIR A:"
	   PRINT "FINISH"
	   END
	
	The above program executes the SHELL and then ends without printing
	"FINISH".
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
