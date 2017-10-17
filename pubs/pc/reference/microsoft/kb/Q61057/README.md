---
layout: page
title: "Q61057: C6 /Gh Switch for Windows 2.x and C 5.10 Library Compatability"
permalink: /pubs/pc/reference/microsoft/kb/Q61057/
---

## Q61057: C6 /Gh Switch for Windows 2.x and C 5.10 Library Compatability

	Article: Q61057
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-MAY-1990
	
	The Microsoft C version 6.00 Compiler option /Gh facilitates the use
	of C version 5.10 libraries with version 6.00 by replacing the C 6.00
	internal helper routine names with the earlier C 5.10 helper routine
	names. The /Gh option also allows building Windows Versions 2.x
	applications.
	
	Note: When using any C 5.10 libraries, the C 5.10 header files should
	also be used.
	
	Most C 5.10-compatible libraries can be used without using the /Gh
	option. This feature exists only in version 6.00 of the compiler and
	will be phased out in future versions.
	
	The following are common situations where the /Gh option might be
	used:
	
	1. Writing Windows 2.x applications because the Window 2.x libraries
	   are used in place of the standard run-time libraries and they are
	   created from the C 5.10 libraries.
	
	2. Use of any library where the helper functions have been replaced.
	
	3. Use of customized run-time libraries.
