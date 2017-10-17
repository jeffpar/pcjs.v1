---
layout: page
title: "Q45539: Incorrect Prototypes for 'Window' Functions in QC Advisor"
permalink: /pubs/pc/reference/microsoft/kb/Q45539/
---

## Q45539: Incorrect Prototypes for 'Window' Functions in QC Advisor

	Article: Q45539
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 26-JUN-1989
	
	A number of window functions that take the structure _wxycoord as a
	parameter are incorrectly prototyped in the QuickC Version 2.00
	Advisor. The Advisor states that the structure is to be passed; doing
	so generates the following error:
	
	   test.c(11) : error C2115: 'argument' : incompatible types
	
	The functions actually take a pointer to the structure rather than the
	structure itself.
	
	The following are functions documented incorrectly in the Advisor as
	accepting structures rather than pointers to structures as parameters:
	
	   _pie_wxy
	   _rectangle_wxy
	   _arc_wxy
	   _ellipse_wxy
	   _getimage_wxy
	   _getviewcoord_wxy
	   _imagesize_wxy
