---
layout: page
title: "Q21969: SCREEN 1 COLOR Yellow Is Brown (Muddy) on EGA Versus CGA Card"
permalink: /pubs/pc/reference/microsoft/kb/Q21969/
---

## Q21969: SCREEN 1 COLOR Yellow Is Brown (Muddy) on EGA Versus CGA Card

	Article: Q21969
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 11-JAN-1990
	
	The following program, which uses the COLOR statement on SCREEN 1, may
	give different colors on a machine with an EGA card compared to the
	colors on a machine equipped with a CGA card:
	
	   10 SCREEN 1
	   20 COLOR 8,0
	   30 LINE (30,100)-(40,150),3,bf
	   40 LINE (10,40)-(60,100),2,bf
	   50 LINE (100,100)-(130,130),1,bf
	
	The background color selected is dark gray (8). Palette 0 is selected,
	and includes red, green, and yellow on a CGA. Under QuickBASIC on an
	EGA card, the colors may appear "muddy" compared to running on a CGA
	card: the red and green are less intense than shown on a CGA card and
	the yellow is brown.
	
	This is not a problem with QuickBASIC, but is a difference between CGA
	and EGA cards. The EGA allows only nonintensified colors. The same
	colors occur on an EGA card in the Microsoft GW-BASIC Version 3.20,
	3.22, or 3.23 Interpreter on an EGA card.
	
	Note that in SCREEN 1 on an EGA or VGA, the PALETTE statement can
	change the color used by output from the PRINT statement, for example
	
	   PALETTE 3,n
	
	where n can be a color from 0 to 15. On an EGA card, PALETTE 3,6
	(where 6 is brown) is the default. PALETTE 3,14 will make PRINT output
	appear in yellow.
	
	The PALETTE statement is not supported on CGA cards. On a CGA card,
	the color of text output with the PRINT statement can only be changed to
	one of two possible colors by changing the palette argument of the
	COLOR statement. For example
	
	   COLOR b,p
	
	where b is the background color, and p (the palette) can be 0 or 1. If
	the p argument is 0, PRINT output displays in color number 6 (brown on
	an EGA, yellow on some CGA cards). If the p argument is 1, PRINT
	output displays in color number 7 (white). See the COLOR statement in
	the BASIC language reference documentation for more information.
	
	Graphics statements such as LINE and CIRCLE can use color (attribute)
	arguments 0, 1, 2, or 3 to allow simultaneous display of four colors
	at once (including the background) in SCREEN 1 on CGA, EGA, or VGA.
