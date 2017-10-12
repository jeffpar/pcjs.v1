---
layout: page
title: "Q60335: Using Second _ellipse() Call to Erase Text Can Fail"
permalink: /pubs/pc/reference/microsoft/kb/Q60335/
---

	Article: Q60335
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-APR-1990
	
	Using the _ellipse() function with the _GFILLINTERIOR flag to create a
	color-filled background upon which to display text using the font
	functions, everything may appear to work correctly until you attempt
	to erase the text you have written by placing an identical ellipse
	over the original. The second ellipse function call apparently will
	have no effect.
	
	The problem lies in the way the ellipse function creates a filled
	ellipse. For example, if you instruct _ellipse() to draw a blue-filled
	ellipse, the function first draws a hollow blue ellipse then does a
	floodfill until it reaches a blue boundary.
	
	If you then write text on it and try to erase the text with another
	blue-filled ellipse, it will not work properly; the second ellipse
	tries to do a blue floodfill but has nowhere to go because the place
	it is writing to is already blue.
	
	Workaround
	----------
	
	There are essentially three workarounds for this situation.
	
	1. The first workaround is to use three ellipse calls, as follows:
	
	   a. Draw the colored ellipse.
	
	   b. Draw the text.
	
	   c. Draw an ellipse identical to the first one except for the color.
	
	   d. Draw the last ellipse identical to first one.
	
	2. The second workaround is an enhancement of the first.
	
	   To achieve the originally desired effect without seeing a second
	   different-colored ellipse flicker in between, you can remap the
	   palette so that the second fill color matches the first EXACTLY.
	   Visually, they are identical, but the color indices (which is what
	   floodfill goes by) are different.
	
	   You can then either refill with the original color-index, or leave
	   it painted in the second (visually identical).
	
	   If the operation is repeated, you could alternate between two
	   (identical-looking) color indices.
	
	3. Finally, you could use _polygon() to simulate the ellipse, since
	   _polygon() uses a scanfill, not a floodfill.
