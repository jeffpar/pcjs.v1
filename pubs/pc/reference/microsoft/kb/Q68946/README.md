---
layout: page
title: "Q68946: NMK Macros Do Not Override Environment Variables"
permalink: /pubs/pc/reference/microsoft/kb/Q68946/
---

	Article: Q68946
	Product: Microsoft C
	Version(s): 1.11
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.11
	Last Modified: 6-FEB-1991
	
	Macros that are created to redefine environment variables (such as
	INCLUDE, LIB, and PATH) do not work correctly when the description
	file is executed using NMK.COM, rather than NMAKE.EXE.
	
	The description file below, when executed by NMAKE.EXE, will look for
	the include files in the directory "E:\C\INCLUDE". If the same
	description file is executed by NMK.COM, the include directory will be
	determined by the include environment variable.
	
	Sample Code
	-----------
	
	INCLUDE=E:\C\INCLUDE
	
	FOO.EXE : FOO.OBJ
	   link foo.obj;
	
	FOO.OBJ : FOO.C
	   cl /c foo.c
	
	Note: This example will reproduce the problem correctly only if the
	following conditions are met.
	
	1. FOO.C exists.
	2. FOO.C contains a line of the form:
	
	      #include <INC_FILE.H>
	
	3. INC_FILE.H exists in the directory "E:\C\INCLUDE".
	4. INC_FILE.H does not exist in the default include directory.
	
	Finally, NMK does change the variable for arguments that are in the
	makefile. Therefore, to work around the problem above, you can use the
	following example:
	
	INCLUDE=E:\C\INCLUDE
	
	FOO.EXE : FOO.OBJ
	   link foo.obj;
	
	FOO.OBJ : FOO.C
	   cl /c /I$(INCLUDE) foo.c
	
	
	
	
	
	
	Microsoft Development Utilities
	=============================================================================
