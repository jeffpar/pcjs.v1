---
layout: page
title: "Q51636: C Extensions: Link Errors on &#95;&#95;acrtused and _main Explained"
permalink: /pubs/pc/reference/microsoft/kb/Q51636/
---

## Q51636: C Extensions: Link Errors on &#95;&#95;acrtused and _main Explained

	Article: Q51636
	Version(s): 1.00    | 1.02
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 21-DEC-1989
	
	Question :
	
	I am writing a C extension for the Microsoft Editor (M). When I link,
	I get the following error message:
	
	   c:\usr\lib\CLIBCE.LIB(dos\crt0.asm)
	           error  L2044:  __acrtused
	           symbol multiply defined, use /NOE  pos
	           1CC Record type: 53E4
	
	   LINK : error L2029: Unresolved externals:
	   _main in file(s):  c:\usr\lib\CLIBCE.LIB(dos\crt0.asm)
	   Two errors were detected.
	
	I am compiling and linking as follows:
	
	   cl /c /Gs /Asfu c_extension.c
	   link /NOI /NOE exthdr.obj c_extension.obj, c_extension;
	
	These options seem to be correct according to the Editor manuals. Why
	am I getting these linker errors?
	
	Response:
	
	The linker gives these error messages if you are linking with a
	run-time function that must be initialized from the C start-up source
	code. This start-up source code is not used within a C extension.
	
	The art of writing C extensions for M Version 1.00 is documented in
	Chapter 8 of the Editor section of the "CodeView and Utilities,
	Microsoft Editor, Mixed-Language Programming Guide," which is included
	with C 5.00, C 5.10, Pascal 4.00, FORTRAN 4.10, and MASM 5.10.
	References to M Version 1.02 extensions are discussed in Chapter 8 of
	the "Microsoft Editor User's Guide," which came with FORTRAN 5.00.
	
	Please contact Microsoft Product Support Services at (800) 454-2030 to
	obtain an application note that discusses further techniques of writing C
	extensions for the Microsoft Editor.
