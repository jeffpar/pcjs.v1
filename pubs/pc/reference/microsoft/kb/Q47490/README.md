---
layout: page
title: "Q47490: Displaying Inverse Video Text in Hercules SCREEN 3"
permalink: /pubs/pc/reference/microsoft/kb/Q47490/
---

## Q47490: Displaying Inverse Video Text in Hercules SCREEN 3

	Article: Q47490
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890717-67 SR# S890522-4 B_BasicCom
	Last Modified: 15-JAN-1991
	
	The QuickBASIC program in this article contains a routine that
	demonstrates how to display text in inverse video on a Hercules
	monochrome graphics card in SCREEN 3.
	
	The program runs correctly if compiled using QuickBASIC version 4.00,
	4.00b, or 4.50, Microsoft BASIC Compiler version 6.00 or 6.00b for
	MS-DOS, or Microsoft BASIC PDS version 7.00 or 7.10 for MS-DOS.
	
	The general procedure is as follows:
	
	1. Draw a box on the screen with the LINE statement using the BF (Box
	   Fill) argument. The filled-in box will act as the background on
	   which the text will appear. The box should be of the same height
	   and width as the line of text to be displayed.
	
	2. Use the graphics GET statement to store the background block in an
	   array.
	
	3. Print the line of text to be displayed.
	
	4. Use the graphics PUT statement with the XOR argument to place the
	   block of background color over the text.
	
	The result is a black foreground with a highlighted background (in
	other words, inverse video).
	
	Note: The resulting display is all foreground. What appears to be the
	background is actually foreground color. The above steps construct a
	character that is a solid block with the outline of the character cut
	out of the middle.
	
	For more information about performing a similar operation on a color
	graphics adapter, search in this Knowledge Base on the following
	words:
	
	   foreground and background and GET and PUT and 16 and simultaneously
	
	This separate article explains how you can use as many background
	colors as foreground colors in SCREEN 9.
	
	Code Example
	------------
	
	The InversePrint SUBprogram below takes only one parameter, the STRING
	to be displayed. The parameter can be a simple STRING literal or a
	STRING expression. No special formatting characters are supported, but
	they could easily be added.
	
	Following is the code for the module IPRINT.BAS, which contains the
	InversePrint SUBprogram:
	
	'* Module name:        IPRINT.BAS                          *
	'* Global variables:                                       *
	DIM SHARED bgblock%(2242)  'holds background block         *
	
	'***********************************************************
	'*                                                         *
	'* InversePrint:                                           *
	'*           This routine will not wrap around if the      *
	'*           string exceeds column 80. It truncates        *
	'*           whatever text is being printed at column 80.  *
	'*                                                         *
	'*           The string length in pixels is first calcu-   *
	'*           lated. A LINE statement with the BF option    *
	'*           (Box Fill) using the amber background color   *
	'*           is executed. The resulting block of color is  *
	'*           saved with a GET statement. The string is     *
	'*           then printed. The saved block of background   *
	'*           is then PUT over the text with XOR option,    *
	'*           thus the text appears in inverse video.       *
	'*                                                         *
	'***********************************************************
	SUB InversePrint (text$)
	  'get cursor position and determine size of text
	  tx% = POS(0)
	  ty% = CSRLIN
	  col% = (tx% - 1) * 9
	  row% = (ty% - 1) * 14
	  maxpix% = 719 - col%
	  maxlength% = 81 - tx%
	  tlength% = LEN(text$) * 9
	
	  'truncate text if longer than 80 columns
	  IF tlength% > maxpix% THEN
	    text$ = LEFT$(text$, maxlength%)
	    tlength% = maxpix%
	  END IF
	
	  'draw background box and GET it into an array
	  LINE (col%, row%)-STEP(tlength%, 13), 7, BF
	  GET (col%, row%)-STEP(tlength%, 13), bgblock%(0)
	  PRINT text$;
	
	  'XOR background box with text on screen
	  LOCATE ty%, tx%
	  PUT (col%, row%), bgblock%(0), XOR
	END SUB
	
	The following demonstrates how to compile InversePrint and how to call
	it from another module (IPDEMO.BAS):
	
	1. To create IPRINT.OBJ:  BC IPRINT;
	   To create IPLIB.LIB:   LIB IPLIB IPRINT;
	
	2. If using IPRINT.OBJ:   BC IPDEMO;
	                          LINK IPDEMO IPRINT;
	
	   If using IPLIB.LIB:    BC IPDEMO;
	                          LINK IPDEMO,,,IPLIB;
	
	The following is the code for IPDEMO.BAS, which makes calls to
	InversePrint:
	
	'* Module:       IPDEMO.BAS
	'* Description:  This program demonstrates how to call InversePrint.
	'* Note:         InversePrint prints the text at the current cursor
	'*               position.
	DECLARE SUB InversePrint (test$)
	SCREEN 3
	CLS
	A$ = "A$ +"
	B$ = "B$"
	LOCATE 1
	InversePrint "This is the text to be printed"
	LOCATE 2
	InversePrint A$ + B$
	LOCATE 3
	InversePrint STRING$(50, "X")
	LOCATE 4
	CALL InversePrint("CALL statement used")
	WHILE INKEY$ = "": WEND
