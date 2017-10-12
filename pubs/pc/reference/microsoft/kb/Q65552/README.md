---
layout: page
title: "Q65552: Text/Graphic Mode Determines _setbkcolor() Parameters to Use"
permalink: /pubs/pc/reference/microsoft/kb/Q65552/
---

	Article: Q65552
	Product: Microsoft C
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 24-JAN-1991
	
	When using _setbkcolor() in a graphics mode, you should use the
	predefined color constants found in graph.h. Examples of these
	constants are _BLUE, _GREEN, _RED, etc. When using _setbkcolor() in a
	text mode, you should use values from 0L to 15L. These two systems of
	specifying colors are not interchangeable. For instance, if you use
	_setbkcolor(_BLUE) under a text mode, you will not get a blue
	background.
	
	For more information, see page 668 of the "Microsoft C Optimizing
	Compiler Run-Time Library Reference" manual or query the online help
	for "_setbkcolor()".
