---
layout: page
title: "Q65306: toupper() Gives C4135 Warning"
permalink: /pubs/pc/reference/microsoft/kb/Q65306/
---

## Q65306: toupper() Gives C4135 Warning

	Article: Q65306
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 31-AUG-1990
	
	When compiling a function that contains a call to toupper() in the
	format
	
	   char toupper (char)
	
	at warning level 2 or above, the compiler will generate the following
	warning message:
	
	   C4135: Conversion between two integral types
	
	Since the ANSI-standard draft of December 7, 1988, specifies the
	syntax for this function as follows, the warning is in compliance with
	the standard:
	
	   int toupper (int)
