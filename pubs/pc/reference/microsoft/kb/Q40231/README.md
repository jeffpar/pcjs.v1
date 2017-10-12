---
layout: page
title: "Q40231: Error in Run-Time Library Examples for Font Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q40231/
---

	Article: Q40231
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: enduser |  fonts.c
	Last Modified: 31-OCT-1989
	
	The example program for the Font functions in the graphics library
	contains the following incorrect source line:
	
	   strcat (fondir, "\*.fon") ;
	
	This line should be corrected to read as follows:
	
	   strcat (fondir, "\\*.fon") ;
	
	This example program is listed in the Online help facility in QuickC
	Version 2.00. This error afflicts all the Font family functions that
	consist of the following:
	
	    _registerfonts, _setfonts, _outgtxt,
	    _unregisterfonts, _getfontinfo, _gettextextent.
