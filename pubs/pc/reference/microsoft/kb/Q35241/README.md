---
layout: page
title: "Q35241: Using Dual Video Display Cards and Monitors with QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q35241/
---

## Q35241: Using Dual Video Display Cards and Monitors with QuickBASIC

	Article: Q35241
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	QuickBASIC allows limited use of two video-display system cards within
	the same application if the host computer has both a color video card
	and monitor, plus a monochrome card and monitor. Only the default
	display (the one that was active when QuickBASIC was invoked) has a
	cursor and graphics capability.
	
	The method requires OPENing "CONS:" FOR OUTPUT AS #n, POKEing the
	video-mode specifier of the desired output screen into memory location
	449 hex, then using a PRINT #n to display text on the desired output
	monitor. It is important to use "CONS:", not "SCRN:" in the OPEN
	statement. "SCRN:" is always associated with the default display.
	
	This information applies to Microsoft QuickBASIC Versions 4.00 4.00b
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	There is no practical way to put graphics images on the secondary
	display in QuickBASIC. See Pages 54 and 55 of "The Peter Norton
	Programmer's Guide to the IBM PC" (published by Microsoft Press, 1985)
	for a list of settings for the video mode. The following code example,
	which uses 7 (for a monochrome adapter) and 3 (for 80-column text, 16
	colors), works with a computer that has a Hercules-compatible
	monochrome adapter and an EGA color display:
	
	OPEN "cons:" FOR OUTPUT AS #1
	DEF SEG = 0
	PRINT #1, "This should be on the DEFAULT Screen."
	POKE &H449, 7
	PRINT #1, "This should be on the MONO Screen."
	POKE &H449, 3
	PRINT #1, "This should be on the COLOR Screen."
