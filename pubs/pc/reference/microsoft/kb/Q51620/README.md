---
layout: page
title: "Q51620: No Warning When Passing Long to Int Prototyped Function"
permalink: /pubs/pc/reference/microsoft/kb/Q51620/
---

	Article: Q51620
	Product: Microsoft C
	Version(s): 5.10   | 5.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 21-MAR-1990
	
	If you prototype a function to accept an integer, and then pass a long
	integer to the function, Microsoft C Version 5.01 and Microsoft QuickC
	Versions 1.00, 1.01, 2.00, and 2.01 fail to give a warning about the
	data conversion if the value being passed is between -65536 and
	+65535. Instead, the value is converted to a valid integer (between
	-32768 and 32767) and passed to the function, causing unexpected
	results.
	
	This is also a problem with the Microsoft QuickAssembler Version 2.01.
	
	The following code demonstrates this problem:
	
	#include <stdio.h>
	
	void func(int,int);
	
	void main(void)
	{
	     func(50000L,1L);    /* Can also pass in (long)50000,long(1)     */
	}                        /* and have no warnings.                    */
	                         /* Try changing to 100000, notice correct   */
	                         /* warning.                                 */
	void func(int a, int b)
	{
	     printf("a=%d  b=%d",a,b);
	}
	
	If you declare two long integers and pass them to func, as in the
	following, you receive a data conversion warning as expected:
	
	   long a=50000,b=1;
	   func(a,b);
