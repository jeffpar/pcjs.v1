---
layout: page
title: "Q67759: _getpixel() Return Value is Not Changed by _setbkcolor() Call"
permalink: /pubs/pc/reference/microsoft/kb/Q67759/
---

## Q67759: _getpixel() Return Value is Not Changed by _setbkcolor() Call

	Article: Q67759
	Version(s): 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 6-FEB-1991
	
	In the sample program below, _getpixel() will return a 0 (zero).
	Setting _setbkcolor() to any other color has no effect on the return
	value from _getpixel().
	
	The _getpixel() function is documented as returning a color index for
	a specific pixel. In the example program, there are no colors on the
	screen except the background color (color index 0). When the call to
	_setbkcolor() is made, the color mapped to index 0 is changed;
	however, the color index for the pixel is not changed. Therefore,
	_getpixel() still returns 0. This same behavior is exhibited when
	using the _remappallette() function on index 0 and the
	_remapallpallette() function.
	
	To change the color index at a particular point on the screen, first
	call the _setcolor() function with the desired color index, then use
	one of the graphics drawing functions, for example, _floodfill(),
	_setpixel(), etc.
	
	Sample Code
	-----------
	
	// Note: C 5.10 doesn't support _MAXRESMODE
	
	#include<graph.h>
	#include<stdio.h>
	void main(void)
	{
	   short xvar=100,yvar=100,result1=0,result2=0;
	   _setvideomode(_MAXRESMODE);
	   result1=_getpixel(xvar,yvar);
	   _setbkcolor(_BLUE);
	   result2=_getpixel(xvar,yvar);
	   _setvideomode(_DEFAULTMODE);
	   printf("Before _setbkcolor - %d\n",result1);
	   printf("After _setbkcolor  - %d\n",result2);
	}
