---
layout: page
title: "Q41583: LINK Options Can Be Specified in AUTOEXEC.BAT with SET LINK="
permalink: /pubs/pc/reference/microsoft/kb/Q41583/
---

## Q41583: LINK Options Can Be Specified in AUTOEXEC.BAT with SET LINK=

	Article: Q41583
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890213-93
	Last Modified: 14-DEC-1989
	
	LINK options can be set in your AUTOEXEC.BAT file (or in the MS-DOS
	command line) as an environment variable with the statement "SET
	LINK=options". The following is an example
	
	   SET LINK=/NOE /NOI /E
	
	where /NOE is NOEXTDICTIONARY, /NOI is NOIGNORECASE, /E is EXEPACK.
	
	This behavior can cause some unexpected errors to occur because you
	might forget what LINK switches are SET in your AUTOEXEC.BAT file.
	
	If the /E [XEPACK] switch is SET within your AUTOEXEC.BAT FILE and you
	attempt to create a Quick library with the /Q [UICKLIB] switch, the
	following linker error is generated:
	
	   L1003    /QUICKLIB, /EXEPACK incompatible
	
	To make Quick libraries with /E [XEPACK] set as a LINK option, use
	/NOP [ACKCODE] to turn /E [XEPACK] off.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50, Microsoft BASIC Compiler Versions 6.00
	and 6.00b, and Microsoft BASIC PDS Version 7.00.
