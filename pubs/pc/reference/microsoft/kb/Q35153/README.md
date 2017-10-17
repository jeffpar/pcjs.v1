---
layout: page
title: "Q35153: No Underlining on Color Display in BASIC Text Mode, SCREEN 0"
permalink: /pubs/pc/reference/microsoft/kb/Q35153/
---

## Q35153: No Underlining on Color Display in BASIC Text Mode, SCREEN 0

	Article: Q35153
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 12-DEC-1989
	
	There is no way to display underlined characters in text mode (SCREEN
	0) on a color display. Only an IBM Monochrome Display Adapter (MDA) or
	a Hercules Graphics Adapter (HGA) which is connected with a monochrome
	display device can display underlined characters in SCREEN 0. This is
	a result of the way that the video attributes are encoded in video
	memory and is a limitation of the hardware, not BASIC.
	
	Note that in graphics mode, you may draw lines wherever desired, and
	you can emulate the monochrome underlining capability.
	
	This information applies to the following products:
	
	1. Microsoft QuickBASIC Compiler Versions 2.00, 2.01, 3.00, 4.00, and
	   4.00b
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	   OS/2 and Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	3. The Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and later
	   (Note that on Hercules or monochrome adapters, GW-BASIC can use
	   text SCREEN 0 but does not support graphics screen modes.)
	
	See Pages 79-81 of "The Peter Norton Programmer's Guide to the IBM PC"
	(published by Microsoft Press, 1985) for more information about text
	mode attributes.
	
	The following book from Microsoft Press describes video details more
	completely:
	
	"Programmer's Guide to PC & PS/2 Video Systems," by Richard Wilton
	(Microsoft Press, 1987). Chapter 3 describes the alphanumeric video
	modes (i.e., SCREEN 0).
