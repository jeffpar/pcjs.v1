---
layout: page
title: "Q57646: Use STACK, Not FRE(&quot;), with QBX.EXE or /Fs in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q57646/
---

## Q57646: Use STACK, Not FRE(&quot;), with QBX.EXE or /Fs in BASIC 7.00

	Article: Q57646
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 14-JAN-1990
	
	With the advent of far string support in Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and OS/2, the FRE()
	function has some different properties. The following statement
	
	   PRINT  FRE("")
	
	does not return the remaining default data segment (DGROUP) space when
	run in the QBX.EXE environment or when run as a program compiled with
	the /Fs (Far String) option. To obtain the remaining DGROUP space in
	these cases, you must now use the STACK function (introduced in BASIC
	7.00). For example, the following statement
	
	   PRINT STACK
	
	returns the current space available in DGROUP for the STACK to be
	resized. The stack is always in DGROUP, so the new STACK function
	conveniently informs you of the total remaining space that can be used
	in DGROUP.
	
	This information applies to Microsoft BASIC PDS 7.00 for MS-DOS and
	MS OS/2.
	
	For more information on the many changes in the FRE() function in
	regard to far strings, refer to Pages 140-142 of the "Microsoft BASIC
	7.0: Language Reference" manual.
