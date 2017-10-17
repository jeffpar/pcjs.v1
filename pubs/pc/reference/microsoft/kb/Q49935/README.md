---
layout: page
title: "Q49935: Link Error L2028 Caused by HEAPSIZE, STACKSIZE and DGROUP Size"
permalink: /pubs/pc/reference/microsoft/kb/Q49935/
---

## Q49935: Link Error L2028 Caused by HEAPSIZE, STACKSIZE and DGROUP Size

	Article: Q49935
	Version(s): 5.01.21 | 5.01.21
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 17-JUL-1990
	
	The error L2028 "Automatic data segment plus heap exceeds 64K" was
	omitted from the linker error messages in the "CodeView and Utilities,
	Microsoft Editor, Mixed-Language Programming Guide" manual that
	accompanies Microsoft C 5.10. This error occurs when the stack and
	data plus the near heap exceeds 64K. The near heap size is set with
	the HEAPSIZE option in the .DEF file.
	
	The error can be corrected by using one of the following methods:
	
	1. Reducing the amount of data in the default data segment.
	
	2. Decreasing the stack size that was set by /ST:xxxx at the link line
	   or by the STACKSIZE option in the .DEF file.
	
	3. Decreasing the amount of near heap that is being requested with the
	   HEAPSIZE option in .DEF file.
