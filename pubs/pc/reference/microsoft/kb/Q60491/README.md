---
layout: page
title: "Q60491: cl May Run Out of Memory When Compiling Many Files At Once"
permalink: /pubs/pc/reference/microsoft/kb/Q60491/
---

	Article: Q60491
	Product: Microsoft C
	Version(s): 6.00 6.00a  | 6.00 6.00a
	Operating System: MS-DOS      | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 31-JAN-1991
	
	Compiling large numbers of files in one compilation pass can cause an
	"Out Of Memory" error. CL.EXE is making memory allocations for each
	file it compiles that isn't being freed until CL.EXE terminates.
	
	This problem is most frequently encountered when passing wildcards to
	the cl command. For example:
	
	   cl -c *.c
	
	The best workaround is to use a MAKE file to govern the compilation of
	large programs. Because NMAKE spawns CL.EXE separately for each source
	module, the memory is returned to the operating system between each
	source compilation.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
