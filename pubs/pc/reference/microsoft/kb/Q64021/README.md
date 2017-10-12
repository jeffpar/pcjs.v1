---
layout: page
title: "Q64021: C1001: Internal Compiler Error: '../grammar.c', Line 140"
permalink: /pubs/pc/reference/microsoft/kb/Q64021/
---

	Article: Q64021
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-AUG-1990
	
	The code below, when compiled with Microsoft C 6.00, produces the
	following error message:
	
	   fatal error C1001: Internal Compiler Error
	    (compiler file '../grammar.c', line 140)
	    Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	struct x
	{
	   int a;
	   int *b;
	   double **c;
	};
	
	typedef struct x TEST;
	
	void function (TEST *pTEST)
	{
	   double xx = 0;
	   int i,j;
	
	   for (i=0;i<pTEST->a;i++)
	
	      for(j=0;j<pTEST->b[i];j++)
	
	         if (pTEST->c[i][j]>xx)        // Fails here...
	
	            pTEST->b[i]=j;
	}
	
	Compiling this code with one of the following options will produce
	the internal compiler error mentioned above:
	
	   /Ot /Oi /Oit
	
	The following are some possible solutions:
	
	1. Use /Oe, /Ol, /Ox, /Oet, or /Olt when compiling.
	
	2. Put the typedef and struct x definitions together.
	
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
