---
layout: page
title: "Q44755: Long Arithmetic Incorrect in Certain Circumstances in QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q44755/
---

	Article: Q44755
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 26-SEP-1989
	
	QuickC Version 2.00 produces incorrect code for the subtraction and
	addition of long integers in some cases. One of the following set of
	conditions must be met for this problem to occur (these conditions
	apply to subtraction, but can be applied to the case of addition):
	
	1. The first set of conditions is as follows:
	
	   a. The subtrahend is an element of an array of long ints.
	
	   b. The array is defined locally.
	
	   c. The subtrahend index is not a constant.
	
	   d. The expected difference is less than zero.
	
	2. The second set of conditions is as follows:
	
	   a. The subtrahend is being accessed through a pointer (either
	      global or local).
	
	   b. The expected difference is less than zero.
	
	To work around this problem, do one of the following:
	
	1. In the case of an array, make the array global, i.e., define it
	   outside the body of any function.
	
	2. In the case of a pointer or array, eliminate the indirection in
	   the expression.
	
	3. Disable pointer checking. This may be accomplished in the
	   integrated environment with the following menu sequence:
	
	       Options, Make, Compiler, Flag, Pointer Check
	
	   When using QCL, do not use the /Zr switch.
	
	This problem occurs with code generated both in the integrated
	environment and by the command-line compiler QCL. The following
	program demonstrates this behavior:
	
	#include <stdio.h>
	#include <malloc.h>
	
	long int     *p;
	
	void main( void )
	{
	    int      SubtrahendIndex = 0;
	    long int array[1],
	             diff;
	
	    /* Bad case 1 */
	    array[0] = 10L;
	    diff = 5L - array[SubtrahendIndex];
	    printf( "diff=%ld\n", diff );
	
	    /* Bad case 2 */
	    p = (long int *)malloc( sizeof( long int ) );
	    *p = 10L;
	    diff = 5L - *p;
	    printf( "diff=%ld\n", diff );
	}
	
	The problem occurs when pointer check is enabled because the check is
	being performed in between accessing the MSW and LSW of the
	subtrahend, which clears the carry flag. The subsequent SBB
	instruction, which relies on the state of the carry flag to correctly
	borrow, is then inaccurate in the case of a negative result. Disabling
	pointer checking eliminates this problem.
	
	Microsoft has confirmed this to be a problem with QuickC Version 2.00.
	We are researching this problem and will post new information as it
	becomes available.
