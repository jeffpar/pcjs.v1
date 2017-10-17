---
layout: page
title: "Q68872: Ternary Operator Generates Incorrect Code for Bit Fields"
permalink: /pubs/pc/reference/microsoft/kb/Q68872/
---

## Q68872: Ternary Operator Generates Incorrect Code for Bit Fields

	Article: Q68872
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00a
	Last Modified: 6-FEB-1991
	
	In some situations, the ternary operator does not recognize that the
	first bit in a structure has been set. For example, when the code
	example below is compiled with
	
	   cl test.c
	
	it prints out
	
	   NOT_SET  NOT_SET
	
	when it should print the following:
	
	   SET      NOT_SET
	
	Code Example
	------------
	
	#include <stdio.h>
	
	typedef struct tag
	{
	   unsigned int a: 1;
	   unsigned int b: 1;
	   unsigned int c: 14;
	} BIT, *PBIT;
	
	void foo(PBIT px)
	{
	   printf("%s\t%s", px->a ? "SET" : "NOT_SET", px->b ? "SET" : "NOT_SET");
	}
	
	void main(void)
	{
	   BIT  x;
	
	   x.a = 1;
	   x.b = 0;
	   foo( &x );
	}
	
	The following are three workarounds:
	
	1. Update to C version 6.00a.
	
	2. Compile with /Od.
	
	3. Simplify the printf() statement by moving the ternary condition to
	   another line, or by using an else if statement.
