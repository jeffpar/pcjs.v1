---
layout: page
title: "Q35539: Libraries Created by IMPLIB Are Different than those from LIB"
permalink: /pubs/pc/reference/microsoft/kb/Q35539/
---

	Article: Q35539
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S880908-4
	Last Modified: 26-SEP-1988
	
	The only similarity between Libraries created by IMPLIB and libraries
	created by LIB is the filename extension ".LIB".
	
	Libraries created by IMPLIB only contain the names of functions and
	modules to satisfy the linker. The actual code is brought in later by
	loading Dynamic Link Libraries (DLL).
	
	Regular libraries contain all the code for the functions. One or more
	functions are contained in a module (e.g. object file). The code for
	the entire module containing a called function is statically linked
	into the executable file.
	
	You cannot use LIB to get any information about libraries created by
	IMPLIB. You cannot combine IMPLIB and LIB libraries. To see what
	modules are in an IMPLIB library, use the type command to display the
	.LIB file; it is a text file.
