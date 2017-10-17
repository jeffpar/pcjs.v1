---
layout: page
title: "Q37421: Two BASIC Methods to Save &amp; Restore Text Screens in DOS &amp; OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q37421/
---

## Q37421: Two BASIC Methods to Save &amp; Restore Text Screens in DOS &amp; OS/2

	Article: Q37421
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	This article explains two methods for saving and restoring text-mode
	screens (SCREEN 0). The first method uses BLOAD and BSAVE (supported
	under MS-DOS only, not under OS/2 protected mode). The second method
	uses the SCREEN function to save and restore the values of the screen
	characters to and from a numeric array (supported under both MS-DOS
	and OS/2 protected mode).
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	(The October 27, 1987, issue of "PC Magazine" has a separate example
	of an assembly-language routine that saves and restores text screens;
	however, the code needs to be modified for QuickBASIC Versions 4.00,
	4.00b, and 4.50, for the BASIC compiler 6.00 and 6.00b, and for BASIC
	PDS 7.00.)
	
	First Method for Saving and Restoring Text-Mode Screens
	-------------------------------------------------------
	
	The following steps save the screen with BLOAD and BSAVE statements
	(under MS-DOS but not under OS/2 protected mode):
	
	1. Place the text on the screen using the following:
	
	   SCREEN 0  ' This is the default SCREEN mode.
	   FOR i = 1 TO 400
	     PRINT i;
	   NEXT i
	
	2. Use the following DEF SEG command to assign the current segment to
	   the correct video-memory location (not supported in OS/2 protected
	   mode):
	
	   DEF SEG=&HB000   'MONOCHROME CARD
	   DEF SEG=&HB800   'CGA,EGA CARD
	
	3. Use the BSAVE command below to save the screen (not supported in
	   OS/2 protected mode). In 23-line (CGA) mode, you need 4000 bytes to
	   save a complete text mode screen; (80 columns) times (25 lines)
	   times (1 character byte plus 1 color attribute byte) equals 4000
	   bytes. In EGA 43-line mode, you need 6880 bytes to save a complete
	   text mode screen (80 times 43 times 2). The BSAVE command is as
	   follows:
	
	   BSAVE "filename",0,4000  ' For CGA 23-line mode in SCREEN 0
	
	Use the following steps to restore the screen:
	
	1. Use the following DEF SEG command to assign the current segment to
	   the correct video-memory location:
	
	   DEF SEG=&HB000   'MONOCHROME CARD
	   DEF SEG=&HB800   'CGA,EGA CARD
	
	2. Use the following BLOAD command to reload the text:
	
	   BLOAD "filename",0
	
	Second Method for Saving and Restoring Text-Only on a Screen
	------------------------------------------------------------
	
	(Note: This method works both in MS-DOS and in OS/2 protected mode.)
	
	The second method (below) calls a BASIC routine to store the
	characters on a screen in an array, then restore them. This method
	uses the SCREEN function, which works both in MS-DOS and in OS/2
	protected mode, and in text or graphics screen modes. The SCREEN
	function returns the ASCII value of the character at a specified row
	and column (but returns the ASCII value 32, a blank, for text
	characters that are overlaid with graphics).
	
	Note: The following program is only a short sample. It doesn't include
	any error checking for coordinate validity. This and other possible
	enhancements are left up to you.
	
	DEFINT A-Z
	DECLARE SUB SaveScreen (StartCol, StartRow, ColLen, RowLen, arrar%())
	DECLARE SUB RestScreen (StartCol, StartRow, ColLen, RowLen, arrar%())
	COLOR 7, 1
	CLS
	COLOR 4
	FOR i = 1 TO 10
	    PRINT "This is a test"
	NEXT i
	COLOR 7
	INPUT "Enter the Save Starting Row : ";StartRow
	INPUT "Enter the Save Starting Column : ";StartCol
	INPUT "Enter the width (the number of columns) : "; col
	INPUT "Enter the height (the number of rows) : "; row
	DIM array%(col, row, 2)
	CALL SaveScreen(StartCol,StartRow, col, row, array%())
	PRINT "Hit any Key to continue...."
	while inkey$="" : wend
	COLOR 7,3
	CLS
	INPUT "Enter the Restore Starting Row : ";StartRow
	INPUT "Enter the Restore Starting Column : ";StartCol
	CALL RestScreen(StartCol, StartRow, col, row, array%())
	COLOR 7,3
	locate 25,10 : PRINT "Hit any key to quit..."
	WHILE INKEY$ = "": WEND
	END
	
	'============= Restore Screen =============
	SUB RestScreen (StartCol, StartRow, ColLen, RowLen, array%()) STATIC
	     FOR i = 1 TO RowLen
	        LOCATE StartRow + i, StartCol
	        FOR j = 1 TO ColLen
	           COLOR array%(j, i, 2) MOD 16, array%(j, i, 2) \ 16
	           PRINT CHR$(array%(j, i, 1));
	        NEXT j
	    NEXT i
	END SUB
	
	'============= Save Screen ===============
	SUB SaveScreen (StartCol, StartRow, ColLen, RowLen, array%()) STATIC
	    FOR i = StartCol TO (StartCol + ColLen - 1)
	        FOR j = StartRow TO (StartRow + RowLen - 1)
	            RowIndex = i - StartRow + 1
	            ColIndex = j - StartCol + 1
	            array%(RowIndex, ColIndex, 1) = SCREEN(j, i)    'character
	            array%(RowIndex, ColIndex, 2) = SCREEN(j, i, 1) 'color
	        NEXT j
	    NEXT i
	END SUB
