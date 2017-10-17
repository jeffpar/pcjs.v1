---
layout: page
title: "Q66164: Versions of Utilities (LINK, LIB, Etc.) Shipped with BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q66164/
---

## Q66164: Versions of Utilities (LINK, LIB, Etc.) Shipped with BASIC

	Article: Q66164
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | S_LINK S_EDITOR S_CodeView S_MAKE S_NMAKE B_BasicCom S_PWB
	Last Modified: 17-OCT-1990
	
	Below is a list of the specific versions of Microsoft utility programs
	shipped with Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00,
	2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS; with Microsoft BASIC
	Compiler versions 5.35, 5.36 for MS-DOS and 6.00, 6.00b for MS-DOS and
	MS OS/2; and with Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	This list of utilities includes LINK.EXE (Microsoft Linker), CV.EXE
	(Microsoft CodeView for MS-DOS), CVP.EXE (Microsoft CodeView for MS
	OS/2 protected mode), M.EXE (Microsoft Editor for MS-DOS), MEP.EXE
	(Microsoft Editor for MS OS/2 protected mode), LIB.EXE (Microsoft
	Library Manager), MAKE.EXE (Microsoft Program Maintenance Utility),
	and NMAKE.EXE (newer Microsoft Program Maintenance Utility). LINK.EXE,
	LIB.EXE, MAKE.EXE, and NMAKE.EXE are bound applications (that is, they
	run under either MS-DOS or MS OS/2).
	
	Note: "Segmented Linker" in the table below means segmented-executable
	linker. A "-" in the table below indicates that the utility is not
	shipped with the product.
	
	                    +-----------------------+
	                    | QuickBASIC for MS-DOS |
	                    +-----------------------+
	
	Product  Object  Segmented  Overlay  CV/  M/MEP    LIB  MAKE  NMAKE
	Version  Linker  Linker     Linker   CVP  Editor
	-------  ------  ---------  -------  ---  ------   ---  ----  -----
	
	1.00      3.02       -         -      -     -        -    -      -
	1.01      3.02       -         -      -     -        -    -      -
	1.02      3.02       -         -      -     -        -    -      -
	2.00       -         -        3.06    -     -        -    -      -
	2.01       -         -        3.06    -     -        -    -      -
	3.00       -         -        3.06    -     -        -    -      -
	4.00       -         -        3.61    -     -        -    -      -
	4.00b      -         -        3.65    -     -        -    -      -
	4.50       -         -        3.69    -     -        -    -      -
	
	Note that QuickBASIC versions 1.x, 2.x, 3.00, and 4.x cannot take
	advantage of the code overlay capabilities of the overlay linker.
	
	           +---------------------------------------+
	           | BASIC Compiler for MS-DOS and MS OS/2 |
	           +---------------------------------------+
	
	Product  Object  Segmented  Overlay  CV/  M/MEP    LIB  MAKE  NMAKE
	Version  Linker  Linker     Linker   CVP  Editor
	-------  ------  ---------  -------  ---  ------   ---  ----  -----
	
	5.35      1.10       -         -      -     -       -     -     -
	5.36      1.10       -         -      -     -       -     -     -
	
	For MS-DOS and MS OS/2:
	
	6.00       -     5.01.20       -     2.20  1.00    3.11  4.07   -
	6.00b      -     5.01.20       -     2.20  1.00    3.11  4.07   -
	
	+--------------------------------------------------------------------+
	| BASIC Professional Development System (PDS) for MS-DOS and MS OS/2 |
	+--------------------------------------------------------------------+
	
	7.00       -     5.05          -     2.35  1.20    3.16   -    1.10
	7.10       -     5.10          -     3.10    -     3.17   -    1.11
	
	Note that Microsoft BASIC Professional Development System (PDS)
	version 7.00 for MS-DOS and MS OS/2 is the first version to support
	the code overlay feature of the linker (LINK.EXE).
	
	BASIC PDS 7.10 introduces the Programmer's WorkBench (PWB.EXE) version
	1.10 for mixed-language and OS/2 programming.
