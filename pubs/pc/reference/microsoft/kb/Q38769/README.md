---
layout: page
title: "Q38769: Error L1006 Option : Stack Size Exceeds 65535 Bytes"
permalink: /pubs/pc/reference/microsoft/kb/Q38769/
---

	Article: Q38769
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm s_quickc s_link s_error docerr
	Last Modified: 7-DEC-1988
	
	The following error is from "Linker Error Messages" in (1) the manual
	"CodeView and Utilities," Section C.2, Page 360, and in (2) the
	"Microsoft QuickC Compiler Programmer's Guide," Section D.4, Page 365:
	
	(1)
	L1010       option : stack size exceeds 65536 bytes
	
	            The size specified for the stack in the /STACK option of
	            the LINK command was more than 65,536 bytes.
	
	(2)
	L1006       option : stack size exceeds 65535 bytes
	
	            The size specified for the stack was more than 65,535
	            bytes.
	
	Fatal errors cause the linker to stop execution. Fatal error messages
	have the following format:
	
	   location : fatal error L1xxx: messagetext
	
	In these messages, location is the input file associated with the
	error, or LINK if there is no input file. If the input file is an OBJ
	or LIB file and has a module name, the module name is enclosed in
	parentheses.
	
	The documentation of the error in the "CodeView and Utilities" manual
	is incorrect. The error number should be L1006, not L1010. The upper
	limit of the stack as given in both the error message and its
	description should be 65535, not 65536. The QuickC manual is correct.
	
	This error is documented in the files ERRMSG.DOC for Microsoft C
	Version 5.10, README.DOC for Microsoft Macro Assembler Version 5.10,
	CVREADME.DOC for Microsoft FORTRAN Version 4.10, and README.DOC for
	Microsoft Pascal Version 4.00, but the description given has a
	documentation error. The error is given as:
	
	  L1006   <option-text>: stack size exceeds 65535 bytes
	
	  The value given as a parameter to the /STACKSIZE option exceeds
	  the maximum allowed.
	
	The option /STACKSIZE is wrong. The LINK option to change the stack is
	either /STACK or /ST. Specifying /STACKSIZE will generate the error:
	
	   LINK : fatal error L1002: STACKSIZE : unrecognized option name
