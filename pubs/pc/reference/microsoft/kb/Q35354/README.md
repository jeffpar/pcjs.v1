---
layout: page
title: "Q35354: QB.EXE Single Step Is Not Reliable with &#36;INCLUDE Lines"
permalink: /pubs/pc/reference/microsoft/kb/Q35354/
---

## Q35354: QB.EXE Single Step Is Not Reliable with &#36;INCLUDE Lines

	Article: Q35354
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 8-DEC-1989
	
	When using the F8 key in the QuickBASIC editor to single step through
	a program that has included lines, the current line is not always what
	it should be. QuickBASIC will not single step through the second
	include file.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b and in the QB.EXE editor that comes with the
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (buglist6.00, buglist6.00b). This problem was corrected in
	QuickBasic Version 4.50 and in QBX.EXE of the Microsoft BASIC Compiler
	Version 7.00 (fixlist7.00).
	
	The following program can be used to demonstrate this problem:
	
	' Include file INC1.H:
	  GOTO 900
	
	' Include file INC2.H:
	  900 PRINT "At 900"
	  905 PRINT "At 905"
	  908 END
	
	' QuickBASIC program INCTEST.BAS:
	  REM $INCLUDE: 'INC1.H'
	  REM $INCLUDE: 'INC2.H'
	
	To reproduce the problem using the above program, do the following:
	
	1. Choose the Included Lines option on the View menu.
	
	2. Choose the Restart option on the Run menu.
	
	3. Press F8 to single step.
	
	The current line is at 908, not at 900 as expected.
