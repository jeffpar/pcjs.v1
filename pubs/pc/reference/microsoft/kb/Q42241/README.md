---
layout: page
title: "Q42241: Minimum Requirements for Writing a M Extension"
permalink: /pubs/pc/reference/microsoft/kb/Q42241/
---

	Article: Q42241
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 16-MAY-1989
	
	Question:
	
	What files and software do I need to be able to write an extension for
	the Microsoft Editor?
	
	Response:
	
	To create C extensions, you need to have the following files and
	software present in your current directory (or directories listed in
	the PATH or INCLUDE environment variables, as appropriate):
	
	1. The Microsoft C Optimizing Compiler Version 4.00 or later;
	   or Microsoft QuickC Version 2.00
	
	2. The Microsoft Overlay Linker Version 3.60 or later; or the
	   Microsoft Segmented-Executable Linker Version 5.01
	
	3. EXTHDR.OBJ (supplied with the editor) or EXTHDRP.OBJ (a file
	   supplied with the editor for creating protected-mode extensions)
	
	4. EXT.H header file provided with the editor
	
	5. SKEL.DEF, the standard definitions file supplied with the editor;
	   to be used with all extension
	
	You need a minimum 150K of available memory for the editor to load a C
	extension at run time in addition to the size of the extension itself.
