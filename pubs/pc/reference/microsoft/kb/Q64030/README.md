---
layout: page
title: "Q64030: Internal Compiler Error: '@(#)newcode.c:1.87', Line 604"
permalink: /pubs/pc/reference/microsoft/kb/Q64030/
---

## Q64030: Internal Compiler Error: '@(#)newcode.c:1.87', Line 604

	Article: Q64030
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 25-JUL-1990
	
	If sample code below is compiled in large or compact memory model with
	any optimizations except /Od, /Oa, or /Ow, the compiler will fail with
	the following error message:
	
	   fatal error C1001: Internal Compiler Error
	    (compiler file '@(#)newcode.c:1.87', line 604)
	    Contact Microsoft Product Support Services
	
	If the code is compiled with /Oa or /Ow, the following error message
	will be generated:
	
	   fatal error C1001: Internal Compiler Error
	    (compiler file '@(#)regMD.c:1.100', line 1017)
	    Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	#include <ctype.h>
	#define OFFSET 2
	#define NEXTFP(nextfp,fp) \
	        nextfp = (long) fp & 0xffff0000;\
	        nextfp = nextfp + * fp + *(fp+1) * 0x100;
	
	static unsigned char * stk_bottom;
	static long first_fp;
	
	void main (void) {}
	
	void chkstkinit()
	{
	   unsigned char stk_top;
	   static long nextfp;
	   static unsigned char *fp;
	
	   stk_top = 0xaa;
	   fp = &stk_top + OFFSET;
	   NEXTFP(nextfp, fp);
	   stk_bottom = (unsigned char *)nextfp;   // Error on This line
	   first_fp = *stk_bottom + *(stk_bottom +1) * 0x100;
	
	   return;
	}
	
	Since these errors occur if any optimization is turned on, compiling
	with the /Od optimization switch or using the new optimize pragma to
	turn off all optimizations is the easiest solution.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
