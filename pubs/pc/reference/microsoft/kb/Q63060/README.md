---
layout: page
title: "Q63060: Internal Compiler Error: '@(#)newcode.c:1.87', Line 604"
permalink: /pubs/pc/reference/microsoft/kb/Q63060/
---

## Q63060: Internal Compiler Error: '@(#)newcode.c:1.87', Line 604

	Article: Q63060
	Version(s): 6.00   |  6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 25-JUL-1990
	
	The code example shown below generates the following error message:
	
	   fatal error C1001: Internal Compiler Error
	         (compiler file '@(#)newcode.c:1.87', line 604)
	         Contact Microsoft Product Support Services
	
	Code Example
	------------
	
	#define OFFSET 2
	#define NEXTFP(nextfp,fp) \
	     nextfp = (long) fp & 0xffff0000;\
	     nextfp = nextfp + * fp + *(fp+1) * 0x100;
	
	static unsigned char * stk_bottom;
	static long first_fp;
	
	void main (void)
	{}
	
	void chkstkinit()
	{
	   unsigned char stk_top;
	   static long nextfp;
	   static unsigned char *fp;
	
	   stk_top = 0xaa;
	   fp = &stk_top + OFFSET;
	   NEXTFP(nextfp, fp);
	   stk_bottom = (unsigned char *)nextfp;   // The error occurs here
	   first_fp = *stk_bottom + *(stk_bottom +1) * 0x100;
	
	   return;
	}
	
	This error was only observed in the large (/AL) or huge (/AH) memory
	model. Compiling using the /Od option or the #pragma optimize("",off)
	statement eliminates the error.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
