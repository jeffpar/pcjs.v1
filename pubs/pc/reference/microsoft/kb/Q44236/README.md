---
layout: page
title: "Q44236: Only One Video Page with Hercules SCREEN 0; HELP Correction"
permalink: /pubs/pc/reference/microsoft/kb/Q44236/
---

## Q44236: Only One Video Page with Hercules SCREEN 0; HELP Correction

	Article: Q44236
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890502-115 docerr B_BasicCom
	Last Modified: 17-OCT-1990
	
	Only one page (page 0) is supported in SCREEN mode 0 on a Hercules
	adapter. To obtain two pages, Hercules graphics mode (SCREEN 3) should
	be used.
	
	The indicated documentation sources below incorrectly show two pages
	(pages 0 and 1) available in SCREEN mode 0 (TEXT mode) on a Hercules
	adapter. This is incorrect.
	
	The information covering "Hercules Adapter Screen Modes" in the
	following sources incorrectly states you can have 2 pages under SCREEN
	mode 0 when using a Hercules video adapter:
	
	1. The documentation error occurs in QB.EXE 4.50 QB Advisor online
	   Help system under the HELP menu, SCREEN statement, Details section,
	   Adapters and Displays ("HELP: SCREEN Statement Details - Adapters")
	
	   This documentation error has been corrected in the Microsoft
	   Advisor on-line Help system of the QBX.EXE environment supplied
	   with Microsoft BASIC PDS versions 7.00 and 7.10 for MS-DOS.
	
	2. This documentation error occurs on Page 327 of the "Microsoft
	   QuickBASIC 4.5: BASIC Language Reference" manual.
	
	   This documentation error has been corrected in the "Microsoft BASIC
	   7.0: Language Reference" manual for BASIC PDS version 7.00 and 7.10.
	
	3. This documentation error occurs in the QBX.EXE 7.00 and 7.10
	   Microsoft Advisor online Help system under the HELP menu, PCOPY
	   statement, Details section ("HELP: PCOPY Statement Details").
	
	   This documentation error does not occur for PCOPY HELP in QB.EXE
	   4.50.
