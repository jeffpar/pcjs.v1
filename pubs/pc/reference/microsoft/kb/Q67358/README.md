---
layout: page
title: "Q67358: C1001: Internal Compiler Error: regMD.c, Line 4688"
permalink: /pubs/pc/reference/microsoft/kb/Q67358/
---

## Q67358: C1001: Internal Compiler Error: regMD.c, Line 4688

	Article: Q67358
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 4-DEC-1990
	
	The sample code below produces the following internal compiler errors
	under different versions of the compiler. These problems occur when
	any of the following individual optimizations are used under the small
	and medium memory models:
	
	   /Oa /Oc /Oi /On /Op /Or /Os /Ot /Ow /Oz
	
	Under C 6.00a
	-------------
	
	   test.c(7) : fatal error C1001: Internal Compiler Error
	                   (compiler file '@(#)regMD.c:1.110', line 4688)
	                   Contact Microsoft Product Support Services
	
	Under C 6.00
	------------
	
	   test.c(7) : fatal error C1001: Internal Compiler Error
	                   (compiler file '@(#)regMD.c:1.100', line 4634)
	                   Contact Microsoft Product Support Services
	
	The following are four possible workarounds:
	
	1. Add one of the following optimizations:
	
	      /Od /Oe /Og /Ol /Ox
	
	2. Do not declare the structure variables of type register.
	
	3. Use an if-else statement instead of the ternary operator.
	
	4. Compile under the compact or large memory models.
	
	Sample Code
	-----------
	
	1:  void main(void)
	2:  {
	3:     register int *boo, *hoo;
	4:     int n;
	5:
	6:     boo=hoo;
	7:     n= *boo ? 1 / *boo : 1;
	8:  }
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
