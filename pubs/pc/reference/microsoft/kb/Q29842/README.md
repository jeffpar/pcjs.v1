---
layout: page
title: "Q29842: C 5.10 MTDYNA.DOC: Component Files of MTDYNA Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q29842/
---

## Q29842: C 5.10 MTDYNA.DOC: Component Files of MTDYNA Libraries

	Article: Q29842
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 5: Creating Dynamic-Link
	Libraries" of the Microsoft C version 5.10 MTDYNA.DOC file.
	
	5.2.1   Component Files of Multiple-Thread Dynamic-Link Libraries
	
	A large number of files are supplied for the creation of
	multiple-thread dynamic-link libraries. A list and brief description
	of the files supplied with this release is shown below:
	
	   CRTDLL.OBJ         Start-up code for dynamic-link library files.
	   CRTEXE.OBJ         Start-up code for executable files.
	   CRTLIB.OBJ         Start-up code for C run-time library.
	
	   CDLLOBJS.LIB       C run-time library objects.
	   CDLLOBJS.DEF       Module-definition file that contains the entry
	                      points for all C functions.
	   CDLLOBJS.CMD       OS/2 batch file to create multiple-thread C
	                      run-time dynamic-link library.
	
	   CDLLSUPP.LIB       Supplemental file that contains C run-time
	                      information that cannot be dynamically linked.
	
	   MTMAIN.C           Sample main program (multiple thread).
	   MTMAIN.DEF         Module-definition file for main (multiple
	                      thread).
	
	   MTDLL.C            Sample dynamic-link library file (multiple
	                      thread).
	   MTDLL.DEF          Module-definition file for DLL.C (multiple
	                      thread).
	
	   MKMTDLL.CMD        OS/2 batch file for creating multiple-thread
	                      dynamic-link library.
