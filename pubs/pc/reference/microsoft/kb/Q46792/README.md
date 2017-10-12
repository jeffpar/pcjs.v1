---
layout: page
title: "Q46792: _setvideomode Resets the Palette"
permalink: /pubs/pc/reference/microsoft/kb/Q46792/
---

	Article: Q46792
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC _remapallpalette _remappalette
	Last Modified: 25-JUL-1989
	
	The Microsoft C function _setvideomode resets the palette to the
	default palette colors each time it is called. Therefore, remapping
	the color palette in C lasts only as long as the video mode remains
	active.
