---
layout: page
title: "Q38312: Attributes in Hercules Graphics Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q38312/
---

	Article: Q38312
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 19-DEC-1988
	
	Problem:
	
	I'm using a Hercules graphics adapter in graphics mode and I would
	like to do high-intensity "bold" graphics, but I can't seem to get it
	to work correctly.
	
	Response:
	
	Using the Hercules graphics adapter in graphics mode, each pixel maps
	to only 1 bit in memory. Because there is only 1 bit, that pixel can
	only be on or off. In Hercules graphics mode, there is no facility for
	attributes such as high-intensity, blinking, reverse, or underline.
	
	In Hercules graphics mode, the only way to get blinking, reverse, and
	underline is for your program to manipulate or turn on and off each
	pixel. High-intensity will not be possible.
	
	If you put the adapter into Text mode, you can use all of these
	attributes freely.
