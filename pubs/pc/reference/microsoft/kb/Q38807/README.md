---
layout: page
title: "Q38807: Error L1070 Segment Size Exceeds 64K"
permalink: /pubs/pc/reference/microsoft/kb/Q38807/
---

	Article: Q38807
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm s_quickc s_link s_error
	Last Modified: 12-JAN-1989
	
	The following error is from "Linker Error Messages" in (1) the manual
	"CodeView and Utilities," Section C.2, Page 363, and in (2) the
	"Microsoft QuickC Compiler Programmer's Guide," Section D.4, Page 369:
	
	(1)
	L1070       segment size exceeds 64K
	
	            A single segment contained more than 64K of code or data.
	
	            Try compiling and linking using the large model.
	
	(2)
	L1070       name: segment size exceeds 64K
	
	            The specified segment contained more than 64K of code or
	            data.
	
	            Try compiling and linking using the large model.
	
	Fatal errors cause the linker to stop execution. Fatal error messages
	have the following format:
	
	   location : fatal error L1xxx: messagetext
	
	In these messages, location is the input file associated with the
	error, or LINK if there is no input file. If the input file is an OBJ
	or LIB file and has a module name, the module name is enclosed in
	parentheses.
	
	Use a large data model (compact, large, or huge). Try applying the /Gt
	compilation option to lower the threshhold.
