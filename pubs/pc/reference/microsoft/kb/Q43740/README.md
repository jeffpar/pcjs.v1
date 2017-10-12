---
layout: page
title: "Q43740: Default Palette for Presentation Graphics in QuickC 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q43740/
---

	Article: Q43740
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	In Microsoft QuickC Version 2.00, the default palette for presentation
	graphics is independent of the palette used by low-level graphics
	routines. In addition, the presentation graphics palette uses a
	different index order than the palette for colors in graphics
	functions such as _settextcolor(). The default palette for
	presentation graphics is as follows:
	
	   Index     Color             Index    Color
	
	   0         Black              8       White
	   1         Bright White       9       Gray
	   2         Blue              10       Light Blue
	   3         Green             11       Light Green
	   4         Cyan              12       Light Cyan
	   5         Red               13       Light Red
	   6         Magenta           14       Light Magenta
	   7         Brown             15       Yellow
