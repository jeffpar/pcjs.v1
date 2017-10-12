---
layout: page
title: "Q65084: Spaces in Inference Rules Corrupt NMAKE Macro Expansion"
permalink: /pubs/pc/reference/microsoft/kb/Q65084/
---

	Article: Q65084
	Product: Microsoft C
	Version(s): 1.00 1.11 | 1.00 1.11
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 28-AUG-1990
	
	If a space is inserted between the target and dependent extensions in
	an inference rule, it will cause NMAKE's default macros to expand
	incorrectly. The correct syntax for inference rules is to list the
	dependent file extension followed by the target file extension WITHOUT
	any embedded spaces.
	
	The following sample make files demonstrate a few of the problematic
	results that are possible if spaces are used in an inference rule. In
	both cases below, note that it is the embedded spaces that cause NMAKE
	to invoke the commands incorrectly. Removing the spaces allows NMAKE
	to generate the desired commands.
	
	Example 1
	---------
	
	{c:\source\}.c {c:\objs\}.obj:
	  cl $*
	
	ALL: c:\objs\foo2.obj
	
	c:\objs\foo2.obj: c:\source\foo2.c
	
	Command executed by NMAKE:
	
	cl {c:\objs\}
	
	Example 2
	---------
	
	.c .obj:
	  cl $<
	
	ALL: foo.obj
	
	foo.obj: foo.c
	
	Command executed by NMAKE:
	
	cl
