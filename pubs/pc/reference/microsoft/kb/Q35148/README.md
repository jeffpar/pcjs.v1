---
layout: page
title: "Q35148: Underline, Reverse, Intense, Blinking in Monochrome SCREEN 0"
permalink: /pubs/pc/reference/microsoft/kb/Q35148/
---

## Q35148: Underline, Reverse, Intense, Blinking in Monochrome SCREEN 0

	Article: Q35148
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 16-DEC-1989
	
	On the Hercules Graphics Adapter (HGA) or the IBM Monochrome Display
	Adapter (MDA), the foreground and background arguments of the COLOR
	statement support underlined, reverse-video (highlighted), blinking,
	or high-intensity characters. Reverse/underline and intense/reverse
	combinations are not supported by HGA or MDA.
	
	The following 11 combinations of COLOR statement foreground and
	background values are available on monochrome, SCREEN 0 (text)
	displays:
	
	   FORMAT                  COLOR Statement       ATTRIBUTE
	
	White on black (normal)       COLOR 7,0              7
	Black on black (no display)   COLOR 0,0              0
	Black on white (reverse)      COLOR 0,7            112
	Underline                     COLOR 1,0              1
	Intense                       COLOR 10,0            10
	Blinking                      COLOR 18,0           130
	Reverse blinking              COLOR 16,7           240
	Intense underline             COLOR 9,0              9
	Intense blinking              COLOR 26,0           138
	Underline blinking            COLOR 17,0           129
	Intense blinking underline    COLOR 25,0           137
	
	This information applies to the following products:
	
	1. Microsoft QuickBASIC Compiler Versions 4.00, 4.00b, 4.50
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	   MS OS/2
	
	3. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	4. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and later
	
	In SCREEN 0 with a color card (CGA, EGA, or VGA), the COLOR statement
	is used to change the foreground and background colors that are
	displayed. The COLOR statement also lets you select intense or
	blinking options for the foreground color. Underlining is not
	supported on color monitors.
	
	In text mode (SCREEN 0), two consecutive bytes are used to store each
	character in screen memory. One byte contains the ASCII value of a
	character, and the following byte contains ATTRIBUTE information for
	that character. Attributes can be calculated with the following
	formula:
	
	ATTRIBUTE = 128*(FOREGROUND\16)+BACKGROUND*16+(FOREGROUND MOD 16)
	
	[Note: The backslash character (\) is the integer division operator.]
	
	See Pages 79-81 of "The Peter Norton Programmer's Guide to the IBM PC"
	(published by Microsoft Press, 1985) for more information about
	attributes.
	
	The following book from Microsoft Press describes video details more
	completely:
	
	   "Programmer's Guide to PC & PS/2 Video Systems," by Richard Wilton
	   (1987). Chapter 3 describes the alphanumeric video modes.
	
	The following is a code example:
	
	'This program will display all of the character formats resulting from
	'each of the 32 foreground colors available for any of the 8
	'recognized background colors with a monochrome card in SCREEN 0 (text
	'mode).
	
	   DEFINT A-Z
	5  CLS
	   LOCATE 20, 15
	   COLOR 7, 0
	   liner = 0
	   INPUT "background="; back
	   FOR fore = 0 TO 31
	        IF liner = 16 THEN
	                liner = 0
	        END IF
	        liner = liner + 1
	        LOCATE liner, 1 + (20 * (fore \ 16))
	        PRINT fore; back;
	        COLOR fore, back
	        PRINT "A"
	        COLOR 7, 0
	   NEXT fore
	   WHILE INKEY$ = "": WEND
	   GOTO 5
