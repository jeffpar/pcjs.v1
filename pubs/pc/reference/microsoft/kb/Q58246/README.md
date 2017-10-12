---
layout: page
title: "Q58246: The Amount of Memory That Is Required for Registered Fonts"
permalink: /pubs/pc/reference/microsoft/kb/Q58246/
---

	Article: Q58246
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | graphics
	Last Modified: 7-MAR-1990
	
	The _registerfonts() function requires a block of 516 bytes of memory
	for font header information.
	
	The "Microsoft QuickC Graphics Library Reference" states on Page 170
	that the header information for each font is approximately 140 bytes.
	This is true; however, the _registerfonts() function will pre-allocate
	516 bytes and then use the allocated space to store information for
	each font header. This technique of memory management is similar to
	the way malloc allocates memory using the _amblksiz global variable.
