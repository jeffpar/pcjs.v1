---
layout: page
title: "Q48862: Incrementally Updating Libraries with NMAKE"
permalink: /pubs/pc/reference/microsoft/kb/Q48862/
---

## Q48862: Incrementally Updating Libraries with NMAKE

	Article: Q48862
	Version(s): 1.00 1.01 1.10 1.11 1.12 | 1.11 1.12
	Operating System: MS-DOS                   | OS/2
	Flags: ENDUSER |
	Last Modified: 25-FEB-1991
	
	The repetition modifier "!" (without the quotation marks) provided in
	NMAKE allows libraries to be maintained and incrementally updated very
	easily. By using this modifier with the special macro for dependents
	out-of-date with the target (for example, "$?"), the library update
	becomes an automated part of modifying a project.
	
	The following NMAKE makefile keeps FOO.LIB up-to-date based on the
	four object files listed in the OBJS macro. These object files can be
	based on C or assembly source files. The list of source-file types can
	be extended by adding the appropriate inference rules to the
	description file.
	
	Sample NMAKE Makefile
	---------------------
	
	    #
	    # List of object files to be kept in library
	    #
	    OBJS = foo1.obj foo2.obj foo3.obj foo4.obj
	
	    .c.obj:
	        cl /c $?
	
	    .asm.obj:
	        masm $?;
	
	    foo.lib : $(OBJS)
	        !lib foo.lib -+ $?;
	
	The command for the library dependency line uses a predefined macro
	and a special NMAKE directive. Placing "$?" on the end of the LIB line
	expands to the list of all dependents that are out-of-date with the
	target. This list combined with "!" causes the LIB line to be executed
	once for each member in the list.
	
	If FOO1.OBJ and FOO3.OBJ are out-of-date with respect to FOO.LIB, "$?"
	evaluates to "FOO1.OBJ FOO3.OBJ". With "!", the following commands are
	executed:
	
	   lib foo.lib -+ foo1.OBJ;
	   lib foo.lib -+ foo3.OBJ;
