---
layout: page
title: "Q62072: C1001: Internal Compiler Error: '@(#)regMD.c:1.100', Line 4634"
permalink: /pubs/pc/reference/microsoft/kb/Q62072/
---

## Q62072: C1001: Internal Compiler Error: '@(#)regMD.c:1.100', Line 4634

	Article: Q62072
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 15-AUG-1990
	
	The sample program show below, when compiled for compact or large
	memory model, produces the following error under default
	optimizations:
	
	   fatal error C1001: Internal Compiler Error
	       (compiler file '@(#)regMD.c:1.100', line 4634)
	       Contact Microsoft Product Support Services
	
	Sample Program
	--------------
	
	#include<stdio.h>
	
	typedef struct window
	{
	    int *fld;
	    int f_cursor, l_cursor;
	} WINDOW;
	
	void test(int,int);
	
	void foo(WINDOW *w)
	{
	 test(w->fld[w->f_cursor],w->fld[w->f_cursor+1]-w->fld[w->f_cursor]);
	}
	
	Microsoft has confirmed this to be a problem with Microsoft C version
	6.00. We are researching this problem and will post new information
	here as it becomes available.
	
	The following are several possible workarounds:
	
	1. Enable global register allocation during compilation (/Oe).
	
	2. Disable optimizations globally (/Od).
	
	3. Disable optimizations locally with #pragma("",off).
	
	4. Simplify the function call through the use of temporary variables.
