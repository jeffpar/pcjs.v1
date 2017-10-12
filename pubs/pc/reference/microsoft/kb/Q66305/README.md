---
layout: page
title: "Q66305: _setcliprgn Does Not Work Inside a _setviewport"
permalink: /pubs/pc/reference/microsoft/kb/Q66305/
---

	Article: Q66305
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc buglist6.00 buglist6.00a
	Last Modified: 19-JAN-1991
	
	There is a conflict between the _setviewport() and _setcliprgn()
	functions included in the graphics libraries in C versions 6.00 and
	6.00a and QuickC versions 2.50 and 2.51. The _setcliprgn() function
	should not affect the viewport coordinates, but using it after
	_setviewport() causes changes in some graphics output.
	
	The code below illustrates this problem. It draws an arc in the
	upper-right corner of the window and then sets the clipping region
	just inside the viewport; the program then draws the same arc again.
	The second arc is shifted to the right and changed from the previous
	arc.
	
	Code Example
	------------
	
	#include <stdio.h>
	#include <conio.h>
	#include <graph.h>
	
	void main(void)
	{
	    struct videoconfig vc;
	
	    _setvideomode(_MAXRESMODE);
	    _clearscreen(_GCLEARSCREEN);
	    _getvideoconfig(&vc);
	    _setviewport(55, 55, vc.numxpixels-55, vc.numypixels-55);
	    _setwindow(1, 0.0, -10.0, 10.0, 10.0);
	    _rectangle_w(_GBORDER, 0.0, -10.0, 10.0, 10.0);
	    _ellipse_w(_GBORDER, 5.0, 5.0, 15.0, 15.0);
	    _moveto(10,10);
	    _outtext("Press any key to set a clipping region ");
	    _outtext("and display the same arc...");
	    getch();
	    _setcliprgn(56, 56, vc.numxpixels-56, vc.numypixels-56);
	    _ellipse_w(_GBORDER, 5.0, 5.0, 15.0, 15.0);
	    getch();
	    _setvideomode(_DEFAULTMODE);
	}
	
	Microsoft has confirmed this to be a problem with Microsoft C Compiler
	versions 6.00 and 6.00a. We are researching this problem and will post
	new information here as it becomes available.
