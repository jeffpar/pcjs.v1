---
layout: page
title: "Q43061: Optimization Problem with SHIFTing and ANDing"
permalink: /pubs/pc/reference/microsoft/kb/Q43061/
---

	Article: Q43061
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 17-MAY-1989
	
	When compiled with CL, the default optimization setting (/Ot) will
	cause the following source code to produce erroneous results. The
	problem only appears if the value being shifted is a variable and the
	masking value is a constant. The number of bits to shift can be a
	constant or a variable. Other combinations of variables and constants
	are evaluated correctly by the compiler.
	
	Compiling with /Od solves the problem. Using temporary variables also
	produces the correct results.
	
	Microsoft has confirmed this to be a problem with Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
	
	Both of the expressions should evaluate to 0x0000, but when optimized,
	they evaluate to 0x0100.
	
	/*  Example of optimizing problem with SHIFTing and ANDing.
	 */
	#include <stdio.h>
	
	#define SHIFT 0x0002
	#define MASK  0x00FF
	
	void main( void )
	{
	    unsigned short usResult;
	    unsigned short usStart;
	    unsigned short usShift;
	
	    /*  With a variable, a constant, and another constant.  */
	    usStart = 0x0040;
	
	    /***  PROBLEM WITH FOLLOWING EXPRESSION!  ***/
	    usResult = (usStart << SHIFT) & MASK;
	    printf( "Result #1: %4.4X\n", usResult );
	
	    /*  With a variable, another variable, and a constant.  */
	    usStart = 0x0040;
	    usShift = SHIFT;
	
	    /***  PROBLEM WITH FOLLOWING EXPRESSION!  ***/
	    usResult = (usStart << usShift) & MASK;
	    printf( "Result #2: %4.4X\n", usResult );
	}
