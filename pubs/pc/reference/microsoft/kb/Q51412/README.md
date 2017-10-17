---
layout: page
title: "Q51412: How BASIC's Graphics GET Statement Stores Graphics in an Array"
permalink: /pubs/pc/reference/microsoft/kb/Q51412/
---

## Q51412: How BASIC's Graphics GET Statement Stores Graphics in an Array

	Article: Q51412
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890822-40 B_MQUICKB B_BASICCOM B_BasicInt B_GWBasicI
	Last Modified: 12-DEC-1989
	
	This article describes the format with which the graphics GET
	statement stores graphics in an array.
	
	This article applies to Microsoft GW-BASIC Interpreter Versions 3.20,
	3.22, 3.23 for MS-DOS, Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, Microsoft QuickBASIC Versions 1.00,
	1.01, 1.02, 2.00, 2.01, 3.00, 4.00, 4.00b and 4.50 for MS-DOS,
	Microsoft QuickBASIC Version 1.00 for the Apple Macintosh, Microsoft
	BASIC Compiler Version 1.00 for the Apple Macintosh, and Microsoft
	BASIC Interpreter Versions 1.00, 1.01, 2.00, 2.10, and 3.00  for the
	Apple Macintosh.
	
	This internal product information is provided as is, and may be
	subject to change or nondisclosure in future versions of BASIC.
	
	The graphics GET statement transfers a screen image into a specified
	array. The first 4 bytes in the array are two integers which specify
	how wide and long the stored image is in pixels, while the rest of the
	data stored in the array is a binary representation of the stored
	screen image, as shown in the following diagram:
	
	   +------------+------------+
	   | image width, in pixels  |  <-- 2-byte integer number
	   +------------+------------+
	   | image length, in pixels |  <-- 2-byte integer number
	   +--------+--------+--------+--------+--------+--------+
	   |        |        |   < binary image data >  |        |
	   +--------+--------+--------+--------+--------+--------+
	    byte #5   byte #6  byte #7
	
	The binary image data depends on the screen mode of the graphic image
	and is stored linearly in memory by pixel rows and columns. The GET
	statement scans the screen image by row from left to right and stores
	the bit representation of each pixel. Each row of the stored data will
	be padded out to an even byte boundary by NULL bytes (ASCII 0). The
	following is an example.
	
	   Take a square box drawn on the screen and stored with the following
	   program:
	
	      SCREEN 2   ' Delete this statement for Macintosh BASICs
	      DIM box%(1 to 5)
	      LINE (1, 1)-(10, 3), ,B
	      GET (1, 1)-(10, 3), box%
	
	   The first 4 bytes of box% will be as follows:
	
	      box%(1) = 10  ' The box is 10 pixels wide
	      box%(2) = 3   ' The box is 3 pixels long
	
	   The binary representation of the remaining bytes in the box% array
	   is as follows:
	
	      box%(3) = 11111111 11000000  <- Note padding of each row of bits
	      box%(4) = 10000000 01000000  <- Also note how the 1's form a box.
	      box%(5) = 11111111 11000000
	
	How GET Stores Color on an IBM PC or Compatible
	-----------------------------------------------
	
	On an IBM PC or compatible, the way the graphics GET statement stores
	color information depends upon the characteristics of the display
	mode. For screen modes with a single color plane (SCREENs 1, 2, 3,
	11, and 13), each pixel is represented by the number of bits per pixel
	per plane for the particular display mode. The following is an
	example.
	
	   If the square box given above were drawn in SCREEN mode 1 (2 bits
	   per pixel per plane) with the following program,
	
	      SCREEN 1
	      DIM box%(1 to 7)
	      LINE (1, 1)-(10, 3), ,B
	      GET (1, 1)-(10, 3), box%
	
	   then the binary representation of the image data bytes (after the
	   4-byte width and length header) would be as follows:
	
	      11111111 11111111 11110000
	      11000000 00000000 00110000   <- Notice 2 bits per pixel
	      11111111 11111111 11110000
	
	   Since no color was specified, the default color (white) was used
	   (thus all of the color bits were turned on).
	
	For SCREEN modes with multiple color pages (SCREENs 7, 8, 9, 10, and
	12), GET stores each display page separately by screen row. GET
	stores the binary information for one row of the graphics on the first
	color page and then the same row of graphics on the next color page,
	padding each row of color page information to an even byte boundary.
	The following is an example:
	
	   If the same square box were drawn in SCREEN mode 12 (four color
	   planes) in red with the following program,
	
	      SCREEN 12
	      COLOR 4   ' select red color
	      DIM box%(1 to 14)
	      LINE (1, 1)-(10, 3), ,B
	      GET (1, 1)-(10, 3), box%
	
	   then the binary representation of the image data bytes (again after
	   the 4-byte header) would be as follows:
	
	      00000000 00000000 <- blue plane
	      00000000 00000000 <- green plane
	      11111111 11000000 <- red plane (note padding to byte boundary)
	      00000000 00000000 <- intensity plane - first row finished
	
	      00000000 00000000 <- blue
	      00000000 00000000 <- green
	      10000000 01000000 <- red
	      00000000 00000000 < - intensity - second row
	
	      00000000 00000000
	      00000000 00000000
	      11111111 11000000
	      00000000 00000000 <- last row
	
	GET Doesn't Preserve Color in QuickBASIC for the Macintosh
	----------------------------------------------------------
	
	The graphics GET statement in Microsoft QuickBASIC Version 1.00 for
	the Macintosh does not preserve the colors of graphics in its array
	argument, and a subsequent graphics PUT using that array will draw in
	monochrome, using only the current foreground and background colors.
	
	The following list shows how the GET statement translates pixel colors
	on the screen and stores them in the array:
	
	1. White (or current background color) <= yellow, magenta, cyan, white
	
	2. Black (or current foreground color) <= red, green, blue, black
	
	The GET statement captures screen information as a bitmap only. Only
	the on or off status of each pixel -- not the color information -- is
	stored in the array.
	
	The ForeColor and BackColor MBLC routines built into QuickBASIC let
	you change the color used by subsequent graphics statements. Invoking
	ForeColor and BackColor will cause a subsequent graphics PUT to use
	that new foreground and background for all pixels drawn.
	
	Note that the earlier products, Microsoft BASIC Compiler Version 1.00
	for the Apple Macintosh and Microsoft BASIC Interpreter Versions 1.00,
	1.01, 2.00, 2.10, and 3.00 for the Apple Macintosh, do not support
	ForeColor or BackColor, or any color capabilities.
