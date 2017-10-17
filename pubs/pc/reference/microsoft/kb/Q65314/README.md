---
layout: page
title: "Q65314: C1001: Internal Compiler Error: '@(#)omf.c: 1.88', Line 147"
permalink: /pubs/pc/reference/microsoft/kb/Q65314/
---

## Q65314: C1001: Internal Compiler Error: '@(#)omf.c: 1.88', Line 147

	Article: Q65314
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	The code below, when compiled using default optimizations, produces
	the following error under DOS:
	
	   fatal error C1001: Internal Compiler Error
	   (compiler file '@(#)omf.c:1.88', line 147)
	   Contact Microsoft Product Support Services
	
	The following error is produced under OS/2:
	
	   Command line error D2030 : INTERNAL COMPILER ERROR in 'P2'
	             Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	_segment myseg;
	extern int _based(myseg) a[];
	int _based(_segname("foo")) a[] = { {0} };
	
	To workaround the problem, use one of the following:
	
	1. Compile with the /qc command-line option.
	
	2. Switch the order of lines 2 and 3.
	
	Microsoft has confirmed this to be a problem with the C version 6.00.
	We are researching this problem and will post new information here as
	it becomes available.
