---
layout: page
title: "Q38819: Error L2041 Stack Plus Data Exceeds 64K"
permalink: /pubs/pc/reference/microsoft/kb/Q38819/
---

	Article: Q38819
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm s_quickc s_link s_error
	Last Modified: 7-DEC-1988
	
	The error below is from "Linker Error Messages" in the "Microsoft
	QuickC Compiler Programmer's Guide," Section D.4, Page 374. It is also
	in the file ERRMSG.DOC on Compiler Disk 1 for Microsoft C Version 5.10
	and on the Setup Disk for Microsoft C Version 5.00, and in the file
	README.DOC on Disk 1 for Microsoft Macro Assembler Version 5.10, and
	in the file CVREADME.DOC on the CodeView for MS-DOS disk for Microsoft
	FORTRAN Version 4.10. It is not found in the manual "CodeView and
	Utilities."
	
	The following is the error:
	
	L2041       stack plus data exceeds 64K
	
	            The combined size of the program stack segment plus DGROUP
	            was greater than 64K; as a result, the program will not
	            load up correctly.
	
	Nonfatal errors indicate problems in the executable file. LINK
	produces the executable file. Nonfatal error messages have the
	following format:
	
	   location : error L2xxx: messagetext
	
	In these messages, location is the input file associated with the
	error, or LINK if there is no input file. If the input file is an OBJ
	or LIB file and has a module name, the module name is enclosed in
	parentheses.
	
	To correct the problem, do the following:
	
	1. Reduce the stack size.
	
	2. Use a large data model (compact, large, or huge). Try applying the
	   /Gt compilation option to lower the threshhold.
	
	3. Use the FAR keyword to move data out of DGROUP.
