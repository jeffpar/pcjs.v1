---
layout: page
title: "Q49064: Declaring a Pointer to a Function: C4071"
permalink: /pubs/pc/reference/microsoft/kb/Q49064/
---

	Article: Q49064
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickAsm
	Last Modified: 16-JAN-1990
	
	The following usual method of declaring a pointer to a function
	
	   type (*ptr)();
	   ptr = function;
	
	causes the following compiler warning when compiling with the "/W3"
	option:
	
	   C4071: 'ptr' : no function prototype given
	
	Use one of the following methods to avoid the error message:
	
	1. Use the warning level flag "/W2" instead of "/W3".
	
	2. Prototype the function itself and then specify actual parameters
	   when declaring the pointer, as follows:
	
	      type (*ptr)(parameter_list);
	      ptr = function;
	
	Note: The parameter list must be exactly the same parameter list with
	which the function was declared.
	
	The following program compiles and links with NO warnings when
	compiling with the '/W3' warning level flag set:
	
	/*  Must have 'stdio.h' to prototype 'printf' */
	#include <stdio.h>
	
	void main (void)
	{
	   /* Declare 'fun_ptr' as a pointer to a function  */
	   int (*fun_ptr)(const char *, ...);
	   int other_args;
	
	   /* Assign pointer to the specific function, 'printf' */
	   fun_ptr = printf;
	
	   /* Standard usage in calling environment */
	   fun_ptr("format string goes here", other_args);
	}
