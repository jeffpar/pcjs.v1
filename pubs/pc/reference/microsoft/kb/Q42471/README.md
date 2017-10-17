---
layout: page
title: "Q42471: How to Scroll Text in Separately Defined Windows in QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q42471/
---

## Q42471: How to Scroll Text in Separately Defined Windows in QuickBASIC

	Article: Q42471
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890220-5 B_BasicCom
	Last Modified: 13-DEC-1989
	
	This article describes how to use a hardware interrupt to define
	scrollable text windows with viewing limits on all four sides. This
	information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50, to
	Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to Microsoft
	BASIC PDS Version 7.00 running under MS-DOS.
	
	In some languages such as PASCAL, text windows are easily defined with
	a function called WINDOW. After a window is defined, all text written
	to the screen appears only within the defined window, and only text
	within the window is scrolled up or down. There are two additional
	functions, DELLINE and INSLINE, that scroll the window contents up or
	down one line.
	
	Using the VIEW PRINT statements in QuickBASIC, a window can be
	defined, but only Rows (top and bottom, ymax and ymin) can be defined.
	Column limits (left and right, xmin and xmax) cannot be defined. Any
	window defined will always use the entire width of the screen.
	
	Defining Windows with left, right, top, and bottom limits in
	QuickBASIC requires just a little more work, but it can be done using
	the CALL INTERRUPT routine with Interrupt 10 Hex, functions 06 Hex
	(scroll up) and 07 Hex (scroll down).
	
	Interrupt 10 Hex, functions 06 Hex and 07 Hex, can define windows and
	scroll text within the defined window, but it does not prevent text
	from being written to other coordinates on the screen. Therefore, it
	is up to the programmer to write routines that will write text to the
	areas defined as Windows. Interrupt 10 Hex, functions 06 Hex and 07
	Hex will scroll the text up or down.
	
	Code Example
	------------
	
	The following program demonstrates the use of Interrupt 10 Hex,
	functions 06 Hex and 07 Hex. Three separate Windows are defined by the
	following:
	
	   Window number
	   Window color
	   Window limits: left, right, top, bottom
	
	Random text is written to each Window, scrolling the text up or down
	as required.
	
	'***************************************
	' Text Windowing Demonstration program.
	' (Interrupt 10H, functions 06H and 07H)
	'***************************************
	' Define the TYPE needed for INTERRUPT (you could
	' use REM $INCLUDE:'QB.BI' as an alternative under QuickBASIC
	' 4.00, 4.00b, 4.50 or the BASIC compiler 6.00 or 6.00b. Use
	' REM $INCLUDE:'QBX.BI' as an alternative under the BASIC
	' PDS 7.00):
	
	TYPE RegType
	     ax    AS INTEGER
	     bx    AS INTEGER
	     cx    AS INTEGER
	     dx    AS INTEGER
	     bp    AS INTEGER
	     si    AS INTEGER
	     di    AS INTEGER
	     flags AS INTEGER
	END TYPE
	DECLARE SUB Interrupt (intnum%, inregs AS RegType, _
	                       outregs AS RegType)
	DECLARE SUB ScrollWindowUp (windowN%, numlines%)
	DECLARE SUB ScrollWindowDown (windowN%, numlines%)
	DECLARE SUB InitializeWindow (windowN%,Wcolor%,left%,_
	                              top%,right%,bottom%)
	DECLARE SUB DrawBorder (windowN%)
	DIM SHARED windows(5, 5) AS INTEGER      'allow max of 5 windows
	DIM SHARED inregs AS RegType, outregs AS RegType
	
	CLS
	VIEW PRINT                           'use entire screen 25 X 80
	LOCATE 25, 27
	COLOR 15, 6
	PRINT " PRESS ANY KEY TO QUIT ";
	InitializeWindow 1, 5, 10, 35, 3, 21               'Initialize 3
	InitializeWindow 2, 2, 45, 70, 3, 11               'separate windows
	InitializeWindow 3, 1, 40, 70, 15, 21
	
	DO
	  LOCATE 22, 11
	  COLOR 15, windows(1, 1)
	  FOR I% = 1 TO 26                           'print one full line of
	    PRINT CHR$(INT(RND * 200) + 32);         'random characters at
	  NEXT I%                                    'bottom of Window #1 and
	  ScrollWindowUp 1, 1                        'Scroll Up one line
	
	  LOCATE 12, 46
	  COLOR 15, windows(2, 1)
	  FOR I = 1 TO 26                            'print one full line of
	    PRINT CHR$(INT(RND * 200) + 32);         'random characters at
	  NEXT                                       'bottom of Window #2 and
	  ScrollWindowUp 2, 1                        'Scroll Up one line
	
	  LOCATE 16, 41
	  COLOR 15, windows(3, 1)
	  FOR I = 1 TO 31                            'print one full line of
	    PRINT CHR$(INT(RND * 200) + 32);         'random characters at
	  NEXT I                                     'top of Window #3 and
	  ScrollWindowDown 3, 1                      'Scroll Down one line
	LOOP UNTIL INKEY$ <> ""
	END
	
	'********************************************************************
	' SUBprogram: InitializeWindow - Interrupt 10H function 06H or 07H
	'             Stores the Window information for the Window specified
	'             in the ARRAY windows, then uses
	'             CALL INTERRUPT with Interrupt 10H to initialize Window
	'
	'                AH = function 06H or 07H (scroll up or scrol down)
	'                AL = 00H   if zero, window is blanked
	'                BH = color of window
	'                CH = top window border
	'                CL = left window border
	'                DH = bottom window border
	'                DL = right window border
	'********************************************************************
	SUB InitializeWindow(windowN%, Wcolor%, left%, right%, top%, bottom%)
	  windows(windowN%, 1) = Wcolor%
	  windows(windowN%, 2) = left%
	  windows(windowN%, 3) = top%
	  windows(windowN%, 4) = right%
	  windows(windowN%, 5) = bottom%
	  inregs.ax = &H600
	  inregs.bx = Wcolor% * 4096
	  inregs.cx = top% * 256 + left%
	  inregs.dx = bottom% * 256 + right%
	  CALL Interrupt(&H10, inregs, outregs)
	  DrawBorder windowN%
	END SUB
	
	'**********************************************************
	' SUBprogram: ScrollWindowDown - Interrupt 10H function 07H
	'
	'             AH = function 07H
	'             AL = number of lines to scroll
	'             BH = window color
	'             CH = top window border
	'             CL = left window border
	'             DH = bottom window border
	'             DL = right window border
	'**********************************************************
	SUB ScrollWindowDown (windowN%, numlines%)
	  inregs.ax = 1792 + numlines%
	  inregs.bx = windows(windowN%, 1) * 4096
	  inregs.cx = windows(windowN%, 3) * 256 + windows(windowN%, 2)
	  inregs.dx = windows(windowN%, 5) * 256 + windows(windowN%, 4)
	  CALL Interrupt(&H10, inregs, outregs)
	END SUB
	
	'********************************************************
	' SUBprogram: ScrollWindowUp - Interrupt 10H function 06H
	'
	'             AH = function 06H
	'             AL = number of lines to scroll
	'             BH = window color
	'             CH = top window border
	'             CL = left window border
	'             DH = bottom window border
	'             DL = right window border
	'********************************************************
	SUB ScrollWindowUp (windowN%, numlines%)
	  inregs.ax = 1536 + numlines%
	  inregs.bx = windows(windowN%, 1) * 4096
	  inregs.cx = windows(windowN%, 3) * 256 + windows(windowN%, 2)
	  inregs.dx = windows(windowN%, 5) * 256 + windows(windowN%, 4)
	  CALL Interrupt(&H10, inregs, outregs)
	END SUB
	
	'***********************************************
	' SUBprogram: DrawBorder
	'             Draws a solid border around window
	'             specified using character #219
	'***********************************************
	SUB DrawBorder (windowN%)
	  COLOR 14, 0
	  FOR I% = windows(windowN%, 3) TO windows(windowN%, 5) + 2
	    LOCATE I%, windows(windowN%, 2)
	    PRINT CHR$(219)
	    LOCATE I%, windows(windowN%, 4) + 2
	    PRINT CHR$(219)
	  NEXT I%
	  FOR I% = windows(windowN%, 2) + 1 TO windows(windowN%, 4) + 1
	    LOCATE windows(windowN%, 3), I%
	    PRINT CHR$(219)
	    LOCATE windows(windowN%, 5) + 2, I%
	    PRINT CHR$(219)
	  NEXT I%
	END SUB
