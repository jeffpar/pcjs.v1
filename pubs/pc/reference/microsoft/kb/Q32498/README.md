---
layout: page
title: "Q32498: &quot;No Symbolic Information&quot; Debugging QuickBASIC with CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q32498/
---

## Q32498: &quot;No Symbolic Information&quot; Debugging QuickBASIC with CodeView

	Article: Q32498
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_CodeView
	Last Modified: 17-JAN-1991
	
	To debug a QuickBASIC or BASIC compiler program with the CodeView
	debugger, the following is required:
	
	1. Save the BASIC (.BAS) source file in Text format before compiling.
	
	2. Compile the program with the /Zi option and link with the /CO
	   option as follows:
	
	      BC test.bas /Zi;
	
	      LINK /CO test.obj;
	
	3. Make sure the BASIC (.BAS) file is in the current directory when
	   CodeView is invoked.
	
	This information applies to QuickBASIC versions 4.00, 4.00b, and 4.50,
	to Microsoft BASIC Compiler version 6.00 and 6.00b for MS-DOS and MS
	OS/2, and to Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	If one of the above steps is omitted, CodeView does not allow you
	to view your BASIC source code and issues the error message "No
	Symbolic Information."
	
	Following the above steps allows CodeView to find the proper symbolic
	information and allows you to do a source-level tracing of your BASIC
	program.
	
	You must use the Microsoft LINK.EXE program that comes with your copy
	of QuickBASIC or BASIC compiler (or a later version of LINK.EXE), or
	else you may get the "No Symbolic Information" error from CodeView.
	For example, if you use /CO with the older LINK.EXE that comes with
	MS-DOS Version 3.21, the linker gives no error (even though it doesn't
	support /CO), but CodeView gives you the "No Symbolic Information"
	error.
