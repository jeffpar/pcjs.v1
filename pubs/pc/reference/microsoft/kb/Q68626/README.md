---
layout: page
title: "Q68626: /Gm Option Can Be Emulated with a Preprocessor"
permalink: /pubs/pc/reference/microsoft/kb/Q68626/
---

## Q68626: /Gm Option Can Be Emulated with a Preprocessor

	Article: Q68626
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	The /Gm switch from Microsoft C version 5.10 is not fully implemented
	in versions 6.00 and later. This switch is designed to take all string
	literals and move them into the _CONST segment, instead of keeping
	them in the _DATA segment. However, there is a way to emulate the /Gm
	switch, which involves the use of a preprocessor for pass 2 of the
	compiler.
	
	There is a text file on CompuServe (in the MSLANG forum, library 3)
	called C2PP.C. This is public domain source code for a preprocessor
	that alters the output file from pass 1 of the compiler. Instructions
	for use are included in the source code. The program reads the input
	file, alters it, and then calls pass 2 of the compiler.
	
	To use the program, add the following options to the beginning of
	your compile line:
	
	   /B2 c2pp /Gm
	
	Even though the /Gm switch is not fully implemented in version 6.00,
	it does alter the pass 1 output file, and the preprocessor requires
	it.
	
	This program cannot be used with the /qc (Quick Compile) option.
	
	Warning: The format for the output file from pass 1 is not documented,
	and is subject to change at any time. This program has been tested
	with versions 6.00 and 6.00a. It is not guaranteed to work with any
	other versions. It is also not supported or maintained by Microsoft,
	only by the author, as listed below and in the comments in the source
	code.
	
	Many thanks to Paul van Keep (CIS ID:75170,1045) for the code that
	does the preprocessing.
