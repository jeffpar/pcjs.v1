---
layout: page
title: "Q21839: Support for IBM EGA and Hercules Graphics Cards"
permalink: /pubs/pc/reference/microsoft/kb/Q21839/
---

## Q21839: Support for IBM EGA and Hercules Graphics Cards

	Article: Q21839
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 29-DEC-1989
	
	This article describes which versions of QuickBASIC support the IBM
	EGA (Enhanced Graphics Adapter) Card and which versions support
	Hercules Monochrome Graphics Cards.
	
	EGA Support
	-----------
	
	QuickBASIC Versions 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 support
	EGA through the use of SCREEN modes 7, 8, 9, and 10. QuickBASIC
	Versions 1.00, 1.01, and 1.02 do not support the EGA. The 43-line EGA
	mode is supported in the Editor and in the WIDTH statement in
	QuickBASIC Versions 3.00, 4.00, 4.00b, and 4.50. The EGA is also
	supported in OS/2 real mode and MS-DOS for programs compiled with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2, and Microsoft BASIC PDS Version 7.00. The EGA is not currently
	supported for BASIC programs that run in OS/2 protected mode.
	
	Hercules Support
	----------------
	
	Microsoft QuickBASIC Versions 4.00 and later, the Microsoft BASIC
	Compiler 6.00 and 6.00B, and Microsoft BASIC PDS 7.00 all support the
	Hercules Monochrome Graphics Card, Hercules Graphics Card Plus,
	Hercules InColor Card, and cards that are 100 percent compatible with
	these cards. The following describes how Hercules cards are supported
	in QuickBASIC:
	
	1. Hercules graphics mode is SCREEN 3.
	
	2. Hercules text mode is SCREEN 0.
	
	3. With Hercules, you must use a monochrome monitor.
	
	4. You must load the Hercules driver (QBHERC.COM) before running your
	   program. If the driver is not loaded, the SCREEN 3 statement gives
	   an "Illegal function call" error message. Type "QBHERC" to load the
	   driver.
	
	5. The text dimensions are 80x25 (9x14 character box); the bottom two
	   scan lines of the 25th row are not visible.
	
	6. The resolution is 720x348 pixels, monochrome.
	
	7. SCREEN 3 supports two pages (0 and 1); SCREEN 0 used with Hercules
	   supports only one page.
	
	8. The PALETTE statement is not supported.
	
	9. To make function calls to the Microsoft Mouse, you must follow
	   special instructions for Hercules cards in the "Microsoft Mouse
	   Programmer's Reference Guide." (This manual must be ordered
	   separately; it is not supplied with either the QuickBASIC or the
	   Microsoft Mouse packages.)
	
	The use of Hercules cards is also documented in the README.DOC file on
	the QuickBASIC Version 4.00, 4.00b, and 4.50 release disk, which
	supplements the Microsoft QuickBASIC Compiler documentation.
