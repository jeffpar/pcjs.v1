---
layout: page
title: "Q39037: Error U1005 Syntax Error: Colon Missing"
permalink: /pubs/pc/reference/microsoft/kb/Q39037/
---

## Q39037: Error U1005 Syntax Error: Colon Missing

	Article: Q39037
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm s_quickc s_make s_error
	Last Modified: 15-JAN-1990
	
	The following error is from "MAKE Error Messages" in the manual
	"CodeView and Utilities", Section C.4, Page 376, and in the "Microsoft
	QuickC Compiler Programmer's Guide," Section D.6, Page 382:
	
	U1005       syntax error : colon missing
	
	            A line that should be an outfile/infile line lacked a
	            colon indicating the separation between outfile and
	            infile. MAKE expects any line following a blank line to be
	            an outfile/infile line.
	
	Note: MAKE expects a blank character or tab(s) after the colon between
	outfile and infile. If such a space is missing, this error occurs.
	
	Error messages displayed by the Microsoft Program Maintenance Utility,
	MAKE, have one of the following formats:
	
	   {filename | MAKE} : fatal error U1xxx: messagetext
	   {filename | MAKE} : warning U4xxx: messagetext
	
	The message begins with the input-file name (filename), if one exists,
	or with the name of the utility. If possible, MAKE prints a warning
	and continues operation. In some cases, errors are fatal and MAKE
	terminates processing.
	
	This problem can also be caused by using a NMAKE compatible make file
	with MAKE.
