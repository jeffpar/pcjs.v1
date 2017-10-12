---
layout: page
title: "Q68865: Setting _settextcolor() to 0 May Give Unexpected Results"
permalink: /pubs/pc/reference/microsoft/kb/Q68865/
---

	Article: Q68865
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 6-FEB-1991
	
	When in a graphics mode, using the function _settextcolor() with an
	argument of "0" to select black does not work as expected. For
	example, the code below sets the background color to _WHITE, sets the
	text color to 0 (Black), and tries to print text to the screen.
	
	In this example, the resultant foreground and background colors are
	the same. Remember that _setbkcolor() sets the color for index 0. When
	_settextcolor() is called with the same index, nothing will seem to
	appear because the _setbkcolor() function resets color index 0 to the
	new color. When _settextcolor() is called with index 0, the foreground
	and background colors are the same, and therefore, nothing appears on
	the screen.
	
	To work around the problem, just call _remappallette() to move the
	desired color off index 0. The comments in the following code
	illustrate this:
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <conio.h>
	#include <graph.h>
	
	void main()
	{
	   _setvideomode(_MAXRESMODE);
	
	   // _remappalette(1,0);    // Uncomment for the workaround.
	
	   _setbkcolor(_WHITE);
	
	   _settextcolor(0);
	
	   // _settextcolor(1);      // Uncomment for the workaround.
	   _outtext("foo");
	
	   getch();
	
	   _setvideomode(_DEFAULTMODE);
	}
