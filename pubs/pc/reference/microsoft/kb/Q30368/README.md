---
layout: page
title: "Q30368: Linking .OBJ Files from Compilers Prior to 5.00 May Give L4051"
permalink: /pubs/pc/reference/microsoft/kb/Q30368/
---

## Q30368: Linking .OBJ Files from Compilers Prior to 5.00 May Give L4051

	Article: Q30368
	Version(s): 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	Question:
	
	When I try to link an object module compiled with the C version 3.00
	or 4.00, the linker generates the error L4051: cannot find library.
	It then prompts me for the location of LLIBC.LIB, EM.LIB, LLIBFP.LIB,
	and LIBH.LIB. Why is it looking for these files?
	
	Response:
	
	The C compilers embed references to the default libraries in each .OBJ
	module. When you link, the linker detects these library names and
	searches the specified libraries for any unresolved references in the
	code. If the .OBJ files were compiled with C version 4.00 or earlier,
	the .OBJ modules will contain the names of the component C libraries,
	rather than the combined libraries that have been used since C 5.00.
	Because these libraries are usually not available under their separate
	names, the linker prompts you for the path specification.
	
	To avoid this error when linking object modules compiled with the C
	version 3.00 or 4.00 compiler with object modules compiled with C
	version 5.00 or later, you must list the combined C library explicitly
	along with the link switch /NOD. This tells the linker to ignore any
	embedded library references in the object modules.
	
	The following are two examples of how to link C 4.00 .OBJ files with C
	5.00 or 5.10 .OBJ files:
	
	   link c4mod c5mod,,,llibce.lib/NOD;
	
	or
	
	   cl c4mod c5mod /link llibce.lib/NOD;
