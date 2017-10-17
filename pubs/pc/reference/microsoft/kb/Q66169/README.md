---
layout: page
title: "Q66169: Internal Compiler Error: '@(#)regMD.c:1.100', Line 3837"
permalink: /pubs/pc/reference/microsoft/kb/Q66169/
---

## Q66169: Internal Compiler Error: '@(#)regMD.c:1.100', Line 3837

	Article: Q66169
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00a
	Last Modified: 24-OCT-1990
	
	When the code below is compiled from the command line with
	
	   cl filename.c
	
	it will produce the following error:
	
	   fatal error C1001: Internal Compiler Error
	   (compiler file '@(#)regMD.c:1.100', line 3837)
	   Contact Microsoft Product Support Services
	
	Workaround
	----------
	
	To work around the problem, do one of the following:
	
	1. Change the register value to a nonregister value.
	
	2. Put the quantity (x[p] + y[a]) into a temporary variable, then use
	   the temporary.
	
	3. Compile with one or more of -Ol, -Oe, or -Og.
	
	4. Use the C version 6.00a update, which corrects this problem.
	
	A code example, which demonstrates this problem, is shown below:
	
	Code Example
	------------
	
	#include <stdio.h>
	
	    unsigned y[200];
	    unsigned x[320];
	    char buffer[0x4000];
	    char far *scrn;
	
	void test(p)
	int p;
	{
	   register a;
	
	   buffer[ x[p] + y[a] ] = scrn[ x[p] + y[a] ];
	
	    }
	
	void main(void)
	{
	   int b;
	   test(b);
	}
