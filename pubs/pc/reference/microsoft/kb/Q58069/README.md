---
layout: page
title: "Q58069: C 5.10 Prototypes Differ Between &#92;INCLUDE and &#92;INCLUDE&#92;MT"
permalink: /pubs/pc/reference/microsoft/kb/Q58069/
---

## Q58069: C 5.10 Prototypes Differ Between &#92;INCLUDE and &#92;INCLUDE&#92;MT

	Article: Q58069
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1991
	
	Multithreaded programs are linked with LLIBCMT.LIB and include header
	files from the \INCLUDE\MT directory. If you link with LLIBCMT, but
	include header files from the \INCLUDE directory, you may get the
	linker message "L2029, unresolved external" on one or more of the C
	run-time routines. You can resolve the problem by including the
	multithreaded header files.
	
	The linker must resolve external references based on the names written
	to the object file. The explicit format of these names is directly
	affected by the prototypes you use in your program, and when you
	include the header files, you are specifying function prototypes. The
	prototypes for some functions are different between the single and
	multithreaded header files. For example, atof() is defined in the
	   double _CDECL atof(const char *);
	
	and in \INCLUDE\MT\STDLIB.H as follows:
	
	   double far pascal atof(const char far *);
	
	The keyword _CDECL means to use C language conventions (that is,
	preserve case and prepend a leading underscore). The keyword pascal
	means to use Pascal language conventions (that is, promote to
	uppercase and do not add a leading underscore). When the linker is
	looking for _atof, it does not consider ATOF a match.
	
	You can find complete compile and link instructions for multithreaded
	programming in MTDYNA.DOC, which is on the C version 5.10 disks.
