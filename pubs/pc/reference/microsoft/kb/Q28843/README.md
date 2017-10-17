---
layout: page
title: "Q28843: Why QuickBASIC Does Not Support COM3: and COM4: Serial Ports"
permalink: /pubs/pc/reference/microsoft/kb/Q28843/
---

## Q28843: Why QuickBASIC Does Not Support COM3: and COM4: Serial Ports

	Article: Q28843
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 26-MAR-1990
	
	Question:
	
	Why doesn't QuickBASIC support the COM3: and COM4: data communications
	ports?
	
	Response:
	
	Support for these two additional communications ports requires a
	larger code size for QuickBASIC in both the compiler and the run-time
	module. Therefore, the decision was made not to support COM3: and
	COM4:.
	
	The QuickBASIC compiler supports the use of serial communications
	ports COM1: and COM2: through the use of the OPEN "COM" statement.
	Information on how to access these ports can be found on Page 296 of
	the BASIC language reference manual for the following products:
	
	1. Microsoft QuickBASIC Versions 4.00 and 4.00b for MS-DOS
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	   MS OS/2
	
	To access COM3: and COM4:, it may be possible for compiled BASIC to
	call third-party library routines, which are listed in catalogs such
	as the "Programmer's Connection Buyer's Guide" [in the United States,
	call (800) 336-1166; in Canada, call (800) 225-1166; to reach Customer
	Service, call (216) 494-8899]. For example, you may want to contact
	the company Software Interphase at (401) 274-5465 to determine if
	its product QuickComm supports COM3: and COM4: called from Microsoft
	compiled BASIC.
	
	For a list of other catalogs, search for the following words:
	
	   programmer and tool and catalog
