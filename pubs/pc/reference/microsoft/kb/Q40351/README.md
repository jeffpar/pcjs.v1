---
layout: page
title: "Q40351: Call _setvideomode before Calling _imagesize"
permalink: /pubs/pc/reference/microsoft/kb/Q40351/
---

	Article: Q40351
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC
	Last Modified: 16-JAN-1989
	
	Problem:
	
	I am using the _imagesize function to determine the size required to
	store a graphics image. However, this function is not returning the
	expected result.
	
	Response:
	
	The _imagesize function calls _getvideoconfig to determine the number
	of bits required to store a pixel given the CURRENT video mode. If you
	are calling _imagesize prior to calling _setvideomode, an unexpected
	result is returned by _imagesize.
	
	In summary, do the following in order:
	
	1. _setvideomode
	
	2. _imagesize
	
	3. _getimage and putimage
