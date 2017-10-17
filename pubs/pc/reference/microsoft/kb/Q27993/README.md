---
layout: page
title: "Q27993: Creating a Quick Library (.QLB) from a LINK Library (.LIB)"
permalink: /pubs/pc/reference/microsoft/kb/Q27993/
---

## Q27993: Creating a Quick Library (.QLB) from a LINK Library (.LIB)

	Article: Q27993
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_LINK
	Last Modified: 20-SEP-1990
	
	The LINK.EXE utility can create a Quick library (.QLB) file from a
	LINKer library (.LIB) file. This can be done by using the LINK /Q
	option and the following syntax
	
	   LINK xxxx.LIB /Q,,,BQLB40.LIB;
	
	where xxxx.LIB is your own .LIB library for which you want to make a
	Quick library. Also, you must link to the appropriate BQLBxx.LIB
	support library as follows: for QuickBASIC 4.00 and Microsoft BASIC
	Compiler 6.00, use BQLB40.LIB; for QuickBASIC 4.00b and BASIC compiler
	6.00b, use BQLB41.LIB; for QuickBASIC 4.50, use BQLB45.LIB.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS, and to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS.
	
	Also, at the bottom of this article is a method to build a QuickBASIC
	version 2.00, 2.01, or 3.00 run-time user library from .LIB libraries.
	Run-time user libraries are created and used differently than the
	Quick libraries found in later versions.
	
	Note that Quick libraries (.QLB files) can only be used in the QB.EXE
	environment (and are loaded with the /L option).
	
	The QuickBASIC manual describes methods for creating Quick libraries
	using either .OBJ files or the Make Lib option on the Run menu from
	within the QB editor. The above LINK command lets you create a .QLB
	file when only a .LIB file is available.
	
	For example, when the following command is issued from the DOS command
	line, a Quick library (MOUSE.QLB) is created from the library file
	MOUSE.LIB:
	
	   LINK MOUSE.LIB /Q,,,BQLB40.LIB;
	
	A similar method is used when you want to combine two or more existing
	libraries into one Quick library. For example, the following command
	will combine MY.LIB (a library created by you) with QB.LIB (a library
	provided with the compiler) to form MYNEW.QLB:
	
	   LINK MY.LIB+QB.LIB /Q, MYNEW.QLB,, BQLB40.LIB;
	
	Please note that if the following command is used to create the Quick
	library, then only those files in QB.LIB that are called from MY.LIB
	will ultimately become a part of MYNEW.QLB:
	
	   LINK MY.LIB /Q, MYNEW.QLB,, BQLB40.LIB+QB.LIB;
	
	Therefore, if the routines in QB.LIB are being called from the
	main-module level of the program, you must use the previous syntax
	(that is, all .LIB files must be specified in the first parameter).
	
	For more information on the creation of Quick libraries, see Pages
	189-201 and 221 of the "Microsoft QuickBASIC 4.0: Learning and Using
	Microsoft QuickBASIC" manual for versions 4.00 and 4.00b. See also
	Pages 377-389 (Appendix H: "Creating and Using Quick Libraries") in
	the "Microsoft QuickBASIC 4.5: Programming in BASIC" manual for
	version 4.50.
	
	QuickBASIC 2.x, 3.00
	--------------------
	
	In QuickBASIC versions 2.00, 2.01, and 3.00, the BUILDLIB.EXE utility
	can convert subprogram .OBJ files into run-time user libraries, which
	can be called from within the QB editor or unlike in later versions,
	called from an EXE program compiled to require the run-time module.
	QuickBASIC versions released after 3.00 do not offer the BUILDLIB.EXE
	utility and don't support run-time user libraries for use with EXE
	programs. (However, BASIC compiler 6.00 and 6.00b, and Microsoft
	Professional Development System (PDS) 7.00 and 7.10 do offer a similar
	capability: a BUILDRTM.EXE utility to add .OBJ modules to the BASIC
	run-time module itself.)
	
	The BUILDLIB.EXE from QuickBASIC 2.x/3.00 can create user libraries
	from .LIB files when you invoke BUILDLIB with the /L option (BUILDLIB
	/L). Once invoked with /L, BUILDLIB then prompts you for the name of
	the .LIB library file to input and the name of the user library to
	output. Object .OBJ files cannot be input to BUILDLIB.EXE if you
	invoke with the /L switch, unless the .OBJ files first are put into
	.LIB files with the Microsoft LIB.EXE library manager utility.
