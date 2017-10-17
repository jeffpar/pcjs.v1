---
layout: page
title: "Q61314: The Limit of Macro Expansion"
permalink: /pubs/pc/reference/microsoft/kb/Q61314/
---

## Q61314: The Limit of Macro Expansion

	Article: Q61314
	Version(s): 5.00 5.10 6.00| 5.10 6.00
	Operating System: MS-DOS        | OS/2
	Flags: ENDUSER |
	Last Modified: 11-JUL-1990
	
	The limit of a preprocessor macro expansion can be no more than 6K
	when it is FULLY expanded. Similarly, actual arguments plus FULLY
	expanded actual arguments are not allowed to exceed 6K during a single
	macro expansion. Note that this is not the same as saying that the
	macro DEFINITIONS must be 6K or less.The 6K limitation was chosen
	because the buffer used for expansion is dynamically allocated and 6K
	seemed to be a reasonable limit for most real programs.
	
	Additionally, there is a nesting DEPTH limit of 64 on macros in
	C1.EXE, and 256 in C1L.EXE. This may be noticed only if you are
	writing macros for some relocatable indexing scheme, such as in the
	following example:
	
	#define INCOME 1;
	#define EXPENSE (INCOME+1)
	#define GINCOME (EXPENSE+1)
	#define TAXES (GINCOME+1)
	#define NINCOME (TAXES+1)
	...etc...
	
	Version 6.00 of the Microsoft C Compiler has greater capacity than
	version 5.10. The version 5.00 compiler does not have a limit on the
	length of a macro, but the algorithm used does not support the # and
	## operators according to ANSI standards.
	
	Note: If you run out of heap space during the first phase of
	compilation with code containing deeply nested macros, preprocessing
	the file before you compile it may alleviate the problem.
