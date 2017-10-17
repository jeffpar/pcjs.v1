---
layout: page
title: "Q62701: C1001: Internal Compiler Error: '../grammar.c', Line 140"
permalink: /pubs/pc/reference/microsoft/kb/Q62701/
---

## Q62701: C1001: Internal Compiler Error: '../grammar.c', Line 140

	Article: Q62701
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	The sample program shown below, when compiled for compact or large
	memory model, will produce the following error under default
	optimizations:
	
	   foo.c(14) : fatal error C1001: Internal Compiler Error
	               (compiler file '../grammar.c', line 140)
	               Contact Microsoft Product Support Services
	
	Sample Program
	--------------
	
	#include <malloc.h>
	
	int a[2];
	
	void test(void)
	{
	   int b;
	   char *c;
	
	   c=(char *)malloc(100);
	
	   b=*(int*)(c+a[0])+*(int *)(c+a[1]);
	}
	
	The following are several possible workarounds:
	
	1. Enable global register allocation during compilation. (/Oe)
	
	2. Disable optimizations globally. (/Od)
	
	3. Disable optimizations locally with #pragma. ("",off)
	
	4. Simplify the expression through the use of temporary variables.
	
	Microsoft has confirmed this to be a problem with Microsoft C version
	6.00. We will post new information here here as it becomes available.
