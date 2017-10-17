---
layout: page
title: "Q45443: PAINT Fills Entire Screen If Border Color Is Not the Same"
permalink: /pubs/pc/reference/microsoft/kb/Q45443/
---

## Q45443: PAINT Fills Entire Screen If Border Color Is Not the Same

	Article: Q45443
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890524-91 B_GWBasicI B_BasicCom
	Last Modified: 13-DEC-1989
	
	The PAINT statement fills a graphics area with a specified color or
	pattern. PAINT fills the entire screen if the graphics area is not
	bound by a border of the same color or pattern.
	
	The PAINT statement is available in Versions 1.00, 1.01, 1.02, 2.00,
	2.01, 3.00, 4.00, 4.00b, and 4.50 of Microsoft QuickBASIC, Version for
	MS-DOS 3.21, 3.22, and 3.23 of Microsoft GW-BASIC, and Versions 6.00, 6.00b
	for MS-DOS and the Microsoft BASIC PDS 7.00 for MS-DOS.
	
	The PAINT statement has the following syntax:
	
	   PAINT [step] (x,y) [,[paint] [, [bordercolor] [,background]]]
	
	Note the following:
	
	1. step - Defines coordinates to be relative to the most recently
	   plotted point.
	
	2. (x,y) - The coordinates where painting begins. The point must lie
	   inside or outside of the figure, not on the border itself.
	
	3. paint - A numeric or string expression. If numeric, the number must
	   be a valid color attribute. The corresponding color is then used to
	   paint the graphic area. If no value for paint is used, the
	   foreground color attribute is used. If the corresponding paint
	   argument is a string, then PAINT does a "tiling" process to paint
	   the area. Consult the BASIC language reference manual for more on
	   "tiling."
	
	4. bordercolor - A numeric expression identifying the color attribute
	   to use to paint the border of the figure.
	
	5. background - A string value giving the "background tile slice" to
	   skip when checking for termination of the boundary.
	
	PAINT can be used to fill a graphic area denoted by the starting point
	(x,y). PAINT continues filling the screen until it reaches the
	termination color, which is the same color that it is currently
	filling, or the background argument specified above. If no background
	argument is specified, the default is CHR$(0).
	
	To fill only a specific image, the color that the graphic image was
	drawn in must match the fill color. The following code example
	illustrates this. Although the code example illustrates this feature
	with the DRAW functions, this feature is built into the PAINT
	statement and therefore holds true for all graphics functions (LINE,
	CIRCLE, etc.).
	
	Code Examples
	-------------
	
	'          PAINT.BAS
	SCREEN 9                      ' Sets video mode to EGA screen 9
	
	PSET (100, 100)               ' Positions pen to line 100 column 100
	DRAW "D50 R50 U50 L50"   ' Draws a 50x50 box starting from
	                          ' (100,100), with the default color
	                          ' (white).
	PAINT (125, 125)         ' Paints the box with the default color
	                     ' (white)
	
	DO WHILE INKEY$ = ""     ' Continuous loop until key pressed
	LOOP
	
	PSET (200, 200)               ' Reposition pen to line 200 column 200
	DRAW "D50 R50 U50 L50"   ' Draws a 50x50 box starting from
	                          ' (200,200), with the default color
	                          ' (white).
	
	DO WHILE INKEY$ = ""      ' Continuous loop until key pressed
	LOOP
	
	PAINT (225, 225), 1           ' Attempt to PAINT box with color BLUE,
	                          ' but will result in the whole screen
	                          ' being PAINTed.  If the box was drawn
	                          ' in BLUE, then this would work.
	
	'(DRAW "C1 D50 R50 U50 L50").
	END
