---
layout: page
title: "Q49779: Using Graphics in Mixed-Language Calls between QC and QB"
permalink: /pubs/pc/reference/microsoft/kb/Q49779/
---

	Article: Q49779
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | b_quickbasic
	Last Modified: 17-JUL-1990
	
	Problem:
	
	I want to use _imagesize(), _getimage(), and _putimage() in the C
	graphics library after loading the graphics image from QuickBASIC.
	
	Response:
	
	The C module does not recognize that the screen is in graphics mode if
	the video mode is set in the BASIC module. Instead, set the video mode
	in a C module using the following steps:
	
	1. Start from the main in BASIC.
	
	2. Call a C function to initialize the video mode.
	
	3. Return to BASIC and load in the graphics image.
	
	4. Call a C function to use functions from the C graphics library.
	
	For more information about QuickBasic and QuickC graphics
	compatibility, search on the following words:
	
	   QuickBASIC and QuickC and link and graphic
