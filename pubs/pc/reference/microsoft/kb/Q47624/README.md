---
layout: page
title: "Q47624: CodeView Cannot Trace into Single-Line Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q47624/
---

	Article: Q47624
	Product: Microsoft C
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 15-SEP-1989
	
	CodeView Versions 2.20 and 2.30 do not trace into a function that is
	contained in a single line of code. For example, if the following
	program is compiled and loaded into CodeView, an attempt to trace into
	the function funct() results in the trace stepping over the function,
	rather than tracing into it.
	
	Sample Program
	--------------
	
	/* SIMPLE.C ... a very simplistic sample program                    */
	
	int funct(void);
	int x;
	
	void main(void)
	{
	  x = funct()
	 }
	
	/* single-line function. It does nothing more than return a value.  */
	
	int funct(void){return 1;}
	
	If the above function is modified so that it performs exactly the same
	task but is located on multiple lines, as follows, then CodeView
	handles it correctly:
	
	int funct(void)
	 {
	   return 1;
	  }
