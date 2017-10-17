---
layout: page
title: "Q49445: LINK 5.03 and Later Require EXETYPE WINDOWS in .DEF File"
permalink: /pubs/pc/reference/microsoft/kb/Q49445/
---

## Q49445: LINK 5.03 and Later Require EXETYPE WINDOWS in .DEF File

	Article: Q49445
	Version(s): 5.03
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 17-JUL-1990
	
	Microsoft LINK (LINK.EXE) versions 5.03 and later require that the
	WINDOWS descriptor be placed in the EXETYPE section of your project's
	.DEF (definitions) file if you are developing a Windows' application.
	
	This marks a change from previous linkers' behavior, which would allow
	the programmer to fail in specifying the type of executable to be
	created, but still produce a Windows-compatible .EXE file. This
	failure is no longer acceptable to LINK Versions 5.03 and later.
	
	If you fail to inform the linker (via the .DEF file) that you are
	creating a Windows executable, the linker reaches completion but the
	resulting .EXE does not execute.
	
	To specify the executable type, you must create a .DEF file and submit
	this to the linker at link time. For example, if you had a project
	called WINTEST.C, you must modify WINTEST.DEF so that it contains the
	following line:
	
	   EXETYPE   WINDOWS
	
	The default EXETYPE is OS/2, as stated in the "Microsoft FORTRAN,
	CodeView and Utilities User's Guide" packaged with FORTRAN Version
	5.00.
	
	For further information regarding the definitions file and other
	descriptors, consult Section 7, "Using Module-Definition Files," in
	the "CodeView and Utilities, Microsoft Editor, Mixed Language
	Programming Guide" (Update Section) for C 5.10.
	
	LINK Version 5.03 is shipped with the FORTRAN version 5.00 package.
