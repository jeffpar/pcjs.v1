---
layout: page
title: "Q37023: Link Error No Stack Segment after Using Windows SDK Install"
permalink: /pubs/pc/reference/microsoft/kb/Q37023/
---

	Article: Q37023
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-DEC-1988
	
	If a C program generates linker errors stating that no stack segment
	exists and that there are several unresolved externals references made
	by the startup code, the program may have been linked with libraries
	modified by the Windows SDK Install program.
	
	The Windows install program modifies C libraries, upon your request,
	so that when linking Window applications it can look for the standard
	library names with no other linker options specified. A more detailed
	explanation can be found in the README.WRI on the Development
	Utilities Disk 1 that comes with Windows SDK Version 2.00.
	
	The install program retains the original C library. The library will
	have its same name with a "C" appended. For instance, SLIBCE.LIB will
	be copied to SLIBCEC.LIB. When you link with this library, make sure
	to use the /NOD option and specify the library by name.
