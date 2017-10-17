---
layout: page
title: "Q63055: qsort() Compare Routine Must Have Equal Case Under C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q63055/
---

## Q63055: qsort() Compare Routine Must Have Equal Case Under C 6.00

	Article: Q63055
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 25-JUL-1990
	
	When writing a compare routine for use with the qsort() function
	provided in Microsoft C version 6.00, provision must be made to return
	0 (zero) if the two elements passed to the routine are identical. This
	is necessary even if it is that all elements of the array passed to
	qsort are different.
	
	The documentation on qsort() given in the online help specifies that
	the compare routine should return 0 in the case of equality. However,
	under earlier versions of Microsoft C, a routine will work without
	this equality clause provided no two elements of the array are equal.
	
	Under Microsoft C version 6.00, the qsort() function will actually
	pass the same address as both parameters to the compare routine during
	the execution of its sorting algorithm. If 0 (zero) is not returned in
	this case, it will cause qsort() to try and rearrange the two array
	elements that were passed. Since both elements were the same address,
	qsort() breaks down at this point causing spurious and often
	disastrous consequences. The following code, which compiles and runs
	correctly under Microsoft C version 5.10, demonstrates the
	differences.
	
	Sample Code
	-----------
	
	#include<stdio.h>
	#include<stdlib.h>
	#include<search.h>
	
	int arname[10]={ 10,9,8,7,6,5,4,3,2,1 };
	
	void main(void)
	{
	    qsort(arname,10,sizeof(int),cmpr);
	    printf("%d - %d",arname[0],arname[9]);
	}
	
	int cmpr(int *p,int *q)
	{
	    if (*p<*q) return(-1);
	    else return(1);
	}
