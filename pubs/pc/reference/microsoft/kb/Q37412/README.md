---
layout: page
title: "Q37412: MS Press &quot;Programmer's Toolbox&quot; Doesn't Have .OBJ for C Code"
permalink: /pubs/pc/reference/microsoft/kb/Q37412/
---

## Q37412: MS Press &quot;Programmer's Toolbox&quot; Doesn't Have .OBJ for C Code

	Article: Q37412
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	The "Microsoft QuickBASIC Programmer's Toolbox" by John Clark Craig
	(Published by Microsoft Press, 1988), contains a useful library of
	more than 250 subprograms, functions, and utilities for supercharging
	QuickBASIC programs.
	
	The companion disk for "Microsoft QuickBASIC Programmer's Toolbox"
	includes the C source files CTOOLS1.C and CTOOLS2.C, but does not
	include the corresponding .OBJ files. To utilize the 22 C routines in
	those modules, the two files must first be compiled; the .C files must
	be compiled with the large memory model, in Microsoft C Compiler
	Version 5.00 or later. (QuickC compilation will work only if no
	dynamic arrays are being used in the calling QuickBASIC code.)
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	The files CTOOLS1.OBJ and CTOOLS2.OBJ are not distributed on the
	companion disks because using them also requires additional C run-time
	libraries. These, too, would have to be included to accommodate people
	without access to a C compiler.
