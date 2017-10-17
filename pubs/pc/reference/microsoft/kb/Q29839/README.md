---
layout: page
title: "Q29839: C 5.10 MTDYNA.DOC: Component Files of a Single Thread DLL"
permalink: /pubs/pc/reference/microsoft/kb/Q29839/
---

## Q29839: C 5.10 MTDYNA.DOC: Component Files of a Single Thread DLL

	Article: Q29839
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 5: Creating Dynamic-Link
	Libraries" of the Microsoft C Version 5.10 MTDYNA.DOC file.
	
	5.1.1 Component Files of Single-Thread Dynamic-Link Libraries
	
	Several files are supplied for the creation of single-thread
	dynamic-link libraries. A list and brief description of the files
	supplied with this release is shown below:
	
	   DOSCALLS.LIB     OS/2 support library.
	
	   LLIBCDLL.LIB     Large-model single-thread C run-time library
	                    for dynamic-link library support.
	
	   xLIByP.LIB       Any protected-mode C run-time library; used to
	                    link sample main program.
	
	   STMAIN.C         Sample main program (single-thread version).
	   STMAIN.DEF       Module-definition file for main program
	                    (single-thread).
	
	   STDLL.C          Sample dynamic-link library file.
	   STDLL.DEF        Module-definition file for STDLL.C.
	
	   MKSTDLL.CMD      OS/2 batch file for creating single-thread
	                    dynamic-link library.
