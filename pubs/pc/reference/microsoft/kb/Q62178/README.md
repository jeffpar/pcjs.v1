---
layout: page
title: "Q62178: L2025: B&#36;VWINI, B&#36;GRPRST, Symbols Multiply Defined"
permalink: /pubs/pc/reference/microsoft/kb/Q62178/
---

## Q62178: L2025: B&#36;VWINI, B&#36;GRPRST, Symbols Multiply Defined

	Article: Q62178
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 fixlist6.00a
	Last Modified: 21-JAN-1991
	
	When building programs with C version 6.00 using graphics functions
	and the TXTONLY.OBJ file (to decrease the size of the executable
	file), in certain cases the linker will return an L2025 for two
	symbols.
	
	The symbols B$VWINI and B$GRPRST are multiply defined in a program
	with a call to _clearscreen. The link statement does include /NOE,
	which is necessary to successfully link with the TXTONLY.OBJ file.
	
	The following sample code produces the errors:
	
	#include <graph.h>
	
	void main (void)
	{
	   _clearscreen (_GCLEARSCREEN) ;
	}
	
	The program still functions correctly (it clears the screen).
	
	Microsoft has confirmed this to be a problem in C version 6.00. This
	problem was corrected in C version 6.00a.
