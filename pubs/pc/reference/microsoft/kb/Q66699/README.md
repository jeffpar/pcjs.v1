---
layout: page
title: "Q66699: Linker Does Not Search Specified Drive for Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q66699/
---

	Article: Q66699
	Product: Microsoft C
	Version(s): 5.01.21 5.03 5.05 5.10 5.11  | 5.01.21 5.03 5.05 5.10 5.1
	Operating System: MS-DOS                       | OS/2
	Flags: ENDUSER | buglist5.01.21 buglist5.03 buglist5.05 buglist5.10 buglist5.
	Last Modified: 12-NOV-1990
	
	A library name can be embedded into an .OBJ module for the linker to
	search to resolve external references. This library name can either be
	the library name itself or the full path to the library. In the case
	of the full path to the library, the linker cannot handle a drive
	specifier.
	
	For example, with Microsoft C, the #pragma comment command is used to
	specify the library. If the following line is used
	
	   #pragma comment (lib, "c:\C600\LIB\graphics.lib")
	
	the compiler will add a COMENT record to the .OBJ instructing the
	linker to search the C600\LIB subdirectory on drive C for the
	GRAPHICS.LIB library.
	
	The problem is that the linker will not search drive C but will
	instead search the default drive. When the library and/or path is not
	found, it will prompt for the path to the library. This is an error.
	
	Microsoft has confirmed this to be a problem in the Segmented Linker
	versions 5.01.21, 5.03, 5.05, 5.10, and 5.11. We are researching this
	problem and will post new information here as it becomes available.
