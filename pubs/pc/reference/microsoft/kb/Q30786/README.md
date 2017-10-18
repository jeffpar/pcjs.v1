---
layout: page
title: "Q30786: MASM 5.10 MIXED.DOC: Compatiblity with Undocumented Macros"
permalink: /pubs/pc/reference/microsoft/kb/Q30786/
---

## Q30786: MASM 5.10 MIXED.DOC: Compatiblity with Undocumented Macros

	Article: Q30786
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-JUN-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 MIXED.DOC file.
	
	Converting Mixed-Language Source Files
	   The other macros in the MASM 5.00 version of MIXED.INC are provided
	for compatibility with MASM 5.00, but are not documented. The rest of
	this file discusses compatibility options for source code that uses
	5.00 high-level-language macros. If you did not own MASM 5.00, you
	should ignore the rest of this file. Do not use the other macros in
	MIXED.INC.
	   You can use the following macros if you have source code that uses
	the macros provided with MASM 5.00.
	
	   Macro      Purpose
	
	   setModel   Sets memory model passed from a DOS command line. No
	              longer needed because the expression operator now enables
	              you to evaluate text macros passed from the command line
	              directly.
	
	   hProc      Initializes a procedure. Replaced by new attributes of
	              the PROC directive when you specify a language argument to
	              the .MODEL directive.
	
	   hLocal     Initializes local variables. Replaced by new functionality
	              of the LOCAL directive.
	
	   hRet       Returns from a procedure. Replaced by new functionality
	              of the RET instruction.
	
	   hEndp      Terminates a procedure. Replaced by new functionality of
	              the ENDP directive.
	
	   The 5.10 versions of these macros are different than the MASM 5.00
	versions. The new macros use new MASM features to simulate the same
	functionality more efficiently. Do not use the MIXED.INC provided with
	MASM 5.00. It will not work under MASM 5.10.
