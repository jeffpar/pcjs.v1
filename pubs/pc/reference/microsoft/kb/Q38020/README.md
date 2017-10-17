---
layout: page
title: "Q38020: CVPACK /p Causes a More Complete Packing"
permalink: /pubs/pc/reference/microsoft/kb/Q38020/
---

## Q38020: CVPACK /p Causes a More Complete Packing

	Article: Q38020
	Version(s): 2.20
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-MAR-1989
	
	When you are unable to load your program into CodeView, try packing
	the program with CVPACK.EXE. If you want a more complete packing of
	your executable, then run CVPACK.EXE with the /p option. This option
	will take longer to run, but it will generate better results.
	
	The /p option for CVPACK.EXE is documented on Page update-17 in the
	"Microsoft C 5.1 Optimizing Compiler, CodeView and Utilities,
	Microsoft Editor Mixed-Language Programmer's Guide."
	
	Normally, CVPACK discards unused debugging information and appends
	it to the file. With the /p option, CVPACK discards the unused
	debugging information, then proceeds to sort it throughout the
	executable file.
