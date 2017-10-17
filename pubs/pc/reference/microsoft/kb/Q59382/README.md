---
layout: page
title: "Q59382: _setcliprgn() Fails to Clip _putimage() Operation"
permalink: /pubs/pc/reference/microsoft/kb/Q59382/
---

## Q59382: _setcliprgn() Fails to Clip _putimage() Operation

	Article: Q59382
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_c
	Last Modified: 12-MAR-1990
	
	Question:
	
	When an image is placed on the display using the _putimage function,
	and this image spans the border of a clipping region, it is not
	clipped properly. Why does this happen?
	
	Response:
	
	First, the _setcliprgn() function operates on single objects. If any
	part of an object lies outside of the clipping region, it will not be
	displayed. Second, a graphic block (image) used by the _getimage() and
	_putimage() functions is treated as a single object by the graphic
	functions. Therefore, the entire image must fit in the clip region for
	any of it to be displayed. This is in contrast to lines and circles,
	which are a collection of objects and are clipped as expected.
