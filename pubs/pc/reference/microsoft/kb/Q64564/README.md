---
layout: page
title: "Q64564: Internal Compiler Error: '@(#)regMD.c:1.100' Line 929"
permalink: /pubs/pc/reference/microsoft/kb/Q64564/
---

	Article: Q64564
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	The code below, when compiled using Microsoft C 6.00, produces the
	following error:
	
	   foo.c(15) : fatal error C1001: Internal Compiler Error
	               (compiler file '@(#)regMD.c:1.100', line 929)
	               Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	// Compile using 'cl -Od':
	
	#define Rev(x)  ( ( (x) >> 24 ) | \
	                  ( ( (x) & 0xff0000 ) >> 8 ) | \
	                  ( ( (x) & 0x00ff00 ) << 8 ) | \
	                  ( (x) << 24) )
	
	#define Get(x,y) \
	    (((x) == 183) ? (y) : Rev(y))
	
	void main (void)
	{
	   long l;
	   long *pl;
	   int Order;
	
	   l = Get(Order,*pl);  // This line causes the error.
	}
	
	The workaround for this problem is to either compile using the "-qc"
	option or to simplify the expression.
	
	One way of simplifying the above nested macro expression is to call
	each macro separately. For instance, the following is a feasible
	workaround:
	
	1. Redefine the Get macro as follows:
	
	      #define Get(x,y,z) \
	          ((((x) == 183) ? (y) : (z))
	
	2. Then for every call to the Get macro, use the following two
	   statements:
	
	      temp = Rev(x);
	      l = Get(Order,*pl,temp);
	
	Microsoft has confirmed this to be a problem with the C Compiler
	version 6.00. We are researching this problem and will post new
	information here as it becomes available.
