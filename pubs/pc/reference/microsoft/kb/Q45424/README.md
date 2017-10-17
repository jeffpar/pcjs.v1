---
layout: page
title: "Q45424: SCREEN 9; 16 Foreground and Background Colors Simultaneously"
permalink: /pubs/pc/reference/microsoft/kb/Q45424/
---

## Q45424: SCREEN 9; 16 Foreground and Background Colors Simultaneously

	Article: Q45424
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890522-4 B_BasicCom
	Last Modified: 14-DEC-1989
	
	Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50, Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS, and Microsoft BASIC PDS
	Version 7.00 for MS-DOS support up to SCREEN 13, depending on the
	video card installed in your machine. Using the COLOR statement, in
	all color modes you can simultaneously display all foreground colors
	available in that particular mode.
	
	However, simultaneously displaying multiple background colors is
	supported only in SCREEN mode 0 (zero) (character mode). SCREEN 0 is
	the only SCREEN mode that supports displaying all 16 foreground colors
	and all 8 background colors simultaneously. When you invoke the COLOR
	statement with a background color argument in any SCREEN mode other
	than 0, you get only one background color, and the entire screen
	background is affected.
	
	The QuickBASIC program below contains routines that, if used in place
	of PRINT and COLOR when in SCREEN 9, provide the ability to display 16
	foreground colors and 16 "background" colors simultaneously. This
	program uses foreground colors with bit masking to draw inverse-video
	characters with multiple background colors simultaneously on the
	screen in graphics mode. The routines could easily be modified to
	support SCREEN 12. The support module, without any modification, can
	be converted into a .LIB library or left as an .OBJ object file and
	linked into your program.
	
	This support module operates correctly if compiled using QuickBASIC
	Versions 4.00, 4.00b, or 4.50, Microsoft BASIC Compiler Version 6.00
	or 6.00b for MS-DOS, or Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	For information on a similar technique for Hercules SCREEN 3, query on
	the word INVERSEPRINT.
	
	The module below contains two SUBprograms that can be CALLed in the
	same way as the PRINT or COLOR statements when the following $INCLUDE
	file is included, or can be used with the CALL statement. The INCLUDE
	file contains the DECLARE statements for the S9COLOR and S9PRINT and
	CONST declarations for all 16 colors so the colors can be referenced
	by name. The two routines are as follows:
	
	1. S9COLOR: Takes two parameters: foreground color and background
	   color, respectively. Unlike the COLOR statement, the parameters are
	   not optional. If you want to change only the foreground color, both
	   parameters must be provided. The COLOR statement can still be used,
	   but it will not affect strings printed using S9PRINT. The following
	   is an example:
	
	      S9COLOR Green, BrRed
	      CALL S9COLOR (BrBlue, Cyan)
	
	2. S9PRINT: Takes only one parameter, the STRING to be printed. The
	   parameter can be a simple STRING literal or a STRING expression. No
	   special formatting characters are supported, but they could easily
	   be added. Placing a pipe character (|) at the end of the STRING
	   causes a carriage return-linefeed to be executed after the STRING
	   is printed. The following is an example:
	
	      S9PRINT "This is the text to be printed"
	      S9PRINT A$+B$
	      S9PRINT STRING$(50,"X")
	      S9PRINT "The PIPE causes a CRLF|"  'the PIPE is not printed
	      CALL S9PRINT "CALL statement used"
	
	Code ($INCLUDE File S9LIB.BI)
	-----------------------------
	
	DECLARE SUB S9COLOR (fcolor%, bcolor%)
	DECLARE SUB S9PRINT (text$)
	CONST Black = 0, Blue = 1, Green = 2, Cyan = 3, Red = 4, Magenta = 5
	CONST Brown = 6, White = 7, Gray = 8, BrBlue = 9, BrGreen = 10
	CONST BrCyan = 11, BrRed = 12, Pink = 13, Yellow = 14, BrWhite = 15
	
	Code (Support Module S9LIB.BAS)
	-------------------------------
	
	'* Module level code:  Shared variables between SUBprograms
	DIM SHARED bgblock%(2242), tempblock%(2242)
	DIM SHARED fcolor%, bcolor%
	
	'* S9COLOR:  Simply stores the color values passed to the routine
	'*           in bcolor% and fcolor%, which are used in S9PRINT.
	SUB S9COLOR (nfcolor%, nbcolor%)
	  bcolor% = nbcolor%
	  fcolor% = nfcolor%
	END SUB
	
	'*********************************************************************
	'S9PRINT:  This routine will not wrap around if the string exceeds
	'column 80. It truncates whatever text is being printed at column 80.
	'The string length in pixels is first calculated. A LINE statement with
	'the BF option (Box Fill) using the desired background color is
	'executed. The resulting block of color is saved with a GET statement.
	'The string is then printed in the background color. The saved block of
	'background color is then PUT over the string. The resulting block of
	'text, which is a black foreground with the desired background color,
	'is then saved using another GET statement. The string is then
	'reprinted in the desired foreground color, and the block save with the
	'last GET statement is PUT over the text, resulting in the text printed
	'with the desired foreground and background colors, without affecting
	'the rest of the screen. The PUT statements are all executed using the
	'XOR action verb.
	'**********************************************************************
	SUB s9print (text$)
	  tx% = POS(0)
	  ty% = CSRLIN
	  col% = (tx% - 1) * 8
	  row% = (ty% - 1) * 14
	  maxpix% = 639 - col%
	  maxlength% = 81 - tx%
	  IF RIGHT$(text$, 1) = "|" THEN
	    CR% = 1
	    tlength% = (LEN(text$) - 1)
	    text$ = LEFT$(text$, tlength%)
	    tlength% = tlength% * 8 - 1
	  ELSE
	    CR% = 0
	    tlength% = LEN(text$) * 8 - 1
	  END IF
	  IF tlength% > maxpix% THEN
	    text$ = LEFT$(text$, maxlength%)
	    tlength% = maxpix%
	  END IF
	  LINE (col%, row%)-STEP(tlength%, 13), bcolor%, BF
	  GET (col%, row%)-STEP(tlength%, 13), bgblock%(0)
	  COLOR bcolor%
	  PRINT text$;
	  LOCATE ty%, tx%
	  PUT (col%, row%), bgblock%(0), XOR
	  GET (col%, row%)-STEP(tlength%, 13), bgblock%(0)
	  COLOR fcolor%
	  PRINT text$;
	  PUT (col%, row%), bgblock%(0), XOR
	  IF CR% = 1 THEN PRINT
	END SUB
	
	Code (Example of Main Program)
	------------------------------
	
	The program below demonstrates the use of the S9COLOR and S9PRINT
	routines. It simultaneously displays all the possible combinations of
	foreground and background colors.
	
	To compile the program, do the following:
	
	1. To create S9LIB.OBJ, issue the following command:
	
	      BC S9LIB;
	
	   To create S9LIB.LIB, issue the following command:
	
	      LIB S9LIB S9LIB.OBJ;
	
	2. If using S9LIB.OBJ, issue the following command:
	
	      BC S9DEMO;
	      LINK S9DEMO S9LIB;
	
	   If using S9LIB.LIB, issue the following command:
	
	      BC S9DEMO;
	      LINK S9DEMO,,,S9LIB
	
	S9DEMO.BAS
	----------
	
	'* S9DEMO.BAS     Demo for S9LIB.BAS  *
	'$INCLUDE: 'S9LIB.BI'
	DIM colornames$(15)
	FOR I% = 0 TO 14
	  READ colornames$(I%)
	NEXT I%
	SCREEN 9
	CLS
	FOR bc% = 0 TO 15
	  LOCATE , 2
	  FOR fc% = 0 TO 14
	    S9COLOR fc% + 1, bc%
	    S9PRINT colornames$(fc%)
	  NEXT
	  PRINT
	NEXT
	S9COLOR black, brred
	a$ = "PRESS ANY KEY|"
	LOCATE 23, 40 - (LEN(a$) \ 2)
	S9PRINT a$
	SLEEP
	END
	DATA Blue,Green,Cyan,Red,Magenta,Brown,White,Gray
	DATA BrBlue,BrGreen,BrCyan,BrRed,Pink,Yellow,BrWhite
