---
layout: page
title: "Q69123: Long Command Line Generates Protection Violation in MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q69123/
---

## Q69123: Long Command Line Generates Protection Violation in MASM

	Article: Q69123
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | buglist5.10 fixlist5.10a
	Last Modified: 11-FEB-1991
	
	Executing the Microsoft Macro Assembler (MASM) version 5.10 with a
	parameter list greater than 129 characters generates a protection
	violation under OS/2.
	
	The following example illustrates the problem:
	
	   MASM /Mx /Zi .\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\
	   .\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\.\
	   .\.\.\.\.\t.asm;
	
	Workarounds
	-----------
	
	The following lists two valid workarounds:
	
	1. Shorten the command line by using the MASM environment
	   variable to declare options (that is, set MASM=/Mx /Zi).
	
	2. Contact Microsoft Product Support Services by calling (206)
	   454-2030 and ask for the incremental update MASM 5.10a.
	
	Microsoft has confirmed this to be a problem in MASM version 5.10.
	This problem was corrected in version 5.10a.
	
	
	
	
	
	
	Microsoft QuickAssembler
	=============================================================================
