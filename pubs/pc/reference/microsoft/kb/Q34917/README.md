---
layout: page
title: "Q34917: PRINT to Viewport Has Screen's Background Color Not Viewport's"
permalink: /pubs/pc/reference/microsoft/kb/Q34917/
---

## Q34917: PRINT to Viewport Has Screen's Background Color Not Viewport's

	Article: Q34917
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	When PRINTing text to a viewport that has a different color than the
	main screen, the background color of the text will be the same as the
	background color of the screen, not the viewport. This is expected
	behavior.
	
	This information applies to Microsoft QuickBASIC Versions 4.00 4.00b
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	If you have one window on the screen, you can use the following
	method:
	
	1.  Switch to graphics mode.
	
	2.  Change the background color to be the color of the window.
	
	3.  Paint the screen the actual background color.
	
	4.  Draw the window.
	
	5.  Print the text.
	
	Note that steps 2 and 3 will cause a flash on the screen. This cannot
	be avoided. The following is a code sample:
	
	SCREEN 9
	COLOR 7, 1
	VIEW (0, 0)-(639, 349), 2
	VIEW (100, 100)-(300, 300), 1
	LOCATE 20, 20: PRINT "This is a test"
	WHILE INKEY$ = "": WEND
	
	The following is a code example of the undesired result:
	
	REM  This is a sample program that demonstrates printing
	REM  text to a viewport. The background color of the text
	REM  printed to the viewport is the same as that of the
	REM  screens.
	  CLS
	  SCREEN 9
	REM Screen has green foreground and light blue background:
	  COLOR 10, 11
	REM Set up first viewport with red background:
	  VIEW (10, 10)-(600, 200), 12, 11
	REM Print is green with light blue background:
	  LOCATE 1, 11: PRINT "Outer viewport"
	REM Set up second viewport with purple background:
	  VIEW SCREEN (50, 50)-(350, 150), 5, 7
	REM Print is green with light blue background:
	  LOCATE 9, 9: PRINT "Inner viewport"
	  END
