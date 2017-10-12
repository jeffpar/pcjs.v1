---
layout: page
title: "Q65590: _Floodfill() Doesn't Completely Fill Areas with Patterns"
permalink: /pubs/pc/reference/microsoft/kb/Q65590/
---

	Article: Q65590
	Product: Microsoft C
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 24-SEP-1990
	
	The sample code below draws two circles that are cut in half with a
	line. There is a small gap (2 pixels) in the line. When _floodfill()
	is used to fill the circle with a solid color, it fills the entire
	circle. When _floodfill() is used to fill the circle with a pattern,
	it fills only half of the circle.
	
	In this instance, the two-pixel gap in the line corresponds to the gap
	in the fill pattern. This causes _floodfill() to treat it as a solid
	line and fill only half the circle.
	
	To fill the entire circle with the pattern, create a second
	_floodfill() with a point on the other side of the line, as in the
	commented section of the code below:
	
	Sample Code
	-----------
	
	#include <conio.h>
	#include <graph.h>
	#include <time.h>
	#include <stdlib.h>
	#include <stddef.h>
	
	void main(void)
	{
	    unsigned char fill[] = {0x88,0x22,0x88,0x22,0x88,0x22,0x88,0x22};
	
	    if( !_setvideomode( _MAXRESMODE ) )
	       exit(1);
	
	    _setfillmask( NULL );     /*  Fill circle with a solid color  */
	    _setcolor(2);
	    _ellipse( _GBORDER, 50, 100, 250, 300 );
	    getch();
	    _moveto( 50, 200 );
	    _lineto( 248,200 );       /*  Line with a 2 pixel gap */
	    getch();
	    _setcolor(4);
	    _floodfill( 100, 210, 2); /* Fill the circle with a solid color */
	    getch();
	
	    _setfillmask( fill );     /*  Fill circle with a pattern  */
	    _setcolor(2);
	    _ellipse( _GBORDER, 350, 100, 550, 300 );
	    getch();
	    _moveto( 350, 200 );
	    _lineto( 548, 200 );      /*  Line with a 2 pixel gap */
	    getch();
	    _setcolor(4);
	    _floodfill( 400, 210, 2); /*  Fill half of the circle with a pattern */
	
	/*  _floodfill( 400, 180, 2);   This _floodfill() will fill in the other */
	/*                              half of the circle with a pattern.       */
	     getch();
	    _setvideomode( _DEFAULTMODE );
	
	}
