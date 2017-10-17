---
layout: page
title: "Q58105: Explanation of Tiling in BASIC; PAINTing with Patterns"
permalink: /pubs/pc/reference/microsoft/kb/Q58105/
---

## Q58105: Explanation of Tiling in BASIC; PAINTing with Patterns

	Article: Q58105
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900114-17 B_BasicCom
	Last Modified: 5-MAR-1990
	
	The QuickBASIC PAINT statement can be used to paint a region of the
	screen in a particular color or pattern. PAINTing with a pattern is
	called "tiling."
	
	The syntax for the paint statement is as follows:
	
	   PAINT [STEP] (x,y) [,[paint] [,[bordercolor] [,[background]]]
	
	The variable labeled "paint" is used to control the color of the
	painted region. If it is a numeric value, then the number must be a
	valid color attribute. The corresponding color is used to paint the
	area. If paint is left blank, then the foreground color attribute is
	used.
	
	However, if you use a string in this part of the PAINT statement, then
	this string is used to do "tiling." This article describes how to do
	tiling in different screen modes.
	
	For an in-depth explanation of tiling, please see the following
	manuals:
	
	1. "Microsoft QuickBASIC 4.5: Programming in BASIC," Pages 181-191
	
	2. "Microsoft QuickBASIC 4.0: Programming in BASIC: Selected Topics,"
	   Pages 226-239
	
	3. "Microsoft BASIC 7.0: Programmer's Guide," Pages 179-189
	
	4. "Microsoft BASIC Compiler 6.0: Programming in BASIC: Selected
	   Topics," Pages 226-239
	
	5. "Microsoft QuickBASIC Compiler" manual for Versions 2.00, 2.01, and
	   3.00, Pages 380-382
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, 4.50 for MS-DOS; to Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2; and to
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2.
	
	Each tile for a pattern is composed of a rectangular grid of pixels.
	This tile grid can have up to 64 rows in all screen modes. However,
	the number of pixels in each row depends on the screen mode. This is
	because, depending on the number of color attributes per screen, each
	pixel can be represented by a varying number of bits.
	
	The formula for the number of bits per pixel is as follows:
	
	   Bits-per-pixel = Log (base 2) of the number-of-attributes
	
	The number-of-attributes is the number of color attributes in that
	screen mode.
	
	The following table gives the bits-per-pixel and length-of-tile-row
	for each screen mode:
	
	   Screen Mode      Bits-per-Pixel       Length-of-Tile-Row
	   -----------      --------------       ------------------
	
	    1                     1                     8 pixels
	    2                     2                     4 pixels
	    3                     1                     8 pixels
	    4                     1                     8 pixels
	    7                     4                     2 pixels
	    8                     4                     2 pixels
	    9                     2                     4 pixels
	   10                     2                     4 pixels
	   11                     1                     8 pixels
	   12                     4                     2 pixels
	   13                     8                     1 pixel
	
	The easiest way to define a tile row is with the CHR$() function. This
	function defines one byte (8 bits) in the tiling string. It is also
	easiest to use two hexadecimal digits per byte since they are easily
	converted to 4 bits per digit. For instance, the following line
	
	   TILE$ = CHR$(&HF0)
	
	sets up a tiling string with the value 11110000. It is used in a
	PAINT statement, such as the following:
	
	   PAINT (100,100), TILE$
	
	SCREENS 2, 3, 4, and 11
	-----------------------
	
	In screen modes with only two attributes (modes 2, 3, 4, and 11), the
	tiling string is very simple since each bit equals one pixel. A one
	(1) means that the pixel is on and a zero (0) means that the pixel is
	off.
	
	SCREENS 1, 9, and 10
	--------------------
	
	In screen modes with four attributes (modes 1, 9, and 10), the tiling
	is only a little more complicated since a pixel is represented by two
	bits. For instance, if the two bits were 01, then the pixel would be
	drawn in color 1. If they were 11, then the pixel would be color 3.
	One byte would equal 4 pixels. The byte 00011011 would draw 4 pixels
	in color 0, 1, 2, and 3 consecutively. The tiling string for 00011011
	would be the following:
	
	   TILE$ = CHR$(&H1B)   '0001 = &H1, 1101 = &HB
	
	SCREENS 7, 8, and 12
	--------------------
	
	Tiling in EGA and VGA screen modes with more than 4 colors is a lot
	more complicated. In these modes, it takes more than one row (byte) to
	define a tiling row. This is because each pixel is represented
	three-dimensionally in a stack of "bit planes," rather than
	sequentially in a single plane.
	
	Below is an example of how to define a multicolored pattern consisting
	of rows of alternating yellow and magenta in a screen mode with 16
	color attributes (modes 7, 8, and 12). The following table shows how
	the colors are defined for each pixel and how to arrange them into
	CHR$() statements:
	
	              Column
	          1 2 3 4 5 6 7 8
	        -------------------
	Row 1     1 1 0 0 0 0 1 1   =    CHR$(&HC3)
	Row 2     0 0 1 1 1 1 0 0   =    CHR$(&H3C)
	Row 3     1 1 1 1 1 1 1 1   =    CHR$(&HFF)
	Row 4     0 0 1 1 1 1 0 0   =    CHR$(&H3C)
	
	     TILE$ = CHR$(&HC3)+CHR$(&H3C)+CHR$(&HFF)+CHR$(&H3C)
	
	The preceding line defines 8 pixels of the colors magenta, magenta,
	yellow, yellow, yellow, yellow, magenta, magenta. This combination
	results in alternating stripes of magenta and yellow. You can get the
	color by reading each column from BOTTOM to TOP. For instance, the
	first pixel is defined in column 1 by the color number 0101. This is
	color 5, which defaults to magenta. The sixth pixel is defined by the
	number 1110, or color 14, which is yellow in the default palette.
	
	To paint a circle with this pattern, you would do the following:
	
	   SCREEN 12
	   TILE$ = CHR$(&HC3)+CHR$(&H3C)+CHR$(&HFF)+CHR$(&H3C)
	   CIRCLE (100,100),50       'a circle of radius 50
	   PAINT (100,100),TILE$
	   END
	
	SCREEN 13
	---------
	
	Screen mode 13, which has 256 attributes, works differently than the
	other EGA and VGA modes. You have a lot less flexibility with screen
	13 than you do with even the two-color screens. The most that you can
	do with screen 13 tiling is to create horizontal lines of different
	colors. This is very simple since one byte is equal to one pixel
	color. Therefore, one CHR$() statement defines one line or row.
	
	To paint a circle with alternating lines of color 5 (magenta) and
	color 14 (yellow), you would do the following:
	
	   SCREEN 13
	   TILE$ = CHR$(&H5) + CHR$(&HE)   'colors 5 and 14
	   CIRCLE (100,100),50
	   PAINT (100,100),TILE$
	   END
