---
layout: page
title: "Q61620: Internal Compiler Error '@(#)regMD.c:1.100' Line 3837"
permalink: /pubs/pc/reference/microsoft/kb/Q61620/
---

	Article: Q61620
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 29-MAY-1990
	
	The following sample code produces an internal compiler error when
	compiled with /Oie (intrinsic AND global register allocation) options
	under large and compact memory models:
	
	   prog.c(17) : fatal error C1001: Internal Compiler Error
	                (compiler file '@(#)regMD.c:1.00', line 3837)
	                Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	unsigned x[4];
	int *y;
	int z;
	
	void f1(void)
	{
	}
	
	// #pragma function(memcpy)  This is one workaround.
	// #pragma optimize("e", off)  This is another.
	// #pragma optimize("i", off)  This is a third.
	
	void f2(void)
	{
	   int i;
	
	   for(i=0;i<4;i++)
	      if(i<x[1])
	         memcpy(&z,&(y[i]),2);
	}
	// #pragma intrinsic(memcpy) Turn intrinsics back on.
	// #pragma optimize("e", on) Turn global register allocation back on.
	// #pragma optimize("i", on) Turn intrinsics back on.
	
	Placing the #pragma function(memcpy) in the code causes the compiler
	to generate a function call to memcpy rather than to make it
	intrinsic. Using the optimize pragma turns off the offending
	optimization for that section of code. Since both /Oi and /Oe are
	needed to cause the error, either pragma will work around the problem.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
