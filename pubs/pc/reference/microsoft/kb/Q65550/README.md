---
layout: page
title: "Q65550: SHELL &quot;CHDIR&quot;, &quot;Input Path for Run-Time Module&quot; if No BC /O"
permalink: /pubs/pc/reference/microsoft/kb/Q65550/
---

## Q65550: SHELL &quot;CHDIR&quot;, &quot;Input Path for Run-Time Module&quot; if No BC /O

	Article: Q65550
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900823-137 buglist7.00 buglist7.10 B_QuickBas
	Last Modified: 14-DEC-1990
	
	A SHELL statement that changes the current directory or drive (using
	DOS's CHDIR command) will display the following message when returning
	control to the BASIC program if the program is compiled to require the
	BASIC run-time module (compiled without BC /O):
	
	   Input path for run-time module brt7nxxx.EXE [or brun4n.EXE,
	                                                or brun6nxx.EXE]
	
	This problem occurs only when you run the .EXE from its own directory,
	and BASIC's run-time module is also in that current directory. The
	problem does not occur if the .EXE or the run-time module is in a
	non-current directory (that is along the DOS PATH).
	
	Microsoft has confirmed this to be a problem in the Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS; in Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50
	(buglist4.00, buglist4.00b, buglist4.50) for MS-DOS; and in Microsoft
	BASIC Compiler versions 6.00 and 6.00b (buglist6.00, buglist6.00b) for
	MS-DOS. We are researching this problem and will post new information
	here as it becomes available.
	
	This problem does not occur in an OS/2 protected-mode program (in
	BASIC 6.00, 6.00b, 7.00, or 7.10).
	
	Any one of the following works around the problem:
	
	1. Create a stand-alone (BC /O) .EXE file.
	
	2. Run your compiled .EXE while a different directory is the current
	   directory. For example, if your PROG.EXE program is in the
	   directory C:\DIR1, then log on to any other directory and run
	   C:\DIR1\PROG or take advantage of the DOS PATH to find PROG.EXE.
	   (This problem occurs only when the current directory is the same
	   directory as where both the PROG.EXE program and the BASIC run-time
	   module sit.)
	
	Code Example
	------------
	
	The code example below duplicates the problem. Compile as follows:
	
	   BC TEST.BAS;
	   LINK TEST;
	
	To duplicate the problem, put both the TEST.EXE program and the BASIC
	run-time module (BRT7nxxx.EXE or BRUN4n.EXE or BRUN6nxx.EXE) into a
	subdirectory, make that subdirectory the current directory, then run
	TEST.EXE.
	
	   ' TEST.BAS
	   SHELL "CHDIR \"
	   PRINT "TEST"
