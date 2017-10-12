---
layout: page
title: "Q65200: _polygon() with _GFILLINTERIOR Does Not Work When Clipped"
permalink: /pubs/pc/reference/microsoft/kb/Q65200/
---

	Article: Q65200
	Product: Microsoft C
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 s_quickc setcliprgn
	Last Modified: 17-DEC-1990
	
	When _polygon is called to draw a filled polygon inside a clip region
	set with _setcliprgn, the polygon may not be drawn correctly. The
	following program demonstrates the error:
	
	#include <graph.h>
	
	struct xycoord pts[4] = {{0,0}, {55,55}, {83,25}, {0,0}};
	
	void main(void)
	{
	     _setvideomode(_ERESCOLOR);
	
	/* show the polygon */
	     _setcolor(3);
	     _polygon(_GFILLINTERIOR, pts, 4);
	     getch();
	
	/* show the clipped region */
	     _setcolor(3);
	     _rectangle(_GBORDER, 0, 0, 75, 50);
	     _setcliprgn(0,0, 75, 50);
	     getch();
	
	/*** polygon drawn will have portion missing with _GFILLINTERIOR ***/
	     _setcolor(10);
	     _polygon(_GFILLINTERIOR, pts, 4);
	     getch();
	
	/* clipped polygon drawn correctly with _GBORDER */
	     _setcolor(12);
	     _polygon(_GBORDER, pts, 4);
	     getch();
	
	     _setvideomode(_DEFAULTMODE);
	}
	
	Any horizontal lines that are being clipped will not be drawn at all.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here when
	it becomes available.
