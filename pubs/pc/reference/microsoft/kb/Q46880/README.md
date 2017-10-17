---
layout: page
title: "Q46880: Suppressing STOP Statement's &quot;Hit Any Key to Return&quot; Message"
permalink: /pubs/pc/reference/microsoft/kb/Q46880/
---

## Q46880: Suppressing STOP Statement's &quot;Hit Any Key to Return&quot; Message

	Article: Q46880
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890705-11
	Last Modified: 13-DEC-1989
	
	The following message displays when a compiled BASIC program is
	terminated with a STOP statement:
	
	   "STOP in module xxxxx at address ****:****
	
	   Hit any key to return to system"
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS and to Microsoft BASIC Compiler Versions 6.00,
	6.00b for MS-DOS and MS OS/2  and to Microsoft BASIC PDS 7.00 for
	MS-DOS and MS OS/2.
	
	To suppress this message and return directly to the system without
	having to press a key, use the END statement instead of the STOP
	statement. You can have multiple END and STOP statements in your
	program.
	
	Eliminating the need to press a key may be useful when running BASIC
	programs from within MS-DOS batch files or from MS-DOS itself.
