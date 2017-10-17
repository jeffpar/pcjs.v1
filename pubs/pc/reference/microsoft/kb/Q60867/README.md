---
layout: page
title: "Q60867: Looking for Files in Different Directories"
permalink: /pubs/pc/reference/microsoft/kb/Q60867/
---

## Q60867: Looking for Files in Different Directories

	Article: Q60867
	Version(s): 1.00 1.01 1.10 1.11 | 1.01 1.10 1.11
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER | s_c s_quickc s_quickasm h_fortran
	Last Modified: 17-JUL-1990
	
	If you use the "directory search" feature of NMAKE (curly braces "{}")
	to use a separate directory for some files, the location of these
	files cannot be inferred in subsequent dependency rules.
	
	The following code example demonstrates this confusion:
	
	   test.exe: {\obj}test.obj
	      link \obj\test.obj graphics.lib;
	
	   test.obj: test.c test.h
	      cl /c /Fo\obj\test.obj test.c
	
	If TEST.EXE and \OBJ\TEST.OBJ were up to date and we were to change
	one of the dependencies for TEST.OBJ, nothing would happen. This is
	because \OBJ\TEST.OBJ doesn't have any dependencies. The TEST.OBJ
	dependency line is only for the current directory. If we were to
	change the TEST.OBJ line to the following
	
	   {\obj}test.obj: test.c test.h
	
	a change to TEST.C or TEST.H would cause \OBJ\TEST.OBJ and TEST.EXE
	to be updated.
	
	Note: NMAKE has a predefined inference rule for C.EXE that causes
	TEST.EXE to be relinked in the above example if it is out of date with
	TEST.C.
