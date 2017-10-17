---
layout: page
title: "Q62774: Using PC-DOS 3.00 and QBX.EXE Will Give SHELL Problems"
permalink: /pubs/pc/reference/microsoft/kb/Q62774/
---

## Q62774: Using PC-DOS 3.00 and QBX.EXE Will Give SHELL Problems

	Article: Q62774
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900522-12 buglist7.00 buglist7.10
	Last Modified: 6-AUG-1990
	
	When using QuickBASIC Extended (QBX.EXE) version 7.00 or 7.10 under
	PC-DOS version 3.00, if you first generate a PC-DOS "Bad command or
	file name" error on a SHELL statement, then any subsequent uses of the
	SHELL statement with any parameter will result in the "Bad command or
	file name" error until you restart QBX.EXE. To work around this
	problem, you can either use QuickBASIC version 4.50, or upgrade to
	either MS-DOS or a newer version of PC-DOS, or compile the program and
	run it outside of the environment with the near strings option
	(without /Fs).
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 under
	PC-DOS 3.00. We are researching this problem and will post new
	information here as it becomes available.
	
	This problem does not occur in Microsoft QuickBASIC versions 4.00,
	4.00b, or 4.50, or in Microsoft BASIC Compiler versions 6.00 or 6.00b
	under PC-DOS.
	
	The following code example demonstrates the problem:
	
	Code Example
	------------
	
	   SHELL "Errorxyz"      ' This will cause the first "Bad command or
	                         ' file name" error.
	   SHELL "CLS"           ' This is supposed to work but it gives a "bad
	                         ' command or file name" error
