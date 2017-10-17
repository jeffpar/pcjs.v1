---
layout: page
title: "Q34922: CodeView Cannot Debug Source Code in Include Files"
permalink: /pubs/pc/reference/microsoft/kb/Q34922/
---

## Q34922: CodeView Cannot Debug Source Code in Include Files

	Article: Q34922
	Version(s): 1.00 1.10 1.11 2.00 2.02.02 2.10 2.20
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 9-NOV-1988
	
	CodeView cannot debug source code in include files. This information
	is documented on Page 7 of the "Microsoft CodeView and Utilities"
	manual. The explanation for the restriction on include files says "You
	will not be able to use the CodeView debugger to debug source code in
	include files."
	
	This information means programs with include files that contain
	executable statements cannot be debugged with CodeView.
	
	The usual symptom of this problem is that after tracing or otherwise
	trying to execute your program, you will be viewing one of your
	include files instead of your normal source code. Repeated attempts
	to view the main or other source files will result in viewing the
	include file again.
	
	This is program design for the product. Microsoft's compilers do not
	generate symbolic information for code in include files. As a result,
	CodeView is confused by the discrepancies, and the subsequent behavior
	is unpredictable. Include files only can contain prototypes,
	declarations, #defines or #includes, etc.
	
	(Note that these items are all "nonexecutable" statements )
	
	Although it is valid C code, include files must not contain
	initializations or function definitions or other executable statements
	for CodeView to be able to debug your programs properly.
