---
layout: page
title: "Q39246: No QB Support for Mixed Languages Compiled with /FPc or /FPa"
permalink: /pubs/pc/reference/microsoft/kb/Q39246/
---

## Q39246: No QB Support for Mixed Languages Compiled with /FPc or /FPa

	Article: Q39246
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER  | SR# S881129-40  B_BasicCom
	Last Modified: 5-SEP-1990
	
	QuickBASIC versions 4.00, 4.00b, and 4.50 do not support the use of
	the Alternate IEEE Math Library (/FPa) or code that generates
	floating-point calls (/FPc). QuickBASIC generates in-line math
	coprocessor instructions and uses the emulator library. If a math
	coprocessor is present, it will be used.
	
	Mixed-language routines linked to a QuickBASIC routine must be
	compiled so they generate in-line math coprocessor instructions and
	use the emulator library. This is the default option for Microsoft C
	version 5.10 and most other Microsoft languages.
	
	The following is an example of compiling and LINKing a mixed-language
	application:
	
	   BC bmain.bas;
	   CL /c /AM csub;
	   LINK bmain + csub /noe;
	
	Note: If the /FPa or /FPc switch was used on the CL command line, the
	linker may produce "duplicate definition" errors. If you get
	"duplicate definition" errors at link time, the resulting executable
	file may or may not run correctly.
	
	Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 and Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 each support the /FPa option for the BC.EXE
	compiler. However, neither the QuickBASIC environment (QB.EXE) that
	comes with the BASIC compiler nor the QuickBASIC Extended environment
	(QBX.EXE) that comes with BASIC PDS support /FPa. Therefore,
	mixed-language programming using alternate math (/FPa) could be
	accomplished with compiled programs with these products.
