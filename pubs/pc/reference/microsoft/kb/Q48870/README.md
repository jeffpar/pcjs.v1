---
layout: page
title: "Q48870: Difference between Huge Pointers Is Incorrect in QuickC 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q48870/
---

## Q48870: Difference between Huge Pointers Is Incorrect in QuickC 2.00

	Article: Q48870
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickAsm 2.01 S_C buglist2.00
	Last Modified: 10-OCT-1989
	
	Taking the difference of two pointers should return the number of
	elements between the two pointers. Using huge pointers, this should
	also work correctly across a segment boundary. However, QuickC fails
	to return the proper value. A simple workaround, and the code that
	fails, is shown below. Note that the suggested workaround works
	properly only under DOS, but finds the distance (defined as the number
	of elements) between any two far pointers, and uses long arithmetic
	instead of signed integer arithmetic.
	
	Code Example
	------------
	
	/*
	  Finds the number of elements between far pointers under DOS.
	*/
	
	#include <stdio.h>
	#include <malloc.h>
	#include <stdlib.h>
	#include <dos.h>
	
	/*  define the type of the pointers (long is a 4 byte type) */
	typedef long ELTYPE ;
	
	void main( void )
	{
	   ELTYPE huge *beginptr, huge *endptr;
	   long  count = 20000L;
	   long  x, tmp ;
	
	         /* Allocate huge buffer. */
	   beginptr = (ELTYPE huge *)halloc( count, sizeof( ELTYPE ) );
	   if( beginptr == NULL )
	         {
	                  printf( "Insufficient memory" );
	                  exit( 1 );
	         }
	
	         /* Fill the buffer with characters. */
	   for( endptr = beginptr; count; count--, endptr++ )
	      *endptr = (char)count % 255 ;
	
	   /**************************************************************
	   *
	   * This method is inaccurate in QuickC 2.00 and QuickC 2.01
	   * and should NOT be used. Use the method below for these
	   * compilers and for calculating the difference between pointers
	   * when a signed integer may be unable to hold the result.
	   *
	   **************************************************************/
	
	   /* Find the difference (in elements) between two pointers using
	      signed integer arithmetic. This arithmetic is incorrect under
	      QuickC 2.00, and is not valid in cases where the difference
	      exceeds 32,767 (the maximum for a signed integer).
	   */
	
	   x = (long) (endptr - beginptr) ;
	
	   printf("beginning pointer = %p\n", beginptr) ;
	   printf("ending pointer    = %p\n", endptr) ;
	
	   printf("endptr - beginptr (hex) is: %lX\n", x) ;
	   printf("endptr - beginptr (dec) is: %ld\n", x) ;
	
	   /***************************************************************
	   *
	   *  This is the correct method, and is accurate to find
	   *  differences up to 2,147,483,648 (signed long integer).
	   *
	   ***************************************************************/
	
	   /* Find the differences (in elements) between two pointers using
	      long arithmetic, not relying on pointer arithmetic, which is
	      done using signed integers. This could be put into a macro,
	      and is valid only under DOS (where segments are contiguous.
	   */
	
	   tmp = (long) (((((long) FP_SEG(endptr))<<4)+FP_OFF(endptr)) -
	                 ((((long) FP_SEG(beginptr))<<4)+FP_OFF(beginptr))) ;
	
	   printf("beginning pointer = %p\n", beginptr) ;
	   printf("ending pointer    = %p\n", endptr) ;
	
	   printf("endptr - beginptr (hex) is: %lX\n", tmp/sizeof(ELTYPE)) ;
	   printf("endptr - beginptr (dec) is: %ld\n", tmp/sizeof(ELTYPE)) ;
	
	   /* Free huge buffer. */
	   hfree( beginptr );
	         exit( 0 );
	}
	
	Microsoft has confirmed this to be a problem with QuickC Version 2.00.
	We are researching this problem and will post new information as it
	becomes available.
