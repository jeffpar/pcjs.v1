---
layout: page
title: "Q43396: C: _bios_timeofday Documentation Error"
permalink: /pubs/pc/reference/microsoft/kb/Q43396/
---

	Article: Q43396
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 14-APR-1989
	
	On Page 146 of the "Microsoft C 5.1 Optimizing Compiler Run-Time
	Library Reference" manual and the "Microsoft QuickC Run-Time Library
	Reference" manual, the second parameter of _bios_timeofday is
	incorrectly stated as a long integer, as follows:
	
	   long timeval;
	
	The corrected declaration is a pointer to a long integer, as follows:
	
	   long *timeval;
