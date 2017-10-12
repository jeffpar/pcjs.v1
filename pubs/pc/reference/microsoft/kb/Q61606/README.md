---
layout: page
title: "Q61606: _setvideomoderows() with _VRES2COLOR or _VRES16COLOR Modes"
permalink: /pubs/pc/reference/microsoft/kb/Q61606/
---

	Article: Q61606
	Product: Microsoft C
	Version(s): 5.00 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 29-MAY-1990
	
	When using _VRES2COLOR or _VRES16COLOR as a parameter for the function
	_setvideomode(), it is important to note that these modes only support
	30 and 60 lines. Therefore, when a call to _setvideomoderows() is
	made, the expected value returned should be either decimal 30 or 60.
	
	Problems relating to 30- and 60-line support occur most commonly when
	setting the text position using the _settextposition() routine. For
	example, if you set text to the center of the screen, you will notice
	that the text seems to be printed four lines above the center.
