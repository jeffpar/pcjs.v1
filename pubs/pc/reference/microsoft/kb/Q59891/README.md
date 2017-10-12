---
layout: page
title: "Q59891: li, lu, and ld Replace I, U, and D as Format Specifiers"
permalink: /pubs/pc/reference/microsoft/kb/Q59891/
---

	Article: Q59891
	Product: Microsoft C
	Version(s): 2.00 2.01 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm s_c docsup
	Last Modified: 29-MAY-1990
	
	When scanning long values with the scanf() function, use %li, %lu, and
	%ld.
	
	Since the format specifiers %I, %U, and %D are not part of the ANSI
	standard, they will not be supported in compilers released after the C
	Version 5.10 Optimizing Compiler.
	
	You must follow the ANSI standard and use %l[x] for long values.
	
	If you use %I, %U, or %D as a format specifier for a long value, the
	scanf() function family will not return an indication of an error.
	Instead the format specifier will be treated as its lowercase
	counter part. For example:
	
	   %I --> %i
	   %U --> %u
	   %D --> %d
