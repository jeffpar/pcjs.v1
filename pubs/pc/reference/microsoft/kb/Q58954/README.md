---
layout: page
title: "Q58954: &quot;R6002 - Floating Point Not Loaded&quot; Without Math Coprocessor"
permalink: /pubs/pc/reference/microsoft/kb/Q58954/
---

## Q58954: &quot;R6002 - Floating Point Not Loaded&quot; Without Math Coprocessor

	Article: Q58954
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900215-15
	Last Modified: 27-FEB-1990
	
	A BASIC PDS 7.00 program gives "run-time error R6002 - Floating point
	not loaded" on a machine WITHOUT a coprocessor when the BASIC run-time
	library or .EXE program is created with coprocessor-only support.
	Coprocessor-only support means that the BASIC run-time routines
	require an 80x87 (8087, 80287, or 80387) math coprocessor to run.
	
	The R6002 error is an initialization error that cannot be trapped in a
	BASIC program.
	
	Implementing coprocessor-only support in an .EXE program depends upon
	whether you compile with or without the BC /O (stand-alone .EXE)
	option, as follows:
	
	1. If you compile WITHOUT BC /O, BASIC programs require a run-time
	   module (BRT70xxx.EXE) to be present at run time. If you want to
	   build a BASIC run-time module and BRT70xxx.LIB file with
	   coprocessor-only support, you must invoke the BUILDRTM.EXE utility
	   with the /FPi87 switch. For example:
	
	      BUILDRTM /LR /FPi87 /DEFAULT
	
	   (See Page 611 of "Microsoft BASIC 7.0: Language Reference" for an
	   explanation of the options of the BUILDRTM.EXE utility.) You can
	   then link with your new coprocessor-only run-time module, as
	   follows:
	
	      BC test;
	      LINK IMPORT+test,test,,{newlibname} /NOE;
	
	2. If you compile WITH the BC /O (stand-alone .EXE) option, you can
	   directly link your BASIC .OBJ file with the 87.LIB stub file. For
	   example:
	
	      BC test /O;
	      LINK test+87.LIB /NOE;
