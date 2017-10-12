---
layout: page
title: "Q59439: C4071 Can Be Caused by Missing "void" in Function Prototype"
permalink: /pubs/pc/reference/microsoft/kb/Q59439/
---

	Article: Q59439
	Product: Microsoft C
	Version(s): 5.00 5.10 6.00 | 5.00 5.10 6.00
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 18-APR-1990
	
	Function prototypes must have parameter lists. If no arguments are to
	be passed to a function, the parameter list must contain the keyword
	"void". At warning level three (/W3), leaving the "void" out of such a
	prototype parameter list leads to the following warning message in C
	Versions 5.00 and 6.00 and QuickC Versions 2.00, 2.01, 2.50, and 2.51:
	
	   C4071 'name' : no function prototype given
	
	In C Version 5.10, the following additional warning message occurs:
	
	   C4103 Function definition used as prototype
	
	The following code demonstrates the problem:
	
	/* myfunc is not prototyped correctly */
	
	#include <stdio.h>
	void myfunc();          /* missing void in parameter list */
	void main(void)
	{
	  myfunc();             /* myfunc still not prototyped */
	}
	
	void myfunc()    /* function definition doesn't need void */
	{
	  printf("Hello\n");
	}
