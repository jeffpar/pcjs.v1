---
layout: page
title: "Q29943: SCREEN Function Gives COLOR Attribute; Foreground, Background"
permalink: /pubs/pc/reference/microsoft/kb/Q29943/
---

## Q29943: SCREEN Function Gives COLOR Attribute; Foreground, Background

	Article: Q29943
	Version(s): 1.00 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 15-JAN-1991
	
	The SCREEN function can return the color attribute of a character on
	the screen. If the SCREEN function is invoked at a location where a
	character is printed, the color attribute returned is a combination of
	the foreground and background colors.
	
	If the character is not blinking (that is, the high-order, eighth bit
	is off), the foreground color can be obtained by taking the color
	attribute MOD 16, and the background color can be obtained by dividing
	the color attribute by 16. If the character is blinking, just turn off
	the eighth bit in the attribute byte before this calculation. For
	example:
	
	   X% = SCREEN (1, 1, 1)
	   X% = X% AND &H7F   ' Turns off bit 8.
	
	The following formula shows the relationship between the attribute and
	the foreground and background colors, taking into account all eight
	bits of the attribute:
	
	   ATTRIBUTE = 128*(FOREGROUND\16) + BACKGROUND*16 + (FOREGROUND MOD 16)
	
	This information applies to Microsoft QuickBASIC versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft
	BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2.
	
	The following is a bitmap of the attribute returned by the SCREEN
	function:
	
	        BIT ->    7     6     5     4     3     2     1     0
	               _________________________________________________
	               |  0  |  1  |  0  |  0  |  0  |  0  |  0  |  1  |
	               -------------------------------------------------
	                  ^     ^     ^     ^     ^     ^     ^     ^
	                  |     |     |     |     |     |     |     |
	        Blinking --     -------------     |     -------------
	                       |      Intensity --     |
	     Background Color --                       -- Foreground Color
	
	Code Example
	------------
	
	CLS
	COLOR 4, 1
	PRINT "hello";
	X% = SCREEN (1, 1, 1)
	PRINT "Attribute: "; X%
	X% = X% AND &H7F          ' Makes sure blinking bit (bit 8) is off.
	PRINT "Foreground: "; X% MOD 16
	PRINT "Background: "; X% \ 16
