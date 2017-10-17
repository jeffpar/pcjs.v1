---
layout: page
title: "Q41395: COLOR &quot;Illegal Function Call&quot; in SCREEN 2; Use PALETTE on EGA"
permalink: /pubs/pc/reference/microsoft/kb/Q41395/
---

## Q41395: COLOR &quot;Illegal Function Call&quot; in SCREEN 2; Use PALETTE on EGA

	Article: Q41395
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 14-DEC-1989
	
	If you invoke the COLOR statement while under SCREEN 2, you will
	always get an "Illegal Function Call" error message at run time.
	SCREEN 2 does not support the COLOR statement in any version of
	Microsoft QuickBASIC, GW-BASIC, or Microsoft BASIC Compiler Versions
	6.00 or 6.00b, or Microsoft BASIC PDS Version 7.00.
	
	On a CGA card, you can get only black and white in SCREEN 2.
	
	To get color in SCREEN 2, you must have an EGA or VGA card and you
	must invoke the PALETTE statement to change colors. You can have only
	two colors on the screen at once in SCREEN 2. You can choose from
	sixteen different colors (0 through 15).
	
	The PALETTE statement can be invoked with the following syntax on a
	computer with an EGA or VGA card:
	
	   PALETTE attribute,colornumber
	
	In the above syntax, attribute=0 assigns the background color and
	attribute=1 assigns the foreground color in SCREEN 2. You may specify
	colornumber to be a color number from 0 through 15.
	
	You can only use attribute numbers 0 and 1 with the PALETTE statement
	in SCREEN 2; any other number will give you an "Illegal Function Call"
	error at run time.
	
	The following is a code example:
	
	' This must be run on a computer that has an EGA or VGA card.
	SCREEN 2
	PALETTE 0, 5  ' Background set to Magenta (color number=5)
	PALETTE 1, 2  ' Foreground set to Green (color number=2)
	PRINT "This prints in the foreground color"
