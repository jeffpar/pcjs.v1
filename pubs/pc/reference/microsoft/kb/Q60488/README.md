---
layout: page
title: "Q60488: Apparent Failure of _memavl() Caused by printf() Allocation"
permalink: /pubs/pc/reference/microsoft/kb/Q60488/
---

	Article: Q60488
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER|
	Last Modified: 15-APR-1990
	
	The printf() statement makes a call to malloc() the first time it is
	called within a program. Due to this allocation, _memavl() may seem to
	return an incorrect value in some cases.
	
	If a call to _memavl() is made within or before the first printf()
	statement in a program, subsequent malloc() calls cannot allocate as
	much memory as _memavl() suggests.
	
	The workaround is to make the call to printf() before your call to
	_memavl(), or make another call to _memavl() after printf() to
	determine your true maximum allocation.
	
	The following code demonstrates the problem:
	
	#include<malloc.h>
	#include<stdio.h>
	
	size_t mavl;
	char *ptr;
	
	void main(void)
	{
	// printf("If included, this line solves the problem.\n");
	
	   printf("memory available=%u \n",mavl=_memavl());
	
	   if ((ptr=(char *)malloc(mavl))==NULL)
	     printf("Not as much memory available as we thought!");
	}
