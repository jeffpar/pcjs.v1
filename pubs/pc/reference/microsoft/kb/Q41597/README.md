---
layout: page
title: "Q41597: QuickC 2.00 README.DOC: Vector-Mapped Fonts"
permalink: /pubs/pc/reference/microsoft/kb/Q41597/
---

	Article: Q41597
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 2 "Notes on "'C for Yourself.'" The following
	notes refer to specific pages in "C for Yourself."
	
	Page 264   Vector-Mapped Fonts
	
	Add this note to the description of vector mapping:
	
	If a vector-mapped font is selected in graphics mode, any function
	affecting "_moveto" or "_lineto" will also affect the font
	("_setlinestyle" and so on) when "_outgtext" is called.
