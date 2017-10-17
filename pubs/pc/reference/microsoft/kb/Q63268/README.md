---
layout: page
title: "Q63268: BUILDRTM with PROISAM(D) Must Have OBJ and LIB in Export List"
permalink: /pubs/pc/reference/microsoft/kb/Q63268/
---

## Q63268: BUILDRTM with PROISAM(D) Must Have OBJ and LIB in Export List

	Article: Q63268
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900620-71
	Last Modified: 17-JAN-1991
	
	To build ISAM support into a custom run-time module (instead of using
	ISAM from the separate TSR program), you must specify in BUILDRTM's
	Export List file both the object (.OBJ) and library (.LIB) forms of
	your chosen ISAM library (PROISAM or PROISAMD). If either the object
	or library form is left out of the Export List file, LINK.EXE flags
	numerous occurrences of L2025 ("Symbol defined more than once") and
	L2029 ("Unresolved external").
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The following Export List file (arbitrarily named ISAM.EXP) shows the
	files that need to be specified to put PROISAMD into a custom run-time
	module:
	
	   # ISAM.EXP
	   #OBJECTS
	   PROISAMD.OBJ
	   # (specify additional OBJs here)
	   #LIBRARIES
	   PROISAMD.LIB
	
	The command line to build the custom run-time module specified by the
	above Export List file is as follows:
	
	   BUILDRTM /LR ISAMRUN ISAM.EXP
	
	This BUILDRTM command outputs three files: IMPORT.OBJ and ISAMRUN.LIB
	(used to resolve LINK references to your custom run-time module) and
	ISAMRUN.EXE (your custom run-time module).
	
	To LINK the above run-time module to a BASIC program, use the
	following LINK command:
	
	   LINK IMPORT.OBJ+yourfile.OBJ,yourfile.EXE,,ISAMRUN.LIB;
	
	For more information about using BUILDRTM.EXE, see Chapter 21,
	"Building Custom Run-Time Modules," in the "Microsoft BASIC 7.0:
	Programmer's Guide" for 7.00 and 7.10.
