---
layout: page
title: "Q61315: Mixing Prototype Styles Generates C2059 Syntax Error in C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q61315/
---

	Article: Q61315
	Product: Microsoft C
	Version(s): 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 29-MAY-1990
	
	If parameter list declarations are used with type list declarations in
	a prototype, Microsoft C version 6.00 will generate a syntax error.
	
	Code Example
	------------
	
	void foo(int x, float);     // Error C2059: Syntax Error ')'
	void main(void)
	{
	   int x=1, y=2;
	   foo(x, y);
	}
	void foo(int a, int b)
	{
	}
	
	The following are suggested workarounds:
	
	1. Prototype with a parameter list. For example:
	
	      void foo(int x, float y);
	
	2. Prototype with a type list. For example:
	
	      void foo(int, float);
	
	Since ANSI does allow mixing declarators and abstract declarators in
	the same prototype, this error message is incorrect.
	
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
