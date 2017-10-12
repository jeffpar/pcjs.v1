---
layout: page
title: "Q38820: Error L2025 Name : Symbol Defined More than Once"
permalink: /pubs/pc/reference/microsoft/kb/Q38820/
---

	Article: Q38820
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm s_quickc s_link s_error
	Last Modified: 7-DEC-1988
	
	The following error is from "Linker Error Messages" in the manual
	"CodeView and Utilities", Section C.2, Page 368, and in the "Microsoft
	QuickC Compiler Programmer's Guide," Section D.4, Page 373:
	
	L2025       name : symbol defined more than once
	
	            Remove the extra symbol definition from the object file.
	
	Nonfatal errors indicate problems in the executable file. LINK
	produces the executable file. Nonfatal error messages have the
	following format:
	
	   location : error L2xxx: messagetext
	
	In these messages, location is the input file associated with the
	error, or LINK if there is no input file. If the input file is an OBJ
	or LIB file and has a module name, the module name is enclosed in
	parentheses.
	
	One way this error can be caused is by incorrectly using or omitting a
	keyword such as pascal. If the included function prototype has the
	keyword and the library routine does not, or vice versa, the linker
	reports that the function is defined more than once.
