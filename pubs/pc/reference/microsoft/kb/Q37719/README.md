---
layout: page
title: "Q37719: Error C2170 Identifier : Intrinsic Not Declared as a Function"
permalink: /pubs/pc/reference/microsoft/kb/Q37719/
---

## Q37719: Error C2170 Identifier : Intrinsic Not Declared as a Function

	Article: Q37719
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error docerr
	Last Modified: 14-NOV-1988
	
	The error below is from "Compilation-Error Messages" in the
	"Microsoft C Optimizing Compiler User's Guide," Section E.3.2, Page
	268. It is not documented in either the "Microsoft QuickC Compiler
	Programmer's Guide," or in the README.DOC file, for the Microsoft
	QuickC Compiler Versions 1.00 and 1.01.
	
	The following is the error:
	
	C2170       identifier : intrinsic not declared as a function
	
	        You tried to use the intrinsic pragma for an item other
	            than a function, or for a function that does not have an
	            intrinsic form. (The section titled "Generating Intrinsic
	            Functions" in Section 3.3.15 lists the functions that have
	            intrinsic forms.)
	
	The section reference given in the error explanation is wrong. It is
	found in Section 3.3.13.1 beginning on Page 93 of the "Microsoft C
	Optimizing Compiler User's Guide."
	
	When the compiler encounters any of the errors listed in this section,
	it continues parsing the program (if possible) and outputs additional
	error messages. However, no object file is produced.
