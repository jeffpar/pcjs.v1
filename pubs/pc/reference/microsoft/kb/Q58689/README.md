---
layout: page
title: "Q58689: Linking Method May Result in Unexpected Increase in .EXE Size"
permalink: /pubs/pc/reference/microsoft/kb/Q58689/
---

## Q58689: Linking Method May Result in Unexpected Increase in .EXE Size

	Article: Q58689
	Version(s): 3.x 4.06 4.07 5.01.21 5.03 | 5.01.21 5.03
	Operating System: MS-DOS                     | OS/2
	Flags: ENDUSER |
	Last Modified: 21-FEB-1990
	
	Question:
	
	When my program is linked in the following manner
	
	   link  file1.obj file2.obj library.lib;
	
	the resulting executable file is much larger than if the program is
	linked this way:
	
	   link  file1.obj file2.obj,,,library.lib;
	
	What causes the difference in size?
	
	Response:
	
	This is expected behavior, the difference in size is due to the
	difference in linking method.
	
	The first method has the library name in the same field as the object
	files. Libraries entered in this field are called "load libraries" as
	opposed to "regular libraries." Link automatically links in every
	object module in a load library; it does not search for unresolved
	external references first.
	
	The effect of using a load library is exactly the same as if you had
	entered all the names of the library's object modules as separate
	object files on the link command line. This feature is useful if you
	are developing software using many modules and want to avoid having to
	retype each module on the LINK command line.
	
	With the second method, LINK links in only the objects from the
	library that are required for program execution.
	
	Please see documentation on LINK, such as Section 12.1.2 of the
	Microsoft C 5.1 "CodeView and Utilities Software Development Tools for
	the MS-DOS Operating System" manual (Page 257) for more information.
