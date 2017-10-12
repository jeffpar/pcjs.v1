---
layout: page
title: "Q38201: Corrupted Library Causes Error L1102"
permalink: /pubs/pc/reference/microsoft/kb/Q38201/
---

	Article: Q38201
	Product: Microsoft C
	Version(s): 3.61 3.64 3.65 | 5.01.20 5.01.21
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 6-DEC-1988
	
	The link error "L1102: unexpected end-of-file" is generated when the
	linker attempts to resolve externals in a corrupted or null-length
	library.
	
	This error most commonly occurs with a combined library, mlibx.lib,
	that is corrupted during the library creation stage of SETUP. Make
	sure to check the \LIB subdirectory for odd or null size libraries.
	Library rebuilding is needed if insufficiently-sized libraries are
	found.
	
	The L1102 error can also be generated if you inadvertently type in the
	name of a used library at the "list file" prompt, as follows:
	
	   Run File  [SPUD.EXE]:      main.exe
	   List File [NUL.MAP]:       libname.lib    (generates faulty library)
	   Libraries [.LIB]:          libname.lib
	   Definition File [NUL.DEF]: main.def
	
	This process creates a map listing with the specified library name in
	the current working directory. Because this directory is searched
	before the directory specified in the LIB environment variable, the
	incorrect library containing the map listing is used during linkage,
	causing the error L1102.
