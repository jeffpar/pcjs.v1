---
layout: page
title: "Q11877: Debugging Routines That Are in Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q11877/
---

## Q11877: Debugging Routines That Are in Libraries

	Article: Q11877
	Version(s): 1.00 1.10 2.00 2.10 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS                        | OS/2
	Flags: ENDUSER | TAR55321
	Last Modified: 21-AUG-1989
	
	Question:
	
	When CodeView attempts to debug a function from a library module, it
	is unable to find the source even when that module was compiled with
	-Zi. It prompts me to "Enter Directory for Program (CR for None)?". I
	enter the directory in which PROGRAM.C resides, but CodeView cannot
	find it. Is there any solution other than not placing modules I wish
	to debug in libraries?
	
	Response:
	
	This is a consequence of the way the LIB utility works. When adding an
	object module to a library, LIB records only the source file's base
	name, not its extension. Therefore, "c:\c\source\module1.c" becomes
	"c:\c\source\module1" (no extension). When you are debugging an
	application that calls "module1", CodeView attempts to find
	"c:\c\source\module1". However, it does not accept the filename you
	give because the file is really named "module1.c".
	
	One way to work around this restriction is to rename your source file
	from "c:\c\source\module1.c" to "c:\c\source\module1" (no extension)
	after you have compiled it and put it into a library. This way, the
	actual name will match the name CodeView is searching for.
	
	Another solution is to use Library Manager Version 3.07 (which came
	with MASM 5.00) or later; this solves the problem by not stripping the
	file's extension as it is put into a library.
