---
layout: page
title: "Q37355: Loadtime DLL Initialization for C 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q37355/
---

	Article: Q37355
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | softlib CRTDLL.ARC S12104.EXE
	Last Modified: 21-SEP-1989
	
	Question:
	
	How do I implement load-time DLL initialization without losing C
	run-time support for my DLL?
	
	Response:
	
	Single-Threaded DLLs (that use LLIBCDLL.LIB)
	
	There is an object module DLLINIT.OBJ that must be linked with your
	routine. You must make an explicit call to C_INIT() to bring in
	the C run-time startup code. If you are going to use DosLoadModule()
	and DosFreeModule() to bring in and remove your DLL, then you must also
	link in DLLTERM.OBJ. No explicit calls are necessary to use this
	routine.
	
	Multi-Threaded DLLs
	
	There is an object module CRTDLL_I.OBJ that replaces the CRTDLL.OBJ
	that comes with the C package. You should use CRTDLL_I.OBJ in the
	exact same manner you would use CRTDLL.OBJ. You must also make a
	reference to C_INIT() in your initialization routine. The prototype is
	as follows:
	
	   void far
	   pascal C_INIT();.
	
	All three object modules are in the Software Library archive file
	CRTDLL.ARC. This file can be found in the Software Library by
	searching on the filename CRTDLL.ARC, the Q number of this article, or
	S12104.
