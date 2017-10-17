---
layout: page
title: "Q50130: L2041: Stack Plus Data Exceeds 64K -- Documentation Supplement"
permalink: /pubs/pc/reference/microsoft/kb/Q50130/
---

## Q50130: L2041: Stack Plus Data Exceeds 64K -- Documentation Supplement

	Article: Q50130
	Version(s): 3.65 4.06 | 5.01.21
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER  | s_pascal h_fortran h_masm s_c s_quickc s_quickasm s_error d
	Last Modified: 30-NOV-1989
	
	The following indicates that there is more than 64K of stack and data
	to be put into the 64K DGROUP (default data segment):
	
	   L2041    stack plus data exceeds 64K
	
	            The combined size of the program stack segment plus DGROUP
	            was greater than 64K; as a result, the program will not
	            load up correctly.
	
	To correct this problem, do the following:
	
	1. If the file(s) was compiled with C 5.00, a large amount of string
	   literal data in the program may cause this error. Unlike C 5.10,
	   5.00 cannot move string literals out of DGROUP with the /Gt option.
	   This problem can be corrected with the "C 5.00 /Gt Fix" application
	   note, which is available from Microsoft Product Support Services by
	   calling (206) 454-2030.
	
	2. Reduce the stack size.
	
	3. Use a large data model (compact, large, or huge). Try applying the
	   /Gt compilation option to lower the threshold.
	
	4. Use the FAR keyword to move data out of DGROUP.
	
	This error is documented in "Linker Error Messages" in the "Microsoft
	QuickC Compiler for IBM Personal Computers and Compatibles
	Programmer's Guide," Section D.4, Page 374. It is also in the file
	ERRMSG.DOC on Compiler Disk 1 for Microsoft C Version 5.10, on the
	Setup disk for Microsoft C Version 5.00, in the file README.DOC on
	Disk 1 for Microsoft Macro Assembler Version 5.10, and in the file
	CVREADME.DOC on the CodeView for MS-DOS disk for Microsoft FORTRAN
	Version 4.10. It is not found in the "CodeView and Utilities,
	Microsoft Editor, Mixed-Language Programming Guide" manual.
	
	Nonfatal errors indicate problems in the executable file. LINK
	produces the executable file. Nonfatal error messages have the
	following format:
	
	   location : error L2xxx: messagetext
	
	In these messages, location is the input file associated with the
	error, or LINK if there is no input file. If the input file is an .OBJ
	or .LIB file and has a module name, the module name is enclosed in
	parentheses.
	
	Additional reference words: appnote
