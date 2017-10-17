---
layout: page
title: "Q29843: C 5.10 MTDYNA.DOC: Creating an MTDYNA Library"
permalink: /pubs/pc/reference/microsoft/kb/Q29843/
---

## Q29843: C 5.10 MTDYNA.DOC: Creating an MTDYNA Library

	Article: Q29843
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 5: Creating Dynamic-Link
	Libraries" of the Microsoft C version 5.10 MTDYNA.DOC file.
	
	5.2.2   Creating a Multiple-Thread Dynamic-Link Library
	
	The process of creating a multiple-thread dynamic-link library is
	outlined below. The process of creating a multiple-thread dynamic-link
	library is also contained in the file CDLLOBJS.CMD.
	
	1. Create a definition file that specifies the exports from the C
	   run-time library for the dynamic-link library. The file
	   CDLLOBJS.DEF, which is included in this release, is a sample
	   definition file that includes all of the C run-time functions
	   currently supported.
	
	2. Link the special start-up file CRTLIB.OBJ with CDLLOBJS.LIB,
	   DOSCALLS.LIB, and the definition file (CDLLOBJS.DEF) from step 1.
	   This creates a customized C run-time dynamic-link library file
	   (named CRTLIB.DLL). The following files are linked together:
	
	      crtlib.obj     Start-up code for library files
	      cdllobjs.lib   C run-time library objects
	      doscalls.lib   OS/2 support library
	      cdllobjs.def   Definition module from step 1
	      crtlib.dll     Output from LINK
	
	The command to accomplish this is shown below:
	
	link crtlib.obj,crtlib.dll/noi,,cdllobjs.lib doscalls.lib/nod/noe,cdllobjs.de
	
	3. Run IMPLIB on the definition file from step 1 to create a
	   customized library file (CRTLIB.LIB) containing the exported
	   functions. The command is shown below:
	
	      implib crtlib.lib cdllobjs.def
	
	4. Use the Microsoft Library Manager (LIB) to append CDLLSUPP.LIB to
	   the customized library created in step 3. The file CDLLSUP.LIB
	   contains a few small routines that cannot be dynamically linked
	   because they are called near. The LIB program automatically creates
	   a back-up file (with a .BAK extension), which can be deleted. The
	   command for this step is shown below:
	
	      lib crtlib.lib+cdllsupp.lib;
