---
layout: page
title: "Q41373: _Setvideomode _ERESCOLOR Only Supports 16 Colors"
permalink: /pubs/pc/reference/microsoft/kb/Q41373/
---

	Article: Q41373
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc docerr langdoc
	Last Modified: 16-MAY-1989
	
	The manifest constant _ERESCOLOR is incorrectly shown as providing 64
	colors on Page 539 of the "Microsoft C Optimizing Compiler Version
	5.10 Run-Time Library Reference" manual, Page 539 of the "Microsoft
	QuickC Run-time Library Reference" manual, and Page 197 of the
	"Microsoft QuickC Version 2.00 Graphics Library Reference" manual.
	According to the "Programmer's Guide to PC & PS/2 Video Systems," Page
	448, and the "MS-DOS Encyclopedia," Page 1513, the correct number of
	colors in 640 x 350 EGA is 16 colors. The include file graph.h
	correctly shows 16 colors.
