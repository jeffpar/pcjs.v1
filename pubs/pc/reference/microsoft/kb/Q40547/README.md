---
layout: page
title: "Q40547: BC.EXE Will Not Compile Files Named USER.&#42;"
permalink: /pubs/pc/reference/microsoft/kb/Q40547/
---

## Q40547: BC.EXE Will Not Compile Files Named USER.&#42;

	Article: Q40547
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881221-29
	Last Modified: 12-DEC-1989
	
	The BASIC compiler (BC.EXE) will not compile any source file with a
	name of USER.* (e.g. USER.BAS, USER.TXT, etc.). Instead, it will take
	input from the console and report any errors on each line as they are
	entered. BC.EXE will create an object file only if a name other than
	USER.OBJ is specified.
	
	The filename USER is a special filename reserved for compiling files
	that are entered directly from the console instead of from a file.
	Thus, if you have a file that is named USER.BAS, BC.EXE will not
	compile it.
	
	To work around this limitation, rename your BASIC file to something
	other than USER.BAS.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	4.50, and Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS
	and MS OS/2, and Microsoft BASIC PDS Version 7.00 for MS-DOS and MS
	OS/2.
