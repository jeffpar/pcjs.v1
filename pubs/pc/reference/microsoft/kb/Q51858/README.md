---
layout: page
title: "Q51858: Complete Listing of SCREEN Modes for Compiled BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q51858/
---

## Q51858: Complete Listing of SCREEN Modes for Compiled BASIC

	Article: Q51858
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR#891130-1156 B_BasicCom
	Last Modified: 14-DEC-1989
	
	Below is a complete listing of the modes of the SCREEN statement for
	Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50 for MS-DOS,
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS, and
	Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	This information can also be found in the BASIC language reference
	manuals for the above products, in the QB.EXE 4.50 (but not 4.00 or
	4.00b) on-line Help screen, and in the QBX.EXE 7.00 on-line Help
	screen.
	
	The color adapter acronyms are defined as follows.
	
	   MDPA = IBM Monochrome Display and Printer Adapter
	   MCGA = IBM Multicolor Graphics Array
	   HGC  = Hercules Graphics Card
	   CGA  = IBM Color Graphics Adapter
	   EGA  = IBM Enhanced Graphics Adapter
	   VGA  = IBM Video Graphics Array
	
	Note: See the WIDTH statement documentation for more information about
	changing the number of rows and columns on the display
	
	The PALETTE statement works only on systems equipped with the EGA,
	VGA, or MCGA adapters. The PALETTE statement is not supported in
	screen modes 3 or 4.
	
	The following information briefly summarizes each of the screen modes.
	
	MDPA, CGA, MCGA, EGA, Hercules, Olivetti, or VGA Adapter Boards
	---------------------------------------------------------------
	
	SCREEN 0
	
	*  Text Mode only.
	*  Either 40 x 25, 40 x 43, 40 x 50, 80 x 25, 80 x 50 text format with
	   character-box size of 8 x 8 (8 x 14, 9 x 14, or 9 x 16 with EGA or
	   VGA).
	*  Assignment of 16 colors to either of 2 attributes.
	*  Assignment of 16 colors to any of 16 attributes (CGA and EGA).
	*  Assignment of 64 colors to any of 16 attributes (EGA and VGA).
	
	CGA, EGA, VGA, or MCGA Adapter Boards
	-------------------------------------
	
	SCREEN 1
	
	*  320 x 200 pixel medium-resolution graphics.
	*  40 x 25 text format with character-size of 8 x 8.
	*  Assignment of 16 background colors and one of two sets of 3
	   foreground colors assigned using COLOR statement with CGA.
	*  Assignment of 16 colors to 4 attributes with EGA, VGA, or MCGA.
	*  Note: If you want to have a choice of color for text on the CGA
	   adapter you can use BIOS interrupt 10 Hex, with function 9 (write
	   character and attribute at cursor), to output text characters in
	   various colors.
	
	SCREEN 2
	
	*  640 x 200 pixel high-resolution graphics.
	*  80 x 25 text format with character-box size of 8 x 8.
	*  Two colors (black and white) with CGA.
	*  Assignment of 16 colors to 2 color attributes with EGA or VGA.
	
	Hercules Graphics Card (HGC)
	----------------------------
	
	SCREEN 3
	
	*  Hercules adapter required, monochrome monitor only.
	*  720 x 348 graphics.
	*  80 x 25 text format, 9 x 14 character box.
	*  Two screen pages (only one, if a second display adapter is installed).
	*  PALETTE statement not supported
	
	Olivetti and AT&T Graphics
	--------------------------
	
	SCREEN 4 (Supported in QuickBASIC 4.00b and 4.50, but not in 4.00.)
	         (Supported in BASIC PDS 7.00 and the BASIC compiler 6.00b, but
	         not in 6.00.)
	
	*  Supports Olivetti (R) Personal Computers models M24, M240, M28,
	   M280, M380, M380/C, M380/T.
	*  Supports AT&T (R) Personal Computer 6300 series.
	*  640 x 400 graphics.
	*  80 x 25 text format, 8 x 16 character box.
	*  One of 16 colors assigned as the foreground color (selected by the
	   COLOR statement); background is fixed at black.
	*  WARNING: Olivetti computers running in real mode (DOS 3.x box)
	   under OS/2 must avoid SCREEN 4.
	
	EGA and VGA Adapter Boards
	--------------------------
	
	SCREEN 7
	
	*  320 x 200 pixel medium-resolution graphics.
	*  40 x 25 text format, character box 8 x 8.
	*  32K page size. Page ranges are 0 to 1 (64K adapter memory), 0 to 3
	   (128K adapter memory), or 0 to 7 (256K adapter memory).
	*  Assignment of 16 colors to any of 16 color attributes.
	
	SCREEN 8
	
	*  640 x 200 pixel high-resolution graphics.
	*  80 x 25 text format with character-box size 8 x 8.
	*  64K page size. Page ranges are 0 (64K adapter memory), 0 to 1
	   (128K), or 0 to 3 (256K).
	*  Assignment of 16 colors to any 16 color attributes
	
	SCREEN 9
	
	*  640 x 350 pixel enhanced-resolution graphics.
	*  80 x 25 or 80 x 43 text format with character-box size of 8 x 14 or
	   8 x 8.
	*  For 64K page size, page range is 0 (64K).
	*  For 128K page size, page range is 0 for 128K adapter memory or 0 to
	   1 for 256K adapter memory.
	*  Assignment of 16 colors to 4 attributes (64K adapter memory), or 64
	   colors assigned to 16 attributes (more than 64K of adapter memory).
	
	EGA and VGA Adapter Boards with Monochrome Display Only
	-------------------------------------------------------
	
	SCREEN 10
	
	*  640 x 350 enhanced-resolution graphics.
	*  80 x 25 or 80 x 43 text format with character-box size of 8 X 14 or
	   8 x 8.
	*  128K page size, page range 0 (128K adapter memory) or 0 to 1
	   (256K).
	*  Up to 9 shades of gray (pseudocolors) assigned to 4 attributes.
	
	VGA and MCGA Adapter Boards
	---------------------------
	
	SCREEN 11
	
	*  640 x 480 pixel very high-resolution graphics.
	*  80 x 30 or 80 x 60 text format with character-box size of 8 x 16 or
	   8 x 8.
	*  Assignment of up to 256K colors to 2 attributes.
	
	SCREEN 13
	
	*  320 x 200 pixel medium-resolution graphics.
	*  40 x 25 text format with character-box size of 8 x 8.
	*  Assignment of up to 256K colors to up to 256 attributes.
	*  Note: This mode offers the best color range available on the VGA.
	
	VGA Only
	--------
	
	SCREEN 12
	
	*  640 x 480 pixel very high-resolution graphics.
	*  80 x 30, 80 x 60 text format with character-box size of 8 x 16
	   or 8 x 8.
	*  Assignment of up to 256K colors to up to 16 attributes.
	*  Note: This mode offers the best resolution with most colors
	   available at that resolution.
