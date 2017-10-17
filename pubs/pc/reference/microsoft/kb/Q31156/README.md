---
layout: page
title: "Q31156: How to Add Routines to Quick Libraries (.QLB Files)"
permalink: /pubs/pc/reference/microsoft/kb/Q31156/
---

## Q31156: How to Add Routines to Quick Libraries (.QLB Files)

	Article: Q31156
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 11-JAN-1990
	
	The following information describes how to add routines to Quick
	libraries (.QLB files) using their corresponding .LIB library files or
	their original .OBJ files.
	
	Microsoft recommends that a .LIB file be maintained for every .QLB
	file. Maintaining a .LIB file makes it easier to maintain a .QLB file
	and to identify the Quick library's contents. Note that QLBDUMP.BAS,
	provided on the QuickBASIC release disk, displays the contents of a
	.QLB Quick library.
	
	This article applies to QuickBASIC Versions 4.00, 4.00b and 4.50, to
	the QuickBASIC compiler that comes with Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to the QBX.EXE
	editor that comes with Microsoft BASIC PDS Version 7.00 for MS-DOS and
	MS OS/2.
	
	Note: The LIB.EXE library manager utility takes .OBJ and .LIB files as
	input arguments and outputs restructured .LIB library files.
	
	The LINK.EXE linker program takes .OBJ and .LIB files as input
	arguments and gives .QLB Quick library files for output if you use the
	LINK /Q option.
	
	The following are three different methods (Examples A, B, and C) for
	adding a routine to a Quick library:
	
	Example A is as follows:
	
	To add a routine (from any supported language) to a Quick library if
	the Quick library's matching .LIB library file is present, do the
	following:
	
	1. Suppose you have an object module, FOO.OBJ, that you wish to add to
	   the Quick library OLDLIB.QLB. OLDLIB.QLB was previously created from
	   OLDLIB.LIB.
	
	2. Add the .OBJ file (FOO.OBJ) to the .LIB library file. For example,
	   the following line adds the routine FOO.OBJ to OLDLIB.LIB and outputs
	   NEWLIB.LIB:
	
	      LIB OLDLIB.LIB+FOO.OBJ,,NEWLIB.LIB;
	
	3. Do one of the following:
	
	   a. Create a Quick library (.QLB) from the NEWLIB.LIB file. For
	      example, the following line produces NEWLIB.QLB:
	
	         LINK /Q NEWLIB.LIB,,,BQLB40.LIB;
	
	      Note: BQLB40.LIB is required for QuickBASIC Version 4.00.
	      BQLB41.LIB is required to make Quick libraries in QuickBASIC
	      Version 4.00b (and later) or the QuickBASIC which comes with
	      the BASIC compiler Version 6.00 or 6.00b. QBXQLB.LIB is
	      required to make Quick libraries for the QBX.EXE editor, which
	      comes with BASIC PDS Version 7.00.
	
	   b. The following is an equivalent alternative to the step above
	      that also outputs NEWLIB.QLB:
	
	         LINK /Q OLDLIB.LIB+FOO.OBJ,NEWLIB.QLB,,BQLB40.LIB;
	
	      (Don't forget step 2, or else your .LIB file will contain
	      different routines than your .QLB file.)
	
	Example B is as follows:
	
	To add an .OBJ module (from any supported language) to a Quick
	library, do the following:
	
	1. Compile (into .OBJ form) the routines(s) that are to be added. For
	   example, the following line invokes the Microsoft FORTRAN compiler
	   to produce FORSUB.OBJ, a FORTRAN subprogram:
	
	      fl /c FORSUB.FOR
	
	2. In the LINK command line, add together the desired .OBJ and/or .LIB
	   files (such as FORSUB.OBJ, FOO.OBJ, and OLDLIB2.LIB) to create a
	   Quick library. For example, the following outputs FOO.QLB:
	
	      LINK /Q FOO.OBJ+FORSUB.OBJ+OLDLIB2.LIB,,,BQLB40.LIB;
	
	   Note: BQLB40.LIB is required for QuickBASIC Version 4.00.
	   BQLB41.LIB is required to make Quick libraries in QuickBASIC
	   Version 4.00b or in the version of QuickBASIC that comes with the
	   BASIC compiler Version 6.00 or 6.00b. QBXQLB.LIB is required for
	   the QBX.EXE editor, which comes with BASIC PDS Version 7.00.
	
	Example C is as follows:
	
	To add a BASIC routine to a Quick library, you may do the following
	(this is not relevant for adding non-BASIC routines):
	
	1. Invoke QuickBASIC and load the Quick library to be updated. For
	   example, the following line loads the Quick library OLDLIB.QLB:
	
	      QB /L OLDLIB.QLB
	
	2. Load all the BASIC subprogram (or FUNCTION) procedures to be added
	   to the Quick library by choosing Load File from the File menu.
	
	3. Choose the Make Library command from the Run menu. The library name
	   specified must be different from the one that was loaded when
	   invoking QuickBASIC. In addition, the .LIB file corresponding to
	   the .QLB file must exist or a LINK error will occur. Both the .LIB
	   and .QLB files specified will be updated automatically.
