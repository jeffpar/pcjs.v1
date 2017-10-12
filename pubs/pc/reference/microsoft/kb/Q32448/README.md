---
layout: page
title: "Q32448: Specifying .DEF Files on the CL Command Line"
permalink: /pubs/pc/reference/microsoft/kb/Q32448/
---

	Article: Q32448
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 8-JUL-1988
	
	You can use .DEF files when compiling and linking, using CL
	command-lines.
	   List the .DEF files with the other files (.C, .OBJ, and .LIB). CL
	will compile and link them appropriately. Note that if you do not
	specify an extension, CL assumes the file is an .OBJ file and it will
	try to link it.
	   The following command will build a protected-mode program called
	MYAPP.EXE by compiling myapp.c, then linking MYAPP.OBJ and MYSUB.OBJ
	with the library MYLIB.LIB, and use the MYDEF.DEF.definitions file:
	
	    cl /Lp myapp.c mysub mylib.lib mydef.def
