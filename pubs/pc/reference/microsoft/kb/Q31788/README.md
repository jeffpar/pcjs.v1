---
layout: page
title: "Q31788: INITCB Correction Passing BASIC COMMON Block to C"
permalink: /pubs/pc/reference/microsoft/kb/Q31788/
---

## Q31788: INITCB Correction Passing BASIC COMMON Block to C

	Article: Q31788
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 20-DEC-1989
	
	CDECL is missing from the DECLARE statement in the BASIC source code
	example. The code segment should be changed to read as follows:
	
	  '     BASIC SOURCE CODE
	  '
	            COMMON /Cblock/ n%, x#, y#
	            DECLARE SUB INITCB CDECL (n%)
	  .
	  .
	  .
	
	The correction above applies to Page 317 of the following manuals:
	
	1. "Microsoft QuickBASIC 4.00: Learning and Using"
	
	2. "Microsoft BASIC Compiler Version 6.00 for MS-DOS and OS/2:
	   Learning and Using Microsoft QuickBASIC"
