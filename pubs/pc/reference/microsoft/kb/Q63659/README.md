---
layout: page
title: "Q63659: Error L2029 &quot;Unresolved External&quot; Due to Wrong LIB.EXE Syntax"
permalink: /pubs/pc/reference/microsoft/kb/Q63659/
---

## Q63659: Error L2029 &quot;Unresolved External&quot; Due to Wrong LIB.EXE Syntax

	Article: Q63659
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900702-127 B_BasicCom S_UTILity H_Fortran S_C
	Last Modified: 17-JAN-1991
	
	If a comma instead of a plus (+) sign is used on the LIB utility
	command line to indicate an additional object filename, the following
	will occur:
	
	1. The .LIB file will be created without error but will not contain
	   the additional .OBJ file.
	
	2. The additional .OBJ will be interpreted as the .LST (listing) file
	   and thus be overwritten.
	
	3. An "L2029: unresolved external" error will occur at link time.
	
	This information applies to the LIB.EXE utility when used with any
	supported Microsoft language, such as Microsoft QuickBASIC versions
	4.00, 4.00b, and 4.50, Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
