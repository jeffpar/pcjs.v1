---
layout: page
title: "Q26767: LIB.EXE Displays .LIB Contents, QLBDUMP.BAS Displays .QLB"
permalink: /pubs/pc/reference/microsoft/kb/Q26767/
---

## Q26767: LIB.EXE Displays .LIB Contents, QLBDUMP.BAS Displays .QLB

	Article: Q26767
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 29-JAN-1991
	
	You can display the contents of a .LIB library file using the LIB.EXE
	library manager that comes with Microsoft QuickBASIC versions 4.00,
	4.00b, and 4.50; with Microsoft BASIC Compiler 6.00 and 6.00b; and
	with Microsoft BASIC Professional Development System (PDS) 7.00 and
	7.10. The "listfile" argument for the library manager allows you to
	specify the name of a cross-reference listing file. When you specify
	the name CON, the listing will be displayed on the screen. You also
	may output the list file to a disk file by specifying an output
	filename.
	
	To display the contents of a Quick library .QLB file, you may compile
	and run the program QLBDUMP.BAS, which is located in the \SOURCE
	subdirectory on release-disk 3 of QuickBASIC version 4.00 or 4.00b,
	and in the subdirectory \EXAMPLES on the "Setup/Microsoft QB Express"
	disk of QuickBASIC version 4.50. QLBDUMP.BAS is also included with
	BASIC Compiler 6.00 and 6.00b and BASIC PDS 7.00 and 7.10.
	
	The QLBDUMP program displays the contents of a .QLB Quick library.
	
	The purpose of .QLB Quick library files is to resolve external routine
	calls in the QB.EXE/QBX.EXE editor/interpreter environment at run
	time. If you use a .QLB file, you must have a matching .LIB file if
	you want to use the Make .EXE File option.
	
	.LIB files are used by the LINK.EXE program to resolve external
	routine calls at link time. LIB.EXE can display the contents of a .LIB
	file.
	
	The cross-reference listing file output from LIB.EXE contains the
	following lists:
	
	1. An alphabetical list of all public symbols in the library. Each
	   symbol is followed by the name of the module in which it is
	   referred to.
	
	2. A list of the modules in the library. Under each module name is an
	   alphabetical listing of the public symbols defined in that module.
	
	For more information on the LIB.EXE library manager, please refer to
	pages 227 to 234 in the "Microsoft QuickBASIC 4.0: Learning and Using"
	manual for versions 4.00 and 4.00b.
	
	Note that a copy of QuickBASIC (QB.EXE) comes with Microsoft BASIC
	Compiler versions 6.00 and 6.00b for MS-DOS.
	
	LIB.EXE Example
	---------------
	
	The following is a copy of a sample session in which LIB.EXE is used
	to display the contents of the file QB.LIB to the screen:
	
	c:> LIB
	
	Microsoft (R) Library Manager  Version 3.08
	Copyright (C) Microsoft Corp 1983-1987.  All rights reserved.
	
	Library name: qb.lib
	Operations:
	List file: con
	
	ABSOLUTE..........absolute          INT86OLD..........int86old
	INT86XOLD.........int86old          INTERRUPT.........intrpt
	INTERRUPTX........intrpt
	
	absolute          Offset: 00000010H  Code and data size: cH
	  ABSOLUTE
	
	intrpt            Offset: 000000e0H  Code and data size: 107H
	  INTERRUPT         INTERRUPTX
	
	int86old          Offset: 000002a0H  Code and data size: 11eH
	  INT86OLD          INT86XOLD
