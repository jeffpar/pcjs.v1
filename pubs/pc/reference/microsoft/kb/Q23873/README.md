---
layout: page
title: "Q23873: R6002 &quot;Floating Point Not Loaded&quot; May Result from printf() Use"
permalink: /pubs/pc/reference/microsoft/kb/Q23873/
---

	Article: Q23873
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 4-DEC-1990
	
	Question:
	
	I have a simple program that prints out some numbers. Every time I try
	to run the program, I get the error message "R6002: Floating point
	support not loaded." Why do I get this error when I don't have any
	floats in my program?
	
	Response:
	
	You most likely have a printf() statement in your program that
	contains a floating point format specifier, such as %f in the format
	string. At link time, the floating-point library modules will not be
	loaded unless floats are declared. This saves space by making the
	executable file smaller. However, in this case the program will
	encounter this floating-point format specifier at run time and will
	generate the above error because the floating-point handling routines
	are needed by the printf() call.
	
	To work around this problem, just declare and initialize a floating
	point variable in your program. This will force the floating point
	support to be linked into the .EXE file.
