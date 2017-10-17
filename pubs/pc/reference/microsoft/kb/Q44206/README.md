---
layout: page
title: "Q44206: Explanation of the _fontinfo Structure"
permalink: /pubs/pc/reference/microsoft/kb/Q44206/
---

## Q44206: Explanation of the _fontinfo Structure

	Article: Q44206
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 18-MAY-1989
	
	Question:
	
	Which entries in the _fontinfo structure pertain to which fonts?
	Specifically, do 'ascent' and 'pixheight' pertain to vector fonts?
	Those two fields do not seem to change after the size of a vector font
	is changed.
	
	Response:
	
	All entries in the _fontinfo pertain to both font types. The two known
	values that are specific to each type are as follows:
	
	   *.type      =>  If bit is set = vector font, clear = bitmap font
	   *.pixwidth  =>  0 = proportional, others = character width in pixels
	
	For bitmapped fonts, the sizes are known; therefore, each font size is
	stored separately.
	
	For vector-mapped fonts, there is only one known size; therefore, only
	one size is stored in the font file. When you select a vector font
	with a specific size, the font routine will rescale the desired size
	proportionally to the known size. This is why all entries in _fontinfo
	structure are UNCHANGED (including the 'ascent' and 'pixheight'
	fields) every time the size of a vector-mapped font is changed.
	
	For example, setting the vector-mapped font size to either of the
	following will not have any effect on the _fontinfo values:
	
	      'h100w200'
	or
	      'h10w20'
	
	This means that the size of a vector-mapped font will be changed
	correctly, but you will not be able to tell to what size it was
	changed to by looking at the _fontinfo structure fields.
	
	This is currently a limitation of QuickC 2.00.
	
	Note: For an explanation of differences between 'ascent' and
	'pixheight,' please refer to Pages 654-655 in the book "Programming
	Windows" by Charles Petzold.
