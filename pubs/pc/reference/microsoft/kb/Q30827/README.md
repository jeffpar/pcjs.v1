---
layout: page
title: "Q30827: An Example Where a Protect Mode C Extension Will Not Load"
permalink: /pubs/pc/reference/microsoft/kb/Q30827/
---

## Q30827: An Example Where a Protect Mode C Extension Will Not Load

	Article: Q30827
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | TAR76121 TAR76251
	Last Modified: 8-JUN-1988
	
	Problem:
	   I am trying to create an extension to the MEP.EXE editor. I am
	unable to get the editor to load my C extension. To simplify things I
	tried to get the editor to load the sample SKEL; however, I was
	unsuccessful. I receive the following error messages when loading:
	
	   "cannot load skel - invalid argument"
	   "skel is an illegal setting"
	
	   My LIBPATH is c:\os2\dll and skel.dll is placed there. If skel.dll
	is not in my libpath I would get the error "no such file or
	directory". My MAKE and DEF files for SKEL are as follows:
	
	SKEL MAKE FILE
	#
	# Makefile for the MEP Editor Extensions
	#
	SYS=\os2\dll
	
	.c.obj:
	 cl -c -Gs -Asfu -G2 -Lp $*.c
	
	.obj.dll:
	 link  /NOI /NOD exthdrp.obj $*.obj,$*.dll,nul.map,,$*.def;
	
	skel.obj:    skel.c skel
	
	skel.dll:    skel.obj skel.def
	
	$(SYS)\skel.dll:  skel.dll
	       copy skel.dll $(SYS)
	
	SKEL DEF FILE
	
	LIBRARY  SKEL
	
	EXPORTS
	 _ModInfo
	 SKEL
	
	Response:
	   The extension is not loaded because the DEF file is incorrect. The
	file should be as follows:
	
	SKEL.DEF:
	   LIBRARY
	
	   EXPORTS
	           _ModInfo
	           EntryPoint
	
	   This file should be used with all the extensions that are written.
	It need not be modified.
