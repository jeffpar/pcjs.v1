---
layout: page
title: "Q26768: Colored Text in SCREEN 1 in QB Versions 2.x and 3.00, Not 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q26768/
---

## Q26768: Colored Text in SCREEN 1 in QB Versions 2.x and 3.00, Not 4.00

	Article: Q26768
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |  B_BasicCom
	Last Modified: 26-FEB-1990
	
	For QuickBASIC Versions 2.00, 2.01, and 3.00, it was reported that a
	particular POKE statement forces colored text from the PRINT statement
	when using SCREEN 1. This method does NOT work in QuickBASIC Versions
	4.00, 4.00b, 4.50 [or in Microsoft BASIC Compiler Versions 6.00,
	6.00b, or in Microsoft BASIC Professional Development System (PDS)
	Version 7.00] due to significant internal changes in how video
	graphics are created.
	
	The COLOR statement, not the POKE statement, should be used to change
	the color of text.
	
	You need to use SCREEN 0, 7, 8, 9, 10, 12, or 13 if you want more than
	one color of text displayed at once on the screen. On these screens,
	you can invoke the desired COLOR statement followed by a PRINT
	statement to get a desired text color. (QuickBASIC Version 4.00 or
	later is required to support SCREEN 11, 12, or 13.) Note: The COLOR
	statement cannot be invoked in monochrome SCREEN 2 or 11.
	
	Note: In SCREEN 1, the COLOR statement cannot change the foreground
	(text) color -- it can only change the background color and the
	palette. As a result, for a given background color, you may only have
	one color of text on the screen at once in SCREEN 1 in QuickBASIC
	4.00, 4.00b, 4.50, in BASIC Compiler 6.00, 6.00b, and in BASIC PDS
	7.00. To work around this limitation by using a BIOS interrupt, search
	for a separate article with the following words:
	
	   INTERRUPT and HEX and 10 and FUNCTION and 9 and COLOR
	
	The following is a code example that shows multiple text colors on the
	screen at once in QuickBASIC Versions 2.00, 2.01, or 3.00, but not in
	later versions:
	
	   'Numbering scheme for colors:
	   '    0 - black                 2 - light magenta
	   '    1 - light blue            3 - white
	   SCREEN 1
	   DEF SEG
	   POKE &H53, 2                ' numbers 0-3 give colored text
	   PRINT "HELLO in light magenta"
	   POKE &H53, 1
	   PRINT "HELLO in simultaneous light blue"
