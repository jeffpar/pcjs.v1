---
layout: page
title: "Q66214: C 5.10 _setlogorg Is Replaced by _setvieworg in C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q66214/
---

## Q66214: C 5.10 _setlogorg Is Replaced by _setvieworg in C 6.00

	Article: Q66214
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 24-OCT-1990
	
	The Microsoft C version 5.10 _setlogorg graphics function is used to
	move the logical origin (0, 0) to the physical point (x, y). All other
	points move the same direction and distance. This function is not
	present in the C 6.00 graphics run-time library because it has been
	replaced by the _setvieworg function.
	
	The _setlogorg function is defined in the C 6.00 version of the
	graph.h include file. Because of this, code that was originally
	compiled under C 5.10 need not be changed before recompiling it under
	C 6.00.
	
	If a C 5.10 .OBJ containing a call to _setlogorg() needs to be linked
	with C 6.00 .OBJ files and libraries, you will get an unresolved
	external link error on _setlogorg. To work around this problem,
	compile the following code under C 6.00 and link it in with the other
	.OBJ files:
	
	#include <graph.h>
	
	#undef _setlogorg
	
	struct xycoord _far _setlogorg(short x, short y)
	{
	     return(_setvieworg(x, y));
	}
