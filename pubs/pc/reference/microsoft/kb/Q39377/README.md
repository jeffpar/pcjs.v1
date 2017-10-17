---
layout: page
title: "Q39377: Amount of RAM Required by QUICKBASIC Applications"
permalink: /pubs/pc/reference/microsoft/kb/Q39377/
---

## Q39377: Amount of RAM Required by QUICKBASIC Applications

	Article: Q39377
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881208-10 B_BasicCom
	Last Modified: 21-DEC-1988
	
	The amount of RAM required by a QuickBASIC program varies depending on
	how the program is compiled. As a rule, the MINIMUM load size of a
	program is approximately the size of the .EXE file. If the program
	requires the run-time module (BRUNXX.EXE), an additional 76K or so is
	taken by the run-time module.
	
	Once the program is loaded, additional RAM may be required for dynamic
	allocation. This includes file buffers, dynamic arrays, and
	variable-length strings.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00B and 4.50, and the BASIC Compiler Versions 6.00 and
	6.00B.
	
	The EXEMOD.EXE utility shipped with the BASIC Compiler Versions 6.00
	and 6.00B can be used to determine the minimum load size of an .EXE
	file. The utility is also shipped with Microsoft C, Microsoft Fortran,
	Microsoft Pascal and Microsoft Macro Assembler.
