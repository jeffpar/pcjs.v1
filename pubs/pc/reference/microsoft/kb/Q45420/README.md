---
layout: page
title: "Q45420: LPOS(0) and LPOS(1) Both Return Print Head Position for LPT1"
permalink: /pubs/pc/reference/microsoft/kb/Q45420/
---

## Q45420: LPOS(0) and LPOS(1) Both Return Print Head Position for LPT1

	Article: Q45420
	Version(s): 6.00 6.00b | 6.00 6.00b
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr B_QuickBas
	Last Modified: 2-FEB-1990
	
	The LPOS(0) and LPOS(1) functions both return the current position of
	the print head within the printer buffer for LPT1. LPOS(2) returns
	the current print position for LPT2.
	
	On Page 263 of the "Microsoft BASIC Compiler 6.0: BASIC Language
	Reference" manual for Versions 6.00 and 6.00b for MS OS/2 and MS-DOS,
	the program example uses LPOS(0) to return the current position of the
	line printer's print head within the print buffer, but no mention is
	made of LPOS(0) in the function description. LPOS(0) operates the same
	as LPOS(1), and there is no difference between the two functions.
	
	This information applies also to Page 263 of the "Microsoft QuickBASIC
	4.0: BASIC Language Reference" manual for QuickBASIC Versions 4.00 and
	4.00b, to Page 224 of the "Microsoft QuickBASIC 4.5: BASIC Language
	Reference" for Version 4.50, and to the QuickBASIC Version 4.50 QB
	Advisor online Help system.
	
	This documentation error was corrected on Page 204 of the "Microsoft
	BASIC 7.0: Language Reference" manual for Microsoft BASIC Professional
	Development System (PDS) Version 7.00.
