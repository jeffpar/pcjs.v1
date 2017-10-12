---
layout: page
title: "Q58688: Why the First Module in the Code Segment Starts at Offset 16"
permalink: /pubs/pc/reference/microsoft/kb/Q58688/
---

	Article: Q58688
	Product: Microsoft C
	Version(s): 3.x 4.06 4.07 5.01.21 5.03 | 5.01.21 5.03
	Operating System: MS-DOS                     | OS/2
	Flags: ENDUSER | s_c s_quickc s_quickasm h_masm h_fortran
	Last Modified: 14-FEB-1990
	
	Question:
	
	Under some circumstances, I get 16 zero bytes at the beginning of my
	code segment. I'm linking with my own replacement C library with
	start-up code. The entry point to this start-up module is the first
	item in the module, and it always ends up at offset 16. Why is this?
	
	Response:
	
	The linker will insert 16 bytes at the beginning of the code segment
	if it determines that you are using standard segment naming
	conventions (/MS-DOSSEG) and the NULL segment is not explicitly
	removed (/NONULLSMS-DOSSEG). In your case, the linker assumes that you
	need support for signal() and allocates the first 16 bytes for it.
	
	Note: This will always be done for C programs by the compiler.
