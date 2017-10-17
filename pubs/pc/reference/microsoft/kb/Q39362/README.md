---
layout: page
title: "Q39362: QuickBASIC Compile Errors Not Given in M.EXE Editor; No BC /Z"
permalink: /pubs/pc/reference/microsoft/kb/Q39362/
---

## Q39362: QuickBASIC Compile Errors Not Given in M.EXE Editor; No BC /Z

	Article: Q39362
	Version(s): 1.00 1.01 1.02 2.00 2.10 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881213-16 B_BasicCom S_Editor
	Last Modified: 4-SEP-1990
	
	QuickBASIC versions 1.x, 2.x, 3.00, 4.00, 4.00b, and 4.50 do not
	generate the error message format necessary for the Microsoft Editor
	(M.EXE). You can compile programs from within the M.EXE Editor, but
	return code 4 (which is an ARG COMPILE return code stating an error
	occurred) will not give the error message inside the M.EXE Editor
	program.
	
	Note: The Microsoft M.EXE Editor is not provided with the QuickBASIC
	package. The Microsoft Editor is provided with Microsoft BASIC
	Compiler versions 6.00 and 6.00b for MS-DOS and MS OS/2, with
	Microsoft BASIC Professional Development System (PDS) version 7.00 for
	MS-DOS and MS OS/2, and with some Microsoft system languages.
	
	The BC.EXE environment that comes with QuickBASIC versions 4.50 and
	earlier does not allow the /Z option, which produces the proper error
	message format for the M.EXE Editor. However, the /Z option is
	supported by the BC.EXE environment provided with Microsoft BASIC
	Compiler versions 6.00 and 6.00b for MS-DOS and OS/2. Adding the
	following line to the TOOLS.INI file under section [M] will allow the
	BC.EXE version 6.00 or 6.00b environment to be used from within the
	M.EXE Editor:
	
	   EXTMAKE:BAS BC /Z %|F;
	
	If this EXTMAKE line is in the TOOLS.INI and ARGCOMPILE is set to F5
	(ARGCOMPILE:F5) in the TOOLS.INI file, pressing F5 while editing BASIC
	source code in the M.EXE Editor causes BC.EXE to be invoked. If BC.EXE
	finds errors, they are returned correctly to the M.EXE Editor and the
	cursor is placed on the first error.
