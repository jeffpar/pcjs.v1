---
layout: page
title: "Q66429: R6000 -- Stack Overflow at Compile Time with C Compiler"
permalink: /pubs/pc/reference/microsoft/kb/Q66429/
---

## Q66429: R6000 -- Stack Overflow at Compile Time with C Compiler

	Article: Q66429
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 9-NOV-1990
	
	The code sample below produces the following run-time error on
	compilation under the small and medium memory models with only the
	following individual optimizations:
	
	   /Oa /Oc /Oi /On /Op /Or /Os /Ot /Ow /Oz
	
	Run-Time Error
	--------------
	
	   run-time error R6000
	   - stack overflow
	
	If only the above optimizations, including the defaults, are used to
	compile the program, the run-time error will occur. However, if one of
	the following optimizations is added, the run-time error will not
	occur:
	
	   /Od /Oe /Og /Ol /Ox
	
	In addition, the following are two additional workarounds that can be
	applied to the code itself:
	
	1. Do not use the register storage class for the structure pointer.
	
	2. Use an if-else statement instead of the ternary operator.
	
	Sample Code
	-----------
	
	void main(void)
	{
	        struct foo {
	                   int i;
	                   };
	        int n;
	
	        struct foo *goo;
	        register struct foo *moo;
	
	        moo=goo;
	        n = moo->i ? moo->i :10000;
	}
	
	Microsoft has confirmed this to be a problem in the C compiler
	versions 6.00 and 6.00a. We are researching this problem and will post
	new information here as it becomes available.
