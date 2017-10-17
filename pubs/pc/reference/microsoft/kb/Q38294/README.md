---
layout: page
title: "Q38294: Overwriting End of HALLOC Causes Crash at Termination"
permalink: /pubs/pc/reference/microsoft/kb/Q38294/
---

## Q38294: Overwriting End of HALLOC Causes Crash at Termination

	Article: Q38294
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 12-DEC-1988
	
	The following message appearing at the termination of a program can be
	caused by overwriting past the end of a block of memory allocated by
	the halloc function:
	
	   Memory allocation error: Cannot load command.com
	
	The bytes following a halloc'd block are used by DOS for keeping
	track of memory allocation, and DOS may be unable to load command.com
	upon completion of your process if this area is corrupted.
	
	This error can also conceivably be caused by overwriting blocks of
	memory allocated by other functions such as malloc, _nmalloc, and _fmalloc.
