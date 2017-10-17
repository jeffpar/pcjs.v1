---
layout: page
title: "Q65404: Solve BASIC 6.0 &quot;Unresolved External&quot; with OS/2's DOSCALLS.LIB"
permalink: /pubs/pc/reference/microsoft/kb/Q65404/
---

## Q65404: Solve BASIC 6.0 &quot;Unresolved External&quot; with OS/2's DOSCALLS.LIB

	Article: Q65404
	Version(s): 6.00 6.00b
	Operating System: OS/2
	Flags: ENDUSER | SR# S900821-150
	Last Modified: 4-SEP-1990
	
	When you are creating Microsoft BASIC Compiler versions 6.00 and 6.00b
	protected mode programs that make calls to OS/2 API functions, the
	DOSCALLS.LIB library must be linked in. This library allows the linker
	to resolve external references to the API functions.
	
	However, the DOSCALLS.LIB that comes with BASIC will not allow the
	linker to resolve references to all of the API functions. This version
	of DOSCALLS.LIB was designed to support only a subset of them. The
	linker can use the DOSCALLS.LIB that comes with OS/2 to resolve those
	external references to API functions that are not supported by the
	BASIC version of DOSCALLS.LIB.
	
	This information applies to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2.
	
	If an API function is not supported by the BASIC version of
	DOSCALLS.LIB, the linker will generate an "Unresolved external" error
	if it finds a call to it in an object file. To remedy the situation,
	the program must be linked with the OS/2 version of DOSCALLS.LIB. This
	version of DOSCALLS.LIB is usually placed in the main OS/2 directory
	(C:\OS2, for example) by the OS/2 installation program.
	
	Note that Microsoft BASIC Professional Development System versions
	7.00 and 7.10 for MS OS/2 use a library named OS2.LIB (instead of
	DOSCALLS.LIB) to resolve external references to API functions. OS2.LIB
	provides support for all API functions, so linking with the OS/2
	version of DOSCALLS.LIB should never be necessary in BASIC PDS 7.00
	and 7.10.
