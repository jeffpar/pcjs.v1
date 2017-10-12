---
layout: page
title: "Q38979: Error L1126, Error L2043"
permalink: /pubs/pc/reference/microsoft/kb/Q38979/
---

	Article: Q38979
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm s_quickc s_link s_error
	Last Modified: 19-DEC-1988
	
	The information below describes linker-error messages L1126 and L2043.
	
	The following error is from "Linker Error Messages" in (1) the manual
	"CodeView and Utilities", Section C.2, Page 366, and in (2) the
	"Microsoft QuickC Compiler Programmer's Guide," Section D.4, Page 374.
	It is also in (3) the file ERRMSG.DOC on Compiler Disk 1 for Microsoft
	C Version 5.10 and on the Setup Disk for Microsoft C Version 5.00,
	also in the file README.DOC on Disk 1 for Microsoft Macro Assembler
	Version 5.10, also in the file CVREADME.DOC on the CodeView for MS-DOS
	disk for Microsoft FORTRAN Version 4.10:
	
	(1)
	L1126       starting address __aulstart not found
	
	            You tried to create a Quick library without linking with
	            the required LIB library.
	
	(2)
	L2043       starting address __aulstart not found
	
	            When you build a Quick library using the /Q option, the
	            linker expects to find the symbol __aulstart defined as a
	            starting address.
	
	(3)
	L2043       Quick Library support module missing
	
	            When creating a Quick library, you did not link with the
	            required QUICKLIB.OBJ module.
	
	Fatal errors cause the linker to stop execution. Fatal error messages
	have the following format:
	
	location : fatal error L1xxx: messagetext
	
	Nonfatal errors indicate problems in the executable file. LINK
	produces the executable file. Nonfatal error messages have the
	following format:
	
	location : error L2xxx: messagetext
	
	In these messages, location is the input file associated with the
	error, or LINK if there is no input file. If the input file is an OBJ
	or LIB file and has a module name, the module name is enclosed in
	parentheses.
