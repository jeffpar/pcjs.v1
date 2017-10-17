---
layout: page
title: "Q43787: LINK.EXE 3.69 Warning L4045 When No .QLB on Quick Library Name"
permalink: /pubs/pc/reference/microsoft/kb/Q43787/
---

## Q43787: LINK.EXE 3.69 Warning L4045 When No .QLB on Quick Library Name

	Article: Q43787
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890122-1 B_BasicCom
	Last Modified: 15-DEC-1989
	
	When creating a Quick library with LINK.EXE Version 3.69 or 5.05, the
	linker warning message "L4045 NAME OF OUTPUT FILE IS <NAME>" is given
	if the extension .QLB is left off the new Quick library name in the
	LINK command line. This happens even if the /Q (Quick Library) option
	is the first item on the LINK line. Normally, this warning message
	occurs if one of the following is true:
	
	1. The .QLB extension was left off the Quick library name.
	
	2. The /Q option was placed at the end of the command line.
	
	The following LINK command line should not produce this warning with
	Microsoft QuickBASIC Version 4.00, 4.00b, or 4.50, with Microsoft
	BASIC Compiler Version 6.00 or 6.00b, or with Microsoft BASIC PDS
	Version 7.00; however, it will produce this warning using the LINK.EXE
	of QuickBASIC Version 4.50 or BASIC PDS 7.00:
	
	   LINK /Q MYLIB.LIB, QUICKLIB,,BQLB40.LIB;
	
	The following line produces the warning number 4045 in QuickBASIC
	4.00, 4.00b, and 4.50, in Microsoft BASIC Compiler 6.00 and 6.00b, and
	in BASIC PDS 7.00:
	
	   LINK MYLIB.LIB, QUICKLIB,,BQLB40.LIB /Q;
	
	The warning message is telling you that because you did not give an
	extension to the library name and because /Q was used at the end of
	the LINK line, the output library will have the default extension of
	.QLB. It does not affect the resulting Quick library in any way. The
	library can be renamed and used without problems.
	
	LINK.EXE Version 3.69 is shipped with QuickBASIC Version 4.50.
	LINK.EXE Version 5.05 is shipped with BASIC PDS Version 7.00.
