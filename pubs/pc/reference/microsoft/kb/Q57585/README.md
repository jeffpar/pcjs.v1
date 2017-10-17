---
layout: page
title: "Q57585: Background Color Greater Than Seven Causes Region to Blink"
permalink: /pubs/pc/reference/microsoft/kb/Q57585/
---

## Q57585: Background Color Greater Than Seven Causes Region to Blink

	Article: Q57585
	Version(s): 1.00 1.02 | 1.00 1.02
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 26-FEB-1990
	
	It is possible to configure both the background and foreground color
	of the various text items that the Microsoft Editor (M) displays. If
	you attempt to set the background color to a color greater than seven,
	the color region blinks. This behavior, however unusual, is expected,
	and is documented in the "Microsoft Editor for MS OS/2 and MS-DOS
	User's Guide" on Page 87.
	
	The following M Editor color switches control the colors of various
	text display regions:
	
	   Switch        Controls
	   ------        --------
	
	   hgcolor       Background and text color
	   hgcolor       Search highlight colors
	   infocolor     Information message colors
	   selcolor      Cursor highlight colors
	   stacolor      Status line colors
	   wdcolor       Window border colors
	
	The following are the colors these switches can be set to:
	
	   Black                 0
	   Blue                  1
	   Green                 2
	   Cyan                  3
	   Red                   4
	   Magenta               5
	   Brown                 6
	   Light Gray            7
	   Dark Gray             8   Will blink when set to background
	   Light Blue            9   Will blink when set to background
	   Light Green           A   Will blink when set to background
	   Light Cyan            B   Will blink when set to background
	   Light Red             C   Will blink when set to background
	   Light Magenta         D   Will blink when set to background
	   Light Yellow          E   Will blink when set to background
	   White                 F   Will blink when set to background
	
	These colors are set in your TOOLS.INI as follows:
	
	               +------------------- Background Color
	               |
	               v
	
	   colorswitch:BF <---------------- Foreground Color
	
	The following example, inserted in your TOOLS.INI, sets the foreground
	and background colors of the editing windows (90 percent of the
	screen):
	
	   fgcolor:62 < ------------------- Green
	
	           ^
	           |
	           +----------------------- Brown
