---
layout: page
title: "Q44054: QuickC: _floodfill May Fail When Filling Color 0"
permalink: /pubs/pc/reference/microsoft/kb/Q44054/
---

	Article: Q44054
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 18-MAY-1989
	
	The graphics function _floodfill fails under any graphics mode with
	more than two colors when all of the following occur:
	
	1. A region enclosed by a border color is filled.
	
	2. A shape with the color of the border color is enclosed within that
	   region.
	
	3. The color being _floodfilled is 0.
	
	When _floodfill encounters this enclosed shape, it slows down
	considerably. When it completes filling, the program hangs. Executing
	the following program demonstrates this problem:
	
	   #include <graph.h>
	
	   #define BORDER 15
	
	   unsigned char mask[] = {255,1,1,1,1,1,1,1};
	
	   void main (void)
	    { _setvideomode (_VRES16COLOR);
	
	      /* Draw the border. */
	      _setcolor (BORDER);
	      _ellipse (_GBORDER,10,10,630,340);
	
	      _setfillmask ((char far *) mask);
	
	      /* Remove drawing this interior shape and the program works. */
	      _setpixel (323,84);
	
	      /* This _floodfill is just for looks. */
	      _setcolor (2);
	      _floodfill (320,190,BORDER);
	
	      _setcolor (0);
	
	      /* This line will slow down and hang. */
	      _floodfill (320,190,BORDER);
	    }
	
	This problem is not related to the color currently mapped to color 0
	(black by default). If you must _floodfill black, remap another color
	to black and _floodfill that color. For example, to patch the above
	program, replace
	
	   _setcolor (0);
	
	with the following:
	
	   _remappalette (8,_BLACK);
	   _setcolor (8);
	
	This also is a problem with Optimizing C Versions 5.00 and 5.10 when
	_floodfilling any color under the circumstances described above -- not
	just color 0.
	Microsoft is researching this problem and will post new information as
	it becomes available.
