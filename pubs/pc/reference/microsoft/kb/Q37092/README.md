---
layout: page
title: "Q37092: BUILDRTM Puts C Routines in BC 6.00 Extended Run-Time Library"
permalink: /pubs/pc/reference/microsoft/kb/Q37092/
---

## Q37092: BUILDRTM Puts C Routines in BC 6.00 Extended Run-Time Library

	Article: Q37092
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	You can include Microsoft C routines in a Microsoft BASIC Compiler
	Version 6.00 or 6.00b or a Microsoft BASIC Professional Development
	System (PDS) Version 7.00 extended run-time library by using the
	BUILDRTM utility, provided that the C routine does not have C graphics
	support (such as GRAPH.H). The following is an example of this for a
	void function called "test" located in a source file named PROG1.C:
	
	1. Compile the C program with the medium or large model as follows:
	
	      CL prog1 /Al
	
	2. Create an export list and include the new routine(s) to be added to
	   the BASIC compiler extended run-time library, as follows (call this
	   file "EXP.LST"):
	
	      #Here is the export list example.
	      #OBJECTS
	      prog1
	      #EXPORTS
	      _test
	      #LIBRARIES
	      llibcer.lib
	
	3. Invoke BUILDRTM using the EXP.LST to create the new run-time
	   library with the following:
	
	      BUILDRTM /LR /FPI NEWRUN EXP.LST
	
	The above steps are covered more completely on Pages 13-19 of the
	"Microsoft BASIC Compiler 6.0: User's Guide" or Pages 661-668 of the
	"Microsoft BASIC 7.0: Programmer's Guide."
	
	The above steps produce a new run-time library called "NEWRUN.EXE" and
	a matching "NEWRUN.LIB" file. Now your Microsoft BASIC programs can be
	linked with NEWRUN to allow a program to call the C void function
	"_test" at any time. For example, if you want your new BASIC program,
	named PROG2.BAS, to call "_test," compile normally as follows:
	
	   BC PROG2.BAS;
	
	This produces the PROG2.OBJ file. Then link with your new extended
	run-time library using IMPORT.OBJ as the first object file. This helps
	LINK understand that there are more support routines than the standard
	run-time library. The following is an example:
	
	   LINK IMPORT.OBJ+PROG2.OBJ,PROG2.EXE,,NEWRUN.LIB/NOD;
	
	This produces the .EXE file PROG2.EXE, which requires the NEWRUN.EXE
	extended run-time library to run.
