---
layout: page
title: "Q44035: WAIT Statement Can Access All 65535 Ports, Not Just 0 to 255"
permalink: /pubs/pc/reference/microsoft/kb/Q44035/
---

## Q44035: WAIT Statement Can Access All 65535 Ports, Not Just 0 to 255

	Article: Q44035
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom docerr
	Last Modified: 15-DEC-1989
	
	The documentation for the WAIT statement incorrectly states that the
	input port number given as an argument to a WAIT statement can range
	from 0 to 255 only. WAIT can actually address all 65,536 machine ports
	(0 to 65535).
	
	This information applies to the WAIT statement in the following
	manuals:
	
	1. Page 446 of "Microsoft QuickBASIC 4.0: BASIC Language Reference"
	   for Versions 4.00 and 4.00b for MS-DOS
	
	2. Page 446 of "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" for Versions 6.00 and 6.00b for MS-DOS and MS OS/2
	
	3. Page 507 of "Microsoft QuickBASIC Compiler" manual for Versions
	   2.0x and 3.00 for MS-DOS
	
	This documentation error has been corrected in the "Microsoft BASIC
	7.0: Language Reference" manual and in the Microsoft BASIC PDS 7.00
	QBX.EXE Microsoft Advisor on-line Help system.
