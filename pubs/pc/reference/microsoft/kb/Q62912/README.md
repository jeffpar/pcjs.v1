---
layout: page
title: "Q62912: Bad Code Generated for Difference Between Huge Pointers"
permalink: /pubs/pc/reference/microsoft/kb/Q62912/
---

## Q62912: Bad Code Generated for Difference Between Huge Pointers

	Article: Q62912
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 13-JUN-1990
	
	The following code demonstrates a case in which the C Compiler version
	6.00 generates incorrect results when calculating the difference
	between two huge pointers.
	
	Note that the pointer must address an array element inside of a
	structure for this problem to occur. Changing the types of the array
	elements, etc., does not solve the problem.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	struct s_type {
	            int ary[2]; /* Note: MUST point to array element inside
	                                                     struct */
	            int l;
	       } s, *sptr;
	
	int * lptr1;
	long long2;
	
	void main ( void )
	{
	    sptr = &s;
	    printf ( " &(sptr->ary[1]) is at %p\n", &(sptr->ary[1]) ) ;
	
	    lptr1 = & ( sptr -> ary[1] ) ;
	    printf ( "lptr1 is at %p\n\n", lptr1 ) ;
	
	    long2 =  lptr1 - &(sptr->ary[1]) ;  /* This should be 0 */
	    printf ( "difference is %ld bytes\n", long2 ) ;
	
	}
	
	Compile the above program with the following:
	
	   cl /AH /W4 /Od test.c
	
	When you run the program, the first two addresses should be the same
	because they are pointing to the same location. The third printf()
	should return 0 (zero) bytes. However, under a huge model, you will
	get an incorrect return value.
	
	One workaround is to use the quick compiler (/qc option), as follows:
	
	   cl /qc /AH /W4 /Od test.c
	
	This will generate the correct code.
	
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
