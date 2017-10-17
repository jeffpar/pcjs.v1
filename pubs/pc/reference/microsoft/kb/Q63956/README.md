---
layout: page
title: "Q63956: How to Scroll Text in BASIC Protected Mode Program Using API"
permalink: /pubs/pc/reference/microsoft/kb/Q63956/
---

## Q63956: How to Scroll Text in BASIC Protected Mode Program Using API

	Article: Q63956
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: OS/2
	Flags: ENDUSER | SR# S900710-57
	Last Modified: 17-JAN-1991
	
	This article describes how protected mode BASIC programs compiled with
	Microsoft BASIC Compiler versions 6.00 and 6.00b or Microsoft BASIC
	Professional Development System (PDS) version 7.00 or 7.10 can scroll
	text on the screen by calling the OS/2 API functions VioScrollUp(),
	VioScrollDn(), VioScrollLf(), and VioScrollRt(). A full example of
	using these routines is provided below.
	
	This information applies to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2 and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS OS/2.
	
	BASIC 6.00 and 6.00b and BASIC PDS 7.00 and 7.10 can directly call
	OS/2 API functions by linking with the appropriate library. This
	library is called DOSCALLS.LIB for BASIC 6.00 and 6.00b and OS2.LIB
	for BASIC PDS 7.00 and 7.10.
	
	The API functions VioScrollUp(), VioScrollDn(), VioScrollLf(), and
	VioScrollRt() all require the following parameters:
	
	   Parameter   Description
	   ---------   -----------
	
	   WORD        y (row) coordinate of upper left corner
	   WORD        x (column) coordinate of upper left corner
	   WORD        y (row) coordinate of lower right corner
	   WORD        x (column) coordinate of lower right corner
	   WORD        Number of lines or columns to scroll
	   PTR WORD    Contains character (lower byte) and attribute
	               (upper byte) used to fill blanked lines or columns
	   WORD        Video handle (0 = default)
	
	The first four parameters specify the rectangle in which the scrolling
	is to take place. Any area outside this rectangle is not scrolled. The
	sixth parameter specifies the character and attribute to use for the
	new lines or columns created behind the scrolling text. Note that a
	WORD in BASIC is an INTEGER, and any parameters preceded by the word
	"PTR" must be passed using the SEG clause in the DECLARE statement;
	BYVAL is used otherwise. The default for BASIC is to pass by reference
	(not BYVAL).
	
	The following program (SCROLL.BAS) displays a message on the screen
	and allows you to scroll the message up, down, left, or right using
	the cursor keys. Note that this example uses only the cursor keys on
	the numeric keypad, not the extended cursor keys. Any part of the
	message that is scrolled off the screen is lost. Press the ESC key to
	terminate execution.
	
	To compile and link the program, enter the following lines at the OS/2
	command prompt:
	
	   bc scroll /v ;
	   link scroll;
	
	Code Example
	------------
	
	'SCROLL.BAS
	DEFINT A-Z
	
	'Declarations for OS/2's Vio scroll functions.
	DECLARE FUNCTION VioScrollUp (BYVAL Y1      AS INTEGER,_
	                              BYVAL X1      AS INTEGER,_
	                              BYVAL Y2      AS INTEGER,_
	                              BYVAL X2      AS INTEGER,_
	                              BYVAL Lines   AS INTEGER,_
	                              SEG   FillNew AS INTEGER,_
	                              BYVAL Handle  AS INTEGER)
	
	DECLARE FUNCTION VioScrollLf (BYVAL Y1      AS INTEGER,_
	                              BYVAL X1      AS INTEGER,_
	                              BYVAL Y2      AS INTEGER,_
	                              BYVAL X2      AS INTEGER,_
	                              BYVAL Lines   AS INTEGER,_
	                              SEG   FillNew AS INTEGER,_
	                              BYVAL Handle  AS INTEGER)
	
	DECLARE FUNCTION VioScrollRt (BYVAL Y1      AS INTEGER,_
	                              BYVAL X1      AS INTEGER,_
	                              BYVAL Y2      AS INTEGER,_
	                              BYVAL X2      AS INTEGER,_
	                              BYVAL Lines   AS INTEGER,_
	                              SEG   FillNew AS INTEGER,_
	                              BYVAL Handle  AS INTEGER)
	
	DECLARE FUNCTION VioScrollDn (BYVAL Y1      AS INTEGER,_
	                              BYVAL X1      AS INTEGER,_
	                              BYVAL Y2      AS INTEGER,_
	                              BYVAL X2      AS INTEGER,_
	                              BYVAL Lines   AS INTEGER,_
	                              SEG   FillNew AS INTEGER,_
	                              BYVAL Handle  AS INTEGER)
	
	Y1 = 0    'Set the coordinates of the window scrolling area to define
	X1 = 0    'the whole screen (assuming 25 rows and 80 columns).
	Y2 = 24
	X2 = 79
	
	Lines    = 1       'Scroll one line at a time.
	FillNew  = 20010   'Fill the new lines/columns with yellow asterisks
	                   'on a red background.
	Handle   = 0       'Specifies the default OS/2 screen group.
	
	CLS                 'Clear screen and display the message to scroll.
	LOCATE 12, 30
	PRINT "Use arrows on numeric keypad to scroll."
	PRINT "Hit Esc to quit."
	
	ON KEY(11) GOSUB UpArrow      'Setup event handlers for key trapping.
	ON KEY(12) GOSUB LeftArrow    'Keys 11-14 are the arrow keys on the
	ON KEY(13) GOSUB RightArrow   'numeric keypad.
	ON KEY(14) GOSUB DownArrow
	
	KEY(11) ON   'Turn key trapping on.
	KEY(12) ON
	KEY(13) ON
	KEY(14) ON
	
	DO UNTIL INKEY$ = CHR$(27)   'Loop until the ESC key is pressed.
	LOOP
	END
	
	'Event handlers for key traps.
	UpArrow:    E = VioScrollUp (Y1, X1, Y2, X2, Lines, FillNew, Handle)
	            RETURN
	
	LeftArrow:  E = VioScrollLf (Y1, X1, Y2, X2, Lines, FillNew, Handle)
	            RETURN
	
	RightArrow: E = VioScrollRt (Y1, X1, Y2, X2, Lines, FillNew, Handle)
	            RETURN
	
	DownArrow:  E = VioScrollDn (Y1, X1, Y2, X2, Lines, FillNew, Handle)
	            RETURN
