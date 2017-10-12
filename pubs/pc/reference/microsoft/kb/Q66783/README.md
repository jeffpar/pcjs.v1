---
layout: page
title: "Q66783: _floodfill() May Not Stop at the Correct Boundary Color"
permalink: /pubs/pc/reference/microsoft/kb/Q66783/
---

	Article: Q66783
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC buglist6.00 buglist6.00a
	Last Modified: 14-JAN-1991
	
	The _floodfill() function takes a parameter that specifies the color
	of the boundary at which flood-filling should stop. In certain cases,
	the filling will stop at an incorrect boundary.
	
	A situation where _floodfill() may fill incorrectly is if a screen
	consists of two horizontal lines of the same color with one line near
	the top of the screen and the other near the bottom. The problem
	occurs if _floodfill() is then called with a start position at the
	middle of the screen between these lines and the filling color is the
	same as the lines, while the boundary color specified is something
	else.
	
	Because the fill color is different from the boundary color, the
	filling should cover the entire screen because there is no boundary to
	stop it. However, in actuality the filling stops when it reaches the
	horizontal lines. The sample program below demonstrates this problem.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and in QuickC versions 2.00, 2.01, 2.50, and 2.51. We are
	researching this problem and will post new information here as it
	becomes available.
	
	Sample Code
	-----------
	
	#include <graph.h>
	#include <conio.h>
	
	void main(void)
	{
	   _setvideomode( _ERESCOLOR );
	   _setcolor( 5 );
	
	   _moveto( 0, 100 );
	   _lineto( 640, 100 );
	   _moveto( 0, 300 );
	   _lineto( 640, 300 );
	
	   _floodfill( 320, 200, 7 );
	   getch();
	   _setvideomode( _DEFAULTMODE );
	}
