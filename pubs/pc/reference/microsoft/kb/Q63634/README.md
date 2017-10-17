---
layout: page
title: "Q63634: Resolving C Compiler LINKer Response File Error"
permalink: /pubs/pc/reference/microsoft/kb/Q63634/
---

## Q63634: Resolving C Compiler LINKer Response File Error

	Article: Q63634
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER | O_OS2SDK
	Last Modified: 15-AUG-1990
	
	Question:
	
	After reinstalling OS/2 on my machine, I now receive the following
	error whenever I try to compile and link any of my Microsoft C Compiler
	version 6.00 programs:
	
	   error:  unable to open response file ""
	
	Response:
	
	OS/2 contains an earlier version of LINK.EXE, and this version of
	LINK.EXE may actually be executing instead of the version of the
	LINKer provided with Microsoft C Compiler version 6.00.
	
	One solution to this problem may be to modify your path so that the
	"C600\binb" subdirectory containing LINK.EXE comes before your OS/2
	subdirectory.
	
	Another solution is to rename the LINK.EXE program in the OS/2
	subdirectory to something similar to LINK.EX@. Either of these actions
	will ensure that the proper version of LINK.EXE is executed.
