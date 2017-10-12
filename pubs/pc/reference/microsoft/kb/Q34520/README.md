---
layout: page
title: "Q34520: Library Reference Defines Unused result Pointer"
permalink: /pubs/pc/reference/microsoft/kb/Q34520/
---

	Article: Q34520
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-OCT-1988
	
	The program example for qsort on Page 476 in the "Microsoft C
	Optimizing Compiler Run-Time Library Reference" has a documentation
	error. The following first declaration within the main function, is
	unnecessary:
	
	char **result;
	
	The result pointer is never used in the program.
