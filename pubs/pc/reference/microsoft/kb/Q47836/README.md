---
layout: page
title: "Q47836: Incorrect Warning C4413 Issued After Editing Blank Line"
permalink: /pubs/pc/reference/microsoft/kb/Q47836/
---

	Article: Q47836
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM buglist2.00 buglist2.01
	Last Modified: 10-OCT-1989
	
	The code below demonstrates a problem with Version 2.00 or 2.01 of the
	Microsoft QuickC Compiler's incremental compilation capability. The
	compiler may return the following error message when insignificant
	editing to the code is done before compiling:
	
	   filename.c(2): warning C4413: 'main' redefined: preceding reference
	                  may be invalid.
	
	The following are workarounds:
	
	1. Recompile the file without making any further changes.
	
	2. Turn off incremental compile in the Options.Make.Compiler Flags
	   menu.
	
	3. Chose the menu option Make.Rebuild All.
	
	To reproduce the warning, simply compile the following program with
	incremental compile enabled. After the clean compile, remove the blank
	second line, save the file, and recompile to cause the warning.
	
	void foo(void) {}
	
	void main(void) {foo();}
	
	A second compile does not flag the error. However, if you put the
	blank line back in and save the file, recompiling results in the
	reoccurrence of the warning.
	
	Microsoft has confirmed this to be a problem with QuickC Versions 2.00
	and 2.01. We are researching the problem and will post new information
	as it becomes available.
