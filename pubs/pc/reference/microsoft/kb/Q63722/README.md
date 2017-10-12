---
layout: page
title: "Q63722: "C For Yourself" Documentation Error"
permalink: /pubs/pc/reference/microsoft/kb/Q63722/
---

	Article: Q63722
	Product: Microsoft C
	Version(s): 2.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 15-AUG-1990
	
	On Page 246 of the "C For Yourself" manual supplied with QuickC
	version 2.50 and Quick Assembler version 2.51, there is a macro under
	the heading "EGA Color Mixing."
	
	The macro is incorrectly defined as follows:
	
	   #define EGARGB( r, g, b ) (0x3F3F3FL & ((long)(b) << 20 | (g) << 12 \
	   | (r << 4)))
	
	This macro should read as follows:
	
	   #define EGARGB( r, g, b ) (0x303030L & ((long)(b) << 20 | (g) << 12 \
	   | (r << 4)))
	
	Note that the backslashes can be omitted if you put the #define all on
	one line.
