---
layout: page
title: "Q26633: Make .EXE Option Cannot Find .LIB If Not in Current Directory"
permalink: /pubs/pc/reference/microsoft/kb/Q26633/
---

## Q26633: Make .EXE Option Cannot Find .LIB If Not in Current Directory

	Article: Q26633
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 31-JAN-1990
	
	When QB is invoked with the /L switch to load a Quick library and you
	choose the Make EXE File or Make Library commands from the Run menu,
	LINK.EXE is unable to find the .LIB file that corresponds to the Quick
	library when the Quick library and .LIB are not in the current
	directory.
	
	This LINK problem occurs even when the directory where the Quick
	library and the .LIB are located is correctly pointed to with the DOS
	command "SET LIB=path."
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in the version of QuickBASIC that comes with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (buglist6.00, buglist6.00b). This problem was corrected in
	QBX.EXE in Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	One workaround is to give a full pathname to the .QLB when invoking
	QuickBASIC, as in the following example:
	
	   QB test.bas /L c:\direct1\qb.qlb
	
	Another workaround is to manually perform the link from the DOS
	command line, correctly putting the .LIB file as the fourth argument,
	as follows:
	
	   LINK test.obj,,,qb.lib;
	
	The following steps demonstrate the problem:
	
	1. Assume that QB.EXE and LINK.EXE are in the root directory on Drive
	   C. Assume that QB.QLB and QB.LIB are located in subdirectory
	   c:\direct1.
	
	2. Type the following:
	
	      SET LIB=C:\DIRECT1
	
	3. When logged on in the root directory, type the following:
	
	      QB test.bas /L qb.qlb
	
	4. Choose Make EXE File from the Run menu. QuickBASIC will put the
	   QB.LIB file in the incorrect spot in the link step. (Press F4 as a
	   toggle to see the DOS output window.)
