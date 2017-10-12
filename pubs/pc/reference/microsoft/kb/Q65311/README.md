---
layout: page
title: "Q65311: Compiling C 5.10 Code with C 6.00 Can Cause Stack Overflow"
permalink: /pubs/pc/reference/microsoft/kb/Q65311/
---

	Article: Q65311
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 31-AUG-1990
	
	Microsoft C version 6.00 uses stack space differently than Microsoft C
	version 5.10. Thus, programs that use most of the allocated stack
	space under C 5.10 will cause a stack overflow when compiled with C
	6.00. This problem can be resolved by increasing the stack space by
	using the /F compile option or the /ST linker option.
