---
layout: page
title: "Q64180: L1089 Caused by Wrong Linker in OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q64180/
---

	Article: Q64180
	Product: Microsoft C
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER | S_LINK
	Last Modified: 31-JUL-1990
	
	Linker fatal error L1089, "Cannot open response file," can be caused
	by trying to use the OS/2 system linker with Microsoft C version 6.00.
	
	This problem can be demonstrated by placing the directory with the
	OS/2 linker in your path before your \C600\BINB directory and then
	attempting to compile and link with the cl compiler, for example:
	
	   cl foo.c
	
	The simplest workaround is to place the \C600 directories before the
	OS/2 directories in your path.
