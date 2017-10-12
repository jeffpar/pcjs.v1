---
layout: page
title: "Q51472: Shift Left Assignment Operator &quot;&lt;&lt;=&quot; Does Not Work Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q51472/
---

	Article: Q51472
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC S_QUICKASM buglist2.00 buglist2.01
	Last Modified: 17-JAN-1990
	
	The shift left assignment operator, "<<=", does not operate correctly
	on variables that are not in the default data segment in the small and
	medium memory models.
	
	The following code reproduces the problem:
	
	#include<stdio.h>
	
	/* must be compiled in small or medium memory model */
	
	/* variables must be declared global so that "far"  */
	/* modifier will not be ignored                     */
	
	int a = 1;           /*  int "a" will be in default data segment */
	int far b = 1;       /*  int "b" declared "far" in far segment   */
	
	void main( void )
	{
	   a <<= 4;          /*  left shift 4 of 1 should be 16          */
	   b <<= 4;          /*  this operation causes bad value         */
	   /*  output results  */
	   printf( "A: %d (should be 16)\nB: %d (should be 16)\n", a, b );
	}
	
	Output:
	
	A: 16 (should be 16)
	B: 1 (should be 16)
	
	The reason that the bad value is returned is that the left shift
	operation always assumes a near pointer in the small and medium memory
	models, i.e., only an OFFSET value. When performed on a far value, the
	address of that value is truncated to be only an OFFSET instead of
	SEGMENT:OFFSET, and the segment becomes the default data segment. The
	resulting pointer points to an unpredictable point in that data
	segment, and the operation is carried out there instead of on the
	intended value. In the large and compact memory models, the shift
	operation performs as desired.
	
	To work around the problem, the program should be recompiled in the
	large or compact memory model, or the left shift operation should be
	rewritten as follows:
	
	   b = b << 4;
	
	Microsoft has confirmed this to be a problem with the QuickC compiler
	Versions 2.00 and 2.01. We are researching this problem and will post
	new information here as it becomes available.
