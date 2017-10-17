---
layout: page
title: "Q46024: fopen Will Set errno Values"
permalink: /pubs/pc/reference/microsoft/kb/Q46024/
---

## Q46024: fopen Will Set errno Values

	Article: Q46024
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 18-SEP-1989
	
	Question:
	
	The "Microsoft C 5.10 Optimizing Compiler Run-Time Library Reference"
	manual indicates that open and sopen will set errno values. The fopen
	documentation on Pages 274-275 does not explicitly state that fopen
	will set errno. Will fopen set errno?
	
	Response:
	
	Yes, fopen will set errno values. Internally, fopen calls the same
	low-level routines that open and sopen call. These routines cause
	errno to be set.
	
	For more information, please refer to the documentation for open.
