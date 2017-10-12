---
layout: page
title: "Q33526: Deeply Nested Blocks Cause C4073 Warning"
permalink: /pubs/pc/reference/microsoft/kb/Q33526/
---

	Article: Q33526
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 2-AUG-1988
	
	The following program produces a C4073 warning when compiled with
	the CL /Zi filename.c command line:
	
	#include <assert.h>
	#include <process.h>
	#include <stdio.h>
	
	void main(ac,av)
	int ac;
	char **av;
	{ assert(av[ac] == NULL);}
	
	   The warning C4073 is generated when the compiler cannot generate
	symbolic information for separate lines of code that recognize the
	distinction between different blocks. For example, you may encounter
	this error if you have many deeply nested blocks, each of which declares
	automatic variables.
	   The warning means that when in CodeView, the symbolic information
	at the deeper levels will be merged and you will be able to see the
	value of variables at lower levels when normally you would not.
	   In this example, the warning is encountered because you are nesting
	three levels on the same line of code. The assert function actually
	is a macro that is expanded to two nested levels.
	   You can work around the warning by moving the closing brace of the
	function to the next line.
