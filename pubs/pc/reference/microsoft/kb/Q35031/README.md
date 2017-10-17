---
layout: page
title: "Q35031: Unresolved Externals when Linking for Protected Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q35031/
---

## Q35031: Unresolved Externals when Linking for Protected Mode

	Article: Q35031
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	Problem:
	
	I am compiling my C program for protected-mode with the command:
	
	cl /Lp demo.c
	
	I'm using the Microsoft Segmented-Executable Linker Version
	5.01.04, but at link-time I get about 10 unresolved externals,
	all of which are OS/2 API calls such as DOSWRITE, DOSCLOSE,
	DOSEXIT.
	
	If I link in the library DOSCALLS.LIB, as follows, the problem is
	corrected:
	
	cl /Lp demo.c doscalls.lib
	
	The manual does not state that DOSCALLS.LIB must be explicitly linked.
	
	Response:
	
	This problem occurs because you are using the wrong version of the
	Microsoft Segmented-Executable Linker. You should be using Version
	5.01.21, which was distributed with C Version 5.10. Version 5.01.04 is
	the OS/2 linker.
	
	You must link in DOSCALLS.LIB with Version 5.01.04 because this
	version of LINK does not have the ability to bring in libraries that
	are themselves requested by a library.
	
	The library xLIBCyP.LIB (where x is the memory model and y is the math
	package) contains a request for DOSCALLS.LIB. Link Version 5.01.21
	understands this request and searches for DOSCALLS.LIB in the
	directories specified in the LIB environment variable; LINK Version
	5.01.04 does not understand this request.
