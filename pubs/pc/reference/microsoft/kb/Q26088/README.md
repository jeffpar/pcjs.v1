---
layout: page
title: "Q26088: No Cursor Displayed in Graphics SCREENs 1, 2, 3, 7 through 13"
permalink: /pubs/pc/reference/microsoft/kb/Q26088/
---

## Q26088: No Cursor Displayed in Graphics SCREENs 1, 2, 3, 7 through 13

	Article: Q26088
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 26-OCT-1989
	
	When you poll the INKEY$ function, a blinking cursor is displayed only
	in SCREEN 0 (text mode), and not in any graphics screen mode. A
	blinking cursor is not displayed in SCREEN 1, 2, 3, 7, 8, 9, 10, 11,
	12, or 13 (please see the SCREEN statement in your BASIC language
	reference manual to find out which SCREEN modes your version of BASIC
	supports). This is a hardware video-graphics limitation, not a
	limitation of BASIC. This information applies to Microsoft QuickBASIC
	Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for
	MS-DOS, to the Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and OS/2, and to Microsoft GW-BASIC Versions 3.20, 3.22, and
	3.23.
	
	In graphics modes, to get a cursor (which will be non-flashing and
	block-shaped), you can use the INPUT or LINE INPUT statement. You may
	also design a program that draws a cursor.
	
	The following program does not display a blinking cursor in SCREEN
	modes other than 0:
	
	   SCREEN 9 ' using SCREEN 0 lets you see cursor.
	   LOCATE 1, 1, 1 ' Try to turn on the cursor
	   PRINT "t": CLS
	   10 a$ = INKEY$
	   IF a$ = "" THEN GOTO 10
	
	Using SCREEN 0, you get a blinking, underscore-shaped cursor while the
	INKEY$ function is being polled.
	
	There is a more detailed explanation of this text-mode cursor in the
	"Video Basics" chapter of Peter Norton's "Programmer's Guide to the
	IBM PC," published by Microsoft Press (see Page 92 of the 1985 edition
	and Page 94 of the 1988 edition).
	
	The blinking, underscore-shaped cursor is a feature of the text modes
	(i.e., SCREEN 0 only) and is created by hardware. To have a cursor in
	graphics mode, you must draw it within your program.
	
	Below is an example of drawing a graphics mode cursor in SCREEN 9. It
	uses the underscore character, clears the screen, and starts over
	after you reach line 25, column 80.
	
	SCREEN 9
	CLS
	PRINT "_"
	y% = 1 ' Start at row 1
	WHILE 1
	a$ = INKEY$
	IF a$ <> "" THEN
	  x% = POS(0)
	  LOCATE y%, x%
	  PRINT a$;
	  IF x% < 80 THEN
	     PRINT "_";
	     LOCATE y%, x% + 1
	  ELSEIF y% = 25 THEN
	      y% = 1
	      x% = 0
	      CLS
	  ELSE
	    y% = y% + 1
	    x% = 0 ' Set the column to zero.
	  END IF
	END IF
	WEND
