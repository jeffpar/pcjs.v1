---
layout: page
title: "Q46847: INKEY&#36; Example to Work Around ON KEY GOSUB Suspended by INPUT"
permalink: /pubs/pc/reference/microsoft/kb/Q46847/
---

## Q46847: INKEY&#36; Example to Work Around ON KEY GOSUB Suspended by INPUT

	Article: Q46847
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890703-77 B_GWBasicI B_BasicCom
	Last Modified: 19-OCT-1990
	
	This article includes a sample program demonstrating how to emulate a
	cursor during an INKEY$ loop, and how to trap the ESC, ENTER, and
	BACKSPACE keys using the INKEY$ function. This program allows you to
	enter text into a variable while supporting the option to exit the
	data entry by pressing the ESC key or the ENTER key. The BACKSPACE key
	lets you delete input data in this INKEY$ example.
	
	You may be motivated to use the INKEY$ function to accept user input
	because ON KEY GOSUB event trapping is suspended during an INPUT or
	LINE INPUT statement or an INPUT$ function. Instead of using ON KEY
	GOSUB event trapping to detect special key presses during input, and
	instead of using INPUT, LINE INPUT, or INPUT$ for your input, you can
	use the INKEY$ function in a continuous loop to process all keys.
	
	This information applies to the following:
	
	1. Microsoft GW-BASIC Interpreter versions 3.20, 3.22, and 3.23 for
	   MS-DOS
	
	2. Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, and 4.50 for MS-DOS
	
	3. Microsoft BASIC Compiler versions 6.00, and 6.00b for MS-DOS
	   and MS OS/2
	
	4. Microsoft BASIC PDS versions 7.00 and 7.10 for MS-DOS and MS OS/2
	
	The trapping of keys using the ON KEY GOSUB statement is temporarily
	suspended while INPUT, INPUT$, or LINE INPUT is pending. If a key
	being trapped by ON KEY GOSUB is pressed while an INPUT, INPUT$, or
	LINE INPUT is pending, the first occurrence of that event is remembered
	but is not executed until you satisfy the INPUT, INPUT$, or LINE
	INPUT. Only one key press for a given ON KEY GOSUB trap is remembered
	while an INPUT, INPUT$, or LINE INPUT is pending.
	
	As an alternative to using ON KEY GOSUB, and in order to continue
	event trapping during input, you can write a routine to input and
	process one character at a time using the INKEY$ function in a loop.
	Such a program example is shown at the bottom of this article.
	
	Related Topics
	--------------
	
	Note: INKEY$ returns a 2-byte STRING for all keys returning an
	extended keyboard KEY code, such as function keys F1 through F10. For
	additional information on this topic, query in this Knowledge Base
	using the following words:
	
	   INKEY$ and EXTENDED and 2-byte codes
	
	If you want to use both INKEY$ and ON KEY GOSUB trapping in the same
	program, you must take into account an extra required key press, as
	explained in a separate article, which may be found by querying using
	the following words:
	
	   INKEY$ and trap and additional and key and press
	
	For more information about the ON KEY GOSUB statement's key trapping
	being suspended by INPUT$, INPUT, or LINE INPUT, search for a separate
	article using the following words:
	
	   LINE INPUT and event and suspended
	
	Code Example
	------------
	
	When invoking INKEY$ in a loop, no cursor automatically displays
	(unlike for the INPUT or LINE INPUT statement). The following code
	example demonstrates how to emulate a cursor during an INKEY$ loop and
	also trap the ESC, the ENTER, and the BACKSPACE keys.
	
	'          INPTCHAR.BAS
	'    Written under QuickBASIC 4.50
	' Note: Line Labels, DECLARE, SELECT CASE, and SUBprograms are not
	' supported under GW-BASIC. The program would need to be
	' rewritten for GW-BASIC; however, the same principles using
	' INKEY$ apply to GW-BASIC.
	DECLARE SUB Cursor ()
	DECLARE SUB GetKey (a$)
	Col = 1
	Row = 7
	NewCol = 1
	CLS
	PRINT "---------------------------------------------------------"
	PRINT "This program will allow you to enter text into a"
	PRINT "variable while having control to exit the data entry with"
	PRINT "the ESCape key or the ENTER key. The BACKSPACE key is"
	PRINT "functional for editing."
	PRINT "---------------------------------------------------------"
	LOCATE Row, NewCol
	Cursor                   ' Emulate DOS cursor on screen
	
	DO WHILE NewCol < 81
	   LOCATE Row, NewCol
	   GetKey a$             ' Get User input
	   SELECT CASE ASC(a$)   ' Evaluate the character input from the
	                         ' keyboard
	      CASE 13, 27        ' Codes for CARRIAGE RETURN and ESCAPE
	         GOTO Done
	      CASE 8             ' Code for BACKSPACE
	         GOSUB Backspace
	      CASE ELSE
	         WholeLine$ = WholeLine$ + a$
	         LOCATE Row, Col
	         PRINT WholeLine$;
	         Cursor
	         NewCol = LEN(WholeLine$) + 1
	   END SELECT
	LOOP
	
	Done:               ' The ESCape key or ENTER key was pressed
	   LOCATE Row, Col
	   PRINT WholeLine$ + " "
	   PRINT
	   PRINT "The String you Entered is:  "; WholeLine$
	   END
	
	Backspace:          ' The BACKSPACE key was pressed
	   LOCATE Row, LEN(WholeLine$): PRINT "  "
	   WholeLine$ = LEFT$(WholeLine$, LEN(WholeLine$) - 1)
	   LOCATE Row, Col
	   PRINT WholeLine$;
	   Cursor
	   RETURN
	
	SUB Cursor
	   COLOR 23
	   PRINT "▄"
	   COLOR 7
	END SUB
	
	SUB GetKey (a$)
	   DO
	      a$ = INKEY$
	   LOOP WHILE a$ = ""
	END SUB
