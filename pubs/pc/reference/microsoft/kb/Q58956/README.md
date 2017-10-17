---
layout: page
title: "Q58956: You Cannot Decompile .EXE or .OBJ Files Back to BASIC Source"
permalink: /pubs/pc/reference/microsoft/kb/Q58956/
---

## Q58956: You Cannot Decompile .EXE or .OBJ Files Back to BASIC Source

	Article: Q58956
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890926-125 B_BasicCom
	Last Modified: 26-FEB-1990
	
	Microsoft does not currently offer any product capable of
	"decompiling" an object (.OBJ) or executable (.EXE) file back to the
	original source code (.BAS). The following are several reasons for
	this:
	
	1. No decompiler could exactly reproduce the original source code.
	
	   When a program is compiled to an object and linked to produce an
	   executable, most of the "names" used in the original program are
	   converted to addresses. This loss of names means that a decompiler
	   would have to create unique names for all the variables,
	   procedures, and labels, and these names would not be meaningful in
	   the context of the program.
	
	   Obviously, source language syntax no longer exists in the compiled
	   object file or executable. It would be very difficult for a
	   decompiler to interpret the series of machine language instructions
	   that exist in an object or executable file and decide what the
	   original source language instruction was.
	
	2. If such a decompiler did exist and was available, anyone could use
	   it to decompile any executable program produced in the language the
	   decompiler was designed for.
	
	   For instance, if a Microsoft BASIC decompiler existed, anyone with
	   that decompiler could use it on an executable that you had
	   produced and from that executable obtain a copy of your source
	   code. The source code to any program you wrote in Microsoft BASIC
	   would be available to anyone with the decompiler. Few developers of
	   commercial software would want to use a language product that could
	   be deciphered, thus allowing others to obtain their source code.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, 4.50 for MS-DOS, to Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2.
