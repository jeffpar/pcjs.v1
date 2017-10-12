---
layout: page
title: "Q43000: Passing Two-Dimensional Arrays between C and FORTRAN"
permalink: /pubs/pc/reference/microsoft/kb/Q43000/
---

	Article: Q43000
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | H_FORTRAN
	Last Modified: 18-MAY-1989
	
	When passing two-dimensional arrays from FORTRAN to C and vice versa,
	it is important to note that the indexing conventions for the two
	languages are different.
	
	C arrays are indexed row followed by column; or, the second index
	varies the quickest. However, FORTRAN is indexed just the opposite: in
	FORTRAN, two-dimensional arrays are indexed with the first indice
	varying the quickest. Thus, passing two-dimensioned arrays requires
	modification to either the C code or the FORTRAN code.
	
	For more information regarding passing arrays between C and FORTRAN,
	please see Page 127, Section 9.1.2, "Array Declaration and Indexing,"
	in the "Microsoft Mixed-Language Programming Guide for the MS-DOS
	Operating System."
	
	The following code samples define an array in a common block in
	FORTRAN, then use C to print the arrays to the screen:
	
	c     program mix_for.for
	c
	c
	c     this is to be used with mix_c.c......
	c
	      subroutine test ()
	      common/cblock/array(0:8,0:1)
	      integer*4 i,j
	
	      do 20 i = 0,8,1
	        do 30 j = 0,1,1
	        array(i,j) = i
	      write(6,*)'the value of (',i,':',j,') is ',array(i,j)
	  30  continue
	  20  continue
	      end
	
	/*  program mix_c.c
	
	    this program is to be used with  mix_for.for......
	    */
	
	#include <stdio.h>
	
	struct common_blk{
	                 float array[2][9]; /* note that the subscripts
	                                        of the array are inverted */
	                 };
	
	extern void fortran test (void);
	
	extern struct common_blk fortran cblock;
	
	main()
	{
	    int i,j;
	    test();
	    for(i=0;i<=8;i++)
	        for(j=0;j<=1;j++)
	            printf("\nthe value of %d:%d is %f"
	                          ,i,j,cblock.array[j][i]);
	}
