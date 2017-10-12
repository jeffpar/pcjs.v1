---
layout: page
title: "Q50234: Using Function Name Without "()" Produces No Code"
permalink: /pubs/pc/reference/microsoft/kb/Q50234/
---

	Article: Q50234
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 17-JUL-1990
	
	When a function name declared in your program is used without
	parentheses, the compiler does not produce any code. The compiler does
	not produce error messages or warnings as long as the function has
	been prototyped. This occurs regardless of whether or not the function
	takes parameters because the compiler calculates the function address,
	but because the function call operator "()" is not present, no call is
	made. This result is similar to the following:
	
	   int a;
	
	   a;      /* no code generated here either */
	
	Code Example
	------------
	
	void foo(int a, int b);
	void main(void)
	{
	     foo;               /* Using foo without function call operator () */
	}
	
	The above code compiles and links correctly without errors or warnings
	but produces no code in reference to foo(). For this to work
	correctly, add the function call operator "()".
