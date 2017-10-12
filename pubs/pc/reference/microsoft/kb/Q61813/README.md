---
layout: page
title: "Q61813: Graphics Functions Available for OS/2 Protected Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q61813/
---

	Article: Q61813
	Product: Microsoft C
	Version(s): 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 15-AUG-1990
	
	The following is a compilation of the types of graphics functions
	available under OS/2 with the Microsoft C Optimizing Compiler versions
	5.10 and 6.00.
	
	C 5.10
	------
	
	The graphics library provided with the Microsoft C version 5.10
	Optimizing Compiler does not support OS/2 protected mode. These
	graphic functions are written strictly for real mode.
	
	On the Update Page 25 of the "Microsoft C 5.1 Update" section of the
	"Microsoft C Optimizing Compiler: User's Guide" (Section 7.2.1), there
	is a list of functions supported in real mode only. All of the
	graphics functions also should be listed.
	
	C 6.00
	------
	
	The graphics library provided with the Microsoft C Optimizing Compiler
	version 6.00 supports text-oriented graphics in a separate library
	file named GRTEXTP.LIB.
	
	A list of the available text graphics functions for OS/2 are listed in
	appendix Section B.2.12 on Page 431 of the "Microsoft C Advanced
	Programming Techniques" manual for version 6.0.
	
	All of the standard graphics routines listed in the manuals are
	available under DOS. The above restrictions apply only to programs
	compiled for use with OS/2 protected mode.
	
	Extended graphics support for OS/2 can be accomplished by using the
	OS/2 presentation manager (PM) library functions using Microsoft C
	version 5.10 or 6.00. The OS/2 PM libraries are included with the
	Presentation Manager Toolkit version 1.10 or 1.20, as well as with the
	OS/2 Software Development Kit version 2.00.
