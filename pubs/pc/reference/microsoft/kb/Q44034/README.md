---
layout: page
title: "Q44034: How Bits in PAINT Tiling String Represent Pixels in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q44034/
---

## Q44034: How Bits in PAINT Tiling String Represent Pixels in BASIC

	Article: Q44034
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890427-81 B_BasicCom
	Last Modified: 7-FEB-1990
	
	For the best explanation of tiling with the PAINT statement, please
	refer to one of the following manuals:
	
	1. Pages 181 to 191 (Section 5.8.2, "Painting with Patterns: Tiling")
	   of the "Microsoft QuickBASIC 4.5: Programming in BASIC" manual for
	   Version 4.50
	
	2. Pages 228 to 239 (Section 5.8.2, "Painting with Patterns: Tiling")
	   of the "Microsoft QuickBASIC 4.0: Programming in BASIC: Selected
	   Topics" manual for Versions 4.00 and 4.00b
	
	3. Pages 228 to 239 (Section 5.8.2, "Painting with Patterns: Tiling")
	   of "Microsoft BASIC Compiler 6.0: Programming in BASIC: Selected
	   Topics" for Versions 6.00 and 6.00b for MS OS/2 and MS-DOS
	
	4. Pages 179 to 189 ("Painting with Patterns: Tiling") of "Microsoft
	   BASIC 7.0: Programmer's Guide" for Microsoft BASIC Professional
	   Development System (PDS) Version 7.00 for MS OS/2 and MS-DOS
	
	The tiling information on these pages also applies to QuickBASIC 2.00,
	2.01, and 3.00 (which support only SCREENs 0, 1, 2, 7, 8, 9, 10).
	
	Please also see a separate article in this Knowledge Base, which can be
	found by querying on the following words:
	
	   PAINT and tiling and QuickBASIC
	
	Consider the following sentence taken from the PAINT statement in the
	language reference manual:
	
	   In the tile string, each byte masks eight bits along the x-axis
	   when putting down points.
	
	The effect of each bit on screen pixels depends upon how many
	attributes are in that screen mode. On two-attribute screen modes
	(SCREENs 2, 3, 4, 11), each bit in the tile string directly represents
	a pixel, and each byte in the tile string represents 8 pixels along
	the x-axis. In graphics screens with more than two attributes (1, 7,
	8, 9, 10, 12, 13), each pixel is represented by more than 1 bit (in
	order to carry the extra color information). In SCREEN 13, which has 8
	bits per pixel, tiling is not very useful. Tiling is most flexible in
	SCREENs 2, 3, 4, and 11.
