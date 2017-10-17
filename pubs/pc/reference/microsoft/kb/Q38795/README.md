---
layout: page
title: "Q38795: Error L1087 Unexpected End-of-File on Scratch File"
permalink: /pubs/pc/reference/microsoft/kb/Q38795/
---

## Q38795: Error L1087 Unexpected End-of-File on Scratch File

	Article: Q38795
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm s_quickc s_link s_error
	Last Modified: 7-DEC-1988
	
	The following error is from "Linker Error Messages" in the manual
	"CodeView and Utilities," Section C.2, Page 364, and in the "Microsoft
	QuickC Compiler Programmer's Guide," Section D.4, Page 370:
	
	L1087       unexpected end-of-file on scratch file
	
	            The disk with the temporary linker-output file was
	            removed.
	
	Fatal errors cause the linker to stop execution. Fatal error messages
	have the following format:
	
	   location : fatal error L1xxx: messagetext
	
	In these messages, location is the input file associated with the
	error, or LINK if there is no input file. If the input file is an OBJ
	or LIB file and has a module name, the module name is enclosed in
	parentheses.
	
	This error can be caused by insufficient space on the disk (hard,
	floppy, or RAM) where the temporary file is being written.
