---
layout: page
title: "Q32513: ANSI Constants Not in Stdio.h"
permalink: /pubs/pc/reference/microsoft/kb/Q32513/
---

	Article: Q32513
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 8-JUL-1988
	
	The ANSI C standard requires the constants FILENAME_MAX and
	FOPEN_MAX in STDIO.H and the constants EXIT_SUCCESS and EXIT_FAILURE
	in STDLIB.H.
	   The include files provided with Version 5.10 of the C compiler do not
	have these constants. These constants should be defined as follows:
	
	/* in stdio.h */
	
	#define FILENAME_MAX 63
	#define FOPEN_MAX    20
	
	/* in stdlib.h */
	
	#define EXIT_SUCCESS  0
	#define EXIT_FAILURE  1
