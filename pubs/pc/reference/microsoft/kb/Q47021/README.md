---
layout: page
title: "Q47021: VRES Video Modes Have 30 Lines Using Graphics Text Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q47021/
---

	Article: Q47021
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC
	Last Modified: 15-JAN-1990
	
	When using the Output Text routines in the Microsoft run-time library
	(Version 5.10 "Microsoft C for the MS-DOS Operating System: Run-Time
	Library Reference," Pages 54-55), the two graphic modes, _VRES2COLOR
	and _VRES16COLOR, have 30 text lines by default, due to their
	increased vertical resolution. All other graphics modes have 25 text
	lines when using these routines.
	
	The following graphics functions are the routines concerned with text
	placement and output:
	
	   _displaycursor()
	   _gettextcolor()
	   _gettextposition()
	   _outtext()
	   _settextposition()
	   _settextcolor()
	   _settextwindow()
	   _wrapon()
	
	The line numbers stated above are based on the default 8 x 8 font size
	of the IBM ROM BIOS. Note that when using fonts, the number of text
	lines in any video mode depends on the height of the font. For
	information concerning changing from the default font size, see the
	interrupt 10, function 11 entries in "IBM ROM BIOS," a Microsoft Press
	book by Ray Duncan.
