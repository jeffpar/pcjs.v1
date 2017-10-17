---
layout: page
title: "Q58123: &quot;Feature Unavailable&quot; Using FRE(-3) in .EXE Compiled in 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q58123/
---

## Q58123: &quot;Feature Unavailable&quot; Using FRE(-3) in .EXE Compiled in 7.00

	Article: Q58123
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900125-132
	Last Modified: 26-FEB-1990
	
	The FRE(-3) function, which returns available expanded memory in the
	QuickBASIC Extended (QBX.EXE) environment, normally gives a "Feature
	Unavailable" (run-time error 73) in .EXE files created with BC.EXE. An
	exception is if an executable .EXE file is linked with overlays that
	are each no larger than 64K, and if a LIM 4.0 EMS expanded memory
	driver (defined below) is installed, then the FRE(-3) function returns
	a value for the amount of free expanded memory. This information
	applies to Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS.
	
	The FRE(-3) function returns the amount of free LIM 4.0 EMS expanded
	memory available for arrays, SUBs, and functions in the QBX.EXE
	environment.
	
	Note that the only way that compiled BASIC .EXE applications can take
	advantage of expanded memory is with linked overlays, but then only if
	each overlay is smaller than 64K. (If expanded memory is not
	accessible, overlays just swap to disk.) The FRE(-3) function returns
	a value for an .EXE program only when a LIM 4.0 EMS driver is
	installed and the .EXE program is able to successfully store its
	overlays in expanded memory.
	
	To check the amount of available expanded memory from an EXE program,
	see Pages 204-206 in Ray Duncan's "Advanced MS-DOS Programming, 2nd
	Edition" (Microsoft Press, 1988). The method described there uses
	assembly language and interrupts.
	
	Note: LIM 4.0 EMS is defined as follows:
	
	   LIM  = Lotus, Intel, Microsoft
	   4.0  = Version number 4.0 (of the standard LIM EMS)
	   EMS  = Expanded Memory Specification, a standard for addressing
	          expanded memory
	
	For more information about linker overlays in BASIC PDS 7.00, search
	for a separate article with the following keywords:
	
	   BASIC and 7.00 and linker and overlays and modules
	
	Also see Pages 612-614 of the "Microsoft BASIC 7.0: Programmer's
	Guide," in the section "Linking with Overlays".
