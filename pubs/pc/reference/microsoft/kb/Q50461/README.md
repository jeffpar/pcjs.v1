---
layout: page
title: "Q50461: COLOR Statement in SCREEN 11 Gives &quot;Illegal Function Call&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q50461/
---

## Q50461: COLOR Statement in SCREEN 11 Gives &quot;Illegal Function Call&quot;

	Article: Q50461
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891027-16 B_BasicCom docerr
	Last Modified: 15-JAN-1990
	
	The COLOR statement correctly returns an "Illegal Function Call" if
	used in SCREEN 11. The only way to change the color in SCREEN 11 is to
	use the PALETTE statement. However, note that the PALETTE statement
	may not work with a video card that is not 100-percent compatible with
	the IBM standard VGA or MCGA. (SCREEN 11 requires VGA or MCGA.)
	
	The following resources incorrectly state that the COLOR statement is
	valid in SCREEN modes 11-13; they should instead say SCREEN modes
	12-13:
	
	1. Two occurrences, on Page 109 of the "Microsoft QuickBASIC 4.0: BASIC
	   Language Reference" manual for QuickBASIC Versions 4.00 and 4.00b
	
	2. Two occurrences, on Page 109 of the "Microsoft BASIC Compiler 6.0:
	   BASIC Language Reference" manual for Versions 6.00 and 6.00b
	
	3. One occurrence, under the COLOR statement in the QB Advisor online
	   Help system for QuickBASIC Version 4.50
	
	This documentation error was corrected in the "Microsoft QuickBASIC
	4.5: BASIC Language Reference" manual for QuickBASIC Version 4.50, in
	the Microsoft BASIC Professional Development System (PDS) 7.00 "BASIC
	Language Reference," and in the Microsoft Advisor online Help system
	in the QuickBASIC Extended editor (QBX.EXE) shipped with BASIC PDS
	Version 7.00.
	
	The PALETTE statement can be used instead of the COLOR statement in
	SCREEN 11 to set the foreground and background colors. Note that the
	foreground color can only be set for graphics statements; text will
	always be blue.
	
	To change the foreground color in SCREEN 11, the following PALETTE
	statement must be used:
	
	   PALETTE 1, color
	
	To change the background color in SCREEN 11, the following PALETTE
	statement must be used:
	
	   PALETTE 0, color
	
	Below is another code example demonstrating how to set the foreground
	and background colors in SCREEN 11 using the PALETTE statement:
	
	' VGA color equation: COLOR number = 65536 * blue + 256 * green + red
	'   where red, blue, and green are numbers between 0 and 63
	CLS
	SCREEN 11
	background& = 256 * 63   'bright green
	foreground& = 63         'bright red
	PALETTE 0, background&
	PALETTE 1, foreground&
	LINE (10, 240)-(630, 240)
	WHILE INKEY$ = "": WEND
