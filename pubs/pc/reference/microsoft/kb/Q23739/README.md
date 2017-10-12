---
layout: page
title: "Q23739: C and QuickC Compiler Options Should Be Placed Before .C File"
permalink: /pubs/pc/reference/microsoft/kb/Q23739/
---

	Article: Q23739
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 4-DEC-1990
	
	The C and QuickC compiler switches must be specified on the command-
	line, before any source files that the option is intended to apply to.
	In most cases, specifying options at the end of the command-line after
	a filename will NOT generate any warnings or errors -- the compiler
	will ignore the options because there are no following source files
	that the options apply to.
	
	In a few cases, a trailing option at the end of the command-line will
	generate an error if the option conflicts with a previously specified
	option.
