---
layout: page
title: "Q66925: _getfontinfo and Vector Mapped Fonts"
permalink: /pubs/pc/reference/microsoft/kb/Q66925/
---

## Q66925: _getfontinfo and Vector Mapped Fonts

	Article: Q66925
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr s_quickc
	Last Modified: 18-NOV-1990
	
	_getfontinfo() is documented as returning a _fontinfo structure
	containing information including type, facename, filename, ascent,
	pixheight, pixwidth, and avgwidth about the font currently set.
	However, _getfontinfo() only reads these values from the .FON file in
	which they are stored. This can cause problems when using vector fonts
	that have been scaled by the _setfont() function because the values
	for ascent, pixheight, and avgwidth will probably be incorrect.
	
	Vector fonts are stored in the .FON file as a series of equations that
	can be multiplied by some scaling factor to generate fonts of
	different sizes. By default, the scale factor is 1. When
	_getfontinfo() is called, it will always return the values for ascent,
	pixheight, and avgwitch assuming the default scale factor. If the font
	is scaled to some type size other than the default (using _setfont()
	with WxHy parameters), the new values for ascent, pixheight, and
	avgwidth will need to be recalculated. The factor can be determined by
	dividing the pixheight value returned from _getfontinfo() by the Hy
	parameter passed to _setfont().
