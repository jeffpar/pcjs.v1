---
layout: page
title: "Q37723: Error C2174 Function : Actual Has Type Void : Parameter..."
permalink: /pubs/pc/reference/microsoft/kb/Q37723/
---

	Article: Q37723
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 14-NOV-1988
	
	The following error is from "Compilation-Error Messages" in the
	"Microsoft QuickC Compiler Programmer's Guide," Section D.1.2, Page
	340, and from "Compiler and Run-Time Errors -- New Messages" in the
	Microsoft C Optimizing Compiler file ERRMSG.DOC, on Version 5.00's
	Setup Disk and on Version 5.10's Compiler Disk 1, but not in the
	"Microsoft C Optimizing Compiler User's Guide" for those versions:
	
	C2174       function : actual has type void : parameter number,
	            parameter list number
	
	            An attempt was made to pass a void argument to a function.
	            Formal parameters and arguments to functions cannot have
	            type void; however, they can have type void * (pointer
	            to void). This error occurs in calls that return a pointer
	            to a function. The first number indicates which argument
	            was in error; the second number indicates which argument
	            list contained the invalid argument.
	
	When the compiler encounters any of the errors listed in this section,
	it continues parsing the program (if possible) and outputs additional
	error messages. However, no object file is produced.
