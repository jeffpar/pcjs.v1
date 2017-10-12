---
layout: page
title: "Q29838: C 5.10 MTDYNA.DOC: Creating Dynamic-Link Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q29838/
---

	Article: Q29838
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 5: Creating Dynamic-Link
	Libraries" of the Microsoft C version 5.10 MTDYNA.DOC file.
	
	Creating Dynamic-Link Libraries
	
	You can create the following two types of dynamic-link libraries with
	this release of C:
	
	1. A stand-alone, single-thread dynamic-link library
	
	2. A C run-time dynamic-link library that supports multiple threads
	   and is itself dynamically linked.
	
	The stand-alone dynamic-link library is independent of the calling
	program and is single thread only and statically linked. This isolated
	dynamic-link library is independent of the effects of other
	dynamic-link libraries and can be viewed conceptually as an extension
	of the operating system. Use the OS/2 support library, LLIBCDLL.LIB, a
	large-model, single-thread C run-time library for creating
	single-thread dynamic-link libraries. LLIBCDLL.LIB is statically
	linked and uses only the alternate math library.
	
	The dynamically-linked C run-time library may be used by a
	multiple-thread program and an optional group of dynamic-link
	libraries that are closely associated with it. Use the OS/2 support
	library, CDLLOBJS.LIB to create a C run-time library that is
	dynamically linked.
	
	Dynamic-link libraries can be debugged with the protected-mode
	CodeView debugger (CVP). For more information on this topic, see
	Section 2.2.2 "Debugging Dynamic-Link Modules" in the Microsoft
	CodeView and Utilities Update document.
