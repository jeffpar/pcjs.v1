---
layout: page
title: "Q44523: Ellipse Not Bounded Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q44523/
---

	Article: Q44523
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC
	Last Modified: 26-MAY-1989
	
	The _ellipse function does not behave as defined. The Microsoft QuickC
	and Optimizing C 5.x run-time library reference manuals state that
	"the bounding rectangle [is] defined by the logical points (x1,y1) and
	(x2,y2)." However, the bound specified by y2 may be two pixels distant
	from the lowest point reached by the ellipse.
	
	This behavior can be demonstrated in any video mode, but not all
	possible bounding points will produce this behavior.
	
	This "off by two" behavior is especially troublesome when floodfilling
	a region bounded by the ellipse and a line on y2. The floodfill will
	bleed out of what should be an enclosed region. The following program
	demonstrates this situation:
	
	#include <graph.h>
	
	void main (void)
	{
	  int x1=0, y1=0, x2=639, y2=349;
	
	  _setvideomode (_ERESCOLOR);
	
	  /* Draw the boundary. */
	  _setcolor  (15);
	  _rectangle (_GBORDER, x1, y1, x2, y2);
	  _ellipse   (_GBORDER, x1, y1, x2, y2);
	
	  /* Define _floodfill attributes. */
	  _moveto    (x1+1, y2-1);
	  _setcolor  (12);
	
	  /* This should not 'bleed' to the right region. */
	  _floodfill (x1+1, y2-1, 15);
	}
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
