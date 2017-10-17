---
layout: page
title: "Q68073: C1001: Internal Compiler Error: mactab.c:1.70, Line 482"
permalink: /pubs/pc/reference/microsoft/kb/Q68073/
---

## Q68073: C1001: Internal Compiler Error: mactab.c:1.70, Line 482

	Article: Q68073
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 6-FEB-1991
	
	The sample code below produces the following internal compiler error
	when compiled with both the /Ol and /Oe optimizations. This error
	occurs when compiled under the compact and large memory models of C
	6.00a and under all memory models except the huge model of C 6.00.
	
	   test.c(9) : fatal error C1001: Internal Compiler Error
	                  (compiler file '@(#)mactab.c:1.70', line 482)
	                   Contact Microsoft Product Support Services
	
	Disabling either of the offending optimizations will correct this
	error.
	
	Microsoft has confirmed this to be a problem in Microsoft C version
	6.00 and 6.00a. We are researching this problem and will post new
	information here as it becomes available.
	
	Sample Code
	-----------
	
	void goo(int);
	
	void foo(void)
	{
	   int high, low=0, mid, len, * word;
	
	   while (mid)
	   {
	      mid=low+high;
	      len=word[mid+1]-word[mid];
	      if(len) while(mid) goo(len);
	      else low=5 ;
	   }
	}
