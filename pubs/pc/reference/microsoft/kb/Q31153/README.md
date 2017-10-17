---
layout: page
title: "Q31153: LINK Overlays Not Supported in BASIC 6.00/6.00b, or QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q31153/
---

## Q31153: LINK Overlays Not Supported in BASIC 6.00/6.00b, or QuickBASIC

	Article: Q31153
	Version(s): 6.00 6.00b
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_QuickBas
	Last Modified: 30-MAY-1990
	
	Microsoft QuickBASIC versions 1.00, 1.02, 2.00, 2.01, 3.00, 4.00,
	4.00b, and 4.50 for MS-DOS and Microsoft BASIC Compiler versions 6.00
	and 6.00b for MS-DOS do NOT support code overlays. These versions of
	BASIC compiler and QuickBASIC are not designed to output the special
	object format necessary to support overlays under MS-DOS.
	
	The description of LINK.EXE provided in the "Microsoft CodeView and
	Utilities: Software Development Tools for MS-DOS" manual, supplied
	with Microsoft BASIC Compiler versions 6.00 and 6.00b, is a general
	description for the linker. However, this description is misleading.
	Although Pages 285-286 discuss linker overlays, overlays are not
	supported by these versions of BASIC.
	
	Microsoft has introduced support for linker overlays in Microsoft
	BASIC Professional Development System (PDS) version 7.00 under MS-DOS.
	For more information, search for a separate article with the following
	words:
	
	   how and use and LINK and overlays and BASIC and PDS and 7.00
	
	Other Microsoft languages, such as Microsoft C and Microsoft FORTRAN,
	also support linker overlays.
	
	The error message "L2048 cannot find overlay manager" will be
	generated if you try to link with overlays using BASIC compiler
	version 6.00.
	
	Overlays are useful in a memory-restricted environment because overlay
	capability allows programs to load portions of code from disk into
	memory when needed, and overlays in memory not currently being used
	are automatically swapped out when loading the needed overlays.
	
	The CHAIN, RUN, and SHELL statements in BASIC offer capabilities that
	are similar to code overlays, but more limited.
