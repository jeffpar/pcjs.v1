---
layout: page
title: "Q44077: Internal Compiler Error: grammar.c:1.29, Line 108"
permalink: /pubs/pc/reference/microsoft/kb/Q44077/
---

	Article: Q44077
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10 s_quickc
	Last Modified: 26-JAN-1990
	
	The program below causes the Microsoft C 5.10 Optimizing Compiler to
	produce the following error:
	
	   foo.c(10) : fatal error C1001: Internal Compiler Error
	        (compiler file '@(#)grammar.c:1.29', line 108)
	        Contact Microsoft Technical Support
	
	This error also may be caused by using either graphics function
	_moveto_w or _lineto_w when compiling with QuickC 2.00 header files
	such as graph.h. In this case, the error is a result of the expression
	resulting from the expansion of the _moveto_w and _lineto_w macros, or
	several other window macros. An example of this is TURTLE.C and
	WINDOW.C from the GRDEMO sample program that comes with QuickC 2.00.
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information here as it
	becomes available.
	
	The following program causes the internal compiler error:
	
	struct ice
	{
	     short x, y;
	};
	
	struct ice think(double);
	void Just(struct ice);
	
	void main(void)
	{
	    Just(think(6.00));
	}
	
	In the sample program above, the error can be worked around by
	changing the structure ice to the following:
	
	struct ice
	{
	     short x,y;
	     int fudge_factor;
	};
