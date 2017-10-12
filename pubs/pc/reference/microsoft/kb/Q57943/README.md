---
layout: page
title: "Q57943: No Symbolic Information Generated for Pascal Units"
permalink: /pubs/pc/reference/microsoft/kb/Q57943/
---

	Article: Q57943
	Product: Microsoft C
	Version(s): 2.10 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | s_pascal
	Last Modified: 8-MAR-1990
	
	The Microsoft Pascal Compiler Version 4.00 does not generate symbolic
	debugging information for Pascal units. As a result, when tracing
	through a Pascal program unit, any attempt to access local variables
	by using trace/watchpoints, dumps, examines, etc. yields a "symbol
	unknown" error.
	
	The only workaround is to transform the program units into modules.
