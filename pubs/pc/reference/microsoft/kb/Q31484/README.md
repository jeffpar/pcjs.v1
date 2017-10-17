---
layout: page
title: "Q31484: In 4.00b, PEN(0) Returns Zero in QB.EXE or Compiled BC /V"
permalink: /pubs/pc/reference/microsoft/kb/Q31484/
---

## Q31484: In 4.00b, PEN(0) Returns Zero in QB.EXE or Compiled BC /V

	Article: Q31484
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 24-MAR-1989
	
	PEN(0) always returns a value of zero when used within the QuickBASIC
	Version 4.00b editor or in a program that was compiled with the BC /V
	option. This problem occurs in QuickBASIC Version 4.00b and in the
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2
	(buglist6.00, buglist6.00b).
	
	A workaround is to compile the program with BC.EXE without the /V
	option.
	
	This problem was corrected by QuickBASIC Version 4.50.
	
	Results of testing with earlier versions show that the PEN
	function in QuickBASIC Version 4.00 causes the system to hang (query
	on PEN for a related article within this database).
	
	PEN(0) works properly in QuickBASIC Versions 3.00, 2.01, and 2.00.
	
	The following is a code example:
	
	   CLS
	   PEN ON
	   WHILE INKEY$ = ""
	      FOR i% = 1 TO 10000
	      NEXT i%  'Delay loop for readability
	      PRINT PEN(0)
	   WEND
