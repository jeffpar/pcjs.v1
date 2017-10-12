---
layout: page
title: "Q69289: C1001: Internal Compiler Error: exphelp.c, Line 617"
permalink: /pubs/pc/reference/microsoft/kb/Q69289/
---

	Article: Q69289
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 25-FEB-1991
	
	The Microsoft C Compiler versions 6.00 and 6.00a produce the following
	internal compiler error when the sample program below is compiled with
	default optimization and large memory model (/AL):
	
	   mem2.c(4) : fatal error C1001: Internal Compiler Error
	               (compiler file '@(#)exphelp.c:1.117', line 617)
	               Contact Microsoft Product Support Services
	
	The above error occurs only when using any one of the optimizations
	/Oi, /Oa, /Oc, /On, /Op, /Or, /Os, /Ot, /Ow, /Oz, or using default
	optimizations. Furthermore, the source must be compiled in compact,
	large, or huge memory models.
	
	To work around the problem, compile without using default
	optimizations or any of the above mentioned options. You may elect to
	disable optimizations for the function that is producing the error. Do
	this by using the "optimize" pragma. Another valid workaround is to
	compile using the /qc (Quick Compile) option, which also does not
	produce the error.
	
	Sample Code
	-----------
	
	/* Compile with /AL */
	
	void func(int *memoryPtr,unsigned long pageLow)
	{
	    if ((*memoryPtr)>0)
	      pageLow=(unsigned long)memoryPtr>>28;
	}
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
