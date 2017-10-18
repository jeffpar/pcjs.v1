---
layout: page
title: "Q50862: @MakeFil Macro Spelled Wrong on MASM 5.10 CodeView Tutorial"
permalink: /pubs/pc/reference/microsoft/kb/Q50862/
---

## Q50862: @MakeFil Macro Spelled Wrong on MASM 5.10 CodeView Tutorial

	Article: Q50862
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | MAKEFILE docerr
	Last Modified: 29-MAR-1990
	
	In the file MACRO.DOC on the "Microsoft CodeView for MS-DOS with
	Tutorial" disk for Microsoft Macro Assembler Version 5.10, there is a
	documentation error that incorrectly calls the macro @MakeFil.
	
	The macro is defined in the DOS.INC include file, also on the MS-DOS
	CodeView disk. In the DOS.INC include file, the @MakeFil macro has
	been labeled as @MakFil, not @MakeFil.
	
	To use this macro correctly, either change the DOS.INC include file
	macro label to @MakeFil, or call the macro as @MakFil.
