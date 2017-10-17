---
layout: page
title: "Q58564: 4.50 Must Reset PALETTE After WIDTH 80,60 in SCREEN 12"
permalink: /pubs/pc/reference/microsoft/kb/Q58564/
---

## Q58564: 4.50 Must Reset PALETTE After WIDTH 80,60 in SCREEN 12

	Article: Q58564
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 SR# S900201-95 B_BasicCom
	Last Modified: 21-SEP-1990
	
	When using the WIDTH 80,60 statement in SCREEN 12 of a BASIC program,
	you must reset the palette or you cannot change attributes 8 through
	15 of the 16-attribute palette.
	
	The following code example demonstrates this problem when executed in
	Microsoft QuickBASIC version 4.50 or Microsoft BASIC Professional
	Development System (PDS) version 7.00 for MS-DOS.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	version 4.50 and in Microsoft BASIC Professional Development System
	(PDS) version 7.00 for MS-DOS (buglist7.00). This problem was
	corrected in BASIC PDS 7.10 (fixlist7.10).
	
	To change the palette in the program, you must reset the palette using
	the PALETTE statement (with no arguments) after you use the WIDTH
	80,60 statement.
	
	This behavior in the above product versions differs from QuickBASIC
	versions 4.00 and 4.00b and Microsoft BASIC Compiler versions 6.00 and
	6.00b, where you do not need to reset the palette after WIDTH 80,60.
	
	Code Example
	------------
	
	     SCREEN 12
	     WIDTH 80, 60
	     'PALETTE         'Remove the quote to make it work correctly.
	     count = 0
	     FOR y = 0 TO 375 STEP 25
	        LINE (y + 2, y + 2)-(y + 25, y + 25), count, BF
	        count = count + 1
	     NEXT y
	     FOR x = 1 TO 15
	        PALETTE x, 63   ' Should change all boxes to same color.
	     NEXT x
	     END
