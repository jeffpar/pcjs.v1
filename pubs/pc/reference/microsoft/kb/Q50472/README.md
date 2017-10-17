---
layout: page
title: "Q50472: With /CP:1, _memavl() Still Shows Memory Available"
permalink: /pubs/pc/reference/microsoft/kb/Q50472/
---

## Q50472: With /CP:1, _memavl() Still Shows Memory Available

	Article: Q50472
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC S_LINK
	Last Modified: 30-NOV-1989
	
	Using the /CP:1 (/CPARMAXALLOC - set maximum memory allocation) link
	option does not always leave 1 byte available for allocation in the
	near heap allocation. This becomes apparent when making a call to
	_memavl().
	
	Code Example
	------------
	
	/* test.c */
	
	#include <malloc.h>
	#include <stdio.h>
	
	void main(void)
	{
	     /* _amblksiz=1; */
	     /* The above line uncommented will cause only a couple
	        bytes to become available (see More Information:). */
	     printf("Available memory in near heap = %d\n",
	            _memavl());
	}
	
	/* The following options were used to create the program:
	
	   cl /c test.c
	   link /CP:1 test
	
	   This program will show approximately 4K available when
	executed. */
	
	What happens is that _memavl() itself is causing the near heap to
	grow. The library functions _memavl, _freect, and _memmax all require
	the heap to be initialized for them to work. If the heap is not
	initialized then a malloc(0) call is made. The malloc call causes
	DGROUP to grow to the next _amblksiz boundary (8K by default). This
	usually does not cause a problem because malloc is usually called
	either before or after the _memavl.
	
	To reduce the amount of memory taken by DGROUP initialization, set
	_amblksiz to some smaller amount in order for malloc(0) to grab only
	as much it absolutely needs.
