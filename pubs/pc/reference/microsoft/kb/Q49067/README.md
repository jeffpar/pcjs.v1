---
layout: page
title: "Q49067: QuickC and QuickAssembler Cannot Debug Code in Include Files"
permalink: /pubs/pc/reference/microsoft/kb/Q49067/
---

## Q49067: QuickC and QuickAssembler Cannot Debug Code in Include Files

	Article: Q49067
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | docerr S_QuickC S_CodeView
	Last Modified: 10-OCT-1989
	
	The QuickC and QuickAssembler environment debuggers do not allow the
	debugging of executable code in include files. The problem occurs when
	stepping through the program using the F8 key. When the debugger
	encounters the line containing the include statement, the debugger
	attempts to execute the code that is outside of the main module, with
	unpredictable results.
	
	The explanation of the include directive for assembly programs on Page
	240 of the Microsoft "QuickAssembler Programmer's Guide" is unclear.
	This explanation notes that "any standard code can be placed in an
	include file." However, it is not mentioned in this explanation that
	subsequent problems will arise when attempting to debug these
	routines.
	
	This problem is related to the way in which symbolic information is
	coded and is a known limitation of the QuickAssembler and QuickC
	debuggers, as well as the CodeView debugger.
	
	The solution to this problem is to include only macros, equates, and
	standard segment definitions in the include files when debugging.
