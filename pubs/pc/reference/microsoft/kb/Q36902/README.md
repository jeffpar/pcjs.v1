---
layout: page
title: "Q36902: LOCATE Draws Cursor Differently on Monochrome Versus Color"
permalink: /pubs/pc/reference/microsoft/kb/Q36902/
---

## Q36902: LOCATE Draws Cursor Differently on Monochrome Versus Color

	Article: Q36902
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	The statement LOCATE ,,,8,8 will create a cursor that will appear
	differently on different screens. With a monochrome card, there will
	be a single-line cursor one-third of the way up from the lowest level
	of the line. When using a normal color display, the cursor will be at
	the lowest level of the line. But this same command on an IBM PS/2
	model 25 or 30 will cause the cursor to be at the top of the line. You
	may LOCATE ,,,7,7 on the PS/2 model 25 or 30 to create the cursor on
	the bottom of the line.
	
	This information applies to QuickBASIC Versions 3.00, 4.00, 4.00b, and
	4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS, and to Microsoft BASIC PDS Version 7.00 for MS-DOS and MS
	OS/2.
	
	The following is a code example:
	
	CLS
	DEF SEG = 0
	IF PEEK(&H449) = 7 THEN
	   b = 12
	ELSE
	   b = 7
	END IF
	LOCATE 10, 10, 1, b, b
	PRINT "Bottom line cursor including ps/2 model 25 or 30"
	LOCATE 10, 15, 1, b, b
	WHILE INKEY$ = "" :WEND
