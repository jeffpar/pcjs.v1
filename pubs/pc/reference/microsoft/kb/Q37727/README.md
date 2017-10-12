---
layout: page
title: "Q37727: Error C2152 Identifier : Pointers to Functions..."
permalink: /pubs/pc/reference/microsoft/kb/Q37727/
---

	Article: Q37727
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 14-NOV-1988
	
	The following error is from "Compilation-Error Messages" in the
	"Microsoft C Optimizing Compiler User's Guide," Section E.3.2, Page
	267, and in the "Microsoft QuickC Compiler Programmer's Guide,"
	Section D.1.2, Page 337:
	
	C2152       identifier : pointers to functions with different
	            attributes
	
	            An attempt was made to assign a pointer to a function
	            declared with one calling convention (cdecl, fortran, or
	            pascal) to a pointer to a function declared with a
	            different calling convention.
	
	When the compiler encounters any of the errors listed in this section,
	it continues parsing the program (if possible) and outputs additional
	error messages. However, no object file is produced.
	
	Additional causes for this error include mixing near and far function
	pointers and mixing interrupt and non-interrupt function pointers.
