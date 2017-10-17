---
layout: page
title: "Q39312: Commenting Out Blocks of Code and Comments for Debugging"
permalink: /pubs/pc/reference/microsoft/kb/Q39312/
---

## Q39312: Commenting Out Blocks of Code and Comments for Debugging

	Article: Q39312
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 29-DEC-1988
	
	The C language does not support the use of nested comments. This might
	appear to be a limitation in cases where it is necessary,  perhaps for
	debugging purposes, to comment out a block of code which  contains
	comments. However, this situation can be overcome by using the
	much more powerful preprocessor commands #if and #endif.
	
	The #if preprocessor command evaluates a constant expression to either
	true (which has the value 1) or false (which has the value 0) to
	perform conditional compilation. If the expression equates to true,
	the code segment will be compiled. If it equates to false, it will be
	ignored by the compiler. Therefore, if the syntax below is used,
	the enclosed block of code will be forever ignored by the compiler
	giving a convenient method of effectively commenting out a block of
	code.
	
	Since the expression in the #if can be any constant expression, you
	can make complicated tests.  You can even use the /Dconst=value
	switch on the CL command line to set a preprocessor symbol which will
	include or exclude the debugging code when you compile.  This
	technique is described more fully on pages 75-77 of the Microsoft C
	Optimizing Compiler User's Guide.
	
	The following is a simple example:
	
	#define OUT 0
	
	#if OUT       /* will always equate to "false" */
	
	   /* code and comments that you wish to remove are here */
	
	#endif
