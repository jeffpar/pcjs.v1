---
layout: page
title: "Q40184: NMAKE Default Is to Build Only the First Target in a Makefile"
permalink: /pubs/pc/reference/microsoft/kb/Q40184/
---

## Q40184: NMAKE Default Is to Build Only the First Target in a Makefile

	Article: Q40184
	Version(s): 1.00 1.01 1.11 1.12 | 1.01 1.11 1.12
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The NMAKE file maintenance utility will only "make" the first target
	in the makefile if no target is explicitly given on the command line.
	
	Although the following sample makefile will both compile and link
	PROG1.EXE when used with MAKE, it will only compile when the NMAKE
	utility is used. This is an important consideration when porting
	makefiles from MAKE to NMAKE.
	
	# Sample makefile MAKEFILE1
	
	PROG1.OBJ : PROG1.C
	    cl /Zi /c PROG1.C
	
	PROG1.EXE : PROG1.OBJ
	    link /CO PROG1.OBJ
	
	If all files are out of date with PROG1.C, and MAKEFILE1 is executed
	with the standard invocation as follows
	
	   NMAKE /f makefile1
	
	the only command executed from MAKEFILE1 will be the following:
	
	   cl /Zi /c prog1.c
	
	The LINK command will not be executed because NMAKE did not receive a
	specific target; thus, it only makes the first target in the makefile.
	To achieve the desired results, the desired target (PROG1.EXE) must be
	specified on the NMAKE command-line or the following line could be
	added to MAKEFILE1 (it must be the first line in the makefile):
	
	   ALL : PROG1.EXE
	
	This pseudotarget "ALL" will be made because it will be the first
	target in the makefile. By using the pseudotarget, it is guaranteed
	that all dependencies will be made because the dependents are always
	out of date. This will force NMAKE to make all targets dealing with
	PROG1.EXE.
	
	Please refer to the NMAKE documentation shipped with your compiler or
	assembler for more information.
