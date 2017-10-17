---
layout: page
title: "Q52037: File Not Found: line#.c While Viewing Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q52037/
---

## Q52037: File Not Found: line#.c While Viewing Errors

	Article: Q52037
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM buglist2.00 buglist2.01
	Last Modified: 17-JAN-1990
	
	While viewing errors in the QuickC environment, it is possible to get
	a pop-up error message that looks similar to the following
	
	           __________________________
	          |                          |
	          |     File not found:      |
	          |         C:\##.c          |
	          |--------------------------|
	          |    < OK >    < HELP >    |
	          |__________________________|
	
	where ## is the line that the error occurred on before it was erased.
	
	This error occurs only if you delete the line that the error was found
	in before trying to view the now deleted line with SHIFT+F3.
	
	Microsoft has confirmed this to be a problem in QuickC Versions 2.00
	and 2.01. We are researching this problem and will post new
	information here as it becomes available.
	
	Sample Code
	-----------
	
	1:  void main (void)
	2:     {
	3:     printf()  /* Causes fatal error since there's no semicolon. */
	4:     }
	
	To see the pop-up error message, use the following steps:
	
	1. Compile the above program using the QuickC environment.
	
	2. After the compilation has aborted due to the fatal error, delete
	   the line that caused the error (in this case it is line #3).
	
	3. Press SHIFT+F3 to view the next error. The pop-up error message
	   should now be on your screen.
