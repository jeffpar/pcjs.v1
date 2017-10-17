---
layout: page
title: "Q60963: Wrong Colors Displayed If Map Mask Register Set Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q60963/
---

## Q60963: Wrong Colors Displayed If Map Mask Register Set Incorrectly

	Article: Q60963
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900306-100 B_BasicCom
	Last Modified: 14-MAY-1990
	
	If the color of a CIRCLE, DRAW, LINE, PCOPY, PSET, or PRESET statement
	does not turn out correctly in an EGA or VGA screen mode (except
	SCREEN 13), make sure that the lower 4 bits (bits 0 through 3) of the
	Mask Map register (&H3C5) are set. If any of these bits are cleared
	(not set), an attribute whose number requires those bits set will not
	be displayed properly.
	
	To set the lower 4 bits (also called the "low nibble") of the Mask Map
	register, execute the following statement:
	
	   OUT &H3C5, INP(&H3C5) OR 15
	
	This information applies to Microsoft QuickBASIC versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS, Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS, and Microsoft BASIC Professional
	Development System (PDS) version 7.00 for MS-DOS.
	
	Some graphics programming tasks require the manipulation of the mask
	map register, the most common of these being the use of BLOAD in an
	EGA or VGA screen mode (except SCREEN 13). The lower 4 bits of the
	register determine which attributes are used when color is displayed
	on the screen. If any of these bits are cleared and the attribute
	being used requires that they be set, the color that the attribute
	represents will not be displayed. Since the possible attributes for
	the affected screen modes range from 0 to 15, only 4 bits are needed
	for this purpose.
	
	For example, if all 4 bits are set, the low nibble of the map mask
	register has this internal representation:
	
	     3   2   1   0
	   +---+---+---+---+
	   | 1 | 1 | 1 | 1 |
	   +---+---+---+---+
	
	   2^0 + 2^1 + 2^2 + 2^3 = 1 + 2 + 4 + 8 = 15
	
	The nibble equals 15, allowing all attributes to be displayed.
	
	If the nibble is set to 13, it will look like the following:
	
	     3   2   1   0
	   +---+---+---+---+
	   | 1 | 1 | 0 | 1 |
	   +---+---+---+---+
	
	   2^0 + 2^2 + 2^3 = 1 + 4 + 8 = 13
	
	Since bit 1 is cleared in this case, any attribute that requires bit 1
	set will not be displayed.
	
	Let's look at how this will affect the display of attribute 14, which
	has this internal representation:
	
	     3   2   1   0
	   +---+---+---+---+
	   | 1 | 1 | 1 | 0 |
	   +---+---+---+---+
	
	   2^1 + 2^2 + 2^3 = 2 + 4 + 8 = 14
	
	Attribute 14 requires that bit 1 be set. Since bit 1 is cleared in the
	map mask register, attribute 14 cannot actually be displayed. Any
	reference to it in a graphics statement actually yields attribute 12,
	(which is just attribute 14 without bit 1 set) as in the following
	example:
	
	     3   2   1   0
	   +---+---+---+---+
	   | 1 | 1 | 0 | 0 |
	   +---+---+---+---+
	
	   2^2 + 2^3 = 4 + 8 = 12
	
	As mentioned above, the low nibble of the map mask register affects
	the color of the CIRCLE, DRAW, LINE, PCOPY, PSET, or PRESET
	statements. However, CIRCLE, DRAW, and LINE reset the nibble to 15
	upon their completion, so the color of the next graphics statement
	executed will turn out properly. Also any PRINT or CLS statement will
	reset the nibble. PCOPY, PSET, and PRESET have no effect on the map
	mask register.
	
	The following sample program demonstrates the effects of changing the
	low nibble of the map mask register. Each of the affected graphics
	statements is used to draw an object with 14 (yellow) as the
	attribute. Then the low nibble of the map mask register is set to 13,
	which clears bit 1. The graphics statement is again executed using
	attribute 14, but the attribute actually used to draw the color will
	be 12 (light red). The third time the graphics statement is executed,
	the attribute used will be 14 for CIRCLE, DRAW, or LINE, and 12 again
	for PCOPY, PSET, and PRESET.
	
	The statements DRAW and LINE become special cases if they are used to
	draw multiline objects. In this situation, only the first line of the
	object will have the wrong color because after it is drawn, the low
	nibble of the map mask register will be reset to 15. For example, if
	the LINE statement is used to draw a box (using the B parameter), the
	bottom line of the box will have the wrong color because it is drawn
	first, but the rest of the lines will use the correct attribute. This
	is also true with the DRAW statement -- each line drawn within the
	string macro constitutes a separate call to the LINE statement.
	
	The following program example contains SLEEP statements in certain
	places so you can view the results:
	
	'This program will work in SCREEN modes 7, 8, 9, 10, 11, and 12.
	
	SCREEN 9
	
	LINE (100, 0)-(100, 349), 14 'attribute 14 will be used.
	OUT &H3C5, 13                'clear bit 1 of map mask register.
	LINE (300, 0)-(300, 349), 14 'attribute 12 will be used instead of
	                             '14.
	LINE (500, 0)-(500, 349), 14 'attribute 14 can be used again.
	SLEEP
	
	CLS                   'bits 0-3 of map mask register will be set.
	PSET (100, 150), 14   'attribute 14 will be used.
	OUT &H3C5, 13         'clear bit 1 of map mask register.
	PSET (300, 150), 14   'attribute 12 will be used instead of 14.
	PSET (500, 150), 14   'attribute 12 will still be used.
	SLEEP
	
	CLS                        'bits 0-3 of map mask register will be
	                           'set.
	CIRCLE (100, 150), 20, 14  'attribute 14 will be used.
	OUT &H3C5, 13              'clear bit 1 of map mask register.
	CIRCLE (300, 150), 20, 14  'attribute 12 will be used instead of 14
	CIRCLE (500, 150), 20, 14  'attribute 14 can be used again.
	SLEEP
	
	CLS                     'bits 0-3 of map mask register will be set.
	PRESET (100, 150), 14   'attribute 14 will be used.
	OUT &H3C5, 13           'clear bit 1 of map mask register.
	PRESET (300, 150), 14   'attribute 12 will be used instead of 14.
	PRESET (500, 150), 14   'attribute 12 will still be used.
	SLEEP
	
	CLS                     'bits 0-3 of map mask register will be set.
	DRAW "C14BM100,0D349"   'attribute 14 will be used.
	OUT &H3C5, 13           'clear bit 1 of map mask register.
	DRAW "C14BM300,0D349"   'attribute 12 will be used instead of 14.
	DRAW "C14BM500,0D349"   'attribute 14 can be used again.
	SLEEP
	
	CLS                        'bits 0-3 of map mask register will be
	                           'set.
	DRAW "C14BM100,0D349R100"  'attribute 14 will be used for both
	                           'lines.
	OUT &H3C5, 13              'clear bit 1 of map mask register.
	DRAW "C14BM300,0D349R100"  'attribute 12 will be used for the 1st
	                           'line
	                           'drawn but 14 can be used for the 2nd
	                           'line.
	DRAW "C14BM500,0D349R100"  'attribute 14 will be used for both
	                           'lines.
	SLEEP
	
	CLS                               'bits 0-3 of map mask register
	                                  'will be set.
	LINE (100, 0)-(150, 349), 14, B   'attribute 14 will be used for all
	                                  'sides of the box.
	OUT &H3C5, 13                     'clear bit 1 of map mask register.
	LINE (300, 0)-(350, 349), 14, B   'attribute 12 will be used for the
	                                  'bottom side of the box (the 1st
	                                  'line drawn) but the other sides
	                                  'can
	                                  'use attribute 14.
	LINE (500, 0)-(550, 349), 14, B   'attribute 14 will be used for all
	                                  'sides of the box.
	SLEEP
	
	CLS                            'bits 0-3 of map mask register will
	                               'be set.
	LINE (300, 0)-(300, 349), 14   'attribute 14 will be used.
	SLEEP
	SCREEN 9, , 1, 1               'switch from page 0 to page 1.
	OUT &H3C5, 13                  'clear bit 1 of map mask register.
	PCOPY 0, 1                     'the copied line will use attribute
	                               '12
	                               'instead of 14.
	PCOPY 0, 1                     'the copied line will still use
	                               'attribute 12.
