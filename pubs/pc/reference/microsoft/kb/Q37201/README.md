---
layout: page
title: "Q37201: System Memory Allocation Error after Using halloc or malloc"
permalink: /pubs/pc/reference/microsoft/kb/Q37201/
---

	Article: Q37201
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S880914-27
	Last Modified: 18-NOV-1988
	
	After running a program you have created that uses malloc or
	halloc functions, DOS may print the following message:
	
	Memory Allocation Error
	Cannot Load COMMAND.COM.
	
	You are able to allocate, use, write, read, and free memory, but when
	your program finishes, you receive the error. If you remove halloc()
	from your program, it terminates normally.
	
	Your program is probably writing outside of a memory block you
	allocated using halloc or malloc. DOS maintains information about
	memory usage in blocks immediately preceding the area you're given.
	This error is usually are result of overwriting these information
	blocks. The solution is to find out where you're overwriting DOS's
	memory and avoid doing it.
	
	Note: this error can also be the result of writing PAST the end of a
	block because you could corrupt the list entry for the NEXT block.
	
	You can determine where the overwrite occurs by using CodeView to set
	a tracepoint on the space after the allocated block. If you don't have
	enough memory to run CodeView, you can narrow down the problem by
	using a pointer to check those bytes at selected points in your
	program.
