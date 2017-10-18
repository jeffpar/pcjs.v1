---
layout: page
title: "Q32777: Language Names Declared as PUBLIC Cause Error"
permalink: /pubs/pc/reference/microsoft/kb/Q32777/
---

## Q32777: Language Names Declared as PUBLIC Cause Error

	Article: Q32777
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 15-JUL-1988
	
	Starting with Macro Assembler Version 5.10, language names cannot
	be declared PUBLIC. The language names affected are BASIC, C,
	FORTRAN, and PASCAL. The error message displayed does not correctly
	display the name of the offending label. The following example
	demonstrates the problem:
	
	.model small
	.data
	public c
	test.asm(17): error A2009:Symbol not defined:
	c  db  1
	end
	
	   Note that the use of "c" as a variable is allowed. Microsoft has
	confirmed this to be a problem in Version 5.10. We are researching
	this problem and will post new information as it becomes available.
