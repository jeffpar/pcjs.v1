---
layout: page
title: "Q59141: Accessing Environment Variables Inside MAKE or NMAKE Makefile"
permalink: /pubs/pc/reference/microsoft/kb/Q59141/
---

## Q59141: Accessing Environment Variables Inside MAKE or NMAKE Makefile

	Article: Q59141
	Version(s): 1.00 1.01 1.10 1.11 1.12 | 1.01 1.10 1.11 1.12
	Operating System: MS-DOS                   | OS/2
	Flags: ENDUSER | s_make
	Last Modified: 23-JAN-1991
	
	You can access environment variables within a MAKE or NMAKE makefile
	in the same way that you access user-defined macros. The only
	difference is that the names of environment variables must be
	capitalized when used in this manner. For example:
	
	SOURCE=c:\mysource
	# the INCLUDE "macro" will pick up your INCLUDE environment variable
	
	file.obj : $(SOURCE)\file.c $(INCLUDE)\file.h
	    cl /c /Zi /Od $(SOURCE)\file.c
