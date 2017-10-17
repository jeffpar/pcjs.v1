---
layout: page
title: "Q36737: Longer Variable Names Take No Extra Space in .EXE Program"
permalink: /pubs/pc/reference/microsoft/kb/Q36737/
---

## Q36737: Longer Variable Names Take No Extra Space in .EXE Program

	Article: Q36737
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	In programs compiled by BC.EXE, you will not change the generated code
	size by using shorter variable names instead of longer ones. The
	generated .OBJ and .EXE file sizes are independent of the length of
	variable names.
	
	Although BC.EXE uses variable names at compile time to allocate memory
	and translate BASIC statements to machine code, these symbolic names
	are not embedded in the code produced by the compiler.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50; to Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2; and to
	Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	Source code can be much more readable if you use fully-descriptive
	names in naming variables. QuickBASIC allows variable names up to 40
	characters in length. Consider the following choices of variable
	names:
	
	   mfp     versus      MeanFreePath
	   n$      versus      LastName$
	   vo      versus      Volts
	   vl      versus      Volume
	   vc      versus      Velocity
	
	The names in the right column generate no more code than those on the
	left side.
	
	However, within the QB.EXE program development environment, all text
	in the source file occupies memory, including long variable names.
