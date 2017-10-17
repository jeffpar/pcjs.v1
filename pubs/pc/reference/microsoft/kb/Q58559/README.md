---
layout: page
title: "Q58559: C2144 May Be Caused by Executable Code Between Declarations"
permalink: /pubs/pc/reference/microsoft/kb/Q58559/
---

## Q58559: C2144 May Be Caused by Executable Code Between Declarations

	Article: Q58559
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 12-FEB-1990
	
	Compiler Error C2144 is defined as follows:
	
	   syntax error : missing 'token' before type 'type'
	
	You may receive this error message if your program places executable
	code before a data declaration, a practice which was acceptable in
	Kernighan and Ritchie C, but has since been outlawed in later versions
	of the ANSI drafts.
	
	This error message will normally occur if a required closing curly
	brace (}), right parenthesis [)], or semicolon (;) is missing.
	
	The following code demonstrates this error message:
	
	/* Program : foo.c */
	
	#include <stdio.h>
	
	void main(void)
	{
	        int i;
	        printf("Beetlejuice\n");
	        int j;
	}
	
	Compiling this code with Microsoft C Version 3.00, 4.00, 5.00, or
	5.10, or QuickC Version 1.00, 1.01, 2.00, or 2.01 will return the
	following error message:
	
	   foo.c
	   foo.c(7) : error C2144: syntax error : missing ';' before
	           type 'int'
	
	Placing all data declarations before all executable code corrects the
	programming error.
