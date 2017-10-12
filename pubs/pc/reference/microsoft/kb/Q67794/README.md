---
layout: page
title: "Q67794: NMAKE Does Not Expand Wildcard Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q67794/
---

	Article: Q67794
	Product: Microsoft C
	Version(s): 1.11   | 1.11
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 6-FEB-1991
	
	Page 107 of the "Advanced Programming Techniques" manual that shipped
	with Microsoft C version 6.00 states:
	
	   NMAKE expands wild cards in target names when it reads the
	   description file.
	
	NMAKE does not expand these wildcard characters when passing the
	wildcard to the compiler. The example given works correctly because
	the compiler expands the wildcard on its own. If you use a compiler
	that does not expand wildcards, the example given will not work.
